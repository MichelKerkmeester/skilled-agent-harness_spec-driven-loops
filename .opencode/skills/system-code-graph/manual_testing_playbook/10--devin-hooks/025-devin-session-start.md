---
title: "DH-001 Devin CLI SessionStart Hook"
description: "Manual validation for the Devin CLI session-start hook that emits the kind=startup structural-context payload."
trigger_phrases:
  - "dh-001"
  - "devin cli sessionstart hook"
  - "devin sessionstart"
  - "devin session start"
  - "mk-code-index devin"
---

# DH-001 Devin CLI SessionStart Hook

<!-- sk-doc-template: manual_testing_playbook -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

Validate the Devin CLI `SessionStart` hook reads `.opencode/skills/system-code-graph/mcp_server/database/.code-graph-readiness.json`, emits the canonical `kind=startup` payload with `provenance` + `sectionKeys=["structural-context"]`, and fails open on errors.

Per ADR-001 of packet 036-cli-devin-code-graph-hook the hook source lives at `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/session-start.ts` (intentional asymmetry vs the advisor pattern — see ADR-001 rationale). Compiled output lands at `.opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js`; `.devin/hooks.v1.json` registers that path. No shim layer for SessionStart — the compiled hook is invoked directly by Devin.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-scenario-contract -->
## 2. SCENARIO CONTRACT

- `devin` binary installed + authenticated.
- system-spec-kit MCP server build current; `dist/system-spec-kit/mcp_server/hooks/devin/session-start.js` exists.
- `SPECKIT_CODE_GRAPH_DEVIN_HOOK_DISABLED` (and any sibling disable env vars) are unset.
- `.devin/hooks.v1.json` contains a `SessionStart` entry pointing at the compiled hook path.
- `.opencode/skills/system-code-graph/mcp_server/database/.code-graph-readiness.json` exists and is parseable (may be fresh, stale, empty, or error — hook handles each).
- Self-invocation guard satisfied (no `DEVIN_*` env, no `devin` in process ancestry).

---

<!-- /ANCHOR:2-scenario-contract -->

<!-- ANCHOR:3-test-execution -->
## 3. TEST EXECUTION

1. Verify dist artifact exists:

```bash
ls .opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js
```

2. Verify `.devin/hooks.v1.json` registration:

```bash
jq '.SessionStart[0].hooks[0].command' .devin/hooks.v1.json
```

Expect a string containing `system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js`.

3. Smoke-test each `source` value (startup, resume, clear, compact):

```bash
mkdir -p /tmp/devin-session-playbook
for SRC in startup resume clear compact; do
  printf '%s' "{\"source\":\"$SRC\",\"session_id\":\"dh-001-$SRC\",\"cwd\":\"$PWD\"}" \
    | node .opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js \
    > "/tmp/devin-session-playbook/dh-001-$SRC.stdout.json" 2> "/tmp/devin-session-playbook/dh-001-$SRC.stderr"
  echo "Source=$SRC Exit=$?"
done
```

4. Fail-open test with malformed stdin:

```bash
printf '%s' 'not-json' \
  | node .opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js \
  > /tmp/devin-session-playbook/dh-001-malformed.stdout.json 2> /tmp/devin-session-playbook/dh-001-malformed.stderr
echo "Exit: $?"
```

5. Env-var disable test:

```bash
SPECKIT_CODE_GRAPH_DEVIN_HOOK_DISABLED=1 \
  printf '%s' '{"source":"startup","session_id":"dh-001-disabled","cwd":"'"$PWD"'"}' \
  | node .opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js \
  > /tmp/devin-session-playbook/dh-001-disabled.stdout.json 2> /tmp/devin-session-playbook/dh-001-disabled.stderr
echo "Exit: $?"
```

6. Live Devin TUI verification (optional, manual):

```bash
devin --permission-mode auto
# Inside Devin TUI:
#   /hooks
# Expect: SessionStart entry loaded from .devin/hooks.v1.json
# At session start: observe ## Session Context block in the model's preamble
```

7. Stale code-graph state probe (optional — induces stale readiness marker):

```bash
# Make a tracked file change without reindexing
echo "// dh-001 probe" >> .opencode/skills/system-code-graph/SKILL.md
printf '%s' '{"source":"startup","session_id":"dh-001-stale","cwd":"'"$PWD"'"}' \
  | node .opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js \
  > /tmp/devin-session-playbook/dh-001-stale.stdout.json
git checkout -- .opencode/skills/system-code-graph/SKILL.md
```

### Scenario Row

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DH-001 | Devin SessionStart hook | Confirm Devin session-start hook emits kind=startup payload across all source values, fails open on malformed input, and respects the disable env var | `Role: Devin operator. Context: Devin CLI installed and authenticated, .devin/hooks.v1.json SessionStart registered, code graph readiness marker present. Action: pipe payloads with source=startup|resume|clear|compact|malformed plus a disable-flag variant through the compiled hook and inspect stdout/stderr. Format: PASS or FAIL per payload with payload shape, fail-open behavior, and disable-flag handling.` | 1. `bash: ls <hook dist path>` -> 2. `bash: jq '.SessionStart[0].hooks[0].command' .devin/hooks.v1.json` -> 3. for-loop over 4 sources piping JSON into compiled hook -> 4. Malformed stdin run -> 5. Disable-env-var run -> (optional) 6. Stale readiness probe | Exit 0 in all runs; source=startup|resume|compact emits `hookSpecificOutput.additionalContext` with `## Session Context`; source=clear may emit `{}` or a startup payload (clear handling is design-defined); malformed run emits `{}`; disable run emits `{}` with stderr `status: "fail_open"` and `message: "hook disabled via env var"`; stale state emits an advisory marker in the additionalContext | Captured stdout/stderr per source variant, exit codes, `.devin/hooks.v1.json` jq output | PASS if (a) all 6 runs exit 0, (b) startup/resume/compact emit `hookSpecificOutput.additionalContext` containing the structural-context block, (c) malformed + disabled runs emit `{}`, (d) registration cites the canonical compiled-hook path; FAIL otherwise | 1. Verify hook dist artifact exists (rebuild spec-kit MCP if missing); 2. Inspect `.code-graph-readiness.json` for parse errors; 3. Run `code_graph_status` MCP tool; 4. Check `read_config_from.claude` for double-fire; 5. Confirm `SPECKIT_CODE_GRAPH_DEVIN_HOOK_DISABLED` unset for non-disable runs |

### Expected Signals

- All variants exit `0`.
- Startup / resume / compact source outputs: parseable JSON with `hookSpecificOutput.hookEventName == "SessionStart"` and `hookSpecificOutput.additionalContext` containing the markdown `## Session Context` block. Internally the brief carries the `kind=startup` provenance contract: `provenance.{producer: "startup_brief", sourceSurface: "startup", trustState, generatedAt, lastUpdated, sourceRefs: ["code-graph-readiness-marker"]}`, `sectionKeys: ["structural-context"]`.
- Clear source: implementation-defined (may emit a startup payload with `Clear` recovery hints, or `{}`).
- Malformed stdin: literal `{}`, exit 0 (fail-open). Stderr diagnostic JSONL contains `runtime: "devin"`, `status: "fail_open"`.
- Disabled (env var set): literal `{}`, exit 0. Stderr diagnostic carries `status: "fail_open"`, `source: "disabled"`, `message: "hook disabled via env var"`.
- Stale state: additionalContext contains a stale-state advisory (e.g. recommends running `code_graph_scan`).

### Failure Modes

| Symptom | Detection | Action |
| --- | --- | --- |
| Hook dist missing | `ls` returns "No such file" | Run `cd .opencode/skills/system-spec-kit/mcp_server && npx tsc` and re-verify. |
| `kind=startup` block absent | jq stdout for `hookSpecificOutput.additionalContext`; assert contains `## Session Context` | Inspect compiled hook's `buildStartupBrief()` call site; check `getStartupBriefFromMarker()` resolution. |
| Devin double-fires SessionStart | `/hooks` shows two SessionStart entries (one from `.devin/hooks.v1.json`, one inherited from `.claude/settings.local.json`) | Disable `read_config_from.claude` OR verify Devin dedup; document in ADR follow-on if needed. |
| Disable env var ignored | Disabled run emits non-empty additionalContext | Inspect env-var precedence in hook source; check disable check order vs main brief assembly. |
| Stale readiness causes hard fail | Compiled hook exits non-zero on stale `.code-graph-readiness.json` | Hook should fail-open; inspect try/catch boundary. |
| Self-invocation guard fires | `DEVIN_*` env present | Run from a clean non-Devin shell. |

---

<!-- /ANCHOR:3-test-execution -->

<!-- ANCHOR:4-source-files -->
## 4. SOURCE FILES

- `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/session-start.ts` (Devin hook implementation)
- `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts` (`buildStartupBrief()` + `writeCodeGraphReadinessMarker()`)
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-boundary.ts` (`getStartupBriefFromMarker()`)
- `.opencode/skills/system-code-graph/mcp_server/database/.code-graph-readiness.json` (readiness marker; runtime state)
- `.devin/hooks.v1.json` (registration)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/036-cli-devin-code-graph-hook/decision-record.md` (ADR-001 hook-source-location, ADR-002 naming asymmetry)

---

<!-- /ANCHOR:4-source-files -->

<!-- ANCHOR:5-source-metadata -->
## 5. SOURCE METADATA

- Group: Devin Hooks
- Playbook ID: DH-001
- Canonical root source: manual_testing_playbook.md
- Feature file path: 10--devin-hooks/025-devin-session-start.md

<!-- /ANCHOR:5-source-metadata -->
