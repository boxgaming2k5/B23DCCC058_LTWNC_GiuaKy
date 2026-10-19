import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Map globalThis.jest to vi for full Jest compatibility
if (typeof (globalThis as any).jest === 'undefined') {
  ;(globalThis as any).jest = vi
}
