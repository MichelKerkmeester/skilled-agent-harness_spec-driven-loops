---
title: "Implementation Plan: Phase 19: dsh-repin-rc3"
description: "Moves every literal DeepSeek Harness pin from 0.2.2-rc.1 to the installed 0.2.2-rc.3, then repeats the repin runbook's route, confinement, reasoning and fan-out probes on it. The proof is the saved probe evidence and the suites that stub the version."
trigger_phrases:
  - "dsh repin rc3 plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 19: dsh-repin-rc3

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS and ESM on Node, TypeScript tests, JSON rules and Markdown references |
| **Framework** | The deep-loop runtime, the dispatch hook and the `cli-deepseek-harness` skill packet |
| **Storage** | None |
| **Testing** | `node --test`, Vitest, `npm run typecheck` and the live runbook probes |

### Overview
Change one version string in 18 places and restate four route status lines. Then run the runbook's probes T004 to T008 on the installed rc.3 and save each result under `evidence/`. The proof is both routes and one fan-out lineage completing, a denied home write and the suites that stub the version passing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The installed binary reports `0.2.2-rc.3`
- [x] The pin search lists 22 lines in 15 files
- [x] `~/.dsh` is snapshotted before the first probe

### Definition of Done
- [x] All acceptance criteria met
- [x] The pin search prints no `0.2.2-rc.1` line and both route probes print exit 0 with `completed`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One literal pin. Every place that compares or documents the release holds the same string.

### Key Components
- **`DSH_VERSION` in `fanout-run.cjs`**: the builder refuses any other release before it makes a home.
- **`DSH_PINNED_VERSION` in the dispatch hook**: refuses an explicit `npx` pin to any other release.
- **The `pinned-version-required` rule and the version table**: tell a hand-composed dispatch which release to accept.

### Data Flow
A dispatch runs `dsh --version` in a throwaway home and compares the output to the pin. A match proceeds, and any other value throws or is refused before the model is called.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `fanout-run.cjs` `DSH_VERSION` | Builder version gate | update | `fanout-run.vitest.ts` pin assertion |
| `dispatch-rule-checks.mjs` | Hook version gate on `npx` pins | update | `dispatch-rule-checks.test.mjs` |
| `hard-rules.json`, `cli-reference.md`, `prompt-templates.md`, the playbook | Tell a dispatcher the release | update | T002 search prints nothing |
| `SKILL.md`, `README.md`, `providers-and-models.md`, `live-contracts.json` | State which release a route was verified on | update | T004 result on rc.3 |
| Test stubs in `dsh-shim.cjs`, `combo-matrix.vitest.ts`, `fanout-run.vitest.ts` | Pretend to be the pinned binary | update | their suites |
| Earlier phase evidence under `specs/` | Records what ran on rc.1 | unchanged | history |

Same-class producers: `rg -n --hidden -g '!specs/**' -g '!.git/**' -g '!**/node_modules/**' -g '!**/changelog/**' '0\.2\.2-rc\.1' .` lists every site.
Consumers of the changed constants: `rg -n 'DSH_VERSION|DSH_PINNED_VERSION' .skilled -g '!**/node_modules/**'`.
Matrix axes: route (LLM Gateway, OpenCode Go) by probe (completion, home write, temp write, cwd write, bash, reasoning stderr), plus one fan-out lineage.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the version, the pin sites and a `~/.dsh` snapshot. Implementation changes the string at each site. Verification runs the runbook probes T004 to T008 and the touched suites. The repin edits were made by hand, because a repin is mechanical and the runbook names no dispatch for them.

Each probe uses the runbook's command shape: a fresh `mktemp -d` cwd, `DSH_HOME` inside it, the route, lineage and guards patches, `--json --permission-mode workspace-write --approval-policy never -` and separate stdout, stderr and exit files. The probe script and the version probe live in a script file, because the dispatch hook reads command text and treats a bare version probe as a dispatch.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The hook version check, the builder version gate and the stubs | `node --test`, Vitest |
| Integration | One fan-out research lineage on rc.3 | `fanout-run.cjs --allow-single-lineage` |
| Manual | Two route probes, four boundary probes and the reasoning stderr check | The runbook command shape |

| Probe | Route | Expected |
|-------|-------|----------|
| T004 completion | LLM Gateway | exit 0, `completed` |
| T005 completion | OpenCode Go | exit 0, `completed`, because its key is set |
| T006 cwd write, home write, temp write, bash | LLM Gateway | cwd write and bash complete, home write a `tool_result` error, temp write recorded |
| T007 reasoning stderr | LLM Gateway | no `UNSUPPORTED_REASONING_EFFORT` |
| T008 fan-out lineage | LLM Gateway | exit 0, one lineage succeeded, no containment advisory |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `dsh` 0.2.2-rc.3 at `~/.local/bin/dsh` | External | Green | No probe can run |
| `LLMGATEWAY_API_KEY`, `OPENCODE_API_KEY` | External | Green, both set | A route without its key stays untested on rc.3 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a probe fails on rc.3, or the operator goes back to rc.1.
- **Procedure**: revert the one commit. The binary on `PATH` is not touched by this phase.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | rc.3 on `PATH` | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Any further DeepSeek build worker in this worktree |
<!-- /ANCHOR:phase-deps -->

---
