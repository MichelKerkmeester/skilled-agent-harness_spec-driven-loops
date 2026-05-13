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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/012-v3-remediation"
    last_updated_at: "2026-05-13T08:30:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implementation complete; strict validation passed; .codex patch recorded because sandbox blocks write"
    next_safe_action: "Main agent commits the 012 remediation bundle"
    blockers:
      - ".codex/config.toml EPERM; patch recorded in scratch"
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
| **Status** | Complete (sandbox-blocked `.codex/config.toml` patch documented) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The memory-side hf-local default now resolves to q8, with fp32/q4 documented as local overrides. `EmbeddingProfile` now carries dtype through slug, JSON, display, equality, and DB filename behavior, producing q8-specific sqlite names such as `context-index__hf-local__onnx-community__embeddinggemma-300m-ONNX__768__q8.sqlite`.

Claude and Gemini configs now launch Spec Kit Memory through `.opencode/bin/spec-kit-memory-launcher.cjs`, so `.env.local` is loaded. `.codex/config.toml` is still blocked by sandbox EPERM; the exact patch is recorded in `scratch/codex-config-patch.md`.

CocoIndex search-only mode now validates client-supplied project roots before opening sqlite, and `project_status` reads an existing unloaded `target_sqlite.db` directly when sqlite-vec can load.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Include dtype only when present | Cloud provider DB names stay stable; hf-local precision changes are isolated |
| Keep post-resolution Voyage warning | It still catches the opposite drift case where hf-local wins despite a Voyage key |
| Record `.codex` patch instead of bypassing sandbox | User explicitly requested this fallback path |
| Do not touch live daemon | Out of scope and explicitly forbidden |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Initial shared build | `cd .opencode/skills/system-spec-kit/shared && npx tsc --build` | PASS |
| dtype dist evidence | `grep -nE "(dtype.*sqlite|sqlite.*dtype)" .opencode/skills/system-spec-kit/shared/dist/embeddings/*.js` | PASS |
| Launcher grep | `rg "context-server\\.js|spec-kit-memory-launcher"` | Claude/Gemini PASS; Codex BLOCKED |
| Parent strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a --strict` | PASS - 0 errors / 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. `.codex/config.toml` cannot be written in this sandbox (`EPERM` on direct Node write). `scratch/codex-config-patch.md` contains the exact required patch.
2. The unloaded CocoIndex status direct-read depends on `sqlite_vec` import/load. If extension loading fails, the daemon falls back to a 0-count response and logs: `0 chunks reported; project not loaded — call ccc index to refresh`.
3. PAT rotation remains user manual action and is intentionally out of scope.
<!-- /ANCHOR:limitations -->
