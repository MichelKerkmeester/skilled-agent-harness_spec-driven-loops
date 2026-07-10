---
title: "Tasks: Spec-Folder Control-Metadata Reconciliation"
description: "One task per deep-review finding in this sub-phase (8 total): finding id + file:line + registry recommendation + Round-2 status tag. Scaffold only."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/005-spec-folder-metadata-reconciliation"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "deep-review-orchestrator"
    recent_action: "Scaffolded sub-phase tasks from fresh-regression-75 registry"
    next_safe_action: "Operator review; then implement fixes per tasks.md"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-fresh-regression-remediation-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Spec-Folder Control-Metadata Reconciliation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] 005-S1 Capture the subsystem test/validation baseline. [Evidence: pre-edit `validate.sh --strict` on all 7 touched folders = Errors:0 Warnings:0 RESULT:PASSED each.]
- [x] 005-S2 Re-open each finding's cited file:line to confirm real vs refuted before editing. [Evidence: all 8 findings confirmed real against live files/tree before any edit — see per-task evidence below.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

One task per finding (id + file:line + registry recommendation + Round-2 status tag):

- [x] 005-T001 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/graph-metadata.json:113` — Trigger a canonical save/update against the latest active child (007) so updatePhaseParentPointer refreshes the parent, or manually correct last_active_child_id/last_active_at. _[asserted — fix as stated]_ — **FIXED**. [Confirmed: pointer was frozen at `002-self-check-templates` / `2026-06-02T10:04:51Z` (=created_at). Latest-active child is `007-acceptance-coverage-gate` (last_save_at `2026-06-15T09:09:34.752Z`, status `source_pass_complete` — the only non-`complete` sibling). Corrected `last_active_child_id`→`007-acceptance-coverage-gate`, `last_active_at`→`2026-06-15T09:09:34.752Z` (preserved bare-slug convention). Child dir exists.]
- [x] 005-T002 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/description.json:17-27` — Add "000-spec-tree-consolidation" to the children array in 000-release-cleanup/description.json, ideally before 001-public-root-readme to preserve numeric order. _[asserted — fix as stated]_ — **FIXED**. [Confirmed: child dir exists on disk + tracked in graph-metadata.json children_ids but absent from description.json `children`. Added `000-spec-tree-consolidation` before `001-public-root-readme`. Parity now 10/10.]
- [x] 005-T003 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/description.json:4-8` — Add "004-skill-advisor-suite-repair" to childTopology in 003-advisor-and-codegraph/description.json and regenerate per-folder descriptions for the parent. _[asserted — fix as stated]_ — **FIXED**. [Confirmed: child dir exists + in graph-metadata children_ids, absent from description.json `childTopology`. Appended `004-skill-advisor-suite-repair`. Parity now 4/4. Surgical patch (no `--root` regen, per scope guidance).]
- [x] 005-T004 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/description.json:4-13` — Add "009-code-graph-code-only-indexing" to childTopology in 004-shared-infrastructure/description.json and regenerate per-folder descriptions for the parent. _[asserted — fix as stated]_ — **FIXED**. [Confirmed: child dir exists + in graph-metadata children_ids, absent from description.json `childTopology`. Appended `009-code-graph-code-only-indexing`. Parity now 9/9. Surgical patch.]
- [x] 005-T005 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:231` — Make updatePhaseParentPointersAfterSave walk the ancestor chain and refresh every phase parent, or run a tree-wide graph-metadata refresh after batch saves. _[asserted — fix as stated]_ — **FIXED (metadata pointer)**. [Confirmed: root pointer was `005-verification-and-remediation` / `2026-06-14T00:00:00Z`; latest-saved root child is `003-advisor-and-codegraph` (last_save_at `2026-06-15T16:24:38.199Z`). Corrected `last_active_child_id`→full packet_id `system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph`, `last_active_at`→`2026-06-15T16:24:38.199Z` (preserved full-packet_id convention). NOTE: the generator code-change half of the recommendation (walk ancestor chain in `updatePhaseParentPointersAfterSave`) is out of this sub-phase's metadata scope — only the stale pointer value was reconciled here.]
- [x] 005-T006 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:62` — Add a forward note recording what happened to 028-code-graph-and-cocoindex after the 2026-05-28 split (renamed/abandoned; current track 028 is 028-memory-search-intelligence), or explicitly mark the s _[P2]_ — **FIXED**. [Confirmed: `028-code-graph-and-cocoindex` does not exist at any depth; real track-028 is `028-memory-search-intelligence` (.gitkeep + external/ only). Added a "Historical event record (not live guidance)" callout under the section header and rewrote line-62 present-tense guidance into past-tense with the real fate + dangling-pointer note.]
- [x] 005-T007 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/001-finding-remediation/backlog/p1-backlog.json:1715` — Add a v2_proof (citing bm25-baseline.ts:267 as resolved) and a p2_decision/p2_reason to entry idx for the NDCG-cutoff finding, and audit the other 7 untriaged downgrades for the same closure-rationale _[P2]_ — **FIXED**. [Confirmed: NDCG-cutoff entry is `p1[95]`, had bare `downgraded_p2` and NONE of v2_proof/p2_decision/p2_reason. Underlying defect IS resolved (bm25-baseline.ts:224 `k=config.k??20` threaded through to :267 `computeNDCG(...,k)`). Upgraded disposition→`downgraded_p2_v2` and added v2_proof (citing :224/:267), p2_decision `ALREADY_FIXED`, p2_reason. AUDIT of the other downgrades: the 10 bare `downgraded_p2` entries — 9 already carry p2_decision+p2_reason; `p1[95]` was the sole entry missing all rationale. No remaining closure-rationale gap.]
- [x] 005-T008 · `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/002-tri-system-deep-research/research/deep-research-config.json:12` — Update status to completed (or remove the stale field) to align with the final registry. _[P2]_ — **FIXED**. [Confirmed: config `status: "running"` while implementation-summary.md states "50/50 iterations + 12-seat verification complete; registry synthesized" and tasks.md items are `[x]`. Set `status`→`completed`.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] 005-V1 validate.sh --strict --recursive; description↔graph parity. [Evidence: recursive strict PASSED — 000-release-cleanup 11/11, 003-advisor-and-codegraph 5/5, 004-shared-infrastructure 10/10, 001-peck-teachings-adoption 8/8 (exit 0, 0 fails). Parity verified: 000=10/10, 003=4/4, 004=9/9; both corrected pointers resolve to existing dirs.]
- [x] 005-V2 Whole-gate delta reported (no regressions). [Evidence: baseline = all 7 touched folders Errors:0 Warnings:0; post-edit = same (0/0). Delta: zero new errors/warnings. All edited JSON re-parses valid.]
- [x] 005-V3 Update each finding's status in the registry (fixed/refuted). [Evidence: all 8 findings recorded fixed with per-task evidence above; none refuted (all confirmed real against live tree). Registry source is read-only review artifact; disposition captured here + in implementation-summary.md.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 8 findings resolved (fixed or refuted-with-reason); verification gate green. No fixes applied in this scaffold.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Registry: `../../review/fresh-regression-75/deep-review-findings-registry.json`
- Coverage: `../fix-coverage.json`
<!-- /ANCHOR:cross-refs -->
