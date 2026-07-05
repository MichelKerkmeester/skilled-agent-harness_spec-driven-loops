# Deep Review — Iteration 007

**Dimension**: correctness · **Scope**: deep_start-context-loop_{auto,confirm}.yaml
**Executor**: cli-opencode openai/gpt-5.5-fast --variant xhigh (read-only) · **Raw**: /tmp/dr-r7.out

## Findings (raw seat output, then R9 verdict)

- **CONFIRMED P1** `auto:171`/`confirm:162` — `--packet {spec_path}` unbound (only spec_folder exists). Fix: {spec_folder}.
- **CONFIRMED-MATERIAL P1** `auto:516`/`confirm:542` — registry/dashboard refresh never invokes `reduce-state.cjs`. The phase-002 reducer is unwired from the loop. (See review-report P1-1.)
- **REFUTED** `auto:202` {session_id}/{generation}, `auto:499` {NNN} — host-bound loop vars (deep-research identical).
- **REFUTED** `auto:391` model: opus — native seats are intentionally opus; by-model diversity is in the CLI pool (deep-research identical).
- **DOWNGRADED P2** `auto:177` {captured_owner_pid} — bound via on_acquire prose at auto:172.
- **DOWNGRADED P2** `auto:250` {relevance_gate}/{agreement_min}/{concurrency} — sourced from deep_context_config.json.
- **DOWNGRADED P2** `auto:367` iter-{current_iteration} subdirs — host mkdir -p on write; add explicit mkdir for parity.
- **UNVERIFIED P2** `confirm:601` — convergence STOP routes to gate_pre_synthesis; depends on whether that step hydrates its own metrics.
