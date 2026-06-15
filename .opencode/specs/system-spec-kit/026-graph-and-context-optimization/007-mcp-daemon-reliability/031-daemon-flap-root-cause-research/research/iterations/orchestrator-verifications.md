# Orchestrator verifications (live, beyond the gpt-5.5 seats) — daemon-flap research

Facts I confirmed by running commands/greps this session, correcting or sharpening seat + my own earlier claims. Date 2026-06-14.

## 1. The phase-026 "LaunchAgent" supervises the ORPHAN SWEEP, not the daemons — CORRECTION
- The only mk-related plist in the repo is **`.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist`** (found via `find -iname '*.plist*'` + grep KeepAlive/RunAtLoad). It runs the orphan-mcp-sweeper, i.e. it REAPS stray processes — it does NOT KeepAlive-supervise (resurrect) mk-spec-memory / mk-skill-advisor / mk-code-index.
- **No mk- LaunchAgent is installed** on this machine (`ls ~/Library/LaunchAgents` shows none matching mk-/spec/advisor/code-index).
- **Implication:** "adopt the existing LaunchAgent" is NOT a ready-made daemon-resurrection fix. The launchd *infrastructure pattern* exists (a `scripts/launchagents/` dir + an install convention), but an always-on KeepAlive plist PER daemon (+ the shared HF sidecar) would be NEW work. IT4's evaluation must treat OS-supervision-of-the-daemons as a to-build fix, not an enable-the-existing-one fix.

## 2. Re-election is definitively spec-memory-ONLY — CONFIRMED
- `grep -c 'daemonReelectionEnabled|shouldReleaseDaemonForReelection'`: mk-skill-advisor **0**, mk-code-index **0**, mk-spec-memory **6**.
- mk-skill-advisor signal handler (L1185+): on SIGINT/TERM/HUP/QUIT → `childProcess.kill(signal)` → SIGKILL fallback after 5s → `process.exit(128)`. No release/re-election branch. So "re-election default-on" protects ONLY spec-memory; advisor (and code-index) die with their launcher.

## 3. Warm-only ≠ no-resurrection; a NON-warm CLI call DOES cold-spawn — SHARPENS my earlier claim
- README.md:163 (verbatim sense): `--warm-only` / the prompt-time envs (`SPECKIT_CLI_PROMPT_TIME`, `CLAUDE_CODE_PROMPT_TIME`, `OPENCODE_PROMPT_TIME`, `CODEX_PROMPT_TIME`, per-CLI `*_CLI_WARM_ONLY`) make the CLI **probe and exit 75 instead of cold-spawning**. "Without warm-only, a cold daemon is **auto-spawned through the matching `mk-*-launcher.cjs`**, so non-prompt contexts (scripts, CI) work from a cold start."
- **So:** the daemons ARE resurrectable right now via a direct non-warm invocation, e.g. `node .opencode/bin/skill-advisor.cjs advisor_status --json '{...}'` (no `--warm-only`) → cold-spawns the launcher → daemon. What left THIS session reporting them down is that the SessionStart/prompt-time hooks probe warm-only (by design, so prompt-time never blocks on a cold spawn). My earlier "warm-only CLI can't cold-start; needs a fresh session" was incomplete — a fresh session OR any non-warm CLI/script invocation cold-starts them.
- Exit taxonomy (README:161): 0 ok, 1 runtime error, 64 usage/schema, 69 protocol/stale-dist, 75 retryable daemon.

## 3c. LIVE cold-spawn test (2026-06-14 ~17:07) — REFUTES the simple remediation for spec-memory
Ran the actual remediation to verify IT10's #1 unverified claim ("non-warm CLI heals the real stale state"):
- `node .opencode/bin/spec-memory.cjs memory_match_triggers --json '{...}'` (NO `--warm-only`) → **exit 75, `backend unavailable: ECONNREFUSED`**, and the socket **stayed dead** afterward. Re-ran with prompt-time envs explicitly cleared/zeroed → **same exit 75, still dead**.
- **No prompt-time/warm-only env is set** in this Claude session's Bash (only `CLAUDE_CODE_*` identity vars) — so my earlier "prompt-time env forces warm-only" hypothesis was WRONG.
- Transient `mk-spec-memory-launcher` processes DID appear then EXITED (2 seen, then gone) — so **cold-spawn IS attempted, but the spec-memory daemon fails to start/bind and the launcher gives up.**
- **Root sub-cause (live):** `/tmp/mk-spec-memory/hf-embed.pid` records HF model-server **pid 30817 (startedAt 07:43)** but **no hf-embed/model-server/nomic process is running** → the shared HF embed sidecar is **dead with a stale pidfile**. spec-memory's backend depends on that embed server, so it cannot become ready → CLI times out → 75 → launcher exits. (skill-advisor showed `status:ok` only because it was ALREADY alive — a confound, not proof of cold-spawn.)
- **Live confirmation of a research hypothesis:** the shared HF sidecar (IT2 L60, IT5 refcount, IT8 P1) is a REAL failure axis — here it is the *actual blocker*. CORRECTION to IT9's "immediate remediation": a non-warm CLI cold-spawn is NOT sufficient for spec-memory right now; the dead HF sidecar (stale `hf-embed.pid`) must be cleared/revived first (e.g. remove the stale pidfile + let a fresh launcher respawn HF, or a fresh runtime session). This is exactly the compound failure the HF-refcount (Phase 3) and supervisor (Phase 4) fixes target.

## 4. Net effect on the root-cause + fix framing
- **Immediate remediation** (no code change): a non-warm CLI invocation (or a fresh session) cold-spawns the dead daemons; an orphan sweep handles the piled-up code-index launchers.
- **Root-cause fix space** is therefore about making liveness session-independent + automatic, NOT about a missing manual command. Candidate primary fixes to weigh in IT4/IT8: (a) NEW launchd KeepAlive plists (macOS) + systemd --user (Linux) supervising each daemon (+ HF sidecar) — build, not enable; (b) uniform launcher hardening — give advisor + code-index the spec-memory re-election/owner-release + add a proactive stale-socket sweep + a resurrector; (c) a tiny always-on supervisor process. The SIGKILL/OOM/crash-loop-give-up gap (008/009/crash-loop guard) means whatever wins must restart on ANY death, not just graceful release.
