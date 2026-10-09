---
title: "SD-004: OBSIDIAN Surface Detection"
description: "Verify that a Note Database plugin prompt routes to the OBSIDIAN surface and loads the expected shared and plugin references."
version: 1.0.0.0
---

# SD-004: OBSIDIAN Surface Detection

## 1. OVERVIEW

This scenario verifies that sk-code identifies `OBSIDIAN` for a Note Database plugin prompt. The repository root markers in `shared/references/stack-detection.md:46-51` distinguish the plugin from a generic TypeScript project.

When the prompt asks for a change in `src/views/DatabaseView.ts`, the advisor should select `sk-code` and the compiled router should select the `sk-code-obsidian` surface packet.

---

## 2. SCENARIO CONTRACT

**Realistic user request**: A maintainer of the Note Database Obsidian plugin asks the AI to rename the table cell classes in `DatabaseView.ts` to the plugin's `.db-*` naming convention.

**Exact prompt**:
```
Rename the table cell classes in src/views/DatabaseView.ts of the Note Database Obsidian plugin to the .db-* naming convention.
```

**Expected detection**:
- Surface: `OBSIDIAN`, based on the repository-root markers in `shared/references/stack-detection.md:46-51`.
- Stage one: advisor top-1 is `sk-code` at 0.80 or higher. The plan-time score was 0.9448.
- Stage two: `compiled-route.cjs` returns `route`, `single` and `sk-code-obsidian`.

**Expected references loaded**:
- The three `DEFAULT_RESOURCE` files in `ROUTER.md:320-324`.
- `sk-code-obsidian/references/db-class-naming.md`, from the `OBSIDIAN_PLUGIN` map in `ROUTER.md:555-559`.

**Expected NOT loaded**: Any `sk-code-webflow/references/*` or `sk-code-opencode/references/*` file.

**Desired user-visible outcome**: The prompt resolves to the Obsidian surface and loads the shared routing references with the plugin's class-naming guidance. The route does not load Webflow or OpenCode surface references.

---

## 3. TEST EXECUTION

### Preconditions

1. The sk-code advisor is callable.
2. Compiled routing serves the fresh sk-code manifest.
3. The prompt and commands run from the repository root.

### Exact Command Sequence

1. **Advisor probe**:
   ```
   python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "Rename the table cell classes in src/views/DatabaseView.ts of the Note Database Obsidian plugin to the .db-* naming convention." --threshold 0.8 > /tmp/skc-SD004-advisor.txt
   ```
2. **Compiled route**:
   ```
   node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "Rename the table cell classes in src/views/DatabaseView.ts of the Note Database Obsidian plugin to the .db-* naming convention." > /tmp/skc-SD004-route.txt
   ```
3. **Verify**: advisor top-1 is `sk-code` at 0.80 or higher. The compiled result has action `route`, selection kind `single` and target `sk-code-obsidian`.

### Expected Signals

| Step | Signal |
|---|---|
| 1 | Advisor output selects `sk-code` with a score of at least 0.80. |
| 2 | Compiled output selects `sk-code-obsidian` with `route` and `single`. |
| 2 | The expected references are the three `DEFAULT_RESOURCE` files plus `sk-code-obsidian/references/db-class-naming.md`. |
| 2 | No `sk-code-webflow/references/*` or `sk-code-opencode/references/*` path appears. |

### Pass/Fail Criteria

- **PASS** iff the advisor selects `sk-code` at 0.80 or higher and the compiled route selects `sk-code-obsidian` with action `route` and selection kind `single`. The expected references appear without Webflow or OpenCode surface references.
- **FAIL** iff the advisor score is below 0.80, the compiled route selects another target, or a Webflow or OpenCode surface reference appears.

**Evidence**: `/tmp/skc-SD004-advisor.txt` and `/tmp/skc-SD004-route.txt`.

### Failure Triage

1. If the advisor misses `sk-code`, rerun the exact prompt and inspect its score output.
2. If the compiled route selects the wrong target, check manifest freshness and the `OBSIDIAN_PLUGIN` map in `ROUTER.md`.

---

## 4. SOURCE FILES

- [../manual-testing-playbook.md](../manual-testing-playbook.md): Root directory page and scenario summary.
- `.skilled/skills/sk-code/shared/references/stack-detection.md`: Obsidian repository-root markers and surface precedence.
- `.skilled/skills/sk-code/ROUTER.md`: `DEFAULT_RESOURCE` entries and the `OBSIDIAN_PLUGIN` reference map.
- `.skilled/skills/sk-code/sk-code-obsidian/references/db-class-naming.md`: plugin table and database class naming rules.
- [OB-020 packet-level positive control](../../sk-code-obsidian/manual-testing-playbook/surface-detection/obsidian-surface-resolution.md): confirms the packet's Obsidian surface markers.

---

## 5. SOURCE METADATA

- Group: Surface Detection
- Playbook ID: SD-004
- Critical path: No
- Destructive: No, read-only routing test.
- Sandbox: Read-only.
