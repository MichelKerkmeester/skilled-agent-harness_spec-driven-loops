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
Generated from the reducer registry. Add external or late questions through `{spec_folder}/research/inbox.jsonl`; direct edits are imported as compatibility input and may be replaced on the next reduce step.

- [ ] Which advisor runtime files, functions, tests, launcher lines and database schema objects (tables, migrations, columns) exist only for Ollama, embeddings or the semantic_shadow lane, with file:line?
- [ ] Which doctor routes, YAML workflows, presentation files, scripts and their tests reference the embedder (install, setup, update apply, overlay apply and repin, symlink link, skill-advisor embedder), and what must each say or do after removal?
- [ ] Which docs, changelogs, feature catalogs, manual testing playbooks, READMEs, env references, graph-metadata trigger phrases and generated or compiled routing artifacts carry Ollama or semantic-lane remnants?
- [ ] Who else consumes system-spec-kit/shared/embeddings (auto-select cascade, hf-local model server, spec-kit memory, sk-doc validators), and can the package and its tests be deleted entirely or only in part?
- [ ] What removal order keeps every gate green, how are repo users machines cleaned (pulled model, vector tables, background server, env vars) without a backup, and what residue check proves nothing is left?
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
[None yet -- populated as iterations answer questions]
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]

### [Category Name] -- BLOCKED (iteration N, N attempts)
- What was tried: [specific approaches attempted]
- Why blocked: [root cause of exhaustion]
- Do NOT retry: [explicit prohibition]

### [Category Name] -- PRODUCTIVE (iteration N)
- What worked: [successful approaches in this category]
- Prefer for: [related questions where this category may help]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[Approaches that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])
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
[Self-owned open questions from iteration write-back -- populated after iteration 1 completes]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[Recommended focus area for the next iteration -- updated at end of each iteration]
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
- Current generation: 1
- Started: 2026-11-20T18:48:42Z
- resource-map.md not present; skipping coverage gate
