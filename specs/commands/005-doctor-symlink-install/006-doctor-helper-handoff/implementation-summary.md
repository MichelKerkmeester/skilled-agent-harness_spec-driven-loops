---
title: "Implementation Summary"
description: "A doctor problem in the operator's own words now reaches /doctor:helper. The advisor asks the helper's own ranker when no doctor bridge matches, and its accuracy gates hold."
trigger_phrases:
  - "doctor helper handoff implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/006-doctor-helper-handoff"
    last_updated_at: "2026-10-31T22:05:33Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped the doctor helper hand-off with tests, docs and DOC-406"
    next_safe_action: "None: the phase is complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01RCAMP5r5zyYXUMpd9BfH7Z"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-doctor-helper-handoff |
| **Completed** | 2026-10-31 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Describe a doctor problem in your own words and the advisor now points you to `/doctor:helper`, which names the command that fits. Before this, a doctor command surfaced only when your prompt carried one of its declared phrases, so "my AGENTS.md is out of date with the template" got no recommendation at all.

### Phase 6: doctor-helper-handoff

When no doctor bridge passes and you typed no `/doctor:` command, the scorer asks `/doctor:helper`'s own ranker whether your prompt describes a doctor problem. The advisor and the helper therefore use one definition of a doctor problem. Three rules keep ordinary requests quiet:

- With no skill passing, the hand-off needs a problem cue and a ranker score of 6 or more, or a score of 10 or more with no cue.
- Beside a passing skill, it needs a strong cue, a wrong state or a health check such as "never converges" or "is not registered". The skill stays first and the brief adds `Also: /doctor:helper`.
- A bare word such as "missing", "broken" or "drift" never counts beside a passing skill, because ordinary work uses those words all the time.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts` | Created | Loads the helper's ranker per workspace, ranks the prompt, grades its problem cue |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modified | `applyDoctorHelperHandoff`, run after the doctor ordering step |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor-helper-handoff.vitest.ts` | Created | Cue tiers, the ranker bridge and the missing-script fallback |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl` | Modified | Four `B-helper-handoff` slice rows |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md` | Modified | Doctor routing paragraph describes the hand-off |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md` | Modified | Same, in the feature catalog |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-routing-helper-handoff.md` | Created | Scenario DOC-406 |
| `.skilled/manual-testing-playbook/manual-testing-playbook.md` and `doctor-commands/README.md` | Modified | DOC-406 index row, 62 files, seven routing probes |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-routing-contested-second-line.md` | Modified | The no-doctor-line rationale now names both rules |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The thresholds came from measurement before the code. The helper's score alone did not separate doctor problems from ordinary prompts: 50 of 261 labeled and holdout prompts scored 10 or more, most of them deep-loop workflow requests. A first version without a cue gate made `/doctor:helper` the top pick for one holdout prompt and one doctor-slice control, so the holdout dropped from 49 to 48 of 66. The cue gate removed both. Splitting the cue into strong and weak then removed seven extra brief lines in the labeled corpus. The uncued score of 10 sits above the two regressing prompts, which scored 9.1 and 7.7.

Each change was rebuilt and measured on four corpora and the helper fixtures, then the full advisor suite ran on the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Hand off to `/doctor:helper` instead of naming the ranked command | The operator chose it. The helper ranks, explains and asks, so the advisor never presents a pick its own evidence did not make. |
| Load the helper's script at run time | One ranker defines a doctor problem for both the advisor and `/doctor:helper`, and a route added to `_routes.yaml` reaches the hand-off with no advisor rebuild. |
| Tier the problem cue | A bare problem word is common in ordinary requests, so it counts only when nothing else passes. A stated wrong state is rare outside a real problem. |
| Leave the Python fallback alone | Its contract is to match a doctor bridge on a typed slash command only, and its tests stay green. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Sixteen reworded prompts, one per doctor command | A doctor command reached for 12 of 16, against 3 of 16 before |
| Helper held-out fixtures, doctor problems with a doctor pick in the top three | 15/48 after, 4/48 before; non-doctor rows 0/12 fire |
| Helper tune fixtures | 26/58 after, 13/58 before; non-doctor rows 0/6 fire |
| Hand-off fires across the holdout, labeled, doctor and ambiguity corpora | 0/66, 0/195, 0/74, 0/24 |
| `npx vitest run` in `system-skill-advisor/runtime` | PASS, exit 0: `Test Files  159 passed (159)`, `Tests  1359 passed \| 8 skipped`. Main before: 1353 passed. The +6 are the new unit tests. |
| Routing slice with the fusion change stashed | FAIL on rows 01, 02 and 04, as expected |
| `python3 -m pytest tests/python/test_skill_advisor.py` | PASS, 8 passed |
| `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` | PASS, 991 of 991 |
| `npm run typecheck` and `npm run build` | PASS, exit 0 |
| `check-comment-hygiene.sh` on the three changed code files | PASS, exit 0 |
| DOC-406 commands | PASS: the three briefs match the scenario |
| DOC-387, DOC-389 and DOC-390 prompts | Unchanged briefs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Most reworded problems still miss.** 33 of the 48 held-out doctor problems get no doctor recommendation. Many name no problem at all, such as "re-tune the routing lanes", and others sit beside a passing skill with only a weak cue. The owning skill still routes those, and `/doctor:helper` can be run by name.
2. **Three of the sixteen probes stay with their skill.** The env, git and update prompts ask a question rather than name a problem, so the owning skill answers without a doctor line.
3. **A fresh worktree needs its skill graph built.** Four advisor test files fail in a worktree until `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true` builds the gitignored graph. They pass once it is built.
<!-- /ANCHOR:limitations -->

---
