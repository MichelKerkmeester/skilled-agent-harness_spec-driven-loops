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
| Runtime vitest | PASS: 3967 passed, 11 skipped, 0 failed (3978 tests) |
| Ledger-stem, projection, contract drift | PASS: exit 0 each, `[CONTRACT DRIFT] OK commands=2` |
| Contract parity | PASS: `Tests  18 passed (18)` |
| Expansive-depth packet validate | PASS: `validate exit=0 passed=16 failed=0` |
| Runtime typecheck | PASS: exit 0 |
| sk-code quality gate, 582 files | PASS: NO_BLOCKER_FOUND, 0 findings |
| sk-code `verify_alignment_drift.py` on the skill | PASS: 0 findings by default and with `--check-exact-headers` (13 at baseline) and `--check-folders` (1 at baseline). `--check-sections` reports 5, the same 5 as baseline |
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

### Operator decision list

83 open items: 33 class (b) behaviour-changing, 50 class (c) needing a decision. Paths are relative to `.skilled/skills/system-deep-loop/` unless they start with `.skilled/` or `.claude/`.

| ID | Location | Class | Proposal |
|----|----------|-------|----------|
| L1-C004 | `runtime/scripts/{convergence:19, divergent-pivot:23, fanout-merge:16, ` | c | Decide whether the module-prose comment under the divider counts as header. |
| L1-C005 | `runtime/scripts/workflow-steps.cjs:84, :107, :198, :410, :434` | c | Pick one stderr prefix convention for CLI diagnostics. |
| L1-C008 | `runtime/scripts/workflow-steps.cjs:38` | b | Warn on stderr when a malformed state-log line is skipped, and let non-ENOENT read errors through. |
| L1-C009 | `append-state-record.cjs:115` | c | Decide whether the P0 binds CLI scripts that write to caller-named paths. |
| L1-C010 | `lib/cli-guards.cjs:142-157` | c | Exit codes are public surface. |
| L1-C011 | `runtime/scripts/fanout-run.cjs (6,242` | c | Decide whether to split fanout-run.cjs (budget, Vibe, status table, watchdog) into lib modules or to record the SRP exception. |
| L1-C012 | `Exports documented with // line comments rather than JSDoc, e.g. conve` | c | Decide whether a WHY line comment satisfies the rule, or whether these convert to /** */. |
| L1-R008 | `runtime/database/README.md:16-21` | c | Either list observability-events.jsonl as a gitignored runtime file (class a, clears the checker), or have the rule skip gitignored files the way reso |
| L2-C003 | `legacy-projections/legacy-projection-types.ts:97` | c | Decide the encoding: LegacyProjectionContract<TState> is invariant (reduce(state) takes and returns TState, line 62), so <unknown> or <LegacyProjectio |
| L2-C004 | `legacy-projections/legacy-projection-surface-fold.ts:46,50` | c | Resolve together with C003; the same helper type removes all six. |
| L2-C005 | `deep-loop/atomic-state.ts:129,254,265,311,644` | c | Decision: the repo convention is a best-effort swallow with a one-line WHY comment (executor-audit.ts:852, post-dispatch-validate.ts:1867, write-conta |
| L2-C006 | `deep-loop/loop-lock.ts:736-739` | c | Decide whether a failed restore must surface (rethrow or log); either fix is (b). |
| L2-C007 | `deep-loop/write-containment.ts:623,743,951,982,993,1026,1486,1542,1615` | b | Replace with error instanceof Error ? error.message : String(error) (changes the emitted string for non-Error throws). |
| L2-C014 | `deep-loop/atomic-state.ts:81-92, jsonl-repair.ts:183-194, loop-lock.ts` | c | Decide whether to add a shared internal fs helper in deep-loop/ (new module = design decision; deep-loop is widely imported, keep it non-exported from |
| L2-C015 | `deep-loop/write-containment.ts:57-72` | c | Decide whether a missing gateway module must be reported (log once) or is an accepted degraded mode; document the WHY either way. |
| L2-C016 | `deep-loop/bayesian-scorer.ts:15,37` | c | Decide: wire it, keep it as a documented test-only primitive, or retire it (retiring is (b)). |
| L2-C017 | `authority-root/resolve-authority-root.ts:64-67` | c | Decide whether the override is a trusted operator knob (document it) or must be validated (any check is (b)). |
| L3-C010 | `103` | c | Decide whether exported constants and error-code maps need TSDoc. |
| L3-C016 | `blinded-adjudication/service.ts:547` | c | Decide whether a malformed authorizer result should raise AdjudicationError (that fix would be b) or stay a silent denial with a WHY comment |
| L3-C017 | `Fail-closed catch translations that drop the original error: dispatch-` | c | Decide a lane-wide policy: carry a bounded cause code in error details (as fenced-lease-coordinator.ts:651 and dispatch-barrier.ts:120 substrateCode d |
| L3-C018 | `Duplicate local helpers: isRecord x8` | c | Decide whether to add one shared guard module under runtime/lib. |
| L3-C019 | `Folder import cycle: authorized-ledger/append-only-ledger.ts:23,38` | c | Decide whether fence-capability belongs in a lower shared layer, or document the two-way edge in both READMEs. |
| L4-C001 | `coverage-graph/coverage-graph-signals.ts:888-893` | b | The catch { } wraps both JSON.parse and the per-finding SQL prepare().get(). |
| L4-C002 | `coverage-graph/coverage-graph-signals.ts:493-498` | b | Malformed FILE metadata is silently treated as non-hotspot in computeHotspotSaturation. |
| L4-C005 | `coverage-graph/coverage-graph-db.ts:320-321` | b | Latent. |
| L4-C011 | `mode-append-gateway/append-mode-event.ts:465, 483, 528, 576, 656` | c | // Phase 1..5 step comments are function-local stage labels (the comment-hygiene checker passed them), but their numbering ("Phase 4 & 5: Authorize an |
| L4-C012 | `mode-append-gateway/append-mode-event.ts:548-553` | b | A readVerifiedEvents() failure becomes priorEvents = null, and both findUnattributedStateLog (343) and findIdempotentReplay (383) skip silently. |
| L4-C013 | `per-mode-authority-flip/authority-registry.ts:322-327` | b | clearPendingTransition swallows every unlink error while the comment claims "Already absent"; rethrow anything other than ENOENT. |
| L4-C014 | `per-mode-authority-flip/authority-registry.ts:115` | c | TSDoc names compareAndSwap, which does not exist on AuthorityRegistry (public members at 165, 256, 280, 300, 306, 322). |
| L4-C015 | `deep-research-sealed-artifacts/deep-research-artifact-set.ts vs deep-r` | c | After research/review name normalisation, 332 of 345 unique lines are identical. |
| L4-C021 | `replay-fingerprint/derive-replay-fingerprint.ts:315` | b | The bare catch discards the underlying error. |
| L5-C008 | `Same rule repeated across domains: 4_096` | c | Decide whether to add a shared constants/compare helper (for example in event-envelope) and take on the new cross-domain import, or accept per-domain  |
| L5-C010 | `provenance-reduction/reducer.ts:277,284,524,536,537,557,618,655,706,73` | b | Replace localeCompare with a code-unit comparator. |
| L5-C011 | `provenance-reduction/reducer.ts:712-805` | c | The catch at :788 drops the error. |
| L5-C012 | `result-envelopes/resume-reducer.ts:400` | c | The catch-all turns every exception, programmer errors included, into integrity: 'unreadable' / LEDGER_VERIFICATION_FAILED with no error detail. |
| L5-C013 | `hierarchical-budgets/budget-authority.ts:385` | b | Put the offending scopeId/reservationId in the message. |
| L5-C015 | `write-set-conflict-graph/graph.ts:432` | c | Decide whether to split these, or record them as reviewed. |
| L6-C001 | `deep-research/manual-testing-playbook/command-flow-stress-tests/setup-` | b | Require a non-empty child under /tmp ([[ "$dir" == /tmp/?* ]], reject .-only segments) and compare realpath of the candidate against realpath /tmp bef |
| L6-C002 | `deep-review/manual-testing-playbook/command-flow-stress-tests/setup-cp` | b | Same fix as L6-C001. |
| L6-C006 | `shared/rollout/resolve-injection-mode.cjs:45-55` | b | Return {} only on ENOENT. |
| L6-C007 | `deep-research/scripts/reduce-state.cjs:3541` | c | Decide whether the research reducer keeps the flag as a compatibility no-op (then document it as one) or drops it, and dropping it would change exit 3 |
| L6-C008 | `deep-research/scripts/reduce-state.cjs:3548,3569` | b | Generate the Usage line from knownFlags so it lists every accepted flag. |
| L6-C009 | `deep-research/scripts/divergent-research-pivot.ts, deep-review/scripts` | c | Choose a home: add a scripts tsconfig (it would need allowImportingTsExtensions) or extend the runtime include. |
| L6-C010 | `deep-research/scripts/divergent-research-pivot.ts:66-186` | c | Move the shared helpers into runtime/lib/deep-loop/ (beside divergent-pivot.ts) and import them in both. |
| L6-C024 | `shared/behavior-benchmark/behavior-bench-run.cjs:1047,1067,1071,1079,1` | b | Switch to [behavior-bench-run]. |
| L6-C025 | `deep-research/scripts/reduce-state.cjs:3431` | b | Prefix it with [deep-research]. |
| L6-C026 | `runtime/lib/event-envelope/event-envelope-boundary.ts:247-252` | b | Pass { cause } (or the message in details) into EventUpcastError. |
| L6-C027 | `shared/behavior-benchmark/behavior-bench-run.cjs:126-132` | b | Reject invalid regex markers at parseScenario time (EXIT_CONTRACT) or log once. |
| L6-R012 | `shared/rollout/README.md:27-30` | c | Decide where the deferred-scope notes live (spec or backlog) before removing them from the README. |
| L6-R019 | `deep-research/manual-testing-playbook/command-flow-stress-tests/README` | c | Either rename the heading to CONTENTS (doc-only) or teach the checker the playbook category template. |
| L6-R021 | `deep-review/manual-testing-playbook/command-flow-stress-tests/README.m` | c | Same decision as L6-R019. |
| L6-R023 | `README.md (skill root):27,31` | c | Audit skill READMEs with the skill-README document type, or exempt artifact-pattern paths. |
| L6-R024 | `deep-research/README.md:31,62,137,241` | c | Same as L6-R023. |
| L6-R025 | `deep-research/README.md:268,269` | c | Same decision as L6-R002 and L6-R023. |
| L6-R026 | `deep-review/README.md:166,267` | c | Same as L6-R023. |
| L6-R028 | `benchmark/README.md:34-36` | c | Confirm the regex. |
| L7-C012 | `helpers/completed-lineage-state.cjs:57-60` | b | Print a usage line to stderr and exit 2 when lineageDir is missing. |
| L7-C013 | `stress/cli-adapter/fanout.vitest.ts:918-923` | c | Decide: delete it, or gate it on an opt-in env flag like the codex probe. |
| L7-C014 | `runtime/tsconfig.json:16-21` | c | Decide whether to add a tsconfig.tests.json (or a typecheck:tests script) over tests/. |
| L7-C015 | `helpers/legacy-real-log.ts:22-26` | c | Decide: copy the captured logs into tests/fixtures/ (a fixture change, which another lane owns), or keep the real-log dependency on purpose and say so |
| L7-C016 | `stress/cli-adapter/matrix-manifest.ts:63,73,75,94,131,139` | c | Rename to SHARED_SUITE_ADAPTER_SUBJECTS / CLI_ADAPTER_SHARED_SUITE_ROWS. |
| L7-C017 | `council-graph-value-report.json (tests root, tracked)` | c | Decide whether to delete it (unit/legacy-projections.test.ts:139-141 confirms the council lane is retired) or document it as a frozen record. |
| L7-C018 | `runtime/lib/mode-contracts/ (folder-level coverage)` | c | Decide whether a constants-only contract module needs a direct shape test, or whether coverage through its consumers is enough. |
| L1-C003 | `runtime/scripts/fanout-run.cjs:3498` | b | Separate the realpath, stat and read failures so an unreadable first PATH match is not silently skipped |
| L2-C012 | `runtime/lib/deep-loop (inline parameter types)` | b | Extract the inline parameter shapes into named interfaces |
| L2-PDV | `runtime/lib/deep-loop/post-dispatch-validate.ts:1034` | b | Record skipped unparseable lines in the backward scan instead of an empty catch |
| L3-C013 | `runtime/lib (lane L3 magic numbers)` | b | Name the repeated numeric bounds as constants |
| L3-C014 | `runtime/lib (lane L3 magic numbers)` | b | Same as L3-C013 |
| L4-C003 | `coverage-graph/coverage-graph-signals.ts:888` | b | Add a narrowing guard inside the try that already swallows SQL errors |
| L4-C010 | `runtime/lib (lane L4 magic numbers)` | b | Name the numeric bounds as constants |
| L4-C019 | `runtime/lib (lane L4 inline shape)` | b | Export a named interface for the shape; changes the public surface |
| L4-C020 | `coverage-graph/coverage-graph-db.ts (header bytes)` | b | Name the SQLite header byte offsets as constants |
| L4-DOC | `per-mode-authority-flip/authority-registry.ts:115` | c | TSDoc names a compareAndSwap method that does not exist; correct it with the retire-or-restore decision |
| L5-C006 | `runtime/lib (lane L5 inline shapes)` | b | Extract inline parameter shapes into named interfaces |
| L5-C007 | `runtime/lib (lane L5 magic numbers)` | b | Name the 4096 bound and basis-point ceilings as constants |
| L5-C009 | `runtime/lib (lane L5 wrapper)` | b | Delete the duplicate comparison wrapper |
| L5-C014 | `runtime/lib (lane L5 long code lines)` | c | Thirteen code lines exceed 120 characters; wrap them only with a reformat decision |
| L6-R027 | `README.md (skill root)` | c | Skill README misread by code-folder mode; leave or exempt skill READMEs from the mode |
| L6-R029 | `benchmark/reports/README.md` | c | General README misread by code-folder mode |
| L6-R028 | `benchmark/README.md:34-36` | c | Packet-id rule trips on 100/100, not on the D-labels; narrow the rule or reword the scores |
| L7-C008 | `tests (three head as any sites in generated helper source)` | b | Typing them changes the generated helper script text |
| L7-PLAY | `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | b | listRegisteredTests drops vitest list lines prefixed [serial], so it finds 0 tests; strip the project prefix |
| DQI | `.claude/agents/markdown.md (DQI bar)` | c | Set the @markdown DQI bar for code-folder READMEs to the workflow floor of 70, or skip has_blockquote and the word floor for code folders in extract_structure.py |
<!-- /ANCHOR:limitations -->

---


