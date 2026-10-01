---
title: "Feature Specification: Phase 41: code-readmes-and-routing-alignment"
description: "Eleven code folders this packet created or filled ship no `README.md`, and the `cli-classifier` hub's surface router is still `router_state: stage1-only` while both of its mode SKILL.md files route by a request-to-file lookup table rather than the sk-doc template's one Smart Router Pseudocode block. This phase writes a code-folder README for each of the eleven folders, promotes `ROUTER.md` to active over the seven committed intents, reshapes both mode section 2s, drops the last leftovers of the `cli-usage` rename, and bumps the three pre-release version lines, with every compiled-route decision that was already correct left unchanged."
trigger_phrases:
  - "code folder readmes"
  - "missing code readme"
  - "router state active"
  - "mode section 2 smart router"
  - "cli-usage-aliases rename"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 41: code-readmes-and-routing-alignment

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-30 |
| **Branch** | `worktrees/071-cli-jev-sk-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 41 of 41 |
| **Predecessor** | 040-hard-rules-sidecar |
| **Successor** | None |
| **Handoff Criteria** | The five completion criteria in `goal.md` each run from the final state: the eleven code folders hold a README that `validate_document.py` calls VALID and whose documented test command passes, `ROUTER.md` is active and `parent-skill-check.cjs` prints 0 warnings, both mode section 2s carry the template's one pseudocode block and `validate_skill_package.py` passes on the hub and both modes, no `cli-usage-aliases` remains under the hub and the ten-prompt compiled-route probe holds its eight correct rows while the two former misses route, every version artifact agrees with its newest changelog, and `validate.sh --strict` prints `RESULT: PASSED` for this phase and the parent. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 41** of the cli-jev workflow integration specification, the last phase of the packet. The operator raised two asks on 2026-09-30: "Scripts and tests folder nested inside are missing code readme's" and "make sure smart routing in parent hub and nested modes are 100% perfected and aligned with sk doc create skill".

The two asks became the phase's two parts. Part A, code READMEs: eleven code folders that this packet created or filled carry no `README.md`, so a reader of `shared/scripts`, a transport's `scripts/` or a `tests/` folder has no documented topology, entrypoints or test command. Each gets a code-folder README written through `sk-create-readme`. Part B, routing alignment: the hub and its two modes route correctly today, yet three canon gaps remain between the hub's own artifacts and the `sk-create-skill` template, and the `cli-usage` rename left a class name and a sentence behind.

The baseline was read on 2026-09-30. `parent-skill-check.cjs` passes with 0 warnings and `validate_skill_package.py` passes on the hub and both modes, so this phase is an alignment and documentation pass over a working router, not a routing fix. The compiled front door already routes a Jev ask to `cli-jev`, a Deem ask to `cli-deem`, the old name `cli-usage` to `cli-jev`, both alias phrases to an ordered bundle, and an off-topic ask to a defer. Those decisions are frozen (D2).

**Scope Boundary**: the eleven code-folder READMEs of section 3; the hub's `ROUTER.md`, `SKILL.md`, `hub-router.json`, `mode-registry.json` and `description.json` version line; both mode `SKILL.md` section 2s and the transport wording that moves from `cli-jev` section 2 to section 3; the playbook and scenario files that name the renamed vocabulary class; the three changelog entries; the regenerated compiled-route manifest and Hermes copies; and this phase's own record. No routing decision that was correct at baseline changes, no bare backend word joins a vocabulary class, and no code file is edited.

**Dependencies**:
- Phase 040 (`040-hard-rules-sidecar`), which is Complete and moved the sidecars this phase's READMEs describe as current state.
- The eleven code folders of section 3, each present in this tree on 2026-09-30, six under `.skilled/skills/cli-classifier/`, three under `.skilled/skills/system-spec-kit/runtime/scripts/` and two under `.skilled/skills/sk-doc/`, and none carrying a `README.md`.
- `.skilled/skills/sk-doc/sk-create-readme/` for the code-folder README canon, and `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md` for the section 2 contract.
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs`, `.skilled/skills/sk-doc/scripts/validate_skill_package.py` and `.skilled/skills/sk-doc/scripts/validate_document.py` as the phase's own gates.
- The compiled front door at `.skilled/bin/compiled-route.cjs` and the hub's committed `leaf-manifest.json` with its eight leaves.
- Build roles (parent D5): DeepSeek V4.1 Flash on `cli-pi` writes, a cross-family reviewer on `cli-devin` or `cli-codex` reviews, no Claude leaf and no other writer.
- No install is needed. Every command in the proof plan runs from the repository root.

**Deliverables**:
- Eleven code-folder `README.md` files, one per folder of section 3, each written per `sk-create-readme`'s code-folder template and naming its own topology, contents, boundaries and validation command.
- `ROUTER.md` promoted to `router_state: active` with the seven intents `JEV_JUDGMENT`, `JEV_QUESTION`, `JEV_PROVIDER`, `JEV_MCP`, `DEEM_JUDGMENT`, `DEEM_PROVENANCE` and `DEEM_LIFECYCLE`, whose leaves are the committed `leaf-manifest.json` entries.
- Both mode `SKILL.md` section 2s reshaped to the template: the detection, domain and loading material, and one authoritative Smart Router Pseudocode block whose functions include `_guard_in_skill()`, `discover_markdown_resources()`, `classify_intents()`, `load_if_available()` and `UNKNOWN_FALLBACK_CHECKLIST`. `cli-jev`'s transport mechanics move to section 3.
- The vocabulary class renamed `cli-jev-aliases`, the self-referential folder sentence removed from current-state docs, and thirteen targeted phrases added to `jev-dispatch` and `deem-dispatch` with no bare backend word.
- The three pre-release version bumps with their changelog entries: hub `0.5.0.0` to `0.6.0.0`, `cli-jev` `0.1.3.0` to `0.1.4.0`, `cli-deem` `0.1.0.0` to `0.1.1.0`.
- The two refreshed compiled-route activation manifests and the Hermes mirror, regenerated by their own tools.
- The ten-prompt compiled-route probe comparing the baseline against the final state, recorded under `scratch/`, and every gate result recorded in `implementation-summary.md` and `goal.md`'s log.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Eleven code folders this packet created or filled carry no `README.md`: `cli-classifier` `shared/scripts`, `shared/scripts/tests`, `cli-deem/scripts`, `cli-deem/scripts/tests`, `benchmark/pi-transport/tests` and `benchmark/injection-screen/tests`; system-spec-kit `runtime/scripts/compaction-recall`, `runtime/scripts/completion-claim-audit` and `runtime/scripts/debug-next-check`; and sk-doc `sk-create-goal/scripts/tests` and `sk-create-with-human-voice/scripts/tests`. A folder with scripts and no README makes a reader open each file to learn what the folder owns, what it must not touch and how to run its tests. Four other README-less folders predate this packet: `.skilled/hooks/dispatch/lib`, `.skilled/hooks/goal/bin`, `.skilled/hooks/goal/lib` and `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib`. They stay out of scope.

The `cli-classifier` hub routes correctly today, and three canon gaps remain against the style the rest of the fleet already follows. First, the hub's root `ROUTER.md` is the only one of the seven hubs still declaring `router_state: stage1-only`, even though both modes carry concrete leaf maps and the hub's `leaf-manifest.json` already inventories eight leaves. Second, section 2 of `cli-jev/SKILL.md` and `cli-deem/SKILL.md` routes by a request-to-file lookup table where `skill-md-template.md` requires one Smart Router Pseudocode block carrying `_guard_in_skill()`, `discover_markdown_resources()`, `classify_intents()`, `load_if_available()` and `UNKNOWN_FALLBACK_CHECKLIST`, and `cli-jev`'s section 2 also carries transport mechanics that belong in section 3. Third, the `cli-usage` rename left the vocabulary class `cli-usage-aliases` and a sentence saying mode `cli-jev` runs over a folder named after itself.

Two clear asks deferred at baseline because their wording was missing from the stage-one vocabulary: "which provider and model id does jev use" and "roll deem back to the previous commit". The routing decisions themselves are already right, so the fix is vocabulary, not policy: thirteen targeted phrases join the `jev-dispatch` and `deem-dispatch` classes, with no bare backend word added.

### Purpose

Give every code folder this packet created or filled the README its canon requires, and close the three canon gaps between the `cli-classifier` hub and the sk-doc skill template without moving any route the hub already gets right.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Part A, the eleven code-folder READMEs of the table below, each written per `sk-create-readme`'s code-folder template with topology, contents, boundaries and a validation command that runs from the repository root.
- Part B, `ROUTER.md` promoted to `router_state: active` with seven intents whose leaves come from `leaf-manifest.json`, and the hub `SKILL.md` carrying the matching surface-router note.
- Part B, both mode `SKILL.md` section 2s reshaped to the template's subsections and one Smart Router Pseudocode block, with `cli-jev`'s transport mechanics moved to section 3.
- Part B, the rename cleanup: class `cli-jev-aliases`, no current-state sentence that says a mode runs over a folder named after itself, and the thirteen targeted phrases in the two dispatch classes.
- Part B, the three pre-release version bumps with one changelog entry each, and the routing-artifact parity that `parent-skill-check.cjs` rules 13a and 13b check.
- Part B, the compiled-route manifest and Hermes mirror refreshed through their own tools.
- The probe: the ten-prompt compiled-route comparison against the baseline, recorded under `scratch/build/`, plus the phase's own record.

### Out of Scope

- The four README-less folders that predate this packet: `.skilled/hooks/dispatch/lib`, `.skilled/hooks/goal/bin`, `.skilled/hooks/goal/lib` and `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib` (D3).
- Any change to a compiled-route decision that was correct at baseline (D2): a Jev ask to `cli-jev`, a Deem ask to `cli-deem`, the old name `cli-usage` to `cli-jev`, both alias phrases to an ordered bundle, and an off-topic ask to a defer.
- A bare backend word as a vocabulary entry, and any new router policy, weight, tie-break order or outcome.
- Any code file. This phase writes READMEs, skill docs, registries and generated manifests, so no code comment can carry an ephemeral label.
- Any rule's meaning, id, check or severity, and any dependency. The phase adds no package and opens no credential.
- Files outside the two parts and this phase's own record.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-classifier/shared/scripts/README.md` | Create | Code-folder README for the shared Jev transport |
| `.skilled/skills/cli-classifier/shared/scripts/tests/README.md` | Create | Code-folder README for the Jev transport suites |
| `.skilled/skills/cli-classifier/cli-deem/scripts/README.md` | Create | Code-folder README for the Deem client |
| `.skilled/skills/cli-classifier/cli-deem/scripts/tests/README.md` | Create | Code-folder README for the Deem client suites |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/tests/README.md` | Create | Code-folder README for the Pi transport scorer suites |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/tests/README.md` | Create | Code-folder README for the injection screen scorer suites |
| `.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/README.md` | Create | Code-folder README for the compaction-recall harness |
| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/README.md` | Create | Code-folder README for the completion-claim audit |
| `.skilled/skills/system-spec-kit/runtime/scripts/debug-next-check/README.md` | Create | Code-folder README for the debug next check scorer |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/README.md` | Create | Code-folder README for the create-goal suites |
| `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/README.md` | Create | Code-folder README for the human-voice suites |
| `.skilled/skills/cli-classifier/ROUTER.md` | Modify | Promoted to `router_state: active` with the seven intents, leaves from `leaf-manifest.json`, section 2 rewritten as one bullet per intent, version `0.6.0.0` |
| `.skilled/skills/cli-classifier/SKILL.md` | Modify | The surface-router note, the layout and companion lines, and version `0.6.0.0` |
| `.skilled/skills/cli-classifier/hub-router.json` | Modify | Class renamed `cli-jev-aliases`, thirteen backend-qualified phrases added, version `0.6.0.0` |
| `.skilled/skills/cli-classifier/mode-registry.json` | Modify | Version `0.6.0.0` |
| `.skilled/skills/cli-classifier/description.json` | Modify | Version `0.6.0.0` with its timestamp refreshed |
| `.skilled/skills/cli-classifier/README.md` | Modify | Changelog table gains the `v0.6.0.0` row and the pre-merge-release sentence is corrected |
| `.skilled/skills/cli-classifier/cli-jev/SKILL.md` | Modify | Section 2 reshaped, transport mechanics moved to section 3, hub note updated, version `0.1.4.0` |
| `.skilled/skills/cli-classifier/cli-deem/SKILL.md` | Modify | Section 2 reshaped to the template block, hub note corrected to the two transport modes, version `0.1.1.0` |
| `.skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md` | Modify | The self-referential folder sentence removed from the overview |
| `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/judgment-request-routes-to-transport.md` | Modify | The renamed class in the prose and gold `expected_leaf_resources` |
| `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/alias-still-resolves.md` | Modify | Gold `expected_leaf_resources` added |
| `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/jev-request-stays-with-cli-jev.md` | Modify | Gold `expected_leaf_resources` added |
| `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/deem-request-routes-to-transport.md` | Modify | Gold `expected_leaf_resources` added |
| `.skilled/skills/cli-classifier/changelog/v0.6.0.0.md` | Create | The hub release entry |
| `.skilled/skills/cli-classifier/cli-jev/changelog/v0.1.4.0.md` | Create | The Jev transport release entry |
| `.skilled/skills/cli-classifier/cli-deem/changelog/v0.1.1.0.md` | Create | The Deem transport release entry |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-classifier/manifest.json` | Regenerate | Refresh the compiled-route activation manifest through its own tool, never hand-edited |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/cli-classifier/manifest.json` | Regenerate | The second compiled-route activation root, refreshed the same way |
| `.hermes/skills/cli-classifier/SKILL.md`, `.hermes/skills/cli-jev/SKILL.md`, `.hermes/skills/cli-deem/SKILL.md` | Regenerate | Refresh the Hermes mirror through `sync-skills-hermes.cjs`, never hand-edited |
| This phase folder's six docs (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md`), plus `description.json` and `graph-metadata.json` through `repair-derived.cjs` | Modify | The phase record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | **Every one of the eleven folders gets a code-folder README.** Each of the folders of section 3 holds a `README.md` written per `sk-create-readme`'s code-folder template, and `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on each. Each README names its folder's topology, contents, boundaries and the exact test command its validation section documents, and that command passes from the repository root |
| REQ-002 | **The out-of-scope folders stay untouched.** `.skilled/hooks/dispatch/lib`, `.skilled/hooks/goal/bin`, `.skilled/hooks/goal/lib` and `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib` gain no README and no other edit, because they predate this packet (D3) |
| REQ-003 | **`ROUTER.md` is active.** The hub root's `ROUTER.md` declares `router_state: active` and maps the seven intents `JEV_JUDGMENT`, `JEV_QUESTION`, `JEV_PROVIDER`, `JEV_MCP`, `DEEM_JUDGMENT`, `DEEM_PROVENANCE` and `DEEM_LIFECYCLE` to leaves that come from the committed `leaf-manifest.json`. `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` prints `all hard invariants passed, 0 warnings`, and its 12a router contract passes on the active state |
| REQ-004 | **Both mode section 2s carry the template contract.** `cli-jev/SKILL.md` and `cli-deem/SKILL.md` section 2 each carry the template's subsections and one authoritative Smart Router Pseudocode block whose functions include `_guard_in_skill()`, `discover_markdown_resources()`, `classify_intents()`, `load_if_available()` and `UNKNOWN_FALLBACK_CHECKLIST`. `cli-jev`'s transport mechanics move to section 3, so section 2 holds routing only. `python3 .skilled/skills/sk-doc/scripts/validate_skill_package.py` passes on the hub and both modes |
| REQ-005 | **The rename leftovers go.** No `cli-usage-aliases` remains under the hub: the class is `cli-jev-aliases`, and every current-state document that named the old class is repointed. No current-state document keeps a sentence saying mode `cli-jev` runs over a folder named after itself. Dated changelog entries are history and stay |
| REQ-006 | **The routing decisions do not change.** The ten-prompt compiled-route probe matches the baseline on its eight correct rows, prompt for prompt, and routes the two former misses to their mode: "which provider and model id does jev use" to `cli-jev`, "roll deem back to the previous commit" to `cli-deem`. Thirteen targeted phrases join the `jev-dispatch` and `deem-dispatch` classes so both route, and no bare backend word is added. No policy, weight, tie-break order or outcome changes (D2) |
| REQ-007 | **Versions and changelogs agree.** The hub's five routing artifacts (`SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json`, `mode-registry.json`) carry `0.6.0.0` and the newest hub changelog entry is `v0.6.0.0`, the Jev transport moves `0.1.3.0` to `0.1.4.0` with its entry, and the Deem transport moves `0.1.0.0` to `0.1.1.0` with its entry. `parent-skill-check.cjs` rules 13a and 13b pass with no soft finding |
| REQ-008 | **Generated artifacts are regenerated, never hand-edited.** The compiled-route manifest is refreshed through the compiled-routing tooling and `node .skilled/bin/compiled-route-guard.cjs` reports the hub fresh, and the Hermes mirror is refreshed through `sync-skills-hermes.cjs` with `--check` passing |
| REQ-009 | **Nothing else changes, and no code is edited.** No rule's meaning, id, check or severity changes, no dependency is added, no `.env`, key or network call enters the work, and the phase writes READMEs, skill docs, registries and generated manifests only. No code comment can therefore carry an ephemeral label, and the diff of every code tree is empty |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | **The baseline and the README commands are recorded before the first routing write.** The ten-prompt probe's before decisions sit in `scratch/build/probe-before.txt`, taken before the hub routing artifacts were written, and the eleven documented test commands ran from the repository root. The session kept no separate design note: section 10's questions were settled in the phase docs and the build record rather than in a note under `scratch/`, and this closure pass states that plainly |
| REQ-011 | **Executors follow parent D5, cross-family review.** DeepSeek V4.1 Flash on `cli-pi` writes the READMEs, the `ROUTER.md` promotion, both mode section 2s and the registry and changelog edits. A cross-family reviewer on `cli-devin` or `cli-codex` reviews read-only, and the writer reviews any reviewer fix. No Claude leaf writes or reviews. P0 and P1 findings are fixed and rechecked, P2 findings are recorded |
| REQ-012 | **The probe and every gate result are recorded from the final state.** The ten-prompt probe's before and after decisions, the eleven `validate_document.py` results, the eleven test commands' results, `parent-skill-check.cjs`, `validate_skill_package.py` on all three packages, the compiled-route guard, the Hermes check and `validate.sh --strict` are recorded under `scratch/build/` and named in `implementation-summary.md` and `goal.md`'s log |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Eleven code-folder READMEs exist, each VALID under `validate_document.py`, each documenting a test command that passes from the repository root, and the four out-of-scope folders are untouched.
- **SC-002**: `ROUTER.md` is active over the seven intents with leaves from `leaf-manifest.json`, and `parent-skill-check.cjs` passes with 0 warnings.
- **SC-003**: Both mode section 2s carry the template subsections and one pseudocode block with the five named functions, `cli-jev`'s transport mechanics sit in section 3, and `validate_skill_package.py` passes on the hub and both modes.
- **SC-004**: No `cli-usage-aliases` remains under the hub, and the ten-prompt probe matches the baseline on its eight correct rows while the two former misses route to `cli-jev` and `cli-deem`.
- **SC-005**: The three version lines agree with their newest changelog entries, the generated manifest and Hermes mirror are fresh, and `validate.sh --strict` prints `RESULT: PASSED` for this phase and the parent.

### Proof Plan

Written before the build. `R` is one of the eleven code-folder READMEs, `H` the hub at `.skilled/skills/cli-classifier`, `P` the ten-prompt probe corpus under `scratch/`, and `F` the compiler's front door at `.skilled/bin/compiled-route.cjs`.

1. Doc gate per README. For each `R`, `python3 .skilled/skills/sk-doc/scripts/validate_document.py R` and then the test command `R`'s validation section documents, both from the repository root. Check: one row per folder reading VALID and the test command's pass and fail counts with 0 failed. Boundary: a README whose documented command cannot run in this environment fails its row rather than being silently skipped, and a folder that gains a second README outside the eleven fails the scope row.
2. Hub contract. `node .skilled/commands/doctor/scripts/parent-skill-check.cjs H` and `python3 .skilled/skills/sk-doc/scripts/validate_skill_package.py` on `H`, `H/cli-jev` and `H/cli-deem`. Check: `all hard invariants passed, 0 warnings` and three PASS blocks. Boundary: the compiled-routing readiness row inside the package check needs the refreshed manifest in the same change, so a hand-edited or stale manifest fails the row even when the routing artifacts pass.
3. Section 2 conformance. Read both mode `SKILL.md` section 2s and count the five function names. Check: each name appears in one pseudocode block per mode, and no request-to-file lookup table remains as the routing contract. Boundary: a second pseudocode block, or a block split across two fences, fails the "one authoritative block" clause, and `cli-jev`'s transport text still in section 2 fails the move clause.
4. Probe replay. `P`'s ten prompts run one at a time through `F --hub cli-classifier --prompt "<p>"` from the pre-change state and from the final state. Check: the eight rows that were correct at baseline print the same `workflowMode` and `packetId` before and after, and the two former misses print a single target whose mode is `cli-jev` and `cli-deem` respectively. Boundary: an off-topic or bare-backend row that moves off its baseline decision fails the row, which is what the no-bare-backend-word rule protects.
5. Rename and release parity. `rg -n 'cli-usage-aliases' H` prints nothing, the current-state sentence sweep is reviewed row by row, `parent-skill-check.cjs` prints its 13a and 13b passes, `node .skilled/bin/compiled-route-guard.cjs` reports the hub fresh, `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` passes, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this phase folder> --strict` prints `RESULT: PASSED`.

**Kill criterion.** A probe row that moves off a baseline-correct decision closes nothing, and neither does an active `ROUTER.md` whose mapped leaves do not resolve. A green doc gate without the eleven test commands never substitutes for REQ-001.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.skilled/skills/sk-doc/sk-create-readme/` and the skill template | The README shape and the section 2 contract have no source | Both are read before the first write, and the template's own validator gates each doc |
| Dependency | The eleven folders and their suites | A README documents a command that does not run | Each README's test command is executed in proof plan 1, not assumed from its file list |
| Dependency | The compiled-routing tooling and the Hermes sync | A changed hub artifact goes stale | Both regenerate through their own tools, and both gates run from the final state (REQ-008) |
| Risk | A vocabulary phrase that also moves an off-topic row | A probe row changes decision, which D2 forbids | The thirteen phrases are backend-qualified words, no bare backend word joins a class, and the ten-prompt probe compares row for row |
| Risk | The active `ROUTER.md` names a leaf that is not in `leaf-manifest.json` | `parent-skill-check` 12a fails and the hub stops passing | The leaves are read from the committed manifest, never invented, and the check runs before closure |
| Risk | A mode section 2 keeps two pseudocode blocks after the reshape | The template's "one authoritative block" clause fails | Proof plan 3 counts the blocks per mode, and the reviewer reads both sections |
| Risk | A stale reference to `cli-usage-aliases` survives in a scenario or playbook file | The rename gate fails, or a scenario documents a class that no longer exists | `rg -n 'cli-usage-aliases'` is the gate and the reviewer sweeps the playbook's current-state files |
| Risk | A version bump lands without its changelog entry | `parent-skill-check` 13b soft-fails, and the hub claims a release behind it | The three changelog entries land with the three bumps in the same change |
| Risk | A signature or reserved word in a README breaks `validate_document.py` | A row fails for formatting rather than content | The validator is run per file, and `sk-create-readme`'s own template fixes the shape first |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime path changes. The phase edits documentation, skill docs, registries and generated manifests, so no request, hook or router call gains a read, a parse or a process. The probe runs ten front-door calls, and every other check is a one-shot validator.
- **NFR-P02**: Each README's documented test command runs within the suite's own budget from a cold start, and no README documents a command that starts a server, opens a socket or reaches the network.

### Security
- **NFR-S01**: No credential, key, token or `.env` file is read, written or printed. The phase touches no loopback service: the local Deem server at `127.0.0.1:8300` is never called, and no `jev` call is made.
- **NFR-S02**: No new input surface is admitted. The vocabulary additions are repo-local authored strings, the manifest stays generated, and the probe feeds only fixed prompts.

### Reliability
- **NFR-R01**: The eight baseline-correct routing decisions are stable by construction: the added phrases are disjoint from the rows that already route, and proof plan 4 compares every row against its baseline.
- **NFR-R02**: The generated artifacts are reproducible. Re-running the manifest tooling and the Hermes sync from the final state yields the same bytes, which the guard and `--check` gates read.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A folder holds more than one suite file: the README's validation section names the narrowest command that runs the folder's own suite, and the build records the exact command under `scratch/`.
- A README's documented command needs a local socket or a spawned runtime: the row records the blocker rather than documenting a command that cannot run, and the build prefers the suite's offline mode when one exists.
- A vocabulary phrase matches two classes at once: the compiled probe decides, and a row that moves off its baseline decision is a kill, not a tolerable tie.
- A leaf named in `ROUTER.md` has no committed manifest entry: the row fails and the leaf is removed rather than the manifest being hand-extended.

### Error Scenarios
- `validate_document.py` reports an issue on a README: the README is fixed against `sk-create-readme`'s template, never by loosening the validator.
- The package validator reports stale compiled routing after the version bump: the manifest is refreshed through the compiled-routing tooling in the same change (REQ-008).
- A current-state document still says `cli-usage`: the grep gate names it, and the file is repointed in the same change; a dated changelog entry is left as history.
- The probe corpus is run against a tree where the hub files are mid-edit: the before rows are pinned to the baseline recording under `scratch/`, so a partial tree cannot pass a row by accident.

### State Transitions
- During the `ROUTER.md` promotion, the file is active while a mapped leaf does not resolve: `parent-skill-check` 12a fails, which is why the promotion and the leaf check land in one change.
- During the class rename, `hub-router.json` and the playbook name different classes: the compiled guard reports the hub stale until the manifest is re-minted, and the grep gate keeps the window inside one change.
- An interrupted build leaves either a folder with its README or a folder without one; no README is left half-written, because each is a whole file per folder.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Eleven READMEs, the hub's routing artifacts, both mode section 2s, three changelogs and two generated mirrors |
| Risk | 8/25 | The routing decisions are frozen, and the gates are all repo-local read-only checks; the main risk is a phrase that moves a correct row |
| Research | 5/20 | The design reads the manifest, the template, the two mode section 2s and the probe corpus before the first write |
| **Total** | **31/70** | **Level 2**, as every build phase of this packet is |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- **Which ten prompts form the probe?** Proposed: the eight rows that were correct at baseline, replayed unchanged, plus the two former misses. The design records the exact ten prompts under `scratch/` before the build, and every row pins its expected `workflowMode` and `packetId`. UNKNOWN until the design writes the corpus from the baseline recording.
- **Which test command does each README document?** Proposed: the narrowest command that runs the folder's own suite from the repository root, recorded per folder. A folder with a single test file names that file; a folder with several names the folder. UNKNOWN until each suite is listed and run once.
- **Does the hub `README.md` join the release-parity set?** Observed: `parent-skill-check.cjs` 13a compares `SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json`, and the README is not among them. Proposed: the five artifacts move to `0.6.0.0` and the README is left unless the build's doc pass elects to refresh it, which the design records.
- **Are the thirteen phrases additive only?** Proposed: they join `jev-dispatch` and `deem-dispatch`, and no existing phrase, weight or class entry is removed, so the eight correct rows cannot move. UNKNOWN until the probe replay confirms it.
- **What happens to the historical `cli-usage` references?** Proposed: dated changelog entries and the retired-name note stay as history, and only current-state documents move. The rename gate greps the class name and sweeps the current-state sentence separately.
<!-- /ANCHOR:questions -->

---
