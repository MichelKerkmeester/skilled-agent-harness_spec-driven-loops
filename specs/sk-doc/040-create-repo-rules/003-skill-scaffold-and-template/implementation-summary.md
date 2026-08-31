---
title: "Implementation Summary: Phase 3: Skill Scaffold and Templates"
description: "The sk-create-repo-rule packet exists with both templates, and phase 2 contract proved itself: the rule template was authored from the contract with the corpus unopened, and a rule generated from it matched all eleven structural assertions the shipped rules pass."
trigger_phrases:
  - "packet scaffolded"
  - "structural parity"
  - "rule template"
  - "router prerequisite"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/040-create-repo-rules/003-skill-scaffold-and-template"
    last_updated_at: "2026-08-31T11:33:09Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Scaffolded the mode packet and proved template parity with the corpus"
    next_safe_action: "Author the creation standards above the structural floor"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-skill-scaffold-and-template"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-skill-scaffold-and-template |
| **Completed** | 2026-08-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`sk-create-repo-rule` exists as a mode packet, with both templates it emits — and the
contract from phase 2 proved itself in the process.

### The result that mattered

The rule template was authored **from `rule-anatomy.md` with the corpus unopened**, then
a real rule was generated from it and run through the same eleven structural assertions
the shipped rules pass. **Eleven of eleven matched.**

That order was the whole design. Copying a shipped rule would have produced a template
that reproduces the corpus while proving nothing about whether the contract is correct.
Authoring from the contract and matching the corpus afterwards is the only sequence where
a wrong contract would have surfaced here rather than at first real use.

### The packet

Seven files, three directories, matching `target-tree.md` including all four of its
deferrals. `SKILL.md` carries the six sections the scaffold contract requires and opens
every path — including retire — by loading the decision tests, because "should this
exist" and "should this still exist" are the same four questions.

### Two templates with different standing

The rule template is what the mode is for. The router template is emitted only when a
repository has no trigger table, because a rule cannot load without one. The router
template is structurally distinct by construction: no frontmatter, no `Fires when`, no
`The rule`, no self-check.

### Create, revise, retire

All three routes are in `SKILL.md`, because a rule supplements the harness rather than
binding it — it can be changed and it can be removed. Retire deletes the file, both router
rows and the governed section's pointer, because a rule removed but still listed is worse
than one left in place.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-create-repo-rule/SKILL.md` | Created | The executable contract, 163 lines |
| `sk-create-repo-rule/README.md` | Created | Reader-facing description |
| `assets/repo-rule-template.md` | Created | What the mode emits |
| `assets/repo-rules-router-template.md` | Created | The prerequisite |
| `references/rule-anatomy.md` | Created | Copied from phase 2 as the generation authority |
| `references/decision-tests.md` | Created | Copied from phase 2 |
| `references/README.md` | Created | Routes decision-tests first, anatomy second |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Sibling first, contract second, corpus last.

Three sibling nested modes were inspected before anything was created, which settled a
question that would otherwise have been an assumption: a nested mode root carries no
`description.json` and no `graph-metadata.json`. Those are hub and standalone-root files.
Guessing would have produced a packet that fails a metadata audit later.

Baselines were captured before the first write — md5 sets for the nine corpus files and
the two hub registration files — so non-disturbance could be proven rather than asserted.
Both came back identical.

Then the templates, from the contract documents alone. Then the check, which is the part
that made the phase worth running as designed rather than as convenience.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Author from the contract, check against the corpus | The reverse order is easier and tests nothing. A copied template passes every check while hiding a defective contract |
| Load the decision tests on every path, retire included | "Should this exist" and "should this still exist" are the same four questions |
| Point `SKILL.md` at the decision tests rather than embed them | Embedding duplicates the authority and the two diverge — the failure the cross-reference doctrine exists to prevent |
| Give the router template its own structure rather than a rule variant | The router shares almost nothing with a rule; forcing one template to emit both produces a router that looks like a rule |
| Inspect three siblings before scaffolding | The root-metadata question had a real answer and assuming it would have been wrong |
| Leave the four deferred directories absent | Each has a precedent for arriving after the skill ships. Cheap is not a reason |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Structural parity, generated rule versus shipped rule | PASS - 11 of 11 assertions matched |
| Frontmatter parses on every packet document | PASS - 7 of 7 |
| `SKILL.md` carries the required sections | PASS - all six present |
| Tree matches `target-tree.md` | PASS - 7 files, 3 directories |
| Deferrals honoured | PASS - all four directories confirmed absent |
| Corpus unchanged | PASS - md5 set identical to baseline |
| Hub registration unchanged | PASS - phase 6 owns it, and it shows |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`changelog/` will not survive a commit.** Git does not track empty directories, and the first version file is phase 7's output. The directory exists on disk and will materialize when phase 7 writes into it. Recorded rather than papered over with a `.gitkeep` that phase 7 would then delete.
2. **Structural parity is not quality.** The generated sample passes every check and is a thin rule. Structure is checkable; whether a rule is worth loading is not, and phase 4's standards carry that bar. This phase claims structure only.
3. **The router template is still unexamined at depth.** It reproduces the shipped router's structure and claims no more. Nobody has asked what a *good* router looks like — inherited from phase 2 and still open, though it matters less now the router is a prerequisite rather than a headline output.
4. **The revise and retire routes are named but not contracted.** `SKILL.md` says what they do; what a removal does to the router rows, the governed pointer and the `version` field is phase 5's problem and is not yet written down.
5. **Nothing routes to the mode yet.** Not a defect — phase 6 owns registration — but the packet is unreachable by the advisor or any command until then, so none of this has been exercised in a real session.
<!-- /ANCHOR:limitations -->

---


