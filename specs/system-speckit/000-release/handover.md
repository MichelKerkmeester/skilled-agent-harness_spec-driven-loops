# Handover — v4.0.0.0 Release Notes & README Refresh

> **Session:** "RELEASE V4" (2026-08-14). **Status: PAUSED by operator** ("we won't start now").
> **Nothing shipped has been modified.** All work lives under this spec folder + session scratch.
> Continuity ladder top. See `plan.md` for the full plan; `goal_v4-release-notes-and-readme` (Claude memory) mirrors this.

---

## 1. ONE-LINE STATE

Phase 2 (per-packet extraction) was **launched and then killed at operator request** at **61 / 248 fragments**. Phases 1 (seed) and 2 (recipe) are proven; Phases 3–5 not started.

## 2. DECISIONS (all resolved — do NOT re-litigate)

| # | Decision | Choice |
|---|----------|--------|
| 1 | Coverage model | Spine + seeded depth |
| 2 | Executor split | DeepSeek V4 Flash extracts (Phase 2) · GLM 5.2 high synthesizes (Phase 3) |
| 3 | Public scope | Two-tier doc (user-facing top + internal appendix) |
| 4 | Version label | One consolidated `v4.0.0.0` (v3.6.0.0 → HEAD) |
| 5 | Fan-out scope | **Full 248** in-window packets, 12 tracks |
| 6 | Concurrency | **5** |

## 3. PHASE STATUS

- **Phase 1 — context pack / seed:** ✅ built. 248 in-window top-level packets (`git diff v3.6.0.0..HEAD -- specs/`), each mapped to a bounded source blob (129 rollup / 104 child-rollup / 14 spec-only / 1 empty). Sources capped at 45KB.
- **Phase 2 — per-packet extraction:** ⏸ PARTIAL. **61/248 fragments** captured (5 dispatch failures pending retry). Resumable. Pilot (sk-doc/028) + 3-packet test + 61 real fragments all clean and grounded.
- **Phase 3 — deep-research synthesis:** ⛔ NOT STARTED. Seeded ~100-iter, no-early-convergence, GLM 5.2 high via cli-devin. **Operator wants to confirm this launch** (it's the big run).
- **Phase 4 — reduce (Opus):** ⛔ NOT STARTED. Two-tier `release-notes-v4.0.0.0.md` via sk-doc changelog packet.
- **Phase 5 — README update (Opus, surgical):** ⛔ NOT STARTED. Fix stale link ~line 1311, version badge.

## 4. AUTOMATED PIPELINE (one command, cheap models, resumable) ✅ BUILT + VERIFIED

Everything now runs from `pipeline/` — no per-phase babysitting, no hard-coded session paths.

**Run it:** `bash specs/system-speckit/000-release/pipeline/run.sh` (see `pipeline/GOAL-PROMPT.md` for the single goal prompt + flags: `--preflight`, `--fresh`, `--from N`, `--only N`).

- **Phases:** 1 seed (det) · 2 extract (DeepSeek V4 Flash `opencode-go`, concurrency 5, resumable + auto-retry) · 3 consolidate (det) + synthesize · 4 assemble · 5 readme-delta (proposal only).
- **Models (cheap only, in `config.sh`):** extract = `opencode-go/deepseek-v4-flash`; synth default = `opencode-go/deepseek-v4-pro` (same gateway = most reliable); GLM toggle = `export V4_RN_SYNTH_KIND=devin` → `glm-5-2` (needs `devin auth login` + smoke).
- **Safety:** read-only workers, parent writes every file (no `--dangerously-skip-permissions`); `</dev/null` hang guard; README is proposed-against, never auto-edited; pre-flight gates every run.
- **Durable:** work dir `~/.cache/v4-release-notes` (stable across sessions, safe to delete, fully regenerable). Outputs land in the packet: `002/fragments.jsonl`, `003-synthesis/sections/`, `004…/release-notes-v4.0.0.0.md`, `005…/readme-delta.md`.
- **Verified 2026-08-14:** all 11 scripts `bash -n` clean; pre-flight READY; seed = 249 packets; synth path proven live (deepseek-v4-pro merged a real "Agents" section in 23s). Phase-2 dispatch proven earlier (pilot + 61 fragments, snapshot in `002/fragments.snapshot.jsonl`).

## 5. HOW TO RESUME

1. Re-read this file → `pipeline/GOAL-PROMPT.md` → `plan.md`.
2. `bash pipeline/run.sh --preflight` (confirm auth + not inside opencode).
3. `bash pipeline/run.sh` — runs all phases, skipping any already complete. From scratch: full run ~20-25 min, cheap. Kicks out a SUMMARY block with output paths.
4. Review `004-release-notes-reduce/release-notes-v4.0.0.0.md` and apply `005-readme-update/readme-delta.md` to the real README by hand (or via a strong model) — the pipeline never edits the shipped README.

## 6. KNOWN TRAPS

- opencode fan-out children hang at 0% CPU without `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 … </dev/null`.
- DeepSeek destructive-write incident (cli-opencode `references/destructive-scope-violations.md`) — our read-only/parent-writes design avoids it; do NOT add `--dangerously-skip-permissions`.
- spec-memory MCP disconnected this session → `000-release` metadata (`description.json`/`graph-metadata.json`) are hand-written lean stubs; regenerate with `generate-context.js` before relying on memory search.
- **Kill discipline:** kill only dispatches you started, by specific model pattern (`opencode-go/deepseek-v4-flash`), never blanket `pkill -f "opencode run"` (hits operator-owned sessions).

## 7. OPEN ITEM FOR OPERATOR

At kill time a SEPARATE `deepseek-v4-pro` session (PID varies, worktree `.worktrees/0143-skilled-provider-adapters-privacy`, implementing "phases 021-025 CLI-output wrappers") was found running — **NOT part of this release work**, left untouched. Operator to decide if it should be stopped.
