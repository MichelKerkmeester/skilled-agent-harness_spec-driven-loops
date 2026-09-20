---
title: "Feature Specification: risk-first repair of inaccurate playbook scenarios"
description: "Nineteen shipped scenarios are indexed, counted, and in several cases recorded PASS while their exact command sequence would fail today or would instruct the operator to violate a hard repository rule — an unpermissioned remote push, a worktree created outside the clone-wide allocator, a dispatch flag the target CLI rejects. This phase repairs them in four risk tiers, executing each repaired scenario once for real, and escalates the one finding that is a live safety-gate defect rather than a document error."
trigger_phrases:
  - "playbook scenario repair"
  - "scenario teaches rule violation"
  - "stale playbook commands"
  - "gate-3 option letter defect"
  - "destructive scenario isolation"
importance_tier: "high"
contextType: "planning"
parent: "sk-doc/024-playbook-scenario-coverage"
_memory:
  continuity:
    packet_pointer: "sk-doc/024-playbook-scenario-coverage/002-scenario-accuracy-repair-risk-first"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the risk-first repair child spec from the track (d) synthesis proposal"
    next_safe_action: "Run the confirm-against-HEAD tier-1/2 reproductions in a disposable clone"
    blockers:
      - "Blocked by child 001 (verdict enum, contract checker, path resolver)"
      - "AMENDMENT-DECISION gate: the Gate-3 D/E contradiction must be adjudicated before the scenario rewrite"
      - "OPERATOR-DECISION Q4 also owns whether the absent cursor advisory hook is a relocation or a gap"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 0
    open_questions:
      - "Q4 Gate-3 D/E amendment decision"
      - "Q4b is the absent cursor git-preflight advisory hook a relocation or an implementation gap"
      - "What is the disposable-remote target for tier-1 execution?"
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

# Feature Specification: Risk-First Repair of Inaccurate Playbook Scenarios

> Phase adjacency under the `024-playbook-scenario-coverage` parent: predecessor `001-playbook-standard-and-fleet-normalization`
> (a hard blocker, not just an ordering); successor `003-uncovered-workflow-authoring`.

---

## EXECUTIVE SUMMARY

A gap is silence. A wrong scenario is **misinformation with an authority stamp** — indexed, counted, and in cases
recorded PASS, while its exact command sequence would fail today or would teach an operator to do something the
repository forbids. Nineteen such scenarios are repaired here, ordered by blast radius rather than by severity
label: remote publication first, unisolated state mutation second, external dispatch and safety gates third,
stale contracts last.

**Key Decisions**: the destructive-isolation contract every rewritten Tier-1/2 scenario adopts; and the
adjudication of the Gate-3 option-letter contradiction, which is a runtime defect and not a document error.

**Critical Dependencies**: child `001` must land first — this phase consumes its verdict enum, its contract
checker, and its cited-path resolver. The Gate-3 scenario rewrite is additionally blocked on an amendment decision.

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

A dedicated research pass walked existing scenarios against current behavior and found a class the census work
cannot see. These scenarios pass every count and every index check. What they fail is execution.

Three examples set the severity:

- A git scenario's exact step 2 is a bare `git push -u origin feature/example` — no in-turn permission, no
  single-use override. It teaches precisely the push the repository's pre-push hook exists to block.
- A worktree scenario runs `git worktree add .worktrees/login-timeout -b fix/login-timeout main`, violating
  owner-first `{owner}/{NNNN}-{slug}` naming and bypassing the clone-wide allocator entirely.
- A dispatch scenario passes `--agent general`, a flag the target CLI explicitly rejects on run. The dispatch dies
  before any of the scenario's expected evidence could exist.

And one is not a documentation defect at all: the Gate-3 scenario certifies contradictory option-letter behavior
and records PASS. See §5.

### Purpose

Repair each scenario so that its stated commands are the commands that actually work and actually comply, prove
it by executing each repaired scenario once for real, and route the one live safety-gate defect to an amendment
decision instead of papering over it in a documentation packet.

### Non-Goals

- Authoring new scenarios for absent coverage — that is child `003`.
- Census, index, template, or validator work — that is child `001`.
- **Drafting the Gate-3 parser fix.** This phase reproduces and escalates; the fix belongs under `system-spec-kit`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Four risk tiers, executed in order. Tier order is by blast radius of following the scenario as written, not by
the severity label on the finding.

**Tier 1 — remote publication and irreversible git state (2).** Rewrite the push scenario to show the in-turn
permission, the single-use scoped override, **and** an assertion that an unapproved retry is refused; target a
disposable remote. Rewrite the worktree scenario to drive the clone-wide allocator
(`bash .opencode/skills/sk-git/scripts/worktree-naming.sh create <owner> <slug>`) rather than a hand-composed
`git worktree add`.

**Tier 2 — unisolated state mutation (3).** The allocator scenario runs `git update-ref` and concurrent
allocations with no cleanup and no destructive-isolation contract, from an unspecified working directory against
a relative script path that does not resolve. The codex hook scenario performs two state-mutating installs and
never exercises the non-mutating `--check` drift path the live installer exposes. The mandatory context-save
scenario drives the generator directly against a missing input, records an error code, and assigns a noncanonical
verdict — while the live command defaults to a **non-mutating save plan**; it is rewritten as two cases,
default-plan and explicit-apply, through a disposable packet.

**Tier 3 — external CLI dispatch and safety gates (3).** The rejected `--agent general` dispatch. The Gate-3
scenario (see §5 — blocked on an amendment decision). The advisor scenarios whose global precondition builds the
wrong package, so they validate an artifact they never built.

**Tier 4 — stale contracts and route shapes, no live hazard (11).** A scenario targeting a source directory that
does not exist; scenarios citing dead resource paths; two scenarios with no executable commands at all; obsolete
route shapes and packet kinds; superseded packet identities and command syntax; a chain call that targets a
native tool; and single-adapter coverage of a six-runtime advisory.

### Out of Scope

- The Gate-3 parser fix itself.
- Nested playbooks under `system-deep-loop/**` — owned by the WS1 register. Coordination on sequencing only; no
  shared file.
- New scenarios for uncovered features — child `003`.

### Findings in Scope (19)

| ID | Sev | Kind | Subject | Tier |
|----|-----|------|---------|------|
| `RD-010-04` | P1 | nonconformance | Push scenario publishes to a remote with no permission enforcement | 1 |
| `RD-008-05` | P1 | nonconformance | Worktree scenario violates owner-first naming and bypasses the allocator | 1 |
| `RD-008-06` | P1 | nonconformance | Allocator scenario mutates refs with no cleanup, no isolation, unresolvable script path | 2 |
| `RD-005-05` | P2 | gap | Codex hook scenario omits the non-mutating `--check` drift path | 2 |
| `RD-003-04` | P1 | nonconformance | Mandatory context-save scenario is stale, mutating, and records a noncanonical verdict | 2 |
| `RD-008-04` | P1 | nonconformance | Dispatch scenario passes a flag the target CLI rejects on run | 3 |
| `RD-003-02` | P1 | nonconformance | Gate-3 scenario certifies contradictory option letters and records PASS — **see §5** | 3 |
| `RD-007-04` | P1 | nonconformance | Advisor scenarios build the wrong package as their global precondition | 3 |
| `RD-008-03` | P1 | nonconformance | Scenario targets a source file under a directory that does not exist | 4 |
| `RD-002-02` | P1 | nonconformance | Cross-stack scenarios cite dead asset and router paths | 4 |
| `RD-010-03` | P1 | nonconformance | Review-handoff scenario has no executable commands | 4 |
| `RD-003-05` | P2 | nonconformance | Resume scenario is prose, not commands | 4 |
| `RD-005-02` | P1 | nonconformance | CLI compiled-routing scenario certifies an obsolete shape and packet kind | 4 |
| `RD-005-03` | P1 | nonconformance | An "ordered bundle" scenario executes a single route | 4 |
| `RD-002-04` | P1 | nonconformance | Compiled/pairing route shape is stale | 4 |
| `RD-008-07` | P2 | nonconformance | Open Design scenario asserts an obsolete mode count | 4 |
| `RD-007-02` | P1 | nonconformance | Scenario asserts superseded packet ids and command syntax | 4 |
| `RD-008-02` | P1 | nonconformance | Chain call targets a native tool from inside the chain | 4 |
| `RD-006-04` | P1 | gap | Advisory scenario covers one of six runtime adapters | 4 |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-git/manual-testing-playbook/integration-and-pr/finish-create-pr-with-template.md` | Modify | Tier 1 — permission, scoped override, refusal assertion |
| `.opencode/skills/sk-git/manual-testing-playbook/worktree-setup/fresh-feature-isolated-worktree.md` | Modify | Tier 1 — allocator-driven; also the verdict-enum negative fixture source |
| `.opencode/skills/sk-git/manual-testing-playbook/owner-first-worktree-tooling/locked-unique-number-allocation.md` | Modify | Tier 2 — isolation contract, cleanup evidence, resolvable path, explicit cwd |
| `.opencode/skills/sk-git/manual-testing-playbook/git-preflight-advisory/advisory-fires-on-silent-scope-drop.md` | Modify | Tier 4 — six-runtime adapter coverage |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/spec-mutation-gate-enforce.md` | Modify | Tier 3 — **blocked on the amendment decision** |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/memory-quality-and-indexing/context-save-index-update.md` | Modify | Tier 2 — two cases: default plan, explicit apply |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/retrieval/session-recovery-spec-kit-resume.md` | Modify | Tier 4 — prose to commands |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/main-agent-review-and-verdict-handoff.md` | Modify | Tier 4 — add executable commands |
| `.opencode/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/completion-verification-workflow.md` | Modify | Tier 4 — align to live completion gate |
| `.opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md` | Modify | Tier 2 — add the non-mutating `--check` path |
| `.opencode/skills/cli-external-orchestration/manual-testing-playbook/compiled-routing/ordered-bundle-cli-transport-compiled-routing.md` | Modify | Tier 4 — current shape and packet kind |
| `.opencode/skills/sk-doc/manual-testing-playbook/agent-dispatch/markdown-agent-cli-opencode.md` | Modify | Tier 3 — remove the rejected flag |
| `.opencode/skills/sk-code/manual-testing-playbook/surface-detection/opencode-detection.md` | Modify | Tier 4 — target a file that exists |
| `.opencode/skills/sk-code/manual-testing-playbook/cross-stack-routing/*.md` | Modify | Tier 4 — resolve cited asset and router paths |
| `.opencode/skills/sk-design/manual-testing-playbook/{compiled-routing,hub-manager-intake,mode-routing}/*.md` | Modify | Tier 4 — route shape, pairing, mode count |
| `.opencode/skills/mcp-tooling/manual-testing-playbook/compiled-routing/ordered-bundle-figma-refero-compiled-routing.md` | Modify | Tier 4 — genuine ordered-bundle execution |
| `.opencode/skills/mcp-code-mode/manual-testing-playbook/core-tools/call-tool-chain-execution.md` | Modify | Tier 4 — chain must not call a native tool |
| `.opencode/skills/sk-prompt/manual-testing-playbook/**` | Modify | Tier 4 — current packet ids and command syntax |
| `.opencode/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md` | Modify | Tier 3 — correct the global precondition |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | **Reproduce before repairing.** Every Tier-1 and Tier-2 scenario's exact command sequence is executed at HEAD in a disposable clone and the actual failure is captured, before any edit. | A captured transcript per Tier-1/2 scenario showing the real failure, dated and stored under the run-report tree. |
| REQ-002 | **Execute every repaired scenario once, for real, before marking it repaired.** "The document now looks right" is insufficient here — the defect class *is* "the document looked right and the commands failed". | A run artifact per repaired scenario under `<skill>/benchmark/reports/<dated-run>/`. |
| REQ-003 | **Tier 1 adds a negative assertion each.** The push scenario asserts that an unapproved retry is **refused**; the worktree scenario asserts that a direct `git branch` / `git checkout -b` is **refused**. | Each scenario contains an explicit expected-refusal step with the observable signal named. |
| REQ-004 | **Tier 1 and Tier 2 execute against disposable targets.** A disposable clone, and for the push scenario a disposable remote. No Tier-1/2 execution touches the real origin. | The scenario names its disposable target; the run transcript shows it. |
| REQ-005 | **Every Tier-1 and Tier-2 scenario declares a destructive-isolation contract** and carries cleanup evidence: what it mutates, where, how it is isolated, and how the mutation is reverted. | Each of the five scenarios has the declaration and a cleanup-evidence step; the contract itself is recorded in `decision-record.md`. |
| REQ-006 | **Mechanical backstop.** Child `001`'s cited-path resolver returns zero unresolvable paths across all repaired files, and every file a scenario claims to edit passes a `test -f` preflight. | Resolver run over the repaired set exits clean; the preflight is part of each repaired scenario. |
| REQ-007 | **`RD-003-02` reproduce-first.** The Gate-3 parser is executed against a bare `D` answer and the actual parse result is captured, before any fix or rewrite is proposed. | A captured transcript showing what a bare `D` actually parses to. |
| REQ-008 | **`RD-003-02` AMENDMENT-DECISION gate.** The reproduced contradiction is escalated as an amendment decision under `system-spec-kit` — the runtime's own packet — and the operator ruling is recorded before anything else on this finding proceeds. | The amendment is opened, the ruling recorded in `decision-record.md`, referenced by ruling id. |
| REQ-009 | **`RD-003-02` rewrite is blocked on REQ-008.** The scenario is rewritten as a five-option round trip — displayed label, parsed result, bound write boundary, skip behavior, child-session exemption — on every supported hook adapter, **only after** adjudication, so it certifies the ruled behavior rather than re-certifying the contradiction. | The rewrite task is marked `[B]` until the ruling exists; the rewritten scenario cites the ruling. |
| REQ-010 | **No repaired scenario carries a forbidden verdict.** Every repaired file passes child `001`'s validator under `--strict`. | Validator exits 0 over the repaired set. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-020 | Confirm the absent runtime advisory hook is still absent at HEAD, and resolve whether that is an intentional relocation or an implementation gap the playbook must expose (**OPERATOR-DECISION Q4b**) before authoring its six-runtime coverage. | The absence is re-confirmed; the ruling is recorded; the scenario reflects it. |
| REQ-021 | Tier-4 repairs assert against live registries, not remembered values — mode counts, packet kinds, route shapes, and command syntax are read from source at repair time. | Each Tier-4 repair cites the live source it was derived from. |
| REQ-022 | The context-save repair covers both the default non-mutating save-plan case and the explicit-apply case, through a disposable packet. | Two cases present; the disposable packet named. |
| REQ-023 | Run artifacts land in the dated-run report tree the predecessor packet built — never baked back into scenario truth. | No repaired scenario gains a baked transcript; child `001`'s evergreen-truth check passes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every Tier-1 and Tier-2 scenario has a pre-repair reproduction transcript captured at HEAD.
- **SC-002**: Every one of the 19 findings is closed by a repaired scenario that was executed once for real, with
  a run artifact under the dated-run report tree.
- **SC-003**: The two Tier-1 scenarios each carry an explicit refusal assertion, and neither touches the real origin.
- **SC-004**: All five Tier-1/2 scenarios declare a destructive-isolation contract and carry cleanup evidence.
- **SC-005**: Child `001`'s cited-path resolver returns **zero** unresolvable paths across every repaired file.
- **SC-006**: `RD-003-02` has a reproduction, an adjudicated amendment ruling, and a rewrite that cites it — in
  that order. A rewrite that landed before the ruling is a failure of this phase regardless of its content.
- **SC-007**: Child `001`'s `validate-playbook-package.cjs --strict` exits 0 over every repaired file.
- **SC-008**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child `001` | Blocking. Verdict enum, contract checker, and path resolver all come from it | Do not start Tier repairs before `001` closes; the reproductions in Phase 1 may run earlier |
| Dependency | **AMENDMENT-DECISION** on the Gate-3 contradiction | Blocks one Tier-3 repair entirely | Reproduce early so the escalation is filed with evidence, not inference; the other 18 repairs proceed meanwhile |
| Dependency | **OPERATOR-DECISION Q4b** (absent advisory hook) | Blocks the six-runtime advisory repair | Re-confirm absence first; ask once with the evidence |
| Risk | **Executing repaired scenarios mutates real state** | High — these are the scenarios that push, allocate, and install | Disposable clone and disposable remote; destructive-isolation declaration is a P0, not a nicety |
| Risk | A repaired scenario is verified by reading, not running | The exact defect class returns | REQ-002 is written as an artifact requirement, not a claim |
| Risk | Fixing the Gate-3 scenario before the ruling re-certifies the contradiction | The safety gate stays broken with a green test over it | The rewrite task stays `[B]` and the checklist blocks completion on the ruling id |
| Risk | Tier-4 repairs re-encode today's remembered values and go stale again | Repeat of the original defect | REQ-021 requires citation of the live source read at repair time |
| Risk | The disposable remote is misconfigured and a Tier-1 run reaches the real origin | High, irreversible-ish | Verify the remote before the run; the run transcript must show the disposable target |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No performance target. Execution cost is dominated by real command runs and is accepted.

### Security
- **NFR-S01**: No Tier-1/2 execution touches the real `origin` or any credentialed production surface.
- **NFR-S02**: No run artifact contains credentials, tokens, or developer-absolute paths.
- **NFR-S03**: The push scenario demonstrates the permission requirement; it never demonstrates a way around it.

### Reliability
- **NFR-R01**: Every repaired scenario is reproducible by a second operator from a clean clone using only what the
  scenario states.

---

## 8. EDGE CASES

### Data Boundaries
- A repaired scenario whose real execution now legitimately cannot run (binary or credential unavailable): the
  verdict is `SKIP` **with the concrete blocker named** — never `PARTIAL`, never `UNAUTOMATABLE`.
- A Tier-4 target whose feature was removed rather than changed: the scenario is retired with a recorded reason,
  not silently rewritten to something else.

### Error Scenarios
- A reproduction that unexpectedly **passes** at HEAD: the finding is treated as refuted, recorded as such, and
  not repaired. A finding is a hypothesis until the symptom is confirmed.
- The amendment ruling contradicts the displayed menu rather than the parser: the rewrite certifies whatever was
  ruled; this phase does not relitigate it.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | 19 scenarios across 9 hubs, each executed for real |
| Risk | 22/25 | Mutates git state, pushes to a remote, installs runtime hooks, writes to the memory DB |
| Research | 12/20 | Reproduction-first across all tiers; one live runtime adjudication |
| Multi-Agent | 4/15 | Single workstream, tiers are sequential |
| Coordination | 8/15 | Blocked by `001`; one amendment under another packet; sequencing note with a WS1 packet |
| **Total** | **64/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A Tier-1 execution reaches the real origin | H | L | Disposable remote verified before the run; transcript must show it |
| R-002 | Repairs verified by reading rather than running | H | M | Run artifact per scenario is a P0 acceptance criterion |
| R-003 | The Gate-3 scenario is rewritten before adjudication | H | M | Task stays `[B]`; checklist blocks on the ruling id |
| R-004 | Tier-2 allocator run corrupts refs in a shared clone | M | L | Disposable clone; isolation declaration; cleanup evidence |
| R-005 | Tier-4 repairs go stale again | M | M | Cite the live source read at repair time |
| R-006 | A reproduction passes and the finding is repaired anyway | M | M | Confirm the symptom before acting; record refutations |

---

## 11. USER STORIES

### US-001: An operator follows a scenario and stays compliant (Priority: P0)

**As a** release operator, **I want** a scenario's commands to be commands I am permitted to run, **so that** following
the playbook does not put me in violation of a hard repository rule.

**Acceptance Criteria**:
1. Given the push scenario, When I follow it exactly, Then I am shown the in-turn permission and the single-use
   scoped override, and an unapproved retry is demonstrated to be refused.

### US-002: A destructive scenario cleans up after itself (Priority: P0)

**As a** release operator, **I want** every state-mutating scenario to declare what it mutates and how to revert,
**so that** running the battery does not leave my clone in an unknown state.

**Acceptance Criteria**:
1. Given any Tier-1 or Tier-2 scenario, When I read its contract, Then the mutation, the isolation, and the
   cleanup are all stated before the first command.

### US-003: A safety gate is certified against ruled behavior (Priority: P0)

**As a** maintainer, **I want** the Gate-3 scenario to certify the behavior the operator ruled, **so that** a green
scenario is not sitting on top of a live contradiction.

**Acceptance Criteria**:
1. Given the rewritten Gate-3 scenario, When it is read, Then it cites the amendment ruling and exercises all five
   options end to end on every supported adapter.

---

## 12. OPEN QUESTIONS

- **AMENDMENT-DECISION (OPERATOR-DECISION Q4)** — the Gate-3 D/E contradiction. See §5 of the parent spec. Blocks
  REQ-009 entirely.
- **OPERATOR-DECISION Q4b** — is the absent runtime advisory hook an intentional relocation or an implementation
  gap the playbook must expose?
- What is the disposable-remote target for Tier-1 execution, and who provisions it?
- Does the six-runtime advisory coverage belong in one scenario with an adapter matrix, or one scenario per adapter?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md` (to be created — the destructive-isolation contract and the
  recorded amendment ruling)
- **Parent**: `sk-doc/024-playbook-scenario-coverage`
- **Predecessor**: `001-playbook-standard-and-fleet-normalization`
