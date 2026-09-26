---
title: "sk-create-goal: Manual Testing Playbook"
description: "Operator directory, review protocol and orchestration guide for validating the sk-create-goal mode through eight deterministic goal-authoring scenarios in one category."
version: 1.0.0.0
---

# sk-create-goal: Manual Testing Playbook

This document is the operator directory and review surface for manual validation of the `sk-create-goal` mode. It explains how to run the scenarios, how to capture evidence and how to grade a run. Each per-feature file under `goal-authoring/` carries the execution truth for its scenario.

---

This playbook package follows the split-document pattern. The root document is the directory, review surface and orchestration guide while per-feature execution detail lives in the category folder.

Canonical package artifacts:
- `manual-testing-playbook.md`
- `goal-authoring/`

This packet ships no `feature-catalog/`. Every scenario records that absence in its own source table instead of linking to a catalog entry that does not exist.

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are recorded into `<skill>/benchmark/reports/<run-label>/` together with the evidence paths. Generated report Markdown is renderer-owned and never hand-authored.

---

## 1. OVERVIEW

This playbook covers the operator-visible behavior of the `sk-create-goal` mode in one category: goal authoring. The mode authors packet `goal.md` files and never touches session state. Every scenario runs against a disposable scratch packet built for the run and never against a real packet or a real spec folder.

The disposable scratch packet is the shared property of the scenarios. Each command sequence builds a small fixture under `$SCRATCH`, drives the mode against it and removes the scratch root at the end. A run leaves the repository untouched and a rerun reproduces the same verdict.

The boundary cases carry the most weight. In SCG-007 a run that writes no goal file is the passing outcome because the request was session work owned by the goal hooks. A run that writes a goal file for that request fails however good the goal reads. In SCG-005 and SCG-006 the passing outcome is a failed goal check with a named finding, because the check catching the defect is the behavior under test.

The operator validator computes the scenario census from the walked tree. This document does not hand-maintain counts.

### What Each Feature File Explains

- The realistic user request that should trigger the behavior
- The exact prompt and the orchestrator steps that should drive the test
- The exact command sequence including the scratch fixture bytes
- The expected signals as exit statuses, named output fields and named check results
- The desired user-visible outcome and the failure triage

---

## 2. GLOBAL PRECONDITIONS

1. The working directory is the repository root so `.skilled/skills/sk-doc/sk-create-goal/` and `.skilled/hooks/goal/` paths resolve.
2. Each scenario sets `$SCRATCH` with `mktemp -d` and runs every step in one shell session so the variable resolves in later steps. Substitute the run's absolute value before sending a prompt that names `$SCRATCH`.
3. The scratch workspace carries a copy of `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json` at the same relative path. Without that copy the goal hooks report `packet_budget=unknown` and the budget scenarios cannot be graded.
4. Scratch fixtures are written exactly as the scenario file gives them. A fixture edited for convenience changes what the scenario tests.
5. Every scenario is disposable. `rm -rf "$SCRATCH"` at the end of a scenario is the recovery for all of them and a run must confirm the scratch root is gone afterwards.
6. No scenario reads or writes a real packet, a real spec folder or any session state.
7. `grep -c` steps are read for both the printed count and the exit status, because a zero count exits non-zero and a reader who checks only one of the two reads the wrong signal.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript with each step's output and its exit status
- The prompt sent and the reply text received
- The named output fields captured in full: `packet_budget`, `packet_durable_chars`, `packet_nested`, `packet_slice_hash` and `chat_slice`
- The goal check lines: every per-check verdict line, the `RESULT:` line and each `FINDING` line
- Before and after readings wherever the scenario asserts a change
- The scenario verdict with its reason, spelled `PASS`, `FAIL` or `SKIP`

A scenario whose assertion is a comparison cannot be graded without both readings. A field the run did not capture reads as not recorded and is never filled in from inference.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands appear as `bash: <command>`.
- Agent instructions appear as `agent: <instruction>`. These scenarios are agent-driven so a step is usually what the orchestrator does: invoke the command surface, write fixture bytes or apply one named cut.
- `->` separates sequential steps in a table cell.
- A pipeline inside a table cell escapes its pipe as `\|` so the table keeps one column per field. The Commands list shows the same pipeline unescaped.
- `$SCRATCH` names the run's disposable scratch root. `$SCRATCH/specs/demo-packet` is the single-folder fixture packet and `$SCRATCH/specs/demo-phase` is the phase fixture packet used across the scenarios.
- Every expected signal is an exit status, a named output field or a named check result. Reading a signal means reading both the output and the exit status.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`
2. The per-feature files under `goal-authoring/`
3. Scenario execution evidence
4. The feature-to-scenario coverage map in section 9
5. Triage notes for every non-pass outcome

### Scenario Acceptance Rules

For each executed scenario check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present with no contradictory evidence.
4. Evidence is complete and readable.
5. The outcome rationale is explicit.

Two rules override intuition in this package:

- **A run that writes no goal file passes** in SCG-007. Grade the redirect and the untouched filesystem rather than any file produced.
- **A goal file written for a session request fails** in SCG-007 however well the goal reads.

Scenario verdict:
- `PASS`: all acceptance checks true
- `FAIL`: expected behavior missing, contradictory output or a critical check failed
- `SKIP`: a specific sandbox or runtime blocker prevents execution and each `SKIP` names that blocker

### Feature Verdict Rules

- `PASS`: the mapped scenario passes
- `FAIL`: the mapped scenario fails
- `SKIP`: the mapped scenario is blocked by a named sandbox or runtime blocker

Hard rule: a `FAIL` in SCG-001, SCG-002, SCG-005 or SCG-006 forces the release verdict to `FAIL`, because those scenarios gate the mode's core authoring and checking behavior.

### Release Readiness Rule

A release is acceptable only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios pass.
3. Coverage is the full set defined by this root index and backed by per-feature files.
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in this root file. Put feature-specific acceptance caveats in the matching per-feature file.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for a full manual run of the package.

### Operational Rules

1. Probe runtime capacity at start and reserve one coordinator.
2. Saturate remaining worker slots with pre-assigned scenario IDs and matching per-feature files.
3. Run SCG-001 first. It proves the scratch setup and the happy authoring path that the later scenarios assume.
4. Give every scenario its own scratch root. Two scenarios never share a `$SCRATCH` value and no scenario runs in parallel with another inside one scratch root.
5. SCG-005, SCG-006 and SCG-007 pass on a failed check or an untouched filesystem. Grade those runs on the named signals rather than on output volume.
6. After each wave, record the evidence and the verdicts, then begin the next wave.
7. Record the utilization table, the per-feature file references and the evidence paths in the final report.

### What Belongs In Per-Feature Files

- The exact prompt and the realistic user request
- The exact command sequence and the scratch fixture bytes
- Expected signals as exit statuses, named output fields and named check results
- Feature-specific acceptance caveats and failure triage

---

## 7. GOAL AUTHORING (`SCG-001..SCG-008`)

### SCG-001 | Top-level goal

#### Description
Verify the happy path: a goal authored for a single-folder packet passes all four named goal checks and measures within the durable budget.

#### Scenario Contract
Prompt: `Author the goal for the scratch demo packet at $SCRATCH/specs/demo-packet with /create:goal top-level :auto, run the goal check and print the chat slice if it passes.`

The workflow reads the packet sources, copies the top-level template and fills objective, decisions and three criteria with no placeholders. The goal check runs before any handoff and the chat slice prints only after the check passes.

Desired user-visible outcome: the operator receives a passing goal check and the chat slice to set.

#### Test Execution
> **Feature file:** linked from the cross-reference index in section 9.
> **Catalog:** no feature-catalog entry exists for this packet.

---

### SCG-002 | Phase parent and nested child goals

#### Description
Verify the phased shape: one parent goal carrying a binding row per phase folder and one child goal per phase folder with no binding section of its own.

#### Scenario Contract
Prompt: `Author the goals for the scratch phase packet at $SCRATCH/specs/demo-phase with /create:goal :auto: one phase-parent goal and one child goal per phase folder, then run the goal check on the parent and on each child.`

The parent goal starts from the phase-parent template with one binding row per direct child directory and each child goal keeps its criteria phase-local. The binding set equals the folder set by name.

Desired user-visible outcome: the operator sees one parent goal bound to every phase folder and one passing goal check per goal.

#### Test Execution
> **Feature file:** linked from the cross-reference index in section 9.
> **Catalog:** no feature-catalog entry exists for this packet.

---

### SCG-003 | Add goal to a packet without one

#### Description
Verify the retrofit operation on an existing packet that carries its source documents but no `goal.md`.

#### Scenario Contract
Prompt: `Add a goal to the existing scratch packet at $SCRATCH/specs/demo-packet with /create:goal retrofit :auto and verify it before handing it over.`

The workflow confirms the packet exists and has no goal file, copies the template for the packet's kind and fills it from the packet's own sources.

Desired user-visible outcome: the packet gains a goal file that passes the goal check and measures within budget.

#### Test Execution
> **Feature file:** linked from the cross-reference index in section 9.
> **Catalog:** no feature-catalog entry exists for this packet.

---

### SCG-004 | Cut an over-budget parent

#### Description
Verify that an over-budget parent goal is cut in the documented cut order down to `packet_budget=ok` with the completion criterion count unchanged.

#### Scenario Contract
Prompt: `The parent goal at $SCRATCH/specs/demo-phase is over the durable budget. Use /create:goal amend :auto to cut it in the documented cut order without dropping a completion criterion and show the budget field after each cut.`

The frontmatter and log cuts must leave `packet_durable_chars` unchanged because both sit outside the measured slice. The later cuts remove child restatement and compress decision prose and criterion wording.

Desired user-visible outcome: the operator sees the budget field drop to `ok` with every criterion still present.

#### Test Execution
> **Feature file:** linked from the cross-reference index in section 9.
> **Catalog:** no feature-catalog entry exists for this packet.

---

### SCG-005 | Refuse a leftover placeholder

#### Description
Verify that a template placeholder left in a goal makes the goal check fail on the `placeholder` check and that no chat slice is handed off while the finding stands.

#### Scenario Contract
Prompt: `Author the goal for the scratch demo packet at $SCRATCH/specs/demo-packet with /create:goal top-level :auto. I have not decided the counter update rule yet so leave that decision as the template placeholder.`

The goal check must name the placeholder finding and the run must stop there. A handoff printed while a finding stands is the failure this scenario exists to catch.

Desired user-visible outcome: the author is told the goal is not ready and which section still carries template text.

#### Test Execution
> **Feature file:** linked from the cross-reference index in section 9.
> **Catalog:** no feature-catalog entry exists for this packet.

---

### SCG-006 | Detect an unbound phase

#### Description
Verify that a phase folder missing from the parent binding table fails the `missing-binding-row` check even when the phase name appears elsewhere in the goal.

#### Scenario Contract
Prompt: `Before I sign off the phase parent at $SCRATCH/specs/demo-phase, run the goal check and tell me whether the binding table covers every phase folder.`

The seeded parent goal names the unbound phase in its objective prose and binds only the other phase. The check must fail on the binding row and on nothing else.

Desired user-visible outcome: the operator learns exactly which phase has no binding row before signing off.

#### Test Execution
> **Feature file:** linked from the cross-reference index in section 9.
> **Catalog:** no feature-catalog entry exists for this packet.

---

### SCG-007 | Route a session goal away

#### Description
Verify that a request to set or resend a session objective does not route to packet-goal authoring and leaves both the packet and session state untouched.

#### Scenario Contract
Prompt: `Set the goal for $SCRATCH/specs/demo-packet to ship the demo counter this week and resend it so this session picks it up.`

The reply must redirect the request to the goal hooks or the host goal command. No goal file appears and no session state is written.

Desired user-visible outcome: the user learns where session objectives belong and sees the mode keep its file boundary.

#### Test Execution
> **Feature file:** linked from the cross-reference index in section 9.
> **Catalog:** no feature-catalog entry exists for this packet.

---

### SCG-008 | Resend the parent after a child change

#### Description
Verify that a child change altering a parent decision amends the parent first and then prints the parent chat slice for the operator to resend.

#### Scenario Contract
Prompt: `The alpha phase now appends counter lines with a checksum instead of plain text. Update the goals under $SCRATCH/specs/demo-phase so the parent decision and the child goal agree and print the parent chat slice for me to resend.`

The parent goal is amended before the child goal is touched and the printed `chat_slice` carries the amended decision. Nothing is bound to a session because resending is the operator's act.

Desired user-visible outcome: the operator receives an up-to-date parent chat slice to resend.

#### Test Execution
> **Feature file:** linked from the cross-reference index in section 9.
> **Catalog:** no feature-catalog entry exists for this packet.

---

## 8. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `sk-create-goal/scripts/tests/check-goal.test.cjs` | Unit fixtures for the four named checks and their per-check exports | SCG-005 and SCG-006 exercise the same checks through the operator path |
| `sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | This playbook package's own operator-scenario contract | None directly. It gates the playbook rather than the mode the playbook tests |

Note: the mode ships no end-to-end test that authors a goal from packet sources. No automated check decides whether an authored objective reads true against its specification. This playbook is the operator-facing manual coverage for that gap and does not claim otherwise.

---

## 9. FEATURE CATALOG CROSS-REFERENCE INDEX

This packet ships no `feature-catalog/`, so the catalog column is absent and every scenario records that absence in its own source table. Each scenario's execution contract lives in the feature file linked from its row here.

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| SCG-001 | Top-level goal | GOAL AUTHORING | [SCG-001](goal-authoring/top-level-goal.md) |
| SCG-002 | Phase parent and nested child goals | GOAL AUTHORING | [SCG-002](goal-authoring/phase-parent-and-nested-child-goals.md) |
| SCG-003 | Add goal to a packet without one | GOAL AUTHORING | [SCG-003](goal-authoring/add-goal-to-packet-without-goal.md) |
| SCG-004 | Cut an over-budget parent | GOAL AUTHORING | [SCG-004](goal-authoring/cut-over-budget-parent.md) |
| SCG-005 | Refuse a leftover placeholder | GOAL AUTHORING | [SCG-005](goal-authoring/refuse-leftover-placeholder.md) |
| SCG-006 | Detect an unbound phase | GOAL AUTHORING | [SCG-006](goal-authoring/detect-unbound-phase.md) |
| SCG-007 | Route a session goal away | GOAL AUTHORING | [SCG-007](goal-authoring/route-session-goal-away.md) |
| SCG-008 | Resend the parent after a child change | GOAL AUTHORING | [SCG-008](goal-authoring/resend-parent-after-child-change.md) |
