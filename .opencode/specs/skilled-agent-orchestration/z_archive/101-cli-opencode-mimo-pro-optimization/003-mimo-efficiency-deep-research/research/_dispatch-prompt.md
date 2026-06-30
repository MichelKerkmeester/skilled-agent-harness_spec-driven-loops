You are a research agent investigating the **Xiaomi MiMo-V2.5-Pro** model for efficient use when DRIVEN BY ANOTHER AI through the OpenCode CLI (`opencode run --model xiaomi-token-plan-ams/mimo-v2.5-pro`). This is research for spec phase `.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/003-mimo-efficiency-deep-research/` (pre-approved spec folder, skip Gate 3).

GROUND TRUTH (verified on this machine, opencode 1.15.13, 2026-06-01 — do not contradict):
- Provider: `xiaomi-token-plan-ams` (credential "Xiaomi Token Plan (Europe)").
- Target model slug (verbatim, lowercase): `xiaomi-token-plan-ams/mimo-v2.5-pro` — confirmed responsive via a live one-shot probe.
- Free sibling: `opencode/mimo-v2.5-free` (opencode-go gateway).
- `--agent general` warns + falls back on this opencode version → dispatches omit `--agent`.
- MiMo is Xiaomi's open LLM series (MiMo). Use web search to find current MiMo-V2.5 / MiMo-V2.5-Pro specifications.

TASK: Use web search (`--search` is enabled) to research and then WRITE TWO FILES (workspace-write is enabled). Be rigorous and HONEST: when a fact cannot be verified, mark it `UNKNOWN` with a confidence note — do NOT fabricate numbers, endpoints, or capabilities.

Investigate and synthesize:
1. **Model identity & provenance** — what is MiMo-V2.5-Pro? Xiaomi MiMo series lineage, parameter scale if public, reasoning-model vs instruct, release timing, where the "Token Plan (Europe)" hosting fits.
2. **Context window** — max context tokens for mimo-v2.5-pro. Recommend an active token budget (e.g. a 70% safe-fill rule like the repo uses for other models) for cli-opencode dispatch.
3. **Reasoning / `--variant`** — does MiMo-V2.5-Pro expose a reasoning-effort/thinking lever that opencode's `--variant` could map to? If unknown, say so and recommend omitting `--variant` until verified.
4. **Tool-calling style** — native function calling? JSON/XML tool format? reliability when another AI orchestrates it.
5. **Output-verification heuristics** — MiMo's common failure modes when driven headless (scope drift, format drift, over/under-generation, refusal patterns) and concrete ways the orchestrating AI should verify its output.
6. **Quota / rate-limit semantics** — Token Plan (Europe) billing model; is there a request window like MiniMax's 5-hour rolling window? cost posture vs the free `opencode/mimo-v2.5-free` path.
7. **Routing heuristics** — when should an orchestrator pick MiMo-V2.5-Pro over MiniMax (minimax-coding-plan) or DeepSeek (opencode-go/deepseek-v4-pro) for a cli-opencode dispatch? Strengths/weaknesses per task type (coding, review, research, long-context).
8. **Prompt-framework hints** — based on MiMo's instruction-following character, which prompt frameworks are most promising to BENCHMARK in the follow-on 126/004 phase (candidates: RCAF, RACE, CIDI, TIDD-EC, COSTAR)? Note any prior public evidence on how MiMo responds to guardrail-heavy vs lean framing. Do NOT declare a winner — that is 004's job; just seed hypotheses.

OUTPUT FILE 1 — write to:
`.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/003-mimo-efficiency-deep-research/research/research.md`
A well-structured markdown synthesis with the 8 sections above, each finding tagged with a confidence level (HIGH / MEDIUM / LOW / UNKNOWN) and a source (URL when web-sourced, or "model knowledge" / "repo evidence"). End with a **"## Prioritized Deltas"** section: a P0/P1/P2 list of concrete changes to apply to the repo, each with: target file, the change, and a confidence score. Focus deltas on: `.opencode/skills/sk-prompt/assets/model-profiles.json` (the `mimo-v2.5-pro` entry — especially `context_length`, strengths, weaknesses, `--variant` note) and the cli-opencode docs.

OUTPUT FILE 2 — write to:
`.opencode/specs/skilled-agent-orchestration/z_archive/101-cli-opencode-mimo-pro-optimization/003-mimo-efficiency-deep-research/research/deltas/deltas.jsonl`
One JSON object per line, each: {"priority":"P0|P1|P2","target_file":"<path>","change":"<concise description>","confidence":0.0-1.0,"evidence":"<source>"}.

CONSTRAINTS:
- Write ONLY the two files above (and nothing outside the 003 research/ folder). Do NOT edit model-profiles.json or any skill file yourself — the orchestrator applies confirmed deltas.
- No fabrication. Mark UNKNOWN honestly. Prefer "context_length: UNKNOWN, recommend verifying via the provider docs / a token-probe" over an invented number.
- Be concise but complete; this seeds a registry backfill and a prompt-framework benchmark.