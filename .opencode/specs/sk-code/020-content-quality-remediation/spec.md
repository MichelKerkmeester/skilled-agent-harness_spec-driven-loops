---
title: "Feature Specification: sk-code Content-Quality Remediation"
description: "Fix the pre-existing content-quality issues in sk-code code-webflow references surfaced by the 019 xHigh verification review — issues outside 019's structural template-alignment scope: a self-contradicting session-cookie security example, a script.src loader that injects an unvalidated URL without an origin allowlist or SRI, and ~19 references whose When-to-Use is generic boilerplate rather than concrete scenarios."
trigger_phrases:
  - "sk-code content quality remediation"
  - "code-webflow security doc fix cookie script src"
  - "when-to-use concrete scenarios sk-code"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/020-content-quality-remediation"
    last_updated_at: "2026-07-13T05:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "20 files remediated; verifying"
    next_safe_action: "Terminal gates + commit"
    blockers: []
    completion_pct: 100
    status: "Complete"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-code Content-Quality Remediation

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-13 |
| **Track** | sk-code |
| **Sibling** | 019-split-doc-template-alignment |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 019 xHigh verification review (3 parallel GPT-5.6-sol-fast lineages) surfaced content-quality defects in the code-webflow references that were explicitly out of 019's structural template-alignment scope, so 019 recorded them as follow-ups. They are real doc bugs the mechanical split did not author but inherited: a security reference presents setting a `session=` cookie via `document.cookie` as GOOD while the same doc correctly calls JavaScript-set session cookies BAD; a third-party loading example sets `script.src` from an arbitrary `url` argument with no origin allowlist or Subresource Integrity; and ~19 references carry a generic "Use this reference when implementing or troubleshooting <title>" When-to-Use rather than concrete usage scenarios.

**Purpose:** resolve these content defects so the sk-code code-webflow references are internally consistent, teach safe patterns, and route by concrete scenarios — without touching structural conformance (which 019 owns and verified).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** content edits to code-webflow reference `.md` files only — (a) reconcile the SameSite-cookie example in `security_patterns/overview_and_checklist.md` to a non-sensitive cookie plus a session-token HttpOnly caveat; (b) add an origin allowlist + SRI note to the CDN loader in `third_party_integrations/best_practices_and_summary.md`; (c) replace the generic When-to-Use in ~19 references with concrete, section-derived scenarios.

**Out of scope:** structural template conformance (019 owns it — frontmatter, OVERVIEW, filenames, sections are already verified); any file under `system-deep-loop/deep-alignment`; the sk-code SKILL.md surfaces; runtime code or scripts; rewriting Purpose text (019 already did).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: The SameSite example illustrates the attribute on a non-sensitive client-set cookie, and an explicit caveat states session tokens must be server-set `Secure; HttpOnly; SameSite=Strict` — removing the good/bad contradiction with the storage section.
- R2: The CDN loader validates the URL against an HTTPS origin allowlist before assigning `script.src`, and documents Subresource Integrity as defense-in-depth.
- R3: Each of the ~19 generic When-to-Use sections is replaced with 2–3 concrete scenarios derived from the file's own content sections; no generic "when implementing or troubleshooting <title>" remains.
- R4: All existing substantive content preserved; `validate_document.py` 0 issues on every edited file; 0 new broken links.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- 0 files across the 163-file corpus contain the generic "when implementing or troubleshooting" When-to-Use.
- The two security examples are internally consistent and teach the safe pattern (allowlist + SRI; HttpOnly session cookies server-side).
- `validate_document.py` 0 issues on all edited files; 0 new broken `.md` links.
- `validate.sh --strict` on this packet: Errors 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Security examples must be correct, not merely different — the loader fix uses `new URL()` parsing + hostname allowlist + HTTPS check; the cookie fix keeps the valid SameSite teaching point on a non-sensitive cookie.
- Depends on 019 (structural conformance, on v4) being complete — this packet edits content only and must not regress structure.
- A concurrent session may touch sk-code; changes are staged file-explicit to avoid cross-session capture.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Operator directed the full Bucket C remediation (both security items + all ~19 When-to-Use). Gate 3 resolved: this packet owns the content remediation.
<!-- /ANCHOR:questions -->
