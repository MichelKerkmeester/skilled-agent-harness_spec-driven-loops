---
title: "Implementation Plan: Phase 4: hook-stdin-deadline"
description: "Give the shared CommonJS stdin reader one deadline, and point the three post-edit adapters at that reader instead of their own copies."
trigger_phrases:
  - "hook stdin deadline plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: hook-stdin-deadline

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`), Node built-ins only |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` (node:test) with `spawn` and `spawnSync` of a child process, plus the existing shell parse test |

### Overview
`readStdin` becomes a Promise that settles on whichever comes first: the stdin stream ends, or a 3000 ms timer fires. Both paths clear the timer, remove the listeners and pause stdin, so the process can exit. The three post-edit adapters delete their copies of the reader and require the shared helper. Their existing `JSON.parse` inside a try block keeps the bad-input handling unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared helper with thin adapters: one reader in `.skilled/hooks/shared/`, consumed by eight CommonJS adapters.

### Key Components
- **`readStdin`** (`.skilled/hooks/shared/hook-adapter-shared.cjs`): the deadline reader. Signature `readStdin({ timeoutMs = 3000 } = {})`.
- **`parseJsonFailOpen`** (same file): unchanged.
- **Consumers that already require the helper**: `mcp-route-guard/{claude,codex,devin}/mcp-route-guard.cjs` and `task-dispatch/{claude,devin}/task-dispatch-guard.cjs`. They need no edit.
- **Consumers this phase adds**: `post-edit-quality/{claude/claude-posttooluse.cjs, codex/post-edit-quality.cjs, devin/post-edit-quality.cjs}`.
- **Test file** (`.skilled/hooks/shared/hook-adapter-shared.test.cjs`): two cases, described in section 5.

### Data Flow
A host writes one JSON payload to the hook's stdin. `readStdin` collects the chunks. If the stream ends first, the joined text is returned whole. If the 3000 ms timer fires first, the text read so far is returned and stdin is released. The adapter then parses the text. Post-edit adapters use `JSON.parse` in a try block, and the guards use `parseJsonFailOpen`. A partial or empty result takes each adapter's existing fail-open path.

### Proposed helper code
The builder replaces `readStdin` in `.skilled/hooks/shared/hook-adapter-shared.cjs` (the five lines from `async function readStdin() {` through its closing brace) with this block. The probe in `scratch/probe/readstdin-candidate.cjs` runs this exact code: a never-closed pipe resolved at 3001 ms with the bytes written, the process exited with status 0 and no signal, a complete payload came back identical, and an empty closed stdin resolved to an empty string.

```js
// A host that never closes stdin would otherwise hold the hook until the host's
// own timeout kills it, so the read settles on whichever comes first: the end of
// the stream, or the deadline with whatever has arrived by then.
function readStdin({ timeoutMs = 3000 } = {}) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let settled = false;
    let timer = null;

    const onData = (chunk) => chunks.push(chunk);
    const onEnd = () => {
      if (settled) return;
      settled = true;
      release();
      resolve(Buffer.concat(chunks).toString('utf8'));
    };
    const onError = (error) => {
      if (settled) return;
      settled = true;
      release();
      reject(error);
    };
    const release = () => {
      clearTimeout(timer);
      process.stdin.removeListener('data', onData);
      process.stdin.removeListener('end', onEnd);
      process.stdin.removeListener('error', onError);
      process.stdin.pause();
    };

    timer = setTimeout(onEnd, timeoutMs);
    process.stdin.on('data', onData);
    process.stdin.on('end', onEnd);
    process.stdin.on('error', onError);
  });
}
```

The module keeps its `'use strict';` line, its header comment, `parseJsonFailOpen` and `module.exports = { readStdin, parseJsonFailOpen };`. The helper keeps zero `require` calls.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Phase 1 records the baseline, Phase 2 makes one edit per task, and Phase 3 runs one verification per requirement and success criterion.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### New suite: `.skilled/hooks/shared/hook-adapter-shared.test.cjs`

Written in the style of `hook-flags.test.cjs`: `node:test`, `node:assert/strict`, no temporary directories, no dependencies.

- **Case A, name contains `never-closed`**: spawn `process.execPath` with `['-e', SCRIPT, HELPER_PATH]`, where `SCRIPT` requires `process.argv[1]`, records `Date.now()`, calls `readStdin()`, and writes `JSON.stringify({ text, elapsedMs })` to stdout. Write `{"tool_name":"Write"` to the child's stdin and do not call `end()`. Arm a SIGKILL timer at 13000 ms. On `close`, assert `signal` is `null`, `code` is `0`, `text` equals the bytes written, and `elapsedMs` is at least 2950 and below 4500.
- **Case B, name contains `comes back whole`**: `spawnSync` the same script with `input` set to a complete JSON payload. Assert `status` is `0`, `text` equals the input, and `elapsedMs` is below 3000.

Run it with `node --test .skilled/hooks/shared/hook-adapter-shared.test.cjs`.

### Existing suites that touch these files (baseline recorded in `scratch/baseline/`)

- `node --test .skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs .skilled/hooks/shared/hook-flags.test.cjs .skilled/plugins/tests/sk-code-post-edit-quality.test.cjs` reports `ℹ tests 66`, `ℹ pass 66`, `ℹ fail 0` on the unchanged tree, exit 0. The plugin suite spawns the Claude and Codex post-edit adapters directly.
- `bash .skilled/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.test.sh` prints `Post-edit adapter parse regression fixture passed`, exit 0.

### Syntax

`node --check` on the five touched `.cjs` files, and on the new test file.

### Adapter-level exit

Spawn `post-edit-quality/devin/post-edit-quality.cjs` with a pipe that stays open, write `{"tool_name":"Read"}`, and record the exit. Baseline: the child runs until the 10000 ms kill timer. After the change: it exits with status 0 and no signal at about 3000 ms, and the `Read` payload returns at the tool-name check without any advisory.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- No dependency outside `.skilled/hooks/`. The helper imports nothing (REQ-005).
- Follow-ups, not in this phase:
  - The ESM sibling `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs`. It stays unchanged. The `system-spec-kit/runtime/hooks/lib/README.md` describes it, and it needs the same deadline in its own change.
  - Fourteen files under `.skilled/hooks/` still hold an unbounded stdin reader. They are `classifier-injection-screen/{claude,devin}/classifier-injection-screen-posttooluse.mjs`, `dispatch/{claude,codex,cursor,devin}/dispatch-preflight-lint.mjs`, `dispatch/{claude,codex,devin}/dispatch-audit-posttooluse.mjs`, `goal/{cursor,devin}/goal-inject.mjs`, `mcp-route-guard/cursor/mcp-route-guard.mjs`, `task-dispatch/cursor/task-dispatch-guard.mjs`, and `task-dispatch/claude/fable-subagent-guard.mjs`. The last one reads synchronously, so a deadline needs a different approach there.
  - The `system-spec-kit/runtime/hooks/` readers. Grep `process.stdin\|function readStdin` in that folder to list them. The grep matches 14 files, including the ESM sibling.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The scaffold this phase edits is untracked, so the rollback does not rely on git. Before any edit, copy the six files from `scratch/before/` back over their original paths, keeping the relative paths: the helper, the shared README, the three post-edit adapters and the ESM sibling. Then delete `.skilled/hooks/shared/hook-adapter-shared.test.cjs` with a single-file `rm`. Rerun the baseline commands in `tasks.md` Phase 1; their counts must match `scratch/baseline/`.
<!-- /ANCHOR:rollback -->

---
