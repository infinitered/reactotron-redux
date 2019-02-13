export default function createCustomDispatch(
  reactotron: any,
  store: { dispatch: Function },
  pluginConfig: PluginConfig
) {
  return (action: any) => {
    // start a timer
    const elapsed = reactotron.startTimer()

    // call the original dispatch that actually does the real work
    const result = store.dispatch(action)

    // stop the timer
    const ms = elapsed()

    var unwrappedAction = action.type === "PERFORM_ACTION" && action.action ? action.action : action

    // if matchException is true, actionType is matched with exception
    const matchException = (exception, actionType) => {
      if (typeof exception === "string") {
        return actionType === exception
      } else if (typeof exception === "function") {
        return exception(actionType)
      } else if (exception instanceof RegExp) {
        return exception.test(actionType)
      } else {
        return false
      }
    }

    // const matchExceptions = any(
    //   exception => matchException(exception, unwrappedAction.type),
    //   exceptions
    // )

    // action not blacklisted?
    // if matchException is true, action.type is matched with exception
    // if (!matchExceptions) {
    // check if the app considers this important
    let important = false
    //   if (trackerOptions && typeof trackerOptions.isActionImportant === 'function') {
    // important = !!trackerOptions.isActionImportant(unwrappedAction)
    //   }

    reactotron.reportReduxAction(unwrappedAction, ms, important)
    // }

    return result
  }
}
