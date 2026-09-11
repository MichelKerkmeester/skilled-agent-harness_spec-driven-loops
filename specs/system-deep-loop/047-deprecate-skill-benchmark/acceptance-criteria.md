---
title: "Acceptance Criteria: Deprecate the deep-skill-benchmark lane"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-deep-loop/047-deprecate-skill-benchmark"
    last_updated_at: "2026-09-11T17:07:52Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Deprecate the deep-skill-benchmark lane

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-deep-loop/047-deprecate-skill-benchmark
**Level:** 3
**Status:** Complete
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the five runtime command trees, When the repository is scanned for tracked lane command files, Then none is found | `.opencode/commands/README.txt:174` lists the surviving deep commands with no lane row, and a tracked-file scan returns 0 entries across the five runtime command trees | Met | - |
| AC-002 | REQ-002 | Given the hub registry and router pair, When `parent-skill-check.cjs` runs against `system-deep-loop`, Then every hard invariant passes and the mode counts read 5 | `.opencode/skills/system-deep-loop/hub-router.json:7` and `.opencode/skills/system-deep-loop/SKILL.md:27` carry five modes; `parent-skill-check.cjs` on the hub prints all hard invariants passed, with checks 5b, 6b and 10d reading 5 | Met | - |
| AC-003 | REQ-003 | Given the deleted ledger, reducer and sealed-artifact libraries, When runtime `lib/`, `scripts/` and `tests/` are scanned for imports of them, Then no source file references them | `.opencode/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:147` ends the adapter switch at model-benchmark, and a scan of runtime `lib/`, `scripts/` and `tests/` returns 0 hits for the three deleted libraries | Met | - |
| AC-004 | REQ-004 | Given the historical benchmark reports owned by other skills, When the tracked file count under `benchmark/reports/` is compared before and after, Then it is unchanged at 554 | `.opencode/skills/cli-external-orchestration/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.md:1` is untouched, and the tracked count under `*/benchmark/reports/` is 554 before and after | Met | - |
| AC-005 | REQ-005 | Given the shared improvement host, When a model-benchmark run is planned, Then it still returns the materialize-then-run two-step plan and the valid mode set is exactly the two survivors | `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:40` declares exactly the two survivors, and a `node -e` smoke test returns the model-benchmark materialize-then-run plan | Met | - |
| AC-006 | REQ-006 | Given the hub and packet documentation, When each edited document is scanned for the lane name, Then no reference and no link to a deleted file remains | `.opencode/skills/system-deep-loop/ROUTER.md:23` and `.opencode/skills/system-deep-loop/SKILL.md:27` read two improvement lanes, and a per-file scan of the edited documentation set returns no hit | Met | - |
| AC-007 | REQ-007 | Given the advisor command-bridge projection, When `derive-command-bridges.cjs` is run after the metadata edit, Then it rewrites all three projection files and the advisor tree holds no lane reference | `.opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges/derive-command-bridges.cjs:15` owns the output; the generator reported three changed paths, the advisor tree holds no lane hit, and `py_compile` passes on the scorer | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

AC-002 and AC-003 carried the packet: the hub gate proves the mode is unregistered on every surface it checks, and the import scan proves the deletion left no broken edge. Consciously left out: the dead `'skill-benchmark'` string constant in shared improvement type unions, the `sk-create-benchmark` authoring mode in another hub, and the 554 historical report files, each recorded as an open question for the operator rather than removed on this packet's authority.
<!-- /ANCHOR:closure -->
