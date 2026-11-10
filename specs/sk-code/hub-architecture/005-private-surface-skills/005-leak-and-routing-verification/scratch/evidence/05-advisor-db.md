# 05 - Advisor database

Run on 2026-10-24. Path substitution: the throwaway database directory is `<SP>/psurf-db` instead of `/tmp/psurf-db`, and the workspace root is the clone `<SP>/psurf-clone-main` at `9129007915a2b6ada693440ad106fd8eefa5e589` (`SP=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad`). `SPECKIT_PRIVATE_SKILL_ROOTS` was unset for the rebuild, and the command ran from the operator checkout.

## A - Rebuild

```bash
DBDIR=<SP>/psurf-db
rm -rf "$DBDIR" && mkdir -p "$DBDIR"
SYSTEM_SKILL_ADVISOR_DB_DIR="$DBDIR" node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --json '{"force":true,"workspaceRoot":"<SP>/psurf-clone-main"}' --format json > <SP>/psurf-rebuild.json
echo "rc=$?"
jq -r '.data.skillCount' <SP>/psurf-rebuild.json
jq -r '(.data.summary.warnings // []) | map(select(test("EMPTY-SKILL-SCAN"))) | length' <SP>/psurf-rebuild.json
```

Output:

```text
rc=0
14
0
```

Further reading of the JSON: `status` is `ok`, `.data` keys are `diagnostics, freshnessAfter, freshnessBefore, generationAfter, generationBefore, reason, rebuilt, skillCount, skipped, summary`. The warnings listed are `NON-SKILL-METADATA: skipped ...` entries for fixture `graph-metadata.json` files, with zero `EMPTY-SKILL-SCAN`. The stderr file is 0 bytes. The nodes in the new database, from `SELECT id FROM skill_nodes ORDER BY id`:

```text
cli-classifier cli-external-orchestration cli-orca mcp-code-mode mcp-tooling sk-code sk-design sk-doc sk-git sk-prompt sk-vision system-deep-loop system-skill-advisor system-spec-kit
```

No `local-*` node is present (`SELECT id FROM skill_nodes WHERE id LIKE 'local-%'` returns 0 rows), as expected for a clone with no private roots.

Expected: skillCount of 14 or greater and no EMPTY-SKILL-SCAN warning

Result: held (`skillCount` 14, 0 `EMPTY-SKILL-SCAN` warnings).

## B - Query

```bash
sqlite3 -readonly <SP>/psurf-db/skill-graph.sqlite "SELECT count(*) FROM skill_nodes WHERE family = 'sk-code'"
sqlite3 -readonly <SP>/psurf-db/skill-graph.sqlite "SELECT count(*) FROM skill_nodes WHERE (id LIKE 'sk-code%' OR family = 'sk-code') AND (lower(id || ' ' || coalesce(domains,'') || ' ' || coalesce(intent_signals,'') || ' ' || coalesce(derived,'')) LIKE '%webflow%' OR lower(id || ' ' || coalesce(domains,'') || ' ' || coalesce(intent_signals,'') || ' ' || coalesce(derived,'')) LIKE '%obsidian%')"
```

Output:

```text
1
0
```

Expected: 1 as the positive control, then 0; the same surface query prints 1 at 583316d083

Result: held (control 1, surface query 0). The second control, the same surface query at `583316d083` printing 1, was not re-run in this lane. It is recorded in `00-preflight.md` as the baseline `1` for the step 5 query, but that file quotes the value without its command and output, so the second control is INFERRED and not observed in this phase. What would confirm it: rebuild a throwaway database from a checkout of `583316d083` and run the same query. The positive control that was observed is the sk-code family query printing `1` on the current database, which shows the query can match.

<!-- evidence:end -->
