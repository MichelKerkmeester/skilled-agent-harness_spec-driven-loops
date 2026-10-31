---
title: "Implementation Summary"
description: "A parent goal.md now has one limit, 4000 durable characters. The 3000 warning tier is gone from the manifest, the validator, goal.cjs, the OpenCode plugin and every document that quoted it, so nothing warns or reports a non-ok budget at or below 4000."
trigger_phrases:
  - "parent goal limit"
  - "goal durable budget"
  - "goal warning tier"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/040-goal-parent-single-limit"
    last_updated_at: "2026-09-25T16:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Aligned runtime goal budgeting with the validator and updated 49 goal documents"
    next_safe_action: "Operator review, then commit; nothing is staged"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/templates/spec-kit-docs.json"
      - ".skilled/hooks/goal/lib/goal-slice.cjs"
      - ".skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-040-goal-parent-single-limit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "4000 is the one parent goal limit; the operator named it"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 040-goal-parent-single-limit |
| **Completed** | 2026-09-25 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A parent goal can now use its full 4000 characters without a warning. Before this, the validator warned past 3000 and `goal.cjs packet` reported `packet_budget=warn`, and an agent cut a real parent goal to 2998 characters because of it.

### Make 4000 characters the one limit for a parent goal durable slice

The manifest holds one number, `goalDurableBudget.errorChars: 4000`. The validator fails a phase parent or top-level `goal.md` past it and says nothing below it. `goal.cjs` and the OpenCode plugin report `ok` up to 4000 and `over` past it, and `bind` prints `past the 4000-character limit` only when over. A manifest that still carries the old `warnChars` is read as the one limit, so the old number cannot come back from a stale copy. What counts as the durable slice did not change.

The runtime now budgets exactly the goals the validator budgets. A phase parent nested inside another packet used to read `unknown` in `goal.cjs` while `validate.sh` failed it past 4000. The goal-slice module now mirrors the validator's phase level: the spec kit's phase-parent classifier, including its generator-hardening switch, then the level a folder's `spec.md` declares. A plain phase child stays unbudgeted.

The 49 goal documents scaffolded before this change carried the old "warns past 3000" note in their slice. Each now carries the template's new wording, and each packet's graph metadata was re-derived so its source fingerprint matches.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `skills/system-spec-kit/templates/spec-kit-docs.json` | Modified | Drop `warnChars`; `errorChars: 4000` is the limit |
| `skills/system-spec-kit/runtime/lib/templates/level-contract-resolver.ts` | Modified | One-limit budget type and resolver |
| `skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` | Modified | Remove the warning branch of `SPECDOC_SUFFICIENCY_005` |
| `hooks/goal/lib/goal-slice.cjs` | Modified | One-limit resolver; budget state is `ok`, `over` or `unknown`; a nested phase parent is budgeted by the validator's rule |
| `hooks/goal/bin/goal.cjs` | Modified | Bind warning only past the limit, naming it |
| `.opencode/plugins/opencode-goal.js` | Modified | Same bind warning, same wording |
| `skills/system-spec-kit/templates/addons/goal.md.tmpl` | Modified | The slice note states one 4000 limit |
| `skills/system-spec-kit/references/validation/validation-rules.md` | Modified | Rule table, severity, scope and examples |
| `skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | Modified | Overview, cut guidance and worked example |
| `skills/system-spec-kit/README.md`, root `README.md`, `hooks/goal/goal-plugin.md` | Modified | State the one limit |
| `hooks/goal/lib/goal-slice.test.cjs` | Modified | Boundary test on a manifest with the old tier; nested parent, plain child, hardening switch and declared-level tests |
| 49 `goal.md` files under `specs/` and their `graph-metadata.json` | Modified | The new slice note, and the re-derived fingerprint (paths from the repository root) |
| `skills/system-spec-kit/runtime/tests/spec-doc-structure.vitest.ts` | Modified | A phase parent at 3200 and 4000 passes with no diagnostic |
| `skills/system-spec-kit/runtime/cli/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Modified | The new template note |

Paths are under `.skilled/` unless stated otherwise.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Copies of the AI Systems phase parent 075 were padded to 3500, 4000 and 4001 durable characters in a scratch workspace. Before the change, 3500 and 4000 reported `packet_budget=warn` and a `SPECDOC_SUFFICIENCY_005` warning. After it, 2998, 3500 and 4000 report `ok` and pass `validate.sh`, and 4001 reports `over` and fails. `goal.cjs bind` and the OpenCode `bind` were run on the same copies with isolated state directories. The new goal-slice boundary test was run against the previous module and fails there.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the warning tier rather than raise it to 4000 | Two numbers read as two limits; one number cannot be misread |
| Keep the manifest key `errorChars` | A workspace with an older manifest still resolves the limit, and old and new readers agree on it |
| Same bind warning on both surfaces | `goal.cjs` exists to match the OpenCode plugin one to one |
| Leave released changelogs, decision records and log rows alone | They record what was true at the time |
| Mirror the validator's phase level exactly, declared level included | The validator budgets a folder whose `spec.md` declares the phase level even before it has children |
| Re-derive graph metadata with the repair tool | A document edit invalidates the stored fingerprint, and the repair tool is how the repository refreshes it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Runtime dist build and `tsc --noEmit` | PASS, both exit 0 |
| Goal hook suites (`node --test`) | PASS: goal-slice 17 of 17, goal-core 74, goal.cjs 7, cursor 15, devin 3, pi 21 |
| OpenCode plugin goal suites | 145 of 147, the same two failures as the baseline before the change |
| `spec-doc-structure.vitest.ts` | PASS, 30 of 30 |
| Scaffold snapshot, template parity, level contract suites | PASS, 12 and 29 |
| Full spec-kit vitest, `root` and `cli` projects | 2823 passed, 32 skipped, 1 failed: `dist-freshness.vitest.ts` flags `orchestrator.ts`, a file this change does not touch, whose source timestamp moved in an earlier commit while its compiled output stayed the same; `dist-freshness.cjs` reports every watched output fresh |
| Boundary test against the previous `goal-slice.cjs` | FAILS there, as it should |
| Synthetic packets through `goal.cjs` and `validate.sh` | PASS: 2998, 3500, 4000 ok; 4001 over and FAILED |
| `validate_document.py` on the changed references and READMEs | PASS, 0 issues; the root README's one finding predates this change |
| Nested-parent tests on the unfixed module | 3 of 4 FAIL as expected; the plain-child guard passes because that behavior is kept |
| The same tests after the fix | PASS, 4 of 4; goal-slice 21 of 21 |
| Wrong fixes against the new tests | Each fails: budgeting every child, dropping the top-level budget, ignoring the hardening switch, ignoring the declared level |
| `goal.cjs` against `validate.sh` at 4001 characters | Agree on all 10 cases: nested parent, plain child, underscore child, declared phase, top-level, with hardening on and off |
| 49 goal documents, strict validation | All PASSED before; all 49 FAILED on the stale fingerprint after the edit; all PASSED again after the re-derive, with the same warning counts as before |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The runtime carries a copy of the phase-level rule.** It loads no TypeScript, so it mirrors the spec kit's classifier rather than importing it. A change to that classifier needs the same change in `goal-slice.cjs`.
2. **Four re-derived packets changed more than their fingerprint.** In the two cli-jev phases, the sk-git phase and the v4 doc-freshness phase, the re-derive dropped key files that no longer exist on disk and picked up current ones.
3. **One log row still mentions the old tier.** A progress row in the goal-chat-send-shape phase records that its parent "still warns past 3,000". It is history below the log anchor, so it stays.
<!-- /ANCHOR:limitations -->

---
