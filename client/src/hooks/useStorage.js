import {useEffect, useState} from 'react'

const PREFIX = 'whatsapp-clone-'

export const useStorage = (key, initialValue) => {
    const prefixedKey = PREFIX + key
  const [value, setValue] = useState(() => {
    const jsonValue = sessionStorage.getItem(prefixedKey)
    if (jsonValue != null) return JSON.parse(jsonValue)
    if (typeof initialValue === 'function') {
      return initialValue()
    } else {
      return initialValue
    }
  })

  useEffect(() => {
    sessionStorage.setItem(prefixedKey, JSON.stringify(value))
  }, [prefixedKey, value])

  return [value, setValue]
}
