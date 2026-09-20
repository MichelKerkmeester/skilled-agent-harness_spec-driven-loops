---
title: "Implementation Summary: Create-Journey Gate Fixes"
description: "Delivered: the creation journey passes its own gates — contract version declared at every authoring surface, gate run with --fix in both workflows, template examples made mutually consistent and honest, orphan alias rows fail loudly, and an automated two-class journey proof guards the path."
trigger_phrases:
  - "create journey gate fixes summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/024-create-journey-gate-fixes"
    last_updated_at: "2026-07-28T16:27:03Z"
    last_updated_by: "claude-code"
    recent_action: "Delivered all seven fixes with the journey proof green"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-create-journey-gate-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Declare-explicitly won over relaxing the doctor: registries self-describe their contract version everywhere"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Create-Journey Gate Fixes

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Delivered** | 2026-07-28 |
| **Execution model** | LUNA xhigh writes from re-verified evidence; orchestrator verifies; SOL high adversarial review over the combined diff |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All seven journey-breaking defects fixed: the registry template and the scaffolder's parent output declare `resourceContractVersion` explicitly (the doctor's demand was hidden by generation defaulting it); the parent workflow's conformance step runs the class gate with `--fix` before the clean proof run, mirroring the standalone step; the registry and router example templates now share identical placeholder tokens with complete signal/tieBreak coverage per the doctor's real ordering rules; the graph template's `family` shows a valid value with the legal set in its note; the runtime-loop extension note states only the validation the doctor performs; and an alias row naming an unknown workflow mode throws a named contract error instead of vanishing. The new `create-journey-proof.test.cjs` scaffolds both classes into a temp dir and asserts gate-with-fix, clean gate, and doctor-zero end to end.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Re-verify-then-fix: every swarm finding was confirmed at its cited line on the execution tip first, which narrowed one (the missing `--fix` was parent-path only — the standalone step already had it) and confirmed the rest, including the double-confirmed contract-version gap. The broken journey was reproduced in a temp dir before any edit so the proof test asserts against a known failure.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Registries declare their contract version explicitly rather than the doctor relaxing to accept the generator's default — self-describing artifacts beat looser gates, and the change is byte-neutral for every live manifest. The orphan-alias check throws at generation time rather than warning: a silently dropped alias was the original defect class.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Journey proof | both classes: scaffold → gate --fix → clean gate → doctor 0 failures |
| Fleet gate / freshness | 11/11 both, byte-neutral for live hubs |
| Orphan-alias fixture | fails pre-fix shape, passes with the named error |
| Suites | create-skill tests + doctor fixture suite green |

Commands: `node .opencode/skills/sk-doc/create-skill/scripts/tests/create-journey-proof.test.cjs` · `node .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs` (checked=11 passed=11) · `node .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs` (checked=11 fresh=11).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The doctor's own blind spots catalogued at P2 by the review (unvalidated duplicate fields, extension-list asymmetries) are recorded in the swarm evidence but deliberately not chased here.
<!-- /ANCHOR:limitations -->
