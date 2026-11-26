---
title: "Goal: Phase 2: hub-scaffold"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hub scaffold goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/002-hub-scaffold"
    last_updated_at: "2026-11-21T08:11:42Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-21-browser-use-hub-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: hub-scaffold

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Create the mcp-browser-use hub root so that it passes its own parent-skill check and is ready to receive its three browser modes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The hub is created with `/create:skill-parent`, never by hand. |
| D2 | Its contract follows the 001-research KQ3 answer, with `mcp-tooling` as the reference shape. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] parent-skill-check.cjs run with .skilled/skills/mcp-browser-use exits 0 and names that hub
- [x] .skilled/skills/mcp-browser-use/mode-registry.json lists exactly mcp-chrome-devtools, mcp-aside-devtools and mcp-bladebro, each packetKind workflow, backendKind cli-plus-mcp and routingClass metadata
- [x] .skilled/skills/mcp-browser-use/mode-registry.json has no transport-axis extension
- [x] .skilled/skills/mcp-browser-use/SKILL.md names all three modes in its mode table
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Draft scope written | Done | spec.md marked refined after 001-research |
| Refine from 001-research | Done | spec.md, plan.md and tasks.md cite `research.md` §5, §7 and §11 |
| Hub scaffold built | Done | `parent-skill-check.cjs .skilled/skills/mcp-browser-use` exit 0, `OK: parent-skill-check — all hard invariants passed, 0 warnings`; the registry lists the three ids, all workflow/cli-plus-mcp/metadata; `.extensions["transport-axis"]` is `null`; the hub SKILL.md mode table names all three |

### Deviations and findings

| Item | Note |
|------|------|
| Mode stubs | The scaffold writes three mode stubs so check 3c passes before 003 and 004 land; this is a plan choice, not a research finding |
| Contract | `transport-axis` is not carried, answering the earlier open question (`research.md` §5) |
| Stub leaves | `generate-leaf-manifest.cjs` refused three empty, hash-equal leaf sets, so each stub has one distinct `references/<mode>-scaffold.md` status leaf. 003 deletes two of them with their stubs |
| Placeholder intent | The skill-parent YAML requires `active` packet routers with non-empty maps but forbids placeholder intents. Each stub router has one `SCAFFOLD_STATUS` intent mapped to its status leaf |
<!-- /ANCHOR:log -->
