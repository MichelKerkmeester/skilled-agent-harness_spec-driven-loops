---
title: "Feature Specification: Phase 7 — advisor and integration"
description: "Integrate the folded review capability into the sk-code hub advisor node and repoint every external reference broken by the 004 relocation and 005 fold, via a ground-truth deterministic sweep; keep the legacy alias; defer the advisor-graph rebuild and reindex to main."
trigger_phrases:
  - "sk-code advisor and integration"
  - "sk-code external reference repoint"
  - "sk-code-review advisor merge"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/007-advisor-and-integration"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Repointed all references broken by the relocation/fold and integrated review keywords into the hub advisor node"
    next_safe_action: "phase 008 routing-benchmark-and-review"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7 — advisor and integration

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Accepted / Complete |
| **Created** | 2026-07-04 |
| **Branch** | Worktree for `124-sk-code-parent` integration work |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 9 |
| **Predecessor** | ../006-build-remaining-modes/spec.md |
| **Successor** | ../008-routing-benchmark-and-review/spec.md (planned) |
| **Handoff Criteria** | Every live reference broken by the relocation/fold resolves; the hub advisor node carries the review keywords and no dangling review edges; the legacy alias remains; advisor rebuild + reindex are queued for main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the sk-code parent-skill conversion — the **advisor-and-integration step** after 004 relocated the flat content, 005 folded `sk-code-review`, and 006 built the mode contracts.

Two reference-breakage surfaces had to be repaired:

1. **The 005 fold** deleted `.opencode/skills/sk-code-review/`, so every direct path load of that directory (the `deep-review` agent's `review_core.md`, a deep-loop iteration template, and a within-package rule-copy checker) was broken.
2. **A regression discovered this phase:** the 004 relocation moved `sk-code`'s `scripts/`, `assets/`, and `references/` into the mode packets, but ~20+ external references to those old flat paths were never repointed. This was confirmed load-bearing: `.opencode/hooks/pre-commit` still pointed its comment-hygiene `CHECKER` at the moved `sk-code/scripts/check-comment-hygiene.sh`, so the pre-commit hygiene gate had been **silently skipping since 004** (the "checker not found ... skipping check" banner on every commit was this regression, not a pre-existing condition). The hub's own `graph-metadata.json` `key_files`/`entities`, the `.claude/settings.json` PostToolUse hook, and two CI workflows also pointed at dead paths.

Both surfaces were repaired by a single **deterministic ground-truth sweep**: the exact `old → new` rename pairs were extracted from the 004 (128 pairs) and 005 (42 pairs) commits, plus two explicit mappings for the `code-review` `SKILL.md`/`README.md` that 005 recorded as delete+add rather than rename. The repointer resolves each reference by longest-match (exact-file over derived-directory), validates every target against on-disk existence, and excludes historical archives (`changelog/`, `specs/`) and JS/TS test fixtures (which embed synthetic sk-code paths as assertions).

The hub advisor node then absorbed the folded review identity: the two dangling `sk-code-review` edges were removed, the deleted node's `prerequisite_for → deep-loop-workflows` edge was absorbed, and the review `domains` and `intent_signals` were merged in so the advisor routes review queries to the hub. The legacy `sk-code-review` trigger-phrase alias is retained until the 009 cutover.

**Scope Boundary**: repoint references and integrate the advisor node. Do NOT remove the legacy alias (009). Do NOT rewrite historical archives or corrupt test fixtures. Do NOT run the advisor-graph rebuild or memory reindex here (they require `node_modules/dist` and run on main post-merge).

**Deferred to later phases**:
- **Advisor-graph rebuild + memory reindex** → main post-merge (the derived `skill-graph.json` is regenerated from the node sources edited here).
- **The alias-covered `sk-code-review` NAME references** (agent prose contracts + speckit `baseline:` config) → 009, bundled with alias removal, after 008's routing benchmark validates resolution. These are functional now via the alias; the speckit `baseline:` value has load-vs-route semantics best changed alongside the alias removal.

**Deliverables**:
- All live path references repointed (0 residual broken).
- Hub advisor node integrated (review keywords merged, dangling edges cleaned, alias kept).
- Phase 007 documentation and metadata.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The relocation (004) and fold (005) moved or deleted files that external code and docs still referenced by their old paths. The most serious was a silently-broken pre-commit comment-hygiene gate. Left unrepaired, merging this branch would regress the gate and leave dozens of dead references on main.

### Purpose
Repair every live reference deterministically from ground-truth rename data, integrate the folded review capability into the single hub advisor identity, and stage (not execute) the advisor rebuild for main — while preserving the legacy alias as the back-compat safety net through cutover.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repoint the broken `sk-code-review/` direct path loads (deep-review agent across runtimes, deep-loop iteration template, within-package rule-copy checker).
- Full deterministic sweep of every live external reference to `sk-code`'s old flat paths and to the moved `sk-code-review` files.
- Fix the `check-rule-copies.test.sh` `REPO_ROOT` depth (the script now sits one directory deeper after the fold).
- Integrate the hub advisor node: remove dangling `sk-code-review` edges, absorb the `deep-loop-workflows` prerequisite, merge review `domains` + `intent_signals`, keep the alias trigger-phrase.
- Document the phase.

### Out of Scope
- Removing the legacy `sk-code-review` alias (009).
- Rewriting historical `changelog/` or `specs/` archives (they record prior state).
- Repointing paths inside JS/TS test fixtures (synthetic assertions; repointing would break tests).
- Running the advisor-graph rebuild or memory reindex (main post-merge; needs dist).
- Rewriting the alias-covered `sk-code-review` NAME references in agent prose and speckit `baseline:` config (009, with alias removal).

### Files Changed
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/hooks/pre-commit`, `.opencode/scripts/git-hooks/pre-commit` | Update | Repoint the comment-hygiene checker to `code-quality/scripts/` (restores the gate) |
| `.claude/settings.json` | Update | Repoint the PostToolUse hook command to the moved hook path |
| `.github/workflows/comment-hygiene.yml`, `rule-canary-sync.yml` | Update | Repoint CI script paths |
| `.opencode/skills/sk-code/graph-metadata.json` | Update | Repoint dead key_files; merge review keywords; clean dangling edges; keep alias |
| `.opencode/agents/deep-review.md` (+ `.claude` mirror; `.codex` via symlink) | Update | Repoint `review_core.md` path load |
| `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl` | Update | Repoint `review_core.md` path load |
| `.opencode/skills/sk-code/code-review/scripts/check-rule-copies.{js,test.sh}` | Update | Repoint TARGETS to moved files; fix REPO_ROOT depth |
| ~70 further docs/hooks/scripts across `sk-code`, `system-spec-kit`, `system-code-graph`, plugins, CI | Update | Deterministic path repoint to new mode-packet/shared locations |
| `.opencode/specs/sk-code/017-sk-code-parent/007-advisor-and-integration/` | Create | Phase 007 documentation and metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero broken live references | No live (non-archive, non-fixture) reference resolves to a deleted `sk-code-review/` path or an old flat `sk-code/{scripts,assets,references}/` path |
| REQ-002 | Restore the hygiene gate | `.opencode/hooks/pre-commit` `CHECKER` resolves to an existing checker under `code-quality/scripts/` |
| REQ-003 | Ground-truth, not guessed | Repoint mappings derive from the 004/005 commit rename pairs, longest-match, with every target existence-validated |

### P1 - Required (complete OR user-approved deferral)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Advisor node integrated | Hub `graph-metadata.json` carries review `domains`/`intent_signals`, has no `sk-code-review` edges, absorbs the deep-loop prerequisite, and remains valid JSON |
| REQ-005 | Alias preserved | `sk-code-review` remains in the hub trigger_phrases, mode-registry aliases, and hub-router keywords |
| REQ-006 | No corrupted fixtures/archives | JS/TS test fixtures and `changelog/`/`specs/` archives are untouched |
| REQ-007 | Rebuild staged, not run | Advisor rebuild + memory reindex are documented as main post-merge steps, not executed in the worktree |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: A repo-wide grep for old flat `sk-code/{references,assets,scripts}/` and `sk-code-review/` paths returns only intentional test fixtures (the `zzz-fake-surface` validator setup) and the deleted `graph-metadata.json` (no valid target).
- **SC-002**: The pre-commit `CHECKER`, `.claude/settings.json` PostToolUse hook, the two CI workflows, and the hub `graph-metadata.json` key_files all point at existing files.
- **SC-003**: Hub `graph-metadata.json` is valid JSON, carries the merged review `domains`/`intent_signals`, has 0 `sk-code-review` edges, includes the `deep-loop-workflows` prerequisite, and retains the alias trigger-phrase.
- **SC-004**: The `check-rule-copies.test.sh` `REPO_ROOT` climbs the correct number of levels for the new location.
- **SC-005**: Phase 007 docs record the sweep method, the 004-regression finding, the verification, and the deferred main-side rebuild + 009 alias work.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:research-questions -->
## 6. RESEARCH QUESTIONS (Track R) & CONTEXT TARGETS (Track C)

### Track R — deep-research
- The advisor-integration plan was fixed by the 002 decision; this phase executed it and additionally repaired the newly-found 004 external-reference regression.

### Track C — deep-context
- Confirm the rename maps cover both the relocation and the fold, including the delete+add SKILL.md/README.md gap.
- Confirm no live reference resolves to a deleted or moved path.
- Confirm the advisor node integration preserves the single-identity invariant and the alias.
<!-- /ANCHOR:research-questions -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | LLM path math on 200+ refs | Wrong or broken repoints | Deterministic sweep from ground-truth rename pairs, dry-run reviewed, targets existence-validated |
| Risk | Corrupting test fixtures | Broken tests | Exclude JS/TS test files; keep only real-file consumers (shell `.test.sh`) |
| Risk | Rewriting history | Falsified archives | Exclude `changelog/` and `specs/` |
| Risk | Changing alias-covered config semantics | Speckit review load behavior changes | Defer `baseline:` config + agent NAME prose to 009 with alias removal |
| Dependency | 004 relocation, 005 fold | Complete | Provided the ground-truth rename pairs |
| Dependency | Advisor rebuild + reindex (main) | Pending | Regenerates the derived skill-graph from the node sources edited here |
| Dependency | 008 routing benchmark | Pending | Validates resolution before 009 removes the alias |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS
- The exact consumption semantics of the speckit `baseline:` value (skill-path load vs advisor-routed name) are unconfirmed; the alias covers it, and the repoint is deferred to 009 where the mechanism is resolved alongside alias removal.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- Add L2/L3 addendums for complexity
-->
