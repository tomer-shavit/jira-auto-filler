// This function sets up and inserts the 'Change' button next to the specified element
function setupChangeButton() {
  const targetSpan = document.querySelector('span.throbber'); // Target span where the button should be placed
  if (targetSpan) {
      const changeButton = document.createElement('button');
      changeButton.textContent = 'Change';
      changeButton.style.position = 'absolute';
      changeButton.style.zIndex = '1000'; // Ensure the button is visible
      targetSpan.parentNode.insertBefore(changeButton, targetSpan.nextSibling);

      changeButton.addEventListener('click', function() {
          // Function to set project field, highlight text, and simulate a tab key press
          const setProjectFieldAndTab = () => {
              const projectField = document.getElementById('project-field');
              if (projectField) {
                  projectField.value = 'PREM-2 (PREM2)';
                  projectField.dispatchEvent(new Event('input', { bubbles: true })); // Mimic user input for React and similar frameworks
                  projectField.focus(); // Focus on the input field
                  projectField.select(); // Highlight the text inside the input

                  // Simulate double click on the input field
                  const clickEvent = new MouseEvent('dblclick', {
                      bubbles: true,
                      cancelable: true,
                      view: window
                  });
                  projectField.dispatchEvent(clickEvent);

                  // Delay for 0.2 seconds then press tab key
                  setTimeout(() => {
                      const keyboardEvent = new KeyboardEvent('keydown', {
                          key: 'Tab',
                          code: 'Tab',
                          keyCode: 9, // Numeric code for Tab key
                          bubbles: true,
                          cancelable: true
                      });
                      document.activeElement.dispatchEvent(keyboardEvent); // Dispatch the event on the currently focused element
                  }, 200); // 0.2 seconds delay
              } else {
                  console.error('Project field not found, retrying...');
                  setTimeout(setProjectFieldAndTab, 500); // Retry after 500ms
              }
          };

          setProjectFieldAndTab();
      });
  } else {
      console.error('Target span not found.');
  }
}

// Observer to detect when the popup is added to the DOM
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.matches('span.throbber')) {
              setupChangeButton();
          }
      });
  });
});

// Configuration of the observer:
const config = { childList: true, subtree: true };

// Start observing the body for added nodes
observer.observe(document.body, config);

// Ensure to disconnect the observer when not needed to avoid memory leaks
window.addEventListener('unload', () => {
  observer.disconnect();
});
