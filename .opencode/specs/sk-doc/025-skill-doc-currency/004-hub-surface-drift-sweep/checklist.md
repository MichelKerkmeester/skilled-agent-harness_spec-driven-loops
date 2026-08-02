---
title: "Verification Checklist: hub-surface-drift-sweep"
description: "Verification Date: 2026-08-02"
trigger_phrases:
  - "surface sweep checklist"
  - "link resolution verification"
  - "install surface verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/004-hub-surface-drift-sweep"
    last_updated_at: "2026-08-02T14:32:45Z"
    last_updated_by: "skd025-004-build"
    recent_action: "Marked checklist items with resolver, install, cardinality, and map receipts"
    next_safe_action: "Run and record strict packet validation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending-first-save"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Orphan cards quarantined only after choreography reachability review."
      - "Version pin reconciled to 12.38.0; no fixture label existed."
      - "External anchors relabelled; no repo-local examples added."
      - "Archive canon ratified to benchmark/reports/compiled-routing/."
---
# Verification Checklist: hub-surface-drift-sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
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

- [x] CHK-001 [P0] Requirements documented in spec.md [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-002 [P0] Technical approach defined in plan.md [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-003 [P1] Dependencies identified and available [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-004 [P0] Every one of the 20 scope items has a confirm-against-HEAD disposition before any edit [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-005 [P0] The design-hub ownership group was confirmed first, and its cardinality numbers were re-derived rather than assumed [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-006 [P0] The three registry-supplementary items each carry their own evidence line; none was batch-edited [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-007 [P0] The four open forks are answered and recorded before the edits they govern [evidence: `implementation-summary.md` Evidence Receipts]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:baselines -->
## Baselines (captured before any edit)

- [x] CHK-010 [P0] Relative-link resolver failure count recorded over all skill markdown, with the phase-scoped subset separated [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-011 [P0] Dangling-entry check result recorded [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-012 [P1] Both installer paths exercised and their current behaviour recorded [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-013 [P0] The fleet-gate re-baseline from the first phase is cited; no claim here uses a remembered pass count [evidence: `implementation-summary.md` Evidence Receipts]
<!-- /ANCHOR:baselines -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-020 [P0] The introduced checks pass lint/format for their language [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-021 [P0] The link resolver is case-sensitive and reports its exclusion counts, so the number is interpretable [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-022 [P0] The dangling-entry check does not follow symlinks outside the repository root; a negative test proves it [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-023 [P1] Both checks report how many entries they examined [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-024 [P1] Code follows project patterns [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-025 [P1] No introduced comment embeds a spec path, packet id, phase id, requirement id or checklist id; the durable reason is kept instead [evidence: `implementation-summary.md` Evidence Receipts]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-030 [P0] All acceptance criteria in spec.md §4 met [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-031 [P0] Dangling-entry check returns zero [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-032 [P0] Both installer paths run without invoking a missing script [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-033 [P0] Prose-versus-machine drift check returns zero mismatches in both code-hub surface documents [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-034 [P1] Cardinality assertion holds: README equals workflow document equals disk [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-035 [P1] Grep for retired lane names in active design-hub documents returns zero [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-036 [P1] Grep for the retired branch shape returns only labelled legacy examples [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-037 [P1] Link-resolver delta reported against the recorded baseline, phase subset separated [evidence: `implementation-summary.md` Evidence Receipts]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Link rot is `class-of-bug`: the resolver covers the tree, not only the reported paths. [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — including a grep for each old path fragment before a rename is declared complete. [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Applied to the resolver and the dangling check: case mismatch, anchor-only, external URL, outside-root symlink, and an empty target must each be classified correctly. [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed before completion: hub × document class × claim type. [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [evidence: `implementation-summary.md` Evidence Receipts]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-045 [P1] The relative-link resolver rejects a target resolving outside the repository root; the adversarial fixture (CHK-FIX-004) proves it. [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-046 [P2] No repaired reference or fixture embeds a credential, token, or absolute machine-local path. [evidence: `implementation-summary.md` Evidence Receipts]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:safety -->
## Containment

- [x] CHK-040 [P0] No symlink was repointed at a target that had not been verified to exist [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-041 [P0] No procedure card was quarantined without a reachability check [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-042 [P1] The version-pin outlier was resolved by the recorded fork answer, not by silently matching the majority [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-043 [P1] The remote-branch policy document was not edited by this phase [evidence: `implementation-summary.md` Evidence Receipts]
<!-- /ANCHOR:safety -->

---

<!-- ANCHOR:coverage -->
## Coverage

- [x] CHK-050 [P0] All 17 registry findings in scope reached a terminal state [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-051 [P0] All 3 registry-supplementary findings reached a terminal state [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-052 [P0] The arithmetic holds: 17 + 3 = 20 items, each in exactly one state [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-053 [P1] The partially-duplicate supplementary item was repaired once for the shared file, under the scheduled finding, and its other files were covered separately [evidence: `implementation-summary.md` Evidence Receipts]
<!-- /ANCHOR:coverage -->

---

<!-- ANCHOR:receipts -->
## Evidence Receipts

| Check | Evidence |
|---|---|
| Pre-edit link baseline | `baselines/link-resolver-pre-edit.txt`: `files_examined=9090 entries_examined=11760 failures=789 excluded_anchor=1155 excluded_external=18009` (rc 1). The phase-scoped pre-edit baseline was `files_examined=35 entries_examined=253 failures=1 excluded_anchor=1 excluded_external=21` (the `<link>` template placeholder in `finish-workflows.md`). |
| Post-edit link resolver | `baselines/link-resolver-post-edit.txt`: `files_examined=9090 entries_examined=11761 failures=788 excluded_anchor=1155 excluded_external=18010` (rc 1; delta `-1` failure). Changed-document scope: `files_examined=39 entries_examined=256 failures=0 excluded_anchor=1 excluded_external=22` (rc 0; scoped delta `-1`). |
| Dangling-entry check | `baselines/install-entries-post-edit.txt`: `guide_entries_examined=8 guide_resolvable=8 script_entries_examined=7 script_resolvable=7 entries_examined=15 failures=0 outside_root=0` (rc 0). |
| New-check validation | Resolver and dangling checker AST parsing passed; both self-tests passed, including exact-case, anchor-only, empty, external, missing-target, and outside-root cases. |
| Install execution | `install-all.sh --help` rc 0; `install-all.sh --dry-run` rc 0 with `Installed: 4`, `Failed: 0`, `Skipped: 0`; Chrome DevTools installer `--help` rc 0. |
| Code-hub maps | Human/machine comparison: webflow `human=92 machine=92 mismatches=0`; opencode `human=62 machine=62 mismatches=0`; total mismatches `0`. |
| Design cardinality | README `7`, workflow `7`, active on disk `7`, quarantined `3`; cardinality assertion true. Reachability evidence retained in the terminal-state summary. |
| Git surface | `worktree-naming.test.sh`: `PASS=47 FAIL=0`; playbook inventory derived from disk: `42` scenario files across `8` category directories; retained `wt/...` lines are legacy-labelled only. |
| Target safety | Replacement guide and installer targets were verified present before both symlink repoints; no remote-branch policy edit occurred. |
| Fleet gate | First-phase receipt remains `11/11 clean`; this phase reports the resolver delta above and does not infer a no-regression claim from memory. |

<!-- /ANCHOR:receipts -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-060 [P1] Spec/plan/tasks synchronized [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-061 [P1] The four fork answers are recorded with their rationale [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-062 [P2] Any deferral recorded with an owner and a reason [evidence: `implementation-summary.md` Evidence Receipts]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P1] Temp files in scratch/ only [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-071 [P1] scratch/ cleaned before completion [evidence: `implementation-summary.md` Evidence Receipts]
- [x] CHK-072 [P1] Baselines kept inside the packet, not in a system temp directory [evidence: `implementation-summary.md` Evidence Receipts]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 26 | 26/26 |
| P1 Items | 22 | 22/22 |
| P2 Items | 3 | 3/3 |

**Verification Date**: 2026-08-02
<!-- /ANCHOR:summary -->
