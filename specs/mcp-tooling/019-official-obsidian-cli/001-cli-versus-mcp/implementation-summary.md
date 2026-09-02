---
title: "Implementation Summary"
description: "What the CLI-versus-MCP measurement produced: a new skill reference that sets a default, four corrected documents, and the evidence that decided it."
trigger_phrases:
  - "cli versus mcp summary"
  - "obsidian default surface result"
  - "surface comparison outcome"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/019-official-obsidian-cli/001-cli-versus-mcp"
    last_updated_at: "2026-09-02T18:51:34Z"
    last_updated_by: "implementer"
    recent_action: "Measured both Obsidian app-backed surfaces live and wrote references/cli-versus-mcp.md"
    next_safe_action: "Apply the prepared SKILL.md text from spec.md section 13"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-obsidian/references/cli-versus-mcp.md"
      - ".opencode/skills/mcp-tooling/mcp-obsidian/README.md"
      - ".opencode/skills/mcp-tooling/leaf-manifest.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-cli-versus-mcp"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Where obsidian delete without permanent puts the file"
      - "Why obsidian_list_notes reports Not found for an empty directory"
    answered_questions:
      - "Which app-backed surface should an agent default to: the official CLI"
      - "How many tools the MCP server exposes: 12 of 14 built"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-cli-versus-mcp |
| **Completed** | 2026-09-02 |
| **Level** | 3 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The skill now names one app-backed surface as its default, and the name is backed by measurement rather than by prose. Both surfaces were driven against the operator's live vault in both app states, and the result is `.opencode/skills/mcp-tooling/mcp-obsidian/references/cli-versus-mcp.md`: a 24-row capability table where every cell traces to a command that was run and read. Three of the skill's own claims about the MCP server turned out to be wrong and are now corrected.

### The measured comparison

You get an answer instead of a choice. The official `obsidian` CLI is the default because it needs only the running app, exposes 106 commands against the MCP server's 12, and answers in about 38 ms per call. The MCP server needs the Local REST API plugin enabled on top of that, and in this vault the plugin was **disabled**, so every MCP call failed with `fetch failed` until it was switched on for the measurement and switched back afterwards.

The reference also tells you when to leave the default. Four capabilities exist only on the MCP side: in-place section patching (`obsidian_patch_note`), in-note search-and-replace (`obsidian_replace_in_note`), tag writes as a real YAML list (`obsidian_manage_tags`, which the CLI cannot do at all), and JSON-typed frontmatter values. Past roughly 21 calls a warm MCP session also wins on time, at 3 ms per call against 38.

Two hazards the measurement turned up are now written into the CLI's own contract. A bare `obsidian read` returned **38176 bytes** of the operator's open note, and `obsidian daily:read` **creates** today's daily note as a side effect, which was isolated and reproduced.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/cli-versus-mcp.md` | Created | The measured comparison, the default, and the unknowns |
| `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` | Modified | Router, when-to-use and FAQ state the default without hedging |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/mcp-tools.md` | Modified | 12 exposed of 14 built, v0.12.3, the specialist role, an enabled-plugin preflight |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/obsidian-cli-commands.md` | Modified | Profile selection names the default, the tag write-gap is recorded |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md` | Modified | Surface selection, the `daily:read` hazard as invariant 3, two settled unknowns |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md` | Modified | Scenario objectives the measurement changed |
| `.opencode/skills/mcp-tooling/leaf-manifest.json` | Modified | Indexes the new reference |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Everything was measured live, never inferred. Each CLI invocation ran through `scratch/runt.sh`, which writes stdout, stderr, exit status and elapsed time to four separate files. No measurement passes through a pipe, because once the app is up the CLI exits 0 on failure and the status carries no information. The MCP server was driven by two stdio JSON-RPC clients: `mcpcall.cjs` for cold cost and the app-down failure shape, `mcpseq.cjs` for warm per-call latency in one long session.

The app was found closed. The app-closed matrix ran first, ten CLI commands across every family, all exit 1 on stderr, with `pgrep` confirming afterwards that the CLI had not launched anything. Then Obsidian was opened, the plugin enabled, the full matrix and the benchmarks run, the plugin disabled again and the app quit.

Vault safety held throughout: every mutating call named its target, only scratch notes were created, and the markdown and total file counts match the baseline exactly at 234 and 1582.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The official CLI is the default app-backed surface | It needs only the app, covers 106 commands against 12 tools, and was the only one of the two that worked in this vault as configured |
| The MCP server keeps a specialist role rather than being dropped | It owns four capabilities the CLI has no command for, and it wins on latency past roughly 21 calls |
| Enable the REST plugin for the run, then restore it | Measuring the MCP surface was impossible otherwise. Rollback is one command, and the as-found failure was captured before enabling |
| `SKILL.md` was not edited | It is a compiled-policy input. The replacement text sits in `spec.md` §13 for whoever owns the recompile |
| `notesmd-cli` was not re-measured | Out of scope. Its position as the headless default is unchanged |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate_document.py` on all 7 written or edited files | PASS. Exit 0 each. `mcp-tools.md` also moved from 2 pre-existing header errors to 0 |
| `hvr_scan.py` on the new reference | PASS. 0 hard blockers, ceiling 98/100 |
| `hvr_scan.py` on edited files, against baseline | PASS. `mcp-tools.md` 33→27, `obsidian-cli-commands.md` 25→24, `official-cli-agent-usage.md` 0→0, `README.md` 8→8, playbook 45→44. Nothing added |
| `generate-leaf-manifest.cjs --check .opencode/skills/mcp-tooling` | PASS. `leaf-manifest.json OK` after `--write` |
| Live measurement | PASS. 106 CLI commands enumerated, roughly 60 CLI invocations, 37 MCP tool calls, both app states |
| Vault restoration | PASS. 234 markdown and 1582 files before and after. `find <vault> -name 'zz*'` returns nothing |
| App and plugin restoration | PASS. `obsidian plugin id=obsidian-local-rest-api` reports `enabled false`. `pgrep -x Obsidian` returns nothing |
| `validate.sh specs/mcp-tooling/019-official-obsidian-cli --strict --recursive` | PASS. `RESULT: PASSED` for both folders with rule lines visible |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`SKILL.md` still carries the stale MCP version and tool count.** It is a compiled-policy input and was deliberately not edited. The replacement text for both lines is in `spec.md` §13.
2. **`INSTALL-GUIDE.md` also repeats `obsidian-mcp-server@3.2.9` and the five-confirmed-names framing.** Adjacent to this scope and left alone. Three occurrences at lines 3, 64 and 94, plus line 238.
3. **The MCP measurement required enabling a plugin the operator keeps off.** The comparison therefore describes what the MCP server can do, not what it does in this vault today. As configured, it does nothing.
4. **Three behaviors were not exercised because they write to the operator's vault outside a scratch note:** `daily:append`, `daily:prepend`, and a bare mutating command with no target. Whether the daily-note writers also create the note when it is absent is untested.
5. **Where `delete` without `permanent` puts the file is unresolved.** It reported `Moved to trash` and the file was in neither `<vault>/.trash` nor `~/.Trash`. The vault count is back to baseline, so it left the vault.
6. **A concurrent session shares this checkout and interfered twice.** It moved `HEAD` from `18b8f9390a` to `4493f12f99` mid-run, which reverted every uncommitted edit to the six tracked skill files. They were re-applied and re-staged. Its commit `08eb67a0de` also swept this packet's staged scaffold into itself, so the empty templates are committed under another session's message while the authored content sits staged. Nothing was rewound to fix that, because rewriting shared history was not authorized.
7. **`scratch/` is not git-ignored in this repository**, contrary to the scaffold's own note. The 130 evidence files were explicitly unstaged and remain untracked on disk.
8. **The two documentation validators contradict each other on spec-folder docs.** `sk-doc`'s `validate_document.py` classifies a spec doc as a readme and reports `general_no_anchor` plus `missing_required_section: overview`, while the authoritative spec-kit gate `validate.sh` passes the same files with `ANCHORS_VALID: Anchors well formed in 5 file(s)`. Removing the anchors to satisfy the first would fail the second. Confirmed as pre-existing rather than introduced here: `specs/mcp-tooling/013-mcp-obsidian/spec.md` and this packet's own untouched parent `spec.md` and `plan.md` fail with the identical two rules. The five child docs therefore pass `validate.sh --strict` and are left failing `validate_document.py` on those two rules alone.
<!-- /ANCHOR:limitations -->

---


