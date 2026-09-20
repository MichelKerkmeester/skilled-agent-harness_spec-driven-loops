---
title: "Feature Specification: authoring the operator scenarios the coverage map proves are owed"
description: "With the operator-scenario contract enforceable and the false coverage removed, this phase authors what is genuinely absent: four uncovered external executors and their fail-closed cases, two end-to-end user-boundary workflows that no scenario runs today, the destructive and asynchronous public MCP tools that appear in no executable scenario, and seven declared-but-unauthored features and mode boundaries. The derived coverage map is the worklist and the gate; the applicability rule governs every item, so absence of a file is never by itself the reason to author one."
trigger_phrases:
  - "author missing playbook scenarios"
  - "uncovered executor coverage"
  - "end to end loop scenario"
  - "destructive mcp tool scenario"
  - "playbook coverage map worklist"
importance_tier: "high"
contextType: "planning"
parent: "sk-doc/024-playbook-scenario-coverage"
_memory:
  continuity:
    packet_pointer: "sk-doc/024-playbook-scenario-coverage/003-uncovered-workflow-authoring"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the uncovered-workflow child spec from the track (d) synthesis proposal"
    next_safe_action: "Re-derive the uncovered inventory from live registries before authoring"
    blockers:
      - "Blocked by child 001 (coverage map + operator-contract gate)"
      - "Sequenced after child 002 (author against repaired scenarios, not broken ones)"
      - "OPERATOR-DECISION Q3 (cross-skill workflow ownership) gates Lane B placement"
      - "OPERATOR-DECISION Q5 may add a fourth Lane-D item"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 0
    open_questions:
      - "Q3 who owns cross-skill end-to-end workflow scenarios"
      - "Q5 does sk-prompt-models owe a playbook package"
      - "Which executors have a genuinely available binary or credential in this environment"
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Authoring the Operator Scenarios the Coverage Map Proves Are Owed

> Phase adjacency under the `024-playbook-scenario-coverage` parent: predecessor `002-scenario-accuracy-repair-risk-first`
> (sequencing, plus a hard block from `001`). No successor.

---

## EXECUTIVE SUMMARY

Only after the standard is enforceable and the false coverage is gone does authoring become honest work. This
phase closes the genuine holes: the largest is a hub that declares six routable executor workflows and covers
two, with four executors appearing nowhere in its playbook root. Beside it sit two user-boundary workflows that
no scenario runs end to end, four destructive or asynchronous public tools with no executable scenario, and
seven features the registries declare and the playbooks never reached.

**Key Decisions**: who owns a cross-skill end-to-end workflow scenario; and the standing rule that the derived
coverage map — not a human's judgment and not the finding list — is the worklist and the gate.

**Critical Dependencies**: child `001`'s coverage map and validator. Child `002` should land first so authoring
happens against repaired scenarios rather than broken ones.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `sk-doc/024-playbook-scenario-coverage` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Coverage gaps in this fleet were previously argued from prose. Child `001` replaces that with a derived map, and
the map's first output confirms a set of holes that matter:

- A hub declares six routable executor workflows; its playbook covers **two**, and four executor names appear
  **zero** times anywhere in its root. The same hole seen from the deep-loop side: the live executor schema
  declares seven kinds and the fan-out scenario exercises two.
- No scenario runs a research loop end to end. The corpus validates routing fields, and one scenario states
  outright that it verifies convergence *without* running a full loop. Likewise the only indexed lifecycle
  scenario for the completion command targets a **controlled failing** unattended run — there is no successful
  implementation-to-closeout path anywhere in the fleet.
- Two destructive public memory tools appear in **no** executable scenario; two asynchronous scan tools appear
  only inside an umbrella inventory list; and a reconcile tool is exercised incidentally with no
  dry-run/apply/rollback lifecycle.
- Seven declared features have no dedicated scenario, including two workflow modes that are a hub's entire
  workflow axis, a hub's only public command surface, and an MCP integration whose own catalog entry records
  zero manual coverage.

### Purpose

Author the scenarios the derived map proves are owed, risk-ordered, each one passing the new gate on first
commit — and record an explicit *not-applicable-because* for every residual the map leaves behind.

### The applicability rule governs every item

A feature owes a scenario when it is **operator-visible, integration-critical, release-gating, or
orchestration-shaped**. An internal library whose only meaningful acceptance criteria are already automated owes
**nothing**, and a missing playbook directory is **not automatically a defect**. This rule already cost one
research finding its place in the tree — recorded as a disposition in the parent spec — and it governs here too.
Nothing is authored because a file exists.

### Non-Goals

- Repairing existing scenarios — child `002`.
- Census, validator, or template work — child `001`.
- Expanding the automated 117-combination executor matrix into manual scenarios. It is an **anchor referenced by**
  the new executor scenarios, not a source of them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Four lanes, risk-ordered.

**Lane A — external executor dispatch (3).** Author one realistic routed workflow per uncovered executor, plus a
fail-closed scenario for each ("fails closed when the binary is absent"). Author the deep-loop executor-kind and
fan-out parity coverage against the live executor schema. The 117-combination matrix is included explicitly as a
**guardrail**: it is automated command-construction coverage that logs every credentialed dispatch as skipped, so
it is an anchor the new scenarios reference — a small operator worklist plus an explicit pointer to the automated
matrix is the correct shape, and it must not become 117 scenarios.

**Lane B — end-to-end user-boundary workflows (2).** One bounded research loop run end to end: setup → executor
selection → child dispatch → state records → convergence → synthesis → user-facing output. One successful
implementation-to-closeout path for the completion command. Both are cross-skill workflows that owe coverage at
the user-facing boundary, and both live in the hub that owns the user-facing command, with dependency-owned
assertions linked rather than duplicated. **OPERATOR-DECISION Q3.**

**Lane C — public mutating and asynchronous tools (1 finding, 4 tool lifecycles).** Author: an expiry dry-run; a
confirmed destructive clear plus its refusal path; scan start/status/cancel across terminal states; and a
reconcile dry-run/apply/rollback including the active-shard-mismatch refusal. These are destructive and
asynchronous public tools — squarely inside the applicability rule.

**Lane D — declared-but-unauthored features and mode boundaries (7).** Two scenario ids the sk-doc root itself
records as never authored; a hub's two workflow modes with no scenario at all plus its secondary surfaces; a
hub's two `/interface:*` commands, which are its **sole** public command surface, with no scenario invoking
either; a retired routing probe standing in for live quality-control coverage that explicitly says "DO NOT
execute the work"; three registered modes with no dedicated scenario; an MCP integration with 31 tools whose own
catalog entry records zero manual coverage; and a prompt-advisor bridge documented as operator-visible while its
three sibling runtimes are covered.

### Out of Scope

- Any scenario the applicability rule does not oblige. Residuals are recorded, not authored.
- The `sk-prompt-models` question — held at the parent as a disposition until **OPERATOR-DECISION Q5** rules. If
  ruled owed, it becomes a fourth Lane-D item at an estimated 4-6 scenarios and this scope grows by that amount.
- Nested playbooks under `system-deep-loop/**`.

### Findings in Scope (13)

| ID | Sev | Kind | Subject | Lane |
|----|-----|------|---------|------|
| `RD-001-01` | P1 | gap | Hub declares six executor workflows; playbook covers two; four executors absent from the root | A |
| `RD-004-01` | P1 | gap | Live executor schema declares seven kinds; the fan-out scenario exercises two | A |
| `RD-005-06` | P2 | insight | The 117-combination matrix is automated coverage only — guardrail against 117 scenarios | A |
| `RD-010-01` | P1 | gap | No scenario runs a research loop end to end | B |
| `RD-010-02` | P1 | gap | No successful implementation-to-closeout lifecycle scenario | B |
| `RD-003-03` | P1 | gap | Four public MCP maintenance tools lack lifecycle scenarios | C |
| `RD-001-04` | P2 | gap | Two sk-doc scenario ids the root itself records as never authored | D |
| `RD-002-01` | P1 | gap | sk-code's two workflow modes have no scenario; secondary surfaces uncovered | D |
| `RD-002-03` | P1 | gap | sk-design's two `/interface:*` commands — its sole public command surface — uncovered | D |
| `RD-006-01` | P1 | nonconformance | Quality-control coverage is a retired routing probe that forbids executing the work | D |
| `RD-006-02` | P1 | gap | Three registered sk-doc modes have no dedicated scenario | D |
| `RD-006-03` | P1 | gap | The GitKraken MCP integration has no scenario | D |
| `RD-007-06` | P1 | gap | The Pi prompt-advisor bridge is uncovered while three sibling runtimes are covered | D |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/manual-testing-playbook/hub-routing/` | Create | 4 routed-workflow + 4 fail-closed scenarios |
| `.opencode/skills/system-deep-loop/manual-testing-playbook/` | Create | Executor-kind and fan-out parity; one end-to-end research loop |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/{lifecycle,tooling-and-scripts,memory-quality-and-indexing}/` | Create | Successful closeout path; four public-tool lifecycles |
| `.opencode/skills/sk-code/manual-testing-playbook/` | Create | Two workflow modes; Webflow and OpenCode secondary surfaces |
| `.opencode/skills/sk-design/manual-testing-playbook/` | Create | Both `/interface:*` commands |
| `.opencode/skills/sk-doc/manual-testing-playbook/` | Create | Live quality-control coverage; three registered modes; the two never-authored ids |
| `.opencode/skills/sk-git/manual-testing-playbook/` | Create | GitKraken MCP integration |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/` | Create | The Pi prompt-advisor bridge |
| Each affected `manual-testing-playbook.md` root | Modify | Index the new scenarios; census re-derives automatically |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | **The coverage map is the worklist, not the finding list.** The uncovered inventory is re-derived from live registries at the start of this phase; the 13 findings are its seed, not its definition. | The re-derived inventory is recorded; any finding it does not confirm is re-examined rather than authored on faith. |
| REQ-002 | **The coverage map is the gate.** The uncovered-inventory report must shrink to the ruled-empty set. Nothing is closed by assertion. | Report diff at close shows the remaining set is exactly the recorded not-applicable set. |
| REQ-003 | **Every residual carries an explicit not-applicable-because record** citing the applicability rule. | Each residual entry names which limb of the rule it fails: not operator-visible, not integration-critical, not release-gating, not orchestration-shaped. |
| REQ-004 | **Every new scenario passes `validate-playbook-package.cjs --strict` on first commit.** A scenario that cannot pass the gate is not authored correctly. | Validator exits 0 over the new set with no follow-up fix commit. |
| REQ-005 | **Lane A and Lane C scenarios are executed once** against real binaries and a disposable memory database. | A run artifact per Lane A/C scenario under `<skill>/benchmark/reports/<dated-run>/`. |
| REQ-006 | **Honest verdicts.** Where a credential or binary is genuinely unavailable, the verdict is `SKIP` **with the concrete blocker named** — never `PARTIAL`, never `UNAUTOMATABLE`. This child is the standard's first honest consumer. | No forbidden verdict appears; every `SKIP` names its blocker. |
| REQ-007 | **Lane B produces real artifacts.** The research-loop scenario produces real loop artifacts — state records, deltas, synthesis. The closeout scenario produces a real spec-folder closeout. The artifact *is* the evidence. | Both artifacts exist and are referenced by the scenario's evidence section. |
| REQ-008 | **Lane C covers destructive lifecycles completely**: expiry dry-run; confirmed destructive clear plus its refusal path; scan start/status/cancel terminal states; reconcile dry-run/apply/rollback with active-shard-mismatch refusal. | All four lifecycles present; each destructive step has its refusal counterpart. |
| REQ-009 | **Anti-duplication.** No executor-specific behavior is asserted in more than one hub. | A cross-playbook ID-uniqueness check passes; the ownership ruling is recorded in the packet. |
| REQ-010 | **The 117-combination matrix is referenced, not expanded.** Lane A ships a small operator worklist plus an explicit pointer to the automated matrix. | Lane A scenario count is bounded and stated; the matrix is cited as an anchor. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | **Cross-playbook re-test before claiming absence.** Every "there is truly no scenario anywhere" claim is re-tested across all 11 playbooks, not just the owning hub. | A recorded cross-playbook search per absence claim. One research finding was refuted for exactly this reason; the check is not optional. |
| REQ-021 | Lane B scenarios live in the hub owning the user-facing command, per **OPERATOR-DECISION Q3**, with dependency-owned assertions linked rather than duplicated. | Placement matches the ruling; links present; no duplicated assertions. |
| REQ-022 | Each Lane A fail-closed scenario asserts the specific fail-closed behavior the hub declares, not a generic error. | Each cites the declared behavior it exercises. |
| REQ-023 | New scenarios are indexed in their root, and the derived census updates without a hand-typed number. | Child `001`'s derived-census check passes on every touched root. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The uncovered inventory is re-derived from live registries at phase start and recorded, before any
  scenario is authored.
- **SC-002**: Every "no scenario anywhere" claim is re-tested cross-playbook and the result recorded.
- **SC-003**: All 13 findings are closed either by an authored scenario or by a recorded not-applicable-because.
- **SC-004**: The uncovered-inventory report shrinks to exactly the recorded not-applicable set.
- **SC-005**: Every new scenario passes `validate-playbook-package.cjs --strict` on first commit.
- **SC-006**: Every Lane A and Lane C scenario has a real run artifact; no forbidden verdict appears anywhere.
- **SC-007**: Lane B's two scenarios produced real loop artifacts and a real spec-folder closeout.
- **SC-008**: The cross-playbook ID-uniqueness check passes — no executor behavior asserted twice.
- **SC-009**: Lane A's scenario count is bounded and stated; the automated matrix is referenced, not expanded.
- **SC-010**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child `001` coverage map and validator | Blocking. Without the map there is no worklist and no gate | Do not start authoring until `001` closes |
| Dependency | Child `002` | Sequencing. Authoring against broken scenarios and a mid-sweep census invites rework | Serial `002 → 003` is the lower-risk order even though parallel is possible |
| Dependency | **OPERATOR-DECISION Q3** (workflow ownership) | Lane B placement and the anti-duplication assertion | Ask once, record in the packet, test with the ID-uniqueness check |
| Dependency | **OPERATOR-DECISION Q5** | May add a fourth Lane-D item at 4-6 scenarios | Scope grows by a stated amount; the estimate is not silently absorbed |
| Risk | **Authoring from the finding list instead of the map** | Repeats the prose-driven coverage claims this program exists to end | REQ-001 makes the re-derivation a first task; the finding list is labelled a seed throughout |
| Risk | An "absent everywhere" claim is wrong because coverage lives under another hub | A duplicate scenario ships and the anti-duplication assertion fails late | REQ-020 cross-playbook re-test; one research finding was already refuted this way |
| Risk | Lane A balloons toward the 117-combination matrix | Unmaintainable scenario mass | REQ-010 bounds it explicitly; the matrix is an anchor |
| Risk | Credentials or binaries unavailable, tempting a soft verdict | Reintroduces the forbidden vocabulary the program just removed | REQ-006: `SKIP` with a named blocker, and the gate rejects the alternatives mechanically |
| Risk | Lane B end-to-end scenarios are slow and flaky | Battery becomes unrunnable | Bound the loop explicitly; assert on artifacts, not on wall-clock |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Lane B's end-to-end scenarios are explicitly bounded (iteration cap or equivalent) so the battery
  stays runnable by a human in one sitting.

### Security
- **NFR-S01**: Lane C runs against a disposable memory database, never a live one.
- **NFR-S02**: Lane A dispatches use read-only or otherwise isolated configurations where the executor supports it.
- **NFR-S03**: No authored scenario embeds a credential, token, or developer-absolute path.

### Reliability
- **NFR-R01**: Every authored scenario is reproducible by a second operator from a clean clone using only what the
  scenario states.
- **NFR-R02**: Every destructive Lane C step has a paired refusal assertion, so a misfire is observable.

---

## 8. EDGE CASES

### Data Boundaries
- An executor whose binary is absent in this environment: the fail-closed scenario is the *primary* deliverable
  and passes; the routed-workflow scenario is `SKIP` with the binary named as the blocker.
- A registry-declared feature that turns out to be internal-only with fully automated acceptance criteria: it owes
  nothing. Record the not-applicable-because and move on.

### Error Scenarios
- A destructive tool's confirmed-clear path succeeds but its refusal path does not fire: that is a product finding,
  not a scenario defect — record it and escalate rather than weakening the scenario.
- Lane B's loop does not converge within its bound: the scenario asserts the bounded-exit behavior, which is
  itself the observable contract.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | ~25-35 new scenario files across 8 hubs |
| Risk | 15/25 | External CLI dispatch and destructive MCP tools, but against disposable targets |
| Research | 12/20 | Full re-derivation of the inventory; cross-playbook absence re-testing |
| Multi-Agent | 6/15 | Lanes parallelize across hubs once the map lands |
| Coordination | 9/15 | Blocked by `001`, sequenced after `002`, one ownership ruling |
| **Total** | **63/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Authored from the finding list rather than the derived map | H | M | REQ-001 re-derivation as a first task |
| R-002 | Duplicate coverage because an absence claim was hub-scoped | M | M | REQ-020 cross-playbook re-test; ID-uniqueness check |
| R-003 | Lane A expands toward the automated matrix | M | M | REQ-010 bound stated up front |
| R-004 | A forbidden verdict reappears under credential pressure | M | M | Gate rejects it mechanically; REQ-006 |
| R-005 | Lane C destructive run hits a live database | H | L | Disposable database; NFR-S01 |
| R-006 | Lane B scenarios are too slow to be run | M | M | Explicit bound; assert on artifacts |
| R-007 | Q5 ruling arrives late and reopens scope | L | M | Scope growth stated as a discrete amount, not absorbed |

---

## 11. USER STORIES

### US-001: An operator can validate every routable executor (Priority: P0)

**As a** release operator, **I want** one realistic routed workflow and one fail-closed case per declared executor,
**so that** a hub claiming six routable workflows is validated across all six rather than two.

**Acceptance Criteria**:
1. Given the hub's declared executor list, When I read its playbook root, Then every declared executor appears with
   at least one routed-workflow scenario and one fail-closed scenario.

### US-002: A loop is validated end to end, not field by field (Priority: P0)

**As a** release operator, **I want** one scenario that runs a research loop from setup to user-facing output,
**so that** the corpus proves the loop works rather than proving its routing fields are well-formed.

**Acceptance Criteria**:
1. Given the end-to-end scenario, When I run it, Then real state records, deltas, and a synthesis exist afterward
   and are cited as its evidence.

### US-003: A destructive tool has a refusal path on record (Priority: P0)

**As a** maintainer, **I want** each destructive public tool's confirm and refuse paths both exercised, **so that**
a misfire is observable rather than silent.

**Acceptance Criteria**:
1. Given a destructive tool scenario, When it is read, Then a dry-run, a confirmed destructive step, and an
   explicit refusal assertion are all present.

---

## 12. OPEN QUESTIONS

- **OPERATOR-DECISION Q3** — who owns cross-skill end-to-end workflow scenarios? Gates Lane B placement and the
  anti-duplication assertion.
- **OPERATOR-DECISION Q5** — does `sk-prompt-models` owe a playbook package? If yes, this scope grows by an
  estimated 4-6 scenarios as a fourth Lane-D item.
- Which executors have a genuinely available binary or credential in this environment, and which will therefore
  land as an honest `SKIP` with a named blocker?
- Should the six-runtime and multi-executor coverage use one scenario with an adapter matrix, or one scenario per
  adapter? (Shared shape question with child `002`'s advisory repair — answer once.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent**: `sk-doc/024-playbook-scenario-coverage`
- **Predecessors**: `001-playbook-standard-and-fleet-normalization` (hard blocker),
  `002-scenario-accuracy-repair-risk-first` (sequencing)
