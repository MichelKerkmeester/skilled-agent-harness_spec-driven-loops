---
title: "Session Handover — injection-bloat migration (research → 5 phases → activation → v4)"
description: "Handover for the 002 injection-bloat epic: a Pi visible-repetition report drove a cli-pi/deepseek deep-research (014), five planned phases (015-019), SOL implementation, and candidate-004 route-only ACTIVATION for the four [SYS] runtimes. All shipped to v4 (b0469c40f6). Records what is live, the kill-switch, the pre-existing red advisor suite, and the deferred activations (Pi/Cursor, 006 compact)."
trigger_phrases:
  - "injection bloat handover"
  - "002 injection bloat continuation"
  - "route-only activation handover"
  - "resume injection migration"
importance_tier: "important"
contextType: "general"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction"
    last_updated_at: "2026-08-09T09:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Shipped 015-019 to v4 (b0469c40f6)"
    next_safe_action: "Re-run advisor suite in a provisioned checkout"
    blockers:
      - "The full advisor vitest suite is red on ~20 pre-existing environmental failures (launcher/daemon/scorer/vocabulary/parity/corpus); this bare worktree lacks their deps. Proven pre-existing via stash-baseline, not a regression."
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts"
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-09-injection-bloat-migration-handover"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->
# Session Handover — Injection-Bloat Migration

Continuation record for the 002 injection-bloat epic. One long session took a Pi "I see the directives on every prompt" screenshot through a deep-research investigation, five planned phases, GPT-agent implementation, and a live activation — all shipped to `origin/skilled/v4.0.0.0`.

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Read this to continue the injection-bloat migration: to verify 017 in a provisioned checkout, to activate route-only for Pi/Cursor (deferred), to activate the 006 compact dispatch directive (evaluated but off), or to merge v4 → main. Status: **implemented + shipped to v4; two follow-ups deferred on environment + operator decision.**
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 2026-08-09 (single long session)
- **To Session:** next injection-bloat continuation
- **Phase Completed:** RESEARCH (014) + PLAN (015-019) + IMPLEMENT + ACTIVATE (015-019), all shipped
- **Recent action:** Implemented + verified 015-019 via SOL; committed 0131 (`0d423a26b4`), synced to v4 (`b0469c40f6`).

**Branches:** source `sk-code/0131-injection-bloat-impl` tip `0d423a26b4`; **v4 tip `b0469c40f6`** (verified: bridge merged over v4 divergence with 0 conflict markers, 4 activated cells, 015-019 + 014 present, 0 unrelated files).

**Also shipped to v4 earlier this same session (separate commits, precede the migration):** the dist-staleness self-heal packet (`sk-code/022`), the dist-guard skip-unprovisioned packet (`sk-code/023`), and the original Pi-local directive dedup (`hooks/002/013`). The recurring cross-session `spec-gate-core.mjs` hook error was root-caused (stale advisor `dist/`) and fixed by the 022/023 work.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### The arc
A Pi operator screenshotted the three constant directives (comment-hygiene / governor / proof-over-appearance) appended to every visible prompt. Investigation showed this is the per-turn advisor brief; Pi is the only runtime that renders it visibly (`[MSG]`), and the advisor often emits a **directives-only fallback** (no `Advisor:` line) that the first Pi dedup (013) structurally skipped. Rather than patch further, the operator ran a **cli-pi / deepseek-v4-flash deep-research** (packet 014, 9 iterations, converged). Its verdict: don't deprecate — the bloat is constant-text *repetition*; keep the two smart injections, redesign the always-on directives via the already-built (but never-activated) 004 machine. That produced five planned phases, authored by **LUNA (gpt-5.6-luna)** and verified by Claude, then implemented by **SOL (gpt-5.6-sol, medium, fast)** and verified by Claude.

### What is LIVE on v4 (per phase)
| Phase | What shipped | Live behavior |
|---|---|---|
| **015** pi-headless-fallback-dedup | `prompt-advisor.ts`: `splitPiDirectiveBrief` handles the headless `Directives:`-only brief; headless suppress → empty `reducedContext`; input handler uses `?? context` | Pi drops repeated directives on the fallback brief too (the screenshot fix) |
| **016** opencode-directive-single-source | `mk-skill-advisor-bridge.mjs` sources all three directives from the canonical renderer + complete local fallback | OpenCode bridge no longer emits 2-of-3 |
| **017** route-only-activation-sys-runtimes | `render.ts`/`policy-plan.ts` + `user-prompt-submit.ts` + `mk-skill-advisor.js` consume the delivery-state decision; `activation-matrix.json` → 4 cells `activated` | **Claude/Codex/Devin/OpenCode emit ~43 B route-only on a proven same-epoch repeat vs ~806 B full**; fail-open otherwise |
| **018** pi-epoch-directive-delivery | `compact-dispatch-semantics.test.ts` (11 assertions) | 006 compact dispatch directive **evaluated** (preserves all 5 semantics) but **left OFF** |
| **019** injection-measurement-and-rollback | `019/scripts/measure-injection-footprint.cjs` + `verify-037-live.cjs` + `rollback-procedure.md` | Byte harness (763/554/1364) + per-phase rollback doc |

### Kill-switches / reversibility
- **017 route-only:** `SPECKIT_ROUTE_ONLY_ADVISOR_DISABLED=1` reverts all runtimes to full emission. Child sessions (`AI_SESSION_CHILD=1`) already get full.
- **015 Pi dedup:** `SPECKIT_PI_DIRECTIVE_DEDUP=0`.
- **006 compact:** `SPECKIT_PI_COMPACT_DIRECTIVE_PROTOTYPE` (stays off).
- Everything is `git revert`-able; `019/rollback-procedure.md` has per-cell steps.

### Verification actually run (by Claude, not just SOL's word)
70 Pi tests; 86 route-only negative-controls + consumption suites; 5/5 `activation-matrix.test.mjs`; all five packets `validate.sh --strict` 0/0; comment hygiene clean across all six runtime files; scope-locked.
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

1. **[P1] Provisioned full-suite run.** The advisor mcp-server vitest suite is red on ~20 pre-existing failures (launcher/daemon/scorer/vocabulary/parity/corpus). Proven pre-existing via stash-baseline. Re-run in a launch-wrapper (provisioned) worktree or main tree to get a genuine green before treating 017 as battle-tested.
2. **[P2] Pi + Cursor 004 activation.** 017 deliberately activated only the four `[SYS]` runtimes. Pi/Cursor are `applicable`-designed but not activated; a later phase can extend with their own delivery/negative-control evidence.
3. **[P2] Activate the 006 compact dispatch directive.** 018 proved the compact form (~116-165 B vs 554 B) preserves all five semantics. Turning it on (`SPECKIT_PI_COMPACT_DIRECTIVE_PROTOTYPE`) is a further Pi per-turn saving — an operator decision, not yet made.
4. **[P2] v4 → main.** The whole epic (and the migration) lives on `skilled/v4.0.0.0`. Merging to `main` is the operator's ff-merge gate.
5. **[P3] Global index reconcile.** `.opencode/specs/descriptions.json` was intentionally NOT synced to v4 (v4 regenerates its own). Two incidental `graph-metadata.json` edits (mcp-obsidian, sk-doc) leaked into the 0131 commit as a backfill side-effect but were excluded from the v4 sync.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] 015 gate: `cd .opencode/hooks/dispatch && npx vitest run pi/` → 70 passed.
- [x] 016 gate: bridge vitest (9) + negative-controls (13) + `node --check` + 3rd-directive grep.
- [x] 017 gate: 86 route-only/consumption tests + 5/5 activation-matrix; fail-open bytes (first 806 / repeat 43 / advisor-failure 763 / unknown 806); stash-baseline proved zero new suite failures.
- [x] 018 gate: `npx vitest run pi/` → 70 passed; compact flag confirmed OFF by default.
- [x] 019 gate: measurement + 037-verify scripts run with real output.
- [x] All five packets `validate.sh --strict` → Errors: 0, Warnings: 0 (post-commit).
- [x] v4 verified: bridge markers 0, 4 activated cells, 015-019 + 014 present, 0 unrelated files.
- [ ] Full advisor suite green in a provisioned checkout (deferred — see Next Session #1).
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

- **CLI dispatch mechanics learned/confirmed.** cli-pi deep-research: `opencode run --command deep/research :auto --executor cli-pi --model deepseek-v4-flash`, with `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` so the fan-out leaves don't hang on the spec-gate, and `</dev/null` on every `opencode run`/`codex exec` (a missing redirect hung the 018 SOL dispatch at 0% CPU on "Reading additional input from stdin"). cli-codex authoring/impl: `codex exec --model gpt-5.6-luna|gpt-5.6-sol -c model_reasoning_effort=... -c service_tier="fast" -c approval_policy=never --sandbox workspace-write "$PROMPT" </dev/null`, default `$CODEX_HOME` (auth.json present), and a `Spec folder: <path> (pre-approved, skip Gate 3).` preamble in the executable prompt so the agent doesn't stall on Gate 3.
- **Division of labor honored the operator directive.** LUNA/SOL wrote; Claude verified every gate itself (never trusted a sub-agent's "pass"). SOL correctly refused to claim 017 complete on the red full-suite; the stash-baseline resolved it as pre-existing.
- **v4 sync is a detached-worktree patch-remap.** `git diff <sha>^ <sha> -- <migration paths> ':!descriptions.json' | sed 's#.opencode/specs/#specs/#g'` then `git apply --3way`. The generated global index must be excluded (v4's differs wildly). The only real 3-way conflict was `mk-skill-advisor-bridge.mjs` (v4 diverged); resolved by keeping the 016 single-source version (`--theirs`) — self-consistent since it re-exports the same directive names.
- **Operator forks this session:** chose Pi-local reduction over rewriting the 007 safety gate (Pi activation earlier); chose full autonomous 017 activation after being shown it is the program's first-ever live cell + rewrites the zero-activation invariant; chose "reconcile docs + commit + sync" for closeout.
<!-- /ANCHOR:session-notes -->
