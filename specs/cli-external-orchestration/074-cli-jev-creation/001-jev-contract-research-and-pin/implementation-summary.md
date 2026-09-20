---
title: "Implementation Summary"
description: "The jev 0.6.2 contract is pinned against the live binary and the vendored source: subcommands, flags, exit taxonomy, provider table and the MCP tool surface, each claim tagged source-read or live-verified, with the unauthenticated paths proven and the authenticated ones recorded as unconfirmed."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/074-cli-jev-creation/001-jev-contract-research-and-pin"
    last_updated_at: "2026-09-20T10:00:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Pinned the jev 0.6.2 CLI and jev-mcp contract from source plus a live binary"
    next_safe_action: "Run one authenticated jev auth test with a real key to settle the unconfirmed response body"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-jev/references/cli-reference.md"
      - ".skilled/skills/cli-external-orchestration/cli-jev/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-001-jev-contract-research-and-pin"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "The live response body of the official, vercel and openrouter providers, and the currency of their pinned default model ids (needs a provider credential)"
    answered_questions:
      - "Does the CLI enforce the choice and score cardinality the MCP server enforces? No: it sends a single-option request, and the refusal only exists in jev-mcp and in this packet's guard"
      - "Can the operator's LLM Gateway key front jev through --provider custom? No, not without a translating proxy: the payload and answer path are the native System One contract, and the bearer variable is JEV_API_KEY"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-jev-contract-research-and-pin |
| **Completed** | 2026-09-20 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The jev contract this hub dispatches against, pinned from both directions: the vendored 0.6.2 source tree the plan carries as context, and a live 0.6.2 binary installed with `uv tool install jev-cli`. Every claim in the packet's references is tagged, so a later reader can tell a source read from a live probe without re-running anything.

### Phase 1: jev contract research and pin

Three probe artifacts and two transcribed references. The probes answer the questions the packet's hard rules depend on: which flags exist, what the exit codes mean, where the credential is read from, and whether the CLI enforces the cardinality the MCP server enforces. The references turn the answers into the contract the packet documents.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/probe-surface.sh` | Created | Source map of the vendored tree plus the help, version and auth-status probe |
| `scratch/probe-surface.txt` | Created | Captured output of every surface probe, with exit status |
| `scratch/probe-matrix.sh` | Created | The exit-code matrix: missing flags, unknown subcommand, bad state, bad provider, custom endpoint with and without a key, and the sentinel-key negative control |
| `scratch/probe-matrix.txt` | Created | Captured matrix output, command by command |
| `scratch/mcp-probe.py` | Created | A stdio client that initializes `jev-mcp`, lists its tools and exits without calling one |
| `cli-jev/references/cli-reference.md` | Created downstream | Subcommands, shared flags, state forms, question shapes, exit taxonomy, auth commands |
| `cli-jev/references/providers-and-models.md` | Created downstream | Provider table, key resolution order, per-provider translation, the gateway-key answer |
| `cli-jev/references/mcp-server.md` | Created downstream | The four-tool surface, verbatim state handling, the operator wiring block |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read the source first, then probe the binary, then write down only what survived both. The vendored tree gave the request and answer contract, the exit-code map and the provider table; the binary gave the resolved flag surface, the parse-time failures and the credential ordering. Claims that only the source supports are marked as such, and the one question neither could settle without a key is recorded as unconfirmed instead of asserted.

The negative control mattered more than the positive probes here. With every provider key cleared, `jev noul` exits 3 before any connection is attempted, which proves the credential check precedes the call and tells a dispatcher that an exit 3 means nothing was billed. A second control with a sentinel key pointed at `http://127.0.0.1:9` produced the exit-4 connection failure and a stderr payload that carried no part of the key, which is what the no-inline-credential rule is written against.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Pin the vendored version, not the newest release.** `uv tool install jev-cli` resolved to 0.6.2, the same version the plan vendored, so the packet's references describe one version rather than a range.
- **Install for real rather than reading only.** The plan's rollback sentence (`uv tool uninstall jev-cli`) makes the install reversible, and a flag surface read from argparse is not the same as a parse that refuses your command.
- **Keep the probe matrix unauthenticated.** No provider credential exists in this workspace, and a live external judgment call would have spent quota to confirm a response shape the source already fixes. The one derived claim — that a gateway key cannot front jev without a translating proxy — is labelled derived rather than tested.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `jev --version` | `jev 0.6.2`, exit 0 |
| Six subcommands listed in help | Present, exit 0 |
| Exit-code matrix, 12 commands | Each matched the source-read mapping |
| Credential-free `noul` probe | Exit 3, stdout empty, one JSON object on stderr |
| Negative control with a sentinel key | Exit 4, connection refused, no key material in stderr |
| MCP handshake and tool list | Four tools with the documented required argument sets |
| Negative control (sentinel key, unreachable endpoint) | Exit 4, connection refused, transcript redacts the key and reports the sentinel absent |
| `node .skilled/commands/doctor/scripts/parent-skill-check.cjs` | Not applicable to this phase; run in phase 003 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **No authenticated probe.** The live response body, the currency of the pinned default model ids and any quota or latency figure remain unconfirmed. One `jev auth test` with a real key settles the first two.
- **The gateway proxy was never built or tested.** The packet documents that the operator's gateway key cannot front jev without one; it does not ship one, and it does not claim one exists.
- **The vendored test suite was read, not run.** `tests/test_jev.py` and `tests/test_mcp_server.py` corroborate the contract but were not executed in this phase, so they are evidence about the contract rather than verification of this packet.
- **`--endpoint` is hidden from help.** It was discovered in the source and confirmed live, which is why the reference documents it as real but unadvertised rather than treating the help text as the complete flag surface.
<!-- /ANCHOR:limitations -->
