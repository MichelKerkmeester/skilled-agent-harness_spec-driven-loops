---
title: "PI-022 -- Git preflight advisory delivery"
description: "This scenario validates the sk-git preflight advisory delivery across Pi's paired tool_call and tool_result events for `PI-022`."
version: 1.0.0.1
---

# PI-022 -- Git preflight advisory delivery

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-022`.

---

## 1. OVERVIEW

This scenario validates the sk-git preflight advisory delivery under Pi for `PI-022`. The extension evaluates the command at `tool_call`, then attaches the advisory to the matching `tool_result` by `toolCallId`.

The shared sk-git checks emit `⚠ sk-git advisory` and remain advisory-only. `.pi/extensions/git-preflight-advisory.ts` registers both `pi.on("tool_call")` and `pi.on("tool_result")`; the first stores the advisory by call ID and the second appends it to the matching result. Any import or evaluation error is caught and returns `undefined` (fail open).

### Why This Matters

Pi runs shell commands through the `bash` tool event. A directory-scoped `git commit --only <dir>` silently excludes untracked files inside the directory and reports success by count. Without the advisory, the operator learns the omission only after the damage. This scenario proves the warning reaches the model-visible tool result without blocking the command.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `PI-022` and confirm the expected signals without contradictory evidence.

- Objective: Verify the sk-git advisory fires on a directory-scoped commit with an untracked file inside, is attached to the matching tool result by `toolCallId`, stays silent on an ordinary commit, is suppressible, and fails open.
- Real user request: `Commit the src folder for me` while `src/` holds one modified tracked file and one untracked file.
- Prompt: `As a git safety reviewer, run the sk-git preflight advisory under the Pi git-preflight-advisory extension against a directory-scoped commit that would silently drop an untracked file. Verify the advisory names commit-scope-drops-untracked, is attached to the matching tool result with no block property, is silenced by SKGIT_ADVISORY=0, and that an extension error returns undefined. Return the advisory text and a PASS/FAIL verdict.`
- Expected execution process: Confirm the extension exists under `.pi/extensions/` -> in-process, import the extension, register both handlers, invoke `tool_call` and `tool_result` with the same `toolCallId` against a scratch repo -> inspect result content naming `commit-scope-drops-untracked` -> repeat with `SKGIT_ADVISORY=0` and confirm `undefined` -> run an ordinary command and confirm `undefined`.
- Expected signals: `tool_call` returns `undefined`; the matching `tool_result` contains text with `⚠ sk-git advisory` and `[commit-scope-drops-untracked]` and has no `block` property; the suppressed and ordinary runs return `undefined`.
- Desired user-visible outcome: A concise PASS verdict with the advisory text and silence evidence.
- Pass/fail: PASS when the matching result contains `commit-scope-drops-untracked`, has no `block` property, and suppression returns `undefined`. FAIL if the handler blocks or no advisory appears on the trap shape.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm `.pi/extensions/git-preflight-advisory.ts` exists and registers both handlers.
3. Create a disposable scratch repo with hooks detached and copy the checked-in extension plus its shared modules into the disposable Pi layout so relative imports resolve.
4. In-process: import the disposable extension, capture both handlers, invoke `tool_call` and then `tool_result` with the same `toolCallId` against the scratch repo.
5. Repeat with `SKGIT_ADVISORY=0` and confirm the result handler returns `undefined`.
6. Run an ordinary command with a fresh call ID and confirm no advisory result is returned.
7. Return a concise user-facing verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-022 | Git preflight advisory delivery | Verify the sk-git advisory reaches the matching Pi tool result without blocking | `As a git safety reviewer, run the sk-git preflight advisory under the Pi git-preflight-advisory extension against a directory-scoped commit that would silently drop an untracked file. Verify the advisory names commit-scope-drops-untracked, is attached to the matching tool result with no block property, is silenced by SKGIT_ADVISORY=0, and that an extension error returns undefined. Return the advisory text and a PASS/FAIL verdict.` | 1. `test -f .pi/extensions/git-preflight-advisory.ts && rg -n -e 'tool_call' -e 'tool_result' .pi/extensions/git-preflight-advisory.ts` -> 2. `repo=$(mktemp -d /private/tmp/pi-022.XXXXXX) && git -C "$repo" init -q && git -C "$repo" config core.hooksPath "$repo/.no-hooks" && git -C "$repo" config user.email t@example.invalid && git -C "$repo" config user.name T && git -C "$repo" config commit.gpgsign false && mkdir -p "$repo/.pi/extensions" "$repo/.opencode/hooks/dispatch/lib" "$repo/.opencode/skills/sk-git/scripts/lib" "$repo/.opencode/skills/sk-git" "$repo/src" && cp .opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts "$repo/.pi/extensions/git-preflight-advisory.ts" && cp .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs "$repo/.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs" && cp .opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs "$repo/.opencode/skills/sk-git/scripts/lib/git-rule-checks.mjs" && cp .opencode/skills/sk-git/scripts/lib/git-context.mjs "$repo/.opencode/skills/sk-git/scripts/lib/git-context.mjs" && cp .opencode/skills/sk-git/SKILL.md "$repo/.opencode/skills/sk-git/SKILL.md" && printf 'seed\n' > "$repo/src/tracked.txt" && git -C "$repo" add src/tracked.txt && git -C "$repo" commit -q -m 'chore(test): seed fixture' && printf 'mod\n' > "$repo/src/tracked.txt" && printf 'untracked\n' > "$repo/src/untracked.txt"` -> 3. `PI_TEST_REPO="$repo" node --no-warnings --input-type=module -e 'import extension from "./.pi/extensions/git-preflight-advisory.ts"; const handlers = new Map(); extension({ on: (name, fn) => handlers.set(name, fn) }); const toolCallId = "pi-022-call"; const event = { toolName: "bash", toolCallId, input: { command: "git commit --only src -m x" } }; const call = await handlers.get("tool_call")(event, { cwd: process.env.PI_TEST_REPO }); const result = await handlers.get("tool_result")({ toolCallId, content: [], details: {}, isError: false }); const text = result?.content?.map((item) => item.type === "text" ? item.text : "").join("\\n") ?? ""; if (call !== undefined || !text.includes("[commit-scope-drops-untracked]") || Object.prototype.hasOwnProperty.call(result ?? {}, "block")) process.exit(1); console.log(JSON.stringify({ call, result }));'` -> 4. Repeat Step 3 with `SKGIT_ADVISORY=0` and a fresh call ID; assert the result is `undefined` -> 5. Repeat Step 3 with `git status --short` and a fresh call ID; assert the result is `undefined` | `tool_call` returns `undefined`; the matching result contains `⚠ sk-git advisory` and `[commit-scope-drops-untracked]` with no `block` property; suppressed and ordinary probes return `undefined` | Extension source excerpt and captured paired-event probe output | PASS when the matching result contains the rule ID, has no `block` property, and suppression returns `undefined`; FAIL if the handler blocks or no advisory appears on the trap shape | Inspect the paired-event return; if absent, confirm both handlers are registered, the same `toolCallId` is used, relative imports resolve, and `ctx.cwd` points at the scratch repo |

### Optional Supplemental Checks

- Repeat Step 3 with `SKGIT_ADVISORY_SKIP=commit-scope-drops-untracked` and confirm the single-rule suppression tier also returns `undefined`.
- Invoke the handler with a non-git command and confirm it returns `undefined` (the `GIT_SHAPE` gate stops before evaluation).

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `git-preflight-advisory/git-preflight-advisory.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/extensions/git-preflight-advisory.ts` | The Pi extension: paired `tool_call` and `tool_result` handlers, keyed by `toolCallId`, with fail-open catches |
| `.opencode/skills/sk-git/scripts/hooks/pi/git-preflight-advisory.ts` | Checked-in extension source copied into the disposable Pi layout for the paired-event probe |
| `../../../../../skills/sk-git/scripts/lib/git-rule-checks.mjs` | Shared `GIT_SHAPE`, `GIT_CHECKS` the extension dynamic-imports |
| `../../../../../skills/sk-git/scripts/lib/git-context.mjs` | Shared `createGitContext` the extension dynamic-imports |
| `../../../../../hooks/dispatch/lib/dispatch-rule-checks.mjs` | Shared `readHardRules` + `evaluate` the extension dynamic-imports |
| `../../../../../skills/sk-git/SKILL.md` | The `hard_rules:` frontmatter used by the shared checks |
| `../../../../../skills/sk-git/scripts/hooks/README.md` | Runtime matrix, suppression tiers, fail-open guarantees |

---

## 5. SOURCE METADATA

- Group: Git Preflight Advisory
- Playbook ID: PI-022
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `git-preflight-advisory/git-preflight-advisory.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
