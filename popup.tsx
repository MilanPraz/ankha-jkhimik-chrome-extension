import { useEffect, useState } from "react"
import browser from "webextension-polyfill"

// @ts-ignore: module declaration for gif not found
import eyeGif from "./assets/eye.gif"

import "./style.css"

function IndexPopup() {
  const [enabled, setEnabled] = useState(false)
  const [interval, setInterval] = useState(20)

  // Restore settings
  useEffect(() => {
    if (!browser?.storage?.sync) {
      return
    }

    browser.storage.sync.get(["enabled", "interval"]).then((result) => {
      if (typeof result.enabled === "boolean") {
        setEnabled(result.enabled)
      }
      if (typeof result.interval === "number") {
        setInterval(result.interval)
      }
    })
  }, [])

  // Save settings
  useEffect(() => {
    if (!browser?.storage?.sync) {
      return
    }
    browser.storage.sync.set({
      enabled,
      interval
    })
  }, [enabled, interval])

  return (
    <div className="min-w-[320px] h-[360px] bg-sky-50 flex flex-col rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-sky-400 to-sky-600 text-white rounded-t-lg">
        <img
          src={eyeGif}
          alt="Blink Reminder"
          className="w-12 h-12 rounded-full bg-white"
        />
        <div>
          <h2 className="text-lg font-semibold">Ankha Jhimik</h2>
          <p className="text-xs opacity-90">
            Blink your eyes, save your sight 👀
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 space-y-4">
        <h4 className="font-medium text-sky-700">Control Panel</h4>

        {/* Enable toggle */}
        <div className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
          <span className="text-sm font-medium">Enable Reminder</span>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-6 rounded-full transition ${
              enabled ? "bg-sky-500" : "bg-gray-300"
            }`}>
            <div
              className={`w-5 h-5 bg-white rounded-full transform transition ${
                enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Interval slider */}
        <div className="bg-white p-3 rounded shadow-sm">
          <div className="flex justify-between text-sm mb-2">
            <span>Reminder Interval</span>
            <span className="font-semibold text-sky-600">{interval} min</span>
          </div>

          <input
            type="range"
            min={5}
            max={60}
            step={5}
            value={interval}
            disabled={!enabled}
            onChange={(e) => setInterval(Number(e.target.value))}
            className="w-full accent-sky-500"
          />

          <p className="text-xs text-gray-500 mt-2">
            You’ll get a gentle reminder to blink.
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 pb-2">
        Take care of your eyes 💙
      </div>
    </div>
  )
}

export default IndexPopup
