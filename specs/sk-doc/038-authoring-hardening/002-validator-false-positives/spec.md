---
title: "Spec: Validator False Positives"
description: "The playbook validator scanned raw markdown for links without excluding fenced code, so ordinary bracket-index call syntax in a code sample was reported as a missing path, and three remediation agents contorted correct source to satisfy the regex before the root cause was fixed."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "validator false positives"
  - "playbook validator fenced code link scan"
  - "mask fenced code path missing"
  - "false positive contorted source"
importance_tier: "high"
contextType: "spec"
parent: "sk-doc/038-authoring-hardening"
_memory:
  continuity:
    packet_pointer: "sk-doc/038-authoring-hardening/002-validator-false-positives"
    last_updated_at: "2026-08-29T12:40:00Z"
    last_updated_by: "claude"
    recent_action: "Masked fenced code at both link-scanning sites and reverted the source workarounds"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs"
    session_dedup:
      fingerprint: "sha256:7c1c54a13afbca2efefb8dbd5472949aebe6bb99b2a4e31b661eff0d4a956524"
      session_id: "2026-08-29-sk-code-032-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Validator False Positives

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-validator-false-positives |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-doc/038-authoring-hardening` |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Predecessor** | `001-template-conformance-gaps` |
| **Successor** | `003-per-root-enforcement` |
| **Priority** | P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`validate-playbook-package.cjs` scanned raw markdown for `[...](...)` and resolved every match as a path. Nothing excluded fenced code blocks, so bracket-index call syntax inside a code sample was indistinguishable from a markdown link: `hooks['tool.execute.before']({ ... })` parsed as a label followed by a target, and the call arguments were reported as an unresolvable `PATH_MISSING`.

A false positive of this kind is more expensive than a missed defect, because it does not merely fail to find damage — it causes damage. The violation looked exactly like a real broken link, so remediation agents fixed it the way a real broken link is fixed: by editing the source. Two separate agents worked around it by inserting a space into sample JavaScript, writing `] (` so the regex would stop matching, which left real code in the documentation deliberately malformed in order to satisfy a scanner. A third hit the same wall with `notion["notion_tool"]({ ... })` across 34 files. Three independent agents each concluded the documents were wrong, and none of them concluded the validator was, because the validator's output was indistinguishable from the truth.

The purpose of this phase is to fix the scanner rather than the documents it misjudged, and then to undo the contortions it caused, so that sample code in a playbook is written the way the code is actually written.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: the two link-scanning sites in `validate-playbook-package.cjs` (`pathChecks` and `extractRootIndexLinks`) and the masking helper they share; reverting the sample-code workarounds that were introduced to satisfy the old regex; and a control set proving the fix removes the false positive without weakening real detection. A second false positive of the same class, found in the same file's required-content checks, is in scope as well: a list-bullet allowance in the label matcher consumed the first asterisk of a `**Label**:` pair and then failed to match the second, so a document carrying every required element was reported as missing it.

Out of scope: what the operator-scenario contract requires of a scenario, which is unchanged by this phase; the enforcement gate and the fail-closed root set, which belong to `003-per-root-enforcement`; and remediating the backlog inside packages still held at warn tier.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P1]** Link scanning ignores content inside fenced code blocks, so bracket-index call syntax in a code sample is never reported as a path.
- **REQ-002 [P1]** The masking preserves byte offsets and line numbers, so every reported line number in the surviving diagnostics stays exact.
- **REQ-003 [P1]** The fix is applied at both link-scanning sites, `pathChecks` and `extractRootIndexLinks`, rather than at whichever one surfaced the complaint.
- **REQ-004 [P1]** A genuinely broken link outside a fence is still reported as `PATH_MISSING`. Removing a false positive must not remove the detection it was imitating.
- **REQ-005 [P1]** The sample-code workarounds are reverted, so the documentation shows idiomatic JavaScript rather than code bent around a regex.
- **REQ-006 [P2]** The label matcher tolerates markdown emphasis around a label, so `**Prompt**:` and `*Evidence*:` satisfy the same requirement as a bare `Prompt:`.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** A hub playbook with idiomatic sample JavaScript restored validates with 0 violations.
- **SC-002** A genuinely broken link placed outside a fence is still caught as `PATH_MISSING`, proving detection survived the fix.
- **SC-003** A broken-looking link placed inside a fence is ignored, proving the false positive is gone rather than merely quieter.
- **SC-004** The packet's own suite, `scripts/tests/validate-playbook-package.test.cjs`, passes 33 negative and positive assertions at exit 0.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Silencing real detection along with the false positive.** The obvious fix — loosening the link regex — would have suppressed genuine broken links too. Mitigated by masking the fenced span rather than relaxing the pattern, and by a control that plants a real broken link outside a fence and confirms it still fails.
- **Shifting reported line numbers.** Stripping fenced spans outright would move every subsequent offset and misreport the location of surviving diagnostics. Mitigated by replacing fenced content with spaces of equal length, so offsets and line numbers are unchanged.
- **Fixing one call site and leaving the other.** The same regex ran in two places. Mitigated by applying the masking at both `pathChecks` and `extractRootIndexLinks`.
- **Leaving the contorted source in place.** A fixed validator with the workarounds still in the documents would preserve the damage while removing the evidence of its cause. Mitigated by reverting the sample code as part of this phase.
- **Dependencies.** `validate-playbook-package.cjs` and its test suite. No new packages and no network access.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The three-way control settles the only question that mattered — whether the fix removes the false positive without removing real detection — by testing both outcomes rather than one.

<!-- /ANCHOR:questions -->
