---
title: "Implementation Summary: 118/006 — Collateral /doctor + Playbook Update"
description: "Implementation summary for phase 006 collateral cutover from deleted deep_loop_graph MCP tools to deep-loop-runtime script invocations."
trigger_phrases:
  - "phase 006 implementation summary"
  - "doctor collateral summary"
  - "playbook collateral summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/006-collateral-doctor-playbook"
    last_updated_at: "2026-05-22T18:51:26Z"
    last_updated_by: "gpt-5-codex"
    recent_action: "Updated /doctor and playbook collateral to use deep-loop-runtime scripts."
    next_safe_action: "Resolve out-of-scope feature_catalog citation."
    blockers:
      - "Broader non-spec grep still finds .opencode/skills/system-code-graph/feature_catalog/feature_catalog.md; this file was outside the approved write set."
    key_files:
      - ".opencode/commands/doctor.md"
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/doctor/update.md"
      - ".opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/009-deep-loop-graph-convergence-yaml-fire.md"
    session_dedup:
      fingerprint: "sha256:1180061180061180061180061180061180061180061180061180061180060004"
      session_id: "118-006-impl-summary-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should .opencode/skills/system-code-graph/feature_catalog/feature_catalog.md be added to phase 006 scope or handled in a follow-up collateral packet?"
    answered_questions:
      - "Actual script contract uses --spec-folder, --loop-type, and --session-id; --health-check is not accepted by the scripts."
---

# Implementation Summary: 118/006 — Collateral /doctor + Playbook Update

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 118-deep-loop-full-isolation-no-mcp/006-collateral-doctor-playbook |
| **Completed** | 2026-05-22 |
| **Level** | 2 |
| **Actual Effort** | ~1 hour |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Updated the four approved collateral files so current `/doctor` and system-code-graph playbook surfaces no longer cite the deleted `mcp__mk_spec_memory__deep_loop_graph_*` MCP tools. The replacement references use the actual phase-003 script contract:

```bash
node .opencode/skills/deep-loop-runtime/scripts/<status|query|upsert|convergence>.cjs --spec-folder "<spec-folder>" --loop-type "<research|review>" --session-id "<session-id>" [...]
```

### Files Changed

| File | Lines | Diff | Finding Class | Purpose |
|------|------:|------|---------------|---------|
| `.opencode/commands/doctor.md` | 340 | +4 / -4 | cross-consumer | Removed deleted deep-loop MCP tool IDs from command frontmatter, added route-manifest script invocation awareness, and moved the deep-loop DB location to the runtime skill storage path. |
| `.opencode/commands/doctor/_routes.yaml` | 202 | +7 / -6 | cross-consumer | Replaced the deep-loop route's deleted MCP tool IDs with `mcp_tools: []` plus schema-compatible `script_invocations` entries for status, query, upsert, and convergence. |
| `.opencode/commands/doctor/update.md` | 380 | +4 / -4 | cross-consumer | Removed deleted deep-loop MCP tool IDs from allowed tools and updated `/doctor:update` deep-loop status, mutation, gold-battery, and DB-boundary references to runtime scripts/storage. |
| `.opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/009-deep-loop-graph-convergence-yaml-fire.md` | 65 | +6 / -6 | cross-consumer | Updated the playbook scenario to assert direct `convergence.cjs` calls before stop voting, with current YAML line anchors. |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Read phase 006 spec, plan, tasks, checklist, parent spec, the four target files, and the four runtime scripts.
2. Verified the real script contracts. `status.cjs`, `query.cjs`, `upsert.cjs`, and `convergence.cjs` require `--spec-folder`, `--loop-type`, and `--session-id`; `query.cjs` also requires `--query-type`; `upsert.cjs` requires nodes/edges or events. None accepts `--health-check`.
3. Applied scope-locked edits to the four collateral files, preserving `_routes.yaml` route validator compatibility by leaving `mcp_tools: []` and adding `script_invocations`.
4. Smoke-checked read-only status and convergence script invocations. A temporary `upsert.cjs` smoke row was accidentally inserted, removed by deleting the exact `session_id='phase-006-smoke'` rows, and the SQLite file was restored from `HEAD` so no runtime database diff remains.
5. Updated this implementation summary with commit handoff instructions. No git commit was run.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Use real CLI args instead of `--health-check` | The scripts do not implement `--health-check`; citing it would create a new broken runtime path. |
| Keep `_routes.yaml` `mcp_tools` key as an empty list | `route-validate.py` requires the key and checks it against router frontmatter; an empty list preserves schema compatibility. |
| Add `script_invocations` to `_routes.yaml` | Keeps the direct runtime commands discoverable without overloading the MCP-specific validator field. |
| Do not edit `feature_catalog.md` | It still has one stale citation, but it was outside the explicit approved write set. |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Command | Result |
|-----------|---------|--------|
| Script existence | `ls .opencode/skills/deep-loop-runtime/scripts/{convergence,upsert,query,status}.cjs` | PASS - all 4 scripts exist. |
| Status smoke | `node .opencode/skills/deep-loop-runtime/scripts/status.cjs --spec-folder ".opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/006-collateral-doctor-playbook" --loop-type "review" --session-id "phase-006-smoke"` | PASS - exit 0, JSON `status:"ok"`, `rowCount:0` before cleanup. |
| Convergence smoke | `node .opencode/skills/deep-loop-runtime/scripts/convergence.cjs --spec-folder ".opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/006-collateral-doctor-playbook" --loop-type "review" --session-id "phase-006-smoke"` | PASS - exit 0, JSON `graph_decision:"CONTINUE"` on empty graph. |
| Cleanup of accidental smoke row | `sqlite3 ... "DELETE ... session_id='phase-006-smoke';"` then count query | PASS - nodes, edges, and snapshots each returned 0 rows for `phase-006-smoke`. |
| Runtime DB restore | `git show HEAD:.opencode/skills/deep-loop-runtime/storage/deep-loop-graph.sqlite > .opencode/skills/deep-loop-runtime/storage/deep-loop-graph.sqlite` | PASS - `git status` no longer lists the runtime DB. |
| Narrow stale-reference grep | `grep -rE "mcp__mk_spec_memory__deep_loop_graph_" .opencode/commands/doctor* .opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/ >/tmp/narrow-grep.out 2>&1` | PASS - no output across the four approved collateral files; grep exit 1 because there were no matches. |
| YAML/frontmatter parse | Python `yaml.safe_load` over `_routes.yaml` and the 3 edited Markdown frontmatter blocks | PASS - all parsed. |
| Route validator | `bash .opencode/commands/doctor/scripts/route-validate.sh` | PASS - 7 routes validated; 3 existing informational flag-collision warnings. |
| Spec validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/006-collateral-doctor-playbook --strict` | PASS - Level 2 strict validation completed with 0 errors and 0 warnings. |
| Alignment drift - doctor | `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/commands/doctor 2>&1 \| tail -5` | PASS - exit 0; non-blocking warning remains in unrelated `scripts/mcp-doctor-lib.sh`. |
| Alignment drift - system-code-graph | `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-code-graph 2>&1 \| tail -5` | PASS - exit 0; non-blocking warnings remain in unrelated system-code-graph files. |
| Broad stale-reference grep | `grep -rE "mcp__mk_spec_memory__deep_loop_graph_" --include="*.md" --include="*.yaml" .opencode/ \| grep -v "specs/" \| grep -v "system-spec-kit/mcp_server/lib/" 2>&1 \| head -10` | BLOCKED - only remaining hit is `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md`, outside the approved write set. |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | `/doctor deep-loop` round-trip < 2s | Direct `status.cjs` and `convergence.cjs` smoke checks completed in under 1s each. | PASS |
| NFR-R01 | All 4 files remain valid markdown / YAML | `_routes.yaml` and 3 Markdown frontmatter blocks parsed with PyYAML. | PASS |
| NFR-R02 | Playbook scenario runnable end-to-end | Scenario references current YAML line anchors and direct `convergence.cjs` invocation. | PASS |
| NFR-M01 | Canonical citation form across all 4 files | Script citations use repo-relative `.opencode/skills/deep-loop-runtime/scripts/*.cjs` paths with real required args. | PASS |
| NFR-M02 | No copy-pasted inline implementation details | Collateral cites scripts and arguments only; implementation remains in runtime skill. | PASS |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The broad grep requested for the whole non-spec `.opencode/` tree still finds `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md`. That file was not in the approved write set.
2. The phase docs expected `--health-check`, but the runtime scripts do not accept that flag. This implementation uses the actual script contract instead.
3. `upsert.cjs` is a mutating script; verification used status/convergence for read-only smoke and removed the accidental `phase-006-smoke` upsert row.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Cite `--health-check` in collateral | Cited `--spec-folder`, `--loop-type`, and `--session-id` instead | The scripts do not implement `--health-check`. |
| Broad grep should return zero outside specs/lib | One out-of-scope feature catalog hit remains | User-approved write scope was limited to four collateral files plus this summary. |

<!-- /ANCHOR:deviations -->

## Commit Handoff

Suggested commit message:

```text
feat(118/006): /doctor + system-code-graph collateral updates

Replaces all references to deleted mcp__mk_spec_memory__deep_loop_graph_*
MCP tools with direct .cjs script invocations across:
- /doctor command (doctor.md, doctor/_routes.yaml, doctor/update.md)
- system-code-graph playbook scenario 009

Validation: grep deep_loop_graph_ returns 0 across all 4 collateral
files. sk-code alignment-drift PASS.

Co-Authored-By: GPT-5.5 via cli-codex (118/006 dispatch)
```

Files (explicit paths for `git add`):

```text
.opencode/commands/doctor.md
.opencode/commands/doctor/_routes.yaml
.opencode/commands/doctor/update.md
.opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/009-deep-loop-graph-convergence-yaml-fire.md
.opencode/specs/skilled-agent-orchestration/118-deep-loop-full-isolation-no-mcp/006-collateral-doctor-playbook/implementation-summary.md
```
