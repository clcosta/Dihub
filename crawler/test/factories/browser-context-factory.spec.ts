import { it, expect } from 'vitest'

import { BrowserContext } from '../../src/application/services/crawler/browser-context'
import { makeBrowserContext } from '../../src/application/factories/services/browser-context-factory'

it('should create a browser context service', async () => {
  const browserContext = makeBrowserContext()
  expect(browserContext).toBeDefined()
  expect(browserContext).toBeInstanceOf(BrowserContext)
})