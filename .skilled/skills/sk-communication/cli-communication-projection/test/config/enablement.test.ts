import { afterEach, describe, expect, it } from 'vitest';
import {
  isProjectionEnabled,
  PROJECTION_ENABLE_ENV,
  resolveProjectionEnablement,
} from '../../src/config/enablement.js';

describe('resolveProjectionEnablement', () => {
  it('is disabled when neither source opts in', () => {
    expect(resolveProjectionEnablement(undefined, null)).toBe(false);
    expect(resolveProjectionEnablement('', null)).toBe(false);
    expect(resolveProjectionEnablement('   ', null)).toBe(false);
    expect(resolveProjectionEnablement(undefined, { enabled: false })).toBe(false);
  });

  it('enables on a truthy environment value', () => {
    for (const value of ['1', 'true', 'TRUE', 'on', ' on ']) {
      expect(resolveProjectionEnablement(value, null)).toBe(true);
    }
  });

  it('stays disabled on a falsey or unknown environment value', () => {
    for (const value of ['0', 'false', 'no', 'off', 'yes-ish']) {
      expect(resolveProjectionEnablement(value, null)).toBe(false);
    }
  });

  it('enables from the local override only when the env var is unset', () => {
    expect(resolveProjectionEnablement(undefined, { enabled: true })).toBe(true);
    // env wins: an explicit off overrides a local opt-in
    expect(resolveProjectionEnablement('0', { enabled: true })).toBe(false);
  });

  it('ignores a malformed local override', () => {
    expect(resolveProjectionEnablement(undefined, { enabled: 'yes' })).toBe(false);
    expect(resolveProjectionEnablement(undefined, {})).toBe(false);
  });
});

describe('isProjectionEnabled', () => {
  const priorValue = process.env[PROJECTION_ENABLE_ENV];

  afterEach(() => {
    if (priorValue === undefined) {
      delete process.env[PROJECTION_ENABLE_ENV];
    } else {
      process.env[PROJECTION_ENABLE_ENV] = priorValue;
    }
  });

  it('honors an explicit environment opt-in', () => {
    process.env[PROJECTION_ENABLE_ENV] = '1';
    expect(isProjectionEnabled()).toBe(true);
  });

  it('honors an explicit environment opt-out over any local file', () => {
    process.env[PROJECTION_ENABLE_ENV] = '0';
    expect(isProjectionEnabled()).toBe(false);
  });
});
