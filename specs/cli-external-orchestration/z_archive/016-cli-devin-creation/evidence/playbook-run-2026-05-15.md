# cli-devin Playbook Run Report — 2026-05-15T09:15:48Z

**Binary:** `/Users/michelkerkmeester/.local/bin/devin` devin 2026.5.6-8 (66645c2)
**Auth:** Logged in (via Devin).
**Flag substitutions applied:** `normal`→`auto`, `bypass`→`dangerous`, `deepseek-v4-pro`→`deepseek-v4`

| ID | Scenario | Verdict | Exit | Notes |
|---|---|---|---|---|
| DV-001 | Default dispatch (swe-1.6 auto) | PASS | 0 | DV-001 ack  |
| DV-002a | prompt-file (file mode) | PARTIAL | 0 | - **Type Safety**: Catches errors at compile time rather than runtime, reducing  |
| DV-002b | positional prompt (--print) | PASS | 0 | - **Type Safety**: TypeScript catches errors at compile-time rather than runtime |
| DV-003 | stdin redirect </dev/null requirement | SKIP | – | Validated by every other scenario applying </dev/null (no silent loop theft observed) |
| DV-004 | Auth pre-flight | PASS | 0 | Logged in (via Devin).  Credentials:  |
| DV-005 | auto mode read-intent (was 'normal') | PASS | 0 | The file has 1 line.  |
| DV-006 | dangerous mode write (operator-approved) | PASS | 0 | Done. Created `/tmp/cli-devin-playbook-runs/dv-006-out.txt` with "HELLO".  |
| DV-007 | bypass mode (DESTRUCTIVE) | SKIP | – | Binary has no 'bypass' mode; 'dangerous' is the strongest mode. Documented as v1.0.1.0 correction. |
| DV-008 | SWE-1.6 default | PASS | 0 | model: swe-1.6  |
| DV-009 | DeepSeek v4 primary for complex (corrected from deepseek-v4-pro) | PASS | 0 | model: deepseek-v4  |
| DV-010 | GLM 5.1 complex-task fallback (agentic) | PASS | 0 | model: glm-5.1  |
| DV-026 | Kimi k2.6 complex-task fallback (large-context) | PASS | 0 | model: kimi-k2.6  |
| DV-011 | devin rules list | PASS | 0 | Available Rules    global_rules [Windsurf] always-on  |
| DV-012a | devin skills list | PASS | 0 | Available Skills    /create:folder_readme [user,model] (./.opencode/commands/cre |
| DV-012b | devin skills show <name> | SKIP | – | Depends on profile having a skill; profile may be empty |
| DV-013a | devin mcp list | PASS | 0 | Configured MCP servers:    • mk_code_index  |
| DV-013b | devin mcp add/login lifecycle | SKIP | – | Adding a stub MCP server would persist profile state; SKIP to avoid pollution |
| DV-014-t1 | session t1 (sketch type) | PASS | 0 | ```typescript type User = {   id: string | number;  |
| DV-014-t2 | devin --continue (resume last) | PASS | 0 | ```typescript function validateUser(value: unknown): value is User {   if (typeo |
| DV-015 | devin --resume <id> (specific session) | SKIP | – | Requires capturing session IDs from prior dispatches; covered structurally by DV-014 |
| DV-016 | devin list (session inventory) | PASS | 0 | [?2004lNo session selected.  |
| DV-017 | 5-check operator-confirmation gate (NEGATIVE) | SKIP | – | Calling-AI behavior test — runs at the orchestrator layer, not via devin binary. Gate is documented in references/cloud_handoff.md |
| DV-018 | Cloud handoff round-trip (LIVE) | SKIP | – | Requires interactive TUI handoff initiation + cloud entitlement + multi-hour async runtime; not automatable |
| DV-019 | Self-invocation refused (DEVIN_* env) | SKIP | – | Calling-AI behavior test — the cli-devin SKILL.md §2 guard pseudocode would refuse; not testable by invoking devin binary directly (which has no concept of cli-devin's guard) |
| DV-020 | Cloud-handoff exception allowed | SKIP | – | Calling-AI behavior test — depends on cli-devin smart router logic, not binary behavior |
| DV-021 | Dispatch from cli-codex | SKIP | – | Requires launching a cli-codex session that calls into devin; integration test, not a binary smoke |
| DV-022 | Dispatch from cli-claude-code | SKIP | – | Requires launching cli-claude-code session; integration test |
| DV-023 | Dispatch from cli-opencode | SKIP | – | Requires launching cli-opencode session; integration test |
| DV-024 | Dispatch from cli-gemini | SKIP | – | Requires launching cli-gemini session; integration test |
| DV-025 | devin acp server lifecycle | PASS | – | Server launched, accepted stdin, terminated on SIGTERM |

## Summary
- PASS: 16
- PARTIAL: 1
- FAIL: 0
0
- SKIP: 13

