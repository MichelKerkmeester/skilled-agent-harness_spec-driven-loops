---
title: "Feature Specification: Typo-proof parsers"
description: "Make every CLI script the silent input sweep flagged reject an unknown or misspelled option with exit 2, and make the ten scripts that exit 0 on a detected problem exit non-zero."
trigger_phrases:
  - "typo proof parsers"
  - "phase 1 typo proof parsers"
  - "reject unknown cli options"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Typo-proof parsers

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/111-open-ends-integration` (scaffold); the builder works in its own worktree branched from the scaffold commit |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-onboarding-fixes |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the open ends remediation. It builds every confirmed finding in `specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/005-silent-input-sweep/review/review-report.md`: 14 P1 and 50 P2, 64 rows across 63 scripts.

**Scope Boundary**: The argument parsers and exit paths of the scripts named in the ledger below, their tests, and one version bump per touched skill. No script gains a new option.

**Dependencies**:
- The review report's section 3 reproduction commands, which serve as the before-and-after proof.
- A throwaway worktree or a `/tmp` copy for the four rows the review could not reproduce.

**Deliverables**:
- A rejecting branch in each parser and a non-zero exit on each detected-problem path.
- Tests that pass a misspelled flag or a failing input and assert the exit code.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
54 scripts accept an unknown or misspelled option and carry on. In five of them a typo of `--check` falls into the write path and exits 0. Ten more scripts detect a problem and still exit 0, so a gate that calls them reads a failure as a pass.

### Purpose
A typo in any listed script stops the run with a one-line error and exit 2, and every detected problem exits non-zero.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every row in the three ledger tables below.
- One rejecting branch per parser: an unknown or misspelled option prints one line naming it on stderr and exits 2. Each script keeps its own option list.
- The ten class 2 rows exit non-zero on the path where the problem is already detected.
- The four rows the review could not reproduce: prove each in a throwaway worktree or `/tmp` copy, then fix it or close it with the proof.
- A decision on one tiny shared helper per language, since the same fix repeats across about 54 scripts. The helper only rejects names outside the list a script passes it. Prevent-overengineering backs it at three or more callers in one language that can import it without crossing a skill boundary they do not already cross; below that, the branch stays inline.

### Out of Scope
- The eight dropped findings and the two valueless-flag notes in the report's sections 8 and 9. They are outside both defect classes.
- New options, new modes or changed defaults in any script.

### Pass-through Exceptions

A deliberate pass-through wrapper may forward unknown options, because the script it calls owns the option list and rejects them. The builder adds any further wrapper found while working, with its reason, to this table.

| Script | Reason |
|--------|--------|
| `.skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh:15` | The `exec node ... "$@"` line hands every argument to `inline-gate-renderer.ts`, which F57 makes reject unknown options. The fallback renderer at line 293 is not an exception: it parses options itself, so F57 covers it too |
| Compiled `runtime/cli/dist/**/*.js` files | Build output of the `.ts` sources in F12, F13, F45, F50, F51 and F52. The fix goes in the source and the dist is rebuilt; the dist file has no option list of its own |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| The 63 scripts named in the Location column below | Modify | Rejecting branch or non-zero exit |
| Tests beside each script's existing tests, or a new test file where none exists | Create or Modify | Misspelled-flag and failing-input cases |
| `.skilled/skills/<skill>/SKILL.md` and `changelog/` for each touched skill | Modify, Create | One bump per touched skill |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every class 1 row rejects an unknown or misspelled option | The row's reproduction command, rerun with the misspelled flag, prints one error line and exits 2 |
| REQ-002 | Every class 2 row exits non-zero on its detected problem | The row's reproduction command exits non-zero |
| REQ-003 | Every row in the recommendation ledger ends Fixed with a command proof or Closed with a written reason | The ledger lines in `implementation-summary.md` follow the format above, one per row |
| REQ-004 | Changed behavior has tests that fail before the change | Each Tests table line shows a non-zero exit before and exit 0 after |
| REQ-005 | Each touched skill is bumped once, with a changelog entry | One new file under `.skilled/skills/<skill>/changelog/` and one `version:` change in its `SKILL.md` per touched skill |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The four unreproduced rows are proven in a throwaway location before any change | Each U row's ledger line names the throwaway path and what the run printed |
| REQ-007 | The shared-helper decision is recorded | `implementation-summary.md` names each helper and its callers, or says why the branch stays inline |

### Recommendation Ledger: Class 1, Unknown Option Accepted (54 rows)

| ID | Severity | Location | Recommendation |
|----|----------|----------|----------------|
| F1 | P1 | `.skilled/bin/check-agent-mirror-sync.cjs:74` | Reject any argument that is neither --all nor an agent path with usage and exit 2, so a typo cannot turn the pre-commit and CI mirror gate into a vacuous pass |
| F2 | P1 | `.skilled/skills/sk-design/shared/scripts/render-screenshots.cjs:174` | Reject every --flag other than --check and --full-page with usage and exit 2 before the mode is chosen |
| F3 | P1 | `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/guided-run.ts:102` | Throw the usage error for any --flag outside VALUE_FLAGS and BOOLEAN_FLAGS instead of skipping it, so a --dry-run typo cannot start a live extraction |
| F4 | P1 | `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/build-rule-cards.cjs:228` | Reject flags other than --root and --check with usage and exit 2 before line 228 picks the write path |
| F5 | P1 | `.skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs:387` | Add an unknown-option branch to parseArgs that prints usage and exits 2, so a --strict typo cannot leave detected FAILs at exit 0 |
| F6 | P1 | `.skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:151` | Validate parsed flag names against the subcommand's known set and exit 2 on any other, so a --ttl-ms typo cannot silently shorten the lock lease |
| F7 | P1 | `.skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs:507` | Reject any argument other than --check with usage and exit 2 before run() chooses the write path |
| F8 | P1 | `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:680` | Reject parsed keys outside the documented flag set with an INPUT_VALIDATION error, so a --read-only typo from /doctor:deep-loop cannot write to the graph store |
| F9 | P1 | `.skilled/skills/system-deep-loop/runtime/scripts/append-state-record.cjs:77` | Exit 2 with usage when the state-log argument starts with --, so a flag-shaped token never becomes the output path |
| F10 | P1 | `.skilled/skills/system-deep-loop/runtime/scripts/status.cjs:121` | Reject parsed keys outside the documented flag set with an INPUT_VALIDATION error, the same branch convergence.cjs needs |
| F11 | P1 | `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:387` | Reject any argument other than --check with usage and exit 2 before main() chooses the write path |
| F12 | P1 | `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:962` | Throw on any unrecognized --flag in parseArguments instead of pushing it to filteredArgv, so a misspelled --session-id or --planner-mode stops the save |
| F13 | P1 | `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/generate-description.ts:103` | Reject flags other than the documented ones with usage and exit 2, so a --description typo cannot silently overwrite caller text with derived text |
| F14 | P1 | `.skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs:116` | Accept only --check, --write and --print (or no argument) and exit 2 with usage on anything else |
| F15 | P2 | `.skilled/bin/speckit-completion.cjs:40` | Treat any token that starts with -- and is not a known flag as a usage error (exit 2) instead of a positional |
| F16 | P2 | `.skilled/bin/compiled-route.cjs:28` | Reject unknown flags in main() with usage and exit 2; resolve.cjs, compiled-route-guard.cjs and compiled-route-status.cjs share the indexOf pattern |
| F17 | P2 | `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1931` | Exit 2 with usage when more than one argument is passed or the argument starts with -- |
| F18 | P2 | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:197` | Reject an argument that starts with -- and is not --all with usage and exit 2 before it is treated as a file path |
| F20 | P2 | `.skilled/skills/sk-code/sk-code-webflow/assets/scripts/minify-webflow.mjs:37` | Reject any argument other than --force with usage and exit 2 |
| F21 | P2 | `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:100` | Exit 2 with usage when more than one argument is passed; check-review-findings.js:87 needs the same branch |
| F22 | P2 | `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:160` | Reject flags other than --root, and a --root with no value, with usage and exit 2 |
| F23 | P2 | `.skilled/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs:3519` | Reject flags outside --families, --render and --extra with usage and exit 2; verify-router-sync.cjs needs the same branch |
| F24 | P2 | `.skilled/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs:108` | Reject flags other than --extra with usage and exit 2 |
| F25 | P2 | `.skilled/skills/sk-doc/scripts/validate-doc-model-refs.js:317` | Reject flags other than --verbose and --help with usage and exit 2 |
| F26 | P2 | `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:377` | Add a final else to the option loop that throws on an unknown flag, so the post-edit hook's gate rejects typos |
| F29 | P2 | `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:54` | Add an else branch to parseArgs that prints usage and exits 2 |
| F30 | P2 | `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs:34` | Add an else branch to the argv loop that prints usage and exits 2 |
| F31 | P2 | `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:77` | Add an else branch to parseArgs that prints usage and exits 2, and validate --format values |
| F32 | P2 | `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs:61` | Reject flags other than --root with usage and exit 2 |
| F33 | P2 | `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:167` | Reject flags outside --hub, --limit, --json and --concurrency with usage and exit 2 |
| F34 | P2 | `.skilled/skills/sk-doc/sk-create-skill/scripts/validate-playbook-topology.cjs:483` | Add an unknown-option branch to the parser that prints usage and exits 2 (downgraded from P1: the tree has no blocked case, so the gate bypass did not reproduce) |
| F35 | P2 | `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs:75` | Reject unknown flags and a --hub with no value with usage and exit 2 |
| F36 | P2 | `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:46` | Add an else branch to parseArgs that prints usage and exits 2 |
| F37 | P2 | `.skilled/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs:29` | Reject a packet argument that starts with -- with usage and exit 2 |
| F38 | P2 | `.skilled/skills/system-deep-loop/runtime/scripts/query.cjs:106` | Reject parsed keys outside the documented flag set (downgraded from P1: the effect is a read-write open of a gitignored store, not a write) |
| F39 | P2 | `.skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs:31` | Reject flags outside the documented set with usage and exit 2 in all three checkers |
| F40 | P2 | `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:95` | Reject parsed keys outside the documented flag set with an input error |
| F41 | P2 | `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:48` | Reject parsed keys outside the documented flag set (downgraded from P1: the effect is lost seed telemetry, not a gate) |
| F42 | P2 | `.skilled/skills/system-skill-advisor/runtime/scripts/verify-zombie-soak.sh:22` | Add a default case that prints usage and exits 2 |
| F43 | P2 | `.skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh:29` | Exit 2 with usage when more than one argument is passed |
| F44 | P2 | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/build-holdout.mjs:129` | Reject flags other than --write with usage and exit 2; the sibling routing-accuracy helpers share the includes('--write') shape |
| F45 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement.ts:882` | Reject flags outside the documented set with usage and exit 2 (downgraded from P1: the telemetry re-enable effect was read in code, not run) |
| F46 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs:412` | Reject flags other than --write with usage and exit 2 |
| F48 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:913` | Reject a --flag that reaches the positional branch with usage and exit 64, as the command-position check already does |
| F49 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs:197` | Reject arguments other than --self-test with usage and exit 2 |
| F50 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-analyze.ts:357` | Reject flags outside the documented set with usage and exit 2 |
| F51 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/ops/process-sweep.ts:249` | Reject flags after the subcommand other than --pretty with usage and exit 2 |
| F54 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:315` | Exit 2 with usage when more than one argument is passed |
| F57 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.ts:258` | Reject unknown -- options with usage and exit 2 in both renderers |
| F60 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh:114` | Exit 2 with usage when exactly one of --left and --right is given |
| F61 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs:141` | Answer --help with usage and reject any other argument with exit 2 |
| F62 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/sweep/strict-pass-freshness.ts:80` | Reject a --roots value that starts with -- with usage and exit 2, as the unknown-argument branch already does |
| F63 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs:657` | Answer --help with usage and reject a flag-shaped root with exit 2 |
| F64 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/validation/evidence-marker-audit.ts:473` | Reject unknown flags and accept or reject the space form of --folder explicitly, exit 2 on misuse |

### Recommendation Ledger: Class 2, Exit 0 on a Detected Problem (10 rows)

| ID | Severity | Location | Recommendation |
|----|----------|----------|----------------|
| F19 | P2 | `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:56` | Return a non-zero code from check_file when the file cannot be read, so an unreadable input is not counted as clean |
| F27 | P2 | `.skilled/skills/sk-design/sk-design-md-generator/backend/scripts/build-write-prompt.ts:190` | Print the read error and exit 1 in the --study-context catch instead of dropping the context silently |
| F28 | P2 | `.skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs:588` | Return 2 from the argument-parse catch at line 588 so a usage error is not a pass; line 635 then must not force exitCode 0 on that path |
| F47 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:970` | Exit 1 when the result carries an error, not only when it is stale |
| F52 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/spec/is-phase-parent.ts:199` | Exit 2 with usage when the command or folder is missing or the command is unknown, instead of returning |
| F53 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-frontmatter-values-helper.cjs:109` | Report an unreadable input on stderr and exit 2 instead of continue |
| F55 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/setup/check-native-modules.sh:49` | Track a failure flag in the [FAIL] branches (lines 46, 49, 61) and exit 1 at the end when it is set |
| F56 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh:155` | Treat any drift_rc other than 0 and 9 like 20 and 21 (warn under enforce), so a scanner crash is not reported as no drift |
| F58 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/validation/unactioned-recorded-failure-audit.mjs:56` | Exit 2 on an unknown flag and on an unreadable input file instead of filtering and swallowing them |
| F59 | P2 | `.skilled/skills/system-spec-kit/runtime/cli/validation/ephemeral-pointer-audit.mjs:456` | Exit 2 when a target is flag-shaped or does not exist, instead of counting it clean |

### Recommendation Ledger: Not Reproduced by the Review (4 rows)

| ID | Source ID | Location | What to prove |
|----|-----------|----------|---------------|
| U1 | R5-P2-005 | `.skilled/skills/sk-git/scripts/worktree-naming.sh:418` | A failed provision is downgraded to a stderr message with an or-echo fallback, so create can exit 0 after a failed install |
| U2 | R5-P2-006 | `.skilled/skills/sk-git/scripts/migrate-legacy-branch-names.sh` | The branch-name collision path the review named; unreachable in this repository without legacy branches |
| U3 | R6-P2-004 | `.skilled/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs:171` | Option handling before the codex CLI spawn; no safe run existed in the read-only review |
| U4 | R7-P2-001 | `.skilled/skills/system-skill-advisor/runtime/scripts/init-skill-graph.sh:57` | Rebuilds the advisor SQLite store on any invocation, including a misspelled option |

### Ledger format

The builder records every row above in `implementation-summary.md`, one line each, in this shape, so the goal criteria can count them:

- `| <ID> | Fixed | <the command that proves it, in backticks, and what it printed> |`
- `| <ID> | Closed | <the written reason, naming prevent-overengineering or the operator decision> |`

Changed behavior gets a test that fails before the change and passes after it, recorded in a Tests table in the same file:

- `| T<n> | <test file or command> | before: exit <non-zero> | after: exit 0 |`
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 68 ledger rows are Fixed or Closed in `implementation-summary.md`.
- **SC-002**: Each Fixed row's reproduction command, from the review report, now exits 2 for a typo or non-zero for a detected problem.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A hook, workflow or other script passes an extra argument that is ignored today | High | Before each change, search the repository for every caller of the script and fix or list the caller |
| Risk | F48 recommends exit 64, matching the script's existing usage code, while this phase sets exit 2 | Low | Use exit 2 for the new branch as the brief requires, leave the existing 64 path unchanged, and record the two codes in the ledger line |
| Risk | The deep-loop scripts report errors as JSON (F8, F10) | Med | Keep the JSON error shape and set exit 2 on it |
| Risk | 002 touches the mirror checker's library and 003 touches `frontmatter-version.mjs` scope while this phase touches their parsers (F1, F26) | Med | Change only the parser lines here, so the merges stay line-disjoint |
| Risk | Other 021 builders bump the same skill in parallel | Med | Version numbers collide when the four branches merge; the integrator renumbers, and each child still bumps once |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Where each language's shared helper lives, if one earns its place. The builder decides under the scope rule above and records it (REQ-007).
<!-- /ANCHOR:questions -->
