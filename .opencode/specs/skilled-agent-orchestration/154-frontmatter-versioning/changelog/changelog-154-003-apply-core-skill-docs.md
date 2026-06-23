---
title: "Changelog: Phase 3 Apply Core Skill Docs"
description: "Phase 3 versioned the 457 core skill docs from the engine manifest, normalized 12 SKILL.md including the four pre-existing 3-part files and verified the result deterministically plus a read-only MiMo audit."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-23

> Spec folder: `.opencode/specs/skilled-agent-orchestration/154-frontmatter-versioning/003-apply-core-skill-docs` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/154-frontmatter-versioning`

### Summary

Phase 3 made every core skill doc self-report its version. The engine computed the full corpus once at 2,222 files in 9.5 minutes into a manifest, then phase 3 applied the core slice of SKILL.md, README.md, references and assets straight from that manifest with no further git, so the apply was instant. 457 core docs now carry a 4-part version. 422 were fresh inserts, 23 were already correct and 12 SKILL.md files were reconciled or normalized. The stale ones moved up to their changelog anchor, and the four pre-existing 3-part files were canonicalized to 4-part. 12 frontmatter-less docs were skipped because the engine never synthesizes a frontmatter block.

### Added

- A 4-part `version` field on 422 core docs that had none before, sourced from the precomputed manifest.

### Changed

- 12 SKILL.md files reconciled or normalized: stale ones moved up to their changelog anchor, with system-spec-kit going `3.4.1.0` to `3.6.0.0` and deep-research reaching `1.14.0.0`. The four pre-existing 3-part files for `deep-loop-workflows`, `deep-loop-runtime`, `sk-design-md-generator` plus one mode packet were canonicalized to 4-part.
- `scripts/tests/test_frontmatter_version.mjs` gained the 3-part-normalization regression case.

### Fixed

- A normalization skip bug in `scripts/frontmatter-version.mjs`. apply now compares the raw version rather than the normalized value, so a 3-part `1.0.0` no longer normalizes to `1.0.0.0` and gets `skip-equal`'d while the malformed 3-part stays on disk. The `gate` mode caught this defect that `verify` did not, and the fix was re-applied and re-gated to green.

### Verification

- Phase 3 apply across the core classes: 457 versioned, 12 skip-no-frontmatter, 4 normalized.
- `verify` over the core classes: PASS, exit 0, ok=457.
- `gate` over the core classes after the normalization fix: PASS, exit 0, ok=457, 12 skipped.
- unit suite: PASS at 21 of 21 with the new 3-part normalization case.
- MiMo v2.5 Pro read-only audit on sk-code-review confirmed asset, reference and README values correct, 4-part, last-key and with trigger_phrases intact.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/*/{SKILL.md, README.md, references/**, assets/**}` | Modified | Inserted or normalized 4-part version across 457 docs |
| `scripts/frontmatter-version.mjs` | Modified | Fixed a normalization skip bug so apply compares the raw version |
| `scripts/tests/test_frontmatter_version.mjs` | Modified | Added the 3-part-normalization regression case |

### Follow-Ups

- Phase 4 applies the same manifest to the 1,753 feature-catalog and testing-playbook docs.
- 12 frontmatter-less core docs carry no version because a versioning pass never synthesizes one. The gate skips them rather than failing.
- Around 7 pre-existing SKILL.md keep their version mid-block rather than as the last key. The value is correct so the position was left as-is to avoid churn.
