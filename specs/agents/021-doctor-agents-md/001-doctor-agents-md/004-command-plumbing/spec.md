---
title: "Feature Specification: command plumbing"
description: "An engine nobody can reach is not a command. This child adds the router with its six canonical sections, three workflows, the presentation, the route manifest entry, the setup row, the command contract entry, the contract suite and the generated mirrors."
trigger_phrases:
  - "doctor command plumbing"
  - "agents md route manifest"
  - "command contract entry"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/004-command-plumbing"
    last_updated_at: "2026-10-30T15:20:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Implemented the command plumbing on this branch"
    next_safe_action: "Run the end-to-end verification pass"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/agents-md.md"
      - ".skilled/commands/doctor/assets/doctor-agents-md-presentation.txt"
      - ".skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: command plumbing

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/292-doctor-agents-md` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 5 |
| **Predecessor** | 003-embed-engine |
| **Successor** | 005-verification-and-docs |
| **Handoff Criteria** | The three routes validate, the contract suite passes and every generated mirror is in sync |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the `/doctor:agents-md` build inside `agents/021-doctor-agents-md`.

**Scope Boundary**: The human and machine surface around the two engines. It changes no engine behaviour.

**Dependencies**:
- `/doctor:sk-skill` (packet `sk-doc/075-doctor-sk-skill-command`) must be on `main` before implementation starts, and every phrase, route, bridge and mirror count is re-measured then. That command is the read-only exemplar whose shape this router copies.
- The check and embed engines must exist and answer before their workflows can name them.

**Deliverables**:
- `agents-md.md` with the six canonical sections, three workflows and one presentation file.
- One manifest entry per target, the setup row, the README row and the command contract entry.
- `doctor-agents-md-contract.test.cjs` and the regenerated advisor blocks, mirrors and prompt stubs.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The doctor family is validated by shape, not by intent. A command with a missing router section, a missing manifest entry, a phrase shorter than three words, or a setup row nobody added is either unreachable or silently inconsistent with its siblings, and the generated advisor blocks, mirrors and prompt stubs drift the moment a router is added without regenerating them.

### Purpose
Wire the three targets the way the family already validates them, and pin the contract in a suite so the next router that lands cannot skip the setup list, the phrase rule or the mutation class.

### Precondition
Implementation starts only after `/doctor:sk-skill` (packet `sk-doc/075-doctor-sk-skill-command`) lands on `main`. That command adds a router, a route and an advisor bridge, so the route, bridge, phrase and mirror counts this packet quotes are re-measured from the branch the child starts on, and recorded in `scratch/baseline.txt` before the first edit.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Measured on this worktree at `006d96370d`, before any implementation. These are the numbers this child's criteria are read against.
```text
$ bash .skilled/commands/doctor/scripts/route-validate.sh
OK: route-validate — 19 routes validated, 3 warnings

$ bash .skilled/commands/doctor/scripts/tests/run-all.sh
[run-all] node:test (35 files): tests 699, pass 699, fail 0
[run-all] 7 suite(s) passed, 0 failed
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The router with six canonical sections and no inline presentation, and one `skill_agent` tag.
- Three workflows whose mutation classes are `read-only`, `mutates` and `mutates`, with `approvals: explicit_yes`, a plan-digest step, the allowlist and `never_commit: true` on the writing ones.
- One presentation file, the manifest routes, the header router list, the setup row and the update next-step line.
- The command contract entry, the README row and the regenerated advisor blocks, mirrors and prompt stubs.

### Out of Scope
- Activating the derived advisor bridge, which stays inactive per the phase decision.
- Any change to the two engines, the manifest or the fixtures.
- Root README command counts, which child 005 and the sibling phase each own their own line of.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/agents-md.md` | Create | Router, six canonical sections |
| `.skilled/commands/doctor/assets/doctor-agents-md-check.yaml` | Create | Read-only workflow |
| `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml` | Create | Plan-then-yes workflow |
| `.skilled/commands/doctor/assets/doctor-agents-md-restore.yaml` | Create | Restore workflow |
| `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt` | Create | Presentation templates |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Modify | One target-list row |
| `.skilled/commands/doctor/assets/doctor-update-presentation.txt` | Modify | One next-step line pointing at the check |
| `.skilled/commands/doctor/_routes.yaml` | Modify | Three routes and the header router list |
| `.skilled/commands/README.txt` | Modify | One catalog row |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | `families.doctor` entries for the three targets |
| `.skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs` | Create | The failing-first contract suite |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | Regenerate | One entry per route, never hand-edited |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` | Regenerate | The generated bridge block |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Regenerate | The generated bridge block |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | Regenerate | The generated command list |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The manifest carries routes `check`, `embed` and `restore` with mutation classes `read-only`, `mutates` and `mutates`, and `check` is reachable as the bare command. |
| REQ-002 | Every trigger phrase has three or more words. |
| REQ-003 | The router carries the six canonical sections and no inline presentation. |
| REQ-004 | The embed workflow declares `approvals: explicit_yes`, a plan-digest step, the write allowlist identical to the engine's, and `never_commit: true`. |
| REQ-005 | The setup presentation lists the command exactly once. |
| REQ-006 | `agent-md` is not activated in the scoring compatibility list, and the phrase reach probe still passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | The command contract carries router path, argument hint, execution targets, owned assets and invocation aliases for the three targets. |
| REQ-008 | Every generated output is regenerated by its own script and is idempotent on a second run. |
| REQ-009 | The update presentation gains one next-step line that names the check target. |
| REQ-010 | The catalog row in the commands README matches the frontmatter tree. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 and its summary names the re-measured route count.
- **SC-002**: `node --test .skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs` reports `fail 0`.
- **SC-003**: A second `derive-command-bridges.cjs` run leaves every generated file unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The doctor sk-skill command | Its route and bridge shift every count this child quotes | Re-measure before the first edit and record the numbers |
| Risk | A hand-edited generated block | The next regeneration silently reverts it | REQ-008 asserts idempotence and the files are listed as generated |
| Risk | An inactive bridge hides the command from the advisor | Medium: discovery is by name only | The decision is explicit and the contract suite asserts the reach probe still passes |
<!-- /ANCHOR:risks -->

---

## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The contract suite runs in under ten seconds, because it reads files instead of running engines.

### Security
- **NFR-S01**: The YAML grants no target the command does not need, and the writing workflows declare `never_commit: true`.

### Reliability
- **NFR-R01**: A missing router section fails the contract suite, not a live run.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a bare invocation with no argument runs `check`, because `check` is the declared default target.
- Maximum input: an argument with pasted flags still reaches `check`, because the router passes free text only where a target accepts it.
- Failure path: an unknown target prints the router's usage block and exits non-zero without running a workflow.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Fourteen files, four of them generated |
| Risk | 10/25 | The generation steps are order-dependent and easy to half-run |
| Research | 6/20 | The exemplar router and the contract test give the shape |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which regenerated files count as this child's diff? The design names the advisor blocks, the mirrors and the three prompt stub sets; the sibling phase regenerates the same families and whichever lands second rebases.
- Does the update next-step line belong to this child or to the update router's own owner? The design puts it here as one line, and no other change to that router is in scope.
<!-- /ANCHOR:questions -->

---
