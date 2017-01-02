/**
 * Find all img elements with data-pdf-thumbnail-file attribute,
 * then load pdf file given in the attribute,
 * then use pdf.js to draw the first page on a canvas, 
 * then convert it to base64,
 * then set it as the img src.
 */
var createPDFThumbnails = function(){

    if (typeof PDFJS === 'undefined') {
        throw Error("pdf.js is not loaded. Please include it before pdfThumbnails.js.");
    }
    PDFJS.disableWorker = true;

    // select all img elements with data-pdf-thumbnail-file attribute
    var nodesArray = Array.prototype.slice.call(document.querySelectorAll('img[data-pdf-thumbnail-file]'));

    nodesArray.forEach(function(element) {
        var filePath = element.getAttribute('data-pdf-thumbnail-file');
        var imgWidth = element.getAttribute('data-pdf-thumbnail-width');
        var imgHeight = element.getAttribute('data-pdf-thumbnail-height');

        // Called on error to draw a red cross in place of the image
        var errorImage = function() {
            if (imgWidth && !imgHeight) {
                imgHeight = imgWidth * 0.75;
            } else if (imgHeight && !imgWidth) {
                imgWidth = imgHeight * 1.3333;
            } else if (!imgWidth && !imgHeight) {
                imgWidth = 500;
                imgHeight = 375;
            }
            var canvas = document.createElement("canvas");
            var context = canvas.getContext('2d');
            canvas.height = imgHeight;
            canvas.width = imgWidth;

            context.strokeStyle = '#cc0000';
            context.lineWidth = 10;
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(imgWidth, imgHeight);
            context.moveTo(imgWidth, 0);
            context.lineTo(0, imgHeight);
            context.stroke();
            context.beginPath();
            context.moveTo(0, 0);
            context.lineTo(imgWidth, 0);
            context.lineTo(imgWidth, imgHeight);
            context.lineTo(0, imgHeight);
            context.lineTo(0, 0);
            context.stroke();

            element.src = canvas.toDataURL();
        };

        PDFJS.getDocument(filePath).then(function (pdf) {
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
            }).catch(errorImage);
        }).catch(errorImage);
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
