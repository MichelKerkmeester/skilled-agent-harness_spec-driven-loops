---
title: "Implementation Summary"
description: "Both Node 20 failures are fixed at their cause: the plugin suite stubs imports through module.register when registerHooks is missing, and the syntax helper reads each child's report from a file so Node 20 keeps the SyntaxError line."
trigger_phrases:
  - "node20 test fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/011-node20-test-fixes"
    last_updated_at: "2026-10-27T21:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Fixed both Node 20 failures and proved them on three Node versions"
    next_safe_action: "Conductor merges the child into the parent phase table and commits"
    blockers: []
    key_files:
      - ".opencode/plugins/tests/system-skill-advisor.test.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/lib/parallel-node-check.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/tests/parallel-node-check.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "node20-test-fixes-implementer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-node20-test-fixes |
| **Status** | Complete |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor plugin suite and the parallel syntax check suite now pass on Node 20.19.5 as well as on 22 and 26. The second fix is not only a test fix: on Node 20 the quality gate's `syntax-node` finding for a minified file now quotes the real `SyntaxError` message instead of a run of source text.

### Node 20 test fixes for the advisor plugin suite and the parallel node check helper

The plugin suite stubbed three imports, plus `node:fs` for one module instance, through `module.registerHooks`, which Node 20 lacks. The plugin itself never calls it, and the advisor's engines range `^20.19.0 || >=22.12.0` promises Node 20, so the gap was the harness alone. CI runs the suite on Node 22 (`opencode-plugin-tests.yml`), which is why it never failed there.

The long-line case failed because a node child that exits while an async stderr write is still queued loses what the stdio channel its parent created could not take at once: 8 KiB under a Node 20 parent and 64 KiB under Node 22 and later on macOS. The parent's version decides it, not the child's. Both the test's direct reference and the helper read the report through such a channel. A file write completes before the call returns, so each child now writes stderr to a file, and the test file grew to 100,000 characters so it fails a pipe-reading helper under every Node. CI runs this suite on Linux, where pipe and socket writes are synchronous, which is inferred to be why it never showed the loss.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/tests/system-skill-advisor.test.cjs` | Modified | `stubModuleResolution` uses `registerHooks` where present, else `module.register` with a data-URL hooks module and the stubs as data |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/parallel-node-check.cjs` | Modified | Per-child stderr file in a run-owned `mkdtemp` folder, streamed back through the same head-and-tail budget, removed on every exit path |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/parallel-node-check.test.cjs` | Modified | The direct reference report is read from a file |
| `.skilled/skills/system-skill-advisor/runtime/tests/daemon-watcher-new-root-ingestion.vitest.ts` | Modified | The real-chokidar case polls on macOS, where FSEvents can lag seconds under a busy `fseventsd` |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.13.2.0.md` | Created | Changelog entry |
| `.skilled/skills/system-skill-advisor/changelog/v0.17.10.0.md` | Created | Changelog entry |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md`, `.skilled/skills/system-skill-advisor/SKILL.md` | Modified | Version carriers stepped |
| `.hermes/skills/sk-code-quality/SKILL.md`, `.hermes/skills/system-skill-advisor/SKILL.md` | Modified | Hermes copies resynced |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both files ran three times on each Node version before any edit. The test's reference read was fixed first and run against a copy of the unchanged helper to show the helper itself loses the message, then the helper was fixed and the full matrix rerun. The full sk-code-quality and plugin suites, the quality gate on the changed files and a Node 20 quality gate run on a long-line file closed it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `registerHooks` first and fall back to `register` | Node 22 and later keep the in-thread path they already ran, and Node 20 gets the same resolve rule without a skip |
| A stderr file instead of a larger pipe or a skip on Node 20 | No pipe size is safe for an arbitrarily long line, and a skip would hide a real loss in the quality gate's finding |
| Stream the file through the existing capture | The record budget and its head-and-tail shape stay exactly as the runner reads them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `system-skill-advisor.test.cjs`, 3 runs each on Node 20.19.5, 22.23.1, 26.8.2 | Before: Node 20 `pass 0 fail 1` exit 1. After: `pass 42 fail 0` exit 0, all nine runs |
| `parallel-node-check.test.cjs`, 3 runs each on the same versions | Before: Node 20 `pass 2 fail 1` exit 1. After: `pass 3 fail 0` exit 0, all nine runs |
| Fixed test (100,000-character line) against the unchanged helper, Node 20, 22, 26 | `pass 2 fail 1` exit 1 on each, case 2 lost the message |
| Full sk-code-quality script suite | Node 26 `pass 123 fail 0` exit 0; Node 20 `pass 123 fail 0` exit 0 |
| Full plugin suite, Node 26 | `pass 553 fail 0` exit 0 |
| `quality-gate.cjs --files` on the three code files | `gate=NO_BLOCKER_FOUND exit=0`, `findings: 0` |
| Node 20 quality gate on a long one-line file | `node --check: Unexpected token 'function'` |
| `daemon-watcher-new-root-ingestion.vitest.ts`, 5 runs on macOS | `Tests 5 passed (5)`, exit 0 on all five |
| Changelog validation | `"total_issues": 0` for both entries |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No CI leg runs Node 20.** Both suites run on Node 22 in CI, so a future Node 20 regression would again show only locally. Adding a Node 20 leg to `opencode-plugin-tests.yml` and `sk-code-script-tests.yml` is a separate decision.
<!-- /ANCHOR:limitations -->

---
