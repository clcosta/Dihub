import fs from "fs";
import { format, createLogger, transports, Logger } from "winston";
import { ILog, Log } from "@/data/common/log";
import { env } from "@/infra/env";

export class LogAdapter implements ILog {
  private static instance: LogAdapter;

  private loggerInfo: Logger;
  private loggerError: Logger;


  constructor(
    private readonly logFolder: string,
  ) {
    this.logFolder = logFolder;
    fs.mkdirSync(this.logFolder, { recursive: true });

    const { combine, timestamp, label, printf } = format;
    const myFormat = printf(
      ({ message, timestamp }) =>
        `[${
          new Date(timestamp).toLocaleString("pt-BR").split(" ")[1]
        }]: ${message}`
    );
    const date = new Date()
      .toLocaleString("pt-BR")
      .split(" ")[0]
      .replaceAll("/", "_");

    const infoLogDir = `${this.logFolder}/Info/`;
    const errorLogDir = `${this.logFolder}/Error/`;
    fs.mkdirSync(infoLogDir, { recursive: true });
    fs.mkdirSync(errorLogDir, { recursive: true });

    const LoggerOption = {
      format: combine(timestamp(), label({ label: "" }), myFormat),
      transports: [],
    };

    const LoggerOptionInfo = {
      ...LoggerOption,
      level: Log.LogLevels.INFO,
      transports: [
        new transports.File({
          filename: `${infoLogDir}${date}.log`,
          level: Log.LogLevels.INFO,
        }),
        new transports.Console({
          format: format.simple(),
        })
      ],
    };
    const LoggerOptionError = {
      ...LoggerOption,
      level: Log.LogLevels.ERROR,
      transports: [
        new transports.File({
          filename: `${errorLogDir}${date}.log`,
          level: Log.LogLevels.ERROR,
        }),
        new transports.Console({
          format: format.simple(),
        })
      ],
    };

    this.loggerInfo = createLogger(LoggerOptionInfo);
    this.loggerError = createLogger(LoggerOptionError);
  }

  static getInstance(): LogAdapter {
    if (!this.instance) this.instance = new LogAdapter(env.log.folder)
    return this.instance;
  }

  save = (params: Log.Params): void => {
    const { message, type } = params;
    try {
      if (type === Log.LogLevels.ERROR) {
        this.loggerError.log({
          level: Log.LogLevels.ERROR,
          message,
          origin: params.origin,
        });
      } else {
        this.loggerInfo.log({
          level: Log.LogLevels.INFO,
          message,
          origin: params.origin,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };
}


