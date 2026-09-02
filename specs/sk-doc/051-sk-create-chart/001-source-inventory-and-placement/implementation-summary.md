---
title: "Implementation Summary [template:level-3/implementation-summary.md]"
description: "The placement question is answered with evidence, all 124 source files carry a disposition, and the source's noncommercial licence turns out to block phase 4."
trigger_phrases:
  - "implementation"
  - "summary"
  - "template"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/051-sk-create-chart/001-source-inventory-and-placement"
    last_updated_at: "2026-09-02T10:30:00Z"
    last_updated_by: "phase-1-implementer"
    recent_action: "Inventoried all 124 source files, ran the census, and decided placement"
    next_safe_action: "Start phase 002-translation-and-voice, sized at 42,598 Han across 59 files"
    blockers:
      - "ADR-002: the source is PolyForm Noncommercial and this repository is MIT and public. Phase 4 is blocked until the operator decides."
    key_files:
      - "specs/sk-doc/051-sk-create-chart/001-source-inventory-and-placement/research/inventory.md"
      - "specs/sk-doc/051-sk-create-chart/001-source-inventory-and-placement/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-1-source-inventory-and-placement"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "U-01: whether a noncommercial-only work may be redistributed inside an MIT repository"
      - "U-02: whether all English means the 12 Chinese report templates are dropped or kept as data"
    answered_questions:
      - "Mode under sk-doc or standalone skill: mode, per ADR-001"
      - "Do the 57 binary assets cross: 12 do, 45 do not, per ADR-003"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-source-inventory-and-placement |
| **Completed** | 2026-09-02 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing in the skills tree, by design. This phase read 124 files and wrote two documents, and it
found three things that change what the rest of the packet can do. The placement question has an
answer backed by measurement rather than by the skill's name. The translation phase turns out to
be almost three times the size the brief estimated. And the source is licensed for noncommercial
use only, inside a repository that is MIT and published, which is a conflict phase 4 cannot
proceed through.

### The placement verdict

`sk-create-chart` becomes a workflow mode packet under the `sk-doc` hub, at
`.opencode/skills/sk-doc/sk-create-chart/`. The full argument is ADR-001 in `decision-record.md`,
including the comparison table against all 14 existing mode folders and the 9 standalone siblings.

Three measurements decided it. `sk-doc` is the only place in the fleet already shipping an HTML
template corpus, verified by counting `.html` files per skill: 45 in `sk-doc`, 3 in `sk-code`, and
9 in `sk-design-md-generator` of which all 9 sit inside `node_modules`. The subject distance is
smaller than assumed, because `sk-create-diagram` already lists Bar chart, Line chart, Scatter
plot and Radar in its own selection guide. And the source's workflow is template-first by its own
hard constraint, which is the `backendKind: template-scaffold` that 14 of the 15 registered modes
already declare.

Size was expected to be one of the deciding facts and it decided nothing. At 124 files the packet
sits inside the existing 18 to 190 mode range and is equally unremarkable among standalone skills,
which run from 33 to 8,034 files.

### The file dispositions

All 124 files are classified: 6 adapt, 53 translate, 18 port, 47 drop. Every drop carries a
reason. The classification runs from one ordered rule list in `scratch/classify.mjs`, which exits
non-zero if any file matches no rule, so an unclassified file cannot slip through silently.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/inventory.md` | Created | The 124 per-file dispositions, the character census, the licence terms and 8 findings that change later phases |
| `decision-record.md` | Created | ADR-001 placement, ADR-002 the licence conflict, ADR-003 the binary assets |
| `acceptance-criteria.md` | Modified | Replaced the placeholder row with 8 criteria traced to the requirements |
| `plan.md` | Modified | Replaced the generic template context with this phase's actual approach |
| `tasks.md` | Modified | Replaced the generic task list with what was actually executed |
| `implementation-summary.md` | Modified | This document |
| `scratch/scan-source.mjs` | Created | The tree scanner |
| `scratch/classify.mjs` | Created | The disposition rule list |
| `scratch/emit-tables.mjs` | Created | Renders the classified rows into the published tables |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read-only against the source, with every number checked twice by different means.

The file set was counted by a directory walk in `scratch/scan-source.mjs` and independently by
`git ls-files`. Both return 124 paths and `diff` reports no difference between them. The Han
census was counted by a Unicode range regex and independently by a `python3` pass filtering on
`unicodedata.name()`. Both return 45,778 across 67 decodable text files.

Text and binary were separated by NUL byte and UTF-8 decodability rather than by file extension,
because an extension split would have silently skipped the census on any mislabelled file.

Four of the numbers the phase was briefed with did not survive re-measurement, and the
corrections are recorded in `research/inventory.md` section 3 rather than quietly absorbed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mode packet under `sk-doc`, not a standalone skill | The standalone option's only real advantage is a clean advisor identity, and `sk-create-diagram` already claims bar, line, scatter and radar. The overlap exists either way. Inside one hub it is resolved by `routerPolicy.tieBreak`. Across two hubs nothing resolves it. See ADR-001 |
| Port 12 binary assets and drop 45 | `scripts/validate.mjs:44` hard-requires the 12 report PNGs and `templates/reports/index.html` references all 12. The other 45 are referenced only from READMEs, and porting them would nearly triple the hub. See ADR-003 |
| Escalate the licence rather than resolve it | PolyForm Noncommercial forbids sublicensing and this repository's MIT grant is a sublicense to every recipient. That is a licensing judgment for the operator, not a measurable fact. See ADR-002 |
| Generate the inventory tables rather than write them | A 124-row table maintained by hand drifts from the data it describes. `scratch/emit-tables.mjs` renders them, and all 124 generated rows were confirmed present verbatim in the published document |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh <folder> --strict` from the final state | PASS. See the closing verification run |
| SC-001 file set reconciliation | PASS. `scan-source.mjs` 124 paths against `git ls-files` 124 paths, `diff` reports zero difference |
| SC-003 census reconciliation | PASS. Regex count 45,778 against `python3` `unicodedata.name()` count 45,778, exact match |
| REQ-001 every file classified | PASS. 124 of 124 carry a disposition. `classify.mjs` exits non-zero on any unmatched file and exited 0 |
| Disposition arithmetic | PASS. 6 + 53 + 18 + 47 = 124, and 90,820 + 1,239,962 + 5,144,864 + 14,078,757 = 20,554,403 which equals the 1,394,814 text plus 19,159,589 binary totals |
| Published tables match the data | PASS. All 124 rows emitted by `emit-tables.mjs` found verbatim in `research/inventory.md`, 0 missing |
| Punctuation standard | PASS. 0 em dashes, 0 en dashes and 0 semicolons in both authored documents |
| Skills tree untouched | PASS. This phase wrote only inside its own folder |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phase 4 is blocked, not merely cautioned.** ADR-002 stays Proposed until the operator
   decides whether a noncommercial-only work may be vendored into a public MIT repository.
   Phases 2 and 3 are unaffected, because neither copies source content into the skills tree.
2. **The `sk-create-diagram` overlap is identified but not resolved.** Whether the two modes
   split the simple chart types or share them cannot be measured until one of them exists. It is
   U-03 in the inventory, and phase 5 owns it.
3. **The character census counts characters, not effort.** 42,598 Han is a size signal for phase
   2, not an estimate. Prose in `SKILL.md` and terse labels inside a template cost different
   amounts per character.
4. **The clone is session-scoped.** Every measurement here is reproducible only by refetching
   `https://github.com/larashero3-dotcom/lieflat-charts.git` at commit `4eef5ce`, which is why
   both are recorded in the inventory.
<!-- /ANCHOR:limitations -->

---
