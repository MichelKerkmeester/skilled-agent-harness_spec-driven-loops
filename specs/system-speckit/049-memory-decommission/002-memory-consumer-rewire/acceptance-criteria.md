---
title: "Acceptance Criteria: Phase 2: memory-consumer-rewire"
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
    packet_pointer: "scaffold/002-memory-consumer-rewire"
    last_updated_at: "2026-09-02T11:04:52Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-049-memory-decommission"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: memory-consumer-rewire

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 049-memory-decommission/002-memory-consumer-rewire
**Level:** 3
**Status:** Draft
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002 | Given the rewire is finished, When the residue sweep runs with `--json --ignore-case --no-ignore-global` and the four exclusions `.git`, `node_modules`, `z_archive` and the mcp-server tree, Then it returns zero live rows | The exact recipe in `plan.md` §5, run from the final state, JSON events parsed rather than split on colons, output and exit status read | Unmet | - |
| AC-002 | REQ-005 | Given every runtime agent and command directory, When their `allowed-tools` frontmatter is scanned, Then no removed tool name appears in any of them | Grant scan across `.opencode/agents`, `.claude/agents`, `.codex/agents`, `.pi/agents` and `.opencode/commands` returns zero | Unmet | - |
| AC-003 | REQ-003 | Given the memory daemon is stopped, When a session opens and Gate 1 runs, Then it resolves through the trigger index with no degraded-mode notice and inside the 200ms budget | One recorded daemon-off session transcript plus a fresh-process timing sample | Unmet | - |
| AC-004 | REQ-004 | Given the memory daemon is stopped, When a continuity update runs, Then the named packet-local writer updates `_memory.continuity` atomically in the same directory and releases its lock | The writer is named in `decision-record.md` and exercised once daemon-off, with the resulting frontmatter read | Unmet | - |
| AC-005 | REQ-008 | Given the shared embedding, HF-local, IPC and launcher branches are split, When `system-skill-advisor` runs in a fresh process with the memory daemon stopped, Then it resolves its embedder and returns an embedder-backed result | Fresh-process advisor query, output and exit status read. This also gates phase 003 | Unmet | - |
| AC-006 | REQ-008, REQ-009 | Given the five break-risk seams S-001 through S-005, When the packet is reviewed for closure, Then each seam carries either a named replacement or an explicit retain decision | Five decisions in `decision-record.md`, one per seam, each citing the seam's `file:line` anchor from `spec.md` §6 | Unmet | - |
| AC-007 | REQ-014 | Given the ~167 logical-owner estimate and the 9,016 live inventory paths this phase owns, When closure is claimed, Then every owner is marked rewired, deleted, retained or historical and the two counts are stated against each other | The owner ledger, with no unresolved row and a stated total | Unmet | - |
| AC-008 | REQ-007 | Given semantic paraphrase, vector and BM25 fusion, decay, access tracking, session dedup and causal traversal, When the replacement is documented, Then each one has a named replacement or an explicit unsupported declaration with a defined no-hit behavior | The loss declaration in `spec.md` or `decision-record.md`, one entry per capability | Unmet | - |
| AC-009 | REQ-006 | Given any rewired consumer, When an operator follows its retrieval instruction by hand, Then the instruction runs from `retrieval-conventions.md` without a daemon and returns the same evidence the agent saw | One hand-run per command family, recorded | Unmet | - |
| AC-010 | REQ-010 | Given the agent families across four runtime roots, the `/memory:*` and `/doctor` memory routes and the deep-loop YAML grants, When each is exercised, Then it resolves through the trigger index, a ripgrep recipe, lineage-local state or the approved file-local successor | Per-area sweep returns zero live rows, and each route carries a rewire or a recorded phase-003 deletion decision | Unmet | - |
| AC-011 | REQ-011 | Given the generated-artifact producers, When one artifact of each kind is regenerated after the update, Then the fresh output names no removed tool | A regeneration run per template, install script and create-command asset, then swept | Unmet | - |
| AC-012 | REQ-012, REQ-013 | Given the deep-loop reducer suites, When they run after the rewrite, Then persistence is lineage-local, the locks, projections and ledger state are unchanged and no old assertion was deleted before its replacement existed | Deep-loop unit suites pass, diff review shows untouched lock and projection code, commit order shows replacement before deletion | Unmet | - |

Source inventory for the counts and seam citations above:
specs/system-speckit/049-memory-decommission/006-legacy-memory-surface-inventory/research/lineages/luna-max/research.md

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

**Closeable:** No

All twelve criteria are `Unmet`, so nothing has carried the packet yet. Complete this statement at
closure, naming which criteria carried it and what was consciously left out.
<!-- /ANCHOR:closure -->
