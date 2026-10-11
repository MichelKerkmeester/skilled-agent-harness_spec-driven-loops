---
title: "Feature Specification: Onboarding fixes"
description: "Fix the fresh-clone onboarding stumbles the research ranked, R1, R2 and R4 to R11, and record R3 and R12 to R14 as closed."
trigger_phrases:
  - "onboarding fixes"
  - "phase 2 onboarding fixes"
  - "fresh clone onboarding fixes"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Onboarding fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/111-open-ends-integration` (scaffold); the builder works in its own worktree branched from the scaffold commit |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-typo-proof-parsers |
| **Successor** | 003-doc-and-catalog-truth |
| **Handoff Criteria** | Every criterion in `goal.md` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the open ends remediation. It builds R1, R2 and R4 to R11 from `specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/002-fresh-clone-onboarding/research/research.md` and records R3 and R12 to R14 as closed.

**Scope Boundary**: The README install path, CONTRIBUTING's Node line, the Pi and Codex session-start messages, sk-vision's setup line, and the mirror checker's not-checkable case. `.claude/settings.json` does not change.

**Dependencies**:
- The pristine-clone probe the research describes, rerun as the before-and-after proof where a row changes behavior.
- The existing generator for `.codex/hooks.json` (R6).

**Deliverables**:
- The doc edits and two small code changes the rows below name.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A fresh clone meets a README promise the advisor launcher does not keep, an unstated Node range, a missing build step, two runtimes that fail without naming the cause, and a hook trust key outside the numbered steps. A missing built parser also blocks a commit with a false desync diagnosis.

### Purpose
A user who follows only the numbered README steps reaches a routed request and a spec packet, and every failure on the way names its cause.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R1, R2 and R4 to R11, as written in the ledger below.

### Out of Scope
- R3: CLOSED by an operator decision on 2026-10-11. `bypassPermissions` stays in the tracked `.claude/settings.json`, and nothing in that file changes.
- R12, R13 and R14: build-nothing decisions in the research. They are recorded as Closed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | R1, R2, R4, R8, R10, R11 |
| `CONTRIBUTING.md` | Modify | R2 |
| `.pi/extensions/session-start-context.ts` | Modify | R5 notice, or its source if the file is a generated mirror |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, `.codex/hooks.json` | Modify | R6 message, then regenerate |
| `.skilled/skills/sk-vision/SKILL.md` | Modify | R7 Bun prerequisite and setup |
| `.skilled/hooks/git/pre-commit`, `.skilled/bin/lib/mirror-sync-verify.cjs` | Modify | R9 not-checkable case |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every build row is Fixed | Each row's ledger line names the command or probe that shows the change |
| REQ-002 | `.claude/settings.json` is unchanged | `git log` from the scaffold commit to HEAD lists no commit touching it |
| REQ-003 | Every row in the recommendation ledger ends Fixed with a command proof or Closed with a written reason | The ledger lines in `implementation-summary.md` follow the format above, one per row |
| REQ-004 | Changed behavior has tests that fail before the change | Each Tests table line shows a non-zero exit before and exit 0 after |
| REQ-005 | Each touched skill is bumped once, with a changelog entry | One new file under `.skilled/skills/<skill>/changelog/` and one `version:` change in its `SKILL.md` per touched skill |

### Recommendation Ledger: Build (10 rows)

| ID | Recommendation | Evidence | Move |
|----|----------------|----------|------|
| R1 | Delete the README claim that the advisor launcher installs and builds its own runtime on first run | README.md:162; .skilled/bin/skill-advisor.cjs:24; pristine-clone probe: `list-tools` exits 1 with `Cannot find module '@spec-kit/shared/workspace/repo-root.mjs'` | Change a value |
| R2 | Name Code Mode's exact Node range (24.x) in the README prerequisites, and align CONTRIBUTING's `18+` to the same line | README.md:160; CONTRIBUTING.md:25; .skilled/skills/mcp-code-mode/mcp-server/package.json:43; pristine-clone probe: launcher exits 1 with `no Node interpreter satisfies >=24.0.0 <25.0.0` | Change a value |
| R4 | Add one README step that builds the spec-kit workspace (`npm --prefix .skilled/skills/system-spec-kit run build`) after the install in step 2 | README.md:170; .skilled/skills/system-spec-kit/package.json:25; .skilled/skills/system-spec-kit/runtime/package.json:17 | Extend in place |
| R5 | Print a one-line notice naming the spec-kit build when Pi's session-start adapter returns nothing | .pi/extensions/session-start-context.ts:42; .pi/extensions/lib/claude-hook-adapter.ts:57 | Extend in place |
| R6 | Change Codex's default drift message to name the spec-kit runtime build, then regenerate `.codex/hooks.json` with the existing generator | .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:23; .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json:52; .codex/hooks.json:8 | Change a value |
| R7 | State sk-vision's Bun prerequisite and its `bun install && bun run build` setup where sk-vision is introduced | .skilled/skills/sk-vision/vision-runtime/package.json:11; .skilled/skills/sk-vision/vision-runtime/package.json:46; .skilled/skills/sk-vision/SKILL.md:290 | Extend in place |
| R8 | Put `git config --local skilled.trustRepoHooks true` into the numbered install region, not only mid-prose | README.md:197; README.md:191; .skilled/scripts/git-hooks/pre-commit:48 | Extend in place |
| R9 | Make the mirror checker report "not checkable" separately from drift, and let the pre-commit hook warn-skip that case as it already does for a missing `node` | .skilled/hooks/git/pre-commit:93; .skilled/hooks/git/pre-commit:95; .skilled/hooks/git/pre-commit:97; .skilled/bin/lib/mirror-sync-verify.cjs:13 | Extend in place |
| R10 | Say in step 3 that it needs step 2 finished | README.md:172; .skilled/skills/system-skill-advisor/runtime/package.json:11 | Change a value |
| R11 | Point First Use at all seven runtimes, not only OpenCode | README.md:212 | Extend in place |

### Recommendation Ledger: Closed (4 rows)

| ID | Recommendation | Why it is closed |
|----|----------------|------------------|
| R3 | Move `bypassPermissions`, `skipDangerousModePermissionPrompt` and the `SYSTEM_SPEC_GATE_ENFORCE` env out of the tracked `.claude/settings.json` into the gitignored `.claude/settings.local.json`, and drop the inert `defaultProjectTrust` line; confirm the startup effect in one live Claude Code session first, since that was not observed | Operator decision 2026-10-11: keep `bypassPermissions` tracked in `.claude/settings.json`; change nothing in that file |
| R12 | Leave the 36 empty `.skilled_skills_*` root files and dangling tracked symlinks alone unless an unrelated root cleanup is already happening | Build nothing, per the research and prevent-overengineering: no observed failure names them |
| R13 | Leave the compiled-routing `z_archive` source where it is | Build nothing, per the research and prevent-overengineering: no requirement a move would serve |
| R14 | Leave worktree provisioning as is for onboarding | Build nothing, per the research and prevent-overengineering: no worktree is needed before the first spec packet |

### Ledger format

The builder records every row above in `implementation-summary.md`, one line each, in this shape, so the goal criteria can count them:

- `| <ID> | Fixed | <the command that proves it, in backticks, and what it printed> |`
- `| <ID> | Closed | <the written reason, naming prevent-overengineering or the operator decision> |`

Changed behavior gets a test that fails before the change and passes after it, recorded in a Tests table in the same file:

- `| T<n> | <test file or command> | before: exit <non-zero> | after: exit 0 |`
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 14 ledger rows are Fixed or Closed in `implementation-summary.md`.
- **SC-002**: A pristine clone that follows only the numbered README steps reaches a routed advisor request.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `.pi/extensions/` or `.codex/hooks.json` is a generated mirror | Med | Edit the source and regenerate with the existing mirror tool; the mirror checks must stay green |
| Risk | 001 changes the mirror checker's parser (F1) while R9 changes its result handling | Med | Keep R9 in the library and the hook, so the merges stay line-disjoint |
| Risk | Other 021 builders bump the same skill in parallel | Med | Version numbers collide when the four branches merge; the integrator renumbers, and each child still bumps once |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
