---
title: "Implementation Summary: Phase 16: fix-stale-compiled-routing-docs-and-research-workflow"
description: "Compiled-routing comments and docs now say five hubs and name the current directories, both resolver copies match so a promotion no longer undoes a correction, and the research workflows' validator checks run again."
trigger_phrases:
  - "stale compiled routing text summary"
  - "phase 16 results"
  - "retired template headers rule fixed"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/016-fix-stale-compiled-routing-docs-and-research-workflow"
    last_updated_at: "2026-09-19T05:09:41Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Corrected the stale text and the rule lists, recompiled the deep research contract"
    next_safe_action: "Operator decides which side changes for the refused spec-mutation audit events"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md"
      - ".skilled/commands/deep/assets/deep-research-auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which side changes for the refused spec-mutation audit events: the ledger schema or the spec-check protocol?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-fix-stale-compiled-routing-docs-and-research-workflow |
| **Completed** | 2026-09-19 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A hub author reading the compiled-routing reference now learns the cohort that actually serves and the directories that actually exist. The research workflows' validator checks also run again, after failing on every call since a rule they named was retired.

### The cohort and the layout

Compiled routing serves five hubs, and the resolver, the advisor and a test header each said seven. The architecture reference said seven too, pointed at `006-parent-hub-rollout`, `010-live-activation` and `011-runtime-engine`, which were renamed to `009`, `013` and `014`, and told a hub author to model their build on sk-design, which was dissolved. All of that now matches the code. The reference's admission step also changed: it describes the gold check the operator chose on 2026-09-19 and says plainly that it is not built, so no tool can admit a new hub yet.

### The two resolver copies

Phase 13 corrected the promoted resolver's comment but not its authored source. The promotion tool copies the source over the runtime, so the next promotion would have brought the old wording back. Both copies now carry the same comment and are byte-identical. The route guard never noticed the difference because it compares only the activation manifests.

### The retired rule

Both research workflows passed `TEMPLATE_HEADERS` to the validator in two places each. That rule was retired on 2026-08-29 in `fd33222d92b`, when heading grading was dropped, and the validator refuses a whole rule list that names a rule it lacks. So the spec check after pre-init and the one after synthesis never ran as written. The rule is gone from all four lists, and the deep research contract, which records a digest of both workflows, was recompiled.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` and its authored source | Modified | Cohort comment, identical in both |
| `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts` | Modified | Cohort comment and resolver path |
| `.skilled/bin/compiled-routing-foundation.vitest.ts` | Modified | Header comment |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md` | Modified | Cohort, layout, model build, admission step |
| `../013-clear-pre-existing-ci-and-doc-debt/implementation-summary.md` | Modified | Hub count |
| `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml` | Modified | Rule lists |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.md` | Regenerated | Workflow digests |
| `../015-compiled-serving-admission-research/spec.md`, `implementation-summary.md` | Modified | Records the operator's choice of admission bar |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One commit on `worktrees/055-skilled-source-root-migration`, through the git hooks with no bypass variable. Before editing, the inventories traced every same-class hit, how the guard and the promotion tool treat the two resolver copies, and when and why the rule was retired.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Edit the authored resolver as well as the promoted one | The promotion step copies the source over the runtime, so a runtime-only edit is lost |
| Leave the refused spec-mutation audit events alone | The ledger schema pins them on purpose, the workflows require them, and choosing which side gives way is the operator's |
| Leave eight system-spec-kit files that still name the retired rule | Same class, different owner; they are docs, playbook scenarios and fixtures, and none is called by the research workflows |
| Keep the reference's seven-hub mention in its history link | It describes the cohort at cutover, which is what the linked handover records |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Bin vitest suite | 2 files, 46 pass |
| Route guard | All five hubs fresh |
| Contract drift | All three deep commands OK after the recompile |
| Node gate | 89 files, 1,007 pass, 0 fail |
| Deep-loop suite | 154 files, 2,684 pass, 8 skipped, 0 fail |
| Rule list | Old list refused; new list `RESULT: PASSED` |
| Reference | `validate_document.py`: valid, 0 issues |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The spec-mutation audit events still cannot be recorded.** The append gateway refuses all seven by design, so the research workflows' write-back and seed steps leave no ledger row. This needs a decision on which side changes.
2. **Eight system-spec-kit files still name `TEMPLATE_HEADERS`:** `references/workflows/spec-folder-write-recipe.md`, four manual playbook scenarios and three validator test fixtures.
3. **`create.sh` breaks the parent phase map when it adds a phase.** It writes the new row after the table's closing blank line, outside the table; phases 15 and 16 both needed the row moved by hand.
4. **The advisor's local build predates its comment change.** The build output is untracked and the change is a comment, so nothing serves differently until the next rebuild.
<!-- /ANCHOR:limitations -->

---
