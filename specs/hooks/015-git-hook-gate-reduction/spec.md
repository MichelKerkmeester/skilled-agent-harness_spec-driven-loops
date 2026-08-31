---
title: "Feature Specification: Git Hook Gate Reduction"
description: "Three gates were broken, blind, or unreachable; four cost more than they returned. Cut four, fix three, downgrade two — and leave the one gate whose CI backstop does not actually run."
trigger_phrases:
  - "git hook gate reduction"
  - "hook off-switch broken"
  - "mcp mutation regex blind"
  - "mass deletion zero saves"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/015-git-hook-gate-reduction"
    last_updated_at: "2026-08-31T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Cut four gates, fixed three, downgraded two, verified against the hook's own suite"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - ".opencode/scripts/git-hooks/pre-commit"
      - ".opencode/scripts/git-hooks/pre-push"
      - ".opencode/scripts/git-hooks/commit-msg"
      - ".opencode/hooks/hook-flags.env"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-31-git-hook-gate-reduction"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Git Hook Gate Reduction

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` |
| **Handoff Criteria** | Fewer blocking gates, no gate silently guarding nothing, and no enforcement deleted without a backstop that runs |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Thirteen blocking gates across three hooks. Three independent reviews measured them against the
repository's history rather than against intuition, and the count turned out to be the least
interesting thing about them.

**Three gates were not working as believed.** The emergency off-switch is documented in the
config file as `MK_GIT_COMMIT_HOOKS_DISABLED`, but the shell resolver only ever constructs
`SYSTEM_<CONCERN>_DISABLED` and carries no alias table, so uncommenting that line did nothing.
The MCP mutation gate's trigger is anchored one path segment deep; a hub reorganisation moved
nineteen of twenty-one guarded scripts a level below what it can match, so it reported green on a
surface it never looked at. The tool-ownership lint had no path trigger at all, running on every
commit to compare two files that change a handful of times a year.

**One gate has never once prevented anything.** The mass-deletion audit log records ten firings;
every blocked commit is an ancestor of `origin/main`. Each was overridden and landed, including a
2,329-file retirement earlier in this session.

**Several gates judge the working tree rather than the staged change.** In a checkout shared by
concurrent sessions — nineteen worktrees here — those block one session on another session's
uncommitted files. That is what happened repeatedly today, and it is why bypassing them became
reflex: roughly a dozen commits went out with gates disabled that would have passed.

### Purpose

Every remaining blocking gate either guards something irreversible or is the only thing checking
its concern.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The three broken gates.
- The four gates whose cost exceeds their return.
- The two whose CI equivalent genuinely runs on the branches used here.
- The advisory that fires often and is never acted on.

### Out of Scope
- A force-push guard. `git push --force` is unguarded and neither branch is protected, which is
  the one genuinely irreversible operation — the operator declined to add a guard, and adding one
  unasked would be a different change than the one requested.
- The three gates whose CI is `pull_request`-only. Their workflows have effectively never run,
  so cutting them would delete enforcement rather than move it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/hooks/hook-flags.env` | Modify | Off-switch renamed to the prefix the resolver builds |
| `.opencode/scripts/git-hooks/pre-commit` | Modify | Fix the MCP regex, path-gate tool-ownership, cut two gates |
| `.opencode/scripts/git-hooks/pre-push` | Modify | Retire naming, downgrade two metadata gates to warnings |
| `.opencode/scripts/git-hooks/commit-msg` | Modify | Remove the 80-character advisory |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The emergency off-switch works when uncommented. |
| REQ-002 | The MCP mutation gate matches every guarded script on disk. |
| REQ-003 | The gates that guard irreversible or externally-visible actions still block: remote-create, remote-permission, mass-deletion at the push boundary, MCP mutation-class. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The tool-ownership lint runs only when its own inputs are staged. |
| REQ-005 | Gates cut or downgraded are only those with a CI backstop that runs on the branches actually pushed here, or with a measured record of never catching anything. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The MCP gate's pattern matches 21 of 21 scripts, up from 2.
- **SC-002**: A real commit and push complete with the reduced chain, and the hook's own test suite reports the same result as before the change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Cutting a gate whose CI backstop does not run silently removes enforcement | High | Every trigger block was read directly; the three `pull_request`-only workflows were left alone |
| Risk | Editing hook control flow breaks the chain | High | An early attempt did exactly that and removed the remote-permission gates; reverted and redone by forcing an existing tested skip path instead |
| Risk | Fewer gates invites the bypass habit that caused today's problem | Med | The habit was the larger risk; removing the gates that misfire is what makes the survivors credible |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: An ordinary commit spawns no `node` process for tool-ownership.

### Security
- **NFR-S01**: No gate guarding an out-of-repo side effect or an origin write is removed.

### Reliability
- **NFR-R01**: Retired logic stays in place behind a flag rather than being deleted, so restoring it is a one-value change.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A commit touching no MCP script, no agent mirror, and no tool schema now runs no gate logic at all.
- A push of a brand-new branch still stops for a human, which is the one decision a session may not make alone.

### Error Scenarios
- A stale routing manifest now warns instead of blocking; CI fails the push on `main` and `skilled/v*`.

### State Transitions
- Restoring the naming gate is flipping one value back.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Four files |
| Risk | 16/25 | Every commit and push in the repository runs this code |
| Research | 12/20 | Three independent reviews, every load-bearing claim re-verified locally |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The three `pull_request`-only workflows still never run. Either give them a `push:` trigger or accept that their gates are the sole enforcement.
- Nothing guards a force-push, and neither branch is protected. Declined here; still true.
<!-- /ANCHOR:questions -->
