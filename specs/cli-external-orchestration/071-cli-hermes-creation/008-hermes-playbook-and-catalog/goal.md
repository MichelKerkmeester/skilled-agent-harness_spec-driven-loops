---
title: "Goal: Hermes playbook and feature catalog"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/008-hermes-playbook-and-catalog"
    last_updated_at: "2026-09-14T19:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Second pass 22 of 22; catalog validated"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-008-hermes-playbook-and-catalog"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Hermes playbook and feature catalog

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The `cli-hermes` packet carries a manual-testing playbook and a feature catalog at
the same depth as `cli-pi`'s, and the playbook scenarios have been executed at least once.

### Decisions

Frozen choices for this phase. The parent goal's decisions bind here too; changing one of those is
an amendment to the packet root `goal.md`.

| ID | Decision |
|----|----------|
| P1 | The playbook is authored with `sk-create-manual-testing-playbook` and mirrors the sibling category set, including the universal `stress/` scenarios and Hermes-specific ones for trust, flattening, `--yolo`, budget expiry and the plugin |
| P2 | The catalog is authored with `sk-create-feature-catalog` and names the test anchors from phases 003 and 006 |
| P3 | This phase is optional: it may be folded into phase 009 if the operator prefers one closeout |

### Completion criteria

1. Playbook root plus scenario files exist and the scenario count is proportional to `cli-pi`'s.
2. At least half the scenarios were executed with recorded evidence under `benchmark/reports/`.
3. The catalog validates with the hub's feature-catalog checker.

### Operator copy

The operator holds the parent directive as the session objective. A change here that alters a
parent decision or criterion is an amendment to the parent: apply it there and resend that file.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

| Surface | Bound to |
|---------|----------|
| Phase spec | `spec.md` |
| Closure gate | `acceptance-criteria.md` |

The parent directive in the packet root `goal.md` binds above this file. Evidence:
`../001-deep-research/research/research.md` section 4 row R7.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Playbook root and scenarios exist at sibling depth
- [x] At least half the scenarios executed with evidence
- [x] Catalog validates
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Playbook | Done | 36 scenarios, 11 categories; validator PASS; stress bijection PASS |
| Executed | Done | first pass 17 of 19 (two failures became fixes); second pass 22 of 22 on the corrected contract |
| Catalog | Done | cli-hermes `PASS: 0 violations`; hub counts seven packets |

### Deviations and findings

| Item | Note |
|------|------|
| First-pass failures fed back | The read-only toolset had no file tools and the git advisory never reached a session; fixed in phases 003 and 006, re-verified live here. |
| `-t search,todo` failure is intermittent | Zero bytes once, a fragment another time; the empty-stdout scenario gates on content. |
<!-- /ANCHOR:log -->
