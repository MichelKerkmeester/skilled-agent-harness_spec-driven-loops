---
title: "Acceptance Criteria: Phase 4: command-meaning-matching"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "command meaning matching acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/004-command-meaning-matching"
    last_updated_at: "2026-11-12T18:13:57Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-command-meaning-matching"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: command-meaning-matching

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
**Packet:** `system-skill-advisor/routing-and-scoring/008-command-surfacing-build/004-command-meaning-matching`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `C` is `$ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given Ollama running, When the skill graph scan runs twice with no text change, Then `vec_cmd_<dim>` holds 45 rows, `loadSkillEmbeddings` returns a vector for each of the 45 scored command rows keyed by row id, `vec_<dim>` is unchanged, and the second scan embeds no command row | The vector count against the 45 entries in `command-bridges.generated.json` that carry `embeddingText`, and the second scan's embedded count | Unmet | - |
| AC-002 | REQ-002 | Given injected vectors, When a command clears τ and the margin, falls under τ, sits inside the margin, or carries only `shadow:test-fallback` evidence, Then it passes, fails, fails and fails | `npx vitest run tests/command-meaning-anchor.vitest.ts` in `ADV` reports 0 failed | Unmet | - |
| AC-003 | REQ-003 | Given a scanned database and Ollama, When `C` runs in real-embedding mode, Then holdout combined plain reach is at least 5 of 44, false offers 0 of 35 and typed recall at least 24 of 44 | The saved real-embedding capture output | Unmet | - |
| AC-004 | REQ-004 | Given the embedder or the database absent, When a prompt is scored, Then the result equals today's, and `node $C` prints the committed baseline metrics | The absent-embedder and absent-database test rows, and the default capture | Unmet | - |
| AC-005 | REQ-005 | Given the change, When `capture-scorer-eval-baseline.mjs` runs through the phase 003 jq projection, Then it prints `[159,50,20,5]` | The command output | Unmet | - |
| AC-006 | REQ-006 | Given the tuning script, When it reads the corpus, Then it filters to `split == "tune"` before reading any prompt text | `rg -n "split === 'tune'"` on the tuning script, and a code read | Unmet | - |
| AC-007 | REQ-007 | Given three before and three after hook runs over the 44 tune prompts, When the middle runs are compared, Then the median grew by at most 25 ms and the p95 by at most 40 ms | The six timing files in `scratch/` | Unmet | - |
| AC-008 | REQ-008 | Given the change, When `derive-command-bridges.cjs --check` runs and the anchor tests run, Then it prints `fresh`, the policy rollup is 17 ask, 7 run, 20 start, and a meaning anchor never sets `readOnlyRouteAllowed` | The check output, the rollup and the `readOnly` test row | Unmet | - |
| AC-009 | REQ-009 | Given the change, When the real-embedding capture and `npm test` in `ADV` run, Then tune combined plain reach is at least 9 of 45 and the suite reports 0 failed | The capture output and the suite summary | Unmet | - |
| AC-010 | REQ-010 | Given injected vectors, When a command passes on meaning beside a passing skill, Then it ranks first when its cosine beats the skill's by m, keeps its place inside the margin, and a doctor row that clears the margin ranks first | The rank cases in `npx vitest run tests/command-meaning-anchor.vitest.ts` in `ADV` | Unmet | - |

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

The phase is planned and no build has started, so every criterion is unmet. Every design question is answered.
<!-- /ANCHOR:closure -->
