---
title: "Feature Specification: Retire the Governor and Proof-Over-Appearance Directives"
description: "Two of the three constant directives injected into every prompt on every runtime restated a disposition the system prompt already carries. They are removed at the canonical owner and both fallback emitters, leaving the comment-hygiene directive, which names a specific prohibition a pre-commit gate enforces."
trigger_phrases:
  - "retire governor directive"
  - "proof over appearance removed"
  - "advisor directive block"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/014-retire-governor-and-proof-directives"
    last_updated_at: "2026-08-30T20:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Removed both directives from the canonical renderer, the policy plan, and both fallback emitters"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/system-skill-advisor-bridge.mjs"
      - ".opencode/plugins/system-skill-advisor.js"
      - ".opencode/hooks/injection-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-retire-governor-and-proof-directives"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Retire the Governor and Proof-Over-Appearance Directives

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Handoff Criteria** | No runtime injects either directive, and the one that remains still arrives |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Three constant directives were appended to every advisor brief on every user turn, on every
runtime, independent of what the advisor recommended — the brief could carry no route line at all
and the directives still arrived. Two of them restate a disposition rather than a rule:

- The governor asks for result-first reasoning and less narration.
- Proof-over-appearance asks that only real command output count as evidence.

Both are already carried by the system prompt and the repository's own operating document. Their
own source comments describe them as "the thermostat that re-states the disposition as context
grows" — which is the case for them and also the case against them: a disposition re-asserted every
turn spends context on something that was never in dispute, and a reader who ignores it once
ignores it a hundred times.

The comment-hygiene directive is a different kind of thing. It names one prohibition, and a
pre-commit gate rejects a commit that violates it. That is a rule with an enforcer, not a
disposition, and it stays.

### Purpose

Every prompt carries the directive that has an enforcement mechanism, and nothing else.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The canonical directive text and the block registry that orders it.
- Both fallback emitters, which carry their own literal copies for when the compiled module is unavailable.
- Every test and fixture that asserts the three-directive shape.
- The contract document that catalogs what each hook injects.

### Out of Scope
- The comment-hygiene directive, which has an enforcing gate.
- The advisor route line itself, and the Gate-3 spec-folder question, which are unrelated injections on the same channel.
- The directive-lifecycle dedup machinery, which is orthogonal: it decides *when* a block is re-delivered, not what is in it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp-server/lib/render.ts` | Modify | Remove both constants and their concatenation into the brief |
| `mcp-server/lib/policy-plan.ts` | Modify | Remove both block registrations, their ids, and the recovery branches |
| `mcp-server/plugin-bridges/system-skill-advisor-bridge.mjs` | Modify | Remove the mirrored literals |
| `.opencode/plugins/system-skill-advisor.js` | Modify | Remove the mirrored literals |
| `.opencode/hooks/injection-contract.md` | Modify | Correct the catalog and record why one directive survives |
| tests and fixtures | Modify | Assert the new shape; re-point proxies at the surviving directive |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No runtime injects the governor or proof-over-appearance text, including the fallback paths taken when the compiled renderer is unavailable. |
| REQ-002 | The comment-hygiene directive still arrives on every runtime, unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Tests assert the new shape rather than being deleted, so a reintroduction fails. |
| REQ-004 | The injection catalog matches what is injected, and records why one directive survived and two did not. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A repository search for either directive's text returns nothing outside archived benchmark output.
- **SC-002**: The compiled renderer exports `DIRECTIVES_LABEL` and `HYGIENE_DIRECTIVE`, and nothing else directive-shaped.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A fallback emitter keeps a literal copy and quietly re-injects | High | Both mirrors are edited in the same change and the search covers literal text, not just symbol names |
| Risk | A test asserts the directive as a proxy for "the block was delivered" and is deleted rather than re-pointed | Med | Each such proxy now asserts the surviving directive, so delivery is still covered |
| Dependency | Pi forwards rather than owns the directives | Low | Verified: its adapter holds no copy, so the source removal covers it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Every prompt on every runtime carries less injected context than before, and none carries more.

### Security
- **NFR-S01**: No change to what any hook is permitted to read or write.

### Reliability
- **NFR-R01**: The hook's fail-open behaviour is unchanged; a producer timeout still yields an empty envelope rather than an error.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A brief with no route line: still carries the hygiene directive alone.
- The compiled renderer unavailable: the fallback emitters produce the same reduced block.

### Error Scenarios
- Advisor daemon cold-start timeout: the hook emits `{}`, as before.

### State Transitions
- A session that already received the old three-directive block: the lifecycle dedup treats the changed text as new policy and re-delivers.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Four production files, nine tests and fixtures, two documents |
| Risk | 14/25 | Every runtime's prompt injection, on every turn |
| Research | 4/20 | Emitters enumerated before editing |
| **Total** | **28/70** | **Level 2** |

The deterministic scorer returned Level 1 on lines and file count. Level 2 was chosen because the
change alters what every runtime injects on every turn, which is blast radius the scorer does not
read.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The hygiene directive is now the only constant. If it is ever the whole block, the `Directives:` label costs more than it earns and the block could collapse to a single line.
<!-- /ANCHOR:questions -->
