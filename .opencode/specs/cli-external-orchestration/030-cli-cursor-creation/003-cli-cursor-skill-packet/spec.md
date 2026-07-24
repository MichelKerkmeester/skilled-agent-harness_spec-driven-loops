---
title: "Feature Specification: cli-cursor skill packet"
description: "Build cli-cursor as a genuinely new 4th mode inside the existing, already-conformant cli-external-orchestration hub, mirroring the cli-codex/cli-devin skill-packet precedent with zero regressions to the hub's 0-fail conformance baseline, grounded in phase 001's live cursor-agent contract."
trigger_phrases: ["cli-cursor skill packet", "cli-cursor mode", "cli-external-orchestration 4th mode", "delegate to cursor"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/003-cli-cursor-skill-packet"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored spec.md for the planned cli-cursor skill-packet phase"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, decision-record.md"
    blockers: ["Phase 002 (deep-loop-executor-support) must land and pass validate.sh --strict before this phase's implementation starts"]
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Exact env-var Cursor sets for an active session (a CURSOR_* var vs. none) is unconfirmed pending a live self-invocation-guard test.", "Whether a dispatched cursor-agent inheriting the operator's shared ~/.cursor/ config (hooks/mcp/rules) needs an explicit --workspace/config isolation flag in the dispatch command.", "Whether the bare alias cli-cursor could collide with an identically-named alias in a skill outside this hub."]
    answered_questions: ["The 14-step build checklist and the gates that fire on adding a 4th mode were confirmed against sk-doc/create-skill and a live 0-fail parent-skill-check.cjs baseline against the hub; the hub currently has exactly 3 modes (cli-opencode/cli-claude-code/cli-codex)."]
---
# Feature Specification: cli-cursor skill packet

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Cursor CLI has never existed as a mode inside `cli-external-orchestration` (or anywhere in this repo). This phase builds `cli-cursor` as a genuinely new 4th mode inside the existing, already-conformant hub, following the exact shape `cli-codex` used when it was added in `027-cli-codex-revival/003-cli-codex-skill-packet` and `cli-devin` mirrors in `029/003`.

**Key Decisions**: `cli-cursor` classifies as `packetKind: "workflow"` (not surface, not transport, despite Cursor's `-w` worktree and cloud `worker` surfaces); its self-invocation guard is built from confirmed signals only, explicitly documented as best-effort; its `prompt-quality-card.md` is a thin delegator to the canonical `sk-prompt/prompt-models` card from day one.

**Critical Dependencies**: Phase 002 (deep-loop-executor-support) must land before this phase's implementation begins.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | `../002-deep-loop-executor-support/spec.md` |
| **Successor** | `../004-cursor-hook-adapter-layer/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Cursor CLI (`cursor-agent`) has no presence in this repo — no standalone skill, no hub mode, no archived packet. The hub today has exactly 3 modes (`cli-opencode`/`cli-claude-code`/`cli-codex`, confirmed live in `mode-registry.json`). Adding `cli-cursor` means adding a 4th mode to an already-conformant, zero-extension registry. The only real precedents for that operation inside this hub are `cli-codex`'s addition (`027/003`) and `cli-devin`'s planned mirror (`029/003`). Cursor differs from both in ways this packet must document faithfully rather than by copy-paste: its config surface is **shared with the Cursor editor** (`.cursor/`/`~/.cursor/`: mcp.json, hooks.json, rules, skills, plugins), not a tool-private namespace; and it carries genuinely unique surfaces (native git worktree `-w`, cloud `worker`, `plugin marketplace`) that no sibling has.

### Purpose
Build `cli-cursor` as a new packet under `cli-external-orchestration/cli-cursor/`, wire it into `mode-registry.json` and `hub-router.json`, update the hub's own `description.json`/`SKILL.md`/`graph-metadata.json`, and regenerate `leaf-manifest.json` — all while keeping `parent-skill-check.cjs` and `validate_skill_package.py` at the same 0-fail/0-warning baseline confirmed against the hub today, and without introducing a second advisor identity anywhere under the new packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `cli-external-orchestration/cli-cursor/` with `SKILL.md`, `README.md`, `changelog/` (hard-required), plus `references/`, `assets/`, `manual-testing-playbook/` (family-parity — all 3 siblings carry these; the playbook directory is scaffolded here, its Cursor-native scenario content is authored in phase 006).
- Author `SKILL.md` from the packet-level `skill-md-template.md`, with a `hard_rules` frontmatter triad (`cursor-availability-required` / `self-invocation-prohibited` / `deep-loop-runtime-required`, mirroring `cli-codex`'s triad), a Section 2 self-invocation guard function, and a `command -v cursor-agent` prerequisite probe (the canonical binary, not the `agent` alias).
- Author `README.md` from `skill-readme-template.md` (9-section AT A GLANCE → RELATED DOCUMENTS shape).
- Author `references/cli-reference.md`, `integration-patterns.md`, `agent-delegation.md`, `cursor-tools.md`, `hook-contract.md`, `shared-editor-config.md` — kebab-case, ≥100 LOC each. `shared-editor-config.md` and the worktree/`worker` coverage inside `cursor-tools.md` are the Cursor-unique reference content with no sibling analog.
- Author `assets/prompt-quality-card.md` (thin delegator to the canonical `sk-prompt/prompt-models` card at `.opencode/skills/sk-prompt/prompt-models/assets/cli-prompt-quality-card.md`) and `assets/prompt-templates.md`.
- Wire `mode-registry.json` (add the `cli-cursor` `modes[]` entry) and `hub-router.json` (add `routerSignals.cli-cursor` weight 4, a vocabulary-class pair, and append `"cli-cursor"` to `routerPolicy.tieBreak`).
- Update the hub's own `description.json` (keywords/trigger_examples/prose only), `SKILL.md` (mode-table row + layout-tree row), and `graph-metadata.json` (derived arrays), symmetric with the 3 existing entries.
- Regenerate `leaf-manifest.json` via `generate-leaf-manifest.cjs --write`.
- Validate: `parent-skill-check.cjs` and `validate_skill_package.py` both stay at 0 fails against the whole hub.

### Out of Scope
- Any `executor-delegation.ts` code change — it reads `mode-registry.json`'s `packetKind === "workflow"` entries dynamically at call time and builds its alias table from `packetSkillName` + `aliases` at runtime, so wiring the registry (this phase) is sufficient for "delegate to cursor" to resolve automatically.
- `cli-cursor/graph-metadata.json` or `cli-cursor/description.json` anywhere under the new packet — `parent-skill-check.cjs` checks 2a/2b scan the whole hub tree and fail hard on a nested one. The hub keeps exactly one of each, at its root.
- Any deep-loop executor-kind, dispatch-command-builder, or runtime-audit-map work — that is phase 002.
- Cursor hook adapter authoring (`.cursor/hooks.json` adapters) — that is phase 004 (cursor-hook-adapter-layer).
- Model registry / routing rows (Composer profile, `cli-cursor` executor rows on model profiles, CI gate arrays) — that is phase 005.
- Manual-testing-playbook scenario *content* — this phase only scaffolds the directory; the Cursor-native scenarios are authored in phase 006.
- Wiring Cursor's `-w`/`--worktree` or `worker` into any repo runtime — these are documented as Cursor-side capabilities/escape hatches in `cursor-tools.md`, not new repo wiring.

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `cli-external-orchestration/cli-cursor/SKILL.md` | Create | Packet skill definition: frontmatter, hard_rules triad, self-invocation guard, `command -v cursor-agent` probe, routing. |
| `cli-external-orchestration/cli-cursor/README.md` | Create | 9-section AT A GLANCE → RELATED DOCUMENTS overview. |
| `cli-external-orchestration/cli-cursor/changelog/` | Create | Version-history directory (hard-required by check 3d-files). |
| `cli-external-orchestration/cli-cursor/references/cli-reference.md` | Create | `cursor-agent` invocation/flags/subcommands reference. |
| `cli-external-orchestration/cli-cursor/references/integration-patterns.md` | Create | Cross-AI integration patterns. |
| `cli-external-orchestration/cli-cursor/references/agent-delegation.md` | Create | Cursor subagent/mode (plan/ask/agent) delegation contract. |
| `cli-external-orchestration/cli-cursor/references/cursor-tools.md` | Create | Cursor-unique surface: approval/sandbox flags, native worktree (`-w`), cloud `worker`, plugins, MCP. |
| `cli-external-orchestration/cli-cursor/references/hook-contract.md` | Create | Cursor's shared hooks.json contract (events, schema, discovery, envelope). |
| `cli-external-orchestration/cli-cursor/references/shared-editor-config.md` | Create | The shared `.cursor/`/`~/.cursor/` editor-config surface and its dispatch-isolation implications. |
| `cli-external-orchestration/cli-cursor/assets/prompt-quality-card.md` | Create | Thin delegator to `sk-prompt/prompt-models`, dispatch-mechanics addenda only. |
| `cli-external-orchestration/cli-cursor/assets/prompt-templates.md` | Create | Cursor-dispatch prompt templates. |
| `cli-external-orchestration/cli-cursor/manual-testing-playbook/` | Create | Scaffold directory; content lands in phase 006. |
| `cli-external-orchestration/mode-registry.json` | Modify | Add the `cli-cursor` `modes[]` entry. |
| `cli-external-orchestration/hub-router.json` | Modify | Add `routerSignals.cli-cursor`, vocabulary classes, extend `tieBreak`. |
| `cli-external-orchestration/description.json` | Modify | Extend `keywords`/`trigger_examples`/prose only. |
| `cli-external-orchestration/SKILL.md` | Modify | Add `cli-cursor` mode-table row + layout-tree row. |
| `cli-external-orchestration/graph-metadata.json` | Modify | Extend `derived.key_files`/`entities`/`trigger_phrases`/`intent_signals`. |
| `cli-external-orchestration/leaf-manifest.json` | Regenerate | Via `generate-leaf-manifest.cjs --write` (mechanical, not hand-edited). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-001 | Create the `cli-cursor/` packet directory with `SKILL.md`, `README.md`, `changelog/` (hard-required), plus `references/`, `assets/`, `manual-testing-playbook/` (family-parity). | Directory exists; check 3d-files passes. |
| REQ-002 | Never create `cli-cursor/graph-metadata.json` or `cli-cursor/description.json` anywhere under the new packet. | `parent-skill-check.cjs` checks 2a and 2b stay at 0 fails against the whole hub tree. |
| REQ-003 | `SKILL.md` frontmatter `name` equals the folder name (`cli-cursor`) and equals the registry `packetSkillName`; `version` is four-part (`"1.0.0.0"`); `allowed-tools: [Bash, Read, Glob, Grep]`; `description` ≤130 chars with no angle brackets. | Check 3d-name-frontmatter passes. |
| REQ-004 | Wire `mode-registry.json` with a `cli-cursor` `modes[]` entry matching the exact schema below (workflowMode, packetKind, backendKind, toolSurface, packet, packetSkillName, grandfatheredFolderMismatch, command, aliases, advisorRouting). Aliases (`["cursor","cursor cli","delegate to cursor","cursor agent","cli-cursor"]`) must not collide (case-folded) with any existing sibling alias. | Checks 3c, 3d, 3d-canon, 3e all pass; alias-collision check passes. |
| REQ-005 | Wire `hub-router.json`: `routerSignals.cli-cursor` (weight 4, matching the 3 siblings), a `cli-cursor-aliases`/`cursor-dispatch` vocabulary-class pair, `resources: ["cli-cursor/SKILL.md"]`, and append `"cli-cursor"` to `routerPolicy.tieBreak` so it is an exact permutation of the registry's modes. | Checks 5b and 5e pass; `defaultMode` stays `null`. |
| REQ-006 | Regenerate `leaf-manifest.json` via `generate-leaf-manifest.cjs --write` after all packet/reference/asset files exist. | Checks 10a-10d pass; no byte-drift. |
| REQ-007 | Validate `parent-skill-check.cjs` and `validate_skill_package.py` against the whole hub; both must stay at 0 fails/0 warnings (today's confirmed baseline). | Both commands exit clean and are cited as completion evidence. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-008 | Author `references/cli-reference.md`, `integration-patterns.md`, `agent-delegation.md`, `cursor-tools.md`, `hook-contract.md`, `shared-editor-config.md` in kebab-case, ≥100 LOC each, grounded in phase 001's confirmed facts. | 6 files exist, kebab-case, each ≥100 LOC. |
| REQ-009 | Author `assets/prompt-quality-card.md` as a thin delegator stating a precedence rule (sk-prompt framework → model hub profile → this card's Cursor-dispatch-mechanics addenda) up front, not a competing framework taxonomy. Because Cursor has no prior empirical dispatch data in this repo, the card MUST NOT invent per-model defaults — it delegates and adds only confirmed Cursor dispatch mechanics. | Card opens with the precedence rule; no re-derived framework taxonomy and no fabricated per-model defaults present. |
| REQ-010 | Author `assets/prompt-templates.md` with Cursor-dispatch prompt templates. | File exists, referenced from `SKILL.md`/`README.md`. |
| REQ-011 | Mirror family convention beyond the bare template: a `hard_rules` frontmatter triad analogous to `cli-codex`'s (`cursor-availability-required` / `self-invocation-prohibited` / `deep-loop-runtime-required`), a Section 2 self-invocation guard function, and a `command -v cursor-agent` prerequisite probe. | `SKILL.md` contains all three `hard_rules` ids, a guard function, and the probe command. |
| REQ-012 | Update the hub's own `description.json`: extend `keywords[]`/`trigger_examples[]`, extend the prose to mention the 4th mode; do not add `modes`/`backend_kinds` keys (registry-owned). | Check 8b stays at 0 fails; no duplicated registry keys. |
| REQ-013 | Update the hub's own `SKILL.md`: add a `cli-cursor` row to the Section 1 mode table and the Section 3 layout ASCII tree; no `allowed-tools` frontmatter edit needed (already `[Bash, Read, Glob, Grep]`). | Both edits present; hub frontmatter unchanged. |
| REQ-014 | Update the hub's own `graph-metadata.json`: extend `derived.key_files`/`entities`/`trigger_phrases`/`intent_signals`, symmetric with the 3 existing packets. | Arrays extended; doctrine-consistent. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external-orchestration` returns 0 fails, 0 warnings after `cli-cursor` is added.
- **SC-002**: `python3 .opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py .opencode/skills/cli-external-orchestration` returns 0 fails.
- **SC-003**: A prompt like "delegate to cursor" resolves to the `cli-cursor` packet through the executor-delegation scorer with zero code changes to `executor-delegation.ts`.
- **SC-004**: All 4 modes are present in `mode-registry.json`; `hub-router.json`'s `routerPolicy.tieBreak` is an exact 4-element permutation of all 4 registry `workflowMode` values; `defaultMode` stays `null`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Risk | Nested `cli-cursor/graph-metadata.json` or `description.json` accidentally created | High — hub fails checks 2a/2b (second identity) | REQ-002 as an explicit hard rule; validation gate (REQ-007) before any completion claim. |
| Risk | Alias collision (case-folded) with an existing sibling's alias array | Medium — check 3d-alias fails | Cross-check the `cli-cursor` aliases against all 3 sibling alias arrays before wiring. |
| Risk | `mode-registry.json` and `hub-router.json` drift out of sync | Medium — checks 5b/5e fail | Author both files in the same edit pass; validate immediately after. |
| Risk | `leaf-manifest.json` left stale after adding packet files | Medium — checks 10b/10d fail | Mandatory regeneration step (REQ-006) before any validation claim. |
| Risk | `prompt-quality-card.md` invents per-model defaults Cursor has no empirical basis for | Medium — ships fabricated guidance | ADR-003 mandates a thin delegator with confirmed-mechanics-only addenda from day one. |
| Risk | A dispatched `cursor-agent` silently inherits the operator's shared `~/.cursor/` config (hooks/mcp/rules) | Medium — surprising side effects during dispatch | Document in `shared-editor-config.md`; flag the `--workspace`/config-isolation question as an Open Question. |
| Dependency | Phase 002 (deep-loop-executor-support) | Documentation can be authored, but real end-to-end dispatch smoke-testing needs phase 002's `ExecutorKind` support | Sequence this phase's implementation after phase 002 lands. |
| Dependency | `sk-doc/create-skill` packet-level templates | Wrong shape if templates change before authoring | Read templates fresh at implementation time. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: `cli-cursor/SKILL.md` stays family-parity thin — routing, hard_rules, and the self-invocation guard only, no per-mode logic duplicated into the hub's own `SKILL.md`.

### Consistency
- **NFR-C01**: All `references/*.md` filenames use kebab-case (the repo's current filesystem-naming convention post-020-kebab-migration).

### Verification
- **NFR-V01**: Both `parent-skill-check.cjs` and `validate_skill_package.py` must run and report 0 fails before any completion claim.

---

## 8. EDGE CASES

### Availability & Runtime
- `cursor-agent` binary absent from `PATH` at packet-authoring time does not block packet creation — the availability probe (`command -v cursor-agent`) is a runtime concern the guard checks at dispatch time.
- A `-p` dispatch without account auth exits `0` (phase 001) — the guard and the packet's dispatch docs must not treat exit code as an availability/success signal.

### Registry & Tooling
- Running `generate-leaf-manifest.cjs --write` against the wrong path could touch unrelated hub siblings — scope the command explicitly to `.opencode/skills/cli-external-orchestration`.
- A concurrent in-flight session editing `hub-router.json`/`mode-registry.json` — check `git status` for a clean hub tree before starting edits.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 16/25 | ~12 new packet files + 5 hub-root file edits, one hub, no application code. |
| Risk | 15/25 | Breaking an already-conformant, zero-fail hub if the registry/router go out of sync, or if a second advisor identity leaks in. |
| Research | 15/20 | Must mirror the `cli-codex`/`cli-devin` precedent and document Cursor's unique shared-config/worktree/worker surfaces from phase 001, not infer. |
| Multi-Agent | 0/15 | Single-agent authoring phase. |
| Coordination | 5/15 | Sequenced after phase 002. |
| **Total** | **51/100** | **Level 3** — modest LOC but real architectural decisions (packet-kind, guard design, card shape, shared-config isolation) justify the level. |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R-001 | Nested advisor-identity files created under `cli-cursor/` | High | Low | REQ-002 hard rule, doctrine citation, validation gate. |
| R-002 | `mode-registry.json`/`hub-router.json` go out of sync | Medium | Medium | Single coordinated edit pass, immediate validation. |
| R-003 | `prompt-quality-card.md` invents Cursor per-model defaults | Medium | Low | ADR-003 thin-delegator mandate; confirmed-mechanics-only addenda. |
| R-004 | `leaf-manifest.json` left stale post-edit | Medium | Medium | Mandatory regeneration step (REQ-006). |
| R-005 | Dispatched `cursor-agent` inherits operator's shared `~/.cursor/` config unexpectedly | Medium | Medium | `shared-editor-config.md` documents it; config-isolation flagged as Open Question. |

---

## 11. USER STORIES

### US-001: Delegate to Cursor resolves automatically (Priority: P0)

**As a** developer using `cli-external-orchestration`, **I want** "delegate to cursor" to route to the `cli-cursor` packet exactly like the 3 existing executors, **so that** I get Cursor's terminal agent without any new advisor-map code being written.

**Acceptance Criteria**:
1. Given `mode-registry.json` contains the `cli-cursor` entry, When the executor-delegation scorer resolves "delegate to cursor", Then it returns `cli-cursor` as the target packet with zero code changes to `executor-delegation.ts`.

### US-002: Hub conformance holds after a 4th mode (Priority: P0)

**As a** maintainer of `cli-external-orchestration`, **I want** `parent-skill-check.cjs` and `validate_skill_package.py` to both stay at 0 fails after adding `cli-cursor`, **so that** the hub's conformance guarantee holds for all 4 modes.

**Acceptance Criteria**:
1. Given the `cli-cursor` packet and updated hub metadata, When both validators run against the hub, Then both report 0 fails / 0 warnings.

---

## 12. OPEN QUESTIONS

- The exact env-var Cursor sets during an active session (a `CURSOR_*` variable vs. none) is unconfirmed — ADR-002 designs the guard around confirmed signals only and documents this gap rather than fabricating a lock-file convention.
- Whether a dispatched `cursor-agent` should carry an explicit `--workspace`/config-isolation flag so it does not silently inherit the operator's shared `~/.cursor/` hooks/mcp/rules — flagged for a decision when the dispatch command is finalized (interacts with phases 002/004).
- Whether the bare alias `"cli-cursor"` could collide with an identically-named alias in a skill outside this hub — check 3d-alias only covers intra-hub collisions; a repo-wide alias search is recommended at implementation time.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Predecessor**: `../002-deep-loop-executor-support/spec.md`
- **Successor**: `../004-cursor-hook-adapter-layer/spec.md`
- **Structural precedent**: `../../027-cli-codex-revival/003-cli-codex-skill-packet/spec.md`, `../../029-cli-devin-revival/003-cli-devin-skill-packet/spec.md`
- **Hub doctrine**: `.opencode/skills/sk-doc/create-skill/SKILL.md`, `.opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md`
- **Validators**: `.opencode/commands/doctor/scripts/parent-skill-check.cjs`, `.opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py`
