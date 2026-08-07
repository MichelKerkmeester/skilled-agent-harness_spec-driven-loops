---
title: Deep Research Strategy - GPT Behavioral Hardening (opus-critical lineage) - SYNTHESIZED
importance_tier: important
contextType: planning
version: 1.14.0.0
---

# Deep Research Strategy — GPT Behavioral Hardening Critical Re-Review (opus-critical lineage) — SYNTHESIZED

> Reducer-refreshed after 10 iterations. Status: complete (synthesized). Fresh lineage for the operator-directed critical re-review round (`research-prompt.md` §9). Sibling lineage: `gpt-critical`. Prior critical lineage on disk and read as required input: `sonnet-critical` (10/10, clean). Stop policy: `max-iterations` (10) — convergence signals throughout were treated as telemetry only, per charter §9.4.

## 1. TOPIC

Critical re-review of GPT behavioral hardening research (packet 031) — operator-confirmed symptoms, correct for GPT-self-assessment bias, find concrete fixes. See `research-prompt.md` §9 and §1 Known Context below.

### Known Context (from init)

- Operator ground truth (CONFIRMED first-hand, 2026-07-01, `research-prompt.md` §9.1): GPT is slow as `@orchestrate`, invokes the wrong sub-agent, gets stuck on pre-defined flows, and overthinks/needs literal instructions. This round does NOT re-litigate whether the problem exists.
- Self-assessment-bias flaw to correct (§9.2): the `gpt-fast-high` lineage was GPT researching GPT's own failure modes — structurally prone to understating severity and over-hedging toward "insufficient evidence."
- Prior round: `glm-max` (`zai-coding-plan/glm-5.2`, 30/30) and `gpt-fast-high` (`openai/gpt-5.5-fast`, 30/30) produced `research/research.md`.
- Prior critical round: `sonnet-critical` (`claude-sonnet-5`, 10/10, excellent) and a partial `glm-critical` (1 iteration, API-stalled). `sonnet-critical/research.md` read in full as required input.
- This lineage's distinct value: a second, NON-GPT critical lens (Opus) that verifies load-bearing claims against source **code**, not against the prior syntheses — including adversarial re-check of `sonnet-critical`'s own most-confident claims.

<!-- ANCHOR:key-questions -->
## 2. KEY QUESTIONS (remaining)

All KQ-OPUS-1 through KQ-OPUS-10 resolved. See §5.
<!-- /ANCHOR:key-questions -->

## 3. NON-GOALS

Did not re-litigate whether the operator's symptoms exist (CONFIRMED). Did not implement code. Did not over-constrain Claude. Did not treat "not proven" as an escape hatch for symptoms the operator has directly confirmed.

## 4. STOP CONDITIONS

Met: 10 iterations reached (stop policy max-iterations); all findings grounded in re-read source `file:line` evidence.

<!-- ANCHOR:answered-questions -->
## 5. ANSWERED QUESTIONS

- **KQ-OPUS-1** (iter 1): Phase 005's "inconclusive" label is a downstream reframing of a source table that reads `FAIL`/`FAIL/BLOCKED` ×4 (`verification-smoke.md:117-124`); independently confirms `sonnet-critical` iter 1 and adds the git-working-tree provenance angle.
- **KQ-OPUS-2** (iter 2): **OVERTURNS** `sonnet-critical` §5. The ai-council `round_completed` record emitter (`orchestrate-topic.cjs:306-320`) writes `mode:'council'`/`target_agent:'deep-ai-council'`, which MATCHES the validator's `route_proof` (`deep_ai-council_auto.yaml:132-136`) — so `validateRouteProofRecord` PASSES, not "guaranteed FAIL." `record.mode` is `'council'`, not `'ai-council'`.
- **KQ-OPUS-3** (iter 3): The real ai-council defect is a naming-integrity **false-negative** (route-proof passes green on a record naming `target_agent:'deep-ai-council'`, which is the PACKET name, not any real agent — registry `agent` is `ai-council`), plus a live uncommitted header-vs-record contradiction, plus phase-005 never emitting the record at all.
- **KQ-OPUS-4** (iter 4): **CONFIRMS** `sonnet-critical` KQ4 NDP overturn (Task-dispatching `@deep`, a `mode:primary` agent, from orchestrate is the ILLEGAL `Orch(0)→Sub-Orch(1)→@leaf(2)` chain, `orchestrate.md:148`) and sharpens attribution: the NDP-unsafe phrasing is in `glm-max/research.md:55` itself, a shared blind spot.
- **KQ-OPUS-5** (iter 5): Sharpens the KQ4 fix — orchestrate ALREADY carries the deep-agent list (`orchestrate.md:206`), the `Deep Route:` field (`:207`), and agent-definition paths (`:184-185`); the Priority TABLE (`:97-105`) is missing only the `@deep-context`/`@deep-review` rows. Minimal fix = add 2 rows + make Deep Route registry-resolved; no `@deep` dispatch needed.
- **KQ-OPUS-6** (iter 6): **RESOLVES** `sonnet-critical`'s open plugin residual — `tool.execute.before` (`index.d.ts:235-241`) returns `Promise<void>` with mutable `output.args`: the plugin can rewrite args or throw, but cannot return a deny verdict; fail-closed is possible only by throwing, host semantics undetermined. Adds the default-export-only build landmine (`README.md:28`).
- **KQ-OPUS-7** (iter 7): **CONFIRMS** Mode D smoking-gun (`commands/deep/research.md:39-72` self-check ↔ `verification-smoke.md:119` `GENERAL AGENT REQUIRED failure`) and stress-tests it as a redundant second gate atop deep.md's own routing.
- **KQ-OPUS-8** (iter 8): **CONFIRMS** KQ9 "wait on FIX-5" via a coverage argument independent of bias: FIX-5 fixes none of Mode D, the naming false-negative, or latency — ≥3 of 4 confirmed symptoms untouched.
- **KQ-OPUS-9** (iter 9): Adversarial self-check of THIS lineage's own findings; two confidence downgrades applied, headline overturn (KQ-OPUS-2) survives.
- **KQ-OPUS-10** (iter 10): Final confirmed/sharpened/overturned verdict table vs BOTH the prior round AND `sonnet-critical`; implementation-ready deliverables with corrected ai-council rationale.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 6. WHAT WORKED

- Tracing the actual record-emitter script (`orchestrate-topic.cjs`) instead of stopping at the validator function + YAML config — this is what surfaced the KQ-OPUS-2 overturn that the prior critical lineage missed (iter 2).
- Reading the git working-tree diff to establish that the ai-council contradiction is live and uncommitted, which changes the fix scope (iter 3).
- Re-reading the plugin type surface directly (`index.d.ts:235-241`) to convert an "unconfirmed" residual into a precise "possible-by-throw, host-dependent" answer (iter 6).
- Applying the charter's self-assessment-bias standard reflexively — against `sonnet-critical`'s own most-confident claim, not only against the GPT lineage (iter 2, iter 9).
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 7. WHAT FAILED

- (none: every iteration produced re-read source evidence; no approach exhausted without a documented ruling)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 8. EXHAUSTED APPROACHES (do not retry)

- (none)
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 9. RULED OUT DIRECTIONS

See `deep-research-findings-registry.json` `ruledOutDirections` (10 entries across iterations 1-9).
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## 10. NEXT FOCUS

None — lineage complete. Next step is the cross-lineage merge (`research-prompt.md` §9.5): merge with `gpt-critical`, re-run `fanout-merge.cjs` across all lineages, and rewrite `research/research.md` marking which prior conclusions were confirmed / sharpened / overturned — including the correction that `sonnet-critical`'s "ai-council guaranteed FAIL" is itself overturned by this lineage (see §5 KQ-OPUS-2 and `iterations/iteration-010.md`).
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
