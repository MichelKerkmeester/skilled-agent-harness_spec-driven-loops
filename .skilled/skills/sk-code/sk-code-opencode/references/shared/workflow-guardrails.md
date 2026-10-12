---
title: "OpenCode Workflow Guardrails"
description: "OpenCode-only rules that sit on top of the shared implement and verify workflow: the continuity writer, the sk-git boundary, the spec validation and typecheck chain, and runtime build traps."
trigger_phrases:
  - "opencode workflow guardrails"
  - "opencode verification reality"
  - "runtime build traps"
  - "rebuild dist before verifying"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# OpenCode Workflow Guardrails

OpenCode-only rules for the implement and verify phases.

---

## 1. OVERVIEW

The shared [implementation](../workflow-implement.md) and [verification](../workflow-verify.md) workflows apply on every surface. This file adds what holds only for OpenCode system code under `.skilled/`: the implementation guardrails, the verification command chain and the runtime build traps.

---

## 2. IMPLEMENTATION GUARDRAILS

- Treat `generate-context.js` as the single writer for a packet's continuity metadata, invoked through `/speckit:save`. It keeps atomic same-directory update and lock semantics, so do not hand-edit the generated metadata pair alongside it or run a second writer against the same packet. There is no index or embedding store behind it to mutate separately.
- For git worktree isolation, defer to `sk-git`. This workflow may note that isolation is needed, but it must not duplicate `sk-git`'s worktree setup, branch, commit, or finish-work contract.
- Preserve the verification handoff. Implementation should name the package boundary, rebuild requirement, baseline, likely test command, and any env knobs the verifier must pin. Final evidence belongs to [Workflow Reference - Verification](../workflow-verify.md), not implementation.

---

## 3. VERIFICATION REALITY

OpenCode verification starts with the real spec validation contract when a spec folder is in scope:

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <spec-folder> --strict
```

The exit-code and warning contract of `validate.sh` is owned by `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` (section 1 for the exit taxonomy, section 14 for the ways a run misleads). Read it there, not from a copy here. The one fact this workflow needs: a completion claim requires the explicit `RESULT: PASSED` line, because a warning never changes the exit code and exit status alone has misled in both directions.

Use the package script for the package you changed. The spec-kit root and project-reference workspaces use `tsc --build`. Satellite packages with their own package boundary use `tsc -p tsconfig.build.json`. A satellite typecheck script may add `--noEmit --composite false` over that same overlay. For TypeScript tests, run the package's Vitest-backed script where present, such as `npm test`, `npm run test:core`, or the targeted `vitest run ...` command exposed by that package.

When verification discovers missing build output, stale generated runtime files, or a wrong package boundary, hand back to [Workflow Reference - Implementation](../workflow-implement.md) before making any completion claim.

---

## 4. RUNTIME BUILD TRAPS

- MCP servers, daemon-backed CLIs, and runtime hooks execute built `dist/` output. Editing a `.ts` source file has no runtime effect until the owning package rebuilds its `dist/` artifacts.
- Rebuild before verifying behavior that depends on generated output. For `system-skill-advisor`, the server package names `dist/mcp-server/advisor-server.js` as the compiled backend artifact and `npm run build` as the command that builds TypeScript into `dist/`.
- Keep env-sensitive tests deterministic. Set feature flags, provider choices, database paths, and timeout knobs explicitly in the command or test fixture. Record those values with the result. Do not rely on inherited shell state when the claim depends on a flag.
- After a Node version change, run the native rebuild helper from the spec-kit root: `bash scripts/setup/rebuild-native-modules.sh`. It rebuilds native modules including `better-sqlite3` in `runtime/` and shared workspace modules, then records the new Node version marker.
