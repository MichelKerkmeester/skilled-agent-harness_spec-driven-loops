---
title: "Implementation Summary: closing the inherited failures"
description: "Four red gates, four different causes, none of them large, and one of them was never the defect it reported."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/007-close-inherited-failures"
    last_updated_at: "2026-09-06T16:22:20Z"
    last_updated_by: "claude-code"
    recent_action: "Closed all four inherited gate failures"
    next_safe_action: "Run phase 008 against the renamed modes"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md"
      - ".opencode/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-close-inherited-failures |
| **Completed** | 2026-09-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every gate this packet left red is closed, and nothing was deleted to get there.

### The four FLOWCHART fixtures

They asserted `sk-doc` owns FLOWCHART, which the cutover made false. Three were pure FLOWCHART
scenarios; the fourth paired one mode from each hub, and the typed-gold gate is per-hub by design, so
it could validate under neither.

All four moved into a `sk-design` hub playbook this phase created, as renames with their ids intact.
`SD-007` was repointed from document-quality-versus-flowchart to chart-versus-flowchart, an ambiguity
the receiving hub genuinely owns. Its narrative was rewritten alongside its contract, and both the
fixture and the new index state plainly that its meaning changed, so a reader of the 2026-07-21
benchmark reports is not left assuming continuity.

### The scenario that was never missing its criteria

`SD-CR-001` reported "missing or empty pass/fail criteria (null-criteria scenario)". It carried a full
three-clause PASS/FAIL/SKIP section the whole time, under a heading reading `Pass / Fail`. The parser
matches `Pass/Fail Criteria`. The fix was a heading, not content — writing new criteria would have
duplicated a section already there.

### Two malformed spec documents

One had `trigger_phrases: []` where the field is required non-empty. The other closed a `decisions`
anchor it never opened, which the parser reported as an orphaned close at line 65.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-doc/manual-testing-playbook/{holdout,resource-loading,unknown-fallback}/*` | Renamed (4) | Moved to the hub that owns their mode |
| `sk-design/manual-testing-playbook/manual-testing-playbook.md` | Created | The receiving corpus index |
| `sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md` | Modified | Repointed and its narrative rewritten |
| All four moved fixtures | Modified | A relative gate path that broke on arrival |
| `sk-doc/manual-testing-playbook/manual-testing-playbook.md` | Modified | Ranges, rows and the holdout summary |
| `sk-doc/manual-testing-playbook/compiled-routing/bundle-rules-compiled-routing.md` | Modified | Heading renamed to the parsed form |
| `019/015/010-learning-overlay/implementation-summary.md` | Modified | Empty required field |
| `019/015/023-sk-design-dissolution-routing-reactivation/decision-record.md` | Modified | Anchor opened before its close |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Behind the rename, so the fixtures moved once onto their final mode names. Each gate was re-run with
`--strict` and its output read; without `--strict` the typed-gold gate prints `verdict=FAIL` and exits
0, which is how four blocked fixtures read as a pass for most of this packet's life.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Repoint the cross-hub fixture rather than retire it | Operator instruction. It preserves tracked coverage and the report lineage keyed to its id. |
| Keep every id | Benchmark reports from 2026-07-21 key their results to them; a renamed id orphans that history. |
| Say the meaning changed, in the fixture and the index | A repointed scenario under an old id is misleading unless the change is stated where a reader will find it. |
| Rename the heading rather than write criteria | The criteria existed. Writing more would have duplicated them. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Before | After |
|------|--------|-------|
| `validate-playbook-topology --strict` sk-doc | `valid=28 blocked=4`, exit 1 | `valid=28 blocked=0`, exit 0 |
| `validate-playbook-topology --strict` sk-design | no corpus | `valid=4 blocked=0`, exit 0 |
| `validate-compiled-routing-scenarios --strict` | `pass=0 fail=1`, exit 1 | `pass=1 fail=0`, exit 0 |
| `validate.sh --strict` on 019/015 | 23 of 25 | 25 of 25 |
| Fleet metadata / leaf manifests / derived | 13/13 | 13/13, unchanged |
| `skill_graph_validate` | 0 errors | 0 errors |
| `check-corpus.cjs --render` | `RESULT: PASSED` | `RESULT: PASSED` |
| Compiled-routing guard | all fresh | all fresh |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`SD-007` no longer tests what its published report describes.** The report from 2026-07-21
   records a document-quality-versus-flowchart tie; the fixture now models chart-versus-flowchart. The
   id is deliberately unchanged so the report still resolves, and the divergence is stated in both the
   fixture and the design hub's index.
2. **The design hub's playbook is small and new.** Four scenarios covering one mode's resource loading,
   one cross-canvas ambiguity and two holdout probes. It is a relocated corpus, not a designed one.
3. **A relative path inside a fixture's source table is not gated.** The four moved fixtures each
   pointed at a sibling the receiving hub does not have, and nothing would have reported it.
<!-- /ANCHOR:limitations -->

---
