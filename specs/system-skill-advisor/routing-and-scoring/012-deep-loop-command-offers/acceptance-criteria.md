---
title: "Acceptance Criteria: Offer the right deep-loop command and flags from explicit loop wording"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "deep loop command offers acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers"
    last_updated_at: "2026-11-22T11:08:37Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-deep-loop-command-offers"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Offer the right deep-loop command and flags from explicit loop wording

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `012-deep-loop-command-offers`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-22
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`PROBE` below is `node scratch/probes/probe.mjs scratch/probes/probes-spec-baseline.json scratch/probes/results-after.json` with the packet path in front of each argument, run from the repository root. The baseline it is compared with is the Measured Behavior block in `spec.md` and `scratch/probes/results-spec-baseline.json`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the rebuilt advisor, When V6, H1a, H1b, E1 and E3 are probed, Then the top row is `system-deep-loop` with `cmd=/deep:review pol=ask` on V6, H1a and E3 and `cmd=/deep:research pol=ask` on H1b and E1 | `PROBE`, the five gain lines | Unmet | - |
| AC-002 | REQ-002 | Given the rebuilt advisor, When R7 is probed, Then its top row prints `cmd=-` | `PROBE`, the R7 line | Unmet | - |
| AC-003 | REQ-002 | Given the rebuilt advisor, When V3, V8, V5, R2b, R3, R3b, R6, A1, A4, A8, H6, H8 and H9 are probed, Then no row of any of them carries a `/deep:*` command, and V5's top row is still `sk-code` on `sk-code-review` | `PROBE`, the no-gain lines | Unmet | - |
| AC-004 | REQ-003 | Given the rebuilt advisor, When the seventeen keep rows are probed, Then each prints the same `/deep:*` command and `pol=ask` as the baseline | `PROBE`, the keep lines compared with `results-spec-baseline.json` | Unmet | - |
| AC-005 | REQ-004 | Given the rebuilt advisor, When the seventeen negative rows are probed, Then each prints the same top skill and the same `cmd=` value as the baseline | `PROBE`, the negative lines compared with `results-spec-baseline.json` | Unmet | - |
| AC-006 | REQ-005 | Given both deep presentation files, When they are searched, Then each holds `### Offer From an Advisor Brief`, a recommended option A that runs `:auto` with `--spec-folder=<the Gate 3 answer>`, option B on `:confirm`, option C with no loop, a native executor unless one is named, and fan-out only on two or more named executors or independent takes | `rg -n 'Offer From an Advisor Brief|:auto|--spec-folder=<the Gate 3 answer>|:confirm' .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/commands/deep/assets/deep-review-presentation.txt`, then a read of each section | Unmet | - |
| AC-007 | REQ-005 | Given both command documents, When MODE ROUTING is read, Then step 0 points at the offer section and counts a missing advisor policy as `ask` | `rg -n 'Offer From an Advisor Brief' .skilled/commands/deep/research.md .skilled/commands/deep/review.md` prints one line per file | Unmet | - |
| AC-008 | REQ-005 | Given a session on F3, F5 or F6, When the AI acts on the brief, Then its first visible response is one question whose recommended option carries the expected flag: fan-out groups, `--depth-mode=expansive` and `--extend=3` | Manual: one recorded session each through `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs` | Unmet | - |
| AC-009 | REQ-006 | Given the edited gate, When the unit file runs, Then every loop-ask clause returns its command and every depth word returns `undefined` | `npx vitest run tests/command-attach.vitest.ts` in `.skilled/skills/system-skill-advisor/runtime` reports 0 failed | Unmet | - |
| AC-010 | REQ-006 | Given the whole advisor suite and a rebuilt `dist`, When both run, Then the suite reports 0 failed and every probe line reads `exit 0 live` | `npx vitest run` and `npm run build` in `.skilled/skills/system-skill-advisor/runtime`, then `PROBE` | Unmet | - |
| AC-011 | REQ-007 | Given the edited command assets, When the mirror and reference gates run, Then both exit 0 and the compiled contracts no longer hold `ASK with SINGLE prompt` | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check`; `node .skilled/commands/scripts/validate-command-references.cjs`; `rg -c 'ASK with SINGLE prompt' .skilled/commands/deep/assets/compiled/` prints nothing | Unmet | - |
| AC-012 | REQ-007 | Given the corpus with the new rows, When the baseline is recaptured, Then `false_offer` and `false_offer_attached` over the rows that existed before equal the counts captured before the code change, and each new near-miss row's outcome is recorded on its own | `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs` before and after, with both counts written into `implementation-summary.md` | Unmet | - |
| AC-013 | REQ-008 | Given the stage-one rule, When R2, V2, V4, H7 and H10 are probed, Then each id's top row is recorded, and no REQ-004 negative changes its top skill | `PROBE`, the stage-one lines quoted in `implementation-summary.md` | Unmet | - |
| AC-014 | REQ-009 | Given the edited YAML and presentation files, When they are searched, Then the completed-packet message names `--extend=N` and `--restart`, and both Next Steps tables and both `next_steps` lists carry `--extend=N` and a `/doctor:deep-loop --scope=` row | `rg -n -- '--extend=N|--restart|doctor:deep-loop --scope=' .skilled/commands/deep/assets/deep-research.yaml .skilled/commands/deep/assets/deep-review.yaml .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/commands/deep/assets/deep-review-presentation.txt` | Unmet | - |
| AC-015 | REQ-010 | Given both presentation files, When step 6, Q2 and Q-Exec are read, Then step 6 names the question tool from `communication-handoff.md` §5, Q2 marks Autonomous `(Recommended)` and Q-Exec marks Native `(Recommended, default)` | `rg -c 'ASK with SINGLE prompt'` prints 0 on both files; `rg -n 'communication-handoff.md|Autonomous \(Recommended\)|Native \(Recommended, default\)'` prints each in both | Unmet | - |
| AC-016 | REQ-011 | Given the council words removed from the gate and the scorer, When H3b is probed, Then its top row is not `system-deep-loop` | `PROBE`, the H3b line; `rg -n "'convene'|'several models'|'ask the council'" .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` prints nothing | Unmet | - |
| AC-017 | REQ-011 | Given the three new research aliases, When K2 is probed and each alias is replayed in an out-of-domain prompt, Then K2 tops `system-deep-loop` on the research route, no out-of-domain prompt tops the hub, and the parent-skill checker passes on the hub it names | `PROBE`, the K2 line; one out-of-domain probe per alias; `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop`, subject line read before the verdict | Unmet | - |
| AC-018 | REQ-011 | Given the mode packets and examples, When they are searched, Then the depth triggers, the spaced `:auto` form, `skill_advisor.py` in the Gate 2 line and the spaced flag examples are gone, and the hub `SKILL.md` names `/doctor:deep-loop` | `rg -n 'comprehensive research|deep investigation|skill_advisor\.py' .skilled/skills/system-deep-loop/deep-research/SKILL.md`, `rg -n 'audit spec folder|pre-release review|/deep:review :auto' .skilled/skills/system-deep-loop/deep-review/SKILL.md` and `rg -n -- '--max-iterations [0-9]' .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md .skilled/commands/deep/assets/deep-research-presentation.txt` each print nothing; `rg -n 'doctor:deep-loop' .skilled/skills/system-deep-loop/SKILL.md` prints a line | Unmet | - |
| AC-019 | REQ-012 | Given the corpus, When it is searched, Then N7, N9, D1, V7, H6 and A3 each appear as a `near-miss` row, and no new guard for them appears in `command-attach.ts` | `rg -c '"row_type":"near-miss"' .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` prints 15, up from 9; `git diff` on `command-attach.ts` adds no prompt-specific guard | Unmet | - |
| AC-020 | REQ-013 | Given the corpus, When the deep-family holdout rows are compared with the previous commit, Then all three are new prompts written by the holdout worker, and no builder's report says it read a holdout row | `git diff` on `command-prompts.jsonl` shows three deep-family `"split":"holdout"` rows removed and three added; the lane reports | Unmet | - |
| AC-021 | REQ-014 | Given the rebuilt advisor, When N9 is probed, Then no row carries a `/deep:*` command | `PROBE`, the N9 line. If it still prints `cmd=/deep:research`, this row needs an operator waiver recorded in `decision-record.md` | Unmet | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** No

Nothing is built yet, so every criterion is unmet. AC-021 may need an operator waiver, as the spec's Open Questions explain.
<!-- /ANCHOR:closure -->
