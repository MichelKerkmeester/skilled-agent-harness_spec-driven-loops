---
title: Deep Review Strategy
description: Session tracking for the deep review of specs/system-speckit/034-spec-folder-tooling phases 016 to 019.
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

Persistent state for this review session. Read by the orchestrator and each iteration. Machine-owned blocks are refreshed by the reducer.

---

## 2. TOPIC
Review: specs/system-speckit/034-spec-folder-tooling (spec-folder). Scope is the phases worked on in this parent: 016-research-recommendations and its 16 children, 017-heal-cli-and-compat-yaml-simplification, 018-epic-docs-alignment and 019-epic-follow-up-fixes. The file list comes from goal-file-manifest.txt: every file those phases' commits touched (minus bulk test fixtures and generated indexes), then the phase spec docs. 229 files.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Phases 001 to 015 of this parent, except where a 016 to 019 change touches their files.
- Fixing anything. This is a read-only review; remediation goes to /speckit:plan.
- Files outside goal-file-manifest.txt, except to trace a producer or consumer of an in-scope change.

---

## 5. STOP CONDITIONS
- stop_policy is max-iterations: all 10 iterations run; convergence signals are telemetry only.
- Halt early only on an unrecoverable error, a pause sentinel, or 3 consecutive failed iterations.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 21
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Core checklist evidence:** Relevant test assertions were inspected. Test suites and historical verification commands were not run. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Core checklist evidence:** Relevant test assertions were inspected. Test suites and historical verification commands were not run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Core checklist evidence:** Relevant test assertions were inspected. Test suites and historical verification commands were not run.

### **Core spec-to-code:** Static comparisons covered the seven selected child specs and mapped implementation surfaces. No new mismatch was established. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Core spec-to-code:** Static comparisons covered the seven selected child specs and mapped implementation surfaces. No new mismatch was established.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Core spec-to-code:** Static comparisons covered the seven selected child specs and mapped implementation surfaces. No new mismatch was established.

### **Overlay protocols:** Deferred for this correctness pass. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Overlay protocols:** Deferred for this correctness pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay protocols:** Deferred for this correctness pass.

### **Phase 017 removed surfaces:** The CLI consumes the remaining --apply, --folder, and --roots arguments. Repository search found no active caller or usage example passing --mode or --json. The changelog mention is an explicit warning that those flags are ignored. The old step_failure key appears in a test assertion that verifies it is absent; the action and consumers use on_step_failure. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Phase 017 removed surfaces:** The CLI consumes the remaining --apply, --folder, and --roots arguments. Repository search found no active caller or usage example passing --mode or --json. The changelog mention is an explicit warning that those flags are ignored. The old step_failure key appears in a test assertion that verifies it is absent; the action and consumers use on_step_failure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Phase 017 removed surfaces:** The CLI consumes the remaining --apply, --folder, and --roots arguments. Repository search found no active caller or usage example passing --mode or --json. The changelog mention is an explicit warning that those flags are ignored. The old step_failure key appears in a test assertion that verifies it is absent; the action and consumers use on_step_failure.

### `agent_cross_runtime`: Deep-review definitions exist for Codex, Claude, Hermes, OpenCode, and Pi. Their review instructions match; differences are runtime-specific path references and frontmatter/string serialization. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `agent_cross_runtime`: Deep-review definitions exist for Codex, Claude, Hermes, OpenCode, and Pi. Their review instructions match; differences are runtime-specific path references and frontmatter/string serialization.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: Deep-review definitions exist for Codex, Claude, Hermes, OpenCode, and Pi. Their review instructions match; differences are runtime-specific path references and frontmatter/string serialization.

### `changelog_claims`: The selected System Spec Kit claims in v2.7.1.0 and v4.0.0.4 about lane-mode behavior, doctor preview/approval, anchor validation, and anchor repair match the shipped code and command assets. No manual scenario was executed. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `changelog_claims`: The selected System Spec Kit claims in v2.7.1.0 and v4.0.0.4 about lane-mode behavior, doctor preview/approval, anchor validation, and anchor repair match the shipped code and command assets. No manual scenario was executed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `changelog_claims`: The selected System Spec Kit claims in v2.7.1.0 and v4.0.0.4 about lane-mode behavior, doctor preview/approval, anchor validation, and anchor repair match the shipped code and command assets. No manual scenario was executed.

### `checklist_evidence`: Complete for the specified child set. Acceptance criteria and implementation-summary evidence claims were reviewed against current source/test paths and their cited anchors. Historical command outputs were not rerun. Phase 019’s explicitly unchecked post-push criterion is recorded above. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence`: Complete for the specified child set. Acceptance criteria and implementation-summary evidence claims were reviewed against current source/test paths and their cited anchors. Historical command outputs were not rerun. Phase 019’s explicitly unchecked post-push criterion is recorded above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: Complete for the specified child set. Acceptance criteria and implementation-summary evidence claims were reviewed against current source/test paths and their cited anchors. Historical command outputs were not rerun. Phase 019’s explicitly unchecked post-push criterion is recorded above.

### `feature_catalog_code`: Anchor integrity, anchor repair, and the five lane-mode descriptions align with their implementation. The repo-era catalog has the P2 overstatement above. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `feature_catalog_code`: Anchor integrity, anchor repair, and the five lane-mode descriptions align with their implementation. The repo-era catalog has the P2 overstatement above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: Anchor integrity, anchor repair, and the five lane-mode descriptions align with their implementation. The repo-era catalog has the P2 overstatement above.

### `playbook_capability`: Doctor check and compatibility approval stages, plus healer dry-run/apply scenarios, match the command contracts in a static comparison. Scenarios were not run. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `playbook_capability`: Doctor check and compatibility approval stages, plus healer dry-run/apply scenarios, match the command contracts in a static comparison. Scenarios were not run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: Doctor check and compatibility approval stages, plus healer dry-run/apply scenarios, match the command contracts in a static comparison. Scenarios were not run.

### `skill_agent`: Raw byte comparison is false. The observed diff is the generated Hermes banner and runtime-relative link rewrites. The child-dispatch Gate 3 mismatch is R7-P1-001. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `skill_agent`: Raw byte comparison is false. The observed diff is the generated Hermes banner and runtime-relative link rewrites. The child-dispatch Gate 3 mismatch is R7-P1-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: Raw byte comparison is false. The observed diff is the generated Hermes banner and runtime-relative link rewrites. The child-dispatch Gate 3 mismatch is R7-P1-001.

### `spec_code`: Complete for the specified child set. The 16 phase-016 child specs and plans and phases 017-019 were compared with their implementation summaries, linked source/test surfaces and docs. The live template assertion, phase backfill call, archive re-derive path, phrase seeder, healer CLI and compat YAML markers were present at the cited anchors. No additional spec-to-code mismatch was supported. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code`: Complete for the specified child set. The 16 phase-016 child specs and plans and phases 017-019 were compared with their implementation summaries, linked source/test surfaces and docs. The live template assertion, phase backfill call, archive re-derive path, phrase seeder, healer CLI and compat YAML markers were present at the cited anchors. No additional spec-to-code mismatch was supported.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: Complete for the specified child set. The 16 phase-016 child specs and plans and phases 017-019 were compared with their implementation summaries, linked source/test surfaces and docs. The live template assertion, phase backfill call, archive re-derive path, phrase seeder, healer CLI and compat YAML markers were present at the cited anchors. No additional spec-to-code mismatch was supported.

### Agent cross-runtime: deferred. Cross-runtime agent parity was not checked. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Agent cross-runtime: deferred. Cross-runtime agent parity was not checked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Agent cross-runtime: deferred. Cross-runtime agent parity was not checked.

### Checklist evidence: relevant tests were inspected statically. They were not executed. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Checklist evidence: relevant tests were inspected statically. They were not executed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Checklist evidence: relevant tests were inspected statically. They were not executed.

### Core `spec_code` and `checklist_evidence` protocols remain pending; this dispatch is limited to the named overlay protocols. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Core `spec_code` and `checklist_evidence` protocols remain pending; this dispatch is limited to the named overlay protocols.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code` and `checklist_evidence` protocols remain pending; this dispatch is limited to the named overlay protocols.

### Core checklist evidence: deferred. Acceptance artifacts were read for context; their historical commands were not rerun. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Core checklist evidence: deferred. Acceptance artifacts were read for context; their historical commands were not rerun.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core checklist evidence: deferred. Acceptance artifacts were read for context; their historical commands were not rerun.

### Core checklist evidence: deferred. Acceptance evidence and historical commands were not rerun. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Core checklist evidence: deferred. Acceptance evidence and historical commands were not rerun.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core checklist evidence: deferred. Acceptance evidence and historical commands were not rerun.

### Core checklist evidence: partial. Relevant evidence rows were read, not rerun. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Core checklist evidence: partial. Relevant evidence rows were read, not rerun.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core checklist evidence: partial. Relevant evidence rows were read, not rerun.

### Core checklist evidence: the phase 019 push receipt does not establish the stated post-push CI criterion. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Core checklist evidence: the phase 019 push receipt does not establish the stated post-push CI criterion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core checklist evidence: the phase 019 push receipt does not establish the stated post-push CI criterion.

### Core spec-to-code and checklist-evidence checks were deferred; this iteration focused on filesystem and workflow trust boundaries. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Core spec-to-code and checklist-evidence checks were deferred; this iteration focused on filesystem and workflow trust boundaries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec-to-code and checklist-evidence checks were deferred; this iteration focused on filesystem and workflow trust boundaries.

### Core spec-to-code: checked the four scoped claims against their implementations. The retry generator failure path is the one confirmed mismatch. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Core spec-to-code: checked the four scoped claims against their implementations. The retry generator failure path is the one confirmed mismatch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec-to-code: checked the four scoped claims against their implementations. The retry generator failure path is the one confirmed mismatch.

### Core spec-to-code: deferred. This iteration focused on behavior inside transforms, not catalog/spec alignment. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Core spec-to-code: deferred. This iteration focused on behavior inside transforms, not catalog/spec alignment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec-to-code: deferred. This iteration focused on behavior inside transforms, not catalog/spec alignment.

### Core spec-to-code: partial. Relevant acceptance rows were compared with selected source; no mismatch was found in this slice. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Core spec-to-code: partial. Relevant acceptance rows were compared with selected source; no mismatch was found in this slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec-to-code: partial. Relevant acceptance rows were compared with selected source; no mismatch was found in this slice.

### Core spec-to-code: partial. The selected lane-mode catalog and CLI reference match the dispatcher; upgrade-legacy calls shared healer helpers. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Core spec-to-code: partial. The selected lane-mode catalog and CLI reference match the dispatcher; upgrade-legacy calls shared healer helpers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec-to-code: partial. The selected lane-mode catalog and CLI reference match the dispatcher; upgrade-legacy calls shared healer helpers.

### Core spec-to-code: R3-P1-001 and R3-P1-002 remain confirmed because the parent handoff rows and phase 019 CI criterion lack matching closure evidence. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Core spec-to-code: R3-P1-001 and R3-P1-002 remain confirmed because the parent handoff rows and phase 019 CI criterion lack matching closure evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec-to-code: R3-P1-001 and R3-P1-002 remain confirmed because the parent handoff rows and phase 019 CI criterion lack matching closure evidence.

### Feature catalog to code: partial. Healer lane-mode documentation was compared with the selected dispatcher. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Feature catalog to code: partial. Healer lane-mode documentation was compared with the selected dispatcher.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Feature catalog to code: partial. Healer lane-mode documentation was compared with the selected dispatcher.

### Overlay cross-runtime agent parity: deferred. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Overlay cross-runtime agent parity: deferred.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay cross-runtime agent parity: deferred.

### Overlay feature catalog to code: R7-P2-001 remains confirmed because the no-roots branch returns unknown while the catalog says v3. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Overlay feature catalog to code: R7-P2-001 remains confirmed because the no-roots branch returns unknown while the catalog says v3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay feature catalog to code: R7-P2-001 remains confirmed because the no-roots branch returns unknown while the catalog says v3.

### Overlay feature catalog: partial. The selected catalog entry agrees with the CLI. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Overlay feature catalog: partial. The selected catalog entry agrees with the CLI.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay feature catalog: partial. The selected catalog entry agrees with the CLI.

### Overlay feature-catalog alignment: deferred. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Overlay feature-catalog alignment: deferred.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay feature-catalog alignment: deferred.

### Overlay playbook capability: deferred. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Overlay playbook capability: deferred.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay playbook capability: deferred.

### Overlay playbook capability: partial. The scenario contract agrees with the CLI; the manual scenario was not executed. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Overlay playbook capability: partial. The scenario contract agrees with the CLI; the manual scenario was not executed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay playbook capability: partial. The scenario contract agrees with the CLI; the manual scenario was not executed.

### Overlay protocols were outside this iteration’s core traceability focus. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay protocols were outside this iteration’s core traceability focus.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols were outside this iteration’s core traceability focus.

### Overlay protocols: not assessed in this correctness pass. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Overlay protocols: not assessed in this correctness pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay protocols: not assessed in this correctness pass.

### Overlay skill and agent contract: R7-P1-001 remains confirmed across the root instruction, canonical skill, Hermes mirror, and implementation command. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Overlay skill and agent contract: R7-P1-001 remains confirmed across the root instruction, canonical skill, Hermes mirror, and implementation command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay skill and agent contract: R7-P1-001 remains confirmed across the root instruction, canonical skill, Hermes mirror, and implementation command.

### Overlay skill-agent parity: deferred. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Overlay skill-agent parity: deferred.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay skill-agent parity: deferred.

### Parent phase handoff rows marked Criteria TBD and Verification TBD remain a traceability follow-up, not a correctness finding in this pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Parent phase handoff rows marked Criteria TBD and Verification TBD remain a traceability follow-up, not a correctness finding in this pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Parent phase handoff rows marked Criteria TBD and Verification TBD remain a traceability follow-up, not a correctness finding in this pass.

### Parent phase map: Phases 18 and 19 are marked Complete, but their handoff rows remain unresolved. Phase 019’s own success criterion also records the missing CI check. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Parent phase map: Phases 18 and 19 are marked Complete, but their handoff rows remain unresolved. Phase 019’s own success criterion also records the missing CI check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Parent phase map: Phases 18 and 19 are marked Complete, but their handoff rows remain unresolved. Phase 019’s own success criterion also records the missing CI check.

### Playbook capability: partial. The healer walkthrough was inspected but not executed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Playbook capability: partial. The healer walkthrough was inspected but not executed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Playbook capability: partial. The healer walkthrough was inspected but not executed.

### Skill and agent: partial. Canonical and Hermes SKILL files differ by byte hash; this pass did not establish whether that is expected platform-specific content. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Skill and agent: partial. Canonical and Hermes SKILL files differ by byte hash; this pass did not establish whether that is expected platform-specific content.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Skill and agent: partial. Canonical and Hermes SKILL files differ by byte hash; this pass did not establish whether that is expected platform-specific content.

### Skill-agent and cross-runtime parity: deferred because they were outside this slice. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Skill-agent and cross-runtime parity: deferred because they were outside this slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Skill-agent and cross-runtime parity: deferred because they were outside this slice.

### Skill-agent parity, cross-runtime agent parity, feature-catalog alignment and playbook execution were deferred. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Skill-agent parity, cross-runtime agent parity, feature-catalog alignment and playbook execution were deferred.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Skill-agent parity, cross-runtime agent parity, feature-catalog alignment and playbook execution were deferred.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Iteration 5: reviewed anchor repair/nesting and lane-mode ambiguity guards; no additional defect was confirmed.
- Iteration 5: reviewed upgrade repair ordering and before-image/recovery cases; no additional reversibility defect was confirmed.
- Iteration 5: reviewed repo-era report classification and aggregate assertions; no additional reporting defect was confirmed.

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Continuity ladder
- No handover.md or implementation-summary.md at the parent (phase parent keeps only spec.md, timeline.md, description.json, graph-metadata.json).
- Parent spec.md: Level 2 phase parent, status Complete. Phase map lists 016 to 019 as Complete. The handoff rows 017->018 and 018->019 still read "[Criteria TBD]" / "[Verification TBD]".
- Phase 016 is itself a parent of 16 children (001-spec-template-anchor-nesting to 016-phrase-cleanup-hardening) with a research/ trail (research.md, 5 iterations).
- Phase 017, 018 and 019 each carry spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md and a scratch/ folder.

### Prior review and research trails (pointers only)
- 007-series-parent-review-and-hardening-research/review/review-report.md: an earlier deep review of phase 006.
- 014-spec-auto-healing-research/research/research.md: the research whose recommendations phase 016 planned.
- 016-research-recommendations/research/research.md: the overengineering research that phase 017 applied.
- 019-epic-follow-up-fixes/scratch/follow-ups.md: the eleven follow-ups phase 019 closed.

### Bounded Context Snapshot
- Target pointers by area: specs/system-speckit/034-spec-folder-tooling/016-research-recommendations (98); .skilled/skills/system-spec-kit/runtime (38); .skilled/skills/system-spec-kit/manual-testing-playbook (15); .skilled/skills/system-spec-kit/feature-catalog (10); .skilled/commands/create/assets (6); .skilled/commands/doctor/scripts (6); specs/system-speckit/034-spec-folder-tooling/017-heal-cli-and-compat-yaml-simplification (5); specs/system-speckit/034-spec-folder-tooling/018-epic-docs-alignment (5); specs/system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes (5); .skilled/commands/doctor/assets (4); .skilled/skills/system-spec-kit/references (4); .skilled/commands/deep/assets (3).
- Behavior claims: each phase's acceptance-criteria.md and implementation-summary.md; the parent phase map statuses.
- Review risks: the worktree has uncommitted edits outside this scope (git status at session start); generated indexes and bulk fixtures were excluded from the manifest.
- resource-map.md not present; skipping coverage gate.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | Relevant phase acceptance rows compared with selected source; no mismatch found in this slice. |
| `checklist_evidence` | core | partial | 1 | Relevant evidence rows read but not rerun; remaining rows deferred. |
| `skill_agent` | overlay | partial | 1 | Canonical and Hermes SKILL hashes differ; expected variance not adjudicated. |
| `agent_cross_runtime` | overlay | pending | - | Cross-runtime agent parity not reviewed this pass. |
| `feature_catalog_code` | overlay | partial | 1 | Healer and upgrade catalog excerpts compared with selected source. |
| `playbook_capability` | overlay | partial | 1 | Healer walkthrough inspected but not executed. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .env.example | none | - | 0 | pending |
| .github/workflows/changed-packet-validation.yml | none | - | 0 | pending |
| .github/workflows/README.md | none | - | 0 | pending |
| .github/workflows/spec-kit-check.yml | none | - | 0 | pending |
| .github/workflows/strict-pass-freshness-report.yml | none | - | 0 | pending |
| .hermes/skills/system-spec-kit/SKILL.md | none | - | 0 | pending |
| .skilled/changelog/skilled/v4.0.0.4.md | none | - | 0 | pending |
| .skilled/commands/create/assets/create-agent-presentation.txt | none | - | 0 | pending |
| .skilled/commands/create/assets/create-command-presentation.txt | none | - | 0 | pending |
| .skilled/commands/create/assets/create-feature-catalog-presentation.txt | none | - | 0 | pending |
| .skilled/commands/create/assets/create-manual-testing-playbook-presentation.txt | none | - | 0 | pending |
| .skilled/commands/create/assets/create-skill-parent-presentation.txt | none | - | 0 | pending |
| .skilled/commands/create/assets/create-skill-presentation.txt | none | - | 0 | pending |
| .skilled/commands/deep/assets/deep-ai-council-presentation.txt | none | - | 0 | pending |
| .skilled/commands/deep/assets/deep-research-presentation.txt | none | - | 0 | pending |
| .skilled/commands/deep/assets/deep-review-presentation.txt | none | - | 0 | pending |
| .skilled/commands/doctor/_routes.yaml | none | - | 0 | pending |
| .skilled/commands/doctor/assets/doctor-env.yaml | none | - | 0 | pending |
| .skilled/commands/doctor/assets/doctor-update-check.yaml | none | - | 0 | pending |
| .skilled/commands/doctor/assets/doctor-update-compat-action.yaml | none | - | 0 | pending |
| .skilled/commands/doctor/assets/doctor-update-presentation.txt | none | - | 0 | pending |
| .skilled/commands/doctor/scripts/README.md | none | - | 0 | pending |
| .skilled/commands/doctor/scripts/tests/doctor-update-compat-integration.test.cjs | none | - | 0 | pending |
| .skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs | none | - | 0 | pending |
| .skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs | none | - | 0 | pending |
| .skilled/commands/doctor/scripts/tests/git-hook-gates.test.cjs | none | - | 0 | pending |
| .skilled/commands/doctor/scripts/tests/README.md | none | - | 0 | pending |
| .skilled/commands/doctor/update.md | none | - | 0 | pending |
| .skilled/commands/README.txt | none | - | 0 | pending |
| .skilled/commands/speckit/assets/speckit-complete-presentation.txt | none | - | 0 | pending |
| .skilled/commands/speckit/assets/speckit-implement.yaml | none | - | 0 | pending |
| .skilled/commands/speckit/assets/speckit-plan-presentation.txt | none | - | 0 | pending |
| .skilled/scripts/git-hooks/lib/gates.tsv | none | - | 0 | pending |
| .skilled/scripts/git-hooks/pre-commit | none | - | 0 | pending |
| .skilled/scripts/git-hooks/README.md | none | - | 0 | pending |
| .skilled/skills/mcp-code-mode/manual-testing-playbook/doctor-commands/README.md | none | - | 0 | pending |
| .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json | none | - | 0 | pending |
| .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs | none | - | 0 | pending |
| .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs | none | - | 0 | pending |
| .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-hooks-list.md | none | - | 0 | pending |
| .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/README.md | none | - | 0 | pending |
| .skilled/skills/system-deep-loop/manual-testing-playbook/doctor-commands/README.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/anchor-integrity-and-nesting-check.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/heal-spec-docs-anchor-repair.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/heal-spec-docs-lane-modes.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/repo-era-report.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/template-phrase-lint-commit-gate.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/upgrade-legacy-downgrades-report.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/upgrade-legacy-reversibility-manifest.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-check.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-compat.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/anchors-valid-nested-anchor.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/heal-spec-docs-anchor-repair-apply.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/heal-spec-docs-anchor-repair-dry-run.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/heal-spec-docs-lane-modes.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/phase-folder-creation.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/repo-era-report.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/template-phrase-lint-blocked-commit.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/template-phrase-lint-bypass.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/upgrade-legacy-apply-manifest.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/upgrade-legacy-dry-run.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/upgrade-legacy-refusal-without-git.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/README.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/references/memory/trigger-config.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/references/validation/path-scoped-rules.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/references/validation/validation-rules.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/references/workflows/worked-examples.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.d.mts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/README.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/spec/README.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-lint.mjs | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/sweep/README.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/anchor-contract.vitest.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/anchor-repair-sample.vitest.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/heal-anchor-repair.vitest.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/heal-provenance.vitest.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-cleanup-hardening.vitest.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-integration.vitest.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-lint-hook.vitest.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/workflow-invariance.vitest.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/package.json | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/scripts/run-tests.mjs | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/runtime/tests/hooks/README.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/SKILL.md | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl | none | - | 0 | pending |
| .skilled/skills/system-spec-kit/templates/MIGRATION.md | none | - | 0 | pending |
| README.md | none | - | 0 | pending |
| .github/workflows/trigger-index-rebuild.yml | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/001-spec-template-anchor-nesting/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/001-spec-template-anchor-nesting/goal.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/001-spec-template-anchor-nesting/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/001-spec-template-anchor-nesting/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/001-spec-template-anchor-nesting/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/001-spec-template-anchor-nesting/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/002-phase-scaffold-graph-metadata/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/002-phase-scaffold-graph-metadata/goal.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/002-phase-scaffold-graph-metadata/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/002-phase-scaffold-graph-metadata/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/002-phase-scaffold-graph-metadata/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/002-phase-scaffold-graph-metadata/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/003-archive-path-follow-ups/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/003-archive-path-follow-ups/goal.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/003-archive-path-follow-ups/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/003-archive-path-follow-ups/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/003-archive-path-follow-ups/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/003-archive-path-follow-ups/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/004-trigger-index-rebuild-hardening/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/004-trigger-index-rebuild-hardening/goal.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/004-trigger-index-rebuild-hardening/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/004-trigger-index-rebuild-hardening/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/004-trigger-index-rebuild-hardening/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/004-trigger-index-rebuild-hardening/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/005-healer-phrase-seeding/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/005-healer-phrase-seeding/goal.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/005-healer-phrase-seeding/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/005-healer-phrase-seeding/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/005-healer-phrase-seeding/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/005-healer-phrase-seeding/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/006-evidence-gated-provenance/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/006-evidence-gated-provenance/goal.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/006-evidence-gated-provenance/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/006-evidence-gated-provenance/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/006-evidence-gated-provenance/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/006-evidence-gated-provenance/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/007-ci-rule-set-comparison/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/007-ci-rule-set-comparison/goal.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/007-ci-rule-set-comparison/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/007-ci-rule-set-comparison/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/007-ci-rule-set-comparison/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/007-ci-rule-set-comparison/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/008-legacy-era-report/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/008-legacy-era-report/goal.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/008-legacy-era-report/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/008-legacy-era-report/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/008-legacy-era-report/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/008-legacy-era-report/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/goal.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/010-upgrade-reversibility/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/010-upgrade-reversibility/goal.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/010-upgrade-reversibility/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/010-upgrade-reversibility/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/010-upgrade-reversibility/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/010-upgrade-reversibility/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/011-anchor-repair-mode/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/011-anchor-repair-mode/goal.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/011-anchor-repair-mode/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/011-anchor-repair-mode/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/011-anchor-repair-mode/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/011-anchor-repair-mode/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/012-fold-one-off-repairs/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/012-fold-one-off-repairs/goal.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/012-fold-one-off-repairs/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/012-fold-one-off-repairs/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/012-fold-one-off-repairs/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/012-fold-one-off-repairs/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/goal.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/013-anchor-contract-alignment/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/014-gate-3-menu-parity/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/014-gate-3-menu-parity/goal.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/014-gate-3-menu-parity/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/014-gate-3-menu-parity/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/014-gate-3-menu-parity/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/014-gate-3-menu-parity/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/goal.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/015-lane-rules-as-heal-modes/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/016-phrase-cleanup-hardening/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/016-phrase-cleanup-hardening/goal.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/016-phrase-cleanup-hardening/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/016-phrase-cleanup-hardening/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/016-phrase-cleanup-hardening/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/016-phrase-cleanup-hardening/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/goal.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/017-heal-cli-and-compat-yaml-simplification/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/017-heal-cli-and-compat-yaml-simplification/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/017-heal-cli-and-compat-yaml-simplification/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/017-heal-cli-and-compat-yaml-simplification/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/017-heal-cli-and-compat-yaml-simplification/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/018-epic-docs-alignment/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/018-epic-docs-alignment/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/018-epic-docs-alignment/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/018-epic-docs-alignment/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/018-epic-docs-alignment/tasks.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes/acceptance-criteria.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes/implementation-summary.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes/plan.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes/spec.md | none | - | 0 | pending |
| specs/system-speckit/034-spec-folder-tooling/019-epic-follow-up-fixes/tasks.md | none | - | 0 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Stop policy: max-iterations
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-10-09T20:38:08.524Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Dimension queue: inventory -> correctness -> security -> traceability -> maintainability
- Executor: cli-codex gpt-6-luna, reasoning max, service tier fast, timeout 3600s
- Started: 2026-10-09T20:38:08.524Z
<!-- MACHINE-OWNED: END -->

## Iteration 007 Outcome

- Traceability overlay reviewed: feature-catalog claims, doctor playbook capability, the canonical system-spec-kit skill and Hermes mirror, and selected v2.7.1.0/v4.0.0.4 claims.
- New finding: R7-P1-001, the unconditional Gate 3 ask/wait wording conflicts with the root child-dispatch exemption.
- agent_cross_runtime remains blocked because no saved runtime-specific agent definition was available in the searched directories.
- The next max-iteration dispatch selects the next focus; do not repeat the already swept anchor, repo-era aggregation, or injection directions.

## Iteration 008 Outcome

- Correctness reviewed for phase 016 children 001–004: template anchor placement, phase graph-metadata backfill, archive path re-derivation, and trigger-index rebuild retry.
- New finding: R8-P1-001. The retry path ignores the generator exit code before an index-only check and sidecar existence checks; atomicity of the generator output path remains unverified.
- No new defect was confirmed in the selected template, phase-scaffold, or nested/archive path cases. Tests were inspected, not run.
- Do not re-enter the active archive-destination symlink or trigger-index token-exposure findings. The next dispatch selects its own remaining focus.

## Iteration 9 Update

- Focus: correctness across the unreviewed phase 016 children and phase 017 simplifications.
- Outcome: no new findings; the existing run totals remain P0 0, P1 12, P2 3.
- Coverage: nine claim directions were statically ruled out. Targeted tests were read but not run.
- Next focus: continue with the assigned correctness slice for iteration 10.


## Iteration 010 Outcome

- Focus: correctness final replay across all dimensions for the eleven real active findings.
- Outcome: nine P1 findings and two P2 findings were confirmed at their original severities; no new finding was raised and the reducer placeholders were excluded.
- Counterevidence: the trigger-index generator transaction remains unverified, so R8-P1-001 retains its stated atomicity downgrade trigger.
- Verdict: CONDITIONAL. Iteration 10 of 10 exhausts the configured review passes.
