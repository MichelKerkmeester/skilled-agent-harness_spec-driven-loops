# Review Iteration 008 — Benchmark + ADR-001 soundness

- **Model**: opus-4.8 (claude2)
- **Seat**: r08
- **clean**: False
- **findings**: 3

## Analysis

I now have conclusive evidence on both halves. Let me write up the findings.

## Review: r08/10 — Benchmark validity + ADR-001 (CORRECTION #2) soundness

### Part 1 — Benchmark audit

**Fixtures are schema-valid and gold-correct.** All 5 `deep-loop-workflows` pairs are well-formed; each `expected.skillId = deep-loop-workflows` and each `expected.mode` (`context/research/review/ai-council/agent-improvement`) matches a real `mode-registry.json` `workflowMode` key (registry lines 20/34/50/66/82). The `advisorLane` values map to the deep-* lanes. No validity defect in the corpus itself.

**But the "3/3 routing precision" scorecard over-claims (P1).** Three independent lines of evidence show the skill-benchmark *harness* never scored mode precision, and the number is a re-assertion of the existing parity fixtures:

1. **The harness has no mode-level scorer.** `score-skill-benchmark.cjs:57` keys D1 scoring on `expectedSkillId`/`skillId` only; there is no `workflowMode`/`mode` comparison anywhere in the scorer, and `advisor-probe.cjs` has no `modeProbe`/`workflowMode` path. iteration-010 itself flagged these as *required, unbuilt* extensions ("Current Lane C cannot score parent-mode precision … advisor-probe returns only ranked skills and scoreD1Inter compares skill id only"). They did not ship.
2. **The authors admit the deferral.** Every private fixture's `notes` and `003/implementation-summary.md:81,91` state "mode-level precision is additionally enforced by the parity fixtures + drift-guard" — i.e. *not* by this benchmark.
3. **Smoking gun — the fixture prompt is lifted from the parity test.** `dlw-research-001.public.json` prompt contains the garbled token `newinforatio`; that exact token is `routing-parity-deep-skills.vitest.ts:85` INV-006 ("autonomous research loop + newinforatio"). The "dogfood" corpus re-states what the parity test already asserts.

On top of that, the denominator is silently truncated: **5 fixtures shipped, but only 3 are counted** (`context` and `agent-improvement` are excluded because `deep-context`/`deep-improvement` mode-routing isn't measured by the Python deep map — iteration-010:64). "3/3 = 100%" reads as full precision; the honest framing is "3 of 5 modes are advisor-routable; mode precision verified by parity fixtures, not the benchmark harness." The detail docs (`003/checklist.md:80`) partly disclose this; the parent headline `spec.md:92` ("dogfood benchmark (3/3 routing precision)") does not.

**Secondary (P2):** `dlw-context-001` asserts `advisorLane: deep-context` + `mode: context`, but `deep-context` is in *neither* the Python (3-mode) nor TS (4-mode) routing map. Its mode-level gold is exercised by nothing — no harness, no parity fixture — so it pads the corpus to "5 modes" without verifiable mode routing.

### Part 2 — CORRECTION #2 soundness

**CONFIRMED — the factual claim is true and strongly evidenced.** `deep-loop-runtime` already depends on `system-spec-kit`:
- `lib/deep-loop/artifact-root.cjs:18` — `require(... system-spec-kit/shared/review-research-paths.cjs)`
- `lib/deep-loop/executor-config.ts:3` and `prompt-pack.ts:4` — `import { z }` from `system-spec-kit/mcp_server/node_modules/zod`
- `lib/coverage-graph/coverage-graph-db.ts:3`, `coverage-graph-signals.ts:3`, `lib/council/council-graph-db.ts:6` — `better-sqlite3` from `system-spec-kit/mcp_server/node_modules`
- `graph-metadata.json` `depends_on` → `system-spec-kit` (weight 0.7, context literally names "zod, better-sqlite3, TSX loader, command YAML consumers … shared test discovery")

So the old ADR-001 rationale ("don't host shared/ in the runtime to avoid a runtime→spec-kit dependency") was indeed already moot. Striking it is correct.

**The "execution-vs-synthesis" rationale is sound — resource-map.cjs need not move.** There's a real differentiator, not just post-hoc labeling: `artifact-root.cjs` is consumed by *three* graph-backed reducers (research+review+**context**) as infra topology, while `shared/synthesis/resource-map.cjs` is consumed by only the research+review reducers as markdown output rendering (`deep-research/scripts/reduce-state.cjs:14` + `deep-review/scripts/reduce-state.cjs:13`). Keeping the 2-mode synthesis shim in the workflows skill, and the cross-cutting infra shim in the runtime, tracks a genuine consumer-breadth boundary.

**Minor (P2, low-confidence, optional):** `reduce-state.cjs:14-15` imports two structurally-identical re-export shims from two *different* skills side-by-side. Now that the dependency blocker is gone, co-locating both in `deep-loop-runtime` would be marginally more consistent — but this is a defensible judgment call, not a defect. I would not block on it.

### Summary
- **P0:** none in this slice. No epic invariant (one-identity, parity, additive Phase 3, runtime MCP-free) is touched.
- **P1:** the benchmark "3/3 routing precision" scorecard over-claims harness-measured mode precision the harness cannot produce.
- **P2:** orphaned `context` mode-gold; optional shim co-location.
- **CORRECTION #2:** sound and well-evidenced; rationale holds.

===REVIEW-JSON===
{"slice":"benchmark-validity + ADR-001 correction#2","findings":[{"severity":"P1","path":".opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/spec.md:92","issue":"'dogfood benchmark (3/3 routing precision)' over-claims a harness-measured mode-precision metric. score-skill-benchmark.cjs:57 and advisor-probe.cjs score skillId only (no workflowMode comparison anywhere); the mode-scoring extensions iteration-010 deemed REQUIRED never shipped. The fixtures' own notes + 003/implementation-summary.md:81,91 admit mode precision is enforced by the parity fixtures, not this benchmark. The dlw-research-001 prompt even copies the 'newinforatio' token verbatim from routing-parity-deep-skills.vitest.ts:85 INV-006. Denominator is silently truncated: 5 fixtures shipped, only 3 counted (context+agent-improvement dropped).","fix":"Reframe headline + 003/checklist.md:80 + implementation-summary.md:91 as: '3 of 5 modes are advisor-routable; per-mode precision is verified by routing-parity-deep-*.vitest.ts, while the skill-benchmark harness scores skill-id routing only (mode precision not harness-measured).' Do not present 3/3 as a benchmark scorecard.","confidence":"high"},{"severity":"P2","path":".opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/dlw-context-001.private.json","issue":"Fixture asserts advisorLane=deep-context + mode=context, but deep-context is absent from both the Python (3-mode) and TS (4-mode) routing maps, so its mode-level gold is exercised by no harness and no parity fixture. It pads the corpus to '5 modes' without verifiable mode routing.","fix":"Either drop the mode-level gold to skill-level only with an explicit note that context mode is not advisor-routable, or wire deep-context into a routing map/parity fixture before claiming it as a scored mode.","confidence":"med"},{"severity":"P2","path":".opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14","issue":"reduce-state.cjs:14-15 imports two structurally-identical system-spec-kit re-export shims from two different skills (resource-map.cjs from deep-loop-workflows/shared, artifact-root.cjs from deep-loop-runtime). The execution-vs-synthesis split is defensible (resource-map serves 2 modes, artifact-root serves 3 incl. context), but the asymmetry is a minor consistency cost now that the runtime->spec-kit dependency blocker is confirmed gone.","fix":"Optional: co-locate resource-map.cjs alongside artifact-root.cjs in deep-loop-runtime, OR add a one-line cross-reference documenting the boundary. Not required — the correction's reasoning is sound.","confidence":"low"}],"clean":false}
===END===

## Findings (structured)

```json
[
  {
    "severity": "P1",
    "path": ".opencode/specs/skilled-agent-orchestration/117-parent-nested-skill-pattern/spec.md:92",
    "issue": "'dogfood benchmark (3/3 routing precision)' over-claims a harness-measured mode-precision metric. score-skill-benchmark.cjs:57 and advisor-probe.cjs score skillId only (no workflowMode comparison anywhere); the mode-scoring extensions iteration-010 deemed REQUIRED never shipped. The fixtures' own notes + 003/implementation-summary.md:81,91 admit mode precision is enforced by the parity fixtures, not this benchmark. The dlw-research-001 prompt even copies the 'newinforatio' token verbatim from routing-parity-deep-skills.vitest.ts:85 INV-006. Denominator is silently truncated: 5 fixtures shipped, only 3 counted (context+agent-improvement dropped).",
    "fix": "Reframe headline + 003/checklist.md:80 + implementation-summary.md:91 as: '3 of 5 modes are advisor-routable; per-mode precision is verified by routing-parity-deep-*.vitest.ts, while the skill-benchmark harness scores skill-id routing only (mode precision not harness-measured).' Do not present 3/3 as a benchmark scorecard.",
    "confidence": "high"
  },
  {
    "severity": "P2",
    "path": ".opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/deep-loop-workflows/dlw-context-001.private.json",
    "issue": "Fixture asserts advisorLane=deep-context + mode=context, but deep-context is absent from both the Python (3-mode) and TS (4-mode) routing maps, so its mode-level gold is exercised by no harness and no parity fixture. It pads the corpus to '5 modes' without verifiable mode routing.",
    "fix": "Either drop the mode-level gold to skill-level only with an explicit note that context mode is not advisor-routable, or wire deep-context into a routing map/parity fixture before claiming it as a scored mode.",
    "confidence": "med"
  },
  {
    "severity": "P2",
    "path": ".opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:14",
    "issue": "reduce-state.cjs:14-15 imports two structurally-identical system-spec-kit re-export shims from two different skills (resource-map.cjs from deep-loop-workflows/shared, artifact-root.cjs from deep-loop-runtime). The execution-vs-synthesis split is defensible (resource-map serves 2 modes, artifact-root serves 3 incl. context), but the asymmetry is a minor consistency cost now that the runtime->spec-kit dependency blocker is confirmed gone.",
    "fix": "Optional: co-locate resource-map.cjs alongside artifact-root.cjs in deep-loop-runtime, OR add a one-line cross-reference documenting the boundary. Not required \u2014 the correction's reasoning is sound.",
    "confidence": "low"
  }
]
```
