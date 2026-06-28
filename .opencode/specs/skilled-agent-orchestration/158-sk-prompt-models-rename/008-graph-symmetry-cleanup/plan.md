---
title: "Implementation Plan: Phase 8: graph-symmetry-cleanup"
description: "Add reciprocal graph edges to sk-design + sk-code-review so the symmetry validator passes, then re-export the compiled skill-graph."
trigger_phrases:
  - "graph symmetry cleanup plan"
  - "skill graph reciprocal edges plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/158-sk-prompt-models-rename/008-graph-symmetry-cleanup"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase plan scaffolded; not started"
    next_safe_action: "Add reciprocal edges, then export"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/008-graph-symmetry-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: graph-symmetry-cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON graph metadata + Python compiler |
| **Framework** | skill_graph_compiler.py + skill_advisor.py |
| **Storage** | per-skill graph-metadata.json + compiled skill-graph.json |
| **Testing** | `--validate-only` + `--export-json` + routing probe |

### Overview
Add the missing reciprocal edges (sk-design ↔ mcp-figma / mcp-open-design prerequisite_for+sibling; sk-design ↔ sk-code-review sibling). Re-run `skill_graph_compiler.py --validate-only` until 0 errors, then `--export-json` to regenerate the compiled index cleanly. Confirm the advisor still routes sk-prompt-models. Decide the enhances weight-band only if the validator hard-enforces it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The 5 errors enumerated (from `--validate-only`)

### Definition of Done
- [ ] `--export-json` exits 0; compiled index regenerated; advisor routes sk-prompt-models
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reciprocity repair. Symmetry rules require each directed edge to have its mirror; add the missing mirrors only.

### Key Components
- **sk-design/graph-metadata.json**: gains prerequisite_for + sibling mirrors.
- **sk-code-review/graph-metadata.json**: gains the sibling mirror.
- **skill_graph_compiler.py**: validates + exports.

### Data Flow
1. Add mirrors.
2. `--validate-only` → 0 errors.
3. `--export-json` → compiled index regenerated.
4. `--force-refresh` + probe → routing intact.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Add mirrors
- [ ] sk-design: add prerequisite_for mcp-figma + mcp-open-design; sibling mcp-figma + mcp-open-design
- [ ] sk-code-review: add sibling sk-design

### Phase 2: Validate + export
- [ ] `skill_graph_compiler.py --validate-only` → 0 errors (resolve weight-band only if enforced)
- [ ] `skill_graph_compiler.py --export-json` → exit 0

### Phase 3: Verify
- [ ] `skill_advisor.py --force-refresh`; routing probe surfaces sk-prompt-models; write implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validate | Symmetry passes | `skill_graph_compiler.py --validate-only` |
| Export | Compiled index regenerates | `--export-json` exit 0 |
| Routing | Advisor intact | `skill_advisor.py` probe |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| skill_graph_compiler.py | Internal | Available | Cannot validate/export |
| advisor daemon | Internal | Available | Cannot confirm routing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A reciprocal edge changes routing unexpectedly.
- **Procedure**: `git checkout` the edited graph-metadata files; re-export. Edges are additive mirrors, fully reversible.
<!-- /ANCHOR:rollback -->
