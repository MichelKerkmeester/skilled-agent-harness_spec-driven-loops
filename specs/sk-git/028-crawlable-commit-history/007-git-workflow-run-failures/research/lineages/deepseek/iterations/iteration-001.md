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
