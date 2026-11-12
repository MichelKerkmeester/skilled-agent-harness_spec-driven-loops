---
title: "Implementation Summary"
description: "Three reply rules retired and their unique clauses folded into communication.md and uncertainty-and-honesty.md, so Gate 6 loads two files and the reply set is 14 KB smaller."
trigger_phrases:
  - "reply rule pruning implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents-md/repo-rule-operations/005-reply-rule-pruning"
    last_updated_at: "2026-11-12T09:00:00Z"
    last_updated_by: "generate-context"
    recent_action: "Retired three reply rules and republished the release"
    next_safe_action: "Run the compliance script over later sessions"
    blockers: []
    key_files:
      - ".skilled/repo-rules/communication.md"
      - ".skilled/repo-rules/uncertainty-and-honesty.md"
      - "AGENTS.md"
      - "REPO RULES.md"
      - ".skilled/changelog/skilled/v4.0.2.1.md"
    session_dedup:
      fingerprint: "sha256:ae9e13b5ff8fbd81bbf42c6ae86350b6584454ff47ad62ef81b41d8a245e7c3c"
      session_id: "scaffold-005-reply-rule-pruning"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "d2b7b083-7b6e-461a-bb59-532bdecb0369"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-12T09:00:00Z"
      locatorKind: "transcript_path"
      version: 1
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-reply-rule-pruning |
| **Completed** | 2026-11-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The reply rule set is two files. Gate 6 used to name five, and three of them mostly repeated rules you already load. Those three are gone, and the reply set dropped from 39,253 bytes to 25,341.

### Retire three low-value reply rules and fold their unique clauses into the surviving rules

You now load `communication.md` before a reply and `communication-handoff.md` before ending a turn. `communication.md` took the sentence and word rules, the three punctuation bans, the one-recommendation rule, the path before a long stretch and the rule that a synthesis carries its findings. `uncertainty-and-honesty.md` took the ban on citing a rule you cannot point to and the honest decline.

The clause ledger, so nothing is proposed again without its history:

- **Moved to `communication.md`**: one idea per sentence, stated relations, named mechanisms, plain words, no terse machine register, identifiers only where the reader acts, the punctuation bans, concise is not compressed, verdict by analysis, recommend one path, required apart from optional, stated assumptions, the ambiguous-request answer, the announced swap of a request, the path and time estimate before a long stretch, estimates never gate, and the synthesis rule.
- **Moved to `uncertainty-and-honesty.md`**: never cite a constraint you cannot point to, and a decline names its real reason.
- **Dropped because another home already holds it**: the filler-warning clause (`communication.md` section 3), the first honest report (`evidence-and-proof.md` section 10), naming the failure a best practice prevents (the `AGENTS.md` Restraint Signals table), and the limit on questions (`uncertainty-and-honesty.md` section 1 and `communication-handoff.md` section 4).
- **Kept after a second pass**: the reader triage step, as one sentence in `communication.md` section 2.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/repo-rules/answer-the-actual-request.md` | Deleted | Retired |
| `.skilled/repo-rules/communication-prose.md` | Deleted | Retired |
| `.skilled/repo-rules/communication-decisions.md` | Deleted | Retired |
| `.skilled/repo-rules/communication.md` | Modified | Holds the merged reply rule |
| `.skilled/repo-rules/uncertainty-and-honesty.md` | Modified | Holds the constraint and decline clause |
| `.skilled/repo-rules/communication-handoff.md` | Modified | Section pointers follow the merge |
| `AGENTS.md` | Modified | Gate 6 names two reply rules |
| `REPO RULES.md` | Modified | Ten trigger rows and ten index rows |
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/measure-rule-compliance.py` | Modified | Checks key to `communication.md` |
| `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/rule-experiment.py` | Modified | Reply rule set is `communication.md` |
| `.skilled/skills/sk-doc/scripts/tests/test_measure_rule_compliance.py` | Modified | Fixture follows the script |
| `.skilled/skills/sk-doc/scripts/tests/test_rule_experiment.py` | Modified | Fixture follows the script |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Modified | Regenerated |
| `.skilled/skills/sk-doc/sk-create-repo-rule/references/creation-standards.md` | Modified | Guard row merged |
| `.skilled/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/rule-loading-experiments/card-generator-sync.md` | Modified | Card count is 10 |
| `.skilled/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/rule-loading-experiments/card-arm-run.md` | Modified | Reply-rule miss definition |
| `.skilled/skills/sk-doc/sk-create-repo-rule/changelog/v1.1.8.0.md` | Created | The packet's changelog entry |
| `.skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md` | Modified | Version 1.1.8.0 |
| `.skilled/skills/sk-doc/sk-create-repo-rule/references/agents-md-integration.md` | Modified | Retire path performed once |
| `.skilled/changelog/skilled/v4.0.2.1.md` | Modified | Release entry covers the retirement |
| `README.md` | Modified | Rule counts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran on `main` at the operator's choice. It was pushed, all 19 CI runs on the push passed, and the `v4.0.2.1` tag and release were republished on the new head at the operator's request. The merged text went into the two surviving rules first, then the retire order ran: Gate 6 pointers, index rows, trigger rows, files. The corpus checker and both pytest files were run before the first edit and again from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Retire all three files | The operator chose it after a read of the corpus and a compliance run over 68 Claude Code sessions, where only the semicolon ban showed an effect: 10.7% of replies after the rule was read against 33.3% in sessions that never read it |
| Keep `communication-handoff.md` separate | It holds the status contract `AGENTS.md` section 10 points at and the per-runtime question-tool table |
| Bump `communication.md` to 1.5.0.0 | The file took two other rules' content, which is more than a fourth-segment wording change |
| Repair the two experiment inputs in place | The operator asked for the gaps closed, and the playbook scenarios run those files. The 007 current arm now rebuilds the long wording because the short wording is the live rule, and a `note` key in the file says so |
| Rewrite the build scenario from observed output | Three of its expectations were stale before this packet: the cards arm no longer fails check 2, one skill file is linked instead of two, and `§6` matched once |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `check-repo-rules.cjs` before | PASS, `files=13 triggerRows=13 indexRows=13`, `RESULT: PASSED (11/11 checks)` |
| `check-repo-rules.cjs` after | PASS, `files=10 triggerRows=10 indexRows=10`, `RESULT: PASSED (11/11 checks)` |
| pytest on the two script test files | PASS, `20 passed` before and after |
| `node --test` on the four `agents-md` doctor suites | PASS, 39, 35, 31 and 37 tests, `fail 0` each |
| `agents-md-manifest.cjs --check` | PASS, `44 sections, 30 pins, derived matches AGENTS.md` |
| `agents-md-check.cjs` | PASS, `STATUS=OK rows=12 findings=0 unknown=0` |
| `rule-experiment.py build` on both arms files | PASS, four `built <arm>` lines, exit 0, and all four templates print `RESULT: PASSED (11/11 checks)` |
| CI on the pushed commit | PASS, 19 runs, all `success` |
| Changelog shape, voice and document gates on both entries | PASS, `pass=1 fail=0`, 0 hard blockers, 0 issues |
| Ambiguous edit with `§1` | PASS, `expects one match of '§1', found 2`, exit 1 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The executor scenarios were not run.** RRX-002 and RRX-003 spend executor quota, so only their build and byte steps were checked here.
2. **The resident reply-card arm is no longer over budget.** `AGENTS.md` plus the two reply cards is 31,394 bytes against 32,768, so the reason the pilot dropped that arm no longer holds. The arm stays unbuilt.
3. **The merge is not measured yet.** Whether the merged rule keeps the semicolon effect needs a later `measure-rule-compliance.py` run over sessions that start after this change.
<!-- /ANCHOR:limitations -->

---
