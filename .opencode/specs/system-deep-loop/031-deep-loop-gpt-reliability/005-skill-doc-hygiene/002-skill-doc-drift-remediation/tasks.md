---
title: "Tasks: Skill Documentation Drift Remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "skill doc drift remediation"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/005-skill-doc-hygiene/002-skill-doc-drift-remediation"
    last_updated_at: "2026-07-01T19:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 6 clusters patched; verified; ready for implementation-summary"
    next_safe_action: "Write implementation-summary.md, validate, commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-015-tasks"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Tasks: Skill Documentation Drift Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffolded phase `015-skill-doc-drift-remediation` under packet 031.
- [x] T002 Recorded operator decision for Cluster 4: retire the `.toml` mirror check entirely (2-mirror model).
- [x] T003 Launched dedicated routing investigation for Cluster 6 (operator chose "revisit orchestrate's routing" over narrowing cli-opencode's wording).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Cluster 1: patched `cli-opencode/SKILL.md:31,285`, `README.md:76,164`, `assets/prompt_templates.md:372,386-392`, `manual_testing_playbook.md:417-423`, `04--agent-routing/multi-ai-council-multi-strategy.md:27-43,51` (multi-part edit).
- [x] T005 [P] Clusters 2/3: patched `deep-research/SKILL.md:17-20` (+`capability_matrix.md:51-55`), `deep-review/SKILL.md:16-20` (+`loop_protocol.md:721-724`), `deep-context/SKILL.md:279-287,302`, `deep-loop-runtime/SKILL.md:253-261`, `deep-ai-council/SKILL.md:431-432` (+`output_schema.md:27-29`).
- [x] T006 [P] Cluster 4: patched `deep-improvement/scripts/agent-improvement/scan-integration.cjs:18` (removed `.toml` from `MIRROR_TEMPLATES`) and its 6 supporting docs. Live-verified: `node scan-integration.cjs --agent=deep-review` still runs clean.
- [x] T007 [P] Cluster 5: patched `.opencode/plugins/README.md:3,42-50` (6-entry count, new `mk-deep-loop-guard.js` row).
- [x] T008 Cluster 6: patched `cli-opencode/SKILL.md` (lines ~31, ~293-295) per investigation outcome (narrow wording, keep orchestrate's row). `orchestrate.md` intentionally untouched -- confirmed load-bearing by the investigation.
- [x] T013 Post-fix comprehensive re-scan (beyond phase 014's original citation sample) found 13 additional real `.opencode/agents/*.toml` references across deep-research/deep-review/deep-ai-council manual-testing-playbook and asset files -- fixed all 13, per phase 014's own Plan Seed instruction to re-scan after edits. One deep-improvement fixture script (`08--agent-discipline-stress-tests/setup-cp-sandbox.sh`) left untouched -- its `.md` fixture paths are also missing entirely, a separate pre-existing issue unrelated to the TOML removal.
- [x] T014 Discovered and fixed a pre-existing (pre-dates this session) off-by-one bug in `REPO_ROOT` path climbing in `deep-research` and `deep-review`'s `07--command-flow-stress-tests/setup-cp-sandbox.sh` (5 `../` levels landed at `.opencode/` instead of the repo root) -- found while live-verifying my own Cluster 2/3 fix; both scripts now run end-to-end successfully.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Scoped grep re-scan per cluster confirms zero remaining stale references (excluding the one pre-existing, unrelated deep-improvement fixture issue noted in T013).
- [x] T010 Ran `deep-improvement`'s vitest suite after the Cluster 4 code edit -- 411/413 passing, same 2 pre-existing unrelated failures confirmed earlier this session (no regression).
- [x] T011 Regenerated `description.json`/`graph-metadata.json`; ran `validate.sh --strict` on this phase folder -- PASS.
- [x] T012 Committed and pushed.
<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All 6 clusters patched
- [x] `validate.sh --strict` passes
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor Audit**: See `../014-skill-doc-drift-audit/implementation-summary.md`

<!-- /ANCHOR:cross-refs -->
