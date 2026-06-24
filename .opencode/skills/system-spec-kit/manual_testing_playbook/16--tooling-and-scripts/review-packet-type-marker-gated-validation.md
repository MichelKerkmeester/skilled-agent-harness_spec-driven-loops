---
title: "M-011 -- Review packet type marker-gated validation"
description: "Verify the review packet type: the SPECKIT_LEVEL review marker waives plan/tasks/implementation-summary and requires only the lean review record plus review/review-report."
version: 3.8.0.0
---

# M-011 -- Review packet type marker-gated validation

## 1. OVERVIEW

This scenario validates the review packet type in `validate.sh`. A `<!-- SPECKIT_LEVEL: review -->` marker in `spec.md` selects the lean review-record level. That level waives the heavy authored docs (`plan.md`, `tasks.md`, `implementation-summary.md`) and requires only `spec.md` plus a `review/review-report.md`. The marker is the only entry into the review path, so no inferred folder reaches it. The `review.spec.md.tmpl` template seeds a compliant review record, and the 009 packet is the converted reference packet.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the review marker selects the review level, waives plan/tasks/implementation-summary and requires only the lean review record plus its review report.
- Real user request: `Validate the review packet type: a spec.md carrying the SPECKIT_LEVEL review marker should validate clean with only the review record and review/review-report.md present, and should not demand plan.md, tasks.md or implementation-summary.md.`
- Prompt: `Validate the review packet type marker-gated validation against bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict <spec-folder> and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: validate.sh reports the detected level as `review` via the explicit marker, exits 0 under `--strict` with only the review record and review/review-report.md present and never flags missing plan.md, tasks.md or implementation-summary.md.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the marker selects the review level and the heavy docs are waived.

---

## 3. TEST EXECUTION

### Prompt

`Validate the review packet type marker-gated validation against bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict <spec-folder> and report cited pass/fail evidence.`

### Commands

1. Identify a review-record packet whose `spec.md` carries `<!-- SPECKIT_LEVEL: review -->` (the 009 packet is the converted reference, or scaffold one from `templates/manifest/review.spec.md.tmpl`).
2. Confirm the marker and the required files:
   ```bash
   grep -lE '<!-- SPECKIT_LEVEL: *review *-->' <spec-folder>/spec.md
   ls <spec-folder>/review/review-report.md
   ```
3. Validate the packet under strict mode:
   ```bash
   bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict
   ```
4. Check the detected level and exit code in the output.

### Expected

The detected level is `review` (explicit method), validation exits 0 under `--strict` and the run never reports a missing `plan.md`, `tasks.md` or `implementation-summary.md`.

### Evidence

validate.sh output showing the `review` level line and exit code 0, plus the marker grep and the `review/review-report.md` listing.

### Pass / Fail

- **Pass**: review level selected by the marker, heavy docs waived, exit 0 under `--strict`.
- **Fail**: the level falls back to a numbered level, or validation demands plan/tasks/implementation-summary.

### Failure Triage

Inspect the review-marker detection in `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` (the `<!-- SPECKIT_LEVEL: review -->` branch that sets `DETECTED_LEVEL=review`). Confirm the review level maps to the lean `spec + review/review-report` required-file set and that the `review.spec.md.tmpl` template carries the marker.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Validator: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`
- Template: `.opencode/skills/system-spec-kit/templates/manifest/review.spec.md.tmpl`

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: M-011
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/review-packet-type-marker-gated-validation.md`
