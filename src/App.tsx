import { UserTable } from "./components/UserTable/UserTable";
import "./App.css";
import { SnackbarProvider } from "./context/SnackbarContext/SnackbarContext";
import { DialogProvider } from "./context/DialogContext/DialogContext";

function App() {
  return (
    <SnackbarProvider>
      <DialogProvider>
        <div className="App">
          <div className="container">
            <header className="header">
              <h1>מערכת ניהול משתמשים</h1>
            </header>

            <main>
              <UserTable />
            </main>
          </div>
        </div>
      </DialogProvider>
    </SnackbarProvider>
  );
}

export default App;
