---
title: "Tasks: Deprecate SPECKIT_CODE_GRAPH_INDEX_* Flag Remnants"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "code graph index flag deprecation tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/004-code-graph-index-flag-deprecation"
    last_updated_at: "2026-08-08T10:52:13Z"
    last_updated_by: "claude-code"
    recent_action: "Tasks scoped from plan.md's 5 steps"
    next_safe_action: "Execute T003-T008 in order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-system-speckit-032-relocate-004"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Deprecate SPECKIT_CODE_GRAPH_INDEX_* Flag Remnants

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Repo-wide grep for every `SPECKIT_CODE_GRAPH_INDEX_*` and `maintainer-flags` reference [evidence: `git grep -ln "SPECKIT_CODE_GRAPH_INDEX"` and `git grep -ln "maintainer-flags"` both run, results captured in `spec.md` §3]
- [x] T002 Confirm the sk-git advisory rule and its implementation are generic, not flag-specific [evidence: `SKILL.md`/`scripts/lib/README.md` describe `staged-path-rewritten-by-filter` without naming this flag; `git-rule-checks.mjs` implements it via generic `ctx.filterFor(path)`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Delete `.gitattributes` (`plan.md` §4 Step 1) [evidence: `git rm .gitattributes`; `git status --porcelain -- .gitattributes` shows `D  .gitattributes`]
- [x] T004 [P] Delete `.opencode/skills/sk-git/references/config-content-filters.md` (`plan.md` §4 Step 2) [evidence: `git rm` ran; `git status --porcelain` shows `D`. Deviation from plan: repo-wide grep after deletion found 2 additional live references plan.md's scoping grep had missed — `sk-git/leaf-manifest.json` and `sk-git/leaf-aliases.json` (the hub's own resource manifest, listing this doc as a leaf resource). Fixed via the hub's own regeneration tooling, not hand-edited: `generate-leaf-manifest.cjs --write .opencode/skills/sk-git` (confirmed stale via `--check` first) regenerated `leaf-manifest.json`; `ci-skill-root-metadata.cjs --fix` regenerated the derived `leaf-aliases.json`. That fleet-wide `--fix` run also touched `system-skill-advisor/leaf-aliases.json` for an unrelated pre-existing staleness (`hooks/skill-advisor-hook.md`, confirmed via `git diff` to have nothing to do with this change) — reverted via `git checkout --` to stay scope-locked. Final state: `ci-skill-root-metadata.cjs` reports `sk-git OK`, `system-skill-advisor` back to its pre-existing state]
- [x] T005 Simplify `index-scope.ts`: remove the 5 dead env-var reads, keep per-call overrides (`plan.md` §4 Step 3) [evidence: removed `env.SPECKIT_CODE_GRAPH_INDEX_SKILLS` fallback in `resolveIncludedSkillsList`, the 3 `isEnabledEnvValue(env.SPECKIT_CODE_GRAPH_INDEX_*)` fallbacks in `resolveIndexScopePolicy`, the now-unused `isEnabledEnvValue`/`parseSkillsEnvValue` helpers, the `env` field on `ResolveIndexScopePolicyInput`, and the now-unreachable `'env'` literal from `IndexScopePolicySource`. Verified no external caller ever passed `env` or referenced the `'env'` source literal (`grep -rn "resolveIndexScopePolicy\|IndexScopePolicySource" --include="*.ts"` outside `dist/` returns only this file); per-call override behavior (`includeSkills`/`includeAgents`/etc.) unchanged]
- [x] T006 Unregister the local git filter config on this machine (`plan.md` §4 Step 4) [evidence: `git config --get filter.maintainer-flags.required` returned `true` (exit 0) before, nothing (exit 1) after `git config --unset filter.maintainer-flags.{clean,smudge,required}`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 `tsc --noEmit` on the `mcp-server` package, 0 new errors [evidence: `cd .opencode/skills/system-spec-kit/mcp-server && npx tsc --noEmit`, exit 0, no output; `npm run build` also succeeded, dist rebuilt]
- [x] T008 Repo-wide grep confirms zero live references remain (`plan.md` §4 Step 5) [evidence: `git grep -l "SPECKIT_CODE_GRAPH_INDEX" -- . ':!specs' ':!.opencode/specs'` → no matches (exit 1); `npx vitest run tests/index-scope.vitest.ts` → 8/8 passed, confirming the per-call override path is unchanged]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1 (setup) tasks marked `[x]`
- [x] All Phase 2/3 (execution/verification) tasks marked `[x]` with evidence
- [x] No `[B]` blocked tasks
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
