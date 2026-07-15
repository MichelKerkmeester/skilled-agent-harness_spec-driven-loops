---
title: "Changelog: Standardize the mcp-* skills into the install-guide and doctor system [148-mcp-skill-install-doctor-standardization/root]"
description: "Chronological changelog for the Standardize the mcp-* skills into the install-guide and doctor system spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/mcp-tooling/007-mcp-skill-install-doctor-standardization` (Level 2)

### Summary

The `mcp-*` skills now meet users at the same install and diagnostic line. Each skill ships an `INSTALL_GUIDE.md`, a verify-only `install.sh` where needed and a read-only `doctor.sh`, while `/doctor:mcp` recognizes the shared CLI diagnostic class. The packet also promotes `mcp-figma` to `1.0.0.0`, adds the missing `mcp-open-design` pointer doc and connects the design skills through both documentation and the skill graph.

### Added

- Created packet 153 at Level 2 to satisfy Gate 3.
- Added `cli_skill_diagnostics:` to the central doctor assets and documented the router note under `.opencode/commands/doctor/`.
- Added the `mcp-open-design` pointer doc at `mcp-servers/open-design`.
- Ran `bash -n` across all new scripts and made them executable.
- Completed `CHK-010`. Script syntax checks passed with `bash -n` on all 5 new scripts.
- Completed `CHK-042`. `README.md` and `INSTALL_GUIDE.md` files now include the cross-references plus the new open-design guide.

### Changed

- Scoped the install and doctor gap matrix across the five `mcp-*` skills.
- Ran provider preflight for the `gpt-5.5-fast` write seats with `opencode providers list`.
- Promoted `mcp-figma` to `1.0.0.0` across `SKILL.md`, `INSTALL_GUIDE.md`, references and the manual testing playbook under `.opencode/skills/mcp-figma/`.
- Rewrote the `mcp-figma` changelog as the `1.0.0.0` release at `.opencode/skills/mcp-figma/changelog/v1.0.0.0.md`.
- Authored `mcp-open-design/scripts/{_common.sh,install.sh,doctor.sh}` through the parallel `gpt-5.5` seat.
- Authored `mcp-open-design/INSTALL_GUIDE.md` to match the shared standard.

### Fixed

- Fact-checked generated scripts against host CLI facts for `bdg`, `cupt` and `od` paths, then fixed the click-up manual grep.
- Completed `CHK-FIX-001` as not applicable. This is a standardization packet with no bug-fix findings to classify.
- Completed `CHK-FIX-002` as not applicable. No behavior-change finding required a producer inventory.
- Completed `CHK-FIX-003`. The one shared surface was checked. The doctor YAML loop iterates `servers:` only, so `cli_skill_diagnostics:` is additive.
- Completed `CHK-FIX-004` as not applicable. This packet did not include a security, path, parser or redaction fix.
- Completed `CHK-FIX-005` as not applicable. This packet did not include a matrix-style fix.

### Verification

- `bash -n` on all 5 new scripts: PASS.
- `package_skill --check mcp-figma`: PASS.
- `package_skill --check mcp-open-design`: PASS, with 1 soft warning because `SKILL.md` is 3003 of 3000 recommended words.
- JSON validity for `mcp-figma` and `sk-design-interface` graph metadata: PASS.
- `doctor_mcp_install.yaml` YAML parse: PASS.
- CLI fact fidelity for `bdg`, `cupt`, the `od` daemon CLI path and socket: PASS, verified against real sources.
- House-voice and comment-hygiene sweep on authored content: PASS, with 0 em dashes and no artifact tokens in script comments.
- `validate.sh --strict` on the packet: PASS.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `mcp-figma/changelog/v1.0.0.0.md` | Modified | Rewritten as the `1.0.0.0` first-stable-release notes |
| `mcp-figma/{SKILL.md, INSTALL_GUIDE.md, references/figma_cli_reference.md, manual_testing_playbook/manual_testing_playbook.md}` | Modified | Version bumped to `1.0.0.0` |
| `mcp-figma/mcp-servers/{figma-cli, figma-mcp}/*` | Created (this session) | Embedded install scaffold plus optional-MCP pointer |
| `mcp-open-design/INSTALL_GUIDE.md` | Created | Install guide matching the shared standard |
| `mcp-open-design/scripts/{_common.sh, install.sh, doctor.sh}` | Created | Verify-only install and read-only doctor for the bundled `od` CLI |
| `mcp-open-design/mcp-servers/open-design/README.md` | Created | Pointer doc for the bundled CLI and MCP |
| `mcp-open-design/{README.md, SKILL.md}` | Modified | Cross-reference `mcp-figma` |
| `mcp-chrome-devtools/scripts/doctor.sh` | Created | Read-only diagnostic for the `bdg` CLI |
| `mcp-click-up/scripts/doctor.sh` | Created | Read-only diagnostic for the `cupt` CLI |
| `sk-design-interface/{README.md, SKILL.md, graph-metadata.json}` | Modified | Cross-reference and graph-link `mcp-figma` |
| `commands/doctor/assets/doctor_mcp_install.yaml` | Modified | Added the `cli_skill_diagnostics:` class |
| `commands/doctor/mcp.md` | Modified | Documented the CLI-skill diagnostic class |

### Follow-Ups

- Scoped commit remains after the green packet validation.
- All tasks are marked `[x]`.
- The new scripts were not executed against a live app. `bash -n` and host fact-checking confirm syntax and CLI facts, but `install.sh` and `doctor.sh` for open-design, chrome-devtools and click-up were not run end to end against a running desktop app or browser. They are read-only or verify-only by design.
- `mcp-open-design/SKILL.md` is 3 words over the recommended 3000. The cross-reference addition pushed it to 3003 words. This is a soft `package_skill` warning, not a failure.
- Pre-existing em dashes remain in untouched files. `mcp-click-up/scripts/install.sh` and two unrelated lines of `doctor_mcp_install.yaml` carry em dashes from earlier work. They were left under scope lock because this packet did not author those lines.
