---
title: "PROCCARD-003 -- md-generator backend-preserving direct fallback"
description: "This scenario validates that md-generator direct fallback keeps its normal backend boundary and dedicated pipeline entrypoints when subagents are unavailable."
version: 1.0.0.0
---

# PROCCARD-003 -- md-generator backend-preserving direct fallback

## 1. OVERVIEW

This scenario validates md-generator `Context, Proof, And Direct Fallback`. Direct fallback must keep the normal `playwright-extract` backend boundary and cannot weaken extract/write/validate requirements.

### Why This Matters

Unlike the four advisory modes, md-generator is the one mutating sk-design mode. Its direct fallback still uses dedicated backend entrypoints and sandboxed outputs when execution is required.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm md-generator direct fallback preserves backend entrypoints, output provenance, and validation proof.
- Real user request: `Subagents are unavailable, but validate this DESIGN.md against tokens.json in the current session.`
- Prompt: `Subagents are unavailable. md-generator: validate this DESIGN.md against tokens.json directly in the current session and show selected procedure or fallback, backend entrypoint, tokens/DESIGN provenance, validation result, unresolved gaps, and output boundary.`
- Expected execution process: Do not dispatch Task; execute directly using the normal md-generator backend boundary; for validation-only, name `validate.ts`; for extraction/write paths, keep extract/write/validate requirements and sandbox output paths.
- Expected signals: Direct execution; backend entrypoint named; `tokens.json`/`DESIGN.md` provenance named; validation result or required validation command named; no read-only fallback language.
- Desired user-visible outcome: A backend-preserving validation response that does not pretend direct fallback is advisory-only.
- Pass/fail: PASS if direct fallback keeps backend boundary and proof; FAIL if it says Read/Glob/Grep-only, skips validation proof, or grants mutating access to other modes.

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PROCCARD-003 | md-generator backend-preserving fallback | Confirm no-subagent path preserves backend boundary | `Subagents are unavailable. md-generator: validate this DESIGN.md against tokens.json directly in the current session and show selected procedure or fallback, backend entrypoint, tokens/DESIGN provenance, validation result, unresolved gaps, and output boundary.` | grep direct fallback in `SKILL.md` -> agent: run prompt -> inspect backend entrypoint and proof | No Task dispatch; `validate.ts` or relevant entrypoint named; provenance and validation proof named; backend boundary preserved | Transcript, response, entrypoint/provenance proof | PASS if backend boundary and validation proof remain intact; FAIL if fallback becomes read-only or proof is skipped | 1. Re-read `Context, Proof, And Direct Fallback`; 2. Re-read `Backend Boundary Preservation`; 3. Confirm output path is sandboxed when execution writes files |

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | Direct fallback and backend boundary |
| `../../backend/scripts/validate.ts` | Validation backend entrypoint |
| `../../backend/scripts/extract.ts` | Extraction backend entrypoint for extraction variants |
| `../../backend/scripts/build-write-prompt.ts` | Write-prompt backend entrypoint for write variants |

---

## 5. SOURCE METADATA

- Group: Procedure Card Contract
- Playbook ID: PROCCARD-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `procedure-card-contract/backend-preserving-direct-fallback.md`
