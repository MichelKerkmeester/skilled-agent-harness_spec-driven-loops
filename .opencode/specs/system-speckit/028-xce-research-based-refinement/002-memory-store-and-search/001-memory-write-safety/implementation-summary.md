---
title: "Implementation Summary: 027/002 Memory Write Safety"
description: "Three P0 correctness fixes (auto-provenance caps, manual-edge overwrite guard, retention tier basement) plus fail-closed pre-index secret redaction shipped with 60 passing focused tests."
trigger_phrases:
  - "027 phase 002"
  - "feedback P0 correctness"
  - "auto-provenance cap broadening"
  - "manual-edge overwrite guard"
  - "retention-sweep tier basement"
  - "secret redaction"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/001-memory-write-safety"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Shipped 3 P0 fixes + secret scrubber; build green, 60 focused tests"
    next_safe_action: "Start 027/005 reducers; this packet is their completed dependency"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-027-002-memory-write-safety-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "pt-04 user decision: split 009 Sub-Phase 1 P0 fixes into 012 and ship them first"
      - "OpenLTM amendment folded into this phase: pre-index secret redaction at the parse head"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/001-memory-write-safety` |
| **Completed** | 2026-06-10 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The memory write path now refuses four unsafe things it previously allowed: letting `auto-session` edges bypass the 0.5 automatic strength cap, letting reducer upserts overwrite curated manual causal edges, deleting constitutional or critical memories just because a TTL expired, and persisting API keys or tokens into the index. All four protections land before the 027/005 learning reducers, which depend on this packet.

### Auto-provenance cap broadening

A single shared predicate, `isAutoEdgeCreator`, now classifies `auto` plus any namespaced `auto-*` creator (such as `auto-session` or `auto-rq-b3`) as automatic. The causal insert cap, the per-node edge bound, and the consolidation Hebbian strengthening cap all call it, so the cap sites cannot drift. Non-auto values like `manual`, `automatic`, or `autosession` never match.

### Manual-edge overwrite guard

`insertEdge` now reads the existing edge's `created_by` before its conflict update. When an automatic writer collides with a non-auto row, the write is skipped, the curated provenance, strength, and evidence survive, and the caller gets `null` (the same rejection signal as the existing window-cap path). Auto-to-auto updates still flow under the caps, and manual writers can still curate anything.

### Retention-sweep tier basement

The sweep's expired-row select now carries `importance_tier`, `decay_half_life_days`, `is_pinned`, `access_count`, and `last_accessed` (selected as NULL on legacy schemas via a PRAGMA column probe, so older databases never crash). A tier-aware decision runs before the destructive delete: constitutional, critical, and pinned rows are denied deletion with a `governance_audit` row (`decision='deny'`, reason `retention_tier_protected`), and the result now reports `protectedCount` and `protectedIds` alongside the deletions. Unprotected expired rows, including null-tier rows, keep the existing deletion behavior.

### Pre-index secret redaction (OpenLTM amendment)

A new ordered regex scrubber runs at the head of `parseMemoryContent`, BEFORE the content hash, embedding, FTS, and every persisted field derived from content, so secrets never reach durable storage. It redacts AWS keys, GitHub/OpenAI/Anthropic/Google/Slack tokens, JWTs, bearer values, private-key blocks, and credential assignments using typed `[REDACTED:<kind>]` markers. It is fail-closed: an internal scrubber error throws `SecretScrubberError` and refuses that write, while clean content always passes through unchanged. `memory_update`'s direct `title`/`triggerPhrases` writes get the same treatment, and `memory_health` now surfaces a `redaction` block with total and per-kind counts.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/storage/causal-edges.ts` | Modified | Shared `isAutoEdgeCreator` predicate; cap and edge-bound broadening; manual-edge overwrite guard |
| `mcp_server/lib/storage/consolidation.ts` | Modified | Hebbian strengthening cap uses the shared predicate |
| `mcp_server/lib/governance/memory-retention-sweep.ts` | Modified | Tier/usage fields on expired rows; tier-aware deny-before-delete; protected counts |
| `mcp_server/handlers/memory-retention-sweep.ts` | Modified | Surfaces `protectedCount`/`protectedIds` in the tool response and summary |
| `mcp_server/lib/parsing/secret-scrubber.ts` | Created | Ordered, fail-closed secret scrubber with typed markers and redaction telemetry |
| `mcp_server/lib/parsing/memory-parser.ts` | Modified | Scrubber call at the head of `parseMemoryContent`, before content-hash |
| `mcp_server/handlers/memory-crud-update.ts` | Modified | Scrubs direct `title`/`triggerPhrases` writes; fail-closed refusal on scrubber error |
| `mcp_server/handlers/memory-crud-health.ts` | Modified | `redaction` counters in the memory_health full report |
| `mcp_server/tests/fixtures/memory-index-db.ts` | Modified | Opt-in `includeRetentionColumns` fixture columns |
| `mcp_server/tests/causal-edges-write-safety.vitest.ts` | Created | 15 tests: predicate, caps, edge bounds, overwrite guard, Hebbian cap |
| `mcp_server/tests/memory-retention-sweep.vitest.ts` | Modified | 8 new tier-basement tests (18 total in file) |
| `mcp_server/tests/secret-scrubber.vitest.ts` | Created | 27 tests: pattern coverage, false-positive guards, fail-closed, parse integration, health surface |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

All four protections shipped together as policy hardening inside existing modules; no new architecture and no feature flags. Each fix landed with focused Vitest coverage written against the real production functions (in-memory SQLite, sandboxed temp dirs, no host daemons touched). The build (`npm run build`) and 60 focused tests pass, and 16 adjacent existing suites (causal, retention, parser, save, crud, health: 428 passing tests) were re-run green to prove no regression, including no scrub false-positives on existing fixtures.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Skipped auto-overwrites return `null`, not the surviving edge id | Matches the existing rejection convention (window cap, edge bounds), so automatic callers cannot mistake a preserved manual row for a successful write. |
| Protected retention rows audit as `decision='deny'` | `governance_audit.decision` is a closed union (`delete/allow/deny/conflict`); the delete was denied, and widening an out-of-scope governance type for a new label was not worth it. The reason field carries `retention_tier_protected`. |
| Optional retention columns probed via PRAGMA; missing columns select NULL | Legacy databases that predate the pin/decay migrations must sweep without crashing; NULL falls through to the pre-existing delete behavior. |
| Recency fields (`access_count`/`last_accessed`) are selected but do NOT protect | REQ-005 and the phase brief scope protection to constitutional/critical/pinned. Protecting recently-accessed normal rows would silently change existing expiry behavior; the fields are selected for audit and future policy only. |
| Scrubber lives at `parseMemoryContent`, the single parse head | Every file-based write (memory_save, index scan, ingest, atomic save) flows through it before `computeContentHash`, embedding, and FTS; title and trigger phrases are extracted from already-scrubbed content. `memory_update` is the one direct field-write head, so it scrubs too. |
| Conservative scrub patterns (vendor prefixes, digit lookaheads, no-hyphen tails) | This repo is full of `sk-*` skill slugs and prose about tokens; patterns require shapes real secrets have (digits, fixed prefixes, length floors) so docs never get mangled. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` (mcp_server workspace) | PASS (exit 0, `tsc --build` + finalize-dist) |
| `npx vitest run tests/causal-edges-write-safety.vitest.ts` | PASS (15/15) |
| `npx vitest run tests/memory-retention-sweep.vitest.ts` | PASS (18/18, incl. 8 new tier-basement tests) |
| `npx vitest run tests/secret-scrubber.vitest.ts` | PASS (27/27) |
| Adjacent: causal-edges, causal-edges-unit, causal-fixes, memory-runtime-retention, memory-parser x4, handler-memory-crud, memory-crud-update-constitutional-guard, handler-memory-health-edge, handler-memory-save | PASS (326 passed, 51 pre-existing skips) |
| Adjacent: atomic-index-memory, n3lite-consolidation, memory-save-extended, memory-save-integration | PASS (102 passed, 2 pre-existing skips) |
| Strict spec validation: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/001-memory-write-safety --strict` | PASS (exit 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Redaction counters are in-process only.** `memory_health.data.redaction` resets on server restart; counts are not persisted to the database. Persisting them was out of scope for this packet.
2. **The scrubber covers the parse and update heads, not retroactive cleanup.** Secrets persisted before this packet remain in the index until rows are re-saved or re-indexed through the scrubbed path.
3. **Orphan private-key bodies.** A `-----BEGIN ... PRIVATE KEY-----` header without its END marker redacts the header line only; the base64 body lines remain (a conservative choice to avoid consuming unrelated text).
4. **tasks.md T009 originally mentioned "recently accessed" protection.** Implemented protection is constitutional/critical/pinned per REQ-005 and the phase brief; recency fields are selected but advisory only (see Key Decisions).
<!-- /ANCHOR:limitations -->
