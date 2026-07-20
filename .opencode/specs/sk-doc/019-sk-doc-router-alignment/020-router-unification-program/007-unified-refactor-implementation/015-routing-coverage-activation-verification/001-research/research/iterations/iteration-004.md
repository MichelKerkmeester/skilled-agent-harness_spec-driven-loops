# Iteration 4 — minimax/MiniMax-M3 — focus: archiving

Read-only routing check: identify the governing research skill before inspecting files; no repository changes will be made.
I’m checking the iteration packet and the canonical benchmark/archive structures first, then I’ll trace the frozen baseline and serving/archiving assumptions.
One source-path distinction matters: the resolver reads `010-live-activation/activation`, while the rollout candidate artifacts are under `006-parent-hub-rollout`; I’m verifying the served manifests before treating any parity run as archiveable.
## Iteration 4 — Durable archiving

**Headline:** Promote compiled-vs-legacy evidence as per-hub Lane C run pairs under `.opencode/skills/<hub>/benchmark/<run-label>/`; do not copy `route-gold.typed.json` or activation artifacts out of the spec tree as standalone “results.” The storage contract allows only `skill-benchmark-report.json`, its rendered `.md`, and an optional per-run `README.md` ([storage guide:120-148](.opencode/skills/sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md:120-148)); the parity result therefore belongs in a report-level `compiledRouting` block, as already planned ([014 spec:132-137](.opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/014-benchmark-alignment/spec.md:132-137)).

### Verified claims

- The normative layout is one `benchmark/` root beside each measured skill, sibling run-label directories, and a frozen `baseline/`; runs must never overwrite one another ([storage guide:62-92](.opencode/skills/sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md:62-92)). The populated `sk-code` tree demonstrates the intended index/status model: `router-final`, `live-final`, sidecars, superseded runs, and immutable `baseline` ([sk-code README:73-107](.opencode/skills/sk-code/benchmark/README.md:73-107)).

- `baseline/` means the frozen **pre-optimization legacy Lane C anchor**, not “the latest compiled parity result.” New runs must be siblings, and run parameters are authoritative inside the JSON report ([storage guide:89-116](.opencode/skills/sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md:89-116)). The existing `sk-code` baseline is explicitly a non-reproducible first-run snapshot ([sk-code README:84-89](.opencode/skills/sk-code/benchmark/README.md:84-89); report root points at an older worktree at `.opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json:7-10`).

- The planned parity report must contain resolved mode, eligible rows, parity counts, drift rows, breakages, and frozen scorer hashes ([014 checklist:79-88](.opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/014-benchmark-alignment/checklist.md:79-88)). Current Lane C is not yet capable of this: its planned-state summary says implementation has not started and the current path is legacy replay only ([014 implementation summary:17-28](.opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/014-benchmark-alignment/implementation-summary.md:17-28)).

- The archive must use the **active serving tree**, not rollout candidates. The runtime resolver reads `010-live-activation/activation` ([resolve.cjs:19-20](.opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/011-runtime-engine/lib/resolve.cjs:19-20)); its live `sk-doc` manifest is compiled-serving ([010 manifest:1](.opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/010-live-activation/activation/sk-doc/manifest.json:1)), while the similarly named `006-parent-hub-rollout` candidate manifest is legacy/shadow-only ([006 manifest:1](.opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/007-sk-doc/activation/manifest.json:1)). Copying the latter would archive non-serving state.

- The live executor selects the model from `SKILL_BENCH_OPENCODE_MODEL` and always applies its variant setting ([live-executor.cjs:358-379](.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/live-executor.cjs:358-379)), but the report schema currently records only skill ID/root and trace mode ([score-skill-benchmark.cjs:1791-1797](.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1791-1797)). A label such as `live-gpt-5-6-luna-high` is not sufficient provenance unless exact model and variant are persisted in the JSON.

### Recommended archive layout

Apply this under each of the seven compiled-routing hubs listed by the advisor allowlist ([advisor-recommend.ts:41-49](.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-recommend.ts:41-49)):

```text
.opencode/skills/<hub>/benchmark/
├── README.md
├── baseline/
│   ├── skill-benchmark-report.json
│   └── skill-benchmark-report.md
├── router-compiled-parity-baseline/
│   ├── skill-benchmark-report.json
│   └── skill-benchmark-report.md
├── router-compiled-parity-final/
│   ├── skill-benchmark-report.json
│   └── skill-benchmark-report.md
└── live-gpt-5-6-luna-high/
    ├── README.md
    ├── skill-benchmark-report.json
    └── skill-benchmark-report.md
```

- `baseline/`: retain the existing legacy/pre-optimization anchor; never overwrite it.
- `router-compiled-parity-baseline/`: first same-revision, fresh-manifest compiled-vs-legacy reference; freeze after zero drift/breakage, dual route-gold success, equality, and frozen-scorer hash checks.
- `router-compiled-parity-final/`: final deterministic P4 result; intermediate gates may use immutable `after-p0-observability`, `after-p1-drift-ci`, `after-p2-canary`, `after-p3-eligibility`, and `after-p4-compiled-serving` siblings.
- `live-gpt-5-6-luna-high/`: model/manual-playbook evidence, advisory to deterministic parity; persist exact `openai/gpt-5.6-luna`, `high`, executor, scenario IDs, and run revision.

### Ranked recommendations

1. **P0:** Add `compiledRouting` to the canonical report JSON and render it from `build-report.cjs`; do not create a separate parity report artifact. Preserve the three frozen scorer files byte-for-byte ([014 spec:89-95](.opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/014-benchmark-alignment/spec.md:89-95)).
2. **P0:** Freeze a new `router-compiled-parity-baseline/` per hub from the active `010-live-activation` manifests; never reinterpret or replace `baseline/`.
3. **P0:** Record active manifest/policy hash, serving authority, route-gold source digest, topology/input digests, frozen scorer hashes, and first differing field for failures in `compiledRouting`.
4. **P1:** Add exact live executor provenance to report JSON; use `live-gpt-5-6-luna-high` only after the report can prove the routed subject and variant.
5. **P1 — unnamed gap:** Normalize `targetSkill.root` to a repository-relative path or add a durable relative field. Current reports serialize absolute worktree paths ([score-skill-benchmark.cjs:1791-1797](.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1791-1797)), which makes archived evidence environment-specific.

===FINDINGS-JSON-START===
[
  {"id":"F-4-1","area":"archiving","finding":"The storage contract permits only a report JSON, its rendered Markdown, and an optional README, so compiled-vs-legacy parity must be embedded in the canonical Lane C report pair rather than archived as a copied spec-tree artifact.","evidence":".opencode/skills/sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md:120-148","severity":"P0","actionable":"Add report.compiledRouting to the orchestrator JSON and render that block through build-report.cjs without editing the frozen scorer trio.","novelty":"new"},
  {"id":"F-4-2","area":"archiving","finding":"The existing baseline label is the frozen legacy pre-optimization anchor and must not be repurposed as the compiled-parity baseline.","evidence":".opencode/skills/sk-doc/create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md:89-109","severity":"P0","actionable":"Create immutable router-compiled-parity-baseline and router-compiled-parity-final sibling runs while leaving baseline untouched.","novelty":"new"},
  {"id":"F-4-3","area":"activation","finding":"The runtime resolves serving state from 010-live-activation while 006-parent-hub-rollout contains candidate manifests with different authority, so archiving the candidate tree can record non-serving evidence.","evidence":".opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/011-runtime-engine/lib/resolve.cjs:19-20","severity":"P0","actionable":"Generate parity reports through the public front door against the active 010-live-activation manifests and store their hashes/status in compiledRouting; never treat 006 candidates as serving proof.","novelty":"new"},
  {"id":"F-4-4","area":"archiving","finding":"Lane C live reports currently omit the exact model and variant even though the executor selects them, so a live-gpt-5-6-luna-high folder alone cannot prove the required LUNA HIGH subject.","evidence":".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs:1791-1797","severity":"P1","actionable":"Persist provider/model, variant, executor, scenario IDs, and run revision in the report JSON or optional per-run README.","novelty":"new"},
  {"id":"F-4-5","area":"unnamed","finding":"Durable benchmark reports serialize an absolute worktree root, making archived evidence dependent on the originating machine and worktree path.","evidence":".opencode/skills/sk-code/benchmark/router-final/skill-benchmark-report.json:7-10","severity":"P1","actionable":"Emit a repository-relative target path plus immutable source/input digests, and update provenance validation to accept the durable relative form.","novelty":"new"}
]
===FINDINGS-JSON-END===

