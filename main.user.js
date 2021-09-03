// ==UserScript==
// @name         Coursera - helpful weighted average review (hwa)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hwa - helpful weighted average review for Coursera reviews
// @author       https://github.com/yuis-ice/
// @match        https://www.coursera.org/*
// @icon         https://www.google.com/s2/favicons?domain=coursera.org
// @grant        none
// @run-at       document-idle
// @noframes
// ==/UserScript==

if (document.location.href.match(/coursera.org\/.*\/reviews($|\?)/))
{
    // get helpful count array
    helpfuls = Array.from(document.body.querySelectorAll("span")).filter(a => a.textContent.match(/This is helpful/)).filter(a => a.children.length == 0).map(a => a.textContent.match(/\((\d+)\)/)[1]).map(a => Number(a ))

    // get review rate count array
    // reviews = Array.from(document.body.querySelectorAll('div.review.review-page-review')).map(a => Array.from(a.querySelectorAll('span > svg')).filter(a  => a.getAttribute("style").match(/rgb\(242/)).length)
    reviews = Array.from(document.body.querySelectorAll('div.review.review-page-review')).map(a => Array.from(a.querySelectorAll('span > svg')).filter(a  => a.getAttribute("aria-labelledby").match(/FilledStar/)).length)

    // conbine to an obj
    obj = reviews.map((v, i) => [v, helpfuls[i]])

    // compute helpful weighted average review
    hwa = ( obj.map(a => a[0] * a[1]).reduce((a, b) => a + b) / obj.map(a => a[1]).reduce((a, b) => a + b) ).toFixed(2)

    function __insert()
    {
        elem = document.querySelector('div.CourseReviewTitle div[data-track-app="reviews"]').parentElement.lastChild
        clone = elem.cloneNode(true)
        elem.after(clone)
        clone.textContent = "︎︎︎︎ ︎︎ ︎︎ ︎︎ ︎︎ ︎︎ ︎︎ ︎︎ ︎︎ ︎︎/ hwa (helpful weighted average) : " + hwa
        clone.id = "__hwa"
    }

    // overwrite the overwrites
    (async function()
    {
        const sleep = m => new Promise(r => setTimeout(r, m))
        await sleep(200) ;

        for (i = 0; i < 100 ; i++)
        {
            if (! document.querySelector("#__hwa")) __insert()
            await sleep(200) ;
        }
    })();

}
