---
title: "Feature Specification: Phase 7: open-findings-follow-up"
description: "Six findings stayed open when phase 006 closed: two advisor routes that miss their target, a stale coverage sentence, a CLI skill verified on an older OpenCode, a runtime bootstrap that crashes on some stdin types and a spec-kit build command that leaves the validator reporting a stale dist. This phase fixes each one or records with numbers why it could not."
trigger_phrases:
  - "open findings follow up"
  - "phase 7 open findings follow up"
  - "deep loop stdin eagain"
  - "spec kit stale dist build"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: open-findings-follow-up

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/382-deep-loop-workflow-logic-hardening` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-ai-council-mode-deprecation |
| **Successor** | None |
| **Handoff Criteria** | Every requirement below is met, or the phase log names it not fixed with the gate numbers that blocked it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the workflow logic hardening packet. It takes the six findings the phase 006 report left open.

**Scope Boundary**: the six findings only. Phase 006 stays closed and its documents are not edited.

**Dependencies**:
- Phase 006 is Complete, so the council command row exists for the advisor to rank.

**Deliverables**:
- A stdin-safe TSX bootstrap in four deep-loop runtime scripts, with a test.
- A top-level spec-kit build that leaves a fresh, attested dist.
- A true coverage sentence in the command contract.
- The cli-opencode skill verified on the installed OpenCode 2.3.0.
- Advisor routes for the two prompts, held to the existing corpus floors.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor sends "deep review this branch" to `sk-git` and "what is an ai council and how does it compare to a review" to `sk-code`, so a reader is offered the wrong skill. The deep-loop `convergence`, `query`, `status` and `upsert` scripts crash with `EAGAIN` when stdin is a socket or a non-blocking pipe, which is what an automated runner hands them. After an edit to a watched spec-kit source, the build command that every rebuild message names leaves the validator refusing to run.

### Purpose
Each of the six findings is fixed and proved by a command, or is named not fixed with the numbers that blocked it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"deep review this branch"}' --format json
sk-git            confidence 0.95    score 0.816434
system-deep-loop  confidence 0.9485  score 0.79719   command /deep:review

$ ... '{"prompt":"what is an ai council and how does it compare to a review"}'
sk-code                     confidence 0.8909  score 0.690073
command-speckit-ai-council  confidence 0.8407  score 0.596647  command /speckit:ai-council

$ node .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs --spec-folder <P> --session-id probe --loop-type council   (stdin: socketpair)
node:fs:1005
Error: EAGAIN: resource temporarily unavailable, read
    at Object.readFileSync (node:fs:670:19)
exit 1

$ npm --prefix .skilled/skills/system-spec-kit run build   (after editing shared/gate-3-classifier.ts)
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <folder> --strict
ERROR: validate.sh compiled validation orchestrator is stale.
@spec-kit/runtime dist is stale (source content differs from the attested build).

$ rg -n '38 of the 42' .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json
8:    "coverage": "... a consumer that walks this file is walking 38 of the 42 shipped commands, not all of them.",

$ opencode --version
opencode v2.3.0
$ rg -n 'verified against OpenCode' .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md
78:**Verified versions.** This skill was verified against OpenCode 2.1.4 and OpenCode 1.19.4 on 2026-10-24.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Let the TSX child own stdin in the four bootstrapped deep-loop scripts, so the parent never reads it eagerly.
- Make the top-level spec-kit `build` script run the runtime's prepare and finalize steps around the compile.
- Recompute the coverage sentence in the command contract from the command tree.
- Verify the cli-opencode skill's documented flags against OpenCode 2.3.0 and record what was observed.
- Change the advisor so the two prompts reach their targets, only if the corpus floors hold.

### Out of Scope
- Phase 006 documents - that phase is closed, and its report stays as written.
- Lowering a corpus floor or recapturing a ratchet baseline to absorb a regression - a finding that cannot clear the floors is reported not fixed.
- The five gates that failed before phase 006 - each needs its own packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/{convergence,query,status,upsert}.cjs` | Modify | The TSX child inherits stdin |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/bootstrap-stdin.vitest.ts` | Create | Runs a script with a socket and a never-closed pipe on stdin |
| `.skilled/skills/system-spec-kit/package.json` | Modify | The top-level build attests the runtime dist |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | The coverage sentence |
| `.skilled/skills/cli-external-orchestration/cli-opencode/` docs | Modify | Verified-version lines and any flag gap found on 2.3.0 |
| `.skilled/skills/system-skill-advisor/runtime/` scorer, metadata and golden test | Modify | The two routes, if a variant clears the floors |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The four bootstrapped scripts do not read stdin in the parent | With a socketpair or a never-closed pipe on stdin, `convergence.cjs --loop-type council` prints `INPUT_VALIDATION` and exits 3 within 20 seconds, and the new test fails on the old code |
| REQ-002 | The top-level spec-kit build leaves an attested dist | After editing a watched source, `npm --prefix .skilled/skills/system-spec-kit run build` alone makes `validate.sh --strict` run without `compiled validation orchestrator is stale` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The coverage sentence matches the command tree | Every command it names as excluded exists, every count it states matches a count taken from the tree, and `rg -n '38 of the 42'` prints nothing |
| REQ-004 | The cli-opencode skill states what was verified on OpenCode 2.3.0 | Every `opencode run` flag the skill documents appears in `opencode run --help` on 2.3.0, and the verified-version lines name 2.3.0 |
| REQ-005 | "deep review this branch" ranks `system-deep-loop` first | `advisor_recommend` puts `system-deep-loop` with `/deep:review` first, and every advisor gate ends at or above its phase 006 final value |
| REQ-006 | "what is an ai council and how does it compare to a review" does not rank `sk-code` first | `advisor_recommend` puts `command-speckit-ai-council` first, and every advisor gate ends at or above its phase 006 final value |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The bootstrap test passes and the deep-loop runtime suite passes with no new failure.
- **SC-002**: The two pinned prompts pass in the golden prompt test, and the corpus floors in `routing-registry-drift.yml` hold.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The phase 006 gate results in `../006-ai-council-mode-deprecation/scratch/gate-baseline.md` | Without a baseline, "no regression" cannot be shown | Rerun the advisor gates against that Final column |
| Risk | A scorer change that fixes two prompts moves others | High | Prefer metadata over lane logic, keep the change narrow, and report a finding not fixed rather than move a floor |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `opencode-setup.sh` install 2.3.0 instead of 2.1.4? Decision: only if 2.3.0 is verified here, and the report names the change because it changes what other people install.
<!-- /ANCHOR:questions -->

---
