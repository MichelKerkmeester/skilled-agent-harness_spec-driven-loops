---
title: "Goal: the cli-hermes skill packet and hub mode"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/004-cli-hermes-skill-packet"
    last_updated_at: "2026-09-14T19:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Packet built and registered; both checkers and both routing stages pass"
    next_safe_action: "Phase 005 creates the repo-root .hermes folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-004-cli-hermes-skill-packet"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: the cli-hermes skill packet and hub mode

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** `cli-hermes` is the seventh mode of `cli-external-orchestration`, documented at the
same depth as `cli-pi` and `cli-devin`, and reachable through both routing stages.

### Decisions

Frozen choices for this phase. The parent goal's decisions bind here too; changing one of those is
an amendment to the packet root `goal.md`.

| ID | Decision |
|----|----------|
| P1 | The packet is built with `sk-create-skill`'s existing-hub checklist: `SKILL.md`, `README.md` (via `sk-create-readme`), `assets/prompt-quality-card.md`, `assets/prompt-templates.md`, `references/cli-reference.md`, `providers-and-models.md`, `agent-delegation.md`, `integration-patterns.md`, `hermes-tools.md`, `hook-contract.md`, `mcp-policy.md`, `changelog/` |
| P2 | Eight hard rules: `stdin-redirect-required`, `hermes-availability-required`, `yolo-required-for-writes`, `ignore-rules-required`, `explicit-toolsets-required`, `no-worktree-flag`, `mcp-config-operator-required`, `hooks-user-level` |
| P3 | The agent bridge is documented here: personas are inlined into the dispatch prompt per the shared quality card, with a persona-skill route as the alternative; the nested commands are exposed as prompt templates carried by `--query-file`; `hermes import-agent` is documented as not to be used |
| P4 | MCP is documented here as an operator step (`hermes mcp add` for the code-mode stdio launcher, deny-by-default through `hermes tools disable`), not as a repo file |
| P5 | Registration on all six hub surfaces: `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `ROUTER.md`, hub `SKILL.md` mode table and layout, `description.json` and `graph-metadata.json` trigger phrases; no nested `graph-metadata.json` or `description.json` in the packet |

### Completion criteria

1. `parent-skill-check.cjs` and `validate_skill_package.py` pass for the hub with the seventh mode.
2. The compiled-routing front door resolves a Hermes dispatch prompt to `cli-hermes` at stage one and to the packet's references at stage two, output recorded.
3. Every reference the leaf manifest lists exists on disk and every hard rule has a check id.
4. The six existing modes still resolve for their own prompts, shown by the same front door.

### Operator copy

The operator holds the parent directive as the session objective. A change here that alters a
parent decision or criterion is an amendment to the parent: apply it there and resend that file.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

| Surface | Bound to |
|---------|----------|
| Phase spec | `spec.md` |
| Closure gate | `acceptance-criteria.md` |

The parent directive in the packet root `goal.md` binds above this file. Evidence:
`../001-deep-research/research/research.md` angles 5, 7 and 9 and section 4 row R3.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Both hub checkers pass with the seventh mode
- [x] Compiled routing resolves a Hermes prompt through both stages
- [x] Every manifest leaf exists; every hard rule has a check id
- [x] The six existing modes still resolve
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet authored | Done | 14 files under `cli-hermes/`; `validate_skill_package.py` PASS |
| Hub registration on every surface | Done | `parent-skill-check.cjs` OK, 0 warnings, 7 modes |
| Compiled routing | Done | manifest fresh; front door routes Hermes prompts to `cli-hermes`, the six siblings to themselves |
| Stage one and stage two replay | Done | advisor 0.95 on the hub; vocabulary reach PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Started before phase 002's smoke | Recorded in the parent log; packet claims are marked source-read. |
| Compiled-routing harness enumerates sources by hand | `build-artifacts.cjs` under the graduated hub lists packet SKILL.md files; the Hermes entry and a canary case were added, the manifest refreshed. |
| Documented replay script missing | `parent-skills-nested-packets.md` §7 names `skill-benchmark/router-replay.cjs`, which is absent; adjacent finding for the reference's owner. |
<!-- /ANCHOR:log -->
