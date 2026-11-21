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
    next_safe_action: "None; every finding is built, rebutted or accepted"
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
| mode scripts and shared helpers | `b0be9d96a1c`, `8acaa398504` | `20f63af64f6` |
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
| Runtime vitest | PASS: 3967 passed, 11 skipped, 0 failed (3978 tests) for the comment pass; 4029 passed, 11 skipped, 0 failed (4040 tests) after the behaviour fixes; 4039 passed, 11 skipped, 0 failed (4050 tests) after the accepted defaults |
| Ledger-stem, projection, contract drift | PASS: exit 0 each, `[CONTRACT DRIFT] OK commands=2` |
| Contract parity | PASS: `Tests  18 passed (18)` |
| Expansive-depth packet validate | PASS: `validate exit=0 passed=16 failed=0` |
| Runtime typecheck | PASS: exit 0 |
| sk-code quality gate, 582 files | PASS: NO_BLOCKER_FOUND, 0 findings |
| sk-code `verify_alignment_drift.py` on the skill | PASS: 0 findings by default and with `--check-exact-headers` (13 at baseline) and `--check-folders` (1 at baseline). `--check-sections` reports 5, the same 5 as baseline |
| `check_readme_references.py`, 79 READMEs | PASS: `SUMMARY files=79 pass=79 fail=0` (baseline 64 of 78) |
| `check_derived_readme_counts.py`, 79 READMEs | PASS: `SUMMARY files=79 pass=79 fail=0` |
| `audit_readmes.py` default mode | PASS: 72 of 72 valid |
| `audit_readmes.py --document-type code-folder` | 67 of 72 valid (baseline 21 of 71); the 5 left are skill and general READMEs, which validate in readme mode |
| Mirrors, documentation drift, frontmatter versions, contract snapshot | PASS: exit 0 each |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Behaviour-changing findings, class (b), since built.** The results are in the behaviour fixes table below. Containment is still missing at the other caller-named write sites in `runtime/scripts` (`reduce-state.cjs`, `score-fanout-pairs.cjs`, `workflow-steps.cjs` and others), which stay in the class (c) proposals.
2. **Undecided findings, class (c).** All 48 were built to their accepted defaults; see the table below.
3. **Five READMEs stay invalid in code-folder mode.** The skill root, deep-research, deep-review and both benchmark READMEs are skill or general READMEs, which validate in readme mode, where they pass.
4. **Agent DQI bar.** The @markdown agent now passes a code-folder README at 70 and keeps 75 for other markdown. `coverage-graph/README.md` now scores 72 with its new validation section, so every code-folder README clears 70.


### Behaviour fixes built after operator approval

The operator approved every class (b) item plus the two safety items `L1-C009` and `L2-C006`. Each built item has a test that failed before its fix. 35 items: 32 built, 3 rebutted, 0 stopped.

| Item | Result | What changed or why | Commit |
|------|--------|---------------------|--------|
| L1-C009 | built | `append-state-record.cjs` refuses a target whose real path leaves the working directory, exit 1 | `15fe7306bca` |
| L1-C008 | built | `workflow-steps.cjs` warns on skipped malformed lines and rethrows non-ENOENT reads | `15fe7306bca` |
| L1-C003 | built | `fanout-run.cjs` records an unknown version for an unreadable first PATH match | `15fe7306bca` |
| L6-C001, L6-C002 | built | Both `setup-cp-sandbox.sh` copies refuse `/tmp`, dot segments and symlink escapes by real path before `rm -rf` | `c89d47675f9` |
| L7-PLAY | built | The stress `validate-playbook-package.cjs` strips the vitest project prefix and passes with 126 of 126 tests; the earlier path in this list named the wrong file | `c89d47675f9` |
| L7-C012 | built | `completed-lineage-state.cjs` prints usage and exits 2 with no argument | `c89d47675f9` |
| L7-C008 | built | Three contract tests type the ledger head instead of `as any` | `c89d47675f9` |
| L2-C006 | built | A failed lock restore throws an AggregateError carrying both errors | `7c656e5dd79` |
| L2-C007 | built | Containment and audit messages narrow thrown values before reading `.message` | `7c656e5dd79` |
| L2-PDV | built | The delta scan reports skipped unparseable lines as an advisory warning | `7c656e5dd79` |
| L2-C012 | built | Five inline parameter shapes became named interfaces, type-only | `7c656e5dd79` |
| L4-C012 | built | The gateway refuses with APPEND_FAILED when verified events cannot be read | `0ea831c1839` |
| L4-C013 | built | `clearPendingTransition` rethrows anything but ENOENT | `0ea831c1839` |
| L4-C001, L4-C003 | built | Coverage graph SQL errors reach the caller; metadata parsing uses the existing guard | `0ea831c1839` |
| L4-C005 | built | `initDb` refuses a read-only or foreign open connection; `getDb()` still returns the read-only handle | `0ea831c1839` |
| L4-C010, L4-C020 | built | Named constants where a literal repeats with one meaning; single-site literals rebutted | `0ea831c1839` |
| L4-C019 | built | `openReadOnlyDb` returns the new exported `ReadOnlyOpenResult` type | `0ea831c1839` |
| L4-C021 | built | Replay fingerprint errors keep their cause | `0ea831c1839` |
| L4-C002 | rebutted | `ReviewConvergenceSignals` (`coverage-graph-signals.ts:74`) has no field for a malformed-row count, so adding one changes the shape | - |
| L5-C010 | built | Provenance and partial-failure orders compare by code unit; a probe over 5435 calls found no order change, so no committed digest moves | `f4ace7e740b` |
| L5-C013 | built | Budget errors name the scope or reservation | `f4ace7e740b` |
| L5-C006, L5-C007, L5-C009 | built | Named interfaces, repeated bounds as constants, duplicate comparison wrappers removed | `f4ace7e740b` |
| L3-C013 | built | `CLAIM_IDENTITY_MAX_LENGTH` replaces four 512 literals, a new export | `f4ace7e740b` |
| L3-C014 | rebutted | The repeated 256 values span folders or mean different things (`authorized-ledger`), and `integrity.ts:41` is a single site | - |
| L6-C006 | built | The rollout mode map returns empty only on ENOENT and throws on read or parse errors; contracts recompiled | `cfe004b132e` |
| L6-C008 | built | The research reducer usage line is built from its accepted flags | `cfe004b132e` |
| L6-C024, L6-C027 | built | The benchmark runner uses a bracketed prefix and exits 2 on a regex marker that does not compile | `cfe004b132e` |
| L6-C025 | rebutted | `deriveRejectedPatternIndex` (`reduce-state.cjs:414-416`) already prefixes the warning, so a second prefix would double it | - |
| L6-C026 | built | Event upcast errors keep the upcaster error as cause | `cfe004b132e` |

The 48 class (c) items were then proposed with a default each and the operator accepted all of them; the results follow.

### Undecided findings, built to the accepted defaults

The operator accepted the recommended default for all 48 class (c) items: 34 built, 14 accepted as conventions with no edit, 0 rebutted and 0 stopped.

**Exit codes and CLI contracts** (`23da225543d`)

| Item | Result | What changed |
|------|--------|--------------|
| L1-C010 | built | Per-script exit codes documented in the script interface contract |
| L1-C005 | built | Existing stderr prefixes frozen, new lines use `[script-name] message` |
| L1-C011 | built | Size exception for the large orchestration scripts recorded in the scripts README |
| L6-C007 | built | WHY comment on the `--create-missing-anchors` no-op |
| L1-C004, L1-C012 | accepted | Prose under the header and WHY line comments satisfy the rules |

**Structure, typing and errors** (`de972038aba`, `f7f084fc914`)

| Item | Result | What changed |
|------|--------|--------------|
| L2-C003, L2-C004 | built | Method syntax removes the exported `any` in legacy projections |
| L2-C014 | built | Internal durability module for atomic-state and jsonl repair; loop-lock keeps its copies because node loads it without tsx |
| L6-C010 | built | Eight shared pivot helpers in one module; `priorCandidate` stays per mode |
| L2-C015, L2-C017, L4-C011, L4-C014, L4-DOC | built | Comments and TSDoc match the code |
| L2-C016, L4-C015 | built | Scorer and sealed-artifact docs record the test-only primitive and per-mode duplication |
| L5-C011 | built | Provenance records the real fail-closed cause; no golden or pinned fingerprint covered these paths, so none was updated |
| L5-C012 | built | Resume reducer turns only verification errors into unreadable and rethrows the rest |
| L3-C016, L3-C017, L3-C019, L5-C015 | built | WHY comment, error-details policy, two-way dependency and long-function notes in the folder READMEs; the ten cause sites are left for when they are next touched |
| L2-C005, L3-C010, L3-C018, L5-C008, L5-C014 | accepted | Conventions kept as they are |

**Test config and type-check coverage** (`992ae998d16`)

| Item | Result | What changed |
|------|--------|--------------|
| L7-C014, L6-C009 | built | `tsconfig.tests.json` and `typecheck:tests`, not in CI, baseline exit 2 with 212 errors in 54 files |
| L7-C013 | built | Fan-out live probe runs only with `DEEP_LOOP_FANOUT_LIVE=1` |
| L7-C016 | built | Matrix identifiers renamed |
| L7-C015 | built | WHY comment on the real-log helper |
| L7-C018 | built | Shape test for the frozen mode-contract sets |
| L7-C017 | accepted | Council report kept as a frozen record |

**Docs, validator rules and DQI** (`3fbc871e111`, `0c52017ed96`)

| Item | Result | What changed |
|------|--------|--------------|
| L1-R008 | built | Database README lists the gitignored observability log |
| L6-R012 | built | Rollout deferred scope moved to this packet's out-of-scope list |
| L6-R019, L6-R021 | built | Playbook inventories renamed CONTENTS |
| L6-R028 | built | Benchmark scores written as `100 of 100` |
| DQI | built | The markdown agent passes code-folder READMEs at 70 and keeps 75 elsewhere, in all mirrors |
| L6-R023 to L6-R027, L6-R029 | accepted | Skill and general READMEs validate in readme mode, where all 72 are valid |
<!-- /ANCHOR:limitations -->

---


