# Triage worklist — devin (18 findings)

Re-test each claim. Record CONFIRMED, REFUTED or DEFERRED with the exact command used.

| # | finding | cat | path | claim |
|---|---|---|---|---|
| 1 | `devin-01:F1` | CAT-2 | `.opencode/skills/sk-code/benchmark/{after,baseline,full,live,live-remediated}/` | Superseded benchmark runs kept alongside canonical current runs |
| 2 | `devin-01:F2` | CAT-2 | `.opencode/skills/sk-code/benchmark/fixtures/sk-code/` | Legacy synthetic fixtures superseded by playbook corpus |
| 3 | `devin-01:F3` | CAT-2 | `.opencode/skills/sk-code/changelog/v3.0.0.0.md … v3.5.0.0.md (8 files)` | Pre-v4.0.0.0 changelog entries describe superseded flat architecture |
| 4 | `devin-01:F4` | CAT-2 | `.opencode/skills/sk-code/changelog/v4.0.0.0.md` | v4.0.0.0 scaffold-phase changelog superseded by v4.1.0.0 |
| 5 | `devin-01:F7` | CAT-6 | `.opencode/skills/sk-code/benchmark/ (12 dated subfolders + nested compiled-routing/ with 3 more)` | Over-engineered benchmark folder structure with 12+ dated sidecar runs |
| 6 | `devin-01:F8` | CAT-2 | `.opencode/skills/sk-code/changelog/v4.0.1.0.md` | v4.0.1.0 changelog subsumed by v4.1.0.0 restructure |
| 7 | `devin-01:F19` | CAT-6 | `.opencode/skills/sk-git/SKILL.md:54-202` | 149-line Python pseudocode router for 5-intent conditional loading |
| 8 | `devin-03:F12` | CAT-6 | `` | `doctor/scripts/check-mcp-mutation-class.sh` is a documented mutation-class guard that no route, workflow, or CI invokes |
| 9 | `devin-04:F1` | CAT-2 | `.claude/agents/ (real directory, not a symlink)` | `.claude/agents/` is a stale physical mirror of canonical `.opencode/agents/` |
| 10 | `devin-05:F2` | CAT-2 | `.opencode/skills/sk-code/benchmark/fixtures/sk-code/ (4 files: sk-code-loadspeed-001.{private,public}.json, sk-code-moti` | `sk-code/benchmark/fixtures/sk-code/` legacy fixtures the owning README marks superseded, with no live caller |
| 11 | `fanout:SOL-05` | CAT-6 | `.opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/deep-research-resume-adapter.ts` | A 4,667-line resume and shadow-parity pair composes a parallel transactional architecture not referenced by active research YAML. |
| 12 | `fanout:SOL-04` | CAT-6 | `.opencode/skills/system-code-graph/mcp-server/lib/shared/metrics-stub.ts` | Four production modules retain guarded metrics calls behind a provider that always disables emission and implements no-op methods. |
| 13 | `fanout:F18` | CAT-2 | `.opencode/commands/doctor/mcp.md` |  |
| 14 | `fanout:F5` | CAT-2 | `.opencode/skills/system-spec-kit/:memory:` |  |
| 15 | `fanout:F7` | CAT-2 | `.opencode/skills/system-spec-kit/vectors/` |  |
| 16 | `fanout:F12` | CAT-6 | `.opencode/skills/system-deep-loop/runtime/scripts/fanout-*.cjs` |  |
| 17 | `fanout:F15` | CAT-6 | `.opencode/skills/*/feature-catalog/compiled-routing-and-legacy-fallback/` |  |
| 18 | `fanout:F4` | CAT-6 | `.opencode/bin/lib/compiled-routing/005-decision-evaluator` |  |
