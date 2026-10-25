---
title: "sk-code-quality: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, review protocol, execution expectations and per-feature validation files for the sk-code-quality skill."
version: 1.1.0.0
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
3. Every file under `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/` resolves on disk.
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
- `SKIP`: the `assets/code-quality-checklist/` directory is unavailable in the sandboxed checkout

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

## 7. QUALITY GATE (`CQ-001..CQ-001`)

### CQ-001 | Quality gate routes to the sk-code-quality checklist

#### Description

Verify that a comment-hygiene and P0/P1/P2 quality-gate prompt classifies as `QUALITY` and resolves the checklist set its `DEFAULT_RESOURCE` names.

#### Scenario Contract

Prompt: `Run the comment hygiene quality gate and check P0/P1/P2 standards before marking this done.`

Every scenario assumes the hub has already routed the request to `sk-code-quality`. The scenario then checks whether the thin `QUALITY` prompt-intent projection resolves the declared `expected_resources` set.

Desired user-visible outcome: the bundled workflow loads the `DEFAULT_RESOURCE` checklist set, the universal baseline first, before any completion claim.

#### Test Execution

> **Feature File:** [CQ-001](quality-gate/quality-checklist.md)

---

## 8. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `scripts/check-comment-hygiene.test.sh` | Comment-hygiene checker violations, skips and exit codes | CQ-001 |
| `scripts/hooks/claude-posttooluse.test.sh` | The edit-time hook entrypoint and its adapter | CQ-001 |

No test for target-path checklist routing was found in this package. CQ-001 checks the prompt-intent route only.

---

## 9. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| CQ-001 | Quality gate routes to the sk-code-quality checklist | QUALITY GATE | [CQ-001](quality-gate/quality-checklist.md) |
