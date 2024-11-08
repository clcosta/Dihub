export interface Service<Param, Result> {
  execute(param: Param): Promise<Result>
}