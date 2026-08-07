---
title: "Tasks: Phase 4: scoping-and-discovery"
description: "Tasks for building the alignment scoping decision tree, lane resolution, non-interactive arg form, and the discover(scope)->artifacts contract -- Phase 1/2 complete, Phase 3 verification complete except the one item structurally deferred to phase 005+."
trigger_phrases:
  - "deep-alignment scoping tasks"
  - "alignment discovery tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/004-scoping-and-discovery"
    last_updated_at: "2026-07-11T14:19:08Z"
    last_updated_by: "claude"
    recent_action: "Independently re-confirmed T001-T009; advanced T010 partially via a live phase-005 check"
    next_safe_action: "Verify phase 005's complete claim, then begin phase 006"
    blockers:
      - "T010: only phase 005 of the four adapter phases (005-007, 010) exists so far -- the full N-of-N diff discover_contract.md section 6 describes needs all of them; a partial check against 005 alone already passed (see T010 evidence below)"
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/references/scoping_protocol.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/discover_contract.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/lane_config_schema.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-scoping-and-discovery"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "T008/T009 verified with real evidence, not just design assertion -- see task detail below"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: scoping-and-discovery

<!-- SPECKIT_LEVEL: 2 -->

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read 003-scaffold-mode-packet's plan.md for the directory-skeleton shape. Evidence: confirmed `deep-alignment/{assets,references,changelog,behavior_benchmark}` all present on disk before adding this phase's files, matching `003-scaffold-mode-packet/plan.md` §3, `` [File: plan.md] ``.
- [x] T002 [P] Re-read the locked pluggable adapter contract from 002-architecture-decision. Evidence: `002-architecture-decision/decision-record.md` ADR-003 (all 12 ADRs Accepted, operator-approved 2026-07-11) — signature `discover(scope) -> artifacts` restated verbatim in `references/discover_contract.md` §2, `` [File: references/discover_contract.md] ``.
- [x] T003 [P] Read `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` for the coverage-graph seeding shape. Evidence: exact node-construction line spans (`upsert.cjs:204-238`, `coverage-graph-db.ts:19-93`) cited in `references/discover_contract.md` §4.2, `` [File: references/discover_contract.md] ``.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author `deep-alignment/references/scoping_protocol.md` with the three-axis decision tree and lane-resolution algorithm. Evidence: file created, 9 sections, `` [File: references/scoping_protocol.md] ``.
- [x] T005 Author `deep-alignment/references/discover_contract.md` with the authority-agnostic `discover(scope)->artifacts` signature. Evidence: file created, 7 sections including the real `upsert.cjs` seeding call shape, `` [File: references/discover_contract.md] ``.
- [x] T006 Implement the interactive lane-resolution script. Evidence: `resolveLanesFromSelections()` exported from `scripts/scoping.cjs`, `` [File: scripts/scoping.cjs] ``.
- [x] T007 Design the `--lane-config <file.json>` JSON schema (per ADR-011's LOCKED config-file-only decision) and implement the non-interactive parser. Evidence: schema documented in `references/lane_config_schema.md` (bare top-level array, informative JSON Schema in §6); parser implemented as `resolveLanesFromConfig()`/`parseLaneConfigFile()` in `` [File: scripts/scoping.cjs] ``.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirm a multi-authority single-run scoping session resolves N independent lanes. Evidence: a real `--lane-config` run against a 3-lane fixture (`sk-code`/`code`, `sk-git`/`git-history`, `sk-design`/`designs`) resolved exactly 3 independent lanes with `node scripts/scoping.cjs --lane-config <fixture> --json`, `` [File: scripts/scoping.cjs] ``.
- [x] T009 Confirm the non-interactive arg parser and the interactive question produce identical lane tuples for an equivalent scope. Evidence: `JSON.stringify(resolveLanesFromSelections(selections)) === JSON.stringify(resolveLanesFromConfig(config))` evaluated `true` for an equivalent 3-lane input in a direct `node -e` module comparison, `` [File: scripts/scoping.cjs] ``.
- [ ] T010 [B] Confirm the `discover()` contract carries no authority-specific parameters. **Partially advanced by independent re-verification**: phase 005 (sk-doc adapter) now exists and self-reports complete; a live cross-phase test in this review pass confirmed `scripts/adapters/sk-doc.cjs`'s `discover(scope)` takes exactly one parameter and produces the documented `{artifacts, nodes}` shape when fed a real `resolveLanesFromConfig()`-resolved lane. Still `[B]`: `references/discover_contract.md` §6's own wording asks for the diff across "phase 005 through phase 010 alike," and 006/007/010 do not exist yet, `` [File: references/discover_contract.md] ``.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` — Not met: T010 stays open, structurally blocked on future phases (see above). All other 9 tasks are `[x]` with evidence.
- [ ] No `[B]` blocked tasks remaining — Not met: T010 is `[B]`, expected and documented, not a stalled item within this phase's own control.
- [x] Manual verification passed — CLI and module-level checks both passed; see `implementation-summary.md` Verification for the full evidence list.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
