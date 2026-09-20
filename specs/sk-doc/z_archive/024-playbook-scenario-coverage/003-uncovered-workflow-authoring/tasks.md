---
title: "Tasks: authoring the operator scenarios the coverage map proves are owed"
description: "With the operator-scenario contract enforceable and the false coverage removed, this phase authors what is genuinely absent: four uncovered external executors and their fail-closed cases, two end-to-end user-boundary workflows that no scenario runs today, the destructive and asynchronous public MCP tools that appear in no executable scenario, and seven declared-but-unauthored features and mode boundaries. The derived coverage map is the worklist and the gate; the applicability rule governs every item, so absence of a file is never by itself the reason to author one."
trigger_phrases:
  - "uncovered workflow authoring task list"
  - "playbook scenario coverage task list"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/024-playbook-scenario-coverage/003-uncovered-workflow-authoring"
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

# Tasks: Authoring the Operator Scenarios the Coverage Map Proves Are Owed

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Status: **Planned** — no task is started. A scenario task is complete only when the scenario passes the gate on
its first commit; a follow-up fix commit means it was not authored to the contract.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm against HEAD and re-derive the map

**Do not trust the finding list as the worklist.** It is a seed. The live registries are the truth, and one
finding in this very research loop was refuted because coverage lived under a different hub.

- [ ] T001 Re-derive the uncovered inventory per hub from live `mode-registry.json`, `command-metadata.json`,
      public MCP tool schemas, and registered hooks/adapters; record it as the phase-start baseline (REQ-001).
- [ ] T002 Diff the re-derived inventory against the 13 seed findings; record any finding the map does not confirm
      and re-examine it rather than authoring on faith.
- [ ] T003 [P] Re-confirm the four executors are still absent from the cli-ext playbook root (`grep -c` → 0), and
      re-confirm the declared workflow-mode count from the hub's own SKILL.md.
- [ ] T004 [P] Re-confirm the two destructive memory tools appear in no executable scenario, and that the two
      asynchronous scan tools appear only inside an umbrella inventory list.
- [ ] T005 [P] Re-confirm the GitKraken integration has zero mentions anywhere in the sk-git playbook.
- [ ] T006 [P] Re-check the two never-authored sk-doc scenario ids against the sk-doc root's own notes, which may
      have moved since the research pass.
- [ ] T007 **Re-test every "there is truly no scenario anywhere" claim cross-playbook**, across all 11 hubs, and
      record each search (REQ-020). This is the check that would have caught the finding the loop refuted.
- [ ] T008 Survey executor binary and credential availability; plan which scenarios will honestly land as `SKIP`
      with a named blocker, so the verdict is decided by evidence rather than improvised under pressure.
- [ ] T009 [B] Take the cross-skill workflow ownership ruling (**OPERATOR-DECISION Q3**) and record it in the packet.
- [ ] T010 State the Lane A bound — how many manual scenarios, and why that is the right number given the
      automated combination matrix already covers command construction (REQ-010).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A — external executor dispatch

- [ ] T020 Author one realistic routed-workflow scenario per uncovered executor (4).
- [ ] T021 Author one fail-closed scenario per uncovered executor (4), each asserting the hub's **declared**
      fail-closed behavior when the binary is absent, not a generic error (REQ-022).
- [ ] T022 Author the deep-loop executor-kind parity coverage against the live executor schema.
- [ ] T023 Author the fan-out parity coverage for the kinds the current fan-out scenario does not exercise.
- [ ] T024 Cite the automated combination matrix in the Lane A scenarios as the existing automated
      command-construction anchor; assert in review that no scenario duplicates a matrix row.
- [ ] T025 Execute each Lane A scenario once against the real binary where available; file the artifacts. Where a
      binary is genuinely unavailable, record `SKIP` with the concrete blocker named (REQ-005, REQ-006).

### Lane B — end-to-end user-boundary workflows

- [ ] T030 [B] Author the bounded end-to-end research-loop scenario in the hub the Q3 ruling assigns: setup →
      executor selection → child dispatch → state records → convergence → synthesis → user-facing output.
      Blocked on T009.
- [ ] T031 [B] Author the successful implementation-to-closeout lifecycle scenario. Blocked on T009.
- [ ] T032 Link dependency-owned assertions rather than duplicating them; the executor-selection assertions stay
      with the executor hub (REQ-021).
- [ ] T033 Run both scenarios; confirm real loop artifacts (state records, deltas, synthesis) and a real
      spec-folder closeout exist, and cite them as the scenarios' evidence (REQ-007).

### Lane C — public mutating and asynchronous tools

Every destructive step gets a paired refusal assertion. A destructive tool with no observable refusal path is a
product finding, not a scenario shortfall — record and escalate rather than weakening the scenario.

- [ ] T040 Provision a disposable memory database; confirm it is not the live one.
- [ ] T041 Author the expiry dry-run lifecycle.
- [ ] T042 Author the confirmed destructive clear **plus** its refusal path.
- [ ] T043 Author scan start / status / cancel across terminal states.
- [ ] T044 Author reconcile dry-run / apply / rollback including the active-shard-mismatch refusal (REQ-008).
- [ ] T045 Execute all four lifecycles against the disposable database; file the artifacts; drop and re-provision
      the database as the declared cleanup.

### Lane D — declared-but-unauthored features and mode boundaries

- [ ] T050 [P] Author the two sk-doc scenario ids the root records as never authored.
- [ ] T051 [P] Author scenarios for sk-code's two workflow modes, plus its uncovered Webflow and OpenCode
      secondary surfaces.
- [ ] T052 [P] Author scenarios for both `/interface:*` commands — the hub's sole public command surface.
- [ ] T053 [P] Replace the retired routing probe with live quality-control coverage that actually executes the
      work: structure extraction, quality scoring, the validation gates, and re-validation.
- [ ] T054 [P] Author dedicated scenarios for the three registered sk-doc modes that have none.
- [ ] T055 [P] Author the GitKraken MCP integration scenario, covering its Bash-only local-mutation rules and its
      cross-provider operations.
- [ ] T056 [P] Author the Pi prompt-advisor bridge scenario, matching the depth of its three covered sibling runtimes.
- [ ] T057 [B] If **OPERATOR-DECISION Q5** rules that `sk-prompt-models` owes a playbook, author that package as
      the fourth Lane-D item (estimated 4-6 scenarios). Otherwise confirm child `001` recorded the exemption.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Close

- [ ] T060 Re-run the uncovered-inventory derivation; confirm it shrank to exactly the recorded not-applicable set
      (REQ-002, SC-004).
- [ ] T061 Write the not-applicable register: every residual entry names which limb of the applicability rule it
      fails — not operator-visible, not integration-critical, not release-gating, not orchestration-shaped (REQ-003).
- [ ] T062 Run the cross-playbook scenario-ID uniqueness check; confirm no executor behavior is asserted in more
      than one hub (REQ-009).
- [ ] T063 Run `validate-playbook-package.cjs --strict` over every new scenario; confirm each passed on its first
      commit with no follow-up fix commit (REQ-004).
- [ ] T064 Confirm every touched root's census re-derived with no hand-typed number (REQ-023).
- [ ] T065 Confirm no forbidden verdict appears anywhere in the new set, and every `SKIP` names a concrete blocker.
- [ ] T066 Reconcile `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.
- [ ] T067 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`; no `[B]` blocked tasks remaining.
- [ ] All 13 findings closed by an authored scenario or a recorded not-applicable-because.
- [ ] The uncovered-inventory report equals the recorded not-applicable set — closure by report, not by assertion.
- [ ] Every new scenario passed the gate on first commit; every Lane A/C scenario has a real run artifact.
- [ ] Cross-playbook ID-uniqueness check passes.
- [ ] `validate.sh --strict` exits 0 for this folder; `checklist.md` fully verified with evidence.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Parent**: `sk-doc/024-playbook-scenario-coverage`
- **Predecessors**: `001-playbook-standard-and-fleet-normalization` (hard blocker),
  `002-scenario-accuracy-repair-risk-first` (sequencing)
<!-- /ANCHOR:cross-refs -->
