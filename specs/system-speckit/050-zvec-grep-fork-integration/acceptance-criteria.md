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
    recent_action: "Closed all seven criteria"
    next_safe_action: "Open the hook packet from goal.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-04-050-zvec-grep-fork-integration"
      parent_session_id: null
    completion_pct: 100
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
**Status:** Complete
**Date:** 2026-09-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the fork built on `feat/ollama-backend` and Ollama running, When `ZVEC_GREP_EMBEDDING=ollama/nomic-embed-text` is set and `zg index` runs, Then the index is built with vectors of the dimension `/api/show` reports | fork `6ac153b`: 113 unit tests, live smoke 768-dim vectors; baseline index built with provider `ollama`, dimension 768 | Met | - |
| AC-002 | REQ-002 | Given `feat/direct-stdio-mcp` built and nothing listening on 7999, When a JSON-RPC `tools/call` for `zvec_grep_search` is written to `zg server --stdio --mode direct`, Then hits return and no daemon process exists afterwards | fork `8f0f023`: 7 e2e tests, JSON-RPC over stdio returns hits, port asserted closed before, during and after, `pgrep` 0 daemons | Met | - |
| AC-003 | REQ-003 | Given the baseline index, When `zvec-lane.mjs search` runs with a query that hits, a query that misses, and a missing binary, Then exit codes are 0, 1 and 2 and stdout on 0 is rank-tuple JSON with the ripgrep lane's fields | `scripts/tests/zvec-lane.vitest.ts` 35 passed; five live queries exit 0 with rank-tuple JSON | Met | - |
| AC-004 | REQ-004 | Given `ZVEC_GREP_MODE=server` in the caller's environment, When any wrapper subcommand runs, Then the child receives `ZVEC_GREP_MODE=direct` and no port opens | `zvec-lane.vitest.ts` asserts `ZVEC_GREP_MODE=direct` in the child env under a caller `server` env; `pgrep` 0 zg processes after the five queries | Met | - |
| AC-005 | REQ-005 | Given the doctor `zvec` route, When it runs with and without Ollama reachable, Then binary, index, embedder and Ollama lines each report independently | `zvec-lane.mjs status --json` live: `ollama.reachable=true`, 7 models, index state on its own line; with `ZVEC_GREP_OLLAMA_URL=http://127.0.0.1:1`: `reachable=false` with the connection error named, index state unchanged; `route-validate.sh` 10 routes | Met | - |
| AC-006 | REQ-006 | Given the retrieval conventions, When a reader looks for which lane to use, Then one section names all three lanes and the selection rule | `retrieval-conventions.md` §9 names the three lanes and the selection rule | Met | - |
| AC-007 | REQ-007 | Given the corpus, When the baseline index is built and five concept queries run, Then `scratch/baseline-queries.md` records each query with its top hits and timing | `scratch/baseline-queries.md`: 24,304 files indexed, five queries with top three hits, scores and timing | Met | - |

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

The fork branches and the lane carried the packet: every row is met by an observed run, test or artifact. Consciously left out: vendoring the fork into `.opencode` and the prompt-time hook, which `goal.md` hands to the next packet.
<!-- /ANCHOR:closure -->
