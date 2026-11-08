# Iteration 16 — Final pass: verification and the release gaps

**Segment:** 1 · **Iteration:** 16 of 16 · **Mode:** research (deep-research, leaf)
**Scope:** doctor, sk-git hooks, `.github/workflows`, runtime mirrors, v4.0.0.0 → v4.0.2.0
**Read-only:** yes — no repository file was created, edited, staged, committed or deleted outside this run directory.

## Focus

Three tasks, set by the reducer's next-focus for this child:

1. Re-check f-iter015-008 (and its sibling f-iter015-007) under the symlink rule: run `ls -ld` on every parent directory and `git ls-files -s` on the path before claiming a copy or a duplicate.
2. Releases carrying zero or one finding — read the path-limited commit history for the `.skilled/commands/doctor`, `.skilled/skills/sk-git` and `.github/workflows` clusters, and either record a finding or state plainly that the release touched nothing in scope.
3. Re-run the repros for the strongest five P1s and record the exact command and exit code for each.

## Actions Taken

**Action 1 — the symlink audit (12 parent directories, 5 files, 3 inodes).**
`ls -ld` on `.skilled`, `.skilled/commands`, `.skilled/commands/doctor`, `.skilled/commands/doctor/scripts`, `.skilled/bin`, `.opencode`, `.opencode/bin`, `.claude`, `.claude/agents`, then `ls -la`, `readlink` and `stat` on each file, then `git ls-files -s` on the tracked paths, then `git ls-tree -r HEAD` filtered to mode `120000` over `.skilled`, `.opencode` and `.claude`.

The result overturns a finding from the previous iteration. `.opencode/bin` is not a directory — it is a symlink:

```
lrwxr-xr-x@ 1 michelkerkmeester  staff  15 Sep 26 23:20 .opencode/bin -> ../.skilled/bin
```

So `.opencode/bin/check-agent-mirror-sync.cjs` and `.skilled/bin/check-agent-mirror-sync.cjs` are **one inode reached by two paths**, which is exactly why they carry the same 8,227 bytes and the same md5 (`c53ec9197387a417addf98ac8dbb41a7`). `git ls-files -s` tracks the `.skilled` path only. `readlink` on the *file* prints nothing — that is the trap: a file whose parent is a symlink is not itself a symlink, so a per-file `readlink` check cannot see the indirection.

**f-iter015-008 is confirmed on its own terms** (three distinct implementations of the mirror question — md5 `bebe6fcb…`, `c53ec919…`, `fd117c4b…`, i.e. three genuinely different bodies, not copies) but its "removing the doctor roster checker costs only that doctor row" claim needs no revision: nothing about it depended on a copy. **f-iter015-007 is void** and is withdrawn below.

**Action 2 — whole-runtime symlink map.** Extending the check to every runtime root found the surface is heterogeneous by design:

| symlink | target | runtimes carrying it |
| --- | --- | --- |
| `repo-rules` | `../.skilled/repo-rules` | claude, opencode, codex, cursor, pi, devin (6 of 7 — not dsh) |
| `skills` | `../.skilled/skills` | claude, opencode, pi, devin (4 of 7) |
| `manual-testing-playbook` | `../.skilled/skills/cli-external-orchestration/cli-*/…` | all 7 |
| `agents` | `../.skilled/agents` | **opencode only** |
| `bin` | `../.skilled/bin` | **opencode only** |
| `hooks` | `../.skilled/hooks` | **opencode only** |
| `scripts` | `../.skilled/scripts` | **opencode only** |

This matters directly for the parity gate: of its three runtime arms, the `required: true` opencode arm compares a file with itself.

**Action 3 — the release gap.** `git log -1 --format='%H %ad %s' --date=short 4d8f403355` returns `4d8f403355ceeed74700e839ade1f5786aee294d 2026-10-14 chore(system-spec-kit): rebuild the trigger index`. Running `git show --stat --format='%h %s' 4d8f403355 -- .skilled/commands/doctor .skilled/skills/sk-git .github/workflows` prints **nothing** — the shared tag commit touched no file in this child's scope. The last scope-touching commit reachable from it is `a4e543c75a docs(skills): add the per-skill changelog entries missed since v4.0.0.3` (three sk-git files), and every other doctor/sk-git/workflow commit between `4d8f403355` and `e2b2e393fa` belongs to the v4.0.0.11 fix series (`8d40b8c128 feat(sk-git): add the read-only /doctor:git setup check`, `3a0e17414e`, `de67ec1678`, `717e6626c6`, `dadf29716d`, `c7e11c1ef0`, `144d0bdeb6`, `9ba8bf55b2`).

**Action 4 — five P1 repros, all re-run at HEAD.** Exit codes are the shell's own.

| # | Finding | Exact command | Result |
| --- | --- | --- | --- |
| R1 | f-iter015-001 | `node .skilled/commands/doctor/scripts/symlink-engine.cjs check --root /tmp/dr16-empty --source .skilled; echo rc=$?` | prints `source-missing   core .skilled`, **`rc=0`** — drift reported, gate green. The status is assigned at [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:698] and the run exits through [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:1840], which takes no failure branch |
| R2 | f-iter015-002 | `R=$(mktemp -d) && git -C "$R" init -q && git -C "$R" rev-parse --git-path hooks` | `~/.config/git/hooks` — resolves outside the repo, so every name realpaths into `ownDir` and `accepted.includes()` is trivially true. The probe is [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:355], `ownDir` is [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:356], and the accept test that then passes is [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:387]. With `-c core.hooksPath=<checkout>/…/git-hooks` it resolves to `ownDir` |
| R3 | f-iter015-003 | `ls .skilled/skills/sk-git/scripts/tests/*.test.sh .skilled/skills/sk-git/scripts/tests/*.test.mjs \| wc -l` | `5` suites on disk, `1` invocation in the workflow — [SOURCE: .github/workflows/sk-git-script-tests.yml:51] is the sole `run:` that names a suite |
| R4 | f-iter015-004 | `grep -rln "agents-md" .github/workflows/ ; echo grep-rc=$?` | no files, **`grep-rc=1`** — zero CI callers, while the checker's own contract at [SOURCE: .skilled/commands/doctor/scripts/agents-md-manifest.cjs:37] calls `--check` the freshness gate |
| R5 | f-iter015-005 | `grep -n "runtime: " .skilled/bin/lib/mirror-sync-verify.cjs` | exactly three entries, at [SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:51], [SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:52] and [SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:53] |

## Findings

### F16-01 · type drift · severity P1 · release v4.0.0.9 · confidence high
**f-iter015-007 is withdrawn in full: there is no duplicate checker.** `.opencode/bin` is a symlink to `../.skilled/bin`, so the "8,227-byte regular file, `readlink` prints nothing, duplicating `.skilled/bin/check-agent-mirror-sync.cjs` at the same size" description is one inode seen twice. Same-size is not evidence of a copy when the parents are symlinked; `git ls-files -s` lists the `.skilled` path only. The proposed fix ("point `CHECKER` at the canonical path") is a no-op — [SOURCE: .github/workflows/agent-mirror-sync.yml:57] already resolves to the canonical file. The exit codes both names share are [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:86] and [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:162], so the two paths cannot diverge in behaviour either. The defect is in the finding, not the workflow, and it is P1 because a P2 entry that drives a no-op change costs an implementer a round trip.
**Verify:** `ls -ld .opencode/bin; md5 -q .skilled/bin/check-agent-mirror-sync.cjs .opencode/bin/check-agent-mirror-sync.cjs; git ls-files -s .opencode/bin/check-agent-mirror-sync.cjs .skilled/bin/check-agent-mirror-sync.cjs` (the second path prints nothing).

### F16-02 · type drift · severity P1 · release v4.0.0.0 · confidence high
**The parity gate's required opencode arm compares a file with itself.** `RUNTIME_MIRRORS` declares opencode first with `required: true` — [SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:51] — against template `.opencode/agents/{name}.md`. But [SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:285] expands that template through `runtimePaths()` and the comparison then reads both sides, while `.opencode/agents` is a symlink to `../.skilled/agents` (`ls -ld .opencode/agents` → `../.skilled/agents`). Canonical and mirror are the same bytes, so the arm can only ever report "in sync". The claude arm — [SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:52] — is the only required arm that compares two distinct files; the codex arm — [SOURCE: .skilled/bin/lib/mirror-sync-verify.cjs:53] — is `required: false` and TOML. Net: **one required real comparison of seven shipped runtime trees**, which sharpens f-iter015-005 rather than repeating it (that finding counted the list; this one proves a listed entry is inert). Fix: either drop opencode to `required: false` and add pi (whose `.pi/agents` is a real directory), or keep the row and label it presence-only so the coverage number is not read as three.
**Verify:** `ls -ld .opencode/agents .pi/agents; grep -n "runtime: " .skilled/bin/lib/mirror-sync-verify.cjs | head -3`.

### F16-03 · type drift · severity P2 · release v4.0.0.4–v4.0.0.10 · confidence high
**Seven release numbers carry one commit that touched nothing in this child's scope.** v4.0.0.4 through v4.0.0.10 all tag `4d8f403355`, subject `chore(system-spec-kit): rebuild the trigger index`, and its own diff over `.skilled/commands/doctor`, `.skilled/skills/sk-git` and `.github/workflows` is empty. Answering focus item 2 directly: **no release in the gap changed a doctor check, a sk-git script or a workflow in its own commit.** The scope-touching work reachable from the tag is `a4e543c75a` (three sk-git changelog/README lines), and everything else in the window is v4.0.0.11's fix series. Consequence worth recording: a path-limited `git diff v4.0.0.3..v4.0.0.10 -- <cluster>` is guaranteed empty, so any v4.0.0.4–.10 note that cites doctor, git or CI behaviour is documentation riding on a chore commit — the note and the code cannot be reconciled by diff at all, only by reading HEAD.
**Verify:** `git log -1 --format='%h %s' 4d8f403355; git show --stat --format='%h %s' 4d8f403355 -- .skilled/commands/doctor .skilled/skills/sk-git .github/workflows | wc -l` → `0`.

The clearest instance of the consequence: the sk-git workflow that runs one suite belongs to the v4.0.0.11 window, not the gap — [SOURCE: .github/workflows/sk-git-script-tests.yml:51] is the same line R3 reproduces — so no v4.0.0.4–.10 note can own it.

### F16-04 · type extension · severity P2 · release n/a · confidence high
**The duplication audit needs an inode test, not a `readlink`.** The rule that would have caught F16-01 before it was filed: two paths are the same file iff `dev`+`ino` match; `readlink` on a file under a symlinked parent returns empty and reads as "regular file". Concretely, `agent-roster-mirror-check.cjs` already walks the roster and the mirrors, so a `--duplicates` mode there that stats both sides and compares `dev:ino`, plus a `readlink -f` on every ancestor, turns the check into the thing that produced this correction. What breaks if removed: nothing — this mode does not exist today, so the cost is one addition and the payoff is that no future audit can repeat a same-size-equals-copy inference. The mistake this prevents is not hypothetical: it is f-iter015-007.
**Verify:** `node -e 'const s=require("fs").statSync;const a=s(".skilled/bin/check-agent-mirror-sync.cjs"),b=s(".opencode/bin/check-agent-mirror-sync.cjs");console.log(a.ino===b.ino)'` → `true`.

## Questions Answered

None of the two remaining strategy questions is closed by this iteration. Both stay open, and the verification pass narrows neither:
- *Do the sk-git hooks behave as the v4.0.0.3 / v4.0.0.10 / v4.0.0.15–16 notes say, with a repro for any wrong accept or reject?* — R2 supplies the wrong-*accept* half of the setup check, but the hook scripts themselves were not exercised (a hook repro needs a throwaway repository and a commit attempt, outside this iteration's read-only bound).
- *What friction do the operator and the AI user hit in doctor output, hook rejections and CI failures?* — unchanged. R1 is an instance already recorded as f-iter015-001, not a new friction datum.

## Questions Remaining

- **Q1 (hooks half) — the dominant open question, open since iteration 2.** A hook accept/reject repro and the 20 s `gate:git-timeout` both need a scratch repository; the read-only bound has now blocked this across five iterations. This is the single most valuable thing the next pass could do, and it needs a run whose write authority includes `/tmp`.
- **Q6** — does `AGENTS.md` match `REPO RULES.md`, and does Devin's 16,384-byte rule cut truncate a binding rule?
- **Q11** — command and skill *format* against sk-code / sk-doc canon (the CI-wiring half was reached in iteration 8; the format half never was).
- Carried, unreproduced: `Commit-Id: 0000000` alongside a valid id; a pushed commit with no `Commit-Id`.
- Carried: the v4.0.0.15/v4.0.0.16 worktree behaviours (`local-*` links, fsmonitor reaper, merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`).
- New and cheap: whether the same ancestor-symlink trap voids any other registry entry. f-iter015-005 survives (it counts a literal list), f-iter015-006 survives (`.claude/agents` is a real directory and `Explore.md` a real file), but the registry has 255 entries and only the copy/duplicate family has been re-tested. A single pass over every finding whose text contains "duplicate", "copy" or "same size" would settle it.

## Next Focus

The verification pass did its job and produced a correction, so the remaining value in this child is not more breadth. Three directions, in order:

1. **Re-test the copy/duplicate family across the registry** with the inode rule (F16-04's check). One table, every finding whose claim is "X duplicates Y". Cheap, and it is the only remaining systematic risk of this kind — the `.opencode/*` symlinks cover `bin`, `hooks`, `scripts` and `agents`, so four classes of claim are exposed.
2. **The hook repro**, if a later run's write authority reaches `/tmp`. Nothing else closes Q1.
3. If neither, close the child. Sixteen iterations have covered the doctor layer, the workflows, the mirrors, the release line and the canon comparison to the limit of what reading alone can prove; the open questions that remain are exactly the ones that need to execute something.

## SCOPE VIOLATIONS

None. Every command was read-only (`ls`, `readlink`, `stat`, `md5`, `grep`, `sed -n`, `git log`, `git show`, `git ls-files`, `git ls-tree`, `git rev-parse`, `git init` only inside `/tmp/dr16-hooks.*`, and two `mkdir -p` under `/tmp`). No repository file was written; the earlier stray `specs/001-test-feature/` was not touched or recreated. All artifact writes are inside this run directory.
