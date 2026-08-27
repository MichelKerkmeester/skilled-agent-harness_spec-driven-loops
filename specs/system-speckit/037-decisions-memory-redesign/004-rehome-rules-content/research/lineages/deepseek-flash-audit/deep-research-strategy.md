---
title: Deep Research Strategy - Constitutional Deprecation Audit (detached fan-out lineage)
description: Persistent brain for the deepseek-flash-audit lineage; tracks focus, findings, next focus across 10 iterations.
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose
Constitutional-memory DEPRECATION-COMPLETENESS audit across the ENTIRE repo. Produce one deduped inventory (touchpoint | file:line | class [DONE|TODO|KEEP-AS-DOC|DELETE] | action), a ranked deprecation checklist, load-bearing link retarget set, post-deprecation test assertions, and every consumer that would break.

### Usage
- Agent reads Next Focus each iteration, writes iterations/iteration-NNN.md, appends JSONL record, updates this file.

---

## 2. TOPIC
GOAL: Constitutional-memory DEPRECATION-COMPLETENESS audit across the ENTIRE repo. Find EVERY touchpoint of the constitutional-memory system (code, commands, tests, READMEs, SKILL.md, hooks, root docs, the folder, the DB) and produce one deduped inventory + a per-touchpoint action, so NOTHING is missed.

---

## 3. KEY QUESTIONS (remaining)

- [ ] Q1: Complete file:line inventory of CODE touchpoints (includeConstitutional sites, importance-tiers constitutional tier, formatters, session-prime, learned-feedback, checkpoints)?
- [ ] Q2: Complete file:line inventory of COMMAND touchpoints (/memory:learn, /memory:manage, /memory:search + presentation assets)?
- [ ] Q3: Complete inventory of TEST touchpoints + what each MUST assert AFTER deprecation?
- [ ] Q4: Complete inventory of README/SKILL/hook/advisor-render/feature-catalog/manual-testing touchpoints?
- [ ] Q5: Complete inventory of ROOT-DOC links to constitutional/*.md, separated load-bearing vs spec-history?
- [ ] Q6: Per-file verdict on the 20 constitutional rule files (unique content vs safe-to-delete; rehome target)?
- [ ] Q7: DB tier state: 21 indexed rows, tier config, rewrite vs delete decision, vector-store + memory-index scan sites?
- [ ] Q8: Deduped master inventory with classes [DONE|TODO|KEEP-AS-DOC|DELETE]?
- [ ] Q9: Ranked deprecation checklist honoring constraints (enforcement stays in hooks/render.ts; KEEP memory-system-spec-kit-only; KEEP continuity; no new surface) + consumers that lose steering/break + load-bearing retarget set + dist rebuild/daemon restart note?
- [ ] Q10: Verification sweep — any missed surfaces (docs outside root, scripts, configs, benchmarks)?

---

## 4. NON-GOALS
- Do NOT re-derive confirmed grounding (three-memory taxonomy, enforcement location, owner direction, committed a1d2b84a1e search flip).
- Do NOT rewrite spec history (~420 raw refs, most in spec history).
- Do NOT implement fixes; report findings only.
- Do NOT modify anything outside the lineage artifact dir.

---

## 5. STOP CONDITIONS
- maxIterations (10) reached — hard stop policy per config.stopPolicy.
- Convergence before that is telemetry only; broaden review angles instead of synthesizing early.

---

## 6. ANSWERED QUESTIONS
- ALL 10 QUESTIONS ANSWERED (Q1-Q10) across iterations 1-10. Synthesis: `research.md` in this lineage dir.
- Q1 (CODE): Iter 1 · Q2 (COMMANDS): Iter 2 · Q3 (TESTS): Iter 3 · Q4 (README/SKILL/hook/advisor/playbook): Iter 4 · Q5 (ROOT DOCS): Iter 5 · Q6 (FOLDER): Iter 6 · Q7 (DB): Iter 7 · Q8 (DEDUP INVENTORY): Iter 8 · Q9 (CHECKLIST + CONSUMERS + RETARGET): Iter 9 · Q10 (VERIFICATION SWEEP + ASSERTIONS): Iter 10.

---

## 7. WHAT WORKED
- Per-directory targeted greps (lib/handlers/hooks/formatters/tools) — avoids spec-history noise (Iter 1)
- files_with_matches first, then context-grep at hit lines — efficient triage (Iter 1)

---

## 8. WHAT FAILED
- Glob exclusion patterns (`!{tests,...}/**`) in grep silently returned no matches — abandoned for per-directory paths (Iter 1)

---

## 9. EXHAUSTED APPROACHES (do not retry)
[None yet]

---

## 10. RULED OUT DIRECTIONS
- [NOT tracked] Whole-repo raw grep of `constitutional` (7974 md hits): mostly spec history; use targeted surface greps instead. (iteration 0)

---

## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

---

## 11. NEXT FOCUS
COMPLETE — synthesis at `research.md`. No further iterations (maxIterationsReached).

---

## 12. KNOWN CONTEXT

### Confirmed Grounding (from dispatch; do NOT re-derive)
- THREE memory systems; only (A) constitutional in scope. (A) = 20 static rule files in `.opencode/skills/system-spec-kit/constitutional/`, indexed as a DB tier (alwaysSurface, 3x boost, decay:false; 21 rows). (B) spec-folder continuity = KEEP untouched. (C) DB learned-triggers = 30-day TTL, verified 0 rows, dead.
- Enforcement NOT in rule files (hooks + classifiers enforce hygiene/Gate-3/dispatch); 3 every-turn directives HARDCODED in advisor render.ts, not read from constitutional/*.md; tier decorative; cold-start injection DEAD CODE; shouldAlwaysSurface has NO production callers; includeConstitutional (not alwaysSurface) is the lever.
- OWNER DIRECTION: deprecate constitutional LAYER completely; KEEP rules as plain docs (rehome unique long-forms into root docs or keep few as unindexed reference docs); NO new DECISIONS.md surface; memory-system-spec-kit-only rule STAYS (native-memory ban intact); spec-kit memory MCP + continuity STAY.
- ALREADY DONE (committed a1d2b84a1e): includeConstitutional default flipped to false at 3 search sites (memory-search.ts, memory-context.ts x2, vector-index-queries.ts).

### Bounded Context Snapshot (pointer-based)
- Constitutional folder: `.opencode/skills/system-spec-kit/constitutional/` — README.md + 20 rule files (confirmed by ls).
- MCP server root: `.opencode/skills/system-spec-kit/mcp-server/` (api, core, data, database, formatters, handlers, hooks, lib, tools, shared, scripts, tests).
- Commands: `.opencode/commands/memory/{learn,manage,save,search}.md` + `assets/{learn,manage,save,search}-presentation.txt`.
- Root docs: AGENTS.md, BARTER.md, CLAUDE.md, CONTRIBUTING.md, PUBLIC-RELEASE.md, README.md, `.claude/CLAUDE.md`.
- Spec folder: `specs/system-speckit/037-decisions-memory-redesign/004-rehome-rules-content/` (spec.md = Phase 4 rehome design; plan.md is template stub).
- Broad signal: 215 includeConstitutional matches under .opencode; 56 constitutional matches under .opencode/commands; 7974 constitutional matches in repo *.md (mostly spec history).
- Research lineage artifact root: `specs/system-speckit/037-decisions-memory-redesign/004-rehome-rules-content/research/lineages/deepseek-flash-audit/` (ONLY write surface).

### Integration Points
- Search sites already flipped: memory-search.ts, memory-context.ts (x2), vector-index-queries.ts (commit a1d2b84a1e).
- Advisor render.ts: 3 every-turn directives hardcoded.
- Hooks: `.opencode/skills/system-spec-kit/mcp-server/hooks/` + `hooks/injection-contract.md` (stale cold-start claim).
- DB: constitutional tier rows (21), learned-triggers tier (0 rows, 30-day TTL).

### Constraints and Risks
- NO writes outside artifact dir; no generate-context.js / validate.sh / git commands.
- Dist rebuild + daemon restart needed for committed search flip to take effect (report, don't execute).
- File:line citations required for every claim; distinguish confirmed vs inferred.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10 | Convergence threshold: 0.05 (telemetry only) | Stop policy: max-iterations
- Per-iteration budget: 12 tool calls, 15 minutes
- Progressive synthesis: true
- research.md ownership: this lineage writes its own synthesis at artifact-dir/research.md
- Started: 2026-08-26T18:50:00Z
