---
title: "Tasks: Routing remediation for the mcp-tooling six-mode hub: deterministic routing, route-gold benchmark enforcement, transport trust metadata, six-mode traceability"
description: "Task breakdown for the six-phase remediation: adjudication gate, WS1 router fixes, WS2 route-gold enforcement plus new-run-label benchmark, WS3 transport trust, WS4 traceability, terminal re-review. All tasks pending; this is a planning packet."
trigger_phrases:
  - "routing remediation tasks"
  - "ws1 router tasks"
  - "route-gold gate tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/011-routing-remediation"
    last_updated_at: "2026-07-16T18:55:00Z"
    last_updated_by: "claude"
    recent_action: "Authored task breakdown per plan phases"
    next_safe_action: "Execute T001 after ADR-001 operator ruling"
    blockers:
      - "T001 (ADR-001 ruling) gates T010 onward"
    key_files:
      - "plan.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-011-routing-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Routing remediation for the mcp-tooling six-mode hub: deterministic routing, route-gold benchmark enforcement, transport trust metadata, six-mode traceability

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

All tasks below are pending: this packet is the plan; implementation runs later via `/speckit:implement` (interactive `:auto` supervision, not unattended `:autopilot`), after the T001 ruling. Task phases map to plan.md phases as noted in each heading.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [plan Phase 0: P0 adjudication and regression freeze - GATE]

- [ ] T001 Obtain the operator ruling on ADR-001 defaultResource semantics; record it and flip ADR-001 to Accepted (decision-record.md) [blocks T010 onward]
- [ ] T002 Confirm or amend ADR-002 route-gold gate scope with the operator (decision-record.md) [blocks T020 onward]
- [ ] T003 [P] Freeze current replay outputs for 13 hub and 49 packet scenarios as regression fixtures (scratch/, then evidence folder)
- [ ] T004 [P] Capture pre-change baselines: package/hub gate outputs, advisor ratchet counts, advisor probe results (evidence folder)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [plan Phases 1-4: WS1-WS4]

### WS1 hub router fixes, F001-F005 [depends: T001]

- [ ] T010 Apply the ADR-001 ruling to routerPolicy.defaultResource and to all 13 scenarios' expected_resources (.opencode/skills/mcp-tooling/hub-router.json; manual_testing_playbook/hub_routing/*.md)
- [ ] T011 Separate hub-identity discovery evidence from per-mode scoring; make MT-004 produce an executable defer (.opencode/skills/mcp-tooling/hub-router.json; hub_routing/ambiguous_defer.md)
- [ ] T012 Fix Figma lexical recall so the committed positive scenario routes to mcp-figma (.opencode/skills/mcp-tooling/hub-router.json figma classes; hub_routing/figma_transport.md; hub description.json trigger example)
- [ ] T013 Resolve the Refero/Mobbin screen-examples collision; reserve provider-neutral vocabulary for defer or sk-design (.opencode/skills/mcp-tooling/hub-router.json)
- [ ] T014 Adjudicate hub holdouts MT-H02 to MT-H06: extend vocabulary or re-adjudicate out of gold with rationale (hub_routing/holdout_*.md)
- [ ] T015 Re-replay all 13 hub scenarios; assert MT-H01 boundary and registry-alias alignment unchanged against T003 fixtures

### WS2 harness enforcement and benchmark re-run, F008 and F012-F015 [depends: T002, T010-T015]

- [ ] T020 Implement the route-gold hard gate per ADR-002: flag, hub-type default, loud gold parse failures, report fields (.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs; load-playbook-scenarios.cjs)
- [ ] T021 Change replay resource assembly to the ruled defaultResource semantics (.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs)
- [ ] T022 [P] Adjudicate packet holdout recall for CU-H01, CU-H02, MB-H01, MB-H02; align gold or vocabulary (mcp-click-up and mcp-mobbin intra_routing_recall / intra-routing-recall)
- [ ] T023 [P] Choose rejection vs packet-level fallback semantics and align all six negative fixtures plus runtime zero-score branches (six packets' negative scenarios and SKILL.md router pseudocode)
- [ ] T024 Add replay/runtime parity assertions for every documented fallback branch, including ClickUp's hardcoded fallback (skill-benchmark harness tests)
- [ ] T025 [P] Adjudicate universal base resources and align the 11 positive packet gold rows (Aside 4, Chrome 3, Mobbin 2, Refero 2 scenarios)
- [ ] T026 Enforcement proof: demonstrate a previously-passing route-violating scenario now FAILS the benchmark (control run, evidence captured)
- [ ] T027 Re-run the Lane-C benchmark into a NEW run-label folder; verify baseline/ untouched and route-gold rows above 0 (.opencode/skills/mcp-tooling/benchmark/)
- [ ] T028 Consumer-safety control: run one non-mcp-tooling skill's Mode A benchmark with the gate off; verdict unchanged vs its frozen baseline

### WS3 transport trust metadata, F006-F007 [depends: T001; parallel to WS1/WS2]

- [ ] T030 [P] Define mutation classes distinguishing external-document mutation, local export writes, and direct editing; fix the Figma toolSurface declaration (.opencode/skills/mcp-tooling/mode-registry.json)
- [ ] T031 [P] Make the sk-design pairing precondition explicit for every design-affecting Figma authoring path, consistent with hub ADR-002 (.opencode/skills/mcp-tooling/mcp-figma/SKILL.md)

### WS4 six-mode traceability, F009-F011 [depends: T001; T040 also depends T010-T014]

- [ ] T040 Regenerate hub graph projections (derived intent signals, narrative edges, causal summary) from the six-mode inventory (.opencode/skills/mcp-tooling/graph-metadata.json)
- [ ] T041 [P] Amend phase-007 acceptance docs from three-mode framing to the six-mode corpus and real evidence paths (007-mcp-tooling-parent/007-routing-benchmark-and-review/spec.md, plan.md, tasks.md)
- [ ] T042 [P] Regenerate the hub playbook index to list six modes and 13 scenarios with working links (.opencode/skills/mcp-tooling/manual_testing_playbook/manual_testing_playbook.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [plan Phase 5: terminal bounded re-review; depends: all above]

- [ ] T050 Re-run the SAME review scope and dimensions via the deep-review loop; expect PASS with zero active P0/P1 (review artifacts in this packet)
- [ ] T051 Re-run core traceability protocols (spec_code, checklist_evidence) and the playbook_capability overlay; expect clean
- [ ] T052 Regression delta vs T003/T004 baselines: package/hub gates, ratchet, advisor probes all green; record evidence in checklist.md
<!-- /ANCHOR:phase-3 -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] Gate 3 spec folder confirmed (`mcp-tooling/011-routing-remediation`); scope limited to surfaces named in spec.md
- [ ] ADR-001 ruling present in decision-record.md before touching hub-router.json or resource gold
- [ ] Read every target file before editing; verify line references against current content

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Respect the dependency notes in each heading; T001/T002 gate everything downstream |
| TASK-SCOPE | Only the surfaces listed in the task's file path; no adjacent cleanup |
| TASK-EVIDENCE | Each completed task records command output or file:line evidence in checklist.md |
| TASK-FROZEN | Never write into `benchmark/baseline/`; new benchmark output goes to a new run-label folder |

### Status Reporting Format

Report per task: `T### status (pending/active/done/blocked) - evidence pointer - blocker if any`.

### Blocked Task Protocol

On a blocked task: mark `[B]`, record the blocker in checklist.md and the continuity frontmatter, halt dependent tasks, and escalate with the conflicting facts and the decision needed (Logic-Sync when spec conflicts with evidence). Never substitute a manual workaround for a plan-named workflow.

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] SC-001 to SC-004 evidenced (re-review PASS, enforced benchmark re-run, gates green, protocols clean)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md` (ADR-001 gate)
- **Research**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->
