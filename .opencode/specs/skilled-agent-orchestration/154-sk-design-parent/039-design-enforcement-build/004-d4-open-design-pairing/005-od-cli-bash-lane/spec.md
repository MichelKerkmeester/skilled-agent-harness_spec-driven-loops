---
title: "D4-R5 — odCliPreconditions parser-backed Bash lane + gate-file carrier"
description: "Tokenize Bash to bind daemon-cli.mjs/$OD_BIN plus the write verb in the same segment and require a same-command gate file."
trigger_phrases:
  - "d4-r5 od cli bash lane"
  - "bash lane gate file design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D4-R5 — odCliPreconditions parser-backed Bash lane + gate-file carrier

## 1. OBJECTIVE
Add an `odCliPreconditions` Bash lane that tokenizes the command, binds the `daemon-cli.mjs`/`$OD_BIN` invocation to its write verb (run start/redesign, ui respond/prefill/revoke, media generate) within the same segment, and requires a same-command gate file carrying the proof token.

## 2. WHY
Open Design is also driven via Bash CLI, which bypasses MCP/HTTP gates entirely. A parser-backed lane is needed so a CLI write verb cannot fire without a co-located, same-command gate file.

## 3. TARGET & CLASS
- **Target file(s):** Codex Bash precondition lane (`pre-tool-use.ts` Bash branch) gating Open Design app daemon `cli-*.mjs:6247`
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D4 — mcp-open-design Pairing

## 4. BUILD OUTLINE
- Tokenize the Bash command string and identify `daemon-cli.mjs` / `$OD_BIN` invocations.
- Bind the binary to its write verb in the same segment; classify run/ui/media write verbs as guarded.
- Require a same-command gate file carrying a valid token; deny when absent or cross-command.

## 5. ACCEPTANCE
- An `od`/`daemon-cli.mjs` write-verb command without a same-command gate file is DENIED; a read-only verb passes — verified against tokenized command strings.

## 6. EVIDENCE
- Open Design app daemon `cli-*.mjs:6247` — the daemon CLI write-verb surface the Bash lane must bind and gate.
- Source: `research/research.md` §7 (D4-R5)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
