React Color: https://casesandberg.github.io/react-color/ for canvas background selection

Draftjs to HTML: https://github.com/sstur/draft-js-utils

## About Putting DOM Elements on Canvas, important reads

[x] http://robert.ocallahan.org/2011/11/drawing-dom-content-to-canvas.html
[] https://github.com/cburgmer/rasterizeHTML.js


Utils for TODOS: 
[]: https://hashnode.com/post/draftjs-tip-getting-the-bounding-rect-of-a-content-block-in-draftjs-cj14vf9zo000vf353u5ckavby (for making mouse pointer while mousemove to contain center of the image, instead of top left corner (which is happening right now))


## TODOs: 
- []: Improve font rendering on canvas if it's possible
- []: maintain the newlines on canvas when the text is copy pasted
- []: Use localstorage to save the editor data to prevent accidental loss of the poem
- []: make canvas resizable by dragging the corners
- []: Think of a super lovely way to let users keep adding the font collection somehow.
- []: a keyboard shortcut (cltr + uparrow) to put focus on range selector button, so that subsequent cltr+up/down arrow helps people
change font size with their keyboard instead of using their mouses.
- []: Give a "base font size" option to the user and Give a "reset to base font size" option, so that user can get back to the base font, after changing it with the range selector



## Explore: 

- gradient text: https://css-tricks.com/snippets/css/gradient-text/
- dragging and dropping isn't smooth, explore why
- See the peformance section ( OffscreenCanvas ) api (canvas in a web worker)
- `draft-js-custom-styles` is astonishingly heavy dependency, find out why.

## Cool things I could do after
- This one is so cool, I how could I not think that, despite the face that I was doing the canvas foreignobject dom mapping!

- It's surprising that I didn't stumble upon surma's blog: http://dassur.ma/things/dom2texture/, while searching for howto DOM ➡️ Canvas mapping.

