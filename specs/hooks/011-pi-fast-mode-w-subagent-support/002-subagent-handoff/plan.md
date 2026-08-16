---
title: "Implementation Plan: Phase 2 subagent-handoff"
description: "Plan for adding PI_FAST_MODE_W_SUBAGENT_SUPPORT env handoff: module, wiring, precedence, tests."
trigger_phrases:
  - "002-subagent-handoff"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff"
    last_updated_at: "2026-08-16T09:20:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Authored phase docs"
    next_safe_action: "Execute phase plan"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: subagent-handoff

<!-- SPECKIT_LEVEL: 2 -->
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
| **Language/Stack** | TypeScript, pi Extension API |
| **Framework** | Environment-inheritance handoff (pattern: pi-gpt-fast-mode `src/handoff.ts`) |
| **Storage** | `process.env` (handoff) + existing JSON config (persisted desired state) |
| **Testing** | Vitest (new `tests/handoff.test.ts` + existing suite) |

### Overview
Add `src/handoff.ts` with `readHandoff`/`writeHandoff` over `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1|0`, mirroring the pi-gpt-fast-mode pattern. Wire `src/index.ts`: every desired-state change (toggle, flag) rewrites the env; every `session_start` resolves effective desired state with documented precedence (`--fast` flag > inherited env > persisted config), applies it, and rewrites the env so later children inherit the resolved value. Unit tests pin the contract; a manual two-process check proves propagation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (phase-1 fork, pi-gpt-fast-mode handoff reference)

### Definition of Done
- [ ] `npm run typecheck` exit 0
- [ ] `npm test` exit 0 (existing suite + new handoff tests)
- [ ] Manual two-process handoff check passed and recorded
- [ ] Precedence order documented in README
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Environment-variable preference export (proven by pi-gpt-fast-mode): write on change, read on child start, gate injection by the child's own target matching.

### Key Components

- **`src/handoff.ts`** (new): `HANDOFF_ENV`-scoped `readHandoff(env)` / `writeHandoff(desired, env)`; `"1"`→true, `"0"`→false, anything else→undefined; mutates the passed env object in place (upstream style).
- **`src/types.ts`** (modify): export `HANDOFF_ENV = "PI_FAST_MODE_W_SUBAGENT_SUPPORT"`.
- **`src/index.ts`** (modify):
  - `/fast` handler and `--fast` flag path call `writeHandoff(config.enabled)` after persisting.
  - `session_start` resolves precedence: flag > env > persisted; writes resolved value back to env; persists when changed; only then updates status.
- **`tests/handoff.test.ts`** (new): unit tests below.
- **`README.md`** (modify): handoff contract + precedence section.

### Data Flow

Parent: `/fast on` → config.enabled=true → writeHandoff(true) → `PI_FAST_MODE_W_SUBAGENT_SUPPORT=1` in parent process.env. Spawned child pi inherits env → session_start → readHandoff → effective desired=true (absent stronger flag) → persists + writes env → before_provider_request matches child model against targets → injects service_tier.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix; feature addition. Consumer inventory of the new env contract:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `src/handoff.ts` | (new) | create | unit tests |
| `src/index.ts` handlers | state transitions | write env on change | unit test (mock env) |
| `src/index.ts` session_start | child startup | apply env + precedence | unit test + manual two-process |
| `src/types.ts` | constants | add HANDOFF_ENV | grep |
| `README.md` | docs | document contract | prose |
| pi-subagents / child pi | env consumer | inherits automatically, no change | manual two-process check |

Env-name collision check: `rg -n "PI_FAST_MODE_W_SUBAGENT_SUPPORT|PI_GPT_FAST_MODE" ~/.pi /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public --glob '!**/node_modules/**'` before finalizing the constant.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Handoff module
- [ ] Add `HANDOFF_ENV` to `src/types.ts`
- [ ] Create `src/handoff.ts` (read/write, upstream pattern)
- [ ] Unit tests for read/write round-trip and invalid values

### Phase 2: Wiring
- [ ] Write env after `/fast` toggle and `--fast` flag application
- [ ] session_start precedence resolution (flag > env > persisted) with back-write to env
- [ ] Persist-on-change when env wins over persisted config
- [ ] Update README with contract + precedence

### Phase 3: Verification
- [ ] `npm run typecheck` → 0
- [ ] `npm test` → 0
- [ ] Manual two-process check: parent on → child env `=1`; child session applies fast mode on supported model
- [ ] Record evidence in checklist.md; close phase docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | readHandoff/writeHandoff contract, precedence resolution, env write on toggle | Vitest |
| Regression | existing commands/config/payload/status tests stay green | Vitest |
| Manual | parent → child propagation, child-only toggle does not affect parent env | two pi processes |

Precedence cases to pin: flag overrides inherited env; inherited env overrides persisted config; unset env falls back to persisted config; invalid env value treated as unset.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Version | Purpose |
|-----------|---------|---------|
| Phase-1 fork | local | baseline package |
| Node.js | >= 22.19.0 | runtime |
| Vitest | upstream devDependency | tests |

No new runtime or dev dependencies (NFR-1).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The fork is still not installed in any settings (phase 3 does that).

- **Rollback**: revert `src/handoff.ts`, `src/types.ts`, `src/index.ts`, `tests/handoff.test.ts`, README changes — the phase-1 baseline is the restore point (git commit at end of phase 1).
- **Restore**: `git checkout` the phase-1 commit for the fork tree.
<!-- /ANCHOR:rollback -->
