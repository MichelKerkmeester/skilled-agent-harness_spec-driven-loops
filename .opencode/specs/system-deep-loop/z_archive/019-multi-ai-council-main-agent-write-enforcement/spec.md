---
title: "Feature Specification: Multi-AI Council main-agent write enforcement [skilled-agent-orchestration/100-multi-ai-council-main-agent-write-enforcement/spec]"
description: "Multi-AI Council, when invoked directly as a main agent in opencode (Depth 0, no orchestrator wrapper), routinely fails to write ai-council/** artifacts despite §12/§13/§16 documenting the layout, invocation contract, and writer library. The agent body has no enforcement gate that BLOCKS completion when artifacts are not persisted, no spec_folder resolution step at the start of the workflow, and no clarification fallback when the user invokes the council without naming a packet. This packet adds the missing enforcement: (1) a packet-resolution gate at the top of §1 RECEIVE, (2) a hard write-or-fail rule in §7 ALWAYS, (3) a persistence checklist in §9 OUTPUT VERIFICATION, and (4) a HALT-and-ASK escape for missing spec_folder. All 4 runtime mirrors flip together."
trigger_phrases:
  - "multi-ai-council main agent"
  - "council main agent enforcement"
  - "council main agent write"
  - "council not writing artifacts"
  - "council opencode main agent"
  - "ai-council folder not created"
  - "100 multi-ai-council main agent"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/100-multi-ai-council-main-agent-write-enforcement"
    last_updated_at: "2026-05-09T17:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded L2 spec"
    next_safe_action: "Dispatch implementation"
    blockers: []
    key_files:
      - ".opencode/agents/multi-ai-council.md"
      - ".claude/agents/multi-ai-council.md"
      - ".codex/agents/multi-ai-council.toml"
      - ".gemini/agents/multi-ai-council.md"
      - ".opencode/skills/system-spec-kit/references/multi-ai-council/folder-layout.md"
      - ".opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "council-main-agent-enforcement-2026-05-09"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "HALT-and-ASK vs auto-staging when no spec_folder resolves?"
      - "§9 minimum artifact set vs ai-council/ root only?"
    answered_questions:
      - "Does 098 cover this? NO — 098 added capability, 100 adds compulsion."
      - "Does 089 cover this? NO — 089 documented layout, did not gate completion."
      - "Opencode-specific? Mostly — gap exists in 4 runtimes, manifests most in opencode main-agent dispatch."
---
# Feature Specification: Multi-AI Council main-agent write enforcement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-09 |
| **Branch** | `main` |
| **Predecessor** | `080-multi-ai-council-output-protocol/`, `089-multi-ai-council-persistence/`, `092-multi-ai-council-deferrals/`, `098-multi-ai-council-write-authority/` |
| **Successor** | None planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

When the Multi-AI Council is invoked directly as a main agent in opencode (a Depth 0 user-initiated dispatch with no orchestrator wrapper), the council frequently completes its deliberation and returns a chat-form Multi-AI Council Report **without writing any `ai-council/**` artifacts to the spec folder**. The capability is in place — packet 098 shipped scoped-write permissions across all 4 runtime mirrors and the writer library lives at `.opencode/skills/system-spec-kit/scripts/multi-ai-council/lib/persist-artifacts.js`. The protocol is documented — §12 (folder layout), §13 (invocation contract), §14 (state schema), and §16 (persistence protocol) describe what to write and which functions to call. But the agent body has no **enforcement gate** that REQUIRES persistence before completion. Specifically:

1. **§1 workflow has no packet-resolution step.** RECEIVE → PREPARE → DIVERSIFY → ... → DELIVER. Nowhere does the workflow say "first determine which packet's `ai-council/` you will write to." When the user invokes via opencode's main-agent slot without naming a spec folder, the council proceeds without resolving a target.
2. **§12 OUTPUT PROTOCOL is conditional.** It says "**When invoked with a `spec_folder`,** persist council artifacts under `ai-council/`." The conditional implies persistence is optional when no `spec_folder` is in the prompt — and there is no instruction to derive one.
3. **§7 ALWAYS list omits the lower-bound write requirement.** It enforces upper-bound scope ("Modify files outside ai-council/** is forbidden") but never enforces the floor ("you MUST write inside ai-council/**"). The NEVER list mirrors this asymmetry.
4. **§9 OUTPUT VERIFICATION pre-delivery checklist has no artifact check.** Ten verification items cover deliberation quality and plan feasibility, but none ask "did I write ai-council-state.jsonl? does council-report.md exist?"
5. **§13 INVOCATION CONTRACT is descriptive, not prescriptive.** It says "if no `ai-council/` folder exists, create the skeleton" — but as a documentation paragraph, not a STEP-NUMBERED gate that the workflow loop can fail on.

The cumulative effect: the agent reasons through diverse seats, runs cross-critique, scores the rubric, composes a synthesized plan, and delivers a chat report — and the user has nothing on disk afterwards. The council looks like it executed correctly; the artifact tree never materializes.

### Purpose

Add the missing enforcement gates so the Multi-AI Council, when invoked as a main agent in any runtime, cannot reach DELIVER without resolving a target packet and writing the canonical `ai-council/**` artifact set. Persistence becomes a hard precondition for completion, not an optional outcome. When the user invokes the council without naming a packet, the agent HALTs at RECEIVE and asks for the spec folder rather than running an unrooted deliberation that produces no artifacts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**§1 workflow changes — add packet resolution as a pre-step in 4 runtime mirrors.**
- Insert a new step `0. RESOLVE` (or rename RECEIVE to fold this in) that REQUIRES the agent to determine the target packet path before any seat dispatch:
  1. If the prompt names a spec folder explicitly, use it.
  2. Else, check the active continuity ladder (handover.md → _memory.continuity → spec.md frontmatter packet_pointer) for an active packet.
  3. Else, scan the working directory for the nearest `specs/<track>/<NNN-name>/` ancestor and use that.
  4. Else, HALT and ask the user "Which spec folder should I persist `ai-council/` artifacts under?"
- Step 0 fails closed: if none of (1)–(3) yield a packet path AND the user does not provide one when asked, the council MUST NOT proceed to DIVERSIFY.

**§7 ALWAYS list — add a hard write-or-fail rule.**
- New bullet: "Persist `ai-council/**` artifacts directly via the `lib/persist-artifacts.js` named exports BEFORE claiming completion. The minimum required artifact set is: `ai-council-config.json`, `ai-council-state.jsonl` (with at least `round_start` + `seat_returned`×N + `deliberation_synthesized` + `round_end` + `council_complete` events), `ai-council-strategy.md`, `seats/round-NNN/seat-MMM-*.md` for each dispatched seat, `deliberations/round-NNN.md`, and `council-report.md`."
- Mirror in §7 NEVER list: "Deliver a council report without persisting the canonical artifact set."

**§9 OUTPUT VERIFICATION checklist — add a PERSISTENCE VERIFICATION block.**
- New mandatory block (parallel to MULTI-AI COUNCIL VERIFICATION, PLAN VERIFICATION, and EVIDENCE VALIDATION):
  ```
  PERSISTENCE VERIFICATION (MANDATORY):
  [] Resolved target packet path before dispatch (cite the path).
  [] ai-council/ directory exists at the target path.
  [] ai-council-config.json written with current_round and status.
  [] ai-council-state.jsonl contains round_start, seat_returned, deliberation_synthesized, round_end, council_complete events.
  [] ai-council-strategy.md written with charter content.
  [] seats/round-NNN/seat-MMM-*.md exists for every dispatched seat.
  [] deliberations/round-NNN.md written with comparison + synthesis.
  [] council-report.md written with final synthesized plan.
  [] artifact_written events appended for every persistence call.
  ```
- Add to the SELF-CHECK 10-question list: "Q11. Did I persist the canonical ai-council/** artifact set, including council-report.md? (YES/NO)" and update "If ANY answer is NO → DO NOT CLAIM COMPLETION".

**§13 INVOCATION CONTRACT — promote first-call sequence from prose to numbered gate.**
- Restructure the prose paragraph into a numbered checklist that maps 1:1 to writer functions: `writeConfig` → `writeStrategyMd` → `writeStateJsonl(round_start)` → dispatch seats → `writeSeat`×N → `writeStateJsonl(seat_returned)` → `writeDeliberation` → `writeStateJsonl(deliberation_synthesized + round_end)` → convergence check → (if converged) `writeReport` → `writeStateJsonl(council_complete)`.
- Make explicit: "Each numbered step in this contract MUST emit an `artifact_written` event before the next step begins."

**§12 OUTPUT PROTOCOL — remove the conditional.**
- Replace "When invoked with a `spec_folder`, persist council artifacts under `ai-council/`" with "Persist council artifacts under `<packet>/ai-council/` where `<packet>` is the path resolved at Step 0 RESOLVE. Persistence is mandatory; the conditional language was removed because Step 0 makes the packet path always-available."

**4-runtime mirror parity.**
- The 4 runtime mirrors must carry IDENTICAL §1 / §7 / §9 / §12 / §13 enforcement language (modulo runtime-specific frontmatter):
  - `.opencode/agents/multi-ai-council.md`
  - `.claude/agents/multi-ai-council.md`
  - `.codex/agents/multi-ai-council.toml`
  - `.gemini/agents/multi-ai-council.md`
- Existing 4-runtime parity test from packet 098 should already cover this; if not, extend it.

### Out of Scope

- **Any change to scoped-write permissions or path-scope enforcement.** Packet 098 owns that surface; this packet only adds enforcement on top of existing capability.
- **Any change to the writer library at `lib/persist-artifacts.js`.** Writers, audit-trail format, and rollback semantics are unchanged. This packet only changes the agent body to require their use.
- **Any change to seat diversity, scoring rubric, or convergence signal.** §3, §6, §15 stay as-is.
- **Auto-creation of a fallback `ai-council-staging/` folder when no packet resolves.** Open Question Q1 below; if the user prefers HALT-and-ASK over auto-staging, this packet ships HALT-and-ASK and the auto-staging path is left as a non-goal.
- **Backporting the new enforcement to in-flight council runs.** Existing `ai-council/` folders from prior dispatches stay as-is; new dispatches use the new gates.
- **Validator changes outside the agent body.** `validate.sh` does not need a new check; the enforcement lives in the agent's reasoning loop and the §9 self-check.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agents/multi-ai-council.md` | Modify | Add Step 0 RESOLVE; flip §12 from conditional to unconditional; add hard write rule to §7 ALWAYS + NEVER; add PERSISTENCE VERIFICATION block to §9; renumber §13 first-call sequence as a numbered gate. |
| `.claude/agents/multi-ai-council.md` | Modify | Same body changes; preserve mirror parity. |
| `.codex/agents/multi-ai-council.toml` | Modify | Same body changes (TOML field-encoded); preserve mirror parity. |
| `.gemini/agents/multi-ai-council.md` | Modify | Same body changes; preserve mirror parity. |
| `.opencode/skills/system-spec-kit/references/multi-ai-council/folder-layout.md` | Modify | Add a §0 paragraph: "Persistence is mandatory for every council run. The target packet path is resolved at agent Step 0 RESOLVE." Cite the new agent body section. |
| `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md` | Modify | Append a paragraph: "Every council run MUST close with `council_complete` after `writeReport`. Runs that exit before `council_complete` are incomplete and the agent has violated §9 OUTPUT VERIFICATION." |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Agent body §1 includes Step 0 RESOLVE before DIVERSIFY. | All 4 runtime mirrors carry the new step. The step lists the 4-stage resolution rule (prompt → continuity → cwd ancestor → HALT-and-ASK). |
| REQ-002 | §7 ALWAYS list contains the hard write-or-fail rule. | All 4 mirrors enforce: persist canonical artifact set BEFORE claiming completion. NEVER list mirrors the constraint. |
| REQ-003 | §9 OUTPUT VERIFICATION includes PERSISTENCE VERIFICATION block. | All 4 mirrors carry the 9-item persistence checklist. SELF-CHECK Q11 added. "DO NOT CLAIM COMPLETION" failure handler updated to cover Q11. |
| REQ-004 | §12 OUTPUT PROTOCOL is unconditional. | The "When invoked with a spec_folder" conditional is removed. Replaced with the always-on persistence rule referencing Step 0 RESOLVE. |
| REQ-005 | §13 INVOCATION CONTRACT first-call sequence is numbered with explicit writer-function calls. | Sequence enumerates writeConfig → writeStrategyMd → writeStateJsonl(round_start) → dispatch → writeSeat → writeStateJsonl(seat_returned) → writeDeliberation → writeStateJsonl(round_end) → writeReport → writeStateJsonl(council_complete). Each step requires an artifact_written event. |
| REQ-006 | 4-runtime body parity holds. | Existing 4-runtime parity test from 098 passes after changes. If the test does not cover §1/§7/§9/§12/§13 body content, extend it. |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | folder-layout.md adds the persistence-mandatory note. | Reference doc cites the new agent §1 RESOLVE step. |
| REQ-008 | state-format.md adds the council_complete-required note. | Reference doc states that runs without council_complete are incomplete. |
| REQ-009 | HALT-and-ASK fallback wording is clear. | When no packet resolves, the agent emits a single user-facing question listing the candidate packets it tried and explicitly NOT a chat report. |
| REQ-010 | Sandbox smoke verification. | Dispatch the council against a small planning question via opencode main-agent slot WITHOUT naming a spec folder; confirm the agent HALTs at Step 0 RESOLVE. Then re-dispatch naming a packet; confirm the canonical artifact set materializes. |

### P2 — Refinement

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Add a §9 verification example that uses the SELF-CHECK output as the first paragraph of the chat report. | Post-deliberation chat output begins with the 11-question self-check result so the user can audit persistence at a glance. |
| REQ-012 | Document the enforcement deltas in the council changelog (if one exists in the skill). | If `.opencode/skills/system-spec-kit/multi-ai-council-changelog.md` exists, append a v1.3 entry. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All P0 requirements (REQ-001..REQ-006) pass acceptance criteria.
- **SC-002**: 4-runtime parity test (from packet 098) passes after the body changes.
- **SC-003**: `bash validate.sh skilled-agent-orchestration/100-multi-ai-council-main-agent-write-enforcement --strict` exits 0.
- **SC-004**: Sandbox smoke (REQ-010) confirms: (a) no-packet invocation HALTs at Step 0 with a question, (b) packet-named invocation produces the full canonical artifact set including `council-report.md` and `council_complete` event.
- **SC-005**: The user-facing failure mode "council ran but no artifacts on disk" is no longer reproducible in opencode main-agent dispatches.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | HALT-and-ASK is annoying for casual planning chats where the user just wants a quick deliberation. | Med | Open Question Q1; if confirmed, add an explicit `--no-persist` flag wording so the user can opt out per-call. Until then, the council is genuinely persistence-only. |
| Risk | New enforcement breaks an in-flight workflow that relied on the conditional §12 behavior. | Low | Forward-only scope: existing council runs already either persisted or didn't; the new gates apply to dispatches AFTER the body change ships. |
| Risk | 4-runtime body drift slips through if the parity test does not cover §1/§7/§9/§12/§13 prose. | High | Audit the existing parity test (REQ-006); extend it if it only checks frontmatter/permission YAML. |
| Risk | The agent reasons that the §9 PERSISTENCE VERIFICATION block can be self-attested without actually running the writers. | Med | Pair the checklist with a hint to verify by reading the on-disk artifact (the agent has Read permission). Add a "[] Verified by Read of council-report.md last 50 chars" item. |
| Dependency | Packet 098 scoped-write permissions and path-scope enforcement | High | Permissions are already in place; this packet builds on top. |
| Dependency | `lib/persist-artifacts.js` named exports | High | Library exists per packet 098; no changes needed. |
| Dependency | 4-runtime parity test from packet 098 | High | Re-use; extend if needed. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Step 0 RESOLVE adds ≤ 100ms wall-clock for happy-path packet resolution (single Read of handover.md or one cwd ancestor scan).
- **NFR-P02**: §9 PERSISTENCE VERIFICATION self-check adds ≤ 50ms (item-by-item check against in-memory state).

### Security

- **NFR-S01**: Step 0 RESOLVE never writes outside the resolved packet path. The HALT-and-ASK branch writes nothing.
- **NFR-S02**: Verification by Read (the optional item under REQ-011 / risk-mitigation) MUST scope reads to `<packet>/ai-council/**`; no broad codebase scanning during verification.

### Reliability

- **NFR-R01**: HALT-and-ASK fallback is idempotent: if the user repeatedly invokes the council with no packet, each invocation produces the same question without dispatching seats.
- **NFR-R02**: Persistence enforcement is per-round: a multi-round council that completes round 1 and fails round 2 still has round-1 artifacts on disk and a partial state log; convergence-failure rollback (per packet 098 §18) handles cleanup.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- **No packet path resolvable AND non-interactive runtime**: the agent emits the HALT-and-ASK question as its only output and does not dispatch seats. The runtime treats this as a successful completion (the agent did its job — it asked).
- **Packet path resolves to a folder that does not exist**: the agent creates the missing `<packet>/ai-council/` directory (mkdir -p semantics, per packet 098).
- **Packet path resolves to a folder with stale prior `ai-council/` content**: per §13 subsequent-call rules, the agent reads the existing config + state log and increments `current_round`. No data is overwritten.

### Error Scenarios

- **Writer function throws mid-round (e.g., disk full)**: surfaces as a typed error in the council's reasoning context; the council emits a rollback event per packet 098 §18 and HALTs without claiming completion.
- **§9 SELF-CHECK Q11 returns NO but the agent attempts to claim completion anyway**: the "DO NOT CLAIM COMPLETION" failure handler is the agent's last line of defense. The user-facing report is replaced with a "council aborted: persistence verification failed" message that names the missing artifacts.
- **User invokes council with `--no-persist` flag (if introduced per Q1)**: explicit opt-out; the agent skips persistence and §9 PERSISTENCE VERIFICATION is replaced with an "[] Persistence skipped per --no-persist flag" item. Out of scope for this packet unless Q1 is resolved that way.

### State Transitions

- **Mid-round timeout from a council seat**: existing §10 timeout handling applies. Persistence still required for the surviving seats and partial deliberation.
- **Convergence-not-reached at max_rounds**: existing §15 escape hatch applies. `council_complete` event still emitted with `convergence: false`. `council-report.md` still written, with the report flagging unresolved alternatives.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 4 agent body files (~150 LOC of edits each in the same sections) + 2 reference doc paragraphs. Net ~700 LOC across mirrors. |
| Risk | 10/25 | Body-only changes; no permission flips, no schema changes, no library changes. Risk is regression on the parity test and on the HALT-and-ASK UX. |
| Research | 6/20 | Self-contained: agent body is the spec; predecessor packets 080/089/092/098 supply context. No external research. |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Q1**: When no spec_folder resolves at Step 0, should the agent (a) HALT-and-ASK the user, or (b) auto-create a default `.opencode/specs/_ai-council-staging/` folder and persist there with a warning? **Recommendation**: (a) HALT-and-ASK. Auto-staging risks scattering orphan council reports across the repo; the question is cheap.
- **Q2**: Should the §9 PERSISTENCE VERIFICATION block also require a Read-after-Write verification (the agent reads council-report.md back to confirm content), or is the writer's read-back checksum (per packet 098 NFR-S02) sufficient? **Recommendation**: rely on writer checksums; an extra Read inflates token cost without catching new failure modes.
- **Q3**: Does this packet need a `--no-persist` opt-out flag for casual planning chats? **Recommendation**: defer to a follow-on packet if usage data shows the HALT-and-ASK becomes annoying. Don't add the flag pre-emptively.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Predecessors**: `080-multi-ai-council-output-protocol/`, `089-multi-ai-council-persistence/`, `092-multi-ai-council-deferrals/`, `098-multi-ai-council-write-authority/`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **References (existing)**: `.opencode/skills/system-spec-kit/references/multi-ai-council/folder-layout.md`, `state-format.md`, `convergence-signals.md`, `seat-diversity.md`
