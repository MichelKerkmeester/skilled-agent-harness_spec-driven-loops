# Pre-Fix Gate Baselines (Phase 0 regression freeze)

Captured: 2026-07-16, repo HEAD `1508a744d3` (branch `skilled/v4.0.0.0`), BEFORE any WS1 edit.

## One-line gate results

- `package_skill.py .opencode/skills/mcp-tooling --check` -> **PASS** (exit 0; 5 warnings: description length, 3 recommended sections, smart-router markers — pre-existing, not remediation targets)
- `validate_skill_package.py .opencode/skills/mcp-tooling` (parent-skill-check path) -> **PASS**: `package_skill.py --check: PASS (exit 0)` + `parent-skill-check.cjs: PASS (exit 0)`
- Advisor ratchet (`system-skill-advisor/mcp_server tests/parity/scorer-eval-baseline-ratchet.vitest.ts`) -> **PASS 7/7** (3.31s). Committed baseline `scripts/routing-accuracy/scorer-eval-baseline.json` @ `2146dee114`: full_corpus_top1 153/200 (0.765), holdout_top1 57/78 (0.7308), ambiguity_top1 16/25 (0.64), unknown_count 13, gold_none_false_fire 5.

## Deterministic replay freeze (fixtures in this folder)

- `pre-fix-replay-hub.json` — 13 hub scenarios via `router-replay.cjs` `routeSkillResources` (hub-router.json projection): **6/13 intent match, 2/13 resource match**. Failing intents: MT-003 (no Figma recall, F001), MT-004 (six-mode bundle instead of defer, F003), MT-H02..MT-H06 (zero lexical recall, F004).
- `pre-fix-replay-packets.json` — 49 packet scenarios (loader-enumerated): **38/49 intent match** (chrome 6/8, clickup 4/7, aside 7/8, figma 8/9, refero 7/8, mobbin 6/9); 31/49 resource match. Packet fixes are Phase 2 scope (F012-F015); frozen here as the regression anchor.

Replay driver: harness `load-playbook-scenarios.cjs` (enumeration) + `router-replay.cjs` `routeSkillResources` (replay); gold read directly from scenario YAML frontmatter so the loader's known silent-skip (F008) cannot weaken the frozen gold.

Note: advisor probe capture (T004's probe half) not run in this session — the Phase 0 remainder brief scoped the baseline to package/parent/ratchet; probes remain open under T004.
