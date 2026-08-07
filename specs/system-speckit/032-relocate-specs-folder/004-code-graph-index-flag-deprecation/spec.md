---
title: "Feature Specification: Deprecate SPECKIT_CODE_GRAPH_INDEX_* Flag Remnants"
description: "Remove the SPECKIT_CODE_GRAPH_INDEX_* maintainer-mode flag mechanism: the git filter that no longer rewrites anything (the flags are absent from every config file it targets), and the dead env-var fallback in index-scope.ts. Keep the generic sk-git advisory rule and index-scope.ts's live per-call override machinery, which are not specific to this flag."
trigger_phrases:
  - "code graph index flag deprecation"
  - "SPECKIT_CODE_GRAPH_INDEX cleanup"
  - "maintainer flags filter removal"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/004-code-graph-index-flag-deprecation"
    last_updated_at: "2026-08-07T17:37:51Z"
    last_updated_by: "claude-code"
    recent_action: "Scoped from a repo-wide grep for every remnant"
    next_safe_action: "Execute the removal per plan.md, then verify"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Deprecate SPECKIT_CODE_GRAPH_INDEX_* Flag Remnants

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete — all 5 plan.md steps executed and verified |
| **Created** | 2026-08-07 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-migration-execution |
| **Successor** | 005-readme-migration-audit |
| **Handoff Criteria** | All 4 in-scope files updated, tests green, no remaining `SPECKIT_CODE_GRAPH_INDEX` hits outside historical spec docs |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the specs-folder relocation specification, added after the operator asked to find and deprecate all `SPECKIT_CODE_GRAPH_INDEX_*` remnants — discovered as a side effect of removing `scripts/setup-maintainer-filters.sh` during phase 11's cleanup. Not part of the specs-root topology work itself; nested here because no other live phase-parent packet fit (the original `system-code-graph` decommission packet that owned this subsystem was already closed and deleted from disk).

**Scope Boundary**: Remove the flag mechanism (git filter + its config, the dead env-var read path) and its owning documentation. Do not touch the generic sk-git advisory rule or `index-scope.ts`'s live per-call override machinery — neither is specific to this flag.

**Dependencies**:
- None. Self-contained cleanup, no other phase depends on this running first or last.

**Deliverables**:
- `.gitattributes` removed (its entire content was this filter mapping)
- `index-scope.ts` simplified: env-var fallback removed, per-call override behavior preserved
- `sk-git/references/config-content-filters.md` removed (describes a filter with nothing left to rewrite)
- Local (per-clone) git config filter definitions unregistered
- `.opencode/bin/mk-spec-memory-launcher.cjs`-style rehydrate instructions in the old doc no longer apply; no replacement needed since there's nothing to rehydrate

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`scripts/setup-maintainer-filters.sh` (removed in this session's step-11 cleanup) installed a git clean/smudge filter keeping `SPECKIT_CODE_GRAPH_INDEX_{SKILLS,AGENTS,COMMANDS,SPECS,PLUGINS}` `"true"` locally for maintainers while committing `"false"`. None of the four files it targeted (`opencode.json`, `.claude/mcp.json`, `.vscode/mcp.json`, `.codex/config.toml`) contain these keys anymore — confirmed via repo-wide grep, all four empty. The filter, its `.gitattributes` declaration, the reference doc describing it, and a dead env-var read path in `index-scope.ts` are now infrastructure for a mechanism with nothing to act on.

### Purpose

Remove the dead flag-specific machinery so the repo doesn't carry filter/doc/code plumbing for a maintainer-mode toggle that no config file uses anymore, while leaving the generic (non-flag-specific) parts — the sk-git advisory rule and `index-scope.ts`'s per-call override support — untouched, since both remain legitimate infrastructure independent of this specific flag.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.gitattributes` — delete (its entire 21-line content is this filter's mapping and rationale comment; nothing else in the file)
- `.opencode/skills/system-spec-kit/mcp-server/lib/utils/index-scope.ts` — remove the 5 `env.SPECKIT_CODE_GRAPH_INDEX_*` reads (`resolveIncludedSkillsList`, and the three `isEnabledEnvValue(env....)` calls in `resolveIndexScopePolicy`); the function's `env` parameter and per-call override inputs (`includeSkills`, `includeAgents`, etc.) stay — those are the still-live mechanism
- `.opencode/skills/sk-git/references/config-content-filters.md` — delete (entirely about this filter; nothing else references it)
- Local (per-clone) git config on this machine — unregister `filter.maintainer-flags.{clean,smudge,required}` (not tracked, machine-local cleanup only)

### Out of Scope

- `sk-git/SKILL.md`'s `staged-path-rewritten-by-filter` advisory rule — generic ("A path here passes through a clean filter"), not specific to `SPECKIT_CODE_GRAPH_INDEX_*`; becomes naturally dormant once `.gitattributes` declares no filters, no edit needed
- `sk-git/scripts/lib/git-rule-checks.mjs` + its test file — implements that same generic rule via `ctx.filterFor(path)`, reusable for any future filter; not deprecated
- `sk-git/scripts/lib/README.md` — same generic rule table entry, no `SPECKIT_CODE_GRAPH_INDEX` mention, no edit needed
- `SPECKIT_CODE_GRAPH_DB_DIR` (a *different* env var, referenced in `sk-git/SKILL.md` for worktree DB isolation) — out of scope; the operator's ask was specifically `SPECKIT_CODE_GRAPH_INDEX_*`, and this is unrelated in purpose (a DB path override, not an indexing-scope flag)
- Any mention inside historical `specs/**` documentation (changelogs, closed decision records) — those are historical record, not live references

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.gitattributes` | Delete | Entire content is this filter's mapping |
| `.opencode/skills/system-spec-kit/mcp-server/lib/utils/index-scope.ts` | Modify | Remove 5 dead env-var reads, keep per-call override support |
| `.opencode/skills/sk-git/references/config-content-filters.md` | Delete | Entirely describes the now-inert filter |
| `.opencode/skills/sk-git/leaf-manifest.json` | Modify (regenerated) | Discovered during execution: dropped the deleted doc's manifest entry via `generate-leaf-manifest.cjs --write` |
| `.opencode/skills/sk-git/leaf-aliases.json` | Modify (regenerated) | Discovered during execution: dropped the deleted doc's alias entry via `ci-skill-root-metadata.cjs --fix` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No `SPECKIT_CODE_GRAPH_INDEX_*` references remain outside historical spec docs | `git grep -l "SPECKIT_CODE_GRAPH_INDEX"` outside `specs/` returns empty |
| REQ-002 | `index-scope.ts`'s per-call override behavior (`includeSkills`, `includeAgents`, etc.) is unchanged | Existing tests for `resolveIndexScopePolicy`/`shouldIndexForCodeGraph` still pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The generic sk-git advisory rule and its implementation are untouched | `git diff` shows no changes under `sk-git/SKILL.md`, `sk-git/scripts/lib/git-rule-checks.mjs`, or its test file |
| REQ-004 | Local git config no longer carries a dead filter definition | `git config --get filter.maintainer-flags.required` returns nothing on this machine |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A repo-wide search for `SPECKIT_CODE_GRAPH_INDEX` finds only historical spec-doc mentions (changelogs, closed decision records), never live code, config, or active documentation.
- **SC-002**: `npx vitest` for `index-scope.ts`'s test coverage (if any exists) passes unchanged, proving the per-call override path wasn't disturbed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing the env-var read accidentally changes default indexing behavior for a caller that relied on setting the env var directly (not through the filter) | Low — the filter was the only mechanism ever documented for setting these vars, and no config file sets them | Grep confirmed zero live setters anywhere in the repo before removing the reader |
| Risk | Deleting `config-content-filters.md` breaks an inbound link from another doc | Low | Confirmed via grep: nothing else references this file's path |
| Dependency | None | — | — |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: `index-scope.ts`'s simplification must not change `shouldIndexForCodeGraph`'s output for any caller that passes explicit `includeSkills`/`includeAgents`/etc. — only the now-dead env-var-only fallback path changes.

---

## 8. EDGE CASES

### Data Boundaries
- What if some other, undiscovered file sets `SPECKIT_CODE_GRAPH_INDEX_*` directly (not through the filter)? The repo-wide grep before removal is the safeguard — if it returns hits after the edit, that's the signal something was missed.

### Error Scenarios
- A caller passing `env: { SPECKIT_CODE_GRAPH_INDEX_SKILLS: 'true' }` explicitly to `resolveIndexScopePolicy` for a test: after this change, that input is simply ignored (no longer read) — the test suite run in REQ-002 is what catches this if any test depended on it.

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Resolved during execution: the initial scoping grep for `config-content-filters` missed two hits in `.opencode/skills/sk-git/leaf-manifest.json` and `leaf-aliases.json` (JSON manifest entries, not prose references). Fixed via the hub's own regeneration tooling (`generate-leaf-manifest.cjs --write`, `ci-skill-root-metadata.cjs --fix`) rather than hand-editing — see `tasks.md` T004 for full evidence.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
