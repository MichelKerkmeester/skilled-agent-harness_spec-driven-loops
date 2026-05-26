# Iter 002 — deep-ai-council logic-gap research

## Question

On the command-wiring, deep-mode-asset, cross-link-integrity, and test-coverage surfaces (NOT the contract-backing or agent-path surfaces iter 001 already covered), what NEW logic gaps or inconsistencies exist in the deep-ai-council skill that are not already in iteration-001.md, spec.md, or audit-findings.jsonl?

## Evidence (file:line citations required)

**Exclusion set verification:**

1. **Iteration-001 findings excluded:** iteration-001.md contains findings F-001..F-005 and research questions RQ-001..RQ-005, which are out of scope for re-reporting in this iteration. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/004-deep-ai-council/research/iterations/iteration-001.md" lines="59-79" />

2. **Audit findings excluded:** audit-findings.jsonl contains AF-0001..AF-0009, which are also out of scope for re-reporting. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/004-deep-ai-council/audit-findings.jsonl" lines="1-9" />

**Deep-mode command wiring verification:**

3. **Deep mode YAML assets exist:** `ls -la .opencode/commands/deep/assets/` returned 6 files including `deep_ask-ai-council_auto.yaml` and `deep_ask-ai-council_confirm.yaml`. Both required files are present. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml" lines="1-30" />

4. **Depth dispatch documentation accuracy:** references/depth_dispatch.md line 22 correctly states that the command loads `.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml` or `deep_ask-ai-council_confirm.yaml`. The documented paths match the actual file locations. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/references/depth_dispatch.md" lines="22" />

5. **Command wiring scope:** references/command_wiring.md focuses on post-dispatch persistence patterns for single-round council runs (lines 21-23). It does not document deep mode YAML assets because its scope is caller-owned persistence helper invocation, not deep mode setup. This is a scope separation, not a gap. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/references/command_wiring.md" lines="21-23" />

**Cross-link integrity verification:**

6. **Playbook to feature catalog links:** manual_testing_playbook.md lines 435-466 contain a complete cross-reference index with 32 scenarios (DAC-001..DAC-032). Each scenario links to a corresponding feature_catalog entry. No mismatches found. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md" lines="435-466" />

7. **Feature catalog to playbook links:** Sample feature file `feature_catalog/01--runtime-routing-and-rename/01-runtime-agent-renamed-to-deep-ai-council.md` line 52 correctly links to `manual_testing_playbook/01--runtime-routing-and-rename/001-runtime-agent-renamed-to-deep-ai-council.md`. The bidirectional link is intact. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/feature_catalog/01--runtime-routing-and-rename/01-runtime-agent-renamed-to-deep-ai-council.md" lines="52" />

8. **SKILL.md references list completeness:** SKILL.md §6 REFERENCES (lines 389-406) lists 11 reference files plus `manual_testing_playbook/manual_testing_playbook.md` and `README.md` (13 total entries). The actual `references/` directory contains exactly 11 files. The count matches and all listed references exist on disk. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/SKILL.md" lines="389-406" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/references/" />

**Test coverage verification:**

9. **Test files present:** `ls -la scripts/tests/` returned 4 vitest files: `findings-registry.vitest.ts`, `orchestrate-session.vitest.ts`, `orchestrate-topic.vitest.ts`, and `integration-deep-mode-e2e.vitest.ts`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/tests/findings-registry.vitest.ts" lines="1-135" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/tests/orchestrate-session.vitest.ts" lines="1-169" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/tests/orchestrate-topic.vitest.ts" lines="1-153" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/tests/integration-deep-mode-e2e.vitest.ts" lines="1-304" />

10. **Scripts without tests:** `ls -la scripts/` and `ls -la scripts/lib/` revealed 7 scripts/lib files and 3 top-level scripts. Of these, only `findings-registry.cjs`, `orchestrate-session.cjs`, and `orchestrate-topic.cjs have dedicated tests. The following scripts have no test coverage: `scripts/lib/persist-artifacts.cjs`, `scripts/lib/rollback.cjs`, `scripts/lib/audit-trail.cjs`, `scripts/advise-council-completion.cjs`, and `scripts/replay-graph-from-artifacts.cjs`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.cjs" lines="1" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/lib/rollback.cjs" lines="1" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/lib/audit-trail.cjs" lines="1" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/advise-council-completion.cjs" lines="1" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/replay-graph-from-artifacts.cjs" lines="1" />

## Findings (numbered; each tagged P0/P1/P2 and "novel vs iter-001/spec/audit")

**F-006 (P2, novel): Five core scripts lack test coverage.** The scripts/lib directory contains 7 files, but only `findings-registry.cjs` has dedicated tests (findings-registry.vitest.ts). The top-level scripts/ directory contains 3 files, but only `orchestrate-session.cjs` and `orchestrate-topic.cjs` have tests. The following 5 scripts have no test coverage: `scripts/lib/persist-artifacts.cjs` (the writer library with 7 exported functions), `scripts/lib/rollback.cjs` (round rollback logic), `scripts/lib/audit-trail.cjs` (audit trail utilities), `scripts/advise-council-completion.cjs` (completion advisory checker), and `scripts/replay-graph-from-artifacts.cjs` (graph replay script). This is a test coverage gap for core council functionality. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.cjs" lines="1" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/lib/rollback.cjs" lines="1" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/lib/audit-trail.cjs" lines="1" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/advise-council-completion.cjs" lines="1" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/replay-graph-from-artifacts.cjs" lines="1" />

## Gaps for next iter

- **RQ-006 (P2):** Should test coverage be added for the 5 uncovered scripts (persist-artifacts.cjs, rollback.cjs, audit-trail.cjs, advise-council-completion.cjs, and replay-graph-from-artifacts.cjs)?

- **RQ-007 (P2):** Should the cross-link integrity check be automated (e.g., a script that verifies every playbook scenario links to a feature catalog entry and vice versa)?

- **RQ-008 (P2):** Should the deep mode YAML assets be validated for correctness (e.g., schema validation, required field checks) beyond mere existence verification?

## JSONL delta row

```json
{"iter_id":"002","timestamp_utc":"2026-05-24T05:12:00.000Z","executor":"cli-devin","model":"swe-1.6","status":"complete","findings_count":1,"gaps_count":3,"primary_evidence_files":[".opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml",".opencode/skills/deep-ai-council/references/depth_dispatch.md",".opencode/skills/deep-ai-council/references/command_wiring.md",".opencode/skills/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md",".opencode/skills/deep-ai-council/feature_catalog/01--runtime-routing-and-rename/01-runtime-agent-renamed-to-deep-ai-council.md",".opencode/skills/deep-ai-council/SKILL.md",".opencode/skills/deep-ai-council/scripts/tests/findings-registry.vitest.ts",".opencode/skills/deep-ai-council/scripts/tests/orchestrate-session.vitest.ts",".opencode/skills/deep-ai-council/scripts/tests/orchestrate-topic.vitest.ts",".opencode/skills/deep-ai-council/scripts/tests/integration-deep-mode-e2e.vitest.ts",".opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.cjs",".opencode/skills/deep-ai-council/scripts/lib/rollback.cjs",".opencode/skills/deep-ai-council/scripts/lib/audit-trail.cjs",".opencode/skills/deep-ai-council/scripts/advise-council-completion.cjs",".opencode/skills/deep-ai-council/scripts/replay-graph-from-artifacts.cjs"],"delta_vs_prev_iter":"new gaps surfaced"}
```