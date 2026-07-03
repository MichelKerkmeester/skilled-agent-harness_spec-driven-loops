# Research Brief A8 — Prompt-pack templates, budgets, watchdogs vs GPT pacing

READ-ONLY RESEARCH TASK. No file writes are requested. Do not ask about spec
folders or documentation scope. Do not ask any questions; produce the analysis.

## Measured problem (packet 033)

GPT runs cluster at budget boundaries and die there: IMB-001-high produced the
correct candidate AND evaluator score but hit the 15-minute hard budget before
natural completion (baseline 14.0m, med 14.3m — all three legs within 60s of
the cap). Council cells stall past a 480s no-progress watchdog at both efforts.
Claude fits the same budgets. Either GPT needs different pacing contracts, or
the templates induce unnecessary work.

## Your task

Read (repo-root relative):
1. `.opencode/skills/deep-loop-workflows/deep-review/assets/prompt_pack_iteration.md.tmpl`
   — the per-iteration LEAF prompt: count mandated steps/outputs per iteration.
2. `.opencode/skills/deep-loop-workflows/deep-improvement/SKILL.md` — the Lane A
   loop steps (profile → score → candidate → score) an executor must complete
   in one autonomous run.
3. `.opencode/commands/deep/assets/deep_agent-improvement_auto.yaml` — what one
   `:auto` invocation demands end-to-end.

Diagnose: how much mandated work sits inside ONE dispatch/budget window; which
steps could checkpoint (write partial state that a resume continues) vs must
complete atomically; do the templates mandate any incremental "write as you go"
behavior that would (a) reset no-progress watchdogs and (b) let a budget-killed
run still count as partially complete? Would splitting one heavy autonomous
run into resumable sub-invocations (setup / work / synthesize) change the
budget math for a slower-paced executor? Identify pacing/checkpoint changes vs
plain budget increases, and when each is right.

## Output contract (strict)

Markdown, no preamble, no questions. Sections:

### FINDINGS — numbered, each citing `file:line`.

### PROPOSALS — numbered. Each: **Tag** (simplify|optimize|re-approach),
**Change**, **Expected effect** (cells IMB-001-high natural completion;
CXB-004/ACB-004/ACB-005 liveness), **Effort** (S|M|L), **Risk**.

3-6 findings, 3-5 proposals.
