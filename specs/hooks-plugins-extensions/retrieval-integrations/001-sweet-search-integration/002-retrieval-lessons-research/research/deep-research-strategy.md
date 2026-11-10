# Deep Research Strategy - retrieval lessons from sweet-search

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Which lexical search techniques from sweet-search (`specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/context/sweet-search-main/core/search/`) would improve system-spec-kit retrieval: the committed trigger index (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs`), the ripgrep recipes and the caller-side ranking tuple (`.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`)? HARD CONSTRAINT: no embeddings, no vector or BM25 fusion, no MCP, no daemon, no persistent index beyond the existing committed trigger index.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Zero-hit fallback (sweet-search core/search/grep-unindexed-fallback.js): when the committed trigger index misses because a packet is new or edited since the last index build, should the lookup re-check only git's modified and untracked spec docs? Does Skilled's lookup already do anything like this, how often is the index stale in practice, and what is the cost?
- [x] Q2: Per-file caps with an elision line (core/search/grep-output-shaping.js, grep-allocation-rules.js): does one large file (a research.md, an iteration log, a changelog) flood Skilled's ranked results today, and would a per-file cap, a one-line-per-file guarantee and a "N more hits in M files not shown" line help? Show real queries.
- [x] Q3: Meaningful-line preference (core/search/grep-line-classes.js): beyond the existing evidence-field order (trigger_phrases, title/description, anchor, body), would demoting template boilerplate (FILL comments, stock template sentences repeated in every packet) improve results? Show real queries where boilerplate matches crowd out real content.
- [x] Q4: Out-of-scope hint (core/search/grep-outside-probe.js): when a track- or packet-scoped search returns little, would a one-line "also N hits in other tracks: X, Y" help, and what does it cost on this repo?
- [x] Q5: Dedup plus final-k (core/search/span-dedupe.js, final-k.js): do runtime mirror folders (.claude/, .opencode/, .codex/ and others) or z_archive copies return the same text more than once today, given the coverage and exclusion policy in retrieval-conventions.md section 9? Would dedup and a strict final-k cut help?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Embeddings, vector or BM25 fusion, MCP servers, daemons, persistent indexes: Skilled removed these on purpose (system-spec-kit SKILL.md declared loss).
- Editing any retrieval file; a later build phase does that.
- Adopting sweet-search itself; phase 1 already decided against it.

---

## 5. STOP CONDITIONS
- Each lesson has an adopt, adapt or drop verdict backed by Skilled code and at least one real query run against this repo.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Zero-hit fallback (sweet-search core/search/grep-unindexed-fallback.js): when the committed trigger index misses because a packet is new or edited since the last index build, should the lookup re-check only git's modified and untracked spec docs? Does Skilled's lookup already do anything like this, how often is the index stale in practice, and what is the cost?
- Q2: Per-file caps with an elision line (core/search/grep-output-shaping.js, grep-allocation-rules.js): does one large file (a research.md, an iteration log, a changelog) flood Skilled's ranked results today, and would a per-file cap, a one-line-per-file guarantee and a "N more hits in M files not shown" line help? Show real queries.
- Q3: Meaningful-line preference (core/search/grep-line-classes.js): beyond the existing evidence-field order (trigger_phrases, title/description, anchor, body), would demoting template boilerplate (FILL comments, stock template sentences repeated in every packet) improve results? Show real queries where boilerplate matches crowd out real content.
- Q4: Out-of-scope hint (core/search/grep-outside-probe.js): when a track- or packet-scoped search returns little, would a one-line "also N hits in other tracks: X, Y" help, and what does it cost on this repo?
- Q5: Dedup plus final-k (core/search/span-dedupe.js, final-k.js): do runtime mirror folders (.claude/, .opencode/, .codex/ and others) or z_archive copies return the same text more than once today, given the coverage and exclusion policy in retrieval-conventions.md section 9? Would dedup and a strict final-k cut help?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the two Skilled consumers of `freshness.mjs` before forming a verdict turned a plausible "Skilled has no staleness handling" claim into the sharper and more useful "Skilled defines staleness and uses it everywhere except the lookup". Running the lookup on the live packet produced a zero-hit with the packet provably absent from the index, which is stronger than any synthetic example. (iteration 1)
- reading both recipe builders before measuring. The contradiction in finding 5 is invisible from either file alone, and it is the actual build target — the cap exists, it is simply not wired into the path the CLI runs. (iteration 2)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the first timing pass measured `tail`'s exit status instead of the lookup's, so the exit-code claim had to be re-run without a pipe. The first candidate-set measurement used `git ls-files`, which under-reported changed files until it was diffed against `git status`. (iteration 1)
- emulating the rank tuple with `sort`. The tuple has four components and the emulation kept two, so it silently removed the match-class spread that keeps multi-token queries diverse, and produced a dramatic but false flood number. The correction cost one extra call and changed the headline from "always floods" to "floods for single-token probes". (iteration 2)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`git ls-files --modified --others` as the candidate source.** Rejected on measured coverage: it loses 14 of 29 changed `.md` files, all staged additions. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`git ls-files --modified --others` as the candidate source.** Rejected on measured coverage: it loses 14 of 29 changed `.md` files, all staged additions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`git ls-files --modified --others` as the candidate source.** Rejected on measured coverage: it loses 14 of 29 changed `.md` files, all staged additions.

### **A literal port of `probeOutsideScope`.** It requires `ensureSparseGramIndex` and a queryable gram index; the hard constraint forbids a persistent index and `retrieval-conventions.md` names vector/BM25/stateful retrieval as a declared loss. A port would return `null` on every call here. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A literal port of `probeOutsideScope`.** It requires `ensureSparseGramIndex` and a queryable gram index; the hard constraint forbids a persistent index and `retrieval-conventions.md` names vector/BM25/stateful retrieval as a declared loss. A port would return `null` on every call here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A literal port of `probeOutsideScope`.** It requires `ensureSparseGramIndex` and a queryable gram index; the hard constraint forbids a persistent index and `retrieval-conventions.md` names vector/BM25/stateful retrieval as a declared loss. A port would return `null` on every call here.

### **Adopting `perFileCap` alone.** One line per file still returns 13,113 rows corpus-wide for a single common token, so it does not bound output on its own. [INFERENCE: corpus-wide file count measured with the count recipe] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Adopting `perFileCap` alone.** One line per file still returns 13,113 rows corpus-wide for a single common token, so it does not bound output on its own. [INFERENCE: corpus-wide file count measured with the count recipe]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adopting `perFileCap` alone.** One line per file still returns 13,113 rows corpus-wide for a single common token, so it does not bound output on its own. [INFERENCE: corpus-wide file count measured with the count recipe]

### **Applying line classes to the keyed lane.** It returns documents, not lines (Finding 1). No code change there can express the lesson. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Applying line classes to the keyed lane.** It returns documents, not lines (Finding 1). No code change there can express the lesson.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Applying line classes to the keyed lane.** It returns documents, not lines (Finding 1). No code change there can express the lesson.

### **Body-text grep over changed files as the fallback mechanism.** Rejected on contract: the keyed lane matches declared phrases, not prose. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Body-text grep over changed files as the fallback mechanism.** Rejected on contract: the keyed lane matches declared phrases, not prose.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Body-text grep over changed files as the fallback mechanism.** Rejected on contract: the keyed lane matches declared phrases, not prose.

### **Copying sweet-search's weighted allocation (Sainte-Laguë / `sat2`) into Skilled.** Would create a second relevance ranker beside the evidence-field/match-class tuple; the tuple already breaks the tie the allocation would be guessing at. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:202-212] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Copying sweet-search's weighted allocation (Sainte-Laguë / `sat2`) into Skilled.** Would create a second relevance ranker beside the evidence-field/match-class tuple; the tuple already breaks the tie the allocation would be guessing at. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:202-212]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Copying sweet-search's weighted allocation (Sainte-Laguë / `sat2`) into Skilled.** Would create a second relevance ranker beside the evidence-field/match-class tuple; the tuple already breaks the tie the allocation would be guessing at. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:202-212]

### **Demoting `template-default` phrases by deleting them.** The convention explicitly refuses to delete an author's phrase, so any fix must demote at rank time, not remove at generation time. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:91] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Demoting `template-default` phrases by deleting them.** The convention explicitly refuses to delete an author's phrase, so any fix must demote at rank time, not remove at generation time. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:91]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Demoting `template-default` phrases by deleting them.** The convention explicitly refuses to delete an author's phrase, so any fix must demote at rank time, not remove at generation time. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:91]

### **Firing the hint on every scoped ripgrep query.** 0.77 s against 0.012 s is a 64x tax on the common path to help the rare one. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Firing the hint on every scoped ripgrep query.** 0.77 s against 0.012 s is a 64x tax on the common path to help the rare one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Firing the hint on every scoped ripgrep query.** 0.77 s against 0.012 s is a 64x tax on the common path to help the rare one.

### **Firing the hint on the keyed lane's unscoped zero.** With no scope supplied there is nothing out of scope, and the observed zero was a phrase miss (0 unscoped) rather than a scope miss. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Firing the hint on the keyed lane's unscoped zero.** With no scope supplied there is nothing out of scope, and the observed zero was a phrase miss (0 unscoped) rather than a scope miss.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Firing the hint on the keyed lane's unscoped zero.** With no scope supplied there is nothing out of scope, and the observed zero was a phrase miss (0 unscoped) rather than a scope miss.

### **Measuring the flood with a shell sort.** A `sort -t: -k1,1 -k2,2n | head -20` emulation of the rank tuple reported 20 of 20 top lines from a single file for `deep research`, which the real ranker contradicts (15 distinct files in the same top 20). The emulation dropped the match-class component that precedes the path tie-break, so it manufactured a flood that the shipped ranker does not produce for that query. Re-measured by calling `search('structured', …)` directly; only the real-ranker numbers are used above. Candidate for "exhausted approaches": do not emulate the rank tuple with `sort`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Measuring the flood with a shell sort.** A `sort -t: -k1,1 -k2,2n | head -20` emulation of the rank tuple reported 20 of 20 top lines from a single file for `deep research`, which the real ranker contradicts (15 distinct files in the same top 20). The emulation dropped the match-class component that precedes the path tie-break, so it manufactured a flood that the shipped ranker does not produce for that query. Re-measured by calling `search('structured', …)` directly; only the real-ranker numbers are used above. Candidate for "exhausted approaches": do not emulate the rank tuple with `sort`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Measuring the flood with a shell sort.** A `sort -t: -k1,1 -k2,2n | head -20` emulation of the rank tuple reported 20 of 20 top lines from a single file for `deep research`, which the real ranker contradicts (15 distinct files in the same top 20). The emulation dropped the match-class component that precedes the path tie-break, so it manufactured a flood that the shipped ranker does not produce for that query. Re-measured by calling `search('structured', …)` directly; only the real-ranker numbers are used above. Candidate for "exhausted approaches": do not emulate the rank tuple with `sort`.

### **Per-file cap on the trigger-index lane.** Structurally impossible to need: one row per document already. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:226-239] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Per-file cap on the trigger-index lane.** Structurally impossible to need: one row per document already. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:226-239]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Per-file cap on the trigger-index lane.** Structurally impossible to need: one row per document already. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:226-239]

### **Porting `classifyGrepLines` / `selectGrepLinesByClass` as written.** Both need a symbol entity list and an index-freshness predicate (Finding 6); adopting them would require the persistent index the topic forbids. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Porting `classifyGrepLines` / `selectGrepLinesByClass` as written.** Both need a symbol entity list and an index-freshness predicate (Finding 6); adopting them would require the persistent index the topic forbids.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Porting `classifyGrepLines` / `selectGrepLinesByClass` as written.** Both need a symbol entity list and an index-freshness predicate (Finding 6); adopting them would require the persistent index the topic forbids.

### **Porting `indexFreshness` verbatim.** Rejected on evidence: Skilled's index has no `publishedAt`, and checkout mtimes are not a build-time proxy. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Porting `indexFreshness` verbatim.** Rejected on evidence: Skilled's index has no `publishedAt`, and checkout mtimes are not a build-time proxy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Porting `indexFreshness` verbatim.** Rejected on evidence: Skilled's index has no `publishedAt`, and checkout mtimes are not a build-time proxy.

### **Running `--check` on zero-hit.** Rejected on documented cost: a full corpus walk, explicitly never per lookup. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Running `--check` on zero-hit.** Rejected on documented cost: a full corpus walk, explicitly never per lookup.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Running `--check` on zero-hit.** Rejected on documented cost: a full corpus walk, explicitly never per lookup.

### **Treating `FILL` as the boilerplate to demote.** It survives once per template example file and not across authored packets, so demoting it would buy almost nothing (Finding 4). The stock prose sentences are the real pollutant. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Treating `FILL` as the boilerplate to demote.** It survives once per template example file and not across authored packets, so demoting it would buy almost nothing (Finding 4). The stock prose sentences are the real pollutant.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `FILL` as the boilerplate to demote.** It survives once per template example file and not across authored packets, so demoting it would buy almost nothing (Finding 4). The stock prose sentences are the real pollutant.

### **Treating `truncated` as the existing hint.** It reports the result cap, not the scope boundary; the scoped run above had `truncated: false` and still hid 3 documents in other tracks. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Treating `truncated` as the existing hint.** It reports the result cap, not the scope boundary; the scoped run above had `truncated: false` and still hid 3 documents in other tracks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `truncated` as the existing hint.** It reports the result cap, not the scope boundary; the scoped run above had `truncated: false` and still hid 3 documents in other tracks.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **`git ls-files --modified --others` as the candidate source.** Rejected on measured coverage: it loses 14 of 29 changed `.md` files, all staged additions. (iteration 1)
- **Body-text grep over changed files as the fallback mechanism.** Rejected on contract: the keyed lane matches declared phrases, not prose. (iteration 1)
- **Porting `indexFreshness` verbatim.** Rejected on evidence: Skilled's index has no `publishedAt`, and checkout mtimes are not a build-time proxy. (iteration 1)
- **Running `--check` on zero-hit.** Rejected on documented cost: a full corpus walk, explicitly never per lookup. (iteration 1)
- **Adopting `perFileCap` alone.** One line per file still returns 13,113 rows corpus-wide for a single common token, so it does not bound output on its own. [INFERENCE: corpus-wide file count measured with the count recipe] (iteration 2)
- **Copying sweet-search's weighted allocation (Sainte-Laguë / `sat2`) into Skilled.** Would create a second relevance ranker beside the evidence-field/match-class tuple; the tuple already breaks the tie the allocation would be guessing at. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:202-212] (iteration 2)
- **Measuring the flood with a shell sort.** A `sort -t: -k1,1 -k2,2n | head -20` emulation of the rank tuple reported 20 of 20 top lines from a single file for `deep research`, which the real ranker contradicts (15 distinct files in the same top 20). The emulation dropped the match-class component that precedes the path tie-break, so it manufactured a flood that the shipped ranker does not produce for that query. Re-measured by calling `search('structured', …)` directly; only the real-ranker numbers are used above. Candidate for "exhausted approaches": do not emulate the rank tuple with `sort`. (iteration 2)
- **Per-file cap on the trigger-index lane.** Structurally impossible to need: one row per document already. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:226-239] (iteration 2)
- **Applying line classes to the keyed lane.** It returns documents, not lines (Finding 1). No code change there can express the lesson. (iteration 3)
- **Demoting `template-default` phrases by deleting them.** The convention explicitly refuses to delete an author's phrase, so any fix must demote at rank time, not remove at generation time. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:91] (iteration 3)
- **Porting `classifyGrepLines` / `selectGrepLinesByClass` as written.** Both need a symbol entity list and an index-freshness predicate (Finding 6); adopting them would require the persistent index the topic forbids. (iteration 3)
- **Treating `FILL` as the boilerplate to demote.** It survives once per template example file and not across authored packets, so demoting it would buy almost nothing (Finding 4). The stock prose sentences are the real pollutant. (iteration 3)
- **A literal port of `probeOutsideScope`.** It requires `ensureSparseGramIndex` and a queryable gram index; the hard constraint forbids a persistent index and `retrieval-conventions.md` names vector/BM25/stateful retrieval as a declared loss. A port would return `null` on every call here. (iteration 4)
- **Firing the hint on every scoped ripgrep query.** 0.77 s against 0.012 s is a 64x tax on the common path to help the rare one. (iteration 4)
- **Firing the hint on the keyed lane's unscoped zero.** With no scope supplied there is nothing out of scope, and the observed zero was a phrase miss (0 unscoped) rather than a scope miss. (iteration 4)
- **Treating `truncated` as the existing hint.** It reports the result cap, not the scope boundary; the scoped run above had `truncated: false` and still hid 3 documents in other tracks. (iteration 4)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Carried forward from this iteration: does the 3,142-match iteration log (`.../research/iterations-modes/iteration-038.md`) have a mirror copy that Q5's dedup would collapse, and does that change the cap arithmetic? Measured here only as a count, not as a duplicate. (iteration 2)
- Q1, Q3, Q4, Q5 remain (each owned by a sibling iteration in this fan-out). (iteration 2)
- Q4: Out-of-scope hit hint (sibling iteration). (iteration 3)
- Q5: Dedup plus final-k cut (sibling iteration). (iteration 3)
- Q1: Zero-hit fallback to git-changed files (sibling iteration). (iteration 3)
- Q2: Per-file caps with an elision line (sibling iteration). (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Phase 1 synthesis: `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/001-sweet-search-research/research/research.md`. Observed in this session: a generate-context save reported "Trigger index: STALE for spec.md" for a newly created packet.

- resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-09
- Executor: cli-devin, deepseek-v4-1-flash-max, 5 iterations in parallel (operator direction)
