# Iteration 1: DSH route patch declarations

## Focus

Read the two checked-in DeepSeek Harness route patches under `.dsh/patches/`, record the endpoint, model id, reasoning effort and compat flags each declares, and compare them. The topic asks for a reading answer under 200 words; no keyed probe or dispatch is in scope.

## Actions Taken

1. Read `.dsh/patches/route-llmgateway-deepseek.patch.yml` lines 1-24.
2. Read `.dsh/patches/route-opencode-go-deepseek.patch.yml` lines 1-25.
3. Read `.dsh/README.md` lines 15-53 and `.dsh/SYNC.md` lines 15-25 for the route inventory and verification labels.
4. Read the prior 004 packet's `--dump-config` evidence for each route to corroborate the composed values.

## Findings

1. `route-llmgateway-deepseek.patch.yml` declares provider `llmgateway` at `https://api.llmgateway.io/v1` with `api: openai-completions`, `apiKeyEnv: LLMGATEWAY_API_KEY`, model id `deepseek-v4.1-flash-1017`, and default `reasoningEffort: max`. [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:7] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:9] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:14] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:24]
2. `route-opencode-go-deepseek.patch.yml` declares provider `opencode-go` at `https://opencode.ai/zen/go/v1` with `api: openai-completions`, `apiKeyEnv: OPENCODE_API_KEY`, model id `deepseek-v4.1-flash`, and default `reasoningEffort: max`. [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:8] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:10] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:15] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:25]
3. Both patches declare the same compat block, `thinkingFormat: deepseek` and `supportsDeveloperRole: false`, and the same effort ladder `off` / `high: high` / `max: max` with `max` selected by default. [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:11] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:12] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:12] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:13]
4. They disagree on provider id, endpoint, key variable, and exact model id (`deepseek-v4.1-flash-1017` vs `deepseek-v4.1-flash`); the OpenCode Go patch itself says its endpoint is "unverified until a keyed run proves it". [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:1] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:2] [SOURCE: .dsh/README.md:28]
5. The two are alternative pins, not additive: both target the same `llm-pi-ai` and `agent-default-model` rows, and the repository says a dispatch passes exactly one route patch. Prior `--dump-config` evidence shows each patch composing its own provider and model separately. [SOURCE: .dsh/README.md:17] [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/dump-config-llmgateway.txt:60] [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/dump-config-opencode-go.txt:60]

## Questions Answered

- What endpoint, model id, reasoning effort, and compat flags does `.dsh/patches/route-llmgateway-deepseek.patch.yml` declare?
- What endpoint, model id, reasoning effort, and compat flags does `.dsh/patches/route-opencode-go-deepseek.patch.yml` declare?
- Do the two route patches agree, and where do they differ?
- Which route does the repository document as unverified pending a keyed run?

## Questions Remaining

None for the stated reading scope. Endpoint health and keyed dispatch are explicitly out of scope.

## Ruled Out

None. The direct-file reading path answered every in-scope question in one pass.

## Dead Ends

None.

## Edge Cases

- Ambiguous input: none. "Agree" is read as agreement in the declared fields, not as runtime equivalence.
- Contradictory evidence: none. The patches and the repository docs agree on the values; the two patches differ by design, and the OpenCode Go comment states the verification gap explicitly.
- Missing dependencies: no keyed execution evidence exists in this lineage, so endpoint health is recorded as unverified rather than inferred. This is the documented state, not a failure.
- Partial success: none. All four key questions are answered from checked-in files.
- Scope conflicts: the auto-workflow's post-synthesis `spec.md` writeback and continuity save were not performed because they are outside this lineage's write surface; they belong to the parent merge or the operator.

## Sources Consulted

- `.dsh/patches/route-llmgateway-deepseek.patch.yml`
- `.dsh/patches/route-opencode-go-deepseek.patch.yml`
- `.dsh/README.md`
- `.dsh/SYNC.md`
- `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/dump-config-llmgateway.txt`
- `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/dump-config-opencode-go.txt`

## Assessment

- New information ratio: 1.0
- Novelty justification: all five findings are new to this lineage, which had no prior research state.
- Questions addressed: all four key questions.
- Questions answered: all four key questions.

## Reflection

- What worked and why: reading the two patch files directly, then checking the repository's own route inventory and the prior `--dump-config` evidence, produced a declaration-level answer with three independent corroborations and no need for a keyed run.
- What did not work and why: nothing failed. The only unavailable input is a keyed dispatch, which the topic does not request and the frozen scope excludes.
- What I would do differently: nothing for a one-iteration reading task; a keyed run would be a separate verification phase, not a deeper read.

## Recommended Next Focus

None: `config.maxIterations` is 1. If the parent needs endpoint health, a keyed dispatch under a fresh `DSH_HOME` is the next evidence step, and it is outside this lineage's scope.
