# cli-opencode Tool-Name Regex Fix — 2026-05-08

> Fixes silent dispatch hangs and 400 errors when using DeepSeek/Moonshot/Kimi (and other regex-validating providers) through `opencode run` with the open-source-model gateways.

---

## TL;DR

Two independent issues were combining to make `opencode run` unreliable for open-source models routed via the `opencode-go` gateway and direct `deepseek/*` provider:

1. **opencode-skills plugin recursed into `node_modules/`** and registered vendored `SKILL.md` files (e.g. `@github/copilot-sdk`'s `customize-cloud-agent/SKILL.md`) as tools whose names contain literal `@` characters — failing the provider-side regex `^[a-zA-Z0-9_-]+$`.
2. **`@github/copilot-sdk@^0.2.2` was a phantom dependency** in `mcp_server/package.json` — declared but never imported anywhere in the source tree, only used to ship that one offending vendored SKILL.md.

Both root causes are now fixed. Tool registry dropped from **31 → 13 tools**. All names match `^[a-zA-Z0-9_-]+$`. PONG sanity tests succeed in <30s post-fix.

---

## 1. SYMPTOMS

### Symptom A — Provider-side 400 (regex error)

User-visible error in the OpenCode TUI when dispatching to DeepSeek or Moonshot/Kimi:

```
Error from provider: Provider returned error
Invalid 'tools[24].function.name': string does not match pattern.
Expected a string that matches the pattern '^[a-zA-Z0-9_-]+$'.
```

Reproduces with `opencode run --model deepseek/deepseek-v4-pro "any prompt"` (no `--pure`). Fails in 10–30s. Never reaches the user's prompt.

### Symptom B — Silent hang

`opencode run` invocations with `--pure` and prompts > ~1.5KB hang indefinitely:
- Process at 0% CPU, no TCP connections to provider, 0 bytes stdout/stderr.
- opencode init logs reach `service=snapshot prune=7.days cleanup` (+60s) and stop. No subsequent activity.
- Tiny prompts (PONG, 800B head) work intermittently.
- Foreground dispatches with `2>&1 | tail` work; background dispatches with `> stdout 2> stderr` redirects hang.

Symptom B was a downstream consequence of symptom A: the regex-failing tool registration triggers a silent failure path in some opencode code-paths, which manifests as a hang when stdout is fully redirected (the 400 response never makes it to the redirected file). With `--pure` the plugin is skipped, but the hang persisted on this machine because of accumulated stale opencode-ai processes from prior sessions holding SQLite locks on the shared `~/.local/share/opencode/opencode.db` (6.8GB).

---

## 2. ROOT CAUSES

### Root cause #1 — opencode-skills plugin globs into `node_modules/`

The bundled `opencode-skills` plugin (loaded via `~/.config/opencode/opencode.json`'s `"plugin": ["opencode-skills"]` array) walks **`**/SKILL.md`** recursively from the project root and registers each match as a tool named `skills_<dirname_path_with_underscores>`. It does NOT exclude `node_modules/`.

Concrete trace:
- `.opencode/skills/system-spec-kit/mcp_server/package.json` listed `"@github/copilot-sdk": "^0.2.2"` as a dependency.
- That npm package vendors a directory `node_modules/@github/copilot-sdk/node_modules/@github/copilot/builtin-skills/customize-cloud-agent/SKILL.md`.
- opencode-skills found it and registered a tool named:
  `skills_system_spec_kit_mcp_server_node_modules_@github_copilot_sdk_node_modules_@github_copilot_builtin_skills_customize_cloud_agent`
- The two `@` characters in the path become literal `@` in the tool name.
- DeepSeek/Moonshot/Kimi provider validates `tools[N].function.name` against `^[a-zA-Z0-9_-]+$` and rejects with HTTP 400.

opencode-skills **does NOT ship as an opencode default**. It loads only because the user's `~/.config/opencode/opencode.json` lists it in the `"plugin"` array — likely added during initial setup or by an `opencode init` wizard. An archived spec doc (`096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/spec.md`) explicitly notes that `opencode-skills` was a **workaround** for a directory-naming bug that has since been fixed: *"Plural alignment removes that workaround dependency"*. The plugin is no longer needed for any current functionality.

This repo's commands, agents, and skill definitions reference NONE of the `skills_*` direct-callable tool names that opencode-skills registers (verified with grep). All skill dispatching happens via slash-commands (`/spec_kit:plan`, etc.) and via the built-in `skill` tool from agents — neither path requires `opencode-skills`.

### Root cause #2 — `@github/copilot-sdk` is a phantom dependency

Listed in `.opencode/skills/system-spec-kit/mcp_server/package.json` as `"@github/copilot-sdk": "^0.2.2"`. Verified usage:
- `grep -rn "@github/copilot-sdk" .opencode/skills/system-spec-kit/ --include="*.ts" --include="*.js" --include="*.mjs" --include="*.cjs"` (excluding `node_modules`): **0 hits**.
- `grep -rn "copilot-sdk" .opencode/skills/system-spec-kit/mcp_server/dist/`: **0 hits**.
- `grep -rln "@github/copilot-sdk" .opencode --include="*.ts" --include="*.js" --include="*.json"` (excluding `node_modules`, `package.json`): **0 hits**.

The dep is declared but never imported. Its only on-disk effect was shipping the offending vendored SKILL.md.

The same phantom dep was present in the Barter sibling repo's `.opencode/skill/system-spec-kit/mcp_server/package.json`.

---

## 3. FIXES APPLIED

### Fix 1 — Remove `opencode-skills` from user's global plugin list

**File:** `/Users/michelkerkmeester/.config/opencode/opencode.json`

```diff
 {
-  "plugin": [
-    "opencode-skills"
-  ],
+  "plugin": [],
   "$schema": "https://opencode.ai/config.json",
   ...
 }
```

Effect: opencode-skills no longer loads, no recursive `**/SKILL.md` glob, no `skills_*` auto-registered tools. The legitimate project-local plugin `spec-kit-skill-advisor.js` continues to load via `.opencode/plugins/` and registers its single `spec_kit_skill_advisor_status` tool with a clean name.

### Fix 2 — Remove `@github/copilot-sdk` phantom dep (main repo)

**File:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/package.json`

```diff
   "dependencies": {
-    "@github/copilot-sdk": "^0.2.2",
     "@huggingface/transformers": "^3.8.1",
     ...
```

Then `npm uninstall @github/copilot-sdk` to wipe the package + transitive deps from `node_modules/`. The vendored `customize-cloud-agent/SKILL.md` at `node_modules/@github/copilot-sdk/node_modules/@github/copilot/builtin-skills/...` is gone.

### Fix 3 — Same phantom-dep removal in Barter sibling repo

**File:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/barter/.opencode/skill/system-spec-kit/mcp_server/package.json`

Same diff as Fix 2. Same `npm uninstall @github/copilot-sdk` cleanup.

### Pre-fix workaround (no longer needed)

Earlier in the session I had renamed the offending vendored SKILL.md to `.disabled-for-tool-name-regex` as a stop-gap before the proper root-cause fix landed. After Fix 2/3 those files don't exist any more (npm uninstall removed the whole package tree). The same workaround was applied to the Barter sibling at `barter/.opencode/skill/system-spec-kit/mcp_server/node_modules/@github/copilot-sdk/...` — also now deleted by Fix 3.

---

## 4. VERIFICATION

### Tool registry post-fix (clean)

```bash
$ timeout 25 opencode run --model deepseek/deepseek-v4-pro --print-logs --log-level DEBUG "Hi"
$ grep "service=tool.registry status=started" debug.log | wc -l
13
$ grep "service=tool.registry status=started" debug.log | grep "@" | wc -l
0
$ grep "service=tool.registry status=started" debug.log | grep "skills_" | wc -l
0
```

Tool list (in order):
1. invalid (opencode internal marker)
2. question
3. bash
4. read
5. glob
6. grep
7. edit
8. write
9. task
10. webfetch
11. todowrite
12. skill (built-in skill dispatcher)
13. spec_kit_skill_advisor_status (from `.opencode/plugins/spec-kit-skill-advisor.js`)

All names match `^[a-zA-Z0-9_-]+$`.

### Smoke tests post-fix

```bash
# Direct DeepSeek API
$ time opencode run --model deepseek/deepseek-v4-pro "Reply PONG only"
> build · deepseek-v4-pro
PONG
real    0m27s

# Without --pure (the failing case before)
$ time opencode run --model deepseek/deepseek-v4-pro "Reply PONG only"
> build · deepseek-v4-pro
PONG
real    0m27s   # was: 400 error 'Invalid tools[24].function.name'
```

Both succeed cleanly. The non-pure case was the original failure mode shown in the user's screenshot.

---

## 5. FILES CHANGED

| Repo | Path | Change | Effect |
|---|---|---|---|
| User-global config | `~/.config/opencode/opencode.json` | `"plugin": ["opencode-skills"]` → `"plugin": []` | Disable plugin that recursively registers vendored skills |
| Main repo | `.opencode/skills/system-spec-kit/mcp_server/package.json` | Remove `"@github/copilot-sdk": "^0.2.2"` dep | Wipe the vendored SKILL.md source |
| Main repo | `.opencode/skills/system-spec-kit/mcp_server/node_modules/@github/copilot-sdk/` | Removed by `npm uninstall` | Vendored SKILL.md gone |
| Barter repo | `barter/.opencode/skill/system-spec-kit/mcp_server/package.json` | Remove `"@github/copilot-sdk": "^0.2.2"` dep | Same as main |
| Barter repo | `barter/.opencode/skill/system-spec-kit/mcp_server/node_modules/@github/copilot-sdk/` | Removed by `npm uninstall` | Same as main |

---

## 6. FOLLOW-UPS

### A. Upstream fix in opencode (preferred long-term)

File an issue with `opencode-ai/opencode` requesting that the bundled `opencode-skills` plugin add a `node_modules/` exclusion to its `**/SKILL.md` glob. Suggested fix shape (pseudo-code):

```javascript
const skills = await glob("**/SKILL.md", {
  ignore: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/build/**"]
});
```

Without this, ANY repo that npm-installs a package vendoring a `SKILL.md` will trip the same regex error against any provider with strict `function.name` validation (DeepSeek, Moonshot/Kimi, possibly others).

### B. CI/CD regression guard

To prevent the phantom dep from creeping back, add to `mcp_server/package.json` a CI step or pre-commit check:

```bash
# Fail if a vendored SKILL.md ever reappears under node_modules
test -z "$(find node_modules -path '*/SKILL.md' 2>/dev/null)" || \
  { echo "ERROR: vendored SKILL.md found in node_modules — plugin recursion risk"; exit 1; }
```

### C. Postinstall hardening (defense-in-depth)

If future deps re-introduce vendored `SKILL.md` files (different package), a postinstall hook handles it:

```json
// mcp_server/package.json
"scripts": {
  "postinstall": "find node_modules -path '*/SKILL.md' -exec mv {} {}.disabled-for-tool-name-regex \\; 2>/dev/null || true"
}
```

This is **not active today** — the plugin removal in Fix 1 plus the phantom-dep removal in Fix 2/3 covers the current symptom completely. Add this only if a future dep brings back vendored skills and you don't want to remove that dep.

### D. Memory entries written this session

- `feedback_opencode_pure_flag_required_for_deepseek.md` — documents the `--pure` requirement and the secondary stale-process DB-lock cause that masked the true tool-name issue.
- `feedback_opencode_skills_node_modules_recursion.md` — documents the opencode-skills plugin's recursive glob behavior and the rename workaround (now superseded by Fix 1/2/3).

Both are linked from `MEMORY.md` for future sessions.

---

## 7. APPENDIX — DEBUG TIMELINE

A condensed log of the debug session that surfaced both root causes (entries are local time, 2026-05-08):

| Time | Event |
|---|---|
| 08:30 | Iter-1 dispatched with `--format json --pure --agent general --variant high` against `deepseek/deepseek-v4-pro`. Hung silently for 7+ min. |
| 08:42 | Hypothesized DeepSeek MCP-name compat (per memory `reference_opencode_provider_mcp_tool_compat`). Fell back to `opencode-go/kimi-k2.6` (no `--pure`). Same hang. |
| 08:46 | Smoke test with `--variant medium` (no `--pure`) returned 400: `Provider returned error`. First evidence of provider-side rejection. |
| 08:48 | Smoke test with `--pure` returned PONG in 19s. `--pure` confirmed required. |
| 09:04–09:18 | Bisection on prompt size: 800B works, 1200B works, 1500B+ hangs. False trail — actually triggered by stale opencode processes holding DB locks. |
| 10:20 | Killed 5 stale `opencode-ai/.opencode` processes (Sat–Sun). Bisection resumed: 1500B foreground worked, made real tool calls. |
| 10:23 | User screenshot showed ARCHITECTURE.md task hitting `Invalid 'tools[24].function.name'` regex error. Investigated tool registry. |
| 10:27 | DEBUG log enumeration: 31 registered tools. Tools[24]–[27] include `skills_system_spec_kit_mcp_server_node_modules_@github_copilot_sdk_node_modules_@github_copilot_builtin_skills_customize_cloud_agent` — `@` char fails regex. |
| 10:28 | Found and renamed both vendored `customize-cloud-agent/SKILL.md` files (main + barter) to `.disabled-for-tool-name-regex`. Verified non-pure dispatch returns PONG. |
| 12:19 | After confirming `@github/copilot-sdk` has zero source imports (phantom dep), removed it from main repo's `mcp_server/package.json` + `npm uninstall`. Tool count dropped 31 → 13. |
| 12:20 | Removed `opencode-skills` from `~/.config/opencode/opencode.json` `"plugin"` array. |
| 12:39 | Same fixes applied to barter sibling. |
| 12:40 | Verified post-fix: PONG works, tool registry clean, no `@`-named tools, no `skills_*` tools. |

---

## 8. WHO TO TAG / REFERENCES

- **Memory (this repo):** `feedback_opencode_pure_flag_required_for_deepseek.md`, `feedback_opencode_skills_node_modules_recursion.md`
- **Skill:** `.opencode/skills/cli-opencode/SKILL.md`
- **Schema:** `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` (cli-opencode supports only `model`/`reasoningEffort`/`timeoutSeconds` per the schema; the deep-research config was patched separately to drop `serviceTier`/`sandboxMode`/`provider` for compatibility).
- **Archived note:** `.opencode/specs/skilled-agent-orchestration/096-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/spec.md` confirms `opencode-skills` is no longer needed after the singular→plural directory rename.

---

*Author: Claude Opus 4.7 + user (during 027-xce-research-based-refinement debugging session)*
*Status: Verified working. Followups (A, B, C) are optional defense-in-depth.*
