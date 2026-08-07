# Plugin Playbook Scenario Test Results

> Headless execution of all 11 `mcp-obsidian` plugin tie-in scenarios (`OBS-011..OBS-021`) by **cli-codex `gpt-5.6-luna` xhigh / fast** agents, run in parallel. Each agent ran in its **own isolated throwaway vault** (codex `--sandbox workspace-write`, cwd = the throwaway dir, `TMPDIR` redirected there) — no real vault and no repo file was written. Verdicts are backed by real command output (jq, schema checks, round-trips, 85k–104k tokens per agent), not model assertion.

## Result: 10 PASS · 0 FAIL · 1 SKIP

| Scenario | Plugin | Verdict | Evidence / reason |
|---|---|---|---|
| OBS-011 | beancount | **PASS** | Balanced ledger appended + validated (`bean-check`) |
| OBS-012 | obsidian-tables | **PASS** | `.table.md` file-layer round-trip + structural validation |
| OBS-013 | obsidian42-brat | **SKIP** | Needs network — sandbox blocks `api.github.com`; no captured release fixture. Environmental, not a scenario defect. |
| OBS-014 | health-md | **PASS** | File-layer mechanics + fallback guard; schema validated |
| OBS-015 | iconic | **PASS** | Rulebook backup + JSON round-trip (only `fileRules` + `showTagPillIcons` changed) |
| OBS-016 | charts | **PASS** | Manifest `3.9.0`, `chart`/`advanced-chart` fences, JSON/YAML keys, fixture alignment + round-trip |
| OBS-017 | dataview | **PASS** | Inline metadata + query-block contract, clean structural checks |
| OBS-018 | excalidraw | **PASS** | jq envelope + canonical round-trip bytes; render skipped (no app) |
| OBS-019 | obsidian-git | **PASS** | Git round-trip, clean status, one commit, byte-exact note validation |
| OBS-020 | outliner | **PASS** | Manifest `4.10.2`, all 11 settings keys matched the data model, JSON round-trip |
| OBS-021 | minimal | **PASS** | Theme activation via `appearance.json` + snippet, file-layer checks |

## Scope of "PASS"

PASS = the scenario's **file-layer create + structural validation** ran and passed (JSON parse, id/schema checks, `jq empty`, byte round-trip, isolation, cleanup). The **visual in-app render/reload** step is out of headless scope and was skipped in every scenario (requires a running Obsidian app) — this is by design; the scenarios operate plugin data, not plugin UI.

## Two-pass note

The first parallel pass produced 5 clean PASS and exposed a harness gap: 5 scenarios (OBS-014/016/018/020/021) skipped/failed because the agents' isolated workspaces lacked the skill's `assets/` fixtures and `references/`. A second pass gave those agents the skill (read-only, absolute path) while keeping writes contained to the throwaway vault — all 5 then passed. OBS-013 was excluded from the re-run (its blocker is network, not assets).

## Safety

No real Obsidian vault was touched; no file was written inside the git repo. Each agent could only write inside its own disposable workspace (verified: every scenario's teardown removed its throwaway vault, and a no-stray-files sweep passed). Unlike the earlier deep-review fan-outs, these were direct `codex exec` dispatches with no deep-loop write-containment guard, so there was no cross-run interference risk.
