---
title: "Decision Record: loose command ID boundary (017 phase 008/013/008)"
description: "Design decisions for distinguishing root command filesystem basenames from public slash-command IDs and tool-owned paths."
trigger_phrases:
  - "loose command ID decision"
  - "root command filename boundary"
  - "command ID preservation decision"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/013-commands/008-loose-command-ids"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/013-commands/008-loose-command-ids"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded loose command boundary"
    next_safe_action: "Resolve loader evidence for root commands"
    blockers: []
    key_files:
      - ".opencode/commands/agent_router.md"
      - ".opencode/commands/goal_opencode.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Loose command ID boundary

<!-- ANCHOR:context -->
## Context

The root command surface has two snake_case filenames that appear in README inventories, installation guidance, and goal-plugin tests. The same spellings may also represent public slash-command IDs. The naming program changes filesystem names but explicitly preserves command IDs and tool-mandated names, so the phase needs a contract boundary before any move.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Track filename, public ID, and tool path separately

The frozen map records the physical basename, the public command ID, and each tool/plugin path contract as separate values. A matching string is not treated as evidence that the values share the same migration rule.

### DR-002 — Rename only with loader-preserved ID evidence

`agent_router.md` and `goal_opencode.md` may move to kebab-case only when the active loader or an existing compatibility contract proves the exact public IDs remain addressable. If the loader derives the ID from the filename, the filename is tool-mandated for this program and remains exact; the rollup records that exemption rather than changing the command.

### DR-003 — Rewrite physical paths, never semantic IDs

An approved physical move updates path consumers, plugin-test file opens, and inventories that describe the filesystem. It does not rewrite `/agent_router`, `/goal_opencode`, `mk_goal`, `mk_goal_status`, frontmatter fields, or other semantic/tool names.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The phase can produce either a verified rename or a verified tool-mandated exemption without conflating the two.
- Contract evidence becomes a blocking prerequisite and the test matrix must cover both discovery and exact command invocation.
- README and plugin-test path consumers may change only when the physical move is approved; public documentation of the IDs remains stable.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- `../../../001-convention-policy-and-scope/decision-record.md` defines the canonical filesystem form and tool-mandated exemption.
- `.opencode/commands/README.txt` lists the loose command files and public forms.
- `.opencode/plugins/tests/mk-goal-tool-path.test.cjs` and `mk-goal-capabilities.test.cjs` exercise the goal command path.
- The active command-loader contract and its tests are authoritative for final disposition.
<!-- /ANCHOR:references -->
