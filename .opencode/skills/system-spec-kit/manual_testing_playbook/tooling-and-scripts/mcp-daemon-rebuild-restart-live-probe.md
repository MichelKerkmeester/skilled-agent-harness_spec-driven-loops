---
title: "278 -- MCP daemon rebuild, restart, and live-probe protocol"
description: "This scenario validates the canonical 4-part rebuild + restart + live-probe contract for MCP TypeScript fixes. Source diff -> targeted vitest -> dist marker check + restart -> live MCP probe. Codifies the phantom-fix prevention loop."
version: 3.6.0.11
---

# 278 -- MCP daemon rebuild, restart, and live-probe protocol

## 1. OVERVIEW

This scenario validates the canonical rebuild + restart + live-probe contract. It focuses on confirming a TypeScript fix in `mcp_server/` is actually live in the running daemon, not just compiled to `dist/` or only passing in vitest. The contract codifies the v1.0.2 phantom-fix lesson where a fix passed targeted tests but the daemon kept serving stale code because the runtime had not been restarted.

---

## 2. SCENARIO CONTRACT


- Objective: Verify a representative MCP TypeScript fix passes the 4-part contract end-to-end: source diff captured, targeted vitest pass, `dist/` marker grep finds the new code, runtime restarted by the appropriate per-client procedure, and a live MCP probe returns the new contract field/behavior.
- Real user request: `` Please validate MCP daemon rebuild, restart, and live-probe protocol against a representative TypeScript fix and tell me whether the expected signals are present: Step 1: `git diff mcp_server/` shows the expected file paths for the change; Step 2: `cd mcp_server && npx vitest run <suite>` exits 0; Step 3: `npm run build && grep -l <new-marker> mcp_server/dist/<file>.js` returns 1 hit AND `dist/` mtime > source mtime; Step 4: per-client runtime restart completes (output confirms reload, not a silent no-op); Step 5: live MCP probe (per `live-probe-template.md`) returns the new contract field/behavior, not the pre-fix shape. ``
- Prompt: `Validate the canonical MCP daemon rebuild + restart + live-probe contract against a representative TypeScript fix and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Step 1: `git diff mcp_server/` shows the expected file paths for the change; Step 2: `cd mcp_server && npx vitest run <suite>` exits 0; Step 3: `npm run build && grep -l <new-marker> mcp_server/dist/<file>.js` returns 1 hit AND `dist/` mtime > source mtime; Step 4: per-client runtime restart completes (output confirms reload, not a silent no-op); Step 5: live MCP probe (per `live-probe-template.md`) returns the new contract field/behavior, not the pre-fix shape
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: all 4 parts verified in order; live probe returns post-fix payload; FAIL: any part skipped, dist marker missing despite vitest pass (means stale dist), or live probe still returns pre-fix payload (means stale daemon)

---

## 3. TEST EXECUTION

### Prompt

```
Validate the canonical MCP daemon rebuild + restart + live-probe contract against a representative TypeScript fix and report cited pass/fail evidence.
```

### Commands

1. `git diff mcp_server/ > /tmp/278-source-diff.txt && wc -l /tmp/278-source-diff.txt` — confirm source diff non-empty and on expected paths
2. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run <suite> 2>&1 | tee /tmp/278-vitest.txt` — confirm exit 0
3. `cd .opencode/skills/system-spec-kit/mcp_server && npm run build && grep -l "<new-marker>" dist/<file>.js && stat -f "%m" dist/<file>.js src/<file>.ts` — confirm marker present and dist mtime > source mtime
4. Restart the MCP-owning runtime per `references/mcp-rebuild-restart-protocol.md` (OpenCode: reload tools; Claude Code: restart binary; OpenCode: restart binary)
5. Issue the live MCP probe per `references/live-probe-template.md` for the affected subsystem (`memory_context`, `memory_search`, `code_graph_query`, or `memory_causal_stats`) and assert the post-fix contract field is present

### Expected

Source diff non-empty on expected paths; targeted vitest exits 0; `dist/` carries the new marker and is newer than source; runtime restart confirmed; live probe returns post-fix payload (e.g. new envelope field, new helper output, or new routing decision).

### Evidence

BLOCKED before command execution.

Observed scenario file content:

```text
38: 1. `git diff mcp_server/ > /tmp/278-source-diff.txt && wc -l /tmp/278-source-diff.txt` — confirm source diff non-empty and on expected paths
39: 2. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run <suite> 2>&1 | tee /tmp/278-vitest.txt` — confirm exit 0
40: 3. `cd .opencode/skills/system-spec-kit/mcp_server && npm run build && grep -l "<new-marker>" dist/<file>.js && stat -f "%m" dist/<file>.js src/<file>.ts` — confirm marker present and dist mtime > source mtime
41: 4. Restart the MCP-owning runtime per `references/mcp-rebuild-restart-protocol.md` (OpenCode: reload tools; Claude Code: restart binary; OpenCode: restart binary)
42: 5. Issue the live MCP probe per `references/live-probe-template.md` for the affected subsystem (`memory_context`, `memory_search`, `code_graph_query`, or `memory_causal_stats`) and assert the post-fix contract field is present
```

Blocking constraints from the execution request:

```text
Do NOT modify, create, or delete any file OTHER than the single scenario file named below.
ALLOWED WRITE PATHS
- .opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/mcp-daemon-rebuild-restart-live-probe.md (this file only)
```

Commands 1 and 2 require creating `/tmp/278-source-diff.txt` and `/tmp/278-vitest.txt`, which are outside the only allowed write path. Command 2 also leaves `<suite>` unresolved, and command 3 leaves `<new-marker>`, `dist/<file>.js`, and `src/<file>.ts` unresolved. The scenario does not name the representative TypeScript fix, affected file, marker, vitest suite, runtime restart command, or exact live probe payload to execute.

### Pass / Fail

- **BLOCKED**: commands require writes outside the only allowed write path (`/tmp/278-source-diff.txt`, `/tmp/278-vitest.txt`) and contain unresolved placeholders (`<suite>`, `<new-marker>`, `dist/<file>.js`, `src/<file>.ts`) for the representative TypeScript fix.

### Failure Triage

If dist marker missing: re-run `npm run build`, check `tsc -b` errors. If marker present but live probe pre-fix: confirm runtime restart actually happened (some IDEs cache the MCP daemon process). If live probe still pre-fix after confirmed restart: check whether multiple `mcp_server/dist/` copies exist on the search path (workspace cache, plugin folder, etc.) and which one the runtime is actually loading.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Reference (canonical contract): `<spec-folder>`
- Reference (probe queries): `<spec-folder>`
- Reference (grep patterns): `<spec-folder>`
- Reference (verification checklist): `<spec-folder>`
- Sibling: [setup-native-module-health-and-mcp-installation.md](./setup-native-module-health-and-mcp-installation.md) (covers prerequisites and installer; this entry covers the post-fix verification loop)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 278
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling-and-scripts/mcp-daemon-rebuild-restart-live-probe.md`
