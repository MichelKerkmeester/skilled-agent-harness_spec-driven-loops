---
title: "Acceptance Criteria: Retire the sk-vision MCP transport and give Cursor and Devin native hook adapters"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "sk-vision MCP retirement acceptance criteria"
  - "sk-vision hook adapter closure gate"
importance_tier: "important"
contextType: "implementation"
---
# Acceptance Criteria: Retire the sk-vision MCP transport and give Cursor and Devin native hook adapters

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-vision/001-sk-vision-fork-of-opencode-senses/024-mcp-retirement-and-hook-adapters
**Level:** 3
**Status:** Complete
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the MCP server, its test, its bin entry, its script and the SDK dependency are removed, When the package gate runs, Then typecheck and tests pass at or above the recorded baseline | `bun test` 27 pass / 0 fail, `bunx tsc --noEmit` exit 0, both read from the final state | Met | - |
| AC-002 | REQ-002 | Given the deletion is complete, When the residue sweep runs over the live tree, Then the retired names return no hits outside `specs/` | `rg` over the live tree returns only the deliberate historical mention in `hooks/README.md` and unrelated benchmark records | Met | - |
| AC-003 | REQ-003 | Given sk-vision no longer owns Devin's MCP config, When `.devin/mcp_config.json` is parsed, Then `code_mode` is still registered | JSON parse of the final Devin-owned file confirms `code_mode` present, `sk-vision` absent | Met | - |
| AC-004 | REQ-004 | Given a live Cursor session with no native vision, When the model follows the always-apply rule, Then it runs the CLI and reports real OCR | Live `cursor-agent` run: the model named the exact CLI command from the rule and returned OCR recovering `CODE 7741`. Needs `--force` headless, because Cursor auto-review blocks the shell call otherwise | Met | ADR-005 |
| AC-005 | REQ-005 | Given a live Devin session, When a prompt names an image path, Then the evidence block reaches the model through `UserPromptSubmit` | Live `devin -p` run with GLM-5.2: the model answered YES to carrying a `SK-VISION EVIDENCE` block and pasted its OCR line verbatim without running any tool | Met | - |
| AC-006 | REQ-006 | Given a malformed payload, an absent image path or a disabled kill-switch, When either adapter runs, Then it emits a plain allow, spawns no runtime and blocks no turn | 8 adapter tests green, covering both kill-switches and zero stderr | Met | - |
| AC-007 | REQ-007 | Given an adapter call completes or throws, When the process settles, Then the vision runtime has been torn down | Process check after a real end-to-end call found no orphan runtime | Met | - |
| AC-008 | REQ-008 | Given the documentation pass is complete, When the skill docs, catalog and playbook are read, Then no surviving claim says Cursor or Devin attach over MCP | Catalog validator PASS 0 violations, playbook validator PASS 25 scenarios 0 violations, `validate_document.py --type skill` VALID 0 issues | Met | - |
| AC-009 | REQ-009 | Given the dead system-skill MCP registrations, When the live files are read, Then none names a decommissioned server | Devin allowlist and README done. The agent-definition half is waived to the agents track: `.opencode` is canonical and removing the tool from the Claude mirror alone fails the mirror-sync commit gate | Waived | ADR-006 |
| AC-010 | REQ-010 | Given the hook injects evidence unconditionally, When the two `vision-rule.md` files are reviewed, Then each is deleted as redundant or rewritten for the hook path | Both rewritten: Cursor's carries the CLI instruction the live rule test proved the model follows, Devin's documents the two cases the hook cannot cover | Met | - |
| AC-011 | - | Given the final state, When the packet gate runs under `--strict`, Then it prints `RESULT: PASSED` | Re-run from the final state | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes. Ten criteria are met with observed evidence, including both live host runs, and one is waived against ADR-006.

AC-009 is waived rather than met, and the reasoning is ADR-006: the criterion reached past this packet into the agents track, where the canonical source still requires the retired tool through review-methodology prose. The half that is genuinely sk-vision's neighbour, the Devin allowlist and the README orphan, is done.

Two operator notes from the live runs. Cursor's headless mode needs `--force`, since auto-review rejects the shell call otherwise. And the default `moondream2` reads synthetic text poorly; the benchmark configuration uses `SK_VISION_MODEL=moondream3-preview`.
<!-- /ANCHOR:closure -->
