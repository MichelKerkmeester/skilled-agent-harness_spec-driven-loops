---
title: "sk-code-quality: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, review protocol, execution expectations and per-feature validation files for the sk-code-quality skill."
version: 1.1.6.0
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

Coverage note: `sk-code-quality` routes primarily by target path, through the checklist map in `SKILL.md` section 2, and its discoverability from the parent hub is the hub `quality` signal. This playbook exercises the one thin prompt-intent `QUALITY` route and the checklist set it resolves.

### Realistic Test Model

1. A realistic quality-gate request reaches the sk-code hub.
2. The hub routes it to `sk-code-quality`, and the mode's `QUALITY` prompt intent selects its checklist set.
3. The operator captures the exact prompt, the command transcript and the resolved resources.
4. The scenario passes only when every expected resource resolves and the declared intent matches.

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
4. The operator can run `sed`, `test` and `git status` without network access.
5. No scenario in this playbook is destructive. Each one reads files and writes nothing.

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
- `PASS`: every path in `expected_resources` resolves under the skill root and the frontmatter `expected_intent` agrees with the root index
- `FAIL`: a listed path is missing, or the frontmatter intent disagrees
- `SKIP`: the `references/` directory is unavailable in the sandboxed checkout

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

## 7. QUALITY GATE (`CQ-001..CQ-013`)

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

Fixture: a temporary repository whose committed `.sk-code/quality.json` names one required configured check, run once without trust and once after the local trust key is set.

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

---

## 8. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `scripts/tests/check-comment-hygiene.test.sh` | Comment-hygiene checker violations, skips and exit codes | CQ-001 |
| `scripts/hooks/claude-posttooluse.test.sh` | A `node --check` syntax check of the edit-time hook adapter, plus a broken copy that must fail it | CQ-001 |
| `scripts/tests/quality-gate.test.cjs` | The runner's gates, exit codes, `disableRules` cases and the explain output | CQ-012, CQ-013 |
| `../../shared/scripts/tests/check-rule-overrides.test.cjs` | The override linter, including the hard-floor refusals | CQ-013 |

No test for target-path checklist routing was found in this package. CQ-001 checks the prompt-intent route only.

---

## 9. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| CQ-001 | Quality gate routes to the sk-code-quality checklist | QUALITY GATE | [CQ-001](quality-gate/quality-checklist.md) |
| CQ-002 | Foreign polyglot change gets a real verdict | QUALITY GATE | [CQ-002](quality-gate/foreign-polyglot-change.md) |
| CQ-003 | Unknown language change is never read as clean | QUALITY GATE | [CQ-003](quality-gate/unknown-language-change.md) |
| CQ-004 | CI workflow change resolves the CI checklist by path | QUALITY GATE | [CQ-004](quality-gate/ci-target-change.md) |
| CQ-005 | Private surface resolves through its quality declaration | QUALITY GATE | [CQ-005](quality-gate/private-surface-change.md) |
| CQ-006 | Absent required tool reports UNVERIFIED | QUALITY GATE | [CQ-006](quality-gate/absent-required-tool.md) |
| CQ-007 | Envelope round trip keeps both verdicts intact | QUALITY GATE | [CQ-007](quality-gate/envelope-round-trip.md) |
| CQ-008 | Restraint prompt routes to the quality gate and the Design Restraint Ladder | QUALITY GATE | [CQ-008](quality-gate/restraint-prompt.md) |
| CQ-009 | Untrusted config reads SKIPPED_UNTRUSTED until the operator grants trust | QUALITY GATE | [CQ-009](quality-gate/untrusted-config.md) |
| CQ-010 | A checklist row fault stays scoped to the files its declaration reaches | QUALITY GATE | [CQ-010](quality-gate/scoped-checklist-faults.md) |
| CQ-011 | A multi-file change gets one syntax finding per bad file from the parallel pool | QUALITY GATE | [CQ-011](quality-gate/parallel-syntax-pool.md) |
| CQ-012 | A repository that switches a hygiene rule off is not blocked by it | QUALITY GATE | [CQ-012](quality-gate/disabled-hygiene-rules.md) |
| CQ-013 | A hard-floor rule cannot be overridden or disabled | QUALITY GATE | [CQ-013](quality-gate/floor-override-refused.md) |
