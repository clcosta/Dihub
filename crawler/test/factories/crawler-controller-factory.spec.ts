import { it, expect } from 'vitest'

import { CrawlerController } from '../../src/application/controllers'
import { makeCrawlerController } from '../../src/application/factories/controllers'

it('should create a crawler controller', async () => {
  const crawlerService = makeCrawlerController()
  expect(crawlerService).toBeDefined()
  expect(crawlerService).toBeInstanceOf(CrawlerController)
})