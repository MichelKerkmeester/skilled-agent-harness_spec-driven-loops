---
title: "PHASE-008 -- Spec-folder literal naming (CLI-driven slug proposal)"
description: "Verify that external CLI agents presented with an ambiguous spec task propose phase names containing specific subject tokens, not generic placeholders, per the YAML 'Generate LITERAL phase names' activity in Packet 012 REQ-001 and REQ-002."
---

# PHASE-008 -- Spec-folder literal naming (CLI-driven slug proposal)

## 1. OVERVIEW

Packet 012 REQ-001 and REQ-002 rewrote the `Generate phase names` activity in all four `spec_kit_plan_auto.yaml`, `spec_kit_plan_confirm.yaml`, `spec_kit_complete_auto.yaml`, and `spec_kit_complete_confirm.yaml` workflow files. The new text requires AI agents to produce literal slugs that name the concrete component or behavior being changed, not generic placeholders like `phase-1`, `remediation` or `cleanup`.

This scenario routes the same ambiguous spec task through multiple external CLI agents and checks whether each agent's proposed phase names honor that instruction. A CLI agent that still produces bare stoplist slugs signals either a broken MCP wiring (YAML not surfaced) or insufficient instruction weight.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm external CLI agents produce phase slugs with specific subject tokens when the `Generate LITERAL phase names` YAML activity is active.
- Real user request: `An operator gives a deliberately ambiguous task to an external CLI agent that should trigger /spec_kit:plan phase decomposition. Verify the AI proposes phase names with specific subject tokens, NOT generic placeholders.`
- Prompt: See the canonical test prompt in §3.
- Expected execution process: Rotate the canonical test prompt through at least 3 of the 5 supported CLIs; collect JSON responses; verify each proposed slug contains a specific subject token and is absent from the stoplist.
- Expected signals: Each returned slug names a concrete component or behavior (`singleton-leak`, `thread-local-cache`, `session-teardown`, `launcher-uptime-fix`, etc.); no slug matches the generic stoplist (`phase-1`, `phase-2`, `phase-3`, `cleanup`, `remediation`, `fix`, `refactor`, `setup`); the rationale field explicitly identifies the subject token.
- Desired user-visible outcome: A per-CLI verdict table with slug values and PASS/PARTIAL/FAIL per CLI plus an aggregate verdict.
- Pass/fail: PASS if all 3 returned slugs contain a specific subject token and none match the stoplist. PARTIAL if exactly 2 of 3 slugs pass. FAIL if 2 or more slugs match the stoplist or none contain a specific subject token.

---

## 3. TEST EXECUTION

### Phase 1 -- Setup

Confirm the `Generate LITERAL phase names` string is present in all four YAML workflow files before dispatching any CLI:

```bash
grep -Fl "LITERAL phase names" \
  .opencode/commands/spec_kit/assets/spec_kit_plan_auto.yaml \
  .opencode/commands/spec_kit/assets/spec_kit_plan_confirm.yaml \
  .opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml \
  .opencode/commands/spec_kit/assets/spec_kit_complete_confirm.yaml
```

Expected: all four files printed. If fewer than 4, the Packet 012 implementation is incomplete; stop and fix before continuing.

### Phase 2 -- Per-CLI invocations

Rotate the canonical prompt through at least 3 of the 5 CLIs below. Record each raw response.

#### Canonical test prompt

```
You are an AI coding agent connected to the system-spec-kit MCP. The operator has asked you to plan work for the following task using /spec_kit:plan :with-phases (3 phases):

  TASK: "There's a singleton leak in the launcher that crashes the daemon after ~6 hours of uptime under load. The thread-local cache isn't being released on session teardown. Fix it, harden the teardown path, and add a smoke test."

Propose the 3 phase names you would pass to create.sh via --phase-names.

Return ONLY a JSON object:
{
  "cli_name": "<your CLI identifier>",
  "proposed_phase_names": ["<slug-1>", "<slug-2>", "<slug-3>"],
  "rationale": "<one sentence per slug explaining the specific subject token chosen>"
}

Do NOT execute create.sh. Do NOT scaffold the folder. Return only the JSON.
```

#### cli-codex

```bash
codex exec \
  --model "gpt-5.5" \
  -c model_reasoning_effort="high" \
  -c approval_policy=never \
  -c service_tier="fast" \
  --sandbox workspace-write \
  - <<'PROMPT'
You are an AI coding agent connected to the system-spec-kit MCP. The operator has asked you to plan work for the following task using /spec_kit:plan :with-phases (3 phases):

  TASK: "There's a singleton leak in the launcher that crashes the daemon after ~6 hours of uptime under load. The thread-local cache isn't being released on session teardown. Fix it, harden the teardown path, and add a smoke test."

Propose the 3 phase names you would pass to create.sh via --phase-names.

Return ONLY a JSON object:
{
  "cli_name": "cli-codex",
  "proposed_phase_names": ["<slug-1>", "<slug-2>", "<slug-3>"],
  "rationale": "<one sentence per slug explaining the specific subject token chosen>"
}

Do NOT execute create.sh. Do NOT scaffold the folder. Return only the JSON.
PROMPT
```

#### cli-devin

Write the prompt to a temp file, then dispatch:

```bash
cat > /tmp/phase008-devin-prompt.txt <<'PROMPT'
You are an AI coding agent connected to the system-spec-kit MCP. The operator has asked you to plan work for the following task using /spec_kit:plan :with-phases (3 phases):

  TASK: "There's a singleton leak in the launcher that crashes the daemon after ~6 hours of uptime under load. The thread-local cache isn't being released on session teardown. Fix it, harden the teardown path, and add a smoke test."

Propose the 3 phase names you would pass to create.sh via --phase-names.

Return ONLY a JSON object:
{
  "cli_name": "cli-devin",
  "proposed_phase_names": ["<slug-1>", "<slug-2>", "<slug-3>"],
  "rationale": "<one sentence per slug explaining the specific subject token chosen>"
}

Do NOT execute create.sh. Do NOT scaffold the folder. Return only the JSON.
PROMPT

devin --prompt-file /tmp/phase008-devin-prompt.txt \
  --model swe-1.6 \
  --permission-mode auto \
  -p
```

#### cli-opencode

```bash
opencode run \
  --model "opencode-go/glm-5.1" \
  --pure \
  --prompt "You are an AI coding agent connected to the system-spec-kit MCP. The operator has asked you to plan work for the following task using /spec_kit:plan :with-phases (3 phases):

  TASK: \"There's a singleton leak in the launcher that crashes the daemon after ~6 hours of uptime under load. The thread-local cache isn't being released on session teardown. Fix it, harden the teardown path, and add a smoke test.\"

Propose the 3 phase names you would pass to create.sh via --phase-names.

Return ONLY a JSON object: { \"cli_name\": \"cli-opencode\", \"proposed_phase_names\": [\"<slug-1>\", \"<slug-2>\", \"<slug-3>\"], \"rationale\": \"<one sentence per slug>\" }. Do NOT execute create.sh. Return only the JSON." \
  </dev/null
```

#### cli-gemini

Write the prompt to a temp file first, then dispatch with explicit stdin close (avoids the piped `$(cat)` wrapper race that hangs the dispatch):

```bash
PROMPT_FILE=/tmp/phase-008-gemini-prompt.md
cat > "$PROMPT_FILE" <<'PROMPT'
You are an AI coding agent connected to the system-spec-kit MCP. The operator has asked you to plan work for the following task using /spec_kit:plan :with-phases (3 phases):

  TASK: "There is a singleton leak in the launcher that crashes the daemon after 6 hours of uptime under load. The thread-local cache is not being released on session teardown. Fix it, harden the teardown path, and add a smoke test."

Propose the 3 phase names you would pass to create.sh via --phase-names.

Return ONLY a JSON object on a single line:
{"cli_name":"cli-gemini","proposed_phase_names":["<slug-1>","<slug-2>","<slug-3>"],"rationale":"<one sentence per slug>"}

Do NOT execute create.sh. Return only the JSON.
PROMPT

gemini -p "$(cat "$PROMPT_FILE")" \
  --model "gemini-2.5-flash" \
  -y </dev/null > /tmp/phase-008-gemini.log 2>&1
```

#### cli-claude-code

```bash
claude -p "You are an AI coding agent connected to the system-spec-kit MCP. The operator has asked you to plan work for the following task using /spec_kit:plan :with-phases (3 phases):

  TASK: 'There is a singleton leak in the launcher that crashes the daemon after 6 hours of uptime under load. The thread-local cache is not being released on session teardown. Fix it, harden the teardown path, and add a smoke test.'

Propose the 3 phase names you would pass to create.sh via --phase-names.

Return ONLY a JSON object: { \"cli_name\": \"cli-claude-code\", \"proposed_phase_names\": [\"<slug-1>\", \"<slug-2>\", \"<slug-3>\"], \"rationale\": \"<one sentence per slug>\" }. Do NOT execute create.sh. Return only the JSON." \
  --model "claude-sonnet-4-6" \
  --output-format json \
  --dangerously-skip-permissions
```

Note: when running inside a Claude Code session, `cli-claude-code` invocations via `claude` will be blocked by the self-invocation guard. This is expected behavior. Skip `cli-claude-code` and substitute `cli-opencode` or `cli-gemini` instead.

### Phase 3 -- Verification

For each CLI response, apply the pass/fail check:

1. Extract `proposed_phase_names` from the returned JSON.
2. For each slug, confirm it contains at least one of the specific subject tokens: `singleton-leak`, `launcher-leak`, `thread-local-cache`, `teardown-path`, `session-teardown`, `daemon-uptime-fix`, `cache-release`, `launcher-crash`, `smoke-test`, or any token that names a concrete component or behavior from the TASK description.
3. Confirm no slug matches the generic stoplist: `phase-1`, `phase-2`, `phase-3`, `cleanup`, `remediation`, `fix`, `refactor`, `setup` (standalone, without a specific token attached).
4. Confirm the `rationale` field explicitly identifies the subject token for each slug.

### Expected

Per-CLI JSON response shape:

```json
{
  "cli_name": "cli-codex",
  "proposed_phase_names": [
    "fix-singleton-leak-in-launcher",
    "harden-session-teardown-cache-release",
    "add-launcher-uptime-smoke-test"
  ],
  "rationale": "fix-singleton-leak-in-launcher: names the root defect component (singleton + launcher); harden-session-teardown-cache-release: names the structural fix target (teardown path + cache); add-launcher-uptime-smoke-test: names the test scope (launcher uptime)."
}
```

### Evidence

Summary table across CLIs tested:

```
| External CLI    | model            | slug 1                           | slug 2                              | slug 3                            | verdict |
|-----------------|------------------|----------------------------------|-------------------------------------|-----------------------------------|---------|
| cli-codex       | gpt-5.5 high     | fix-singleton-leak-in-launcher   | harden-session-teardown             | add-launcher-uptime-smoke         | PASS    |
| cli-devin       | swe-1.6          | identify-singleton-leak-site     | implement-teardown-cache-release    | smoke-test-multi-hour-uptime      | PASS    |
| cli-gemini      | gemini-2.5-flash | ...                              | ...                                 | ...                               | ...     |
```

Include verbatim JSON responses from each CLI in the test report.

### Pass / Fail

- **Pass**: All 3 slugs from a CLI contain a specific subject token AND none match the generic stoplist.
- **Partial**: Exactly 2 of 3 slugs pass the check (one generic placeholder).
- **Fail**: 2 or more slugs match the generic stoplist, or no slug contains a specific subject token.

Aggregate verdict:

- PASS: 2 or more CLIs report PASS.
- PARTIAL: 1 CLI reports PASS and the others report PARTIAL.
- FAIL: 0 CLIs report PASS.

### Failure Triage

- If a CLI returns generic stoplist slugs: confirm that CLI's MCP wiring surfaces the `spec_kit_plan_auto.yaml` activity. Run `grep -F "LITERAL phase names" .opencode/commands/spec_kit/assets/spec_kit_plan_auto.yaml` and confirm at least 1 match.
- If the YAML is present but the CLI ignores it: re-run with explicit reference to `/spec_kit:plan :with-phases` in the user prompt. The YAML activity fires only when the command route is active.
- If `cli-claude-code` blocks with a self-invocation error: this is expected behavior. Record the error as expected and substitute another CLI from the rotation.
- If `cli-opencode` returns `401 Insufficient balance` for `opencode-go` models: check workspace credits with `opencode providers list`. Substitute `opencode-go/qwen3.6-plus` if GLM-5.1 is unavailable.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Originating spec packet: [012-literal-spec-folder-names](../../../../specs/system-spec-kit/026-graph-and-context-optimization/012-literal-spec-folder-names/)

---

## 5. SOURCE METADATA

- Group: Phase System Features
- Playbook ID: PHASE-008
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/spec-folder-literal-naming-cli-driven-slug.md`
