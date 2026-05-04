import AppRouter from "./routes/router";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

const App = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <AppRouter />
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
