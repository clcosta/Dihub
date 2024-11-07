export interface ILog {
  save: (params: Log.Params) => void
}

export namespace Log {
  export enum LogLevels {
    INFO = "info",
    ERROR = "error",
  }
  export type Params = {
    message: string
    type?: LogLevels
  }
}