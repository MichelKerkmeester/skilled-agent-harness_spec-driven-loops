---
title: "Implementation Plan: Phase 5: advisor-linked-project-workspace"
description: "Let the advisor schema admit a workspace whose .skilled or .opencode resolves to the source tree's own entry, so the daemon serves projects linked by /doctor:symlink while every unwired path stays refused."
trigger_phrases:
  - "advisor linked project workspace plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: advisor-linked-project-workspace

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM), built to `dist/` with `tsc` |
| **Framework** | zod schemas, Node built-ins |
| **Storage** | None |
| **Testing** | vitest through `npx --no-install vitest run`, plus `run-all.sh` for the doctor gate |

### Overview
`isAllowedWorkspaceRoot()` keeps its prefix check and, when that refuses, asks a new `isWiredToSourceTree()`. That helper walks up from the input and admits it when a `.skilled` or `.opencode` entry there resolves to the same realpath as the source tree's entry. Two schema tests pin both directions, red before and green after, and a live `advisor_status` call from a linked scratch project shows the daemon serving it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] The advisor suite and `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exit 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Identity check by realpath, added beside the existing prefix allowlist.

### Key Components
- **`SOURCE_REPO_ROOT`**: the canonical source root, computed once at module load from `detectRepoRoot()`, the same value the prefix list already used.
- **`isWiredToSourceTree(input, sourceRoot)`**: resolves the source tree's `.skilled` and `.opencode`, then walks up from the canonical input comparing each ancestor's entries by realpath.
- **`isAllowedWorkspaceRoot(input)`**: prefix check first, then `isWiredToSourceTree(canonical)`.

### Data Flow
The CLI or the hook sends `workspaceRoot`. The daemon parses it through `BoundedWorkspaceRootSchema`, whose refine calls `isAllowedWorkspaceRoot()`. A linked project's `.skilled` resolves to the source tree's `.skilled`, so the refine passes and the handler runs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `advisor-tool-schemas.ts` `isAllowedWorkspaceRoot()` | Owner of the allowlist bound | update | Schema tests 18 pass |
| `BoundedWorkspaceRootSchema` in the same file | Refine used by the recommend, validate, status and rebuild input schemas | unchanged | Calls `isAllowedWorkspaceRoot()`, so all four inherit the new case |
| `.skilled/bin/system-skill-advisor-launcher.cjs` spawn `cwd: root` | Anchors the daemon on the source tree | unchanged | The source tree is the right anchor; live proof passes with it |
| `lib/utils/workspace-root.ts` `findAdvisorWorkspaceRoot()` | Finds the root from a start path through the sentinel, which a linked `.skilled` also carries | not a consumer | It never consults the allowlist |
| `ENV-REFERENCE.md` row, feature-catalog `advisor-recommend.md` | State the allowlist rule | update | `rg -n "links to this source tree"` prints both lines |

Required inventories:
- Same-class producers: `rg -n "isAllowedWorkspaceRoot|ALLOWED_WORKSPACE_PREFIXES" .skilled` found one producer, `schemas/advisor-tool-schemas.ts`, and one test file.
- Consumers of changed symbols: `BoundedWorkspaceRootSchema` is the only caller of `isAllowedWorkspaceRoot()` in the runtime; it bounds four input schemas.
- Matrix axes: input kind (linked project, linked project subdirectory, the source itself, unlinked directory, link to another source, copied tree, empty string). Seven rows, all in the two new tests.
- Algorithm invariant: a path is admitted only when a prefix admits it or when it, or an ancestor, holds a source-root entry with the source tree's realpath.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup inventories the callers and records the baselines, Implementation writes the red tests and then the fix, and Verification rebuilds, reruns both suites, runs the live proof and validates the packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `isWiredToSourceTree()` against a source tree, a linked project and three unwired directories built under `os.tmpdir()` | `npx --no-install vitest run tests/schemas/advisor-tool-schemas.vitest.ts` |
| Integration | The whole advisor suite and the doctor gate | `npx --no-install vitest run`; `run-all.sh` |
| Manual | `advisor_status` from a scratch project that links only `.skilled` to this checkout | `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node built-in `fs.realpathSync.native` | Internal | Green | None; no new package |
| The advisor build script | Internal | Green | Without a rebuild the daemon keeps the old rule |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the advisor refuses or admits a workspace it handled differently before, other than a linked project.
- **Procedure**: `git checkout -- .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` before commit, or revert the commit after it, then rerun the advisor build and stop the running daemon so it reloads.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup baselines and red tests | Verification |
| Verification | Implementation and the rebuilt `dist/` | Packet close |
<!-- /ANCHOR:phase-deps -->

---
