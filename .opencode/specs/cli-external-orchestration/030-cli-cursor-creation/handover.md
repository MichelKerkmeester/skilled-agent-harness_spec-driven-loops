---
title: "Session Handover Document: cli-cursor creation (030)"
description: "Packet closed out - all 7 phases implemented, live-verified, and validated. No further handover needed; retained as historical record."
trigger_phrases: ["cli-cursor handover", "030 handover", "cursor cli continuation"]
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation"
    last_updated_at: "2026-07-24T13:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Packet complete - all 7 phases implemented and closed out"
    next_safe_action: "None - packet complete, no further work scoped"
    blockers: []
    key_files: ["spec.md", "007-docs-agents-governance-and-closeout/implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-implementation", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Session Handover Document: cli-cursor creation (030)

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

## 1. Handover Summary

- **From Session:** 2026-07-24, cli-devin revival + cli-cursor creation session (spec authoring), continued 2026-07-24 (implementation)
- **To Session:** None required — packet is complete
- **Phase Completed:** ALL 7 PHASES — spec authoring, implementation, live verification, and closeout
- **Handover Time:** 2026-07-24
- **Recent action**: Phases 002-007 implemented, live-verified where the spec required it, and committed; whole packet passes `validate.sh --recursive --strict` 0/0

---

## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
|---|---|---|
| 7-phase shape mirroring `029-cli-devin-revival` | Cursor's real capabilities map onto the same 7 workstreams (contract-pin → executor → skill-packet → hooks → model-registry → playbook → closeout) | Phase folders and handoff criteria are directly comparable to the Devin precedent |
| Named `030-cli-cursor-creation` (not `-revival`) | Cursor has **never** existed in this repo — a first-time addition | No archived packet is "the old cli-cursor" — there isn't one |
| Worktree/worker/plugin marketplace kept out of repo-runtime scope | Genuine Cursor-unique capabilities (no sibling analog) but wiring them into this repo's deep-loop runtime would be scope creep | Documented in the skill-packet references + playbook only (phase 003/006), no dedicated runtime phase |
| Only Composer gets a new model profile | Composer is Cursor-exclusive; hosted frontier models Cursor drives already have provider-native profiles elsewhere | Phase 005 scope stayed narrow — one new profile, not a roster rebuild |
| `.cursor/hooks.json` adapters built + live-verified, registration deferred | Phase 004's shared `.cursor/` config surface also affects the operator's live Cursor editor sessions, not just CLI dispatch — an environmental change warranting explicit approval | Operator chose "build adapters, skip registering hooks.json" as a live check-in during phase 004; no `.cursor/hooks.json` exists in this repo |
| Hooks wired to `sessionStart`/`preToolUse`/`sessionEnd`, not the originally-planned `sessionStart`/`beforeSubmitPrompt`/`stop` | Phase 004 live-probed real dispatches and found `beforeSubmitPrompt`/`stop` never fire under the CLI — inverting the original Codex-mirrored assumption | `spec-gate-classify.mjs` ships dormant; `preToolUse` covers every tool, broader than the originally-planned `beforeShellExecution` |

### 2.2 Blockers Encountered (all resolved)

| Blocker | Status | Resolution |
|---|---|---|
| No authenticated Cursor account on this machine | **Resolved** | Operator completed `cursor-agent login` mid-session (Pro tier, `mkerkmeester@proton.me`) — unlocked live verification for phases 002-006 |
| Live model roster / Composer specs were auth-gated | **Resolved** | `composer-2.5`/`composer-2.5-fast` confirmed live via `cursor-agent --list-models`; context window/pricing remain genuinely unexposed by the CLI even authenticated, documented as TBD (not fabricated) |
| Cursor CLI hook per-event delivery was an open question | **Resolved** | Phase 004 live-probed all documented events; confirmed-fires/confirmed-non-delivery/untested split recorded in `mcp-server/hooks/cursor/README.md` |

### 2.3 Files Modified

**Full history**: 8 spec-authoring commits + 6 implementation commits (phases 002-007), each phase committed independently after its own `validate.sh --strict` passed.

| Phase | Summary | Status |
|---|---|---|
| `001-cursor-contract-pin/` | Live Cursor CLI verification (binary, hooks, config, auth, models, unique surfaces) | Complete |
| `002-deep-loop-executor-support/` | `cli-cursor` added to `executor-config.ts`/`executor-audit.ts`/`fanout-run.cjs`/`dispatch-model.cjs`/`profile-validator.cjs` + tests | Complete |
| `003-cli-cursor-skill-packet/` | Built `cli-external-orchestration/cli-cursor/` per `sk-doc create-skill`; wired hub registries | Complete |
| `004-cursor-hook-adapter-layer/` | Built + live-verified Cursor hook adapters | Complete (`.cursor/hooks.json` registration deferred by operator choice) |
| `005-cursor-model-registry-and-routing/` | Composer-2.5 profile + `cli-cursor` executor row + CI gate | Complete |
| `006-cursor-manual-testing-playbook/` | 19-scenario, 9-category Cursor-native playbook | Complete |
| `007-docs-agents-governance-and-closeout/` | Roster/governance/cross-skill mentions; full recursive validation | Complete |

`validate.sh --recursive --strict` on the whole packet: **8/8 folders, 0 errors, 0 warnings** (re-verified after every phase's edits, not just trusted).

### 2.4 Traps & Scar Tissue

| Trap / blast site | Activation condition | Load-bearing or defensive? | How to avoid re-paying it |
|---|---|---|---|
| Uncommitted spec-folder and skill-directory content silently reverted/deleted mid-session | Concurrent git `merge`+`reset --hard`+`clean -fd` activity on this exact branch, observed via `git reflog` (authored under the operator's own git identity, likely an auto-sync process) | Load-bearing — real, repeatable data loss, wiped an entire 19-file playbook once | **Commit immediately after content is authored and verified, never batch to the end of a phase.** When a wipe is suspected, check `git reflog` for unexpected `merge`/`reset` entries before re-authoring. |
| `generate-description.js --level N` doesn't persist the `level` key | This tool version | Load-bearing (fails `DESCRIPTION_SHAPE` otherwise) | Manually patch `description.json` to add `"level": "N"` (string) if needed |
| Editing markdown *after* running generate/backfill scripts | Any edit-then-validate cycle | Load-bearing (fails `GENERATED_METADATA_INTEGRITY`/`SOURCE_FINGERPRINT_MISMATCH`) | Content edits first, generate/backfill **last**, per folder |
| `cursor-agent -p` exits `0` even on auth failure | Any dispatch attempt without login | Load-bearing for phase 002's fail-closed guard | Guard checks `command -v cursor-agent` + explicit auth-state probe (`cursor-agent about`), never the exit code alone |
| Quoting a literal `[text](path)` markdown link inside spec-doc prose (as evidence) | Any doc that quotes another file's link syntax verbatim | Load-bearing (fails `SPEC_DOC_INTEGRITY` — the link checker treats it as a real link from the quoting file's own location) | Describe the link in plain prose ("one line linking to X, labeled Y") instead of reproducing bracket syntax |
| Compiled-routing manifest's pinned `effectivePolicyHash` goes stale whenever `SKILL.md` content changes | Any edit to a hub's own or a child mode's `SKILL.md` | Load-bearing for `validate_skill_package.py`'s "compiled routing readiness" check | Verify via `resolve.cjs` that the pinned hash is a bookkeeping/fast-path-activation value (not a routing-correctness gate), then hand-align it to the fresh `currentPolicyHash` a `freshness` check reports |
| A profile's filename must exactly match its registry `id`, not a spec's originally-planned filename | Adding a new model to `sk-prompt/prompt-models` | Load-bearing (fails `check-prompt-quality-card-sync.sh` CHECK 3) | Name the profile file `<registry-id>.md` from the start, or rename before committing |

---

## 3. Packet Status

This packet requires no further session handover — all 7 phases are implemented, live-verified where the spec required it, and validated. If a future session needs to extend `cli-cursor` (e.g. a new model, a new hook event once Cursor's CLI delivery changes, or registering `.cursor/hooks.json`), open a new phase child under this same `030-cli-cursor-creation` parent rather than reopening a closed phase.

### 3.1 Deferred, Explicitly-Approved Follow-ups

- **`.cursor/hooks.json` registration**: adapters are built and live-verified (phase 004), but the actual project-level registration file was deliberately not committed — this affects the operator's live Cursor editor sessions too, so it needs its own explicitly-approved step, not a silent follow-on.
- **7 untested hook events** (`postToolUseFailure`, `beforeMCPExecution`, `afterMCPExecution`, `preCompact`, `subagentStart`, `subagentStop`, `afterAgentResponse`): genuinely unconfirmed, not assumed either way — a future phase could probe these if a real scenario needs them.
- **`validate_skill_package.py --strict`** (not required by this packet's own REQ-005, which targets the default invocation) surfaces 2 pre-existing, packet-unrelated hub contract warnings (`SKILL.md` description length, missing smart-router markers) — left for a future, separately-scoped hub-hygiene pass.

---

## 4. Validation Checklist

- [x] All implementation work committed (14 total commits across spec-authoring + implementation, each phase independently)
- [x] `validate.sh --recursive --strict` passes 8/8, 0/0
- [x] Both hub skill validators (`parent-skill-check.cjs`, `validate_skill_package.py`) pass 0 fails
- [x] No breaking changes — nothing outside `030-cli-cursor-creation/` and the surfaces phases 002-007 explicitly targeted was touched
- [x] This handover document is complete and reflects the packet's actual completed state

---

## 5. Session Notes

Cursor CLI is real, installed, and now authenticated on this machine (`cursor-agent 2026.07.23-e383d2b`, Pro tier). The binary name is `cursor-agent`, not `cursor` — `agent` is a separate alias. Every claim in this packet about Cursor CLI behavior is live-verified against the real binary, not assumed from editor knowledge or sibling-CLI analogy — including the two findings that inverted this packet's own original assumptions (the auth-fail-exits-0 gotcha, and the hooks confirmed-fires/non-delivery split).
