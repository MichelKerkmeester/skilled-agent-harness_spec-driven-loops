# Iteration 011 — Attribution pass and the two smallest releases

## Focus

Two jobs: (1) attribute every logged finding to a single release with a commit, and (2) mine the
v4.0.0.11 and v4.0.0.12 diffs to this cluster, which are small enough (22 and 4 files) to read whole.

## Actions Taken

1. Read the tag dates for all 15 releases, then mapped every attributed commit date onto the window
   between two tags. The beta baseline is `f071100b65`, 2026-08-09; v4.0.0.0 is 2026-09-21.
2. Ran 24 path-limited `git log --reverse -S'<distinctive string>'` queries, one per unattributed finding,
   plus `--diff-filter=A` for the six files whose existence is the finding.
3. Confirmed the focus's file counts exactly: `git diff --stat v4.0.0.10..v4.0.0.11` and
   `v4.0.0.11..v4.0.0.12` over the two cluster paths return 22 and 4 files.
4. Read the whole 108-line `extract-from-evidence.cjs` hunk in v4.0.0.11 and the four v4.0.0.12 files.
5. Compared `corpusHash` across four tags and read the manifest's exclusion list.

### Method note: the attribution wall

Every `-S` query that is limited to a current path returns the same commit:

```
330427cf30 2026-09-17 refactor(source-root): move the authored asset tree from .opencode to .skilled
```

For `gate-3-classifier.ts`, plain `git log -- <path>` reports **1** commit while
`git log --follow -- <path>` reports **22**. The `.opencode` → `.skilled` move is a whole-tree rename, and
`-S` cannot be combined with `--follow`, so no supported command answers "when did this string arrive"
across it. Every "pre-v4.0.0.0" below is therefore a **floor** — the content was present at the parent of
the move, i.e. before 2026-09-17, comfortably before the v4.0.0.0 tag on 2026-09-21 — but it is not a date.
This is recorded as `f-iter011-004`.

## Findings

### F1 — v4.0.0.11 ships a 177-line semantic change to the resource map and its note says nothing

`P2 | drift | v4.0.0.11 | high`

`rg -c -i 'resource.?map|trigger.?index|retrieval|fixture'` on the note returns **0**, and the note has
exactly two headings, `## What's New at a Glance` and `## Upgrade`
[SOURCE: .skilled/changelog/skilled/v4.0.0.11.md:19]
[SOURCE: .skilled/changelog/skilled/v4.0.0.11.md:30].

What the release actually does to `extract-from-evidence.cjs` is not cosmetic. `determineStatus` stops
resolving against `REPO_ROOT` and takes a packet root instead
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/resource-map/extract-from-evidence.cjs:549],
computed by a new `resolveExistingDirectory` that swims up to the nearest git work tree
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/resource-map/extract-from-evidence.cjs:261], and a
new `stripCitationSuffix` removes a `#anchor` before the `:NNN` suffix
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/resource-map/extract-from-evidence.cjs:559].
Every `MISSING` verdict in every review and research resource map is decided here. The note describes none
of it.

Verify: `rg -c -i 'resource.?map|retrieval|fixture' .skilled/changelog/skilled/v4.0.0.11.md`

### F2 — the corpus indexes this run's own research output, so a research iteration stales its own index

`P1 | bug | v4.0.0.12 | high`

This is the causal root of the 43-row stale report the run has carried since iteration 9. The manifest
excludes `**/scratch/**` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:7],
`**/research/lineages/**` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:9] and `specs/**/lineages/**` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:10]
— but **not** `specs/**/research/**`. Research narratives and delta files are ordinary corpus documents.

So `corpusHash` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:2] moves at every tag — `f4851a38` at v4.0.0.10, `ea4d23dd` at v4.0.0.11, `e626e926` at v4.0.0.12, `fd0010dd`
at v4.0.2.0 — even though v4.0.0.12 changes **no source file at all**: its entire four-file delta is
`trigger-index.json` plus three generator outputs.

The consequence is structural, not incidental: the 047 packet's own `spec.md`, `tasks.md`, `timeline.md` and
`decision-record.md` are *newly added documents*, so they appear as added rows by definition. Writing an
iteration is what makes the index stale. A rebuild during the run cannot fix it, and this is the real answer
to Q3's freshness-signal residual: a freshness flag would be correct and would report stale on every
research run, which makes the signal useless as a gate but useful as a warning.

Verify:
```
rg -n 'research|lineages' .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json | head -4
for t in v4.0.0.10 v4.0.0.11 v4.0.0.12; do git show $t:.skilled/.../corpus-manifest.json | rg -m1 -o '"corpusHash": "[a-f0-9]{16}'; done
git diff --stat v4.0.0.11..v4.0.0.12 -- .skilled/skills/system-spec-kit
```

### F3 — the anchor strip was added twice in one commit

`P2 | over-engineering | v4.0.0.11 | high`

v4.0.0.11 adds the `#anchor` strip to `normalizePathCandidate`
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/resource-map/extract-from-evidence.cjs:483] and also
creates a second function that does the same job for `determineStatus`
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/resource-map/extract-from-evidence.cjs:559]. They differ
in two ways a reader cannot predict: the first strips `./` and rejects `../` traversal *before* stripping,
the second strips neither and has no traversal check. One rule, two implementations, one commit. Nothing
breaks if `determineStatus` reuses `normalizePathCandidate` — every caller already hands it a normalized
entry — so the second function only restates the first.

Verify: `rg -n 'stripCitationSuffix|function normalizePathCandidate' .../extract-from-evidence.cjs`

### F4 — attribution wall (method, recorded as a finding)

`P2 | improvement | pre-v4.0.0.0 (330427cf30) | high`

See the method note above. `git log -S` cannot cross the rename and `--follow` cannot combine with `-S`, so
24 of the 28 attributions below stop at "pre-v4.0.0.0". One line of durable metadata — a rename map, or a
documented `-S` + `--follow` recipe — would restore the ability to date every one of them.

Verify: `echo plain=$(git log --format=%h -- $f | wc -l) follow=$(git log --follow --format=%h -- $f | wc -l)`

### F5 — the root fallback was introduced by the commit meant to fix root resolution (correction)

`P1 | bug | v4.0.1.0 | high`

`f-iter008-004` recorded the silent project-root fallback as "pre-v4". It is not. The string arrives in
`6f42c7b169`, 2026-10-31 — after the v4.0.0.16 tag (10-28) and before v4.0.1.0 (11-05) — and that commit's
own subject is *fix(system-spec-kit): resolve the project root from the caller's repository*. The regression
was introduced by the fix whose purpose was to make resolution caller-relative, which puts it inside the
release window this audit covers instead of in legacy debt.

Verify: `git log --reverse --format='%h %cs %s' -S'not inside a repository that uses spec-kit' -- .skilled/skills/system-spec-kit/runtime/cli/core/config.ts | head -1`

### F6 — generated outputs live in `fixtures/` and are read back as measurement inputs

`P2 | over-engineering | v4.0.0.12 | medium`

The generator's defaults point into the fixtures directory
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:78], and its own
header says `--out` writes all three beside the index
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:35]. The cold-lookup
measurer then reads that same manifest as the corpus it prices
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/measure-cold-lookup.mjs:40]. One path is both
build output and test fixture, which is why v4.0.0.12's delta is indistinguishable from a rebase. Nothing
breaks if the three move beside `runtime/data/trigger-index.json`: both readers resolve through exported
constants.

## Attribution table

Release windows by tag date: v4.0.0.0 2026-09-21 · .1 09-25 · .2 09-28 · .3 10-06 · .4–.10 10-14 ·
.11 and .12 10-17 · .13 10-23 · .14 10-25 · .15 10-27 · .16 10-28 · v4.0.1.0 11-05 · v4.0.2.0 11-08.

| finding | type | release | commit | date | evidence |
|---|---|---|---|---|---|
| f-iter001-001 | bug | pre-v4 + contract v4.0.0.1 | 330427cf30 | 09-17 | `hasMixedWriteTail` at the rename; AGENTS.md line 75 text is the v4.0.0.1 gate contract |
| f-iter002-002 | ux | pre-v4.0.0.0 | 330427cf30 | 09-17 | lookup and generator both first visible at the move |
| f-iter005-003 | bug | pre-v4.0.0.0 | 330427cf30 | 09-17 | `SPECKIT_TEMPLATES_BASE` at the rename |
| f-iter005-004 | misalignment | pre-v4 + v4.0.0.15 | 330427cf30 / 62e4661e01 | 09-17 / 10-26 | identity rows predate v4; the MEASURED_BEHAVIOR half is v4.0.0.15 |
| f-iter006-004 | bug | pre-v4.0.0.0 | 330427cf30 | 09-17 | `sync-phase-map-status.ts` added at move |
| f-iter006-005 | over-engineering | pre-v4.0.0.0 | 330427cf30 | 09-17 | same file |
| f-iter007-001 | bug | pre-v4.0.0.0 | 330427cf30 | 09-17 | no-shebang condition as old as the file |
| f-iter007-002 | bug | v4.0.0.13 + pre-v4 | b830fd0276 / 330427cf30 | 10-18 / 09-17 | `9-command index` self-count is v4.0.0.13; table and tree predate v4 |
| f-iter007-003 | ux | pre-v4.0.0.0 | 330427cf30 | 09-17 | `Unknown option` and `--level` both at the move |
| f-iter007-004 | ux | pre-v4 ×3 + v4.0.0.2 | d65d4128c6 | 09-26 | only check-goal's `2` is v4.0.0.2 |
| f-iter007-005 | extension | pre-v4.0.0.0 | 330427cf30 | 09-17 | `hasMixedWriteTail` |
| f-iter007-006 | extension | pre-v4.0.0.0 | 330427cf30 | 09-17 | `check-spec-doc-integrity.sh` added at move |
| f-iter007-007 | extension | v4.0.0.2 | d65d4128c6 | 09-26 | 0/2-only contract ships with create-goal |
| f-iter007-008 | misalignment | pre-v4.0.0.0 | be234e6f94 (rename only) | 10-18 | rule text predates v4; the cited path is a v4.0.0.13 rename |
| f-iter007-009 | misalignment | pre-v4.0.0.0 | 330427cf30 | 09-17 | an absent rule has no introducing commit |
| f-iter007-010 | drift | pre-v4.0.0.0 | 330427cf30 | 09-17 | heading predates v4 |
| f-iter008-001 | bug | pre-v4.0.0.0 | 330427cf30 | 09-17 | `contaminationPlan` at the move |
| f-iter008-002 | drift | pre-v4.0.0.0 | **5399875c9e** | **04-13** | the only real pre-v4 commit: docs(026) |
| f-iter008-003 | misalignment | pre-v4.0.0.0 | 330427cf30 | 09-17 | `ROUTE_CATEGORY_ALIASES` |
| **f-iter008-004** | bug | **v4.0.1.0 (corrected)** | **6f42c7b169** | **10-31** | see F5 |
| f-iter008-005 | ux | pre-v4.0.0.0 | 330427cf30 | 09-17 | guard text + `isExpected` list |
| f-iter008-006 | over-engineering | v4.0.0.1 | c8948c3cf7 | 09-24 | the conceding help line |
| **f-iter008-007** | drift | **pre-v4.0.0.0 (corrected)** | 330427cf30 | 09-17 | prior label said v4.0.0.13; the five doc rows predate v4 and v4.0.0.13 added the *runtime*, which is f-iter006-001 |
| f-iter009-001 | bug | pre-v4.0.0.0 | 330427cf30 | 09-17 | present state, not introduced; root cause is F2 |
| f-iter009-002 | over-engineering | pre-v4.0.0.0 | 330427cf30 | 09-17 | index exists at move; per-release churn has no introducing commit |
| f-iter009-003 | bug | v4.0.0.15 | 62e4661e01 | 10-26 | rule script added |
| f-iter009-004 | ux | v4.0.0.15 | 62e4661e01 | 10-26 | template anchor at spec.md.tmpl:109 |
| f-iter009-005 | ux | pre-v4.0.0.0 | 330427cf30 | 09-17 | help set at the move |
| f-iter009-006 | drift | v4.0.1.0 | 924f76f07f | 11-05 | omission inherits the feature's release |
| f-iter009-007 | drift | v4.0.2.0 | 51f70a0317 | 11-08 | the finding is about that note |
| f-iter009-008 | improvement | v4.0.0.16 | 535264ff2c | 10-28 | already single-tag, recorded for the count |

**Net effect on the release map:** only 4 of 28 findings land in a v4 release window
(v4.0.0.1, v4.0.0.2, v4.0.0.13, v4.0.0.15, v4.0.2.0). One prior attribution moved forward to **v4.0.1.0**
and one was withdrawn from v4.0.0.13. The v4 line absorbed defects; it introduced few.

### Observation on the tag map

The SHAs recorded in `deep-research-config.json` are **tag-object** SHAs, not commits:
`git rev-parse v4.0.0.0` → `6e11d39b26`, while `3fed08373e` is its target. v4.0.2.0 is a lightweight tag
on `51f70a0317`. Both conventions coexist in one tag series, so a reader mixing them diffs the wrong pair —
which is the likely origin of the "all v4.0.0.4–.10 share one commit" note in the config.

## Questions Answered

- **Q3 freshness signal (residual, now answered):** F2. Freshness can be measured, but not usefully gated —
  the corpus includes `specs/**/research/**`, so every research iteration stales the index by construction.
- **Q6 which step has no test (residual on attribution):** unchanged; F5 shows `/doctor:update` shares a
  commit-dated defect with the root resolver, but the `align/apply/rollback/compat` dry-run path is still
  only read, never run.
- **Attribution requirement itself:** satisfied for all 28 findings that lacked a single tag.

## Questions Remaining

- **Q6** — `align`, `apply`, `rollback`, `compat` remain unrun. Fourth iteration carrying this. It is now
  the oldest open item in the run.
- **Q7** — `create.sh` + level templates: blocked on F5-of-iteration-9 (no preview mode exists), so "does the
  scaffold pass `--strict` without hand edits" cannot be tested read-only.
- **New residual from F2:** whether the manifest should exclude `specs/**/research/**` (making the index
  stable during a run) or whether the freshness gate should tolerate research churn. Both are defensible;
  the current state is neither.
- **New residual from F6:** whether `measure-cold-lookup.mjs` is meant to price the *shipped* corpus or a
  pinned one. If the former, the fixture location is correct and only the name is wrong.
- **Q8–Q12** — v4.0.0.13–v4.0.2.0 doc drift (partly advanced by F1), dead scripts, operator friction,
  sk-code/sk-doc conformance, concrete extensions.

## Next Focus

This is iteration 11 of a configured 11. If the run continues, the highest-value single action is to execute
`/doctor:update align --dry-run` and `rollback --dry-run` in a `/tmp` clone: Q6 has been read-not-run for four
iterations and is the only question in the registry that a single command could close.

## SCOPE VIOLATIONS

None. No repository file was edited, staged or deleted. All probes were `git log`, `git diff`, `git show`,
`rg`, `head` and `sed -n` (read only); the delta and this narrative are the only writes, both inside the run
directory.
