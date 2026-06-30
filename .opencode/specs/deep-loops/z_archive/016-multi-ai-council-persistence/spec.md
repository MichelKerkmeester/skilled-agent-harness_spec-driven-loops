---
title: "Feature Specification: Multi-AI Council Persistence"
description: "Ship the 6-item P0 scope from packet 080's deep-research: persist-artifacts.cjs helper, agent body §17 caller protocol, output-schema.md shared §8 contract, vitest fixtures + tests, validator hardening, 4-runtime mirror parity. Preserves ADR-001 lightweight bound."
trigger_phrases:
  - "multi-ai-council persistence"
  - "persist-artifacts helper"
  - "ai-council caller protocol"
  - "output-schema.md"
  - "council §17"
  - "council mirror parity"
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/089-multi-ai-council-persistence"
    last_updated_at: "2026-05-06T16:00:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 3 spec.md from packet-080 research §7"
    next_safe_action: "Run Phase 2A implementation"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs"
      - ".opencode/skills/system-spec-kit/references/multi-ai-council/output-schema.md"
      - ".opencode/agents/multi-ai-council.md"
    session_dedup:
      fingerprint: "sha256:788e5b44bacc6f32fa1aad7286826a36181e4203bfb231820be4b4fbae52d496"
      session_id: "spec-089-author"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---

# Feature Specification: Multi-AI Council Persistence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Packet 080 introduced the `ai-council/` subfolder convention but the agent retains `write: deny` per its planning-only invariant — actual persistence requires an orchestrator. Packet 080's 10-iteration deep-research (research.md §7) produced a concrete P0 scope: ship a persistence helper, document a normative caller protocol (§17), promote §8 OUTPUT FORMAT to a shared schema artifact, add fixture-driven tests, harden the validator regression test, and add 4-runtime mirror parity testing. This packet delivers all six items while preserving ADR-001's lightweight bound (no dedicated skill folder).

**Key Decisions**: Node CJS helper (matches deep-research/deep-review reducer pattern), markdown schema artifact (rejects JSON Schema as too rigid), agent body §17 (rejects reference-only placement), opt-in advisory check (rejects strict validator enforcement).

**Critical Dependencies**: packet 080 shipped (`.opencode/agents/multi-ai-council.md` §12-§16, references/multi-ai-council/, ai-council/ smoke-test artifacts).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Track** | `skilled-agent-orchestration` |
| **Predecessor** | `080-multi-ai-council-output-protocol` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 080 documents the `ai-council/` output protocol but provides no persistence machinery. The smoke test relied on Claude Code (the orchestrator) hand-writing artifacts based on the agent's plan output. Without a shared helper, every dispatcher will reinvent the persistence path — yielding artifact-layout drift, inconsistent state.jsonl events, and broken iteration semantics.

### Purpose
Land the persistence helper, schema contract, caller protocol documentation, and parity testing so the council convention works end-to-end without human-in-the-loop reconstruction. Preserve the planning-only invariant by making the dispatching parent (not the LEAF agent) responsible for invoking the helper.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `persist-artifacts.cjs` helper (Node CJS) with parser exports + CLI
- Author 3 vitest fixtures (full / minimal / missing-required council outputs)
- Author fixture-driven helper test (`multi-ai-council-persist-artifacts.vitest.ts`)
- Author `output-schema.md` shared §8 contract
- Update `.opencode/agents/multi-ai-council.md` §8 cross-link + add §17 Caller Persistence Protocol
- Mirror agent body changes to `.claude/agents/`, `.gemini/agents/`, `.codex/agents/`
- Harden the existing validator regression test (replace partial-layout coverage with synthetic full validation)
- Add 4-runtime mirror parity test (normalized comparison of multi-ai-council across all 4 runtimes)

### Out of Scope
- Building a `.opencode/skills/multi-ai-council/` dedicated skill folder — non-goal (ADR-001 bound; deep-research §13 verdict)
- Granting `@multi-ai-council` `write: allow` — preserves planning-only invariant
- Adding state.jsonl v1.1 schema versioning fields — deferred to packet 082+
- Adding skill advisor scoring boosts for multi-ai-council — agent stays an agent, not a skill
- Adding council-aware `/memory:save` ANCHOR family — deferred to packet 082+
- Wiring `/speckit:*` command YAMLs to invoke the helper — deferred (helper standalone-usable per ADD-6)
- Retroactive migration of pre-080 council outputs — forward-only per ADD-5

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs` | Create | Helper script (parser + CLI + artifact writer) |
| `.opencode/skills/system-spec-kit/scripts/tests/fixtures/multi-ai-council/council-output-full.md` | Create | Fixture: full council output |
| `.opencode/skills/system-spec-kit/scripts/tests/fixtures/multi-ai-council/council-output-minimal.md` | Create | Fixture: minimal valid council output |
| `.opencode/skills/system-spec-kit/scripts/tests/fixtures/multi-ai-council/council-output-missing-required.md` | Create | Fixture: missing strict-required sections |
| `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-persist-artifacts.vitest.ts` | Create | Helper test (4 cases) |
| `.opencode/skills/system-spec-kit/references/multi-ai-council/output-schema.md` | Create | Shared §8 OUTPUT FORMAT contract |
| `.opencode/agents/multi-ai-council.md` | Modify | §8 cross-link + add §17 Caller Persistence Protocol |
| `.claude/agents/multi-ai-council.md` | Modify | Mirror §8 + §17 |
| `.gemini/agents/multi-ai-council.md` | Modify | Mirror §8 + §17 |
| `.codex/agents/multi-ai-council.toml` | Modify | Mirror §8 + §17 |
| `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-validator.vitest.ts` | Modify | Replace partial-layout coverage with synthetic full validation |
| `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-mirror-parity.vitest.ts` | Create | 4-runtime parity test (normalized) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Helper at `.opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs` | Node CJS, exports parser/renderer/builder/state-line, CLI accepts `<packet> [--round NNN] [--input-file FILE] [--strict-output]`, exit codes 0/1/2 |
| REQ-002 | Output-schema artifact at `references/multi-ai-council/output-schema.md` | Markdown contract with requiredness matrix, heading aliases, seat fallback, optional-section policy, schema-change lockstep rule |
| REQ-003 | Agent body §17 added to `.opencode/agents/multi-ai-council.md` | Normative caller persistence protocol; enumerates 4 caller patterns; states Depth-1 rule (parent owns invocation); forward-only scope; cross-links §8 to output-schema.md |
| REQ-004 | All 4 runtime mirrors carry §8 cross-link + §17 | `.opencode`, `.claude`, `.gemini`, `.codex` show identical normalized §-headers and content |
| REQ-005 | Helper vitest test passes | All 4 test cases (full/minimal/missing-required/parser-export) green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Validator regression test hardened | Replaces partial-layout coverage with synthetic spec folder + full `validate.sh --strict` invocation; confirms `ai-council/` arbitrary internals do not fail |
| REQ-007 | 4-runtime mirror parity test added | Normalized comparison passes across all 4 runtimes; flags drift at commit time |
| REQ-008 | ADR-001 lightweight bound preserved | No `.opencode/skills/multi-ai-council/` folder created; verified by post-packet inventory |
| REQ-009 | Agent's planning-only invariant preserved | `write: deny` unchanged in all 4 runtimes; §0 invariant statement intact |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Running the helper on a synthetic council report writes the canonical `ai-council/` artifact tree (config, strategy hint, state.jsonl events, seats/, deliberations/, council-report.md) per output-schema.md.
- **SC-002**: Strict-required §8 sections missing then helper exits 1 with no filesystem writes.
- **SC-003**: Optional sections missing + `--strict-output` flag absent then helper writes artifacts with empty placeholders for missing optional content.
- **SC-004**: All 4 runtime mirrors report identical normalized §-header sequence and body for `multi-ai-council` agent body.
- **SC-005**: Validator regression test passes; arbitrary `ai-council/` internals do not break `validate.sh --strict`.
- **SC-006**: No new skill folder at `.opencode/skills/multi-ai-council/`.
- **SC-007**: Agent permission block unchanged across all 4 runtimes (planning-only invariant preserved).
- **SC-008**: Strict validation passes on packet 089 (errors=0, warnings=0).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | packet 080 (already shipped) | Builds on §12-§16 + references/multi-ai-council/ | Reference-only; do not modify packet 080 spec docs |
| Risk | Helper parser becomes brittle to §8 evolution | Med | output-schema.md is single source of truth; both agent body and helper reference it; schema change requires lockstep update |
| Risk | 4-runtime mirror drift on future agent edits | High | Mirror parity test catches drift at commit time |
| Risk | Helper invocation friction (callers forget the recipe) | Med | §17 copy-paste recipe per caller pattern; documented in agent body |
| Risk | Vitest install issues (pre-existing local install broken) | Low | Use codex-side fixture verification; mark as P1 if runner blocked |
| Risk | Scope creep into a dedicated skill folder | High | Explicit non-goal; ADR-001 cited; deep-research §13 verdict (PRESERVE) referenced |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Helper run-time <2s on a typical council report (~10KB markdown).
- **NFR-P02**: Mirror parity test run-time <500ms.

### Security
- **NFR-S01**: Helper never writes outside the target spec folder's `ai-council/` subtree (path-scoping verified).
- **NFR-S02**: Helper never echoes secrets present in seat outputs to logs or state.jsonl.

### Reliability
- **NFR-R01**: Helper is idempotent: running on the same input + round writes identical bytes.
- **NFR-R02**: Partial-write recovery (exit 2) leaves the workspace in a deterministic state — either fully landed or fully reverted.

---

## 8. EDGE CASES

### Data Boundaries
- Empty council report: helper exits 1 (strict-required missing).
- Council report with extra unknown sections: helper accepts, records as `extra_sections` in state.jsonl.
- Round number > 99: helper rejects with exit 1 (3-digit format `round-NNN`).

### Error Scenarios
- Target spec folder doesn't exist: exit 1.
- `ai-council/` partial state from prior aborted run: helper detects and exits 2 unless `--force`.
- Stdin closed without input + no `--input-file`: exit 1 with usage.

### State Transitions
- Round 1 then round 2 on same packet: round-001 untouched, round-002 added (matches packet-080 round-2 smoke-test behavior).
- Re-running same round: idempotent overwrite of that round's files only.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 15/25 | Files: 12, LOC: ~700-1200, Systems: helper + schema + tests + mirrors |
| Risk | 10/25 | Auth: N, API: N, Breaking: N (additive); mirror sync is high-risk if drift introduced |
| Research | 3/20 | Pre-researched (packet 080 deep-research §7 specifies scope) |
| Multi-Agent | 8/15 | Workstreams: helper, schema, tests, mirrors |
| Coordination | 7/15 | 4-runtime mirror sync; vitest fixture authoring; agent body editing |
| **Total** | **43/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Helper parser silently mis-parses optional sections | M | M | Fixture coverage (3 fixtures); strict-required vs optional contract |
| R-002 | 4-runtime mirror drift after future agent body edits | H | H | Parity test at commit time; CI gating possible follow-on |
| R-003 | output-schema.md and agent body §8 drift | M | L | Single source of truth doc; agent body §8 cites it; helper parser cites it |
| R-004 | Helper added but no caller actually invokes it | M | M | §17 normative wording; multiple caller-pattern recipes |
| R-005 | Scope creep into dedicated skill folder | H | L | Explicit non-goal; ADR-001; deep-research verdict cited |
| R-006 | Vitest config issues (pre-existing) block helper test | L | M | Codex-side targeted run as fallback |

---

## 11. USER STORIES

### US-001: Persist a council dispatch deterministically (Priority: P0)

**As a** maintainer who dispatches `@multi-ai-council` on a spec packet, **I want** a single command that takes the council report and writes the canonical `ai-council/` artifacts, **so that** every dispatcher produces identical layouts without hand-rolling persistence.

**Acceptance Criteria**:
1. Given a council report markdown, When I run `node persist-artifacts.cjs <packet> --input-file report.md`, Then `<packet>/ai-council/{config,strategy,state.jsonl,seats/round-001/*,deliberations/round-001.md,council-report.md}` are written.
2. Given the same input run twice, When I compare the second run's outputs, Then they are byte-identical to the first.

### US-002: Catch 4-runtime mirror drift at test time (Priority: P1)

**As a** maintainer editing `.opencode/agents/multi-ai-council.md`, **I want** a parity test that flags when `.claude/`, `.gemini/`, or `.codex/` mirrors fall out of sync with the canonical, **so that** I never ship a packet with inconsistent runtime behavior.

**Acceptance Criteria**:
1. Given all 4 runtimes have identical normalized content, When I run the parity vitest, Then it passes.
2. Given I edit `.opencode/agents/multi-ai-council.md` without mirroring, When I run the parity vitest, Then it fails with a clear diff showing which runtime drifted.

---

## 12. OPEN QUESTIONS

- Does the helper need a `--dry-run` mode for CI usage? Current preference: yes, but defer to a P2 if scope creeps.
- Should the parser tolerate ASCII-only fallback for locale-edge tools, or require UTF-8? Current preference: UTF-8 required (matches existing scripts).
- Should the mirror parity test live under `system-spec-kit/scripts/tests/` or as a general repo CI hook? Current preference: tests/ for now; CI hook in a follow-on.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Predecessor packet**: `.opencode/specs/skilled-agent-orchestration/080-multi-ai-council-output-protocol/` (research.md §7 contains the detailed scope)
