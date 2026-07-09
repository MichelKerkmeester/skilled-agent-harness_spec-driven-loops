---
title: "Feature Specification: deep-loop MCP→CLI migration closeout + CLI verification (011)"
description: "Closeout of the deep-loop runtime isolation arc: reconcile stale tool-count config/README references, delete deprecated-MCP remnants (orphan README dirs + relocated DB copy), record the now-green test sweep, and prove the deep-loop skills use the new .cjs CLI by running their CLI-exercising playbook scenarios through cli-devin SWE-1.6."
trigger_phrases:
  - "deep-loop migration closeout"
  - "011 migration closeout cli verification"
  - "deep-loop cli verification cli-devin"
  - "mcp tool surface removal closeout"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/004-deep-loop-runtime/011-migration-closeout-cli-verification"
    last_updated_at: "2026-05-25T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "spec-authored"
    next_safe_action: "execute-part-A-config-readme-status"
    blockers: []
    key_files:
      - "spec.md"
      - ".claude/mcp.json"
      - ".codex/config.toml"
      - ".gemini/settings.json"
      - "README.md"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/coverage-graph/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000011001"
      session_id: "116-003-011-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Ground-truth tool counts: mk-spec-memory 35, mk_skill_advisor 9, mk_code_index 8, code_mode 7, sequential_thinking 1 = 60 across 5 servers"
      - "Playbook test scope: the ~18 CLI-exercising scenarios (deep-loop-runtime/07, deep-ai-council/08+09, deep-research graph-stop), dynamic execution via cli-devin SWE-1.6"
      - "MCP tools already removed from tool-schemas.ts; remnants = orphan README dirs + relocated DB copy + stale doc counts"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: deep-loop MCP→CLI migration closeout + CLI verification

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | In Progress |
| **Created** | 2026-05-25 |
| **Parent** | `003-deep-loop-runtime` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The deep-loop runtime isolation arc (`FULL_ISOLATE_NO_MCP` + council-graph CLI migration) removed the 8 graph MCP tools and built the `.cjs` CLI, but was left in flight: stale tool-count references in three runtime configs and two READMEs, stale spec statuses, an orphaned DB copy and dead README dirs in the memory server, and the migrated vitest sweep was never recorded green.

Purpose: close it out (correct configuration), delete the deprecated-MCP remnants, and prove dynamically that the deep-loop skills invoke the new `.cjs` CLI rather than the removed MCP tools.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reconcile tool-count references to the verified 35/9/8/7/1 = 60 across configs + READMEs.
- Reconcile `003-deep-loop-runtime` child + parent statuses to `complete`.
- Record the confirmed vitest result (32 files / 228 tests) in `009`.
- Delete orphan README dirs (`handlers/coverage-graph`, `lib/coverage-graph`, `lib/deep-loop`) and the relocated DB copy in the memory server.
- Dynamic CLI verification of ~18 CLI-exercising playbook scenarios via cli-devin SWE-1.6.

### Out of Scope
- Re-implementing the migration (already functionally complete).
- Touching the live `deep-loop-runtime` runtime/CLI code beyond committing the in-flight changes.
<!-- /ANCHOR:scope -->

---

## RELATED DOCUMENTS
- Parent arc: `003-deep-loop-runtime/spec.md`
- CLI verification evidence: `cli-verification/` (this folder)
