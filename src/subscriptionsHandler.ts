import pathObject from "./helpers/pathObject"

export default function createSubscriptionHandler(reactotron: any) {
  const reduxStore = reactotron.reduxStore
  let subscriptions: string[] = []

  function setSubscriptions(subs: string[]) {
    subscriptions = subs
  }

  function getChanges() {
    const state = reduxStore.getState()

    const changes = []

    subscriptions.forEach(path => {
      let cleanedPath = path
      let starredPath = false

      if (path.endsWith("*")) {
        // Handle the star!
        starredPath = true
        cleanedPath = path.substr(0, path.length - 2)
      }

      const values = pathObject(cleanedPath, state)

      if (starredPath && cleanedPath) {
        changes.push(
          ...Object.entries(values).map(val => ({
            path: `${cleanedPath}.${val[0]}`,
            values: val[1],
          }))
        )
      } else {
        changes.push({ path: cleanedPath, values })
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

  reduxStore.subscribe(sendSubscriptionsIfNeeded)

  return {
    sendSubscriptions,
    sendSubscriptionsIfNeeded,
    setSubscriptions,
  }
}
