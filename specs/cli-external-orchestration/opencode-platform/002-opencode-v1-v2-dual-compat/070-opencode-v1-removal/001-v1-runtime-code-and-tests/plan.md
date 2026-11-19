---
title: "Implementation Plan: Phase 1: v1-runtime-code-and-tests"
description: "Removes the v1 branches from the runtime, the setup helper, the doctor battery, the plugins and the session readers, and proves each removal with a named suite or a zero-match grep."
trigger_phrases:
  - "v1 runtime code and tests plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: v1-runtime-code-and-tests

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Node.js (CommonJS and ESM) and TypeScript |
| **Framework** | None. `node --test` runs the `.cjs` and `.mjs` suites; vitest runs the deep-loop runtime `.ts` suites |
| **Storage** | Read-only SQLite access by the session readers; no new storage |
| **Testing** | `node --test` for the CJS and MJS suites; `npx vitest run` in `.skilled/skills/system-deep-loop/runtime` for the TS suites |

### Overview
This phase removes the v1 branches from the runtime: version resolution, dispatch rules, the deep-loop native-lineage path, the skilled-loop wrapper, the setup helper, the doctor battery, the plugin event handlers and the session readers. Each removal is proven by a named suite or by a grep that prints 0, and the output is recorded in `scratch/` as tasks.md names. The live event capture on OpenCode 2.3.2 decides which unverified plugin branches go.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] Every requirement in `acceptance-criteria.md` is Met with the evidence it names
- [ ] The node suites named in REQ-004, REQ-005, REQ-006 and REQ-008 print `# fail 0`
- [ ] The vitest parity and fanout suites report 0 failed tests, and the widened scan names exactly the four `--pure` files
- [ ] Docs updated (spec, plan and tasks agree on the REQ ids and the file list)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Remove in place, with no compatibility layer. A removed branch is deleted, not gated behind a flag.

### Key Components
- **Version resolvers** (`opencode-version.mjs` and `opencode-version.cjs`): the single source of family truth. Without the change they accept v1 and dispatch to it. After it they accept v2 only and report anything else as unsupported.
- **Dispatch guard** (`hard-rules.json` and `dispatch-rule-checks.mjs`): loses the two rules that only apply to v1 argv.
- **Deep-loop runtime** (`fanout-run.cjs` and `behavior-bench-run.cjs`): keeps the v2 argv and loses the native-lineage path, the v1 argv and the bypass flag.
- **Plugins and bridge** (`v2-bridge.js` and the event handlers): the bridge loses its v1-facing `server` key. `EVENT_ALIASES` stays.
- **Setup helper and doctor battery**: lose their v1 modes and legs. The setup helper gains `--remove-v1` for other users.
- **Session readers** (`opencode.mjs` and `sweep-opencode.mjs`): read the v2 tables only.

### Data Flow
A binary's `--version` output goes to the resolver, which returns family v2 or "unsupported". The dispatch rules and the argv builder then consume only that family. The session readers read the v2 tables, and the plugins receive only the events that the live capture showed arrive.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
N/A: this phase removes code and is not a fix. The consumers of each removed symbol are listed by the `rg` inventory in tasks.md T002.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads each file in the spec's Files to Change table, re-checks the inventory line references and runs the live event capture on OpenCode 2.3.2 into `scratch/`.
Implementation removes the v1 branches area by area, starting with version resolution and ending with the session readers and the widened test.
Verification reruns the baseline suites, the vitest suites and the zero-match greps, and records the delta against the baseline.

The ordered task list is in `tasks.md`, which owns the Setup, Implementation and Verification checkboxes.

### Files to Change
- Version resolution: `.skilled/hooks/cli-dispatch/lib/opencode-version.mjs`, `.skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs`, `.skilled/hooks/cli-dispatch/lib/opencode-version-corpus.json`.
- Dispatch rules: `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json`, `.skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs` and its two tests.
- Deep-loop runtime: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `.skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs`, the runtime tests named in the spec, and the deleted `hermetic-opencode-path.ts`.
- Wrapper, setup and battery: `.skilled/bin/skilled-loop`, `opencode-setup.sh` (v1 modes removed, `--remove-v1` added, pin untouched), `opencode-setup-both.test.cjs` (deleted), `opencode-setup-classify.test.cjs`, `opencode-version-battery.cjs` and its test.
- Plugins and session readers: the three `*.disposed` plugin files, the two conditional event files, `.opencode/plugins/lib/v2-bridge.js`, the plugin tests that call `.server(`, `session-readers/opencode.mjs`, `sweep-opencode.mjs` and the readers test.

The full list with change types is the spec's Files to Change table.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Resolver parity, dispatch rules, doctor battery, skilled-loop wrapper, setup classify, plugin bridge | `node --test` for `.cjs` and `.mjs`; `npx vitest run` in the runtime folder for `.ts` |
| Integration | Fanout argv against v2; session readers against a v2 fixture; plugin event handlers | `npx vitest run tests/unit/fanout-run.vitest.ts`; `node --test` on the readers suite |
| Manual | Live event capture on OpenCode 2.3.2 for the unverified plugin events | `opencode run -m <model> ... </dev/null` writing to `scratch/event-capture.txt` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| OpenCode 2.3.2 binary | External | Present: `opencode --version` reports `opencode v2.3.2` on this machine | The event capture cannot run, so the unverified plugin branches stay |
| `node --test` | External | Present: the CI workflow runs suites with `node --test` | The `.cjs` and `.mjs` suites cannot run |
| vitest in the deep-loop runtime | Internal | Present: `vitest.config.ts` and `node_modules` exist in `.skilled/skills/system-deep-loop/runtime` | The `.ts` suites cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a named suite fails because of a removal, or the live capture shows that an event this phase removed does arrive on OpenCode 2.3.2.
- **Procedure**: revert this phase's changes with `git revert` on the branch. Do not run the parent's Mac step. Restore the removed branch that the capture contradicts, then rerun the baseline suites.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing: it reads files and runs the live capture | Implementation (the capture decides the plugin branches) |
| Implementation | Setup (baseline and capture recorded) | Verification |
| Verification | Implementation (all removals made) | Phase 002 |
<!-- /ANCHOR:phase-deps -->

---
