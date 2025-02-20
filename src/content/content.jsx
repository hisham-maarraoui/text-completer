import React from 'react';
import { createRoot } from 'react-dom/client';
import GhostText from '../components/GhostText';
import getCursorPosition from './getCursorPos';

(function() {
  console.log('Extension starting...');

  const container = document.createElement('div');
  container.id = 'text-completer-root';
  document.body.appendChild(container);

  const root = createRoot(container);

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
              onTabComplete={(suggestion) => {
                const currentText = event.target.value;
                const caretPos = event.target.selectionStart;

                const newText = currentText.slice(0, caretPos+1) + suggestion

                event.target.value = newText;

                root.render(null);
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