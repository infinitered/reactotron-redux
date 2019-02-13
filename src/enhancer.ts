import reactotronReducer from "./reducer"
import createCustomDispatch from "./customDispatch"

export default function createEnhancer(reactotron: any, pluginConfig: PluginConfig) {
  return () => createStore => (reducer, ...args) => {
    console.log(createStore)
    console.log(reducer)
    console.log(args)

    const store = createStore(reactotronReducer(reducer, pluginConfig.restoreActionType), ...args)
    reactotron.reduxStore = store

    return {
      ...store,
      dispatch: createCustomDispatch(reactotron, store, pluginConfig),
    }
  }
}
