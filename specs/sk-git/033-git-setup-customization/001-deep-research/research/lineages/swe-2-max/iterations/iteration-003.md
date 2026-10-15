---
title: "Iteration 3: sk-git customization surface part 1 — commit contract, contract-dir resolution, git-standards tool, allowlist, worktree naming/provisioning, Commit-Id opt-in"
trigger_phrases: []
---
# Iteration 3: sk-git customization surface, part 1

## Focus

Map where each customizable part of sk-git is actually set today and what mechanism already exists for per-repo override: the commit/PR/branch rules blocks, the `.sk-git/` + `skgit.contractDir` resolution order, the `git-standards.cjs` doctor tool, `hard-rules.json`, the remote-branch allowlist, worktree naming/base/provisioning, and the Commit-Id allocator's opt-in.

## Actions Taken

- Read `.skilled/skills/sk-git/SKILL.md` in full (rules §3-§4, commit message logic, NEVER list).
- Read `.skilled/skills/sk-git/hard-rules.json` (all 17 advisory rules).
- Read `.skilled/skills/sk-git/assets/commit-message-template.md` (the §7 rules block is the enforced contract).
- Read `.skilled/skills/sk-git/scripts/remote-branch-allowlist.txt` and `references/remote-branch-policy.md` (the full allowlist/bypass contract).
- Read `.skilled/skills/sk-git/scripts/worktree-naming.sh` header + repo-resolution section; `scripts/worktree-provision-paths.txt`; `scripts/commit-id-naming.sh` header/allocator.
- Read `.skilled/skills/sk-git/scripts/lib/message-contract.mjs` `resolveContractDir`/`loadContract`.
- Read `.skilled/commands/doctor/scripts/git-standards.cjs` in full (374 lines).
- Read `.skilled/scripts/git-hooks/lib/commit-id-policy.sh` (the Commit-Id opt-in).

## Findings

1. `SKILL.md` is prose AND contract: its rules are behavior (ask-first workspace rule; NEVER create branches directly; remote-push permission; commit grammar `worktrees/NNN-slug` / `branches/NNN-slug`), while the mechanical pieces defer to files a repository can override — the rules block in `assets/commit-message-template.md` §7, `scripts/remote-branch-allowlist.txt`, `worktree-naming.sh`, `worktree-provision-paths.txt`, `hard-rules.json`. [SOURCE: .skilled/skills/sk-git/SKILL.md:205-258,285-318]

2. The commit message contract is data, not prose: the ```json "Enforced rules" block in `commit-message-template.md` §7 (kind/version/help/passthroughSubjects/subject/body/trailers/attribution/breakingFooterPattern) is read by `validate-message.mjs` and enforced identically by the commit-msg hook, pre-push hook, agent gate and CI. The template says so explicitly: "Another repository gets its own rules by carrying its own copy of this template, in `.sk-git/` at its root or in the directory git config `skgit.contractDir` names." [SOURCE: .skilled/skills/sk-git/assets/commit-message-template.md:177-184,216-271]

3. Contract-dir resolution order is `skgit.contractDir` (git config, file scope only — a command-scoped `-c`/`GIT_CONFIG_*` value is deliberately ignored so no invocation can switch rules off) → `.sk-git/` at repo root → shipped `assets/` under `.skilled/` or `.opencode/`. A `skgit.contractDir` pointing at a missing directory throws `ContractError`, and `validate-message.mjs` exit 2 is treated as a block — so a stale contractDir breaks EVERY commit, the highest-blast-radius misconfiguration in this surface. [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:278-307,314-324; .skilled/skills/sk-git/scripts/validate-message.mjs:17-18,222]

4. `git-standards.cjs` (the `/doctor:git standards` backend) already is the per-repo override tool for commit/PR/branch rules: `status` reports resolved dir + source + editable + per-kind enforced/broken/drift; `init` copies the three shipped templates into `.sk-git/` (dry-run default, never overwrites, warns when contractDir outranks `.sk-git/`); `set <kind> <dotted.path> <json>` refuses to write shipped assets and refuses a change that breaks `contractShapeErrors`; `disable <kind>` removes the Enforced-rules section so that kind is unenforced; `check` exits 0/1/2 on clean/drift/broken. [SOURCE: .skilled/commands/doctor/scripts/git-standards.cjs:7-37,158-189,217-351]

5. `hard-rules.json` is 17 warn-severity advisory rules `{id, check, message}` evaluated by the shared preflight advisory hook against live repository state — firing on the risky state, never bare verbs; advise-only, never blocks; suppression is `SKGIT_ADVISORY=0` (global) or `SKGIT_ADVISORY_SKIP=<rule-id>`/prefix. What a user would change: rule texts, severities, or add repo-specific rules; what breaks: a malformed JSON or a rule the engine's `check` key doesn't implement silently weakens the advisory without failing anything. [SOURCE: .skilled/skills/sk-git/hard-rules.json:1-104; .skilled/skills/sk-git/SKILL.md:243-257]

6. The remote-branch allowlist is `main` + `skilled/v*` (hardcoded, checked before the file is read) + globs in `scripts/remote-branch-allowlist.txt`. The file can only narrow, never widen — "an operator-editable file must fail toward MORE asking." Creation of a remote branch always needs `SPECKIT_ALLOW_REMOTE_PUSH=<branch>`; `=1` only permits updates to existing remote branches, set per-invocation never per-session. The pre-push hook backstops; the concern fails open if `worktree-naming.sh` is missing/unsourceable. [SOURCE: .skilled/skills/sk-git/references/remote-branch-policy.md:30-56,78-104; .skilled/skills/sk-git/scripts/remote-branch-allowlist.txt:1-9]

7. Worktree naming/provisioning is a shipped script with per-repo knobs: branch grammar `worktrees/NNN-slug` and `branches/NNN-slug` (independent 001-999 sequences, locked counter in the common git dir seeded from high-water + all matching refs + registered worktrees, never reissued); reserved lanes `skilled/v*`, `backup/`, `main`, and the launch-wrapper lane `work/<runtime>/<slug>`; the worktree BASE relocates via `SPECKIT_WORKTREE_BASE` env > `git config speckit.worktreeBase` > `.worktrees`. Provisioning installs the per-repo dependency list in `worktree-provision-paths.txt` (dir per line, optional `npm run build` artifact check) under the invariant that no shared path may resolve a repo-internal reference back to the source checkout. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:5-77; .skilled/skills/sk-git/scripts/worktree-provision-paths.txt:1-40; .skilled/skills/sk-git/SKILL.md:292,296]

8. The Commit-Id allocator is `commit-id-naming.sh`: 7-digit ordinals (`0000001`-`9999999`, `0000000` invalid) minted in commit order under a common-git-dir lock, cold-start rescanning `git log --all` for the max, high-water file as cache, never reissued. The `prepare-commit-msg` hook stamps `Commit-Id:` (and `Spec:` only when the trailer belongs), with amend/cherry-pick/rebase semantics documented. [SOURCE: .skilled/skills/sk-git/scripts/commit-id-naming.sh:1-75; .skilled/scripts/git-hooks/prepare-commit-msg:6-8,97-111,370]

9. Commit-Id is opt-in per repository via `skilled.commitId`: `cip_repo_wants_ids` reads `git config --local --bool skilled.commitId` FIRST (true=on, false=off), and only local config counts so a cloned repo cannot switch itself in or out. Absent the flag it auto-detects: repo shipping `.skilled/` or `.opencode/` sk-git allocator or the system-spec-kit sentinel, or ≥1 `Commit-Id` trailer in the last 50 commits. [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:19-45]

10. The `Spec:` trailer and `attribution.forbidden` are repo-shaped assumptions inside the shipped rules block: `trailers.spec` pins `root: "specs"`, `forbiddenPrefix: "specs/"`, `mustExist: true` — a repo without `specs/` packets must override or disable that rule via its own `.sk-git/` copy; `attribution.forbiddenKeys: [Co-Authored-By, Claude-Session]` + `forbiddenTrailerValuePattern: "anthropic"` may be wrong for repos that want attribution. These are exactly the `git-standards.cjs set`/`disable` levers. [SOURCE: .skilled/skills/sk-git/assets/commit-message-template.md:257-269]

## Questions Answered

- Where is each part-1 item set today? Commit rules: `.sk-git/` or `skgit.contractDir` overriding shipped `assets/` (validated by `git-standards.cjs`). Allowlist: `remote-branch-allowlist.txt` globs atop hardcoded mains. Worktree: `worktree-naming.sh` grammar + `speckit.worktreeBase`/`SPECKIT_WORKTREE_BASE` + `worktree-provision-paths.txt`. Commit-Id: `skilled.commitId` local config opt-in over auto-detect. Advisory: `hard-rules.json` + `SKGIT_ADVISORY*` suppression envs.
- What breaks worst? A `skgit.contractDir` to a missing dir or a malformed `.sk-git` rules block → `ContractError` → every gated commit/push blocked (exit 2 reads as block, not opt-out).

## Questions Remaining

- The git hooks themselves: what does `install-git-hooks.sh` install, what does `skilled.trustRepoHooks` gate, what do `speckit.hooks.<key>` switches control (git-hook-gates.cjs), and what does `/doctor:git` route today? → Iteration 4.
- Does the preflight advisory have per-repo install state worth checking (plugin/hook registration per runtime)? → Iteration 4.

## Ruled Out

- None.

## Dead Ends

- None — every file the topic named exists and resolved cleanly.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/sk-git/SKILL.md:1-475
- .skilled/skills/sk-git/hard-rules.json:1-104
- .skilled/skills/sk-git/assets/commit-message-template.md:1-280
- .skilled/skills/sk-git/scripts/remote-branch-allowlist.txt:1-9
- .skilled/skills/sk-git/references/remote-branch-policy.md:1-116
- .skilled/skills/sk-git/scripts/worktree-naming.sh:1-80
- .skilled/skills/sk-git/scripts/worktree-provision-paths.txt:1-40
- .skilled/skills/sk-git/scripts/commit-id-naming.sh:1-80
- .skilled/skills/sk-git/scripts/lib/message-contract.mjs:270-349
- .skilled/skills/sk-git/scripts/validate-message.mjs:15-222 (exit codes, contract load, --explain)
- .skilled/commands/doctor/scripts/git-standards.cjs:1-374
- .skilled/scripts/git-hooks/lib/commit-id-policy.sh:1-60

## Assessment

- `newInfoRatio`: `0.92`
- Novelty justification: 9 of 10 findings fully new; finding 10 partially new (rule-block fields read in full but their per-repo motivation is inferred from config shape).
- Confidence: high — contract resolution order and opt-in semantics are code-verified, not doc-claimed.

## Reflection

- Worked: reading `git-standards.cjs` this early reframed the whole question — the override path already exists for the rules blocks, so the setup check's job is verification and discovery, not inventing a customization mechanism.
- Did not work: nothing.
- Would do differently: nothing.

## Recommended Next Focus

Iteration 4: part 2 — the global hooks under `.skilled/scripts/git-hooks/` + `install-git-hooks.sh` + `skilled.trustRepoHooks` trust gate + `speckit.hooks.<key>` switches (`git-hook-gates.cjs`), the preflight advisory registration surface, and `/doctor:git`'s router (`git.md`).
