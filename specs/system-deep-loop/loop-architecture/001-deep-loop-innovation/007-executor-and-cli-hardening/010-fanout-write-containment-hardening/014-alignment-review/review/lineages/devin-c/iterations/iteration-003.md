# Iteration 3: Traceability — SKILL.md against references and assets (core protocols)

## Focus

Dimension: traceability. Surface: SKILL.md against references/assets (packet scope item 3) plus core protocols `spec_code` and `checklist_evidence` against the packet docs. Files: `.opencode/skills/system-deep-loop/SKILL.md`, `mode-registry.json`, `ROUTER.md`, `hub-router.json`, `leaf-manifest.json`, `.opencode/skills/system-deep-loop/deep-review/SKILL.md` and its `references/`, `.opencode/skills/cli-external-orchestration/SKILL.md` + `mode-registry.json`, `.opencode/skills/sk-code/SKILL.md` + `mode-registry.json`, packet `spec.md`/`tasks.md`/`acceptance-criteria.md`/`goal.md`.

## Scorecard

- Dimensions covered: traceability
- Files reviewed: 12
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.11

## Findings

### P0, Blocker
(none)

### P1, Required
(none)

### P2, Suggestion
- **F005**: Hub SKILL.md improvement-mode count contradicts mode-registry.json and itself, `.opencode/skills/system-deep-loop/SKILL.md:80`. Line 80 states "the 3 improvement modes all share the system-deep-loop/deep-improvement/ packet", but `mode-registry.json` — declared the single source of truth at SKILL.md:37 and :100 — registers exactly two improvement lanes (`agent-improvement`, `model-benchmark`; registry comment at line 16: "the two improvement lanes (agent/model) multiplex onto one shared packet"), and the same SKILL.md line 58 says "the two improvement lanes `agent-improvement` and `model-benchmark`". A reader following line 80 would look for a third improvement mode the registry does not define.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | mode-registry packet resolution vs hub SKILL.md:80 | All 5 registry modes resolve to existing packets with SKILL.md; one counting claim drifts (F005) |
| checklist_evidence | pass | hard | tasks.md / acceptance-criteria.md / goal.md | No `[x]` completion marks anywhere in the packet docs; the only `[x]` literals are notation/syntax references — no unsupported completion claims |

## Assessment

- New findings ratio: 0.11
- Dimensions addressed: traceability
- Novelty justification: F005 is new; the registry-vs-prose mode count was not previously recorded in this lineage.

## Ruled Out

- Missing mode packets: ruled out — mode-registry.json entries for system-deep-loop (5), cli-external-orchestration (7), and sk-code (6) all resolve to existing packet dirs with SKILL.md files.
- Worktree-mechanism residue in catalogs/playbooks: ruled out — no `worktree` matches in `feature-catalog/`, `manual-testing-playbook/`, hub SKILL.md, or deep-review SKILL.md (the remediation removed it as the packet claims).
- deep-review SKILL.md vs references drift: ruled out on sampled claims — append-gateway mechanism (SKILL.md:60 vs YAML:99), reducer ownership (SKILL.md:61), generate-context save owner (SKILL.md:377), verdict final-line contract (SKILL.md:339-359 vs review-mode-contract.yaml verdicts), and runtime agent paths (`.opencode/agents/*.md`, `.claude/agents/*.md`) all agree with the referenced assets.
- checklist_evidence failures: ruled out — no checked items exist to support.

## Dead Ends

- Chasing "3 improvement modes" through the runtime ledgers: `deep-improvement-common` exists as a ledger-event mode alias in `append-mode-event.cjs:104`, not as a registry mode; the registry's two-lane model is authoritative for routing.

## Recommended Next Focus

Iteration 4: traceability overlays — deep-loop agent alignment across runtimes (`skill_agent`, `agent_cross_runtime`) plus feature catalog and manual-testing-playbook claims (`feature_catalog_code`, `playbook_capability`).

Review verdict: PASS
