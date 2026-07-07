---
title: "Implementation Plan: 101/004 Deep AI Council Playbook Graph Coverage"
description: "Mechanical doc remediation: rename one stale file, refresh root playbook header/TOC/cross-refs, author 8 templated scenarios under new 08--council-graph-integration/ category."
trigger_phrases:
  - "101/004 plan"
  - "deep-ai-council playbook graph plan"
  - "council graph scenarios plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/020-deep-multi-ai-council-skill/004-deep-ai-council-playbook-graph-coverage"
    last_updated_at: "2026-05-11T07:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored implementation plan"
    next_safe_action: "Execute mechanical doc edits + scenario authoring"
    blockers: []
    key_files:
      - .opencode/skills/deep-ai-council/manual_testing_playbook/
      - .opencode/skills/deep-ai-council/references/graph_support.md
      - .opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-004-playbook-graph-coverage"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions:
      - "Use the 07/001 scenario file as the canonical authoring template."
      - "Mechanical work is direct Edit/Write per stored memory feedback (CLI dispatch reserved for parallel grunt work)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 101/004 Deep AI Council Playbook Graph Coverage

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (sk-doc validators) |
| **Framework** | system-spec-kit playbook conventions |
| **Storage** | Filesystem only — no DB or runtime change |
| **Testing** | sk-doc validate_document.py + quick_validate.py + spec validate.sh --strict |

### Overview
This is a documentation-only packet. Eight templated scenario files mirror the shipped Phase 003 council-graph MCP surface (4 tools × multi-mode behaviors). Authoring uses the existing `07--writer-library-contract/001-library-writer-call-sequence.md` template structure, which already passes sk-doc validation. No runtime code changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 003 shipped surface inventoried (4 tools, 8 node kinds, 10 relations, 5 query modes, 3 convergence buckets)
- [x] Existing scenario authoring template identified (`07--writer-library-contract/001`)
- [x] All anchoring code paths confirmed present on disk

### Definition of Done
- [ ] DAC-011 file renamed; root playbook references updated
- [ ] 8 new scenario files exist under `08--council-graph-integration/`
- [ ] Root playbook header metadata refreshed (count, categories, coverage note, TOC, §14 cross-ref, §15 catalog)
- [ ] All sk-doc validators pass for new + modified files
- [ ] `validate.sh --strict` passes for packet 101/004 child folder + parent
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-driven scenario authoring. Each scenario file = same 5-section structure (Frontmatter, OVERVIEW, SCENARIO CONTRACT, TEST EXECUTION, SOURCE FILES, SOURCE METADATA) with content varying per shipped behavior.

### Key Components
- **Scenario template**: `07--writer-library-contract/001-library-writer-call-sequence.md` (proven; passes sk-doc validation)
- **Anchor docs**: `references/graph_support.md` (tool surface), `handlers/council-graph/*.ts` (handler behavior + error codes), `tests/council-graph.vitest.ts` (test names that scenarios mirror)
- **Validators**: `sk-doc/scripts/{validate_document,quick_validate}.py`, `system-spec-kit/scripts/spec/validate.sh`

### Data Flow
Operator reads scenario → executes prompt + commands → captures evidence → marks PASS/FAIL. No runtime data flow change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Packet 101/004 created at `.opencode/specs/skilled-agent-orchestration/101-deep-multi-ai-council-skill/004-deep-ai-council-playbook-graph-coverage/` (originally scaffolded as standalone 103, then re-homed under 101 as phase 4)
- [x] Spec/plan/tasks docs authored
- [x] Phase parent 101 spec.md and graph-metadata.json updated to reference child 004

### Phase 2: Core Implementation
- [ ] Rename `001-graph-support-explicitly-out-of-scope.md` → `001-graph-support-derived-and-scoped.md`; add §3 forward-pointer
- [ ] Update root `manual_testing_playbook.md` (count + coverage note + canonical artifacts list + TOC + §11 path + §14 cross-ref row + §15 catalog rows + new §16)
- [ ] Create `08--council-graph-integration/` with 8 scenario files

### Phase 3: Verification
- [ ] Run sk-doc validators on each new file
- [ ] Run `quick_validate.py` on the deep-ai-council skill root
- [ ] Run stale-vocab grep sweep
- [ ] Run `validate.sh --strict` on packet 101/004
- [ ] Run `tests/council-graph.vitest.ts` to confirm anchoring tests still pass
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Doc validation | Per-file frontmatter + structure | `sk-doc/scripts/validate_document.py` |
| Skill-level doc quality | Whole `deep-ai-council/` skill | `sk-doc/scripts/quick_validate.py` |
| Cross-link integrity | Root playbook references all new scenario files | `rg -n "DAC-(019\|020\|021\|022\|023\|024\|025\|026)" manual_testing_playbook.md` |
| Stale-vocab sweep | No `explicitly-out-of-scope` references remain | `rg -l "explicitly-out-of-scope" .opencode/skills/deep-ai-council/` |
| Spec validation | Packet 103 frontmatter + structure | `validate.sh --strict` |
| Anchoring vitest | Phase 003 tests still pass | `npx vitest run tests/council-graph.vitest.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 101/003 graph implementation | Internal | Complete | n/a — already shipped |
| sk-doc validators | Internal | Available | Without these, doc-quality regression goes undetected |
| 07/001 scenario template | Internal | Available | Without it, would need to define template from scratch |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: sk-doc validation rejects new files OR scenario content references behavior the shipped tools do not actually expose.
- **Procedure**: `git restore` to drop the 9 new files + 1 rename + root playbook edit. The deep-ai-council skill returns to its pre-103 state. No runtime code is touched, so rollback is purely doc-tree restore.
<!-- /ANCHOR:rollback -->
