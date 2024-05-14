import React from "react";

const App: React.FC = () => {
  return (
    <div className="p-6 w-56 mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold text-center">Jira Auto Filler</h1>
      <div className="text-md text-gray-600">
        <span className="text-lg font-bold text-black">How to use: </span>
        <br />
        <span className="font-bold">1.</span> Create a new Jira ticket.
        <br />
        <span className="font-bold">2.</span> Fill in the ticket details.
        <br />
        <span className="font-bold">3.</span> Click on the Save All button.
        <br />
        <span className="font-bold">4.</span> For every future ticket, press the
        Auto Fill button.
        <br />
        <span className="font-bold">5.</span> Profit. 📈📈
      </div>
      <div className="text-md text-center mt-0 pt-0">
        <a
          target="blank"
          className="text-blue-500"
          href="https://github.com/tomer-shavit/jira-auto-filler"
        >
          Do you like it? Give it a ⭐
        </a>
      </div>
      <div className="text-md font-bold text-center">Made With ❤️</div>
    </div>
  );
};

export default App;
