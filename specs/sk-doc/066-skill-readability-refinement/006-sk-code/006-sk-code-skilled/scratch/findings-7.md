### .skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md:16 | 3 | The intro is a pure pointer sentence ("This document describes …"), not a hook, and its "introduced" framing is a change event the overview never states; the durable claims it makes (a repeatable verifier for recurring drift checks) are already carried by Purpose and When to Use. | Replace line 16 with: `When a repeatable drift check fires, this tells you whether it was meant to block the build and where a new check attaches so the guard set stays one system.`
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/alignment-verification-automation.md:54 | 7 | One paragraph packs four mechanisms: the lightweight scope, the `--check-router` exception, the RESOURCE_MAP equality delegation, and the manual-gate lead-in, so the exception and the delegation are easy to miss. | Replace lines 54-61 with:
  ```markdown
  The verifier is intentionally lightweight. It does not replace the standards
  checklists and, by default, does not scan markdown.

  - The opt-in `--check-router` flag adds one narrow exception: it checks that
    every RESOURCE_MAP/DEFAULT_RESOURCE leaf a skill's router names exists on
    disk (a dead-route guard, scoped to the router block only). It still never
    inspects markdown prose.
  - RESOURCE_MAP parent-child *equality* is not checked by this script either;
    leg 2 of `verify-router-sync.cjs` checks it, as the section "Router-sync
    guard" below records.

  These remain manual review gates:
  ```

### .skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/directory-and-test-conventions.md
- clean

### .skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/imports-and-exports.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/imports-and-exports.md:221 | 1 | The body ends on a bare `---` that separates nothing, left behind by a section that is no longer there, so the page closes on a stray horizontal rule. | Delete line 221 (the trailing `---`); the file should end after the Python exports code block.

### .skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/overview-and-module-organization.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/code-organization/overview-and-module-organization.md:210 | 1 | The body ends on a bare `---` with a trailing blank line and no section after it, leaving the page closing on a stray horizontal rule. | Delete line 210 (the trailing `---`) and the blank line after it; the file should end after "Implementation details hidden".

### .skilled/skills/sk-code/sk-code-skilled/references/shared/hooks.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/hooks.md:164 | 7 | Two paragraphs under "MCP Config And The Split-Shape Caveat" pack five mechanisms together (symlink, schema compatibility, the excluded `opencode.json`, the field-split requirement, the tested evidence), so a reader cannot scan for the rule that must be implemented. | Replace lines 164-166 with:
  ```markdown
  - `.cursor/mcp.json` is a symlink to the repo's own `.mcp.json`.
  - Cursor's documented MCP schema is byte-compatible with Claude's (`mcpServers` / `command` string / `args` array / `env` object), so one file serves both.
  - `opencode.json` cannot participate — its schema differs (`mcp` key, `command` as an array, `environment` rather than `env`).
  - Cursor's MCP hook payloads split the server and tool across **two** fields — `mcp_server_name: "sequential_thinking"` alongside a BARE `tool_name: "sequentialthinking"` — where Claude packs both into one `mcp__<server>__<tool>` string.
  - The shared `mcp-route-guard` core parses only the packed forms, so a Cursor adapter MUST recombine the two fields before forwarding; passing the bare tool name through matches nothing and the guard silently never advises.
  - Confirmed by testing the core directly: `mcp__figma__get_screenshot` and `figma_get_screenshot` both advise, bare `get_screenshot` does not.
  - `afterMCPExecution` also fires (adding `result_json` + `duration`) but has no Claude-side counterpart to proxy to, so nothing is wired for it.
  ```
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/hooks.md:170 | 7 | The "Discovery Mirror" paragraph is a single ~120-word run that packs six mechanisms (the symlink set, the real-path commands, the entrypoint-guard comparison, the `.mjs` exception, the consistency choice, the README pointer), so the one fact a reader needs — the symlinks produce no output — is buried mid-sentence. | Replace lines 170 with:
  ```markdown
  - `.cursor/hooks/` holds a symlink to every file `.cursor/hooks.json` invokes, purely so the scripts are visible at Cursor's own documented conventional path (`.cursor/hooks/<script>`).
  - `.cursor/hooks.json`'s `command` fields still point at the real paths above, not these symlinks.
  - Invoking `session-start.js`/`session-end.js`/`user-prompt-submit.js`/`precompact.js` through the symlink produces **zero output** (confirmed by direct testing): each compiles from a `.ts` source ending in `runCursorHook(import.meta.url, main)`, whose entrypoint guard compares `process.argv[1]` (stays the symlink path) against the ESM-loader-resolved `import.meta.url` (resolves through the symlink to the real path) — they never match, so `main()` never runs.
  - The plain `.mjs` files have no such guard and work through either path, but every `command` entry stays pointed at the real path for consistency.
  - See `.cursor/hooks/README.md` for the full explanation.
  ```
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/hooks.md:216 | 10 | "(see §7)" is a section-number pointer to the section it already sits in, while the intended target is the "Cross-Runtime Parity" table at the end of §7, so the pointer gives the reader nothing to follow. | Replace `(see §7)` with `(see "Cross-Runtime Parity" below)`.

### .skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/naming-and-commenting.md:305 | 6 | The KISS/DRY/SOLID "Design Principles Gate" is filed under §4 REFERENCE COMMENT PATTERNS although it governs general implementation, not comment prefixes, so a reader looking for the gate under its own topic will not find it and a reader inside §4 gets unrelated rules after the reference-comment contract. | Cut lines 305-313 (the `### Design Principles Gate (KISS/DRY/SOLID)` block through "Keep rule constants centralized …") and paste it after the `---` at line 315, promoting the H3 to `## 5. DESIGN PRINCIPLES GATE (KISS/DRY/SOLID)`; the divider then separates §4 from §5, §4 keeps its number and line 265 is untouched, and the file no longer ends on a dangling divider.

### .skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/organization-security-and-examples.md
- [P1] .skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/organization-security-and-examples.md:277 | 10 | "see §4" resolves to this file's own §4 — the section the sentence sits in — not to the canonical "No ephemeral-artifact pointers" rule in `code-style-guide.md` §4, so the reader is sent to the page they are already reading. | Replace `see §4` with ``see [`../../../../sk-code-quality/references/code-style-guide.md`](../../../../sk-code-quality/references/code-style-guide.md) §4``.
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/universal-patterns/organization-security-and-examples.md:317 | 6 | Five normative cross-language determinism contracts sit inside §5 RELATED RESOURCES, so a reader who skips the link section never sees rules the code is bound by, and the section title misdescribes its own contents. | Move lines 317-327 (the `### Cross-Language Determinism Contracts` block) to immediately before `## 5. RELATED RESOURCES`, promote the heading to `## 5. CROSS-LANGUAGE DETERMINISM CONTRACTS`, and renumber `## 5. RELATED RESOURCES` to `## 6. RELATED RESOURCES`. No inbound reference cites §5 of this file.

### .skilled/skills/sk-code/sk-code-skilled/references/shared/workflow-guardrails.md
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/workflow-guardrails.md:20 | 4 | §1 OVERVIEW is a single unlabelled paragraph: it has no `### Purpose` and no `### When to Use`, the two subsections the reference template requires and every other file in this set carries, so a reader cannot tell from the overview when to load the file. | Replace the body of `## 1. OVERVIEW` (line 22) with:
  ```markdown
  ### Purpose

  The shared [implementation](../workflow-implement.md) and [verification](../workflow-verify.md) workflows apply on every surface. This file adds what holds only for OpenCode system code under `.skilled/`: the implementation guardrails, the verification command chain and the runtime build traps.

  ### When to Use

  - Implementing or verifying a change to OpenCode system code under `.skilled/`
  - Deciding whether a source edit needs a `dist/` rebuild before its behavior is verified
  - Handing missing build output, stale generated runtime files or a wrong package boundary back to implementation
  ```
- [P2] .skilled/skills/sk-code/sk-code-skilled/references/shared/workflow-guardrails.md:44 | 7 | One paragraph packs four separate rules — the root/project-reference `tsc --build` command, the satellite `tsc -p` command, the `--noEmit --composite false` overlay, and the Vitest-backed test script — into prose, so the command for a given package is hard to extract. | Replace line 44 with:
  ```markdown
  Use the package script for the package you changed:

  - **Spec-kit root and project-reference workspaces**: `tsc --build`.
  - **Satellite packages with their own package boundary**: `tsc -p tsconfig.build.json`. A satellite typecheck script may add `--noEmit --composite false` over that same overlay.
  - **TypeScript tests**: run the package's Vitest-backed script where present, such as `npm test`, `npm run test:core`, or the targeted `vitest run ...` command exposed by that package.
  ```
