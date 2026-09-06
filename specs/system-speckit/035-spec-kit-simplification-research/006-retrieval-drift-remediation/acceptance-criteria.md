---
title: "Acceptance Criteria: Retrieval drift remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "retrieval remediation criteria"
  - "committed pair criterion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/006-retrieval-drift-remediation"
    last_updated_at: "2026-09-06T16:10:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Marked every criterion met with the evidence observed"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Retrieval drift remediation

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 035-spec-kit-simplification-research/006-retrieval-drift-remediation
**Level:** 2
**Status:** Complete
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the conventions and the presentation asset, When a reader looks for lanes and match classes, Then two lanes and five labels appear and no concept lane or embedded index is named | a search for `concept lane` and one for `embedded index` under `references/retrieval` both return nothing; `retrieval-conventions.md` section 5 and `search-presentation.txt` list `exact`, `phrase-containment`, `query-containment`, `token-overlap`, `partial` | Met | - |
| AC-002 | REQ-002 | Given `search.md`, When its recipe block is compared with section 2.1, Then the flags and globs are identical apart from the placeholder | both blocks carry `--no-config --hidden --json --fixed-strings --ignore-case` and the four exclusion globs | Met | - |
| AC-003 | REQ-003 | Given `lib/corpus.mjs`, When the parity suite runs, Then every pruned directory name has an `EXCLUSIONS` row and `dist` is declared index-only | `tests/retrieval-coverage-parity.vitest.ts` 16 of 16 passed; the suite failed on `dist` before the change | Met | - |
| AC-004 | REQ-004 | Given one generator run, When the index and manifest are read, Then both carry `manifestHash` `237de51493a6…` | `generate-trigger-index.mjs --json` reported `published: true`, zero malformed documents; both files show the same hash | Met | - |
| AC-005 | REQ-005 | Given the doctor workflow, When phase 0 runs, Then it compares the two committed hashes and reports `committed_pair_match` | `doctor-speckit-retrieval.yaml` phase 0 activities and outputs; signal `committed_pair_mismatch` under staleness signals | Met | - |
| AC-006 | REQ-006 | Given the repository outside specs and changelogs, When the old path is searched, Then nothing names `retrieval/retrofit-convention` | `rg -n 'retrieval/retrofit-convention' . --hidden -g '!.git' -g '!specs/**' -g '!**/node_modules/**' -g '!**/changelog/**' -g '!**/dist/**'` returned nothing; `node --check` on the moved file passed | Met | - |
| AC-007 | REQ-007 | Given the README invocation, When it is run from `runtime/cli`, Then the seven suites pass | `npx vitest run --config ../../vitest.config.ts --project cli tests/…` printed 7 passed files, 221 passed tests | Met | - |

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

Every criterion is met by observed command output. Consciously left out: the `promptSetHash` slot stays, and the trigger lookup stays a manual step, both recorded as decisions in the research lane's confirmed-findings document.
<!-- /ANCHOR:closure -->
