const inputIds = [
'customfield_10303-field', 
'components-textarea', 
'customfield_22001', 
'labels-textarea', 
'customfield_10004', 
'summary'
];

function addSaveAllButton() {
  const targetSpan = document.querySelector('span.throbber');
  if (targetSpan) {
    const saveAllButton = document.createElement('button');
    saveAllButton.textContent = 'Save All';
    saveAllButton.style.position = 'absolute';
    saveAllButton.style.left = '80px';
    saveAllButton.style.zIndex = '1000';
    saveAllButton.style.backgroundColor = '#5cb85c';
    saveAllButton.style.color = 'white'; 
    saveAllButton.style.fontWeight = 'bold'; 
    saveAllButton.style.padding = '8px 16px'; 
    saveAllButton.style.borderRadius = '4px';
    saveAllButton.style.border = 'none'; 
    saveAllButton.style.cursor = 'pointer'; 
    targetSpan.parentNode.insertBefore(saveAllButton, targetSpan.nextSibling);


      saveAllButton.addEventListener('click', function() {
          const dataObject = {};
          inputIds.forEach(id => {
              const inputElement = document.getElementById(id);
              if (inputElement) {
                  let valueToSave;
                  if (id === 'components-textarea' || id === 'labels-textarea') {
                      valueToSave = Array.from(document.querySelectorAll(`#${id}~.representation .value-text`))
                                         .map(v => v.textContent.trim());
                  } else if (id === 'customfield_22001') {
                      const selectedOption = inputElement.querySelector('option:checked');
                      valueToSave = selectedOption ? selectedOption.text : '';
                  } else {
                      valueToSave = inputElement.value;
                  }
                  dataObject[id] = valueToSave;
              } else {
                  console.error("Input element not found:", id);
              }
          });

          localStorage.setItem('jira.autofiller', JSON.stringify(dataObject));
          alert('All changes saved!');
      });
  } else {
      console.error('Target span not found.');
  }
}

function setupChangeButton() {
    const targetSpan = document.querySelector('span.throbber'); 
    if (targetSpan) {
      const changeButton = document.createElement('button');
      changeButton.textContent = 'Auto Fill';
      changeButton.style.position = 'absolute';
      changeButton.style.left = '176px'; 
      changeButton.style.zIndex = '1000';
      changeButton.style.backgroundColor = '#f0ad4e'; 
      changeButton.style.color = 'white'; 
      changeButton.style.fontWeight = 'bold'; 
      changeButton.style.padding = '8px 16px'; 
      changeButton.style.borderRadius = '4px';
      changeButton.style.border = 'none'; 
      changeButton.style.cursor = 'pointer'; 
      targetSpan.parentNode.insertBefore(changeButton, targetSpan.nextSibling);

        changeButton.addEventListener('click', async function() {
            const storedData = localStorage.getItem('jira.autofiller');
            if (!storedData) {
                alert('You need to save values first.');
                return;
            }
            const dataObject = JSON.parse(storedData);

            for (const [key, value] of Object.entries(dataObject)) {
                if (key === 'customfield_22001') {
                    selectOptionByText(key, value);
                } else if (key ===  "customfield_10303-field") {
                    await fillAndPerformAction(key, value, performDownAndEnter); 
                } else {
                    await fillAndPerformAction(key, value, performTab);
                }
            }

            const summary = document.getElementById('summary');
            if (summary) {
                summary.focus();
            }
        });
    } else {
        console.error('Target span not found.');
    } 
}

function selectOptionByText(id, text) {
  const selectElement = document.getElementById(id);
  if (selectElement) {
    const options = selectElement.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].text === text) {
        selectElement.selectedIndex = i;
        selectElement.focus();
        break;
      }
    }
  } else {
    console.error("Select element not found");
  }
}

function findAndClickLiWithSpecificText() {
  const emTags = document.querySelectorAll('li a em'); 
  for (let emTag of emTags) {
      if (emTag.textContent.trim() === "Resellers Backoffice") {
          const li = emTag.closest('li'); 
          if (li) {
              li.click(); 
              console.log('Click event dispatched on:', li);
              return li;
          }
      }
  }
  console.log('No matching li found.');
  return null;
}

async function simulateKeyboardAction(keyAction) {
  const keyboardEvent = new KeyboardEvent('keydown', {
      key: keyAction.key,
      code: keyAction.code,
      keyCode: keyAction.keyCode,
      bubbles: true,
      cancelable: true
  });
  document.activeElement.dispatchEvent(keyboardEvent);
  await new Promise(resolve => setTimeout(resolve, keyAction.delay));
}

async function fillAndPerformAction(targetId, value, performAction) {
  return new Promise((resolve, reject) => {
      const projectField = document.getElementById(targetId);
      if (projectField) {
          projectField.value = value;
          projectField.dispatchEvent(new Event('input', { bubbles: true }));
          projectField.focus(); 
          projectField.select();

          setTimeout(() => {
              const clickEvent = new MouseEvent('dblclick', {
                  bubbles: true,
                  cancelable: true,
                  view: window
              });
              projectField.dispatchEvent(clickEvent);

              setTimeout(() => {
                projectField.focus();
                  performAction().then(resolve).catch(reject);
              }, 200);
          }, 200);
      } else {
          console.error(`${targetId} not found, retrying...`);
          setTimeout(reject, 500); 
      }
  });
}

async function performTab() {
  return simulateKeyboardAction({ key: 'Tab', code: 'Tab', keyCode: 9, delay: 500 });
}

async function performDownAndEnter() {
  await simulateKeyboardAction({ key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, delay: 200 });
  await simulateKeyboardAction({ key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, delay: 200 });
  await simulateKeyboardAction({ key: 'ArrowDown', code: 'ArrowDown', keyCode: 40, delay: 200 });
  setTimeout(() => {}, 200);
  return simulateKeyboardAction({ key: 'Enter', code: 'Enter', keyCode: 13, delay: 500 });
}

function addSaveButton(inputFieldId) {
  const inputElement = document.getElementById(inputFieldId);
  if (inputElement) {
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.type = 'button'; 
    saveButton.style.marginTop = '6px'; 
    saveButton.style.display = 'block';
    saveButton.style.backgroundColor = '#5cb85c';
    saveButton.style.color = 'white'; 
    saveButton.style.fontWeight = 'bold'; 
    saveButton.style.padding = '4px 8px';
    saveButton.style.borderRadius = '4px'; 
    saveButton.style.border = 'none'; 
    saveButton.style.cursor = 'pointer'; 

      saveButton.addEventListener('click', function() {
          let valueToSave;
          if (inputFieldId === 'components-textarea' || inputFieldId === 'labels-textarea') {
              valueToSave = Array.from(document.querySelectorAll(`#${inputFieldId}~.representation .value-text`))
                                 .map(v => v.textContent.trim());
          } else {
              valueToSave = inputElement.value;
          }

          const storedData = localStorage.getItem('jira.autofiller');
          let dataObject = storedData ? JSON.parse(storedData) : {};
          dataObject[inputFieldId] = valueToSave;

          localStorage.setItem('jira.autofiller', JSON.stringify(dataObject));
          alert('Saved!');
      });

      if (inputElement.nextSibling) {
          inputElement.parentNode.insertBefore(saveButton, inputElement.nextSibling);
      } else {
          inputElement.parentNode.appendChild(saveButton);
      }
  } else {
      console.error("Input element not found:", inputFieldId);
  }
}


function setupSaveButtons() {
  inputIds.forEach(id => addSaveButton(id));
}


const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.matches('span.throbber')) {
            setupSaveButtons();
              setupChangeButton();
              addSaveAllButton();
          }
      });
  });
});

const config = { childList: true, subtree: true };
observer.observe(document.body, config);

window.addEventListener('unload', () => {
  observer.disconnect();
});
