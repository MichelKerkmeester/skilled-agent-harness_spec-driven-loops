# Deep Research Synthesis — The Two DeepSeek Harness Route Patches

**Lineage:** `dsh-rc3` (cli-deepseek-harness / deepseek-v4.1-flash-1017) · **Session:** `fanout-dsh-rc3-1794676280571-63ccxg` · **Spec:** `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/017-dsh-rc3-repin` · **Iterations:** 1 of 1 (`stopPolicy: convergence`, hard cap 1)

---

## 1. Research Metadata

| Field | Value |
|---|---|
| Topic | Which endpoint, model id and reasoning effort do the two dsh route patches in `.dsh/patches/` configure? |
| Method | One iteration: full reads of both route patches with line numbers, cross-checked against the harness route selector, the DSH sync manifest/README, and the lineage invocation metadata |
| Evidence base | 2 patch files, 1 dispatcher source span, 2 `.dsh` documents, 1 lineage metadata file, 1 prior-packet line-drift check |
| Stop reason | `maxIterationsReached` (hard cap 1; all four key questions answered) |

## 2. Executive Summary

The two route patches configure two different providers, two different model ids, and the same pinned default reasoning effort:

| Patch | Provider / endpoint | Model id | Reasoning effort |
|---|---|---|---|
| `.dsh/patches/route-llmgateway-deepseek.patch.yml` | `llmgateway` → `https://api.llmgateway.io/v1` | `deepseek-v4.1-flash-1017` | declares `off`, `high`, `max`; default pinned to `max` |
| `.dsh/patches/route-opencode-go-deepseek.patch.yml` | `opencode-go` → `https://opencode.ai/zen/go/v1` | `deepseek-v4.1-flash` | declares `off`, `high`, `max`; default pinned to `max` |

The harness selects the LLM Gateway patch for model `deepseek-v4.1-flash-1017` and the OpenCode Go patch for every other allowlisted model. This lineage records `deepseek-v4.1-flash-1017` at `reasoningEffort: max`, so the LLM Gateway patch is the active route for this run. The OpenCode Go patch itself warns that its endpoint is unverified until a keyed run proves it.

## 3. Research Question & Objectives

Primary question: which endpoint, model id and reasoning effort do the two dsh route patches in `.dsh/patches` configure, cited by path and line?

The question decomposes into four checks, one pair per patch:

1. Provider and base URL for `route-llmgateway-deepseek.patch.yml`.
2. Model id and default reasoning effort for `route-llmgateway-deepseek.patch.yml`.
3. Provider and base URL for `route-opencode-go-deepseek.patch.yml`.
4. Model id and default reasoning effort for `route-opencode-go-deepseek.patch.yml`.

All four were answered in iteration 1.

## 4. Method

Iteration 1 read both route patches in full, preserving exact line numbers; read the harness route selector that maps model ids to route filenames and pins the reasoning effort; read the two `.dsh` documents that describe the composed routes; and checked the lineage's own invocation metadata to name the active route. A prior-packet citation drift on the OpenCode Go file was checked against the current file and recorded rather than repeated. No runtime probe (`dsh --dump-config`) was run: the ask is what the checked-in patches configure, and a probe would introduce environment state without improving line-level provenance.

## 5. LLM Gateway Route — Endpoint

The `llm-pi-ai` provider entry is `llmgateway`, display name "LLM Gateway", authenticated through `LLMGATEWAY_API_KEY`, using the `openai-completions` API at `baseURL: https://api.llmgateway.io/v1`. It sets `compat.thinkingFormat: deepseek` and `compat.supportsDeveloperRole: false`. [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:5] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:7] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:9] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:11]

## 6. LLM Gateway Route — Model and Reasoning Effort

The model entry is id `deepseek-v4.1-flash-1017`, name "DeepSeek V4.1 Flash", and declares reasoning-effort levels `off` (empty), `high: high` and `max: max`. The `agent-default-model` entry pins provider `llmgateway`, model `deepseek-v4.1-flash-1017`, and `reasoningEffort: max`. [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:14] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:16] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:24]

## 7. OpenCode Go Route — Endpoint

The `llm-pi-ai` provider entry is `opencode-go`, display name "OpenCode Go", authenticated through `OPENCODE_API_KEY`, using the `openai-completions` API at `baseURL: https://opencode.ai/zen/go/v1`. It carries the same `compat.thinkingFormat: deepseek` / `supportsDeveloperRole: false` block. The file header adds a caveat: the endpoint is unverified until a keyed run proves it. [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:6] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:8] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:10] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:2]

## 8. OpenCode Go Route — Model and Reasoning Effort

The model entry is id `deepseek-v4.1-flash`, name "DeepSeek V4.1 Flash", and declares reasoning-effort levels `off` (empty), `high: high` and `max: max`. The `agent-default-model` entry pins provider `opencode-go`, model `deepseek-v4.1-flash`, and `reasoningEffort: max`. [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:15] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:17] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:25]

## 9. Route Selection and the Active Route for This Lineage

The harness route selector is model-driven: model `deepseek-v4.1-flash-1017` selects `route-llmgateway-deepseek.patch.yml`; every other allowlisted model selects `route-opencode-go-deepseek.patch.yml`. The selected route patch is composed with `lineage.patch.yml` (and the guards/persona patches) via repeated `dsh --patch` arguments, and the reasoning effort is pinned per model before dispatch. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3006] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3015] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3048]

This lineage's invocation metadata records model `deepseek-v4.1-flash-1017` with `reasoningEffort: max`, so the LLM Gateway route is the active configuration here, not the OpenCode Go route. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/017-dsh-rc3-repin/research/fanout-rc3/lineages/dsh-rc3/invocation-metadata.json:1]

## 10. Corroboration and Citation Drift Check

`.dsh/SYNC.md` independently states that the LLM Gateway route's composed `agent-default-model` names `llmgateway` and `deepseek-v4.1-flash-1017`, and that the OpenCode Go route names `opencode-go` and `deepseek-v4.1-flash`. `.dsh/README.md` names `LLMGATEWAY_API_KEY` and `OPENCODE_API_KEY` as the credentials for the two routes. [SOURCE: .dsh/SYNC.md:111] [SOURCE: .dsh/README.md:67]

The prior packet `004-dsh-runtime-folder-and-patches/tasks.md:46` cites the OpenCode Go `baseURL` at line 9 and the model id at lines 14 and 23. Those citations were accurate before a second comment line was added to the file: the current file has `baseURL` at line 10 and the model id at lines 15 and 24. The provider and model claims in the prior packet still agree with the current file; only the line numbers drifted, and the citations in this synthesis follow the current file. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/tasks.md:46] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:10]

## 11. Recommendations

- Cite `route-llmgateway-deepseek.patch.yml:9` for the LLM Gateway endpoint, `:14` for its model id, `:16` for the declared effort levels and `:24` for the pinned default effort.
- Cite `route-opencode-go-deepseek.patch.yml:10` for the OpenCode Go endpoint, `:15` for its model id, `:17` for the declared effort levels and `:25` for the pinned default effort.
- When quoting the OpenCode Go endpoint in downstream work, carry its own "unverified until a keyed run proves it" caveat rather than presenting `https://opencode.ai/zen/go/v1` as validated.
- If a future change needs proof that the patches compose, run `dsh --dump-config` from a disposable `DSH_HOME` and treated unmatched-patch stderr lines as failures, per `.dsh/SYNC.md`.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Infer the route from a runtime `dsh --dump-config` probe | The ask is what the checked-in patches configure; a probe adds environment state and does not improve line-level provenance | This synthesis, Method | 1 |
| Treat the two route files as aliases of one configuration | The provider, base URL, credential env, and model id differ between the files | `.dsh/patches/route-llmgateway-deepseek.patch.yml:5-24`, `.dsh/patches/route-opencode-go-deepseek.patch.yml:6-25` | 1 |
| Reuse the prior packet's line citations for the OpenCode Go file | The prior packet's lines 9, 14 and 23 no longer match the current file after a comment line was added | `004-dsh-runtime-folder-and-patches/tasks.md:46` vs `.dsh/patches/route-opencode-go-deepseek.patch.yml:10` | 1 |

No iteration recorded a `ruledOut` entry, and iteration 1 recorded no Dead Ends; the table above captures the negative knowledge that does exist for this single-pass run.

## Divergence Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated directions: none; the single iteration answered every key question.
- Remaining frontier: none recorded. The topic is narrow and fully covered by the two checked-in patch files; a future run would only re-derive composition with a runtime probe.

## 12. Open Questions

None. All four key questions were answered and ticked in the strategy.

Residual uncertainty remains on one point of fact owned by the patch author, not by this research: whether `https://opencode.ai/zen/go/v1` is a live, keyed endpoint. The patch itself marks it unverified, and this research did not perform a keyed dispatch, so that question stays open by design. [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:2]

## Risks & Caveats

- The OpenCode Go route is declared but explicitly unverified; do not treat its endpoint as proven.
- Model-id truth is split: `deepseek-v4.1-flash-1017` is the LLM Gateway id; `deepseek-v4.1-flash` is the OpenCode Go id. They are not interchangeable strings.
- Reasoning effort has two meanings in the patch: the declared menu (`off`/`high`/`max`) and the pinned default (`max`). The table and sections above state both.
- The prior packet's line numbers for the OpenCode Go file are stale; a reader reusing them will land on the wrong line.

## Appendix: Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 1
- Questions answered: 4 / 4
- Remaining questions: 0
- Last 3 iteration summaries: run 1: Endpoint, model id and reasoning effort of the two dsh route patches (0.92)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded; the iteration cap stopped the loop before convergence math could vote

## References

- `.dsh/patches/route-llmgateway-deepseek.patch.yml`
- `.dsh/patches/route-opencode-go-deepseek.patch.yml`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (route selection and reasoning-effort pin)
- `.dsh/SYNC.md` (composed route expectations)
- `.dsh/README.md` (route credentials)
- `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/017-dsh-rc3-repin/research/fanout-rc3/lineages/dsh-rc3/invocation-metadata.json`
- `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/tasks.md` (line-citation drift check)

`resource-map.md` was absent at init (`resource_map_present: false`), so no spec-level resource-map citation is made here; the lineage-local `resource-map.md` emitted by the reducer is an artifact index for the merge, not a research source.
