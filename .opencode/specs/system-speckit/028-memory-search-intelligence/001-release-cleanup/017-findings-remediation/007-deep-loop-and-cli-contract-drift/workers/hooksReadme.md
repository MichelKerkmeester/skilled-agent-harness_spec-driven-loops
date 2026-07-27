[0m
> build · gpt-5.6-luna-fast
[0m
[0m✱ [0mGlob "**/*"[90m in .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks · 9 matches[0m
[0m✱ [0mGlob "*"[90m in .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks · 9 matches[0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/README.md
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/devin/README.md
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/codex/README.md
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/devin/dispatch-preflight-lint.mjs
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/devin/dispatch-audit-posttooluse.mjs
The live hook directory contains root adapters plus `codex/` and `devin/`; both sibling directories also contain their own README and the two adapter files. I’m updating only the parent README’s overview, tree, key-files, and entrypoint listings.
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/README.md[90m [offset=15, limit=112][0m
[0m% [0mPatch 1 file
The parent README now includes the actual root file, both sibling directories, each sibling README, and all six adapter files, with Devin coverage in every inventory section. I’m re-reading the edited ranges and re-listing the directory to confirm the documentation matches disk.
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/README.md[90m [offset=15, limit=112][0m
[0m✱ [0mGlob "**/*"[90m in .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks · 9 matches[0m
[0m✱ [0mGrep "devin/|Devin|runtime: "devin""[90m in .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/README.md · 23 matches[0m
[0m→ [0mRead .opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/README.md[90m [offset=123, limit=20][0m
FINDING: hooksReadme
REVERIFIED: `Glob(".../scripts/hooks/**")` returned root adapters plus `codex/` and `devin/`, each with README and two adapters; `Read(...)` confirmed lines 23, 63-66, 78, 131-132.
STATUS: APPLIED
CHANGE: `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/README.md` updated with complete directory inventory and Devin coverage.
EVIDENCE: `Glob` output matches the README directory tree, including `devin/dispatch-preflight-lint.mjs` and `devin/dispatch-audit-posttooluse.mjs`.
RISK: Documentation-only; runtime files unchanged. Checked actual filesystem paths and Devin adapter documentation.
