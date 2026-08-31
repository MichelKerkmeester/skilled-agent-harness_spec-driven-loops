---
title: "Acceptance Criteria: Phase 8: Conformance, Playbook and README"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-doc/040-create-repo-rules/008-conformance-playbook-and-readme"
    last_updated_at: "2026-08-31T14:06:07Z"
    last_updated_by: "claude"
    recent_action: "Closed fourteen criteria; corrected two that a fresh review proved overstated"
    next_safe_action: "Commit the packet"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/manual-testing-playbook.md"
      - ".opencode/skills/sk-doc/sk-create-repo-rule/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: Conformance, Playbook and README

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 040-create-repo-rules/008-conformance-playbook-and-readme
**Level:** 2
**Status:** Complete
**Date:** 2026-08-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the packet, When audited against the sk-create-skill ALWAYS and NEVER rules, Then every violation is fixed rather than recorded | First pass found and fixed ALWAYS-7 (3 file references in WHEN TO USE, now 0). A later independent review found the first pass used the wrong validator: `package_skill.py --check --strict` FAILED where all three siblings passed. Two further violations fixed (RULES used bold headings instead of the canonical ALWAYS/NEVER/ESCALATE H3s; SMART ROUTING lacked the resilient-router markers). Now `Result: PASS` with the same 2 recommended-section warnings every sibling carries | Met | - |
| AC-002 | REQ-002 | Given the new playbook package, When the operator-scenario validator runs on it, Then it passes fail-closed with zero violations | `validate-playbook-package.cjs --package ...` returns `PASS tier=FAIL_CLOSED scenarios=10 categories=3 operator=10 violations=0 warnings=0` | Met | - |
| AC-003 | REQ-002 | Given the fleet validator, When it runs across every root, Then the scanned count equals the roots on disk and nothing fails | 42 packages scanned, 42 roots found by `find`, 0 FAIL, 0 total violations | Met | - |
| AC-004 | REQ-002 | Given each per-feature file, When its scenario table is parsed, Then it carries exactly nine columns | All 10 files measured at 9 columns. Two rows were repaired after a removed pipe and a stray newline broke them | Met | - |
| AC-005 | REQ-002 | Given every bash command in the package, When run against the live corpus, Then it produces the output the scenario claims | First pass ran most commands and fixed 3 defects. It did NOT run all of them, and an independent review found 3 more: RRA-001 step 5 counted raw dividers so a conforming rule always graded FAIL (d = s+2 in all 8 rules); RRL-001 step 4 was an unbounded `git log` emitting 30,773 lines in 5s, newest-first, the reverse of the ordering it claimed to prove; RRA-001 step 2 disagreed with its own table cell and the two versions returned opposite results. All 3 fixed and re-run: step 5 prints `8 8 159` on a shipped rule, step 4 returns 18 chronological lines showing the router added first, step 2 exits 1 with no match | Met | - |
| AC-006 | REQ-003 | Given a reader with no prior context, When they read the README, Then it explains what a repo rule is, how one loads at runtime and how to use the mode | README sections 2 and 4 cover the skill-versus-rule distinction, the four-step trigger-table load path, the precedence ladder and the create and retire orderings | Met | - |
| AC-007 | REQ-003 | Given the README, When validated as a readme document, Then it reports valid with zero issues | `validate_document.py README.md --type readme` returns VALID, 0 issues, after restructuring onto the sibling nine-section skeleton | Met | - |
| AC-008 | REQ-004 | Given the README prose, When swept for HVR violations outside code spans, Then none remain | 0 em dashes, 0 prose semicolons, 0 curly quotes, 0 banned metaphors, 0 filler modifiers. 3 serial commas and 3 modifiers were found and fixed. The one semicolon left is inside an awk code span | Met | - |
| AC-009 | REQ-005 | Given the clean package, When the change ships, Then its root is enforced rather than incidentally passing | Added to `playbook-failclosed-allowlist.txt` at line 45, in sorted position. Fleet run confirms the root is discovered and passing | Met | - |
| AC-010 | REQ-002 | Given no feature catalog exists, When a scenario references one, Then the absence is recorded explicitly rather than linked | All 10 per-feature files carry a `No feature-catalog entry` row, and the root index states the Catalog column is intentionally absent | Met | - |
| AC-011 | REQ-001 | Given an independent review of the packet, When its findings are verified, Then each is reproduced before it is acted on and each fix is re-run | Two fresh reviewers ran against separate surfaces. Every acted-on finding was reproduced first: `d = s+2` across all 8 rules, 30,773 `git log` lines in 5s, `package_skill --check --strict` FAIL vs 3 sibling PASS, presentation asset with 0 Phase 0 matches against 11 of 12 siblings | Met | - |
| AC-012 | REQ-001 | Given the command package, When measured against the sibling family, Then it carries the family contract rather than a stub | Presentation asset 49 -> 137 lines with Phase 0 and PRE-BOUND SETUP ANSWERS; workflow YAMLs 8 -> 24/25 keys; family-parity check against the 11 siblings reports no missing key. Router `validate_document --type command` VALID, 0 issues | Met | - |
| AC-013 | REQ-003 | Given the hub, When a runtime lists sk-doc, Then the mode is visible on every discovery surface | Hub `SKILL.md` gained the mode row and now reads twelve packets (the live skill listing updated in-session to confirm); `description.json` keywords updated; `.codex`, `.pi` and `.cursor` mirrors created, all three sync gates PASS (169 mirrors) | Met | - |
| AC-014 | REQ-002 | Given the two routing stages, When a repo-rule request is replayed, Then both stages resolve it and neither captures out-of-hub phrasing | `router-replay.cjs` resolves `sk-create-repo-rule` + `REPO_RULE` for all repo-rule phrasings; `rule file for eslint` returns NONE after the alias was narrowed to `repo rule file`; `parent-skill-check` 0 failures; advisor regression byte-identical to baseline | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

AC-002 and AC-005 carried the packet, and AC-005 only after correction. The first proves the playbook is enforced rather than merely present. The second is the one this kind of document usually fails, and this packet failed it on the first pass: the claim that every command had been executed was false, and a fresh review found three unrun commands, two of them in the load-bearing scenarios. All three are fixed and re-run. Nothing was waived. A feature catalog was consciously left out because the playbook contract treats it as optional, and every scenario records that absence rather than pointing at a file that does not exist.
<!-- /ANCHOR:closure -->
