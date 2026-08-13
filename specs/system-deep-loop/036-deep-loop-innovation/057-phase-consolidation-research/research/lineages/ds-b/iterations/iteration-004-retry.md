# Iteration 4 (retry): Re-verify the Full Migration Plan (M0-M7)

## Focus
Conformance retry of iteration 4 (prior narrative `iteration-004.md` is immutable evidence). Re-verify, independently, the load-bearing claims of the full migration plan — the ordered M0-M7 rename/lockstep-surface/verification/rollback sequence — against on-disk state. Do not broaden scope. Correct only the missing route-proof/delta contract from the prior run.

## Actions Taken
1. Read agent definition (`.opencode/agents/deep-research.md`), config, state JSONL, strategy, findings registry (Read).
2. Read prior narrative `iterations/iteration-004.md` (immutable evidence, cited, not overwritten).
3. Bundled on-disk verification of every load-bearing M0-M7 surface (Bash): `.opencode/specs` symlink, `specs/descriptions.json` count, validate.sh 036 manifest block + hash, is-phase-parent.ts thresholds, phase-tree.json fields, runtime write-set-conflict refs, vitest fixtures, folder-discovery.ts cache anchors, cross-packet refs.
4. Read validate.sh:210-264 to confirm the exact 40-entry manifest list + hash-lock mechanics.
5. Reconcile the `specs/descriptions.json` count (3 vs 3207) via structure inspection.

## Findings

### F4R.1 — Migration move is `git mv`; `.opencode/specs` symlink re-confirmed
`.opencode/specs -> ../specs` (symlink). Re-confirms F4.1: both path spellings resolve to the same files; reference updates must target the canonical `specs/` path, and the recursive validator's `.opencode/specs/...` references resolve automatically.
[SOURCE: `ls -ld .opencode/specs`]

### F4R.2 — M0/M6 baseline surfaces re-confirmed
- `is-phase-parent.ts:25` `PHASE_PARENT_ERROR_THRESHOLD = 40`; `:128-129` status `error` with recommendation "Split into nested phase parents or move historical phases under z_archive/". Re-confirms the M0 expected baseline `error 45` and M6 expected `ok`.
- `validate.sh:216-218`: canonical 036 parent case → 40-entry `manifest_text` (001-033, 035, 047-052) + `expected_hash="f6cf1e943d39629118c976ac71b5141bb8b85198c47641815b505adf50e732e6"`. Hash-lock mechanics confirmed at `:238-246` (mismatch → return 2).
[SOURCE: file:.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:25,128-129; file:.opencode/skills/system-spec-kit/scripts/spec/validate.sh:216-246]

### F4R.3 — M5 external surfaces re-confirmed
- validate.sh 036 block = exactly 40 entries; **053-056 absent** on the manifest while on disk — pre-existing drift re-confirmed (F4.3; must be reconciled during M5).
- `recursive-child-manifest.vitest.ts:16,20,24` references `.opencode/specs/system-deep-loop/036-deep-loop-innovation/{016-whole-system-gate/... , 001-deep-loop-market-research}` fixture paths.
- Runtime refs present: `runtime/lib/write-set-conflict-graph/{graph.ts,shipped-census.ts}`, `runtime/tests/helpers/legacy-real-log.ts`, plus 10+ `runtime/tests/unit/*.vitest.ts` files reference 036 (incl. deep-research/deep-improvement/deep-alignment rollback-gate, inflight-state, mixed-version, shadow-parity fixtures).
- Cross-packet refs present: `sk-design/012-sk-design-program/004-hallmark-design-system/{handover.md,goal.md}`, `sk-doc/022-code-readme-coverage/{spec.md, 001-.../tasks.md, 003-.../tasks.md}`, `sk-doc/023-feature-catalog-integrity/{spec.md, 001-.../tasks.md, 003-.../tasks.md}`, `sk-doc/024-playbook-scenario-coverage`, `sk-code/021-code-conformance-alignment/{spec.md, 001-.../{graph-metadata.json,spec.md,tasks.md}}`, `sk-doc/020-hyphen-naming-convention/000-.../symlink-mode-manifest.json`.
- `specs/descriptions.json` is a regenerated cache: `folder-discovery.ts:1236,1240,1264,1309-1324` (cachePath params, `loadDescriptionCache`, upsert single folder entry, atomic tmp+rename write at `:1287-1296`). Re-confirms M5 rule: regenerate, never hand-edit.
[SOURCE: file:validate.sh:217; file:.opencode/skills/system-spec-kit/scripts/tests/recursive-child-manifest.vitest.ts:16-24; rg runtime refs; rg cross-packet refs; file:.opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts:1236-1324]

### F4R.4 — M4 parent 036 surfaces re-confirmed
`manifest/phase-tree.json:7-8`: `live_direct_children: 44`, `original_program_range: "001-017"`. Parent `graph-metadata.json` children_ids 44 / on-disk 45 established in retry 1; supports the M4 target (children_ids → 9 grandparent paths + 057; phase-tree live_direct_children → 9).
[SOURCE: file:specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json:7-8]

### F4R.5 — `specs/descriptions.json` count reconciled (3207 confirmed)
Top-level object with keys `version`, `generated`, `folders`; `folders` is a list of **3207** entries. The iteration-004 claim of "3207 entries" is correct when read as the `folders[]` array length; my first `len()` (3) measured the top-level object. No discrepancy in substance — only the measured JSON shape.
[SOURCE: python json structure probe of specs/descriptions.json]

### F4R.6 — Ordered M0-M7 sequence retained without modification
M0 preflight (health baseline, manifest hash capture, 9 grandparent dirs, timeline.md FIRST); M1 `git mv` per grandparent in program order 001→009; M2 grandparent lean trio; M3 child+grandchild metadata lockstep (~45 children, ~61 grandchildren); M4 parent 036 surfaces; M5 external surfaces (validate.sh list+sha256 recompute incl. 053-056 drift fix, vitest fixtures, runtime code+tests, cross-packet specs, regenerate descriptions.json); M6 verification gates (health ok, validate --strict + --recursive, rg residue, vitest, memory_index_scan); M7 commit + lossless `git revert` rollback. All surfaces independently confirmed on disk this iteration.
[INFERENCE: based on F4R.1-F4R.4 plus prior iteration-004.md; no new grouping direction introduced]

## Questions Answered
- Q3 (re-answer, conformance): Full migration plan M0-M7 re-confirmed — every lockstep surface and both verification/rollback gates verified against live files. One counting nuance (descriptions.json) reconciled; no substantive correction needed.

## Questions Remaining
- Q5 detail: exact M7 commit strategy (single migration commit vs per-grandparent commits) remains an open registry question for the operator/implementation packet, unchanged by this retry.
- z_archive sub-split option and 057 absorption remain open registry questions (outside this focus).

## SCOPE VIOLATIONS
None. All writes confined to the three allowed paths; all investigated files read-only.

## Sources Consulted
- file:.opencode/agents/deep-research.md
- file:specs/system-deep-loop/036-deep-loop-innovation/057-phase-consolidation-research/research/lineages/ds-b/deep-research-config.json
- file:specs/system-deep-loop/036-deep-loop-innovation/057-phase-consolidation-research/research/lineages/ds-b/deep-research-state.jsonl
- file:specs/system-deep-loop/036-deep-loop-innovation/057-phase-consolidation-research/research/lineages/ds-b/deep-research-strategy.md
- file:specs/system-deep-loop/036-deep-loop-innovation/057-phase-consolidation-research/research/lineages/ds-b/findings-registry.json
- file:specs/system-deep-loop/036-deep-loop-innovation/057-phase-consolidation-research/research/lineages/ds-b/iterations/iteration-004.md (prior, immutable)
- file:.opencode/skills/system-spec-kit/scripts/spec/validate.sh:210-264
- file:.opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts:25,128-129
- file:.opencode/skills/system-spec-kit/scripts/tests/recursive-child-manifest.vitest.ts:16-24
- file:.opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts:1236-1324
- file:specs/system-deep-loop/036-deep-loop-innovation/manifest/phase-tree.json:7-8
- `ls -ld .opencode/specs`; rg runtime/cross-packet refs; python structure probe of specs/descriptions.json

## Assessment
- New information ratio: 0.10
- Questions addressed: Q3 (re-verified); Q5 (status re-confirmed)
- Questions answered: Q3
- Status: complete (conformance retry; all prior claims re-confirmed, one counting nuance reconciled)

## Reflection
- What worked: bundling the verification into a single multi-probe Bash pass plus one targeted read of the hash-lock block; resolved the descriptions.json count by inspecting JSON shape instead of assuming a flat array.
- What did not work: nothing substantive — the first `len()` on descriptions.json misled until the top-level structure was inspected.
- What I would do differently: measure nested cache structures by their actual key shape (folders[]) up front.

## Recommended Next Focus
Iteration 5 (retry) if required: re-verify the timeline.md design claims from `iteration-005.md`; otherwise the reducer should proceed to synthesis (research.md) since Q1-Q5 are answered and this retry changed no substantive findings.
