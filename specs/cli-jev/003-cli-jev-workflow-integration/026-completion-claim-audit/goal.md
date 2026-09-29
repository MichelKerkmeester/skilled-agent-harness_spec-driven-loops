---
title: "Goal: Phase 26: completion-claim-audit"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "completion claim audit goal"
  - "score-completion-claims completion criteria"
  - "completion claim keep rule"
  - "completion claim label gate"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit"
    last_updated_at: "2026-09-29T17:00:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the Planned goal from research item R4"
    next_safe_action: "Released 2026-09-29 (parent goal D3): build per plan.md in number order"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/026-completion-claim-audit/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-026-completion-claim-audit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 26: completion-claim-audit

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Count with zero calls how often the completion sentinel's claim regex fires wrongly or misses a claim on turns the operator labels, and settle offline, on a counted number per backend, whether a Jev or Deem noul reads a completion claim more accurately than that regex.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `runtime/scripts/completion-claim-audit/score-completion-claims.mjs`, `runtime/tests/completion-claim-audit.vitest.ts` and its fixtures directory, one scripts README row and, per parent D6, system-spec-kit's `SKILL.md`, README, changelog, catalog and playbook through sk-doc. The sentinel, both Stop adapters, `.claude/settings.json` and phase 003's fixture are unchanged |
| D2 | The census imports `detectCompletionClaim` unchanged and prints counts and ids, never row text |
| D3 | The operator labels each turn `yes` or `no` for a completion claim, and no model writes a label. Below 30 labeled rows, or 5 of either class, the run prints its `stop:` line, and the phase may close there |
| D4 | Spec section 4's Keep Rule, per column, in order: 90 percent coverage, `kill` when p_loss is below 0.05, a 10-point gain over the regex, p_win below 0.05 and, for Jev, a flip rate of at most 0.10 over three reruns. Deem prints `flips: n/a (commit pair)`. A regex above 0.90 prints `no headroom` |
| D5 | Jev first, then Deem, each only on its own switch and checks, with no failover. Jev also needs `--accept-payload`, since the rows are the operator's conversation. A `keep` serves nothing: a detector at turn end needs a later phase, a named reader and the operator's call |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] From `.skilled/skills/system-spec-kit/runtime`, `node scripts/completion-claim-audit/score-completion-claims.mjs --rows <phase 003 fixture>` exits 0, prints `rows: 50 fires: 4` and a `stop:`, `no headroom` or `planned calls:` line, and stub `cli-deem` and `jev` first on `PATH` log zero calls
- [ ] With a stub `cli-deem health` reporting backend `stub`, `--deem` prints `deem arm skipped: stub backend`, and `--jev` without `--accept-payload` prints `jev arm skipped: payload not accepted`. Each exits 0 with the rest of stdout byte-identical to the census
- [ ] From the same directory, `npx vitest run tests/completion-claim-audit.vitest.ts` exits 0 with at least 16 passed and 0 failed
- [ ] Either the census printed a `stop:` line below 30 labeled rows, or one live `--deem --out <dir>` run printed a `verdict deem:` line and wrote `calls.jsonl` lines each holding `wallMs`, `exitCode`, `modelId`, `modelCommit` and `sourceCommit`
- [ ] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script prints nothing, no row text appears in stdout, and `git status --porcelain` is the same before and after each run
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, this goal and a Planned `implementation-summary.md`, authored 2026-09-29 from R4 and open question 9 in `../001-deep-research/research/research.md` sections 11 and 12, and the carried table in `../007-classifier-deep-research/research/research.md` section 12 |
| Seam check | Done | At the worktree HEAD `completion-evidence-sentinel.cjs:60-63`, `:64`, `:70`, `:84`, `:113-119` and exports `:553-578`, `completion-evidence-stop.cjs:118-119` and `:132-139` and `.claude/settings.json:172-177` hold the text R4 cites. No line moved |
| Census inputs | Done | This leaf ran the exported `detectCompletionClaim` on the `raw_text` of phase 003's 50 rows on 2026-09-29 and printed counts only: 50 rows, 4 fires, 0 labeled. The main checkout's advisory log held 590 lines, 533 naming a missing `implementation-summary.md`, and no turn text |
| Release | Done | 2026-09-29: the operator's "Bind and release" amended parent goal D3, which releases 019 to 035. Builds run in number order, and disjoint builds may run in parallel |
| Label gate | Pending | No claim label exists |
| Build | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| Phase 003's claims column was not built | 003 planned R4's zero-call column as its T028 and recorded it as not built. This phase measures the claim with its own script and leaves 003's scorer and fixture byte-identical |
| Finding: 4 fires cap the false-fire count | On 003's rows false fires can be counted on at most 4 turns, so the report gives counts, not a rate. A rows file of real Stop turns needs a transcript directory the operator names |
| UNKNOWN: the second pattern copy | The sentinel says it mirrors the runtime hook's private pattern verbatim (`:60-63`), and a search on 2026-09-29 found no other copy. A later regex change must locate it first |
<!-- /ANCHOR:log -->
