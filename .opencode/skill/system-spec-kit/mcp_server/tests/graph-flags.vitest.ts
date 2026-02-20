// @ts-nocheck
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  isGraphUnifiedEnabled,
  isGraphMMREnabled,
  isGraphAuthorityEnabled,
} from '../lib/search/graph-flags';

// ---------------------------------------------------------------
// TESTS: Graph Search Feature Flags
// ---------------------------------------------------------------

describe('Graph Feature Flags', () => {
  // Capture original env state before each test and restore after.
  let originalUnified: string | undefined;
  let originalMMR: string | undefined;
  let originalAuthority: string | undefined;

  beforeEach(() => {
    originalUnified  = process.env.SPECKIT_GRAPH_UNIFIED;
    originalMMR      = process.env.SPECKIT_GRAPH_MMR;
    originalAuthority = process.env.SPECKIT_GRAPH_AUTHORITY;
  });

  afterEach(() => {
    // Restore: delete key if it was originally absent, otherwise reset value.
    if (originalUnified === undefined) {
      delete process.env.SPECKIT_GRAPH_UNIFIED;
    } else {
      process.env.SPECKIT_GRAPH_UNIFIED = originalUnified;
    }

    if (originalMMR === undefined) {
      delete process.env.SPECKIT_GRAPH_MMR;
    } else {
      process.env.SPECKIT_GRAPH_MMR = originalMMR;
    }

    if (originalAuthority === undefined) {
      delete process.env.SPECKIT_GRAPH_AUTHORITY;
    } else {
      process.env.SPECKIT_GRAPH_AUTHORITY = originalAuthority;
    }
  });

  // ---------------------------------------------------------------
  // 1. Returns false when env var is undefined
  // ---------------------------------------------------------------
  describe('returns false when env var is undefined', () => {
    it('isGraphUnifiedEnabled returns false when SPECKIT_GRAPH_UNIFIED is undefined', () => {
      delete process.env.SPECKIT_GRAPH_UNIFIED;
      expect(isGraphUnifiedEnabled()).toBe(false);
    });

    it('isGraphMMREnabled returns false when SPECKIT_GRAPH_MMR is undefined', () => {
      delete process.env.SPECKIT_GRAPH_MMR;
      expect(isGraphMMREnabled()).toBe(false);
    });

    it('isGraphAuthorityEnabled returns false when SPECKIT_GRAPH_AUTHORITY is undefined', () => {
      delete process.env.SPECKIT_GRAPH_AUTHORITY;
      expect(isGraphAuthorityEnabled()).toBe(false);
    });
  });

  // ---------------------------------------------------------------
  // 2. Returns false when env var is an empty string
  // ---------------------------------------------------------------
  describe('returns false when env var is an empty string', () => {
    it('isGraphUnifiedEnabled returns false when SPECKIT_GRAPH_UNIFIED is empty string', () => {
      process.env.SPECKIT_GRAPH_UNIFIED = '';
      expect(isGraphUnifiedEnabled()).toBe(false);
    });

    it('isGraphMMREnabled returns false when SPECKIT_GRAPH_MMR is empty string', () => {
      process.env.SPECKIT_GRAPH_MMR = '';
      expect(isGraphMMREnabled()).toBe(false);
    });

    it('isGraphAuthorityEnabled returns false when SPECKIT_GRAPH_AUTHORITY is empty string', () => {
      process.env.SPECKIT_GRAPH_AUTHORITY = '';
      expect(isGraphAuthorityEnabled()).toBe(false);
    });
  });

  // ---------------------------------------------------------------
  // 3. Returns true when env var is exactly 'true'
  // ---------------------------------------------------------------
  describe("returns true when env var is exactly 'true'", () => {
    it("isGraphUnifiedEnabled returns true when SPECKIT_GRAPH_UNIFIED is 'true'", () => {
      process.env.SPECKIT_GRAPH_UNIFIED = 'true';
      expect(isGraphUnifiedEnabled()).toBe(true);
    });

    it("isGraphMMREnabled returns true when SPECKIT_GRAPH_MMR is 'true'", () => {
      process.env.SPECKIT_GRAPH_MMR = 'true';
      expect(isGraphMMREnabled()).toBe(true);
    });

    it("isGraphAuthorityEnabled returns true when SPECKIT_GRAPH_AUTHORITY is 'true'", () => {
      process.env.SPECKIT_GRAPH_AUTHORITY = 'true';
      expect(isGraphAuthorityEnabled()).toBe(true);
    });
  });

  // ---------------------------------------------------------------
  // 4. Returns false for non-exact truthy strings (strict equality)
  // ---------------------------------------------------------------
  describe("returns false for 'TRUE', '1', and 'yes' (strict string equality enforced)", () => {
    it("isGraphUnifiedEnabled returns false when SPECKIT_GRAPH_UNIFIED is 'TRUE' (uppercase)", () => {
      process.env.SPECKIT_GRAPH_UNIFIED = 'TRUE';
      expect(isGraphUnifiedEnabled()).toBe(false);
    });

    it("isGraphMMREnabled returns false when SPECKIT_GRAPH_MMR is '1'", () => {
      process.env.SPECKIT_GRAPH_MMR = '1';
      expect(isGraphMMREnabled()).toBe(false);
    });

    it("isGraphAuthorityEnabled returns false when SPECKIT_GRAPH_AUTHORITY is 'yes'", () => {
      process.env.SPECKIT_GRAPH_AUTHORITY = 'yes';
      expect(isGraphAuthorityEnabled()).toBe(false);
    });
  });
});
