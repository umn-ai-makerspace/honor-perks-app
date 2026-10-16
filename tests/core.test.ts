import { describe, expect, it } from 'vitest';
import { distanceMiles, withDistances } from '../src/domain/distance';
import { filterOffers } from '../src/domain/filterOffers';
import { savedReducer, serializeSaved, deserializeSaved } from '../src/domain/saved';
import { offers, validateOffers } from '../src/data/offers';

describe('distance and sorting', () => {
  it('computes known great-circle distance and sorts nearest first without mutating input', () => {
    expect(distanceMiles({ latitude: 44.9778, longitude: -93.265 }, { latitude: 44.9537, longitude: -93.09 })).toBeCloseTo(8.8, 0);
    const input = [offers[0]!, offers[1]!];
    const result = withDistances(input, { latitude: 44.956, longitude: -93.145 });
    expect(result[0]?.id).toBe('autozone');
    expect(input[0]?.id).toBe('home-depot');
  });
});

describe('offer discovery', () => {
  it('filters by category and searches name, address, category, and terms case-insensitively', () => {
    expect(filterOffers(offers, 'Retail', '').every(o => o.category === 'Retail')).toBe(true);
    expect(filterOffers(offers, 'All', 'RANDOLPH').map(o => o.id)).toContain('walgreens');
    expect(filterOffers(offers, 'All', 'annual limits').map(o => o.id)).toEqual(['home-depot']);
  });
  it('returns all offers for blank search and All category', () => expect(filterOffers(offers, 'All', '  ')).toHaveLength(6));
});

describe('saved offers', () => {
  it('toggles ids idempotently and supports replace hydration', () => {
    let state = savedReducer([], { type: 'toggle', id: 'target' });
    expect(state).toEqual(['target']);
    state = savedReducer(state, { type: 'toggle', id: 'target' });
    expect(state).toEqual([]);
    expect(savedReducer([], { type: 'replace', ids: ['target', 'target', 'bad'], validIds: offers.map(o => o.id) })).toEqual(['target']);
  });
  it('round-trips storage safely and rejects malformed data', () => {
    expect(deserializeSaved(serializeSaved(['target']))).toEqual(['target']);
    expect(deserializeSaved('{oops')).toEqual([]);
  });
});

describe('offer data', () => {
  it('preserves six valid offers with explicit status and secure source/directions links', () => {
    expect(offers).toHaveLength(6);
    expect(validateOffers(offers)).toEqual([]);
    for (const offer of offers) {
      expect(['confirmed', 'seasonal', 'unconfirmed']).toContain(offer.status);
      expect(offer.sourceUrl).toMatch(/^https:\/\//);
      expect(offer.directionsUrl).toMatch(/^https:\/\//);
    }
  });
});
