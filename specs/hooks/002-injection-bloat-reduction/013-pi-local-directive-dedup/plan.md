---
title: "Plan: Pi-Local Directive De-Duplication"
description: "Add a per-session directive-dedup to the Pi adapter that drops the constant directive block on a proven same-content repeat, fail-open, reset on lifecycle boundaries."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "pi directive dedup plan"
  - "pi local directive suppression plan"
importance_tier: "high"
contextType: "plan"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/013-pi-local-directive-dedup"
    last_updated_at: "2026-08-09T07:30:34Z"
    last_updated_by: "claude"
    recent_action: "Wired the dedup decision into the input transform and lifecycle resets"
    next_safe_action: "None; adapter suppresses repeats, re-delivers on lifecycle events"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
    session_dedup:
      fingerprint: "sha256:8b96065560214ada74b8c4599a9ed96b1a6e9260f93ef99d9d366ed6d227b8ef"
      session_id: "2026-08-09-pi-directive-dedup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Pi-Local Directive De-Duplication

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`prompt-advisor.ts` is Pi's `input`-event adapter. It calls the shared advisor hook in-process, receives the full brief as `context` (route line + `\nDirectives:` block), and assembles the visible prompt as `${event.text}\n\n${context}\n\n${PI_SUBAGENT_DISPATCH_DIRECTIVE}`. It already keeps a per-session store and resets it on `session_start`/`session_compact`.

### Overview

Add a per-session record of the directive block last delivered in full. On the input turn, if the session is confirmed and the directive block matches the recorded one, replace `context` with just the route line before assembly; otherwise record and deliver full. Clear the record on the same lifecycle events the adapter already handles.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The input-handler assembly point and the two lifecycle handlers are located.
- The brief separator (`\nDirectives:`) and the fail-open cases (unknown session, fallback, kill-switch) are enumerated.

### Definition of Done

- The dedup suppresses only a confirmed same-content repeat; every uncertain case delivers full.
- Existing Pi tests pass; a new suite proves each branch; zero new type errors.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Deliver-once-per-epoch with fail-open. State lives only in the Pi adapter's own session store; the decision is a pure function over `(context, sessionId)` plus that store.

### Key Components

- `decidePiDirectiveDelivery(context, sessionId)` — returns `{ reducedContext, suppressed }`; suppresses only on a confirmed, same-content, same-epoch repeat.
- `splitPiDirectiveBrief` — separates the route-line head from the directive block on `\nDirectives:`.
- `directiveDedupBySession` — bounded `Map<sessionId, directiveBlock>` in the existing store.
- `resetPiDirectiveDedupForSession` — called from `session_start`(resume/fork) and `session_compact`.

### Data Flow

`input` → advisor returns `context` → `decidePiDirectiveDelivery` → if suppressed, `effectiveContext = route line`; else `context` → assemble `${text}\n\n${effectiveContext}\n\n${DISPATCH}`. The dispatch directive is always appended.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Locate the assembly point and lifecycle handlers; confirm the brief separator and the store's session-key helper.

### Phase 2: Core Implementation

Add the flag, the split/decision helpers, and the store field; wire the decision into the input assembly and the resets into both lifecycle handlers and the global reset.

### Phase 3: Verification

Run the existing Pi suite (regression), a new branch-coverage suite, and a strict type-error delta against the prior revision.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Unit tests of `decidePiDirectiveDelivery` over synthetic briefs cover every branch (first/repeat/reset/dirty/unknown-session/fallback/kill-switch/isolation). Handler-wiring tests drive the mock `ExtensionAPI` to prove `session_compact` and `session_start` re-arm full delivery. Regression: the existing dispatch suite. Type safety: an off-config `tsc` error-count delta versus the original file isolates any new error.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `prompt-advisor.ts` internals only (session store, `receiptSessionKey`, lifecycle handlers). No new packages, no network, no change to shared libraries.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Single-file and reversible: `git checkout -- prompt-advisor.ts` restores always-full delivery, and removing the new test file restores the prior suite. `SPECKIT_PI_DIRECTIVE_DEDUP=0` is a runtime opt-out needing no revert. No build artifacts and no shared-library changes to unwind.

<!-- /ANCHOR:rollback -->
