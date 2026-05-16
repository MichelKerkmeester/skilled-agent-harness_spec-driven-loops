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

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

Validate lifecycle redirect metadata for non-active skill states.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-scenario-contract -->
## 2. SCENARIO CONTRACT

- Repo root is the working directory.
- Native lifecycle tests and fixtures are present.
- Do not edit live skill folders for this scenario.

---

<!-- /ANCHOR:2-scenario-contract -->

<!-- ANCHOR:3-test-execution -->
## 3. TEST EXECUTION

1. Run lifecycle tests:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp_server exec -- vitest run skill-advisor/tests/lifecycle-derived-metadata.vitest.ts skill-advisor/tests/compat/plugin-bridge.vitest.ts --reporter=default
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

<!-- /ANCHOR:3-test-execution -->

<!-- ANCHOR:4-source-files -->
## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/lib/lifecycle/`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts`

---

<!-- /ANCHOR:4-source-files -->

<!-- ANCHOR:5-source-metadata -->
## 5. SOURCE METADATA

- Group: Native MCP Tools
- Playbook ID: NC-005
- Canonical root source: manual_testing_playbook.md
- Feature file path: 01--native-mcp-tools/005-lifecycle-redirect-metadata.md

<!-- /ANCHOR:5-source-metadata -->
