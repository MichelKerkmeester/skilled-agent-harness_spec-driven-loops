---
title: "Tasks: Validator False Positives"
description: "Ordered tasks: reproduce the false positive, mask fenced code at both sites, revert the source workarounds, and run the three-way control plus the packet suite."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "validator false positives tasks"
  - "mask fenced code tasks"
importance_tier: "high"
contextType: "tasks"
parent: "sk-doc/038-authoring-hardening"
_memory:
  continuity:
    packet_pointer: "sk-doc/038-authoring-hardening/002-validator-false-positives"
    last_updated_at: "2026-08-29T12:40:00Z"
    last_updated_by: "claude"
    recent_action: "Completed the masking tasks; three-way control and packet suite both read"
    next_safe_action: "None; tasks complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs"
    session_dedup:
      fingerprint: "sha256:407ccb97f439284115a3882bdb9e9c70d2d653dc12058093b396c6e72c00a9bf"
      session_id: "2026-08-29-sk-code-032-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Validator False Positives

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` completed and evidenced; `[~]` explicitly deferred with a recorded reason and owner; `[ ]` pending.
- `T-NNN` identifiers are stable within this packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Reproduce the false positive from a real document. Evidence: `hooks['tool.execute.before']({ ... })` inside a fenced sample parsed as a markdown link and was reported as `PATH_MISSING`, with the call arguments treated as the target.
- [x] T-002 Establish that the false positive had already damaged source. Evidence: two remediation agents had inserted a space into sample JavaScript as `] (` to stop the match, and a third hit the same wall with `notion["notion_tool"]({ ... })` across 34 files.
- [x] T-003 Locate every link-scanning site. Evidence: `pathChecks` and `extractRootIndexLinks` in `validate-playbook-package.cjs` both ran the same `[...](...)` pattern against raw document text.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-004 Add a length-preserving `maskFencedCode` helper. Evidence: the helper is defined at line 332 of `validate-playbook-package.cjs` and replaces each fenced span with spaces of equal length, so byte offsets and reported line numbers are unchanged.
- [x] T-005 Apply the masking at both link-scanning sites rather than only the one that surfaced. Evidence: `const scanText = maskFencedCode(...)` appears at line 342 in `pathChecks` and line 414 in `extractRootIndexLinks`, and both loops now iterate `scanText`.
- [x] T-006 Revert the sample-code workarounds to idiomatic JavaScript. Evidence: the `] (` spacing introduced to defeat the old regex is gone, and the samples read as the code a reader would actually write.
- [x] T-007 Repair the second false positive of the same class in the same file. Evidence: `labelMarker()` at line 188 now tolerates markdown emphasis around a label, replacing a list-bullet allowance that consumed the first asterisk of `**Label**:` and then failed to match the second; it is wired into the prompt, command-sequence, expected-signals, evidence, and failure-triage checks at lines 252 through 257.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-008 Control one, the fix works. Evidence: a hub playbook with idiomatic sample JavaScript restored validates with 0 violations.
- [x] T-009 Control two, detection survived. Evidence: a genuinely broken link placed outside a fence is still reported as `PATH_MISSING`, so the false positive was removed without disabling the check that produced it.
- [x] T-010 Control three, the false positive is gone. Evidence: a broken-looking link placed inside a fence is ignored rather than reported.
- [x] T-011 Run the packet's own suite and read its output rather than its exit code alone. Evidence: `node scripts/tests/validate-playbook-package.test.cjs` prints `fixture suite: PASS (33 negative/positive assertions)`, `strict default: rc=1 on seeded violation; --no-strict: rc=0; boundary: rc=2`, and exits 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- Fenced code is excluded from link scanning at both sites, with offsets and line numbers preserved.
- A real broken link outside a fence still fails, and a broken-looking one inside a fence does not.
- The sample code contorted to satisfy the old regex is restored to idiomatic form.
- The packet's own suite passes its 33 negative and positive assertions at exit 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach and rollback: `plan.md`.
- Parent phase map: `../spec.md`.
- Predecessor phase: `../001-template-conformance-gaps/`.
- Successor phase: `../003-per-root-enforcement/`.
<!-- /ANCHOR:cross-refs -->
