// ───────────────────────────────────────────────────────────────────
// MODULE: Fleet Mode Surface Map
// ───────────────────────────────────────────────────────────────────
//
// Per-mode surfaces must be derived from a single authoritative source
// rather than assumed, because the legacy projection manifest is shared
// across every flip mode and carries no mode field of its own. Encoding
// the prefix-ownership table here keeps mode→surface attribution in one
// place that cannot silently drift from the frozen mode order.
//
// It is equally important to be honest about emptiness. An empty
// projectable set is dangerous because a reader contract over it passes
// vacuously — it checks nothing and still reports green. Deriving the
// surface set makes that emptiness an explicit, inspectable fact instead
// of letting a caller mistake a vacuous pass for a real one.

import { LEGACY_PROJECTION_MANIFEST } from '../legacy-projections/index.js';
import { AUTHORITY_FLIP_MODE_ORDER } from '../per-mode-authority-flip/index.js';
import type { CutoverCertificateMode } from '../per-mode-authority-flip/index.js';

export const FLEET_MODE_ORDER: readonly CutoverCertificateMode[] = AUTHORITY_FLIP_MODE_ORDER.filter(
  (mode) => mode !== 'deep-research',
);

const SURFACE_PREFIX_OWNERSHIP: Readonly<Record<CutoverCertificateMode, readonly string[]>> = {
  'deep-research': ['research-'],
  'deep-review': ['review-'],
  'deep-ai-council': ['council-'],
  'deep-improvement-common': ['improvement-'],
  'agent-improvement': ['improvement-'],
  'model-benchmark': ['model-benchmark-', 'model-grader-'],
  'skill-benchmark': ['skill-benchmark-'],
  'deep-alignment': ['alignment-'],
};

export interface ModeSurfaceSet {
  readonly mode: CutoverCertificateMode;
  readonly surfaceIds: readonly string[];
  readonly projectableSurfaceIds: readonly string[];
  readonly readers: readonly string[];
  /**
   * skill-benchmark resolves to an empty projectable set because its single
   * surface is retain-legacy-input. A reader contract over an empty set passes
   * without checking anything — a green that means nothing. This flag exists so
   * a caller cannot mistake a vacuous pass for a real one.
   */
  readonly hasProjectableSurface: boolean;

  /**
   * agent-improvement and deep-improvement-common share the improvement- prefix,
   * so a per-mode reader contract cannot separate their surfaces. Surfacing the
   * overlap here keeps that coupling visible instead of letting a caller believe
   * the sets are independent.
   */
  readonly sharedWith: readonly CutoverCertificateMode[];
}

export function deriveModeSurfaceSet(mode: CutoverCertificateMode): ModeSurfaceSet {
  if (!AUTHORITY_FLIP_MODE_ORDER.includes(mode)) {
    throw new TypeError(`Unrecognized fleet mode: ${mode}`);
  }

  const prefixes = SURFACE_PREFIX_OWNERSHIP[mode];

  const matchingEntries = LEGACY_PROJECTION_MANIFEST.filter((entry) =>
    prefixes.some((prefix) => entry.surfaceId.startsWith(prefix)),
  );
  const surfaceIds = matchingEntries.map((e) => e.surfaceId).sort();

  const projectableEntries = matchingEntries.filter((entry) => entry.disposition === 'project');
  const projectableSurfaceIds = projectableEntries.map((e) => e.surfaceId).sort();

  const readerSet = new Set<string>();
  projectableEntries.forEach((entry) => entry.readers.forEach((r) => readerSet.add(r)));
  const readers = Array.from(readerSet).sort();

  const hasProjectableSurface = projectableSurfaceIds.length > 0;

  const sharedWith = AUTHORITY_FLIP_MODE_ORDER.filter((other) => {
    if (other === mode) return false;
    const otherPrefixes = SURFACE_PREFIX_OWNERSHIP[other];
    return otherPrefixes.some((otherPrefix) =>
      prefixes.some((prefix) => prefix === otherPrefix),
    );
  }).sort();

  return {
    mode,
    surfaceIds,
    projectableSurfaceIds,
    readers,
    hasProjectableSurface,
    sharedWith,
  };
}

export function deriveAllModeSurfaceSets(): readonly ModeSurfaceSet[] {
  return FLEET_MODE_ORDER.map(deriveModeSurfaceSet);
}