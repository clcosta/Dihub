export class AppError extends Error {
  private _code: number = 500;
  private _sysMessage: string;

  code = (code?: number) => {
    if (code === undefined) return this;
    this._code = code;
    return this;
  };
  setSysMessage = (sysMessage: string) => {
    this._sysMessage = sysMessage;
    return this;
  };


  getErrorCode = () => this._code;
  getSysMessage = (): string | null => this._sysMessage || null;
}


export namespace AppError {
  export enum Errors {
    BAD_REQUEST = 400,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    SERVER_ERROR = 500,
    UNPROCESSABLE_ENTITY = 422
  }
}