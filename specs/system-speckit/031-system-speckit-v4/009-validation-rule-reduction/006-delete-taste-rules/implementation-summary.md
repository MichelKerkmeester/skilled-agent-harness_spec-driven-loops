---
title: "Implementation Summary: Rules Nothing Reads"
description: "Nine advisory rules removed after a repo-wide reader check; 300 of 300 packets verdict-identical."
trigger_phrases:
  - "delete taste rules summary"
  - "nine advisory rules deleted"
  - "validator registry forty-five to thirty-six"
  - "advisory rules with no reader"
  - "verdict identical pinned sample"
  - "ac coverage not deleted"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/009-validation-rule-reduction/006-delete-taste-rules"
    last_updated_at: "2026-08-30T08:15:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Deleted nine advisory rules and every reference to them"
    next_safe_action: "Begin the next phase: stop copying derived facts into authored prose"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-speckit-041-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Rules Nothing Reads

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-delete-taste-rules |
| **Status** | Complete |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nine rules are gone: `PRIORITY_TAGS`, `EVIDENCE_CITED`, `GOAL_SHAPE`,
`PHASE_LINKS`, `PHASE_PARENT_CONTENT`, `CURRENT_STATE_DISCIPLINE`,
`LINKS_VALID`, `EVIDENCE_MARKER_LINT` and `SCOPE_ADHERENCE`. The registry went
from 45 entries to 36, and a validated packet prints nine fewer lines.

Removed with them: eight rule scripts and one node rule, the native
`PRIORITY_TAGS` implementation in the orchestrator together with its now
unreferenced `extractMergedVerification` helper, three dedicated test files, two
whole suites in the system test, two tests in the hardening suite, entries in
both script registries, the remediation hints in `progressive-validate.sh`, six
sections of the rules reference, and one manual-testing playbook whose only
subject was a deleted rule.

`AC_COVERAGE` was in the candidate set and is not deleted. A repo-wide search
found deep review names it in its completion criteria and surfaces its status in
synthesis, which is a real consumer.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The pinned 300-packet sample was measured per rule before anything was touched,
recording how often each rule ran, reported a no-op, and produced a finding.
That measurement is what separated rules that were quietly working from rules
that only ever printed: `LINKS_VALID` reported "skipped" on 296 of 296 runs
because it sits behind an env flag nothing sets, and `SCOPE_ADHERENCE` reported
"not active" on 296 of 296 because `validate.sh` never supplies the change-set
it needs.

The reader check was run per rule across the whole repository, not across the
validation library. That distinction changed the outcome. A first pass scoped to
`mcp-server/lib` and `.opencode/bin` reported nine rules with no consumer; the
repo-wide pass found `AC_COVERAGE` wired into deep review and removed it from
the deletion set.

Because phase 1 of this packet made warnings non-blocking, deleting rules that
only warn cannot change a verdict. That gave a falsifiable prediction to test
rather than a pass rate to admire, so verification is a paired run over the same
300 packets compared packet by packet.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Keep `AC_COVERAGE` | It has a consumer outside spec-kit; the other nine do not |
| Keep `evidence-marker-audit.ts` | It is a standalone audit CLI with its own tests, not a registry rule |
| Move the bridge test onto `CONTINUITY_FRESHNESS` rather than delete it | Deleting the only node-format rule under test would have left the node execution path uncovered; three node rules still ship |
| Delete rule tests rather than adapt them | A test for absent behaviour is noise, and adapting one is how enforcement quietly disappears behind a green suite |
| Replace two stale hand-maintained rule lists with a pointer to the registry | Both had outlived earlier deletions and named checks that no longer existed |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Status | Evidence |
|-------|--------|----------|
| No verdict drift | PASS | 300 of 300 packets identical; 0 regressions, 0 changes the other way |
| Registry shrank | PASS | 45 to 36 entries; diff 87 deletions, 0 insertions |
| `test:validation` | PASS | Exit 0; suites of 91, 34 and 87 all with 0 failures |
| Affected vitest suites | PASS | 33 of 33 across four files |
| Orchestrator bridge | PASS | 9 of 9 |
| No surviving reference | PASS | Repo-wide search for the nine names returns nothing outside changelogs and `specs/` |
| Node path still reachable | PASS | Three `.ts` rules remain registered |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`[EVIDENCE: ...]` markers are no longer graded by validation.** Deleting
   `EVIDENCE_CITED` and `EVIDENCE_MARKER_LINT` leaves the standalone
   `evidence-marker-audit.ts` as the only thing that inspects them, and it is
   run on demand rather than by the gate.

2. **Two rules deleted here had just been repaired.** `AC_COVERAGE`'s parser was
   fixed in the two commits before this phase and survives; `EVIDENCE_CITED`'s
   bare-filename loophole was closed earlier in this session and is now deleted
   along with the rule. The repair was wasted work, and the reader check that
   would have prevented it is now the first step of the procedure.

3. **`test-phase-validation.js` does not run.** It fails at import on
   `require` under an ESM package and is wired into no npm script. The failure
   predates this phase and was left alone under scope lock.

<!-- /ANCHOR:limitations -->
