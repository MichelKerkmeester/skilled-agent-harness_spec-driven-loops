---
title: "Goal: Phase 32: citation-drift-scan"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "citation drift scan goal"
  - "cite-drift-scan completion criteria"
  - "citation drift keep rule"
  - "skill doc citation drift verdict"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan"
    last_updated_at: "2026-09-29T15:30:00Z"
    last_updated_by: "spec-author-leaf"
    recent_action: "Authored the Planned phase for R24 from the round-3 research"
    next_safe_action: "Build to the label gate in number order, released 2026-09-29 (parent goal D3)"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-032-citation-drift-scan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 32: citation-drift-scan

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle offline, with one verdict per backend, whether a Jev or Deem `noul` finds drifted `file:line` citations in skill docs better than a zero-call identifier-overlap check, through one read-only sk-doc script whose default run makes zero model calls and prints the census and dead count first.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `cite-drift-scan.mjs` and `cite-drift-labels.jsonl` in `.skilled/skills/sk-doc/shared/scripts/`, new `scripts/tests/test-cite-drift-scan.mjs`, two README rows and, per parent D6, sk-doc's `SKILL.md`, README, changelog, catalog and playbook through sk-doc. No validator and no cited file changes |
| D2 | Labels: 40 rows drawn with a recorded seed at a recorded commit, read with `git show`. 20 live citations the operator labels, 20 constructed by moving the window 60 lines, labeled by construction. No model writes a label. Until 40 exist every run prints `stop: fewer than 40 labeled rows` |
| D3 | The baseline is the better of flag-nothing and identifier overlap on identical rows. Dead citations are settled with no model. Only tracked files are read, never `.env` |
| D4 | Keep rule per column, in order: at least 90 percent of rows measured, precision at least 0.8 else `kill (precision)`, a 10-point gain, a one-sided sign test below 0.05 and a Jev flip rate of at most 0.10 over 3 reruns (a Deem `noul` holds by its commit pair). Baseline above 0.90 prints `no headroom`, and under 5 winnable rows `underpowered`. Offline only |
| D5 | Jev first, else Deem. A Jev arm runs behind `--jev` after the identity line, `jev --version` printing `jev 0.6.2` and `jev auth status --provider P` exiting 0. A Deem arm runs behind `--deem` after `cli-deem health` passes. A failure prints one skip line and changes nothing. One `--provider P`, no key in any file, no failover |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` exits 0, prints `citations=` and `dead=` and either `stop: fewer than 40 labeled rows` or a `baseline:` and headroom line, and stub `jev` and `cli-deem` first on `PATH` log zero calls
- [ ] With `--deem --out <dir>` and a stub health reporting backend `stub` it prints `deem arm skipped: stub backend`, and with `--jev --out <dir>` and a stub `jev` whose `auth status --provider official` exits 3 it prints the `jev` path and provider, then `jev arm skipped: no credential`. Each exits 0 with its other output byte-identical to the default run
- [ ] `node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` exits 0 with at least 18 passed and 0 failed
- [ ] After the operator labels 20 live rows, each backend whose gate passed printed one `verdict <backend>:` line of `keep`, `kill (precision)` or `stop (<reason>)` from a live `--out` run with a `calls.jsonl` holding `wallMs` and `exitCode` on every line, or the zero-call run printed `no headroom` or `underpowered`
- [ ] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script returns no match, `git status --porcelain` is the same before and after each run and `validate_document.py` exits 0 on each changed sk-doc doc
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
| Spec authoring | Done | 2026-09-29, docs only, from `../007-classifier-deep-research/research/research.md:844-863` (R24), `:460-480` (validators), `:1030`, `:1047`, `:1079` and `:1173`, plus swe-06's and mimo-08's lineage iterations. Status Planned |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent goal D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Build | Pending | Nothing built |

### Deviations and findings

| Item | Note |
|------|------|
| Seam reopened | R24's seam row says nothing checks skill-doc citations. Reopened 2026-09-29: two neighbors check less. `check-ac-coverage.sh:437` resolves a `file:line` only in spec-folder acceptance criteria, and `validate_catalog_package.py:494` strips the line range and checks the path only. Neither reads whether the line supports its sentence, so the seam stays "none" |
| Cite corrected | swe-06 cites `validate_document.py:1520-1537` for the exit contract. Today it is documented at `:18-21` and set at `:1691-1692` |
| Two switches | swe-06's single `--cite-backend deem\|jev\|none` becomes `--jev` and `--deem` (research row 80) |
<!-- /ANCHOR:log -->
