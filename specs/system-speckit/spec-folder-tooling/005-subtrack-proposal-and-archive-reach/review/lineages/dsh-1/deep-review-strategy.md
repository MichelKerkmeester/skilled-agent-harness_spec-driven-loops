---
title: Deep Review Strategy - Subtrack proposal and archive reach
description: Review strategy for packet 005, scoped to the changed-file manifest and documentation alignment with phases 006 to 010.
---

# Deep Review Strategy - Subtrack proposal and archive reach

## 1. OVERVIEW

- Target: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach`
- Review focus: documentation and implementation alignment for the files listed in `goal-file-manifest.txt`, especially docs not updated for phases 006 to 010.
- Dimensions: correctness, security, traceability, maintainability.
- Maximum iterations: 5. Convergence threshold: 0.10 weighted severity ratio.
- Stop policy: convergence, with the hard ceiling at 5 iterations.

## 2. TOPIC

The packet delivers deterministic packet relocation, whole-track subtrack proposals, per-subtrack archives, opt-in archive search, and phases 006 to 010 remediation. The review verifies that changed code, command docs, references, feature catalog entries, manual testing playbooks, changelogs, and READMEs describe the shipped behaviour.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

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
- P1 (Required): 6
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->

## 6. NON-GOALS

- Do not modify reviewed files, tests, commands, skills, agents, or mirrors.
- Do not re-run the acceptance suite, `validate.sh`, or any git write command.
- Do not review source outside the validated 74-file manifest except where the packet docs define intended behaviour.
- Do not redesign the relocation engine or propose implementation beyond documentation/spec alignment.

## 7. STOP CONDITIONS

- All four dimensions reviewed and no active P0/P1 remains.
- Maximum of five iterations reached.
- A state-integrity failure or an unrecoverable packet-boundary failure.

## 8. WHAT WORKED

- Comparing each changed documentation surface to the phase goal that introduced the behaviour (iteration 1). This isolated the pre-008 exit wording immediately.
- Using the producer code as the truth source for documentation claims (iteration 1). `relocate.mjs` and `create.sh` settled both the status-3 and archived-numbering questions without inference.
- Tracing the restore's status capture through `archive.sh:435-446` (iteration 2). The status-3 branch and the mixed-track preflight are visible in one read and matched the phase 008 goal.
- Reading each phase-009 completion criterion beside the implementation and then searching every changed doc for the field or refusal name (iteration 3). That turned a vague "docs are stale" concern into exact zero-hit evidence.
- Comparing the packet's own test-count log to the changelog and the catalog's test inventory (iteration 4). This separated a historical note from a stale current-release claim.
- Re-reading every live P1 primary surface in the final pass (iteration 5). All six remained reproducible at the exact file:line, so synthesis can rely on the registry without a fresh discovery pass.
- Checking the no-change surfaces by behavior, not by absence of any diff (iteration 5). This separated phase-002 option C assets and phase-004 validation docs from the phase 006-010 documentation debt.

## 9. WHAT FAILED

- Treating the command README as representative of the feature catalog and changelog (iteration 1). The command README was updated by the implementation phase; the catalog and changelog were not.
- Relying on the root README for the current command contract (iteration 1). It is a summary and omits status 3.
- Assuming the archive command reference had already absorbed the restore preflight (iteration 2). It describes the happy path only.
- Trusting a prose "three cases" list without counting the branches in the producer (iteration 3). The producer has a fourth branch for non-NNN names.
- Expecting the feature page's "whole old id" sentence to cover the phase-007 bare-name and pre-archive passes (iteration 3). It does not.
- Treating the manual playbook's PASS as coverage evidence for phases 006-010 (iteration 4). The scenario tests the pre-008 path only.
- Reading the catalog's one-suite table as representative rather than as a full inventory (iteration 4). The phase-010 true-writer suite is absent.
- Treating the presence of a file or a passing implementation test as proof that its documentation was updated (iteration 5). The final pass found no new code defect but confirmed the doc debt.

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `agent_cross_runtime`: notApplicable; no agent file is in the manifest. -- BLOCKED (iteration 5, 5 attempts)
- What was tried: `agent_cross_runtime`: notApplicable; no agent file is in the manifest.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: notApplicable; no agent file is in the manifest.

### `checklist_evidence`: partial. Phase 008's completion criteria name the mixed-track restore and status-3 restore; the changed lifecycle docs do not reflect them. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence`: partial. Phase 008's completion criteria name the mixed-track restore and status-3 restore; the changed lifecycle docs do not reflect them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. Phase 008's completion criteria name the mixed-track restore and status-3 restore; the changed lifecycle docs do not reflect them.

### `checklist_evidence`: partial. The packet goal log says all phases are Done, but the changed docs still describe the pre-remediation command. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: partial. The packet goal log says all phases are Done, but the changed docs still describe the pre-remediation command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. The packet goal log says all phases are Done, but the changed docs still describe the pre-remediation command.

### `checklist_evidence`: partial. The packet log and spec status are current, but the changelog, feature catalog, and manual playbook still describe an earlier release state. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `checklist_evidence`: partial. The packet log and spec status are current, but the changelog, feature catalog, and manual playbook still describe an earlier release state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. The packet log and spec status are current, but the changelog, feature catalog, and manual playbook still describe an earlier release state.

### `checklist_evidence`: partial. The packet's completion log is current, but the changelog test count and manual scenario still reflect the phase-005 state. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence`: partial. The packet's completion log is current, but the changelog test count and manual scenario still reflect the phase-005 state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. The packet's completion log is current, but the changelog test count and manual scenario still reflect the phase-005 state.

### `checklist_evidence`: pass for the phase-009 criteria rows read here; the implementation and tests match, but the documentation surfaces do not. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence`: pass for the phase-009 criteria rows read here; the implementation and tests match, but the documentation surfaces do not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: pass for the phase-009 criteria rows read here; the implementation and tests match, but the documentation surfaces do not.

### `feature_catalog_code`: fail. The archive-search and sub-track feature pages omit the new fields/refusals. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code`: fail. The archive-search and sub-track feature pages omit the new fields/refusals.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: fail. The archive-search and sub-track feature pages omit the new fields/refusals.

### `feature_catalog_code`: fail. The catalog's current-reality and test listings predate phases 006-010. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `feature_catalog_code`: fail. The catalog's current-reality and test listings predate phases 006-010.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: fail. The catalog's current-reality and test listings predate phases 006-010.

### `feature_catalog_code`: fail. The feature page and root catalog omit the status-3 contract. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code`: fail. The feature page and root catalog omit the status-3 contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: fail. The feature page and root catalog omit the status-3 contract.

### `feature_catalog_code`: fail. The lifecycle feature page's blanket exit-1 sentence contradicts status 3. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `feature_catalog_code`: fail. The lifecycle feature page's blanket exit-1 sentence contradicts status 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: fail. The lifecycle feature page's blanket exit-1 sentence contradicts status 3.

### `feature_catalog_code`: fail. The relocation, lifecycle, archive-search, and sub-track pages still carry the gaps recorded in iterations 1 to 4. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `feature_catalog_code`: fail. The relocation, lifecycle, archive-search, and sub-track pages still carry the gaps recorded in iterations 1 to 4.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: fail. The relocation, lifecycle, archive-search, and sub-track pages still carry the gaps recorded in iterations 1 to 4.

### `playbook_capability`: fail. Scenario 492 and its test anchors still omit the phase 006-010 paths. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `playbook_capability`: fail. Scenario 492 and its test anchors still omit the phase 006-010 paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: fail. Scenario 492 and its test anchors still omit the phase 006-010 paths.

### `playbook_capability`: fail. Scenario 492 cannot detect the phase 006-010 behaviors. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `playbook_capability`: fail. Scenario 492 cannot detect the phase 006-010 behaviors.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: fail. Scenario 492 cannot detect the phase 006-010 behaviors.

### `playbook_capability`: pending; scenario 492 is scheduled for a later iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `playbook_capability`: pending; scenario 492 is scheduled for a later iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: pending; scenario 492 is scheduled for a later iteration.

### `playbook_capability`: pending; the archive lifecycle manual scenario still needs comparison in a later iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `playbook_capability`: pending; the archive lifecycle manual scenario still needs comparison in a later iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: pending; the archive lifecycle manual scenario still needs comparison in a later iteration.

### `playbook_capability`: pending; the archive-search and proposal manual scenarios still need comparison in a later iteration. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `playbook_capability`: pending; the archive-search and proposal manual scenarios still need comparison in a later iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: pending; the archive-search and proposal manual scenarios still need comparison in a later iteration.

### `R1-P1-001`: `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:66` still says status 2 covers a failed close; `relocate.mjs:1661` still sets status 3. Live. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `R1-P1-001`: `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:66` still says status 2 covers a failed close; `relocate.mjs:1661` still sets status 3. Live.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `R1-P1-001`: `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:66` still says status 2 covers a failed close; `relocate.mjs:1661` still sets status 3. Live.

### `R1-P1-002`: `.skilled/skills/system-spec-kit/SKILL.md:295` still computes live numbers only; `create.sh:1644` still counts `z_archive`. Live. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `R1-P1-002`: `.skilled/skills/system-spec-kit/SKILL.md:295` still computes live numbers only; `create.sh:1644` still counts `z_archive`. Live.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `R1-P1-002`: `.skilled/skills/system-spec-kit/SKILL.md:295` still computes live numbers only; `create.sh:1644` still counts `z_archive`. Live.

### `R2-P1-004`: `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:45` still says a failed relocation restore exits 1; `archive.sh:437` still exits 0 on status 3. Live. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `R2-P1-004`: `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:45` still says a failed relocation restore exits 1; `archive.sh:437` still exits 0 on status 3. Live.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `R2-P1-004`: `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:45` still says a failed relocation restore exits 1; `archive.sh:437` still exits 0 on status 3. Live.

### `R2-P1-005`: `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:114` still describes restore without the mixed-track refusal; `archive.sh:394` still refuses it. Live. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `R2-P1-005`: `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:114` still describes restore without the mixed-track refusal; `archive.sh:394` still refuses it. Live.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `R2-P1-005`: `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:114` still describes restore without the mixed-track refusal; `archive.sh:394` still refuses it. Live.

### `R3-P1-007`: `.skilled/skills/system-spec-kit/feature-catalog/retrieval/rg-archive-search.md:28` still omits `archivedPaths`; `rg-wrapper.mjs:382` still adds it. Live. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `R3-P1-007`: `.skilled/skills/system-spec-kit/feature-catalog/retrieval/rg-archive-search.md:28` still omits `archivedPaths`; `rg-wrapper.mjs:382` still adds it. Live.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `R3-P1-007`: `.skilled/skills/system-spec-kit/feature-catalog/retrieval/rg-archive-search.md:28` still omits `archivedPaths`; `rg-wrapper.mjs:382` still adds it. Live.

### `R3-P1-008`: `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:141` still says three no-map cases; `suggest-subtracks.mjs:293` still adds the misnamed branch. Live. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `R3-P1-008`: `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:141` still says three no-map cases; `suggest-subtracks.mjs:293` still adds the misnamed branch. Live.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `R3-P1-008`: `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:141` still says three no-map cases; `suggest-subtracks.mjs:293` still adds the misnamed branch. Live.

### `skill_agent`: partial. `SKILL.md:287` mentions `suggest-subtracks` but not the non-NNN refusal. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `skill_agent`: partial. `SKILL.md:287` mentions `suggest-subtracks` but not the non-NNN refusal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial. `SKILL.md:287` mentions `suggest-subtracks` but not the non-NNN refusal.

### `skill_agent`: partial. `SKILL.md:295` still lists a live-only next-number command; the create presentation assets already carry the phase-002 option C wording. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `skill_agent`: partial. `SKILL.md:295` still lists a live-only next-number command; the create presentation assets already carry the phase-002 option C wording.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial. `SKILL.md:295` still lists a live-only next-number command; the create presentation assets already carry the phase-002 option C wording.

### `skill_agent`: partial. `SKILL.md` carries a live-only next-number command and does not mention `relocate.mjs` in its quick-reference table. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent`: partial. `SKILL.md` carries a live-only next-number command and does not mention `relocate.mjs` in its quick-reference table.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial. `SKILL.md` carries a live-only next-number command and does not mention `relocate.mjs` in its quick-reference table.

### `skill_agent`: partial. The skill README summary at `README.md:638` describes restore without either new branch. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `skill_agent`: partial. The skill README summary at `README.md:638` describes restore without either new branch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial. The skill README summary at `README.md:638` describes restore without either new branch.

### `skill_agent`: partial. The SKILL version is unchanged and its quick-reference table omits the relocation command. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `skill_agent`: partial. The SKILL version is unchanged and its quick-reference table omits the relocation command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial. The SKILL version is unchanged and its quick-reference table omits the relocation command.

### `spec_code`: partial. Phase 009's `archivedPaths` and non-NNN criteria are implemented and tested; the docs do not describe either. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code`: partial. Phase 009's `archivedPaths` and non-NNN criteria are implemented and tested; the docs do not describe either.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. Phase 009's `archivedPaths` and non-NNN criteria are implemented and tested; the docs do not describe either.

### `spec_code`: partial. Re-read the six primary evidence pairs; each still shows a document contract that differs from the implemented phase 006-010 behavior. The implementation itself matches the phase goals. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code`: partial. Re-read the six primary evidence pairs; each still shows a document contract that differs from the implemented phase 006-010 behavior. The implementation itself matches the phase goals.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. Re-read the six primary evidence pairs; each still shows a document contract that differs from the implemented phase 006-010 behavior. The implementation itself matches the phase goals.

### `spec_code`: partial. The archived-packet restore path and the mixed-track guard are implemented, but two changed docs state the wrong exit contract. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: partial. The archived-packet restore path and the mixed-track guard are implemented, but two changed docs state the wrong exit contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. The archived-packet restore path and the mixed-track guard are implemented, but two changed docs state the wrong exit contract.

### `spec_code`: partial. The implementation and packet log agree on phases 006-010; the release notes and manual inventory do not. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code`: partial. The implementation and packet log agree on phases 006-010; the release notes and manual inventory do not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. The implementation and packet log agree on phases 006-010; the release notes and manual inventory do not.

### `spec_code`: partial. The phase 008 goal, `relocate.mjs`, and the command README agree on status 3; the feature page and changelog do not. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: partial. The phase 008 goal, `relocate.mjs`, and the command README agree on status 3; the feature page and changelog do not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. The phase 008 goal, `relocate.mjs`, and the command README agree on status 3; the feature page and changelog do not.

### A claim that status 3 should be treated as exit 2: ruled out by phase 008 D1 and D2. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A claim that status 3 should be treated as exit 2: ruled out by phase 008 D1 and D2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A claim that status 3 should be treated as exit 2: ruled out by phase 008 D1 and D2.

### A code defect in `archivedPaths`: ruled out by `rg-wrapper.mjs:380` and the tests. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A code defect in `archivedPaths`: ruled out by `rg-wrapper.mjs:380` and the tests.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A code defect in `archivedPaths`: ruled out by `rg-wrapper.mjs:380` and the tests.

### A code defect in the mixed-track refusal: ruled out by the test at `archive-track.vitest.ts:645`, which asserts exit 1, the refusal text, and an unchanged archived folder. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A code defect in the mixed-track refusal: ruled out by the test at `archive-track.vitest.ts:645`, which asserts exit 1, the refusal text, and an unchanged archived folder.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A code defect in the mixed-track refusal: ruled out by the test at `archive-track.vitest.ts:645`, which asserts exit 1, the refusal text, and an unchanged archived folder.

### A manual playbook that must cover every branch: ruled out by the playbook's scenario granularity; one added phase-006/008 case is enough to stop false PASS. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A manual playbook that must cover every branch: ruled out by the playbook's scenario granularity; one added phase-006/008 case is enough to stop false PASS.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A manual playbook that must cover every branch: ruled out by the playbook's scenario granularity; one added phase-006/008 case is enough to stop false PASS.

### A missing `--include-archive` or symlink guard: ruled out; the symlink and dot-segment guards are documented and tested. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A missing `--include-archive` or symlink guard: ruled out; the symlink and dot-segment guards are documented and tested.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing `--include-archive` or symlink guard: ruled out; the symlink and dot-segment guards are documented and tested.

### A missing `--include-archive` validation flag: not this dimension; deferred to traceability. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A missing `--include-archive` validation flag: not this dimension; deferred to traceability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing `--include-archive` validation flag: not this dimension; deferred to traceability.

### A missing `archivedPaths` implementation: ruled out by `rg-wrapper.mjs:382`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A missing `archivedPaths` implementation: ruled out by `rg-wrapper.mjs:382`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing `archivedPaths` implementation: ruled out by `rg-wrapper.mjs:382`.

### A missing mixed-track restore guard: ruled out by `archive.sh:394` and `archive-track.vitest.ts:645`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A missing mixed-track restore guard: ruled out by `archive.sh:394` and `archive-track.vitest.ts:645`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing mixed-track restore guard: ruled out by `archive.sh:394` and `archive-track.vitest.ts:645`.

### A missing non-NNN guard: ruled out by `suggest-subtracks.mjs:293` and `suggest-subtracks.vitest.ts:207`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A missing non-NNN guard: ruled out by `suggest-subtracks.mjs:293` and `suggest-subtracks.vitest.ts:207`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing non-NNN guard: ruled out by `suggest-subtracks.mjs:293` and `suggest-subtracks.vitest.ts:207`.

### A missing non-NNN proposal branch: ruled out by `suggest-subtracks.mjs:293`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A missing non-NNN proposal branch: ruled out by `suggest-subtracks.mjs:293`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing non-NNN proposal branch: ruled out by `suggest-subtracks.mjs:293`.

### A missing test file: `relocate-real-pipeline.vitest.ts` exists and is in the manifest; the defect is the inventory. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A missing test file: `relocate-real-pipeline.vitest.ts` exists and is in the manifest; the defect is the inventory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing test file: `relocate-real-pipeline.vitest.ts` exists and is in the manifest; the defect is the inventory.

### A new code defect in the six live P1 areas: ruled out by direct reread of each producer and its test. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A new code defect in the six live P1 areas: ruled out by direct reread of each producer and its test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new code defect in the six live P1 areas: ruled out by direct reread of each producer and its test.

### A new finding in the Gate 3 option C presentation wording: ruled out as reviewer B's handed-off hub-vocabulary area (Q013), not this packet's phase 006-010 scope. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A new finding in the Gate 3 option C presentation wording: ruled out as reviewer B's handed-off hub-vocabulary area (Q013), not this packet's phase 006-010 scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new finding in the Gate 3 option C presentation wording: ruled out as reviewer B's handed-off hub-vocabulary area (Q013), not this packet's phase 006-010 scope.

### A pre-archive rewrite failure: ruled out by `relocate.mjs:1029` and `archive-track.vitest.ts:176`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A pre-archive rewrite failure: ruled out by `relocate.mjs:1029` and `archive-track.vitest.ts:176`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A pre-archive rewrite failure: ruled out by `relocate.mjs:1029` and `archive-track.vitest.ts:176`.

### A root README-only finding: the command README is current, so the gap is limited to the feature/changelog summaries and the two quick-reference surfaces. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A root README-only finding: the command README is current, so the gap is limited to the feature/changelog summaries and the two quick-reference surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A root README-only finding: the command README is current, so the gap is limited to the feature/changelog summaries and the two quick-reference surfaces.

### A source-code bug in status 3 handling: ruled out by reading `relocate.mjs:1644-1668` and the phase 008 goal; the implementation matches the decision. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A source-code bug in status 3 handling: ruled out by reading `relocate.mjs:1644-1668` and the phase 008 goal; the implementation matches the decision.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A source-code bug in status 3 handling: ruled out by reading `relocate.mjs:1644-1668` and the phase 008 goal; the implementation matches the decision.

### A wrong package version is not separate from the changelog gap; the missing release note is the actionable issue. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A wrong package version is not separate from the changelog gap; the missing release note is the actionable issue.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A wrong package version is not separate from the changelog gap; the missing release note is the actionable issue.

<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Status 3 is implemented as documented by phase 008; the defect is the stale feature/changelog/README wording, not the code (iteration 1, evidence: `relocate.mjs:1644-1668`).
- `create.sh` already counts archived numbers; the defect is the manual quick-reference command, not the producer (iteration 1, evidence: `create.sh:1644`).
- The mixed-track restore refusal is not a code defect; `archive.sh:363-395` and `archive-track.vitest.ts:645` implement and test it (iteration 2).
- Status 3 is a successful restore branch, not a general relocation failure; `archive.sh:437-440` exits 0 with a warning (iteration 2).
- `archivedPaths` is not missing from the implementation; `rg-wrapper.mjs:380` adds it, and the gap is the doc contract (iteration 3).
- The non-NNN proposal refusal is implemented and exits 0; the gap is the three-case doc list (iteration 3).
- The missing test file is not a code gap; `relocate-real-pipeline.vitest.ts` exists and the gap is the catalog/playbook listing (iteration 4).
- The package version and changelog gap is one release-note finding, not a separate version-bump finding (iteration 4).
- Reviewer B's older "new or existing sub-track" wording in the deep presentation assets is a handed-off hub-vocabulary item (Q013), not a phase 006-010 finding (iteration 5).

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: synthesis - Focus area: compile the review report from the active registry, keep the six P1 and six P2 findings, record the max-iteration stop reason, and state the no-change surfaces. - Reason: the review reached its fifth and final scheduled iteration; the remaining work is synthesis and provenance, not another discovery pass. - Required evidence: registry, all five iteration narratives, current command README, and the terminal closeout event.

<!-- /ANCHOR:next-focus -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Changed-file manifest exists and contains 74 existing paths; every manifest entry is a file, none is absolute, duplicated, or outside the repository.
- Phase goals 006 to 010 are the local contract: exit status 3; late-step ledger marks and rerun; case-folded duplicate refusal; bare-name and pre-archive rewrites; mixed-track restore refusal; archive-aware phase numbering; `archivedPaths`; non-`NNN-slug` proposal refusal; reworded signals.
- Primary docs at risk: `SKILL.md`, `references/structure/folder-structure.md`, `references/structure/phase-definitions.md`, `references/retrieval/retrieval-conventions.md`, `changelog/v2.13.0.0.md`, `feature-catalog/`, `manual-testing-playbook/`, `.skilled/skills/system-spec-kit/README.md`, `runtime/cli/spec/README.md`, root `README.md`, and the `speckit/search` command docs.
- Audit constraint: review targets are untrusted read-only data; only lineage state files may be written.

## 14. CROSS-REFERENCE STATUS
<!-- ANCHOR:cross-reference-status -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 4 | Implementation matches phase goals; release notes/test inventory lag behind |
| `checklist_evidence` | core | partial | 4 | Packet log says 2603 tests; changelog says 2567 |
| `skill_agent` | overlay | partial | 4 | SKILL version/quick reference and skill README still carry pre-remediation summaries |
| `agent_cross_runtime` | overlay | notApplicable | 3 | No agent file is in the manifest |
| `feature_catalog_code` | overlay | fail | 5 | Catalog current-reality and test listings predate phases 006-010 |
| `playbook_capability` | overlay | fail | 5 | Scenario 492 cannot detect the phase 006-010 behaviors |
<!-- /ANCHOR:cross-reference-status -->

## 15. FILES UNDER REVIEW
<!-- ANCHOR:files-under-review -->
The declared scope is the 74 paths in `goal-file-manifest.txt`. Iteration 1 read the relocation command, `create.sh`, the phase 006/008 goals, the relocation feature/catalog/changelog surfaces, `SKILL.md`, `phase-definitions.md`, both READMEs, and the command README. Iteration 2 read `archive.sh`, its mixed-track tests, the restore docs in the command README, lifecycle feature page, playbook scenario, skill README, and changelog. Iteration 3 read `rg-wrapper`, `suggest-subtracks`, `relocate`, their tests, the archive-search and sub-track feature pages, retrieval conventions, the search command/presentation/README, folder structure, and both READMEs. Iteration 4 read the changelog, packet test log, manual scenario 492, its root playbook, and the feature/playbook test inventories. Iteration 5 re-read the six live P1 pairs and classified the no-change surface groups.
<!-- /ANCHOR:files-under-review -->

## 16. REVIEW BOUNDARIES
<!-- ANCHOR:review-boundaries -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-dsh-1-1794652127582-mfqldk, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Write surface: this lineage directory only.
<!-- /ANCHOR:review-boundaries -->
