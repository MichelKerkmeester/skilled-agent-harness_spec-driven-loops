---
title: "Implementation Plan: Spec-gate advise & would-deny telemetry [template:level_2/plan.md]"
description: "Add a would-deny signal and a shared line formatter to the runtime-neutral core, then wire both runtime adapters to write one structured, bounded, rotated telemetry line per mutation event."
trigger_phrases:
  - "spec gate telemetry plan"
  - "would-deny signal"
  - "structured advise log"
  - "runtime adapter logging"
  - "formatSpecGateEvent"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/031-spec-gate-enforce-readiness/001-advise-telemetry"
    last_updated_at: "2026-07-11T11:05:56.873Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level-2 plan with affected-surfaces + design decisions"
    next_safe_action: "Wire the OpenCode + Claude adapters to write the structured line"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/plugins/mk-spec-gate.js"
      - ".opencode/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs"
      - ".opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-advise-telemetry"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Spec-gate advise & would-deny telemetry

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
| **Language/Stack** | Node.js ESM (`.mjs` runtime core + Claude hooks, `.js` OpenCode plugin) |
| **Framework** | OpenCode plugin hooks + Claude Code hook adapters over a runtime-neutral core |
| **Storage** | Bounded, rotated file log at `.opencode/skills/.spec-gate-state/spec-gate-warnings.log` |
| **Testing** | `node:test` (`node --test spec-gate-core.test.mjs`) plus the adapter `__test` surface |

### Overview
Add a would-deny signal to `evaluateMutation` and a shared line formatter to the core, then wire both runtime adapters to write one structured, bounded, rotated telemetry line per mutation event. This is measurement-only: the deny predicate, the advise/allow decisions, and the kill-switch stay exactly as they are.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The would-deny discriminator is defined (which events count as would-deny vs advise)
- [ ] The canonical line format is frozen (`timestamp | runtime | sessionID | tool | filePath | decision`)
- [ ] The fail-open, disabled, and deny-predicate invariants are restated

### Definition of Done
- [ ] Both runtimes emit one parseable line per open-gate mutation event
- [ ] `node --test spec-gate-core.test.mjs` green (existing + new)
- [ ] spec/plan/tasks/checklist synchronized
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime-neutral core plus thin per-runtime transport adapters — the existing spec-gate pattern, preserved. Policy and persistence stay in the core; adapters only own transport and decide when to log.

### Key Components
- **`spec-gate-core.mjs`**: owns policy, the new would-deny signal, the shared `formatSpecGateEvent` formatter, and the bounded rotated `appendWarningLog` writer. Never writes stdout/stderr.
- **`mk-spec-gate.js` (OpenCode)**: composes + writes the telemetry line in `tool.execute.before`; stays default-export-only with no stdout.
- **`spec-gate-enforce.mjs` (Claude)**: composes + writes the telemetry line in the PreToolUse hook; adds a real file log instead of relying on `additionalContext`.

### Data Flow
User turn → classify opens the gate → Write/Edit → adapter calls `evaluateMutation` → `{ decision, wouldDeny }` → adapter composes `formatSpecGateEvent({...})` → `appendWarningLog(stateDir, line)` → bounded, rotated file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `appendWarningLog` (`spec-gate-core.mjs:192`) | Bounded rotated advisory writer; hardcodes `ADVISE:` + a static detail (`:193`) | update — generalize so `detail` carries the composed line; keep timestamp, `[mk-spec-gate]` tag, rotation, fail-open | `node --test`; grep confirms the `ADVISE:` literal is gone |
| `evaluateMutation` (`spec-gate-core.mjs:557`) | Returns `{decision, detail}`; deny only when enforce on (`:580-585`) | update — additively return `wouldDeny`; `decision`/`detail` unchanged | deny-matrix test still exactly 2 denies; new `wouldDeny` test |
| `GATE_3_QUESTION` (`spec-gate-core.mjs:88`) | Static advisory string echoed as `detail` | unchanged — still the human-facing advisory, NOT the telemetry payload | grep; NFR-S01 test |
| `formatSpecGateEvent` (`spec-gate-core.mjs`, new) | none | create — shared pure formatter + field sanitizer, single line | new format + sanitization tests |
| `tool.execute.before` (`mk-spec-gate.js:220`) | Calls `appendWarningLog(stateDir, result.detail)` on advise only (`:239`) | update — compose the structured line (runtime `opencode`) incl session/tool/path/decision | adapter test; live log-line parse |
| `spec-gate-enforce.mjs` (`:43`) | Emits deny/advise via stdout JSON; no file log at all | update — add `resolveGuardPaths` + `appendWarningLog` (runtime `claude`) on advise/would-deny | adapter test; log file present |
| `spec-gate-classify.mjs` (`:38`) | Emits `additionalContext` only; per-turn, no tool/path available | unchanged — not a per-mutation telemetry surface (no tool/filePath at classify time) | grep; rationale in Design Decisions |
| `DENY_CAPABLE_TOOLS` (`spec-gate-core.mjs:84`) | `{write, edit}` deny predicate | unchanged — never widened | deny-matrix test |
| `mcp_server/` dist, `gate-3-classifier` | Shared classifier | not a consumer — not touched or rebuilt | grep: no classifier imports changed |

Required inventories:
- Same-class producers: `rg -n 'appendWarningLog|WARN_LOG_FILENAME|maintainWarningLogPath' .opencode/skills/system-spec-kit/runtime/lib/spec-gate` — `appendWarningLog` is the single log writer.
- Consumers of changed symbols: `rg -n 'appendWarningLog|evaluateMutation|formatSpecGateEvent' . --glob '*.js' --glob '*.mjs' --glob '*.md'`.
- Matrix axes: runtime `{opencode, claude}` × tool `{write, edit, bash}` × gate `{open, satisfied, skipped, never-opened}` × path `{source, exempt}` × disabled `{0, 1}`. The telemetry rows that matter: open + source + write/edit → would-deny; open + bash → advise; disabled → none.
- Algorithm invariant: one mutation event equals exactly one parseable log line; the parser round-trips `{timestamp, runtime, sessionID, tool, filePath, decision}`; a hostile filePath (pipe/newline) cannot inject a second line.
<!-- /ANCHOR:affected-surfaces -->

---

## DESIGN DECISIONS

The brief flags genuine design choices for the sibling phases; WS1 has two of its own worth pinning here.

1. **How to expose would-deny without flipping enforce.** Chosen: additively return a `wouldDeny` boolean from `evaluateMutation`, computed from the same predicate (deny-capable tool + open, unanswered gate + non-exempt path) independent of the enforce env. Rejected: having each adapter re-derive deny-capability from the exported `DENY_CAPABLE_TOOLS` — the adapter cannot cheaply reproduce the exempt-path and open-gate conditions without duplicating `evaluateMutation`, and that duplication would drift between runtimes. The additive return keeps `decision`/`detail` byte-for-byte backward-compatible, so every existing test stays green.

2. **Where the canonical line format lives.** Chosen: one exported pure `formatSpecGateEvent()` in the core that both adapters call, so the two runtimes emit a byte-identical field layout (only the runtime token differs). `appendWarningLog` keeps ownership of the ISO timestamp, the `[mk-spec-gate]` grep tag, bounded rotation, and fail-open; its hardcoded `ADVISE:` literal is dropped so the decision field is authoritative. Rejected: composing the line independently in each adapter — guaranteed format drift and a brittle parser.

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Core signal + formatter
- [ ] Add `wouldDeny` to `evaluateMutation`'s return (additive; `decision`/`detail` unchanged)
- [ ] Add exported `formatSpecGateEvent({runtime, sessionID, tool, filePath, decision})` with field sanitization
- [ ] Generalize `appendWarningLog` so `detail` carries the composed line (drop the hardcoded `ADVISE:`)

### Phase 2: Adapter wiring
- [ ] OpenCode `tool.execute.before`: compose + write the line (runtime `opencode`) on advise/would-deny; never stdout
- [ ] Claude `spec-gate-enforce.mjs`: resolve `stateDir` + write the line (runtime `claude`) on advise/would-deny
- [ ] Confirm both adapters short-circuit on `MK_SPEC_GATE_DISABLED=1` before any log call

### Phase 3: Verification
- [ ] Extend `spec-gate-core.test.mjs` (format, wouldDeny, disabled, single-line, both-runtime identity, rotation)
- [ ] Run `node --test`; confirm the existing 20+ tests still green
- [ ] Re-run `validate.sh --strict` on the phase folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `formatSpecGateEvent`, `evaluateMutation.wouldDeny`, `appendWarningLog` line | `node:test` |
| Integration | Adapter advise/would-deny → log-line parse; disabled → no line | `node:test` + adapter `__test` surface |
| Manual | Live Write on both runtimes; grep `spec-gate-warnings.log` for one parseable line | shell / grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Shared `gate-3-classifier` dist | Internal | Green | Unchanged; not rebuilt |
| `node:test` runner | Internal | Green | Existing test harness |
| OpenCode plugin loader / Claude hook wiring | Internal | Green | Existing; no new wiring |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a malformed telemetry line, unbounded log growth, or any fail-open regression (a mutation blocked by a logging bug).
- **Procedure**: `git revert` the four-file change; the guard returns to advise-only with the pre-existing static log. No data migration; the log file is disposable.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Core signal+formatter ──► Adapter wiring ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Core signal + formatter | None | Adapter wiring, Verification |
| Adapter wiring | Core signal + formatter | Verification |
| Verification | Adapter wiring | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Core signal + formatter | Low | 1-2 hours |
| Adapter wiring | Low | 1-2 hours |
| Verification | Med | 2-3 hours |
| **Total** | | **4-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `node --test spec-gate-core.test.mjs` green
- [ ] `MK_SPEC_GATE_DISABLED=1` verified to write nothing
- [ ] Deny-matrix test still exactly 2 denies (predicate unchanged)

### Rollback Procedure
1. `git revert` the WS1 commit (four files)
2. Confirm `evaluateMutation` returns the pre-change `{decision, detail}` shape
3. Smoke test: a Write with an open gate still advises (no block)
4. No stakeholder notification needed (advisory subsystem, no user-facing surface)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: delete `spec-gate-warnings.log` if desired (disposable telemetry)
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
