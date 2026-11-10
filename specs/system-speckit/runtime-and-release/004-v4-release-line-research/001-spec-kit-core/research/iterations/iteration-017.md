# Iteration 17 — Dist-versus-source drift pass

## Focus

Compare the compiled `dist/` trees against their TypeScript sources for the `runtime/cli` and
`runtime/lib` modules this child has cited; find how `dist` is built and whether any CI step or
hook checks it is current; and close out iteration 16's V6 finding, which claimed
`runtime/dist/core/config.js` does not export `resolveProjectRoot`.

Read-only discipline held: no build, no `tsc` emit, no writes outside this run directory.

## Actions Taken

1. Enumerated both build trees. Established that `runtime/cli/dist/` exists alongside
   `runtime/dist/`, and that they are **separate compilation roots with overlapping basenames**.
2. Read `runtime/tsconfig.json` and `runtime/cli/tsconfig.json` to determine what `npm run build`
   actually compiles.
3. Ran a mechanical export-count diff of every `.ts` under `cli/core` and `lib/*` against its
   compiled `.d.ts`, then manually inspected each hit — all five were false positives (see Ruled Out
   R1).
4. Read `cli/evals/check-source-dist-alignment.ts` end to end for what it actually compares.
5. Grepped every `.github/workflows/*.yml` for the runtime build and for the alignment eval.
6. Checked git tracking of `dist/`, and resolved whether `.skilled` / `.opencode` / `.pi` are
   copies or one tree.
7. Traced what `/speckit:save` actually executes, and read `dist-freshness.cjs` for how a *missing*
   dist is classified.

## Findings

### F1 — `/speckit:save`'s mandated writer is a gitignored, untracked, per-checkout build artifact (P0, bug)

The continuity writer that every `/speckit:save` path names is the **compiled** file
`runtime/cli/dist/continuity/generate-context.js`, not the TypeScript source beside it:

- [SOURCE: .skilled/commands/speckit/save.md:19] — explicit apply runs
  `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js`
- [SOURCE: .skilled/skills/system-spec-kit/references/memory/memory-system.md:39] — names the same
  `dist` path and adds "source at `runtime/cli/continuity/generate-context.ts`"
- Three YAML assets carry the identical invocation:
  [SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:1324],
  [SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:744],
  [SOURCE: .skilled/commands/speckit/assets/speckit-save-context-tail.yaml:16]

That artifact is not in the repository. `git check-ignore -v` resolves it to the blanket ignore rule
[SOURCE: .gitignore:60] (`dist/`), and `git ls-files .../runtime/cli/dist | wc -l` returns **0**.

Nothing builds it as part of install or of the repo-level build:

- The root build is [SOURCE: .skilled/skills/system-spec-kit/runtime/package.json:17] —
  `prepare-build && tsc --build && finalize-dist.mjs` — and the tsconfig that `tsc --build` resolves
  **excludes the CLI tree** at [SOURCE: .skilled/skills/system-spec-kit/runtime/tsconfig.json:47]
  (`"cli/**"`), with `references` naming only `../shared`. The root build therefore cannot emit
  `cli/dist`.
- Neither the runtime nor the CLI manifest carries a `prepare`, `postinstall` or `prepack` hook, so a
  clone plus install produces no `cli/dist`.

The CLI has its own build [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/package.json:13], but
it is only reachable by running a command **inside** `runtime/cli`, and its only automatic trigger is
`pretest` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/package.json:18].

CI compounds this: both workflows that build the runtime invoke the root package, not the CLI
package — `npm --prefix .../runtime run build` in `changed-packet-validation.yml:53` and
`spec-kit-check.yml:123`. Under F2's reading of `tsconfig.json`, neither rebuilds `cli/dist`.

Two failure modes follow. On a fresh clone, `/speckit:save` hits `ERR_MODULE_NOT_FOUND` on the
writer path before any continuity work happens. On a working checkout, it runs whatever bytes the
last local `tsc --build` left behind — untracked and unattested, so the version of the writer that
produced a packet's `_memory.continuity` is not recoverable from the repository.

*Verify:* `git check-ignore -v .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js`
and `git ls-files .skilled/skills/system-spec-kit/runtime/cli/dist | wc -l` (expect `0`).
*Release:* introduced with the compiled-writer contract; present at v4.0.2.0. *Confidence:* high.

### F2 — The only source/dist check detects orphans, never staleness (P1, improvement)

`check-source-dist-alignment.ts` maps each dist `*.js` back to a source `.ts` and fails when no
source exists. Its success line scopes the claim precisely:
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/check-source-dist-alignment.ts:380] —
"every scanned dist *.js file maps to a source .ts file". It performs no `fs.stat`, no mtime compare
and no content compare, so a dist file that exists but predates its source passes cleanly.

The file's own commentary concedes the hazard it does not test:
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/check-source-dist-alignment.ts:256] —
"stale bytes too. Nothing regenerates them, so they drift the moment the source changes."

So the eval answers "is there a dist for every source?" and never "is that dist current?" — the
second being the question F1's failure mode actually depends on.

*Verify:* `grep -n 'fs.stat\|readFile\|mtime' runtime/cli/evals/check-source-dist-alignment.ts`
returns no comparison sites. *Release:* broadened-scope version predates v4.0.0.0. *Confidence:* high.

### F3 — The alignment eval runs in no CI job (P2, drift)

It is wired into the CLI package's `check` aggregate
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/package.json:24], which chains it after
`check-allowlist-expiry.ts`. A repository-wide grep of `.github/workflows/*.yml` for
`check-source-dist-alignment` matches **nothing**; the workflows touch the runtime only to
`npm run build` and to call `validate.sh`. The check therefore fires only when a human runs
`npm run check` inside `runtime/cli`.

Given F2, what CI skips is a check that could not catch F1 anyway — but the gap means the one gate
that would notice a dist file whose source was deleted is voluntary.

*Verify:* `grep -rn 'source-dist' .github/workflows/` → no matches. *Confidence:* high.

### F4 — Supersedes iteration 16's V6: the missing export was a path collision, not drift (P2, drift)

Iteration 16 reported that `runtime/dist/core/config.js` does not export `resolveProjectRoot`. True,
but it is not the compiled counterpart of the source that defines it. The two files are unrelated
modules sharing a basename:

- `runtime/cli/core/config.ts` is a JSONC config loader exporting `gitTopLevel`, `resolveProjectRoot`,
  `normalizeQualityAbortThreshold` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/config.ts:131].
- Its real compiled output is `runtime/cli/dist/core/config.js`, which **does** export the function
  [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/dist/core/config.js:70] and carries the source's
  own banner ("Central configuration loader — reads JSONC config, resolves paths, exports CONFIG
  object") at [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/dist/core/config.js:7].
- `runtime/dist/core/config.js` is a different program: it opens with `SERVER_DIR`,
  `NODE_MODULES`, `INDEX_SCAN_COOLDOWN`, `MAX_QUERY_LENGTH`
  [SOURCE: .skilled/skills/system-spec-kit/runtime/dist/core/config.js:9] — server path and rate-limit
  constants. It has no CLI config loader in it at all.

`resolveProjectRoot` is exported from the correct artifact, so no caller throws. V6's crash premise
should be retired rather than carried. The residual worth keeping is the naming hazard: `core/config`
resolves to two unrelated modules depending on which compilation root you are in, which is what made
the misread easy in the first place.

*Verify:* `grep -n 'resolveProjectRoot' runtime/cli/dist/core/config.js` (line 70) versus
`grep -c 'resolveProjectRoot' runtime/dist/core/config.js` (0). *Confidence:* high.

### F5 — A HARD-block comment rule carries a standing documented exemption (P2, drift)

`ALLOWLIST_EXCEPTIONS` in the alignment eval embeds finding ids and a packet number in three
`reason` strings: [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/check-source-dist-alignment.ts:76]
and its two siblings repeat `F-020-D5-02`, `F-020-D5-03` and "deleted in packet 007"
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/check-source-dist-alignment.ts:82].

The repository ships a dedicated gate for exactly this — `.github/workflows/comment-hygiene.yml` — and
a prior remediation packet recorded `check-source-dist-alignment.ts` allowlist reasons as an
explicit out-of-scope exemption ("test fixtures, `check-source-dist-alignment.ts` allowlist reasons").
So the rule is HARD-block in canon and exempted-in-practice at this site, which is a drift between
the stated gate and the enforced one. Neither the ids nor the packet number earn their keep; the
durable WHY is "orphan from a source move, pending removal in a dist-cleanup follow-on", which
survives deletion of every identifier.

*Verify:* `grep -n 'F-020-D5' runtime/cli/evals/check-source-dist-alignment.ts` → 3 hits.
*Confidence:* high.

### F6 — A missing dist is deliberately invisible to the freshness guard (P2, ux)

The guard already has a package entry for this tree, including its rebuild command
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:46] and
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:53]. But an absent or
unbuildable checkout is classified `unprovisioned` with `stale: false`
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:201], justified in
comment at [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs:178]: "That is
a provisioning gap, not source drift".

The reasoning is sound for a bare worktree the guard cannot fix. The consequence for F1 is a
mismatch of vocabulary at the operator's moment of need: the guard says "not stale" about a checkout
where `/speckit:save` is about to fail outright. That is a documentation gap more than a code one —
`save.md` and `memory-system.md` should name the bootstrap (`cd runtime/cli && npm run build`) as a
precondition rather than assuming the writer exists.

*Verify:* `node .../runtime/cli/lib/dist-freshness.cjs check-all --json` in a scratch worktree
without a built CLI reports `unprovisioned`, `stale:false`. *Confidence:* medium-high (read, not
executed).

## Ruled Out

**R1 — export-count divergence between source and dist (refuted).** A mechanical diff of
`^export ` counts across `cli/core/*.ts` and `lib/*/*.ts` flagged five mismatches:
`cli/core/find-predecessor-memory.ts` (3 vs 4), `lib/continuity/thin-continuity-record.ts` (24 vs
25), `lib/extraction/entity-extractor.ts` (7 vs 8), `lib/graph/access-telemetry.ts` (6 vs 7),
`lib/validation/orchestrator.ts` (11 vs 12). Inspection of each tail shows the delta is exactly the
`.d.ts` trailer — `export {};` plus a `sourceMappingURL` comment — which the source has no analogue
for. Every flagged module's dist is export-complete. The method was wrong, not the artifacts; a
future pass must exclude the trailer line before comparing.

**R2 — the runtime mirror trees are duplicated copies (refuted).** `.opencode/skills` and
`.pi/skills` are symlinks to `../.skilled/skills`; the `system-spec-kit` directory and
`SKILL.md` resolve to the same inodes across all three paths (527692651 and 945665054). There is one
tree, not three. The mirror-drift class of finding cannot apply to `skills/`.

## Questions Answered

None of the two remaining strategy key questions (`/doctor:update` preview/rollback; `create.sh` and
the level templates against `validate.sh --strict`) were answered this iteration. The pass went to
the dist topology instead, because F1 emerged from it and outranks both.

## Questions Remaining

- **Q6 `/doctor:update`** — `align`, `apply`, `rollback`, `compat` still unrun. Tenth iteration
  carrying this. F1 now supplies a reason to stop deferring: if `align`/`apply` depend on a built
  CLI, executing them in a scratch repo would surface the same bootstrap gap from the other end.
- **Q7 `create.sh` + level templates** — unchanged; the scaffold-versus-`--strict` half still needs a
  scratch repo, and the fill-note comparison against sk-doc canon is untouched.
- **New from F1:** whether the doctor/upgrade path provisions `cli/dist` when it aligns a project. If
  it does, F1 downgrades to a first-clone-only issue; if it does not, every aligned project is
  equally exposed.
- **New from F1:** what a consumer of a packet's `_memory.continuity` can do to identify the writer
  version that produced it. Nothing attests it today.
- **New from F3:** whether adding the alignment eval to CI is even the right fix, given F2 says it
  cannot detect the drift that matters.
- **Carried** — Q3 freshness signal, Q4 stale-index gate, Q5 over-budget bind, Q8 doc-drift remainder,
  Q9 rules/options pairs, Q10 operator friction, Q11 sk-code/sk-doc conformance, Q12 extensions for
  trigger index, continuity and goal.

## Next Focus

Iteration 18 should take **Q6 (`/doctor:update`) with the F1 lens**: execute `check` and `--dry-run`
preview for `align`/`apply`/`rollback` inside a scratch repo and record whether the upgrade path
builds `cli/dist` or assumes it. That pays down the oldest open item and answers the highest-value
question F1 raised, in one pass.

## SCOPE VIOLATIONS

No out-of-scope mutation was made by this iteration. Two pre-existing dirty paths were observed in
`git status` and deliberately left alone; both predate this run's first tool call, so neither is
attributable here:

- `specs/001-test-feature/` (untracked, dir mtime 21:27 local) — the residue an earlier iteration
  left, already noted in this run's dispatch warning. Removing it is a banned operation for a leaf
  agent (`rm`), so it is reported, not repaired. It needs an operator or a cleanup packet.
- `specs/system-spec-kit/graph-metadata.json` (modified, 2 insertions / 1 deletion, mtime 20:49
  local) — outside this child's write authority and not touched here.
