import { createContext, useEffect, useState } from 'react'

// Also read by the inline script in index.html.
const STORAGE_KEY = 'scaneto.theme'

export const ThemeContext = createContext(undefined)

function getInitialTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Only explicit choices are stored, so users who never picked keep following the default.
  function setTheme(next) {
    setThemeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage unavailable (private browsing): the theme still applies for this session.
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
