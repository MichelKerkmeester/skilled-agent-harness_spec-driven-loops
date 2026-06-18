# What Changed in 148: MCP Skill Install And Doctor Standardization

> The five `mcp-*` skills now present one install and diagnostic contract, with `/doctor:mcp` wired to recognize their CLI checks.

---

## THE UNIFYING PRINCIPLE

This packet makes the `mcp-*` skills predictable at the reader's first contact point. A user should not need to learn a different install story for `mcp-figma`, `mcp-open-design`, `mcp-chrome-devtools`, `mcp-click-up` and the adjacent design workflow. Each skill should say how to install, how to verify and how to diagnose without mutating the user's machine during a doctor run.

The same rule governed the central command surface. A local skill script can know the CLI details, but `/doctor:mcp` needs a shared class so those diagnostics fit into the router without special casing each skill. Documentation and graph links then make the design tools discover each other instead of relying on tribal memory.

That rule shaped every section below.

---

## 1. INSTALL AND DOCTOR STANDARDIZATION

**Before**

The five `mcp-*` skills did not present a uniform install and diagnostic surface. Some skills had richer guidance than others, and the missing pieces made the install line feel skill-specific instead of framework-standard. Users had to infer which script was safe to run, which command was only a check and which skill owned each desktop or browser integration.

**After**

Each skill now follows the same reader-facing shape. The packet added or aligned `INSTALL_GUIDE.md` coverage, verify-only `install.sh` behavior where needed and read-only `doctor.sh` diagnostics. `mcp-open-design` gained `scripts/{_common.sh,install.sh,doctor.sh}` and a full `INSTALL_GUIDE.md`. `mcp-chrome-devtools/scripts/doctor.sh` and `mcp-click-up/scripts/doctor.sh` now provide the corresponding read-only checks for `bdg` and `cupt`.

**Impact**

A user can move between the `mcp-*` skills and trust the same verbs. Install scripts verify instead of performing surprise mutation, doctor scripts diagnose instead of repairing and install guides explain the operational path before a command is run.

**Why standardize the scripts**

The scripts are the executable edge of the documentation. If they differ in safety posture, the guide cannot fix that mismatch with prose. Standardizing the scripts first gives the docs a real contract to describe.

---

## 2. MCP-FIGMA 1.0.0.0 PROMOTION

**Before**

`mcp-figma` had the strongest implementation surface, but its release notes and versioned docs did not yet present it as the first stable release. The skill also needed its references and manual testing playbook aligned with the version users would see.

**After**

`mcp-figma` is promoted to `1.0.0.0` across `SKILL.md`, `INSTALL_GUIDE.md`, `references/figma_cli_reference.md` and `manual_testing_playbook/manual_testing_playbook.md`. Its changelog at `mcp-figma/changelog/v1.0.0.0.md` was rewritten as the `1.0.0.0` first-stable-release notes. The packet also created the embedded install scaffold and optional-MCP pointer content under `mcp-figma/mcp-servers/{figma-cli,figma-mcp}/`.

**Impact**

The Figma skill now reads as a stable, packaged skill instead of a working integration with uneven release framing. The install guide, CLI reference, playbook and changelog point at the same release identity.

**Why promote it here**

The packet standardizes the install and doctor line for `mcp-*` skills. `mcp-figma` is one of the main design MCP entries, so its version and package story needed to match the new standard rather than remain a partial precursor.

---

## 3. OPEN DESIGN INSTALL SURFACE

**Before**

`mcp-open-design` did not have the same install guide, script scaffold and MCP pointer shape as the other standardized skills. It also needed clearer local pointers for the bundled `od` CLI and its MCP server.

**After**

`mcp-open-design/INSTALL_GUIDE.md` now matches the shared standard. `mcp-open-design/scripts/_common.sh`, `mcp-open-design/scripts/install.sh` and `mcp-open-design/scripts/doctor.sh` provide the verify-only and read-only script path for the bundled `od` CLI. `mcp-open-design/mcp-servers/open-design/README.md` now points readers at the bundled CLI and MCP server.

**Impact**

Open Design no longer sits beside the other design MCP skills as a special case. A reader can install, verify and diagnose it through the same document and script pattern used by the rest of the standardized set.

**Why Open Design needed its own section**

The open-design work created the largest new skill-local surface in the packet. It added the guide, scripts and pointer doc that turn a capability into an installable, diagnosable skill.

---

## 4. DESIGN-SKILL CROSS-REFERENCES AND GRAPH LINKS

**Before**

The three design-facing skills were related in practice, but their docs and graph metadata did not fully advertise that relationship. A user could discover `mcp-figma`, `mcp-open-design` or `sk-interface-design` without seeing the adjacent tool that should inform the next step.

**After**

`mcp-open-design/README.md` and `mcp-open-design/SKILL.md` now cross-reference `mcp-figma`. `sk-interface-design/README.md`, `sk-interface-design/SKILL.md` and `sk-interface-design/graph-metadata.json` now cross-reference and graph-link `mcp-figma`. The result connects the design judgment skill with the Figma and Open Design transport skills in both prose and structured metadata.

**Impact**

The design skill family is easier to navigate. A user doing interface work can see when to use the design judgment layer and when to use a transport skill for Figma or Open Design. The skill graph now carries the relationship instead of leaving it only in markdown.

**Why docs and graph metadata both changed**

Markdown helps a human reader at the point of use. Graph metadata helps the advisor and traversal surfaces route between related skills. The relationship needed both forms because discovery happens through both channels.

---

## 5. CENTRAL DOCTOR MCP WIRING

**Before**

The central `/doctor:mcp` surface knew how to reason about MCP server checks, but it did not have a shared diagnostic class for CLI-backed skill checks. Adding each skill as a one-off would have made the router harder to extend and easier to misread.

**After**

`commands/doctor/assets/doctor_mcp_install.yaml` now includes the additive `cli_skill_diagnostics:` class. `commands/doctor/mcp.md` documents that CLI-skill diagnostic class. The consumer check confirmed the shared YAML loop iterates `servers:` only, so adding `cli_skill_diagnostics:` does not change the existing server loop.

**Impact**

The doctor command can now describe and route CLI-backed skill diagnostics without distorting the MCP server model. The new class is additive, so existing server checks keep their contract.

**Why add a class instead of folding it into servers**

CLI diagnostics and MCP server checks are related, but they are not the same object. Keeping `cli_skill_diagnostics:` separate preserves the meaning of `servers:` while still giving `/doctor:mcp` a first-class place for skill-local CLI checks.

---

## CURRENT STATE

Packet 148 is complete as a flat Level 2 spec folder. It produces one packet changelog and one parent-level before-and-after narrative, with no phase index and no invented child phases.

The implementation standardized the five `mcp-*` skills at the install and doctor line, promoted `mcp-figma` to `1.0.0.0`, added the missing `mcp-open-design` install and pointer surfaces, connected the design skills through docs and graph metadata and taught `/doctor:mcp` about the additive `cli_skill_diagnostics:` class. Verification is green: `bash -n` passed on all 5 new scripts, both `package_skill --check` runs passed, JSON and YAML checks passed, CLI fact fidelity passed, the house-voice and comment-hygiene sweep passed and `validate.sh --strict` passed for the packet.

The only remaining caveats are operational. The new scripts were syntax-checked and fact-checked but not run end to end against live desktop apps or a browser. `mcp-open-design/SKILL.md` carries a soft `package_skill` warning at 3003 of 3000 recommended words. Pre-existing em dashes remain in untouched files under scope lock.
