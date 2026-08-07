---
title: "Implementation Summary: Phase 003 — Narrow rename deep-agent-improvement → deep-improvement"
description: "Narrow skill+agent rename: GPT-5.5 did a PARTIAL pass (skill move + 3 mirrors + commands) then failed on the advisor layer; main-loop Opus completed the advisor flip + 4th mirror + doc refs via deterministic patchers; an Opus subagent audited it COMPLETE & CLEAN."
trigger_phrases:
  - "122 phase 003 implementation summary"
  - "deep-improvement rename results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/003-skill-rename-deep-improvement"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Narrow rename completed (Opus finished advisor layer after codex partial); audited clean"
    next_safe_action: "Commit the rename scoped to the surface, then begin Phase 004 Lane C build"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary — Phase 003: Narrow rename

## 1. What was done

Executed the NARROW rename `deep-agent-improvement` → `deep-improvement` per the Phase 002 playbook (`../002-implementation-deep-research/research/research.md` §4). The executor history is recorded honestly below — the originally-intended "GPT-5.5 edits, Opus verifies" doctrine broke down mid-phase (codex was operationally unreliable), and the operator switched to "native Opus subagents + main loop only" partway through.

| Stage | Executor | Result |
| ----- | -------- | ------ |
| Rename attempt 1 | `cli-codex` `gpt-5.5` xhigh-fast | **Hung on stdin twice** (the documented codex `</dev/null` hazard); killed at a clean restart point |
| Rename attempt 2 | `cli-codex` `gpt-5.5` xhigh-fast | **PARTIAL** — moved skill pkg (`git mv` + internal sweep), 3 of 4 agent mirrors, 6 command files. SILENTLY SKIPPED the 4 advisor source files + 4th (codex) mirror + doc registries |
| Completeness verification | Opus 4.8 subagent (read-only) | Caught the split-brain: advisor canonical never flipped; 4th mirror + ~26 doc refs missed. (A masking native-SQLite route-check had falsely "passed" — corrected by `git diff --numstat HEAD`.) |
| Advisor + mirror + doc completion | **Opus main loop (deterministic patchers)** | Flipped advisor canonical in `aliases.ts`/`explicit.ts`/`fusion.ts`/`skill_advisor.py` (legacy aliases retained); fixed the Lane-B inert-penalty trap; renamed the 4th codex mirror + `config.toml`; flipped 23 doc refs across 15 files (command verbs preserved) |
| Rebuild + recompile + validate | Opus main loop | `tsc` typecheck (exit 0) + build (exit 0); `skill_graph_compiler.py` SQLite recompile (exit 0); Python route-checks; `validate.sh --strict` |
| Final integrity audit | Opus 4.8 subagent (read-only) | **RENAME COMPLETE & CLEAN** — all 7 integrity properties PASS |

## 2. Scope honored (NARROW)

- **Renamed:** skill package id + dir, `SKILL.md name:`, agent id `@deep-agent-improvement` → `@deep-improvement` (all 4 runtime mirrors + `.codex/config.toml` registry), advisor canonical id (TS `aliases.ts`/`explicit.ts`/`fusion.ts` + Python `skill_advisor.py`), command `skill:` fields + hardcoded paths (both `.opencode` and `.claude` runtimes), cross-skill refs, root docs.
- **Kept (lane tokens, not package):** command verbs `/deep:start-agent-improvement-loop` + `/deep:start-model-benchmark-loop`; `assets|references|scripts/agent-improvement/`; `agent-improvement-state.jsonl`; the `model-benchmark` lane token.
- **Back-compat:** `deep-agent-improvement` + `sk-deep-agent-improvement` retained as LEGACY ALIASES in advisor alias arrays + regression fixtures, so old prompts still resolve.

## 3. Verification evidence (all green)

- **Opus final-integrity audit (subagent `af02ab3b46fd00eb2`):** all 7 properties PASS — A1 package move, A2 four mirrors, A3 advisor canonical (not split-brain), A4 inert-penalty fix (`'benchmark a model': [['deep-model-benchmark', 1.6], ['deep-improvement', -0.6]]`), A5 compiled rebuilt (dist gitignored + rebuilt, sqlite present), A6 8 residuals all intentional-keep / zero missed-active, A7 scope clean.
- **TS typecheck + build:** exit 0.
- **SQLite graph recompile:** exit 0 (6 families, 21 adjacency entries, 0 conflicts).
- **Route-checks (fresh SQLite, Python):** Lane B "benchmark a model" → `deep-model-benchmark` (penalty live); legacy "use the deep-agent-improvement skill" → `deep-improvement` (0.88, back-compat). Lane A "improve and score a bounded agent" → `sk-code` #1 / `deep-improvement` #2 — see caveat.
- **Active-residual census:** 0 unintended `deep-agent-improvement` refs; the 8 remaining are legacy aliases, legacy phrase keys, regression/native-scorer fixtures, an explicit.ts comment, and one `it.skip` historical test assertion.
- **validate.sh --strict:** parent PASSED (0 errors).

## 4. Notes / caveats

- **Honesty correction:** an earlier draft of this summary claimed GPT-5.5 completed the full ~180-file rename and was verified clean. That was wrong — codex did a partial pass and the advisor layer was completed by the Opus main loop. This record is the accurate one.
- **Lane A route caveat:** "improve and score a bounded agent file" ranks `sk-code` #1 with `deep-improvement` #2. This overlaps sk-code's territory ("improve", "score", "file") and is **not** a rename regression — the same phrasing would rank similarly pre-rename; `deep-improvement` is reachable and the canonical id resolves. The live advisor daemon is also flagged stale this session (route-checks used the fresh-SQLite Python path).
- **Forward-scope kept (accepted, not churned):** GPT-5.5 pre-added Lane C advisor phrases during its sweep (`"skill benchmark"`, a `deep-improvement-skill-benchmark` group). They route correctly, parse clean, align with Phase 004 — kept rather than removed-then-re-added.
- **Pre-existing tech debt left alone (SCOPE LOCK):** a `command-deep-agent-improvement` command-bridge key (slash_markers use the retained verb) and the `it.skip` remediation-008 assertion are intentional keeps.
- **Committed at `caf072e39e`:** the rename spans shared infra across ~180 files; it was committed scoped to the surface (excluding daemon `graph-metadata.json` churn + parallel-session artifacts). The earlier parallel-session-revert hazard no longer applies — the commit is in HEAD history and Phase 004 built on it.
- **MCP down:** advisor rebuild/validate used CLI fallbacks (`npm build`, `skill_graph_compiler.py`, `skill_advisor.py`) instead of `advisor_rebuild`/`advisor_validate` MCP tools.
