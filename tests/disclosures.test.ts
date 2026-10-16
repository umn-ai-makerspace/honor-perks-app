import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('store configuration', () => {
  it('sets identifiers, assets, and narrowly explained iOS location permission', () => {
    const config = JSON.parse(read('app.json')).expo;
    expect(config.ios.bundleIdentifier).toBe('com.honorperks.app');
    expect(config.android.package).toBe('com.honorperks.app');
    expect(config.ios.infoPlist.NSLocationWhenInUseUsageDescription).toMatch(/calculate and sort/i);
    expect(config.icon).toMatch(/icon\.png$/);
  });
});

describe('visible prototype disclosure', () => {
  it('labels demo data and planned providers while denying sensitive collection', () => {
    const copy = read('src/content/disclosures.ts');
    expect(copy).toMatch(/sample.*demo/is);
    expect(copy).toMatch(/ID\.me.*planned/is);
    expect(copy).toMatch(/Plaid.*planned/is);
    expect(copy).toMatch(/do not collect.*identity documents/is);
    expect(copy).toMatch(/do not collect.*payment/is);
  });
});
