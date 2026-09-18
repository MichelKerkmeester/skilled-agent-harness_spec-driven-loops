# Iteration 007: Install-guide retirement

**Executor.** gpt-5.6-luna, reasoning max, service tier fast, read-only sandbox.

## RETIRE-001 Chrome installer help still names the deleted installer

- **Severity:** P1
- **File:** `.skilled/skills/mcp-tooling/mcp-chrome-devtools/scripts/install.sh:9`
- **Trigger:** Run `--help` and copy any displayed `./install-chrome-devtools.sh` command.
- **Consequence:** The command no longer exists. The surviving installer is `scripts/install.sh`.
- **Evidence:** Lines 9 and 72–78 use the deleted name. `scripts/README.md:20,31` documents `install.sh`. The old central symlink was deleted in the diff.
- **Fix:** Replace the four stale names with `install.sh`, or derive the displayed name from `$0`.

## RETIRE-002 Retired install-guide authoring remains advertised in the packet changelog

- **Severity:** P2
- **File:** `.skilled/skills/sk-doc/sk-create-readme/changelog/v1.1.0.0.md:18`
- **Trigger:** Read the packet’s latest changelog when selecting an authoring mode.
- **Consequence:** It still advertises three output shapes, including install guides, and the prior changelog names missing template and reference files. The active `SKILL.md:38,46-51` now supports README authoring only.
- **Evidence:** The referenced `references/install_guide_creation.md` and install-guide template are absent from the current packet.
- **Fix:** Mark install-guide authoring as retired in current-facing documentation and stop presenting the three-shape capability as active.

## RETIRE-003 Installer utility logic is duplicated without a drift guard

- **Severity:** P2
- **File:** `.skilled/skills/mcp-code-mode/scripts/_utils.sh:3`
- **Trigger:** A maintainer changes one local `_utils.sh` copy.
- **Consequence:** The Code Mode and Chrome DevTools installers can silently acquire different behavior.
- **Evidence:** Both installers source local copies at lines 31 and 25. The copies are currently byte-identical at 871 lines and 23,644 bytes, but no synchronization or equality check exists.
- **Fix:** Use one canonical helper, or add a CI `cmp -s` check for the two copies.

## RETIRE-004 Three surviving install guides fail the surviving validator

- **Severity:** P1
- **File:** `.skilled/skills/mcp-tooling/mcp-mobbin/INSTALL-GUIDE.md:82`; `.skilled/skills/mcp-tooling/mcp-refero/INSTALL-GUIDE.md:77`; `.skilled/skills/sk-design/sk-design-md-generator/INSTALL-GUIDE.md:7`
- **Trigger:** Validate all `INSTALL-GUIDE.md` files with `validate_document.py --type install_guide`.
- **Consequence:** 3 of 11 guides exit nonzero. Mobbin and Refero lack `installation` and `verification`. The design guide lacks `overview`, `installation` and `verification`.
- **Evidence:** `template-rules.json:262-269` requires those four sections. Direct validation returned exit 1 for all three files. Their base-to-tip diffs only rewrite root paths, so this is a retained validation failure.
- **Fix:** Add or rename the required H2 sections, or add explicit validator aliases only where the alternate headings are intentional.
