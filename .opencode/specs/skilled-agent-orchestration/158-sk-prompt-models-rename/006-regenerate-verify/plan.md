---
title: "Implementation Plan: Phase 6: regenerate-verify"
description: "Rebuild advisor + memory + packet indexes from the renamed source, then run all gates, a zero-reference sweep, a routing probe, and a small-model smoke."
trigger_phrases:
  - "sk-prompt-models regenerate verify plan"
  - "advisor rebuild verify plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/158-sk-prompt-models-rename/006-regenerate-verify"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase plan scaffolded; not started"
    next_safe_action: "Regenerate indexes, then run gates"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/006-regenerate-verify"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: regenerate-verify

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python/Node generators + shell gates |
| **Framework** | advisor + spec-memory + spec-kit validators |
| **Storage** | regenerated indexes/DBs |
| **Testing** | card-sync, validate.sh, vitest, rg sweep, advisor probe, smoke dispatch |

### Overview
Regenerate every derived index from the renamed source (advisor force-refresh + `skill_graph_compiler.py`, spec-memory `memory_index_scan`, packet `generate-description.js` + `backfill-graph-metadata.js`). Then run the gates and prove completeness: card-sync exit 0, `validate.sh --strict`, the touched vitest suites, a zero-reference `rg` sweep, an advisor routing probe returning `sk-prompt-models`, and a live small-model smoke that resolves its profile under the new path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 2–5 complete (all text edits landed)

### Definition of Done
- [ ] Indexes regenerated; all gates green; zero live old-name refs; advisor routes to the new name
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Regenerate-then-prove. Derived state is rebuilt from source, then a layered gate sweep proves the rename is complete and non-breaking.

### Key Components
- **advisor regen**: `skill_advisor.py --force-refresh` + `skill_graph_compiler.py --export-json`.
- **memory regen**: `memory_index_scan`.
- **packet regen**: `generate-description.js` + `backfill-graph-metadata.js`.
- **gates**: card-sync guard, `validate.sh --strict`, vitest, rg sweep, advisor probe, smoke.

### Data Flow
1. Rebuild indexes from the renamed source.
2. Run each gate; fix-and-rerun on any failure.
3. Zero-reference sweep + routing probe + smoke confirm completeness.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Regenerate
- [ ] Advisor force-refresh + `skill_graph_compiler.py --export-json`
- [ ] spec-memory `memory_index_scan`; packet `generate-description.js` + `backfill-graph-metadata.js`

### Phase 2: Gates
- [ ] Card-sync guard exit 0; `validate.sh --strict --recursive` on the 158 packet; secret-scrubber + model-benchmark vitest suites

### Phase 3: Prove completeness
- [ ] `rg -c "sk-prompt-small-model"` = 0 (or only listed history-care lines)
- [ ] Advisor routing probe returns `sk-prompt-models`; small-model smoke resolves its profile; write implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Guard | Model-registry completeness | card-sync guard `.sh` |
| Structure | Packet valid | `validate.sh --strict --recursive` |
| Unit | Touched suites pass | `secret-scrubber` + model-benchmark vitest |
| Sweep | Zero live old-name refs | `rg` |
| Routing | Advisor knows the new name | `skill_advisor.py` probe |
| Smoke | Profile resolves under new path | live `opencode run` small-model dispatch |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 2–5 | Internal | Pending | Cannot regenerate from a half-renamed source |
| advisor + spec-memory daemons | Internal | Available | Cannot rebuild indexes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate fails or the advisor cannot route the new name.
- **Procedure**: Fix the offending reference (loop back to the owning phase), re-regenerate, re-run the gates. If systemically broken, `git revert` the rename commit(s) and re-plan.
<!-- /ANCHOR:rollback -->
