---
title: "Feature Specification: Phase 19: vibe-agent-sync-check"
description: "The Mistral Vibe agent profiles are generated from .skilled/agents, but nothing checks them, so two went stale when this packet changed their sources. This phase regenerates them and adds the three Vibe drift checks to CI."
trigger_phrases:
  - "vibe agent sync check"
  - "phase 19 vibe agent sync check"
  - "vibe mirror ci check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 19: vibe-agent-sync-check

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 20 |
| **Predecessor** | 018-research-duration-check |
| **Successor** | 020-agent-docs-alignment-research |
| **Handoff Criteria** | The three Vibe drift checks exit 0, CI runs them, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the agent alignment follow-ups. The operator asked whether agents now sync to `.vibe/` on their own. They do not, and two profiles were stale.

**Scope Boundary**: The generated `.vibe/agents/` profiles, the CI workflow that checks runtime mirrors, and the two docs that say whether the Vibe checks run in CI.

**Dependencies**:
- The Vibe generators under `.skilled/skills/system-spec-kit/runtime/cli/vibe/`

**Deliverables**:
- The Vibe agent profiles match their sources
- CI fails when a Vibe agent, skill or prompt mirror drifts
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.vibe/agents/*.toml` is generated from `.skilled/agents/*.md` by `sync-agents-vibe.cjs`. Nothing runs that generator or its `--check`: no pre-commit hook, no CI job, and `check-agent-mirror-sync.cjs` does not read `.vibe/`. The 016 commit changed `orchestrate.md` and `markdown.md`, so their Vibe profiles went stale. The Pi and DSH copies stayed in sync because CI checks them.

### Purpose
A change to an agent, a command or a skill that leaves the Vibe mirrors behind fails CI.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-agents-vibe.cjs --check
[vibe-agent-sync] STALE .vibe/agents/markdown.toml
[vibe-agent-sync] STALE .vibe/agents/orchestrate.toml
[vibe-agent-sync] FAIL: 2 drift item(s); run without --check to regenerate
(exit 1)
$ grep -c -i vibe .github/workflows/command-tree-parity.yml
0
$ sed -n 115p .vibe/SYNC.md
Nothing runs these checks automatically yet: no pre-commit hook and no CI job names a Vibe generator. ...
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Regenerate the stale Vibe agent profiles with the generator.
- Add a `vibe-mirror` job to `command-tree-parity.yml` that runs the three Vibe `--check` commands, and add `.vibe/**` to its path filters (operator answer 2026-11-15: "Regen + add CI check").
- Update `.vibe/SYNC.md` and the workflows README to say CI runs the checks.

### Out of Scope
- A pre-commit hook for the Vibe mirrors.
- Adding `.vibe/` to `check-agent-mirror-sync.cjs`, which compares hand-mirrored files, not generated ones.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.vibe/agents/markdown.toml`, `.vibe/agents/orchestrate.toml` | Regenerate | Match their sources |
| `.github/workflows/command-tree-parity.yml` | Modify | `.vibe/**` path filter and the `vibe-mirror` job |
| `.vibe/SYNC.md` | Modify | Say CI runs the three checks |
| `.github/workflows/README.md` | Modify | Name the Vibe copies in the workflow's row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `sync-agents-vibe.cjs --check`, `sync-skills-vibe.cjs --check` and `sync-prompts-vibe.cjs --check` each exit 0. |
| REQ-002 | A CI job runs all three checks on a push or pull request that touches `.vibe/`, an agent, a command or a `SKILL.md`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `.vibe/SYNC.md` and the workflows README describe the CI check. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three checks exit 0, and a drifted profile makes the agent check exit 1.
- **SC-002**: `actionlint` passes on the workflow, which lists the `vibe-mirror` job.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The generators need `@spec-kit/shared` | Low | The job installs the spec-kit workspace first, like the DSH job |
| Risk | The skill check depends on symlinks surviving a sparse checkout | Low | The DSH skill check runs under the same checkout |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose the regenerate-and-CI fix on 2026-11-15.
<!-- /ANCHOR:questions -->

---
