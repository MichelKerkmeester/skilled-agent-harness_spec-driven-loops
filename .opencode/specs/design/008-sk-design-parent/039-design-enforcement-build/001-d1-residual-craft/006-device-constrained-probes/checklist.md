---
title: "Verification Checklist: Device And Constrained-Context Probes"
description: "Verification items for the additive Device And Constrained Context section in design-audit/references/hardening_edge_cases.md: five-probe presence, pass/fail/skip + evidence shape, house-style consistency, performance/offline boundary, evergreen, and scope-lock acceptance (advisory review)."
trigger_phrases:
  - "device constrained context probes checklist"
  - "hardening matrix device probes design build"
  - "low-power save-data throttle offline slow-media probes"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/006-device-constrained-probes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verified all P0/P1 items; optional metadata touches deferred by decision"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether CHK-042 optional touches block completion resolved to no — they are P2 and the deferred branch acceptance (core deliverable stands) is satisfied"
---
# Verification Checklist: Device And Constrained-Context Probes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Target matrix re-read; the per-section house style is confirmed (intro sentence + three-column probe table + closing routing note) and the `8A` letter-suffix insertion precedent is noted — confirmed; §8A at line 138 is the precedent reused for §8B
  - **Acceptance**: the new section will be drafted in the same shape as §2-8A, inserted before `## 9. ROUTING SUMMARY` — met; §8B inserted at line 150 before §9 at line 168
- [x] CHK-002 [P0] Scope frozen to the single file `hardening_edge_cases.md`; no other reference, asset, or script is edited — this phase's change is the one file; sibling `audit_report_template.md` / `scripts/` edits belong to a different phase
  - **Acceptance**: `git status --porcelain` lists only `design-audit/references/hardening_edge_cases.md` under `.opencode/skills/sk-design/` for this phase's change — met; `git diff --stat` on the target reports 18 insertions, 0 deletions

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The `Device And Constrained Context` section exists with all five required probes: low-power, Save-Data, CPU-throttle, offline-to-online, slow media — `## 8B` at line 150 with all five rows
  - **Acceptance**: each of the five conditions appears as its own probe row in the section's table — met; rows at lines 156-160
- [x] CHK-011 [P0] Each probe row carries the three house-style columns plus a recorded pass/fail/skip verdict and an evidence slot — verified per row
  - **Acceptance**: every row has a probe, an unhardened symptom, a finding to file, and the verdict/evidence convention applies to it — met; each finding cell ends with `verdict: pass | fail | skip` and an `evidence:` slot
- [x] CHK-012 [P1] The section matches the file's house style: intro sentence, three-column table in fixed order, closing routing/boundary note — confirmed
  - **Acceptance**: a reader cannot tell the new section from the existing sections by shape alone — met; intro 152, table 154-160, note 162-164 mirror §2-8A
- [x] CHK-013 [P1] Numbering is additive: `## 8B.` (zero-renumber, recommended) or `## 9.` with the routing summary bumped to `## 10.` — no other section number changes — `## 8B.` chosen
  - **Acceptance**: every existing probe-section number (2-8, 8A) is unchanged — met; §8A still line 138, §9 still line 168, `git diff` shows 0 deletions

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE (advisory review): all five probes are present with a pass/fail/skip verdict and an evidence slot — confirmed by reading the section
  - **Acceptance**: a review pass confirms low-power, Save-Data, CPU-throttle, offline-to-online, and slow media each record a verdict and evidence — met; all five rows carry the verdict/evidence shape
- [x] CHK-021 [P0] The skip path is honest: a probe that cannot be run on the available evidence is labeled inferred (the file's §1 rule), not dropped — confirmed
  - **Acceptance**: the verdict convention defines `skip` as an inferred finding with a stated confirmation path — met; line 162 states skipped probes stay inferred and name the confirming evidence
- [x] CHK-022 [P1] BOUNDARY: the section routes measurable evidence to `accessibility_performance.md` §Performance rather than restating its thresholds — confirmed
  - **Acceptance**: no Core Web Vitals / rendering / motion-performance thresholds are copied into the section; they are routed — met; line 164 routes load/layout-shift/long-task/latency/motion evidence out
- [x] CHK-023 [P1] BOUNDARY: the offline-to-online probe covers the recovery path, distinct from the existing §3 offline-failure row — confirmed
  - **Acceptance**: the new probe reads as "does it come back cleanly", not a restatement of the §3 spinner-forever / lost-input row — met; line 164 states the recovery-vs-failure distinction explicitly

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — classed matrix/evidence
  - **Acceptance**: matrix/evidence — this phase adds one audit-matrix section of five probes and produces no code-defect findings — met
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — instance-only proven
  - **Acceptance**: the change is one section in one file; an evergreen grep over the new section finds no IDs, and no sibling matrix needs the same edit — met; §8B grep clean, no sibling matrix carries device probes to mirror
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — completed
  - **Acceptance**: the only consumer of the matrix is the auditor who walks it; no script, registry, or checker reads `hardening_edge_cases.md`, so nothing downstream changes — met; it is not a hubRoute scenario source either
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — N/A
  - **Acceptance**: not applicable — no parser, path handling, or redaction is introduced; this is a reference-doc section with no executable surface — met
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — listed
  - **Acceptance**: the section's axis is the device/constraint condition; row count is five (low-power, Save-Data, CPU-throttle, offline-to-online, slow media), each with a verdict and evidence slot — met
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — N/A
  - **Acceptance**: not applicable; the section adds no code and reads no process-wide state — met
- [x] CHK-FIX-007 [P1] Evidence is pinned to the delivered files, not a moving branch-relative range. — pinned
  - **Acceptance**: evidence pins to the `Device And Constrained Context` section block in `hardening_edge_cases.md`, not to a line range — met; evidence cites the §8B block

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Integrity: the section is reference-only — it names probes, symptoms, findings, and owners; it does not implement hardening or copy logic out of any owner doc — confirmed
  - **Acceptance**: the closing note keeps the audit/implement boundary (the audit names the gap and the owner; `sk-code` implements) — met; line 164 routes implementation to `sk-code`
- [x] CHK-031 [P1] No false trust signal: the acceptance is honestly an advisory review, not a checker run — the matrix is a walked reference with no gate over it — confirmed
  - **Acceptance**: nothing in the section or the plan implies an automated check fires on a constrained-context failure — met; no checker exists or is implied, the probe bites by an auditor filing a finding

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: no spec/packet/phase IDs or `specs/` paths embedded in the authored section — confirmed
  - **Acceptance**: an evergreen grep over the new section returns no `specs/` paths and no packet-phase IDs — only evergreen owner-doc references — met; grep of §8B is clean
- [x] CHK-041 [P1] spec/plan/tasks/checklist synchronized on the five probes, the pass/fail/skip + evidence shape, and the advisory-review acceptance — confirmed
  - **Acceptance**: all four docs name the same five probes and the same recording shape and acceptance — met; spec §3-4, plan §3, tasks, and this checklist all name the same five probes and verdict/evidence shape
- [x] CHK-042 [P2] Optional honest-metadata touches recorded if taken: frontmatter `description` extended, `version` bumped `1.0.0.0` to `1.1.0.0`, one routing-summary bullet added — deferred by decision
  - **Acceptance**: if applied, each touch stays inside `hardening_edge_cases.md` and is reflected in the diff; if deferred, the core deliverable still stands — met via the deferred branch; touches not applied (live `version` stays 1.0.0.0), core §8B section stands without them, diff kept maximally additive

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Only `hardening_edge_cases.md` is modified by this phase; no other sk-design file is touched by it — confirmed
  - **Acceptance**: `git status --porcelain` lists that one file for this phase's change under `.opencode/skills/sk-design/`; the sibling `audit_report_template.md` / `scripts/` entries belong to a different phase — met
- [x] CHK-051 [P1] No temp/scratch files left outside the scratchpad — confirmed
  - **Acceptance**: any review fixtures live only in the session scratchpad; the working tree carries only the edited reference file — met; no scratch files added by this phase

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 (deferred branch — acceptance satisfied) |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent against the delivered `## 8B` section in `hardening_edge_cases.md`

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
