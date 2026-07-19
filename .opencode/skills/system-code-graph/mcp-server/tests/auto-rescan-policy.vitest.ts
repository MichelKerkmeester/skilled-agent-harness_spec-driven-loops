// ───────────────────────────────────────────────────────────────
// TEST: Auto-Rescan Policy safety gate
// ───────────────────────────────────────────────────────────────
import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  scopeFingerprintsMatchOrLegacy: vi.fn(),
}));

vi.mock('../lib/index-scope-policy.js', () => ({
  scopeFingerprintsMatchOrLegacy: mocks.scopeFingerprintsMatchOrLegacy,
}));

import {
  shouldAutoRescan,
  DEFAULT_PARSE_DIAGNOSTICS_BACKLOG_THRESHOLD,
  type AutoRescanScope,
} from '../lib/auto-rescan-policy.js';

const scopeA: AutoRescanScope = { fingerprint: 'code-graph-scope:v2:scope-a' };
const scopeB: AutoRescanScope = { fingerprint: 'code-graph-scope:v2:scope-b' };

describe('auto-rescan-policy', () => {
  describe('scope fingerprint matching', () => {
    it('allows auto-rescan when stored scope matches active scope and backlog is zero', () => {
      mocks.scopeFingerprintsMatchOrLegacy.mockReturnValue(true);

      const decision = shouldAutoRescan({
        storedScope: scopeA,
        activeScope: scopeA,
        parseDiagnosticsBacklog: 0,
      });

      expect(decision.allowed).toBe(true);
      expect(decision.blockReason).toBeUndefined();
      expect(mocks.scopeFingerprintsMatchOrLegacy).toHaveBeenCalledWith(
        scopeA.fingerprint,
        scopeA.fingerprint,
      );
    });

    it('blocks with scope_mismatch when fingerprints differ', () => {
      mocks.scopeFingerprintsMatchOrLegacy.mockReturnValue(false);

      const decision = shouldAutoRescan({
        storedScope: scopeA,
        activeScope: scopeB,
        parseDiagnosticsBacklog: 0,
      });

      expect(decision.allowed).toBe(false);
      expect(decision.blockReason).toBe('scope_mismatch');
    });
  });

  describe('parse diagnostics backlog', () => {
    it('blocks with parse_error_backlog when backlog exceeds default threshold of 0', () => {
      mocks.scopeFingerprintsMatchOrLegacy.mockReturnValue(true);

      const decision = shouldAutoRescan({
        storedScope: scopeA,
        activeScope: scopeA,
        parseDiagnosticsBacklog: 1,
      });

      expect(decision.allowed).toBe(false);
      expect(decision.blockReason).toBe('parse_error_backlog');
    });

    it('allowed when backlog is within relaxed threshold', () => {
      mocks.scopeFingerprintsMatchOrLegacy.mockReturnValue(true);

      const decision = shouldAutoRescan({
        storedScope: scopeA,
        activeScope: scopeA,
        parseDiagnosticsBacklog: 5,
        parseDiagnosticsBacklogThreshold: 10,
      });

      expect(decision.allowed).toBe(true);
    });

    it('allows when backlog exactly equals threshold (backlog > threshold fails)', () => {
      mocks.scopeFingerprintsMatchOrLegacy.mockReturnValue(true);

      const decision = shouldAutoRescan({
        storedScope: scopeA,
        activeScope: scopeA,
        parseDiagnosticsBacklog: 5,
        parseDiagnosticsBacklogThreshold: 5,
      });

      expect(decision.allowed).toBe(true);
      expect(decision.blockReason).toBeUndefined();
    });

    it('backlog at exactly 0 with threshold 0 is allowed', () => {
      mocks.scopeFingerprintsMatchOrLegacy.mockReturnValue(true);

      const decision = shouldAutoRescan({
        storedScope: scopeA,
        activeScope: scopeA,
        parseDiagnosticsBacklog: 0,
        parseDiagnosticsBacklogThreshold: 0,
      });

      expect(decision.allowed).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('treats NaN parseDiagnosticsBacklog as 0', () => {
      mocks.scopeFingerprintsMatchOrLegacy.mockReturnValue(true);

      const decision = shouldAutoRescan({
        storedScope: scopeA,
        activeScope: scopeA,
        parseDiagnosticsBacklog: NaN,
      });

      expect(decision.allowed).toBe(true);
    });

    it('treats negative parseDiagnosticsBacklog as 0', () => {
      mocks.scopeFingerprintsMatchOrLegacy.mockReturnValue(true);

      const decision = shouldAutoRescan({
        storedScope: scopeA,
        activeScope: scopeA,
        parseDiagnosticsBacklog: -5,
      });

      expect(decision.allowed).toBe(true);
    });

    it('scope_mismatch takes priority over parse_error_backlog', () => {
      mocks.scopeFingerprintsMatchOrLegacy.mockReturnValue(false);

      const decision = shouldAutoRescan({
        storedScope: scopeA,
        activeScope: scopeB,
        parseDiagnosticsBacklog: 10,
      });

      expect(decision.allowed).toBe(false);
      expect(decision.blockReason).toBe('scope_mismatch');
    });

    it('uses DEFAULT_PARSE_DIAGNOSTICS_BACKLOG_THRESHOLD (0) when no threshold provided', () => {
      expect(DEFAULT_PARSE_DIAGNOSTICS_BACKLOG_THRESHOLD).toBe(0);
    });
  });
});
