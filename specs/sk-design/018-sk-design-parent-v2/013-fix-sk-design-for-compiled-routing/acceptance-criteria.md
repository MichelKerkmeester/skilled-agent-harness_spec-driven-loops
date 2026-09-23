---
title: "Acceptance Criteria: Compile current sk-design for compiled routing"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "sk-design compiled acceptance"
  - "compiled routing closure"
  - "stage one stage two routing proof"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/013-fix-sk-design-for-compiled-routing"
    last_updated_at: "2026-09-22T15:26:03Z"
    last_updated_by: "pi"
    recent_action: "Recorded all eight criteria Met with receipt-backed evidence and closed the packet"
    next_safe_action: "Operator review, then push the rollout and closure commits"
    blockers: []
    key_files:
      - ".skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs"
      - ".skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs"
      - ".skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-21-sk-design-compiled-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Playbook cross-canvas gold: answered, SD-007 is stale because its prompt scores one intent under the current ROUTER.md, so the five-leaf pairing predates the mode migration"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Compile current sk-design for compiled routing

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 013-fix-sk-design-for-compiled-routing  
**Level:** 3  
**Status:** Complete  
**Date:** 2026-09-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the current four-mode source, when the child builds, then the compiler emits a policy without retired-mode assumptions. | Build exit 0 with status built, two-run outputs byte-identical, source identity asserted over the four authored inputs, freshness reports the recorded policy hash equal to the current derivation, fresh true, recorded in scratch/T010-freshness.txt:14 | Met | - |
| AC-002 | REQ-002 | Given direct, explicit, bundled, no-match, and negative prompts, when the canary evaluates them, then decisions preserve the live mode and fallback contract. | The 8-case typed route gold asserted at build, 7 scenarios routed and 1 rejected, including the chart and diagram orderedBundle tie, the fundamentals no-match default, and the forbidden reject, recorded in specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-design/activation-record.json:1 and in scratch/T011-gold-rows.txt:8 | Met | - |
| AC-003 | REQ-003 | Given generated artifacts, when hashes and generation are compared, then policy, projection, graph, gold, card, and activation identity agree. | The acceptance record pins the candidate artifact hashes, the 013 current records the effective policy hash and generation, the route-time derivation matches both, and freshness reads fresh, recorded in scratch/T010-freshness.txt:24 | Met | - |
| AC-004 | REQ-004 | Given a permitted flag and compiled manifest, when policy identity matches, then the front door serves compiled; otherwise it returns the legacy sentinel. | Status reads 7 of 7 compiled-serving, 0 stale, 0 flag-off, the 0 and invalid flag values return the legacy sentinel, and the missing, stale, and engine-error states fail closed, recorded in scratch/T010-freshness.txt:22 and scratch/T013-authority-states.txt:5 | Met | - |
| AC-005 | REQ-005 | Given engine, resolver, advisor, guard, and closure sources, when cohort checks run, then membership and order agree. | The foundation suite passes 46 of 46 at exit 0 with the cohort at seven in all four copies, and the promotion published 62 closure files, recorded in scratch/T010-foundation-vitest.txt:12 and scratch/T010-foundation-vitest.txt:8 | Met | - |
| AC-006 | REQ-006 | Given the live design playbook, when admission runs, then every actionable scenario is pass or explicitly classified as stale gold. | Admission reports sk-design admitted with 3 pass, 1 drift, 0 stale-gold, and the drift scenario classified as stale cross-canvas playbook gold rather than an implementation defect, recorded in scratch/T012-admission.json:7 | Met | - |
| AC-007 | REQ-007 | Given a real design prompt, when it passes through stage one and stage two, then the output names the expected workflow mode and leaf resources. | A real values request routed through stage one to the fundamentals mode, and the typed gold replayed stage two for the same request shape to its three leaf resources at the live policy hash, the canvas prompt routed single to the diagram mode, and the advisor trace carried compiledRoute at generation 1 with trustState moved 139 to 155, recorded in scratch/T011-route-values.txt:1, scratch/T011-gold-rows.txt:4, scratch/T011-route-canvas.txt:1, and scratch/T011-advisor-values.json:41 | Met | - |
| AC-008 | REQ-008 | Given every new code comment, when hygiene checks scan it, then no ephemeral id or spec path is present. | The sweep found 0 ephemeral-identifier and 0 spec-path hits across 8 patterns over 168 extracted comment lines, recorded in scratch/CHK-012-comment-sweep.txt:169 | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

The rollout serves compiled at seven of seven hubs, every criterion above is Met with receipt-backed evidence, and strict validation passed at closure. The push of the two closure commits remains with the operator.
<!-- /ANCHOR:closure -->
