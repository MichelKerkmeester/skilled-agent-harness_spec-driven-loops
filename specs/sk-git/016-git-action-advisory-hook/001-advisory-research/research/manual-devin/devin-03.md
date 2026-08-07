# Devin-03: Per-Rule Encodability Map of sk-git's ALWAYS / NEVER / ESCALATE

**Pass:** 3 of 10 — `manual-devin/devin-03`
**Focus:** Map every sk-git ALWAYS / NEVER / ESCALATE rule to MECHANICAL, PARTIAL, or JUDGEMENT-ONLY. For MECHANICAL and PARTIAL, name the exact pre-execution state the check would read. Be honest about which rules are unencodable.
**Scope:** Findings only. No rule encoding, no hook code. Written only under `research/`.

---

## 0. Method, definitions, and what this pass is NOT

### 0.1 The classification axis

Each rule is classified along exactly one axis — **what a preflight advisory hook could determine BEFORE the target command runs**:

- **MECHANICAL** — a hook can decide this rule from pre-execution state alone. The state exists in git plumbing output (or env vars / the command string) AND the judgement is deterministic. A false positive here is a bug in the check, not an inherent ambiguity.
- **PARTIAL** — a hook can detect the *situation* the rule cares about, but a load-bearing input is the operator's intent, authorization, or a quality judgement the state cannot encode. A rule that fires on the mechanical signal alone WILL generate false positives; the advisory must be worded as "situation X holds — confirm intent," not as "this is wrong."
- **JUDGEMENT-ONLY** — no mechanical check is possible from pre-execution state. Either the rule is a positive obligation with no violating command shape ("remember to clean up"), or the condition is post-execution (conflicts, CI failures, auth errors), or the rule governs a surface the hook cannot see (MCP tool calls, AI conversational behavior). Say so plainly; do not hand-wave these into PARTIAL.

### 0.2 The engine reality (confirmed)

The current `CHECKS` in `dispatch-rule-checks.mjs` are **pure functions of the command string only** — they do not invoke git. A MECHANICAL or PARTIAL classification here means "the state *exists* pre-execution and the judgement *is* deterministic from it"; it does NOT mean the current engine can read it. Whether the engine gains a git-plumbing capability is a phase-002/003 design decision. This pass only establishes which rules are even candidates.

Confirmed by reading `dispatch-rule-checks.mjs` lines 68-97: every `CHECKS` function takes `cmd` (string) and returns boolean. No `child_process`, no `fs` read of repo state. The hook matcher is `Bash` (per `.claude/settings.json`), so the hook only sees shell commands — it never sees MCP tool invocations, which matters for ALWAYS #12.

### 0.3 Enforcement overlap — the noise multiplier

The repo ships blocking hooks: `pre-push` (naming + remote-allowlist permission), `pre-commit` (content gates), `commit-msg` (structure), `post-merge`/`post-rewrite` (drift markers), `autostash-orphan-guard`. A MECHANICAL advisory that duplicates a blocking hook is **pure noise**: the operator gets the advisory line AND the hook's block, and the advisory added nothing but attention cost. Where a rule overlaps enforcement, the classification still names the mechanical state (the question asked), but the finding flags the overlap and the only legitimate advisory framing: "this will be blocked — here is the one-line fix," which saves the round-trip rather than duplicating the gate.

### 0.4 What this pass is NOT

- It is NOT a noise measurement. Devin-02 measured fire rates against reflog history; this pass cites those numbers where they exist and says `not measured` where they do not.
- It is NOT an enumeration of operations. Devin-01 enumerated operations; this pass classifies the *rules*, which are coarser than operations (one rule may govern many operations) and finer in one way (a rule's text often bundles a mechanical part with a judgement part).
- It is NOT a recommendation to encode. A MECHANICAL classification is a necessary condition for encoding, not a sufficient one. Noise and enforcement overlap decide sufficiency, and those are separate passes.

### 0.5 Confidence legend

- **confirmed** — I read the source (hook script, `dispatch-rule-checks.mjs`, `worktree-naming.sh`, the reference doc) or the rule's text unambiguously states the mechanism.
- **inferred** — I reasoned from git semantics and the rule prose; not verified against this repo's running state.

---

## 1. Summary table

| Rule | Class | Encodable core | Judgement gap (PARTIAL) / why not (JUDGEMENT-ONLY) | Enforcement overlap | Conf. |
|---|---|---|---|---|---|
| ALWAYS #1 conventional format | PARTIAL | `-m`/`-F` message structure | type/scope *correctness*; editor message unknown pre-exec | commit-msg (structure) | confirmed |
| ALWAYS #2 worktree for parallel work | JUDGEMENT-ONLY | — | "parallel work" is intent, no violating command | none | inferred |
| ALWAYS #3 branch up-to-date before PR | MECHANICAL | `git rev-list --count HEAD..origin/<base>` | — | none | confirmed |
| ALWAYS #4 owner-first branch naming | MECHANICAL | `-b <name>` arg + `is_valid_branch` | — | pre-push naming gate (redundant) | confirmed |
| ALWAYS #5 spec folder in commit body | PARTIAL | staged paths under `.opencode/specs/` + body scan | "when applicable" is judgement | none | inferred |
| ALWAYS #6 clean up after merge | JUDGEMENT-ONLY | — | positive obligation, no violating command | none | inferred |
| ALWAYS #7 squash for many WIP commits | PARTIAL | commit count in PR range + `--merge` flag | "many" threshold + squash-is-right judgement | none | inferred |
| ALWAYS #8 toolchain/DB on main for large reorg | PARTIAL | `git rev-parse --is-bare-repository` / worktree path | "large reorg" is judgement | none | confirmed |
| ALWAYS #9 scan gitignored leftovers post-rename | JUDGEMENT-ONLY | — | post-merge action, no violating command | none | inferred |
| ALWAYS #10 verify rename R-status | PARTIAL | `git diff --cached --summary` (R vs D+A) | post-merge duplicate-folder check is post-hoc | none | confirmed |
| ALWAYS #11 release body no leading H1 | MECHANICAL | `--notes-file`/`--notes` content | — | none | confirmed |
| ALWAYS #12 route GitKraken MCP to Bash | JUDGEMENT-ONLY | — | hook matcher is `Bash`; MCP calls invisible to it | none | confirmed |
| ALWAYS #13 honor direct-push directive + scope commit | PARTIAL | `git add -A`/`.`/`<dir>` + dirty tree | "operator has bypass authority" is conversational | none | confirmed |
| ALWAYS #14 commit before autostash op | PARTIAL | `--autostash` flag / config + dirty count | "substantial" threshold is judgement | autostash-orphan-guard (safety net, not gate) | confirmed |
| ALWAYS #15 reconcile primary after worktree push | PARTIAL | detached/worktree HEAD + `HEAD:<branch>` refspec | the rule's action is post-push verification | none | confirmed |
| ALWAYS #16 don't hand-roll autosync publish | MECHANICAL | `SPECKIT_AUTOSYNC`/`SPECKIT_LIVE_BRANCH` + refspec | — | none | confirmed |
| ALWAYS #17 reap worktrees before branches | MECHANICAL | `git worktree list` vs `-d <name>` | — | none | confirmed |
| ALWAYS #18 ask before non-allowlisted push | MECHANICAL | refspec target vs allowlist | — | pre-push permission gate (redundant) | confirmed |
| NEVER #1 force push to main/master | MECHANICAL | `--force` flag + refspec target | — | none (pre-push gates naming+allowlist, NOT force-to-main) | confirmed |
| NEVER #2 never create branches directly | MECHANICAL | `git branch`/`checkout -b`/`switch -c` shape | — | none | confirmed |
| NEVER #3 no commit to protected branch w/o auth | PARTIAL | `git symbolic-ref HEAD` vs protected list | "operator authorization" is conversational | none | confirmed |
| NEVER #4 leave worktrees uncleaned | JUDGEMENT-ONLY | — | positive obligation, no violating command | none | inferred |
| NEVER #5 commit secrets | PARTIAL | staged diff + secret patterns | "is this actually a secret" is judgement | pre-commit (likely scans) | confirmed |
| NEVER #6 PRs without description | PARTIAL | `--body`/`--body-file` non-empty | description *quality* is judgement | none | confirmed |
| NEVER #7 merge without CI passing | PARTIAL | `gh pr checks` current status | "wait for completion" is timing judgement | none | confirmed |
| NEVER #8 rebase public/shared branches | MECHANICAL | `git branch -r --contains <branch>` | — | none | confirmed |
| NEVER #9 bypass hook with --no-verify | MECHANICAL | `--no-verify` flag | — | none | confirmed |
| NEVER #10 amend pushed/merged commit | MECHANICAL | `git branch -r --contains HEAD` + tags | — | none | confirmed |
| ESCALATE #1 unresolvable merge conflicts | JUDGEMENT-ONLY | — | conflict state is post-execution | none | confirmed |
| ESCALATE #2 GitHub MCP auth errors | JUDGEMENT-ONLY | — | auth error is a post-execution response | none | confirmed |
| ESCALATE #3 worktree locked/corrupted | MECHANICAL | `git worktree list --porcelain` | — | none | confirmed |
| ESCALATE #4 force-push to protected requested | PARTIAL | `--force` + protected target | "explicit approval" is conversational | overlaps NEVER #1 | confirmed |
| ESCALATE #5 CI fails repeatedly | JUDGEMENT-ONLY | — | post-CI observation, no pre-command state | none | confirmed |
| ESCALATE #6 divergence > 50 commits | MECHANICAL | `git rev-list --count` both directions | — | none | confirmed |
| ESCALATE #7 submodule conflicts | PARTIAL | `git submodule status` pre-merge | "conflicts" specifically is post-execution | none | confirmed |
| ESCALATE #8 strict-validate in bare worktree | MECHANICAL | `git rev-parse --is-bare-repository` / worktree path | — | none | confirmed |

**Tally:** MECHANICAL 13 · PARTIAL 13 · JUDGEMENT-ONLY 9. Of the 26 encodable (MECHANICAL + PARTIAL), 2 are redundant with existing blocking hooks (ALWAYS #4, ALWAYS #18) and 1 overlaps a safety-net guard (ALWAYS #14). The 13 PARTIAL rules are where false positives live — each has a named judgement gap that the state cannot close.

---

## 2. Per-rule findings

Format per finding: rule id + verbatim text (condensed where the rule is long; the full text is in `SKILL.md` lines cited), then **Class**, **Operation**, **Pre-execution state**, **Noise estimate**, **Source**, **Confidence**, and (where relevant) **Encoding note**.

### ALWAYS #1 — deterministic conventional commit format

> "All authored commits follow `type(scope): summary`; preserve the explicitly exempt Git-generated subjects." (SKILL.md L313)

The rule expands into the full **Commit Message Logic** block (SKILL.md L332-481): type selection order, scope selection order, summary construction, body contract, self-check. That block is the deterministic expansion of this rule; classification applies to the bundle.

- **Class:** PARTIAL
- **Operation:** `git commit [-m <msg> | -F <file> | -C <sha> | -c <sha> | (editor)]`
- **Pre-execution state:**
  - For `-m <msg>`: the message string is in the command args → structure fully readable (`type(scope)[!]: summary` regex, type allowlist, scope kebab-case, summary imperative + lowercase + ≤100 chars, `!` requires `BREAKING CHANGE:`).
  - For `-F <file>`: the file path is in the args; the file can be `read` pre-execution → same structure check.
  - For `-C <sha>` / `-c <sha>`: `git log -1 --pretty=%B <sha>` returns the reused message → structure check on it.
  - For editor-only `git commit` (no `-m`/`-F`): the message does not exist pre-execution. **No preflight check is possible for this shape.**
  - Type *correctness* (§3 type-selection order: is `fix` vs `feat` vs `refactor` the right choice for this diff?) requires reading the staged diff AND applying a judgement ordering. The ordering is deterministic given the diff, but the diff-vs-type mapping (e.g. "every substantive changed path is documentation → `docs`") requires `git diff --cached --name-only` + path classification — that is mechanical. What is NOT mechanical is whether a change "adds new usable behavior" (`feat`) vs "improves performance without changing behavior" (`perf`) — that is a judgement about intent the diff alone cannot settle.
  - Scope *correctness* (§4 scope-selection order) is mechanical given `git diff --cached --name-only` mapped against the owner table — but "two independent owners remain → split the commit" is a judgement about whether the owners are truly independent.
- **Noise estimate:** High. Devin-02 measured **1076 plain commits + 7 amends over 34 days (~32/day)** in the primary reflog. A structural advisory on every `git commit` would fire on ~32 commits/day. The `commit-msg` hook already enforces structure and emits clarity warnings; a preflight structural advisory duplicates it. The type/scope-correctness advisory would fire less often but is the PARTIAL false-positive surface. **Not measured for the type-correctness sub-check.**
- **Source:** existing sk-git prose (ALWAYS #1 + Commit Message Logic §1-§7).
- **Confidence:** confirmed (commit-msg hook exists at `.opencode/scripts/git-hooks/commit-msg`; structure is regex-checkable; editor-message gap is git semantics).
- **Encoding note:** The only non-redundant advisory here is the type/scope-correctness layer the `commit-msg` hook explicitly does NOT enforce (it is "structure only" per SKILL.md L337-340). But that is precisely the PARTIAL judgement-gap layer. Encoding it as a hard advisory will produce false positives on `feat`-vs-`perf`-vs-`refactor` boundaries. Recommend: if encoded, word as "type `feat` chosen; staged diff is X files in Y — confirm this adds usable behavior rather than refactoring," never as "wrong type."

### ALWAYS #2 — create worktree for parallel work

> "Never work on multiple features in the same worktree." (SKILL.md L314)

- **Class:** JUDGEMENT-ONLY
- **Operation:** no single violating command shape. The rule governs a workflow-level decision: when starting a second feature, do so in a new worktree rather than the current one.
- **Pre-execution state:** none that captures "this is parallel work" or "this is a second feature." A hook could detect a second `git worktree add` while one worktree is active, but that is the *compliant* path, not the violation. The violation — starting feature B in feature A's worktree — has no command signature; it is a sequence of `git commit` calls that look identical to single-feature work.
- **Noise estimate:** Not applicable (no detectable command shape).
- **Source:** existing sk-git prose (ALWAYS #2).
- **Confidence:** inferred (the rule is a workflow invariant, not a command gate).
- **Encoding note:** Unencodable as a preflight advisory. The rule is already enforced behaviorally by the §3 "Workspace Choice Enforcement" ask-first gate, which is a conversational rule, not a command hook.

### ALWAYS #3 — verify branch is up-to-date before PR

> "Pull latest changes before creating PR." (SKILL.md L315)

- **Class:** MECHANICAL
- **Operation:** `gh pr create [--base <branch>] [--head <branch>]`
- **Pre-execution state:**
  - `git rev-parse --abbrev-ref HEAD` → the head branch.
  - The base branch: from `--base <branch>` flag, or the repo default if absent (`gh repo view --json defaultBranchRef`).
  - `git rev-list --count HEAD..origin/<base>` → commits on origin/base not in HEAD (the "behind" count). If > 0, the branch is not up-to-date.
  - `git fetch` freshness caveat: `origin/<base>` is only as recent as the last fetch. A truly correct check would `git fetch` first, but that mutates state; the advisory can only read the existing remote-tracking ref and note the fetch caveat.
- **Noise estimate:** Not measured. Inferred low-to-medium: the workflow uses rebase-onto-origin + autosync (Devin-02 §1.1: 0 `pull` operations in 34 days), so branches are usually current; the advisory would fire mainly when a session started from a stale fetch.
- **Source:** existing sk-git prose (ALWAYS #3).
- **Confidence:** confirmed (the state is standard git plumbing; `gh pr create` exposes `--base`).
- **Encoding note:** Clean MECHANICAL candidate. The only wrinkle is the fetch-freshness caveat — the advisory should say "HEAD is N commits behind origin/<base> (as of last fetch); pull/rebase before PR," not "branch is behind" categorically.

### ALWAYS #4 — owner-first branch naming

> "Name worktree-created branches with the owner-first grammar `{OWNER}/{NNNN}-{slug}`... Never hand-compute `{NNNN}` — allocate it through `worktree-naming.sh`." (SKILL.md L316)

- **Class:** MECHANICAL
- **Operation:** `git worktree add -b <name> ...` / `git worktree add -B <name> ...` / `git branch <name>` (the latter is NEVER #2, but the naming check applies if it were allowed).
- **Pre-execution state:**
  - The `-b <name>` / `-B <name>` arg → the proposed branch name.
  - `worktree-naming.sh is_valid_branch <name>` → grammar validation (confirmed: the script is at `.opencode/skills/sk-git/scripts/worktree-naming.sh` and is sourced by the pre-push hook, which calls `is_valid_branch`).
  - `{NNNN}` collision: `git for-each-ref --format='%(refname)' refs/heads refs/remotes` + the worktree directory list → does any existing ref/dir already use `{NNNN}`? If the operator hand-computed a number that collides or skips the allocator, this is the signal.
- **Noise estimate:** Low. New worktree branches are infrequent relative to commits. **Not measured** for this specific check; Devin-02 counted 32 linked worktrees total over the window but did not break out creation rate.
- **Source:** existing sk-git prose (ALWAYS #4).
- **Confidence:** confirmed (`worktree-naming.sh` exports `is_valid_branch`; pre-push hook already calls it).
- **Encoding note:** **Redundant with the pre-push naming gate** for any branch that will be pushed. The pre-push hook blocks brand-new remote branches that fail the grammar (confirmed: `.opencode/scripts/git-hooks/pre-push` lines 1-11). A preflight advisory on `git worktree add -b` adds value ONLY for branches that will never be pushed (purely local work) — there, the pre-push gate never runs, so the advisory is the only signal. That is a narrow but real gap. Frame as "branch name fails owner-first grammar; if this branch will be pushed, the pre-push hook will block it."

### ALWAYS #5 — reference spec folder in commit body

> "Include spec folder path in commit body when applicable." (SKILL.md L317)

- **Class:** PARTIAL
- **Operation:** `git commit [-m <msg> | -F <file>]`
- **Pre-execution state:**
  - `git diff --cached --name-only` → are any staged paths under `.opencode/specs/`? If yes, the "applicable" condition is plausibly met.
  - The `-m <msg>` / `-F <file>` body → does it contain a path matching `.opencode/specs/<packet>/`? Regex check.
  - For editor-only `git commit`: body unknown pre-execution (same gap as ALWAYS #1).
- **Noise estimate:** Not measured. Inferred medium: this repo does heavy spec-packet work, so a large fraction of commits touch `.opencode/specs/`. The false-positive surface is "a commit that touches specs incidentally (e.g. a repo-wide rename) but has no spec-folder body" — routine in reorg waves.
- **Source:** existing sk-git prose (ALWAYS #5).
- **Confidence:** inferred (the "when applicable" judgement is the rule's own hedge; the mechanical proxy is "staged paths under specs/").
- **Encoding note:** The judgement gap is the word "applicable." A commit that stages a spec-folder path while fixing an unrelated typo in the same packet is "applicable" by the mechanical proxy but may not warrant a spec-folder reference. Word as "staged paths include `.opencode/specs/<packet>/`; consider referencing the spec folder in the body," never as "missing spec reference."

### ALWAYS #6 — clean up after merge

> "Delete local and remote feature branches after successful merge." (SKILL.md L318)

- **Class:** JUDGEMENT-ONLY
- **Operation:** no violating command shape. The rule is a positive post-merge obligation.
- **Pre-execution state:** none that captures "you have just merged and have not cleaned up." A hook on `git branch -d <name>` could verify the branch is merged (`git branch --merged <target>`), but `git branch -d` already refuses unmerged branches — the rule is redundant with git's own guard for the local case, and for the remote case (`git push origin --delete`) there is no pre-check that says "you should be doing this." The rule tells the operator to perform a step, not to refrain from one.
- **Noise estimate:** Not applicable (no detectable violation).
- **Source:** existing sk-git prose (ALWAYS #6).
- **Confidence:** inferred.
- **Encoding note:** Unencodable as a preflight advisory. This is a "remember to do X after Y" rule; the only mechanical surface is a post-merge reminder, which is not a preflight check on a command.

### ALWAYS #7 — squash commits for clean history

> "Use squash merge for feature branches with many WIP commits." (SKILL.md L319)

- **Class:** PARTIAL
- **Operation:** `gh pr merge [--squash | --merge | --rebase] <pr>`
- **Pre-execution state:**
  - `git rev-list --count <base>..HEAD` (or `gh pr view <pr> --json commits | jq length`) → commit count in the PR range.
  - The `--merge` / `--squash` / `--rebase` flag → the chosen merge method.
  - Mechanical signal: `--merge` (non-squash) + commit count > N → the situation the rule warns about.
- **Noise estimate:** Not measured. The "many WIP commits" threshold is not specified in the rule. Inferred: any threshold chosen (e.g. >5) will fire on a non-trivial fraction of non-squash merges; the false-positive surface is "a feature branch with many *meaningful* commits that should be preserved as a merge, not squashed."
- **Source:** existing sk-git prose (ALWAYS #7).
- **Confidence:** inferred (the rule gives no threshold; "many" is the judgement gap).
- **Encoding note:** The judgement gap is "many" and "squash is the right choice here." A 5-commit feature branch may be 5 logical commits that should survive a merge, or 5 WIP checkpoints that should be squashed — the state cannot tell. If encoded, the threshold must be configurable and the advisory worded as "PR has N commits and you chose --merge; squash is the convention for WIP-heavy branches — confirm this is a preserve-history merge."

### ALWAYS #8 — defer toolchain + DB work to main on large reorgs

> "For large rename/reorg, do file/`git mv` ops in the worktree but run the spec-kit toolchain and ALL memory reindex/re-embed on `main` AFTER merge." (SKILL.md L320)

- **Class:** PARTIAL
- **Operation:** `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ...` / generator / memory-reindex commands run inside a worktree.
- **Pre-execution state:**
  - `git rev-parse --is-bare-repository` → is the cwd a bare worktree?
  - `git worktree list` + cwd → is the cwd a linked worktree (not the primary checkout)?
  - `git rev-parse --show-toplevel` → the worktree root.
  - The command shape: is it a spec-kit toolchain / memory-reindex invocation? Match against known script paths.
- **Noise estimate:** Not measured. Inferred low for the bare-worktree case (reorgs are rare); the linked-worktree case is noisier because the rule's deferral applies specifically to *large* reorgs, and a linked worktree is the normal development environment for all work, not just reorgs.
- **Source:** existing sk-git prose (ALWAYS #8); also ESCALATE #8.
- **Confidence:** confirmed (`git rev-parse --is-bare-repository` and `git worktree list` are standard; ESCALATE #8 names the same detection).
- **Encoding note:** The judgement gap is "large reorg." A strict-validate run inside a linked worktree during normal feature work is NOT a violation — only reorg-scale work triggers the deferral. The mechanical signal (in-worktree + toolchain command) over-fires. ESCALATE #8 is the narrower, fully-mechanical version (strict-validate in a *bare* worktree is always meaningless); ALWAYS #8 is the broader judgement rule. Encode ESCALATE #8 (MECHANICAL); leave ALWAYS #8's "large reorg" judgement to the operator.

### ALWAYS #9 — scan for gitignored leftovers after a rename wave

> "After `git mv` + merge, detect dirs with disk files but 0 tracked files... and `rm -rf` them." (SKILL.md L321)

- **Class:** JUDGEMENT-ONLY
- **Operation:** no violating command shape. The rule is a positive post-merge action (run a scan, then `rm -rf` the cruft).
- **Pre-execution state:** a hook on `rm -rf <dir>` could check `git ls-files <dir>` (empty?) and `git status --porcelain --untracked-files=all` (clean?) — but that is the *compliant* operation the rule tells the operator to perform, not a violation. There is no command that "violates" this rule; the violation is *not running the scan*.
- **Noise estimate:** Not applicable.
- **Source:** existing sk-git prose (ALWAYS #9).
- **Confidence:** inferred.
- **Encoding note:** Unencodable as a preflight advisory. This is a post-merge hygiene step, not a command gate.

### ALWAYS #10 — verify rename history is preserved

> "After a rename wave confirm `R`-status (not delete+add) before commit, and after merge confirm the tree has no old+new duplicate folders." (SKILL.md L322)

- **Class:** PARTIAL
- **Operation:** `git commit` (pre-commit R-status check) — the post-merge duplicate-folder check is post-hoc and not a preflight candidate.
- **Pre-execution state:**
  - `git diff --cached --summary` → emits `rename`/`R` lines for detected renames, `delete`/`create` lines for delete+add pairs.
  - `git diff --cached --find-renames` (or `--find-renames=<threshold>`) → forces rename detection; a delete+add pair that should be a rename shows up here.
  - Mechanical signal: a `delete` + `create` pair on paths that share content above the rename threshold → the situation the rule warns about.
- **Noise estimate:** Not measured. Inferred low outside reorg waves; during reorg waves (the rule's trigger context) it would fire on every commit with un-detected renames, which is the intended signal.
- **Source:** existing sk-git prose (ALWAYS #10).
- **Confidence:** confirmed (`git diff --cached --summary` emits R/D/A status; `--find-renames` controls detection).
- **Encoding note:** The pre-commit half is a clean PARTIAL. The post-merge half ("no old+new duplicate folders") is post-execution and cannot be a preflight advisory — flag it as post-hoc. The judgement gap is the rename-detection threshold: git's default is 50% content similarity; a hook that forces `--find-renames=50%` may still miss a rename that a human would recognize, producing a false "delete+add" warning.

### ALWAYS #11 — GitHub release bodies never start with an H1

> "The release title field already renders `vX.X.X.X — Title`; a body-leading `# vX.X.X.X` duplicates it... strip the leading H1... before `gh release create/edit --notes-file`." (SKILL.md L323)

- **Class:** MECHANICAL
- **Operation:** `gh release create <tag> --notes-file <file>` / `gh release create <tag> --notes <text>` / `gh release edit <tag> --notes-file <file>` / `--notes <text>`
- **Pre-execution state:**
  - For `--notes-file <path>`: `read` the file; check if the first non-blank line starts with `# `.
  - For `--notes <text>`: the text is in the command args; same regex check.
- **Noise estimate:** Not measured. Inferred very low — releases are infrequent (Devin-02 did not break out release frequency, but the workflow publishes via changelog files, so the H1-leading pattern is the specific failure mode).
- **Source:** existing sk-git prose (ALWAYS #11).
- **Confidence:** confirmed (the content is in the command args or a readable file; the H1 check is a one-line regex).
- **Encoding note:** Cleanest MECHANICAL candidate in the set. No judgement gap, no enforcement overlap, low noise. If a phase-002 encoding pass exists, this is the lowest-risk first target.

### ALWAYS #12 — route GitKraken MCP local-mutation tools back to Bash

> "Never call these GitKraken MCP tools (`git_add_or_commit`, `git_push`, `git_pull`, `git_fetch`, `git_checkout`, `git_branch`, `git_worktree`, `git_stash`) as a substitute for the existing Bash-based workflow." (SKILL.md L324)

- **Class:** JUDGEMENT-ONLY (for the `Bash`-matcher hook)
- **Operation:** GitKraken MCP tool calls — these are MCP invocations, not Bash commands.
- **Pre-execution state:** none reachable by this hook. The PreToolUse hook matcher is `Bash` (confirmed: `.claude/settings.json`), so the hook never sees an MCP tool call. The GitKraken tools are invoked through `mcp__code_mode__call_tool_chain` or direct MCP dispatch, neither of which is a Bash command.
- **Noise estimate:** Not applicable to the Bash hook.
- **Source:** existing sk-git prose (ALWAYS #12).
- **Confidence:** confirmed (the hook matcher is `Bash`; MCP calls are a different tool surface).
- **Encoding note:** Unencodable by the current hook surface. If the hook matcher were extended to MCP tool calls, this would become MECHANICAL (match the tool name against the blocked list). That is a hook-surface design decision, not a rule-encodability question. Flag it: the rule IS mechanically checkable, just not by *this* hook.

### ALWAYS #13 — honor direct-push directive + scope the commit

> "Honor an authorized operator's explicit direct-push directive on a protected branch... never blind `git add -A`... scope the commit to the intended files only (a shared or dirty tree may hold concurrent work)." (SKILL.md L325)

This rule bundles two distinct concerns. The first (honor the directive) is a conversational behavior rule. The second (never blind `git add -A`) is the encodable part and is the source of briefing incident #1.

- **Class:** PARTIAL
- **Operation:** `git add -A` / `git add .` / `git add <dir>` / `git add -u`
- **Pre-execution state:**
  - `git status --porcelain` → the full dirty set + dirty count.
  - `git diff --cached --name-only` → what is ALREADY staged (possibly by another session — the incident #1 mechanism: a directory pathspec swept another session's staged deletions into a half-rename).
  - The pathspec arg: is it `-A`/`.` (sweep-all) or a directory pathspec (sweep-that-dir) or an explicit file list?
  - Mechanical signal: `-A`/`.`/`<dir>` pathspec + dirty count > 1 + existing staged set non-empty → the situation where a sweep can ingest another session's work.
- **Noise estimate:** High on `-A`/`.` in any dirty tree (Devin-02 measured the workflow is commit-heavy, ~32 commits/day, implying frequent dirty states). Medium on directory pathspecs. Devin-01 §1a covered this extensively. **Not measured for the specific "swept another session's staged deletions" sub-condition.**
- **Source:** existing sk-git prose (ALWAYS #13); briefing incident #1.
- **Confidence:** confirmed (incident #1 is documented; `git status --porcelain` and `git diff --cached --name-only` expose the state).
- **Encoding note:** The judgement gap is "operator has bypass authority" for the direct-push half — that is conversational and unencodable. The `git add` scoping half is the encodable core. The false-positive surface is "a dirty tree where the operator genuinely wants to stage everything" (e.g. a fresh worktree with only their own work). Word as "`git add -A` will stage N paths including M already-staged by another session; confirm scope," never as "don't use -A."

### ALWAYS #14 — commit substantial work before an autostash-prone operation

> "Before merging/pulling/rebasing a large or shared-branch changeset, COMMIT it... instead of relying on `--autostash`." (SKILL.md L326)

- **Class:** PARTIAL
- **Operation:** `git merge --autostash` / `git pull --autostash` / `git rebase --autostash` / `git pull` (with `pull.rebase=true` + `rebase.autoStash=true` config) / `git merge`/`rebase` (with `rebase.autoStash=true` config)
- **Pre-execution state:**
  - The `--autostash` flag in the command, OR `git config pull.rebase` / `git config rebase.autoStash` → is autostash active implicitly?
  - `git status --porcelain` → dirty count (the uncommitted work that autostash will stash-and-reapply).
  - Mechanical signal: autostash active + dirty count > 0 → the situation the rule warns about.
- **Noise estimate:** Medium. Devin-02 measured 62 merges + ~11 rebases over 34 days (~2/day). The fire rate depends on how often `--autostash` is used with a dirty tree. **Not measured for the autostash-flag sub-condition** (reflog does not record flags). The `autostash-orphan-guard` is a safety net that anchors orphans, so the failure mode is rarer than the situation.
- **Source:** existing sk-git prose (ALWAYS #14); briefing incident #4.
- **Confidence:** confirmed (`git config` exposes autostash settings; `git status --porcelain` exposes dirty count; `autostash-orphan-guard.sh` exists as a safety net).
- **Encoding note:** The judgement gap is "substantial." A 1-file dirty tree autostashed through a rebase is routine and safe; a 93-file dirty tree (incident #4) is the danger. The threshold is not in the rule. The `autostash-orphan-guard` is a post-hoc safety net, not a preflight gate, so there is no enforcement overlap — but the guard's existence means the worst-case (orphaned stash) is recoverable, which lowers the stakes of a false-positive-heavy advisory. If encoded, gate on a configurable dirty-count threshold and word as "autostash will stash N dirty paths; commit first if this is substantial work."

### ALWAYS #15 — reconcile primary checkout after worktree/detached push

> "After `git push origin HEAD:<branch>` from a detached HEAD or isolated worktree, verify the primary checkout's `<branch>` actually contains the pushed commit." (SKILL.md L327)

- **Class:** PARTIAL
- **Operation:** `git push origin HEAD:<branch>` / `git push origin <worktree-branch>:<branch>`
- **Pre-execution state:**
  - `git symbolic-ref HEAD` → does it fail (detached HEAD) or point to a worktree-scoped ref?
  - `git worktree list` + cwd → is the cwd a linked worktree (not the primary checkout)?
  - The refspec `HEAD:<branch>` or `<branch>:<branch>` → is the source a detached/worktree HEAD pushing to a *different* branch that another checkout (the primary) has checked out?
  - `git rev-parse <branch>` vs `git rev-parse HEAD` → will the local `<branch>` ref move? (If pushing `HEAD:<branch>` from a worktree, the local `<branch>` ref in this worktree's repo does not move; the primary checkout's `<branch>` ref does not move either.)
  - Mechanical signal: detached/worktree HEAD + `HEAD:<branch>` refspec where `<branch>` is checked out by another worktree → the situation the rule warns about.
- **Noise estimate:** Low. Devin-02 measured 0 `pull` operations and the workflow uses autosync (ALWAYS #16) for routine publishing; a manual `git push origin HEAD:<branch>` from a worktree is the exception, not the routine. **Not measured for this specific shape.**
- **Source:** existing sk-git prose (ALWAYS #15); briefing incident #2.
- **Confidence:** confirmed (incident #2 is documented; `git symbolic-ref`, `git worktree list`, and the refspec are all pre-execution state).
- **Encoding note:** The rule's *action* (verify + sync the primary checkout) is post-push, so the rule as a whole is not a preflight gate. But the *trigger detection* is fully mechanical pre-execution, and the advisory value is high: warn BEFORE the push that "this push advances origin/<branch> but will not move the local <branch> ref; the primary checkout will not see it until synced." That is a preflight advisory that prevents the "work looks lost" confusion incident #2 describes. The judgement gap is whether the operator already knows this and intends it (routine in the autosync workflow, which is exempted by ALWAYS #16). Gate on `SPECKIT_AUTOSYNC` to suppress the advisory for the exempt lane.

### ALWAYS #16 — don't hand-roll the autosync publish

> "Do NOT manually `git push origin HEAD:<live>` or manually rebase onto the live branch to 'make work visible'... `git-sync.sh` already fast-forwards-or-rebases and never force-pushes." (SKILL.md L328)

- **Class:** MECHANICAL
- **Operation:** `git push origin HEAD:<live>` / `git push origin <branch>:<live>` / `git rebase <onto> <live>` where `<live>` == `$SPECKIT_LIVE_BRANCH`
- **Pre-execution state:**
  - `$SPECKIT_AUTOSYNC` env var → is this a launch-wrapper session with autosync on?
  - `$SPECKIT_LIVE_BRANCH` env var → the live branch name.
  - The push refspec target / the rebase target → does it match `$SPECKIT_LIVE_BRANCH`?
  - Mechanical signal: `SPECKIT_AUTOSYNC=1` + a manual push/rebase targeting `$SPECKIT_LIVE_BRANCH` → the exact hand-roll the rule prohibits.
- **Noise estimate:** Very low. The env vars are only set inside a launch-wrapper session; outside that context the rule does not apply and the check is a no-op.
- **Source:** existing sk-git prose (ALWAYS #16).
- **Confidence:** confirmed (env vars are readable; the refspec is in the command).
- **Encoding note:** Clean MECHANICAL candidate with a built-in noise filter (the `SPECKIT_AUTOSYNC` gate). Low risk, high signal. The only edge case is a wrapper session where the operator intentionally hand-rolls because autosync is blocked — the rule says "resolve per its message; do not force it," so even then the hand-roll is wrong.

### ALWAYS #17 — reap worktrees before branches

> "Always remove the worktree directory (`git worktree remove`) BEFORE deleting its branch (`git branch -d`) — a branch still checked out by a worktree cannot be deleted." (SKILL.md L329)

- **Class:** MECHANICAL
- **Operation:** `git branch -d <name>` / `git branch -D <name>`
- **Pre-execution state:**
  - `git worktree list --porcelain` → which branches are checked out by which worktrees?
  - The `-d <name>` / `-D <name>` arg → is `<name>` currently checked out by a worktree?
  - Mechanical signal: `<name>` is checked out by a linked worktree → `git branch -d/-D` will fail (for `-d`) or forcibly remove the ref while the worktree still references it (for `-D`, which is worse).
- **Noise estimate:** Low. `git branch -d` on a worktree-checked-out branch is rare (git itself refuses for `-d`); the dangerous case is `-D` bypassing the check. **Not measured.**
- **Source:** existing sk-git prose (ALWAYS #17).
- **Confidence:** confirmed (`git worktree list --porcelain` exposes the checkout mapping; `git branch -d` refusal is git semantics).
- **Encoding note:** The "only the exempt wrapper lane" half of the rule governs the reaper script's behavior, not a command gate — that half is not a preflight candidate. The "reap before branches" half is the clean MECHANICAL check above. Note: `git branch -d` already fails safely, so the advisory adds most value for `-D`, where git would otherwise silently remove the ref.

### ALWAYS #18 — ask before every push to a non-allowlisted branch

> "`origin` only ever receives `main`, `skilled/v*` release branches, and anything listed in `remote-branch-allowlist.txt` without asking; every other push needs a fresh, in-the-moment go-ahead first." (SKILL.md L330)

- **Class:** MECHANICAL
- **Operation:** `git push origin <refspec>` / `git push origin <branch>` / `git push origin HEAD:<branch>`
- **Pre-execution state:**
  - The refspec target branch (parse from the push args).
  - `remote-branch-allowlist.txt` (read the file) + the hardcoded `main` and `skilled/v*` patterns.
  - `worktree-naming.sh is_remote_push_allowlisted <branch>` → the same check the pre-push hook runs.
  - `$SPECKIT_ALLOW_REMOTE_PUSH` env var → has this push already been approved? (If set, the advisory should suppress — the operator already said yes.)
  - `$SPECKIT_AUTOSYNC` + `$SPECKIT_LIVE_BRANCH` → is this the continuous-integration exemption? (If the target == `$SPECKIT_LIVE_BRANCH` and autosync is on, exempt.)
- **Noise estimate:** High if gated only on "non-allowlisted branch" — most feature branches are non-allowlisted by design (the allowlist is deliberately small). Devin-02 §1.1 measured the workflow is push-heavy via autosync. **Not measured for the non-allowlined push sub-condition** (reflog records `update by push` but not the branch name pushed to in the primary reflog; remote-tracking reflogs would have it but Devin-02 did not break that out).
- **Source:** existing sk-git prose (ALWAYS #18); remote-branch-policy.md.
- **Confidence:** confirmed (pre-push hook enforces this; `is_remote_push_allowlisted` exists; the allowlist file is readable).
- **Encoding note:** **Redundant with the pre-push permission gate** — the hook blocks the push unless `SPECKIT_ALLOW_REMOTE_PUSH=1`. A preflight advisory cannot add protection; it can only save the round-trip by warning "this push will be blocked; ask first or set `SPECKIT_ALLOW_REMOTE_PUSH=1`." That is a legitimate but narrow value, and it must suppress when `SPECKIT_ALLOW_REMOTE_PUSH=1` is already set (else it fires on every approved push). The continuous-integration exemption (`SPECKIT_AUTOSYNC` + live-branch match) must also suppress. With those suppressions, the noise drops to "non-allowlisted, non-approved, non-autosync pushes" — which is exactly the set the operator should be warned about. This is the canonical example of a MECHANICAL rule that is only worth encoding if the suppression logic is correct.

### NEVER #1 — force push to main/master

> "Protected branches must never receive force pushes." (SKILL.md L484)

- **Class:** MECHANICAL
- **Operation:** `git push --force origin main` / `git push -f origin main` / `git push --force-with-lease origin main` / `git push --force origin master`
- **Pre-execution state:**
  - The `--force` / `-f` / `--force-with-lease` flag.
  - The refspec target branch → is it `main` or `master` (or any configured protected branch)?
- **Noise estimate:** Very low. Force-push to main is rare and universally dangerous. **Not measured.**
- **Source:** existing sk-git prose (NEVER #1).
- **Confidence:** confirmed (the flag and refspec are in the command).
- **Encoding note:** **No enforcement overlap** — the pre-push hook enforces naming + remote-allowlist, NOT force-to-main. This is a real gap in the blocking layer and a clean MECHANICAL advisory candidate. High value, low noise.

### NEVER #2 — never create branches directly

> "Use `git worktree add -b ...`; never use `git branch`, `git checkout` plus `-b`, or `git switch` plus `-c`." (SKILL.md L485)

- **Class:** MECHANICAL
- **Operation:** `git branch <name>` / `git checkout -b <name>` / `git switch -c <name>`
- **Pre-execution state:** the command verb + the `-b`/`-c` flag. No repo state needed — this is a pure command-shape check, which the current engine CAN do (it is a string match like the existing `CHECKS`).
- **Noise estimate:** Low. The workflow routes branch creation through `git worktree add -b` (ALWAYS #4). **Not measured.**
- **Source:** existing sk-git prose (NEVER #2).
- **Confidence:** confirmed (command-shape match; no git plumbing needed).
- **Encoding note:** This is one of the few rules the *current* engine (command-string-only) can check without any new capability. It is the lowest-friction MECHANICAL candidate alongside ALWAYS #11 and NEVER #9.

### NEVER #3 — no commit to protected branch without operator authorization

> "Default to feature branches + PRs. EXCEPTION: when the operator has bypass authority on that branch and explicitly directs a direct commit/push, honor it." (SKILL.md L486)

- **Class:** PARTIAL
- **Operation:** `git commit` (when the current branch is protected) / `git push origin <protected-branch>`
- **Pre-execution state:**
  - `git symbolic-ref HEAD` → the current branch. Is it `main`, `master`, or a configured protected branch?
  - For `git push origin <protected-branch>`: the refspec target.
  - `$SPECKIT_ALLOW_REMOTE_PUSH` → has the push been approved? (For the push half.)
- **Noise estimate:** Medium. Commits to `main` happen in this workflow (the primary checkout is on `skilled/v4.0.0.0` per Devin-02 §0.3, and direct-push directives are honored per ALWAYS #13). The false-positive surface is "the operator has bypass authority and explicitly directed this commit" — which is the rule's own exception and is conversational, not in the state.
- **Source:** existing sk-git prose (NEVER #3); ALWAYS #13 (the exception).
- **Confidence:** confirmed (`git symbolic-ref HEAD` is standard; the authorization gap is the rule's own text).
- **Encoding note:** The judgement gap is "operator authorization," which is the same gap as ALWAYS #13. The two rules are inverses: ALWAYS #13 says "honor the directive," NEVER #3 says "don't commit without the directive." A preflight advisory can only detect the *situation* (committing to a protected branch); it cannot tell whether the directive was given. Word as "committing to protected branch <name>; confirm operator authorization (ALWAYS #13 exception)."

### NEVER #4 — leave worktrees uncleaned

> "Remove worktree directories after merge." (SKILL.md L487)

- **Class:** JUDGEMENT-ONLY
- **Operation:** no violating command shape. This is the inverse of ALWAYS #6 — a positive obligation, not a prohibition on a command.
- **Pre-execution state:** none that captures "you finished and did not clean up."
- **Noise estimate:** Not applicable.
- **Source:** existing sk-git prose (NEVER #4).
- **Confidence:** inferred.
- **Encoding note:** Unencodable. Same reasoning as ALWAYS #6.

### NEVER #5 — commit secrets or credentials

> "Use environment variables or secret management." (SKILL.md L488)

- **Class:** PARTIAL
- **Operation:** `git add <paths>` / `git commit` (the secret enters the staged set at `git add` time)
- **Pre-execution state:**
  - `git diff --cached` → the staged content.
  - Secret-detection patterns: high-entropy strings, `API_KEY=`, `SECRET=`, private key headers (`-----BEGIN ... PRIVATE KEY-----`), `.env` file contents, token patterns (`ghp_`, `gho_`, `sk-` for OpenAI, etc.).
  - Mechanical signal: staged content matches a secret pattern.
- **Noise estimate:** Low frequency, but the false-positive surface is real (high-entropy test fixtures, base64 blobs, example keys in documentation). **Not measured.**
- **Source:** existing sk-git prose (NEVER #5).
- **Confidence:** confirmed (secret scanning is a well-known mechanical technique; the `pre-commit` hook likely already runs a scanner — confirmed by the hook's existence at `.opencode/scripts/git-hooks/pre-commit`).
- **Encoding note:** **Likely overlaps the pre-commit hook**, which is the standard place for secret scanning. A preflight advisory on `git add` would catch the secret BEFORE it enters the staged set (the pre-commit hook catches it after, at commit time). That is a real but narrow value: the secret never enters the index. The judgement gap is "is this actually a secret" — example keys in docs are the classic false positive. If encoded, use a pattern library with a confidence tier and word as "staged content matches secret pattern <name>; confirm this is not a real credential."

### NEVER #6 — create PRs without description

> "Always include context, changes, and testing notes." (SKILL.md L489)

- **Class:** PARTIAL
- **Operation:** `gh pr create --body <text>` / `gh pr create --body-file <file>` / `gh pr create` (no body flag → empty body)
- **Pre-execution state:**
  - The `--body <text>` / `--body-file <file>` arg → is it present? Is the content non-empty? Is it non-trivially different from the repo's PR template (i.e. not just the unfilled template)?
  - Mechanical signal: no `--body`/`--body-file` flag, or empty body, or body == template skeleton.
- **Noise estimate:** Low. PRs are infrequent relative to commits. **Not measured.**
- **Source:** existing sk-git prose (NEVER #6).
- **Confidence:** confirmed (the body is in the command args or a readable file).
- **Encoding note:** The judgement gap is "includes context, changes, AND testing notes" — a non-empty body that is just "fixes bug" satisfies the mechanical check but violates the rule. The mechanical proxy (non-empty, non-template) is a floor, not the full rule. Word as "PR body is empty/template; the rule requires context, changes, and testing notes."

### NEVER #7 — merge without CI passing

> "Wait for all checks to complete." (SKILL.md L490)

- **Class:** PARTIAL
- **Operation:** `gh pr merge <pr>` / `gh pr merge --squash <pr>`
- **Pre-execution state:**
  - `gh pr checks <pr>` → current check statuses (pending / passing / failing).
  - Mechanical signal: any check is pending (not yet complete) or failing.
- **Noise estimate:** Low-medium. The fire rate depends on how often operators merge while CI is still running. **Not measured.**
- **Source:** existing sk-git prose (NEVER #7).
- **Confidence:** confirmed (`gh pr checks` is a standard command; the PR number is in the command args).
- **Encoding note:** The judgement gap is "wait for completion." A preflight check sees the CURRENT status but cannot know if checks will pass when they complete. The rule's intent is "do not merge until CI finishes," which is a timing rule, not a status rule. The mechanical proxy (no pending checks + no failing checks) is correct but may still fire on a legitimately-green PR. Word as "N checks still pending; the rule requires all checks complete before merge."

### NEVER #8 — rebase public/shared branches

> "Only rebase local, unpushed commits." (SKILL.md L491)

- **Class:** MECHANICAL
- **Operation:** `git rebase <branch>` / `git rebase --onto <base> <branch>` / `git rebase -i <branch>`
- **Pre-execution state:**
  - `git for-each-ref --format='%(refname)' refs/remotes` → does a remote-tracking ref exist for `<branch>`?
  - `git rev-list --count <branch>..origin/<branch>` → are there commits on `origin/<branch>` not in the local `<branch>` (i.e. the local is behind)?
  - `git rev-list --count origin/<branch>..<branch>` → are there local commits on `<branch>` that are NOT on origin (i.e. unpushed)? If 0, the branch is fully pushed and rebasing it rewrites published history.
  - Mechanical signal: `origin/<branch>` exists AND local `<branch>` has commits not on origin (i.e. there ARE unpushed commits — the rule ALLOWS rebasing these) — wait, the rule says "only rebase local, unpushed commits." So the violation is rebasing commits that ARE pushed. The signal is: `git log origin/<branch>..<branch>` is empty (nothing unpushed) AND the rebase target moves commits that are on origin. More precisely: is any commit in the rebase range already on a remote? `git branch -r --contains <commit>` for each commit in the range.
- **Noise estimate:** Low. The workflow uses rebase-onto-origin as a sync mechanism (Devin-02 §1.1: ~11 rebases over 34 days), but those rebases are of unpushed work onto origin, which is the allowed case. **Not measured for the violation shape specifically.**
- **Source:** existing sk-git prose (NEVER #8).
- **Confidence:** confirmed (`git branch -r --contains` and `git for-each-ref refs/remotes` are standard).
- **Encoding note:** The precise mechanical signal requires checking each commit in the rebase range against `git branch -r --contains`, which is more expensive than a single plumbing call but still pre-execution. A cheaper proxy: if `origin/<branch>` exists and the rebase target is an ancestor of `origin/<branch>`, the rebase may rewrite pushed commits — warn. The cheap proxy has false positives (rebasing unpushed commits onto a pushed base is allowed); the per-commit check is exact.

### NEVER #9 — bypass a git hook with --no-verify

> "Never skip commit-msg, pre-commit, or pre-push validation with `--no-verify`; if a hook is genuinely wrong about a specific case, fix the hook or use its own documented override." (SKILL.md L492)

- **Class:** MECHANICAL
- **Operation:** `git commit --no-verify` / `git push --no-verify`
- **Pre-execution state:** the `--no-verify` flag in the command. Pure command-shape check — no git plumbing needed.
- **Noise estimate:** Very low. `--no-verify` is an explicit bypass flag; its presence is the signal. **Not measured.**
- **Source:** existing sk-git prose (NEVER #9).
- **Confidence:** confirmed (command-shape match).
- **Encoding note:** The current engine can check this with no new capability (string match, like the existing `CHECKS`). The rule's exception ("use the hook's own documented override," e.g. `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1`) is a different env var, not `--no-verify`, so the check does not need to distinguish — `--no-verify` is always the wrong bypass. Clean MECHANICAL candidate.

### NEVER #10 — amend a commit that has already been pushed or merged

> "Rewriting published history breaks other clones' ancestry and any autosynced live branch; commit a new change (or `git revert`) instead." (SKILL.md L493)

- **Class:** MECHANICAL
- **Operation:** `git commit --amend` / `git commit --amend --no-edit`
- **Pre-execution state:**
  - `git rev-parse HEAD` → the commit about to be amended.
  - `git branch -r --contains <sha>` → is HEAD on any remote-tracking branch? (If yes, it has been pushed.)
  - `git for-each-ref --format='%(refname)' refs/tags --contains <sha>` → is HEAD contained in any tag? (If yes, it has been released.)
  - `git for-each-ref --format='%(refname)' refs/heads --merged <sha>` → is HEAD merged into any other local branch? (Weaker signal — local merges are less catastrophic but still rewrite ancestry.)
  - Mechanical signal: HEAD is reachable from any remote-tracking ref or tag → amending rewrites published history.
- **Noise estimate:** Low. Devin-02 measured 7 `commit --amend` operations over 34 days (~0.2/day). The fire rate on the violation shape (amend of a pushed commit) is a subset. **Not measured for the pushed-sub-condition.**
- **Source:** existing sk-git prose (NEVER #10).
- **Confidence:** confirmed (`git branch -r --contains` and `git for-each-ref --contains` are standard; devin-01 §1b covered this).
- **Encoding note:** Clean MECHANICAL candidate. The autosync interaction (amending a commit that the `post-commit` hook already published to the live branch) is the specific danger the rule names — `SPECKIT_AUTOSYNC=1` + `git commit --amend` is an even stronger signal than the remote-contains check, because autosync publishes within seconds of the original commit. Gate on both: remote-contains OR autosync-active.

### ESCALATE #1 — merge conflicts cannot be auto-resolved

> "Complex conflicts require human decision on which changes to keep." (SKILL.md L497)

- **Class:** JUDGEMENT-ONLY
- **Operation:** `git merge` / `git rebase` / `git cherry-pick` — but the conflict state is produced BY the operation, not before it.
- **Pre-execution state:** none. Conflict markers do not exist until the merge/rebase/cherry-pick runs and fails. A preflight advisory cannot see whether a merge will conflict without running it (and running it IS the operation).
- **Noise estimate:** Not applicable (post-execution condition).
- **Source:** existing sk-git prose (ESCALATE #1).
- **Confidence:** confirmed (conflicts are post-execution by definition).
- **Encoding note:** Unencodable as a preflight advisory. This is a post-hoc escalation rule, surfaced by the operation's failure, not before it.

### ESCALATE #2 — GitHub MCP returns authentication errors

> "Token may be expired or permissions insufficient." (SKILL.md L498)

- **Class:** JUDGEMENT-ONLY
- **Operation:** `gh <command>` / GitHub MCP calls — but the auth error is a post-execution response.
- **Pre-execution state:** none that captures the auth error. A hook COULD pre-check `gh auth status` before a `gh` command, but the rule as written is about the error response, not pre-checking. The briefing's incident #3 (active `gh` account was not the remote owner) IS pre-checkable: `gh auth status` returns the authenticated user, and the remote owner is knowable from `git remote get-url origin` + a repo lookup. But that is a DIFFERENT mechanical check from the rule as written; it would be a new rule, not an encoding of ESCALATE #2.
- **Noise estimate:** Not applicable for the rule as written. The incident #3 pre-check (account-vs-remote-owner) would be low-noise but is a new rule.
- **Source:** existing sk-git prose (ESCALATE #2).
- **Confidence:** confirmed (auth errors are post-execution responses).
- **Encoding note:** Unencodable as written. The incident #3 case is a candidate for a NEW rule (see §3 below) — pre-check `gh auth status` against the remote owner before any `gh` command that pushes or writes. Flag the gap: ESCALATE #2's text is about the failure, but the pre-checkable signal (wrong account) is adjacent, not the same.

### ESCALATE #3 — worktree directory is locked or corrupted

> "May require manual cleanup with `git worktree prune`." (SKILL.md L499)

- **Class:** MECHANICAL
- **Operation:** `git worktree add <path>` / `git worktree remove <path>` / `git worktree lock`/`unlock`
- **Pre-execution state:**
  - `git worktree list --porcelain` → emits `locked` lines for locked worktrees, and shows worktree paths; a missing/corrupted worktree directory (registered but not on disk) is detectable by comparing the listed paths against the filesystem.
  - Mechanical signal: a registered worktree is locked, or its directory is missing while still registered.
- **Noise estimate:** Very low. Locked/corrupted worktrees are rare. **Not measured.**
- **Source:** existing sk-git prose (ESCALATE #3).
- **Confidence:** confirmed (`git worktree list --porcelain` exposes `locked` and the path list).
- **Encoding note:** Clean MECHANICAL candidate. The check should run before `git worktree add` (warn if a conflicting/corrupted worktree exists) and before `git worktree remove` (warn if the target is locked).

### ESCALATE #4 — force push to protected branch is requested

> "This requires explicit approval and understanding of consequences." (SKILL.md L500)

- **Class:** PARTIAL
- **Operation:** `git push --force origin <protected-branch>` / `git push -f origin <protected-branch>` / `git push --force-with-lease origin <protected-branch>`
- **Pre-execution state:** same as NEVER #1 — the `--force` flag + the refspec target. The detection is identical to NEVER #1; the difference is the rule's framing (ESCALATE = "requires approval," NEVER = "must never").
- **Noise estimate:** Very low. **Not measured.**
- **Source:** existing sk-git prose (ESCALATE #4); overlaps NEVER #1.
- **Confidence:** confirmed.
- **Encoding note:** NEVER #1 and ESCALATE #4 govern the same operation shape. NEVER #1 says "never"; ESCALATE #4 says "requires approval." These are in tension: the operator CAN force-push a protected branch with explicit approval (ESCALATE #4), but NEVER #1 says "must never." The resolution is in the rule text: NEVER #1 is the default, ESCALATE #4 is the exception path. A preflight advisory should detect the shape (MECHANICAL) and surface BOTH rules: "force-push to protected branch <name>: NEVER #1 prohibits this; ESCALATE #4 requires explicit approval — confirm the operator has approved." The judgement gap is "explicit approval," which is conversational.

### ESCALATE #5 — CI/CD pipeline fails repeatedly

> "May indicate infrastructure issues beyond code problems." (SKILL.md L501)

- **Class:** JUDGEMENT-ONLY
- **Operation:** no single command. The condition is a pattern across multiple CI runs, observed post-execution.
- **Pre-execution state:** none. "Fails repeatedly" is a temporal pattern over past CI runs; a preflight advisory on `gh pr merge` could check `gh pr checks` for current failures, but "repeatedly" (the escalation trigger) requires run history that `gh pr checks` does not directly expose in a preflight-friendly way.
- **Noise estimate:** Not applicable (post-CI observation).
- **Source:** existing sk-git prose (ESCALATE #5).
- **Confidence:** confirmed (the condition is a pattern over past runs, not a pre-command state).
- **Encoding note:** Unencodable as a preflight advisory. The "repeatedly" threshold is also a judgement. This is an observation-time escalation, not a command gate.

### ESCALATE #6 — branch divergence exceeds 50 commits

> "Large divergence suggests need for incremental merging strategy." (SKILL.md L502)

- **Class:** MECHANICAL
- **Operation:** `git merge <branch>` / `git rebase <branch>` / `gh pr create` / `gh pr merge`
- **Pre-execution state:**
  - `git rev-list --count HEAD..<branch>` → commits on `<branch>` not in HEAD (behind count).
  - `git rev-list --count <branch>..HEAD` → commits on HEAD not in `<branch>` (ahead count).
  - Mechanical signal: either count > 50 (the rule's threshold is explicit).
- **Noise estimate:** Very low. Divergence > 50 commits is rare in a workflow that rebase-syncs frequently (Devin-02 §1.1: ~11 rebases + 62 merges over 34 days, suggesting frequent sync). **Not measured.**
- **Source:** existing sk-git prose (ESCALATE #6).
- **Confidence:** confirmed (the threshold is explicit in the rule; `git rev-list --count` is standard).
- **Encoding note:** Cleanest MECHANICAL candidate in the ESCALATE set — the threshold is numeric and explicit, no judgement gap. Low noise, high signal.

### ESCALATE #7 — submodule conflicts detected

> "Submodule updates require careful coordination." (SKILL.md L503)

- **Class:** PARTIAL
- **Operation:** `git merge` / `git rebase` / `git pull` involving submodules
- **Pre-execution state:**
  - `git submodule status` → are there submodules? Are any at a different SHA than the index expects?
  - `git diff --cached --submodule` → staged submodule changes.
  - Mechanical signal: submodules exist AND have changes staged or pending → the situation the rule warns about.
  - The "conflicts" specifically are post-execution (a merge produces submodule conflicts), but the PRESENCE of submodules with changes is pre-execution.
- **Noise estimate:** Very low — this repo does not appear to use submodules (no `.gitmodules` was observed in the skill directory; would need a repo-root check to confirm). **Not measured.**
- **Source:** existing sk-git prose (ESCALATE #7).
- **Confidence:** confirmed (`git submodule status` is standard; the conflict-vs-change distinction is the judgement gap).
- **Encoding note:** The judgement gap is "conflicts" vs "changes." Pre-execution, a hook can see that submodules have changes but cannot see whether a merge will conflict. The advisory value is "this merge involves submodule updates — ESCALATE #7 says these require careful coordination," which is a heads-up, not a conflict prediction. If the repo has no submodules, this check is a no-op (zero noise).

### ESCALATE #8 — strict-validate run inside a bare worktree

> "Its exit code is meaningless (missing gitignored deps may make it silently no-op on zero files). Re-run on `main` post-merge before trusting any result." (SKILL.md L504)

- **Class:** MECHANICAL
- **Operation:** `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` / other strict-validate invocations
- **Pre-execution state:**
  - `git rev-parse --is-bare-repository` → is the cwd a bare worktree?
  - `git worktree list` + cwd → is the cwd a linked worktree that lacks gitignored deps (the rule's concern is bare worktrees specifically, but a linked worktree without symlinked `node_modules`/`dist` has the same problem)?
  - The command shape: is it a strict-validate invocation? Match against the validate.sh path.
- **Noise estimate:** Very low — strict-validate runs are infrequent, and the bare-worktree case is specifically a reorg-time mistake. **Not measured.**
- **Source:** existing sk-git prose (ESCALATE #8); large-reorg-playbook.md.
- **Confidence:** confirmed (`git rev-parse --is-bare-repository` is standard; the rule's text is explicit about the bare-worktree condition).
- **Encoding note:** Clean MECHANICAL candidate. This is the narrower, fully-mechanical version of ALWAYS #8 (which has the "large reorg" judgement gap). Encode ESCALATE #8 (bare worktree → always warn); leave ALWAYS #8's "large reorg" judgement to the operator. The two rules are a MECHANICAL/PARTIAL pair on the same surface.

---

## 3. Gaps the classification exposes

These are not new rules — they are places where the existing rule set has a mechanical signal that the rule text does not name, or a pre-checkable condition adjacent to a post-execution rule. The next phase should decide whether each becomes a new rule or a note on an existing one.

1. **ESCALATE #2 vs incident #3.** ESCALATE #2 is post-execution (auth error response). Incident #3 (active `gh` account ≠ remote owner) is pre-execution: `gh auth status` returns the authenticated user; `git remote get-url origin` + a repo owner lookup gives the remote owner. These are different checks. The pre-checkable one has no rule today. **Candidate new rule**, MECHANICAL, low noise (fires only when account ≠ owner, which is a misconfiguration, not a routine state).

2. **ALWAYS #15's trigger vs ALWAYS #16's exemption.** ALWAYS #15 (reconcile primary after worktree push) and ALWAYS #16 (don't hand-roll autosync publish) govern overlapping operations. A `git push origin HEAD:<live>` from a worktree triggers BOTH: #15 says "reconcile the primary," #16 says "don't hand-roll, let autosync do it." The resolution is that #16's exemption (autosync is the compliant path) suppresses #15's warning. Any encoding of #15 MUST gate on `SPECKIT_AUTOSYNC` to avoid firing on the routine autosync case — otherwise #15 becomes a constant noise source in every wrapper session. This is a rule-interaction issue, not a per-rule encodability issue, but it determines whether #15's PARTIAL classification is worth acting on.

3. **NEVER #1 vs ESCALATE #4.** Same operation shape, different framing (never vs requires-approval). An encoding must surface both, in tension. The mechanical detection is identical; the advisory text carries the judgement. This is the canonical example of why PARTIAL rules need careful wording — a single mechanical check feeds two rules with opposite defaults.

4. **The Commit Message Logic (ALWAYS #1 expansion) has a MECHANICAL subset.** The structure check (regex on the subject) is fully mechanical and already enforced by `commit-msg`. The type/scope-correctness check is PARTIAL. But the self-check §7 step 9 ("the same staged diff and metadata would produce the same subject again") is a determinism check that is MECHANICAL given the staged diff + a deterministic type/scope selector — if the selector were codified, the advisory could verify the operator's chosen type against the selector's output. That is a deeper encoding than the rule text suggests, and it would close the PARTIAL gap by making the judgement deterministic. Flag for phase-002: the type-selection order (§3) and scope-selection order (§4) ARE deterministic given the diff; the PARTIAL classification reflects the rule's current prose form, not an inherent ambiguity. A codified selector would promote ALWAYS #1 from PARTIAL to MECHANICAL.

5. **Two rules are encodable by the current command-string-only engine with zero new capability: NEVER #2 (`git branch`/`checkout -b`/`switch -c` shape) and NEVER #9 (`--no-verify` flag).** ALWAYS #11 (`--notes-file`/`--notes` H1 check) requires reading a file but no git plumbing. These three are the lowest-friction first targets for a phase-002 proof-of-concept, in ascending order of capability needed: NEVER #9, NEVER #2, ALWAYS #11.

---

## 4. What this pass did NOT do

- **Did not measure noise.** Fire-rate numbers cited are from Devin-02 where available; everything else is `not measured`. A follow-up pass should measure the MECHANICAL candidates' fire rates against reflog + remote-tracking reflog history, gated on their real signal conditions (not just the operation shape).
- **Did not enumerate operations.** Devin-01 did that. This pass classifies rules, which bundle and abstract operations; where a rule governs multiple operations (e.g. ALWAYS #13 governs `git add -A`/`.`/`<dir>`/`-u`), the classification applies to the bundle, not per-operation.
- **Did not propose rule text or `hard_rules:` frontmatter.** The brief says "report findings only; do not implement anything." The `Encoding note` fields describe how a rule COULD be encoded, not proposed encoding.
- **Did not read every reference doc in full.** The rules are in `SKILL.md` §4 (read in full, L309-504); the references elaborate mechanics but do not change the encodability classification. `remote-branch-policy.md` was read in full because ALWAYS #18's enforcement overlap depends on it; `continuous-integration.md`, `finish-workflows.md`, `commit-workflows.md`, `worktree-workflows.md`, `large-reorg-playbook.md`, and `shared-patterns.md` were checked for existence and length but not read line-by-line. If a follow-up pass finds a reference that changes a classification, that is a correction to this pass, not a gap in its method.
- **Did not touch any file outside `research/`.** Confirmed: the only write was this file at `research/manual-devin/devin-03.md`.
