---
title: "Implementation Plan: Phase 9: verification-and-closeout"
description: "This plan closes sk-create-goal with recorded playbook runs, a real packet-goal accept path, routing measurements and recursive packet validation."
trigger_phrases:
  - "sk-create-goal closeout plan"
  - "goal mode acceptance run"
  - "ten prompt routing measurement"
  - "goal packet binding proof"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: verification-and-closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, CSV and a relative directory symlink. |
| **Framework** | `/create:goal`, `/create:readme`, the goal packet CLI and spec-kit validation. |
| **Storage** | Repository documentation and the sk-doc benchmark report tree. |
| **Testing** | Eight manual scenarios, ten advisor and compiled-route prompt pairs, one real goal packet and recursive strict validation. |

### Overview

Phase 009 waits for Phases 006-008 to meet their handoffs, then verifies the published command and playbook against actual work. It records all scenario verdicts, uses the audited missing-binding case only if it remains a genuine need, measures the fixed ten-prompt corpus and closes all phase records. The earlier repo-rule closeout left an accept path unexercised, and the frontmatter utilization review recorded six of eight newcomer prompts with no recommendation (specs/sk-doc/z_archive/040-create-repo-rules/007-validation-and-changelog/implementation-summary.md:130-149; specs/sk-doc/049-sk-create-frontmatter/008-utilization-review/implementation-summary.md:133-153).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 006's positive and negative conformance fixtures have observed final verdicts (specs/sk-doc/060-create-goal-mode/spec.md:147).
- [ ] Phase 007's mode route and ten-prompt records are complete; its six session-goal probes remain outside the mode (specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/spec.md:32, 51; specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/plan.md:116-133).
- [ ] Phase 008's four command mirrors resolve and the playbook package validator reports `PASS` with eight scenarios (specs/sk-doc/060-create-goal-mode/spec.md:149; specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:24-33).
- [ ] The real target packet still has a verified goal-authoring need, and its existing goal file has a saved preimage (wave1-goal-system-audit.md:44).
- [ ] The current `/create:goal` operation and checker commands are read from the completed Phase 004 and Phase 006 outputs, not guessed.

### Definition of Done
- [ ] Eight playbook scenarios have final verdicts, reasons and evidence paths in the run record.
- [ ] A real goal authored through `/create:goal` is within budget and every phase is bound to an existing child goal.
- [ ] The ten fixed newcomer prompts have advisor and compiled-route outcomes, including stage counts and a joint count.
- [ ] The README, mode changelog, hub symlink and phase-local changelog resolve and pass their named checks.
- [ ] Every phase acceptance row and status agrees with its evidence.
- [ ] Recursive strict validation prints `RESULT: PASSED`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Use evidence-first closeout. The playbook is an input, each run produces a separate evidence record, and the packet's acceptance criteria carry the final verdicts (sk-create-manual-testing-playbook/SKILL.md:269-312; validation-rules.md:68-93).

### Key Components
- **Playbook run**: Execute the eight Phase 008 scenarios as written. Store each result under the sk-doc benchmark report tree and summarize it in this phase's implementation summary (specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:105-113; sk-create-manual-testing-playbook/SKILL.md:273-312).
- **Real accept path**: Use the existing `017-memory-database-decommission` packet while its phase-007 binding gap remains. Its phase map has seven direct phases, while its parent goal currently lists bindings only through phase 006 (wave1-goal-system-audit.md:44; specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/spec.md:158-164; specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/goal.md:68-74).
- **Reachability**: Run each fixed newcomer prompt through the advisor command and the compiled-route command, recording exact output, exit status and target (specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/plan.md:109-127).
- **Release docs**: Use `sk-create-readme` for the mode README, write the mode changelog as a real file and create the relative hub link (sk-create-readme/SKILL.md:165-180; specs/sk-doc/060-create-goal-mode/spec.md:109).
- **Packet closeout**: Align all nine child records with the parent map and goal log before running the recursive validator (specs/sk-doc/060-create-goal-mode/spec.md:119-136).

### Data Flow

The executor first confirms the Phase 006, 007 and 008 handoffs. The executor then runs the playbook, the real authoring request and the fixed reachability prompts. The executor records only observed outcomes, completes the release and status documents, and runs the recursive strict validator from the final state. A scenario corpus is never rewritten during its run (sk-create-manual-testing-playbook/SKILL.md:297-312).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes documentation and records a single real packet goal. It does not change runtime session state or the system-spec-kit goal contract (specs/sk-doc/060-create-goal-mode/spec.md:94-98).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Phase 008 playbook corpus | Eight canonical scenario inputs | Read and execute every scenario; do not edit the corpus during the run | Eight result rows, each with verdict, reason and evidence path (sk-create-manual-testing-playbook/SKILL.md:297-312). |
| `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/goal.md` and its seven child goal paths | Real target with a documented phase-007 binding gap | Save the current parent goal, author through `/create:goal`, then verify all seven paths and the Phase 006 conformance check | `goal.cjs packet` reports `packet_budget=ok`; all seven child goals pass `test -f` (wave1-goal-system-audit.md:44; specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/spec.md:158-164). |
| Advisor and compiled-route surfaces | sk-doc hub and workflow selection | Replay the fixed ten prompts and the six session-goal controls | `advisor_recommend` and `compiled-route.cjs` outputs are recorded per prompt (specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/plan.md:109-133). |
| `.skilled/skills/sk-doc/sk-create-goal/README.md` | Mode reader entry point | Author or refresh through `sk-create-readme` | `validate_document.py` and `hvr_scan.py` report no blockers (sk-create-readme/SKILL.md:290-327). |
| Mode changelog and hub directory link | Local release notes and hub discovery path | Write the real mode changelog, then create or verify the relative symlink | `test -f` through the link succeeds; `readlink` matches the sibling pattern (specs/sk-doc/060-create-goal-mode/spec.md:109; `ls -la .skilled/changelog/sk-doc/`). |
| Parent and nine phase records | Packet-wide closure status | Update acceptance evidence, status fields, parent map and parent goal log | Recursive strict validation prints `RESULT: PASSED` (specs/sk-doc/060-create-goal-mode/spec.md:119-136; validation-rules.md:765-780). |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification task state.

### Phase 1: Confirm the handoffs and evidence targets

Read the completed Phase 006, 007 and 008 summaries and acceptance criteria. Require the positive and negative conformance evidence, the advisor and compiled-route results, all four command mirrors and a playbook package-validator `PASS`. Read the eight scenario files and preserve the index order. Recheck the current target packet's phase map and parent goal before choosing it. Do not start implementation if an incoming handoff is missing or if the target has no genuine authoring need (specs/sk-doc/060-create-goal-mode/spec.md:142-149; specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:105-113).

### Phase 2: Exercise the mode and write release records

Run all eight scenarios as written and persist each observed verdict, reason and evidence path under `.skilled/skills/sk-doc/benchmark/reports/<run-label>/`. Use `PASS`, `FAIL` or `SKIP` only; a `SKIP` must name the specific blocker. Then invoke `/create:goal` with the operation Phase 004 accepted for the real target. Verify every phase goal path with `test -f`, run the Phase 006 conformance check and run `node .skilled/hooks/goal/bin/goal.cjs packet <packet> --workspace <repo-root>`. Require `packet_budget=ok` and record the output (sk-create-manual-testing-playbook/SKILL.md:291-312, 352-360; wave1-goal-system-audit.md:16-18).

Run the same ten newcomer prompts listed in Phase 007 plan through `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<same prompt>"}' --format json` and `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt "<same prompt>"`. Record all ten prompt strings, both command results and exit statuses, and the count reaching sk-doc and sk-create-goal. Replay the six negative controls from that plan and require zero sk-create-goal targets (specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/plan.md:109-133; parent-skills-nested-packets.md:250-259).

Invoke `/create:readme` through `sk-create-readme` for `.skilled/skills/sk-doc/sk-create-goal/README.md`. Follow its read-local-evidence and human-voice requirements, then run `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-goal/README.md --type readme` and `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/sk-doc/sk-create-goal/README.md` (sk-create-readme/SKILL.md:151-180, 290-327, 353-361).

Inspect the current `sk-create-changelog` contract and record whether its global mode supports `sk-doc/create-goal`; do not use it as a prerequisite. Write `.skilled/skills/sk-doc/sk-create-goal/changelog/v1.0.0.0.md` directly in the sibling mode style, then create `.skilled/changelog/sk-doc/create-goal` as a relative directory symlink. Verify the real file and the symlink target. Separately write the phase-local changelog with `node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js specs/sk-doc/060-create-goal-mode/009-verification-and-closeout --write` (sk-create-changelog/SKILL.md:58-60, 219-230; specs/sk-doc/z_archive/040-create-repo-rules/007-validation-and-changelog/implementation-summary.md:81-89, 101-103).

### Phase 3: Reconcile and verify the final tree

For each of the nine child phases, verify every acceptance row against observed evidence, close only rows that pass, and align its `spec.md`, `tasks.md` and `implementation-summary.md` status. Update the parent Phase Documentation Map and goal log from the same evidence. Do not create waivers to force closure; `AC_CLOSURE` requires an existing decision record for any waived or superseded row (validation-rules.md:68-93).

Run the Phase 006 conformance check again, the explicit `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` check and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode --recursive --strict`. Read all outputs and exit statuses. The final recursive run must print `RESULT: PASSED`; validation rules require the affirmative result marker, not a silent or exit-only pass (parent-skills-nested-packets.md:240-255; validation-rules.md:765-780).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Incoming handoffs | Phase 008 mirrors and its eight-scenario package | `for path in .claude/commands/create/goal.md .codex/prompts/create-goal.md .pi/prompts/create-goal.md .cursor/commands/create-goal.md; do test -f "$path" || exit 1; done`; `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook` (specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:101-113, 120-124). |
| Goal conformance | Positive and every named negative fixture from Phase 006, then the real packet | The exact checker command recorded by Phase 006; `test -f` for each phase goal path; `node .skilled/hooks/goal/bin/goal.cjs packet <packet> --workspace <repo-root>` (wave1-goal-system-audit.md:16-18; specs/sk-doc/060-create-goal-mode/spec.md:147). |
| Newcomer routing | Ten fixed prompts and six session-goal controls | `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<prompt>"}' --format json`; `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt "<prompt>"` (specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/plan.md:109-133). |
| README and HVR | Mode README contents, local links and human-voice scan | `/create:readme`; `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-goal/README.md --type readme`; `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/sk-doc/sk-create-goal/README.md` (sk-create-readme/SKILL.md:290-327; sk-create-changelog/SKILL.md:473-479). |
| Changelog link | Real mode changelog and sibling-style relative directory link | `test -f .skilled/skills/sk-doc/sk-create-goal/changelog/v1.0.0.0.md`; `test -f .skilled/changelog/sk-doc/create-goal/v1.0.0.0.md`; `readlink .skilled/changelog/sk-doc/create-goal`. |
| Parent packet | All nine phase folders and their closure records | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode --recursive --strict`; require `RESULT: PASSED` (specs/sk-doc/060-create-goal-mode/spec.md:133-136; validation-rules.md:765-780). |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 006 goal conformance check | Internal, upstream | Draft in the current planning snapshot; require its completed implementation and recorded command at execution (specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/spec.md:24-32). | The final positive and negative check cannot be run or claimed. |
| Phase 007 routing handoff | Internal, upstream | Draft in the current planning snapshot; require its accepted routing evidence before the final prompt measurement (specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/spec.md:23-32). | Reachability cannot be claimed from planned aliases alone. |
| Phase 008 command and playbook | Internal, upstream | Draft in the current planning snapshot; require the exact mirror and package-validator handoff (specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:24-33). | The scenarios and `/create:goal` command may not be runnable. |
| `sk-create-readme` | Internal authoring workflow | Available; use its `/create:readme` workflow and Human Voice checks (sk-create-readme/SKILL.md:20-27, 165-180). | The mode README must not be replaced with an unreviewed generic draft. |
| `sk-create-changelog` global mode | Internal authoring workflow | UNKNOWN for nested component `sk-doc/create-goal`; this phase does not depend on it (sk-create-changelog/SKILL.md:58-60, 184-190). | No effect on the direct mode-file and symlink path. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A playbook scenario regresses, the real packet goal binds the wrong phase or exceeds budget, the README or changelog link is invalid, or a required final gate fails after in-scope repairs.
- **Procedure**: Restore the saved preimage of the real packet's parent goal and remove only a child goal created by this run if the mode wrote incorrect content. Remove only the new mode changelog, hub symlink, nested phase changelog and benchmark report artifacts created by this run. Restore the parent map, parent goal log and child status records from their saved preimages. Re-run the Phase 006 checker, the goal packet command, the link checks and the full recursive strict validator. Keep the phase open if the final result does not pass.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Handoffs and target) ──► Phase 2 (Evidence and release docs) ──► Phase 3 (Reconcile and verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Accepted Phase 006, 007 and 008 handoffs | Implementation |
| Implementation | Setup and a verified real goal gap | Verification |
| Verification | Final implementation state and completed evidence | Packet closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

No time estimate is recorded. Completion depends on observed scenario and packet gates, not elapsed time.

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Not estimated |
| Implementation | High | Not estimated |
| Verification | High | Not estimated |
| **Total** | | **Not estimated** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- Save the original real-packet parent goal before invoking `/create:goal`.
- Record the initial parent map, goal log and each child's status before reconciliation.
- Confirm the changelog path and symlink do not already exist or already resolve to the expected target.

### Rollback Procedure
1. Restore the real packet goal preimage and remove only a newly created, incorrect child goal.
2. Restore the mode README and packet status documents from their pre-run copies if this phase changed existing files.
3. Remove only the new mode changelog, symlink, phase changelog and dated report folder created by this run.
4. Rerun the named checks and leave acceptance criteria open if the restored packet does not pass.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Restore saved document preimages and remove only new files and links created by this phase.
<!-- /ANCHOR:enhanced-rollback -->
