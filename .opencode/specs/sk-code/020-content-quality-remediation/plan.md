---
title: "Implementation Plan: sk-code Content-Quality Remediation"
description: "Directly apply content fixes to 20 code-webflow references — 2 security examples reconciled and hardened, 19 generic When-to-Use sections replaced with concrete scenarios — then verify with validate_document, structural re-scan, and strict packet validation."
trigger_phrases:
  - "020 plan sk-code content quality remediation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/020-content-quality-remediation"
    last_updated_at: "2026-07-13T05:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Fixes applied; verifying"
    next_safe_action: "Terminal gates"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-code Content-Quality Remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
Documentation content editing; no runtime/code change. Applied directly by the orchestrator (security correctness needs judgment); the 19 When-to-Use rewrites applied via a targeted script with per-file authored scenarios.
### Overview
Fix the pre-existing content defects the 019 xHigh review flagged as out-of-scope follow-ups: reconcile + harden two security examples, and replace generic When-to-Use with concrete scenarios in ~19 code-webflow references.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
019 structural conformance complete on v4; the two security files + 19 boilerplate files identified by scan.
### Definition of Done
0 generic When-to-Use across the corpus; both security examples internally consistent and safe; validate_document 0 on every edited file; 0 new broken links; validate.sh --strict Errors 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Content-only edits scoped to code-webflow reference bodies. Security fixes are hand-authored for correctness (URL allowlist + SRI; non-sensitive SameSite example + HttpOnly session caveat). When-to-Use rewrites replace one boilerplate line with 2–3 section-derived bullets per file, preserving all other content.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Rewrite the 19 generic When-to-Use sections with concrete scenarios.
2. Reconcile the SameSite-cookie example + add the HttpOnly session caveat.
3. Add the origin allowlist + SRI note to the CDN loader.
4. Verify: validate_document 0 on all edited files, structural re-scan (0 dups / 0 generic), 0 new broken links, validate.sh --strict Errors 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Deterministic checkers only: `validate_document.py --type reference` on every edited file; a corpus scan asserting 0 generic "when implementing or troubleshooting" and 0 intro/Purpose duplicates; a fenced-code-aware broken-link scan on the 2 security files. No runtime tests — documentation only.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
019 (structural conformance) complete on v4. Authority: the create-skill reference template + the security patterns already documented in the same files. No new tooling.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Content-only edits on tracked files; `git revert` of the single packet commit restores prior text. No data migration, no runtime state, no external effect.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `spec.md` — scope and requirements
- `tasks.md` — task-level evidence
- Sibling `019-split-doc-template-alignment` — structural conformance + the xHigh review that surfaced these items
