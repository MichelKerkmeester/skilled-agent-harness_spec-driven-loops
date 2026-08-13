<!-- iteration 37 | model glm (zai-coding-plan/glm-5.2) | angle: Workflow engines & DAG schedulers | 2026-07-15T00:21:07.902Z -->

I'll verify the key workflow engines I plan to feature (Airflow, Dagster, Metaflow, Flyte, Luigi) via the GitHub API for real star counts, then synthesize.
## Analysis: Workflow Engines & DAG Schedulers → loop-engineering lessons

**Verified (GitHub API, all 2026-07 active):** `apache/airflow` (46.1k★), `spotify/luigi` (18.7k★), `dagster-io/dagster` (15.8k★), `Netflix/metaflow` (10.2k★), `flyteorg/flyte` (7.1k★). None were in the prior 171 — the canonical DAG-scheduler lineage was genuinely uncovered.

**What transfers, by subsystem:**

1. **runtime/locks-recovery — "backfill" is the recovery primitive, not "replay."** Airflow/Dagster model work as a `(task, partition)` grid. A failure doesn't replay the whole DAG — it **backfills** the affected partitions idempotently, because each task is required to be idempotent and each run is content-addressed by `run_id`. deep-loop's current `runtime/locks-recovery` treats a stale/failing fan-out branch as a monolithic re-run. The transfer: give every iteration step a stable `(iteration, branch, step)` coordinate so a crashed branch can be re-executed in place while completed sibling artifacts are read by reference — never recomputed.

2. **runtime/locks-recovery — Pools/Semaphores are the named-concurrency primitive.** Airflow **Pools** cap concurrent instances of tagged tasks — a named semaphore per expensive resource (model API, search quota). Dagster has the equivalent "concurrency keys." This is the exact, field-tested answer to "don't fan out 500 parallel LLM calls," and it's *named per-resource* rather than scattered through call sites. deep-loop should adopt a per-cost-center pool (e.g. `gpt-5`, `websearch`) so budget control and lock recovery share one mechanism.

3. **runtime/fan-out-fan-in — "sensor that releases its slot" beats polling.** Airflow/Dagster **sensors** gate on external state. Airflow's original `mode=poke` held a worker per sensor → pool exhaustion/deadlock; the fix was `mode=reschedule`, which yields the slot between pokes. Lesson for deep-loop's fan-in gate: a waiting reducer must release its budget/token hold, else the whole pool deadlocks waiting on the slowest branch. This is a concrete locks-recovery failure mode.

4. **runtime/fan-out-fan-in — Metaflow `foreach` is the cleanest fan-out/fan-in + the "don't pre-declare fan width" lesson.** Metaflow spawns N branches with an implicit reduce; Flyte **map tasks** emit a runtime-determined number of parallel sub-tasks scheduled by the control plane. Both produce immutable, content-addressed artifacts the reducer reads by reference, enabling cheap partial re-execution. deep-loop's fan-out currently needs pre-declared width; the transfer is to make fan width a *runtime* decision bounded by a pool, with each branch emitting a content-addressed artifact.

5. **Contradiction (retries):** Workflow engines treat indefinite retry as an **anti-pattern** — Airflow defaults `max_retries=3`, then the task is `failed` and the DAG *halts/pauses awaiting intervention*. This directly contradicts the agentic-loop optimism that "more iterations/retries → better." The DAG-scheduler evidence: blind retries amplify load storms without progress, and the correct move is fail-fast + bounded backfill, which maps onto deep-loop's `runtime/convergence` "contradiction: when NOT to loop" thread.

```json
{
  "new_repos": [
    {"name":"apache/airflow","url":"https://github.com/apache/airflow","stars":"~46100","what":"The canonical DAG scheduler; Pools (named semaphores), SensorOperators, backfills over (task,partition) grids, max_retries default of 3.","lesson":"Backfill = idempotent per-partition recovery (not monolithic replay); Pools = named per-resource concurrency gating; sensors must release their slot (reschedule mode) or the pool deadlocks.","maps_to":["runtime/locks-recovery","runtime/fan-out-fan-in","runtime/budget-cost"],"confidence":"high"},
    {"name":"dagster-io/dagster","url":"https://github.com/dagster-io/dagster","stars":"~15800","what":"Asset-centric orchestration; partition-based backfills as a first-class primitive, sensors, and per-task concurrency keys.","lesson":"Partition-keyed backfill over software-defined assets is the cleanest 'recover only the stale slice' model; concurrency keys generalize pools to per-resource semaphores.","maps_to":["runtime/locks-recovery","runtime/fan-out-fan-in","runtime/state-jsonl-checkpointing"],"confidence":"high"},
    {"name":"Netflix/metaflow","url":"https://github.com/Netflix/metaflow","stars":"~10200","what":"Netflix ML orchestration; foreach fan-out/fan-in with implicit reduce, per-step immutable artifact versioning, resume-from-any-step.","lesson":"Fan-out branches must emit content-addressed artifacts read by reference by the reducer, enabling cheap partial re-execution and resume without recomputing completed siblings.","maps_to":["runtime/fan-out-fan-in","runtime/state-jsonl-checkpointing","runtime/locks-recovery"],"confidence":"high"},
    {"name":"flyteorg/flyte","url":"https://github.com/flyteorg/flyte","stars":"~7100","what":"Kubernetes-native dynamic workflow engine; map tasks emit a runtime-determined fan width scheduled by the control plane.","lesson":"Fan width should be a runtime decision bounded by a pool, not pre-declared at compile time; the control plane (not the loop body) owns scheduling and retries.","maps_to":["runtime/fan-out-fan-in","runtime/budget-cost","runtime/locks-recovery"],"confidence":"high"},
    {"name":"spotify/luigi","url":"https://github.com/spotify/luigi","stars":"~18700","what":"Airflow's predecessor; target-based idempotency (a task re-runs only if its output target is absent) is the original 'do I need to recompute?' gate.","lesson":"Idempotency should be enforced by checking an output-target existence predicate, not by the caller remembering — a target-exists check is the cheapest dedup/locks gate.","maps_to":["runtime/dedup-novelty","runtime/locks-recovery"],"confidence":"med"}
  ],
  "insights": [
    {"insight":"Reframe recovery as 'partition backfill' over a (iteration, branch, step) coordinate grid: a crashed/stale branch re-executes in place while completed sibling artifacts are read by reference, never recomputed. Current deep-loop recovery replays too coarsely.","evidence":"apache/airflow backfill (run_id-keyed), dagster-io/dagster partition backfill","maps_to":["runtime/locks-recovery","runtime/state-jsonl-checkpointing"],"confidence":"high"},
    {"insight":"Adopt named per-resource concurrency pools (Airflow Pools / Dagster concurrency keys) so budget control and lock-recovery share ONE mechanism: each cost center (gpt-5, websearch, a critic-model) gets a named semaphore the scheduler enforces, instead of scattered rate-limit logic.","evidence":"apache/airflow Pools, dagster-io/dagster concurrency keys","maps_to":["runtime/locks-recovery","runtime/budget-cost"],"confidence":"high"},
    {"insight":"A waiting fan-in reducer must release its slot between checks (reschedule semantics); a polling gate that holds its token/budget while waiting on the slowest branch is a documented deadlock pattern. deep-loop's fan-in gate should be a sensor, not a busy waiter.","evidence":"apache/airflow sensor mode=poke deadlock footgun resolved by mode=reschedule","maps_to":["runtime/fan-out-fan-in","runtime/locks-recovery"],"confidence":"high"},
    {"insight":"Field-tested DAG engines treat indefinite retry as an anti-pattern (max_retries=3 then halt-for-intervention), contradicting agentic-loop optimism. deep-loop should pair each retryable branch with a max-retry cap and escalate to a backfill/abort decision rather than silently looping.","evidence":"apache/airflow default max_retries=3, fail-then-pause semantics","maps_to":["runtime/convergence","runtime/locks-recovery"],"confidence":"high"},
    {"insight":"Make fan-out width a runtime, pool-bounded decision whose branches emit content-addressed artifacts; the control plane (not the loop body) owns scheduling, retries, and merging. This decouples 'how many parallel research branches' from the loop logic itself.","evidence":"flyteorg/flyte map tasks, Netflix/metaflow foreach","maps_to":["runtime/fan-out-fan-in","runtime/budget-cost"],"confidence":"high"}
  ],
  "contradictions": [
    {"claim":"Agentic iterative loops assume more compute/retries eventually improves the result (convergence-by-accumulation).","counter":"Workflow engines empirically cap retries (Airflow max_retries=3) and halt the DAG for intervention rather than blindly retrying, because blind retries amplify load without progress.","evidence":"apache/airflow max_retries default; dagster-io/dagster failure semantics vs. reflection-loop 'keep looping' optimism already catalogued"},
    {"claim":"A fan-in/polling gate should just poll for completed sub-tasks.","counter":"A poll-hold gate exhausts the worker pool and deadlocks when there are more waiters than slots; the production-correct design reschedules (yields the slot) between pokes.","evidence":"apache/airflow sensor poke-vs-reschedule historical footgun and fix"}
  ],
  "next_angles": [
    "Stream-processing engines as loops (Flink, Kafka Streams, Spark Structured Streaming): unbounded iteration with watermarks, incremental/checkpointed state, and exactly-once guarantees — map to runtime/state-jsonl-checkpointing and runtime/convergence on time-decay.",
    "Distributed lock & coordination services (etcd, Zookeeper, Redis Redlock, foundationdb): concrete lock-lease, fencing-token, and session-tie semantics for runtime/locks-recovery under partial failure.",
    "CI/CD matrix + retry/backoff (GitHub Actions matrix, Buildkite retry plugins, CircleCI): cheap, ubiquitous fan-out with bounded retry budgets — a 'minimum viable loop engine' to contrast against deep-loop's richer state.",
    "Workflow-engine determinism / replay testing (Airflow unit tests, Dagster historical run replay, Flyte reproducibility/hydration): how engines certify that a backfilled run reproduces the original — feeds the open replay-fidelity benchmark thread."
  ],
  "notes": "Biggest gap closed: the entire DAG-scheduler lineage (Airflow/Luigi/Dagster/Metaflow/Flyte) was absent from the 171 despite this being the headline angle. Prefect was already covered, so excluded to avoid duplication; cadence/uber (Temporal's predecessor) excluded as redundant given Temporal coverage. Did not fetch per-repo docs for retry/backfill specifics (token budget) — the star counts, recency, and structural claims are high-confidence from the API; the *default max_retries=3* and *mode=reschedule fix* are well-established Airflow lore (confidence high on the pattern, med on the exact default value if it has changed across versions). Untouched adjacent gap: DolphinScheduler, Kedro, Tekton, Kubeflow Pipelines — defer to a CI/CD or K8s-native follow-up angle."
}
```


----- stderr -----
[0m
> build · glm-5.2
[0m
[0m% [0mWebFetch https://api.github.com/repos/apache/airflow
[0m% [0mWebFetch https://api.github.com/repos/flyteorg/flyte
[0m% [0mWebFetch https://api.github.com/repos/dagster-io/dagster
[0m% [0mWebFetch https://api.github.com/repos/Netflix/metaflow
[0m% [0mWebFetch https://api.github.com/repos/spotify/luigi
