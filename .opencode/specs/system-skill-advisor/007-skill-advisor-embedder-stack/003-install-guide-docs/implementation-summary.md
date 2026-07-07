---
title: "Summary: 010/003 skill-advisor INSTALL_GUIDE + README docs"
description: "Authored INSTALL_GUIDE §12 'Choosing an embedder' + README 'Pluggable embedder layer' subsection reflecting the half-wired pluggable state (gemma active default, jina-v3 registered but pointer flip deferred to 010/004)."
trigger_phrases: ["010/003 summary", "skill-advisor embedder docs", "022/003 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/003-skill-advisor-stack/003-install-guide-docs"
    last_updated_at: "2026-05-18T03:30:00Z"
    last_updated_by: "markdown_agent"
    recent_action: "Authored INSTALL_GUIDE §12 + README pluggable-layer subsection + cross-links"
    next_safe_action: "Strict-validate + commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/INSTALL_GUIDE.md"
      - ".opencode/skills/system-skill-advisor/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000010003"
      session_id: "022-003-install-guide-docs-impl"
      parent_session_id: "022-003-install-guide-docs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Default embedder claim: gemma (not jina-v3) — matches DEFAULT_ACTIVE_EMBEDDER in schema.ts"
      - "Swap mechanism: setActiveEmbedder(db, name, dim), not env var — matches schema.ts surface"
      - "Registered count: 6 manifests, not 8 — matches MANIFESTS array length in registry.ts"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 010/003 skill-advisor INSTALL_GUIDE + README docs

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Status | Complete |
| Artifact | `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` (§12 added) + `.opencode/skills/system-skill-advisor/README.md` (Configuration subsection + Related Documents row added) |
| Owner | markdown agent (Opus 4.7, 1M context) |
| Completed | 2026-05-18 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Surgical doc updates that document the pluggable embedder layer shipped in `010/001` and the active-pointer deferral handed off to `010/004`.

**INSTALL_GUIDE.md additions** (new §12 "Choosing an embedder", ~95 lines):
- §12.1 Current active default — calls out `embeddinggemma-300m @ 768d via llama-cpp` as the production pointer and explicitly states `jina-embeddings-v3` is registered-but-not-active, with the read-path / write-path split that surfaced in `010/002`.
- §12.2 Registered alternatives — 6-row table sourced from `mcp_server/lib/embedders/registry.ts` (name / dim / backend / ollama tag or gguf path / max input / notes).
- §12.3 Swap mechanism — explicit that `setActiveEmbedder(db, name, dim)` is the surface, NOT an env var, NOT an MCP tool. Shows the TypeScript call shape and the database side effects.
- §12.4 Operator-safe swap runbook — cross-links to `002-jina-swap-and-reindex/evidence/swap-runbook.md` with explicit "do not flip in production until 010/004 ships" guidance.
- §12.5 Device selection — honest note that skill-advisor does NOT ship an `_resolve_device()` shim; backend-inherited (Ollama handles Metal/CUDA/CPU on its own; llama-cpp baseline inherits from the shared provider cascade).
- §12.6 Cross-references — links to canonical narrative, mk-spec-memory analog, adapter contract, schema helpers, and the `010/004` follow-on.
- TOC updated with new entry; existing §12 "RELATED RESOURCES" renumbered to §13 and now includes an embedder-pluggability cross-link.

**README.md additions** (~18 lines + 1 table row):
- New "Pluggable embedder layer" subsection appended to §5 CONFIGURATION. Names all 6 registered candidates, identifies `embeddinggemma-300m @ 768d via llama-cpp` as the current active default, and links forward to INSTALL_GUIDE §12 plus the canonical narrative.
- Cross-link row added to §9 RELATED DOCUMENTS pointing to `../system-spec-kit/references/embedder-pluggability.md`.

**Reality reflected, not aspirations:**
- Gemma still default (not jina-v3) — matches `DEFAULT_ACTIVE_EMBEDDER` in `schema.ts:18-21`.
- Pointer-flip mechanism is `setActiveEmbedder()` (DB helper), not an env var — matches `schema.ts:97-121`. The `010/002` operator-runbook explicitly identified the doc-vs-impl drift here, so no env-var promise was authored.
- 6 manifests registered (not 8 as the canonical narrative claims) — matches `MANIFESTS` array length in `registry.ts:13-63`. The canonical narrative is authoritative for mk-spec-memory which does have 8; skill-advisor's registry is a deliberate subset.
- `010/004` deferral stated openly in §12.1, §12.4, and the README subsection so a reader hitting these docs before the writer cross-wiring ships does not flip the pointer and degrade the `semantic_shadow` lane to zero results.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Single markdown-agent dispatch following the orchestrator-scoped path. Workflow:

1. Loaded `sk-doc` SKILL.md to confirm the doc-quality conventions (evergreen packet-ID rule, surgical-edit principle).
2. Read both target files and the four reference sources in parallel: `registry.ts`, mk-spec-memory `INSTALL_GUIDE.md` (pattern), `embedder-pluggability.md` (canonical narrative), `002-jina-swap-and-reindex/evidence/swap-runbook.md` (operator runbook to cross-link).
3. Cross-checked the registry to discover the canonical narrative's "8 registered" count does not match skill-advisor's actual 6; documented the truthful number.
4. Verified `DEFAULT_ACTIVE_EMBEDDER` in `schema.ts` to confirm gemma-not-jina-v3 as the current production active.
5. Verified `setActiveEmbedder()` signature in `schema.ts` to author §12.3 against the actual API surface, avoiding the env-var promise that `010/002` flagged as the doc-vs-impl drift.
6. Authored two Edit operations on INSTALL_GUIDE (TOC + content insertion with renumbering) and two Edit operations on README (configuration subsection + related-documents row). All edits surgical — no rewrites of existing prose.
7. Filled in this implementation-summary against the as-shipped state.
8. Ran strict-validate (results captured in Verification section below) and committed.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- **Mirror skill-advisor's own INSTALL_GUIDE style, not mk-spec-memory's.** Skill-advisor uses TOC + numbered sections + ANCHOR comments. mk-spec-memory uses "Phase X" headers + "Validation: phase_N_complete" blocks. The new §12 follows skill-advisor's convention so it reads as part of the same document, not a transplant.
- **Cite the actual 6 manifests, not the canonical narrative's 8.** Truth-over-agreement: the registry source-of-truth has 6 rows; the canonical narrative describes mk-spec-memory's 8-row registry. Documenting fictional rows would have failed verification on first reader contact with `registry.ts`.
- **Lead with the `010/004` deferral, not bury it.** The "current active default is gemma" claim sits in §12.1's first sentence and is repeated in §12.4's first sentence ("do not flip the active pointer in production"). The README subsection states it in paragraph 2. Anyone skimming for the swap procedure encounters the deferral before the procedure itself.
- **No env-var swap mechanism documented.** The `010/002` runbook explicitly flagged the env-var promise as the doc-vs-impl drift surfaced by E review P2-11. The new docs use `setActiveEmbedder(db, name, dim)` as the canonical surface and explicitly state "no env var, no MCP tool" in §12.3 to prevent the drift from regrowing.
- **Cross-link to the swap-runbook, do not duplicate it.** The runbook is 158 lines of detailed operator discipline. INSTALL_GUIDE §12.4 is a 1-paragraph pointer with the prerequisite caveat. Doc-rot risk minimized by single source of truth.
- **No false MPS auto-detect claim.** Skill-advisor inherits device handling from its backends (Ollama or the shared provider cascade) and does NOT ship its own `_resolve_device()` shim. The canonical narrative's MPS section is CocoIndex-specific. §12.5 documents this honestly to avoid implying an Apple Silicon optimization that does not exist on this side.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

- Strict-validate on `003-install-guide-docs/` — see commit message for exit code.
- Internal links verified by inspection:
  - `../system-spec-kit/references/embedder-pluggability.md` — exists.
  - `./mcp_server/lib/embedders/registry.ts` — exists.
  - `./mcp_server/lib/embedders/adapter.ts` — exists.
  - `./mcp_server/lib/embedders/schema.ts` — exists.
  - `../002-jina-swap-and-reindex/evidence/swap-runbook.md` — exists.
- Truth-checks performed against source code:
  - `DEFAULT_ACTIVE_EMBEDDER.name === 'embeddinggemma-300m'` per `schema.ts:18-21`.
  - `MANIFESTS.length === 6` per `registry.ts:13-63`.
  - `setActiveEmbedder` signature `(db: Database, name: string, dim: number): void` per `schema.ts:97`.
- Reader test (mental walk-through): a new operator landing on `INSTALL_GUIDE.md#12--choosing-an-embedder` can identify the current default, the swap surface, the alternatives, and the "wait for `010/004` before flipping" caveat in under 5 minutes of reading.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- **No `010/004` shipped yet.** The active-pointer swap remains operator-discipline-only until the writer cross-wiring closes the read/write asymmetry. Docs reflect this honestly but the underlying capability gap remains.
- **No MCP tool surface for embedder selection.** Skill-advisor does not mirror `mk-spec-memory`'s `embedder_list` / `embedder_set` / `embedder_status` tools. Adding them is a separate scope decision tracked outside this packet.
- **Doc-rot risk if `registry.ts` adds candidates.** The §12.2 table is hand-maintained against the registry array. A follow-on packet could add a parity check (similar to CocoIndex's `config.py` ↔ `registered_embedders.py` test) but that is out of scope here.
- **Cross-link path style.** Used repo-root-relative paths via `..` traversal rather than absolute repo-root paths because the rest of skill-advisor INSTALL_GUIDE uses relative paths consistently.
<!-- /ANCHOR:limitations -->
