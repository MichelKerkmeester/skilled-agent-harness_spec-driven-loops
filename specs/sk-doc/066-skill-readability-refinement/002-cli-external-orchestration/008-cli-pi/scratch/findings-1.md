### .skilled/skills/cli-external-orchestration/cli-pi/README.md

- [P2] .skilled/skills/cli-external-orchestration/cli-pi/README.md:106 | 8 | The structure tree repeats each parent directory inside its children (`assets/assets/prompt-quality-card.md`, `references/references/cli-reference.md`), so every child it prints is a path that does not exist. | Drop the duplicated prefix on lines 106-107 and 112-118, leaving `prompt-quality-card.md`, `prompt-templates.md`, `agent-delegation.md`, `cli-reference.md`, `integration-patterns.md`, `mcp-and-third-party-packages.md`, `native-skills-and-extensions.md`, `pi-tools.md`, `providers-and-models.md`, with the comment columns unchanged.
- [P2] .skilled/skills/cli-external-orchestration/cli-pi/README.md:134 | 8 | The `File | Role` table indexes the packet root but omits `hard-rules.json`, the preflight rule file the dispatch reads; the sibling cli-* READMEs list theirs. | Add after line 134: `| hard-rules.json | Dispatch preflight hard rules (stdin redirect, availability, offline, provider-qualified model) |`

### .skilled/skills/cli-external-orchestration/cli-pi/ROUTER.md

- [P2] .skilled/skills/cli-external-orchestration/cli-pi/ROUTER.md:23 | 7 | One paragraph carries four mechanisms at once: the arrival triggers, both resource families, the ALWAYS level and the probe gate, so the routing shape cannot be scanned. | Split lines 23-27 into three blocks: keep the trigger sentence as the lead; replace the two-family clause with a two-item bullet list that keeps each family's file count and description ("seven `references/` packets that carry …", "two `assets/` scaffolds that carry …"); leave the ALWAYS/probe sentence as a standalone closing paragraph.
- [P2] .skilled/skills/cli-external-orchestration/cli-pi/ROUTER.md:70 | 8 | Two ON_DEMAND entries drop their `references/` prefix while the ALWAYS row keeps it, so the table prints paths that do not exist at the packet root. | Change the row's last column to `assets/prompt-templates.md, references/native-skills-and-extensions.md, references/mcp-and-third-party-packages.md`.

### .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md

- [P1] .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:124 | 5 | The rules that govern a dispatch (`</dev/null`, mandatory `--offline`, exit code is not an auth signal) sit after the Dispatch Lifecycle steps they govern, so a reader can run steps 1-6 without ever meeting them and hang on step 4. | Move lines 124-145 (the whole `### Dispatch-Critical Gotchas` block, through its trailing blank line) to before line 73 (`### Dispatch Lifecycle`).
- [P2] .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:49 | 1 | SMART ROUTING names what selects the packet and where the router is, but never what the packet loads first, one of the three statements the skill template requires of Section 2. | Insert after line 50: `It loads `references/cli-reference.md` and `assets/prompt-quality-card.md` first on every run, before any intent selection.`

### .skilled/skills/cli-external-orchestration/cli-pi/assets/prompt-quality-card.md

- clean

### .skilled/skills/cli-external-orchestration/cli-pi/assets/prompt-templates.md

- [P2] .skilled/skills/cli-external-orchestration/cli-pi/assets/prompt-templates.md:227 | 9 | `(phases 012/013)` is a phase number in body prose and tells a reader nothing durable about the confirmation it is attached to. | Delete only the parenthetical: `Native prompt-template and extension discovery are confirmed for the project-local surfaces this repo actually populates. Full precedence …`
- [P2] .skilled/skills/cli-external-orchestration/cli-pi/assets/prompt-templates.md:202 | 9 | The example payload embeds a packet spec path (`specs/cli-external-orchestration/z_archive/031-cli-pi-creation/003-cli-pi-skill-packet`), so a copied command points at this packet's own archive rather than the reader's folder. | Replace only the path inside the quoted prompt with `specs/[track]/[packet]`; keep the rest of the command and the `(pre-approved, skip Gate 3)` clause unchanged.

### .skilled/skills/cli-external-orchestration/cli-pi/references/agent-delegation.md

- [P2] .skilled/skills/cli-external-orchestration/cli-pi/references/agent-delegation.md:23 | 4 | OVERVIEW opens with Core Principle; Purpose and When to Use come after it, while the reference skeleton puts Purpose and When to Use first. | Move the `### Core Principle` heading and its paragraph (lines 23-25, with their blank lines) to the end of the section after the When to Use list (line 35), so the order is Purpose, When to Use, Core Principle.

### .skilled/skills/cli-external-orchestration/cli-pi/references/cli-reference.md

- [P2] .skilled/skills/cli-external-orchestration/cli-pi/references/cli-reference.md:22 | 4 | OVERVIEW has neither Purpose nor When to Use; it opens with a prose paragraph and the contract table, so the reader gets no orientation statement before the reference data. | Insert between lines 22 and 24: `### Purpose` / `Keeps confirmed Pi behavior, observed failure modes and the remaining open questions in one place, so a dispatch is composed from evidence rather than memory.` / `### When to Use` / `- Composing or checking a Pi command before dispatch` / `- Choosing between print, JSON and RPC output` / `- Diagnosing a provider, auth, extension or trust failure` / `### Runtime Facts` (the existing paragraph and contract table then sit under Runtime Facts).

### .skilled/skills/cli-external-orchestration/cli-pi/references/integration-patterns.md

- [P2] .skilled/skills/cli-external-orchestration/cli-pi/references/integration-patterns.md:17 | 3 | The intro is a pointer sentence ("This reference describes how…"), the exact pattern the rule excludes, so it never tells the reader when to open the file. | Replace line 17 with: `Open this file when a Pi dispatch needs to hold up after the process exits: the mode fits its consumer, one adapter owns the process, and the returned work carries evidence a reviewer can check.` The claim it drops (no second adapter) is already stated at lines 25 and 56.
- [P2] .skilled/skills/cli-external-orchestration/cli-pi/references/integration-patterns.md:23 | 4 | OVERVIEW opens with Core Principle; Purpose and When to Use come after it, while the reference skeleton puts Purpose and When to Use first. | Move the `### Core Principle` heading and its paragraph (lines 23-25, with their blank lines) to the end of the section after the When to Use list (line 35), so the order is Purpose, When to Use, Core Principle.
- [P2] .skilled/skills/cli-external-orchestration/cli-pi/references/integration-patterns.md:170 | 9 | `(phases 012/013)` is a phase number in body prose and adds no durable meaning to the confirmation claim. | Delete only the parenthetical: `Prompt templates are confirmed: `.pi/prompts/*.md` mirrors all 36 canonical commands, and argument substitution live-verified in a real session.`
- [P2] .skilled/skills/cli-external-orchestration/cli-pi/references/integration-patterns.md:310 | 9 | `(phase 007)` is a phase number in body prose; the claim it supports ("only stdio is confirmed live") stands without it. | Delete `(phase 007) ` so the line reads `# GOOD: only stdio is confirmed live -- see mcp-and-third-party-packages.md §5`.
- [P2] .skilled/skills/cli-external-orchestration/cli-pi/references/integration-patterns.md:310,331 | 9 | Both cross-references send the reader to §5 CONFIGURATION SCOPE, but the transport-confirmation table and the RPC-versus-MCP layer statement they cite are in §4 MCP TRANSPORT DECISION. | Change `§5` to `§4` in both lines; the target document and the claim each supports stay the same.
