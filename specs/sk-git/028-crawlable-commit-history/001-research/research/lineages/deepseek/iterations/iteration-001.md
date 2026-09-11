---
title: "Iteration 1: The contract and its hook"
trigger_phrases: []
---
# Iteration 1: The contract and its hook

## Focus

Inventory every rule the current sk-git commit contract and `commit-msg` hook enforce — which block, which warn, which are unenforced — and name every rule a numbered identifier collides with today, with the exact line that would have to change.

## What was read

- `.opencode/skills/sk-git/SKILL.md:352-519` — ALWAYS rules (356-373), "Commit Message Logic (Human-Clear and AI-Deterministic)" §1-7 (375-495), NEVER rules (497-508).
- `.opencode/scripts/git-hooks/commit-msg:1-185` — the blocking hook in full (SUBJECT_RE 72, numeric-scope rejection 79-81, summary checks 83-100, PROCESS_LABEL_RE 102-105, length cap 110-113, TRAILER_RE 117, BREAKING footer 118/139-141, body separation 52-61, body gate 153-155).
- `.opencode/skills/sk-git/assets/commit-message-template.md` — canonical contract pointer, AI author procedure, body template (`Refs:` at line 67), examples citing real hashes `8701343331`, `e6f9a97b8b`, `ed1c269ee6`.
- `.opencode/skills/sk-git/references/commit-workflows.md:163-214` — Step 5 (write message) and Step 6 (readiness).
- `.opencode/skills/sk-git/references/quick-reference.md:106-109,349` — commit command forms and the ≤80/100 length row.
- `.opencode/scripts/git-hooks/post-commit`, `.opencode/scripts/git-hooks/post-rewrite` — both live hooks that a rewrite will exercise.
- `.opencode/scripts/git-hooks/tests/` — test inventory.
- `.opencode/scripts/install-git-hooks.sh:29-107` — symlink install/uninstall mechanics.
- `.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs:26-349` — the advisory preflight engine's check inventory.

## What was measured

```text
$ ls .opencode/scripts/git-hooks/
README.md  commit-msg  post-commit  post-merge  post-rewrite  pre-commit  pre-push  lib  tests
# no prepare-commit-msg exists

$ ls .opencode/scripts/git-hooks/tests/
README.md  install-git-hooks-worktree-harness.sh  mass-deletion-guard.test.sh  pre-commit.test.sh  pre-push.test.sh
# no commit-msg regex test

$ git rev-parse --git-path hooks
/Users/michelkerkmeester/.config/git/hooks
$ git config --global --get core.hooksPath
/Users/michelkerkmeester/.config/git/hooks
$ ls -la /Users/michelkerkmeester/.config/git/hooks/
commit-msg -> <main-clone>/.opencode/scripts/git-hooks/commit-msg   (and post-commit, post-merge,
post-rewrite, pre-commit, pre-push — all symlinked to the main clone's hook sources)

$ grep -n "GIT_CHECKS" .opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs
91:export const GIT_CHECKS = {   # 17 ids: commit-scope-drops-untracked, commit-pathspec-empty-change,
# add-*, restore-*, checkout-*, merge-*, case-only-*, staged-path-rewritten-by-filter, reset-hard,
# clean-force, branch-force-delete, stash-clear, history-expiry, push-deletes-remote-ref,
# force-push-without-lease — none validates message format
```

## Findings

1. **The blocking subject grammar is one regex.** `SUBJECT_RE` (hook line 72) is `^(build|chore|ci|docs|feat|fix|merge|perf|refactor|release|revert|style|test)\(([a-z0-9]+(-[a-z0-9]+)*)\)(!)?: (.+)$`: 13 allowed types, a scope of lowercase alphanumerics and inner hyphens only (no dots, no slashes), optional `!`, then `: ` and any non-empty summary. Anything else is a hard error (line 107). [SOURCE: file:.opencode/scripts/git-hooks/commit-msg:72,106-108]
2. **A numeric-only scope is a hard block.** Lines 79-81 reject `^[0-9]+$` scopes with "Scope '$SCOPE' is numeric-only; use the stable owning subsystem." The in-file comment (68-71) documents that this deliberately rejects legacy packet-path scopes like `(028/005)` or `(sk-code/024)` — the slash forms also fail `SUBJECT_RE` itself. [SOURCE: file:.opencode/scripts/git-hooks/commit-msg:68-81]
3. **Three more summary hard blocks and one warning.** Summary must start lowercase (83-85); contain no repeated spaces (87-89); not end in `[.!?;:,]` (91-94); and not be one of the listed vague phrases (96-100). Internal process language — `Phase [A-Z0-9]`, `wave +…`, `Lane [A-Z]`, `<N> tasks?`, `swarm`, `tranche`, `WU<N>` — only **warns** (102-105). [SOURCE: file:.opencode/scripts/git-hooks/commit-msg:83-105]
4. **Git-generated subjects are exempt.** `Merge *`, `Revert "…"`, `fixup! `, `squash! `, `amend! ` exit 0 immediately (44-48). `git filter-repo` rewrite of a merge-heavy history therefore cannot rely on the hook to defend format for merge commits, and does not have to repair them first either. [SOURCE: file:.opencode/scripts/git-hooks/commit-msg:43-48]
5. **Length: hard 100, documented target 80.** `SUBJECT_LENGTH > 100` blocks (110-113); SKILL.md says "Subject should be at most 80 characters and must not exceed 100" (line 405). Any identifier embedded in the subject spends from this budget. [SOURCE: file:.opencode/scripts/git-hooks/commit-msg:110-113] [SOURCE: file:.opencode/skills/sk-git/SKILL.md:405]
6. **Body separation and body-line rules.** A non-empty second line without a blank separator is an error (52-61); body lines over 100 warn (123-125). [SOURCE: file:.opencode/scripts/git-hooks/commit-msg:52-61,123-125]
7. **The trailer whitelist is closed:** `TRAILER_RE` (117) accepts `Co-Authored-By:|`, `Signed-off-by:|`, `Reviewed-by:|`, `Tested-by:|`, `Refs:`, and `Fixes `, `Closes `, `Related to `. `Claude-Session:` is NOT on it (Claude Code adds it at runtime), and any new key such as a proposed `Commit-Id:` is currently classified as an ordinary explanatory body line, not as a trailer. [SOURCE: file:.opencode/scripts/git-hooks/commit-msg:117] [SOURCE: dispatch-prompt.md:68]
8. **The ≥4-path body gate has a trailer loophole.** When 4+ paths are staged and no explanatory body line exists, the commit is blocked (153-155); a line that does not match `TRAILER_RE` counts as explanatory (127-129). So a single unrecognized machine trailer would satisfy the body gate without human prose — relevant if a new trailer key is added. [SOURCE: file:.opencode/scripts/git-hooks/commit-msg:127-129,153-155]
9. **Enforcement is machine-wide, not repo-local.** `git rev-parse --git-path hooks` resolves through global `core.hooksPath=/Users/michelkerkmeester/.config/git/hooks`, whose six symlinks point back at the main clone's hook sources. This worktree's `.git` is a file (`git rev-parse --git-common-dir` → `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.git`). The hook therefore already guards every commit made on this machine — including a later rewrite/retrofit session — and `install-git-hooks.sh` only ever writes symlinks, refusing to clobber non-owned files (55-96). [SOURCE: file:.opencode/scripts/install-git-hooks.sh:29-107] [SOURCE: command:git rev-parse --git-path hooks → /Users/michelkerkmeester/.config/git/hooks]
10. **No `prepare-commit-msg` exists, and no commit-msg test exists.** sk-git has no hook that stamps or pre-fills a message, and no unit test covers the commit-msg regexes (tests cover pre-commit, pre-push, mass-deletion, and the install harness only). Any new `prepare-commit-msg` is greenfield; any hook regex change is currently untested. [SOURCE: command:ls .opencode/scripts/git-hooks/ and tests/]
11. **`git-rule-checks.mjs` is a command-safety preflight, not a message validator.** Its 17 checks (commit-scope-drops-untracked, force-push-without-lease, stash-clear-drops-entries, etc.) inspect command shape and repo state; none validates or depends on commit-message format. This engine is the natural home for retrofit-safety advisories (e.g. filter-repo without a mirror), but it does not collide with any identifier design. [SOURCE: file:.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs:91-349]
12. **The documented packet link is one optional body line.** ALWAYS rule 5 requires the spec folder path in the commit body "when applicable" (SKILL.md:360), and the body template's canonical example is `Refs: <issue, PR, or spec path>` (SKILL.md:486; template:67). Nothing validates `Refs:` content, and `Refs:` may also name an issue or PR, so today's packet linkage is human-typed, optional, and ambiguous. [SOURCE: file:.opencode/skills/sk-git/SKILL.md:360,486] [SOURCE: file:.opencode/skills/sk-git/assets/commit-message-template.md:67]
13. **The doc contract already forbids what a numbered scheme would naively do.** Scope "is ... never a packet, phase, task, or other numeric-only identifier" (SKILL.md:400-401); process metadata "packet numbers, phases, waves, lanes, task counts, model names …" belongs in the body or `Refs:` (410-412); summary "names the changed behavior or artifact (not the work process)" (402-404). [SOURCE: file:.opencode/skills/sk-git/SKILL.md:400-412]
14. **NEVER #10 is the rule the retrofit must be exempted from.** "Amend a commit that has already been pushed or merged" is prohibited (508); the packet is the operator's explicit exception for `main`, `skilled/v4.0.0.0`, and the tags only (dispatch brief). [SOURCE: file:.opencode/skills/sk-git/SKILL.md:508] [SOURCE: file:.opencode/specs/sk-git/028-crawlable-commit-history/001-research/research/dispatch-prompt.md:71]

### Collision table — where a numbered identifier can live, and what each placement costs

| Placement | Current hook outcome | Contract text that collides | Lines that would have to change |
|---|---|---|---|
| Numeric or packet-path **scope** (`(028)`, `(028/005)`, `(sk-code/024)`) | BLOCK: numeric-only error; slash scope fails `SUBJECT_RE` | SKILL.md 400-401 | hook 72 + 79-81; SKILL.md 400-401 |
| **Subject prefix** (`028-003: …`, `WU3 …`) | Passes `SUBJECT_RE` if summary starts lowercase; `WU<digits>` / `Phase N` / `tranche` trigger the process-label warning; length cap applies | SKILL.md 402-404, 410-412 (behavior, not process) | hook 110-113 budget; SKILL.md 402-412; PROCESS_LABEL_RE 102-105 only if the chosen form matches its patterns |
| **Body line / trailer** (`Refs:`-style, new key) | No block. New key not in `TRAILER_RE` → counts as explanatory body (satisfies the ≥4-path gate) | None blocking; §6 template guidance (465-495) | hook 117 + SKILL.md §6 + template:67 if a new key is adopted |

## Recommendations

1. **[needs a contract decision]** Place the identifier in the body/trailer zone, never in scope or as a subject prefix. Scope placement is already explicitly rejected by both regex and documentation; subject placement spends the 80/100 budget and trips the process-language warning class.
2. **[needs a contract decision]** If a new trailer key is chosen, add it to `TRAILER_RE` (hook:117) so the hook classifies it as a trailer rather than as explanatory body — otherwise the ≥4-path body gate can be satisfied by a machine line with no human rationale.
3. **[implementable today]** Add a `commit-msg` unit test alongside the existing pre-commit/pre-push suites before any hook regex change; the regexes are currently untested, and the retrofit's format guarantees depend on them.
4. **[implementable today]** Treat the global `core.hooksPath` install as part of the blast radius: any hook change lands in the main clone and affects every repository on this machine immediately (no worktree-local escape).
5. **[needs a contract decision]** Decide whether merge/revert exempt subjects get the identifier treatment; today they bypass all subject validation entirely (44-48), so a retrofit that wants them numbered needs a separate mechanism.

## What this iteration could not settle

- Which identifier scheme survives rebase/cherry-pick/squash and parallel worktrees (angle 4), and what the search surfaces can actually match (angle 3).
- Whether the operator wants the identifier visible in `git log --oneline` (subject) or only resolvable via `--format` (trailer); both remain live candidates.
- Exact shape and minting mechanics of the allocator; the worktree allocator was read as precedent, not yet fully.
