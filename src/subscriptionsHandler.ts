import pathObject from "./helpers/pathObject"

export default function createSubscriptionHandler(
  reactotron: any,
  onReduxStoreCreation: (func: () => void) => void
) {
  let subscriptions: string[] = []

  function setSubscriptions(subs: string[]) {
    subscriptions = subs
  }

  function getChanges() {
    const state = reactotron.reduxStore.getState()

    const changes = []

    subscriptions.forEach(path => {
      let cleanedPath = path
      let starredPath = false

      if (path && path.endsWith("*")) {
        // Handle the star!
        starredPath = true
        cleanedPath = path.substr(0, path.length - 2)
      }

      const values = pathObject(cleanedPath, state)

      if (starredPath && cleanedPath) {
        changes.push(
          ...Object.entries(values).map(val => ({
            path: `${cleanedPath}.${val[0]}`,
            value: val[1],
          }))
        )
      } else {
        changes.push({ path: cleanedPath, value: values })
      }
    })

    return changes
  }

  function sendSubscriptions() {
    const changes = getChanges()
    reactotron.stateValuesChange(changes)
  }

  function sendSubscriptionsIfNeeded() {
    const changes = getChanges()

    if (changes.length > 0) {
      reactotron.stateValuesChange(changes)
    }
  }

  onReduxStoreCreation(() => {
    reactotron.reduxStore.subscribe(sendSubscriptionsIfNeeded)
  })

  return {
    sendSubscriptions,
    sendSubscriptionsIfNeeded,
    setSubscriptions,
  }
}
