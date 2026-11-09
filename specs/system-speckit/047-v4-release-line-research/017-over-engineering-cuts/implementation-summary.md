---
title: "Implementation Summary"
description: "The unread branch-leases-waves module, its suite and two unread chart palette sheets are gone, and every doc, manifest and fixture that named them matches the tree."
trigger_phrases:
  - "over engineering cuts implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/017-over-engineering-cuts"
    last_updated_at: "2026-11-09T00:00:00Z"
    last_updated_by: "remediation-orchestrator-a"
    recent_action: "Closed the phase with the final gate green"
    next_safe_action: "Report to the lead"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-a-017"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-over-engineering-cuts |
| **Completed** | 2026-11-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The deep-loop runtime no longer ships 3,165 lines no code runs, and the chart Style Reference no longer ships two palette sheets nothing opens.

### Phase 17: over-engineering-cuts

`branch-leases-waves` and its 18-case suite are deleted. Its two type-only importers now declare the fields they read: `conditional-fanin/types.ts` carries structural branch and lease shapes, and the substrate port is an opaque object, since no mode reads through it. The ordered and categorical palette sheets and their screenshots are deleted; the neutral sheet and `source-globals.css` stay, because docs cite them. Docs, the sk-design leaf manifest and four fixtures match the tree.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/branch-leases-waves/**`, `runtime/tests/unit/branch-leases-waves.vitest.ts` | Deleted | Unread module and suite |
| `runtime/lib/mode-contracts/substrate-ports.ts`, `runtime/lib/conditional-fanin/types.ts` | Modified | Local types |
| `ARCHITECTURE.md` and six system-deep-loop READMEs | Modified | No pointer at a missing path |
| `sk-design-chart/assets/style-reference/evilcharts/palette-sheet-{ordered,categorical}.html` and screenshots | Deleted | Unread assets |
| `.skilled/skills/sk-design/leaf-manifest.json` | Modified | Matches the tree |
| sk-doc `code-folder/{durable-directory-manifest,baseline-readme-verdicts}.json` | Regenerated | Owned by their test generators |
| spec-kit `retrieval/fixtures/{corpus-manifest,generation-diagnostics,phrase-variants}.json`, `runtime/data/trigger-index.json` | Regenerated | Owned by `generate-trigger-index.mjs` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two DeepSeek workers made the deletions and type edits. The orchestrator regenerated the fixtures with their generators, dropped the one verdict-baseline entry the generator still listed because the deleted README was still tracked, reviewed the diff and reran every check.

| Suite | Command | Baseline | Final |
|-------|---------|----------|-------|
| Deep-loop vitest | `npx vitest run --no-coverage` in `runtime/` | 174 files, 2884 passed | 173 files, 2868 passed, 8 skipped, exit 0 |
| Deep-loop typecheck | `npm run --silent typecheck` | exit 0 | exit 0 |
| sk-design package | `validate_skill_package.py .skilled/skills/sk-design` | exit 0 | exit 0 |
| sk-design parent check | `parent-skill-check.cjs .skilled/skills/sk-design` | 0 warnings | 0 warnings |
| Compiled-route guard | `compiled-route-guard.cjs` | all fresh | all fresh |
| README manifest | `test_readme_manifest.py` | reproducible | reproducible |
| README verdict parity | `test_readme_verdict_parity.py` | 989 files, diff 0 | 1143 files, diff 0 |
| Retrieval tests | four trigger-index and grep-convention files | 209 passed | 209 passed |
| Trigger index | `generate-trigger-index.mjs --check` | exit 1 (stale) | see Verification |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete only files a scan shows nothing reads (ADR-001) | The lead's per-file condition |
| Keep `source-globals.css` | `origin.md` and a changelog cite it |
| Regenerate fixtures with their own generators | Each has a documented writer |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deep-loop suite and typecheck | PASS |
| sk-design package, parent check, guard | PASS |
| sk-doc fixture tests | PASS |
| Retrieval tests | PASS: 209 passed |
| `rg` for each deleted name outside `specs/` | PASS: no output |
| Trigger index | regenerated last, immediately before the commit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The regenerated fixtures carry drift from earlier work.** The trigger index was stale before this phase and the verdict baseline predates 154 READMEs, so their diffs are larger than the cuts alone.
2. **`fanout-pool.cjs` still describes a dormant wave-planner contract** with no consumer left.
<!-- /ANCHOR:limitations -->

---
