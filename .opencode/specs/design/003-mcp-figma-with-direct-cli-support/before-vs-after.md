# What Changed in 146: Figma Desktop Terminal Control

> Spec 146 shipped a research-grounded `mcp-figma` skill that drives Figma Desktop from the terminal through `figma-ds-cli`, with safe defaults, gated mutation and an optional Code Mode MCP path.

---

## THE UNIFYING PRINCIPLE

This packet made the CLI the primary surface and treated everything else as support. The reason is simple. Figma Desktop is the live thing an agent needs to drive, and the silships figma-cli can drive that session from the terminal. The Figma MCP can pull design context into codegen, but it is opt-in and community-owned.

The second rule was safety by naming. The package is not npm `figma-cli`. It is the silships figma-cli, published as `figma-ds-cli`, and the full surface comes from the repo build because npm publishes only a minimal `1.0.0`. The skill makes that trap visible before install, then separates safe reads from mutating commands and destructive commands before an agent acts.

That rule shaped every section below.

---

## 1. RESEARCH BEFORE BUILD

**Before**

The packet started with four open questions. What can the silships figma-cli actually do, what does the Figma MCP landscape offer, what shape should an `mcp-figma` skill take and how should installation avoid the npm traps. No skill or app surface changed in phase 001.

**After**

Phase 001 produced `research/research.md`, backed by five `gpt-5.5-fast` iterations and an orchestrator ground-truth pass. The recommendation converged on a CLI-first skill, modeled on the sibling terminal-control skills, with an optional Code Mode MCP path for design context. It also recorded both npm traps as warnings: do not install npm `figma-cli`, and do not treat npm `figma-ds-cli@1.0.0` as the full command surface.

**Impact**

The build phase started from checked facts rather than from package-name guesswork. The shipped skill did not have to discover the dangerous parts while installing or patching a live Figma Desktop app.

**Why research first**

A terminal-control skill can mutate a local design tool and the user's filesystem. That is not the right place for guesswork. The research made the package identity, the version gap and the CLI versus MCP split explicit before any runtime contract was written.

---

## 2. TERMINAL CONTROL AS A SKILL

**Before**

The framework had sibling terminal-control skills such as `mcp-open-design` and `mcp-chrome-devtools`, but no Figma-specific skill. An agent did not have a house-conformant way to install, connect to, read from, author in or export from Figma Desktop through the terminal.

**After**

Phase 002 added `.opencode/skills/mcp-figma/`. `SKILL.md` carries the runtime contract for install, connect, read, author and export. The skill includes references for the figma-cli surface, command tiers, optional MCP wiring and troubleshooting, plus a README, INSTALL_GUIDE, feature catalog, manual testing playbook, initial changelog and graph metadata.

**Impact**

Figma Desktop now has the same terminal-control shape as the sibling skills. An agent can find the install path, the safe connection path, the command model and the export guidance without mixing it with unrelated Figma APIs or the wrong npm package.

**Why the sibling shape**

The sibling skills already encode how this repository presents local desktop tool control. Reusing that shape keeps the Figma skill predictable for agents and operators, while the Figma-specific references carry the details that differ.

---

## 3. INSTALLATION AND SAFETY

**Before**

The biggest operational hazard was a package-name trap. npm `figma-cli` is unrelated, while the real silships tool publishes as `figma-ds-cli`. The second hazard was the npm version gap. The public `figma-ds-cli@1.0.0` publish is minimal and lacks the safe connect, daemon and extract surface.

**After**

The skill installs the full repo build and live verification installed `figma-ds-cli` 1.2.0 from that build. `install.sh` selects the repo build, and `--source auto` upgrades a stale npm install. `connect-safe.sh` is the default because it uses the FigCli plugin and does not patch the app. `connect-yolo.sh` is gated because it patches Figma's app bundle, and `unpatch.sh` provides the rollback.

**Impact**

The default path is safe, and the risky path is named, gated and reversible. The skill does not leave an agent to infer whether an install is complete or whether a patch can be undone.

**Why safety is explicit**

Driving a desktop app from a terminal crosses a different boundary than reading a web API. The skill names that boundary by making safe connect the default, yolo connect a confirmed action and rollback a shipped script rather than an afterthought.

---

## 4. COMMAND TIERS AND MUTATION BOUNDARIES

**Before**

Without a skill, the command surface had no local policy in this framework. Read commands, design-authoring commands and arbitrary execution commands could be treated as one bucket, even though they carry different risks.

**After**

`references/tool_surface.md` classifies the figma-cli commands as read-only, mutating or destructive. Read-only commands surface freely. Mutating commands require explicit confirmation. Destructive commands stay off the default path. `eval`, `raw` and `run` are treated as arbitrary mutation, and local exports require explicit no-overwrite paths.

**Impact**

The skill gives an agent a usable command surface without giving it a blank check. It can inspect a live Figma Desktop session by default, but it must cross a deliberate gate before changing designs, exporting over files or invoking arbitrary command execution.

**Why tiers matter**

The same CLI can read, write and run flexible commands. A useful skill has to expose the power without flattening the risk. The tier model makes that distinction visible at the moment of use.

---

## 5. OPTIONAL MCP AND GRAPH REGISTRATION

**Before**

The Figma MCP path existed as a separate landscape question. It was not clear whether the skill should depend on MCP, treat MCP as the main surface or ignore it. The new skill also did not yet exist in the skill graph.

**After**

The skill keeps the MCP path optional through this project's Code Mode `figma` manual. That manual exposes `get_figma_data` and `download_figma_images` for pulling design context into codegen. The CLI remains primary. The skill also ships schema-2 graph metadata and reciprocal sibling edges, so it appears beside the terminal-control siblings.

**Impact**

Agents get both paths without confusing their roles. The CLI controls the live desktop session. The MCP supplies optional design data. Skill graph registration makes the new capability discoverable in the same family as the other terminal-control skills.

**Why optional MCP**

The MCP is community Framelink, not first-party Figma, and it serves a different job than the CLI. Keeping it optional avoids making a community integration a hard dependency for desktop control.

---

## CURRENT STATE

Spec 146 is complete across both phases. Phase 001 shipped the research record and captured the package-name and version traps. Phase 002 shipped `.opencode/skills/mcp-figma/` with `SKILL.md`, references, eight scripts, a feature catalog, manual testing playbook, README, INSTALL_GUIDE, initial changelog and graph metadata.

The work is validated. Phase 001 completed five findings-producing iterations, converged on the recommendation, recorded both npm traps, passed orchestrator ground-truth checks and passed `validate.sh --strict` with 15 tasks complete. Phase 002 passed `package_skill.py --check`, command policy coverage, sibling structure parity, graph registration, live install of `figma-ds-cli` 1.2.0 from the repo build, Code Mode discovery for `get_figma_data` and `download_figma_images`, voice sweep and `validate.sh --strict` with 0 errors. The current caveats are intentional: the full CLI surface needs the repo build, yolo connect patches Figma's app bundle but is gated and reversible, and the MCP path is community-owned and opt-in.
