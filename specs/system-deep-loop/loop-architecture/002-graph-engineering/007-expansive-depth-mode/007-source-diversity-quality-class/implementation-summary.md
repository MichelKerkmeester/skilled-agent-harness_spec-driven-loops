---
title: "Implementation Summary: derived quality_class for research SOURCE nodes"
description: "The graph upsert step now derives each research SOURCE node's quality_class from where the source lives, from a closed frozen vocabulary, so source diversity counts real kinds of evidence rather than labels a leaf sends."
trigger_phrases:
  - "source diversity quality class"
  - "derived quality_class"
  - "source_diversity_guard"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/007-source-diversity-quality-class"
    last_updated_at: "2026-11-17T21:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "quality_class derived at upsert; four suites pass; fail-before proven"
    next_safe_action: "Final full-suite rerun after phase 014"
    blockers:
      - "None open for this phase; the final full-suite rerun after phase 014 is the remaining check"
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs"
      - ".skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts"
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-source-diversity-quality-class |
| **Completed** | 2026-11-17, merged into integration. Playbook scenario DLR-061 and changelog `changelog/v2.1.1.0.md` written by `@markdown` in integration. The merge gate on the integration branch after this phase merged printed 185 files, 3136 passed, 9 skipped, 1 failed. The one failure is `fanout-pool.vitest.ts` (orphan grace window, 15 ms), which passes 42 of 42 run alone and sits in a file no wave-1 phase changed; the final full-suite rerun decides it |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`upsert.cjs` now sets `quality_class` on every research SOURCE node it stores, derived from the node's `path`, then its label, then its id: the first one that names a real location decides. A URL maps by host (`external-doc` for documentation hosts, `external-other` otherwise). A repo path maps by segment and file type, in order: `repo-test`, `ledger-state`, `repo-spec`, `skill-doc`, `repo-code`. Anything else is `unclassified`. A leaf-supplied value is overwritten. FINDING nodes, other kinds and review nodes keep their metadata exactly as sent. The vocabulary is one frozen exported constant, `SOURCE_QUALITY_CLASS`, beside `SAFE_METADATA_KEYS`, and `upsert.cjs` reads it instead of repeating the names.

### Signal change

`sourceDiversity` now carries real values on normal runs. Before this change no producer set `quality_class`, so the signal only moved for fixtures that typed one in. A question now scores the number of distinct derived classes its findings cite. A question answered only from code files scores 1.0 and still blocks at `source_diversity_guard`, by design (ADR-001). Code plus its tests scores 2.0 and passes. The 1.5 threshold and the averaging rule did not change.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts` | Modified | Exports the frozen `SOURCE_QUALITY_CLASS` vocabulary |
| `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` | Modified | `classifySourceLocation` and `deriveSourceQualityClass`, applied to research SOURCE nodes in the node loop |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/upsert-script.vitest.ts` | Modified | Path-over-label strip case, eight-class derivation case, pass-through case |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-graph-upsert.vitest.ts` | Modified | The workflow upsert step drops a leaf value |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/convergence-script.vitest.ts` | Modified | Seeded fixtures use paths; three source-diversity cases (2.0, 1.0 with guard, code plus tests 2.0) |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/coverage-graph-signals.vitest.ts` | Modified | Seeded fixture uses paths |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Seven one-change DeepSeek V4.1 Flash dispatches on the Pi lane (tests first, then the constant, the helper, the wiring, the upsert-path case and the two fixture moves). The orchestrator read each diff and reran each check. Baseline, fail-before proof and suite runs were done natively. Briefs and results are in `scratch/dispatch/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Derive at upsert, not at query time | Goal D1: one choke point every SOURCE node passes through |
| Frozen object (`SOURCE_QUALITY_CLASS.REPO_CODE` and so on) rather than a frozen array | `upsert.cjs` names classes by key, so the string values live only in the constant |
| First field that names a real location wins (path, then label, then id) | A free-text label must not mask a path, and a URL used as a label still classifies |
| Documentation hosts: `docs.`, `developer.`, `learn.`, `devdocs.` prefixes, `*.readthedocs.io` and a short named list | A host rule the leaf cannot game by wording; other hosts are `external-other` |
| Code-only stays one class and blocks | ADR-001, operator-accepted |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Four named suites | Pass | 4 files, 76 passed, exit 0; baseline 69, plus 7 new cases |
| Fail before, pass after | Pass | With only `upsert.cjs` and `coverage-graph-query.ts` reverted, 14 of 50 cases in the three changed suites failed, all 7 new cases among them; restored, all pass |
| Typecheck | Pass | `npm run -s typecheck` in the runtime folder, exit 0, no output |
| One vocabulary copy | Pass | `rg -n "'repo-code'" scripts lib` prints only `coverage-graph-query.ts:142` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Playbook scenario written** as DLR-061 in `runtime/manual-testing-playbook/coverage-graph/source-quality-class-derivation.md`.
2. **Changelog entry written** as `changelog/v2.1.1.0.md`.
3. **The T007 rg check matches three test inputs.** The strip cases send `quality_class: 'primary'` on purpose, as REQ-001 specifies, so `rg -n "quality_class: '(primary|secondary|tertiary)'"` is clean only over the seeded fixtures.
4. **A dotted id can read as a file.** An id with no path or URL label, such as `src.v2`, classifies as `repo-code` because it looks like a file name. Leaves send `path` on file sources, so this only affects malformed nodes.
<!-- /ANCHOR:limitations -->
