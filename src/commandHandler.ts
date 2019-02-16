import stateCleaner from "./helpers/stateCleaner"
import pathObject from "./helpers/pathObject"

export default function createCommandHandler(reactotron: any, pluginConfig: PluginConfig) {
  const reduxStore = reactotron.reduxStore

  return ({ type, payload }: { type: string; payload?: any }) => {
    switch (type) {
      // client is asking for keys
      case "state.keys.request":
        const cleanedState = stateCleaner(reduxStore.getState())

        if (!payload.path) {
          reactotron.stateKeysResponse(null, Object.keys(cleanedState))
        } else {
          const filteredObj = pathObject(payload.path, cleanedState)

          reactotron.stateKeysResponse(
            payload.path,
            typeof filteredObj === "object" ? Object.keys(filteredObj) : []
          )
        }

        break

      //   // client is asking for values
      //   case 'state.values.request':
      //     return requestValues(reduxStore.getState(), reactotron, payload.path)

      //   // client is asking to subscribe to some paths
      //   case 'state.values.subscribe':
      //     subscriptions = pipe(flatten, uniq)(payload.paths)
      //     sendSubscriptions()
      //     return

      // server is asking to dispatch this action
      case "state.action.dispatch":
        reduxStore.dispatch(payload.action)
        break

      // server is asking to backup state
      case "state.backup.request":
        // run our state through our onBackup
        const backedUpState = pluginConfig.onBackup(reduxStore.getState())
        reactotron.send("state.backup.response", { state: backedUpState })
        break

      // server is asking to clobber state with this
      case "state.restore.request":
        // run our state through our onRestore
        const restoredState = pluginConfig.onRestore(payload.state, reduxStore.getState())
        reactotron.reduxStore.dispatch({
          type: pluginConfig.restoreActionType,
          state: restoredState,
        })
    }
  }
}
