---
title: "Acceptance Criteria: Phase 14: sk-design-doc-and-routing-check"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check"
    last_updated_at: "2026-09-27T14:30:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Get the owner's gate choice, then meet the open criteria"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which md-generator gate option does the owner choose"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 14: sk-design-doc-and-routing-check

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check
**Level:** 2
**Status:** Planned
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the live front door routes sk-design at build time, When rule 6 is rewritten, Then the file no longer says the hub is outside compiled routing and rule 6 names the front door and the legacy fallback | `node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "make a bar chart of monthly revenue"` prints `"action":"route"` and `sk-design-chart`. `grep -c "not in the compiled closure" .skilled/skills/sk-design/SKILL.md` prints `0`. `grep -n "compiled-route.cjs --hub sk-design" .skilled/skills/sk-design/SKILL.md` shows a hit inside section 5 | Unmet | - |
| AC-002 | REQ-002 | Given two gate options, When the owner chooses, Then the choice is in this phase's spec before any md-generator file changes | `grep -n "Owner choice: [AB]" specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check/spec.md` prints one line with a date. `git log -G 'Owner choice: [AB]' --format='%h %ad' --date=iso -- <this spec.md>` prints a commit dated no later than the first line of `git log --since=2026-09-27 --reverse --format='%h %ad' --date=iso -- .skilled/skills/sk-design/sk-design-md-generator` | Unmet | - |
| AC-003 | REQ-003 | Given the owner's choice, When the build applies it, Then docs and code state one gate | Option A: `rg -n 'isPass[^A-Za-z]\|>= ?80' -g '*.md' .skilled/skills/sk-design/sk-design-md-generator` prints nothing and `git diff --stat HEAD~1 -- .skilled/skills/sk-design/sk-design-md-generator/backend` is empty. Option B: `npm test` in `.skilled/skills/sk-design/sk-design-md-generator/backend` exits 0 and its output names the new cases | Unmet | - |
| AC-004 | REQ-004 | Given the existing admission harness, When it runs on sk-design, Then its gold-scored result is kept in the run folder | `.skilled/skills/sk-design/benchmark/reports/<run-label>/raw/admission.json` exists, and `node -e` over it prints 4 scenario rows and the hub verdict. The report quotes the same counts. Baseline on 2026-09-27: `3 pass, 1 drift`, SD-007 `wrong-mode`, exit 1 | Unmet | - |
| AC-005 | REQ-005 | Given 49 mode scenarios with no gold frontmatter, When each prompt is routed at `--hub sk-design`, Then the report states the first routing accuracy over 53 scenarios | `grep -c '^### ' .skilled/skills/sk-design/benchmark/reports/<run-label>/raw/mode-routing.txt` prints `49`. The report prints `N of M scored` with M plus the n/a count equal to 53, and names every miss and n/a. `grep -c '<run-label>' .skilled/skills/sk-design/benchmark/README.md` prints 1 or more | Unmet | - |
| AC-006 | REQ-006 | Given the phase's scope, When the build ends, Then only sk-design files, and at most sk-design's activation manifest, changed and no model was called | `git status --porcelain` and `git show --stat` of the build commit list only paths under `.skilled/skills/sk-design/` and this phase folder. `git diff --stat HEAD~1 -- .skilled/bin` is empty, or under the SD-007 vocabulary option lists only `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-design/manifest.json`. `grep -oE 'node [^ ]+' .skilled/skills/sk-design/benchmark/reports/<run-label>/raw/mode-routing-run.sh \| sort -u` prints only `node .skilled/bin/compiled-route.cjs` | Unmet | - |
| AC-007 | REQ-007 | Given the build evidence, When the phase docs are refreshed, Then the phase validates | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check --strict` prints `RESULT: PASSED` | Unmet | - |
| AC-008 | REQ-008 | Given the replay baseline and the owner's yes on the diagnosed fix, When the fix lands, Then SD-007 routes to its gold and nothing else regresses | The report names SD-007's cause. `grep -n "SD-007 fix approved:"` on this phase's `spec.md` prints one line. `node .skilled/bin/compiled-route-admission.cjs --hub sk-design` prints `4 pass, 0 drift` and exits 0. `node .skilled/bin/compiled-route-status.cjs --hub sk-design` prints `"causeCode":"compiled-serving"`. Comparing the post-fix `raw/` capture with the baseline capture lists no scenario that matched its gold before and misses after | Unmet | - |

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

**Closeable:** No

Nothing is built. The phase is Planned and every row above is Unmet.
<!-- /ANCHOR:closure -->
