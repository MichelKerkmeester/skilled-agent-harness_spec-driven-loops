---
title: "Feature Specification: Phase 9: speckit-command-goal-prompt-offer"
description: "The /speckit:* goal-prompt offer (this phase's whole original purpose) was never implemented: zero goal references exist in any speckit router .md, workflow YAML, or presentation .txt surface; only coincidental 'Goals clear?' scoring-factor text exists at two unrelated line numbers. Build the offer per the handover.md design: consolidated setup prompt offer, a goal_prompt_choice field across the 8 workflow YAML assets, and mk_goal/mk_goal_status added to router allowed-tools."
trigger_phrases:
  - "speckit command goal prompt offer"
  - "goal_prompt_choice workflow field"
  - "phase 009 speckit goal integration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored spec from handover.md design plus audit dossier (INT-1, INT-2, INT-3)"
    next_safe_action: "Author plan/tasks, then start Phase 1 (presentation offer text) after review"
    blockers: []
    key_files:
      - ".opencode/commands/goal_opencode.md"
      - ".opencode/commands/speckit/assets/speckit_plan_presentation.txt"
      - ".opencode/commands/speckit/assets/speckit_complete_presentation.txt"
      - ".opencode/commands/speckit/assets/speckit_implement_presentation.txt"
      - ".opencode/commands/speckit/assets/speckit_resume_presentation.txt"
    session_dedup:
      fingerprint: "sha256:05adb81fb61c6215e2e48aabeac9b059e004099090dce03d59c5bd79488c1f68"
      session_id: "032-remediation-authoring-20260703"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: speckit-command-goal-prompt-offer

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-03 |
| **Branch** | `system-deep-loop/032-goal-opencode-plugin` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 |
| **Predecessor** | None (independent) |
| **Successor** | None |
| **Handoff Criteria** | Every `/speckit:*` consolidated setup prompt offers the goal prompt; `goal_prompt_choice` is a documented field in all 8 workflow YAML assets; `mk_goal`/`mk_goal_status` are in the relevant router `allowed-tools` lines; `mk_goal` is called only on an explicit `set` choice; a contract test pins the offer text, the field, the allowed-tools lines, and the correct live command/tool names |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the goal-plugin packet (`032-goal-opencode-plugin`). It was originally scaffolded by a separate session on 2026-07-01, which authored a detailed pre-implementation `handover.md` (design decisions, file targets, traps) but left `spec.md`/`plan.md`/`tasks.md`/`implementation-summary.md` as unfilled scaffolds. The 2026-07-03 four-reviewer audit (`../scratch/2026-07-03-four-reviewer-audit-findings.md` §E) verified the folder was stale (no live processes, last content edit 2026-07-01 06:50) and confirmed the offer was never built anywhere in the `/speckit:*` surface (finding INT-1). This remediation program takes the phase over as of 2026-07-03; `handover.md` is preserved as historical design input and is NOT edited here (its line 95 stale reference to a nonexistent `.opencode/commands/goal.md` is fixed by phase 015, not this phase — this spec uses the correct live name, `goal_opencode.md`, throughout).

**Scope Boundary**: The `/speckit:plan`, `/speckit:complete`, `/speckit:implement`, and `/speckit:resume` command surfaces only — their presentation contracts (`assets/*_presentation.txt`), their auto/confirm workflow YAML assets, and their router `.md` `allowed-tools` lines. No changes to `mk-goal.js` plugin runtime behavior, no changes to `goal_opencode.md`'s own contract, no other `/speckit:*` commands beyond these four.

**Dependencies**:
- None from other phases in this packet — this phase is independent of 015-021's `mk-goal.js` remediation track (it touches only the speckit command surface, not the plugin).
- Depends on the plugin tools `mk_goal`/`mk_goal_status` already existing and working (`mk-goal.js:1857`, `:1869`) — confirmed live, no plugin changes needed here.

**Deliverables**:
- A shared, optional goal-prompt offer in each of the four presentation contracts' consolidated setup prompts
- A `goal_prompt_choice` field (offer/skip/set semantics) added to all 8 workflow YAML assets (`speckit_plan_auto/confirm.yaml`, `speckit_complete_auto/confirm.yaml`, `speckit_implement_auto/confirm.yaml`, `speckit_resume_auto/confirm.yaml`)
- `mk_goal`/`mk_goal_status` added to the `allowed-tools` line of the routers that need them (`plan.md`, `complete.md`, `implement.md`; `resume.md` read-status only per its narrower existing tool set)
- A contract test pinning the offer text, the YAML field, the allowed-tools lines, and the correct live names (`goal_opencode.md`, `mk_goal`, `mk_goal_status`)

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Finding INT-1 (dossier §E, verbatim): the `/speckit:*` goal-prompt offer — this phase's whole original purpose — is NOT implemented. A repo-wide sweep found zero goal references in any speckit router `.md`, workflow YAML, or presentation `.txt` file; the only hits are coincidental scoring-factor text ("Goals clear?" — a requirements-clarity assessment question, unrelated to the `/goal` plugin) at `speckit_plan_auto.yaml:460` and `speckit_plan_confirm.yaml:490`. The design for the real feature already exists in `handover.md` §2.1 (machine-readable `goal_prompt_choice` field) and §3.2 (presentation-contract offer + allowed-tools), but nothing was built: `spec.md`/`plan.md`/`tasks.md`/`implementation-summary.md` are all still template scaffolds (finding INT-2, `completion_pct: 0`, unresolved `[What is broken…]` placeholders). There is also no test pattern for command-surface contracts — no way to pin presentation text, YAML fields, or allowed-tools lines against drift (finding INT-3), unlike the plugin side which has `mk-goal-export-contract.test.cjs`.

### Purpose
Every `/speckit:*` planning/completion/implementation/resume session proactively offers session-goal help through a consistent, optional, non-blocking prompt — and a grep-shaped contract test keeps that offer, its YAML field, and its tool permissions from silently drifting the way the original build did.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- REQ-001: Add an optional goal-prompt offer to the consolidated setup prompt in all four presentation contracts (`speckit_plan_presentation.txt`, `speckit_complete_presentation.txt`, `speckit_implement_presentation.txt`, `speckit_resume_presentation.txt`)
- REQ-002: Add a `goal_prompt_choice` field (semantics: `offer` = show suggestion only, `skip` = say nothing, `set` = call `mk_goal` with the provided objective) to the Auto Resolution Table and Consolidated Prompt Template of all 8 workflow YAML assets
- REQ-003: Add `mk_goal`/`mk_goal_status` to the `allowed-tools` frontmatter line of the routers that mutate or read goal state as part of the offer (`plan.md`, `complete.md`, `implement.md`); `resume.md` gets `mk_goal_status` only (read-status, consistent with its narrower existing tool set and its role as a recovery/read surface rather than a new-work surface)
- REQ-004: `mk_goal` is called ONLY when `goal_prompt_choice=set` — the default (`offer` under `:auto`, or an explicit user answer under `:confirm`) never mutates goal state
- REQ-005: Use the correct live command/tool names everywhere in newly authored content: `goal_opencode.md` (not `goal.md`), `mk_goal`/`mk_goal_status` (not any other spelling)
- REQ-006: A contract test (grep-shaped, modeled on `.opencode/plugins/tests/mk-goal-export-contract.test.cjs`) pinning: the offer text is present in all four presentation contracts, `goal_prompt_choice` is present in all 8 YAML assets, the `allowed-tools` lines carry `mk_goal`/`mk_goal_status` on the three routers per REQ-003, and no stale name (`goal.md`) appears in any file this phase touches

### Out of Scope
- Any change to `mk-goal.js` plugin runtime behavior — the tools already work as documented; this phase only wires callers to them
- Any change to `goal_opencode.md`'s own contract, argument routing, or output envelope — that surface belongs to the `/goal` command itself, not to speckit integration
- Making the goal prompt mandatory or blocking — explicitly against the design (`handover.md` §2.4: "`:auto` must not prompt by default")
- Any other `/speckit:*` command beyond `plan`, `complete`, `implement`, `resume` — no others exist in `.opencode/commands/speckit/`
- Fixing `handover.md`'s stale `.opencode/commands/goal.md` reference at line 95 — owned by phase 015, not this phase (this spec and its downstream docs use the correct name; the historical handover file is left as-is)
- The `mk-goal.js` remediation track (phases 015-021) — independent; no dependency either direction

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/speckit/assets/speckit_plan_presentation.txt` | Modify | Add goal-prompt offer line(s) to the Consolidated Prompt Template and Auto Resolution Table reference |
| `.opencode/commands/speckit/assets/speckit_complete_presentation.txt` | Modify | Same offer pattern |
| `.opencode/commands/speckit/assets/speckit_implement_presentation.txt` | Modify | Same offer pattern |
| `.opencode/commands/speckit/assets/speckit_resume_presentation.txt` | Modify | Same offer pattern (read-status framing — "resume with your prior goal" rather than "set a new goal") |
| `.opencode/commands/speckit/assets/speckit_plan_auto.yaml` | Modify | Add `goal_prompt_choice` field |
| `.opencode/commands/speckit/assets/speckit_plan_confirm.yaml` | Modify | Add `goal_prompt_choice` field |
| `.opencode/commands/speckit/assets/speckit_complete_auto.yaml` | Modify | Add `goal_prompt_choice` field |
| `.opencode/commands/speckit/assets/speckit_complete_confirm.yaml` | Modify | Add `goal_prompt_choice` field |
| `.opencode/commands/speckit/assets/speckit_implement_auto.yaml` | Modify | Add `goal_prompt_choice` field |
| `.opencode/commands/speckit/assets/speckit_implement_confirm.yaml` | Modify | Add `goal_prompt_choice` field |
| `.opencode/commands/speckit/assets/speckit_resume_auto.yaml` | Modify | Add `goal_prompt_choice` field |
| `.opencode/commands/speckit/assets/speckit_resume_confirm.yaml` | Modify | Add `goal_prompt_choice` field |
| `.opencode/commands/speckit/plan.md` | Modify | Add `mk_goal`, `mk_goal_status` to `allowed-tools` |
| `.opencode/commands/speckit/complete.md` | Modify | Add `mk_goal`, `mk_goal_status` to `allowed-tools` |
| `.opencode/commands/speckit/implement.md` | Modify | Add `mk_goal`, `mk_goal_status` to `allowed-tools` |
| `.opencode/commands/speckit/resume.md` | Modify | Add `mk_goal_status` to `allowed-tools` (read-status only) |
| `.opencode/plugins/tests/` or an equivalent speckit-contract test location | Create | INT-3 contract test pinning offer text, YAML field, allowed-tools lines, live names |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Goal-prompt offer added to all four presentation contracts' consolidated setup prompts | Each of `speckit_plan_presentation.txt`, `speckit_complete_presentation.txt`, `speckit_implement_presentation.txt`, `speckit_resume_presentation.txt` contains a shared offer line in its Consolidated Prompt Template section, worded consistently across all four, and appearing as one more line in the SAME single consolidated prompt (never a separate follow-up prompt, per each file's own "never split these questions" rule) |
| REQ-002 | `goal_prompt_choice` field added to all 8 workflow YAML assets | Each of the 8 `speckit_*_{auto,confirm}.yaml` files documents `goal_prompt_choice` with default `offer` under `:auto` (or the file's existing no-prompt-by-default convention) and full offer/skip/set semantics under `:confirm`; field appears in whatever structure each file uses for its resolved setup inputs |
| REQ-003 | `mk_goal`/`mk_goal_status` added to router `allowed-tools` | `plan.md`, `complete.md`, `implement.md` frontmatter `allowed-tools` lines include both `mk_goal` and `mk_goal_status`; `resume.md`'s line includes `mk_goal_status` only |
| REQ-004 | `mk_goal` called only on explicit `set` | Grep/inspection confirms no code path calls `mk_goal({action:"set", ...})` except when `goal_prompt_choice=set`; `offer` and `skip` never mutate goal state |
| REQ-005 | Correct live names used throughout | Zero occurrences of `.opencode/commands/goal.md` or any tool name other than `mk_goal`/`mk_goal_status` in any file this phase authors or modifies |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | INT-3 contract test exists and passes | A grep-shaped test (modeled on `.opencode/plugins/tests/mk-goal-export-contract.test.cjs`'s file-read + assert pattern) pins: offer text present in all four presentation `.txt` files, `goal_prompt_choice` present in all 8 YAML files, `mk_goal`/`mk_goal_status` present in the three routers' `allowed-tools` lines and `mk_goal_status` in resume's, and zero stale-name occurrences; `node --test` runs it green |
| REQ-007 | Dashboard/status visibility (design-consistent, not a hard requirement) | Where a dashboard layout already exists per command (e.g., `SPECKIT PLAN DASHBOARD`), a goal status line MAY be added if it fits the existing terse format; not required if it would force a layout change beyond one line |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n "goal_prompt_choice"` hits in exactly the 8 workflow YAML assets, zero elsewhere in `.opencode/commands/speckit/`
- **SC-002**: `rg -ln "mk_goal"` on the four routers' `allowed-tools` lines matches REQ-003's exact per-router breakdown (three routers with both tools, one with `mk_goal_status` only)
- **SC-003**: A goal-prompt offer is visibly present and worded consistently in all four presentation contracts' consolidated prompts
- **SC-004**: The INT-3 contract test exists, is green on a fresh `node --test` run, and fails if any of the pinned surfaces regress (verified by a scratch mutation-then-test-fails check during implementation)
- **SC-005**: Zero occurrences of `.opencode/commands/goal.md` (the stale name) in any file this phase touches
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Adding a required goal question to `:auto` mode would force a prompt where the design explicitly forbids one | Medium | `goal_prompt_choice` defaults to `offer` (or the design's `skip`-safe default) under `:auto`; never a required/Tier-2 field per `handover.md` §2.4 |
| Risk | Copy-paste drift across 4 presentation files / 8 YAML files produces inconsistent offer wording or field semantics | Medium | Single shared offer-text template applied identically across all four; REQ-006 contract test pins consistency and catches drift going forward |
| Risk | Over-broadening `allowed-tools` on `resume.md` to include `mk_goal` (mutation) when its role is recovery-only | Low | REQ-003 explicitly scopes `resume.md` to `mk_goal_status` only, matching its existing narrower tool set (no `Bash`-adjacent mutation tools today either) |
| Dependency | `mk_goal`/`mk_goal_status` tool behavior (owned by `mk-goal.js`, phases 015-021) | Low - tools already confirmed live and correct 2026-07-03 | No plugin changes needed; this phase only wires callers |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The design (offer/skip/set semantics, presentation-first placement, optional non-blocking behavior) was already settled in `handover.md` §2.1-2.4 before this takeover; this spec operationalizes it against the confirmed real file set.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Finding source**: `../scratch/2026-07-03-four-reviewer-audit-findings.md` §E INT-1, INT-2, INT-3
- **Design input (historical, not edited by this phase)**: `handover.md` §2.1 (`goal_prompt_choice` field), §3.2 (presentation offer + allowed-tools), §2.4 (traps: `:auto` must not prompt by default, goal mutation must remain optional)
- **Contract-test pattern reference**: `.opencode/plugins/tests/mk-goal-export-contract.test.cjs`
- **Live command surface grounding**: `.opencode/commands/goal_opencode.md` (correct live name — `handover.md:95` cites the nonexistent `.opencode/commands/goal.md`, a stale reference fixed by phase 015, not here)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
