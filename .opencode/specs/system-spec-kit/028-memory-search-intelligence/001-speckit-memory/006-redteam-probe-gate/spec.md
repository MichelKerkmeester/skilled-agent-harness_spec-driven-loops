---
title: "Feature Specification: Red-Team Probe Gate [system-spec-kit/028-memory-search-intelligence/001-speckit-memory/006-redteam-probe-gate/spec]"
description: "One named CI red-team probe gate aggregating the existing per-seam injection sanitizers plus a new deep-loop prompt-pack render probe, holding a zero-success ceiling against poisoned-RAG, query-only-injection, and wrapper-breakout attacks. Folds the no-querytext exfil-audit hygiene as a sub-requirement."
trigger_phrases:
  - "red-team probe gate"
  - "poisoned rag probe"
  - "query only injection probe"
  - "wrapper breakout probe"
  - "exfil audit no querytext"
  - "memory security ci gate"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/006-redteam-probe-gate"
    last_updated_at: "2026-06-19T07:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level 2 implementation spec for the red-team probe gate sub-phase"
    next_safe_action: "Operator review of the candidate status + gate before implementation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-redteam-probe-gate-replan-2026-06-19"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which CI lane runs the aggregate gate, and does run-tests.mjs gain a security group selector?"
      - "Does the deep-loop prompt-pack render probe assert on live callers or on the dead-code renderPromptPack sink?"
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Feature Specification: Red-Team Probe Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Partial Implementation |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Spec-Kit Memory MCP already defends its individual injection seams, but no single gate proves the whole surface holds. The per-seam sanitizers and their tests exist and pass in isolation — `sanitizeSkillLabel` (`lib/utils/skill-label-sanitizer.ts`), `architecture-seam.vitest.ts` (which asserts `'ignore previous instructions' → null`), `bm25-security.vitest.ts`, the adversarial-unicode suite (`tests/security/adversarial-unicode.vitest.ts`), and the poisoning fixtures (`tests/advisor-fixtures/promptPoisoningAdversarial.json`). What is missing, confirmed in research (001 iter-19, 006 SB7), is a single named aggregating CI probe-gate with structured reports and a fixed zero-success ceiling — so the security posture is a scatter of green checkmarks rather than one honest pass/fail. One seam stays entirely uncovered: the deep-loop prompt-pack render path (`deep-loop-runtime/lib/deep-loop/prompt-pack.ts`), where recalled or fanned-out content reaches a prompt template with no injection probe at all.

A second, cross-cutting hole rides alongside it: a namespace-denial audit that stores the rejected probe's query text turns the audit log itself into an exfiltration channel (001 iter-19 `M-exfil-audit-no-querytext`). The audit must record that a denial happened without persisting what was asked.

### Purpose
Stand up one named, zero-success-ceiling CI red-team probe gate that aggregates the existing per-seam sanitizers into a single structured-report run, adds the missing deep-loop prompt-pack render probe, and folds in the no-querytext exfil-audit hygiene as a sub-requirement — so memory's whole injection surface is proven by one gate, not inferred from scattered tests.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A single named CI red-team probe gate (a new aggregating test module + a security lane selector) that runs three attack families with a fixed zero-success ceiling: **poisoned-RAG** (untrusted content recalled into the agent loop), **query-only-injection** (`'ignore previous instructions'`-class payloads in the query path), and **wrapper-breakout** (payloads attempting to escape the recall render wrapper / skill-label sanitizer).
- A new **deep-loop prompt-pack render probe** asserting that injection markers reaching `prompt-pack.ts` rendering are neutralized (the one seam with no current probe).
- Aggregation of the existing per-seam sanitizer assertions (`skill-label-sanitizer`, `architecture-seam`, `bm25-security`, `adversarial-unicode`, the poisoning fixtures) under the named gate with a structured per-probe report (probe id, family, seam, payload class, pass/fail).
- A **zero-success ceiling** with no threshold-relaxation knob: any probe success fails the gate (`audit-coverage floor = 1.0`, no negotiable allowance).
- **M-exfil-audit-no-querytext** (sub-requirement): the namespace-denial audit path records a denial event without storing the probe query text, so the audit log is not itself an exfil channel.

### Out of Scope
- The capture-side write-time injection filter (`M-write-time-injection-filter`, `redaction-gate.ts`) — orthogonal capture-half candidate; tracked elsewhere.
- The recall-side `source_kind`-gated render escaper (the real C8 / SB8) — its own Wave-1 candidate; this gate *tests against* it but does not build it.
- Full namespace authorization / multi-principal enforcement — research dispositions `M-exfil-audit-no-querytext` as "mostly N/A (no multi-principal boundary); only the audit-without-storing-probe-text hygiene transfers."
- Any change to the per-seam sanitizers' behavior — the gate aggregates and probes them; it does not rewrite them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/security/redteam-probe-gate.vitest.ts` | Created | The named aggregating gate: poisoned-RAG + query-only-injection + wrapper-breakout families, zero-success ceiling, structured per-probe report |
| `.opencode/skills/system-spec-kit/mcp_server/tests/security/redteam-fixtures/probe-payloads.json` | Created | Deterministic probe payload fixtures per attack family |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` | Modified | Deny audit metadata/reason sanitization so rejected prompt/query text is not persisted |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/run-tests.mjs` | Modified | Add a security lane selector so the gate runs as one named group |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modified | Route `npm test -- --security` arguments to the lane selector instead of the shell tail |
| `.opencode/skills/deep-loop-runtime/tests/unit/prompt-pack-injection.vitest.ts` | Pending | Left pending because this turn was scoped to the Spec-Kit Memory MCP server code surface |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | One named CI red-team probe gate exists and runs as a single group | A new `redteam-probe-gate.vitest.ts` runs via a security lane selector in `run-tests.mjs`; invoking the gate executes all three attack families and emits a structured per-probe report |
| REQ-002 | Zero-success ceiling, no relaxation knob | Any probe success fails the gate; there is no env var / config that lowers the ceiling below 1.0 audit-coverage. A grep of the gate for a threshold/allowance knob returns none (research: "no threshold relaxation") |
| REQ-003 | Poisoned-RAG family | A probe stores untrusted content (e.g. via `memory_save`) carrying injection markers, recalls it under both full and compact recall, and asserts the markers are neutralized at the render boundary — covers the threat model 005/Round-O confirmed real (untrusted content can become a recalled memory via `memory_save`) |
| REQ-004 | Query-only-injection family | A probe sends `'ignore previous instructions'`-class payloads through the query/label path and asserts neutralization, aggregating the existing `architecture-seam` assertion (`→ null`) under the named gate |
| REQ-005 | Wrapper-breakout family | A probe attempts to escape the recall render wrapper / skill-label sanitizer (tag-injection, unicode-instructional, nested-wrapper) and asserts the wrapper holds, reusing the `adversarial-unicode` + `unicodeInstructionalSkillLabel` surfaces |
| REQ-006 | Deep-loop prompt-pack render probe | A new probe drives injection markers into `prompt-pack.ts` rendering and asserts neutralization — the one seam with no current probe (006 SB7: "a new deep-loop prompt-pack render probe — the one uncovered seam") |
| REQ-007 | M-exfil-audit-no-querytext | The namespace-denial audit path records a denial event without persisting the probe query text; a gate assertion proves the stored audit record contains no verbatim query, at audit-coverage floor 1.0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Structured report is machine-readable | The per-probe report is structured (probe id, family, seam, payload class, verdict) so a failing probe names exactly which seam and payload broke, not just a count |
| REQ-009 | Both recall shapes covered | Poisoned-RAG and wrapper-breakout probes run under BOTH full recall and compact recall (research: "the test gate that keeps C8 honest under BOTH full and compact recall") |
| REQ-010 | Gate is additive and reversible | The gate adds tests + a lane selector only; it changes no sanitizer behavior and no recall output. Reverting the gate restores the prior suite exactly |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One named gate runs all three attack families + the prompt-pack probe + the exfil-audit assertion and emits a single structured pass/fail with a zero-success ceiling.
- **SC-002**: The previously-uncovered deep-loop prompt-pack render seam has a passing injection probe.
- **SC-003**: A namespace-denial audit record provably contains no verbatim probe query text (audit-coverage 1.0).
- **SC-004**: The gate is additive — `tsc`/build green, the existing suite still passes, `validate.sh --strict` green on this packet, no sanitizer or recall behavior changed.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:implementation-status -->
## 5A. IMPLEMENTATION STATUS

### Implemented
- **M-redteam-probe-gate (MCP server seams)**: Implemented as `tests/security/redteam-probe-gate.vitest.ts`, default-on when invoked through `npm test -- --security`. The gate aggregates poisoned-RAG, query-only-injection, wrapper-breakout, and exfil-audit probes with a structured report and zero-success ceiling. It does not change sanitizer or recall rendering behavior.
- **M-exfil-audit-no-querytext**: Implemented in `lib/governance/scope-governance.ts`. Deny audit rows redact raw query/prompt-shaped metadata and instruction-shaped deny reasons before persistence; allow/delete/conflict metadata remains unchanged.

### Left Pending
- **Deep-loop prompt-pack render probe (REQ-006 / SC-002)**: Left pending because the requested implementation surface was `.opencode/skills/system-spec-kit/mcp_server`. The renderer lives in `.opencode/skills/deep-loop-runtime/lib/deep-loop/prompt-pack.ts` and still performs raw variable substitution, so covering it correctly requires a sibling-runtime edit and test.
- **Live `memory_save → recall` integration form of poisoned-RAG (REQ-003 strict integration wording)**: Left pending in favor of deterministic no-live-DB unit coverage, per the user constraint. The implemented gate drives the recalled-content render boundary with precomputed recalled rows.
- **Independent adversarial review (T017)**: Left pending; no separate reviewer seat was run in this implementation turn.

<!-- /ANCHOR:implementation-status -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `source_kind`-gated render escaper (the real C8 / SB8) | The poisoned-RAG / wrapper-breakout probes assert neutralization at render; if the escaper is not yet built, those probes fail by design (red bar = honest gap) | Sequence the escaper first OR land the gate red and let it gate the escaper's merge (the gate is the acceptance test for the escaper) |
| Dependency | Deep-loop `renderPromptPack` is dead-code today (006 RD1: zero production callers) | The prompt-pack probe may assert against a sink with no live caller | Probe the renderer directly as a unit (the seam is real even if the caller is dormant); flag the dead-code status in the report so a future wiring is gated |
| Risk | Threat-model strength (006 most-likely-wrong) | The poisoned-RAG leverage rests on "can untrusted content become a recalled memory" — 005 said yes via `memory_save`; the broad generalization was reachability-gated | Scope the poisoned-RAG probe to the `memory_save → recall` path 005/Round-O confirmed, not the refuted cross-cutting generalization |
| Risk | Zero-success ceiling brittleness | A flaky probe blocks all merges | Make probes deterministic (fixed fixtures, no network/LLM); the ceiling is on probe success, not on incidental flake |
| Dependency | No measured benefit number exists (research §6) | Every leverage tag is structural inference, never benchmarked | Treat this as a correctness/coverage gate, not a tuned-performance change; do not cite leverage numbers |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The gate runs deterministically with no network or LLM calls; total runtime fits the existing security-lane budget (probes are fixture-driven).

### Security
- **NFR-S01**: Zero-success ceiling — audit-coverage floor 1.0, no negotiable allowance and no relaxation knob.
- **NFR-S02**: The exfil-audit path stores no verbatim probe query text; the audit log cannot be read back as the asked question.

### Reliability
- **NFR-R01**: The gate is additive and reversible — reverting restores the prior suite byte-for-byte; no sanitizer or recall behavior is mutated.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty / whitespace-only payload: probe asserts the gate does not false-pass on a no-op payload (negative control).
- Maximum-length / nested-wrapper payload: wrapper-breakout probe covers deeply nested tag-injection.
- Unicode-instructional payload: covered by the existing `unicodeInstructionalSkillLabel` surface reused under the gate.

### Error Scenarios
- Sanitizer throws instead of neutralizing: gate treats a thrown error as a probe FAIL unless it is the intended typed rejection.
- Recalled content in compact recall differs from full recall: both shapes are probed (REQ-009).
- Audit write fails: the exfil-audit assertion fails closed (a missing audit record is a FAIL, not a pass).

### State Transitions
- Partial completion: a single failing probe fails the whole gate (no partial-credit), with the structured report naming the broken seam.
- Dead-code prompt-pack sink: probe runs against the renderer unit and reports the dormant-caller status.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | ~3 new test modules + 1 fixtures dir + run-tests lane + 1 audit-path edit; aggregates existing sanitizers |
| Risk | 12/25 | Security-adjacent + depends on the C8/SB8 escaper; additive/reversible lowers blast radius; no production-code behavior change beyond the audit-path edit |
| Research | 8/20 | Candidate fully traced (001 iter-19, 006 SB7, synthesis 01/04); seams confirmed live; threat model is the one residual |
| **Total** | **34/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which CI lane runs the aggregate gate, and does `run-tests.mjs` gain a dedicated security-group selector vs reusing an existing lane?
- Answered 2026-06-19: `run-tests.mjs` gains a dedicated `--security` / `security` / `redteam-probe-gate` selector; `npm test -- --security` invokes only this lane.
- Answered 2026-06-19: the implementation is scoped to the MCP server. The sibling deep-loop prompt-pack renderer remains pending rather than being patched from this phase.
- Answered 2026-06-19: no `namespace_denied` authorizer seam exists; the implemented seam is `governance_audit` deny persistence, where prompt/query-shaped denial metadata is redacted before storage.
- Answered 2026-06-19: the existing recall render escaper is already present and covered; the gate verifies that behavior without changing it.

<!-- /ANCHOR:questions -->
