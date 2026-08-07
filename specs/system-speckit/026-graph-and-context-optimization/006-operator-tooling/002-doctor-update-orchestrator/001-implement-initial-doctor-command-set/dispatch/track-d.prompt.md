# Codex dispatch: Track D — migration-manifest.json (3.3.0.0 → 3.4.1.0 chain)

## ROLE

You are Codex (gpt-5.5 high fast) dispatched by Claude Opus 4.7 to author the migration manifest that `/doctor:update --migrate` consumes. The manifest declares per-version deprecated files, schema migrations, and expected post-state for users skipping versions during upgrade.

Spec folder (pre-approved, skip Gate 3): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/`

## CONTEXT FROM PACKET (read first; treat as locked)

1. **`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/spec.md` §3.5 + REQ-008** — manifest must declare 3.3.0.0, 3.4.0.0, 3.4.1.0 blocks.
2. **`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/decision-record.md` ADR-008** — detect-and-recommend semantics, never auto-delete; manifest is the source for `--cleanup-legacy` flag behavior.
3. **`.opencode/commands/doctor/update.md` + `assets/doctor_update_*.yaml`** — the orchestrator that consumes this manifest. Read `--migrate` flag handling and `legacy` detection logic.
4. **`.opencode/skills/system-spec-kit/CHANGELOG.md`** (or `changelog/` dir) — read recent v3.3.0.0 / v3.4.0.0 / v3.4.1.0 entries for the actual schema changes and deprecated files.

## VERSION-CHAIN FACTS (from prior packet exploration)

- **3.3.0.0**: pre-current baseline. Continuity stored in legacy `memory/*.md` files. No `graph-metadata.json` per spec folder. Code-graph not yet SQLite-backed.
- **3.4.0.0**: Memory system rewrite. Continuity moved into spec docs (`_memory.continuity` in `implementation-summary.md`, `handover.md`, `decision-record.md`). Legacy `memory/*.md` files retired. Every spec folder now has machine-readable `graph-metadata.json`. Code-graph switched to SQLite-backed structural index.
- **3.4.1.0**: Doctor commands shipped (`/doctor:code-graph`, `/doctor:skill-budget`, `/doctor:mcp_install`, `/doctor:mcp_debug`, `/doctor:skill-advisor`). Skill Advisor live daemon. CocoIndex daemon idempotency fix. Code-graph tree-sitter recovery (5k → 56k nodes). Causal-graph routing active.

## IN_SCOPE_FILES (only these may be created)

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json`

## OUT_OF_SCOPE (forbidden)

- DO NOT modify any doctor command or YAML asset (those reference the manifest by path; the manifest itself is just data).
- DO NOT create migration scripts under `mcp_server/scripts/migrations/` in this Track — that's REQ-020 (P2, optional, deferred).
- DO NOT modify any spec packet docs.

## HARD CONSTRAINTS

1. **Valid JSON** — must `python3 -m json.tool < migration-manifest.json` cleanly.
2. **Schema declared at top of manifest** as a `$schema` field (URL or inline schema reference) so future manifests can be schema-validated.
3. **Per-version blocks** for 3.3.0.0, 3.4.0.0, 3.4.1.0 with the canonical structure (see Schema below).
4. **Detect-and-recommend semantics** per ADR-008 — manifest declares deprecated files but does NOT instruct deletion; `/doctor:update --cleanup-legacy` adds the explicit user-opt-in step.
5. **Idempotent operations** — all migrations must be safe to re-run. Manifest declares idempotency in metadata.
6. **Manifest gap detection** — manifest includes a `valid_source_versions` array listing which versions can be safely upgraded FROM. Versions outside this list trigger refusal in the orchestrator.
7. **Last-modified timestamp** field tracking when the manifest was last updated.

## SCHEMA (target structure for the manifest)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "name": "spec-kit-migration-manifest",
  "version": "1.0.0",
  "last_updated": "2026-05-09T00:00:00Z",
  "valid_source_versions": ["3.3.0.0", "3.3.0.1", "3.3.1.0", "3.4.0.0", "3.4.1.0"],
  "current_version": "3.4.1.0",
  "versions": {
    "3.3.0.0": {
      "released": "2026-04-XX",
      "summary": "1-line description of the version",
      "deprecated_files": [
        {
          "pattern": "memory/*.md",
          "reason": "Continuity moved to spec-doc frontmatter in 3.4.0.0",
          "action_on_cleanup": "delete (only with --cleanup-legacy)"
        }
      ],
      "schema_migrations": [
        {
          "id": "M-3.3.0.0-001",
          "description": "...",
          "target_db": "context-index.sqlite",
          "idempotent": true,
          "script": "scripts/migrations/3.3.0.0-to-3.4.0.0.py (Phase D2 deferred)"
        }
      ],
      "expected_post_state": {
        "files_present": [...],
        "files_absent": ["memory/*.md"],
        "schema_version": "..."
      }
    },
    "3.4.0.0": { ... },
    "3.4.1.0": {
      "released": "2026-05-XX",
      "summary": "Current version — no migration needed FROM this version (manifest is one-way upgrade)",
      "deprecated_files": [],
      "schema_migrations": [],
      "expected_post_state": { "schema_version": "current" }
    }
  },
  "upgrade_paths": [
    {
      "from": "3.3.0.0",
      "to": "3.4.1.0",
      "chain": ["3.3.0.0 → 3.4.0.0 → 3.4.1.0"],
      "steps": ["M-3.3.0.0-001", "M-3.4.0.0-001", "M-3.4.0.0-002"],
      "estimated_runtime_minutes": 10
    }
  ],
  "metadata": {
    "consumed_by": "/doctor:update --migrate",
    "authored_by": "packet 026/010-doctor-update-orchestrator (Track D)",
    "council_adr": "ADR-008 in 013/decision-record.md"
  }
}
```

Adapt the schema to match actual Spec Kit conventions you find while reading the codebase. The shape above is a starting target; refine as needed for accuracy.

## VERIFICATION (run after authoring; paste output)

```bash
MANIFEST=.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json

echo "=== Manifest file ==="
ls -la "$MANIFEST"

echo "=== JSON syntax ==="
python3 -m json.tool < "$MANIFEST" > /dev/null && echo "VALID" || echo "INVALID"

echo "=== Required top-level fields ==="
for key in '"$schema"' '"name"' '"version"' '"valid_source_versions"' '"current_version"' '"versions"' '"upgrade_paths"' '"metadata"'; do
  jq -e "has(${key#\"} | rtrimstr(\"\\\"\") | ltrimstr(\"\\\"\"))" "$MANIFEST" 2>/dev/null && echo "  $key: ✓" || \
    grep -F "$key" "$MANIFEST" >/dev/null && echo "  $key: ✓ (substring match)" || echo "  $key: MISSING"
done

echo "=== Per-version blocks present ==="
for v in 3.3.0.0 3.4.0.0 3.4.1.0; do
  jq -e ".versions[\"$v\"]" "$MANIFEST" > /dev/null 2>&1 && echo "  $v: ✓" || echo "  $v: MISSING"
done

echo "=== valid_source_versions includes 3.3.0.0 ==="
jq -r '.valid_source_versions[]' "$MANIFEST" | grep -q '3.3.0.0' && echo "✓" || echo "MISSING"

echo "=== upgrade_paths includes 3.3.0.0 → 3.4.1.0 chain ==="
jq -r '.upgrade_paths[] | select(.from=="3.3.0.0") | .to' "$MANIFEST" 2>/dev/null | grep -q '3.4.1.0' && echo "✓" || echo "MISSING"
```

## OUTPUT REQUIREMENT

1. File created (path).
2. Verification block output.
3. Constraint compliance yes/no per Hard Constraint 1-7.
4. Halt-and-report on any violation.

## MEMORY HANDBACK

Concise `MEMORY_HANDBACK` block (~10 lines): file created, schema fields populated, per-version block summary (deprecated files + migrations counts), valid_source_versions list, upgrade_paths chain, deviations, recommended next track (Phase E verification G1-G9).
