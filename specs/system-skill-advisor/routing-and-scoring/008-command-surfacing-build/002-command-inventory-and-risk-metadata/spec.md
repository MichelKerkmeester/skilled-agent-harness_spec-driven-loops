---
title: "Feature Specification: Phase 2: command-inventory-and-risk-metadata"
description: "No single list names every slash command with what it writes, so nothing can derive whether a surfaced command should run, start or ask. This phase makes the bridge deriver read the command tree, adds a risk class to every command and route and emits a derived policy, with no scoring change."
trigger_phrases:
  - "command inventory and risk metadata"
  - "phase 2 command inventory and risk metadata"
  - "command risk class"
  - "derived command policy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3-plus-govern | v2.4 -->
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Phase 2: command-inventory-and-risk-metadata



---

## EXECUTIVE SUMMARY

The bridge deriver merges three hand-kept sources and never looks at the command files, so 4 of the 44 tracked commands appear in no source and no command states what it writes. This phase makes the command tree the identity source, gives every command and doctor route a `mutating` class and emits a derived `run`, `start` or `ask` policy in the generated file. The proof is `derive-command-bridges.cjs --check` printing `fresh`, exiting 1 on a fixture command with no attributes, and the phase 1 numbers holding still.

**Key Decisions**: amend the skill root metadata contract so a standalone skill may carry `command-metadata.json` (operator decision, 2026-11-12), emit policies as a new top-level key so no bridge entry and no scorer input changes

**Critical Dependencies**: the phase 1 baseline and slice test, which prove that this phase changes no routing

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 7 |
| **Predecessor** | 001-command-routing-baseline-corpus |
| **Successor** | 003-plain-chat-command-reach |
| **Handoff Criteria** | Every tracked command and doctor route has a risk class and a derived policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Build command surfacing in the skill advisor so every tracked slash command reaches the model with a run-or-ask policy and a chat-only request reaches a proper workflow specification.

**Scope Boundary**: Data and derivation only. This phase adds attributes, an identity check and a derived policy list. It changes no scorer lane, no bridge activation, no recommendation field, no brief and no instruction file, and it retires no allow-list row.

**Dependencies**:
- Phase 001: `command-routing-baseline.json` and `tests/command-routing-slice.vitest.ts`.
- The review's R1, R4 and G4 and its section 5 table, in `../../007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md`.
- The operator decision of 2026-11-12 to amend the skill root metadata contract.

**Deliverables**:
- A deriver that reads the command tree and fails on a command with no attributes or an entry with no command file.
- A `mutating` class on all 19 existing metadata entries, and new `command-metadata.json` files for `system-spec-kit` and `sk-prompt`.
- A `commandPolicies` list in `command-bridges.generated.json`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deriver builds its inventory from `command-metadata.json` files, an allow-list and the doctor manifest, and it never reads `.skilled/commands/`. Four tracked commands (`/speckit:save`, `/speckit:search`, `/speckit:handoff`, `/prompt:improve`) are in none of those sources, three allow-list rows name commands that have no file, and only doctor routes say whether they write. A model that is handed a surfaced command therefore has nothing to tell it whether running the command is safe.

### Purpose
One generated file lists every tracked command and doctor route with a risk class and a derived `run`, `start` or `ask` policy, and the deriver fails when the list and the command tree disagree.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check | jq -c .
{"status":"fresh","counts":{"commandMetadata":19,"allowList":8,"doctorRoutes":35,"generated":62,"typescriptActive":40,"pythonActive":50},"changed":[]}
$ jq -c '(.entries[0]|keys), keys' .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json
["command","id","ownerMode","runtime","skillId","source"]
["counts","entries","generatedBy","schemaVersion"]
$ node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs | tail -1
checked=14 passed=14 failed=0 fixed=0
```

The check reports `fresh` while 4 command files have no entry, because it compares the generated file with its three sources and not with the command tree. The generated file has no policy key. The contract gate passes 14 of 14 today and must still pass after the amendment.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make `derive-command-bridges.cjs` read `.skilled/commands/<namespace>/<name>.md` and fail on a command with no attributes and on a metadata entry or doctor route with no command file.
- Add `mutating`, `gate3_location` and the optional `ask_first` and `write_scope` keys to every `command-metadata.json` entry, and create the file for `system-spec-kit` and `sk-prompt`.
- Amend the skill root metadata contract so a standalone root may carry `command-metadata.json` with `ownerMode` equal to its own skill id.
- Derive a policy per command and per doctor route or action and emit it as `commandPolicies` in the generated file.
- Give `/doctor:env` per-action classes and mark the two spec-folder-only doctor routes.

### Out of Scope
- Activating any bridge or changing `scoring-compatibility.json` - that is phase 003, and this phase must leave routing untouched.
- Retiring the allow-list rows and the ids `/spec_kit`, `/memory:save` and `/prompt` - the review places that after the contract change in phase 005.
- Carrying the policy in a recommendation or the brief - phase 005.
- Real intent phrases for the 8 newly described commands - phase 003. Their `ownedSignals` hold the command string only.
- The private `/local-skilled-alignment` command - decision D5.

### Files to Change

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. `SK` is `.skilled/skills/sk-doc/sk-create-skill`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `ADV/scripts/command-bridges/derive-command-bridges.cjs` | Modify | Tree read, the two identity failures, attribute validation, policy derivation |
| `ADV/scripts/command-bridges/command-bridges.generated.json` | Modify | Regenerated: four new disabled entries and `commandPolicies` |
| `ADV/lib/scorer/projection.ts`, `ADV/scripts/skill_advisor.py`, `ADV/lib/render.ts` | Modify | Only what the deriver rewrites inside its marked blocks |
| `.skilled/skills/sk-doc/command-metadata.json`, `.skilled/skills/sk-design/command-metadata.json`, `.skilled/skills/system-deep-loop/command-metadata.json` | Modify | Risk keys on 19 entries |
| `.skilled/skills/system-spec-kit/command-metadata.json`, `.skilled/skills/sk-prompt/command-metadata.json` | Create | 7 and 1 entries |
| `.skilled/commands/doctor/_routes.yaml` | Modify | `/doctor:env` actions and `write_scope` on two routes |
| `SK/scripts/lib/skill-root-metadata-contract.cjs`, `SK/scripts/ci-skill-root-metadata.cjs` | Modify | The standalone allowance and the owner rule |
| `SK/scripts/tests/skill-root-metadata-contract.test.cjs`, `SK/references/shared/skill-root-metadata-contract.md` | Modify | Test and reference for the amended rule |
| `ADV/tests/command-policy-derivation.vitest.ts` | Create | The four policy rows and the two identity failures |
| `ADV/tests/command-metadata-e2e.vitest.ts` | Modify | Census 19 to 27 |
| `ADV/tests/command-bridges-drift-guard.vitest.ts` | Modify | Expected ids follow the allow-list rule |
| `ADV/scripts/command-bridges/README.md` | Modify | The new keys and the rule |
| `ADV/scripts/routing-accuracy/command-routing-baseline.json` | Modify | Re-captured for `bridgeCounts` only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `derive-command-bridges.cjs --check` exits 1 and names the command when a file `.skilled/commands/<namespace>/<name>.md` has neither a `command-metadata.json` entry nor a doctor route. |
| REQ-002 | The same check exits 1 and names the entry when a metadata entry or a doctor route names a command with no file. Allow-list rows are exempt in this phase. |
| REQ-003 | Every `command-metadata.json` entry has `mutating` set to `read-only`, `add-only` or `mutates` and a `gate3_location` string. `ask_first`, when present, holds only `settings`, `outside-repo`, `spend` or `relaunch`. `write_scope`, when present, is `spec-folder`. The deriver exits non-zero on a missing class or an unknown value and names the entry. |
| REQ-004 | The skill root metadata contract allows `command-metadata.json` on a standalone root. For a root with no `mode-registry.json`, the gate requires `ownerMode` to equal the skill id. `ci-skill-root-metadata.cjs` reports every root passed. |
| REQ-005 | `system-spec-kit/command-metadata.json` holds the 7 `/speckit` commands and `sk-prompt/command-metadata.json` holds `/prompt:improve`. Each entry passes the core schema, and its `ownedSignals` holds the command string alone. |
| REQ-006 | `command-bridges.generated.json` has a top-level `commandPolicies` array with one record per command and one per doctor route or action. A record has `command`, `route`, `mutating`, `askFirst` and `policy`. Each entry in `entries` keeps its six keys. |
| REQ-007 | The policy is derived in this order: a non-empty `ask_first` gives `ask`. A doctor route or action classed `mutates` gives `ask`. `read-only` gives `run`. `add-only` with `write_scope: spec-folder` gives `run`. Everything else gives `start`. |
| REQ-008 | Routing does not change: the four pinned numbers read 158, 50, 20 and 5, `tests/command-routing-slice.vitest.ts` passes with `rows`, `metrics`, `commands` and `unreachable` of the baseline untouched, and `npm test` in `ADV` passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | `/doctor:env` declares the actions `list` as `read-only` and `select` as `mutates`, and the doctor route validator passes. |
| REQ-010 | A file `.skilled/commands/local-anything.md` or `.skilled/commands/<namespace>/local-anything.md` is ignored by the tree read, and `local-skilled-alignment` appears in no generated file. |
| REQ-011 | A metadata entry whose command an allow-list row already carries adds no second entry to `entries`. The four other new commands add one disabled entry each, so `counts.generated` is 66 and `typescriptActive` and `pythonActive` stay 40 and 50. |
| REQ-012 | Rolled up to the strictest route per command, `commandPolicies` gives 7 `run`, 22 `start` and 15 `ask`, the counts in section 5 of the review. A command that lands elsewhere is listed with its reason in `implementation-summary.md`. |
| REQ-013 | `tests/command-policy-derivation.vitest.ts` asserts the five rule rows of REQ-007 and the two failures of REQ-001 and REQ-002 against fixtures. |
| REQ-014 | `ADV/scripts/command-bridges/README.md` and `SK/references/shared/skill-root-metadata-contract.md` state the new keys and the amended rule. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node ADV/scripts/command-bridges/derive-command-bridges.cjs --check | jq -r .status` prints `fresh`, and `jq '[.commandPolicies[].command] | unique | length'` on the generated file prints 44.
- **SC-002**: With a fixture command file that has no attributes, the same check exits 1 and its output names the command.
- **SC-003**: `git diff --stat` on `command-routing-baseline.json` shows changes in `bridgeCounts` and `capturedAtSha` only.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 baseline and slice test | Without them a routing change in this phase would go unseen | Run them after every deriver run |
| Dependency | The skill root metadata gate, `ci-skill-root-metadata.cjs` | New metadata files fail it until the contract is amended | Amend the contract before the files are created |
| Risk | New metadata entries or their `ownedSignals` feed a scorer lane and move a number | High | `ownedSignals` holds the command string only. If any pinned number or baseline row moves, stop and report before any re-capture |
| Risk | The generated Python block gains rows and trips the Python parity probe | Med | Run `tests/command-bridges-drift-guard.vitest.ts` and the divergence ratchet straight after the first regeneration |
| Risk | A class is authored from guesswork | Med | Classes for the 19 hub commands come from the review table and each command's own workflow file. A class that cannot be confirmed is `mutates` |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A. The deriver runs at authoring time and in tests, not on a request path.

### Security
- **NFR-S01**: A missing or unreadable class never yields `run`. The deriver fails, and it never defaults a class.

### Reliability
- **NFR-R01**: Two deriver runs on the same tree write byte-identical files, so `--check` after a write prints `fresh`.

---

## 8. EDGE CASES

- Empty input: a namespace folder with no command files contributes nothing and is not an error.
- Maximum input: a doctor command with several routes or actions gets one policy record per route or action and no command-level record.
- Failure path: an unknown `ask_first` reason exits non-zero with the file, the command and the bad value.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Files: about 16, LOC: about 700, Systems: 3 (advisor, sk-doc contract, doctor manifest) |
| Risk | 12/25 | Auth: N, API: N, Breaking: a shared contract changes |
| Research | 6/20 | Classes for 19 hub commands need each workflow file read |
| Multi-Agent | 6/15 | Workstreams: 3 |
| Coordination | 8/15 | Dependencies: 3, and phases 3, 5 and 6 read the policy list |
| **Total** | **48/100** | **Level 3+** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A routing number moves | H | L | No activation change, and REQ-008 is rerun after each regeneration |
| R-002 | The contract amendment lets an incoherent file through | M | L | The owner rule for registry-less roots, with a failing fixture in the contract test |
| R-003 | A command is classed safer than it is | H | M | Unconfirmed means `mutates`, and REQ-012 compares the rollup with the review |
| R-004 | The allow-list exemption hides a real orphan | L | L | The exemption is one named constant with a comment, removed in phase 005 |

---

## 11. USER STORIES

### US-001: One list I can trust (Priority: P0)

**As a** maintainer adding a slash command, **I want** the deriver to fail when my command has no risk class, **so that** no command reaches a model without a policy.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

### US-002: A policy per command (Priority: P0)

**As an** operator who chats without typing commands, **I want** each command to carry a derived run, start or ask policy, **so that** a later phase can tell the model when to ask me first.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Operator | Approved | 2026-11-12 |
| Design Review | Operator | Pending | - |
| Implementation Review | Operator | Pending | - |
| Launch Approval | Operator | Pending | - |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance-checkpoints -->
## 13. COMPLIANCE CHECKPOINTS

### Security Compliance
- N/A: the phase adds metadata and derivation. It reads no credential, no user data and no network resource.

### Code Compliance
- [ ] Coding standards followed
- N/A for licence: no dependency is added.
<!-- /ANCHOR:compliance-checkpoints -->

---

<!-- ANCHOR:stakeholder-matrix -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Operator | Product | High | The end-of-turn status of each session |
| Operator | Engineering | High | `implementation-summary.md` of this phase |
<!-- /ANCHOR:stakeholder-matrix -->

---

<!-- ANCHOR:change-log -->
## 15. CHANGE LOG

### v1.0 (2026-11-12)
**Initial specification**
<!-- /ANCHOR:change-log -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- None blocks implementation. The contract question was settled by the operator on 2026-11-12: amend the contract.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`

---
