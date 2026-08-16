---
title: "Implementation Plan: Phase 1 fork-and-package"
description: "Plan for the identity-only fork: copy upstream, rename package identity, re-verify upstream tests."
trigger_phrases:
  - "001-fork-and-package"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package"
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
# Implementation Plan: Phase 1: fork-and-package

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
| **Language/Stack** | TypeScript (raw .ts loaded by pi's extension loader) |
| **Framework** | pi Extension API (`before_provider_request`, `session_start`, commands/flags) |
| **Storage** | JSON config files (user + project scope), no database |
| **Testing** | Vitest (upstream suite, 4 files) |

### Overview
Copy `context/pi-openai-fast-mode/` (v0.3.0, commit `9b28456`) into the fork working directory, rename the package identity (`package.json` name, `PACKAGE_NAME`/`STATUS_KEY` in `src/types.ts`), update README with provenance, then prove the untouched upstream vitest suite and typecheck pass. No logic changes: phase 2 adds handoff on top of this verified baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (upstream snapshot in context/)

### Definition of Done
- [ ] `npm run typecheck` exit 0
- [ ] `npm test` (unmodified upstream suite) exit 0
- [ ] Identity rename complete: no stray `pi-openai-fast-mode` references outside README provenance + repository URL
- [ ] `npm pack --dry-run` shows new package name
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Extension factory (upstream's `createPiFastModeExtension`) — preserved as-is.

### Key Components

- **`src/index.ts`**: extension factory, `/fast` command + `--fast` flag registration, `session_start`/`model_select`/`before_provider_request`/`session_shutdown` lifecycle
- **`src/config.ts`**: config load/save, user/project scope resolution, `syncSupportedTargets` self-upgrade
- **`src/payload.ts`**: target matching + `service_tier` injection
- **`src/commands.ts`**: `/fast` argument parsing + completions
- **`src/status.ts`**: widget-first indicator, setStatus fallback
- **`src/types.ts`**: identity constants (PACKAGE_NAME, STATUS_KEY) — the only logic-layer file renamed in this phase

### Data Flow

`/fast` or `--fast` → config.enabled persisted → `before_provider_request` matches current model against `config.targets` → injects per-target `service_tier` → widget/status indicator reflects enabled+supported state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix; identity-rename work. Rename inventory:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `src/types.ts` PACKAGE_NAME | status key + config dir namespace | rename to `pi-fast-mode-w-subagent-support` | `rg -n "pi-openai-fast-mode" src/` empty |
| `src/types.ts` STATUS_KEY | TUI indicator key | rename to match new PACKAGE_NAME | `rg -n "STATUS_KEY" src/` consistent |
| `package.json` | npm identity | rename name/description/keywords/repository | `npm pack --dry-run` |
| `tests/*` | verify upstream behavior | unchanged; must pass unmodified | `npm test` exit 0 |
| `README.md` | docs | rewrite identity + provenance (upstream commit `9b28456`) | prose review; `rg` shows only provenance hits |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Create fork working directory (decision: repo root vs `packages/` subdir)
- [ ] Copy upstream source from `context/pi-openai-fast-mode/` (exclude `.git`)
- [ ] `npm install` in the fork

### Phase 2: Identity Rename
- [ ] `package.json`: name → `pi-fast-mode-w-subagent-support`, description/keywords/repository updated
- [ ] `src/types.ts`: PACKAGE_NAME + STATUS_KEY → new identity
- [ ] Grep tests for identity literals; update deliberately if present (flag in handoff notes)
- [ ] README: new identity + provenance section citing upstream commit `9b28456`

### Phase 3: Verification
- [ ] `npm run typecheck` → 0
- [ ] `npm test` → 0
- [ ] `rg -n "pi-openai-fast-mode"` → only README provenance + repository URL
- [ ] `npm pack --dry-run` → correct name/file list
- [ ] Record evidence in checklist.md and close phase docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Upstream suite: commands, config, extension lifecycle, payload+status | Vitest |
| Static | Identity rename completeness | `rg` greps |
| Packaging | `npm pack --dry-run` file/name check | npm |

Explicitly NOT run in this phase: in-session install verification (phase 3), handoff propagation tests (phase 2).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Version | Purpose |
|-----------|---------|---------|
| Node.js | >= 22.19.0 | pi extension runtime |
| TypeScript | upstream devDependency | typecheck |
| Vitest | upstream devDependency | test runner |
| `@earendil-works/pi-coding-agent` | peer, `*` | Extension API types |

No new dependencies beyond upstream's declared set (NFR-2).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The fork is a new directory; nothing in the environment references it yet (install happens in phase 3).

- **Rollback**: delete the fork working directory. Upstream remains in `context/pi-openai-fast-mode/`; installed extensions and `.pi/settings.json` are untouched by this phase.
- **Restore**: re-copy from `context/` and re-apply the rename (documented in tasks.md).
<!-- /ANCHOR:rollback -->
