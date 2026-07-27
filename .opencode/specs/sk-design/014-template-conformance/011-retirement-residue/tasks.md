---
title: "Tasks: Close retirement residue + finish interrupted design-interface leaf docs"
description: "Task breakdown for the two independent tracks: fix five vocabulary-residue sites, and verify-then-reconcile 006-009's leaf documentation."
trigger_phrases:
  - "retirement residue tasks"
  - "audit foundations vocabulary cleanup tasks"
  - "design-interface leaf docs finish tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/011-retirement-residue"
    last_updated_at: "2026-07-27T20:00:00Z"
    last_updated_by: "worker-session"
    recent_action: "Both tracks complete except T001 (sibling scope, design-md-generator/)"
    next_safe_action: "None — closed except the T001 handoff note"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/014-template-conformance/002-design-interface/006-scripts/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worker-session"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Close retirement residue + finish interrupted design-interface leaf docs
<!-- SPECKIT_LEVEL: 2 -->

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
## Phase 1: Setup [Track A — vocabulary residue, ~1h]

- [B] T001 [P] Re-confirm + fix procedure-card inventory (`design-md-generator/SKILL.md:246`) [15m] — **BLOCKED, not this session's scope.** Re-confirmed still present (`foundations`/`motion`/`audit` still named at lines 60, 246, 315) but `design-md-generator/` is explicitly a sibling worker's territory for this session; owner must apply this fix.
- [x] T002 [P] Re-confirm + fix `foundations`/`audit` test cases (`compiled-routing/.../009-parent-hub-rollout/006-sk-design/fixtures/canary-cases.v1.json`) [15m] — directory renumbered to `009-parent-hub-rollout` since spec authoring; deleted the 5 cases whose whole premise was a retired mode (`single-foundations`, `single-motion`, `single-audit`, `ui-build-authored-bundle`, `interface-motion-separate-bundle`) rather than rewriting them, since `foundations`/`motion`/`audit` no longer exist as separate registry modes; verified via a direct `loadSnapshot()`/`typedGold()` probe (8 remaining cases evaluate cleanly) and the vitest suite (unchanged 3 pre-existing, unrelated failures / 31 passed, before and after)
- [x] T003 [P] Re-confirm + fix sk-design row (`.opencode/install-guides/README.md:894`) [10m] — updated to 2 workflow modes + transport
- [x] T004 [P] Re-confirm + fix `invocation_aliases` (`sk-doc/create-command/assets/command-contract.json:81`) [10m] — dropped `/interface:foundations`, `/interface:audit`
- [x] T005 [P] Re-confirm + fix mode-count claim (`manual-testing-playbook/shared-reference-base/shared-base-not-workflow.md:34`) [10m] — "five workflow modes" → "two workflow modes... plus the design-mcp-open-design transport"
- [x] T005a [P] New site found, not in original inventory: `.opencode/commands/README.txt` still listed 3 interface commands including retired `/interface:motion` [15m] — fixed 3 spots (overview table, structure tree, Interface Commands table)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Track B — leaf verification, ~2h]

- [x] T006 Read `006-scripts/spec.md` in full; inspect `design-interface/scripts/` on disk (`002-design-interface/006-scripts/spec.md`) [20m] — found and fixed a real `sys.path` bug (both checkers threw `ModuleNotFoundError`) beyond the spec's audit-only scope
- [x] T007 Reconcile `006-scripts/checklist.md` + `implementation-summary.md` to verified state (`006-scripts/`) [15m]
- [x] T008 Read `007-feature-catalog/spec.md` in full; inspect `design-interface/feature-catalog/` on disk (`007-feature-catalog/spec.md`) [20m] — found the motion merge added 4 new files repeating the same underscore-filename typo the spec's original 10-file fix already resolved; fixed all 4
- [x] T009 Reconcile `007-feature-catalog/checklist.md` + `implementation-summary.md` to verified state (`007-feature-catalog/`) [15m]
- [x] T010 Read `008-manual-testing-playbook/spec.md` in full; inspect `design-interface/manual-testing-playbook/` on disk (`008-manual-testing-playbook/spec.md`) [20m] — confirmed root cause via `git show --stat b217d74b819`; **disproved** the `foundations-*` residue hypothesis (legitimate, documented naming convention); found + fixed a stale scenario count and one dead cross-reference; found (did not fix) an 18-file 9-column-format gap
- [x] T011 Reconcile `008-manual-testing-playbook/checklist.md` + `implementation-summary.md` to verified state (`008-manual-testing-playbook/`) [15m]
- [x] T012 Read `009-changelog/spec.md` in full; inspect `design-interface/changelog/` on disk (`009-changelog/spec.md`) [20m] — applied "keep as historical record" disposition for `v1.0.0.0-foundations.md`; found a legitimate 3rd file added by sibling `001-apache-devendoring`
- [x] T013 Reconcile `009-changelog/checklist.md` + `implementation-summary.md` to verified state (`009-changelog/`) [15m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [~20m]

- [x] T014 `rg -n "foundations|audit"` across all five Track A sites returns nothing (no path) [10m] — clean on 4/5 sites; `design-md-generator/SKILL.md` intentionally left unfixed (T001, sibling scope)
- [x] T015 Cross-read each of `006-009`'s checklist vs. implementation-summary for consistency (no path) [10m]
- [x] T016 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/014-template-conformance/011-retirement-residue --strict` exits 0 (no path) [5m]
- [x] T017 Mark this packet's own checklist.md items with evidence (`checklist.md`) [10m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` — T001 remains `[B]` blocked, out of session scope by design (sibling boundary), not a failure
- [x] No unexplained `[B]` blocked tasks remaining — the one `[B]` (T001) has a documented reason
- [x] No Track B checklist mark is unsupported by real evidence
- [x] `design-motion/`-internal residue explicitly deferred, not touched — moot: `010-motion-merge` has since landed and the `design-motion/` directory no longer exists at all
- [x] Checklist.md fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
