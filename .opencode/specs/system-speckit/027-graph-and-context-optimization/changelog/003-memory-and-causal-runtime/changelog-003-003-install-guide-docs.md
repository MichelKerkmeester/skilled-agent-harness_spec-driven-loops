---
title: "Changelog: 010/003 Skill-advisor INSTALL_GUIDE and README pluggable layer docs"
description: "Surgical additions to INSTALL_GUIDE.md and README.md documenting the pluggable embedder layer for skill-advisor: new section 12 covering the current default, 6-manifest table, swap mechanism, operator runbook cross-link plus device selection."
trigger_phrases:
  - "skill-advisor install guide embedder"
  - "010/003 changelog"
  - "skill-advisor pluggable layer docs"
  - "INSTALL_GUIDE section 12 choosing an embedder"
  - "skill-advisor README embedder configuration"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack/003-install-guide-docs`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/003-skill-advisor-stack`

### Summary

The skill-advisor docs had no guidance on the pluggable embedder layer that shipped in `010/001`. A new operator landing on either file had no way to identify the current active default, the available alternatives or the correct swap surface. Surgical additions were authored against the actual source-of-truth files rather than the planning-era spec assumptions.

`INSTALL_GUIDE.md` received a new section 12 "Choosing an embedder" covering the current active default (`embeddinggemma-300m` via llama-cpp), a 6-row alternatives table sourced from `registry.ts`, the `setActiveEmbedder(db, name, dim)` swap surface, an operator-runbook cross-link with an explicit "do not flip until `010/004` ships" caveat plus a device selection note. `README.md` received a new "Pluggable embedder layer" subsection in the CONFIGURATION section plus a cross-link row in RELATED DOCUMENTS. Both files were verified against `schema.ts` and `registry.ts` before commit, correcting two planning-era assumptions: gemma remains the active default rather than jina-v3 and the registry holds 6 manifests rather than the 8 the canonical narrative describes.

### Added

- New section 12 "Choosing an embedder" in `INSTALL_GUIDE.md` (~95 lines) covering current default, alternatives table, swap mechanism, runbook cross-link, device selection plus cross-references
- 6-row alternatives table in `INSTALL_GUIDE.md` sourced directly from `registry.ts` (name, dim, backend, tag/path, max input, notes)
- "Pluggable embedder layer" subsection in `README.md` section 5 CONFIGURATION naming all 6 registered candidates and the current active default
- Cross-link row added to `README.md` section 9 RELATED DOCUMENTS pointing to `embedder-pluggability.md`

### Changed

- `INSTALL_GUIDE.md` TOC updated with the new section 12 entry. The prior section 12 "RELATED RESOURCES" renumbered to section 13 with an added embedder-pluggability cross-link.

### Fixed

- None

### Verification

| Check | Result |
|---|---|
| Strict-validate on `003-install-guide-docs/` | 0 errors. 0 warnings |
| `DEFAULT_ACTIVE_EMBEDDER.name === 'embeddinggemma-300m'` per `schema.ts:18-21` | PASS |
| `MANIFESTS.length === 6` per `registry.ts:13-63` | PASS |
| `setActiveEmbedder(db, name, dim)` signature per `schema.ts:97` | PASS |
| Internal links (`embedder-pluggability.md`, `registry.ts`, `adapter.ts`, `schema.ts`, swap-runbook) | PASS |
| Reader walk-through: current default, swap surface, alternatives, deferral caveat accessible in under 5 minutes | PASS |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Modified | New section 12 "Choosing an embedder" added (~92 lines). TOC updated. Prior section 12 renumbered to section 13. |
| `.opencode/skills/system-skill-advisor/README.md` | Modified | New "Pluggable embedder layer" subsection in section 5. Cross-link row added to section 9 RELATED DOCUMENTS. |

### Follow-Ups

- Ship `010/004` writer cross-wiring to close the read/write asymmetry and allow the active pointer to be flipped to jina-v3.
- Add a parity check for the `registry.ts` manifest table against `INSTALL_GUIDE.md` section 12.2 to prevent doc-rot when candidates are added.
- Consider extending the canonical `embedder-pluggability.md` narrative to cover skill-advisor explicitly if cross-skill operator confusion arises.
