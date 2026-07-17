---
title: "Decision Record: design-mcp-open-design path targets (032 phase 007)"
description: "Phase decision record for the design-mcp-open-design filesystem map, including the valid target for the private _common.sh helper and the preserved shell-source contract."
trigger_phrases:
  - "design-mcp-open-design naming decision"
  - "common.sh helper target"
  - "032 phase 007 decision record"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/007-design-mcp-open-design"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/002-sk-design/007-design-mcp-open-design"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded shell helper path decision"
    next_safe_action: "Execute phase on pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-mcp-open-design/scripts/_common.sh"
      - ".opencode/skills/sk-design/design-mcp-open-design/scripts/doctor.sh"
      - ".opencode/skills/sk-design/design-mcp-open-design/scripts/install.sh"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: design-mcp-open-design Path Targets

<!-- ANCHOR:context -->
## Context

The transport packet contains `scripts/_common.sh`, and both `doctor.sh` and `install.sh` source it. A mechanical underscore-to-hyphen conversion would produce `-common.sh`, a leading-hyphen filename that is awkward and unsafe as a shell path. The program requires kebab-case for in-scope filesystem names while preserving tool-mandated names, Python surfaces, and shell behavior.

The phase therefore needs a semantic target for this private helper and a reference update that keeps the source and shellcheck contracts intact.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Use common.sh as the semantic target for _common.sh

Rename `scripts/_common.sh` to `scripts/common.sh`; update the `doctor.sh` and `install.sh` source lines and shellcheck directives to the new path. Keep the helper body, executable mode, source order, and public script names unchanged.

The rejected alternative is `-common.sh`: it follows character substitution but creates a leading-hyphen path and does not improve the transport contract. Keeping `_common.sh` would violate the program's in-scope filesystem rule because it is a shell helper, not a Python or tool-mandated name.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The helper has a valid lowercase filesystem name and all shell consumers remain explicit.
- The private-marker convention is represented by the directory role and source relationship rather than an invalid leading-hyphen filename.
- The phase must verify source resolution, shell syntax, shellcheck path comments, mode bits, and absence of stale `_common.sh` references.
- No shell logic or Open Design transport behavior changes; rollback is a git revert of the phase-scoped rename/reference commit.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- `.opencode/skills/sk-design/design-mcp-open-design/scripts/_common.sh` (current helper)
- `.opencode/skills/sk-design/design-mcp-open-design/scripts/doctor.sh` and `install.sh` (current consumers)
- `001-convention-policy-and-scope/decision-record.md` (semantic-map and exemption decisions)
<!-- /ANCHOR:references -->

