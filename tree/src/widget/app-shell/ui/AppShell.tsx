import { Outlet } from "react-router";

// import { Header } from "@/widgets/header";
import cls from "./AppShell.module.css";

export const AppShell = () => {
  return (
    <div className={cls.mainLayout}>
      {/* <Header /> */}
      <div className={cls.allContent}>
        <Outlet />
      </div>
    </div>
  );
};
