---
title: "Implementation Summary: test surface reconciliation"
description: "Ninety-eight failures across seven suites, triaged one at a time to separate a stale expectation from a real regression. Four were production defects hiding among the noise."
trigger_phrases:
  - "suites reconciled after a rename"
  - "stale pin versus real drift"
  - "coverage guard added to canaries"
  - "playbook corpus declaration"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/048-test-surface-reconciliation"
    last_updated_at: "2026-09-01T06:54:10Z"
    last_updated_by: "implementation"
    recent_action: "Brought the benchmark, validation, advisor and canary surfaces to green"
    next_safe_action: "Finish the remaining suites, then commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019ahF7gmhZy3Bo2bKRKK2i7"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 048-test-surface-reconciliation |
| **Completed** | 2026-09-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Seven suites were carrying ninety-eight failures between them, and almost none of them meant
what a failure is supposed to mean. Mode packets had been renamed, a runtime layout
renumbered, a hub retired, a mode withdrawn and filenames migrated to kebab-case. Every one
of those was a deliberate change. What none of them updated was the tests, fixtures and
pinned digests that still named the old shape.

That is worse than it sounds. A suite that always fails teaches its readers to skip it, and
four real defects were sitting inside this one waiting to be skipped.

### The four that were real

The playbook loader had been scoring one skill on a single scenario instead of thirty, ever
since its index table started using markdown links for file cells. A registered transport
mode had never received stage-two routing at all, so its resources were unreachable. Three
advisor phrase anchors sat below the routing floor, which makes an anchor inert on the very
phrase it exists to route. And one skill was still declared a routing-gold corpus after that
corpus was deleted, leaving twenty-eight files checked by nothing at all.

### A silence worth closing

Four of the five hub canaries had no assertion that a registered mode carries a fixture case.
Adding one found thirteen modes with no coverage, and adding coverage for them then exposed
two further defects: a policy card that deferred where the machine routes, and a falsifier
selected by array position that had been silently disarmed when cases were inserted above it.
It was testing nothing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/**` | Modified | Stale paths, withdrawn subjects, the playbook loader defect, the corpus declaration |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py` | Modified | Three anchors raised to the routing floor, and a docstring whose worked examples had drifted from the code |
| `.opencode/skills/system-spec-kit/scripts/test-fixtures/**` | Modified | Fingerprints attesting a document set that had changed |
| `specs/.../009-parent-hub-rollout/*/harness/**` | Modified | Digests, literals, falsifiers, and the coverage guard |
| `.opencode/skills/mcp-tooling/ROUTER.md`, `sk-code/ROUTER.md` | Modified | Stage-two routing a mode never received |
| `.opencode/skills/sk-doc/shared/scripts/rename_tooling_fixture_core.py` | Modified | Name the paths that drifted instead of blaming the harness |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Seven reviewers worked disjoint file sets in parallel under one rule: fix the root cause,
never weaken an assertion, and state which side was wrong with the evidence that settled it.
Each reported in the same shape so the results could be compared rather than merely collected.

Every claim was then re-run from the final state rather than accepted from a report. That
mattered twice. A reported finding of eleven invisible playbooks reproduced as ten, and the
proposed fix, measured before adoption, would have admitted seven hundred and ten scenarios
carrying no gold. It was declined. Separately, a first attempt at splitting one behaviour
gated on the wrong object, and its own failing test caught it before it shipped.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Judge each failure individually rather than sweeping | A stale expectation and a real regression look identical from outside, and four of these were real |
| Re-pin only after a red run | A pin exists to notice drift, so re-pinning without first seeing it bite trains the next reader to re-pin blindly |
| Retarget a test whose subject was withdrawn, never delete it | The coverage is still wanted; only the subject moved |
| Decline the playbook relaxation | It was measured first, and it would have diluted twenty-nine playbooks with unscoreable rows |
| Gate the corpus split on the skill, not the directory | The promise attaches to the skill, so a declared skill that yields nothing has broken it wherever the run pointed |
| Name the drifting paths instead of loosening the harness boundary | The boundary is a real safety invariant; only the error message was misleading |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| deep-improvement benchmark suite | PASS. 53 files, 675 tests, none failing, up from 67 failing |
| spec-kit validation suite | PASS. 83 passed, 0 failed |
| Advisor regression gate | PASS. 94 of 94, `overall_pass` true |
| Five per-hub canary validators | PASS. 5 of 5 exit 0, 41 modes covered |
| Compliant validation fixtures | PASS. 5 of 5 at zero errors, warnings unchanged |
| Negative validation fixtures | PASS. 16 of 16 still fail, each on its original rules |
| Comment-hygiene gate | PASS. Every changed code file |
| Remaining suites | In flight at the time of writing |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One harness suite cannot pass while the repository is being written.** It hashes the
   whole worktree to prove a rename tool cannot escape onto the real repo, so any concurrent
   writer flips the digest. That was demonstrated rather than assumed: pointed at a quiet
   repository, all sixteen of its assertions pass. The boundary was left alone and only the
   error message was improved, because narrowing the snapshot would weaken the invariant the
   suite exists to hold. Re-run it when nothing else is writing.
2. **Coverage for three retired emitters was dropped rather than migrated.** Their tokens do
   not appear in the replacements, so the coverage is genuinely gone. Re-adding it for the
   three new emitters is new coverage, not a repair, and was left out of this scope.
3. **A benchmark lane is bound to one command namespace.** Its resources resolve and its
   tests pin the scorer hermetically, but no live command exercises it, so it is either dead
   code to retire or a scorer to generalize. Measured: no fixture outside that one skill
   carries the field that fires it, so changing it today would alter nothing.
<!-- /ANCHOR:limitations -->

---


