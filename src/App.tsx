import React from "react";
import { UserTable } from "./components/UserTable/UserTable";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>מערכת ניהול משתמשים</h1>
        </header>

        <main>
          <UserTable/>
        </main>
      </div>
    </div>
  );
}

export default App;
