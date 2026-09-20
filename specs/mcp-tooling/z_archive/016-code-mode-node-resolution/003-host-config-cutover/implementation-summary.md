---
title: "Implementation Summary"
description: "All six code_mode registrations now launch through the resolver-backed shim; the two other absolute paths were kept after execution proved one of them load-bearing."
trigger_phrases:
  - "mcp cutover summary"
  - "host config cutover shipped"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/016-code-mode-node-resolution/003-host-config-cutover"
    last_updated_at: "2026-08-29T10:02:02Z"
    last_updated_by: "session"
    recent_action: "Cut code_mode over to the launcher"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - ".claude/mcp.json"
      - ".cursor/mcp.json"
      - ".pi/mcp.json"
      - "opencode.json"
      - ".codex/config.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 3 of 5 |
| **Status** | Complete |
| **Completed** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Executor** | gpt-5.6-luna, xhigh reasoning, fast tier, plus orchestrator edits where the executor's sandbox refused to write |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every code_mode registration now names `node` and the launcher instead of an interpreter path. The host starts a launcher that resolves the required interpreter itself, so the requirement travels with the server package rather than with one machine.

Five of the six were reachable as four files, because `.mcp.json` is a symlink to `.claude/mcp.json`. The sixth lives in the Codex configuration, which the executor's sandbox refused to write; the orchestrator applied it.

The second intended change did not ship. Two Codex registrations name absolute interpreters for the memory and advisor servers, and the phase assumed both were accretion because the same servers are declared as `node` elsewhere. Execution disproved that for the advisor, so both were left as they were.

### Files Changed

| File | Change |
|------|--------|
| `.claude/mcp.json` | code_mode launches through the launcher (also serves `.mcp.json`, a symlink to it) |
| `.cursor/mcp.json` | code_mode launches through the launcher |
| `.pi/mcp.json` | code_mode launches through the launcher |
| `opencode.json` | code_mode launches through the launcher |
| `.codex/config.toml` | code_mode launches through the launcher; its comment now records the constraint and where the range is read from |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dispatched to the external executor with the pre-change state of all nineteen registrations inlined as its baseline and the rollback recorded first, since this was the first phase whose effect is live. The executor returned BLOCKED rather than claiming completion: it had applied four files and been denied write access to the Codex configuration by its sandbox. The orchestrator finished that file and then verified every registration itself.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Keep the advisor's absolute interpreter.** Started under the search-path interpreter its launcher aborts in `dlopen`; under the Homebrew interpreter it reaches its database and embedder. The Codex file already carried a comment saying to keep that runtime aligned with the installed addon ABI, and the comment was correct.
- **Keep the memory server's absolute interpreter too.** Its own A/B was inconclusive — both interpreters failed identically on an unrelated daemon socket, so neither reached the native module. Changing a shared native dependency's launch path on inconclusive evidence, while another workstream is actively rebuilding that dependency, is not a portability improvement.
- **Amend the phase rather than force its original wording.** The requirement now asks that a retained absolute path be one execution proved load-bearing, which is what the evidence supports.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| All six files parse | Five as JSON, one as TOML, all clean |
| code_mode registrations | 6 of 6 name `node` and the launcher; none names an absolute interpreter |
| code_mode starts | Answers initialize with `serverInfo {"name":"CodeMode-MCP","version":"1.0.0"}` |
| Advisor under its retained interpreter | Reaches its database and its embedder |
| Workspace node gate | 75 files, 762 pass, 0 fail |
| Operator's live servers | Three long-running code_mode processes unchanged throughout |

The disproving evidence is worth keeping: under the search-path interpreter the advisor launcher reports its addon "was compiled against a different Node.js version", naming a `NODE_MODULE_VERSION` its interpreter does not provide. A later direct probe of the same addon file reported it loading under every interpreter, which contradicts the launcher result — the dependency is being rebuilt by concurrent work, so its satisfying interpreter is moving. That is itself a reason not to change its launch path in this phase.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Two absolute interpreter paths remain in the Codex configuration. The advisor's is proven necessary today; the memory server's is unproven in both directions and was left alone rather than changed on an inconclusive test.
- Verification exercised each server through its configured command directly. The hosts themselves were not restarted, so attachment is proven at the command level rather than through a live host handshake.
- `.mcp.json` being a symlink means four files cover five registrations. A future contributor editing `.mcp.json` expecting an independent file would be surprised.
<!-- /ANCHOR:limitations -->

---
