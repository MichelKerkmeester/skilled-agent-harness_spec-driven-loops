# Iteration 6: Retrieval Coverage Gaps in the Trigger Index

## Focus

Find documents the trigger index and ripgrep conventions cannot reach,
exclusion-list disagreements, and missing trigger phrases in
frequently-referenced docs.

## Findings

### F6-1 (Critical / P0): the published trigger index has ZERO skill-doc entries -- an off-by-one root-resolution bug in the generator, masked by the `.opencode/specs` symlink

`memory-system.md` documents the trigger index as reading frontmatter from
**two active source families**: "Spec Documents" (`specs/**/*.md`) and
"**Skill Documents** (`.opencode/skills/**/*.md`)"
[SOURCE: file:.opencode/skills/system-spec-kit/references/memory/memory-system.md:49-50].
`corpus.mjs` declares `CORPUS_ROOTS = ['specs', '.opencode/skills',
'.opencode/install-guides']`
[SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:29].

The **currently published** `runtime/data/trigger-index.json` (regenerated
today per `git log`, commit `3f0731e828`, "align what the trigger index and
the ripgrep recipes cover") contains **11497 paths and 0 of them are under
`.opencode/skills` or reference `SKILL.md`** -- verified by direct grep
(`grep -c "opencode/skills"` and `grep -c "SKILL.md"` against the raw JSON
both return `0`) and by filtering the parsed `paths` array (0 non-`specs/`
entries out of 11497).

**Root cause, traced to source:**
`generate-trigger-index.mjs` computes
`DEFAULT_REPO_ROOT = path.resolve(SCRIPT_DIR, '..','..','..','..','..')`
from `SCRIPT_DIR = .../system-spec-kit/runtime/cli/retrieval`
[SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:59,67].
Five `..` hops from `runtime/cli/retrieval` land on `<repo-root>/.opencode`,
**one level short of the true repo root** -- verified directly:
`path.resolve(SCRIPT_DIR,'..','..','..','..','..')` evaluates to
`/Users/.../044-zvec-grep-integration/.opencode`, and
`fs.existsSync(path.join(DEFAULT_REPO_ROOT, '.opencode/skills'))` is `false`,
while `fs.existsSync(path.join(DEFAULT_REPO_ROOT, 'specs'))` is `true`.

The reason `specs` still resolves is a **symlink coincidence**:
`.opencode/specs` is a symlink to `../specs`
[SOURCE: file:.opencode/specs (symlink, `readlink` -> `../specs`)], so
`path.join('<repo>/.opencode', 'specs')` = `<repo>/.opencode/specs` still
reaches the real spec corpus. `.opencode/skills` has no equivalent
self-referential symlink (`.opencode/.opencode` does not exist), so
`path.join('<repo>/.opencode', '.opencode/skills')` = a nonexistent path, and
`walkCorpus()`'s own root-existence guard silently records `{path:
'.opencode/skills', reason: 'root does not exist'}` and skips it -- **same
for `.opencode/install-guides`.**

**This is directly confirmed by the generator's own committed diagnostics
fixture**, which mirrors the live index's `manifestHash`
(`d209ff17ee6d56a9a923bbdb6effc56c29c36e632e11ca1535d47392bac20837`, matching
exactly) and shows `documentsScanned: 20099` -- exactly the spec-only corpus
size (`corpus-manifest.json`'s `includedPathCount`, also 100% `specs/`
prefixed, 0 skill paths)
[SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json,
file:.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json].
This is not stale test data disconnected from reality -- the diagnostics
fixture's hash matching the live index's hash means **this fixture describes
the exact generation run that produced the file currently shipping in the
repo**.

**Impact:** Gate 1's mandatory trigger-index lookup
(`lookup-trigger-index.mjs`, invoked on every user prompt per root CLAUDE.md
§2 Gate 1) can currently only ever match `trigger_phrases` declared in
`specs/**/*.md`. All **1958** skill-doc files across every skill in the repo
that declare `trigger_phrases:` frontmatter
[SOURCE: `grep -rl "^trigger_phrases:" .opencode/skills --include="*.md"`
excluding changelog/dist/z_archive/scratch, count: 1958] are currently
invisible to Gate 1's declared-phrase lookup, and can only be found via the
separate free-text ripgrep lane -- silently narrowing exactly the surface
`memory-system.md` documents as an "active source family."

**Fix:** In `generate-trigger-index.mjs`, change
`DEFAULT_REPO_ROOT = path.resolve(SCRIPT_DIR, '..','..','..','..','..')`
to add one more `'..'` (six hops, or equivalently
`path.resolve(SKILL_ROOT, '..', '..')`), then regenerate
`runtime/data/trigger-index.json` and verify the published `paths` array
contains `.opencode/skills/**` and `.opencode/install-guides/**` entries.
Add a regression test asserting `walkCorpus(DEFAULT_REPO_ROOT).files` contains
at least one path under each of the three `CORPUS_ROOTS`, so a future
root-resolution regression fails loudly instead of silently degrading to a
partial index the way this one does (the generator's own "fail-closed on
malformed frontmatter" design does not cover "silently walks the wrong root
and calls it a clean corpus").

**Verification command:**
`node -e "const {walkCorpus}=require('.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs'); console.log(walkCorpus(process.cwd()).files.filter(f=>f.startsWith('.opencode/skills')).length)"`
(ESM import syntax needed in practice) should be > 0 after the fix; it is
`0` before it, confirmed above via `fs.existsSync` on the resolved root.

## Sources Consulted

- `.opencode/skills/system-spec-kit/references/memory/memory-system.md`
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs`
- `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json` (live, published)
- `.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/{corpus-manifest.json,generation-diagnostics.json}`
- `git log`, `git show --stat 3f0731e828` (the commit that last regenerated the index)
- Direct `fs.existsSync`/`path.resolve` reproduction of the generator's own root-resolution arithmetic
- `readlink .opencode/specs`

## Assessment

- newInfoRatio: 1.0
- Novelty justification: A fully root-caused, reproducible, high-severity infrastructure bug in the core retrieval mechanism this entire skill depends on, confirmed through source-code arithmetic, live artifact inspection, and the generator's own committed diagnostics -- the single highest-confidence and highest-impact finding of the run.
- Confidence: Very high -- every claim traced to file:line, cross-validated against three independent artifacts (live index, corpus-manifest fixture, generation-diagnostics fixture) that all agree on the same `documentsScanned: 20099` / zero-skill-docs signature, plus a direct `path.resolve` reproduction of the exact off-by-one.

## Reflection

- What worked: Noticing "0 skill/other paths" felt too clean to be a coincidence, so tracing from the published artifact backward to the generator's own root-resolution constant (rather than assuming the corpus definition itself was wrong) found the actual off-by-one in under 10 tool calls.
- What failed: Nothing ruled out this iteration -- the initial anomaly held up under every cross-check instead of dissolving into a false positive, unlike several earlier iterations.
- Ruled out: none this iteration.

## Recommended Next Focus

Q7: validation rule gaps -- defects the review passes found by hand that no
`validate.sh` rule would have caught, and which rule would.
