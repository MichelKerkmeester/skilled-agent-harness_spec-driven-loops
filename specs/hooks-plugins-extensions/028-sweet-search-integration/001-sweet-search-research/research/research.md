---
title: "Research: sweet-search usefulness and Skilled integration"
description: "Ten-iteration deep research on sweet-search. Verdict: no integration now. Record the decision with a falsifiable growth gate; if the gate fires, the one surface to add is a conditional clause in sk-code's shared implement workflow."
trigger_phrases:
  - "sweet search research"
  - "sweet-search verdict"
  - "sweet search integration decision"
importance_tier: "important"
contextType: "research"
---
# Research: sweet-search usefulness and Skilled integration

<!-- ANCHOR:summary -->
## 1. Executive Summary

**Verdict: do not integrate sweet-search into Skilled now.** Phase 2 should record that decision with a pre-registered growth gate and change no runtime file. If the gate fires later, there is exactly one surface worth adding: one conditional clause appended to step 5 of `sk-code/shared/references/workflow-implement.md`. The clause says to use sweet-search's ranked search when a project has it initialized, and to fall back to the existing search route otherwise.

**How useful is sweet-search?** It is real and well-engineered, but its benefit is narrow:

- **The cost claim holds for its own benchmark.** Across 200 held-out tasks and five harness and model setups, runs cost 5–33% less with an unchanged solve count (481 vs 481). [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-002.md:16]
- **The "34% less model time" figure is one setup's maximum, not a typical result.** It falls to 4.3% once subagent runs are excluded, and Codex was 8% slower. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-002.md:18]
- **Independent evidence supports a cost or latency gain, not an accuracy gain.** Every gain found outside sweet-search's own data was concentrated in large, lexically noisy code trees. Anthropic tried a semantic index for Claude Code and dropped it in favour of agentic search. No independent party has measured sweet-search itself. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-007.md:19] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-007.md:23] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-007.md:27]
- **Skilled's own trees are mostly markdown, skills and specs, where the benefit is unmeasured and likely small.** Exact phrases and identifiers are already served by ripgrep and the trigger index. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-002.md:20] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-006.md:15]

**Why not even a pointer now?** A pointer fixes no current failure, and it does not lower the real adoption cost: a global install, a per-repo init and a first index. It also costs reading attention on every code task, whether or not the tool is installed. The restraint rule starts at "build nothing" and climbs only on a named failure. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-006.md:17] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-009.md:24] [SOURCE: .skilled/repo-rules/prevent-overengineering.md:48]

Users who want sweet-search lose nothing from this verdict. It installs and registers itself with Claude Code, Codex and OpenCode through its own `init`, and that works today in any repo, Skilled or not.
<!-- /ANCHOR:summary -->

---

## 2. Research Question and Scope

- **Question.** How useful is sweet-search, and how could it integrate into the Skilled repo, a Skilled skill, or elsewhere?
- **Priorities.** In order: UX in this repo, UX in external repos that install Skilled, and preventing over-engineering.
- **Source.** The vendored snapshot under `context/sweet-search-main/`, the Skilled repo, and public sources for independent evidence (iteration 7).
- **Non-goals.** Building or prototyping the integration, editing the vendored source, and running a paid end-to-end benchmark.

---

## 3. Methodology

- **Workflow.** Ten iterations of `/deep:research:auto`, one key question each. Every iteration passed `verify-iteration.cjs` (narrative, route proof and delta).
- **Iterations 1–6.** cli-codex, `gpt-6-luna`, xhigh reasoning, fast tier, run sequentially. Iteration 3's first attempt wrote a malformed delta and was redispatched once, as the workflow requires.
- **Iterations 7–10.** cli-devin, `deepseek-v4-1-flash-max`. At the operator's direction these ran in parallel, so they built on iterations 1–6 but not on each other.
- **Question set.** Q1–Q5 were set at initialization. After iteration 5 answered all five, the quality guard on Q2 had not clearly passed, because its evidence came from a single interested source. Q6–Q10 were then added through the run's inbox: an adversarial pass, independent evidence, an external-repo walkthrough, the exact pointer placement, and the phase-2 shape.
- **Synthesis checks.** Before relying on them, these claims were checked against the repo:
  - Skilled's Node 24 prerequisite. [SOURCE: INSTALL-SKILLED.md:29]
  - The sk-code hub's routing-only contract. [SOURCE: .skilled/skills/sk-code/SKILL.md:18]
  - The existence of the step-5 research sweep. [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:58]
  - sweet-search's `init --agents` behavior. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:220]

---

## 4. What sweet-search Is

- **Interface.** A local code-navigation package with six `ss-*` commands: hybrid search, exact grep, ranked pattern search, semantic spans in one file, symbol tracing and file reads. It has a `sweet-search` CLI for setup, indexing, daemon, status, updates and uninstall. An optional stdio MCP server adds eight tools: `search`, `trace`, `index`, `health`, `repo-map`, `vocab-prewarm`, `read` and `read-semantic`. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-001.md:16]
- **Index.** AST-aware chunks plus a code graph over six retrieval structures. A watcher applies edits incrementally, usually within seconds. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-001.md:18]
- **Requirements.** Node `>=22.2.0`. Prebuilt native packages cover macOS x64/arm64 and GNU Linux x64/arm64; native Windows is unsupported (WSL2 only). A GPU is optional, and the CPU path uses ONNX INT8. Setup downloads about 523 MB of models once per machine from Hugging Face. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-001.md:20] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-001.md:22]
- **"100% local" has an exception.** If Groq or Cerebras API keys are configured, graph-summary generation prefers those remote providers. It sends source-derived metadata: symbol names, signatures, up to 500 characters of docs, and child summaries. Iteration 2 narrowed iteration 1's claim: the active path does not send full function bodies. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-002.md:22]
- **Unknown.** The full first-index duration and total index size are not published, and no measurement was run.

---

## 5. How Useful It Is

| Claim | What the evidence shows | Confidence |
|---|---|---|
| 5–33% cheaper agent runs | Held. 200 SWE-rebench tasks, 16 languages, five setups, 95% intervals exclude zero, solve count unchanged. Dollar figures are list-price equivalents. | High, for that benchmark |
| Up to 34% less model time | One setup's maximum (opencode + Sol 6.1 high). Other setups saw 8–14% reductions, and Codex was 8% slower. Without subagent runs the 34% figure drops to 4.3%. | Medium; not portable |
| Better for large codebases | Codex savings grew from 15% to 43% with repo size. Claude Code was near zero above 58k lines. The retrieval benchmark used only 540–1,433-file repos. | Mixed |
| Independent support | Cursor (+12.5% accuracy, own trained embeddings), CodeRAG-Bench and an LSP-vs-grep pilot all point the same way, but only on large or lexically noisy code. One vendor index showed 92% vs 92% accuracy with a big token saving. | The mechanism is credible; sweet-search's magnitude is unverified |
| Counter-evidence | Anthropic dropped embeddings for agentic search. An Augment engineer found grep and find sufficient on SWE-bench. The pilot showed semantic search costing more tokens on symbol-named lookups and losing on multi-file renames. | High |

[SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-002.md:16] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-002.md:18] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-002.md:20] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-007.md:23] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-007.md:25]

**Bottom line.** sweet-search is most useful for repeated natural-language code navigation in a large TypeScript-heavy or lexically noisy codebase. It saves cost and latency and leaves accuracy unchanged. It is least useful for exact identifiers and for markdown, skill or spec text, which is most of Skilled.

---

## 6. Fit with What Skilled Already Has

- **Different retrieval models.** The trigger index matches author-declared phrases, and ripgrep scans literal text; neither ranks by meaning. sweet-search fills a ranked code-discovery gap. Exact lookups and curated document retrieval keep their current roles. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-003.md:15]
- **One branch of the decision tree.** The AGENTS.md code-search tree is capability-framed ("use whatever the runtime exposes"). An installed sweet-search MCP server is just another content-search capability, and it belongs only to the "concept, intent or unfamiliar code" branch. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-009.md:22] [SOURCE: AGENTS.md:223]
- **The runtimes already have lexical search.** Claude Code, Codex and OpenCode all ship it, and OpenCode also ships LSP symbol navigation. sweet-search's differentiator is hybrid ranking, not search capability. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-007.md:21]

---

## 7. Integration Surfaces and Their Cost

| Surface | Cost to this repo | Cost to external repos | Verdict |
|---|---|---|---|
| Nothing (record the decision) | None | None; users can still install sweet-search themselves | **Recommended now** |
| Conditional clause in `workflow-implement.md` step 5 | One doctrine file, about 75 words, read on every code task | None at install time; arrives with `.skilled` on pull or re-pin | **The only surface the growth gate unlocks** |
| Pointer in `sk-code/SKILL.md` or root `AGENTS.md` | Breaks the hub's routing-only contract; AGENTS.md makes a capability-framed tree vendor-specific | Root `AGENTS.md` is not in the always-linked `.skilled` set, so it would not travel | Rejected |
| Code Mode / UTCP manual | A second registration path beside sweet-search's native `init --mcp` | The user must add or link `.utcp_config.json` | Rejected |
| New `mcp-tooling` mode | Registry, router and packet upkeep, plus routing replay | None useful | Rejected |
| Doctor install or health step | Duplicates sweet-search's own init, status and uninstall lifecycle | Adds a Skilled step that can drift from upstream | Rejected |
| system-spec-kit retrieval hook | Mixes code search into document retrieval | None useful | Rejected |

[SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-004.md:16] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-004.md:18] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-004.md:20] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-004.md:22] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-009.md:16] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-005.md:17]

---

## 8. External-Repo UX

If the clause ever ships, it adds no install step and no new command. Linked projects get it on `git pull`, and copied projects get it on the next re-pin. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-008.md:17]

| State | What the user sees | What the user does |
|---|---|---|
| Absent (the default) | Nothing new; the agent keeps the existing tree | Nothing |
| Half-installed | `sweet-search status` names the failing rung and a `Next step:` line | Run the printed command |
| Stale, edits since the index | Nothing; the index updates itself | Nothing |
| Stale, older index format | Status says a full rebuild is needed | `sweet-search index --full` |
| Node below 22 | Unreachable, because Skilled already requires Node 24 | Not applicable |
| Native Windows without WSL2 | sweet-search cannot run; the agent falls back | Use WSL2, or do nothing |
| Uninstalled | The clause is inert | `sweet-search uninstall`, or `--all` |

[SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-008.md:47] [SOURCE: INSTALL-SKILLED.md:29]

Detection needs no new script. The agent checks three things in order:
1. The runtime's MCP tool roster.
2. The `.sweet-search/config.json` marker.
3. `sweet-search status --json`, only when a call fails.

[SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-009.md:20]

---

## 9. Risks and Hazards

- **`init --agents` can write into the shared Skilled checkout.** `sweet-search init --agents` appends its own guide to `AGENTS.md`. In Skilled's link-instruction mode, `AGENTS.md` is a link to the checkout's copy, so the append would edit the shared file and reach every linked project. That guide also sets a different search policy ("treat two empty probes as proof of absence") from Skilled's "widen the pattern rather than trusting a single hit". This is inferred from the link mechanics and was not reproduced. It is the one UX hazard that matters whether or not Skilled integrates. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-008.md:27] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:220]
- **Remote summary providers.** Groq or Cerebras keys in the environment route source-derived metadata off the machine. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-002.md:22]
- **Maintenance cadence is unknown.** No GitHub releases are listed, and the npm page returned 403. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-005.md:21]
- **Licence.** Apache-2.0 with a CLA that applies only to upstream contributors. A pointer bundles no code. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-005.md:21]

---

## 10. Phase 2 Blueprint

Phase 2 is `002-sweet-search-decision/`, a Level 2 packet that records a decision and changes no `.skilled/` file. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-010.md:26]

- **Files.**
  - New child docs: `spec.md`, `description.json`, `graph-metadata.json`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md` and `implementation-summary.md`.
  - Edits to the parent: the phase map in `spec.md` and the child pointer in `graph-metadata.json`.
- **Acceptance.**
  - The verdict is recorded with sources.
  - Each rejected surface carries its reason.
  - The growth gate is falsifiable.
  - `git diff --stat` shows no `.skilled/` path.
  - Strict validation passes.
- **Growth gate.**
  - **Trigger A, observed retrieval failure.** A real task where ripgrep plus the trigger index missed a code location that sweet-search found. Two cases in two repos, or one that blocks an external-repo task, opens phase 3.
  - **Trigger B, independent benchmark.** A pre-registered benchmark on Skilled-style corpora: three tasks, two conditions, the same model, counting search calls, tokens, wall time and correctness. It needs at least 20% fewer search calls with no correctness drop. Vendor data does not count.
  - **Trigger C, adoption signal (optional).** Three independent adopter requests.
  - **Growth ladder.** Phase 3 is the conditional clause. Phase 4 (doctor, Code Mode or a new mode) opens only if the clause demonstrably fails to close a measured gap.

[SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-010.md:58] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-010.md:61]

---

## 11. Recommendations

1. **Phase 2 records "no integration now"** with the growth gate above. It changes no runtime file.
2. **If the gate fires, phase 3 appends this clause to `workflow-implement.md` step 5**, not to `SKILL.md`:

   > When the runtime exposes a code-search tool and the project carries `.sweet-search/config.json`, use its ranked `search`, `trace` and `repo-map` for the concept-and-unfamiliar branch, keeping literal search for exact text and symbols and path match for known paths. If the tool is absent, uninitialized or reports a missing index, widen the pattern and read as before; it is never a prerequisite.

   [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-009.md:18]
3. **Any future clause or doc that mentions sweet-search must warn link-mode users** against `sweet-search init --agents`. They should use `init` without `--agents`, or `agents-md embed` mode instead (section 9).
4. **Do not build** a Code Mode manual, an mcp-tooling mode, a doctor step, a detector script or a spec-kit hook.

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| New mcp-tooling mode | Routing and packet upkeep for an optional external tool | iteration-004.md:20 | 4, 5 |
| Code Mode / UTCP manual | Second registration path beside the native `init --mcp` | iteration-004.md:18 | 4, 5, 6 |
| Doctor-owned install or health check | Duplicates sweet-search's own init, status and uninstall | iteration-004.md:22, iteration-008.md:21 | 4, 5, 8 |
| system-spec-kit retrieval hook | Code navigation does not belong in document retrieval | iteration-004.md:20 | 4, 5 |
| Pointer in `sk-code/SKILL.md` | The hub is routing-only by contract | .skilled/skills/sk-code/SKILL.md:18, iteration-009.md:16 | 9 |
| Pointer in root `AGENTS.md` | Does not travel to external repos; makes the tree vendor-specific | iteration-009.md:22 | 5, 9 |
| Unconditional or install-prompting pointer | Absent is the default state; it would advertise a tool most repos lack | iteration-008.md:19 | 8 |
| Detector script | The MCP roster, the config marker and `status --json` already answer the question | iteration-009.md:20 | 9 |
| Treating Cursor's 12.5% gain as transferable | It comes from a custom embedding model trained on Cursor's own traces | iteration-007.md:23 | 7 |
| Treating Anthropic's reversal as proof no index helps | Their reasons were product-specific; they did not test third-party indexes | iteration-007.md:19 | 7 |
| Handling Node below 22 | Unreachable after Skilled's Node 24 prerequisite | INSTALL-SKILLED.md:29 | 8 |
| Pointer as phase 2 | Fixes no current failure and is read on every code task | iteration-006.md:15, iteration-010.md:16 | 6, 10 |

**Dead ends.**
- No independent evaluation of sweet-search exists (iteration 7).
- The npm page returned 403, so maintenance cadence is unknown (iteration 5).
- No source gives the full first-index time or index size (iterations 1 and 4).

---

## Divergence Map

- **Saturated directions.** Surface cost comparison (iterations 4, 5 and 6 reached the same ranking from different angles) and benchmark credibility (iterations 2 and 7).
- **Pivots taken.** None in divergent mode. The run used default convergence. After iteration 5 the operator-approved inbox added Q6–Q10, which widened the frontier to adversarial, independent-evidence, UX, placement and phase-shape questions.
- **Pivot failures and audited overrides.** At the operator's direction, iterations 7–10 ran in parallel on a different executor. Iteration 10 could not see iteration 9's placement finding, and this synthesis resolved the conflict (section 13).
- **Remaining frontier.** A measured first index on a real Skilled-style repo, and reproducing the `init --agents` write-through.

---

## 12. Open Questions

- What are the first-index time and index size for this repo, or for a typical external repo? Running `sweet-search index` on a scratch copy would answer it.
- Does `init --agents` in a link-instruction project actually write into the checkout's `AGENTS.md`? A reproduction in a throwaway link-mode project would confirm it.
- If phase 3 ever ships, does editing a shared reference file require an sk-code version bump and changelog entry? Iteration 10 costed a five-file bump for a `SKILL.md` edit; the convention for a shared-reference edit was not checked.
- Is `workflow-implement.md` reliably loaded on code tasks? It is a declared leaf in every surface packet, but it is not in the router's `IMPLEMENTATION` resource map. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-009.md:24]

---

## 13. Contradictions Resolved

- **Where code can leave the machine.** Iteration 1 said remote summaries can include up to 2,000 characters of code. Iteration 2 found that helper has no in-repo caller, and the active path sends only metadata. Iteration 2's reading stands.
- **Pointer location.** Iterations 5 and 10 placed the pointer in `sk-code/SKILL.md`. Iteration 9 placed it in `workflow-implement.md` step 5. `SKILL.md:18` makes the hub routing-only, so iteration 9 stands, and iteration 10's five-file release cost applies only to the rejected `SKILL.md` placement.
- **Node requirement.** A stale web snippet said Node 18. The package says `>=22.2.0`, and the current README agrees.

---

## 14. Confidence

- **High.** What sweet-search is and requires, the surface cost ranking, the external-repo state matrix, and the restraint verdict.
- **Medium.** How much of the benchmark gain transfers to Skilled-style work. No independent or Skilled-specific measurement exists.
- **Inferred, not confirmed.** The `init --agents` write-through in link mode, and the attention cost of the clause.

---

## 15. References

- Iteration narratives: `research/iterations/iteration-001.md` through `iteration-010.md`
- Resource map: `research/resource-map.md`
- sweet-search snapshot: `../context/sweet-search-main/` (README.md, package.json, eval/, core/, scripts/uninstall.js)
- Skilled surfaces: `AGENTS.md` §5, `INSTALL-SKILLED.md`, `.skilled/skills/sk-code/`, `.skilled/skills/mcp-code-mode/`, `.skilled/skills/mcp-tooling/`, `.skilled/skills/system-skilled-doctor/`, `.utcp_config.json`, `.skilled/repo-rules/prevent-overengineering.md`

---

## 16. Executor Provenance

| Iterations | Executor | Model | Mode |
|---|---|---|---|
| 1–6 | cli-codex | gpt-6-luna, xhigh, fast tier | Sequential; iteration 3 redispatched once |
| 7–10 | cli-devin | deepseek-v4-1-flash-max | Parallel, at the operator's direction |

---

## 17. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 10
- Questions answered: 10 / 10
- Remaining questions: 0
- Last 3 iteration summaries: run 8: external-repo UX walkthrough (Q8); run 9: pointer placement and wording (Q9); run 10: phase 2 shape and growth gate (Q10, 0.7)
- newInfoRatio by iteration: 1.0, 0.875, 0.75, 0.75, 0.73, 0.6, then iterations 7–10 in parallel
- Convergence threshold: 0.05. The ratio never fell below it, so convergence did not stop the run.
- Graph convergence stayed STOP_BLOCKED throughout. The leaves emitted no graph events, so the graph signals measured an empty graph rather than the evidence.
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
