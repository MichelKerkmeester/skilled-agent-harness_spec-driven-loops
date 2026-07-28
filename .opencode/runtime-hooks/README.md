---
title: "Runtime Hooks: Fully-Portable Guard Cores"
description: "AI-runtime lifecycle hooks and their guard cores relocated out of .opencode/skills/, organized by concern rather than by owning skill."
trigger_phrases:
  - "runtime hooks"
  - "portable guard cores"
  - "hook relocation"
  - "dispatch preflight"
  - "mcp route guard"
  - "post edit quality"
  - "task dispatch guard"
---

# Runtime Hooks: Fully-Portable Guard Cores

---

## 1. OVERVIEW

`.opencode/runtime-hooks/` holds the AI-runtime lifecycle hooks (and the guard cores they call) that have no real dependency on the skill they used to live inside. Each was originally nested under a domain skill's own tree (`cli-opencode/scripts/`, `mcp-code-mode/runtime/`, `sk-code/code-quality/scripts/`, `system-deep-loop/runtime/lib/deep-loop/`). Moving them out means a user can adopt or remove the enforcement layer independently of the skill's own knowledge and reference content.

This is not the git commit-hooks folder. `.opencode/hooks/` (no `runtime-` prefix) is the pre-commit gate installer, a completely different, unrelated concept. See [`injection-contract.md`](../skills/system-spec-kit/references/hooks/injection-contract.md) for what each hook here actually injects and its visibility to the human operator.

### Why only these four concerns moved

A core only qualifies for this tree when it imports nothing but Node builtins (or shells out to an unrelated, unmoved checker script by path) and has no real tie to its owning skill's other content. Verified per core before moving:

| Concern | Core dependencies | Verdict |
|---|---|---|
| `dispatch` | Node builtins only | Portable |
| `mcp-route-guard` | Node builtins only | Portable |
| `post-edit-quality` | Node builtins + `spawnSync` to unmoved checker scripts (invoked by path, never imported) | Portable |
| `task-dispatch` | Node builtins only | Portable |

Hooks that did **not** move stay inside their owning skill because their core logic genuinely is that skill's engine, not a bolt-on guard: `spec-gate-*`, the session-lifecycle hooks, and `completion-evidence-stop` (`system-spec-kit`), the skill-advisor brief (`system-skill-advisor`), and `git-preflight-advisory` (`sk-git`, depends on its own `git-context.mjs`/`git-rule-checks.mjs` rule engine).

`hook-adapter-shared.cjs`, a tiny stdin-parsing helper with zero dependencies of its own, has its own local copy at `shared/hook-adapter-shared.cjs`. It used to be a single copy left in `system-spec-kit/runtime/lib/` that adapters here reached back into — a real cross-tree dependency that contradicted the whole point of this relocation (a user adopting the enforcement layer without the skill would still have pulled in a `system-spec-kit` file). A second, independent copy still lives at `system-spec-kit/runtime/lib/hook-adapter-shared.cjs` for that skill's own `spec-gate-enforce.mjs`, which is not part of the fully-portable set; the two copies are allowed to drift only in the sense that either could change independently, though in practice this file is small and stable enough that they shouldn't.

---

## 2. DIRECTORY TREE

```text
runtime-hooks/
+-- shared/
|   `-- hook-adapter-shared.cjs      # stdin collection + fail-open JSON parse, used by 5 adapters below
+-- dispatch/                        # cli-opencode dispatch-shape hard-rule + audit hooks
|   +-- lib/
|   |   +-- dispatch-rule-checks.mjs
|   |   +-- dispatch-rule-checks.test.mjs
|   |   +-- dispatch-audit.mjs
|   |   `-- dispatch-audit.test.mjs
|   +-- claude/   dispatch-preflight-lint.mjs, dispatch-audit-posttooluse.mjs
|   +-- devin/    (same pair)
|   `-- codex/    (same pair)
+-- mcp-route-guard/                 # native mcp_* call -> Code Mode routing advisory
|   +-- lib/mcp-route-guard.cjs, mcp-route-guard.test.cjs
|   +-- claude/, devin/, codex/      mcp-route-guard.cjs
|   `-- cursor/   mcp-route-guard.mjs
+-- post-edit-quality/               # comment-hygiene + dist-staleness findings on edit/write
|   +-- lib/post-edit-router.cjs
|   +-- claude/   claude-posttooluse.cjs
|   +-- devin/    post-edit-quality.cjs
|   `-- codex/    post-edit-quality.cjs
`-- task-dispatch/                   # Task/subagent dispatch guard + Fable-subagent policy
    +-- lib/dispatch-guard.cjs
    +-- claude/   task-dispatch-guard.cjs, fable-subagent-guard.mjs
    +-- devin/    task-dispatch-guard.cjs
    `-- cursor/   task-dispatch-guard.mjs
```

Pi (`.pi/extensions/*.ts`) and OpenCode (`.opencode/plugins/*.js`) cannot have their adapter files physically live here: both runtimes auto-discover hooks/plugins from their own fixed directory, so only their `import()`/`require()` path to these relocated cores changed. Cursor has no `dispatch`/`post-edit-quality` wiring today, so those subfolders have no `cursor/` entry.

---

## 3. KEY FILES

| Concern | Real adapters here | Stays elsewhere, only its import path changed |
|---|---|---|
| `dispatch` | claude, devin, codex | `.pi/extensions/{dispatch-preflight-lint,dispatch-audit}.ts` |
| `mcp-route-guard` | claude, cursor, devin, codex | `.pi/extensions/mcp-route-guard.ts`, `.opencode/plugins/mk-mcp-route-guard.js` |
| `post-edit-quality` | claude, devin, codex | `.pi/extensions/post-edit-quality.ts`, `.opencode/plugins/mk-post-edit-quality.js` |
| `task-dispatch` | claude, cursor, devin | `.opencode/plugins/mk-deep-loop-guard.js` |

`mk-git-preflight-advisory.js` and `mk-cli-dispatch-audit.js` (OpenCode plugins owned by `sk-git`/`cli-opencode` respectively) both also import `dispatch/lib/dispatch-rule-checks.mjs` and `dispatch/lib/dispatch-audit.mjs` from here.

`shared/hook-adapter-shared.cjs` is imported by the 5 adapters that parse raw stdin JSON: `mcp-route-guard/{claude,codex,devin}/mcp-route-guard.cjs` and `task-dispatch/{claude,devin}/task-dispatch-guard.cjs`.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Ownership | A core belongs here only when it has no real dependency on a specific skill's other content. If a future core develops one, move it back out. |
| Imports | Cores import Node builtins only, or shell out to an unmoved checker script by project-root-relative path. Adapters import their concern's own `lib/` (one level up) plus, where needed, the local `shared/hook-adapter-shared.cjs` (two levels up into `../../shared/`) — no adapter under this tree imports anything outside it. |
| Runtime wiring | Each runtime's own config (`.claude/settings.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`, `.codex/hooks.json`) points its command string directly at the real file here. The four runtime discovery mirrors (`.claude/hooks/`, `.cursor/hooks/`, `.devin/hooks/`, `.codex/hooks/`) hold a relative symlink to the same file, for browsability only. |
| Tests | Each concern's `lib/` keeps its co-located test file, moved alongside its core. |

---

## 5. VALIDATION

```bash
node --test .opencode/runtime-hooks/dispatch/lib/dispatch-rule-checks.test.mjs .opencode/runtime-hooks/dispatch/lib/dispatch-audit.test.mjs .opencode/runtime-hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs
```

Expected result: all suites pass.

```bash
pi --offline --approve -p "list your available tools" </dev/null
```

Expected result: exit 0, no extension-load error (confirms `.pi/extensions/*.ts`'s relocated import paths resolve).

```bash
node -e "import('./.opencode/plugins/mk-mcp-route-guard.js').then(()=>console.log('ok'))"
```

Expected result: `ok`, no module-resolution error (repeat for `mk-post-edit-quality.js`, `mk-deep-loop-guard.js`, `mk-cli-dispatch-audit.js`, `mk-git-preflight-advisory.js`).

---

## 6. RELATED

- [`../skills/system-spec-kit/references/hooks/injection-contract.md`](../skills/system-spec-kit/references/hooks/injection-contract.md): what every hook (including the ones that stayed in their skill) actually injects.
- [`../../.claude/hooks/README.md`](../../.claude/hooks/README.md), [`../../.cursor/hooks/README.md`](../../.cursor/hooks/README.md), [`../../.devin/hooks/README.md`](../../.devin/hooks/README.md), [`../../.codex/hooks/README.md`](../../.codex/hooks/README.md): per-runtime discovery mirrors pointing back into this tree.
- [`../plugins/README.md`](../plugins/README.md): the OpenCode plugins that import these cores directly.
- [`../../.pi/extensions/README.md`](../../.pi/extensions/README.md): the Pi extensions that import these cores directly.
