# Deep Review Report: 153-frontmatter-versioning

**Review Target:** `.opencode/specs/skilled-agent-orchestration/118-frontmatter-versioning` (Phase Parent, Level 2)
**Review Mode:** spec-folder
**Session:** fanout-deepseek-1782210787185-rpc3p9
**Lineage:** new, generation 1
**Completed:** 2026-06-23T00:05:00Z
**Verdict:** **CONDITIONAL** — 6 P1 findings remain; no P0s
**hasAdvisories:** true (16 P2 advisories)
**Stop Reason:** maxIterationsReached (5 of 5)
**Iterations:** 5 | **Dimensions:** 4/4 covered

---

## 1. Executive Summary

This review assessed the Phase Parent spec for Skill Frontmatter Versioning (`153-frontmatter-versioning`), which coordinates 5 child phases retroactively versioning ~2,500 skill-doc frontmatter files. The implementations are complete and verified (all 5 phases report green verification checks), but the **spec documentation has systematic drift** from implementation reality.

**Overall Assessment:** The work is done and verified, but the spec artifacts misrepresent the state of completion. Six P1 findings document this drift — from scope numbers that don't match census counts, to continuity blocks still at 0% completion, to graph metadata stuck at "planned" with a null active-child pointer. Anyone auditing or resuming this spec would conclude work was incomplete.

**Summary by dimension:**
| Dimension | Verdict | P0 | P1 | P2 |
|-----------|---------|----|----|-----|
| D1 Correctness | CONDITIONAL | 0 | 2 | 4 |
| D2 Security | PASS | 0 | 0 | 3 |
| D3 Traceability | CONDITIONAL | 0 | 2 | 4 |
| D4 Maintainability | CONDITIONAL | 0 | 2 | 5 (incl. cross-dim) |

**Active counts:** 0 P0 | 6 P1 | 16 P2

---

## 2. Planning Trigger

**Verdict is CONDITIONAL** → routes to `/speckit:plan` for remediation. The 6 P1 findings do not block release (no correctness failures, no security vulnerabilities), but they degrade the spec's reliability as a source of truth. The remediation is compact — it's documentation reconciliation work:
1. Update scope numbers in parent spec.md (F001, F002)
2. Regenerate continuity blocks for all child phases (F010, F018, F019)
3. Regenerate graph-metadata.json and set last_active_child_id (F012)
4. Either populate or explicitly retire the unfilled plan.md/tasks.md templates (F016, F017)

---

## 3. Active Finding Registry

### P1 Findings (6 active)

| ID | Severity | Dimension | Title | File:Line | First/Last Seen |
|----|----------|-----------|-------|-----------|-----------------|
| **F001** | P1 | correctness | Parent spec scope estimate (~2,500) overstates actual corpus by ~278 files (2,222) | spec.md:74 | 1/1 |
| **F002** | P1 | correctness | Core-doc count ~436 in scope table underestimates actual 469 (33 file undercount) | spec.md:103 | 1/1 |
| **F010** | P1 | traceability | Three child-phase specs report completion_pct: 0 in _memory.continuity but Status: Complete | 001-versioning-standard/spec.md:28 | 3/3 |
| **F012** | P1 | traceability | graph-metadata.json derived.status is "planned" and last_active_child_id null despite all phases complete | graph-metadata.json:41 | 3/3 |
| **F016** | P1 | maintainability | All five child-phase plan.md files are unfilled template scaffolds | 001-versioning-standard/plan.md:3 | 4/4 |
| **F017** | P1 | maintainability | All five child-phase tasks.md files are unfilled template scaffolds | 001-versioning-standard/tasks.md:53 | 4/4 |

### P2 Findings (16 active — advisory)

| ID | Severity | Dimension | Title |
|----|----------|-----------|-------|
| F003 | P2 | correctness | Phase 4 leaf estimate ~1,700 vs actual 1,753 |
| F004 | P2 | correctness | Continuity session_dedup fingerprint is all-zero sha256 |
| F005 | P2 | correctness | graph-metadata last_active_child_id not verified |
| F006 | P2 | correctness | Phase map doesn't document 4 pre-existing 3-part SKILL.md files |
| F007 | P2 | security | Shell wrapper dispatches without verifying node/mjs existence |
| F008 | P2 | security | 64MB maxBuffer for git log could cause crash on pathological histories |
| F009 | P2 | security | SKILL.md reconcile auto-updates version without --update flag |
| F011 | P2 | traceability | Phase 2 spec references frontmatter-version.ts but implementation is .mjs |
| F013 | P2 | traceability | Three child-phase specs carry scaffolding recent_action text |
| F014 | P2 | traceability | All child-phase session_dedup fingerprints are all-zero sha256 |
| F015 | P2 | traceability | Standard doc W = min(realEditCount, 99) confirmed in code |
| F018 | P2 | maintainability | Phase 3 spec _memory.continuity stale (completion_pct: 0) |
| F019 | P2 | maintainability | Phase 4 spec _memory.continuity stale (completion_pct: 0) |
| F020 | P2 | maintainability | Parent description.json and graph-metadata never regenerated post-completion |
| F021 | P2 | maintainability | Spec executionModel implies MiMo-in-the-loop edits but engine was sole writer |
| F022 | P2 | maintainability | Cross-phase handoff criteria unenforceable without populated plan/tasks |

---

## 4. Remediation Workstreams

### Lane 1: Spec Scope Accuracy (F001, F002, F003)
- **Constituent findings:** F001, F002, F003
- **Action:** Update spec.md lines 74, 103, and 120 with actual census counts from the engine manifest and Phase 3/4 implementation summaries.
- **Order:** First — these are the most visible inaccuracies.
- **Effort:** ~5 minutes (numbers already known from impl-summaries).

### Lane 2: Continuity + Metadata Refresh (F004, F005, F010, F012, F013, F014, F018, F019, F020)
- **Constituent findings:** F004, F005, F010, F012, F013, F014, F018, F019, F020
- **Action:** Run `generate-context.js` on the parent spec folder to regenerate description.json and graph-metadata.json. Update all child-phase spec frontmatter `_memory.continuity` blocks to reflect actual completion state.
- **Order:** Second — updates the metadata that resume/continuity depend on.
- **Effort:** ~15 minutes (automated regeneration + manual continuity block edits).

### Lane 3: Planning Artifacts (F016, F017, F022)
- **Constituent findings:** F016, F017, F022
- **Action:** Either populate plan.md and tasks.md for all 5 child phases with brief retrospective summaries, or delete the template files and update the Phase Parent CONTENT DISCIPLINE to clarify that plan.md/tasks.md are optional when impl-summary.md serves their function.
- **Order:** Third — requires a policy decision.
- **Effort:** ~20 minutes (depending on approach chosen).

### Lane 4: Code/Security Advisories (F007, F008, F009, F011, F021)
- **Constituent findings:** F007, F008, F009, F011, F021
- **Action:** Minor spec and code tweaks: add existence check to shell wrapper, document the maxBuffer ceiling, add warning on reconcile asymmetry, fix stale key_files reference, clarify execution model.
- **Order:** Last — lowest blast radius, advisory only.
- **Effort:** ~15 minutes.

---

## 5. Spec Seed

Minimal spec delta for remediation:

1. **Parent spec.md §3 Scope (spec.md:74,103,120):** Replace "~2,500" with "2,222", "~436 files" with "469 files", "~1,700 per-feature leaves" with "1,753 docs".
2. **Parent spec.md §Execution Model (spec.md:65):** Clarify that MiMo was read-only audit; deterministic engine is sole writer.
3. **All child phase spec.md frontmatter:** Update `_memory.continuity` fields to reflect actual completion (completion_pct: 100, recent_action reflects real work, session_dedup fingerprint set).

---

## 6. Plan Seed

Initial task breakdown for a remediation sprint:

- **T001:** Update scope numbers in parent spec.md (F001, F002, F003) — 5 min
- **T002:** Run `generate-context.js` on parent spec folder — 2 min
- **T003:** Update child-phase spec frontmatter continuity blocks (F010, F018, F019) — 10 min
- **T004:** Regenerate graph-metadata.json with correct status + active child pointer (F012) — 3 min
- **T005:** Resolve plan.md/tasks.md template status (populate or retire) (F016, F017) — 20 min
- **T006:** Fix shell wrapper existence check (F007) — 2 min
- **T007:** Update Phase 2 spec key_files reference (F011) — 1 min
- **T008:** Clarify execution model wording in parent spec (F021) — 2 min

---

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core (hard) | partial | Parent scope claims don't match implementation counts. Engine code correctly implements the versioning standard. |
| `checklist_evidence` | core (hard) | notApplicable | Phase Parent mode forbids checklist.md at parent level. Child phases 003-004 (Level 1) also don't require checklists. |
| `feature_catalog_code` | overlay (advisory) | notApplicable | No feature catalog for this spec folder. |
| `playbook_capability` | overlay (advisory) | notApplicable | No playbook for this spec folder. |

---

## 8. Deferred Items

| ID | Severity | Reason for Deferral |
|----|----------|---------------------|
| F006 | P2 | Phase map omission of 3-part file normalization — minor doc addition |
| F008 | P2 | maxBuffer ceiling — no real corpus file approaches 64MB; monitor rather than fix |
| F009 | P2 | Reconcile asymmetry — documented design; clarify in help text if needed |
| F015 | P2 | Confirmed positive traceability (engine correctly implements standard); informational |

---

## 9. Audit Appendix

### Iteration Summary

| # | Dimension | P0 | P1 | P2 | Ratio | Verdict | Status |
|---|-----------|----|----|----|-------|---------|--------|
| 1 | Correctness | 0 | 2 | 4 | 0.70 | CONDITIONAL | complete |
| 2 | Security | 0 | 0 | 3 | 0.06 | PASS | complete |
| 3 | Traceability | 0 | 2 | 4 | 1.00 | CONDITIONAL | complete |
| 4 | Maintainability | 0 | 2 | 3 | 0.81 | CONDITIONAL | complete |
| 5 | Cross-dimension | 0 | 0 | 2 | 0.13 | CONDITIONAL | complete |

### Convergence Signal Replay

- **Stop reason:** maxIterationsReached (5 of 5)
- **Dimensions covered:** 4/4 (correctness, security, traceability, maintainability)
- **Active P0:** 0 (no P0 findings across all iterations)
- **Active P1:** 6 (F001, F002, F010, F012, F016, F017)
- **Active P2:** 16
- **Rolling average (last 2):** (0.81 + 0.13) / 2 = 0.47 > 0.08 → would vote CONTINUE
- **MAD noise floor:** Ratios [0.70, 0.06, 1.00, 0.81, 0.13]; median=0.70; MAD-derived noise floor ~0.40; latest 0.13 < 0.40 → would vote STOP
- **Dimension coverage:** 4/4 = 1.0 → votes STOP
- **Composite score:** (0.30×0 + 0.25×1 + 0.45×1) / 1.0 = 0.70 >= 0.60 → would pass composite convergence if maxIterations not hit

### Verification Status

- [x] All 5 iteration files exist (iteration-001.md through iteration-005.md)
- [x] JSONL state log contains config + 5 iteration records
- [x] Findings registry reconciled against JSONL
- [x] Strategy file updated through all dimensions
- [x] Dashboard generated
- [x] No P0 findings — verdict cannot be FAIL
- [x] P1 findings present — verdict is CONDITIONAL
- [x] All dimensional coverage complete
- [x] Claim adjudication packets present for all P1 findings
