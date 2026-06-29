---
title: "Tasks: Device And Constrained-Context Probes"
description: "Ordered implementer items to add a Device And Constrained Context section to design-audit/references/hardening_edge_cases.md (five probes: low-power, Save-Data, CPU-throttle, offline-to-online, slow media) with a pass/fail/skip + evidence convention, plus house-style, boundary, evergreen, and scope verification."
trigger_phrases:
  - "device constrained context probes tasks"
  - "hardening matrix device probes design build"
  - "low-power save-data throttle offline slow-media probes"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/006-device-constrained-probes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked all tasks complete; five-probe 8B section verified additive and evergreen"
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
      - "Whether to apply the optional metadata touches resolved to defer — kept the diff maximally additive at 18 insertions, 0 modifications"
---
# Tasks: Device And Constrained-Context Probes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Confirm targets, boundary, house style]

- [x] T001 Re-read the target matrix to confirm the house style each section uses (intro sentence, three-column probe table `Probe | Expected symptom when unhardened | Finding to file`, closing routing note) and the `8A` letter-suffix insertion precedent (`.opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md`) [10m] — confirmed; §8A at line 138 is the letter-suffix precedent reused
- [x] T002 Re-read the boundary owners so the new section routes rather than duplicates: `accessibility_performance.md` §3-5 (performance measurement), the existing §3 offline-failure row, `evidence_capture.md` (evidence), `audit_contract.md` (severity) (`.opencode/skills/sk-design/design-audit/references/`) [15m] — confirmed; §3 owns offline failure, performance measurement owned by `accessibility_performance.md`

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Author Device And Constrained Context section]

- [x] T003 Insert the new section immediately before `## 9. ROUTING SUMMARY`, numbered `## 8B. DEVICE AND CONSTRAINED CONTEXT` (recommended zero-renumber; alternative is `## 9.` with the routing summary bumped to `## 10.`) with a one-line intro that names the constrained-context conditions the audit must walk (`hardening_edge_cases.md`) [15m] — inserted at line 150 between §8A and §9; zero-renumber path taken
- [x] T004 Author the three-column probe table with one row per required probe, in the file's fixed order: low-power / battery-saver (forces reduced motion, may pause autoplay), `Save-Data` / data-saver, CPU-throttle / low-end device, offline-to-online recovery, slow media; populate symptom + finding from the plan §3 grounded content (`hardening_edge_cases.md`) [30m] — all five rows authored at lines 156-160 in fixed order
- [x] T005 Add the verdict-and-evidence convention so each probe is recorded `pass` (degrades gracefully) / `fail` (symptom → file the finding) / `skip` (could not run → inferred per the file's §1 rule), with evidence captured per `evidence_capture.md` (`hardening_edge_cases.md`) [15m] — every finding cell carries `verdict: pass | fail | skip` plus an `evidence:` slot; convention line at 162
- [x] T006 Add the closing routing/boundary note: route measurable evidence to `accessibility_performance.md` §Performance, reduced-motion to accessibility, layout/logical-property to `foundations`, implementation to `sk-code`; state that the offline-to-online probe covers recovery (not the §3 offline-failure path) so the two do not overlap (`hardening_edge_cases.md`) [15m] — routing/boundary note at line 164 names the recovery-vs-failure distinction
- [x] T007 [P] Optional honest-metadata touches inside the same file, flagged for the orchestrator: append "device and constrained-context resilience" to the frontmatter `description`; bump `version` `1.0.0.0` to `1.1.0.0`; add one bullet to `## 9 ROUTING SUMMARY` routing constrained-context findings (`hardening_edge_cases.md`) [10m] — evaluated and deferred; not applied (version stays 1.0.0.0), kept the diff maximally additive, core section stands without them

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Acceptance (advisory review)
- [x] T008 Read the section and confirm all five probes are present — low-power, Save-Data, CPU-throttle, offline-to-online, slow media — each with a probe, an unhardened symptom, and a finding to file [10m] — confirmed; all five rows present with the three columns populated
- [x] T009 Confirm each probe carries the pass/fail/skip verdict and an evidence slot per the convention; a reviewer can tell a skipped probe was labeled inferred, not dropped silently [10m] — confirmed; line 162 defines skip as an inferred finding naming the confirming evidence

### Consistency and boundary
- [x] T010 House-style check: the section has an intro sentence, the three-column table in fixed order, and a closing routing note — the same shape as §2-8A [10m] — confirmed; intro 152, table 154-160, note 162-164 match §2-8A shape
- [x] T011 Boundary check: the section routes measurable evidence to `accessibility_performance.md` rather than restating its thresholds, and the offline-to-online probe covers recovery rather than repeating the §3 offline-failure row [10m] — confirmed; no thresholds copied in, recovery-vs-failure distinction stated at line 164

### Audits
- [x] T012 Evergreen audit: grep the new section for spec/packet/phase IDs and `specs/` paths; confirm none present — only evergreen owner-doc references [5m] — grep of §8B returns no IDs or `specs/` paths
- [x] T013 Scope-lock audit: confirm only `hardening_edge_cases.md` is in the diff and the change is the inserted section plus, at most, the flagged optional metadata touches — no existing probe section rewritten [5m] — `git diff --stat` shows 18 insertions, 0 deletions on the one file; sibling edits belong to a different phase

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All five probes present with a verdict and evidence slot (advisory review passes)
- [x] Section matches the matrix house style and holds the performance/offline boundary
- [x] Additive only — no existing probe section rewritten
- [x] Evergreen + scope-lock audits pass
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Target file**: `.opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md`
- **Boundary owners**: `accessibility_performance.md` (performance), `evidence_capture.md` (evidence), `audit_contract.md` (severity)

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates, explicit advisory-review + house-style + boundary + evergreen verification tasks)
-->
