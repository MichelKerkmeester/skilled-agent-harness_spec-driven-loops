---
title: "Implementation Plan: Create-Journey Gate Fixes"
description: "Verify-then-fix plan for the journey-breaking template, scaffolder, workflow-step, and silent-discard defects, closed by an automated fresh-scaffold journey proof for both skill classes."
trigger_phrases:
  - "create journey gate fixes plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/024-create-journey-gate-fixes"
    last_updated_at: "2026-07-28T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Planned"
    next_safe_action: "Execute Phase 1 after operator go"
    blockers:
      - "Execution awaits operator authorization"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-create-journey-gate-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Create-Journey Gate Fixes

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Re-verify each swarm finding against source first (finding = hypothesis), then fix in dependency order: journey-critical declarations, workflow step, template consistency, silent-discard reporting — and close with an automated two-class journey proof so this class of defect cannot silently return.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|------|-----|
| Journey proof | scaffold both kinds → gate `--fix` → gate clean → doctor 0 failures |
| Fleet gate + freshness | 11/11 both, `fixed=0` on re-run |
| Contract + doctor suites | pass |
| Byte-neutrality check | declaring resourceContractVersion changes no committed manifest bytes |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No new components. Authoring surfaces (templates, scaffolder, workflow prose) are brought into agreement with the gates that already exist; the one behavioral change is the alias generator reporting instead of discarding an unknown-mode row.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Re-verify findings

Confirm each claimed defect at its cited file:line on the current tip; drop anything already fixed by concurrent work.

### Phase 2: Journey-critical fixes

`resourceContractVersion` declared in the registry template and `init_skill.py` parent output; workflow conformance step becomes gate `--fix` then plain re-run; byte-neutrality verified fleet-wide.

### Phase 3: Template consistency and honesty

Router template gains signals/tieBreak entries for every registry-template example mode; graph template family placeholder shows one valid value; runtimeLoopTypes note corrected to actual doctor behavior.

### Phase 4: Silent-discard fix

`generate-leaf-manifest.cjs` reports an alias row whose workflowMode matches no registry mode; failing-fixture test added; sk-doc's six live alias rows re-verified unaffected.

### Phase 5: Journey proof

Automated test scaffolds both classes into a temp dir and asserts gate + doctor success end-to-end; wired beside the existing create-skill script tests.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Fixture-first for the new generator error path; the journey proof is the regression net for everything else; full fleet gates and both suites re-run before landing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Swarm evidence in `research/swarm/`; the fleet gate, doctor, and generator from packets 021-022; no dependency on siblings 025/026.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Single revertable commit series; the alias-generator behavior change is the only piece with runtime consequence and is isolated in its own commit.
<!-- /ANCHOR:rollback -->
