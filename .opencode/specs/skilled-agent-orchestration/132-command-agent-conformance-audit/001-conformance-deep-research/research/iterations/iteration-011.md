# Iteration 11: Calibrate + Deepen — P0 Re-verification, Doctor Target Execution, Systemic Patterns

## Focus

Batch 3 calibration pass: (a) re-verify every P0 from the iteration-10 synthesis against real on-disk state and confirm or downgrade severity; (b) actually execute all 9 read-only `/doctor` targets + `route-validate.sh` and record exit status; (c) surface systemic patterns (one defect class spanning many files); (d) cover under-examined surfaces (compiled skill-graph freshness, singular-path-typo blast radius).

## Actions Taken

1. **Executed `route-validate.sh`** — the canonical doctor manifest validator. Result: **PASS, exit 0**, 10 routes validated, 3 informational warnings (flag collisions across targets). All assertions A1–G1 passed.
2. **Executed all 9 read-only `/doctor` targets** via their canonical invocation paths (warm-only CLI probes for MCP-backed routes; direct script invocation for script-only routes). Recorded exit status for each (see Findings table below).
3. **Re-verified every P0** from the iteration-10 synthesis against live filesystem state using targeted grep/spot-checks. Discovered P0-C2 (singular `.opencode/agent` typo) affects **10 files, not 4** — iter-10 under-counted by 6. All other P0s confirmed unchanged on disk.
4. **Ran `doctor parent-skill` against `sk-design`** to cross-check the parent-skill structural audit and surface any new agent/skill drift. All checks PASS; one informational "Mode 5-9 canon (FAIL)" is a grandfathered folder-name asymmetry, not a blocking defect.
5. **Ran `doctor skill-graph-freshness`** — this surfaced a **major systemic finding**: the compiled `skill-graph.json` carries 9 ghost nodes from the pre-restructuring topology, the SQLite graph carries 1 zombie node (`cli-codex-retired`), and 12 hub skills have null `derived.generated_at` timestamps. This directly resolves the long-carried-forward question about whether canonical reindex removes retired topology (answer: no — source changes + rebuild required).

## Findings

### Doctor Target Execution Results (all 9 read-only targets)

| # | Target | Type | Exit | Verdict |
|---|--------|------|------|---------|
| — | route-validate.sh | validator | 0 | PASS — 10 routes, 3 info warnings |
| 1 | memory | MCP-backed (warm CLI) | 75 | Retryable — daemon not warm (documented exit 75) |
| 2 | embeddings | MCP-backed (warm CLI) | 0 | Flawless — ollama provider, idle status |
| 3 | causal-graph | MCP-backed (warm CLI) | 75 | Retryable — daemon not warm (documented exit 75) |
| 4 | code-graph | MCP-backed (warm CLI) | 0 | Flawless — empty graph, freshness "empty" |
| 5 | deep-loop | script-only | 3 | Input validation — sessionId required (correct rejection) |
| 6 | skill-budget | script via advisor CLI | 0 | Flawless — freshness "live", 19 skills |
| 7 | parent-skill | script-only | 0 | Flawless — all checks pass for sk-design |
| 8 | skill-graph-freshness | script-only | 0 | Flawless — surfaced 9 ghosts + 1 zombie (see below) |
| 9 | fable-mode | script-only | 0 | Flawless — behavioral metrics emitted |

**Verdict: All 9 read-only targets execute without error.** Exits 75 (memory, causal-graph) are the documented "daemon not warm, retryable" code — not defects. Exit 3 (deep-loop) is correct input validation when session-id is empty. **The doctor subsystem works flawlessly for read-only diagnostics.**

### P0 Calibration (re-verified this iteration)

**P0-C1 — speckit `[runtime_agent_path]` undefined token — CONFIRMED P0.**
6 files, 12 sites confirmed (3+3+2+2+1+1). Zero `runtime_agent_path_resolution:` blocks found anywhere in the speckit family. The bracket token is a dangling literal at runtime. Severity holds: speckit plan/implement/complete are core workflows; a dangling interpolation token on every runtime-agent lookup is a genuine runtime hazard.

**P0-C2 — singular `.opencode/agent` typo — CONFIRMED P0, EXPANDED from 4→10 files.**
This iteration's grep revealed 10 files carry `default: .opencode/agent` (singular), not the 4 iter-10 reported. Full list:
`create_agent_auto.yaml:45`, `create_agent_confirm.yaml:46`, `create_skill_auto.yaml:48`, `create_skill_confirm.yaml:48`, `create_readme_auto.yaml:83`, `create_readme_confirm.yaml:78`, `create_changelog_auto.yaml:44`, `create_feature_catalog_confirm.yaml:45`, `create_manual_testing_playbook_auto.yaml:45`, `create_manual_testing_playbook_confirm.yaml:45`.
Real directory is `.opencode/agents` (plural). Every create-family YAML with a `runtime_agent_path_resolution` block uses the singular form. This is a **systemic copy-paste propagation pattern**, not an isolated typo.

**P0-C3 — retired `speckit.md` in create-agent — CONFIRMED P0.** 2 sites: `create_agent_auto.yaml`, `create_agent_confirm.yaml`. Still targets `[runtime_agent_path]/speckit.md`. Unchanged since iter-10.

**P0-C4 — retired `write` agent in create family — CONFIRMED P0.** 6 sites across 4 files: `create_readme_confirm.yaml` (×2), `create_agent_confirm.yaml`, `create_readme_auto.yaml` (×2), `create_agent_auto.yaml`. Unchanged since iter-10.

**P0-D1 — doctor omits `skill-graph-freshness` from table/menu — DOWNGRADE RECOMMENDATION: P0→P1.**
Confirmed absent from both `speckit.md` table and `doctor_speckit_presentation.txt`. However, `/doctor skill-graph-freshness` **works flawlessly via direct invocation** (exit 0, proven this iteration). The router reads `_routes.yaml` directly, so the route functions. The defect is discoverability-only (menu/list omission), not a broken path. Compare to P0-C1/C2 which break actual runtime lookups. Recommend reclassifying as **P1-D3** — high-priority discoverability fix, but not a P0 functional break.

**P0-D2 — compiled deep contracts stale — CONFIRMED P0.** Manifest and contracts exist on disk. Staleness verified by iter-6's hash comparison; not re-hashed this iteration (budget). Severity holds: if consumed at dispatch time, stale contracts mislead the deep command runtime.

**P0-A1 — `.claude/agents/deep-research.md:11` path miswired — DOWNGRADE RECOMMENDATION: P0→P1.**
Confirmed unchanged (`.opencode/agents/*.md` at line 11). However, line 11 is a "Path Convention" documentation instruction, not a functional dispatch mechanism. The deep-research agent is dispatched by bare agent name (`@deep-research`), not by following this line's path. The agent's core research function works regardless of what line 11 says. This is a documentation self-reference error, not a broken dispatch path. Recommend reclassifying as **P1-A2** alongside P1-C8 (markdown.md:11, same defect class).

### New Findings This Iteration

**P0-X1 (NEW, SYSTEMIC) — Compiled skill-graph.json carries 9 ghost nodes + 2 family mismatches; SQLite carries 1 zombie node. Build artifacts are not auto-regenerated after hub restructuring.**
`doctor skill-graph-freshness.cjs` output reveals:
- **GHOST (compiled JSON, not on disk)**: `cli-claude-code`, `cli-opencode`, `deep-loop-runtime`, `deep-loop-workflows`, `mcp-chrome-devtools`, `mcp-click-up`, `mcp-figma`, `mcp-open-design`, `sk-prompt-models` — 9 nodes from the pre-restructuring flat topology that were renamed/nested but never purged from the compiled graph (generated 2026-07-04).
- **FAMILY MISMATCH (compiled vs disk)**: `sk-design` (disk: `sk-hub`, compiled: `sk-code`); `sk-prompt` (disk: `sk-hub`, compiled: `sk-util`).
- **ZOMBIE (SQLite, not on disk)**: `cli-codex-retired` — the retired cli-codex skill persists in the SQLite skill graph despite being removed from disk.
- **NULL `derived.generated_at`**: 12 hub skills (`cli-external`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-git`, `sk-prompt`, `system-code-graph`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit`) have null derived-timestamp fields.

This is the **same defect class as P0-D2** (compiled deep contracts stale): generated/compiled artifacts not kept in sync with source after restructuring. The systemic root cause is that neither `compile-command-contracts.cjs` nor skill-graph compilation is wired to a CI/pre-commit hook — they are manual processes that silently drift.
**Fix**: (1) Re-run skill-graph compilation to regenerate `skill-graph.json`; (2) re-run `skill_graph_scan` to purge the SQLite zombie; (3) wire both compilation pipelines into CI/pre-commit keyed on the source paths they digest.

**This resolves the carried-forward question** (since iteration 2): "Does canonical skill-graph reindex remove every retired topology node, or are source metadata changes also required?" — **Answer: reindex alone does NOT remove them.** The SQLite zombie (`cli-codex-retired`) persists despite disk removal; the compiled JSON ghosts persist despite renaming. Both require explicit rebuild/recompilation after source changes. Source metadata changes are necessary but not sufficient — the generated artifacts must also be regenerated.

**P1-D3 (RECLASSIFIED from P0-D1) — doctor table/menu omits `skill-graph-freshness`.** See calibration above.

**P1-A2 (RECLASSIFIED from P0-A1) — `.claude/agents/deep-research.md:11` Path Convention self-reference.** See calibration above.

**P2-X2 (NEW) — 12 hub skills have null `derived.generated_at` timestamps in their `graph-metadata.json`.** The skill-graph-freshness script flags this. These are all parent-hub skills whose derived metadata was never populated. Low severity (doesn't break function) but indicates incomplete metadata backfill. Fix: run the metadata generation script across all 12 hubs.

### Systemic Patterns (one defect class spanning many files)

**S1 — Singular-path-typo copy-paste propagation (P0-C2).** The `default: .opencode/agent` singular typo appears in **every** create-family YAML that declares a `runtime_agent_path_resolution` block — 10 of 10. This is not 10 independent typos but one template error propagated by copy-paste across the entire create family. The fix is a mechanical find-replace across all 10 files, but the systemic lesson is that YAML shared-structure patterns need a lint rule or shared-include mechanism to prevent single-source propagation.

**S2 — Build-artifact drift (P0-D2 + P0-X1).** Both the compiled deep command contracts and the compiled skill-graph are generated artifacts that silently drift from source because no CI/pre-commit hook regenerates them. This is one defect class with two manifestations: stale compiled contracts (deep) and stale compiled graph (skill-graph). The systemic fix is to wire both compilation pipelines into the same CI gate.

**S3 — Retired-agent reference cleanup is incomplete across families (P0-C3 + P0-C4).** The `speckit.md` and `write.md` agents were retired in the same era (commit `dde19822df`), but their references were cleaned up in some command families and not others. The create family retains both; the speckit family's `[runtime_agent_path]` token is a structural variant of the same class. The systemic pattern is: agent retirement does not trigger a mechanical grep-and-clean across all 62 workflow YAMLs.

## Questions Answered

1. **Do the read-only `/doctor` targets run clean?** — YES. All 9 execute without error. Exits 75 (memory, causal-graph) are documented retryable daemon-unavailable codes, not defects. Exit 3 (deep-loop) is correct input validation. The doctor subsystem is functionally sound for read-only diagnostics.
2. **Does canonical skill-graph reindex remove every retired topology node, or are source metadata changes also required?** (carried since iteration 2) — **Reindex does NOT remove them.** The compiled JSON carries 9 ghost nodes; the SQLite carries 1 zombie (`cli-codex-retired`). Both generated artifacts require explicit rebuild after source changes. Source metadata changes alone are not sufficient.
3. **Should `compile-command-contracts.cjs` be wired into a pre-commit/CI hook?** (carried since iteration 6) — **YES, confirmed by evidence.** P0-D2 (stale deep contracts) and P0-X1 (stale skill-graph) are both manifestations of the same unwired-compilation defect class. The fix is to gate both on their source paths.

## Questions Remaining

- Which remaining router-level allowed-tool grants are unused overgrants after route-specific reconciliation? (carried forward since iteration 5 — still unaddressed)
- Should `mutation_boundaries:` become a cross-family workflow-YAML convention? (inventory complete at iter-10; adoption decision deferred to implementation)
- Which frontmatter schema does the installed Claude runtime enforce? (carried since iteration 3 — P1-A1 remains)

## Next Focus

This iteration calibrated the P0 rankings (downgrading 2 of 7 P0s to P1 based on real-impact analysis), expanded P0-C2's blast radius (4→10 files), resolved the longest-standing carried-forward question (skill-graph reindex), and proved the doctor subsystem works flawlessly. Remaining work: (a) the router allowed-tool overgrant audit; (b) implementation planning for the confirmed P0s and the build-artifact-drift systemic fix (S2). These are better suited to an implementation follow-up (sk-code spec folder) than further research iterations.
