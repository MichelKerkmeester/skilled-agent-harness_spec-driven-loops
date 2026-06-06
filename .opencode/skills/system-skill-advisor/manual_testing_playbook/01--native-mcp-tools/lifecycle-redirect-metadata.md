---
title: "NC-005 Lifecycle Redirect Metadata"
description: "Manual validation that superseded, archived, future and rolled-back lifecycle metadata surfaces through advisor_recommend."
trigger_phrases:
  - "nc-005"
  - "lifecycle redirect metadata"
  - "lifecycle redirect"
  - "lifecycle"
---

# NC-005 Lifecycle Redirect Metadata

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

Validate lifecycle redirect metadata for non-active skill states.

---

## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- Native lifecycle tests and fixtures are present.
- Do not edit live skill folders for this scenario.

---

## 3. TEST EXECUTION

1. Run lifecycle tests:

```bash
cd .opencode/skills/system-skill-advisor/mcp_server && npm exec -- vitest run tests/lifecycle-derived-metadata.vitest.ts tests/compat/plugin-bridge.vitest.ts --reporter=default
```

2. If a runtime fixture is available, call:

```text
advisor_recommend({"prompt":"route a superseded lifecycle fixture","options":{"topK":3}})
```

3. Inspect recommendation metadata.

### Expected Signals

- Superseded entries include `redirectFrom` or `redirectTo` as applicable.
- Archived and future entries include `status: "archived"` or `status: "future"`.
- Rolled-back entries are sanitized and do not expose stale private paths.
- OpenCode plugin bridge preserves lifecycle metadata in prompt-safe brief metadata.

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Redirect fields absent | Test failure or missing fields in MCP output | Inspect lifecycle projection and renderer. |
| Invalid lifecycle status appears | Status outside `active`, `deprecated`, `archived`, `future` | Inspect schema validation. |
| Prompt-injection text appears in labels | Unsafe label survives sanitizer | Block release. Verify `sanitizeSkillLabel` at write boundaries. |

---

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/lib/lifecycle/`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts`

---

## 5. SOURCE METADATA

- Group: Native MCP Tools
- Playbook ID: NC-005
- Canonical root source: manual_testing_playbook.md
- Feature file path: 01--native-mcp-tools/lifecycle-redirect-metadata.md
