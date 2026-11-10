# Deep Research Strategy - retrieval feature designs

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
Turn the five retrieval improvements rated in phase 2 (`specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/research.md`) into implementation-ready designs for system-spec-kit retrieval (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/`, its tests under `runtime/cli/tests/`, and `references/retrieval/retrieval-conventions.md`). HARD CONSTRAINT: no embeddings, no vector or BM25 fusion, no MCP, no daemon, no persistent index beyond the existing committed trigger index.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Design feature 1, the total candidate count: the exact field name and placement in the lookup-trigger-index.mjs answer object and formatAnswer output, every current caller and test that parses the answer (so nothing breaks), the section 9 exclusion-coverage row wording for specs/**/research/** in retrieval-conventions.md, and the test cases.
- [x] Q2: Design feature 2, the zero-hit fallback to git-changed spec docs: module boundary (new lib/changed-docs.mjs or inline), the git command and its parsing (git status --porcelain, renames, deletions, staged additions, non-git, missing git binary, submodules), how frontmatter trigger_phrases are read and scored with the existing helpers, the staleFallback answer field, exit-code rules, the opt-out flag, the section 4 and 5 contract amendments for determinism, performance budget, and the test matrix.
- [ ] Q3: Design feature 3, per-file flood control in the ripgrep wrapper: where in rg-wrapper.mjs and lib/rg-lane.mjs the one-line-per-file guarantee and k cut go, how totals are obtained (the count recipe or the same rg run), the exact '+N more in this file' and '+N more files with M matches' output for human and JSON formats, what happens to structuredCappedRecipe, contract text for sections 2.1 and 5, and tests.
- [x] Q4: Design feature 4, boilerplate demotion, at its minimum viable size: the Markdown line classes inside the body evidence field, how they slot into the rank tuple without breaking determinism, whether a cheaper version (a stock-sentence list, or demoting template folders) gets most of the value, and the concrete trigger (what logged query) that would justify building it.
- [x] Q5: Design feature 5, the out-of-scope hint, at its minimum viable size: the keyed-lane outOfScope field inside the existing posting loop, the ripgrep-lane --scope design, the threshold rule, and the concrete trigger (which caller or command starting to pass a scope) that would justify building it.

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Embeddings, vector or BM25 fusion, MCP servers, daemons, persistent indexes: Skilled removed these on purpose (system-spec-kit SKILL.md declared loss).
- Writing or editing any retrieval file; a build phase does that.
- Re-deciding whether to build features 1-5; phase 2 settled that.

---

## 5. STOP CONDITIONS
- Each feature has a design with files and line ranges, output change, edge cases, compatibility note and tests.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Design feature 1, the total candidate count: the exact field name and placement in the lookup-trigger-index.mjs answer object and formatAnswer output, every current caller and test that parses the answer (so nothing breaks), the section 9 exclusion-coverage row wording for specs/**/research/** in retrieval-conventions.md, and the test cases.
- Q2: Design feature 2, the zero-hit fallback to git-changed spec docs: module boundary (new lib/changed-docs.mjs or inline), the git command and its parsing (git status --porcelain, renames, deletions, staged additions, non-git, missing git binary, submodules), how frontmatter trigger_phrases are read and scored with the existing helpers, the staleFallback answer field, exit-code rules, the opt-out flag, the section 4 and 5 contract amendments for determinism, performance budget, and the test matrix.
- Q4: Design feature 4, boilerplate demotion, at its minimum viable size: the Markdown line classes inside the body evidence field, how they slot into the rank tuple without breaking determinism, whether a cheaper version (a stock-sentence list, or demoting template folders) gets most of the value, and the concrete trigger (what logged query) that would justify building it.
- Q5: Design feature 5, the out-of-scope hint, at its minimum viable size: the keyed-lane outOfScope field inside the existing posting loop, the ripgrep-lane --scope design, the threshold rule, and the concrete trigger (which caller or command starting to pass a scope) that would justify building it.

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the answer consumers before choosing a name. The field set is open everywhere, so an additive key was safe without a compatibility shim; had any consumer asserted a whole-object equality, the design would have needed a version note instead. (iteration 1)
- reading the importer graph before designing the seam made the compatibility answer concrete — the generator and the workflow import only `loadIndex`, so the fallback can live entirely behind the CLI without touching production callers. (iteration 2)
- measuring the shipped wrapper before designing. The live run turned phase 2's 12-14 of 20 into 20 of 20, and reading `formatSummary` beside `search()` showed the cap is presentation-only, which is why the JSON path floods even though the human view looks bounded. (iteration 3)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the first grep for callers used a glob exclusion that silently matched nothing, which would have understated the consumer list. Re-running with a plain pattern and a narrower path fixed it; the lesson is to verify a zero-match grep before trusting it. (iteration 1)
- nothing failed this iteration. The one cost was breadth: the first caller grep matched 1,149 files because every spec document quotes the script name, so it had to be narrowed to code globs before it was usable. (iteration 2)
- nothing failed. The one correction was conceptual — the first draft assumed the capped fetch plus count recipe was the cheap path; `rg --help` showed `--max-count` keeps the file's first line, not its best-ranked one, which invalidated that design and made same-run shaping the only correct option. (iteration 3)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`candidateDocumentCount` as the field name** — it parallels `candidatePhraseCount` but reads as a second phrase count in the same object; `totalCandidates` names the denominator the cap divided. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`candidateDocumentCount` as the field name** — it parallels `candidatePhraseCount` but reads as a second phrase count in the same object; `totalCandidates` names the denominator the cap divided.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`candidateDocumentCount` as the field name** — it parallels `candidatePhraseCount` but reads as a second phrase count in the same object; `totalCandidates` names the denominator the cap divided.

### **`git ls-files --modified --others` as the candidate source.** Measured loss of 14 of 29 changed docs, all staged additions. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:32] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`git ls-files --modified --others` as the candidate source.** Measured loss of 14 of 29 changed docs, all staged additions. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:32]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`git ls-files --modified --others` as the candidate source.** Measured loss of 14 of 29 changed docs, all staged additions. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:32]

### **`hiddenCandidates` / `remainingCandidates` (the difference)** — derivable from `totalCandidates - results.length`, and storing a derived value invites drift. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`hiddenCandidates` / `remainingCandidates` (the difference)** — derivable from `totalCandidates - results.length`, and storing a derived value invites drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`hiddenCandidates` / `remainingCandidates` (the difference)** — derivable from `totalCandidates - results.length`, and storing a derived value invites drift.

### **A `--k` flag.** The keyed lane already spells the same bound `--limit`, default 20, 0 uncapped; a second name would fork one vocabulary. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:18-23] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A `--k` flag.** The keyed lane already spells the same bound `--limit`, default 20, 0 uncapped; a second name would fork one vocabulary. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:18-23]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `--k` flag.** The keyed lane already spells the same bound `--limit`, default 20, 0 uncapped; a second name would fork one vocabulary. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:18-23]

### **A `--report-total` flag** — the number is already computed; a flag creates a mode with no consumer. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A `--report-total` flag** — the number is already computed; a flag creates a mode with no consumer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `--report-total` flag** — the number is already computed; a flag creates a mode with no consumer.

### **A second invocation of the count recipe for totals.** Exact, but it doubles the scan for numbers the uncapped structured fetch already holds. Only worth it if the fetch is capped, which the first bullet rules out. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-002.md:31] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A second invocation of the count recipe for totals.** Exact, but it doubles the scan for numbers the uncapped structured fetch already holds. Only worth it if the fetch is capped, which the first bullet rules out. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-002.md:31]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A second invocation of the count recipe for totals.** Exact, but it doubles the scan for numbers the uncapped structured fetch already holds. Only worth it if the fetch is capped, which the first bullet rules out. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-002.md:31]

### **A second keyed pass to compute the tally.** The posting loop already holds every rejected document; a second pass would re-read the index for a fact already in hand. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A second keyed pass to compute the tally.** The posting loop already holds every rejected document; a second pass would re-read the index for a fact already in hand.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A second keyed pass to compute the tally.** The posting loop already holds every rejected document; a second pass would re-read the index for a fact already in hand.

### **Always printing `N of T` in the human line** — changes every untruncated answer for no caller benefit and churns documented output; only the truncated line gains information. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Always printing `N of T` in the human line** — changes every untruncated answer for no caller benefit and churns documented output; only the truncated line gains information.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Always printing `N of T` in the human line** — changes every untruncated answer for no caller benefit and churns documented output; only the truncated line gains information.

### **Body-text grep over changed files.** The keyed lane matches declared phrases; prose belongs to the ripgrep lane. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:34] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Body-text grep over changed files.** The keyed lane matches declared phrases; prose belongs to the ripgrep lane. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:34]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Body-text grep over changed files.** The keyed lane matches declared phrases; prose belongs to the ripgrep lane. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:34]

### **Copying sweet-search's weighted allocation.** It would add a second ranker beside the evidence-field/match-class tuple, which already orders the rows the guarantee pass keeps. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/research.md:77] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Copying sweet-search's weighted allocation.** It would add a second ranker beside the evidence-field/match-class tuple, which already orders the rows the guarantee pass keeps. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/research.md:77]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Copying sweet-search's weighted allocation.** It would add a second ranker beside the evidence-field/match-class tuple, which already orders the rows the guarantee pass keeps. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/research.md:77]

### **Demoting template folders for the free-text flood.** 3 of 786 paths, 0.4% of the result set; the flood is 783 real packets that copied the sentence (Finding 6). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Demoting template folders for the free-text flood.** 3 of 786 paths, 0.4% of the result set; the flood is 783 real packets that copied the sentence (Finding 6).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Demoting template folders for the free-text flood.** 3 of 786 paths, 0.4% of the result set; the flood is 783 real packets that copied the sentence (Finding 6).

### **Enabling the fallback for an explicit `--index`.** Would make temp-corpus fixtures depend on the developer's worktree. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Enabling the fallback for an explicit `--index`.** Would make temp-corpus fixtures depend on the developer's worktree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Enabling the fallback for an explicit `--index`.** Would make temp-corpus fixtures depend on the developer's worktree.

### **Firing on the keyed lane's unscoped zero.** With no scope there is nothing out of scope; the observed zero was a phrase miss. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:52] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Firing on the keyed lane's unscoped zero.** With no scope there is nothing out of scope; the observed zero was a phrase miss. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:52]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Firing on the keyed lane's unscoped zero.** With no scope there is nothing out of scope; the observed zero was a phrase miss. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:52]

### **Firing the hint on every scoped ripgrep query.** 0.77 s against 0.012 s is a 64x tax on the common path. The threshold confines it to the low-hit path. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:22] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Firing the hint on every scoped ripgrep query.** 0.77 s against 0.012 s is a 64x tax on the common path. The threshold confines it to the low-hit path. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:22]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Firing the hint on every scoped ripgrep query.** 0.77 s against 0.012 s is a 64x tax on the common path. The threshold confines it to the low-hit path. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:22]

### **Human-only reporting** — Gate 1 reads `--json`, so a human-only field would never reach the caller that needs it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Human-only reporting** — Gate 1 reads `--json`, so a human-only field would never reach the caller that needs it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Human-only reporting** — Gate 1 reads `--json`, so a human-only field would never reach the caller that needs it.

### **Making `lookup()` async or adding fallback logic inside it.** Would break the exported synchronous contract every test asserts. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Making `lookup()` async or adding fallback logic inside it.** Would break the exported synchronous contract every test asserts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Making `lookup()` async or adding fallback logic inside it.** Would break the exported synchronous contract every test asserts.

### **Making a line class shrink the stock-sentence result set.** All 783 rows are the same blockquote; no class computed from a single line can separate them. Volume belongs to feature 3. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Making a line class shrink the stock-sentence result set.** All 783 rows are the same blockquote; no class computed from a single line can separate them. Volume belongs to feature 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Making a line class shrink the stock-sentence result set.** All 783 rows are the same blockquote; no class computed from a single line can separate them. Volume belongs to feature 3.

### **mtime comparison or a pending-reindex queue.** The index has no publish timestamp, and checkout mtimes are not build times. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/research.md:149] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **mtime comparison or a pending-reindex queue.** The index has no publish timestamp, and checkout mtimes are not build times. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/research.md:149]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **mtime comparison or a pending-reindex queue.** The index has no publish timestamp, and checkout mtimes are not build times. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/research.md:149]

### **One line per section spread.** That is feature 3's per-file cap, and folding it in would double this change's size (Finding 2). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **One line per section spread.** That is feature 3's per-file cap, and folding it in would double this change's size (Finding 2).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **One line per section spread.** That is feature 3's per-file cap, and folding it in would double this change's size (Finding 2).

### **Porting `probeOutsideScope` literally.** It requires a sparse gram index; the hard constraint forbids a persistent index, so the port would return `null` on every call. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:18] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Porting `probeOutsideScope` literally.** It requires a sparse gram index; the hard constraint forbids a persistent index, so the port would return `null` on every call. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:18]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Porting `probeOutsideScope` literally.** It requires a sparse gram index; the hard constraint forbids a persistent index, so the port would return `null` on every call. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:18]

### **Renaming `truncated` to a count** — breaks the boolean assertion at `trigger-index.vitest.ts:935` and every caller comparing it; additive is cheaper and reversible. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Renaming `truncated` to a count** — breaks the boolean assertion at `trigger-index.vitest.ts:935` and every caller comparing it; additive is cheaper and reversible.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Renaming `truncated` to a count** — breaks the boolean assertion at `trigger-index.vitest.ts:935` and every caller comparing it; additive is cheaper and reversible.

### **Running `--check` on zero-hit.** It is a full corpus walk and by contract never runs per lookup. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md:84] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Running `--check` on zero-hit.** It is a full corpus walk and by contract never runs per lookup. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md:84]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Running `--check` on zero-hit.** It is a full corpus walk and by contract never runs per lookup. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md:84]

### **Setext heading detection.** It needs the previous line, which the match record does not carry. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Setext heading detection.** It needs the previous line, which the match record does not carry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Setext heading detection.** It needs the previous line, which the match record does not carry.

### **Stock-sentence deny list.** The measured flood line is a blockquote, so the generic `guidance` class demotes it; a curated list adds drift and covers only sentences someone remembered (Finding 5). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Stock-sentence deny list.** The measured flood line is a blockquote, so the generic `guidance` class demotes it; a curated list adds drift and covers only sentences someone remembered (Finding 5).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Stock-sentence deny list.** The measured flood line is a blockquote, so the generic `guidance` class demotes it; a curated list adds drift and covers only sentences someone remembered (Finding 5).

### **Treating `truncated` as the hint.** It reports the result cap, not the scope boundary; a scoped run can be `truncated: false` and still hide documents in other tracks. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Treating `truncated` as the hint.** It reports the result cap, not the scope boundary; a scoped run can be `truncated: false` and still hide documents in other tracks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `truncated` as the hint.** It reports the result cap, not the scope boundary; a scoped run can be `truncated: false` and still hide documents in other tracks.

### **Treating template-folder demotion as the whole of feature 4.** The measured template inversion is on the keyed lane, and fixing it needs a schema or policy decision that also affects legitimate template lookups (Finding 6). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Treating template-folder demotion as the whole of feature 4.** The measured template inversion is on the keyed lane, and fixing it needs a schema or policy decision that also affects legitimate template lookups (Finding 6).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating template-folder demotion as the whole of feature 4.** The measured template inversion is on the keyed lane, and fixing it needs a schema or policy decision that also affects legitimate template lookups (Finding 6).

### **Using `matchClass` to prefer headings on fixed-string queries.** 786 of 787 stock-sentence rows are `phrase-containment`, confirming the phase 2 finding that the match class is degenerate for fixed-string hits; it cannot carry a shape preference. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Using `matchClass` to prefer headings on fixed-string queries.** 786 of 787 stock-sentence rows are `phrase-containment`, confirming the phase 2 finding that the match class is degenerate for fixed-string hits; it cannot carry a shape preference.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Using `matchClass` to prefer headings on fixed-string queries.** 786 of 787 stock-sentence rows are `phrase-containment`, confirming the phase 2 finding that the match class is degenerate for fixed-string hits; it cannot carry a shape preference.

### **Wiring `structuredCappedRecipe` (`--max-count 1`) into the wrapper.** It keeps each file's earliest matching line rather than its best-ranked one, and it removes the per-file count the elision line needs. [SOURCE: local `rg --help` output for `--max-count`] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:408-411] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Wiring `structuredCappedRecipe` (`--max-count 1`) into the wrapper.** It keeps each file's earliest matching line rather than its best-ranked one, and it removes the per-file count the elision line needs. [SOURCE: local `rg --help` output for `--max-count`] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:408-411]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Wiring `structuredCappedRecipe` (`--max-count 1`) into the wrapper.** It keeps each file's earliest matching line rather than its best-ranked one, and it removes the per-file count the elision line needs. [SOURCE: local `rg --help` output for `--max-count`] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:408-411]

### None this iteration. Every planned read and the bounded measurement succeeded. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: None this iteration. Every planned read and the bounded measurement succeeded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration. Every planned read and the bounded measurement succeeded.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **`candidateDocumentCount` as the field name** — it parallels `candidatePhraseCount` but reads as a second phrase count in the same object; `totalCandidates` names the denominator the cap divided. (iteration 1)
- **`hiddenCandidates` / `remainingCandidates` (the difference)** — derivable from `totalCandidates - results.length`, and storing a derived value invites drift. (iteration 1)
- **A `--report-total` flag** — the number is already computed; a flag creates a mode with no consumer. (iteration 1)
- **Always printing `N of T` in the human line** — changes every untruncated answer for no caller benefit and churns documented output; only the truncated line gains information. (iteration 1)
- **Human-only reporting** — Gate 1 reads `--json`, so a human-only field would never reach the caller that needs it. (iteration 1)
- **Renaming `truncated` to a count** — breaks the boolean assertion at `trigger-index.vitest.ts:935` and every caller comparing it; additive is cheaper and reversible. (iteration 1)
- **`git ls-files --modified --others` as the candidate source.** Measured loss of 14 of 29 changed docs, all staged additions. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:32] (iteration 2)
- **Body-text grep over changed files.** The keyed lane matches declared phrases; prose belongs to the ripgrep lane. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-001.md:34] (iteration 2)
- **Enabling the fallback for an explicit `--index`.** Would make temp-corpus fixtures depend on the developer's worktree. (iteration 2)
- **Making `lookup()` async or adding fallback logic inside it.** Would break the exported synchronous contract every test asserts. (iteration 2)
- **mtime comparison or a pending-reindex queue.** The index has no publish timestamp, and checkout mtimes are not build times. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/research.md:149] (iteration 2)
- **Running `--check` on zero-hit.** It is a full corpus walk and by contract never runs per lookup. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md:84] (iteration 2)
- **A `--k` flag.** The keyed lane already spells the same bound `--limit`, default 20, 0 uncapped; a second name would fork one vocabulary. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:18-23] (iteration 3)
- **A second invocation of the count recipe for totals.** Exact, but it doubles the scan for numbers the uncapped structured fetch already holds. Only worth it if the fetch is capped, which the first bullet rules out. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-002.md:31] (iteration 3)
- **Copying sweet-search's weighted allocation.** It would add a second ranker beside the evidence-field/match-class tuple, which already orders the rows the guarantee pass keeps. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/research.md:77] (iteration 3)
- **Wiring `structuredCappedRecipe` (`--max-count 1`) into the wrapper.** It keeps each file's earliest matching line rather than its best-ranked one, and it removes the per-file count the elision line needs. [SOURCE: local `rg --help` output for `--max-count`] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs:408-411] (iteration 3)
- None this iteration. Every planned read and the bounded measurement succeeded. (iteration 3)
- **Demoting template folders for the free-text flood.** 3 of 786 paths, 0.4% of the result set; the flood is 783 real packets that copied the sentence (Finding 6). (iteration 4)
- **Making a line class shrink the stock-sentence result set.** All 783 rows are the same blockquote; no class computed from a single line can separate them. Volume belongs to feature 3. (iteration 4)
- **One line per section spread.** That is feature 3's per-file cap, and folding it in would double this change's size (Finding 2). (iteration 4)
- **Setext heading detection.** It needs the previous line, which the match record does not carry. (iteration 4)
- **Stock-sentence deny list.** The measured flood line is a blockquote, so the generic `guidance` class demotes it; a curated list adds drift and covers only sentences someone remembered (Finding 5). (iteration 4)
- **Treating template-folder demotion as the whole of feature 4.** The measured template inversion is on the keyed lane, and fixing it needs a schema or policy decision that also affects legitimate template lookups (Finding 6). (iteration 4)
- **Using `matchClass` to prefer headings on fixed-string queries.** 786 of 787 stock-sentence rows are `phrase-containment`, confirming the phase 2 finding that the match class is degenerate for fixed-string hits; it cannot carry a shape preference. (iteration 4)
- **A second keyed pass to compute the tally.** The posting loop already holds every rejected document; a second pass would re-read the index for a fact already in hand. (iteration 5)
- **Firing on the keyed lane's unscoped zero.** With no scope there is nothing out of scope; the observed zero was a phrase miss. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:52] (iteration 5)
- **Firing the hint on every scoped ripgrep query.** 0.77 s against 0.012 s is a 64x tax on the common path. The threshold confines it to the low-hit path. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:22] (iteration 5)
- **Porting `probeOutsideScope` literally.** It requires a sparse gram index; the hard constraint forbids a persistent index, so the port would return `null` on every call. [SOURCE: specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/iterations/iteration-004.md:18] (iteration 5)
- **Treating `truncated` as the hint.** It reports the result cap, not the scope boundary; a scoped run can be `truncated: false` and still hide documents in other tracks. (iteration 5)

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
- Q3: per-file flood control in the ripgrep wrapper. (iteration 1)
- Q4: boilerplate demotion. (iteration 1)
- Q2: zero-hit fallback to git-changed spec docs. (iteration 1)
- Q5: out-of-scope hint. (iteration 1)
- Q1 (total candidate count), Q3 (per-file flood control), Q4 (boilerplate demotion), Q5 (out-of-scope hint). Each is assigned to a sibling iteration in this fan-out; none was investigated here. (iteration 2)
- Carried forward from this iteration: does any command render `rg-wrapper.mjs` JSON directly rather than through `search-presentation.txt`? The repository grep found none, but a downstream consumer outside this checkout cannot be ruled out; `schemaVersion` 2 is the signal for it. (iteration 3)
- Q1, Q2, Q4, Q5 remain, each owned by a sibling iteration in this fan-out. (iteration 3)
- Q1, Q2, Q3, Q5: covered by the four sibling iterations. (iteration 4)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q1, Q2, Q3, Q5: covered by the four sibling iterations.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Phase 2 synthesis: `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/002-retrieval-lessons-research/research/research.md` and its iterations. Phase 1 synthesis: `specs/hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/001-sweet-search-research/research/research.md`.

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
