# Iteration 3: The runtime layer — lane libraries, authority flip order, projections, census, gateway adapter

## Focus

Inventory `.skilled/skills/system-deep-loop/runtime/` for agent-improvement wiring: the three dedicated lane libraries, the mode-append gateway adapter, the per-mode authority flip order, legacy projections, the write-set conflict census, the append CLI, the machine-local authority state dir, and runtime tests.

## Actions Taken

1. Runtime tree overview (54 libs, 146 unit tests) plus ranked `rg -c "agent-improvement"` across the runtime (non-node_modules).
2. Read the three lane library READMEs (`agent-improvement-ledger-schema`, `-reducers`, `-sealed-artifacts`) and listed `deep-improvement-common-*` libraries.
3. Read `lib/per-mode-authority-flip/types.ts` (union + frozen order) and `lib/authority-root/resolve-authority-root.ts`.
4. Grepped `lib/legacy-projections/`, `lib/write-set-conflict-graph/shipped-census.ts`, `lib/mode-append-gateway/append-mode-event.ts`, `scripts/append-mode-event.cjs`, and the runtime `scripts/` + `lib/deep-loop/` + `lib/mode-contracts/` for mode mentions.
5. Listed `.skilled/skills/.state/authority/` and read its README; listed runtime improvement-related unit tests.

## Findings

1. **Three runtime libraries exist solely for the agent-improvement lane** — `lib/agent-improvement-ledger-schema/` (4 files: schema, types, index, README), `lib/agent-improvement-reducers/` (5 files), `lib/agent-improvement-sealed-artifacts/` (5 files). Each README declares "the Agent Improvement runtime lane" as its purpose. Disposition: DELETE (three subtrees). [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/README.md:12]
2. **The `deep-improvement-common-*` libraries are lane-shared** — `lib/deep-improvement-common-ledger-schema/`, `-reducers/`, `-sealed-artifacts/` serve both improvement lanes (the common authority mode `deep-improvement-common` sits between ai-council and agent-improvement in the flip order). Disposition: SHARED-WITH-MODEL-BENCHMARK. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-improvement-common-ledger-schema/README.md:1]
3. **`lib/per-mode-authority-flip/types.ts` pins agent-improvement in two type-level lists** — the `CutoverCertificateMode` union (line 21) and the frozen `AUTHORITY_FLIP_MODE_ORDER` (line 134: deep-research, deep-review, deep-ai-council, deep-improvement-common, agent-improvement, model-benchmark). The append gateway refuses any mode outside this order. Disposition: EDIT (drop the union member and order entry; gateway check then refuses the mode). [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/types.ts:134]
4. **`lib/mode-append-gateway/append-mode-event.ts` maps improvement modes to the `improvement-ledgers` family** at line 184 (`deep-improvement` | `improvement` | `deep-improvement-common` → `improvement-ledgers`). Disposition: SHARED-WITH-MODEL-BENCHMARK (EDIT with the lane; the family remains for Lane B/common). [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:184]
5. **`scripts/append-mode-event.cjs` is the CLI gateway whose adapter table imports the lane schema** — `normalizeMode()` maps `agent-improvement`/`deep-agent-improvement` (line 96), `resolveModeAdapter()` case `agent-improvement` imports `../lib/agent-improvement-ledger-schema/index.ts` (lines 134-141). Disposition: SHARED file, EDIT (remove the normalize alias and the adapter case when the lane dies). [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:134]
6. **`lib/legacy-projections/legacy-projection-manifest.ts` carries Lane A projection path templates** — lines 148, 156, 163 name `agent-improvement-config.json`, `agent-improvement-state.jsonl`, `agent-improvement-registry.json`, `agent-improvement-dashboard.md` inside `{spec_folder}/improvement/` families that also carry model-benchmark artifacts. Disposition: SHARED-WITH-MODEL-BENCHMARK (EDIT remove the Lane A tokens). [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts:163]
7. **`lib/legacy-projections/deep-improvement-ledgers-contract.ts` imports the lane schema and defaults to the lane** — import from `../agent-improvement-ledger-schema/index.js` (line 7), `scope.variant` defaults to `'agent-improvement'` (line 97), relativePath `improvement/agent-improvement-state.jsonl` (line 317). Disposition: SHARED-WITH-MODEL-BENCHMARK (EDIT; the lane-schema import is a harder edge — retarget to the common schema or drop). [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-improvement-ledgers-contract.ts:97]
8. **`lib/write-set-conflict-graph/shipped-census.ts` pins the lane as a shipped surface** — lane script paths at lines 115 and 117, packet id `005-agent-improvement` at line 407, directory `file:...scripts/agent-improvement` at line 434, `mode:agent-improvement` at lines 438 and 449. Disposition: EDIT (remove census rows; keep the census mechanism). [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/shipped-census.ts:434]
9. **Machine-local authority state carries no committed Lane A file** — `.skilled/skills/.state/authority/` ships only its README; `authority-<mode>.json` records are machine-local and git-ignored (record naming example in the README uses deep-research). No repository file to delete for the authority record itself; the mode key is owned by finding 3. Disposition: notes for planning (no action in-repo). [SOURCE: .skilled/skills/.state/authority/README.md:31]
10. **Improvement-family unit tests split lane vs shared** — lane-dedicated files `agent-improvement-ledger-schema.vitest.ts`, `agent-improvement-reducers.vitest.ts` (22 mentions), `agent-improvement-sealed-artifacts.vitest.ts` (117 mentions); mixed files `deep-improvement-ledgers-contract.vitest.ts`, `deep-improvement-common-*.vitest.ts`, `host-driven-improvement.vitest.ts`, `verify-authority-cli.vitest.ts`. Disposition: DELETE the three lane-dedicated test files; EDIT the mixed ones. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/agent-improvement-sealed-artifacts.vitest.ts:1]
11. **The mode-agnostic runtime core does not mention the lane** — `lib/deep-loop/` (executor config and loop infrastructure), `lib/mode-contracts/`, and the fanout scripts (`fanout-run.cjs`, `fanout-pool.cjs`, `fanout-merge.cjs`, `fanout-salvage.cjs`) returned no `agent-improvement` matches in the rc-search, so no edit is needed there for deletion planning beyond the registry-driven surfaces. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/]

## Ruled Out

- Expecting a committed `authority-agent-improvement.json`: the authority directory ships only its README; records are machine-local and git-ignored, and a never-written record simply defaults to `legacy_authoritative`.

## Dead Ends

- None; the runtime split cleanly into lane-dedicated libraries (delete), lane-shared/common surfaces (edit), and mode-agnostic core (untouched).

## Edge Cases

- Ambiguous input: "runtime libraries" could include the mode-agnostic core; resolved by reporting the negative search result for `lib/deep-loop/` and fanout scripts explicitly so deletion planning does not re-scan them.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-deep-loop/runtime/lib/ (54 libraries, ranked mention scan)
- .skilled/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/README.md:12-16
- .skilled/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/README.md
- .skilled/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/README.md
- .skilled/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/types.ts:21,134
- .skilled/skills/system-deep-loop/runtime/lib/authority-root/resolve-authority-root.ts:1-80
- .skilled/skills/system-deep-loop/runtime/scripts/verify-authority.cjs:89-214
- .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:184
- .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:96,100,134-141
- .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-manifest.ts:148,156,163
- .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-improvement-ledgers-contract.ts:7,97,317
- .skilled/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/shipped-census.ts:115,117,407,434,438,449
- .skilled/skills/.state/authority/README.md:31
- .skilled/skills/system-deep-loop/runtime/tests/unit/ (improvement-family test files)

## Assessment

- New information ratio: 0.9
- Questions addressed: KQ1 (runtime surface), KQ2 (authority flip order, projections, census as indirect wiring)
- Questions answered: none in full

## Reflection

- What worked and why: the runtime mention-rank scan surfaces dense lane libraries first, then a targeted grep over the remaining scripts/libs confirmed which shared files carry lane defaults.
- What did not work and why: nothing failed; the runtime core's zero-match result is itself decision-relevant.
- What I would do differently: for the advisor iteration, expect the same pattern (a small hardcoded projection surface plus a drift-guard test) and verify each map entry's exact line.

## SCOPE VIOLATIONS

- None.

## Recommended Next Focus

Iteration 4: `.skilled/skills/system-skill-advisor/` — the Python and TypeScript projection maps, alias groups and folds, the default-mode projection, skill-advisor registry entries, and the routing-registry drift guard.
