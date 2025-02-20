import React from 'react';
import { createRoot } from 'react-dom/client';
import GhostText from '../components/GhostText';

(function() {
  console.log('Extension starting...');

  const container = document.createElement('div');
  container.id = 'text-completer-root';
  document.body.appendChild(container);

  const root = createRoot(container);

  const getCursorPosition = (element) => {
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

  const initTextAreas = () => {
    const textAreas = document.querySelectorAll('textarea, [contenteditable="true"], input[type="text"]');
    console.log('Found text areas:', textAreas.length);

    textAreas.forEach(textArea => {
      let timeout;

      textArea.addEventListener('input', (event) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          const text = event.target.value || event.target.textContent;
          if (!text) return;

          const position = getCursorPosition(event.target);
          const style = window.getComputedStyle(event.target);

          console.log('Text area type:', event.target.tagName);
          console.log('Showing suggestion at:', position);

          root.render(
            <GhostText 
              text="Sample suggestion"
              position={position}
              style={{
                font: style.font,
                fontSize: style.fontSize,
                lineHeight: style.lineHeight,
                backgroundColor: 'transparent'
              }}
            />
          );
        }, 300);
      });
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTextAreas);
  } else {
    initTextAreas();
  }

  // Watch for dynamic content
  const observer = new MutationObserver(() => {
    initTextAreas();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('Extension initialized!');
})();