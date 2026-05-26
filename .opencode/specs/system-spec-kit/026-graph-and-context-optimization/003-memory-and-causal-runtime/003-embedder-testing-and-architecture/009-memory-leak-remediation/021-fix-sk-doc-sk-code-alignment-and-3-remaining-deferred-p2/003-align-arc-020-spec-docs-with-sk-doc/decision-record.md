---
title: "Decision Record: Arc 020 Spec Docs sk-doc Alignment"
description: "ADR for the final arc 021 sk-doc sweep across arc 020 child docs and selected skill surfaces."
trigger_phrases:
  - "021 003 ADR"
  - "arc 020 sk-doc sweep ADR"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/003-align-arc-020-spec-docs-with-sk-doc"
    last_updated_at: "2026-05-23T14:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded accepted sk-doc sweep ADR"
    next_safe_action: "Review and commit documentation-only packet if desired"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0210030210030210030210030210030210030210030210030210030210030210"
      session_id: "021-003-sk-doc-arc-020-spec-sweep"
      parent_session_id: null
    completion_pct: 100
---
# Decision Record: Arc 020 Spec Docs sk-doc Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

## ADR-001: RUN TARGETED SK-DOC SWEEP WITH MECHANICAL FIXES ONLY

**Status:** Accepted
**Date:** 2026-05-23
**Findings:** 24 arc 020 child docs had H2-case drift; 0 ADR evidence gaps, 0 continuity required-field gaps, 0 skill evergreen violations, 0 doctor header violations.

### Decision
Use scanner-backed checks for H2 casing, ADR evidence rows, continuity required fields, evergreen packet-ID references, and doctor script headers. Apply mechanical H2 casing fixes in the approved arc 020 child docs and leave the already-clean skill surfaces unchanged.

### Rationale
- The packet is documentation-only and must not alter runtime behavior.
- sk-doc's quick reference treats H2 ALL CAPS as a safe structure fix.
- The user's scope explicitly allows minimal fixes to arc 020 child docs and the seven listed skill surfaces when actual drift is found.
- `scratch/sk-doc-sweep-tally.csv` records 36 audited child docs, with 24 fixed for `h2-case` and 12 already clean.

### Alternatives Considered
- Rewrite closed arc 020 docs for broader consistency: rejected because that would over-correct closed packets.
- Skip fixes and only report drift: rejected because H2 case is a safe sk-doc structure fix.
- Edit runtime skill docs preemptively: rejected unless current-state mutable packet-ID drift is actually present.
- Fill ADR evidence rows defensively: rejected because the scan found no empty evidence rows.

### Compatibility Contract
No logic files or executable shell behavior change. If a strict validation regression appears after a fix, revert that file and record a deferral instead of widening scope.

---

## VERIFICATION NOTES

- 2026-05-23: Scaffold strict validation passed with errors 0, warnings 0.
- 2026-05-23: Arc 020 sweep audited 36 child docs; 24 received H2-case fixes and 12 required no fixes.
- 2026-05-23: Post-fix scanner reported 0 current H2-case, empty ADR evidence, or empty continuity required-field violations.
- 2026-05-23: Rerank sidecar `SKILL.md` and `README.md` had 0 mutable packet-ID grep hits for the checked packet prefixes.
- 2026-05-23: Five `doctor.sh` files passed shebang, `set -euo pipefail`, and `COMPONENT:` header checks.
- 2026-05-23: All six arc 020 child packets passed strict validation.
- 2026-05-23: This 021/003 packet passed final strict validation.
- 2026-05-23: Arc 021 parent passed strict validation.

## DEFERRED

- None at scaffold time.
