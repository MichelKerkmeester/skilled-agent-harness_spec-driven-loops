---
title: "Implementation Summary"
description: "Deep-review iterations written in the agent's numbered shape now reach the findings registry, and a cli-pi child now receives PI_BLACKHOLE_PASSIVE."
trigger_phrases:
  - "deep loop follow ups implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/006-deep-loop-follow-ups"
    last_updated_at: "2026-10-10T13:10:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Verified all criteria and reviewed the diff; no defects"
    next_safe_action: "Orchestrator runs Hermes sync and the contract re-mints"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-deep-loop-follow-ups"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 006-deep-loop-follow-ups |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A deep-review iteration written the way the agent writes it, as numbered findings with indented evidence lines, now reaches the findings registry with one entry per finding. A cli-pi child dispatched by the deep-loop fan-out now receives `PI_BLACKHOLE_PASSIVE`, so pi-blackhole no longer compacts it mid-run.

### Phase 6: deep-loop-follow-ups

The reducer used to read only `- **F###**:` bullets, so the agent's own `N. **Title** -- file:line -- Description` shape reduced to zero findings. It now reads a numbered line at the left margin as a finding with the delta-row id `R<iteration>-<severity>-<NNN>`, so a later iteration's `resolvedFindings` can close it. Evidence lines under a finding (Finding class, Scope proof, Affected surface hints, Case, nested lists and adjudication JSON) are indented or never open with a number and a period, so they add nothing. A numbered finding is used only for an iteration with no delta finding rows and no `findingDetails`; the `- **F###**:` path is unchanged.

The cli-pi environment filter gained an exact-key map. `PI_BLACKHOLE_PASSIVE` passes for cli-pi only, and a variable that merely shares a prefix with it, or any other unlisted variable, is still stripped. The cli-pi gotcha and the dispatch envelope now say so, and the deep-review contract header and README row hand the severity ids and meanings to `review-core.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modified | Numbered finding parser, block reader with run id, structured-row rule in the registry |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Modified | Five tests: both shapes, evidence lines, resolution by id, structured rows |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modified | Exact-key pass-through of `PI_BLACKHOLE_PASSIVE` for cli-pi |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` | Modified | Three tests: filter, other kinds, spawned child |
| `.skilled/skills/system-deep-loop/runtime/changelog/v1.9.3.0.md` | Created | Runtime changelog entry |
| `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` | Modified | Gotcha sentence, version 1.5.14.0 |
| `.skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modified | Envelope sets the variable, one bullet explains it |
| `.skilled/skills/cli-external-orchestration/cli-pi/changelog/v1.5.14.0.md` | Created | cli-pi changelog entry |
| `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml` | Modified | Header comment names `review-core.md` as owner of severity meanings; no YAML key changed |
| `.skilled/skills/system-deep-loop/deep-review/README.md` | Modified | Contract row matches the header |
| `.skilled/skills/system-deep-loop/deep-review/SKILL.md` | Modified | Version 1.11.4.0 |
| `.skilled/skills/system-deep-loop/deep-review/changelog/v1.11.4.0.md` | Created | deep-review changelog entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash applied 18 exact-replacement units from `scratch/dispatch-units.json`, one at a time, each checked by its own grep. A separate verification pass reran every Phase 3 task and every goal criterion, read the full diff of the 9 modified files and the 3 new changelogs, and compared the 12 changed paths with the task's scope list. Nothing is committed. The Hermes copy of cli-pi, the compiled deep-review contract and the cli-external-orchestration route manifest are re-generated by the orchestrator after all builds.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Id `R<iteration>-<severity>-<NNN>` (D1) | It is the delta-row convention, so a later `resolvedFindings` entry closes the finding; the resolution test fails without it |
| Numbered finding opens only at column 0 (D1) | Reading trimmed lines counted an indented nested step as a finding |
| Numbered findings yield to delta rows and `findingDetails` (D2) | An unguarded probe changed 14 of 164 real review folders, most by restating findings under reworded titles; with the rule 162 are unchanged |
| Exact-key map, not a prefix (D3) | A `PI_BLACKHOLE_` prefix would admit any future variable sharing it; the test strips `PI_BLACKHOLE_PASSIVE_EXTRA` |
| Envelope sets the variable too (D5) | The old changelog said the envelope did not carry it yet |
| Patch bumps cli-pi 1.5.14.0, runtime 1.9.3.0, deep-review 1.11.4.0 (D4) | Bug fixes and a doc change per the changelog skill; the runtime lib has no build output |
| Contract header defers severity meanings (D7) | `review-core.md` owns the ids and meanings; the YAML keeps its weights and its file:line rule at every tier |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Criterion 1: `parseIterationFile` on scratch/fixtures/iteration-001.md (exit 0) | PASS: `findings=2 ids=R1-P1-001,R1-P2-001`; the pre-planning reducer prints `findings=0 ids=` |
| Criterion 2: seven reducer test files (exit 0) | PASS: `Test Files  7 passed (7)`, `Tests  151 passed (151)` |
| Criterion 3: `buildExecutorDispatchEnv` for cli-pi (exit 0) | PASS: `{"PATH":"/usr/bin","PI_BLACKHOLE_PASSIVE":"true","SPECKIT_CLI_DISPATCH_STACK":"cli-pi"}`; the git HEAD copy prints no `PI_BLACKHOLE_PASSIVE` |
| Criterion 4: four executor test files plus `npm run typecheck` (exit 0) | PASS: `Test Files  4 passed (4)`, `Tests  62 passed (62)`, no `error TS` |
| Criterion 5: cli-pi gotcha grep, version grep, two changelogs | PASS: `1`, `1`, both `VALID` with `Total issues: 0` |
| Criterion 6: `validate.sh --strict` on this folder | PASS: `RESULT: PASSED` |
| Real review folders (REQ-009) | PASS: `dirs=164 same=162 changed=2 errors=0`, the two being the expected archive folders |
| Readers outside the runtime | PASS: `pass 1 / fail 0`, `22 passed | 4 skipped`, `1 passed`, same as the planner baseline |
| Docs, mirrors, parity, snapshot | PASS: every touched doc `VALID` / 0 issues, `PASS: 187 mirrors`, snapshot `OK`, parity `12 passed`, both leaf manifests `OK`, `system-deep-loop fresh` |
| Hermes generator `--check` | PENDING-ORCHESTRATOR: `DRIFT cli-pi`, `deep-review` and five sibling skills |
| `compiled-route-guard` | PENDING-ORCHESTRATOR: `cli-external-orchestration stale-manifest` from the SKILL.md version bump |
| `check-contract-drift.cjs` | PENDING-ORCHESTRATOR: exit 2, `STALE_SOURCE_DIGEST` for deep/review (pre-existing agent digest plus the YAML and SKILL.md edited here) |
| Review of the full diff | PASS: no defect; `scratch/fix-units.json` is `[]` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Description-only numbered lines.** `1. **Title** -- Some description` with no `file:line` stores the description as the file, because the numbered parser reuses the F### parser's evidence split. Step 7 of the agent always writes `file:line`, so no real iteration hits it.
2. **Two real folders gain findings.** `specs/sk-prompt/z_archive/002-sk-improve-prompt-rename/review` (open 2 to 9) and the `022-sk-deep-research-evolution/010-sk-deep-research-review-improvement-2/review` archive (open 166 to 173) had iterations with summary counts only. One of them may restate a finding from another iteration.
3. **Baselines not captured by the builder.** Phase 1 before-state files were never written; the planner's plan.md values and git HEAD copies stood in. Same results, weaker provenance.
4. **Follow-ups, not built here.** `lib/deep-loop/iteration-findings.cjs` still counts an indented numbered line, and `- **F###**:` narrative findings do not yet yield to structured rows.
<!-- /ANCHOR:limitations -->

---
