#!/usr/bin/env bash
# Generate one prompt file per review seat. Templates live in tpl_a.txt / tpl_b.txt
# (no in-script heredocs -> no bash quote-parsing surprises).
set -euo pipefail

ROOT="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public"
P007="$ROOT/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/007-release-alignment-review"
SCR="$P007/scratch"
A="$P007/001-readmes-vs-027"
B="$P007/002-code-vs-sk-code-opencode"

mkdir -p "$A/review/seats" "$A/review/deltas" "$A/review/iterations"
mkdir -p "$B/review/seats" "$B/review/deltas" "$B/review/iterations"

TPL_A="$(cat "$SCR/tpl_a.txt")"
TPL_B="$(cat "$SCR/tpl_b.txt")"

# ID|AREA_LABEL|GLOB (space-separated path patterns, no pipe chars)
SEATS_A='A01|spec-kit root+SKILL+top|.opencode/skills/system-spec-kit/README*.md .opencode/skills/system-spec-kit/SKILL.md
A02|spec-kit mcp_server READMEs|.opencode/skills/system-spec-kit/mcp_server/README*.md .opencode/skills/system-spec-kit/mcp_server/*/README*.md
A03|spec-kit references READMEs|.opencode/skills/system-spec-kit/references
A04|spec-kit scripts READMEs|.opencode/skills/system-spec-kit/scripts
A05|spec-kit constitutional+templates+shared|.opencode/skills/system-spec-kit/constitutional .opencode/skills/system-spec-kit/templates .opencode/skills/system-spec-kit/shared
A06|spec-kit feature_catalog+playbook|.opencode/skills/system-spec-kit/feature_catalog .opencode/skills/system-spec-kit/manual_testing_playbook
A07|skill-advisor root+SKILL+top|.opencode/skills/system-skill-advisor/README*.md .opencode/skills/system-skill-advisor/SKILL.md
A08|skill-advisor references+mcp_server|.opencode/skills/system-skill-advisor/references .opencode/skills/system-skill-advisor/mcp_server
A09|code-graph READMEs|.opencode/skills/system-code-graph
A10|deep-loop-runtime READMEs|.opencode/skills/deep-loop-runtime
A11|deep-loop-workflows root+mode roots|.opencode/skills/deep-loop-workflows/README*.md .opencode/skills/deep-loop-workflows/SKILL.md .opencode/skills/deep-loop-workflows/*/README*.md
A12|deep-loop-workflows refs+scripts|.opencode/skills/deep-loop-workflows/*/references .opencode/skills/deep-loop-workflows/*/scripts
A13|sk-code + sk-code-review|.opencode/skills/sk-code .opencode/skills/sk-code-review
A14|sk-doc + sk-prompt + small-model|.opencode/skills/sk-doc .opencode/skills/sk-prompt .opencode/skills/sk-prompt-models
A15|sk-git + sk-interface-design|.opencode/skills/sk-git .opencode/skills/sk-interface-design
A16|cli-* skills|.opencode/skills/cli-claude-code .opencode/skills/cli-codex .opencode/skills/cli-opencode
A17|mcp-* skills|.opencode/skills/mcp-chrome-devtools .opencode/skills/mcp-click-up .opencode/skills/mcp-code-mode .opencode/skills/mcp-figma .opencode/skills/mcp-open-design
A18|repo root + .opencode infra|README*.md AGENTS.md CLAUDE.md .opencode/agents .opencode/commands .opencode/bin .opencode/scripts .opencode/plugins .opencode/hooks .opencode/install_guides'

SEATS_B='B01|spec-kit mcp_server handlers|.opencode/skills/system-spec-kit/mcp_server/handlers
B02|spec-kit search pipeline+rerank|.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline .opencode/skills/system-spec-kit/mcp_server/lib/search/rerank
B03|spec-kit search+embeddings|.opencode/skills/system-spec-kit/mcp_server/lib/search .opencode/skills/system-spec-kit/mcp_server/lib/embeddings
B04|spec-kit storage+ops|.opencode/skills/system-spec-kit/mcp_server/lib/storage .opencode/skills/system-spec-kit/mcp_server/lib/ops
B05|spec-kit governance+lib|.opencode/skills/system-spec-kit/mcp_server/lib/governance .opencode/skills/system-spec-kit/mcp_server/lib
B06|spec-kit mcp_server top+shared|.opencode/skills/system-spec-kit/mcp_server/context-server.ts .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts .opencode/skills/system-spec-kit/shared
B07|spec-kit scripts memory+dist|.opencode/skills/system-spec-kit/scripts/memory .opencode/skills/system-spec-kit/scripts/dist
B08|spec-kit scripts spec+other|.opencode/skills/system-spec-kit/scripts/spec .opencode/skills/system-spec-kit/scripts
B09|advisor mcp_server core|.opencode/skills/system-skill-advisor/mcp_server
B10|advisor scripts+lib|.opencode/skills/system-skill-advisor/mcp_server/scripts .opencode/skills/system-skill-advisor/mcp_server/lib
B11|code-graph mcp_server core|.opencode/skills/system-code-graph/mcp_server
B12|code-graph lib+scripts|.opencode/skills/system-code-graph/mcp_server/lib .opencode/skills/system-code-graph/mcp_server/scripts
B13|deep-loop-workflows scripts|.opencode/skills/deep-loop-workflows/*/scripts
B14|deep-loop-runtime lib|.opencode/skills/deep-loop-runtime/lib .opencode/skills/deep-loop-runtime/scripts
B15|bin launchers+front-doors|.opencode/bin
B16|plugins|.opencode/plugins
B17|hooks + .opencode scripts|.opencode/hooks .opencode/scripts
B18|commands + build configs|.opencode/commands .opencode/skills/system-spec-kit/mcp_server/package.json .opencode/skills/system-spec-kit/mcp_server/tsconfig.json'

emit() {
  local table="$1" tpl="$2" specdir="$3" outdir="$4" id area glob p
  while IFS='|' read -r id area glob; do
    [ -z "${id:-}" ] && continue
    p="${tpl//%SEAT%/$id}"; p="${p//%AREA%/$area}"; p="${p//%GLOB%/$glob}"; p="${p//%SPECDIR%/$specdir}"
    printf '%s\n' "$p" > "$outdir/$id.prompt.txt"
  done <<< "$table"
}

emit "$SEATS_A" "$TPL_A" "$A" "$A/review/seats"
emit "$SEATS_B" "$TPL_B" "$B" "$B/review/seats"

echo "Track A prompts: $(ls "$A/review/seats"/A*.prompt.txt 2>/dev/null | wc -l | tr -d ' ')"
echo "Track B prompts: $(ls "$B/review/seats"/B*.prompt.txt 2>/dev/null | wc -l | tr -d ' ')"
