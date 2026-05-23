# Iteration 008 — Track 3: Punctuation Hard Blockers

## Em Dash (—) — 4 findings

| Line | Context | Classification |
|------|---------|----------------|
| 1164 | Run `/doctor` with no target to see the interactive menu — upgrade users see "Update everything to match latest release" as option 1. | **BANNED** (prose) |
| 1176 | - `install` — fresh install or reinstall of the native MCP servers from their install guides; handles old-conflicting-with-new (clean reinstall with venv/node_modules removal) | **BANNED** (prose in description list) |
| 1177 | - `debug` — diagnoses the native MCP servers (Spec Kit Memory, System Skill Advisor, System Code Graph, CocoIndex Code, Code Mode, Sequential Thinking) with PASS/WARN/FAIL per check; supports `--fix` for guided repair | **BANNED** (prose in description list) |
| 1186 | The 10 underlying YAML workflows in `.opencode/commands/doctor/assets/` are self-sufficient — each declares its own `role/purpose/action/operating_mode/invariants/upstream_assets/user_inputs/field_handling` block plus phased execution. | **BANNED** (prose) |

## Semicolon (;) — 100+ findings (sample)

| Line | Context | Classification |
|------|---------|----------------|
| 159 | # Apple Silicon Metal GPU acceleration is used when available; CPU fallback otherwise. | **BANNED** (prose in bash comment) |
| 288 | Run with `--verbose` to see details behind each rule or `--recursive` to validate a parent and all child phase folders. Strict validation of a Level 3 packet runs in ~108 ms via a single-orchestrator design. The default scaffold path skips post-create validation; set `SPECKIT_POST_VALIDATE=1` to enable it for strict CI workflows. | **BANNED** (prose) |
| 372 | `/memory:save` refreshes packet metadata on every invocation, and `session_resume` binds `args.sessionId` to transport caller context by default; set `MCP_SESSION_RESUME_AUTH_MODE=permissive` for rollout canaries. | **BANNED** (prose) |
| 375 | Expired ephemeral rows are cleaned by a retention sweep on startup and hourly by default; use `memory_retention_sweep` for manual or dry-run cleanup. | **BANNED** (prose) |
| 394 | | **L8** | Moved Surfaces | 0 | - | Code graph lives in `mk_code_index`; advisor and skill graph live in `mk_skill_advisor` | | **BANNED** (prose in table) |
| 420-422 | - **Fusion** - RRF-based scoring with post-fusion signals such as co-activation, FSRS decay, interference control, intent weights, and graph/session boosts when enabled. <br> - **Rerank** - Cross-encoder reranking with chunk reassembly, a minimum Stage 3 gate of 4 candidates, and compatibility-only length-penalty wiring that resolves to a neutral `1.0` multiplier. `getRerankerStatus()` exposes latency plus cache hits, misses, stale hits, and evictions; if the reranker is unavailable, Stage 2 order is preserved with degraded metadata. | **BANNED** (prose) |
| 428 | - **Intent classification** - 7 public types (`add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision`) plus an internal continuity profile for resume-oriented retrieval (`semantic 0.52`, `keyword 0.18`, `recency 0.07`, `graph 0.23`; Stage 3 MMR lambda `0.65`) | **BANNED** (prose) |
| 541-542 | - **llama-cpp** - Auto when GGUF runtime is installed. Free, local, 768d Q8_0 GGUF; Apple Silicon Metal GPU acceleration when available, CPU fallback otherwise. <br> - **HuggingFace Local** - Final fallback when llama-cpp runtime is unavailable. Free, local, 768d q8 ONNX. | **BANNED** (prose) |
| 588 | Our CocoIndex is forked. The Python wrapper that powers semantic search is a soft-fork at version `0.2.3+spec-kit-fork.0.2.0`, vendored alongside the skill so it ships with this repo; the Rust engine underneath stays on PyPI. | **BANNED** (prose) |
| 595 | **Startup injection.** When the MCP server starts, it initializes the `code-graph.sqlite` database, runs a non-blocking startup scan, and activates a file watcher. All four supported runtimes (Claude Code, Gemini CLI, GitHub Copilot, Codex CLI) transport the same compact startup shared-payload through their runtime hooks (`session-prime.ts` on Claude/Gemini/Copilot, `session-start.ts` on Codex). | **BANNED** (prose) |
| 607-609 | `code_graph_query` and `code_graph_context` share a readiness-aware response contract. When the graph is fresh enough, both return `status: "ok"` with resolved results plus a `readiness` / `canonicalReadiness` / `trustState` block. When readiness requires a full scan that cannot run inline, both return an explicit **`status: "blocked"`** payload naming `requiredAction: "code_graph_scan"`, `blockReason: "full_scan_required"`, `degraded`, and `graphAnswersOmitted` instead of silently returning empty results. | **BANNED** (prose) |
| 629 | `detect_changes` is a read-only Code Graph tool that takes a diff and tells you which symbols and files it touches. It runs alongside `code_graph_scan`, `code_graph_query`, `code_graph_status`, and `code_graph_context`. | **BANNED** (prose) |

*Note: 100+ total semicolon matches found. Sample above shows representative prose violations. No legitimate bash flag separators found.*

## Oxford Comma (, and / , or) — 79 findings (sample)

| Line | Context | Classification |
|------|---------|----------------|
| 7 | > Multi-agent AI development framework with cognitive memory, structured documentation, 11 agents, 20 skills, 22 command entry points, and standalone MCP servers for memory, skill routing, structural code graph, semantic code search, code mode and sequential thinking - built for OpenCode, Codex CLI, Claude Code, Gemini CLI, with Copilot support for MCP and startup-surface workflows. | **BANNED** (prose in blockquote) |
| 55 | | **🎯 20 Skills** | Code, docs, git, prompts, MCP, research, review, council, improvement, cross-AI, and standalone system packages | | **BANNED** (prose in table) |
| 112 | Recent 038/039 work also tightened the public surface without turning this README into a changelog: [038 CocoIndex feature catalog](.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/038-coco-index-feature-catalog/) added a canonical mcp-coco-index feature inventory, [039 stress-test expansion](.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/039-stress-test-expansion-and-alignment/) aligned stress coverage, and the local llama-cpp [038](.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/038-embedding-error-propagation/) / [039](.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/039-token-aware-chunking/) packets hardened embedding failure reporting and token-aware truncation. | **BANNED** (prose) |
| 246 | `resource-map.md` is optional at any level. Render it from `.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl` when a packet wants a lean, central listing of the files, scripts, and external resources it interacts with. | **BANNED** (prose) |
| 370 | The Memory Engine is a local-first cognitive memory system built as an MCP server. `generate-context.js` updates canonical packet continuity and may emit supporting generated context artifacts inside the spec folder. Canonical continuity lives in the spec packet itself: use `/spec_kit:resume` as the recovery surface, then rebuild context in this order: `handover.md` -> `_memory.continuity` -> canonical spec docs. The MCP server indexes those packet-local sources with vector embeddings, BM25 and FTS5 full-text search, and `memory_match_triggers()` can still surface relevant prior context automatically when deeper retrieval is needed. | **BANNED** (prose) |
| 387-389 | | **L1** | Orchestration | 3 | 2,000 | Unified context, resume, and bootstrap entry points | <br> | **L2** | Core | 3 | 1,500 | Search, trigger matching, save | <br> | **L3** | Discovery | 4 | 800 | List, stats, health checks, and session readiness | | **BANNED** (prose in table) |
| 420-422 | - **Candidate generation** - Parallel retrieval from the active channels plus constitutional injection where applicable. <br> - **Fusion** - RRF-based scoring with post-fusion signals such as co-activation, FSRS decay, interference control, intent weights, and graph/session boosts when enabled. <br> - **Rerank** - Cross-encoder reranking with chunk reassembly, a minimum Stage 3 gate of 4 candidates, and compatibility-only length-penalty wiring that resolves to a neutral `1.0` multiplier. | **BANNED** (prose) |
| 472 | If the database is unreachable the formatter quietly skips badges instead of failing. Caller-provided badges pass through untouched, and every response profile (`quick`, `research`, `resume`) keeps the badges on the top result and the result list. | **BANNED** (prose) |
| 552 | The intended routing order is graph-first: the code graph resolves structural queries first, CocoIndex finds semantic candidates when structural resolution misses, and Memory supports session decisions and active-task context after the packet-local recovery sources have been checked. | **BANNED** (prose) |
| 588 | Our CocoIndex is forked. The Python wrapper that powers semantic search is a soft-fork at version `0.2.3+spec-kit-fork.0.2.0`, vendored alongside the skill so it ships with this repo; the Rust engine underneath stays on PyPI. The fork adds four things the upstream wrapper doesn't: duplicate suppression so mirror copies of the same file don't crowd results, canonical path identity per chunk (so dedup works across symlinks), a path-class taxonomy that nudges "find me the implementation of X" toward implementation files first, and ranking telemetry that surfaces *why* each result ranked where it did. | **BANNED** (prose) |
| 286 | - **Exit 3** - System error (file I/O failure, missing manifest, or other environment problem). | **BANNED** (prose - Oxford comma with "or") |
| 550 | The framework uses two different code-understanding systems on purpose. **CocoIndex** handles semantic discovery, so the assistant can answer "find code that does X" or "how is Y implemented?" without knowing exact symbols first. The **Code Graph** handles structural expansion, so the assistant can answer questions like "what calls this?", "what imports this?", or "what breaks if we change it?" using an indexed relationship graph. | **BANNED** (prose - Oxford comma with "or") |
| 733 | | `advisor_rebuild` | Rebuilds the advisor skill graph when `advisor_status` reports stale, absent, or unavailable state; `force:true` rebuilds even when live. | | **BANNED** (prose in table - Oxford comma with "or") |
| 955 | - Used by the CLI mirror-card pipeline and `/improve:prompt` agent mode when complexity, compliance, or stakeholder spread makes inline prompting too weak | **BANNED** (prose - Oxford comma with "or") |
| 1013 | - Used directly for new packet setup and paired with `/spec_kit:plan` or `/spec_kit:complete` when `folder_state` is `no-spec`, `partial-folder`, `repair-mode`, or `placeholder-upgrade` | **BANNED** (prose - Oxford comma with "or") |
| 1024 | - Reuses the shared intake contract from `/spec_kit:plan --intake-only` when the packet is `no-spec`, `partial-folder`, `repair-mode`, or `placeholder-upgrade` | **BANNED** (prose - Oxford comma with "or") |
| 1267 | | **`sk-code`** | 🎨 Stack-specific (the customization point) | Surface-aware code-quality patterns. Replace the shipped Webflow + OpenCode + Motion.dev surfaces with your own (e.g., Next.js + Tailwind + Postgres, or React Native + Reanimated, or Go + sqlc, etc.). | | **BANNED** (prose in table - Oxford comma with "or") |
| 1425 | **Q: Is this only for OpenCode, or does it work with other runtimes?** | **BANNED** (prose - Oxford comma with "or") |

*Note: 68 ", and" matches + 11 ", or" matches = 79 total Oxford comma violations found. Sample above shows representative prose violations. No legitimate bash flag separators found.*

## Summary

- **Em dash**: 4 violations (all prose)
- **Semicolon**: 100+ violations (all prose, no legitimate bash flag separators)
- **Oxford comma**: 79 violations (68 ", and" + 11 ", or", all prose)

**Total findings**: 183+ punctuation hard-blocker violations in README.md prose. No legitimate code block or bash flag separator uses found for any of the three patterns.

ITER_008_COMPLETE: 183 findings, newInfoRatio=1.00
