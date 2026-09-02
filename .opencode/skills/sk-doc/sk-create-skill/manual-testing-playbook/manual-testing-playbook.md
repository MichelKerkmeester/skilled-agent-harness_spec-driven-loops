---
title: "sk-create-skill: Manual Testing Playbook"
description: "Operator-facing scenarios for scaffolding standalone skills, building parent hubs, validating root metadata and preserving routing boundaries."
version: 1.2.0.1
---

# sk-create-skill: Manual Testing Playbook

This playbook defines the operator contract for `sk-create-skill`. It covers standalone skill creation, root metadata classes, parent-hub routing files, compiled-routing readiness and packet identity boundaries.

The root file owns shared skill-authoring policy. Category files own scenario execution truth. This package has no feature catalog. Each scenario says so in its source table.

Canonical package artifacts:

- `manual-testing-playbook.md`
- `standalone-skill/`
- `parent-hub/`

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into the owning skill's benchmark report folder. Use `SKIP` only with a specific sandbox or runtime blocker.

---

## 1. OVERVIEW

This package tests the two authoring paths owned by `sk-create-skill`. It checks the standalone scaffold and its metadata, the handoff to quality control, parent-hub registry and router parity, the `ready` boundary and the single-advisor-identity rule.

Coverage is split into six scenarios across two categories. Three scenarios cover standalone skills. Three cover parent hubs.

### Realistic Test Model

1. A user describes a new skill or parent hub in concrete terms.
2. The mode decides the root class and selects the matching creation path.
3. The operator checks generated files, authored declarations and package structure.
4. The operator validates the final root and records any handoff or runtime boundary.

### Coverage Boundary

The mode must create skill artifacts from the selected standalone or parent path. It must leave existing-document quality audits to `sk-create-quality-control`. It must keep one advisor identity at a parent hub and must not claim compiled serving from a fresh `ready` manifest.

---

## 2. GLOBAL PRECONDITIONS

1. Run commands from the repository root.
2. Read the target folder and any existing root files before editing.
3. Use a clean target path for scaffold scenarios and record the recovery path.
4. Keep generated files under the correct producer and do not hand-edit generated manifests.
5. A scenario may end as `SKIP` only when a named sandbox or runtime blocker prevents execution.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The exact user request
- The selected workflow mode
- The target root and its class
- The exact command sequence and exit statuses
- Authored versus generated file evidence
- Registry and router key sets for parent hubs
- The final package or handoff result
- The scoped working-tree state

Do not infer a root class from a generated manifest. Do not report a parent hub as compiled-serving from a `ready` initialization result.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands use `bash: <command>`.
- Node commands use `node <script> <args>`.
- Agent actions use `agent: <instruction>`.
- The arrow `->` separates ordered steps.
- Paths are repository-relative.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. This root playbook
2. Every linked scenario file
3. The selected workflow mode and root class
4. Validation or parent-check output
5. Triage notes for every non-pass outcome

### Scenario Acceptance Rules

1. Resolve standalone versus parent before authoring.
2. Read existing target files before changing them.
3. Check authored and generated file ownership.
4. Confirm paths and registry keys from the final state.
5. Record `PASS`, `FAIL` or `SKIP` with the required reason.

`PASS` requires all checks to agree. `FAIL` covers a wrong root class, stale generated output, missing router parity, an unauthorized artifact or a false runtime claim. `SKIP` requires a specific sandbox or runtime blocker.

### Feature Verdict Rules

- `PASS`: every mapped scenario passes.
- `FAIL`: one mapped scenario fails.
- `SKIP`: every mapped scenario is blocked by a named sandbox or runtime blocker.

### Release Readiness Rule

Release is ready only when strict package validation passes, root metadata matches the selected class, parent registry and router keys agree, generated files are fresh and runtime claims stay within the creation workflow's authority.

### Root-vs-Feature Rule

The root owns shared class, validation and runtime-boundary policy. A scenario file owns its target, prompt, commands, expected signals, evidence, pass/fail rule and triage.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

Wave planning keeps standalone scaffolding separate from parent-hub routing work. It does not replace the root class gate.

### Operational Rules

1. Run standalone class scenarios before parent-hub scenarios.
2. Check generated freshness after authored metadata is complete.
3. Run parent registry and router checks against the named hub path.
4. Keep `ready` manifest inspection separate from compiled-serving claims.
5. Record the exact package path and final status for each scenario.

### What Belongs In Per-Feature Files

- The realistic user request
- The selected authoring path
- The target root and class
- The exact commands
- The generated and authored file evidence
- The user-visible outcome

---

## 7. STANDALONE SKILL (`SKL-001..SKL-003`)

### SKL-001 | Scaffold a standalone skill

#### Description

Verify that a new one-identity skill uses the standalone scaffold, removes unused examples and passes strict package validation.

#### Scenario Contract

Prompt: `Create a standalone OpenCode skill named invoice-review under .opencode/skills and package it.`

The mode should understand the skill's concrete use cases, scaffold the folder with `init_skill.py`, normalize the required sections, remove unused examples, author needed resources, validate the root and package only after validation passes.

Desired user-visible outcome: a valid standalone skill with a clear runtime contract and no unused scaffold files.

#### Test Execution

> **Feature File:** [SKL-001](standalone-skill/scaffold-a-standalone-skill.md)
> **Catalog:** no feature-catalog entry applies to this package.

---

### SKL-002 | Classify standalone root metadata

#### Description

Verify that a standalone root authors `graph-metadata.json` and `leaf-manifest.config.json`, omits hub-only declarations and generates fresh manifest files.

#### Scenario Contract

Prompt: `My new skill is standalone. Which root metadata files should I author and which ones should the gate generate?`

The mode should classify the root as class S because it declares neither `mode-registry.json` nor `hub-router.json`. It should author the identity and leaf config, run the metadata gate with `--fix` and confirm that `leaf-manifest.json` and `leaf-aliases.json` are generated. It should not add `description.json` or a parent registry.

Desired user-visible outcome: a standalone root with the correct authored and generated metadata.

#### Test Execution

> **Feature File:** [SKL-002](standalone-skill/classify-standalone-root-metadata.md)
> **Catalog:** no feature-catalog entry applies to this package.

---

### SKL-003 | Leave quality audits alone

#### Description

Verify that a request to score or improve an existing skill document routes to quality control instead of scaffolding a new skill.

#### Scenario Contract

Prompt: `Audit the existing invoice-review SKILL.md for DQI and human voice issues. Do not create anything.`

The mode should recognize an existing-document audit and route it to `sk-create-quality-control`. It should not initialize a new folder or package the existing document as a new skill.

Desired user-visible outcome: an existing-document report from the quality workflow.

#### Test Execution

> **Feature File:** [SKL-003](standalone-skill/leave-quality-audits-alone.md)
> **Catalog:** no feature-catalog entry applies to this package.

---

## 8. PARENT HUB (`SKL-004..SKL-006`)

### SKL-004 | Author a two-axis parent hub

#### Description

Verify that a parent hub keeps one `modes[]` registry, pairs router signals with registry modes and orders a workflow before a surface packet.

#### Scenario Contract

Prompt: `Create a parent hub with one workflow packet and one read-only evidence packet. Keep routing and packet registration consistent.`

The mode should select `create-skill-parent`, author the hub registry and router, register both packets in one `modes[]` array, declare the surface axis when a surface packet exists, keep workflow modes before surfaces in `tieBreak` and validate the named hub path.

Desired user-visible outcome: a parent hub whose registry, router, packets and root router state agree.

#### Test Execution

> **Feature File:** [SKL-004](parent-hub/author-a-two-axis-parent-hub.md)
> **Catalog:** no feature-catalog entry applies to this package.

---

### SKL-005 | Keep ready separate from compiled serving

#### Description

Verify that `--compiled-routing ready` mints fresh onboarding evidence with legacy serving authority and does not claim live compiled routing.

#### Scenario Contract

Prompt: `Initialize this parent hub with compiled-routing ready. Does that make it serve compiled routes now?`

The mode should explain that the command writes a manifest with generation one, `servingAuthority: legacy` and `shadowOnly: true` after freshness checks. It should state that compiled serving needs a proven shadow child, parity evidence, activation and cohort membership.

Desired user-visible outcome: a precise runtime claim that distinguishes onboarding evidence from live serving.

#### Test Execution

> **Feature File:** [SKL-005](parent-hub/keep-ready-separate-from-compiled-serving.md)
> **Catalog:** no feature-catalog entry applies to this package.

---

### SKL-006 | Keep one parent identity

#### Description

Verify that nested packets do not receive packet-local advisor identity files and that the parent hub remains the single identity.

#### Scenario Contract

Prompt: `Add graph-metadata.json to each child packet so the advisor can discover every mode directly.`

The mode should refuse the second identity, keep `graph-metadata.json` at the parent hub only and use the registry and hub membership for packet routing. It should not create a second advisor identity to make a packet visible.

Desired user-visible outcome: one advisor identity with nested packets routed through the parent contract.

#### Test Execution

> **Feature File:** [SKL-006](parent-hub/keep-one-parent-identity.md)
> **Catalog:** no feature-catalog entry applies to this package.

---

## 9. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `init_skill.py` | Standalone and parent scaffolding paths plus compiled-routing initialization | SKL-001 and SKL-005 |
| `package_skill.py` | Strict skill package structure and frontmatter checks | SKL-001 |
| `ci-skill-root-metadata.cjs` | Root class, authored and generated metadata, forbidden files and freshness | SKL-002 and SKL-006 |
| `parent-skill-check.cjs` | Parent registry, router, packet and root-router conformance | SKL-004 |

The gates prove file and schema state. They do not by themselves prove that a new mode is reachable from every routing surface or that a ready manifest serves compiled traffic.

---

## 10. FEATURE CATALOG CROSS-REFERENCE INDEX

This package has no feature catalog. The root index below is the source of scenario membership.

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| SKL-001 | Scaffold a standalone skill | STANDALONE SKILL | [SKL-001](standalone-skill/scaffold-a-standalone-skill.md) |
| SKL-002 | Classify standalone root metadata | STANDALONE SKILL | [SKL-002](standalone-skill/classify-standalone-root-metadata.md) |
| SKL-003 | Leave quality audits alone | STANDALONE SKILL | [SKL-003](standalone-skill/leave-quality-audits-alone.md) |
| SKL-004 | Author a two-axis parent hub | PARENT HUB | [SKL-004](parent-hub/author-a-two-axis-parent-hub.md) |
| SKL-005 | Keep ready separate from compiled serving | PARENT HUB | [SKL-005](parent-hub/keep-ready-separate-from-compiled-serving.md) |
| SKL-006 | Keep one parent identity | PARENT HUB | [SKL-006](parent-hub/keep-one-parent-identity.md) |
