import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import JobsBoard from "./pages/JobsBoard";
import JobDetail from "./pages/JobDetail";
import CreateCustomer from "./pages/CreateCustomer";
import CreateJob from "./pages/CreateJob";

function App() {
  return (
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
  );
}

export default App;
