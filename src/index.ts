import createCommandHander from "./commandHandler"
import createSendAction from "./sendAction"
import createEnhancer from "./enhancer"
import { DEFAULT_REPLACER_TYPE } from "./reducer"

function reactotronRedux(pluginConfig: PluginConfig = {}) {
  const mergedPluginConfig: PluginConfig = {
    restoreActionType: pluginConfig.restoreActionType || DEFAULT_REPLACER_TYPE,
    onBackup: pluginConfig.onBackup || null,
    onRestore: pluginConfig.onRestore || null,
  }

  return (reactotron: any) => {
    return {
      onCommand: createCommandHander(reactotron, mergedPluginConfig),
      features: {
        createEnhancer: createEnhancer(reactotron, mergedPluginConfig),
        reportReduxAction: createSendAction(reactotron),
      },
    }
  }
}

export { reactotronRedux }
