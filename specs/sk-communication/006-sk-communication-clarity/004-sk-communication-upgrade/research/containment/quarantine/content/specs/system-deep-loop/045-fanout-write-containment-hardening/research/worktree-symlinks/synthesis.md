# Worktree Symlinks — Synthesis

**Iterations:** 001–005 (`llmgateway/deepseek-v4.1-flash` max, one `glm-5.3-flash`)
**Question:** can per-lineage worktrees be provisioned by symlink instead of install, using
relative self-links, and how narrow can the sk-git rule become?

**Status of the evidence:** every claim below is reproduced, not inferred. The five iterations
had read-only tools and said so; the reproductions were run afterwards and are recorded here.

---

## 1. VERDICT

Symlink provisioning is workable, but not as a single change, because the current rule conflates
**two independent defects** with different fixes. Relative self-links solve one of them. The
other is untouched by link shape and is live in the repository today.

| | Defect 1 — self-link re-anchoring | Defect 2 — entry-point guard |
|---|---|---|
| Affects | the 2 dependency trees carrying `@spec-kit/*` links | the 2 `dist` trees |
| Cause | a relative link re-anchors through its physical location | `argv[1]` keeps the link spelling, `import.meta.url` realpaths |
| Symptom | lane reads main's source | script loads, does nothing, exits 0 |
| Fixed by relative self-links | yes | **no** |
| Fixed by `--preserve-symlinks` | no | no |

---

## 2. WHAT WAS REPRODUCED

### Defect 1 — resolution re-anchors to main

Minimal fixture: a workspace package whose exports map onto `dist/`, a main checkout holding the
npm-created relative self-link, a worktree whose source differs.

| Case | Resolves to | Verdict |
|---|---|---|
| A. whole `node_modules` symlinked from main (today) | main's `dist` | silent wrong-tree read, exit 0 |
| B. A + `--preserve-symlinks` | main's `dist` | realpath *reports* the lane, bytes are main's |
| C. self-link recreated relative, no `dist` in lane | nothing | `ERR_MODULE_NOT_FOUND` |
| D. C + `dist` provisioned into the lane | lane's `dist` | correct |

Case B is the trap: the flag rewrites the reported path into the worktree while still loading
main's bytes, so it makes a wrong read look verified.

Case C is why "just recreate the self-links" is not a fix on its own. `@spec-kit/shared` has six
export keys and **four map onto `dist/`**. `shared/dist` exists in main and is **not** among the
six provisioned paths, so a lane-local self-link points at a tree with no build output.

### Defect 2 — the entry-point guard, reproduced end to end

Guard shape, present at 14 sites across the two `dist` trees:

```js
const IS_CLI_ENTRY = path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (IS_CLI_ENTRY) main();
```

Through a symlinked `dist`, `argv[1]` is the worktree spelling and `import.meta.url` realpaths to
main. The guard reads false and `main()` never runs. `--preserve-symlinks` does not repair it.

Proven against the real repository, in a throwaway worktree provisioned exactly as the runner
provisions one:

```
generator run from main       -> "description.json created in ..."   exit 0
same generator, same args,
  run from the worktree       -> (no output)                          exit 0
  file before / after         -> ABSENT / ABSENT
```

This is not a new discovery so much as the mechanism behind a trap the repository already
documents without naming: "the spec scripts and generators can silently no-op — exit 0, zero
output", and the large-reorg triage row "strict-validate passes but touched 0 files". Both are
this guard. The existing rule text describes the symptom correctly and attributes it to path
resolution; the cause is the guard comparing a spelled path against a realpath.

### Defect 2 is live today, without worktrees mode

The fan-out runner refreshes packet metadata by spawning that generator with
`repoRoot: containmentRepoRoot`, resolved from the orchestrator's own cwd. The launch wrapper
puts every top-level session in a worktree with wholesale-linked `dist`. So the refresh no-ops
whenever the orchestrator is itself in such a worktree — worktree isolation need not be enabled.

Worse, the runner's failure test is `result.status !== 0`. A silent no-op exits 0, so the ledger
records `metadata_refresh_ok` for a generator that did nothing. The run affirmatively claims
success.

Current fleet state: of 27 worktrees, 1 has linked `dist` (silently no-ops), 3 have real `dist`
(installed, correct), 23 have none (skip loudly with `missing_dist`, the safe failure).

---

## 3. VERIFIED INVENTORY

Four repo-internal self-links, in two of the six provisioned paths. The other two dependency
trees are vendored-only and carry none, so linking them wholesale cannot re-anchor anything.

| Path | Self-links | Class |
|---|---|---|
| `system-spec-kit/node_modules` | 3 (`@spec-kit/runtime`, `shared`, `cli`) | link + recreate |
| `system-deep-loop/runtime/node_modules` | 1 (`@spec-kit/shared`) | link + recreate |
| `system-spec-kit/runtime/node_modules` | 0 | link wholesale |
| `system-spec-kit/runtime/cli/node_modules` | 0 | link wholesale |
| `system-spec-kit/runtime/dist` | — | guard-bearing |
| `system-spec-kit/runtime/cli/dist` | — | guard-bearing |

`shared/dist` is absent from this list and is required by any lane-local self-link.
`shared/dist` carries 0 entry-point guards, so it is safe to link.

Both link routines create absolute, wholesale links today, so "recreate the self-links" means
changing the link *shape*, not just the link text.

---

## 4. THE RULE

The rule exists in three scopes that disagree. Only the narrowest names the invariant; the
broadest bans the technique outright. The skill's own text then carves out the launch wrapper as
a "deliberate override" — the same operation, legal or illegal by caller. That exception is not a
weaker rule, it is an unmitigated instance of the banned shape.

Narrowest correct wording replaces the technique ban with a resolution-containment invariant:

> No path linked into a worktree may resolve a repository-internal reference back to the source
> checkout — neither a symlink inside the linked tree, nor the location a loaded module derives
> from its own file. A dependency tree that does neither may be linked.

Four canonical spots carry the current wording, plus a triage row whose "via symlinked deps"
should become "via deps whose resolution re-anchors to the source checkout", so the failure is
identified by symptom rather than technique.

---

## 5. CONSTRAINTS ON ANY FIX

- **Relative text is only correct when every directory from the link up to the lane root is
  real.** Under today's wholesale `node_modules` link, a relative self-link re-anchors through
  the link's physical location and reproduces the defect while looking fixed. The mechanism must
  assert the chain is real directories before writing link text.
- **Relative is required, not preferred.** This repository actively uses `git worktree move`,
  which rewrites git metadata and not link text. Absolute self-links then dangle, or silently
  point at whichever lane later occupies the old path.
- **The destination guard already forbids the wrong shape.** Writing into a wholesale link writes
  into main, shared by every lane; the lifecycle module already throws `destination escapes the
  worktree` for that, so lane-local self-links presuppose a real lane-local dependency directory.
- **`--preserve-symlinks` is not available.** The runtime strips it deliberately, because write
  containment resolves every path through realpath. Both reproductions confirm it fixes neither
  defect.
- **Two existing tests encode the leak as the contract** and will go red on the fix: the
  lifecycle test asserts the link resolves into the fixture repo and that the path *is* a
  symlink; the dependency-seams test borrows its expected root from the resolution system under
  test, so inside a worktree it passes vacuously. Relaxing either until green deletes the only
  provenance guards present.
- **An isolation assertion cannot be a path probe.** Under preserved symlinks a path probe
  reports the lane spelling for a main-owned file. Distinct marker bytes in the two copies is the
  only assertion that cannot pass without the lane's own bytes being loaded.

---

## 6. OPEN FORK

Fixing Defect 2 properly means making the guard symlink-invariant at 14 sites in a different
skill's source. That is the change that retires the documented trap, and it is what makes
linking `dist` safe at all. It is outside this packet's frozen scope and needs its own decision.

Without it, `dist` cannot be linked and must be installed or built per lane — which is the
current rule's position, reached for a reason the current rule does not state.
