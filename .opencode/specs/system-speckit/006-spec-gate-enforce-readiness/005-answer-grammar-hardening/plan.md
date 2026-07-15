---
title: "Implementation Plan: Answer-grammar hardening for the spec-gate Gate-3 parser"
description: "Tighten the spec-gate skip regex and standalone-D path, broaden the answer grammar for natural letter forms, and reword the deny detail for the model audience - backed by an expanded answerParse corpus test."
trigger_phrases:
  - "answer grammar hardening"
  - "spec-gate skip regex plan"
  - "answerParse grammar"
  - "gate-3 deny detail plan"
  - "spec-gate-core answer parser"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/006-spec-gate-enforce-readiness/005-answer-grammar-hardening"
    last_updated_at: "2026-07-11T11:05:58.098Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 2 plan for answer-grammar hardening"
    next_safe_action: "Implement the SKIP_WORD_REGEX and answer-grammar changes in spec-gate-core.mjs"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-answer-grammar-hardening"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Answer-grammar hardening for the spec-gate Gate-3 parser

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ESM `.mjs`), Node runtime hook library |
| **Framework** | None; runtime-neutral policy core consumed by per-runtime adapters |
| **Storage** | Session-scoped JSON gate-state files under `.opencode/skills/.spec-gate-state` |
| **Testing** | `node:test` (`spec-gate-core.test.mjs`), optionally `--experimental-test-module-mocks` |

### Overview
Harden `answerParse`'s skip and letter grammar in `spec-gate-core.mjs` and reword the deny `detail` for the model audience, then prove it with an expanded corpus test. The tightening keeps a false-open (one extra re-ask) strictly preferable to a false-close (guard silent all session): when the leading token is not an unambiguous answer, the parser returns `null` and the gate stays open.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime-neutral policy core (`spec-gate-core.mjs`) consumed by thin per-runtime adapters (Claude `spec-gate-classify.mjs` / `spec-gate-enforce.mjs`, OpenCode `mk-spec-gate.js`). The core owns classification and policy; adapters own transport.

### Key Components
- **`answerParse` (`spec-gate-core.mjs:354-380`)**: parses one user turn into `null | { type:'skip' } | { type:'binding', path }`; state-gated by `isOpen`.
- **`SKIP_WORD_REGEX` / `ANSWER_LETTER_PREFIX_REGEX` (`:329-330`)**: the answer grammar under change.
- **`GATE_3_QUESTION` (`:88-95`) and new `GATE_3_DENY_DETAIL`**: the user-facing relay question vs the model-audience deny instruction.
- **`evaluateMutation` (`:557-590`)**: returns `allow|advise|deny` plus a `detail`; the deny branch (`:583`) is rewired to the new constant.
- **`classifyIntent` (`:481-542`)**: calls `answerParse(prompt, state.status === 'open')` (`:496`); its call site and fail-open path are unchanged.

### Data Flow
User turn -> `classifyIntent` -> `answerParse(isOpen)` -> persist `skipped`/`satisfied`/`open`. A later Write/Edit -> `evaluateMutation` -> `{ decision, detail }` -> adapter -> runtime (Claude `permissionDecisionReason` on deny, `additionalContext` on advise).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `SKIP_WORD_REGEX` (`spec-gate-core.mjs:329`) | Matches any prompt starting with "skip" | update to bare skip-class only | corpus test: "skip the lint errors ..." -> `null` |
| `answerParse` letter-D skip (`:360`) | Any leading "D" resolves to skip | update to standalone-D only | corpus test: "D is the wrong option ..." -> `null`; "D" / "D, no spec folder needed" -> skip |
| `ANSWER_LETTER_PREFIX_REGEX` + bare-token bind (`:330,369-373`) | Recognizes only a bare leading A-E letter | broaden with a closed-set natural lead-in | corpus test: "option B, 042-foo" -> binding |
| `GATE_3_QUESTION` (`:88-95`) | User-facing relay question (classify + advise) | unchanged | grep: still referenced by classify/advise surfaces |
| new `GATE_3_DENY_DETAIL` | none (new) | add model-audience deny string | golden-loop assertion updated to the new marker |
| `evaluateMutation` deny branch (`:583`) | Returns `GATE_3_QUESTION` as deny detail | update to return `GATE_3_DENY_DETAIL` | `node --test`: golden-loop deny detail asserts the model-audience text |
| Claude enforce adapter (`spec-gate-enforce.mjs:56`) | Sets `permissionDecisionReason = result.detail` | not a consumer change; verify surfaced text | manual read; no code edit expected |
| Claude classify adapter (`spec-gate-classify.mjs:44`) | Sets `additionalContext = result.question` | unchanged | grep; still `GATE_3_QUESTION` |
| OpenCode plugin (`mk-spec-gate.js`) | Relays `detail`/`question` without inspecting content | unchanged; verify no stdout | grep: no `console.*`; default-export-only |
| `spec-gate-core.test.mjs` corpus + golden loop (`:487-538,:67`) | Pins parse rates and deny detail | update | expanded corpus at 0/0; golden-loop assertion updated |

Required inventories:
- Same-class producers: `rg -n 'SKIP_WORD_REGEX|ANSWER_LETTER_PREFIX_REGEX|/\^\\s\*skip' .opencode/skills/system-spec-kit/runtime/lib/spec-gate`.
- Consumers of changed symbols: `rg -n 'GATE_3_QUESTION|GATE_3_DENY_DETAIL|answerParse|result\.detail|\.question' . --glob '*.mjs' --glob '*.js' --glob '*.md'`.
- Matrix axes: answer class (skip-word / standalone-D / letter+path / letter+bare-token / natural lead-in+token / prose) x isOpen (true/false) x folder validity (valid / missing / none named).
- Algorithm invariant: `answerParse` returns a non-null (gate-closing) result only when the leading token unambiguously encodes an answer; every ambiguous input returns `null`. Adversarial cases: "skip X do Y", "D <prose>", bare A/B/C/E with no folder, prose carrying a `\d{3}-slug` token but no answer signal, `isOpen=false`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `answerParse`, `SKIP_WORD_REGEX`, and `evaluateMutation`; enumerate the current corpus.
- [ ] Capture the baseline `node --test spec-gate-core.test.mjs` result.
- [ ] Inventory `GATE_3_QUESTION` / skip-regex consumers across the core, adapters, and OpenCode plugin.

### Phase 2: Core Implementation
- [ ] Tighten `SKIP_WORD_REGEX` to bare skip / skip-it class (not "skip X ... do Y").
- [ ] Guard the standalone-letter-D skip so trailing prose defeats it.
- [ ] Broaden letter recognition with a closed-set natural lead-in ("option/choice/answer/go with/use option" + A-E) so "option B" registers the letter and the bare-token binding fires.
- [ ] Add `GATE_3_DENY_DETAIL` and return it from the `evaluateMutation` deny branch; keep advise/classify on `GATE_3_QUESTION`.

### Phase 3: Verification
- [ ] Expand the positive/negative corpus and update the golden-loop deny-detail assertion.
- [ ] Run `node --test spec-gate-core.test.mjs` (and with `--experimental-test-module-mocks`).
- [ ] Run `validate.sh --strict`; confirm invariants (no core stdout, deny breadth unchanged, no `mcp_server/` dist rebuild).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `answerParse` positive/negative corpus; standalone-D and natural lead-in cases | `node:test` |
| Integration | Golden loop (open -> deny -> answer -> allow) and deny-detail assertion | `node:test` |
| Manual | Grep the core/adapters/plugin for stdout and deny-breadth invariants | `rg` + read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase `001-advise-telemetry` detail shape | Internal | Yellow | Coordinate the `detail` composition to avoid a double-edit in the same region |
| Shared classifier `validateSpecFolderBinding` | Internal | Green | Read-only; bare-token bindings still route through it unchanged |
| `node:test` runtime | External | Green | Cannot run the corpus/golden-loop tests |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The tightened grammar rejects a legitimate answer, or the reworded deny detail breaks a downstream consumer.
- **Procedure**: `git revert` the two-file change (`spec-gate-core.mjs`, `spec-gate-core.test.mjs`); the guard returns to advise-only behavior with the prior grammar. No state migration is required because gate-state files are session-scoped and swept.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5-1 hour |
| Core Implementation | Med | 2-3 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **3.5-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline `node --test` output captured before edits
- [ ] Change confined to the two spec-gate files (no `mcp_server/` dist rebuild)
- [ ] Kill switch verified: `MK_SPEC_GATE_DISABLED=1` still a full no-op

### Rollback Procedure
1. `git revert` the answer-grammar commit (two files).
2. Confirm `node --test spec-gate-core.test.mjs` passes on the reverted tree.
3. Re-run `validate.sh --strict` on this phase folder.
4. No stakeholder notification needed; the guard ships advise-only and enforce is opt-in.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - gate-state files are session-scoped and self-expiring via the sweep.
<!-- /ANCHOR:enhanced-rollback -->
