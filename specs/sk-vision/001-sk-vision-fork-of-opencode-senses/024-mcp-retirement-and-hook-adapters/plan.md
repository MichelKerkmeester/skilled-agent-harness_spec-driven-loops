---
title: "Implementation Plan: Retire the sk-vision MCP transport and give Cursor and Devin native hook adapters"
description: "Build the two host hook adapters first, prove them live, then delete the MCP transport and realign every doc that described it."
trigger_phrases:
  - "sk-vision MCP retirement plan"
  - "sk-vision hook adapter plan"
  - "vision without MCP plan"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Retire the sk-vision MCP transport and give Cursor and Devin native hook adapters

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Build before deleting. The MCP transport is dead but it is still the only thing the docs point Cursor and Devin at, so removing it first would leave a window where the answer to "how does Devin see an image" is nothing at all.

The order is therefore: adapters, live proof, deletion, documentation. Each stage ends at a checkpoint that can be inspected, and stage three is the only irreversible one.

The work reuses what exists. The thirteen-tool registry, `PhotonProvider`, `RuntimeClient` and the Python runtime are untouched. The adapters are new callers of the same core, shaped after the goal hook adapters that already run on both hosts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command | Pass condition |
|------|---------|----------------|
| Baseline captured | `bun test` and `bunx tsc --noEmit` in `vision-runtime`, before any change | Counts recorded, output and exit status read |
| Package clean | `bunx tsc --noEmit` | No error, and no import of the MCP SDK survives |
| Build shape | `bun run scripts/build.ts` then list `dist/` | `plugin.js` and `python/runtime.py` present, `mcp-server.js` absent |
| Adapter tests | `bun test` over the two new test files | Both green, fail-open paths asserted |
| Residue sweep | `rg -n 'sk-vision-mcp\|mcp-server\.js\|mcp__sk-vision__' --glob '!specs/**'` | No hits |
| Packet gate | `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` | `RESULT: PASSED` printed, not merely a zero exit |

The packet gate is the authoritative final check. A zero exit with no `RESULT: PASSED` line does not count.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Before

Two attach models. OpenCode and Pi load skill-owned adapter source in-process. Cursor and Devin launch one shared MCP stdio server that re-exposes the same registry over a second transport, with its own dependency, bundle step, lifecycle guards and process-teardown problem.

### After

One attach model, four hosts. Every host loads skill-owned adapter source through its own extension point, and the skill owns the source for all four.

| Host | Extension point | Event |
|------|-----------------|-------|
| OpenCode | plugin | `command.execute.before` |
| Pi | extension | hidden tool driven by the `/vision` prompt |
| Cursor | `hooks.json` | `beforeSubmitPrompt` |
| Devin | `hooks.v1.json` | `UserPromptSubmit` |

### Why a hook and not a CLI

A CLI would also have worked, and both hosts can run `node`. It was rejected because it introduces a surface this repo does not otherwise have: a new invocation contract, a new argument grammar and a new failure mode when the model forgets to call it. The hook adapters extend a pattern already carrying the spec-gate question and the advisor brief on both hosts, which is the cheaper move on the reversal-cost order and the one that fails closed into an existing, tested shape.

The hook is also strictly stronger than what it replaces. The MCP rules could only ask a model to call a tool and admitted in their own text that nothing could compel it. A prompt-time hook runs the analysis and injects the result, so the evidence is there whether or not the model would have asked.

### Injection channel

Both events are model-context channels in the shared injection contract. Cursor returns `{"permission":"allow","agent_message":...}` and Devin returns `{"hookSpecificOutput":{"additionalContext":...}}`. Neither renders as visible chat, which matches how the spec-gate question and the advisor brief already behave on these hosts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Stage 1: Adapters

Write `hooks/cursor/sk-vision.mjs` and `hooks/devin/sk-vision.mjs` against the goal-adapter shape: read stdin, fail open on any parse error, honor the kill-switch, resolve the workspace root from the payload, detect an image path in the submitted prompt, run the analysis, inject, tear down in a `finally`. Add a unit test beside each. Register both in the host config files and mirror them into the shared hook hub.

Checkpoint: both test files green, both hosts start without error, nothing deleted yet.

### Stage 2: Live proof

Run a real Cursor session and a real Devin session, each with a prompt naming an image path. Confirm the evidence block reaches the model and that the model answers from it rather than from the filename.

Checkpoint: REQ-004 and REQ-005 satisfied with observed output, or the negative result escalated. A failure here reopens the scope question and does not proceed to stage 3.

### Stage 3: Deletion

Replace `.devin/mcp_config.json` with a Devin-owned file carrying only `code_mode`, and assert Code Mode survives. Then delete the server, its test, the bin entry, the `mcp` script, the SDK dependency, the build step, both skill-owned configs and both mirror symlinks. Rebuild and rerun the whole gate.

Checkpoint: residue sweep clean, package green, `dist/` has no MCP output.

### Stage 4: Documentation and dead registrations

Realign `SKILL.md`, both READMEs, the feature catalog and the playbook. Add the injection-contract row and the kill-switch entry. Clear the four dead system-skill MCP registrations.

Checkpoint: packet gate prints `RESULT: PASSED`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The coverage floor is the happy path plus one edge case per new public surface, which here means each adapter.

- **Happy path**: a payload naming an image path yields an injected evidence block on the host's own envelope shape.
- **Edge case**: a malformed or absent payload, and a payload with no image path, both yield a plain allow with no injection and no runtime spawn.
- **Negative control**: before writing the Cursor adapter, confirm the current Cursor session produces no vision evidence for an image-bearing prompt. That is the exact symptom the adapter has to change, and it is what makes the after-state proof mean something.

No test is added for the code being deleted. The proof that deletion worked is the residue sweep and the build shape, not a new assertion.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Direction | Note |
|------------|-----------|------|
| `vision-runtime` tool registry and providers | Consumed | Unchanged; the adapters are new callers |
| `.opencode/hooks/goal/{cursor,devin}/goal-inject.mjs` | Pattern source | Envelope shapes, fail-open discipline, kill-switch handling |
| `.opencode/hooks/injection-contract.md` | Contract | Records what each host channel delivers and to whom |
| `@modelcontextprotocol/sdk` | Removed | The only consumer is the file being deleted |
| Devin `code_mode` registration | Must survive | Currently riding in a file this packet deletes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

**To undo this: `git revert` the packet's commits, then run `bun run scripts/build.ts` in `vision-runtime` to restore `dist/mcp-server.js`.**

Every change is a tracked-file edit or deletion, which puts the whole packet in the trivially reversible tier. Two items need care beyond the revert:

- `.devin/mcp_config.json` changes from a symlink to a real file. A revert restores the symlink, but confirm the target exists afterwards.
- `dist/` is gitignored, so the revert restores the build step but not the artifact. Rebuild.

Stage 3 is the only stage that removes anything, and it does not start until stage 2 has proven the replacement works.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:ai-execution -->
## 8. AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read `spec.md`, this plan and `tasks.md` before the first edit
- [ ] Capture the `vision-runtime` baseline, and rebuild `dist/` first so the baseline reflects source
- [ ] Record the negative control on both hosts before writing either adapter
- [ ] Know the verification command for the task before starting it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| STAGE-ORDER | Stages run in order. Deletion never starts before the live proof in stage 2 passes |
| TASK-SCOPE | Touch only the files the task names; report anything else as a finding |
| TASK-VERIFY | Run the task's verification before marking it complete |
| PROOF-READ | A command counts only once its output and exit status have been read |
| GATE-MARKER | The packet gate passes on a printed `RESULT: PASSED`, never on a zero exit alone |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] - one line of evidence`

### Blocked Task Protocol
1. Mark the task BLOCKED with the blocking fact
2. Record the fact in the `tasks.md` blocked section
3. Continue with the next unblocked task; escalate after two blocked tasks
4. A failure at T012 or T013 is not a blocked task. It halts the packet and reopens the scope question, because the replacement the deletion depends on does not exist
<!-- /ANCHOR:ai-execution -->
