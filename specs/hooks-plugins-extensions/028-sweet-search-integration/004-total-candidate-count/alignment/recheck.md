# Alignment recheck

| Bucket | Count |
|---|---:|
| resolved | 7 |
| still_open | 0 |
| new | 0 |
| needs_review | 5 |

## battery_rows: resolved

- S1-package-check:.skilled/skills/system-spec-kit/runtime/cli (P0) npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check: row is pass
- S3-catalog-package (P0) python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py: row is pass
- S14-packet-validate:specs/hooks-plugins-extensions/028-sweet-search-integration/004-total-candidate-count (P0) node ../../../MEGA/Development/Skilled/.skilled/commands/assets/local-skilled-alignment/validate-packet.cjs specs/hooks-plugins-extensions/028-sweet-search-integration/004-total-candidate-count: row is pass
- S14-packet-validate:specs/hooks-plugins-extensions/028-sweet-search-integration/005-stale-index-fallback (P0) node ../../../MEGA/Development/Skilled/.skilled/commands/assets/local-skilled-alignment/validate-packet.cjs specs/hooks-plugins-extensions/028-sweet-search-integration/005-stale-index-fallback: row is pass
- S14-packet-validate:specs/hooks-plugins-extensions/028-sweet-search-integration/006-rg-flood-control (P0) node ../../../MEGA/Development/Skilled/.skilled/commands/assets/local-skilled-alignment/validate-packet.cjs specs/hooks-plugins-extensions/028-sweet-search-integration/006-rg-flood-control: row is pass

## battery_rows: still_open

None.

## battery_rows: new

None.

## findings: resolved

- E-3 (P2) specs/hooks-plugins-extensions/028-sweet-search-integration/004-total-candidate-count/benchmark/run.mjs: new text present and old text absent
- C-1 (P2) README.md: new text present and old text absent

## findings: still_open

None.

## findings: needs_review

- E-2 (P1) specs/hooks-plugins-extensions/028-sweet-search-integration/004-total-candidate-count/acceptance-criteria.md: judgment finding: needs a reviewer
- E-1 (P1) .skilled/commands/speckit/assets/search-presentation.txt: file changed differently
- E-4 (P2) specs/hooks-plugins-extensions/028-sweet-search-integration/004-total-candidate-count/scenario-489/matrix.md: judgment finding: needs a reviewer
- B-2 (P2) .skilled/skills/cli-external-orchestration/feature-catalog/deepseek-harness-dispatch-mode/deepseek-harness-dispatch-mode.md: judgment finding: needs a reviewer
- B-1 (P2) .skilled/skills/system-spec-kit/manual-testing-playbook/retrieval/trigger-lookup-total-candidates.md: judgment finding: needs a reviewer
