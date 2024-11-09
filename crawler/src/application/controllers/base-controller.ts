import { HttpResponse } from "@/data/common/http";
import { AppError } from "@/application/errors";
import { Log } from "@/data/common/log";
import { LogAdapter } from "@/application/adapters/log-adapter";
import { IAppRequest } from "@/data/common/controller";

export abstract class BaseController {
  abstract execute(httpRequest: IAppRequest): Promise<HttpResponse | void>;

  constructor(private name: string) {}

  private appErrorHttpResponse: {
    [key: number]: (
      params?: HttpResponse.HttpResponseParams<any>
    ) => HttpResponse<any>;
  } = {
    [AppError.Errors.BAD_REQUEST]: HttpResponse.badRequest,
    [AppError.Errors.REQUEST_TIMEOUT]: HttpResponse.requestTimeout,
    [AppError.Errors.CONFLICT]: HttpResponse.conflict,
    [AppError.Errors.SERVER_ERROR]: HttpResponse.serverError,
    [AppError.Errors.UNPROCESSABLE_ENTITY]: HttpResponse.unprocessableEntity,
  };

  handle = async (httpRequest: IAppRequest): Promise<HttpResponse> => {
    const start = performance.now();
    try {
      const validationErr = this.validate(httpRequest);
      if (validationErr !== undefined) {
        let sysMessage =
          validationErr instanceof AppError
            ? validationErr.getSysMessage()
            : validationErr.message;
        return HttpResponse.badRequest({
          message: validationErr.message,
          sysMessage,
        });
      }

      const response = await this.execute(httpRequest);
      if (response) {
        response.type = response.type || "json";
        return response;
      }
    } catch (err) {
      if (err instanceof AppError) {
        this.saveLog({
          httpRequest,
          message: err.message || err.getSysMessage() || "An error occurred",
          type: Log.LogLevels.ERROR,
        });
        return this.handleAppError(err);
      }
      this.saveLog({
        httpRequest,
        message: err.message,
        type: Log.LogLevels.ERROR,
      });
      return HttpResponse.serverError({ message: err.message });
    } finally {
      this.saveBenchmark(httpRequest, start);
    }
  };

  validate(httpRequest: IAppRequest): Error | undefined {
    return;
  }

  private saveBenchmark = async (
    httpRequest: any,
    start: number
  ): Promise<void> => {
    try {
      const end = performance.now();
      const time = (end - start).toFixed(0);
      LogAdapter.getInstance().save({
        message: `Benchmark: ${this.name} - ${time}ms`,
        origin: httpRequest.ip ?? 'Unknown',
        type: Log.LogLevels.INFO,
      });
    } catch (e) {
      LogAdapter.getInstance().save({
        message: `Benchmark: ${this.name} - Unexpected error`,
        origin: httpRequest.ip ?? 'Unknown',
        type: Log.LogLevels.ERROR,
      });
      console.error(e);
    }
  };

  private handleAppError = (err: AppError): HttpResponse => {
    const httpResponse = (
      this.appErrorHttpResponse[err.getErrorCode()] ||
      this.appErrorHttpResponse[AppError.Errors.SERVER_ERROR]
    )();

    return {
      code: httpResponse.code,
      data: {},
      message: err.message || httpResponse.message || "",
      sysMessage: err.getSysMessage() || "",
    };
  };

  private saveLog = ({
    httpRequest,
    message,
    type,
    origin,
  }: {
    httpRequest: IAppRequest;
    message?: string;
    type: Log.LogLevels;
    origin?: string;
  }) => {
    try {
      if (type === Log.LogLevels.ERROR)
        return LogAdapter.getInstance().save({
          message,
          origin,
          type: Log.LogLevels.ERROR,
        });

      let messageContent = message
        ? message
        : JSON.stringify({ ...httpRequest });

      const userId = httpRequest.ip ?? 'unknown';
      let logMessage = `[USER ${userId}]: ${messageContent}`;

      LogAdapter.getInstance().save({
        message: logMessage,
        origin,
        type: Log.LogLevels.INFO,
      });
    } catch (e) {
      console.error(e);
    }
  };
}
