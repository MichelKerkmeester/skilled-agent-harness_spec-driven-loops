---
title: "Feature Specification: cli-devin skill packet"
description: "Build cli-devin as a genuinely new 4th mode inside the existing, already-conformant cli-external-orchestration hub, mirroring the cli-codex revival precedent (027/003) with zero regressions to the hub's 0-fail conformance baseline."
trigger_phrases: ["cli-devin skill packet", "cli-devin mode", "cli-external-orchestration 4th mode"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/003-cli-devin-skill-packet"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored spec.md for the planned cli-devin skill-packet phase"
    next_safe_action: "Author plan.md, tasks.md, checklist.md, and decision-record.md for this phase"
    blockers: ["Phase 002 (deep-loop-executor-support) must land and pass validate.sh --strict before this phase's implementation starts, per the parent packet's Phase Transition Rules"]
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Exact env-var namespace Devin uses for an active-session signal (COGNITION_* vs DEVIN_*) is unconfirmed pending a live self-invocation-guard test", "Whether the bare alias \"cli-devin\" could collide with an identically-named alias in a skill outside this hub (cross-hub collision is not covered by the intra-hub check 3d-alias)", "Whether the hub-root README.md's stale \"defaultMode is cli-opencode\" prose (mode-registry.json actually has defaultMode:null) should be corrected in this phase or left as a separate, out-of-scope fix"]
    answered_questions: ["The exact 14-step build checklist and the additional gates that fire on adding a 4th mode were confirmed by direct research against sk-doc/create-skill's SKILL.md, its parent-skill doctrine, and a live 0-fail/0-warning parent-skill-check.cjs baseline run against the hub today"]
---
# Feature Specification: cli-devin skill packet

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

`cli-devin` never existed as a mode inside `cli-external-orchestration` before its 2026-06-08 deprecation — it was a standalone top-level skill, and the hub itself was created afterward. This phase builds `cli-devin` as a genuinely new 4th mode inside the existing, already-conformant hub, following the exact shape `cli-codex` used when it was added in `027-cli-codex-revival/003-cli-codex-skill-packet`.

**Key Decisions**: `cli-devin` classifies as `packetKind: "workflow"` (not surface, not transport); its self-invocation guard is built from confirmed signals only, explicitly documented as best-effort.

**Critical Dependencies**: Phase 002 (deep-loop-executor-support) must land per the parent packet's Phase Transition Rules before this phase's implementation begins.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-23 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/029-cli-devin-revival` |
| **Predecessor** | `../002-deep-loop-executor-support/spec.md` |
| **Successor** | `../004-devin-hook-adapter-layer/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli-devin` never previously existed as a mode inside `cli-external-orchestration` — before its 2026-06-08 deprecation it was a standalone top-level skill (`.opencode/skills/cli-devin/`), and the hub (with `cli-opencode`/`cli-claude-code`/`cli-codex` as its 3 modes) was created *after* that deprecation. There is no direct precedent inside this hub for "add a 4th mode to an already-conformant, zero-extension registry"; the closest and only real precedent is `cli-codex`'s own addition in `027-cli-codex-revival/003-cli-codex-skill-packet`.

### Purpose
Build `cli-devin` as a new packet under `cli-external-orchestration/cli-devin/`, wire it into `mode-registry.json` and `hub-router.json`, update the hub's own `description.json`/`SKILL.md`/`graph-metadata.json`, and regenerate `leaf-manifest.json` — all while keeping `parent-skill-check.cjs` and `validate_skill_package.py` at the same 0-fail/0-warning baseline confirmed against the hub today, and without introducing a second advisor identity anywhere under the new packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `cli-external-orchestration/cli-devin/` with `SKILL.md`, `README.md`, `changelog/` (hard-required), plus `references/`, `assets/`, `manual-testing-playbook/` (family-parity convention — all 3 siblings carry these; the playbook directory is scaffolded here, its Devin-native scenario content is authored in phase 006).
- Author `SKILL.md` from the packet-level `skill-md-template.md`, with a `hard_rules` frontmatter triad, a Section 2 self-invocation guard function, and a `command -v devin` prerequisite probe, mirroring `cli-codex`'s exact shape.
- Author `README.md` from `skill-readme-template.md` (9-section AT A GLANCE → RELATED DOCUMENTS shape).
- Author `references/cli-reference.md`, `integration-patterns.md`, `agent-delegation.md`, `devin-tools.md`, `cloud-handoff.md` — kebab-case, ≥100 LOC each.
- Author `assets/prompt-quality-card.md` (thin delegator to the canonical `sk-prompt/prompt-models` card) and `assets/prompt-templates.md`.
- Wire `mode-registry.json` (add the `cli-devin` `modes[]` entry) and `hub-router.json` (add `routerSignals.cli-devin`, a vocabulary-class pair, and append to `routerPolicy.tieBreak`).
- Update the hub's own `description.json` (keywords/trigger_examples/prose only), `SKILL.md` (mode table row + layout tree row), and `graph-metadata.json` (derived arrays, for doctrine-consistent symmetry with the 3 existing entries).
- Regenerate `leaf-manifest.json` via `generate-leaf-manifest.cjs --write`.
- Validate: `parent-skill-check.cjs` and `validate_skill_package.py` both stay at 0 fails against the whole hub.

### Out of Scope
- Any `executor-delegation.ts` code change — confirmed unnecessary by direct code research: it reads `mode-registry.json`'s `packetKind === "workflow"` entries dynamically at call time and builds its alias table from `packetSkillName` + `aliases` at runtime, so wiring the registry (this phase) is sufficient for "delegate to devin" to resolve automatically.
- `cli-devin/graph-metadata.json` or `cli-devin/description.json` anywhere under the new packet — `parent-skill-check.cjs` checks 2a/2b scan the whole hub tree and fail hard on a nested one ("re-introduces a second identity" / "second advisor identity"). The hub keeps exactly one of each, at its root.
- Any deep-loop executor-kind, dispatch-command-builder, or runtime-audit-map work — that is phase 002 (deep-loop-executor-support), already scoped separately.
- Hook adapter authoring (`.devin/hooks.v1.json` + adapter scripts) — that is phase 004 (devin-hook-adapter-layer).
- Model registry / quota rows (`swe-1.6`, sibling executor rows, CI gate arrays) — that is phase 005.
- Manual-testing-playbook scenario *content* — this phase only scaffolds the directory; the Devin-native scenarios are authored in phase 006.
- The hub-root `README.md`'s stale "`defaultMode` is `cli-opencode`" prose (the registry's actual `defaultMode` is `null`) — a pre-existing discrepancy this phase did not introduce and is not asked to fix; flagged as Open Question 3 instead of corrected here, to avoid scope creep beyond the 14-step checklist this phase was scoped against.

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `cli-external-orchestration/cli-devin/SKILL.md` | Create | Packet skill definition: frontmatter, hard_rules, self-invocation guard, routing. |
| `cli-external-orchestration/cli-devin/README.md` | Create | 9-section AT A GLANCE → RELATED DOCUMENTS overview. |
| `cli-external-orchestration/cli-devin/changelog/` | Create | Version history directory (hard-required by check 3d-files). |
| `cli-external-orchestration/cli-devin/references/cli-reference.md` | Create | CLI invocation/flags reference. |
| `cli-external-orchestration/cli-devin/references/integration-patterns.md` | Create | Cross-AI integration patterns. |
| `cli-external-orchestration/cli-devin/references/agent-delegation.md` | Create | Subagent delegation contract. |
| `cli-external-orchestration/cli-devin/references/devin-tools.md` | Create | Devin-unique tool surface (Read/Write/Exec/Fetch matchers). |
| `cli-external-orchestration/cli-devin/references/cloud-handoff.md` | Create | `/handoff` cloud-handoff mechanics. |
| `cli-external-orchestration/cli-devin/assets/prompt-quality-card.md` | Create | Thin delegator to `sk-prompt/prompt-models`, dispatch-mechanics addenda only. |
| `cli-external-orchestration/cli-devin/assets/prompt-templates.md` | Create | Devin-dispatch prompt templates. |
| `cli-external-orchestration/cli-devin/manual-testing-playbook/` | Create | Scaffold directory; content lands in phase 006. |
| `cli-external-orchestration/mode-registry.json` | Modify | Add the `cli-devin` `modes[]` entry. |
| `cli-external-orchestration/hub-router.json` | Modify | Add `routerSignals.cli-devin`, vocabulary classes, extend `tieBreak`. |
| `cli-external-orchestration/description.json` | Modify | Extend `keywords`/`trigger_examples`/prose only. |
| `cli-external-orchestration/SKILL.md` | Modify | Add `cli-devin` mode-table row + layout-tree row. |
| `cli-external-orchestration/graph-metadata.json` | Modify | Extend `derived.key_files`/`entities`/`trigger_phrases`/`intent_signals`. |
| `cli-external-orchestration/leaf-manifest.json` | Regenerate | Via `generate-leaf-manifest.cjs --write` (mechanical, not hand-edited). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-001 | Create the `cli-devin/` packet directory with `SKILL.md`, `README.md`, `changelog/` (hard-required), plus `references/`, `assets/`, `manual-testing-playbook/` (family-parity). | Directory exists; check 3d-files passes. |
| REQ-002 | Never create `cli-devin/graph-metadata.json` or `cli-devin/description.json` anywhere under the new packet. | `parent-skill-check.cjs` checks 2a and 2b stay at 0 fails against the whole hub tree. |
| REQ-003 | `SKILL.md` frontmatter `name` equals the folder name (`cli-devin`) and equals the registry `packetSkillName`; `version` is four-part (`"1.0.0.0"`); `allowed-tools: [Bash, Read, Glob, Grep]`. | Check 3d-name-frontmatter passes. |
| REQ-004 | Wire `mode-registry.json` with a `cli-devin` `modes[]` entry matching the exact schema below (workflowMode, packetKind, backendKind, toolSurface, packet, packetSkillName, grandfatheredFolderMismatch, command, aliases, advisorRouting). | Checks 3c, 3d, 3d-canon, 3e all pass. |
| REQ-005 | Wire `hub-router.json`: `routerSignals.cli-devin` (weight 4, matching the 3 siblings), a `cli-devin-aliases`/`devin-dispatch` vocabulary-class pair, `resources: ["cli-devin/SKILL.md"]`, and append `"cli-devin"` to `routerPolicy.tieBreak` so it is an exact 4-element permutation of the registry's modes. | Checks 5b and 5e pass; `defaultMode` stays `null`. |
| REQ-006 | Regenerate `leaf-manifest.json` via `generate-leaf-manifest.cjs --write` after all packet/reference/asset files exist. | Checks 10a-10d pass; no byte-drift. |
| REQ-007 | Validate `parent-skill-check.cjs` and `validate_skill_package.py` against the whole hub; both must stay at 0 fails/0 warnings (today's confirmed baseline). | Both commands exit clean and are cited as completion evidence. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| REQ-008 | Author `references/cli-reference.md`, `integration-patterns.md`, `agent-delegation.md`, `devin-tools.md`, `cloud-handoff.md` in kebab-case, ≥100 LOC each (per the original packet's precedent; cloud handoff via `/handoff` is confirmed real and current per phase 001). | 5 files exist, kebab-case, each ≥100 LOC. |
| REQ-009 | Author `assets/prompt-quality-card.md` as a thin delegator stating a 3-tier precedence rule (sk-prompt framework → model hub profile → this card's dispatch-mechanics addenda) up front, not a competing 7-framework taxonomy re-using STAR/BUILD/ATLAS/CONTEXT for a different concept. | Card opens with the precedence rule; no re-derived framework taxonomy present. |
| REQ-010 | Author `assets/prompt-templates.md` with Devin-dispatch prompt templates. | File exists, referenced from `SKILL.md`/`README.md`. |
| REQ-011 | Mirror family convention beyond the bare template: a `hard_rules` frontmatter block analogous to `cli-codex`'s `codex-availability-required` / `self-invocation-prohibited` / `deep-loop-runtime-required` triad, a Section 2 self-invocation guard function, and a `command -v devin` prerequisite probe. | `SKILL.md` contains all three `hard_rules` ids, a guard function, and the probe command. |
| REQ-012 | Update the hub's own `description.json`: extend `keywords[]` and `trigger_examples[]`, extend the prose to mention the 4th mode; do not add `modes` or `backend_kinds` keys (registry-owned). | Check 8b stays at 0 fails; no duplicated registry keys in `description.json`. |
| REQ-013 | Update the hub's own `SKILL.md`: add a `cli-devin` row to the Section 1 mode table and the Section 3 layout ASCII tree; no `allowed-tools` frontmatter edit needed (already `[Bash, Read, Glob, Grep]`, identical to `cli-devin`'s surface). | Both edits present; hub frontmatter unchanged. |
| REQ-014 | Update the hub's own `graph-metadata.json`: extend `derived.key_files`/`entities`/`trigger_phrases`/`intent_signals` to include the new packet's files/phrases, symmetric with how the 3 existing packets are enumerated. | Arrays extended; not mechanically gated but doctrine-consistent. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external-orchestration` returns 0 fails, 0 warnings after `cli-devin` is added — the same baseline confirmed against the hub before this phase.
- **SC-002**: `python3 .opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py .opencode/skills/cli-external-orchestration` returns 0 fails.
- **SC-003**: A prompt like "delegate to devin" resolves to the `cli-devin` packet through the executor-delegation scorer with zero code changes to `executor-delegation.ts` — confirmed by direct code research (it loads `mode-registry.json` dynamically at call time).
- **SC-004**: All 4 modes are present in `mode-registry.json`; `hub-router.json`'s `routerPolicy.tieBreak` is an exact 4-element permutation of all 4 registry `workflowMode` values; `defaultMode` stays `null`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Risk | Nested `cli-devin/graph-metadata.json` or `description.json` accidentally created | High — hub fails checks 2a/2b (second identity) | REQ-002 as an explicit hard rule; validation gate (REQ-007) before any completion claim. |
| Risk | Alias collision (case-folded) with an existing sibling's alias array | Medium — check 3d-alias fails | Cross-check the `cli-devin` aliases list against all 3 existing sibling alias arrays before wiring (see checklist CHK-023 equivalent). |
| Risk | `mode-registry.json` and `hub-router.json` drift out of sync (signal keys vs. registry `workflowMode` values) | Medium — checks 5b/5e fail | Author both files in the same edit pass; validate immediately after. |
| Risk | `leaf-manifest.json` left stale after adding packet files | Medium — checks 10b (byte-drift) / 10d (reachability) fail | Mandatory regeneration step (REQ-006) before any validation claim. |
| Risk | `prompt-quality-card.md` re-introduces the archived competing-framework-taxonomy bug (the v1.0.7.0-era fix) | Medium — drifts the card into a duplicate, conflicting taxonomy | ADR-003 mandates a thin delegator from day one; REQ-009 states the 3-tier precedence rule explicitly. |
| Dependency | Phase 002 (deep-loop-executor-support) | If not yet landed, the packet can still be authored (the registry is read dynamically at call time), but real end-to-end dispatch smoke-testing needs phase 002's `ExecutorKind` support | Sequence this phase's implementation after phase 002 lands, per the parent packet's Phase Transition Rules; documentation authoring (this phase's actual deliverable) does not itself require phase 002 code. |
| Dependency | `sk-doc/create-skill` packet-level templates (`skill-md-template.md`, `skill-readme-template.md`) | Wrong shape if templates change before authoring | Read templates fresh at implementation time rather than trusting this spec's cached description. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: `cli-devin/SKILL.md` stays family-parity thin — routing, hard_rules, and the self-invocation guard only, no per-mode logic duplicated into the hub's own `SKILL.md`.

### Consistency
- **NFR-C01**: All `references/*.md` filenames use kebab-case (the repo's current filesystem-naming convention post-020-kebab-migration), not the original 2026-05 packet's underscore style (e.g. `cli_reference.md`).

### Verification
- **NFR-V01**: Both `parent-skill-check.cjs` and `validate_skill_package.py` must run and report 0 fails before any completion claim, per the repo's Completion Verification Rule.

---

## 8. EDGE CASES

### Availability & Runtime
- `devin` binary absent from `PATH` at packet-authoring time does not block packet creation — the availability probe (`command -v devin`) is a runtime concern the guard function checks at dispatch time, not a build-time blocker for this phase.
- Devin's session-active env-var namespace is unconfirmed (see Open Questions) — the guard is designed around confirmed signals only and documents that absence is not proof no session is active (ADR-002).

### Registry & Tooling
- Running `generate-leaf-manifest.cjs --write` against the wrong path could touch unrelated hub siblings — mitigated by scoping the command explicitly to `.opencode/skills/cli-external-orchestration` (REQ-006).
- A concurrent in-flight session editing `hub-router.json`/`mode-registry.json` at the same time — check `git status` for a clean tree before starting edits (per the repo's Blast-Radius Management guidance).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 15/25 | ~11 new packet files + 5 hub-root file edits, one hub, no application code. |
| Risk | 15/25 | Breaking an already-conformant, zero-fail hub if the registry/router go out of sync, or if a second advisor identity leaks in. |
| Research | 15/20 | Must mirror the `cli-codex` (027/003) precedent exactly and cite doctrine (`parent-skills-nested-packets.md`) rather than infer shape. |
| Multi-Agent | 0/15 | Single-agent authoring phase. |
| Coordination | 5/15 | Sequenced after phase 002 per Phase Transition Rules, but does not itself require phase 002's code. |
| **Total** | **50/100** | **Level 3** — modest LOC but real architectural decisions (packet-kind classification, guard design, card shape) justify the level per the risk/complexity override. |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| R-001 | Nested advisor-identity files (`graph-metadata.json`/`description.json`) accidentally created under `cli-devin/` | High | Low | REQ-002 hard rule, explicit doctrine citation, validation gate before completion claim. |
| R-002 | `mode-registry.json`/`hub-router.json` go out of sync | Medium | Medium | Single coordinated edit pass, immediate validation. |
| R-003 | `prompt-quality-card.md` re-drifts into a competing framework taxonomy | Medium | Low | ADR-003 thin-delegator mandate, explicit 3-tier precedence statement. |
| R-004 | `leaf-manifest.json` left stale post-edit | Medium | Medium | Mandatory regeneration step (REQ-006) before any validation claim. |

---

## 11. USER STORIES

### US-001: Delegate to Devin resolves automatically (Priority: P0)

**As a** developer using `cli-external-orchestration`, **I want** "delegate to devin" to route to the `cli-devin` packet exactly like the 3 existing executors, **so that** I get Devin's cross-AI second opinion without any new advisor-map code being written.

**Acceptance Criteria**:
1. Given `mode-registry.json` contains the `cli-devin` entry, When the executor-delegation scorer resolves "delegate to devin", Then it returns `cli-devin` as the target packet with zero code changes to `executor-delegation.ts`.

### US-002: Hub conformance holds after a 4th mode (Priority: P0)

**As a** maintainer of `cli-external-orchestration`, **I want** `parent-skill-check.cjs` and `validate_skill_package.py` to both stay at 0 fails after adding `cli-devin`, **so that** the hub's conformance guarantee holds for all 4 modes, not just the original 3.

**Acceptance Criteria**:
1. Given the `cli-devin` packet and updated hub metadata, When both validators run against the hub, Then both report 0 fails / 0 warnings.

---

## 12. OPEN QUESTIONS

- Exact env-var namespace Devin uses for an active-session signal (`COGNITION_*` vs. `DEVIN_*`) is unconfirmed pending a live self-invocation-guard test — ADR-002 designs the guard around confirmed signals only and documents this gap explicitly rather than fabricating a lock-file convention.
- Whether the bare alias `"cli-devin"` could collide with an identically-named alias in a skill outside this hub — check 3d-alias only covers intra-hub collisions; a broader repo-wide alias search is recommended at implementation time.
- Whether the hub-root `README.md`'s stale "`defaultMode` is `cli-opencode`" prose (the registry's actual `defaultMode` is `null`) should be corrected in this phase or tracked as a separate, unrelated fix — flagged here rather than silently touched, since it is outside the 14-step checklist this phase was scoped against.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Predecessor**: `../002-deep-loop-executor-support/spec.md`
- **Successor**: `../004-devin-hook-adapter-layer/spec.md`
- **Structural precedent**: `../../027-cli-codex-revival/003-cli-codex-skill-packet/spec.md`
- **Hub doctrine**: `.opencode/skills/sk-doc/create-skill/SKILL.md`, `.opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md`
- **Validators**: `.opencode/commands/doctor/scripts/parent-skill-check.cjs`, `.opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py`
