import {BrowserContext } from "puppeteer"

export namespace Crawller {
  export type Account = {
    username: string
    password: string
  }
  export type Product = {
    img: string;
    title: string;
    description: string
    price: number;
    rawPrice: string;
    link: string;
  }
  export type Params = {
    accounts: Account[]
  }
  export type Result = {
    [username: string]: {
      success: boolean,
      reason?: string,
      data: Product[]
    }
  }
  export type Instance = {
    id: string
    context: BrowserContext
    busy: boolean
  }
}

export interface ICrawller {
  execute: (accounts: Crawller.Params) => Promise<Crawller.Result>
  setIntances: (quantity: number) => Promise<void>
  closeAllInstance(): Promise<void>
}

export interface IBrowserContext {
  newInstance(): Promise<Crawller.Instance>
  getFreeInstance(): Promise<Crawller.Instance>
  setIntanceBusy(instanceId: string, busy: boolean): void
  closeInstance(instanceId: string): Promise<void>
}