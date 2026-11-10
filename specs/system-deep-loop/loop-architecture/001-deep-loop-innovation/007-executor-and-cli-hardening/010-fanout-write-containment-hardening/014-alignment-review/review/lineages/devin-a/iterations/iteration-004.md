# Iteration 4: SKILL.md vs References/Assets + Feature Catalog and Playbook Alignment

## Focus

Lane 3 + Lane 2 of the packet spec: for `system-deep-loop`, its modes, `cli-external-orchestration` and its cli-* modes, and `sk-code`, whether each SKILL.md's routing, rules and claims match the files under its `references/` and `assets/`; then the `feature-catalog/` and `manual-testing-playbook/` trees under system-deep-loop (hub, runtime, deep-research, deep-review) against the runtime as shipped.

Files reviewed:
- `.opencode/skills/system-deep-loop/SKILL.md` (lines 22-27, 57-60, 80, 120, 161)
- `.opencode/skills/system-deep-loop/mode-registry.json` (programmatic read: 5 modes)
- `.opencode/skills/system-deep-loop/feature-catalog/feature-catalog.md` (lines 15, 31, 35, 71)
- `.opencode/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md` (lines 24-26, coverage note)
- `.opencode/skills/system-deep-loop/manual-testing-playbook/compiled-routing/ordered-bundle-deep-mode-compiled-routing.md` (line 2: DL-CR-001)
- `.opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-cli-lineages-review.md` (lines 3, 21-31)
- `.opencode/skills/system-deep-loop/deep-improvement/feature-catalog/feature-catalog.md` (lines 23-24: Lane A/Lane B)
- `.opencode/skills/system-deep-loop/ROUTER.md` (line 23)
- `.opencode/skills/cli-external-orchestration/SKILL.md` (lines 3, 15, 74)
- `.opencode/skills/cli-external-orchestration/ROUTER.md` (lines 24-70)
- `.opencode/skills/cli-external-orchestration/mode-registry.json` + `leaf-manifest.json` (programmatic read: 7 modes)
- `.opencode/skills/sk-code/SKILL.md` (routing claims, re-checked)

## Scorecard

- Dimensions covered: traceability, maintainability
- Files reviewed: 12
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.27

## Findings

### P1, Required

- **F008**: The hub feature catalog claims a non-existent `alignment` workflowMode and a seven-mode registry, `.opencode/skills/system-deep-loop/feature-catalog/feature-catalog.md:15,31,35`. The catalog states the hub "classifies a request into one of seven `workflowMode` packets (`research`, `review`, `ai-council`, `alignment`, and the three improvement lanes)" and that `runtimeLoopType` splits "research/review/ai-council/alignment" from "the three improvement lanes". The actual `mode-registry.json` — which the same catalog names "the single source of truth" — registers exactly five modes: `research`, `review`, `ai-council`, `agent-improvement`, `model-benchmark`. There is no `alignment` mode anywhere in the skill tree (no registry entry, no command, no agent, no packet; grep across the skill excluding benchmark reports returns only this catalog). The improvement family has two lanes, not three. The catalog's own `last_updated: 2026-07-21` predates the current registry state. Dimension: traceability.

### P2, Suggestion

- **F009**: `system-deep-loop/SKILL.md` contradicts itself on the improvement-lane count, `.opencode/skills/system-deep-loop/SKILL.md:27` vs `.opencode/skills/system-deep-loop/SKILL.md:161` and `:120`. Section 1's mode table says "improvement (2 lanes)" and section 2's discriminator says "the two improvement lanes `agent-improvement` and `model-benchmark`"; section 7 says "improvement (3 lanes)" and the ALWAYS rule at line 120 says "the three improvement lanes stay distinct". The registry (2 lanes) and the deep-improvement packet catalog (Lane A / Lane B) confirm two. Dimension: maintainability.

- **F010**: `cli-external-orchestration/ROUTER.md` stage-2 leaf sets cover six modes while the registry and leaf-manifest register seven, `.opencode/skills/cli-external-orchestration/ROUTER.md:24-70` vs `.opencode/skills/cli-external-orchestration/mode-registry.json`. `cli-hermes` has a registry entry, a leaf-manifest entry, and a mode packet, but no ROUTER.md leaf section; SKILL.md:74's "all six modes" sits against the same file's "seven workflow modes" (line 3, 15). Either the ROUTER is missing the hermes leaf set or the exclusion is deliberate but undocumented in the SKILL.md. Dimension: traceability.

## Claim Adjudication

### F008 (P1)

```json
{
  "findingId": "F008",
  "claim": "The system-deep-loop hub feature catalog asserts a seven-mode registry containing an `alignment` workflowMode and three improvement lanes; the shipped mode-registry.json has five modes, no alignment, and two improvement lanes.",
  "evidenceRefs": [
    ".opencode/skills/system-deep-loop/feature-catalog/feature-catalog.md:15",
    ".opencode/skills/system-deep-loop/feature-catalog/feature-catalog.md:31",
    ".opencode/skills/system-deep-loop/feature-catalog/feature-catalog.md:35",
    ".opencode/skills/system-deep-loop/mode-registry.json:modes[]"
  ],
  "counterevidenceSought": "Programmatically read mode-registry.json (5 modes enumerated); grepped the entire system-deep-loop skill tree for an alignment workflowMode (only the catalog mentions it); checked commands (agent-improvement/ai-council/model-benchmark/research/review — no alignment), agents, and packets.",
  "alternativeExplanation": "alignment may be a retired mode whose removal during the 045 remediation was not propagated to the catalog — that is exactly the drift this packet exists to catch, and the catalog is dated 2026-07-21, before the remediation round.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "If an `alignment` mode is re-registered in mode-registry.json with a packet and command, downgrade to P2 stale-timing note.",
  "transitions": [{"iteration": 4, "from": null, "to": "P1", "reason": "Initial discovery"}]
}
```

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| feature_catalog_code | fail | advisory | feature-catalog.md:15,31,35 vs mode-registry.json | Material false claim: alignment mode and seven-mode count (F008) |
| playbook_capability | partial | advisory | deep-review/manual-testing-playbook/fanout/fanout-cli-lineages-review.md:3,21-31 vs deep-review-auto.yaml:2042-2079 | Fan-out scenario structural claims verified (step_fanout_merge/bind_from_output/step_derive_verdict exist); DL-CR-001 bundle exists; full end-to-end execution not performed |
| skill_agent | partial | advisory | SKILL.md:27,161 vs mode-registry.json | Lane-count contradiction within SKILL.md (F009); cli-external ROUTER six-vs-seven (F010) |

## Assessment

- New findings ratio: 0.27 (1 P1 + 2 P2; weighted 7 of accumulated 26)
- Dimensions addressed: traceability, maintainability
- Novelty justification: first pass over catalogs/playbooks and hub SKILL.md-vs-registry claims; all first-seen
- Verdict mapping: P1 present (no P0) -> CONDITIONAL

## Ruled Out

- Worktree remnants in catalogs/playbooks: `grep -rn worktree` across all 12 catalog/playbook trees under system-deep-loop returns zero hits — the packet's "worktree mechanism removed" claim holds.
- Playbook fan-out scenario fiction: the deep-review fanout playbook names step_fanout_merge/bind_from_output/step_derive_verdict — all present in deep-review-auto.yaml (lines 2042, 2051, 2079). Ruled out.
- DL-CR-001 missing bundle: the compiled-routing bundle file exists with `id: DL-CR-001` in frontmatter. Ruled out.
- Hub playbook lane count: the manual-testing-playbook coverage note names exactly the two registered improvement lanes. Ruled out.

## Dead Ends

- Full execution of every playbook scenario (requires interactive CLI runs): out of scope for a read-only lineage; structural claim verification done instead.

## Recommended Next Focus

Iteration 5: general architecture — the shared-checkout containment model, the fan-out runner, the merge and reducers, and the dispatch adapters read as one system: contradictions, dead paths, duplicated rules; verify the runner's containment checks (foreign-run scan, lock files), merge strongest-restriction semantics, and the reducer's route-proof/registry consistency with what this lineage observed.

Review verdict: CONDITIONAL
