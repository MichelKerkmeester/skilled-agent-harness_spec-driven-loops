---
title: "Feature Research: Remote Branch Push Permission Policy - Investigation"
description: "Investigation of the current pre-push hook, the continuous-integration autosync model, and GitHub-side ruleset options, to ground the remote-push-permission design."
trigger_phrases:
  - "remote branch policy research"
  - "pre-push hook investigation"
  - "github ruleset investigation"
importance_tier: "normal"
contextType: "general"
---
# Feature Research: Remote Branch Push Permission Policy - Investigation

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 (adapted — internal tooling research, not a library-integration doc; API/CSS/browser-compat sections omitted as not applicable) -->

---

## 1. METADATA

- **Research ID**: RESEARCH-001
- **Feature/Spec**: `sk-git/015-remote-branch-policy` — see `spec.md`
- **Status**: Complete
- **Date Started**: 2026-07-17
- **Date Completed**: 2026-07-17
- **Researcher(s)**: claude-sonnet-5
- **Reviewers**: operator (Michel Kerkmeester) — via 2 clarifying questions, answered before this doc was finalized

---

## 2. INVESTIGATION REPORT

### Request Summary
The operator wants local branch/worktree creation to stay unrestricted, but `origin` to stay curated: only specific branches (e.g. `main`, the `skilled/v4.0.0.0` release branch) should reach remote without asking; everything else needs explicit permission for every push. The task was to determine what in `sk-git` or `.github` needs to change to enforce that.

### Current Behavior
- `git branch -r` (2026-07-17): only `origin/main`, `origin/skilled/0064-spec-root-resolution-impl`, and `origin/skilled/v4.0.0.0` currently exist on remote. `git branch -vv` shows many more LOCAL branches (`sk-doc/0042-...`, `skilled/0055/0062/0063-...`, several legacy `wt/000N-...`), several annotated `[origin/X: gone]` — meaning they were pushed at some point (to open a PR) and the remote ref was deleted after merge. So pushing a branch to open a PR is a normal, wanted part of the existing workflow; the problem is that it currently happens with **no confirmation step at all** outside the finish-flow's own menu.
- `.opencode/scripts/git-hooks/pre-push` already gates **new** remote branch creation, but purely on **naming grammar** (owner-first `OWNER/NNNN-slug`), sourcing validators from `.opencode/skills/sk-git/scripts/worktree-naming.sh`. It already hardcodes two exemptions: `main` and `skilled/v*` release branches (`case "$branch_name" in skilled/v*) continue ;; esac`, plus `is_valid_branch`'s own `[ "$b" = "main" ] && return 0`). Updates to a branch that **already exists** on remote are always allowed regardless of name ("migration tolerance") — there is currently no permission concept at all, only a naming concept.
- The hook has a documented bypass, `SPECKIT_SKIP_PREPUSH_NAMING=1`, and fails OPEN (never blocks) if `worktree-naming.sh` is missing, fails to source, or loads without its validator functions — a deliberate safety property (a broken validator must never turn a normal push into an outage).
- `.opencode/bin/git-sync.sh` (the continuous-integration "autosync" primitive) also calls `git push` — specifically `git push "$REMOTE" "HEAD:$LIVE"` — from the `post-commit` hook of any launch-wrapper session (gated on `SPECKIT_AUTOSYNC=1` + `SPECKIT_LIVE_BRANCH`). Its own documented contract (`continuous-integration.md` §4) is "never asks the caller mid-hook" and "non-fatal by default." Critically, `git-sync.sh` will silently **create** the remote live branch on its first publish if it doesn't exist yet (`if [ -z "$REMOTE_TIP" ]; then git push ... fi`) — this is the second, less obvious path (besides an ordinary `git push`/PR flow) by which a brand-new remote branch can appear with zero confirmation.
- `references/finish-workflows.md` Step 3 already presents an explicit 4-option menu ("1. Merge locally / 2. Push and create a PR / 3. Keep as-is / 4. Discard") and waits for the operator's choice before Option 2 runs `git push -u origin <feature-branch>` — this IS already an explicit, in-turn permission act for that specific push, just with no technical backstop and no coverage of pushes outside that flow.
- `.github/` has one active repository ruleset (`main-protection`, id `11725786`), scoped to `main` only (`ref_name.include: ["~DEFAULT_BRANCH"]`), enforcing PR-required/no-force-push/signed-commits/CodeQL. Its `bypass_actors` list grants `RepositoryRole` id 5 an **"always"** bypass, and `gh api .../rulesets/11725786` confirms `"current_user_can_bypass": "always"` for the authenticated operator account. No ruleset targets any other branch pattern.

### Key Findings
1. **Two independent gates are needed, not one**: the existing hook only asks "is this branch named correctly," never "should this branch exist on origin at all." Naming and remote-push-permission are orthogonal questions and need to stay independently bypassable (`SPECKIT_SKIP_PREPUSH_NAMING` must not silently also skip the permission question, and vice versa).
2. **A hard git hook alone cannot "ask"** — it can only allow or block deterministically (no interactive TTY is available when Claude Code invokes `git push` as a subprocess, and even at a real terminal, reading from `/dev/tty` mid-hook would be a real UX change from this repo's existing hook style, which is uniformly deterministic block + env-var bypass). The actual "ask" has to happen at the **agent behavior layer** (sk-git's SKILL.md instructing Claude to ask the operator in chat before pushing), with the **hook as a technical backstop** that blocks anything pushed without that go-ahead having been translated into `SPECKIT_ALLOW_REMOTE_PUSH=1` for that one invocation.
3. **GitHub-side rulesets cannot enforce "ask"** and are close to moot for this operator specifically: rulesets are binary allow/deny by ref-name pattern and actor, with no confirmation step, and the one existing ruleset already grants the repo-owner role an unconditional bypass. A ruleset restricting branch **creation** to an allowlist would also break the normal "push a feature branch, open a PR" workflow, since PR branches are never on any sensible allowlist. **Conclusion: `.github` is out of scope for the enforcement mechanism** — see Decision Record ADR-001.
4. **The continuous-integration autosync path is a real interaction risk**: `git-sync.sh` publishes to whatever branch the primary checkout happens to be on (`$SPECKIT_LIVE_BRANCH`), which will very often NOT be on the remote allowlist (it's normally an in-progress feature/release-prep branch, not `main`). A blanket permission gate would block every autosync publish, defeating the documented "seconds-behind visibility" feature. This needs a narrow, explicitly-scoped exception (exact branch-name match, not a blanket autosync bypass) — see Decision Record ADR-003.
5. **Finish-flow's Option 2 already satisfies "ask"** for its own pushes — the operator selecting "2. Push and create a Pull Request" from the Step 3 menu is itself an explicit, in-turn go-ahead. The new rule should not force a second, redundant confirmation on top of an instruction the operator just gave; it should instead make sure that flow's `git push` actually clears the new technical gate (by setting the bypass var), and should target agent-initiated pushes that do NOT already carry an explicit in-turn instruction.

### Recommendations

**Primary Recommendation**: Two-layer enforcement — (a) extend the existing pre-push hook with a second, independent "remote-push permission" gate keyed off a small allowlist (`main`, `skilled/v*`, plus an operator-editable config file), fail-safe designed so a missing/broken config can only narrow exemptions, never widen them; (b) add a MANDATORY behavioral rule to sk-git's SKILL.md requiring Claude to get a fresh, in-the-moment go-ahead before every push to a non-allowlisted branch (an explicit user push instruction counts as that go-ahead). Full detail in `decision-record.md` ADR-001/002/003.

**Alternative Approaches**:
- *Agent-side-only (no hook change)*: simpler, but does nothing to stop a manual terminal `git push` or a hand-rolled script from bypassing the policy — rejected because the operator's own manual pushes deserve the same safety net, and this repo's existing hooks already establish the "technical backstop + bypass var" pattern for exactly this kind of policy.
- *GitHub ruleset restricting branch creation*: rejected — no "ask" primitive, owner-role bypass renders it moot for the operator, and it would break the ordinary push-a-feature-branch-for-a-PR workflow (see Key Finding 3).
- *Ask only at first creation, not every push* (the option initially recommended to the operator): rejected by the operator in favor of asking every push — more friction, but nothing reaches origin without a fresh yes in the moment, even for a branch already approved once.

---

## 3. CORE ARCHITECTURE (existing components this feature extends)

### System Components

#### Component 1: `pre-push` git hook
**Purpose**: Runs once per `git push` invocation; reads `<local ref> <local sha> <remote ref> <remote sha>` lines from stdin, one per ref being pushed.

**Responsibilities (today)**: Block a brand-new remote branch whose name breaks the owner-first grammar; always allow updates to a branch already on remote (migration tolerance); fail open if the sourced validator is missing/broken.

**Dependencies**: Sources `.opencode/skills/sk-git/scripts/worktree-naming.sh` for `is_valid_branch` / `is_wrapper_branch`.

#### Component 2: `worktree-naming.sh`
**Purpose**: Owner-first branch/worktree naming allocator + validator; sourceable (validators used by the hook) or directly executable (CLI: `allocate`, `create`, `validate-branch`, etc.).

**Responsibilities relevant here**: Houses the naming grammar validators the hook sources; this is also the natural home for the new remote-push allowlist check, since the hook already sources this exact file and the allowlist reuses the same `main`/`skilled/v*` exemptions the naming grammar already special-cases.

#### Component 3: `git-sync.sh` (continuous-integration autosync)
**Purpose**: Publishes a launch-wrapper session's commits to one shared "live branch" so the operator's IDE stays seconds-behind current.

**Responsibilities**: Fetch → fast-forward-or-rebase → non-force `git push "$REMOTE" "HEAD:$LIVE"`; creates the remote live branch from HEAD on first publish if it doesn't exist; every exit path is non-fatal in `--auto` mode.

**Interaction with this feature**: Its `git push` also runs through `pre-push` — the new gate must not block it for its one sanctioned branch, or the continuous-integration feature silently regresses.

#### Component 4: GitHub repository ruleset (`main-protection`)
**Purpose**: PR-required/no-force-push/signed-commits/CodeQL enforcement on `main` only.

**Findings**: `bypass_actors: [{actor_id: 5, actor_type: "RepositoryRole", bypass_mode: "always"}]`, `current_user_can_bypass: "always"` — confirms this mechanism cannot gate the operator's own pushes and has no "ask" concept; not used for this feature (see ADR-001).

---

## 4. CONSTRAINTS & LIMITATIONS

### Security / Safety Boundaries
- A git hook cannot distinguish "a human typed this at a real terminal" from "an agent issued this as a subprocess" — both go through the same `pre-push` invocation. The design must work correctly (block-by-default, bypass-by-explicit-flag) for both, since it can't tell them apart.
- Fail-open (on a broken/missing validator) is an existing, deliberate property of this hook and must be preserved for the new gate too — but the *allowlist config file* specifically must fail-open only toward the two hardcoded defaults, never toward "everything," since the config file is operator-editable and could be accidentally deleted or emptied.

### Existing Contracts That Must Not Regress
- `git-sync.sh`published as `--auto`: "every exit code `0` so a blocked publish never fails the triggering commit" (continuous-integration.md §2) — the new gate must not turn a live-branch publish into a hard `git push` failure for the wrapper's sanctioned branch.
- `SPECKIT_SKIP_PREPUSH_NAMING=1`'s documented scope is naming only ("skipping branch-naming gate") — extending its meaning to also skip the new permission gate would silently widen an existing, narrowly-scoped bypass; kept independent per Key Finding 1.

---

## 5. TEST-SURFACE INVENTORY (existing `pre-push.test.sh` scenarios affected by this change)

| Existing test | Current expectation | New expectation | Why it changes |
|---|---|---|---|
| "valid new task branch accepted" (`sk-git/0041-fix-thing`, new) | rc=0 | rc=1 by default; rc=0 with `SPECKIT_ALLOW_REMOTE_PUSH=1` | Valid naming no longer implies remote-push permission |
| "legacy update to an existing branch allowed" (`legacy-feature`, update) | rc=0 | rc=1 by default; rc=0 with bypass | Updates to non-allowlisted branches now ask too (operator chose ask-every-push) |
| "SPECKIT_SKIP_PREPUSH_NAMING=1 bypasses the gate entirely" (`totally!!bad`, new) | rc=0 | rc=1 (naming-skip alone); rc=0 only when `SPECKIT_ALLOW_REMOTE_PUSH=1` is also set | Naming-skip and permission-skip are now independent bypasses |
| "owner discovery error fails open" (`sk-git/0041-valid`, new, rigged PATH) | rc=0 | unchanged rc=0, but test now also sets `SPECKIT_ALLOW_REMOTE_PUSH=1` to isolate the naming fail-open assertion from the new gate | Keeps the test's original intent (verify naming fail-open) uncontaminated by the new gate |

Unaffected (already rejected at the naming layer, `continue` before the new gate is ever reached, or exempted before either gate runs): "untracked owner branch rejected", "new wrapper ref rejected", "malformed new branch rejected", "skilled/v9.9.9.9 never blocked", "new backup/* branch rejected", "malformed branch still rejected during discovery error", "broken validator fails open".

---

## 6. OPERATOR DECISIONS (resolved before this doc was finalized)

Two forks were put to the operator via a consolidated question before implementation began:

1. **Ask scope** — "ask only at creation" (recommended) vs. "ask every push." **Operator chose ask every push**: once a branch is approved and pushed, its next push still needs a fresh go-ahead; a prior approval does not carry forward. This is why the pre-push permission gate applies to BOTH new-branch and existing-branch-update refs, not just new ones (a meaningfully bigger technical change than the lighter option would have been).
2. **CLAUDE.md sync** — add a summary row to root `CLAUDE.md` §5 Git Workspace Safety (recommended) vs. leave it untouched. **Operator approved adding the row.**
