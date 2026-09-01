---
title: "Implementation Summary: A Playbook for the Mode That Owns the Voice Standard"
description: "The mode enforcing the repository's voice standard had no manual testing playbook, so the benchmark loader found nothing for it and scored it on nothing. Nine scenarios in three categories now cover both directions the mode has to get right, with the two scoring scenarios priced against the packet's own shipped fixtures rather than invented input."
trigger_phrases:
  - "human voice playbook summary"
  - "scored on nothing before"
  - "shipped fixture expectations"
  - "playbook scanned with its own tool"
  - "scope gate coverage"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/007-human-voice-playbook"
    last_updated_at: "2026-09-01T10:24:27Z"
    last_updated_by: "implementation"
    recent_action: "Authored the nine-scenario voice playbook and enrolled it in the fail-closed list"
    next_safe_action: "Regenerate the packet's generated metadata pair, then close the packet"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/manual-testing-playbook.md"
      - ".opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-human-voice-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-human-voice-playbook |
| **Completed** | 2026-09-01 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/` now holds a root document plus
nine scenarios in three kebab-case categories. Before this phase the mode that enforces the repository's
voice standard had no playbook at all, so the benchmark loader found nothing for it and scored it on
nothing. Nothing inside the mode was edited: this phase tests the mode, it does not change what the mode
enforces.

### Both Directions, Not Just the Flagging One

A voice checker is only half-specified by the text it catches. `tell-detection/` (HVT-001 to HVT-003) covers
the text the mode must flag: the hard-blocker terms, a word whose sense makes it a candidate rather than a
certainty, and a judgment pass the scanner does not cover. `scope-gate/` (HVS-001 to HVS-004) covers the
text it must leave alone: named exempt spans, code and quotations, a document about the standard itself, and
the rule that accuracy outranks the standard. `scoring-and-rescan/` (HVR-001 to HVR-002) covers the
arithmetic and the rescan after a rewrite.

### The Scoring Scenarios Use the Packet's Own Fixtures

HVT-001 runs the shipped dirty fixture and expects 6 hard blockers, -33 mechanical deductions, a 67/100
ceiling and exit 1. HVR-001 runs the shipped clean fixture and expects no mechanical findings, a 100/100
ceiling and exit 0. Both were executed and both match. Writing these against invented input would have made
the scenarios describe a tool that does not exist; writing them against the fixtures the packet already
ships means the expected numbers come from the packet.

### The Playbook Was Scanned With the Tool It Documents

All nine scenario files report 0 hard blockers and a 100/100 ceiling. The root reports 1 hard blocker: the
semicolon inside the result-persistence contract sentence that the package contract requires verbatim. It is
kept and explained in the file itself under the scope gate's "text something else pins" class, which is the
same rule the package tests. A playbook for a voice standard that could not survive its own scan would not
be worth much, and the one exception is itself an instance of a rule the package documents.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/manual-testing-playbook.md` | Created | The playbook root: the scenario index the loader parses, and the explanation of the one kept hard blocker |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/tell-detection/` | Created | HVT-001 to HVT-003: hard-blocker terms, a word-sense candidate, and a judgment pass the scanner does not cover |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/scope-gate/` | Created | HVS-001 to HVS-004: exempt spans, code and quotations, a document about the standard, and accuracy outranking the standard |
| `.opencode/skills/sk-doc/sk-create-with-human-voice/manual-testing-playbook/scoring-and-rescan/` | Created | HVR-001 to HVR-002: the score arithmetic against the clean fixture, and the rescan after a rewrite |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` | Modified | One line enrolling the package alongside the frontmatter one |

Nothing under `sk-create-with-human-voice/` outside `manual-testing-playbook/` was touched.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The categories were settled first, from the two directions spec.md names, so the scope-gate half could not
be quietly dropped in favour of the easier flagging half. The frontmatter shape was carried straight over
from phase 005 rather than rediscovered: the same package validator and benchmark loader read the same block
under mutually exclusive rules here, and omitting only the `expected_workflow_mode` scalar is what keeps all
nine scenarios inside the operator contract while leaving their typed leaf gold intact. The two scoring
scenarios were executed against the shipped fixtures rather than described, and the playbook's own prose was
put through the scanner it documents before the package was enrolled in the fail-closed allowlist.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Cover the scope gate as thoroughly as tell detection | A voice checker that only flags is half-specified, and the expensive failure is rewriting text it was supposed to leave alone |
| Price the scoring scenarios against the packet's shipped fixtures | Expected numbers taken from the packet describe the tool; expected numbers invented for the scenario describe a tool that does not exist |
| Reuse phase 005's frontmatter shape without rediscovering it | The validator and the loader conflict identically here, and the six-key shape would return `SKIP` at exit 0 and quietly exclude the package from every sweep |
| Keep the one hard blocker in the root and explain it | The sentence is pinned verbatim by the package contract, which is exactly the scope-gate class the package tests; rewriting it to score better would break the contract to satisfy the checker |
| Edit nothing inside the mode | spec.md §3 is explicit: this phase tests the mode, it does not change what the mode enforces |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate-playbook-package.cjs` on the package | PASS — `PASS package=sk-doc/sk-create-with-human-voice tier=FAIL_CLOSED scenarios=9 categories=3 operator=9 routing_gold_excluded=0 violations=0 warnings=0` (REQ-001, SC-001) |
| The benchmark scenario loader | PASS — `shape=sk-doc scenarios=9 warnings=[]`, where before this phase it found nothing for the mode (REQ-002, SC-002) |
| Both directions covered | PASS — `tell-detection` for the text the mode must flag, `scope-gate` for the text it must leave alone (REQ-003) |
| HVT-001 against the shipped dirty fixture | PASS — 6 hard blockers, -33 mechanical deductions, a 67/100 ceiling, exit 1 (SC-003) |
| HVR-001 against the shipped clean fixture | PASS — no mechanical findings, a 100/100 ceiling, exit 0 (SC-003) |
| Link integrity on the package | PASS — `failures=0` |
| `d5-connectivity` on the mode | PASS — score 100, `stageTwoRouted=5`, zero issues |
| The playbook scanned with its own tool | PASS with one explained exception — all nine scenarios 0 hard blockers and 100/100; the root carries 1 hard blocker, the semicolon in the verbatim-required contract sentence, kept and explained in place |
| Fail-closed enrolment | PASS — the package is in `playbook-failclosed-allowlist.txt` alongside the frontmatter one |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The root does not score 100/100, and should not.** It carries one hard blocker, the semicolon inside
   the result-persistence contract sentence the package contract requires verbatim. Rewriting it would break
   the contract to satisfy the checker, so it is kept and explained under the scope gate's "text something
   else pins" class.
2. **A missing route declaration is not recorded as a failure for these scenarios.** The frontmatter shape
   omits `expected_workflow_mode`, so `scenario.expected` is undefined and `requireRouteDeclaration` stays
   false at `codex-executor.cjs:145`. This is the same accepted trade phase 005 recorded, and for the same
   reason: the alternative is a package that reports `SKIP` at exit 0 and is silently excluded.
3. **Eight sk-doc modes still have no playbook.** spec.md §3 puts them out of scope deliberately. This phase
   was justified by sharing the setup with the frontmatter package, and that argument does not extend to
   modes with no work already in flight.
4. **Nine scenarios do not cover the judgment half of the standard.** HVT-003 names a judgment pass the
   scanner does not cover, but naming it is not the same as testing it. What is mechanically checkable is
   what these scenarios check.
<!-- /ANCHOR:limitations -->

---
