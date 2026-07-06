export function stringToColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 68%, 56%)`
}

export function safeStringify(value) {
  if (value === undefined) return "undefined"
  if (value === null) return "null"
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

export function initialsOf(name) {
  return name.trim().slice(0, 2).toUpperCase()
}
