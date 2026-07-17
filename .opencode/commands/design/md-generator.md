---
description: Style Reference DESIGN.md extraction: live CSS and measured tokens. sk-design md-generator mode.
argument-hint: "<live-url> --output <dir> [--register brand|product] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

# /design:md-generator

Thin router for the sk-design `md-generator` mode. This command resolves the execution mode, loads the presentation contract, then applies the `md-generator` mode to `$ARGUMENTS`.

## 1. ROUTER CONTRACT

This command serves the user job: "extract website css", "generate design reference", "capture design tokens".

Pin the `md-generator` mode of the `sk-design` parent hub to extract a live site's real CSS into a Style Reference DESIGN.md. The hub owns routing across modes; this command loads the `md-generator` mode directly. If the request spans more than `md-generator`, defer to the hub's routing instead of forcing this mode.

Do not embed workflow steps or presentation content in this file. Workflow steps live in the owned YAML assets; visible prompts, dashboards, and result templates live in the presentation asset.

<!-- ANCHOR:sibling-discriminator -->
### WHEN TO USE THIS, NOT A SIBLING

- **Use this command when** the request is to extract a live site's real measured CSS into DESIGN.md.
- **Prefer `/design:audit` when** the request is to review or score an existing design rather than extract its measured CSS.
- **Prefer `/design:foundations` when** the request is to author a static token or visual system from judgment rather than measurement.
- **Prefer `/design:interface` when** the request is to invent a new design direction instead of capturing what already exists.
- **Prefer `/design:motion` when** the request is to design animation, transitions, or micro-interaction behavior.
- **Prefer the `sk-design` skill's `design-mcp-open-design` transport mode when** the request is to wire, read, or drive Open Design's MCP server rather than extract measured CSS from a live website. This is a nested mode reached through `sk-design`, not an independently dispatchable `/design:*` command.
- **Defer to the `sk-design` hub when** the request spans more than measured CSS extraction, such as redesign, critique, or new visual-system invention.
<!-- /ANCHOR:sibling-discriminator -->

### PRECONDITIONS

- **Requires:** a reachable live URL plus a writable output directory.
- **Cannot-run:** when the URL is missing or unreachable, or the output directory cannot be resolved or written, stop with `STATUS=FAIL ERROR=<named-cause>`.
- **Escalate:** if the site requires authentication or blocks headless extraction so the CSS cannot be captured, return `STATUS=DEFER ROUTE=hub` rather than forcing the mode.
- **Route instead:** when the request spans redesign, critique, or new visual-system invention rather than measured extraction, return `STATUS=DEFER ROUTE=hub`.

**Ask-first:** wording lives only in the presentation asset's Consolidated Prompt Template.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/design/assets/design_md-generator_presentation.txt` |
| Auto workflow | `.opencode/commands/design/assets/design_md-generator_auto.yaml` |
| Confirm workflow | `.opencode/commands/design/assets/design_md-generator_confirm.yaml` |

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for `:auto` or `:confirm`.
2. If no suffix is present, check whether `$ARGUMENTS` already supplies the required input (a live URL and an output directory). If complete, proceed autonomously; if incomplete, fall back to the `:confirm` consolidated prompt.
3. For explicit `:auto`, resolve setup through the presentation contract's Auto Resolution Table; if the URL or output directory still cannot be resolved, use the Auto Fail-Fast Display.
4. For explicit `:confirm`, always show the consolidated setup prompt once, even when `$ARGUMENTS` is fully specified.
5. Load the selected workflow asset and execute it step by step. `VALIDATE` and `REPORT` may also be invoked standalone against an existing `tokens.json` + `DESIGN.md` pair; both workflow assets support this without repeating extraction.

<!-- ANCHOR:register -->
### REGISTER

- **Pin with** `--register <brand|product>` at command entry. Default `auto` resolves the posture from a declared register field, then the task cue, then the surface in focus.
- **Postures:** Brand (design IS the product) records the captured surface as identity-led. Product (design SERVES the product) records it as task-led.
- **This command's dials:** `register`.

Register Ask-first question wording lives only in the presentation asset.
<!-- /ANCHOR:register -->

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|----------|
| `:auto`, or no suffix with complete `$ARGUMENTS` | `.opencode/commands/design/assets/design_md-generator_auto.yaml` |
| `:confirm`, or no suffix with incomplete `$ARGUMENTS` | `.opencode/commands/design/assets/design_md-generator_confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/design/assets/design_md-generator_presentation.txt`:

- Consolidated setup prompt wording (live URL, output directory, register, execution-mode question).
- Auto Resolution Table and Auto Fail-Fast Display.
- STATUS result templates (`OK`/`ASK`/`FAIL`/`DEFER`).
- Next-step suggestions and handoff-grammar wording.
- Example usage.

---

## 6. WORKFLOW SUMMARY

Loads the `sk-design` hub and the `md-generator` mode packet, runs the EXTRACT -> WRITE -> VALIDATE pipeline (REPORT optional) against `$ARGUMENTS`, and returns a STATUS line naming the produced Style Reference DESIGN.md. This is the only `sk-design` mode with Write/Edit/Bash authority; the embedded TypeScript backend under `backend/scripts/` remains the sole mutating entrypoint. Never auto-chains to a sibling command; next steps are recommend-only.
