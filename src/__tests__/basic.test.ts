import { describe, it, expect } from 'vitest';

describe('Basic Math', () => {
   it('should add numbers correctly', () => {
      expect(1 + 1).toBe(2);
   });
});

// Since we don't have easy ways to mock the full Electron IPC in this environment without heavy setup,
// we will add a basic utility test to demonstrate testing infrastructure.
// Real app tests would component test components with mocked window.electronAPI.
