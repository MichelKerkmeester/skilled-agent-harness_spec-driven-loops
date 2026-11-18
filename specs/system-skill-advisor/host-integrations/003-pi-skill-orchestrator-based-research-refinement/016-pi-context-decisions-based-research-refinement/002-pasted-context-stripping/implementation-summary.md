---
title: "Implementation Summary"
description: "Built in a worktree, not committed: one stripping rule in prompt-policy.ts, called in the recommend handler and at the scorer entry, so a pasted earlier reply no longer flips the advisor's route."
trigger_phrases:
  - "pasted context stripping implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/002-pasted-context-stripping"
    last_updated_at: "2026-11-18T13:45:44Z"
    last_updated_by: "generate-context"
    recent_action: "Wave 2 checks green after the size-pin amendment"
    next_safe_action: "Act on the refutation pass, then validate strict"
    packet_purpose: "Purpose: A task that follows a pasted earlier reply routes the same as the task alone, on every runtime."
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "db37536c-37e4-472c-8a05-521b8fec328d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-pasted-context-stripping |
| **Completed** | 2026-11-18. Built in worktree 474, not committed |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Phase 2: pasted-context-stripping

A leading pasted reply is now dropped before the scorer reads the prompt, so a task routes the same with or without it. The rule lives in `runtime/lib/prompt-policy.ts` as the exported `stripLeadingPastedReply`. The recommend handler calls it once, before the cache key, the semantic embedding and the scorer. `scoreAdvisorPrompt` calls it again at its entry, so the corpus runners that call the scorer directly get it too.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/prompt-policy.ts` | Modify | Adds `stripLeadingPastedReply` and its private one-pass helper |
| `runtime/lib/scorer/fusion.ts` | Modify | Imports the function and strips at the entry of `scoreAdvisorPrompt` |
| `runtime/handlers/advisor-recommend.ts` | Modify | Strips once into `scoredPrompt`, used for the cache key, the embedding, the scorer and `publicRecommendation` |
| `runtime/scripts/routing-accuracy/labeled-prompts.jsonl` | Modify | Adds row `rr-paste-208`, gold `sk-code` |
| `runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Modify | Recaptured: new corpus hash, total 196, correct 161 |
| `runtime/bench/scorer-calibration-baseline.json` | Modify | Rewritten for 196 rows |
| `runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modify | Adds the `rr-paste-208` divergence and moves `scoringInstant` to 2026-11-18 |
| `runtime/tests/legacy/advisor-corpus-parity.vitest.ts` | Modify | Corpus size pin and the size in its title and two comments move from 195 to 196. Added to `spec.md` Files to Change by operator amendment |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Wave 0 (T001 to T004) was done by the conductor in the sending session. Wave 1 ran four GPT-6 Luna `xhigh` `fast` leaves in parallel through cli-codex, one file each. The conductor read every diff against its brief, then ran the typecheck, the baseline recaptures, the gates and the probes from its own shell.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Strip in the recommend handler and at the entry of `scoreAdvisorPrompt`, not in `runtime/lib/skill-advisor-brief.ts` | No runtime hook calls `buildSkillAdvisorBrief`. All five runtimes reach the handler through the CLI, where the semantic lane's embedding lookup needs the stripped text. Every corpus runner calls the scorer directly |
| Put the new row in `labeled-prompts.jsonl` | The ratchet pins its top-1 count exactly, so a later change that breaks the strip fails a gate. The regression-case fixture has no gate on its TypeScript result |
| Stripping rule | A prompt is stripped only when it opens with a reported-speech cue (`earlier`, `previously` or `above`, then `you`, `the assistant` or `claude` with `replied`, `said`, `wrote`, `answered` or `responded` and a colon) or with a quote or `>`, and it holds a task marker (`Now:` or `Task:`) at the start or after a sentence end. The text after the first marker is kept. It is the smallest rule that drops the probe's paste: stripping only the advisor's own output lines would miss it, because the probe holds no advisor line |
| Function name `stripLeadingPastedReply`, exported | Phase 003's guard and bench import the same function |
| The function repeats until its output stops changing | Deviation from the plan's "one pass is enough". The handler and the scorer both call it, and the semantic lane matches its stored embedding by exact text. Repeating makes a second call return its input unchanged, so both calls agree. A nested paste (`You said: ... Task: ...` after a first cue) is handled by the same loop |
| `publicRecommendation` gets the stripped prompt | It reads the prompt for the recommendation's public fields. Passing the raw text would let the pasted reply's skill names back in there |
| Corpus-parity size pin moves to 196, by operator amendment | Planning missed `toHaveLength(195)` at `:114`; the required new row breaks it. Asked as a logic-sync because D5 limits the phase to the files `spec.md` lists; the operator chose to amend the spec and update the title and comments too. A fifth Luna leaf made the 4-line edit |
| Scorer call in the handler split over several lines | Leaf 3 did this because the brief's `rg -c` expectation of 5 was the conductor's error for the one-line form. Behavior is unchanged, so it was kept |
| `enrichCompiledRoutes` and `attachTypedCommand` keep `input.prompt` | Brief scope. The compiled-route probe in Verification shows the effect, recorded as a follow-up |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T001 probe pair before the change | `sk-code 0.82` first for the task alone, `sk-doc 0.9268` first with the pasted reply |
| T002 rule cases (`tmp/p002-briefs/rule.cjs`) | Probe and `You said:` variant stripped to the task; nested paste stripped to the plain task; the three plan negatives and three more returned unchanged; every output idempotent |
| T003 corpus matches | 0 of 700 existing prompts in `scripts/routing-accuracy/*.jsonl` and `scripts/fixtures/*.jsonl` change. After the row lands, 1 of 701 changes, the new row |
| Typecheck | `npm run typecheck` exit 0 |
| T009 eval baseline | Run first against the stale `dist/`: total 196, correct 160, so the new row missed. After `npm run build` (exit 0): total 196, correct 161, accuracy 0.8214. Diff holds only the corpus hash, the capture sha and those counts |
| T010 calibration baseline | The committed file was already stale: April, 200 rows, a different corpus hash. The row's own effect, isolated by capturing on 195 rows then 196: Brier 0.215213 to 0.21428, ECE 0.137733 to 0.136112, bucket 0.8-0.9 from 117 to 118 rows. Everything else in the file diff is that earlier drift |
| T011 divergence ratchet | Failed first, naming only `rr-paste-208` (local `sk-doc`, native `sk-code`). The capture's dry run reported added `rr-paste-208`, resolved none, changed none. After `--write` and an honest reason: 9 of 9 pass. `scoringInstant` must move to 2026-11-18, because the ratchet requires it to be no earlier than the newest approval; set back to 2026-11-13 the ratchet fails `pins no earlier than the newest approval` |
| T012 GATES | First run 66 of 67: `tests/legacy/advisor-corpus-parity.vitest.ts:114` pinned `toHaveLength(195)`. After the amended edit: exit 0, 11 files, 67 of 67. `:178`, `:179` and `:184` did not move |
| `npx vitest run tests/hooks tests/parity` | Exit 0, 234 of 234, on two runs. One earlier run, started right after GATES, failed `python-ts-parity.vitest.ts:176` at 32.8 s against the 30 s `testTimeout`: a timeout under load, not an assertion |
| T013 semantic lane | The CLI daemon was started fresh at 14:56:58 on socket dir `/tmp/sa474`, after the 14:53:15 build. The pasted probe and the plain control both print 0, so the lane is off in this daemon and the check proves nothing |
| T013 probe pair | `sk-code 0.82, sk-doc 0.82, cli-external-orchestration 0.82` on both lines |
| T013 compiled route | Differs. Pasted run: `sk-code` `action: route` to `sk-code-review`. Plain run: `sk-code` `action: defer`. See Known Limitations |
| T014 comment hygiene | `rg` over the added lines in `lib/` and `handlers/` printed nothing (exit 1) |
| Refutation pass (Luna `xhigh`, read-only) | Six findings, each checked by the conductor. Confirmed as rule edges, recorded below: a `>`-quoted requirement before `Task:` is stripped; a `Task:` inside the reply cuts too early; `Assistant response:` is not a cue. Confirmed and already recorded: compiled routes and typed commands read the raw prompt. Refuted: cache cross-talk (the cache stores the output before enrichment, `advisor-recommend.ts:637`, and every call enriches with its own prompt); the command-routing capture embedding mismatch (it reads `command-prompts.jsonl`, where no prompt is stripped). By design: the Python side of validation reads raw rows |
| New corpus row | Routes `sk-doc` before the change (T001, and the first T009 run at 160 correct) and `sk-code` after (161 correct) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Python local scorer does not get the strip.** The CLI falls back to it when the daemon is unreachable (`runtime/skill-advisor-cli.ts:1456-1468`). In that window a pasted reply can still flip the route. The workaround is to keep the daemon reachable, which is the normal state. The divergence ledger records this for `rr-paste-208`.
2. **Compiled routes still read the raw prompt.** `enrichCompiledRoutes` gets `input.prompt`, so a pasted `/deep:review` turns the sk-code route from `defer` into `route` to `sk-code-review`. The top skills match; the compiled route does not. A follow-up would pass `scoredPrompt` there too. This phase does not fix it.
3. **The rule has known edges.** A user's own `>`-quoted requirement followed by `Task:` is dropped as if pasted. A reply that itself holds `Task:` or `Now:` is cut at that first marker, so the rest of the reply stays. Headers such as `Assistant response:` are not cues. None occurs in the 700 existing corpus prompts. Each widening is a rule change for a later phase.
4. **Probe without a socket override.** The CLI already gives each checkout its own daemon socket under `/tmp/system-skill-advisor/<hash>`. Overriding `SPECKIT_IPC_SOCKET_DIR` while that daemon holds its lease sends the CLI to the local scorer (`degraded: true`, `source: local-scorer`), which does not strip. A socket dir inside the worktree also exceeds the macOS `sun_path` limit (exit 69). The final probe ran with no override and got `sk-code` first from worktree daemon 7589, started 15:39:46 after the 15:38:42 build
<!-- /ANCHOR:limitations -->

---
