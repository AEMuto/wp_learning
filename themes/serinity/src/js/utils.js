/**
 * Calculate the total width of elements including margins
 * @param {Array<HTMLElement>} elements - Array of DOM elements
 * @returns {number} Total width including margins
 */
export function calculateElementsWidth(elements) {
  return elements.reduce((width, element) => {
    const style = window.getComputedStyle(element);
    const marginLeft = parseFloat(style.marginLeft || "0");
    const marginRight = parseFloat(style.marginRight || "0");
    return width + element.offsetWidth + marginLeft + marginRight;
  }, 0);
}