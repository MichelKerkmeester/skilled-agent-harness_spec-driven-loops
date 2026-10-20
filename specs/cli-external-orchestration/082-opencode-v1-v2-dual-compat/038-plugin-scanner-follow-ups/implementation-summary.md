---
title: "Implementation Summary"
description: "The plugin event guard now reports a helper call whose stored result later decides a branch, reads a type-named parameter as the event type only while some call can pass one, and no longer counts an object key or member property as a value. rolldown is a direct dev dependency, and the plugin tree states no fixed ordinals. The scan of every bridged plugin is unchanged."
trigger_phrases:
  - "plugin scanner follow ups implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/038-plugin-scanner-follow-ups"
    last_updated_at: "2026-10-21T00:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Luna round 2 PASS; final tree gates rerun"
    next_safe_action: "Merge main, push, record CI on the pushed commit"
    blockers: []
    key_files:
      - ".opencode/plugins/tests/helpers/plugin-inventory.cjs"
      - ".opencode/plugins/tests/plugin-inventory.test.cjs"
      - ".opencode/plugins/ARCHITECTURE.md"
      - ".skilled/package.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-038-plugin-scanner-follow-ups"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 038-plugin-scanner-follow-ups |
| **Completed** | 2026-10-21 |
| **Status** | In Progress |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A plugin that stores a helper's verdict on the event type and branches on it later no longer passes the event guard unseen. A helper parameter that happens to be called `type` no longer makes the guard invent event names, and the parser the guard needs is now a declared dependency.

### Phase 38: plugin-scanner-follow-ups

The guard used to report a helper that receives the event type only when the call sat in a branch test, so `const ok = isKnown(eventType); if (ok) {}` slipped through. It now records which helper calls each binding carries, through declarations, plain assignments and object or array literals built from them, and reports the call when any read of such a binding decides an `if`, a loop, a conditional, a `switch` or a `case`.

Any name `type` or ending in `Type` used to count as the event type. A parameter with such a name now counts only while some call can pass the event type: the guard reads every call of the function in the file and treats the parameter as unrelated only when the function has a name, is not exported, never escapes, never writes the parameter, and no call passes the event type at that position, a default value included. A recursive call fails closed. An object key or member property spelled like the type is no longer read as a value; that rule is what kept the stored-result rule from reporting `system-deep-loop-guard.js`, whose dispatch call passes `{ subagentType: args.subagentType }`.

`rolldown` is now declared in `.skilled/package.json` at 1.2.12, the version vite already locked, so a vitest or vite update cannot remove the parser. The plugin tree in `ARCHITECTURE.md` names its first and last bridged entry instead of "the 15 below" and "the 17th entry".

The four 024 limits were checked against the current scanner first. Escaped names, check text inside strings, case labels under an unrelated switch and a collection changed by `push` or `add` were already closed by the AST scanner, each with a fixture in `plugin-inventory.test.cjs`, so no change was needed for them.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/tests/helpers/plugin-inventory.cjs` | Modified | Stored-result rule, type-parameter tracing, keys and member properties are not values |
| `.opencode/plugins/tests/plugin-inventory.test.cjs` | Modified | 19 fixtures for the new rules (32 tests before, 51 after) |
| `.opencode/plugins/ARCHITECTURE.md` | Modified | Tree comments without ordinals; the event-guard limit rewritten to match the code |
| `.skilled/package.json`, `.skilled/package-lock.json` | Modified | `rolldown` 1.2.12 as a direct dev dependency; the lock change adds the root entry and drops `peer` flags on rolldown and its own dependencies |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash at max effort through cli-pi wrote every change from six one-change briefs. GPT-6 Luna at max effort through cli-codex reviewed read-only. The orchestrator reran each check from the worktree and ran the mutation probes in a copied tree, never in the repository. Round 1 failed on four P1s (a default value, a rewritten parameter, an exported function, a doc claim about objects and arrays), all fixed; the orchestrator also found and fixed an explicit `undefined` before the parameter that stopped the argument walk. Round 2 passed with one P2, recorded below.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Follow stored results into object and array literals rather than stop there | Following them reports more checks, never fewer; Luna's round 1 asked for code and docs to agree, and the doc was changed to match the safer code |
| Treat an unreadable parameter as the event type | A parameter the guard cannot trace (no name, exported, escaping, written, recursive, spread argument) keeps today's answer, so no real check can be dropped by the new rule |
| Keep the over-report after a non-derived overwrite | `let hit = check(event.type); hit = false; if (hit) {}` still reports `check(event.type)`. Ordering assignments needs flow analysis, and the error is a report too many, not a check missed |
| Declare rolldown at the locked version | It is already in the tree at 1.2.12, so no new package enters; an exact pin matches `@opencode/plugin` and `yaml` in the same manifest |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scan of every bridged plugin | Identical before and after for all 16 (`scratch/baseline/scan-before.json`, `scratch/after/scan-after.json`) |
| New fixtures on the old helper | 7 rule fixtures fail (`scratch/mutation-new-tests-on-old-helper.txt`) |
| Mutation probes | m1 to m9 each fail at least one fixture (`scratch/mutation-probes.txt`) |
| Inventory test | 51 of 51 (32 before) |
| Plugin suite | 477 of 477 (458 before) |
| Battery unit tests | 51 of 51 |
| Purity test | 1 of 1 |
| `npm ci` in `.skilled` | Exit 0; `node_modules/rolldown` is 1.2.12 |
| Luna review | Round 1 FAIL, four P1s fixed; round 2 PASS, one P2 recorded (`scratch/luna-round-1.txt`, `scratch/luna-round-2.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A stored result keeps its helper after a plain overwrite.** `let hit = check(event.type); hit = false; if (hit) {}` still reports the call. This over-reports; it never hides a check.
2. **Values are not followed across files, through a function's return value or through an escaping function.** A helper result returned from one function and branched on by its caller is not seen.
3. **The event type is still known by name.** An unrelated value named `type` that is not a traced parameter is read as the event type, and an event type held under any other name is invisible. The two-version doctor battery remains the authoritative guard.
<!-- /ANCHOR:limitations -->

---
