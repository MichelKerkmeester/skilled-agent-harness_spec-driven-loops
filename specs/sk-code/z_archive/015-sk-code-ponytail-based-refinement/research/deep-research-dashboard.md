# Deep-Research Dashboard — Ponytail → sk-code / sk-code-review

**Status:** COMPLETE · 12 iterations (10 generate + 2 verify) · 2 models · research-only

| Metric | Value |
|--------|-------|
| Generate iterations | 10 (5 waves × {Opus 4.8 + gpt-5.5-fast}) |
| Verify iterations | 2 (round-2 adversarial cross-verify) |
| Models | `claude-opus-4-8` ×6 (account-2 CLI, read-only) · `openai/gpt-5.5-fast` ×6 (cli-opencode, read-only) |
| Recommendations | 25 ranked: ADOPT-NOW 8 · ADOPT-LATER 9 · DO-NOT-ADOPT 8 |
| Factual claims verified | 7 / 7 confirmed on disk |
| Round-2 recs refuted | 0 (2 scope/framing corrections applied) |
| Deliverable | `research/research.md` |

## Per-iteration log

| Iter | Lane | Lens | newInfoRatio | Headline |
|-----:|------|------|:-:|----------|
| 001 | Opus | decision-ladder | 0.70 | Ladder at 0→1 transition in always-loaded universal doc; not a new route |
| 002 | gpt | hook-parity | 0.64 | SessionStart prime + UserPromptSubmit inject; avoid repo-dirty flag |
| 003 | Opus | intensity-sliders | 0.55 | Disconfirms slider; only graft = SK_CODE_REVIEW_DEPTH env alias |
| 004 | gpt | ceiling-vs-hygiene | 0.42 | Neutral `ceiling:` content allowed; never in ALLOWED_PATTERNS |
| 005 | Opus | rule-invariant guard | 0.65 | Canary = net-new (wording); Iron Law drifted 3 ways; script+workflow not vitest |
| 006 | gpt | benchmark | 0.62 | No clone; fold code_loc into Lane B sweep (already correctness-gated) |
| 007 | Opus | ship-then-question | 0.40 | No new class/severity; needed-ness prompt + anti-stall rule |
| 008 | gpt | ponytail-review overlap | 0.45 | Merge stdlib/native/shrink rows + Replacement field; reject net:-N gate |
| 009 | Opus | portability | 0.45 | Repo already has mirror-sync-verify (mis-scoped); promote to repo-wide gate |
| 010 | gpt | synthesis | — | 25 recs ranked; best=Phase-1 ladder; most-overrated=intensity slider |
| 011 | Opus | R2 verify gpt-lane | — | All gpt/synthesis recs survive; ladder is highest-RISK not lowest-risk |
| 012 | gpt | R2 verify opus-lane | — | Opus-lane confirmed; canary scope correction (pr_state_dedup = COMMENTED only) |

## Next step
`/speckit:plan` starting with Wave A (additive doc rows) → `/speckit:implement`. No skill code changed in this packet.
