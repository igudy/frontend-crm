// App.tsx
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import JobsBoard from "./pages/JobsBoard";
import JobDetail from "./pages/JobDetail";
import CreateCustomer from "./pages/CreateCustomer";
import CreateJob from "./pages/CreateJob";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomersBoard from "./pages/CustomersBoard";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<JobsBoard />} />
            <Route path="customers" element={<CustomersBoard />} />{" "}
            <Route path="jobs/:id" element={<JobDetail />} />
            <Route path="customers/new" element={<CreateCustomer />} />
            <Route path="jobs/new" element={<CreateJob />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </Provider>
  );
}

export default App;
