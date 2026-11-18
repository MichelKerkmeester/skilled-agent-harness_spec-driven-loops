---
title: "Post-Edit Quality Library: Shared Checker Router"
description: "Runtime-neutral path-dispatch table and deadline-bounded checker runner that returns at most one checker per edit with bounded, redacted findings."
trigger_phrases:
  - "post edit router"
  - "quality checker dispatch"
  - "post edit quality core"
version: 1.0.0.0
---

# Post-Edit Quality Library: Shared Checker Router

---

## 1. OVERVIEW

`lib/` holds the runtime-neutral policy for the post-edit quality concern. It decides which checker runs for an edited path and how that checker's output is bounded. Every runtime in the concern uses the one module here through an adapter, so the checkers and the limits stay the same across runtimes.

The module writes nothing to stdout or stderr and never throws. A missing checker becomes one `quality-notice` finding, so an unchecked edit never reads as a clean one. An exhausted deadline yields no finding. So does a spawn error or an exit status outside 0 and 1.

One environment value is read here: `SPECKIT_VALIDATE_LINKS`, which turns on the wikilinks row. The concern switch belongs to the adapters. They gate before they reach this file.

---

## 2. ARCHITECTURE

Adapters sit above the router and own the runtime work around it. Each one hands the changed path to `resolveDispatch()` and delivers what comes back in its own shape.

```text
╭────────────────────────────────────────────╮
│            post-edit-quality/lib/          │
╰────────────────────────────────────────────╯

┌────────────────────────────────────────────┐
│ Runtime adapter                            │
│ reads a changed file path                  │
└──────────────────────┬─────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────┐
│ resolveDispatch()                          │
│ returns zero or one checker entry          │
└──────────────────────┬─────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────┐
│ runChecks()                                │
│ spawns under the shared deadline           │
└──────────────────────┬─────────────────────┘
                       │
                       ▼
╭────────────────────────────────────────────╮
│ Bounded, redacted findings                 │
│ leave through the calling adapter          │
╰────────────────────────────────────────────╯
```

The dependency runs one way. Adapters load this module. Nothing here imports an adapter or a runtime SDK. The module imports `node:fs` and `node:path`, plus `node:child_process` for spawning.

`resolveDispatch()` returns zero or one entry. Rows run in priority order, so a file that two rows could claim resolves to one checker. A Markdown flowchart under a skill's assets is the case the order exists for, because the flowchart row sits above the skill-doc row.

Only the comment-hygiene row resolves its checker against the hub first. It tries the copy three folders above this module, which is the hub copy, then the project path. A project that reaches the hub through a link therefore still runs the hub checker. A project copy does not override it. Every other row joins its checker path to `projectDir`.

When the module loads, it reads the comment-syntax table from the `sk-code-quality` skill for the extensions that row covers. When that table cannot be read or holds no usable extension, the module falls back to `BUILTIN_SOURCE_EXTENSIONS`. That set keeps TypeScript, JavaScript, Python, shell and JSONC files covered.

---

## 3. FILES

| File | Responsibility |
|---|---|
| `post-edit-router.cjs` | The dispatch table, the deadline-bounded runner and the dist-staleness entrypoint. |

`post-edit-router.cjs` is a CommonJS module. It exports `resolveDispatch()`, `runChecks()`, `runDistStalenessCheck()`, `createDedupeTracker()`, `shouldSurface()`, `truncateAndRedact()` and `redactSecrets()`. The path and scope helpers behind the table are exported too: `relativeSegments()`, `resolveCheckerPath()`, `loadSourceExtensions()`, `isFlowchartCandidate()` and `isVersionedSkillDoc()`.

The constants are exported because the adapters pass budgets instead of hard-coding them. `CHECKER_RELATIVE_PATHS` names the checker scripts the module can spawn. `SOURCE_EXTENSIONS` holds the set the comment-hygiene row matches. The remaining constants carry the built-in extension fallback, the excluded folders, the spec doc basenames, the wikilinks switch name, the finding limits and the budget sets.

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Three Node builtins. No hook-local module and no runtime SDK. |
| Exports | The functions under ENTRYPOINTS and the constants that carry the table, the extension set, the limits and the budgets. |
| Ownership | The dispatch table and the deadline, plus the text of each finding. Payload parsing belongs to each adapter. So does output. |
| State | None between calls. The extension set is read once at load. A dedupe tracker belongs to its caller. |

### Dispatch order

| Row | Concern | Match | Arguments |
|---|---|---|---|
| 1 | Comment hygiene | Source file in the comment-syntax extension table, outside a `dist` or `node_modules` folder and outside `.git` | The file |
| 2 | Flowchart | Markdown named for a flowchart or under the `sk-design-diagram` skill's `ascii-patterns` folder | The file |
| 3 | Frontmatter versions | Skill doc under a skills tree that the version gate covers | `--skill <name>` |
| 4 | Placeholders | Spec doc under `specs/` | The containing folder |
| 5 | Wikilinks | Skill doc with `SPECKIT_VALIDATE_LINKS` set to `true` | The skill folder |

Each concern maps to one checker script: `check-comment-hygiene.sh`, `validate-flowchart.sh`, `check-frontmatter-versions.sh`, `check-placeholders.sh` and `check-links.sh`. The dist-staleness check uses `check-dist-staleness.sh` and runs outside the table.

Every table checker reports a finding with exit status 1. The comment-hygiene row adds one condition: its stdout must not be empty, so exit 1 with nothing to print surfaces nothing.

Row 3 and row 5 never both run. With `SPECKIT_VALIDATE_LINKS` set to `true`, a skill Markdown file goes to the wikilinks checker, except `SKILL.md` and a file under the runtime state slot `.skilled/skills/.state/`.

### Main flow

```text
1. An adapter passes the changed file's absolute path, the project root and optionally an env object to resolveDispatch().
2. resolveDispatch() returns an empty array when the path sits outside the project or no row claims the file.
3. A claimed file returns one entry with a label, the checker path, its arguments and a surface rule.
4. runChecks() returns at once when the shared deadline is already spent, and breaks before an entry when less than the minimum remains.
5. Each checker runs with a timeout carved from what is left, capped per child.
6. Findings are redacted, capped and returned in row order. The caller prints them.
```

A missing checker file gives one `quality-notice` finding that names the missing path and says the edit was not checked. Two entries that name the same missing checker give one notice. A caller-supplied tracker keeps that notice to one per session.

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `resolveDispatch()` | Function | Returns zero or one checker entry for a changed path. |
| `runChecks()` | Function | Spawns entries under a shared deadline and returns bounded findings. |
| `runDistStalenessCheck()` | Function | Returns the dist-staleness banner for one file or `null`. |
| `createDedupeTracker()` | Function | Returns a tracker with `shouldSurface()` and `reset()` for caller-owned suppression. |
| `truncateAndRedact()` | Function | Redacts secret shapes, then cuts text at the finding cap with a visible marker. |
| `post-edit-router.cjs` | Module | The module the adapters load. |

The budget sets match the host. The Claude set allows 9000 ms for the run and a 500 ms floor, with an 8000 ms cap for one checker. The OpenCode set allows 4000 ms for the run and a 300 ms floor, with a 3000 ms cap for one checker, because that host has no timeout wrapper of its own. A caller that passes no deadline or limits receives an 8000 ms total and an 8000 ms cap for one child, with a 300 ms floor. The module chooses no set itself.

Every finding's text is cut at 2000 characters and the list stops at 20. A cut gets a `... [truncated]` marker after those 2000 characters. Secret-shaped assignments and bearer tokens become `[REDACTED]` before any text leaves the module. The keyword or scheme stays so the finding still names its field.

`runDistStalenessCheck()` sits outside the table because it runs for every edited file rather than by path. The OpenCode plugin already has its own freshness guard. It joins its checker to `projectDir` and returns `null` when the checker file is absent, the spawn fails, the timeout is under 300 ms or stdout is empty. The checker prints its banner and exits 0 for a file path.

---

## 6. VALIDATION

Run from the repository root.

```bash
node --test .skilled/hooks/post-edit-quality/tests/post-edit-router.test.cjs
```

Expected output includes `pass 6` and `fail 0`. The command exits 0.

The suite pins the hub-first comment-hygiene lookup, the languages the family table adds, the built-in fallback and the single notice for a missing checker. The last case asserts the router writes nothing to stdout or stderr.

---

## 7. RELATED

- [the concern README](../README.md): the runtime coverage and the switches.
- [the test suite](../tests/post-edit-router.test.cjs): the cases behind the behavior above.
- [the tests README](../tests/README.md): the adapter suites beside this one.
- [the shared switch resolver](../../shared/hook-flags.cjs): the concern switch each adapter reads before it calls this module.
- [the comment-hygiene checker](../../../skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh): the first row of the table.
- [the hooks tree](../../README.md): the kill-switch index and the runtime coverage matrix.
