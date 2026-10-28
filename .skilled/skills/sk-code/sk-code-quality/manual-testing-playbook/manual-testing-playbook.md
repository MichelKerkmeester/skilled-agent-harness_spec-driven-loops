---
title: "sk-code-quality: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, review protocol, execution expectations and per-feature validation files for the sk-code-quality skill."
version: 1.1.8.0
---

# sk-code-quality: Manual Testing Playbook

This document combines the manual-validation contract for the `sk-code-quality` skill into one reference. The root playbook acts as the operator directory and review protocol. It explains how a scenario is run, how evidence is captured, how results are graded and where each per-feature validation file lives. The per-feature files carry the deeper execution contract for each scenario.

---

This playbook package adopts the Feature Catalog split-document pattern for the `sk-code-quality` skill. The root document acts as the directory and review surface, while per-feature execution detail lives in the category folders at the playbook root.

Canonical package artifacts:
- `manual-testing-playbook.md`
- `quality-gate/`

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and reason are recorded into `sk-code-quality/benchmark/reports/<dated-run-label>/`. Generated report Markdown is renderer-owned and never hand-authored.

---

## 1. OVERVIEW

This playbook provides a derived census of deterministic scenarios across categories validating the `sk-code-quality` skill surface. The operator validator computes those counts from the walked tree, so the root index in section 9 is the only list to maintain. Each scenario keeps its original ID and links to a dedicated feature file with the full execution contract.

Coverage note: `sk-code-quality` routes primarily by target path, through the checklist map in `SKILL.md` section 2, and its discoverability from the parent hub is the hub `quality` signal. The corpus covers the runner's five gate values, its ten check states and its error codes, its CLI, config discovery and trust boundary, the outside-skill checklist rows, the rule-override and hygiene paths, the dist adapter, the ceiling report, the legacy write-time adapter, the manifest suggestion lane and the quality doctor. Two scenarios check routing rather than the runner: the prompt-intent `QUALITY` projection and the restraint prompt. The corpus does not cover the layer probe's `untrusted`, `broken` and `unknown` states, the `quality-config-*.test.cjs` parts of the suite, or the path-keyed checklist families for the SKILLED, agent, command, spec-folder and language rows.

### Realistic Test Model

1. A realistic quality-gate request reaches the sk-code hub.
2. The hub routes it to `sk-code-quality`, which runs the gate over the change or resolves the checklists the target path needs.
3. The operator captures the exact prompt and the command transcript, including every exit status.
4. The scenario passes only when the pass criteria of that scenario hold and its evidence is complete. A resolved path set and a matching intent are what CQ-001 grades, not a package-wide rule.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior
- The prompt that drives the test
- The expected execution process
- The desired user-visible outcome
- The `SKILL.md` anchors that justify the pass and fail rules

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root.
2. `.skilled/skills/sk-code/sk-code-quality/SKILL.md` resolves on disk.
3. Every file under `.skilled/skills/sk-code/sk-code-quality/references/` resolves on disk.
4. The operator has `node` at the version the runner supports, `git`, `python3` with the interpreter the runner's checkers use, `rg`, `mktemp`, `sed`, `test` and `bash`. No scenario needs network access.
5. No scenario writes inside the repository. Each one reads tracked files, builds its fixtures in a temporary folder outside the working tree, and removes that folder in its last step. The one config edit a scenario makes names the scratch path absolutely, so no step can reach the committed repository config.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript, including exit status where a command is executed
- User request used
- Exact prompt used
- The resolved frontmatter block and the `INTENT_SIGNALS["QUALITY"]` excerpt
- Output snippets for each resource check
- Scenario verdict with rationale: PASS, FAIL, or SKIP

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands shown as `bash: <command>`.
- Agent prompts shown as `agent: <instruction>`.
- `->` separates sequential steps.
- Paths in a scenario are relative to the repository root unless the scenario names the skill root.
- A path a scenario creates inside a temporary fixture is written `<fixture>/<path>`, and a scratch folder the operator creates is written `<scratch>/<path>`, because neither exists until the run builds it.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`
2. Referenced per-feature files under `manual-testing-playbook/<category>/`
3. Scenario execution evidence
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: every pass criterion that scenario states holds, and the evidence it asks for is complete
- `FAIL`: any of that scenario's pass criteria does not hold, or its evidence is missing or contradictory
- `SKIP`: a named sandbox or runtime blocker prevents the scenario from running, such as a missing `python3` for the checks that need it

CQ-001 grades a resolved path set and a matching intent because that is its pass criterion. The other scenarios grade the gate value, the exit code, the check state and the findings they read, and the root applies no second rule over them.

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the feature are `PASS`
- `FAIL`: any mapped scenario is `FAIL`
- `SKIP`: every mapped scenario is blocked by a named sandbox or runtime blocker

Hard rule:
- CQ-001 is critical-path. A `FAIL` there forces the feature verdict to `FAIL`.

### Release Readiness Rule

Release is releasable only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES`).
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Put feature-specific acceptance caveats in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning for the manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. The package is small enough for one operator in one wave.
2. Pre-assign each scenario ID and its per-feature file before execution.
3. Save the evidence for each scenario before recording its verdict.
4. Record the evidence paths in the final report.

### What Belongs In Per-Feature Files

- Real user request
- Prompt field
- Expected routing through the hub and the mode
- Desired user-visible outcome
- Feature-specific acceptance caveats

---

## 7. QUALITY GATE (`CQ-001..CQ-023`)

### CQ-001 | Quality gate routes to the sk-code-quality checklist

#### Description

Verify that a comment-hygiene and P0/P1/P2 quality-gate prompt classifies as `QUALITY` and resolves the checklist set its `DEFAULT_RESOURCE` names.

#### Scenario Contract

Prompt: `Run the comment hygiene quality gate and check P0/P1/P2 standards before marking this done.`

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then checks whether the thin `QUALITY` prompt-intent projection resolves the declared `expected_resources` set.

Desired user-visible outcome: the bundled workflow loads the `DEFAULT_RESOURCE` checklist set, the universal baseline first, before any completion claim.

#### Test Execution

> **Feature File:** [CQ-001](quality-gate/quality-checklist.md)

### CQ-002 | Foreign polyglot change gets a real verdict

#### Description

Verify that a foreign polyglot change built from fixture F01 gets a real gate verdict in a repository with no surface packet.

#### Scenario Contract

Fixture: F01, a polyglot change in a temporary repository whose surface resolves to `UNKNOWN`.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then runs the built-in runner over the fixture and reads its verdict and its checklist set.

Desired user-visible outcome: the run resolves the universal floor and the built-in checks, and every seeded defect is named in the findings.

#### Test Execution

> **Feature File:** [CQ-002](quality-gate/foreign-polyglot-change.md)

### CQ-003 | Unknown language change is never read as clean

#### Description

Verify that a change written in a language no surface declares is reported as uncovered and never as clean.

#### Scenario Contract

Fixture: F05, a change whose only file no surface claims.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then runs the built-in runner over the fixture and reads its gate.

Desired user-visible outcome: the run reports `NOTHING_CHECKED` with exit 2, and the unknown language is recorded rather than filled in from a default.

#### Test Execution

> **Feature File:** [CQ-003](quality-gate/unknown-language-change.md)

### CQ-004 | CI workflow change resolves the CI checklist by path

#### Description

Verify that a change under `.github/workflows/` resolves the CI workflow checklist from the target path and reports the findings that checklist names.

#### Scenario Contract

Fixture: F14, a GitHub Actions workflow change in a temporary repository.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then runs the built-in runner and reads the `checklists[]` rows with their `why`.

Desired user-visible outcome: the CI workflow checklist is listed after the universal floor, the YAML check reads the one workflow file clean, and the gate returns `NO_BLOCKER_FOUND`.

#### Test Execution

> **Feature File:** [CQ-004](quality-gate/ci-target-change.md)

### CQ-005 | Private surface resolves through its quality declaration

#### Description

Verify that a surface declared by a private skill mounted beside the hub resolves its checklists through the declaration, with the name supplied only at run time.

#### Scenario Contract

Fixture: F15, a private sibling skill beside the fixture hub whose own `graph-metadata.json` declares the hub's family, a `surface_detection` block and a `quality` block, under a placeholder name.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then runs the runner over the fixture and reads the checklist rows and the envelope labels.

Desired user-visible outcome: the declared checklist is listed, the surface label appears, and no private skill name reaches the envelope.

#### Test Execution

> **Feature File:** [CQ-005](quality-gate/private-surface-change.md)

### CQ-006 | Absent required tool reports UNVERIFIED

#### Description

Verify that a configured required check whose tool is missing reports `UNVERIFIED` with a repair line and exits 4.

#### Scenario Contract

Fixture: F06, a temporary repository whose committed config names a required check for a tool that is not installed.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then runs the built-in runner and reads the check row and the gate.

Desired user-visible outcome: the row reads `SKIPPED_ABSENT` with the repair text, and the run makes no clean or blocked claim.

#### Test Execution

> **Feature File:** [CQ-006](quality-gate/absent-required-tool.md)

### CQ-007 | Envelope round trip keeps both verdicts intact

#### Description

Verify that the blocking envelope from CQ-002 and the `UNVERIFIED` envelope from CQ-006 keep their fields when the verify reader parses them.

#### Scenario Contract

Input: the two envelopes those scenarios produce, one blocked and one unverified.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then renders both envelopes and reads each field the verify workflow consumes.

Desired user-visible outcome: every field survives the round trip, and the unverified ids reach verification as open claims.

#### Test Execution

> **Feature File:** [CQ-007](quality-gate/envelope-round-trip.md)

### CQ-008 | Restraint prompt routes to the quality gate and the Design Restraint Ladder

#### Description

Verify that the restraint prompt `apply yagni to this change` resolves a single route to `sk-code-quality`, reports `CODE_QUALITY` at stage two, and reaches the Design Restraint Ladder.

#### Scenario Contract

Prompt: `apply yagni to this change`

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then checks both routing stages and the workflow step that applies the ladder before code is added.

Desired user-visible outcome: the gate walks the ladder and stops at the first rung that holds, rather than adding code.

#### Test Execution

> **Feature File:** [CQ-008](quality-gate/restraint-prompt.md)

### CQ-009 | Untrusted config reads SKIPPED_UNTRUSTED until the operator grants trust

#### Description

Verify that a configured check from a config no trust rule vouches for reads `SKIPPED_UNTRUSTED`, starts nothing, prints the repair line `git config --local skilled.trustRepoChecks true` and leaves a required check `UNVERIFIED`, and that setting the local key lets the same check run.

#### Scenario Contract

Fixture: a temporary repository whose committed `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` names one required configured check, run once without trust and once after the local trust key is set.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then runs the built-in runner twice and reads the check row, the repair line and `config.trust`.

Desired user-visible outcome: the first run reads `UNVERIFIED` with exit 4 and no process started, and the second run reads the blocking gate with `config.trust` naming the key.

#### Test Execution

> **Feature File:** [CQ-009](quality-gate/untrusted-config.md)

### CQ-010 | A checklist row fault stays scoped to the files its declaration reaches

#### Description

Verify that a malformed `quality.checklists` row in a private skill's declaration gates a change its surface reaches, appears only in `config.warnings` for a change its surface does not reach, and leaves the valid row beside it listed.

#### Scenario Contract

Fixture: two temporary repositories with the same private sibling skill declaring one valid row and one row with no selector, one changing a file inside the skill's surface and one changing a file outside it.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then runs the built-in runner over each repository and reads `config.errors`, `config.warnings` and the gate.

Desired user-visible outcome: the reached change reads `ERROR` with exit 3 and the fault in `config.errors`, and the unreached change reads `NO_BLOCKER_FOUND` with the same fault in `config.warnings`.

#### Test Execution

> **Feature File:** [CQ-010](quality-gate/scoped-checklist-faults.md)

### CQ-011 | A multi-file change gets one syntax finding per bad file from the parallel pool

#### Description

Verify that the `syntax-node` check, which runs through a bounded worker pool under one shared deadline, reports exactly one finding per bad file on a twenty-file change and reads every other file clean inside its deadline, and that the pool helper refuses a file list that is not JSON.

#### Scenario Contract

Fixture: a temporary repository changing twenty `.mjs` files, two with a syntax error, plus direct runs of `parallel-node-check.cjs`.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then runs the built-in runner with a 30 second deadline and starts the helper by hand with a valid and an invalid payload.

Desired user-visible outcome: two findings naming the two bad files, a `RAN_FAIL` row over twenty files, ordered helper records and a usage error with exit 2 for the invalid payload.

#### Test Execution

> **Feature File:** [CQ-011](quality-gate/parallel-syntax-pool.md)

### CQ-012 | A repository that switches a hygiene rule off is not blocked by it

#### Description

Verify that a repository whose comments carry a tracker reference reads `NO_BLOCKER_FOUND` once `commentHygiene.disableRules` names the rule, that the verdict lists the rule in `config.hygiene.disabled`, that the same file takes the blocking gate value when the key is removed, and that the resolver shows the repository checklist's `## Rule overrides` rows.

#### Scenario Contract

Fixture: a scratch folder with no git history, holding one source file with a `// Fixes #12` comment, a quality config that names a style document and sets `disableRules` to `["issue"]`, and the style document with two `none` rows.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then runs the built-in runner over the one file with the key, without it, and in explain form.

Desired user-visible outcome: the run with the key reads `NO_BLOCKER_FOUND` with exit 0 and names `hygiene.issue` as disabled, and the run without it takes the blocking gate value with exit 1 and one `hygiene.issue` finding.

#### Test Execution

> **Feature File:** [CQ-012](quality-gate/disabled-hygiene-rules.md)

### CQ-013 | A hard-floor rule cannot be overridden or disabled

#### Description

Verify that a `## Rule overrides` row naming `floor.input-validation` is refused by the linter with exit 1 and reported by the resolver as a refused checklist with no rows, and that a `commentHygiene.disableRules` id the shared contract fixes stops the gate with `CONFIG_INVALID` and exit 3.

#### Scenario Contract

Fixture: a scratch folder with no git history, holding one source file, a quality config that names a style document, and the style document with one `none` row for the input validation rule. A later step adds `disableRules` set to `["secret.private-key"]`.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then runs the linter, the resolver and the built-in runner.

Desired user-visible outcome: the linter exits 1 naming the floor rule, the resolver reports the checklist as refused, and the gate reads `ERROR` with exit 3 for the fixed hygiene id.

#### Test Execution

> **Feature File:** [CQ-013](quality-gate/floor-override-refused.md)

### CQ-014 | A declared generated path is read by the dist adapter

#### Description

Verify that a path the base layer declares as generated output reaches the dist adapter, that a stale build yields a P1 finding, that an attested build reads clean and that a path the checker cannot map reads `ERROR`.

#### Scenario Contract

Fixture: three temporary repositories, each holding one declared generated path, one stale, one attested against its current sources and one with no package around the path.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then runs the gate over the declared path in each repository and reads the `dist-staleness` row and the findings.

Desired user-visible outcome: the author rebuilds the package whose output is stale, and never reads a build the checker could not inspect as fresh.

#### Test Execution

> **Feature File:** [CQ-014](quality-gate/dist-staleness-adapter.md)
> **Catalog:** none; the nearest is [`codebase-agnostic-quality-gate.md`](../../feature-catalog/quality-gate/codebase-agnostic-quality-gate.md)

### CQ-015 | The ceiling report tags the markers whose trigger cannot fire

#### Description

Verify that the ceiling-marker report prints one line per marker with its tag, closes with the counts line and exits 0 whether or not it found a marker it cannot act on.

#### Scenario Contract

Fixture: a scratch folder holding one JavaScript module with three markers, one per tag state.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then runs the report over that one file and replays the report's own test cases.

Desired user-visible outcome: the reviewer gets the shortcuts with their triggers and the two a reader cannot act on, and knows the report made no blocking claim.

#### Test Execution

> **Feature File:** [CQ-015](quality-gate/ceiling-marker-report.md)
> **Catalog:** none; the nearest is [`codebase-agnostic-quality-gate.md`](../../feature-catalog/quality-gate/codebase-agnostic-quality-gate.md)

### CQ-016 | The legacy write-time hook warns on a labelled comment

#### Description

Verify that the compatibility write-time adapter warns on a `Write` payload naming a labelled comment, prints nothing for a tool it does not handle, and exits 0 either way.

#### Scenario Contract

Fixture: a scratch folder holding one file with a labelled comment on its first line, and two hook payloads.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then pipes both payloads into the adapter and replays the parse suite over the live Node adapter.

Desired user-visible outcome: the author replaces the label before the next turn, and no runtime treats the adapter as a blocker.

#### Test Execution

> **Feature File:** [CQ-016](quality-gate/legacy-write-time-hook.md)
> **Catalog:** none; the nearest is [`rule-overrides-and-hygiene-policy.md`](../../feature-catalog/quality-gate/rule-overrides-and-hygiene-policy.md)

### CQ-017 | An unblocked hygiene layer leaves a touched-file label as debt

#### Description

Verify that a pre-commit hook naming the checker reads `present` and makes a touched-file hygiene finding block, and that the same change with no hook reads `absent` and counts the finding as debt.

#### Scenario Contract

Fixture: two temporary repositories with the same labelled comment on an unchanged line, one carrying a pre-commit hook and one carrying none.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then runs the gate over both and reads the `layers` field, the finding and the two summaries.

Desired user-visible outcome: the author learns whether the commit will be refused, and an older comment is either fixed or reported as debt rather than as a blocker the change caused.

#### Test Execution

> **Feature File:** [CQ-017](quality-gate/hygiene-layers-and-debt.md)
> **Catalog:** [`rule-overrides-and-hygiene-policy.md`](../../feature-catalog/quality-gate/rule-overrides-and-hygiene-policy.md)

### CQ-018 | Every runner flag changes the run the way the CLI table says

#### Description

Verify that each documented flag owns the field the CLI table names: the `--base` scope, `--lines file`, `--only` and `--skip`, `--no-run`, `--config`, `--help` and a multi-path `--explain`.

#### Scenario Contract

Fixture: four temporary repositories, one per flag group.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then runs each flag group and reads the field that flag owns.

Desired user-visible outcome: the operator can gate a branch, widen the line rule, isolate a check, inspect a config or a CLI, and resolve several files at once.

#### Test Execution

> **Feature File:** [CQ-018](quality-gate/cli-flag-surface.md)
> **Catalog:** [`codebase-agnostic-quality-gate.md`](../../feature-catalog/quality-gate/codebase-agnostic-quality-gate.md)

### CQ-019 | A request the runner cannot honour exits 3 and names the reason

#### Description

Verify that each refusal code names its own unanswerable request, and that no refused run reports a gate value about the change.

#### Scenario Contract

Fixture: six temporary repositories and one file beside them, covering eight refusal cases.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then sends each request and reads the gate, the exit code and the code row.

Desired user-visible outcome: the operator can tell a broken install from a moved file, an old config location, a bad ref and a missing registry.

#### Test Execution

> **Feature File:** [CQ-019](quality-gate/refused-requests.md)
> **Catalog:** [`codebase-agnostic-quality-gate.md`](../../feature-catalog/quality-gate/codebase-agnostic-quality-gate.md)

### CQ-020 | A check that produced no evidence never reads as clean

#### Description

Verify the five ways a run can end without answering: a check killed at its deadline, a configured check outside git, a checklist that is absent, an outside-skill row that leaves its folder and a command that writes while it runs.

#### Scenario Contract

Fixture: four temporary repositories and one outside-skill folder beside the fixture hub.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then drives each case and reads the check row, the config error or the `errors[]` row.

Desired user-visible outcome: the operator fixes the evidence gap or reverts the write by hand, and never records any of the five as a clean run.

#### Test Execution

> **Feature File:** [CQ-020](quality-gate/no-evidence-states.md)
> **Catalog:** [`codebase-agnostic-quality-gate.md`](../../feature-catalog/quality-gate/codebase-agnostic-quality-gate.md)

### CQ-021 | Two checklists at one level that disagree leave the rule unverified

#### Description

Verify that two checklists the same repository declares, answering one rule differently for one file, are reported in `rule_conflicts`, leave the rule unverified, apply neither row and add the `override-conflict` entry to the envelope.

#### Scenario Contract

Fixture: one temporary repository whose config declares two checklists, each with a `## Rule overrides` section.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then runs the gate in JSON and envelope form and asks the resolver for the same file.

Desired user-visible outcome: the author sees which rule the repository has not decided and fixes one of the two rows.

#### Test Execution

> **Feature File:** [CQ-021](quality-gate/rule-override-conflict.md)
> **Catalog:** [`rule-overrides-and-hygiene-policy.md`](../../feature-catalog/quality-gate/rule-overrides-and-hygiene-policy.md)

### CQ-022 | A manifest implies a check the runner suggests and never runs

#### Description

Verify that a `package.json` script and a workflow file each produce one suggestion with the entry that would enable it, that the excluded scripts produce none and that nothing the run suggests was started.

#### Scenario Contract

Fixture: one temporary repository holding a `package.json` with three scripts and one workflow file.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then runs the gate and reads `suggested_checks` against the check rows.

Desired user-visible outcome: the author can paste a suggested entry into the repository config, and knows the gate made no claim about a command it did not run.

#### Test Execution

> **Feature File:** [CQ-022](quality-gate/manifest-suggestions.md)
> **Catalog:** [`repository-quality-config.md`](../../feature-catalog/quality-gate/repository-quality-config.md)

### CQ-023 | The quality doctor shows the seats, the override rows and the disabled rules

#### Description

Verify that the doctor's `status` names each checklist with its seat and override rows, reports the disabled hygiene rule beside the active ones, and that `init --apply` refuses an existing config.

#### Scenario Contract

Fixture: one temporary repository whose config names one checklist with two override rows and switches one hygiene rule off.

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then runs `status --json` and `init --apply --json` over that repository.

Desired user-visible outcome: the operator sees exactly what the gate would apply and knows the doctor will not write over a reviewed config.

#### Test Execution

> **Feature File:** [CQ-023](quality-gate/quality-doctor.md)
> **Catalog:** [`sk-code-setup-and-quality-doctor.md`](../../feature-catalog/doctor-commands/sk-code-setup-and-quality-doctor.md)

---

## 8. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `scripts/tests/quality-gate-hygiene.test.cjs` | The named hygiene fixtures, the secret redaction and the checker's config faults | CQ-002 |
| `scripts/tests/quality-gate-surfaces.test.cjs` | Scope resolution, the target-path fixtures, the shebang dispatch and the no-git fallback | CQ-003, CQ-004 |
| `scripts/tests/quality-gate-outside-skills.test.cjs` | The outside-skill row faults, both refusals and the scoped-fault warning | CQ-005, CQ-010 |
| `scripts/tests/quality-gate-layers-and-generated.test.cjs` | The layer probe's hook spellings and a repository's generated rows | CQ-017 |
| `scripts/tests/quality-gate-dist.test.cjs` | The dist adapter and the four states it reads | CQ-014 |
| `scripts/tests/quality-gate-explain-and-overrides.test.cjs` | The multi-file explain output and the override pass with its refusal, recording and conflict cases | CQ-012, CQ-013, CQ-021 |
| `scripts/tests/quality-gate-runner-units.test.cjs` | The flags, the envelope, the scope listing, exit precedence and the guard boundary | CQ-018 |
| `scripts/tests/configured-checks-outcomes.test.cjs` | A configured run's outcomes: an absent tool, a failing check, a mutated workspace and the suggestion lane | CQ-006, CQ-020 |
| `scripts/tests/configured-checks-trust.test.cjs` | The trust boundary: the states a committed check resolves to and the one-time grant | CQ-009 |
| `scripts/tests/configured-checks-execution.test.cjs` | Argv execution, the workspace guard, the timeout kill and the package-folded cwd | CQ-020 |
| `scripts/tests/parallel-node-check.test.cjs` | The bounded pool helper, its input-order records and its usage error | CQ-011 |
| `scripts/tests/ceiling-report.test.sh` | The report's comment families, tags, counts and argument errors | CQ-015 |
| `scripts/hooks/claude-posttooluse.test.sh` | A parse check of the live Node write-time adapter, plus a broken copy that must fail it | CQ-016 |
| `scripts/tests/quality-config-discovery.test.cjs` | Config discovery, one case per source, and the legacy-path refusal | no scenario replays this module |
| `scripts/tests/quality-config-validation.test.cjs` | The schema's error list and the merge rule | no scenario replays this module |
| `scripts/tests/quality-config-hygiene.test.cjs` | The hygiene values a config may not carry, and the `disableRules` cases | CQ-012, CQ-013 |
| `scripts/tests/quality-config-help.test.cjs` | `--help` and `-h` printing the usage | none |
| `scripts/tests/check-comment-hygiene.test.sh` | The checker's rules, skips and exit codes | no scenario replays this module; the runner calls the checker in CQ-002 and CQ-017 |
| `../../shared/scripts/tests/check-rule-overrides.test.cjs` | The override linter, including the hard-floor refusals | no scenario replays this module; the linter itself runs in CQ-013 |
| `scripts/tests/fixtures.cjs` | The builder and the snapshot check every fixture scenario runs through | CQ-002, CQ-004, CQ-005, CQ-006, CQ-007, CQ-009, CQ-010, CQ-011, CQ-014, CQ-017, CQ-018, CQ-019, CQ-020, CQ-021, CQ-022 |

Target-path checklist routing is covered for the CI workflow path by CQ-004, and for outside-skill path markers by CQ-005 and CQ-010. The path families no scenario reaches are the SKILLED, agent, command, spec-folder and language rows; CQ-001 checks the prompt-intent route only.

---

## 9. FEATURE CATALOG CROSS-REFERENCE INDEX

Every row names the feature-catalog entry that carries the same capability, or `none` where the catalog has no entry for it. A row that reads `none` names the nearest entry in its own per-feature file, so the exception is explicit rather than implied.

| Feature ID | Feature Name | Category | Feature File | Catalog |
|---|---|---|---|---|
| CQ-001 | Quality gate routes to the sk-code-quality checklist | QUALITY GATE | [CQ-001](quality-gate/quality-checklist.md) | none |
| CQ-002 | Foreign polyglot change gets a real verdict | QUALITY GATE | [CQ-002](quality-gate/foreign-polyglot-change.md) | codebase-agnostic-quality-gate |
| CQ-003 | Unknown language change is never read as clean | QUALITY GATE | [CQ-003](quality-gate/unknown-language-change.md) | codebase-agnostic-quality-gate |
| CQ-004 | CI workflow change resolves the CI checklist by path | QUALITY GATE | [CQ-004](quality-gate/ci-target-change.md) | codebase-agnostic-quality-gate |
| CQ-005 | Private surface resolves through its quality declaration | QUALITY GATE | [CQ-005](quality-gate/private-surface-change.md) | codebase-agnostic-quality-gate |
| CQ-006 | Absent required tool reports UNVERIFIED | QUALITY GATE | [CQ-006](quality-gate/absent-required-tool.md) | repository-quality-config |
| CQ-007 | Envelope round trip keeps both verdicts intact | QUALITY GATE | [CQ-007](quality-gate/envelope-round-trip.md) | none |
| CQ-008 | Restraint prompt routes to the quality gate and the Design Restraint Ladder | QUALITY GATE | [CQ-008](quality-gate/restraint-prompt.md) | none |
| CQ-009 | Untrusted config reads SKIPPED_UNTRUSTED until the operator grants trust | QUALITY GATE | [CQ-009](quality-gate/untrusted-config.md) | repository-quality-config |
| CQ-010 | A checklist row fault stays scoped to the files its declaration reaches | QUALITY GATE | [CQ-010](quality-gate/scoped-checklist-faults.md) | rule-overrides-and-hygiene-policy |
| CQ-011 | A multi-file change gets one syntax finding per bad file from the parallel pool | QUALITY GATE | [CQ-011](quality-gate/parallel-syntax-pool.md) | none |
| CQ-012 | A repository that switches a hygiene rule off is not blocked by it | QUALITY GATE | [CQ-012](quality-gate/disabled-hygiene-rules.md) | rule-overrides-and-hygiene-policy |
| CQ-013 | A hard-floor rule cannot be overridden or disabled | QUALITY GATE | [CQ-013](quality-gate/floor-override-refused.md) | rule-overrides-and-hygiene-policy |
| CQ-014 | A declared generated path is read by the dist adapter | QUALITY GATE | [CQ-014](quality-gate/dist-staleness-adapter.md) | none |
| CQ-015 | The ceiling report tags the markers whose trigger cannot fire | QUALITY GATE | [CQ-015](quality-gate/ceiling-marker-report.md) | none |
| CQ-016 | The legacy write-time hook warns on a labelled comment | QUALITY GATE | [CQ-016](quality-gate/legacy-write-time-hook.md) | none |
| CQ-017 | An unblocked hygiene layer leaves a touched-file label as debt | QUALITY GATE | [CQ-017](quality-gate/hygiene-layers-and-debt.md) | rule-overrides-and-hygiene-policy |
| CQ-018 | Every runner flag changes the run the way the CLI table says | QUALITY GATE | [CQ-018](quality-gate/cli-flag-surface.md) | codebase-agnostic-quality-gate |
| CQ-019 | A request the runner cannot honour exits 3 and names the reason | QUALITY GATE | [CQ-019](quality-gate/refused-requests.md) | codebase-agnostic-quality-gate |
| CQ-020 | A check that produced no evidence never reads as clean | QUALITY GATE | [CQ-020](quality-gate/no-evidence-states.md) | codebase-agnostic-quality-gate |
| CQ-021 | Two checklists at one level that disagree leave the rule unverified | QUALITY GATE | [CQ-021](quality-gate/rule-override-conflict.md) | rule-overrides-and-hygiene-policy |
| CQ-022 | A manifest implies a check the runner suggests and never runs | QUALITY GATE | [CQ-022](quality-gate/manifest-suggestions.md) | repository-quality-config |
| CQ-023 | The quality doctor shows the seats, the override rows and the disabled rules | QUALITY GATE | [CQ-023](quality-gate/quality-doctor.md) | doctor-commands/sk-code-setup-and-quality-doctor |
