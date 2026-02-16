# Verification Checklist: Task 03 — Command Configs Audit

<!-- SPECKIT_LEVEL: 3 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## P0 — Agent Routing

- [ ] CHK-001 [P0] All 6 create command .md files have correct agent routing
- [ ] CHK-002 [P0] All 7 spec_kit command .md files have correct agent routing
- [ ] CHK-003 [P0] `spec_kit/complete.md` references check-placeholders.sh (spec 128)
- [ ] CHK-004 [P0] `spec_kit/handover.md` references Haiku model (spec 016)

## P1 — Memory Commands + Assets

- [ ] CHK-010 [P1] `memory/context.md` describes 5-source pipeline and 7 intents
- [ ] CHK-011 [P1] `memory/save.md` describes spec doc indexing
- [ ] CHK-012 [P1] All 12 create YAML assets match .md routing
- [ ] CHK-013 [P1] All 10 spec_kit YAML assets reference current scripts
- [ ] CHK-014 [P1] `memory/learn.md` and `memory/manage.md` current

## P2 — YAML/MD Consistency

- [ ] CHK-020 [P2] YAML asset filenames match command .md names
- [ ] CHK-021 [P2] No stale script paths in YAML workflows

## Output Verification

- [ ] CHK-030 [P0] changes.md populated with all required edits
- [ ] CHK-031 [P0] No placeholder text in changes.md

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | /6 |
| P1 Items | 5 | /5 |
| P2 Items | 2 | /2 |

**Verification Date**: ____
