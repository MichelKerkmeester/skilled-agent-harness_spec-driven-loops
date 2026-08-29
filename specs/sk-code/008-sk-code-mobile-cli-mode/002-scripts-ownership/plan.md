---
title: "Phase 2 plan — how the scripts-ownership decision was reached"
description: "The analysis behind keeping scripts/ in the app repo: inventory the 26 scripts and what they read/run, check how they are invoked (npm scripts + CI), check the skill's packet kind and its existing references to them, and conclude on ownership. No code change."
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/008-sk-code-mobile-cli-mode/002-scripts-ownership"
    last_updated_at: "2026-08-25T19:45:00.000Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Analysis path recorded; decision reached from the evidence."
    next_safe_action: "None — decision complete."
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Phase 2 plan

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Decide script ownership from evidence, not preference: what each script reads and runs, how it is invoked,
and what the skill's own contract permits. The evidence points one way — the app owns the tooling, the
skill references it — so the packet records that and ships no change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

No code changes, so no test gate. The proof is evidentiary: the `scripts/` inventory, the `package.json`
npm wiring, and the skill's existing references. The final state is confirmed by the working tree being
unchanged outside this decision packet (`git status`).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The boundary is one of ownership vs. reference. The app OWNS the tooling: `scripts/` reads `app-mobile/src`
and `app.css`, drives Storybook/CDP, and runs in CI, wired through `package.json`. The skill REFERENCES the
tooling: its reference docs name the scripts as the verification recipe. A read-only surface leaf
(`mutatesWorkspace: false`) cannot hold runnable, mutating tooling, so ownership stays with the app and the
skill points at it — the same split already in place, now recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 · inventory
List `scripts/` + `scripts/naming/` (26 files) and what each targets — `app-mobile/src`, `app.css`,
Storybook/CDP, CI thresholds.

### Phase 2 · invocation + contract
Confirm invocation is app-side (`package.json` npm scripts, CI), and confirm the skill is a read-only
surface leaf that already references the scripts by name.

### Phase 3 · record
Record the decision and its three reasons; confirm no file moved.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

None — no code changes. The evidence (inventory, `package.json` wiring, the skill's references) is the
proof, and the final state is confirmed by the working tree being unchanged.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The `scripts/` and `scripts/naming/` inventory and the `package.json` script wiring.
- The `sk-code-mobile-cli` skill's kind (`packetKind: surface`, `mutatesWorkspace: false`) and its
  reference docs that name the scripts.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not applicable — a decision record moves no files. If the decision is ever reversed, that is a new packet
with its own migration plan and CI rewiring.
<!-- /ANCHOR:rollback -->
