import React, { useState, useEffect } from "react";

const App: React.FC = () => {
  const [h1Text, setH1Text] = useState("");
  const [h2Text, setH2Text] = useState("");
  const [h3Text, setH3Text] = useState("");

  // Load saved values from chrome.storage when the component mounts
  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      // Check if chrome.storage is available
      chrome.storage.local.get(["h1", "h2", "h3"], (result) => {
        if (result.h1) setH1Text(result.h1);
        if (result.h2) setH2Text(result.h2);
        if (result.h3) setH3Text(result.h3);
      });
    }
  }, []);

  const handleSave = () => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      // Check if chrome.storage is available
      chrome.storage.local.set({ h1: h1Text, h2: h2Text, h3: h3Text }, () => {
        alert("Values saved!");
      });
    } else {
      alert("Chrome Storage is not available.");
    }
  };

  const handleChange = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0 || tabs[0].id === undefined) {
        console.error("No active tab found or tab ID is undefined.");
        return;
      }
      if (typeof chrome !== "undefined" && chrome.scripting) {
        // Check if chrome.scripting is available
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: (content) => {
            document
              .querySelectorAll("h1")
              .forEach((h1) => (h1.textContent = content.h1));
            document
              .querySelectorAll("h2")
              .forEach((h2) => (h2.textContent = content.h2));
            document
              .querySelectorAll("h3")
              .forEach((h3) => (h3.textContent = content.h3));
          },
          args: [{ h1: h1Text, h2: h2Text, h3: h3Text }],
        });
      } else {
        console.error("Chrome scripting not available.");
      }
    });
  };
  return (
    <div className="p-4">
      <div className="mb-4">
        <label
          htmlFor="h1Input"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          H1 Text
        </label>
        <input
          type="text"
          id="h1Input"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={h1Text}
          onChange={(e) => setH1Text(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="h2Input"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          H2 Text
        </label>
        <input
          type="text"
          id="h2Input"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={h2Text}
          onChange={(e) => setH2Text(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="h3Input"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          H3 Text
        </label>
        <input
          type="text"
          id="h3Input"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          value={h3Text}
          onChange={(e) => setH3Text(e.target.value)}
        />
      </div>
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
        onClick={handleSave}
      >
        Save
      </button>
      <button
        className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        onClick={handleChange}
      >
        Change
      </button>
    </div>
  );
};

export default App;
