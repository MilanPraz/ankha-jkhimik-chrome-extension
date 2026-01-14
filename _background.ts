export {} // REQUIRED by Plasmo

const api = globalThis.chrome

if (!api) {
  console.warn("Chrome API not available")
} else {
  api.runtime.onInstalled.addListener(init)
  api.runtime.onStartup.addListener(init)
  api.runtime.onMessage.addListener(init)

  api.alarms?.onAlarm.addListener((alarm) => {
    if (alarm.name === "blink-reminder") {
      api.notifications?.create({
        type: "basic",
        iconUrl: "gen-assets/icon128.plasmo.png",
        title: "👀 Blink Reminder",
        message: "Blink your eyes gently for 20 seconds.",
        priority: 1
      })
    }
  })
}

function init() {
  const api = globalThis.chrome
  if (!api?.storage?.sync || !api?.alarms) return

  // Listen for storage changes SAFELY
  api.storage.onChanged.addListener((changes) => {
    api.alarms.clearAll()

    if (changes.enabled?.newValue) {
      createAlarm(changes.interval?.newValue || 20)
    }
  })

  // Initial restore
  api.storage.sync.get(["enabled", "interval"], (data) => {
    if (data?.enabled) {
      createAlarm(data.interval || 20)
    }
  })
}

function createAlarm(interval: number) {
  chrome.alarms.create("blink-reminder", {
    periodInMinutes: interval
  })
}
