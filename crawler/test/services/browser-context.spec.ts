import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { BrowserContext } from "../../src/application/services/crawler/browser-context";
import { makeBrowserContext } from "../../src/application/factories/services/browser-context-factory";
import { AppError } from "../../src/application/errors";

interface InstanceMock {
  id: string;
  context: string;
  busy: boolean;
}

const mockBrowserContext = {
  // attributes
  instancesMap: new Map<string, InstanceMock>(),
  // methods
  getFreeInstance: vi.fn(),
  newInstance: vi.fn((): InstanceMock => {
    const id = Math.random().toString();
    const context = "context";
    const busy = false;
    mockBrowserContext.instancesMap.set(id, { id, context, busy });
    return { id, context, busy };
  }),
  closeInstance: vi.fn((id: string) =>
    mockBrowserContext.instancesMap.delete(id)
  ),
  closeAllInstances: vi.fn(() => mockBrowserContext.instancesMap.clear()),
  getInstancesMap: vi.fn(() => mockBrowserContext.instancesMap),
  setIntanceBusy: vi.fn((id: string, busy: boolean) => {
    const instance = mockBrowserContext.instancesMap.get(id);
    if (instance) {
      instance.busy = busy;
    }
  }),
};

vi.mock("../../src/application/services/crawler/browser-context", () => {
  return {
    BrowserContext: vi.fn().mockImplementation(() => mockBrowserContext),
  };
});

describe("Tests for BrowserContext Service", () => {
  let browserService: BrowserContext;

  beforeEach(() => {
    browserService = makeBrowserContext();
  });

  it("should create a new instance", async () => {
    mockBrowserContext.newInstance.mockResolvedValueOnce({
      id: "123",
      context: "context",
      busy: false,
    });
    const instance = await browserService.newInstance();
    expect(instance).toEqual({ id: "123", context: "context", busy: false });
  });

  it("should close a instance", async () => {
    mockBrowserContext.newInstance.mockResolvedValueOnce({
      id: "123",
      context: "context",
      busy: false,
    });
    await browserService.closeInstance("123");
    expect(mockBrowserContext.closeInstance).toHaveBeenCalledWith("123");
  });

  it("should close all instances", async () => {
    mockBrowserContext.newInstance.mockResolvedValueOnce({
      id: "123",
      context: "context",
      busy: false,
    });
    mockBrowserContext.newInstance.mockResolvedValueOnce({
      id: "1234",
      context: "context",
      busy: false,
    });
    await browserService.closeAllInstances();
    expect(mockBrowserContext.closeAllInstances).toHaveBeenCalled();
    expect(browserService.getInstancesMap().size).toBe(0);
  });

  it("should get a free instance", async () => {
    // it's busy true because in the getFreeInstance method we set it to true
    mockBrowserContext.getFreeInstance.mockResolvedValueOnce({
      id: "123",
      context: "context",
      busy: true,
    });
    const instance = await browserService.getFreeInstance();
    expect(instance).toEqual({ id: "123", context: "context", busy: true });
  });
  it("shuld get timeout when get free instance", async () => {
    mockBrowserContext.getFreeInstance.mockRejectedValueOnce(
      new AppError("Operação levou mais tempo que o esperado")
        .setSysMessage("Waiting to long for free browser instance")
        .code(408)
    );
    await expect(browserService.getFreeInstance()).rejects.toThrow(AppError);
  });
});
