export class AppError extends Error {
  private _code: number = 500;

  code = (_code?: number) => {
    if (_code === undefined) return this._code;
    this._code = _code;
    return this;
  };
}
