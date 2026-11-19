---
title: "Implementation Summary"
description: "parent-skill-check now reads a hub's canary fixture, bound commands, drift guard and advisor from the repository that holds the hub, so a vendored project's sk-code hub passes from the Skilled checkout."
trigger_phrases:
  - "parent skill check target root implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/006-parent-skill-check-target-root"
    last_updated_at: "2026-11-19T10:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Split the checker root from the hub's data root and verified it"
    next_safe_action: "Commit the worktree branch and merge it to main"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
      - ".skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "c8b0f066-689e-476f-9b5c-582b761be607"
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
| **Spec Folder** | 006-parent-skill-check-target-root |
| **Completed** | 2026-11-19 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The parent hub check now audits a hub against that hub's own repository. Run from Skilled on the vendored Barter `sk-code` hub, it used to print 13 `5k-canary` failures and exit 1. It now prints `PASS: 5k-canary` and exits 0.

### parent-skill-check reads a hub's canary fixture, commands and guards from the hub's own repository

The checker has two roots now. `CHECKER_ROOT` is its own checkout and serves its code, the shared `sk-create-skill` contracts and the routing-shape debt ledger. `ctx.dataRoot` is the repository that holds the hub and serves the canary fixture, the bound commands, the drift guard and the advisor script. A hub in no repository, such as a temp test hub, uses the checker root, so those hubs keep their results.

A hub repository with no canary fixture reports that leg as not applicable and names the repository. It never borrows the checker repository's fixture.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modified | Split the two roots and route each lookup to one |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | Modified | Four tests for a hub in another repository, and `runChecker` clears an inherited commands override |
| `.skilled/commands/doctor/scripts/README.markdown` | Modified | Say which root each lookup uses |
| `.skilled/skills/system-skilled-doctor/changelog/v1.1.8.0.md` | Created | Changelog entry |
| `.skilled/skills/system-skilled-doctor/SKILL.md` | Modified | Version 1.1.8.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The reproduction ran first from the worktree checker and printed 67 PASS lines, 13 failures and exit 1. A baseline of all 7 Skilled hubs and the 114 checker tests followed. After the fix, the new tests ran against the unfixed checker, restored from `HEAD`, and all failed. The old failures were `FAIL: 5k-canary: "demo-alpha"` and `"demo-beta"`. Against the fixed checker they passed, and the full suites ran last.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fall back to the checker root only when no sentinel sits above the hub | A temp hub has no repository, and the existing tests rely on it reading the checker's tree |
| Keep the routing-shape debt ledger keyed to the checker root | The ledger file ships with the checker's code, and its keys name the checker repository's skills |
| Keep relative hub paths resolved against the checker root | That is how the command-line argument is defined, and the hub's repository is not known until the path is resolved |
| Leave the `repo-root-hub` checks unchanged | They read only the hub's own registry and tree and never used the old root |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Barter `sk-code` reproduction | Before: 67 PASS, 13 FAIL, exit 1. After: 68 PASS, `PASS: 5k-canary`, exit 0 |
| Barter project untouched | Not provable by git status. A concurrent session committed three Barter commits at 10:06 to 10:07, moving `HEAD` from `0382c01` to `a97e55d`. This work only read the project. Check 4b printed `registry declares no lexical modes`, so the checker never ran Barter's advisor. A `find -newer` scan for `__pycache__`, `.pyc`, `.db` and `.state` paths found one hit, the `.state/completion-sentinel` folder. Only its timestamp changed, at 10:08:35, and every file in it predates this work |
| Barter's own checker on the same hub | Same PASS, FAIL and WARN lines as the fixed Skilled checker, so the root was the only difference |
| 7 Skilled hubs | Every PASS, FAIL and WARN line identical before and after. All exit 0 |
| `node --test parent-skill-check-*.test.cjs` | 118 pass, 0 fail, up from 114 |
| `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` | 1336 pass, 0 fail, exit 0 |
| Negative control | The 4 new tests fail on the unfixed checker. The fourth, added after review, fails because the old checker passes 4a from its own drift guard |
| Independent review | A fresh Opus reviewer approved with no blockers. Its two should-fix findings (the wrong limitation text, no test for 4a and 4b on the hub's repository) and two nits (a stale comment, an inherited override in `runChecker`) are fixed |
| `check_changelog_shape.py` on v1.1.8.0 | PASS |
| `sk-skill-check.cjs` on `system-skilled-doctor` | NO FINDINGS, 1 UNKNOWN for the advisor backend, which does not run in the worktree |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The data paths still spell `.skilled`.** A hub repository that ships only `.opencode` is found as the data root, but its `.skilled` paths do not exist. Before this change those paths read the checker's own tree. Now 5k-canary reports not applicable, 3k finds no bound command and reports nothing, and a hub with lexical modes fails 4a (drift guard missing) and 4b (advisor script not found). Add a `.skilled` link in that project, or build the data paths from `findSourceRoot`, if it needs those legs.
2. **A relative hub path resolves against the checker's checkout.** This predates the change. The README row says so: pass an absolute path to audit a hub in another repository.
<!-- /ANCHOR:limitations -->

---
