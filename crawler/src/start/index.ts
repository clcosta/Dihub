import "../infra";
import { LogAdapter } from "../application/adapters/log-adapter";
import { Routes as HttpServer } from "@/application/routes";

const start = async () => {
  LogAdapter.getInstance().save({ message: "Start application!" });
  await HttpServer.start();
};

start();
