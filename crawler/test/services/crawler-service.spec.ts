import { describe, it, expect, beforeEach, vi } from "vitest";
import { CrawlerService } from "../../src/application/services/crawler/crawler-service";
import { makeCrawlerService } from "../../src/application/factories/services/crawler-service-factory";

const mockCrawlerService = {
  execute: vi.fn(),
  extractData: vi.fn(),
  closeAllInstances: vi.fn(),
  setIntances: vi.fn(),
  extractAccounts: vi.fn(),
};

const standardAccount = {
  username: "standard_user",
  password: "secret_sauce",
};

const lockedOutUserAccount = {
  username: "locked_out_user",
  password: "secret_sauce",
}

const standardAccountResult = {
  standard_user: {
    success: true,
    data: {
      title: "Sauce Labs Fleece Jacket",
      price: 49.99,
      description:
        "It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.",
      rawPrice: "$49.99",
      img: "/static/media/sauce-pullover-1200x1500.51d7ffaf.jpg",
      link: "https://www.saucedemo.com/inventory-item.html?id=5",
    },
  },
};

const lockedOutUserResult = {
  locked_out_user: {
    success: false,
    reason: 'Login failed. Invalid Credentials for user "locked_out_user"',
    data: [],
  },
};

vi.mock("../../src/application/services/crawler/crawler-service", () => {
  return {
    CrawlerService: vi.fn().mockImplementation(() => mockCrawlerService),
  };
});

describe("Tests for Crawler Service", () => {
  let crawlerService: CrawlerService;

  beforeEach(() => {
    crawlerService = makeCrawlerService();
  });

  it("should execute and succeed for standard account", async () => {
    mockCrawlerService.execute.mockResolvedValueOnce(standardAccountResult);
    const result = await crawlerService.execute({
      accounts: [standardAccount],
    });
    expect(result).toEqual(standardAccountResult);
  });

  it("should execute and failure for locked out user account", async () => {
    mockCrawlerService.execute.mockResolvedValueOnce(lockedOutUserResult);
    const result = await crawlerService.execute({ accounts: [lockedOutUserAccount] });
    expect(result).toEqual(lockedOutUserResult);
  });

  it("sould increase the number of instances", async () => {
    await crawlerService.setIntances(2);
    expect(mockCrawlerService.setIntances).toHaveBeenCalledWith(2);
  })

  it("should extract accounts", async () => {
    mockCrawlerService.extractAccounts.mockResolvedValueOnce([standardAccount, lockedOutUserAccount]);
    const accounts = await crawlerService.extractAccounts();
    expect(accounts).toEqual([standardAccount, lockedOutUserAccount]);
  });

  it("should close all instances", async () => {
    await crawlerService.closeAllInstances();
    expect(mockCrawlerService.closeAllInstances).toHaveBeenCalled();
  });
});
