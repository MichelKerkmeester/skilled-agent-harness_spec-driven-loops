# Deep Review Strategy

Session tracking for the phase 003 review.

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
The playbook root and stale reference commits b4d4e90192..HEAD on branch worktrees/121-playbook-root-refs: the validator's root-file backticked path check and its test, the sk-doc 2.3.9.0 release, the path corrections in 13 root manual-testing-playbook files, six stale reference fixes, and the phase's spec docs.

Dimensions, risk-ordered: correctness, security, traceability, maintainability. Max iterations 5, convergence threshold 0.1, stop policy max-iterations.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Root summary drift that is not a backticked path, unless a fix in scope made it worse.
- Files outside the diff.
- The 002 phase's own changes, except where this phase edits the same lines.

---

## 5. STOP CONDITIONS
- Five iterations (stop policy max-iterations; convergence is telemetry only).

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
- P1 (Required): 0
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading the call graph (call sites, exclusion filter, exit derivation) against the mandated run commands pinned all four dispatch questions with command output rather than inference (iteration 1)
- Existence + subject probes over every rewritten root path plus git-history forensics for the two removals, the parity successor and the CO-013 pairing closed the four dispatch questions with observed output (iteration 2)
- Replaying all seven child goal criteria and all five parent criteria verbatim, then re-executing the 13 package proofs, the six SR proofs and RM-1, closed the traceability dispatch with command output; the only non-green result exposed the parent continuity contradiction (iteration 3)
- Reading the root call site against the scenario call site, re-checking the DAC-002 CWD/binary on disk and scanning the whole diff for credentials, destructive flags and personal paths closed all four security dispatch questions with observed output; the only finding is the Codex MCP snippet's key-slot advisory (iteration 4)
- Running the four release checks plus `frontmatter-version.mjs bump --base b4d4e90192 --check` and the package test closed the version, changelog, comment and printed-count questions with observed output; the only drift is the fixture suite's stale printed count (iteration 5)

---

## 9. WHAT FAILED
- None: no approach was abandoned in iteration 1 or 2

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **core `checklist_evidence` — partial (OBSERVED spot checks).** RR-1 corroborated by the parent call-site grep; SR-1 (`grep -c 'codex/settings.json' codex-tools.md` → 0) and SR-4 (no vitest binary under `system-spec-kit/runtime`, present under `system-skill-advisor/runtime` with the cited test file) pass where sampled. The remaining RR/SR rows were not independently re-executed — D3/D4 material. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **core `checklist_evidence` — partial (OBSERVED spot checks).** RR-1 corroborated by the parent call-site grep; SR-1 (`grep -c 'codex/settings.json' codex-tools.md` → 0) and SR-4 (no vitest binary under `system-spec-kit/runtime`, present under `system-skill-advisor/runtime` with the cited test file) pass where sampled. The remaining RR/SR rows were not independently re-executed — D3/D4 material.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **core `checklist_evidence` — partial (OBSERVED spot checks).** RR-1 corroborated by the parent call-site grep; SR-1 (`grep -c 'codex/settings.json' codex-tools.md` → 0) and SR-4 (no vitest binary under `system-spec-kit/runtime`, present under `system-skill-advisor/runtime` with the cited test file) pass where sampled. The remaining RR/SR rows were not independently re-executed — D3/D4 material.

### **core `checklist_evidence` — partial.** RR-2.01–RR-2.13 and SR-1–SR-6 rows were independently re-executed where cheap: RR-2.07 row count (38), SR-2 file count (14), SR-3 line count (3), SR-6 `ls` count (6), SR-1 grep (0), plus existence/subject probes for every rewritten path. The remaining ledger rows' exact command transcripts were not re-run (their claims are consistent with the diffs). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **core `checklist_evidence` — partial.** RR-2.01–RR-2.13 and SR-1–SR-6 rows were independently re-executed where cheap: RR-2.07 row count (38), SR-2 file count (14), SR-3 line count (3), SR-6 `ls` count (6), SR-1 grep (0), plus existence/subject probes for every rewritten path. The remaining ledger rows' exact command transcripts were not re-run (their claims are consistent with the diffs).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **core `checklist_evidence` — partial.** RR-2.01–RR-2.13 and SR-1–SR-6 rows were independently re-executed where cheap: RR-2.07 row count (38), SR-2 file count (14), SR-3 line count (3), SR-6 `ls` count (6), SR-1 grep (0), plus existence/subject probes for every rewritten path. The remaining ledger rows' exact command transcripts were not re-run (their claims are consistent with the diffs).

### **core `checklist_evidence` — pass (OBSERVED).** Every RR/SR ledger row was traced to a changed file and its proof re-executed where the command is replayable; the one non-replayable counterfactual (RR-1 revert) is derived from the unchanged pre-image, and the ledger's own evidence rows match. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **core `checklist_evidence` — pass (OBSERVED).** Every RR/SR ledger row was traced to a changed file and its proof re-executed where the command is replayable; the one non-replayable counterfactual (RR-1 revert) is derived from the unchanged pre-image, and the ledger's own evidence rows match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **core `checklist_evidence` — pass (OBSERVED).** Every RR/SR ledger row was traced to a changed file and its proof re-executed where the command is replayable; the one non-replayable counterfactual (RR-1 revert) is derived from the unchanged pre-image, and the ledger's own evidence rows match.

### **core `checklist_evidence` — pass (spot).** CHK-030 was re-derived by the credential scan rather than trusted; the remaining RR/SR rows were re-executed in iteration 3 and were not re-run here. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **core `checklist_evidence` — pass (spot).** CHK-030 was re-derived by the credential scan rather than trusted; the remaining RR/SR rows were re-executed in iteration 3 and were not re-run here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **core `checklist_evidence` — pass (spot).** CHK-030 was re-derived by the credential scan rather than trusted; the remaining RR/SR rows were re-executed in iteration 3 and were not re-run here.

### **core `spec_code` — partial (OBSERVED).** Goal criterion 1 ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/goal.md:57]) ran verbatim: `n=1 m=1 r=1` → `ok`. AC-001 ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/acceptance-criteria.md:54]) matches the observed `--strict` output (2 `BACKTICK_PATH_UNRESOLVED` lines: 1 root == 1 RM row, 1 scenario). The full REQ sweep is deferred to D3. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **core `spec_code` — partial (OBSERVED).** Goal criterion 1 ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/goal.md:57]) ran verbatim: `n=1 m=1 r=1` → `ok`. AC-001 ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/acceptance-criteria.md:54]) matches the observed `--strict` output (2 `BACKTICK_PATH_UNRESOLVED` lines: 1 root == 1 RM row, 1 scenario). The full REQ sweep is deferred to D3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **core `spec_code` — partial (OBSERVED).** Goal criterion 1 ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/goal.md:57]) ran verbatim: `n=1 m=1 r=1` → `ok`. AC-001 ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/acceptance-criteria.md:54]) matches the observed `--strict` output (2 `BACKTICK_PATH_UNRESOLVED` lines: 1 root == 1 RM row, 1 scenario). The full REQ sweep is deferred to D3.

### **core `spec_code` — pass (OBSERVED).** All seven child goal criteria ran verbatim and print their claims; parent criteria 1, 3, 4 and 5 pass (57, 3, exit 0, 4 PASSED / 0 FAILED) and criterion 2's pending 2 is explained and filed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **core `spec_code` — pass (OBSERVED).** All seven child goal criteria ran verbatim and print their claims; parent criteria 1, 3, 4 and 5 pass (57, 3, exit 0, 4 PASSED / 0 FAILED) and criterion 2's pending 2 is explained and filed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **core `spec_code` — pass (OBSERVED).** All seven child goal criteria ran verbatim and print their claims; parent criteria 1, 3, 4 and 5 pass (57, 3, exit 0, 4 PASSED / 0 FAILED) and criterion 2's pending 2 is explained and filed.

### **core `spec_code` — pass.** Every security-relevant change traces to a ledger row: the root check to RR-1, the Codex config correction to SR-1; the spec's own security row CHK-030 is checked and holds on the diff. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **core `spec_code` — pass.** Every security-relevant change traces to a ledger row: the root check to RR-1, the Codex config correction to SR-1; the spec's own security row CHK-030 is checked and holds on the diff.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **core `spec_code` — pass.** Every security-relevant change traces to a ledger row: the root check to RR-1, the Codex config correction to SR-1; the spec's own security row CHK-030 is checked and holds on the diff.

### **core `spec_code` — pass.** Goal criterion 1 and AC-001 observed in iteration 1 still hold, and the CO-013 root rewrite now equals its scenario contract (scenario :19/:53 vs root :366-372), which was one of the drift classes the phase set out to remove. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **core `spec_code` — pass.** Goal criterion 1 and AC-001 observed in iteration 1 still hold, and the CO-013 root rewrite now equals its scenario contract (scenario :19/:53 vs root :366-372), which was one of the drift classes the phase set out to remove.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **core `spec_code` — pass.** Goal criterion 1 and AC-001 observed in iteration 1 still hold, and the CO-013 root rewrite now equals its scenario contract (scenario :19/:53 vs root :366-372), which was one of the drift classes the phase set out to remove.

### **overlay `agent_cross_runtime` — partial.** CO-013's alignment with the OpenCode `--agent` contract was checked against SKILL.md; no other cross-runtime contract changed this iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **overlay `agent_cross_runtime` — partial.** CO-013's alignment with the OpenCode `--agent` contract was checked against SKILL.md; no other cross-runtime contract changed this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **overlay `agent_cross_runtime` — partial.** CO-013's alignment with the OpenCode `--agent` contract was checked against SKILL.md; no other cross-runtime contract changed this iteration.

### **overlay `agent_cross_runtime` — partial.** SR-1's `.codex/config.toml` successor form is verified in place; the snippet itself now carries the R4-P2-001 advisory. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **overlay `agent_cross_runtime` — partial.** SR-1's `.codex/config.toml` successor form is verified in place; the snippet itself now carries the R4-P2-001 advisory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **overlay `agent_cross_runtime` — partial.** SR-1's `.codex/config.toml` successor form is verified in place; the snippet itself now carries the R4-P2-001 advisory.

### **overlay `agent_cross_runtime` — partial.** SR-1's `.codex/config.toml` successor form is verified; no other cross-runtime contract changed this iteration. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **overlay `agent_cross_runtime` — partial.** SR-1's `.codex/config.toml` successor form is verified; no other cross-runtime contract changed this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **overlay `agent_cross_runtime` — partial.** SR-1's `.codex/config.toml` successor form is verified; no other cross-runtime contract changed this iteration.

### **overlay `feature_catalog_code` — partial.** The 37 mcp-click-up and 4 mcp-obsidian catalog targets exist; the cupt claim is about an external repository and is unverifiable offline (no finding). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **overlay `feature_catalog_code` — partial.** The 37 mcp-click-up and 4 mcp-obsidian catalog targets exist; the cupt claim is about an external repository and is unverifiable offline (no finding).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **overlay `feature_catalog_code` — partial.** The 37 mcp-click-up and 4 mcp-obsidian catalog targets exist; the cupt claim is about an external repository and is unverifiable offline (no finding).

### **overlay `feature_catalog_code` — pass.** SR-2's 14 catalog files all carry `hooks/pi/sk-vision.ts`; no stale short form remains. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **overlay `feature_catalog_code` — pass.** SR-2's 14 catalog files all carry `hooks/pi/sk-vision.ts`; no stale short form remains.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **overlay `feature_catalog_code` — pass.** SR-2's 14 catalog files all carry `hooks/pi/sk-vision.ts`; no stale short form remains.

### **overlay `playbook_capability` — partial.** All 13 root packages' rewritten references resolve on disk; the two removal rows and the one successor row were verified against git history rather than taken from the ledger. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **overlay `playbook_capability` — partial.** All 13 root packages' rewritten references resolve on disk; the two removal rows and the one successor row were verified against git history rather than taken from the ledger.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **overlay `playbook_capability` — partial.** All 13 root packages' rewritten references resolve on disk; the two removal rows and the one successor row were verified against git history rather than taken from the ledger.

### **overlay `playbook_capability` — pass.** The 13 packages exit 0 with the warning counts their ledger rows claim. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **overlay `playbook_capability` — pass.** The 13 packages exit 0 with the warning counts their ledger rows claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **overlay `playbook_capability` — pass.** The 13 packages exit 0 with the warning counts their ledger rows claim.

### **overlay `skill_agent` — not exercised this iteration** (the sk-doc 2.3.9.0 release surfaces were not part of the four questions; deferred to a later dimension). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **overlay `skill_agent` — not exercised this iteration** (the sk-doc 2.3.9.0 release surfaces were not part of the four questions; deferred to a later dimension).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **overlay `skill_agent` — not exercised this iteration** (the sk-doc 2.3.9.0 release surfaces were not part of the four questions; deferred to a later dimension).

### **overlay `skill_agent` — partial.** Criterion 6 pins the only added changelog to sk-doc v2.3.9.0; the release value/mirror surfaces were audited in iterations 1–2 and were not re-audited here. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **overlay `skill_agent` — partial.** Criterion 6 pins the only added changelog to sk-doc v2.3.9.0; the release value/mirror surfaces were audited in iterations 1–2 and were not re-audited here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **overlay `skill_agent` — partial.** Criterion 6 pins the only added changelog to sk-doc v2.3.9.0; the release value/mirror surfaces were audited in iterations 1–2 and were not re-audited here.

### **overlay protocols** (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`) — pending; not exercised by this correctness iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **overlay protocols** (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`) — pending; not exercised by this correctness iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **overlay protocols** (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`) — pending; not exercised by this correctness iteration.

### `core:checklist_evidence` — not re-executed this iteration; carried by iterations 3-4 (RR/SR rows, CHK-030). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `core:checklist_evidence` — not re-executed this iteration; carried by iterations 3-4 (RR/SR rows, CHK-030).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `core:checklist_evidence` — not re-executed this iteration; carried by iterations 3-4 (RR/SR rows, CHK-030).

### `core:spec_code` — pass (maintainability slice): the version-authority contract in `.skilled/skills/sk-doc/SKILL.md` (mirrored at `.hermes/skills/sk-doc/SKILL.md:22`) holds against observed values. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `core:spec_code` — pass (maintainability slice): the version-authority contract in `.skilled/skills/sk-doc/SKILL.md` (mirrored at `.hermes/skills/sk-doc/SKILL.md:22`) holds against observed values.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `core:spec_code` — pass (maintainability slice): the version-authority contract in `.skilled/skills/sk-doc/SKILL.md` (mirrored at `.hermes/skills/sk-doc/SKILL.md:22`) holds against observed values.

### `overlay:agent_cross_runtime` — pass: `sync-skills-hermes.cjs --check` → `PASS: 68 Hermes skill copies in sync`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `overlay:agent_cross_runtime` — pass: `sync-skills-hermes.cjs --check` → `PASS: 68 Hermes skill copies in sync`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `overlay:agent_cross_runtime` — pass: `sync-skills-hermes.cjs --check` → `PASS: 68 Hermes skill copies in sync`.

### `overlay:skill_agent`, `overlay:feature_catalog_code`, `overlay:playbook_capability` — partial: only the version-raise aspect is in this dimension; their content behaviour was iterations 2-4's scope. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `overlay:skill_agent`, `overlay:feature_catalog_code`, `overlay:playbook_capability` — partial: only the version-raise aspect is in this dimension; their content behaviour was iterations 2-4's scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `overlay:skill_agent`, `overlay:feature_catalog_code`, `overlay:playbook_capability` — partial: only the version-raise aspect is in this dimension; their content behaviour was iterations 2-4's scope.

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
- Advisor parity successor check: hooks/runtime-parity.vitest.ts is the same subject; the cited .skilled legacy path was already absent at the parent and its historical basename was deleted at spec 081 (iteration 2, evidence: git history + file head)
- tool-input-schema.vitest.ts removal: subject was the memory-engine tool schemas, deleted in 3095cadc0f with schemas+utils (1809 deletions); no successor for that subject (iteration 2)
- manual_namespace "(if present)" row removal: manual_namespace.test.js never existed (empty git log); CM-005..CM-007 scenarios survive under manual-namespace-contract/ (iteration 2)
- CO-013 rewrite: matches agent-routing/general-agent-default.md and SKILL.md section 3 --agent note (iteration 2)
- Unledgered edits: every diff hunk maps to RR-2.01..13 / SR-1..6 plus declared version bumps; mcp-click-up row count 38 and doctor yaml count 6 match (iteration 2)
- Successor duplicate opencode runtime entry: outside the diff, observation only (iteration 2)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Phase 002 brought the scenario warnings from 258 to 1 and its review found root files were never backtick-checked. This phase adds that check and fixes the 70 root warnings it finds (1 left as RM-1), plus six stale references 002 listed. The ledger and RM-1 are in specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/003-playbook-root-and-stale-refs/implementation-summary.md. resource-map.md not present; skipping coverage gate.

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
56 files in scope; the full list is reviewScopeFiles in deep-review-config.json.

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-10-12T10:01:23.529Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-10-12T10:01:23.529Z
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
