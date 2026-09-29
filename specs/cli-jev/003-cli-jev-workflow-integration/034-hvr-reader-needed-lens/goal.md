---
title: "Goal: Phase 34: hvr-reader-needed-lens"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hvr reader-needed lens goal"
  - "hvr_reader_lens completion criteria"
  - "reader-needed lens keep rule"
  - "voice category flag verdict"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/034-hvr-reader-needed-lens"
    last_updated_at: "2026-09-29T16:00:00Z"
    last_updated_by: "spec-author-leaf"
    recent_action: "Authored the Planned phase for R22 from the round-2 and round-3 research"
    next_safe_action: "Build to the label gate in number order, released 2026-09-29 (parent goal D3)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/034-hvr-reader-needed-lens/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/034-hvr-reader-needed-lens/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-034-hvr-reader-needed-lens"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 34: hvr-reader-needed-lens

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle offline, with one verdict per backend, whether a Jev or Deem `noul` flags synonym cycling, significance inflation and false ranges in skill-doc sections better than the HVR scanner's floor and the standard's lexical rules, through one read-only script beside the unchanged scanner, with a zero-call default that prints the census first.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `hvr_reader_lens.py`, `hvr-reader-lens-labels.jsonl` and `tests/test_hvr_reader_lens.py` in the voice packet's `scripts/`, plus the parent D6 docs through sk-doc. `hvr_scan.py`, its test, its fixtures and the standard never change |
| D2 | Labels: 150 seeded rows from flagged sections of 5 to 80 lines, 50 per category, false ranges and significance inflation up to half from their comparator's candidates. The operator labels every row `yes` or `no`, never a model. Until 150 exist every run prints `stop: fewer than 150 labeled rows` |
| D3 | Each category's baseline is the better of flag-nothing (the scanner's floor) and its lexical rule, where the standard gives one. Tracked committed docs only, never `.env` or a draft |
| D4 | Keep rule per column: coverage of at least 90 percent in every category, `kill (precision)` when precision is below 0.6 in every category, and `keep` when at least two categories each pass precision at least 0.8, a 10-point gain, a one-sided sign test below 0.05 and a Jev flip rate of at most 0.10 over 3 reruns (a Deem `noul` holds by its commit pair). Fewer than two categories with headroom and power prints `stop: fewer than 2 categories can pass`. Offline only |
| D5 | Jev first, else Deem. A Jev arm runs behind `--jev` after the identity line, `jev --version` printing `jev 0.6.2` and `jev auth status --provider P` exiting 0. A Deem arm runs behind `--deem` after `cli-deem health` passes. A failure prints one skip line and changes nothing. One `--provider P`, no key in any file, no failover |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py` exits 0, prints flagged sections and candidates per comparator and either `stop: fewer than 150 labeled rows` or each category's baseline and headroom line, and stub `jev` and `cli-deem` first on `PATH` log zero calls
- [ ] With `--deem --out <dir>` and a stub health reporting backend `stub` it prints `deem arm skipped: stub backend`, and with `--jev --out <dir>` and a stub `jev` whose `auth status --provider official` exits 3 it prints the identity line, then `jev arm skipped: no credential`. Each exits 0 with its other output byte-identical to the default run
- [ ] `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py` exits 0 and prints `ALL PASS` with at least 18 checks, and `test_hvr_scan.py` still prints `ALL PASS`
- [ ] After the operator labels 150 rows, each backend whose gate passed printed one `verdict <backend>:` line of `keep`, `kill (precision)` or `stop (<reason>)` from a live `--out` run whose `calls.jsonl` holds `wallMs` and `exitCode` on every line, or the zero-call run printed `stop: fewer than 2 categories can pass`
- [ ] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script returns no match, `git diff --stat` on `hvr_scan.py` is empty, `git status --porcelain` is the same before and after each run and `validate_document.py` exits 0 on each changed skill doc
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Spec authoring | Done | 2026-09-29, docs only, from `../004-deep-research-expansion/research/research.md:711-729` (R22) and `:124` (K17), and `../007-classifier-deep-research/research/research.md:97` (C13), `:429`, `:471`, `:927`, `:1045-1047` and `:1076`. Status Planned |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent goal D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Pending | Nothing built |

### Deviations and findings

| Item | Note |
|------|------|
| Seam checked | `hvr_scan.py:17-21` (the reader-needed list and the floor) and `:26` (`--json`) resolve at the worktree HEAD on 2026-09-29 |
| Citation corrected | K17 says the scanner loads the standard at `hvr_scan.py:51-53`. Those lines are a section banner. The path constant sits at `:55-57` and `load_rules` at `:192`, so `:51-53 -> :55-57` |
| Rough census | A scratch count on 2026-09-29 over the scanner's own functions: 7,889 tracked skill `.md` files, 103,594 sections, 50,999 flagged, 40,946 flagged of 5 to 80 lines, of which 2 hold a listed significance phrase and 786 a `from X to Y` construction. The draw design follows from it |
<!-- /ANCHOR:log -->
