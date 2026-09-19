# Baseline: wording-standard restructure

Recorded before the first skill-file edit of this phase. The consumer list below is the
output of the re-run grep, taken before any skill file changed.

Exclusion count before the edit: 2. The two exclusions this gate carried were the
voice-personality exclusion for carried messages and the scoring-band exclusion.

Consumer count: 73 files.

## Consumer list

`rg -l "hvr-rules\.md" --glob '!specs/**' --glob '!node_modules/**' --glob '!.worktrees/**' --glob '!**/dist/**' .`

```
./.opencode/skills/sk-communication/SKILL.md
./.opencode/skills/system-deep-loop/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json
./.opencode/commands/create/with-human-voice.md
./.opencode/skills/system-spec-kit/templates/examples/level-3+/acceptance-criteria.md
./.opencode/skills/system-spec-kit/templates/examples/level-3/acceptance-criteria.md
./.opencode/skills/system-spec-kit/templates/examples/level-2/acceptance-criteria.md
./.opencode/commands/create/assets/create-with-human-voice-confirm.yaml
./.opencode/commands/create/assets/create-with-human-voice-auto.yaml
./.opencode/skills/system-spec-kit/templates/addons/before-after.md.tmpl
./.opencode/skills/system-spec-kit/templates/addons/decision-record.md.tmpl
./.opencode/skills/system-spec-kit/templates/addons/roadmap.md.tmpl
./.opencode/skills/system-spec-kit/templates/addons/timeline.md.tmpl
./.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl
./.opencode/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl
./.opencode/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl
./.opencode/skills/system-deep-loop/runtime/changelog/v1.1.0.0.md
./.opencode/skills/sk-doc/sk-create-quality-control/SKILL.md
./.opencode/skills/sk-doc/sk-create-quality-control/README.md
./.opencode/skills/sk-doc/sk-create-quality-control/references/README.md
./.opencode/skills/sk-doc/sk-create-with-human-voice/assets/voice-report-template.md
./.opencode/skills/sk-doc/sk-create-with-human-voice/SKILL.md
./.opencode/skills/sk-doc/sk-create-with-human-voice/scripts/README.md
./.opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py
./.opencode/skills/sk-doc/sk-create-with-human-voice/README.md
./.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/tell-detection/hard-blocker-terms.md
./.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/tell-detection/judgment-pass-not-covered-by-the-scanner.md
./.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/tell-detection/word-sense-is-a-candidate.md
./.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/manual-testing-playbook.md
./.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/scope-gate/document-about-the-standard.md
./.opencode/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md
./.opencode/skills/sk-doc/manual-testing-playbook/resource-loading/references-global-only.md
./.opencode/skills/sk-doc/sk-create-with-human-voice/references/scoring-and-verification.md
./.opencode/skills/sk-doc/sk-create-with-human-voice/references/README.md
./.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md
./.opencode/skills/sk-doc/manual-testing-playbook/token-cost-baseline/max-load.md
./.opencode/skills/sk-doc/manual-testing-playbook/token-cost-baseline/minimal-load.md
./.opencode/skills/sk-doc/sk-create-with-human-voice/changelog/v1.1.0.0.md
./.opencode/skills/sk-doc/sk-create-with-human-voice/changelog/v1.0.0.0.md
./.opencode/skills/sk-doc/leaf-aliases.json
./.opencode/skills/sk-doc/leaf-manifest.json
./.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md
./.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md
./.opencode/skills/sk-doc/shared/README.md
./.opencode/skills/sk-doc/shared/references/evergreen-packet-id-rule.md
./.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json
./.opencode/skills/sk-doc/ROUTER.md
./.opencode/skills/sk-doc/sk-create-changelog/assets/changelog-template.md
./.opencode/commands/rewrite/response.md
./.opencode/commands/rewrite/response-by-external-agent.md
./.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--acceptance--luna-high/skill-benchmark-report.json
./.opencode/skills/sk-doc/sk-create-readme/assets/install-guide-template.md
./.opencode/skills/sk-doc/sk-create-readme/assets/readme-template.md
./.opencode/skills/sk-doc/sk-create-readme/SKILL.md
./.opencode/skills/sk-doc/sk-create-readme/references/README.md
./.opencode/skills/sk-doc/sk-create-readme/references/readme/quality-and-checklist.md
./.opencode/skills/sk-doc/sk-create-readme/references/readme/types-and-voice.md
./.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.json
./.opencode/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs
./.opencode/skills/sk-doc/README.md
./.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json
./.opencode/skills/system-spec-kit/runtime/data/trigger-index.json
./.opencode/skills/sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/hub-reports/sk-doc.json
./.opencode/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md
./.opencode/skills/system-spec-kit/runtime/cli/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap
./.opencode/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json
./.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/phase-creation/expected-3phase-named/decision-record.md
./.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/071-comment-hygiene-marker-violation/implementation-summary.md
./.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/073-template-provenance-title/implementation-summary.md
./.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/decision-record.md
./.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/implementation-summary.md
./.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/070-comment-hygiene-marker/implementation-summary.md
./.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/implementation-summary.md
./.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/implementation-summary.md
```

## Section-to-side map (the cut as applied)

| Section | Side |
|---|---|
| 1. OVERVIEW | Reply. Purpose and Usage stay, the Usage section gains the supplement-naming sentence, the Scoring bullet and subsection and the Where To Spend Attention table move |
| 2. VOICE DIRECTIVES | Reply, unchanged |
| 3. PUNCTUATION STANDARDS | Reply, unchanged |
| 4. AI STRUCTURAL PATTERNS TO AVOID | Reply, unchanged, Tables In A Reply stays |
| 5. VOICE PERSONALITY | Reply. The ownership paragraph is added at the top, the Rule Precedence subsection moves |
| 6. HARD BLOCKER WORDS | Reply, the point label moves out of the section title |
| 7. PHRASE HARD BLOCKERS | Reply, the point label moves out of the section title |
| 8. SOFT DEDUCTIONS | Reply, unchanged, the -2 and -1 tiers and the Context Flags stay |
| 9. PRE-PUBLISH CHECKLIST | Publish, moves whole |
| 10. RELATED RESOURCES | Publish, moves whole |

## Scanner, first three lines

`python3 .opencode/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-publish-supplement.md`

```
HVR SCAN: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-publish-supplement.md
  x1    first@63    soft1  soft-deduction         get
  x4    first@17    review oxford-comma-candidate , and
```
