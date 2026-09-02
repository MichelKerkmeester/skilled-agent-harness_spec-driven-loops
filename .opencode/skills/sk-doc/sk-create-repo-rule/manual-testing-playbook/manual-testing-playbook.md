---
title: "create-repo-rule: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the create-repo-rule sk-doc workflow packet."
version: 1.1.0.1
---

# create-repo-rule: Manual Testing Playbook

This document combines the full manual-validation contract for the `create-repo-rule` workflow packet into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide: it explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded, and where each per-feature validation file lives. The per-feature files provide the deeper execution contract for each scenario, including the user request, orchestrator prompt, execution process, source anchors, and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern for the `create-repo-rule` packet. The root document acts as the directory, review surface, and orchestration guide, while per-feature execution detail lives in the category folders at the playbook root.

Canonical package artifacts:
- `manual-testing-playbook.md`
- `rule-decision/`
- `rule-authoring/`
- `lifecycle-and-wiring/`

This packet ships no `feature-catalog/`. Every scenario therefore records the absence explicitly in its own source table rather than linking to a catalog entry that does not exist.

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into `<skill>/benchmark/reports/<dated-run-label>/`; generated report Markdown is renderer-owned and never hand-authored.

---

## 1. OVERVIEW

This playbook covers the operator-visible surface of the `create-repo-rule` packet across three categories: rule decision, rule authoring, and lifecycle and wiring. Each feature keeps its original ID and links to a dedicated feature file with the full execution contract. The operator validator computes the exact census from the walked tree; this document does not hand-maintain counts.

Coverage note (2026-08-31): every scenario is runnable today against the shipped references and assets. Three scenarios write into the rule set and are marked destructive with a named recovery path. `RRA-002` writes a draft to a scratch path outside `repo-rules/`, recoverable by deleting that path. The remaining six are read-only and end in a refusal or a halt.

### The Refusal Is The Common Case

One property shapes every grading rule below. **Most invocations of this workflow end in a refusal, and that is the correct outcome.** The decision tests refuse more than they admit by design. A run that produces no rule file is usually a pass, and it is graded on whether the refusal names the failed test and the destination, never on whether a file appeared.

The inverse also holds and matters more: a produced rule is a `FAIL` when the scenario expected a refusal, however well the rule reads. Four of the ten scenarios exist to catch exactly that.

### Realistic Test Model

1. A realistic user request is given to an orchestrator. Nobody asks for a rule file; they say a failure keeps happening.
2. The orchestrator decides whether to work locally, delegate to sub-agents, or invoke another CLI or runtime.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior
- The orchestrator brief or agent-facing prompt that should drive the test
- The expected execution process, including delegation or external CLI use when relevant
- The desired user-visible outcome
- The implementation anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root, so `.opencode/skills/sk-doc/sk-create-repo-rule/` subpaths and the root `REPO RULES.md` resolve.
2. A target repository is chosen and named before starting. Scenarios that wire or retire a rule need somewhere to act.
3. Whether the target repository has a rule router is known before starting. Its absence changes the expected path and is itself the subject of `RRL-001`.
4. The current counts are recorded before starting: rule files, trigger rows, and index rows. The structural assertions in this package are comparisons, and a single reading cannot be graded.
5. The working tree is clean for the target paths, so any diff is attributable to the run.
6. Destructive scenarios `RRA-001`, `RRL-001` and `RRL-003` MUST verify recovery is possible before execution. Recovery is `git checkout` of the affected rule file, the router, and the always-loaded document. `RRL-003` deletes a shipped rule and MUST run on a scratch branch.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript
- User request used
- Orchestrator or agent-facing prompt used
- Delegation or runtime-routing notes when applicable
- The verdict reached: refused, authored, revised, retired, or halted
- For a refusal: the test named and the destination named
- For an authored rule: the file path, its line count, and the band it falls in
- Counts of rule files, trigger rows, and index rows, taken before and after
- `git status --porcelain` for the target paths
- Scenario verdict with rationale (`PASS`, `FAIL`, or `SKIP`)

A scenario without both the before and after counts cannot be graded, because the structural assertion is a comparison rather than a reading.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands shown as `bash: <command>`.
- Agent prompts shown as `agent: <instruction>`. These scenarios are agent-driven, so a step is usually what an agent does: read a reference, apply a test, write or refuse to write a file.
- `->` separates sequential steps.
- Repo-relative paths are written as `.opencode/skills/sk-doc/sk-create-repo-rule/...`; the packet root means that directory wherever the packet is installed.
- Commands in this package avoid shell pipes so each step is a single deterministic invocation that survives being copied into a table cell.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`
2. Referenced per-feature files under the three category folders
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

Two rules override intuition in this package specifically:

- **A refusal is a `PASS`** when the scenario expects one. Grade the reasoning, not the output.
- **A produced rule is a `FAIL`** when the scenario expected a refusal, even when the rule is well written.

Scenario verdict:
- `PASS`: all acceptance checks true
- `FAIL`: expected behavior missing, contradictory output, or a critical check failed
- `SKIP`: a specific sandbox or runtime blocker prevents execution, and each `SKIP` must name the blocker

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the feature are `PASS`
- `FAIL`: any mapped scenario is `FAIL`
- `SKIP`: every mapped scenario is blocked by a named sandbox or runtime blocker

Hard rule:
- Any critical-path scenario `FAIL` (`RRD-001`, `RRD-002`, `RRA-001`, `RRL-003`) forces the feature verdict to `FAIL`.

### Release Readiness Rule

Release is releasable only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files.
4. No unresolved blocking triage item remains.

`RULE DECISION` carries more weight than the other two categories, because refusing correctly is what this workflow does most often.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Put feature-specific acceptance caveats in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start.
2. Reserve one coordinator.
3. Saturate remaining worker slots.
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run `RULE DECISION` as the first wave. It is entirely read-only, it is the cheapest wave, and it gates the value of the other two.
6. Run the destructive scenarios in a wave that first confirms the recovery path is available.
7. Never run `RRL-003` in parallel with `RRA-001` or `RRL-001` against the same target. All three change the counts that all three assert on, so neither result would be attributable.
8. After each wave, save context and evidence, then begin the next wave.
9. Record the utilization table, per-feature file references, and evidence paths in the final report.

### What Belongs In Per-Feature Files

- Real user request
- Prompt field following the Role, Context, Action, Format contract when the actor is an orchestrator
- Expected delegation or alternate-CLI routing
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints

---

## 7. RULE DECISION (`RRD-001..RRD-004`)

### RRD-001 | Always-loaded refusal

#### Description
Verify that a proposal whose content must bind on every turn is refused by decision test 1, and routed to the always-loaded document rather than filed behind a trigger.

#### Scenario Contract
Prompt: `Add a repo rule that says you must always read a file before you edit it. We keep getting blind edits and I want it written down.`

The tests load on every path, test 1 is answered by asking what must hold when nothing fires, and the refusal names both the test and the destination. No file is written.

Desired user-visible outcome: the user learns the request was refused, which test refused it, and where the obligation actually belongs.

#### Test Execution
> **Feature File:** [RRD-001](rule-decision/always-loaded-refusal.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### RRD-002 | Existing-owner refusal

#### Description
Verify that a proposal an existing rule already carries is refused by part 2 of the four-part test, with the owning rule named and the claim verified rather than asserted.

#### Scenario Contract
Prompt: `We keep saying work is finished before anyone runs the tests. Add a repo rule that stops us claiming done without proof.`

The refusal must name `evidence-and-proof.md` as the owner, and the operator must open that file to confirm it really carries the obligation.

Desired user-visible outcome: the user learns the obligation already exists, where it lives, and that a section there is the right home for anything missing.

#### Test Execution
> **Feature File:** [RRD-002](rule-decision/existing-owner-refusal.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### RRD-003 | Routing refusal

#### Description
Verify that dispatch mechanics are refused by the scope boundary test, with the excluding clause quoted verbatim and the scope statement left unedited.

#### Scenario Contract
Prompt: `Add a repo rule covering which CLI executor we should pick for research runs, and which thinking level to set for each one.`

Executor choice and thinking level are dispatch mechanics, which the scope statement lists as out of bounds. A paraphrase of that clause fails the scenario.

Desired user-visible outcome: the user sees the exact wording that puts the proposal out of bounds, and is told which surface owns it.

#### Test Execution
> **Feature File:** [RRD-003](rule-decision/routing-refusal.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### RRD-004 | Restraint refusal

#### Description
Verify that a best-practice appeal with no named present-day failure is refused by the restraint test, and that the refusal is recorded rather than routed to an invented destination.

#### Scenario Contract
Prompt: `Add a repo rule about writing good commit messages. It is best practice and I think we should have it written down.`

This is the one refusal that routes nowhere. The recorded reason is the deliverable, because an undocumented refusal returns later with nobody remembering why it was declined.

Desired user-visible outcome: the user learns the proposal lacked a concrete failure, and is invited to name one if it exists.

#### Test Execution
> **Feature File:** [RRD-004](rule-decision/no-observed-failure-refusal.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

## 8. RULE AUTHORING (`RRA-001..RRA-003`)

### RRA-001 | Full rule authoring

#### Description
Verify the one path that ends in a file: all four decision tests pass, the ten fixed elements are filled, and the produced rule lands inside the length bands with dividers equal to numbered sections.

#### Scenario Contract
Prompt: `We often have two agent sessions working in this repo at once, and they keep overwriting each other's uncommitted edits. Add a repo rule for working safely alongside another live session.`

The subject is chosen because no shipped rule owns it, and confirming that is part of the test. Destructive: writes a file, recoverable with `git checkout`.

Desired user-visible outcome: a rule indistinguishable in shape from the ones already shipped.

#### Test Execution
> **Feature File:** [RRA-001](rule-authoring/full-rule-authoring.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### RRA-002 | Standards gate rejection

#### Description
Verify that a draft passing every structural check is still rejected by the five reader standards, with the failing standards named individually rather than as a general impression.

#### Scenario Contract
Prompt: `Review this draft repo rule before I ship it. It has two numbered sections, six trigger phrases, and a self-check whose items repeat the section titles. Tell me whether it clears the bar.`

The gate returns five separate verdicts. A review returning fewer has summarized the standards rather than run them.

Desired user-visible outcome: the author learns exactly which standards fail and what would fix each.

#### Test Execution
> **Feature File:** [RRA-002](rule-authoring/standards-gate-rejection.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### RRA-003 | Trigger phrase collision

#### Description
Verify that a trigger phrase an existing rule already claims is caught before the file is written, with the owning rule named and the replacement checked the same way.

#### Scenario Contract
Prompt: `For the new rule, add "frozen scope" to its trigger phrases. That is what people type when they hit this.`

The search must be anchored to trigger-phrase entries. An unanchored search for the same words matches body prose in several files, and body prose is not a claim on a phrase.

Desired user-visible outcome: the author learns the phrase is taken, which rule takes it, and receives a checked alternative.

#### Test Execution
> **Feature File:** [RRA-003](rule-authoring/trigger-phrase-collision.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

## 9. LIFECYCLE AND WIRING (`RRL-001..RRL-003`)

### RRL-001 | Router bootstrap

#### Description
Verify that a target repository with no rule router gets the router emitted first, before any rule is written, and that the extra file is reported as a prerequisite rather than as part of the request.

#### Scenario Contract
Prompt: `This repository has no rules set up yet. Add a repo rule saying nobody deletes a database migration without a written rollback first.`

Ordering is the whole test: a rule written before the router exists is a file nothing can load. Destructive: writes two files.

Desired user-visible outcome: the requested rule plus a working router, with the extra file explained.

#### Test Execution
> **Feature File:** [RRL-001](lifecycle-and-wiring/router-bootstrap.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### RRL-002 | Scope boundary halt

#### Description
Verify that a finished rule the scope statement excludes causes a halt and an escalation, never a unilateral widening of the scope statement to admit it.

#### Scenario Contract
Prompt: `I have a finished rule about which sub-agent to dispatch for each kind of task. Wire it into the router so it loads.`

The correct outcome writes nothing. Any edit to the scope statement during this scenario is itself the failure, and an empty diff is the central evidence.

Desired user-visible outcome: the user is shown the excluding clause and told that widening the boundary is their decision to make explicitly.

#### Test Execution
> **Feature File:** [RRL-002](lifecycle-and-wiring/scope-boundary-halt.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

### RRL-003 | Rule retirement

#### Description
Verify that a rule is retired in the inverted create order, so that no intermediate state leaves a router row pointing at nothing, and that all three counts drop together.

#### Scenario Contract
Prompt: `The root cause rule has not caught anything in months and nothing it prevents still happens here. Retire it properly.`

Pointer, then index row, then trigger row, then the file, then the recorded reason. Destructive: deletes a shipped rule and edits two files, and MUST run on a scratch branch.

Desired user-visible outcome: the rule is gone, the router is consistent, and the reason it went is written down.

#### Test Execution
> **Feature File:** [RRL-003](lifecycle-and-wiring/rule-retirement.md)
> **Catalog:** no feature-catalog entry exists for this packet.

---

## 10. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `sk-create-skill/scripts/validate_skill_package.py` | Packet structure and metadata invariants | None directly; it is a packaging gate rather than a feature test |
| `sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | This playbook package's own operator-scenario contract | None directly; it validates the playbook, not the workflow the playbook tests |

Note: `create-repo-rule` ships no automated feature test suite, and no automated check can decide whether a proposed rule should exist. Both modules above are packaging gates. This playbook is the operator-facing manual equivalent for the workflow itself and does not claim otherwise.

---

## 11. FEATURE CATALOG CROSS-REFERENCE INDEX

This packet ships no `feature-catalog/`, so the Catalog column is intentionally absent and every scenario records that absence in its own source table.

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| RRD-001 | Always-loaded refusal | RULE DECISION | [RRD-001](rule-decision/always-loaded-refusal.md) |
| RRD-002 | Existing-owner refusal | RULE DECISION | [RRD-002](rule-decision/existing-owner-refusal.md) |
| RRD-003 | Routing refusal | RULE DECISION | [RRD-003](rule-decision/routing-refusal.md) |
| RRD-004 | Restraint refusal | RULE DECISION | [RRD-004](rule-decision/no-observed-failure-refusal.md) |
| RRA-001 | Full rule authoring | RULE AUTHORING | [RRA-001](rule-authoring/full-rule-authoring.md) |
| RRA-002 | Standards gate rejection | RULE AUTHORING | [RRA-002](rule-authoring/standards-gate-rejection.md) |
| RRA-003 | Trigger phrase collision | RULE AUTHORING | [RRA-003](rule-authoring/trigger-phrase-collision.md) |
| RRL-001 | Router bootstrap | LIFECYCLE AND WIRING | [RRL-001](lifecycle-and-wiring/router-bootstrap.md) |
| RRL-002 | Scope boundary halt | LIFECYCLE AND WIRING | [RRL-002](lifecycle-and-wiring/scope-boundary-halt.md) |
| RRL-003 | Rule retirement | LIFECYCLE AND WIRING | [RRL-003](lifecycle-and-wiring/rule-retirement.md)  |
