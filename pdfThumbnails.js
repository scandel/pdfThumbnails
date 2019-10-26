/**
 * Find all img elements with data-pdf-thumbnail-file attribute,
 * then load pdf file given in the attribute,
 * then use pdf.js to draw the first page on a canvas, 
 * then convert it to base64,
 * then set it as the img src.
 */
var createPDFThumbnails = function(){

    var worker = null;
    var loaded = false;
    var renderQueue = [];

    // select all img elements with data-pdf-thumbnail-file attribute
    var nodesArray = Array.prototype.slice.call(document.querySelectorAll('img[data-pdf-thumbnail-file]'));

    if (!nodesArray.length) {
        // No PDF found, don't load PDF.js
        return;
    }

    if (!loaded && typeof(pdfjsLib) === 'undefined') {
        var src = document.querySelector('script[data-pdfjs-src]').getAttribute('data-pdfjs-src');

        if (!src) {
            throw Error('PDF.js URL not set in "data-pdfjs-src" attribute: cannot load PDF.js');
        }

        var script = document.createElement('script');
        script.src = src;
        document.head.appendChild(script).onload = renderThumbnails;
        loaded = true;
    }
    else {
        renderThumbnails();
    }

    function renderThumbnails() {
        if (!pdfjsLib) {
            throw Error("pdf.js failed to load. Check data-pdfjs-src attribute.");
        }

        nodesArray.forEach(function(element) {
            if (null === worker) {
                worker = new pdfjsLib.PDFWorker();
            }

            var filePath = element.getAttribute('data-pdf-thumbnail-file');
            var imgWidth = element.getAttribute('data-pdf-thumbnail-width');
            var imgHeight = element.getAttribute('data-pdf-thumbnail-height');

            pdfjsLib.getDocument({url: filePath, worker: worker}).promise.then(function (pdf) {
                pdf.getPage(1).then(function (page) {
                    var canvas = document.createElement("canvas");
                    var viewport = page.getViewport({scale: 1.0});
                    var context = canvas.getContext('2d');

                    if (imgWidth) {
                        viewport = page.getViewport({scale: imgWidth / viewport.width});
                    } else if (imgHeight) {
                        viewport = page.getViewport({scale: imgHeight / viewport.height});
                    }

                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise.then(function () {
                        element.src = canvas.toDataURL();
                    });
                }).catch(function() {
                    console.log("pdfThumbnails error: could not open page 1 of document " + filePath + ". Not a pdf ?");
                });
            }).catch(function() {
                console.log("pdfThumbnails error: could not find or open document " + filePath + ". Not a pdf ?");
            });
        });
    }
};

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    createPDFThumbnails();
} else {
    document.addEventListener("DOMContentLoaded", createPDFThumbnails);
}
