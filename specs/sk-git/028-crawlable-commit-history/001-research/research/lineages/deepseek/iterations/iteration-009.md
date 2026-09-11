---
title: "Iteration 9: Citation remap and blast radius"
trigger_phrases: []
---
# Iteration 9: Citation remap and blast radius

## Focus

Enumerate every place a commit hash is cited (specs, changelogs, READMEs, memory files, branch names, worktrees, origin branches, dependabot branches, tags, Claude-Session links), design the remap script from the filter-repo commit map, and measure the blast radius of the force-push across the 60 branches, 28 worktrees, live-sync hooks, the pre-push allowlist, and other clones. End with the rollback sentence and the order of operations.

## What was read

- `.opencode/skills/sk-git/references/remote-branch-policy.md:36-70` — pre-push allowlist: built-in exemptions `main` and `skilled/v*` (hardcoded), plus `remote-branch-allowlist.txt`; every other push asks again, per push; `SPECKIT_AUTOSYNC=1` + `SPECKIT_LIVE_BRANCH` exemption is scoped to the wrapper's live branch.
- `.opencode/bin/git-sync.sh:3-28,44` — live-sync behavior: publishes session commits to one shared live branch, fast-forwards when possible, rebases when the live branch moved; `--live` defaults to `$SPECKIT_LIVE_BRANCH`.
- `.github/workflows/*.yml` — CI triggers: `main`, `skilled/**`, `skilled/v*` (force-push triggers a full CI wave).
- `.opencode/scripts/git-hooks/post-commit` (iteration 1) — autosync runs from linked worktrees when `SPECKIT_AUTOSYNC=1` and `SPECKIT_LIVE_BRANCH` are set.

## What was measured

```text
=== citation corpus (specs/**/*.md) ===
token occurrences (10-40 hex chars): 33,455 | unique tokens: 7,260
length distribution: 10:2040  13:2310  12:813  40:294  11:295  16:492  17:531  18:154 ...
unique tokens matching a commit prefix: 1,700 | not matching any commit: 5,560
>=40-hex tokens: 294 — all 294 match a commit exactly
most-cited token: e5ee6609c2 (4,287 occurrences; verified `git cat-file -t` = commit)
10-hex prefix collisions among the 9,112 commits: 0  (deterministic remap key)

=== other locations ===
.opencode/skills/**/*.md with 10-hex: 31 files
.opencode/skills/*/changelog/*.md: 0 | AGENTS.md/README.md/PUBLIC-RELEASE.md/CONTRIBUTING.md: 0
non-markdown under .opencode (excluding specs/node_modules): 1,119 files — sampled as CSS color
  strings, lockfile/benchmark digests, and test fixtures; not commit citations
uppercase-class matches in specs: 268 files, sampled matches are 10-digit epoch seconds

=== commit messages themselves ===
messages containing a 10-40 hex token: 460 | total token occurrences in messages: 551

=== refs and clones ===
branches: 60 | worktrees: 28 (2 prunable under /private/tmp) | tags: 149 (98 annotated, 51 lightweight)
origin-tracking refs: 8 | dependabot branches: 2
branch names containing a commit prefix: backup-pre-v4-rebase-3f6b840da7 (verified commit 3f6b840da7)
tag names with hash: none | worktree directory names with hash: none
Claude-Session links in messages: 3,836 (unaffected by rewrite)
```

## Findings

1. **The citation corpus is smaller and more tractable than the raw token count suggests.** 7,260 unique tokens reduce to 1,700 that actually match a commit prefix, plus 294 full 40-hex citations that all match commits exactly. The remaining 5,560 are timestamps (13-digit epoch millis), digests, and other hex — they must be left untouched. One token (`e5ee6609c2`) accounts for 4,287 occurrences. [SOURCE: command:citation token analysis]
2. **The remap key is deterministic: zero 10-hex prefix collisions across 9,112 commits.** A prefix-match replace against the commit map is unambiguous at the length citations actually use. [SOURCE: command:prefix collision check → 0]
3. **Outside `specs/`, commit citations are rare but present: 31 markdown files under `.opencode/skills`, none in changelogs, none in root docs.** The 1,119 non-markdown "hits" are noise (CSS hex colors, lockfile digests, benchmark data) and must be excluded by extension policy rather than by pattern. [SOURCE: command:location scans]
4. **Commit messages cite hashes (460 messages, 551 tokens) — a layer the commit-map cannot reach in the first rewrite pass.** During the rewrite the new SHAs do not exist yet, so a message-callback cannot rewrite these citations. Options: a second filter-repo pass driven by the (cumulative) commit-map, or accept message-internal citations as dangling historical notes. This must be an explicit decision. [SOURCE: command:message citation count]
5. **One branch name carries a commit prefix** (`backup-pre-v4-rebase-3f6b840da7`); no tag or worktree names do. Branch-name remap is a single-line rename and belongs to the archive/rebase bucket (backup branches are outside the rewrite scope). [SOURCE: command:refs scan]
6. **Blast radius measured now: 60 branches, 28 worktrees (2 prunable), 149 tags (98 annotated), 8 origin-tracking refs, 2 dependabot branches.** Only `main`, `skilled/v4.0.0.0`, and the tags are in the operator's rewrite exception; everything else must be rebased onto the new base or archived, and every worktree must either merge local work first or be archived. [SOURCE: command:refs scan] [SOURCE: dispatch brief §FACTS]
7. **The live-sync chain must be stopped and re-pointed, not left to heal.** `post-commit` autosync publishes session commits to the live branch and `git-sync.sh` rebases when the live branch moved; after a rewrite, old-base sessions would rebase onto the rewritten live tip and replay pre-rewrite commits into it. During the window: disable `SPECKIT_AUTOSYNC` / `SYSTEM_LIVE_SYNC_DISABLED`; after: reset the live branch to the rewritten tip and re-enable. [SOURCE: file:.opencode/bin/git-sync.sh:3-28] [SOURCE: iteration 1 finding 9]
8. **The pre-push gate needs one explicit bypass decision, not a policy change.** `main` and `skilled/v*` are already exempt from the ask-before-push gate; the rewrite's force-push to those refs passes the hook. Pushes to any other ref still require the in-the-moment go-ahead; scripted pushes can carry `SPECKIT_ALLOW_REMOTE_PUSH=1` per the policy doc, which the operator must authorize for the window. [SOURCE: file:.opencode/skills/sk-git/references/remote-branch-policy.md:36-44]
9. **CI will re-run as a full wave.** Workflows trigger on `main` and `skilled/**`; a force-push is a branch update and triggers them. Dependabot's 2 branches and their PRs are based on old history; they need rebase/re-creation after the rewrite (or closure). [SOURCE: command:.github/workflows scan]
10. **Claude-Session links and Co-Authored-By trailers are unaffected** — they reference sessions/identities, not commits — so 3,836 Claude-Session lines and 7,363 Co-Authored-By lines need no remap. [SOURCE: iteration 2 measurements]

### Remap script design (specification)

```text
remap-citations --commit-map <path> --root specs --root .opencode/skills --ext .md [--apply|--dry-run]

1. Parse the commit-map: expect the "old new" header; build map_old2new for all non-null rows.
2. Build prefix index: for each old SHA, key = first 10 chars; assert no duplicate key
   (measured: 0 collisions); keep full SHA for 40-hex replacement.
3. Walk roots; read only *.md; (optionally include the one hash-bearing backup branch
   name via a separate rename step, not here).
4. For each file, find tokens matching \b[0-9a-f]{10,40}\b; for a token of length L where
   old[:L] == token: replace with new[:L]. Leave every other token byte-identical.
5. Report: files scanned, files changed, replacements by length, unmatched real-commit tokens
   (expected 0 after rewrite), and the 5,560 non-commit tokens explicitly skipped.
6. --dry-run is the default; --apply writes only after the map passes the identity check
   (e.g. every row's old SHA exists in the backup).
7. Verification pass: rescan and assert zero tokens resolve to any *old* prefix in the map.
8. Identity check on the id layer: Commit-Id values live in messages, not files, so the script
   never touches them; citations and ids are independent layers.
```

## Recommendations

1. **[implementable today]** Implement the remap as an auditable, dry-run-first script with the exact-match-by-length rule and the prefix-collision assertion; the measured corpus (1,700 + 294 real citations; 5,560 decoys) makes this a bounded, reviewable change.
2. **[needs a contract decision]** Decide the fate of the 460 message-internal hash citations: second rewrite pass (fully self-consistent) versus leave-as-history (cheaper, dangling after rewrite). Recommended: second pass, because a stale hash inside a message is exactly the failure the retrofit exists to remove.
3. **[needs a contract decision]** Approve the rewrite push set: `main` + `skilled/v4.0.0.0` + tags only; every other branch rebased or archived (including `backup-pre-v4-rebase-…`), 2 dependabot branches handled outside.
4. **[implementable today]** Freeze the window: disable autosync, pause session/worktree writers, record tip SHAs of all 10 origin-tracking refs (main, skilled, 8 others) before touching anything.
5. **[implementable today]** After push: reset the live branch, re-point followers (`git-live-follow.sh` is fast-forward-only and will refuse the rewritten tip), rebase each surviving worktree, and let CI re-run on the new history.
6. **[implementable today]** Keep the pre-rewrite bare backup until the verification pass completes; publish the confirmation checklist (CI green, query acceptance, citation residue zero) before deleting it.

### Rollback sentence

Rollback = stop the rewrite window, restore every ref from the pre-rewrite bare backup (`git push --mirror` from the backup, or hard-reset each local clone to its recorded tip), re-enable autosync, and treat the pre-rewrite SHAs as canonical until the rewritten state passes every invariant check; the rewritten mirror is abandoned, not repaired.

### Order of operations

1. Freeze writers (autosync off, sessions paused) and record all ref tips.
2. Bare backup + mirror clone; verify counts match the frozen tips.
3. Freeze the id/packet map (iteration 7) with adjudicated ties.
4. Mirror rewrite with `--commit-callback` stamping ids and normalizing trailers; verify invariants.
5. Remap citations from the commit-map (and, if approved, run the second message pass for message-internal cites).
6. Rewrite tags (automatic; re-sign if required); inspect ref-map.
7. Force-push `main` + `skilled/v4.0.0.0` + tags under the operator's authorization; leave other refs alone.
8. Sync followers: reset live branch, rebase/archive worktrees and other branches, handle dependabot, re-enable autosync.
9. Verify: CI green, `--grep`/trailer queries return the ids, zero old-prefix citation residue, GitHub search spot-check; then delete the backup per the agreed retention.

## What this iteration could not settle

- Whether the second message-rewrite pass is in scope for the same phase (it must follow the first map; a third invocation is possible via cumulative chaining).
- The exact tag subset to re-sign (98 annotated tags; 11 signed commits lose signatures).
- Whether dependabot branches are rebased or allowed to expire, and whether any of the 8 origin-tracking refs other than main/skilled need remapping for local consumers.
