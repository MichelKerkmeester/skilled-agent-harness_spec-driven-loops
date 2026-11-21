# Deep Review Report

- Target: `specs/system-skilled-doctor/007-overlay-framework-root-layout`
- Review packet: `specs/system-skilled-doctor/007-overlay-framework-root-layout/review/lineages/deepseek-flash-max`
- Run: `fanout-deepseek-flash-max-1795192401900-xpt66n`
- Executor: cli-mistral-vibe model=deepseek-flash
- Lineage: `new`, generation 1, parent `2026-11-20T16:33:02.758Z`
- Iterations: 9 of a permitted 24
- Dimensions: correctness, security, traceability, maintainability (all four covered)
- Frontier nodes: F-1-002, F-1-004, F-1-006
- Stop: `blockedStop` -- the coverage gate vetoed STOP and neither cause is fixable inside this lineage's write surface

## 1. Executive Summary

**Verdict: FAIL.**

| Severity | Active | Resolved |
|----------|--------|----------|
| P0 | 0 | 0 |
| P1 | 0 | 0 |
| P2 | 10 | 0 |

`hasAdvisories = false`. The counts above are the counts `review-verdict.cjs` used: it read the refreshed registry and the terminal-gates row and returned `{"verdict":"FAIL","active_p0":0,"active_p1":0,"active_p2":10,"search_debt":3,"failed_required_gate_ids":["coverage"]}`.

**The FAIL is a traceability failure, not a code failure.** No P0 and no P1 was ever active across nine iterations. The verdict is FAIL because one required quality gate -- coverage -- failed at the terminal stop, and `deriveReviewVerdict` returns FAIL whenever `failedRequiredGateIds` is non-empty. The gate failed with reason `traceability-incomplete` because the `checklist_evidence` core protocol is `partial`, and it is partial for two independent reasons:

1. **A ticked completion criterion does not reproduce.** `003-engine-docs-and-release/goal.md:62` is marked `[x]`, and its third clause promises that `rg -n -e 'source[L]ayout' -e 'framework-root' -e 'opt[-]in' .skilled/commands/doctor .skilled/skills/system-skilled-doctor -g '!**/scripts/**' -g '!**/changelog/v1.1*'` prints nothing. Re-running it verbatim prints `.skilled/commands/doctor/assets/doctor-env.yaml:48`, where the word `opt-in` appears inside a boolean-parsing description unrelated to the layout rule. The criterion's intent holds; the command as written does not pass, so the tick cannot be reproduced. This is R7-P2-001, and the fix is a one-line amendment to the criterion.
2. **One criterion is outside this lineage's authority.** The packet's sixth criterion is `validate.sh --recursive --strict`, and this lineage's dispatch forbids running `validate.sh`. It is recorded as a limit, not a pass.

**The code under review is clean.** This is a follow-up round after remediation. The prior generation raised 1 P1 and 15 P2 across two lineages. Every one of those 16 findings was re-verified against the current tree and every one is fixed: the relayout rollback restores from a snapshot and is covered by injected-failure tests, the outside-repository refusal fires from `resolveOverlayDir` on every command, both LAYOUT and strict-write remedies are branched and documented, `overlayOutside` is on the context, `writeBackup` is split, the commit gate fails closed without a manifest, the hooks read `overlayDir`, the plugin test loads the real bridge, and no live `barter-overlays` path reference survives.

**The strongest evidence in this run is new.** Iteration 9 executed the packet's first completion criterion for the first time in the run: `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` reports `tests 262`, `pass 262`, `fail 0`. The suites write only under `os.tmpdir()` (`overlay-engine-fixtures.cjs:63`), and `git status --porcelain` over `.skilled/commands/doctor`, `.skilled/skills/system-skilled-doctor` and `barter/ai-speckit` is empty afterwards, so the execution left no residue. Five of the packet's six criteria now execute and pass.

**Self-check outcomes.** The adversarial self-check had nothing to adjudicate: no P0 and no P1 was active at the terminal stop, so `selfcheck_adjudications` is empty and the Referee changed no severity. The ten P2 findings stand as raised.

**Review scope.** The Skilled overlay engine and its docs, the Barter vendored copy, the Barter overlay folder, the three hook entrypoints, and the packet's own completion criteria. Two completion criteria could not be executed inside this lineage's write surface and are recorded as limits rather than passes.

**Operator review focus.** Follow-up round after remediation. Verify every finding of the previous generation is fixed and that the fixes introduced no regression, then review the whole change again. Skilled: the remediation commits on origin/main up to b5a630c6efa (phase 006 engine fixes: relayout rollback, outside-repository refusal at resolveOverlayDir, LAYOUT and strict-write remedies, overlayOutside on the context, writeBackup split; phases 007 and 008 records). ai-speckit (/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit, read-only): commits 64cfee51628..e63bd038a5d, especially 5dd004f3faa (commit gate fails closed without a manifest, hooks read overlayDir, real-bridge plugin test, relayout-runs ignore, fixture rename) and 488ea9f49f5 (re-pin onto b5a630c). Check engine correctness, path safety, hook fail-open or fail-closed behavior, rollback correctness, test strength, docs against code, and leftover barter-overlays references.

## 2. Planning Trigger

`/speckit:plan` **is required**, because the verdict is FAIL. The plan is small: one line of the packet's own goal document, plus the nine advisory hardening items if the maintainer wants them closed in the same pass. The single change that flips the verdict is amending `003-engine-docs-and-release/goal.md:62` so its third clause excludes `assets/` or anchors the `opt-in` pattern to the layout rule; that makes the tick reproducible, closes `checklist_evidence`, and lets a re-run converge to PASS.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    { "id": "R1-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:478", "title": "A sibling link that resolves back inside the tree is refused with the wrong reason", "findingClass": "misleading-diagnostic" },
    { "id": "R2-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:2514", "title": "layoutLinks paths escape the tree root unvalidated, and the relayout rollback now writes through them", "findingClass": "path-safety hardening" },
    { "id": "R3-P2-001", "severity": "P2", "dimension": "correctness", "file": "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:88", "title": "The commit gate can resolve the tree one level too deep and then report a missing engine instead of a missing manifest", "findingClass": "misleading-diagnostic" },
    { "id": "R4-P2-001", "severity": "P2", "dimension": "correctness", "file": "barter/ai-speckit/overlays/overlay-manifest.json:7", "title": "The committed overlay manifest pins an absolute local checkout path", "findingClass": "portability" },
    { "id": "R5-P2-001", "severity": "P2", "dimension": "security", "file": "barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:2313", "title": "Git write gate fails open and silently through its CLI entrypoint", "findingClass": "security-hardening" },
    { "id": "R5-P2-002", "severity": "P2", "dimension": "security", "file": "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:73", "title": "A missing prompt-card guard skips its check with no message", "findingClass": "security-hardening" },
    { "id": "R6-P2-001", "severity": "P2", "dimension": "security", "file": "barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs:4241", "title": "The pinned-blob reader passes a manifest value to git without --end-of-options", "findingClass": "security-hardening" },
    { "id": "R7-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release/goal.md:62", "title": "A checked completion criterion does not reproduce", "findingClass": "traceability" },
    { "id": "R8-P2-001", "severity": "P2", "dimension": "traceability", "file": "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:45", "title": "The three staged-list scans in pre-commit disagree on which change types they see", "findingClass": "maintainability" },
    { "id": "R9-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/system-skilled-doctor/007-overlay-framework-root-layout/goal.md:93", "title": "The packet's last completion criterion understates the phase count", "findingClass": "traceability" }
  ],
  "remediationWorkstreams": [
    { "id": "WS-1", "priority": "gate", "title": "Make the phase-003 tick reproducible", "findings": ["R7-P2-001"], "surface": "specs/system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release/goal.md:62", "why": "This is the only change that closes checklist_evidence and flips the verdict from FAIL to PASS" },
    { "id": "WS-2", "priority": "gate", "title": "Correct the packet criterion's phase count", "findings": ["R9-P2-001"], "surface": "specs/system-skilled-doctor/007-overlay-framework-root-layout/goal.md:93", "why": "The criterion names six phases while the packet holds eleven, so its PASS cannot cover the packet it names" },
    { "id": "WS-3", "priority": "P2", "title": "Hook failure modes", "findings": ["R5-P2-001", "R5-P2-002", "R8-P2-001"], "surface": "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit, barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs", "why": "Two fail-open arms and one silent skip in the commit gate" },
    { "id": "WS-4", "priority": "P2", "title": "Engine input hardening", "findings": ["R2-P2-001", "R6-P2-001"], "surface": ".skilled/commands/doctor/scripts/overlay-engine.cjs", "why": "One unvalidated plan field and one git argument without --end-of-options" },
    { "id": "WS-5", "priority": "P2", "title": "Diagnostics and portability", "findings": ["R1-P2-001", "R3-P2-001", "R4-P2-001"], "surface": ".skilled/commands/doctor/scripts/overlay-engine.cjs, barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit, barter/ai-speckit/overlays/overlay-manifest.json", "why": "Two misleading refusals and one absolute path committed into a tracked manifest" }
  ],
  "specSeed": [
    "A completion criterion is a command a later reader re-runs, so a pattern that can drift into a false hit is a defect in the criterion rather than in the tree.",
    "A criterion that names a count of folders is stale the moment a folder is added; name the parent folder or the full list instead.",
    "A hook entrypoint's failure mode is part of the contract: the same evaluator must fail the same way through every entrypoint.",
    "A manifest field reaching a subprocess is untrusted input even when the manifest is committed."
  ],
  "planSeed": [
    "Amend 003-engine-docs-and-release/goal.md:62 to exclude assets/ or anchor the opt-in pattern to the layout rule, then re-tick it from a clean run.",
    "Reword goal.md:93 to name the packet folder alone, or to name all eleven phases.",
    "Fix the two hook fail-open arms and the card-guard skip, with one test each.",
    "Add --end-of-options to the pinned-blob reader and extend assertSafeToPlan to cover layoutLinks and replaces.",
    "Correct the two misleading diagnostics.",
    "Switch pin.checkout to the relative form and re-run status --audit.",
    "Re-run node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs and validate.sh --recursive --strict outside this lineage."
  ],
  "findingClasses": ["misleading-diagnostic", "path-safety hardening", "portability", "security-hardening", "traceability", "maintainability"],
  "affectedSurfacesSeed": [
    ".skilled/commands/doctor/scripts/overlay-engine.cjs",
    ".skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs",
    ".skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs",
    ".skilled/skills/system-skilled-doctor/references/overlays.md",
    "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit",
    "barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/tests/pre-commit.test.cjs",
    "barter/ai-speckit/skilled/.opencode/scripts/git-hooks/pre-commit",
    "barter/ai-speckit/overlays/overlay-manifest.json",
    "barter/ai-speckit/overlays/README.md",
    "barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs",
    "barter/ai-speckit/overlays/root/opencode/plugins/barter-git-write-gate.js",
    "barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.test.mjs",
    "barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs",
    "barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs",
    "specs/system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release/goal.md",
    "specs/system-skilled-doctor/007-overlay-framework-root-layout/goal.md",
    ".skilled/commands/doctor/assets/doctor-env.yaml"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Dimension | Location | Title | Finding class |
|----|----------|-----------|----------|-------|---------------|
| R1-P2-001 | P2 | correctness | `.skilled/commands/doctor/scripts/overlay-engine.cjs:478` | A sibling link that resolves back inside the tree is refused with the wrong reason | misleading-diagnostic |
| R2-P2-001 | P2 | security | `.skilled/commands/doctor/scripts/overlay-engine.cjs:2514` | `layoutLinks` paths escape the tree root unvalidated, and the relayout rollback now writes through them | path-safety hardening |
| R3-P2-001 | P2 | correctness | `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:88` | The commit gate can resolve the tree one level too deep and then report a missing engine instead of a missing manifest | misleading-diagnostic |
| R4-P2-001 | P2 | correctness | `barter/ai-speckit/overlays/overlay-manifest.json:7` | The committed overlay manifest pins an absolute local checkout path | portability |
| R5-P2-001 | P2 | security | `barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:2313` | Git write gate fails open and silently through its CLI entrypoint | security-hardening |
| R5-P2-002 | P2 | security | `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:73` | A missing prompt-card guard skips its check with no message | security-hardening |
| R6-P2-001 | P2 | security | `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs:4241` | The pinned-blob reader passes a manifest value to git without `--end-of-options` | security-hardening |
| R7-P2-001 | P2 | traceability | `specs/system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release/goal.md:62` | A checked completion criterion does not reproduce | traceability |
| R8-P2-001 | P2 | traceability | `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:45` | The three staged-list scans in pre-commit disagree on which change types they see | maintainability |
| R9-P2-001 | P2 | traceability | `specs/system-skilled-doctor/007-overlay-framework-root-layout/goal.md:93` | The packet's last completion criterion understates the phase count | traceability |

Every finding is `status: active` with `firstSeen` equal to `lastSeen`, so none is a regression of a prior fix and none was re-raised. Each finding's full claim-adjudication packet, case, scope proof and affected surface hints are in its iteration file under `iterations/`.

**Disposition.** All ten are open. R7-P2-001 is the one that holds the verdict at FAIL; the other nine are advisories that do not change the verdict.

## 4. Remediation Workstreams

**Gate lane -- the two changes that decide the verdict.**

- **WS-1 (R7-P2-001).** Amend `003-engine-docs-and-release/goal.md:62` so its third clause excludes `assets/` or anchors the `opt-in` pattern to the layout rule, then re-tick it from a clean run. This is the only change that closes `checklist_evidence` and lets a re-run converge to PASS.
- **WS-2 (R9-P2-001).** Reword `goal.md:93` to name the packet folder alone, or to name all eleven phases, so the criterion's wording matches what its command validates.

**P2 lane -- advisories, ordered by risk.**

- **WS-3 (R5-P2-001, R5-P2-002, R8-P2-001).** One change to `barter-git-write-gate.mjs:2313` and `:2317` so a `main()` rejection refuses an interesting git command and writes a note, matching `barter-git-write-gate.js:57-62`. One `else` arm at `pre-commit:73` so a missing card guard warns the way `:55` does. One decision at `pre-commit:45` and `:71` about whether a staged deletion should reach the card check, then the same filter on all three scans.
- **WS-4 (R2-P2-001, R6-P2-001).** Add `--end-of-options` at `overlay-engine.cjs:4241`, and extend `assertSafeToPlan` to cover `layoutLinks` and `replaces` the way it already covers the other plan fields.
- **WS-5 (R1-P2-001, R3-P2-001, R4-P2-001).** Two message fixes -- the sibling-link refusal at `:478` should say the link resolves back inside the tree, and the missing-engine refusal at `pre-commit:153` should carry a fix line -- and one portability fix: change `pin.checkout` to the relative form the docs recommend.

## 5. Spec Seed

- The packet's phase 006 goal should record that a hook entrypoint's failure mode is part of the contract, not an implementation detail: the same evaluator must fail the same way through every entrypoint.
- The packet should state that a completion criterion is a command a later reader re-runs, so a pattern that can drift into a false hit is a defect in the criterion rather than in the tree.
- The packet should state that a criterion naming a count of folders is stale the moment a folder is added, and should name the parent folder or the full list instead.
- The packet should record that a manifest field reaching a subprocess is untrusted input even when the manifest is committed.

## 6. Plan Seed

1. Amend `003-engine-docs-and-release/goal.md:62` to exclude `assets/` or anchor the `opt-in` pattern to the layout rule, then re-tick it from a clean run.
2. Reword `goal.md:93` to name the packet folder alone, or to name all eleven phases.
3. Fix the two hook fail-open arms and the card-guard skip, with one test each.
4. Add `--end-of-options` to the pinned-blob reader and extend `assertSafeToPlan`.
5. Correct the two misleading diagnostics.
6. Switch `pin.checkout` to the relative form and re-run `status --audit`.
7. Re-run `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` and `validate.sh --recursive --strict` outside this lineage.

## 7. Traceability Status

**Core protocols.**

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `checklist_evidence` | partial | Five of the packet's six criteria executed read-only and all five pass, including 262 engine tests with 0 failures; the sixth is `validate.sh --recursive --strict`, forbidden by this lineage's dispatch; the phase-003 tick R7-P2-001 still does not reproduce | One unsupported completion mark (R7-P2-001) and one unexecuted criterion |
| `spec_code` | pass | Criterion 2's two clauses match the code and the docs: `SKILL.md:5` prints `version: 1.2.0.0`, and `changelog/v1.2.0.0.md:16`, `:29` and `:57` each name `/doctor:overlay apply --relayout` | None |

**Overlay protocols.**

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `decision_alignment` | pass | Criterion 3 matches D4 exactly: `barter/ai-speckit/skilled/.skilled-overlays.json:1` prints `{ "overlayDir": "../overlays" }` and `ls -d barter-overlays` fails | None |
| `integration_naming` | pass | Criterion 5 names the guard surface and the engine answers on it: `--guard .skilled/skills/sk-git/sk-git-skilled/SKILL.md` exits 1 and its refusal names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md` | None |

**Criterion-by-criterion result.**

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 | pass | Executed: `tests 262`, `pass 262`, `fail 0`, `duration_ms 28548`; suites write only under `os.tmpdir()` (`overlay-engine-fixtures.cjs:63`) and the reviewed trees are clean afterwards |
| 2 | `SKILL.md:5` prints `version: 1.2.0.0`, and the changelog names `/doctor:overlay apply --relayout` | pass | `sed -n 5p` prints `version: 1.2.0.0`; the changelog names the command at `:16`, `:29` and `:57` |
| 3 | `.skilled-overlays.json` prints `{ "overlayDir": "../overlays" }`, and `ls -d barter-overlays` fails | pass | `cat` prints the object verbatim; `ls` reports `No such file or directory` |
| 4 | `status --json` reports `PASSED` and an empty `offLayout` | pass | `result: PASSED`, `overlayFolder: ../overlays`, `offLayout: []`, `in-sync: 488`, `check.checked 136 / ok 136 / miss 0` |
| 5 | `--guard` exits 1 and names a source under `../overlays/framework/` | pass | Exit 1; the refusal names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md` |
| 6 | `validate.sh --recursive --strict` prints `RESULT: PASSED` | not executed | Forbidden by this lineage's dispatch. Recorded as a limit, not a pass |

**`AC_COVERAGE`: exempt.** The target is a spec folder, but `implementation-summary.md` is absent from the packet root, so the lifecycle gate does not apply. No advisory is raised from this signal.

## 8. Deferred Items

- **`validate.sh --recursive --strict` was not run.** Forbidden by the dispatch. This is the packet's sixth completion criterion and it remains unverified by execution. It is the one criterion that keeps `checklist_evidence` from closing on execution alone.
- **Three frontier node-dimensions remain unreviewed.** F-1-002 has `maintainability` left, F-1-004 has `traceability` left, and F-1-006 has `maintainability` left. The reducer files these as `searchDebt` (3 entries, `disposition: deferred`). They are breadth, not correctness: every node already carries three of the four dimensions and all four dimensions are covered globally.
- **The `sniffPayload` patch path is untested.** `barter-overlay-guard-core.cjs:129-138` scans `command`, `input` and `patch` for `*** Add File:` markers, but the test exercises only `filePath` and `path` payloads. No evidence in this tree shows which field name the OpenCode patch tool uses, so the gap is recorded as unverified coverage rather than a finding.
- **The duplicated session-directory fallback is not a finding.** `barter-overlay-guard.js:26-28` and `barter-git-write-gate.js:34-36` carry the same three lines with no behavioural divergence; it is cleanup.
- **The `.git/hooks` symlink install mode is a latent hazard.** `pre-commit:6` computes `TREE_ROOT` as `$SCRIPT_DIR/../../..`, correct for the `core.hooksPath` install in use but one level high for a `.git/hooks` symlink. The repository does not use that mode.

## Dimension Expansion Map

- **Saturated directions:** none recorded. `divergence.saturatedDirections` is empty.
- **Completed pivots:** none. `divergence.completed` is empty.
- **Failed pivots:** none. `divergence.failed` is empty.
- **Audited overrides:** none. `divergence.overrides` is empty.
- **Council artifacts:** none. No divergent pivot ran, so no Council artifact exists for this lineage.
- **Selected review directions:** the three seeded depth-1 nodes, F-1-002 (engine path safety and remedies), F-1-004 (Barter hooks), and F-1-006 (Barter re-pin and vendored parity).
- **Remaining frontier:** F-1-002 `maintainability`, F-1-004 `traceability`, F-1-006 `maintainability`. `divergence.remainingFrontier` is empty because the reducer files this breadth as `searchDebt` rather than as a divergence direction.

This section records breadth only. It does not alter the verdict, `hasAdvisories`, the finding registry, or the adversarial self-check results.

## 9. Search Ledger

**`searchCoverage`.** Required bug classes for iteration 9: `stale_criterion`, `unreproducible_tick`, `unexecuted_criterion`, `regressed_criterion`. Covered: `stale_criterion`, `unreproducible_tick`, `unexecuted_criterion`. Ruled out: `regressed_criterion`. Deferred: none. Blocked: none. `graphCoverageMode: graphless_fallback`.

**`candidateCoverage`.** Covered classes across the run: `argument_injection`, `fail_open`, `inconsistent_filter`, `misleading-diagnostic`, `partial-failure`, `path_traversal`, `portability`, `silent_skip`, `stale_checklist`, `stale_criterion`, `unexecuted_criterion`, `unreproducible_tick`. Ruled out: `broken_cross_reference`, `bypass_path`, `doc_code_drift`, `duplicated_logic`, `guard_bypass`, `leftover_reference`, `missing_remedy`, `pin_mismatch`, `regressed_criterion`, `regressed_fix`, `secret_exposure`, `secret_leak`, `shell_injection`, `stale_comment`, `supply_chain_drift`, `test_gap`.

**`searchDebt`.** Three entries, all `disposition: deferred`, all `frontier: true`: `frontier-F-1-002` (maintainability), `frontier-F-1-004` (traceability), `frontier-F-1-006` (maintainability). `hasSearchDebt: true`. The verdict already counts this debt: it would make the verdict CONDITIONAL on its own, and the failed coverage gate makes it FAIL.

**`ruledOutCandidates`.** The sixteen classes listed above, each with the iteration that ruled it out recorded in the delta's `ruled_out` rows.

**`cleanSearchProof`.** Every iteration recorded at least one `ruled_out` row, and the reducer reported `corruptionCount: 0` on every pass. No iteration closed with an empty search ledger.

## 10. Audit Appendix

**Convergence.** `newFindingsRatio` by iteration: 1.0, 0.5, 0.333, 0.25, 0.333, 0.143, 0.125, 0.111, 0.1. The reducer's `convergenceScore` finished at 0.9 against a 0.10 threshold, so the run did not converge on the score. It stopped because the coverage gate vetoed STOP and neither cause is fixable inside this lineage's write surface. The terminal-gates row carries `stopReason: converged` because the ledger schema's enum has no `blockedStop` value and the workflow's own rule maps every non-cap, non-manual, non-error stop to `converged`; the blocked state is recorded durably in the separate `deep_review.blocked_stop_recorded` row with `blockedGateIds: ["coverage"]`. That row, not the label, is the honest record of why this run stopped.

**Terminal gates.** `evidence: pass` (`all-findings-cited`), `scope: pass` (`all-findings-in-scope`), `coverage: fail` (`traceability-incomplete`). `failedRequiredGateIds: ["coverage"]`.

**Replay validation.** The reducer was re-run after every gateway append and reported `corruptionCount: 0` on every pass. The ledger holds thirteen events: one config row, nine iteration records, one blocked-stop row, one terminal-gates row, and the prior generation's synthesis row. Each iteration record carries the full route proof (`mode=review`, `target_agent=deep-review`, `agent_definition_loaded=true`, `resolved_route`). Each delta's first row is byte-identical to the record handed to the gateway.

**Coverage.** correctness (iterations 1, 3, 4), security (2, 5, 6), traceability (7, 9), maintainability (8). All three frontier nodes carry three of the four dimensions.

**Prior-generation re-verification.** All 16 prior findings were re-checked against the current tree and all 16 are fixed. The evidence is in the `Confirmed-Clean Surfaces` section of each iteration file.

**Cross-reference appendix -- core protocols.** `checklist_evidence` partial, `spec_code` pass. See section 7.

**Cross-reference appendix -- overlay protocols.** `decision_alignment` pass, `integration_naming` pass. See section 7.

**Recorded conflict -- the config status.** The loop protocol's synthesis step asks for `status: "complete"` in `deep-review-config.json`. The `@deep-review` persona's write-safety table lists the config as read-only and forbids writing it. The persona's limit was followed: the config was left untouched, and the completed status is carried by the ledger and the dashboard the reducer derives from it. This conflict is recorded here rather than resolved silently.

**Recorded conflict -- the generation field.** `deep-review-config.json` carries `generation: 2`, while every iteration record carries `generation: 1`. The records keep `1` so the state log stays internally consistent. The reducer does not key on generation, so nothing downstream changes. Recorded in `iterations/iteration-009.md` under Edge Cases.

**Dimension rotation note.** Iteration 8 kept the reducer's node (F-1-004) but took maintainability rather than the traceability dimension the projection named, because traceability was already covered and maintainability was the only dimension still listed as remaining. Iteration 9 was steered by `reviewUnfinishedCoreProtocols`, which named `checklist_evidence` as the one core protocol the stop still owed. Both are recorded in their iteration files under Edge Cases.

**Resource Map Coverage Gate.** Skipped: `resource_map_present` is `false` in `deep-review-config.json`, so the gate has no map to cross-check. The reducer still emitted a deterministic map at `resource-map.md` from the converged deltas, and it is available for a later gate run.

**Continuity save.** Not performed. The dispatch forbids running `generate-context.js`, so `phase_save` was skipped and the packet's continuity is carried by this report and the ledger rather than by a regenerated context file.

**Write surface.** Every file this run created or modified sits under `specs/system-skilled-doctor/007-overlay-framework-root-layout/review/lineages/deepseek-flash-max`. No review target, config, registry, reducer output, dashboard, report, command, skill, canonical agent or runtime mirror was modified by this run. The engine suites were executed and left the three reviewed trees byte-clean.
