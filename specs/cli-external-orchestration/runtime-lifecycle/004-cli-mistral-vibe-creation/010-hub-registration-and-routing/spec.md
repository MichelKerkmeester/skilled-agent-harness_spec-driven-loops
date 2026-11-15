---
title: "Feature Specification: Phase 10: hub-registration-and-routing"
description: "The cli-external-orchestration hub registers seven modes and none is cli-mistral-vibe, so a request to delegate to Vibe reaches the hub at stage one and finds no mode at stage two. This phase registers the mode on every hub surface its metadata routing class needs and proves both stages route a Vibe request to it."
trigger_phrases:
  - "hub registration and routing"
  - "phase 10 hub registration and routing"
  - "cli-mistral-vibe hub registration"
  - "delegate to vibe routing"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: hub-registration-and-routing

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 12 |
| **Predecessor** | 009-deep-loop-executor-kind |
| **Successor** | 011-vibe-context-and-goal-hooks |
| **Handoff Criteria** | The hub routes a "delegate to vibe" prompt to the mode at both routing stages |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: The hub surfaces that make `cli-mistral-vibe` reachable: registry, stage-one and stage-two routers, advisor vocabulary, compiled routing, prompt card and agent executor tables. The mode packet's own content stays with phase 005.

**Dependencies**:
- Phase 009 (`009-deep-loop-executor-kind`), so the agent tables name an executor kind the deep-loop runtime accepts.
- Phase 005's packet at `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md`, which the registry and the compiled-routing build hash.

**Deliverables**:
- An eighth `cli-mistral-vibe` entry on every surface in section 7 of `parent-skills-nested-packets.md` that applies to a `metadata` mode.
- Compiled-routing canaries and advisor cases that select the mode for Vibe vocabulary and keep Mistral model requests on their own runtime.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hub's registry lists seven modes and no hub routing file names `cli-mistral-vibe`, so a request to delegate to Vibe can reach the hub but never the mode. The compiled router for the hub serves `legacy` today because its manifest is stale, so stage two currently falls back to the prose router.

### Purpose
A "delegate to vibe" request selects the hub at stage one and `cli-mistral-vibe` at stage two, and no unrelated request selects it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ H=.skilled/skills/cli-external-orchestration
$ SCRATCH=<session scratchpad directory>
$ rg -c 'cli-mistral-vibe' $H/mode-registry.json $H/hub-router.json $H/ROUTER.md $H/SKILL.md $H/graph-metadata.json; echo "exit=$?"
exit=1
$ node -e "console.log(require('./.skilled/skills/cli-external-orchestration/mode-registry.json').modes.length)"
7
$ node .skilled/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "delegate to vibe"; echo "exit=$?"
{"servingAuthority":"legacy","hubId":"cli-external-orchestration"}
exit=0
$ node .skilled/bin/compiled-route-status.cjs --hub cli-external-orchestration > $SCRATCH/st.json; echo "exit=$?"
exit=0
$ node -e "const s=require('$SCRATCH/st.json');console.log(s.servingAuthority, s.causeCode)"
legacy stale-manifest
$ python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "delegate to vibe" --threshold 0.5 > $SCRATCH/adv.json; echo "exit=$?"
exit=0
$ rg -n '"skill"|"confidence"' $SCRATCH/adv.json
3:    "skill": "cli-external-orchestration",
4:    "kind": "skill",
5:    "confidence": 0.5974,
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Register `cli-mistral-vibe` in `mode-registry.json`, `hub-router.json` (signals and tieBreak) and the root `ROUTER.md` (`INTENT_SIGNALS` and `RESOURCE_MAP`), with narrow aliases `mistral vibe`, `vibe -p` and `delegate to vibe`.
- Add the mode's vocabulary to the hub `graph-metadata.json`, and the mode row and count to the hub `SKILL.md`, `README.md` and `description.json`, so every count reads eight.
- Add compiled-routing source and canary entries, advisor parity and scorer cases, and remint the compiled routing so stage two serves the compiled decision.
- Add the mode to the sk-prompt card, the card-sync script and the `orchestrate` and `prompt-improver` executor tables, then regenerate the agent mirrors.

### Out of Scope
- Packet content under `cli-mistral-vibe/` - phase 005 owns it.
- Manual testing playbook, feature catalog and `.skilled/CROSS-CLI.md` - phase 012 owns them.
- Sibling `cli-*/README.md` mode tables - phase 012 owns cross-runtime docs, and another session is editing `cli-opencode/README.md` now.
- A bare `vibe` alias - "vibe" is ordinary English and would capture design and tone requests the hub cannot serve.
- ACP supervisor routing - deferred until print mode is proven, so no ACP alias or second dispatch row is registered.
- Session-relaunch, turn-stopping guard and sandbox routing - deferred, because Vibe has no idle or compaction event, `post_agent` cannot be strict and Vibe has no sandbox field.
- Any change to default models - DevPass stays the default.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/mode-registry.json` | Modify | Eighth mode entry and count wording in its description strings |
| `.skilled/skills/cli-external-orchestration/hub-router.json` | Modify | `routerSignals` entries and the mode in `routerPolicy.tieBreak` |
| `.skilled/skills/cli-external-orchestration/ROUTER.md` | Modify | `INTENT_SIGNALS` and `RESOURCE_MAP` rows with equal keys |
| `.skilled/skills/cli-external-orchestration/graph-metadata.json` | Modify | Advisor vocabulary for the mode |
| `.skilled/skills/cli-external-orchestration/{SKILL,README}.md`, `description.json` | Modify | Mode table, keywords and count of eight |
| `.skilled/skills/cli-external-orchestration/leaf-manifest.json` | Regenerate | Leaf entries for the new packet |
| `.skilled/skills/cli-external-orchestration/changelog/` | Create | Hub changelog entry |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs` | Modify | Packet `SKILL.md` source entry |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json` | Modify | Selection and stay-on-runtime canaries |
| `.skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh` | Modify | Packet in the CLI skill list |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerate | Advisor graph with the mode |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/executor-delegation-cases.json` | Modify | Selection and conflict cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts` | Modify | Scoring assertion |
| `.skilled/skills/sk-prompt/SKILL.md`, `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` | Modify | Model row and card row |
| `.skilled/agents/orchestrate.md`, `.skilled/agents/prompt-improver.md` | Modify | Executor table rows |
| `.claude/agents/`, `.codex/agents/`, `.pi/agents/`, `.dsh/agents/`, `.vibe/agents/` | Regenerate | Agent mirrors from their generators, never hand-edited |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The registry and tieBreak carry the mode | The `node -e` modes count prints 8, and `parent-skill-check.cjs` run with the hub path prints the hub subject line and passes checks 3b and 5e |
| REQ-002 | Stage two routes a Vibe request to the mode | `compiled-route.cjs --hub cli-external-orchestration --prompt "delegate to vibe"` prints `"workflowMode":"cli-mistral-vibe"` |
| REQ-003 | Stage one routes the same request to the hub | `skill_advisor.py "delegate to vibe" --threshold 0.5` names `cli-external-orchestration` with `passes_threshold` true |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A Mistral model named with another runtime stays on that runtime | The canary "use cli-opencode with mistral deepseek-v4-1-flash-1017" routes to `cli-opencode` |
| REQ-005 | An out-of-domain "vibe" phrase does not select the mode | `compiled-route.cjs` for "give this landing page a calmer vibe" prints no `cli-mistral-vibe` |
| REQ-006 | The agent mirrors and the prompt card stay in sync | `check-agent-mirror-sync.cjs --all` reports all mirrors in sync, and `check-prompt-quality-card-sync.sh` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both routing stages pick `cli-external-orchestration` and then `cli-mistral-vibe` for "delegate to vibe", recorded from one run of each command.
- **SC-002**: The advisor parity and executor-delegation scorer suites pass with the new cases, and the compiled-route manifest tests report 0 failures.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 005's `cli-mistral-vibe/SKILL.md` and phase 009's executor kind | High: the registry and build hash a packet that must exist, and the tables name a kind the runtime must accept | Setup confirms both before any edit |
| Risk | `cli-opencode/SKILL.md` is a hashed compiled-routing source and another session is editing it, so a remint during that session may go stale again | Med | Remint after that session lands. Inferred, not confirmed: `compiled-route-status.cjs` reporting `fresh: true` after the remint and again after the other session's commit would confirm or refute it |
| Risk | A Vibe alias captures unrelated "vibe" requests | Med | No bare `vibe` alias, and a Verify task replays an out-of-domain phrase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the stale manifest the Measured Behavior shows come from the in-flight `cli-opencode` edits, or from an earlier source change? The first remint and a status read decide it.
- Whether phase 006 ships a `.vibe/agents/` generator with `--check` decides if T014 regenerates it. UNKNOWN until phase 006 lands.
<!-- /ANCHOR:questions -->

---
