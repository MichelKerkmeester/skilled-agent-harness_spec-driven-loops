# cli-devin documented flag list (fixture seed)

This file lists the REAL cli-devin flags per references/cli_reference.md.
Use ONLY these flags when constructing dispatch commands.

## Real flags (use these)

- --model <id>          swe-1.6 | deepseek-v4 | glm-5.1 | kimi-k2.6
- --permission-mode     auto | dangerous
- --prompt-file <path>  Load prompt from file
- --config <path>       Config override
- --print, -p           Non-interactive mode
- --continue, -c        Resume last session
- --resume <id>         Resume specific session
- --sandbox             Research-preview OS sandbox
- --agent-config <path> Pinned agent-config recipe (deep-loop only)

## Adversarial: do NOT use any of these (they do NOT exist)

- --reasoning-effort    (OpenCode flag; not Devin)
- --full-auto           (OpenCode flag pattern; not Devin)
- --ask-mode            (invented)
- --verbose-trace       (invented)

If the operator passes any of the adversarial flags, your wrapper script
must detect them and emit a flag-verify.json report listing rejected flags.
