# Iteration 003 — Candidate (b): `.skilled/repo-rules` in `CORPUS_ROOTS`

- Status: complete
- newInfoRatio: 0.8 (index mechanics and the empirical hit simulation are new; the decision-against and matching constraint carry over)
- Focus: What adding the rule corpus to the trigger-index walk roots would emit per lookup, its silence path, index and lookup cost, matching semantics, portability, and evidence for and against.

---

## 1. WHAT IT WOULD EMIT

**The change.** One line: `.skilled/repo-rules` appended to `CORPUS_ROOTS` (`corpus.mjs:30` — today `['specs', '.skilled/skills', '.skilled/hooks', '.skilled/changelog/skilled']`), then regenerate the committed index (`generate-trigger-index.mjs`). The walker would add the 13 rule documents; the generator reads their `trigger_phrases` frontmatter into the same `phrases` map (`corpus.mjs:191-210`; generator header `generate-trigger-index.mjs:1-45`).

**Measured corpus facts (this iteration).** 255 trigger phrases across the 13 files (16-29 per file), not 8 per file — the earlier sample saw only the first screen of each frontmatter block. 7 phrases are single-token (`flexible`, `invented rule`, `punctuation`, ...); single-token phrases "can only ever match by exact equality" and never rank against a longer prompt (`retrieval-conventions.md:261`), so they are dead weight in an index.

**What a lookup emits.** Per matched document: `{matchClass, path, phrases, score}`, best-class-first, default cap 20 (`lookup-trigger-index.mjs:119-212`). The Gate 1 pointer runs it as `--json --scoring-only`, which drops score-0 partials before the cap (`:22-24,204`). The model then reads the surfaced file(s) — the real context cost of a hit is a 5.6-11.8 KB rule file.

**Empirical silence today (measured).** With the corpus NOT indexed, two rule-vocabulary prompts return zero results and exit 1: "frozen scope while I was in there, add a flexible future proof abstraction" (empty results) and "blast radius rollback sentence stop for a yes" (0 of 1035 candidate phrases scored). Exit 1 is the documented clean no-hit (`lookup-trigger-index.mjs:26,335`).

**Simulated hits (measured, read-only).** Scoring all 255 rule phrases against realistic prompts with the real `scorePhrase`/`normalizeTriggerText` (`normalize.mjs`):
- "add a retry to the failing fetch request" → root-cause-and-debugging.md at 0.880 query-containment ("add a retry").
- "delete the old migration files and force push the branch" → blast-radius.md at 0.880 ("force push").
- "answer the actual request without an unsolicited warning or disclaimer" → answer-the-actual-request.md at 0.880 ("unsolicited warning").
- "frozen scope while I was in there, add a flexible future proof abstraction" → scope-discipline.md and prevent-overengineering.md at 0.880.
- "make the sidebar layout flexible so users can rearrange panels" → 0 hits ("flexible" is single-token; it cannot rank).

## 2. SILENCE CONDITION

Two nested gates, both structural: no query token clears the candidate floor (tokens <3 chars dropped, first 8 distinct kept, `retrieval-conventions.md:265`), or every candidate scores 0 — `--scoring-only` removes them and the process exits 1 (`lookup-trigger-index.mjs:204,335`). No hook, no turn involvement: silence costs one cold parse of the index (below). The empirical 2-of-5 zero-hit rate on realistic prompts suggests silence is the common case, not the exception.

## 3. COST (measured from the artifact)

- **Committed index today**: 3,738,528 bytes, 33,688 phrase keys, 13,172 paths, schemaVersion 2 (measured by loading `runtime/data/trigger-index.json`).
- **Growth from the change**: +13 paths (+0.10%), +255 phrases (+0.76%). Index bytes grow by roughly the phrase keys plus their postings — order +10-25 KB on 3.7 MB (estimate; building the index is outside this lineage's write surface, so this is derived, not measured).
- **Per-lookup**: parsing the artifact dominates and is paid on every cold lookup (`lookup-trigger-index.mjs:11-15`); a +0.1-0.8% artifact is sub-millisecond at the stated "single-digit milliseconds" scan cost.
- **Per-hit**: the surfaced row is small; the model reading a rule file (5.6-11.8 KB) is the real cost, and only on hits.
- **Maintenance coupling**: staleness is defined as phrase-set difference only (`freshness.mjs:4-6`) — body edits do not require regeneration, phrase edits do. Publication is fail-closed corpus-wide: malformed frontmatter in the new root would hold the previous index and exit non-zero (`generate-trigger-index.mjs:11-14`).

## 4. ACTION VS TOPIC MATCHING

The lookup consumes the user prompt text. Rule phrases name anti-patterns in the vocabulary a request can contain, so the two overlap for a subset of rules — measured: "add a retry", "force push", "unsolicited warning", "frozen scope" all hit at 0.88. But the match is the user's topic vocabulary, never the model's action: the trigger table's action phrases ("Add a file, module, class, interface, option...", `REPO RULES.md:40`) are absent from every rule's `trigger_phrases`, so a request like "add a config option" scores nothing while the action it describes fires the overengineering row. The mechanism is complementary to Gate 5 (early, topic-keyed) and cannot replace it (late, action-keyed). Adjacent note, not a proposal: the lookup is model-run with a free-form prompt argument, so a model could query it with a description of its intended action; nothing enforces or prompts that today.

## 5. PORTABILITY

- **Public**: one root line indexes the 13 regular files. The realpath dedupe means the canonical `.skilled/repo-rules/*` path wins over the `repo-rules/` symlink layer, and each document is indexed once (`corpus.mjs:283-327`, esp. `:319-320`).
- **Sibling (Obsidian Plugin)**: shares `.skilled` by symlink, so it reads the same committed index; indexed paths resolve through that symlink. Its 3 local rules at root `repo-rules/` are not covered by a `.skilled/repo-rules` root.
- **Root-name choice is a federation trade-off**: choosing root `repo-rules` instead would index Public's symlink layer, but in the sibling the 12 shared-rule symlinks resolve outside its repository and the walker refuses those ("symlink target outside the repository", `corpus.mjs:307-310`) — leaving only its 3 local files. The corpus checker already supports both layouts (`RULES_DIR_CANDIDATES = ['.skilled/repo-rules', 'repo-rules']`, `check-repo-rules.cjs:31`), but `CORPUS_ROOTS` is a static list: one root name cannot serve both layouts.
- **Source-root spelling** is handled: `corpusRootsFor` maps `.skilled/` onto the actual source root name (`.opencode` variant) (`corpus.mjs:44-51`).

## 6. EVIDENCE FOR

- Fires at prompt time for every prompt, including read-only turns, before the model plans — earlier than Gate 5's first write (`AGENTS.md:93-94`).
- Measured hit quality when vocabulary overlaps is high (0.880, top class `query-containment`), and the hits land on exactly the rule whose anti-pattern the request describes.
- Silence is the default on unmatched prompts (exit 1, no rows, no context).
- Small blast radius: one constant line plus index regeneration; no hook surface changes; every runtime gets it because Gate 1 is model-run.
- The decision-against's core fear — "surfaces a rule as a context candidate" — is also the mechanism's value: the candidate arrives before the action and points at a rule the model can then load through the router.

## 7. EVIDENCE AGAINST

- **Documented decision-against** (`retrieval-conventions.md:284`): "Decided against. The rule documents carry the same frontmatter as spec docs, but they are loaded at Gate 5 through the trigger table in `REPO RULES.md`, not retrieved at Gate 1; indexing them would surface a rule as a context candidate." Any admission must overturn this with the evidence above, and the reason it states is structural, not incidental.
- **Topic, not action**: the mechanism can never match the action about to be taken; the trigger table's action phrases are not in any rule's `trigger_phrases` (section 4).
- **Benign mentions surface rules**: "frozen scope" in a prompt about writing documentation about scope discipline would surface the rule file as context the model does not need.
- **Corpus-internal checker does not compare against the index**: `checkTriggerPhraseUniqueness` only proves no two rule files share a phrase (`check-repo-rules.cjs:292-312`). One rule phrase (`silent reinterpretation`) is already an index key owned by another document (measured) — the index tolerates multi-owner phrases, but the corpus's own collision hygiene is silent about index-level overlap.
- **The index's contract says "nothing else reads" the corpus today** (`check-repo-rules.cjs:5-10`: "The corpus is hand-maintained and nothing else reads it"), so this change makes the rule corpus part of a fail-closed generated artifact for the first time.
- **Single-token dead weight**: 7 of 255 phrases can never rank (`retrieval-conventions.md:261`).
- **Sibling-local rules uncovered** by any static root that serves the shared corpus (section 5).

## 8. RULED OUT / CONSTRAINTS RECORDED

- Root name `repo-rules` as a drop-in for `.skilled/repo-rules`: breaks the shared-symlink sibling (outside-repo link refusal, `corpus.mjs:307-310`). Recorded as a constraint, not a full rejection of the candidate.
- Treating the lookup as an action-matching surface without a model-run query on action text: it cannot match actions as wired today.

## 9. NEXT FOCUS

Candidate (c): the action-keyed PreToolUse advisory — inventory `.skilled/hooks/`, read `injection-contract.md` §3 again for the tool-time precedents, inspect `.claude/settings.json` wiring, and fix emit/silence/cost/feasibility. Also collect candidate (d) inputs (status-quo defense) and the cross-candidate portability comparison.
