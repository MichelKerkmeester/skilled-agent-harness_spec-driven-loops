---
title: "Feature Specification: Remove the Deep AI-System Improvement Lane"
description: "The operator has permanently deprecated the deep-improvement AI-system packaging lane. Wave 1 and Wave 1b remove its runtime command, assets, lane-specific references, routing records, tests, scripts, and benchmark-report rows while preserving every other deep-loop lane."
trigger_phrases:
  - "remove AI-system improvement lane"
  - "deep AI-system improvement removal"
  - "Lane D runtime removal"
  - "runtime packaging removal"
  - "deep-loop lane cleanup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/067-ai-system-improvement-removal"
    last_updated_at: "2026-07-15T10:14:02Z"
    last_updated_by: "codex"
    recent_action: "Completed the combined 18 deletes, 49 shared-file scrubs, and verification gates"
    next_safe_action: "Orchestrator review and one commit; rollback with git revert <sha>"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/mode-registry.json"
      - ".opencode/skills/system-deep-loop/SKILL.md"
      - "README.md"
    completion_pct: 100
    open_questions:
      - "Wave 2 historical specs/** scrub remains intentionally deferred."
    answered_questions:
      - "The operator directive is the authority for permanent removal."
---
# Feature Specification: Remove the Deep AI-System Improvement Lane

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Track** | system-deep-loop |
| **Wave** | 1 + 1b — runtime removal |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The operator no longer wants the `/deep:ai-system-improvement` mode, also known as the AI-system packaging or non-development AI-system lane. Its dedicated command, self-target packaging material, registry entries, shared documentation, tests, and benchmark rows still describe it as supported runtime behavior.

### Purpose

Permanently remove that lane from the runtime surface while keeping skill-benchmark, model-benchmark, agent-improvement, command-benchmark, deep-research, deep-review, deep-alignment, and AI Council behavior intact.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope: Wave 1 Runtime Removal

- Preserve the primary Wave 1 manifest of seven dedicated deletions and 29 shared scrubs listed below.
- Add the Wave 1b completeness manifest of eleven dedicated deletions and 20 shared scrubs listed below.
- Treat the combined manifest as 18 dedicated files and 49 shared files across 67 runtime targets.
- Keep JSON valid, tests meaningful, and surrounding lane documentation coherent.
- Remove empty parent directories created by the dedicated deletions when they contain no remaining files.

### Out of Scope: Wave 2

- Historical packet material under `.opencode/specs/**` is a separate later scrub and must not be edited in this wave.
- No changes to the protected 065 packet or any other existing spec packet.
- No changes to the remaining deep-loop lanes or their behavior.

### Dedicated Files to Delete

1. `.opencode/commands/deep/ai-system-improvement.md`
2. `.opencode/commands/deep/assets/deep_ai-system-improvement_presentation.txt`
3. `.opencode/skills/sk-doc/create-benchmark/references/non_dev_ai_system/non_dev_ai_system_authoring_guide.md`
4. `.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/non_dev_ai_system/self_target_packaging_profile.md`
5. `.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/non_dev_ai_system/self_target_packaging_profile.md`
6. `.opencode/skills/system-deep-loop/manual_testing_playbook/improvement_lane_routing/ai_system_improvement.md`
7. `.opencode/skills/system-deep-loop/runtime/tests/unit/meta-loop-lane-d-packaging.vitest.ts`

### Shared Files to Scrub

1. `.opencode/agents/deep-improvement.md`
2. `.opencode/commands/README.txt`
3. `.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs`
4. `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs`
5. `.opencode/skills/sk-doc/create-benchmark/SKILL.md`
6. `.opencode/skills/system-deep-loop/SKILL.md`
7. `.opencode/skills/system-deep-loop/mode-registry.json`
8. `.opencode/skills/system-deep-loop/benchmark/after_d3_proxy/skill-benchmark-report.json`
9. `.opencode/skills/system-deep-loop/benchmark/after_d3_proxy/skill-benchmark-report.md`
10. `.opencode/skills/system-deep-loop/benchmark/baseline/skill-benchmark-report.json`
11. `.opencode/skills/system-deep-loop/benchmark/baseline/skill-benchmark-report.md`
12. `.opencode/skills/system-deep-loop/benchmark/live_mode_b/skill-benchmark-report.json`
13. `.opencode/skills/system-deep-loop/benchmark/router_mode_a/skill-benchmark-report.json`
14. `.opencode/skills/system-deep-loop/benchmark/router_mode_a/skill-benchmark-report.md`
15. `.opencode/skills/system-deep-loop/deep-ai-council/README.md`
16. `.opencode/skills/system-deep-loop/deep-improvement/README.md`
17. `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md`
18. `.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.11.0.0.md`
19. `.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.14.0.0.md`
20. `.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/feature_catalog.md`
21. `.opencode/skills/system-deep-loop/description.json`
22. `.opencode/skills/system-deep-loop/hub-router.json`
23. `.opencode/skills/system-deep-loop/manual_testing_playbook/advisor_integration/command_bridge_guard.md`
24. `.opencode/skills/system-deep-loop/manual_testing_playbook/advisor_integration/no_false_fire_code_edit.md`
25. `.opencode/skills/system-deep-loop/manual_testing_playbook/manual_testing_playbook.md`
26. `.opencode/skills/system-deep-loop/manual_testing_playbook/runtime_and_backend/external_adapter.md`
27. `.opencode/skills/system-deep-loop/shared/rollout/command-injection-rollout.json`
28. `.opencode/skills/system-spec-kit/constitutional/deep-skill-workflow-required.md`
29. `README.md`

### Wave 1b Expansion: Dedicated Files to Delete

1. `.opencode/commands/deep/assets/deep_ai-system-improvement_auto.yaml`
2. `.opencode/commands/deep/assets/deep_ai-system-improvement_confirm.yaml`
3. `.opencode/skills/system-deep-loop/deep-improvement/assets/non_dev_ai_system/packaging_config.schema.json`
4. `.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/non_dev_ai_system/guarded_refine_loop.md`
5. `.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/intra_routing_recall/non_dev_ai_system.md`
6. `.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/non_dev_ai_system/synthetic_deficit_and_gauntlet.md`
7. `.opencode/skills/system-deep-loop/deep-improvement/references/non_dev_ai_system/guardrails_teachings.md`
8. `.opencode/skills/system-deep-loop/deep-improvement/references/non_dev_ai_system/loop_contract.md`
9. `.opencode/skills/system-deep-loop/deep-improvement/references/non_dev_ai_system/operator_guide.md`
10. `.opencode/skills/system-deep-loop/deep-improvement/scripts/non-dev-ai-system/init_packaging.py`
11. `.opencode/skills/system-deep-loop/deep-improvement/scripts/non-dev-ai-system/run-non-dev-ai-system.cjs`

### Wave 1b Expansion: Shared Files to Scrub

1. `.opencode/commands/create/assets/create_benchmark_presentation.txt`
2. `.opencode/skills/sk-doc/create-benchmark/README.md`
3. `.opencode/skills/sk-doc/create-benchmark/changelog/v1.3.0.0.md`
4. `.opencode/skills/sk-doc/hub-router.json`
5. `.opencode/skills/sk-doc/mode-registry.json`
6. `.opencode/skills/sk-doc/scripts/tests/test_create_benchmark_family_registry.py`
7. `.opencode/skills/system-deep-loop/changelog/v2.0.0.0.md`
8. `.opencode/skills/system-deep-loop/deep-improvement/benchmark/live_mode_b/skill-benchmark-report.json`
9. `.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.json`
10. `.opencode/skills/system-deep-loop/deep-improvement/benchmark/router_mode_a/skill-benchmark-report.md`
11. `.opencode/skills/system-deep-loop/deep-improvement/changelog/v1.15.0.0.md`
12. `.opencode/skills/system-deep-loop/deep-improvement/feature_catalog/model_benchmark_mode/mode_switch.md`
13. `.opencode/skills/system-deep-loop/deep-improvement/manual_testing_playbook/manual_testing_playbook.md`
14. `.opencode/skills/system-deep-loop/deep-improvement/scripts/README.md`
15. `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/README.md`
16. `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs`
17. `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/parse-args.cjs`
18. `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts`
19. `.opencode/skills/system-deep-loop/graph-metadata.json`
20. `.opencode/skills/system-deep-loop/runtime/tests/unit/host-driven-improvement.vitest.ts`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove the deprecated runtime surface | All 18 dedicated files across the primary and completeness manifests are deleted and empty parents are removed. |
| REQ-002 | Remove all listed shared-lane references | The residual scan across the combined 67 runtime targets returns zero hits for the four removal identifiers. |
| REQ-003 | Preserve the remaining lanes | Registry, router, docs, tests, and reports retain all non-deprecated lane entries and remain coherent. |
| REQ-004 | Preserve machine-readable contracts | Every edited JSON file parses successfully with Node. |
| REQ-005 | Pass the focused regression gates | Both configured Vitest files, the create-benchmark family test, and the two requested Node plugin tests pass without weakening assertions for other lanes. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Keep Wave 2 isolated | No path outside 067 and the combined 67 runtime targets changes as a result of this wave. |
| REQ-007 | Make rollback explicit | The whole removal is reviewed and landed as one commit; rollback is `git revert <sha>`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Eighteen dedicated files are absent and the combined shared manifest contains 49 scrubbed files.
- **SC-002**: The requested residual scan reports zero matches across all 67 runtime targets.
- **SC-003**: Both configured Vitest files, the create-benchmark family test, and both focused Node test files pass; all edited JSON parses; strict packet validation reports Errors: 0.
- **SC-004**: Git status distinguishes the 11-delete/20-scrub Wave 1b delta and this packet from unrelated dirty paths on the shared branch.
- **SC-005**: No file under historical `.opencode/specs/**` changes except files inside this 067 packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shared registry and router JSON | Removing the wrong object could break unrelated command routing. | Patch only the deprecated object and parse every edited JSON file. |
| Dependency | Plugin guard tests | Removing too much could weaken coverage for remaining lanes. | Delete only deprecated cases and run both test files. |
| Risk | Residual aliases in prose or reports | The retired lane could remain discoverable or fail the residual gate. | Scan exact identifiers across the non-spec `.opencode` runtime after edits; alternate projections remain outside scope. |
| Risk | Dirty shared branch | Existing unrelated work could be overwritten or misattributed. | Capture baseline status and compare final status by path. |
| Risk | Historical spec contamination | The later Wave 2 could be pulled into this runtime patch. | Treat `.opencode/specs/**` as protected except this 067 directory. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Wave 2 historical spec scrubbing remains deferred to a later operator-approved packet.
- The orchestrator supplies the final commit SHA after review; until then rollback is recorded symbolically as `git revert <sha>`.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Correctness

- **NFR-C01**: Every remaining deep-loop lane retains its prior registry and routing contract.
- **NFR-C02**: Edited JSON remains valid UTF-8 JSON with no deprecated mode object or alias.

### Safety

- **NFR-S01**: No command, test, or documentation edit broadens beyond the combined 67-target runtime manifest.
- **NFR-S02**: No code comment gains a spec path or ephemeral artifact identifier.

### Reversibility

- **NFR-R01**: One reviewable commit can reverse the entire removal with `git revert <sha>`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### File Boundaries

- A dedicated file may be absent only after the manifest deletion is recorded in the worktree.
- A parent directory is removed only when empty after the dedicated deletion.
- Existing unrelated dirty files must remain byte-for-byte untouched.

### Machine-Readable Content

- Registry and router objects must retain valid comma/bracket structure after removing one mode.
- Benchmark reports must retain valid JSON and all remaining scenario rows.
- Markdown and text lists must be renumbered or rephrased so they no longer claim the retired improvement lane.

### Verification Failures

- Any residual hit, JSON parse error, test failure, or scope delta blocks completion until corrected or explicitly reported.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 24/25 | 67 runtime targets across the primary and completeness manifests plus a focused packet; no historical specs. |
| Risk | 18/25 | Shared routing and guard tests can affect every deep-loop command. |
| Research | 8/20 | Target contents and JSON structures are known and read before editing. |
| **Total** | **50/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
