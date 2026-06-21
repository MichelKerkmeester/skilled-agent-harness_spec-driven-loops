---
title: "Handover: Spec-Kit Data Quality program (research done, 28 phases scaffolded to Level 2)"
status: complete
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality"
    last_updated_at: "2026-06-21T10:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed all 28 phase Level-2 doc sets, recursive validate strict 0"
    next_safe_action: "Per-phase speckit plan execution when a recommendation gets built"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-dq-scaffold-handover"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The data-quality research used the official deep-research workflow, opus-via-claude2."
      - "The floor experiment (027) is operator-agreed."
---

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

# Handover: Spec-Kit Data Quality program

## 1. CURRENT STATE

A long multi-task session on branch `system-speckit/028-memory-search-intelligence`. The ACTIVE task is scaffolding 28 implementation phases (one per data-quality recommendation) under this packet. A workflow (`w4gvus4y5`) is RUNNING, writing each phase `spec.md` grounded in `research/research.md`. Everything else in the session is committed and pushed.

## 2. WHAT WAS COMPLETED (all committed + pushed)

- **028 epic**: keep-5/delete-10 flag resolution, eval-v2, reranker research. Done.
- **028 spec-tree reorg**: `005-release-cleanup` to `000-release-cleanup`, `007/008/009` nested under `001-speckit-memory` as children `022/023/024`, and the old `031-spec-data-quality` moved in as `028/005-spec-data-quality`. Validated, HEAD-verified.
- **Missing track-root JSONs**: added `description.json` + `graph-metadata.json` to the `ai-systems`, `anobel.com`, `barter` track roots (ai-systems and barter are gitignored, on-disk only).
- **THE DATA-QUALITY DEEP-RESEARCH**: re-run via the OFFICIAL deep-research workflow (`fanout-run.cjs` driving the command YAML), opus-via-claude2/account2, 5 distinct lineages, 37 substantive iterations, synthesized into `research/research.md` (DQI 94, validate 0). Last research commit `6047df6cc8`.

## 3. IN PROGRESS

The 28-phase scaffold workflow `w4gvus4y5`. Each agent writes `028/005-spec-data-quality/<NNN-slug>/spec.md` for one recommendation. Phases: Tier A on-write 001-010, Tier B automation 011-013, Tier C retrieval 014-018, novel 019-025, shared engine 026, the floor experiment 027, governance/rollout 028.

## 4. NEXT STEPS (resume here)

1. Confirm the workflow wrote all 28 phase `spec.md` files (`ls 028/005-spec-data-quality/0*/spec.md`).
2. Generate per-phase metadata. SCOPED ONLY: run `generate-description.js <phase> .opencode/specs` per phase for `description.json`, and `refreshGraphMetadataForSpecFolder` (or the backfill with `--root <028/005> --active-only`) for `graph-metadata.json`. NEVER run the unscoped backfill (it crashes on `z_future`).
3. Make `028/005` a proper phase-parent: update its `spec.md` phase-map and `graph-metadata.json` `children_ids` to list the 28 children.
4. `validate.sh 028/005-spec-data-quality --strict` = exit 0, HVR clean.
5. Commit + push scoped to `028/005`.
6. Refresh the memory note `spec-data-quality-031-truncation-tiering.md` (the official-redo update was started, not finished).

## 5. THE PROGRAM (what the phases build)

The keystone: a live default-ON `quality-loop.ts` (scorers + auto-fix on the memory-save path) should EXTEND to the authored spec-doc + metadata-JSON write surface. A standing scheduled DQ sweep with guarded auto-fix is the most-automated layer. One measured unconditional GO (the JSON-schema warn-to-error gate, phase 004). Retrieval candidates stay frozen behind a prod-mode completeRecall@3 benchmark (phase 015) until proven. The floor experiment (phase 027) raises the retrieval budget and measures whether results 4-10 are signal or noise.

## 6. BLOCKERS AND GOTCHAS

- **The graph-metadata backfill runs unscoped by default and crashes on `z_future`.** Always `--root <folder> --active-only`, or call `refreshGraphMetadataForSpecFolder` directly per folder.
- **account2 caps around 15 deep iterations per session.** The deep-research loops converge efficiently at 6-9 iters, so reach depth by stacking distinct facet lineages, not by padding one loop.
- **A rename-plus-content-edit commit can drop the content edits** (git rename detection). Always re-grep for stale paths and verify HEAD after such a commit.
- **HVR voice** everywhere (no em-dashes, no prose semicolons, no Oxford commas), no artifact-ids in code comments.
- Do NOT touch packet 030 or the concurrent-session files.

## 7. KEY PATHS

- Canonical synthesis: `028/005-spec-data-quality/research/research.md` (the 28 recs, tiered).
- Lineage trail: `028/005/research/lineages/{dq-deep, dq-skilldoc-cmd-ctx, dq-automation-impl, dq-novel-oob, dq-governance-rollout}`.
- The official loop runner: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` (cli-claude-code executor, `configDir` maps to `CLAUDE_CONFIG_DIR=~/.claude-account2`).

## 8. CONTINUATION PROMPT

Resume the 028/005 data-quality phase scaffold: verify the 28 phase spec.md files from workflow w4gvus4y5, generate their metadata with the SCOPED backfill only, wire the 028/005 parent phase-map and children_ids, validate strict, commit and push.
