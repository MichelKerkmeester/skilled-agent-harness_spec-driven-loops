---
title: "Dispatch Validation, Evidence, and Corpus Baseline"
description: "Separate pure matcher evidence from registered Pi tool_call evidence, repair overstated claims, and establish an honest full-corpus Vitest baseline with a bounded deferral."
trigger_phrases:
  - "dispatch validation evidence"
  - "Pi tool_call coverage"
  - "full corpus Vitest baseline"
  - "test evidence reconciliation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/007-dispatch-validation-evidence"
    last_updated_at: "2026-08-04T18:45:00Z"
    last_updated_by: "pi-planning-agent"
    recent_action: "Authored evidence taxonomy and corpus baseline contract"
    next_safe_action: "Capture focused and full-corpus baselines before changing claims"
    blockers:
      - "The historical full-corpus failure count must be reconciled with the current package-root run"
    key_files:
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts"
      - ".opencode/hooks/dispatch/lib/dispatch-audit.test.mjs"
      - ".opencode/skills/system-skill-advisor/mcp-server/vitest.config.ts"
      - "../002-governor-parity/implementation-summary.md"
      - "../006-dispatch-authorization-hardening/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:1140663ed6ebd48949c8f30559d2412da60c798db0e0f896b563771c60e688b8"
      session_id: "2026-08-04-cli-038-007-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which current full-corpus failures are in scope after the package-root baseline is captured?"
      - "Should the final factory matrix remain in the dispatch test file or use a dedicated harness?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Dispatch Validation, Evidence, and Corpus Baseline

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-04 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 7 of 9 |
| **Predecessor** | 006-dispatch-authorization-hardening |
| **Successor** | 008-phase-state-reconciliation |
| **Handoff Criteria** | Four evidence classes are separated, unsupported claims are corrected or backed by tests, focused gates pass, and the full-corpus baseline has an exact failure ledger, owner, and revisit trigger. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The packet currently mixes pure predicate assertions, shared matcher tests, registered Pi behavior, and live startup into one evidence story. The current Pi test file is a pure helper matrix; it does not by itself prove that the default extension factory registered a `tool_call` handler or returned a block. Earlier summaries also overstate automated byte parity and transform-order coverage, while the review reported a 21-file full-corpus Vitest failure without a durable command, commit, count, or failure ledger.

### Purpose
Make every retained validation claim traceable to the exact test boundary and command that produced it, add the missing registered-Pi evidence where needed, and record unrelated full-corpus failures as an owned, bounded deferral rather than treating them as silently acceptable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A four-class evidence ledger: pure helper, shared dispatch core, registered Pi `tool_call`, and live Pi startup.
- Factory-level tests that observe callback registration and block/allow return values for self-dispatch, executor mismatch, injected text, negation, quoting, variables, aliases, and native subagent tools.
- Audits of phases 001-006 for unsupported claims, stale counts, missing commands, and evidence rows placed in the wrong artifact.
- A package-root full-corpus Vitest baseline that records command, commit, environment facts, test-file/test counts, failure names, owner, and revisit trigger.
- Correction of byte-parity, transform-order, and helper-as-tool-call wording without weakening focused gates.

### Out of Scope
- Enforcement logic or tokenizer design; Phase 006 owns the code seam.
- Packet status and generated metadata reconciliation; Phase 008 owns state artifacts.
- Governor/injection-contract wording; Phase 009 owns the durable contract.
- Repairing unrelated advisor-corpus failures unless the baseline proves they are caused by the enforcement change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Modify | Add or verify factory-level input/tool_call cases and label them separately from helper cases. |
| `.opencode/hooks/dispatch/lib/dispatch-audit.test.mjs` | Modify | Add shared-core evidence for direct, prose, quoted, separator, and ambiguous forms. |
| `001-research/implementation-summary.md` through `006-dispatch-authorization-hardening/implementation-summary.md` | Modify | Correct historical evidence language without changing each phase's scope. |
| `007-dispatch-validation-evidence/evidence/full-corpus-baseline.md` | Create | Record the exact corpus command, counts, failure ledger, owner, and revisit trigger. |
| `007-dispatch-validation-evidence/checklist.md` | Modify | Pin completion rows to observed command output and the baseline artifact. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pure helper, shared-core, registered Pi `tool_call`, and live startup evidence must be reported as distinct classes. | The evidence ledger and summaries name the class beside each result; no pure predicate result is described as Pi tool-call coverage. |
| REQ-002 | P0 self-dispatch and executor-mismatch outcomes must be observed through the registered Pi factory as well as through pure helpers. | A test registers the default factory, supplies an input turn, invokes `tool_call`, and asserts block results for `cli-pi` self-dispatch and a mismatched executor. |
| REQ-003 | Every completion claim retained in the packet must have an exact objective command or an explicit open implementation requirement. | A claim-to-command table points to a real test name or shell command; unsupported claims are rewritten rather than inferred from a neighboring helper test. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Automated byte parity is claimed only when a named assertion compares bytes; otherwise the claim is narrowed to semantic parity or manual comparison. | The parity row names the compared outputs and command, and no summary calls containment or manual review byte equality. |
| REQ-005 | Transform-order coverage is backed by a test that runs both relevant extension registration orders. | Advisor-first and guard-first harnesses both prove injected `cli-*` text cannot authorize a dispatch and a matching user-authored override still can. |
| REQ-006 | The historical 21-file full-corpus failure has a reproducible current baseline and bounded deferral. | `evidence/full-corpus-baseline.md` records exact package-root command, commit, counts, failure list, owner, and revisit trigger; a changed count is recorded as a new observation, not substituted silently. |
| REQ-007 | Focused dispatch gates remain independent of the full-corpus deferral. | Dispatch-core, Pi factory, and headless-startup commands exit 0 before handoff; full-corpus failures appear separately and are not called green. |
| REQ-008 | Evidence rows are placed in the correct artifact and use observed output. | `checklist.md`, `tasks.md`, and implementation summaries link to command output or the baseline artifact; no row relies only on a reviewer assertion or a planned test. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the same self-dispatch and mismatch inputs, **when** a pure helper and registered Pi factory both evaluate them, **then** the report shows separate evidence classes and treats the factory result as runtime evidence.
- **SC-002**: **Given** advisor/directive text is injected, **when** advisor-first and guard-first registration orders run, **then** both deny injected-only authorization and allow only a matching raw user override.
- **SC-003**: **Given** a parity claim, **when** its named test command is inspected, **then** byte parity appears only with a byte comparison and semantic/manual wording is used otherwise.
- **SC-004**: **Given** the historical 21-file failure, **when** the canonical package-root Vitest command runs, **then** the exact current count and failure ledger are recorded with an owner and revisit trigger.
- **SC-005**: **Given** focused dispatch tests pass while unrelated full-corpus failures remain, **when** the phase hands off, **then** the packet states the deferral and does not call the whole corpus green.
- **SC-006**: **Given** a completion checklist row, **when** its evidence is reviewed, **then** it links to final-state command output rather than a plan or reviewer statement.

**Objective verification commands:**

```bash
npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot
npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot
(cd .opencode/skills/system-skill-advisor/mcp-server && npx vitest run --reporter=dot)
command -v pi && pi --offline --approve -p "list available tools; do not modify files" </dev/null
rg -n "byte[- ]equal|byte parity|transform.order|tool_call|pure helper|full corpus|21 files|21-file" .opencode/specs/hooks/007-fable-governor-pi-hook --glob '*.md'
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/hooks/007-fable-governor-pi-hook/007-dispatch-validation-evidence --strict
```
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A pure helper suite can pass while the registered Pi handler is broken. | High | Make factory registration and callback invocation a P0 gate and report helper counts separately. |
| Risk | Full-corpus counts vary with root, fixtures, generated data, and environment. | High | Run from the package root with its committed Vitest config, capture environment facts, and store the complete failure ledger. |
| Risk | The historical 21-file count may not reproduce. | Medium | Preserve the historical observation as provenance and record the current result independently with a reasoned reconciliation. |
| Dependency | Phase 006 factory and classifier tests | High | Block handoff until named tests exist and their output is captured. |
| Dependency | Advisor package dependencies and local fixtures | Medium | Do not install or regenerate dependencies during planning; record missing prerequisites as baseline facts. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Focused evidence commands run without external CLI dispatch or network calls.
- **NFR-P02**: The full-corpus baseline records duration and does not hide timeout, skip, or collection behavior.

### Security
- **NFR-S01**: Fixtures contain no provider keys, real prompts, or secrets.
- **NFR-S02**: Negative-control evidence commands do not execute a child CLI dispatch.

### Reliability
- **NFR-R01**: A recorded baseline is immutable; later runs append a dated observation rather than overwrite the prior ledger.
- **NFR-R02**: Deferral language names a responsible maintenance surface and a concrete revisit trigger.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A focused command may collect files outside the advisor package; record the actual Vitest root and use the package-root config for corpus evidence.
- A helper test may pass in isolation while the complete factory composition fails; factory evidence must invoke registered callbacks.
- A historical 21-file failure may become 0, 19, or another count; never overwrite the historical observation.

### Error Scenarios
- Missing fixture, generated module, dependency, or environment variable is recorded by exact error and owner.
- Exit 0 with skipped or conditionally bypassed tests is not called full coverage; record skip counts.
- A planned test is absent; correct the claim immediately rather than infer coverage from a nearby test.

### State Transitions
- Baseline pending: phase stays Draft and no corpus deferral is accepted.
- Focused gates green, corpus red: phase can hand off only with an explicit baseline artifact and owner.
- All scoped evidence green: phase can move to Review; final status reconciliation remains Phase 008 work.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Four evidence classes, historical summaries, tests, and one corpus ledger. |
| Risk | 21/25 | False completion claims can mask an untested P0 enforcement boundary. |
| Research | 14/20 | The review count must be reconciled with the current package-root run. |
| **Total** | **53/70** | Level 2; verification-heavy remediation with a bounded deferral. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which full-corpus failures are caused by this packet rather than advisor drift or environment state?
- Should the factory harness import the canonical extension through the `.pi/extensions` mirror or use an explicit path fixture while preserving relative-import behavior?
- Which historical claims need only wording correction, and which missing test is small enough to add without expanding Phase 006's enforcement seam?
<!-- /ANCHOR:questions -->

---

## REMEDIATION TRACEABILITY

| Finding | Requirement(s) | Acceptance scenario(s) | Task(s) | Rollback boundary | Objective verification |
|---------|----------------|------------------------|---------|-------------------|------------------------|
| P2 pure helper vs actual Pi tool_call coverage | REQ-001, REQ-002, REQ-003, REQ-007, REQ-008 | SC-001, SC-002, SC-006 | T002-T005, T007 | Revert only new fixtures and evidence rows; never relabel the pure matrix as runtime evidence. | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` |
| P2 overstated byte parity and transform-order claims | REQ-003, REQ-004, REQ-005, REQ-008 | SC-002, SC-003, SC-006 | T005, T006 | Revert wording changes independently of enforcement tests; retain only claims backed by named assertions. | `rg -n "byte[- ]equal|byte parity|transform.order|tool_call|pure helper" .opencode/specs/hooks/007-fable-governor-pi-hook --glob '*.md'` |
| P2 21-file full-corpus failure | REQ-006, REQ-007 | SC-004, SC-005 | T001, T006, T007 | Remove the baseline artifact only if its command/commit is wrong; preserve the historical failure and defer unrelated maintenance. | `(cd .opencode/skills/system-skill-advisor/mcp-server && npx vitest run --reporter=dot)` |

## RELATED DOCUMENTS

- Parent packet: [../spec.md](../spec.md)
- Enforcement phase: [../006-dispatch-authorization-hardening/spec.md](../006-dispatch-authorization-hardening/spec.md)
- State phase: [../008-phase-state-reconciliation/spec.md](../008-phase-state-reconciliation/spec.md)
- Contract phase: [../009-injection-contract-directive-sync/spec.md](../009-injection-contract-directive-sync/spec.md)
