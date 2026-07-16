# Adherence Research — Wave 2 (gpt-5.5-fast xhigh, 5 iterations)

> **Context:** run after the disposition's superseding result revealed the prior "3/3 envelope failure" was a probe-harness artifact (`opencode run "<slash text>"` never invokes the command runtime, so the render contract never reached the model; with `--command` dispatch the same gpt-5.5 medium renders the envelope 3/3). This wave investigated the *true mechanical* solution independently with a higher-reasoning model.

<!-- ANCHOR:corroboration -->
## 1. Independent corroboration of the root cause

Iteration 015 (synthesis), reasoning from the code and the empirical evidence with **no prior knowledge of the Fable investigation**, independently reached the same primary conclusion: *"Rank 1: fix command invocation first — make `--command <family>/<name>` the mandatory harness and external-dispatch path for slash commands; keep raw slash-text as the negative control."* Two independent investigations (Fable + gpt-5.5 xhigh) converging on the dispatch protocol as the root cause is strong evidence the diagnosis is correct.

Iteration 014 reached the same **R8 demotion** as the disposition: a CI golden-fixture lint is a *drift guard* ("name it `render-contract-drift`, not `adherence`"), not proof of live model adherence, and would not have caught this bug (the artifacts were consistent; the harness was broken). Pair it with a live/recorded-transcript probe gate.
<!-- /ANCHOR:corroboration -->

<!-- ANCHOR:deeper-mechanism -->
## 2. Deeper mechanism — the belt-and-suspenders renderer

Iterations 011–013 detail the runner-up the disposition kept ("adopt only if slot drift becomes unacceptable or weaker executors are used") at implementation grade:

- **Tool-side deterministic renderer, attached additively (iter 011/012).** Implement `renderMemorySearchPresentation({query,intent,count,results,recovery})` in/near `formatters/search-results.ts` and attach it as `data.presentation = { format: "memory_search.v1", text: "MEMORY:SEARCH …" }` — *additive*, so the existing JSON MCP envelope is unchanged (replacing it would be a breaking change). Teach CLI text mode to print `data.presentation.text`. The renderer must cover the weak and empty paths (Section 2 and Section 3 of the contract), not just the happy path.
- **Fix the low-confidence path at the source (iter 013).** The reason weak retrieval triggered prose even under a correct contract is that the runtime injects the evidence-gap as *prompt-visible markdown* (`evidenceGapWarning` prepended to `summary`) and a natural-language `safeResponse`. Stop prepending it to `summary`; expose it as structured `quality`/`notice` fields and a `displayMode: "memory_search_envelope"` render policy so the envelope stays mandatory and confidence is represented *inside* it.

These are the mechanical hardening to adopt if/when slot drift or weaker executors make the doc-contract insufficient — but they are NOT required for the primary fix, which is correct dispatch.
<!-- /ANCHOR:deeper-mechanism -->

<!-- ANCHOR:recommendation -->
## 3. Net recommendation

1. **Primary (shipped by the parallel investigation):** correct command dispatch via `--command` — the doc contracts then work on a mid-tier model.
2. **Hardening (optional, ranked):** the additive tool-side renderer (iters 011/012) + structured low-confidence signal (iter 013) — adopt if slot drift recurs or weaker executors are introduced. These move the guarantee from "model honors the contract" to "bytes are produced in code," which is the strongest form.
3. **Guard (optional):** the `render-contract-drift` CI lint (iter 014) as a drift tripwire, explicitly NOT an adherence proof.

Evidence: `iterations/iteration-011.md` … `iteration-015.md`; finding rows in `deltas/iter-011.jsonl` … `iter-015.jsonl`. Primary cited code: `mcp_server/formatters/search-results.ts`, `handlers/memory-search.ts`, `mcp_server/hooks/`.
<!-- /ANCHOR:recommendation -->
