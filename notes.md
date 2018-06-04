image processing — https://github.com/nitin42/react-imgpro

## THINGS THAT ARE WRONG IN STATE RIGHT NOW —

1.  Right now I'm doing

```javascript
this.setCurrentColor(color);
addColor(color);
```

what I should be doing is, just do

```javascript
this.setCurrentColor(color);
```

and then do the `addColor(color)` thing as a side effect to state changed in the lifecycle method `componentDidUpdate`

2.  Take font state to its own unstated container

## QUICK TODOS

1.  React Select Headings (what does each one do headings text sorta)
