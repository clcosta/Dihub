import "../infra";
import { LogAdapter } from "../application/adapters/log-adapter";
import { Routes } from "@/application/routes";

const start = async () => {
  LogAdapter.getInstance().save({ message: "Start application!" });
  await Routes.start();
};

start();
