# Improvement Iteration 005 — Systemic / reliability / meta

- **Model**: opus-4.8 (claude2, read-only)
- **Seat**: i05
- **top_pick**: Unify loop locking across all four graph-backed modes through the already-promoted, already-tested runtime loop-lock CLI — replacing the prose-only research/review locks and the missing council lock, and giving the dead canonical CLI its intended consumers
- **improvements**: 4

## Analysis

I have enough evidence to synthesize. Let me confirm the final lock landscape is crisp and form the analysis.

The picture is now clear and consistent across all the reads. Here is my analysis.

---

# Systemic / Reliability / Meta review — deep-loop ecosystem (i05/5)

## Headline (meta verdict first)

**The architecture is sound — don't collapse or explode it.** The 2-skill split (`deep-loop-workflows` hub over the frozen `deep-loop-runtime` backend) is earning its keep: the backend is genuinely shared (convergence math, coverage-graph, council primitives, fan-out pool, atomic-state, loop-lock lib, lifecycle taxonomy) and genuinely well-tested — **41 vitest files** including `convergence-script`, `fanout-*`, `loop-lock`, `atomic-state`, `lifecycle-taxonomy`. A single mega-skill would still need this internal modularization; N separate skills would either duplicate the backend or create N cross-skill imports. The one-`graph-metadata.json` keystone is correct: these modes are facets of one capability, not competing skills.

**The reliability risk has fully migrated off the backend and onto the orchestration layer** — the YAML state machines the LLM interprets. Every finding below is the same shape: *a deterministic, tested primitive already exists in the runtime, but the orchestration layer either re-implements it in prose, doesn't use it, or hand-copies its contract.* That is the single systemic theme, and it's the highest-leverage thing to fix.

## The lock landscape (the core finding)

I mapped single-writer protection across the four graph-backed modes:

| Mode | Lock mechanism | Evidence |
|---|---|---|
| **context** | **Deterministic** O_EXCL file lock + stale-reclaim + PID-liveness | `deep_context_auto.yaml:174` → `deep-context/scripts/loop-lock.cjs:91` → `loop-lock.ts:205` |
| **research** | **Prose only** — LLM-interpreted | `deep_research_auto.yaml:226`: *"Open {lock_file} with exclusive non-blocking advisory locking semantics; fail closed on contention."* |
| **review** | **Prose only** — LLM-interpreted | `deep_review_auto.yaml:238` (identical prose) |
| **ai-council** | **No lock at all** | `deep_ai-council_auto.yaml` (0 lock refs, broad grep empty) |

And the kicker: the runtime's **promoted canonical lock CLI** (`deep-loop-runtime/scripts/loop-lock.cjs`, 220 lines, whose own header says it exists *"so non-TS callers share one locking contract instead of drifting per mode"*) has **zero production callers**. Context bypasses it with its own 114-line wrapper that imports the *library* directly (`deep-context/scripts/loop-lock.cjs:29`); research/review use prose; council uses nothing. The promotion produced an unused canonical surface while the drift it was meant to prevent is exactly what exists today.

The deterministic lock is *strictly* safer than the prose one: atomic `O_EXCL` create (`loop-lock.ts:127`), stale reclaim by `ttl*2` + PID liveness (`loop-lock.ts:190`), owner-scoped release. The prose version's semantics are "whatever the interpreting runtime does this run."

---

## Prioritized improvements

### P1 — Unify loop locking across all four modes through the promoted runtime CLI *(top pick)*
Route research/review/council `step_acquire_lock`/`step_release_lock` to the same deterministic lock the runtime already ships and tests (`loop-lock-cli.vitest.ts`, `loop-lock.vitest.ts`), replacing the prose locks and the missing council lock. Pick **one** CLI front-door (consolidate context's bespoke `--lock/--owner` wrapper and the runtime's `--lock-path/--owner-pid` adapter into one) so there's a single flag contract.
- **Evidence:** `deep_research_auto.yaml:226`, `deep_review_auto.yaml:238`, `deep-loop-runtime/scripts/loop-lock.cjs:1` (no callers), `loop-lock.ts:205`.
- **Why it's worth it:** closes a real concurrency-safety gap on the two highest-traffic modes + council, activates the promoted-but-dead CLI, and is *low-regret* because the deterministic path is unambiguously safer and already tested. It also folds in the dead heartbeat capability (see open questions).
- **Effort:** M · **Risk:** low-med (YAML orchestration only; must preserve owner-pid capture + release-on-every-exit-path discipline). · **Preserves invariants:** yes — no convergence/state/artifact behavior change; runtime stays MCP-free; one graph-metadata.json; fixtures untouched.

### P2 — Add a lifecycle-taxonomy drift-guard and reconcile `userPaused`
The frozen taxonomy declares **6** stopReasons (`lifecycle-taxonomy.cjs:22`), but the command YAMLs hand-maintain a **7-value** `stop_reasons_enum` that adds `userPaused` (`deep_context_auto.yaml:591`). The module's stated purpose is *"consumers import these so accepted values stay identical across modes"* — yet its **only** importer is `improvement-journal.cjs:90`; the three graph-backed mode YAMLs redefine the enum and have already diverged. Routing got the "hardcoded projection + CI drift-guard" discipline (`routing-registry-drift-guard.vitest.ts`); the taxonomy did not.
- **Evidence:** `lifecycle-taxonomy.cjs:22-29`; `deep_context_auto.yaml:591`; `improvement-journal.cjs:90-91`.
- **Effort:** S-M · **Risk:** low · **Preserves invariants:** yes (either promote `userPaused`/`manualStop` into canonical, or document it as a transient pause-event distinct from terminal stopReasons, then guard parity).

### P2 — Make `acquireLoopLock` stale-reclaim race-safe
The fresh-lock path is race-safe (`O_EXCL`, `loop-lock.ts:211-216`), but the **stale-reclaim** path falls through to `writeLoopLockAtomic` (temp+rename, last-writer-wins, `loop-lock.ts:219`). Two processes both observing the same stale lock can both `rename` their temp over it and both return `acquired:true` — mutual exclusion violated. Narrow today (single-host, single-user), but P1 makes this primitive load-bearing for *every* mode.
- **Evidence:** `loop-lock.ts:206-221`.
- **Effort:** S · **Risk:** low · **Preserves invariants:** yes (e.g. reclaim via `unlink`-then-`O_EXCL`, losing reclaimer re-reads holder).

### P2 — Write the fan-out merged registry atomically
`fanout-merge.cjs:351,355` write the merged registry and attribution.md with plain `fs.writeFileSync` straight onto the target — the runtime already provides `writeStateAtomic` (temp+fsync+rename, `atomic-state.ts:36`) used by both `loop-lock.ts` and the loop state. A kill mid-write leaves truncated JSON for synthesis to read.
- **Evidence:** `fanout-merge.cjs:351,355` vs `atomic-state.ts:36`.
- **Why only P2:** blast radius is small (merge is the terminal step and re-runnable from preserved per-lineage data), but it's a free, house-standard hardening.
- **Effort:** S · **Risk:** low · **Preserves invariants:** yes.

### Areas I judged already near-optimal (honest)
- **Fan-out pool** (`fanout-pool.cjs`): correct K-in-flight pump, never-throws per-item settlement, ordered results, JSONL status ledger + summary, per-lineage dir isolation, recursion guard (`fanout-run.cjs:442`), salvage sweep, timeout-as-failure. Good observability and good failure containment. Leave it.
- **Convergence math** (`convergence.cjs`): per-loop-type weighted composite + blocking guards + per-signal trace + empty-graph early-return, all session-scoped and snapshot-aware. Tested. Sound.

---

## Open questions
- The lock **heartbeat is never refreshed** — `refreshLoopLock` exists (`loop-lock.ts:231`) and both CLIs expose `refresh`, but no YAML calls it, so staleness is governed purely by `ttl*2` wall-clock (context defaults to 1h ttl → 2h window). Acceptable for sub-window runs; should a long loop refresh, or is the wide window the intended design?
- The **stop decision is split across two computers**: deterministic graph signals (`convergence.cjs`) AND the LLM-emitted novelty ratio (`noveltyRatio` in research JSONL, combined by the agent — `convergence.cjs:294` says STOP is "pending newInfoRatio agreement"). No single place computes "should I stop." Intentional (deterministic vs semantic), but it makes stop-quality partly dependent on the LLM honestly self-reporting novelty.
- Should context's bespoke `loop-lock.cjs` wrapper be retired in favor of the runtime CLI, or vice-versa? Two front-doors over one library with different flag contracts is the smaller drift hiding behind P1.

I made no edits — this is analysis only, anchored to the files cited above.

===RESEARCH-JSON===
{"angle":"systemic/reliability/meta","improvements":[{"title":"Unify loop locking across all 4 graph-backed modes via the promoted runtime loop-lock CLI","rationale":"context uses a deterministic O_EXCL lock, research/review use prose-only LLM-interpreted locks, ai-council has none, and the promoted canonical CLI has zero callers; unifying closes a real concurrency-safety gap on the highest-traffic modes and activates the dead promoted surface with a strictly-safer, already-tested primitive","evidence":"deep_research_auto.yaml:226; deep_review_auto.yaml:238; deep_ai-council_auto.yaml (no lock); deep-loop-runtime/scripts/loop-lock.cjs:1 (no callers); loop-lock.ts:205","effort":"M","risk":"med","preserves_invariants":true,"priority":"P1"},{"title":"Add a lifecycle-taxonomy drift-guard and reconcile userPaused","rationale":"frozen taxonomy declares 6 stopReasons but YAMLs hand-maintain a 7-value enum (adds userPaused) with no parity guard, while the module's only importer is improvement-journal; routing got the drift-guard discipline, the taxonomy did not","evidence":"lifecycle-taxonomy.cjs:22-29; deep_context_auto.yaml:591; improvement-journal.cjs:90-91","effort":"S","risk":"low","preserves_invariants":true,"priority":"P2"},{"title":"Make acquireLoopLock stale-reclaim race-safe","rationale":"fresh-lock path is O_EXCL race-safe but the stale-reclaim path uses temp+rename last-writer-wins, so two reclaimers can both acquire; P1 makes this primitive load-bearing for every mode","evidence":"loop-lock.ts:206-221","effort":"S","risk":"low","preserves_invariants":true,"priority":"P2"},{"title":"Write the fan-out merged registry atomically with writeStateAtomic","rationale":"fanout-merge writes the merged registry and attribution with plain writeFileSync though the runtime already ships writeStateAtomic (temp+fsync+rename) used elsewhere; a mid-write kill leaves truncated JSON for synthesis","evidence":"fanout-merge.cjs:351,355 vs atomic-state.ts:36","effort":"S","risk":"low","preserves_invariants":true,"priority":"P2"}],"top_pick":"Unify loop locking across all four graph-backed modes through the already-promoted, already-tested runtime loop-lock CLI — replacing the prose-only research/review locks and the missing council lock, and giving the dead canonical CLI its intended consumers","open_questions":["Heartbeat refresh is never called by any YAML (refreshLoopLock is dead capability); is the ttl*2 staleness window intended for long runs?","The stop decision is split between deterministic graph signals and the LLM-emitted noveltyRatio with no single computer — is that coherence seam acceptable?","Should context's bespoke loop-lock wrapper be retired in favor of the runtime CLI, or vice-versa (two front-doors, one library, different flag contracts)?"]}
===END===

## Improvements (structured)

```json
[
  {
    "title": "Unify loop locking across all 4 graph-backed modes via the promoted runtime loop-lock CLI",
    "rationale": "context uses a deterministic O_EXCL lock, research/review use prose-only LLM-interpreted locks, ai-council has none, and the promoted canonical CLI has zero callers; unifying closes a real concurrency-safety gap on the highest-traffic modes and activates the dead promoted surface with a strictly-safer, already-tested primitive",
    "evidence": "deep_research_auto.yaml:226; deep_review_auto.yaml:238; deep_ai-council_auto.yaml (no lock); deep-loop-runtime/scripts/loop-lock.cjs:1 (no callers); loop-lock.ts:205",
    "effort": "M",
    "risk": "med",
    "preserves_invariants": true,
    "priority": "P1"
  },
  {
    "title": "Add a lifecycle-taxonomy drift-guard and reconcile userPaused",
    "rationale": "frozen taxonomy declares 6 stopReasons but YAMLs hand-maintain a 7-value enum (adds userPaused) with no parity guard, while the module's only importer is improvement-journal; routing got the drift-guard discipline, the taxonomy did not",
    "evidence": "lifecycle-taxonomy.cjs:22-29; deep_context_auto.yaml:591; improvement-journal.cjs:90-91",
    "effort": "S",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P2"
  },
  {
    "title": "Make acquireLoopLock stale-reclaim race-safe",
    "rationale": "fresh-lock path is O_EXCL race-safe but the stale-reclaim path uses temp+rename last-writer-wins, so two reclaimers can both acquire; P1 makes this primitive load-bearing for every mode",
    "evidence": "loop-lock.ts:206-221",
    "effort": "S",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P2"
  },
  {
    "title": "Write the fan-out merged registry atomically with writeStateAtomic",
    "rationale": "fanout-merge writes the merged registry and attribution with plain writeFileSync though the runtime already ships writeStateAtomic (temp+fsync+rename) used elsewhere; a mid-write kill leaves truncated JSON for synthesis",
    "evidence": "fanout-merge.cjs:351,355 vs atomic-state.ts:36",
    "effort": "S",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P2"
  }
]
```
