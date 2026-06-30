---
title: "Changelog: Phase 5 Verify and Enforce"
description: "Phase 5 flipped the validators to require a 4-part version for skills, added a corpus-wide CI gate, recorded the sk-doc changelog and re-versioned sk-doc to dogfood the standard and ran the full validation sweep green."
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

> Spec folder: `.opencode/specs/skilled-agent-orchestration/118-frontmatter-versioning/005-verify-and-enforce` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/118-frontmatter-versioning`

### Summary

Phase 5 made the version field enforced so the corpus cannot drift back to unversioned docs. A skill doc without a version now fails validation, and a single CI command checks the whole corpus in a fraction of a second. The required flip was safe because phases 3 and 4 had already populated every in-scope doc. sk-doc also gained a changelog entry for the versioning standard and had its own docs re-versioned to the `1.8.0.0` anchor, so the skill that owns the standard exemplifies it.

### Added

- `check-frontmatter-versions.sh`, a corpus-wide CI and pre-commit gate that wraps the engine `gate` mode, discovers every in-scope doc git-free and exits non-zero on any missing or malformed version while skipping frontmatter-less docs. It runs the full 2,222-file corpus in about 0.17s.
- `changelog/v1.8.0.0.md` recording the versioning-standard release for sk-doc.

### Changed

- `scripts/quick_validate.py` and `scripts/package_skill.py` now error on an absent `version` for skills, with commands kept optional, plus any non-4-part value.
- `references/frontmatter_versioning.md` had its enforcement section marked active.
- `.opencode/skills/sk-doc/**` re-versioned to the `1.8.0.0` anchor across 71 docs using the same engine with `--update` after the changelog bumped the anchor.

### Fixed

No fixes recorded.

### Verification

- `quick_validate.py` on a no-version skill: FAIL with "Missing required 'version'", which confirms enforcement works.
- `quick_validate.py` on a real skill: PASS.
- validator suites for 086, package-regressions and validator: PASS, all green.
- `check-frontmatter-versions.sh` over the full corpus: PASS, exit 0, ok=2210, 12 skipped.
- sk-doc SKILL.md and references re-versioned to `1.8.0.0` and `1.8.0.x`: PASS.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/quick_validate.py`, `scripts/package_skill.py` | Modified | Require a 4-part version for skills |
| `scripts/check-frontmatter-versions.sh` | Created | Corpus-wide CI and pre-commit gate |
| `references/frontmatter_versioning.md` | Modified | Enforcement section marked active |
| `changelog/v1.8.0.0.md` | Created | Records the versioning-standard release |
| `.opencode/skills/sk-doc/**` | Modified | Re-versioned to the 1.8.0.0 anchor across 71 docs |

### Follow-Ups

- The compute manifest is a point-in-time artifact. After sk-doc's re-version it no longer matches sk-doc's on-disk versions, so the standalone gate of presence plus format is the ongoing check rather than `verify --from-manifest`.
- Out-of-scope classes for commands, agents and standalone install_guides are not gated by design. A follow-up packet can bring them in.
- The gate ships as a script and is not yet wired into a specific CI workflow file. Operators add `check-frontmatter-versions.sh` to their pre-commit or CI of choice.
- The two-model deep review runs after this phase and feeds phase 6.
