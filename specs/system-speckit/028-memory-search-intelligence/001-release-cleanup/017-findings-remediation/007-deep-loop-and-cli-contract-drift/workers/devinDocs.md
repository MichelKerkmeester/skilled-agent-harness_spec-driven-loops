[0m
> build · gpt-5.6-luna-fast
[0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/SKILL.md[90m [offset=170, limit=45][0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md[90m [offset=180, limit=35][0m
[0m✱ [0mGrep "devin\s+-p|--prompt|glm"[90m in .opencode/skills/cli-external-orchestration/cli-devin · 100 matches[0m
[0m✱ [0mGrep "devin\s+-p"[90m in .opencode/skills/cli-external-orchestration/cli-devin/SKILL.md · 10 matches[0m
[0m✱ [0mGrep "devin\s+-p"[90m in .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md · 19 matches[0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md[90m [offset=60, limit=125][0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md[90m [offset=240, limit=35][0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/SKILL.md[90m [offset=320, limit=40][0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md[90m [offset=375, limit=30][0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md[90m [offset=470, limit=35][0m
[0m% [0mPatch 1 file
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/SKILL.md[90m [offset=324, limit=33][0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/SKILL.md[90m [offset=185, limit=28][0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md[90m [offset=60, limit=112][0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md[90m [offset=245, limit=22][0m
[0m✱ [0mGrep "devin\s+-p"[90m in .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md · 19 matches[0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md[90m [offset=385, limit=12][0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md[90m [offset=480, limit=18][0m
[0m% [0mPatch 1 file
[0m✱ [0mGrep "devin\s+-p"[90m in .opencode/skills/cli-external-orchestration/cli-devin/SKILL.md · 10 matches[0m
[0m✱ [0mGrep "devin\s+-p"[90m in .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md · 19 matches[0m
[0m✱ [0mGrep "devin\s+-p\s+("|\$|--model|--permission-mode|\.\.\.)"[90m in .opencode/skills/cli-devin · 12 matches[0m
[0m✱ [0mGrep "\| \*\*GLM\*\*|`glm`"[90m in .opencode/skills/cli-external-orchestration/cli-devin · 1 match[0m
[0m
[0m$ [0mdevin --help
A fast and minimal agent that lives both in your terminal and in the cloud.

Usage: devin [OPTIONS] [-- <PROMPT>...] [COMMAND]

Commands:
  auth       Authentication related commands
  mcp        Connect and log in to Model Context Protocol servers
  models     List the models available to your account
  rules      Manage agent rules (always-on context blobs)
  skills     Manage agent skills (slash commands and agent-triggered context blobs)
  plugins    Manage plugins (install, list, info, update, remove)
  cloud      Manage Devin Cloud resources (environment setup, sandbox sessions, builds)
  list       List sessions in the current directory [aliases: ls]
  update     Check for updates and optionally install them
  version    Print the current version
  migrate    Migrate configuration from other tools
  sandbox    [Research Preview] Process sandboxing for the exec tool
  setup      Interactive setup wizard
  uninstall  Uninstall and remove data
  acp        Run as an ACP (Agent Client Protocol) server over stdio
  shell      [Feature preview] Integrate with your shell to instantly launch devin with relevant context
  help       Print this message or the help of the given subcommand(s)

Arguments:
  [PROMPT]...
          Your prompt (use -- before the prompt)
          
          Starts an interactive session. Use -p/--print for non-interactive mode.

Options:
      --prompt-file <FILE>
          Load the initial prompt from a file

      --config <PATH>
          Configuration file path
          
          Override the default user config file (~/.config/devin/config.json).

      --permission-mode <PERMISSION_MODE>
          Permission mode
          
          Modes: "auto" auto-approves read-only tools, "accept-edits" also auto-approves workspace edits, "smart" additionally auto-runs actions a fast model judges safe, "dangerous" auto-approves all tools.
          
          [env: DEVIN_PERMISSION_MODE=]
          [default: auto]

      --sandbox
          [Research Preview] Sandbox exec-tool processes (macOS seatbelt / Linux bwrap+seccomp)
          
          When passed, the sandbox enforces the active Read/Write permission scopes at the OS level. Writable roots come from granted `Write(...)` scopes, readable roots come from granted `Read(...)` scopes.
          
          [env: DEVIN_SANDBOX=]

      --model <MODEL>
          Model to use (e.g. "claude-sonnet-4", "claude-opus-4.6", "opus", "codex")
          
          [env: DEVIN_MODEL=]

  -p, --print [<PROMPT>]
          Print response and exit
          
          Runs in non-interactive mode: processes the prompt and exits. Optionally accepts an inline prompt: -p "fix the bug"

      --export [<PATH>]
          Export conversation to a file
          
          Exports after each turn. Uses a default path if no path is provided.

  -c, --continue
          Continue the most recent conversation

  -r, --resume [<SESSION_ID>]
          Resume a conversation
          
          Provide a session ID to resume a specific session, or omit to select interactively.

      --respect-workspace-trust [<RESPECT_WORKSPACE_TRUST>]
          Respect workspace trust settings
          
          Defaults to true for interactive mode, false for non-interactive (print) mode. Use --respect-workspace-trust to enable in non-interactive mode, or --respect-workspace-trust false to disable in interactive mode.
          
          [possible values: true, false]

      --agent-config <FILE>
          Declarative agent configuration file (JSON or YAML)
          
          Path to a file defining system instructions, tool visibility, and permissions. Uses strict parsing — unknown fields are rejected to catch typos early.

  -h, --help
          Print help (see a summary with '-h')

  -V, --version
          Print version
[0m
[0m$ [0mdevin models list
Available models (36 families)

Claude Opus 5 (claude-opus-5)
  aliases: opus
  claude-opus-5-medium                   Claude Opus 5 Medium  [1M context, $5 / MTok In · $25 / MTok Out, new]
  claude-opus-5-low                      Claude Opus 5 Low  [1M context, $5 / MTok In · $25 / MTok Out, new]
  claude-opus-5-high                     Claude Opus 5 High  [1M context, $5 / MTok In · $25 / MTok Out, new]
  claude-opus-5-xhigh                    Claude Opus 5 XHigh  [1M context, $5 / MTok In · $25 / MTok Out, new]
  claude-opus-5-max                      Claude Opus 5 Max  [1M context, $5 / MTok In · $25 / MTok Out, new]
  claude-opus-5-low-fast                 Claude Opus 5 Low Fast  [1M context, $10 / MTok In · $50 / MTok Out, new]
  claude-opus-5-medium-fast              Claude Opus 5 Medium Fast  [1M context, $10 / MTok In · $50 / MTok Out, new]
  claude-opus-5-high-fast                Claude Opus 5 High Fast  [1M context, $10 / MTok In · $50 / MTok Out, new]
  claude-opus-5-xhigh-fast               Claude Opus 5 XHigh Fast  [1M context, $10 / MTok In · $50 / MTok Out, new]
  claude-opus-5-max-fast                 Claude Opus 5 Max Fast  [1M context, $10 / MTok In · $50 / MTok Out, new]

Claude Fable 5 (claude-fable-5)
  claude-5-fable-medium                  Claude Fable 5 Medium  [1M context, $10 / MTok In · $50 / MTok Out]
  claude-5-fable-low                     Claude Fable 5 Low  [1M context, $10 / MTok In · $50 / MTok Out]
  claude-5-fable-high                    Claude Fable 5 High  [1M context, $10 / MTok In · $50 / MTok Out]
  claude-5-fable-xhigh                   Claude Fable 5 XHigh  [1M context, $10 / MTok In · $50 / MTok Out]
  claude-5-fable-max                     Claude Fable 5 Max  [1M context, $10 / MTok In · $50 / MTok Out]

Claude Sonnet 5 (claude-sonnet-5)
  aliases: claude, sonnet
  claude-sonnet-5-medium                 Claude Sonnet 5 Medium  [1M context, $2 / MTok In · $10 / MTok Out]
  claude-sonnet-5-low                    Claude Sonnet 5 Low  [1M context, $2 / MTok In · $10 / MTok Out]
  claude-sonnet-5-high                   Claude Sonnet 5 High  [1M context, $2 / MTok In · $10 / MTok Out]
  claude-sonnet-5-xhigh                  Claude Sonnet 5 XHigh  [1M context, $2 / MTok In · $10 / MTok Out]
  claude-sonnet-5-max                    Claude Sonnet 5 Max  [1M context, $2 / MTok In · $10 / MTok Out]

GPT-5.6 Sol (gpt-5.6-sol)
  gpt-5-6-sol-medium                     GPT-5.6 Sol Medium Thinking  [1M context, $5 / MTok In · $30 / MTok Out]
  gpt-5-6-sol-none                       GPT-5.6 Sol No Thinking  [1M context, $5 / MTok In · $30 / MTok Out]
  gpt-5-6-sol-low                        GPT-5.6 Sol Low Thinking  [1M context, $5 / MTok In · $30 / MTok Out]
  gpt-5-6-sol-high                       GPT-5.6 Sol High Thinking  [1M context, $5 / MTok In · $30 / MTok Out]
  gpt-5-6-sol-xhigh                      GPT-5.6 Sol XHigh Thinking  [1M context, $5 / MTok In · $30 / MTok Out]
  gpt-5-6-sol-max                        GPT-5.6 Sol Max Thinking  [1M context, $5 / MTok In · $30 / MTok Out]
  gpt-5-6-sol-none-priority              GPT-5.6 Sol No Thinking Fast  [1M context, $10 / MTok In · $60 / MTok Out]
  gpt-5-6-sol-low-priority               GPT-5.6 Sol Low Thinking Fast  [1M context, $10 / MTok In · $60 / MTok Out]
  gpt-5-6-sol-medium-priority            GPT-5.6 Sol Medium Thinking Fast  [1M context, $10 / MTok In · $60 / MTok Out]
  gpt-5-6-sol-high-priority              GPT-5.6 Sol High Thinking Fast  [1M context, $10 / MTok In · $60 / MTok Out]
  gpt-5-6-sol-xhigh-priority             GPT-5.6 Sol XHigh Thinking Fast  [1M context, $10 / MTok In · $60 / MTok Out]

GPT-5.6 Luna (gpt-5.6-luna)
  gpt-5-6-luna-medium                    GPT-5.6 Luna Medium Thinking  [1M context, $1 / MTok In · $6 / MTok Out]
  gpt-5-6-luna-none                      GPT-5.6 Luna No Thinking  [1M context, $1 / MTok In · $6 / MTok Out]
  gpt-5-6-luna-low                       GPT-5.6 Luna Low Thinking  [1M context, $1 / MTok In · $6 / MTok Out]
  gpt-5-6-luna-high                      GPT-5.6 Luna High Thinking  [1M context, $1 / MTok In · $6 / MTok Out]
  gpt-5-6-luna-xhigh                     GPT-5.6 Luna XHigh Thinking  [1M context, $1 / MTok In · $6 / MTok Out]
  gpt-5-6-luna-max                       GPT-5.6 Luna Max Thinking  [1M context, $1 / MTok In · $6 / MTok Out]
  gpt-5-6-luna-none-priority             GPT-5.6 Luna No Thinking Fast  [1M context, $2 / MTok In · $12 / MTok Out]
  gpt-5-6-luna-low-priority              GPT-5.6 Luna Low Thinking Fast  [1M context, $2 / MTok In · $12 / MTok Out]
  gpt-5-6-luna-medium-priority           GPT-5.6 Luna Medium Thinking Fast  [1M context, $2 / MTok In · $12 / MTok Out]
  gpt-5-6-luna-high-priority             GPT-5.6 Luna High Thinking Fast  [1M context, $2 / MTok In · $12 / MTok Out]
  gpt-5-6-luna-xhigh-priority            GPT-5.6 Luna XHigh Thinking Fast  [1M context, $2 / MTok In · $12 / MTok Out]

GLM-5.2 (glm-5.2)
  glm-5-2                                GLM-5.2 High  [200K context, Free]
  glm-5-2-max                            GLM-5.2 Max  [200K context, $0.7 / MTok In · $2.2 / MTok Out]
  glm-5-2-1m                             GLM-5.2 High 1M  [1M context, $0.7 / MTok In · $2.2 / MTok Out]
  glm-5-2-max-1m                         GLM-5.2 Max 1M  [1M context, $0.7 / MTok In · $2.2 / MTok Out]
  glm-5-2-none                           GLM-5.2 No Thinking  [200K context, $0.7 / MTok In · $2.2 / MTok Out]
  glm-5-2-none-1m                        GLM-5.2 No Thinking 1M  [1M context, $0.7 / MTok In · $2.2 / MTok Out]

SWE-1.7 (swe-1.7)
  swe-1-7                                SWE-1.7 Max  [262K context, Free, beta]
  swe-1-7-medium                         SWE-1.7 Medium  [262K context, Free, beta]

SWE-1.7 Lightning (swe-1.7-lightning)
  aliases: swe
  swe-1-7-lightning                      SWE-1.7 Lightning  [202752 context, $2.5 / MTok In · $12.5 / MTok Out, beta]

Kimi K2.7 (kimi-k2.7)
  kimi-k2-7                              Kimi K2.7  [262144 context, $0.95 / MTok In · $4 / MTok Out]

Adaptive (adaptive)
  adaptive                               Adaptive  [$0.5 / MTok In · $2 / MTok Out]

Claude Opus 4.7 (claude-opus-4.7)
  claude-opus-4-7-medium                 Claude Opus 4.7 Medium  [1M context, $5 / MTok In · $25 / MTok Out]
  claude-opus-4-7-low                    Claude Opus 4.7 Low  [1M context, $5 / MTok In · $25 / MTok Out]
  claude-opus-4-7-high                   Claude Opus 4.7 High  [1M context, $5 / MTok In · $25 / MTok Out]
  claude-opus-4-7-xhigh                  Claude Opus 4.7 XHigh  [1M context, $5 / MTok In · $25 / MTok Out]
  claude-opus-4-7-max                    Claude Opus 4.7 Max  [1M context, $5 / MTok In · $25 / MTok Out]

Claude Opus 4.8 (claude-opus-4.8)
  claude-opus-4-8-medium                 Claude Opus 4.8 Medium  [1M context, $5 / MTok In · $25 / MTok Out]
  claude-opus-4-8-low                    Claude Opus 4.8 Low  [1M context, $5 / MTok In · $25 / MTok Out]
  claude-opus-4-8-high                   Claude Opus 4.8 High  [1M context, $5 / MTok In · $25 / MTok Out]
  claude-opus-4-8-xhigh                  Claude Opus 4.8 XHigh  [1M context, $5 / MTok In · $25 / MTok Out]
  claude-opus-4-8-max                    Claude Opus 4.8 Max  [1M context, $5 / MTok In · $25 / MTok Out]
  claude-opus-4-8-low-fast               Claude Opus 4.8 Low Fast  [1M context, $10 / MTok In · $50 / MTok Out]
  claude-opus-4-8-medium-fast            Claude Opus 4.8 Medium Fast  [1M context, $10 / MTok In · $50 / MTok Out]
  claude-opus-4-8-high-fast              Claude Opus 4.8 High Fast  [1M context, $10 / MTok In · $50 / MTok Out]
  claude-opus-4-8-xhigh-fast             Claude Opus 4.8 XHigh Fast  [1M context, $10 / MTok In · $50 / MTok Out]
  claude-opus-4-8-max-fast               Claude Opus 4.8 Max Fast  [1M context, $10 / MTok In · $50 / MTok Out]

Gemini 3.5 Flash (gemini-3.5-flash)
  gemini-3-5-flash-minimal               Gemini 3.5 Flash Minimal  [1048576 context, $1.5 / MTok In · $9 / MTok Out]
  gemini-3-5-flash-low                   Gemini 3.5 Flash Low  [1048576 context, $1.5 / MTok In · $9 / MTok Out]
  gemini-3-5-flash-medium                Gemini 3.5 Flash Medium  [1048576 context, $1.5 / MTok In · $9 / MTok Out]
  gemini-3-5-flash-high                  Gemini 3.5 Flash High  [1048576 context, $1.5 / MTok In · $9 / MTok Out]

Gemini 3.6 Flash (gemini-3.6-flash)
  aliases: gemini
  gemini-3-6-flash-minimal               Gemini 3.6 Flash Minimal  [1048576 context, $1.5 / MTok In · $7.5 / MTok Out, new]
  gemini-3-6-flash-low                   Gemini 3.6 Flash Low  [1048576 context, $1.5 / MTok In · $7.5 / MTok Out, new]
  gemini-3-6-flash-medium                Gemini 3.6 Flash Medium  [1048576 context, $1.5 / MTok In · $7.5 / MTok Out, new]
  gemini-3-6-flash-high                  Gemini 3.6 Flash High  [1048576 context, $1.5 / MTok In · $7.5 / MTok Out, new]

GPT-5.6 Terra (gpt-5.6-terra)
  aliases: gpt
  gpt-5-6-terra-none                     GPT-5.6 Terra No Thinking  [1M context, $2.5 / MTok In · $15 / MTok Out]
  gpt-5-6-terra-low                      GPT-5.6 Terra Low Thinking  [1M context, $2.5 / MTok In · $15 / MTok Out]
  gpt-5-6-terra-medium                   GPT-5.6 Terra Medium Thinking  [1M context, $2.5 / MTok In · $15 / MTok Out]
  gpt-5-6-terra-high                     GPT-5.6 Terra High Thinking  [1M context, $2.5 / MTok In · $15 / MTok Out]
  gpt-5-6-terra-xhigh                    GPT-5.6 Terra XHigh Thinking  [1M context, $2.5 / MTok In · $15 / MTok Out]
  gpt-5-6-terra-max                      GPT-5.6 Terra Max Thinking  [1M context, $2.5 / MTok In · $15 / MTok Out]
  gpt-5-6-terra-none-priority            GPT-5.6 Terra No Thinking Fast  [1M context, $5 / MTok In · $30 / MTok Out]
  gpt-5-6-terra-low-priority             GPT-5.6 Terra Low Thinking Fast  [1M context, $5 / MTok In · $30 / MTok Out]
  gpt-5-6-terra-medium-priority          GPT-5.6 Terra Medium Thinking Fast  [1M context, $5 / MTok In · $30 / MTok Out]
  gpt-5-6-terra-high-priority            GPT-5.6 Terra High Thinking Fast  [1M context, $5 / MTok In · $30 / MTok Out]
  gpt-5-6-terra-xhigh-priority           GPT-5.6 Terra XHigh Thinking Fast  [1M context, $5 / MTok In · $30 / MTok Out]

Grok 4.5 (grok-4.5)
  grok-4-5-low                           Grok 4.5 Low  [500K context, $2 / MTok In · $6 / MTok Out]
  grok-4-5-medium                        Grok 4.5 Medium  [500K context, $2 / MTok In · $6 / MTok Out]
  grok-4-5-high                          Grok 4.5 High  [500K context, $2 / MTok In · $6 / MTok Out]

Inkling (inkling)
  inkling-none                           Inkling None  [1048576 context, $1.4 / MTok In · $4.4 / MTok Out]
  inkling-low                            Inkling Low  [1048576 context, $1.4 / MTok In · $4.4 / MTok Out]
  inkling-medium                         Inkling Medium  [1048576 context, $1.4 / MTok In · $4.4 / MTok Out]
  inkling-high                           Inkling High  [1048576 context, $1.4 / MTok In · $4.4 / MTok Out]
  inkling-xhigh                          Inkling X-High  [1048576 context, $1.4 / MTok In · $4.4 / MTok Out]
  inkling-max                            Inkling Max  [1048576 context, $1.4 / MTok In · $4.4 / MTok Out]

Claude Opus 4.6 (claude-opus-4.6)
  claude-opus-4-6                        Claude Opus 4.6  [200K context, $5 / MTok In · $25 / MTok Out]
  claude-opus-4-6-thinking               Claude Opus 4.6 Thinking  [200K context, $5 / MTok In · $25 / MTok Out]
  claude-opus-4-6-1m                     Claude Opus 4.6 1M  [1M context, $5 / MTok In · $25 / MTok Out]
  claude-opus-4-6-thinking-1m            Claude Opus 4.6 Thinking 1M  [1M context, $5 / MTok In · $25 / MTok Out]

GPT-5.4 (gpt-5.4)
  gpt-5-4-none                           GPT-5.4 No Thinking  [272K context, $2.5 / MTok In · $15 / MTok Out]
  gpt-5-4-low                            GPT-5.4 Low Thinking  [272K context, $2.5 / MTok In · $15 / MTok Out]
  gpt-5-4-medium                         GPT-5.4 Medium Thinking  [272K context, $2.5 / MTok In · $15 / MTok Out]
  gpt-5-4-high                           GPT-5.4 High Thinking  [272K context, $2.5 / MTok In · $15 / MTok Out]
  gpt-5-4-xhigh                          GPT-5.4 XHigh Thinking  [272K context, $2.5 / MTok In · $15 / MTok Out]
  gpt-5-4-none-priority                  GPT-5.4 No Thinking Fast  [272K context, $5 / MTok In · $30 / MTok Out]
  gpt-5-4-low-priority                   GPT-5.4 Low Thinking Fast  [272K context, $5 / MTok In · $30 / MTok Out]
  gpt-5-4-medium-priority                GPT-5.4 Medium Thinking Fast  [272K context, $5 / MTok In · $30 / MTok Out]
  gpt-5-4-high-priority                  GPT-5.4 High Thinking Fast  [272K context, $5 / MTok In · $30 / MTok Out]
  gpt-5-4-xhigh-priority                 GPT-5.4 XHigh Thinking Fast  [272K context, $5 / MTok In · $30 / MTok Out]

GPT-5.5 (gpt-5.5)
  gpt-5-5-none                           GPT-5.5 No Thinking  [272K context, $5 / MTok In · $30 / MTok Out]
  gpt-5-5-low                            GPT-5.5 Low Thinking  [272K context, $5 / MTok In · $30 / MTok Out]
  gpt-5-5-medium                         GPT-5.5 Medium Thinking  [272K context, $5 / MTok In · $30 / MTok Out]
  gpt-5-5-high                           GPT-5.5 High Thinking  [272K context, $5 / MTok In · $30 / MTok Out]
  gpt-5-5-xhigh                          GPT-5.5 XHigh Thinking  [272K context, $5 / MTok In · $30 / MTok Out]
  gpt-5-5-none-priority                  GPT-5.5 No Thinking Fast  [272K context, $12.5 / MTok In · $75 / MTok Out]
  gpt-5-5-low-priority                   GPT-5.5 Low Thinking Fast  [272K context, $12.5 / MTok In · $75 / MTok Out]
  gpt-5-5-medium-priority                GPT-5.5 Medium Thinking Fast  [272K context, $12.5 / MTok In · $75 / MTok Out]
  gpt-5-5-high-priority                  GPT-5.5 High Thinking Fast  [272K context, $12.5 / MTok In · $75 / MTok Out]
  gpt-5-5-xhigh-priority                 GPT-5.5 XHigh Thinking Fast  [272K context, $12.5 / MTok In · $75 / MTok Out]

GPT-5.4 Mini (gpt-5.4-mini)
  gpt-5-4-mini-low                       GPT-5.4 Mini Low Thinking  [400K context, $0.75 / MTok In · $4.5 / MTok Out]
  gpt-5-4-mini-medium                    GPT-5.4 Mini Medium Thinking  [400K context, $0.75 / MTok In · $4.5 / MTok Out]
  gpt-5-4-mini-high                      GPT-5.4 Mini High Thinking  [400K context, $0.75 / MTok In · $4.5 / MTok Out]
  gpt-5-4-mini-xhigh                     GPT-5.4 Mini XHigh Thinking  [400K context, $0.75 / MTok In · $4.5 / MTok Out]

Claude Sonnet 4.6 (claude-sonnet-4.6)
  claude-sonnet-4-6                      Claude Sonnet 4.6  [200K context, $3 / MTok In · $15 / MTok Out]
  claude-sonnet-4-6-thinking             Claude Sonnet 4.6 Thinking  [200K context, $3 / MTok In · $15 / MTok Out]
  claude-sonnet-4-6-1m                   Claude Sonnet 4.6 1M  [1M context, $3 / MTok In · $15 / MTok Out]
  claude-sonnet-4-6-thinking-1m          Claude Sonnet 4.6 Thinking 1M  [1M context, $3 / MTok In · $15 / MTok Out]

GPT-5.2 (gpt-5.2)
  MODEL_GPT_5_2_LOW                      GPT-5.2 Low Thinking  [384K context, $1.75 / MTok In · $14 / MTok Out]
  MODEL_GPT_5_2_MEDIUM                   GPT-5.2 Medium Thinking  [384K context, $1.75 / MTok In · $14 / MTok Out]
  MODEL_GPT_5_2_NONE                     GPT-5.2 No Thinking  [384K context, $1.75 / MTok In · $14 / MTok Out]
  MODEL_GPT_5_2_HIGH                     GPT-5.2 High Thinking  [384K context, $1.75 / MTok In · $14 / MTok Out]
  MODEL_GPT_5_2_XHIGH                    GPT-5.2 XHigh Thinking  [384K context, $1.75 / MTok In · $14 / MTok Out]

Claude Opus 4.5 (claude-opus-4.5)
  MODEL_CLAUDE_4_5_OPUS                  Claude Opus 4.5  [200K context, $5 / MTok In · $25 / MTok Out]
  MODEL_CLAUDE_4_5_OPUS_THINKING         Claude Opus 4.5 Thinking  [200K context, $5 / MTok In · $25 / MTok Out]

Claude Haiku 4.5 (claude-haiku-4.5)
  aliases: haiku
  MODEL_PRIVATE_11                       Claude Haiku 4.5  [200K context, $1 / MTok In · $5 / MTok Out]

Claude Sonnet 4.5 (claude-sonnet-4.5)
  MODEL_PRIVATE_2                        Claude Sonnet 4.5  [200K context, $3 / MTok In · $15 / MTok Out]
  MODEL_PRIVATE_3                        Claude Sonnet 4.5 Thinking  [200K context, $3 / MTok In · $15 / MTok Out]

GPT-4.1 (gpt-4.1)
  MODEL_CHAT_GPT_4_1_2025_04_14          GPT-4.1  [1047576 context, $2 / MTok In · $8 / MTok Out]

GPT-5.1 (gpt-5.1)
  MODEL_PRIVATE_12                       GPT-5.1 No Thinking  [384K context, $1.25 / MTok In · $10 / MTok Out]
  MODEL_PRIVATE_13                       GPT-5.1 Low Thinking  [384K context, $1.25 / MTok In · $10 / MTok Out]
  MODEL_PRIVATE_14                       GPT-5.1 Medium Thinking  [384K context, $1.25 / MTok In · $10 / MTok Out]
  MODEL_PRIVATE_15                       GPT-5.1 High Thinking  [384K context, $1.25 / MTok In · $10 / MTok Out]

GPT-5.3-Codex (gpt-5.3-codex)
  aliases: codex
  gpt-5-3-codex-low                      GPT-5.3-Codex Low  [400K context, $1.75 / MTok In · $14 / MTok Out]
  gpt-5-3-codex-medium                   GPT-5.3-Codex Medium  [400K context, $1.75 / MTok In · $14 / MTok Out]
  gpt-5-3-codex-high                     GPT-5.3-Codex High  [400K context, $1.75 / MTok In · $14 / MTok Out]
  gpt-5-3-codex-xhigh                    GPT-5.3-Codex X-High  [400K context, $1.75 / MTok In · $14 / MTok Out]
  gpt-5-3-codex-low-priority             GPT-5.3-Codex Low Fast  [400K context, $3.5 / MTok In · $28 / MTok Out]
  gpt-5-3-codex-medium-priority          GPT-5.3-Codex Medium Fast  [400K context, $3.5 / MTok In · $28 / MTok Out]
  gpt-5-3-codex-high-priority            GPT-5.3-Codex High Fast  [400K context, $3.5 / MTok In · $28 / MTok Out]
  gpt-5-3-codex-xhigh-priority           GPT-5.3-Codex XHigh Fast  [400K context, $3.5 / MTok In · $28 / MTok Out]

Kimi K2.6 (kimi-k2.6)
  kimi-k2-6                              Kimi K2.6  [262144 context, $0.95 / MTok In · $4 / MTok Out]

Nemotron 3 Ultra (nemotron-3-ultra)
  nemotron-3-ultra-nvfp4                 Nemotron 3 Ultra  [262144 context, $0.6 / MTok In · $2.4 / MTok Out]

SWE-1.6 (swe-1.6)
  swe-1-6                                SWE-1.6  [200K context, Free]

SWE-1.6 Fast (swe-1.6-fast)
  swe-1-6-fast                           SWE-1.6 Fast  [200K context, $0.3 / MTok In · $1.5 / MTok Out]

Gemini 3.1 Pro (gemini-3.1-pro)
  gemini-3-1-pro-low                     Gemini 3.1 Pro Low Thinking  [1048576 context, $2 / MTok In · $12 / MTok Out]
  gemini-3-1-pro-high                    Gemini 3.1 Pro High Thinking  [1048576 context, $2 / MTok In · $12 / MTok Out]

Gemini 3 Flash (gemini-3-flash)
  MODEL_GOOGLE_GEMINI_3_0_FLASH_MINIMAL  Gemini 3 Flash Minimal  [1048576 context, $0.5 / MTok In · $3 / MTok Out]
  MODEL_GOOGLE_GEMINI_3_0_FLASH_LOW      Gemini 3 Flash Low  [1048576 context, $0.5 / MTok In · $3 / MTok Out]
  MODEL_GOOGLE_GEMINI_3_0_FLASH_MEDIUM   Gemini 3 Flash Medium  [1048576 context, $0.5 / MTok In · $3 / MTok Out]
  MODEL_GOOGLE_GEMINI_3_0_FLASH_HIGH     Gemini 3 Flash High  [1048576 context, $0.5 / MTok In · $3 / MTok Out]

DeepSeek V4 Pro (deepseek-v4-pro)
  deepseek-v4                            DeepSeek V4 Pro  [1048576 context, $1.74 / MTok In · $3.48 / MTok Out]

Pass a family slug, alias, or model UID to `--model` (e.g. `--model opus`)
or switch models in a session with `/model <name>`.
[0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/SKILL.md[90m [offset=185, limit=28][0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/SKILL.md[90m [offset=327, limit=31][0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md[90m [offset=124, limit=88][0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md[90m [offset=245, limit=25][0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md[90m [offset=385, limit=12][0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md[90m [offset=482, limit=18][0m
[0m
[0m$ [0mrg -n 'devin -p "' "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md" "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md"
(no output)
[0m
[0m$ [0mrg -n 'devin -p --|devin --sandbox -p --|\*\*GLM\*\*' "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md" "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:68:After installation, run `devin` for the interactive REPL or `devin -p -- "prompt"` for non-interactive use.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:134:devin -p -- "prompt"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:135:devin -p -- "prompt words here"    # Same, using -- separator
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:155:devin -p --model opus -- "Refactor utils.ts to use async/await"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:158:devin -p --permission-mode accept-edits -- "Add error handling to auth.ts"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:167:devin --sandbox -p -- "Run the test suite and fix failures"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:170:devin -p --prompt-file ./prompt.txt
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:199:| **GLM** | `glm-5-2`, `glm-5-2-max`, `glm-5-2-1m`, `glm-5-2-max-1m`, `glm-5-2-none`, `glm-5-2-none-1m` | Open-source model tasks |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:207:devin -p --model swe -- "list all TODO comments"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:259:RESULT=$(devin -p --model adaptive -- "List all exported functions in src/")
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:263:devin -p --model adaptive -- "Generate SQL schema for users table" | psql -d mydb -f -
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:266:devin -p --model adaptive -- "Analyze auth flow" > /tmp/analysis.txt 2>/tmp/errors.txt
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:391:git diff HEAD~1 | devin -p --model adaptive -- "Summarize these changes"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:394:cat src/auth.ts | devin -p --model adaptive -- "Add input validation to all functions"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:488:devin -p --permission-mode auto --model adaptive -- "Map the authentication flow"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:491:devin -p --permission-mode accept-edits --model adaptive -- "Add error handling to all API routes"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:494:devin -p --permission-mode dangerous --model opus -- "Migrate database schema"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:497:devin --sandbox -p --model adaptive -- "Run the test suite and fix failures"
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:189:| OAuth ready | 1 | Proceed with `devin -p --model <model> --permission-mode <mode> -- "<prompt>"` |
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:330:- **Use `--` before every print-mode prompt** — `devin -p -- "list all TODO comments"` prevents the prompt from being parsed as CLI flags. The prompt must follow the separator, or load it with `--prompt-file`.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:343:6. **Redirect devin stdin from `/dev/null`** when dispatching in a `while read` loop. Pattern: `devin -p -- "$PROMPT" > "$LOG" 2>&1 </dev/null &`. Without `</dev/null`, the backgrounded devin process inherits the loop's stdin and silently consumes the remaining lines. See `references/integration-patterns.md#background-execution` → "Silent Stdin Consumption".
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:355:15. **Single-dispatch discipline (operator-gated, session-scoped)** — Default: launch ONE cli-* dispatch at a time across the cli-* family (cli-devin, cli-codex, cli-claude-code, cli-opencode, cli-cursor). Wait for the dispatched agent's work to return, verify outputs exist, then SIGKILL only the dispatch THIS skill started: capture its PID at launch (`devin -p -- ... & DEVIN_PID=$!`) and kill that captured PID directly plus its own orphan children (`kill -9 "$DEVIN_PID" 2>/dev/null; pkill -9 -P "$DEVIN_PID" 2>/dev/null`), then apply the same PID-scoped `gtimeout` cleanup. **Never use a blanket `pkill -9 -f "devin -p"` pattern** — that matches and kills EVERY running `devin` process on the machine, including the operator's unrelated devin sessions. Only launch the next dispatch (this skill OR a sibling) after the prior one is dead and RSS has dropped. **Within a deep-flow session** (deep-review / deep-research): the operator authorizes the whole multi-iteration session at start — iterations chain back-to-back with kill-between as the safety mechanism, NOT a per-iteration confirmation prompt. **Exception (cross-skill parallel)**: when the operator explicitly authorizes N parallel dispatches, run N concurrently — but still SIGKILL each by its own captured PID as its work returns.
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:356:16. **Set `AI_SESSION_CHILD=1` in the dispatched child's env** when sessions may be launched through the per-session worktree wrapper (`.opencode/bin/worktree-session.sh`). A dispatched `devin -p` is an orchestrated sub-session, not a new top-level session, so it must SHARE the parent's worktree rather than allocate its own. The wrapper checks `AI_SESSION_CHILD` (plus a `git --git-common-dir` structural backstop) and exec's in place when set. Pattern: `AI_SESSION_CHILD=1 devin -p -- ... </dev/null`. Harmless when the wrapper is not in use. See `.opencode/bin/README.md` → "Worktree session isolation".
[0m
FINDING: devinDocs
REVERIFIED: `devin --help` -> `Usage: devin [OPTIONS] [-- <PROMPT>...] [COMMAND]`; `devin models list` -> six GLM IDs confirmed.
STATUS: APPLIED
CHANGE: Updated both owned files; added `--` before every print prompt and replaced `glm` with all six live GLM IDs.
EVIDENCE: No bare `devin -p "` matches; `cli-reference.md:199` lists all six runtime IDs.
RISK: Documentation-only. Checked all owned-file invocations and live CLI output; runtime untouched.
