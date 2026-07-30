---
title: "Implementation Summary: Authority Path and Contract Corrections"
description: "The dead create-skill citations were corrected to sk-create-skill across 15 authority docs, the skill-root metadata contract was brought in line with the module's optional-command-metadata rule, the scratch derived block was labelled non-live, and the schema-conflation correction was recorded."
trigger_phrases:
  - "authority path corrections summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/017-authority-path-corrections"
    last_updated_at: "2026-07-30T14:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Corrected dead citations and stale contract"
    next_safe_action: "Proceed to phase 019 or 020"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/017-authority-path-corrections"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Contract confirmed stale, not the module: command-metadata is hub-optional per the class contract"
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Authority Path and Contract Corrections

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Created** | 2026-07-30 |
| **Track** | sk-doc |
| **Level** | 1 |
| **Completion** | 100% — citations, contract, scratch label, and schema correction all landed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three documentation defects fixed and one correction of the record made.

### Dead authority citations (REQ-001)

Fifteen authority spec/plan documents cited a `sk-doc/create-skill/` path that does not exist — the live packet is `sk-doc/sk-create-skill/`. Every occurrence was corrected to the existing path; historical `review/` and `alignment/` artifacts were left untouched so the record of what was cited at review time stays intact. A search for the dead path now returns nothing in the authority docs, and the corrected path resolves on disk.

### Contract document (REQ-002)

The skill-root metadata contract document stated `command-metadata.json` is **required** for every hub. The implementing module is the authority, and it treats the file as **optional** for hubs: `skill-root-metadata-contract.cjs` places it in `OPTIONAL_BY_CLASS[CLASS_HUB]` (not the required set), with a rationale that requiring it fleet-wide forced command-less hubs to carry an empty-array placeholder nothing reads. This was verified against the live module before editing — the finding held. The doc's class-matrix row, its "Why … is hub-required" section (now "hub-optional"), and its new-hub authoring list were updated to match, citing the module and the deciding packet `019-skill-routing-refactor/021-skill-metadata-json-unification`.

### Scratch artifact (REQ-003)

`010-parent-intent-projection-spike/scratch/sk-doc-derived-patched.json` is a patched experimental derived block a reader could mistake for live state. A `scratch/README.md` now labels the directory non-live and names the authoritative block. Labelling in place was chosen as the least-destructive of the three options; relocate-or-untrack stays an open operator preference.

### Schema-conflation correction (REQ-004)

The synthesis claimed the dead `create-skill` paths sit in **skill-root** metadata and therefore feed advisor scoring. That is wrong. They sit in **spec-folder** metadata prose — an unrelated schema that merely shares filenames (`description.json`/`graph-metadata.json`) with skill-root metadata — and a search of skill-root metadata returns no occurrences. The dead paths had **no routing consequence**. This correction is recorded here so the false claim does not propagate; phase 018 carries it into the finding register.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 15 authority spec/plan docs across the packet | Modified | `create-skill` → `sk-create-skill` citation fix |
| `sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` | Modified | command-metadata required → optional, matching the module |
| `010-parent-intent-projection-spike/scratch/README.md` | Created | Labels the scratch derived block non-live |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Verify each defect against the tree before touching it, then correct only the live surface. The contract finding was confirmed against the module (the authority) before the doc was edited; the citation sweep was scoped to authority spec/plan prose with `review/` and `alignment/` history excluded; the scratch block was labelled rather than moved. Because the citation edits changed authored docs across ten children and the parent, their metadata was re-backfilled afterward so the source-fingerprint integrity check stays green.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Verify the contract finding against the module before editing | A finding is a hypothesis; the module (authority) genuinely treats command-metadata as optional, so the doc was the stale side |
| Correct only live authority citations, not historical artifacts | Editing `review/`/`alignment/` text would rewrite the record of what was cited at the time |
| Label the scratch block in place | The least-destructive option; the operator's relocate-or-untrack preference is left open |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| No dead `create-skill` path in authority docs | grep returns nothing; `sk-create-skill` resolves on disk |
| No double-prefix corruption | grep for `sk-sk-create-skill` returns nothing |
| Contract and module agree | both say command-metadata is hub-optional |
| Scratch block unmistakable | `scratch/README.md` labels it non-live |
| `validate.sh <this-folder> --strict` | Errors: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Citation edits re-drift the touched folders' fingerprints.** Correcting the dead paths in 001/003/004/006/007/008/009/010/011/012 and the parent changed their authored docs, so their metadata was re-backfilled after the edit to keep the integrity check green.
2. **Relocate/untrack of the scratch artifact is left open.** The label makes it unmistakable for live state now; whether to also move or untrack it is an operator preference.
<!-- /ANCHOR:limitations -->
