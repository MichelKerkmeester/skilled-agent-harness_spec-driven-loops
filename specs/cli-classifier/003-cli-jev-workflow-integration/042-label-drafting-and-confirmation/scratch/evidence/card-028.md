# Labeling card 028: confirm-mode-stop-hint

Phase folder: `specs/cli-jev/003-cli-jev-workflow-integration/028-confirm-mode-stop-hint/`.

## 1. Question

Does 027's label gate report a confirmed gold — the single condition that decides whether this
phase prints any stop-hint verdict at all (`spec.md:126` REQ-002; `goal.md:56` D5; `spec.md:83`).

## 2. Rubric

**This phase writes no labels of its own.** Its rubric is 027's operator read, carried through
027's report:
`spec.md:94` (out of scope) — "New gold or labels. The gold is 027's, confirmed by the operator's
five-lineage read there"; `goal.md:56` D5 — "Gold and labels are 027's. An ungated 027 report stops
the phase."

- A labeler's work for 028 is the work carded in `card-027.md`: read the first five sampled lineages
  and confirm each derived gold iteration.
- The report's `gate.label` block carries 027's gate state into this phase
  (`score-stop-rater.cjs:1516` writes `gate: { label: gate.label, … }`).

**UNDEFINED — nothing to decide here.** There is no label value this phase can define or accept of
its own; if the operator wants a different gold or a different hint rule, that is a 027 amendment,
not a 028 label (`spec.md:94`; `goal.md:56` D5).

Edge cases the spec names:

- A missing or unparseable `report.json` exits 2 with a named error; a report whose label gate
  stopped prints `stop: rater report has no confirmed gold`, exits 0 and prints no verdict
  (`spec.md:126` REQ-002).
- A missing, null or false `gate.label.passed` all read the same way: no confirmed gold
  (`score-stop-hint.cjs:112-121`).
- The hint rule itself is not a label: a hint `t` is right when `g <= t < r` and wrong when
  `t < g`, where `g` is 027's gold and `r` the recorded last iteration (`spec.md:127` REQ-003;
  `goal.md:54` D3).

## 3. Label values

No label values. The only gating field is the boolean `gate.label.passed` in 027's report
(`score-stop-hint.cjs:120`, read from `report?.gate?.label?.passed === true`).

## 4. Rows

- **Rows to label:** none of its own. The rows it measures are 027's sampled lineages, as recorded
  in 027's `report.json` (`spec.md:83`, `spec.md:88`).
- **id field:** not applicable; the report is keyed by lineage internally.
- **Draw command:** none. To produce the report, run 027's scorer with a `--gold-reads` file that
  passes 027's gate; 027 then writes `report.json` with `gate.label.passed = true`
  (`score-stop-rater.cjs:1516`; `implementation-summary.md:162` records that no such report exists
  yet).
- **What a labeler reads per row:** nothing new. The text a labeler reads is 027's archived
  deep-research transcripts (see `card-027.md` §4).

## 5. Label file

- **Path:** none of its own. The one label file in this chain is 027's `--gold-reads <file>`
  (`score-stop-rater.cjs:1590`; `spec.md:94`, `goal.md:56`).
- **JSON shape:** 027's: JSON Lines `{lineage, gold_iteration, labeler}`
  (`score-stop-rater.cjs:485-518`). See `card-027.md` §5.
- **Label / labeler fields:** `gold_iteration` / `labeler` in 027's file.
- **Confirmed row:** as in `card-027.md` §5; a row counts only once the operator confirms it, per
  the parent goal (`../goal.md:50` D4; drafting rule at `../goal.md:257`).
- **028's own input file:** 027's `report.json` (`REPORT_FILE = 'report.json'`,
  `score-stop-hint.cjs:27`; read at `:83`), which lives in 027's operator-named `--out` directory
  **outside the repository** (`spec.md:112`; the session's final 027 report lived in the session
  scratchpad outside the tree).

## 6. Gate

- **Needs:** `report.gate.label.passed === true` (`score-stop-hint.cjs:119-121`) — i.e. 027's five
  confirmed lineage reads (`../027-stop-second-rater/spec.md:136`). No count, no per-class minimum of
  its own.
- **Stop line below the gate:** `stop: rater report has no confirmed gold`
  (`score-stop-hint.cjs:29`, `:446-450`), exit 0, no verdict.

**Unblock condition.** 027's `gate.label.passed` turns true, i.e. the operator confirms the derived
gold on the first five sampled lineages; this phase then reruns on the gated report
(`spec.md:126` REQ-002; `spec.md:88`).
- **Run:**
  `node .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs --rater-report <dir> [--jev] [--deem] [--out <dir>]`
  (`score-stop-hint.cjs:57`; `spec.md:125`; a switch without `--out` exits 2 before any call).
