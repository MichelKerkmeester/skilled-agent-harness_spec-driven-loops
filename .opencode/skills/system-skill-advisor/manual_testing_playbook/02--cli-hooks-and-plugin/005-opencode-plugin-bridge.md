---
title: "CL-005 OpenCode Plugin Bridge"
description: "Manual validation for the OpenCode mk-skill-advisor plugin and bridge."
trigger_phrases:
  - "cl-005"
  - "opencode plugin bridge"
  - "opencode plugin"
  - "opencode"
---

# CL-005 OpenCode Plugin Bridge

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate the OpenCode plugin path that delegates through the stable native compat entrypoint, then falls back to Python brief production when needed.

---

## 2. SCENARIO CONTRACT

- MCP server build is current.
- Plugin host file exists at `.opencode/plugins/mk-skill-advisor.js`.
- Bridge helper exists at `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`.

---

## 3. TEST EXECUTION

1. Build:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp_server run build
```

2. Run bridge directly:

```bash
printf '%s' '{"prompt":"save this conversation context to memory","workspaceRoot":"'"$PWD"'","runtime":"opencode","maxTokens":80,"thresholdConfidence":0.8}' | node .opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs
```

3. Inspect plugin status tool in OpenCode, when available:

```text
spec_kit_skill_advisor_status({})
```

### Expected Signals

- Bridge returns JSON with `status: "ok"` or prompt-safe fail-open status.
- Native success has `metadata.route: "native"` and an `Advisor:` brief.
- Success metadata reports the 014 threshold pair: `confidenceThreshold: 0.8`, `uncertaintyThreshold: 0.35`, `confidenceOnly: false`.
- Bridge imports `.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/compat/index.js`, not private handler paths.
- Disable flag returns a disabled brief or skipped state without invoking the native path.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Private dist pinning | Bridge imports handler internals directly | Update bridge to use `compat/index.ts` after code approval. |
| Plugin disabled unexpectedly | Status tool reports `disabled_reason` | Check env and plugin options. |
| Bridge timeout | `error: "TIMEOUT"` | Inspect build and Node binary path. |

---

## 4. SOURCE FILES

- `.opencode/plugins/mk-skill-advisor.js`
- `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs`
- `.opencode/skills/system-skill-advisor/mcp_server/compat/index.ts`

---

## 5. SOURCE METADATA

- Group: CLI Hooks And Plugin
- Playbook ID: CL-005
- Canonical root source: manual_testing_playbook.md
- Feature file path: 02--cli-hooks-and-plugin/005-opencode-plugin-bridge.md
