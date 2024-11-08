export type HttpResponse<T = any> = {
  code: number
  data: T
  message: string
  sysMessage?: string
  headers?: HttpResponse.Headers
  type?: "json" | "buffer"
}

export namespace HttpResponse {
  export type HttpResponseParams<T> = {
    data?: T
    message?: string,
    sysMessage?: string
  }

  export type Headers = {[key: string]: string}

  export const ok = <T = any>(params?: HttpResponseParams<T>): HttpResponse<T> => ({
    code: 200,
    data: params?.data ?? {} as T,
    message: params?.message || '',
    sysMessage: params?.sysMessage || ''

  })

  export const badRequest = (params?: HttpResponseParams<any>): HttpResponse<any> => ({
    code: 400,
    data: {},
    message: params?.message || '',
    sysMessage: params?.sysMessage || ''
  })

  export const requestTimeout = (params?: HttpResponseParams<any>): HttpResponse<any> => ({
    code: 408,
    data: {},
    message: params?.message || 'Requisição demorou muito',
    sysMessage: params?.sysMessage || ''
  })

  export const conflict = (params?: HttpResponseParams<any>): HttpResponse<any> => ({
    code: 409,
    data: {},
    message: params?.message || 'Recurso com conflito',
    sysMessage: params?.sysMessage || ''
  })

  export const serverError = (params?: HttpResponseParams<any>): HttpResponse<any> => ({
    code: 500,
    data: {},
    message: params?.message || 'Erro Interno',
    sysMessage: params?.sysMessage || ''
  })

  export const unprocessableEntity = (params?: HttpResponseParams<any>): HttpResponse<any> => ({
    code: 422,
    data: {},
    message: params?.message || '',
    sysMessage: params?.sysMessage || ''
    })
}