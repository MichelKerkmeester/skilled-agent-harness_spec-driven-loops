---
title: "Acceptance Criteria: Run the advisor suite on hook-only changes and delete the production-dead advisor helpers"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "advisor ci filter dead helpers acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/030-advisor-ci-filter-dead-helpers"
    last_updated_at: "2026-11-24T11:35:40Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-030-advisor-ci-filter-dead-helpers"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Run the advisor suite on hook-only changes and delete the production-dead advisor helpers

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 030-advisor-ci-filter-dead-helpers
**Level:** [2/3/3+]
**Status:** Complete
**Date:** 2026-11-24
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `skill-advisor-stress.yml`, When a diff touches only `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`, Then both the pull_request and push path filters match it | Both filters list `.opencode/` and `.skilled/skills/system-skill-advisor/hooks/**` (yaml parse); `git ls-files ':(glob).skilled/skills/system-skill-advisor/hooks/**'` includes `hooks/pi/prompt-advisor.ts` | Met | - |
| AC-002 | REQ-002 | Given the final tree, When `rg` searches `.skilled`, `.opencode` and `.claude` for the five deleted symbols and `compat/redirect-metadata` outside specs, dist and changelogs, Then it prints nothing | The rg in `spec.md` widened to `.skilled .opencode .claude` printed nothing, exit 1 | Met | - |
| AC-003 | REQ-003 | Given sa-016 in the lifecycle stress file, When it runs, Then it still asserts the `filterCorpusStatEligible` and `routePolicyForPath` results and passes | sa-016 keeps its `structurallyIndexed`, `corpusEligible` and both `routePolicyForPath` assertions; lifecycle stress 2 passed | Met | - |
| AC-004 | REQ-004 | Given the final tree, When the advisor typecheck, build, full suite, stress suite and the catalog and playbook validators run, Then each exits 0 | 17-gate run on the changed tree: advisor 189 files, 3201 passed, 4 skipped; stress 21 files, 62 passed; Python, doctor, catalog, playbook and mirrors exit 0 | Met | - |

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

**Closeable:** Yes. Every criterion is met with observed evidence.

[One sentence: what decides closure now. Name a criterion by id only when it blocks closure.]
<!-- /ANCHOR:closure -->
