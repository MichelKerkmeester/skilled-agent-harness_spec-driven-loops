---
title: "Handover: Spec-Kit Data Quality Parent Governance"
status: in_progress
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality"
    last_updated_at: "2026-07-12T12:17:12Z"
    last_updated_by: "markdown-agent"
    recent_action: "Reconciled current parent governance and historical handover state"
    next_safe_action: "Resolve CHK-042/050/051/143, obtain sign-offs, then rerun reviews and strict validation"
    blockers:
      - "CHK-042, CHK-050, CHK-051 and CHK-143 remain open"
      - "Three sign-offs, fresh independent reviews and strict validation remain open"
    key_files:
      - "system-speckit/004-memory-search-intelligence/003-spec-data-quality/graph-metadata.json"
      - "system-speckit/004-memory-search-intelligence/003-spec-data-quality/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-dq-scaffold-handover"
      parent_session_id: null
    completion_pct: 91
    open_questions:
      - "When the open governance checks, reviews and sign-offs will be completed"
    answered_questions:
      - "The data-quality research used the official deep-research workflow, opus-via-claude2."
      - "The floor experiment (027) is operator-agreed."
---

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

# Handover: Spec-Kit Data Quality Parent Governance

## 1. CURRENT STATE

A historical research and delivery program now sits under the canonical `003-spec-data-quality` parent. The active parent is **In Progress** at 91% P1 readiness (21/23). Current `graph-metadata.json` is the navigation authority and lists 20 direct thematic children. CHK-042, CHK-050, CHK-051, CHK-143, all three sign-offs, fresh independent reviews and strict validation remain open.

Current continuation starts with `graph-metadata.json`, `checklist.md`, and `scratch/task-30c-data-quality-truth.md`. Former 28-phase scaffold routes below are preserved as the dated 2026-06-21 snapshot, not as current navigation.

## 2. HISTORICAL SNAPSHOT: WHAT WAS COMPLETED (2026-06-21)

- **028 epic**: keep-5/delete-10 flag resolution, eval-v2, reranker research. Done.
- **028 spec-tree reorg**: `005-release-cleanup` to `000-release-cleanup`, `007/008/009` nested under `001-speckit-memory` as children `022/023/024`, and the old `031-spec-data-quality` moved in as `028/003-spec-data-quality`. Validated, HEAD-verified.
- **Missing track-root JSONs**: added `description.json` + `graph-metadata.json` to the `ai-systems`, `anobel.com`, `barter` track roots (ai-systems and barter are gitignored, on-disk only).
- **THE DATA-QUALITY DEEP-RESEARCH**: re-run via the OFFICIAL deep-research workflow (`fanout-run.cjs` driving the command YAML), opus-via-claude2/account2, 5 distinct lineages, 37 substantive iterations, synthesized into `research/research.md` (DQI 94, validate 0). Last research commit `6047df6cc8`.

## 3. HISTORICAL SNAPSHOT: COMPLETED SCAFFOLD (2026-06-21)

The 28-phase scaffold workflow `w4gvus4y5` finished. Each agent wrote one phase folder `028/003-spec-data-quality/<NNN-slug>/`, since filled out to a full Level-2 doc set. Phases: Tier A on-write 001-010, Tier B automation 011-013, Tier C retrieval 014-018, novel 019-025, shared engine 026, the floor experiment 027, governance/rollout 028.

## 4. HISTORICAL SNAPSHOT: THEN-NEXT STEPS (2026-06-21)

1. Confirm the workflow wrote all 28 phase `spec.md` files (`ls 028/003-spec-data-quality/0*/spec.md`).
2. Generate per-phase metadata. SCOPED ONLY: run `generate-description.js <phase> .opencode/specs` per phase for `description.json`, and `refreshGraphMetadataForSpecFolder` (or the backfill with `--root <028/005> --active-only`) for `graph-metadata.json`. NEVER run the unscoped backfill (it crashes on `z_future`).
3. Make `028/005` a proper phase-parent: update its `spec.md` phase-map and `graph-metadata.json` `children_ids` to list the 28 children.
4. `validate.sh 028/003-spec-data-quality --strict` = exit 0, HVR clean.
5. Commit + push scoped to `028/005`.
6. Refresh the memory note `spec-data-quality-031-truncation-tiering.md` (the official-redo update was started, not finished).

## 5. HISTORICAL SNAPSHOT: THE PROGRAM (2026-06-21)

The keystone: a live default-ON `quality-loop.ts` (scorers + auto-fix on the memory-save path) should EXTEND to the authored spec-doc + metadata-JSON write surface. A standing scheduled DQ sweep with guarded auto-fix is the most-automated layer. One measured unconditional GO (the JSON-schema warn-to-error gate, phase 004). Retrieval candidates stay frozen behind a prod-mode completeRecall@3 benchmark (phase 015) until proven. The floor experiment (phase 027) raises the retrieval budget and measures whether results 4-10 are signal or noise.

## 6. HISTORICAL SNAPSHOT: BLOCKERS AND GOTCHAS (2026-06-21)

- **The graph-metadata backfill runs unscoped by default and crashes on `z_future`.** Always `--root <folder> --active-only`, or call `refreshGraphMetadataForSpecFolder` directly per folder.
- **account2 caps around 15 deep iterations per session.** The deep-research loops converge efficiently at 6-9 iters, so reach depth by stacking distinct facet lineages, not by padding one loop.
- **A rename-plus-content-edit commit can drop the content edits** (git rename detection). Always re-grep for stale paths and verify HEAD after such a commit.
- **HVR voice** everywhere (no em-dashes, no prose semicolons, no Oxford commas), no artifact-ids in code comments.
- Do NOT touch packet 030 or the concurrent-session files.

## 7. HISTORICAL SNAPSHOT: KEY PATHS (2026-06-21)

- Canonical synthesis: `028/003-spec-data-quality/research/research.md` (the 28 recs, tiered).
- Lineage trail: `028/005/research/lineages/{dq-deep, dq-skilldoc-cmd-ctx, dq-automation-impl, dq-novel-oob, dq-governance-rollout}`.
- The official loop runner: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` (cli-claude-code executor, `configDir` maps to `CLAUDE_CONFIG_DIR=~/.claude-account2`).

## 8. HISTORICAL SNAPSHOT: CONTINUATION PROMPT (2026-06-21)

Resume the 028/005 data-quality phase scaffold: verify the 28 phase spec.md files from workflow w4gvus4y5, generate their metadata with the SCOPED backfill only, wire the 028/005 parent phase-map and children_ids, validate strict, commit and push.

## 9. CURRENT CONTINUATION PROMPT

Resume canonical `003-spec-data-quality` parent governance. Use its `graph-metadata.json` 20-child map, keep readiness at 21/23 P1 until CHK-050/051 have evidence, leave CHK-042 and CHK-143 open, obtain all three sign-offs and two fresh reviews, then rerun strict validation. Do not route current work through former IDs or the historical 28-phase scaffold paths.
