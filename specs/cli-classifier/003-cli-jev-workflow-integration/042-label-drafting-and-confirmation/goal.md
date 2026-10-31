---
title: "Goal: Phase 42: label-drafting-and-confirmation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "label drafting criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation"
    last_updated_at: "2026-10-01T12:59:08Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Closed every completion criterion"
    next_safe_action: "Offer each open gate a live Jev or Deem run, one yes at a time"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/042-label-drafting-and-confirmation/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-042-label-drafting-and-confirmation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 42: label-drafting-and-confirmation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fill the label gates of the eleven fillable child phases with labels the operator confirmed, so each scorer can print its verdict, and record the five features today's corpus cannot fill with what would unblock them.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only operator-confirmed labels count. A model may draft a label, but a scorer reads only rows the operator confirmed in chat, or rows settled by an arbiter the operator named in chat (parent D4; amended 2026-10-01 by ADR-001) |
| D2 | The two labelers never write a label file. Each prints draft JSONL, and only the session writes a label file, from the operator's answers or the delegated arbiter's output |
| D3 | No synthetic rows for the blocked five (020, 022, 024, 025 and 033). Each is recorded with the exact condition that would unblock it instead |
| D4 | A live Jev or Deem arm run needs a separate operator yes per feature and is not part of this phase's done. No scorer is run with `--jev` or `--deem` here |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Every fillable feature holds a labeling card naming its rubric, label values, row source and the exact label file its scorer reads, and every drafted row carries two blind drafts or a recorded reason with a compare split per feature
- [x] Every label file a scorer reads holds only values the operator confirmed in chat or an arbiter the operator named in chat settled, each traceable to that feature's decisions log
- [x] Every fillable feature's scorer prints its label gate on a zero-call run, or its shortfall is recorded with the exact reason
- [x] The five blocked features and 028 are recorded with their unblock condition, no synthetic row was drawn for any of the five, and no live arm ran without a separate operator yes
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this phase and the parent, and `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Spec authored | Done | 2026-10-01, docs only, from the four inventories under `scratch/evidence/` and the operator's decisions. Status In Progress, Level 2, priority P1 |
| Cards | Done | Seventeen cards under `scratch/evidence/`: eleven fillable cards, each read against its inventory, and six record cards (020, 022, 024, 025, 028, 033) |
| Row draws | Done | 003 50 rows, 029 95, 030 60, 032 40, 034 150, each exit 0 (`scratch/evidence/labels/gates.md`). 031's 36 rows were authored from 36 fix commits because the census mines 0 |
| Blind drafting | Done | Luna 6 max and SWE 2 max drafted every row blind (`scratch/drafts/`, private features in `~/.skilled/.labels/drafts/`). 12 drafts the parser missed were matched by hand (`scratch/evidence/labels/gates.md`, Single-draft rows) |
| Compare and confirmation | Done, by ADR-001 | Splits recorded per feature. A fresh Opus 5.5 medium arbiter, delegated by the operator and run alone, settled every row and the 035 and 031 content |
| Label files and zero-call gates | Done | Eleven features labeled, every gate run with no switch, exit 0: open on 023, 029, 030, 031, 032 and 035, recorded stops on 003, 026 and 034, 006 rates printed, 027 gate consulted only when switched (`scratch/evidence/labels/gates.md`) |
| Blocked records and closure | Done | Blocked records in `spec.md` and six record cards. Closure gates: `repair-derived.cjs --apply`, `validate.sh --strict` on this phase and `--recursive` on the parent, `check-goal.cjs` on this phase and the parent, outputs in `acceptance-criteria.md` AC-006 |

### Deviations and findings

| Item | Note |
|------|------|
| Operator decisions (2026-10-01) | "AI drafts, you confirm (Recommended)" and "After 041 lands (Recommended)" set the method and the start. The operator later chose "Send to both labelers (Recommended)" for the Pi-session excerpts of 003 and 026, and "Record them as blocked (Recommended)" for 020, 022, 024, 025 and 033. The operator asked to review everything in chat, not in files |
| Parent amendment (2026-10-01) | Parent D4 now reads "003, 006 and 019 to 035 stop at their label gate. Only operator-confirmed labels count", and the parent's binding table gained row 042. This phase's D1 carries that rule into the review pipeline |
| Planned state (2026-10-01) | At authoring, no card, draw, draft, answer, label file or gate run exists. The phase's five completion criteria are open, and the six acceptance rows are `Unmet` with the commands that will prove them |
| Method (2026-10-01) | Per feature: a card, a draw where rows are missing, two blind draft passes, a compare split, the operator's chat review in batches of 10 to 15 agreed rows and one question per disagreed row, a decisions log, the label file from the answers alone, then the zero-call gate run |
| Blocked five (2026-10-01) | 020 has 2 mode-alternative rows against a 30-row gate, 022 has 0 rows and no named transcript directory, 024 has 0 benchmark outputs, 025 has 0 regex-miss outputs, and 033's draw refuses with resolvable correctness 0 against the 25 per category it needs |
| 028 (2026-10-01) | It writes no labels of its own. It reads 027's report and follows `gate.label.passed`, so its unblock condition is 027's five confirmed gold reads |
| Private rows (2026-10-01) | 003's and 026's rows are the operator's own Pi conversation. The operator chose "Send to both labelers", so they go only to the two named labelers, and the label files that carry session content live outside the repository |
| Delegated arbiter (2026-10-01, ADR-001) | After 027's first chat review the operator answered "Let fresh opus 5.5 xhigh decide", then chose "Opus decides, you see a digest (Recommended)" for the remaining features. Later the operator said "dont use opus xhigh", "your using multiple" and "Instead use Opus medium". The session stopped every xhigh run, redid 027 under Opus medium (same five values), and ran one Opus medium arbiter at a time. This departs from parent D5 ("No Claude leaves") at the operator's direction |
| Rubric and label path (2026-10-01) | The operator adopted rubric A (`mimo-02-strict-v1`) for 006 and named `~/.skilled/.labels` for the private label files of 026, 029, 030 and 031 |
| Findings from the labels (2026-10-01) | 027's derivation reads only the singular `source` field, so it misses `sources` arrays and disagrees with the reads on 3 of 5. 11 of 20 live doc citations drifted (032). 006's lint catches 1 of 75 rule 5 failures. The 035 lexical screen caught 1 of 30 planted sentences. 006 has two stale rows in `005-compaction-recall-harness/goal.md` |
| Live arms out of scope (2026-10-01) | No scorer runs with `--jev` or `--deem` in this phase. Each feature's live run is offered after its gate passes and needs a separate yes (D4) |
| Cross-family review (2026-10-01) | DeepSeek V4.1 Flash on cli-pi reviewed the closure, exit 0. P0 fixed: 12 rows the compare split marks `single-draft` had no recorded reason. The parser skipped SWE's first row in seven drafts, and Luna rewrote four 006 ids. Both drafts exist for all 12, now matched in `scratch/evidence/labels/gates.md`, and no label changed. P1 fixed: the stale closure statement, the 0/12 verification summary, the summary's Completed date against an open AC-006, and the parent log row ADR-001 claimed. P2 fixed: ten decisions logs, not eleven, 026 added to AC-002, AC-007's labeler wording, and AC-003's inventory line, now `:141` |
| Recorded P2 (2026-10-01) | Kept as written, with the actual location here. The spec, plan and tasks name `scratch/decisions/` for the decisions logs, `scratch/compare/*.md` for the splits and `scratch/gates/*.txt` for the gate runs. The logs and the gate results are in `scratch/evidence/labels/` (`NNN-decisions.md` and `gates.md`), the splits are `scratch/compare/NNN-split.jsonl` with `summary.txt`, and `scratch/gates/` holds only `edge-cases.txt`. `spec.md` plans a 30-row 031 fixture, the scorer's minimum. 36 rows were delivered |
<!-- /ANCHOR:log -->

---
