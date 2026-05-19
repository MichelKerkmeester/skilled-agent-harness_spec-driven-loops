# Iteration 020 - Verdict robustness and amplifications [PASS-2]

## Pass 1 claim under attack
- Pass 1 final verdict: CONTINGENT. Attack whether Pass 2 should flip to FRAGILE or ROBUST.

## Hypotheses going in
- H1: Verdict flips to ROBUST if Pass 2 falsifies most high risks and the concrete repros are low impact.
- H2: Verdict flips to FRAGILE if Pass 2 finds current-default correctness failures or severe unbounded behavior under common use.
- H3: Verdict remains CONTINGENT if current default still works on the fixture but future/model/operator pressure is under-instrumented.

## Evidence gathered
- Pass 1 evidence still stands: `172 passed`, default benchmark `14/18`, current verdict CONTINGENT.
- Iteration 011: schema-lock immediate blast radius narrowed to `2/8` non-768 registered embedders, but active schema remains `float[768]`.
- Iteration 012: license risk narrowed to default UX; commercial-safe Apache rerankers exist.
- Iteration 014: RRF is flat across perturbations, but new architecture-invariant probes missed core files.
- Iteration 015: valid path-filtered CLI payload took `21.59s`.
- Iteration 017: local fork is based on upstream `0.2.3`, while upstream `cocoindex-code` is at `0.2.33` and core `cocoindex` at `1.0.6`.
- Iteration 019: migration ROI favors 023E/023C/023F before heavy 023A.

## Pass-1 attack outcome
- [STRENGTHENED]: CONTINGENT remains the right verdict. Pass 2 falsified overbroad claims, but also found a concrete >10s search repro and a major upstream drift blind spot. ROBUST is too strong; FRAGILE is too strong because current default quality still has green tests and a 14/18 fixture result.

## Findings (severity-tagged)
- **FINDING-020-A** [severity: HIGH-LATENT-RISK] [Pass-1 relation: ORTHOGONAL]:
  - **What**: Verdict flips to FRAGILE if two signals appear together: (1) upstream rebase shows local fork is missing security/correctness fixes, and (2) default path-filtered searches breach request budgets under normal IDE/MCP usage.
  - **Why Pass 1 / deep-review missed this**: Pass 1 did not combine upstream currency with runtime cost behavior.
  - **Evidence**: Iteration 015 timing output; iteration 017 GitHub API output; `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:9-13`, `:29`.
  - **What to do**: Monitor upstream delta, query p95/p99, and timeout/error count before declaring robust.

- **FINDING-020-B** [severity: MEDIUM-OPPORTUNITY] [Pass-1 relation: STRENGTHENS-#4]:
  - **What**: Verdict flips to ROBUST only with measurable evidence: 3-run benchmark confirmation, expanded architecture-invariant fixture, p95 under budget for adversarial valid inputs, license manifest, and daemon/index metadata status.
  - **Why Pass 1 / deep-review missed this**: It gave a qualitative verdict but not flip thresholds.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:25-27`, `:91-100`; iterations 013-015.
  - **What to do**: Define a release gate: hit rate >= 14/18 on old fixture, >= target on expanded fixture, p95 search < 10s for bounded valid payloads, zero silent rerank fallback in smoke tests.

- **FINDING-020-C** [severity: HIGH-LATENT-RISK] [Pass-1 relation: STRENGTHENS-#5]:
  - **What**: New amplification: request-cost bug plus weak observability. A query can take 21.59s, and current status/log fields do not expose enough candidate/fanout counters to diagnose why.
  - **Why Pass 1 / deep-review missed this**: It had the code-level suspicion but no wall-clock repro and no verdict-flip model.
  - **Evidence**: Iteration 015 timing output; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/observability.py:61-85`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:112-140`.
  - **What to do**: Pair 023E clamps with 023C telemetry.

- **FINDING-020-D** [severity: MEDIUM-OPPORTUNITY] [Pass-1 relation: STRENGTHENS-#1]:
  - **What**: New amplification: upstream drift plus local schema/prompt design. Designing 023A without upstream import could harden the wrong abstraction.
  - **Why Pass 1 / deep-review missed this**: It framed future-proofing as local architecture only.
  - **Evidence**: Iteration 017 upstream output; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py:35-60`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:22-27`.
  - **What to do**: Insert 023F rebase/import spike before 023A heavy implementation.

## Hypotheses that FAILED falsification (valuable!)
- "Pass 1 should flip to ROBUST because several claims were narrowed" failed: path-cost and upstream-drift evidence keep risk alive.
- "Pass 1 should flip to FRAGILE because Pass 2 found new risks" failed: current tests/benchmark still support the default under known fixture.

## Updates to research-pass-2.md
- Added verdict-flip scenarios, monitor signals, and final combined packet order.

## NO-EARLY-STOP confirmation
- Iteration 20 reached exactly. No convergence-stop was used.

