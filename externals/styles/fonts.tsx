// Vite-compatible font loader (replaces next/font/google)
// Since this is a Vite build, we can't use next/font/google which requires Next.js compiler
// Instead, we create compatible objects and inject Google Fonts via CSS

// Helper function to create a font object compatible with next/font/google structure
function createFontObject(fontFamily: string, fallback: string[] = []) {
  const fallbackStr = fallback.length > 0 ? `, ${fallback.join(', ')}` : ''
  return {
    style: {
      fontFamily: `"${fontFamily}"${fallbackStr}`,
    },
    variable: `--font-${fontFamily.toLowerCase().replace(/\s+/g, '-')}`,
  }
}

// Inject Google Fonts CSS if not already injected
if (typeof document !== 'undefined') {
  const fontLinkId = 'google-fonts-vite-loader'
  if (!document.getElementById(fontLinkId)) {
    const link = document.createElement('link')
    link.id = fontLinkId
    link.rel = 'stylesheet'
    link.href =
      'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Fira+Sans:wght@300;400;500;600;700&family=Fira+Mono:wght@400&family=Lato:wght@400&display=swap'
    document.head.appendChild(link)
  }
}

const robotoFallback = [
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Helvetica Neue',
  'Arial',
  'sans-serif',
  'Apple Color Emoji',
  'Segoe UI Emoji',
  'Segoe UI Symbol',
]

export const roboto = createFontObject('Roboto', robotoFallback)

export const firaSans = createFontObject('Fira Sans', robotoFallback)

export const firaMono = createFontObject('Fira Mono', robotoFallback)

export const lato = createFontObject('Lato', robotoFallback)
