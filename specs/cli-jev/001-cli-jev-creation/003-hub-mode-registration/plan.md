---
title: "Implementation Plan: Phase 3: hub-mode-registration"
description: "Register cli-jev as a transport on every routing surface, teach the dispatch hooks and the compiled-routing compiler to recognise and model it, then rebuild and re-mint so the runtime serves what the files claim."
trigger_phrases:
  - "implementation plan"
  - "approach and phases"
  - "testing strategy"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/001-cli-jev-creation/003-hub-mode-registration"
    last_updated_at: "2026-09-20T10:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Plan executed; the compiler transport support was the one unplanned change"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-003-hub-mode-registration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: hub-mode-registration

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Surfaces | Registry, router, intent map, resource map, leaves, hub docs, dispatch hooks, compiled policy |
| Enforcement | The per-hub gate, the dispatch suites, the compiled freshness probe |
| Generated artifacts | Leaf manifest, intent signals, compiled policy, serving manifest, trigger index |
| Baseline | One invariant failure naming the unregistered mode; manifest fresh at generation 5 |

### Overview

Register first, then enforce, then serve — in that order, because each layer reads the previous one. The per-hub gate judges the registration, the dispatch suites judge the enforcement, and the freshness probe judges whether the runtime agrees. Every step ends in a gate whose failure mode is specific.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The packet's rules exist with check ids, so the implementations have something to implement
- The baseline is captured: gate failure count, manifest freshness, generator outputs

### Definition of Done

- The per-hub gate is green with zero warnings, and its transport rule was negative-controlled
- Both dispatch suites pass with the bijection guard satisfied in both directions
- The compiled manifest is fresh, serving the newly compiled hash, and the canary fixture covers the transport
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One declaration, four readers. The registry is the only source: the gate validates it, the router signals it, the audit maps commands to it, and the compiler turns it into a policy. Nothing downstream re-declares the mode, so a change lands once and every reader follows or fails loudly.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| `mode-registry.json` | The transport declaration and the axis that names it |
| `hub-router.json`, `ROUTER.md` | Scoring vocabulary and leaf sets |
| `dispatch-audit.mjs`, `dispatch-rule-checks.mjs` | Command recognition and rule enforcement |
| `registry-compiler.cjs` | Transport destinations, roles and the authority relation |
| `build-artifacts.cjs`, canary fixture | Compilation inputs and the behavioral cases |
| Serving manifest, trigger index | What the runtime serves and what retrieval finds |

### Data Flow

Registry → signals and classes → compiled policy → serving manifest. Hooks read the packet's `SKILL.md` for rules and the registry for identity. The trigger index and the leaf manifest are derived from the docs and checked by their own generators.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Name | Outcome |
|-------|------|---------|
| 1 | Registry and axis | The transport entry satisfying the gate's transport contract |
| 2 | Routing surfaces | Signal, classes, tie-break, intent map, resource map, leaves, hub docs |
| 3 | Dispatch enforcement | The jev shape and eight checks with fixtures |
| 4 | Compiled support | The transport role, the authority relation, the harness source and the canary cases |
| 5 | Serve and regenerate | Rebuild, re-mint, regenerate the index |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each layer gets the check it deserves rather than one smoke test for the whole phase. The registration is judged by the gate the repository already runs, with a negative control to prove the transport rule is live. The enforcement is judged by suites that assert both directions of the declared-versus-implemented bijection. The serving path is judged behaviorally: four prompts through the compiled router, including two that must not change.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Why it matters | If unavailable |
|------------|----------------|----------------|
| Phase 002's packet | The rules the checks implement | The checks would enforce nothing the packet declares |
| The compiled-routing toolchain | The mode has to be compiled to be served | Registration would land but serving would stay legacy |
| A working `jev` binary | The availability rule's own probes | The rule still reads PATH; only the live probe would be missing |

> The regression risk for the seven existing modes is real here: their prompts were replayed after the change rather than assumed unaffected.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the registry, router, `ROUTER.md`, `SKILL.md`, README, leaf manifest, description, graph metadata and the changelog entry; remove the hook rows and checks; restore the previous compiled artifacts and re-mint from the reverted registry. The manifest is the load-bearing artifact: a rollback that leaves it pointed at a compiled policy the sources no longer produce is detected as stale rather than served, which makes the partial state safe rather than silent.
<!-- /ANCHOR:rollback -->
