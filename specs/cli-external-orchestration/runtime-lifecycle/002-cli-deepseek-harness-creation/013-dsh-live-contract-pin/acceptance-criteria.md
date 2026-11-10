---
title: "Acceptance Criteria: Phase 13: dsh-live-contract-pin"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "dsh live contract pin acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/013-dsh-live-contract-pin"
    last_updated_at: "2026-11-06T17:26:22Z"
    last_updated_by: "codex"
    recent_action: "Completed route promotion, focused checks and strict packet validation"
    next_safe_action: "Review the AI Council ADR-001 reopen condition with the operator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-013-dsh-live-contract-pin"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "OpenCode Go endpoint and authentication remain unknown because OPENCODE_API_KEY was unset and no request was sent"
      - "supportsDeveloperRole true remains unknown because the closed roster did not allow a variant patch"
    answered_questions:
      - "LLM Gateway deepseek-v4.1-flash-1017 completed on dsh 0.2.2-rc.1"
      - "workspace-write denied a $HOME file write and allowed an OS temp path"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 13: dsh-live-contract-pin

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/013-dsh-live-contract-pin
**Level:** 2
**Status:** Complete
**Date:** 2026-11-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the operator keyed the LLM Gateway route, When its saved OK run is checked, Then exit is 0 and the last event has `final.reason.kind` `completed` | `evidence/route-llmgateway.exit.txt:1`, `evidence/route-llmgateway.stdout.jsonl:1` | Met | - |
| AC-002 | REQ-002 | Given a temp workspace, When the probe writes inside, under `$HOME` outside the cwd, under a sibling OS temp path and calls `bash echo ok`, Then the inside write succeeds, the home write returns a `tool_result` error, the temp write is recorded as allowed and bash returns `completed` | `evidence/confinement.md:7`, `evidence/confinement.md:8`, `evidence/confinement.md:9`, `evidence/confinement.md:10` | Met | - |
| AC-003 | REQ-003 | Given the probe results, When the packet and `executor-config.ts` are updated, Then LLM Gateway is marked verified, OpenCode Go is marked configured, not verified, and only the Gateway model is the default | `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/providers-and-models.md:45`, `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/providers-and-models.md:46`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:313`, `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:486`, `evidence/live-contract-count.txt:2`, `evidence/phase-006-focused-vitest.txt:1`, `evidence/phase-006-typecheck.txt:1`, `../012-deep-loop-modes-and-commands/evidence/sandbox-test-disposition.txt:3` | Met | - |
| AC-004 | REQ-004 | Given the only keyed route, When the Gateway `max` request runs, Then stderr has no `UNSUPPORTED_REASONING_EFFORT` and the tested developer-role compat setting is recorded with the untested `true` value left UNKNOWN | `evidence/reasoning-max.md:5`, `evidence/reasoning-max.md:6` | Met | - |
| AC-005 | REQ-005 | Given the kind in the fan-out runtime, When the saved Gateway deep-research lineages are checked, Then a lineage completes with a clean containment scan | `evidence/fanout-lineage.md:7`, `evidence/fanout-lineage.md:8` | Met | - |
| AC-006 | REQ-006 | Given the keyed Gateway run and unkeyed OpenCode Go route, When latency and token counts are recorded, Then `evidence/latency-and-tokens.md` holds one row per route and explains the unverified route | `evidence/latency-and-tokens.md:7`, `evidence/latency-and-tokens.md:8` | Met | - |

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

All six criteria are Met and point to saved evidence. The sandbox suite run has only the two documented environment failures. The orchestrator will rerun the full authoritative gate outside this sandbox.
<!-- /ANCHOR:closure -->
