---
title: "Decision Record: Remote Branch Push Permission Policy"
description: "Decision record documenting the two-layer enforcement architecture, allowlist config format, and the continuous-integration autosync exception."
trigger_phrases:
  - "decision"
  - "record"
  - "remote branch policy"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/015-remote-branch-policy"
    last_updated_at: "2026-07-17T16:01:41Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored ADR-001/002/003, all Accepted"
    next_safe_action: "None — decision record complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-015"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Remote Branch Push Permission Policy

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Two-Layer Enforcement (Agent Behavior + Pre-Push Hook), Not GitHub Rulesets

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-17 |
| **Deciders** | Operator (Michel Kerkmeester), claude-sonnet-5 |

---

<!-- ANCHOR:adr-001-context -->
### Context

The operator wants every push to `origin` outside a small allowlist to require explicit permission, while local branch creation stays free. Three places could enforce this: GitHub-side (rulesets/branch protection), the local pre-push git hook, or sk-git's own agent behavior.

### Constraints

- The repo already has one active GitHub ruleset (`main-protection`), scoped to `main`, with `bypass_actors` granting the repo-owner role an unconditional `"always"` bypass — confirmed via `gh api repos/:owner/:repo/rulesets/11725786`.
- Git hooks cannot interactively "ask" — they only see stdin ref lines and exit codes; there is no reliable TTY when a push is issued by an agent subprocess.
- The normal, wanted workflow (push a feature branch, open a PR) requires SOME non-allowlisted branches to reach origin — a mechanism that just blocks non-allowlisted branch creation outright, with no path to "yes, this one too," would break that workflow.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Enforce with two layers — sk-git's SKILL.md instructs Claude to ask the operator before any push to a non-allowlisted branch (an explicit in-turn push instruction counts as the ask), and the pre-push git hook is a technical backstop that blocks any such push unless `SPECKIT_ALLOW_REMOTE_PUSH=1` is set for that one invocation.

**How it works**: The hook is deterministic (allowlist check, then bypass-var check, then a scoped autosync exception) so it behaves identically for a human at a terminal and an agent-issued push. The agent layer is what actually produces the "ask" — Claude sets the bypass var only after getting a fresh go-ahead in the conversation, never persisting it beyond the single push.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Two-layer (agent ask + hook backstop)** | Works for both agent and manual pushes; matches this repo's existing hook-plus-bypass-var pattern (`SPECKIT_SKIP_PREPUSH_NAMING`) | Hook can't literally "ask" — still relies on the agent layer for the actual confirmation | 9/10 |
| Agent-side only (no hook change) | Simpler; no hook risk | Does nothing for a manual terminal push or a hand-rolled script; no safety net if the agent forgets to ask | 4/10 |
| GitHub ruleset restricting branch creation | Centralized, repo-wide | No "ask" primitive (binary allow/deny only); owner-role bypass is `"always"`, so it doesn't gate the operator at all; would break the push-a-feature-branch-for-a-PR workflow since PR branches are never on a sensible allowlist | 2/10 |

**Why this one**: Only the two-layer approach gives the operator's own manual pushes the same protection as agent-issued ones, while still leaving a clean, scriptable path ("yes, push it") that doesn't require editing GitHub configuration for every new branch.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- No branch reaches `origin` — from any source, human or agent — without either an explicit push instruction or an explicit yes, unless it's on the allowlist.
- The mechanism is entirely local (git hook + skill doc), so it works offline and needs no GitHub API calls or token scopes.

**What it costs**:
- Every push to a non-allowlisted branch, including ones already approved once, needs a fresh go-ahead (operator's explicit choice — see ADR-003). Mitigation: the hook's block message always prints the exact retry command, so the friction is "type one more thing," not "figure out what's wrong."
- Existing remote branches not on the allowlist (e.g. `skilled/0064-spec-root-resolution-impl`) will need the bypass var on their very next push. Mitigation: documented plainly in `spec.md` §6 Risks; not silently grandfathered, since that would contradict the operator's explicit choice.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hook regression blocks `main`/release pushes | H | `main`/`skilled/v*` checked via hardcoded `case`, independent of any sourced function or config file; explicit tests assert this |
| Agent forgets to ask and just sets the bypass var reflexively | M | This is a documentation/behavior risk, not a technical one — SKILL.md states the rule as MANDATORY and ties it to "fresh, in-the-moment go-ahead," matching the existing Workspace Choice Enforcement pattern the skill already uses successfully |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator explicitly asked for this; today NOTHING gates a push based on whether a branch belongs on remote |
| 2 | **Beyond Local Maxima?** | PASS | GitHub ruleset and agent-only alternatives both explicitly investigated and rejected with evidence (gh api output, hook TTY limitation) |
| 3 | **Sufficient?** | PASS | Reuses the existing hook-plus-bypass-var pattern already proven in this repo (`SPECKIT_SKIP_PREPUSH_NAMING`); no new infrastructure |
| 4 | **Fits Goal?** | PASS | Directly implements the operator's stated policy (local free, remote curated, ask every push) |
| 5 | **Open Horizons?** | PASS | Allowlist is a plain text file the operator can extend without touching code, as future long-lived branches appear |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/scripts/git-hooks/pre-push` — new permission gate folded into the existing per-ref loop
- `.opencode/skills/sk-git/scripts/worktree-naming.sh` — new `is_remote_push_allowlisted()` + CLI dispatch
- `.opencode/skills/sk-git/SKILL.md` — new §3 subsection + ALWAYS #18

**How to roll back**: `git revert` the commit(s) implementing this ADR; the hook and skill docs return to naming-only enforcement. No data migration, no GitHub-side config to unwind (none was touched).
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Allowlist Format — Hardcoded Defaults + Operator-Editable Text File

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-17 |
| **Deciders** | claude-sonnet-5 (implementation detail; not put to the operator as a fork) |

---

### Context

The permission gate needs to know which branches are exempt. `main` and `skilled/v*` are already special-cased in the existing naming gate; the operator's own example (`skilled/v4.0.0.0`) matches the release pattern exactly. The gate also needs to be extensible (e.g. a future long-lived `develop` branch) without a code change.

### Constraints

- A fail-open on a missing/broken config source must narrow exemptions, never widen them (spec.md REQ-003) — the two defaults must not live ONLY in an editable file, or deleting that file would either break `main`/release pushes (too strict) or need a separate fail-open path that's easy to get backwards (too risky).

---

### Decision

**We chose**: Hardcode `main` and `skilled/v*` directly in `is_remote_push_allowlisted()` via a `case` statement (checked first, before any file I/O), then optionally extend with glob patterns read from `.opencode/skills/sk-git/scripts/remote-branch-allowlist.txt` — one pattern per line, `#` comments and blank lines ignored, matched via bash `case` (no `eval`, no regex injection surface).

**How it works**: The function returns true immediately for the two hardcoded patterns. Only if neither matches does it look for the config file; a missing, empty, or all-comments file simply means "no additional exemptions" — never an error, never a wider allow.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hardcoded defaults + optional file extension** | Defaults can never disappear; file is purely additive | Two sources of truth (code + file) to read when auditing the full allowlist | 9/10 |
| Config file only (defaults also listed in the file) | Single source of truth | Deleting/corrupting the file loses the `main`/release exemption too — directly violates the "narrow, never widen" fail-safe requirement | 3/10 |
| Env var only (`SPECKIT_REMOTE_ALLOWLIST="main,skilled/v*"`) | No file I/O | Not persistent across shells/sessions; operator would have to re-set it constantly | 3/10 |

**Why this one**: Only the hardcoded-plus-file approach satisfies REQ-003 (fail-open narrows, never widens) while still giving the operator a zero-code way to add more exemptions later.

---

### Consequences

**What improves**: The two branches the operator explicitly cares about (`main`, release branches) can never be silently un-exempted by a file edit mistake; extending the allowlist is a one-line text-file edit.

**What it costs**: Auditing "what's currently exempt" means checking two places (the hardcoded `case` and the file) rather than one. Mitigation: `remote-branch-policy.md` documents both explicitly in one place, and the CLI (`worktree-naming.sh validate-remote-allowlist <branch>`) gives a single command to check either.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operator adds an overly broad glob (e.g. `*`) to the file, defeating the policy | M | Documented in the reference doc as a footgun; not technically prevented, since the operator owns their own allowlist by design |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The gate needs an allowlist source; this isn't optional infrastructure |
| 2 | **Beyond Local Maxima?** | PASS | Config-file-only and env-var-only alternatives considered and rejected with specific fail-safe reasoning |
| 3 | **Sufficient?** | PASS | A `case`-matched text file is the simplest mechanism that satisfies the narrow-not-widen constraint |
| 4 | **Fits Goal?** | PASS | Directly supports "operator can add branches like `v4` without a code change" |
| 5 | **Open Horizons?** | PASS | New allowlist entries never require touching the hook or the validator script |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**: `.opencode/skills/sk-git/scripts/worktree-naming.sh` (new function), `.opencode/skills/sk-git/scripts/remote-branch-allowlist.txt` (new file, comment-only template).

**How to roll back**: Delete the new function and file; the pre-push hook's permission gate call site would need its own revert (tracked under ADR-001).

---

## ADR-003: Continuous-Integration Autosync Exception, Scoped to the Exact Live Branch

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-17 |
| **Deciders** | claude-sonnet-5 (flagged to the operator in spec.md §6 Risks and §11 US-002 for review, not raised as a third clarifying question) |

---

### Context

The operator chose "ask every push" over "ask only at creation" (see spec.md, resolved via clarifying question). Taken completely literally, that would also block every autosync publish from a launch-wrapper session to its live branch — since the live branch is normally an in-progress feature/release-prep branch, not on the allowlist. `git-sync.sh`'s own documented contract is "never asks the caller mid-hook" and "non-fatal by default" (continuous-integration.md).

### Constraints

- Blocking autosync would silently regress a currently-working, separately-documented feature (the "always-current live branch" model) rather than implement a new policy — a mid-hook block is exactly the failure mode `git-sync.sh` is designed never to hit.
- The exception must not become a side channel for pushing arbitrary new branches unasked — it must be provably scoped to the ONE branch the operator already chose as primary/live before any session started.

---

### Decision

**We chose**: Exempt a push from the permission gate ONLY when both `SPECKIT_AUTOSYNC=1` is set AND the branch being pushed exactly equals `$SPECKIT_LIVE_BRANCH`. Any other branch, even with `SPECKIT_AUTOSYNC=1` set, is still gated normally.

**How it works**: The two env vars are exported exclusively by the launch wrapper (`worktree-session.sh`) at session start, based on the primary checkout's OWN branch at that moment — i.e., a branch the operator was already working on directly, not one an agent picked. The gate treats that as pre-existing, session-level permission rather than a per-push ask, consistent with how the wrapper's whole model already treats the live-branch choice as made once, at launch, by the operator aliasing the wrapper.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Exact live-branch scoped exception** | Preserves the continuous-integration feature exactly; provably can't be used for any other branch | Adds one more special case to reason about in the hook | 9/10 |
| Block autosync too (fully literal "ask every push") | Simplest rule, no exceptions | Silently regresses a working, documented feature every time a wrapper session's live branch isn't allowlisted (the common case); commits would strand locally with no visible reason tied to THIS feature | 2/10 |
| Blanket `SPECKIT_AUTOSYNC=1` bypass (any branch) | Simple to implement | Becomes a side channel: setting that one env var would let ANY branch push unasked, defeating the policy | 1/10 |

**Why this one**: Only the exact-match scoping honors both constraints at once — continuous integration keeps working, and the exception can't be (ab)used to smuggle an arbitrary branch past the gate.

---

### Consequences

**What improves**: The "always-current live branch" feature (seconds-behind IDE visibility across concurrent sessions) keeps working exactly as documented, with zero added friction for that one sanctioned path.

**What it costs**: A slightly more complex mental model ("every push asks, except the one the wrapper already established as live"). Mitigation: documented explicitly in `remote-branch-policy.md` and cross-linked from `continuous-integration.md`, so it's never a surprise discovered mid-incident.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Exception treated as a blanket autosync bypass by a future edit | H if it regresses | Test suite includes an explicit NEGATIVE case: `SPECKIT_AUTOSYNC=1` set, but pushing a branch OTHER than `$SPECKIT_LIVE_BRANCH`, must still block |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without it, the literal "ask every push" policy breaks a real, currently-working feature |
| 2 | **Beyond Local Maxima?** | PASS | Blanket bypass and no-exception alternatives both considered and rejected with concrete failure scenarios |
| 3 | **Sufficient?** | PASS | Exact-match scoping is the minimal condition that both preserves the feature and closes the side-channel risk |
| 4 | **Fits Goal?** | PASS | The live branch was already an operator-made choice (picking what to work on directly) before any session existed — treating it as covered is consistent with the rest of the policy's "explicit go-ahead" spirit |
| 5 | **Open Horizons?** | PASS | No future branch can inherit this exception without also becoming the operator's own live branch |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**: The permission-gate block in `.opencode/scripts/git-hooks/pre-push` checks `SPECKIT_AUTOSYNC` + `SPECKIT_LIVE_BRANCH` before falling through to BLOCKED.

**How to roll back**: Remove the exception clause; autosync would then need `SPECKIT_ALLOW_REMOTE_PUSH=1` exported wrapper-wide to keep functioning (not recommended — reintroduces the blanket-bypass risk from the rejected alternative above).
