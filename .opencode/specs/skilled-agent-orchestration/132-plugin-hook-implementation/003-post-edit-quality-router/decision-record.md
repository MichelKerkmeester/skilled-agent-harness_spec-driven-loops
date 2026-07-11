---
title: "Decision Record: Unified Post-Edit Quality Router"
description: "ADRs for the post-edit quality router: the shared-core-plus-two-adapters boundary and the warn-only, fail-open, no-enforce-in-v1 posture."
trigger_phrases:
  - "post-edit router decision record"
  - "shared core two adapters ADR"
  - "warn-only fail-open ADR"
  - "post-edit-router boundary decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/003-post-edit-quality-router"
    last_updated_at: "2026-07-11T14:17:40Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 decision record from research brief sheet-003"
    next_safe_action: "Move ADR statuses from Proposed to Accepted at implementation kickoff"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs"
      - ".opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh"
      - ".claude/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-post-edit-quality-router"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Unified Post-Edit Quality Router

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: One shared core plus two thin runtime adapters

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-11 |
| **Deciders** | Phase 003 spec author, packet 132 owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed one place to decide which quality checker runs for an edited path. Today the Claude Python hook and any OpenCode wiring each carry their own copy of that decision, so the two runtimes drift whenever a checker is added or reordered. The repo already ships this exact shape twice: `mk-deep-loop-guard` puts policy in a `.cjs` core with a `task-dispatch-guard.cjs` Claude twin, and the sk-code posttooluse hook already shares `dist-freshness.cjs` across skills.

### Constraints

- The five checkers use three incompatible scope units: file (comment-hygiene, validate_flowchart), skill (`frontmatter-versions --skill <name>`), and folder/dir (`check-placeholders <specFolder>`, `check-links <skillDir>`).
- OpenCode's `tool.execute.after` carries no file path, so the OpenCode adapter must correlate a callID captured in `tool.execute.before`.
- The current Claude hook is Python invoked through `python3`, so sharing one core forces a language move to `.cjs`.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Put all dispatch policy in one runtime-neutral `post-edit-router.cjs` core and give each runtime a thin adapter over it.

**How it works**: The core exposes `resolveDispatch(absFilePath, projectDir)`, which walks the dispatch table and returns an ordered list of checker entries, and `runChecks(entries, deadlineMs)`, which runs them and returns bounded findings. The OpenCode plugin and the rewritten Claude `.cjs` hook both call the same two functions and only handle their own runtime plumbing.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared core plus two thin adapters** | One place to add or reorder checkers; both runtimes stay identical; matches two existing precedents | Forces the Claude hook from Python to `.cjs` and one settings.json command swap | 9/10 |
| Duplicate the dispatch table in each runtime | No language change to the Claude hook | Reintroduces the exact drift this phase exists to remove; two copies to keep in sync | 3/10 |

**Why this one**: The shared-core boundary is the point of this phase, and the repo already proves the pattern works. Duplicating the table would ship the problem, not the fix.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Adding or reordering a checker touches one file, and both runtimes pick it up.
- The Claude and OpenCode adapters run byte-identical policy, so they cannot drift.

**What it costs**:
- The Claude hook moves from Python to `.cjs`, which touches one `.claude/settings.json` command string. Mitigation: keep the Python hook on disk until the `.cjs` smoke-passes from the Public root and the Barter symlink, then remove it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Wrong checker variant or path wired into the table (canonical comment-hygiene is under sk-code/code-quality, placeholders under spec/, links under rules/, frontmatter and flowchart under sk-doc) | M | Pin canonical paths in the table and assert them in the unit test. |
| The settings.json command swap breaks the Public root or Barter symlink workspace | L | Dual-workspace smoke gate before removing the Python hook. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The two runtimes duplicate dispatch logic today and can drift on which checker runs for a path. |
| 2 | **Beyond Local Maxima?** | PASS | We weighed table duplication against a shared core and rejected duplication as reshipping the drift. |
| 3 | **Sufficient?** | PASS | One core plus two thin adapters is the smallest structure that removes duplication, and it matches two shipped precedents. |
| 4 | **Fits Goal?** | PASS | The shared-core boundary is the phase goal and sits on the critical path. |
| 5 | **Open Horizons?** | PASS | New checkers and a future enforce mode plug into the core without a per-runtime edit. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- New `.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs` holds `resolveDispatch`, `runChecks`, the dispatch table, and the three-way scope resolver.
- New `.opencode/plugins/mk-post-edit-quality.js` and rewritten `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs` both call the core.

**How to roll back**: Revert the `.claude/settings.json` command to `python3 …claude-posttooluse.sh` (the Python file stays on disk until smoke passes) and delete `.opencode/plugins/mk-post-edit-quality.js` so OpenCode stops auto-loading it.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Warn-only, fail-open, no enforce mode in v1

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-11 |
| **Deciders** | Phase 003 spec author, packet 132 owner |

---

<!-- ANCHOR:adr-002-context -->
### Context

The router runs on every Write/Edit, so a wrong or slow checker could stall or block a developer's session. The five checkers vary in cost and reliability: `frontmatter-versions` is node-backed and exits 2 when node is absent, and `validate_flowchart` always prints verbose output and exits 0 even on warnings. We had to decide how strict the router is and how it behaves when a checker misbehaves.

### Constraints

- The OpenCode `tool.execute.after` hook returns void and cannot block tool completion, and it has no host timeout wrapper like Claude's settings `timeout`.
- The Claude PostToolUse hook already runs on a 9s budget with a `remaining_timeout` carve.
- Any exit outside `{0,1}` means the checker is unavailable, not that the file has a violation.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Ship v1 as observe-only. The router is warn-only and fail-open, and it never blocks the edit.

**How it works**: The core writes no stdout/stderr and never throws, and it resolves any checker error, missing binary, non-{0,1} exit, or exhausted deadline to no finding. The Claude adapter always exits 0, and the OpenCode after-hook returns void. A future env-gated escalation can add an enforce mode, but v1 ships none.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Warn-only, fail-open, no enforce mode** | Never blocks or stalls a session; a broken checker is silent, not disruptive; matches the low-blast, additive goal | Violations are advisory, so a developer can ignore them | 9/10 |
| Add a reject/enforce mode now (like deep-loop's `MK_DEEP_LOOP_GUARD_REJECT` envs) | Can force compliance | High blast radius on a per-edit hook; a flaky checker would block real work; premature for v1 | 3/10 |

**Why this one**: A per-edit hook must never become the thing that blocks an edit. Advisory-first keeps the blast radius low, and the enforce path stays open through the env-gated escalation.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A missing checker, a missing node binary, or a slow checker cannot crash or stall a session.
- The change stays low-blast and purely additive, so nothing that speaks the old contract breaks.

**What it costs**:
- Findings are advisory in v1, so they do not force a fix. Mitigation: reserve an env-gated enforce mode for a later phase, wired through the same core.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| `validate_flowchart` noise on every `.md` edit because it always prints and exits 0 | M | Gate on an is-this-a-flowchart heuristic first, then surface only on exit==1. |
| Cost fan-out because the OpenCode after-hook has no host timeout wrapper | M | Self-bound with an internal deadline plus per-child timeouts, and skip remaining checkers after the deadline. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A per-edit hook that can block or stall a session is a real hazard given node-backed and always-printing checkers. |
| 2 | **Beyond Local Maxima?** | PASS | We weighed an enforce mode against observe-only and rejected enforce as premature and high-blast for v1. |
| 3 | **Sufficient?** | PASS | Warn-only plus fail-open delivers the surfacing value without the blocking risk. |
| 4 | **Fits Goal?** | PASS | Low blast radius and additive behavior are stated goals of this phase. |
| 5 | **Open Horizons?** | PASS | The enforce path stays available through a later env-gated escalation over the same core. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- The core resolves every failure path to an empty finding set and never throws.
- The Claude adapter always exits 0, and the OpenCode after-hook returns void and self-bounds with a deadline.

**How to roll back**: Set the router's kill-switch env to disable dispatch, or remove the plugin and revert the settings.json command. The five checkers keep working through their existing callers.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
