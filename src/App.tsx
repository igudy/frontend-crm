import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import JobsBoard from "./pages/JobsBoard";
import JobDetail from "./pages/JobDetail";
import CreateCustomer from "./pages/CreateCustomer";
import CreateJob from "./pages/CreateJob";
import { store } from "./store/store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<JobsBoard />} />
            <Route path="jobs/:id" element={<JobDetail />} />
            <Route path="customers/new" element={<CreateCustomer />} />
            <Route path="jobs/new" element={<CreateJob />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
