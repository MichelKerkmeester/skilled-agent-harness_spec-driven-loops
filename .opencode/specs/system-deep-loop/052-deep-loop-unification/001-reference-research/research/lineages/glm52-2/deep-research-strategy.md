# Deep Research Strategy — glm52-2 (detached fan-out lineage)

> Lineage: `glm52-2` (family `glm52`, replica 2/5). Executor: cli-opencode `zai-coding-plan/glm-5.2` (reasoningEffort max). stopPolicy: convergence. maxIterations: 5.

## 2. TOPIC
Validate and stress-test the merge design for folding `deep-loop-runtime` into `deep-loop-workflows` as a unified `system-deep-loop` skill — covering five sub-questions: (1) structural layout, (2) bidirectional path-coupling repair, (3) the system-spec-kit tooling-borrow, (4) reference migration across commands/agents/READMEs/advisor-corpus, and (5) whether `fallback-router.ts` should be wired for real GLM-5.2 → MiMo-v2.5-Pro fallback.

The design under test lives in children 002/003/004 of packet `052-deep-loop-unification`, authored by three parallel sonnet-5 Plan agents. This lineage independently confirms, corrects, or surfaces new risks.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

All questions answered — see §6.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Executing ANY part of the merge (read-only investigation; children 002–005 own execution).
- Renaming `/deep:*` commands or `@agent` names (frozen by design).
- Touching `.opencode/specs/**` historical mentions (~3622) or `.worktrees/**` (17 checkouts) — non-breaking history.
- Modifying `deep-loop-workflows`/`deep-loop-runtime` source.

## 5. STOP CONDITIONS
- All five key questions have evidence-backed answers, AND
- Composite novelty converges below threshold after the `minIterations: 3` floor, OR
- `maxIterations: 5` reached.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] **Q1** (iter 1) — Layout CONFIRMED correct; clarification (doc families move as unit) + low risk (two package.json).
- [x] **Q2** (iter 2) — Directional rule CONFIRMED for relative requires; CORRECTION (absolute literals separate class); RISK on dense compile-command-contracts.cjs.
- [x] **Q3** (iter 3) — Borrow CONFIRMED both directions; CORRECTION surface ~6-8 not 4; RISK live import = hard failure.
- [x] **Q4** (iter 4) — Surface CONFIRMED; NEW RISKS: runtime-target anomaly (:530), parity-test volume (11+), drift-guard self-reference.
- [x] **Q5** (iter 5) — Zero callers CONFIRMED; recommend DEFER to post-merge (004).
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- One-question-per-iteration focus: each pass produced a decisive CONFIRM/CORRECTION/RISK (iters 1-5)
- file:line-grounded evidence: every finding cites a concrete path, enabling direct cross-lineage dedup (iters 1-5)
- Relative-vs-absolute classification first (iter 2): caught the rule-conflation correction before any blind find/replace
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- (none — no stuck/timeout/error iterations)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Blind text-substitution -- BLOCKED (iter 2,4)
- What was tried (conceptually): uniform hop-math or find/replace across all deep-loop-* strings
- Why blocked: wrong for absolute literals (F2.3); destroys advisor reason narration (F4.2); mishandles runtime-target anomaly (F4.3)
- Do NOT retry: classify each site (relative-require / absolute-literal / advisor-label-key) before editing

### In-merge fallback-router wiring -- PRODUCTIVE-rejected (iter 5)
- What was tried: fold 004 into 002/003 as a bonus
- Why blocked: scope creep; genuine feature work, not rename/nesting
- Prefer for: ship 004 as independent post-merge hardening (intra-runtime import is merge-stable)
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Split runtime lib across mode packets (iter 1) — destroys one-frozen-backend invariant
- Apply hop-math uniformly to all deep-loop-* strings (iter 2) — wrong for absolutes
- Defer tooling-borrow to 003 (iter 3) — live import = hard failure
- Blind find/replace on advisor corpus (iter 4) — destroys reason narration + anomaly
- Wire fallback-router into merge (iter 5) — scope creep
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- F4.3: operator decision needed in 003 — re-point or remove the `deep-loop-runtime` divergence entry at line 530?
- F1.4: confirm `package_skill.py --check` tolerates nested package.json (002 REQ-007) at execution time.
- 003 open question: does a singleton deep-loop family still warrant a `family` tag in skill-graph.json? (left to advisor rebuild operator)
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
COMPLETE — all five questions answered, convergence reached. No further iterations. Canonical synthesis in `research.md`.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT

### Bounded Context Snapshot

**Source pointers (the two trees under merge):**
- `.opencode/skills/deep-loop-workflows/` — hub: `SKILL.md`, `mode-registry.json`, `hub-router.json`, 4 mode packets (`deep-research`, `deep-review`, `deep-ai-council`, `deep-improvement`), `shared/{rollout,progress,...}`, `benchmark/`, `manual_testing_playbook/`.
- `.opencode/skills/deep-loop-runtime/` — backend: `lib/{deep-loop,coverage-graph,council}/` (30 modules), `scripts/` (13 `.cjs`), `database/` (2 SQLite), `tests/`, `feature_catalog/`, `references/`, `package.json`, `tsconfig.json`, `vitest.config.ts`.

**Bidirectional coupling (verified this session):**
- Reverse (workflows-content → runtime): `deep-research/scripts/reduce-state.cjs:15,20` (`../../../deep-loop-runtime/lib/...`), `deep-research/scripts/runtime-capabilities.cjs:18`, `deep-ai-council/scripts/replay-graph-from-artifacts.cjs:26,56,65`, + 4 test files (`../../../../deep-loop-runtime/lib/council/...`).
- Forward (runtime → workflows-content): `runtime/scripts/render-command-contract.cjs:11` (`../../deep-loop-workflows/shared/rollout/...`), `compile-command-contracts.cjs:15-288` (~36 absolute `.opencode/skills/deep-loop-workflows/...` paths), `check-contract-drift.cjs:40-42`, `fanout-run.cjs:942-943`, + 7 test files.
- Tooling-borrow (runtime ⇄ system-spec-kit): `runtime/package.json:11` (`../system-spec-kit/node_modules/.bin/tsc`), `runtime/tsconfig.json:13` (`../system-spec-kit/node_modules/@types`), `system-spec-kit/mcp_server/vitest.config.ts:20` (`../deep-loop-runtime/tests/**`), `mcp_server/tests/memory-runtime-retention.vitest.ts:9` (`../../../deep-loop-runtime/lib/...`).

**fallback-router:** grep of `runtime/scripts/` for `fallback-router|resolveFallback` → **zero hits**. Only `tests/unit/fallback-router.vitest.ts` and docs reference it. `fanout-pool.cjs` does same-model retry only.

**Reuse candidates / design artifacts:** children `002/003/004/005` spec.md already authored; `001/plan.md` carries the exact `--executors` payload.

**Constraints & risks:** spec 003 cites 948 non-noise external refs; advisor corpus (`MERGED_DEEP_SKILL_ID` in `skill_advisor.py` + `aliases.ts`, divergences ledger, parity tests) is highest-risk; runtime carries 2 writer-locked SQLite DBs mid-move.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (newInfoRatio)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7–11A
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-07-08T00:00:00Z
