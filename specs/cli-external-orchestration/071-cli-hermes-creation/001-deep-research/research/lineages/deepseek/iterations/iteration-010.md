# Iteration 10: Angle 10 — Recommendation

## Focus

Given angles 1-9: the recommended phase plan for phases 002+, which candidate phases merge,
split or drop, what stays UNKNOWN until a live contract pin, and what the operator should
decide. Ranked recommendations; each marked required or optional with the failure it
prevents.

## Actions Taken

- Read the parent `spec.md` phase map and candidate list (phases 002-011) and the handoff
  criteria (operator confirms the plan before 002+ scaffold).
- Consolidated all open UNKNOWNs and operator decisions from iterations 1-9.
- Compared with the 031-cli-pi-creation 15-phase precedent and the 046 headless-dispatch-trap
  warning (untrusted-workspace gate / --sandbox write rejection).

## Findings

1. **The parent's candidate phase set is sound; two merges, one narrowing, no splits, no
   drops.** The phase-parent decomposition (contract-pin → executor support → skill packet →
   runtime folder → bridges → model routing → playbook → governance) matches what the
   evidence supports. Adjustments:
   - **MERGE 006 (agent/command bridge) into 004 (skill packet).** Angle 5 showed the
     deliverable is persona-skills + prompt templates — exactly the skill packet's own
     content (references + assets). A standalone 006 would be a thin phase repeating 004's
     output.
   - **MERGE 008 (MCP) into 004 as a reference + operator-doc section.** Angle 7 showed MCP
     config is user-level; the phase's only repo-side deliverable is the deny-by-default
     policy text and the operator doc — packet material, not a phase.
   - **NARROW 007 (hook/plugin layer) to the project-local plugin only.** Angle 6: shell
     hooks (operator-level) and Agent Plugins v1 (deferred) are explicitly out of scope; the
     phase builds `./.hermes/plugins/repo-guards` and documents the env gate
     (`HERMES_ENABLE_PROJECT_PLUGINS=1`).
   - **KEEP 005 (runtime folder) separate and sequenced with 004** — the symlink strategy
     (whole-dir `skills -> ../.opencode/skills`, flattening caveat) is a concrete deliverable
     with its own verification.
   [SOURCE: parent spec.md:108-139; iterations 5, 6, 7]

2. **Recommended phase plan (ranked, required first).**
   - **R1 (required) — 002-hermes-contract-pin.** Live-verify: `chat -Q` exit code on
     run-budget exhaustion; `--yolo` behavior on a non-TTY with a dangerous command;
     byte-shape of stdout/stderr with a real provider; `--query-file` round-trip; `--worktree`
     behavior. Failure prevented: scaffolding every later phase on code-read claims.
   - **R2 (required) — 003-deep-loop-executor-support.** Seventh `ExecutorKind` per the
     angle-8 builder spec: `hermes chat -Q --oneshot --max-turns N --run-budget S --yolo
     --accept-hooks -t <toolsets> --pass-session-id -q <prompt> </dev/null --in <repo root>`;
     `HERMES_SUPPORTED_MODELS` (2 models: `deepseek-v4.1-flash`, `glm-5.3-flash`);
     `EXECUTOR_KIND_FLAG_SUPPORT` (model, reasoningEffort, timeoutSeconds, liveTools);
     preventive-sandbox false; web matrix live; env map `HERMES_` prefix + `HERMES_HOME` +
     `SPECKIT_HERMES_STATE_DIR`; dispatch-audit regex row; combo-matrix tests. Failure
     prevented: an unavailable/off-roster hermes becoming routable (handoff criterion).
   - **R3 (required) — 004-cli-hermes-skill-packet (absorbing 006 + 008).** `sk-create-skill`
     packet with the seven hard rules (stdin-redirect-required,
     hermes-availability-required, yolo-required-for-writes, hermes-home-isolation-required,
     mcp-config-operator-required, hooks-user-level, web-search-explicit); references:
     cli-reference (angles 1, 8), providers-and-models (angle 2 + roster), agent-delegation
     (angle 5: inline persona + persona-skill pattern), hook-contract (angle 6),
     mcp-policy (angle 7); hub registration (mode table + layout block + hub-router.json +
     mode-registry.json + leaf-manifest.json). Failure prevented: seventh mode with no
     documented contract, or a hub registration that breaks the six existing modes.
   - **R4 (required) — 005-hermes-runtime-folder.** Create repo-root `.hermes/`: whole-dir
     `skills -> ../.opencode/skills` symlink, `prompts/` (flattened command templates),
     `plugins/repo-guards/` placeholder (from 007), `SYNC.md` + manual-testing-playbook
     symlink per dotfolder convention. Failure prevented: repo-local skills/prompts with no
     carrier.
   - **R5 (required) — 007-hermes-hook-and-plugin-layer (narrowed).** Build
     `./.hermes/plugins/repo-guards`: pre_verify → completion-evidence stop; pre_tool_call →
     dispatch audit/preflight; on_session_start/end → session context; shell out to existing
     .mjs/.sh cores; document `HERMES_ENABLE_PROJECT_PLUGINS=1`. Failure prevented:
     unguarded Hermes dispatches running the repo.
   - **R6 (required) — 009-hermes-model-registry-and-routing.** Gate on the operator
     credential step (llmgateway `providers:` entry with `key_env: LLMGATEWAY_API_KEY`);
     `HERMES_SUPPORTED_MODELS` enforcement; reasoning-effort map
     (`HERMES_REASONING_TO_GATEWAY` analog of `REASONING_TO_PI_THINKING`, live-pinned in
     002). Failure prevented: off-roster model dispatch and effort-name mismatch.
   - **R7 (optional) — 010-hermes-playbook-and-catalog.** Manual-testing playbook + feature
     catalog with the create modes. Failure prevented: untested packet claims.
   - **R8 (optional) — 011 governance/roster closeout.** AGENTS.md/CLAUDE.md/REPO RULES.md/
     roster docs mention cli-hermes as the seventh runtime. Failure prevented: roster
     drift.
   [SOURCE: parent spec.md:108-139; iterations 1-9]

3. **UNKNOWNs that only a live contract pin (002) or an operator action can resolve.**
   - `chat -Q` exit code on run-budget exhaustion (code-read: partial-with-response → 0;
     needs a live probe).
   - Skills trust + symlinked-tree scan verdict for this repo (requires the `hermes skills
     trust` mutation — operator-gated).
   - Reasoning effort-name mapping through the llmgateway custom route (Hermes names vs
     gateway's low/high/max).
   - `code_mode` MCP add end-to-end (`--env` handling, tool discovery).
   - Real dispatch byte-shape with a configured provider (no provider configured today, so
     the allowed smoke dispatches could not fire).
   - `HERMES_HOME` isolation side effects on a fresh home (sessions DB bootstrap).
   - Startup latency of a real dispatch (0.86s `--version` is a lower bound).
   [SOURCE: iterations 1-9 UNKNOWN markers]

4. **Operator decisions.**
   - Confirm the phase plan (parent handoff criterion, spec.md:70).
   - Configure the llmgateway provider in `~/.hermes` (key_env only; values never needed in
     the repo) and approve the two-model roster.
   - Run `hermes skills trust` on the repo (operator-level mutation, outside the repo's write
     surface).
   - Decide persona strategy: inline personas (start) vs 13 persona-skills (only if prompt
     bloat becomes measurable).
   - Decide whether 010 and 011 run as separate phases or fold into 004's closeout.
   [SOURCE: parent spec.md:70; iterations 2, 3, 5]

5. **Overall verdict: Hermes is fit as the seventh runtime and fit for deep-loop fan-out**,
   with the caveats carried in the hard rules: no preventive sandbox (runner containment
   guard is the control), user-level config for trust/hooks/MCP (operator steps are real),
   flattening skill surface (whole-dir symlink still the right move), and
   `hermes pause` not being a CLI stop (runner kill is the stop). The integration order that
   worked for cli-pi holds: pin the contract, build the executor, document the packet, then
   bridge and route.
   [SOURCE: synthesis of iterations 1-9]

## Questions Answered

- Q10 (recommendation): answered. Plan = R1..R8 as ranked; merges 006→004 and 008→004;
   narrowing 007; no splits/drops; UNKNOWNs and operator decisions enumerated.

## Questions Remaining

- None in this lineage. All ten angles answered with cited evidence.

## Assessment

- newInfoRatio: 0.55 — the phase adjustments and UNKNOWN/decision consolidation are new but
  synthesize prior iterations (expected at the final angle).
- Confidence: high on the plan (evidence-backed); the plan's R1-R6 sequence mirrors the 031
  precedent and the parent's own handoff criteria.

## Reflection

- What worked: anchoring the plan to the parent's candidate list and handoff criteria kept
  the recommendation executable rather than speculative.
- What failed / ruled out: standalone 006 and 008 phases (thin by the evidence); splitting any
  candidate (none needs it); dropping the contract-pin (it is the parent's own gate).
- Ruled-out direction: recommending a phase before the operator's credential step for 009.

## Recommended Next Focus

None — this was the final angle. Proceed to synthesis.
