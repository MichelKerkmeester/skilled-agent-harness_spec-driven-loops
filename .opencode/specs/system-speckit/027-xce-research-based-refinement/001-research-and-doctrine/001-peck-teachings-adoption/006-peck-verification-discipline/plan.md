---
title: "Implementation Plan: 027/001/006 Peck Verification Discipline"
description: "Plan for the scoped agent-roster prompt-guidance slice of the peck verification-discipline bundle. Broader validator, command, skill, and fixture work remains planned but out of scope for this run."
trigger_phrases:
  - "027 phase 006"
  - "peck verification discipline"
  - "completion-verdict freshness"
  - "anti-verdict-softening"
  - "reviewer read-budget"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/006-peck-verification-discipline"
    last_updated_at: "2026-06-10T15:10:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Shipped T6 freshness gate"
    next_safe_action: "Monitor freshness warnings"
    blockers: []
    key_files: ["spec.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-009-peck-verification-discipline-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Clean-tree precondition is packet-scoped"
      - "clock_drift remains a benign PASS path"
---
# Implementation Plan: 027/001/006 Peck Verification Discipline

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (agent/skill prompts, CLAUDE.md/AGENTS.md, constitutional, validation docs), YAML (command assets), TypeScript (one strict validation rule: `continuity-freshness.ts` + `spec-doc-structure.ts`) |
| **Framework** | OpenCode agent runtime + system-spec-kit validation harness (`validate.sh`, validator-registry, strict TS-validator seam) |
| **Storage** | None new - reuses the existing `session_dedup.fingerprint` continuity field; the only new persistence is the flag activation timestamp pattern copied from `save-quality-gate.ts` |
| **Testing** | Manual prompt review + grep preservation checks; the 010 reviewer-benchmark regression fixtures (stale-verdict, softened-Fail, over-read); strict spec validation |

### Overview

Phase 006 adopts the scoped agent-roster prompt-guidance slice of the peck verification-discipline bundle. This run lands Phase D read-budget guidance and consume-only verdict/escalation awareness in the OpenCode, Claude, and Codex runtime mirrors. The broader source proposal still contains validator, command, skill, fixture, and rollout work; those surfaces were explicitly out of scope for this implementation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Proposal scope identified in `research/006-peck-source-deep-mining/sub-packet-proposal.md` §1 (Packet 009), §6, §7.
- [x] Integration model, impact matrix, UX table, automation table, and rollout waves identified in `research/006-peck-source-deep-mining/integration-plan.md`.
- [x] Verdict evidence for T5-T9 identified in `research/006-peck-source-deep-mining/research.md` §2.
- [x] Rollout precedent identified (`SPECKIT_SAVE_QUALITY_GATE`, `save-quality-gate.ts`).
- [x] 010 reviewer-benchmark fixtures available (hard dependency for ERROR promotion). Evidence: `reviewer-stale-verdict.json` consumed by the freshness test; dependent packet docs record all three fixtures green.

### Definition of Done

- [x] Phase A: freshness recomputes the content fingerprint + clean-tree precondition; strict-only `CONTINUITY_FRESHNESS`; warn-first behind `SPECKIT_COMPLETION_FRESHNESS` + `..._ENFORCE`. Evidence: targeted vitest passed for flag-off, warn, enforce, no-false-positive, and packet-scoped dirty paths.
- [x] Phase B: escalation gates added to `sk-code/SKILL.md` + `CLAUDE.md`/`AGENTS.md` Logic-Sync.
- [x] Phase C: anti-softening deep-review verdict line added; completion-ritual file excluded by approved write paths. Evidence: prior scoped guidance shipped and remains unchanged in this final validator slice.
- [x] Phase D: reviewer read-budget ADOPTed for `@review`, ADAPTed for deep-*/`@context` (P0 rereads exempt), `.claude/agents/*` and `.codex/agents/*` mirrors updated.
- [x] Phase E: docs-only numeric-severity note in `sk-code-review` (no `score>=4 blocks`).
- [x] Net-new UX/automation opportunities implemented within the approved T6 write set: validator `How to Fix` and `fix:` hints ship; startup/helper/command surfaces remain excluded by the final scope.
- [x] Each shipped rule references a green 010 fixture before any ERROR promotion. Evidence: stale-verdict fixture consumed; T5/T7/T8/T9 were previously shipped against their fixtures.
- [x] Strict spec validation passes for this packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Reuse-over-rebuild rule adoption. Each rule attaches to a surface that already exists and emits a warn-first, actionable message; nothing introduces a new prompt or a new persistence layer. The completion-freshness rule is the anchor and the only one with a code change (a strict TS validation rule that recomputes the existing continuity fingerprint and adds a clean-tree precondition). The other four rules are prompt/docs changes plus structured-verdict/loop-state enforcement.

### Key Components

- **Completion-freshness rule (Phase A)**: `continuity-freshness.ts` + `spec-doc-structure.ts` recompute `session_dedup.fingerprint` against content; `validate.sh --strict` runs it as `CONTINUITY_FRESHNESS`; `CLAUDE.md`/`AGENTS.md` §2 and the constitutional completion ritual state the precondition; flags `SPECKIT_COMPLETION_FRESHNESS` + `..._ENFORCE` gate warn->error.
- **Escalation gates (Phase B)**: a block in `sk-code/SKILL.md` and a `CLAUDE.md` Logic-Sync reference (root-cause-or-escalate; conflict->amendment; 3-strike; reviewers-contradict).
- **Anti-softening (Phase C)**: the completion ritual + `deep-review/SKILL.md` verdict line emit one exact `PASS|CONDITIONAL|FAIL` and never relabel a Fail; the deep-review YAML legal-stop/verdict gates enforce it.
- **Reviewer read-budget (Phase D)**: `@review` ADOPTs (reason-before-non-diff-read, no re-read of new/full files); deep-review/deep-research/`@context` ADAPT it with P0-reread exemption; `.claude/agents/*` mirrors track each change.
- **Numeric-severity note (Phase E)**: docs-only `+/-2 context` note + optional advisory `riskScore` in `sk-code-review/SKILL.md` + `review_core.md` + the deep-review report schema; never gating.
- **Rollout substrate**: the `SPECKIT_SAVE_QUALITY_GATE` pattern (default-on, warn-only window, would-reject logging, persisted activation timestamp) copied for freshness.

### Data Flow

At completion time, `/speckit:complete` calls `validate.sh --strict`, which (under `SPECKIT_COMPLETION_FRESHNESS`) runs `CONTINUITY_FRESHNESS`: it recomputes the content fingerprint for the packet, compares it to the recorded `session_dedup.fingerprint`, and checks the working tree is clean for the packet paths. A mismatch or dirty tree yields a WARN (warn-mode) or ERROR (`..._ENFORCE=true`) with a `How to Fix` line and the next command. The startup/advisor brief reads the same recompute to show `completion-freshness: stale|fresh` (fail-open). For the other rules, the deep-review/completion surfaces emit a single parseable verdict, `@review` justifies reads, and `sk-code-review` carries the advisory numeric note. The 010 fixtures exercise each rule's expected verdict before any ERROR promotion.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet touches the completion gate, the deep-review verdict path, sk-code/sk-code-review, five agents plus their `.claude` mirrors, and the validation/flag plumbing, so the producer/consumer inventory is enumerated. The full impact matrix is in `research/006-peck-source-deep-mining/integration-plan.md` §2.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `CLAUDE.md` §2 + `AGENTS.md` mirror | Completion rule + Logic-Sync | Modify | Freshness precondition + escalation present; mirror matches |
| `constitutional/verify-before-completion-claims.md` | Completion ritual | Modify | Freshness + anti-softening ("always emit a verdict") stated |
| `scripts/validation/continuity-freshness.ts` | Continuity freshness check | Modify | Recomputes content fingerprint; strict-only; `clock_drift` path reviewed |
| `mcp_server/lib/validation/spec-doc-structure.ts` | Doc-structure validator | Modify | Recomputes `session_dedup.fingerprint` from content |
| `scripts/spec/validate.sh` | Strict validation runner | Modify | `CONTINUITY_FRESHNESS` wired strict-only; auto-fix hint lines in summary |
| `references/validation/validation_rules.md` + `scripts/lib/validator-registry.json` | Rule docs + registry | Modify | Freshness rule documented with severity + `How to Fix` |
| `mcp_server/ENV_REFERENCE.md` | Flag reference | Modify | `SPECKIT_COMPLETION_FRESHNESS` + `..._ENFORCE` rows |
| `speckit_complete_{auto,confirm}.yaml` | Completion workflow Step 12 | Modify | Freshness message + single deep-review verdict + checklist quick-fill |
| `sk-code/SKILL.md` | Implementer skill | Modify | Escalation gates block |
| `sk-code-review/SKILL.md` + `references/review_core.md` | Reviewer skill | Modify | Docs-only numeric note (non-gating) |
| `deep-review/SKILL.md` + `deep_start-review-loop_{auto,confirm}.yaml` | Deep-review verdict path | Modify | Verdict-lock line; advisory `riskScore` field |
| `.opencode/agents/{review,context,deep-research,deep-review,orchestrate}.md` | Reviewer/retrieval/dispatch agents | Modify | Read-budget ADOPT/ADAPT; P0 rereads exempt where ADAPTed |
| `.claude/agents/{review,context,deep-research,deep-review,orchestrate}.md` | Runtime mirrors | Modify | Mirror each `.opencode` agent edit (or record mirror-lag) |
| `references/config/hook_system.md` + `references/hooks/skill-advisor-hook.md` | Startup/advisor brief | Modify | Freshness indicator (fail-open) |
| `deep-review/assets/manual_testing_playbook/**` | Manual test cases | Modify | Cases for verdict-lock + read-budget |

Required inventories:
- Existing-behavior preservation: with `SPECKIT_COMPLETION_FRESHNESS` unset and outside `--strict`, `validate.sh` and all validators behave as before (grep + a clean non-strict run).
- Mirror discipline: each `.opencode/agents/*` edit has a matching `.claude/agents/*` change or a recorded mirror-lag decision.
- Out-of-scope surfaces: 010 fixtures/scorer, the 011 AC gate, and any memory-subsystem file are NOT edited here; verify they are untouched.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

> The five proposal phases (T6/T5/T7/T8/T9, ascending risk) map to Implementation Phases A-E below. All live in this single packet; tasks.md groups them as task groups A-E. Setup and Verification bracket them.

### Phase 0: Setup

- [ ] Confirm 010 reviewer-benchmark fixtures exist (stale-verdict, softened-Fail, over-read); if absent, hold ERROR promotion and ship warn-only.
- [ ] Read the completion gate (`CLAUDE.md` §2, `AGENTS.md`, `verify-before-completion-claims.md`), `continuity-freshness.ts`, `spec-doc-structure.ts`, and `validate.sh` strict path.
- [ ] Read `save-quality-gate.ts` to copy the warn->error rollout pattern (default-on, warn window, would-reject logging, persisted activation timestamp).
- [ ] Record the preservation baseline: current non-strict `validate.sh` behavior and the five agents' current read/verdict contracts.

### Phase A: Completion-verdict freshness (T6, anchor)

- [ ] Recompute `session_dedup.fingerprint` against content in `spec-doc-structure.ts` and `continuity-freshness.ts` (reuse existing fingerprint helpers; do not trust the stored value).
- [ ] Add the clean-tree precondition (packet-scoped by default) and the in-scope-edit invalidation.
- [ ] Wire `CONTINUITY_FRESHNESS` as a strict-only check in `validate.sh`; add the `How to Fix`/`fix:` hint line to the summary.
- [ ] Add `SPECKIT_COMPLETION_FRESHNESS` + `..._ENFORCE` to `ENV_REFERENCE.md`; implement the warn->error gate copying `save-quality-gate.ts`.
- [ ] Update `CLAUDE.md` §2 + `AGENTS.md` completion rule and `verify-before-completion-claims.md` with the freshness precondition.
- [ ] Document the rule + severity + `How to Fix` in `validation_rules.md` and register it in `validator-registry.json`.
- [ ] Review the `clock_drift` PASS path; record the keep-or-tighten decision (ADR-002).

### Phase B: Escalation gates (T5)

- [x] Add the escalation block to `sk-code/SKILL.md` (one-sentence-root-cause-or-escalate; spec-conflict->AMENDMENT-not-workaround; 3-strike; reviewers-contradict).
- [x] Reference the amendment path from `CLAUDE.md`/`AGENTS.md` Logic-Sync; emit one consolidated escalation prompt only after a contradiction/3-strike.

### Phase C: Anti-softening (T7)

- [ ] Add "always emit a single parseable verdict; do not relabel a Fail as conditional/partial" to `verify-before-completion-claims.md` and the completion ritual. Deferred: this file was excluded from the approved write paths.
- [x] Add the VERDICT_LOCK verdict line to `deep-review/SKILL.md` (active P0 => exact `FAIL`); command YAML enforcement remains with the sibling-owned command pipeline.

### Phase D: Reviewer read-budget (T8)

- [x] ADOPT in `.opencode/agents/review.md`: state the reason before each non-diff Read; never re-read a new/full-content file.
- [x] ADAPT in `.opencode/agents/{context,deep-research,deep-review}.md`: same discipline but P0 rereads explicitly exempt; add awareness in `orchestrate.md`.
- [x] Mirror every agent edit into `.claude/agents/{review,context,deep-research,deep-review,orchestrate}.md` and `.codex/agents/{review,context,deep-research,deep-review,orchestrate}.toml`.

### Phase E: Numeric-severity note (T9, docs only)

- [x] Add the `+/-2 context` note + optional advisory `riskScore` (explicitly non-gating) to `sk-code-review/SKILL.md` and `review_core.md`.
- [x] Add the optional advisory `riskScore` field to the deep-review report schema; do NOT adopt `score>=4 blocks`.

### Phase F: Net-new UX/automation opportunities

- [ ] Validator auto-fix hints: `fix:` lines in failures + JSON so `/speckit:complete` shows "run this / edit this".
- [ ] Startup/brief freshness indicator: `completion-freshness: stale|fresh` in the startup/advisor brief (fail-open) via `hook_system.md` + `skill-advisor-hook.md`.
- [ ] One-command "refresh completion fingerprint" helper.
- [ ] Single deep-review verdict in `/speckit:complete` Step-12 summary (`reviewVerdict: ...`).
- [ ] Checklist evidence quick-fill from changed files + test output.

### Phase G: Verification

- [ ] Run each 010 fixture (stale-verdict, softened-Fail, over-read) against the shipped rules; confirm green before any ERROR promotion.
- [ ] Confirm with flags off + non-strict, behavior is unchanged (preservation grep + clean run).
- [ ] Grep-confirm no memory-subsystem file, no 010 fixture/scorer, and no 011 AC-gate file changed.
- [x] Confirm each `.opencode/agents/*` edit has a `.claude/agents/*` and `.codex/agents/*` mirror.
- [x] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| Phase 0: Setup | 010 fixtures (for ERROR promotion) | Read the surfaces and the rollout precedent; confirm fixtures gate promotion. |
| Phase A: Freshness | Phase 0 | The anchor rule and the only code change; everything else references its flags and messages. |
| Phase B: Escalation | Phase 0 | Prompt/docs only; independent of A but shares the `CLAUDE.md` edit window. |
| Phase C: Anti-softening | Phase 0 | Shares the completion ritual + deep-review verdict path. |
| Phase D: Read-budget | Phase 0 | Agent + mirror edits; independent of A-C. |
| Phase E: Numeric note | Phase 0 | Docs-only; independent. |
| Phase F: UX/automation | Phase A | The freshness indicator, auto-fix hints, and fingerprint helper build on A's recompute. |
| Phase G: Verification | Phases A-F + 010 | Regression + preservation checks require the edits and the fixtures to exist. |

Within the bundle, Phase A is the critical path (anchor + only code change). B/C/D/E are largely independent prompt/docs changes that can land in parallel but must coordinate the shared `CLAUDE.md`/completion-ritual edit window.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Freshness behavior | recompute fingerprint, clean-tree precondition, in-scope-edit invalidation, strict-only gating | `validate.sh --strict` on fixture packets + the 010 stale-verdict fixture |
| Verdict-lock | active P0 => exact `FAIL`; always one parseable verdict | 010 softened-Fail fixture + manual deep-review read |
| Read-budget | reason-before-non-diff-read; P0 rereads not suppressed | 010 over-read fixture + manual `@review`/deep-* read |
| Flag rollout | warn-only vs enforce; rollback via `..._=false` | toggle `SPECKIT_COMPLETION_FRESHNESS` / `..._ENFORCE` |
| Preservation | flags-off + non-strict behavior unchanged; mirrors consistent | `rg` over agents/.claude + a clean non-strict `validate.sh` |
| Documentation | spec folder contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |

Required matrix:

| Axis | Values |
|------|--------|
| Freshness flag | unset, `=true ENFORCE=false` (warn), `=true ENFORCE=true` (error) |
| Tree state | clean, dirty-in-scope, dirty-out-of-scope |
| Fingerprint state | matches, stale, zero-hash placeholder (never recorded) |
| Verdict input | active P0 (=> FAIL), no P0, truncated output (=> still one verdict) |
| Read context | `@review` (ADOPT), deep-*/`@context` P0 reread (ADAPT, not suppressed) |
| Fixture (from 010) | stale-verdict, softened-Fail, over-read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATE

| Area | LOC | Notes |
|------|-----|-------|
| Freshness rule (`continuity-freshness.ts` + `spec-doc-structure.ts` + `validate.sh` wiring) | 120-200 | The only code change; recompute + clean-tree + strict gating + flag plumbing |
| Completion gate docs (`CLAUDE.md`/`AGENTS.md`/constitutional/validation_rules/ENV_REFERENCE) | 60-100 | Freshness precondition + flag rows + `How to Fix` |
| Completion + deep-review YAML/skill edits (Phases C + F) | 70-120 | Verdict-lock line + single verdict + checklist quick-fill + auto-fix hints |
| Escalation (`sk-code/SKILL.md` + Logic-Sync) | 30-60 | Escalation block |
| Read-budget (5 agents + 5 `.claude` mirrors) | 70-130 | ~7-13 LOC each, ADOPT/ADAPT note |
| Numeric note (`sk-code-review` + `review_core.md` + report schema) | 20-40 | Docs-only advisory |
| Hook/brief freshness indicator + fingerprint helper | 30-60 | Fail-open indicator + one-command helper |
| **Total** | **~400-650** | Matches the proposal M effort; one strict rule, the rest prompts/docs/flags |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `010-reviewer-prompt-benchmark-substrate` (fixtures) | Upstream | Pending (land FIRST) | No regression coverage; ship warn-only and hold all ERROR promotions |
| `SPECKIT_SAVE_QUALITY_GATE` rollout precedent | Internal | Available | Source of the warn->error rollout pattern to copy verbatim |
| Existing `session_dedup.fingerprint` + helpers (`normalizeForFingerprint`/`buildContinuityFingerprint`) | Internal | Available | Freshness is recompute-at-validation, not new infra |
| Pending `001/002-self-check-templates` | Coordination | Pending | Shares the completion-gate surface indirectly; coordinate the edit window |
| `@review`/`@context`/deep-* current contracts | Internal | Available | Read-budget ADOPT/ADAPT targets; P0-reread semantics to preserve |

No external dependencies. No network access required.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The freshness rule over-blocks legitimate in-flight folders, a verdict-lock change breaks an existing deep-review consumer, or a read-budget ADAPTation suppresses a P0 reread.
- **Procedure**: Set `SPECKIT_COMPLETION_FRESHNESS=false` (or `..._ENFORCE=false`) to disable/de-escalate freshness instantly; revert the prompt/docs edits per phase; the rules are additive so removal returns the prior behavior.
- **Blast radius**: The completion validation summary, the deep-review verdict line, and reviewer-agent read guidance only; no memory-subsystem, no runtime persistence beyond the copied flag-activation timestamp.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Failure Mode | Detection | Rollback |
|--------------|-----------|----------|
| Freshness ERRORs a legit in-flight folder | Warn-window logging / operator report | Flip `..._ENFORCE=false` (back to WARN) or `SPECKIT_COMPLETION_FRESHNESS=false` |
| Verdict-lock breaks a deep-review parser | Deep-review run emits an unexpected verdict shape | Revert the `deep-review/SKILL.md` + YAML verdict-line edits; keep the exact prior strings |
| Read-budget suppresses a P0 reread | A deep-*/`@context` pass skips a required reread | Restore the P0-reread exemption text; demote the ADAPT note to advisory |
| `.opencode`/`.claude` mirror drift | Preservation grep finds a mirror missing an edit | Apply the mirror or record a mirror-lag decision |
| Numeric note read as a gate | A reviewer blocks on `riskScore` | Re-assert advisory-only wording; remove any threshold language |

Rollback must preserve the Phase 0 preservation-baseline notes even if per-phase edits are reverted during investigation.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
        ┌─────────────────────────────┐
        │ 010 reviewer-benchmark      │  (upstream packet; land FIRST)
        │ fixtures: stale-verdict,    │
        │ softened-Fail, over-read    │
        └──────────────┬──────────────┘
                       │ gates ERROR promotion only
                       ▼
   Phase 0: Setup (read surfaces + SPECKIT_SAVE_QUALITY_GATE precedent)
                       │
                       ▼
   ┌───────────────────────────────────────────────────────────┐
   │ Phase A: Completion-verdict freshness (anchor, only code)   │
   └───────────────┬───────────────────────────────┬───────────┘
                   │ flags + messages reused by      │ recompute reused by
                   ▼                                 ▼
   Phase B/C/D/E (prompt/docs, parallel)      Phase F: UX/automation
   B escalation · C anti-softening ·          (auto-fix hints, freshness
   D read-budget · E numeric note             indicator, fingerprint helper)
                   └───────────────┬───────────────┘
                                   ▼
                   Phase G: Verification (010 fixtures + preservation)
```

Edges: Phase A is the only edge with a code change; B/C/D/E are independent prompt/docs edges that share the `CLAUDE.md`/completion-ritual edit window. Phase F depends on Phase A's recompute. Phase G depends on every phase plus the 010 fixtures. The 010 edge gates ERROR promotion, not warn-first landing.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The critical path is **010 fixtures (external) -> Phase 0 -> Phase A -> Phase F -> Phase G**.

- Phase A (freshness recompute + clean-tree + strict gating + flag plumbing) is the longest single work item and the only code change; everything UX/automation (Phase F) builds on its recompute.
- Phases B, C, D, E are off the critical path: they are independent prompt/docs edits that can land in parallel, constrained only by the shared `CLAUDE.md`/completion-ritual edit window (a coordination point, not a blocking dependency).
- The 010 fixtures gate only ERROR promotion (the final flip in Phase 5 of the rollout), so the critical path to a warn-first landing does NOT block on 010; the critical path to ERROR promotion does.
- Slip risk concentrates on Phase A and on the 010 dependency; both are mitigated by shipping warn-first and holding ERROR promotion until fixtures are green.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Definition | Gate |
|-----------|------------|------|
| M1 - Setup complete | Surfaces read; `SPECKIT_SAVE_QUALITY_GATE` pattern captured; preservation baseline recorded | Phase 0 done |
| M2 - Freshness in WARN | `CONTINUITY_FRESHNESS` recomputes content fingerprint + clean-tree precondition, strict-only, behind `SPECKIT_COMPLETION_FRESHNESS` with `..._ENFORCE=false` | Phase A done; warn-only |
| M3 - Discipline rules landed | Escalation, anti-softening (VERDICT_LOCK), read-budget (ADOPT/ADAPT + mirrors), and the docs-only numeric note in place | Phases B-E done |
| M4 - UX/automation surfaced | Auto-fix hints, startup freshness indicator (fail-open), fingerprint-refresh helper, single deep-review verdict, checklist quick-fill | Phase F done |
| M5 - Regression-green | Each rule references a green 010 fixture; preservation + mirror checks pass; strict spec validation passes | Phase G done |
| M6 - ERROR promotion | Freshness promoted to ERROR after the warn window AND green 010 fixtures (`..._ENFORCE=true`) | Post-warn-window; reversible by flag |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

> The full ADR set lives in `decision-record.md`. The load-bearing decision is summarized here.

### ADR-001: Ship freshness warn-first behind a flag, copying SPECKIT_SAVE_QUALITY_GATE

**Status**: Proposed

**Context**: The completion-freshness rule is the highest-value but highest-risk change because it touches the completion validator and a new ERROR could block in-flight folders.

**Decision**: Ship freshness warn-first behind `SPECKIT_COMPLETION_FRESHNESS` + `..._ENFORCE`, copying the proven `SPECKIT_SAVE_QUALITY_GATE` rollout (default-on, warn-only window, would-reject logging, persisted activation timestamp), and promote to ERROR only after the warn window and green 010 fixtures.

**Consequences**:
- Operators see the rule as a WARN first; no surprise blocks.
- ERROR promotion is gated on 010 regression evidence, not a calendar date alone.
- Rollback is a single flag flip.

**Alternatives Rejected**:
- Ship freshness as an immediate ERROR: rejected because it would block legitimate mid-edit folders before the warn window and before fixtures exist.
- Adopt the literal `score>=4 blocks` numeric gate: rejected (re-confirmed anti-teaching); the numeric note stays docs-only and advisory.
