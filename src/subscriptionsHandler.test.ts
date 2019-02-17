import createSubscriptionHandler from "./subscriptionsHandler"

describe("createSubscriptionHandler", () => {
  describe("sendSubscriptions", () => {
    it("should do nothing if there are no subscriptions", () => {
      const mockReactotron = {
        reduxStore: {
          getState: jest.fn(),
          subscribe: jest.fn(),
        },
        stateValuesChange: jest.fn()
      }

      const handler = createSubscriptionHandler(mockReactotron)

      handler.setSubscriptions([])
      handler.sendSubscriptions()

      expect(mockReactotron.stateValuesChange).toHaveBeenCalledWith({})
    })
  })
})
