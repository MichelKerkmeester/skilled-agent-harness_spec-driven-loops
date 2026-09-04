---
title: "Acceptance Criteria: Chart Command Surface"
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
    packet_pointer: "specs/sk-doc/055-chart-command-surface"
    last_updated_at: "2026-09-04T09:05:00Z"
    last_updated_by: "implementation"
    recent_action: "Verified every criterion from the final state and recorded the observed result"
    next_safe_action: "Review the two adjacent defects recorded in spec.md section 10"
    blockers: []
    key_files:
      - ".opencode/commands/create/chart.md"
      - ".opencode/skills/sk-doc/mode-registry.json"
      - ".opencode/skills/sk-doc/SKILL.md"
      - ".opencode/skills/sk-doc/command-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Chart Command Surface

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/055-chart-command-surface
**Level:** 2
**Status:** Complete
**Date:** 2026-09-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Every command below was run from the repository root, from the final state, with its output and exit status read.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the new router, When it is validated as a command document, Then it passes with no issues | `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/commands/create/chart.md --type command`. Expected `VALID`, `Total issues: 0`, exit 0. Observed exactly that. The sibling `/create:diagram` router reports 3 warnings on the same check | Met | - |
| AC-002 | REQ-001 | Given the create-command family contract, When the router-generator drift gate runs, Then the new router is clean | `node .opencode/skills/system-spec-kit/scripts/codex/generate-command-routers.cjs --check`. Expected the new router absent from the drift list. Observed `routers=31 clean=30`, the single drift being the pre-existing `memory/learn.md`, which was also the single drift at `routers=30 clean=29` before the change | Met | - |
| AC-003 | REQ-002 | Given the registry declares `/create:chart` for `sk-create-chart`, When the hub gate runs, Then the mode table shows that exact command | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-doc`. Expected `PASS: 6c` and exit 0. Observed `PASS: 6c: every mode-table row whose registry entry declares a command shows that exact command`, plus `OK: parent-skill-check — all hard invariants passed, 0 warnings` | Met | - |
| AC-004 | REQ-003 | Given the canonical router, When the mirror gates run, Then every runtime tree resolves it | `node .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs --check` expected `PASS`, observed `PASS: 173 mirrors across 8 trees are in sync` against a baseline of 171. `node .opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs --check` expected `PASS`, observed `PASS: 37 prompts are in sync` against a baseline of 36 | Met | - |
| AC-005 | REQ-004 | Given the hub `SKILL.md` was edited, When a chart request is resolved through compiled routing, Then a real route is served rather than the legacy sentinel | `node .opencode/bin/compiled-route.cjs --hub sk-doc --prompt "I need a treemap showing where the budget went"`. Expected an `action: route` decision naming `sk-create-chart`. Before the change this printed `{"servingAuthority":"legacy","hubId":"sk-doc"}`. Observed after: `"action":"route"` with one target, `workflowMode: sk-create-chart`, generation 5 | Met | - |
| AC-006 | REQ-004 | Given both manifest copies were refreshed, When the fleet guard runs, Then every hub is fresh | `node .opencode/bin/compiled-route-guard.cjs`. Expected exit 0 and five `fresh` rows. Before the change: exit 1, `sk-doc stale-manifest`, `Re-mint: sk-doc`. Observed after: exit 0, all five hubs `fresh` | Met | - |
| AC-007 | REQ-004 | Given the promoted closure, When the move simulation runs, Then every hub still resolves | `node .opencode/bin/compiled-route-sync.cjs --verify`. Expected exit 0. Before the change: exit 1, `promoted closure failed to resolve hubs: sk-doc`. Observed after: exit 0, `move-simulation OK: all 5 hubs resolve; 0 reads under .opencode/specs` | Met | - |
| AC-008 | REQ-005 | Given rebuilt artifacts and re-pinned digests, When the canary validates, Then it reports REAL-GREEN | `node harness/build-artifacts.cjs` then `node harness/validate-canary.cjs` from `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/007-sk-doc`. Expected `"status":"REAL-GREEN"` and exit 0. Before the change: exit 1, `CANARY_RED` on a stale `sk-create-chart/SKILL.md` digest. Observed after: exit 0, `REAL-GREEN`, 23 real-green route-gold rows including `single-create-chart` | Met | - |
| AC-009 | REQ-006 | Given the new command metadata entry, When the bridge derivation is checked, Then the projection is fresh and carries the command | `node .opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges/derive-command-bridges.cjs --check`. Expected `"status": "fresh"` with an empty `changed` list. Observed `fresh`, `commandMetadata: 20` against a baseline of 19, `generated: 28` against 27, `changed: []` | Met | - |
| AC-010 | REQ-007 | Given two suites carry a declaration census, When they run, Then both pass at the new count | `npx vitest run tests/command-metadata-e2e.vitest.ts tests/command-binding-existence.vitest.ts tests/command-bridges-drift-guard.vitest.ts` from the advisor `mcp-server`, expected 9 passed, observed 9 passed at census 20. `python3 -m unittest discover .opencode/commands/create/assets/tests`, expected 13 passed, observed `Ran 13 tests ... OK` at 28 root YAML assets | Met | - |
| AC-011 | REQ-008 | Given the catalog holds twenty-one forms, When the hub mode table and the hub README are read, Then both state twenty-one | `grep -n "21 forms" .opencode/skills/sk-doc/SKILL.md` and `grep -n "twenty-one forms" .opencode/skills/sk-doc/README.md`. Expected one hit each. Observed one hit each, and `grep -rn "catalog of 20" .opencode/skills/sk-doc/` returns nothing outside historical changelog entries | Met | - |
| AC-012 | SC-003 | Given the chart packet was not to be touched, When the corpus check runs, Then it passes and the packet shows no working-tree change | `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render`. Expected `RESULT: PASSED`, errors 0, exit 0. Observed exactly that, and `git status --porcelain .opencode/skills/sk-doc/sk-create-chart/` returns nothing. One earlier run of this command failed with 2 `settled-render` errors while another heavy job held the machine, and reproduced clean when run alone | Met | - |

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

AC-005 through AC-008 carried the packet, because they are the four that were red before the change and are the ones a green build would otherwise have hidden. What was consciously left out is the `@markdown` agent roster and the two command catalogs under `.opencode/commands/`, all three of which were already missing two or three sibling commands before this packet and would need unrelated rows to be made whole. Both are recorded as open questions in `spec.md` section 10.
<!-- /ANCHOR:closure -->
