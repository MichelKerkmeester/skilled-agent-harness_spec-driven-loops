---
title: "Feature Specification: Phase 11: hub-registration-and-routing"
description: "The cli-external-orchestration hub, the skill advisor, the compiled-routing fixtures, the sk-prompt card and the agent tables do not list cli-deepseek-harness, so the mode packet exists but no request can select it. This phase registers the eighth mode on every routing surface and keeps the seven existing modes routing as before."
trigger_phrases:
  - "hub registration and routing"
  - "phase 11 hub registration and routing"
  - "register cli-deepseek-harness"
  - "eighth hub mode"
  - "dsh advisor routing"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: hub-registration-and-routing

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 14 |
| **Predecessor** | 010-dsh-mcp-code-mode |
| **Successor** | 012-deep-loop-modes-and-commands |
| **Handoff Criteria** | `mode-registry.json` lists eight modes including `cli-deepseek-harness`, the advisor names `cli-external-orchestration` for a dsh prompt, the compiled-routing build shows no drift and `check-agent-mirror-sync.cjs` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi specification.

**Scope Boundary**: Register the existing `cli-deepseek-harness` packet as the eighth hub mode on the hub, advisor, compiled-routing, sk-prompt and agent-table surfaces. Packet content, deep-loop command contracts, playbooks and governance docs belong to other phases.

**Dependencies**:
- `003-cli-deepseek-harness-skill-packet` (the packet the hub points at)
- `006-deep-loop-executor-kind` (the executor kind the agent tables and advisor cases name)

**Deliverables**:
- Hub files: `SKILL.md`, `ROUTER.md`, `README.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `graph-metadata.json`, `description.json`, the feature catalog index, two existing catalog entries, one new catalog entry, sibling `cli-*/README.md` mode tables and a hub changelog entry
- Advisor and routing: `check-prompt-quality-card-sync.sh`, regenerated `skill-graph.json`, `executor-delegation-cases.json`, `executor-delegation.vitest.ts`, the compiled-routing `canary-cases.v1.json` and `build-artifacts.cjs`
- Prompt and agents: `sk-prompt/SKILL.md`, `cli-prompt-quality-card.md`, `.skilled/agents/orchestrate.md`, `prompt-improver.md` and their regenerated runtime mirrors
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phase 003 the `cli-deepseek-harness` packet exists on disk, but `mode-registry.json` lists only seven modes and no advisor, router or canary fixture names it. A request such as "run this through dsh headless" therefore cannot reach the mode, and nothing yet guards the opposite failure where a request naming a DeepSeek model on `cli-opencode` is pulled to the harness.

### Purpose
A dsh request resolves to `cli-external-orchestration` and then to `cli-deepseek-harness`, while every request that already routed to one of the seven existing modes still lands there.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node -e 'const r=require("./.skilled/skills/cli-external-orchestration/mode-registry.json");const m=r.modes;console.log(m.length, m.map(x=>x.workflowMode).join(","))'
7 cli-opencode,cli-claude-code,cli-codex,cli-cursor,cli-devin,cli-pi,cli-hermes
exit 0

$ rg -c cli-deepseek-harness .skilled/skills/cli-external-orchestration/mode-registry.json
exit 1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `cli-deepseek-harness` entry to `mode-registry.json`, `hub-router.json` and `leaf-manifest.json` with aliases `dsh`, `dsh headless`, `deepseek harness` and `delegate to dsh`.
- Update the hub `SKILL.md`, `ROUTER.md`, `README.md`, `description.json`, `graph-metadata.json`, feature catalog and sibling mode tables so every count reads eight.
- Add advisor parity and scorer cases plus compiled-routing canary cases that select the new mode and keep "deepseek" model requests on `cli-opencode`.
- Add the mode to the sk-prompt card, the card-sync script and the `orchestrate` and `prompt-improver` agent tables, then regenerate the agent mirrors.

### Out of Scope
- Packet content under `cli-deepseek-harness/` - phase 003 owns it
- Deep-loop command YAMLs and compiled contracts - phase 012 owns them
- Playbook, `AGENTS.md`, `README.md` at the repo root and the trigger index - phase 014 owns them

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/{mode-registry,hub-router,leaf-manifest,description,graph-metadata}.json` | Modify | Eighth mode entry, aliases and counts |
| `.skilled/skills/cli-external-orchestration/{SKILL,ROUTER,README}.md` | Modify | Mode tables, route rows and counts |
| `.skilled/skills/cli-external-orchestration/feature-catalog/` | Modify and Create | Index row, two runtime lists and one new entry |
| `.skilled/skills/cli-external-orchestration/cli-*/README.md` | Modify | Sibling mode tables |
| `.skilled/skills/cli-external-orchestration/changelog/` | Create | Hub changelog entry |
| `.skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh` | Modify | Add the packet to the CLI skill list |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerate | Advisor graph with the mode |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/executor-delegation-cases.json` | Modify | Selection and conflict cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/executor-delegation.vitest.ts` | Modify | Scoring assertion |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json` | Modify | Canary cases |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs` | Modify | Packet source entry |
| `.skilled/skills/sk-prompt/SKILL.md`, `.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` | Modify | Model row and card row |
| `.skilled/agents/orchestrate.md`, `.skilled/agents/prompt-improver.md` | Modify | Executor tables |
| `.claude/agents/`, `.codex/agents/`, `.pi/agents/`, `.hermes/agents/` | Regenerate | Agent mirrors, never hand-edited |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node -e` over `mode-registry.json` prints 8 modes, one of them `cli-deepseek-harness` with aliases `dsh`, `dsh headless` and `deepseek harness` |
| REQ-002 | `node .skilled/bin/skill-advisor.cjs advisor_recommend --format json` for "run this task through dsh headless" names `cli-external-orchestration` |
| REQ-003 | `node .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/harness/build-artifacts.cjs` then `git diff --exit-code` on its outputs exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `bash .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh` exits 0 and the advisor parity and scorer vitest suites pass |
| REQ-005 | `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 after the agent tables change |
| REQ-006 | A canary case asserts "use cli-opencode with deepseek-v4.1-flash" still resolves to `cli-opencode` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The registry count command prints 8 and the advisor call for a dsh prompt names `cli-external-orchestration`.
- **SC-002**: The compiled-routing build, the card-sync script, the advisor suites and the mirror-sync check all exit 0, and the `cli-opencode` DeepSeek canary still resolves to `cli-opencode`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Packet from phase 003 and executor kind from phase 006 | Registration points at missing files and the hub checker fails | Start only after both phases validate, confirm with `ls` on the packet `SKILL.md` |
| Risk | The alias `deepseek` pulls model requests away from `cli-opencode` | Med | Use only harness aliases, never a bare model word, and pin the opposite case in a canary |
| Risk | Generated artifacts drift or a "seven" count stays stale | Med | Regenerate every generated file and run the `build-artifacts.cjs` drift check plus an `rg -i 'seven'` sweep of the hub |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The advisor call for a dsh prompt returns in the same order of time as for a `cli-pi` prompt, measured with `time` on both calls.
- **NFR-P02**: N/A: routing adds one registry row and serves no traffic.

### Security
- **NFR-S01**: No registry, fixture or card row names an API key value or a `.env` path.
- **NFR-S02**: The mode stays absent from default executor allowlists until phase 013 proves a route.

### Reliability
- **NFR-R01**: All seven existing modes resolve for their own canary prompts after the change.
- **NFR-R02**: Every generated file is produced by its generator, so a rerun shows zero diff.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a prompt with no executor vocabulary still defers at the hub as it does today.
- Maximum input: a prompt naming both `dsh` and `cli-opencode` resolves by the existing tie-break, recorded in a canary case.
- Failure path: a stale generated artifact makes `git diff --exit-code` exit 1 and blocks the phase until regenerated.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 30 files across the hub, advisor, compiled routing, sk-prompt and agents |
| Risk | 8/25 | Shared routing surfaces, all covered by existing checks |
| Research | 3/20 | Settled in phase 001 research Section 15 |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does the hub tie-break need a new rule when a prompt names both `dsh` and a DeepSeek model? Decided at implementation by a canary case.
<!-- /ANCHOR:questions -->

---
