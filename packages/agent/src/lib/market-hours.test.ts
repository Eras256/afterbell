import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getMarketSession, isAfterHours } from './market-hours.js';

// All times constructed as UTC instants; America/New_York is UTC-4 (EDT) in September.

test('weekday 17:30 ET (21:30 UTC) is after-hours', () => {
  const d = new Date('2026-09-16T21:30:00Z'); // Wednesday
  assert.equal(getMarketSession(d), 'after-hours');
  assert.equal(isAfterHours(d), true);
});

test('weekday 12:00 ET (16:00 UTC) is regular session', () => {
  const d = new Date('2026-09-16T16:00:00Z');
  assert.equal(getMarketSession(d), 'regular');
  assert.equal(isAfterHours(d), false);
});

test('weekday 06:00 ET (10:00 UTC) is pre-market', () => {
  const d = new Date('2026-09-16T10:00:00Z');
  assert.equal(getMarketSession(d), 'pre-market');
});

test('weekday 21:00 ET (01:00 UTC next day) is closed', () => {
  const d = new Date('2026-09-17T01:00:00Z');
  assert.equal(getMarketSession(d), 'closed');
});

test('Saturday during "after-hours" clock time is closed, not after-hours', () => {
  const d = new Date('2026-09-19T21:30:00Z'); // Saturday
  assert.equal(getMarketSession(d), 'closed');
  assert.equal(isAfterHours(d), false);
});

test('session boundary: 15:59:59 ET is regular, 16:00:00 ET is after-hours', () => {
  const justBefore = new Date('2026-09-16T19:59:59Z');
  const atClose = new Date('2026-09-16T20:00:00Z');
  assert.equal(getMarketSession(justBefore), 'regular');
  assert.equal(getMarketSession(atClose), 'after-hours');
});
