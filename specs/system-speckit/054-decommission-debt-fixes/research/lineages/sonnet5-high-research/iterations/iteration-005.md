# Iteration 5: Duplicated Helpers vs. Spec-Kit's Exported Runtime API

## Focus

Find helpers duplicated across skills that spec-kit's runtime already
exports via `@spec-kit/runtime/api` or CLI utilities: path containment,
frontmatter parsing, spec-folder detection, level scoring.

## Findings

### F5-1 (Reframing finding, Medium): `@spec-kit/runtime/api` is an internal `runtime/`<->`scripts/` boundary, not a cross-skill shared library -- the research premise partly doesn't hold

`runtime/api/README.md` states the barrel's actual scope explicitly: "the
supported import surface for **the scripts workspace** and any other package
consumer that needs this engine's capabilities" and "every export in
`index.ts` has a named caller **in the scripts workspace**"
[SOURCE: file:.opencode/skills/system-spec-kit/runtime/api/README.md:13,20].
Its export list covers graph refresh, spec-folder identity/validation, folder
discovery, and graph-metadata schema/integrity -- it does **not** export
path-containment (`isWithinDirectory`, in
`runtime/cli/core/workflow-path-utils.ts:33`, not in `api/index.ts`) or level
scoring (`runtime/cli/spec/recommend-level.sh`, a shell script, not a TS
export at all)
[SOURCE: file:.opencode/skills/system-spec-kit/runtime/api/index.ts:10-73].
Nor is there any repo-wide shared package other skills could import from
regardless -- `find .opencode -maxdepth 2 -iname package.json` naming
`shared`/`common`/`util` returns nothing, and `.opencode`'s top level has no
shared-lib directory at all
[SOURCE: dir:.opencode (agents, bin, commands, hooks, install-guides, logs, plugins, scripts, skills -- no shared-lib)].

**Conclusion:** other skills are not failing to reuse an available export;
the export surface this angle assumed exists for path-containment and
level-scoring was never built, and no cross-skill shared package exists for
any skill to reuse regardless of which package "owns" a given helper. This
reframes the fix target from "stop duplicating, import the existing export"
to "decide whether a genuinely shared low-level utility package is worth
building at all," which is an architecture decision, not a quick patch.

**Fix:** If duplication cost is judged worth solving, create a minimal
`.opencode/shared-lib/` (or similar) package exporting only
symlink-safe path-containment and frontmatter-parsing primitives, and migrate
the concrete duplicates in F5-2/F5-3 onto it. Do not force `@spec-kit/runtime/api`
to take on this role -- its own README documents a narrower, already-justified
scope ("every export... has a named caller... adding one without a caller
re-widens the surface that made this package hard to shrink").

### F5-2 (Low-Medium): independent realpath-based path-containment primitives in spec-kit and system-deep-loop, solving adjacent problems, sharing no code

`system-spec-kit`'s `isWithinDirectory()` delegates to `validateFilePath()`
in `shared/utils/path-security.ts`
[SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/core/workflow-path-utils.ts:33-35].
`system-deep-loop`'s `write-containment.ts` independently implements its own
`isContainedInArtifact()` / `isSubpath()` / `canonicalPath()` primitives using
the same `relative()`-does-not-start-with-`..` idiom, plus its own realpath
symlink-safety handling (explicitly commented: "a symlinked repo root (e.g.
macOS `/var` -> `/private/var`) does not make the worktree toplevel disagree")
[SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts:351-385].
These are not the same problem (deep-loop's version is git-diff-based
post-hoc violation detection with revert, not a simple boolean check) but the
underlying low-level "is path A really inside path B, after realpath" logic
is duplicated independently across two packages that could both consume one
shared, well-tested symlink-safe primitive if F5-1's shared-lib were built.

### F5-3 (Medium): hand-rolled frontmatter parsing duplicated across at least 4 independent skill families, no shared `gray-matter`-equivalent dependency anywhere

Grep for hand-written frontmatter-parsing function names (`parseFrontmatter`,
`parseFrontMatter`, `extractFrontmatter`, `readFrontmatter`) found independent
implementations in **`sk-doc`** (`shared/scripts/frontmatter-version.mjs`,
`sk-create-skill/scripts/lib/root-router-contract.cjs`, and 2 more),
**`system-deep-loop`** (`deep-improvement/scripts/agent-improvement/generate-profile.cjs`
and 3 more), **`system-skill-advisor`**
(`mcp-server/scripts/check-skill-doc-frontmatter.mjs`), and
**`system-spec-kit`** itself (at least 10 files across `runtime/cli/` and
`runtime/lib/`, e.g. `lib/frontmatter-migration.ts`,
`extractors/spec-folder-extractor.ts`)
[SOURCE: grep sweep across `.opencode/skills`, 26 total hits excluding `dist/`].
A search of every skill's `package.json` for `gray-matter` (the standard npm
frontmatter library) returned **zero** matches -- no skill in the repo
depends on a shared, tested YAML-frontmatter parser; every one of the four
families above independently re-derives the "split on `---` fences, parse
the middle as YAML" logic by hand.

**Fix:** Either (a) add `gray-matter` (or `js-yaml` + a 10-line fence-splitter)
as a dependency in the 2-3 highest-churn packages (`system-spec-kit/runtime`,
`sk-doc`) and have the others (`system-deep-loop`, `system-skill-advisor`)
depend on whichever becomes canonical, or (b) fold a single frontmatter
parser into the F5-1 shared-lib package if one gets built. Either path
removes 4-5 independently-maintained copies of the same ~20-40 line parsing
logic, each a separate place a frontmatter edge case (BOM, CRLF, multi-document
YAML) can silently diverge in behavior.

## Sources Consulted

- `.opencode/skills/system-spec-kit/runtime/api/{index.ts,README.md}`
- `.opencode/skills/system-spec-kit/runtime/cli/core/workflow-path-utils.ts`
- `.opencode/skills/system-spec-kit/shared/{paths.ts,utils/path-security.ts}`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts`
- Repo-wide grep for hand-rolled path-containment and frontmatter-parsing function names, and for `gray-matter` across all `package.json` files
- `find .opencode -maxdepth 1 -type d` (no shared-lib directory)

## Assessment

- newInfoRatio: 0.85
- Novelty justification: Reframes the entire angle's premise with direct evidence (F5-1), then grounds two concrete, quantified duplication instances (F5-2, F5-3) in that corrected context -- new structural understanding, not just more grep hits.
- Confidence: High for F5-1 (direct README quote + export-list absence + directory listing); Medium-High for F5-2/F5-3 (function-name greps are a proxy for duplication, not a byte-diff, so exact overlap in logic is inferred from naming + comments, not verified line-for-line).

## Reflection

- What worked: Reading `runtime/api/README.md`'s own stated scope before assuming other skills "should" be importing from it saved this iteration from reporting a wrong root cause (missing imports) instead of the real one (missing export surface + missing shared-lib architecture).
- What failed: The initial broad grep for `isWithin|isPathWithin|...` in `shared/paths.ts` matched an unrelated database-path-resolution file; had to narrow to the actual containment idiom (`relative()` + `..` check) to find the real duplicates.
- Ruled out: `shared/paths.ts` as a path-containment utility -- it resolves database directories, unrelated to containment. [SOURCE: file:.opencode/skills/system-spec-kit/shared/paths.ts:89-172]

## Recommended Next Focus

Q6: retrieval coverage gaps -- documents the trigger index and ripgrep
conventions cannot reach, exclusion-list disagreements, missing trigger
phrases in frequently-referenced docs.
