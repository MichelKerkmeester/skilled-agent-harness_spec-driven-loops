# Iteration 002 — Deep-Review Lineage swe2-max

- **Iteration:** 2 of 10
- **Dimension:** correctness
- **Focus:** `.skilled/skills/sk-git/` — the new message-contract machinery (`git-message-gate.mjs`, `message-contract.mjs`, `validate-message.mjs`), its runtime transports (Claude/Codex/Devin/Cursor PreToolUse, Pi extension, OpenCode plugin symlink), and the `commit-msg`/`pre-push` hook rewiring.

## Sources reviewed

- `review/lineages/swe2-max/steer.md` (lead steer, re-read before this iteration)
- `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` (full file, 407 lines)
- `.skilled/skills/sk-git/scripts/lib/message-contract.mjs` (full file, 856 lines)
- `.skilled/skills/sk-git/scripts/validate-message.mjs` (full file, 221 lines)
- `.skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.ts` + `.test.ts` + `pi/README.md`
- `.skilled/skills/sk-git/scripts/hooks/opencode/sk-git-message-gate.js` (symlink → `.skilled/plugins/sk-git-message-gate.js`, target verified present)
- `.skilled/skills/sk-git/assets/commit-message-template.md` + `worktree-checklist.md` enforced-rules blocks
- `.skilled/skills/sk-git/scripts/worktree-naming.sh` diff (allowlist narrowing comment, `_wn_deps_satisfied` @spec-kit fallback)
- `.skilled/skills/sk-git/leaf-aliases.json` + `leaf-manifest.json` (71/71 paths resolve)
- `.skilled/scripts/git-hooks/commit-msg`, `pre-push` (message-contract gate, L133-265), `lib/message-contract-gate.sh`, `gate-config.sh`, README diff
- `.skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs` (advisory parser, L39-134)
- Empirical probes: `evaluateCommand()` against 18 command strings; `node --test` on `message-contract.test.mjs` (32/32 pass), `git-preflight-advisory.test.mjs` (7/7 pass); vitest pi suite (3/3 pass via `.skilled/hooks/vitest.config.ts` alias that maps `../../.skilled/` to the root — the mechanism that makes the symlink-layout imports testable)

## Findings by severity

### P0 Findings

None.

### P1 Findings

1. **Bundled short-flag commit forms bypass the PreToolUse message gate entirely.**

   `optionValue` (`git-message-gate.mjs:172-178`) matches `-m`/`--message` as a bare token or glued (`-mfoo`), and `--message=x`. POSIX/git bundling puts the message flag last in a cluster with the value as the *next* argument — `git commit -am "msg"`, `-sm`, `-qm`, `-vm`, `-aF file` — and `-am` does not `startsWith('-m')`, so `commitMessage()` (L181-210) sees no `-m`, collects no parts, returns null, and `evaluateCommand` allows the command.

   Empirically reproduced in-session: `evaluateCommand('git commit -am "wip"')`, `-sm`, `-qm`, and `--amend -am` all return null (allowed) while `git commit -m "wip"` blocks. `-am` is one of the most common commit invocations; an agent in the habit of bundling gets no PreToolUse feedback at all.

   Concrete failure scenario: an agent runs `git commit -am "Fixed stuff"` — the gate allows it, `commit-msg` then blocks it (the layered defense works — `.skilled/scripts/git-hooks/commit-msg` runs `validate-message.mjs --commit` on the real message file), so no bad message lands, but the gate silently fails its stated purpose for a common form and the denial happens one layer later than designed, after staging and with a worse recovery position. Not a contract-tolerated unknown: the message is fully visible to the parser; it is a parser blind spot, not a policy choice.

   Claim adjudication: confirmed by code trace *and* direct execution of `evaluateCommand` in this session (not inference). Counterevidence sought: checked test suites for bundle coverage — none exists (`grep -am` across both test files returns nothing); checked that git itself parses `-am` as `-a -m` with the message as the next argv — it does. Kept at P1 rather than P2 because the gate's own contract says it blocks "a violation it can see," and this violation is seeable; kept at P1 rather than P0 because commit-msg/pre-push still enforce.

2. **The sibling advisory parser has the same blind spot, plus a false-positive surface.**

   `git-rule-checks.mjs:97-113` walks tokens and treats any `-x` token as a flag, using `VALUE_FLAGS` to skip the following token. A bundled `-am` is not in `VALUE_FLAGS`, so the message token lands in `paths` — the same class of input the set exists to exclude.

   Concrete failure scenario: `git commit -am "src/old-file"` — the advisory sees pathspec `src/old-file`; path-keyed checks (e.g. pathspec-matches-nothing) can now warn on a commit message word. Warn-only and the checks are state-gated, so the harm is occasional noise — but the same parsing deficiency is now in two places, which is exactly what the module comment at `git-preflight-advisory.mjs:95` says a second copy invites ("a second copy would be a second thing to drift").

   Claim adjudication: code-read confirmed; the drift comment makes the duplication itself a documented hazard.

### P2 Findings

1. **`v8.setFlagsFromString` in `git-message-gate.mjs:380` runs before the try/catch inside `main()`** — on a Node build without the experimental-regexp flag, the throw propagates to `main().catch(() => process.exit(0))`: the entire gate silently never engages. Fail-open by design and verifiably fine on Node 26 (tested: flag accepted), but a node-version-dependent total bypass lives behind a generic catch with no log line. Advisory-level: the backstop hooks still enforce.

## Traceability checks

- `checklist_evidence`: every finding carries file:line plus an empirical or traced failure scenario.
- `feature_catalog_code`: `leaf-manifest.json` and `leaf-aliases.json` entries all resolve (71/71 paths exist on disk); `hard-rules.json` sidecar consumption claim in `git-preflight-advisory.mjs:10` verified — the dispatch preflight lints (`claude`/`codex`/`devin` variants) do read the same sidecar.
- `playbook_capability`: `hooks/README.md` claims commit-msg finds the validator "beside the real hook script" — verified via `mcg_validator_path` and the machine-wide `core.hooksPath` (`~/.config/git/hooks`).

## Edge cases examined

- `git -C <dir>`, `cd <dir> &&`, env-assignment prefixes, `&&`/`;` sequencing, `$(cat <<'EOF' …)` heredoc inlining — all handled correctly (verified empirically; `cd /tmp` and `git -C /tmp` correctly allow because no contract resolves there).
- `git branch` non-create flags are enumerated (`BRANCH_NON_CREATE`); rename `-m` takes the last positional — correct.
- `pre-push` rev-list: `$local_sha --not --remotes` bounds to commits no remote-tracking ref holds; `--exclude-ref` strips the overwritten ref from Commit-Id ownership — consistent with the comment at pre-push:229-234; `cat-file -e` guards a missing old tip.
- `mcg_repo_declares_rules` ERE heading test is boundary-equivalent to the JS `\bEnforced rules\b` for all ASCII cases (checked the `Unenforced`/`fooEnforced` edges).
- `_wn_deps_satisfied` change (`names[0] || all[0] || ""`) is a deliberate fix: `@spec-kit/*`-only packages are now checked instead of silently satisfied. Correct direction.

## Ruled-out directions

- Pi gate import paths `../../.skilled/…` resolve against the `.pi/extensions/` symlink target, not the real file — verified the symlinks exist and the vitest alias covers the test path; 3/3 tests pass.
- `resolveContractDir` scope filtering (`command\t` rows excluded) — correct: `git -c` injection cannot redirect the contract dir.
- `rangeContext` Commit-Id owner lookup excludes same-author/same-date rebase copies — matches `AUTHOR_FORMAT` comparison.
- `stripCommitMessage` scissors/comment handling — matches git cleanup semantics incl. `whitespace`/`verbatim` keep-all.

## Next focus

Iteration 3 — correctness on `sk-doc` scripts and the shared script surface (`system-spec-kit` shared helpers the gate depends on), continuing down the manifest.

Review verdict: CONDITIONAL
