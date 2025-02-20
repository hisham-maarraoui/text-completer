export default getCursorPosition = (element) => {
    const rect = element.getBoundingClientRect(); // Get position of element in viewport
    const computedStyle = window.getComputedStyle(element); // Get all the CSS styles of the element
    
    const scrollLeft = window.scrollX;
    const scrollTop = window.scrollY;

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      const caretOffset = element.selectionStart || 0;
      const textBeforeCaret = element.value.substring(0, caretOffset);
      
      // Create a temporary element to measure text width
      const temp = document.createElement('span');
      temp.style.font = computedStyle.font;
      temp.style.visibility = 'hidden';
      temp.style.position = 'absolute';
      temp.textContent = textBeforeCaret;
      document.body.appendChild(temp);
      
      const textWidth = temp.getBoundingClientRect().width;
      document.body.removeChild(temp);

      return {
        x: rect.left + textWidth + parseInt(computedStyle.paddingLeft) + scrollLeft + 10,
        y: rect.top + parseInt(computedStyle.paddingTop) + scrollTop
      };
    }
  }
