---
title: "Implementation Summary"
description: "The skilled alignment check of the merged worktree 474 change found 25 findings, 1 P0, 9 P1 and 15 P2. The P0 was this session's stale packet metadata; the main real gaps are an unpinned routing corpus row and skill docs that never describe the new behavior. Nothing was fixed."
trigger_phrases:
  - "skilled alignment check implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/015-skilled-alignment-check"
    last_updated_at: "2026-11-19T08:15:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Ran /local-skilled-alignment over the merged branch and triaged its report"
    next_safe_action: "Operator decides which findings become fix work"
    blockers: []
    key_files:
      - "evidence/report.md"
      - "evidence/findings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-skilled-alignment-check |
| **Completed** | 2026-11-19 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The alignment check of the merged advisor change is on record, with 25 findings: 1 P0, 9 P1 and 15 P2. The code passed its own gates, but the change left the routing corpus pin, the skill's docs, its routing metadata and its changelog behind.

### Phase 15: skilled-alignment-check

The run checked the 34 code files and 176 spec files of the twenty first-parent commits on the worktree 474 branch against eleven surfaces. You can read the full report in `evidence/report.md`. The triage below says which findings this change caused, which were already there, and which the critic overturned.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `evidence/report.md`, `findings.json`, `fix-plan.md`, `scope-summary.json`, `overturned.json`, `probes.json` | Created | Copies of the run's output |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The confirm workflow ran step by step on 2026-11-19, with run folder `~/.local/state/local-skilled-alignment/Skilled/20261119T054734Z`. The scope printed `files=220 commits=20`. The battery printed `pass=51 fail=2 cannot_run=0 not_applicable=8`. The four lanes ran on `opencode-go` and returned in 940 to 2,114 seconds. Lane D's 11 probes scored 5 pass and 6 fail. The critic returned in 1,386 seconds and upheld 5 failed probes. `aggregate-findings.cjs` printed `STATUS=OK ... findings=25 P0=1 P1=9 P2=15 ... outside_scope=9 overturned=2 problems=1`. The prune kept 10 runs.

The lane and critic prompts follow the workflow's lanes and critic steps. The conductor built them with two scratch scripts, because the workflow assigns that step to the conductor and ships no builder.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scope checkpoint: approved, all fired surfaces | Operator answer at the scope checkpoint |
| Lane preset: `opencode-go` | Operator answer at the lane checkpoint, offered beside `codex`, `vibe-deepseek` and battery-only with the parent D2 and D3 tension named |
| Target the kept branch with base `4bf79332378` | A range ending at the merge commit resolves empty in first-parent mode, and `HEAD` against `origin/main` holds only the unpushed spec commit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Triage

"This change" means the merge `57d3f5d9159` caused the gap. Rows marked checked were confirmed in the repository during triage. The others rest on the lane or critic evidence in `evidence/findings.json`.

| ID | Sev | Where | Cause | Triage |
|----|-----|-------|-------|--------|
| BAT-02 | P0 | packet 016 `graph-metadata.json` | This session: the parent `spec.md` edits that added phases 015 and 016 left the derived metadata stale. Checked | Fixed in this session by `repair-derived.cjs`, see Checks |
| X-02 | P2 | packet 016 `description.json` | Pre-existing at the merge base, the same validation row | No longer flagged after the repair, but `description.json` still keeps the older wording, which differs from the `spec.md` Problem Statement. Reword it in a later save |
| A1 | P1 | `routing-accuracy/labeled-prompts.jsonl` | This change: row `rr-paste-208` added without recapturing its sha256 pin, so the blocking corpus gate mismatches. Checked: the holdout pin also mismatches, at base and head, and that CI step already failed on main before the merge | Fix: recapture both pins |
| B-01 | P1 | `hooks/skill-advisor-hook.md:55` | This change: the hook reference describes neither the pasted-reply strip nor route receipts | Fix |
| C-01 | P1 | `hooks/skill-advisor-hook.md:67` | Split: the shim still returns `{}` on its own errors, while a handler crash now returns the outage line. Phase 016's critic refuted the same claim as L1-1 | Fix the wording to name both paths |
| D-01 | P1 | `hooks/claude/user-prompt-submit.ts:580` | This change: the skip gate reads the raw prompt | Covered by phase 014, decision D4 |
| PRB-01, PRB-02, PRB-03, PRB-04, PRB-05 | P1 | advisor routing | Upheld probe failures: five advisor-work prompts route to `sk-code`, `sk-prompt`, `cli-deepseek-harness` or nothing. P02 and P05 ask for code work, so `sk-code` may be the right route | Fix via D-02, after the operator decides the expected route |
| D-02 | P2 | `system-skill-advisor/graph-metadata.json:66` | This change: none of the five new feature names is in the skill's routing metadata | Fix |
| X-01 | P2 | `ENV-REFERENCE.md:159` | This change: the route receipt store is a second, undocumented user of `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` | Fix |
| B-02 | P2 | `runtime/bench/README.md:48` | This change: the bench README omits the follow-up routing logs | Fix |
| B-03 | P2 | `feature-catalog/feature-catalog.md:20` | This change: no catalog entry for the new capabilities | Fix |
| B-04 | P2 | `claude-user-prompt-submit.md:87` | This change: the playbook cannot tell a handler crash from an outage | Fix |
| C-02 | P2 | `system-skill-advisor/README.md:84` | This change: How It Works omits both new behaviors | Fix |
| C-03 | P2 | `README.md:201` | This change: the root routing section states the 0.8 rule without the floored-route hold | Fix |
| C-06 | P2 | `changelog/skilled/v4.1.0.0.md:186` | This change: no release entry names the advisor changes | Operator decision: which release entry |
| C-07 | P2 | `system-skill-advisor/SKILL.md:5` | This change: no version bump or component changelog | Operator decision: version and entry |
| C-05 | P2 | `tests/fixtures/README.md:49` | Mixed: this change added a row in the file's existing path style, which the reference checker reads from `tests/fixtures/`. Checked: both test files exist under `tests/` | Fix with the neighbor rows |
| A3 | P2 | `user-prompt-submit.ts:411` | This change: one extra clock read per briefed turn | Accept unless measured: no timing shows a cost |
| A4 | P2 | `user-prompt-submit.ts:441` | This change: the confirmed-session rule is written three times | Accept: a shared helper is optional |
| BAT-01 | P2 | `README.md:674` | Pre-existing: the critic checked that the README and the checker are byte-identical at base and head | Fix separately |
| C-04 | P2 | `README.md:674` | Pre-existing, the same row as BAT-01 | Fix separately |
| A2 | P2 | `user-prompt-submit.ts:604` | Refuted: phase 011 records this write-before-delivery window as an accepted limitation | None |
| D-03 | P2 | `hooks/skill-advisor-hook.md:57` | Duplicate of B-01 | None |
| P11 | n/a | probe | Held: the critic called it pre-existing, and the aggregator ignored that override because it names a probe | None |

### Checks

| Check | Result |
|-------|--------|
| `resolve-scope.cjs` | `STATUS=OK`, 34 non-spec files, equal to the merge diff |
| `run-battery.cjs` | exit 1, `pass=51 fail=2 cannot_run=0 not_applicable=8` |
| `aggregate-findings.cjs` | exit 0, `findings=25 P0=1 P1=9 P2=15` |
| Run folder holds no `applied.json` | PASS, `ls $OUT \| grep -c applied` printed 0 |
| S14 row rerun after `repair-derived.cjs --apply` | PASS, `validate-packet.cjs` on packet 016 printed `0 error rules (validate.sh exit 0)` |
| `ls evidence` | `findings.json`, `fix-plan.md`, `overturned.json`, `probes.json`, `report.md`, `scope-summary.json` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One model family.** The lanes and the critic all ran DeepSeek V4.1 Flash. The rows marked checked were confirmed separately, and the rest are one lens.
2. **Ten spec probe scripts went unreviewed.** The critic lists ten probe scripts under the routing-and-scoring 008 review folders that no lane read. Phase 013 already repaired their headers.
<!-- /ANCHOR:limitations -->

---
