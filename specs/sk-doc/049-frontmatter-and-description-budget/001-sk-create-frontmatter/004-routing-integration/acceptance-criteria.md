---
title: "Acceptance Criteria: Phase 4: routing-integration"
description: "The seven criteria that decide whether the registration may close: both routing stages replayed with real prompts, every declared leaf resolving on disk, the coverage guard counting the mode from the live registry, and a sibling-regression probe showing no route was taken from anyone."
trigger_phrases:
  - "routing integration acceptance"
  - "two stage replay evidence"
  - "leaf connectivity score"
  - "sibling route regression probe"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/004-routing-integration"
    last_updated_at: "2026-09-01T08:42:59Z"
    last_updated_by: "implementation"
    recent_action: "Closed the routing criteria; all seven rows met by replay, not by registry presence"
    next_safe_action: "Proceed to phase 005 (command and playbook)"
    blockers: []
    key_files:
      - "../002-mode-scaffold/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: routing-integration

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/049-sk-create-frontmatter/004-routing-integration
**Level:** 3
**Status:** Complete
**Date:** 2026-09-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a frontmatter request, When the advisor runs, Then it selects the sk-doc hub, and when the hub router then runs, Then it selects this mode | Stage one: `skill_advisor.py "I need to add a yaml frontmatter block and work out the description budget" --threshold 0.5` returns `sk-doc` at confidence 0.95 with `"reason": "Matched: !description budget(signal), !frontmatter block(signal), !yaml frontmatter(signal), create, frontmatter"`, naming the three signals added to the hub's graph metadata. Stage two: the canary case `single-create-frontmatter` on prompt `yaml frontmatter block` resolves to `"selectionKind":"single","targets":["sk-create-frontmatter"]` with `realEvaluateRouteGoldPass: true` | Met | - |
| AC-002 | REQ-002 | Given the leaves the mode declares in the resource map and the leaf manifest, When the connectivity gate runs, Then every one resolves on disk | `d5-connectivity.cjs --skill .opencode/skills/sk-doc/sk-create-frontmatter` reports `score: 100`, `gateFailed: false`, `routerParseable: true`, `hubStageTwoRouted: 3`, and empty `deadResourcePaths`, `deadIntentKeys`, `orphanReferences`, `pathEscapes` and `findings`. The same script on the hub reports zero of each | Met | - |
| AC-003 | REQ-003 | Given the canary's coverage guard, When it counts modes with a single-route case, Then this mode is included | The guard reports `modesWithSingleRouteCase: 15`, derived from the live registry rather than from a written list | Met | - |
| AC-004 | REQ-004 | Given the 14 sibling modes and their existing routes, When the new vocabulary is in place, Then no sibling loses a route it held | All 22 canary rows are green and the 14 pre-existing single-route cases still resolve to their own modes. A separate intent-scorer replay confirms it directly: "create an agent with agent frontmatter and a permission object" scores `AGENT_CREATION: 12` with FRONTMATTER at zero, "write release notes since the last version" scores `CHANGELOG: 8` with FRONTMATTER at zero, and "yaml frontmatter block" scores `FRONTMATTER: 8` alone | Met | - |
| AC-005 | SC-001 | Given the mode's own vocabulary, When stage two is replayed on it, Then it routes to the mode | The canary case `single-create-frontmatter` with `realEvaluateRouteGoldPass: true`; the route is exercised rather than inferred from the registry entry's existence | Met | - |
| AC-006 | SC-002 | Given the sk-doc canary, When it runs with the mode registered, Then it exits zero and counts the mode | All 22 rows green, `modesWithSingleRouteCase: 15`, and all five hub canaries exit 0 after the compiled routing was published | Met | - |
| AC-007 | SC-003 | Given a frozen probe corpus, When it is replayed after registration, Then no sibling regression appears | The 14 pre-existing single-route canary cases plus the three-prompt intent-scorer replay in AC-004, which separates FRONTMATTER from `AGENT_CREATION` and `CHANGELOG` on their own prompts | Met | - |

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

All seven criteria are Met, and every one of them was proven by replay rather than by the presence of a
registry entry, which is the specific failure this phase's spec named. A request reaches the hub on the
new vocabulary and the hub router then reaches this mode; every leaf the mode declares resolves; the
coverage guard counts it from the live registry; and no sibling lost a route.

This phase also closes the deviation phase 002 recorded as ADR-001. Registration is what invariant 6a
was asking for, and after it `parent-skill-check.cjs` reports `OK: parent-skill-check — all hard
invariants passed, 0 warnings` at exit 0. Phase 002's AC-002 and AC-005 are `Superseded` rather than
`Met` for that reason: their premise, that an unregistered packet is inert, is false, and the outcome
they wanted was only ever reachable here.

Consciously left out: no command surface was added, so the registry entry carries `command: null`, and
the mode is reached through the hub router rather than by a slash command. That is phase 005's scope.
Also left deliberately narrow is the vocabulary itself. All 17 keywords are qualified, and a bare
`frontmatter` token was rejected because `AGENT_CREATION` already owns "agent frontmatter"; a user who
types only that bare word will not reach this mode on that token alone, which is the accepted cost of
not degrading a sibling's exclusive route.
<!-- /ANCHOR:closure -->
