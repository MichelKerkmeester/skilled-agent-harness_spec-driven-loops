---
title: "Implementation Summary: sk-vision MCP server process-lifecycle guards"
description: "Closeout for the sk-vision MCP stdio server hardening that stops orphaned node processes leaking when a Cursor/Devin host dies."
trigger_phrases:
  - "sk-vision mcp process lifecycle guards summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/021-mcp-server-process-lifecycle"
    last_updated_at: "2026-08-18T17:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Ported + built the MCP shutdown guards; typecheck 0, tests 4/4, artifact rebuilt."
    next_safe_action: "Commit the source fix on v4 once the operator approves."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/021-mcp-server-process-lifecycle/implementation-summary.md"
      - ".opencode/skills/sk-vision/vision-runtime/src/mcp/server.ts"
      - ".opencode/skills/sk-vision/vision-runtime/src/mcp/server.test.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-021-mcp-server-process-lifecycle"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-mcp-server-process-lifecycle |
| **Status** | In Progress |
| **Level** | 1 |

The source fix, tests, typecheck, and artifact rebuild are done and verified; a commit is the only remaining step and is withheld until the operator asks.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An exported, injectable `installMcpLifecycleGuards` helper that makes the sk-vision MCP stdio server self-terminate on every teardown path, so it can no longer be orphaned when its Cursor or Devin host dies. `runSkVisionMcpServer` now calls the helper instead of the old bare `onclose`.

### Fix evidence

| Edit | Artifact | Result |
|------|----------|--------|
| New guard helper | `vision-runtime/src/mcp/server.ts` `installMcpLifecycleGuards` | Binds `onclose`, stdin `end`/`close`, `SIGTERM`/`SIGINT`/`SIGHUP`, and an `unref()`'d reparent (`ppid === 1`) watchdog to one idempotent `shutdown` |
| Wiring | `vision-runtime/src/mcp/server.ts` `runSkVisionMcpServer` | Calls the helper; the never-exiting single-line `onclose` is gone |
| Tests | `vision-runtime/src/mcp/server.test.ts` | +3 `bun:test` cases (stdin-end, idempotency, reparent); existing 13-tool transport test retained |

### Documentation

The lifecycle behavior was documented across the shipped skill surfaces, and a matching operator scenario was added.

| Surface | Change |
|---------|--------|
| `feature-catalog/host-adapters/mcp-transport.md` | Lifecycle-guard paragraph in HOW IT WORKS; sharpened `server.ts`/`server.test.ts` roles; new playbook cross-link |
| `feature-catalog/feature-catalog.md` | Added the missing `### MCP stdio transport` subsection to §5 (a pre-existing orphan-leaf gap the catalog validator flagged) |
| `manual-testing-playbook/host-adapters/mcp-lifecycle.md` | New scenario **VSN-025** — server self-terminates on stdin EOF, no orphan (verified: exit 0, `no orphan`) |
| `manual-testing-playbook/manual-testing-playbook.md` | Registered VSN-025 (§10 header, intro, scenario block); coverage note 24→25 |
| `SKILL.md`, `README.md`, `hooks/README.md` | One lifecycle note each where the MCP server is described |

Package validators after the edits: feature-catalog PASS (0 violations); playbook PASS (25 scenarios, 0 violations). Both were fixed to a real symptom, not silenced.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation was written by DeepSeek V4 Flash (xhigh) dispatched through cli-opencode with the cline-pass provider, inside an isolated detached worktree, against a fenced two-file spec. Its output was reviewed line-by-line, then ported byte-for-byte into the main checkout onto a base identical to origin/v4.

The one defect surfaced on the first run was in the worker's third test, not the implementation: "exits when reparented to init" asserted `exit === [0]` before it resolved the injected `close` deferred, but — exactly like the two passing tests — the exit is gated behind that deferred. The fix mirrored the working tests: assert the watchdog fired (`closeCalls === 1`, which also proves the `unref()`'d timer runs while another timer keeps the loop alive) and stays idempotent, then resolve `close`, then assert the single `exit(0)`.

Only OpenCode and Pi differ from Cursor/Devin: they load sk-vision in-process and share the host lifetime, so they never orphaned and needed no change. The fix is confined to the one MCP server module.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reparent-to-init watchdog as the backstop | SIGKILL delivers no signal and closes no stream cleanly; reparenting to init (`ppid` becomes 1) is the only universal orphan signal |
| `unref()` the watchdog timer | The detector must not itself pin the event loop open, so an idle-but-parented server can still exit through the other paths |
| Idempotent `shutdown` via a `closing` flag | Overlapping teardown events must collapse to one client-close (reaping the python child) and one exit |
| Injectable `exit`/`getParentPid` | Lets the guards be unit-tested without terminating the test runner |
| Source-only change; `dist` rebuilt not committed | `dist/mcp-server.js` is a gitignored build artifact regenerated by `bun run build` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bun run typecheck` (`tsc --noEmit`) | exit 0 |
| `bun test src/mcp/server.test.ts` | 4 pass / 0 fail (16 expect calls) |
| `bun run build` | exit 0; rebuilt `dist/mcp-server.js` |
| Guards present in built artifact | 8 hits for `installMcpLifecycleGuards`/`orphanWatch`/`process.ppid`/`SIGHUP` |
| Git footprint | exactly the two source files modified; `dist` is gitignored |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- The reparent watchdog polls at a 5s interval by default, so a SIGKILL-orphaned server lingers at most that long before self-terminating — bounded, not instantaneous.
- The guard was exercised by unit tests with an injected parent-pid probe, not by an end-to-end SIGKILL of a live Cursor/Devin host in this packet.
- `dist/mcp-server.js` is rebuilt locally so the fix is live in this checkout; other environments must run `bun run build` (as `hooks/README.md` already documents) to pick it up.
- `description.json` / `graph-metadata.json` are generator-produced, not hand-authored.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:not-committed -->
## COMMIT STATUS

Nothing in this packet is committed. The working tree carries unrelated in-flight work from another session (a `048→049` spec renumber and `039/040` deletions), so the two source-file changes and these docs are staged for a scoped commit only when the operator asks. The fix is already live in this checkout via the local `dist` rebuild.
<!-- /ANCHOR:not-committed -->
