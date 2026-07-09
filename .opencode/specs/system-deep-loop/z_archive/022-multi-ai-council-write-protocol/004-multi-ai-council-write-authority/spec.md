---
title: "Feature Specification: Multi-AI Council write authority [system-deep-loop/z_archive/022-multi-ai-council-write-protocol/004-multi-ai-council-write-authority/spec]"
description: "Flip the multi-ai-council agent from planning-only (write: deny / edit: deny) to scoped-write (write/edit: allow, restricted to ai-council/** paths). Adds artifact_written audit-trail events to ai-council-state.jsonl, defines round-NNN-scoped rollback semantics, and migrates persist-artifacts.cjs from dispatcher-owned writes to council-owned writes (helper retained as fallback for non-council callers). All 4 runtime mirrors (.opencode, .claude, .codex TOML, .gemini) flip together."
trigger_phrases:
  - "multi-ai-council write authority"
  - "council write authority"
  - "council ai-council folder writes"
  - "council artifact_written audit"
  - "098 multi-ai-council writes"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-multi-ai-council-write-protocol/004-multi-ai-council-write-authority"
    last_updated_at: "2026-05-08T21:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded Level 3 spec + 3 ADRs"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high fast to implement permission flips + writer migration + tests"
    blockers: []
    key_files:
      - ".opencode/agents/multi-ai-council.md"
      - ".claude/agents/multi-ai-council.md"
      - ".codex/agents/multi-ai-council.toml"
      - ".gemini/agents/multi-ai-council.md"
      - ".opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs"
      - ".opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "council-write-authority-2026-05-08"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Should bash and patch capabilities flip too? — NO. ADR-001 keeps bash/patch denied. Only write and edit flip, scoped to ai-council/**."
      - "Should the helper persist-artifacts.cjs be deleted? — NO. Repurpose as fallback for non-council callers (e.g., direct CLI invocation from a deep-research workflow). Council-owned writes are the primary path."
---
# Feature Specification: Multi-AI Council write authority

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- PHASE_LINKS: parent=../spec.md; predecessor=003-multi-ai-council-deferrals; successor=005-multi-ai-council-main-agent-write-enforcement -->

---

## EXECUTIVE SUMMARY

The multi-ai-council agent currently operates planning-only: its YAML carries `write: deny / edit: deny / bash: deny / patch: deny` across all 4 runtime mirrors. Today, the helper script `persist-artifacts.cjs` (or the dispatching command) reads the council's chat output and writes the artifact tree (`ai-council-config.json`, `ai-council-state.jsonl`, `ai-council-strategy.md`, `council-report.md`, `seats/`, `deliberations/`, `critiques/`). Packet 089 explicitly listed "LEAF council write files" as a NO-GO blocker condition pending design. This packet ships the design and the implementation: the council flips to `write: allow / edit: allow` scoped to `ai-council/**`, with bash and patch staying denied. Audit-trail events (`artifact_written`) are appended to the existing `ai-council-state.jsonl` schema additively (v1.1 → v1.2). Rollback uses round-NNN folders as the unit of recovery: on any seat error or convergence failure, the council writes a `rollback` event and prunes the round artifacts.

**Key Decisions**: scoped permission grant (path-restricted to `ai-council/**`); additive audit schema (v1 readers continue parsing); round-NNN as rollback unit; helper repurposed as fallback (not deleted).

**Critical Dependencies**: Precedent agents `@deep-research` and `@deep-review` already operate with `write: allow / edit: allow` scoped to `research/` and `review/` respectively. This packet adopts the same pattern. The 4-runtime mirror parity test from packet 080 is the regression guard.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-08 |
| **Branch** | `main` |
| **Predecessor** | `080-multi-ai-council-output-protocol/`, `089-multi-ai-council-persistence/`, `092-multi-ai-council-deferrals/` |
| **Successor** | None planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The multi-ai-council agent is intentionally planning-only as of v3.4.1.0. Its YAML enforces a hard-deny on write, edit, bash, and patch. Today the helper script `persist-artifacts.cjs` reads the council's chat output and writes the artifact tree on the council's behalf — meaning the council can REASON about its artifacts but cannot directly produce them. The split has three observable costs: (1) operators have to invoke the helper as a separate step (or rely on the dispatching command to do so), introducing a latency and failure mode; (2) the council cannot iterate on its own artifacts mid-deliberation; (3) the architecture has an implicit "the parent owns persistence" rule that is fragile when the parent is itself an LLM with its own context constraints. Packet 089 documented this gap as a NO-GO blocker for v1.2+: "LEAF council write files" requires explicit ADR + user approval before flipping the §0 invariant.

### Purpose

Flip the council from planning-only to scoped-write. Council writes the artifacts directly under `ai-council/**` with audit-trail events recorded in `ai-council-state.jsonl`. Rollback semantics are defined per round so a failed deliberation cannot leave inconsistent artifacts. The helper script stays as a fallback path for non-council callers (e.g., direct CLI invocation from a deep-research workflow that wants the council's artifact format without dispatching the council itself). Packet 089's NO-GO is closed by this packet; v1.2 of the council's permission contract ships.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Permission flip** — all 4 runtime mirrors:
- `.opencode/agents/multi-ai-council.md` — frontmatter `permission` block: `write: deny → write: allow (ai-council/)`, `edit: deny → edit: allow (ai-council/)`. `bash: deny`, `patch: deny` STAY denied.
- `.claude/agents/multi-ai-council.md` — same flip.
- `.codex/agents/multi-ai-council.toml` — TOML equivalent of the same flip.
- `.gemini/agents/multi-ai-council.md` — same flip.

**Audit-trail schema** — `ai-council-state.jsonl` v1.2:
- New event type: `{"event": "artifact_written", "path": "<relative path under ai-council/>", "bytes": <int>, "checksum": "<sha256:hex>", "timestamp": "<ISO 8601>", "seat_id": "<seat>", "round_id": "<round-NNN>"}`.
- Additive only. v1 readers ignore unknown event types per existing schema policy (per `references/multi-ai-council/state-format.md` §additive-schema-policy).

**Rollback semantics** — round-NNN folder as the rollback unit:
- On seat error mid-round: council writes `{"event": "rollback", "round_id": "<round-NNN>", "reason": "<seat error message>", "timestamp": "<ISO>"}`.
- Dispatcher (or council itself in v1.2) prunes the `round-NNN/` subdirectory and any `artifact_written` events for that round are marked `superseded_by: "rollback"` in a follow-up event.
- Convergence failure (no round reaches stop conditions within max iterations): same rollback path; round artifacts remain on disk in a `failed/` sibling for forensic inspection.

**Writer migration** — `persist-artifacts.cjs`:
- Refactor into `lib/persist-artifacts.js` exporting individual writers (`writeConfig`, `writeStrategyMd`, `writeStateJsonl`, `writeSeat`, `writeDeliberation`, `writeCritique`, `writeReport`).
- Council agent body (§16 Caller Persistence Protocol) updated to invoke these writers directly from the council's reasoning context (council writes one file per artifact, in order, after each round closes).
- Existing `persist-artifacts.cjs` becomes a thin wrapper that imports the refactored library and is callable by non-council callers (CLI, follow-up packets that want the council's artifact format without dispatching the council).
- `advise-council-completion.cjs` advisory script unchanged — still exits 0 always, still reports missing/seat-mismatch state.

**Validator regression test** — path-scope enforcement:
- New test asserts that the council's `write: allow` permission applies ONLY to `ai-council/**`. Any council write attempt outside `ai-council/` is rejected with `OUT_OF_SCOPE_WRITE` error.
- New test asserts that the 4 runtime mirrors carry IDENTICAL permission YAMLs (per existing 4-runtime parity pattern from packet 080).

**Documentation**:
- `references/multi-ai-council/state-format.md` — append §1.2 `artifact_written` event type.
- `references/multi-ai-council/folder-layout.md` — flip "Helper-written" annotations to "Council-written (helper as fallback)".
- Council agent body §0 (CRITICAL section) — update the planning-only invariant text to reflect the scoped-write flip.
- Council agent body §16 Caller Persistence Protocol — flip from "the parent or dispatching caller owns helper invocation" to "the council writes artifacts directly via lib/persist-artifacts.js exports".

### Out of Scope

- **Bash and patch capabilities**. ADR-001 keeps these denied. Council never executes shell, never patches files outside `ai-council/`.
- **Multi-round mid-flight reentry**. If a round is aborted, recovery is a fresh dispatch from the dispatcher — not a mid-flight resume.
- **Cross-packet artifact moves**. Council writes to its current packet's `ai-council/` only. Moves between packets require explicit dispatcher action.
- **Schema breaking changes** in v1 events. v1.2 is additive only.
- **Council strategy or deliberation logic changes**. This packet is permission + writer plumbing only.
- **Backporting v1.2 to packet 080's `ai-council/` artifacts**. Existing artifacts stay on the v1 format; new dispatches use v1.2.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agents/multi-ai-council.md` | Modify | Flip `permission.write` and `permission.edit` from `deny` to `allow (ai-council/)`. Update §0 + §16 body. |
| `.claude/agents/multi-ai-council.md` | Modify | Same flip; preserve mirror parity. |
| `.codex/agents/multi-ai-council.toml` | Modify | TOML equivalent flip; preserve mirror parity. |
| `.gemini/agents/multi-ai-council.md` | Modify | Same flip; preserve mirror parity. |
| `.opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs` | Modify | Thin wrapper around new lib; preserve CLI compatibility. |
| `.opencode/skills/system-spec-kit/scripts/multi-ai-council/lib/persist-artifacts.js` | Create | Refactored writer functions exported as named exports. |
| `.opencode/skills/system-spec-kit/scripts/multi-ai-council/lib/audit-trail.js` | Create | `artifact_written` event factory + checksum helpers. |
| `.opencode/skills/system-spec-kit/scripts/multi-ai-council/lib/rollback.js` | Create | Round-NNN rollback helpers (move-to-failed, supersede markers). |
| `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md` | Modify | Append §1.2 audit-trail event spec. |
| `.opencode/skills/system-spec-kit/references/multi-ai-council/folder-layout.md` | Modify | Flip "Helper-written" → "Council-written". |
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-permission-scope.vitest.ts` | Create | Path-scope enforcement test (writes outside ai-council/ rejected). |
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-runtime-parity.vitest.ts` | Create | 4-runtime YAML parity test (extends packet 080's pattern). |
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-audit-trail.vitest.ts` | Create | `artifact_written` event format + checksum + v1-reader-tolerance test. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-rollback.vitest.ts` | Create | Round-NNN rollback E2E with seat-error injection. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Council permission flipped to scoped-write across 4 runtime mirrors. | All 4 mirrors carry `permission.write: allow (ai-council/)` and `permission.edit: allow (ai-council/)`. `bash` and `patch` STAY `deny`. 4-runtime parity test passes. |
| REQ-002 | Path-scope enforcement is testable. | Writes attempted outside `ai-council/**` are rejected with `OUT_OF_SCOPE_WRITE`. Test fixture proves the rejection; runtime cannot bypass. |
| REQ-003 | Audit trail captures every council write. | Each `writeConfig`/`writeStrategyMd`/`writeStateJsonl`/`writeSeat`/`writeDeliberation`/`writeCritique`/`writeReport` invocation appends an `artifact_written` event. Event includes path, bytes, sha256 checksum, timestamp, seat_id, round_id. |
| REQ-004 | Rollback works for any round. | Inducing a seat error mid-round: council writes `rollback` event, dispatcher prunes `round-NNN/`, `artifact_written` events from the failed round are marked `superseded_by: "rollback"`. Restored state is consistent. |
| REQ-005 | v1 readers tolerate v1.2 events. | Test loads v1.2-format `ai-council-state.jsonl` with the v1 schema parser; v1 parser ignores `artifact_written` and `rollback` events without erroring. |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | persist-artifacts.cjs preserves backward compatibility. | Direct CLI invocation `node persist-artifacts.cjs <args>` produces the same artifact tree as v1 callers expect. Helper functions as fallback for non-council callers. |
| REQ-007 | Council agent body §0 updated. | The CRITICAL section reflects the scoped-write flip. Old "planning-only invariant" language removed; new "scoped-write invariant" language added. |
| REQ-008 | Council agent body §16 updated. | Caller Persistence Protocol section reflects council-owned writes (with helper as fallback). |
| REQ-009 | state-format.md updated. | §1.2 documents the `artifact_written` event format with examples. |
| REQ-010 | folder-layout.md updated. | "Helper-written" annotations flipped to "Council-written (helper as fallback)". |
| REQ-011 | Validator regression test enforces path-scope. | New vitest file asserts council writes outside `ai-council/` are rejected. |
| REQ-012 | 4-runtime mirror parity test. | New vitest file extends packet 080's pattern; asserts permission YAML is byte-identical (modulo runtime-specific syntax) across the 4 mirror locations. |

### P2 — Refinement

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-013 | `advise-council-completion.cjs` recognizes v1.2 events. | When the advisory script encounters `artifact_written` events, it counts them in its completeness summary. |
| REQ-014 | Council body documents rollback for operators. | A new §18 body section explains rollback semantics and how to recover from a failed round. |
| REQ-015 | Audit-trail JSONL has rotating-file backup. | If `ai-council-state.jsonl` exceeds 10 MB, council writes `ai-council-state.jsonl.1` and starts fresh (parallels CocoIndex daemon log-cap pattern from packet 011). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 15 reqs above pass acceptance criteria.
- **SC-002**: 4 new vitest files (permission-scope, runtime-parity, audit-trail, rollback) pass.
- **SC-003**: `bash validate.sh 098-multi-ai-council-write-authority --strict` exits 0.
- **SC-004**: 4-runtime mirror parity test confirms council YAML byte-equivalent across `.opencode`, `.claude`, `.codex`, `.gemini`.
- **SC-005**: Sandbox smoke: dispatch a 3-seat council against a small planning question; council writes the artifact tree itself (no helper invocation needed); audit trail records every write; round closes cleanly.
- **SC-006**: Rollback E2E: induce a seat error mid-round; confirm rollback semantics work as specified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Permission flip allows council to corrupt arbitrary repo state | High | Path-scope enforcement in runtime; permission flip restricted to `ai-council/**`; bash and patch stay denied; validator regression test catches scope drift. |
| Risk | Council mid-flight failure leaves inconsistent artifacts | Med | Round-NNN rollback semantics + `superseded_by: "rollback"` markers; round-folder is the recovery unit; failed rounds preserved in `failed/` subdir for forensic inspection. |
| Risk | Helper consumers break when persist-artifacts.cjs is refactored | Med | Helper preserved as thin wrapper around the new lib; CLI signature unchanged. |
| Risk | 4-runtime parity drift introduces a permission asymmetry | High | New 4-runtime mirror parity test (extends packet 080's pattern); test runs in CI on every PR touching council agents. |
| Risk | v1 readers break on v1.2 audit events | High | Additive schema policy; explicit v1-reader-tolerance test; existing schema-evolution policy from packet 089 already supports this. |
| Dependency | Packet 080's 4-runtime mirror parity pattern | High | Established pattern; extension is straightforward. |
| Dependency | Existing precedent agents (`@deep-research`, `@deep-review`) | High | Both already use scoped-write permission. This packet adopts the same shape. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: `artifact_written` event append ≤ 5ms per write (single JSONL append + sha256).
- **NFR-P02**: Council artifact-tree write (full round close) ≤ 200ms total wall-clock for typical 3-seat round.
- **NFR-P03**: Rollback (round-NNN prune + supersede markers) ≤ 100ms.

### Security

- **NFR-S01**: Council writes are confined to `ai-council/**`. Runtime path-resolver rejects ANY write attempt outside that prefix.
- **NFR-S02**: Audit-trail checksum is sha256 of the file content as written (read-after-write is the source of truth, not the in-memory buffer).
- **NFR-S03**: Council's bash and patch capabilities remain denied. Validator regression test enforces this.

### Reliability

- **NFR-R01**: Audit-trail JSONL writes are atomic per event (write-then-fsync, or write-to-tmp-then-rename).
- **NFR-R02**: Concurrent council dispatches in different packets do not interfere (council writes are scoped to the current packet's `ai-council/`).
- **NFR-R03**: Rollback is idempotent: repeated rollback of the same round is a no-op (the `superseded_by` marker is checked before re-marking).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 8. EDGE CASES

### Data Boundaries

- **Round-NNN with zero artifacts written**: rollback is a no-op marker (logs the rollback event but no `artifact_written` events to supersede).
- **`ai-council/` directory missing at first write**: council creates it (mkdir -p semantics).
- **Audit-trail JSONL exceeds 10 MB**: rotates per REQ-015 (P2 refinement).

### Error Scenarios

- **Filesystem write failure mid-round**: surfaces as a typed error in the council's reasoning context; council emits a rollback event; dispatcher prunes.
- **Concurrent council dispatches against the same `ai-council/`**: should not occur in normal use; if detected (lock file), second dispatch fails-fast with `COUNCIL_IN_FLIGHT`.
- **v1 reader encounters v1.2 file**: ignores unknown event types per additive-schema policy.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | 4 agent YAML mirrors + 3 new lib modules + 4 new test files + 2 reference docs; ~800-1100 LOC estimated. |
| Risk | 20/25 | Permission flip is security-sensitive; path-scope enforcement must be ironclad. |
| Research | 12/20 | Greenfield design (3 ADRs); no prior implementation reference within the council subsystem; precedent from deep-research/deep-review reduces uncertainty. |
| Multi-Agent | 8/15 | 4-runtime parity coordination; council-as-LEAF means single writer. |
| Coordination | 12/15 | Touches all 4 runtime trees + 2 reference docs + helper script + new tests. |
| **Total** | **72/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Permission flip leaks scope (council writes outside ai-council/) | H | L | Runtime path-resolver + validator regression test + 4-runtime parity. |
| R-002 | v1 readers break on v1.2 events | H | L | Additive schema; explicit tolerance test. |
| R-003 | Round rollback leaves orphan artifacts | M | L | `failed/` subdir preserves forensic state; supersede markers point to rollback event. |
| R-004 | Helper consumers break after refactor | M | L | Helper preserved as thin wrapper; CLI signature unchanged. |

---

## 11. USER STORIES

### US-001: Council writes its own artifact tree (Priority: P0)

**As an** operator, **I want** the council to write its artifacts directly, **so that** I don't depend on a helper script invocation step.

**Acceptance Criteria**:
1. Given I dispatch the council against a planning question, When the council reasons through the round, Then artifacts under `ai-council/` (config, state, strategy, seats, deliberations, critiques, report) are written by the council itself with `artifact_written` audit events.

### US-002: Council cannot write outside ai-council/ (Priority: P0)

**As an** operator, **I want** to know the council's write authority is bounded, **so that** flipping the planning-only invariant doesn't introduce arbitrary repo write capability.

**Acceptance Criteria**:
1. Given the council attempts to write a file outside `ai-council/`, When the runtime evaluates the write, Then the write is rejected with `OUT_OF_SCOPE_WRITE` error.

### US-003: Round failure rolls back cleanly (Priority: P0)

**As an** operator, **I want** failed council rounds to leave consistent state, **so that** I can re-dispatch without repairing partial artifacts.

**Acceptance Criteria**:
1. Given a council round fails (seat error, convergence timeout, or operator abort), When the runtime evaluates the round outcome, Then the runtime writes a `rollback` event, prunes the failed `round-NNN/` directory, marks `artifact_written` events as `superseded_by: "rollback"`, and preserves the failed artifacts in `failed/round-NNN/` for forensic inspection.

### US-004: 4 runtime mirrors stay parity-locked (Priority: P1)

**As a** maintainer, **I want** the council's permission YAML identical across .opencode / .claude / .codex / .gemini, **so that** runtime drift cannot introduce a permission asymmetry.

**Acceptance Criteria**:
1. Given the council YAML is changed in any one runtime mirror, When CI runs, Then the 4-runtime parity test fails until the change is propagated to all 4 mirrors.

---

## 12. OPEN QUESTIONS

- **Q1**: Resolved (per pre-authored decision in `_memory.continuity.answered_questions`): bash and patch stay denied. Only `write` and `edit` flip.
- **Q2**: Resolved: helper script preserved as fallback (not deleted); refactored into library + thin wrapper.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Predecessors**: `080-multi-ai-council-output-protocol/`, `089-multi-ai-council-persistence/`, `092-multi-ai-council-deferrals/`
- **Decision Records**: See `decision-record.md` for ADR-001 (write-permission model), ADR-002 (audit-trail schema), ADR-003 (rollback semantics).
- **Research**: See `research.md` for precedent-agent analysis (deep-research, deep-review).
- **References (existing)**: `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md`, `folder-layout.md`, `convergence-signals.md`, `seat-diversity.md`.
