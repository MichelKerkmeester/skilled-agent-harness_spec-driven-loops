---
title: "Implementation Plan: Comment ephemeral-artifact pointer cleanup"
description: "Comment-only sweep removing sk-code-forbidden ephemeral-artifact pointers from ~27 files, preserving the durable WHY, verified by build + node --check + re-audit."
trigger_phrases:
  - "comment ephemeral pointer cleanup plan"
  - "sk-code ephemeral pointer remediation plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-embedding-stack-hardening/006-comment-ephemeral-pointer-cleanup"
    last_updated_at: "2026-05-29T19:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level-1 plan for the ephemeral-artifact comment cleanup"
    next_safe_action: "Execute the comment-only edits batch by batch"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003162"
      session_id: "031-006-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Comment ephemeral-artifact pointer cleanup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server, shared, scripts), Node CJS launchers (`.opencode/bin`), one Python report generator |
| **Framework** | system-spec-kit; governed by sk-code OPENCODE surface, `code_style_guide.md` §4 |
| **Storage** | None (comment/string text only) |
| **Testing** | `npm run build --workspace=@spec-kit/{shared,mcp-server}`, `node --check`, `python3 -m py_compile`, re-audit grep |

### Overview
Surgical, comment-only edits across ~27 files: for each flagged line, keep the durable WHY and delete only the perishable ephemeral-artifact pointer, following the sk-code §4 GOOD/BAD contract. No executable code changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (sk-code §4; in-scope file set classified)
- [x] Success criteria measurable (re-audit returns only allowed/false-positive matches)
- [x] Dependencies identified (none beyond the sk-code rule itself)

### Definition of Done
- [x] All acceptance criteria met (durable WHY kept, ids dropped, zero logic change)
- [x] Tests passing (builds + `node --check` + `py_compile` green)
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
N/A — comment/docstring text edits only; no runtime architecture is touched.

### Key Components
- **sk-code §4 contract**: the allowed-vs-forbidden table that classifies each match.
- **Audit grep**: the comment-line ephemeral-id pattern used to find and re-verify.

### Data Flow
N/A — no data path changes; the program's behavior is byte-identical after the edits.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a documentation/comment fix. No runtime producer/consumer surface changes; the only "surface" is comment text. The inventory below is how the in-scope set was found and re-verified.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Code comments (TS/CJS/PY) | Carry the durable WHY plus a forbidden ephemeral id | Strip the id, keep the WHY | Re-audit grep returns no forbidden pointer on a touched line |
| Runtime strings / paths | Code reads them at runtime (`DEFAULT_ROOT`, `specs/NNN-*`) | Unchanged (allowed/structural) | Excluded from the edit set by classification |
| Tests / fixtures | Use spec-folder strings as data | Unchanged (out of scope) | Excluded by `-g '!**/tests/**'` |

Required inventories:
- Ephemeral-id audit: `rg -n "(//|^\s*\*|/\*).*(DR-[0-9]{3}|WS-[0-9]|[0-9]{3}/[0-9]{3}|Spec [0-9]{3}|REQ-[0-9]|CHK-[0-9]|ADR-[0-9]|T[0-9]{3})" -g '*.ts' -g '*.cjs' -g '*.py' .opencode/skills/system-spec-kit .opencode/bin`.
- Allowed/false-positive set: HTTP codes, embedding dims, token tiers, `200-decision`, `V16:` tags, JSDoc `@example`/parser format illustrations, runtime path constants.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Verify the sk-code rule and its allowed-vs-forbidden contract
- [x] Classify every audit hit: true violation vs false positive vs allowed structural
- [x] Scaffold the spec folder (spec/plan/tasks)

### Phase 2: Core Implementation
- [x] Batch 1 — embedding/daemon program files (8 files)
- [x] Batch 2 — older core modules + shared bin launchers (16 files)
- [x] Batch 3 — owner-authorized extras (code-graph launcher + non-comment strings)

### Phase 3: Verification
- [x] Build both workspaces; `node --check` all `.cjs`; `py_compile` the report
- [x] Re-run the audit; confirm only allowed/false-positive matches remain
- [x] Strict validation + implementation-summary
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | `@spec-kit/shared` + `@spec-kit/mcp-server` compile | `npm run build --workspace=…` (tsc) |
| Syntax | Every touched `.cjs` + the Python script | `node --check`, `python3 -m py_compile` |
| Re-audit | All in-scope files | ephemeral-id comment grep |
| Manual | Spot-read each edited comment retains its WHY | Read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-code `code_style_guide.md` §4 | Internal (rule source) | Green | None — rule is stable and read-only |
| Adjacent code-graph session (`mk-code-index-launcher.cjs`) | Internal (shared file) | Green | Owner authorized inclusion; comment-only edits avoid logic collision |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A build/syntax check fails, or a comment edit altered meaning incorrectly.
- **Procedure**: `git checkout -- <file>` reverts any single file with zero functional impact (comment-only changes, no migrations, no state).
<!-- /ANCHOR:rollback -->
