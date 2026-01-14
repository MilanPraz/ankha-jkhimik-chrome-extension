export {} // REQUIRED by Plasmo

const ALARM_NAME = "blink-reminder"

chrome.runtime.onInstalled.addListener(init)
chrome.runtime.onStartup.addListener(init)

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return

  // Only react if enabled or interval actually changed
  if (!changes.enabled && !changes.interval) return

  // console.log("[BG] storage changed:", changes)

  chrome.storage.sync.get(["enabled", "interval"], (data) => {
    chrome.alarms.get(ALARM_NAME, (existingAlarm) => {
      if (!data.enabled) {
        console.log("[BG] disabled → clearing alarm")
        chrome.alarms.clear(ALARM_NAME)
        return
      }

      const interval = data.interval || 20

      // If alarm already exists with same interval → do nothing
      if (existingAlarm && existingAlarm.periodInMinutes === interval) {
        console.log("[BG] alarm already correct, skipping recreate")
        return
      }

      // console.log("[BG] (re)creating alarm every", interval, "minutes")
      createAlarm(interval)
    })
  })
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== ALARM_NAME) return

  // console.log("[BG] 🔔 alarm fired")

  chrome.notifications.create({
    type: "basic",
    iconUrl: chrome.runtime.getURL("/assets/eye.png"),
    // iconUrl: chrome.runtime.getURL("gen-assets/icon128.plasmo.png"),
    // iconUrl:"https://png.pngtree.com/png-vector/20251203/ourlarge/pngtree-black-eye-and-camera-shutter-aperture-logo-icon-vector-graphic-design-png-image_18107509.webp",
    title: "👀 Blink Reminder",
    message: "Blink your eyes gently for 20 seconds.",
    priority: 2
  })
})

function init() {
  // console.log("[BG] init")

  chrome.storage.sync.get(["enabled", "interval"], (data) => {
    if (!data?.enabled) return

    const interval = data.interval || 20

    chrome.alarms.get(ALARM_NAME, (existingAlarm) => {
      if (existingAlarm && existingAlarm.periodInMinutes === interval) {
        // console.log("[BG] alarm already exists on init")
        return
      }

      // console.log("[BG] creating alarm on init:", interval)
      createAlarm(interval)
    })
  })
}

function createAlarm(interval: number) {
  chrome.alarms.clear(ALARM_NAME)

  chrome.alarms.create(ALARM_NAME, {
    delayInMinutes: interval, // REQUIRED
    periodInMinutes: interval
  })
}
