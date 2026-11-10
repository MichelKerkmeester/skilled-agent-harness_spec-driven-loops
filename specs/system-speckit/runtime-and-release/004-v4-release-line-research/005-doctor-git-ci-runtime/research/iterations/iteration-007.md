# Iteration 7 — Doctor / Git / CI / Runtime audit

## Focus

1. Correct the record on the symlink claim from iteration 6 before anything else, and adopt "check symlinks first" as a standing rule.
2. Cover the unread releases for this cluster: v4.0.0.1, v4.0.0.2, v4.0.0.13, v4.0.0.14, v4.0.0.15 (path-limited diffs only).
3. Test the notes' own claims: v4.0.0.15 "Private Commands Reach Every Worktree", v4.0.0.2 "Doc Validation and Git Hooks" (switch semantics and bypass hints), v4.0.0.13 "Every setting is listed / `/doctor:env` reads `.env.example`".

## Actions Taken

1. **Symlink check before any duplication claim** — `ls -la .opencode` and `readlink .opencode/scripts`:
   `.opencode/scripts -> ../.skilled/scripts` (and the same pattern for `agents`, `bin`, `hooks`, `repo-rules`, `skills`).
   `.opencode/scripts` is a symlink, not a second copy of `.skilled/scripts`.
2. **Path-limited diffs** for the five releases over the cluster paths (`--stat`), then the actual patches for v4.0.0.2 (`sk-git`, agents, AGENTS.md) and v4.0.0.15 (`worktree-naming.sh`, `SKILL.md`, `hooks/README.md`), plus `sk-git` hook messages at HEAD.
3. **Claim tests run this iteration**
   - Symlink/import reality: `readlink .skilled/skills/sk-git/scripts/hooks/opencode/*`, `test -e .skilled/plugins`, and a live Node import of the specifier the README prints from `.opencode/plugins/`.
   - v4.0.0.15 worktree claim: the `_wn_link_local_commands` grep pattern was applied to the real `.gitignore` (8 matches), and each runtime mirror was checked for an actual private command.
   - v4.0.0.2 switch claims: read `validate.sh`'s skip path, `hooks/shared/hook-flags.sh`'s resolver, `gates.tsv`, and the git-hook block messages; counted `BLOCKED` vs `Bypass` lines.
   - v4.0.0.13 env claim: checked `.env.example` banner shape against the parser contract in `doctor-env.yaml`, and the `/doctor:env` route row in `_routes.yaml`.

## Findings

### Correction — f-iter006-003 is WITHDRAWN

**f-iter006-003 is withdrawn.** It claimed duplication of the scripts tree. `.opencode/scripts` is a symlink to `../.skilled/scripts`
(verified with `ls -la .opencode` and `readlink .opencode/scripts`, which prints `../.skilled/scripts`), so neither a copy nor a
drift exists there. Standing rule adopted for the rest of this run: run `ls -la` and `readlink` on both sides before any
"duplicate / duplicated tree / mirror mismatch" claim.

### f-iter007-001 — OpenCode plugin import line in the hooks README is not a resolvable specifier

- type: drift · severity: **P2** · release: **v4.0.0.15** · confidence: **high** (repro ran)

`hooks/README.md` prints the preflight-advisory import as
`Import: .skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs (specifier relative to the plugins folder)`
[SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:179]. That string is neither relative nor the real specifier. The
plugin actually imports `'../skills/sk-git/scripts/lib/git-rule-checks.mjs'` from `.opencode/plugins/`
[SOURCE: .opencode/plugins/sk-git-preflight-advisory.js:21]. `.skilled/...` from the plugins folder is a bare module
specifier, which Node rejects before any filesystem lookup.

Repro (ran):

```bash
cd .opencode/plugins && node -e "import('.skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs').catch(e=>console.log(e.code))"
# ERR_INVALID_MODULE_SPECIFIER: Invalid module ... is not a valid package name
```

Worse, the same file documents the Pi import correctly as a relative specifier
`Import: ../../lib/git-rule-checks.mjs` [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:196], so the README
contradicts its own convention one page apart. Verify:
`grep -n 'Import:' .skilled/skills/sk-git/scripts/hooks/README.md`.

### f-iter007-002 — `SPECKIT_SKIP_VALIDATION=1` in the environment is ignored when `hook-flags.env` is unreadable

- type: drift · severity: **P2** · release: **v4.0.0.2** · confidence: **medium** (code read; no live repro without a tree that lacks the file)

The v4.0.0.2 note says the switch works "set in the environment or saved in `.skilled/hooks/hook-flags.env`" and that
"A set environment value wins over the file, even `0`" [SOURCE: .skilled/changelog/skilled/v4.0.0.2.md:146]. In code, the
environment is only consulted after the resolver file is known readable:

```bash
if [[ ! -r "$HOOK_FLAGS_SH" ]]; then
    [[ -n "${SPECKIT_SKIP_VALIDATION:-}" ]] && echo "WARNING: ... is ignored." >&2
    return 1
fi
```

[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:133]. The shared resolver itself does honour a set
environment value first, including empty and `0` [SOURCE: .skilled/hooks/shared/hook-flags.sh:52], so the guarantee is lost
only in the guard, not in the resolver: any checkout where `.skilled/hooks/shared/hook-flags.sh` is absent (a partial
vendored overlay, a CLI-only copy) silently downgrades an explicit `SPECKIT_SKIP_VALIDATION=1` to a warning and still runs
validation. Confirm by running `validate.sh <folder> --strict` in such a tree; the same guard is not present for
`SKDOC_SKIP_VALIDATION`, so the two switches the note describes as equivalent are not equivalent on that path.

### f-iter007-003 — `.env.example` skips section 15, and `/doctor:env` now parses that numbering as a heading path

- type: drift / UX · severity: **P2** · release: **v4.0.0.13** · confidence: **high**

v4.0.0.13 made `.env.example` a second inventory source for `/doctor:env`
[SOURCE: .skilled/commands/doctor/env.md:54], and the supplement parse contract it added keys each section on a banner of the form
`# <number>. <TITLE>` [SOURCE: .skilled/commands/doctor/assets/doctor-env.yaml:45]. The file it must parse has 18 banners
numbered 1–14 and 16–19: `# 14. CROSS-AI CLI DISPATCH` is followed directly by `# 16. SK-GIT & LIVE-SYNC`
[SOURCE: .env.example:519]. Every setting between them (the `dsh` dispatch and mirror block, "Other skills", the manual
testing playbook runner) therefore displays under the CROSS-AI CLI DISPATCH heading path, and a reader looking for
"section 15" in the inventory finds nothing.

Verify: `grep -cE '^# [0-9]+\.' .env.example` → `18`; `grep -nE '^# 1[4-6]\.' .env.example` → 14 and 16 only.

### f-iter007-004 — Worktree `local-*` linking is silent about what it skipped and reports its count outside the summary

- type: extension · severity: **P2** · release: **v4.0.0.15** · confidence: **high**

`_wn_link_local_commands` derives the link targets from `.gitignore` rather than a runtime list
[SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:625], and it is called from inside `provision_worktree` before the
one-line summary [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:775]. Its only output is
`linked N private local-* command entries from <primary>` on stderr, so the summary line the operator and an AI actually read
(`provisioned: X installed, Y built, Z already present, W failed`) never mentions links.

Concrete extension, in order of value:
1. Append the linked count to the `provisioned:` summary line, so a tree with no private commands and a tree whose matching
   ignore rule was renamed look different.
2. Print the runtimes it found no ignore rule for. Today the pattern covers `.*/(commands|commands/assets|prompts)/local-*`;
   a runtime folder added later without that exact ignore line (the `.devin` tree has no `commands/` ignore rule at all) is
   never linked and never reported.
3. A `--dry-run` that lists the source and target of each link, matching the rest of the doctor surface's read-only modes.

Removing the feature would leave a fresh worktree without the operator's private command, which is the state v4.0.0.15 fixed,
so the feature earns its place; only its reporting is thin.

### Verified claims (no finding)

- **v4.0.0.15 "Private Commands Reach Every Worktree" holds for this checkout.** The function's pattern
  `^/\.[A-Za-z0-9_-]+/(commands(/assets)?|prompts)/local-\*$` matches all 8 matching `.gitignore` rules
  (`grep -nE '<pattern>' .gitignore | wc -l` → 8), and five runtime mirrors currently hold a private command
  (`local-skilled-alignment.md` under `.claude/commands`, `.codex/prompts`, `.cursor/commands`, `.pi/prompts`,
  `.dsh/prompts`, `.opencode/commands`). `bash -n worktree-naming.sh` → `SYNTAX_OK`.
- **The v4.0.0.15-era README symlink target was already corrected at HEAD.** The release diff changed the message-gate tree
  line to `symlink -> .skilled/plugins/sk-git-message-gate.js`; at HEAD that line reads `.opencode/plugins/...`
  [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:226] and matches the real link
  (`readlink` → `../../../../../../.opencode/plugins/sk-git-message-gate.js`). `.skilled/plugins` does not exist, so this
  was worth checking and is not a live defect.
- **v4.0.0.2's bypass-hint work landed as described, then was superseded by design.** `pre-commit` carries 44 gate block
  lines and 63 `Bypass:`/`Fix:` lines, including the `SYSTEM_GIT_COMMIT_HOOKS_DISABLED=1` wording the note promises for the
  agent-mirror gate. `commit-msg` carries 5 `BLOCKED:` lines and 0 bypass lines because v4.0.0.3 deleted
  `SPECKIT_SKIP_COMMIT_MSG_VALIDATE` outright [SOURCE: .skilled/changelog/skilled/v4.0.0.3.md:80]; `gates.tsv` has no
  `commit-msg` row [SOURCE: .skilled/scripts/git-hooks/lib/gates.tsv:6]. That is the note's stated policy, not drift, so it is
  recorded here as context rather than as a finding.

## Questions Answered

None of the five strategy key questions can be closed this iteration. Q3 (sk-git hooks) advanced — the v4.0.0.15 worktree
half is now verified and the v4.0.0.2 bypass habit is explained — but the v4.0.0.3 commit-rule, v4.0.0.10 commit-id and
v4.0.0.16 worktree halves are still unread.

## Questions Remaining

- Q3: do the sk-git hooks behave as the v4.0.0.3 (commit rules, hook safety), v4.0.0.10 (Commit-Id) and v4.0.0.15/v4.0.0.16
  (worktrees) notes say, with a repro for any wrong accept or reject?
- Q9: which doctor checks, hooks, workflows or mirror files have no caller or duplicate another, and what breaks if each is
  removed?
- Q10: what friction do the operator and the AI user hit in doctor output, hook rejections and CI failures?
- Q11: where do these surfaces depart from sk-code, sk-doc and Skilled canon for command format, skill format and hub routing?
- Q12: what concrete extensions to doctor checks, hooks, CI and mirror sync would close a gap found in this run?

## Next Focus

1. **Q3 remainder, read the code not the notes:** `lib/message-contract-gate.sh` + `validate-message.mjs` for the v4.0.0.3
   commit-rule claims; `lib/commit-id-policy.sh` + `prepare-commit-msg` for the v4.0.0.10 Commit-Id claims; `worktree-naming.sh`
   reaper/sweep paths for v4.0.0.16. Repro any wrong accept with a scratch repo (`git -C $(mktemp -d) init -q`) — that is a
   throwaway tree outside the repository, never the checkout under audit.
2. **Q10:** the `/doctor:git` presentation against the `gates.tsv` registry — does the command list every gate the hooks read,
   and does it name a gate the registry does not hold?
3. **Q11:** `_routes.yaml` schema versus the router files it names (`route-validate.sh` in check mode), which is the last
   unread slice of the v4.0.0.14/v4.0.0.15 doctor routing work.
