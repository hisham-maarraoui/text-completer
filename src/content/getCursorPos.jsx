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

      const availableWidth = rect.width - (parseInt(computedStyle.paddingLeft) + parseInt(computedStyle.paddingRight));
    
      // If the text width exceeds available width, move suggestion to the next line
      if (textWidth + parseInt(computedStyle.paddingLeft) > availableWidth) {
        return {
          x: rect.left + parseInt(computedStyle.paddingLeft) + scrollLeft,
          y: rect.top + element.scrollHeight + parseInt(computedStyle.paddingTop) + scrollTop
        };
      } else {
        // Suggestion appears on the same line
        return {
          x: rect.left + textWidth + parseInt(computedStyle.paddingLeft) + scrollLeft + 10,
          y: rect.top + parseInt(computedStyle.paddingTop) + scrollTop
        };
      }
    }
  }
