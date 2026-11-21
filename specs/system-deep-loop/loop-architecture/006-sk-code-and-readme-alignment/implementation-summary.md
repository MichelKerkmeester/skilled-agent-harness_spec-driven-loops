---
title: "Implementation Summary"
description: "Every system-deep-loop code folder now has a README that matches its code and passes the sk-create-readme reference and count checkers, and exported code carries the doc comments sk-code requires, with no behaviour change."
trigger_phrases:
  - "sk code and readme alignment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/006-sk-code-and-readme-alignment"
    last_updated_at: "2026-11-21T18:32:25Z"
    last_updated_by: "orchestrator"
    recent_action: "Landed the comment and README fixes in fourteen lane commits and ran the full gate"
    next_safe_action: "Operator decides the behaviour-changing and undecided items listed under Known Limitations"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-sk-code-and-readme-alignment"
      parent_session_id: null
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-sk-code-and-readme-alignment |
| **Completed** | 2026-11-21 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

You can now open any code folder in the deep-loop skill and trust its README: it lists the files that are there, names the callers that really import them, and uses paths that resolve from where you are reading. The reference checker went from 14 failing READMEs to none, and the code-folder validator from 50 invalid READMEs to 8, each of the 8 a recorded decision item.

### Align system-deep-loop code with sk-code and its code-folder READMEs with the sk-doc create-readme standard

Seven read-only lanes audited 582 code files and 79 READMEs against sk-code and sk-create-readme and put each finding in one of three classes: behaviour-neutral, behaviour-changing, or needing a decision. Fourteen fix lanes then applied only the behaviour-neutral class. Exported functions, classes and interfaces in library and script code gained one-sentence doc comments, benign empty catches say why the failure is safe, non-null assertions carry their reason, and one tracker id left a code comment. `runtime/tests/_support/README.md` is new.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/**/*.{ts,cjs,sh}` (194 files) | Modified | Doc comments, WHY comments, catch variable types |
| `.skilled/skills/system-deep-loop/**/README.md` (64 files) | Modified | Inventories, relative paths, corrected claims |
| `.skilled/skills/system-deep-loop/runtime/tests/_support/README.md` | Created | Code-folder README for the fsync preload |
| `.skilled/commands/deep/assets/compiled/deep-re*.contract.markdown` | Modified | Recompiled by the pre-commit hook for a changed source digest |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Each lane verified its own files with the sk-code quality gate, the runtime typecheck, targeted vitest runs and a filter showing the code diff touches comment lines only, apart from `catch (error: unknown)` annotations, three split object literals and one unexported interface. No lane committed. After all fourteen finished, the lanes landed one commit at a time, code first, with the mode-script lane first so the pre-commit hook recompiled the deep command contracts against its changed rollout source:

| Lane | Code | README |
|------|------|--------|
| runtime scripts | `08c1db0137c` | `bb1744da03d` |
| core loop libraries | `b126abb8496` | `0db183b9e22` |
| ledger and receipt libraries | `129ae21d3ea` | `af67d9d1d42` |
| reducer and schema libraries | `aa7d38cc364` | `c06b523e52d` |
| policy and projection libraries | `ab5bf9f2a4e` | `c2f09f1eb30` |
| mode scripts and shared helpers | `b0be9d96a1c` | `20f63af64f6` |
| runtime tests | `dc527e79110` | `fe8909a3a8e` |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Rewrite repository-root inline paths relative to each README | The code-folder validator resolves inline paths from the README folder, so a relative path satisfies both checkers |
| Complete the unit test README inventory | The code-folder template requires every direct file, and nothing else needed the partial table |
| Comment only benign empty catches | A WHY comment on a catch that hides a real failure would be false, so those stay behaviour items |
| Scope doc comments to public API outside tests | The TypeScript checklist rule is titled "TSDoc on Public API" |
| Leave the command YAMLs out | sk-code covers only CI workflow YAML |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Runtime vitest | PASS: 3967 passed, 11 skipped, 0 failed (3978 tests) |
| Ledger-stem, projection, contract drift | PASS: exit 0 each, `[CONTRACT DRIFT] OK commands=2` |
| Contract parity | PASS: `Tests  18 passed (18)` |
| Expansive-depth packet validate | PASS: `validate exit=0 passed=16 failed=0` |
| Runtime typecheck | PASS: exit 0 |
| sk-code quality gate, 582 files | PASS: NO_BLOCKER_FOUND, 0 findings |
| `check_readme_references.py`, 79 READMEs | PASS: `SUMMARY files=79 pass=79 fail=0` (baseline 64 of 78) |
| `check_derived_readme_counts.py`, 79 READMEs | PASS: `SUMMARY files=79 pass=79 fail=0` |
| `audit_readmes.py` default mode | PASS: 72 of 72 valid |
| `audit_readmes.py --document-type code-folder` | 64 of 72 valid (baseline 21 of 71); the 8 left are decision items |
| Mirrors, documentation drift, frontmatter versions, contract snapshot | PASS: exit 0 each |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Behaviour-changing findings, class (b), not built.** Path containment is missing before writes in `runtime/scripts` (`append-state-record.cjs:115`, `reduce-state.cjs:2825`, `score-fanout-pairs.cjs:618`). The `setup-cp-sandbox.sh:48-67` guard in both modes accepts `/tmp/` before `rm -rf`. Errors are swallowed silently in `workflow-steps.cjs:38`, `loop-lock.ts:750`, `append-mode-event.ts:548`, `coverage-graph-signals.ts:888`, `resolve-injection-mode.cjs:45` and `authority-registry.ts:322`. Locale-dependent sorts feed digests in `provenance-reduction/reducer.ts`. `validate-playbook-package.cjs` finds 0 tests because `vitest list` prefixes `[serial] `.
2. **Undecided findings, class (c).** Exit codes differ across scripts (`cli-guards.cjs:142` maps input errors to 3, `dispatch-iteration.cjs:62` uses 64). There is an exported `any` in `legacy-projection-types.ts:97`. Tests and the pivot scripts are outside every tsconfig. Tests read inputs from spec-packet paths (`helpers/legacy-real-log.ts:22`). `authority-registry.ts:115` documents a `compareAndSwap` method that does not exist.
3. **Eight READMEs stay invalid in code-folder mode.** The skill root, deep-research and deep-review READMEs are skill READMEs that the mode misreads. `runtime/database/README.md` omits a gitignored file. The benchmark READMEs need a tree or trip the packet-id rule on `100/100`. The two playbook inventories sit under a heading the validator does not accept.
4. **Agent DQI bar.** Several short code-folder READMEs score 71 to 74 against the @markdown agent's bar of 75, above the workflow floor of 70. `coverage-graph/README.md` scores 69, up from 68. None was padded to reach the bar.
<!-- /ANCHOR:limitations -->

---


