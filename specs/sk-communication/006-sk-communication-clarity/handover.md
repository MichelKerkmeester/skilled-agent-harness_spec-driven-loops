---
title: "Session Handover Document"
description: "Final state, decisions, traps and the resume queue for the sk-communication clarity program after the build sessions of 2026-09-13 to 2026-09-15."
trigger_phrases:
  - "session handover"
  - "clarity program resume"
  - "reply harness rerun"
  - "communication rule iteration"
  - "root doc cut"
importance_tier: "important"
contextType: "implementation"
---
# Session Handover Document

Final state and resume queue for the sk-communication clarity program, handed over built.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Read this before touching anything in this packet. Every phase is Complete and every
acceptance row is Met. Section 3 names the one measurement still open and the two rule
sentences it measures. Section 4 says what is observed and what is derived.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

**Sessions:** 2026-09-12 planning, 2026-09-13 to 2026-09-15 build. **Handed over:** 2026-09-15.

The program turned three vendored external communication sources into changes across the
repository's communication stack. Ten children are Complete under the parent. Phases 001 and
002 researched and decided, 003 and 006 to 009 landed the rule candidates, 007 restructured
the wording standard, 004 rebuilt the projection engine, 005 built and ran the reply harness,
and 010 closed the six findings of a five-iteration Sonnet review. The sibling governance packet
`specs/sk-doc/055-governance-doc-alignment` cut the root document from 496 lines to 283 and
aligned the rule router.

**Where it stopped.** Two rule sentences the harness showed inert, the item cap and the closing
contract, were rewritten as directives and the after-condition is being regenerated on both
models. That rerun is the only open measurement. Everything else is committed, and the branch
was level with origin at `67b2171d03` when this was written.

**Ownership.** Concurrent sessions live-synced this branch throughout. Two of this program's
commits reached origin through another session's push. Attribute before assuming a working-tree
change is yours.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

Nine operator decisions, all Accepted, recorded as ADR-001 through ADR-009 in
`002-synthesis-and-decisions/decision-record.md`. The build added these, each recorded where
it binds:

| Decision | Where recorded |
|----------|----------------|
| The wording standard has one home and enters the engine as one lazily resolved instruction, no packed copy, no detectors | ADR-005, `004/implementation-summary.md` |
| The reply-shape rule splits into `communication.md` for the reply and `communication-prose.md` for the sentence, both under the 250-line ceiling | `003/implementation-summary.md`, rename in commit `dc79a591e0` |
| The root document keeps only what binds when nothing else loads, plus the root-only logic an independent review found the cut had dropped | `055/scratch/opus-root-doc-audit.md`, `055/scratch/fable-review-of-root-doc-cut.md` |
| Gate 3 offers four options, the two update options merged | `specs/system-speckit/033-system-speckit-v4/040-gate-3-option-merge` |
| LUNA lineage disagreements are recorded, not acted on | `001/research/research.md` disagreement table |
| Review findings P1 and P2 and the cosmetic rows all close in one remediation phase | `010/spec.md` |

### 2.2 Blockers Encountered

- **The reply harness could not measure two rules.** The item cap and the closing contract
  scored inert on GLM-5.3-Flash and on Sonnet 5 because both were descriptive. Both were made
  directive and the after-condition is regenerating under `005/runs/iterated/`.
- **The human study in the release gate is unobservable** from inside a session. The gate
  records it as GAP, not as PASS.
- **The audited claude executor refuses nested dispatch** from inside Claude Code. Sonnet work
  ran through the in-process Agent tool instead. Every return was verified against the files.

### 2.3 Files Modified

| Path | What |
|------|------|
| `AGENTS.md` | 496 lines to 283: delegated clauses cut, root-only logic kept, Gate 4 names the live bridge |
| `REPO RULES.md` | Twelve rule rows, the prose row added, hub-routing and delegation summaries trimmed |
| `repo-rules/communication.md` | The reply half: register, length, filler, numbered steps, item cap, close, leaked-scaffolding guard |
| `repo-rules/communication-prose.md` | The sentence half, renamed from prose-mechanics, seven self-checks |
| `repo-rules/handoff-and-questions.md` | Closing contract: show the work, name the command and its status, one next action |
| `repo-rules/*.md` | Nineteen self-check lines added across nine rules |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` | The base, with `hvr-publish-supplement.md` beside it |
| `.opencode/skills/sk-communication/cli-communication-projection/` | Lazy instruction, guard-scoped markers, claim-coverage veto, no-op change kind, tests |
| `.opencode/skills/sk-communication/benchmark/reply-harness/` | Cases, rubric, prompt generator, scorer, blind, compare, release gate |
| `.opencode/skills/cli-external-orchestration/**` | Section repoints to §9 and the Hermes no-directory clauses |

### 2.4 Traps & Scar Tissue

Each of these cost real time. All are observed, not theorised.

**A 380-line persona makes GLM think for sixteen minutes before its first tool call.** The
leaf timed out at 1500 seconds. A twelve-line persona digest and a 5400-second timeout fixed
it. Keep dispatch prompts slim.

**Abstract harness prompts produce empty replies.** The first harness attempt got five empties
because the case prompts described a situation instead of giving the model an operator
message. `cases.json` now carries an `operatorPrompt` per case, and the scorer refuses an
empty reply instead of scoring it 0.5.

**The control case moves on tell noise.** The scorer judged the control on style tells and
called it moved. It is now judged on its observable predicate only.

**Print mode returns only the last message.** A `claude -p` audit that backgrounded a search
returned one line. The full report was recovered from the session JSONL under
`~/.claude/projects/`.

**An audit can retire something that is live.** The root-document audit claimed the
`command-spec-kit` bridge was retired. The independent review checked the scorer projection
and found it live. Every deletion claim in a governance audit needs a file read behind it.

**Background generators die with the session.** A compaction killed the harness rerun after one
reply. Launch long generators with `nohup` detached, and check for a run manifest before
trusting a directory of replies.

**Route-remint and mirror-parity gates shape the commit.** A pathspec commit touching a hub
SKILL.md is blocked, so commit from a verified staged index. Agent mirrors under `.claude`,
`.codex` and `.pi` must be staged together, which means carrying other sessions' agent edits
and naming them in the message.
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

Read the rerun result before anything else. The rerun writes `run-manifest.json` into each
replies directory when it finishes, and the launcher log ends with `RERUN-DONE`.

```
R=specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/runs/iterated
H=.opencode/skills/sk-communication/benchmark/reply-harness
cat $R/glm-after-replies/run-manifest.json $R/sonnet-after-replies/run-manifest.json
node $H/score.mjs --condition after --replies $R/glm-after-replies --out $R/results/glm-after.json
node $H/score.mjs --condition after --replies $R/sonnet-after-replies --out $R/results/sonnet-after.json
```

Compare each against the matching before-condition result under `005/runs/results/` and
`005/runs/sonnet/`, then record the delta for C6 and for the closing rows in
`005/implementation-summary.md`.

### 3.2 Priority Tasks Remaining

1. **Score the rerun** as above and record whether the two directive rewrites moved C6 and the
   closing rows. If either is still inert, the rule sentence is the next thing to change, not
   the harness.
2. **Commit the rerun results with the two rule edits** in `communication.md` and
   `handoff-and-questions.md`, then ask for a push.
3. **Watch for the leaked-scaffolding guard in live replies.** Other sessions were copying the
   runtime's batching nudge into replies as "Privately, what I need next" with inline (1), (2)
   numbering. The guard landed in `communication.md` §3 and §7 on 2026-09-15. If it recurs,
   the fix belongs in that rule, and the reply harness needs a case for it.

### 3.3 Critical Context to Load

**The harness measures rule text, not models.** Before is commit `4512473abd`, after is the
working tree. A rule that does not move the score is inert as written, whatever the model.
Both models ran with provider-default thinking per ADR-008, so record which produced each
result.

**The two rules under measurement.** `communication.md` §8, no group shows more than five
items, and `handoff-and-questions.md` §1, the closing contract with its command-and-status
clause. Both are directive now. The harness cases that key them are C6 and the closing rows.

**Executors that worked.** GLM-5.3-Flash through `pi -p --offline` with `</dev/null`, alarm
900 seconds per reply. Sonnet 5 through `claude -p --model claude-sonnet-5` with the read
tools and the two case commands pre-approved. The pi generator is
`scratchpad/generate-replies.sh` and the claude one `generate-replies-claude.sh`, both copied
into the harness README's instructions.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

| Claim | Status | Evidence |
|-------|--------|----------|
| Ten children and the parent are Complete with every acceptance row Met | OBSERVED | Recursive strict validate, eleven `RESULT: PASSED` lines |
| Every rule edit passes the corpus checker | OBSERVED | `check-repo-rules.cjs` RESULT: PASSED 9/9 after the last edit |
| Projection engine gate green | OBSERVED | `npm run check` 83 files, 459 tests, exit 0 |
| Harness before to after on GLM | OBSERVED | Weighted mean 0.60 to 0.74, control held, C1 and C6 blocking |
| Harness before to after on Sonnet | OBSERVED | Weighted mean 0.71 to 0.73, control held, C3 blocking |
| Deep review closed | OBSERVED | 0 P0, 2 P1, 4 P2, all six closed in 010 with direct tests |
| Root document at 283 lines with the root-only logic intact | OBSERVED | Line-by-line diff against `055/scratch/agents-md.original-496.md` |
| Runtime mirrors in sync | OBSERVED | Gate-1 pointers, runtime mirrors, hook registrations and agent mirrors all report no drift |
| The directive rewrites move C6 and the closing rows | **UNVERIFIED** | Rerun in progress under `005/runs/iterated/` |
| Every verification checklist row is worked | DERIVED | Worked by three Sonnet leaves on 2026-09-15, each folder validated after |
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

**The build ran in D2 order with GLM-5.3-Flash leaves.** 007 first because 004 needs the
standard's base, then 004, 009 and 005, with 003, 006 and 008 landed by hand. Leaves never
dispatched. The conductor verified every return against the files.

**The root document went through six passes.** Two reductions by hand, an Opus audit that
applied 27 rows, a Fable review that found eight defects in the audit, a restoration of seven
root-only pieces, and the Gate 3 option merge. The two snapshots under `055/scratch/` are the
before states.

**Corrections made during the sessions, recorded so they are not repeated.** The Opus audit
retired a live bridge and the review restored it. The harness scored empty replies as
half-credit until the scorer refused them. A dispatch was declared done on a wrapper exit of
zero when the receipt said 143. The rerun was declared running when compaction had killed it.
<!-- /ANCHOR:session-notes -->
