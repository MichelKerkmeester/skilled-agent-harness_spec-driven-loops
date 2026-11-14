---
title: "Implementation Summary"
description: "The `sk-code-ci` routing keywords are one set of 72 in all three copies, and the router-sync guard fails when one copy changes alone. Live routing reads the same JSON as before, so no request routes differently."
trigger_phrases:
  - "ci vocabulary single source implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/007-ci-vocabulary-single-source"
    last_updated_at: "2026-11-14T17:57:39Z"
    last_updated_by: "generate-context"
    recent_action: "Aligned both CI keyword rows to hub-router.json and closed the packet"
    next_safe_action: "Await the operator's decision on pushing or merging the branch"
    packet_purpose: "Purpose: The three copies hold one keyword set, the one in `hub-router.json`, and the router-sync guard fails when they differ again."
    blockers: []
    key_files:
      - "specs/sk-code/hub-architecture/007-ci-vocabulary-single-source/implementation-summary.md"
      - ".skilled/skills/sk-code/hub-router.json"
      - ".skilled/skills/sk-code/sk-code-ci/ROUTER.md"
    session_dedup:
      fingerprint: "sha256:57fa0903ef5448de942f2d9e1b228315bd63b4adbfc39b7184425341146b1e5f"
      session_id: "scaffold-007-ci-vocabulary-single-source"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "4f13b979-22c2-4cb8-9c32-6053ecd082ab"
      workspace: "/Users/michelkerkmeester/worktrees/public/379-sk-code-audit-remediation"
      savedAt: "2026-11-14T17:57:39Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-ci-vocabulary-single-source |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `sk-code-ci` routing keywords are one set of 72 in all three copies, and the router-sync guard fails when one copy changes alone. Live routing reads the same JSON as before, so no request routes differently.

### The CI keywords are one set

You can replay a CI request through the hub row or the packet row and get the answer the live route gives, because both rows now hold the 72 keywords of the two CI classes in `hub-router.json`. The hub row gained 14 keywords. The packet row went from 12 to 72 and lost `.github/workflows/`, which the JSON's `.github/workflows` covers. `hub-router.json` lists `sk-code-ci` under `vocabularyMirrors`, so check 2 of the router-sync guard compares the three copies on every run. The packet's intent model points at its row and no longer repeats the keywords. The hub is at version 3.12.1.0 and the packet at 1.1.16.0. This closes row `H7` of the audit packet's ledger.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/ROUTER.md` | Modified | The `CI_WORKFLOW` row holds 72 keywords |
| `.skilled/skills/sk-code/sk-code-ci/ROUTER.md` | Modified | The `CI_WORKFLOW` row holds 72 keywords, and the intent model points at it |
| `.skilled/skills/sk-code/hub-router.json` | Modified | `vocabularyMirrors` and version, two lines |
| `.skilled/skills/sk-code/graph-metadata.json` | Modified | Seven generated advisor signals |
| `mode-registry.json`, `description.json`, `SKILL.md`, `sk-code-ci/SKILL.md` | Modified | Version strings |
| Two `changelog/` files | Created | One release note for the hub and one for the packet |
| The sk-code route manifest and its authored copy | Modified | Re-minted by the commit gate |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The three sets were compared with the guard's own library before planning. A script read the 72 keywords from `hub-router.json` and wrote them into the two rows, so no keyword was typed by hand. The replay script recorded the hub decision for 27 prompts and the packet's intent pick for three before the edit, and printed the same 30 lines after it. The commit gate then asked for the hub row's seven new multi-word phrases to be carried into the hub's advisor signals, which `generate-router-intent-signals.cjs --write` did. The advisor's picks for ten prompts and its full validation were recorded on both signal lists. The code landed as `4becdb1e35`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The rows are written by a script that reads the JSON | A row of 72 quoted keywords copied by hand or by a model can drop or change one. The guard would catch it, and the script avoids it |
| No DeepSeek dispatch in this packet | The operator's dispatch instruction was given for the audit packet. Here the edit is one derived line in each of two files, which a brief cannot state more safely than the script |
| The packet's intent model line was rewritten | It listed the 12 old keywords in prose, a fourth copy that the guard does not read. It now points at the row |
| The seven advisor signals were accepted | The commit gate has no path around them except a bypass. They are generated from the hub row, and the advisor validation printed the same counts on both lists |
| The packet stays at Level 2 | The scaffold ran at Level 2 before the level helper's answer of Level 0 was read. The acceptance criteria are kept because the change touches routing vocabulary |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node verify-router-sync.cjs --checks 2` with `sk-code-ci` listed | `PASS check 2`, exit 0. Before the edit the same run printed `FAIL` with 124 problems |
| `node verify-router-sync.cjs` | `router-sync: 5/5 checks passed` |
| Keyword counts of the JSON, the hub row and the packet row | `72`, `72` and `72`. Before: `72`, `58` and `12` |
| `diff scratch/replay-before.txt scratch/replay-after.txt` | Nothing printed, exit 0, over 30 lines, run again after the commit |
| Check 2 with `ci job` removed from the packet row | `FAIL check 2` with 2 problems, exit 1, then `PASS` and exit 0 after the restore, saved in `scratch/failure-path.txt` |
| `git show 4becdb1e35` on `hub-router.json` | Two lines changed, `version` and `vocabularyMirrors` |
| `node --test` on `sk-code-skilled/scripts/tests` | 55 tests, 0 fail |
| `run-all-drift-guards.sh` | `all 4 guards PASSED`, exit 0, with the same 21 warnings as the baseline |
| `validate-playbook-package.cjs --package` on the hub and packet playbooks | `PASS` with 30 and 8 scenarios, 0 violations |
| `parent-skill-check.cjs .skilled/skills/sk-code` | `all hard invariants passed, 0 warnings` |
| `advisor_validate` on the old and the new signal list | The same on both: corpus 159 of 195, holdout 31 of 40, 13 unknown, 5 false fires, the same 5 parity regressions and 6 failed suite cases |
| `diff scratch/advisor-before.txt scratch/advisor-after.txt` | Six of ten lines differ. Four CI prompts now surface `sk-code`. `rebuild the trigger index` keeps `system-spec-kit` first at 0.91 and its second pick changes from `sk-doc` to `sk-code`, both at 0.82 |
| `check_changelog_shape.py` on the two release notes | `PASS` on each |
| `sk-code-setup-check.cjs` | `STATUS=OK legs=9`, exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Seven CI phrases now count for the hub in the advisor.** `strategy matrix` and `trigger-index rebuild` are among them. `build a strategy matrix for the product pricing review` picked `sk-code` before, at 0.86, and picks it at 0.91 now. `rebuild the trigger index` still picks `system-spec-kit` first. The phrases come from the two CI classes, which decision D1 does not edit.
2. **The advisor validation fails two of its own slices on both lists.** The unknown count is 13 against a target of 10, and five parity cases regress. Both stood before this packet and neither moved.
3. **`mode-registry.json` aliases and the hub's hand-curated advisor signals are further keyword lists.** The guard checks that every alias is in a routed class. It does not require the reverse, and this packet did not change either list.
<!-- /ANCHOR:limitations -->

---
