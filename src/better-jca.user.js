// ==UserScript==
// @name         Better JCA
// @namespace    http://mikebranski.com/
// @version      0.2.1
// @description  A better Jive Cloud Admin experience.
// @author       Mike Branski
// @match        https://cloud.jivesoftware.com/admin/portal.html
// @grant        none
// @homepage     https://github.com/mikebranski/userscripts
// @updateURL    https://github.com/mikebranski/userscripts/raw/master/src/better-jca.user.js
// ==/UserScript==

(function(window, undefined) {

    var instanceUrl,
        selectedOption;

    window.addEventListener('load', init);

    document.querySelector("#installation-dropdown").addEventListener("change", function() {
        // @todo: Clean this up. :D
        document.querySelector("#installation-section").removeChild(document.querySelector("#installation-section a"));
        setTimeout(init, 500);
    });

    function init() {

        if (!window.location.hash) {
            // No hash? We're on the home page and can get the instance's URL from here.
            // Conveniently accessible with its own ID.
            var el = document.querySelector("#current-installation-url");

            if (!el) {
                // UI not loaded yet; delaying.
                window.setTimeout(init, 100);
                return;
            }

            instanceUrl = el.innerHTML.trim();

            enhanceUI();
        } else {
            // The problem: being requested via an http request, the JS won't load, meaning we won't be able to get the URL anyway.
            // The solution: load the homepage into an iframe, wait a sec, and grab the instance URL from there.
            //
            // For now, do nothing. Require hitting the homepage first. Then, build in support for the other pages if possible.

            console.log("Better JCA currently only works if you hit the homepage first; refreshing breaks the cached URL value.");
            console.log(window.location.href.replace(window.location.hash, ""));
        }
    }

    function enhanceUI() {
        markCurrentInstanceAsSelected();
        addInstanceInfoToNavigation();
    }

    function markCurrentInstanceAsSelected() {
        var label;

        label = document.querySelector("#installation-name").innerHTML.trim();

        selectedOption = document.querySelector("#installation-dropdown option[data-url='" + instanceUrl + "']");

        if (!selectedOption) {
            return false;
        }

        selectedOption.selected = true;
    }

    function addInstanceInfoToNavigation() {
        var targetContainer,
            instanceURLElement;

        targetContainer = document.querySelector("#installation-section");

        if (!targetContainer) {
            return false;
        }

        instanceUrlLink = document.createElement("a");

        instanceUrlLink.href = instanceUrl;
        instanceUrlLink.innerHTML = instanceUrl.split("://").pop() + " (" + selectedOption.dataset.role.toLowerCase() + ")";
        instanceUrlLink.target = "_blank";

        instanceUrlLink.style.color = "#ffffff";
        instanceUrlLink.style.marginLeft = "1em";

        targetContainer.appendChild(instanceUrlLink);
    }

})(window);
