import { vi } from 'vitest'

// Mock window
vi.stubGlobal('window', {
  location: {
    href: 'http://test.com/Tools/Update',
    toString: () => 'http://test.com/Tools/Update',
    replace: vi.fn(),
  },
  open: vi.fn(),
})
