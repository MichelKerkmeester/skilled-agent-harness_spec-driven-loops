---
title: "review: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review and orchestration guidance, execution expectations, and per-feature validation files for the review skill."
version: 1.5.0.11
---

# review: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live `review` skill, `@review`, or the named external CLI surface. No mocks, no stubs, and no "unautomatable" verdicts. Acceptable verdicts are PASS, PARTIAL, FAIL, or SKIP with a concrete sandbox or tool-availability blocker.

This document combines the full manual-validation contract for the `review` skill into one reference. The root playbook acts as the operator directory, review protocol, and orchestration guide, while the per-feature files carry scenario-specific execution truth for findings-first code-review behavior.

---

This playbook package adopts the Feature Catalog split-document pattern for the `review` skill. The root document acts as the directory, review surface, and orchestration guide, while per-feature execution detail lives in the category folders at the playbook root.

Canonical package artifacts:
- `manual_testing_playbook.md`
- `baseline-review-flow/`
- `security-and-correctness-minimums/`
- `severity-and-evidence-discipline/`
- `scope-and-precedence/`
- `re-review-and-stale-context/`
- `cross-cli-orchestration/`
- `structural-impact-preflight/`
- `efficiency-and-restraint/`

---

## 1. OVERVIEW

This playbook provides 24 deterministic scenarios across 8 categories validating the `review` skill surface and its review-agent consumers. Each scenario maps to a dedicated per-feature file with exact prompt, command sequence, expected signals, evidence, pass/fail criteria, and failure triage.

Coverage note (2026-06-13): the playbook covers single-pass review flow, security/correctness minimums, severity and evidence discipline, scope and precedence, re-review behavior, stale-context handling, structural-impact preflight degradation, AI-generated-code review, native `@review` invocation, external CLI handbacks through cli-opencode and cli-claude-code, and the v1.4.0.0 efficiency-and-restraint behaviors: reinvent-the-wheel detection, the unrequested-code removal prompt, ceiling-comment downgrade, the `SK_CODE_REVIEW_DEPTH` alias, and the rule-invariant canary. `review` does not ship a dedicated feature catalog, so per-feature files anchor directly to `SKILL.md`, `references/`, `scripts/`, and `.opencode/agents/` on disk.

### Realistic Test Model

1. A realistic review request is given to an orchestrator or external CLI conductor.
2. The orchestrator decides whether to review locally, invoke `@review`, or dispatch a named external CLI.
3. The operator captures the exact prompt, command transcript, evidence files, and final review handback.
4. The scenario passes only when the returned review would let a real maintainer make a merge decision.

### What Each Feature File Should Explain

- The review request that should trigger the behavior
- The operator or agent-facing prompt using the canonical scenario voice
- The expected execution process, including delegation or alternate-CLI routing when relevant
- The desired user-visible outcome
- The source anchors that justify pass/fail criteria

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root.
2. `.opencode/skills/sk-code/code-review/SKILL.md` and all files under `.opencode/skills/sk-code/code-review/references/` resolve on disk.
3. `.opencode/agents/review.md` and `.opencode/agents/deep-review.md` resolve on disk for native and iterative-review consumer checks.
4. The operator can run `git diff`, `git status`, `rg`, and line-number inspection commands such as `nl -ba`.
5. External CLI scenarios require the named CLI surface to be installed and authenticated; otherwise use SKIP with the exact missing binary or auth blocker.
6. Review agents and external CLI delegates remain read-only. Scenario fixtures may create a reversible local diff only when the scenario explicitly requires it; the operator must restore the working tree before recording the final verdict.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Exact user request used
- Exact operator, agent, or CLI prompt used
- Command transcript, including exit status where a command is executed
- Changed-file inventory or explicit reviewed scope
- Review output with P0/P1/P2 ordering preserved
- File:line citations for every P0/P1 finding, or explicit evidence-backed clean result
- Source-reference mapping to `references/review_core.md` and any applicable checklist
- Delegation or runtime-routing notes when a sub-agent or external CLI is used
- Final scenario verdict with rationale: PASS, PARTIAL, FAIL, or SKIP

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands shown as `bash: <command>`.
- Native review-agent prompts shown as `agent: @review <instruction>`.
- Deep-review references shown as `agent: @deep-review <single-iteration context>` only when a scenario inspects deep-review behavior; this root playbook does not run the deep-review loop.
- External OpenCode CLI dispatches shown as `cli-opencode: <prompt>`.
- OpenCode CLI dispatches shown as `cli-opencode: <prompt>`.
- `->` separates sequential steps inside one deterministic command sequence.
- External CLI handbacks are review-only. Any implementation, file edit, or branch mutation is contradictory evidence.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence from section 3
4. Feature-to-scenario coverage map from section 14
5. Triage notes for every PARTIAL, FAIL, or SKIP verdict

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present without contradictory evidence.
4. Evidence is complete and readable.
5. Pass/fail criteria cite the relevant `review` source file.
6. Outcome rationale is explicit and merge-decision useful.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete
- `FAIL`: expected behavior missing, contradictory output, scope mutation, or critical evidence missing
- `SKIP`: execution blocked by a named sandbox, missing CLI, missing auth, or unavailable fixture

### Feature Verdict Rules

- `PASS`: the mapped scenario is PASS.
- `PARTIAL`: the mapped scenario is PARTIAL and no critical check failed.
- `FAIL`: the mapped scenario is FAIL.

Hard rule:
- Any critical-path scenario FAIL (CR-001, CR-004, CR-007, CR-010, CR-013, CR-016, CR-017) blocks release readiness.

### Release Readiness Rule

Release is READY only when:

1. No feature verdict is FAIL.
2. All critical-path scenarios are PASS or explicitly SKIP for environment-only reasons.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES == 24`).
4. No unresolved blocking triage item remains.
5. External CLI handbacks preserve review severity and evidence contracts.

### Root-vs-Feature Rule

Keep global verdict logic in this root playbook. Put scenario-specific caveats, fixture assumptions, and source anchors in the matching per-feature files.

### Evidence Ledger Fields

Use this compact ledger when reporting wave results back to an orchestrator.

| Field | Required | Notes |
|---|---|---|
| Scenario ID | Yes | One of CR-001..CR-024 |
| Feature file | Yes | Relative path under this playbook root |
| Runtime | Yes | Native, @review, cli-opencode, cli-claude-code, or skipped surface |
| Scope source | Yes | Diff range, staged diff, explicit file list, or fixture path |
| Exact prompt hash | Yes | Hash or pasted prompt proving canonical prompt equality |
| Evidence path | Yes | Transcript, report path, or captured output location |
| Verdict | Yes | PASS, PARTIAL, FAIL, or SKIP |
| Blocking reason | Conditional | Required for FAIL and SKIP |
| Follow-up owner | Conditional | Required when a P0/P1 issue is discovered |

### Release Review Checklist

Before declaring this playbook release-ready, confirm:

1. Root validator is clean.
2. Per-feature structural sweep checks all 24 files.
3. No forbidden sidecars exist.
4. Every table row has exactly 9 columns.
5. Every scenario prompt is realistic per the RCAF-vs-natural-human heuristic in sk-doc creation reference §5.
6. Every SCENARIO CONTRACT prompt equals its table prompt.
7. Every pass/fail rule cites a real review source file.
8. Every external CLI scenario either ran or recorded an environment-only SKIP.
9. Every P0/P1 observed while executing scenarios has file:line evidence.
10. The final report separates playbook defects from review product defects.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for executing the 24-scenario review battery. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start: native agent availability, external CLI availability, and current git scope.
2. Reserve one coordinator to maintain the verdict table and prompt-equality audit.
3. Saturate remaining worker slots only when scenarios use disjoint read-only scopes.
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run cross-CLI scenarios in a dedicated wave so handbacks can be compared against the same changed-file list.
6. After each wave, save evidence paths and verdict rationale before starting the next wave.
7. Record utilization table, per-feature file references, and evidence paths in the final report.

### Suggested Waves

| Wave | Categories | Scenarios | Rationale |
|---|---|---|---|
| 1 | Baseline flow + scope | CR-001..CR-003, CR-010..CR-012 | Cheap review paths reveal scope and precedence issues early |
| 2 | Security + evidence | CR-004..CR-009 | Exercises mandatory P0/P1 evidence and checklist discipline |
| 3 | Re-review + stale context | CR-013..CR-015 | Requires prior findings, stale docs, or generated-code fixtures |
| 4 | Cross-CLI | CR-016..CR-018 | Tool availability and handback reconciliation are isolated |
| 5 | Structural impact | CR-019 | Isolates code-graph freshness and `detect_changes` caveat behavior |
| 6 | Efficiency + restraint | CR-020..CR-024 | Restraint, needed-ness, ceiling evidence, depth alias, and the wording canary are read-only and isolate cleanly |

### Cross-CLI Reconciliation Rules

When multiple runtimes review the same scope:

1. Use one changed-file list for every runtime.
2. Preserve each runtime's raw report before synthesis.
3. Promote a finding to blocking only when file:line evidence supports it.
4. Downgrade unsupported P0/P1 claims to investigation notes, not blockers.
5. Keep disagreements visible with counterevidence sought.
6. Do not let one runtime's style preferences override surface-specific standards.
7. Treat implementation attempts by review-only delegates as scenario failure.
8. Reconcile severity against `references/review_core.md`, not against majority vote.
9. Record which runtime found each confirmed issue.
10. Return a single user-facing report with confirmed findings first and disagreements after.

### What Belongs In Per-Feature Files

- Real user request
- Prompt field with the canonical text for this scenario
- Expected review scope and risk lens
- Expected delegation or alternate-CLI routing
- Desired user-visible review output
- Feature-specific acceptance caveats and source anchors

---

## 7. BASELINE REVIEW FLOW (CR-001..CR-003)

This category covers 3 scenarios while the linked feature files remain the canonical execution contract.

### CR-001 | Small PR single-file

#### Description

Focused one-file review that should stay findings-first and scoped.

#### Scenario Contract

Prompt: `Review the staged one-file diff findings-first, with file:line evidence for P0/P1 issues and a clear merge posture.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-001](baseline-review-flow/small-pr-single-file.md)

### CR-002 | Large refactor PR

#### Description

Large-diff review that should disclose limits and use surface evidence.

#### Scenario Contract

Prompt: `Review the full refactor branch diff, call out large-diff limits and surface evidence, and keep blockers severity-ordered.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-002](baseline-review-flow/large-refactor-pr.md)

### CR-003 | Multi-commit feature branch

#### Description

Branch review that ties findings to merge-base scope and commit lineage.

#### Scenario Contract

Prompt: `Review the branch from merge-base to HEAD, preserving commit lineage and flagging unrelated-change risk.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-003](baseline-review-flow/multi-commit-feature-branch.md)

---

## 8. SECURITY AND CORRECTNESS MINIMUMS (CR-004..CR-006)

This category covers 3 scenarios while the linked feature files remain the canonical execution contract.

### CR-004 | Security-sensitive auth

#### Description

Auth/authz review that enforces mandatory baseline security minimums.

#### Scenario Contract

Prompt: `Review this auth-sensitive diff for missing auth or ownership checks, treating likely authorization gaps as P1/P0 risks.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-004](security-and-correctness-minimums/security-sensitive-auth.md)

### CR-005 | Input validation injection

#### Description

Injection review that requires context-aware source-to-sink evidence.

#### Scenario Contract

Prompt: `Review this validation diff for injection risks, tracing untrusted input to SQL, command, path, SSRF, or HTML sinks.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-005](security-and-correctness-minimums/input-validation-injection.md)

### CR-006 | Secrets and hardcoded credentials

#### Description

Secrets review that redacts evidence and treats real exposure as blocking.

#### Scenario Contract

Prompt: `Scan the staged diff for hardcoded credentials, private keys, passwords, tokens, and sensitive logs without echoing real secrets.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-006](security-and-correctness-minimums/secrets-and-hardcoded-creds.md)

---

## 9. SEVERITY AND EVIDENCE DISCIPLINE (CR-007..CR-009)

This category covers 3 scenarios while the linked feature files remain the canonical execution contract.

### CR-007 | P0 blocker with file:line

#### Description

Blocker review that proves severity with concrete file:line evidence.

#### Scenario Contract

Prompt: `Validate this suspected P0 diff hunk with exact file:line evidence, user impact, finding class, and an evidence-backed severity.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-007](severity-and-evidence-discipline/p0-blocker-with-file-line.md)

### CR-008 | Class of bug vs instance-only

#### Description

Finding-class review that prevents narrow fixes without scope proof.

#### Scenario Contract

Prompt: `Review this repeated bug pattern and inventory same-class producers before accepting an instance-only fix.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-008](severity-and-evidence-discipline/class-of-bug-vs-instance-only.md)

### CR-009 | Cross-consumer affected surface

#### Description

Consumer-impact review that requires affectedSurfaceHints and inventory.

#### Scenario Contract

Prompt: `Trace consumer impact for this shared helper or schema change, naming affected consumers or proving none exist.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-009](severity-and-evidence-discipline/cross-consumer-affected-surface.md)

---

## 10. SCOPE AND PRECEDENCE (CR-010..CR-012)

This category covers 3 scenarios while the linked feature files remain the canonical execution contract.

### CR-010 | Explicit scope security only

#### Description

Scope-respecting review that still enforces security-impact correctness.

#### Scenario Contract

Prompt: `Run a security-only review on the requested diff scope, suppressing style-only advice while keeping security-impact correctness blockers.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-010](scope-and-precedence/explicit-scope-security-only.md)

### CR-011 | Baseline vs surface precedence

#### Description

Precedence review that separates baseline minimums from surface conventions.

#### Scenario Contract

Prompt: `Review this diff against detected sk-code surface evidence, letting surface conventions win while baseline security and correctness still block.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-011](scope-and-precedence/baseline-vs-surface-precedence.md)

### CR-012 | Test code review

#### Description

Test-only review that uses test-quality severity and avoids production-style noise.

#### Scenario Contract

Prompt: `Review the staged test-only diff for assertion-free tests, swallowed assertions, over-mocking, flaky state, and cleanup gaps.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-012](scope-and-precedence/test-code-review.md)

---

## 11. RE-REVIEW AND STALE CONTEXT (CR-013..CR-015)

This category covers 3 scenarios while the linked feature files remain the canonical execution contract.

### CR-013 | Re-review after fixes

#### Description

Follow-up review that verifies previous findings against current code.

#### Scenario Contract

Prompt: `Re-review this follow-up diff against the original findings, closing each P0/P1 with current evidence or leaving it open.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-013](re-review-and-stale-context/re-review-after-fixes.md)

### CR-014 | Stale architecture fresh pass

#### Description

Fresh-pass review that does not let obsolete prose override code evidence.

#### Scenario Contract

Prompt: `Review the current code despite stale architecture notes, citing implementation evidence first and labeling any stale assumptions.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-014](re-review-and-stale-context/stale-architecture-fresh-pass.md)

### CR-015 | AI-generated suspect quality

#### Description

Generated-code review that focuses on behavior and evidence, not authorship.

#### Scenario Contract

Prompt: `Review this suspected AI-generated diff for over-abstraction, contract safety, and test adequacy based on behavior, not authorship.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-015](re-review-and-stale-context/ai-generated-code-suspect-quality.md)

---

## 12. CROSS-CLI ORCHESTRATION (CR-016..CR-018)

This category covers 3 scenarios while the linked feature files remain the canonical execution contract.

### CR-016 | Native Claude Code invocation

#### Description

Native @review invocation that checks read-only and findings-first behavior.

#### Scenario Contract

Prompt: `As an orchestrator, dispatch the native review agent against the target diff inside Claude Code or OpenCode. Verify @review stays read-only, loads review, and returns findings-first output. Return a native agent review transcript.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-016](cross-cli-orchestration/native-claude-code-invocation.md)

### CR-017 | cli-opencode delegation

#### Description

OpenCode handback that must preserve the review schema without editing files.

#### Scenario Contract

Prompt: `As an external conductor, delegate a code review to cli-opencode against the requested diff scope. Verify OpenCode uses findings-first severity, file:line evidence, and no implementation changes. Return a review-compatible handback.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-017](cross-cli-orchestration/cli-opencode-delegation.md)

### CR-018 | cli-opencode and cli-claude-code handback

#### Description

Alternate-CLI handback comparison that keeps unsupported claims out of blockers.

#### Scenario Contract

Prompt: `As an external conductor, cross-check a review through cli-opencode and cli-claude-code against the same changed-file list. Verify both handbacks preserve severity buckets, file:line evidence, and explicit uncertainty on disagreements. Return a reconciled review comparison.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-018](cross-cli-orchestration/cli-opencode-and-cli-claude-code-handback.md)

---

## 13. STRUCTURAL IMPACT PREFLIGHT (CR-019)

This category covers 1 scenario while the linked feature file remains the canonical execution contract.

### CR-019 | detect_changes-assisted review

#### Description

Local-diff review that attempts structural-impact analysis and keeps reviewing when the graph is stale.

#### Scenario Contract

Prompt: `Review this small local diff and use detect_changes for structural-impact preflight; if the graph is stale, include the caveat and continue the git-diff review.`

Desired user-visible outcome: A findings-first review artifact that records the structural-impact attempt, names stale or unavailable graph caveats when present, and preserves normal git-diff review coverage.

#### Test Execution

> **Feature File:** [CR-019](structural-impact-preflight/detect-changes-assisted-review.md)

---

## 14. EFFICIENCY AND RESTRAINT (CR-020..CR-024)

This category covers 5 scenarios while the linked feature files remain the canonical execution contract. These scenarios validate the v1.4.0.0 ponytail-based refinement: maintainability restraint, needed-ness, intentional-simplification evidence, the review-depth alias, and the load-bearing-wording canary.

### CR-020 | Reinvent-the-wheel detection

#### Description

Maintainability review that flags hand-rolled standard-library or native duplication and recommends the built-in.

#### Scenario Contract

Prompt: `Review this diff for code that re-implements standard-library or native platform behavior, and recommend the built-in primitive where the behavior and edge cases match.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-020](efficiency-and-restraint/reinvent-the-wheel-detection.md)

### CR-021 | Unrequested-code removal prompt

#### Description

Needed-ness review that recommends removal, not just simplification, for code tracing to no stated requirement.

#### Scenario Contract

Prompt: `Review this diff for code that traces to no stated requirement, and recommend removal with a Replacement entry when nothing in scope asked for it.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-021](efficiency-and-restraint/unrequested-code-removal.md)

### CR-022 | Ceiling-comment downgrade

#### Description

Intentional-simplification review that downgrades a too-simple finding on a concrete ceiling: comment but never a protected-class finding.

#### Scenario Contract

Prompt: `Review this diff where a deliberate shortcut carries a ceiling: comment; downgrade the matching too-simple KISS or YAGNI finding, but keep any security, auth, persistence, or correctness finding at full severity.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-022](efficiency-and-restraint/ceiling-comment-downgrade.md)

### CR-023 | Review-depth alias

#### Description

Depth-routing check that resolves SK_CODE_REVIEW_DEPTH env over config over default without relaxing any floor or skipping a sensitive path.

#### Scenario Contract

Prompt: `Run a review with SK_CODE_REVIEW_DEPTH set to ultra, then lite, and confirm ultra pulls in the on-demand deep-dive references while lite maps to the conservative skip, and that neither lowers the security and correctness floor or skips a sensitive-path diff.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-023](efficiency-and-restraint/review-depth-alias.md)

### CR-024 | Rule-invariant canary

#### Description

Deterministic guard run that proves the canary passes when wording agrees and fails closed when any copy drifts.

#### Scenario Contract

Prompt: `Run the rule-invariant canary and its self-test, confirm a clean pass, then tamper one Iron Law copy and confirm the canary fails loudly.`

Desired user-visible outcome: A findings-first review artifact that preserves scope, severity, evidence, and source-reference discipline.

#### Test Execution

> **Feature File:** [CR-024](efficiency-and-restraint/rule-invariant-canary.md)

---

## 15. AUTOMATED TEST CROSS-REFERENCE

The current repository has no dedicated automated test module for `review/manual_testing_playbook/`, and the sk-doc validator currently checks the root playbook only. These adjacent tests and stress fixtures exercise related routing or review-dispatch behavior.

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/python/test_skill_advisor.py` | Skill-advisor routing cases for `review`, `deep-review`, and review/write disambiguation | CR-016, CR-017, CR-018 |
| Internal design notes | Stress fixture that maps review channel behavior to `review` | CR-016 |
| Internal design notes | Earlier stress fixture for review channel expectations | CR-016 |

Validator limitation: per-feature file completeness requires the structural sweep described in this playbook until `validate_document.py` recurses into category folders.

---

## 16. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| CR-001 | Small PR single-file | BASELINE REVIEW FLOW | [CR-001](baseline-review-flow/small-pr-single-file.md) |
| CR-002 | Large refactor PR | BASELINE REVIEW FLOW | [CR-002](baseline-review-flow/large-refactor-pr.md) |
| CR-003 | Multi-commit feature branch | BASELINE REVIEW FLOW | [CR-003](baseline-review-flow/multi-commit-feature-branch.md) |
| CR-004 | Security-sensitive auth | SECURITY AND CORRECTNESS MINIMUMS | [CR-004](security-and-correctness-minimums/security-sensitive-auth.md) |
| CR-005 | Input validation injection | SECURITY AND CORRECTNESS MINIMUMS | [CR-005](security-and-correctness-minimums/input-validation-injection.md) |
| CR-006 | Secrets and hardcoded credentials | SECURITY AND CORRECTNESS MINIMUMS | [CR-006](security-and-correctness-minimums/secrets-and-hardcoded-creds.md) |
| CR-007 | P0 blocker with file:line | SEVERITY AND EVIDENCE DISCIPLINE | [CR-007](severity-and-evidence-discipline/p0-blocker-with-file-line.md) |
| CR-008 | Class of bug vs instance-only | SEVERITY AND EVIDENCE DISCIPLINE | [CR-008](severity-and-evidence-discipline/class-of-bug-vs-instance-only.md) |
| CR-009 | Cross-consumer affected surface | SEVERITY AND EVIDENCE DISCIPLINE | [CR-009](severity-and-evidence-discipline/cross-consumer-affected-surface.md) |
| CR-010 | Explicit scope security only | SCOPE AND PRECEDENCE | [CR-010](scope-and-precedence/explicit-scope-security-only.md) |
| CR-011 | Baseline vs surface precedence | SCOPE AND PRECEDENCE | [CR-011](scope-and-precedence/baseline-vs-surface-precedence.md) |
| CR-012 | Test code review | SCOPE AND PRECEDENCE | [CR-012](scope-and-precedence/test-code-review.md) |
| CR-013 | Re-review after fixes | RE-REVIEW AND STALE CONTEXT | [CR-013](re-review-and-stale-context/re-review-after-fixes.md) |
| CR-014 | Stale architecture fresh pass | RE-REVIEW AND STALE CONTEXT | [CR-014](re-review-and-stale-context/stale-architecture-fresh-pass.md) |
| CR-015 | AI-generated suspect quality | RE-REVIEW AND STALE CONTEXT | [CR-015](re-review-and-stale-context/ai-generated-code-suspect-quality.md) |
| CR-016 | Native Claude Code invocation | CROSS-CLI ORCHESTRATION | [CR-016](cross-cli-orchestration/native-claude-code-invocation.md) |
| CR-017 | cli-opencode delegation | CROSS-CLI ORCHESTRATION | [CR-017](cross-cli-orchestration/cli-opencode-delegation.md) |
| CR-018 | cli-opencode and cli-claude-code handback | CROSS-CLI ORCHESTRATION | [CR-018](cross-cli-orchestration/cli-opencode-and-cli-claude-code-handback.md) |
| CR-019 | detect_changes-assisted review | STRUCTURAL IMPACT PREFLIGHT | [CR-019](structural-impact-preflight/detect-changes-assisted-review.md) |
| CR-020 | Reinvent-the-wheel detection | EFFICIENCY AND RESTRAINT | [CR-020](efficiency-and-restraint/reinvent-the-wheel-detection.md) |
| CR-021 | Unrequested-code removal prompt | EFFICIENCY AND RESTRAINT | [CR-021](efficiency-and-restraint/unrequested-code-removal.md) |
| CR-022 | Ceiling-comment downgrade | EFFICIENCY AND RESTRAINT | [CR-022](efficiency-and-restraint/ceiling-comment-downgrade.md) |
| CR-023 | Review-depth alias | EFFICIENCY AND RESTRAINT | [CR-023](efficiency-and-restraint/review-depth-alias.md) |
| CR-024 | Rule-invariant canary | EFFICIENCY AND RESTRAINT | [CR-024](efficiency-and-restraint/rule-invariant-canary.md) |
