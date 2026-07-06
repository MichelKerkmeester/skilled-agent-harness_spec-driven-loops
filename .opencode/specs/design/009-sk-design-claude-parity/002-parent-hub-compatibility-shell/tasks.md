---
title: "Tasks: Phase 002 — Parent Hub Compatibility Shell"
description: "Completed Level 2 task list for implementing the sk-design parent hub manager shell while preserving advisor identity and registry routing."
trigger_phrases:
  - "tasks"
  - "parent hub compatibility shell"
  - "sk-design manager shell"
  - "mode registry"
importance_tier: "high"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/design/009-sk-design-claude-parity/002-parent-hub-compatibility-shell/"
    last_updated_at: "2026-07-05T22:14:30Z"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Closed all Phase 002 tasks."
    next_safe_action: "Start Phase 003 procedure cards."
---
# Tasks: Phase 002 — Parent Hub Compatibility Shell

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| unchecked marker | Open task marker; none remain in executable task rows |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path or evidence target) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Entry Gate and Current Hub Review

- [x] T001 Verify Phase 001 strict validation, ownership closure, baseline evidence, and go/no-go state (Phase 001 evidence) [15m]
  - Evidence: Phase 001 checklist records 9/9 P0, 12/12 P1, 1/1 P2 verified and gate status closed; Phase 001 implementation summary names Phase 002 as next safe action.
- [x] T002 Read current `sk-design` parent hub before editing (`.opencode/skills/sk-design/SKILL.md`) [10m]
  - Evidence: read `.opencode/skills/sk-design/SKILL.md` before patching section 2 and section 7 wording.
- [x] T003 Read current mode registry before editing (`.opencode/skills/sk-design/mode-registry.json`) [10m]
  - Evidence: read `mode-registry.json`; it lists the five expected modes and the four read-only advisory mode tool surfaces.
- [x] T004 Record any logic-sync conflict between Phase 002 plan and current hub/registry shape (`implementation-summary.md`) [10m]
  - Evidence: no logic-sync conflict found; live hub/registry matched the task grounding facts.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Compatibility Shell Contract

### Manager Behavior
- [x] T005 Define context-first intake fields for goals, constraints, artifacts, design references, and verification expectations (hub shell contract) [20m]
  - Evidence: `SKILL.md` section 2 `Manager Intake Before Routing` lists goal, surface, inputs, constraints, and proof expectations.
- [x] T006 Define visible plan behavior before design/build/transport execution (hub shell contract) [20m]
  - Evidence: `SKILL.md` section 2 `Visible Plan Before Design or Build Work` requires selected mode/bundle, context, design moves or audit dimensions, proof, and handoff target.
- [x] T007 [P] Define proof gate fields for taste, accessibility, responsive behavior, and requested transport checks (hub shell contract) [20m]
  - Evidence: `SKILL.md` section 2 `Proof Gates and Verifier Cadence` names taste, accessibility, responsive, and transport proof.
- [x] T008 [P] Define verifier cadence and blocking outcomes (hub shell contract) [20m]
  - Evidence: `SKILL.md` section 2 requires intake before routing, visible plan before substantial output, proof review before ready claims, and pauses ready claims when proof is missing or transport-only.

### Boundaries
- [x] T009 Document transport-vs-taste separation in the parent shell (hub shell contract) [15m]
  - Evidence: `SKILL.md` section 7 states `mcp-figma` and `mcp-open-design` are transports and their output is evidence to inspect, not acceptance.
- [x] T010 Document negative rules against public skill mirroring and registry bypass (hub shell contract) [15m]
  - Evidence: `SKILL.md` section 4 NEVER rules prohibit packet graph metadata, public micro-skill identities, registry bypass, and Write/Edit/Bash requirements for read-only modes.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Registry Preservation

### Public Routing
- [x] T011 Confirm the shell keeps one public `sk-design` advisor identity (route evidence) [10m]
  - Evidence: `Glob("**/graph-metadata.json", .opencode/skills/sk-design)` returned only `.opencode/skills/sk-design/graph-metadata.json`.
- [x] T012 Confirm the shell keeps existing five public modes and registry keys (registry evidence) [15m]
  - Evidence: `mode-registry.json` lists `interface`, `foundations`, `motion`, `audit`, and `md-generator`; no registry/router diff exists.
- [x] T013 Confirm no 14 public skill mirror or public micro-skill identities are added (file inventory) [10m]
  - Evidence: no new mode packet graph metadata exists and no new public mode was added.

### Integration
- [x] T014 Map manager-shell behavior to existing mode packet responsibilities without adding public routes (`plan.md` or shell notes) [20m]
  - Evidence: `SKILL.md` says selected modes supply detailed evidence contracts and per-mode design logic remains in packets.
- [x] T015 Record Phase 003 handoff for private procedure-card detail (`implementation-summary.md`) [10m]
  - Evidence: `implementation-summary.md` lists Phase 003 as the next safe action for private procedure-card detail.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification and Handoff

### Verification
- [x] T016 Run strict spec validation for this phase folder (validation evidence) [5m]
  - Evidence: `implementation-summary.md` records the final `validate.sh --strict` command and exit code after metadata regeneration.
- [x] T017 Run or record canonical router/registry preservation check after implementation (route evidence) [15m]
  - Evidence: benchmark command generated `/tmp/skd-bench/report.json` with verdict `CONDITIONAL`, aggregate `69`, D5 `100`, and gate failed `false`.
- [x] T018 Review negative controls for public identity, registry authority, and transport boundary (`checklist.md`) [15m]
  - Evidence: checklist rows CHK-010, CHK-011, CHK-021, CHK-030, and CHK-031 are checked with file/command evidence.
- [x] T019 Update checklist P0/P1 rows with evidence or approved deferral (`checklist.md`) [15m]
  - Evidence: checklist summary records all P0 and P1 items verified; no P0/P1 deferrals remain.

### Documentation
- [x] T020 Ensure docs do not claim implementation completion while Phase 001 or shell implementation remains unresolved (`implementation-summary.md`) [5m]
  - Evidence: Phase 001 is closed and the hub shell implementation is complete; docs now claim completion only with concrete evidence.
- [x] T021 Record rollback path and stop triggers (`plan.md`) [5m]
  - Evidence: `plan.md` rollback section requires diff/status inspection first and explicit approval before destructive recovery.
- [x] T022 Record handoff criteria for Phase 003 private procedure-card layer (`implementation-summary.md`) [10m]
  - Evidence: `implementation-summary.md` defers private procedure-card detail to Phase 003 and prohibits registry/public identity changes.

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Phase 001 P0 gates are verified with evidence before implementation begins. Evidence: Phase 001 checklist summary records closed gate status.
- [x] Parent hub shell contract exists in the approved implementation location. Evidence: `.opencode/skills/sk-design/SKILL.md` contains the shell sections.
- [x] Single public `sk-design` identity and existing mode registry are preserved. Evidence: graph metadata glob returned only the root file and registry/router diff returned no output.
- [x] Context-first intake, visible plan, proof gates, and verifier cadence are present. Evidence: `SKILL.md` section 2 contains those headings and rules.
- [x] Transport-vs-taste separation is explicit. Evidence: `SKILL.md` section 7 states transports are evidence/mechanics, not acceptance.
- [x] Negative controls prove no public 14-skill mirror was added. Evidence: no mode-packet graph metadata and no new public mode were added.
- [x] Checklist.md reflects current evidence state. Evidence: checklist summary records 13/13 P0, 10/10 P1, and 1/1 P2 verified.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Predecessor Gate**: See `../001-baseline-ownership-gate/`

<!-- /ANCHOR:cross-refs -->
