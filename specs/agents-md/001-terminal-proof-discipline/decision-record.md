---
title: "Decision Record: Terminal-Proof Discipline and Directive Injection"
description: "Three decisions: the governor injection already exists so the extension rides the same capsule, the patch is applied now with a git revert rollback, and AGENTS.md stays the durable home of the full protocol."
trigger_phrases:
  - "terminal proof decisions"
  - "governor hook finding"
  - "directive capsule decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/001-terminal-proof-discipline"
    last_updated_at: "2026-08-05T00:00:00Z"
    last_updated_by: "pi-terminal-engineer"
    recent_action: "Amended ADR-003 to record the review-directed distributed integration"
    next_safe_action: "Verify the integrated AGENTS.md placements and packet evidence"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-05-agents-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The governor injection already exists; the extension rides the same capsule."
      - "The full protocol belongs in AGENTS.md; the capsule stays a one-line disposition."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Extend the existing governor capsule instead of building a new injection

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-05 |
| **Deciders** | pi-terminal-engineer session |

---

<!-- ANCHOR:adr-001-context -->
### Context

The task asked whether a hook like the governor directive injection could be added or updated. Investigation found the injection already exists and is live in every session. The canonical constant GOVERNOR_DIRECTIVE sits in render.ts line 60, the OpenCode plugin mirrors it in FALLBACK_DIRECTIVE at mk-skill-advisor.js line 46, and the pi runtime wires it through the .pi/extensions/prompt-advisor.ts symlink into the compiled Claude hook chain. This session itself received the capsule, which proves the chain end to end.

The question was therefore not whether to build an injection, but whether to extend the existing one with a proof-over-appearance disposition.

### Constraints

- The pi bridge imports the compiled dist, so any renderer change requires a rebuild to take effect.
- The capsule is appended to every turn in every hook-capable runtime, so the text must stay short.
- The plugin fallback must stay byte-aligned with the renderer so no-brief turns do not diverge.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Add a one-line TERMINAL_PROOF_DIRECTIVE to the existing capsule, composed after the governor directive in the renderer and mirrored in the plugin fallback.

**How it works**: render.ts gains the constant and appends it in the three composition points (two in renderAdvisorBrief, one in renderAdvisorFallbackDirective). mk-skill-advisor.js extends FALLBACK_DIRECTIVE with the same line. A rebuild ships the capsule to the pi bridge and every native runtime.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Extend the existing capsule** | One mechanism, no new hops, proven chain, automatic mirroring | Touches shared infra; requires rebuild | 9/10 |
| New standalone pi extension for terminal directives | Zero impact on other runtimes | Second injection channel, drift risk, more surface | 4/10 |
| AGENTS.md only, no capsule change | Lowest blast radius | Subagents and compacted sessions lose the per-turn restatement | 5/10 |

**Why this one**: The capsule is the thermostat that restates the disposition as context grows. The proof disposition deserves the same treatment as the governor, and the mirroring contract already exists.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Every turn in every hook-capable runtime re-states the proof-over-appearance disposition.
- Terminal-graded tasks get the final-gate discipline even when AGENTS.md content is not in context.

**What it costs**:
- One additional line in every injected capsule. Mitigation: the line is short and dispositional, matching the governor pattern.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Fleet-wide prompt change surprises operators | M | Additive one line; documented in the injection contract pointer |
| Exact-string test assertions break | M | Run both suites and update assertions to the new capsule text |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The user asked for the hook update; the disposition was missing from the capsule |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives scored; standalone extension rejected |
| 3 | **Sufficient?** | PASS | One constant plus one mirror line is the simplest complete change |
| 4 | **Fits Goal?** | PASS | Directly implements the requested hook update |
| 5 | **Open Horizons?** | PASS | The mirroring contract keeps future directives aligned automatically |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- render.ts: TERMINAL_PROOF_DIRECTIVE constant plus three append sites
- mk-skill-advisor.js: FALLBACK_DIRECTIVE mirror line
- dist rebuild so the pi bridge and native runtimes receive the capsule

**How to roll back**: git revert the two source edits, then rerun the build. The dist returns to the prior capsule; no runtime registration changes exist to undo.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Apply the hook patch in this session with a git revert rollback

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-05 |
| **Deciders** | pi-terminal-engineer session |

---

<!-- ANCHOR:adr-002-context -->
### Context

The first attempt ran inside a plan-mode shell that blocked npm, bash scripts, and file deletion, so the patch was recorded but deferred. The user then asked to execute the plan. The shell now permits builds, tests, and deletion.

### Constraints

- The patch must not ship without a green build and green tests.
- The packet must pass strict validation before any completion claim.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Apply the patch now, rebuild, run both test suites, then validate the packet strictly.

**How it works**: Sequence is render.ts edit, plugin mirror edit, npm build, vitest, plugin node test, validate.sh --strict, evidence update, cleanup of the stray probe file.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Apply now** | Ships the requested update with proof | Touches shared infra this session | 8/10 |
| Defer to operator review | Zero session risk | Leaves the plan half-executed | 4/10 |

**Why this one**: The change is additive and reversible, and the execution request is explicit.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The plan completes with proof rather than a handoff note.

**What it costs**:
- Shared advisor infra changes once more. Mitigation: git revert plus rebuild restores the prior state.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Build fails on workstation | H | Source change remains correct; record output and retry |
| Test assertions on exact capsule text | M | Update assertions as part of the patch |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Execution of the recorded plan is the explicit request |
| 2 | **Beyond Local Maxima?** | PASS | Deferral was the prior state and was rejected by the execution request |
| 3 | **Sufficient?** | PASS | Minimal patch plus verification gates |
| 4 | **Fits Goal?** | PASS | Completes tasks T006 through T014 |
| 5 | **Open Horizons?** | PASS | Rollback path stays intact |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Source edits listed in ADR-001 implementation
- Build and test commands: npm --prefix .opencode/skills/system-skill-advisor/mcp-server run build, npm --prefix .opencode/skills/system-skill-advisor/mcp-server test, node --test .opencode/plugins/tests/mk-skill-advisor.test.cjs

**How to roll back**: git revert the source edits and rerun the build.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: AGENTS.md is the durable home of the full protocol

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-05 |
| **Deciders** | pi-terminal-engineer session |

---

<!-- ANCHOR:adr-003-context -->
### Context

The terminal-engineer protocol has five steps plus task-type reminders and terminal discipline rules. The per-turn capsule is one line by design, so it cannot carry the full protocol without bloating every turn in every runtime.

### Constraints

- The capsule stays short (governor pattern).
- The protocol must be present in every session that loads the universal framework.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Keep AGENTS.md as the durable home of the full protocol, distribute each rule into the existing framework authority that governs its precedence, and keep the capsule as a one-line disposition reminder that points at the disposition, not at the doc.

**How it works**: The protocol extends the Four Laws clarification, Verification Standards, Blast-Radius Management, Post-Execution Gates, Execution Behavior, Quality Principles, tool routing, startup recovery, and Quick Reference. The capsule carries the same proof-over-appearance phrasing as a restatement. No standalone protocol block remains to compete with those authorities.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Distributed AGENTS.md integration plus one-line capsule** | Full protocol in its owning framework authorities, restatement every turn | Multiple framework placements must stay coherent | 9/10 |
| Full protocol in the capsule | Always in context | Unacceptable per-turn bloat | 2/10 |
| Capsule only | Zero AGENTS.md churn | Protocol unavailable in long sessions without the doc | 3/10 |

**Why this one**: The governor precedent proves the split: disposition in the capsule, detail in the framework. The review's Protocol-to-Framework Mapping further proves that the framework detail belongs with its existing hard gates, evidence standards, blast-radius rules, execution behavior, tool router, and recovery guidance rather than in one parallel lifecycle.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Terminal-graded tasks always have the protocol and always get the per-turn restatement.
- Rule ownership now communicates precedence: failed checks remain subordinate to Law 4, final-state proof is a post-execution hard gate, and terminal commands remain subordinate to specialized tool routing.

**What it costs**:
- The protocol spans several existing sections plus the capsule disposition. Mitigation: the Quick Reference exposes the end-to-end machine-state flow, while each rule has one authoritative owner.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Phrasing drifts between doc and capsule | L | The capsule text is recorded in this decision record |
| Distributed placements drift apart | L | The review mapping and Quick Reference define the integration contract; completion requires focused diff and strict packet validation |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The protocol was absent from the framework |
| 2 | **Beyond Local Maxima?** | PASS | Capsule-only option scored and rejected |
| 3 | **Sufficient?** | PASS | One hard gate plus local additions to existing authorities and one capsule line |
| 4 | **Fits Goal?** | PASS | Matches the AGENTS.md improvement request |
| 5 | **Open Horizons?** | PASS | Future directives follow the same split |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- AGENTS.md lines 26, 84-113: Law 4 clarification, objective and task-specific proof, sanitization, and dependency acquisition
- AGENTS.md lines 193-201: Final-State Verification hard gate immediately before the unchanged Completion Verification Rule
- AGENTS.md lines 284-318: proof-first planning, smallest-complete-result ownership, bounded debugging, and qualified quality preferences
- AGENTS.md lines 373-388: exact-failure search routing and terminal command discipline subordinate to Grep, Glob, and Read
- AGENTS.md lines 417-419 and 525-526: directive-capsule recovery guidance and machine-state/completion quick-reference flows
- AGENTS.md section 4: remove the standalone Terminal Discipline block after its useful invariants are assigned to the authorities above
- render.ts TERMINAL_PROOF_DIRECTIVE uses the same proof-over-appearance phrasing

**How to roll back**: revert the scoped AGENTS.md integration diff and revert the renderer edit plus rebuild.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
