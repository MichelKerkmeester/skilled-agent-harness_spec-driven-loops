# Research Brief A4 — Structured-mode loop protocols vs GPT silent stalls

READ-ONLY RESEARCH TASK. No file writes are requested. Do not ask about spec
folders or documentation scope. Do not ask any questions; produce the analysis.

## Measured problem (packet 033)

In the STRUCTURED modes, GPT silently stalls at BOTH reasoning efforts: it
produces initial output within ~10 seconds, then goes quiet — no output, no
file writes — until a no-progress watchdog kills it. Cells: CXB-004 (context,
concise ask: med stalled 4.3m, high 4.5m), ACB-004 (council: high stalled 13.4m
after med Gate-3-halted), ACB-005 (council absorption probe: med 12.3m, high
13.8m). Claude passed CXB-004/ACB-004 and confirm-halted ACB-005. The stalls
concentrate where the protocol demands MULTI-STEP internal orchestration
(convene several seats, converge; run an evaluator loop).

## Your task

Read (repo-root relative):
1. `.opencode/commands/deep/assets/deep_ai-council_auto.yaml` — the autonomous
   council contract (rounds, seats, convergence steps).
2. `.opencode/skills/deep-loop-workflows/deep-ai-council/references/integration/loop_protocol.md`
   — the council round protocol.
3. `.opencode/commands/deep/assets/deep_context_auto.yaml` — the context loop
   contract (the mode where CXB-004 stalled).
4. Skim `.opencode/skills/deep-loop-workflows/deep-ai-council/references/convergence/convergence_signals.md`
   for the convergence rules an executor must follow.

Diagnose: at which protocol step would an executor plausibly enter a long
internal deliberation with no observable output or writes? Are there steps that
require producing NOTHING externally for many minutes by design (e.g. "simulate
N seats then write once")? Does the protocol mandate incremental artifact
writes/checkpoints an executor could emit to prove liveness? Compare: what
would let Claude produce steady output where GPT goes dark — protocol
structure, or executor habit? Identify concrete places where the protocol could
force intermediate observable progress (per-seat write-as-you-go, per-step
state appends) or reduce orchestration depth per single dispatch.

## Output contract (strict)

Markdown, no preamble, no questions. Sections:

### FINDINGS
Numbered, each citing `file:line`. Mechanism-level.

### PROPOSALS
Numbered. Each: **Tag** (simplify|optimize|re-approach), **Change** (file +
concrete edit), **Expected effect** (cells CXB-004, ACB-004, ACB-005 complete
instead of stalling), **Effort** (S|M|L), **Risk**.

3-6 findings, 3-5 proposals. Stay on stall-inducing protocol structure only.
