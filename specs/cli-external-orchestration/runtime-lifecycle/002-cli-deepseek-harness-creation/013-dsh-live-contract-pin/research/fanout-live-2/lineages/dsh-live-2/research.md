---
title: "DSH route patch declarations: LLM Gateway vs OpenCode Go"
description: "One-iteration deep-research synthesis for the dsh-live-2 fan-out lineage."
---

# DSH route patch declarations: LLM Gateway vs OpenCode Go

## Answer (under 200 words)

Both patches are alternative pins on the same two rows, `llm-pi-ai` and `agent-default-model`, so they cannot be combined.

The LLM Gateway patch declares provider `llmgateway`, endpoint `https://api.llmgateway.io/v1`, `api: openai-completions`, key variable `LLMGATEWAY_API_KEY`, model id `deepseek-v4.1-flash-1017`, and default `reasoningEffort: max`.

The OpenCode Go patch declares provider `opencode-go`, endpoint `https://opencode.ai/zen/go/v1`, the same API, key variable `OPENCODE_API_KEY`, model id `deepseek-v4.1-flash`, and the same default effort.

They agree on the API shape, the `off`/`high`/`max` effort ladder with `max` selected, and compat flags `thinkingFormat: deepseek` and `supportsDeveloperRole: false`. They disagree on provider id, endpoint, key variable, and exact model id. The OpenCode Go patch itself says its endpoint is "unverified until a keyed run proves it"; the LLM Gateway patch carries no such caveat.

## 1. Research Question

What do the two checked-in DeepSeek Harness route patches under `.dsh/patches/` declare (endpoint, model id, reasoning effort, compat flags), and do they agree with each other?

## 2. Scope and Method

Direct file reading of both patches, then cross-checking the repository's route inventory and the prior packet's composed `--dump-config` evidence. No keyed dispatch was run. The two patch files are read-only inputs.

## 3. Declarations

| Field | LLM Gateway patch | OpenCode Go patch |
|---|---|---|
| Provider id | `llmgateway` | `opencode-go` |
| Endpoint | `https://api.llmgateway.io/v1` | `https://opencode.ai/zen/go/v1` |
| API | `openai-completions` | `openai-completions` |
| Key variable | `LLMGATEWAY_API_KEY` | `OPENCODE_API_KEY` |
| Model id | `deepseek-v4.1-flash-1017` | `deepseek-v4.1-flash` |
| Reasoning efforts | `off`, `high: high`, `max: max` | `off`, `high: high`, `max: max` |
| Default effort | `max` | `max` |
| Compat | `thinkingFormat: deepseek`; `supportsDeveloperRole: false` | same |

[SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:5] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:9] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:14] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:24] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:6] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:10] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:15] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:25]

## 4. Agreement

- Both use the OpenAI-completions API surface.
- Both declare `thinkingFormat: deepseek` and `supportsDeveloperRole: false`.
- Both expose the same effort ladder (`off`, `high`, `max`) and select `max` by default.
- Both target the same patch rows: `llm-pi-ai` and `agent-default-model`.

[SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:11] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:12] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:16] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:12] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:13] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:17]

## 5. Differences

- Provider id and endpoint differ.
- Key variables differ.
- The model ids differ: the LLM Gateway patch pins the dated `deepseek-v4.1-flash-1017`; the OpenCode Go patch names the bare `deepseek-v4.1-flash`.
- The OpenCode Go patch explicitly records a verification gap: "the endpoint is unverified until a keyed run proves it."

[SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:7] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:9] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:2] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:8] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:10]

## 6. Verification Status

The repository documents both patches as hand-authored route patches. `.dsh/README.md` says a dispatch passes exactly one route patch and labels the OpenCode Go endpoint unverified. `.dsh/SYNC.md` repeats that the OpenCode Go endpoint is unverified until a keyed run proves it, and records that each provider also sets `supportsDeveloperRole: false` because the gateway upstream refuses the `developer` role. The prior 004 packet's `--dump-config` evidence shows each patch composing its own provider, model and default effort.

[SOURCE: .dsh/README.md:17] [SOURCE: .dsh/README.md:28] [SOURCE: .dsh/SYNC.md:25] [SOURCE: .dsh/SYNC.md:66] [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/dump-config-llmgateway.txt:60] [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/dump-config-opencode-go.txt:60]

## 7. Evidence

- `.dsh/patches/route-llmgateway-deepseek.patch.yml`
- `.dsh/patches/route-opencode-go-deepseek.patch.yml`
- `.dsh/README.md`
- `.dsh/SYNC.md`
- `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/dump-config-llmgateway.txt`
- `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/dump-config-opencode-go.txt`

## 8. Implications

The two patches are mutually exclusive route choices. A dispatch that needs LLM Gateway must use the first patch; a dispatch that needs OpenCode Go must use the second. Applying both would target the same rows and cannot be treated as additive. Endpoint health for OpenCode Go is not established by these files.

## 9. Limitations

- No keyed run exists in this lineage, so neither endpoint is proven live here.
- The answer is a declaration-level reading, not a runtime verification.
- The exact reason the OpenCode Go endpoint remains unverified is not recorded in the checked-in files beyond the comment itself.
- The auto-workflow's graph-convergence snapshot, `spec.md` findings writeback and continuity save were not executed because they resolve outside this lineage's write surface; the advisory loop-lock acquisition was also skipped because the fan-out dispatcher already owns run authority through the fenced ledger. The terminal iteration cap makes the graph gate non-blocking, and the parent merge or operator owns the remaining steps.

## 10. Recommendations

1. Treat the LLM Gateway patch and the OpenCode Go patch as alternatives selected per dispatch.
2. If OpenCode Go is promoted, require a keyed `dsh --profile headless --json ... -` run to clear the patch's own unverified label.
3. Keep the exact model ids distinct in route selection and reporting; do not normalize `deepseek-v4.1-flash-1017` and `deepseek-v4.1-flash`.

## 11. References

- `.dsh/patches/route-llmgateway-deepseek.patch.yml`
- `.dsh/patches/route-opencode-go-deepseek.patch.yml`
- `.dsh/README.md`
- `.dsh/SYNC.md`
- `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/dump-config-llmgateway.txt`
- `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/dump-config-opencode-go.txt`
- `resource-map.md` (this lineage; generated from the cited deltas)

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Applying both route patches as additive | Both target the same `llm-pi-ai` and `agent-default-model` rows; a dispatch passes exactly one route patch | `.dsh/README.md:17`; patch row ids in both files | 1 |
| Treating the two model ids as interchangeable | The ids differ (`deepseek-v4.1-flash-1017` vs `deepseek-v4.1-flash`) and the repository keeps them distinct | patch model rows; `.dsh/README.md:27-28` | 1 |
| Inferring OpenCode Go endpoint health from the patch | The patch says the endpoint is unverified until a keyed run proves it | `.dsh/patches/route-opencode-go-deepseek.patch.yml:1-2` | 1 |

## Divergence Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated directions: none
- Pivot lineage: none
- Remaining frontier: a keyed dispatch for either route; explicitly out of scope for this reading task.

## 12. Open Questions

None for the declaration-level question. Endpoint health for both routes remains open until a keyed run is recorded.

## 13. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 1
- Questions answered: 4 / 4
- Remaining questions: 0
- Last 3 iteration summaries: run 1: Read the two DSH route patches and compare their declarations. (1.00)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
