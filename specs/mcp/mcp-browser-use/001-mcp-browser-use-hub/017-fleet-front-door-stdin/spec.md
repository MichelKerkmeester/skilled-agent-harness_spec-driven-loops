---
title: "Feature Specification: Phase 17: fleet-front-door-stdin"
description: "Every hub but one told agents to splice the user's task into a double-quoted --prompt argument, so a task holding a quote, $() or a backtick reached the shell. All eight hubs and the sk-doc scaffolds now pass the task on stdin through a quoted heredoc."
trigger_phrases:
  - "fleet front door stdin"
  - "phase 17 fleet front door stdin"
  - "compiled route prompt stdin heredoc"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 17: fleet-front-door-stdin

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 18 |
| **Predecessor** | 016-fix-second-follow-up-findings |
| **Successor** | 018-triage-gen4-p2-findings |
| **Handoff Criteria** | Every REQ below is Met in `acceptance-criteria.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the mcp-browser-use hub specification. 016 moved this hub's `SKILL.md` to a stdin heredoc and left the other hubs as an operator decision. The operator chose the fleet-wide switch (Q011).

**Scope Boundary**: Every live `--prompt "<task>"` instruction under `.skilled/`: the eight hubs' `SKILL.md`, `ROUTER.md`, README and feature-catalog lines, the sk-doc parent-hub router template, `init_skill.py`, the compiled-routing architecture reference, the bin README and the lockstep parity fixture. Also the activation manifests those edits re-mint, and the one-word `007-sk-doc` archive drift (folded in under the few-characters exemption).

**Dependencies**:
- `compiled-route.cjs` already accepts `--prompt-stdin`.

**Deliverables**:
- One stdin heredoc instruction across the fleet, re-minted manifests and a green bin suite.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Seven hubs' `SKILL.md` lines and all eight `ROUTER.md` callouts told an agent to run `node .skilled/bin/compiled-route.cjs --hub <hub> --prompt "<task>"`. An agent that pastes a user's task into that slot hands the shell any `"`, `$()` or backtick the task holds. The sk-doc scaffold and `init_skill.py` stamped the same line into every new hub.

### Purpose
Every hub tells agents to send the task on stdin through a quoted heredoc, so the shell expands nothing inside it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -rn -- '--prompt "<task>"' .skilled | grep -v /changelog/
32 live lines across 8 hubs, the sk-doc template, init_skill.py, the architecture reference,
the bin README and the parity fixture
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite every live `--prompt "<task>"` line to `--prompt-stdin <<'TASK'`, with the task on the next lines and `TASK` closing it.
- Re-mint every activation manifest whose policy hash the `SKILL.md` edits move, with its archive copy.
- Regenerate the advisor intent signals for each hub whose `ROUTER.md` changed.
- Sync the `007-sk-doc` authored `registry-compiler.cjs` to its served copy ("OpenCode" to "Skilled").

### Out of Scope
- Changelogs and benchmark raw scripts. They record what was true when written.
- The parity test's live report on mcp-tooling and sk-code, which already differed in other words of the callout before this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Eight hubs' `SKILL.md` and `ROUTER.md` | Modify | Stdin heredoc instruction |
| cli-external-orchestration and sk-code `README.md`; five feature catalogs and five compiled-routing catalog entries | Modify | Same |
| `sk-doc/sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md`, `scripts/init_skill.py`, `references/parent-skill/compiled-routing-architecture.md` | Modify | New hubs are born with the heredoc |
| `sk-doc/sk-create-skill/scripts/tests/compiled-routing-lockstep-parity.test.cjs` | Modify | Fixture uses the heredoc |
| `.skilled/bin/README.md` | Modify | Lead with `--prompt-stdin` |
| Seven activation manifests and their archive copies | Modify | Re-minted |
| Archive `007-sk-doc/lib/registry-compiler.cjs` | Modify | One word |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No live `--prompt "<task>"` line remains under `.skilled/` outside changelogs and benchmark reports. |
| REQ-002 | Each of the eight hubs routes a heredoc task holding `"`, `$()` and a backtick, and no file appears. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A hub scaffolded by `init_skill.py` carries the heredoc, and the sk-doc script tests pass. |
| REQ-004 | Every activation manifest is fresh, and the served and authored compiled-routing copies match. |
| REQ-005 | `parent-skill-check` passes for all eight hubs, every hub canary exits 0, and the bin suite passes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The bin suite and the sk-doc script tests pass with no failure.
- **SC-002**: `validate.sh` on the hub epic with `--strict --recursive` prints RESULT: PASSED.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A task with a line reading exactly `TASK` ends the heredoc early | Low | The rest of the task becomes shell input. A different delimiter has the same limit; noted in the summary |
| Risk | `SKILL.md` edits push a Smart Routing section over 180 words | Low | `parent-skill-check` on all eight hubs |
| Dependency | Manifests carry the policy hash of `SKILL.md` | Med | Re-mint all seven and check the guard |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

N/A: this phase changes instructions and fixtures, and runs no service.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an empty heredoc sends an empty prompt, which defers, as `--prompt ""` did.
- Maximum input: a multi-line task passes whole, which an argument in double quotes did not do safely.
- Failure path: a task holding `$(touch <file>)` and a backtick routes on every hub and creates no file.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 50 files, one line each |
| Risk | 6/25 | Instructions only; the front door already read stdin |
| Research | 2/20 | One grep found every surface |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
