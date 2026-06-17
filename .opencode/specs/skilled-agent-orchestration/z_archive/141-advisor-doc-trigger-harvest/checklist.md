---
title: "Verification Checklist: Advisor Doc-Trigger Harvest"
description: "Verification Date: 2026-06-11"
trigger_phrases:
  - "advisor doc harvest checklist"
  - "skill_docs verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/141-advisor-doc-trigger-harvest"
    last_updated_at: "2026-06-11T12:30:00Z"
    last_updated_by: "claude-fable"
    recent_action: "CHK-042 done; only CHK-025 live smoke remains blocked"
    next_safe_action: "Live smoke T025 after all advisor sessions cycle"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/skill-doc-harvest.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-141-advisor-doc-trigger-harvest"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Advisor Doc-Trigger Harvest

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001..REQ-008 with GIVEN/WHEN/THEN acceptance criteria; contract origin cited (009/001 research.md)
- [x] CHK-002 [P0] Technical approach defined in plan.md — component-by-component architecture, data flow, affected-surfaces table
- [x] CHK-003 [P1] Dependencies identified and available — better-sqlite3/WAL in place; operator decision recorded before first edit; 009 authoring dependency explicitly pending
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `npm run build` (tsc -p tsconfig.build.json) green after every edit wave; `python3 -c "ast.parse(...)"` green for skill_advisor.py
- [x] CHK-011 [P0] No console errors or warnings introduced — pilot runs emit only the pre-existing WEIGHT-BAND warning from sk-prompt-small-model metadata
- [x] CHK-012 [P1] Error handling implemented — unreadable docs emit `DOC-READ-FAILED` and continue; missing skill_docs table on read-only DBs degrades to empty map; walker swallows unreadable dirs
- [x] CHK-013 [P1] Code follows project patterns — opt-in flag matches the `=== 'true'` house convention; harvest mirrors the existing upsert/transaction style; evidence strings reuse the `prefix:` convention; comment hygiene respected (no spec-path/REQ-id comments)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met for build scope — REQ-001..REQ-007 verified (REQ-008 rollout is the open remainder, tracked in tasks T018-T020)
- [x] CHK-021 [P0] Manual testing complete — isolated-DB pilot on the real tree: 355 scanned / 84 indexed; doc-phrase prompt ranks deep-loop-runtime #1 (0.2968) with `doc:references/script_interface_contract.md`; flag-off probe 0 docTriggers
- [x] CHK-022 [P1] Edge cases tested — README exclusion, nested dirs, non-md, no-frontmatter, phrase-stripped doc deletion, inline vs block lists, unknown tier fallback, absent-vs-empty docTriggers equality
- [x] CHK-023 [P1] Error scenarios validated — doc deletion → stale sweep; pre-migration DB tolerance via try/catch (code path); suite triage isolated pre-existing failures via stash-rerun
- [x] CHK-024 [P1] Rollout-fix regression (2026-06-11) — launcher allowlist fix: `createChildEnv` unit check (flag forwarded, unknown keys stripped) + launcher-bootstrap/plugin-bridge/skill-doc-harvest vitest 28/28; Python sqlite-merge fix: flag-on local run ranks deep-loop-runtime 0.95 via doc signal, flag-off byte-identical, pytest 4/4, py_compile clean
- [ ] CHK-025 [P0] Live daemon `matchedDocs` smoke — BLOCKED on session-cycle adoption (every advisor-attached session must end so a fresh-session launcher with the fixed allowlist respawns the daemon); then trusted scan shows ~355/84 docs counters and `advisor_recommend "coverage graph script exit codes"` carries `matchedDocs`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned — feature work, single finding fixed during build: quote-strip-before-trim parser bug, class `instance-only` (one helper, one call shape)
- [x] CHK-FIX-002 [P0] Same-class producer inventory — `rg -n "SURROUNDING_QUOTES|strip(\"'\")"`: TS `cleanScalar` fixed; Python parser trims before stripping by construction; SKILL.md parser (`skill-markdown.ts`) strips full-line values where leading whitespace cannot occur
- [x] CHK-FIX-003 [P0] Consumer inventory for changed surfaces — `SkillGraphIndexResult` consumers (scan handler spreads; additive-optional safe), `LaneMatch.evidence` consumers (fusion caps at 6; docs-first ordering protects pointers), `AdvisorRecommendationSchema` consumers (hook brief + CLI pass through unknown optional fields)
- [x] CHK-FIX-004 [P0] Path-handling change carries adversarial table tests — sanitization case covers traversal (`../../etc/passwd`), interior traversal (`references/../secrets.md`), prefix escape, non-md, dedupe, and the max-3 cap
- [x] CHK-FIX-005 [P1] Matrix axes listed — flag {off,on} × doc state {new, unchanged, edited, deleted, phrase-stripped} × path class {references, assets, nested, README, non-md} = covered across 11 cases (enumerated in plan.md affected-surfaces)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant — tests mutate `process.env.SPECKIT_ADVISOR_DOC_TRIGGERS` and restore in afterEach; flag-off and flag-on cases run in the same file proving no state bleed
- [x] CHK-FIX-007 [P1] Evidence pinned — all evidence references this packet's working-tree state of 2026-06-11 (uncommitted by design; the shared-index repo commits are operator-driven). Re-pin to the landing SHA at commit time
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — feature touches filesystem walk + sqlite only; flag read from env
- [x] CHK-031 [P0] Input validation implemented — frontmatter fields clamped (12 phrases/doc, 300 chars, 200 docs/skill, depth 6); matchedDocs allowlist regex + traversal rejection before response emission
- [x] CHK-032 [P1] Auth/authz unchanged — harvest runs only inside `skill_graph_scan`/`advisor_rebuild` paths already gated by `requireTrustedCaller`; recommend path stays read-only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — all five packet docs authored from the executed work, statuses agree (In Progress; rollout pending)
- [x] CHK-041 [P1] Code comments adequate — new module headers state the why (memory-never-indexes boundary, every-skill harvest rationale, dampening rationale); no tracking-artifact labels
- [x] CHK-042 [P2] README updated — T018 DONE 2026-06-11: advisor README §4 "Doc-Frontmatter Trigger Harvest" + ARCHITECTURE §4 paragraph; feature_catalog entry (38 features, group 02 now 7) + per-feature file; playbook AI-006 scenario + root rows (45→46) with inventory vitest bumped and green; skill-local changelog `v0.8.0.md`; ENV_REFERENCE.md SKILL ADVISOR row for the flag
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — pilot scripts intentionally in /tmp (`pilot-doc-harvest2.mjs`, `pilot3.mjs`), reproduced as commands in implementation-summary; packet scratch/ holds only .gitkeep
- [x] CHK-051 [P1] scratch/ cleaned before completion — nothing to clean (verified empty)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 10/11 (CHK-025 blocked on session-cycle daemon adoption) |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-11
<!-- /ANCHOR:summary -->
