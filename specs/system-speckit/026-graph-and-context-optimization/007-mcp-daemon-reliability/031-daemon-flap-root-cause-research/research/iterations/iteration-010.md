# Iteration 010 — completeness critic + final convergence

- **Wave:** 5 (of 5) · **Executor:** `openai/gpt-5.5-fast --variant xhigh` (read-only, exit 0) · **Seat:** b6boz9l7t · **Date:** 2026-06-14
- **Prompt:** `../prompts/iter-010.txt` · **Raw (full):** `../raw/iter-010.out` · **Confidence:** high on root-cause class; medium on Phase-1 sufficiency
- (Ran before iteration-009 landed → reviewed 001-008 + verifications + live-diagnosis; independently re-verified `daemonReelectionEnabled` is spec-memory-only + that no `SPECKIT_PROMPT_SELF_HEAL`/kick exists yet + that SessionStart currently only appends warm-only fallbacks.)

---

## Final convergence answer
The system is **session-coupled, not truly supervised**. `mk-spec-memory` has spec-memory-only release/adopt; `mk-skill-advisor` + `mk-code-index` kill/clear on shutdown; prompt-time hooks + CLI fallbacks are warm-only by design, so a dead daemon with a stale socket stays dead until a NON-warm launcher path runs. `mk-code-index` survived this incident because live launcher/proxy processes remained, not because it's inherently durable. **Phase-1 fix = C2-minimal** (throttled background cold-start kick from warm-only dead-daemon probes, at SessionStart + advisor prompt hook, behind a flag, with telemetry). **Honest:** C2 fixes the "cold-at-session-start stays cold forever" SYMPTOM; it is NOT the definitive root-cause fix — durable correctness needs a session-independent owner (supervisor + one OS unit) + migration fences + sidecar lifecycle + RSS controls.

## Unverified load-bearing claims (ranked by impact-if-wrong)
- **P0 — C2 heals the ACTUAL live stale-socket state:** non-warm cold-spawn is documented but was NOT proven against the real advisor/spec-memory stale socket files. **Most plan-changing if wrong.**
- **P0 — kick is early enough for first-turn readiness:** IT6 admits non-blocking kick can't guarantee it without a wait budget.
- **P0 — already-disconnected NATIVE MCP transports recover once the daemon is resurrected:** NOT verified; **probably the biggest hidden gap** — C2 may restore CLI fallbacks while `mcp__mk_skill_advisor__*` / `mcp__mk_spec_memory__*` native tools stay disconnected until a fresh runtime session (phase 030 = harness-owned, unshipped).
- **P0 — throttle lock holds under 7 concurrent runtimes** (needs the stress test; else launcher storm worsens OOM).
- **P0 — exact live death path** (owner-exit / idle / OOM / bridged-owner-death — no log recovered it).
- **P1** — advisor/code-index backend-only feasibility (only spec-memory has the plumbing); HF lifecycle/RSS unmeasured; bind-time stale reclaim sufficient for C2; crash-loop guard + repeated kicks interact safely; prompt-time process creation acceptable to operator.

## Contradictions / tensions (resolved)
- "needs fresh session" vs "non-warm CLI resurrects" → **any non-warm CLI/script cold-spawns**; only prompt-time is warm-only.
- "C2 fixes it" vs "root-cause fix" → C2 fixes the warm-only-trap symptom, not session-independent liveness.
- IT7 layered vs IT8 descope → ship C2-minimal first; B/C1/OS-supervision explicitly deferred behind data + migration gates.
- always-warm vs OOM → don't default always-warm until RSS baseline + free-RAM floor + sidecar policy measured.
- adopt/re-election vs phase-028 double-writer → don't generalize adopt to advisor/code-index without lease mode/version fencing + two-launcher single-writer tests.
- **Flagged open:** prompt-time side effects (flag + default decision = operator); native MCP reconnect (harness-owned); orphan-sweeper vs future resident daemons (teach it lease modes).

## Coverage gaps (no iteration covered)
Live proof Phase-1 resolves THIS operator's 7-runtime state; native-MCP-reconnect acceptance; Windows-native (non-WSL); HF model-server 4th-process lifecycle (ownership/refcount/idle/restart/RSS); trusted mutations (`code_graph_scan`/`advisor_rebuild`/`skill_graph_scan`) during resurrection; security of prompt-time spawning; a health/liveness dashboard + runbook; migration plan for old-launchers-running-while-new-code-deployed; measured first-success latency; crash-loop/OOM safe-stop test.

## Does Phase-1 actually fix the live symptom? (honest)
**Partially.** A flagged C2 SessionStart/UserPromptSubmit kick turns "dead all session" → "first warm probe may fail, background launch starts, a later prompt/CLI likely succeeds." It does NOT guarantee first-prompt readiness, does NOT prevent the next session-exit/idle/OOM death, and **may not restore already-disconnected native MCP transports in the same runtime.** Without a proven atomic throttle it can cause a launcher storm. Good minimal remediation; "root-cause fix" would be overstated.

## Live-verification acceptance checklist (12)
baseline (procs/sockets/warm+non-warm exits/RSS/native-MCP availability) · reproduce stale-socket state in temp env · **prove non-warm CLI cold-start heals the real stale state for advisor+spec-memory** · C2 kicks exactly 1 launcher/service · 7-runtime throttle stress (no storm) · SessionStart + advisor UserPromptSubmit kick verified per runtime (Claude/Codex/OpenCode) · measure first-success latency (decide wait budget) · verify resurrected daemon restores native MCP OR document fresh-session-required · trusted mutations after resurrection in fixtures · RSS with all daemons+HF under multi-session load before always-warm · security (0700 socket dir, no Stop/compact kicks, flag-disable works, stale-lock recovers) · observability (kick/skip/fail/healed/time-to-first-success).

## Confidence + the single thing most likely to be wrong
High on root-cause class; medium on Phase-1 sufficiency. **Most likely wrong: that C2 "fixes the live symptom" for the CURRENT session — it may only resurrect backend daemons + CLI fallbacks while already-disconnected native MCP transports stay dead until a fresh runtime session.**
