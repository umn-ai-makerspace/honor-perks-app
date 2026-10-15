import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = (name) => readFile(new URL(name, root), 'utf8');

test('app has three accessible bottom navigation tabs', async () => {
  const html = await read('index.html');
  for (const tab of ['Home', 'Nearby', 'Profile']) {
    assert.match(html, new RegExp(`data-view="${tab.toLowerCase()}"[^>]*[\\s\\S]*?${tab}`, 'i'));
  }
  assert.match(html, /role="tablist"/);
});

test('app exposes home, nearby map, and profile views', async () => {
  const html = await read('index.html');
  for (const view of ['home', 'nearby', 'profile']) {
    assert.match(html, new RegExp(`id="${view}-view"`));
  }
  assert.match(html, /id="discount-map"/);
});

test('discount data is maintained in a dedicated locations file', async () => {
  const source = await read('locations.js');
  const transformed = source.replace('export const places', 'globalThis.places');
  const context = { globalThis: {} };
  vm.runInNewContext(transformed, context);
  const places = context.globalThis.places;
  assert.ok(Array.isArray(places));
  assert.ok(places.length >= 6);
  for (const place of places) {
    assert.equal(typeof place.name, 'string');
    assert.equal(typeof place.discount, 'string');
    assert.equal(typeof place.lat, 'number');
    assert.equal(typeof place.lng, 'number');
    assert.match(place.sourceUrl, /^https:\/\//);
    assert.match(place.directionsUrl, /^https:\/\//);
  }
});

test('project has deployment metadata and privacy disclosure', async () => {
  const [pkg, html] = await Promise.all([read('package.json'), read('index.html')]);
  const json = JSON.parse(pkg);
  assert.ok(json.scripts.test);
  assert.ok(json.scripts.start);
  assert.match(html, /Honor Perks does not store military documents/i);
  assert.match(html, /ID\.me/i);
  assert.match(html, /Plaid/i);
  assert.match(html, /demo profile/i);
  assert.match(html, /third-party map and font providers receive standard network information/i);
});

test('nearby distances are computed and sortable instead of hard-coded', async () => {
  const source = await read('app.js');
  assert.match(source, /function distanceMiles\(/);
  assert.match(source, /sort\(\(a, b\) => a\.distanceMiles - b\.distanceMiles\)/);
  assert.doesNotMatch(source, /distance:'[0-9.]+ mi'/);
});

test('tabs and filters expose complete accessibility state', async () => {
  const html = await read('index.html');
  assert.match(html, /role="tabpanel"/);
  assert.match(html, /aria-pressed="true"/);
  assert.match(html, /id="profile-preview-note"/);
});
