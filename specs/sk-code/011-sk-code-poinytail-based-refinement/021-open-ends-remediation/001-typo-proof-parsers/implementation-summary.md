---
title: "Implementation Summary"
description: "Every script the silent input sweep flagged now stops on an unknown or misspelled option, and every detected problem exits non-zero, so a typo can no longer turn a check into a silent pass."
trigger_phrases:
  - "typo proof parsers implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/001-typo-proof-parsers"
    last_updated_at: "2026-10-11T21:30:00Z"
    last_updated_by: "builder"
    recent_action: "Fixed the five P2 review findings and reran the gates"
    next_safe_action: "Integrator merges the branch"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/reject-unknown-options.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-021-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-typo-proof-parsers |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A misspelled option in any of the 63 flagged scripts now stops the run with one line naming it and a non-zero exit. Before, a typo of `--check` could fall into a write path, and ten checks printed a problem and still exited 0, so a gate that called them read a failure as a pass.

### Phase 1: typo-proof-parsers

Each parser checks its arguments against its own option list and refuses the first one it does not know. The exit code is the script's existing usage code where it already had one, and 2 otherwise. The ten class 2 scripts now exit non-zero on the path where they already detected the problem. The four rows the review could not reproduce were each reproduced in a throwaway location under the session scratchpad first, then fixed.

### Recommendation Ledger

| ID | Status | Proof |
|----|--------|-------|
| F1 | Fixed | T1 case `check-agent-mirror-sync.cjs rejects an unknown option --bogus-xyz` passes, asserts exit 2; the `--al` case also exits 2 and `--all` still runs |
| F2 | Fixed | T3 case `render-screenshots.cjs refuses a misspelled --check and captures no screenshots` passes, asserts exit 2 |
| F3 | Fixed | T4 case `guided-run.ts rejects a misspelled --dryru instead of running a live extraction` passes; the parser throws `Unknown option` with usage |
| F4 | Fixed | T5 case `build-rule-cards.cjs rejects the misspelled --chekc flag` passes, asserts exit 2 |
| F5 | Fixed | T5 case `validate-compiled-routing-scenarios.cjs rejects the misspelled --strct flag` passes, asserts exit 2 |
| F6 | Fixed | T6 case `loop-lock.cjs acquire rejects a misspelled --ttl-ms and leaves no lock behind` passes, asserts exit 3, the script's existing INPUT_VALIDATION code |
| F7 | Fixed | T6 case `render-contract-snapshot.cjs rejects a misspelled --check` passes, asserts exit 2 |
| F8 | Fixed | T6 case `convergence.cjs rejects a misspelled --read-only` passes, asserts exit 3, JSON error with code INPUT_VALIDATION on stdout |
| F9 | Fixed | T6 case `append-state-record.cjs rejects an unknown flag without creating a file named after it` passes, asserts exit 2 |
| F10 | Fixed | T6 case `status.cjs rejects a misspelled --read-only` passes, asserts exit 3, JSON error with code INPUT_VALIDATION on stdout |
| F11 | Fixed | T7 case `derive-command-bridges.cjs rejects a misspelled --chek` passes, asserts exit 2; no file is written |
| F12 | Fixed | T8 case `generate-context.js parseArguments rejects a misspelled --session-id` passes; parseArguments throws `Unknown option`, which the CLI turns into exit 1 |
| F13 | Fixed | T8 case `generate-description.js rejects a misspelled --description` passes, asserts exit 1, the script's existing argument error code |
| F14 | Fixed | T8 case `env-reader-table.mjs rejects a misspelled --check` passes, asserts exit 2 |
| F15 | Fixed | T1 case `speckit-completion.cjs rejects a misspelled --strict (--strcit)` passes, asserts exit 1, the script's existing usage code |
| F16 | Fixed | T1 case `compiled-route.cjs rejects an unknown --bogus-xyz option` passes, asserts exit 2; compiled-route-guard.cjs and compiled-route-status.cjs have matching cases, both exit 2 |
| F17 | Fixed | T1 case `parent-skill-check.cjs rejects an unknown --bogus-xyz option after the target` passes, asserts exit 2, EXIT_CHECKER_ERROR |
| F18 | Fixed | T2 case `check-dist-staleness.sh rejects a misspelled --bogus-xyz flag` passes, asserts exit 2 |
| F19 | Fixed | T2 case `check-comment-hygiene.sh exits 3 when its input file does not exist` passes, asserts exit 3; 3 because the commit hook already reads 2 as a skipped file |
| F20 | Fixed | T2 case `minify-webflow.mjs rejects a misspelled --forse flag` passes, asserts exit 2 |
| F21 | Fixed | T2 case `check-review-final-line.js rejects a misspelled --bogus-xyz flag` passes, asserts exit 2; check-review-findings.js has the matching case |
| F22 | Fixed | T2 case `check-rule-copies.js rejects a misspelled --bogus-xyz flag` passes, asserts exit 2; a bare `--root` also exits 2 |
| F23 | Fixed | T3 case `check-corpus.cjs refuses a misspelled flag instead of running the check` passes, asserts exit 2; verify-router-sync.cjs is covered in T2, exit 2 |
| F24 | Fixed | T3 case `check-diagram-corpus.cjs refuses a misspelled --extra instead of running the check` passes, asserts exit 2 |
| F25 | Fixed | T5 case `validate-doc-model-refs.js rejects the unknown --bogus-xyz flag` passes, asserts exit 2 |
| F26 | Fixed | T5 case `frontmatter-version.mjs rejects the unknown --bogus-xyz flag with its usage status 64` passes, asserts exit 64, the script's existing usage code |
| F27 | Fixed | T4 case `build-write-prompt.ts exits 1 and names an unreadable --study-context path` passes, asserts exit 1 |
| F28 | Fixed | T5 case `lint-goal-criteria.cjs rejects the misspelled --alu flag` passes, asserts exit 2 |
| F29 | Fixed | T5 case `ci-leaf-manifest-freshness.cjs rejects the unknown --bogus-xyz flag` passes, asserts exit 2 |
| F30 | Fixed | T5 case `ci-skill-derived-freshness.cjs rejects the unknown --bogus-xyz flag` passes, asserts exit 2 |
| F31 | Fixed | T5 case `ci-skill-root-metadata.cjs rejects the unknown --bogus-xyz flag` passes, asserts exit 2; `--format yaml` also exits 2 |
| F32 | Fixed | T5 case `check-repo-rules.cjs rejects the unknown --bogus-xyz flag` passes, asserts exit 2 |
| F33 | Fixed | T5 case `ci-router-vocabulary-reach.cjs rejects the unknown --bogus-xyz flag` passes, asserts exit 2 |
| F34 | Fixed | T5 case `validate-playbook-topology.cjs rejects the misspelled --strct flag` passes, asserts exit 2 |
| F35 | Fixed | T5 case `generate-router-intent-signals.cjs rejects the unknown --bogus-xyz flag in check mode` passes, asserts exit 2; a bare `--hub` also exits 2 |
| F36 | Fixed | T5 case `generate-leaf-manifest.cjs rejects the unknown --bogus-xyz flag after --check` passes, asserts exit 2 |
| F37 | Fixed | T6 case `advise-council-completion.cjs rejects an unknown flag` passes, asserts exit 2 |
| F38 | Fixed | T6 case `query.cjs rejects a misspelled --read-only` passes, asserts exit 3, JSON error with code INPUT_VALIDATION on stdout |
| F39 | Fixed | T6 case `check-documentation-drift.cjs rejects an unknown flag` passes, asserts exit 2; check-projection-coverage.cjs and check-protocol-append-sites.cjs have matching cases, exit 2 |
| F40 | Fixed | T6 case `fanout-merge.cjs rejects an unknown flag` passes, asserts exit 3, JSON error with code INPUT_VALIDATION on stdout |
| F41 | Fixed | T6 case `upsert.cjs rejects a misspelled --seed-source` passes, asserts exit 3, JSON error with code INPUT_VALIDATION on stdout |
| F42 | Fixed | T7 case `verify-zombie-soak.sh rejects a misspelled --bogus-xyz` passes, asserts exit 2 |
| F43 | Fixed | T7 case `check-prompt-quality-card-sync.sh rejects a misspelled --bogus-xyz` passes, asserts exit 2 |
| F44 | Fixed | T7 case `build-holdout.mjs rejects a misspelled --wrtie` passes, asserts exit 2; the three sibling routing-accuracy scripts have matching cases |
| F45 | Fixed | T8 case `smart-router-measurement.js rejects a misspelled --no-record-telemetry` passes, asserts exit 2 |
| F46 | Fixed | T8 case `generate-command-routers.cjs rejects a misspelled flag` passes, asserts exit 2 |
| F47 | Fixed | T8 case `dist-freshness.cjs exits 1 when check detects an unknown package` passes, asserts exit 1 |
| F48 | Fixed | T8 case `dist-freshness.cjs keeps exit 64 and names a misspelled flag in check-all` passes, asserts exit 64, the script's existing usage code |
| F49 | Fixed | T8 case `check-markdown-links.cjs rejects a misspelled flag` passes, asserts exit 2 |
| F50 | Fixed | T8 case `smart-router-analyze.js rejects a misspelled flag and leaves its workspace untouched` passes, asserts exit 2 |
| F51 | Fixed | T8 case `process-sweep.js rejects a misspelled flag after the plan subcommand` passes, asserts exit 2; process-memory-harness.js has the matching case |
| F52 | Fixed | T8 case `is-phase-parent.js exits 2 when the check command is missing its folder` passes, asserts exit 2; an unknown command also exits 2 |
| F53 | Fixed | T8 case `check-frontmatter-values-helper.cjs exits 2 and names an unreadable input` passes, asserts exit 2 |
| F54 | Fixed | T8 case `check-source-tags-helper.mjs rejects a misspelled flag` passes, asserts exit 2 |
| F55 | Fixed | T8 case `check-native-modules.sh exits 1 when the version marker is missing` passes, asserts exit 1 |
| F56 | Fixed | T8 case `check-graph-metadata-child-drift.sh warns when the child scanner crashes` passes; RULE_STATUS is warn instead of pass |
| F57 | Fixed | T8 case `inline-gate-renderer.sh rejects a misspelled flag` passes, asserts exit 2; the JavaScript fallback has the matching case |
| F58 | Fixed | T8 case `unactioned-recorded-failure-audit.mjs rejects a misspelled flag` passes, asserts exit 2; a missing input also exits 2 |
| F59 | Fixed | T8 case `ephemeral-pointer-audit.mjs rejects a misspelled flag` passes, asserts exit 2; a missing target also exits 2 |
| F60 | Fixed | T8 case `validate-command-tree-parity.sh keeps exit 64 when a required side is missing` passes, asserts exit 64, the script's existing usage code |
| F61 | Fixed | T8 case `template-phrase-lint.mjs answers --help with usage instead of a scan` passes; `--help` prints usage and exits 0, a misspelled flag exits 2 |
| F62 | Fixed | T8 case `strict-pass-freshness.ts rejects a --roots value shaped like a flag` passes, asserts exit 2 |
| F63 | Fixed | T8 case `repo-era.mjs answers --help with usage instead of a JSON report` passes; `--help` prints usage and exits 0, a misspelled flag exits 2 |
| F64 | Fixed | T8 case `evidence-marker-audit.ts rejects a misspelled flag alongside --folder=...` passes, asserts exit 2; the space form `--folder <path>` is now accepted |
| U1 | Fixed | T9 case `create reports a failed provision as a non-zero exit` passes, asserts exit 3. Reproduced first in the throwaway repo `r1-u1-repo` under the session scratchpad: a stub npm that fails made `create_named_worktree` print `worktree created but provisioning failed` and return 0 |
| U2 | Fixed | T10 case `a dry run whose target name is taken fails, skips the pair` passes, asserts exit 1. Reproduced first in the throwaway repo `r1-u2-repo` under the session scratchpad: a collision was skipped, the dry run returned 0 and the summary still said `1 legacy pair(s) planned` |
| U3 | Fixed | T6 case `codex-dispatch.cjs rejects the misspelled --modell` passes, asserts exit 2. Reproduced first with a PATH holding only node (`r1-u3bin` under the session scratchpad): `--modell my-model --sandbx` were ignored and the default model ran |
| U4 | Fixed | T7 case `init-skill-graph.sh rejects a misspelled --bogus-xyz before doing any work` passes, asserts exit 2. Reproduced first on a copy in `r1-u4-copy` under the session scratchpad: `--bogus-xyz` went on to `Validating graph metadata` |

The extra row the orchestrator added, recorded here outside the 68 so the goal count stays exact:

| ID | Status | Proof |
|----|--------|-------|
| X1 | Fixed | T8 case `create.sh --help lists the --path option` passes; `create.sh --help` now prints `--path <dir>  Create the spec folder at this exact repo-relative path (implies --skip-branch)` |

### Tests

Each file below was written before the fix and run against the unfixed scripts first.

| Test | File | Before | After |
|------|------|--------|-------|
| T1 | `.skilled/bin/tests/typo-flags.test.cjs` (node --test, 10 cases) | before: exit 1 | after: exit 0 |
| T2 | `.skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh` (9 cases) | before: exit 1 | after: exit 0 |
| T3 | `.skilled/skills/sk-design/sk-design-chart/scripts/tests/typo-flags.test.cjs` (3 cases) | before: exit 1 | after: exit 0 |
| T4 | `.skilled/skills/sk-design/sk-design-md-generator/backend/tests/typo-flags.test.ts` (vitest, 3 cases) | before: exit 1 | after: exit 0 |
| T5 | `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/typo-flags.test.cjs` (15 cases) | before: exit 1 | after: exit 0 |
| T6 | `.skilled/skills/system-deep-loop/runtime/tests/unit/typo-flags.vitest.ts` (14 cases) | before: exit 1 | after: exit 0 |
| T7 | `.skilled/skills/system-skill-advisor/runtime/tests/typo-flags.vitest.ts` (8 cases) | before: exit 1 | after: exit 0 |
| T8 | `.skilled/skills/system-spec-kit/runtime/cli/tests/typo-flags.vitest.ts` (32 cases) | before: exit 1 | after: exit 0 |
| T9 | `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` (new failed-provision case) | before: exit 1 | after: exit 0 |
| T10 | `.skilled/skills/sk-git/scripts/tests/migrate-legacy-branch-names.test.sh` (new file) | before: exit 1 | after: exit 0 |


### Shared Helper Decision

- **JavaScript, system-deep-loop runtime:** `assertKnownFlags(args, knownKeys, makeInputError)` joins the existing `runtime/scripts/lib/cli-guards.cjs`. Six callers in the same folder already import that file: `convergence`, `status`, `query`, `upsert`, `fanout-merge` and `loop-lock`. No new import edge crosses a skill.
- **JavaScript (ESM), system-skill-advisor routing accuracy:** `routing-accuracy/reject-unknown-options.mjs` exports `rejectUnknownOptions(scriptUrl, knownOptions)` for `build-holdout`, `capture-scorer-eval-baseline` and `derive-ambiguity-slice`. `capture-local-native-divergence-ledger.mjs` keeps an inline copy because its parity test copies that one file alone into a temp tree, where a relative import cannot resolve.
- **Everything else stays inline.** No other language or skill reached three callers that share one parser shape. The sk-doc `findUnknownOption` pattern repeats in only two scripts, `build-rule-cards.cjs` and `check-repo-rules.cjs`, which prevent-overengineering treats as below the bar.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| The 63 scripts named in the spec ledger, plus `compiled-route-guard.cjs`, `compiled-route-status.cjs`, `check-review-findings.js`, `verify-router-sync.cjs`, `process-memory-harness.ts`, the three advisor routing-accuracy siblings and the `inline-gate-renderer.sh` fallback | Modified | Rejecting branch or non-zero exit |
| `runtime/scripts/lib/cli-guards.cjs` (deep-loop) and `routing-accuracy/reject-unknown-options.mjs` (advisor) | Modified, Created | The two shared helpers above |
| The ten test files in the Tests table | Created or Modified | Typo-flag and failing-input cases |
| `sk-doc/sk-create-goal/scripts/tests/lint-goal-criteria.test.cjs` | Modified | Its bad-option case asserted the old exit 0; it now asserts 2 |
| `SKILL.md`, `README.md`, hub carriers, `.hermes` mirrors and one `changelog/` entry for sk-code, sk-design, sk-doc, sk-git, system-deep-loop, system-skill-advisor and system-spec-kit (mcp-tooling follows from the review fix) | Modified, Created | One version bump per touched skill |
| `mcp-tooling/feature-catalog/feature-catalog.md` and the mcp-tooling version carriers | Modified, Created | Review fix: the root metadata command drops `--check`, with one bump and changelog entry |
| `deep-ai-council/scripts/tests/advise-council-completion.vitest.ts` | Modified | Its unknown-argument case asserted the old exit 0; it now asserts 2 |
| Five hub activation manifests, served and authored copies | Modified | Re-minted after the hub version bump changed the policy hash |
| `system-spec-kit/runtime/data/trigger-index.json` and the retrieval corpus manifest | Modified | Regenerated for the new changelog entries |
| `.skilled/commands/deep/assets/compiled/` contracts for review, research and ai-council | Modified | Recompiled, since they record a digest of the deep-loop `SKILL.md` and mode registry the bump changed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every script change and test came from short single-purpose DeepSeek V4.1 Flash dispatches through cli-pi at max effort, each diff read before the next. One file-mode slip was fixed by hand: a dispatch dropped the exec bit on `worktree-naming.test.sh`, and `chmod 755` restored it. Each script's callers in hooks, workflows and other scripts were searched before its change. Every executable caller passes only known options. One documented command in the mcp-tooling feature catalog passed `--check` to `ci-skill-root-metadata.cjs`, which never had that option; the review fix below drops it from the catalog line.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep each script's existing usage code instead of a global exit 2 | Operator decision: consistency inside one script beats one number across all of them. That gives 64 for `frontmatter-version.mjs`, `dist-freshness.cjs` and `validate-command-tree-parity.sh`, and 1 for `speckit-completion.cjs` and `generate-description` |
| Deep-loop parseArgs scripts report an unknown option as their existing JSON `INPUT_VALIDATION` error on stdout, exit 3 | The same operator decision. The spec's risk row suggested exit 2 on the JSON error, but those scripts already map input errors to 3 through `classifyExitCode`, and callers parse that JSON from stdout |
| `check-comment-hygiene.sh` exits 3 on an unreadable input | Exit 2 already means a staged file was skipped, and the commit hook treats 2 as a pass |
| `worktree-naming.sh create` exits 3 after a failed provision, still printing the branch and path | The worktree exists, so callers need its name to clean up or retry |
| Left `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` unchanged | It is a byte-identical served copy of an archived authored source, and `compiled-route-sync --check` verifies the pair. The live front door `compiled-route.cjs` carries the fix |
| Left the two spec-listed pass-through exceptions alone | The `exec node` line in `inline-gate-renderer.sh` forwards to a parser that now rejects, and the compiled `dist` files were rebuilt from fixed sources. No further wrapper was found |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Typo-flag tests T1 to T10 | All exit 0 after the change, all exited 1 before it |
| `compiled-route-sync.cjs --check` | PASS, all 55 served copies match their authored files |
| `compiled-route-guard.cjs` | PASS, exit 0 after the manifest re-mint |
| `all-canaries.cjs` | PASS, all hubs failures 0 |
| Hermes skill and prompt sync `--check` | PASS, 68 skill copies and 35 prompts in sync |
| Trigger index `--check` | PASS after regeneration |
| `parent-skill-check.cjs` on the four hubs | OK, all hard invariants passed, 0 warnings |
| Deep-loop runtime vitest | 165 files, 2704 passed, 8 skipped, exit 0 |
| Deep-loop council vitest | 10 files, 120 passed, exit 0 |
| Spec-kit runtime vitest | 4016 passed, 5 failed: all five were the stale compiled contracts, now recompiled, and both files pass on rerun |
| Spec-kit spec validation and cli workspace tests | Exit 0 |
| Advisor runtime, sk-git, sk-code, sk-design chart and styles, sk-doc node tests | Exit 0 |
| sk-doc Python tests | All pass; `test_rename_tooling_fixture_harness.py` first failed because this tree changed during its run, and passed (OK) when rerun on a still tree |
| Other touched skill suite failures | See Known Limitations; both predate this change |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:review -->
## Deep Review

`/deep:review :auto` ran five iterations over the build commit with one cli-pi lineage on DeepSeek V4.1 Flash at max effort, stop policy max-iterations. Artifacts are in `review/`, and the lineage report is `review/lineages/dsflash-llmgw/review-report.md`. Verdict PASS with advisories: P0 0, P1 0, P2 5. Each finding was reproduced with a command before it was fixed.

| Finding | Confirmed by | Fix |
|---------|--------------|-----|
| P2: `advise-council-completion.cjs . --jso` still exited 0 | That command printed `unknown argument: --jso`, exit 0 | An unknown flag in any position now takes the existing exit-2 path; T6 gained a case and the council test that pinned exit 0 now asserts 2 |
| P2: the mcp-tooling catalog line `ci-skill-root-metadata.cjs --skills-dir .skilled/skills --check` exits 2 | That command printed `unknown option: --check`, exit 2 | The catalog line drops `--check`; mcp-tooling bumped to 1.8.2.0 with one changelog entry |
| P2: this summary named `--skills-dir` as the rejected option | The script reads `--skills-dir` and rejects `--check` | Corrected in How It Was Delivered; the limitation is closed by the catalog fix |
| P2: `verify-router-sync.cjs --bogus-xyz` printed `(unknown: none given)` after naming the option | That command's second line | The unknown-option usage line drops the suffix, which stays on the `--checks` value path; T2 gained a check |
| P2: a bare `--format` printed `unknown --format value: undefined` in two sk-doc CI checks | Both commands, exit 2 | Both now print `--format needs one of: text, json`; T5 gained two cases |

The new test cases were written and run first: T2, T5 and T6 each exited 1 before the fixes and 0 after them.
<!-- /ANCHOR:review -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Suite failures unrelated to this change.** `sk-doc/scripts/tests/test-flowchart-validator.sh` calls `validate-flowchart.sh`, which does not exist at the base commit either, so it exits 127. Four sk-design backend test files need the `playwright` and `culori` packages, which this checkout does not have installed.
<!-- /ANCHOR:limitations -->

---
