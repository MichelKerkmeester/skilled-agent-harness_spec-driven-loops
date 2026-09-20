---
title: "Tasks: risk-first repair of inaccurate playbook scenarios"
description: "Nineteen shipped scenarios are indexed, counted, and in several cases recorded PASS while their exact command sequence would fail today or would instruct the operator to violate a hard repository rule — an unpermissioned remote push, a worktree created outside the clone-wide allocator, a dispatch flag the target CLI rejects. This phase repairs them in four risk tiers, executing each repaired scenario once for real, and escalates the one finding that is a live safety-gate defect rather than a document error."
trigger_phrases:
  - "scenario accuracy repair risk first task list"
  - "playbook scenario coverage task list"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/024-playbook-scenario-coverage/002-scenario-accuracy-repair-risk-first"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phased task breakdown"
    next_safe_action: "Execute T001 confirm-against-HEAD before further tasks"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Risk-First Repair of Inaccurate Playbook Scenarios

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Status: **Planned** — no task is started. Every repair task is complete only when its scenario has been executed
once for real and the artifact filed.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm against HEAD

**No scenario is edited until this phase completes.** A finding is a hypothesis until its symptom is confirmed;
a reproduction that unexpectedly passes retires the finding rather than triggering a repair.

- [ ] T001 Provision a disposable clone and a disposable remote; verify with `git remote -v` that neither is the
      real `origin`. Record the verification.
- [ ] T002 Re-run the push scenario's exact sequence in the disposable clone; capture the actual behavior.
- [ ] T003 [P] Re-run the worktree scenario's exact sequence; capture the actual behavior and the naming violation.
- [ ] T004 [P] Re-run the allocator scenario's sequence from the working directory it implies; capture the
      unresolvable script path and any ref mutation left behind.
- [ ] T005 [P] Re-run the codex hook scenario; confirm the installer still exposes a non-mutating `--check` path.
- [ ] T006 [P] Re-run the context-save scenario; confirm the live command still defaults to a non-mutating save plan.
- [ ] T007 **Reproduce the Gate-3 parser against a bare `D` answer** and capture what it actually parses to
      (REQ-007). Re-read the displayed-menu construction and the answer-parser predicate at HEAD in the same pass.
- [ ] T008 [P] Re-confirm the dispatch flag is still rejected by the target CLI.
- [ ] T009 [P] Re-confirm the source directory the sk-code scenario targets is still absent.
- [ ] T010 [P] Re-confirm the runtime advisory hook named by the six-runtime matrix is still absent from this checkout.
- [ ] T011 [P] Re-read the remote-branch policy and the owner-first worktree naming contract at HEAD; the repairs
      cite what is read here, not what is remembered.
- [ ] T012 Record every reproduction transcript under the dated-run report tree; mark any finding whose symptom
      did NOT reproduce as refuted, with evidence.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Escalate the safety-gate defect

Filed first because it is the only task in this phase whose wall-clock is set by a person, not by the work.

- [ ] T020 File an **AMENDMENT-DECISION** under `system-spec-kit` for the Gate-3 option-letter contradiction,
      attaching the T007 reproduction: displayed semantics for `D`, parsed semantics for `D`, and the operator
      impact (an answer meaning "use a phase folder" is taken as "skip") (REQ-008).
- [ ] T021 State the decision needed in one line and the conflicting facts in two — do not propose a parser fix.
      **This packet does not draft the fix.**
- [ ] T022 [B] Record the operator ruling and its id in `decision-record.md` when it arrives. Blocked on T020.
- [ ] T023 [B] Resolve **OPERATOR-DECISION Q4b**: is the absent runtime advisory hook a relocation or an
      implementation gap the playbook must expose? Blocked on T010's evidence being presented.

### Tier 1 — remote publication and irreversible git state

- [ ] T030 Draft the destructive-isolation contract block that every Tier-1/2 scenario adopts; record it in
      `decision-record.md` (REQ-005).
- [ ] T031 Repair the push scenario: in-turn permission step, single-use scoped override, disposable remote target.
- [ ] T032 Add the Tier-1 negative assertion to the push scenario: an unapproved retry is **refused**, with the
      observable refusal signal named (REQ-003).
- [ ] T033 Execute the repaired push scenario once against the disposable remote; file the artifact (REQ-002, REQ-004).
- [ ] T034 Repair the worktree scenario to drive the clone-wide allocator instead of a hand-composed
      `git worktree add`, producing an owner-first branch and its matching directory.
- [ ] T035 Add the Tier-1 negative assertion to the worktree scenario: a direct `git branch` / `git checkout -b`
      is **refused** (REQ-003).
- [ ] T036 Execute the repaired worktree scenario once in the disposable clone; file the artifact.

### Tier 2 — unisolated state mutation

- [ ] T040 Repair the allocator scenario: explicit working directory, a script path that resolves, the isolation
      declaration, and cleanup evidence for the ref mutation and the concurrent-allocation case.
- [ ] T041 Execute the repaired allocator scenario in the disposable clone; confirm post-run state matches pre-run.
- [ ] T042 Repair the codex hook scenario to exercise the non-mutating `--check` drift path alongside the installs,
      asserting that `--check` mutates nothing.
- [ ] T043 Execute the repaired codex hook scenario; file the artifact.
- [ ] T044 Rewrite the context-save scenario as two cases — default non-mutating save plan, and explicit apply —
      driven through a disposable spec packet, replacing the noncanonical verdict with the ruled enum (REQ-022).
- [ ] T045 Execute both context-save cases; confirm the default case wrote nothing; delete and re-index the
      disposable packet as the declared cleanup.

### Tier 3 — external dispatch and safety gates

- [ ] T050 Repair the dispatch scenario: remove the rejected flag; use a dispatch form the target CLI accepts.
- [ ] T051 Execute the repaired dispatch scenario against the real binary; file the artifact. If the binary is
      genuinely unavailable, the verdict is `SKIP` with the concrete blocker named — never `PARTIAL`.
- [ ] T052 Repair the advisor scenarios' global precondition so they build the package they actually validate.
- [ ] T053 Execute the repaired advisor scenarios; file the artifacts.
- [ ] T054 **[B] Rewrite the Gate-3 scenario as a five-option round trip** — displayed label, parsed result, bound
      write boundary, skip behavior, child-session exemption — on every supported hook adapter, citing the ruling
      id. **Blocked on T022. Do not start this task without a ruling id** (REQ-009, SC-006).
- [ ] T055 [B] Execute the rewritten Gate-3 scenario across the supported adapters; file the artifacts. Blocked on T054.

### Tier 4 — stale contracts and route shapes

Each repair cites the live source read at repair time (REQ-021). None re-encodes a remembered value.

- [ ] T060 [P] Repoint the sk-code scenario at a source file that exists, or retire it with a recorded reason if
      the feature was removed rather than moved.
- [ ] T061 [P] Repair the cross-stack scenarios' dead asset and router paths against the real tree.
- [ ] T062 [P] Give the review-handoff scenario an executable command sequence.
- [ ] T063 [P] Convert the resume scenario from prose to commands.
- [ ] T064 [P] Repair the CLI compiled-routing scenario against the current route shape and packet kind.
- [ ] T065 [P] Repair the MCP "ordered bundle" scenario so it genuinely executes an ordered bundle, not a single route.
- [ ] T066 [P] Repair the sk-design compiled/pairing route shape.
- [ ] T067 [P] Repair the Open Design scenario's mode count against the live registry.
- [ ] T068 [P] Repair the sk-prompt scenario's superseded packet ids and command syntax.
- [ ] T069 [P] Repair the chain-call scenario so the chain does not target a native tool.
- [ ] T070 [B] Extend the advisory scenario to cover all six runtime adapters per the T023 ruling.
- [ ] T071 Execute each Tier-4 repaired scenario once; file the artifacts.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Close

- [ ] T080 Run child `001`'s cited-path resolver over every repaired file; require zero unresolvable paths (REQ-006).
- [ ] T081 Add the `test -f` preflight to every scenario that claims to edit a file.
- [ ] T082 Run `validate-playbook-package.cjs --strict` over the repaired set; require exit 0 (REQ-010).
- [ ] T083 Confirm no repaired scenario gained a baked run transcript or a developer-absolute path (REQ-023).
- [ ] T084 Reconcile `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` so no
      document claims a completion state another contradicts.
- [ ] T085 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict`.
- [ ] T086 Hand off to child `003`: the repaired baseline plus the destructive-isolation contract it inherits.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`; no `[B]` blocked tasks remaining.
- [ ] Every one of the 19 findings closed by a scenario that was executed once for real, with a filed artifact.
- [ ] The Gate-3 rewrite exists **and** cites an adjudicated ruling id. A rewrite without a ruling id is a
      failure of this phase regardless of its content.
- [ ] Cited-path resolver returns zero unresolvable paths across the repaired set.
- [ ] `validate-playbook-package.cjs --strict` exits 0 over the repaired set.
- [ ] `validate.sh --strict` exits 0 for this folder; `checklist.md` fully verified with evidence.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md` (destructive-isolation contract; recorded amendment ruling)
- **Parent**: `sk-doc/024-playbook-scenario-coverage`
- **Predecessor**: `001-playbook-standard-and-fleet-normalization` (hard blocker)
- **Successor**: `003-uncovered-workflow-authoring`
<!-- /ANCHOR:cross-refs -->
