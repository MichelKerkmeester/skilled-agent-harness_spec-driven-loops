---
title: "CP-003 Global Disable Flag"
description: "Manual validation that SPECKIT_SKILL_ADVISOR_HOOK_DISABLED disables all advisor prompt surfaces."
trigger_phrases:
  - "cp-003"
  - "global disable flag"
  - "global disable"
  - "global"
---

# CP-003 Global Disable Flag

<!-- sk-doc-template: manual_testing_playbook -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

Validate the common disable flag across native MCP, Python shim, runtime hooks and plugin bridge.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-scenario-contract -->
## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- MCP server build is current.
- Capture env and command output.

---

<!-- /ANCHOR:2-scenario-contract -->

<!-- ANCHOR:3-test-execution -->
## 3. TEST EXECUTION

1. Native MCP:

```text
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 advisor_recommend({"prompt":"help me commit my changes","options":{"topK":1,"includeAbstainReasons":true}})
```

2. Python shim:

```bash
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "help me commit my changes"
```

3. Plugin bridge:

```bash
printf '%s' '{"prompt":"help me commit my changes","workspaceRoot":"'"$PWD"'"}' | SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 node .opencode/plugins/spec-kit-skill-advisor-bridge.mjs
```

4. One hook adapter:

```bash
printf '%s' '{"prompt":"help me commit my changes","cwd":"'"$PWD"'"}' | SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1 node .opencode/skills/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js
```

### Expected Signals

- Native `advisor_recommend` returns `recommendations: []`, `freshness: "unavailable"` and `ADVISOR_DISABLED`.
- Python shim returns `[]` or prompt-safe disabled output without native scoring.
- Plugin bridge returns disabled/skipped output.
- Hook adapter returns `{}` with skipped diagnostic.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Any surface still recommends a skill | Non-empty recommendation under disabled env | Block release. |
| Disabled response includes prompt text | Search captured output for prompt literal | Block release. |
| Plugin only honors legacy env | New flag has no effect | Update bridge/plugin after code approval. |

---

<!-- /ANCHOR:3-test-execution -->

<!-- ANCHOR:4-source-files -->
## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`

---

<!-- /ANCHOR:4-source-files -->

<!-- ANCHOR:5-source-metadata -->
## 5. SOURCE METADATA

- Group: Compat And Disable
- Playbook ID: CP-003
- Canonical root source: manual_testing_playbook.md
- Feature file path: 03--compat-and-disable/003-global-disable-flag.md

<!-- /ANCHOR:5-source-metadata -->
