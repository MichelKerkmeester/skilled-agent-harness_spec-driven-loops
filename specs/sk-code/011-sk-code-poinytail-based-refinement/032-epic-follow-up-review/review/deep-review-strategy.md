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
Scoped follow-up to the 030 epic review, covering what it left unread: the sk-git Commit-Id hooks (prepare-commit-msg stamping, commit-msg and pre-push refusal, lib/commit-id-policy.sh enrollment and the shipped allocator fallback in an untrusted clone), the Pi Fast Mode extension (default-on, saved state, --fast flag and subagent handoff precedence) and a line-by-line audit of every claim in .skilled/changelog/skilled/v4.0.0.4.md against the tree. Scope: the 32 files in review/scope-files.txt; for the changelog audit you may open any path the changelog itself names.

Passes: Commit-Id correctness, Commit-Id and Pi security, Pi Fast Mode correctness, changelog claim-to-tree traceability, maintainability. Max iterations 5, convergence threshold 0.1, stop policy max-iterations. Each child phase spec.md, goal.md and implementation-summary.md under specs/sk-code/011-sk-code-poinytail-based-refinement/ states what it shipped and why.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Anything the 030 review already covered, except where the changelog audit needs it.
- The three 030 advisories, fixed in 031.

---

## 5. STOP CONDITIONS
- Stop policy max-iterations: run all 5 iterations; convergence is telemetry only.

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
- P0 (Blockers): 1
- P1 (Required): 1
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Hook trust-boundary tracing: following SOURCE_ROOT from the trust check to each executable consumer exposed the clone-controlled fallback.

---

## 9. WHAT FAILED
- Non-target changelog claim verification remains incomplete: a path-existence scan does not prove each feature claim.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `changelog_claim_audit`: PARTIAL. The complete 475-line changelog was read and root-relative path tokens were scanned. Commit-Id line 135 remains contradicted by active R2-P0-001; Pi Fast Mode line 427 matches the code and playbooks. Behavioral claims in the remaining sections are explicitly deferred because their implementation paths were not fully checked in this scoped iteration. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `changelog_claim_audit`: PARTIAL. The complete 475-line changelog was read and root-relative path tokens were scanned. Commit-Id line 135 remains contradicted by active R2-P0-001; Pi Fast Mode line 427 matches the code and playbooks. Behavioral claims in the remaining sections are explicitly deferred because their implementation paths were not fully checked in this scoped iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `changelog_claim_audit`: PARTIAL. The complete 475-line changelog was read and root-relative path tokens were scanned. Commit-Id line 135 remains contradicted by active R2-P0-001; Pi Fast Mode line 427 matches the code and playbooks. Behavioral claims in the remaining sections are explicitly deferred because their implementation paths were not fully checked in this scoped iteration.

### `checklist_evidence`: PARTIAL. Pi source anchors and playbooks align for startup, persistence, and handoff. Hook test sources were inspected but not run; the all-zero case remains uncovered as recorded by R3-P1-001. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence`: PARTIAL. Pi source anchors and playbooks align for startup, persistence, and handoff. Hook test sources were inspected but not run; the all-zero case remains uncovered as recorded by R3-P1-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: PARTIAL. Pi source anchors and playbooks align for startup, persistence, and handoff. Hook test sources were inspected but not run; the all-zero case remains uncovered as recorded by R3-P1-001.

### `checklist_evidence`: PARTIAL. Test sources were inspected, not run; the scoped hook tests do not exercise the all-zero boundary. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence`: PARTIAL. Test sources were inspected, not run; the scoped hook tests do not exercise the all-zero boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: PARTIAL. Test sources were inspected, not run; the scoped hook tests do not exercise the all-zero boundary.

### `feature_catalog_code` / `playbook_capability`: PARTIAL. Target Commit-Id and Pi claims were compared to implementation; unrelated catalog and playbook claims remain for traceability. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code` / `playbook_capability`: PARTIAL. Target Commit-Id and Pi claims were compared to implementation; unrelated catalog and playbook claims remain for traceability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` / `playbook_capability`: PARTIAL. Target Commit-Id and Pi claims were compared to implementation; unrelated catalog and playbook claims remain for traceability.

### `feature_catalog_code`: PARTIAL. The sk-git catalog's no-allocator statement conflicts with the current enrollment policy; Pi Fast Mode is documented in its README and source README, without a feature-catalog directory. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `feature_catalog_code`: PARTIAL. The sk-git catalog's no-allocator statement conflicts with the current enrollment policy; Pi Fast Mode is documented in its README and source README, without a feature-catalog directory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: PARTIAL. The sk-git catalog's no-allocator statement conflicts with the current enrollment policy; Pi Fast Mode is documented in its README and source README, without a feature-catalog directory.

### `playbook_capability`: PARTIAL. Pi playbooks cover startup, persistence, and child preference. GIT-044 covers ID lookup queries, not enrollment or untrusted-clone fallback. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `playbook_capability`: PARTIAL. Pi playbooks cover startup, persistence, and child preference. GIT-044 covers ID lookup queries, not enrollment or untrusted-clone fallback.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: PARTIAL. Pi playbooks cover startup, persistence, and child preference. GIT-044 covers ID lookup queries, not enrollment or untrusted-clone fallback.

### `skill_agent` / `agent_cross_runtime`: NOT APPLICABLE. No feature-owner agent for these hooks or the Pi extension was found in the runtime agent directories. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `skill_agent` / `agent_cross_runtime`: NOT APPLICABLE. No feature-owner agent for these hooks or the Pi extension was found in the runtime agent directories.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` / `agent_cross_runtime`: NOT APPLICABLE. No feature-owner agent for these hooks or the Pi extension was found in the runtime agent directories.

### `skill_agent` / `agent_cross_runtime`: PARTIAL. The Codex deep-review definition was loaded; target feature-agent ownership and runtime mirrors were not part of this correctness pass. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `skill_agent` / `agent_cross_runtime`: PARTIAL. The Codex deep-review definition was loaded; target feature-agent ownership and runtime mirrors were not part of this correctness pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` / `agent_cross_runtime`: PARTIAL. The Codex deep-review definition was loaded; target feature-agent ownership and runtime mirrors were not part of this correctness pass.

### `spec_code`: PARTIAL. The allocator and downstream hook gates disagree on whether zero is valid. The changelog no-repository-code claim remains tracked by `R2-P0-001` [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:135]. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code`: PARTIAL. The allocator and downstream hook gates disagree on whether zero is valid. The changelog no-repository-code claim remains tracked by `R2-P0-001` [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:135].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PARTIAL. The allocator and downstream hook gates disagree on whether zero is valid. The changelog no-repository-code claim remains tracked by `R2-P0-001` [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:135].

### `spec_code`: PARTIAL. The review phase spec is a scaffold, not a feature contract. The Commit-Id fallback contradiction remains in active R2-P0-001, and the allocator-versus-gate mismatch remains in active R3-P1-001. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code`: PARTIAL. The review phase spec is a scaffold, not a feature contract. The Commit-Id fallback contradiction remains in active R2-P0-001, and the allocator-versus-gate mismatch remains in active R3-P1-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PARTIAL. The review phase spec is a scaffold, not a feature contract. The Commit-Id fallback contradiction remains in active R2-P0-001, and the allocator-versus-gate mismatch remains in active R3-P1-001.

### agent_cross_runtime: not applicable to these feature targets in this iteration. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: agent_cross_runtime: not applicable to these feature targets in this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime: not applicable to these feature targets in this iteration.

### changelog claim audit: partial. The full 475-line changelog and its claim headings were inventoried. Commit-Id and Pi Fast Mode claims were compared with source. Semantic verification of the remaining claims was not completed; this is explicit audit debt, not a clean result. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: changelog claim audit: partial. The full 475-line changelog and its claim headings were inventoried. Commit-Id and Pi Fast Mode claims were compared with source. Semantic verification of the remaining claims was not completed; this is explicit audit debt, not a clean result.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: changelog claim audit: partial. The full 475-line changelog and its claim headings were inventoried. Commit-Id and Pi Fast Mode claims were compared with source. Semantic verification of the remaining claims was not completed; this is explicit audit debt, not a clean result.

### checklist_evidence: partial. Relevant test sources were inspected, not run. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: checklist_evidence: partial. Relevant test sources were inspected, not run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: partial. Relevant test sources were inspected, not run.

### checklist_evidence: PARTIAL. The hook tests cover a malicious allocator under .opencode but omit the same payload under .skilled-untrusted. Test files were inspected, not run. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: checklist_evidence: PARTIAL. The hook tests cover a malicious allocator under .opencode but omit the same payload under .skilled-untrusted. Test files were inspected, not run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: PARTIAL. The hook tests cover a malicious allocator under .opencode but omit the same payload under .skilled-untrusted. Test files were inspected, not run.

### Deferred for later security review: behavior when a project config's .pi parent is a symlink. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Deferred for later security review: behavior when a project config's .pi parent is a symlink.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deferred for later security review: behavior when a project config's .pi parent is a symlink.

### Deferred for the correctness pass: whether every message and push gate rejects ordinal 0000000. The allocator rejects that value, while the presence checks inspect seven digits. The message-contract interaction needs a focused read. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Deferred for the correctness pass: whether every message and push gate rejects ordinal 0000000. The allocator rejects that value, while the presence checks inspect seven digits. The message-contract interaction needs a focused read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deferred for the correctness pass: whether every message and push gate rejects ordinal 0000000. The allocator rejects that value, while the presence checks inspect seven digits. The message-contract interaction needs a focused read.

### feature_catalog_code and playbook_capability: PARTIAL. The target changelog claims about Commit-Id and Pi Fast Mode were compared to code. Other release-note claims were read and local path tokens were scanned, but their behavior was not individually checked against implementation. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: feature_catalog_code and playbook_capability: PARTIAL. The target changelog claims about Commit-Id and Pi Fast Mode were compared to code. Other release-note claims were read and local path tokens were scanned, but their behavior was not individually checked against implementation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code and playbook_capability: PARTIAL. The target changelog claims about Commit-Id and Pi Fast Mode were compared to code. Other release-note claims were read and local path tokens were scanned, but their behavior was not individually checked against implementation.

### feature_catalog_code: partial. The Commit-Id and Pi descriptions were compared with source; unrelated catalog/release-note claims remain unchecked. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: feature_catalog_code: partial. The Commit-Id and Pi descriptions were compared with source; unrelated catalog/release-note claims remain unchecked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code: partial. The Commit-Id and Pi descriptions were compared with source; unrelated catalog/release-note claims remain unchecked.

### Pi Fast Mode claims at .skilled/changelog/skilled/v4.0.0.4.md:425-427 match the inspected code: defaults are enabled, a true --fast flag takes precedence, valid inherited 1/0 values precede persisted state, and requests change only for configured provider/model pairs without an existing service tier. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Pi Fast Mode claims at .skilled/changelog/skilled/v4.0.0.4.md:425-427 match the inspected code: defaults are enabled, a true --fast flag takes precedence, valid inherited 1/0 values precede persisted state, and requests change only for configured provider/model pairs without an existing service tier.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pi Fast Mode claims at .skilled/changelog/skilled/v4.0.0.4.md:425-427 match the inspected code: defaults are enabled, a true --fast flag takes precedence, valid inherited 1/0 values precede persisted state, and requests change only for configured provider/model pairs without an existing service tier.

### Pi Fast Mode: the code defaults to enabled, resolves explicit `--fast` before a valid inherited value and persisted state, persists the effective preference, and only mutates eligible configured targets without an existing service tier [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/config.ts:53] [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:183] [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:93] [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:103]. This matches the scoped changelog claim at line 427. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Pi Fast Mode: the code defaults to enabled, resolves explicit `--fast` before a valid inherited value and persisted state, persists the effective preference, and only mutates eligible configured targets without an existing service tier [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/config.ts:53] [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:183] [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:93] [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:103]. This matches the scoped changelog claim at line 427.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pi Fast Mode: the code defaults to enabled, resolves explicit `--fast` before a valid inherited value and persisted state, persists the effective preference, and only mutates eligible configured targets without an existing service tier [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/config.ts:53] [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:183] [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:93] [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:103]. This matches the scoped changelog claim at line 427.

### playbook_capability: partial. Relevant scoped playbook/test surfaces were inspected; broader release-note capability claims remain unchecked. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: playbook_capability: partial. Relevant scoped playbook/test surfaces were inspected; broader release-note capability claims remain unchecked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: playbook_capability: partial. Relevant scoped playbook/test surfaces were inspected; broader release-note capability claims remain unchecked.

### skill_agent and agent_cross_runtime: PARTIAL. The Codex deep-review agent definition was loaded. Other runtime mirrors were not semantically compared in this security pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: skill_agent and agent_cross_runtime: PARTIAL. The Codex deep-review agent definition was loaded. Other runtime mirrors were not semantically compared in this security pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent and agent_cross_runtime: PARTIAL. The Codex deep-review agent definition was loaded. Other runtime mirrors were not semantically compared in this security pass.

### skill_agent: not applicable to the hook and Pi extension ownership reviewed; the deep-review agent definition was loaded. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: skill_agent: not applicable to the hook and Pi extension ownership reviewed; the deep-review agent definition was loaded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent: not applicable to the hook and Pi extension ownership reviewed; the deep-review agent definition was loaded.

### spec_code: FAIL. The changelog says the allocator fallback does not run repository code at .skilled/changelog/skilled/v4.0.0.4.md:135. The hook can execute a clone-controlled allocator at .skilled/scripts/git-hooks/prepare-commit-msg:110 and :308. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: spec_code: FAIL. The changelog says the allocator fallback does not run repository code at .skilled/changelog/skilled/v4.0.0.4.md:135. The hook can execute a clone-controlled allocator at .skilled/scripts/git-hooks/prepare-commit-msg:110 and :308.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: FAIL. The changelog says the allocator fallback does not run repository code at .skilled/changelog/skilled/v4.0.0.4.md:135. The hook can execute a clone-controlled allocator at .skilled/scripts/git-hooks/prepare-commit-msg:110 and :308.

### spec_code: partial. The changelog's allocator claim is contradicted by the active P0 finding. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: spec_code: partial. The changelog's allocator claim is contradicted by the active P0 finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: partial. The changelog's allocator claim is contradicted by the active P0 finding.

### Tests were not run. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Tests were not run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Tests were not run.

### The full 475-line changelog was read. Semantic checks of claims outside the Commit-Id and Pi Fast Mode features remain deferred to the traceability pass. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The full 475-line changelog was read. Semantic checks of claims outside the Commit-Id and Pi Fast Mode features remain deferred to the traceability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The full 475-line changelog was read. Semantic checks of claims outside the Commit-Id and Pi Fast Mode features remain deferred to the traceability pass.

### The full semantic audit of unrelated changelog claims remains open for the traceability pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The full semantic audit of unrelated changelog claims remains open for the traceability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The full semantic audit of unrelated changelog claims remains open for the traceability pass.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
[Populated during initialization from the continuity ladder and ripgrep recipes, if any prior work exists]

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
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: [from config]
- Convergence threshold: [from config]
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=[from config.sessionId], parentSessionId=[from config.parentSessionId], generation=[from config.generation], lineageMode=[from config.lineageMode]
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Severity threshold: [from config.severityThreshold]
- Review target type: [from config.reviewTargetType]
- Cross-reference checks: core=[from config.crossReference.core], overlay=[from config.crossReference.overlay]
- Started: [timestamp]
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


## ITERATION 3 UPDATE

- Correctness is covered. New finding: R3-P1-001, the commit and push gates accept allocator-reserved value 0000000.
- R2-P0-001 remains active; overall review status therefore remains FAIL.
- Pi default-on, persisted state, explicit --fast precedence, inherited handoff and target-only request mutation were checked and ruled out for correctness defects.
- The zero-ordinal direction previously deferred to correctness is now covered and linked to R3-P1-001.
- Next focus: traceability. Finish semantic verification of the remaining v4.0.0.4 changelog claims against their implementations.
- The leaf did not expose an iteration start clock; durationMs is recorded as 0 to mark timing as unmeasured.

## ITERATION 4 UPDATE

- Traceability added R4-P2-001: the sk-git catalog says repositories without the allocator are left alone, while the hook policy also enrolls by local configuration and recent Commit-Id history.
- R2-P0-001 and R3-P1-001 remain active. The overall review verdict remains FAIL.
- Pi Fast Mode default-on behavior, persisted state, startup flag, and child handoff match the source documentation and playbooks.
- The v4.0.0.4 changelog was read in full. Its Commit-Id fallback statement remains contradicted by R2-P0-001; Pi Fast Mode claims align. Semantic verification of unrelated release-note sections remains deferred and is recorded in iteration 4.
- Cross-reference status: spec_code=partial; checklist_evidence=partial; skill_agent=notApplicable; agent_cross_runtime=notApplicable; feature_catalog_code=partial; playbook_capability=partial.
- Next focus: maintainability.

## ITERATION 5 UPDATE

- Maintainability review found no new finding. Pi Fast Mode module boundaries, saved-state handling, default-on behavior, and --fast / inherited-state precedence align across source, README, and focused test cases.
- R2-P0-001, R3-P1-001, and R4-P2-001 remain active; the overall review verdict remains FAIL because of the active P0.
- The v4.0.0.4 changelog was read in full. Commit-Id and Pi Fast Mode claims were compared with source. Semantic verification of the remaining release-note claims was not completed and remains explicit audit debt.
- Tests were not run. The review reached iteration 5 of 5; no next dimension is available in this run.

