#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: INIT SKILL GRAPH
# ───────────────────────────────────────────────────────────────
# Validate skill graph metadata, rebuild the SQLite skill graph the
# runtime actually loads, refresh the JSON diagnostic export, and
# report the current advisor health from the repository root.

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. PATHS
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
# Derive repo root by stripping at /.opencode/ rather than counting parent dirs,
# so it resolves correctly at any nesting depth (e.g. a wrapped <root>/coder/.opencode layout).
REPO_ROOT="${SCRIPT_DIR%%/.opencode/*}"
SQLITE_PATH="${REPO_ROOT}/.opencode/skills/system-skill-advisor/mcp-server/database/skill-graph.sqlite"
JSON_PATH="${SCRIPT_DIR}/skill-graph.json"

# ───────────────────────────────────────────────────────────────
# 2. HELPERS
# ───────────────────────────────────────────────────────────────

log_step() {
    printf '[init-skill-graph] %s\n' "$1"
}

run_from_repo() {
    (
        cd "${REPO_ROOT}"
        "$@"
    )
}

# ───────────────────────────────────────────────────────────────
# 3. SETUP
# ───────────────────────────────────────────────────────────────

log_step "Repository root: ${REPO_ROOT}"

if [[ -f "${SQLITE_PATH}" ]]; then
    log_step "Detected SQLite skill graph: ${SQLITE_PATH}"
else
    log_step "SQLite skill graph missing: ${SQLITE_PATH}"
    log_step "SQLite will be created automatically when the MCP server starts."
fi

if [[ -f "${JSON_PATH}" ]]; then
    log_step "Detected JSON skill graph: ${JSON_PATH}"
else
    log_step "JSON skill graph missing: ${JSON_PATH}"
fi

log_step "Validating graph metadata"
run_from_repo python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py --validate-only

# The runtime loads ONLY the SQLite graph; the JSON export is a diagnostic
# artifact it ignores. Rebuild SQLite through the warm daemon when one owns
# the database (single-writer discipline), else index directly from the
# built dist — a cold maintenance context has no competing writer.
log_step "Rebuilding SQLite skill graph (runtime source of truth)"
if run_from_repo node .opencode/bin/skill-advisor.cjs skill_graph_scan --trusted --warm-only --format json --timeout-ms 60000 >/dev/null 2>&1; then
    log_step "SQLite rebuilt via warm advisor daemon"
else
    log_step "No warm daemon; indexing SQLite directly from dist"
    run_from_repo node --input-type=module -e "
        const { indexSkillMetadata } = await import('${REPO_ROOT}/.opencode/skills/system-skill-advisor/mcp-server/dist/mcp-server/lib/skill-graph/skill-graph-db.js');
        const result = indexSkillMetadata('.opencode/skills');
        console.log('[init-skill-graph] SQLite indexed:', result.indexedNodes, 'nodes,', result.indexedEdges, 'edges (', result.indexedFiles, 'files indexed,', result.skippedFiles, 'unchanged )');
        for (const warning of result.warnings.slice(0, 10)) console.warn('[init-skill-graph]', warning);
    "
fi

log_step "Exporting JSON skill graph (diagnostic only; ignored by the runtime)"
run_from_repo python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py --export-json

log_step "Running advisor health check"
run_from_repo python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py --health

log_step "Skill graph initialization complete"
