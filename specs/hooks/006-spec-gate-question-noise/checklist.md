---
title: "Verification Checklist: Spec-gate question noise"
description: "Verification evidence for stopping per-turn SPEC FOLDER QUESTION re-injection across all six runtimes and hardening the pi adapter."
trigger_phrases:
  - "spec-gate question noise checklist"
  - "gate question verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/006-spec-gate-question-noise"
    last_updated_at: "2026-08-02T15:36:37Z"
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
      session_id: "impl-006-spec-gate-question-noise"
      parent_session_id: null
    completion_pct: 98
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Spec-gate question noise

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->


<!-- ANCHOR:protocol -->
## Verification Protocol

- **P0** = blocker; **P1** = required; **P2** = best-effort.
- Every `[x]` requires an **Evidence** line with file:line or command output receipts.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] **CHK-001 [P0] — Root cause traced end-to-end.**
  - **Evidence**: `classifyIntent` final branch at `spec-gate-core.mjs:855` (`question: state.status === 'open' ? GATE_3_QUESTION : null`); `answerParse` letter-without-path returns null; `.spec-gate-state/` has one `open` file per pi session file (UUIDs match `~/.pi/agent/sessions/`).
- [x] **CHK-002 [P0] — All six runtime surfaces inventoried.**
  - **Evidence**: pi `hooks/pi/spec-gate-classify.ts`, claude `hooks/claude/spec-gate-classify.mjs` (`.claude/settings.json` UserPromptSubmit), codex `hooks/codex/spec-gate-classify.mjs` (`.codex/hooks.json`), cursor `hooks/cursor/spec-gate-classify.mjs` + prebind (`.cursor/hooks.json:81`), opencode `.opencode/plugins/mk-spec-gate.js` (`chat.system.transform`), devin `hooks/devin/spec-gate-classify.mjs` (`.devin/hooks.v1.json`).
- [x] **CHK-003 [P0] — Scope lock.**
  - **Evidence**: `spec.md` §3 lists exactly 5 files; `evaluateMutation` deny/advise and classifier trigger vocabulary explicitly out of scope.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] **CHK-010 [P0] — Read-only turns never re-surface the question while gate is open.**
  - **Evidence**: core test `an open gate stays open but silent on a read-only turn` (`spec-gate-core.test.mjs:171`); live pi smoke: session `2026-08-02T14-06-04-133Z` read-only prompt → no question, no state file under `.spec-gate-state/`.
- [x] **CHK-011 [P0] — Trigger turns still open the gate and surface the question.**
  - **Evidence**: existing trigger tests green (incl. `codex/spec-gate-codex.test.mjs:138`); live pi smoke: session `2026-08-02T14-06-14-434Z` mutating prompt → state `{"status":"open"}` written under key `file:<basename>` and the question echoed back by the offline responder.
- [x] **CHK-012 [P1] — Answer-attempt turns (letter without path) re-surface the question.**
  - **Evidence**: core tests `an answer attempt without a named folder re-surfaces the question` ("option C") and `a self-contradicting skip attempt re-surfaces the question` ("skip, use A instead") both pass; existing `'A'` test unchanged.
- [x] **CHK-013 [P1] — Skip/binding answers behave unchanged.**
  - **Evidence**: `answerParse` untouched; `answerParse() corpus` tests + `D / skip closes the gate without a binding` green.
- [x] **CHK-014 [P1] — pi adapters share one session key derivation.**
  - **Evidence**: both `hooks/pi/spec-gate-classify.ts` and `hooks/pi/spec-gate-enforce.ts` call `guard.resolveSessionKey({ sessionId: getSessionId(), sessionFile: getSessionFile() })`; live state files keyed `file:<session-file-basename>` (hex-encoded) confirm classify writes what enforce reads.
- [x] **CHK-015 [P1] — Comment hygiene: no ADR-/REQ-/CHK-/task ids or spec paths in code comments.**
  - **Evidence**: grep `ADR-|REQ-|CHK-|T00[0-9]|037-` over the four changed code/test files returns nothing.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] **CHK-020 [P0] — Core suite green.**
  - **Evidence**: `node --test lib/spec-gate/spec-gate-core.test.mjs` → 69 pass, 0 fail (3 pre-existing skips).
- [x] **CHK-021 [P1] — Runtime co-located suites green (codex/cursor/devin).**
  - **Evidence**: `node --test 'codex/*.test.mjs' 'cursor/*.test.mjs' 'devin/*.test.mjs'` from hooks dir → 47/47 pass.
- [x] **CHK-022 [P1] — Live pi smoke: read-only prompt injects no question.**
  - **Evidence**: `pi --offline --approve -p "What is 2+2? Answer briefly."` from worktree → reply `4.`; transcript shows no SPEC FOLDER QUESTION block; no state file written.
- [x] **CHK-023 [P1] — Live pi smoke: mutating prompt injects the question.**
  - **Evidence**: `pi --offline --approve -p "Fix the login bug in the auth module"` → offline responder replies `Which do you want? ...` (question echoed); state file `{"status":"open"}` written.
- [x] **CHK-024 [P1] — pi history stripping: embedded summary text does not trigger.**
  - **Evidence**: classify strips the tail from the last `\nDirectives:` (sibling-injected advisor capsule — live-verified pre-fix: `move`/`write` tokens inside it triggered on a read-only prompt) and classifies only the text after the last `[user]` marker (embedded compaction history). Post-fix read-only smoke silent.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] **CHK-FIX-001 [P0] — Every runtime's classify surface benefits from the core fix (no adapter left on old semantics).**
  - **Evidence**: audit (T001) — claude/codex/cursor/opencode/devin adapters are thin shells over `classifyIntent`; only the pi adapter needed hardening (chained input transforms + per-invocation session identity).
- [x] **CHK-FIX-002 [P1] — Question text and AGENTS.md static copy match.**
  - **Evidence**: `GATE_3_QUESTION` options A-D now instruct replying with the folder path; AGENTS.md Gate 3 options A-D updated with the same instruction (parity of instruction — the AGENTS.md block remains the protocol prose, not a literal copy of the menu).
- [x] **CHK-FIX-003 [P1] — Enforcement unaffected: gate stays open while question is withheld.**
  - **Evidence**: `evaluateMutation` untouched; core test asserts a Write after a silent read-only turn is still `deny` with enforce on.
- [x] **CHK-FIX-004 [P1] — Fail-open preserved on error paths.**
  - **Evidence**: existing fail-open tests green (`corrupt state file`, `unwritable state dir`, `classifyIntent(null)`, `evaluateMutation(null)`); catch branches unchanged.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] **CHK-030 [P0] — No matched classifier tokens echoed into injected context.**
  - **Evidence**: `GATE_3_QUESTION` remains a fixed string array; grep confirms no interpolation of `classification.matched` anywhere.
- [x] **CHK-031 [P1] — No new state writes on read-only turns.**
  - **Evidence**: live smoke — read-only run wrote no state file; core final branch returns without `writeGateStateAtomic`.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] **CHK-040 [P1] — Packet docs complete with evidence.**
  - **Evidence**: `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md`/`handover.md` all carry evidence rows (see tasks.md T001-T012, checklist CHK-001..050); metadata regenerated via `backfill-graph-metadata.js` + `generate-description.js`; `validate.sh --strict` Errors 0.
- [x] **CHK-041 [P1] — AGENTS.md parity updated.**
  - **Evidence**: worktree `AGENTS.md` Gate 3 options A-D instruct replying with the folder path.
- [x] **CHK-042 [P1] — Validation green.**
  - **Evidence**: `validate.sh --strict` on the packet → Errors 0 Warnings 0.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] **CHK-050 [P1] — No temp/scratch files left behind.**
  - **Evidence**: worktree `git status` shows only the 5 intended files + untracked packet folder (plus pre-existing graph-metadata churn and a concurrent `.opencode/package.json` bump, both excluded from the commit); scratch gate-state files removed.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Tier | Verified | Total |
|------|----------|-------|
| P0 | 6 | 6 |
| P1 | 13 | 13 |
| P2 | 0 | 0 |
<!-- /ANCHOR:summary -->
