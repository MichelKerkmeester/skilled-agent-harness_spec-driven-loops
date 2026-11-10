---
title: "Goal: Phase 5: inferred-confirmations"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "inferred confirmations goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/006-frontend-upstream-proposals/005-inferred-confirmations"
    last_updated_at: "2026-11-03T08:33:57Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ae286a84-7880-4ce7-a5fe-7d1335e09c78"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: inferred-confirmations

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Settle proposal ranks 10 to 13 with evidence: confirm or refute each inferred defect in Skilled's tooling with one saved run, and fix only what the run confirms.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No rank's code changes before its confirming run is saved. |
| D2 | A refuted rank is dropped with its evidence, and its files stay unchanged. |
| D3 | Each shipped fix carries a test that fails without it, and each rank lands as its own commit. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] This phase's `decision-record.md` holds four verdicts, one per rank 10 to 13, each citing a run saved in this phase's `scratch/`
- [ ] Every shipped fix has a test that fails when the fix is reverted and passes with it
- [ ] If alias matching changed, router reach at concurrency 2 prints `outranked=  0` and `wrong-hub=  0` on every hub
- [ ] `git diff --stat` for the phase lists no file belonging to a refuted rank
- [ ] Each touched script's own test suite exits 0 after the last edit
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase planned | Done | Planning docs authored 2026-11-03 |
| T001 to T005 confirming runs and verdicts | Done | `scratch/rank1{0,1,2,3}-*.txt`, four ADRs in `decision-record.md` |
| Rank 10 | Done | `a71daa9605`, `scratch/rank10-after.txt` |
| Rank 11 | Done | `8babc9421a`, `scratch/rank11-reach.txt` |
| Rank 12 | Done | `2823435107`, `scratch/rank12-after.txt` |
| Rank 13 | Dropped | Refuted, ADR-004; no file changed |
| Verification | Done | `scratch/rank1{0,1,2}-revert-test.txt`, `scratch/final-suites.txt` |

### Deviations and findings

| Item | Note |
|------|------|
| Gold-corpus pin | `compiled-route-admission.test.cjs` fails `84 !== 96` on the pinned gold-scenario count. It fails identically at merge-base `a5105fb512`, so it predates this branch. |
| Version bump and remint | Bumping `sk-create-skill` to 1.10.1.0 staled the sk-doc manifest until the commit hook re-minted it; the manifest suite failed 16 tests until then. |
| sk-design tie defect | The rank 11 build reported `compareText is not defined` at `009-sk-design/lib/canary-router.cjs:257` when two intents of one mode tie; `resolveRoute` falls back to legacy. Out of scope, not fixed. |
| Plan-only save | A plan-only save does not say that it skipped the continuity fields (ADR-004). Out of scope. |
| system-spec-kit changelog | Deferred: main already holds v2.12.30.0 and an uncommitted v2.12.30.1, so the rank 12 entry takes its version at merge. |
<!-- /ANCHOR:log -->
