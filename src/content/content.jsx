import React from 'react';
import { createRoot } from 'react-dom/client';
import GhostText from '../components/GhostText';
import getCursorPosition from './getCursorPos';
import { llmService } from '../utils/llmService';

(function() {
  console.log('Extension starting...');

  const container = document.createElement('div');
  container.id = 'text-completer-root';
  document.body.appendChild(container);

  const root = createRoot(container);

  const initTextAreas = async () => {
    const textAreas = document.querySelectorAll('textarea, [contenteditable="true"], input[type="text"]');
    console.log('Found text areas:', textAreas.length);

    const initializedTextAreas = new WeakSet();

    textAreas.forEach(textArea => {
      if (initializedTextAreas.has(textArea)) return;
      initializedTextAreas.add(textArea);

      let timeout;

      textArea.addEventListener('input', async (event) => {
        root.render(null);

        clearTimeout(timeout);
        timeout = setTimeout(async () => {
          const text = event.target.value || event.target.textContent;
          if (!text) return root.render(null);

          const position = getCursorPosition(event.target);
          const style = window.getComputedStyle(event.target);

          try {
            const suggestion = await llmService.getSuggestion(text);
            
            if (!suggestion) {
              console.log('No suggestion received');
              return root.render(null);
            }

            console.log('Text area type:', event.target.tagName);
            console.log('Showing suggestion at:', position);
            console.log('Suggestion:', suggestion);

            root.render(
              <GhostText 
                text={suggestion}
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

                  const newText = currentText.slice(0, caretPos) + suggestion

                  event.target.value = newText;

                  root.render(null);
                }}
              />
            );
          } catch (error) {
            console.log(error);
            return '';
          }
        }, 2000);
      });
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTextAreas);
  } else {
    initTextAreas();
  }

  let initTimeout;
  const observer = new MutationObserver(() => {
    clearTimeout(initTimeout);
    initTimeout = setTimeout(() => {
        console.log('Initializing text areas...');
      initTextAreas();
    }, 100);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('Extension initialized!');
})();