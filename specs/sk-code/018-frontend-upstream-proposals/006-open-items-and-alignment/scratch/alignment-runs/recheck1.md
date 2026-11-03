# Alignment recheck

| Bucket | Count |
|---|---:|
| resolved | 24 |
| still_open | 2 |
| new | 0 |
| needs_review | 19 |

## battery_rows: resolved

- S1-package-check:.skilled/skills/system-spec-kit/runtime/cli (P0) npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check: row is pass
- S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md (P2) python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md: row is pass
- S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/native-accessibility.md (P2) python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/native-accessibility.md: row is pass
- S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/native-inputs-and-keyboard.md (P2) python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/native-inputs-and-keyboard.md: row is pass
- S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/native-layout-and-text.md (P2) python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/native-layout-and-text.md: row is pass
- S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/native-lists-and-motion.md (P2) python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/native-lists-and-motion.md: row is pass
- S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/native-platform-differences.md (P2) python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/native-platform-differences.md: row is pass
- S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-accessibility-patterns.md (P2) python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-accessibility-patterns.md: row is pass
- S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md (P2) python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md: row is pass
- S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-elements-and-attributes.md (P2) python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-elements-and-attributes.md: row is pass
- S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-internationalization.md (P2) python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-internationalization.md: row is pass
- S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-layout-and-sizing.md (P2) python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-layout-and-sizing.md: row is pass
- S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md (P2) python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md: row is pass
- S2-validate-document:.skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md (P2) python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-frontend/references/web-performance-and-loading.md: row is pass
- S5-readme-references (P2) python3 .skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py .skilled/bin/README.md .skilled/skills/mcp-tooling/README.md .skilled/skills/mcp-tooling/mcp-figma/README.md .skilled/skills/sk-code/README.md .skilled/skills/sk-code/sk-code-frontend/README.md .skilled/skills/sk-code/sk-code-skilled/README.md .skilled/skills/sk-design/sk-design-fundamentals/README.md .skilled/skills/sk-doc/README.md .skilled/skills/sk-doc/sk-create-skill/README.md .skilled/skills/system-spec-kit/README.md README.md: row is pass
- S7-skill-graph-freshness (P0) node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict: row is pass
- S7-router-vocabulary-reach:.skilled/skills/sk-doc (P2) node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --hub sk-doc: row is pass
- S14-packet-validate:specs/sk-code/018-frontend-upstream-proposals (P0) node .skilled/commands/assets/local-lsa-worktree-copy/validate-packet.cjs specs/sk-code/018-frontend-upstream-proposals: row is pass

## battery_rows: still_open

- S9-command-references (P2) node .skilled/commands/scripts/validate-command-references.cjs: row is fail

## battery_rows: new

None.

## findings: resolved

- B-03 (P1) .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md: new text present and old text absent
- A-4 (P2) .skilled/skills/sk-code/graph-metadata.json: new text present and old text absent
- D-04 (P2) .hermes/SYNC.md: new text present and old text absent
- B-07 (P2) .skilled/skills/mcp-tooling/mcp-figma/SKILL.md: new text present and old text absent
- B-08 (P2) .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md: new text present and old text absent
- X-4 (P2) .skilled/skills/mcp-tooling/mcp-figma/changelog/v1.2.0.0.md: new text present and old text absent

## findings: still_open

- B-02 (P1) .skilled/skills/sk-code/sk-code-frontend/references/web-markup-and-css.md: old text still present

## findings: needs_review

- X-3 (P1) specs/sk-code/018-frontend-upstream-proposals/goal.md: judgment finding: needs a reviewer
- A-1 (P1) .skilled/skills/sk-code/graph-metadata.json: judgment finding: needs a reviewer
- X-5 (P1) .skilled/commands/assets/local-skilled-alignment/alignment-lib.cjs: judgment finding: needs a reviewer
- B-01 (P1) .skilled/skills/sk-code/sk-code-frontend/references/figma-to-code.md: judgment finding: needs a reviewer
- C-01 (P1) README.md: judgment finding: needs a reviewer
- C-02 (P1) README.md: judgment finding: needs a reviewer
- X-1 (P1) .skilled/skills/sk-code/ROUTER.md: judgment finding: needs a reviewer
- A-2 (P2) .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/policy-card.cjs: judgment finding: needs a reviewer
- A-3 (P2) .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs: judgment finding: needs a reviewer
- B-05 (P2) .skilled/skills/sk-code/sk-code-frontend/SKILL.md: file changed differently
- B-09 (P2) .skilled/skills/sk-code/sk-code-frontend/SKILL.md: judgment finding: needs a reviewer
- C-05 (P2) .skilled/skills/README.txt: judgment finding: needs a reviewer
- C-06 (P2) .skilled/skills/sk-code/sk-code-frontend/README.md: file changed differently
- C-07 (P2) .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md: judgment finding: needs a reviewer
- C-03 (P2) .skilled/changelog/sk-code/code-frontend: judgment finding: needs a reviewer
- D-01 (P2) .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs: judgment finding: needs a reviewer
- D-06 (P2) .skilled/skills/sk-code/sk-code-review/README.md: judgment finding: needs a reviewer
- D-08 (P2) .skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json: judgment finding: needs a reviewer
- X-2 (P2) .skilled/skills/sk-code/hub-router.json: judgment finding: needs a reviewer
