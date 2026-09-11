# Deep Research Synthesis - Git Workflow Run Failures (deepseek lineage)

- Session: `fanout-deepseek-1789120563971-811hh6`
- Executor: cli-pi, model `deepseek-v4.1-flash`, reasoning max
- Topic: Every git workflow in this repository that can fail, revert, block or mislead an automated run: fan-out lineages, detached CLI children, launch-wrapper sessions and hooks with nobody at a prompt. Reproduce each in a throwaway repository, name the producer file and line, and propose the adjustment at the producer.
- Stop reason: `maxIterationsReached` (5/5; convergence was telemetry only)
- Evidence base: five iterations, each reproduced against the shipped producers in throwaway repositories under `scratch/`; no network; no write outside this lineage directory.
- Artifacts: `iterations/iteration-001..005.md`, `deltas/iter-001..005.jsonl`, `findings-registry.json`, `deep-research-state.jsonl`.

## Verdict

38 items recorded: **24 confirmed findings**, **5 ruled out**, and the rest code-confirmed behavioral notes. The failures cluster into two producer families:

1. **Hooks and git-side scripts** (`.opencode/scripts/git-hooks`, `.opencode/bin`, `.opencode/skills/sk-git/scripts`) -- 20 findings. The sharpest are the pi dispatch guard denying ordinary compound commands (bit twice in this run), the worktree reaper deleting a live session's socket dir and marker (and removing a worktree under a live detached child), the autostash orphan guard firing too early to see the orphan, and pre-commit block branches that do not name their bypass.
2. **The deep-loop runtime** (`.opencode/skills/system-deep-loop/runtime`) -- 8 findings. The sharpest are write-containment attributing any tracked out-of-lineage write to the running lineage (reverting it and failing a completed lineage), and the stall watchdog having no process-liveness input (a print-mode child that thinks silently for five minutes reads as a stall). This is the seam: git-facing producers belong to sk-git/hooks; run-supervision producers (containment, watchdog, dispatch) belong to the runtime and cannot be fixed from sk-git.

The single most dangerous pair is containment (B1) and the reaper (A2/A3): both destroy or displace state a live run depends on, both are invisible until they bite, and both have small producer-side fixes.

## Ranked adjustment plan

Full reasoning and per-item evidence are in iteration 5. Order is by bite frequency, then blast radius.

### Fix in hooks or sk-git

1. **A1 -- Pi dispatch guard denies ordinary compound commands** (`dispatch-audit.mjs:42,219-231,258`, `dispatch-preflight-lint.ts:185,248-253`): classify `-p`+`$`-expansion as ambiguous only with an executor token or command-position expansion; name the opt-out in the denial. Test: the R1.5 table in `dispatch-audit.test.mjs`.
2. **A2 -- Reaper deletes a live session's socket dir and marker** (`worktree-reaper.sh:60-70,178,190`): resolve registered worktrees from `git worktree list` before pruning state; persist the wrapper's chosen base. Test: R2.6a/c.
3. **A3 -- Reaper removes a worktree under a live detached child** (`worktree-reaper.sh:82-98`): refuse removal when any live process resolves inside. Test: R2.7.
4. **A4 -- Autostash orphan guard never sees the rebase orphan** (`lib/autostash-orphan-guard.sh:19-43`): anchor the sequencer autostash file at post-rewrite; also run the guard from post-commit and git-sync entry. Test: R2.5.
5. **A5 -- pre-commit block branches omit their bypass** (`pre-commit:416-443,295-303`): print the bypass; treat derived-file-only dirt as re-derivable. Test: R1.2/R1.3.
6. **A6 -- Machine-wide hook shadowing / installer re-point** (`install-git-hooks.sh:30-33,84-99,106-124`): `--status` provenance; harness scenario; README qualification. Test: harness.
7. **A7 -- SHAs rewritten by the diverged publish** (`git-sync.sh:246-263`): log `old=<sha> new=<sha>`. Test: R2.1.
8. **A8 -- Advisory reads the wrong cwd** (`git-rule-checks.mjs:26-28,57-83` + adapters): resolve `-C`/leading `cd` or fail open. Test: R3.2/R3.3.
9. **A9 -- Allocator no-pid lock** (`commit-id-naming.sh:83-126`): reclaim after a short grace, or write the pid atomically. Test: R5.1a.
10. **A10 -- commit-msg trailer length warning** (`commit-msg:126-129`): skip trailer lines. Test: R1.4 case B.

### Fix in the runtime, own packet

1. **B1 -- Containment fails a lineage for a same-packet tracked write by another writer** (`write-containment.ts:510-540,613-638`, `fanout-run.cjs:3048-3105`): same non-fatal advisory + patch treatment the untracked path already gets; keep cross-packet writes fatal. Test: R4.1 variant.
2. **B2 -- Stall watchdog false positive for silent-but-working children** (`fanout-run.cjs:1524-1563,2913-2919`): feed it the existing process liveness plus a CPU-time sample; annotate the event. Test: R4.2 extension.
3. **B3 -- Containment detection inherits host-global git config** (`write-containment.ts:196-210`): pass an explicit env / neutralize global excludes for detection. Test: global-ignore fixture.
4. **B4 -- Detached-child death diagnostics** (`fanout-run.cjs:3028-3036`): record exit signal plus memory context so OOM kills (`observed-failures` #8) are distinguishable from self-exit. Test: kill -9 stub child and assert the settled record.

### Environment notes (no code)

- A session must not assume repository-local git config is what runs: global `core.hooksPath` (iteration 1) and global excludes (iteration 4) both change behavior; global symlinks even sent the machine-wide hooks at the main clone while this worktree edited dead copies.
- Runs that measure the moving live branch must pin a SHA: the follower and autosync move it by design (iteration 2, observed #6).
- Observed death classes not reproducible from inside an automated run: the silent `nohup pi -p` death (detachment itself survived, R5.2) and OS memory-pressure kills. They need executor-level evidence and are recorded as unresolved rather than re-explained.

---

# Iteration records

The five iteration files follow, each under its own heading.

---

## Iteration 1 - Hooks with nobody at the prompt

### What was read

- `.opencode/scripts/git-hooks/pre-commit` (508 lines): hook-flags kill switch lines 16-27; comment-hygiene 40-84; agent-mirror sync 86-105 (no bypass); mirror-parity 107-169; prompt-card sync 171-189; MCP mutation-class 191-211; compiled-routing re-mint 213-370 (auto-stages at 353; block branches 242-251, 284-303, 308-316, 323-331, 335-342, 346-352, 358-366); spec derived-metadata re-mint 372-501 (next-index block 416-423; staged+unstaged block 434-445; auto-stage 467; failure branch 470-478; confirm 484-498).
- `.opencode/scripts/git-hooks/commit-msg` (212 lines): bypass 16-18; empty message block 32-36; subject regex 72; numeric scope 79-81; vague/process rules 91-105; body-line length warning 126-129; trailer classification 121-132; Commit-Id 143-165; 4-path body rule 181-183; block output with bypass 185-201; warnings 204-210.
- `.opencode/scripts/git-hooks/prepare-commit-msg` (276 lines): bypass 28-30; allocator call 191-194; exit-0 contract 11-12, 276.
- `.opencode/scripts/git-hooks/post-commit` (51 lines): autosync gate 23-49; exit 0 line 51.
- `.opencode/scripts/git-hooks/post-merge` (24) and `post-rewrite` (25): source `lib/autostash-orphan-guard.sh`; never block.
- `.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh` (46): anchors `refs/autostash-rescue/<sha>` 27-28; stderr alert 30-36; log 38-42.
- `.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh` (78): threshold/bypass 17-18; fail-open contract 12-15; report includes bypass 65-73.
- `.opencode/scripts/git-hooks/pre-push` (268): fail-safe sourcing 49-69; mass-deletion gate 96-118; autosync exception 86-89, 166-174; remote-create/permission gates 133-185; skill-metadata gate 192-228; compiled-routing gate 230-266.
- `.opencode/scripts/install-git-hooks.sh` (125): target resolution 30-33; symlink install 84-99; bypass summary 101-108; linked-worktree warning 110-125.
- `.opencode/scripts/git-hooks/README.md` §4 (line 100-107): the bypass table; agent-mirror sync listed with no bypass.
- `.opencode/scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh` (80 viewed): `export GIT_CONFIG_GLOBAL=/dev/null` line 16; asserts symlinks only, never global hooksPath.
- `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` (290): denies `ambiguous` unconditionally 183-186; denial text 248-253; enforcement gate 218.
- `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` (502): `PRINT_FLAGS = {-p,--print}` line 42; `hasDispatchEvidence` 219-231; `variableExecutor` 228; `inspectDispatch` 238-263; ambiguous verdict 258.
- `.opencode/hooks/shared/hook-flags.sh` (58): master `SYSTEM_HOOKS_DISABLED`, per-concern var pattern, env-then-file precedence.
- Machine state (read-only): `git config --global core.hooksPath` = `/Users/michelkerkmeester/.config/git/hooks`; each symlink there resolves into `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/scripts/git-hooks/*` (the main clone), not this worktree.

### What was reproduced

All reproductions ran in throwaway repos under this lineage's `scratch/` with `GIT_CONFIG_GLOBAL` pointed at a throwaway config + `GIT_CONFIG_NOSYSTEM=1`. No write touched the repository under study.

**R1.1 -- a hook edited in a linked worktree does not run there (machine-wide install)**

```text
git config --global core.hooksPath        -> /Users/michelkerkmeester/.config/git/hooks (symlinks -> MEGA main clone)
# throwaway: main clone probe prints 'HOOK-FROM=MAIN v1'; global hooksPath -> main copy;
# linked worktree copy edited to print 'HOOK-FROM=LINKED-WORKTREE v2'
$ git commit -m "chore(repro): worktree hook probe"      # run in the linked worktree
HOOK-FROM=MAIN v1
[linked 4fd6191] chore(repro): worktree hook probe
commit_rc=0
```

The commit succeeded and the hook that ran was the main clone's copy, not the worktree's edited file. Worktree edits are invisible until they reach the main clone.

**R1.2 -- pre-commit blocks a packet with staged + unstaged docs (real hook, copied byte-for-byte)**

```text
$ git add specs/x/001-p/spec.md && printf ... > specs/x/001-p/graph-metadata.json && git commit -m "docs(x): update packet spec"
BLOCKED [gate:spec-remint]: specs/x/001-p has documents staged and unstaged at once:
  specs/x/001-p/graph-metadata.json
Metadata derived now would describe content this commit does not contain.
Fix: stage the rest, or unstage the partial edit, then re-commit.
commit_rc=1
```

The block prints no bypass line, while the sibling failure branch at pre-commit:476-477 does print `Bypass: SPECKIT_SKIP_SPEC_REMINT=1 git commit ...`.

**R1.3 -- `git commit -- <pathspec>` is refused by the next-index guard**

```text
$ git commit -m "docs(x): narrowed commit" -- specs/x/001-p/spec.md
BLOCKED [gate:spec-remint]: spec docs are staged and this commit narrows its
pathspec, so metadata staged now would be discarded with the temporary index.
Fix: run the repair yourself and commit its output with the docs:
  node .opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/x/001-p --apply
commit_rc=1
```

Same shape exists for routing inputs at pre-commit:295-303 (`BLOCKED [gate:route-remint]`, no bypass line).

**R1.4 -- commit-msg matrix (direct invocation, non-interactive)**

```text
case A: subject only, 4 staged paths
  BLOCKED: 4 paths are staged; SKILL.md requires a body when four or more paths are staged.
  Bypass: SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1 git commit ...        -> rc=1 (bypass rc=0)
case B: long Refs trailer (106 chars)
  WARNING: Body line 3 exceeds 100 characters.
  Commit allowed; consider revising the message.                  -> rc=0
case C: subject 'docs(x): update WU7 findings'
  WARNING: Subject contains internal process language; ...        -> rc=0
case D: subject 'docs(007): fix packet docs'
  BLOCKED: Scope '007' is numeric-only; use the stable owning subsystem.  -> rc=1
```

**R1.5 -- dispatch-guard classification of command shapes (real module)**

```text
ambiguous -> denied by pi guard | mkdir -p "$L/iterations" "$L/deltas" "$L/scratch" && cat > "$L/deep-research-state.jsonl"
none -> allowed                | mkdir -p /Users/example/scratch/dir-one /Users/example/scratch/dir-two
none -> allowed                | printf 'seed\n' >> "$L/file.txt"
ambiguous -> denied by pi guard | L=/tmp/x; mkdir -p "$L/a"; git init -q
ambiguous -> denied by pi guard | x=$CMD; $x -p task
direct (cli-pi)                | pi -p "task"
none -> allowed                | bash "$L/script.sh"
```

Two commands of this run were denied with `Pi dispatch denied: the command does not prove one direct executor.` -- both shapes were `mkdir -p "$VAR/..."` combined with other statements (including one whose contents were only a state-file write).

**R1.6 -- the installer follows a global `core.hooksPath` into the machine-wide dir**

```text
# throwaway repo with .opencode/scripts/git-hooks/pre-commit, isolated global config:
git config --global core.hooksPath <scratch>/global-hooks
bash .opencode/scripts/install-git-hooks.sh
installed: <scratch>/global-hooks/pre-commit -> <scratch>/installer-repo/.opencode/scripts/git-hooks/pre-commit
```

With a global hooksPath set, `git rev-parse --git-path hooks` (installer line 30) resolves to the global directory, so the installer rewrites the machine-wide hook set to point at whichever repo it runs from -- no warning unless GIT_DIR != GIT_COMMON_DIR (lines 114-125).

### Findings

1. **[confirmed] Worktree hook edits are dead code under the machine-wide install.** Global `core.hooksPath` points at `.config/git/hooks`, whose symlinks resolve into the MEGA main clone's `.opencode/scripts/git-hooks/*`. A hook edited in this worktree does not run for any commit made here (R1.1: main's v1 ran, worktree's v2 did not). Producer: operator/global symlink set + `.opencode/scripts/install-git-hooks.sh:106-108` claims the opposite ("honored automatically") without a way to see which copy is live. Harness blind spot: `tests/install-git-hooks-worktree-harness.sh:16` blanks global config and only asserts symlink presence.
2. **[confirmed] `install-git-hooks.sh` re-points the machine-wide hooks when run under a global hooksPath** (R1.6). Running it from a linked worktree makes the machine-wide symlinks target that worktree's files; removing the worktree dangles every machine-wide hook (the script's warning at :119-124 describes exactly this consequence but only after installing). Producer: `.opencode/scripts/install-git-hooks.sh:30-33, 84-99`.
3. **[confirmed] pre-commit spec-remint blocks an automated committer on staged+unstaged packets** (R1.2; observed-failures #9). Any dirty file inside a staged-doc packet -- including derived files a previous gate run left behind -- wedges the commit; the block prints no bypass, though `SPECKIT_SKIP_SPEC_REMINT=1` exists. Producer: `.opencode/scripts/git-hooks/pre-commit:434-445`.
4. **[confirmed] pre-commit refuses `git commit -- <pathspec>` for staged spec docs / routing inputs** (R1.3). This is the exact commit shape a child uses to commit named paths; the block names a human fix command and no bypass. Producers: `.opencode/scripts/git-hooks/pre-commit:416-423` (spec) and `:295-303` (routing).
5. **[confirmed] commit-msg rules bite non-interactive exact-path committers**: 4+ staged paths require a body (`commit-msg:181-183`), numeric-only scope blocks (`:79-81`). Both blocks DO print the bypass (`:200`). Clarity warnings (with "Commit allowed; consider revising the message.", `:209`) fire on (a) any body/trailer line over 100 chars -- including a `Refs:` spec path -- `:126-129`, and (b) process labels in the subject -- `:102-105`. (a) reproduces the observed-failures #7 symptom class when the spec path exceeds 100 chars.
6. **[confirmed] The pi dispatch guard denies legitimate compound commands.** Any command containing `-p`/`--print` plus any `$` expansion is classified `ambiguous` and denied, with a message that names no bypass (R1.5; dispatch-audit.mjs:42, 219-231, 258; dispatch-preflight-lint.ts:185, 248-253). `mkdir -p "$VAR/..."` alone trips it. Two commands in this run were denied; the spec-design luna lineage lost two calls to the same wedge and the glm lineage log records the same.
7. **[confirmed] No hook prompts for input; the hang risk is unbounded child processes.** No hook reads the terminal (only pre-push reads git's stdin ref list; post-rewrite ignores stdin by design, `post-rewrite:6-7`). Blocks are exit-1 with stderr messages. Remaining hang candidates are node subprocesses spawned without timeout (pre-commit mirror checks `:158`, route mint `:335`, repair-derived `:452`; pre-push guard `:250`) and the allocator in `prepare-commit-msg:191` -- allocator lock behavior is deferred to iteration 5.
8. **[confirmed] Bypass discoverability is asymmetric.** install-git-hooks.sh prints 4 bypasses (`:103-105`); the README table (README:100-107) lists the full set except that agent-mirror sync has none (README:24). Block output prints the bypass on some branches and omits it on others (spec-remint partial/next-index, route-remint next-index/missing-file variants do print at :328/:340/:476 but not at :295-303/:416-443). An unattended caller that only sees the block text cannot learn the escape for the branches that omit it.

### Adjustments proposed

Ranked by how often the failure bites an automated run:

1. **[fix in hooks] Dispatch guard: only treat `-p`+expansion as ambiguous when an executor is actually implicated.** In `dispatch-audit.mjs:219-231`, `variableExecutor` should require the expanded token to be in command position or an executor token to be present in the same segment; `mkdir -p "$L"` must classify `none`. Also name the opt-out (`SYSTEM_DISPATCH_DISABLED=1` / hook-flags) in the denial text (`dispatch-preflight-lint.ts:248-253`). Test: extend `dispatch-audit.test.mjs` with the R1.5 table; assert `mkdir -p "$L/x"` is `none`, `x=$CMD; $x -p t` stays `ambiguous`.
2. **[fix in hooks] pre-commit spec-remint partial-staging branch: name the bypass and distinguish derived files.** At `pre-commit:436-443`, print `Bypass: SPECKIT_SKIP_SPEC_REMINT=1 ...` like the sibling branch at `:476`; and when every unstaged path in the packet is one of the gate's own derived outputs (`graph-metadata.json`, `description.json`), re-derive instead of refusing -- those files are written by the gate itself and by `repair-derived.cjs`. Test: R1.2 script asserts the bypass line is present and that a packet dirty only in `graph-metadata.json` commits after re-derive.
3. **[fix in hooks] pre-commit next-index branches: name the bypass.** `pre-commit:416-423` and `:295-303` should print `SPECKIT_SKIP_SPEC_REMINT=1` / `SPECKIT_SKIP_ROUTE_REMINT=1` beside the fix command. Test: R1.3 script asserts the bypass line.
4. **[fix in hooks/sk-git] Make the live hook provenance visible.** Add `bash .opencode/scripts/install-git-hooks.sh --status` printing `git config --global core.hooksPath`, the resolved hooks dir, and each hook's realpath; add a harness scenario with a global hooksPath pointing at a different checkout; and change the README sentence "editing a hook here takes effect immediately" (`README:118`) to qualify the machine-wide case. Test: harness scenario asserts `--status` reports the shadowed copy.
5. **[fix in hooks] commit-msg: don't count trailer lines toward the 100-char body warning.** Skip `TRAILER_RE` matches in the length check at `commit-msg:126-129` (spec paths in `Refs:` are machine data). Test: R1.4 case B must produce no warning.
6. **[ruled out] "A hook waits for terminal input."** No hook reads the terminal; every block observed is exit-1 with stderr. Hang risk is confined to untimed child processes (finding 7, revisited in iteration 5).

### What this iteration could not settle

- Allocator lock behavior (`commit-id-naming.sh`): whether a killed allocator leaves a lock a later `prepare-commit-msg` waits on (deferred to iteration 5).
- Whether the node subprocesses in pre-commit/pre-push can actually hang or only fail slow (no timeout wrapper visible, not exercised here).
- Whether machine-wide symlinks currently drift from any worktree's sources (only the main-clone target was verified; a full drift scan is operator-side).


---

## Iteration 2 - Live-sync and worktree lifecycle

### What was read

- `.opencode/bin/git-sync.sh` (294 lines): `_bail` (auto mode always exits 0, `:62`); push-gate classifier `:78-104`; fetch/publish loop `:166-219`; **diverged rebase path `:220-263`**; dirty-tracked refusal `:227-232`; pre-existing rebase refusal `:234-244`; conflict abort + restore assertion + `reset --hard` `:265-293`; `.git/git-sync.log` records `:122-138`.
- `.opencode/bin/git-live-follow.sh` (260 lines): ff-only pull `:219-226`; diverged warn-only `:229-238`; per-checkout PID lock `:123-142`; `--start` refuses inside a linked worktree `:149-155`.
- `.opencode/bin/worktree-session.sh` (360 lines): child detection (AI_SESSION_CHILD / linked worktree) `:159-172`; base resolution env > git config > `.worktrees` `:194-204`; live-branch wiring `:209-215`; shared-path symlinks `:264-317`; socket dir under `$HOME/.spk-wt-sock` `:227`; marker = wrapper PID `:351-356`.
- `.opencode/bin/worktree-reaper.sh` (194 lines): base resolution `:60-70`; `_marker_says_inactive` (marker + dead pid) `:82-98`; wrapper-lane + clean + merged + inactive gate `:122-165`; socket cleanup `:172-183`; marker cleanup `:185-192`.
- `.opencode/scripts/git-hooks/post-commit` (51): autosync gate `:23-49`.
- `.opencode/scripts/git-hooks/post-rewrite` (25) + `lib/autostash-orphan-guard.sh` (46): guard reads `git stash list` at hook time `:19-43`.
- `.opencode/skills/sk-git/SKILL.md`: CI model `:295`; ALWAYS #14 autostash `:369`; ALWAYS #16 no hand-rolled publish `:371`; ALWAYS #17 reap order `:372`.
- `.opencode/skills/sk-git/references/continuous-integration.md`: rebase/refusal contract `:56-57`; guarantee table `:131-137` ("No `--autostash` orphan risk" `:137`).

### What was reproduced

**R2.1-R2.4 -- git-sync diverged-tip matrix (throwaway repo, bare origin, live branch)**

```text
R2.1 diverged, non-conflicting
  [git-sync] rebased onto origin/live and published session/one
  sync_rc=0
  sha_before=091b6097977905ad5b585cfd26eea3a51ac09a0d
  sha_after =de511e02002c0ba53e599cc5c2f6b6c2c08fde33
  session_head_rewritten=yes

R2.2 diverged, conflicting
  Auto-merging shared.txt
  CONFLICT (content): Merge conflict in shared.txt
  [git-sync] auto-publish blocked: session/one conflicts with origin/live (1 commit(s) pending, unpublished).
  sync_rc=1
  sha_unchanged=yes
  no rebase state left

R2.3 diverged with dirty TRACKED file
  [git-sync] origin/live moved but there are uncommitted changes to tracked files — cannot rebase.
  sync_rc=1

R2.4 pre-existing rebase state
  [git-sync] a rebase is already in progress — refusing to rebase or abort it. Resolve: git status ...
  sync_rc=1
```

**R2.5 -- conflicting `git rebase --autostash`: the orphan guard never sees the orphan**

```text
Created autostash: c82e149
Applying autostash resulted in conflicts.
Your changes are safe in the stash.
Successfully rebased and updated refs/heads/main.
--- stash list after rebase ---
stash@{0}: autostash
--- working tree status ---
UU f.txt                      (conflict markers present)
--- post-rewrite invocation log ---
post-rewrite invoked args=rebase
stash_list_at_hook_time:      (EMPTY — the autostash is not in refs/stash yet)
--- autostash rescue anchor ---
none
--- alert log ---
no log
--- manual guard run afterwards (same stash entry now present) ---
⚠️  AUTOSTASH DETECTED  stash@{0}  (c82e149a85d8)
   Safety:   anchored at refs/autostash-rescue/c82e149a85d8 (survives a dropped stash)
c82e149a85d81b6fef031e53b683972037dda45d refs/autostash-rescue/c82e149a85d8
2026-09-11T10:03:58Z	HEAD=182b202	stash@{0}	c82e149a85d81b6fef031e53b683972037dda45d
```

**R2.6-R2.7 -- reaper target resolution and removal (fake HOME, custom base)**

```text
R2.6a reaper WITHOUT SPECKIT_WORKTREE_BASE (worktree lives under a custom base)
  [worktree-reaper] no worktree base dir (.../repo/.worktrees) — nothing to prune
  [worktree-reaper] prune stale socket dir (no matching worktree): .../.spk-wt-sock/pi-...-1111
  [worktree-reaper] prune stale session marker (no matching worktree): .../worktree-sessions/pi-...-1111.pid
  worktree dir still exists: yes
  socket dir still exists:   NO
  marker still exists:       NO

R2.6b same run WITH SPECKIT_WORKTREE_BASE and a LIVE marker
  [worktree-reaper] keep (wrapper active or liveness unproven): .../custom-base/pi-...-1111
  socket dir still exists:   yes

R2.6c same mis-resolution with a LIVE pid marker
  marker still exists:       NO

R2.7 dead marker, live child with cwd inside the worktree
  [worktree-reaper] prune (wrapper merged + clean + inactive): .../repo/.worktrees/pi-...-2222
  Deleted branch work/pi/...-2222 (was dee4e97).
  worktree dir after reaper: NO
  child still alive after:   yes
```

### Findings

1. **[confirmed] A diverged autosync rewrites the session branch under the run.** The publish path rebases the session's commits onto the live tip and pushes; the commit object ids the run recorded change (R2.1: `091b609` -> `de511e0`). Producer: `.opencode/bin/git-sync.sh:246-263`. The sync log records the event but not the old/new SHAs (`_record published "rebased onto ..."`, `:248`), so a run cannot reconstruct which of its references went stale.
2. **[confirmed] The conflict path is genuinely clean** (R2.2): abort + assertion + no residual rebase state, branch SHA unchanged, commits left pending. In `--auto` mode the outcome is invisible except in `.git/git-sync.log` because `_bail` exits 0 (`git-sync.sh:62`). Producer-side design, working as documented; the automation gap is outcome visibility, not correctness.
3. **[confirmed] Dirty tracked files block a diverged publish before any rebase** (R2.3, `git-sync.sh:227-232`) and a pre-existing rebase state is refused untouched (R2.4, `:234-244`). Both are safe refusals; the second is the guard against discarding commits made after a foreign orig-head.
4. **[confirmed] The autostash orphan guard cannot see a rebase autostash when it becomes an orphan.** `post-rewrite` runs before git re-applies the autostash, so `git stash list` is empty at the only hook invocation; the conflicting re-apply then leaves `stash@{0}: autostash` plus a conflict-marked tree with no hook left to run (R2.5). Running the same guard afterwards detects and anchors, so the anchor depends on a later rewrite/merge or a human. Producers: `post-rewrite` delegation, `lib/autostash-orphan-guard.sh:19-43` (reads `refs/stash` only), git's autostash order. This contradicts the stated safety net in `SKILL.md` ALWAYS #14 and the "No `--autostash` orphan risk" line in `continuous-integration.md:137` (the latter is about git-sync's own rebase, which is clean-tree only, but the operator/child path is uncovered).
5. **[confirmed] Reaper base mis-resolution deletes live session state.** A wrapper launched with `SPECKIT_WORKTREE_BASE` env only, then a reaper run without that env, resolves `.worktrees`, finds no worktree for the slug, and prunes the live session's socket dir **and session marker -- even when the marker PID is alive** (R2.6a/c). Producers: `worktree-reaper.sh:60-70` vs `worktree-session.sh:194-204` (env > config > default, env is per-process); marker prune `:190` ignores liveness; socket prune `:178`.
6. **[confirmed] The reaper removes a worktree under a live detached child.** The marker proves only the wrapper's exec'd PID; a child that outlives its parent (background runner) does not refresh it. With the marker dead, the clean+merged worktree is removed and its branch deleted while a process still runs with cwd inside (R2.7). Producers: `worktree-reaper.sh:82-98` (liveness = marker PID only), `worktree-session.sh:351-356` (marker written once).
7. **[code-confirmed] The live follower never rebases/resets; it warns on divergence** (`git-live-follow.sh:219-238`) and moves the primary checkout under any run measuring it; it fast-forwards only, so a run's start/end measurements are the run's responsibility (observed-failures #6 class). No producer defect; pin SHAs.
8. **[code-confirmed] Autosync is silent by construction in the hook path.** `post-commit` calls `git-sync --auto --quiet` (`post-commit:45-46`); `--auto` exits 0 for every non-success and `--quiet` suppresses the success line, so the only durable outcome surface is `.git/git-sync.log`.

### Adjustments proposed

1. **[fix in sk-git] Reaper must resolve worktrees from the registry, not from its own base guess.** Before pruning any socket dir or marker, skip slugs that appear in `git -C MAIN_TOPLEVEL worktree list --porcelain` (any base). Optionally, `worktree-session.sh` should persist the chosen base into `speckit.worktreeBase` when it was chosen from the environment, so later processes agree. Test: R2.6a must leave socket dir and marker intact when the worktree is registered under a custom base.
2. **[fix in sk-git] Reaper must not remove a worktree with a live process inside it.** Add a cwd scan (`lsof -a -d cwd` or `/proc/*/cwd`) over the worktree path before `worktree remove`; refuse (report-only) when any live process resolves inside. Alternative narrower fix: children that outlive their parent write their own liveness marker and the reaper treats any marker liveness as active. Test: R2.7 must keep the worktree while the child is alive.
3. **[fix in hooks] Autostash guard must catch the orphan at (or after) the moment it is created.** At `post-rewrite` time, read `$(git rev-parse --git-path rebase-merge)/autostash` (and `rebase-apply/autostash`) when it exists and anchor that object; additionally run `autostash_orphan_guard` from `post-commit` and at `git-sync.sh` entry so any later commit/publish anchors a leftover entry. Test: R2.5 must show the anchor immediately after the rebase with no manual invocation.
4. **[fix in sk-git] Record the SHA rewrite on the rebase publish path.** Extend `_record published "rebased onto ..."` (`git-sync.sh:248`) to include `old=<sha> new=<sha>` so a run can update anything pinned; print the pair when not `--quiet`. Test: R2.1 asserts the log line contains both SHAs.
5. **[fix in sk-git] Make a blocked auto-publish machine-readable.** `--auto` swallowing every outcome is correct for the commit hook, but a lineage has no signal. Emit a small status file beside `git-sync.log` (or a `git config`-visible ref) with the pending commit count and gate name. Test: R2.2 auto-mode run leaves a status record a script can read.

### What this iteration could not settle

- Whether `git merge --autostash` (post-merge path) also re-applies after the hook (ordering assumed identical; only the rebase path was demonstrated).
- Whether any consumer depends on the session SHA surviving autosync (the reaper checks branch merge state, the containment snapshot uses paths not SHAs; not traced).
- Whether the socket dir deletion actually breaks a running MCP daemon (the daemon side was not reproduced; only the deletion of the directory the daemon's socket lives in).


---

## Iteration 3 - The preflight advisory

### What was read

- `.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs` (349 lines): `GIT_SHAPE`/`GIT_INVOCATION` acknowledge `-C` but capture only the subcommand `:26-28`; `parseGitCommand` `:57-83`; the 17 checks (`GIT_CHECKS` `:91-343`); fail-open principle `:18-19`.
  - `add-pathspec-matches-nothing` `:146-154` computes `ctx.addDryRun(p.paths).status !== 'unmatched'`.
  - `reset-hard-discards-changes` `:258-262` (`ctx.dirtyCount()`), `add-update-skips-untracked` `:175-180`, `commit-scope-drops-untracked` `:105-122`, `commit-pathspec-empty-change` `:128-140`, `restore-discards-over-staged` `:187-196`, `case-only-pathspec-folds` `:226-233`, `staged-path-rewritten-by-filter` `:240-246`, `clean-force-deletes-files` `:270-280`, `branch-force-delete-unmerged` `:287-294`, `stash-clear-drops-entries` `:300-305`.
- `.opencode/skills/sk-git/scripts/lib/git-context.mjs` (235 lines): `createGitContext(cwd)` `:94`; `addDryRun` `:168-176` (`git add --dry-run --` in `cwd`); `dirtyCount` `:119`; `untrackedPaths` `:115-116`; `isLinkedWorktree` `:136-141` and `isDetached` `:128` exist but are unused by any check.
- `.opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts` (106 lines): `context = gitContext.createGitContext(ctx.cwd)` `:70`; advisory delivered on `tool_result` `:91-105`; advisory-only `:13-16`.
- `.opencode/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` (146 lines): `projectDir = payload?.cwd || ... || process.cwd()` `:111`; `createGitContext(projectDir)` `:116`; suppression tiers `:68-75`.
- `.opencode/skills/sk-git/scripts/hooks/opencode/sk-git-preflight-advisory.js` (137 lines): same shape, project dir fallback to `process.cwd()` `:81`, `createGitContext(projectDir)` `:110`.
- `.opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs:281`: the only `-C` test asserts `parseGitCommand('git -C /repo status').sub === 'status'` -- it never checks that state resolves against `/repo`.

### What was reproduced

Throwaway: main checkout + linked worktree `wt1` with three new files reachable only from the worktree. The real `GIT_CHECKS` were evaluated by importing the shipped modules (`evaluate.mjs`, scratch `it3-advisory`).

**R3.1 -- raw git is correct when the cwd is correct**

```text
$ git add --dry-run -- w1.txt w2.txt w3.txt        # inside wt1
add 'w1.txt'
add 'w2.txt'
add 'w3.txt'
dry_run_rc=0
$ git add --dry-run -- w1.txt w2.txt w3.txt        # inside main
fatal: pathspec 'w1.txt' did not match any files
dry_run_main_rc=128
$ git add w1.txt w2.txt w3.txt                     # inside wt1
w1.txt
w2.txt
w3.txt
```

**R3.2 -- the real rule engine, correct vs mismatched context cwd**

```text
case 1: context cwd == command cwd (worktree)          advisories fired: (none)
case 2: context cwd = main, paths exist only in wt1    advisories fired: add-pathspec-matches-nothing
case 3: git -C <wt1> add ... , context cwd = main      advisories fired: add-pathspec-matches-nothing
case 4: cd <wt1> && git add ... , context cwd = main   advisories fired: add-pathspec-matches-nothing
case 5: git -C <wt1> add ... , context cwd = wt1       advisories fired: (none)
```

**R3.3 -- the same defect silences a real warning (dangerous direction)**

```text
case 6: git reset --hard, context cwd = wt1 (dirty)   advisories fired: reset-hard-discards-changes
case 7: git reset --hard, context cwd = main (clean)  advisories fired: (none)   <- dirty worktree loses changes unwarned
```

### Findings

1. **[confirmed] The `add-pathspec-matches-nothing` misfire is a context-cwd defect, not a git behavior.** Raw `git add --dry-run` resolves correctly in a linked worktree (R3.1); the check fires only when the context is built on a directory other than the command's effective one (R3.2 cases 2/4). Producer: `git-rule-checks.mjs:146-154` -> `git-context.mjs:168-176`, with the context directory chosen by the adapter: `hooks/pi/git-preflight-advisory.ts:70` (`ctx.cwd`), `hooks/git-preflight-advisory.mjs:111,116` (payload cwd/`process.cwd`), `hooks/opencode/sk-git-preflight-advisory.js:81,110`. Whether the reported session hit this via a runtime cwd mismatch or via the two command forms below is not settled; both command forms are reproduced.
2. **[confirmed] `-C <dir>` is parsed and then dropped.** `GIT_INVOCATION` (`git-rule-checks.mjs:26-28`) consumes `-C <target>` but `parseGitCommand` returns no target and every check reads `ctx`, which was built from the session cwd. `git -C <wt1> add <paths>` evaluated from main fires the false advisory (R3.2 case 3) while the command itself stages exactly those paths.
3. **[confirmed] An inner `cd` is ignored.** `cd <wt1> && git add <paths>` is evaluated against the session cwd, same false fire (R3.2 case 4).
4. **[confirmed] The direction that matters is false silence.** `git reset --hard` about to destroy dirty files in the worktree produces no advisory when the context cwd is the clean primary checkout (R3.3 case 7). This contradicts the module's own fail-open principle: uncertainty is supposed to mean silence, but here certainty is borrowed from the wrong repository state (`git-rule-checks.mjs:18-19`).
5. **[confirmed by code] Twelve of the seventeen checks are cwd-sensitive and can false-fire or false-silence under a mismatched context**: `commit-scope-drops-untracked`, `commit-pathspec-empty-change`, `add-pathspec-matches-nothing`, `add-pathspec-only-ignored`, `add-update-skips-untracked`, `restore-discards-over-staged`, `case-only-pathspec-folds`, `staged-path-rewritten-by-filter`, `reset-hard-discards-changes`, `clean-force-deletes-files`, `branch-force-delete-unmerged`, `stash-clear-drops-entries` (each consumes a `ctx` accessor; line references above). Five checks are shape-only and cwd-independent: `checkout-from-ref-stages-silently`, `merge-strategy-resolves-one-sided`, `history-expiry-defeats-recovery`, `push-deletes-remote-ref`, `force-push-without-lease`.
6. **[confirmed by code] Detached HEAD cannot misfire the current rule set** because no check reads `ctx.branch()` or `ctx.isDetached()`; both accessors exist unused (`git-context.mjs:122-128`), as does `isLinkedWorktree()` (`:136-141`). Any detached-HEAD problem today enters only through the cwd path above.

### Adjustments proposed

1. **[fix in sk-git] Resolve the command's effective cwd before building context.** Have `parseGitCommand` return the first `-C <dir>` target (resolved relative to the session cwd) and pass it to `createGitContext`; when the command contains a preceding `cd <dir> &&` segment, resolve that directory as well, or skip path-dependent checks entirely for that evaluation. Producer: `git-rule-checks.mjs:26-28,57-83` + the three adapters above. Test: port R3.2 cases 3/4 into `git-rule-checks.test.mjs` asserting no advisory when the target directory holds the paths.
2. **[fix in sk-git] Enforce the stated fail-open principle at the check boundary.** When the effective cwd is uncertain (unparseable `cd`/`-C`, multiple conflicting directories), checks must return true (silence) rather than borrow state from the session cwd. Same producer lines; test asserts `git -C /elsewhere add x` from any cwd produces no `add-pathspec-matches-nothing`.
3. **[fix in sk-git] Keep the advisory non-blocking, but stop paying for it wrongly.** No suppression change is needed for correctness; the three suppression tiers (`SKGIT_ADVISORY=0`, id-prefix and single-id skips, `hooks/pi/git-preflight-advisory.ts:11-21`) already exist and the text names the skip form. Priority is the state source, not the switch.
4. **[fix in sk-git, optional] Wire the dormant accessors.** `isDetached`/`isLinkedWorktree` are unused; a rule for the SKILL.md #15 case (push from detached HEAD does not move the local branch) would justify them, but that is an addition, not a misfire fix.
5. **[ruled out] "Raw `git add --dry-run` misbehaves in a linked worktree."** Disproved by R3.1; the shipped check's own dry-run call is the correct approach when its cwd is correct.

### What this iteration could not settle

- Which runtime cwd the reported session actually supplied (`ctx.cwd` vs the bash command's cwd); both the `-C` and inner-`cd` reproductions demonstrate the defect without that answer.
- Whether the pi adapter ever receives a per-call working directory distinct from `ctx.cwd` (the extension API surface exposed to this session does not show it).


---

## Iteration 4 - Fan-out containment and watchdog

### What was read

- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` (787 lines): pre-dispatch snapshot `:486-504`; new-violation detection `:510-540`; revert patch capture `:564-600`; `revertOutOfScopeViolations` (untracked preserved, never deleted) `:613-638`; event builder + `dataLossPossible` `:641-675`; `enforceWriteContainment` `:693-774`; git child env `opts.env ?? process.env` `:196-210`; git invocation itself `:198`.
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`: containment call site `:3048-3105` (options + fatal throw); orchestrator-owned path list `:2594-2598`; static exclusions (siblings, kind dirs, foreign live runs) `:2961-2982`; stall watchdog `:1524-1563` (default 300000ms `:905`); artifact progress poller `:1621-1640`; dispatch liveness wiring `:2905-2940` (`onOutput: markLineageEvent` `:2998`; `onSpawn/onExit` process liveness `:3003-3008`); `stall_detected` status mapping `:306`; pool `getAttemptLiveness` `:2754`.
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs:162`: `stall_detected` is a loud observability event.

### What was reproduced

Reproductions ran against the shipped modules (Node 26 imports the TypeScript module directly). Throwaway repo under the lineage scratch; a nested-repo fixture, no writes elsewhere.

**R4.1 -- another process's tracked write is attributed to the lineage and reverted from HEAD**

```text
baseline out-of-scope dirty paths: []
other-process write applied to plan.md          # specs/x/001-p/plan.md, tracked, packet root
orchestrator ledger appended (exempted path)
stray untracked file created

--- enforce result ---
fatal violations: [ { path: "specs/x/001-p/plan.md", kind: "modified", status: " M" } ]
advisories: [ stray untracked preserved ]
revert actions: [ { plan.md, restored_from_head, ok: true },
                  { stray-untracked.txt, preserved_untracked, ok: true } ]
dataLossPossible: { paths: ["specs/x/001-p/plan.md"],
                    recoverFrom: ".../containment-reverted/1-2026-09-11T10-08-43.515Z.patch",
                    note: "Tracked file(s) rolled back to HEAD. Uncommitted work ... survives only in the patch" }

--- post-revert state ---
plan.md now: "plan v1\n"                         # the edit is gone from the tree
ledger line count: 1                             # exempted, untouched
stray-untracked.txt exists: true                 # preserved, advisory only
patch contains orchestrator edit: true
state log event type: containment_violation
```

The leaf wrote only inside its artifact dir. The planning-doc write came from a separate process; the guard still reported it as the lineage's fatal violation and `fanout-run.cjs:3080-3105` throws on `violations.length > 0`, failing the attempt even when all iterations are on disk (observed-failures #1 shape).

**R4.2 -- the real stall watchdog: what resets it and what does not**

```text
quiet child (no streamed output, no artifact writes): resets = 0     -> [deep-loop] stall_detected
progressing child (artifact-progress resets every 100ms): resets = 8 -> no event

ledger events:
  label=quiet-child event=stall_detected quiet_ms=301 severity=warning
stall_detected count: 1
```

### Findings

1. **[confirmed] Containment misattributes any tracked out-of-lineage write to the running lineage and destroys it from the tree.** Detection is a git-tree diff (`write-containment.ts:510-540`); attribution is "not in the baseline, not in an exclusion" -- writer identity is unavailable. A tracked packet planning doc edited by another process is reverted from HEAD and fails the attempt (R4.1). Current mitigations: only three orchestrator ledger paths are exempted (`fanout-run.cjs:2594-2598`), sibling/foreign-run dirs are excluded, the revert is recoverable (patch + `dataLossPossible`, `write-containment.ts:564-600,641-675`). The residual failure is exactly observed-failures #1: an orchestrator editing its own packet docs during a live lineage can fail a completed lineage.
2. **[confirmed] Untracked out-of-scope writes are preserved, never deleted.** R4.1 stray file: `preserved_untracked`, advisory-only when packet-scoped (`write-containment.ts:613-638,740-757`). The one destructive outcome remains the tracked-file rollback, which the event itself names (`dataLossPossible`).
3. **[confirmed] The stall watchdog has exactly two reset sources and ignores process liveness.** Resets: streamed stdout (`fanout-run.cjs:2998`) and artifact-directory progress (`:1621-1640`, wired at `:2927-2940`). A print-mode child with a >5-minute silent phase (reading/analysis, no writes) emits neither and gets `stall_detected` (R4.2; default threshold 300000ms `:905`). The runner already tracks real process liveness (`lineageProcessLiveness`, set `:3003-3008`, consumed by the pool at `:2754`) but the watchdog is not given it. The event maps to status `warning` and the pool's abort path uses process liveness, so the harm is a misleading `warning`/`stall_detected` record (observed-failures #4), not a kill.
4. **[confirmed] Correct liveness signal for a non-streaming executor: child liveness plus CPU progress.** `kill -0` on the tracked pid proves the child is alive; CPU-time advancement proves it is working; artifact-write cadence already proves output. The watchdog should require (or at least report) both `process_alive` and CPU delta before calling a quiet stretch a stall.
5. **[confirmed, incidental] Containment detection depends on the host's ambient git config.** `gitOutput` spawns git with `opts.env ?? process.env` (`write-containment.ts:200`) and `fanout-run.cjs` passes no env, so the host global excludes file applies. Reproduced accidentally: this machine's `~/.gitignore_global` contains `/specs`, which made the untracked fixture invisible to `git status` until the fixture env isolated config. A global ignore rule can therefore hide real out-of-lineage untracked writes from the guard (fail-open) or make detection disagree with the commit hook's view of the same tree.
6. **[confirmed] The seam.** Containment and the stall watchdog belong to the deep-loop runtime (`runtime/lib/deep-loop/write-containment.ts`, `runtime/scripts/fanout-run.cjs`) -- neither is a git workflow producer and neither can be fixed by sk-git or the hooks. The git-facing producers from iterations 1-3 (hooks, git-sync, reaper, advisory) are sk-git/hooks. The freeze rule that avoids the containment collision is an orchestration discipline (ADR-005 chose it), enforced by nothing.

### Adjustments proposed

1. **[fix in runtime, own packet] Stop failing a lineage for a same-packet tracked write; keep cross-tree escapes fatal.** Extend the packet-scope concept that already governs preserved untracked paths (`write-containment.ts:740-757`) to tracked paths: a tracked violation whose directory is inside the packet that owns the artifact dir becomes a non-fatal advisory (patch still saved, event still logged) rather than a thrown failure; a tracked violation outside the packet stays fatal. Producers: `fanout-run.cjs:3080-3105` (partition before throwing) + `write-containment.ts:711-757`. Test: R4.1 must produce an advisory for `specs/x/001-p/plan.md` and a fatal violation for a tracked file outside `specs/x/001-p/`.
2. **[fix in runtime, own packet] Give the watchdog a real liveness input.** Pass `getProcessLiveness` (the existing `lineageProcessLiveness` entry) and a CPU-time sampler into `startLineageStallWatchdog`; suppress or annotate `stall_detected` while the pid is alive and its CPU time advances; include `process_alive` and `cpu_ms` in the ledger event. Producers: `fanout-run.cjs:1524-1563` and the call site `:2913-2919`. Test: R4.2 with a live sleep child and no writes must not emit `stall_detected`; a dead pid must.
3. **[fix in runtime, own packet] Pin the git environment containment reasons about.** Pass an explicit `env` to `enforceWriteContainment`/`snapshotOutOfScopeDirtyPaths` (the runner already computes a dispatch env); at minimum neutralize host-global excludes for detection so the guard's view matches the repository's committed configuration. Producer: `write-containment.ts:196-210` + `fanout-run.cjs:3048`. Test: fixture with a global ignore rule must still detect the untracked out-of-scope write.
4. **[keep] The untracked-preserve + revert-patch behavior is correct.** No adjustment; the patch and `dataLossPossible` are what make the tracked rollback recoverable, and R4.1 confirms both fire.
5. **[documented] The freeze rule remains an operator/agent discipline.** The producer cannot distinguish writers from a git-tree diff; ADR-005 chose "orchestrator does not edit the live checkout". Adjustment 1 makes that discipline non-fatal for same-packet writers; a broader fix (per-writer audit) is out of scope for this packet.

### What this iteration could not settle

- Whether the observed containment incident #1 predates the current mitigations (patch, `dataLossPossible`, ledger exemptions) -- the module comments describe it, and the mechanism reproduces without them mattering for a planning doc.
- Whether the pool's lag ceiling ever aborts on `stall_detected` indirectly (the code path reads `getAttemptLiveness`, not the watchdog event; not exercised against a real stalled run).
- Whether `git status` ignoring tracked-file ignore rules is the only ambient-config influence (only the untracked/ignore direction was observed).


---

## Iteration 5 - The rest, and the plan

### What was read

- `.opencode/skills/sk-git/scripts/commit-id-naming.sh` (266 lines): lock dir `$common/commit-id-number.lock` `:34-35`; acquisition loop + stale reclaim `:83-126`; the stale branch requires a non-empty owner (`[ -n "$owner" ]` `:107-108`); timeout 300 iterations x 0.1s `:122-124`; `allocate_ordinal` `:165-207`; high-water persistence `:145-162`. Consumer: `prepare-commit-msg:191-194` (allocator failure leaves the message unstamped, never blocks).
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (already read in iteration 4): process liveness map and pool `getAttemptLiveness` `:2754`; saved `logs/fanout-lineage.out|err` `:3028-3036`.
- Cross-references for the leftovers: `git-sync.sh:147-160` (detached HEAD skip), live-follow ff-only `:219-238`, reaper `git worktree prune` `:115-116`, install-git-hooks global-hooksPath behavior (iteration 1), host-global excludes observation (iteration 4).

### What was reproduced

**R5.1 -- a killed allocator can leave a lock nobody reclaims**

```text
R5.1a lock dir with NO pid file (kill between mkdir and pid write)
  commit-id-naming: lock acquisition timed out
  allocate_rc=1 elapsed_s=33
  (lock dir empty; still present)

R5.1b lock owned by a LIVE unrelated pid
  commit-id-naming: lock acquisition timed out
  allocate_rc=1 elapsed_s=35

R5.1c clean mint after removal
  0000001
```

**R5.2 -- nohup-detached child survival across the Bash tool-call boundary**

```text
start.sh: nohup bash -c "sleep 4; write marker" &   (call returns immediately)
check.sh (separate tool call):  detached child alive: no (pid 8738)
                               marker: alive
```

The marker exists, so the child ran at least 4s after the shell that started it exited: simple detachment from the tool shell survives here. Observed-failure #2 (a `nohup pi -p ...` dying mid-task) is therefore not explained by the tool-shell boundary alone; it is executor- or OS-specific (the memory-pressure class of #8 is the other candidate). Neither the silent `pi` death nor the OOM kills are reproducible from inside this lineage.

**R5.3 -- GIT_* environment probes (partially inconclusive, reported as such)**

```text
normal toplevel from repoB:      .../repoB
GIT_DIR=repoA/.git from repoB:   .../repoB   (GIT_DIR redirects the gitdir, not the toplevel)
GIT_DIR + GIT_WORK_TREE not set: same
```

`GIT_DIR` alone does not move `rev-parse --show-toplevel` in current git; the already-proven environment effects are the global hooksPath (iteration 1), the host global excludes file (iteration 4), and `GIT_INDEX_FILE=next-index-*` reaching the pre-commit hook (iteration 1 R1.3, where the hook refuses by name).

### Findings

1. **[confirmed] A kill in the allocator's two-syscall window leaves an unreclaimable lock.** `_ci_acquire_lock` creates the lock directory (`commit-id-naming.sh:90`), then writes `pid` by rename (`:92-94`). The stale-reclaim branch runs only when a non-empty owner exists (`:107-108`), so a no-pid lock is never stolen: every contender burns the 30s timeout and fails (R5.1a). A live-but-stale owner (recycled pid or a hung holder) behaves the same while the pid answers `kill -0` (R5.1b). Effect on a commit: `prepare-commit-msg:191-194` catches the failure and commits without `Commit-Id`; the cost is up to 30s of dead wait per commit plus silently unstamped history. Same PID-reuse liveness assumption as the reaper marker (`worktree-reaper.sh:96`) and the live-follow lock (`git-live-follow.sh:132`).
2. **[confirmed] Detached children survive the tool-shell boundary in this runtime; the suffered deaths were not detachment.** R5.2. No producer change is implied by the reproduction itself; the observed `nohup pi -p` death needs executor-level evidence (its stdout buffer is saved by the runner, `fanout-run.cjs:3028-3036`, so an empty log plus a dead pid is the signature of an OS kill or a CLI self-exit, not of the shell tear-down).
3. **[confirmed by code] The stale-worktree-registration case is already handled.** The reaper runs `git worktree prune` unconditionally (`worktree-reaper.sh:115-116`) before any removal, and wrapper paths are timestamp-unique, so a crashed wrapper's registration cannot block a later allocation. No adjustment.
4. **[confirmed by code] A moving live branch during a run is by design and detected, not prevented.** The follower fast-forwards the primary checkout (`git-live-follow.sh:219-226`), autosync rebases a session branch onto the moved tip (iteration 2 F2.1), and a run that pins SHAs/line counts at the start holds stale numbers (observed-failures #6). Adjustment belongs to the run's measurement discipline (pin a SHA, note the moving-ref risk), not to a producer.
5. **[confirmed] Host-global git config is read by more than containment.** Global hooksPath (iteration 1) and the global excludes file (iteration 4 F4.5) both change automated behavior from outside the repository. The hooks that deliberately pin locale (`commit-msg:14`) and ignore stdin (`post-rewrite:6-7`) show the pattern that works: make the interpreter state explicit.

### The consolidated sort and plan

Every confirmed failure in this lineage, sorted by the file that must change. Rank is by how often it bites an automated run, then by blast radius.

**[fix in hooks or sk-git]**

- **A1 (rank 1, highest frequency). Pi dispatch guard denies ordinary compound commands** -- `dispatch-audit.mjs:42,219-231,258` + `dispatch-preflight-lint.ts:185,248-253`. Bit twice in this very run and in two prior lineages. Fix: classify `-p`+expansion as ambiguous only when an executor token is present or the expansion is in command position; name the opt-out in the denial. Test: `dispatch-audit.test.mjs` cases from R1.5 (`mkdir -p "$L/x"` must be `none`).
- **A2 (rank 2, high blast). Reaper deletes a live session's socket dir and marker when its base env is absent** -- `worktree-reaper.sh:60-70,178,190` + `worktree-session.sh:194-204`. Fix: resolve candidate worktrees from `git worktree list --porcelain` (any base) before pruning state, and never prune a marker whose slug appears in that list; persist the wrapper's chosen base into `speckit.worktreeBase`. Test: R2.6a/c (socket and marker survive).
- **A3 (rank 3, high blast). Reaper removes a worktree under a live detached child** -- `worktree-reaper.sh:82-98` + `worktree-session.sh:351-356`. Fix: before `worktree remove`, refuse when any live process resolves inside the directory (cwd scan); or have long-lived children write their own liveness marker. Test: R2.7 (child alive => worktree kept).
- **A4 (rank 4, high blast). Autostash orphan guard never sees the rebase orphan** -- `lib/autostash-orphan-guard.sh:19-43` + hook ordering. Fix: anchor `$(git rev-parse --git-path rebase-merge)/autostash` (and `rebase-apply/autostash`) at post-rewrite time when present, and run the guard from `post-commit` and `git-sync.sh` entry. Test: R2.5 (anchor exists immediately after the conflicting rebase, no manual invocation).
- **A5 (rank 5). pre-commit block branches omit their bypass** -- `pre-commit:416-443,295-303`. Fix: print `SPECKIT_SKIP_SPEC_REMINT=1` / `SPECKIT_SKIP_ROUTE_REMINT=1` on the branches that currently print only a human fix command; treat packets dirty only in the gate's own derived files as re-derivable. Test: R1.2/R1.3 scripts assert the bypass line.
- **A6 (rank 6). Machine-wide hook shadowing and installer re-point** -- `install-git-hooks.sh:30-33,84-99,106-124` + the global symlink set. Fix: `--status` that prints `core.hooksPath` origin and each hook's realpath; a harness scenario with a global hooksPath; qualify README:118. Test: harness asserts the shadow is reported.
- **A7 (rank 7). Diverged autosync rewrites session SHAs without recording the mapping** -- `git-sync.sh:246-263`. Fix: log `old=<sha> new=<sha>` on the rebase publish path. Test: R2.1 asserts the pair in `git-sync.log`.
- **A8 (rank 8). Advisory state reads the wrong cwd** -- `git-rule-checks.mjs:26-28,57-83` + adapter cwd choice (`hooks/pi/git-preflight-advisory.ts:70`, `hooks/git-preflight-advisory.mjs:111,116`). Fix: resolve `-C`/leading `cd` for the context, or fail open when the effective cwd is uncertain; keep advisory-only. Test: R3.2/R3.3 cases (no false fire on `-C`, no false silence on `reset --hard`).
- **A9 (rank 9). Allocator no-pid lock** -- `commit-id-naming.sh:83-126`. Fix: reclaim a lock whose directory has no readable owner after a short grace (the current age-free timeout is the fallback but costs 30s), or write the pid atomically into the lock before returning from `mkdir` (create+write+rename directory). Test: R5.1a (mint succeeds within seconds when the lock has no pid).
- **A10 (rank 10, noise). commit-msg trailer length warning** -- `commit-msg:126-129`. Fix: skip `TRAILER_RE` lines in the length check. Test: R1.4 case B.

**[fix in runtime, own packet]**

- **B1 (rank 1, highest blast). Containment fails a lineage for a same-packet tracked write by another writer** -- `write-containment.ts:510-540,613-638` + `fanout-run.cjs:3048-3105`. Fix: give tracked same-packet violations the same non-fatal advisory + patch treatment the untracked preserved path already gets (`:740-757`); keep cross-packet/cross-tree tracked writes fatal. Test: R4.1 variant (plan.md advisory, an outside tracked file fatal).
- **B2 (rank 2). Stall watchdog false positive for silent-but-working print-mode children** -- `fanout-run.cjs:1524-1563` + call site `:2913-2919`. Fix: feed it the existing `lineageProcessLiveness` plus a CPU-time sample; annotate `process_alive`/`cpu_ms`; suppress or downgrade while the child makes CPU progress. Test: R4.2 extension (live sleeping child with no writes => no `stall_detected`; dead pid => event).
- **B3 (rank 3). Containment detection inherits host-global git config** -- `write-containment.ts:196-210`; `fanout-run.cjs:3048` passes no env. Fix: pass the run env with host-global excludes neutralized (or record which config the detection used). Test: fixture with a global ignore rule still detects the untracked out-of-scope write.
- **B4 (rank 4). Detached-child death diagnostics** -- the runner records exit and saves stdout/stderr (`fanout-run.cjs:3028-3036`) but a killed/self-exited print-mode child leaves an empty log with no cause. Fix (instrumentation first, no behavior change): record the child's exit signal already; add peak RSS / process-tree exit notes at settle so the OOM class (#8) is distinguishable from a clean self-exit. Test: kill -9 a stub child and assert the settled record names the signal.

**Environment/documentation items (no code)**

- Global git config participates in every automated path (hooksPath, excludes). A session should not assume repository-local configuration is what runs.
- Runs that measure the moving live branch must pin a SHA (observed #6); the follower and autosync will keep moving it by design.

### Proposed adjustment order

1. B1 (containment failure semantics) -- highest blast, one partition change at the producer.
2. A1 (dispatch guard) -- highest frequency, small classifier change.
3. A2/A3 (reaper) -- destructive class, same file, one packet.
4. A4 (autostash anchor) -- data-loss class, one guard function.
5. A5 (missing bypasses) -- cheap, unblocks unattended committers.
6. A6/A9 (installer status; allocator lock) -- operational hygiene.
7. B2/B3, A7, A8, A10 (watchdog, env, SHA log, advisory cwd, noise).

### What this iteration could not settle

- The `nohup pi -p` silent death (needs the executor's own exit evidence outside this sandbox) and the OOM-kill class.
- Whether a `GIT_DIR` export ever reaches these scripts in practice (the probe shows it redirects the gitdir but not the toplevel; `GIT_INDEX_FILE` is the one that demonstrably reaches hooks).
- Whether the allocator no-pid window is reachable in practice (it requires a SIGKILL in a two-syscall gap; the reproduction shows the cost, not the frequency).


---

