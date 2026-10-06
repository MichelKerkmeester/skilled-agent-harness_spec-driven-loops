---
title: "Deep Review Iteration 009 — cli orchestrators, Jev classifier, skill-advisor surfaces"
trigger_phrases: []
---

# Iteration 9: Maintainability — cli-external-orchestration, cli-classifier (Jev), system-skill-advisor

## Focus

Dimension: **maintainability**. Slice: the two `cli-*` hubs and the advisor's root metadata —
mode registries against the directories and SKILL.md tables they name, version agreement across
each hub's surfaces, alias vocabulary against both routing stages, and the fleet-wide
skill-root metadata contract. Per `skill-hub-routing.md`, this iteration reports surface
consistency only; it does not claim a live route.

## Files Reviewed

- `cli-external-orchestration/mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `SKILL.md`, `description.json`, `graph-metadata.json` (and `cli-*` mode directories)
- `cli-classifier/mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `SKILL.md`, `description.json`, `graph-metadata.json`, `cli-jev/`
- `system-skill-advisor/SKILL.md`, `graph-metadata.json`, `leaf-manifest.json`, `leaf-aliases.json`
- `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` (class matrix)
- Executed: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` (read-only mode)

## Findings

### P0 Findings

None.

### P1 Findings

None new. Carried: F001 and F002 remain active (unchanged this iteration).

### P2 Findings

None new. Carried: F003-F007 remain active (unchanged this iteration).

## Claim Adjudication

No new findings, so no new packets. The one discipline note: routing is not claimed. `skill-hub-routing.md` §2-3 says a mode is only "routed" after both stages are replayed with a real request and the per-hub gate is read with its hub argument; the advisor CLI is daemon-backed and a live run could write outside this lineage's containment, so what follows is surface consistency, checked statically and with the repo's own metadata gate.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | carried partial (iteration 8) | Unchanged this iteration. |
| `checklist_evidence` | carried partial (iteration 8) | Unchanged this iteration. |
| `skill_agent` | pass (surface level) | Registry packets and mode directories agree on both hubs; the `cli-*` mode directories under `cli-external-orchestration` match the 7 registry modes exactly, each with a `SKILL.md`; `cli-classifier`'s single `cli-jev` mode matches its directory. |
| `agent_cross_runtime` | not applicable here | Runtime-mirror parity is the scheduled iteration 13 slice. |

## Ruled Out

- "A registered cli mode has no packet": ruled out — for both hubs, the registry's `packet` set equals the on-disk `cli-*` directory set, and every packet carries `SKILL.md` (7 + 1 checked).
- "The hub SKILL.md tables drifted from the registries": ruled out — every registered `workflowMode` appears in its hub's `SKILL.md` (counts 6-10 mentions each).
- "Version drift across a hub's surfaces": ruled out — `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json` and the latest changelog all read `1.7.1.0` for `cli-external-orchestration` and `0.8.0.0` for `cli-classifier`.
- "A mode alias is dead vocabulary nothing routes": ruled out for both hubs — every alias in each `mode-registry.json` is present in the hub's `hub-router.json` (stage two), and the hub `graph-metadata.json` carries the stage-one vocabulary (substring check over all aliases; derived phrase coverage is complete for the cli-external-orchestration set and partial for Jev, whose remaining aliases are the ones the router resolves).
- "The advisor root misclassifies its metadata class": ruled out — `system-skill-advisor` declares neither `mode-registry.json` nor `hub-router.json`, so it is class S, for which `description.json` is forbidden and `graph-metadata.json` + `leaf-manifest.config.json` are the authored files; its root listing matches exactly.
- "The fleet's root metadata has drifted from the class matrix": ruled out by execution — `ci-skill-root-metadata.cjs` (no `--fix`) reports `checked=14 passed=14 failed=0 fixed=0`, exit 0, with the 7 class-H roots carrying `description.json` and the 7 class-S roots carrying neither hub file nor `description.json`, exactly as the contract's fleet table states.

## Dead Ends

- Replaying stage one with a live advisor request: not attempted — the advisor CLI is daemon-backed and could write state outside the lineage; the static alias-versus-router check substitutes for it here and the limitation is stated rather than hidden.

## Assessment

- New findings ratio: 0.0 (no new findings; weighted new = weighted total = 0)
- Dimensions addressed: maintainability
- Novelty justification: this slice executed the repo's own fleet gate and cross-checked every registry surface against its files. All checks pass; the negative knowledge (what was checked and how) is recorded above so the synthesis can weight it.

## Next Focus

Dimension: correctness. Focus area: `system-skill-advisor` runtime — advisor scoring/routing internals, the hook brief surface, and the daemon CLI contract, following any path into `system-spec-kit` the findings point to. Required evidence: file:line per claim; executed reads where a CLI contract is asserted. Rotations status: correctness slice 7 of 7.

Review verdict: CONDITIONAL
