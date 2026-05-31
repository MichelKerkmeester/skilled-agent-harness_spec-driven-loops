---
title: "Evergreen Doc Packet ID Removal"
description: "Added a canonical sk-doc rule that prevents evergreen docs from citing mutable packet IDs. Audited recently touched runtime docs and rewrote high-confidence packet-history references with current behavior anchors."
trigger_phrases:
  - "evergreen doc packet id rule"
  - "sk-doc evergreen rule"
  - "no packet ids in docs"
  - "packet id audit fixes"
  - "evergreen doc cleanup 013"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/013-evergreen-doc-packet-id-removal` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

Evergreen runtime docs across sk-doc, system-spec-kit, cli-opencode were carrying mutable packet and phase number references. Those references rot when packet folders are renumbered, archived, consolidated, even though the runtime behavior they describe stays current. There was no rule telling authors to avoid them.

A canonical rule file was created under `sk-doc/references/global/` defining the difference between spec-local docs (where packet IDs are appropriate) and evergreen docs (where they are not). The rule was wired into the sk-doc doc-quality loading path so future authors encounter it at authoring time. README, install guide, feature catalog, manual testing playbook templates were updated with explicit reminders. High-confidence packet-history references in system-spec-kit, code-graph catalog/playbook files, Skill Advisor docs, cli-opencode examples were then rewritten to current behavior and source-file anchors. An audit findings record distinguishes true fixes, stable-ID false positives, legacy generated surfaces deferred for a follow-up cleanup.

### Added

- `references/global/evergreen_packet_id_rule.md` in sk-doc with rule definition, examples, grep self-check, migration guidance
- Author instructions in README, install guide, feature catalog, manual testing playbook templates that forbid mutable packet IDs in evergreen prose

### Changed

- `sk-doc/SKILL.md` doc-quality section now routes authors to the evergreen rule on every invocation
- system-spec-kit runtime markdown files updated to remove high-confidence packet-history references
- cli-opencode reference markdown files updated to replace example packet IDs with approved spec-folder wording

### Fixed

- Packet-history prose in system-spec-kit runtime docs replaced with current behavior descriptions and source-file anchors
- cli-opencode examples that cited specific packet numbers now use canonical spec-folder path examples

### Verification

| Check | Result |
|-------|--------|
| Audit grep | PASS with documented exceptions in `audit-findings.md` |
| Strict validator | PASS after packet docs were created |
| Scope review | PASS, docs and metadata only. No code files changed. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/sk-doc/references/global/evergreen_packet_id_rule.md` (NEW) | Created | Canonical rule defining spec-local vs evergreen docs, examples, grep self-check |
| `.opencode/skills/sk-doc/SKILL.md` | Modified | Doc-quality section routes to the evergreen rule |
| `.opencode/skills/sk-doc/assets/documentation/*.md` | Modified | Template reminders added for README, install guide, feature catalog, manual playbook |
| `.opencode/skills/system-spec-kit/**/*.md` | Modified | Surgical removal of high-confidence packet-history references |
| `.opencode/skills/cli-opencode/**/*.md` | Modified | Example packet IDs replaced with approved spec-folder wording |
| `013-evergreen-doc-packet-id-removal/audit-findings.md` (NEW) | Created | Audit outcomes: PASS, VIOLATION_FIXED, VIOLATION_DEFERRED rows with rationale |

### Follow-Ups

- Sweep older evergreen docs in generated feature catalog and playbook surfaces that still contain historical phase or packet labels. The audit documents these as deferred because broad generated-corpus rewrites need their own dedicated cleanup pass.
