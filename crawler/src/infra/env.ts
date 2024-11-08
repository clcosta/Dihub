export const env = {
  log: {
    folder: process.env.LOG_FOLDER || __dirname + '/../../logs'
  },
  http: {
    port: +process.env.HTTP_PORT || 3000
  },
  crawler: {
    waitingBrowserTimeout: +process.env.crawler_BROWSER_TIMEOUT || 120, // 120 seconds
    loginUrl: process.env.crawler_LOGIN_URL || "https://www.saucedemo.com/",
  }
}