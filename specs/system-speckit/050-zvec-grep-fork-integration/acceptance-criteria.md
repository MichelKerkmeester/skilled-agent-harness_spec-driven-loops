---
title: "Acceptance Criteria: zvec-grep fork integration"
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
    packet_pointer: "system-speckit/050-zvec-grep-fork-integration"
    last_updated_at: "2026-09-04T10:59:05Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-04-050-zvec-grep-fork-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: zvec-grep fork integration

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/050-zvec-grep-fork-integration
**Level:** 2
**Status:** In Progress
**Date:** 2026-09-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the fork built on `feat/ollama-backend` and Ollama running, When `ZVEC_GREP_EMBEDDING=ollama/nomic-embed-text` is set and `zg index` runs, Then the index is built with vectors of the dimension `/api/show` reports | fork unit suite plus live smoke script output | Unmet | - |
| AC-002 | REQ-002 | Given `feat/direct-stdio-mcp` built and nothing listening on 7999, When a JSON-RPC `tools/call` for `zvec_grep_search` is written to `zg server --stdio --mode direct`, Then hits return and no daemon process exists afterwards | e2e stdio script output and process listing | Unmet | - |
| AC-003 | REQ-003 | Given the baseline index, When `zvec-lane.mjs search` runs with a query that hits, a query that misses, and a missing binary, Then exit codes are 0, 1 and 2 and stdout on 0 is rank-tuple JSON with the ripgrep lane's fields | `scripts/tests/zvec-lane.vitest.ts` | Unmet | - |
| AC-004 | REQ-004 | Given `ZVEC_GREP_MODE=server` in the caller's environment, When any wrapper subcommand runs, Then the child receives `ZVEC_GREP_MODE=direct` and no port opens | vitest env assertion plus `lsof -i :7999` empty | Unmet | - |
| AC-005 | REQ-005 | Given the doctor `zvec` route, When it runs with and without Ollama reachable, Then binary, index, embedder and Ollama lines each report independently | doctor routes validator plus a captured run | Unmet | - |
| AC-006 | REQ-006 | Given the retrieval conventions, When a reader looks for which lane to use, Then one section names all three lanes and the selection rule | `references/retrieval/retrieval-conventions.md` section present | Unmet | - |
| AC-007 | REQ-007 | Given the corpus, When the baseline index is built and five concept queries run, Then `scratch/baseline-queries.md` records each query with its top hits and timing | file present with five entries | Unmet | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
