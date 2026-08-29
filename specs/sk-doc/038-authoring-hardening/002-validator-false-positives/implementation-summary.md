---
title: "Implementation Summary: Validator False Positives"
description: "Fenced code is now masked before link scanning at both sites, the sample code three agents had contorted to satisfy the old regex is restored, and a three-way control proves real detection survived."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "validator false positives implementation"
  - "mask fenced code summary"
importance_tier: "high"
contextType: "implementation"
parent: "sk-doc/038-authoring-hardening"
_memory:
  continuity:
    packet_pointer: "sk-doc/038-authoring-hardening/002-validator-false-positives"
    last_updated_at: "2026-08-29T12:40:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped the fenced-code masking and restored the contorted sample code"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs"
    session_dedup:
      fingerprint: "sha256:a733e4b51ae4e65f09df296888b6e60ed9a8e5c12d708fdd1bf55e7e0558b679"
      session_id: "2026-08-29-sk-code-032-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Validator False Positives

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-validator-false-positives |
| **Parent Spec** | `../spec.md` |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Completion** | 100% — the scanner is fixed at its root, the source it damaged is restored, and a three-way control proves detection survived |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A false positive in the playbook validator was fixed where it originated, and the source edits it had already provoked were undone.

1. **Fenced code is masked before link scanning.** `maskFencedCode()` at line 332 of `validate-playbook-package.cjs` replaces each fenced span with spaces of equal length. Equal length is the whole point: stripping the fenced text would have shifted every byte offset after it and made the surviving diagnostics report the wrong line numbers, so the masking removes the content from consideration while leaving the document's geometry exactly as it was.

2. **The masking is applied at both link-scanning sites.** `pathChecks` takes its masked input at line 342 and `extractRootIndexLinks` at line 414; both loops now scan the masked text instead of the raw document. Only the first site had produced a complaint. Fixing both at once is the difference between resolving a defect and waiting for its twin to be reported separately.

3. **The contorted sample code is restored.** Two remediation agents had written `] (` into sample JavaScript so the old regex would stop matching, leaving real code deliberately malformed inside documentation whose purpose is to show real code. A third had hit the same wall with `notion["notion_tool"]({ ... })` across 34 files. Those workarounds are reverted; the samples read as they should.

4. **A second false positive of the same class, in the same file, was repaired with it.** `labelMarker()` at line 188 builds the "Label:" matcher for the required-content checks. Its predecessor allowed a leading list bullet, and that allowance consumed the first asterisk of a `**Prompt**:` pair before failing to match the second — so a scenario that carried every required element was reported as missing it. The helper now tolerates markdown emphasis around a label and is wired into the prompt, command-sequence, expected-signals, evidence, and failure-triage checks at lines 252 through 257.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The signal that this was a validator defect rather than a documentation defect was the shape of the history, not the shape of the error. Three separate agents had met the same `PATH_MISSING` and all three had edited the documents. That is the correct response to a real broken link, and it is exactly the wrong response here, which is what makes this class of defect expensive: the validator's output was indistinguishable from the truth, so competent remediation produced damage. By the time the root cause was examined, the false positive had already cost sample code in one document a deliberate syntax error and had reached 34 more files through a third agent.

Fixing it required resisting the obvious repair. Loosening the `[...](...)` pattern until the code sample stopped matching would have made the complaint go away and would also have stopped genuine broken links from matching — a fix indistinguishable, from the outside, from deleting the check. Masking narrows the scanner's input instead of its judgment: the fenced region is blanked, everything outside it is graded exactly as before, and the check keeps its full strength on the text it is actually meant to read.

Verification was therefore built as three controls rather than one. A single "it validates clean now" result would have been produced just as readily by a disabled check, so a real broken link was planted outside a fence to confirm it still failed, and a broken-looking one was planted inside a fence to confirm it did not. Only the pair of them, together with the clean run, distinguishes a fixed scanner from a silenced one.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the validator, not the documents | Three independent agents had already concluded the documents were wrong, and all three were mistaken. A fourth document-side workaround would have deepened the damage while leaving the cause untouched, and would have taught the next agent to do the same. |
| Mask the fenced span rather than relax the link pattern | Relaxing the pattern would have suppressed genuine broken links along with the false ones, producing a check that looked healthy and detected nothing. Masking removes only the text that should never have been scanned. |
| Preserve byte offsets and line numbers in the mask | Deleting fenced content would shift every subsequent offset, so surviving diagnostics would point at the wrong lines. Replacing with equal-length spaces keeps every reported location exact. |
| Apply the fix at both call sites at once | Both sites ran the same pattern against raw text. Fixing only the one that had complained would have left an identical defect in place, waiting to be rediscovered as a new bug report. |
| Revert the sample-code workarounds in the same phase | A fixed validator with the contortions still in place would have preserved the damage while erasing the evidence of what caused it. The revert is part of the fix, not a follow-up. |
| Verify with three controls, not one | A clean run alone cannot distinguish a working check from a disabled one. The negative control — a real broken link outside a fence — is the only evidence that detection survived. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Masking helper present and length-preserving | PASS — `maskFencedCode()` at line 332 replaces fenced spans with equal-length spaces |
| Applied at both link-scanning sites | PASS — masked input taken at line 342 in `pathChecks` and line 414 in `extractRootIndexLinks` |
| Control one, restored idiomatic sample | PASS — hub playbook with idiomatic sample JavaScript validates with 0 violations |
| Control two, real broken link outside a fence | PASS — still reported as `PATH_MISSING`, so detection survived the fix |
| Control three, broken-looking link inside a fence | PASS — ignored, so the false positive is removed rather than quieted |
| Packet suite | PASS — `node scripts/tests/validate-playbook-package.test.cjs` reports `fixture suite: PASS (33 negative/positive assertions)` and `strict default: rc=1 on seeded violation; --no-strict: rc=0; boundary: rc=2`, exit 0 |
| Label matcher repair | PASS — `labelMarker()` at line 188 tolerates emphasis around a label and is wired into the five required-content checks at lines 252 through 257 |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Only fenced code is masked.** Inline code spans are not, so a bracket-index expression written between single backticks rather than inside a fence would still be read as a link. No instance of that was found, and no speculative handling was added for one.
2. **The 34 files reached by the third agent were not individually re-audited here.** The root cause is fixed and the samples in scope for this phase are restored; a sweep for any remaining workaround left behind in that wider set is not claimed.
3. **The validator changes were uncommitted at the time this summary was written.** Committing them is a separate action outside this phase's documentation scope.
<!-- /ANCHOR:limitations -->
