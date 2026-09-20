---
title: "Acceptance Criteria: Phase 3: hub mode registration"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/001-cli-jev-creation/003-hub-mode-registration"
    last_updated_at: "2026-09-20T10:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the registration criteria against the re-run gates"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-003-hub-mode-registration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: hub mode registration

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/001-cli-jev-creation/003-hub-mode-registration
**Level:** 3
**Status:** Complete
**Date:** 2026-09-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the hub root, When the per-hub gate runs, Then every hard invariant passes at eight registered modes with zero warnings | `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1` — run from the hub path: `OK: all hard invariants passed, 0 warnings` | Met | - |
| AC-002 | REQ-001 | Given a transport mode, When its registration is read, Then it declares `routingClass` metadata, `mutatesWorkspace: false`, forbids `Write`/`Edit`/`Task` and appears in the `transport-axis` array | `.skilled/skills/cli-external-orchestration/mode-registry.json:1` | Met | - |
| AC-003 | REQ-001 | Given the transport rule, When the declaration is broken deliberately, Then the gate names the specific violation | `.skilled/commands/doctor/scripts/parent-skill-check.cjs:551` — the negative-control failure the check produced | Met | - |
| AC-004 | REQ-002 | Given a dispatch command, When it invokes a jev judgment, Then the audit resolves it to `cli-jev`, and when it merely mentions one in prose, the audit resolves nothing | `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs:444` — the govern and do-not-govern lists, both passing | Met | - |
| AC-005 | REQ-002 | Given the eight declared rules, When the suites run, Then every check has a fixture pair that differs and the declared set equals the implemented set | `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs:418` (fixture pairs) and `:494` (bijection) — 20 tests pass, 0 fail | Met | - |
| AC-006 | REQ-003 | Given the routing surfaces, When each is read, Then the mode appears in the registry, the router signals, the tie-break, the intent map, the resource map, the leaf manifest, the mode table and the roster | `.skilled/skills/cli-external-orchestration/leaf-manifest.json:1`; the regeneration is byte-identical to the committed file | Met | - |
| AC-007 | REQ-003 | Given the regenerated intent signals, When the generator checks, Then it reports no missing phrase | `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs:1` — run with `--check`: `declared=70 signals=85 missing=0` | Met | - |
| AC-008 | REQ-004 | Given the compiled router, When it is asked for a transport prompt, Then it routes to `cli-jev`, and an out-of-domain prompt defers | `.skilled/bin/compiled-route.cjs:1` — four prompts replayed, none changed among the existing modes | Met | - |
| AC-009 | REQ-004 | Given the serving manifest, When its freshness is read, Then it is valid, fresh and selecting the freshly compiled policy hash | `.skilled/bin/compiled-route-status.cjs:1` — run with `--hub cli-external-orchestration`: `compiled-serving`, `fresh: true` | Met | - |
| AC-010 | REQ-005 | Given the executor scorer, When a jev phrase is resolved, Then no executor is returned and the transport is absent from the alias table | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/executor-delegation.ts:165` — the `packetKind` workflow filter | Met | - |
| AC-011 | REQ-005 | Given the shared policy schema, When the transport destination is compiled, Then it carries role `transport`, `mutatesWorkspace: false`, and an `evidenceOnly` authority edge | `.skilled/bin/lib/compiled-routing/003-contract-schemas/schemas/compiled-policy.v1.schema.json:45` — the role enum the compiler now emits from | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

AC-005 and AC-009 carried the packet. A registration is only real when an enforcement path reads it and the runtime that serves it agrees, so the phase closed on the hook suites and the manifest freshness rather than on the file edits. AC-011 records the finding that shaped the implementation: the runtime already modelled transports, and the hub compiler was the only component that did not.
<!-- /ANCHOR:closure -->
