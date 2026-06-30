---
title: "Changelog: Phase 2 Derivation Engine"
description: "Phase 2 built and unit-tested the deterministic frontmatter-version engine with changelog-anchored compute, numstat-gated edit count, idempotent line-wise insertion and compute apply verify modes plus a manifest."
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

> Spec folder: `.opencode/specs/skilled-agent-orchestration/118-frontmatter-versioning/002-derivation-engine` (Level 1)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/118-frontmatter-versioning`

### Summary

Phase 2 built one deterministic tool that computes the correct 4-part version for any in-scope skill doc and inserts it without touching the rest of the frontmatter. The engine is a self-contained Node script so it runs straight from `node` with no build step. It resolves each skill's anchor as `max(SKILL.md frontmatter version, highest changelog/v*.md)`, normalizes 3-part to 4-part and derives a child doc version as `<skillMajor>.<skillMinor>.0.<W>`. `W` is the numstat-gated edit count from a single `git log --follow --numstat` per file that counts only commits whose own added plus deleted lines for that file exceed zero. The engine only dry-runs in this phase. Applying to the real corpus is phases 3 and 4.

### Added

- `scripts/frontmatter-version.mjs`, the deterministic compute insert verify engine with three modes. `compute` produces a dry-run manifest as CSV and JSON, `apply` does an idempotent line-wise insert as the last frontmatter key and `verify` confirms every file version equals the computed value and the field sits last before the closing `---`.
- `scripts/tests/test_frontmatter_version.mjs`, a fixture-based integration suite that builds an isolated skills tree through a `--skills-root` test hook, runs compute apply verify through the real CLI and asserts behavior.

### Changed

No changes to existing files. Both engine artifacts are new.

### Fixed

No fixes recorded.

### Verification

- `test_frontmatter_version.mjs`: PASS at 21 of 21 assertions.
- anchor reconciliation from frontmatter 2.1.0 and changelog 2.3.0.0 to 2.3.0.0: PASS.
- 3-part normalization plus 5-field, 2-field and no-frontmatter handling: PASS.
- insertion as the last key with the trigger_phrases array intact: PASS.
- idempotency where a second apply is a byte-level no-op: PASS.
- skip-equal, skip-conflict and `--update` override: PASS.
- sk-code dry-run on real git history with SKILL.md at 3.5.0.0 and smart_routing at 3.5.0.8 across 126 in-scope files: PASS.
- numstat gate on validation_rules.md drops the one true zero-line rename commit from a raw 31 to 30: PASS.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/frontmatter-version.mjs` | Created | The deterministic compute insert verify engine with compute, apply, verify and gate modes |
| `scripts/tests/test_frontmatter_version.mjs` | Created | Fixture-based integration tests at 21 assertions |

### Follow-Ups

- Phase 3 applies the manifest to the 457 core skill docs.
- Phase 4 applies the manifest to the 1,753 feature-catalog and testing-playbook docs.
- The numstat gate reduces inflation less than the planning estimate because line-changing rename commits still count as edits. The major digit stays low, which satisfies the hard requirement. An optional bulk-sweep filter that drops commits touching more than N files was considered and left disabled by default.
- `W` is capped at 99 to keep the build segment bounded.
