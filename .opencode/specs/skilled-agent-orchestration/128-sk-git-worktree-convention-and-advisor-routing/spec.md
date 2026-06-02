---
title: "Feature Specification: sk-git Worktree Convention (wt/NNNN-name) + Skill-Advisor Routing Optimization"
description: "sk-git documents an unnumbered, ungrouped worktree convention and the skill advisor routes git/worktree intent to sk-git on thin margins; adopt a numbered wt/NNNN-name convention and sharpen sk-git routing."
trigger_phrases:
  - "sk-git worktree convention"
  - "wt/ worktree"
  - "numbered worktree"
  - "skill advisor routing sk-git"
  - "worktree prefix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/128-sk-git-worktree-convention-and-advisor-routing"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level 2 docs for sk-git wt/ convention + advisor routing"
    next_safe_action: "Implement sk-git doc edits, changelog entry, worktree restructure, advisor reindex"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/references/worktree_workflows.md"
      - ".opencode/skills/sk-git/README.md"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/assets/worktree_checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-128-sk-git-worktree"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: sk-git Worktree Convention (wt/NNNN-name) + Skill-Advisor Routing Optimization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-02 |
| **Branch** | `128-sk-git-worktree-convention-and-advisor-routing` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-git's documented worktree convention is directory `.worktrees/{short-desc}` plus branch `type/{short-desc}` with no number and no single grouping namespace, so feature worktrees were created ad-hoc as siblings of the repo with inconsistent prefixes that neither group in the Git UI nor sort in any stable order. Separately, the skill advisor routes git/worktree work to sk-git on thin margins (observed sk-git 0.85/0.16 vs system-spec-kit 0.82/0.22, and sk-code-vs-sk-git ties), so git/worktree/branch/commit/PR intent does not reliably land on sk-git.

### Purpose
Adopt one numbered, grouped worktree convention for named feature worktrees (branch `wt/{NNNN}-{name}`, directory `<repo>/.worktrees/{NNNN}-{name}`) and sharpen sk-git's advisor metadata so git/worktree/branch/commit/PR/merge/finish intent reliably selects sk-git.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Adopt a single convention for NAMED FEATURE worktrees: branch `wt/{NNNN}-{name}` (groups under `wt/` in the Git UI, mirroring the `system-speckit/` branch namespace) and directory `<repo>/.worktrees/{NNNN}-{name}` (the repo-local, gitignored worktree home), where `NNNN` is a 4-digit zero-padded GLOBAL counter assigned as `max(existing NNNN under .worktrees/) + 1`.
- Optimize skill-advisor routing so git/worktree/branch/commit/PR/merge/finish intent reliably selects sk-git: sharpen sk-git trigger phrases/keywords with the new worktree-convention vocabulary (`wt/` worktree, numbered worktree, restructure worktrees, worktree prefix), reduce overlap with system-spec-kit (spec-folders/memory/continuity) and sk-code (code implementation), then rebuild the advisor index.
- Document the per-session ephemeral wrapper exception so the convention boundary is explicit.
- One-time restructure of existing feature worktrees into `.worktrees/{NNNN}-{name}` plus `wt/{NNNN}-{name}`, and pruning of stale detached worktrees.

### Out of Scope
- The per-session ephemeral worktree wrapper (`.opencode/bin/worktree-session.sh`) namespace - it keeps branch `work/{runtime}/{slug}` and dir `.worktrees/{runtime}-{slug}` and stays auto-reaped, because it is a distinct ephemeral lane that is intentionally not renumbered.
- The two worktrees currently being written by live implementation dispatches - their restructure is deferred until those dispatches finish, to avoid disrupting in-flight work.
- Any change to `.gitignore` for `.worktrees/` - it is already gitignored, so no edit is needed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-git/references/worktree_workflows.md` | Modify | Replace `type/{short-desc}` + `.worktrees/{short-desc}` feature examples with `wt/{NNNN}-{name}` + `.worktrees/{NNNN}-{name}` and the NNNN global-counter rule |
| `.opencode/skills/sk-git/README.md` | Modify | Update the Worktree Directory Convention section to the numbered `wt/` convention and document the ephemeral-wrapper exception |
| `.opencode/skills/sk-git/SKILL.md` | Modify | Update branch-naming guidance to `wt/{NNNN}-{name}` and add the new worktree-convention trigger phrases |
| `.opencode/skills/sk-git/assets/worktree_checklist.md` | Modify | Align the checklist steps to the numbered `wt/{NNNN}-{name}` convention |
| `.opencode/skills/sk-git/changelog/` | Create | Add a changelog entry recording the convention adoption and advisor routing change |
| skill-advisor index (advisor MCP) | Modify | Rebuild the advisor index after the SKILL trigger edits so routing reflects the sharpened sk-git metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document the numbered feature-worktree convention consistently | `worktree_workflows.md`, `README.md`, `SKILL.md`, and `worktree_checklist.md` all describe branch `wt/{NNNN}-{name}` plus dir `.worktrees/{NNNN}-{name}`, with NO leftover `type/{short-desc}` or unnumbered `.worktrees/{short-desc}` examples for feature worktrees |
| REQ-002 | Specify the NNNN global-counter allocation rule | The docs state `NNNN` is 4-digit zero-padded and allocated as `max(existing NNNN under .worktrees/) + 1` |
| REQ-003 | Reliable advisor routing to sk-git for git/worktree intent | After SKILL trigger edits plus index rebuild, representative git/worktree/branch/commit/PR/merge/finish prompts route to sk-git as the top recommendation |
| REQ-004 | Record the ephemeral-wrapper exception | The docs state the convention applies to named feature worktrees only and that `worktree-session.sh` keeps `work/{runtime}/{slug}` + `.worktrees/{runtime}-{slug}` auto-reaped |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Add a changelog entry | A new entry exists under `.opencode/skills/sk-git/changelog/` describing the convention adoption and the advisor routing change |
| REQ-006 | Restructure existing feature worktrees and prune stale ones | Existing feature worktrees are moved to `.worktrees/{NNNN}-{name}` + `wt/{NNNN}-{name}`, stale detached worktrees are pruned, and the two in-flight worktrees are deferred until their dispatches finish |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four sk-git docs (`worktree_workflows.md`, `README.md`, `SKILL.md`, `worktree_checklist.md`) describe `wt/{NNNN}-{name}` + `.worktrees/{NNNN}-{name}` with no remaining `type/{short-desc}` or unnumbered feature-worktree examples.
- **SC-002**: A grep for `type/{short-desc}` and unnumbered `.worktrees/{short-desc}` feature examples across the sk-git skill returns no feature-worktree matches.
- **SC-003**: The advisor reliably routes representative git/worktree/branch/commit/PR/merge/finish prompts to sk-git after the rebuild.
- **SC-004**: A sk-git changelog entry exists and the ephemeral-wrapper exception is documented.
- **SC-005**: Existing feature worktrees are restructured and stale worktrees are pruned, with the two in-flight worktrees deferred.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | skill-advisor MCP rebuild | Routing change does not take effect until the index is rebuilt | Edit the durable SKILL trigger data so a single rebuild is sufficient |
| Risk | Churning the shared live ephemeral wrapper | High | Scope the wrapper OUT; it keeps its existing `work/{runtime}/{slug}` namespace |
| Risk | Two live dispatches are writing two worktrees right now | Med | Defer restructure of those two worktrees until their dispatches finish |
| Risk | Advisor MCP flakiness | Low | Edit durable SKILL trigger data so a rebuild alone applies the change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: NNNN allocation scans `.worktrees/` once per new worktree; the scan stays O(number of existing worktrees) and adds no perceptible latency.
- **NFR-P02**: The advisor index rebuild completes in a single invocation with no manual retries.

### Security
- **NFR-S01**: The convention writes only inside `<repo>/.worktrees/` (already gitignored); no path escapes the repo root.
- **NFR-S02**: Doc edits introduce no secrets and no executable side effects beyond the documented worktree commands.

### Reliability
- **NFR-R01**: After the rebuild, representative git/worktree prompts route to sk-git on every run (no flapping between sk-git and system-spec-kit or sk-code).
- **NFR-R02**: The ephemeral wrapper continues to be reaped by `worktree-reaper.sh`, which keys on the `.worktrees/` dir, unaffected by the feature-worktree renumbering.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: No existing worktrees under `.worktrees/` - the first feature worktree is allocated `0001`.
- Maximum length: A long `{name}` is kept readable; only the `NNNN` prefix is fixed-width (4 digits, zero-padded).
- Invalid format: A pre-existing unnumbered or `type/`-prefixed feature worktree is treated as legacy and restructured during the one-time migration.

### Error Scenarios
- External service failure: If the advisor MCP rebuild fails, the durable SKILL trigger edits remain on disk so a later rebuild applies them.
- Network timeout: Not applicable; all work is local file edits plus a local index rebuild.
- Concurrent access: Two live dispatches writing worktrees are excluded from the migration until they finish, avoiding a race on `.worktrees/`.

### State Transitions
- Partial completion: Doc edits and the changelog can land before the worktree restructure; the restructure is independently resumable.
- Session expiry: Not applicable; no long-lived session state is involved.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 4 doc edits + 1 changelog + advisor reindex + one-time worktree restructure |
| Risk | 10/25 | Shared live wrapper and two in-flight worktrees, both mitigated by scoping out / deferral |
| Research | 6/20 | Convention and routing margins already observed; little additional investigation needed |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which exact set of representative git/worktree prompts should be the routing acceptance fixture for sk-git after the rebuild?
- Should the two deferred in-flight worktrees be restructured automatically once their dispatches finish, or left for a follow-up packet?
<!-- /ANCHOR:questions -->
