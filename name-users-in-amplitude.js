// ==UserScript==
// @name         Amplitude named user profiles
// @namespace    https://jamesgreenblue.com/
// @version      0.1
// @description  Finds and replaces user profile names in Amplitude
// @author       James Greenhalgh, with significant contributions from an AI Assistant (Gemini)
// @match        *://app.amplitude.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var replaceArry = [
        [/user_cva3bbm9i077dn133b2h/gi, 'james.g'],
        [/user_cva4gge9i077spp33b3h/gi, 'joe.b'],
        [/user_cva64re9i078i0h33b41/gi, 'jane.d'],
        // Add more replacements here
    ];
    var numTerms = replaceArry.length;

    function replaceTextInNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let oldTxt = node.nodeValue;
            let newTxt = oldTxt;
            for (let i = 0; i < numTerms; i++) {
                newTxt = newTxt.replace(replaceArry[i][0], replaceArry[i][1]);
            }
            if (newTxt !== oldTxt) {
                node.nodeValue = newTxt;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes) {
            node.childNodes.forEach(replaceTextInNode);
        }
    }

    // Initial scan of the document
    replaceTextInNode(document.body);

    // Observe for future changes
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                    replaceTextInNode(node);
                }
            });
            // For text content changes within existing nodes
            if (mutation.type === 'characterData' && mutation.target.parentNode) {
                replaceTextInNode(mutation.target.parentNode);
            }
        });
    });

    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
})();