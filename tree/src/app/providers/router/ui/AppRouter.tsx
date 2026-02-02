import { Route, Routes } from "react-router-dom";

import { Map } from "@/pages/map";
import { AppShell } from "@/widget/app-shell";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        {/* Map */}
        <Route index element={<Map />} />
      </Route>
    </Routes>
  );
};
