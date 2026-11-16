---
title: "Implementation Plan: Phase 24: vibe-hook-review-2-remediation"
description: "Close the background shell guard bypass first, with a payload test per guard written to fail on the old map, then fix the binding, cwd, hardening, doc and testability findings, each with a test that fails on the old file where the finding is code."
trigger_phrases:
  - "vibe hook review 2 remediation plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 24: vibe-hook-review-2-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM and CommonJS hooks, TOML bindings, Markdown references |
| **Framework** | Mistral Vibe 3.1.2 hooks over the runtime-neutral guard cores |
| **Storage** | Gitignored state under `.skilled/skills/.state/` and the OS temp folder |
| **Testing** | `node --test` suites, each driving a hook with a payload on stdin or calling an exported part |

### Overview
The P1 is one missing key in the tool-name map every shell guard reads, so its tests come first and are run against the old map to prove they fail. The P2 fixes are independent edits in the Vibe adapters, the bindings and the docs. Each code fix gets a unit case that fails when the old file is put back, and the shared cores used by other runtimes stay untouched.
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
- [x] `node --test .vibe/plugins/repo-guards/tests/ .skilled/hooks/goal/vibe/goal-vibe.test.mjs`, the session-lifecycle and decision-capture suites, the session-handover suite and the Vibe reader suite each print `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin Vibe adapters over shared cores.

### Key Components
- **`lib/hook-io.mjs`**: the one seam between a Vibe payload and a guard core: the tool-name map, the cwd rule and now the existing-directory rule.
- **The session-lifecycle composers**: one entry per Vibe event, each composing fail-open parts.
- **The Vibe writer and reader pairs**: the completion advisory (turn-end writes, turn-start reads and deletes) and the decision queue (post-tool writes, turn-start reads).

### Data Flow
Vibe spawns a hook with one JSON payload on stdin. `toCoreCall` maps the payload's `tool_name` to the short name the core compares, so `process.start` now becomes `bash` and reaches each shell check. A writer resolves `payload.cwd` with `sessionDirFor` and writes only under an existing absolute folder; its reader resolves the same value with the same rule.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `hook-io.mjs` `CORE_TOOL_NAMES` | The only tool-name map; every shell guard reads it through `toCoreCall` | Update: add `process.start` | Four `process.start` cases fail on the old map |
| spec-gate, env-secret-guard, git-message-gate, dispatch-preflight, dist-freshness | Consumers of `toCoreCall` that branch on `bash` | Unchanged code; covered by payload tests | `rg -n "toCoreCall" .vibe/plugins/repo-guards` |
| overlay-guard binding | Strict `pre_tool` on shell and write tools | Update: write tools only | `.vibe/hooks.toml:63` |
| `sessionDirFor` | The cwd rule | Exported already; now used by dist-freshness, dispatch-preflight, turn-start and ask-capture | `rg -n "sessionDirFor" .vibe .skilled/hooks` |
| Completion writer and turn-start reader | Pending advisory pair | Update both: checkout fallback, existing-directory rule on the writer | Turn-end cases fail on the old writer |
| ask-capture writer and turn-start save reminder | Decision queue pair | Update both: `sessionDirFor` | Decision-capture and turn-start suites |
| ask-surface `recordFire` | Fire log under the payload cwd | Update: existing folder only; the deny and `markTurn` stay | Turn-end case fails on the old adapter |
| `ask-surface-core.cjs`, `completion-evidence-sentinel.cjs`, `nudge.cjs` | Shared cores used by other runtimes | Unchanged | `git diff --stat` lists none of them |

Matrix axes for the shell guards: tool name (`file_system.bash`, `process.start`) by guard (env-secret, git-message, dispatch-preflight, spec-gate). Eight rows, each asserted.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads `../review/review-report.md` and records the four baseline suite counts. Implementation writes the `process.start` tests, proves they fail, adds the map key, then fixes the workstreams in the order the report's plan seed gives. Verification reruns every suite, records a disposition per finding and validates this folder; the ordered tasks are in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each shell guard with a `process.start` payload; deep-loop-guard with `agents.spawn`; the session-start parts; the writers; the nudge catch; the advisor receipts; the renderer | `node --test` |
| Integration | The four lifecycle entry points spawned with a payload on stdin | `goal-vibe.test.mjs`, `turn-end.test.mjs`, `turn-start.test.mjs`, `compaction-context.test.mjs` |
| Manual | VIB-HK-029, a background shell command in a live Vibe session | The orchestrator's live run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Installed Vibe 3.1.2 source | External | Green | The payload name and default timeout would rest on the review alone |
| The orchestrator's live Vibe run | Internal | Yellow | VIB-HK-029 stays open; the unit evidence stands |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A suite fails, or a live scenario shows a guard denying a call it allowed before for a reason this phase introduced.
- **Procedure**: `git revert` the phase commit; the bindings, the map and the adapters return together.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup: baseline counts | The review report | Any edit |
| Implementation: P1 tests, then the map, then the P2 workstreams | The baseline | Verification |
| Verification: suites, dispositions, validate; the live run | Every edit landed | Closure |
<!-- /ANCHOR:phase-deps -->

---
