---
title: "Implementation Summary: 014/012 v3 remediation"
description: "q8 default, dtype-keyed memory filenames, launcher parity where writable, Voyage guard timing, tcpdump pktap, CocoIndex search-only hardening, and doc alignment."
trigger_phrases:
  - "014/012 v3 remediation done"
  - "q8 default shipped"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/012-v3-remediation"
    last_updated_at: "2026-05-13T08:30:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Shipped in 42aa114e3 with main-agent .codex patch"
    next_safe_action: "Use 013 for v4 cleanup follow-up"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0140120c2a9e0000000000000000000000000000000000000000000000000004"
      session_id: "014-012-v3-remediation-2026-05-13"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-v3-remediation |
| **Completed** | 2026-05-13 |
| **Level** | 1 |
| **Status** | Complete (shipped 2026-05-13 in 42aa114e3) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The memory-side hf-local default now resolves to q8, with fp32/q4 documented as local overrides. `EmbeddingProfile` now carries dtype through slug, JSON, display, equality, and DB filename behavior, producing q8-specific sqlite names such as `context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite`.

Claude, Gemini, and Codex configs now launch Spec Kit Memory through `.opencode/bin/spec-kit-memory-launcher.cjs`, so `.env.local` is loaded. RESOLVED: main agent applied the patch (Apple TCC blocks codex from writing its own config). Final commit 42aa114e3 has the launcher.cjs args change live.

CocoIndex search-only mode now validates client-supplied project roots before opening sqlite, and `project_status` reads an existing unloaded `target_sqlite.db` directly when sqlite-vec can load.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Include dtype only when present | Cloud provider DB names stay stable; hf-local precision changes are isolated |
| Keep post-resolution Voyage warning | It still catches the opposite drift case where hf-local wins despite a Voyage key |
| Apply `.codex` patch through main agent | Apple TCC blocked Codex from writing its own config; main agent shipped it in 42aa114e3 |
| Do not touch live daemon | Out of scope and explicitly forbidden |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Initial shared build | `cd .opencode/skills/system-spec-kit/shared && npx tsc --build` | PASS |
| dtype dist evidence | `grep -nE "(dtype.*sqlite|sqlite.*dtype)" .opencode/skills/system-spec-kit/shared/dist/embeddings/*.js` | PASS |
| Launcher grep | `rg "context-server\\.js|spec-kit-memory-launcher"` | Claude/Gemini/Codex PASS |
| Parent strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a --strict` | PASS - 0 errors / 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Codex config write was resolved by the main agent in 42aa114e3; Apple TCC still blocks Codex from writing its own config directly.
2. The unloaded CocoIndex status direct-read depends on `sqlite_vec` import/load. If extension loading fails, the daemon falls back to a 0-count response and logs: `0 chunks reported; project not loaded — call ccc index to refresh`.
3. PAT rotation remains user manual action and is intentionally out of scope.
<!-- /ANCHOR:limitations -->
