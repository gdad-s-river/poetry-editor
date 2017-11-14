<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/jkyjXjTsfTfa8V6wYfHTxevQ/gdad-s-river/poetry-editor'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/jkyjXjTsfTfa8V6wYfHTxevQ/gdad-s-river/poetry-editor.svg' />
</a>


## Problem Being Solved

Poetry Editor is a desktop browser editor for writers, especially for instagram poets, who put poems on images and then post their work. If you want more functionalities thank what Mirakee, Yourquote and other otherwise awesome platforms give you, and if you are tired of false autocomplete suggestions, false positives on swipe keyboard or your thumbs go numb while typing on a mobile phone. This editor is for you 💛💛💛

If you want to see the updated development version in action [watch this screencast video](goo.gl/Cgcid6)

## Dev Things

Ejected (too soon, wasn't really needed) Create React App, app. The code is mostly in `App.js` file right now. It's not much it's getting there.

## The idea, behind the idea:

[DraftJS](draftjs.org) : Rich Editor Framework, I use it to provide some functionalities which most of the poetry / writing apps out there don't provide (see the video above to see some of them in action).

[Somehow](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Drawing_DOM_objects_into_a_canvas) copy the html that comes out of draftjs and paste it on canvas, all the styles gets copied ofcourse.

## Features in mind

`✅ = working`

1. Color selector for background of the canvas (✅), perhaps gradient and local image file support (+ cropping ) later
2. Bold, Italics, Underline (✅) [directly from default draftjs]. Strikethrough too I guess, I haven't checked.
3. Drag and Drop your text to put it where ever you want, so that you won't have to put multiple spaces just to shift the whole thing off an offset space. (✅)
4. Color selector for changing any selected text (✅)
5. Save image functionality, sharing on popular social media functionality
6. Instagram stories like range selector for seamlessly changing font size for selected text (like magic) (✅)
7. Different beautiful google fonts dropdown menu options.

## TODOS
1. Give a "base font size" option to the user
2. Give a "reset to base font size" option, so that user can get back to the base font, after changing it with the range selector
3. 
