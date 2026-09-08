---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "canonical save split summary"
  - "registry one to one status"
  - "multiplexed rule verification evidence"
  - "not started continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/032-recorded-findings-closure/002-multiplexed-rule-split"
    last_updated_at: "2026-09-07T19:05:00Z"
    last_updated_by: "template-author"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "Implement child 003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:6b116d58944ceaf0a047117112f217ccfa24cf1832687ab95bb46c8d5d7396a0"
      session_id: "scaffold-002-multiplexed-rule-split"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-multiplexed-rule-split |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Five registry rows shared one wrapper and one Node helper whose switch selected the rule from an environment variable the orchestrator set only for that basename. The switch is gone. A shared module builds the packet context every canonical-save rule reads, the description, the graph, the root spec and the child directories, and each rule is its own module of one decision with its own wrapper. The registry maps each row to its own script, the orchestrator calls the same two-argument run_check for every row, and the README lists the five wrappers.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/rules/check-canonical-save-shared.cjs` | Created | Packet context and the bridge emitter, built once |
| `runtime/cli/rules/check-canonical-save-{root-spec,source-docs,lineage,packet-identity,description-graph-freshness}.cjs` | Created | One decision each |
| `runtime/cli/rules/check-canonical-save-{root-spec,source-docs,lineage,packet-identity,description-graph-freshness}.sh` | Created | One wrapper each with the standard header |
| `runtime/cli/rules/check-canonical-save.sh`, `check-canonical-save-helper.cjs` | Deleted | The multiplex |
| `runtime/cli/lib/validator-registry.json` | Modified | Five rows point at their own scripts |
| `runtime/lib/validation/orchestrator.ts` | Modified | Basename special case removed |
| `runtime/cli/rules/README.md` | Modified | Tree and table |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The helper's shared section became the context module and each switch case became a module by mechanical rewrite, with the message strings restored where the rewrite had reached them. The registry, the orchestrator and the README changed after the modules passed a syntax check; the runtime and CLI were rebuilt; the four suites and the validation lane ran. The commit was assembled in a private index.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One shared context module rather than five copies of the reading | The rules differ only in their decision; the packet reading is one thing |
| Keep the wrapper protocol and messages byte-identical | The canonical-save suite asserts on them and needed no edit |
| Leave the spec-doc-structure family alone | Its five rules already dispatch to five functions with their own messages |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check` on six modules, `bash -n` on five wrappers | exit 0 |
| Runtime and CLI builds, `npm run check`, dist freshness | exit 0, every output fresh |
| canonical-save-validation, registry coverage, help lists every rule, registry doc count | 4 files, 10 tests pass |
| Validation lane | 98, 31 and 83 checks pass |
| Registry rows | 5 distinct script paths of 5; 39 rows before and after; help lists 41 rule lines with 5 canonical-save rows |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Five wrappers share their shape** They are generated from one template and differ in their rule id and module name only; a wrapper convention change touches five files.
<!-- /ANCHOR:limitations -->

---
