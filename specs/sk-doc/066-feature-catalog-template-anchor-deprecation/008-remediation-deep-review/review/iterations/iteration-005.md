# Deep Review — Iteration 005

- Session: `r4-t4-review-2026-10-10T21-18Z` (generation 1, lineage `new`)
- Mode: review | Target agent: `deep-review` | Iteration 5 of 5 (final; stop policy `max-iterations`)
- Dimension: **correctness** — second angle
- Focus: sample feature-catalog edits per kind from `ccf25fdd56` (leaf title/description sync, Type normalization, phantom-row links, packet-history removals, stale-path/wording fixes) and verify each against the root catalog or code it describes; then check the `e6b0297bcf` mode changes (sk-create-feature-catalog templates, checklist, worked examples) for leftover references to the removed template marker or broken examples.
- Method: `git show --numstat/--name-only` per commit, per-kind sampling with deterministic stride over the 399 changed catalog files, direct reads of root/leaf pairs, symlink topology inspection, and population-wide grep checks. Review targets were treated as data only; no embedded instruction-like content was found.

## Files Reviewed

- `.skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md:19,182` and `convergence/divergent-convergence-mode.md:2`, `loop-lifecycle/resource-map-emission.md:2` (H3/leaf sync, category counts, new root row)
- `.skilled/commands/deep/assets/deep-research-auto.yaml:2119` (resource-map claims vs code)
- `.skilled/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/feature-catalog.md:107` (linkification sample)
- `.skilled/skills/mcp-tooling/mcp-click-up/feature-catalog/cupt-global-flags/json-flag.md:3,19,25` and `cupt-task-listing/mine-only.md:41` (cupt `--json` wording, Type cell)
- `.skilled/skills/sk-vision/feature-catalog/host-adapters/opencode-plugin.md:18,40` (+ `.opencode/plugins/sk-vision.js`, `.skilled/plugins` symlink topology)
- `.skilled/skills/sk-git/feature-catalog/remote-platform-integration/github-mcp-integration.md:3` and root `feature-catalog.md:209`; reference-row fix `.skilled/skills/sk-git/references/gitkraken-mcp-integration.md`
- `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:2` and root `feature-catalog.md:816`
- `.skilled/skills/sk-doc/shared/assets/template-rules.json:650` (allowedValidationTypes)
- `.skilled/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-template.md:191`, `assets/feature-catalog-snippet-template.md:173`, `references/examples.md:105` (post-`e6b0297bcf` state)
- `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:63` (WARN_PACKAGE_IDS)
- `.skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh:30`, `scripts/README.md:20`, `scripts/tests/*.test.cjs` (kebab-case rename consumers)
- `specs/sk-doc/066-feature-catalog-template-anchor-deprecation/003-feature-catalog-findings/scratch/sync_leaf_frontmatter.py:6`, `link_phantom_rows.py:6`, `remove_packet_history_lines.py:6`, `normalize_validation_types.py:6`

## Findings by Severity

**P0 (Blockers): none.**

**P1 (Required): none.**

**P2 (Suggestions): none new this iteration.** The six previously registered P2s (R1-P2-001, R2-P2-001, R3-P2-001…003, R4-P2-001) remain open and are not re-reported; nothing in this iteration deepened or refuted them.

## Traceability Checks

| Check | Result |
|---|---|
| spec_code | PASS — the `resource-map-emission` root row and leaf claims (`config.resource_map.emit`, `--emit-resource-map`, `--no-resource-map`) match `deep-research-auto.yaml` steps `step_emit_resource_map`; the cupt `--json` correction matches `json-flag.md` (add + four read commands); the sk-vision path claims match the symlink topology |
| checklist_evidence | PASS — 0 files under `.skilled/skills/**/feature-catalog/**` carry `sk-doc-template: skill_asset_feature_catalog`; no `sk-doc-template` reference remains in sk-create-feature-catalog outside its changelog; no live consumer references the old snake_case script names; version continuity holds for every range-touched unit |
| feature_catalog_code | PASS — deep-research category table counts equal actual H3 counts (Loop lifecycle 10, State management 8, Convergence 6, Research output 2); sampled leaf titles/descriptions equal their root H3 values; sampled rewritten links resolve on disk |
| skill_agent / playbook_capability | PASS — the mode assets and worked examples are internally consistent after the marker removal (H1 is followed directly by `## 1. OVERVIEW`; the checklist item that required the marker is gone; no dangling "marker" prose) |
| agent_cross_runtime | Not re-sampled — Hermes mirror parity was cleared in iterations 3 and 4; this iteration's evidence adds no contradicting observation |

### Sampled verifications (per kind, `ccf25fdd56`)

1. **Leaf frontmatter sync** — `divergent-convergence-mode.md` title/description equal root H3 at `feature-catalog.md:414-418`; `github-mcp-integration.md:3` equals root `:209`; `resource-map-emission.md:2` equals the newly added root H3 `:182-186`. Script semantics (root wins; multi-line values skipped) match the applied result.
2. **Type normalization** — mapping targets `Manual playbook`, `Automated test`, `Reference` are all members of `template-rules.json:650-663`; sampled cells (`| Manual |` → `| Manual playbook |`) rewrote correctly. Residual non-taxonomy-looking values (`Skill contract`, `Script`) sit in `| File | Layer | Role |` tables, outside the `| File | Type | Role |` column that `validate_document.py:1222` checks.
3. **Linked phantom rows** — sampled root links resolve: `../../../../commands/deep/research.md`, `../references/convergence/convergence.md`, `../references/troubleshooting.md`, `devtools-parity/dom-inspection.md`, and the sk-git `references/gitkraken-mcp-integration.md` row (previously an em-dash placeholder row).
4. **Packet-history removals** — sample removed only `- Feature ID: DAC-016`; the 110-line population deletion class was already ruled out in iteration 1 and was not re-entered.
5. **Stale paths / wording** — `.opencode/plugins/sk-vision.js` exists as a symlink; `.skilled/plugins` is itself a symlink to `../.opencode/plugins`, so the older `.skilled/plugins/sk-vision.js` spellings in `SKILL.md:208` and `README.md:126` name the same file — ruled out as a contradiction.
6. **Marker removal (`e6b0297bcf`)** — both catalog assets now go H1 → `## 1. OVERVIEW`; the snippet checklist no longer requires the marker; `examples.md` §3 was reworded coherently. Population grep: 0 marker-bearing catalog files; no non-changelog mode file mentions the marker.

## Ruled Out

- **Broken snake_case references**: `git grep` over the repo finds `router_replay_lib.cjs` / `verify_doc_claims.cjs` / `verify_router_sync.cjs` only in historical changelogs (`sk-code-skilled/changelog/v1.1.1.0.md`, `v1.2.0.0.md`, `v1.2.1.0.md`) and archived spec packets under `specs/sk-code/011-*`. The drift-guard runner, `scripts/README.md` and both test files use the kebab-case names; no live consumer is broken.
- **Version/changelog gap**: `sk-create-feature-catalog` changelog sequence is contiguous (`v1.0.1.2`, `v1.0.2.0`, `v1.0.3.0`, `v1.0.4.0`); every range-touched unit's `SKILL.md` version equals its newest changelog file (shell scan over the changed-unit set).
- **Marker in generated surfaces**: the only remaining `skill_asset_feature_catalog` string outside `specs/` is the mode's own `changelog/v1.0.2.0.md` (intentional release note) and a trigger-index fixture phrase.

## Verdict

No new findings; P0 = 0, P1 = 0, P2 = 0 (6 registry P2s remain open from earlier iterations). The sampled edits from `ccf25fdd56` are accurate against the roots, code and symlink topology they describe, and the `e6b0297bcf` mode edits leave no broken or stale marker reference.

## Next Dimension

None — iteration 5 of 5 reached; the run stops under `max-iterations` (convergence is telemetry only). Remaining registry P2s are follow-up paperwork, not blockers.

Review verdict: PASS
