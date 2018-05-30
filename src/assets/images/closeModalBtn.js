export default function({ strokeColor, width, height, strokeWidth }) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">

  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid meet" viewBox="-30 -30 640 640" width=${width} height=${height}>
  
  <defs>
    <path style="stroke: ${strokeColor};" stroke-width=${strokeWidth}
      d="M441.7 432.26L114.34 140.75" id="b1MPt7TdZh"></path>

    <path style="stroke: ${strokeColor}" stroke-width=${strokeWidth}
      d="M441.7 140.75L114.34 432.26" id="b16jbinRNJ"></path>
  </defs>
  
  <g><g>
    <g><g>
      <use xlink:href="#b1MPt7TdZh" opacity="1" fill-opacity="0" stroke="#000000" stroke-width="8" stroke-opacity="1">
      </use>
    </g></g>
    <g><g>
      <use xlink:href="#b16jbinRNJ" opacity="1" fill-opacity="0" stroke="#000000" stroke-width="8" stroke-opacity="1">
      </use>
    </g></g>
  </g></g>
  </svg>`;
}
