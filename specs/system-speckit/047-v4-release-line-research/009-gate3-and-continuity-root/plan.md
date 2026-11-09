---
title: "Implementation Plan: Phase 9: gate3-and-continuity-root"
description: "Fix Gate 3 order dependence and the resume override in the shared classifier, refuse a fallback project root in the save path, probe the CLI writer at install, and resolve create.sh templates from its own skill. Each change is proved by the probe that reproduced it."
trigger_phrases:
  - "gate3 and continuity root plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: gate3-and-continuity-root

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node 24), bash, YAML command assets |
| **Framework** | None; spec-kit `shared`, `runtime` and `runtime/cli` workspaces |
| **Storage** | None |
| **Testing** | vitest (cli project), `node --test` hook suite, validation shell suites, labeled Gate 3 corpus |

### Overview
Five verified defects get one fix each at the producer: the classifier's mixed-tail check, its resume branch, the project-root resolver's fallback, the install probe plus repair text, and `create.sh`'s template base. Each fix is proved by rerunning the exact probe that reproduced it in `spec.md`, then the whole baseline set.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npx vitest run --config vitest.config.ts --project cli` holds its baseline pass count and the probe prompts print `true`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at producer.

### Key Components
- **`shared/gate-3-classifier.ts`**: the one Gate 3 decision every runtime hook loads through `shared/dist`.
- **`runtime/cli/core/config.ts` `resolveProjectRoot`**: the producer of `CONFIG.PROJECT_ROOT`, read by the save path in `generate-context.ts`.
- **`runtime/cli/spec/create.sh`**: the scaffolder; its template base decides where templates come from.

### Data Flow
A prompt reaches the hook, which calls `classifyPrompt` from `shared/dist`. A save reads `CONFIG.PROJECT_ROOT` at import, then `main()` resolves the spec folder under it and writes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared/gate-3-classifier.ts` `hasMixedWriteTail`, resume branch | Producer of the Gate 3 verdict | update | probe script plus `gate-3-classifier.vitest.ts` |
| `runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Consumer through `shared/dist` | unchanged | `node --test runtime/tests/hooks/spec-gate-core.test.mjs` |
| `system-skill-advisor/.../gate3-corpus-runner.mjs` | Consumer through `shared/dist`, labeled corpus | unchanged | corpus agreement count |
| `runtime/cli/core/config.ts` `resolveProjectRoot` | Producer of the project root | update | dist probe from a non-repository directory |
| `continuity/generate-context.ts` `main` | Writer consumer of the root | update | save from a non-repository directory exits non-zero |
| `continuity/backfill-frontmatter.ts`, `migrate-trigger-phrase-residual.ts` | Other `resolveProjectRoot` callers | unchanged (not save paths) | `rg -n resolveProjectRoot` |
| `doctor-install.yaml`, `doctor-install-presentation.txt` | Install probe | update | `rg -n 'cli/dist' doctor-install*` |
| `validate.sh` `resolve_orchestrator` | Repair text | update | `rg -n 'Run:' validate.sh` |
| `create.sh` three `TEMPLATES_BASE` sites and `INLINE_GATE_RENDERER` | Template resolution | update | create in a repository with no `.skilled` tree |

Required inventories:
- Same-class producers: `rg -n 'TEMPLATES_BASE=|REPO_ROOT/.skilled' runtime/cli/spec/create.sh`.
- Consumers of changed symbols: `rg -n 'resolveProjectRoot|hasMixedWriteTail|classifyPrompt' .skilled --glob '!**/dist/**'`.
- Matrix axes: write-verb position (before, after) by joiner (`and`, `then`, comma, none) by trigger class (file write, resume).
- Algorithm invariant: a read-only word suppresses Gate 3 only when no write verb is joined to it as a separate instruction, in either order.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records baselines, Implementation dispatches one cli-codex worker per finding group, Verification reruns the probes and the baseline suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `classifyPrompt` probe rows, `resolveProjectRoot` fallback, create.sh template base | vitest cli project |
| Integration | Hook consumer and labeled corpus through `shared/dist` | `node --test`, `gate3-corpus-runner.mjs` |
| Manual | Probe prompts and a create.sh run in a scratch repository | node and bash from the scratchpad |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex `gpt-6-luna` high fast | External | Green | Fall back to DeepSeek per goal G4 and log it |
| `shared/dist` rebuild in the worktree | Internal | Green | Hook and corpus would test the old classifier |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a labeled corpus row that agreed before flips, or a baseline suite loses a pass.
- **Procedure**: revert this phase's single commit with `git revert <sha>` in the worktree.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (baselines, negative controls) | None | Implementation |
| Implementation (three worker briefs) | Setup | Verification |
| Verification (probes, suites, cross-family review) | Implementation | Phase close and commit |
<!-- /ANCHOR:phase-deps -->

---
