---
title: "Tasks: Phase 6: verification-and-closeout"
description: "The four closeout edits that settled the tree, the one honest canary re-pin and four refreshed topology counts, the whole-gate sweep with its verbatim results, and the three findings named as out of scope rather than absorbed."
trigger_phrases:
  - "final state sweep tasks"
  - "canary re-pin after red run"
  - "changelog rewrite closeout"
  - "out of scope findings named"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: verification-and-closeout

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Enrol both playbook roots in `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt`, so both packages' clean state is enforced rather than incidental
- [x] T002 [P] Add a playbook row to the related-documents table and two playbook gates to the verification table in `.opencode/skills/sk-doc/sk-create-frontmatter/README.md`
- [x] T003 Rewrite `.opencode/skills/sk-doc/sk-create-frontmatter/changelog/v1.0.0.0.md`. The original entry described an empty scaffold and stated the packet held no content and was not registered, both of which stopped being true two phases later. Since nothing was released between phases, the single first-version entry now describes the mode as it ships and records the scaffold-then-fill ordering as a note (plan.md ADR-001)
- [x] T004 [P] Remove two duplicated placeholder rows from the parent `spec.md` phase map: a second row for phase 7 reading `[Phase 7 scope]` and a second handoff row reading `[Criteria TBD] | [Verification TBD]`. Both were template residue from when phase 7 was appended
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Re-pin the canary digest for `packets/sk-create-frontmatter/SKILL.md` after a voice pass over the mode's own prose, and only after a run that proved the pin still fires. This is the third re-pin across the packet: the first named `packets/sk-create-feature-catalog/SKILL.md` and `packets/sk-create-manual-testing-playbook/SKILL.md`, which phase 003 had edited, and the second named the hub `SKILL.md` after the packet-count correction (REQ-002)
- [x] T006 Refresh the four live-topology counts the same harness carries, which its own code comment instructs on registering a mode: destinations, projection rows and distinct identity tuples 14 to 15, distinct packets 13 to 14
- [x] T007 Confirm the invariant those counts encode is unchanged: the gap between them, that modes outnumber packets because one packet backs two modes, is still 1
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirm all five hubs are `compiled-serving`: cli-external-orchestration, mcp-tooling, sk-code, sk-doc, system-deep-loop, and that `move-simulation OK: all 5 hubs resolve; 0 reads under .opencode/specs` (REQ-001, SC-001)
- [x] T009 Run the five parent-hub canaries: all exit 0 (REQ-001, SC-001)
- [x] T010 Run the five `parent-skill-check` gates: each reports `OK: parent-skill-check — all hard invariants passed, 0 warnings` at exit 0 (REQ-001, SC-001)
- [x] T011 [P] Run the skill-root metadata CI: `checked=14 passed=14 failed=0 fixed=0` (REQ-001)
- [x] T012 [P] Run the packaging gate on the new mode: `Result: PASS` (REQ-001)
- [x] T013 Run `d5-connectivity`: `sk-create-frontmatter` score=100 gateFailed=false stageTwoRouted=3 issues=0; `sk-create-with-human-voice` score=100 gateFailed=false stageTwoRouted=5 issues=0; the hub itself 0 issues (REQ-001, SC-001)
- [x] T014 Check both playbook packages from the final tree: both `PASS ... violations=0 warnings=0`, and both visible to the loader at 11 and 9 scenarios with zero warnings. Playbook routing-gold topology reports `verdict=PASS valid=32 blocked=0 unenrolled=0 total=32` (REQ-001)
- [x] T015 [P] Run the remaining fleet checks: link integrity across the hub at `failures=112`, down from a pre-packet baseline of 113 and with frontmatter-related failures at zero; the old-path scan, where only three frozen benchmark report bundles and one out-of-scope advisor playbook line survive; the alias table at 5 entries with an empty `git diff`; `agent-mirror-sync: 12 agent(s) checked — all mirrors in sync — OK`; and the corpus frontmatter version gate at `[gate] 310 files | ok=309 skip-no-frontmatter=1` (REQ-001)
- [x] T016 Run the benchmark suite: `Test Files 54 passed (54)`, `Tests 683 passed (683)`, unchanged from the pre-packet baseline (REQ-001, SC-002)
- [x] T017 Confirm no test residue: `runtime/database/council-graph.sqlite` and `specs/descriptions.json` are both clean after the run
- [x] T018 Name what was found and is deliberately not fixed: the version-derivation reconcile owed after the commit, the sibling `sk-create-repo-rule` playbook's invisibility to the benchmark loader, and the five tooling defects recorded under phase 005. Each belongs to another packet (REQ-003)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — T001-T018 all closed
- [x] No `[B]` blocked tasks remaining — `grep '\[B\]' tasks.md` returns nothing
- [x] Manual verification passed — acceptance-criteria.md AC-001 through AC-006 are all `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **The playbook this phase enrolled and gated**: `../005-command-and-playbook/implementation-summary.md`
- **The second playbook, authored in the following phase**: `../007-human-voice-playbook/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001, REQ-002 and REQ-003 in spec.md §4
- [x] CHK-002 [P0] Technical approach defined in plan.md — the single-pass sweep, the re-pin discipline and the closeout edits are in plan.md §1 and §3
- [x] CHK-003 [P1] Dependencies identified and available — the five hubs, the canary harness, both playbook packages, the benchmark suite and the packet's own documents were all in place
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — no code was written. The equivalent structural checks are the five `parent-skill-check` gates and the metadata CI, all green
- [x] CHK-011 [P0] No console errors or warnings — every `parent-skill-check` run reports 0 warnings, and both playbook packages report `warnings=0`
- [x] CHK-012 [P1] Error handling implemented — Not applicable: this phase runs gates and edits documentation, and adds no control flow
- [x] CHK-013 [P1] Code follows project patterns — the closeout edits follow the shape the sibling modes already use: a playbook row in the related-documents table, playbook gates in the verification table, and one first-version changelog entry
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001 through AC-006 in acceptance-criteria.md are all `Met`
- [x] CHK-021 [P0] Manual testing complete — the sweep was run and each exit status and count was read, not inferred from the absence of an error
- [x] CHK-022 [P1] Edge cases tested — the edge that mattered is that a gate's verdict is only about the tree it read, so every closeout edit was made before the sweep rather than after it
- [x] CHK-023 [P1] Error scenarios validated — the re-pin was preceded by a real red run naming the edited source, which is the only way a re-pin can be distinguished from disabling the check
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — `matrix/evidence`: the claim under test is that every affected gate is green from the final tree, and the only honest answer is the full gate matrix with its verbatim output
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — Every gate any phase of this packet could have disturbed is enumerated in plan.md's Affected Surfaces table, which is why it includes the alias table, the agent mirrors and the corpus frontmatter gate alongside the obvious hub checks
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — The four closeout edits and their consumers are listed: the fleet sweep reads the allowlist, readers read the README and changelog, and the packet validator reads the phase map
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — Not applicable in the security sense. The nearest equivalent, an outside-root read, is covered by the move simulation: `0 reads under .opencode/specs`
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — Five hubs crossed with four hub-level gates, plus two playbook packages crossed with two readers. Every cell was run and read
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — The global state a sweep can dirty is the two shared artifacts, and both were checked after the run: `runtime/database/council-graph.sqlite` and `specs/descriptions.json` are clean
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — Evidence is quoted verbatim from one sweep over one tree, and the canary harness pins a sha256 per authored hub source, which is what surfaced the drift the re-pin records
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — confirmed: the closeout edits are documentation rows, an allowlist path and a changelog entry
- [x] CHK-031 [P0] Input validation implemented — Not applicable: no input-handling code was added or changed
- [x] CHK-032 [P1] Auth/authz working correctly — Not applicable: none of the surfaces in this phase has an auth boundary
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md all trace to spec.md's REQ-001/002/003 and SC-001/002/003, and REQ-003 is the requirement that the packet documents agree with each other
- [x] CHK-041 [P1] Code comments adequate — Not applicable to written code. The one comment that mattered belongs to the canary harness, whose own comment instructs on refreshing the live-topology counts when a mode is registered
- [x] CHK-042 [P2] README updated (if applicable) — `sk-create-frontmatter/README.md` gained a playbook row in its related-documents table and two playbook gates in its verification table
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — confirmed: `scratch/` holds only `.gitkeep`
- [x] CHK-051 [P1] scratch/ cleaned before completion — confirmed: `scratch/` is empty aside from `.gitkeep`, and the residue check found `runtime/database/council-graph.sqlite` and `specs/descriptions.json` both clean
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 23 | 23/23 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-09-01
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — no `decision-record.md` exists for this phase and none is required at this level; both decisions are recorded as ADR-001 (rewrite the changelog as one first-version entry) and ADR-002 (defer the version-derivation reconcile until after the commit) in plan.md's L3 Architecture Decision Record section
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) — ADR-001 status: Accepted. ADR-002 status: Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale — ADR-001 rejects adding a second entry and leaving the original alone; ADR-002 rejects applying the computed value now and hand-picking one
- [x] CHK-103 [P2] Migration path documented (if applicable) — the owed migration is named and scoped: after the commit, `frontmatter-version.mjs apply --skill sk-doc --update` reconciles both moved documents to their new anchor
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01) — Not applicable: no latency target governs a verification sweep, and no serving code was changed
- [x] CHK-111 [P1] Throughput targets met (NFR-P02) — Not applicable: no NFR-P02 exists and no throughput surface is involved
- [x] CHK-112 [P2] Load testing completed — Not applicable: there is no runtime service to load-test
- [x] CHK-113 [P2] Performance benchmarks documented — Not applicable: this phase makes no performance claim. The suite it runs is a correctness suite, and its result is reported against the pre-packet baseline
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and tested — plan.md §7: the four closeout edits are independent and individually reversible, and the re-pin reverses by restoring the previous digest
- [x] CHK-121 [P0] Feature flag configured (if applicable) — Not applicable: no runtime flag governs a sweep. The nearest toggle is the allowlist, and both packages are enrolled deliberately
- [x] CHK-122 [P1] Monitoring/alerting configured — the sweep's gates are the standing monitoring, and enrolling both playbook packages is what brings them inside the fail-closed fleet run
- [x] CHK-123 [P1] Runbook created — the Phase 3 task list is the runbook: every gate, in order, with the output each returned
- [x] CHK-124 [P2] Deployment runbook reviewed — confirmed by the final state: five hubs `compiled-serving`, five canaries exit 0, `verdict=PASS valid=32 blocked=0 unenrolled=0 total=32`, and no residue
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed — satisfied by CHK-030 and CHK-031, plus the move simulation's `0 reads under .opencode/specs`
- [x] CHK-131 [P1] Dependency licenses compatible — Not applicable: no new external dependency is introduced. Every gate in the sweep is an existing internal script
- [x] CHK-132 [P2] OWASP Top 10 checklist completed — Not applicable: no web-facing runtime surface is involved
- [x] CHK-133 [P2] Data handling compliant with requirements — confirmed: the sweep reads repository files and writes no data. The two artifacts it could have dirtied were checked and are clean
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized — this is REQ-003 itself, and it is met: no two packet documents claim different completion states, and the parent phase map no longer carries the two duplicated placeholder rows
- [x] CHK-141 [P1] API documentation complete (if applicable) — Not applicable: no API surface is added or changed
- [x] CHK-142 [P2] User-facing documentation updated — the mode's `README.md` now names its playbook and its two playbook gates, and its changelog describes the mode as it ships rather than the scaffold it once was
- [x] CHK-143 [P2] Knowledge transfer documented — the re-pin discipline, the topology-count invariant and the three out-of-scope findings are recorded in implementation-summary.md, because each would otherwise be rediscovered as a symptom of this packet
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

Not applicable. No formal named-approver sign-off process governs this internal spec-folder phase.

| Approver | Role | Status | Date |
|----------|------|--------|------|
| N/A | Technical Lead | Not required | |
| N/A | Product Owner | Not required | |
| N/A | QA Lead | Not required | |
<!-- /ANCHOR:sign-off -->
