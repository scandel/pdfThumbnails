/**
 * Find all img elements with data-pdf-thumbnail-file attribute,
 * then load pdf file given in the attribute,
 * then use pdf.js to draw the first page on a canvas, 
 * then convert it to base64,
 * then set it as the img src.
 */
var createPDFThumbnails = function(){

    if (typeof pdfjsLib === 'undefined') {
        throw Error("pdf.js is not loaded. Please include it before pdfThumbnails.js.");
    }
    pdfjsLib.disableWorker = true;

    // select all img elements with data-pdf-thumbnail-file attribute
    var nodesArray = Array.prototype.slice.call(document.querySelectorAll('img[data-pdf-thumbnail-file]'));

    nodesArray.forEach(function(element) {
        var filePath = element.getAttribute('data-pdf-thumbnail-file');
        var imgWidth = element.getAttribute('data-pdf-thumbnail-width');
        var imgHeight = element.getAttribute('data-pdf-thumbnail-height');

        pdfjsLib.getDocument(filePath).then(function (pdf) {
            pdf.getPage(1).then(function (page) {
                var canvas = document.createElement("canvas");
                var viewport = page.getViewport(1.0);
                var context = canvas.getContext('2d');

                if (imgWidth) {
                    viewport = page.getViewport(imgWidth / viewport.width);
                } else if (imgHeight) {
                    viewport = page.getViewport(imgHeight / viewport.height);
                }

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                page.render({
                    canvasContext: context,
                    viewport: viewport
                }).then(function () {
                    element.src = canvas.toDataURL();
                });
            }).catch(function() {
                console.log("pdfThumbnails error: could not open page 1 of document " + filePath + ". Not a pdf ?");
            });
        }).catch(function() {
            console.log("pdfThumbnails error: could not find or open document " + filePath + ". Not a pdf ?");
        });
    });
};

if (
    document.readyState === "complete" ||
    (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
    createPDFThumbnails();
} else {
    document.addEventListener("DOMContentLoaded", createPDFThumbnails);
}
