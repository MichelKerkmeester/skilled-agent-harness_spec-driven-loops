---
title: "Session Handover Document: cli-cursor creation (030)"
description: "Handover for continuing cli-cursor implementation in a new session - spec fully authored and validated, phase 001 complete, phases 002-007 planned but not built."
trigger_phrases: ["cli-cursor handover", "030 handover", "cursor cli continuation"]
importance_tier: "important"
contextType: "general"
---
# Session Handover Document: cli-cursor creation (030)

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

## 1. Handover Summary

- **From Session:** 2026-07-24, cli-devin revival + cli-cursor creation session
- **To Session:** Next session, cli-cursor implementation
- **Phase Completed:** SPEC AUTHORING (all 7 phases scaffolded + validated); phase 001 additionally COMPLETE as real implementation (live CLI verification)
- **Handover Time:** 2026-07-24
- **Recent action**: Fresh Opus agent authored and validated the full 7-phase spec packet; every claim about Cursor CLI is live-verified, not assumed

---

## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
|---|---|---|
| 7-phase shape mirroring `029-cli-devin-revival` | Cursor's real capabilities map onto the same 7 workstreams (contract-pin → executor → skill-packet → hooks → model-registry → playbook → closeout) | Phase folders and handoff criteria are directly comparable to the Devin precedent — read `029` alongside `030` when in doubt |
| Named `030-cli-cursor-creation` (not `-revival`) | Cursor has **never** existed in this repo (confirmed via `z_archive` grep = 0 hits) — this is a first-time addition, following the `001-cli-gemini-creation`/`002-cli-codex-creation` naming precedent | Do not treat any archived packet as "the old cli-cursor" — there isn't one |
| Worktree/worker/plugin marketplace kept out of repo-runtime scope | These are genuine Cursor-unique capabilities (no sibling analog) but wiring them into this repo's deep-loop runtime would be scope creep — the executor only needs `cursor-agent -p` | Documented in the skill-packet references + playbook only, not a new phase |
| Only Composer gets a new model profile | Composer is Cursor-exclusive; the hosted frontier models (gpt/sonnet/opus/gemini) Cursor drives already have provider-native profiles elsewhere | Phase 005 scope is narrow — one new profile, not a roster rebuild |

### 2.2 Blockers Encountered

**Blockers**: `cursor-agent login` requires an interactive OAuth browser flow only the operator can complete; this machine is not authenticated.

| Blocker | Status | Resolution/Workaround |
|---|---|---|
| No authenticated Cursor account on this machine | Open | Operator must run `cursor-agent login` before phases 002-006 can do any *live* dispatch/hook/model verification. Spec authoring did not require it. |
| Live model roster / Composer specs are auth-gated | Open, documented as TBD | Do not fabricate — phase 005 enumerates the real roster only after login |
| Cursor CLI reportedly doesn't fire every `.cursor/hooks.json` event | Open, flagged as Open Question | Phase 004 must live-verify per event before claiming any guard "active" |

### 2.3 Files Modified

**Key files**: `030-cli-cursor-creation/spec.md` (parent), `001-cursor-contract-pin/` through `007-docs-agents-governance-and-closeout/` (7 children), each with `spec.md`/`plan.md`/`tasks.md`(+`checklist.md`+`decision-record.md` for 003/004).

| File | Change Summary | Status |
|---|---|---|
| `030-cli-cursor-creation/spec.md` | Phase-parent spec, 7-phase map, scope, open questions | Complete, committed `8a04a20706` |
| `001-cursor-contract-pin/` | Live Cursor CLI verification (binary, hooks, config, auth, models, unique surfaces) | **Complete** (real work done), committed `f4aab135de` |
| `002-deep-loop-executor-support/` | Spec only — add `cli-cursor` to `executor-config.ts`/`executor-audit.ts`/`fanout-run.cjs`/`dispatch-model.cjs`/`profile-validator.cjs` | Planned, committed `95069cc9be` |
| `003-cli-cursor-skill-packet/` | Spec + 3 ADRs — build `cli-external-orchestration/cli-cursor/` per `sk-doc create-skill` | Planned, committed `0237b1cd62` |
| `004-cursor-hook-adapter-layer/` | Spec + 2 ADRs — thin adapters over `.cursor/hooks.json` | Planned, committed `d2d917d010` |
| `005-cursor-model-registry-and-routing/` | Spec only — Composer profile + CI gate | Planned, committed `fff118bd8e` |
| `006-cursor-manual-testing-playbook/` | Spec only — Cursor-native scenario categories | Planned, committed `a27ae81a96` |
| `007-docs-agents-governance-and-closeout/` | Spec only — roster/governance touch-list + final validation | Planned, committed `4163a05bea` |

`validate.sh --recursive --strict` on the whole packet: **8/8 folders, 0 errors, 0 warnings** (independently re-verified, not just trusted).

### 2.4 Traps & Scar Tissue

| Trap / blast site | Activation condition | Load-bearing or defensive? | How to avoid re-paying it |
|---|---|---|---|
| Uncommitted spec-folder content silently deleted mid-session | Concurrent multi-session file-sync activity in this repo (observed 4+ times in one day across two packets) | Load-bearing — real, repeatable data loss | **Commit after every phase folder is authored, not at the end.** This packet was built with exactly that discipline (8 incremental commits) and survived; an earlier packet lost work twice before switching to it. |
| `generate-description.js --level N` doesn't persist the `level` key | Always, this tool version | Load-bearing (fails `DESCRIPTION_SHAPE` otherwise) | After running the generator, manually patch `description.json` to add `"level": "N"` (string) before validating |
| Editing markdown *after* running generate/backfill scripts | Any edit-then-validate cycle | Load-bearing (fails `GENERATED_METADATA_INTEGRITY`/`SOURCE_FINGERPRINT_MISMATCH`) | Content edits first, generate/backfill **last**, per folder |
| `cursor-agent -p` exits `0` even on auth failure | Any dispatch attempt without login | Load-bearing for phase 002's fail-closed guard | Guard must check `command -v cursor-agent` + explicit auth-state probe, never the exit code alone |
| Header-text/anchor mismatches vs. the real `sk-doc` templates | Any hand-authored spec doc | Defensive (validator catches it, but costs a fix-iterate loop) | Mirror `029-cli-devin-revival`'s already-passing files verbatim for header wording (`RISKS & DEPENDENCIES`, `TESTING STRATEGY`, `## Phase N: <name>` in plan.md, `CHK-NNN [P#]` checklist format) rather than free-composing headers |

---

## 3. For Next Session

### 3.1 Recommended Starting Point

- **File:** `030-cli-cursor-creation/002-deep-loop-executor-support/spec.md`
- **Next safe action**: Have the operator run `cursor-agent login` (or confirm they'll do it during the session), then implement phase 002 — add `cli-cursor` to the 5 shared executor-wiring files listed in its spec.
- **Cold-read order**: 1. this `handover.md` → 2. `030-cli-cursor-creation/spec.md` (phase map + open questions) → 3. `001-cursor-contract-pin/implementation-summary.md` (the live Cursor facts everything else depends on) → 4. `002-deep-loop-executor-support/spec.md` (first unbuilt phase).
- **Context:** Everything through phase 001 is real; phases 002-007 are specs only — this session's job is to actually **build** them, phase by phase, validating and committing after each.

### 3.2 Priority Tasks Remaining

1. Resolve or explicitly accept the 3 open questions in `spec.md` §4 (workspace-isolation flag, per-event hook delivery, Composer auth-gated specs) before or during the relevant phase.
2. Implement phases 002 → 007 in order, following each phase's own `plan.md`/`tasks.md`/`checklist.md` exactly (each already validates 0/0 — don't restructure them, build to them).
3. Commit after each phase passes its own `validate.sh <phase> --strict`, not just at the end (see Traps table above).

### 3.3 Critical Context to Load

- [ ] `030-cli-cursor-creation/spec.md` (phase map, open questions, files-to-change table)
- [ ] `001-cursor-contract-pin/implementation-summary.md` (the live-verified Cursor CLI contract every later phase cites)
- [ ] `002-deep-loop-executor-support/plan.md` (phase 1 = start here)

---

## 4. Validation Checklist

- [x] All spec-authoring work committed (8 commits, `git log --oneline -8` under `030-cli-cursor-creation/`)
- [x] `validate.sh --recursive --strict` passes 8/8, 0/0
- [x] No breaking changes — nothing outside `030-cli-cursor-creation/` was touched
- [ ] Implementation not started (phases 002-007) — this is the next session's work
- [x] This handover document is complete

---

## 5. Session Notes

Cursor CLI is real and installed on this machine (`cursor-agent 2026.07.23-e383d2b`). The binary name is `cursor-agent`, not `cursor` — `agent` is a separate alias. Do not assume Cursor-the-editor knowledge transfers to the CLI; the whole point of phase 001 was verifying the CLI specifically, and several assumptions (hook event coverage, model roster) remain intentionally unresolved (TBD) until an authenticated session or the relevant implementation phase confirms them live.

A companion short goal-prompt for starting the next session is at `030-cli-cursor-creation/goal-prompt.md` — paste that as the opening message of a fresh session.
