# Deep Research Strategy - sol-high lineage

## 2. TOPIC
Investigate whether every skill and skill-advisor related JSON across `.opencode/skills` is as optimized, automated, effective, tested, and integrated as it can be, and identify the highest-leverage gaps. Cover five dimensions, one focus per iteration: (1) inventory/current state, (2) optimization, (3) automation gaps, (4) effectiveness, and (5) testing/integration. Findings only; cite `file:line`. Deliverable: ranked opportunity map.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
[All five key questions answered]
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Do not implement fixes.
- Do not redesign the advisor scoring algorithm.
- Do not change the H or S class contract fundamentally.
- Do not write outside this lineage artifact directory.

---

## 5. STOP CONDITIONS
- Run all 5 iterations under `stopPolicy: max-iterations`.
- Treat convergence before iteration 5 as telemetry only and broaden review angles.
- Synthesize only after the fifth iteration.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] What JSON types exist, which are authored versus generated, where are they present for H and S roots, and what automation covers them? (iteration 1)
- [x] Which fields or files are redundant, unused, duplicated, or drift-prone, and what consolidation has the highest leverage? (iteration 2)
- [x] Which hand-authored JSON and validation steps could be generated, scaffolded, or automatically checked? (iteration 3)
- [x] Which metadata and intent signals actually drive advisor routing, and where does routing effectiveness fall short? (iteration 4)
- [x] Which JSON surfaces lack unit, CI, freshness, scaffold-to-ingest, and end-to-end routing coverage? (iteration 5)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Contract-driven inventory bounded the JSON universe before counting files. (iteration 1)
- Direct root-gate and freshness-gate execution established current fleet state. (iteration 1)
- Consumer and generator tracing separated root identity from advisor projections. (iteration 1)
- Field-level consumer tracing distinguished avoidable duplication from load-bearing projections. (iteration 2)
- Compiler comments exposed an already-drifted tie-break representation. (iteration 2)
- Lifecycle tracing from scaffold through ingest exposed ownership handoffs and missing end-to-end automation. (iteration 3)
- Phrase-level tracing from watch through projection and compiled routing exposed activation gaps. (iteration 4)
- Targeted live advisor probes confirmed both working and missed metadata boundaries. (iteration 4)
- Reading assertions rather than test names separated strong stage-local tests from missing lifecycle seams. (iteration 5)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Broad filename discovery mixed unrelated spec-folder continuity JSON with skill-root identity JSON. (iteration 1)
- Broad shared-field searches mixed skill metadata with unrelated memory/spec schemas. (iteration 2)
- One broad production search crossed into sibling artifacts; those matches were discarded and later searches were scoped. (iteration 3)
- Committed executable and narrative evaluation baselines report different versioned totals and cannot be merged. (iteration 4)
- Broad test-name discovery produced unrelated phase fixtures and required narrowing to stage entrypoints. (iteration 5)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[None yet]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Treat spec-folder `generate-description.js` and `backfill-graph-metadata.js` as skill-root producers; they own a separate schema. (iteration 1)
- Treat `ci-leaf-manifest-freshness.cjs` as complete fleet-adoption coverage; it discovers committed outputs rather than all `SKILL.md` roots. (iteration 1)
- Delete compiled activation manifests as duplicate route data; they preserve serving authority and policy generation. (iteration 2)
- Collapse command metadata into mode registries without a generated projection; both serve distinct consumers. (iteration 2)
- Remove `grandfatheredFolderMismatch`; it is a validated policy assertion, not dead repetition. (iteration 2)
- Generate authored H routing semantics from folder structure; vocabulary, edges, aliases, choreography, and activation remain human policy. (iteration 3)
- Use same-named spec-folder generators for skill-root identity; their schema and lifecycle are separate. (iteration 3)
- Treat hub registry/router vocabulary as normal root-selection input; it becomes visible only after parent selection. (iteration 4)
- Treat key-file watch activation as content regeneration; unchanged graph metadata is reindexed as unchanged. (iteration 4)
- Redesign lane weights for metadata activation misses; the missing projection is upstream of fusion. (iteration 4)
- Treat fixture presence as behavioral coverage; several suites assert real behavior, but cross-stage scenarios remain absent. (iteration 5)
- Treat isolated discovery parity as complete ingest parity; it preserves a deliberate depth divergence and does not prove recommendation equivalence. (iteration 5)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: five mandated dimensions
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Synthesis complete. Use the ranked opportunity map in `research.md`; no implementation is authorized by this lineage.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- `resource-map.md` is absent, so the resource-map coverage gate is skipped.
- Focused memory retrieval returned no canonical packet results; use local source evidence.
- Code graph readiness was unavailable at initialization; use Grep, Glob, and direct reads.
- Parent charter: `.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/spec.md`.
- Contract under study: `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md`.
- Fan-out lineage label: `sol-high`; session `fanout-sol-high-1785305275596-oro54j`.
- Executor: `cli-opencode` / `openai/gpt-5.6-sol`.

### Bounded Context Snapshot

- Source pointers: skill-root metadata contract, `ci-skill-root-metadata.cjs`, `generate-leaf-manifest.cjs`, advisor graph/index/watcher code, and `compiled-route-manifest.cjs`.
- Integration points: H/S root metadata classification, advisor ingest, compiled routes, manifest generation and freshness, scaffolding, and CI gates.
- Constraints: findings only; H/S contract frozen; exactly one focus dimension per iteration; all writes remain under this lineage root.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05, telemetry only under max-iterations stop policy
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- `research.md` ownership: workflow-owned canonical synthesis output, lineage-local
- Current generation: 1
- Started: 2026-07-29T06:10:56.169Z
