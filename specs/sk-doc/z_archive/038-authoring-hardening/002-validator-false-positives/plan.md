---
title: "Plan: Validator False Positives"
description: "Mask fenced code at both link-scanning sites while preserving offsets, revert the sample-code workarounds the false positive caused, and prove with a three-way control that real detection survived."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "validator false positives plan"
  - "mask fenced code plan"
importance_tier: "high"
contextType: "plan"
parent: "sk-doc/038-authoring-hardening"
_memory:
  continuity:
    packet_pointer: "sk-doc/038-authoring-hardening/002-validator-false-positives"
    last_updated_at: "2026-08-29T12:40:00Z"
    last_updated_by: "claude"
    recent_action: "Added the masking helper, applied it at both sites, ran the three-way control"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs"
    session_dedup:
      fingerprint: "sha256:7139825380854945cdb56a6985aec0e8b0e341f970ab2f400bf28e8ba19fcfa7"
      session_id: "2026-08-29-sk-code-032-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Validator False Positives

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`validate-playbook-package.cjs` resolves markdown links against the filesystem in two places. `pathChecks` scans each scenario file and `extractRootIndexLinks` scans the root playbook index; both used the same `[...](...)` pattern against raw document text. Markdown link syntax and JavaScript bracket-index call syntax are not distinguishable by that pattern, so `hooks['tool.execute.before']({ ... })` inside a fenced code sample resolved as a link whose target was the call arguments.

### Overview

Blank the fenced spans before scanning, at both sites, using a replacement that preserves length so every offset and line number stays exact. Then revert the source workarounds the false positive provoked, and prove with a three-way control that the fix removes the false positive without removing real detection.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Both link-scanning sites located, and confirmed to share the same pattern against raw text.
- The failure reproduced from a real document rather than a constructed one, so the fix is aimed at the symptom that actually occurred.

### Definition of Done

- Idiomatic sample JavaScript validates with 0 violations; a real broken link outside a fence still fails; a broken-looking link inside a fence is ignored.
- The packet's own suite passes at exit 0, and the reverted sample code is the code a reader would actually write.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Mask, do not relax. The tempting fix is to loosen the link pattern until the code sample stops matching, which would also stop genuine broken links from matching. Masking narrows the scanner's input instead of its judgment: the fenced region is removed from consideration and everything else is graded exactly as before.

### Key Components

- `maskFencedCode(text)`: replaces each fenced span with spaces of equal length, so the text that remains has identical byte offsets and identical line numbering to the original.
- `pathChecks`: the per-scenario link scan, the site where the reported `PATH_MISSING` originated.
- `extractRootIndexLinks`: the root-index link scan, the second site running the same pattern, fixed at the same time rather than when it eventually surfaced.
- `labelMarker(labels)`: the required-content label matcher, whose list-bullet allowance consumed the first asterisk of a `**Label**:` pair and then failed on the second — the same defect class, in the same file.

### Data Flow

Document text → `maskFencedCode` → length-preserving masked text → the unchanged `[...](...)` scan → path resolution → diagnostics carrying line numbers that still point at the original document, because masking never moved them.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Reproduce the false positive from the real document that produced it. Locate both link-scanning sites and confirm they share the raw-text pattern.

### Phase 2: Core Implementation

Add `maskFencedCode` and apply it at `pathChecks` and `extractRootIndexLinks`. Revert the sample-code workarounds to idiomatic JavaScript. Repair the label matcher so markdown emphasis around a label no longer defeats it.

### Phase 3: Verification

Run the three-way control — restored idiomatic sample, real broken link outside a fence, broken-looking link inside a fence — and the packet's own test suite. Read each result rather than the exit code alone.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Controlled, three ways, because a single check cannot distinguish "fixed" from "disabled": a hub playbook with idiomatic sample JavaScript restored must validate clean; a genuinely broken link placed outside a fence must still be caught; a broken-looking link placed inside a fence must be ignored. The first alone would pass equally well if link checking had simply been turned off, which is why the second exists. Alongside them, the packet's own suite `scripts/tests/validate-playbook-package.test.cjs` runs its negative and positive assertions and must reach exit 0.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `validate-playbook-package.cjs` and `scripts/tests/validate-playbook-package.test.cjs`.
- The playbook documents whose sample code was contorted, for the revert.
- No new packages and no network access.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reversible: `git checkout --` on `validate-playbook-package.cjs` restores the prior scanner, and the reverted sample code is itself a restoration rather than a new edit. Rolling back reinstates the false positive, so the rollback would only make sense paired with re-applying the source workarounds it forces — which is the argument for not rolling back.

<!-- /ANCHOR:rollback -->
