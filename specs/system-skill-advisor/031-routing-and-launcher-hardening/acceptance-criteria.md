---
title: "Acceptance Criteria: Advisor routing and launcher hardening"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "routing and launcher hardening acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/036-routing-and-launcher-hardening"
    last_updated_at: "2026-10-17T12:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked every criterion Met with evidence"
    next_safe_action: "Coordinator writes the changelog and commits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "036-routing-and-launcher-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Advisor routing and launcher hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-skill-advisor/036-routing-and-launcher-hardening
**Level:** 2
**Status:** Complete
**Date:** 2026-10-17
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `push allowlist` restored, When the corpora are scored, Then the review prompt stays sk-code first and every moved row is judged correct | Per-prompt lost=0 gained=0. Four top-3 tail moves on spec prompts, judged correct. Live CLI: `push allowlist` → sk-git, review prompt → sk-code, sk-git | Met | - |
| AC-002 | REQ-001 | Given the new containment rule, When the old rule is put back, Then the new unit test fails | Old rule put back: one `scoreTokenOverlap partial credit` case fails | Met | - |
| AC-003 | REQ-002 | Given `environment variables` routing, When a design is tried, Then it routes the bare prompt to system-spec-kit and keeps doctor-a-05, or the item stops with evidence | `lead_phrases` adopted with operator approval. Live CLI: `environment variables` → system-spec-kit, `check my environment variables` → command-doctor-env, system-spec-kit. Mutation checks on deriver, TS and Python lead rules each fail a test | Met | - |
| AC-004 | REQ-003 | Given the deep-loop and MCP bridges active, When `doctor-phrase-reach.cjs` runs, Then every admitted phrase reaches its bridge, each has three or more words, and a fitting skill ranks first | `doctor-phrase-reach` STATUS=OK phrases=96 bridges=18, exit 0. Live CLI puts system-deep-loop, mcp-code-mode or sk-code first on every new phrase | Met | - |
| AC-005 | REQ-004 | Given a fixture whose `node_modules` matches its lockfile and a stale build, When the install would fail offline, Then `node_modules` is intact and the build ran | `launcher-install-guard.vitest.ts` 6 tests pass, including the fake offline npm. With `if (false)` one test fails | Met | - |
| AC-006 | REQ-005 | Given the advisor override removed, When the package validator runs on the advisor package, Then it checks 36 operator scenarios and reports PASS | Validator: PASS package=system-skill-advisor operator=36 routing_gold_excluded=25 violations=0 | Met | - |
| AC-007 | REQ-006 | Given the advisor `SKILL.md` and playbook index, When `hvr_scan.py` runs, Then each reports 0 hard blockers | hvr_scan: 0 hard blockers on `SKILL.md`, the playbook index and every touched doc | Met | - |
| AC-008 | REQ-007 | Given all changes, When the full gate list runs, Then per-prompt Lost is 0 and the short-prompt probe shows LOST 0 and CHANGED 0 outside intended rows | Per-prompt lost=0. Short probe TOTAL=59 LOST=0 CHANGED=0. Every gate exit 0 (see `implementation-summary.md`) | Met | - |

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

Every criterion is Met with observed evidence. No waiver was needed.
<!-- /ANCHOR:closure -->
