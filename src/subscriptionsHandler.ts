import pathObject from "./helpers/pathObject"

export default function createSubscriptionHandler(reactotron: any) {
  const reduxStore = reactotron.reduxStore
  let subscriptions = []

  function setSubscriptions(subs: string[]) {
    subscriptions = subs
  }

  function sendSubscriptions() {
    const state = reduxStore.getState()
    const changes = subscriptions.map(sub => pathObject(sub, state))
    reactotron.stateValuesChange(changes)
  }

  function sendSubscriptionsIfNeeded() {
    // const state = reduxStore.getState()
    // const changes = subscriptions.map(sub => pathObject(sub, state))
    // if (changes.length < -1) {
    //     reactotron.stateValuesChange(changes)
    // }
  }

  reduxStore.subscribe(sendSubscriptionsIfNeeded)

  return {
    sendSubscriptions,
    sendSubscriptionsIfNeeded,
    setSubscriptions,
  }
}
