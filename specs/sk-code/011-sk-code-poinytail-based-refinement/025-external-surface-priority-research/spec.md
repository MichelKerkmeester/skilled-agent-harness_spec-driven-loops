---
title: "Feature Specification: Phase 25: external-surface-priority-research"
description: "Two-lineage deep research into how Skilled should treat sk-code-obsidian and sk-code-webflow as deletable examples and let a user's own sk-code surface outrank the native sk-code-skilled surface. Research only; no skill, script or README changes."
trigger_phrases:
  - "external surface priority research"
  - "phase 25 external surface priority research"
  - "user surface outranks sk-code-skilled"
  - "obsidian and webflow are examples"
  - "sk-code surface order for external users"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 25: external-surface-priority-research

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-12 |
| **Branch** | `worktrees/123-surface-priority-research` (round one), `worktrees/124-surface-priority-round-two` (round two) |
| **Parent Spec** | ../spec.md |
| **Phase** | 25 of 25 |
| **Predecessor** | 022-doc-version-and-playbook-paths |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 25** of the sk-code Ponytail refinement epic. It is numbered 025 because phases 023 and 024 exist on another branch, `worktrees/122-readme-freshness-research`, and are not yet on main.

**Scope Boundary**: Read-only research. The run writes only under this folder. No skill, script, command or README changes; experiments that delete surfaces run in a throwaway copy outside the worktree.

**Dependencies**:
- The `/deep:research` auto workflow as a two-lineage fan-out, 10 iterations each, stop policy `max-iterations`.
- Lineage A: `cli-devin` with model `deepseek-v4-1-flash-max`. Lineage B: `cli-codex` with model `gpt-6-luna`, reasoning effort `max`, service tier `fast`.
- Round two, lineage C (`swe2max-devin`): `cli-devin` with model `swe-2-max`. Lineage D (`luna-max-fast-r2`): `cli-codex` with `gpt-6-luna`, effort `max`, tier `fast` for iterations 1 to 4, then, by operator change, `cli-pi` with `openai/gpt-6-luna`, `--thinking xhigh` and the fast-mode extension for iterations 5 to 10.
- `devin`, `codex`, `pi` and `node` on the PATH.

**Deliverables**:
- `research/research.md`, the merged synthesis with findings, a ranked recommendation, where the lineages agree and disagree, rejected ideas and proposed implementation phases.
- Each lineage's state and iterations under `research/lineages/`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The v4.0.0.4 release note's "One Surface Order Everywhere" entry says every sk-code file that ranks the code surfaces lists OpenCode, then Obsidian, then Webflow, and that a keyword tie can be led by the session's surface through `compiled-route.cjs --surface-hint`. That order fits only the operator's own repository. sk-code-obsidian and sk-code-webflow are the operator's personal surfaces and serve external users only as examples, which they are expected to delete and replace with a surface for their own project. sk-code-skilled is the one native surface, so for an external user a surface of their own should outrank it. sk-code-review and the shared layer are stack-agnostic and serve every user.

### Purpose
Find every place that encodes the surface order or assumes the two example surfaces are installed, show what breaks when a user deletes them and adds their own, and recommend the smallest change that lets a user's own surface outrank sk-code-skilled while the operator's repository keeps its order.

### Research Questions

1. Where is the surface order encoded, and where are sk-code-obsidian and sk-code-webflow treated as installed (hub router tie-break, mode registry, SKILL.md, ROUTER.md, shared references, the compiled-routing manifest and runtime, canary fixtures, the skill advisor, the doctor commands, install guides, READMEs and the v4.0.0.4 note)?
2. What breaks today when an external user deletes sk-code-obsidian and sk-code-webflow, observed in a throwaway copy (doctor, compiled-route guard, route sync, canaries, advisor, package checks), and what happens when they add their own surface packet?
3. How should a user-added surface outrank sk-code-skilled: a priority field in the mode registry, a native or fallback flag on opencode, a tie-break derived when the manifest is built, the `--surface-hint` path, or something else? Compare cost and risk and recommend one.
4. How does the operator's repository keep its current order while the shipped default assumes the examples are gone: what is configuration, what is data, what is example and what is shipped?
5. Which doctor and documentation changes tell external users the two surfaces are examples to delete or replace, and how to scaffold their own surface?
6. Which ideas should be rejected, and why?

Round two adds:

7. Which shared or opencode leaves could serve the stack-agnostic ROUTER.md intents once webflow is deleted?
8. What does fixing the re-mint dependency on the authored closure under `specs/sk-doc/z_archive/019-skill-routing-refactor/` cost, against documenting it?
9. Does `/create:skill-parent update --surfaces` perform the steps a hand-added surface misses?
10. What exact edits do R1 to R4 need, what still breaks, and is each the smallest correct fix?
11. What else assumes the examples, and where does the end-to-end external-user journey stall (UX), what could be one existing command (automation), and which guide should tell the user (guides)?
12. Do the rejected ideas still hold?
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The sk-code hub and its surfaces, the compiled-routing manifest and runtime, the skill advisor, the doctor commands, install guides, READMEs and the v4.0.0.4 release note.
- Observed behavior in a throwaway copy with the two example surfaces removed, and with a stand-in user surface added.
- A ranked recommendation and proposed implementation phases.

### Out of Scope
- Changing any skill, script, command, README or release note. The operator decides the build later.
- Deleting anything in this worktree. Every delete experiment runs in a copy outside it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` | Create | Lineage configs, state, iterations and the merged synthesis; round two adds `research/lineages/swe2max-devin/` and `research/lineages/luna-max-fast-r2/` and refreshes the merged registry, attribution and resource map |
| `implementation-summary.md`, `goal.md`, `plan.md`, `tasks.md` | Modify | Outcome and log once the run ends |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run 10 iterations in each lineage; a convergence stop before 10 does not count, and an unavailable executor stops the run with no substitute | Each lineage's `deep-research-state.jsonl` holds 10 iteration records |
| REQ-002 | Write `research/research.md` with finding rows `\| F<n> \| <class> \| <claim> \| <evidence path:line or command> \| <severity> \| <lineage> \|`, where class is ORDER, PRESENCE, BREAK, DOC or OK | At least one F row exists, each cites a path:line and names a class |
| REQ-003 | Rank the recommendation as rows `\| R<n> \| ... \|`, with R1 the recommended option, each citing path:line evidence | At least one R row exists and each cites a path:line |
| REQ-004 | Record rejected ideas as rows `\| X<n> \| ... \|` with the reason | At least one X row exists |
| REQ-005 | Record where the two lineages agree and disagree | `research/research.md` has a section whose heading names the disagreement |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Spot-check every cited path:line and rerun every quoted command before it reaches the synthesis | The goal log records the spot-check |
| REQ-007 | Pass every recommendation through `.skilled/repo-rules/prevent-overengineering.md` | Each R row names the cheaper move it rejects and why |
| REQ-008 | Propose implementation phases | `research/research.md` lists rows `\| P<n> \| ... \|` |
| REQ-009 | Round two runs 10 more iterations in each of two new lineages, concurrently per iteration where both have one left, and keeps round one's files intact | Each round-two lineage's `deep-research-state.jsonl` holds 10 iteration records |
| REQ-010 | The merged synthesis of both rounds keeps F, R and X ids stable and appends new ids | Written by the orchestrator's synthesis pass after round two |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

Done means:

- **SC-001**: Each research question above has an answer backed by path:line or command evidence, or is marked UNKNOWN with what would settle it.
- **SC-002**: Every criterion in `goal.md` passes, strict validation included.
- **SC-003**: No file outside this folder and the epic's phase rows differs from the base commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `devin` with `deepseek-v4-1-flash-max`, `codex` with `gpt-6-luna` | A lineage cannot start, or stops on a usage limit | Stop and report; no substitute executor |
| Risk | An executor deletes a surface inside the worktree instead of a copy | The worktree loses tracked files | The prompt bars it; the orchestrator checks `git status` after every iteration |
| Risk | A model cites a line or a result it did not check | A wrong recommendation reaches the operator | The orchestrator rereads every cited line and reruns the delete experiment itself |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking the run. The research questions are in section 2.
- Deep-research topic: how a user's own sk-code surface should outrank sk-code-skilled once the obsidian and webflow example surfaces are deleted, while the operator's repository keeps its order.
- Research Context: deep-research is active for this topic in two lineages under research/lineages/; research/research.md is canonical.
<!-- BEGIN GENERATED: deep-research/spec-findings -->
Abridged from `research/research.md`, which stays canonical:
- The surface order lives only in `hub-router.json` `tieBreak`; the compiler copies it and the doctor validates it. The shipped order already ranks the native surface ahead of the two examples.
- A surface a user adds must go ahead of `sk-code-skilled`; nothing writes or documents that today (R1).
- Deleting the two examples fails the doctor with 113 failures, crashes the sk-code drift guards on a hard-coded path, and leaves the front door routing to the deleted packets (R2, R3).
- The doctor's re-mint repair leaves the guard at `authored-drift` unless the manifest is copied to its authored path (R3).
- A rank field, a native flag, a mint-time derivation and a starter payload are rejected (X1 to X6).
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
