import {BrowserContext } from "puppeteer"

export namespace Crawler {
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
    instances?: number
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
  export namespace SetInstance {
    export type Params = number
    export type Result = boolean
  }
}

export interface ICrawler {
  execute: (accounts: Crawler.Params) => Promise<Crawler.Result>
  setIntances: (quantity: number) => Promise<void>
  extractData: (account: Crawler.Account, context: BrowserContext) => Promise<Crawler.Product>
  closeAllInstances(): Promise<void>
  extractAccounts(): Promise<Crawler.Account[]>
}

export interface IBrowserContext {
  newInstance(): Promise<Crawler.Instance>
  getFreeInstance(): Promise<Crawler.Instance>
  setIntanceBusy(instanceId: string, busy: boolean): void
  closeAllInstances(): Promise<void>
  closeInstance(instanceId: string): Promise<void>
}