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
**Status:** Complete
**Date:** 2026-09-02
**Research:** `../005-ripgrep-retrieval-research/research/lineages/luna-max/research.md`
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-008, REQ-009 | Given the frozen prompt set and the frozen corpus manifest, When each lexical prompt is resolved through the live `exactTriggerSearch` lane, `trigger-index.json` and the documented `rg` recipes, Then the candidate sets agree in both directions with zero unexplained `legacyOnly` and zero unexplained `indexOnly` rows, no scope, archive or expiry leakage. Semantic paraphrase rows are reported separately as boundary probes | `node scripts/retrieval/parity-check.mjs --db <main-checkout context-index.sqlite> --json`: 18 cases PASS, legacyOnly 0, indexOnly 14 all explained by the lane's 60-row recency window, unexplained 0; report at `fixtures/parity-baseline.json`, manifest hash c0806077, prompt-set hash ae629454; two runs identical on the legacy and index arms and every verdict | Met | - |
| AC-002 | REQ-002, REQ-011 | Given a generated `trigger-index.json`, When the generator is run a second time over the same manifest, Then the artifact is byte-identical with a matching SHA-256. No run leaves a partial or replaced artifact behind | three consecutive generator runs byte-identical and SHA-256 identical for index, manifest and variants; `cmp` exit 0 | Met | - |
| AC-003 | REQ-003 | Given a fresh clone with no build step and no running daemon, When Gate 1 resolves a prompt, Then the index is present and readable from the working tree | `data/trigger-index.json` is a tracked, non-ignored 3,814,726 byte artifact; `node scripts/retrieval/lookup-trigger-index.mjs "spec folder question" --json` returns 20 results from the working tree with no daemon | Met | - |
| AC-004 | REQ-004 | Given no daemon, no database and no network, When the generator runs, Then it completes successfully | `node scripts/retrieval/generate-trigger-index.mjs` exit 0 with no daemon process, no database and no network; `fixtures/daemon-off-proof.json` | Met | - |
| AC-005 | REQ-005, REQ-013 | Given `retrieval-conventions.md`, When a reader looks up the replacement for `memory_search`, `memory_context` or `memory_quick_search`, Then each has a concrete ripgrep invocation that can be pasted and run. The doc states that ripgrep produces evidence rather than ranking relevance | `references/retrieval/retrieval-conventions.md` gives the structured, path-only, count and context recipes; each executed with exit 0, 1 and 2 recorded in `fixtures/recipe-execution.json` | Met | - |
| AC-006 | REQ-006, REQ-010 | Given documents whose `trigger_phrases` block is missing, malformed, non-YAML, wrongly typed, validly empty, alias-spelled, generic, duplicated or oversized, When the generator runs, Then each one produces a diagnostic row rather than a silent skip | `fixtures/generation-diagnostics.json`: ok 13,505, missing-frontmatter 14,955, duplicate-phrase 92, valid-empty-list 2, non-yaml-frontmatter 1 (ignored by manifest with reason); unit tests cover every category | Met | - |
| AC-007 | REQ-007, REQ-012 | Given at least 30 fresh Node processes, When a single prompt is resolved against the index in each, Then p95 and max both land under 200ms | `fixtures/latency-report.json`: 36 fresh-process runs, p50 71.3 ms, p95 83.7 ms, p99 91.0 ms, max 91.0 ms, corpus 232,996,380 bytes, index 3,814,726 bytes, Node v26.8.1 darwin arm64 | Met | - |
| AC-008 | SC-003 | Given the `system-spec-memory` daemon is stopped and no network is available, When a session exercises Gate 1, Then trigger matching still returns results | `fixtures/daemon-off-proof.json`: pgrep for system-spec-memory and context-server recorded, three lookups exit 0 with 20, 20 and 20 results | Met | - |

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

AC-001 and AC-008 carried the phase: the three-arm harness found no legacy-only miss and no unexplained index-only extra across 18 frozen cases, and Gate 1 lookups answered with no daemon running. Consciously left out: the ripgrep arm is evidence over the live working tree, so its match counts move when markdown changes between runs; only the legacy and index arms are pinned to the manifest.
<!-- /ANCHOR:closure -->
