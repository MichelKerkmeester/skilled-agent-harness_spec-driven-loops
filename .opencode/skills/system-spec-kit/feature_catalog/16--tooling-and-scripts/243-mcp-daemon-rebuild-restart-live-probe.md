---
title: "MCP daemon rebuild, restart, and live-probe protocol"
description: "Canonical four-part contract that proves an MCP TypeScript fix is actually live in the running daemon by chaining source diff, targeted vitest, dist-marker grep with mtime check, runtime restart, and a live MCP probe."
trigger_phrases:
  - "mcp daemon rebuild restart and live-probe protocol"
  - "live-probe-template"
  - "rebuild and restart mcp"
  - "dist-marker grep"
  - "mcp daemon verification"
---

# MCP daemon rebuild, restart, and live-probe protocol

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

The canonical four-part contract that proves an MCP TypeScript fix is actually live in the running daemon by chaining source diff, targeted vitest, dist-marker grep with mtime check, runtime restart, and a live MCP probe.

The protocol exists to prevent the v1.0.2 phantom-fix pathology where a TypeScript change passed targeted vitest but the running daemon kept serving stale code because the runtime was never restarted. Each part of the contract closes a different failure mode: source diff confirms the change was actually written to disk, vitest confirms the change compiles and behaves as designed, the dist-marker grep confirms the build artifact carries the new code, the runtime restart confirms the daemon picked up the new dist, and the live MCP probe confirms the end-to-end contract returns the post-fix payload.

---

## 2. HOW IT WORKS

### Core Behavior

The protocol is documented in four reference files under packet `008-mcp-daemon-rebuild-protocol/references/` and exercised by playbook scenario 278.

`mcp-rebuild-restart-protocol.md` documents the rebuild plus restart sequence and the per-client restart commands. OpenCode reloads tools, Claude Code restarts the binary, and the Codex and Gemini CLIs restart their binaries. The restart command differs per client because the MCP daemon process is owned by the host runtime, not the Spec Kit workspace.

`live-probe-template.md` defines the live MCP probe envelope. The envelope shape is shared across affected subsystems (`memory_context`, `memory_search`, `code_graph_query`, `memory_causal_stats`) so a single probe can confirm the post-fix contract field is present without bespoke per-subsystem scaffolding. The probe is the only step in the four-part contract that touches the running daemon; the earlier steps work against the workspace tree.

### Quality Gates & Validation

`dist-marker-grep-cheatsheet.md` lists the grep patterns used to confirm a `dist/` artifact carries the expected source change. The grep is paired with an mtime check (`stat -f "%m" dist/<file>.js src/<file>.ts`) so a stale dist that grep-matches an unrelated string still fails the mtime comparison. Both checks must pass before the restart step runs.

`implementation-verification-checklist.md` is the canonical checklist run after every MCP rebuild. It chains the four parts in order and fails closed if any step is skipped. The checklist is the operator-facing surface; the other three references are the building blocks.

### Edge Cases & Caveats

The protocol pairs with the standalone install path documented in `16--tooling-and-scripts/232-setup-native-module-health-and-mcp-installation.md`. Install covers the upfront workspace bootstrap. This protocol covers the post-fix verification loop after the daemon is already running.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/008-mcp-daemon-rebuild-protocol/references/mcp-rebuild-restart-protocol.md` | Reference | Documents the rebuild plus restart sequence and per-client restart commands |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/008-mcp-daemon-rebuild-protocol/references/live-probe-template.md` | Reference | Defines the live MCP probe envelope shared across memory_context, memory_search, code_graph_query, and memory_causal_stats |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/008-mcp-daemon-rebuild-protocol/references/dist-marker-grep-cheatsheet.md` | Reference | Lists grep patterns and mtime checks for verifying dist artifacts carry the new source change |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/008-mcp-daemon-rebuild-protocol/references/implementation-verification-checklist.md` | Reference | Canonical post-rebuild checklist that chains the four parts of the contract |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/267-mcp-daemon-rebuild-restart-live-probe.md` | Manual playbook | Playbook scenario 278 covering source diff, targeted vitest, dist marker check, runtime restart, and live probe verification |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/243-mcp-daemon-rebuild-restart-live-probe.md`
Related references:
- [242-debug-delegation-scaffold-generator.md](242-debug-delegation-scaffold-generator.md) — Debug-delegation scaffold generator
- [244-graph-degraded-stress-cell-isolation.md](244-graph-degraded-stress-cell-isolation.md) — Graph degraded stress cell with SPEC_KIT_DB_DIR isolation
