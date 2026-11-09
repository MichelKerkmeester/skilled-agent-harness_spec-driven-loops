---
title: "Research: retrieval lessons from sweet-search for system-spec-kit"
description: "Five-iteration research rating five lexical techniques from sweet-search against Skilled's trigger index and ripgrep recipes. Build three small changes, defer two; nothing needs embeddings, MCP, a daemon or a new index."
trigger_phrases:
  - "retrieval lessons research"
  - "sweet-search retrieval lessons"
  - "trigger index zero-hit fallback"
importance_tier: "important"
contextType: "research"
---
# Research: retrieval lessons from sweet-search for system-spec-kit

<!-- ANCHOR:summary -->
## 1. Executive Summary

All five lessons were rated ADAPT. None transfers as sweet-search wrote it, because every sweet-search mechanism leans on its persistent index or code graph. Four of the five principles do transfer with only file reads, git and ripgrep; the fifth, dedup, already exists in Skilled, leaving only its observability half. Ranked by value per cost:

1. **Build: a zero-hit fallback to git-changed spec docs.** The gap is live. The committed trigger index holds 17,653 paths and not one of them is the packet this research was written in, so a query about it returns 0 results. About half a day of work. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:24]
2. **Build: report how many candidates a lookup cut.** The lookup already computes the full count, then reports only a `truncated` boolean. About 3–5 lines. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-005.md:27]
3. **Build: an elision line and one line per file in the ripgrep lane.** Single-word queries let one file take 12–14 of the top 20 slots, with no sign that anything was hidden. About 80–140 lines. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-002.md:21]
4. **Defer: demote template boilerplate.** It is real, but it costs 200–270 lines for a problem that bites only on stock-sentence queries. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-003.md:92]
5. **Defer: an out-of-scope hint.** It is nearly free on the keyed lane, but no caller passes a scope there, so the field would never fire. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:37]
<!-- /ANCHOR:summary -->

---

## 2. Research Question and Scope

- **Question.** Which grep-side techniques from sweet-search would improve system-spec-kit retrieval: the committed trigger index (the keyed lane) and the ripgrep recipes with their caller-side ranking tuple (the free-text lane)?
- **Hard constraint.** No embeddings, no vector or BM25 fusion, no MCP, no daemon, and no persistent index beyond the existing committed trigger index. Skilled removed these on purpose. [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:151]
- **Out of scope.** Editing any retrieval file. A build phase does that.

---

## 3. Methodology

- **Workflow.** Five iterations of `/deep:research:auto`, one lesson each, run in parallel on cli-devin with `deepseek-v4-1-flash-max` at the operator's direction. All five passed `verify-iteration.cjs`.
- **Evidence rule.** Each iteration had to read the matching sweet-search module and Skilled's own retrieval code before claiming a gap, and had to run at least one real query against this repo.
- **Synthesis checks.** Before relying on them, these claims were checked against the code:
  - The path-keyed accumulator. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:201]
  - The default limit. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:83]
  - The capped recipe builder. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:110]
  - The research-folder exclusion. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:67]
  - A live zero-hit lookup for this packet's own topic.

---

## 4. Lesson 1: Zero-Hit Fallback to Changed Files (ADAPT, build)

**The gap.**
- The keyed lookup never checks staleness. Its exit code `1` cannot tell "nobody declared this phrase" from "the index predates this document". [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:20]
- Skilled already defines staleness in `lib/freshness.mjs`. The lookup is the one consumer that doesn't use it. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:22]
- Staleness is rare by file count: 39 of 67,595 spec files were newer than the index. It lands exactly on the newest packets, though, and those are what a fresh session asks about first. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:26]

**What to build.**
- **When:** only on a zero-hit result, which is the current exit-`1` condition, and only inside a git work tree.
- **Candidate files:** take them from `git status --porcelain -- specs .skilled/skills`, filtered to `*.md`. Do not use `git ls-files -m -o`: it misses staged additions, and on this checkout it lost 14 of 29 changed docs. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:32]
- **What to read:** each candidate's frontmatter `trigger_phrases`, scored with the existing `scorePhrase`. Do not grep body text; prose matching belongs to the ripgrep lane. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:34]
- **Cost:** scope the git call to `--spec-folder` when one is given. Scoped it took 0.02–0.03 s against 0.9 s repo-wide; the lookup itself takes 0.07 s. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:30]
- **Answer shape:** add a `staleFallback: { files, matches }` field, keep exit `1` only when both sources find nothing, and offer an opt-out for determinism tests.
- **Contract:** amend section 5 of the retrieval conventions. Results would then depend on uncommitted worktree state, so "two runs over an unchanged corpus" needs that qualifier. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:36]

**Files and size:** `lookup-trigger-index.mjs` (20–30 lines), a new `lib/changed-docs.mjs` (80–120 lines), conventions §4 and §5, the retrieval README, and tests that include a staged-addition case and a non-git case. About half a day.

---

## 5. Lesson 2: Per-File Caps and an Elision Line (ADAPT, build)

**The gap.**
- The keyed lane cannot flood: it keeps one row per document by construction. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-002.md:19]
- The ripgrep lane does flood, depending on query shape. For `research` one file took 12 of the top 20; for `iteration` one file took 14. For `deep research` no file took more than 2. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-002.md:21]
- The cause is the rank tuple. A single-word query puts nearly every line in the same match class, so the path tie-break groups one file's lines together. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-002.md:23]
- A capped recipe builder already exists, `structuredCappedRecipe` with `--max-count 1`, but the wrapper that serves the structured recipe does not use it. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-002.md:27]

**What to build.**
- **Take:** the one-line-per-file guarantee before the k cut, a `(+N more in this file)` note, and a tail line of the form `+N more files with M matches`. The count recipe already returns exact totals. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-002.md:31]
- **Leave:** sweet-search's weighted allocation, `sqrt(hits) x prior` with Sainte-Laguë. It would create a second ranker beside the evidence-field and match-class tuple.

**Files and size:** `rg-wrapper.mjs`, reusing `lib/rg-lane.mjs` (80–140 lines), conventions §2.1 and §5, and tests in `rg-wrapper-recipes.vitest.ts`.

---

## 6. Lesson 3: Prefer Meaningful Lines over Boilerplate (ADAPT, defer)

**The gap.**
- The keyed lane returns documents, not lines, so line classes have nothing to act on there. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-003.md:17]
- The stock sentence "This document decides whether the packet may close" matched 784 files, every one ranked as `body` and ordered by path alone. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-003.md:23]
- The literal `FILL` marker is not the pollutant. It appears once per template example file, not across authored packets.

**Keyed-lane side effect.** Template copies can outrank real packets. For `acceptance criteria closure gate`, three template copies took three of six slots, because the index does not keep the phrase judge's `template-default` class. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-003.md:21]

**What a build would do.**
- **Free-text lane:** inside `body`, rank Markdown heading and table-row lines first, demote blockquote guidance and HTML template markers, and spread results one line per section. This touches `lib/rg-lane.mjs`, and conventions §5 would gain the sub-order.

**Why defer:** 200–270 lines including fixtures, for a problem that only shows on stock-sentence queries. Revisit when a recorded query shows boilerplate crowding out a needed result.

---

## 7. Lesson 4: Out-of-Scope Hint (ADAPT, defer)

**The gap.**
- sweet-search's probe depends on its gram index, so it cannot be ported. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:18]
- In the keyed lane the answer is already computed and thrown away. The scope test is a bare `continue` after scoring, so counting the rejected documents costs about 6 ms. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:20] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:22]
- In the ripgrep lane it is a second whole-corpus pass: 0.77 s against 0.012 s, about 64x.

**Why defer.**
- No caller passes `--spec-folder` to the keyed lookup, so the field would never fire. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:24]
- `rg-wrapper.mjs` has no scope concept today.
- Build the keyed half alongside the first real scoped consumer. If only one half is ever built, choose the ripgrep lane, because scoping is actually practiced there.

---

## 8. Lesson 5: Dedup and Final-k (ADAPT narrowly, build the cheap part)

**The gap.**
- **Already handled:**
  - The keyed lane dedups by path and enforces k (`DEFAULT_LIMIT = 20`, with `--limit 0` as the escape). [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-005.md:23] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-005.md:27]
  - Runtime mirror folders never enter either lane, because the recipes search only `specs` and `.skilled`, and ripgrep does not follow the mirror symlinks. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-005.md:31]
  - `z_archive` is excluded in both lanes. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-005.md:35]
- **The real duplication is fan-out scaffolding.** For a research-topic phrase, 5 of 7 ripgrep hits were the per-iteration prompt renders under `research/prompts/`. They are near-duplicates, not identical, so exact-text dedup would not remove them. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-005.md:39]

**What to build.**
- **Report the total candidate count beside `truncated`** in the keyed lookup: about 3–5 lines, using a value it already computes.
- **Document the existing exclusion.** Add a section 9 row for `specs/**/research/**` (trigger index: excluded except `research.md`; ripgrep: included). The code already does this; the table doesn't say so. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-005.md:51]
- **Excluding `research/prompts/` from ripgrep is a coverage decision, not a dedup feature.** Section 9 deliberately keeps lineage documents searchable. Leave it unless a recorded query shows the prompts getting in the way. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-005.md:55]
- **Drop** `span-dedupe.js`: there are no spans to key on.

---

## 9. Recommendations

**Next build phase (one packet, all inside `.skilled/skills/system-spec-kit/`), in this order:**
1. Lesson 5's candidate count and section 9 row. Smallest change, and it sets the truncation-reporting shape the next item reuses.
2. Lesson 1, the zero-hit fallback, with the section 5 determinism amendment.
3. Lesson 2, the elision line plus one line per file, in the ripgrep wrapper.

**Deferred, each with a revisit trigger:**
- Lesson 3: a recorded query where boilerplate crowded out a needed result.
- Lesson 4: the first caller that passes a scope, or a scoped ripgrep search that missed something found elsewhere.

**Never:** embeddings, BM25 or rank fusion, a gram index, a daemon, a pending-reindex queue, mtime-based freshness, or sweet-search's weighted allocation.

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Port `indexFreshness` | Skilled's index has no publish time, and checkout mtimes are not build times | iteration-001.md:28 | 1 |
| `git ls-files -m -o` as the candidate source | Misses staged additions (lost 14 of 29 changed docs) | iteration-001.md:32 | 1 |
| Body-text grep as the zero-hit fallback | The keyed lane matches declared phrases, not prose | iteration-001.md:34 | 1 |
| Run `--check` on zero-hit | It is a full corpus walk, and by contract never runs per lookup | iteration-001.md:38 | 1 |
| Per-file cap on the keyed lane | Already one row per document | iteration-002.md:19 | 2, 5 |
| Copy weighted allocation (Sainte-Laguë, `sat2`) | Would create a second ranker beside the rank tuple | iteration-002.md:29 | 2 |
| Emulate the rank tuple with `sort` | Drops the match-class key and manufactures a fake flood | iteration-002.md (Dead Ends) | 2 |
| Line classes on the keyed lane | The keyed lane returns documents, not lines | iteration-003.md:17 | 3 |
| Port `classifyGrepLines` | Needs a symbol index and freshness, which are banned | iteration-003.md:27 | 3 |
| Demote `FILL` markers | Not a cross-packet pollutant | iteration-003.md:23 | 3 |
| Delete `template-default` phrases | The convention refuses to delete an author's phrase | iteration-003.md (Dead Ends) | 3 |
| Port `probeOutsideScope` | Needs a gram index | iteration-004.md:18 | 4 |
| Out-of-scope hint on every scoped ripgrep query | A 64x tax on the common path | iteration-004.md:22 | 4 |
| `span-dedupe.js` | No spans in either lane, and mirrors and archives never enter | iteration-005.md:23 | 5 |

---

## Divergence Map

- **Saturated directions.** "Port the mechanism": every sweet-search module needs its index or code graph, and all five iterations reached that independently.
- **Pivots taken.** None. Default convergence was used, with one question per parallel iteration.
- **Pivot failures and audited overrides.** At the operator's direction the five iterations ran in parallel, so none saw the others. Iteration 5 asked that its two small edits be sequenced after lesson 2's elision wording, and section 9 follows that order.
- **Remaining frontier.** A query log of real Gate 1 prompts, to measure how often lessons 1–4 actually fire.

---

## 10. Open Questions

- How often do real session prompts hit a stale-index zero? Iteration 1's 7-prompt probe found 2 zero-hits, which is too small a sample to be a rate.
- Does any command or the resume ladder plan to pass `--spec-folder` to the keyed lookup? That one fact decides lesson 4's keyed half.
- Should `research/prompts/` leave the ripgrep lane? That needs an owner's coverage decision in section 9.
- Should the trigger index keep the phrase judge's class, so template copies stop outranking real packets? It is a schema change, outside this research's scope.

---

## 11. Executor Provenance

- **Iterations 1–5:** cli-devin, `deepseek-v4-1-flash-max`, all run in parallel.

---

## 12. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 3: meaningful-line preference (adapt, defer); run 4: out-of-scope hint (adapt, defer); run 5: dedup and final-k (adapt narrowly)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
