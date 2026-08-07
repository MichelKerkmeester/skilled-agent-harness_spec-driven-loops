# Research Synthesis — composer lineage

**Session:** fanout-composer-1785133613018-3fbdzo  
**Executor:** cli-cursor / composer-2.5-fast  
**Stop reason:** max_iterations (5/5 forced depth)  
**Scope:** `.opencode/` framework surface, repo-root config, runtime mirrors (`.claude/`, `.codex/`, `.cursor/`, `.devin/`). Excludes `.opencode/specs/`.

---

## Executive summary

Five divergent audit passes produced **22 evidence-backed findings** across dead code (CAT-1), legacy/superseded artifacts (CAT-2), scratch/residue (CAT-3), misplaced files (CAT-4), architecture drift (CAT-5), and over-engineering (CAT-6). Highest-impact clusters:

1. **Mirror and symlink drift** — broken install-guide symlink (F2), triplicated Devin hooks (F8), all 14 agents differ across OpenCode vs Claude mirrors (F19).
2. **Orphan guard/smoke scripts** — `cli-exit-taxonomy-smoke.cjs` (F1), `check-no-spec-imports.cjs` (F22) referenced from docs/tests only, not CI.
3. **Registry/metadata maintenance debt** — sk-design `auditFrame` without audit mode (F14), test-fixture `description.json` files in wrong locations (F16).
4. **Deep-loop operational weight** — dual reducers without fanout `artifactDir` support (F11), 17-script fanout cluster (F12).

Convergence telemetry (avg newInfoRatio 0.76) would have allowed early stop; operator **forced depth** completed all five angles.

---

## Ranked findings (by remediation leverage)

### P1 — Broken or divergent operator paths

| ID | CAT | Path | Summary | Proof command |
|----|-----|------|---------|---------------|
| F2 | CAT-4 | `.opencode/install-guides/MCP - Chrome Dev Tools.md` | Symlink → deleted pre-nesting path | `readlink '.opencode/install-guides/MCP - Chrome Dev Tools.md' && test -f .opencode/skills/mcp-tooling/mcp-chrome-devtools/INSTALL-GUIDE.md` |
| F19 | CAT-5 | `.opencode/agents/` vs `.claude/agents/` | All 14 agent files differ | `diff -rq .opencode/agents .claude/agents` |
| F8 | CAT-5 | `post-compaction.cjs` ×3 | Identical hook in opencode, claude, devin trees | `rg -l 'post-compaction' .opencode .claude .devin --glob '**/post-compaction.cjs'` |

### P2 — Dead or test-only code

| ID | CAT | Path | Summary | Proof command |
|----|-----|------|---------|---------------|
| F1 | CAT-1 | `.opencode/bin/cli-exit-taxonomy-smoke.cjs` | No caller except README | `rg -l cli-exit-taxonomy-smoke .opencode/bin .opencode/skills .opencode/commands .opencode/plugins \| grep -v specs` |
| F9 | CAT-1/4 | `system-skill-advisor/.../mk-skill-advisor-bridge.mjs` | Test-only references | `rg -l mk-skill-advisor-bridge .opencode/skills/system-skill-advisor/mcp-server --glob '*.{ts,mjs}'` |
| F22 | CAT-1 | `.opencode/bin/check-no-spec-imports.cjs` | Doc/test references only (~3) | `rg -l check-no-spec-imports .opencode/bin .opencode/plugins .opencode/skills \| grep -v specs \| wc -l` |

### P3 — Legacy cleanup candidates

| ID | CAT | Path | Summary | Proof command |
|----|-----|------|---------|---------------|
| F5 | CAT-2 | `.opencode/skills/system-spec-kit/:memory:` | Deleted sidecar; MCP DB canonical | `test -e .opencode/skills/system-spec-kit/:memory:` (expect fail) |
| F7 | CAT-2 | old `vectors/` hf-local shard | Double-dash filename removed; `__` shard live under mcp-server/database/vectors | `test -f .opencode/skills/system-spec-kit/mcp-server/database/vectors/context-vectors__hf-local__nomic-ai_nomic-embed-text-v1.5__768__q8.sqlite` |
| F18 | CAT-2 | `.opencode/commands/doctor/mcp.md`, `update.md` | Colon-form companions coexist with argv `/doctor` router | `rg 'doctor:mcp\|doctor:update' .opencode/commands/doctor/speckit.md` |

### P4 — Architecture simplification

| ID | CAT | Path | Summary | Simpler shape |
|----|-----|------|---------|---------------|
| F3 | CAT-5 | MCP launchers | spec-memory hardened; others stop with child | Align launchers or document dual-class permanently |
| F11 | CAT-5/6 | dual `reduce-state.cjs` | Fanout lineage reduce fails without artifactDir override | Single reducer honoring config.artifactDir |
| F14 | CAT-5 | `sk-design/mode-registry.json` | `auditFrame` without audit mode | Remove audit-era extension fields |
| F15 | CAT-6 | 7× compiled-routing feature-catalog | Duplicate hub catalogs | One canonical catalog + links |
| F12 | CAT-6 | fanout script cluster | 17 runtime scripts, heavy docs | Subcommands on fanout-run |

---

## Iteration map

| Iter | Angle | Findings |
|------|-------|----------|
| 001 | bin/ + launchers | F1–F4 |
| 002 | MCP-server trees | F5–F9 |
| 003 | deep-loop runtime | F10–F13 |
| 004 | hub metadata | F14–F17 |
| 005 | commands/agents/mirrors | F18–F22 |

Detail per finding: see `iterations/iteration-NNN.md`.

---

## Negative knowledge / ruled out

- Rollout `router.cjs` files are **not** import-dead — loaded dynamically by `014-runtime-engine/lib/compiled-route.cjs`.
- `node_modules` under `.opencode/skills/system-spec-kit/` is **gitignored**, not committed CAT-3 (local workspace residue only, F21).
- Vitest `:memory:` SQLite handles are unrelated to deleted `:memory:` filesystem artifact.

---

## Convergence report

| Metric | Value |
|--------|-------|
| Stop reason | max_iterations |
| Iterations completed | 5 |
| Average newInfoRatio | 0.76 |
| Threshold | 0.05 (telemetry only) |
| Questions answered | 5/5 |

---

## Remediation handoff

This lineage is **audit-only**. No files were modified outside `research/lineages/composer/`. Merge with sibling fan-out lineages before producing phase-level `findings-report.md`.
