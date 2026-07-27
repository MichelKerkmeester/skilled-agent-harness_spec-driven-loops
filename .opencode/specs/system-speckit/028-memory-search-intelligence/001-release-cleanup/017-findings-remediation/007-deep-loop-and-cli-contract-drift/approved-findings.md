# Approved finding set

6 findings dispositioned CONFIRMED by phase 001 triage.

Every row was re-tested against the real tree. Re-verify against current HEAD before acting:
a concurrent session has been modifying this repository throughout.

| finding | cat | evidence command | note |
|---|---|---|---|
| `devin-02:F3` | CAT-5 | `node -e 'const fs=require("fs");const d=".opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/";const s=fs.readFileSync(d+"README.md","utf8");console.log("devinDir="+fs.statSync(d+"` | The live `devin/` directory is omitted while `codex/` is documented. |
| `devin-04:F3` | CAT-5 | `node ".opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs" ".codex/agents/code.toml"` | The workflow enrolls Codex changes, but the checker reports no agent files for a Codex agent path. |
| `fanout:SOL-02` | CAT-5 | `wc -l .opencode/bin/mk-spec-memory-launcher.cjs .opencode/bin/mk-skill-advisor-launcher.cjs .opencode/bin/mk-code-index-launcher.cjs .opencode/bin/lib/launcher-ipc-bridge.cjs .opencode/bin/lib/launch` | launcher-(ipc-bridge\ |
| `fanout:SOL-03` | CAT-5 | `rg --files --hidden --glob '!.git/**' \` | rg 'shared-payload\.ts$'; wc -l .opencode/skills/system-spec-kit/mcp-server/lib/context/shared-payload.ts .opencode/skills/system-skill-advisor/mcp-server/lib/shared/shared-payload.ts .opencode/skills |
| `fanout:SOL-07` | CAT-5 | `rg -n --hidden --glob '!.git/**' 'legacyBodyPath\` | compiledContractPath\ |
| `fanout:SOL-08` | CAT-5 | `for spec in '.opencode/agents/*.md' '.claude/agents/*.md' '.codex/agents/*.toml'; do set -- $~spec; printf '%s definitions=%s\n' "$spec" "$#"; done; for f in .opencode/agents/README.txt .claude/agent` | \ |

## Additional defects hit directly while running this program

These were not in the audit finding set. Each was encountered as a live dispatch failure during the
audit and triage, and each is confirmed by the failure itself.

| # | Defect | Evidence | Impact |
|---|--------|----------|--------|
| X-1 | `cli-devin/SKILL.md:189` shows `devin -p --model M --permission-mode P "<prompt>"` with a bare positional prompt | The CLI rejects it: `error: unexpected argument`. Usage is `devin [OPTIONS] [-- <PROMPT>...]`; the prompt needs `--` or `--prompt-file` | Any dispatch following the documented form fails outright |
| X-2 | `cli-devin/references/cli-reference.md:199` lists the GLM model as short name `glm` | `devin models list` shows no such alias; live ids are `glm-5-2`, `glm-5-2-max`, `glm-5-2-1m`, `glm-5-2-none` | A dispatch using the documented id fails on an invalid model |
| X-3 | `/deep:research --lineage-timeout-hours` documented at `research.md:142` as raising the ceiling above 4h | `fanout-run.cjs:1130` sets `LINEAGE_LIFETIME_HARD_MAX_HOURS = 4` and throws on any override above it | First fan-out dispatch of this audit died on it |
| X-4 | `opencode run --format` accepts only `default` and `json` | `--format text` exits 1 with a usage dump | The sol triage lane failed its first run on this |

X-1 and X-2 sit in `cli-devin`, which a concurrent session was actively modifying during this work.
Re-verify both against current HEAD before editing.
