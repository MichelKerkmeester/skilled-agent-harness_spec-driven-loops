---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Review all shipped work of the /doctor:git setup program for correctness, security, traceability and maintainability, and judge whether it is complete: commits 8d40b8c128 through 0b2414a14b on main (git log c05034a20b..0b2414a14b). Scope: .skilled/commands/doctor/scripts/git-setup-check.cjs and tests/git-setup-check.test.cjs, assets/doctor-git-setup.yaml, assets/doctor-git-presentation.txt, git.md, _routes.yaml, scripts/route-validate.py and its test, .github/scripts/check-gate-inputs.sh and its test, .skilled/skills/sk-git/assets/commit-message-template.md, sk-git SKILL.md, README.md, feature-catalog/workflow-playbooks/doctor-git-settings.md, manual-testing-playbook DOC-384, the root README.md sk-git sections, and the packets specs/sk-git/033-git-setup-customization/002-doctor-git-setup and specs/sk-git/034-standards-template-round-trip. Invariants to attack: the battery writes nothing and never runs code from the repository it inspects (any git, helper or config path a repository can steer), exit codes and the STATUS line agree, each FAIL's repair actually fixes it, each check matches what the hooks and helpers really do, tests fail when the behavior breaks, and every doc that lists /doctor:git targets names setup accurately. Every finding needs a concrete failure case and path:line evidence.

Target type: files. Dimension queue (risk order): inventory+correctness -> security -> traceability -> maintainability. Max iterations: 5. Convergence threshold: 0.10. Stop policy: convergence.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Not fixing anything: review only; no edits outside the review packet.
- Not reviewing the trigger-index rebuild commits or the unrelated system-deep-loop/system-spec-kit commits in the range (fd0be90cc2 reduce-state and resource-map extractor changes) except where they touch /doctor:git docs.
- Not reviewing specs/sk-git/033-git-setup-customization/003-improvement-research (a parallel research run owns it).

---

## 5. STOP CONDITIONS
- Max 5 iterations reached.
- Legal convergence with all four dimensions covered and claim-adjudication passing.

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
- P1 (Required): 8
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->
- Active totals after iteration 2: P0=0, P1=4, P2=3 (prior active findings plus this iteration's four findings).
## 8. WHAT WORKED
- Iteration 3: DOC-384 output matched eleven result/source rows and the final STATUS line; the scanned target lists named setup.
- Tracing the battery's verdict against the shared hook-flag reader exposed a persistent configuration source the checker does not consult (iteration 1).
- Comparing the Codex test fixture with the documented runtime event showed that marker presence is weaker than registration (iteration 1).
- Iteration 2: direct source reads connected process lookup, filesystem reads, and Git environment selection to four concrete failure cases.
## 9. WHAT FAILED
- Iteration 3: the 034 serializer path probe returned ENOENT, so template-to-serializer behavior remains unverified.
- Dynamic execution was not performed: the test suite schedules fs.rmSync cleanup for temporary fixtures, and this dispatch bans executing removal operations. Test assertions were inspected statically (iteration 1).

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Core traceability:** `spec_code` and `checklist_evidence` remain partial because the serializer test body was not inspected and the SessionStart fixture remains inconsistent with the recorded adapter contract. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Core traceability:** `spec_code` and `checklist_evidence` remain partial because the serializer test body was not inspected and the SessionStart fixture remains inconsistent with the recorded adapter contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Core traceability:** `spec_code` and `checklist_evidence` remain partial because the serializer test body was not inspected and the SessionStart fixture remains inconsistent with the recorded adapter contract.

### **Duplicate route targets:** the validator documents C1 as scoped within one command (`route-validate.py:16`) and supplies `(command_name, target)` pairs to the duplicate check (`:687`–`:691`). The test creates a duplicate route and expects C1 failure, then checks that `setup` repeated across commands passes (`route-validate.test.sh:133`–`:143`). These assertions would fail if duplicate detection were removed or made global. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Duplicate route targets:** the validator documents C1 as scoped within one command (`route-validate.py:16`) and supplies `(command_name, target)` pairs to the duplicate check (`:687`–`:691`). The test creates a duplicate route and expects C1 failure, then checks that `setup` repeated across commands passes (`route-validate.test.sh:133`–`:143`). These assertions would fail if duplicate detection were removed or made global.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Duplicate route targets:** the validator documents C1 as scoped within one command (`route-validate.py:16`) and supplies `(command_name, target)` pairs to the duplicate check (`:687`–`:691`). The test creates a duplicate route and expects C1 failure, then checks that `setup` repeated across commands passes (`route-validate.test.sh:133`–`:143`). These assertions would fail if duplicate detection were removed or made global.

### **Gate-input sentinel:** the parser emits a note for `/dev/null/.skilled-untrusted` and strips only that sentinel from the segment (`check-gate-inputs.sh:283`–`:289`). The test requires the sentinel-only case to pass and an adjacent missing path to fail (`check-gate-inputs.test.sh:477`–`:487`). These assertions would fail if the sentinel behavior broke or hid the neighboring missing path. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Gate-input sentinel:** the parser emits a note for `/dev/null/.skilled-untrusted` and strips only that sentinel from the segment (`check-gate-inputs.sh:283`–`:289`). The test requires the sentinel-only case to pass and an adjacent missing path to fail (`check-gate-inputs.test.sh:477`–`:487`). These assertions would fail if the sentinel behavior broke or hid the neighboring missing path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Gate-input sentinel:** the parser emits a note for `/dev/null/.skilled-untrusted` and strips only that sentinel from the segment (`check-gate-inputs.sh:283`–`:289`). The test requires the sentinel-only case to pass and an adjacent missing path to fail (`check-gate-inputs.test.sh:477`–`:487`). These assertions would fail if the sentinel behavior broke or hid the neighboring missing path.

### **Overlay traceability:** `feature_catalog_code` and `playbook_capability` retain their prior pass status; `skill_agent` and `agent_cross_runtime` remain partial. Resource-map coverage is not applicable because `resource-map.md` is absent. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Overlay traceability:** `feature_catalog_code` and `playbook_capability` retain their prior pass status; `skill_agent` and `agent_cross_runtime` remain partial. Resource-map coverage is not applicable because `resource-map.md` is absent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay traceability:** `feature_catalog_code` and `playbook_capability` retain their prior pass status; `skill_agent` and `agent_cross_runtime` remain partial. Resource-map coverage is not applicable because `resource-map.md` is absent.

### **Serializer and 034 packet:** `serialize()` preserves the styled layout only when the parsed original text already equals the serializer's canonical output; otherwise it falls back to `JSON.stringify()` (`git-standards.cjs:135`–`:139`). The 034 spec records that this fallback rewrote the rules block and names the template reflow and round-trip requirements (`spec.md:33`–`:37`, `:72`–`:75`); the implementation summary claims the `commitId` entry was reflowed (`implementation-summary.md:52`–`:54`). The shipped file's enforced rules block and `commitId` section were read (`commit-message-template.md:177`–`:184`, `:262`–`:267`). The dedicated test file was located, but its assertions were not read; mutation sensitivity for this test remains **blocked**. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Serializer and 034 packet:** `serialize()` preserves the styled layout only when the parsed original text already equals the serializer's canonical output; otherwise it falls back to `JSON.stringify()` (`git-standards.cjs:135`–`:139`). The 034 spec records that this fallback rewrote the rules block and names the template reflow and round-trip requirements (`spec.md:33`–`:37`, `:72`–`:75`); the implementation summary claims the `commitId` entry was reflowed (`implementation-summary.md:52`–`:54`). The shipped file's enforced rules block and `commitId` section were read (`commit-message-template.md:177`–`:184`, `:262`–`:267`). The dedicated test file was located, but its assertions were not read; mutation sensitivity for this test remains **blocked**.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Serializer and 034 packet:** `serialize()` preserves the styled layout only when the parsed original text already equals the serializer's canonical output; otherwise it falls back to `JSON.stringify()` (`git-standards.cjs:135`–`:139`). The 034 spec records that this fallback rewrote the rules block and names the template reflow and round-trip requirements (`spec.md:33`–`:37`, `:72`–`:75`); the implementation summary claims the `commitId` entry was reflowed (`implementation-summary.md:52`–`:54`). The shipped file's enforced rules block and `commitId` section were read (`commit-message-template.md:177`–`:184`, `:262`–`:267`). The dedicated test file was located, but its assertions were not read; mutation sensitivity for this test remains **blocked**.

### A DOC-384 output-shape mismatch on this checkout: observed eleven rows and final `STATUS=OK checks=11`, exit 0. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A DOC-384 output-shape mismatch on this checkout: observed eleven rows and final `STATUS=OK checks=11`, exit 0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A DOC-384 output-shape mismatch on this checkout: observed eleven rows and final `STATUS=OK checks=11`, exit 0.

### A repository-configured fsmonitor or gpg.program executing through the reviewed Git queries: the test fixtures plant both markers; the checker adds a command-line core.fsmonitor=false and overrides fsmonitor and log.showSignature in its child environment. Dynamic execution of those tests was not performed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A repository-configured fsmonitor or gpg.program executing through the reviewed Git queries: the test fixtures plant both markers; the checker adds a command-line core.fsmonitor=false and overrides fsmonitor and log.showSignature in its child environment. Dynamic execution of those tests was not performed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A repository-configured fsmonitor or gpg.program executing through the reviewed Git queries: the test fixtures plant both markers; the checker adds a command-line core.fsmonitor=false and overrides fsmonitor and log.showSignature in its child environment. Dynamic execution of those tests was not performed.

### A setup target omission in the named `/doctor:git` lists: exact searches found setup in the route, presentation valid-target line, docs, playbook, command index and root README. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A setup target omission in the named `/doctor:git` lists: exact searches found setup in the route, presentation valid-target line, docs, playbook, command index and root README.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A setup target omission in the named `/doctor:git` lists: exact searches found setup in the route, presentation valid-target line, docs, playbook, command index and root README.

### Core `checklist_evidence`: no new evidence review in this dimension; iteration 3's AC-002 evidence issue remains carry-forward. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Core `checklist_evidence`: no new evidence review in this dimension; iteration 3's AC-002 evidence issue remains carry-forward.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `checklist_evidence`: no new evidence review in this dimension; iteration 3's AC-002 evidence issue remains carry-forward.

### Core `checklist_evidence`: two P2 evidence gaps recorded above. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Core `checklist_evidence`: two P2 evidence gaps recorded above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `checklist_evidence`: two P2 evidence gaps recorded above.

### Core `spec_code` and `checklist_evidence`: not assessed in this security pass; prior state remains partial. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Core `spec_code` and `checklist_evidence`: not assessed in this security pass; prior state remains partial.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code` and `checklist_evidence`: not assessed in this security pass; prior state remains partial.

### Core `spec_code`: partial. The 033 checker claims were compared with the current renderer and the observed battery run. The 034 serializer implementation was not verified because the attempted source path was absent. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Core `spec_code`: partial. The 033 checker claims were compared with the current renderer and the observed battery run. The 034 serializer implementation was not verified because the attempted source path was absent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code`: partial. The 033 checker claims were compared with the current renderer and the observed battery run. The 034 serializer implementation was not verified because the attempted source path was absent.

### Core `spec_code`: partial. The shipped standards check uses `message-contract.mjs` directly, but the requested 034 template round-trip claim could not be adjudicated from the visible output. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Core `spec_code`: partial. The shipped standards check uses `message-contract.mjs` directly, but the requested 034 template round-trip claim could not be adjudicated from the visible output.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code`: partial. The shipped standards check uses `message-contract.mjs` directly, but the requested 034 template round-trip claim could not be adjudicated from the visible output.

### Core checklist_evidence: partial. AC-007 is marked Met with the AI-tool hook test as evidence [SOURCE: specs/sk-git/033-git-setup-customization/002-doctor-git-setup/acceptance-criteria.md:60], but the positive Codex fixture does not use the documented event contract [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:337]. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Core checklist_evidence: partial. AC-007 is marked Met with the AI-tool hook test as evidence [SOURCE: specs/sk-git/033-git-setup-customization/002-doctor-git-setup/acceptance-criteria.md:60], but the positive Codex fixture does not use the documented event contract [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:337].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core checklist_evidence: partial. AC-007 is marked Met with the AI-tool hook test as evidence [SOURCE: specs/sk-git/033-git-setup-customization/002-doctor-git-setup/acceptance-criteria.md:60], but the positive Codex fixture does not use the documented event contract [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:337].

### Core spec_code: partial. The spec describes a read-only setup report for surfaces that may otherwise appear healthy [SOURCE: specs/sk-git/033-git-setup-customization/002-doctor-git-setup/spec.md:3]. The persistent switch and runtime registration findings leave gaps in that report. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Core spec_code: partial. The spec describes a read-only setup report for surfaces that may otherwise appear healthy [SOURCE: specs/sk-git/033-git-setup-customization/002-doctor-git-setup/spec.md:3]. The persistent switch and runtime registration findings leave gaps in that report.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec_code: partial. The spec describes a read-only setup report for surfaces that may otherwise appear healthy [SOURCE: specs/sk-git/033-git-setup-customization/002-doctor-git-setup/spec.md:3]. The persistent switch and runtime registration findings leave gaps in that report.

### Cross-runtime adapter behavior was not re-audited in this dimension; the six-adapter implementation remains outside this traceability conclusion. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Cross-runtime adapter behavior was not re-audited in this dimension; the six-adapter implementation remains outside this traceability conclusion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cross-runtime adapter behavior was not re-audited in this dimension; the six-adapter implementation remains outside this traceability conclusion.

### Duplicate contract parsing inside `git-setup-check.cjs`: ruled out for the inspected standards path because `checkStandards` imports and calls `resolveContractDir` and `loadContract` from the shared module. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Duplicate contract parsing inside `git-setup-check.cjs`: ruled out for the inspected standards path because `checkStandards` imports and calls `resolveContractDir` and `loadContract` from the shared module.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Duplicate contract parsing inside `git-setup-check.cjs`: ruled out for the inspected standards path because `checkStandards` imports and calls `resolveContractDir` and `loadContract` from the shared module.

### Exit/status mismatch in the current reviewed branches: the JSON status and return code use the same failed predicate, and human output derives its STATUS line from failed rows. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Exit/status mismatch in the current reviewed branches: the JSON status and return code use the same failed predicate, and human output derives its STATUS line from failed rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Exit/status mismatch in the current reviewed branches: the JSON status and return code use the same failed predicate, and human output derives its STATUS line from failed rows.

### Global duplicate target rejection: the real-manifest test explicitly requires same-name targets across different commands to pass. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Global duplicate target rejection: the real-manifest test explicitly requires same-name targets across different commands to pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Global duplicate target rejection: the real-manifest test explicitly requires same-name targets across different commands to pass.

### Overlay `feature_catalog_code` and `playbook_capability`: passed in iteration 3. Setup naming was not re-audited here, per the no-repeat constraint. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Overlay `feature_catalog_code` and `playbook_capability`: passed in iteration 3. Setup naming was not re-audited here, per the no-repeat constraint.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `feature_catalog_code` and `playbook_capability`: passed in iteration 3. Setup naming was not re-audited here, per the no-repeat constraint.

### Overlay `feature_catalog_code`: confirmed; the feature catalog names setup and describes it as read-only. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay `feature_catalog_code`: confirmed; the feature catalog names setup and describes it as read-only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `feature_catalog_code`: confirmed; the feature catalog names setup and describes it as read-only.

### Overlay `playbook_capability`: confirmed for the expected output shape. `node .skilled/commands/doctor/scripts/git-setup-check.cjs --repo . --tool claude` printed eleven rows with result/source lines and `STATUS=OK checks=11`; exit 0. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay `playbook_capability`: confirmed for the expected output shape. `node .skilled/commands/doctor/scripts/git-setup-check.cjs --repo . --tool claude` printed eleven rows with result/source lines and `STATUS=OK checks=11`; exit 0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `playbook_capability`: confirmed for the expected output shape. `node .skilled/commands/doctor/scripts/git-setup-check.cjs --repo . --tool claude` printed eleven rows with result/source lines and `STATUS=OK checks=11`; exit 0.

### Overlay `skill_agent` and `agent_cross_runtime`: prior partial status remains unchanged; not part of this maintainability pass. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Overlay `skill_agent` and `agent_cross_runtime`: prior partial status remains unchanged; not part of this maintainability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `skill_agent` and `agent_cross_runtime`: prior partial status remains unchanged; not part of this maintainability pass.

### Overlay `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: not assessed; prior state remains pending or partial. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Overlay `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: not assessed; prior state remains pending or partial.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: not assessed; prior state remains pending or partial.

### Overlay agent_cross_runtime: partial; the README distinguishes each runtime's event and adapter [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:77]. Only the Codex false-positive path is adjudicated here. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay agent_cross_runtime: partial; the README distinguishes each runtime's event and adapter [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:77]. Only the Codex false-positive path is adjudicated here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay agent_cross_runtime: partial; the README distinguishes each runtime's event and adapter [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:77]. Only the Codex false-positive path is adjudicated here.

### Overlay feature_catalog_code and playbook_capability: pending; the feature catalog and manual playbook were not reviewed in this iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay feature_catalog_code and playbook_capability: pending; the feature catalog and manual playbook were not reviewed in this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay feature_catalog_code and playbook_capability: pending; the feature catalog and manual playbook were not reviewed in this iteration.

### Overlay skill_agent: partial; the hook README documents the shared switch and suppression behavior [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:30]. The sk-git SKILL.md route is deferred. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay skill_agent: partial; the hook README documents the shared switch and suppression behavior [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:30]. The sk-git SKILL.md route is deferred.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay skill_agent: partial; the hook README documents the shared switch and suppression behavior [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:30]. The sk-git SKILL.md route is deferred.

### Sentinel overreach that hides a neighboring missing path: the test at `check-gate-inputs.test.sh:483`–`:487` requires that path to remain a failure. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Sentinel overreach that hides a neighboring missing path: the test at `check-gate-inputs.test.sh:483`–`:487` requires that path to remain a failure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Sentinel overreach that hides a neighboring missing path: the test at `check-gate-inputs.test.sh:483`–`:487` requires that path to remain a failure.

### Setup-name drift across the feature catalog and manual playbook: not repeated; iteration 3 recorded both surfaces as passing. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Setup-name drift across the feature catalog and manual playbook: not repeated; iteration 3 recorded both surfaces as passing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Setup-name drift across the feature catalog and manual playbook: not repeated; iteration 3 recorded both surfaces as passing.

### Skill and route naming: the command hint, route row, setup workflow, sk-git skill/README, feature playbook, manual scenario, command index and both root README surfaces name setup. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Skill and route naming: the command hint, route row, setup workflow, sk-git skill/README, feature playbook, manual scenario, command index and both root README surfaces name setup.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Skill and route naming: the command hint, route row, setup workflow, sk-git skill/README, feature playbook, manual scenario, command index and both root README surfaces name setup.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Runtime exit/status disagreement in the reviewed branches: human output, JSON output, and process status all derive from the same FAIL-only predicate. The existing human test also exercises a no-fail run containing SKIP (iteration 1; evidence: .skilled/commands/doctor/scripts/git-setup-check.cjs:681-687,753-759; .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:157-177).
- Git hook path lookup: a read-only git probe with core.hooksPath set returned the configured path from rev-parse --git-path hooks, matching the check's lookup (iteration 1; evidence: .skilled/commands/doctor/scripts/git-setup-check.cjs:231-235).

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: maintainability - Focus area: finish the blocked serializer round-trip and duplicate-target scoping checks, then inspect mutation sensitivity in `route-validate.test.sh` and `check-gate-inputs.test.sh`. - Reason: those requested surfaces were not inspectable in the combined output, so the dimension remains partial. - Rotation status: productive carry-forward. - Blocked/productive carry-forward: complete the four blocked checks listed above. - Required evidence: direct reads of `git-standards.cjs`, `message-contract.mjs`, the 034 packet claims and tests, `route-validate.py` with its test, and the gate-input script with its test. - Recovery note: use focused reads so the evidence remains within the output budget.

<!-- /ANCHOR:next-focus -->

## Iteration 3 Counts
- New findings: P0=0, P1=0, P2=2.
- Running totals: P0=0, P1=4, P2=5.
- Traceability core coverage: checklist evidence has two P2 gaps; 034 serializer implementation remains unverified.

## Iteration 4 Update
- Maintainability coverage: partial; score=0.57 (four of seven required search-ledger directions adjudicated).
- New findings: P0=0, P1=0, P2=3.
- Running totals: P0=0, P1=4, P2=8.
- What Worked (iteration 4): direct reads identified two test-survival cases and confirmed the standards check delegates to the shared contract loader.
- What Failed (iteration 4): combined read output hid the serializer, duplicate-target, and gate-input test evidence; those checks remain blocked.
- Next focus: complete the four blocked maintainability checks listed in the next-focus section.
## 13. KNOWN CONTEXT
Continuity ladder: this packet has no handover.md and its spec docs are scaffold stubs, so the ladder yields no prior review context. Prior work: specs/sk-git/033-git-setup-customization/002-doctor-git-setup/implementation-summary.md claims an eleven-check read-only battery that loads helpers from its own install root, exit codes 0/1/2, --json, and three defects fixed during build (hooks check no longer calls install-git-hooks.sh --status; release branches exempt from allowlist; ai-tool-hooks and Commit-Id repairs no longer name the hook installer). 034-standards-template-round-trip covers the commit-message-template serializer layout fix (6c2c3304d3). resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks started across core and overlay protocols; unreviewed overlays remain pending.]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 1 | Findings expose gaps against the documented suppression and registration surfaces. |
| `checklist_evidence` | core | partial | 1 | AC-007 evidence asserts a Codex marker under SessionStart, not the documented PreToolUse registration. |
| `skill_agent` | overlay | partial | 1 | Hook README reviewed; SKILL.md integration claims deferred. |
| `agent_cross_runtime` | overlay | partial | 1 | Adapter event contract reviewed for the Codex registration finding; full runtime matrix deferred. |
| `feature_catalog_code` | overlay | pass | 3 | Prior iteration validated the feature catalog setup route. |
| `playbook_capability` | overlay | pass | 3 | Prior iteration validated the DOC-384 setup scenario. |
<!-- MACHINE-OWNED: END -->

## Iteration 5 Update
- Traceability/correctness replay completed for the serializer implementation and claims, duplicate-target scoping, gate-input sentinel scope, and four active P1s.
- New findings: P0=0, P1=0, P2=0.
- Running totals remain: P0=0, P1=4, P2=8.
- Dimension coverage: correctness, security, traceability, maintainability (4/4).
- Traceability status: core `spec_code` and `checklist_evidence` partial; overlay `feature_catalog_code` and `playbook_capability` pass; `skill_agent` and `agent_cross_runtime` partial.
- Closed checks: route duplicate scoping and gate-input sentinel mutation sensitivity.
- Blocked evidence: the located serializer round-trip test body was not read; inspect it and `safeGitEnv()` only if another pass is authorized.
- Verdict: CONDITIONAL because four active P1 findings remain and no P0 is active.

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/commands/doctor/scripts/git-setup-check.cjs | correctness, security | 1, 2 | R1-P1-001, R1-P1-002, R2-P1-001, R2-P1-002, R2-P2-001, R2-P2-002 | reviewed |
| .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs | correctness | 1 | R1-P1-002, R1-P2-001 | reviewed |
| .skilled/commands/doctor/assets/doctor-git-setup.yaml | - | - | - | pending |
| .skilled/commands/doctor/assets/doctor-git-presentation.txt | - | - | - | pending |
| .skilled/commands/doctor/git.md | - | - | - | pending |
| .skilled/commands/doctor/_routes.yaml | - | - | - | pending |
| .skilled/commands/doctor/scripts/route-validate.py | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/route-validate.test.sh | - | - | - | pending |
| .github/scripts/check-gate-inputs.sh | - | - | - | pending |
| .github/scripts/tests/check-gate-inputs.test.sh | - | - | - | pending |
| .skilled/skills/sk-git/assets/commit-message-template.md | - | - | - | pending |
| .skilled/skills/sk-git/SKILL.md | - | - | - | pending |
| .skilled/skills/sk-git/README.md | - | - | - | pending |
| .skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md | - | - | - | pending |
| .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md | - | - | - | pending |
| README.md | - | - | - | pending |
| specs/sk-git/033-git-setup-customization/002-doctor-git-setup/spec.md | - | - | - | pending |
| specs/sk-git/033-git-setup-customization/002-doctor-git-setup/plan.md | - | - | - | pending |
| specs/sk-git/033-git-setup-customization/002-doctor-git-setup/tasks.md | - | - | - | pending |
| specs/sk-git/033-git-setup-customization/002-doctor-git-setup/acceptance-criteria.md | - | - | - | pending |
| specs/sk-git/033-git-setup-customization/002-doctor-git-setup/implementation-summary.md | - | - | - | pending |
| specs/sk-git/034-standards-template-round-trip/spec.md | - | - | - | pending |
| specs/sk-git/034-standards-template-round-trip/plan.md | - | - | - | pending |
| specs/sk-git/034-standards-template-round-trip/tasks.md | - | - | - | pending |
| specs/sk-git/034-standards-template-round-trip/implementation-summary.md | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-10-15T13:35:35.122Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-10-15T13:35:35.122Z
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
