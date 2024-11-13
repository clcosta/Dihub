import { it, expect } from 'vitest'

import { CrawlerWithoutAccountsController } from '../../src/application/controllers'
import { makeCrawlerWithoutAccountsController } from '../../src/application/factories/controllers'

it('should create a crawler controller', async () => {
  const crawlerService = makeCrawlerWithoutAccountsController()
  expect(crawlerService).toBeDefined()
  expect(crawlerService).toBeInstanceOf(CrawlerWithoutAccountsController)
})