---
title: Deep Review Strategy
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

# Deep Review Strategy - Session Tracking

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
Review of the 34 non-spec files changed by the purpose-carry work (commits eaba5ab89e 3d237cd97a f0d8c03036 0837fcd5a2 191ce39bad 43bff36f9d e102ba83be f9f96bdc39 e129af3719 fce8b5d81c, paths under specs/ excluded). Target type: files. Spec folder: `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers`.

Operator review focus (every iteration covers it in addition to its dimension): Check alignment of these changes with sk-code standards, sk-doc's create-skill, create-command and create-readme standards, and whether any manual-testing playbook, feature catalog, README or the root README.md needs updating for the purpose-carry feature.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Not a review of the spec documents under specs/; they are cross-reference sources only.
- Not a fix pass: the review target is read-only and no file under review is edited.
- Not a review of unrelated system-spec-kit code the commits did not touch, except as an immediate cross-reference.

---

## 5. STOP CONDITIONS
- stop_policy is max-iterations: convergence is telemetry only and the loop runs to 5 iterations.
- Halt on a cli-deepseek-harness dispatch failure that survives the single redispatch; never fall back to native.
- Pause sentinel `review/.deep-review-pause` stops the loop.

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
- P1 (Required): 3
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Per-commit `git show` over the hop files: isolated the relaunch rule divergence and the Pi/Claude compaction difference that a flat file read would have hidden (iteration 1).
- Reading the final `packet-purpose.ts` instead of only its diffs: confirmed the heading regex, ancestor walk and cap semantics in the shipped code (iteration 1).
- Tracing the new purpose section from the shared reader into `session-prime` and the Pi adapter: showed the section is added after the recovered-payload sanitizer and that only Pi strips C0 controls (iteration 2).
- Reading the sanitizer and wrapper definitions before filing a P1: proved `wrapRecoveredCompactPayload` sanitizes internally, so the apparent `sanitizedPayload` discard is not a bypass (iteration 2).
- Reading the phase-parent template directly: resolved the scaffold-regression question in one read and confirmed the template now writes `### Purpose` (iteration 3).
- Grep across the feature catalog: resolved the iteration 1/2 contradiction and confirmed entries exist for both touched hops but omit the purpose row (iteration 3).
- Comparing `api/index.ts` with both compaction adapters' imports: exposed the API-contract gap `R3-P2-001` without re-entering the swept security directions (iteration 3).
- Final replay against the shipped code: confirmed both P1s are still present, not stale -- the relaunch guidance enumerates fewer heading shapes than `packet-purpose.ts:42-48` accepts, and the Pi adapter still calls `resolvePacketPurpose` on the raw folder without the Claude walk-up (iteration 5).

---

## 9. WHAT FAILED
- One full-range diff over all 34 files: overflowed the output and spilled, so it was replaced with per-commit, per-file ranges (iteration 1).
- Executing the changed vitest suites: out of bounds for this read-only pass (no repo tooling), so test evidence is inspection of the changed assertions only (iteration 1).
- The suggested `hook-state.ts` schema read was skipped: the file is not in the 34-file target, and its consumer-side semantic validator call was verified at `session-prime.ts:163` (iteration 2).
- The playbook search covered the three linked hop scenarios only; the whole playbook was not read, so `R2-P2-002` is scoped to those scenarios and the root README (iteration 2).
- The eleven phase goal files and check scripts were not re-run; they are under `specs/` and outside the code target, so their completion evidence is cross-reference only (iteration 3).
- The terminal replay could not execute the vitest suites or the relaunch suite: the review pass is read-only, so fix verification for `R1-P1-001` and `R1-P1-002` stays with the implementation follow-up (iteration 5).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **D3 problem-line leak into resume or continuity.** Only the two compaction adapters call `formatPacketProblem`; the continuity record stores only `packet_purpose`. Not a finding. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **D3 problem-line leak into resume or continuity.** Only the two compaction adapters call `formatPacketProblem`; the continuity record stores only `packet_purpose`. Not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **D3 problem-line leak into resume or continuity.** Only the two compaction adapters call `formatPacketProblem`; the continuity record stores only `packet_purpose`. Not a finding.

### **Path traversal from `lastSpecFolder` / the compact brief.** Already swept in iteration 1 with containment evidence at `session-prime.ts:236-238` and `session-compact-context.ts:80-83`; not re-entered. -- BLOCKED (iteration 3, 2 attempts)
- What was tried: **Path traversal from `lastSpecFolder` / the compact brief.** Already swept in iteration 1 with containment evidence at `session-prime.ts:236-238` and `session-compact-context.ts:80-83`; not re-entered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Path traversal from `lastSpecFolder` / the compact brief.** Already swept in iteration 1 with containment evidence at `session-prime.ts:236-238` and `session-compact-context.ts:80-83`; not re-entered.

### **Phase-parent scaffold regression.** The template now writes `### Purpose` and `### Problem Statement` and no layout sentence (`phase-parent.spec.md.tmpl:65-69`). New parents do not need the phase 011 backfill. Not a finding. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Phase-parent scaffold regression.** The template now writes `### Purpose` and `### Problem Statement` and no layout sentence (`phase-parent.spec.md.tmpl:65-69`). New parents do not need the phase 011 backfill. Not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Phase-parent scaffold regression.** The template now writes `### Purpose` and `### Problem Statement` and no layout sentence (`phase-parent.spec.md.tmpl:65-69`). New parents do not need the phase 011 backfill. Not a finding.

### **Recovered-payload sanitizer bypass at `session-prime.ts:176-177`.** The wrapper sanitizes internally at `shared-provenance.ts:88` and emits the sanitized value at line 109. The local variable only supplies the log length. Not a finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Recovered-payload sanitizer bypass at `session-prime.ts:176-177`.** The wrapper sanitizes internally at `shared-provenance.ts:88` and emits the sanitized value at line 109. The local variable only supplies the log length. Not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Recovered-payload sanitizer bypass at `session-prime.ts:176-177`.** The wrapper sanitizes internally at `shared-provenance.ts:88` and emits the sanitized value at line 109. The local variable only supplies the log length. Not a finding.

### **Recovered-payload sanitizer bypass.** Already ruled out in iteration 2 (`shared-provenance.ts:88,109`); not re-entered. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Recovered-payload sanitizer bypass.** Already ruled out in iteration 2 (`shared-provenance.ts:88,109`); not re-entered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Recovered-payload sanitizer bypass.** Already ruled out in iteration 2 (`shared-provenance.ts:88,109`); not re-entered.

### **Resume label mismatch.** Both workflow assets and the presentation carry all three labels and the 300-character cut (`speckit-resume-auto.yaml:139`, `speckit-resume-confirm.yaml:158`, `speckit-resume-presentation.txt:118`). Not a finding. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Resume label mismatch.** Both workflow assets and the presentation carry all three labels and the 300-character cut (`speckit-resume-auto.yaml:139`, `speckit-resume-confirm.yaml:158`, `speckit-resume-presentation.txt:118`). Not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Resume label mismatch.** Both workflow assets and the presentation carry all three labels and the 300-character cut (`speckit-resume-auto.yaml:139`, `speckit-resume-confirm.yaml:158`, `speckit-resume-presentation.txt:118`). Not a finding.

### **Secret exposure through `packet_purpose`.** Already ruled out in iteration 2; not re-entered. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Secret exposure through `packet_purpose`.** Already ruled out in iteration 2; not re-entered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Secret exposure through `packet_purpose`.** Already ruled out in iteration 2; not re-entered.

### **Secret exposure through `packet_purpose`.** The field is a one-sentence copy of a repo document, refreshed by the writer, and the reviewed readers do not attach transcript or credential data to it. Not a finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Secret exposure through `packet_purpose`.** The field is a one-sentence copy of a repo document, refreshed by the writer, and the reviewed readers do not attach transcript or credential data to it. Not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Secret exposure through `packet_purpose`.** The field is a one-sentence copy of a repo document, refreshed by the writer, and the reviewed readers do not attach transcript or credential data to it. Not a finding.

### **Shell injection through the purpose or handoff date.** `nudge.cjs` quotes the date it interpolates and the test drives a hostile `created_at` value (`nudge.test.cjs:620`); the purpose text is not interpolated into a shell command. Not a finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Shell injection through the purpose or handoff date.** `nudge.cjs` quotes the date it interpolates and the test drives a hostile `created_at` value (`nudge.test.cjs:620`); the purpose text is not interpolated into a shell command. Not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Shell injection through the purpose or handoff date.** `nudge.cjs` quotes the date it interpolates and the test drives a hostile `created_at` value (`nudge.test.cjs:620`); the purpose text is not interpolated into a shell command. Not a finding.

### **Shell injection through the purpose or handoff date.** Already ruled out in iteration 2 (`nudge.cjs:330`, `nudge.test.cjs:620`); not re-entered. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Shell injection through the purpose or handoff date.** Already ruled out in iteration 2 (`nudge.cjs:330`, `nudge.test.cjs:620`); not re-entered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Shell injection through the purpose or handoff date.** Already ruled out in iteration 2 (`nudge.cjs:330`, `nudge.test.cjs:620`); not re-entered.

### **State transition / stale continuity purpose.** Already ruled out in iteration 1 (`workflow.ts:614-615`, `thin-continuity-record.ts:759-767`); not re-entered. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **State transition / stale continuity purpose.** Already ruled out in iteration 1 (`workflow.ts:614-615`, `thin-continuity-record.ts:759-767`); not re-entered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **State transition / stale continuity purpose.** Already ruled out in iteration 1 (`workflow.ts:614-615`, `thin-continuity-record.ts:759-767`); not re-entered.

### **State transition / stale continuity purpose.** Already swept in iteration 1 (`workflow.ts:614-615`, `thin-continuity-record.ts:759-767`); not re-entered. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **State transition / stale continuity purpose.** Already swept in iteration 1 (`workflow.ts:614-615`, `thin-continuity-record.ts:759-767`); not re-entered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **State transition / stale continuity purpose.** Already swept in iteration 1 (`workflow.ts:614-615`, `thin-continuity-record.ts:759-767`); not re-entered.

### `sk-doc` create-readme frontmatter/structure regression: frontmatter is untouched in the range and the added content follows the existing tables. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `sk-doc` create-readme frontmatter/structure regression: frontmatter is untouched in the range and the added content follows the existing tables.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `sk-doc` create-readme frontmatter/structure regression: frontmatter is untouched in the range and the added content follows the existing tables.

### A duplicate API-boundary finding: already active as `R3-P2-001`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A duplicate API-boundary finding: already active as `R3-P2-001`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A duplicate API-boundary finding: already active as `R3-P2-001`.

### A duplicate feature-catalog/playbook/root README finding: already active as `R2-P2-002`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A duplicate feature-catalog/playbook/root README finding: already active as `R2-P2-002`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A duplicate feature-catalog/playbook/root README finding: already active as `R2-P2-002`.

### A new feature-catalog/playbook/root README finding: duplicate of active `R2-P2-002`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A new feature-catalog/playbook/root README finding: duplicate of active `R2-P2-002`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new feature-catalog/playbook/root README finding: duplicate of active `R2-P2-002`.

### A new test-structure P1: the missing wider-shape assertion is evidence inside `R1-P1-001`, and execution is out of bounds for this pass. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A new test-structure P1: the missing wider-shape assertion is evidence inside `R1-P1-001`, and execution is out of bounds for this pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new test-structure P1: the missing wider-shape assertion is evidence inside `R1-P1-001`, and execution is out of bounds for this pass.

### API-boundary duplication: already active as `R3-P2-001`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: API-boundary duplication: already active as `R3-P2-001`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: API-boundary duplication: already active as `R3-P2-001`.

### Command-label parity: swept in iteration 3. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Command-label parity: swept in iteration 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Command-label parity: swept in iteration 3.

### Continuity save keeping a stale purpose or failing when none is authored: the writer recomputes on every plan, validation drops bad values, and the save test covers copy/removal. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Continuity save keeping a stale purpose or failing when none is authored: the writer recomputes on every plan, validation drops bad values, and the save test covers copy/removal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Continuity save keeping a stale purpose or failing when none is authored: the writer recomputes on every plan, validation drops bad values, and the save test covers copy/removal.

### Multi-line `goal.md` Objective: the live phase goals state `**Objective:**` on one line (`006-.../goal.md:39`, `011-.../goal.md:39`), so the single-line reader at `packet-purpose.ts:101` matches the current shapes. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Multi-line `goal.md` Objective: the live phase goals state `**Objective:**` on one line (`006-.../goal.md:39`, `011-.../goal.md:39`), so the single-line reader at `packet-purpose.ts:101` matches the current shapes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Multi-line `goal.md` Objective: the live phase goals state `**Objective:**` on one line (`006-.../goal.md:39`, `011-.../goal.md:39`), so the single-line reader at `packet-purpose.ts:101` matches the current shapes.

### Path traversal from `lastSpecFolder` or the compact brief: both hooks check containment before the read (`session-prime.ts:236-238`, `session-compact-context.ts:80-83`); the residual symlink case is not in reach. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Path traversal from `lastSpecFolder` or the compact brief: both hooks check containment before the read (`session-prime.ts:236-238`, `session-compact-context.ts:80-83`); the residual symlink case is not in reach.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Path traversal from `lastSpecFolder` or the compact brief: both hooks check containment before the read (`session-prime.ts:236-238`, `session-compact-context.ts:80-83`); the residual symlink case is not in reach.

### Path traversal, recovered-payload sanitizer bypass, shell injection, secret exposure and state transition: exhausted directions from iterations 1-3. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Path traversal, recovered-payload sanitizer bypass, shell injection, secret exposure and state transition: exhausted directions from iterations 1-3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Path traversal, recovered-payload sanitizer bypass, shell injection, secret exposure and state transition: exhausted directions from iterations 1-3.

### Path traversal, recovered-payload sanitizer bypass, shell injection, secret exposure and state transition: exhausted in iterations 1-3; not re-entered. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Path traversal, recovered-payload sanitizer bypass, shell injection, secret exposure and state transition: exhausted in iterations 1-3; not re-entered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Path traversal, recovered-payload sanitizer bypass, shell injection, secret exposure and state transition: exhausted in iterations 1-3; not re-entered.

### Phase-parent scaffold regression: the template writes `### Purpose` and `### Problem Statement`; swept in iteration 3. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Phase-parent scaffold regression: the template writes `### Purpose` and `### Problem Statement`; swept in iteration 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase-parent scaffold regression: the template writes `### Purpose` and `### Problem Statement`; swept in iteration 3.

### Surrogate-pair purpose cut: already active as `R1-P2-001`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Surrogate-pair purpose cut: already active as `R1-P2-001`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Surrogate-pair purpose cut: already active as `R1-P2-001`.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Path traversal from the state or transcript folder: both compaction hooks refuse a resolved folder outside the project root before reading `spec.md` (iteration 1, evidence: `session-prime.ts:236-238`, `session-compact-context.ts:80-83`). Residual symlink note stays in the iteration narrative.
- Continuity save keeping a stale `packet_purpose` or failing when none is authored: the writer recomputes on every plan (`workflow.ts:614-615`), validation drops non-string or oversized values (`thin-continuity-record.ts:759-767`), and the save test covers copy and removal (`save-continuity-write.vitest.ts:323-334`).
- Multi-line `goal.md` Objective: the live phase goals state `**Objective:**` on one line, so the single-line reader matches the current shapes (iteration 1).
- Recovered-payload sanitizer bypass at `session-prime.ts:176-177`: `wrapRecoveredCompactPayload` calls `sanitizeRecoveredPayload` internally (`shared-provenance.ts:88`) and emits that value (`shared-provenance.ts:109`); the local variable only feeds the log length (iteration 2).
- Shell injection through the purpose text or handoff date: `nudge.cjs` shell-quotes the date and a hostile `created_at` test covers it (`nudge.test.cjs:620`); the purpose is not interpolated into a shell command (iteration 2).
- Secret exposure through `packet_purpose`: the field is a one-sentence copy of a repo document and the reviewed path attaches no transcript or credential data (iteration 2).
- Phase-parent scaffold regression: the template now writes `### Purpose` and `### Problem Statement` and no layout sentence (`templates/packet-types/phase-parent.spec.md.tmpl:65-69`), so new parents do not recreate the phase 011 backfill (iteration 3).
- Resume label mismatch: both workflow assets and the presentation carry all three labels and the 300-character cut (`speckit-resume-auto.yaml:139`, `speckit-resume-confirm.yaml:158`, `speckit-resume-presentation.txt:118`) (iteration 3).
- D3 problem-line leak into resume or continuity: only the two compaction adapters call `formatPacketProblem`; the continuity record stores only `packet_purpose` (iteration 3).
- Module-doc drift beyond `.skilled/skills/system-spec-kit/runtime/lib/README.md:118`: `MODULE-MAP.md`, `lib/spec/README.md`, the continuity README and both hook READMEs name the new reader, formatter and field, so no sibling doc gap was found (iteration 4).
- Re-verification is not a fix: `R1-P1-001` and `R1-P1-002` remain active at iteration 5; `R3-P2-001` and `R4-P2-001` were re-confirmed in the final files, and the other three P2s are unchanged (iteration 5).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none; the loop is complete at 5/5 max-iterations. - Focus area: synthesis and the reducer; no further review iteration. - Reason: `stopPolicy=max-iterations`, and the two P1s need an implementation phase rather than more review. - Rotation status: complete. - Blocked/productive carry-forward: `R1-P1-001` and `R1-P1-002` (fix before release), plus the five P2s. - Required evidence: after the parity fix, rerun `packet-purpose`, `hook-precompact`, `hook-session-start` and `history-locator-adapters`, and exercise the relaunch and Pi compaction hops; update the playbook/root README under `R2-P2-002` when that lands. - Recovery note: terminal iteration; the synthesis record should carry `stopReason: maxIterationsReached`.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Continuity ladder: no handover.md. implementation-summary.md continuity (2026-11-13) records the research synthesis; spec.md Problem Statement records that phases 001 to 005 built the purpose carry on four hops (resume, relaunch, compaction, continuity save), an independent review found it partly aligned, and phases 006 to 010 answered that review (purpose rule parity across hops, readers without a `### Purpose` subheading, repo-relative compaction folders, problem-sentence carry, empty-parent purpose backfill). spec.md lists deferred item A: Devin and OpenCode get no purpose after a compaction. resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: the 34 scope files in section 15; phase children 001-011 under the spec folder.
- Behavior claims: spec.md Purpose and each phase child spec.md / implementation-summary.md.
- Reuse and conventions: sk-code standards; sk-doc create-skill, create-command and create-readme standards.
- Review risks and gaps: resource-map.md absent; feature catalogs, manual-testing playbooks and root README.md were not in the commits and must be checked for needed updates.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 1 | D1/D4 hop parity fails on the relaunch guidance (P1-001) and the Pi compaction (P1-002); D2 reader coverage and D3 problem-on-compaction verified. |
| `checklist_evidence` | core | partial | 1 | Changed assertions inspected, not run (read-only boundary); `nudge.test.cjs:109` does not assert the wider heading shapes. |
| `skill_agent` | overlay | notApplicable | 1 | No skill definition or canonical agent file is in the 34-file target. |
| `agent_cross_runtime` | overlay | fail | 1 | Claude compaction walks up to the nearest `spec.md`; the Pi compaction calls the shared reader on the raw folder (P1-002). |
| `feature_catalog_code` | overlay | pass | 1 | No catalog entry describes the touched hooks; local READMEs and MODULE-MAP moved with the code; no stale entry found. |
| `playbook_capability` | overlay | notApplicable | 1 | Scoped search found no manual-testing playbook naming the touched hooks. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/commands/speckit/assets/speckit-resume-auto.yaml | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/speckit/assets/speckit-resume-confirm.yaml | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/speckit/assets/speckit-resume-presentation.txt | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/speckit/handoff.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/lib/nudge.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/nudge.test.cjs | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/api/index.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/README.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/hooks/pi/README.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/README.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/lib/MODULE-MAP.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/lib/README.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/lib/spec/README.md | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/tests/authored-continuity-snapshot.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/tests/packet-purpose.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/tests/thin-continuity-record.vitest.ts | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl | none | - | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/templates/spec-kit-docs.json | none | - | 0 P0, 0 P1, 0 P2 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Stop policy: max-iterations
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-14T11:01:50.956Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Executor: cli-deepseek-harness, model deepseek-v4.1-flash-1017, reasoningEffort max, single lineage
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-14T11:01:50.956Z
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
