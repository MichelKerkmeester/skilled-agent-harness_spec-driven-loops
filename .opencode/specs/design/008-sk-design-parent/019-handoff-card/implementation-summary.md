---
title: "Implementation Summary: sk-design unified sk-code handoff schema"
description: "Complete. One shared sk-code handoff schema now applies across four modes: an interface build manifest, a foundations handoff card, an audit backlog-handoff card that routes findings without applying them, and a motion stack-boundary field."
trigger_phrases:
  - "sk-design handoff schema status"
  - "design build manifest outcome"
importance_tier: "important"
contextType: "implementation"
status: complete
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/019-handoff-card"
    last_updated_at: "2026-06-27T07:18:33Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Completed the shared sk-code handoff card"
    next_safe_action: "Use the schema for future design-to-build handoffs"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skills/sk-design/shared/sk_code_handoff.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-019-handoff-card"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-design unified sk-code handoff schema

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-handoff-card |
| **Completed** | 2026-06-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Built one shared sk-code handoff schema at `.opencode/skills/sk-design/shared/sk_code_handoff.md`. The schema defines the common envelope fields: `WHAT`, `LOCKED VALUES`, `SIGNATURE MOVES`, `REUSE LIST`, `IMPLEMENTATION MECHANISM / STACK BOUNDARY`, `OPEN RISKS / VERIFICATION` and `NEVER-CHANGE`.

Applied the schema across four modes:

- `design-interface/SKILL.md`: `REAL_UI_LOOP` loads the shared schema and interface now requires a build manifest when handing built or specified UI to `sk-code`.
- `design-foundations/SKILL.md`: `TOKENS` loads the shared schema and foundations now carries register posture, surface role, source evidence, output schema, CSS variables and breakpoint intent.
- `design-audit/SKILL.md`: `AUDIT_CONTRACT` loads the shared schema and audit now emits an accepted-finding backlog card without applying fixes.
- `design-motion/SKILL.md`: `STRATEGY` loads the shared schema and motion now records implementation mechanism and stack boundary before `sk-code` builds.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered as an additive shared schema plus mode-router wiring. The single-schema direction was grounded in the four lineage files under `../015-per-skill-improvement-research/`: interface P1 manifest, foundations P2-1 handoff card, audit R4 backlog handoff and motion P2 stack boundary.

The mode `SKILL.md` files were updated in both human-readable resource tables and machine `RESOURCE_MAP` entries so D5 connectivity can verify the shared schema is reachable with no dead paths.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One shared schema with per-mode extensions | The same need recurs in four modes, so one schema is cheaper and more consistent than four bespoke cards |
| Wire the schema through existing intents | Existing handoff-relevant intents avoided dead intent keys and kept router changes narrow |
| Keep the audit variant a routing card | The audit-never-fixes boundary must hold, so the card routes findings to sk-code and never applies them |
| Exclude md-generator | It does not hand a design to sk-code the same way, so it is the fifth mode the recurrence skips |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| D5 connectivity for `design-interface` | PASS. Score 100, `gateFailed false`, 0 path escapes, 0 dead intent keys, 0 dead resource paths |
| D5 connectivity for `design-foundations` | PASS. Score 100, `gateFailed false`, 0 path escapes, 0 dead intent keys, 0 dead resource paths |
| D5 connectivity for `design-audit` | PASS. Score 100, `gateFailed false`, 0 path escapes, 0 dead intent keys, 0 dead resource paths |
| D5 connectivity for `design-motion` | PASS. Score 100, `gateFailed false`, 0 path escapes, 0 dead intent keys, 0 dead resource paths |
| `package_skill.py --check .opencode/skills/sk-design/design-interface` | PASS. Result: PASS. Warnings: SKILL.md word count and missing optional smart-router markers were pre-existing shape warnings, not failures |
| `package_skill.py --check .opencode/skills/sk-design/design-foundations` | PASS. Result: PASS |
| `package_skill.py --check .opencode/skills/sk-design/design-audit` | PASS. Result: PASS |
| `package_skill.py --check .opencode/skills/sk-design/design-motion` | PASS. Result: PASS |
| `validate.sh --strict .opencode/specs/design/008-sk-design-parent/019-handoff-card` | PASS. Exit 0 with 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Schema is documentation-only.** It standardizes the handoff contract but does not create runtime automation for generating cards.
2. **Interface package warnings remain non-blocking.** `package_skill.py --check` passes, but it still warns that `design-interface/SKILL.md` exceeds the recommended word count and lacks optional smart-router marker names.
3. **No benchmark score was updated.** This phase verified D5 connectivity and package validity only.
<!-- /ANCHOR:limitations -->
