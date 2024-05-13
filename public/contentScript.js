// Define a function to change the text of a heading
function changeHeading(headingType) {
  chrome.storage.local.get([headingType], function (result) {
    let headingText = result[headingType];
    let headings = document.querySelectorAll(headingType);
    headings.forEach(function (heading) {
      heading.innerHTML = headingText;
    });
  });
}

// Function to insert "Change" buttons next to each heading
function insertChangeButtons() {
  ["h1", "h2", "h3"].forEach(function (headingType) {
    // Get all headings of the current type
    let headings = document.querySelectorAll(headingType);

    headings.forEach(function (heading) {
      // Create a "Change" button
      let changeButton = document.createElement("button");
      changeButton.innerHTML = "Change";
      changeButton.addEventListener("click", function () {
        changeAllHeadings();
      });

      // Append the change button next to the heading
      heading.insertAdjacentElement("afterend", changeButton);
    });
  });
}

// Function to change all headings
function changeAllHeadings() {
  ["h1", "h2", "h3"].forEach(function (headingType) {
    changeHeading(headingType);
  });
}

// Inject buttons when the page loads
window.onload = insertChangeButtons;
