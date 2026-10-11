# Iteration 2: The deep-improvement packet — shared chassis, Lane A subtrees, loop host

## Focus

Inventory `.skilled/skills/system-deep-loop/deep-improvement/` (354 files): separate agent-improvement-exclusive subtrees from model-benchmark-shared ones, and trace where the lane defaults live (SKILL.md, loop-host.cjs, shared scripts, allowlist, READMEs, tests).

## Actions Taken

1. Full file inventory of the packet (354 files) with subtree listing of `scripts/` and `references/`.
2. `rg -c "agent-improvement"` across the packet to rank files by mention density.
3. Read packet `SKILL.md` mention set (21 hits) and `scripts/shared/loop-host.cjs` head plus mode-resolution logic.
4. Read `routing-allowlist.json`; grepped `scripts/shared/README.md`, `scripts/agent-improvement/README.md`, `references/shared/quick-reference.md`, packet `README.md`, `scripts/shared/tests/loop-host.vitest.ts`, `test-fixtures/`.

## Findings

1. **The packet SKILL.md is the shared chassis with Lane A as the default identity** — keywords line 17, lane table line 33, lane-awareness map line 74, `RESOURCE_MAP` Lane A entries lines 113-117 and `FULL_SETUP`/`ALWAYS` Lane A assets lines 119 and 123, Section 3 Lane A spec lines 205-213, byte-identical default contract lines 219-221, resume caveat line 258, per-iteration default benchmark line 260, script enumeration line 316. Disposition: SHARED-WITH-MODEL-BENCHMARK (EDIT the Lane A references; the packet survives only while Lane B does). [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/SKILL.md:219]
2. **`scripts/shared/loop-host.cjs` is the mode-switch host whose default and fallback are agent-improvement** — `VALID_MODES` line 42; `resolveMode()` returns `agent-improvement` for no flag (line 116) and for unknown modes (line 118-119); Lane A spawn map line 99; missing `--candidate` error line 169. Disposition: SHARED-WITH-MODEL-BENCHMARK (EDIT: the default/fallback semantics are Lane A-specific). [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:116]
3. **`scripts/agent-improvement/` is the Lane A script lane — exclusive to this mode** — 8 scripts (`benchmark-stability.cjs`, `candidate-lineage.cjs`, `check-mirror-drift.cjs`, `generate-profile.cjs`, `rollback-candidate.cjs`, `scan-integration.cjs`, `score-candidate.cjs`, `trade-off-detector.cjs`), its README (declares the lane at line 16) and a `tests/` dir. Disposition: DELETE (whole subtree). [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/README.md:16]
4. **`references/agent-improvement/` is the Lane A reference lane — exclusive** — 7 references (candidate-proposal-format, integration-scanning, mirror-drift-policy, profiling-audit-log, score-dimensions, stress-test-protocol, target-onboarding) loaded by `RESOURCE_MAP` lanes `LOOP_EXECUTION`, `EVALUATION_POLICY`, `PROMOTION_OPERATIONS`, `TARGET_ONBOARDING`, `INTEGRATION_SCAN` (SKILL.md lines 113-117). Disposition: DELETE. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/SKILL.md:116]
5. **`assets/agent-improvement/` is the Lane A asset lane — exclusive** — 8 files (improvement-charter.md, improvement-config-reference.md, improvement-config.json, improvement-strategy.md, README.md, target-manifest.jsonc, target-profiles/.gitkeep, target-profiles/README.md); two of the READMEs are declared intentionally unrouted in the allowlist. Disposition: DELETE. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/routing-allowlist.json:7]
6. **`references/shared/` and `scripts/shared/` are shared between the two lanes but carry Lane A as the named default** — shared README line 16 and 20 (`agent-improvement` default mode, loop-host single entry), line 22 (`promote-candidate.cjs` and `reduce-state.cjs` attribute missing/unknown modes to `agent-improvement`), line 82 (reduce-state mode bucketing), line 94 (lane ownership). Disposition: SHARED-WITH-MODEL-BENCHMARK (EDIT the Lane A defaults/mentions; the scripts themselves stay while Lane B exists). [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/README.md:22]
7. **`references/shared/quick-reference.md` is an operator cheat sheet written for the Lane A command** — `/deep:agent-improvement` invocation line 45, Lane A script walkthrough lines 52-58, runtime file naming family `agent-improvement-*` lines 86-89, Lane A reference pointer line 112. Disposition: SHARED-WITH-MODEL-BENCHMARK (EDIT). [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/references/shared/quick-reference.md:45]
8. **The env seam `DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP` names the lane** — documented in SKILL.md line 260 and implemented in `scripts/shared/mutation-coverage.cjs` (4 mentions). Disposition: SHARED-WITH-MODEL-BENCHMARK (EDIT env-seam naming). [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/SKILL.md:260]
9. **`routing-allowlist.json` carries two Lane A entries** — `assets/agent-improvement/README.md` and `assets/agent-improvement/target-profiles/README.md` (lines 7-8). Disposition: EDIT (remove those two entries; keep the three Lane B entries). [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/routing-allowlist.json:7]
10. **Packet `README.md` documents the Lane A command surface** — invoke line 24, example invocation line 49, script examples lines 58-64, lane table line 105, behavior-benchmark purpose line 193, reference table line 207. Disposition: SHARED-WITH-MODEL-BENCHMARK (EDIT). [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/README.md:105]
11. **`scripts/shared/tests/loop-host.vitest.ts` pins the Lane A default as tested behavior** — "defaults to agent-improvement when mode is absent" line 30, unknown-mode fallback line 37, "byte-identical invocation for default vs explicit agent-improvement" line 74. Disposition: SHARED-WITH-MODEL-BENCHMARK (EDIT or retire these cases with the lane; the byte-identity contract itself dies with Lane A). [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts:74]
12. **`test-fixtures/060-stress-test/README.md` names the Lane A stress scenario** — the only test-fixtures file mentioning agent-improvement. Disposition: likely DELETE (Lane A fixture); final classification in the tests iteration. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/test-fixtures/060-stress-test/README.md:1]
13. **Historical subtrees inside the packet** — `changelog/` (33+ Lane A version files) and `benchmark/reports/` (Lane A run reports incl. `2026-07-10--live-mode-b--live` and `router-mode-a` sets) record the lane's history. Disposition: KEEP-AS-HISTORY (verified in the history/docs iteration). [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/changelog/v1.9.0.0.md:1]

## Ruled Out

- Searching for an agent-improvement branch inside the runtime-loop convergence layer (`runtime/scripts/convergence.cjs`): the mode registry records `runtimeLoopType: null` and `backendKind: improvement-host`, so the lane has no runtime-loop surface to inventory; the loop-host seam is the orchestration owner.

## Dead Ends

- None; the packet surface resolved into lane-exclusive subtrees (`assets|references|scripts/agent-improvement/`) versus shared chassis (`SKILL.md`, `README.md`, `scripts/shared/`, `references/shared/`, allowlist, tests).

## Edge Cases

- Ambiguous input: the topic names "the deep-improvement packet and its loop host" as deletion targets, while `model-benchmark` also lives in the packet; resolved by classifying every shared surface SHARED-WITH-MODEL-BENCHMARK and every Lane A-only path DELETE so the sibling inventory can join.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-deep-loop/deep-improvement/ (full file inventory, 354 files)
- .skilled/skills/system-deep-loop/deep-improvement/SKILL.md:17,33,74,113-123,205-213,219-221,258,260,316
- .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:5-26,42,99,102,110-119,132-139,167-169
- .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/README.md:16,20,22,82,94
- .skilled/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/README.md:16,20
- .skilled/skills/system-deep-loop/deep-improvement/references/shared/quick-reference.md:37,45,52-58,86-89,112
- .skilled/skills/system-deep-loop/deep-improvement/routing-allowlist.json:1-9
- .skilled/skills/system-deep-loop/deep-improvement/README.md:24,49,58-64,105,193,207
- .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts:30,37,74
- .skilled/skills/system-deep-loop/deep-improvement/test-fixtures/060-stress-test/README.md

## Assessment

- New information ratio: 0.85
- Questions addressed: KQ1 (packet surface), partial KQ2 (shared-host defaults as indirect wiring)
- Questions answered: none in full

## Reflection

- What worked and why: counting mentions per file ranked the chassis files immediately; the subtree listing then separated lane-exclusive from shared paths without reading all 354 files.
- What did not work and why: nothing failed; the only `agent-improvement` string inside `assets/model-benchmark/` fixtures was absent, confirming lane purity there.
- What I would do differently: carry the "default-mode coupling" concept (loop-host default, reduce-state attribution, vitest byte-identity) forward as a named indirect-wiring class for the advisor and runtime iterations.

## SCOPE VIOLATIONS

- None.

## Recommended Next Focus

Iteration 3: `.skilled/skills/system-deep-loop/runtime/` — `lib/deep-loop/` registries and executor config, the `agent-improvement-ledger-schema` library, per-mode authority flip, scripts (append gateway adapters, fanout, reduce-state), and compiled/dist surfaces naming the mode.
