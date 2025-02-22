import React from 'react';
import { createRoot } from 'react-dom/client';
import GhostText from '../components/GhostText';
import getCursorPosition from './getCursorPos';
// import { llmService } from '../utils/llmService';
import { deepseekService } from '../utils/deepseek';

(function() {
  console.log('Extension starting...');

  const container = document.createElement('div');
  container.id = 'text-completer-root';
  document.body.appendChild(container);

  const root = createRoot(container);
  let lastProcessedText = '';


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
          if (!text || text.length < 5 || text === lastProcessedText) {
            return root.render(null);
          }

          try {
            const position = getCursorPosition(event.target);
            // Validate position before proceeding
            if (!position || !position.x || !position.y) {
              console.log('Invalid cursor position:', position);
              return root.render(null);
            }

            const style = window.getComputedStyle(event.target);
            lastProcessedText = text;
            
            const suggestion = await deepseekService.getSuggestion(text);
            if (!suggestion) {
              console.log('No suggestion received');
              return root.render(null);
            }

            console.log('Showing suggestion:', {
              text: suggestion,
              position,
              style: {
                font: style.font,
                fontSize: style.fontSize,
                lineHeight: style.lineHeight
              }
            });

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
                  const newText = currentText.slice(0, caretPos) + suggestion;
                  event.target.value = newText;
                  lastProcessedText = newText;
                  root.render(null);
                }}
              />
            );
          } catch (error) {
            console.error('Error:', error);
            root.render(null);
          }
        }, 550);
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