# Iteration 6: F-2-008 session environment and rerun identity

## Focus

Frontier node F-2-008 (depth 2, scope runtime/lib/deep-loop/executor-audit.ts, runtime/scripts/fanout-run.cjs): Does any runner path read EXECUTOR_SESSION_ENV_BY_KIND and persist a provider session id for a --only-lineage rerun, or is it detection-only?

The node was read as: trace the constant to every reader, then trace what a `--only-lineage` rerun actually reuses.

## Actions Taken

1. Read `EXECUTOR_SESSION_ENV_BY_KIND` and every reference to it in the runtime.
2. Read `detectFromRuntimeEnv` and its caller in `validateExecutorDispatchAllowed`.
3. Read `readStoredLineageSessionId` and `buildLineageDispatch`'s use of it.
4. Grepped the fanout and dispatch scripts for any resume flag, provider session field or session-id extraction from a CLI log.

## Findings

1. **`EXECUTOR_SESSION_ENV_BY_KIND` is detection-only: its sole reader is the recursion guard.** `detectFromRuntimeEnv` returns true when the kind's session variable is set, and `validateExecutorDispatchAllowed` turns that into an `env`-layer refusal before spawn. Nothing writes the value to `effective_config`, the lineage config or the summary, and `fanout-run.cjs` never imports the constant. The table exists to stop a kind invoking itself, not to resume it. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:85] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:903] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1011]

2. **The only rerun identity is the stored SPECKIT session id, and no adapter turns it into a provider-session resume.** `buildLineageDispatch` calls `readStoredLineageSessionId` and falls back to `fanout-<label>-<runId>`; the id is written into the prompt and the preview as `session_id`. No builder emits `--resume`, `--session`, `--continue` or a codex `exec resume` subcommand, and the runner does not parse a `session_id` out of a CLI log. A `--only-lineage` rerun therefore re-reads the lineage's artifacts and prompt but starts a fresh provider conversation. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:765] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3881] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3967]

3. **The guard's env layer covers four of eight kinds by design, and no table says which layer covers the rest.** The map names codex, claude, opencode and cursor; pi and vibe are commented as unconfirmed and devin as absent, while dsh has no session env and is caught by its state-dir check instead. Self-invocation is still refused for the others by the stack, ancestry or lockfile layers, but the coverage is implicit in code rather than stated per kind. A guard-layer row beside the adapter capability record would make "this kind cannot self-detect by env" a declared fact instead of a comment. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:82] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:163]

4. **The honest fix is to name artifact resume, and to capture a provider id only if model-session resume is actually wanted.** Today's behaviour is coherent: a rerun resumes the loop from `deep-research-state.jsonl` and the node store, which is what makes a retry cheap. Calling it "session resume" overstates it. If provider resume is wanted, the JSON shapes already carry an id (opencode's events and cursor's `--output-format json` both report one), so the runner can extract it, persist it in the lineage config under a `providerSession` key, and pass the adapter's resume flag on a rerun; until then, the capability record should say `resume: artifact-only` for every kind. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:90] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/iterations/iteration-001.md:27]

## Questions Answered

- Does any runner path read `EXECUTOR_SESSION_ENV_BY_KIND` and persist a provider session id? No. Finding 1: the only reader is the recursion guard; nothing persists the value.
- Is it detection-only? Yes, and the rerun identity is artifact-based. Findings 1 and 2.

## Questions Remaining

- Whether model-session resume is worth building for the kinds whose logs report an id, or whether artifact resume is sufficient for the retry use case.

## Recommended Next Focus

None: this was the last open frontier node for this lineage. Synthesis should now produce the ranked report and the frontier-drained stop.

## Ruled Out

- **Persisting the env value as the rerun identity.** The env is the parent's provider session, not the child's, and the recursion guard deliberately reads it to refuse dispatch; storing it would conflate the guard with resume.
- **Adding resume flags to all eight adapters at once.** Four kinds report no session id in a parseable shape, and the two unconfirmed envs would need live probes; per-kind capture is the only honest path.
- **Treating `session_id` in the preview as a provider id.** It is the SPECKIT session used for artifact scoping, as `buildLineageDispatch` shows.

## Dead Ends

- Grepping for `--resume` or `exec resume` in `fanout-run.cjs` and `dispatch-iteration.cjs`: no match. The absence is the finding.
- Looking for a log parser that extracts a session id: none exists; the only log parsers are cost and quota.

## Edge Cases

- Ambiguous input: "session resume" could mean artifact continuity or provider conversation continuity. Both readings are answered separately in Findings 1-4; the code implements the first.
- Contradictory evidence: the adapter comments mention a "session" for cursor's env, but no builder consumes it. The comment is about detection, not resume.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:82`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:85`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:90`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:163`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:903`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1011`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:765`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3881`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3967`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/iterations/iteration-001.md:27`

## Assessment

- New information ratio: 0.75
- Questions addressed: the rerun identity question.
- Questions answered: both parts.
- Finding mix: 2 fully new traces (detection-only, artifact-only) and 2 partially new refinements (guard coverage, the naming/capture fix).

## Reflection

- What worked and why: following the constant to its only caller settled "detection-only" in one grep; the absence of any resume flag in the builders settled the other half.
- What did not work and why: the preview's `session_id` looked like a provider id for a moment; reading `buildLineageDispatch` showed it is the SPECKIT session, so the label is misleading rather than the mechanism.
- What I would do differently: check the preview label against the builder before treating it as evidence, since the preview is where the ambiguity starts.

## SCOPE VIOLATIONS

None. No file outside the lineage directory was written.
