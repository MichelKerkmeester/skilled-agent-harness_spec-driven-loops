# Gateway Alignment Deep-Review — Review Report (cline lineage)

- **Session:** `fanout-cline-1787662335600-tvzr08` (fan-out lineage `cline`, primary)
- **Target:** specs/system-deep-loop/036-deep-loop-innovation/014-gateway-alignment-review (spec-folder)
- **Iterations:** 10 / 10 (`stopPolicy: max-iterations`; convergence telemetry only, never gated)
- **Executor:** cli-pi · x-ai/ox-alpha

---

## 1. Executive Summary

**Verdict: FAIL.**

| Severity | Active | Key finding |
|----------|--------|-------------|
| P0 | 1 | F-008 — three-way contradiction on who writes the mode state projection; the only self-consistent leaf behavior is a raw direct-write bypass |
| P1 | 3 | F-001 sequential_thinking drift; F-002 injection-guard gap; F-003 SKILL.md doctrine drift |
| P2 | 4 | F-004..F-007 advisories |

`hasAdvisories: true`. `releaseReadinessState: release-blocking` while F-008 is active.

The 013 migration aligned the 24 leaf-agent files with grep-verifiable gateway routing (confirmed clean), but the review found that the *system* around those files was never made coherent: the dispatch prompt packs still instruct raw direct appends into the ledger-fenced projection, the gateway does not refresh non-research projections despite agent prompts promising it, and post-dispatch validation deadlocks any leaf that obeys its agent prompt.

## 2. Planning Trigger

Verdict FAIL routes this to `/speckit:plan` for remediation of the P0 (mandatory) and the three P1s (required or user-approved deferral). The P2 advisories can ride along as a workstream lane.

## 3. Active Finding Registry

### F-008 (P0) — Three-way state-write contract contradiction

Shipped artifacts give mutually exclusive instructions for writing `deep-{review,alignment}-state.jsonl`:

1. **Leaf agent prompts** (all six runtimes): record through the append gateway; "never write … directly"; promise "the gateway … refreshes that projection from the ledger" ([SOURCE: .opencode/agents/deep-review.md:233,250]).
2. **Rendered dispatch prompt packs** (what CLI-dispatched leaves actually receive): "Append via single-line JSON … `echo '<single-line-json>' >> {state_paths_state_log}`" — raw redirect mandated, gateway never mentioned ([SOURCE: .opencode/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:118]; same in research :65 and alignment [SOURCE: alignment-prompt-pack.md.tmpl:82]).
3. **Runtime + YAML + validator**: the gateway refreshes projections for deep-research only ([SOURCE: .opencode/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:186-198]; no-contract ⇒ `projectionRefreshed=false` :408-410); the review YAML documents this honestly ("Exit 0 … means durable in the ledger, and nothing more", [SOURCE: .opencode/commands/deep/assets/deep-review-auto.yaml:104-108]); yet post-dispatch validation requires the canonical record IN the state log (`state_record_missing`, [SOURCE: verify-iteration.cjs:167]) and redispatches on failure.

Consequences: a contract-clean leaf (gateway-only write) fails validation every iteration → redispatch → stuck recovery; a pack-obedient leaf commits exactly the latent direct-write bypass this packet was commissioned to hunt. Mitigations that bound the damage: per-mode projection contracts already exist and pass conformance (unwired); deltas keep reducers fed even when projections are stale ([SOURCE: reduce-state.cjs:2069]); research mode's refresh is wired and works.

### F-001 (P1) — Decommissioned MCP server mandated by ai-council prompts

All runtime copies of `ai-council` require `sequential_thinking` MCP for Depth-1 deliberation ([SOURCE: .opencode/agents/ai-council.md:22,60,125]; tools line [SOURCE: .claude/agents/ai-council.md:4]) while AGENTS.md declares it decommissioned ([SOURCE: AGENTS.md:391]) and only `.pi/mcp.json:3` still registers it. Depth-1 degrades on the other runtimes.

### F-002 (P1) — Untrusted-target injection guard gap

Loop protocol mandates treating repo-local targets as adversarial prompt input ([SOURCE: loop-protocol.md:280]); the alignment leaf implements this ([SOURCE: .opencode/agents/deep-alignment.md:25]) but research/review leaves and their dispatch templates do not ([SOURCE: .opencode/agents/deep-research.md] — no untrusted-target guidance; web-only guard at [SOURCE: deep-research/assets/prompt-pack-iteration.md.tmpl:48]).

### F-003 (P1) — SKILL.md doctrine contradicts leaf agents and reducer

"Let `scripts/reduce-state.cjs` be the SINGLE state writer" ([SOURCE: deep-review/SKILL.md:60]) vs leaf gateway-only contract ([SOURCE: .opencode/agents/deep-review.md:250]) vs reducer reality (writes registry/strategy/dashboard/resource-map only, [SOURCE: runtime/scripts/reduce-state.cjs:2151-2157]). Alignment and ai-council SKILL.mds are silent on the gateway their leaves mandate; deep-research SKILL.md shows intended doctrine ([SOURCE: deep-research/SKILL.md:272]).

## 4. Remediation Workstreams

1. **WS-1 (P0, blocks release): make the state-write contract coherent.**
   - Wire per-mode projection contracts in `resolveDefaultProjectionContract` (contracts already exist and pass conformance), OR rewrite leaf prompts/packs to state plainly that exit 0 = ledger-durable only.
   - Rewrite all three prompt-pack templates to gateway-routed instructions; remove the `>> {state_log}` mandates.
   - Reconcile `verify-iteration.cjs` expectations with whichever write path wins.
   - Add an end-to-end test: dispatched leaf iteration lands in projection AND passes post-dispatch validation for each of review/alignment/council.
2. **WS-2 (P1): update ai-council prompts** to the live MCP surface (or re-register the server fleet-wide).
3. **WS-3 (P1): add untrusted-target guard text** to research/review leaves and both dispatch templates, mirroring deep-alignment's blockquote.
4. **WS-4 (P1): regenerate review/alignment/council SKILL.mds** so state-writer authority matches the gateway contract (deep-research SKILL.md is the template).
5. **WS-5 (P2 advisories):** migrate exempt append sites; extend guard patterns (truncate/indirection/FS-API/wrapped args) + expected-count floor + prompt-pack scanning; wire or retire check-direct-append.cjs.

## 5. Spec Seed

Minimal spec delta for a remediation packet:
- REQ: every CLI-dispatched leaf iteration must pass `verify-iteration.cjs` without violating any shipped instruction (acceptance: golden-path run per mode, exit 0 end-to-end).
- REQ: prompt packs and agent prompts must name one identical state-write mechanism per mode (acceptance: single source of truth rendered into both).
- REQ: non-research modes either have wired projection refresh or prompts/docs that never claim it (acceptance: grep contract + e2e receipt assertion on `projectionRefreshed`).

## 6. Plan Seed

- T1: wire contracts / fix resolver; T2: rewrite 3 templates; T3: reconcile validator; T4: e2e tests ×3 modes; T5: SKILL.md regen; T6: ai-council MCP decision + edits across 6 runtimes; T7: guard v2 (patterns + scope floor + template scan). Order: T4 first as the failing proof, then T1-T3 to turn it green, then docs (T5-T7).

## 7. Traceability Status

| Protocol | Class | Status |
|----------|-------|--------|
| spec_code | hard | pass (canonical routing claims verified; writer-authority claim fail → F-003/F-008 tracked separately) |
| checklist_evidence | hard | pass (all 013 CHK items hold as written; scope excluded the failing seam) |
| skill_agent | advisory | partial → findings F-003 |
| agent_cross_runtime | advisory | pass (six-runtime parity confirmed) |
| feature_catalog_code | advisory | fail → catalog accurate, prompts contradict → F-008 |
| playbook_capability | advisory | n/a (no playbook scenarios target this surface) |

## 8. Deferred Items

- F-004..F-007 advisories (P2) — backlog lanes WS-5.
- `.pi/mcp.json` sequential_thinking registration decision (feeds WS-2).
- External-CI invocation of check-direct-append.cjs could not be verified from inside the tree (F-007 downgrade trigger stands open).

## 9. Audit Appendix

- **Coverage:** 10 iterations; dimensions D1×2+replay, D2, D3×3, D4×2, YAML layer, overlays; ~60 distinct files/surfaces read; full declared audit surface covered (REQ-004).
- **Replay validation:** convergence recomputed from stored JSONL only — ratios `[1.0, 0.0, 0.5, 0.33, 0.25, 0.0, 0.6, 1.0, 0.4, 0.0]`, all records `status: complete`, adjudication events present for every P0/P1. Stop executed under `stopPolicy=max-iterations` at the ceiling; legal-stop gates recorded: convergenceGate n/a-by-policy, p0ResolutionGate FAIL (drives verdict), claimAdjudicationGate pass, dimensionCoverageGate pass, evidence/scope gates pass.
- **Adversarial P0 replay:** F-008 survived Skeptic (five alternate write paths ruled out), was extended by Hunter (prompt-pack face), and Referee-locked at P0 with confidence 0.85.
- **Evidence discipline:** every finding carries file:line citations; inference-only claims rejected during adjudication (three candidate observations were checked and dropped as clean: idea_observed authorization, improvement-journal dual-stream design, orchestrator operational appends).
- **Continuity note:** per fanout-lineage constraints, `generate-context.js` was NOT run; disk state under `review/lineages/cline/` is ground truth for merge.
