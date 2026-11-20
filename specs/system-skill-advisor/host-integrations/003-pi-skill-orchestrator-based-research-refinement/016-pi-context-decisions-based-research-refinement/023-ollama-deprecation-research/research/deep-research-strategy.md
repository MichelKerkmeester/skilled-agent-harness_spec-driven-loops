---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.3.0
---

# Deep Research Strategy - Session Tracking Template

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
- `origin`: one of `angle-bank`, `analyst-strategy`, `frontier`, `operator`, or `legacy-import`
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
How to fully deprecate and remove the skill advisor Ollama and embedding semantic lane with zero remnants: code, tests, docs, doctor routes, env vars, launcher, database tables, the shared embeddings package, changelog and playbook references, and leftovers on repo users machines (pulled model, vectors, background server). Delete, never back up. Produce a complete file:line inventory, a safe removal order with gates, a user-machine cleanup design and a residue check that proves nothing is left.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which advisor runtime files, functions, tests, launcher lines and database schema objects (tables, migrations, columns) exist only for Ollama, embeddings or the semantic_shadow lane, with file:line?
- [x] Which doctor routes, YAML workflows, presentation files, scripts and their tests reference the embedder (install, setup, update apply, overlay apply and repin, symlink link, skill-advisor embedder), and what must each say or do after removal?
- [x] Which docs, changelogs, feature catalogs, manual testing playbooks, READMEs, env references, graph-metadata trigger phrases and generated or compiled routing artifacts carry Ollama or semantic-lane remnants?
- [x] Who else consumes system-spec-kit/shared/embeddings (auto-select cascade, hf-local model server, spec-kit memory, sk-doc validators), and can the package and its tests be deleted entirely or only in part?
- [x] What removal order keeps every gate green, how are repo users machines cleaned (pulled model, vector tables, background server, env vars) without a backup, and what residue check proves nothing is left?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Whether to deprecate: the operator decided deletion on 2026-11-20 after a Fable 5.2 recommendation.
- Re-running the lane ablation or testing other embedding roles.
- Making any change: this run only researches and writes inside research/.

---

## 5. STOP CONDITIONS
- All five key questions answered with file:line evidence.
- The stop policy is max-iterations: the run uses all five iterations.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which advisor runtime files, functions, tests, launcher lines and database schema objects (tables, migrations, columns) exist only for Ollama, embeddings or the semantic_shadow lane, with file:line?
- Which doctor routes, YAML workflows, presentation files, scripts and their tests reference the embedder (install, setup, update apply, overlay apply and repin, symlink link, skill-advisor embedder), and what must each say or do after removal?
- Which docs, changelogs, feature catalogs, manual testing playbooks, READMEs, env references, graph-metadata trigger phrases and generated or compiled routing artifacts carry Ollama or semantic-lane remnants?
- Who else consumes system-spec-kit/shared/embeddings (auto-select cascade, hf-local model server, spec-kit memory, sk-doc validators), and can the package and its tests be deleted entirely or only in part?
- What removal order keeps every gate green, how are repo users machines cleaned (pulled model, vector tables, background server, env vars) without a backup, and what residue check proves nothing is left?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- one wide pattern counted per file, then line listings for the dense files. The counts separated dedicated files from mixed ones before any file was opened, which kept the read budget for the files that decide the design (lane registry, fusion, schema). (iteration 1)
- grepping import-shaped patterns separately from the bare package path. The path grep returned 55 files, mostly docs and fixtures; the import grep cut that to 20 code lines and showed in one pass that no spec-kit production file is among them. (iteration 2)
- reading the full text of the long single-line workflow steps instead of their 300-character grep previews. The steps are one YAML string each, so the preview cut off the part that says whether the line is informational, which decides between "delete" and "reword". (iteration 3)
- running a second vocabulary pass and diffing its file list against the first. The lane is described in prose with words ("five-lane", "vector refresh", "semantic lane") that the identifier-shaped pattern never matches, and the diff surfaced the advisor's own identity files in one step. (iteration 4)
- reading the gates before drafting the order. The pre-commit hook checks leaf manifests and mirrors on every commit, and CI runs the sk-doc tests on every change, so two regenerations iteration 4 had placed at the end have to happen inside the commits that cause them. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- classifying tests from headers and match density. It is fast but leaves three files undecided, because a file can import lane hooks and still test surviving behavior. (iteration 1)
- the first importer grep was recursive rather than limited to tracked files, so it mixed in `.skilled/output/` files whose tracking status is now unknown. (iteration 2)
- the first count used a loose pattern with "coverage" and "embedding". It ranked unrelated files (deep-loop, agents-md) above real ones and cost a second listing with a stricter pattern. (iteration 3)
- the first inventory command combined `-l` with `-c`, so it returned file names without counts and the bucket table printed zeros. It cost one extra call to rebuild the counts with line numbers. (iteration 4)
- probing compiled output at `dist/lib/`. The build nests under `dist/runtime/`, a path `INSTALL-GUIDE.md` 105 already showed, so the first result was a false absence and cost one call. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `release-update.cjs` has one match on the loose pattern (semantic, vector, ollama or embed). The line was not read. It is most likely the word "embed", but that is a guess until the line is read. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `release-update.cjs` has one match on the loose pattern (semantic, vector, ollama or embed). The line was not read. It is most likely the word "embed", but that is a guess until the line is read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `release-update.cjs` has one match on the loose pattern (semantic, vector, ollama or embed). The line was not read. It is most likely the word "embed", but that is a guess until the line is read.

### `sk-design` as a consumer: it has its own vector store and does not import the package. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `sk-design` as a consumer: it has its own vector store and does not import the package.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `sk-design` as a consumer: it has its own vector store and does not import the package.

### A build-tool clean for the shared package's stale output: it works from sources that still exist, and the package has no clean script. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A build-tool clean for the shared package's stale output: it works from sources that still exist, and the package has no clean script.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A build-tool clean for the shared package's stale output: it works from sources that still exist, and the package has no clean script.

### Directory-prefix allowlist rows. Counting sk-design and sk-code as whole folders gave 22 candidates and would hide a real remnant placed in those folders later. Rows are exact paths. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Directory-prefix allowlist rows. Counting sk-design and sk-code as whole folders gave 22 candidates and would hide a real remnant placed in those folders later. Rows are exact paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Directory-prefix allowlist rows. Counting sk-design and sk-code as whole folders gave 22 candidates and would hide a real remnant placed in those folders later. Rows are exact paths.

### Grepping the raw `trigger-index.json` as a residue signal: 981 of its 989 matching paths are under `specs/`, so the file matches for as long as historical packets exist. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Grepping the raw `trigger-index.json` as a residue signal: 981 of its 989 matching paths are under `specs/`, so the file matches for as long as historical packets exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Grepping the raw `trigger-index.json` as a residue signal: 981 of its 989 matching paths are under `specs/`, so the file matches for as long as historical packets exist.

### Hand-editing `projection.ts`, `command-attach.ts`, `skill_advisor.py` and `command-bridges.generated.json` for the embedder bridge: `derive-command-bridges.cjs` regenerates them from `_routes.yaml`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Hand-editing `projection.ts`, `command-attach.ts`, `skill_advisor.py` and `command-bridges.generated.json` for the embedder bridge: `derive-command-bridges.cjs` regenerates them from `_routes.yaml`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hand-editing `projection.ts`, `command-attach.ts`, `skill_advisor.py` and `command-bridges.generated.json` for the embedder bridge: `derive-command-bridges.cjs` regenerates them from `_routes.yaml`.

### Hand-editing the runtime mirrors: the `.claude`, `.cursor` and `.opencode` doctor entries are symlinks into `.skilled`, and the `.codex`, `.pi` and `.vibe` prompt files carry no lane text. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Hand-editing the runtime mirrors: the `.claude`, `.cursor` and `.opencode` doctor entries are symlinks into `.skilled`, and the `.codex`, `.pi` and `.vibe` prompt files carry no lane text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hand-editing the runtime mirrors: the `.claude`, `.cursor` and `.opencode` doctor entries are symlinks into `.skilled`, and the `.codex`, `.pi` and `.vibe` prompt files carry no lane text.

### Keeping part of the package for the cloud providers (OpenAI, Voyage): they have no caller outside the factory, and the factory has no caller outside the lane. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Keeping part of the package for the cloud providers (OpenAI, Voyage): they have no caller outside the factory, and the factory has no caller outside the lane.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Keeping part of the package for the cloud providers (OpenAI, Voyage): they have no caller outside the factory, and the factory has no caller outside the lane.

### Looking for a contract test that pins the informational vector coverage lines: the update, overlay, symlink and setup contract tests assert none of them. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a contract test that pins the informational vector coverage lines: the update, overlay, symlink and setup contract tests assert none of them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a contract test that pins the informational vector coverage lines: the update, overlay, symlink and setup contract tests assert none of them.

### Looking for other skills' `graph-metadata.json` trigger phrases: only the advisor's own file matches. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for other skills' `graph-metadata.json` trigger phrases: only the advisor's own file matches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for other skills' `graph-metadata.json` trigger phrases: only the advisor's own file matches.

### Persisting a "keep the model" answer: it writes new lane state onto the user's machine. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Persisting a "keep the model" answer: it writes new lane state onto the user's machine.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Persisting a "keep the model" answer: it writes new lane state onto the user's machine.

### Reading `.env` with a shell command: a hook refuses it. The sanctioned route returns key names only. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Reading `.env` with a shell command: a hook refuses it. The sanctioned route returns key names only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `.env` with a shell command: a hook refuses it. The sanctioned route returns key names only.

### Reading `dist/` as an inventory source: it is untracked build output, so it tells the residue check where stale files live but is not a file to edit. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading `dist/` as an inventory source: it is untracked build output, so it tells the residue check where stale files live but is not a file to edit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `dist/` as an inventory source: it is untracked build output, so it tells the residue check where stale files live but is not a file to edit.

### Routing the database cleanup through `/doctor:skill-advisor rebuild`: it backs the old database up and keeps the copy, which carries the vectors forward. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Routing the database cleanup through `/doctor:skill-advisor rebuild`: it backs the old database up and keeps the copy, which carries the vectors forward.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Routing the database cleanup through `/doctor:skill-advisor rebuild`: it backs the old database up and keeps the copy, which carries the vectors forward.

### Runtime mirror folders as a separate doc surface: the tracked-file sweep found no match outside `.skilled/`, `.github/`, `README.md`, `INSTALL-SKILLED.md` and `.env.example`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Runtime mirror folders as a separate doc surface: the tracked-file sweep found no match outside `.skilled/`, `.github/`, `README.md`, `INSTALL-SKILLED.md` and `.env.example`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Runtime mirror folders as a separate doc surface: the tracked-file sweep found no match outside `.skilled/`, `.github/`, `README.md`, `INSTALL-SKILLED.md` and `.env.example`.

### Spec-kit memory as a surviving consumer: the memory MCP surface is retired and no spec-kit runtime source imports the package. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Spec-kit memory as a surviving consumer: the memory MCP surface is retired and no spec-kit runtime source imports the package.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Spec-kit memory as a surviving consumer: the memory MCP surface is retired and no spec-kit runtime source imports the package.

### The files in F14 are not remnants and should not be revisited as inventory: cli-codex `--oss`, mcp-figma, sk-design's vector store, the deep-loop `semantic_shadow_only` namesake, sk-create-benchmark case studies, cite-drift redirects, sk-code `sqlite-vec` examples. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The files in F14 are not remnants and should not be revisited as inventory: cli-codex `--oss`, mcp-figma, sk-design's vector store, the deep-loop `semantic_shadow_only` namesake, sk-create-benchmark case studies, cite-drift redirects, sk-code `sqlite-vec` examples.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The files in F14 are not remnants and should not be revisited as inventory: cli-codex `--oss`, mcp-figma, sk-design's vector store, the deep-loop `semantic_shadow_only` namesake, sk-create-benchmark case studies, cite-drift redirects, sk-code `sqlite-vec` examples.

### The wide first pattern included "coverage", "embedding" and "vector", which matched 53 doctor files. Most are unrelated: test coverage, the deep-loop coverage graph, `/doctor:agents-md embed`. Files with only those matches are not remnants: `doctor-deep-loop.yaml`, `doctor-skill-advisor-tune.yaml`, `sk-skill-check.cjs` (zero matches on the strict pattern), `doctor-speckit-retrieval.yaml` 48 (describes the retired continuity database, not the advisor lane). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The wide first pattern included "coverage", "embedding" and "vector", which matched 53 doctor files. Most are unrelated: test coverage, the deep-loop coverage graph, `/doctor:agents-md embed`. Files with only those matches are not remnants: `doctor-deep-loop.yaml`, `doctor-skill-advisor-tune.yaml`, `sk-skill-check.cjs` (zero matches on the strict pattern), `doctor-speckit-retrieval.yaml` 48 (describes the retired continuity database, not the advisor lane).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The wide first pattern included "coverage", "embedding" and "vector", which matched 53 doctor files. Most are unrelated: test coverage, the deep-loop coverage graph, `/doctor:agents-md embed`. Files with only those matches are not remnants: `doctor-deep-loop.yaml`, `doctor-skill-advisor-tune.yaml`, `sk-skill-check.cjs` (zero matches on the strict pattern), `doctor-speckit-retrieval.yaml` 48 (describes the retired continuity database, not the advisor lane).

### Treating every "embedding" grep hit as a remnant: `routing-parity-deep-skills.vitest.ts` 55 and 71 and `skill_advisor.py` 1793 are prompt or keyword text. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating every "embedding" grep hit as a remnant: `routing-parity-deep-skills.vitest.ts` 55 and 71 and `skill_advisor.py` 1793 are prompt or keyword text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every "embedding" grep hit as a remnant: `routing-parity-deep-skills.vitest.ts` 55 and 71 and `skill_advisor.py` 1793 are prompt or keyword text.

### Treating the strict pattern as sufficient: 66 files, including the advisor's `SKILL.md`, `ROUTER.md` and `graph-metadata.json`, match only the second vocabulary. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the strict pattern as sufficient: 66 files, including the advisor's `SKILL.md`, `ROUTER.md` and `graph-metadata.json`, match only the second vocabulary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the strict pattern as sufficient: 66 files, including the advisor's `SKILL.md`, `ROUTER.md` and `graph-metadata.json`, match only the second vocabulary.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Reading `dist/` as an inventory source: it is untracked build output, so it tells the residue check where stale files live but is not a file to edit. (iteration 1)
- Treating every "embedding" grep hit as a remnant: `routing-parity-deep-skills.vitest.ts` 55 and 71 and `skill_advisor.py` 1793 are prompt or keyword text. (iteration 1)
- `sk-design` as a consumer: it has its own vector store and does not import the package. (iteration 2)
- Keeping part of the package for the cloud providers (OpenAI, Voyage): they have no caller outside the factory, and the factory has no caller outside the lane. (iteration 2)
- Spec-kit memory as a surviving consumer: the memory MCP surface is retired and no spec-kit runtime source imports the package. (iteration 2)
- `release-update.cjs` has one match on the loose pattern (semantic, vector, ollama or embed). The line was not read. It is most likely the word "embed", but that is a guess until the line is read. (iteration 3)
- Hand-editing `projection.ts`, `command-attach.ts`, `skill_advisor.py` and `command-bridges.generated.json` for the embedder bridge: `derive-command-bridges.cjs` regenerates them from `_routes.yaml`. (iteration 3)
- Hand-editing the runtime mirrors: the `.claude`, `.cursor` and `.opencode` doctor entries are symlinks into `.skilled`, and the `.codex`, `.pi` and `.vibe` prompt files carry no lane text. (iteration 3)
- Looking for a contract test that pins the informational vector coverage lines: the update, overlay, symlink and setup contract tests assert none of them. (iteration 3)
- The wide first pattern included "coverage", "embedding" and "vector", which matched 53 doctor files. Most are unrelated: test coverage, the deep-loop coverage graph, `/doctor:agents-md embed`. Files with only those matches are not remnants: `doctor-deep-loop.yaml`, `doctor-skill-advisor-tune.yaml`, `sk-skill-check.cjs` (zero matches on the strict pattern), `doctor-speckit-retrieval.yaml` 48 (describes the retired continuity database, not the advisor lane). (iteration 3)
- Grepping the raw `trigger-index.json` as a residue signal: 981 of its 989 matching paths are under `specs/`, so the file matches for as long as historical packets exist. (iteration 4)
- Looking for other skills' `graph-metadata.json` trigger phrases: only the advisor's own file matches. (iteration 4)
- Runtime mirror folders as a separate doc surface: the tracked-file sweep found no match outside `.skilled/`, `.github/`, `README.md`, `INSTALL-SKILLED.md` and `.env.example`. (iteration 4)
- The files in F14 are not remnants and should not be revisited as inventory: cli-codex `--oss`, mcp-figma, sk-design's vector store, the deep-loop `semantic_shadow_only` namesake, sk-create-benchmark case studies, cite-drift redirects, sk-code `sqlite-vec` examples. (iteration 4)
- Treating the strict pattern as sufficient: 66 files, including the advisor's `SKILL.md`, `ROUTER.md` and `graph-metadata.json`, match only the second vocabulary. (iteration 4)
- A build-tool clean for the shared package's stale output: it works from sources that still exist, and the package has no clean script. (iteration 5)
- Directory-prefix allowlist rows. Counting sk-design and sk-code as whole folders gave 22 candidates and would hide a real remnant placed in those folders later. Rows are exact paths. (iteration 5)
- Persisting a "keep the model" answer: it writes new lane state onto the user's machine. (iteration 5)
- Reading `.env` with a shell command: a hook refuses it. The sanctioned route returns key names only. (iteration 5)
- Routing the database cleanup through `/doctor:skill-advisor rebuild`: it backs the old database up and keeps the copy, which carries the vectors forward. (iteration 5)

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
- Who else consumes system-spec-kit/shared/embeddings, and can the package and its tests be deleted entirely or only in part? (iteration 1)
- Should the shadow weight channel be renormalized after losing 0.05? (iteration 1)
- Is `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` in scope for this removal, given it has no reader? (iteration 1)
- Which doctor routes, YAML workflows, presentation files, scripts and their tests reference the embedder, and what must each say or do after removal? (iteration 1)
- Does the command "meaning" path go with the lane, and which baselines record it? (iteration 1)
- Is the HF model server (launcher supervision, `hf-model-server.cjs`, `model-server-supervision.cjs`, about 14 spec-kit test files) still used by anything once the advisor lane is gone? (iteration 1)
- What removal order keeps every gate green, how are repo users machines cleaned without a backup, and what residue check proves nothing is left? (iteration 1)
- Which generator owns each of the generated files in F10? (iteration 2)
- Do `shared/chunking.ts` and `shared/utils/retry.ts` have a consumer outside the package? (iteration 2)
- Do `MEMORY_DB_PATH`, `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR` have a reader outside the package? (iteration 2)
- Does the cleanup remove a pulled model it cannot prove it pulled, silently or after asking? (iteration 3)
- Does the residue check exclude `specs/` and the trigger index derived from it, or are historical packets rewritten? (iteration 3)
- Does `SPEC_KIT_DB_DIR` (and its alias) have a reader outside the package? (iteration 3)
- Is `scoring-compatibility.json` an input or an output of `derive-command-bridges.cjs`? (iteration 3)
- Does the orphan sweeper keep its `ollama-preserve` guard at 491 (F10)? (iteration 4)
- Are the three files named "five-lane" renamed (F5)? (iteration 4)
- Does any routing corpus row expect the embedder command (F3)? (iteration 5)
- Does `/doctor:env` have a remove mode (F7)? (iteration 5)
- Does `generate-leaf-manifest.cjs` also write `leaf-aliases.json` (F2)? (iteration 5)
- Does a fresh empty database get rescanned on its own at daemon start, and what do the three `skill_graph_metadata` rows hold (F4)? (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior work in this epic: phases 017 (analysis, lane cost a correct answer: 149 of 193 vs 150), 018 (lane weight set to 0, daemon liveness), 019 (background vector refresh, coverage gates, real ablation 156 vs 161 of 196, weight kept 0), 020 to 022 (review fixes). A Fable 5.2 read on 2026-11-20 recommended deprecation and named a starting inventory:
- Weight 0 at runtime/lib/scorer/lane-registry.ts:13; the guard in runtime/lib/scorer/lanes/semantic-shadow.ts:169-173 nulls the prompt vector.
- Background refresh calls at runtime/advisor-server.ts:445 and runtime/lib/daemon/watcher.ts:496.
- Flag-gated exact semantic rerank in runtime/lib/scorer/fusion.ts (SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK, line 77).
- Doctor: .skilled/commands/doctor/_routes.yaml:233 embedder route, assets/doctor-skill-advisor-embedder.yaml, doctor-setup.yaml:60 embedder leg, install step 5 in doctor-install-presentation.txt, doctor-update-apply.yaml:212 coverage line, overlay and symlink coverage lines.
- Docs: system-skill-advisor/INSTALL-GUIDE.md section 12, INSTALL-SKILLED.md:86-98, feature-catalog background-vector-refresh.md, .env.example, ENV-REFERENCE.
- Launcher allowlist forwards OLLAMA_BASE_URL, OLLAMA_REQUEST_TIMEOUT_MS, SYSTEM_SKILL_ADVISOR_EMBED_REFRESH.
- Database tables vec_768, vec_cmd_768, vec_metadata in the gitignored runtime/database/skill-graph.sqlite.
- system-spec-kit/shared/embeddings is imported by an sk-doc validator and spec-kit suites; its fate needs tracing.
- 162 files outside specs/ mention ollama, semantic_shadow, semanticShadow or nomic-embed (84 in system-skill-advisor, 41 in system-spec-kit, 13 in doctor commands).
The embedder doctor route records no durable marker of the model it pulled.

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
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue` through `--extend=N` and `--extend-minutes=M` (live)
- Deferred lifecycle branch: `fork` (not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 2
- Started: 2026-11-20T18:51:25Z
- resource-map.md not present; skipping coverage gate
