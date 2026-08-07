---
title: "Implementation Plan: Deprecate SPECKIT_CODE_GRAPH_INDEX_* Flag Remnants"
description: "Delete .gitattributes and config-content-filters.md, simplify index-scope.ts's dead env-var reads, unregister the local git filter config. Leave the generic sk-git advisory rule untouched."
trigger_phrases:
  - "code graph index flag deprecation plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/004-code-graph-index-flag-deprecation"
    last_updated_at: "2026-08-07T17:37:51Z"
    last_updated_by: "claude-code"
    recent_action: "Planned the removal from the confirmed repo-wide grep results"
    next_safe_action: "Execute steps 1-4 in order"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Deprecate SPECKIT_CODE_GRAPH_INDEX_* Flag Remnants

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`index-scope.ts`), git attributes/config |
| **Framework** | `.opencode/skills/system-spec-kit/mcp-server/lib/utils/index-scope.ts` |
| **Storage** | None — no persistence layer touched |
| **Testing** | Existing `index-scope`-related test coverage (if any), `tsc --noEmit` |

### Overview
Four files carry the maintainer-mode `SPECKIT_CODE_GRAPH_INDEX_*` flag mechanism confirmed dead by repo-wide grep (the config files it targets no longer contain these keys). Delete the two files whose entire content is this mechanism, simplify one live file to drop its now-unreachable env-var branch, and unregister the local git filter definition. Leave the generic sk-git rule engine untouched — it isn't specific to this flag.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Repo-wide grep confirms the complete set of files carrying `SPECKIT_CODE_GRAPH_INDEX_*` or the `maintainer-flags` filter it powers
- [x] Confirmed the sk-git advisory rule is generic, not flag-specific — out of scope
- [x] Confirmed nothing else references `config-content-filters.md`

### Definition of Done
- [ ] `.gitattributes` deleted
- [ ] `index-scope.ts`'s 5 env-var reads removed, per-call overrides unchanged
- [ ] `config-content-filters.md` deleted
- [ ] Local git filter config unregistered
- [ ] `tsc --noEmit` clean, any existing tests for this module pass
- [ ] `git grep "SPECKIT_CODE_GRAPH_INDEX"` outside `specs/` returns empty
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted deletion + one function simplification, verified by repo-wide grep before and after.

### Key Components
- **`.gitattributes`**: declares the filter mapping — deleted entirely, nothing else in the file
- **`index-scope.ts`**: `resolveIndexScopePolicy`/`resolveIncludedSkillsList` — env-var branch removed, explicit-input branch (used by any real caller) unchanged
- **`config-content-filters.md`**: pure documentation of the dead filter — deleted

### Data Flow
No runtime data flow changes. `shouldIndexForCodeGraph`'s behavior for callers that pass explicit `includeSkills`/`includeAgents`/etc. is identical before and after; only the fallback-to-env-var path (which no config file ever exercises) is removed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Delete the dead-content files (read-only-adjacent, low risk)

#### Step 1 — Delete `.gitattributes`
```bash
git rm .gitattributes
```
**Check**: `git status --porcelain -- .gitattributes` shows `D  .gitattributes`; `cat .gitattributes` fails (file gone).
**Rollback**: `git checkout -- .gitattributes` before commit; `git revert` after.

#### Step 2 — Delete `config-content-filters.md`
```bash
git rm .opencode/skills/sk-git/references/config-content-filters.md
```
**Check**: `git grep -l "config-content-filters"` returns empty (nothing else referenced it, confirmed during scoping).
**Rollback**: `git checkout -- <path>` before commit; `git revert` after.

### Phase 2: Simplify the live file

#### Step 3 — Remove the dead env-var reads in `index-scope.ts`
Remove `env.SPECKIT_CODE_GRAPH_INDEX_SKILLS` from `resolveIncludedSkillsList`'s fallback (falls straight to `'none'` when no per-call override is given) and the three `isEnabledEnvValue(env.SPECKIT_CODE_GRAPH_INDEX_*)` fallbacks in `resolveIndexScopePolicy` (falls straight to `false`). Keep the `env` parameter itself unless nothing else in the module uses it after this edit (verify before removing the parameter/type).
**Check**: `tsc --noEmit` on the `mcp-server` package shows 0 new errors; any existing test file exercising `resolveIndexScopePolicy`/`shouldIndexForCodeGraph` still passes with the same assertions (no test should have depended on the env-var path, since nothing ever set those vars in a tracked config file).
**Rollback**: `git checkout -- <path>` before commit; `git revert` after.

### Phase 3: Clean up local machine state (not tracked, this session only)

#### Step 4 — Unregister the local git filter config
```bash
git config --unset filter.maintainer-flags.clean
git config --unset filter.maintainer-flags.smudge
git config --unset filter.maintainer-flags.required
```
**Check**: `git config --get filter.maintainer-flags.required` returns nothing (exit 1).
**Rollback**: N/A — re-running the (now-deleted) installer script would restore it, but there's nothing left for it to manage; not reversible in a meaningful sense, and not needed to be.

### Phase 4: Final verification

#### Step 5 — Repo-wide confirmation
```bash
git grep -l "SPECKIT_CODE_GRAPH_INDEX" -- . ':!specs'
```
**Check**: Empty output — no live code, config, or active documentation references the flag anywhere outside historical `specs/` content.
**Rollback**: N/A — this is the final check, not a mutating step.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Repo-wide grep, before and after | `git grep` |
| Type check | `mcp-server` package | `tsc --noEmit` |
| Unit | `index-scope.ts`'s existing coverage, if any | `vitest` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | — | — | This phase is self-contained; no other phase depends on its ordering |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `tsc --noEmit` shows new errors after step 3, or the post-check grep in step 5 finds an unexpected live reference that step 1-3 didn't account for.
- **Procedure**: `git checkout -- <path>` for any step not yet committed; `git revert <sha>` for a committed step. The local git-config unregister in step 4 is machine-local and not part of any commit.
<!-- /ANCHOR:rollback -->
