---
title: "Implementation Plan: system-skill-advisor doc + config drift fixes"
description: "Three mechanical fixes: tsconfig value swap, doc phrasing reconciliation across 2-4 markdown files, and one opencode.json comment update. Verify with build, typecheck, and strict validate."
trigger_phrases:
  - "skill-advisor drift fix plan"
  - "ignoreDeprecations 5.0 plan"
  - "advisor tool count reconciliation plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/005-skill-advisor-documentation/003-fix-documentation-config-drift"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Plan authored"
    next_safe_action: "Execute Phase 2 edits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "025-plan"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: system-skill-advisor doc + config drift fixes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript 5.9.3 (skill MCP package), Markdown docs, JSON config |
| **Framework** | MCP SDK (`@modelcontextprotocol/sdk` ^1.24.3) |
| **Storage** | n/a |
| **Testing** | `npm run build`, `npm run typecheck`, `validate.sh --strict` |

### Overview
Three independent drift fixes co-located in one Level 1 packet. Order: config first (tsconfig — fastest signal whether build is unblocked), then docs, then `opencode.json` comment. No code logic touched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Root cause confirmed for build failure (TS5103, `"6.0"` invalid on TS 5.9.3)

### Definition of Done
- [ ] `npm run build` exits 0 in `mcp_server/`
- [ ] `npm run typecheck` exits 0 in `mcp_server/`
- [ ] SKILL.md, ARCHITECTURE.md, README.md, INSTALL_GUIDE.md, `opencode.json` all describe the tool surface consistently
- [ ] `validate.sh --strict` on this folder exits 0 or 1
- [ ] implementation-summary.md captures verification evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation + configuration alignment pass — no architectural change.

### Key Components
- **tsconfig.json**: TypeScript compiler config for the skill-advisor MCP server build
- **SKILL.md / ARCHITECTURE.md / README.md / INSTALL_GUIDE.md**: package documentation surface
- **opencode.json**: workspace-level MCP server registration

### Data Flow
n/a — no runtime data flow affected.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm TS version (5.9.3 verified)
- [x] Reproduce build failure (TS5103 confirmed)
- [x] Locate stale opencode.json comment (flagged by ARCHITECTURE.md §6)

### Phase 2: Core Implementation
- [ ] Edit `mcp_server/tsconfig.json`: `"6.0"` → `"5.0"`
- [ ] Reconcile SKILL.md §3 tool listing with "8 public + 1 internal" framing
- [ ] Reconcile ARCHITECTURE.md §1 ("eight public tools") and §6 (drop "stale" disclaimer) to match
- [ ] Locate and edit `opencode.json` `mk_skill_advisor` registration comment
- [ ] Scan INSTALL_GUIDE.md / README.md for the same 4-tool drift and fix if present

### Phase 3: Verification
- [ ] Run `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build`
- [ ] Run `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck`
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-skill-advisor-documentation/003-fix-documentation-config-drift --strict`
- [ ] Update implementation-summary.md with results
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | tsc full compile | `npm run build` |
| Typecheck | tsc --noEmit | `npm run typecheck` |
| Spec validation | Packet structure + frontmatter + completion | `validate.sh --strict` |
| Manual | Read all 5 doc surfaces for consistent tool framing | Visual diff / `grep` for "four tools" / "eight" / "nine" |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| TypeScript 5.9.3 in `system-spec-kit/node_modules` | Internal | Green | n/a — already installed |
| `system-spec-kit` validate.sh script | Internal | Green | n/a |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: build still fails after tsconfig edit, or any doc edit breaks downstream consumers
- **Procedure**: `git checkout -- <file>` for the offending file; this packet is doc/config-only with no runtime side effects, so revert is single-file granular
<!-- /ANCHOR:rollback -->
