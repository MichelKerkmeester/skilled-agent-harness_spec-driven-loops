// ───────────────────────────────────────────────────────────────
// MODULE: Shared-factory parity tests
// ───────────────────────────────────────────────────────────────
// Proves the canonical embedder factory surface is identical when
// resolved through skill-advisor's local re-export shim and through the
// direct @spec-kit/shared import. The shim path is what production
// callers in skill-advisor use; the shared path is what mk-spec-memory
// uses. Both must return equivalent adapter objects (same name + dim +
// backend) and the same MANIFESTS array reference, otherwise the shared
// extraction has silently drifted.
//
// Offline-safe: no Ollama daemon required. The adapter construction
// path is exercised but `embed()` is not called.
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import {
  getAdapter as getAdapterViaShim,
  getManifest as getManifestViaShim,
  listManifests as listManifestsViaShim,
  listSupportedDimensions as listSupportedDimensionsViaShim,
  MANIFESTS as MANIFESTS_VIA_SHIM,
  NotImplementedError as NotImplementedErrorViaShim,
} from '../../lib/embedders/registry.js';

import {
  getAdapter as getAdapterViaShared,
  getManifest as getManifestViaShared,
  listManifests as listManifestsViaShared,
  listSupportedDimensions as listSupportedDimensionsViaShared,
  MANIFESTS as MANIFESTS_VIA_SHARED,
  NotImplementedError as NotImplementedErrorViaShared,
} from '@spec-kit/shared/embeddings/registry.js';

describe('shared-factory parity: skill-advisor shim path vs @spec-kit/shared path', () => {
  it('exports the same MANIFESTS reference through both paths', () => {
    expect(MANIFESTS_VIA_SHIM).toBe(MANIFESTS_VIA_SHARED);
    expect(MANIFESTS_VIA_SHIM).toHaveLength(1);
  });

  it('exports the same NotImplementedError class through both paths', () => {
    expect(NotImplementedErrorViaShim).toBe(NotImplementedErrorViaShared);
  });

  it('returns identical manifest lookups for every registered name', () => {
    for (const manifest of MANIFESTS_VIA_SHIM) {
      expect(getManifestViaShim(manifest.name)).toBe(getManifestViaShared(manifest.name));
    }
  });

  it('returns equivalent adapters for the production-default manifest', () => {
    const viaShim = getAdapterViaShim('nomic-embed-text-v1.5');
    const viaShared = getAdapterViaShared('nomic-embed-text-v1.5');

    expect(viaShim).toBeDefined();
    expect(viaShared).toBeDefined();

    // The adapter is constructed per-call (new OllamaAdapter), so object
    // identity differs. The contract that matters is the shape: same name,
    // same dim, same backend, same prefix tokens.
    expect(viaShim?.name).toBe(viaShared?.name);
    expect(viaShim?.dim).toBe(viaShared?.dim);
    expect(viaShim?.backend).toBe(viaShared?.backend);
    expect(viaShim?.prefixQuery).toBe(viaShared?.prefixQuery);
    expect(viaShim?.prefixDocument).toBe(viaShared?.prefixDocument);
    expect(typeof viaShim?.embed).toBe('function');
    expect(typeof viaShim?.ready).toBe('function');
  });

  it('returns equivalent adapters for the local-cascade default (nomic-embed-text-v1.5)', () => {
    const viaShim = getAdapterViaShim('nomic-embed-text-v1.5');
    const viaShared = getAdapterViaShared('nomic-embed-text-v1.5');

    expect(viaShim?.name).toBe(viaShared?.name);
    expect(viaShim?.dim).toBe(viaShared?.dim);
    expect(viaShim?.backend).toBe(viaShared?.backend);
    // nomic requires query + document prefixes
    expect(viaShim?.prefixQuery).toBe('search_query: ');
    expect(viaShim?.prefixDocument).toBe('search_document: ');
  });

  it('listManifests returns identical references through both paths', () => {
    expect(listManifestsViaShim()).toBe(listManifestsViaShared());
  });

  it('listSupportedDimensions returns the same dimensions through both paths', () => {
    const shimDims = listSupportedDimensionsViaShim();
    const sharedDims = listSupportedDimensionsViaShared();
    expect(shimDims).toEqual(sharedDims);
  });

  it('returns undefined for an unknown manifest name through both paths', () => {
    expect(getAdapterViaShim('this-manifest-does-not-exist')).toBeUndefined();
    expect(getAdapterViaShared('this-manifest-does-not-exist')).toBeUndefined();
  });

  it('returns undefined for the purged baseline through both paths (parity gate)', () => {
    expect(getManifestViaShim('embeddinggemma-300m')).toBeUndefined();
    expect(getManifestViaShared('embeddinggemma-300m')).toBeUndefined();
  });
});
