# Approved finding set

5 findings dispositioned CONFIRMED by phase 001 triage.

Every row was re-tested against the real tree. Re-verify against current HEAD before acting:
a concurrent session has been modifying this repository throughout.

| finding | cat | evidence command | note |
|---|---|---|---|
| `devin-01:F16` | CAT-1 | `rg -n --hidden --glob '!.git/**' --glob '*.{ts,tsx,js,cjs,mjs,sh,bash,zsh,yaml,yml,json,jsonc,toml,md,txt}' 'worktree-naming\.sh[^[:cntrl:]]*validate-remote-allowlist' .` | Whole-repository hits are documentation or historical records, not an executable external caller. |
| `devin-01:F17` | CAT-1 | `rg -n --hidden --glob '!.git/**' --glob '*.{ts,tsx,js,cjs,mjs,sh,bash,zsh,yaml,yml,json,jsonc,toml,md,txt}' 'worktree-naming\.sh[^[:cntrl:]]*skill-ids' .` | Whole-repository hits are changelog or worklist prose, not an executable external caller. |
| `devin-04:F11` | CAT-1 | `rg --hidden --no-ignore --files -g 'session-prime.js' -g 'user-prompt-submit.js' ".opencode/skills/system-spec-kit/mcp-server"` | The wrappers reference Copilot handlers, but only non-Copilot equivalents exist in the runtime tree. |
| `devin-04:F14` | CAT-1 | `git check-ignore -v ".env.example"` | Git attributes the ignored file directly to `.gitignore:22` and its `.env.*` pattern. |
| `devin-04:F6` | CAT-1 | `rg --hidden --no-ignore --files -g 'write.md' .` | The shortcut references `write.md`, but exhaustive file search finds no such agent. |
