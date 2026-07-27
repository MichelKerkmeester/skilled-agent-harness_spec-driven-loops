---
title: "Implementation Summary: Pi MCP-host integration"
description: "pi-mcp-extension installed and live-verified: stdio transport genuinely connects, the deny-by-default enforcement point is Pi core's --tools/--exclude-tools flags (not the extension itself), and a two-tier .pi/mcp.json is committed with 2 of 5 servers live-confirmed connecting in this bare worktree."
trigger_phrases:
  - "pi mcp host integration summary"
  - "pi-mcp-extension implementation status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/007-pi-mcp-host-integration"
    last_updated_at: "2026-07-27T14:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Extension installed, stdio live-confirmed, two-tier config committed, phase Complete"
    next_safe_action: "None -- re-verify 3 servers from a provisioned environment later"
    blockers: []
    key_files: ["spec.md", ".pi/mcp.json"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-phase-007-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Stdio transport CONFIRMED WORKING live (not just documented).", "Deny-by-default enforcement point is Pi core's --tools/--exclude-tools, not pi-mcp-extension itself.", "Tier 2 needs no separate file -- lifecycle:lazy inside the same committed .pi/mcp.json suffices.", "3 of 5 servers' non-connection in this worktree is a diagnosed missing-build-artifact gap, confirmed present in the main tree -- not a config or extension defect."]
---
# Implementation Summary: Pi MCP-host integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-pi-mcp-host-integration |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase was originally authored planning-only, closed once (2026-07-27 morning) with its primary go/no-go gate (does pi-mcp-extension's stdio transport actually work?) honestly left open, since installing third-party software crossed this phase's own Hard Constraint. Later the same day, the operator explicitly asked to install the extension and then approved continuing into this phase's full live verification. This closeout documents that real execution.

### The install

`pi install npm:pi-mcp-extension -l --approve` succeeded: exit 0, 94 packages added (`@modelcontextprotocol/*`, `express`, `hono`, `zod`, and their transitive deps) into `.pi/npm/node_modules/pi-mcp-extension`, gated by npm's own `.pi/npm/.gitignore`. `.pi/settings.json` was created fresh (`{"packages": ["npm:pi-mcp-extension"]}`) — the first time any real `.pi/` state has existed in this packet. `pi list --approve` confirmed the package resolved to a real installed path. No provider API key was needed for any of this — installing a package is a local npm operation, independent of Pi's model-dispatch credential gate.

### The stdio-transport go/no-go (REQ-002), resolved

A single-entry `.pi/mcp.json` (`sequential_thinking`, `transport: "stdio"`, `lifecycle: "eager"`, `command`/`args` copied verbatim from `.mcp.json`) made `mcp_sequential_thinking_sequentialthinking` appear in `pi --offline --approve -p "list your available tools"`'s live tool listing. This is real, positive, live evidence: the MCP server was spawned as a subprocess, its tool was discovered via the extension's `tools/list` handshake, and it was bridged into Pi's own tool namespace with the exact `<prefix>_<server>_<tool>` naming its bundled README documents. This happened in `--offline` mode with no provider credentials configured — confirming MCP connection/discovery is a purely local process operation, independent of the LLM-provider gate every other phase in this packet has been blocked by.

### Expanding to all 5 native servers

`.pi/mcp.json` was expanded to register all 5 native servers, split into two tiers by `lifecycle`:
- **Tier 1 (`"eager"`, auto-starts)**: `sequential_thinking`, `mk-spec-memory`, `mk_code_index` — none carry a tool this phase's own spec named as mutation-capable.
- **Tier 2 (`"lazy"`, requires an explicit `/mcp:start`)**: `mk_skill_advisor` (carries `advisor_rebuild`/`skill_graph_scan`/`skill_graph_propagate_enhances`) and `code_mode` (carries `register_manual`/`deregister_manual`/`call_tool_chain`).

Re-running the same live probe: `sequential_thinking` and `mk-spec-memory` both connected — `mk-spec-memory`'s full real tool surface appeared (`memory_context`, `session_resume`, `memory_save`, `memory_delete`, etc.). `mk_code_index` failed after 5 retries (`MCP error -32000: Connection closed`, backoff 1s/3s/5s/10s/30s, ~49s total). A direct invocation of its launcher script traced the exact cause: `Cannot find module '.../system-code-graph/node_modules/typescript/bin/tsc'` — this bare git worktree lacks that skill's built TypeScript toolchain (confirmed: the identical file exists in the main tree). `mk_skill_advisor` and `code_mode`, correctly, did not attempt to connect (Tier 2, lazy) — and when I separately, directly invoked both launchers to check whether they'd have the same class of issue, both did (`npm error Missing script: "build"`; `Cannot find module '.../mcp-code-mode/mcp-server/dist/index.js'`) — the same worktree-provisioning gap this whole session's own metadata round-trip pattern already exists to work around (this worktree lacks several skills' gitignored `node_modules`/built `dist/`).

### The deny-by-default enforcement point (REQ-005), resolved more favorably than expected

A direct read of the installed package's own bundled `README.md` (a stronger, TYPE/DOC-CONFIRMED source than the external docs page) shows its full documented config schema has genuinely no per-tool permission/deny field — confirmed absent, not merely undocumented. Separately, `pi --help` documents `--tools`/`-t` (allowlist) and `--exclude-tools`/`-xt` (denylist) flags, explicitly stating they apply to "built-in, extension, and custom tools." This is the real, confirmed enforcement point: Pi's CORE gates MCP-bridged tools by exact name, uniformly with built-ins — a finer-grained mechanism than the spec's own risk log anticipated might not exist at all. Wiring `--exclude-tools` into an actual orchestrated dispatch invocation is a dispatch-code change (phase 002/009's scope, not this phase's); this phase records the mechanism and layers server-level `lifecycle` as the config-time gate available today.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/settings.json` | Created (by `pi install`) | Package manifest; not hand-authored. |
| `.pi/mcp.json` | Created | 5 native servers, Tier 1 (`eager`)/Tier 2 (`lazy`) split per the mutation-tool inventory above. |
| `.pi/npm/.gitignore` | Created (by `pi install`) | Keeps `.pi/npm/node_modules` and its `package.json`/`package-lock.json` untracked. |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Modified | Every REQ/task/checklist item updated with its real, live-evidenced result; Status flipped Blocked -> Complete. |
| `implementation-summary.md` | Rewritten | This document (previously documented the earlier, planning-only closeout). |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I did not dispatch LUNA or GLM-5.2 for this phase: the work was a sequence of real, individually-verifiable CLI commands and direct file reads (an `npm`-mediated install, live `pi` probes, and reads of the installed package's own bundled docs and `pi --help`), not a code diff needing an independent implementation-then-review pass. Every claim in this document traces to a command I ran and its literal output, not an inference — I have quoted the actual error messages, tool-listing text, and file paths above rather than summarizing them.

This phase was originally closed as "Blocked" earlier in this session, with the install step explicitly deferred as out of its own planning-only Hard Constraint. The operator later issued a direct instruction ("install extension") which I first scoped narrowly (install + confirm no startup crash) before asking whether to continue into this phase's full remaining verification, since that crosses from a bounded install action into real security-policy design (which MCP tools get exposed, by default, to a coding agent). The operator confirmed continuing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Split Tier 1/Tier 2 by `lifecycle: eager/lazy`, gating on the exact mutation-tool list this phase's own REQ-006 already named | This is the real, package-native, live-confirmed mechanism (unlike the plan's original project/global-split hypothesis, which turned out unnecessary). Live-verified: the 2 lazy servers correctly never auto-connected. |
| Do not force `mk_code_index`/`mk_skill_advisor`/`code_mode` to connect by installing their missing build deps into this worktree | Installing gitignored deps into a bare worktree is explicitly against this session's own established discipline (sk-git's large-reorg-playbook guidance: defer toolchain/deps work to the main tree). The 3 failures are a confirmed, pre-existing, out-of-this-phase's-scope environment gap, not something to patch around here. |
| Drop the `_NOTE_*` inline-comment env keys from `.mcp.json` when translating into `.pi/mcp.json` | Those keys are a JSON-comment workaround specific to `.mcp.json`'s own authoring convention; they carry no runtime function and would just be inert extra env vars passed to each child process. Dropping them is a documented cleanup, not a functional change — every real `command`/`args`/`env` value was carried forward unchanged. |
| Ask before continuing past the bounded "install extension" instruction into full live verification | Designing which MCP tools are exposed by default to a coding agent is real security-policy work with a meaningfully larger blast radius than an install command; a brief confirmation was cheap relative to silently expanding scope. |
| Do not attempt to wire `--exclude-tools` into `dispatch-model.cjs`'s `cli-pi` case in this phase | That is dispatch-code, owned by phase 002/009 (mirrors how phase 011 deferred an analogous change). This phase's job is confirming and designing the enforcement mechanism, not wiring it into the orchestrator. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `pi install npm:pi-mcp-extension -l --approve` | PASS — exit 0, 94 packages, `.pi/settings.json` written |
| Single-entry `sequential_thinking` stdio probe | PASS — `mcp_sequential_thinking_sequentialthinking` appeared in a live `pi --offline --approve -p "list your available tools"` run |
| 5-entry `.pi/mcp.json` live probe | PARTIAL — `sequential_thinking` + `mk-spec-memory` connected; `mk_code_index` failed (diagnosed: missing `typescript/bin/tsc` in this worktree, confirmed present in main tree); `mk_skill_advisor`/`code_mode` correctly stayed disconnected (Tier 2, lazy by design) |
| Direct launcher invocation of `mk_skill_advisor`/`code_mode` (bypassing lazy, for completeness) | Both hit the same class of missing-build-artifact gap as `mk_code_index`, confirming the root cause is worktree-wide, not `mk_code_index`-specific |
| `pi-mcp-extension`'s own bundled `README.md` (direct read) | CONFIRMED no per-tool permission field exists in its documented config schema |
| `pi --help` | CONFIRMED `--tools`/`-t` and `--exclude-tools`/`-xt` apply to "built-in, extension, and custom tools" |
| `git status --porcelain` scope check | PASS — exactly `.pi/mcp.json`, `.pi/settings.json`, `.pi/npm/.gitignore` (new) plus this phase's own spec-folder docs; no other repository file touched |
| `validate.sh --strict` against this phase folder | Run at commit time via the main-tree round-trip pattern (worktree lacks the toolchain); result recorded in the commit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **3 of 5 servers do not connect in THIS bare worktree** (`mk_code_index`, `mk_skill_advisor`, `code_mode`), each due to a missing built dependency confirmed present at the identical path in the main tree. The `.pi/mcp.json` config itself required zero schema translation beyond `transport`/`lifecycle` — re-verification from a fully-provisioned environment (main tree, or the launch-wrapper's symlinked worktree) is recommended before treating a future non-connection as a real regression rather than this same, already-known gap.
2. **No full end-to-end tool CALL was observed**, only tool discovery/registration. This machine has no provider API key configured (the same limitation phase 001 first documented), so no live LLM turn ever decided to invoke `mcp_sequential_thinking_sequentialthinking` or any `mk-spec-memory` tool — discovery and registration are strong evidence of callability, not a substitute for it.
3. **`--exclude-tools` is not yet wired into any actual orchestrated dispatch.** This phase confirms and documents the mechanism; actually passing it at `cli-pi` dispatch time is future dispatch-code work (phase 002/009's scope).
4. **The installed `pi-mcp-extension` version is not pinned to an exact semver** in `.pi/settings.json` — Pi's own install verb did not expose a version-pin flag observed this pass; a version-drift risk (already named in `spec.md`'s risk log) remains open.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
