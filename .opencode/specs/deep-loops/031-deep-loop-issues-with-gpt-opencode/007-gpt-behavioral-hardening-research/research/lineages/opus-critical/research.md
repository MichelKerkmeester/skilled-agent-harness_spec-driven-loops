# Research Synthesis: Critical Re-Review of GPT Behavioral Hardening Research (opus-critical)

Spec folder: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/007-gpt-behavioral-hardening-research`

Lineage artifact dir: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/007-gpt-behavioral-hardening-research/research/lineages/opus-critical`

Stop reason: `maxIterationsReached`. Iterations completed: 10/10. Questions answered: 10/10 (KQ-OPUS-1 through KQ-OPUS-10). Sibling lineage: `gpt-critical`. Prior critical lineage read as required input: `sonnet-critical` (10/10). First round: `glm-max`, `gpt-fast-high` (30/30 each).

> Operator-directed critical re-review round (`research-prompt.md` §9). Per §9.1 the operator has directly, personally experienced all four reported symptoms (GPT slow as `@orchestrate`, wrong sub-agent, stuck on pre-defined flows, overthinks/needs literal instructions) — CONFIRMED first-hand, not a hypothesis. This synthesis does not re-litigate whether the problem exists. Its distinct contribution is a **non-GPT (Opus) critical lens that verifies every load-bearing claim against source code — including adversarial re-check of the prior critical lineage's own most-confident claim.**

## 1. Executive Summary

The prior critical round (`sonnet-critical`) was strong and mostly holds — but its single most assertive, most-cited finding is **wrong**, and it is wrong in exactly the way this whole round exists to catch. `sonnet-critical` §5 claims the ai-council route-proof is a "code-traced… guaranteed" FAIL that makes the future benchmark's ai-council leg "uninterpretable." Reading the record **emitter** it never opened (`orchestrate-topic.cjs:310-313`), the `round_completed` record carries `mode:'council'`, which **matches** the validator's expectation exactly — so the validator **PASSES**. `sonnet-critical` traced the validator function and the YAML config but assumed the record's value from the emitter *header*; the record is a hardcoded `'council'`. This is the "trust the description, not the code" error the charter targets, committed by the correction round itself — the clearest possible demonstration of why a second, independent critical lens was worth running.

The real ai-council defect is subtler and still worth fixing: route-proof returns **green on a `target_agent:'deep-ai-council'` that names no real agent** (`deep-ai-council` is the *packet* name; the agent is `ai-council`) — a false-negative of the same class the enforcement plugin cannot catch. Everything else in `sonnet-critical` survives this lineage's independent re-verification: the phase-005 FAIL re-derivation, the KQ4 NDP violation, the Mode D smoking-gun, and the KQ9 "wait on FIX-5" verdict all confirm from source, several of them sharpened.

## 2. Confirmed / Sharpened / Overturned — vs prior round AND sonnet-critical

| Target claim | Source | opus-critical disposition |
|---|---|---|
| Phase 005 = 4×FAIL, not "inconclusive"; only the baseline arm of the FIX-5 trigger unmet | sonnet-critical | **CONFIRMED** |
| ai-council route-proof is a "code-traced guaranteed FAIL"; benchmark leg "uninterpretable" | sonnet-critical §5 | **OVERTURNED** |
| The real ai-council defect | new | **NEW** — naming false-negative on a non-existent target agent; live uncommitted; no record emitted in phase 005 |
| "orchestrate dispatches @deep and STOP" violates NDP | sonnet-critical | **CONFIRMED**; SHARPENED (origin = `glm-max/research.md:55`) |
| KQ4 fix = add a registry-resolution routing rule | sonnet-critical Deliverable 3 | **SHARPENED (smaller)** — 2 table rows + registry-resolve the existing field |
| Plugin fail-closed "unconfirmed from type surface" | sonnet-critical residual | **RESOLVED** — possible-by-throw, host-undetermined; + default-export build landmine |
| Mode D confirmed-in-one-instance | sonnet-critical §4 | **CONFIRMED**; SHARPENED (self-check is redundant → pure halt-risk) |
| Do not unpark FIX-5; negative gate | all prior lineages | **CONFIRMED**; SHARPENED (coverage argument, 3-model bias control) |

## 3. The Headline Overturn (KQ-OPUS-2 / KQ-OPUS-3)

`validateRouteProofRecord` (`post-dispatch-validate.ts:636-663`) compares the `round_completed` **JSONL record** against the YAML `route_proof`. The record is emitted by `orchestrate-topic.cjs`:

```js
// orchestrate-topic.cjs:310-313  (inside appendRoundCompletion, type:'round_completed')
mode: 'council', target_agent: 'deep-ai-council', agent_definition_loaded: true,
resolved_route: 'Resolved route: mode=council target_agent=deep-ai-council',
```

The validator expects (`deep_ai-council_auto.yaml:132-136`): `mode: council`, `target_agent: deep-ai-council`, `agent_definition_loaded: true`, identical `resolved_route`. All four fields are equal → the function returns `null` (PASS). sonnet-critical's premise `'ai-council' !== 'council'` is false; `record.mode` is `'council'`.

**The real defect** (KQ-OPUS-3): the record + validator agree with each other but both disagree with the source of truth — `mode-registry.json:66,71` (`workflowMode: ai-council`, `agent: ai-council`), `deep.md:43`, and the council's own emitted header (`orchestrate-topic.cjs:25`, `deep_ai-council_auto.yaml:116-118`: `mode=ai-council; target_agent=@ai-council`). `mode:'council'` is the `runtimeLoopType`, not the `workflowMode`; `target_agent:'deep-ai-council'` is the **packet** name (`mode-registry.json:69`), and no agent by that name exists. So route-proof certifies a record naming a non-existent agent — a false-negative that would give false confidence to the phase-010 benchmark's ai-council leg (if that leg reuses this validator). The header-vs-record contradiction is a **live, uncommitted** working-tree state (both blocks are `+` additions from the in-flight "155 alignment" work), so the fix must reconcile BOTH sides toward the registry at once.

## 4. KQ Answers (this lineage)

- **KQ2 mechanism / Mode D.** Confirmed from source: the Phase-0 `@GENERAL AGENT VERIFICATION` self-classification block (`commands/deep/research.md:44-71`) produced phase 005's research-mode failure (`verification-smoke.md:119`, `ERROR="General agent required"`). Sharpened: that self-check does no routing (routing is `deep.md`'s registry lookup), so for a literal model it is a halt-risk with no incremental value — replace it, don't merely tighten it.
- **KQ3 ai-council.** Do not convert to subagent-only (unchanged from all prior lineages; `deep.md:45`, `ai-council.md:53-58` preserve the depth-0 parallel path). Fix the route-proof naming (§3), corrected rationale.
- **KQ4 orchestrate.** Delegate mode-resolution to the registry, NDP-safely — dispatch the resolved LEAF directly at Depth 1, never `@deep` (`orchestrate.md:148`, `deep.md:4`). Minimal fix: add `@deep-context`/`@deep-review` rows to the Priority table (`:97-105`) and make the existing Deep Route field (`:207`) registry-resolved (§5, Deliverable 3).
- **KQ5 plugin.** Feasible, detection-only. Mechanism: `tool.execute.before` (`index.d.ts:235-241`) — rewrite `args` or throw; fail-closed only by throw, host-semantics must be smoke-tested. Default-export-only or the file silently drops its hooks (`README.md:28`). Executable hook under `.opencode/plugins/`; metadata may live in `system-skill-advisor`.
- **KQ9 FIX-5.** Wait; unpark only on the negative gate. New basis: FIX-5 addresses ≤1 of 4 confirmed symptoms and may worsen latency, so the cheaper prompt/routing layers have larger symptom coverage — "wait" is on-the-merits, and three non-GPT models converge (bias control).

## 5. Implementation-Ready Deliverables

1. **ai-council route-proof reconcile (CORRECTED rationale).** In BOTH `orchestrate-topic.cjs:310-313` and `deep_ai-council_auto.yaml:132-136`: `mode: council → ai-council`, `target_agent: deep-ai-council → ai-council` (or `@ai-council`), `resolved_route` → match the emitted header. Edit both sides together. Rationale: stop route-proof certifying a non-existent target agent (NOT "unblock a FAIL" — it already passes). Sequence before the phase-010 benchmark.
2. **Mode D deterministic gate.** Replace the Phase-0 self-classification block in all 8 `/deep:*` command files with a deterministic dispatch-context check; gate acceptance on the 4 runtime modes.
3. **orchestrate deep-routing (NDP-safe, minimal).** Add `@deep-context`/`@deep-review` rows to `orchestrate.md:97-105`; convert the Deep Route field (`:207`) to registry-resolved; dispatch the resolved LEAF at Depth 1; never dispatch `@deep`.
4. **KQ5 plugin build constraints.** Default-export-only entrypoint under `.opencode/plugins/` (reference `mk-goal.js`, `.__test` surface); `tool.execute.before` inspecting/rewriting Task `args`; smoke-test throw-to-block on the installed OpenCode version; detection-only.
5. **Sequencing.** D1 (zero-risk) + D2 (confirmed-fired failure) first → D3 → D4 plugin → phase-010 external smoke + benchmark → KQ9 negative-gate decision.

## 6. Adversarial Self-Check (iteration 9)

Applied symmetrically to this lineage's own claims. The headline overturn survives (the record's `mode` is a hardcoded literal `'council'`, not config-dependent), downgraded to "passes by static trace" (no runnable end-to-end harness this session — very low residual given literal string equality). The Phase-0 "pure downside" claim downgraded to "no incremental value + halt risk" (via a direct-command-invocation path the self-check is the sole role-assertion). The ai-council mis-certification is conditional on the phase-010 benchmark reusing the current validator. No proposed fix changed.

## 7. Residual Risks Carried Forward

- **ai-council fix is two-sided and live-uncommitted** — a one-sided edit converts a passing-but-wrong state into a real FAIL; land emitter + validator together.
- **Plugin fail-closed semantics** — `throw`-to-block behavior is host-dependent; must be smoke-tested before relied upon.
- **Static-trace caveat** — the validator-PASS conclusion is a code trace, not an observed run (no GPT/OpenCode harness this session).
- **Gate runnability** — the phase-010 external smoke still needs a genuine non-OpenCode / `OPENCODE_PID`-free shell (carried from prior lineages, unchanged).
- **Mode D magnitude** — only the research-mode instance is confirmed-fired; cross-mode magnitude remains for the KQ6 benchmark.
- Mis-route taxonomy (A/B/C) and FIX-1…FIX-5 ranking remain operator-asserted axioms, out of this round's scope.

## 8. Convergence Report

- Stop reason: `maxIterationsReached` (stop policy = max-iterations; 10 of 10). Convergence signals treated as telemetry only throughout, per charter §9.4.
- Iterations completed: 10 of 10. Questions answered: 10/10 (KQ-OPUS-1 … KQ-OPUS-10), each grounded in re-read `file:line` evidence.
- newInfoRatio trend: `0.80 → 0.92 → 0.85 → 0.60 → 0.55 → 0.70 → 0.45 → 0.40 → 0.30 → 0.15` (average 0.572). Peak at iter 2 (the overturn).
- No stuck recovery, no blocked stops, no salvaged iterations. Self-adversarial pass at iter 9.

## 9. References

- `research/research.md` (consolidated prior round); `research/lineages/glm-max/research.md`, `research/lineages/gpt-fast-high/research.md`, `research/lineages/sonnet-critical/research.md`
- `research-prompt.md` §9 (this round's charter)
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:25-32,306-320`
- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:112-140`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:619-666`
- `.opencode/skills/deep-loop-workflows/mode-registry.json:64-80`
- `.opencode/agents/deep.md:4,22,43,56,63-79`; `.opencode/agents/orchestrate.md:4,42-47,97-105,148,184-188,204-217`; `.opencode/agents/ai-council.md:4,53-58`
- `.opencode/commands/deep/research.md:19-72`
- `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:235-271`; `.opencode/plugins/README.md:28,48-50`
- `005-gpt-verification-smoke/verification-smoke.md:117-124`; `006-host-hard-identity-fix5/decision-record.md:11-38`

---

*Synthesis by the opus-critical fan-out lineage (cli-claude-code / claude-opus-4-8 / reasoning high) from 10 fresh-context iterations, stop policy max-iterations per operator-directed charter §9.4. Sibling lineage: gpt-critical. Iteration narratives in `iterations/`; structured deltas in `deltas/`; state log in `deep-research-state.jsonl`.*
