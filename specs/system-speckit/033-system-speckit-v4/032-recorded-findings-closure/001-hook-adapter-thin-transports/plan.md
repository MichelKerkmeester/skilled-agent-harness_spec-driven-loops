---
title: "Implementation Plan: Phase 1: hook-adapter-thin-transports"
description: "Extract the duplicated classify/enforce orchestration out of claude/codex/cursor/devin's shared.ts files into spec-gate-core.mjs, then move pi onto the same shared entry points."
trigger_phrases:
  - "spec gate orchestration extraction"
  - "adapter transport reduction"
  - "shared core migration plan"
  - "runtime rollback procedure"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: hook-adapter-thin-transports

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (compiled to `dist/hooks/<runtime>/`) plus direct-run Node `.mjs`/`.cjs` for the spec-gate pair |
| **Framework** | None. Per-runtime CLI hook contracts (stdin JSON in, stdout JSON envelope out) plus the Pi extension API for pi |
| **Storage** | None (the gate state file store under `hooks/lib/spec-gate/spec-gate-core.mjs`'s `resolveGuardPaths` is unchanged by this port) |
| **Testing** | `node:test` (`spec-gate-*.test.mjs`) and Vitest (`runtime/tests/*.vitest.ts`) |

### Overview
Push the classify/enforce orchestration steps that claude, codex, cursor and devin each copy-paste (prompt sanitize, call `classifyIntent`/`evaluateMutation`, build the observe/deny arguments) into two new exported functions on `spec-gate-core.mjs`, following the in-process-import pattern the core already uses for every runtime's classify hook today. Migrate the four fat adapters one at a time, running that runtime's own test after each migration, then move pi onto the same functions so all five runtimes share one call site instead of pi being an independently-thin fifth shape.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared-core-with-thin-adapters. `spec-gate-core.mjs` already holds Gate-3 policy (1,491 lines). This phase extends it to also hold the orchestration glue around that policy, so each runtime file becomes payload-parse-then-envelope-emit. `hooks/shared-provenance.ts` (112 lines, shared by Claude and Copilot runtimes) is the existing in-tree precedent for extracting duplicated hook logic into one file.

### Key Components
- **`spec-gate-core.mjs`**: Gate-3 policy plus, after this phase, the runtime-parameterized classify/enforce orchestration.
- **`hook-adapter-shared.mjs`**: The shared JSON-stdin-read helper, widened from its current 20 lines to also cover what the four `shared.ts` files restate for spec-gate specifically (not the lifecycle spawnSync bridge, which stays runtime-local).
- **Five per-runtime `spec-gate-classify.mjs`/`.ts` and `spec-gate-enforce.mjs`/`.ts` files**: reduced to reading that runtime's payload shape and writing that runtime's envelope shape.

### Data Flow
Runtime event fires -> adapter reads its native payload (stdin JSON for the four Node CLIs, the Pi `event`/`ctx` objects for pi) -> adapter calls the new shared function with `{runtime, prompt/tool, sessionId, projectDir, env}` -> shared function returns plain decision data (`{question}` for classify, `{decision, detail}` for enforce) -> adapter builds its own native envelope and emits it, inside its own existing try/catch.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `hooks/lib/spec-gate/spec-gate-core.mjs` | Owns Gate-3 policy decisions | Update: add two orchestration wrapper functions | `spec-gate-core.test.mjs` plus a grep for the new export names |
| `hooks/lib/hook-adapter-shared.mjs` | Shared JSON-stdin-read helper (20 lines) | Update: add the helper the four `shared.ts` files restate for spec-gate | Adapter tests exercise it transitively |
| `hooks/{claude,codex,cursor,devin}/spec-gate-classify.mjs`, `spec-gate-enforce.mjs` | Runtime transport (payload parse + envelope) | Update: call the new core function, drop duplicated logic | Each runtime's own `spec-gate-<runtime>.test.mjs` / `spec-gate-prebind.test.mjs` |
| `hooks/pi/spec-gate-classify.ts`, `spec-gate-enforce.ts` | Already core-backed thin transport, independently shaped | Update: call the SAME new function the other four call | Manual pi-extension smoke per `hooks/pi/README.md` (no automated pi suite exists in the tree today) |
| `hooks/README.md` | Documents the delegation architecture | Update: name the new single call site | Doc review. Not test-gated |
| Lifecycle hooks (`session-prime`, `session-stop`, `compact-inject`, `directive-lifecycle-boundary`) | Own transcript/session state via `spawnSync` to `claude/*.js` | Not a consumer of the spec-gate core. Unchanged | `directive-lifecycle-adapter-parity.vitest.ts` continues passing unmodified |
| `.claude/settings.json`, `.codex/hooks.json`, `.cursor/`, `.devin/` hook registrations | Wire the CLI entrypoints to the adapters | Not a consumer. Entrypoint paths and the stdin/stdout contract are unchanged | No file diff expected. Confirmed by re-running each adapter's own test unmodified |

Required inventories:
- Same-class producers: `rg -n "classifyIntent|evaluateMutation" .opencode/skills/system-spec-kit/runtime/hooks` finds the 5 current call sites (claude, codex, cursor, devin `.mjs`, pi `.ts`). All 5 migrate onto the new shared functions.
- Consumers of changed symbols: `rg -n "spec-gate-core.mjs" .opencode/skills/system-spec-kit/runtime/hooks` finds all 5 runtime directories plus `spec-gate-core.test.mjs`. Each is re-run after the change.
- Matrix axes: runtime (5: claude, codex, cursor, devin, pi) x hook type (2: classify, enforce) = 10 call sites, all touched by this phase.
- Algorithm invariant: fail-open on any internal error holds for all 10 call sites. Verified by keeping each runtime's own `try`/`catch` around the new shared call rather than moving the catch into the core, so a core-level bug cannot turn into a block in any runtime.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | New `spec-gate-core.mjs` orchestration exports | `node:test` via `spec-gate-core.test.mjs` |
| Integration (per-runtime) | claude/codex/cursor/devin/pi classify+enforce, post-migration | `spec-gate-claude.test.mjs`, `spec-gate-codex.test.mjs`, `spec-gate-devin.test.mjs`, `spec-gate-prebind.test.mjs` |
| Regression | Adapter-tree parity and completion-evidence stop hooks | `directive-lifecycle-adapter-parity.vitest.ts`, `completion-evidence-sentinel.vitest.ts`, `hook-completion-evidence-stop.vitest.ts` |
| Manual | pi extension (no automated suite in tree for the Pi API surface) | Trigger a scripted spec-gate turn inside a Pi session per `hooks/pi/README.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `hooks/lib/spec-gate/spec-gate-core.mjs` | Internal | Green | The port has nothing to extract into. Confirmed present at 1,491 lines |
| Eight named regression suites | Internal | Green | Confirmed present under `hooks/{claude,codex,cursor,devin}/` and `runtime/tests/`. If one regresses it blocks the migration step that broke it, not the whole phase |
| Five live hook registrations (`.claude/settings.json` etc.) | Internal, out of boundary | Yellow (unverified live-fire per `research.md:124`) | Low impact: the CLI contract (stdin in, stdout out) is unchanged, so an unverified registration does not block shipping the port |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any of the eight named suites regresses, or a runtime's envelope shape changes observably in manual testing.
- **Procedure**: `git revert` the port commit(s). The pre-port per-runtime files are self-contained today (no shared function is deleted by this phase, only additively introduced then adopted), so a revert restores exact prior behavior with no data migration to unwind.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (read + diff the 5 runtimes' classify/enforce) ──────┐
                                                             ├──► Core (extend spec-gate-core.mjs, migrate claude→codex→cursor→devin→pi one at a time) ──► Verify (all 8 suites + wc -l)
Config (widen hook-adapter-shared.mjs) ─────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | 0.5-1 hour (read `spec-gate-core.mjs` and diff the five runtimes' classify/enforce files) |
| Core Implementation | Medium | 4-6 hours (5 runtimes x 2 hooks, migrated one at a time with a test run after each) |
| Verification | Low | 1 hour (rerun the eight named suites plus the `wc -l` check) |
| **Total** | | **6-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migration (state-file shape under `resolveGuardPaths` is unchanged)
- [ ] No feature flag needed. The transport contract (stdin/stdout, Pi extension events) is identical before and after
- [ ] Each runtime migrated and tested independently before moving to the next, so a partial rollback (one runtime only) is possible without touching the others

### Rollback Procedure
1. Stop before migrating the next runtime if the current one's test regresses.
2. `git revert` the commit(s) covering the runtime that regressed.
3. Rerun that runtime's own test plus the three cross-runtime regression suites to confirm the revert is clean.
4. No stakeholder notification needed. This is an internal refactor with no observable behavior change when successful.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---
