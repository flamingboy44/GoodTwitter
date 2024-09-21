"use strict";

const targetPage = "https://*.twitter.com/*";

const ua = "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) Waterfox/56.2 ";

function rewriteUserAgentHeader(e) {
    if (!e.url.startsWith("https://mobile.twitter.com")) {
        e.requestHeaders.forEach(function (header) {
            if (header.name.toLowerCase() === "user-agent") {
                header.value = ua;
            }else if (header.name.toLowerCase() ==="cookie") {
                header.value = header.value.replace(/rweb_optin=.*?(; .*)?$/i, "rweb_optin=off$1");
            }
        });
        return {requestHeaders: e.requestHeaders};
    }
}

function clearCache() {
    browser.browsingData.remove({"hostnames": ["twitter.com"]}, {"cache": true});
    browser.tabs.query({url: "*://*.twitter.com/*"}, function (result) {
        result.forEach(function (tab) {
            browser.tabs.reload(tab.id)
        })
    });
}

browser.webRequest.onBeforeSendHeaders.addListener(
    rewriteUserAgentHeader,
    {urls: [targetPage]},
    ["blocking", "requestHeaders"]
);


browser.runtime.onInstalled.addListener(clearCache);

(function() {
    'use strict';

    // Set the desired number
    var desiredNumber = "197M subscribers"; // Change this to your desired number

    // Function to change the value of the element displaying the subscriber count
    function changeSubscriberCount() {
        var elements = document.querySelectorAll('.yt-core-attributed-string');
        elements.forEach(function(element) {
            if (element.textContent.includes('subscribers')) {
                element.textContent = desiredNumber;
                console.log('Subscriber count changed to: ' + desiredNumber);
            } else {
                console.log('Element does not contain the text "Subscribers".');
            }
        });
    }

    // Call the function to change the subscriber count when the page is loaded
    changeSubscriberCount();

    // Use a MutationObserver to detect changes in the DOM and trigger the script
    var observer = new MutationObserver(function(mutations) {
        changeSubscriberCount();
    });

    // Configure the observer to watch for changes in the subtree of the body
    var observerConfig = { childList: true, subtree: true };

    // Start observing the DOM
    observer.observe(document.body, observerConfig);
})();
