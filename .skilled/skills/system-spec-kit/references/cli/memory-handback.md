---
title: Memory Handback Protocol for cli-* Skills
description: Canonical 7-step Memory Handback procedure shared across the seven cli-* sibling skills. Covers MEMORY_HANDBACK extraction, structured-JSON normalization, generate-context.js dispatch modes, and the post-010 save gates.
trigger_phrases:
  - "memory handback protocol"
  - "memory handback extraction"
  - "handback save gates"
  - "structured json handback"
importance_tier: normal
contextType: implementation
version: 1.6.0.15
---

# Memory Handback Protocol (cli-* family)

When a calling AI delegates to one of the seven cli-* skills and needs to preserve the resulting session context, the agent runs the same 7-step procedure below. Four prompt templates include both `<!-- MEMORY_HANDBACK_START -->` and `<!-- MEMORY_HANDBACK_END -->`: cli-claude-code, cli-codex, cli-devin, and cli-opencode. The other three do not. Section 4 maps each packet reference to its actual template section and marker status.

---

## 1. OVERVIEW

Canonical 7-step Memory Handback procedure shared across the seven cli-* sibling skills. Covers MEMORY_HANDBACK extraction, structured-JSON normalization, generate-context.js dispatch modes, and the post-010 save gates.

---

## 2. PROCEDURE (7 STEPS)

1. **Include epilogue**: Use the template section listed for the selected packet in §4 when it exists. `cli-hermes` has no handback section, so compose its epilogue from this procedure.
2. **Extract section**: Extract `MEMORY_HANDBACK` with the paired HTML-comment markers when the selected template includes them. If it does not, follow Caveats §3 and build the payload by hand.
3. **Convert to structured JSON**: Build the JSON-primary payload that `generate-context.js` documents. Use `specFolder`, `user_prompts`, `observations`, and `recent_context` as the canonical field names in new examples. Add `FILES`, `sessionSummary`, `keyDecisions`, `nextSteps`, `triggerPhrases`, `toolCalls`, `exchanges`, `preflight`, and `postflight` when the delegated run produced that evidence.
4. **Redact and scrub**: Remove secrets, tokens, credentials, and any unnecessary sensitive values before writing the JSON file or sending the payload to the save script.
5. **Choose a structured-input mode**: Save the scrubbed payload to `/tmp/save-context-data-<session-id>.json`, pipe it with `--stdin`, or pass it inline with `--json`.
6. **Invoke generate-context.js**: Use one of:
   - `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js /tmp/save-context-data-<session-id>.json [spec-folder]`
   - `printf '%s' "$JSON_PAYLOAD" | node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js --stdin [spec-folder]`
   - `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js --json "$JSON_PAYLOAD" [spec-folder]`
7. **Stop there**: The save is complete when `generate-context.js` returns. There is no indexing hand-off and no daemon to notify.

---

## 3. CAVEATS

**Delimiter missing**: If agent output lacks `MEMORY_HANDBACK` delimiters, the calling AI manually constructs the structured JSON payload and saves it through the same JSON-primary path. The save flow normalizes `nextSteps` or `next_steps`; the first entry persists as `Next: ...` and drives `NEXT_ACTION`, and remaining entries persist as `Follow-up: ...`.

**Structured JSON only**: Direct spec-folder-only invocation is no longer supported. Always call `generate-context.js` with `--stdin`, `--json`, or a JSON temp file.

**No session scoping to negotiate**: Retrieval in a dispatched cli sub-session is a file read — the trigger index lookup or a ripgrep recipe from `../retrieval/retrieval-conventions.md`. There is no session identity to establish, no server to reject the call, and nothing to carry between calls. The only state a handback creates is the packet's own continuity surfaces.

**Explicit target precedence**: If you pass `[spec-folder]` on the CLI, that explicit target wins over any `specFolder` value inside the payload.

**Explicit JSON mode failures**: If the explicit data file cannot be loaded, `generate-context.js` fails with `EXPLICIT_DATA_FILE_LOAD_FAILED: ...`. Do not fall back to OpenCode capture in that case; surface the error and stop.

**Post-010 save gates**: Valid JSON can still be rejected after normalization. File-backed handbacks skip the stateless alignment and `QUALITY_GATE_ABORT` checks, but they still fail with `INSUFFICIENT_CONTEXT_ABORT` when the payload is too thin and with `CONTAMINATION_GATE_ABORT` when it includes content from another spec.

**Compatibility aliases**: The normalizer still accepts documented camelCase and snake_case pairs such as `sessionSummary` / `session_summary`, `nextSteps` / `next_steps`, `userPrompts` / `user_prompts`, and `recentContext` / `recent_context`. Prefer the canonical field names shown above in new handback payloads.

**Minimum payload guidance**: Include a specific `sessionSummary`, at least one meaningful `recent_context` entry or equivalent observation, and rich `FILES` entries with a descriptive `DESCRIPTION`. Add `ACTION`, `MODIFICATION_MAGNITUDE`, and `_provenance` when known so the saved memory carries durable evidence instead of bare filenames.

---

## 4. PER-SKILL TEMPLATE MAP

The `SKILL.md` citation and the actual template heading do not always match. The table gives both for all seven packets.

| Packet | `SKILL.md` handback reference | `assets/prompt-templates.md` section | Marker pair |
|---|---|---|---|
| `cli-claude-code` | §11 | §13 MEMORY EPILOGUE | Both |
| `cli-codex` | §13 | §13 MEMORY EPILOGUE | Both |
| `cli-cursor` | File link only; no section number | §8 MEMORY EPILOGUE (HANDBACK) | Neither |
| `cli-devin` | §13 | §12 MEMORY EPILOGUE | Both |
| `cli-hermes` | No Memory Handback Protocol | No handback section | Neither |
| `cli-opencode` | §14 | §14 TEMPLATE 13: MEMORY EPILOGUE (REUSABLE TAIL) | Both |
| `cli-pi` | No Memory Handback Protocol; general file link only | §10 STRUCTURED HANDBACK | Neither |
