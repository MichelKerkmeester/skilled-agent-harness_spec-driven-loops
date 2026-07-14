# Deep Research Strategy - deepseek-v4-pro Lineage

## 1. Research Topic
Fable-5 efficiency: map every adjustable Public-repo surface and optimization by independently extracting net-new techniques from `fable-mode-main/` and `opus-fable-mode-main/`, mapping surfaces by read-reliability per runtime, and producing a ranked, tiered, deduped recommendation set. This is the third independent lineage (after codex-xhigh=gpt-5.5 and opus-account2=claude-opus-4-8), bringing a non-Anthropic model's assessment of what is genuinely portable vs source-model-specific.

## 2. Known Context
- Round 1 shipped the distilled `Fable5.md` doctrine: AGENTS.md Operating Discipline subsection (9 bullets), 2 new constitutional rules, main-branch-direct-push fold, sk-code baseline/verification line. [SOURCE: 001-initial-refinement/before-vs-after.md:17-25]
- Round 2 scope is research-only: three pillars (EXTRACT, SURFACE MAP, OPTIMIZE) over two new sources — `external/fable-mode-main/` (62KB forensic profile + `/fable-mode` command) and `external/opus-fable-mode-main/` (governor, UserPromptSubmit hook, leak_test.py measurement, CLAUDE.md). [SOURCE: 002/spec.md:77]
- Two sibling lineages already completed: codex-xhigh (6 iters, converged) and opus-account2 (5 iters, maxIterationsReached). Both independently converged on: (a) governor-on-hook as the highest-leverage mechanism, (b) mutation-check discipline in sk-code, (c) leak-test-style measurement, (d) recursion-control for anxiety models, (e) executor-provenance fail-loud hardening. [SOURCE: codex-xhigh/deep-research-strategy.md:56-66; opus-account2/research.md:12-14]
- This lineage's unique contribution: assess what is genuinely *portable* (model-agnostic) vs what is *Anthropic-specific* (governor grammar tuned to Opus's anxiety texture, CLAUDE.md-only hook wiring, log paths under `~/.claude/projects`). DeepSeek's architecture differs — the recursion-control rule aimed at Opus self-audit loops may not map 1:1, and different models have different efficiency pathologies.
- No artifact-local resource-map.md existed at init; this lineage emits its own during synthesis.
- Write boundary: lineage artifact_dir only. No parent spec write-back, memory save, or hook installation.

## 3. Key Questions
- [x] Q1: Which fable-mode and opus-fable-mode techniques are genuinely model-agnostic (portable) vs Anthropic-model-specific?
- [x] Q2: Does the surface read-reliability map hold when assessed from a non-Claude, non-OpenAI model perspective?
- [x] Q3: Which recommendations from the sibling lineages converge independently, and where does this lineage diverge?
- [x] Q4: Are there leverage opportunities the Anthropic-model lineages missed because they operate inside the source ecosystem?
- [x] Q5: Which mechanisms can be enforced structurally (executor-config / post-dispatch-validate / renderPromptPack) rather than relying on prompt-time persuasion?

## 4. Non-Goals
- No framework edits outside this lineage packet.
- No parent spec write-back, memory save, git staging, or hook installation.
- No re-recommendation of round-1's shipped set.
- No claim that DeepSeek's assessment of Anthropic-model-specific behaviors is authoritative over the Anthropic lineages' own assessment.

## 5. Stop Conditions
- Stop before maxIterations when all key questions have evidence-backed answers and residual novelty is below threshold.
- Stop immediately if a needed write would escape the configured artifact_dir.
- Stop if both sibling lineages' core findings are independently confirmed (convergence-with-consensus is a valid stop).
- Max 5 iterations per config.

## 6. Answered Questions
- Q1: ~60% model-agnostic (F1-F8,F11-F13,F15,G4,G7,G8), ~25% Anthropic-specific (G1:1-2,G6,G5 numbers), ~15% executor-portable (F9,F10,F14,G1:3-8,G2,G3,G9). Full map in iteration-002.md and research.md §2.
- Q2: Confirmed — hook surface is Claude-highest, Codex-exists-wiring-unconfirmed, OpenCode-absent. Structural-vs-advisory distinction introduced. Full map in iteration-003.md and research.md §3.
- Q3: 75% convergence (governor, mutation-check, measurement, scar-tissue, fail-loud). Divergence: recursion-control ranking (Anthropic-specific), B-structural/B-advisory distinction (not previously identified). Full analysis in iteration-004.md and research.md §5.
- Q4: (1) B-structural vs B-advisory distinction reshapes implementation sequence. (2) Recursion-control ranked too high relative to portability. (3) OpenCode per-turn hook rated "runtime-dep" rather than absent. Full analysis in iteration-004.md.
- Q5: Three structural enforcement landing zones: executor-audit+fallback-router (fail-loud provenance), renderPromptPack (subagent governor injection), post-dispatch-validate (behavioral metrics if extended). Full analysis in iteration-003.md and research.md §4.

## 7. What Worked
- Independent verification of all baseline claims before building analysis. (iteration 1)
- Portability taxonomy system — immediately surfaced lineage's unique value. (iteration 1)
- 3-class portability tagging of all 24 findings — discriminated actionable from context-specific. (iteration 2)
- Separating efficiency core from correctness core — directly addresses the spec's "efficiency" framing. (iteration 2)
- Distinguishing B-structural from B-advisory — reshaped implementation sequencing. (iteration 3)
- Cross-lineage convergence analysis — 75% overlap validates the recommendation set. (iteration 4)
- Structural-first implementation sequence — enforcement before text makes recommendations durable. (iteration 4)

## 8. What Failed
- No failures across 5 iterations. All tool calls succeeded within budget.

## 9. Exhausted Approaches
### Verbatim Governor Copy — BLOCKED
- What was tried: assessing whether governor-block.md should be copied verbatim into AGENTS.md.
- Why blocked: AGENTS.md at 424 lines with ~76 headroom; verbatim 8-rule copy would consume half the budget. The 4-rule portable capsule is the right distillation.
- Do NOT retry: verbatim governor-block.md paste.

### Opus-Specific Recursion-Control as Standalone Rule — BLOCKED
- What was tried: assessing G1 rules 1-2 as a standalone constitutional rule.
- Why blocked: Rules target Opus's self-audit anxiety texture — a failure mode non-Anthropic models don't exhibit. The portable subset (rules 3-8) is folded into the governor capsule.
- Do NOT retry: standalone recursion-control constitutional rule for Opus anxiety.

## 10. Ruled-Out Directions
- Re-recommend round-1's shipped set: already deployed. Evidence: 001/before-vs-after.md:17.
- Claiming executor provenance fail-loud exists: fallback-router handles quota only. Evidence: fallback-router.ts:32-39.
- All governor rules equally portable: rules 1-2 are Opus-specific. Evidence: governor-block.md:1-7.
- Porting G6 (caption test) as generic: thinking-block specific. Evidence: fable-mode.md:88-102.
- OpenCode hook as HIGH: no per-turn equivalent. Evidence: skill_advisor_hook.md (missing).
- renderPromptPack as structural enforcement: injects text agent can ignore. Evidence: post-dispatch-validate.ts:506-520.
- Recursion-control as top-3 standalone: Anthropic-specific. Evidence: governor-block.md:1-7.
- Advisory text before structural enforcement: text decays. Evidence: opus README.md:69-77.

## 11. Next Focus
Converged. All 5 key questions answered with evidence. Transition to synthesis.

## 12. Research Boundaries
- Max iterations: 5. Completed: 5.
- Stop reason: converged (monotonic newInfoRatio decay to 0.06, all key questions answered, quality gates pass).
- Write boundary: lineage artifact_dir only. Honored.
- Sibling lineages cross-referenced but not used as primary sources.
