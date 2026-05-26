---
title: "Resource Map: spec_kit_memory → mk-spec-memory Rename"
description: "Deep-dive resource map enumerating every file affected by the spec-kit-memory MCP namespace rename. Authoritative scope reference for the 017 execution dispatch."
trigger_phrases:
  - "017 resource map"
  - "spec-kit-memory rename inventory"
  - "mk-spec-memory file inventory"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/052-mk-spec-memory-rename"
    last_updated_at: "2026-05-14T23:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored resource map for the rename operation"
    next_safe_action: "Execution complete; map serves as audit reference"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:c6e141c0915543752027bb8c892afbbe8ada0d17a6ab9d76a0c3622aef4c3cda"
      session_id: "main-2026-05-14-mk-spec-memory-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Resource Map: `spec_kit_memory` → `mk-spec-memory`

> **Built by main-agent deep-dive on 2026-05-14T23:30Z**, then revised as the authoritative manifest after execution completed on 2026-05-14T23:48Z. Original 027/001 spec identified 166 raw occurrences; this map narrows to operational-vs-historical buckets that match what was actually changed.

---

## Methodology

Three grep patterns to inventory:

1. `spec_kit_memory` / `spec-kit-memory` (any form — broadest)
2. `mcp__spec_kit_memory__` (literal MCP namespace prefix)
3. `"spec_kit_memory"` / `[mcp_servers.spec_kit_memory]` (config server keys)

Source roots: `.opencode/`, `.claude/`, `.codex/`, `.gemini/`, repo root. Excluded: `.git`, `node_modules`, `dist`, `z_archive`.

---

## Layer 1 — Runtime configs (6 files, server key renamed)

| File | Old key | New key |
|------|---------|---------|
| `opencode.json` | `"spec_kit_memory"` | `"mk-spec-memory"` |
| `.claude/mcp.json` | `"spec_kit_memory"` | `"mk-spec-memory"` |
| `.codex/config.toml` | `[mcp_servers.spec_kit_memory]` | `[mcp_servers."mk-spec-memory"]` (TOML quotes required for hyphen) |
| `.gemini/settings.json` | `"spec_kit_memory"` | `"mk-spec-memory"` |
| `.mcp.json` | `"spec_kit_memory"` / direct server entry | `"mk-spec-memory"` with `.opencode/bin/mk-spec-memory-launcher.cjs` |
| `.vscode/mcp.json` | `"spec_kit_memory"` / direct-to-dist server entry | `"mk-spec-memory"` with `.opencode/bin/mk-spec-memory-launcher.cjs` |

The Gemini change is the load-bearing one — Gemini's policy parser splits on `mcp_` and treats underscores in server names as policy-ambiguous.

---

## Layer 2 — MCP namespace prefix references (`mcp__spec_kit_memory__*`)

**Total references at start: ~151.** Triage:

### Operational (~61 files — UPDATED)

Replacement: `mcp__spec_kit_memory__` → `mcp__mk_spec_memory__`.

Includes:
- Top-level docs: `CLAUDE.md`, `AGENTS.md`, `README.md` (already clean in this repo; no hits)
- Source TypeScript: `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts`
- YAML workflow files: `.opencode/commands/doctor/_routes.yaml`, the four `spec_kit_deep-{research,review}_{auto,confirm}.yaml` assets
- Active non-spec markdown across `.opencode/skills/`, `.opencode/commands/`, `.opencode/agents/`

### Historical (~90 files — PRESERVED)

Spec packet `.md` docs under `.opencode/specs/` retain `mcp__spec_kit_memory__*` as evidence of pre-rename state. Same precedent as the mk-code-index rename retained `mcp__system_code_graph__*` in 007/010/014/018/020 packet docs. The audit split is approximately 61 operational files changed plus 90 historical files preserved.

---

## Layer 3 — Tool-name prefix variants (Gemini policy)

When Gemini-mode runtimes invoke tools, the fully qualified prefix becomes `mcp_mk-spec-memory_<tool>` (hyphenated). Claude/Codex/OpenCode prefix becomes `mcp__mk_spec_memory__<tool>` (the MCP namespace convention auto-converts `-` → `_`).

Operational sweeps targeted `mcp__spec_kit_memory__` → `mcp__mk_spec_memory__` (the dominant Claude-style form). Gemini-style references are rare.

---

## Layer 4 — Raw tool names (UNCHANGED)

Per 027/001 spec REQ-002: raw tool names stay byte-for-byte identical. The 41 tools advertised by the renamed server keep their names: `memory_context`, `memory_search`, `memory_quick_search`, `memory_match_triggers`, `memory_save`, `memory_index_scan`, `memory_health`, `memory_list`, `memory_delete`, `memory_bulk_delete`, `memory_update`, `memory_validate`, `memory_get_learning_history`, `memory_causal_link`, `memory_causal_unlink`, `memory_causal_stats`, `memory_drift_why`, `memory_retention_sweep`, `memory_stats`, `memory_ingest_start`, `memory_ingest_status`, `memory_ingest_cancel`, `session_bootstrap`, `session_resume`, `session_health`, `task_preflight`, `task_postflight`, `checkpoint_create`, `checkpoint_list`, `checkpoint_restore`, `checkpoint_delete`, `detect_changes`, `eval_run_ablation`, `eval_reporting_dashboard`, `council_graph_query`, `council_graph_status`, `council_graph_upsert`, `council_graph_convergence`, `deep_loop_graph_query`, `deep_loop_graph_status`, `deep_loop_graph_upsert`, `deep_loop_graph_convergence`.

Only the server-name prefix changes.

---

## Layer 5 — Live MCP server source code (`mcp_server/context-server.ts`)

Line 894: `new Server({ name: 'mk-spec-memory', version: '1.7.2' }, ...)`. Build pipeline (`npm run build`) compiles to `dist/context-server.js`. Post-rename probe (JSON-RPC `initialize`) returns `serverInfo.name = "mk-spec-memory"`.

---

## Layer 6 — Launcher binary

- `.opencode/bin/spec-kit-memory-launcher.cjs` → `.opencode/bin/mk-spec-memory-launcher.cjs` (git mv)
- Internal stderr prefix: `[spec-kit-memory-launcher]` → `[mk-spec-memory-launcher]`
- State file paths: `.spec-kit-memory-launcher.{json,lockdir}` → `.mk-spec-memory-launcher.{json,lockdir}`
- Runtime configs updated to call the renamed binary

Mirrors the mk-code-index Option A precedent from packet 010.

---

## Layer 7 — Internal alias paths

- Save-lock mutex tmpdir prefix: `os.tmpdir() / 'spec-kit-memory-save-locks'` → `os.tmpdir() / 'mk-spec-memory-save-locks'` (`mcp_server/handlers/save/spec-folder-mutex.ts`)
- Matching test fixture: `handler-memory-save.vitest.ts` uses the renamed lock-root substring
- Gemini launcher script: `.gemini/scripts/spec-kit-memory.sh` → `.gemini/scripts/mk-spec-memory.sh` (git mv)

---

## Layer 8 — Substrate stress harness + sandbox runner

`mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs` and `_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs` both:
- Parse `mcp__([A-Za-z0-9_]+)__([A-Za-z0-9_]+)` from playbook markdown; `match[2]` returns the underscore form `mk_spec_memory`
- `selectClientForServer` now accepts both `'mk_spec_memory'` and `'mk-spec-memory'`, mapping to `clients.mk_spec_memory` (preferred underscore-key JS identifier) with hyphen-key and `clients.memory` fallbacks
- Connection setup updated: `name: 'mk-spec-memory'` and `args: ['.opencode/bin/mk-spec-memory-launcher.cjs']`
- `clients` and `toolNameSets` dicts use underscore JS-identifier keys `mk_spec_memory: ...`

Companion vitest `shared-daemon-runner-helpers.vitest.ts` rewritten to use underscore-form dict keys for valid JS object shorthand.

---

## Execution order (as executed)

1. ✅ Source code: `context-server.ts:894` updated to `name: 'mk-spec-memory'` and dist rebuilt
2. ✅ Launcher binary renamed (Option A, mirrors mk-code-index)
3. ✅ 4 runtime configs updated (server key + command path)
4. ✅ 61 operational files swept (`mcp__spec_kit_memory__` → `mcp__mk_spec_memory__`)
5. ✅ Server-name string updates in docs (~14 files): `spec-kit-memory` / `spec_kit_memory` → `mk-spec-memory` / `mk_spec_memory_*` in `_routes.yaml`, doctor commands, install guides, feature-catalog, deep-research/review YAMLs, gemini agents/scripts/commands, etc.
6. ✅ Substrate harness + sandbox runner internal aliases fixed (8 edits across 2 files)
7. ✅ Vitest helper file rewritten for valid JS shorthand with underscore keys
8. ✅ Smoke probe via JSON-RPC: `serverInfo.name = "mk-spec-memory"`, tools count = 41, `memory_context` and `memory_search` present
9. ✅ Historical spec packet docs preserved (no `.opencode/specs/**/*.md` edited — 90+ files retain the audit trail)

---

## Out of scope (intentionally preserved)

- `.opencode/specs/**/*.md` historical packet docs (audit trail, 90+ files)
- `tool-schemas.ts:69` referencing historical packet name `"011-spec-kit-memory-upgrade"` (packet history is immutable)
- `.opencode/install_guides/README.md:189` "Spec Kit Memory" prose brand-name (human-readable; section anchor unchanged)
- `.opencode/skills/sk-doc/assets/readme/install_guide_template.md:360` `❌ spec-kit-memory-install.md (wrong format)` (anti-pattern example, not a server reference)
- `/changelog/` directories (immutable release history)
- `_sandbox/.../evidence/` (immutable test evidence)
- Raw tool names (REQ-002 in 027/001 spec)
- Other MCP server names (`cocoindex_code`, `sequential_thinking`, `code_mode`, `system_skill_advisor`, `mk_code_index`)
- Backward-compatible shim for the old server key (no transition window — full cutover)
- External documentation (Linear, Notion, archived chat transcripts)

---

## Cross-reference

- **Closest precedent**: packet 016 `runtime-config-mk-code-index-parity-plus-findings` (sibling under 026) — same runtime-config parity for mk-code-index after its rename in 010
- **Origin**: was `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-rename-mcp-namespace-mk-spec-memory/`; moved to `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/052-mk-spec-memory-rename/` per operator directive on 2026-05-14
- **Spec details**: see this packet's `spec.md` (carried from 027/001)
