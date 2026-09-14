---
title: "Iteration 5: Ranked recommendation and phased integration plan (Angle 10)"
trigger_phrases: []
---
# Iteration 5: Ranked recommendation and phase plan

## Focus
Angle 10 — the verdict on `cli-hermes` as the seventh `cli-external-orchestration` runtime, a ranked recommendation list where each item names the failure it prevents, a concrete phase plan for 002+, and the residual UNKNOWN register that implementation must pin.

## Actions Taken
- Synthesized iterations 1–4 (headless contract, provider/model/reasoning surface, fan-out fitness, seven-runtime matrix) into the recommendation and phase plan below; no new source reads needed — all claims trace to earlier evidence.

## Findings

### F1. Verdict: integrate — Hermes is a viable seventh runtime, with two mandatory pre-conditions

Hermes satisfies every hard requirement of the `cli-external-orchestration` contract: deterministic headless dispatch (`chat -Q` + `--query-file`), write-permitting flag (`--yolo`), per-run wall-clock (`--run-budget`), model+reasoning knobs that map 1:1 onto the executor schema, a real home-dir isolation primitive (`--profile`/`HERMES_HOME` — pre-import, stronger than `cli-devin`'s file-only `--config`), an inherited self-invocation marker (`HERMES_AGENT=true`), and trustworthy exit codes (hard `os._exit`, 0/1/2/130). Its sandbox posture (`false` preventive) matches the existing devin/pi/opencode posture — no new confinement machinery needed. [iter-1, iter-2, iter-3]

The two pre-conditions: (a) **a configured provider** — today's `~/.hermes` has zero credentials, so no smoke test has ever run; the end-to-end `chat -Q` path is source-verified but live-unproven; (b) **a repo-local config contract decision** — Hermes has no project `.hermes/` surface, so the integration must decide how repo-scoped settings (if any) are delivered. [iter-2, iter-4]

### F2. Ranked recommendations

**R1 — Dispatch shape: `chat -Q` + `--query-file`, never `-z`.** `hermes chat -Q --query-file <prompt> --yolo --run-budget <T> --max-turns <N> --source tool --in <repo> </dev/null`. `-z` auto-yolos AND drops the session id — the un-auditable form. *Prevents: unaudited write-capable dispatches.* [iter-1 F2-F4; iter-3 F2]

**R2 — Provider/auth pin before any build.** Zero providers configured today; the only zero-new-secrets path is the Codex OAuth import (`~/.codex/auth.json` exists). One live `chat -Q` smoke must run before the executor table is wired — the runner's exit-code trust depends on it. *Prevents: shipping an executor whose happy path has never executed.* [iter-2; hermes status 2026-09-14]

**R3 — Isolation posture: shared `HERMES_HOME` + `--ignore-rules` + `--source tool` for phase 1; `--profile` deferred.** Profiles are credential-isolated islands (fresh `.env`/`auth.json`) — a fan-out profile would be logged out of everything. `--ignore-rules` kills SOUL.md/memory/rules bleed; `--source tool` keeps lineage runs out of user session lists. *Prevents: cross-session memory bleed into lineage prompts AND dead-profile dispatches.* [iter-3 F3-F4]

**R4 — Explicit toolset list on every dispatch: `-t web,terminal,file,code_execution,skills,todo,session_search,connections` (no `delegation`, no `memory`).** Stock roster has `delegation` ✓ enabled — a leaf lineage would silently get sub-agent spawning. *Prevents: nested-agent fan-out escaping the runner's delegation boundary, and memory-tool writes/reads bleeding state.* [iter-4 F3; `hermes tools list` 2026-09-14]

**R5 — Never `--worktree` in the lineage command.** It writes `.git/worktrees/` inside the source repo — a containment-visible repo mutation the runner didn't make. *Prevents: false-positive write-containment trips.* [iter-3 F5]

**R6 — `--run-budget` < runner `timeoutSeconds`.** Budget expiry produces no distinct exit code; the in-agent wrap-up must win the race so the runner's kill is the exception path, not the normal one. *Prevents: truncated answers masquerading as exit-0 success.* [iter-3 F8]

**R7 — Not `SELF_PRESENCE_EXEMPT`.** Hermes has `delegate_task`; the pi exemption exists precisely because pi lacks in-process delegation. `HERMES_AGENT`/`HERMES_SESSION_ID` are the detection markers; `cli-hermes` dispatches must still pass ancestry+lockfile guards. *Prevents: undetected self-dispatch recursion.* [iter-3 F1]

**R8 — Env hygiene: `HERMES_*` + rostered provider prefixes only.** `EXECUTOR_ENV_PREFIXES_BY_KIND['cli-hermes'] = ['HERMES_']` plus evidence-based provider prefixes (`ZAI_`/`GLM_`/`XAI_`/`MINIMAX_`/`DEEPSEEK_`/`XIAOMI_`/`OPENROUTER_`/`NOUS_*`) as the roster lands them. State env: `SPECKIT_HERMES_STATE_DIR`, `HERMES_HOME`; default home `.hermes`. *Prevents: credential leakage across lineages and missing state-dir audit coverage.* [iter-3 F1]

**R9 — No `--accept-hooks` unless the repo intentionally ships Hermes hooks.** Consent-gated shell hooks would otherwise block headless runs; today none are configured so the flag is inert — keep it off until a hook contract exists. *Prevents: surprise consent prompts stalling unattended runs, and unintentionally blessed hook surfaces.* [iter-4 F4; `hermes hooks list` 2026-09-14]

### F3. Phase plan

**Phase 002 — contract pin + smoke (blocks everything).** Configure one provider (Codex OAuth import is the only zero-secret path; else add one API key to `~/.hermes/.env`); run the sanctioned smoke (`hermes chat -Q --oneshot --max-turns 1 --run-budget 60 -q "Reply with the single word OK" </dev/null`); verify exit code, `-Q` stdout purity, and `session_id:` on stderr. Decide the repo-local `.hermes` contract: (a) none — home-scoped only, document it; (b) project `.hermes/` dir recognized upstream (feature request); (c) runner-managed `HERMES_HOME` per lineage. Recommend (a) for 002, revisit (b) upstream.

**Phase 003 — executor registration.** `executor-config.ts`: add `cli-hermes` to `EXECUTOR_KINDS`, `EXECUTOR_KIND_FLAG_SUPPORT` (`model`,`reasoningEffort`,`configDir`,`timeoutSeconds`,`liveTools`; no `sandboxMode`), `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY=false`, web-search matrix (live via `-t`, no cached). `executor-audit.ts`: env prefixes, state env, default home `.hermes`. `buildHermesLineageCommand` per R1/R4/R5/R6.

**Phase 004 — runtime packet + hard rules.** `cli-hermes` packet under `.opencode/skills/cli-external-orchestration/` mirroring the six siblings: dispatch contract, flag table, env hygiene, hook/hookless posture, `--ignore-rules` mandate, delegation-strip rule, worktree ban, session-id capture, budget-vs-timeout pairing.

**Phase 005 — optional hardening (deferred).** Dedicated `cli-hermes-fanout` profile with seeded auth; `terminal.backend` docker/ssh as a real sandbox path (config-level, not per-run — needs its own research); repo-declared Hermes hooks contract if the repo ever ships `.hermes` hooks; `delegation`/`subagent` fan-out semantics for non-leaf lineages.

### F4. Required vs optional

Required for merge: R1–R8, phases 002–004. Optional/deferrable: profile-per-lineage isolation (R3 phase-2), terminal-backend sandbox (phase 005), upstream repo-local config (phase 002 decision may defer), non-leaf `delegation` semantics.

### F5. Residual UNKNOWN register

- **U1**: live `chat -Q` end-to-end behavior (stdout purity, `session_id:` line, exit codes under `--yolo`) — blocked on a configured provider. **Mitigation: phase 002 smoke is gating.**
- **U2**: `--run-budget` expiry stderr signature — is the wrap-up notice machine-parseable? Only observable live. Mitigation: R6's ordering rule makes the code path reachable-but-rare.
- **U3**: `delegate_task` internals — `delegation.subagent_auto_approve`, `child_timeout_seconds`, whether children inherit `--yolo`/`--ignore-rules`. R4 strips the toolset entirely for leaf lineages; non-leaf use needs its own pin.
- **U4**: whether any upstream path reads a project `.hermes/` beyond skills discovery — evidence says no, but the skills upward-walk finding means partial project discovery exists; needs a definitive grep pass in phase 002.
- **U5**: `hermes prompt-size` / context-budget interplay with `--max-turns` under long iteration briefs — not yet measured.
- **U6**: plugin `portable_mcp_servers` + hooks under `--safe-mode`/`--ignore-user-config` — do plugin-supplied MCP servers still load? (R9 + phase-1 `--ignore-rules` mitigate; `--safe-mode` is the nuclear option.)

## Questions Answered
- Should `cli-hermes` be integrated? **Yes**, gated on the phase-002 provider pin + smoke.
- What order? Contract pin → executor tables → packet → optional hardening.
- What could go wrong? Each R names its prevented failure; the top risks are U1 (unproven happy path) and U3 (delegate_task semantics).

## Ruled Out
- `-z` dispatch form (iter 1, 3). `--worktree` in lineage commands (iter 3). `SELF_PRESENCE_EXEMPT` membership (iter 3). Default toolset roster for leaf lineages (iter 4). Profile-per-lineage as the phase-1 posture (iter 3 — credential island problem).

## Reflection
The recommendation set is fully derived — every R traces to a sourced finding, every phase has an entry criterion. The honest gap is U1: this lineage never ran Hermes end-to-end because no provider is configured. That gap is the plan's first gate, not a footnote.

## Assessment
- newInfoRatio: 0.60
- Novelty justification: The ranked recommendation, phase plan, required/optional split, and UNKNOWN register are new synthesis; underlying evidence is fully carried from iterations 1–4 — appropriately convergent for the terminal angle.
- Confidence: high on the plan structure and required items; the plan itself names its single gating unknown (U1) and sequences it first.

## Recommended Next Focus
Terminal iteration — no next focus. Proceed to phase_synthesis.

## SCOPE VIOLATIONS
None.
