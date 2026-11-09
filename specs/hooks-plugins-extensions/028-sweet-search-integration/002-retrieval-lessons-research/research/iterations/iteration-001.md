# Iteration 1: Q1 - Zero-hit fallback to git-changed documents

## Focus

Whether the committed trigger index should gain a zero-hit fallback that re-checks only git's modified and untracked spec docs, modeled on sweet-search's `core/search/grep-unindexed-fallback.js`. Scope was fixed by dispatch: read that module, Skilled's `lookup-trigger-index.mjs`, and `retrieval-conventions.md`, then run at least one real query. This iteration ran in parallel with four siblings, one per lesson; Q2-Q5 were not investigated.

The question has four parts, answered in that order below: does Skilled already do this, how stale is the index in practice, what does a fallback cost, and should the lesson be adopted.

## Actions Taken

1. Read the research packet's config, state log and strategy; confirmed iteration 1, lineage `new`, session id `2026-11-09T14:31:51Z`, progressive synthesis on.
2. Read sweet-search `grep-unindexed-fallback.js` in full and its sibling `index-freshness.js`.
3. Read Skilled `lookup-trigger-index.mjs` in full, then searched the runtime for staleness machinery. Found `retrieval/lib/freshness.mjs` and traced its two consumers: the generator's `--check` mode and the canonical save path.
4. Read `retrieval-conventions.md` in full and `retrieval/README.md` around the documented `--check` behavior.
5. Ran the real lookup twice against this repository: an unscoped query about this exact research topic, and a packet-scoped query on the packet this research lives in. Both exited `1` with zero results.
6. Measured corpus staleness, index shape, and the cost of each proposed fallback step (repo-wide and packet-scoped changed lists, frontmatter read and score of the changed docs).

## Findings

1. **Skilled's keyed lookup performs no staleness check of any kind.** `loadIndex` reads and parses one artifact and returns its `indexHash` and `manifestHash`; `lookup` scores candidate phrases and sorts; the process exits `1` when no result scores above zero. There is no git call, no mtime comparison, no freshness import, and no field in the JSON answer that distinguishes "the corpus does not contain this phrase" from "the index predates this document". [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:106-122] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:232-241] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:379]

2. **A definition of staleness already exists in Skilled, and the lookup is the one consumer that does not use it.** `lib/freshness.mjs` states the single definition: a document is stale when the phrases it declares differ from the phrases the index attributes to its path. Its two consumers are `generate-trigger-index.mjs --check` over the whole corpus and the canonical save path's `checkTriggerIndexFreshness` over one packet. Neither feeds the lookup, so the lookup can return a stale answer with no signal. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/freshness.mjs:4-8] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/freshness.mjs:74-80] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:58] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:286-300]

3. **The failure is live and reproducible in this repository, not hypothetical.** The committed index holds 17,653 paths and 42,211 phrases, and **zero** of those paths match `002-retrieval-lessons-research` - the packet this iteration is writing into. The unscoped query `sweet-search retrieval lessons zero-hit fallback to git changed files` exited `1` with `"results": []`; the same topic scoped with `--spec-folder specs/hooks-plugins-extensions/028-sweet-search-integration` also exited `1` with zero results. The strategy's Known Context already records a save reporting "Trigger index: STALE for spec.md" for a newly created packet. [SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/deep-research-strategy.md:147]

4. **Corpus-wide staleness is tiny; new-packet staleness is total.** The committed index was built at `Nov 9 11:58:23 2026`. At measurement time 39 of 67,595 spec `.md` files were newer than it (0.06%), and `git status --porcelain -- specs` listed 109 changed or untracked entries, 29 of them `.md`. Staleness is therefore rare by file count but concentrated exactly on the newest packets, which are the most likely subject of a fresh session's first prompt. [INFERENCE: based on the measured newer-file count, the changed-file count, and finding 3's absent packet]

5. **The index carries no build timestamp, so sweet-search's freshness rule cannot be ported as written.** Its `indexFreshness` compares a source file's `mtimeMs` against the reconcile manifest's `publishedAt`, and returns `known: false` when that timestamp is absent. Skilled's index top-level keys are exactly `manifestHash`, `normalization`, `paths`, `phrases`, `schemaVersion` - no publish time. The file's own mtime is also untrustworthy here: the same sweet-search file records that a worktree clone gives every file the checkout's mtime, which is why it keeps a separate pending-reindex queue rather than trusting mtimes alone. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/index-freshness.js:17-23] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/index-freshness.js:37-42] [SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json]

6. **The fallback is cheap when scoped and expensive when repo-wide.** Measured on this checkout: cold lookup `0.07s` without the index hash (`0.12s` with it); `git status --porcelain -- specs` `0.88-0.90s`; `git ls-files --modified --others --exclude-standard -- specs` `0.90s`; the same git call scoped to one packet `0.02-0.03s`; `git rev-parse --is-inside-work-tree` `0.01s`; reading the frontmatter of all 15 changed `.md` files and matching the block `0.02s`. A repo-wide fallback costs roughly thirteen times the lookup it is rescuing; a packet-scoped one is close to free. [INFERENCE: based on `/usr/bin/time -p` measurements taken in this iteration against this checkout]

7. **`git ls-files --modified --others` is the wrong candidate source; it misses staged additions.** On this checkout it returned 42 paths (15 `.md`) while `git status --porcelain -- specs` returned 109 entries (29 `.md`). The difference is staged-but-uncommitted `A ` entries, which are neither worktree-modified nor untracked. A packet created and `git add`ed before the next index build is exactly the case Q1 exists to cover, and `ls-files -m -o` would silently omit it. [INFERENCE: based on `git status --porcelain -- specs` returning 109 entries / 29 md and `git ls-files --modified --others --exclude-standard -- specs` returning 42 / 15 in this iteration]

8. **The lesson's scan target does not transfer unchanged.** Sweet-search's fallback greps file *contents*, because its sparse-gram index answers content questions. Skilled's keyed lane answers a different question: which document *declared* this phrase in `trigger_phrases`. The convention is explicit that the two lanes "answer different questions" and that an exact identifier goes to ripgrep first. A body-text grep over changed files would therefore return prose mentions, which belong to the free-text lane, not candidates for a keyed hit. To answer Gate 1's question for a changed document the fallback must read that document's frontmatter phrases and score them with the existing `scorePhrase`/`normalizeTriggerText` pair. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:40-49] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-unindexed-fallback.js:60-79]

9. **A git-aware fallback creates a contract tension the convention would have to resolve.** Section 5 promises that "two runs over an unchanged corpus therefore produce the same ordering". A fallback that adds results from the worktree makes the answer depend on uncommitted state, so two runs on the same corpus can differ. That is arguably still deterministic for a fixed worktree, but the document's claim and the lookup's exit-code contract both need an explicit amendment plus a marker field, not a silent behavior change. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:204-212]

10. **`--check` is not a substitute.** It already reports exactly this staleness, but it "costs one full corpus walk, so it runs as the report-only `advisory-checks.yml` step and by hand, never per lookup". The fallback is a zero-hit-only partial approximation of `--check`, and should be described that way rather than as a replacement. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md:84]

11. **Zero-hits are the minority of ordinary prompts but the norm for genuinely new topics.** A five-prompt probe returned exit `0` for `save context`, `deep research iteration`, `trigger index lookup path` and `spec folder validation strict`, and exit `1` for `add dark mode toggle to settings`. Adding the two topic queries from finding 3, that is 2 of 7 zero-hits. This is a probe, not a rate: the sample is too small and too self-selected to support a percentage. [INFERENCE: based on a seven-prompt probe run in this iteration against the committed index]

## Verdict for Q1: ADAPT

Adopt the shape, not the implementation.

- **Adopt:** on zero-hit only (no result scoring above zero, which is exactly the current exit-`1` condition), build the candidate set from git rather than from mtime, and do nothing outside a git work tree - the same guard sweet-search states as "Outside git there is no such list and nothing is re-run". [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-unindexed-fallback.js:6-9]
- **Adapt, scan target:** read each candidate's frontmatter `trigger_phrases` with the existing `frontmatter.mjs` reader and score them with the existing `scorePhrase`/`normalizeTriggerText`, merging into the same ranked list under the existing tuple. Do not grep body text; that is the free-text lane. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:204-212]
- **Adapt, candidate source:** `git status --porcelain -- specs .skilled/skills`, filtered to `*.md`, so staged additions are covered. Do not use `git ls-files --modified --others`, and do not use mtime. [INFERENCE: based on finding 7's measured coverage difference]
- **Adapt, cost gate:** scope the git call to `--spec-folder` when one is supplied (`0.02-0.03s` versus `0.88-0.90s` repo-wide). Emit a `staleFallback: { files, matches }` block in the JSON answer and keep exit `1` only when both the index and the fallback found nothing. Provide an explicit opt-out for parity fixtures and determinism tests.
- **Drop:** any mtime comparison, any pending-reindex queue (Skilled has no maintainer daemon and no queue file), and any claim that this replaces `--check`.

**File a build phase would change:** `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` for the trigger, merge and answer field; a new `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/changed-docs.mjs` for the git candidate list and frontmatter-phrase read; a sentence in `references/retrieval/retrieval-conventions.md` sections 4 and 5; a paragraph in `runtime/cli/retrieval/README.md`; tests under `runtime/cli/tests/` including a staged-addition case and a non-git case.

**Rough size:** 80-120 lines for the new lib module, 20-30 lines of wiring in the lookup, 5-10 lines of JSON answer surface, plus tests and about 15 lines of documentation. Half a day of focused work, dominated by the test matrix rather than the code.

## Questions Answered

- Q1: Zero-hit fallback (sweet-search core/search/grep-unindexed-fallback.js): when the committed trigger index misses because a packet is new or edited since the last index build, should the lookup re-check only git's modified and untracked spec docs? Does Skilled's lookup already do anything like this, how often is the index stale in practice, and what is the cost?

## Questions Remaining

Q2, Q3, Q4 and Q5 remain open; each is assigned to a sibling iteration and none was investigated here.

## Ruled Out

- **Porting `indexFreshness` verbatim.** Rejected on evidence: Skilled's index has no `publishedAt`, and checkout mtimes are not a build-time proxy.
- **`git ls-files --modified --others` as the candidate source.** Rejected on measured coverage: it loses 14 of 29 changed `.md` files, all staged additions.
- **Body-text grep over changed files as the fallback mechanism.** Rejected on contract: the keyed lane matches declared phrases, not prose.
- **Running `--check` on zero-hit.** Rejected on documented cost: a full corpus walk, explicitly never per lookup.

## Dead Ends

None this iteration. Every named source was readable and every measurement completed.

## Edge Cases

- **Ambiguous input:** none. The dispatch named the module, the two Skilled files and the required real query.
- **Contradictory evidence:** one tension recorded rather than resolved - finding 9, the determinism promise in conventions section 5 versus worktree-dependent results. Resolution belongs to the build phase, not this iteration.
- **Missing dependencies:** none. `rg`, `git`, `jq`, `node` and `/usr/bin/time` were all available.
- **Partial success:** none. All planned actions completed.

## Sources Consulted

- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/grep-unindexed-fallback.js`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/index-freshness.js`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/freshness.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md`
- `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts`
- `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`
- `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`
- `.skilled/skills/system-spec-kit/runtime/data/README.md`
- Measured command output: two lookup runs (exit `1`, zero results each), five-prompt hit probe, `git status` and `git ls-files` counts, `/usr/bin/time -p` timings, `jq keys` on the index.

## Assessment

- New information ratio: 0.90
- Questions addressed: Q1
- Questions answered: Q1

## Reflection

- What worked and why: reading the two Skilled consumers of `freshness.mjs` before forming a verdict turned a plausible "Skilled has no staleness handling" claim into the sharper and more useful "Skilled defines staleness and uses it everywhere except the lookup". Running the lookup on the live packet produced a zero-hit with the packet provably absent from the index, which is stronger than any synthetic example.
- What did not work and why: the first timing pass measured `tail`'s exit status instead of the lookup's, so the exit-code claim had to be re-run without a pipe. The first candidate-set measurement used `git ls-files`, which under-reported changed files until it was diffed against `git status`.
- What I would do differently: measure the exit status and the timing in the same command from the start, and diff two candidate-set commands against each other before trusting either count.

## Recommended Next Focus

Q2, per the strategy's Next Focus ordering. The one Q1 follow-up worth carrying forward is a build-phase question, not a research one: whether the determinism clause in conventions section 5 should be amended to scope its claim to a fixed worktree state, or whether the fallback should be off by default for parity consumers.
