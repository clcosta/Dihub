export const env = {
  log: {
    folder: process.env.LOG_FOLDER || __dirname + '/../../logs'
  },
  http: {
    port: +process.env.HTTP_PORT || 3000
  },
  crawller: {
    waitingBrowserTimeout: +process.env.CRAWLLER_BROWSER_TIMEOUT || 120, // 120 seconds
    loginUrl: process.env.CRAWLLER_LOGIN_URL || "https://www.saucedemo.com/",
  }
}