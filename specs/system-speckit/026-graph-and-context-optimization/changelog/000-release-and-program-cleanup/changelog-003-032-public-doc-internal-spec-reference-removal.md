---
title: "Cleanup Pass 032: Public Doc Internal Spec Reference Removal"
description: "Hardcoded internal spec packet paths were removed from public-facing docs and command assets. Replaced with stable local contract wording, generic placeholders or direct references to shipped files."
trigger_phrases:
  - "public doc internal spec reference removal"
  - "internal spec path cleanup"
  - "spec packet path leak fix"
  - "command asset provenance cleanup"
  - "032 doc cleanup"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/032-public-doc-internal-spec-reference-removal` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

Public-facing docs, command assets, setup guides, skill references, feature catalogs and manual testing playbooks contained direct links to this repository's internal spec packet folders. External users cannot resolve those paths, so the references produced dead links and exposed development history in place of stable user-facing contracts.

A scoped `rg` pass identified every concrete `.opencode/specs/...`, `specs/system-spec-kit/...` and `skilled-agent-orchestration/...` reference across public markdown, YAML and JSON surfaces. Each reference was replaced with portable wording: local command contract language, stable shipped-file references or generic user-provided placeholders. One accidental runtime script-path edit was discovered during the diff review and restored. Generic Spec Kit placeholders such as `<spec-folder>` were preserved where they represent a user-selected command argument.

### Added

- None.

### Changed

- `README.md` public overview prose: internal packet links and packet-history wording replaced with portable descriptions.
- `.opencode/commands/**` YAML and markdown assets: upstream `packet` fields pointing at internal spec folders replaced with local command contract wording.
- `.opencode/install_guides/SET-UP - Code Graph.md`: internal code-graph spec and research packet links removed.
- `.opencode/plugins/README.md`: packet-history references replaced with portable public wording.
- `.opencode/skills/**` docs, assets, feature catalogs and playbooks: concrete internal provenance paths replaced with stable local design notes or generic placeholders.

### Fixed

- Accidental edit to a non-doc runtime script during the broad replacement pass. The change was caught in diff review and restored before final verification.

### Verification

| Check | Result |
|-------|--------|
| Concrete internal path search across public docs | PASS. No matches outside test fixtures and runtime test data. |
| Command/install/README packet-history search | PASS. No `packet NNN` nor `Packet NNN` matches in `README.md`, `.opencode/commands` nor `.opencode/install_guides`. |
| Diff review and accidental-edit restoration | PASS. Non-doc package script path restored. Remaining diffs are documentation, assets, catalogs and playbooks. |
| Strict spec validation (`validate.sh --strict`) | PASS. Exit 0, zero errors, zero warnings. |

### Files Changed

| File | What changed |
|------|--------------|
| `README.md` | Internal packet links and packet-history prose removed from public overview. |
| `.opencode/commands/**` | Upstream packet references replaced with local command contract wording and generic placeholders. |
| `.opencode/install_guides/SET-UP - Code Graph.md` | Internal code-graph spec and research packet links removed. |
| `.opencode/plugins/README.md` | Packet-history references removed from public plugin docs. |
| `.opencode/skills/**` docs, assets, catalogs and playbooks | Concrete internal provenance replaced with portable wording. |

### Follow-Ups

- Some internal historical notes in skill docs still use generic "packet" language. No private spec folder links remain in those notes. A future pass could normalize the language if needed.
- Test fixtures intentionally retain internal-looking paths. These are parser fixtures and runtime validation data, not public docs. They are out of scope for this cleanup.
