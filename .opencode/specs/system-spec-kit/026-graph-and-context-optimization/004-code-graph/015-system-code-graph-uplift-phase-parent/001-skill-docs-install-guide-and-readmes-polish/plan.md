---
title: "Implementation Plan: Child 001 SKILL.md and references polish"
description: "Four batches of doc edits in dependency order. SKILL.md first (terminology root), then INSTALL_GUIDE, then ARCHITECTURE, then references plus per-folder READMEs. Per-batch grep-verify gate before editing."
trigger_phrases:
  - "019/001 plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift-phase-parent/001-skill-docs-install-guide-and-readmes-polish"
    last_updated_at: "2026-05-16T10:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 4-batch plan"
    next_safe_action: "Begin Batch 1 SKILL.md"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000292"
      session_id: "029-001-plan"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Child 001

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter |
| **Framework** | sk-doc validate_document.py + system-spec-kit strict-validate |
| **Storage** | n/a (doc edits only) |
| **Testing** | Per-file grep + per-file sk-doc validate where applicable |

### Overview
Four batches of Edit-tool patches in dependency order. SKILL.md ships first to lock canonical terminology. Each batch: grep-verify findings, apply edits, spot-validate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research §10 priorities enumerated with file:line citations
- [x] Per-finding grep verification protocol agreed (skip hallucinated lines)
- [x] D2 plugin_bridges scope confirmed (targeted, not full rewrite)
- [x] D4 primer sizing confirmed (match system-spec-kit references)

### Definition of Done
- [ ] All 4 batches complete with per-file edits applied
- [ ] Em dashes removed from in-scope prose (code-block content preserved)
- [ ] SKILL.md primer + glossary + triggers added
- [ ] Strict-validate child 001 + parent 019 exits 0
- [ ] Commit on main referencing 019/001
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Direct Edit-tool patches with per-batch grep gate. No abstraction.

### Key Components
- Findings list from research §10 (hypotheses, ground-truthed via grep)
- Edit tool with `replace_all=false` for unique replacements
- Per-file post-edit grep to confirm no remaining em dashes / semicolons in prose

### Data Flow
Research findings → grep verify → Edit applies → grep confirms → next file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Verified key findings (INSTALL_GUIDE L49/L56/L197/L240, SKILL.md L8/L12/L92/L133, ARCH L29/L72/L108)
- [x] Confirmed mcp_server/tests/handlers/README.md path exists
- [x] Confirmed em dash counts (ARCH 12, INSTALL_GUIDE 1, SKILL.md 2)

### Phase 2: Core Implementation
**Batch 1 — SKILL.md** (highest dependency root):
- Continuity refresh (frontmatter packet_pointer, last_updated_at, recent_action, next_safe_action)
- Add "why structural matters" primer (1-2 paragraphs after H1, before §1)
- Add glossary section (7 terms)
- Add situational triggers (3 scenarios)
- Fix weak boundary explanation at L92
- Fix weak reference notation at L56
- Remove 2 em dashes at L133 (replace with commas)
- Remove 1 semicolon at L133 (replace with period)
- Remove 1 Oxford comma at L11

**Batch 2 — INSTALL_GUIDE.md** (depends on SKILL.md version baseline):
- L17: add `classify_query_intent` to tool list
- L49: version `1.0.0.0` → `1.0.3.1`
- L56: tool count `10` → `11`
- L197: tool count `10` → `11`
- L240: em dash → comma
- Semicolon prose cleanup (skip code blocks)
- L216: improve migration description prose

**Batch 3 — ARCHITECTURE.md** (high HVR violation count):
- L29: clarify three dates are intentional or update to current
- L72: launcher reference `mk-spec-memory-launcher.cjs` → `mk-code-index-launcher.cjs`
- Remove 12 em dashes (lines 85, 101, 104-108, 148, 160-163)
- Remove 18 semicolons in prose (preserve code/JSON; lines 29 is metadata not semicolon issue)
- Remove 4 Oxford commas (lines 38, 40, 57, 131)

**Batch 4 — References + feature_catalog + per-folder READMEs**:
- references/ownership-boundary.md L20: fix HVR
- references/database-path-policy.md: verify content alignment with current runtime
- feature_catalog/feature_catalog.md: 6 em dashes, 2 semicolons, 1 Oxford comma
- mcp_server/README.md L35, L40: Oxford commas + add "why this layer matters" primer
- mcp_server/tests/handlers/README.md L67, L90: Oxford commas
- plugin_bridges/README.md: spot-check import paths, fix drifted module references (D2 targeted)
- README.md L50 em dash, L54 semicolon + DB path, L112/L223 Oxford commas

### Phase 3: Verification
- Per-file: `grep -c '—' <file>` returns 0 for in-scope files
- Per-file: `grep -cE '^[^|`]*;[^|`]*$' <file>` confirms semicolons removed from prose lines
- Strict-validate on child 001 and parent 019 exits 0
- Implementation-summary.md filled with grep + validate evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static grep | Em dashes + semicolons per file | `grep -c` |
| Strict validate | child 001 + parent 019 | `validate.sh --strict` |
| sk-doc validate | Where applicable per per-doc type | `validate_document.py --type <t>` (deferred to child 003 for exhaustive pass) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Research §10 findings | Internal | Verified | Edit list comes from here |
| D2 + D4 decisions | Internal | Locked at parent §5 | Scope guardrails |
| Edit tool replace_all=false | Tool | Available | Surgical patches |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: validate.sh fails or grep sweep still shows violations
- **Procedure**: `git checkout -- <files>` per in-scope file; packet folder remains for re-attempt
<!-- /ANCHOR:rollback -->
