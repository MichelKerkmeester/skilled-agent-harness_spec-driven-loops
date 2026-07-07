---
title: "Implementation Summary: /create command coverage and rename"
description: "Added 3 /create commands and renamed 4 to /create:<packet>, wiring every live surface and the skill-advisor ids test-neutrally across four 0-leak commits."
trigger_phrases:
  - "create command alignment summary"
  - "125 sk-doc phase 019 summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/019-create-command-alignment"
    last_updated_at: "2026-07-07T12:55:35.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped adds + renames + advisor + surfaces across 4 commits"
    next_safe_action: "Validate --strict; roll up parent 125"
    blockers: []
    key_files:
      - ".opencode/commands/create/"
      - ".opencode/skills/sk-doc/mode-registry.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 019-create-command-alignment |
| **Completed** | 2026-07-07 |
| **Level** | 2 |
| **Commits** | `fb24196b01` adds, `8c99303a23` advisor, `6db3a50403` rename, `da02cc6634` docs, `98e1d73d53` missed-surface fix |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Completed the sk-doc `/create:*` command surface. Every packet except `create-quality-control` (which is `/doc:quality`) now has a bound command, and the four drifted ids were renamed to `/create:<packet>`.

- **Added 3 commands** — `/create:command`, `/create:benchmark`, `/create:flowchart` — each a 4-file set copied from the closest sibling and adapted to its target packet, then normalized to the un-numbered thin-router structure the 9 siblings use and domain-adapted (per-command verified flag + output-path resolution; no generic agent boilerplate).
- **Renamed 4 commands** — `sk-skill`→`skill`, `sk-skill-parent`→`skill-parent`, `folder_readme`→`readme`, `testing-playbook`→`manual-testing-playbook` — via `git mv` of the router + 3 assets each (normalizing `create_parent_skill_*`→`create_skill_parent_*`).
- **Wired every live surface** — routers, assets, `mode-registry.json`, hub `SKILL.md`/`README.md`, the create-skill/create-readme/create-manual-testing-playbook packet docs, both `markdown.md` mirrors, both command `README.txt` indexes (COMMANDS tables + structure trees), install-guide listings, and the skill-advisor routing ids across the TS scorer + Python mirror + vitests + parity fixture.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `commands/create/{command,benchmark,flowchart}.md` + 9 assets | Add | 3 new command sets |
| `commands/create/{sk-skill→skill,sk-skill-parent→skill-parent,folder_readme→readme,testing-playbook→manual-testing-playbook}` + assets | Rename | 16 files |
| `sk-doc/mode-registry.json` | Modify | 3 command fields set + 4 renamed (surgical) |
| `sk-doc/SKILL.md`, `README.md`, 3 packet docs | Modify | Mode table, list/count/FAQ, packet ids |
| `agents/markdown.md`, `.claude/agents/markdown.md` | Modify | List, count, template table (mirrors in sync) |
| `commands/create/README.txt`, `commands/README.txt` | Modify | COMMANDS table, structure tree, @markdown |
| `install_guides/{README.md,SET-UP - AGENTS.md}` | Modify | Command listings (renames) |
| `system-skill-advisor/mcp_server/**` (8 files) | Modify | Routing ids + vitests + parity fixture |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Deterministic throughout. Adds were copy-then-adapt (never regenerate — avoids auto/confirm drift), verified by a fresh sub-agent and `test -e` on all 31 cited resource paths. Renames used `git mv` plus anchored, live-surface-scoped `perl` sweeps — the `create:X`/`command-create-X`/filename tokens only, with a negative lookbehind so `testing-playbook`⊂`manual-testing-playbook` never double-prefixed (`manual-manual` check = 0). Compact JSON (`mode-registry.json`) was edited with surgical text replacement, never `json.dump` (which reformats the whole file — caught and reverted an early 318-line reformat). The enumeration surfaces were completed by a scoped markdown sub-agent and verified. Work landed in four 0-leak pathspec commits so the heavy concurrent activity on the shared branch (162 staged advisor-011 specs) was never swept in.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| New commands match the 9-sibling thin-router house style (un-numbered) | Alignment > incidentally passing validate_document.py, which no command router satisfies (repo-wide convention gap) |
| Domain-adapt each new command's verified flag + path-resolution block | The generic `create_agent_verified`/`runtime_agent_path_resolution` is agent-command boilerplate; command/flowchart already domain-adapted, benchmark was corrected to match |
| Rename advisor ids atomically + prove test-neutral | Avoids shipping a stale advisor that recommends dead command ids; the concurrent gated track's scorer code was clean |
| Leave historical specs + v1.5.0.0 changelog | Time-stamped records; renaming would falsify history. The rename belongs in a new changelog entry (follow-up) |
| Level 2 (not the plan's Level 1) | 30+ files across command-defs + registry + 15 surfaces + a gated advisor track warrant a checklist |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Command coverage | Pass | `mode-registry.json` has zero `"command": null`; 10 commands resolve to a 4-file set |
| Path resolution | Pass | All 31 resource paths in the 3 new auto.yamls resolve (`test -e`, missing=0) |
| Live-surface sweep | Pass | 0 stale old ids on live surfaces; only `changelog/v1.5.0.0.md` retains them (by design) |
| Advisor test-neutrality | Pass | native-scorer 22/22; the 4 pre-existing failures (1 corrupt-SQLite, 3 gated 193-row re-baseline ratchet) identical before/after — 0 new failures |
| YAML/JSON validity | Pass | All 6 new yamls parse; `skill_advisor.py` `py_compile` OK; registry JSON valid |
| Enumeration surfaces | Pass | 5 surfaces each list 10 commands; counts read "ten"/"10"; mirrors in sync (hook OK) |
| Holistic verification | Pass | Fresh-agent 7-check audit; caught 2 missed live surfaces (`prompt.md` example table + a half-renamed advisor key `command-create-folder-readme`), fixed in `98e1d73d53`; re-swept to 0 |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **validate_document.py command-type gap** — all 10 command routers fail the validator's `command`-type rule (it requires `purpose`/`instructions` sections; the thin-router house style uses `Routing Assets`/`Execution Order`). Pre-existing and repo-wide; the 3 new routers were made to match the 9 siblings. Follow-up: reconcile the rule or renumber all 10 (out of scope — touches 7 unrelated siblings).
2. **Pending advisor 193-row re-baseline** — the gated scorer-saturation re-baseline must be regenerated against the new command ids when that operator-locked track resumes. Flagged, not done here.
3. **No changelog entry** — a new `sk-doc/changelog` version documenting the rename is a reasonable follow-up, deferred to stay in approved scope.

<!-- /ANCHOR:limitations -->
