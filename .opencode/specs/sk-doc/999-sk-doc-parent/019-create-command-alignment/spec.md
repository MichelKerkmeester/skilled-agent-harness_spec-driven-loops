---
title: "Feature Specification: Full /create command coverage and /create:<packet> rename"
description: "Give every sk-doc packet except create-quality-control a bound /create command (add 3), and rename the 4 drifted commands to /create:<packet> naming, wiring every live surface including the skill-advisor routing ids."
trigger_phrases:
  - "create command alignment"
  - "125 sk-doc phase 019"
  - "create command rename"
  - "create command coverage"
importance_tier: "normal"
contextType: "implementation"
parent: "skilled-agent-orchestration/125-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/019-create-command-alignment"
    last_updated_at: "2026-07-07T12:55:35.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Added 3 commands + renamed 4 + swept surfaces + advisor"
    next_safe_action: "Finalize enumeration surfaces, validate, roll up parent"
    blockers: []
    key_files:
      - ".opencode/commands/create/"
      - ".opencode/skills/sk-doc/mode-registry.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Feature Specification: Full /create command coverage and /create:<packet> rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | `skilled-agent-orchestration/125-sk-doc-parent` |
| **Depends On** | none |
| **Predecessor** | `018-swimlane-revert/` |
| **Successor** | none |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two gaps in the sk-doc `/create:*` command surface: (1) three packets (`create-command`, `create-benchmark`, `create-flowchart`) had no bound command — their `mode-registry.json` `command` field was `null`; and (2) four commands drifted from their packet names (`sk-skill`, `sk-skill-parent`, `folder_readme`, `testing-playbook`) so the public ids no longer matched `/create:<packet>`.

### Purpose
Make the command surface complete and consistent: every sk-doc packet except `create-quality-control` (which is `/doc:quality`, a different namespace) gets a `/create:*` command, and the four drifted ids are renamed to match their packets. Wire every LIVE surface — routers, assets, `mode-registry.json`, hub `SKILL.md`, packet docs, both `markdown.md` mirrors, the command `README.txt` indexes, install-guide listings, and the skill-advisor routing ids — while leaving historical spec/changelog references (time-stamped records) untouched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Add 3 commands**: `/create:command`, `/create:benchmark`, `/create:flowchart` (each a 4-file set: router + auto/confirm YAML + presentation), domain-adapted from the closest existing command, un-numbered thin-router structure matching the 9 siblings.
- **Rename 4 commands** to `/create:<packet-suffix>`: `sk-skill`→`skill`, `sk-skill-parent`→`skill-parent`, `folder_readme`→`readme`, `testing-playbook`→`manual-testing-playbook` (router `.md` + 3 assets each; `create_parent_skill_*` normalized to `create_skill_parent_*`).
- **Wire every live surface** for both adds and renames, including the skill-advisor scorer ids (aliases, explicit-lane, projection, fusion), the Python `skill_advisor.py` mirror, and the matching vitest + parity fixtures.

### Out of Scope
- `create-quality-control` / `/doc:quality` — a different namespace; never added to `/create:*` lists.
- Historical `.opencode/specs/**` references and the `sk-doc/changelog/v1.5.0.0.md` entry — time-stamped records that correctly name the old ids.
- The gated skill-advisor scorer-saturation re-baseline (the 193-row corpus) — a separate track; this phase only keeps its ids consistent and flags the re-baseline dependency.
- The 7 sibling command routers' validate_document.py command-type failure — a pre-existing repo-wide convention gap (see Open Questions).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/commands/create/{command,benchmark,flowchart}.md` + assets | Add | 3 new command 4-file sets |
| `.opencode/commands/create/{sk-skill,sk-skill-parent,folder_readme,testing-playbook}.md` + assets | Rename | 16 files → `/create:<packet>` names |
| `.opencode/skills/sk-doc/mode-registry.json` | Update | 3 null command fields set + 4 renamed |
| `.opencode/skills/sk-doc/SKILL.md`, `README.md`, packet docs | Update | Mode table, command list/count, packet-doc ids |
| `.opencode/agents/markdown.md`, `.claude/agents/markdown.md` | Update | Command list, count, template table |
| `.opencode/commands/create/README.txt`, `.opencode/commands/README.txt` | Update | COMMANDS table, STRUCTURE tree, @markdown fix |
| `.opencode/skills/system-skill-advisor/mcp_server/**` | Update | Scorer + Python routing ids, vitests, parity fixture |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every packet except create-quality-control has a bound command | `mode-registry.json` has zero `"command": null`; 10 `/create:*` commands resolve to a real 4-file set |
| REQ-002 | The 4 drifted commands are renamed to `/create:<packet>` | Old router/asset files gone; new ones present; every resource path in each auto.yaml resolves |
| REQ-003 | Every live surface references the new ids; no stale live refs | Live-surface sweep finds 0 old command-ids (historical specs + the v1.5.0.0 changelog excepted) |
| REQ-004 | The advisor rename is test-neutral | native-scorer vitest passes; advisor suite failure set is identical to the HEAD baseline (no new failures) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The 3 new commands are internally consistent + grounded | Same thin-router structure; domain-adapted flags/path-resolution; all cited template paths exist |
| REQ-006 | Enumeration surfaces list all 10 commands with correct counts | README.md, both mirrors, both README.txt enumerate 10; counts read "ten" |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg '"command": null'` on `mode-registry.json` → zero matches; 10 commands each resolve to a 4-file set with all resource paths present.
- **SC-002**: Live-surface stale-ref sweep → only `changelog/v1.5.0.0.md` retains old ids (by design).
- **SC-003**: Advisor `native-scorer` vitest green; full advisor suite delta vs HEAD baseline = 0 new failures.
- **SC-004**: `validate.sh --strict` exit 0 for this folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `testing-playbook` ⊂ `manual-testing-playbook` double-prefix on sweep | Corrupted ids | Anchored patterns + negative lookbehind; `manual-manual` check = 0 |
| Risk | Advisor is a gated, operator-locked track with a concurrent session | Clobber/conflict | Scorer code files verified clean; 0-leak pathspec commits; pre-commit race re-check; concurrent 011 specs/READMEs excluded |
| Risk | Reformatting compact JSON via json.dump | Unreviewable diff | Surgical text edits only; verified 3-line/4-line diffs |
| Dependency | Pending advisor 193-row re-baseline | Must regenerate against new ids | Flagged in handover; separate gated track |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **validate_document.py command-type gap**: all 10 command routers fail the validator's `command`-type rule (requires `purpose`/`instructions` sections), because the repo's thin-router house style uses `Routing Assets`/`Execution Order` instead. This is pre-existing and repo-wide (the 3 new routers were normalized to match the 9 siblings). Recommended follow-up: reconcile the validator rule with the router house style, or renumber all 10 routers — out of scope here (would touch 7 unrelated siblings).
- **Command-rename changelog entry**: a new `sk-doc/changelog` version documenting the rename is a reasonable follow-up (not authored here to stay in approved scope).
<!-- /ANCHOR:questions -->
