# Iteration 007 — CLI command mechanics (story-load FILES manifest; verdict ledger)

**Focus:** peck `src/commands/{story,review,init}.ts` + lib/git mechanics vs spec-kit /speckit:resume + graph-metadata + audit model.
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only; orchestrator-written artifacts). **Status:** complete. **newInfoRatio:** 0.62.

## Findings
- **[F-007-01]** `peck story load <id>` emits `{GIT_BRANCH_NAME, FILES}` (all story-dir files) for one-shot context load (`external/peck-master/src/commands/story.ts:91-110`); /speckit:resume loads a prioritized LADDER (handover → continuity → docs → graph-metadata → MCP) (`.opencode/commands/speckit/resume.md:321-327`). GAP real. **ADAPT** · M · low · blast: /speckit:resume output contract + resume YAML.
- **[F-007-02]** adopt the manifest as a SUPPLEMENT not a replacement: spec-kit has resource-map.md + graph-metadata key-file hints but no single JSON-ready FILES list for one-shot reading (`story.ts:106-110` vs `system-spec-kit/SKILL.md:63-65`, `graph-metadata.json:55-75`). GAP partial. **ADAPT** · M · med.
- **[F-007-03]** peck's FILES manifest is shallow/story-local → any spec-kit packet manifest must be PHASE-AWARE (honor `derived.last_active_child_id` / child-phase listing) (`story.ts:101-110` vs `resume.md:113-127`, `resume_auto.yaml:59-65`). GAP partial. **ADAPT** · M · low · blast: phase-parent resume only.
- **[F-007-04]** branch-per-story checkout (`story.ts:95-100,143-150`) is NOT adoptable — spec-kit resume is packet-path/memory based, not branch-mutating (`resume.md:314-319`). GAP none. **SKIP** · high risk · blast: git/worktree safety.
- **[F-007-05]** empty-commit verdict ledger (`review.ts:35-50,72-96`) stays REJECTED — re-confirms the 2026-06-02 anti-teaching (spec-kit audit = changelogs/impl-summary/continuity/eval-DB, not git-coupled) (`peck-teachings-analysis.md:277-280`). GAP none. **SKIP**.

## Ruled out
- T1-T4 not re-derived.
- empty commits as audit trail — re-confirmed rejected.
- branch checkout on resume — skip (git-mutating).

## Verdict contribution
One net-new adoptable mechanic: a **phase-aware packet-load FILES manifest** for /speckit:resume (one-shot file enumeration alongside the existing ladder). **ADAPT** — modest, optional resume enhancement. The git-audit mechanics stay rejected (anti-teaching re-confirmed). Lower priority; a "nice-to-have", not core.
