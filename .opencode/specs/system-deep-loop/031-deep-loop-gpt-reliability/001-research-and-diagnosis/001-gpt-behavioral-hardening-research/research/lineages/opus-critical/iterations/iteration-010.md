# Iteration 10 — Final consolidation: verdicts vs prior round AND sonnet-critical, implementation-ready deliverables

**Focus:** KQ-OPUS-10 — Produce the confirmed/sharpened/overturned table this lineage contributes to the cross-lineage merge, and the copy-pasteable deliverables.

## Verdict table (this lineage's dispositions)

| Target claim | Source | opus-critical disposition |
|---|---|---|
| Phase 005 = 4×FAIL, not "inconclusive"; only the baseline arm of the FIX-5 trigger is unmet | sonnet-critical iter 1 | **CONFIRMED** (independent re-read `verification-smoke.md:117-124`, `decision-record.md:22`) |
| ai-council route-proof is a "code-traced guaranteed FAIL"; benchmark ai-council leg "uninterpretable" | sonnet-critical §5 | **OVERTURNED** — record emitter (`orchestrate-topic.cjs:310-313`) writes `mode:'council'` == validator expectation → validator PASSES |
| The real ai-council defect | new | **NEW** — naming false-negative: route-proof passes green on `target_agent:'deep-ai-council'`, a packet name, not any real agent; live uncommitted; phase 005 never emitted the record |
| "orchestrate dispatches @deep and STOP" violates NDP | sonnet-critical KQ-CRIT-6 | **CONFIRMED** (`orchestrate.md:148` + `deep.md:4` both `mode:primary`); SHARPENED — unsafe phrasing originates at `glm-max/research.md:55`, not just the consolidation |
| KQ4 fix = add a registry-resolution routing rule to orchestrate | sonnet-critical Deliverable 3 | **SHARPENED (smaller)** — orchestrate already has the Deep Route field (`:207`) + agent paths (`:184-185`); minimal fix = add 2 Priority-table rows + make the field registry-resolved |
| Plugin fail-closed capability "unconfirmed from type surface" | sonnet-critical residual | **RESOLVED** — `Promise<void>` + mutable `args` → rewrite-or-throw; deny-verdict impossible; fail-closed = throw, host-semantics undetermined; + default-export build landmine (`README.md:28`) |
| Mode D confirmed-in-one-instance (Phase-0 self-check ↔ phase-005 failure) | sonnet-critical §4 | **CONFIRMED** + SHARPENED — the self-check is redundant with `deep.md` routing, so its net contribution to a literal model is halt-risk without incremental routing value |
| Do not unpark FIX-5 now; unpark only on negative gate | all prior lineages | **CONFIRMED** + SHARPENED — coverage argument: FIX-5 addresses ≤1 of 4 confirmed symptoms and may worsen latency; "wait" is on-the-merits, not evidence-deferral; three non-GPT models converge (bias control) |

## Implementation-ready deliverables

**Deliverable 1 — ai-council route-proof, reconcile to the registry (CORRECTED rationale vs sonnet-critical).**
In BOTH `orchestrate-topic.cjs:310-313` (the `round_completed` record) AND `deep_ai-council_auto.yaml:132-136` (the `route_proof` expectation), change `mode: council → ai-council`, `target_agent: deep-ai-council → ai-council` (or `@ai-council`, matching the convention route-proof echoes elsewhere), and `resolved_route` to match the emitted header (`orchestrate-topic.cjs:25`). Edit both sides together (they currently agree with each other, so a one-sided edit creates a real FAIL). Rationale is NOT "unblock a guaranteed FAIL" (the validator already passes) — it is "stop route-proof from certifying a `target_agent` that names no real agent." Zero-behavior-risk value change; sequence before phase 010's benchmark so the ai-council leg attests to the real agent.

**Deliverable 2 — Mode D deterministic gate.** Replace the Phase-0 `@GENERAL AGENT VERIFICATION` self-classification block (`commands/deep/research.md:44-71` and the identical block in the other 7 `/deep:*` command files) with a deterministic dispatch-context check (was this file invoked directly as a command vs. handed to a sub-agent via Task delegation?) rather than a fuzzy "Are you operating as the @general agent? … IF UNCERTAIN: HARD BLOCK." Gate acceptance on the 4 runtime modes; apply identically to all 8.

**Deliverable 3 — orchestrate deep-routing (NDP-safe, minimal).** In `orchestrate.md`: (a) add `@deep-context` and `@deep-review` rows to the Priority table (`:97-105`), LEAF / `subagent_type "general"`, mirroring the `@deep-research`/`@ai-council` rows; (b) convert the Deep Route field (`:207`) from a fill-in template into "resolve mode/target_agent/execution/artifact_root from `mode-registry.json`; do not infer from the Priority table," dispatching the resolved LEAF directly at Depth 1. Never dispatch `@deep` (NDP: `Orch(0)→@deep(1)→@leaf(2)` is illegal, `orchestrate.md:148`).

**Deliverable 4 — KQ5 enforcement plugin build constraints.** Author as a default-export-only entrypoint under `.opencode/plugins/` (reference `mk-goal.js`); test surface hung off the default (`.__test`); metadata may live in `system-skill-advisor`. Hook: `tool.execute.before`, inspecting/rewriting Task `args` (the Deep Route header); fail-closed only by throwing, and smoke-test the throw's host behavior on the installed OpenCode version before relying on it. Detection-only — cannot bind hard identity (`subagent_type` is normalized to `"general"`).

**Deliverable 5 — Sequencing.** Land Deliverable 1 (zero-risk value change) and Deliverable 2 (targets a confirmed-fired failure) first; then Deliverable 3; then the plugin (D4); then phase 010's external smoke + benchmark; then the KQ9 negative-gate decision.

## Status

`complete` — verdict table + 5 deliverables ready for the cross-lineage merge.

newInfoRatio: 0.15 — novelty: consolidation; the one genuinely new artifact is the corrected ai-council rationale (Deliverable 1) that supersedes sonnet-critical's "guaranteed FAIL" justification.
