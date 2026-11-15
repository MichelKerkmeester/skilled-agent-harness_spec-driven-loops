---
title: "Implementation Plan: Phase 10: hub-registration-and-routing"
description: "Register cli-mistral-vibe on every cli-external-orchestration hub surface a metadata-class mode needs, remint compiled routing, and prove both routing stages send a Vibe request to the mode."
trigger_phrases:
  - "hub registration and routing plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: hub-registration-and-routing

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON registries, Markdown routers, Node.js CommonJS harness, TypeScript tests, Python advisor |
| **Framework** | cli-external-orchestration parent hub with compiled routing |
| **Storage** | None |
| **Testing** | `parent-skill-check.cjs`, `compiled-route.cjs`, `skill_advisor.py`, vitest advisor suites, `node --test` manifest tests |

### Overview
Add the eighth mode to the hub's registry, both routers and advisor vocabulary, then to the prompt card and the agent executor tables. The mode is `routingClass: "metadata"`, so stage one reaches it only through the hub's `graph-metadata.json` and needs no projection map. Proof is one replay of each routing stage plus the per-hub gate run with the hub path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `ls .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md` prints the path (phase 005 landed)
- [ ] `rg -n 'cli-mistral-vibe' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` prints the executor kind row (phase 009 landed)
- [ ] The modes count prints 7 before the first edit

### Definition of Done
- [ ] `compiled-route.cjs --hub cli-external-orchestration --prompt "delegate to vibe"` prints `"workflowMode":"cli-mistral-vibe"`
- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-external-orchestration` prints the hub subject line and no hard failure
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-stage hub routing.

### Key Components
- **Stage one (advisor)**: reads the hub's `graph-metadata.json` and picks `cli-external-orchestration`. Without the mode's vocabulary there, a Vibe-only phrasing scores the hub on generic words alone.
- **Stage two (hub router)**: `hub-router.json` signals and tieBreak plus the root `ROUTER.md` intent and resource maps pick the mode and its leaves. Without them the hub has no Vibe mode to pick.
- **Compiled routing**: `build-artifacts.cjs` hashes each packet `SKILL.md`, so the new packet joins its source list and a remint makes the hub serve the compiled decision.

### Data Flow
A prompt goes to the advisor, which scores the hub from its vocabulary. The hub then resolves the mode through the compiled router when its manifest is fresh, or through the prose `ROUTER.md` when it serves `legacy`. The selected mode loads its own `ROUTER.md` leaves.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms phases 005 and 009 landed and records the seven-mode and stale-manifest baseline. Implementation edits the registry, both routers, the advisor vocabulary, the compiled-routing inputs, the prompt card and the agent tables in that order. Verification remints, runs the per-hub gate with the hub path and replays both stages for an in-domain and an out-of-domain phrase. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command and expected output |
|-----------|-------|-----------------------------|
| Gate | Registry, tieBreak and leaf manifest | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-external-orchestration` names the hub on its subject line and reports `declares 8 modes` |
| Stage one | Advisor picks the hub | `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "delegate to vibe" --threshold 0.5` names `cli-external-orchestration` |
| Stage two | Hub picks the mode | `node .skilled/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "delegate to vibe"` prints `"workflowMode":"cli-mistral-vibe"` |
| Unit | Advisor parity and executor-delegation scorer | vitest reports 0 failed |
| Integration | Compiled-route manifest | `node --test .skilled/bin/tests/compiled-route-manifest.test.cjs` reports `fail 0` |

A green gate is not integration, so the two replays are required even when every check passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Impact if Blocked |
|------------|------|-------------------|
| `005-cli-mistral-vibe-skill-packet` | Internal | The registry and build point at a packet that does not exist |
| `009-deep-loop-executor-kind` | Internal | The agent tables name a kind the runtime does not accept |
| `006-vibe-runtime-folder-and-mirrors` | Internal | No `.vibe/agents/` generator to rerun after the agent table edits |

No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: an out-of-domain replay selects `cli-mistral-vibe`, or a sibling canary changes mode. Revert the phase's commit, then rerun `build-artifacts.cjs` and `compiled-route-sync.cjs` so the served closure matches the reverted sources.
<!-- /ANCHOR:rollback -->

---
