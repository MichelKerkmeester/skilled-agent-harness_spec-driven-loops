---
title: "Feature Specification: Compact fable-5 governor capsule on the live per-turn skill-advisor hook reminder"
description: "Surface a compact ~90-word, 4-rule generic fable-5 governor capsule on the live per-turn skill-advisor reminder so efficiency doctrine rides a channel that fires every turn instead of decaying on a cold read surface."
trigger_phrases:
  - "fable-5 governor capsule"
  - "governor on the skill-advisor hook"
  - "per-turn governor reminder"
  - "fable governor render.ts"
  - "B2 governor capsule"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/144-operate-like-fable-5/005-governor-capsule-hook"
    last_updated_at: "2026-06-15T14:06:37Z"
    last_updated_by: "planning-author"
    recent_action: "Authored planning doc set for the B2 governor capsule phase"
    next_safe_action: "Implement: create fable-governor.md, edit render.ts, rebuild advisor"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/constitutional/fable-governor.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-skilled-agent-orchestration/144-operate-like-fable-5/005-governor-capsule-hook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Compact fable-5 governor capsule on the live per-turn skill-advisor hook reminder

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The fable-5 efficiency doctrine (result-first output, low token burn, commit-and-move) lives only on cold read surfaces like `AGENTS.md` / `CLAUDE.md`, which decay out of context as a session grows; there is no behavioral setpoint that re-asserts itself every turn. The B2 recommendation is the highest-leverage behavioral lever in the whole map (6/6 lineage agreement, the only STRONG-6 in Tier B) precisely because a live per-turn channel already fires: the skill-advisor reminder injects `HYGIENE_DIRECTIVE` into every advisor brief at `render.ts:51-53`, but it carries no efficiency governor. Round-4 proved the sizing objection is moot: `reinject.sh:16-18` distills an entire 8-rule governor into a single ~90-word paragraph, so a compact 4-rule capsule fits one dense paragraph without bloating the near-budget AGENTS.md/CLAUDE.md twin.

### Purpose
Surface a compact, generic, ~90-word 4-rule fable-5 governor capsule on the live per-turn skill-advisor reminder — the same emission path that already carries the comment-hygiene reminder — so efficiency doctrine becomes a self-re-asserting per-turn thermostat rather than a decaying cold-read setpoint.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new canonical source-of-truth doc holding the 4 generic governor rules, so the capsule text has one place to live and review.
- Surfacing the capsule text in the per-turn skill-advisor reminder, alongside the existing comment-hygiene directive, so all hook-capable runtimes receive it.
- Rebuilding the compiled skill-advisor artifact so the new reminder string ships to the daemon.
- Keeping the capsule generic (problem-not-self, outcome-over-process, commit-and-move, minimum-honest-qualifier) and bounded to ~90 words.

### Out of Scope
- The structural subagent-visible governor channel (agent prompts / `renderPromptPack`) — that is recommendation B3, owned by phase 006, because the per-turn hook is subagent-blind and needs a separate carrier.
- Model-family specialization of the rules (Opus-specific phrasing, etc.) — deferred per open question 1; this phase ships generic rules first.
- Behavioral measurement of the capsule's effect — that is the C1 baseline in phase 003 and re-measurement after this lands; this phase only surfaces the capsule.
- Editing `AGENTS.md` / `CLAUDE.md` doctrine spine text — that is recommendation A2, owned by phase 004.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/constitutional/fable-governor.md` | Create | Canonical home for the 4 generic governor rules (reason about the problem not yourself; outcome over process / result-first; commit and move with `// DECISION:`; minimum honest qualifier). Generic first; model-family specialization deferred. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts` | Modify | Add a compact ~90-word governor capsule constant next to `HYGIENE_DIRECTIVE` (render.ts:51-53) and append it on the same per-turn reminder path that already emits the comment-hygiene reminder. Then rebuild the compiled artifact. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The governor capsule surfaces in the per-turn skill-advisor reminder. | Run the advisor render path; the rendered brief string contains the 4-rule capsule text on the same emission as `HYGIENE_DIRECTIVE`. |
| REQ-002 | The capsule lives in one canonical source doc. | `.opencode/skills/system-spec-kit/constitutional/fable-governor.md` exists and states the 4 generic rules verbatim with the inherited G4 honesty guardrail. |
| REQ-003 | The capsule is bounded to ~90 words and generic. | Word count of the capsule paragraph is <=~90 words and the text contains no model-name (`Opus`, `gpt-5`, `claude`, etc.); a `vitest` assertion enforces the bound. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The compiled advisor artifact ships the new reminder. | Rebuild succeeds; the built artifact (not just the `.ts` source) contains the capsule text. |
| REQ-005 | The capsule inherits G4 honesty (steers efficiency, not capability). | The capsule and `fable-governor.md` state the efficiency-not-capability guardrail; no rule instructs the agent to skip verification, tests, or required gates. |
| REQ-006 | The reminder is cross-runtime aware. | `fable-governor.md` documents the 3 hook carriers (Claude/Codex `user-prompt-submit.ts` `additionalContext`, OpenCode `experimental.chat.system.transform`) so the capsule's reach is understood. |
| REQ-007 | The capsule does not break the existing reminder contract. | Existing render `vitest` suite still passes (hygiene directive present, sanitization and token-cap behavior unchanged). |
| REQ-008 | The capsule is not duplicated into the AGENTS.md/CLAUDE.md twin. | No edit to `AGENTS.md` / `CLAUDE.md` in this phase (that is A2 / phase 004); the capsule rides only the hook. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 4-rule fable-5 governor capsule is present in every rendered per-turn advisor reminder, verified by a `vitest` assertion on the render output.
- **SC-002**: The capsule paragraph is <=~90 words and contains no model-family-specific phrasing, so it is portable across the Claude/Codex/OpenCode hook carriers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 measurement baseline (C1) | Without a captured baseline, the capsule's effect on tool:text ratio and caveat density cannot be proven, only asserted. | Land 003 first; this phase only surfaces the capsule, re-measurement happens after. |
| Dependency | Phase 004 doctrine spine (A2) + creed | The capsule is the per-turn thermostat for the doctrine A2 puts on the cold surface; without A2 the setpoint and thermostat are split. | Complement 004; capsule text stays self-contained so it reads correctly even standalone. |
| Risk | Capsule bloats the per-turn reminder / token budget | Med | Hard-cap at ~90 words (proven viable by `reinject.sh:16-18`); keep it one paragraph; the existing token-cap clamp in `render.ts` still applies to upstream brief content. |
| Risk | Reads as capability throttle rather than efficiency steer | Med | Inherit the G4 honesty guardrail verbatim; rule 3 (commit-and-move) explicitly reserves uncertainty markers for real irreducible uncertainty and never tells the agent to skip verification. |
| Risk | Hook is subagent-blind, so subagents miss the capsule | Low (scoped out) | Documented; the subagent channel is B3 / phase 006, deliberately out of scope here. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The capsule adds a fixed, bounded string (~90 words, ~500-600 chars) to the reminder; no per-turn computation, so render latency is unchanged within noise.
- **NFR-P02**: The added bytes stay well under the advisor brief's existing token-cap envelope so the reminder is never truncated by the capsule alone.

### Security
- **NFR-S01**: The capsule is a static constant, not user-derived; it is appended after the existing instruction-label sanitization and introduces no new injection surface.
- **NFR-S02**: The capsule text contains no secrets, paths-as-comments, or artifact ids; it is plain durable doctrine text.

### Reliability
- **NFR-R01**: If `fable-governor.md` is absent from session context, the capsule still ships because its text is compiled into the advisor artifact (same resilience pattern as `HYGIENE_DIRECTIVE`).
- **NFR-R02**: A failed rebuild is caught by the build/test gate before ship; the daemon never serves a half-built artifact.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty advisor recommendation: the capsule still appends; it is reminder-level text, independent of whether any skill matched.
- Maximum length: capsule is fixed at ~90 words; it does not grow with brief content, so it cannot push the reminder past its char envelope on its own.
- Reminder already at the token cap: the upstream clamp trims brief body first; the capsule and hygiene directive are appended doctrine, kept short by design.

### Error Scenarios
- Advisor timeout fallback path (`renderAdvisorTimeoutFallback`): the capsule should remain present on the normal reminder; the timeout fallback is a separate minimal string and is not in scope to carry the full capsule.
- Build failure during rebuild: caught by the test/build gate; the prior artifact stays in place until a clean rebuild.
- Missing `fable-governor.md` at author time: the capsule constant is the runtime source-of-truth in `render.ts`; the doc is the human-review source-of-truth — they must be kept in sync by review, not by runtime read.

### State Transitions
- First turn vs later turns: the capsule is per-turn and stateless, so it re-asserts identically on every UserPromptSubmit regardless of session age (the thermostat property).
- Cross-runtime carry: on Claude/Codex it rides `additionalContext`; on OpenCode it rides `experimental.chat.system.transform` — same capsule text, three carriers.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 2 files: one new ~40-line doc, one small constant + append in `render.ts` plus a rebuild. |
| Risk | 9/25 | Advisory text on an already-firing path; no schema, auth, or API change; the only real risk is reminder bloat, hard-capped. |
| Research | 4/20 | Fully grounded by 002 research; B2 is 6/6 STRONG and the sizing question is already answered (`reinject.sh:16-18`). |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Generic vs model-family-specific rules: this phase ships generic per the research recommendation; should phase 006 or a later packet add an Opus/Codex specialization layer, and where would it carry?
- OpenCode `experimental.chat.system.transform` per-turn vs cached semantics: confirmed sufficient as a rideable surface, but is it truly re-evaluated every turn or cached within a session? Affects whether the capsule is a true cross-runtime thermostat or a once-per-session injection on OpenCode.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
