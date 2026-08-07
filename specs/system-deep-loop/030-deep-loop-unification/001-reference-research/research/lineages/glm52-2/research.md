# Research Synthesis — Deep-Loop Unification Merge Validation (glm52-2)

> **Lineage:** `glm52-2` (family glm52, replica 2/5) · **Executor:** cli-opencode `zai-coding-plan/glm-5.2` (max) · **Session:** `fanout-glm52-2-1783486518892-2qss01`
> **Loop:** 5/5 iterations · **Stop:** converged (composite 0.74 > 0.60; all gates pass) · **Questions answered:** 5/5
> **Scope:** read-only stress-test of the merge design in children 002/003/004 of packet `052-deep-loop-unification`.

This synthesis independently confirms, corrects, and surfaces new risks for the three Plan agents' design before the irreversible directory move (child 002) executes. Findings are ranked by decision-relevance and cite concrete `file:line` evidence.

---

## 1. VERDICT

**The merge design is structurally sound and safe to execute as staged (002 → 003 → 005), with fallback-router wiring deferred (004).** The directional path-repair rule, the tooling-borrow scoping, and the naming-scope decision are all correct. Three precision corrections and three genuinely new risks (beyond the Plan agents' set) should be folded into the execution plans before the move. None block the merge; two (F2.4, F4.3) warrant explicit execution-step additions.

---

## 2. RANKED FINDINGS

### Tier 1 — Must address before/at the move

**[R1] Path-repair rule conflates absolute and relative paths (CORRECTION — F2.3)**
002 §8's "forward = hop-unchanged/segment-rename; reverse = minus-one-hop/segment-rename" rule is **correct for relative `require()` sites** (verified F2.1 reverse, F2.2 forward). But `compile-command-contracts.cjs` and `check-contract-drift.cjs` embed **absolute repo-rooted literals** (`.opencode/skills/deep-loop-workflows/…`) where hop-count is meaningless — these need a distinct, simpler string-rename pass. An editor applying hop-math to an absolute literal will produce a broken path.
- *Action:* execution plan must state both repair classes explicitly (relative-require hop-math; absolute-literal segment-rename).
- Evidence: `deep-loop-runtime/scripts/compile-command-contracts.cjs:15-288`; `check-contract-drift.cjs:40-42`; `002/spec.md:172-174`.

**[R2] `compile-command-contracts.cjs` is the densest + highest-cascade forward site (RISK — F2.4)**
One file embeds ~36 absolute `deep-loop-workflows/…` paths across three mode contracts, and is the **generator** for `commands/deep/assets/compiled/*.contract.md` which carry a runtime-consumed content hash. A mis-named path desyncs the hash and fails silently at *command-invocation* time (not migration time). 003 REQ-002 (byte-identical regeneration, never hand-edit) is the guard.
- *Action:* treat this file as the canonical forward-repair dry-run target; diff regenerated output against committed contracts as the forward-direction exit gate.
- Evidence: `compile-command-contracts.cjs:15-288`; `003/spec.md:126-127`; `002/spec.md:87`.

**[R3] `memory-runtime-retention.vitest.ts` is an ACTIVE import, not a silent coverage hole (RISK — raises F3.4)**
002 §6 frames the tooling-borrow slipping into the gap as a "silent coverage hole, not a build failure." True for the vitest *glob* (F3.2), but **wrong for the live `import`** at `system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts:9` — that test statically imports `../../../deep-loop-runtime/lib/deep-loop/loop-lock.js`. After a bare `git mv`, the module fails to resolve at *load* time → hard `npm test` failure. Reinforces that 002's "scope the borrow INTO this phase" decision is correct and must be atomic with the move; REQ-003 (`test:council` succeeds) is the right gate.
- Evidence: `system-spec-kit/mcp_server/tests/memory-runtime-retention.vitest.ts:9`; `002/spec.md:107,138`.

### Tier 2 — Decision needed during execution

**[R4] One advisor divergence entry targets `deep-loop-runtime` directly — anomaly (NEW RISK — F4.3)**
`local-native-approved-divergences.json:530` carries `"nativeTop": "deep-loop-runtime"` (not the hub id). Post-merge, runtime is **non-routable infrastructure** (no graph-metadata.json, no advisor identity). A blind field-scoped rename to `system-deep-loop` promotes a stale entry; the reason it diverged (a standalone runtime routing target) no longer exists. Child 003 does not address this single entry.
- *Decision for 003 operator:* (a) re-point to the merged hub id if the prompt still legitimately routes to the deep-loop family, or (b) remove it. Do NOT silently text-replace.
- Evidence: `local-native-approved-divergences.json:530`; `002/spec.md:169`.

**[R5] Parity tests + drift-guard self-reference the old identity (NEW RISK — F4.4/F4.5)**
11+ advisor parity invariants hardcode `skill: 'deep-loop-workflows'` as type annotations and `.toBe(...)` assertions (`routing-parity-deep-skills.vitest.ts:30-191`, `routing-parity-deep-council.vitest.ts:28-110`, `advisor-recommend.vitest.ts:288-297`). These are **loud regression gates** — good, but all must move in lockstep with the constant rename. Separately, `routing-registry-drift-guard.vitest.ts:26` reads the old `mode-registry.json` *path* and asserts the old id; this confirms 003 REQ-001's ordering invariant — the validating tools themselves reference the old identity, so `parent-skill-check.cjs` constants must be fixed FIRST.
- Evidence: `routing-parity-deep-skills.vitest.ts:30-191`; `routing-registry-drift-guard.vitest.ts:26,76`; `003/spec.md:94`.

### Tier 3 — Confirms the design as-is

**[R6] Structural layout correct and complete (CONFIRM — F1.1/F1.2)**
`system-deep-loop/runtime/` nesting maps 1:1 onto the live runtime tree. runtime-as-infrastructure (no workflowMode, no graph-metadata.json, SKILL.md→README.md) is the right call — adding it as a seventh mode-registry entry would be a category error. One minor clarification (F1.3): runtime-owned doc families (`feature_catalog/`, `references/`, `changelog/`, `manual_testing_playbook/`) move as a unit via the whole-tree `git mv`; execution should verify no tool assumes they live at hub level. One low new risk (F1.4): two `package.json` files under one skill (hub + runtime) — sanity-check `package_skill.py --check` (002 REQ-007).
- Evidence: `002/spec.md:156-167,169`; `deep-loop-runtime/feature_catalog/feature_catalog.md:23`.

**[R7] Tooling-borrow surface is ~6–8 sites, not "4" (CORRECTION — F3.3)**
Beyond the four the spec names (runtime package.json/tsconfig.json, mcp_server package.json/vitest.config.ts), the reverse half includes: `memory-runtime-retention.vitest.ts:9` (live import), `council-playbook-anchor-integrity.vitest.ts:12,28,30,64` (regex literals), `deep-review-auto-restart-contract.vitest.ts:19` (path string), `graph-degraded-stress-cell-isolation.md:57` (prose glob). Same strategy, fuller file-list. The borrow has two distinct natures (F3.5): runtime borrows system-spec-kit's *tooling* (tsc, @types); system-spec-kit's tests borrow runtime's *code* (loop-lock). The deferred TS-tooling decoupling resolves only the tooling half.
- Evidence: `runtime/package.json:11`; `tsconfig.json:13`; `system-spec-kit/mcp_server/vitest.config.ts:20`; `memory-runtime-retention.vitest.ts:9`.

**[R8] Fallback-router: zero live callers confirmed; recommend DEFER (CONFIRM + DECISION — F5.1/F5.3)**
grep of `runtime/scripts/` for `fallback-router|resolveFallback` → **empty**. `fanout-pool.cjs` does same-model retry only (`maxRetries`), never a model swap. The library is real and ready (F5.2), the glm→mimo edge is already documented as a recipe in `sk-prompt-models` (F5.5), and a future wiring's import is **merge-stable** (intra-runtime, F5.4). Recommend deferring to child 004 as independent post-merge hardening — it is genuine feature work, not rename/nesting, and the merge's success criteria do not depend on it.
- Evidence: grep `deep-loop-runtime/scripts` → empty; `fanout-run.cjs:29-36`; `004/spec.md:58`; `sk-prompt-models/references/quota_fallback.md:148`.

---

## 3. RULED-OUT DIRECTIONS (negative knowledge)

| Direction | Why ruled out | Evidence |
|-----------|---------------|----------|
| Split runtime `lib/` across the four mode packets | Destroys the "one frozen backend" invariant both SKILL.md files narrate | `deep-loop-workflows/SKILL.md:12,112,138` |
| Apply forward/reverse hop-math uniformly to every `deep-loop-*` string | Wrong for absolute literals (R1) | `compile-command-contracts.cjs:15-288` |
| Defer the system-spec-kit tooling-borrow to child 003 | Live import fails at load time post-move (R3) | `memory-runtime-retention.vitest.ts:9` |
| Blind whole-file find/replace across the advisor corpus | Destroys reviewed `reason` narration; mishandles the runtime-target anomaly (R4) | `local-native-approved-divergences.json:530` |
| Wire fallback-router into the 002/003 merge as a bonus | Scope creep; merge must be clean verifiable rename+nesting (R8) | `004/spec.md:42-48,90-96` |

---

## 4. CONFIRMATIONS vs CORRECTIONS vs NEW RISKS (summary for 002/003 plan revisions)

| # | Type | One-liner | Feeds into |
|---|------|-----------|------------|
| F1.1/F1.2 | CONFIRM | Layout + runtime-as-infra correct | 002 |
| F1.3 | CLARIFY | Runtime doc families move as a unit | 002 Stage 2 |
| F1.4 | NEW RISK (low) | Two package.json under one skill | 002 REQ-007 |
| F2.1/F2.2 | CONFIRM | Reverse (−1 hop) + forward (hop-unchanged) rules correct | 002 Stage 3a |
| F2.3 | CORRECTION | Rule conflates absolute + relative paths | 002 Stage 3a plan text |
| F2.4 | NEW RISK | compile-command-contracts.cjs densest + hash-cascade | 002/003 exit gate |
| F2.5 | CONFIRM | fanout-run.cjs absolute forward path | 002 Stage 3a |
| F3.1/F3.2 | CONFIRM | Forward borrow "one more .."; reverse glob expansion | 002 Stage 3b |
| F3.3 | CORRECTION | Borrow surface ~6–8 sites, not 4 | 002 Stage 3b file-list |
| F3.4 | NEW RISK | Live import = hard failure, not silent hole | 002 Stage 3b atomicity |
| F3.5 | CLARIFY | Borrow has two natures (tooling vs code) | follow-up decoupling |
| F4.1 | CONFIRM | Advisor constant pair unguarded | 003 Stage C |
| F4.2 | CONFIRM+AMPLIFY | Divergences ledger 40+ entries | 003 REQ-004 |
| F4.3 | NEW RISK | runtime-target divergence anomaly | 003 decision |
| F4.4 | NEW RISK | Parity tests as loud guard, 11+ invariants | 003 advisor exit gate |
| F4.5 | NEW RISK | Drift-guard self-references old path | 003 REQ-001 ordering |
| F4.6 | CONFIRM | Commands 434 hits, hash-guarded | 003 Stage A |
| F5.1 | CONFIRM | Zero live callers | 004 premise |
| F5.3 | DECISION | Defer wiring to post-merge | 004 scheduling |
| F5.4 | CONFIRM | Intra-runtime import merge-stable | 004 |
| F5.5 | CONFIRM | glm→mimo edge already a recipe | 004 ModelRegistry |

---

## 5. CONVERGENCE REPORT

| Field | Value |
|-------|-------|
| Stop reason | `converged` (gates: convergence/coverage/quality/graph all pass) |
| Iterations completed | 5 |
| Questions answered | 5 / 5 (100%) |
| Avg newInfoRatio | 0.62 (trend: 1.0 → 0.85 → 0.6 → 0.45 → 0.2) |
| Composite stop score | 0.74 (> 0.60 threshold) |
| minIterations floor | 3 (met at iteration 3; loop continued for full coverage) |
| Stuck events | 0 |
| Source diversity | 6 skills + 24 command files + advisor corpus (no single weak source) |

---

## 6. REFERENCES

- Design under test: `052-deep-loop-unification/{002-hub-rename-and-runtime-nesting,003-external-reference-migration,004-fallback-router-wiring}/spec.md`
- Primary evidence trees: `.opencode/skills/deep-loop-runtime/`, `.opencode/skills/deep-loop-workflows/`, `.opencode/skills/system-spec-kit/`, `.opencode/skills/system-skill-advisor/`, `.opencode/commands/deep/`
- Sibling skill context: `sk-prompt-models/references/quota_fallback.md`, `pattern_index.md`

*Authored by detached fan-out lineage glm52-2 (GLM-5.2, reasoningEffort max). For cross-lineage consolidation see `../fanout-attribution.md` (written by `fanout-merge.cjs` after all replicas terminate).*
