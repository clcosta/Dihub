import { it, expect } from 'vitest'

import { CrawlerService } from '../../src/application/services/crawler'
import { makeCrawlerService } from '../../src/application/factories/services/crawler-service-factory'

it('should create a crawler service', async () => {
  const crawlerService = makeCrawlerService()
  expect(crawlerService).toBeDefined()
  expect(crawlerService).toBeInstanceOf(CrawlerService)
})