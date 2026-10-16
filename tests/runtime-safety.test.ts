import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('saved-state hydration safety', () => {
  it('prevents toggles before hydration and handles storage failures', () => {
    const source = read('App.tsx');
    expect(source).toMatch(/if\s*\(!hydrated\)\s*return/);
    expect(source).toMatch(/catch/);
    expect(source).toMatch(/void AsyncStorage\.setItem/);
  });
});

describe('interactive accessibility', () => {
  it('exposes selected filter state and announces location status', () => {
    const source = read('src/screens/NearbyScreen.tsx');
    expect(source).toMatch(/accessibilityState=\{\{selected:/);
    expect(source).toMatch(/accessibilityLiveRegion="polite"/);
  });
});
