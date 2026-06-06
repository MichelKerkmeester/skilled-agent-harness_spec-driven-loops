---
title: "009 — Peck Verification Discipline"
description: "Adopt the coherent net-new verification-discipline bundle peck implements in its agent prompts (T5-T9) that the 2026-06-02 README pass missed: completion-verdict freshness binding (anchor), escalation gates, anti-verdict-softening, reviewer read-budget, and a docs-only numeric-severity note. Every rule reuses an existing UX surface with a warn-first message and rides the proven warn->error env-flag rollout. Zero new infrastructure."
trigger_phrases:
  - "027 phase 009"
  - "peck verification discipline"
  - "completion-verdict freshness"
  - "anti-verdict-softening"
  - "reviewer read-budget"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/006-peck-verification-discipline"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 009 from research 006 proposal + integration-plan"
    next_safe_action: "Land 010 fixtures, then implement Phase 1 freshness in WARN mode"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-009-peck-verification-discipline-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Clean-tree precondition scope: whole repo vs packet paths only (default packet-scoped)"
      - "Whether the clock_drift PASS path in continuity-freshness.ts must be tightened or kept as a legit exception"
    answered_questions:
      - "Proposal Packet 009 confirmed as the verification-discipline bundle (T5-T9); T1 -> 011, fixtures -> 010"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: 009 — Peck Verification Discipline

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The 13-iteration peck-source deep-research pass (cross-model verified by MiniMax M3) found a coherent "peck verification discipline" bundle implemented in peck's agent prompts that the 2026-06-02 README pass missed entirely. This packet adopts that bundle as five rules: completion-verdict freshness binding (T6, the anchor), implementer escalation gates (T5), anti-verdict-softening (T7), reviewer read-budget discipline (T8), and a docs-only numeric-severity calibration note (T9). All changes land on agent/skill prompts, the completion gate, and CLAUDE.md/AGENTS.md, with zero overlap with the 027 memory phases 002-008.

The integration thesis is zero new infrastructure: every rule plugs into a surface that already exists. Completion freshness rides `validate.sh`/`spec-doc-structure`; the rest ride structured-verdict/loop-state enforcement; rollout copies the proven `SPECKIT_SAVE_QUALITY_GATE` warn->error convention verbatim. The operator's two top priorities, UX and automation, are first-class requirements here: every rule reuses an existing UX surface with a warn-first, actionable, auto-fix-style message, and freshness ships FULLY-AUTO via `validate.sh`.

**Key Decisions**: Freshness is the anchor and ships warn-first behind `SPECKIT_COMPLETION_FRESHNESS`; the numeric note is docs-only and the literal `score>=4 blocks` rule is rejected; net-new UX/automation opportunities (auto-fix hints, startup freshness indicator, one-command fingerprint refresh, single deep-review verdict, checklist quick-fill) are folded in as requirements.

**Critical Dependencies**: Depends on **010-reviewer-prompt-benchmark-substrate** for the regression fixtures (stale-verdict, softened-Fail, over-read) that make these rules safe to ship; 010 must land first.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Spec-Scaffolded |
| **Parent Packet** | `001-peck-teachings-adoption` |
| **Source** | `research/006-peck-source-deep-mining/sub-packet-proposal.md` §1 (Packet 009), §6, §7; `research/006-peck-source-deep-mining/integration-plan.md` (full); `research/006-peck-source-deep-mining/research.md` §2 (T5,T6,T7,T8,T9) |
| **Depends on** | `010-reviewer-prompt-benchmark-substrate` (regression fixtures; land FIRST) |
| **Coordinates with** | Pending `001/002-self-check-templates` (indirectly, via the completion gate); 011 reuses the same `warn->error` rollout convention |
| **LOC budget** | ~400-650 (prompt/docs + one strict TS rule + flag plumbing) |
| **Branch** | `main` |
| **Created** | 2026-06-06 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Peck's source carries a coherent verification-discipline bundle in its agent prompts that the README-only analysis pass never surfaced, and live spec-kit has a real gap against each piece. The single highest-value gap is completion-verdict freshness: spec-kit's `session_dedup.fingerprint` exists but is never recomputed against content, and a completion claim is bound neither to a content fingerprint nor to a clean working tree, so a green checklist `[x]` survives later in-scope edits that should invalidate it. Around that anchor sit four more real gaps: implementer escalation gates (one-sentence-root-cause-or-escalate, spec-conflict->amendment-not-workaround, 3-strike, reviewers-contradict) are only partially present; anti-verdict-softening sharpness ("do not relabel a Fail as conditional/partial") does not exist; per-read reviewer read-budget justification is absent for `@review`; and per-finding numeric severity calibration is missing. The constraint is that these rules must reuse the surfaces operators already see and must not over-block in-flight work.

### Purpose

Adopt the peck verification-discipline bundle as five warn-first rules that reuse existing UX surfaces and the proven warn->error rollout, anchored on binding completion verdicts to a recomputed content fingerprint plus a clean-tree precondition, so green claims become trustworthy without introducing new infrastructure or over-blocking active work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

This packet is the peck "verification discipline" bundle. It represents the proposal's five phases as plan sections and task groups within this single packet (no nested phase-child folders).

### In Scope

1. **Phase 1 (anchor) — completion-verdict freshness (T6)**
   - Bind checklist `[x]` evidence to a recomputed content fingerprint (reuse `session_dedup.fingerprint`, recompute it against content) plus a clean working-tree precondition.
   - Invalidate green on later in-scope edits.
   - Wiring: `validate.sh --strict` via a strict-only `CONTINUITY_FRESHNESS` check; the completion rule in `CLAUDE.md`/`AGENTS.md` §2; `scripts/validation/continuity-freshness.ts`; `mcp_server/lib/validation/spec-doc-structure.ts` (recompute fingerprint).

2. **Phase 2 — escalation gates (T5)**
   - "One-sentence root-cause or escalate"; "impl conflicts with spec -> escalate for AMENDMENT, not workaround"; 3-strike; reviewers-contradict gates.
   - Wiring: `sk-code/SKILL.md` escalation block; `CLAUDE.md` Logic-Sync.

3. **Phase 3 — anti-softening (T7)**
   - "Do not relabel a Fail as conditional/partial"; always emit a verdict (anti-truncation).
   - Wiring: the completion ritual + the deep-review verdict line.

4. **Phase 4 — reviewer read-budget (T8)**
   - "State the reason before each non-diff Read; never re-read a new/full-content file."
   - ADOPT for `@review`; ADAPT for deep-review/deep-research/`@context` (must NOT override P0 rereads).
   - Include the `.claude/agents/*` mirror updates.

5. **Phase 5 — numeric-severity note (T9, docs only)**
   - `+/-2 context` adjustment note + optional advisory `riskScore` (NON-gating).
   - Do NOT adopt the literal `score>=4 blocks`.
   - Wiring: `sk-code-review`.

6. **UX + automation requirements (operator #1 priority — folded in as first-class)**
   - Each rule reuses an existing surface with a warn-first, actionable, auto-fix-style message (integration-plan §3).
   - Automation class per rule (integration-plan §4): freshness FULLY-AUTO via `validate.sh`; the rest SEMI-AUTO.
   - Warn->error rollout copying `SPECKIT_SAVE_QUALITY_GATE` (flags `SPECKIT_COMPLETION_FRESHNESS` + `..._ENFORCE`); integration-plan §5.
   - Net-new opportunities (integration-plan §6): validator auto-fix hints; startup/brief freshness indicator; one-command fingerprint-refresh helper; single deep-review verdict in `/speckit:complete`; checklist evidence quick-fill.

### Out of Scope

- The T1 acceptance-coverage gate - lands in `011-acceptance-coverage-gate`.
- The reviewer-benchmark fixtures + scorer - land in `010-reviewer-prompt-benchmark-substrate` (this packet only consumes them).
- Any memory-subsystem change - orthogonal to the 027 memory phases 002-008 and to caura 015.
- The literal `score>=4 blocks` rule - re-confirmed anti-teaching (research §6).
- Empty-commit verdict ledger, branch-per-story checkout, blanket cheap-model release gate, automatic constitutional deletion - re-confirmed anti-teachings (research §6).
- 011 ERROR promotion of `AC_COVERAGE` - not this packet.
- T11 cheap-model preset, T12 reflection cap, T13 resume FILES manifest, T14 current-state narrative - separate or coordination items.

### Files to Change

The impacted surfaces are taken from integration-plan §2 (impact matrix). Runtime-mirror rule: every `.opencode/agents/*` prompt-contract change needs a `.claude/agents/*` mirror update (or a recorded mirror-lag decision).

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `CLAUDE.md` | Modify | §2 completion rule: bind completion to recomputed fingerprint + clean tree; Logic-Sync escalation (spec-conflict -> amendment) |
| `AGENTS.md` | Modify | Mirror the §2 completion-rule + escalation changes from `CLAUDE.md` |
| `.opencode/skills/system-spec-kit/references/constitutional/verify-before-completion-claims.md` | Modify | Freshness precondition + anti-softening ("always emit a verdict; do not relabel a Fail") in the completion ritual |
| `.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts` | Modify | Recompute the content fingerprint; strict-only `CONTINUITY_FRESHNESS`; review the `clock_drift` PASS path |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts` | Modify | Recompute `session_dedup.fingerprint` against content for the freshness check |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Modify | Wire the strict-only freshness check + auto-fix hint lines into the strict path/summary |
| `.opencode/skills/system-spec-kit/references/validation/validation_rules.md` | Modify | Document the freshness rule, severity, and `How to Fix` wording |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modify | Add `SPECKIT_COMPLETION_FRESHNESS` + `..._ENFORCE` flag rows (warn->error) |
| `.opencode/commands/speckit/assets/speckit_complete_auto.yaml` | Modify | Step-12 freshness message + single deep-review verdict line + checklist evidence quick-fill |
| `.opencode/commands/speckit/assets/speckit_complete_confirm.yaml` | Modify | Step-12 freshness message + single deep-review verdict line + checklist evidence quick-fill |
| `.opencode/skills/sk-code/SKILL.md` | Modify | Escalation gates block (root-cause-or-escalate; conflict->amendment; 3-strike; reviewers-contradict) |
| `.opencode/skills/sk-code-review/SKILL.md` | Modify | Docs-only numeric-severity note (+/-2 context; optional advisory `riskScore`, non-gating) |
| `.opencode/skills/sk-code-review/references/review_core.md` | Modify | Numeric-severity note detail (non-gating) |
| `.opencode/skills/deep-review/SKILL.md` | Modify | Anti-softening verdict line ("VERDICT_LOCK"); optional advisory `riskScore` report field |
| `.opencode/agents/review.md` | Modify | Reviewer read-budget (state reason before each non-diff Read; never re-read a new/full file) - ADOPT |
| `.opencode/agents/context.md` | Modify | Read-budget ADAPT (must NOT override P0 rereads) |
| `.opencode/agents/deep-research.md` | Modify | Read-budget ADAPT (must NOT override P0 rereads) |
| `.opencode/agents/deep-review.md` | Modify | Read-budget ADAPT + anti-softening verdict-line awareness |
| `.opencode/agents/orchestrate.md` | Modify | Awareness of escalation/verdict signals it routes (consume only) |
| `.claude/agents/review.md` | Modify | Mirror of `.opencode/agents/review.md` read-budget change |
| `.claude/agents/context.md` | Modify | Mirror of `.opencode/agents/context.md` read-budget ADAPT |
| `.claude/agents/deep-research.md` | Modify | Mirror of `.opencode/agents/deep-research.md` read-budget ADAPT |
| `.claude/agents/deep-review.md` | Modify | Mirror of `.opencode/agents/deep-review.md` read-budget + verdict-line |
| `.claude/agents/orchestrate.md` | Modify | Mirror of `.opencode/agents/orchestrate.md` awareness change |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modify | Verdict/legal-stop gate: single parseable verdict, no softening |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modify | Verdict/legal-stop gate: single parseable verdict, no softening |
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` | Modify | Startup/advisor brief freshness indicator (`completion-freshness: stale|fresh`, fail-open) |
| `.opencode/skills/system-spec-kit/references/hooks/skill-advisor-hook.md` | Modify | Surface the freshness indicator in the brief (fail-open) |
| `.opencode/skills/deep-review/assets/manual_testing_playbook/**` | Modify | Add manual test cases for the verdict-lock + read-budget rules |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phase 1 anchor: bind completion-verdict freshness to a recomputed content fingerprint plus a clean-tree precondition, invalidating green on later in-scope edits. | Given a packet whose checklist is `[x]` and whose fingerprint was recorded, When an in-scope file is edited after that fingerprint, Then `validate.sh --strict` reports the freshness rule as not-fresh (WARN in warn-mode); a clean recompute matching the recorded fingerprint passes. |
| REQ-002 | Wire freshness as a strict-only `CONTINUITY_FRESHNESS` check in `validate.sh` that recomputes `session_dedup.fingerprint` against content. | `continuity-freshness.ts` and `spec-doc-structure.ts` recompute the fingerprint from content (not trust the stored value); the check runs only under `--strict`; non-strict runs are unaffected. |
| REQ-003 | Ship freshness warn-first behind `SPECKIT_COMPLETION_FRESHNESS` + `..._ENFORCE`, copying the `SPECKIT_SAVE_QUALITY_GATE` precedent (default-on, warn-only window, would-reject logging, persisted activation timestamp). | `ENV_REFERENCE.md` documents both flags; with `..._ENFORCE=false` the rule WARNs and never ERRORs; flipping `..._ENFORCE=true` promotes to ERROR; `..._=false` rolls back. |
| REQ-004 | Phase 3 anti-softening: the completion ritual and the deep-review verdict line must always emit a single parseable verdict and must not relabel a Fail as conditional/partial. | `verify-before-completion-claims.md` and `deep-review/SKILL.md` state the rule; the deep-review verdict line emits an exact `PASS|CONDITIONAL|FAIL` string; an active P0 forces FAIL (VERDICT_LOCK), never CONDITIONAL/partial. |
| REQ-005 | Each rule reuses an existing UX surface with a warn-first, actionable message (no new prompt), per integration-plan §3. | Each of the five rules maps to a named existing surface (`/speckit:complete` Step 12, `validate.sh` summary, deep-review verdict line, `@review` budget, deep-review report schema) and carries a `How to Fix`/`fix:` line. |
| REQ-006 | Document the automation class per rule per integration-plan §4: freshness FULLY-AUTO via `validate.sh`; escalation/anti-softening/read-budget SEMI-AUTO; numeric-note docs-only. | The plan/spec record the class and the reused wiring for each rule; freshness requires no human step to detect staleness; SEMI-AUTO rules name the human-judgment residue they keep. |
| REQ-007 | Do NOT adopt the literal `score>=4 blocks`; the numeric-severity note is docs-only and non-gating. | `sk-code-review/SKILL.md` and `review_core.md` add the `+/-2 context` note and an OPTIONAL advisory `riskScore` field that is explicitly never a blocker; no gating threshold is introduced. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Phase 2 escalation gates in `sk-code/SKILL.md` + `CLAUDE.md` Logic-Sync. | The escalation block documents one-sentence-root-cause-or-escalate, spec-conflict->AMENDMENT-not-workaround, 3-strike, and reviewers-contradict; Logic-Sync references the amendment path; one consolidated escalation prompt fires only after a contradiction/3-strike. |
| REQ-009 | Phase 4 reviewer read-budget: ADOPT for `@review`; ADAPT for deep-review/deep-research/`@context` so it never overrides P0 rereads; update `.claude/agents/*` mirrors. | `@review` states the reason before each non-diff Read and never re-reads a new/full file; the deep-* and `@context` adaptations explicitly exempt P0 rereads; each `.opencode/agents/*` edit has a matching `.claude/agents/*` mirror. |
| REQ-010 | Net-new UX/automation opportunities folded in as requirements (integration-plan §6): validator auto-fix hints; startup/brief freshness indicator; one-command fingerprint-refresh helper; single deep-review verdict in `/speckit:complete`; checklist evidence quick-fill. | Each opportunity is represented by a task and a Files-to-Change row; the freshness indicator and hints are fail-open (never block on hook/indicator failure). |
| REQ-011 | Provide regression coverage for each rule via the 010 fixtures (stale-verdict, softened-Fail, over-read). | Each shipped rule references a 010 fixture case; the packet does not promote any rule to ERROR before its 010 regression is green (dependency on 010). |
| REQ-012 | Preserve existing behavior when flags are off and outside strict mode. | With `SPECKIT_COMPLETION_FRESHNESS` unset, `validate.sh` non-strict and existing validators behave exactly as before; no governance text outside the named completion/escalation edits changes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A green checklist `[x]` is invalidated (WARN in warn-mode, ERROR after enforce) when an in-scope file is edited after the recorded content fingerprint, via `validate.sh --strict`.
- **SC-002**: The freshness fingerprint is recomputed from content (reusing `session_dedup.fingerprint`), never trusted as a stored value, and is gated to strict mode only.
- **SC-003**: Freshness ships warn-first behind `SPECKIT_COMPLETION_FRESHNESS` + `..._ENFORCE` exactly mirroring the `SPECKIT_SAVE_QUALITY_GATE` rollout.
- **SC-004**: The deep-review verdict line and the completion ritual always emit one exact parseable verdict and never relabel a Fail as conditional/partial.
- **SC-005**: Every rule surfaces through an existing UX surface with a warn-first, actionable `How to Fix` message; no new prompt is introduced.
- **SC-006**: The numeric-severity note is docs-only and non-gating; the literal `score>=4 blocks` is not adopted.
- **SC-007**: The reviewer read-budget is ADOPTed for `@review` and ADAPTed for deep-*/`@context` without overriding P0 rereads, with `.claude/agents/*` mirrors updated.
- **SC-008**: No rule is promoted to ERROR before its 010 regression fixture is green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The freshness rule could over-block in-flight folders that are legitimately mid-edit. | High | Ship warn-first behind `SPECKIT_COMPLETION_FRESHNESS` with `..._ENFORCE=false`; strict-only; keep legit dirty-tree/clock-drift exceptions; promote to ERROR only after the warn window and green 010 fixtures. |
| Risk | The existing `clock_drift` PASS path in `continuity-freshness.ts` weakens the freshness signal. | Medium | Review the path during Phase 1; decide (recorded as an open question/ADR) whether to tighten it or keep it as a documented legit exception. |
| Risk | Wall-of-errors or cryptic failures degrade the operator UX. | Medium | Aggregate by rule with one top fix; every new rule carries `How to Fix` wording and `fix:` lines for `/speckit:complete`. |
| Risk | Read-budget ADAPTATION wrongly suppresses required P0 rereads in deep loops. | Medium | Explicitly exempt P0 rereads in the deep-*/`@context` adaptations; ADOPT the strict form only for `@review`. |
| Risk | `.opencode/agents/*` edits drift from their `.claude/agents/*` mirrors. | Medium | Enforce the runtime-mirror rule: every agent prompt-contract change updates the `.claude` mirror or records a mirror-lag decision. |
| Risk | The numeric note is mistaken for a gating threshold. | Low | State explicitly that `riskScore` is advisory and never a blocker; do not adopt `score>=4 blocks`. |
| Dependency | `010-reviewer-prompt-benchmark-substrate` (regression fixtures: stale-verdict, softened-Fail, over-read). | High | Land 010 FIRST; do not promote any rule to ERROR until its 010 fixture is green. |
| Dependency | Pending `001/002-self-check-templates` (shares the completion-gate surface indirectly). | Low-Med | Coordinate the completion-rule edit window; the heavy template overlap is 011's concern, not this packet's. |
| Dependency | `SPECKIT_SAVE_QUALITY_GATE` rollout precedent (`save-quality-gate.ts`). | Internal | Copy the default-on + warn-only-window + would-reject-logging + persisted-activation-timestamp pattern verbatim. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The freshness recompute reuses the existing continuity fingerprint helpers and runs only in `--strict`, so default `validate.sh` latency is unchanged.

### Security

- **NFR-S01**: No new network, provider, or runtime-execution behavior is introduced; the freshness check is local fingerprint recompute + a git clean-tree read.

### Reliability

- **NFR-R01**: The startup/advisor freshness indicator and the validator auto-fix hints are fail-open: a hook or indicator failure never blocks a save, a completion, or a validation run.
- **NFR-R02**: With all flags off and outside strict mode, behavior is byte-for-byte the prior behavior (no regression on existing folders).

---

## 8. EDGE CASES

### Data Boundaries

- Packet with no checklist (Level 1): freshness has no `[x]` evidence to bind; the rule is a no-op for that packet.
- Stored fingerprint is the template zero-hash placeholder: treated as "never recorded"; the rule does not falsely report stale.

### Error Scenarios

- Dirty working tree at completion time: warn-mode emits the freshness WARN with the changed file and the next command; a legit dirty-tree exception is allowed (documented).
- Clock drift on `last_updated_at`: handled by the reviewed `clock_drift` path (kept as a legit exception unless Phase 1 decides to tighten it).
- Reviewers contradict each other: escalation gate fires one consolidated prompt rather than silently picking a verdict.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 17/25 | ~28 surfaces across prompts/docs + one strict TS rule + flag plumbing; touches the completion gate, deep-review, sk-code/sk-code-review, and five agents + mirrors |
| Risk | 18/25 | Freshness touches the completion validator (warn-first mitigates); read-budget must not override P0 rereads; agent/.claude mirror discipline |
| Research | 8/20 | The proposal + integration-plan + cross-model-verified research already define rules, UX, automation, and rollout |
| Multi-Agent | 8/15 | Five agents plus their `.claude` mirrors and deep-loop YAMLs |
| Coordination | 9/15 | Hard dependency on 010; coordination with pending 001/002 on the completion-gate edit window |
| **Total** | **60/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Freshness ERROR blocks legitimate in-flight folders | H | M | Warn-first flag + strict-only + 010-green gate before ERROR promotion |
| R-002 | `clock_drift` PASS path silently weakens freshness | M | M | Review + ADR decision in Phase 1 |
| R-003 | Read-budget ADAPT suppresses P0 rereads | M | L | Explicit P0-reread exemption in deep-*/`@context` |
| R-004 | `.opencode`/`.claude` agent mirrors drift | M | M | Runtime-mirror rule enforced per agent edit |
| R-005 | Numeric note misread as a gate | L | L | Advisory-only wording; reject `score>=4 blocks` |
| R-006 | 010 fixtures slip, leaving rules unverified | M | M | Sequence 010 first; hold ERROR promotion until fixtures green |

---

## 11. USER STORIES

### US-001: Trustworthy completion verdict (Priority: P0)

**As an** operator running `/speckit:complete`, **I want** a green checklist to be invalidated when I edit an in-scope file after recording it, **so that** a "done" claim cannot silently go stale.

**Acceptance Criteria**:
1. Given a packet with `[x]` evidence and a recorded fingerprint, When I edit an in-scope file, Then `validate.sh --strict` reports freshness as not-fresh with the changed file and the next command (WARN in warn-mode).
2. Given I re-run verification and refresh the fingerprint, When the tree is clean and content matches, Then the freshness check passes.

### US-002: Honest, parseable verdicts (Priority: P0)

**As an** operator reading a deep-review or completion result, **I want** exactly one parseable verdict that never relabels a Fail as conditional/partial, **so that** I can trust and machine-parse the outcome.

**Acceptance Criteria**:
1. Given an active P0 finding, When the verdict line is emitted, Then it reads exactly `FAIL` (VERDICT_LOCK), never `CONDITIONAL` or "partial".
2. Given any completion or deep-review run, When it finishes, Then a single exact `PASS|CONDITIONAL|FAIL` string is always emitted (anti-truncation).

### US-003: Warn-first, actionable rule UX (Priority: P1)

**As an** operator, **I want** each new rule to surface through a familiar surface with a `How to Fix` line, **so that** I can act without learning a new prompt.

**Acceptance Criteria**:
1. Given a freshness WARN at `/speckit:complete` Step 12, When it renders, Then it names one changed file and the exact next command to refresh.
2. Given any new rule failure, When it renders, Then it carries `How to Fix` wording and a `fix:` line consumable by `/speckit:complete`.

### US-004: Disciplined reviewer reads (Priority: P1)

**As an** operator using `@review`, **I want** the reviewer to justify each non-diff read and avoid re-reading new/full files, **so that** review stays focused and budget-aware without losing P0 rereads in deep loops.

**Acceptance Criteria**:
1. Given a `@review` pass, When it performs a non-diff Read, Then it states the reason first and does not re-read a new/full-content file.
2. Given a deep-review/deep-research/`@context` pass, When a P0 reread is needed, Then the read-budget adaptation does not suppress it.

---

## 12. OPEN QUESTIONS

- Clean-tree precondition scope: whole repo versus packet paths only (default: packet-scoped, recorded as an ADR if narrowed).
- Whether the `clock_drift` PASS path in `continuity-freshness.ts` must be tightened or kept as a documented legit exception (Phase 1 decision).
- Exact warn-window duration for `SPECKIT_COMPLETION_FRESHNESS` (default: copy the `SPECKIT_SAVE_QUALITY_GATE` 14-day window unless operator overrides).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Source Proposal**: `research/006-peck-source-deep-mining/sub-packet-proposal.md` §1, §6, §7
- **Integration Plan**: `research/006-peck-source-deep-mining/integration-plan.md`
- **Verdict Evidence**: `research/006-peck-source-deep-mining/research.md` §2 (T5-T9)
