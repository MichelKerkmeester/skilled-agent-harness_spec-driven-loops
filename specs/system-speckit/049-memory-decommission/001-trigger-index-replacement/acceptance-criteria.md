---
title: "Acceptance Criteria: Phase 1: trigger-index-replacement"
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
    packet_pointer: "system-speckit/049-memory-decommission/001-trigger-index-replacement"
    last_updated_at: "2026-09-02T11:04:50Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs"
      - ".opencode/skills/system-spec-kit/data/trigger-index.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: trigger-index-replacement

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/049-memory-decommission/001-trigger-index-replacement
**Level:** 3
**Status:** Draft
**Date:** 2026-09-02
**Research:** `../005-ripgrep-retrieval-research/research/lineages/luna-max/research.md`
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-008, REQ-009 | Given the frozen prompt set and the frozen corpus manifest, When each lexical prompt is resolved through the live `exactTriggerSearch` lane, `trigger-index.json` and the documented `rg` recipes, Then the candidate sets agree in both directions with zero unexplained `legacyOnly` and zero unexplained `indexOnly` rows, no scope, archive or expiry leakage. Semantic paraphrase rows are reported separately as boundary probes | `node scripts/retrieval/parity-check.mjs` reports both difference directions empty of unexplained rows and names the manifest and prompt-set hashes. Report committed at `fixtures/parity-baseline.json`, with the boundary probes in their own section | Unmet | - |
| AC-002 | REQ-002, REQ-011 | Given a generated `trigger-index.json`, When the generator is run a second time over the same manifest, Then the artifact is byte-identical with a matching SHA-256. No run leaves a partial or replaced artifact behind | `node generate-trigger-index.mjs && git diff --exit-code .opencode/skills/system-spec-kit/data/trigger-index.json` exits 0. Both runs hash identically under `shasum -a 256`. A forced-failure run is observed leaving the last known-good artifact untouched with no temporary file left in the tree | Unmet | - |
| AC-003 | REQ-003 | Given a fresh clone with no build step and no running daemon, When Gate 1 resolves a prompt, Then the index is present and readable from the working tree | `git ls-files` lists the artifact. Lookup succeeds in a clean checkout | Unmet | - |
| AC-004 | REQ-004 | Given no daemon, no database and no network, When the generator runs, Then it completes successfully | generation run with the MCP server stopped and network access removed. The exact commands are recorded and their exit statuses are read, exit 0 required | Unmet | - |
| AC-005 | REQ-005, REQ-013 | Given `retrieval-conventions.md`, When a reader looks up the replacement for `memory_search`, `memory_context` or `memory_quick_search`, Then each has a concrete ripgrep invocation that can be pasted and run. The doc states that ripgrep produces evidence rather than ranking relevance | doc inspection, then each invocation executed once with no daemon and no network. Command text, observed output and exit status are recorded against the 0 match, 1 no match, 2+ error mapping | Unmet | - |
| AC-006 | REQ-006, REQ-010 | Given documents whose `trigger_phrases` block is missing, malformed, non-YAML, wrongly typed, validly empty, alias-spelled, generic, duplicated or oversized, When the generator runs, Then each one produces a diagnostic row rather than a silent skip | unit tests over one fixture per category. Each row carries `path`, a one-based `line`, a `category` and a `reason`. The per-category counts are recorded in the baseline | Unmet | - |
| AC-007 | REQ-007, REQ-012 | Given at least 30 fresh Node processes, When a single prompt is resolved against the index in each, Then p95 and max both land under 200ms | recorded distribution with p50, p95, p99 and max, alongside corpus bytes, index bytes, runtime, platform and the manifest hash the run used | Unmet | - |
| AC-008 | SC-003 | Given the `system-spec-memory` daemon is stopped and no network is available, When a session exercises Gate 1, Then trigger matching still returns results | manual session run with the server stopped. The commands run and their exit statuses are recorded as the proof, not the narrative | Unmet | - |

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

Written at closure, not before. AC-001 and AC-008 are the rows that decide this
phase: parity with the live lane, and Gate 1 surviving without the daemon.
<!-- /ANCHOR:closure -->
