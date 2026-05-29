---
title: "Implementation Summary: Comment ephemeral-artifact pointer cleanup"
description: "Comment-only sweep that removed ~55 sk-code-forbidden ephemeral-artifact pointers from 27 files across the embedding-stack program and adjacent system-spec-kit modules, preserving the durable WHY; verified by build + node --check + py_compile + re-audit."
trigger_phrases:
  - "comment ephemeral pointer cleanup summary"
  - "sk-code ephemeral pointer remediation result"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-embedding-stack-hardening/006-comment-ephemeral-pointer-cleanup"
    last_updated_at: "2026-05-29T20:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Stripped ephemeral-artifact pointers from 27 files; builds + node --check + re-audit all pass"
    next_safe_action: "Commit with safe pathspecs; optionally add a lint guard to prevent regression"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
      - ".opencode/bin/mk-code-index-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003164"
      session_id: "031-006-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Comment ephemeral-artifact pointer cleanup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-embedding-stack-hardening/006-comment-ephemeral-pointer-cleanup |
| **Completed** | 2026-05-29 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A comment-only sweep bringing the embedding-stack program and adjacent system-spec-kit modules back into compliance with sk-code `code_style_guide.md` §4 "No ephemeral-artifact pointers." Across **27 files (~55 comment/string lines)**, every spec-folder/number, packet/phase/task/checklist/requirement id, ADR id, review-finding id, and traceability pointer was removed from comments while the durable WHY (the constraint, invariant, or decision the comment explains) was preserved. Two non-comment cases with the same rot risk (a `CHK-160` in a tool-schema description string and a `Phase 005` literal in a generated benchmark report) were included per owner decision. Zero logic was changed.

### Files Changed (by group; full per-file list in `tasks.md`)

| Group | Files | Pointers removed |
|-------|-------|------------------|
| Embedding/daemon program | vector-index-store.ts, context-server.ts, reindex.ts, registry.ts, factory.ts, hf-local.ts, bench-dtype-q8-fp16.cjs, embedding-reconcile.ts | `WS-1`, `031/review`, `026/004/012`, `026/007/009`, `026/007/011`, `031/005`, `REQ-006`, `ADR-014`, spec-folder names, acceptance-contract + iteration pointers |
| Older core modules | types.ts, document-helpers.ts, memory-parser.ts, lineage-state.ts, quality-scorer.ts, api/index.ts, preflight.ts, query-flow-tracker.ts, config.ts, vector-index-schema.ts, retry-budget.ts, trigger-phrase-sanitizer.ts, tool-schemas.ts, shared-payload.ts | `Spec 126`, `Spec 103`/`REC-010`, `T070-3`, `DR-004`, `P2-MNT-02`, `010-*` names, `C4 (iter 5)`, `Spec:` headers, `@see …research.md`, `CHK-160` |
| Shared bin launchers | mk-spec-memory-launcher.cjs, mk-skill-advisor-launcher.cjs, launcher-ipc-bridge.cjs | rename pointer, `016/006/009`, `REQ-007`, `REQ-011`, `008-REQ-001/002`, deep-review iter pointer, `031/005`, `026/007/011` |
| Code-graph launcher (owner-authorized) | mk-code-index-launcher.cjs | `DR-002-01`, `DR-008-03`, `DR-002-02`/`DR-001-02`, `DR-003-01`, `DR-008-02`, `DR-006-02`, `016/006/009`, `REQ-011`, packet `014/007-*` |
| Generated report output | generate_report.py | `Phase 005` |

### Caught beyond the original audit
Reading context surfaced two bare spec refs the pattern missed: `factory.ts` "purge **in 003**" and `config.ts` `(010-perfect-session-capturing)` — both fixed.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Edits ran in three batches (embedding program → core modules + bin launchers → owner-authorized extras), reading each file before touching it and matching every change against the sk-code §4 allowed-vs-forbidden table. Before claiming done, both TypeScript workspaces compiled clean (`tsc --build`, exit 0), every touched `.cjs` passed `node --check`, the Python report passed `py_compile`, and a re-run of the ephemeral-pointer audit returned only allowed/false-positive matches. The code-graph launcher was edited comment-only, re-checked, and committed with explicit pathspecs to avoid colliding with the adjacent session that owns it.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep the durable WHY, drop only the id | sk-code §4 contract — the explanation survives any artifact lifecycle change |
| Left false positives untouched | HTTP codes (`401/403`), embedding dims (`256/512/1024`), token tiers (`1500/2500/4000`), `200-decision` window, `V16:` schema tag are durable, not ephemeral |
| Left allowed structural cases untouched | `evidence-marker-audit.ts` `DEFAULT_ROOT` resolves to a `.opencode/specs/.../026-…` path the code reads at runtime; JSDoc `@example` / parser format illustrations show input shape, not traceability |
| Included the code-graph launcher comment-only | Owner authorized; touched only comment text, `node --check` verified, committed with explicit pathspecs to avoid cross-session collision |
| Left `RC-1`/`ARCH-1` inline labels | Ambiguous inline analysis/enumeration shorthand, not clearly archived artifacts; SCOPE LOCK — out of the flagged set |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| TS build (`@spec-kit/shared`) | Pass | `npm run build --workspace=@spec-kit/shared` → exit 0 |
| TS build (`@spec-kit/mcp-server`) | Pass | `npm run build --workspace=@spec-kit/mcp-server` → exit 0 (incl. finalize-dist) |
| CJS syntax | Pass | `node --check` on all 5 touched `.cjs` → OK |
| Python syntax | Pass | `python3 -m py_compile generate_report.py` → OK |
| Re-audit grep | Pass | Only allowed/false-positive matches remain on touched trees |
| Strict validation | Pass | `validate.sh --strict` on this packet → exit 0 |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scope was system-spec-kit + bin** — other code surfaces (webflow, motion_dev) were not swept; this packet targeted the embedding-stack program's footprint and adjacent system-spec-kit modules.
2. **No regression guard added** — nothing yet prevents re-introduction. A grep-based lint (extend `verify_alignment_drift.py` or a pre-commit check) would make the rule enforceable; deferred as a separate decision.
3. **Test-file comments not swept** — a handful of `.vitest.ts`/`.test.*` files carry ephemeral ids in comments (lower stakes, higher false-positive rate); out of this packet's scope.

<!-- /ANCHOR:limitations -->
