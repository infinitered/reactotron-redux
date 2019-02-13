import createCustomDispatch from "./customDispatch"

describe("customDispatch", () => {
  it("should send an action to reactotron", () => {
    const mockReactotron = {
      startTimer: () => jest.fn().mockReturnValue(1000),
      reportReduxAction: jest.fn(),
    }
    const mockStore = {
      dispatch: jest.fn(),
    }
    const action = {
      type: "Any Type",
      payload: { allTheSecrets: true },
    }

    const dispatch = createCustomDispatch(mockReactotron, mockStore, {})

    dispatch(action)

    expect(mockStore.dispatch).toHaveBeenCalledWith(action)
    expect(mockReactotron.reportReduxAction).toHaveBeenCalledWith(action, 1000, false)
  })

  it.todo("should handle 'PERFORM_ACTION' actions correctly")
  it.todo("should respect the exclude list")
})
