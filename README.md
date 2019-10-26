# PDF Thumbnails

A small script to parse html files and generate a source image  for `img` elements 
with a `data-pdf-thumbnail-file` attribute linking to a pdf file.  
The image is a view of the first page of the pdf. The script relies on the [pdf.js](https://github.com/mozilla/pdf.js) library.
 
## Online demo

See a [PDF Thumbnails demo here](https://scandel.github.io/pdfThumbnails/).

## Getting started

First get a local copy of the code, clone it using git:
```bash
$ git clone git://github.com/scandel/pdfThumbnails
$ cd pdfThumbnails
```
Then get a local copy of pdf.js (>=2.0). Use the prebuilt version that you can find on [this page](https://mozilla.github.io/pdf.js/getting_started/).
Download and extract it. You only need to keep the `build` directory (with both `pdf.js` and `pdf.worker.js`). Make 
sure your directory structure looks like: 

```
    pdfThumbnails
    |--pdf.js
    |  |--build
    |     |--pdf.js
    |     |--pdf.worker.js
    |--pdfThumbnails.js
    |--index.html
    |--example.pdf
    |--pdf.png
    ...
```    

Now visit `index.html` in your browser, you should see the demo page with thumbnails of `example.pdf`. 

## Use it in your own project

You just need to keep the `pdfThumbnails.js` file from this project, and the `pdf.js` and `pdf.worker.js` files from pdf.js
(let them both in the same directory as pdf.js will try to load the worker). In your html file, include the javascripts:
```html
<script src="/path/to/pdfThumbnails.js" data-pdfjs-src="/path/to/pdf.js/build/pdf.js"></script>
```

The `data-pdfjs-src` attribute specifies the path of the library, which will only be loaded if there's any PDF thumbnail to display in the page.

To show a thumbnail, write an `img` element with a `data-pdf-thumbnail-file` attribute:
```html
<img data-pdf-thumbnail-file="/my/file.pdf">
``` 
The pdf file path is a relative or absolute path to a file hosted on your site (no cross domain request).

You can add a width _or_ a height in pixels for the generated image. If not, the size of the generated image will be 
the one of the pdf.
```html
<img data-pdf-thumbnail-file="/my/file.pdf" data-pdf-thumbnail-width="200">
<img data-pdf-thumbnail-file="/my/file.pdf" data-pdf-thumbnail-height="150">
```
You can also add a `src` attribute to the image, which will act as a placeholder:
```html
<img data-pdf-thumbnail-file="/my/file.pdf" src="pdf.png">
```  
This way: 
 * the image in `src` will be shown to the user during the loading and rendering time of the pdf, 
 and the space of the image will be filled when the page is shown to the user;
 * if an error occurs (file not found or impossible to open), the user will still see something.
  
Errors (file not found or wrong format) are logged in the console.
