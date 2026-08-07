# cli-devin v1.0.2.0 Canonical Run — 2026-05-15T12:29:58Z

**Binary:** `/Users/michelkerkmeester/.local/bin/devin` devin 2026.5.6-8 (66645c2)
**Auth:** Logged in (via Devin).
**Source:** v1.0.2.0 scenario files (no on-the-fly substitutions; what's in the playbook IS what runs)

| ID | Scenario | Verdict | Exit | Notes |
|---|---|---|---|---|
| DV-001 | Default dispatch (swe-1.6 auto -p) | PASS | 0 | DV-001 ack  |
| DV-002a | prompt-file mode | PARTIAL | 0 | - **Static typing** - Catch errors at compile time instead of runtime, with type |
| DV-002b | positional -p form | PASS | 0 | - **Type Safety**: TypeScript adds static typing to JavaScript, catching errors  |
| DV-003 | stdin redirect </dev/null (v1.0.2.0 finding) | PASS | – | without-redirect=3 with-redirect=3 (PASS = both 3 = no stdin theft on devin) |
| DV-004 | Auth pre-flight | PASS | 0 | Logged in (via Devin).   |
| DV-005 | auto mode read-intent | PASS | 0 | The file `/tmp/cli-devin-playbook-runs/dv-005-stub.txt` contains **1 line**.  |
| DV-006 | dangerous mode write | PASS | 0 | Done. Created `/tmp/cli-devin-playbook-runs/dv-006/out.txt` with content "HELLO" |
| DV-007 | --sandbox flag (OS-level) | PASS | 0 | Done. Created both files in `/tmp/cli-devin-playbook-runs/dv-007/`: - `input.txt |
| DV-008 | swe-1.6 preset | PASS | 0 | model: swe-1.6  |
| DV-009 | deepseek-v4 preset | PASS | 0 | model: deepseek-v4  |
| DV-010 | glm-5.1 preset | PASS | 0 | model: glm-5.1  |
| DV-026 | kimi-k2.6 preset | PASS | 0 | model: kimi-k2.6  |
| DV-011 | devin rules list | PASS | 0 | Available Rules   |
| DV-012a | devin skills list | PASS | 0 | Available Skills   |
| DV-012b | devin skills show /mcp-chrome-devtools:mcp-chrome-devtools | PASS | 0 | Skill: mcp-chrome-devtools:mcp-chrome-devtools   |
| DV-013a | devin mcp list (baseline) | PASS | 0 | Configured MCP servers:   |
| DV-013b | devin mcp add/get/remove lifecycle | PASS | – | add=0 get=0 remove=0 clean=yes |
| DV-014-t1 | session t1 (sketch User type) | PASS | 0 | ```typescript type User = {  |
| DV-014-t2 | devin --continue (t2) | PASS | 0 | ```typescript function validateUser(u: unknown): u is User {  |
| DV-015 | devin --resume <slug> (v1.0.2.0) | PASS | 0 | OK  |
| DV-016 | devin list --format json | PASS | 0 | [   {  |
| DV-017 | 5-check gate (NEGATIVE) | SKIP | – | v1.0.2.0 strengthened SKIP: orchestrator-layer test, not shell-automatable |
| DV-018 | Cloud handoff round-trip (LIVE) | SKIP | – | v1.0.2.0 reframed: operator-driven manual; multi-hour async + interactive TUI |
| DV-027 | Cloud surface accessibility (v1.0.2.0 NEW) | PASS | 0 | Manage Devin Cloud resources (environment setup, sandbox sessions, builds)   |
| DV-019 | Self-invocation refused (DEVIN_* env) | SKIP | – | v1.0.2.0 strengthened SKIP: orchestrator-layer test |
| DV-020 | Cloud-handoff exception allowed | SKIP | – | v1.0.2.0 strengthened SKIP: orchestrator-layer test |
| DV-021 | Dispatch from cli-codex | PARTIAL | – | python-tokens-present: 0 |
| DV-022 | Dispatch from cli-claude-code (implicit) | PASS | 0 | Current session IS Claude Code; every dispatch above is Claude Code→devin |
| DV-023 | Dispatch from cli-opencode | PASS | – | python-tokens-present: 10 |
| DV-024 | Dispatch from cli-gemini | PASS | – | python-tokens-present: 1 |
| DV-025 | devin acp server lifecycle | PASS | – | launched + SIGTERM clean |

## Summary
- PASS: 25
- PARTIAL: 2
- FAIL: 0
0
- SKIP: 4
