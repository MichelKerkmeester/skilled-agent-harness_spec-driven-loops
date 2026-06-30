---
title: "Implementation Summary: Derivation Engine"
description: "Phase 2 built and unit-tested the deterministic frontmatter-version engine: changelog-anchored compute, numstat-gated edit count, idempotent line-wise insertion, and compute/apply/verify modes with a manifest."
trigger_phrases:
  - "frontmatter version engine built"
  - "derivation engine implementation"
  - "numstat gated compute apply verify"
  - "phase 2 derivation engine summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-frontmatter-versioning/002-derivation-engine"
    last_updated_at: "2026-06-23T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built and unit-tested the frontmatter-version compute/apply/verify engine"
    next_safe_action: "Generate the full manifest then apply versions in phase 003"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/scripts/frontmatter-version.mjs"
      - ".opencode/skills/sk-doc/scripts/tests/test_frontmatter_version.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-002-derivation-engine"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "numstat>0 gate gives a milder reduction than the 3-5x estimate; majors still stay low."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-derivation-engine |
| **Completed** | 2026-06-23 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

There is now one deterministic tool that computes the correct 4-part version for any in-scope skill doc and inserts it without ever touching the rest of the frontmatter. It is a self-contained Node script — no build step, unlike the TypeScript dist tooling — so it runs straight from `node`.

### The compute/apply/verify engine

`scripts/frontmatter-version.mjs` resolves each skill's anchor as `max(SKILL.md frontmatter version, highest changelog/v*.md)`, normalizes 3-part to 4-part, and derives a child doc's version as `<skillMajor>.<skillMinor>.0.<W>`. `W` is the numstat-gated edit count: a single `git log --follow --numstat` per file, counting only commits whose own added+deleted lines for that file exceed zero. It has three modes — `compute` (dry-run manifest, CSV + JSON), `apply` (idempotent line-wise insert as the last frontmatter key), and `verify` (every file's version == computed and the field is last before `---`). A SKILL.md reconciles up to its anchor automatically; a child doc's human-set version is preserved unless `--update`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/frontmatter-version.mjs` | Created | The deterministic compute/insert/verify engine |
| `scripts/tests/test_frontmatter_version.mjs` | Created | Fixture-based integration tests (21 assertions) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The engine was authored directly, then driven through a fixture harness that builds an isolated skills tree (via a `--skills-root` test hook) covering every frontmatter variant, runs compute/apply/verify through the real CLI, and asserts behavior. It was also dry-run against the live `sk-code` skill to confirm the anchor and edit counts on real git history.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| numstat>0 gate via one `git log --follow --numstat` per file | The locked mechanism, and one git call per file keeps the 2,500-file run tractable |
| SKILL.md reconciles up to the anchor automatically | Its anchor is `max(own version, changelog)` so it can only move up — safe to update; child docs keep human-set values unless `--update` |
| Line-wise insertion, never YAML re-serialize | Re-serializing reflows and corrupts multi-line `trigger_phrases` block sequences |
| Self-contained `.mjs`, no build step | sk-doc scripts are plain Python/JS; a TS dist pipeline would be dead weight here |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `test_frontmatter_version.mjs` | PASS — 21/21 assertions |
| anchor reconciliation (fm 2.1.0 + changelog 2.3.0.0 -> 2.3.0.0) | PASS |
| 3-part normalization, 5-field + 2-field + no-frontmatter handling | PASS |
| insertion as last key; trigger_phrases array intact | PASS |
| idempotency (second apply is a byte-level no-op) | PASS |
| skip-equal / skip-conflict / --update override | PASS |
| sk-code dry-run (real git): SKILL.md 3.5.0.0, smart_routing 3.5.0.8 | PASS — 126 in-scope files, anchor `max(fm,changelog)` |
| numstat gate on validation_rules.md (raw 31) | PASS — drops the one true zero-line rename commit (-> 30) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The numstat>0 gate reduces inflation less than the planning estimate.** The historical `skill/ -> .opencode/skills/` rename commits also changed lines (e.g. 7/7, 5/5), so they count as real edits; only the single pure 0/0 rename per file is dropped. The user's hard requirement still holds — the major digit stays low (e.g. `3.6.0.30`, not `30.x`). An optional bulk-sweep filter (drop commits touching > N files) was considered but not enabled by default, since the locked mechanism is numstat>0.
2. **The engine only dry-runs here.** Applying to the real corpus is phases 3 (core docs) and 4 (catalogs + playbooks).
3. **`W` is capped at 99** to keep the build segment bounded; nothing in the corpus is expected to approach it.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
