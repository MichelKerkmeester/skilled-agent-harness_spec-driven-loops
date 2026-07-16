---
title: "Decision Record: cli-opencode component naming (032 phase 005.002)"
description: "Design decisions for the cli-opencode rename: use an explicit local reference/asset map, rewrite path-valued schema consumers without changing data keys, and keep playbook/scripts/history ownership separate."
trigger_phrases:
  - "cli-opencode naming decision record"
  - "OpenCode path key boundary"
  - "cli-external phase 002 decisions"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/002-cli-opencode"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/002-cli-opencode"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded cli-opencode path decisions"
    next_safe_action: "Apply the local source-target map"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/assets/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The four permissions-matrix assets are filesystem candidates while their JSON keys remain data contracts."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: cli-opencode component naming

<!-- ANCHOR:context -->
## Context

The cli-opencode component has eight snake_case reference filenames and six snake_case asset filenames. `SKILL.md`, README tables, prompt assets, and permissions-matrix JSON path values refer to them. The same files also contain JSON keys, schema properties, dispatch identifiers, and external paths that are not filesystem names.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Use an explicit local source-to-target map

Map each of the eight reference files and six asset files individually to a kebab-case target. A blanket underscore replacement is rejected because it cannot distinguish filenames from keys, identifiers, external paths, or the delegated playbook tree.

### DR-002 — Rewrite path-valued schema and consumer references, not data contracts

Update Markdown links, `SKILL.md`/README path entries, schema `$id`/glob/path values, and other references only when they point at a mapped local file. Preserve JSON keys, schema properties, permissions meanings, dispatch vocabulary, and code identifiers verbatim.

### DR-003 — Keep playbook, scripts, and frozen history outside this map

The nested `manual_testing_playbook/` tree belongs to phase 005. Existing hyphenated JavaScript under `scripts/` is protected by inventory, and changelog history is frozen under the 032 program boundary.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The verifier needs both a filesystem map and a path-vs-key inventory before any rename.
- A permissions JSON file can change its path while its internal contract remains byte-for-byte equivalent except for required path values.
- References into sibling skills remain with their owning phases unless they target a file renamed here.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Program naming rules and exemptions: `.opencode/specs/sk-doc/032-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md`.
- Live component contract: `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md` and `README.md`.
- Component phase map: `../spec.md` and the phase 005 playbook ownership row.
<!-- /ANCHOR:references -->

