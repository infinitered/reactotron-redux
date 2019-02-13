import createCommandHandler from "./commandHandler"
import { DEFAULT_REPLACER_TYPE } from "./reducer"

// TODO: Write more tests around onBackup and onRestore.

const defaultPluginConfig: PluginConfig = {
  restoreActionType: DEFAULT_REPLACER_TYPE,
  onBackup: (state: any) => state,
  onRestore: (restoringState: any) => restoringState,
}

describe("commandHandler", () => {
  it("should create a function when called", () => {
    const commandHandler = createCommandHandler({}, defaultPluginConfig)

    expect(typeof commandHandler).toEqual("function")
  })

  it.todo("should handle a 'state.keys.request' command type")
  it.todo("should handle a 'state.values.request' command type")
  it.todo("should handle a 'state.values.subscribe' command type")

  it("should handle a 'state.action.dispatch' command type", () => {
    const reactotronMock = {
      reduxStore: {
        dispatch: jest.fn(),
      },
    }
    const commandHandler = createCommandHandler(reactotronMock, defaultPluginConfig)

    commandHandler({ type: "state.action.dispatch", payload: { action: { type: "Do a thing." } } })

    expect(reactotronMock.reduxStore.dispatch).toHaveBeenCalledWith({ type: "Do a thing." })
  })

  it("should handle a 'state.backup.request' command type", () => {
    const reactotronMock = {
      reduxStore: {
        getState: jest.fn().mockReturnValue({ myState: true }),
      },
      send: jest.fn(),
    }

    const commandHandler = createCommandHandler(reactotronMock, defaultPluginConfig)

    commandHandler({ type: "state.backup.request" })

    expect(reactotronMock.reduxStore.getState).toHaveBeenCalledTimes(1)
    expect(reactotronMock.send).toHaveBeenCalledWith("state.backup.response", {
      state: { myState: true },
    })
  })

  it("should handle a 'state.restore.request' command type", () => {
    const reactotronMock = {
      reduxStore: {
        getState: jest.fn(),
        dispatch: jest.fn(),
      },
    }

    const commandHandler = createCommandHandler(reactotronMock, defaultPluginConfig)

    commandHandler({ type: "state.restore.request", payload: { state: { myReplacedState: true } } })

    expect(reactotronMock.reduxStore.dispatch).toHaveBeenCalledWith({
      type: DEFAULT_REPLACER_TYPE,
      state: { myReplacedState: true },
    })
  })
})
