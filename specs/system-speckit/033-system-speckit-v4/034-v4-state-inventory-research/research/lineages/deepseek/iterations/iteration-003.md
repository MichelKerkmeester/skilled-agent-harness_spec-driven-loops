# Iteration 3: Angle 3 — SYSTEM-DEEP-LOOP

## Focus
Inventory system-deep-loop's shipped surface: modes and command files, executor kinds and model allowlists in executor-config.ts, fan-out controls, convergence stop policy, and the ledger/reducer runtime; verify the draft's deep-loop section claims.

## INVENTORY

| Surface | Value | SOURCE |
|---|---|---|
| Modes (mode-registry.json) | 6: research (lexical), review (lexical), ai-council (lexical), agent-improvement (alias-fold), model-benchmark (command-bridge), skill-benchmark (command-bridge) | mode-registry.json:32-172 |
| /deep:* command files | 6: research, review, ai-council, agent-improvement, model-benchmark, skill-benchmark | .opencode/commands/deep/ ls |
| Ledger modes (append gateway) | 7 canonical: deep-research, deep-review, deep-ai-council, agent-improvement, model-benchmark, skill-benchmark, deep-improvement-common (improvement/deep-improvement aliases fold in) | runtime/scripts/append-mode-event.cjs:94-105 |
| Ledger schemas | 8 dirs under runtime/lib/: agent-improvement, authorized-ledger, deep-ai-council, deep-improvement-common, deep-research, deep-review, model-benchmark, skill-benchmark — NO alignment schema | runtime/lib/ ls |
| Executor kinds | native + 6 CLI kinds; cli-claude-code is reserved in schema but NOT wired (ExecutorNotWiredError: "reserved in the schema but not yet wired") | executor-config.ts:59,400-405 |
| PI_SUPPORTED_MODELS | Enforced allowlist incl. deepseek-v4-flash-vision-exp, glm-5.3-flash, ...; PI_DEFAULT_MODEL = deepseek-v4-flash-vision-exp | executor-config.ts:182-214 |
| CURSOR_SUPPORTED_MODELS | Enforced allowlist: composer-2.5 (default), composer-2.5-fast, gpt-5.6-luna-max(-fast), gemini-3.8-flash-high, Grok 4.5/4.6 tiers, ...; `auto` deliberately excluded | executor-config.ts:292-318 |
| DEVIN_SUPPORTED_MODELS | deepseek-v4-flash-max, glm-5-2, gpt-5-6-luna-max(-priority), swe-1-7-medium, ...; DEVIN_DEFAULT_MODEL = 'swe' | executor-config.ts:362-383 |
| Fan-out config | fanoutManifestSchema {models ≤MAX, branches, replicas}; concurrency max 8 default 2; assignment_model flat_pool; stopPolicy REJECTED inside fan-out config (z.never) — a caller believing stopPolicy was pinned would get a loud refusal | executor-config.ts:676-714 |
| Write containment per kind | codex/cursor: real OS --sandbox flags; cli-devin: --permission-mode + post-hoc write-containment guard (no OS boundary); cli-pi: restricted tool allowlist | executor-config.ts:108-125 |
| Convergence stop policy | stopReason enum: converged, maxIterationsReached, userPaused, blockedStop, stuckRecovery, error; legacy max_iterations_reached → maxIterationsReached | deep-research/references/convergence/convergence.md:78-98 |
| Loop leaves | deep-research/, deep-review/, deep-ai-council/, deep-improvement/ (each with SKILL.md, references, routing-allowlist.json) | system-deep-loop/ ls |

## DRIFT

| Draft line | Claim | Verdict | Actual state | Severity | Correction | SOURCE |
|---|---|---|---|---|---|---|
| "joined by a new alignment (conformance-audit) mode" | deep-alignment mode ships | FALSE | No alignment mode in mode-registry, no alignment command, no alignment ledger schema, zero alignment/conformance hits in the skill tree | P0 | Draft names a mode that does not exist on the branch | mode-registry.json:32-172; rg alignment (0 hits) |
| "Working adapters already cover sk-doc, sk-git, sk-design (static) and sk-code" (alignment) | Conformance adapters ship | FALSE | No alignment/conformance surface exists to carry adapters | P0 | Same as above | rg alignment (0 hits) |
| "A loop dispatches native (Opus) or any of the six external CLIs — ... cli-claude-code" | cli-claude-code is a dispatchable executor | FALSE | Kind is reserved in the schema but throws ExecutorNotWiredError; no adapter wired | P1 | Five wired CLI executors; cli-claude-code is reserved-only | executor-config.ts:400-405 |
| "all eight modes — research, review, ai-council, agent-improvement, model-benchmark, skill-benchmark, alignment, and deep-improvement-common — are now on new_authoritative_final" | Eight ledger modes incl. alignment | STALE | Seven ledger modes (alignment absent); deep-improvement-common present as improvement alias | P1 | Seven modes are ledger-authoritative, not eight | append-mode-event.cjs:94-105; runtime/lib/ ls |
| "the five modes ... behave exactly as before, now joined by a new alignment mode" | Five prior modes + alignment | STALE | Six registry modes; alignment never joined; improvement is a leaf, not a registry mode | P1 | Six registry modes, no alignment | mode-registry.json |
| "deep-loop-workflows and deep-loop-runtime skill identities no longer exist" | Old identities gone | TRUE | No deep-loop-workflows/ or deep-loop-runtime/ dirs under .opencode/skills | — | Confirmed | skills ls |
| "deep router agent ... retired ... no router agent left" | No deep router agent | TRUE | 12 agents; none named deep, deep-loop or deep-router | — | Confirmed | .opencode/agents/ ls |
| "DeepSeek V4 Flash on the roster" (Pi) | DeepSeek V4 Flash on Pi roster | TRUE | PI_SUPPORTED_MODELS includes DeepSeek V4 Flash literals; default is deepseek-v4-flash-vision-exp | — | Confirmed | executor-config.ts:182-214 |
| "a fan-out can run several at once ... capped concurrency pool" | Fan-out parallel lineages | TRUE | fanoutConfigSchema: concurrency max 8, per-lineage model/branch/replica manifests | — | Confirmed | executor-config.ts:676-714 |
| "stopPolicy ... max-iterations" (runner config) | Fan-out runs to iteration cap | TRUE | Fan-out config rejects embedded stopPolicy; maxIterationsReached is the cap stop reason | — | Confirmed | executor-config.ts:691; convergence.md:83 |

## Sources Consulted
- .opencode/skills/system-deep-loop/mode-registry.json, runtime/scripts/append-mode-event.cjs, runtime/lib/ ls, runtime/lib/deep-loop/executor-config.ts (grep + sed)
- deep-research/references/convergence/convergence.md
- .opencode/commands/deep/, .opencode/agents/

## Assessment
- **newInfoRatio**: 1.0 — allowlists, ledger modes and fan-out controls are first-time rows.
- **Confidence**: Confirmed (files opened/grepped directly).

## Reflection
- Worked: grep of executor-config.ts surfaces allowlists and fan-out schema fast.
- Failed: nothing failed.
- Ruled out: reading full ledger schemas — gateway normalization + lib ls suffices for the mode roster.

## Recommended Next Focus
Angle 4: SYSTEM-SKILL-ADVISOR — daemon, CLI front door under .opencode/bin, scorer thresholds, graph metadata, hook brief, state containment, MCP tool ids.
