---
title: "Implementation Plan: Finalize advisor move recalibration"
description: "Plan for finishing the already-physical advisor move by rewriting moved spec paths, bridge imports, DB resolver defaults, configs, and validation docs."
trigger_phrases:
  - "advisor move recalibration plan"
  - "013/009/003 plan"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/003-advisor-source-db-tests-migration"
    last_updated_at: "2026-05-14T12:20:00Z"
    last_updated_by: "codex"
    recent_action: "Completed"
    next_safe_action: "Continue 004"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0130090030000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-003-recalibrate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Finalize Advisor Move Recalibration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Python, Shell, Markdown |
| **Framework** | Spec Kit memory bridge + standalone advisor package |
| **Storage** | Package-local SQLite skill graph |
| **Testing** | TypeScript typecheck, Vitest, strict spec validation |

### Overview
Phase 2 physical move batches were completed before this run. This plan covers the residual fixup work: path rewrite, metadata recalibration, bridge import repair, local package config authoring, DB resolver ownership, README update, and validation evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Rename sweep for the old moved spec path returns zero hits.
- `npm run typecheck` from `system-spec-kit/mcp_server/` exits 0.
- Requested Vitest command is run and fail count captured.
- Strict validation runs for `003`, `009`, `013`, and `008`.
- No public `advisor_*` tool id is renamed.
- No old source directory is recreated.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The bridge remains intentionally transitional. Spec Kit memory still registers advisor tools, but source modules now live in `system-skill-advisor/mcp_server`. The advisor package owns the database default and package metadata; later children own standalone launcher config and consumer cutover.

Two implementation choices matter:

1. **Structured metadata repair**: derive `packet_id`, `spec_folder`, `parent_id`, and `parentChain` from the moved folder path instead of relying on ad hoc string replacement.
2. **Bridge-local typecheck gate**: the required completion gate is the still-registering Spec Kit MCP package. The standalone package config is authored for child 004, but its package-local typecheck may need a later build-boundary decision because it imports shared Spec Kit modules.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Change |
|---------|--------|
| Moved `013` spec tree | Packet path and metadata rewrite |
| `006-skill-advisor` parent metadata | Add `013` child |
| `system-spec-kit/mcp_server` | Bridge imports and TypeScript path resolution |
| `system-skill-advisor/mcp_server` | DB resolver, string literals, configs, README |
| `system-skill-advisor` docs/catalog/playbook | Old moved-tree path references rewritten |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase A — Rename and Metadata Recalibration
- Run the required old spec-path hit list.
- Rewrite full old spec paths and bare moved-tree `015-skill-advisor-semantic-lane` references.
- Canonicalize moved `graph-metadata.json` and `description.json` files.
- Add the moved `013` packet to the `006-skill-advisor` parent graph.

### Phase B — Bridge and Package Fixups
- Repoint `context-server.ts` advisor imports to the new package.
- Repoint bridge schemas/tools/skill-graph helpers to the new package where needed.
- Update advisor DB defaults and add `SYSTEM_SKILL_ADVISOR_DB_DIR`.
- Rewrite the 16 required moved-tree TypeScript literals.
- Author package `tsconfig.json`, `vitest.config.ts`, and `package.json`.
- Update the package README and old moved-tree path references in package docs.
- Investigate old DB stub.

### Phase C — Validation and Packet Closure
- Run rename sweep.
- Run Spec Kit MCP typecheck.
- Run requested Vitest command and record fail count.
- Run strict validation for `003`, `009`, `013`, and `008`.
- Update tasks/checklist/summary with evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

- **Typecheck**: `cd .opencode/skills/system-spec-kit/mcp_server && npm run typecheck`.
- **Vitest**: `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run skill_advisor`.
- **Metadata**: strict spec validation at all four requested packet levels.
- **Path discipline**: `rg` sweeps for old spec path and moved-tree source path references.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

- ADR-001 keeps `advisor_*` ids stable.
- Child 004 owns standalone launcher and runtime config.
- Child 005 owns hooks, plugin bridge, Python shim, and doctor:update cutover.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

Revert this packet's scoped edits and restore the moved-tree references from git history. Do not recreate the deleted old source directory as a rollback shortcut.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase A rename -> Phase B bridge/package fixups -> Phase C validation
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATE

| Item | Estimate |
|------|----------|
| Rename and metadata repair | 20 min |
| Bridge/package fixups | 40 min |
| Validation and doc ledger | 20 min |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

If validation fails, fix the packet-local docs or bridge import in place. If a required fix crosses into child 004 or 005 ownership, block and record the handoff instead of widening this packet.
<!-- /ANCHOR:enhanced-rollback -->
