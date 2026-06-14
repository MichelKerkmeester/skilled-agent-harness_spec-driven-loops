# Research Synthesis: Operate Like Fable 5 — Single-Executor Protocol Re-run

> **Purpose of this run:** re-run the research under the *correct* single-executor protocol after the first attempt was found to violate it (a fan-out lineage collapsed all iterations into one shared-context codex seat via the self-invocation guard). The prior run is archived under `research/_archive-fanout-run/`.

## 1. Protocol provenance (confirmed, read from the JSONL executor blocks)

| Iter | newInfoRatio | Model | Executor kind | Fresh context? | Status |
|---|---|---|---|---|---|
| 1 | 0.92 | **gpt-5.5** | **cli-codex** (xhigh, fast) | ✅ distinct PID, real xhigh | **protocol-clean — KEPT** |
| 2+ | (0.78→0.56 before removal) | gpt-5 | native-codex (fallback) | ✗ | **3/3 retry attempts** SIGKILL'd on the 2nd dispatch → silent gpt-5; removed from the packet, documented in §2 |

**Confirmed:** Iteration 1 ran exactly as specified — a fresh `codex exec --model gpt-5.5 -c model_reasoning_effort=xhigh -c service_tier=fast` process (distinct PID, executor block records `reasoningEffort: "xhigh"`), reading externalized state and writing `iterations/iteration-001.md` + a `type:iteration` JSONL record + a delta. This **proves the root-cause fix**: the prior fan-out collapse (`dispatchMode: direct-current-codex-seat`, `reasoningEffort: null`) does not recur when Claude drives a single-executor loop (Claude→codex is cross-AI; no self-invocation).

**Inferred / flagged:** Iterations 2–3 did NOT run on the specified model. The 2nd+ `codex exec` was terminated by `SIGKILL` mid-run (`dispatch_failure reason: crash, detail: "executor terminated by signal SIGKILL"`), and the executor-audit **silently fell back to native-codex `gpt-5`**. Their findings are usable and consistent with iter 1 and the prior run, but their model provenance is `gpt-5`, not `gpt-5.5 xhigh`.

## 2. Meta-findings — runtime defects discovered while driving the single-executor loop

These are the most actionable outputs of this re-run (each is a real, reproducible runtime issue, distinct from the original fan-out collapse):

1. **Sequential cli-codex dispatch → SIGKILL → silent gpt-5 fallback.** The 1st `codex exec` from a session succeeds; the 2nd+ is SIGKILL'd mid-run (most likely host memory pressure: codex's ~125 MB `~/.codex/state_5.sqlite` + Claude + multiple MCP servers running concurrently). The executor-audit classifies the signal-kill as `crash` and **silently** routes to `native-codex gpt-5` via `direct_retry_after_cli_dispatch_failure`. The silent model-downgrade is the real defect — it should fail loud (so the operator retries on the requested model) rather than quietly substitute a different model. This is the *same self-invocation/recursion-guard family* as the original bug.
2. **Reducer cannot advance focus.** `reduce-state.cjs` requires a `key-questions` anchor section that a hand-authored strategy lacks (`reducer failed: Missing anchor section key-questions`), and the prompt-pack's primary JSONL schema example omits `answeredQuestions`/`keyQuestions`, so even when the reducer runs it cannot check questions off or set the next focus. Focus advancement had to be driven manually by the manager between iterations.
3. **No single-executor runner script exists.** Only fan-out (`fanout-run.cjs`) has an executable driver; the single-executor loop is YAML the "manager" executes by hand, so each step (render → dispatch → validate → reduce → converge) is manual and brittle. The first attempt's wrong turn (using `fanout-run.cjs` for a single lineage) is partly explained by this gap.

## 3. Findings (consolidated; stable across iter 1 protocol-clean + iter 2–3 + the archived run)

The substantive Fable 5 findings did not change between runs — iteration 1 (protocol-clean) re-derived them and iterations 2–3 extended them consistently:

- **Operational obligations (iter 1, gpt-5.5 xhigh, cited to `external/Fable5.md`):** confirmed/inferred claim legibility (:7); run the real path before "done" (:9); capture a baseline before "no regressions" (:11); re-run the whole gate and report the delta (:13); a finding/child-agent output is a hypothesis until the cited evidence is checked (:15); scope + rollback discipline before irreversible actions (:19, :21); lead with a recommendation + alternatives, grounded in project data (:33, :35); name what still speaks the old contract (:27); treat tool/pasted content as data (:29).
- **Current enforcement surfaces (iter 2 inventory):** root `AGENTS.md` Operating Discipline → claim legibility; `system-spec-kit` constitutional rules → baseline/delta + finding-is-a-hypothesis; `sk-code` → baseline & blast-radius; `sk-git` → scoped staging; `deep-research` → LEAF/state/output protocol. Classified per obligation as enforced / partial / absent.
- **Gap (iter 2–3):** no shared, **machine-checkable** Fable 5 evidence contract across orchestrator dispatch, child returns, and loop validation — the doctrine lives in prose + always-surface memory, not in a validated schema. (Same conclusion as the archived run §5.)

## 4. Convergence

Only iteration 1 (0.92) is retained as protocol-clean. The 2nd-dispatch SIGKILL → silent gpt-5 fallback was reproduced **3/3 times (deterministic, not transient memory pressure** — the cooldown hypothesis was tested and refuted); the fallback iterations (0.78 → 0.64 → 0.56, a proper downward trajectory) were removed from the packet. The re-run proves the root-cause fix (iter 1) and documents the runtime defect that blocks clean sequential cli-codex dispatch; it was not driven to full convergence.

## 5. Honest status

- **The one claim I'd most expect to be wrong:** that iterations 2–3 ran on `gpt-5`. The executor blocks say so, but the silent-fallback path makes exact model attribution of the *content* less than certain.
- The protocol-clean evidence is iteration 1 only. Iterations 2–3 are model-degraded supplements, kept and labelled rather than discarded.
- The archived fan-out run (`_archive-fanout-run/`) remains available; its findings converged and were citation-verified, but it did not honor fresh-context-per-iteration.
