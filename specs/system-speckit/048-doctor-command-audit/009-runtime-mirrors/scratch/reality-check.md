# Runtime mirrors doctor: checkout reality

## Scope and evidence

This audit covers the runtime-mirrors route entry, the doctor router contract, the runtime-mirrors workflow, the shared presentation sections that resolve and display this target, and the checker commands those documents name. The route is target runtime-mirrors at .skilled/commands/doctor/_routes.yaml:185-204; the router loads the YAML and presentation contract at .skilled/commands/doctor/speckit.md:10-16, 59-68.

The exact read-only command outputs and per-path test results are preserved in doctor-run.log. A present path was tested with the exact test -e command shown in the log. The 64 hook adapter path rows are at doctor-runtime-mirrors.yaml:55-118 and their commands and results are in doctor-run.log:158-350.

## Findings from the route and workflow inventory

- The route lists six script invocations, including command-catalog-mirror-check.cjs, while the workflow defines seven upstream assets and seven script steps that omit that checker. The route does not list either Pi checker although the workflow runs both (.skilled/commands/doctor/_routes.yaml:192-198; .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:33-40, 131-138).
- This route entry does not declare a cli_commands key; its command strings are under script_invocations. That is an absent route field, not a missing executable (.skilled/commands/doctor/_routes.yaml:185-198).
- The workflow action says “five mirror checkers,” while its listed steps include the Codex and Pi prompt and agent checkers and the agent roster checker (.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:6, 33-40, 131-138).
- Every named route asset, upstream script, runtime config path, generated output directory, and all 64 configured hook adapter paths exist in this checkout. The exact test -e commands and results are recorded in doctor-run.log:58-154, 158-350, 475-483.
- The read-only mirror, Codex, Pi, roster, and command-catalog checks all reported in sync. The Codex hooks check did not inspect parity: it exited 1 because the installer refused to anchor to this linked worktree. The user-global target file itself exists, but its content was not compared (doctor-run.log:2-55, 45-47, 475-477).
- The presentation accepts answers 12 and 13 for runtime-mirrors and router-reach, but its visible menu ends at 11 and its help prompt says “Press 1-11” (.skilled/commands/doctor/assets/doctor-speckit-presentation.txt:12-24, 37-45, 50-70).

## Route assets, scripts, commands, and tools

| Source | Named item | Status in this checkout | Exact command or observed evidence |
|---|---|---|---|
| .skilled/commands/doctor/speckit.md:1-87 | Router definition; allowed-tools Read, Bash, Grep, Glob, Edit, Write | Present as command frontmatter and body; this Codex shell did not exercise another host's tool registry | test -e .skilled/commands/doctor/speckit.md -> PRESENT, doctor-run.log:58-60; declaration at .skilled/commands/doctor/speckit.md:1-5 |
| .skilled/commands/doctor/_routes.yaml:185-198 | Route entry, setup_vars, allowed_flags, mutating class, mcp_tools, script_invocations | Present | test -e .skilled/commands/doctor/_routes.yaml -> PRESENT, doctor-run.log:61-63 |
| .skilled/commands/doctor/_routes.yaml:185-198 | cli_commands | Not declared for this target; commands are listed under script_invocations | Route row inspection, .skilled/commands/doctor/_routes.yaml:185-198 |
| .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:1-164 | Workflow YAML | Present | test -e .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml -> PRESENT, doctor-run.log:64-66 |
| .skilled/commands/doctor/assets/doctor-speckit-presentation.txt:1-202 | Shared presentation contract | Present | test -e .skilled/commands/doctor/assets/doctor-speckit-presentation.txt -> PRESENT, doctor-run.log:67-69 |
| .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:7 | Skill owner directory .skilled/skills/system-spec-kit/runtime/cli/ | Present | test -e .skilled/skills/system-spec-kit/runtime/cli -> exit 0, doctor-run.log:479-480 |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:54-61, 305-313 | Runtime mirror checker; --check is parsed and returns before writeMirrors | Present; check passed, 172 mirrors across 8 trees | node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check; exit 0, doctor-run.log:2-4 |
| .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs:56-64, 305-315 | Codex agent checker; --check returns before writeOutputs | Present; 12 generated agents passed | node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check; exit 0, doctor-run.log:6-8 |
| .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs:29-37, 192-202 | Codex prompt checker; --check returns before writeOutputs | Present; 33 generated prompts passed | node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check; exit 0, doctor-run.log:10-12 |
| .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:4-15, 87-123 | Agent roster checker; accepts no arguments and does not write | Present; 12/12 agents on all five surfaces passed | node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs; exit 0, doctor-run.log:14-27 |
| .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs:32-38, 303-357 | Command catalog checker; route-only invocation, read-only, no flags passed | Present; all printed catalogs and metadata passed | node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs; exit 0, doctor-run.log:29-43 |
| .skilled/bin/install-codex-hooks.mjs:35-57, 317-341 | Codex hooks installer check; --check branch returns before writes | Present; execution was refused by its linked-worktree guard before comparing the global target | node .skilled/bin/install-codex-hooks.mjs --check; exit 1, doctor-run.log:45-47 |
| .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs:44-52, 256-265 | Pi agent checker; --check returns before writeOutputs | Present; 12 generated agents passed | node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check; exit 0, doctor-run.log:49-51 |
| .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs:29-37, 196-205 | Pi prompt checker; --check returns before writeOutputs | Present; 33 generated prompts passed | node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check; exit 0, doctor-run.log:53-55 |
| .skilled/bin/install-codex-hooks.mjs:8-14, .skilled/skills/system-spec-kit/runtime/package.json | Repair command npm --prefix .skilled/skills/system-spec-kit/runtime run build | npm, package.json, and scripts.build exist; build was not run because it generates dist output | command -v npm -> exit 0, doctor-run.log:471-473; test -e package.json and read-only JSON inspection -> scripts.build present, doctor-run.log:482-487; repair command is named at doctor-runtime-mirrors.yaml:162-164 |
| .skilled/commands/doctor/_routes.yaml:188-198; .skilled/commands/doctor/speckit.md:61-68 | Outer route flags and routing tokens | Route-specific allowed_flags is empty; global target parser documents positional target, list, ?, --list, and --target=<name> | Definition at .skilled/commands/doctor/_routes.yaml:187-188 and .skilled/commands/doctor/speckit.md:61-68; there is no separate shell binary for the slash-command wrapper |
| .skilled/commands/doctor/_routes.yaml:187; .skilled/commands/doctor/speckit.md:31-35 | Setup variable execution_mode | Present as router state; always INTERACTIVE, not an OS environment variable | Source at .skilled/commands/doctor/_routes.yaml:187 and .skilled/commands/doctor/speckit.md:31-35 |
| .skilled/commands/doctor/_routes.yaml:191 | MCP tools | None configured; the route says mcp_tools: [] and script-only, with no MCP calls | Source at .skilled/commands/doctor/_routes.yaml:191 |
| .skilled/commands/doctor/assets/doctor-speckit-presentation.txt:7; .skilled/commands/doctor/speckit.md:61 | $ARGUMENTS | Present as the router's argument placeholder, not a process environment variable | Source at .skilled/commands/doctor/assets/doctor-speckit-presentation.txt:7 and .skilled/commands/doctor/speckit.md:61 |
| Runtime CLI availability | node and npm | Present on PATH | command -v node -> exit 0, doctor-run.log:467-469; command -v npm -> exit 0, doctor-run.log:471-473 |

## Runtime config, directory, and generated-file references

| Path or pattern | Status | Exact command or observed evidence | Source |
|---|---|---|---|
| .claude/settings.json | Present | test -e .claude/settings.json -> PRESENT, doctor-run.log:94-96 | doctor-runtime-mirrors.yaml:46-47 |
| .codex/hooks.json | Present | test -e .codex/hooks.json -> PRESENT, doctor-run.log:97-99 | doctor-runtime-mirrors.yaml:46-47, 135 |
| .cursor/hooks.json | Present | test -e .cursor/hooks.json -> PRESENT, doctor-run.log:100-102 | doctor-runtime-mirrors.yaml:46-47 |
| .devin/hooks.v1.json | Present | test -e .devin/hooks.v1.json -> PRESENT, doctor-run.log:103-105 | doctor-runtime-mirrors.yaml:46-47 |
| ~/.codex/hooks.json | Present as a path; contents unverified by the checker in this linked worktree | test -e "$HOME/.codex/hooks.json" -> PRESENT, doctor-run.log:475-477; installer uses os.homedir() at .skilled/bin/install-codex-hooks.mjs:324-330 | doctor-runtime-mirrors.yaml:135 |
| .claude/agents | Present | test -e .claude/agents -> PRESENT, doctor-run.log:106-108 | doctor-runtime-mirrors.yaml:34-35; agent roster output, doctor-run.log:16-25 |
| .claude/commands | Present | test -e .claude/commands -> PRESENT, doctor-run.log:109-111 | doctor-runtime-mirrors.yaml:5; runtime sync source at .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:39-42 |
| .skilled/commands | Present | test -e .skilled/commands -> PRESENT, doctor-run.log:112-114 | doctor-runtime-mirrors.yaml:5 |
| .skilled/agents | Present | test -e .skilled/agents -> PRESENT, doctor-run.log:115-117 | doctor-runtime-mirrors.yaml:154 |
| .codex/agents | Present; 12 TOML files found | test -e .codex/agents -> PRESENT, doctor-run.log:118-120; rg --files .codex/agents -g *.toml -> 12 paths, doctor-run.log:353-366 | doctor-runtime-mirrors.yaml:132, 154 |
| .codex/prompts/*.md | Present; checker found 33 in-sync generated prompts | rg --files .codex/prompts -g *.md -> doctor-run.log:368-402; checker result, doctor-run.log:10-12 | doctor-runtime-mirrors.yaml:133 |
| .pi/agents/*.md | Present; checker found 12 in-sync generated agents | rg --files .pi/agents -g *.md -> doctor-run.log:404-417; checker result, doctor-run.log:49-51 | doctor-runtime-mirrors.yaml:136 |
| .pi/prompts/*.md | Present; checker found 33 in-sync generated prompts; the directory listing also includes runtime-native files | rg --files .pi/prompts -g *.md -> doctor-run.log:419-455; checker result, doctor-run.log:53-55 | doctor-runtime-mirrors.yaml:137 |
| .claude/hooks, .codex/hooks, .cursor/hooks, .devin/hooks | All present | test -e for each exact directory, doctor-run.log:130-153 | doctor-runtime-mirrors.yaml:44-47 |
| .skilled/bin, .skilled/hooks, .skilled/scripts | All present | test -e for each exact directory, doctor-run.log:142-153 | doctor-runtime-mirrors.yaml:163-164 |
| .skilled/skills/system-spec-kit/runtime/dist/hooks | Present | test -e .skilled/skills/system-spec-kit/runtime/dist/hooks -> PRESENT, doctor-run.log:151-153 | doctor-runtime-mirrors.yaml:62-64, 70, 75-76, 83, 93-94, 99, 108, 111-113, 118, 163 |

## Hook adapter file_exists rows

The workflow configures 64 host:event:path checks. Every listed path is present. The command column gives the exact path test; the evidence column points to its complete command, output, and exit code in doctor-run.log.

| Host | Event | Path | Status | Exact command | Evidence |
|---|---|---|---|---|---|
| claude | PreToolUse | .skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs | present | test -e .skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs | doctor-runtime-mirrors.yaml:55; doctor-run.log:159-161 |
| claude | PreToolUse | .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs | present | test -e .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs | doctor-runtime-mirrors.yaml:56; doctor-run.log:162-164 |
| claude | PreToolUse | .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs | present | test -e .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs | doctor-runtime-mirrors.yaml:57; doctor-run.log:165-167 |
| claude | PreToolUse | .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs | present | test -e .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs | doctor-runtime-mirrors.yaml:58; doctor-run.log:168-170 |
| claude | PreToolUse | .skilled/hooks/task-dispatch/claude/task-dispatch-guard.cjs | present | test -e .skilled/hooks/task-dispatch/claude/task-dispatch-guard.cjs | doctor-runtime-mirrors.yaml:59; doctor-run.log:171-173 |
| claude | PreToolUse | .skilled/hooks/task-dispatch/claude/fable-subagent-guard.mjs | present | test -e .skilled/hooks/task-dispatch/claude/fable-subagent-guard.mjs | doctor-runtime-mirrors.yaml:60; doctor-run.log:174-176 |
| claude | PreToolUse | .skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs | present | test -e .skilled/hooks/mcp-route-guard/claude/mcp-route-guard.cjs | doctor-runtime-mirrors.yaml:61; doctor-run.log:177-179 |
| claude | UserPromptSubmit | .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js | present | test -e .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js | doctor-runtime-mirrors.yaml:62; doctor-run.log:180-182 |
| claude | UserPromptSubmit | .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs | present | test -e .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs | doctor-runtime-mirrors.yaml:63; doctor-run.log:183-185 |
| claude | SessionStart | .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js | present | test -e .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-prime.js | doctor-runtime-mirrors.yaml:64; doctor-run.log:186-188 |
| claude | SessionStart | .skilled/bin/worktree-guard.sh | present | test -e .skilled/bin/worktree-guard.sh | doctor-runtime-mirrors.yaml:65; doctor-run.log:189-191 |
| claude | SessionStart | .skilled/bin/check-git-hooks.sh | present | test -e .skilled/bin/check-git-hooks.sh | doctor-runtime-mirrors.yaml:66; doctor-run.log:192-194 |
| claude | SessionStart | .skilled/bin/git-live-follow.sh | present | test -e .skilled/bin/git-live-follow.sh | doctor-runtime-mirrors.yaml:67; doctor-run.log:195-197 |
| claude | SessionStart | .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh | present | test -e .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh | doctor-runtime-mirrors.yaml:68; doctor-run.log:198-200 |
| claude | SessionStart | .skilled/bin/install-codex-hooks.mjs | present | test -e .skilled/bin/install-codex-hooks.mjs | doctor-runtime-mirrors.yaml:69; doctor-run.log:201-203 |
| claude | Stop | .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-stop.js | present | test -e .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-stop.js | doctor-runtime-mirrors.yaml:70; doctor-run.log:204-206 |
| claude | Stop | .skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs | present | test -e .skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs | doctor-runtime-mirrors.yaml:71; doctor-run.log:207-209 |
| claude | SessionEnd | .skilled/scripts/session-cleanup.sh | present | test -e .skilled/scripts/session-cleanup.sh | doctor-runtime-mirrors.yaml:72; doctor-run.log:210-212 |
| claude | PostToolUse | .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs | present | test -e .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs | doctor-runtime-mirrors.yaml:73; doctor-run.log:213-215 |
| claude | PostToolUse | .skilled/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs | present | test -e .skilled/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs | doctor-runtime-mirrors.yaml:74; doctor-run.log:216-218 |
| claude | PreCompact | .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/compact-inject.js | present | test -e .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/compact-inject.js | doctor-runtime-mirrors.yaml:75; doctor-run.log:219-221 |
| cursor | sessionStart | .skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/session-start.js | present | test -e .skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/session-start.js | doctor-runtime-mirrors.yaml:76; doctor-run.log:222-224 |
| cursor | sessionStart | .skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs | present | test -e .skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs | doctor-runtime-mirrors.yaml:77; doctor-run.log:225-227 |
| cursor | sessionStart | .skilled/bin/worktree-guard.sh | present | test -e .skilled/bin/worktree-guard.sh | doctor-runtime-mirrors.yaml:78; doctor-run.log:228-230 |
| cursor | sessionStart | .skilled/bin/check-git-hooks.sh | present | test -e .skilled/bin/check-git-hooks.sh | doctor-runtime-mirrors.yaml:79; doctor-run.log:231-233 |
| cursor | sessionStart | .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh | present | test -e .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh | doctor-runtime-mirrors.yaml:80; doctor-run.log:234-236 |
| cursor | sessionStart | .skilled/bin/install-codex-hooks.mjs | present | test -e .skilled/bin/install-codex-hooks.mjs | doctor-runtime-mirrors.yaml:81; doctor-run.log:237-239 |
| cursor | sessionStart | .skilled/hooks/goal/cursor/goal-inject.mjs | present | test -e .skilled/hooks/goal/cursor/goal-inject.mjs | doctor-runtime-mirrors.yaml:82; doctor-run.log:240-242 |
| cursor | sessionEnd | .skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/session-end.js | present | test -e .skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/session-end.js | doctor-runtime-mirrors.yaml:83; doctor-run.log:243-245 |
| cursor | sessionEnd | .skilled/scripts/session-cleanup.sh | present | test -e .skilled/scripts/session-cleanup.sh | doctor-runtime-mirrors.yaml:84; doctor-run.log:246-248 |
| cursor | preToolUse | .skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs | present | test -e .skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs | doctor-runtime-mirrors.yaml:85; doctor-run.log:249-251 |
| cursor | preToolUse | .skilled/hooks/task-dispatch/cursor/task-dispatch-guard.mjs | present | test -e .skilled/hooks/task-dispatch/cursor/task-dispatch-guard.mjs | doctor-runtime-mirrors.yaml:86; doctor-run.log:252-254 |
| cursor | preToolUse | .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs | present | test -e .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs | doctor-runtime-mirrors.yaml:87; doctor-run.log:255-257 |
| cursor | preToolUse | .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs | present | test -e .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs | doctor-runtime-mirrors.yaml:88; doctor-run.log:258-260 |
| cursor | postToolUse | .skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs | present | test -e .skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs | doctor-runtime-mirrors.yaml:89; doctor-run.log:261-263 |
| cursor | beforeSubmitPrompt | .skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs | present | test -e .skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs | doctor-runtime-mirrors.yaml:90; doctor-run.log:264-266 |
| cursor | beforeSubmitPrompt | .skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/user-prompt-submit.js | present | test -e .skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/user-prompt-submit.js | doctor-runtime-mirrors.yaml:91; doctor-run.log:267-269 |
| cursor | beforeMCPExecution | .skilled/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs | present | test -e .skilled/hooks/mcp-route-guard/cursor/mcp-route-guard.mjs | doctor-runtime-mirrors.yaml:92; doctor-run.log:270-272 |
| cursor | preCompact | .skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/precompact.js | present | test -e .skilled/skills/system-spec-kit/runtime/dist/hooks/cursor/precompact.js | doctor-runtime-mirrors.yaml:93; doctor-run.log:273-275 |
| codex | SessionStart | .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/session-start.js | present | test -e .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/session-start.js | doctor-runtime-mirrors.yaml:94; doctor-run.log:276-278 |
| codex | SessionStart | .skilled/bin/worktree-guard.sh | present | test -e .skilled/bin/worktree-guard.sh | doctor-runtime-mirrors.yaml:95; doctor-run.log:279-281 |
| codex | SessionStart | .skilled/bin/check-git-hooks.sh | present | test -e .skilled/bin/check-git-hooks.sh | doctor-runtime-mirrors.yaml:96; doctor-run.log:282-284 |
| codex | SessionStart | .skilled/bin/git-live-follow.sh | present | test -e .skilled/bin/git-live-follow.sh | doctor-runtime-mirrors.yaml:97; doctor-run.log:285-287 |
| codex | SessionStart | .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh | present | test -e .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh | doctor-runtime-mirrors.yaml:98; doctor-run.log:288-290 |
| codex | UserPromptSubmit | .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js | present | test -e .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/user-prompt-submit.js | doctor-runtime-mirrors.yaml:99; doctor-run.log:291-293 |
| codex | UserPromptSubmit | .skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs | present | test -e .skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs | doctor-runtime-mirrors.yaml:100; doctor-run.log:294-296 |
| codex | PreToolUse | .skilled/hooks/dispatch/codex/dispatch-preflight-lint.mjs | present | test -e .skilled/hooks/dispatch/codex/dispatch-preflight-lint.mjs | doctor-runtime-mirrors.yaml:101; doctor-run.log:297-299 |
| codex | PreToolUse | .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs | present | test -e .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs | doctor-runtime-mirrors.yaml:102; doctor-run.log:300-302 |
| codex | PreToolUse | .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs | present | test -e .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs | doctor-runtime-mirrors.yaml:103; doctor-run.log:303-305 |
| codex | PreToolUse | .skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs | present | test -e .skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs | doctor-runtime-mirrors.yaml:104; doctor-run.log:306-308 |
| codex | PreToolUse | .skilled/hooks/mcp-route-guard/codex/mcp-route-guard.cjs | present | test -e .skilled/hooks/mcp-route-guard/codex/mcp-route-guard.cjs | doctor-runtime-mirrors.yaml:105; doctor-run.log:309-311 |
| codex | PostToolUse | .skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs | present | test -e .skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs | doctor-runtime-mirrors.yaml:106; doctor-run.log:312-314 |
| codex | PostToolUse | .skilled/hooks/dispatch/codex/dispatch-audit-posttooluse.mjs | present | test -e .skilled/hooks/dispatch/codex/dispatch-audit-posttooluse.mjs | doctor-runtime-mirrors.yaml:107; doctor-run.log:315-317 |
| codex | Stop | .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/session-stop.js | present | test -e .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/session-stop.js | doctor-runtime-mirrors.yaml:108; doctor-run.log:318-320 |
| codex | Stop | .skilled/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs | present | test -e .skilled/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs | doctor-runtime-mirrors.yaml:109; doctor-run.log:321-323 |
| codex | Stop | .skilled/scripts/session-cleanup.sh | present | test -e .skilled/scripts/session-cleanup.sh | doctor-runtime-mirrors.yaml:110; doctor-run.log:324-326 |
| codex | PreCompact | .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/compact-inject.js | present | test -e .skilled/skills/system-spec-kit/runtime/dist/hooks/codex/compact-inject.js | doctor-runtime-mirrors.yaml:111; doctor-run.log:327-329 |
| devin | SessionStart | .skilled/skills/system-spec-kit/runtime/dist/hooks/devin/session-start.js | present | test -e .skilled/skills/system-spec-kit/runtime/dist/hooks/devin/session-start.js | doctor-runtime-mirrors.yaml:112; doctor-run.log:330-332 |
| devin | UserPromptSubmit | .skilled/skills/system-spec-kit/runtime/dist/hooks/devin/user-prompt-submit.js | present | test -e .skilled/skills/system-spec-kit/runtime/dist/hooks/devin/user-prompt-submit.js | doctor-runtime-mirrors.yaml:113; doctor-run.log:333-335 |
| devin | PreToolUse | .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs | present | test -e .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs | doctor-runtime-mirrors.yaml:114; doctor-run.log:336-338 |
| devin | PreToolUse | .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs | present | test -e .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs | doctor-runtime-mirrors.yaml:115; doctor-run.log:339-341 |
| devin | SessionStart | .skilled/hooks/goal/devin/goal-inject.mjs | present | test -e .skilled/hooks/goal/devin/goal-inject.mjs | doctor-runtime-mirrors.yaml:116; doctor-run.log:342-344 |
| devin | UserPromptSubmit | .skilled/hooks/goal/devin/goal-inject.mjs | present | test -e .skilled/hooks/goal/devin/goal-inject.mjs | doctor-runtime-mirrors.yaml:117; doctor-run.log:345-347 |
| devin | Stop | .skilled/skills/system-spec-kit/runtime/dist/hooks/devin/session-stop.js | present | test -e .skilled/skills/system-spec-kit/runtime/dist/hooks/devin/session-stop.js | doctor-runtime-mirrors.yaml:118; doctor-run.log:348-350 |

## Behavior caveats

- The Codex hooks check command is read-only after it passes its worktree anchor check: the --check branch returns before the write path (.skilled/bin/install-codex-hooks.mjs:243-275, 334-341). On this linked worktree the exact route command refused at that guard and exited 1 (doctor-run.log:45-47).
- The route and YAML do not name process environment variables. The presentation names $ARGUMENTS as an argument placeholder (doctor-speckit-presentation.txt:7), and the hooks installer derives the home target with os.homedir() (install-codex-hooks.mjs:324-330).
- The underlying installer can return with exit 0 and no output when hook-install is disabled because main returns before parsing or reporting (install-codex-hooks.mjs:317-319). Its enablement can come from SYSTEM_HOOKS_DISABLED, MK_HOOKS_DISABLED, SYSTEM_HOOK_INSTALL_DISABLED, MK_HOOK_INSTALL_DISABLED, or HOOK_FLAGS_CONFIG (hook-flags.cjs:25-29, 75, 83-89, 151-173). These variables are not declared by the doctor route or workflow, but the route's success contract should not treat an empty no-op as an in-sync result.
- The report's repair list includes generator/install commands and npm run build; the read-only versions were used where available, and write-producing repair commands were recorded as skipped in doctor-run.log:457-465. The package build entry was inspected without running it (doctor-run.log:482-487).
