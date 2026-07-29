---
title: "Hooks: Fully-Portable Guard Cores + Git Commit Hooks"
description: "Every 'hook' concept in the repo under one root: AI-runtime lifecycle guard cores organized by concern, plus the git commit-hooks installer, previously two separately-named trees."
trigger_phrases:
  - "hooks tree"
  - "runtime hooks"
  - "portable guard cores"
  - "hook relocation"
  - "git hooks"
  - "dispatch preflight"
  - "mcp route guard"
  - "post edit quality"
  - "task dispatch guard"
---

# Hooks: Fully-Portable Guard Cores + Git Commit Hooks

---

## 1. OVERVIEW

`.opencode/hooks/` is the single home for every "hook" concept in the repo. Four concern folders (`dispatch/`, `mcp-route-guard/`, `post-edit-quality/`, `task-dispatch/`, plus their shared helper in `shared/`) hold AI-runtime lifecycle hooks that have no real dependency on the skill they used to live inside — each was originally nested under a domain skill's own tree (`cli-opencode/scripts/`, `mcp-code-mode/runtime/`, `sk-code/code-quality/scripts/`, `system-deep-loop/runtime/lib/deep-loop/`). Moving them out means a user can adopt or remove the enforcement layer independently of the skill's own knowledge and reference content.

A further AI-runtime concern, [`goal/`](./goal/README.md), is not a relocation but a new cross-runtime sibling of the OpenCode `mk-goal` plugin: it ports passive session-goal tracking (per-turn goal-brief injection, prompt-injection hardening, a heuristic verifier) to Devin, Cursor, and Pi through one shared active-goal state file plus a manage CLI, while OpenCode keeps using `mk-goal` directly.

A fifth folder, [`git/`](./git/README.md), holds the git commit-hooks installer (the pre-commit gate) — an unrelated concept from the four AI-runtime concerns above, nested here only because both are "hooks" in the everyday sense and the operator wanted one unified tree rather than two similarly-named sibling directories (`hooks/` and `runtime-hooks/`). **`git/pre-commit` is not standalone**: the repo's real, installed `.git/hooks/pre-commit` is `.opencode/scripts/git-hooks/pre-commit`, which chain-calls `git/pre-commit` by path as its comment-hygiene sub-gate. See [`git/README.md`](./git/README.md) for that installer's own contract, and [`injection-contract.md`](../skills/system-spec-kit/references/hooks/injection-contract.md) for what each AI-runtime hook here actually injects and its visibility to the human operator.

### Why only these four concerns moved

A core only qualifies for this tree when it imports nothing but Node builtins (or shells out to an unrelated, unmoved checker script by path) and has no real tie to its owning skill's other content. Verified per core before moving:

| Concern | Core dependencies | Verdict |
|---|---|---|
| `dispatch` | Node builtins only | Portable |
| `mcp-route-guard` | Node builtins only | Portable |
| `post-edit-quality` | Node builtins + `spawnSync` to unmoved checker scripts (invoked by path, never imported) | Portable |
| `task-dispatch` | Node builtins only | Portable |

Hooks that did **not** move stay inside their owning skill because their core logic genuinely is that skill's engine, not a bolt-on guard: `spec-gate-*`, the session-lifecycle hooks, and `completion-evidence-stop` (`system-spec-kit`), the skill-advisor brief (`system-skill-advisor`), and `git-preflight-advisory` (`sk-git`, depends on its own `git-context.mjs`/`git-rule-checks.mjs` rule engine).

`hook-adapter-shared.cjs`, a tiny stdin-parsing helper with zero dependencies of its own, has its own local copy at `shared/hook-adapter-shared.cjs`. It used to be a single copy inside `system-spec-kit` that adapters here reached back into — a real cross-tree dependency that contradicted the whole point of this relocation (a user adopting the enforcement layer without the skill would still have pulled in a `system-spec-kit` file). A second, independent ESM sibling lives at `system-spec-kit/mcp-server/hooks/lib/hook-adapter-shared.mjs` for that skill's own four `spec-gate-enforce.mjs` adapters, which are not part of the fully-portable set; the two copies are allowed to drift only in the sense that either could change independently, though in practice this file is small and stable enough that they shouldn't.

---

## 2. DIRECTORY TREE

```text
hooks/
+-- git/                             # git commit-hooks installer (unrelated concept, see OVERVIEW)
|   +-- README.md
|   +-- install-hooks.sh
|   `-- pre-commit                   # chain-called by .opencode/scripts/git-hooks/pre-commit
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
|   +-- codex/    (same pair)
|   +-- pi/       dispatch-preflight-lint.ts, dispatch-audit.ts (symlinked from .pi/extensions/)
|   `-- opencode/ mk-cli-dispatch-audit.js (browsability symlink -> ../../../plugins/)
+-- mcp-route-guard/                 # native mcp_* call -> Code Mode routing advisory
|   +-- lib/mcp-route-guard.cjs, mcp-route-guard.test.cjs
|   +-- claude/, devin/, codex/      mcp-route-guard.cjs
|   +-- cursor/   mcp-route-guard.mjs
|   +-- pi/       mcp-route-guard.ts (symlinked from .pi/extensions/)
|   `-- opencode/ mk-mcp-route-guard.js (browsability symlink -> ../../../plugins/)
+-- post-edit-quality/               # comment-hygiene + dist-staleness findings on edit/write
|   +-- lib/post-edit-router.cjs
|   +-- claude/   claude-posttooluse.cjs
|   +-- devin/    post-edit-quality.cjs
|   +-- codex/    post-edit-quality.cjs
|   +-- pi/       post-edit-quality.ts (symlinked from .pi/extensions/)
|   `-- opencode/ mk-post-edit-quality.js (browsability symlink -> ../../../plugins/)
+-- task-dispatch/                   # Task/subagent dispatch guard + Fable-subagent policy
|   +-- lib/dispatch-guard.cjs
|   +-- claude/   task-dispatch-guard.cjs, fable-subagent-guard.mjs
|   +-- devin/    task-dispatch-guard.cjs
|   +-- cursor/   task-dispatch-guard.mjs
|   `-- opencode/ mk-deep-loop-guard.js (browsability symlink -> ../../../plugins/)
`-- goal/                            # cross-runtime passive session-goal tracking (sibling of mk-goal)
    +-- lib/goal-core.cjs, goal-core.test.cjs
    +-- bin/goal.cjs                 # manage CLI: set/show/history/doctor/clear/complete/pause/resume
    +-- devin/    goal-inject.mjs, goal-session-start.mjs, goal-verify.mjs
    +-- cursor/   goal-inject.mjs
    +-- pi/       goal-context.ts (symlinked from .pi/extensions/)
    `-- opencode/ mk-goal.js (browsability symlink -> ../../../plugins/)
```

Pi's portable adapters live here too, in per-concern `pi/` subfolders (`dispatch/pi/`, `mcp-route-guard/pi/`, `post-edit-quality/pi/`, `goal/pi/`) — Pi auto-discovers `.pi/extensions/`, but its loader follows symlinks and resolves each extension's relative imports against the *symlink* path (probe-verified against the installed loader), so `.pi/extensions/` holds relative symlinks back to the real files and every import stays written for the `.pi/extensions/` base. OpenCode (`.opencode/plugins/*.js`) remains the one runtime whose adapter files genuinely cannot live here: its plugins are real modules in a fixed folder OpenCode's loader scans by a flat glob, so only their `require()`/`import` path to these cores changed. For browsability, each concern's `opencode/` subfolder holds a *relative symlink back into* `.opencode/plugins/` — the reverse of Pi's direction: nothing loads through the OpenCode symlink (verified — the loader globs only `.opencode/plugins/`, not the tree), it is a documentation mirror so the tree shows OpenCode beside the other runtimes. Cursor has no `dispatch`/`post-edit-quality` wiring today, so those subfolders have no `cursor/` entry.

---

## 3. KEY FILES

| Concern | Real adapters here | Stays in `.opencode/plugins/` (mirrored at `opencode/` via browsability symlink) |
|---|---|---|
| `dispatch` | claude, devin, codex, pi (symlinked from `.pi/extensions/`) | `mk-cli-dispatch-audit.js` |
| `mcp-route-guard` | claude, cursor, devin, codex, pi (symlinked) | `mk-mcp-route-guard.js` |
| `post-edit-quality` | claude, devin, codex, pi (symlinked) | `mk-post-edit-quality.js` |
| `task-dispatch` | claude, cursor, devin | `mk-deep-loop-guard.js` |
| `goal` | devin, cursor, pi (symlinked); plus `lib/` core + `bin/` manage CLI | `mk-goal.js` |

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
node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs .opencode/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs
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

```bash
grep -n HYGIENE_HOOK .opencode/scripts/git-hooks/pre-commit
```

Expected result: `HYGIENE_HOOK="${REPO_ROOT}/.opencode/hooks/git/pre-commit"` — confirms the live pre-commit chain still finds the comment-hygiene sub-gate after the move (see [`git/README.md`](./git/README.md)).

---

## 6. RELATED

- [`../skills/system-spec-kit/references/hooks/injection-contract.md`](../skills/system-spec-kit/references/hooks/injection-contract.md): what every hook (including the ones that stayed in their skill) actually injects.
- Per-concern READMEs: [`dispatch/`](./dispatch/README.md), [`mcp-route-guard/`](./mcp-route-guard/README.md), [`post-edit-quality/`](./post-edit-quality/README.md), [`task-dispatch/`](./task-dispatch/README.md), [`shared/`](./shared/README.md).
- [`git/README.md`](./git/README.md): the git commit-hooks installer nested in this tree.
- [`../scripts/git-hooks/README.md`](../scripts/git-hooks/README.md): the primary git-hooks installer that chain-calls `git/pre-commit`.
- [`../../.claude/hooks/README.md`](../../.claude/hooks/README.md), [`../../.cursor/hooks/README.md`](../../.cursor/hooks/README.md), [`../../.devin/hooks/README.md`](../../.devin/hooks/README.md), [`../../.codex/hooks/README.md`](../../.codex/hooks/README.md): per-runtime discovery mirrors pointing back into this tree.
- [`../plugins/README.md`](../plugins/README.md): the OpenCode plugins that import these cores directly.
- [`../../.pi/extensions/README.md`](../../.pi/extensions/README.md): the Pi extensions that import these cores directly.
