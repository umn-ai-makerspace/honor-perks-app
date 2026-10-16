import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('release-readiness regressions', () => {
  it('recenters the native map when a device location is supplied', () => {
    const source = read('src/components/MapPanel.native.tsx');
    expect(source).toMatch(/animateToRegion/);
    expect(source).toMatch(/useEffect/);
  });

  it('does not present fake Terms and Directions actions on summary cards', () => {
    const source = read('src/components/OfferCard.tsx');
    expect(source).not.toMatch(/>Terms</);
    expect(source).not.toMatch(/>Directions</);
  });

  it('declares export compliance and only foreground location purpose copy', () => {
    const config = JSON.parse(read('app.json')).expo;
    expect(config.ios.config.usesNonExemptEncryption).toBe(false);
    expect(config.plugins).toContainEqual([
      'expo-location',
      { locationWhenInUsePermission: expect.stringMatching(/calculate and sort/i) },
    ]);
  });
});
