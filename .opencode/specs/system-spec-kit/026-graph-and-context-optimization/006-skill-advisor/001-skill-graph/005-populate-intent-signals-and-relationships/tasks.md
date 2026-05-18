---
title: "Tasks: Populate intent_signals + manual relationships"
description: "Per-skill author + validate."
trigger_phrases:
  - "intent signals tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-populate-intent-signals-and-relationships"
    last_updated_at: "2026-05-14T01:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "tasks.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: Populate intent_signals + manual relationships

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[ ]` | Open |
| `[x]` | Done |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [ ] T001 Enumerate active skills (17 expected).
- [ ] T002 For each: read SKILL.md description + existing graph-metadata.json.
- [ ] T003 Read 015/005 audit-report.md for grounding signals per skill.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T010 Compose `derived.intent_signals` (3-7) per skill.
- [ ] T011 Compose `manual.depends_on` per skill (mechanical deps only).
- [ ] T012 Compose `manual.related_to` per skill (sibling usage pairs).
- [ ] T013 Apply edits scoped strictly to the three target fields.
- [ ] T014 Run skill_graph_scan; confirm 17 still discoverable and no schema errors.
- [ ] T015 Update implementation-summary.md with edit ledger.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T020 `npm run typecheck` from `mcp_server/`.
- [ ] T021 `npm exec -- vitest run skill_advisor`; only plugin-bridge baseline fails.
- [ ] T022 `npx tsc --build`.
- [ ] T023 advisor_recommend probe: at least one fixture prompt produces non-zero `graph_causal_rawScore`.
- [ ] T024 Strict validate this packet + parent 015.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [ ] All Phase 1-3 tasks `[x]`.
- [ ] No `[B]` blockers.
- [ ] All 17 skills carry the three target fields.
- [ ] Strict validation green.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent: `002-skill-advisor-semantic-lane`
- Reference: `005-skill-metadata-quality-audit/research/audit-report.md`
- Predecessor: `006-apply-metadata-fixes-and-resweep` (already touched description + trigger_phrases + key_topics)
- Sibling parallel: `007-harder-intent-corpus-resweep`
<!-- /ANCHOR:cross-refs -->
