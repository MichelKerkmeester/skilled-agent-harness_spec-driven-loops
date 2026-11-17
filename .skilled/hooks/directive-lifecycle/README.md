---
title: "Directive Lifecycle Hooks: Boundary-Gated Directive Delivery"
description: "Tracks per-session delivery of the advisor directive block across prompt and lifecycle hooks."
trigger_phrases:
  - "directive lifecycle boundary"
  - "directive dedup"
  - "directives every message"
  - "claude directive lifecycle boundary"
  - "directive lifecycle bridge"
  - "speckit directive boundary"
importance_tier: "important"
contextType: "reference"
---

# Directive Lifecycle Hooks: Boundary-Gated Directive Delivery

---

## 1. OVERVIEW

The directive lifecycle records whether a session has received the constant directive block from the Skill Advisor. The block follows the `\nDirectives:` separator in the advisor context.

On an eligible prompt, the shared decision core sends the full context unless its record proves the same directive block was already delivered and the transcript bytes have not moved backwards. In that case, it sends the advisor text before the separator. A successful boundary advances the session epoch or the store generation. The next prompt then treats the old record as stale and sends the full context again.

This folder indexes the concern. Its `claude/` subfolder holds two symlinks to source files. Runtime hooks register adapters elsewhere in the repository.

---

## 2. HOW IT WORKS

The shared decision core checks the advisor context and the session record.

| Condition | Result |
|---|---|
| Deduplication is off, the separator is missing or the session or transcript data is not usable | Send the full context |
| The record is missing, the directive block changed, the transcript path changed or the transcript moved backwards | Send the full context and try to update the record. A failed write leaves full delivery in place on later prompts |
| The directive block is unchanged, the transcript path matches and transcript bytes have not moved backwards | Send only the advisor text before the directive block |

The file-backed store tracks up to 64 sessions and evicts older entries. A boundary with a session id advances that session's epoch. A boundary without an id advances the store generation, which invalidates older records.

The shared prompt-submit adapters use the decision core. OpenCode keeps its lifecycle state in the plugin. Pi uses an in-memory repeat check. DSH applies a local receipt after the shared handler. Vibe uses the shared handler with a separate file-backed receipt for the advisor text before the directive block.

---

## 3. RUNTIME COVERAGE

| Runtime | Event | Entry | Source file | Behavior |
|---|---|---|---|---|
| Claude | `UserPromptSubmit` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js` | `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` | Shared decision core |
| Codex | `UserPromptSubmit` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js` | `.skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts` | Shared decision core |
| Cursor | `beforeSubmitPrompt` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/user-prompt-submit.js` | `.skilled/skills/system-spec-kit/runtime/hooks/cursor/user-prompt-submit.ts` | Adapter is registered. Its source marks event delivery as unconfirmed. |
| Devin | `UserPromptSubmit` | `.skilled/skills/system-spec-kit/runtime/dist/hooks/devin/user-prompt-submit.js` | `.skilled/skills/system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts` | Shared decision core |
| OpenCode | `experimental.chat.system.transform` | `.opencode/plugins/system-skill-advisor.js` | `.opencode/plugins/system-skill-advisor.js` | Plugin lifecycle state |
| Pi | `input` | `.pi/extensions/prompt-advisor.ts` | `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | In-memory repeat check |
| DSH | `agent/pre-step` | `.dsh/plugins/repo-guards/adapters/prompt-advisor.mjs` | `.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs` | Shared handler with a local receipt |
| Vibe | `pre_agent` | `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` | Shared handler with a file-backed receipt |

Claude registers its hooks in `.claude/settings.json`. Codex uses `.codex/hooks.json`. Cursor uses `.cursor/hooks.json`. Devin uses `.devin/hooks.v1.json`. OpenCode loads plugins through the `.opencode/plugins/` glob. Pi uses the `.pi/extensions/prompt-advisor.ts` extension entry. DSH loads the guard bundle from `.dsh/patches/guards.patch.yml`. Vibe registers turn-start hooks in `.vibe/hooks.toml`.

---

## 4. DIRECTORY TREE

```text
directive-lifecycle/
+-- README.md
`-- claude/
    +-- directive-lifecycle-boundary.ts -> ../../../skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts
    `-- speckit-directive-lifecycle-boundary.ts -> ../../../skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts
```

---

## 5. KEY FILES

| File | Purpose |
|---|---|
| `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts` | Decision core and in-memory store |
| `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-contract.ts` | Shared constants and types |
| `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts` | File-backed store |
| `.skilled/skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts` | Canonical boundary adapter |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts` | Spec-Kit bridge to the compiled adapter |
| `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Pi prompt handling |
| `.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs` | DSH prompt handling |
| `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` | Vibe prompt handling |
| `.opencode/plugins/system-skill-advisor.js` | OpenCode prompt and lifecycle handling |

The `claude/` entries in this folder are relative symlinks to the two boundary adapters above.

---

## 6. CONFIGURATION

| Setting | Effect |
|---|---|
| `SYSTEM_DIRECTIVE_LIFECYCLE_DISABLED=1` | Disables boundary updates through the shared boundary bridge and the DSH local receipt. It does not replace the prompt deduplication setting. OpenCode, Vibe and Pi advance or reset their lifecycle state on their own paths, which this setting does not reach. |
| `SYSTEM_HOOKS_DISABLED=1` | Disables hooks through the shared hook resolver. |
| `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` | Turns off shared prompt-submit deduplication. |
| `SPECKIT_PI_DIRECTIVE_DEDUP=0` | Turns off Pi's in-memory repeat check. |
| `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR=<path>` | Sets the state directory used by the directive store and Vibe receipt. |
| `SPECKIT_DIRECTIVE_LIFECYCLE_BOUNDARY_TARGET=<path>` | Sets the bridge target. The bridge accepts an absolute path to a regular file. |

The `SYSTEM_*` settings use the shared hook resolver. That resolver reads `.skilled/hooks/hook-flags.env`. Process environment values override those settings. The `SPECKIT_*` settings are read from the process environment by their adapters.

---

## 7. VALIDATION

The advisor runtime package includes tests for the directive decision and boundary behavior. The Spec-Kit runtime includes a test for the boundary bridge.

- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/directive-lifecycle.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/directive-lifecycle-boundary.vitest.ts`
- `.skilled/skills/system-spec-kit/runtime/tests/directive-lifecycle-boundary-bridge.vitest.ts`

This read-only smoke check uses an in-memory store. It prints the first decision and an unchanged repeat.

```bash
SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=1 node --input-type=module -e '
import * as lifecycle from "./.skilled/skills/system-skill-advisor/runtime/dist/hooks/lib/directive-lifecycle.js"
const state = new lifecycle.InMemoryDirectiveLifecycleStore()
const input = {
  state,
  sessionId: "smoke",
  sessionConfirmed: true,
  transcriptPath: "smoke-transcript.jsonl",
  transcriptBytes: 1,
  enabled: lifecycle.isDirectiveLifecycleDedupEnabled()
}
const first = lifecycle.decideDirectiveLifecycleDelivery("Advisor: smoke\nDirectives: keep", input)
const repeat = lifecycle.decideDirectiveLifecycleDelivery("Advisor: smoke\nDirectives: keep", { ...input, transcriptBytes: 2 })
console.log("first=" + (first.suppressed ? "suppressed" : "full") + " repeat=" + (repeat.suppressed ? "suppressed" : "full"))
'
```

Expected output: `first=full repeat=suppressed`.

---

## 8. RELATED

- [Hooks overview](../README.md): hook folders and runtime coverage.
- [Advisor hook contract](../../skills/system-skill-advisor/hooks/skill-advisor-hook.md): the advisor behavior that adds the directive block.
- [Shared hook flags](../shared/README.md): the shared resolver for `SYSTEM_*` settings.

