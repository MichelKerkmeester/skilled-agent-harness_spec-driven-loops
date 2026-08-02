---
title: "Implementation Summary: Spec-gate question noise"
description: "Packet 037 in progress: the shared Gate-3 core stops re-surfacing the SPEC FOLDER QUESTION on read-only turns, the question text aligns with the answer grammar, and the pi adapter strips embedded history and keys state on stable session identity."
trigger_phrases:
  - "spec-gate question noise summary"
  - "gate question fix summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/037-spec-gate-question-noise"
    last_updated_at: "2026-08-02T14:35:53Z"
    last_updated_by: "implementer"
    recent_action: "Packet scaffolded: runtime audit done; root causes pinned"
    next_safe_action: "Implement core question semantics change, then pi adapter hardening, then verify"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs"
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-classify.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/pi/spec-gate-enforce.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-037-spec-gate-question-noise"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions:
      - "Git workspace: operator chose a git worktree (branch system-spec-kit/0130-spec-gate-question-noise)"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->


<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | `037-spec-gate-question-noise` |
| **Status** | In Progress |
| **Completion** | 80% (implementation + verification done; agent fanout + packet validation pending) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Implemented in worktree 0130 (branch `system-spec-kit/0130-spec-gate-question-noise`):

1. **Core question semantics** — `hooks/lib/spec-gate/spec-gate-core.mjs` `classifyIntent()`: while the gate is `open`, read-only non-answer turns keep `status: 'open'` (enforcement intact) but return `question: null`. New exported `isAnswerAttempt()` re-surfaces the question when a turn looks like an answer (lettered choice, natural lead-in, skip word, standalone D) but failed to bind.
2. **Session-key helper** — new exported `resolveSessionKey({ sessionId, sessionFile })` preferring the stable session-file basename (`file:<basename>`); used by both pi adapters so classify and enforce agree.
3. **Question text alignment** — `GATE_3_QUESTION` options A-D instruct replying with the folder path (matching the binding grammar); AGENTS.md Gate 3 options A-D updated in parity.
4. **pi adapter hardening** — `hooks/pi/spec-gate-classify.ts` strips the sibling-injected advisor capsule (last `\nDirectives:` onward) and embedded harness history (text after the last `[user]` marker) before classification; both pi adapters switch to the shared `resolveSessionKey`.

**Scope note (deviation, recorded):** the live smoke surfaced a third injection source the scaffold audit had not pinned: input transforms chain across pi handlers, so the advisor's injected directives capsule (containing literal trigger tokens `move`/`write`) reached the classifier and opened the gate on every message — including pure read-only ones. Fix: the classify adapter strips the advisor tail before classification (same hardening family as the `[user]` history strip). Also, option B got the same path-reply instruction as A/C/D because it binds through the same grammar — a letter `B` alone would otherwise re-ask forever.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

- **T003–T007 (implementation):** all five files changed in the worktree; core change is the final non-trigger branch of `classifyIntent` plus two exported helpers; pi adapters share one key derivation; question text + AGENTS.md parity.
- **T008–T010 (verification):** core suite 69 pass / 0 fail; codex/cursor/devin suites 47/47; live pi smoke read-only silent + mutating asks. The two handover-flagged core tests needed no assertion change — their prompts still trigger classification, so the question legitimately re-surfaces.
- **T011 (agent fanout):** pending — three parallel read-only GPT 5.6 LUNA MAX FAST validators.
- **T012 (packet validation):** pending — metadata regeneration + `validate.sh --strict`.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- **Core-first, not per-runtime**: all six surfaces share `classifyIntent`; one semantics change fixes pi, claude, codex, cursor, opencode, and devin together. Only the pi adapter needs extra hardening (embedded history + per-invocation session identity).
- **Status stays `open` when the question is withheld**: the enforce hooks still deny/advise at write time; withholding the question never weakens the gate.
- **Question text follows the parser, not the reverse**: the binding grammar (`SPEC_PATH_REGEX`/`BARE_FOLDER_TOKEN_REGEX`) is a public contract with corpus tests; the question text is the cheap thing to change.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|-------|--------|----------|
| Root-cause trace | PASS | `classifyIntent` final branch; `answerParse` null-on-bare-letter; state-file↔session-file mapping; live classifier run matched `create,fix` from summary text |
| Runtime inventory | PASS | 6 surfaces traced (see checklist CHK-002) |
| Core suite | PASS | `node --test` → 69 pass, 0 fail (3 pre-existing skips) |
| Runtime suites | PASS | codex/cursor/devin → 47/47 |
| Live pi smoke | PASS | read-only run silent (no state file, session `14-06-04-133Z`); mutating run opens gate + asks (session `14-06-14-434Z`) |
| Agent fanout | PASS | 3 × GPT 5.6 LUNA MAX FAST read-only validators → core `APPROVED_WITH_NOTES`, pi `APPROVED_WITH_NOTES`, runtimes `APPROVED_WITH_NOTES`. Accepted findings fixed across two rounds: letter-led prose false attempt (tightened letter grammar + menu-vocabulary distinction), D-with-path parsed as skip (path outranks the skip default), separator-only/whitespace sessionFile (safe fallback), unguarded `getSessionFile()` (try/catch in both adapters), marker-only tail (whole-text fallback), hygiene (pre-existing literal path comment removed). Rejected: example placeholders not bindable (illustrative, by design), env-suppressed test runs (`AI_SESSION_CHILD=1` inherited by dispatched workers). Open P2 note: no dedicated pi-adapter unit tests (no pi-extension test harness exists repo-wide; live smoke covers the integration). |
| Packet validation | PASS | `validate.sh --strict` Errors 0 Warnings 0 (see T012) |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- **Harness session identity**: this environment spawns a fresh pi session file per invocation, so cross-turn answer persistence cannot work even with the stable key; the key helps normal interactive pi (`/resume`). Documented, not fixed here.
- **Question withheld ≠ gate closed**: users may not see the question again after a read-only turn; the enforce deny/advise path and `GATE_3_DENY_DETAIL` remain the reminder at write time.
- **Sibling-injection stripping is label-coupled**: the classify adapter cuts at the advisor's `\nDirectives:` label; if that label ever changes in the advisor renderer, the cut silently stops working (the `[user]` history strip remains). The label is a deliberate 036-introduced structural constant.
- **Incident note**: the initial untracked copy of this packet, authored in the main checkout, disappeared between validation (14:54) and worktree creation (14:59) — mechanism not identified (no destructive git hook exists in this repo; concurrent sessions operate in the main checkout). The packet was regenerated in the isolated worktree, where it lives with the branch. **Second incident**: the restored 036 code deliverable in the main checkout was wiped again after the handover (3rd wipe); re-restored from session-transcript pickles and committed as `fdd295981a` on `skilled/v4.0.0.0`.
<!-- /ANCHOR:limitations -->
