# Iteration 005: Hub Maintainability

## Dimension

- Dimension: maintainability
- Focus: hub-tier clarity for future maintainers, README currency, `extensions` block clarity, and safe follow-on change cost for adding another workflow packet.
- Status: complete

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review_core.md:28` - severity ladder loaded before final classification.
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md:85` - required next-focus instructions for this iteration.
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl:8` - latest prior iteration record.
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json:9` - cumulative active findings before this pass.
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/iterations/iteration-004.md:74` - latest narrative next-dimension handoff.
- `.opencode/skills/system-deep-loop/SKILL.md:37` - registry-driven routing contract.
- `.opencode/skills/system-deep-loop/SKILL.md:41` - three-tier discriminator documentation.
- `.opencode/skills/system-deep-loop/SKILL.md:64` - advisor projection and command router drift-guard statement.
- `.opencode/skills/system-deep-loop/SKILL.md:91` - hub maintainer rules.
- `.opencode/skills/system-deep-loop/SKILL.md:104` - escalation rule for adding a new mode.
- `.opencode/skills/system-deep-loop/README.md:59` - README explanation of registry-driven mode descriptions.
- `.opencode/skills/system-deep-loop/README.md:89` - already-registered related-skills wording advisory, not re-counted here.
- `.opencode/skills/system-deep-loop/mode-registry.json:18` - `extensions` block start.
- `.opencode/skills/system-deep-loop/mode-registry.json:23` - advisor projection extension description.
- `.opencode/skills/system-deep-loop/mode-registry.json:31` - first concrete mode entry shape.
- `.opencode/skills/system-deep-loop/mode-registry.json:103` - improvement-host mode entry shape.
- `.opencode/skills/system-deep-loop/mode-registry.json:175` - external-adapter mode entry shape.
- `.opencode/skills/system-deep-loop/hub-router.json:7` - tie-break list that must change when public modes change.
- `.opencode/skills/system-deep-loop/hub-router.json:15` - router signal map that must change when public modes change.
- `.opencode/skills/system-deep-loop/description.json:3` - public hub summary naming seven modes.
- `.opencode/skills/system-deep-loop/graph-metadata.json:109` - derived key file list for advisor-facing graph context.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Adding another workflow lacks a single maintainer checklist** -- `.opencode/skills/system-deep-loop/SKILL.md:104`, `.opencode/skills/system-deep-loop/hub-router.json:7`, `.opencode/skills/system-deep-loop/hub-router.json:15`, `.opencode/skills/system-deep-loop/mode-registry.json:10`, `.opencode/skills/system-deep-loop/README.md:59` -- The hub correctly says to extend `mode-registry.json` and open a packet when a new mode is needed, and it documents that advisor projection maps and command routers must stay equal to the registry. What is missing is one concrete maintainer checklist tying those facts together. A future maintainer adding a fifth workflow family or eighth public mode must update the registry entry, router signals and tie-break order, README and metadata summaries, command/agent surfaces where applicable, and advisor projection drift guards, but those steps are split across prose and JSON without a single checklist.
   - Finding class: matrix/evidence
   - Scope proof: Checked hub `SKILL.md`, README, `mode-registry.json`, `hub-router.json`, `description.json`, and `graph-metadata.json`. The current seven-mode routing remains coherent; the issue is maintainability of future additions, not current behavior.
   - Affected surface hints: [`SKILL.md maintainer rules`, `mode-registry.json`, `hub-router.json`, `README.md`, `advisor projection drift guard`]
   - Recommendation: Add a short "Adding a workflow mode" checklist to the hub docs that names every required surface and points to the drift-guard test before maintainers edit the registry.

## Traceability Checks

| Check | Result | Evidence |
|---|---|---|
| Existing findings de-duplicated | PASS | DR-002, DR-003, and DR-004 were read from the registry and not counted again. |
| Routing clarity | PASS with P2 advisory | The three-tier discriminator and registry-driven route are understandable (`SKILL.md:37`, `:41`), but follow-on edit steps are not collected in one place. |
| README currency | PASS with existing advisories | README content reflects the two-axis hub shape (`README.md:37`, `:59`); stale version and related-skill wording were already registered in prior iterations. |
| `extensions` clarity | PASS | `runtime-loop` and `advisor-projection` descriptions are present in `mode-registry.json:18-26`, and SKILL.md explains their runtime/advisor split (`SKILL.md:43`, `:64`). |
| Safe follow-on change cost | PASS with P2 advisory | Current files are consistent, but adding a new public mode requires synchronized edits across several files that are not summarized as a checklist. |

## Verdict

PASS with P2 advisory. No P0 or P1 maintainability failures were confirmed. The hub tier is clean enough to move into packet-level iterations, carrying four active hub-level P2 advisories only.

## Next Dimension

- Dimension: correctness
- Focus area: `deep-research` packet.
- Reason: hub-tier iterations 2-5 are complete; the remaining review should move to packet-level passes.
- Carry-forward: do not re-count hub-level DR-002, DR-003, DR-004, or DR-005 unless a packet-level consumer proves a broader impact.

Review verdict: PASS
