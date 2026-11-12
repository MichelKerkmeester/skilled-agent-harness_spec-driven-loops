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
**Status:** Complete
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `C` is `$ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given Ollama running, When the skill graph scan runs twice with no text change, Then `vec_cmd_<dim>` holds 45 rows, `loadSkillEmbeddings` returns a vector for each of the 45 scored command rows keyed by row id, `vec_<dim>` is unchanged, and the second scan embeds no command row | `vec_cmd_768` holds 45 rows (read 2026-11-12). `loadSkillEmbeddings(ids)` reads it. `schema.ts` keeps `REFERENCES` only on the skill table, so `vec_<dim>` is unchanged. A repeat scan reads `0 embedded, 45 skipped` in the worker log `scratch/logs/w2-T009.out:40-43` | Met | - |
| AC-002 | REQ-002 | Given injected vectors, When a command clears τ and the margin, falls under τ, sits inside the margin, or carries only `shadow:test-fallback` evidence, Then it passes, fails, fails and fails | `tests/command-meaning-anchor.vitest.ts` covers the pass, under the bar, inside the margin and stand-in cases. The full suite on the final state passed with exit 0 (AC-009) | Met | - |
| AC-003 | REQ-003 | Given a scanned database and Ollama, When `C` runs in real-embedding mode, Then holdout combined plain reach is at least 5 of 44, false offers 0 of 35 and typed recall at least 24 of 44 | `scratch/real-embedding.json`: holdout combined 2 of 44, false offers 0 of 35, typed 24 of 44. Holdout misses the target of 5. It read 3 of 44 at round two (`scratch/real-embedding-round2.json`) and moved to 2 after the read-only check (ADR-011). The operator chose "Keep round two, close with the miss (Recommended)" on 2026-11-12 | Waived | ADR-009 |
| AC-004 | REQ-004 | Given the embedder or the database absent, When a prompt is scored, Then the result equals today's, and `node $C` prints the committed baseline metrics | Database absent: the default capture, which uses an empty database folder, reprinted the before numbers on 2026-11-12. Embedder absent: `withSemanticShadowPromptEmbedding` leaves no prompt embedding, and the test that scores whole prompts with no embedder and no stored vectors shows every passing command rests on an authored phrase | Met | - |
| AC-005 | REQ-005 | Given the change, When `capture-scorer-eval-baseline.mjs` runs through the phase 003 jq projection, Then it prints `[159,50,20,5]` | Rerun on 2026-11-12: `[159,50,20,5]` | Met | - |
| AC-006 | REQ-006 | Given the tuning script, When it reads the corpus, Then it filters to `split == "tune"` before reading any prompt text | `scratch/tune-threshold.mjs` keeps `split === 'tune'` or a must-stay-silent row, `rg -n holdout` on it prints nothing, and its output reads `rows scored: 80 (tune 45, must stay silent 35)` | Met | - |
| AC-007 | REQ-007 | Given three before and three after hook runs over the 44 tune prompts, When the middle runs are compared, Then the median grew by at most 25 ms and the p95 by at most 40 ms | `scratch/hook-latency-*.json`: middle median 199.16 to 205.09, +5.93 ms. Middle p95 231.35 to 261.92, +30.57 ms. The final runs were taken at a load average near 15, as reported | Met | - |
| AC-008 | REQ-008 | Given the change, When `derive-command-bridges.cjs --check` runs and the anchor tests run, Then it prints `fresh`, the policy rollup is 17 ask, 7 run, 20 start, and a meaning anchor never sets `readOnlyRouteAllowed` | `--check` prints `"status": "fresh"`, and the rollup query prints `{"ask":17,"run":7,"start":20}` (rerun 2026-11-12). The first reasoning, that `readOnlyRouteAllowed` takes no lane input, did not hold: a meaning match raised a mutating command past the read-only floor. `commandMeaningEligible` now rules that out (ADR-011), the four eligibility cases in `tests/command-meaning-anchor.vitest.ts` cover it, and the two no-change CLI probes no longer return `command-doctor-env`, as reported | Met | - |
| AC-009 | REQ-009 | Given the change, When the real-embedding capture and `npm test` in `ADV` run, Then tune combined plain reach is at least 9 of 45 and the suite reports 0 failed | `scratch/real-embedding.json`: tune combined 14 of 45. `npm test` rerun on the final state on 2026-11-12 with the embedder running: exit 0, 1,430 passed, 6 skipped | Met | - |
| AC-010 | REQ-010 | Given injected vectors, When a command passes on meaning beside a passing skill, Then it ranks first when its cosine beats the skill's by m, keeps its place inside the margin, and a doctor row that clears the margin ranks first | The rank cases in `tests/command-meaning-anchor.vitest.ts`: moves first on a clear lead, keeps the order inside the margin, moves a doctor command first. The full suite on the final state passed with exit 0 (AC-009) | Met | - |

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

Every row is `Met` or `Waived`. AC-003 is waived by ADR-009, the operator's acceptance of the holdout miss, recorded in `decision-record.md` and `plan.md`.
<!-- /ANCHOR:closure -->
