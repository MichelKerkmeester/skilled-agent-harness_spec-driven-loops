---
title: "Implementation Plan: System Spec Kit Codegraph Residue Audit"
description: "Plan for auditing system-spec-kit user-facing docs after the packet-014 code-graph extraction and redirecting stale ownership or path references to the system-code-graph skill."
trigger_phrases:
  - "012 system spec kit codegraph residue plan"
  - "post 014 docs audit plan"
  - "code graph residue cleanup plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-026-system-spec-kit-codegraph-residue-audit"
    last_updated_at: "2026-05-14T17:35:44Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-012"
    recent_action: "Planned and completed scoped markdown audit and redirect cleanup"
    next_safe_action: "Stage and commit the scoped 012 changes when git index writes are permitted"
    blockers:
      - "Sandbox denied git index lock creation during staging: .git/index.lock Operation not permitted"
    key_files:
      - ".opencode/skills/system-spec-kit/SKILL.md"
      - ".opencode/skills/system-spec-kit/README.md"
      - ".opencode/skills/system-spec-kit/ARCHITECTURE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-012-system-spec-kit-codegraph-residue-audit"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: System Spec Kit Codegraph Residue Audit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation, JSON metadata |
| **Framework** | System Spec Kit Level 1 packet workflow |
| **Storage** | Local repository files only |
| **Testing** | `rg`, `git diff --name-only`, `validate.sh --strict` |

### Overview

The audit uses scoped grep across system-spec-kit user-facing markdown docs, classifies every code-graph-related match into four buckets, then edits only stale ownership/path claims. It avoids source code and the standalone `system-code-graph` skill.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Spec folder selected by user and created as Level 1.
- [x] Audit scope limited to root docs, `references/`, `feature_catalog/`, and `manual_testing_playbook/`.
- [x] Forbidden paths and packets identified before editing.

### Definition of Done

- [x] Scoped raw grep captured total references.
- [x] Stale references rewritten or removed.
- [x] Legitimate historical and cross-skill references preserved.
- [x] Stale-residue grep returns no matches in scoped markdown docs.
- [x] Packet docs filled from templates.
- [x] Strict validation exits 0.
- [B] Git staging and commit are blocked by sandbox index-lock permissions.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Read-mostly documentation audit with surgical path and ownership rewrites.

### Key Components

- **Survey grep**: Finds tool names, legacy paths, MCP namespace references, and proper-noun Code Graph mentions.
- **Triage buckets**: Separates stale removal, stale rewrite, historical records, and cross-skill plumbing.
- **Doc edits**: Rewrites root narrative and stale package paths without changing source code.
- **Verification grep**: Confirms stale buckets are empty while preserved references remain explainable.

### Data Flow

Scoped markdown files flow through survey, classification, edit, and verification. Only stale residue produces file edits; legitimate references stay as evidence in the implementation summary.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Root skill docs | Human and AI routing guidance | Rewrite Code Graph as sibling-skill integration | Stale-residue grep returns no root-doc ownership claims. |
| Feature catalog | Current and historical feature inventory | Redirect stale code-graph paths to `.opencode/skills/system-code-graph/` | `git diff` shows path-only or ownership redirects. |
| Manual testing playbook | Operator scenarios and historical validation records | Redirect stale code-graph paths and DB references | Old system-spec-kit DB path grep exits no matches for markdown docs. |
| Environment variable docs | Cross-skill plumbing | Preserve legitimate references | No edit to `SPECKIT_CODE_GRAPH_DB_DIR` docs. |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Survey

- [x] Confirm 012 folder did not already exist.
- [x] Confirm branch is `main`.
- [x] Run scoped raw grep across user-facing markdown docs.
- [x] Count raw matches and candidate files.

### Phase 2: Cleanup

- [x] Rewrite root docs to point to sibling `system-code-graph` ownership.
- [x] Rewrite stale `mcp_server/code_graph` paths to `.opencode/skills/system-code-graph/mcp_server/`.
- [x] Rewrite stale system-spec-kit code-graph DB paths in manual scenarios.
- [x] Preserve legitimate historical and cross-skill mentions.

### Phase 3: Verification

- [x] Re-run stale-residue grep.
- [x] Confirm no `.opencode/skills/system-code-graph/` files were modified.
- [x] Run strict validation for this packet.
- [B] Stage and commit only scoped files. Blocked by sandbox denial when creating `.git/index.lock`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static audit | Scoped user-facing markdown docs | `rg --count-matches`, `rg --pcre2` |
| Scope guard | Diff and staged paths | `git diff --name-only`, `git status --short` |
| Packet validation | 012 spec folder | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <012> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skills/system-code-graph/` package layout | Internal | Green | Needed to redirect stale paths accurately. |
| Dirty worktree outside this packet | Operational | Yellow | Requires explicit staging only. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A redirected path points at a non-existent sibling package location or a legitimate historical record is over-pruned.
- **Procedure**: Revert the affected markdown doc edits from this commit and preserve the 012 packet as the audit record of the correction.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase2-plan -->
## 8. PHASE 2 PLAN — INSTALL GUIDE + DOCTOR COVERAGE (2026-05-15)

### Order of Operations

1. **A: INSTALL_GUIDE.md** — Author `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` (single new file, ~13 KB, 9 sections mirroring `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` shape).
2. **D: .vscode/mcp.json** — Replace stale `system_code_graph` block (lines 28–41) with canonical `mk_code_index` block matching `opencode.json:52–67`; insert missing `mk_skill_advisor` block; final server order: sequential_thinking, mk-spec-memory, mk_skill_advisor, mk_code_index, cocoindex_code, code_mode.
3. **C: `/doctor:mcp` surfaces** — Patch in order:
    - `.opencode/commands/doctor/scripts/mcp-doctor.sh`: add `diagnose_mk_code_index()` + `diagnose_mk_skill_advisor()` functions (clone `diagnose_mk_spec_memory()` shape at lines 144–265), update enumeration at lines 16/50/58–62/501, add dispatch lines at ~534, fix line-533 typo (`diagnose_mk-spec-memory` → `diagnose_mk_spec_memory`).
    - `.opencode/commands/doctor/assets/doctor_mcp_install.yaml`: extend `valid_values` (line 82), add server-definition blocks for both servers (after line 165 cluster), update `install_guides` keys (lines 42–46 and 95–99), update report_format rows (lines 326–334).
    - `.opencode/commands/doctor/assets/doctor_mcp_debug.yaml`: mirror of install.yaml — `valid_values` (line 85), `repair_actions` sub-blocks (after line 149 cluster), report_format (lines 276–284).
    - `.opencode/commands/doctor/mcp.md`: update line 60 menu prompt, line 115 PURPOSE block, line 153 examples.
4. **B: Master install README** — `.opencode/install_guides/README.md`:
    - §7.1 Component Matrix (lines 319–328): add `mk-code-index` and `mk_skill_advisor` rows.
    - §7.3 Installation Bundles (lines 369–391): add both to Full bundle chain + Custom checklist; SKIP Minimal.
    - §10 Phase 3 setup: insert new §10.4 (mk-code-index) and §10.5 (Skill Advisor) between current §10.3 Sequential Thinking and §10.4 Chrome DevTools; shift Chrome DevTools to §10.6.
    - Phase 3 validation checklist (lines 729–739): add two items, update `grep -q` chain to include `mk_code_index` + `mk_skill_advisor`.
    - §19 Setup Guides table (line 1450): add INSTALL_GUIDE.md cross-reference.
    - Reconcile aggregate counts at lines 17, 58, 73, 1440.
5. **Validate** — `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` (expect exit 0).
6. **Complete reconciliation** — fill `implementation-summary.md` Phase 2 evidence, mark `checklist.md` items, update `graph-metadata.json.derived.status` to `completed` when all checks pass.

### Phase 2 Files to Change

| File | Action | LOC delta |
|------|--------|-----------|
| `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | Create | +300 |
| `.opencode/install_guides/README.md` | Modify | +80 |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | Modify | +200 (2 new functions) |
| `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` | Modify | +60 |
| `.opencode/commands/doctor/assets/doctor_mcp_debug.yaml` | Modify | +60 |
| `.opencode/commands/doctor/mcp.md` | Modify | +5 |
| `.vscode/mcp.json` | Modify | +25 (block rename + mk_skill_advisor add) |
| `spec.md` (this packet) | Modify (done) | +60 |
| `plan.md` (this packet) | Modify (done) | +50 |
| `tasks.md` (this packet) | Modify | +40 |
| `checklist.md` (this packet) | Create | +40 |
| `implementation-summary.md` (this packet) | Modify | +80 |

### Phase 2 Rollback

- **Trigger**: New INSTALL_GUIDE.md introduces broken cross-links, doctor patches break smoke test, master README aggregate counts misalign.
- **Procedure**: Revert the single git commit containing Phase 2; the audit (Phase 1) and `026-system-spec-kit-codegraph-residue-audit/` packet structure remain intact since they're in earlier commits.
<!-- /ANCHOR:phase2-plan -->
