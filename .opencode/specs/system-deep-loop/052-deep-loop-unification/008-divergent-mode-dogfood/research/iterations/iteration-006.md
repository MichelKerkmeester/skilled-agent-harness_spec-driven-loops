# Iteration 006

## Focus

Determine whether council seat provenance should separately represent executor family, effective primary agent, requested mode, seat id, lens, and model.

## Actions Taken

1. Read the externalized state, reducer-owned strategy, prior iteration, and deep-research iteration contract to preserve the active focus and avoid the exhausted council-delta direction. [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/deep-research-state.jsonl:1-24] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/deep-research-strategy.md:77-135] [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/research/iterations/iteration-005.md:37-47]
2. Traced route metadata from topic orchestration into each seat prompt and the persisted round-completion record. The route describes council intent, but it does not record the effective child-process agent, executor family, or selected model. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:24-33,71-82,261-320]
3. Traced seat normalization and dispatch results. The shared dispatcher preserves only `seat_id`, timing, status, and opaque output; identity dimensions survive only when a seat implementation happens to echo them. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/council/multi-seat-dispatch.cjs:23-34,79-104,129-169]
4. Compared model resolution, subprocess invocation, prompt construction, and returned seat metadata. Model selection is global, an `executor` string is interpreted as a model, per-seat models are ignored, and the effective agent is neither selected nor observed. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:133-186,196-209,256-296]

## Findings

### F-ITER006-001 (P1): The current `executor` input conflates executor family and model

`resolveExecutorModel` treats a string-valued `executorConfig.executor` as the value passed to `opencode run --model`. A natural family value such as `cli-opencode` is therefore interpreted as a model identifier rather than dispatch infrastructure. Object-valued `executor` is also searched only for model fields; no executor-family field is normalized or persisted. The schema should represent `executor_family` independently from `model`, and reject family names in model slots. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:164-186,196-209]

### F-ITER006-002 (P1): Per-seat model diversity is configured semantically but ignored by dispatch

`dispatchSeat` resolves one model solely from session-level `executorConfig` and `councilConfig`; it never reads `seatInput.model`, `model_id`, or a seat-specific executor object. Every seat is consequently launched with the same resolved model even when seat descriptors declare distinct models. The returned and persisted seat metadata includes id, lens, role, and vantage but omits the actual model. A seat-local `model` field is required both as dispatch input and observed provenance. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:164-186,256-296]

### F-ITER006-003 (P1): Route proof records requested council intent as if it proved the effective child agent

The route header and fields hard-code `target_agent: @ai-council`, but the child invocation supplies only `run`, `--model`, and the prompt. No agent selector is passed and no effective primary agent is captured from the subprocess. This is a categorical mismatch: `requested_mode=ai-council` belongs to host workflow intent, while `effective_primary_agent` belongs to the seat execution result and is currently unknown. They must be separate fields, and effective identity must remain `null`/`unknown` unless observed. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:24-33,71-82] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:27-35,196-209]

### F-ITER006-004 (P1): Persisted round state cannot reconstruct seat execution provenance

Round completion persists only seat ids and an aggregate dispatch summary. The shared dispatcher retains timing and opaque output, while the concrete output echoes lens/role/vantage but not executor family, effective agent, requested mode, or model. After interruption, audit and replay cannot distinguish two seats that used different execution paths or verify that the requested model actually ran. Persist a normalized per-seat provenance envelope with requested and effective sections rather than relying on prompt text or opaque output. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:305-329] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/council/multi-seat-dispatch.cjs:79-104,158-169] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:277-296]

### F-ITER006-005 (P2): Route overrides can make structured fields disagree with the canonical header

`withCouncilRouteConfig` accepts a custom fixed header and independently overlays arbitrary `route_fields` on the defaults. An operator can therefore produce `mode=ai-council` in the header while structured `mode`, `target_agent`, or execution fields say something else. The completion record then emits a third, shorter route string. A normalized route object should be authoritative and render all text views; requested values and observed effective values should not share an override map. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:24-33,71-82,305-320]

## Questions Answered

- **Should the six dimensions be separated?** Yes. Use separate route intent and seat execution provenance rather than one overloaded executor value: `requested.mode`, `requested.target_agent`, `seat.id`, `seat.lens`, `executor.family`, `executor.model`, and `effective.primary_agent` (nullable until observed).
- **Are all six equally knowable before dispatch?** No. Seat id/lens, requested mode/agent, executor family, and requested model are inputs. Effective primary agent and effective model are observations and must not be inferred from the request.
- **Would flat aliases be sufficient?** No. A requested/effective boundary is necessary to prevent the existing route-proof error from being recreated under more field names.

## Questions Remaining

- Which shared-runtime and command-contract tests are missing for executor-family/model separation, per-seat model selection, and requested-versus-effective provenance?
- How do deep-improvement candidate prompts and reducer boundaries compare with the review and council failure patterns?
- Are review prompt/validator schema mismatches covered outside skill-local tests?
- Are async executor provenance guarantees intentionally weaker than synchronous dispatch, and is that documented?

## Next Focus

Identify the shared-runtime and command-contract tests needed to catch the council provenance defects and the four cost/liveness defects from iteration 5.

## Ruled-Out Directions

- Flattening all six concepts into peer fields is ruled out because requested route intent and observed execution identity have different truth conditions and lifecycle timing. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs:24-33,305-320] [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:196-209]
- Treating `vantage` as model provenance is ruled out: `vantage` is echoed into output metadata, but subprocess model selection is independently resolved from global executor configuration. [SOURCE: .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs:164-186,256-296]

## SCOPE VIOLATIONS

None. No researched runtime, skill, command, agent, config, or test file was modified.
