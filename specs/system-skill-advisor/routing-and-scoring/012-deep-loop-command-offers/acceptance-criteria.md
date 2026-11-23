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
**Status:** Complete
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
| AC-001 | REQ-001 | Given the rebuilt advisor, When V6, H1a, H1b, E1 and E3 are probed, Then the top row is `system-deep-loop` with `cmd=/deep:review pol=ask` on V6, H1a and E3 and `cmd=/deep:research pol=ask` on H1b and E1 | `PROBE`, the five gain lines. Observed 2026-11-23 in `scratch/probes/results-after.json`: V6, H1a and E3 top `system-deep-loop` with `cmd=/deep:review pol=ask`, and H1b and E1 with `cmd=/deep:research pol=ask`. Evidence: `implementation-summary.md:155`. | Met | - |
| AC-002 | REQ-002 | Given the rebuilt advisor, When R7 is probed, Then its top row prints `cmd=-` | `PROBE`, the R7 line. Observed 2026-11-23: R7 prints `cmd=-`. Evidence: `implementation-summary.md:155`. | Met | - |
| AC-003 | REQ-002 | Given the rebuilt advisor, When V3, V8, V5, R2b, R3, R3b, R6, A1, A4, A8, H6, H8 and H9 are probed, Then no row of any of them carries a `/deep:*` command, and V5's top row is still `sk-code` on `sk-code-review` | `PROBE`, the no-gain lines. Observed 2026-11-23: none of the thirteen carries a `/deep:*` command in its three rows, and V5 tops `sk-code` on `sk-code-review`. Evidence: `implementation-summary.md:155`. | Met | - |
| AC-004 | REQ-003 | Given the rebuilt advisor, When the seventeen keep rows are probed, Then each prints the same `/deep:*` command and `pol=ask` as the baseline | `PROBE`, the keep lines compared with `results-spec-baseline.json`. Observed 2026-11-23: all seventeen print the baseline command and `pol=ask`. Evidence: `implementation-summary.md:155`. | Met | - |
| AC-005 | REQ-004 | Given the rebuilt advisor, When the seventeen negative rows are probed, Then each prints the same top skill and the same `cmd=` value as the baseline | `PROBE`, the negative lines compared with `results-spec-baseline.json`. Observed 2026-11-23: all seventeen print the baseline top skill and `cmd=` value. Evidence: `implementation-summary.md:155`. | Met | - |
| AC-006 | REQ-005 | Given both deep presentation files, When they are searched, Then each holds `### Offer From an Advisor Brief`, a recommended option A that runs `:auto` with `--spec-folder=<the Gate 3 answer>`, option B on `:confirm`, option C with no loop, a native executor unless one is named, and fan-out only on two or more named executors or independent takes | `rg -n 'Offer From an Advisor Brief\|:auto\|--spec-folder=<the Gate 3 answer>\|:confirm' .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/commands/deep/assets/deep-review-presentation.txt`, then a read of each section. Observed 2026-11-23: one heading per file, and each section holds A) Run it (Recommended) with `:auto` and `--spec-folder=<the Gate 3 answer>`, B) `:confirm`, C) no loop, the native executor by default and fan-out only on two or more named executors or independent takes. Evidence: `.skilled/commands/deep/assets/deep-research-presentation.txt:13`. | Met | - |
| AC-007 | REQ-005 | Given both command documents, When MODE ROUTING is read, Then step 0 points at the offer section and counts a missing advisor policy as `ask` | `rg -n 'Offer From an Advisor Brief' .skilled/commands/deep/research.md .skilled/commands/deep/review.md` prints one line per file. Observed 2026-11-23: one line per file. Evidence: `.skilled/commands/deep/research.md:86`. | Met | - |
| AC-008 | REQ-005 | Given a session on F3, F5 or F6, When the AI acts on the brief, Then its first visible response is one question whose recommended option carries the expected flag: fan-out groups, `--depth-mode=expansive` and `--extend=3` | Manual: one recorded session each through `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs`. Observed 2026-11-23: the F3 and F5 recordings in `scratch/behaviour/` recommend the fan-out groups and the expansive run through the text fallback, because the headless session had no question tool, and a live TUI run showed the question-tool dialog. The first F6 recording answered another prompt and is kept as `scratch/behaviour/F6-other-prompt.md`. Three fresh runs on the F6 prompt each stopped before spending but none asked the offer with options A, B and C. In plan mode (`scratch/behaviour/F6-plan-mode.md`) the session composed `--extend=3` and submitted a plan. Outside plan mode (`scratch/behaviour/F6.md`) it asked the spec-folder question and named `--extend=3` as the command it would run. After step 0 of both command documents was made to name the three options (`scratch/behaviour/F6-after-step0.md`), it asked which review was meant before opening the command document. Three more samples after that edit split: sample 1 (`scratch/behaviour/F6-sample-1.md`) asked which packet and offered A) `/deep:review:auto --extend=3 --spec-folder=<path>` as the recommended option, B) `:confirm` and C) no loop, through the text fallback as F3 and F5 did, while samples 2 and 3 asked for the target first and deferred the command document. Since the edit, 1 of 4 runs asked the offer, and the operator accepted that as Met with the rate disclosed. Evidence: `scratch/behaviour/F6-sample-1.md:23`. | Waived | ADR-003 |
| AC-009 | REQ-006 | Given the edited gate, When the unit file runs, Then every loop-ask clause returns its command and every depth word returns `undefined` | `npx vitest run tests/command-attach.vitest.ts` in `.skilled/skills/system-skill-advisor/runtime` reports 0 failed. Observed 2026-11-23: the loop-ask and depth-word cases live in `tests/command-attach-guards.vitest.ts`, beside the file named. With "thoroughly", "exhaustive" and "deep dive" added, the two files report 294 passed and 0 failed. Evidence: `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:536`. | Met | - |
| AC-010 | REQ-006 | Given the whole advisor suite and a rebuilt `dist`, When both run, Then the suite reports 0 failed and every probe line reads `exit 0 live` | `npx vitest run` and `npm run build` in `.skilled/skills/system-skill-advisor/runtime`, then `PROBE`. Observed 2026-11-23: `npm run build` exit 0, `npx vitest run` 180 files with 0 failed, and all 69 probe lines read `exit 0 live`. Evidence: `implementation-summary.md:156`. | Met | - |
| AC-011 | REQ-007 | Given the edited command assets, When the mirror and reference gates run, Then both exit 0 and the compiled contracts no longer hold `ASK with SINGLE prompt` | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check`; `node .skilled/commands/scripts/validate-command-references.cjs`; `rg -c 'ASK with SINGLE prompt' .skilled/commands/deep/assets/compiled/` prints nothing. Observed 2026-11-23: the mirror check passes 260 mirrors, command references resolve across 84 asset files, and the `rg` prints nothing. Evidence: `implementation-summary.md:156`. | Met | - |
| AC-012 | REQ-007 | Given the corpus with the new rows, When the baseline is recaptured, Then `false_offer` and `false_offer_attached` over the rows that existed before equal the counts captured before the code change, and each new near-miss row's outcome is recorded on its own | `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs` before and after, with both counts written into `implementation-summary.md`. Observed 2026-11-23: over the 35 rows that existed before the packet, `false_offer` and `false_offer_attached` are both 0, as in the baseline before the code change. The new rows are recorded in `implementation-summary.md`. Evidence: `implementation-summary.md:157`. | Met | - |
| AC-013 | REQ-008 | Given the stage-one rule, When R2, V2, V4, H7 and H10 are probed, Then each id's top row is recorded, and no REQ-004 negative changes its top skill | `PROBE`, the stage-one lines quoted in `implementation-summary.md`. Observed 2026-11-23: R2 tops `system-spec-kit`, V2, V4 and H10 top `system-deep-loop` with `/deep:review`, H7 tops it with `/deep:research`, and no REQ-004 id changed its top skill. Evidence: `implementation-summary.md:155`. | Met | - |
| AC-014 | REQ-009 | Given the edited YAML and presentation files, When they are searched, Then the completed-packet message names `--extend=N` and `--restart`, and both Next Steps tables and both `next_steps` lists carry `--extend=N` and a `/doctor:deep-loop --scope=` row | `rg -n -- '--extend=N\|--restart\|doctor:deep-loop --scope=' .skilled/commands/deep/assets/deep-research.yaml .skilled/commands/deep/assets/deep-review.yaml .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/commands/deep/assets/deep-review-presentation.txt`. Observed 2026-11-23: each of the four files prints matching lines. Evidence: `.skilled/commands/deep/assets/deep-research.yaml:68`. | Met | - |
| AC-015 | REQ-010 | Given both presentation files, When step 6, Q2 and Q-Exec are read, Then step 6 names the question tool from `communication-handoff.md` §5, Q2 marks Autonomous `(Recommended)` and Q-Exec marks Native `(Recommended, default)` | `rg -c 'ASK with SINGLE prompt'` prints 0 on both files; `rg -n 'communication-handoff.md\|Autonomous \(Recommended\)\|Native \(Recommended, default\)'` prints each in both. Observed 2026-11-23: `ASK with SINGLE prompt` is absent from both files, and the three phrases match in each. Evidence: `.skilled/commands/deep/assets/deep-research-presentation.txt:30`. | Met | - |
| AC-016 | REQ-011 | Given the council words removed from the gate and the scorer, When H3b is probed, Then its top row is not `system-deep-loop` | `PROBE`, the H3b line; `rg -n "'convene'\|'several models'\|'ask the council'" .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` prints nothing. Observed 2026-11-23: H3b tops nothing, and the `rg` prints nothing. Evidence: `implementation-summary.md:155`. | Met | - |
| AC-017 | REQ-011 | Given the three new research aliases, When K2 is probed and each alias is replayed in an out-of-domain prompt, Then K2 tops `system-deep-loop` on the research route, no out-of-domain prompt tops the hub, and the parent-skill checker passes on the hub it names | `PROBE`, the K2 line; one out-of-domain probe per alias; `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop`, subject line read before the verdict. Observed 2026-11-23: K2 tops `system-deep-loop` on the research route, and `parent-skill-check` prints OK with 0 warnings. Three of four out-of-domain replays in `scratch/probes/results-ac017-ood.json` stay off the hub, but "write a memo on multi-round research funding for the grant committee" tops it with no command. The operator accepted ADR-002, which keeps the alias. Evidence: `implementation-summary.md:158`. | Waived | ADR-002 |
| AC-018 | REQ-011 | Given the mode packets and examples, When they are searched, Then the depth triggers, the spaced `:auto` form, `skill_advisor.py` in the Gate 2 line and the spaced flag examples are gone, and the hub `SKILL.md` names `/doctor:deep-loop` | `rg -n 'comprehensive research\|deep investigation\|skill_advisor\.py' .skilled/skills/system-deep-loop/deep-research/SKILL.md`, `rg -n 'audit spec folder\|pre-release review\|/deep:review :auto' .skilled/skills/system-deep-loop/deep-review/SKILL.md` and `rg -n -- '--max-iterations [0-9]' .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md .skilled/commands/deep/assets/deep-research-presentation.txt` each print nothing; `rg -n 'doctor:deep-loop' .skilled/skills/system-deep-loop/SKILL.md` prints a line. Observed 2026-11-23: the three searches print nothing, and the hub `SKILL.md` names `/doctor:deep-loop`. Evidence: `.skilled/skills/system-deep-loop/SKILL.md:20`. | Met | - |
| AC-019 | REQ-012 | Given the corpus, When it is searched, Then N7, N9, D1, V7, H6 and A3 each appear as a `near-miss` row, and no new guard for them appears in `command-attach.ts` | `rg -c '"row_type":"near-miss"' .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` prints 15, up from 9; `git diff` on `command-attach.ts` adds no prompt-specific guard. Observed 2026-11-23: 31 near-miss rows. N7, N9, V7, H6 and A3 are near-miss rows, and D1 became a positive `/doctor:deep-loop` row under D10. | Superseded | ADR-001 |
| AC-020 | REQ-013 | Given the corpus, When the deep-family holdout rows are compared with the previous commit, Then all three are new prompts written by the holdout worker, and no builder's report says it read a holdout row | `git diff` on `command-prompts.jsonl` shows three deep-family `"split":"holdout"` rows removed and three added; the lane reports. Observed 2026-11-23 by row id only: the three deep-family `-01` holdout rows are gone and three `-04` rows replace them. The lane reports are not kept in the packet, so the blind-writer clause rests on the record in `implementation-summary.md`. Evidence: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:94`. | Met | - |
| AC-021 | REQ-014 | Given the rebuilt advisor, When N9 is probed, Then no row carries a `/deep:*` command | `PROBE`, the N9 line. If it still prints `cmd=/deep:research`, this row needs an operator waiver recorded in `decision-record.md`. Observed 2026-11-23: N9 prints `cmd=-` with no `/deep:*` command in any row, so no waiver is needed. Evidence: `implementation-summary.md:155`. | Met | - |
| AC-022 | REQ-015 | Given the rebuilt advisor, When the six refusal prompts and the control are sent through the prompt hook, Then no refusal carries a `/deep:*` command and the control keeps `/deep:review` | Observed 2026-11-23 through the prompt hook (`scratch/probes/fresh-review-hook.txt`): the six refusals carry no `/deep:*` command, and the control prints `/deep:review`. Evidence: `scratch/probes/fresh-review-hook.txt:1`. | Met | - |
| AC-023 | REQ-016 | Given the rebuilt advisor, When the two "how many" questions are sent, Then neither carries a `/deep:*` command | Observed (`scratch/probes/fresh-review-hook.txt`): neither question carries a `/deep:*` command. Evidence: `scratch/probes/fresh-review-hook.txt:8`. | Met | - |
| AC-024 | REQ-017 | Given the rebuilt advisor, When the hyphen and curly-apostrophe prompts are sent, Then they get `/deep:review` and `/deep:research` | Observed (`scratch/probes/fresh-review-hook.txt`): `run a deep-review of the auth module` prints `/deep:review`, and the curly-apostrophe prompt prints `/deep:research`. Evidence: `scratch/probes/fresh-review-hook.txt:10`. | Met | - |
| AC-025 | REQ-018 | Given the rebuilt advisor, When "the deep research run is not stuck, run 5 more iterations" is sent, Then it gets `/deep:research` and no `/doctor:deep-loop` | Observed (`scratch/probes/fresh-review-hook.txt`): `/deep:research`, with no `/doctor:deep-loop`. Evidence: `scratch/probes/fresh-review-hook.txt:12`. | Met | - |
| AC-026 | REQ-019 | Given the rebuilt advisor, When the nine subject prompts and the three controls are sent, Then no subject prompt carries a `/deep:*` command and each control keeps its command | Observed (`scratch/probes/fresh-review-hook.txt`): no subject prompt carries a `/deep:*` command, and the three controls keep `/deep:review`, `/deep:research` and `/deep:review`. Evidence: `scratch/probes/fresh-review-hook.txt:13`. | Met | - |
| AC-027 | REQ-020 | Given the four typed prompts, When the Python gate and `attachCommand` each read them with a typed row, Then both return the same result | Observed: the shared fixture pins `typedReviewKept` for the four prompts and a typed control, and both suites pass on it. Both gates withhold the run command on all four and keep it on the control. Evidence: `implementation-summary.md:214`. | Met | - |
| AC-028 | REQ-021 | Given the final tree, When both suites, the predicate comparison, the 69-probe rerun and the corpus recapture run, Then all pass, drift is 0, no gain, keep or stage-one line loses its command and `false_offer` stays 0 | Observed: vitest 180 files, 2696 passed, 4 skipped, 0 failed. Python `pass=130, fail=0`. Predicate drift 0 of 227. 69 probes all `exit 0 live` with 0 changes against the last landing. Corpus `false_offer` 0 of 57. Evidence: `implementation-summary.md:163`. | Met | - |
| AC-029 | REQ-022 | Given the changelog and this file, When they are read, Then the changelog states the refusal rule as built, names the brief change and quotes the final suite count, and AC-008 reads `Waived` with ADR-003 | Observed: `.skilled/changelog/skilled/v4.2.0.0.md` states the refusal rule, names the brief options and the typed `(ask)`, quotes 2,696 passed, and AC-008 reads `Waived` with ADR-003. Evidence: `tasks.md:128`. | Met | - |

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

**Closeable:** Yes

Every row is `Met`, `Waived` or `Superseded`, and each waiver and supersession names an ADR in `decision-record.md`.
<!-- /ANCHOR:closure -->
