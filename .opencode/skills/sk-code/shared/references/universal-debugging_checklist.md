---
title: Universal Debugging Checklist
description: Stack-agnostic 4-phase debugging workflow checklist for any non-trivial debugging session.
trigger_phrases:
  - "universal debugging checklist"
  - "four phase debugging workflow"
  - "hypothesis testing debugging"
  - "stack agnostic debugging"
importance_tier: normal
contextType: implementation
version: 3.5.0.5
---

# Universal Debugging Checklist - Surface-Agnostic 4-Phase Workflow

Surface-agnostic 4-phase debugging workflow. Use as a structured progression for any non-trivial debugging session across the WEBFLOW and OPENCODE surfaces.

## 1. OVERVIEW

### Purpose

Captures the universal debugging protocol that applies regardless of surface: reproduce reliably, identify root cause, test one hypothesis at a time, fix at source. Surface-specific tooling (Chrome DevTools for WEBFLOW, package/script diagnostics for OPENCODE) is referenced from each surface's debugging docs.

### Usage

Walk this checklist top-to-bottom on any debugging session that survives more than two trivial fixes. Mark items `[x]` as you complete them and reference the surface-specific debugging workflow doc when you reach Phase 1's tool-selection step. Stop at the three-strike rule (Section 2.3) when three hypotheses fail.

---

## 2. THE 4-PHASE WORKFLOW

### Phase 1: Root Cause Investigation

- [ ] **Reproduce reliably** — can you trigger the failure on demand? If not, log everything until you can.
- [ ] **Capture exact error output** — full stack trace + exit code + log lines (verbatim, no paraphrase).
- [ ] **Identify the failing surface** — UI / API / build / runtime / external service.
- [ ] **Note last-known-good state** — last successful run, last green commit, last working environment.
- [ ] **Diff what changed** — `git diff <last-good>..HEAD` (code) + dependency lockfile + env vars.

### Phase 2: Pattern Analysis

- [ ] **Search the error string** — issue tracker, community forum, language docs (verbatim error string is search gold).
- [ ] **Identify symptom vs cause** — is the error message the actual problem or downstream of something earlier?
- [ ] **Trace backward from symptom** — symptom → immediate cause → source. Fix at source, not symptom.
- [ ] **Look for similar past issues** — git log grep for keywords, runbook entries, team Slack archive.

### Phase 3: Hypothesis Testing

- [ ] **State your hypothesis** — write it down in one sentence.
- [ ] **Predict the test outcome** — what evidence would confirm? What would refute?
- [ ] **Test ONE thing at a time** — never change multiple variables in one experiment.
- [ ] **Document each test result** — pass/fail with observed evidence.

**Three-strike rule**: if 3+ hypotheses fail, STOP and reconsider. Either the mental model of the system is wrong (re-investigate), the bug is in a layer not yet considered (widen scope), or a fresh pair of eyes is needed (escalate).

### Phase 4: Implementation (the fix)

- [ ] **Fix at root, not at symptom** — symptom-fixes leave latent bugs.
- [ ] **Add a regression test** — codify the bug so it can't recur silently.
- [ ] **Document root cause in the commit message** — future grepping should find it.
- [ ] **Verify the fix runs the original reproduction step** — close the loop.

---

## 3. SURFACE-SPECIFIC DEBUG TOOLING

| Surface | Primary tool | Reference |
|---|---|---|
| WEBFLOW | Chrome DevTools (Console + Network + Performance) | `references/webflow/debugging/debugging_workflows.md` |
| OPENCODE | Targeted tests, package typecheck/build, `verify_alignment_drift.py` | `references/opencode/shared/alignment_verification_automation.md` |
| UNKNOWN | Disambiguation prompt — sk-code does not own Go / React Native / Swift / React/Next.js / generic Node.js | n/a |

---

## 4. UNIVERSAL ANTI-PATTERNS

- [ ] **Avoid**: Changing multiple things at once.
- [ ] **Avoid**: Skipping the reproduction step ("works on my machine" is not a fix).
- [ ] **Avoid**: Fixing the symptom without tracing to root.
- [ ] **Avoid**: Deploying a fix without a regression test.
- [ ] **Avoid**: 4th attempt without questioning your model of the system.
- [ ] **Avoid**: Leaving debug instrumentation (console.log, fmt.Println, print) in the committed fix.

---

## 5. RELATED RESOURCES

- `references/phase_detection.md` — Phase 2 Debugging position in the sk-code lifecycle.
- `references/universal/error_recovery.md` — universal recover-in-place / rollback / escalate decision tree.
- `assets/universal/checklists/verification_checklist.md` — runs after debugging completes, before any "done" claim.
- `references/webflow/debugging/debugging_workflows.md` — WEBFLOW deep-dive (DevTools workflows, network capture, multi-viewport).
- `references/opencode/shared/alignment_verification_automation.md` — OPENCODE alignment diagnostics.
