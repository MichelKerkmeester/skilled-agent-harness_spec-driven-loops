Reading additional input from stdin...
2026-06-29T10:31:50.328265Z ERROR codex_core::session::session: failed to load skill /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-open-design/SKILL.md: invalid YAML: mapping values are not allowed in this context at line 2 column 345
2026-06-29T10:31:50.328299Z ERROR codex_core::session::session: failed to load skill /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-open-design/SKILL.md: invalid YAML: mapping values are not allowed in this context at line 2 column 345
OpenAI Codex v0.137.0
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
model: gpt-5.5
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019f12ef-6ba2-7a12-9ff7-a681aab77ef4
--------
user
You are GPT-5.5 at xhigh reasoning doing an ADVERSARIAL verification pass over a hardening design produced by a different model (GLM-5.2). Be skeptical: your job is to CONFIRM what is right, REFUTE what is wrong, and find GAPS the prior research missed — not to agree. Read the synthesized design at .opencode/specs/system-code-graph/001-code-graph-core/009-daemon-reclaim-hardening/research/research.md and the actual source .opencode/bin/mk-code-index-launcher.cjs and .opencode/bin/launcher-ipc-bridge.cjs (and the child initDb under system-code-graph/mcp_server if useful). Ground every claim in the REAL code (cite function/line). Incident recap: the code-index daemon wedged (PID alive, IPC socket never created, lease file gone, 17MB orphaned WAL) and /mcp reconnect returned -32000.

## Angle: adversarial-refute-p0
Try to REFUTE each P0 recommendation (socket-health probe reuse, the live-but-dead-socket reclaimable state, no-bridge-socket->respawn, the startup grace window, startup WAL hygiene, diagnostics). Specifically stress: (a) does reusing probeDaemon({deepProbe:true}) as a health check have side effects — does opening an extra JSON-RPC initialize connection consume/disturb the real client, race the bridge, or get counted as a client? (b) is the launcher safe to open/checkpoint the sqlite WAL itself given the launcher normally never touches sqlite — could that create a second writer or lock contention with the child? (c) is the grace-window math sound given the bootstrap-lock + first npm/tsc build happen BEFORE the child spawns? Confirm or refute each with code evidence.

Return ONLY JSON at the end: {"angle":"<angle>","confirms":["GLM rec X is correct because…"],"refutes":[{"target":"GLM rec/claim","problem":"…","evidence":"file:line"}],"gaps":["missed failure mode / angle…"],"new_recommendations":[{"change":"…","where":"file:func","why":"…"}],"verdict":"sound|sound-with-fixes|flawed"}
hook: SessionStart
hook: SessionStart
hook: SessionStart Completed
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
hook: UserPromptSubmit Completed
codex
Using `sk-code` for the code-grounded verification route; this is read-only, so I’m staying inside evidence gathering and citation.
exec
/bin/zsh -lc "sed -n '1,260p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-code-graph/001-code-graph-core/009-daemon-reclaim-hardening/research/research.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,240p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-code/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# Research: code-index daemon reclaim hardening (prevent the wedge recurrence)

**Subject:** Prevent recurrence of the Code Graph daemon wedge — a PID-alive-but-socket-dead daemon the launcher does not reclaim, causing MCP reconnect `-32000`.
**Method:** 10-iteration deep research, executor `zai-coding-plan/glm-5.2 --variant high` (max thinking), COSTAR. Iters 1-9 converged; iter 10 (test-design) timed out but its content is recoverable from the design below.
**Target file:** `.opencode/bin/mk-code-index-launcher.cjs` (+ `launcher-ipc-bridge.cjs`, child `system-code-graph/mcp_server/dist/index.js` `initDb`).

## Root cause (converged)

Liveness is **bidimensional** — `processLiveness` proves only `process.kill(pid,0)` (PID exists), and the heartbeat is written by the **launcher**, not gated on the daemon's ability to serve. There is **zero socket-health correlation**. So a wedged daemon (PID alive, 0% CPU, socket never (re)created) classifies as `live-owner` / `held:true`. The inert branch is `maybeBridgeLeaseHolder`'s no-socket path (bridge `L405-408`): when the lease says "held" but the socket FILE is missing, it `report`s instead of respawning. Two compounding axes in the incident: (a) the lease file had also vanished from an empty socket dir, so the heartbeat-reclaim (which needs a lease file with an aging `lastHeartbeatIso`) never had anything to age out; (b) a 17 MB orphaned WAL from the unclean crash.

**Liveness must be tridimensional: PID-alive AND socket-serving AND heartbeat-fresh.**

## Converged hardening design

1. **Reuse the existing probe.** `launcher-ipc-bridge.cjs:probeDaemon({deepProbe:true})` (~L150-236) already connects the UDS + sends a JSON-RPC `initialize`. Wrap it as `probeExistingService(socketPath)` returning `{status, kind}` where `kind ∈ {enoent, econnrefused, timeout, json-rpc-reply}`.
2. **Socket-health gate in classification.** Add a `live-but-dead-socket` state to `classifyOwnerLease` and mirror it in `leaseHeldFromFile` (after the `process.kill(pid,0)` success at `~L602`): if `socketPath` is missing/dead (fast-path `!existsSync`, else N-consecutive deep-probe failures), return `staleReclaimable:true` instead of `held:true`. Extend the reclaimable allowlist (`~L479-484`) — the existing `unlink + O_EXCL` CAS handles it atomically, no CAS change.
3. **No-bridge-socket → respawn, not report.** Change bridge `L405-408` to route a socketless-but-live owner into the existing `respawnAfterDeadSocket → reapOwnerBeforeRespawn` pipeline.
4. **Startup grace window** (so a *starting* daemon isn't killed): `STARTUP_GRACE_MS=30000`, `MAX_INIT_MS=120000` (env-overridable), keyed on a new `childSpawnedAtIso` stamped right after the child PID is known — NOT `startedAtIso` (which precedes the bootstrap-lock wait + first build). `age ≤ grace` → still-starting (report); `grace < age ≤ max` → bounded socket re-poll; `age > max` → respawn (`startup-deadline-exceeded`).
5. **Socket-gated heartbeat.** Refresh `lastHeartbeatIso` only when the socket is actually serving; on probe failure, stop heartbeating so a dead-socket daemon ages out into `stale-heartbeat-reclaim` within 2 min. Ideally move heartbeat ownership into the daemon child (refresh only after its IPC listener echoes).
6. **Crash-surviving PID registry + self-heal on acquire.** Write `.code-graph-daemon-pid.json` (`{daemonPid, launcherPid, socketPath, startedAt, canonicalDbDir}`) right after the child PID is known; unlink only on clean child exit. On acquire, discover the orphan via `reclaimedOrphanPid → that registry → lsof on the WAL`, and reap (SIGTERM→grace→SIGKILL) **only** when `alive AND socket provably dead (N consecutive failures)**, then checkpoint, then spawn.
7. **WAL startup hygiene.** Before spawn: if `code-graph.sqlite-wal` exceeds a threshold (~8 MB) or an orphan was just reaped, run `wal_checkpoint(TRUNCATE)` (no other writer holds it). Set `wal_autocheckpoint=500` (~2 MB, tunable) in `initDb`. Checkpoint before the migration copy so a giant `-wal` is never propagated.
8. **Race + permission safety.** Apply the uid check to the PRIMARY lease (not just `legacyPath`) and to the socket owner — never unlink/bridge/kill a foreign-owned lease. Before any SIGKILL, verify PID identity (cmdline basename + process start-time vs `startedAtIso`) to avoid killing a PID-reuse victim; on mismatch log `pid-reuse-suspected` and abort. Re-stat the lease between classify and unlink (abort if changed). Gate self-heal behind a one-shot `.self-heal-attempted` marker so a failed heal never loops into a kill storm.
9. **One-line diagnostics.** Emit `LAUNCHER_DIAGNOSTIC: reason=<token> ownerPid=<n> socketPath=<p> walHeldBy=<pid|none>` on every failure exit. Tokens: `dead-socket-reclaimed`, `startup-timeout`, `foreign-owner`, `wal-locked-by-orphan`, `bridge-socket-refused`, `pid-reuse-suspected`, `stale-heartbeat-reclaimed`. Replaces manual lsof/ps forensics.

## Test plan (deterministic wedge simulation)

- **Wedge → reclaim:** spawn a fake owner that writes the lease + holds a live PID but never opens the socket; past `MAX_INIT_MS`, assert the launcher reclaims (reaps + respawns) and emits `dead-socket-reclaimed`.
- **Still-starting → not killed:** owner within `STARTUP_GRACE_MS` with no socket yet → assert NOT killed (`still-starting`).
- **Foreign-owner → not killed:** lease/socket owned by a different uid → assert no signal, `foreign-owner` diagnostic.
- **PID-reuse → not killed:** live PID whose cmdline/start-time mismatch the lease → `pid-reuse-suspected`, abort.
- **Oversized WAL → checkpointed:** seed an 8MB+ `-wal` with no holder → assert `wal_checkpoint(TRUNCATE)` runs pre-spawn and WAL shrinks.
- **Healthy owner → bridged:** live PID + serving socket → assert bridge, no reclaim.

## Recommendation

Implement components **1-3 + 4 + 7** as the P0 core (they directly close the incident class), then **6, 8, 9** as the durability/safety layer, then **5** (heartbeat) as defense-in-depth. The minimal P0 (socket-health gate + reclaim-on-dead-socket past a grace window + startup WAL hygiene + diagnostics) collapses both failure axes from the incident.

---

<!-- ANCHOR:sources -->
## Sources

- Launcher under study: `.opencode/bin/mk-code-index-launcher.cjs`, `.opencode/bin/launcher-ipc-bridge.cjs`, and the child `system-code-graph/mcp_server/dist/index.js` (`initDb`).
- source: live incident forensics, 2026-06-29 — orphaned PIDs 37269/37358 at 0% CPU, empty `/tmp/mk-code-index/`, a 17 MB `code-graph.sqlite-wal` with no holder, DB integrity ok; manual recovery via `kill` + `PRAGMA wal_checkpoint(TRUNCATE)` + socket-dir clean.
- source: 10-iteration GLM-5.2 (max thinking) deep research, iterations `iteration-001` through `iteration-010` in this folder; per-angle insights/recommendations in `angles.json`.
<!-- /ANCHOR:sources -->


 succeeded in 0ms:
---
name: sk-code
description: "Multi-stack coding standards and verification. Smart router auto-detects the active surface and loads matching code patterns."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 3.5.0.0
---

<!-- Keywords: sk-code, code workflows, smart-router, code-surface-detection, webflow, frontend, html, css, javascript, Motion.dev, motion-dev, motion_dev, cross-stack-animation, gsap, lenis, swiper, hls, filepond, opencode, system-code, mcp, typescript, python, shell, jsonc, code-quality, debugging-workflow, verification -->

# Code Workflows - Surface-Aware Smart Router

`sk-code` is the single code-work skill. It first decides which code surface is in front of it, then loads the right implementation, quality, debugging, and verification resources.

**Core principle**: `Code surface detection -> Intent classification -> Surface resources -> Verification evidence`.

---

## 1. WHEN TO USE

Use this skill when doing code work in either supported surface:

- **WEBFLOW**: Webflow / vanilla frontend work in HTML, CSS, and JavaScript, including Motion.dev runtime usage, GSAP, Lenis, HLS, Swiper, FilePond, CDN/minification, and browser verification.
- **OPENCODE**: OpenCode system work under `.opencode/`, including skills, agents, commands, MCP servers, hooks, scripts, tests, JSON/JSONC config, TypeScript, JavaScript, Python, and Shell.

Also use this skill for cross-stack Motion.dev reference work when the question is about Motion APIs, snippets, integration modes, performance pitfalls, or CSS/Motion/GSAP/WAAPI trade-offs that should live in `references/motion_dev/` or `assets/motion_dev/` rather than inside Webflow-only guidance.

Use it for implementation, code quality, debugging, verification, test failures, build failures, and before any completion claim.

Do **not** use this skill for documentation-only changes (`sk-doc`), git workflow (`sk-git`), pure browser inspection (`mcp-chrome-devtools`), or formal findings-first review output (`sk-code-review` baseline plus this skill's surface evidence).

Documentation-only edits to skill markdown route to `sk-doc`, even when the file lives under `.opencode/skills/`. Examples: updating a `SKILL.md` headline, clarifying a README paragraph, rewriting a description section, or adding a one-line summary at the top of a markdown file. Negative example: "Update the sk-code SKILL.md headline section to clarify the two-axis routing model and add a one-line summary" is `sk-doc`, not `sk-code`, because the requested change is prose-only and does not modify executable behavior or routing logic.

### Phase Overview

| Phase | Purpose | Requirement |
| --- | --- | --- |
| Phase 0: Research | Understand unfamiliar code or risky changes | Optional, but required for complex work |
| Phase 1: Implementation | Write or modify code using surface patterns | Read actual files first; apply the Design Restraint Ladder before writing new code. |
| Phase 1.5: Code Quality Gate | Apply P0/P1/P2 checks and surface standards | Required before claiming implementation done |
| Phase 2: Debugging | Trace symptom to root cause and fix one cause at a time | Required when tests/runtime fail |
| Phase 3: Verification | Run surface verification commands and record evidence | Required before any done/works claim |

**Iron Law**: no completion claim without fresh verification evidence from the detected surface.

**Baseline & blast-radius**: before Phase 1, capture the starting gate state (pass/fail counts + the names of failing tests, base commit) so Phase 3 reports the *delta*, not just a green — a green suite says nothing about a path it never ran. Open non-trivial work with a one-phrase blast-radius read ("low-blast, reversible" / "high-blast: touches auth + data") so effort matches stakes.

### Review Baseline Contract

`sk-code-review` owns findings format, severity model, and baseline security/quality/test review. `sk-code` owns surface detection and surface-specific standards evidence.

### Cross-Skill Consumption

When called from `/speckit:complete` with an `.opencode/` implementation target (`step_10_development` activity), `sk-code` surfaces the matching authoring checklist plus the `spec_folder_write` recipe AT WRITE-TIME (before the orchestrator's first write), not just at review-time.

| Target Path | Authoring Checklist Surfaced | Recipe |
|---|---|---|
| `.opencode/skills/` | `assets/opencode/checklists/skill_authoring.md` | — |
| `.opencode/agents/` | `assets/opencode/checklists/agent_authoring.md` | — |
| `.opencode/commands/` | `assets/opencode/checklists/command_authoring.md` | — |
| `.opencode/specs/` | `assets/opencode/checklists/spec_folder_authoring.md` | `assets/opencode/recipes/spec_folder_write.md` |
| MCP server source | `assets/opencode/checklists/mcp_server_authoring.md` | — |

Authoring-time load is the contract documented in `system-spec-kit/SKILL.md §16-17 cross-skill routing` and the `cross_skill_authoring_load` block in `/speckit:complete` YAMLs. Review-time `sk-code-review` baseline + `sk-code` router-selected evidence overlay remains unchanged.

---

## 2. SMART ROUTING

### Surface Detection (FIRST)

Detection is context-aware and uses CWD plus changed/target files. **Precedence**: OPENCODE target/CWD wins over WEBFLOW markers (because mixed-marker workspaces are common — `.opencode/` system tools sometimes ship frontend animation libraries internally). When neither matches, fall through to UNKNOWN.

Machine-readable stack folder contract:

```python
STACK_FOLDERS = {
    "WEBFLOW": ["src/2_javascript/", "*.webflow.js"],
    "OPENCODE": [".opencode/skills/", ".opencode/agents/", ".opencode/commands/", ".opencode/specs/"],
    "MOTION_DEV": ["references/motion_dev/", "assets/motion_dev/"],
}
```

```bash
# Use early-return precedence — never let later branches overwrite an earlier match.

# 1. OPENCODE - takes precedence: CWD or any changed/target file under .opencode/
if [[ "$PWD" == */.opencode/* ]] \
   || [[ "$TARGET_FILE" == */.opencode/* ]]; then
  SURFACE="OPENCODE"

# 2. Explicit non-Webflow guard - a prompt can ask for Motion.dev cross-stack
# guidance without making the implementation surface WEBFLOW.
elif printf '%s\n' "${PROMPT_TEXT:-}" | grep -Eiq \
     '(^|[^[:alnum:]])(not webflow|no webflow designer|without webflow|non-webflow|vanilla html/css/js only|vanilla html css js only|stack-agnostic)([^[:alnum:]]|$)'; then
  SURFACE="UNKNOWN"

# 3. WEBFLOW - frontend HTML/CSS/JS and Webflow-specific vanilla animation web
elif [[ -d "src/2_javascript" ]] \
     || ls *.webflow.js 2>/dev/null | head -1 \
     || grep -lq "Webflow\.push\|--vw-" src/**/*.{js,css,html} 2>/dev/null \
     || grep -lqE "window\.Motion|window\.gsap|gsap\.(to|from|set|timeline|registerPlugin)|new Lenis|new Hls|new Swiper|FilePond" \
        src/**/*.{js,mjs,ts,html} *.{js,mjs,ts,html} 2>/dev/null \
     || [[ -f "wrangler.toml" ]]; then
  SURFACE="WEBFLOW"

# 4. UNKNOWN - not owned by this skill; ask for runtime + verification commands
else
  SURFACE="UNKNOWN"
fi
```

**Why OPENCODE wins precedence**: `.opencode/skills/sk-doc/scripts/preview-server.js` is an OPENCODE system tool that may import vanilla animation libraries (Lenis, GSAP) for its preview UI. A first-match-WEBFLOW pseudocode would route this OPENCODE work to the wrong standards. The target/CWD path is the strongest unambiguous signal of which surface owns the work.

**Supported surfaces**:

- `WEBFLOW`: frontend HTML/CSS/JS, Webflow conventions, vanilla animation libraries, CDN/minification, and browser evidence.
- `OPENCODE`: `.opencode/` system code and config with language sub-detection.
- `UNKNOWN`: ask a short disambiguation question and do not pretend unsupported stacks are covered.

For details: `references/stack_detection.md`.

### UNKNOWN_FALLBACK Checklist

Returned when no supported surface matches, when intent confidence is low (`max(intent_scores) < 0.5`), or when the user explicitly asks for stack-agnostic guidance. Ask for the missing routing inputs instead of guessing:

- Confirm the active runtime surface — Webflow/frontend or `.opencode/` system code.
- Confirm the task intent (implementation / debugging / verification / etc.).
- Provide one concrete input, error, or expected output.
- Confirm the verification command set before any completion claim.

Do not load Go / Next.js / React Native / Swift resources — canonical `sk-code` owns only WEBFLOW + OPENCODE + MOTION_DEV. Full fallback logic: `references/smart_routing.md §8`.

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Detect surface from CWD + target files (primary routing key)
    |    +- references/<surface>/  (webflow / opencode)
    |    +- assets/<surface>/      (webflow / opencode)
    |
    +- STEP 1: Detect language sub-key (OPENCODE only) for verification commands
    |
    +- STEP 2: Weighted intent scoring (top-2 when ambiguity delta is small)
    |
    +- Phase 1: Implementation -> per-language style + standards + implementation trio
    +- Phase 2: Debugging       -> debugging refs + universal error recovery
    +- Phase 3: Verification    -> surface-appropriate verification commands + checklist
```

**The Iron Law**: NO COMPLETION CLAIMS WITHOUT RUNNING SURFACE-APPROPRIATE VERIFICATION.

Phase contract details: [`references/phase_detection.md`](./references/phase_detection.md).

### OPENCODE Language Sub-Detection

When surface is `OPENCODE`, detect language from changed/target file extensions first, then weighted keywords:

| Language | Extensions / Signals | Resources |
| --- | --- | --- |
| JAVASCRIPT | `.js`, `.mjs`, `.cjs`, CommonJS, Node, MCP | `references/opencode/javascript/*` |
| TYPESCRIPT | `.ts`, `.tsx`, `.mts`, `.d.ts`, tsconfig, interfaces | `references/opencode/typescript/*` |
| PYTHON | `.py`, pytest, argparse, docstrings | `references/opencode/python/*` |
| SHELL | `.sh`, `.bash`, shebang, pipefail | `references/opencode/shell/*` |
| CONFIG | `.json`, `.jsonc`, schema, descriptor | `references/opencode/config/*` |

Ambiguous multi-language tasks load the top matching language references plus the universal OpenCode checklist.

### Resource Domains

- `references/universal/`: surface-agnostic error recovery, code quality, style, and research guidance.
- `references/`: detection, intent scoring, loading, and lifecycle internals.
- `references/webflow/`, `assets/webflow/`: live Webflow/frontend per-language references under `references/webflow/{javascript,css,html}/*` — JS and CSS each carry `style_guide.md`, `quality_standards.md`, `quick_reference.md`; CSS additionally carries `patterns.md` (Webflow tokens, state machines, focus/form patterns); HTML carries `style_guide.md` only (Webflow Designer manages most HTML). Cross-language rules + enforcement workflow + dev workflow live under `references/webflow/shared/*`. Categorical workflow patterns (implementation, debugging, verification, performance, deployment) and copy-paste templates (`assets/webflow/templates/component_template.{js,css}`) round out the surface. Mirrors the OPENCODE per-language layout so the smart router resolves both surfaces with identical key-derived patterns.
- `references/motion_dev/`, `assets/motion_dev/`: cross-stack Motion.dev API, timeline, scroll/gesture, performance, decision-matrix, integration, install, playbook hook, and snippet resources. Webflow docs link here for generic Motion details while keeping Webflow-CDN and Designer guidance in `references/webflow/`.
- `references/opencode/`, `assets/opencode/`: OpenCode system-code language standards, shared patterns, hooks, alignment automation, and quality checklists.
- `assets/webflow/scripts/`: Webflow build, minification, and runtime verification utilities.
- `assets/scripts/`: Cross-surface helper scripts, including the OpenCode alignment verifier.

### Resource Loading Levels

Loading follows the canonical three levels; the finer `ALWAYS / SURFACE / INTENT / LANGUAGE / ON_DEMAND` tiers live in `references/smart_routing.md §3`.

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every sk-code invocation | `references/stack_detection.md`, `references/smart_routing.md`, `references/phase_detection.md`, and the `references/universal/` quality + error-recovery baseline |
| CONDITIONAL | After surface + intent (and OPENCODE language) detection | the detected `references/<surface>/` + `assets/<surface>/` trees, the matching language standards, intent-mapped resources, the authoring checklists below, and `references/motion_dev/` for `MOTION_DEV` intent |
| ON_DEMAND | Only on an explicit deep-dive request | extended checklists and niche references, plus the full `INTENT_MODEL` / `RESOURCE_MAP` in `references/smart_routing.md` |

### OpenCode Authoring Resources

| Resource | Path | When to load |
|---|---|---|
| skill_authoring | `assets/opencode/checklists/skill_authoring.md` | CONDITIONAL (intent: authoring new skill) |
| agent_authoring | `assets/opencode/checklists/agent_authoring.md` | CONDITIONAL (intent: authoring new agent) |
| command_authoring | `assets/opencode/checklists/command_authoring.md` | CONDITIONAL (intent: authoring new command) |
| mcp_server_authoring | `assets/opencode/checklists/mcp_server_authoring.md` | CONDITIONAL (intent: authoring MCP server) |
| spec_folder_authoring | `assets/opencode/checklists/spec_folder_authoring.md` | CONDITIONAL (intent: spec folder write) |
| spec_folder_write recipe | `assets/opencode/recipes/spec_folder_write.md` | CONDITIONAL (intent: spec folder write) |

### Intent Classification

After surface detection, score task text for intents: `IMPLEMENTATION`, `CODE_QUALITY`, `DEBUGGING`, `VERIFICATION`, `TESTING`, `DEPLOYMENT`, `PERFORMANCE`, `ANIMATION`, `MOTION_DEV`, `FORMS`, `VIDEO`, `API`, `HOOKS`, `CONFIG`, and `LANGUAGE_STANDARDS`.

Top intent always loads. A close second intent also loads when scores are within the ambiguity threshold.

`MOTION_DEV` is a resource intent, not a third code surface. It loads `references/motion_dev/` and `assets/motion_dev/` for cross-stack Motion questions after WEBFLOW/OPENCODE/UNKNOWN surface handling has established where implementation work is happening.

### Verification Commands

| Surface | Required verification evidence |
| --- | --- |
| WEBFLOW | `node .opencode/skills/sk-code/assets/webflow/scripts/minify-webflow.mjs`, `node .opencode/skills/sk-code/assets/webflow/scripts/verify-minification.mjs`, `node .opencode/skills/sk-code/assets/webflow/scripts/test-minified-runtime.mjs`, plus desktop/mobile browser console clean evidence when runtime behavior changes |
| OPENCODE | `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root <changed-scope>`, plus targeted language/project tests such as vitest, pytest, shellcheck, JSON validation, or spec validation for changed spec folders |
| UNKNOWN | User-selected verification command set before completion claim |

### Verification Rituals

Apply these alongside the commands above, scaled to blast radius:

- **Mutation check / claim-falsifier (after green).** A passing test proves nothing until you have seen it fail for the right reason. After green, break the production code the test guards, confirm that specific test fails, then restore. Distinguish **true-RED** (the assertion fails against correct intent) from **compile-RED** (the suite never compiled or ran — not a satisfying RED). A test that stays green when you break the thing it guards is a vacuous test — a defect, not coverage.
- **Verification ladder — name each rung's blind spot.** Climb cheapest→most authoritative and state in advance what each rung CANNOT see: **unit** (integration/wiring unseen) → **in-memory** (real I/O and serialization unseen) → **on-server** (deployment/config/env-specific behavior unseen) → **live** (only proves the exact path actually exercised). In-memory-green is not production-green. Rung mapping: WEBFLOW climbs unit → headless/browser-console evidence; OPENCODE climbs unit (vitest/pytest) → real-file / spec validation → live CLI/daemon run.
- **Decision economy + fail-closed by construction.** Leave a **named seam with a closing condition**, never a bare TODO and never a dead control (a flag or branch that does nothing). Prefer a **structural invariant** — the wrong state cannot be represented, or compiles to an error — over a disciplinary reminder asking future readers to be careful.

### Smart Router Pseudocode

Smart Router pseudocode (full implementation): see [`references/smart_routing.md`](./references/smart_routing.md) for the authoritative `INTENT_MODEL`, `RESOURCE_MAP`, load tiers, and surface→intent routing logic.

---

## 3. HOW IT WORKS

### WEBFLOW Workflow

1. Detect frontend/Webflow markers before generic package markers.
2. Load Webflow implementation, debugging, verification, performance, and vendor-specific resources by intent.
3. Verify with build/minification scripts and browser evidence when behavior changes.
4. Update CDN/versioning guidance after JavaScript bundle changes.
5. For Motion API or decision questions, load `references/motion_dev/` as the cross-stack peer reference and keep Webflow-specific CDN guidance in `references/webflow/`.

### OPENCODE Workflow

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-code-index-launcher.cjs | sed -n '1,280p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	#!/usr/bin/env node
     2	// ╔══════════════════════════════════════════════════════════════════════════╗
     3	// ║ COMPONENT: mk-code-index Launcher                                      ║
     4	// ╠══════════════════════════════════════════════════════════════════════════╣
     5	// ║ PURPOSE: Prepares code-graph state and launches the MCP server child.   ║
     6	// ╚══════════════════════════════════════════════════════════════════════════╝
     7	'use strict';
     8	
     9	const fs = require('fs');
    10	const path = require('path');
    11	const { spawn, spawnSync } = require('child_process');
    12	const { createSessionProxy, createClassifyFrame } = require('./lib/launcher-session-proxy.cjs');
    13	
    14	const root = path.resolve(__dirname, '..', '..');
    15	const opencodeDir = path.join(root, '.opencode');
    16	const BLOCKED_CHILD_ENV_RE = /^(NODE_|npm_|NPM_)/;
    17	const DOTENV_ALLOW_RE = /^(SPECKIT_CODE_GRAPH_|SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN$|MK_CODE_INDEX_)/;
    18	
    19	// Load project-local env overrides BEFORE spawning the MCP child. .env.local wins over
    20	// .env, both are gitignored. Existing process.env wins over file values (do not override).
    21	// Minimal parser — no external dependency.
    22	function loadEnvFile(filePath) {
    23	  if (!fs.existsSync(filePath)) return 0;
    24	  let count = 0;
    25	  const raw = fs.readFileSync(filePath, 'utf8');
    26	  for (const line of raw.split('\n')) {
    27	    const trimmed = line.trim();
    28	    if (!trimmed || trimmed.startsWith('#')) continue;
    29	    const m = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    30	    if (!m) continue;
    31	    const key = m[1];
    32	    let val = m[2];
    33	    // Strip matching outer quotes (single or double)
    34	    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    35	      val = val.slice(1, -1);
    36	    }
    37	    // The minimal parser is line-oriented; embedded \n in a quoted value would
    38	    // already have terminated the line, but defend explicitly.
    39	    if (val.includes('\n') || val.includes('\0')) {
    40	      process.stderr.write(`[mk-code-index-launcher] env value for ${key} contains control chars; skipping\n`);
    41	      continue;
    42	    }
    43	    if (!DOTENV_ALLOW_RE.test(key)) {
    44	      process.stderr.write(`[mk-code-index-launcher] env ${key} from ${path.basename(filePath)} is not allowlisted; skipping\n`);
    45	      continue;
    46	    }
    47	    if (!(key in process.env)) {
    48	      process.env[key] = val;
    49	      count++;
    50	    }
    51	  }
    52	  return count;
    53	}
    54	
    55	function isStrictModeDisabled(value) {
    56	  if (value === undefined || value === null) return false;
    57	  const v = String(value).trim().toLowerCase();
    58	  return v === '0' || v === 'false' || v === 'no' || v === 'off' || v === '';
    59	}
    60	
    61	// Category -> INDEX_* env key. Module-level so the launcher and its tests share one source.
    62	const MAINTAINER_CATEGORY_ENV = {
    63	  skills: 'SPECKIT_CODE_GRAPH_INDEX_SKILLS',
    64	  agents: 'SPECKIT_CODE_GRAPH_INDEX_AGENTS',
    65	  commands: 'SPECKIT_CODE_GRAPH_INDEX_COMMANDS',
    66	  specs: 'SPECKIT_CODE_GRAPH_INDEX_SPECS',
    67	  plugins: 'SPECKIT_CODE_GRAPH_INDEX_PLUGINS',
    68	};
    69	
    70	// Pure resolver for SPECKIT_CODE_GRAPH_MAINTAINER_MODE: "true" forces every category (back-compat),
    71	// "false"/empty/unset forces none, and a comma list forces the recognized subset (unknown names
    72	// dropped). Returns category names; the caller maps them to env keys via MAINTAINER_CATEGORY_ENV.
    73	function resolveMaintainerModeCategories(rawValue) {
    74	  const raw = (rawValue || '').trim().toLowerCase();
    75	  if (raw === 'true') return Object.keys(MAINTAINER_CATEGORY_ENV);
    76	  if (!raw || raw === 'false') return [];
    77	  return raw.split(',').map((c) => c.trim()).filter((c) => Object.hasOwn(MAINTAINER_CATEGORY_ENV, c));
    78	}
    79	
    80	function bootstrapLauncherEnv() {
    81	  for (const fname of ['.env.local', '.env']) {
    82	    const p = path.join(root, fname);
    83	    if (fs.existsSync(p)) {
    84	      const n = loadEnvFile(p);
    85	      if (n > 0) process.stderr.write(`[mk-code-index-launcher] loaded ${n} env(s) from ${fname}\n`);
    86	    }
    87	  }
    88	
    89	  // Maintainer-mode override: SPECKIT_CODE_GRAPH_MAINTAINER_MODE selects which .opencode
    90	  // categories to force-index on this machine, overriding whatever the runtime's MCP config
    91	  // injected. Committed configs ship "false" (end-user safe: only code outside .opencode is
    92	  // graphed); a maintainer opts in locally via .env.local (gitignored). Accepts "true" (all
    93	  // five categories, back-compat) or a comma-separated subset such as "skills,plugins" so a
    94	  // maintainer can index just the .opencode folders that hold code without pulling in the rest.
    95	  // Per-call code_graph_scan args (includeSkills, etc.) still override env. See ENV_REFERENCE.md § GRAPH.
    96	  const maintainerCategories = resolveMaintainerModeCategories(process.env.SPECKIT_CODE_GRAPH_MAINTAINER_MODE);
    97	  for (const cat of maintainerCategories) {
    98	    process.env[MAINTAINER_CATEGORY_ENV[cat]] = 'true';
    99	  }
   100	  if (maintainerCategories.length > 0) {
   101	    process.stderr.write(
   102	      `[mk-code-index-launcher] MAINTAINER_MODE: forcing INDEX_* to "true" for ${maintainerCategories.join(', ')}\n`
   103	    );
   104	  }
   105	}
   106	
   107	let skillsDir = path.join(opencodeDir, 'skills');
   108	let legacySkillDir = path.join(opencodeDir, 'skill');
   109	let kitDir = path.join(skillsDir, 'system-code-graph');
   110	// DB lives SKILL-LOCAL at mcp_server/database/; SPECKIT_CODE_GRAPH_DB_DIR overrides.
   111	// Former shared location (.opencode/.spec-kit/code-graph/database/) is migrated back on first startup.
   112	let dbDir = path.join(kitDir, 'mcp_server', 'database');
   113	let lockDir = path.join(dbDir, '.mk-code-index-launcher.lockdir');
   114	const PID_FILE_NAME = '.mk-code-index-launcher.json';
   115	const OWNER_LEASE_FILE_NAME = '.code-graph-owner.json';
   116	let stateFile = path.join(dbDir, PID_FILE_NAME);
   117	
   118	const rel = (p) => path.relative(root, p) || '.';
   119	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
   120	const now = () => new Date().toISOString();
   121	const RESPAWN_REAP_GRACE_MS = 7000;
   122	let childProcess = null;
   123	let ownerLeasePid = null;
   124	let launchStarted = false;
   125	let leaseMetricSink = null;
   126	
   127	const LEASE_METRIC_TRANSITION_CLASS = Object.freeze({
   128	  heldByOther: 'held-by-other',
   129	  bridgedSecondary: 'bridged-secondary',
   130	  staleReclaimed: 'stale-reclaimed',
   131	  respawned: 'respawned',
   132	});
   133	
   134	function log(message) {
   135	  process.stderr.write(`[mk-code-index-launcher] ${message}\n`);
   136	}
   137	
   138	function leaseMetricClassForTransition(transition) {
   139	  if (!Object.hasOwn(LEASE_METRIC_TRANSITION_CLASS, transition)) {
   140	    throw new Error(`Unknown lease metric transition: ${transition}`);
   141	  }
   142	  return LEASE_METRIC_TRANSITION_CLASS[transition];
   143	}
   144	
   145	function leaseMetricCounterName(leaseClass) {
   146	  return `mk_code_index_lease_${leaseClass.replace(/-/g, '_')}_total`;
   147	}
   148	
   149	function emitLeaseMetric(leaseClass, details = {}) {
   150	  if (typeof leaseMetricSink !== 'function') return;
   151	  leaseMetricSink({
   152	    counter: leaseMetricCounterName(leaseClass),
   153	    class: leaseClass,
   154	    count: 1,
   155	    at: now(),
   156	    ...details,
   157	  });
   158	}
   159	
   160	function configureLeaseMetricSinkForTesting(sink) {
   161	  leaseMetricSink = typeof sink === 'function' ? sink : null;
   162	}
   163	
   164	function loadBridgeModule() {
   165	  try {
   166	    return require('./lib/launcher-ipc-bridge.cjs');
   167	  } catch (error) {
   168	    if (error.code !== 'MODULE_NOT_FOUND') throw error;
   169	    return {
   170	      async maybeBridgeLeaseHolder({ leaseResult }) {
   171	        const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
   172	        const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
   173	        const suffix = process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1' ? '' : ' (no-bridge-socket)';
   174	        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
   175	        return { action: 'report', reason: 'bridge-module-missing' };
   176	      },
   177	    };
   178	  }
   179	}
   180	
   181	// Code-index replayable / unsafe tool sets for the reconnecting session proxy. Read-only structural
   182	// queries are safe to replay across a backend reattach; a full scan or an apply mutates the graph and
   183	// must NOT be replayed (the client re-drives it on a retryable recycle error). The proxy machinery is
   184	// shared with mk-spec-memory; only this tool set differs.
   185	const CODE_INDEX_REPLAYABLE_TOOL_NAMES = new Set([
   186	  'code_graph_query',
   187	  'code_graph_context',
   188	  'code_graph_status',
   189	  'code_graph_classify_query_intent',
   190	  'detect_changes',
   191	]);
   192	const CODE_INDEX_UNSAFE_TOOL_NAMES = new Set([
   193	  'code_graph_scan',
   194	  'code_graph_apply',
   195	  // code_graph_verify is read-mostly but MUTATES when persistBaseline=true (it persists the gold
   196	  // verification baseline), so it must NOT be replayed across a reconnect — the client re-drives it.
   197	  'code_graph_verify',
   198	]);
   199	const classifyCodeIndexFrame = createClassifyFrame({
   200	  replayableToolNames: CODE_INDEX_REPLAYABLE_TOOL_NAMES,
   201	  unsafeToolNames: CODE_INDEX_UNSAFE_TOOL_NAMES,
   202	});
   203	
   204	// Bridge a secondary client through the reconnecting session proxy so a code-index owner death no
   205	// longer surfaces as a hard "Connection closed" — the proxy reattaches to the respawned backend and
   206	// replays in-flight read queries. Mirrors the mk-spec-memory wiring; the classifier is the only diff.
   207	function bridgeStdioThroughSessionProxy(socketPath, options = {}) {
   208	  const createProxy = options.createProxy ?? createSessionProxy;
   209	  const sessionProxy = createProxy({
   210	    socketPath,
   211	    stdin: options.stdin ?? process.stdin,
   212	    stdout: options.stdout ?? process.stdout,
   213	    log,
   214	    classify: classifyCodeIndexFrame,
   215	  });
   216	  return sessionProxy.start();
   217	}
   218	
   219	function refreshPaths() {
   220	  skillsDir = path.join(opencodeDir, 'skills');
   221	  legacySkillDir = path.join(opencodeDir, 'skill');
   222	  kitDir = path.join(skillsDir, 'system-code-graph');
   223	  dbDir = path.join(kitDir, 'mcp_server', 'database');
   224	  lockDir = path.join(dbDir, '.mk-code-index-launcher.lockdir');
   225	  stateFile = path.join(dbDir, PID_FILE_NAME);
   226	}
   227	
   228	function exists(p) {
   229	  return fs.existsSync(p);
   230	}
   231	
   232	function canonicalizePath(pathValue) {
   233	  const resolvedPath = path.resolve(pathValue);
   234	  try {
   235	    return fs.realpathSync.native(resolvedPath);
   236	  } catch (error) {
   237	    if (error.code === 'ENOENT') return resolvedPath;
   238	    throw error;
   239	  }
   240	}
   241	
   242	function canonicalizeExistingPrefix(pathValue) {
   243	  const resolvedPath = path.resolve(pathValue);
   244	  if (fs.existsSync(resolvedPath)) return fs.realpathSync.native(resolvedPath);
   245	
   246	  const segments = [];
   247	  let current = resolvedPath;
   248	  while (!fs.existsSync(current)) {
   249	    const parent = path.dirname(current);
   250	    if (parent === current) return resolvedPath;
   251	    segments.unshift(path.basename(current));
   252	    current = parent;
   253	  }
   254	  return path.join(fs.realpathSync.native(current), ...segments);
   255	}
   256	
   257	function isWithinBase(basePath, candidatePath) {
   258	  return candidatePath === basePath || candidatePath.startsWith(`${basePath}${path.sep}`);
   259	}
   260	
   261	function isWithinRoot(candidatePath, requireCanonical = false) {
   262	  const canonicalRoot = fs.realpathSync.native(path.resolve(root));
   263	  const normalizedCandidate = canonicalizeExistingPrefix(candidatePath);
   264	  if (!isWithinBase(canonicalRoot, normalizedCandidate)) return false;
   265	  if (!requireCanonical && !fs.existsSync(path.resolve(candidatePath))) return true;
   266	  const candidate = canonicalizePath(candidatePath);
   267	  return isWithinBase(canonicalRoot, candidate);
   268	}
   269	
   270	function assertPathWithinRoot(candidatePath, label, requireCanonical = false) {
   271	  if (!isWithinRoot(candidatePath, requireCanonical)) {
   272	    throw new Error(`${label} must stay within workspace root ${root}: ${candidatePath}`);
   273	  }
   274	}
   275	
   276	function ensureCanonicalDir(dirPath) {
   277	  assertPathWithinRoot(dirPath, 'code graph DB directory');
   278	  fs.mkdirSync(path.resolve(dirPath), { recursive: true, mode: 0o700 });
   279	  assertPathWithinRoot(dirPath, 'code graph DB directory', true);
   280	  return canonicalizePath(dirPath);

exec
/bin/zsh -lc "nl -ba /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/launcher-ipc-bridge.cjs | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/launcher-ipc-bridge.cjs: No such file or directory

codex
The bridge path in the design is slightly stale: the launcher requires `./lib/launcher-ipc-bridge.cjs`, and the top-level file path named in the prompt does not exist. I’m using the live required module so the citations line up with executable behavior.
exec
/bin/zsh -lc "nl -ba .opencode/bin/lib/launcher-ipc-bridge.cjs | sed -n '1,460p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-code-index-launcher.cjs | sed -n '280,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ COMPONENT: Launcher IPC Bridge                                         ║
     3	// ╠══════════════════════════════════════════════════════════════════════════╣
     4	// ║ PURPOSE: Provides daemon IPC paths, probes, and JSON-RPC helpers.       ║
     5	// ╚══════════════════════════════════════════════════════════════════════════╝
     6	'use strict';
     7	
     8	const fs = require('fs');
     9	const net = require('net');
    10	const path = require('path');
    11	const { StringDecoder } = require('string_decoder');
    12	
    13	const SOCKET_FILE_NAME = 'daemon-ipc.sock';
    14	const DEFAULT_PROBE_TIMEOUT_MS = 5000;
    15	const MAX_PROBE_TIMEOUT_MS = 6999;
    16	const DEFAULT_MODEL_SERVER_LOADING_MAX_MS = 150000;
    17	const JSON_RPC_PROTOCOL_VERSION = '2025-06-18';
    18	const MODEL_SERVER_HEALTH_PATH = '/api/health';
    19	let nextProbeId = 1;
    20	
    21	function parsePositiveInteger(value, fallback) {
    22	  if (value === undefined || value === null || String(value).trim() === '') return fallback;
    23	  const parsed = Number.parseInt(String(value).trim(), 10);
    24	  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    25	}
    26	
    27	function clampProbeTimeoutMs(value) {
    28	  return Math.min(value, MAX_PROBE_TIMEOUT_MS);
    29	}
    30	
    31	function resolveProbeTimeoutMs(options = {}) {
    32	  if (Number.isFinite(options.timeoutMs) && options.timeoutMs > 0) {
    33	    return clampProbeTimeoutMs(options.timeoutMs);
    34	  }
    35	  return clampProbeTimeoutMs(parsePositiveInteger(
    36	    (options.env ?? process.env).SPECKIT_PROBE_TIMEOUT_MS,
    37	    DEFAULT_PROBE_TIMEOUT_MS,
    38	  ));
    39	}
    40	
    41	function parseNonNegativeInteger(value, fallback) {
    42	  if (value === undefined || value === null || String(value).trim() === '') return fallback;
    43	  const parsed = Number.parseInt(String(value).trim(), 10);
    44	  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
    45	}
    46	
    47	// A single transient probe miss must NOT make a sibling reap the lease owner and respawn a second
    48	// daemon: a busy owner (e.g. mid-FTS-merge) can momentarily exceed the probe window. Require N
    49	// consecutive deep-probe failures before declaring the owner dead. Defaults keep the first probe at
    50	// its tuned full timeout and add one short retry plus a small backoff so the worst case stays inside
    51	// the probe grace ceiling — a genuinely dead socket fails fast, so only a hung daemon pays the retry.
    52	function resolveLeaseProbeAttempts(env = process.env) {
    53	  return 1 + parseNonNegativeInteger(env.SPECKIT_LEASE_PROBE_RETRIES, 1);
    54	}
    55	function resolveLeaseProbeRetryTimeoutMs(env = process.env) {
    56	  return clampProbeTimeoutMs(parsePositiveInteger(env.SPECKIT_LEASE_PROBE_RETRY_TIMEOUT_MS, 1500));
    57	}
    58	function resolveLeaseProbeRetryBackoffMs(env = process.env) {
    59	  return parsePositiveInteger(env.SPECKIT_LEASE_PROBE_RETRY_BACKOFF_MS, 250);
    60	}
    61	
    62	function repoRoot() {
    63	  return path.resolve(__dirname, '..', '..', '..');
    64	}
    65	
    66	function defaultDbDirForService(serviceName) {
    67	  const root = repoRoot();
    68	  if (serviceName === 'mk-spec-memory') {
    69	    return path.join(root, '.opencode', 'skills', 'system-spec-kit', 'mcp_server', 'database');
    70	  }
    71	  if (serviceName === 'mk-code-index') {
    72	    return process.env.SPECKIT_CODE_GRAPH_DB_DIR
    73	      ? path.resolve(process.env.SPECKIT_CODE_GRAPH_DB_DIR)
    74	      : path.join(root, '.opencode', '.spec-kit', 'code-graph', 'database');
    75	  }
    76	  if (serviceName === 'mk-skill-advisor') {
    77	    const advisorOverride = process.env.MK_SKILL_ADVISOR_DB_DIR ?? process.env.SYSTEM_SKILL_ADVISOR_DB_DIR;
    78	    return advisorOverride
    79	      ? path.resolve(advisorOverride)
    80	      : path.join(root, '.opencode', 'skills', 'system-skill-advisor', 'mcp_server', 'database');
    81	  }
    82	  throw new Error(`Unknown MCP service name: ${serviceName}`);
    83	}
    84	
    85	function getIpcSocketPath(serviceName, options = {}) {
    86	  if (process.env.SPECKIT_IPC_SOCKET_DIR?.startsWith('tcp://')) {
    87	    return process.env.SPECKIT_IPC_SOCKET_DIR;
    88	  }
    89	  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR
    90	    ? path.resolve(process.env.SPECKIT_IPC_SOCKET_DIR)
    91	    : path.resolve(options.dbDir ?? defaultDbDirForService(serviceName));
    92	  return path.join(socketDir, SOCKET_FILE_NAME);
    93	}
    94	
    95	function toConnectionOptions(socketPath) {
    96	  if (!socketPath.startsWith('tcp://')) {
    97	    return socketPath;
    98	  }
    99	  const url = new URL(socketPath);
   100	  return {
   101	    host: url.hostname,
   102	    port: Number.parseInt(url.port, 10),
   103	  };
   104	}
   105	
   106	function bridgeStdioToSocket(socketPath, options = {}) {
   107	  const input = options.stdin ?? process.stdin;
   108	  const output = options.stdout ?? process.stdout;
   109	  const exit = options.exit ?? ((code) => process.exit(code));
   110	  const socket = net.createConnection(toConnectionOptions(socketPath));
   111	  let closed = false;
   112	
   113	  const closeOnce = (code = 0) => {
   114	    if (closed) return;
   115	    closed = true;
   116	    input.unpipe(socket);
   117	    socket.unpipe(output);
   118	    socket.destroy();
   119	    exit(code);
   120	  };
   121	
   122	  socket.once('connect', () => {
   123	    options.onConnect?.(socket);
   124	    input.pipe(socket);
   125	    socket.pipe(output);
   126	  });
   127	
   128	  socket.once('error', (error) => {
   129	    options.onError?.(error);
   130	    closeOnce(0);
   131	  });
   132	
   133	  socket.once('close', () => {
   134	    closeOnce(0);
   135	  });
   136	
   137	  input.once('end', () => {
   138	    socket.end();
   139	  });
   140	  input.once('close', () => {
   141	    closeOnce(0);
   142	  });
   143	  output.once('error', () => {
   144	    closeOnce(0);
   145	  });
   146	
   147	  return socket;
   148	}
   149	
   150	function probeDaemon(socketPath, options = {}) {
   151	  const timeoutMs = resolveProbeTimeoutMs(options);
   152	  const connect = options.connect ?? ((connectionOptions) => net.createConnection(connectionOptions));
   153	  // deepProbe=true REQUIRES a JSON-RPC initialize reply to call the daemon alive (detects a hung daemon
   154	  // that accepts the connection but never responds). Without it, a bare socket 'connect' counts as alive
   155	  // (connect-ok) — only safe for callers that genuinely need connection-liveness, NOT for the reap/bridge
   156	  // decision (which always passes deepProbe:true). See maybeBridgeLeaseHolder.
   157	  const deepProbe = options.deepProbe === true;
   158	  const id = nextProbeId++;
   159	  const request = `${JSON.stringify({
   160	    jsonrpc: '2.0',
   161	    id,
   162	    method: 'initialize',
   163	    params: {
   164	      protocolVersion: JSON_RPC_PROTOCOL_VERSION,
   165	      capabilities: {},
   166	      clientInfo: { name: 'liveness-probe', version: '0' },
   167	    },
   168	  })}\n`;
   169	
   170	  return new Promise((resolve) => {
   171	    let socket;
   172	    let settled = false;
   173	    let buffer = '';
   174	    let timer;
   175	    // Hold a multibyte char split across chunk boundaries until complete, so a probe reply
   176	    // carrying CJK/emoji (e.g. serverInfo strings) is not corrupted to U+FFFD mid-parse.
   177	    const decoder = new StringDecoder('utf8');
   178	
   179	    const finish = (status, reason) => {
   180	      if (settled) return;
   181	      settled = true;
   182	      if (timer) clearTimeout(timer);
   183	      if (socket) socket.destroy();
   184	      resolve({ status, reason });
   185	    };
   186	
   187	    try {
   188	      socket = connect(toConnectionOptions(socketPath));
   189	    } catch (error) {
   190	      finish('dead', error instanceof Error ? error.message : 'connect-threw');
   191	      return;
   192	    }
   193	
   194	    timer = setTimeout(() => finish('dead', 'timeout'), timeoutMs);
   195	    timer.unref?.();
   196	
   197	    socket.once('connect', () => {
   198	      if (!deepProbe) {
   199	        finish('alive', 'connect-ok');
   200	        return;
   201	      }
   202	      socket.write(request);
   203	    });
   204	    socket.on('data', (chunk) => {
   205	      buffer += Buffer.isBuffer(chunk) ? decoder.write(chunk) : String(chunk ?? '');
   206	      let newlineIndex = buffer.indexOf('\n');
   207	      while (newlineIndex !== -1) {
   208	        const line = buffer.slice(0, newlineIndex).trim();
   209	        buffer = buffer.slice(newlineIndex + 1);
   210	        newlineIndex = buffer.indexOf('\n');
   211	        if (!line) continue;
   212	        try {
   213	          const parsed = JSON.parse(line);
   214	          if (
   215	            parsed &&
   216	            parsed.jsonrpc === '2.0' &&
   217	            parsed.id === id &&
   218	            (Object.prototype.hasOwnProperty.call(parsed, 'result') ||
   219	              Object.prototype.hasOwnProperty.call(parsed, 'error'))
   220	          ) {
   221	            finish('alive', 'json-rpc-reply');
   222	            return;
   223	          }
   224	        } catch {
   225	          // Ignore malformed or unrelated frames; the bounded probe decides liveness.
   226	        }
   227	      }
   228	    });
   229	    socket.once('error', (error) => {
   230	      finish('dead', error instanceof Error ? error.message : 'socket-error');
   231	    });
   232	    socket.once('close', () => {
   233	      finish('dead', 'closed-before-reply');
   234	    });
   235	  });
   236	}
   237	
   238	function parseHttpJsonResponse(buffer) {
   239	  const raw = buffer.toString('utf8');
   240	  const headerEnd = raw.indexOf('\r\n\r\n');
   241	  if (headerEnd === -1) return null;
   242	  const statusLine = raw.slice(0, raw.indexOf('\r\n'));
   243	  const statusMatch = statusLine.match(/^HTTP\/\d(?:\.\d)?\s+(\d+)/);
   244	  if (!statusMatch) return null;
   245	  const statusCode = Number.parseInt(statusMatch[1], 10);
   246	  const bodyRaw = raw.slice(headerEnd + 4).trim();
   247	  let body = null;
   248	  try {
   249	    body = bodyRaw ? JSON.parse(bodyRaw) : null;
   250	  } catch {
   251	    return { statusCode, body: null };
   252	  }
   253	  return { statusCode, body };
   254	}
   255	
   256	function probeModelServer(socketPath, options = {}) {
   257	  const timeoutMs = resolveProbeTimeoutMs(options);
   258	  const loadingMaxMs = Number.isFinite(options.loadingMaxMs) && options.loadingMaxMs > 0
   259	    ? options.loadingMaxMs
   260	    : parsePositiveInteger(
   261	      (options.env ?? process.env).SPECKIT_HF_MODEL_SERVER_LOADING_MAX_MS,
   262	      DEFAULT_MODEL_SERVER_LOADING_MAX_MS,
   263	    );
   264	  const nowMs = typeof options.nowMs === 'function' ? options.nowMs : () => Date.now();
   265	  const connect = options.connect ?? ((connectionOptions) => net.createConnection(connectionOptions));
   266	  // Mark this as the launcher's internal liveness probe so a cold-state demand listener can answer
   267	  // without spawning a model server. Genuine embed consumers do not send this header, so their
   268	  // wake-on-demand path is unchanged.
   269	  const request = `GET ${MODEL_SERVER_HEALTH_PATH} HTTP/1.1\r\nHost: localhost\r\nAccept: application/json\r\nX-Speckit-Probe: liveness\r\nConnection: close\r\n\r\n`;
   270	
   271	  return new Promise((resolve) => {
   272	    let socket;
   273	    let settled = false;
   274	    let chunks = [];
   275	    let timer;
   276	
   277	    // Carry the parsed health body so callers (the idle-eviction tick) can read
   278	    // lastSuccessfulEmbedAt / inFlight. The 'alive' branches below pass parsed.body as the 3rd arg.
   279	    const finish = (status, reason, health) => {
   280	      if (settled) return;
   281	      settled = true;
   282	      if (timer) clearTimeout(timer);
   283	      if (socket) socket.destroy();
   284	      resolve({ status, reason, health });
   285	    };
   286	
   287	    try {
   288	      socket = connect(toConnectionOptions(socketPath));
   289	    } catch (error) {
   290	      finish('dead', error instanceof Error ? error.message : 'connect-threw');
   291	      return;
   292	    }
   293	
   294	    timer = setTimeout(() => finish('dead', 'timeout'), timeoutMs);
   295	    timer.unref?.();
   296	
   297	    socket.once('connect', () => {
   298	      socket.write(request);
   299	    });
   300	    socket.on('data', (chunk) => {
   301	      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk ?? '')));
   302	    });
   303	    socket.once('end', () => {
   304	      const parsed = parseHttpJsonResponse(Buffer.concat(chunks));
   305	      const state = parsed && parsed.body && typeof parsed.body === 'object'
   306	        ? parsed.body.state
   307	        : null;
   308	      if (parsed && parsed.statusCode >= 200 && parsed.statusCode < 300 && state === 'ready') {
   309	        finish('alive', `health-${state}`, parsed.body);
   310	        return;
   311	      }
   312	      if (parsed && parsed.statusCode >= 200 && parsed.statusCode < 300 && state === 'loading') {
   313	        const loadStartedAt = parsed.body.loadStartedAt;
   314	        const loadProgressAt = parsed.body.loadProgressAt;
   315	        // The loading budget is per model-load attempt; device fallback re-stamps loadProgressAt.
   316	        const loadingMarker = Number.isFinite(loadProgressAt) && loadProgressAt > 0
   317	          ? loadProgressAt
   318	          : loadStartedAt;
   319	        if (Number.isFinite(loadingMarker) && loadingMarker > 0 && nowMs() - loadingMarker > loadingMaxMs) {
   320	          finish('dead', 'loading-wedged');
   321	          return;
   322	        }
   323	        finish('alive', 'health-loading', parsed.body);
   324	        return;
   325	      }
   326	      finish('dead', state === 'error' ? 'health-error' : 'health-not-ready');
   327	    });
   328	    socket.once('error', (error) => {
   329	      finish('dead', error instanceof Error ? error.message : 'socket-error');
   330	    });
   331	    socket.once('close', () => {
   332	      if (!settled && chunks.length === 0) finish('dead', 'closed-before-reply');
   333	    });
   334	  });
   335	}
   336	
   337	// Run the deep liveness probe up to `attempts` times; any 'alive' short-circuits to a bridge, and
   338	// only an all-failures run returns the final (dead) result so the caller respawns. The probe fn and
   339	// sleep are injectable so the retry decision is unit-testable without real sockets or timers.
   340	async function probeLeaseHolderWithRetries(socketPath, options = {}) {
   341	  const {
   342	    probe = probeDaemon,
   343	    firstTimeoutMs,
   344	    retryTimeoutMs = resolveLeaseProbeRetryTimeoutMs(),
   345	    retryBackoffMs = resolveLeaseProbeRetryBackoffMs(),
   346	    attempts = resolveLeaseProbeAttempts(),
   347	    connect,
   348	    sleepFn = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); }),
   349	    onRetry,
   350	  } = options;
   351	  const totalAttempts = Math.max(1, attempts);
   352	  let result = { status: 'dead', reason: 'no-probe-attempted' };
   353	  for (let attempt = 1; attempt <= totalAttempts; attempt += 1) {
   354	    const timeoutMs = attempt === 1 ? firstTimeoutMs : retryTimeoutMs;
   355	    result = await probe(socketPath, { timeoutMs, connect, deepProbe: true });
   356	    if (result.status === 'alive') return result;
   357	    if (attempt < totalAttempts) {
   358	      if (typeof onRetry === 'function') onRetry(attempt, totalAttempts, result);
   359	      await sleepFn(retryBackoffMs);
   360	    }
   361	  }
   362	  return result;
   363	}
   364	
   365	async function maybeBridgeLeaseHolder(options) {
   366	  const {
   367	    serviceName,
   368	    leaseResult,
   369	    loggerPrefix,
   370	    dbDir,
   371	    legacyReport,
   372	    probeTimeoutMs,
   373	    connect,
   374	    bridge,
   375	  } = options;
   376	  const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
   377	  const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
   378	  const ownerPid = leaseResult.ownerPid;
   379	  const writeLeaseHeld = (suffix = '') => {
   380	    process.stdout.write(`LEASE_HELD_BY:${ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
   381	  };
   382	
   383	  if (process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1') {
   384	    if (legacyReport) {
   385	      legacyReport(leaseResult);
   386	      return { action: 'report', reason: 'bridge-disabled' };
   387	    }
   388	    writeLeaseHeld();
   389	    return { action: 'report', reason: 'bridge-disabled' };
   390	  }
   391	
   392	  // Prefer the path the lease owner actually recorded over recomputing one from env. Under a
   393	  // divergent SPECKIT_IPC_SOCKET_DIR (e.g. a secondary launcher in a different worktree env), the
   394	  // recomputed path can miss the live socket and false-report 'no-bridge-socket'. Only trust the
   395	  // stored path when it still exists on disk; tcp:// endpoints bypass the existence check. Fall back
   396	  // to recomputation for legacy leases that predate socketPath and for the other launchers whose
   397	  // leases never carry it.
   398	  const storedSocketPath = leaseResult.socketPath;
   399	  const usableStoredSocketPath = typeof storedSocketPath === 'string'
   400	    && storedSocketPath.length > 0
   401	    && (storedSocketPath.startsWith('tcp://') || fs.existsSync(storedSocketPath))
   402	    ? storedSocketPath
   403	    : null;
   404	  const socketPath = usableStoredSocketPath ?? getIpcSocketPath(serviceName, { dbDir });
   405	  if (!socketPath.startsWith('tcp://') && !fs.existsSync(socketPath)) {
   406	    writeLeaseHeld(' (no-bridge-socket)');
   407	    return { action: 'report', reason: 'no-bridge-socket', socketPath };
   408	  }
   409	
   410	  // deepProbe: REQUIRE a JSON-RPC reply, not just a socket accept. The reap/bridge decision must
   411	  // detect a HUNG daemon (event loop wedged / deadlocked — it still accepts the UDS connection but
   412	  // never services requests). A connect-ok-only probe would bridge a client to the wedged daemon and
   413	  // hang it forever, never respawning. The raised probe timeout (default 5000ms, < the 7000ms launcher
   414	  // grace) already prevents false-reaping a busy-but-responsive daemon mid-FTS-merge, so deep probing
   415	  // does not regress that.
   416	  // Require N consecutive failures (not one transient miss) before reaping a sibling's owner.
   417	  const probeAttempts = resolveLeaseProbeAttempts();
   418	  const probe = await probeLeaseHolderWithRetries(socketPath, {
   419	    firstTimeoutMs: probeTimeoutMs,
   420	    attempts: probeAttempts,
   421	    connect,
   422	    onRetry: (attempt, total, result) => process.stderr.write(
   423	      `[${loggerPrefix}] lease holder pid=${ownerPid} probe ${attempt}/${total} not alive (${result.reason}); retrying\n`,
   424	    ),
   425	  });
   426	  if (probe.status !== 'alive') {
   427	    process.stderr.write(`[${loggerPrefix}] lease holder pid=${ownerPid} socket=${socketPath} failed ${probeAttempts} consecutive liveness probes: ${probe.reason}\n`);
   428	    return { action: 'respawn', reason: probe.reason, socketPath };
   429	  }
   430	
   431	  process.stderr.write(`[${loggerPrefix}] bridging to lease holder pid=${ownerPid} socket=${socketPath}\n`);
   432	  const bridgeToSocket = bridge ?? bridgeStdioToSocket;
   433	  // Await so an injected reconnecting bridge (whose start() resolves after the first
   434	  // attach) is fully wired before returning. The raw bridge returns a socket, not a
   435	  // promise, so Promise.resolve keeps the original fire-and-forget timing for it.
   436	  await Promise.resolve(bridgeToSocket(socketPath, {
   437	    onError: () => {
   438	      writeLeaseHeld(' (bridge-refused)');
   439	    },
   440	  }));
   441	  return { action: 'bridge', socketPath };
   442	}
   443	
   444	module.exports = {
   445	  DEFAULT_MODEL_SERVER_LOADING_MAX_MS,
   446	  bridgeStdioToSocket,
   447	  getIpcSocketPath,
   448	  maybeBridgeLeaseHolder,
   449	  probeDaemon,
   450	  probeLeaseHolderWithRetries,
   451	  probeModelServer,
   452	  resolveLeaseProbeAttempts,
   453	  resolveLeaseProbeRetryBackoffMs,
   454	  resolveLeaseProbeRetryTimeoutMs,
   455	  toConnectionOptions,
   456	};

 succeeded in 0ms:
   280	  return canonicalizePath(dirPath);
   281	}
   282	
   283	function writeState(payload) {
   284	  fs.mkdirSync(dbDir, { recursive: true, mode: 0o700 });
   285	  fs.writeFileSync(stateFile, `${JSON.stringify(payload, null, 2)}\n`);
   286	}
   287	
   288	function resolvedDbDir() {
   289	  const candidate = process.env.SPECKIT_CODE_GRAPH_DB_DIR ?? dbDir;
   290	  assertPathWithinRoot(candidate, 'SPECKIT_CODE_GRAPH_DB_DIR');
   291	  if (fs.existsSync(candidate)) assertPathWithinRoot(candidate, 'SPECKIT_CODE_GRAPH_DB_DIR', true);
   292	  return canonicalizePath(candidate);
   293	}
   294	
   295	function leasePath() {
   296	  return path.join(resolvedDbDir(), PID_FILE_NAME);
   297	}
   298	
   299	function ownerLeasePath() {
   300	  return path.join(resolvedDbDir(), OWNER_LEASE_FILE_NAME);
   301	}
   302	
   303	function legacyLeasePaths() {
   304	  // After the 2026-05-29 relocation, skill-local (mcp_server/database/) is the PRIMARY path.
   305	  // The legacy probe now covers the former shared `.spec-kit` location plus the pre-rename
   306	  // `skill/` (singular) typo dir, so a launcher still holding an old-location lease is detected.
   307	  return [
   308	    path.join(opencodeDir, '.spec-kit', 'code-graph', 'database', PID_FILE_NAME),
   309	    path.join(opencodeDir, 'skill', 'system-code-graph', 'mcp_server', 'database', PID_FILE_NAME),
   310	  ].map(canonicalizePath);
   311	}
   312	
   313	function readLeaseFile(filePath = leasePath()) {
   314	  try {
   315	    const raw = fs.readFileSync(filePath, 'utf8');
   316	    const parsed = JSON.parse(raw);
   317	    if (typeof parsed.pid === 'number') return parsed;
   318	  } catch {
   319	    // Missing or corrupt lease files are treated as no active lease.
   320	  }
   321	  return null;
   322	}
   323	
   324	function readOwnerLeaseFile(filePath = ownerLeasePath()) {
   325	  try {
   326	    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
   327	    if (
   328	      Number.isInteger(parsed.ownerPid) &&
   329	      Number.isInteger(parsed.ppid) &&
   330	      typeof parsed.executablePath === 'string' &&
   331	      typeof parsed.startedAtIso === 'string' &&
   332	      typeof parsed.lastHeartbeatIso === 'string' &&
   333	      Number.isInteger(parsed.ttlMs) &&
   334	      typeof parsed.canonicalDbDir === 'string'
   335	    ) {
   336	      return parsed;
   337	    }
   338	  } catch {
   339	    // Missing or corrupt owner leases are treated as no active owner.
   340	  }
   341	  return null;
   342	}
   343	
   344	function writeOwnerLeaseFile(lease) {
   345	  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
   346	  const tmp = `${currentLeasePath}.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
   347	  fs.writeFileSync(tmp, `${JSON.stringify(lease, null, 2)}\n`, { mode: 0o600, flag: 'wx' });
   348	  fs.renameSync(tmp, currentLeasePath);
   349	}
   350	
   351	function writeOwnerLeaseFileExclusive(lease) {
   352	  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
   353	  let fd;
   354	  try {
   355	    fd = fs.openSync(currentLeasePath, 'wx', 0o600);
   356	    fs.writeFileSync(fd, `${JSON.stringify(lease, null, 2)}\n`, 'utf8');
   357	    fs.fsyncSync(fd);
   358	    return true;
   359	  } catch (error) {
   360	    if (error.code === 'EEXIST') return false;
   361	    throw error;
   362	  } finally {
   363	    if (typeof fd === 'number') fs.closeSync(fd);
   364	  }
   365	}
   366	
   367	// The socket path this owner's environment computes. Recording it in the
   368	// leases lets a secondary under a divergent SPECKIT_IPC_SOCKET_DIR bridge
   369	// to the REAL socket instead of probing a recomputed wrong one and
   370	// misreporting a healthy owner as no-bridge-socket.
   371	function ownerSocketPath() {
   372	  try {
   373	    const { getIpcSocketPath } = loadBridgeModule();
   374	    if (typeof getIpcSocketPath !== 'function') return null;
   375	    return getIpcSocketPath('mk-code-index', { dbDir: resolvedDbDir() }) ?? null;
   376	  } catch {
   377	    return null;
   378	  }
   379	}
   380	
   381	let ownerLeaseHeartbeatTimer = null;
   382	
   383	function clearOwnerLeaseHeartbeat() {
   384	  if (ownerLeaseHeartbeatTimer) {
   385	    clearInterval(ownerLeaseHeartbeatTimer);
   386	    ownerLeaseHeartbeatTimer = null;
   387	  }
   388	}
   389	
   390	// Without a periodic refresh, every healthy long-running owner classifies
   391	// as stale-heartbeat-reclaim about two minutes after spawn, so each later
   392	// secondary start rewrites the owner lease before rediscovering the live
   393	// PID lease — churn plus reclaim-race exposure for nothing.
   394	function startOwnerLeaseHeartbeat(ownerPid) {
   395	  clearOwnerLeaseHeartbeat();
   396	  const lease = readOwnerLeaseFile();
   397	  const ttlMs = Number.isFinite(lease?.ttlMs) && lease.ttlMs > 0 ? lease.ttlMs : 60000;
   398	  const intervalMs = Math.max(1000, Math.floor(ttlMs / 2));
   399	  ownerLeaseHeartbeatTimer = setInterval(() => {
   400	    if (refreshOwnerLeaseFile(ownerPid)) return;
   401	    // A failed refresh means a concurrent reclaim superseded this owner;
   402	    // this launcher exits with its child rather than supervising relaunches,
   403	    // so stop heartbeating instead of fighting the new owner.
   404	    log('owner lease heartbeat refresh failed (superseded); stopping heartbeat');
   405	    clearOwnerLeaseHeartbeat();
   406	  }, intervalMs);
   407	  ownerLeaseHeartbeatTimer.unref?.();
   408	}
   409	
   410	function buildOwnerLease(ownerPid = process.pid) {
   411	  return {
   412	    ownerPid,
   413	    ppid: process.ppid,
   414	    executablePath: process.execPath,
   415	    startedAtIso: new Date().toISOString(),
   416	    lastHeartbeatIso: new Date().toISOString(),
   417	    ttlMs: 60000,
   418	    canonicalDbDir: resolvedDbDir(),
   419	    socketPath: ownerSocketPath(),
   420	  };
   421	}
   422	
   423	function processLiveness(pid) {
   424	  if (!Number.isInteger(pid) || pid <= 0) return 'dead';
   425	  try {
   426	    process.kill(pid, 0);
   427	    return 'alive';
   428	  } catch (error) {
   429	    if (error.code === 'ESRCH') return 'dead';
   430	    if (error.code === 'EPERM') return 'unknown-eperm';
   431	    return 'alive';
   432	  }
   433	}
   434	
   435	function readParentPid(pid) {
   436	  if (!Number.isInteger(pid) || pid <= 0) return null;
   437	  if (process.platform === 'linux') {
   438	    try {
   439	      const status = fs.readFileSync(`/proc/${pid}/status`, 'utf8');
   440	      const match = status.match(/^PPid:\s+(\d+)$/m);
   441	      return match ? Number.parseInt(match[1], 10) : null;
   442	    } catch {
   443	      return null;
   444	    }
   445	  }
   446	  const result = spawnSync('ps', ['-o', 'ppid=', '-p', String(pid)], {
   447	    encoding: 'utf8',
   448	    stdio: ['ignore', 'pipe', 'ignore'],
   449	  });
   450	  if (result.status !== 0 || !result.stdout) return null;
   451	  const parsed = Number.parseInt(result.stdout.trim(), 10);
   452	  return Number.isInteger(parsed) ? parsed : null;
   453	}
   454	
   455	function classifyOwnerLease(lease) {
   456	  const liveness = processLiveness(lease.ownerPid);
   457	  if (liveness === 'dead') return 'stale-pid';
   458	  if (liveness === 'unknown-eperm') return 'unknown-eperm';
   459	
   460	  const actualPpid = readParentPid(lease.ownerPid);
   461	  if (actualPpid !== null && actualPpid !== lease.ppid && actualPpid === 1) {
   462	    return 'ppid-1-orphan';
   463	  }
   464	
   465	  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
   466	  const ttlMs = Number.isFinite(lease.ttlMs) ? lease.ttlMs : 0;
   467	  if (!Number.isFinite(heartbeatMs) || Date.now() - heartbeatMs > ttlMs * 2) {
   468	    return 'stale-heartbeat-reclaim';
   469	  }
   470	
   471	  return 'live-owner';
   472	}
   473	
   474	function acquireOwnerLeaseFile() {
   475	  const currentOwnerLeasePath = ownerLeasePath();
   476	  const existing = readOwnerLeaseFile(currentOwnerLeasePath);
   477	
   478	  if (existing) {
   479	    const classification = classifyOwnerLease(existing);
   480	    if (classification === 'live-owner' || classification === 'unknown-eperm') {
   481	      return { acquired: false, holder: existing, classification };
   482	    }
   483	    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
   484	  }
   485	
   486	  const lease = buildOwnerLease(process.pid);
   487	  // Reclaim a stale lease by removing it first, then claim exclusively (O_EXCL).
   488	  // This collapses the fresh-acquire and stale-reclaim paths into a single CAS so
   489	  // only one racer can win: the loser's exclusive create hits EEXIST and returns
   490	  // acquired:false instead of last-writer-wins overwriting the winner's lease.
   491	  if (existing) {
   492	    try {
   493	      fs.unlinkSync(currentOwnerLeasePath);
   494	    } catch (error) {
   495	      if (error.code !== 'ENOENT') throw error;
   496	    }
   497	  }
   498	  if (!writeOwnerLeaseFileExclusive(lease)) {
   499	    const holder = readOwnerLeaseFile(currentOwnerLeasePath);
   500	    return {
   501	      acquired: false,
   502	      holder: holder || lease,
   503	      classification: holder ? classifyOwnerLease(holder) : 'live-owner',
   504	    };
   505	  }
   506	  ownerLeasePid = process.pid;
   507	  if (existing) {
   508	    emitLeaseMetric(leaseMetricClassForTransition('staleReclaimed'), {
   509	      ownerPid: existing.ownerPid,
   510	      ownerClassification: classifyOwnerLease(existing),
   511	      leaseKind: 'owner',
   512	    });
   513	  }
   514	  return { acquired: true, lease, reclaimed: existing };
   515	}
   516	
   517	function refreshOwnerLeaseFile(ownerPid, patch = {}) {
   518	  const lease = readOwnerLeaseFile();
   519	  if (!lease || lease.ownerPid !== ownerPid) return false;
   520	  const nextOwnerPid = patch.ownerPid ?? ownerPid;
   521	  writeOwnerLeaseFile({
   522	    ...lease,
   523	    ...patch,
   524	    lastHeartbeatIso: new Date().toISOString(),
   525	  });
   526	  // Re-read after the atomic write; if a concurrent reclaim superseded us between
   527	  // the ownership check and the write, do not claim the refresh succeeded.
   528	  const reread = readOwnerLeaseFile();
   529	  if (!reread || reread.ownerPid !== nextOwnerPid) return false;
   530	  ownerLeasePid = nextOwnerPid;
   531	  return true;
   532	}
   533	
   534	function clearOwnerLeaseFile() {
   535	  if (!Number.isInteger(ownerLeasePid)) return;
   536	  try {
   537	    // Re-confirm ownership immediately before unlink so a successor lease written
   538	    // after the first read is not deleted by path. A residual sub-syscall window remains; fully
   539	    // closing it would require the launcher to share owner-lease.ts's mutation lock.
   540	    const lease = readOwnerLeaseFile();
   541	    if (lease && lease.ownerPid === ownerLeasePid
   542	        && readOwnerLeaseFile()?.ownerPid === ownerLeasePid) {
   543	      fs.unlinkSync(ownerLeasePath());
   544	    }
   545	  } catch {
   546	    // Idempotent cleanup.
   547	  } finally {
   548	    ownerLeasePid = null;
   549	  }
   550	}
   551	
   552	function clearOwnerLeaseFileIfOwner(ownerPid) {
   553	  try {
   554	    // Re-confirm ownership immediately before unlink (see clearOwnerLeaseFile).
   555	    const lease = readOwnerLeaseFile();
   556	    if (lease && lease.ownerPid === ownerPid
   557	        && readOwnerLeaseFile()?.ownerPid === ownerPid) {
   558	      fs.unlinkSync(ownerLeasePath());
   559	    }
   560	  } catch {
   561	    // Idempotent cleanup.
   562	  }
   563	}
   564	
   565	function pidLiveAt(filePath, pidField) {
   566	  try {
   567	    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
   568	    const pid = parsed[pidField];
   569	    if (!Number.isInteger(pid)) return false;
   570	    try { process.kill(pid, 0); return true; } // live
   571	    catch (error) { return error.code === 'EPERM'; } // EPERM = exists but no perm → treat live; ESRCH = dead
   572	  } catch { return false; } // missing/unreadable → not live
   573	}
   574	
   575	// A former-location DB is still "owned" if EITHER the launcher PID lease
   576	// (.mk-code-index-launcher.json) or the owner lease (.code-graph-owner.json) names a live process.
   577	function formerLocationOwnerLive(dir) {
   578	  return pidLiveAt(path.join(dir, '.mk-code-index-launcher.json'), 'pid')
   579	      || pidLiveAt(path.join(dir, '.code-graph-owner.json'), 'ownerPid');
   580	}
   581	
   582	function leaseHeldFromFile(filePath, legacyPath = null) {
   583	  const lease = readLeaseFile(filePath);
   584	  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
   585	  // Surface the owner-recorded socket path so the bridge prefers it over
   586	  // recomputing one that may diverge under a different SPECKIT_IPC_SOCKET_DIR.
   587	  const socketPath = typeof lease.socketPath === 'string' && lease.socketPath.length > 0 ? lease.socketPath : null;
   588	  // Do not bridge to a LEGACY-location lease unless its lease file is owned by the
   589	  // current user. A foreign-owned lease in a shared/former path could otherwise point this
   590	  // client at a spoofed IPC socket.
   591	  if (legacyPath && typeof process.getuid === 'function') {
   592	    try {
   593	      if (fs.statSync(filePath).uid !== process.getuid()) {
   594	        return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
   595	      }
   596	    } catch {
   597	      return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
   598	    }
   599	  }
   600	  const startedAt = lease.startedAt ?? new Date(0).toISOString();
   601	  try {
   602	    process.kill(lease.pid, 0);
   603	    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
   604	  } catch (error) {
   605	    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath, socketPath };
   606	    // Mirror skill-advisor parity — EPERM means the process exists but we lack permission (e.g. sandbox); treat as live lease.
   607	    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
   608	    throw error;
   609	  }
   610	}
   611	
   612	function isLeaseHeld() {
   613	  const primary = leaseHeldFromFile(leasePath());
   614	  if (primary.held) return primary;
   615	
   616	  for (const legacyPath of legacyLeasePaths()) {
   617	    if (legacyPath === leasePath()) continue;
   618	    const legacy = leaseHeldFromFile(legacyPath, legacyPath);
   619	    if (legacy.held || legacy.staleReclaimable) return legacy;
   620	  }
   621	
   622	  return primary;
   623	}
   624	
   625	function writeLeaseHeldDiagnostic(leaseResult, suffix = '') {
   626	  const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
   627	  const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
   628	  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
   629	}
   630	
   631	async function waitForPidExit(pid, timeoutMs) {
   632	  const deadline = Date.now() + timeoutMs;
   633	  while (Date.now() <= deadline) {
   634	    if (processLiveness(pid) === 'dead') return true;
   635	    await sleep(100);
   636	  }
   637	  return processLiveness(pid) === 'dead';
   638	}
   639	
   640	async function reapOwnerBeforeRespawn(ownerPid) {
   641	  const liveness = processLiveness(ownerPid);
   642	  if (liveness === 'unknown-eperm') {
   643	    return { allowed: false, reason: 'owner-liveness-unknown-eperm' };
   644	  }
   645	  if (liveness === 'dead') {
   646	    return { allowed: true, reason: 'owner-already-dead' };
   647	  }
   648	
   649	  log(`confirmed-dead socket; reaping recorded code-index owner pid ${ownerPid} before respawn`);
   650	  try {
   651	    process.kill(ownerPid, 'SIGTERM');
   652	  } catch (error) {
   653	    if (error.code !== 'ESRCH') throw error;
   654	  }
   655	  const exitedAfterTerm = await waitForPidExit(ownerPid, RESPAWN_REAP_GRACE_MS);
   656	  if (!exitedAfterTerm) {
   657	    log(`code-index owner pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
   658	    try {
   659	      process.kill(ownerPid, 'SIGKILL');
   660	    } catch (error) {
   661	      if (error.code !== 'ESRCH') throw error;
   662	    }
   663	    await waitForPidExit(ownerPid, 1000);
   664	  }
   665	  return { allowed: true, reason: 'owner-reaped' };
   666	}
   667	
   668	async function respawnAfterDeadSocket(leaseResult, decision, options = {}) {
   669	  if (process.env.SPECKIT_BRIDGE_RESPAWN_DISABLED === '1') {
   670	    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
   671	    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
   672	  }
   673	
   674	  const ownerPid = options.respawnChildPid;
   675	  if (!Number.isInteger(ownerPid) || ownerPid <= 0) {
   676	    log('confirmed-dead socket but no recorded code-index child owner pid is available; respawn inert');
   677	    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-child-pid)');
   678	    return { action: 'report', reason: 'missing-child-pid', socketPath: decision.socketPath };
   679	  }
   680	
   681	  let bootstrapLockHeld = false;
   682	  try {
   683	    bootstrapLockHeld = await acquireBootstrapLock({ requireLock: true });
   684	    const currentOwner = readOwnerLeaseFile();
   685	    if (currentOwner?.ownerPid !== ownerPid) {
   686	      log('dead-socket respawn skipped; code-index owner lease changed while waiting for respawn lock');
   687	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
   688	      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
   689	    }
   690	
   691	    const reapResult = await reapOwnerBeforeRespawn(ownerPid);
   692	    if (!reapResult.allowed) {
   693	      log(`dead-socket respawn skipped; ${reapResult.reason} for ownerPid=${ownerPid}`);
   694	      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
   695	      return { action: 'report', reason: reapResult.reason, socketPath: decision.socketPath };
   696	    }
   697	
   698	    clearOwnerLeaseFileIfOwner(ownerPid);
   699	    const lease = buildOwnerLease(process.pid);
   700	    if (!writeOwnerLeaseFileExclusive(lease)) {
   701	      const holder = readOwnerLeaseFile();
   702	      log(`dead-socket respawn skipped; another launcher owns code-index owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
   703	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
   704	      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
   705	    }
   706	    ownerLeasePid = process.pid;
   707	
   708	    buildIfNeeded([]);
   709	    writeLeaseFile();
   710	    launchServer();
   711	    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
   712	  } finally {
   713	    if (bootstrapLockHeld) {
   714	      fs.rmSync(lockDir, { recursive: true, force: true });
   715	    }
   716	  }
   717	}
   718	
   719	async function bridgeOrReportLeaseHeld(leaseResult, options = {}) {
   720	  const { maybeBridgeLeaseHolder } = loadBridgeModule();
   721	  const decision = await maybeBridgeLeaseHolder({
   722	    serviceName: 'mk-code-index',
   723	    leaseResult,
   724	    loggerPrefix: 'mk-code-index-launcher',
   725	    dbDir: resolvedDbDir(),
   726	    bridge: bridgeStdioThroughSessionProxy,
   727	  });
   728	  if (decision && decision.action === 'respawn') {
   729	    const respawnResult = await respawnAfterDeadSocket(leaseResult, decision, options);
   730	    if (respawnResult.action === 'respawn') {
   731	      emitLeaseMetric(leaseMetricClassForTransition('respawned'), {
   732	        ownerPid: leaseResult.ownerPid,
   733	        reason: respawnResult.reason,
   734	        socketPath: respawnResult.socketPath,
   735	      });
   736	    } else {
   737	      emitLeaseMetric(leaseMetricClassForTransition('heldByOther'), {
   738	        ownerPid: leaseResult.ownerPid,
   739	        reason: respawnResult.reason,
   740	        socketPath: respawnResult.socketPath,
   741	      });
   742	    }
   743	    return respawnResult;
   744	  }
   745	  emitLeaseMetric(
   746	    leaseMetricClassForTransition(decision?.action === 'bridge' ? 'bridgedSecondary' : 'heldByOther'),
   747	    {
   748	      ownerPid: leaseResult.ownerPid,
   749	      reason: decision?.reason ?? null,
   750	      socketPath: decision?.socketPath ?? leaseResult.socketPath ?? null,
   751	    },
   752	  );
   753	  return decision;
   754	}
   755	
   756	function writeLeaseFile() {
   757	  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(leasePath())), PID_FILE_NAME);
   758	  const tmp = currentLeasePath + '.tmp.' + process.pid;
   759	  fs.writeFileSync(tmp, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString(), socketPath: ownerSocketPath() }, null, 2), { mode: 0o600 });
   760	  fs.renameSync(tmp, currentLeasePath);

exec
/bin/zsh -lc "rg -n \"function (classifyOwnerLease|leaseHeldFromFile|tryAcquireOwnerLease|acquireOwnerLease|heartbeat|spawn|initDb|probeDaemon|maybeBridgeLeaseHolder|respawnAfterDeadSocket|reapOwnerBeforeRespawn|wal_checkpoint|sqlite|bootstrap|install|npm|tsc|lock|startedAt|lastHeartbeat|socketPath|leaseHeld)\" .opencode/bin .opencode/skills/system-code-graph/mcp_server -g '*.cjs' -g '*.js' -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/bin/mk-skill-advisor-launcher.cjs:306:function leaseHeldFromFile(filePath = leasePath(), legacyPath = null) {
.opencode/bin/mk-skill-advisor-launcher.cjs:423:async function reapOwnerBeforeRespawn(ownerPid, expectedExecutablePath = null) {
.opencode/bin/mk-skill-advisor-launcher.cjs:487:function classifyOwnerLease(lease) {
.opencode/bin/mk-skill-advisor-launcher.cjs:506:function acquireOwnerLeaseFile() {
.opencode/bin/mk-skill-advisor-launcher.cjs:644:function socketPathUsable(socketPath) {
.opencode/bin/mk-skill-advisor-launcher.cjs:656:async function respawnAfterDeadSocket(leaseResult, decision) {
.opencode/bin/mk-skill-advisor-launcher.cjs:1226:function installSignalHandlers() {
.opencode/bin/mk-code-index-launcher.cjs:80:function bootstrapLauncherEnv() {
.opencode/bin/mk-code-index-launcher.cjs:455:function classifyOwnerLease(lease) {
.opencode/bin/mk-code-index-launcher.cjs:474:function acquireOwnerLeaseFile() {
.opencode/bin/mk-code-index-launcher.cjs:582:function leaseHeldFromFile(filePath, legacyPath = null) {
.opencode/bin/mk-code-index-launcher.cjs:640:async function reapOwnerBeforeRespawn(ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:668:async function respawnAfterDeadSocket(leaseResult, decision, options = {}) {
.opencode/bin/mk-code-index-launcher.cjs:1010:function installSignalHandlers() {
.opencode/bin/mk-spec-memory-launcher.cjs:444:function classifyOwnerLease(lease) {
.opencode/bin/mk-spec-memory-launcher.cjs:463:function acquireOwnerLeaseFile() {
.opencode/bin/mk-spec-memory-launcher.cjs:572:function leaseHeldFromFile(filePath, legacyPath = null) {
.opencode/bin/mk-spec-memory-launcher.cjs:761:async function reapOwnerBeforeRespawn(ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:792:async function respawnAfterDeadSocket(leaseResult, decision) {
.opencode/bin/mk-spec-memory-launcher.cjs:1583:function installSignalHandlers() {
.opencode/bin/lib/launcher-ipc-bridge.cjs:150:function probeDaemon(socketPath, options = {}) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:365:async function maybeBridgeLeaseHolder(options) {
.opencode/bin/cli-offline-smoke.cjs:53:function spawnListTools(check, cwd, timeoutMs) {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1027:export function initDb(dbDir: string): Database.Database {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:119:function tryAcquireOwnerLeaseMutationLock(canonicalDbDir: string): OwnerLeaseMutationLock | null {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:386:export function acquireOwnerLease(dbDir: string, options: OwnerLeaseOptions = {}): OwnerLeaseAcquireResult {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:62:function spawnLauncher(launcherPath: string, root: string, env: NodeJS.ProcessEnv = {}): LauncherRun {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:919:function socketPathTooLong(socketPath: string): boolean {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:974:function spawnLauncher(paths: RepoPaths): void {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:77:function installMocks(snapshot: SnapshotFixture): void {

exec
/bin/zsh -lc "rg -n \"function initDb|initDb\\(|wal|WAL|checkpoint|sqlite|better-sqlite|Database|PRAGMA\" .opencode/skills/system-code-graph/mcp_server -g '*.js' -g '*.ts' -g '*.mjs' -g '*.cjs'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1709:    // between the per-depth queries. better-sqlite3 transactions in WAL mode
.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:319:    // status reason (no string-mapping that swallows 'error' as 'missing').
.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:157:        enum: ['rescan', 'prune-excludes', 'repair-nodes', 'recover-sqlite-corruption', 'rollback-bad-apply'],
.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:160:      confirm: { type: 'boolean', description: 'Required for hard-stale recovery; for prune-excludes when any candidate pattern classifies medium-tier; and for every destructive operation (recover-sqlite-corruption, rollback-bad-apply) regardless of staleness. Low-tier prune-excludes additionally requires lowTierOptIn=true.' },
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/w10-degraded-readiness-integration.vitest.ts:83:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts:4:// Exercises filesystem walker safety caps for large ignores and deep specs.
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts:23:  const tempRoot = mkdtempSync(join(tmpdir(), 'walker-dos-'));
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/walker-dos-caps.vitest.ts:52:describe('walker DoS caps', () => {
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts:83:  initDb(tempRoot);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-context-stress.vitest.ts:53:    initDb(join(tmpDir, 'db'));
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts:53:    initDb(join(tmpDir, 'db'));
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts:53:    initDb(join(tmpDir, 'db'));
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:19:// The test uses the existing isolation seam: `initDb(tempDir)` swaps the
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:21:// `code-graph.sqlite` byte-equal across the run.
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:32://   - The live `code-graph.sqlite` is hashed before/after; the assertion
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:87:  'code-graph.sqlite',
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:141:  // byte-equality at the end so the live code-graph.sqlite is provably
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:208:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:241:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:307:  //   (1) better-sqlite3 sometimes accepts partially-corrupt files and
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:312:  //       afterAll() byte-equality guard for the live code-graph.sqlite.
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:321:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:362:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:401:  it('does not mutate the live code-graph.sqlite during the sweep', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-resolve-subject-typed.vitest.ts:36:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-resolve-subject-typed.vitest.ts:57:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:5:import Database from 'better-sqlite3';
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:34:function createLegacyDatabase(dbDir: string): Database.Database {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:35:  const database = new Database(join(dbDir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:64:function insertEdge(database: Database.Database, edgeType: string, suffix: string): void {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:91:    createLegacyDatabase(dbDir).close();
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:92:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:106:    createLegacyDatabase(dbDir).close();
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:107:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:118:    const database = new Database(':memory:');
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:177:    const database = new Database(':memory:');
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:222:        SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'code_edges__edge_vocab_rebuild'
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:231:    const database = new Database(':memory:');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:282:// Note: a true on-disk byte-equal check on `code-graph.sqlite` would
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-e2e.vitest.ts:84:    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'snapshot');
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts:104:  initDb(tempRoot);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:37:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:51:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:70:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:85:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:106:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:131:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:358:    // Seed the former shared standalone DB location with a code-graph.sqlite ONLY (no live PID
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:369:    const formerSqlite = join(formerDbDir, 'code-graph.sqlite');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:375:    const targetSqlite = join(dirname(workspace.pidFilePath), 'code-graph.sqlite');
.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts:24:// The walk below touches no fs APIs, so it is safe under those mocks. An absolute
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:186:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:218:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:245:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:274:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:645:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:711:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:765:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:787:    // same file-type allowlist as the full walk, or an edited markdown file would
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:792:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:1259:    it('stops walking cyclic tsconfig extends chains and keeps the local resolver settings', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:1367:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/edge-staleness-correctness.vitest.ts:63:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:40:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:77:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:110:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1427:  function walk(currentDir: string, inheritedGitignores: GitignoreContext[], depth: number): void {
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1451:        const warning = `[structural-indexer] Aborting walk after ${FIND_FILES_MAX_NODES} filesystem nodes at ${currentDir}`;
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1469:        walk(fullPath, activeGitignores, depth + 1);
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1484:  walk(rootDir, [], 0);
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1506:    // Apply the same file-type allowlist the full walk enforces: an incremental
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1699:      // If an extends target escapes the workspace root, stop walking and keep
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1844:        // Keep walking upward.
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-followups.vitest.ts:73:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:5:import Database from 'better-sqlite3';
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:31:function edgeColumns(database: Database.Database): string[] {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:32:  const rows = database.prepare('PRAGMA table_info(code_edges)').all() as Array<{ name: string }>;
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:36:function createLegacyDatabase(dbDir: string): Database.Database {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:37:  const database = new Database(join(dbDir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:80:    const legacy = createLegacyDatabase(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:84:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:110:    const database = new Database(':memory:');
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:143:    const database = new Database(':memory:');
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:190:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:199:    const database = new Database(':memory:');
.opencode/skills/system-code-graph/mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts:52:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:60:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:86:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:113:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:146:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:81:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:109:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:141:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:161:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts:112:    // Mock transaction() to invoke the callback synchronously (better-sqlite3
.opencode/skills/system-code-graph/mcp_server/lib/gold-query-verifier.ts:20: * Resolve the project root by walking up from this module's directory until
.opencode/skills/system-code-graph/mcp_server/lib/gold-query-verifier.ts:25: * walk one level too early. The stray contains only `skill/`, not `specs/`,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:2:// MODULE: Code Graph Database
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:5:// Uses separate code-graph.sqlite alongside the memory index DB.
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:10:import Database from 'better-sqlite3';
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:26:let db: Database.Database | null = null;
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:314:function ensureTombstoneSchema(database: Database.Database): void {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:332:function tombstoneTableExists(database: Database.Database): boolean {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:334:    SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'code_graph_tombstones'
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:339:function pruneTombstones(database: Database.Database): void {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:352:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:371:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:403:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:452:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:483:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:520:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:542:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:586:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:683:function hasColumn(database: Database.Database, tableName: string, columnName: string): boolean {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:684:  const rows = database.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:688:function tableExists(database: Database.Database, tableName: string): boolean {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:690:    SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:695:function getTableColumns(database: Database.Database, tableName: string): string[] {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:696:  const rows = database.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:700:function getCodeEdgesTableShape(database: Database.Database): CodeEdgesTableShape {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:708:function requireTableForMigration(database: Database.Database, tableName: string, context: string): void {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:715:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:728:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:753:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:770:function getMigrationGeneration(database: Database.Database): number {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:778:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:794:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:812:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:823:function getCodeEdgesCreateSql(database: Database.Database): string | null {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:825:    SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'code_edges'
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:830:export function codeGraphEdgeGovernanceVocabSchemaApplied(database: Database.Database): boolean {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:838:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:878:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:892:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:939:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:953:  database: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:965:function ensureSchemaMigrations(database: Database.Database): void {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1027:export function initDb(dbDir: string): Database.Database {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1031:    dbPath = join(dbDir, 'code-graph.sqlite');
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1032:    db = new Database(dbPath);
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1036:    // PRAGMA setup also benefits from the wait.
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1038:    db.pragma('journal_mode = WAL'); // WAL enables concurrent readers without locks
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1062:export function getDb(): Database.Database {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1063:  if (!db) initDb(DATABASE_DIR);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-recovery-procedures.vitest.ts:2:import Database from 'better-sqlite3';
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-recovery-procedures.vitest.ts:16:  const db = new Database(join(dir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-recovery-procedures.vitest.ts:22:  writeFileSync(join(dir, 'code-graph.sqlite-wal'), '');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-recovery-procedures.vitest.ts:23:  writeFileSync(join(dir, 'code-graph.sqlite-shm'), '');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-recovery-procedures.vitest.ts:80:    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'bad-state');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts:751:        `[structural-indexer] Aborting walk at ${resolve(workspaceRoot, '..', 'outside-warning')}`,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts:763:    expect(payload.data.warnings).toContain('[structural-indexer] Aborting walk at outside-warning');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-pipeline-safety.vitest.ts:2:import Database from 'better-sqlite3';
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-pipeline-safety.vitest.ts:40:  const db = new Database(join(dir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-pipeline-safety.vitest.ts:48:  const db = new Database(join(dir, 'code-graph.sqlite'), { readonly: true });
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-pipeline-safety.vitest.ts:69:    for (const operation of ['rollback-bad-apply', 'recover-sqlite-corruption'] as const) {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-pipeline-safety.vitest.ts:194:      writeFileSync(join(dir, 'code-graph.sqlite'), 'artifact');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:78:    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'snapshot');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:104:    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'snapshot');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:132:    writeFileSync(join(dbDir, 'code-graph.sqlite'), '');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:157:    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'snapshot');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:215:    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'snapshot');
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:37:export type ApplyOperation = 'rescan' | 'prune-excludes' | 'repair-nodes' | 'recover-sqlite-corruption' | 'rollback-bad-apply';
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:108:  'recover-sqlite-corruption',
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:335:    case 'recover-sqlite-corruption':
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:100:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:115:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:130:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:148:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:171:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:191:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:208:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts:6:import type Database from 'better-sqlite3';
.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts:66:function dbOrDefault(database?: Database.Database): Database.Database {
.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts:121:  database?: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts:137:  database?: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts:170:  database?: Database.Database,
.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts:202:export function recordSuccess(filePath: string, database?: Database.Database): void {
.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts:213:export function getSkipListSummary(database?: Database.Database): SkipListSummary {
.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts:237:export function seedFromProduction(database?: Database.Database): void {
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:190:// time would require a filesystem walk of the include globs, which the read
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:191:// path deliberately avoids (NFR-P01: no FS walk on the read path). Brand-new
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:193:// which walks the include globs itself.
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:309: * Bounded compare: no filesystem walk happens here — we use the same
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:316: * they are indexed by the next full `code_graph_scan` (which walks the globs).
.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:5:// WASM grammars. Cursor-based AST walk extracts RawCapture[]
.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:147:// itself (Node module resolution) rather than a relative `../../` walk.
.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:610:// ── AST walk to RawCapture[] ───────────────────────────────────
.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:612:function walkAST(
.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:825:        const captures = walkAST(rootNode, language, lines);
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:864:    // swallowed silently as "unresolved subject"; now surfaces the reason.
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seed-resolver.vitest.ts:27:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-db.vitest.ts:51:  initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:6:import Database from 'better-sqlite3';
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:68:  'code-graph.sqlite',
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:69:  'code-graph.sqlite-wal',
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:70:  'code-graph.sqlite-shm',
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:148:function runIntegrityCheck(sqlitePath: string): string {
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:149:  if (!existsSync(sqlitePath)) {
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:152:  const db = new Database(sqlitePath, { readonly: true, fileMustExist: true });
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:217:    integrityCheck = runIntegrityCheck(join(recoveryDir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:253:  const sqlitePath = tripletPath(dbDir, 'code-graph.sqlite');
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:258:    integrityCheck = runIntegrityCheck(sqlitePath);
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:259:    if (existsSync(sqlitePath)) {
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:260:      const db = new Database(sqlitePath, { readonly: true, fileMustExist: true });
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:313:    if (restored && existsSync(tripletPath(dbDir, 'code-graph.sqlite'))) {
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:314:      const db = new Database(tripletPath(dbDir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:316:        db.pragma('wal_checkpoint(TRUNCATE)');
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts:61:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/lib/close-db-assertion.ts:5:import type Database from 'better-sqlite3';
.opencode/skills/system-code-graph/mcp_server/lib/close-db-assertion.ts:14:export function assertDbHandleClosed(handle: Database.Database | null): void {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:49:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:70:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:81:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:97:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/symlink-realpath-hardening.vitest.ts:1:import BetterSqlite3 from 'better-sqlite3';
.opencode/skills/system-code-graph/mcp_server/tests/symlink-realpath-hardening.vitest.ts:60:          checkDatabaseUpdated: vi.fn(async () => false),
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:5:import Database from 'better-sqlite3';
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:30:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:139:      const legacy = new Database(join(legacyDir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:146:      const upgraded = initDb(legacyDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:148:        SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'parser_skip_list'
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:161:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:169:      const legacy = new Database(join(legacyDir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:186:      initDb(legacyDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:198:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:216:    } as unknown as Database.Database;
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:303:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:338:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:373:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:406:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:438:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:464:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:491:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:529:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:8:import Database from 'better-sqlite3';
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:26:      const db = initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:38:      const primary = initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:44:      const secondaryPath = join(tempDir, 'code-graph.sqlite');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:45:      const secondary = new Database(secondaryPath);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:60:      const db = initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-tombstones.vitest.ts:78:  initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-tombstones.vitest.ts:107:      SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'code_graph_tombstones'
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-verify.vitest.ts:614:      // because dist is one level deeper. The fix walks up to the workspace
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cluster-a.vitest.ts:173:    // operators routing on them don't have to walk into
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cross-file-edges.vitest.ts:41:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/tests/lib/close-db.vitest.ts:18:  initDb(tempDir);

codex
Current code already has a deep-probe bridge path and a dead-socket respawn hook, so the question is narrower than the design implies: the unclosed hole is specifically the missing socket file and which PID the respawn path is allowed to reap.
exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-code-index-launcher.cjs | sed -n '756,1135p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts | sed -n '1000,1075p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   756	function writeLeaseFile() {
   757	  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(leasePath())), PID_FILE_NAME);
   758	  const tmp = currentLeasePath + '.tmp.' + process.pid;
   759	  fs.writeFileSync(tmp, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString(), socketPath: ownerSocketPath() }, null, 2), { mode: 0o600 });
   760	  fs.renameSync(tmp, currentLeasePath);
   761	}
   762	
   763	function clearLeaseFile() {
   764	  try {
   765	    const lease = readLeaseFile();
   766	    if (lease && lease.pid === process.pid) fs.unlinkSync(leasePath());
   767	  } catch {
   768	    // Idempotent cleanup.
   769	  }
   770	}
   771	
   772	function clearAllLeaseFiles() {
   773	  clearOwnerLeaseHeartbeat();
   774	  clearLeaseFile();
   775	  clearOwnerLeaseFile();
   776	}
   777	
   778	function run(command, args, options = {}) {
   779	  const result = spawnSync(command, args, {
   780	    cwd: options.cwd || root,
   781	    env: buildChildEnv(),
   782	    encoding: 'utf8',
   783	    stdio: ['ignore', 'pipe', 'pipe'],
   784	  });
   785	
   786	  if (result.stdout) {
   787	    process.stderr.write(result.stdout);
   788	  }
   789	  if (result.stderr) {
   790	    process.stderr.write(result.stderr);
   791	  }
   792	  if (result.error) {
   793	    throw result.error;
   794	  }
   795	  if (result.status !== 0) {
   796	    throw new Error(`${command} ${args.join(' ')} exited ${result.status}`);
   797	  }
   798	}
   799	
   800	function buildChildEnv(extra = {}) {
   801	  const nextEnv = {};
   802	  for (const [key, value] of Object.entries(process.env)) {
   803	    if (BLOCKED_CHILD_ENV_RE.test(key)) continue;
   804	    nextEnv[key] = value;
   805	  }
   806	  return { ...nextEnv, ...extra };
   807	}
   808	
   809	function ensureLayout(actions) {
   810	  if (!exists(skillsDir) && exists(legacySkillDir) && !fs.lstatSync(legacySkillDir).isSymbolicLink()) {
   811	    fs.renameSync(legacySkillDir, skillsDir);
   812	    fs.symlinkSync('skills', legacySkillDir, 'dir');
   813	    actions.push('promoted .opencode/skill to .opencode/skills and created compatibility symlink');
   814	    refreshPaths();
   815	    return;
   816	  }
   817	
   818	  if (exists(skillsDir) && exists(legacySkillDir) && !fs.lstatSync(legacySkillDir).isSymbolicLink()) {
   819	    const backup = path.join(opencodeDir, `skill_legacy_backup_${new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, 'Z')}`);
   820	    fs.renameSync(legacySkillDir, backup);
   821	    fs.symlinkSync('skills', legacySkillDir, 'dir');
   822	    actions.push(`moved legacy .opencode/skill to ${rel(backup)} and created compatibility symlink`);
   823	    refreshPaths();
   824	    return;
   825	  }
   826	
   827	  // Compatibility symlink `.opencode/skill -> skills` removed; a prior cleanup cleaned
   828	  // up consumers of the singular path, so the bridge no longer needs to be
   829	  // recreated on every MCP startup. Migration paths above (rename / move-aside)
   830	  // still create the symlink when an actual legacy singular dir is present.
   831	}
   832	
   833	function requiredArtifacts() {
   834	  return [
   835	    path.join(kitDir, 'mcp_server', 'dist', 'index.js'),
   836	  ];
   837	}
   838	
   839	function artifactsReady() {
   840	  return requiredArtifacts().every(exists);
   841	}
   842	
   843	function localTscEntrypoint() {
   844	  return path.join(kitDir, 'node_modules', 'typescript', 'bin', 'tsc');
   845	}
   846	
   847	function buildIfNeeded(actions) {
   848	  if (artifactsReady()) {
   849	    return;
   850	  }
   851	
   852	  if (!exists(kitDir)) {
   853	    throw new Error(`mk-code-index skill (system-code-graph directory) not found at ${rel(kitDir)}`);
   854	  }
   855	
   856	  actions.push('installed dependencies and built @spec-kit/system-code-graph MCP server');
   857	  if (!exists(localTscEntrypoint())) {
   858	    const installCommand = exists(path.join(kitDir, 'package-lock.json')) ? 'ci' : 'install';
   859	    run('npm', [installCommand, '--no-audit', '--no-fund', '--silent'], { cwd: kitDir });
   860	  }
   861	  run(process.execPath, [localTscEntrypoint(), '-p', 'tsconfig.json'], { cwd: kitDir });
   862	
   863	  const missing = requiredArtifacts().filter((artifact) => !exists(artifact));
   864	  if (missing.length > 0) {
   865	    throw new Error(`bootstrap finished but artifacts are still missing: ${missing.map(rel).join(', ')}`);
   866	  }
   867	}
   868	
   869	const BOOTSTRAP_LOCK_STALE_MS = 5 * 60 * 1000; // 5 minutes — fallback for unstamped (legacy) lock dirs
   870	const BOOTSTRAP_LOCK_TIMEOUT_MS = 120000;
   871	const BOOTSTRAP_LOCK_OWNER_FILE = 'owner.pid';
   872	
   873	// Returns the pid recorded inside the lock dir, or null when no readable pid
   874	// stamp exists (legacy lock dirs, or a holder that died before stamping).
   875	function readBootstrapLockOwnerPid() {
   876	  try {
   877	    const raw = fs.readFileSync(path.join(lockDir, BOOTSTRAP_LOCK_OWNER_FILE), 'utf8').trim();
   878	    const pid = Number.parseInt(raw, 10);
   879	    return Number.isInteger(pid) && pid > 0 ? pid : null;
   880	  } catch {
   881	    return null;
   882	  }
   883	}
   884	
   885	// Reclaim a stale bootstrap lockdir. A lock is reclaimable as soon as its
   886	// recorded holder is provably dead; the mtime TTL is only a fallback for lock
   887	// dirs with no readable pid stamp (legacy dirs) or a holder whose liveness
   888	// cannot be determined. Without the dead-holder check, a holder killed less than
   889	// staleMs ago wedges every requireLock respawn for the full wait deadline.
   890	function removeStaleBootstrapLock(staleMs = BOOTSTRAP_LOCK_STALE_MS) {
   891	  let ageMs;
   892	  try {
   893	    ageMs = Date.now() - fs.statSync(lockDir).mtimeMs;
   894	  } catch (error) {
   895	    if (error.code === 'ENOENT') return false;
   896	    throw error;
   897	  }
   898	  const ownerPid = readBootstrapLockOwnerPid();
   899	  const ownerDead = ownerPid !== null && processLiveness(ownerPid) === 'dead';
   900	  if (!ownerDead && ageMs <= staleMs) {
   901	    return false;
   902	  }
   903	  // Atomically CLAIM the stale lockdir via rename before deleting it. Only one
   904	  // racer wins the rename; a successor that mkdir's a fresh lockDir after our stat
   905	  // creates a NEW inode that our rename/rmSync cannot touch, so we never delete a
   906	  // live successor lock. A losing racer's rename throws ENOENT and falls through to
   907	  // the outer retry.
   908	  const staleClaim = `${lockDir}.stale.${process.pid}.${Date.now()}`;
   909	  try {
   910	    fs.renameSync(lockDir, staleClaim);
   911	    fs.rmSync(staleClaim, { recursive: true, force: true });
   912	    const reason = ownerDead ? `dead holder pid=${ownerPid}` : `mtime ${Math.round(ageMs / 1000)}s old`;
   913	    log(`reclaiming stale bootstrap lock ${rel(lockDir)} (${reason})`);
   914	    return true;
   915	  } catch (error) {
   916	    if (error.code === 'ENOENT' || error.code === 'ENOTEMPTY') return false;
   917	    throw error;
   918	  }
   919	}
   920	
   921	async function acquireBootstrapLock(options = {}) {
   922	  const requireLock = options.requireLock === true;
   923	  fs.mkdirSync(dbDir, { recursive: true });
   924	  const deadline = Date.now() + (options.timeoutMs ?? BOOTSTRAP_LOCK_TIMEOUT_MS);
   925	  const staleMs = options.staleMs ?? BOOTSTRAP_LOCK_STALE_MS;
   926	  const retrySleepMs = options.retrySleepMs ?? 1000;
   927	  while (true) {
   928	    try {
   929	      fs.mkdirSync(lockDir);
   930	      // Stamp the holder pid so a later launcher can reclaim this lock the
   931	      // instant we die, instead of waiting out the mtime TTL. Best-effort: a
   932	      // failed stamp degrades to the TTL path, never blocks acquisition.
   933	      try {
   934	        fs.writeFileSync(path.join(lockDir, BOOTSTRAP_LOCK_OWNER_FILE), String(process.pid), { mode: 0o600 });
   935	      } catch { /* TTL fallback covers an unstamped lock */ }
   936	      return true;
   937	    } catch (error) {
   938	      if (error.code !== 'EEXIST') {
   939	        throw error;
   940	      }
   941	      if (artifactsReady() && !requireLock) {
   942	        return false;
   943	      }
   944	      if (removeStaleBootstrapLock(staleMs)) {
   945	        continue;
   946	      }
   947	      if (Date.now() > deadline) {
   948	        throw new Error(`bootstrap lock timed out at ${rel(lockDir)}`);
   949	      }
   950	      await sleep(retrySleepMs);
   951	    }
   952	  }
   953	}
   954	
   955	function launchServer() {
   956	  if (launchStarted) {
   957	    log('launchServer skipped: launch already started in this launcher process');
   958	    return false;
   959	  }
   960	  launchStarted = true;
   961	  // Set DB dir for the child process (operator-set env var wins).
   962	  if (!process.env.SPECKIT_CODE_GRAPH_DB_DIR) {
   963	    process.env.SPECKIT_CODE_GRAPH_DB_DIR = resolvedDbDir();
   964	  }
   965	
   966	  const server = path.join(kitDir, 'mcp_server', 'dist', 'index.js');
   967	  childProcess = spawn(process.execPath, [server], {
   968	    cwd: root,
   969	    env: buildChildEnv(),
   970	    stdio: 'inherit',
   971	  });
   972	
   973	  if (typeof childProcess.pid === 'number') {
   974	    const refreshed = refreshOwnerLeaseFile(process.pid, {
   975	      ownerPid: childProcess.pid,
   976	      ppid: process.pid,
   977	      executablePath: process.execPath,
   978	    });
   979	    if (!refreshed) {
   980	      log('owner lease refresh to child pid failed; launcher pid remains the recorded owner');
   981	    }
   982	    startOwnerLeaseHeartbeat(refreshed ? childProcess.pid : process.pid);
   983	  }
   984	
   985	  childProcess.on('exit', (code, signal) => {
   986	    if (signal) {
   987	      // Clear the lease before mirroring the signal; process.on('exit') does not fire on SIGKILL.
   988	      clearAllLeaseFiles();
   989	      // Remove our own handler for this signal first. Without this, the self-sent
   990	      // catchable signal (SIGTERM/SIGINT/SIGHUP/SIGQUIT) re-enters installSignalHandlers'
   991	      // handler, which — for an externally-killed child (childProcess.killed === false) —
   992	      // exits 0, so a supervising runtime misreads abnormal daemon death as a clean
   993	      // shutdown. Removing the handler lets the re-raised signal terminate this process
   994	      // with the signaled status (128 + n). SIGKILL is uncatchable and already mirrors.
   995	      process.removeAllListeners(signal);
   996	      process.kill(process.pid, signal);
   997	      return;
   998	    }
   999	    clearAllLeaseFiles();
  1000	    process.exit(code ?? 0);
  1001	  });
  1002	
  1003	  childProcess.on('error', (error) => {
  1004	    log(error.stack || error.message);
  1005	    process.exit(1);
  1006	  });
  1007	  return true;
  1008	}
  1009	
  1010	function installSignalHandlers() {
  1011	  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT']) {
  1012	    process.on(signal, () => {
  1013	      if (childProcess && !childProcess.killed) {
  1014	        childProcess.once('exit', () => {
  1015	          clearLeaseFile();
  1016	          process.exit(128);
  1017	        });
  1018	        childProcess.kill(signal);
  1019	        setTimeout(() => {
  1020	          clearAllLeaseFiles();
  1021	          process.exit(128);
  1022	        }, 5000).unref();
  1023	        return;
  1024	      }
  1025	      clearAllLeaseFiles();
  1026	      process.exit(128);
  1027	    });
  1028	  }
  1029	  process.on('uncaughtException', (err) => {
  1030	    try {
  1031	      clearAllLeaseFiles();
  1032	    } catch {
  1033	      // Preserve default uncaughtException crash behavior.
  1034	    }
  1035	    throw err;
  1036	  });
  1037	}
  1038	
  1039	async function launcherMain() {
  1040	  const started = now();
  1041	  const actions = [];
  1042	  let lockHeld = false;
  1043	  // Orphan daemon pid recorded by a reclaimed prior owner lease. A SIGKILL'd
  1044	  // launcher leaves its non-detached child reparented to init while still holding
  1045	  // the SQLite DB; reap it before spawning a successor so we never run two writers
  1046	  // against the same DB (mirrors the dead-socket respawn reap and the sibling
  1047	  // launchers' adopt-or-reap guards).
  1048	  let reclaimedOrphanPid = null;
  1049	
  1050	  try {
  1051	    installSignalHandlers();
  1052	    // Lease cleanup runs unconditionally regardless of child termination path.
  1053	    process.on('exit', clearAllLeaseFiles);
  1054	    refreshPaths();
  1055	    ensureLayout(actions);
  1056	    refreshPaths();
  1057	
  1058	    const strictSingleWriter = !isStrictModeDisabled(process.env.MK_CODE_INDEX_STRICT_SINGLE_WRITER);
  1059	    if (strictSingleWriter) {
  1060	      const ownerLeaseResult = acquireOwnerLeaseFile();
  1061	      if (ownerLeaseResult.acquired
  1062	          && ownerLeaseResult.reclaimed
  1063	          && Number.isInteger(ownerLeaseResult.reclaimed.ownerPid)
  1064	          && ownerLeaseResult.reclaimed.ownerPid > 0
  1065	          && ownerLeaseResult.reclaimed.ownerPid !== process.pid) {
  1066	        reclaimedOrphanPid = ownerLeaseResult.reclaimed.ownerPid;
  1067	      }
  1068	      if (!ownerLeaseResult.acquired) {
  1069	        // A live owner already holds the single-writer lease. Bridge this
  1070	        // client's stdio to the owner's IPC socket so additional sessions and
  1071	        // MCP reconnects share the one daemon (matches mk-spec-memory-launcher).
  1072	        // maybeBridgeLeaseHolder falls back to a LEASE_HELD_BY diagnostic line
  1073	        // only when the socket is missing/refused or bridging is disabled.
  1074	        log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
  1075	        await bridgeOrReportLeaseHeld({
  1076	          ownerPid: ownerLeaseResult.holder.ownerPid,
  1077	          startedAt: ownerLeaseResult.holder.startedAtIso,
  1078	          socketPath: typeof ownerLeaseResult.holder.socketPath === 'string' ? ownerLeaseResult.holder.socketPath : null,
  1079	        }, {
  1080	          respawnChildPid: ownerLeaseResult.holder.ownerPid,
  1081	        });
  1082	        return;
  1083	      }
  1084	
  1085	      const leaseResult = isLeaseHeld();
  1086	      if (leaseResult.held && !leaseResult.staleReclaimable) {
  1087	        clearOwnerLeaseFile();
  1088	        await bridgeOrReportLeaseHeld(leaseResult);
  1089	        return;
  1090	      }
  1091	      if (leaseResult.staleReclaimable) {
  1092	        log(`staleReclaimed: true${leaseResult.legacyPath ? ' (legacy path)' : ''}`);
  1093	        emitLeaseMetric(leaseMetricClassForTransition('staleReclaimed'), {
  1094	          ownerPid: leaseResult.ownerPid,
  1095	          leaseKind: leaseResult.legacyPath ? 'legacy-pid' : 'pid',
  1096	        });
  1097	      }
  1098	    } else {
  1099	      log('MK_CODE_INDEX_STRICT_SINGLE_WRITER is disabled; skipping lease check');
  1100	    }
  1101	
  1102	    lockHeld = await acquireBootstrapLock();
  1103	    if (lockHeld) {
  1104	      // Auto-migrate DB from the former shared standalone location back to skill-local.
  1105	      // The former DB is preserved as a backup (copy, not move).
  1106	      // This block now runs ONLY for the single bootstrap-lock winner (lockHeld), AFTER the lock
  1107	      // is held and BEFORE the DB is opened by the spawned child (launchServer, below). Previously
  1108	      // it ran in the main IIFE before any lock, so two concurrent launchers could both pass the
  1109	      // !exists(target) guard and both copy — a lagging copier truncate-overwriting the now-LIVE
  1110	      // target DB out from under the winner's daemon (SQLite corruption). Gating on lockHeld makes
  1111	      // only one launcher migrate; the COPYFILE_EXCL + pre-copy re-check below is the belt-and-
  1112	      // suspenders guarantee that NO launcher ever overwrites an existing (possibly live) target DB.
  1113	      // Never auto-seed/migrate into an explicit SPECKIT_CODE_GRAPH_DB_DIR override
  1114	      //   (the operator chose that target); migrate only into the resolved default.
  1115	      // Never copy a former DB that a live legacy owner could still be
  1116	      //   writing — probe BOTH the former PID lease and the former owner lease for liveness first.
  1117	      //   The former owner lease (.code-graph-owner.json) is intentionally NOT copied forward.
  1118	      const formerSharedDbDir = path.join(opencodeDir, '.spec-kit', 'code-graph', 'database');
  1119	      const migrationTarget = resolvedDbDir();
  1120	      if (!process.env.SPECKIT_CODE_GRAPH_DB_DIR
  1121	          && !exists(path.join(migrationTarget, 'code-graph.sqlite'))
  1122	          && exists(path.join(formerSharedDbDir, 'code-graph.sqlite'))
  1123	          && !formerLocationOwnerLive(formerSharedDbDir)) {
  1124	        fs.mkdirSync(migrationTarget, { recursive: true, mode: 0o700 });
  1125	        const dbFiles = [
  1126	          'code-graph.sqlite',
  1127	          'code-graph.sqlite-shm',
  1128	          'code-graph.sqlite-wal',
  1129	          '.code-graph-readiness.json',
  1130	          '.mk-code-index-launcher.json',
  1131	        ];
  1132	        // Re-check the sqlite target immediately before copying so a launcher that
  1133	        // raced past the outer guard (e.g. a concurrent migrator that just finished) does not
  1134	        // clobber the freshly-migrated DB. EEXIST from COPYFILE_EXCL means another launcher
  1135	        // already migrated that file -> treat the target as authoritative and stop migrating.

 succeeded in 0ms:
  1000	  database.exec('CREATE INDEX IF NOT EXISTS idx_parser_skip_list_retry_class ON parser_skip_list(retry_class)');
  1001	
  1002	  const now = new Date().toISOString();
  1003	  database.prepare(`
  1004	    INSERT OR IGNORE INTO parser_skip_list (
  1005	      file_path, error_class, retry_class, error_message, added_at, last_seen_at, attempt_count, source
  1006	    )
  1007	    SELECT
  1008	      file_path,
  1009	      'B1',
  1010	      'fatal',
  1011	      error_message,
  1012	      ?,
  1013	      ?,
  1014	      MAX(1, error_count),
  1015	      'seed'
  1016	    FROM parse_diagnostics
  1017	    WHERE error_message LIKE '%resolved is not a function%'
  1018	  `).run(now, now);
  1019	
  1020	  ensureCodeEdgeBitemporalSchema(database, 'code-edge bitemporal migration');
  1021	  if (codeGraphEdgeGovernanceVocabEnabled()) {
  1022	    ensureCodeEdgeGovernanceVocabSchema(database, 'code-edge governance vocabulary migration');
  1023	  }
  1024	}
  1025	
  1026	/** Initialize (or get) the code graph database */
  1027	export function initDb(dbDir: string): Database.Database {
  1028	  if (db) return db;
  1029	
  1030	  try {
  1031	    dbPath = join(dbDir, 'code-graph.sqlite');
  1032	    db = new Database(dbPath);
  1033	    // Explicit busy_timeout so concurrent writers wait up to 5s
  1034	    // for the writer lock instead of throwing SQLITE_BUSY immediately. Set
  1035	    // BEFORE journal_mode/foreign_keys so any incidental contention during
  1036	    // PRAGMA setup also benefits from the wait.
  1037	    db.pragma('busy_timeout = 5000');
  1038	    db.pragma('journal_mode = WAL'); // WAL enables concurrent readers without locks
  1039	    db.pragma('foreign_keys = ON');
  1040	    db.exec(SCHEMA_SQL);
  1041	    ensureSchemaMigrations(db);
  1042	
  1043	    const versionRow = db.prepare('SELECT version FROM schema_version LIMIT 1').get() as { version: number } | undefined;
  1044	    if (!versionRow) {
  1045	      db.prepare('INSERT INTO schema_version (version) VALUES (?)').run(SCHEMA_VERSION);
  1046	    } else if (versionRow.version < SCHEMA_VERSION) {
  1047	      db.prepare('UPDATE schema_version SET version = ?').run(SCHEMA_VERSION);
  1048	    }
  1049	
  1050	    return db;
  1051	  } catch (err) {
  1052	    if (db) {
  1053	      try { db.close(); } catch { /* best effort cleanup for failed init */ }
  1054	    }
  1055	    db = null;
  1056	    dbPath = null;
  1057	    throw err;
  1058	  }
  1059	}
  1060	
  1061	/** Get the current database instance (lazy-initializes if needed) */
  1062	export function getDb(): Database.Database {
  1063	  if (!db) initDb(DATABASE_DIR);
  1064	  // initDb either assigns the singleton database or throws before this return.
  1065	  return db!;
  1066	}
  1067	
  1068	/** Close the database connection */
  1069	export function closeDb(): void {
  1070	  if (db) {
  1071	    db.close();
  1072	    db = null;
  1073	    dbPath = null;
  1074	  }
  1075	}

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts | sed -n '1,180p' && nl -ba .opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts | sed -n '360,450p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────────
     2	// MODULE: Code Graph Owner Lease
     3	// ───────────────────────────────────────────────────────────────────
     4	
     5	import {
     6	  closeSync,
     7	  existsSync,
     8	  fsyncSync,
     9	  openSync,
    10	  readFileSync,
    11	  renameSync,
    12	  rmSync,
    13	  statSync,
    14	  unlinkSync,
    15	  writeFileSync,
    16	} from 'node:fs';
    17	import { dirname, join, resolve } from 'node:path';
    18	import { execFileSync } from 'node:child_process';
    19	
    20	import { resolveCanonicalDbDir } from './canonical-db-dir.js';
    21	import { CODE_GRAPH_DEFAULTS } from './config-defaults.js';
    22	
    23	export interface OwnerLeaseData {
    24	  ownerPid: number;
    25	  ppid: number;
    26	  executablePath: string;
    27	  startedAtIso: string;
    28	  lastHeartbeatIso: string;
    29	  ttlMs: number;
    30	  canonicalDbDir: string;
    31	}
    32	
    33	export type OwnerClassification =
    34	  | 'live-owner'
    35	  | 'stale-pid'
    36	  | 'stale-heartbeat-reclaim'
    37	  | 'ppid-1-orphan'
    38	  | 'symlink-alias'
    39	  | 'unknown-eperm';
    40	
    41	export type OwnerLeaseAcquireResult =
    42	  | { acquired: true; lease: OwnerLeaseData; leasePath: string; reclaimed?: OwnerLeaseData; classification?: OwnerClassification }
    43	  | { acquired: false; holder: OwnerLeaseData; leasePath: string; classification: OwnerClassification };
    44	
    45	export interface OwnerLeaseOptions {
    46	  readonly ownerPid?: number;
    47	  readonly ppid?: number;
    48	  readonly executablePath?: string;
    49	  readonly ttlMs?: number;
    50	  readonly now?: Date;
    51	  readonly processKill?: (pid: number, signal: 0) => boolean;
    52	  readonly readParentPid?: (pid: number) => number | null;
    53	}
    54	
    55	export interface OwnerClassificationOptions {
    56	  readonly processKill?: (pid: number, signal: 0) => boolean;
    57	  readonly readParentPid?: (pid: number) => number | null;
    58	  readonly candidateDbDir?: string;
    59	  readonly now?: Date;
    60	}
    61	
    62	const OWNER_LEASE_FILE_NAME = '.code-graph-owner.json';
    63	const OWNER_LEASE_LOCK_FILE_NAME = `${OWNER_LEASE_FILE_NAME}.lock`;
    64	const DEFAULT_TTL_MS = CODE_GRAPH_DEFAULTS.ttlMs;
    65	// A mutation lock is only ever held for a few synchronous fs ops, so any lock with an
    66	// UNPARSEABLE pid (empty/partial) older than this is treated as a wedged orphan from a pre-fix
    67	// binary or a hard crash between openSync and writeFileSync, and is self-healed once.
    68	const WEDGED_MUTATION_LOCK_MAX_AGE_MS = 30_000;
    69	
    70	interface OwnerLeaseMutationLock {
    71	  readonly fd: number;
    72	  readonly lockPath: string;
    73	}
    74	
    75	function fsyncPath(path: string): void {
    76	  let fd: number | undefined;
    77	  try {
    78	    fd = openSync(path, 'r');
    79	    fsyncSync(fd);
    80	  } finally {
    81	    if (typeof fd === 'number') {
    82	      closeSync(fd);
    83	    }
    84	  }
    85	}
    86	
    87	function makeTempPath(targetPath: string): string {
    88	  return `${targetPath}.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
    89	}
    90	
    91	function ownerLeasePath(canonicalDbDir: string): string {
    92	  return join(canonicalDbDir, OWNER_LEASE_FILE_NAME);
    93	}
    94	
    95	function ownerLeaseLockPath(canonicalDbDir: string): string {
    96	  return join(canonicalDbDir, OWNER_LEASE_LOCK_FILE_NAME);
    97	}
    98	
    99	function readOwnerLeaseMutationLockPid(lockPath: string): number | null {
   100	  try {
   101	    const raw = readFileSync(lockPath, 'utf8').trim();
   102	    const pid = Number.parseInt(raw, 10);
   103	    return Number.isInteger(pid) && pid > 0 ? pid : null;
   104	  } catch {
   105	    return null;
   106	  }
   107	}
   108	
   109	// Age (ms) of the lock file, or null if it cannot be stat'd. Used to gate self-healing of
   110	// a wedged empty/partial lock whose pid is unparseable (so the live-pid stale check cannot apply).
   111	function ownerLeaseMutationLockAgeMs(lockPath: string, now: number): number | null {
   112	  try {
   113	    return now - statSync(lockPath).mtimeMs;
   114	  } catch {
   115	    return null;
   116	  }
   117	}
   118	
   119	function tryAcquireOwnerLeaseMutationLock(canonicalDbDir: string): OwnerLeaseMutationLock | null {
   120	  const lockPath = ownerLeaseLockPath(canonicalDbDir);
   121	  for (let attempt = 0; attempt < 2; attempt++) {
   122	    let fd: number | undefined;
   123	    try {
   124	      fd = openSync(lockPath, 'wx', 0o600);
   125	      writeFileSync(fd, `${process.pid}\n`, { encoding: 'utf8' });
   126	      fsyncSync(fd);
   127	      return { fd, lockPath };
   128	    } catch (error: unknown) {
   129	      if (typeof fd === 'number') {
   130	        // The openSync('wx') succeeded (we own the just-created lock), but the
   131	        // subsequent writeFileSync/fsyncSync threw (e.g. ENOSPC/EIO). Close the fd AND unlink the
   132	        // orphan lock before re-throwing — otherwise it lingers empty/partial with no parseable
   133	        // pid, every later EEXIST acquirer reads a null pid, the stale-reclaim guard (which
   134	        // requires lockPid !== null) never removes it, and tryAcquire returns null forever ->
   135	        // refreshOwnerLease() returns false forever -> the heartbeat self-shuts-down the server.
   136	        closeSync(fd);
   137	        try {
   138	          unlinkSync(lockPath);
   139	        } catch (cleanupError: unknown) {
   140	          const cleanupCode = cleanupError && typeof cleanupError === 'object' && 'code' in cleanupError
   141	            ? (cleanupError as NodeJS.ErrnoException).code
   142	            : undefined;
   143	          if (cleanupCode !== 'ENOENT') {
   144	            throw cleanupError;
   145	          }
   146	        }
   147	      }
   148	      const code = error && typeof error === 'object' && 'code' in error ? (error as NodeJS.ErrnoException).code : undefined;
   149	      if (code !== 'EEXIST') {
   150	        throw error;
   151	      }
   152	
   153	      const lockPid = readOwnerLeaseMutationLockPid(lockPath);
   154	      if (attempt === 0 && lockPid !== null && getProcessLiveness(lockPid) === 'dead') {
   155	        try {
   156	          // Identity-checked stale-lock removal. Re-read immediately before unlink; a
   157	          // successor may have replaced the dead lock between classification and removal, and
   158	          // unlink-by-path would otherwise delete the successor's live lock. Only remove it if it
   159	          // still holds the same dead PID we classified.
   160	          if (readOwnerLeaseMutationLockPid(lockPath) === lockPid) {
   161	            unlinkSync(lockPath);
   162	          }
   163	          continue;
   164	        } catch (unlinkError: unknown) {
   165	          const unlinkCode = unlinkError && typeof unlinkError === 'object' && 'code' in unlinkError
   166	            ? (unlinkError as NodeJS.ErrnoException).code
   167	            : undefined;
   168	          if (unlinkCode !== 'ENOENT') {
   169	            throw unlinkError;
   170	          }
   171	        }
   172	      }
   173	
   174	      // Self-heal a wedged lock whose pid is UNPARSEABLE (empty/partial) — the live-pid
   175	      // check above can never clear it, so without this a pre-fix orphan (or one from a hard crash
   176	      // between openSync and writeFileSync) would wedge tryAcquire -> refresh forever. Gate it on a
   177	      // conservative mtime age (locks are held only for a few synchronous ops) and re-confirm the
   178	      // pid is still unparseable AND the mtime is unchanged immediately before unlink, so we never
   179	      // delete a successor's freshly-written live lock.
   180	      if (attempt === 0 && lockPid === null) {
   360	  options: OwnerClassificationOptions = {},
   361	): OwnerClassification {
   362	  const liveness = getProcessLiveness(lease.ownerPid, options.processKill);
   363	  if (liveness === 'dead') return 'stale-pid';
   364	  if (liveness === 'unknown-eperm') return 'unknown-eperm';
   365	
   366	  const actualPpid = (options.readParentPid ?? readProcessParentPid)(lease.ownerPid);
   367	  if (actualPpid !== null && actualPpid !== lease.ppid && actualPpid === 1) {
   368	    return 'ppid-1-orphan';
   369	  }
   370	
   371	  if (isHeartbeatStale(lease, options.now)) {
   372	    return 'stale-heartbeat-reclaim';
   373	  }
   374	
   375	  if (options.candidateDbDir) {
   376	    const candidateResolved = resolve(options.candidateDbDir);
   377	    const candidateCanonical = resolveCanonicalDbDir(options.candidateDbDir);
   378	    if (candidateCanonical === lease.canonicalDbDir && candidateResolved !== lease.canonicalDbDir) {
   379	      return 'symlink-alias';
   380	    }
   381	  }
   382	
   383	  return 'live-owner';
   384	}
   385	
   386	export function acquireOwnerLease(dbDir: string, options: OwnerLeaseOptions = {}): OwnerLeaseAcquireResult {
   387	  const canonicalDbDir = resolveCanonicalDbDir(dbDir);
   388	  const leasePath = ownerLeasePath(canonicalDbDir);
   389	  const existing = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
   390	  const now = options.now ?? new Date();
   391	  let existingClassification: OwnerClassification | undefined;
   392	
   393	  if (existing) {
   394	    const classification = classifyOwner(existing, {
   395	      processKill: options.processKill,
   396	      readParentPid: options.readParentPid,
   397	      now,
   398	    });
   399	    existingClassification = classification;
   400	    if (
   401	      classification === 'live-owner' ||
   402	      classification === 'symlink-alias' ||
   403	      classification === 'unknown-eperm'
   404	    ) {
   405	      return { acquired: false, holder: existing, leasePath, classification };
   406	    }
   407	  }
   408	
   409	  const lease: OwnerLeaseData = {
   410	    ownerPid: options.ownerPid ?? process.pid,
   411	    ppid: options.ppid ?? process.ppid,
   412	    executablePath: options.executablePath ?? process.execPath,
   413	    startedAtIso: now.toISOString(),
   414	    lastHeartbeatIso: now.toISOString(),
   415	    ttlMs: options.ttlMs ?? DEFAULT_TTL_MS,
   416	    canonicalDbDir,
   417	  };
   418	
   419	  if (!existing) {
   420	    if (writeOwnerLeaseExclusive(leasePath, lease)) {
   421	      return { acquired: true, lease, leasePath };
   422	    }
   423	    const holder = readOwnerLease(canonicalDbDir);
   424	    return holder
   425	      ? {
   426	          acquired: false,
   427	          holder,
   428	          leasePath,
   429	          classification: classifyOwner(holder, {
   430	            processKill: options.processKill,
   431	            readParentPid: options.readParentPid,
   432	            now,
   433	          }),
   434	        }
   435	      : { acquired: false, holder: lease, leasePath, classification: 'live-owner' };
   436	  }
   437	
   438	  const lock = tryAcquireOwnerLeaseMutationLock(canonicalDbDir);
   439	  if (!lock) {
   440	    const holder = readOwnerLease(canonicalDbDir);
   441	    return {
   442	      acquired: false,
   443	      holder: holder ?? existing,
   444	      leasePath,
   445	      classification: holder
   446	        ? classifyOwner(holder, {
   447	            processKill: options.processKill,
   448	            readParentPid: options.readParentPid,
   449	            now,
   450	          })

exec
/bin/zsh -lc "rg -n \"ownerLease|respawnChildPid|bridgeOrReportLeaseHeld|isLeaseHeld\\(|startOwnerLeaseHeartbeat|writeLeaseFile|launchServer|main\\(|acquireBootstrapLock|buildIfNeeded|waitForReady|socketPath\" .opencode/bin/mk-code-index-launcher.cjs .opencode/bin/lib/launcher-ipc-bridge.cjs .opencode/skills/system-code-graph/mcp_server -g '*.cjs' -g '*.ts' -g '*.js'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/bin/lib/launcher-ipc-bridge.cjs:95:function toConnectionOptions(socketPath) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:96:  if (!socketPath.startsWith('tcp://')) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:97:    return socketPath;
.opencode/bin/lib/launcher-ipc-bridge.cjs:99:  const url = new URL(socketPath);
.opencode/bin/lib/launcher-ipc-bridge.cjs:106:function bridgeStdioToSocket(socketPath, options = {}) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:110:  const socket = net.createConnection(toConnectionOptions(socketPath));
.opencode/bin/lib/launcher-ipc-bridge.cjs:150:function probeDaemon(socketPath, options = {}) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:188:      socket = connect(toConnectionOptions(socketPath));
.opencode/bin/lib/launcher-ipc-bridge.cjs:256:function probeModelServer(socketPath, options = {}) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:288:      socket = connect(toConnectionOptions(socketPath));
.opencode/bin/lib/launcher-ipc-bridge.cjs:340:async function probeLeaseHolderWithRetries(socketPath, options = {}) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:355:    result = await probe(socketPath, { timeoutMs, connect, deepProbe: true });
.opencode/bin/lib/launcher-ipc-bridge.cjs:396:  // to recomputation for legacy leases that predate socketPath and for the other launchers whose
.opencode/bin/lib/launcher-ipc-bridge.cjs:398:  const storedSocketPath = leaseResult.socketPath;
.opencode/bin/lib/launcher-ipc-bridge.cjs:404:  const socketPath = usableStoredSocketPath ?? getIpcSocketPath(serviceName, { dbDir });
.opencode/bin/lib/launcher-ipc-bridge.cjs:405:  if (!socketPath.startsWith('tcp://') && !fs.existsSync(socketPath)) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:407:    return { action: 'report', reason: 'no-bridge-socket', socketPath };
.opencode/bin/lib/launcher-ipc-bridge.cjs:418:  const probe = await probeLeaseHolderWithRetries(socketPath, {
.opencode/bin/lib/launcher-ipc-bridge.cjs:427:    process.stderr.write(`[${loggerPrefix}] lease holder pid=${ownerPid} socket=${socketPath} failed ${probeAttempts} consecutive liveness probes: ${probe.reason}\n`);
.opencode/bin/lib/launcher-ipc-bridge.cjs:428:    return { action: 'respawn', reason: probe.reason, socketPath };
.opencode/bin/lib/launcher-ipc-bridge.cjs:431:  process.stderr.write(`[${loggerPrefix}] bridging to lease holder pid=${ownerPid} socket=${socketPath}\n`);
.opencode/bin/lib/launcher-ipc-bridge.cjs:436:  await Promise.resolve(bridgeToSocket(socketPath, {
.opencode/bin/lib/launcher-ipc-bridge.cjs:441:  return { action: 'bridge', socketPath };
.opencode/bin/mk-code-index-launcher.cjs:123:let ownerLeasePid = null;
.opencode/bin/mk-code-index-launcher.cjs:207:function bridgeStdioThroughSessionProxy(socketPath, options = {}) {
.opencode/bin/mk-code-index-launcher.cjs:210:    socketPath,
.opencode/bin/mk-code-index-launcher.cjs:299:function ownerLeasePath() {
.opencode/bin/mk-code-index-launcher.cjs:324:function readOwnerLeaseFile(filePath = ownerLeasePath()) {
.opencode/bin/mk-code-index-launcher.cjs:345:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
.opencode/bin/mk-code-index-launcher.cjs:352:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
.opencode/bin/mk-code-index-launcher.cjs:381:let ownerLeaseHeartbeatTimer = null;
.opencode/bin/mk-code-index-launcher.cjs:384:  if (ownerLeaseHeartbeatTimer) {
.opencode/bin/mk-code-index-launcher.cjs:385:    clearInterval(ownerLeaseHeartbeatTimer);
.opencode/bin/mk-code-index-launcher.cjs:386:    ownerLeaseHeartbeatTimer = null;
.opencode/bin/mk-code-index-launcher.cjs:394:function startOwnerLeaseHeartbeat(ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:399:  ownerLeaseHeartbeatTimer = setInterval(() => {
.opencode/bin/mk-code-index-launcher.cjs:407:  ownerLeaseHeartbeatTimer.unref?.();
.opencode/bin/mk-code-index-launcher.cjs:419:    socketPath: ownerSocketPath(),
.opencode/bin/mk-code-index-launcher.cjs:475:  const currentOwnerLeasePath = ownerLeasePath();
.opencode/bin/mk-code-index-launcher.cjs:483:    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
.opencode/bin/mk-code-index-launcher.cjs:506:  ownerLeasePid = process.pid;
.opencode/bin/mk-code-index-launcher.cjs:530:  ownerLeasePid = nextOwnerPid;
.opencode/bin/mk-code-index-launcher.cjs:535:  if (!Number.isInteger(ownerLeasePid)) return;
.opencode/bin/mk-code-index-launcher.cjs:541:    if (lease && lease.ownerPid === ownerLeasePid
.opencode/bin/mk-code-index-launcher.cjs:542:        && readOwnerLeaseFile()?.ownerPid === ownerLeasePid) {
.opencode/bin/mk-code-index-launcher.cjs:543:      fs.unlinkSync(ownerLeasePath());
.opencode/bin/mk-code-index-launcher.cjs:548:    ownerLeasePid = null;
.opencode/bin/mk-code-index-launcher.cjs:558:      fs.unlinkSync(ownerLeasePath());
.opencode/bin/mk-code-index-launcher.cjs:584:  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
.opencode/bin/mk-code-index-launcher.cjs:587:  const socketPath = typeof lease.socketPath === 'string' && lease.socketPath.length > 0 ? lease.socketPath : null;
.opencode/bin/mk-code-index-launcher.cjs:594:        return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
.opencode/bin/mk-code-index-launcher.cjs:597:      return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
.opencode/bin/mk-code-index-launcher.cjs:603:    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
.opencode/bin/mk-code-index-launcher.cjs:605:    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath, socketPath };
.opencode/bin/mk-code-index-launcher.cjs:607:    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
.opencode/bin/mk-code-index-launcher.cjs:612:function isLeaseHeld() {
.opencode/bin/mk-code-index-launcher.cjs:671:    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:674:  const ownerPid = options.respawnChildPid;
.opencode/bin/mk-code-index-launcher.cjs:678:    return { action: 'report', reason: 'missing-child-pid', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:683:    bootstrapLockHeld = await acquireBootstrapLock({ requireLock: true });
.opencode/bin/mk-code-index-launcher.cjs:688:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:695:      return { action: 'report', reason: reapResult.reason, socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:704:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:706:    ownerLeasePid = process.pid;
.opencode/bin/mk-code-index-launcher.cjs:708:    buildIfNeeded([]);
.opencode/bin/mk-code-index-launcher.cjs:709:    writeLeaseFile();
.opencode/bin/mk-code-index-launcher.cjs:710:    launchServer();
.opencode/bin/mk-code-index-launcher.cjs:711:    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:719:async function bridgeOrReportLeaseHeld(leaseResult, options = {}) {
.opencode/bin/mk-code-index-launcher.cjs:734:        socketPath: respawnResult.socketPath,
.opencode/bin/mk-code-index-launcher.cjs:740:        socketPath: respawnResult.socketPath,
.opencode/bin/mk-code-index-launcher.cjs:750:      socketPath: decision?.socketPath ?? leaseResult.socketPath ?? null,
.opencode/bin/mk-code-index-launcher.cjs:756:function writeLeaseFile() {
.opencode/bin/mk-code-index-launcher.cjs:759:  fs.writeFileSync(tmp, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString(), socketPath: ownerSocketPath() }, null, 2), { mode: 0o600 });
.opencode/bin/mk-code-index-launcher.cjs:847:function buildIfNeeded(actions) {
.opencode/bin/mk-code-index-launcher.cjs:921:async function acquireBootstrapLock(options = {}) {
.opencode/bin/mk-code-index-launcher.cjs:955:function launchServer() {
.opencode/bin/mk-code-index-launcher.cjs:957:    log('launchServer skipped: launch already started in this launcher process');
.opencode/bin/mk-code-index-launcher.cjs:982:    startOwnerLeaseHeartbeat(refreshed ? childProcess.pid : process.pid);
.opencode/bin/mk-code-index-launcher.cjs:1060:      const ownerLeaseResult = acquireOwnerLeaseFile();
.opencode/bin/mk-code-index-launcher.cjs:1061:      if (ownerLeaseResult.acquired
.opencode/bin/mk-code-index-launcher.cjs:1062:          && ownerLeaseResult.reclaimed
.opencode/bin/mk-code-index-launcher.cjs:1063:          && Number.isInteger(ownerLeaseResult.reclaimed.ownerPid)
.opencode/bin/mk-code-index-launcher.cjs:1064:          && ownerLeaseResult.reclaimed.ownerPid > 0
.opencode/bin/mk-code-index-launcher.cjs:1065:          && ownerLeaseResult.reclaimed.ownerPid !== process.pid) {
.opencode/bin/mk-code-index-launcher.cjs:1066:        reclaimedOrphanPid = ownerLeaseResult.reclaimed.ownerPid;
.opencode/bin/mk-code-index-launcher.cjs:1068:      if (!ownerLeaseResult.acquired) {
.opencode/bin/mk-code-index-launcher.cjs:1074:        log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
.opencode/bin/mk-code-index-launcher.cjs:1075:        await bridgeOrReportLeaseHeld({
.opencode/bin/mk-code-index-launcher.cjs:1076:          ownerPid: ownerLeaseResult.holder.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:1077:          startedAt: ownerLeaseResult.holder.startedAtIso,
.opencode/bin/mk-code-index-launcher.cjs:1078:          socketPath: typeof ownerLeaseResult.holder.socketPath === 'string' ? ownerLeaseResult.holder.socketPath : null,
.opencode/bin/mk-code-index-launcher.cjs:1080:          respawnChildPid: ownerLeaseResult.holder.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:1085:      const leaseResult = isLeaseHeld();
.opencode/bin/mk-code-index-launcher.cjs:1088:        await bridgeOrReportLeaseHeld(leaseResult);
.opencode/bin/mk-code-index-launcher.cjs:1102:    lockHeld = await acquireBootstrapLock();
.opencode/bin/mk-code-index-launcher.cjs:1107:      // is held and BEFORE the DB is opened by the spawned child (launchServer, below). Previously
.opencode/bin/mk-code-index-launcher.cjs:1166:      buildIfNeeded(actions);
.opencode/bin/mk-code-index-launcher.cjs:1182:    writeLeaseFile();
.opencode/bin/mk-code-index-launcher.cjs:1189:    launchServer();
.opencode/bin/mk-code-index-launcher.cjs:1228:  acquireBootstrapLock,
.opencode/bin/mk-code-index-launcher.cjs:1232:  ownerLeasePath,
.opencode/skills/system-code-graph/mcp_server/index.ts:35:let ownerLeaseRefreshTimer: ReturnType<typeof setInterval> | null = null;
.opencode/skills/system-code-graph/mcp_server/index.ts:36:let ownerLeaseMismatchShutdownStarted = false;
.opencode/skills/system-code-graph/mcp_server/index.ts:39:  if (!ownerLeaseRefreshTimer) return;
.opencode/skills/system-code-graph/mcp_server/index.ts:40:  clearInterval(ownerLeaseRefreshTimer);
.opencode/skills/system-code-graph/mcp_server/index.ts:41:  ownerLeaseRefreshTimer = null;
.opencode/skills/system-code-graph/mcp_server/index.ts:45:  if (ownerLeaseRefreshTimer) return;
.opencode/skills/system-code-graph/mcp_server/index.ts:46:  ownerLeaseRefreshTimer = setInterval(() => {
.opencode/skills/system-code-graph/mcp_server/index.ts:49:      if (!refreshed && !ownerLeaseMismatchShutdownStarted) {
.opencode/skills/system-code-graph/mcp_server/index.ts:50:        ownerLeaseMismatchShutdownStarted = true;
.opencode/skills/system-code-graph/mcp_server/index.ts:58:  ownerLeaseRefreshTimer.unref();
.opencode/skills/system-code-graph/mcp_server/index.ts:150:    socketPath: resolveIpcSocketPath(DATABASE_DIR),
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:41:  readonly socketPath: string;
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:49:  readonly socketPath: string;
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:146:// Only remove a stale socket at `socketPath` when it is provably ours: the parent dir resolves
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:150:function canUnlinkExistingSocket(socketPath: string): boolean {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:153:    parent = fs.realpathSync.native(path.dirname(socketPath));
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:166:    const stat = fs.lstatSync(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:193:async function listenOnce(server: net.Server, socketPath: string): Promise<void> {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:205:    if (socketPath.startsWith('tcp://')) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:206:      const url = new URL(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:210:    server.listen(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:219:  socketPath: string,
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:223:    log(`[ipc-bridge] tcp socket in use at ${socketPath}; retrying listen in ${delayMs}ms`);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:226:      await listenOnce(server, socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:262:  const socketPath = options.socketPath.startsWith('tcp://')
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:263:    ? options.socketPath
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:264:    : path.resolve(options.socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:268:  if (!socketPath.startsWith('tcp://')) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:269:    const socketDir = path.dirname(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:292:      const linkStat = fs.lstatSync(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:294:        throw new Error(`IPC socket path ${socketPath} is a symlink; refusing to bind`);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:347:    await listenOnce(server, socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:353:    if (socketPath.startsWith('tcp://')) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:356:      const listened = await retryTcpListenAfterEaddrInUse(server, socketPath, log);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:358:        log(`[ipc-bridge] tcp socket remained in use at ${socketPath}; secondary bridge disabled`);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:360:          socketPath,
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:374:      if (!canUnlinkExistingSocket(socketPath)) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:378:        fs.unlinkSync(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:385:      await listenOnce(server, socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:392:    : socketPath;
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:393:  if (!socketPath.startsWith('tcp://')) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:396:    const boundStat = fs.lstatSync(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:398:      throw new Error(`IPC socket path ${socketPath} is not a bound socket; refusing to chmod`);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:400:    fs.chmodSync(socketPath, 0o600);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:407:    socketPath: listenedPath,
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:421:      if (!socketPath.startsWith('tcp://')) {
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:423:          fs.unlinkSync(socketPath);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:91:function ownerLeasePath(canonicalDbDir: string): string {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:95:function ownerLeaseLockPath(canonicalDbDir: string): string {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:111:function ownerLeaseMutationLockAgeMs(lockPath: string, now: number): number | null {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:120:  const lockPath = ownerLeaseLockPath(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:182:        const ageMs = ownerLeaseMutationLockAgeMs(lockPath, now);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:187:              ownerLeaseMutationLockAgeMs(lockPath, now) === ageMs
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:321:  return ownerLeasePath(resolveCanonicalDbDir(dbDir));
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:327:    const parsed = JSON.parse(readFileSync(ownerLeasePath(canonicalDbDir), 'utf8')) as unknown;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:388:  const leasePath = ownerLeasePath(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:498:  const leasePath = ownerLeasePath(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:519:  const leasePath = ownerLeasePath(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:77:  readonly probeDaemon: (socketPath: string, options?: { timeoutMs?: number; deepProbe?: boolean }) => Promise<BridgeProbeResult>;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:78:  readonly toConnectionOptions: (socketPath: string) => string | net.NetConnectOpts;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:919:function socketPathTooLong(socketPath: string): boolean {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:920:  if (socketPath.startsWith('tcp://')) return false;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:921:  return process.platform === 'darwin' && Buffer.byteLength(socketPath) > 103;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:943:  const socketPath = path.join(socketDir, SOCKET_FILE_NAME);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:946:    nodeLink = lstatSync(socketPath);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:953:    throw new CliProtocolError(`IPC socket path is a symlink; refusing to connect: ${socketPath}`);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:956:    throw new CliProtocolError(`IPC socket is not owned by the current user (uid ${nodeLink.uid} != ${uid}): ${socketPath}`);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:984:async function waitForDaemon(socketPath: string, bridge: BridgeModule, timeoutMs: number): Promise<void> {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:990:    const probe = await bridge.probeDaemon(socketPath, {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1010:  static connect(socketPath: string, bridge: BridgeModule, timeoutMs: number): Promise<JsonRpcSocketClient> {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1033:        const connectionOptions = bridge.toConnectionOptions(socketPath);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1118:async function ensureDaemonReady(socketPath: string, bridge: BridgeModule, paths: RepoPaths, timeoutMs: number, warmOnly: boolean): Promise<void> {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1119:  const initialProbe = await bridge.probeDaemon(socketPath, { timeoutMs: Math.min(timeoutMs, 5000), deepProbe: true });
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1125:  await waitForDaemon(socketPath, bridge, timeoutMs);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1132:  const socketPath = bridge.getIpcSocketPath('mk-code-index', { dbDir: paths.dbDir });
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1133:  if (socketPathTooLong(socketPath)) {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1134:    throw new CliProtocolError(`IPC socket path exceeds the Darwin sun_path limit: ${socketPath}`);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1137:  await ensureDaemonReady(socketPath, bridge, paths, timeoutMs, warmOnly);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1139:  const client = await JsonRpcSocketClient.connect(socketPath, bridge, timeoutMs);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:299:    recordRuntimePid(runtimePids, lease.ownerPid, ownerLeasePath(dbDir));
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:326:  const ownerLease = readOwnerLease(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:327:  if (ownerLease) {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:328:    recordRuntimePid(runtimePids, ownerLease.ownerPid, ownerLeasePath(dbDir));
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:345:  const parsed = readJsonFile(ownerLeasePath(dbDir));
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:370:function ownerLeasePath(dbDir: string): string {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:25:const ownerLeaseRelativePath = '.opencode/skills/system-code-graph/mcp_server/database/.code-graph-owner.json';
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:152:    const parsed = JSON.parse(readFileSync(join(root, ownerLeaseRelativePath), 'utf8')) as { ownerPid?: unknown };
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:419:    const ownerLeasePath = join(workspace.root, ownerLeaseRelativePath);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:420:    const dbDir = dirname(ownerLeasePath);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:424:      writeFileSync(ownerLeasePath, JSON.stringify({
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:435:      await waitFor(() => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(run.stderr), 2000, 'stale-heartbeat owner reclaim log');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:438:      expect(run.stderr).toContain(`ownerLeaseReclaimed: stale-heartbeat-reclaim ownerPid=${holder.pid}`);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:463:  // single-writer is independently enforced by the bootstrap lock (acquireBootstrapLock), the PID
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:486:      const ownerLeasePath = join(workspace.root, ownerLeaseRelativePath);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:487:      const dbDir = dirname(ownerLeasePath);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:494:        writeFileSync(ownerLeasePath, JSON.stringify({
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:512:          () => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(first.stderr),
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:517:          () => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(second.stderr),
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:35:    let socketPath = '';
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:37:      socketPath = resolveIpcSocketPath('/unused/db/dir');
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:40:    expect(socketPath).toContain(leaf);
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:41:    expect(socketPath.length).toBeGreaterThan(missingDir.length);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:42:async function preBindStaleSocket(socketPath: string): Promise<net.Server> {
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:48:    server.listen(socketPath);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:62:async function connect(socketPath: string): Promise<net.Socket> {
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:63:  const socket = net.createConnection({ path: socketPath });
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:104:    const socketPath = join(dir, 'daemon-ipc.sock');
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:106:    await preBindStaleSocket(socketPath);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:109:      socketPath,
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:115:    const client = await connect(socketPath);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:123:    const socketPath = join(dir, 'daemon-ipc.sock');
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:125:    await preBindStaleSocket(socketPath);
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:135:      if (!raced && String(target) === socketPath) {
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:145:      socketPath,
.opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts:153:    const client = await connect(socketPath);
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:28:    const socketPath = join(rootLocalDir, 'daemon-ipc.sock');
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:29:    writeFileSync(socketPath, 'not a socket', 'utf8');
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:33:        socketPath,
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:41:    expect(existsSync(socketPath)).toBe(true);
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:49:      const socketPath = join(dir, 'daemon-ipc.sock');
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:53:          socketPath,
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:61:      expect(existsSync(socketPath)).toBe(false);

codex
The WAL recommendation is plausible, but not safe as phrased. The code opens SQLite only in the child today, and the launcher’s lease state can report a live owner before the socket exists, so launcher-side checkpointing needs stronger gating than “WAL is large.”
exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/index.ts | sed -n '1,190p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-code-index-launcher.cjs | sed -n '1132,1255p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	#!/usr/bin/env node
     2	// ───────────────────────────────────────────────────────────────────
     3	// MODULE: mk-code-index MCP Server Entrypoint
     4	// ───────────────────────────────────────────────────────────────────
     5	/**
     6	 * mk-code-index MCP server entry point.
     7	 *
     8	 * ## Environment Variables
     9	 *
    10	 * - `MK_CODE_INDEX_ROOT_DIR` — Workspace root directory used for readiness
    11	 *   snapshot evaluation and the marker JSON body. The marker file path is
    12	 *   resolved from the configured code-graph database directory.
    13	 */
    14	import { Server } from '@modelcontextprotocol/sdk/server/index.js';
    15	import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
    16	import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
    17	import * as codeGraphTools from './tools/index.js';
    18	import { CODE_GRAPH_TOOL_SCHEMAS } from './tool-schemas.js';
    19	import { writeCodeGraphReadinessMarker } from './lib/readiness-marker.js';
    20	import { closeDbWithAssertion, refreshOwnerLease } from './lib/index.js';
    21	import { DATABASE_DIR } from './core/config.js';
    22	import {
    23	  getIpcBridgeStats,
    24	  resolveIpcSocketPath,
    25	  startIpcSocketServer,
    26	  type IpcSocketServerHandle,
    27	} from './lib/ipc/socket-server.js';
    28	import {
    29	  createLauncherIdleMonitor,
    30	  type LauncherIdleMonitor,
    31	} from './lib/ipc/launcher-idle-timeout.js';
    32	
    33	const DEFAULT_OWNER_LEASE_TTL_MS = 60_000;
    34	const OWNER_LEASE_REFRESH_INTERVAL_MS = DEFAULT_OWNER_LEASE_TTL_MS / 3;
    35	let ownerLeaseRefreshTimer: ReturnType<typeof setInterval> | null = null;
    36	let ownerLeaseMismatchShutdownStarted = false;
    37	
    38	function clearOwnerLeaseRefreshTimer(): void {
    39	  if (!ownerLeaseRefreshTimer) return;
    40	  clearInterval(ownerLeaseRefreshTimer);
    41	  ownerLeaseRefreshTimer = null;
    42	}
    43	
    44	function startOwnerLeaseRefreshTimer(): void {
    45	  if (ownerLeaseRefreshTimer) return;
    46	  ownerLeaseRefreshTimer = setInterval(() => {
    47	    try {
    48	      const refreshed = refreshOwnerLease(DATABASE_DIR, process.pid);
    49	      if (!refreshed && !ownerLeaseMismatchShutdownStarted) {
    50	        ownerLeaseMismatchShutdownStarted = true;
    51	        void shutdownCodeIndex('owner lease moved to another process').finally(() => process.exit(0));
    52	      }
    53	    } catch (error: unknown) {
    54	      const message = error instanceof Error ? error.message : String(error);
    55	      console.error(`[owner-lease] heartbeat refresh failed: ${message}`);
    56	    }
    57	  }, OWNER_LEASE_REFRESH_INTERVAL_MS);
    58	  ownerLeaseRefreshTimer.unref();
    59	}
    60	
    61	process.on('uncaughtException', (err) => {
    62	  console.error('[mk-code-index] uncaughtException:', err);
    63	  clearOwnerLeaseRefreshTimer();
    64	  closeDbWithAssertion();
    65	  process.exit(1);
    66	});
    67	process.on('unhandledRejection', (reason) => {
    68	  console.error('[mk-code-index] unhandledRejection:', reason);
    69	  clearOwnerLeaseRefreshTimer();
    70	  closeDbWithAssertion();
    71	  process.exit(1);
    72	});
    73	
    74	function createCodeIndexMcpServer(): Server {
    75	  const codeIndexServer = new Server(
    76	    { name: 'mk-code-index', version: '1.0.0' },
    77	    { capabilities: { tools: {} } }
    78	  );
    79	
    80	  codeIndexServer.setRequestHandler(ListToolsRequestSchema, async () => ({
    81	    tools: CODE_GRAPH_TOOL_SCHEMAS,
    82	  }));
    83	
    84	  codeIndexServer.setRequestHandler(CallToolRequestSchema, async (request): Promise<any> => {
    85	    const args = (request.params.arguments ?? {}) as Record<string, unknown>;
    86	    return await codeGraphTools.dispatch(request.params.name, args);
    87	  });
    88	
    89	  return codeIndexServer;
    90	}
    91	
    92	let ipcBridge: IpcSocketServerHandle | null = null;
    93	let launcherIdleMonitor: LauncherIdleMonitor | null = null;
    94	let shutdownPromise: Promise<void> | null = null;
    95	
    96	async function shutdownCodeIndex(reason: string): Promise<void> {
    97	  if (shutdownPromise) return shutdownPromise;
    98	
    99	  shutdownPromise = (async () => {
   100	    console.error(`[mk-code-index] ${reason}`);
   101	    clearOwnerLeaseRefreshTimer();
   102	    if (launcherIdleMonitor) {
   103	      launcherIdleMonitor.stop();
   104	      launcherIdleMonitor = null;
   105	    }
   106	    if (ipcBridge) {
   107	      const bridge = ipcBridge;
   108	      ipcBridge = null;
   109	      await bridge.close().catch((error: unknown) => {
   110	        const message = error instanceof Error ? error.message : String(error);
   111	        console.error(`[mk-code-index] ipc-bridge close error: ${message}`);
   112	      });
   113	    }
   114	    closeDbWithAssertion();
   115	  })();
   116	
   117	  return shutdownPromise;
   118	}
   119	
   120	process.once('SIGINT', () => {
   121	  void shutdownCodeIndex('SIGINT').finally(() => process.exit(0));
   122	});
   123	process.once('SIGTERM', () => {
   124	  void shutdownCodeIndex('SIGTERM').finally(() => process.exit(0));
   125	});
   126	
   127	const server = createCodeIndexMcpServer();
   128	
   129	try {
   130	  writeCodeGraphReadinessMarker(process.env.MK_CODE_INDEX_ROOT_DIR || process.cwd());
   131	} catch (error: unknown) {
   132	  const message = error instanceof Error ? error.message : String(error);
   133	  console.error(`[mk-code-index] readiness marker write failed: ${message}`);
   134	}
   135	
   136	const transport = new StdioServerTransport();
   137	try {
   138	  await server.connect(transport);
   139	  startOwnerLeaseRefreshTimer();
   140	  launcherIdleMonitor = createLauncherIdleMonitor({
   141	    serviceName: 'mk-code-index',
   142	    getActiveClientCount: () => getIpcBridgeStats().secondary_clients_count,
   143	    onIdle: async () => {
   144	      await shutdownCodeIndex('launcher idle timeout');
   145	      process.exit(0);
   146	    },
   147	    log: (message: string) => console.error(message),
   148	  });
   149	  ipcBridge = await startIpcSocketServer({
   150	    socketPath: resolveIpcSocketPath(DATABASE_DIR),
   151	    createServer: () => createCodeIndexMcpServer(),
   152	    log: (message: string) => console.error(message),
   153	    onActivity: () => launcherIdleMonitor?.markActivity(),
   154	  });
   155	} catch (error: unknown) {
   156	  clearOwnerLeaseRefreshTimer();
   157	  const message = error instanceof Error ? error.message : String(error);
   158	  const stack = error instanceof Error ? error.stack : undefined;
   159	  console.error('[mk-code-index] connect failed:', message);
   160	  if (stack) console.error(stack);
   161	  process.exit(1);
   162	}

 succeeded in 0ms:
  1132	        // Re-check the sqlite target immediately before copying so a launcher that
  1133	        // raced past the outer guard (e.g. a concurrent migrator that just finished) does not
  1134	        // clobber the freshly-migrated DB. EEXIST from COPYFILE_EXCL means another launcher
  1135	        // already migrated that file -> treat the target as authoritative and stop migrating.
  1136	        let migrated = false;
  1137	        if (!exists(path.join(migrationTarget, 'code-graph.sqlite'))) {
  1138	          try {
  1139	            for (const file of dbFiles) {
  1140	              const src = path.join(formerSharedDbDir, file);
  1141	              const dst = path.join(migrationTarget, file);
  1142	              if (exists(src)) {
  1143	                // COPYFILE_EXCL makes the copy fail with EEXIST rather than truncate-
  1144	                // overwrite an existing (possibly live) target file.
  1145	                fs.copyFileSync(src, dst, fs.constants.COPYFILE_EXCL);
  1146	              }
  1147	            }
  1148	            migrated = true;
  1149	          } catch (copyError) {
  1150	            if (copyError.code === 'EEXIST') {
  1151	              // Another launcher already migrated into this target; the existing target
  1152	              // is authoritative. Do NOT overwrite it.
  1153	              log('migration skipped: target already present (EEXIST); treating existing target as authoritative');
  1154	            } else {
  1155	              throw copyError;
  1156	            }
  1157	          }
  1158	        }
  1159	        if (migrated) {
  1160	          process.stderr.write(
  1161	            `[mk-code-index-launcher] migrated DB from ${rel(formerSharedDbDir)} to ${rel(migrationTarget)} (former location preserved)\n`
  1162	          );
  1163	        }
  1164	      }
  1165	
  1166	      buildIfNeeded(actions);
  1167	      log(`ready: ${JSON.stringify({ start: started, end: now(), actions, server: rel(path.join(kitDir, 'mcp_server', 'dist', 'index.js')) })}`);
  1168	    }
  1169	
  1170	    // Reap the orphan daemon recorded by the reclaimed prior owner lease before
  1171	    // spawning a successor. The bootstrap lock above serializes this so only the
  1172	    // winning launcher reaps + respawns; a still-live orphan would otherwise keep
  1173	    // writing the SQLite DB alongside the new daemon.
  1174	    if (Number.isInteger(reclaimedOrphanPid) && reclaimedOrphanPid > 0) {
  1175	      const reapResult = await reapOwnerBeforeRespawn(reclaimedOrphanPid);
  1176	      if (!reapResult.allowed) {
  1177	        log(`reclaimed orphan daemon pid ${reclaimedOrphanPid} could not be reaped (${reapResult.reason}); not spawning a second daemon`);
  1178	        process.exit(0);
  1179	      }
  1180	    }
  1181	
  1182	    writeLeaseFile();
  1183	    const reprobe = readLeaseFile();
  1184	    if (!reprobe || reprobe.pid !== process.pid) {
  1185	      const startedAt = reprobe?.startedAt ?? new Date(0).toISOString();
  1186	      process.stdout.write(`LEASE_HELD_BY:${reprobe ? reprobe.pid : 'unknown'} startedAt=${startedAt}\n`);
  1187	      process.exit(0);
  1188	    }
  1189	    launchServer();
  1190	  } catch (error) {
  1191	    log(`failed: ${JSON.stringify({ start: started, end: now(), actions, error: error.message })}`);
  1192	    log(error.stack || error.message);
  1193	    process.exit(1);
  1194	  } finally {
  1195	    if (lockHeld) {
  1196	      fs.rmSync(lockDir, { recursive: true, force: true });
  1197	    }
  1198	  }
  1199	}
  1200	
  1201	// Run only when invoked directly as the launcher script; stay inert (just export) when required by a
  1202	// test, so the reconnecting-proxy wiring above can be unit-checked without spawning the daemon.
  1203	if (require.main === module) {
  1204	  bootstrapLauncherEnv();
  1205	  void launcherMain();
  1206	}
  1207	
  1208	function configureLauncherPathsForTesting(nextPaths) {
  1209	  if (nextPaths.skillsDir) skillsDir = nextPaths.skillsDir;
  1210	  if (nextPaths.kitDir) kitDir = nextPaths.kitDir;
  1211	  if (nextPaths.dbDir) dbDir = nextPaths.dbDir;
  1212	  if (nextPaths.lockDir) lockDir = nextPaths.lockDir;
  1213	  if (nextPaths.stateFile) stateFile = nextPaths.stateFile;
  1214	}
  1215	
  1216	module.exports = {
  1217	  CODE_INDEX_REPLAYABLE_TOOL_NAMES,
  1218	  CODE_INDEX_UNSAFE_TOOL_NAMES,
  1219	  LEASE_METRIC_TRANSITION_CLASS,
  1220	  classifyCodeIndexFrame,
  1221	  bridgeStdioThroughSessionProxy,
  1222	  MAINTAINER_CATEGORY_ENV,
  1223	  resolveMaintainerModeCategories,
  1224	  configureLeaseMetricSinkForTesting,
  1225	  emitLeaseMetric,
  1226	  leaseMetricClassForTransition,
  1227	  leaseMetricCounterName,
  1228	  acquireBootstrapLock,
  1229	  acquireOwnerLeaseFile,
  1230	  artifactsReady,
  1231	  clearOwnerLeaseFile,
  1232	  ownerLeasePath,
  1233	  readOwnerLeaseFile,
  1234	  reapOwnerBeforeRespawn,
  1235	  removeStaleBootstrapLock,
  1236	  readBootstrapLockOwnerPid,
  1237	  configureLauncherPathsForTesting,
  1238	};

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts | sed -n '250,435p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   250	    await new Promise<void>((resolve) => {
   251	      priorServer.close(() => resolve());
   252	    });
   253	  }
   254	  activeServer = null;
   255	  activeSocketPath = null;
   256	}
   257	
   258	async function startIpcSocketServer(options: IpcSocketServerOptions): Promise<IpcSocketServerHandle> {
   259	  if (activeServer) {
   260	    await disposeActiveServer();
   261	  }
   262	  const socketPath = options.socketPath.startsWith('tcp://')
   263	    ? options.socketPath
   264	    : path.resolve(options.socketPath);
   265	  const log = options.log ?? ((message: string) => console.error(message));
   266	  const maxClients = options.maxClients ?? parseMaxClients();
   267	  const onActivity = options.onActivity ?? (() => undefined);
   268	  if (!socketPath.startsWith('tcp://')) {
   269	    const socketDir = path.dirname(socketPath);
   270	    fs.mkdirSync(socketDir, { recursive: true, mode: 0o700 });
   271	    // `mode: 0o700` only applies when mkdir CREATES the dir. A pre-existing socket dir
   272	    // (e.g. an attacker-planted dir on a shared host) is not protected by the mkdir above,
   273	    // so refuse to bind under a dir not owned by us or that is group/world-writable.
   274	    try {
   275	      const st = fs.statSync(socketDir);
   276	      const uid = typeof process.getuid === 'function' ? process.getuid() : null;
   277	      if (uid !== null && st.uid !== uid) {
   278	        throw new Error(`IPC socket dir ${socketDir} not owned by current user (uid ${st.uid} != ${uid})`);
   279	      }
   280	      if ((st.mode & 0o022) !== 0) {
   281	        throw new Error(`IPC socket dir ${socketDir} is group/world-writable (mode ${(st.mode & 0o777).toString(8)})`);
   282	      }
   283	    } catch (error: unknown) {
   284	      const code = error && typeof error === 'object' && 'code' in error ? (error as NodeJS.ErrnoException).code : undefined;
   285	      if (code !== 'ENOENT') throw error;
   286	    }
   287	    // Refuse to bind over a symlink planted at the socket path. The EADDRINUSE reclaim branch
   288	    // fences a stale node via canUnlinkExistingSocket (lstat); the fresh-bind path needs the same
   289	    // protection so a symlink whose target we would later chmod cannot be used to redirect the
   290	    // permission change onto an arbitrary file.
   291	    try {
   292	      const linkStat = fs.lstatSync(socketPath);
   293	      if (linkStat.isSymbolicLink()) {
   294	        throw new Error(`IPC socket path ${socketPath} is a symlink; refusing to bind`);
   295	      }
   296	    } catch (error: unknown) {
   297	      const code = error && typeof error === 'object' && 'code' in error ? (error as NodeJS.ErrnoException).code : undefined;
   298	      if (code !== 'ENOENT') throw error;
   299	    }
   300	  }
   301	
   302	  const server = net.createServer((socket) => {
   303	    if (activeSockets.size >= maxClients) {
   304	      log(`[ipc-bridge] refusing secondary connection: max clients ${maxClients} reached`);
   305	      socket.end();
   306	      socket.destroy();
   307	      return;
   308	    }
   309	
   310	    activeSockets.add(socket);
   311	    onActivity();
   312	    log('[ipc-bridge] secondary connected pid=?');
   313	
   314	    const originalWrite = socket.write.bind(socket);
   315	    socket.write = ((chunk: unknown, ...args: unknown[]) => {
   316	      onActivity();
   317	      totalSecondaryMessagesOut += countJsonRpcFrames(chunk);
   318	      return originalWrite(chunk as string | Uint8Array, ...(args as [BufferEncoding?, (() => void)?]));
   319	    }) as typeof socket.write;
   320	
   321	    socket.on('data', (chunk) => {
   322	      onActivity();
   323	      totalSecondaryMessagesIn += countJsonRpcFrames(chunk);
   324	    });
   325	
   326	    const transport = new StdioServerTransport(socket, socket);
   327	    activeTransports.set(socket, transport);
   328	    const secondaryServer = options.createServer();
   329	    secondaryServer.connect(transport).catch((error: unknown) => {
   330	      const message = error instanceof Error ? error.message : String(error);
   331	      log(`[ipc-bridge] secondary connect error: ${message}`);
   332	      socket.destroy();
   333	    });
   334	
   335	    socket.once('close', () => {
   336	      activeSockets.delete(socket);
   337	      activeTransports.delete(socket);
   338	      void transport.close();
   339	      log('[ipc-bridge] disconnect');
   340	    });
   341	    socket.once('error', (error) => {
   342	      log(`[ipc-bridge] socket error: ${error.message}`);
   343	    });
   344	  });
   345	
   346	  try {
   347	    await listenOnce(server, socketPath);
   348	  } catch (error: unknown) {
   349	    const err = error as NodeJS.ErrnoException;
   350	    if (err.code !== 'EADDRINUSE') {
   351	      throw err;
   352	    }
   353	    if (socketPath.startsWith('tcp://')) {
   354	      // A TCP port in use cannot be reclaimed by unlinking; back off and retry a few times. If it
   355	      // never frees, run without the secondary bridge rather than aborting the whole daemon.
   356	      const listened = await retryTcpListenAfterEaddrInUse(server, socketPath, log);
   357	      if (!listened) {
   358	        log(`[ipc-bridge] tcp socket remained in use at ${socketPath}; secondary bridge disabled`);
   359	        return {
   360	          socketPath,
   361	          close: async () => {
   362	            for (const socket of activeSockets) {
   363	              socket.destroy();
   364	            }
   365	            activeSockets.clear();
   366	            activeTransports.clear();
   367	          },
   368	        };
   369	      }
   370	    } else {
   371	      // Unix socket path: only reclaim a stale node that is provably ours (the fence). On a benign
   372	      // concurrent-primary race the node may already be gone — canUnlinkExistingSocket treats ENOENT
   373	      // as reclaimable, so we re-bind instead of aborting; a foreign-owned node still refuses.
   374	      if (!canUnlinkExistingSocket(socketPath)) {
   375	        throw err;
   376	      }
   377	      try {
   378	        fs.unlinkSync(socketPath);
   379	      } catch (unlinkError: unknown) {
   380	        const unlinkErr = unlinkError as NodeJS.ErrnoException;
   381	        if (unlinkErr.code !== 'ENOENT') {
   382	          throw unlinkErr;
   383	        }
   384	      }
   385	      await listenOnce(server, socketPath);
   386	    }
   387	  }
   388	
   389	  const address = server.address();
   390	  const listenedPath = typeof address === 'object' && address
   391	    ? `tcp://${address.address}:${address.port}`
   392	    : socketPath;
   393	  if (!socketPath.startsWith('tcp://')) {
   394	    // Do not chmod through a symlink. lstat first and only chmod a real socket node so the 0o600
   395	    // tightening cannot be redirected onto an attacker-pointed target between bind and chmod.
   396	    const boundStat = fs.lstatSync(socketPath);
   397	    if (boundStat.isSymbolicLink() || !boundStat.isSocket()) {
   398	      throw new Error(`IPC socket path ${socketPath} is not a bound socket; refusing to chmod`);
   399	    }
   400	    fs.chmodSync(socketPath, 0o600);
   401	  }
   402	  activeServer = server;
   403	  activeSocketPath = listenedPath;
   404	  log(`[ipc-bridge] socket listening at ${listenedPath}`);
   405	
   406	  return {
   407	    socketPath: listenedPath,
   408	    close: async () => {
   409	      for (const socket of activeSockets) {
   410	        socket.destroy();
   411	      }
   412	      activeSockets.clear();
   413	      activeTransports.clear();
   414	      await new Promise<void>((resolve) => {
   415	        server.close(() => resolve());
   416	      });
   417	      if (activeServer === server) {
   418	        activeServer = null;
   419	        activeSocketPath = null;
   420	      }
   421	      if (!socketPath.startsWith('tcp://')) {
   422	        try {
   423	          fs.unlinkSync(socketPath);
   424	        } catch (error: unknown) {
   425	          const err = error as NodeJS.ErrnoException;
   426	          if (err.code !== 'ENOENT') {
   427	            throw err;
   428	          }
   429	        }
   430	      }
   431	    },
   432	  };
   433	}
   434	
   435	export {

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/code-index-cli.ts | sed -n '960,1150p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   960	function ensureSocketEnvironment(): void {
   961	  if (!process.env.SPECKIT_IPC_SOCKET_DIR) {
   962	    process.env.SPECKIT_IPC_SOCKET_DIR = DEFAULT_SOCKET_DIR;
   963	  }
   964	  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
   965	  if (!socketDir || socketDir.startsWith('tcp://')) return;
   966	  mkdirSync(socketDir, { recursive: true, mode: 0o700 });
   967	  assertSocketPerimeter(socketDir);
   968	}
   969	
   970	function sleep(ms: number): Promise<void> {
   971	  return new Promise((resolve) => setTimeout(resolve, ms));
   972	}
   973	
   974	function spawnLauncher(paths: RepoPaths): void {
   975	  const child = spawn(process.execPath, [paths.launcherPath], {
   976	    cwd: paths.repoRoot,
   977	    env: process.env,
   978	    detached: true,
   979	    stdio: 'ignore',
   980	  });
   981	  child.unref();
   982	}
   983	
   984	async function waitForDaemon(socketPath: string, bridge: BridgeModule, timeoutMs: number): Promise<void> {
   985	  const deadline = Date.now() + timeoutMs;
   986	  let lastReason = 'not probed';
   987	
   988	  while (Date.now() <= deadline) {
   989	    const remaining = Math.max(1, deadline - Date.now());
   990	    const probe = await bridge.probeDaemon(socketPath, {
   991	      timeoutMs: Math.min(remaining, 5000),
   992	      deepProbe: true,
   993	    });
   994	    if (probe.status === 'alive') return;
   995	    lastReason = probe.reason ?? probe.status;
   996	    await sleep(100);
   997	  }
   998	
   999	  throw new CliRetryableError(`backend unavailable: ${lastReason}`);
  1000	}
  1001	
  1002	class JsonRpcSocketClient {
  1003	  private nextId = 1;
  1004	  private readonly decoder = new StringDecoder('utf8');
  1005	
  1006	  private constructor(
  1007	    private readonly socket: net.Socket,
  1008	  ) {}
  1009	
  1010	  static connect(socketPath: string, bridge: BridgeModule, timeoutMs: number): Promise<JsonRpcSocketClient> {
  1011	    return new Promise((resolve, reject) => {
  1012	      let socket: net.Socket;
  1013	      let settled = false;
  1014	      const finish = (error?: Error): void => {
  1015	        if (settled) return;
  1016	        settled = true;
  1017	        clearTimeout(timer);
  1018	        socket.off?.('connect', onConnect);
  1019	        socket.off?.('error', onError);
  1020	        if (error) {
  1021	          socket.destroy?.();
  1022	          reject(error);
  1023	          return;
  1024	        }
  1025	        resolve(new JsonRpcSocketClient(socket));
  1026	      };
  1027	      const onConnect = (): void => finish();
  1028	      const onError = (error: Error): void => finish(error);
  1029	      const timer = setTimeout(() => finish(new CliRetryableError('connection timed out')), timeoutMs);
  1030	      timer.unref?.();
  1031	
  1032	      try {
  1033	        const connectionOptions = bridge.toConnectionOptions(socketPath);
  1034	        socket = typeof connectionOptions === 'string'
  1035	          ? net.createConnection(connectionOptions)
  1036	          : net.createConnection(connectionOptions);
  1037	      } catch (error: unknown) {
  1038	        clearTimeout(timer);
  1039	        reject(error instanceof Error ? error : new Error(String(error)));
  1040	        return;
  1041	      }
  1042	      socket.once('connect', onConnect);
  1043	      socket.once('error', onError);
  1044	    });
  1045	  }
  1046	
  1047	  notify(method: string, params?: unknown): void {
  1048	    const frame = params === undefined
  1049	      ? { jsonrpc: '2.0', method }
  1050	      : { jsonrpc: '2.0', method, params };
  1051	    this.socket.write(`${JSON.stringify(frame)}\n`);
  1052	  }
  1053	
  1054	  request(method: string, params: unknown, timeoutMs: number): Promise<unknown> {
  1055	    const id = this.nextId++;
  1056	    const request = { jsonrpc: '2.0', id, method, params };
  1057	    return new Promise((resolve, reject) => {
  1058	      let buffer = '';
  1059	      let settled = false;
  1060	
  1061	      const cleanup = (): void => {
  1062	        clearTimeout(timer);
  1063	        this.socket.off('data', onData);
  1064	        this.socket.off('error', onError);
  1065	        this.socket.off('close', onClose);
  1066	      };
  1067	      const finish = (error: unknown, value?: unknown): void => {
  1068	        if (settled) return;
  1069	        settled = true;
  1070	        cleanup();
  1071	        if (error) {
  1072	          reject(error);
  1073	          return;
  1074	        }
  1075	        resolve(value);
  1076	      };
  1077	      const onData = (chunk: Buffer | string): void => {
  1078	        buffer += Buffer.isBuffer(chunk) ? this.decoder.write(chunk) : String(chunk ?? '');
  1079	        let newlineIndex = buffer.indexOf('\n');
  1080	        while (newlineIndex !== -1) {
  1081	          const line = buffer.slice(0, newlineIndex).trim();
  1082	          buffer = buffer.slice(newlineIndex + 1);
  1083	          newlineIndex = buffer.indexOf('\n');
  1084	          if (!line) continue;
  1085	          let parsed: JsonRpcResponse;
  1086	          try {
  1087	            parsed = JSON.parse(line) as JsonRpcResponse;
  1088	          } catch {
  1089	            continue;
  1090	          }
  1091	          if (parsed.id !== id) continue;
  1092	          if (parsed.error) {
  1093	            finish(new JsonRpcError(parsed.error));
  1094	            return;
  1095	          }
  1096	          finish(null, parsed.result);
  1097	          return;
  1098	        }
  1099	      };
  1100	      const onError = (error: Error): void => finish(error);
  1101	      const onClose = (): void => finish(new CliRetryableError('socket closed before response'));
  1102	      const timer = setTimeout(() => finish(new CliRetryableError(`${method} timed out`)), timeoutMs);
  1103	      timer.unref?.();
  1104	
  1105	      this.socket.on('data', onData);
  1106	      this.socket.once('error', onError);
  1107	      this.socket.once('close', onClose);
  1108	      this.socket.write(`${JSON.stringify(request)}\n`);
  1109	    });
  1110	  }
  1111	
  1112	  close(): void {
  1113	    this.socket.end();
  1114	    this.socket.destroy();
  1115	  }
  1116	}
  1117	
  1118	async function ensureDaemonReady(socketPath: string, bridge: BridgeModule, paths: RepoPaths, timeoutMs: number, warmOnly: boolean): Promise<void> {
  1119	  const initialProbe = await bridge.probeDaemon(socketPath, { timeoutMs: Math.min(timeoutMs, 5000), deepProbe: true });
  1120	  if (initialProbe.status === 'alive') return;
  1121	  if (warmOnly) {
  1122	    throw new CliRetryableError(`backend unavailable: ${initialProbe.reason ?? initialProbe.status}`);
  1123	  }
  1124	  spawnLauncher(paths);
  1125	  await waitForDaemon(socketPath, bridge, timeoutMs);
  1126	}
  1127	
  1128	async function callTool(toolName: string, args: Record<string, unknown>, timeoutMs: number, warmOnly: boolean): Promise<unknown> {
  1129	  ensureSocketEnvironment();
  1130	  const paths = findRepoPaths();
  1131	  const bridge = loadBridge(paths);
  1132	  const socketPath = bridge.getIpcSocketPath('mk-code-index', { dbDir: paths.dbDir });
  1133	  if (socketPathTooLong(socketPath)) {
  1134	    throw new CliProtocolError(`IPC socket path exceeds the Darwin sun_path limit: ${socketPath}`);
  1135	  }
  1136	
  1137	  await ensureDaemonReady(socketPath, bridge, paths, timeoutMs, warmOnly);
  1138	
  1139	  const client = await JsonRpcSocketClient.connect(socketPath, bridge, timeoutMs);
  1140	  try {
  1141	    const initialize = await client.request('initialize', {
  1142	      protocolVersion: JSON_RPC_PROTOCOL_VERSION,
  1143	      capabilities: {},
  1144	      clientInfo: { name: 'code-index-cli', version: readCliVersion(paths) },
  1145	    }, timeoutMs) as InitializeResult;
  1146	    if (initialize.protocolVersion && initialize.protocolVersion !== JSON_RPC_PROTOCOL_VERSION) {
  1147	      throw new CliProtocolError(`backend protocol version changed: ${initialize.protocolVersion}`);
  1148	    }
  1149	    client.notify('notifications/initialized');
  1150	    return await client.request('tools/call', { name: toolName, arguments: args }, timeoutMs);

codex
One important detail changed my read: the daemon child itself refreshes the owner lease after `server.connect` and before the socket server starts. That makes the heartbeat useful, but it can still mark a process live during the exact gap where no IPC listener exists.
exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts | sed -n '480,550p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/code-index-cli.ts | sed -n '1137,1185p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   480	        return { acquired: false, holder: current, leasePath, classification: currentClassification };
   481	      }
   482	    }
   483	
   484	    writeOwnerLeaseAtomic(leasePath, lease);
   485	    return { acquired: true, lease, leasePath, reclaimed: current ?? existing, classification: existingClassification };
   486	  } finally {
   487	    releaseOwnerLeaseMutationLock(lock);
   488	  }
   489	}
   490	
   491	export function refreshOwnerLease(
   492	  dbDir: string,
   493	  ownerPid: number,
   494	  now: Date = new Date(),
   495	  patch: Partial<Pick<OwnerLeaseData, 'ownerPid' | 'ppid' | 'executablePath'>> = {},
   496	): boolean {
   497	  const canonicalDbDir = resolveCanonicalDbDir(dbDir);
   498	  const leasePath = ownerLeasePath(canonicalDbDir);
   499	  const lock = tryAcquireOwnerLeaseMutationLock(canonicalDbDir);
   500	  if (!lock) return false;
   501	
   502	  try {
   503	    const holder = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
   504	    if (!holder || holder.ownerPid !== ownerPid) return false;
   505	
   506	    writeOwnerLeaseAtomic(leasePath, {
   507	      ...holder,
   508	      ...patch,
   509	      lastHeartbeatIso: now.toISOString(),
   510	    });
   511	    return true;
   512	  } finally {
   513	    releaseOwnerLeaseMutationLock(lock);
   514	  }
   515	}
   516	
   517	export function releaseOwnerLease(dbDir: string, ownerPid: number): boolean {
   518	  const canonicalDbDir = resolveCanonicalDbDir(dbDir);
   519	  const leasePath = ownerLeasePath(canonicalDbDir);
   520	  // Release under the same mutation lock as acquire/refresh, and re-read the lease
   521	  // while holding it. Without the lock, a concurrent reclaim that writes a successor lease
   522	  // between the read and the unlink would have its lease deleted by path (split-brain).
   523	  const lock = tryAcquireOwnerLeaseMutationLock(canonicalDbDir);
   524	  if (!lock) return false;
   525	  try {
   526	    const holder = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
   527	    if (!holder || holder.ownerPid !== ownerPid) return false;
   528	    unlinkSync(leasePath);
   529	    return true;
   530	  } finally {
   531	    releaseOwnerLeaseMutationLock(lock);
   532	  }
   533	}
   534	
   535	export { OWNER_LEASE_FILE_NAME };

 succeeded in 0ms:
  1137	  await ensureDaemonReady(socketPath, bridge, paths, timeoutMs, warmOnly);
  1138	
  1139	  const client = await JsonRpcSocketClient.connect(socketPath, bridge, timeoutMs);
  1140	  try {
  1141	    const initialize = await client.request('initialize', {
  1142	      protocolVersion: JSON_RPC_PROTOCOL_VERSION,
  1143	      capabilities: {},
  1144	      clientInfo: { name: 'code-index-cli', version: readCliVersion(paths) },
  1145	    }, timeoutMs) as InitializeResult;
  1146	    if (initialize.protocolVersion && initialize.protocolVersion !== JSON_RPC_PROTOCOL_VERSION) {
  1147	      throw new CliProtocolError(`backend protocol version changed: ${initialize.protocolVersion}`);
  1148	    }
  1149	    client.notify('notifications/initialized');
  1150	    return await client.request('tools/call', { name: toolName, arguments: args }, timeoutMs);
  1151	  } finally {
  1152	    client.close();
  1153	  }
  1154	}
  1155	
  1156	export async function runCodeIndexCli(argv: string[], io: CliIo = { stdout: process.stdout, stderr: process.stderr }): Promise<number> {
  1157	  try {
  1158	    const parsed = parseCliArgs(argv);
  1159	    if (parsed.help) {
  1160	      await writeLine(io.stdout, usageText(parsed.command || undefined));
  1161	      return EXIT_SUCCESS;
  1162	    }
  1163	    if (parsed.version) {
  1164	      await writeLine(io.stdout, readCliVersion(findRepoPaths()));
  1165	      return EXIT_SUCCESS;
  1166	    }
  1167	    if (parsed.command === 'list-tools') {
  1168	      await writeLine(io.stdout, renderToolList(parsed.format, parsed.toolListMode));
  1169	      return EXIT_SUCCESS;
  1170	    }
  1171	    if (parsed.command === 'completion') {
  1172	      if (!parsed.completionShell) {
  1173	        throw new CliUsageError('completion requires a shell: bash or zsh');
  1174	      }
  1175	      await writeLine(io.stdout, renderCompletion(parsed.completionShell));
  1176	      return EXIT_SUCCESS;
  1177	    }
  1178	
  1179	    const validated = validateCommand(parsed);
  1180	    if (!validated) {
  1181	      throw new CliUsageError(`Unknown command: ${parsed.command}`);
  1182	    }
  1183	    const result = await callTool(validated.tool.name, validated.args, parsed.timeoutMs, parsed.warmOnly);
  1184	    const { payload, isError } = extractToolPayload(validated.tool.name, result);
  1185	    const renderedPayload = normalizeBlockedPayload(validated.tool.name, payload);

exec
/bin/zsh -lc 'rg -n "secondary_clients_count|getIpcBridgeStats|activeSockets|totalSecondaryMessages" .opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
26:  secondary_clients_count: number;
55:const activeSockets = new Set<net.Socket>();
57:let totalSecondaryMessagesIn = 0;
58:let totalSecondaryMessagesOut = 0;
184:function getIpcBridgeStats(): IpcBridgeStats {
187:    secondary_clients_count: activeSockets.size,
188:    total_secondary_messages_in: totalSecondaryMessagesIn,
189:    total_secondary_messages_out: totalSecondaryMessagesOut,
244:  for (const socket of activeSockets) {
247:  activeSockets.clear();
303:    if (activeSockets.size >= maxClients) {
310:    activeSockets.add(socket);
317:      totalSecondaryMessagesOut += countJsonRpcFrames(chunk);
323:      totalSecondaryMessagesIn += countJsonRpcFrames(chunk);
336:      activeSockets.delete(socket);
362:            for (const socket of activeSockets) {
365:            activeSockets.clear();
409:      for (const socket of activeSockets) {
412:      activeSockets.clear();
437:  getIpcBridgeStats,

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts | sed -n '1,90p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: IPC Socket Server (multi-client launcher bridge)
     3	// ───────────────────────────────────────────────────────────────
     4	// Canonical bridge logic shared by every daemon launcher (memory,
     5	// code-index, skill-advisor). Each service supplies its own socket/db
     6	// PATHS; only the bind/reclaim/serve LOGIC lives here so the security
     7	// and race-safety contract stays identical across services.
     8	
     9	import fs from 'node:fs';
    10	import net from 'node:net';
    11	import os from 'node:os';
    12	import path from 'node:path';
    13	
    14	import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
    15	
    16	const SOCKET_FILE_NAME = 'daemon-ipc.sock';
    17	// Every live session's launcher holds one persistent slot, and multi-seat
    18	// fan-outs run well past 8 concurrent sessions. A refused connection is
    19	// accepted then closed, which probes cannot distinguish from a dead daemon,
    20	// so the cap must exceed any realistic session fleet.
    21	const DEFAULT_MAX_SECONDARY_CLIENTS = 64;
    22	const TCP_EADDRINUSE_RETRY_DELAYS_MS = [100, 250, 500, 1000, 1500] as const;
    23	
    24	interface IpcBridgeStats {
    25	  socket_path: string | null;
    26	  secondary_clients_count: number;
    27	  total_secondary_messages_in: number;
    28	  total_secondary_messages_out: number;
    29	}
    30	
    31	// Structural shape of the only MCP server capability this bridge uses. Typed structurally (a
    32	// method, so its transport param is bivariant) rather than against a concrete `Server` import so
    33	// every consuming package satisfies it with its own `@modelcontextprotocol/sdk` copy — the three
    34	// daemons each install the SDK separately and its private members make the classes nominally
    35	// distinct, which a concrete import would reject across package boundaries.
    36	interface McpServerLike {
    37	  connect(transport: StdioServerTransport): Promise<void>;
    38	}
    39	
    40	interface IpcSocketServerOptions {
    41	  readonly socketPath: string;
    42	  readonly createServer: () => McpServerLike;
    43	  readonly maxClients?: number;
    44	  readonly log?: (message: string) => void;
    45	  readonly onActivity?: () => void;
    46	}
    47	
    48	interface IpcSocketServerHandle {
    49	  readonly socketPath: string;
    50	  readonly close: () => Promise<void>;
    51	}
    52	
    53	let activeServer: net.Server | null = null;
    54	let activeSocketPath: string | null = null;
    55	const activeSockets = new Set<net.Socket>();
    56	const activeTransports = new Map<net.Socket, StdioServerTransport>();
    57	let totalSecondaryMessagesIn = 0;
    58	let totalSecondaryMessagesOut = 0;
    59	
    60	function countJsonRpcFrames(chunk: unknown): number {
    61	  const text = Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk ?? '');
    62	  const newlineCount = text.split('\n').length - 1;
    63	  return Math.max(1, newlineCount);
    64	}
    65	
    66	function parseMaxClients(rawValue = process.env.SPECKIT_MAX_SECONDARY_CLIENTS): number {
    67	  if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
    68	    return DEFAULT_MAX_SECONDARY_CLIENTS;
    69	  }
    70	  const parsed = Number.parseInt(String(rawValue), 10);
    71	  if (!Number.isFinite(parsed) || parsed < 1) {
    72	    return DEFAULT_MAX_SECONDARY_CLIENTS;
    73	  }
    74	  return parsed;
    75	}
    76	
    77	function sleep(ms: number): Promise<void> {
    78	  return new Promise((resolve) => setTimeout(resolve, ms));
    79	}
    80	
    81	// Canonicalize a path via realpath, even when the leaf does not exist yet. realpath the nearest
    82	// existing ancestor (so symlinked roots like macOS `/tmp` -> `/private/tmp` normalize) and
    83	// re-append the missing tail. Without ancestor canonicalization, a socket dir that was cleared
    84	// (e.g. `/tmp/<service>` after a reboot) stays literal `/tmp/...` and fails the allowed-root
    85	// check below — which canonicalizes `/tmp` to `/private/tmp` — crashing the server.
    86	// Fail closed: an existing ancestor that cannot be canonicalized (permission/loop error) must
    87	// abort rather than return a non-canonical path, which would weaken the allowed-root containment
    88	// check that downstream binds rely on.
    89	function canonicalizePath(target: string): string {
    90	  const resolved = path.resolve(target);

codex
The prior design’s biggest weak spot is demoting the registry/orphan discovery layer. If both lease artifacts are gone, socket health cannot find the orphaned PID at all; the only remaining evidence is the DB/WAL side.
exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts | sed -n '300,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc 'rg -n "better-sqlite3|sqlite" .opencode/skills/system-code-graph/mcp_server/package.json .opencode/bin/mk-code-index-launcher.cjs .opencode/bin/package.json package.json' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   300	    return 'alive';
   301	  } catch (error: unknown) {
   302	    if (error && typeof error === 'object' && 'code' in error) {
   303	      if (error.code === 'ESRCH') return 'dead';
   304	      if (error.code === 'EPERM') return 'unknown-eperm';
   305	    }
   306	    return 'alive';
   307	  }
   308	}
   309	
   310	export function processAlive(pid: number): boolean {
   311	  return getProcessLiveness(pid) !== 'dead';
   312	}
   313	
   314	function isHeartbeatStale(lease: OwnerLeaseData, now: Date = new Date()): boolean {
   315	  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
   316	  const ttlMs = Number.isFinite(lease.ttlMs) ? lease.ttlMs : 0;
   317	  return !Number.isFinite(heartbeatMs) || now.getTime() - heartbeatMs > ttlMs * 2;
   318	}
   319	
   320	export function getOwnerLeasePath(dbDir: string): string {
   321	  return ownerLeasePath(resolveCanonicalDbDir(dbDir));
   322	}
   323	
   324	export function readOwnerLease(dbDir: string): OwnerLeaseData | null {
   325	  const canonicalDbDir = resolveCanonicalDbDir(dbDir);
   326	  try {
   327	    const parsed = JSON.parse(readFileSync(ownerLeasePath(canonicalDbDir), 'utf8')) as unknown;
   328	    return isOwnerLeaseData(parsed) ? parsed : null;
   329	  } catch {
   330	    return null;
   331	  }
   332	}
   333	
   334	export function readProcessParentPid(pid: number): number | null {
   335	  if (!Number.isInteger(pid) || pid <= 0) return null;
   336	
   337	  if (process.platform === 'linux') {
   338	    try {
   339	      const status = readFileSync(`/proc/${pid}/status`, 'utf8');
   340	      const match = /^PPid:\s+(\d+)$/m.exec(status);
   341	      return match ? Number.parseInt(match[1], 10) : null;
   342	    } catch {
   343	      return null;
   344	    }
   345	  }
   346	
   347	  try {
   348	    const output = execFileSync('ps', ['-o', 'ppid=', '-p', String(pid)], {
   349	      encoding: 'utf8',
   350	      stdio: ['ignore', 'pipe', 'ignore'],
   351	    }).trim();
   352	    return output ? Number.parseInt(output, 10) : null;
   353	  } catch {
   354	    return null;
   355	  }
   356	}
   357	
   358	export function classifyOwner(
   359	  lease: OwnerLeaseData,
   360	  options: OwnerClassificationOptions = {},

 exited 2 in 0ms:
rg: .opencode/skills/system-code-graph/mcp_server/package.json: No such file or directory (os error 2)
rg: .opencode/bin/package.json: No such file or directory (os error 2)
.opencode/bin/mk-code-index-launcher.cjs:1121:          && !exists(path.join(migrationTarget, 'code-graph.sqlite'))
.opencode/bin/mk-code-index-launcher.cjs:1122:          && exists(path.join(formerSharedDbDir, 'code-graph.sqlite'))
.opencode/bin/mk-code-index-launcher.cjs:1126:          'code-graph.sqlite',
.opencode/bin/mk-code-index-launcher.cjs:1127:          'code-graph.sqlite-shm',
.opencode/bin/mk-code-index-launcher.cjs:1128:          'code-graph.sqlite-wal',
.opencode/bin/mk-code-index-launcher.cjs:1132:        // Re-check the sqlite target immediately before copying so a launcher that
.opencode/bin/mk-code-index-launcher.cjs:1137:        if (!exists(path.join(migrationTarget, 'code-graph.sqlite'))) {

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/package.json | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: .opencode/skills/system-code-graph/mcp_server/package.json: No such file or directory

exec
/bin/zsh -lc "rg -n \"LAUNCHER_DIAGNOSTIC|LEASE_HELD_BY|liveOwnerDetected|dead-socket|no-bridge-socket|bridge-refused|staleReclaimed|ownerLeaseReclaimed|walHeld|lsof|diagnostic\" .opencode/bin .opencode/skills/system-code-graph/mcp_server -g '*.cjs' -g '*.ts' -g '*.js'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/bin/mk-skill-advisor-launcher.cjs:163:        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker} (no-bridge-socket)\n`);
.opencode/bin/mk-skill-advisor-launcher.cjs:515:    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:629:  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}\n`);
.opencode/bin/mk-skill-advisor-launcher.cjs:635:  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-skill-advisor-launcher.cjs:658:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
.opencode/bin/mk-skill-advisor-launcher.cjs:665:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-daemon-pid)');
.opencode/bin/mk-skill-advisor-launcher.cjs:677:      log('dead-socket respawn skipped; skill-advisor launcher lease changed while waiting for bootstrap lock');
.opencode/bin/mk-skill-advisor-launcher.cjs:678:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
.opencode/bin/mk-skill-advisor-launcher.cjs:686:      log(`dead-socket respawn skipped; ${reapResult.reason} for daemonPid=${targetPid}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:687:      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
.opencode/bin/mk-skill-advisor-launcher.cjs:705:      log(`dead-socket respawn skipped; another launcher owns skill-advisor owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:706:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-skill-advisor-launcher.cjs:760:    log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:773:    log('staleReclaimed: true');
.opencode/bin/mk-skill-advisor-launcher.cjs:792:        if (decision?.reason !== 'no-bridge-socket') {
.opencode/bin/mk-skill-advisor-launcher.cjs:815:      log(`staleReclaimed: true${legacyMarker ? ' (legacy path)' : ''}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:1319:        process.stdout.write(`LEASE_HELD_BY:${reprobe ? reprobe.pid : 'unknown'} startedAt=${startedAt}\n`);
.opencode/bin/mk-code-index-launcher.cjs:130:  staleReclaimed: 'stale-reclaimed',
.opencode/bin/mk-code-index-launcher.cjs:173:        const suffix = process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1' ? '' : ' (no-bridge-socket)';
.opencode/bin/mk-code-index-launcher.cjs:174:        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-code-index-launcher.cjs:370:// misreporting a healthy owner as no-bridge-socket.
.opencode/bin/mk-code-index-launcher.cjs:483:    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
.opencode/bin/mk-code-index-launcher.cjs:508:    emitLeaseMetric(leaseMetricClassForTransition('staleReclaimed'), {
.opencode/bin/mk-code-index-launcher.cjs:628:  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-code-index-launcher.cjs:670:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
.opencode/bin/mk-code-index-launcher.cjs:677:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-child-pid)');
.opencode/bin/mk-code-index-launcher.cjs:686:      log('dead-socket respawn skipped; code-index owner lease changed while waiting for respawn lock');
.opencode/bin/mk-code-index-launcher.cjs:687:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
.opencode/bin/mk-code-index-launcher.cjs:693:      log(`dead-socket respawn skipped; ${reapResult.reason} for ownerPid=${ownerPid}`);
.opencode/bin/mk-code-index-launcher.cjs:694:      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
.opencode/bin/mk-code-index-launcher.cjs:702:      log(`dead-socket respawn skipped; another launcher owns code-index owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-code-index-launcher.cjs:703:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-code-index-launcher.cjs:1046:  // against the same DB (mirrors the dead-socket respawn reap and the sibling
.opencode/bin/mk-code-index-launcher.cjs:1072:        // maybeBridgeLeaseHolder falls back to a LEASE_HELD_BY diagnostic line
.opencode/bin/mk-code-index-launcher.cjs:1074:        log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
.opencode/bin/mk-code-index-launcher.cjs:1092:        log(`staleReclaimed: true${leaseResult.legacyPath ? ' (legacy path)' : ''}`);
.opencode/bin/mk-code-index-launcher.cjs:1093:        emitLeaseMetric(leaseMetricClassForTransition('staleReclaimed'), {
.opencode/bin/mk-code-index-launcher.cjs:1186:      process.stdout.write(`LEASE_HELD_BY:${reprobe ? reprobe.pid : 'unknown'} startedAt=${startedAt}\n`);
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:237:              // Surface scope + manifest diagnostics directly on
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:989:  // Surface scope + manifest diagnostics directly on the
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:197:    : 'Parser returned parseHealth="error" without diagnostics';
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:316:    recentErrors: summary.recentErrors.map((diagnostic) => ({
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:317:      ...diagnostic,
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:318:      filePath: relativize(diagnostic.filePath, workspaceRoot),
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:319:      errorMessage: relativizeScanError(diagnostic.errorMessage, workspaceRoot),
.opencode/bin/mk-spec-memory-launcher.cjs:270:        const suffix = process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1' ? '' : ' (no-bridge-socket)';
.opencode/bin/mk-spec-memory-launcher.cjs:271:        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-spec-memory-launcher.cjs:472:    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:606:  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-spec-memory-launcher.cjs:639:    return { ready: false, reason: 'no-bridge-socket' };
.opencode/bin/mk-spec-memory-launcher.cjs:794:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
.opencode/bin/mk-spec-memory-launcher.cjs:801:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-owner-pid)');
.opencode/bin/mk-spec-memory-launcher.cjs:809:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-child-pid)');
.opencode/bin/mk-spec-memory-launcher.cjs:822:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-maintenance-active)');
.opencode/bin/mk-spec-memory-launcher.cjs:832:      log(`dead-socket respawn skipped; another launcher owns ${rel(respawnLock.path)}`);
.opencode/bin/mk-spec-memory-launcher.cjs:833:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-spec-memory-launcher.cjs:839:      log('dead-socket respawn skipped; spec-memory owner lease changed while waiting for respawn lock');
.opencode/bin/mk-spec-memory-launcher.cjs:840:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
.opencode/bin/mk-spec-memory-launcher.cjs:846:      log('dead-socket respawn skipped; lease changed while waiting for respawn lock');
.opencode/bin/mk-spec-memory-launcher.cjs:847:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
.opencode/bin/mk-spec-memory-launcher.cjs:853:      log(`dead-socket respawn skipped; ${ownerReapResult.reason} for ownerPid=${ownerPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:854:      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${ownerReapResult.reason})`);
.opencode/bin/mk-spec-memory-launcher.cjs:862:      log(`dead-socket respawn skipped; another launcher owns spec-memory owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-spec-memory-launcher.cjs:863:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-spec-memory-launcher.cjs:870:      log(`dead-socket respawn skipped; ${reapResult.reason} for childPid=${childPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:871:      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
.opencode/bin/mk-spec-memory-launcher.cjs:1633:        log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
.opencode/bin/mk-spec-memory-launcher.cjs:1645:        log(`staleReclaimed: true${leaseResult.legacyPath ? ' (legacy path)' : ''}`);
.opencode/bin/mk-spec-memory-launcher.cjs:1663:            // probe the dead-socket decision uses, with its tuned timeout + retry that tolerates a
.opencode/bin/mk-spec-memory-launcher.cjs:1700:        // exclusive respawn lock to serialize it, the same lock the dead-socket respawn path uses;
.opencode/bin/mk-spec-memory-launcher.cjs:1714:          // defer and reconnect. Mirrors the dead-socket respawn path's post-lock lease re-read.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:212:    expect(launcherModule.leaseMetricClassForTransition('staleReclaimed')).toBe('stale-reclaimed');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:232:  it('exits with LEASE_HELD_BY when a live owner exists', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:244:    expect(second.stdout).toContain(`LEASE_HELD_BY:${ownerPid}`);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:245:    expect(second.stdout).toMatch(new RegExp(`^LEASE_HELD_BY:${ownerPid} startedAt=\\d{4}-\\d{2}-\\d{2}T`, 'm'));
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:255:      () => first.child.exitCode !== null || second.child.exitCode !== null || first.stdout.includes('LEASE_HELD_BY') || second.stdout.includes('LEASE_HELD_BY'),
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:262:    const running = runs.filter((run) => run.child.exitCode === null && !run.stdout.includes('LEASE_HELD_BY:'));
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:263:    const blocked = runs.filter((run) => run.stdout.includes('LEASE_HELD_BY:'));
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:270:  // Live-owner diagnostics include the recorded startedAt value.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:285:      expect(run.stdout).toContain(`LEASE_HELD_BY:${holder.pid} startedAt=${startedAt}`);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:337:  it('reclaims a dead-pid lease file and logs staleReclaimed', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:343:    await waitFor(() => /^.*staleReclaimed: true\b/m.test(run.stderr), 2000, 'stale reclaim log');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:344:    expect(run.stderr).toMatch(/^.*staleReclaimed: true\b/m);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:388:        first.stdout.includes('LEASE_HELD_BY') ||
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:389:        second.stdout.includes('LEASE_HELD_BY'),
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:435:      await waitFor(() => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(run.stderr), 2000, 'stale-heartbeat owner reclaim log');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:438:      expect(run.stderr).toContain(`ownerLeaseReclaimed: stale-heartbeat-reclaim ownerPid=${holder.pid}`);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:469:  // LEASE_HELD_BY/exit terminal state within seconds — both launchers can stay alive (one
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:512:          () => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(first.stderr),
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:517:          () => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(second.stderr),
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:580:  it('reports LEASE_HELD_BY from the legacy launcher lease path', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:602:      expect(run.stdout).toContain(`LEASE_HELD_BY:${holder.pid} startedAt=${startedAt} (legacy path)`);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:170:      const diagnostics = graphDb.getParseDiagnosticsSummary();
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:178:      expect(diagnostics.affectedFiles).toBe(1);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:179:      expect(diagnostics.recentErrors[0]).toMatchObject({
.opencode/bin/lib/launcher-ipc-bridge.cjs:380:    process.stdout.write(`LEASE_HELD_BY:${ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/lib/launcher-ipc-bridge.cjs:394:  // recomputed path can miss the live socket and false-report 'no-bridge-socket'. Only trust the
.opencode/bin/lib/launcher-ipc-bridge.cjs:406:    writeLeaseHeld(' (no-bridge-socket)');
.opencode/bin/lib/launcher-ipc-bridge.cjs:407:    return { action: 'report', reason: 'no-bridge-socket', socketPath };
.opencode/bin/lib/launcher-ipc-bridge.cjs:438:      writeLeaseHeld(' (bridge-refused)');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:40:      // diagnostic distinguishes absent
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:56:      // diagnostic returns corrupt with raw payload
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:248:  diagnostics: ReturnType<typeof buildReadinessDiagnostics>,
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:254:    storedScope: { fingerprint: diagnostics.storedScope?.fingerprint ?? null },
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:255:    activeScope: { fingerprint: diagnostics.activeScope?.fingerprint ?? null },
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:256:    parseDiagnosticsBacklog: diagnostics.parseErrorBacklog ?? 0,
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:669:  const diagnostics = buildReadinessDiagnostics();
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:677:      ...diagnostics,
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:689:      ...diagnostics,
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:711:      ? evaluateGuardedFullScan(diagnostics, parseErrorBacklogThreshold)
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:724:      ...diagnostics,
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:849:      ...diagnostics,
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:866:    ...diagnostics,
.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:912: * and any other read-only diagnostic surface.
.opencode/skills/system-code-graph/mcp_server/tests/ensure-ready.vitest.ts:363:    it('refreshes detected stale files when parse diagnostics block a broad refresh', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/auto-rescan-policy.vitest.ts:56:  describe('parse diagnostics backlog', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:30:    const harness = createCodeIndexHarness('dead-socket-respawn');
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:153:  it('cg-017 keeps diagnostic command modes read-only and apply modes explicitly config-scoped', () => {
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts:101:  tempRoot = mkdtempSync(join(tmpdir(), 'cg-manual-diagnostics-'));
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts:118:describe('cg-004,005 — manual diagnostics', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts:1649:  it('exposes parse diagnostics in scan and status responses', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts:1652:    const diagnostics = {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scan.vitest.ts:1663:    mocks.getParseDiagnosticsSummaryMock.mockReturnValue(diagnostics);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cluster-a.vitest.ts:5://   - Blocked-read diagnostics — scope + manifest fields
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cluster-a.vitest.ts:50:  it('blocks guarded inline full scan when parse diagnostics are backlogged', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cluster-a.vitest.ts:81:// Query handler blocked-payload diagnostics on data.*
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cluster-a.vitest.ts:123:describe('F-007: blocked full-scan payload surfaces diagnostics on data', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cluster-a.vitest.ts:142:  it('includes scope and manifest diagnostics in blocked full-scan payloads', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cluster-a.vitest.ts:204:  it('surfaces null diagnostics on blocked payloads when ensure-ready omits them', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cluster-a.vitest.ts:206:    // populate the diagnostic envelope must not crash the handler.
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cluster-a.vitest.ts:314:    // diagnostics. The gold-query battery still runs and the result
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:165:  it('seeds B1 rows from parse_diagnostics during migration', () => {
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:173:        CREATE TABLE parse_diagnostics (
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:179:        INSERT INTO parse_diagnostics (file_path, error_message, error_count, last_seen_at)
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts:402:  it('includes scope and manifest diagnostics in blocked full-scan payloads', async () => {
.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts:253:      FROM parse_diagnostics
.opencode/skills/system-code-graph/mcp_server/lib/auto-rescan-policy.ts:13:// matches the active runtime scope AND the parse-diagnostics
.opencode/skills/system-code-graph/mcp_server/lib/auto-rescan-policy.ts:20://     and MUST surface the diagnostics payload so
.opencode/skills/system-code-graph/mcp_server/lib/auto-rescan-policy.ts:24:// gate via `evaluateGuardedFullScan()` so the diagnostics on
.opencode/skills/system-code-graph/mcp_server/lib/auto-rescan-policy.ts:52:   * Number of files currently in the parse_diagnostics backlog.
.opencode/skills/system-code-graph/mcp_server/lib/auto-rescan-policy.ts:80: * Default backlog threshold. Any non-zero parse-diagnostic
.opencode/skills/system-code-graph/mcp_server/lib/auto-rescan-policy.ts:104: * Otherwise the caller must block with diagnostics.
.opencode/skills/system-code-graph/mcp_server/lib/shared/codex-hook-policy.ts:14:  readonly diagnostics: {
.opencode/skills/system-code-graph/mcp_server/lib/shared/codex-hook-policy.ts:61:    diagnostics: { probeDurationMs: 0 },
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:251:  CREATE TABLE IF NOT EXISTS parse_diagnostics (
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:277:  CREATE INDEX IF NOT EXISTS idx_parse_diagnostics_last_seen ON parse_diagnostics(last_seen_at);
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:976:    CREATE TABLE IF NOT EXISTS parse_diagnostics (
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:993:    CREATE INDEX IF NOT EXISTS idx_parse_diagnostics_last_seen ON parse_diagnostics(last_seen_at);
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1016:    FROM parse_diagnostics
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1413:    : 'Parser returned parseHealth="error" without diagnostics';
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1415:    INSERT INTO parse_diagnostics (file_path, error_message, error_count, last_seen_at)
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1419:      error_count = parse_diagnostics.error_count + 1,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1425:    FROM parse_diagnostics
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1444:  d.prepare('DELETE FROM parse_diagnostics WHERE file_path = ?').run(filePath);
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1450:  const affected = d.prepare('SELECT COUNT(*) AS count FROM parse_diagnostics').get() as { count: number };
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1453:    FROM parse_diagnostics
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1478:    FROM parse_diagnostics diagnostic
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1479:    INNER JOIN code_files file ON file.file_path = diagnostic.file_path

codex
I found the launcher already has a weaker version of the orphan-reap idea: it reaps a PID only when it reclaimed an owner lease. That does not fire when the lease file is missing, which is exactly the incident shape the design says mattered.
exec
/bin/zsh -lc 'rg -n "better-sqlite3|sqlite|scripts|dependencies|devDependencies" .opencode/skills/system-code-graph/package.json .opencode/skills/system-code-graph/mcp_server/package.json package.json -S' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
rg: .opencode/skills/system-code-graph/mcp_server/package.json: No such file or directory (os error 2)
package.json:5:  "scripts": {
package.json:8:  "dependencies": {
package.json:13:  "devDependencies": {
.opencode/skills/system-code-graph/package.json:6:  "scripts": {
.opencode/skills/system-code-graph/package.json:14:  "dependencies": {
.opencode/skills/system-code-graph/package.json:16:    "better-sqlite3": "^12.6.2",
.opencode/skills/system-code-graph/package.json:22:  "devDependencies": {
.opencode/skills/system-code-graph/package.json:23:    "@types/better-sqlite3": "^7.6.13",

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import { describe, expect, it } from 'vitest';
     2	
     3	import {
     4	  createCodeIndexHarness,
     5	  parseJsonOutput,
     6	  registerCodeIndexCliTeardown,
     7	} from './code-index-cli-harness.js';
     8	
     9	registerCodeIndexCliTeardown();
    10	
    11	describe('code-index CLI owner lease and respawn locking', () => {
    12	  it('serializes concurrent launcher starts to one owner lease', async () => {
    13	    const harness = createCodeIndexHarness('dual-spawn');
    14	
    15	    const [first, second] = await Promise.all([
    16	      harness.runCli(['code-graph-status', '--format', 'json']),
    17	      harness.runCli(['code-graph-status', '--format', 'json']),
    18	    ]);
    19	
    20	    expect(first.exitCode).toBe(0);
    21	    expect(second.exitCode).toBe(0);
    22	    expect(JSON.stringify(parseJsonOutput(first))).toContain('readiness');
    23	    expect(JSON.stringify(parseJsonOutput(second))).toContain('readiness');
    24	    const lease = harness.assertSingleOwnerLease();
    25	    expect(lease.ownerPid).toBeGreaterThan(1);
    26	    harness.assertNoRespawnLock();
    27	  });
    28	
    29	  it('uses a fresh launcher after terminating the recorded daemon', async () => {
    30	    const harness = createCodeIndexHarness('dead-socket-respawn');
    31	
    32	    const initial = await harness.runCli(['code-graph-status', '--format', 'json']);
    33	    expect(initial.exitCode).toBe(0);
    34	
    35	    const terminated = await harness.killOwnerDaemon();
    36	
    37	    const takeover = await harness.runCli(['code-graph-status', '--format', 'json']);
    38	    expect(takeover.exitCode).toBe(0);
    39	    expect(JSON.stringify(parseJsonOutput(takeover))).toContain('readiness');
    40	    const lease = harness.assertSingleOwnerLease();
    41	    expect(lease.ownerPid).not.toBe(terminated.ownerPid);
    42	    harness.assertNoRespawnLock();
    43	  });
    44	});

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/package.json | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	{
     2	  "name": "@spec-kit/system-code-graph",
     3	  "version": "1.0.0",
     4	  "private": true,
     5	  "type": "module",
     6	  "scripts": {
     7	    "build": "tsc --build tsconfig.json",
     8	    "typecheck": "tsc --noEmit -p tsconfig.json",
     9	    "clean": "rm -rf dist mcp_server/dist",
    10	    "rebuild": "npm run clean && npm run build",
    11	    "test": "vitest run",
    12	    "test:watch": "vitest"
    13	  },
    14	  "dependencies": {
    15	    "@modelcontextprotocol/sdk": "^1.24.3",
    16	    "better-sqlite3": "^12.6.2",
    17	    "ignore": "^5.3.2",
    18	    "tree-sitter-wasms": "^0.1.13",
    19	    "web-tree-sitter": "^0.24.7",
    20	    "zod": "^4.1.12"
    21	  },
    22	  "devDependencies": {
    23	    "@types/better-sqlite3": "^7.6.13",
    24	    "@types/node": "^25.2.1",
    25	    "typescript": "^5.9.3",
    26	    "vitest": "^4.0.18"
    27	  }
    28	}

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts | sed -n '400,540p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   400	    // The migrated DB must equal the seeded source and never change (byte-stability).
   401	    expect(afterFirst.equals(seededContent)).toBe(true);
   402	    expect(afterSettle.equals(seededContent)).toBe(true);
   403	    expect(afterSettle.length).toBe(seededContent.length);
   404	
   405	    // Exactly one migration occurred across both launchers. The un-fixed code (no lock gate,
   406	    // no COPYFILE_EXCL) can log this line twice; the fix gates migration on the single
   407	    // bootstrap-lock winner, so it appears exactly once.
   408	    const migrationLines = (first.stderr + second.stderr).match(/migrated DB from/g) ?? [];
   409	    expect(migrationLines).toHaveLength(1);
   410	
   411	    // Exactly one launcher owns the lease; the other bridges/reports.
   412	    const ownerPid = readOwnerLeasePid(workspace.root);
   413	    expect(ownerPid).not.toBeNull();
   414	  });
   415	
   416	  it('reclaims a stale-heartbeat owner lease with a live PID', async () => {
   417	    const workspace = createWorkspace();
   418	    const holder = await createLivePid();
   419	    const ownerLeasePath = join(workspace.root, ownerLeaseRelativePath);
   420	    const dbDir = dirname(ownerLeasePath);
   421	
   422	    try {
   423	      mkdirSync(dbDir, { recursive: true });
   424	      writeFileSync(ownerLeasePath, JSON.stringify({
   425	        ownerPid: holder.pid,
   426	        ppid: process.pid,
   427	        executablePath: process.execPath,
   428	        startedAtIso: '2026-05-22T00:00:00.000Z',
   429	        lastHeartbeatIso: '2026-05-22T00:00:00.000Z',
   430	        ttlMs: 10,
   431	        canonicalDbDir: resolve(dbDir),
   432	      }, null, 2));
   433	
   434	      const run = spawnLauncher(workspace.launcherPath, workspace.root);
   435	      await waitFor(() => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(run.stderr), 2000, 'stale-heartbeat owner reclaim log');
   436	      await waitForLeasePid(workspace.pidFilePath, run.child.pid);
   437	
   438	      expect(run.stderr).toContain(`ownerLeaseReclaimed: stale-heartbeat-reclaim ownerPid=${holder.pid}`);
   439	      expect(readOwnerLeasePid(workspace.root)).not.toBe(holder.pid);
   440	    } finally {
   441	      holder.kill('SIGTERM');
   442	      try {
   443	        await waitForExit(holder, 1000);
   444	      } catch {
   445	        holder.kill('SIGKILL');
   446	      }
   447	    }
   448	  });
   449	
   450	  // Two launchers reclaiming the SAME pre-existing stale-heartbeat owner lease at once.
   451	  // Both read the identical stale lease and BOTH enter acquireOwnerLeaseFile's reclaim branch
   452	  // (the acquire-time re-read CAS) — the path the existing concurrent-launcher test
   453	  // never reaches, because it spawns from a FRESH workspace where both take the O_EXCL 'wx'
   454	  // fresh-create path. This test seeds a stale-heartbeat owner lease owned by a LIVE helper pid
   455	  // (so classifyOwnerLease returns 'stale-heartbeat-reclaim') and spawns two launchers at once so
   456	  // both observe the same existing stale lease and both run the reclaim branch concurrently —
   457	  // genuinely new coverage of the concurrent reclaim path.
   458	  //
   459	  // SCOPE / DETERMINISM NOTE (honest): at the launcher-spawn boundary the acquire-time re-read CAS
   460	  // is NOT isolable from naive last-writer-wins, so this test does NOT claim to fail iff the
   461	  // re-read is deleted. Measured against both the patched launcher and a launcher with ONLY the
   462	  // acquire-time re-read removed, the spawned-process outcomes are statistically indistinguishable:
   463	  // single-writer is independently enforced by the bootstrap lock (acquireBootstrapLock), the PID
   464	  // lease, and the re-read-before-unlink guard in clearOwnerLeaseFile. The acquire-time
   465	  // re-read only narrows a sub-syscall window already covered by those guards.
   466	  //
   467	  // Two further measured facts make stronger end-state assertions UNSOUND at this layer, so this
   468	  // test deliberately does NOT assert them: (1) the concurrent reclaim does not reach a clean
   469	  // LEASE_HELD_BY/exit terminal state within seconds — both launchers can stay alive (one
   470	  // daemon-parent, one bridged-and-waiting); and (2) when both launchers pass the owner-lease gate,
   471	  // the downstream PID-lease write is last-writer-wins, so the recorded PID lease can legitimately
   472	  // flip between the two launchers' pids (observed clobber on the patched launcher too). These are
   473	  // launcher-runtime characteristics outside this test's deterministic assertions and the
   474	  // migration-block scenario.
   475	  //
   476	  // What this test asserts is what IS deterministically true and valuable as regression coverage:
   477	  // both concurrent launchers exercise the stale-heartbeat reclaim branch (new coverage — the
   478	  // existing concurrent test uses a FRESH workspace and only hits the O_EXCL fresh-create path),
   479	  // neither launcher errors/crashes in that path, and the seeded stale holder is reclaimed away —
   480	  // it never remains the recorded owner once both launchers have reclaimed.
   481	  it('exercises the concurrent stale-heartbeat reclaim branch in both launchers without errors', async () => {
   482	    const ROUNDS = 5;
   483	    for (let round = 0; round < ROUNDS; round += 1) {
   484	      const workspace = createWorkspace();
   485	      const holder = await createLivePid();
   486	      const ownerLeasePath = join(workspace.root, ownerLeaseRelativePath);
   487	      const dbDir = dirname(ownerLeasePath);
   488	
   489	      try {
   490	        // Seed a stale-heartbeat owner lease owned by a LIVE helper pid so classifyOwnerLease
   491	        // returns 'stale-heartbeat-reclaim' (live pid + heartbeat older than 2*ttlMs), forcing
   492	        // both launchers down the reclaim branch rather than the fresh-create branch.
   493	        mkdirSync(dbDir, { recursive: true });
   494	        writeFileSync(ownerLeasePath, JSON.stringify({
   495	          ownerPid: holder.pid,
   496	          ppid: process.pid,
   497	          executablePath: process.execPath,
   498	          startedAtIso: '2026-05-22T00:00:00.000Z',
   499	          lastHeartbeatIso: '2026-05-22T00:00:00.000Z',
   500	          ttlMs: 10,
   501	          canonicalDbDir: resolve(dbDir),
   502	        }, null, 2));
   503	
   504	        // Spawn both simultaneously so both observe the SAME existing stale lease and both enter
   505	        // the reclaim re-read CAS.
   506	        const first = spawnLauncher(workspace.launcherPath, workspace.root);
   507	        const second = spawnLauncher(workspace.launcherPath, workspace.root);
   508	
   509	        // BOTH must observe the stale lease and run the reclaim branch — the precondition that
   510	        // gives this test its coverage value (the existing concurrent test never reaches it).
   511	        await waitFor(
   512	          () => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(first.stderr),
   513	          4000,
   514	          `first launcher stale-heartbeat reclaim (round ${round})`,
   515	        );
   516	        await waitFor(
   517	          () => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(second.stderr),
   518	          4000,
   519	          `second launcher stale-heartbeat reclaim (round ${round})`,
   520	        );
   521	
   522	        // The reclaim must actually take effect: the seeded stale holder is gone from the recorded
   523	        // owner lease (a launcher reclaimed it). Once a launcher has reclaimed, the holder must
   524	        // never remain the owner. This is deterministically true (the holder lease is stale).
   525	        await waitFor(
   526	          () => readOwnerLeasePid(workspace.root) !== holder.pid,
   527	          4000,
   528	          `seeded stale holder to be reclaimed out of the owner lease (round ${round})`,
   529	        );
   530	
   531	        // Neither launcher crashed in the reclaim path (no failure log / non-1 exit). The reclaim
   532	        // either elects an owner or bridges; it must never raise an error.
   533	        const reclaimErrored = (run: LauncherRun): boolean =>
   534	          /^\[mk-code-index-launcher\] failed:/m.test(run.stderr) || run.child.exitCode === 1;
   535	        expect(reclaimErrored(first), `first launcher must not error in reclaim (round ${round})`).toBe(false);
   536	        expect(reclaimErrored(second), `second launcher must not error in reclaim (round ${round})`).toBe(false);
   537	
   538	        // And the stale holder never re-asserts ownership after the reclaim.
   539	        expect(readOwnerLeasePid(workspace.root), `seeded stale holder must not own the lease (round ${round})`).not.toBe(holder.pid);
   540	      } finally {

exec
/bin/zsh -lc "rg -n \"function isOwnerLeaseData|isOwnerLeaseData\" .opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts && nl -ba .opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts | sed -n '220,300p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
235:function isOwnerLeaseData(raw: unknown): raw is OwnerLeaseData {
328:    return isOwnerLeaseData(parsed) ? parsed : null;
   220	      }
   221	    }
   222	  }
   223	}
   224	
   225	function isSameOwnerLease(a: OwnerLeaseData, b: OwnerLeaseData): boolean {
   226	  return a.ownerPid === b.ownerPid
   227	    && a.ppid === b.ppid
   228	    && a.executablePath === b.executablePath
   229	    && a.startedAtIso === b.startedAtIso
   230	    && a.lastHeartbeatIso === b.lastHeartbeatIso
   231	    && a.ttlMs === b.ttlMs
   232	    && a.canonicalDbDir === b.canonicalDbDir;
   233	}
   234	
   235	function isOwnerLeaseData(raw: unknown): raw is OwnerLeaseData {
   236	  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return false;
   237	  const candidate = raw as Partial<OwnerLeaseData>;
   238	  return (
   239	    Number.isInteger(candidate.ownerPid) &&
   240	    Number.isInteger(candidate.ppid) &&
   241	    typeof candidate.executablePath === 'string' &&
   242	    typeof candidate.startedAtIso === 'string' &&
   243	    typeof candidate.lastHeartbeatIso === 'string' &&
   244	    Number.isInteger(candidate.ttlMs) &&
   245	    typeof candidate.canonicalDbDir === 'string'
   246	  );
   247	}
   248	
   249	function writeOwnerLeaseAtomic(leasePath: string, data: OwnerLeaseData): void {
   250	  const tempPath = makeTempPath(leasePath);
   251	  try {
   252	    writeFileSync(tempPath, `${JSON.stringify(data, null, 2)}\n`, { encoding: 'utf8', flag: 'wx', mode: 0o600 });
   253	    fsyncPath(tempPath);
   254	    renameSync(tempPath, leasePath);
   255	    try {
   256	      fsyncPath(dirname(leasePath));
   257	    } catch {
   258	      // Directory fsync is best-effort on local filesystems.
   259	    }
   260	  } catch (error) {
   261	    rmSync(tempPath, { force: true });
   262	    throw error;
   263	  }
   264	}
   265	
   266	function writeOwnerLeaseExclusive(leasePath: string, data: OwnerLeaseData): boolean {
   267	  let fd: number | undefined;
   268	  try {
   269	    fd = openSync(leasePath, 'wx', 0o600);
   270	    writeFileSync(fd, `${JSON.stringify(data, null, 2)}\n`, { encoding: 'utf8' });
   271	    fsyncSync(fd);
   272	  } catch (error: unknown) {
   273	    const code = error && typeof error === 'object' && 'code' in error ? (error as NodeJS.ErrnoException).code : undefined;
   274	    if (code === 'EEXIST') {
   275	      return false;
   276	    }
   277	    throw error;
   278	  } finally {
   279	    if (typeof fd === 'number') {
   280	      closeSync(fd);
   281	    }
   282	  }
   283	
   284	  try {
   285	    fsyncPath(dirname(leasePath));
   286	  } catch {
   287	    // Directory fsync is best-effort on local filesystems.
   288	  }
   289	  return true;
   290	}
   291	
   292	function getProcessLiveness(
   293	  pid: number,
   294	  processKill: (pid: number, signal: 0) => boolean = process.kill,
   295	): 'alive' | 'dead' | 'unknown-eperm' {
   296	  if (!Number.isInteger(pid) || pid <= 0) return 'dead';
   297	
   298	  try {
   299	    processKill(pid, 0);
   300	    return 'alive';

exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-skill-advisor-launcher.cjs | sed -n '640,825p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   640	  if (Number.isInteger(lease?.childPid) && lease.childPid > 0) return lease.childPid;
   641	  return Number.isInteger(leaseResult.ownerPid) && leaseResult.ownerPid > 0 ? leaseResult.ownerPid : null;
   642	}
   643	
   644	function socketPathUsable(socketPath) {
   645	  return typeof socketPath === 'string'
   646	    && socketPath.length > 0
   647	    && (socketPath.startsWith('tcp://') || fs.existsSync(socketPath));
   648	}
   649	
   650	function scheduleBootstrapReap(pid) {
   651	  if (Number.isInteger(pid) && pid > 0) {
   652	    pendingBootstrapReapPid = pid;
   653	  }
   654	}
   655	
   656	async function respawnAfterDeadSocket(leaseResult, decision) {
   657	  if (process.env.SPECKIT_BRIDGE_RESPAWN_DISABLED === '1') {
   658	    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
   659	    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
   660	  }
   661	
   662	  const targetPid = resolveRespawnTargetPid(leaseResult);
   663	  if (!Number.isInteger(targetPid) || targetPid <= 0) {
   664	    log('confirmed-dead socket but no recorded skill-advisor daemon pid is available; respawn inert');
   665	    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-daemon-pid)');
   666	    return { action: 'report', reason: 'missing-daemon-pid', socketPath: decision.socketPath };
   667	  }
   668	
   669	  let bootstrapLockHeld = false;
   670	  try {
   671	    bootstrapLockHeld = await acquireBootstrapLock();
   672	    const currentLease = readLeaseFile(leaseResult.legacyPath || leasePath());
   673	    const currentTargetPid = Number.isInteger(currentLease?.childPid) && currentLease.childPid > 0
   674	      ? currentLease.childPid
   675	      : leaseResult.ownerPid;
   676	    if (Number.isInteger(currentTargetPid) && currentTargetPid > 0 && currentTargetPid !== targetPid) {
   677	      log('dead-socket respawn skipped; skill-advisor launcher lease changed while waiting for bootstrap lock');
   678	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
   679	      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
   680	    }
   681	
   682	    const previousOwner = readOwnerLeaseFile();
   683	    const expectedExecutablePath = previousOwner?.ownerPid === targetPid ? previousOwner.executablePath : null;
   684	    const reapResult = await reapOwnerBeforeRespawn(targetPid, expectedExecutablePath);
   685	    if (!reapResult.allowed) {
   686	      log(`dead-socket respawn skipped; ${reapResult.reason} for daemonPid=${targetPid}`);
   687	      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
   688	      return { action: 'report', reason: reapResult.reason, socketPath: decision.socketPath };
   689	    }
   690	
   691	    if (previousOwner?.ownerPid && previousOwner.ownerPid !== process.pid) {
   692	      await waitForPidExit(previousOwner.ownerPid, RESPAWN_REAP_GRACE_MS + 1000);
   693	      if (processLiveness(previousOwner.ownerPid) === 'dead') {
   694	        clearOwnerLeaseFileIfOwner(previousOwner.ownerPid);
   695	      }
   696	    }
   697	    clearOwnerLeaseFileIfOwner(targetPid);
   698	    if (ownsOwnerLeaseFile(process.pid)) {
   699	      clearOwnerLeaseFile();
   700	    }
   701	
   702	    const ownerLease = buildOwnerLease(process.pid);
   703	    if (!writeOwnerLeaseFileExclusive(ownerLease)) {
   704	      const holder = readOwnerLeaseFile();
   705	      log(`dead-socket respawn skipped; another launcher owns skill-advisor owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
   706	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
   707	      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
   708	    }
   709	    ownerLeasePid = process.pid;
   710	    startOwnerLeaseHeartbeat(process.pid);
   711	
   712	    buildIfNeeded([]);
   713	    leaseStartedAt = new Date().toISOString();
   714	    writeLeaseFile();
   715	    const launched = launchServer();
   716	    return launched
   717	      ? { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath }
   718	      : { action: 'report', reason: 'launch-skipped', socketPath: decision.socketPath };
   719	  } finally {
   720	    if (bootstrapLockHeld) {
   721	      fs.rmSync(lockDir, { recursive: true, force: true });
   722	    }
   723	  }
   724	}
   725	
   726	function leaseResultForOwnerLease(ownerLease) {
   727	  const launcherLease = leaseHeldFromFile();
   728	  if (launcherLease.held && launcherLease.ownerPid === ownerLease.ownerPid) {
   729	    return launcherLease;
   730	  }
   731	  return {
   732	    held: true,
   733	    ownerPid: ownerLease.ownerPid,
   734	    staleReclaimable: false,
   735	    startedAt: ownerLease.startedAtIso,
   736	    legacyPath: null,
   737	    socketPath: null,
   738	  };
   739	}
   740	
   741	async function bridgeOrReportLeaseHeld(leaseResult) {
   742	  const { maybeBridgeLeaseHolder } = loadBridgeModule();
   743	  const decision = await maybeBridgeLeaseHolder({
   744	    serviceName: 'mk-skill-advisor',
   745	    leaseResult,
   746	    loggerPrefix: 'mk-skill-advisor-launcher',
   747	    dbDir: resolvedAdvisorDbDir(),
   748	    bridge: bridgeStdioThroughSessionProxy,
   749	    legacyReport: reportLeaseHeld,
   750	  });
   751	  if (decision && decision.action === 'respawn') {
   752	    return await respawnAfterDeadSocket(leaseResult, decision);
   753	  }
   754	  return decision;
   755	}
   756	
   757	async function checkStrictSingleWriter() {
   758	  const ownerLeaseResult = acquireOwnerLeaseFile();
   759	  if (!ownerLeaseResult.acquired) {
   760	    log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
   761	    await bridgeOrReportLeaseHeld(leaseResultForOwnerLease(ownerLeaseResult.holder));
   762	    return true;
   763	  }
   764	  startOwnerLeaseHeartbeat(process.pid);
   765	
   766	  const launcherLease = leaseHeldFromFile();
   767	  if (launcherLease.held && !launcherLease.staleReclaimable) {
   768	    clearOwnerLeaseFile();
   769	    await bridgeOrReportLeaseHeld(launcherLease);
   770	    return true;
   771	  }
   772	  if (launcherLease.staleReclaimable) {
   773	    log('staleReclaimed: true');
   774	    const staleLease = readLeaseFile();
   775	    const staleChildPid = Number.isInteger(staleLease?.childPid) && staleLease.childPid > 0
   776	      ? staleLease.childPid
   777	      : null;
   778	    if (staleChildPid && processLiveness(staleChildPid) !== 'dead') {
   779	      const staleChildLeaseResult = {
   780	        held: true,
   781	        ownerPid: staleChildPid,
   782	        staleReclaimable: false,
   783	        startedAt: staleLease.startedAt ?? new Date(0).toISOString(),
   784	        legacyPath: null,
   785	        socketPath: typeof staleLease.socketPath === 'string' ? staleLease.socketPath : null,
   786	      };
   787	      if (socketPathUsable(staleChildLeaseResult.socketPath)) {
   788	        const decision = await bridgeOrReportLeaseHeld(staleChildLeaseResult);
   789	        if (decision?.action === 'bridge' || decision?.action === 'respawn') {
   790	          return true;
   791	        }
   792	        if (decision?.reason !== 'no-bridge-socket') {
   793	          clearOwnerLeaseFile();
   794	          return true;
   795	        }
   796	      }
   797	      scheduleBootstrapReap(staleChildPid);
   798	      log(`stale launcher lease recorded live childPid=${staleChildPid}; deferring reap until bootstrap lock is held`);
   799	    } else if (staleChildPid) {
   800	      scheduleBootstrapReap(staleChildPid);
   801	    }
   802	  }
   803	
   804	  try {
   805	    const daemonLeasePath = path.join(mcpDir, 'dist', 'mcp_server', 'lib', 'daemon', 'lease.js');
   806	    const leaseModule = require(daemonLeasePath);
   807	    const leaseResult = leaseModule.isLeaseHeld(root);
   808	    const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
   809	    if (leaseResult.held && !leaseResult.staleReclaimable) {
   810	      clearOwnerLeaseFile();
   811	      await bridgeOrReportLeaseHeld(leaseResult);
   812	      return true;
   813	    }
   814	    if (leaseResult.staleReclaimable) {
   815	      log(`staleReclaimed: true${legacyMarker ? ' (legacy path)' : ''}`);
   816	    }
   817	  } catch (error) {
   818	    if (error.code !== 'MODULE_NOT_FOUND') {
   819	      log(`daemon lease check failed: ${error.message}`);
   820	    }
   821	  }
   822	
   823	  return false;
   824	}
   825	

exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-spec-memory-launcher.cjs | sed -n '780,880p' && nl -ba .opencode/bin/mk-spec-memory-launcher.cjs | sed -n '1630,1725p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   780	
   781	  log(`confirmed-dead socket; reaping recorded spec-memory owner pid ${ownerPid} before respawn`);
   782	  signalProcess(ownerPid, 'SIGTERM');
   783	  const exitedAfterTerm = await waitForPidExit(ownerPid, RESPAWN_REAP_GRACE_MS);
   784	  if (!exitedAfterTerm) {
   785	    log(`spec-memory owner pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
   786	    signalProcess(ownerPid, 'SIGKILL');
   787	    await waitForPidExit(ownerPid, 1000);
   788	  }
   789	  return { allowed: true, reason: 'owner-reaped' };
   790	}
   791	
   792	async function respawnAfterDeadSocket(leaseResult, decision) {
   793	  if (process.env.SPECKIT_BRIDGE_RESPAWN_DISABLED === '1') {
   794	    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
   795	    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
   796	  }
   797	
   798	  const ownerPid = leaseResult.ownerPid;
   799	  if (!Number.isInteger(ownerPid) || ownerPid <= 0) {
   800	    log('confirmed-dead socket but no recorded spec-memory owner pid is available; respawn inert');
   801	    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-owner-pid)');
   802	    return { action: 'report', reason: 'missing-owner-pid', socketPath: decision.socketPath };
   803	  }
   804	
   805	  const lease = readLeaseFile(leaseResult.legacyPath || leasePath());
   806	  const childPid = lease?.childPid;
   807	  if (!Number.isInteger(childPid) || childPid <= 0) {
   808	    log('confirmed-dead socket but lease has no childPid; child-pid gate keeps respawn inert');
   809	    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-child-pid)');
   810	    return { action: 'report', reason: 'missing-child-pid', socketPath: decision.socketPath };
   811	  }
   812	
   813	  // A daemon mid-maintenance (e.g. a background index scan) legitimately fails the
   814	  // deep liveness probe because its event loop is busy, not dead. If it holds a
   815	  // fresh marker naming this exact live child, refuse the respawn and leave it
   816	  // running. The marker lapses if the daemon is genuinely wedged (it can no longer
   817	  // refresh it), so a real death still respawns once the marker expires. Checked
   818	  // before the respawn lock and any reap so a bail unwinds nothing.
   819	  const deadSocketMarker = readMaintenanceMarker(maintenanceMarkerDir());
   820	  if (shouldAdoptDespiteProbe({ marker: deadSocketMarker, childPid, childLiveness: processLiveness(childPid) })) {
   821	    log(`confirmed-dead socket but child pid ${childPid} holds a fresh maintenance marker (activeUntil ${new Date(deadSocketMarker.activeUntilMs).toISOString()}); refusing respawn (busy, not dead)`);
   822	    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-maintenance-active)');
   823	    return { action: 'report', reason: 'maintenance-active', socketPath: decision.socketPath };
   824	  }
   825	
   826	  let bootstrapLockHeld = false;
   827	  let respawnLock = null;
   828	  try {
   829	    bootstrapLockHeld = await acquireBootstrapLock({ requireLock: true });
   830	    respawnLock = acquireRespawnLockFile();
   831	    if (!respawnLock.acquired) {
   832	      log(`dead-socket respawn skipped; another launcher owns ${rel(respawnLock.path)}`);
   833	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
   834	      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
   835	    }
   836	
   837	    const currentOwner = readOwnerLeaseFile();
   838	    if (currentOwner?.ownerPid !== ownerPid) {
   839	      log('dead-socket respawn skipped; spec-memory owner lease changed while waiting for respawn lock');
   840	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
   841	      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
   842	    }
   843	
   844	    const currentLease = readLeaseFile(leaseResult.legacyPath || leasePath());
   845	    if (currentLease?.pid !== leaseResult.ownerPid || currentLease?.childPid !== childPid) {
   846	      log('dead-socket respawn skipped; lease changed while waiting for respawn lock');
   847	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
   848	      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
   849	    }
   850	
   851	    const ownerReapResult = await reapOwnerBeforeRespawn(ownerPid);
   852	    if (!ownerReapResult.allowed) {
   853	      log(`dead-socket respawn skipped; ${ownerReapResult.reason} for ownerPid=${ownerPid}`);
   854	      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${ownerReapResult.reason})`);
   855	      return { action: 'report', reason: ownerReapResult.reason, socketPath: decision.socketPath };
   856	    }
   857	
   858	    clearOwnerLeaseFileIfOwner(ownerPid);
   859	    const ownerLease = buildOwnerLease(process.pid);
   860	    if (!writeOwnerLeaseFileExclusive(ownerLease)) {
   861	      const holder = readOwnerLeaseFile();
   862	      log(`dead-socket respawn skipped; another launcher owns spec-memory owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
   863	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
   864	      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
   865	    }
   866	    ownerLeasePid = process.pid;
   867	
   868	    const reapResult = await reapLeaseChildBeforeRespawn(childPid);
   869	    if (!reapResult.allowed) {
   870	      log(`dead-socket respawn skipped; ${reapResult.reason} for childPid=${childPid}`);
   871	      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
   872	      return { action: 'report', reason: reapResult.reason, socketPath: decision.socketPath };
   873	    }
   874	
   875	    buildIfNeeded([]);
   876	    leaseStartedAt = new Date().toISOString();
   877	    writeLeaseFile();
   878	    launchServer();
   879	    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
   880	  } finally {
  1630	    if (strictSingleWriter) {
  1631	      const ownerLeaseResult = acquireOwnerLeaseFile();
  1632	      if (!ownerLeaseResult.acquired) {
  1633	        log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
  1634	        await bridgeOrReportLeaseHeldAndExit(leaseResultForOwnerLease(ownerLeaseResult.holder));
  1635	        return;
  1636	      }
  1637	
  1638	      const leaseResult = isLeaseHeld();
  1639	      if (leaseResult.held && !leaseResult.staleReclaimable) {
  1640	        clearOwnerLeaseFile();
  1641	        await bridgeOrReportLeaseHeldAndExit(leaseResult);
  1642	        return;
  1643	      }
  1644	      if (leaseResult.staleReclaimable) {
  1645	        log(`staleReclaimed: true${leaseResult.legacyPath ? ' (legacy path)' : ''}`);
  1646	        // A re-election daemon released by a disposing owner (or orphaned by a crashed owner) stays
  1647	        // alive under this stale lease, which records the live daemon as childPid. ADOPT it: if the
  1648	        // daemon is still alive and its recorded socket is bridgeable, bridge to the live socket
  1649	        // instead of reaping and respawning. This reuses the warm daemon and never tears down a
  1650	        // daemon a live secondary may still be bridged to. The reap+respawn path below runs only
  1651	        // when the daemon is genuinely gone.
  1652	        const staleLease = readLeaseFile(leaseResult.legacyPath || leasePath());
  1653	        const orphanChildPid = staleLease?.childPid;
  1654	        if (Number.isInteger(orphanChildPid) && orphanChildPid > 0 && processLiveness(orphanChildPid) !== 'dead') {
  1655	          const adoptResult = { ...leaseResult, socketPath: staleLease.socketPath || leaseResult.socketPath };
  1656	          const readiness = bridgeReadiness(adoptResult);
  1657	          if (readiness.ready) {
  1658	            // A live pid that still owns its socket can be WEDGED: its event loop is starved, so the
  1659	            // kernel accepts the connection into the listen backlog but the daemon never services a
  1660	            // request. bridgeReadiness only proves the socket file exists — adopting on that alone
  1661	            // bridges every client into a dead end, and the launcher can never recover because the pid
  1662	            // stays alive forever and is never reaped. Require a real JSON-RPC reply (the same deep
  1663	            // probe the dead-socket decision uses, with its tuned timeout + retry that tolerates a
  1664	            // busy-but-responsive daemon) before adopting. A non-responsive daemon falls through to the
  1665	            // reap+respawn block below, which tears it down and spawns a fresh one under the lock.
  1666	            const { probeLeaseHolderWithRetries } = loadBridgeModule();
  1667	            let probe;
  1668	            try {
  1669	              probe = await probeLeaseHolderWithRetries(readiness.socketPath, {
  1670	                onRetry: (attempt, total, result) => log(`stale-reclaim adopt probe ${attempt}/${total} not alive (${result.reason}); retrying`),
  1671	              });
  1672	            } catch (error) {
  1673	              // The probe resolves to a status even on socket failure; a thrown error means the probe
  1674	              // infrastructure itself failed. Treat that as not-alive so control falls through to
  1675	              // reap+respawn, rather than letting the exception abort startup and strand the daemon.
  1676	              probe = { status: 'dead', reason: `probe-threw: ${error instanceof Error ? error.message : String(error)}` };
  1677	            }
  1678	            if (probe.status === 'alive') {
  1679	              log(`stale-reclaim adopting live daemon pid ${orphanChildPid} via bridge instead of reaping`);
  1680	              clearOwnerLeaseFile();
  1681	              await bridgeOrReportLeaseHeldAndExit(adoptResult);
  1682	              return;
  1683	            }
  1684	            // The probe can fail because the daemon is busy-by-design (a background
  1685	            // index scan starves its event loop), not wedged. A fresh maintenance
  1686	            // marker naming this live child means adopt rather than reap+respawn.
  1687	            const adoptMarker = readMaintenanceMarker(maintenanceMarkerDir());
  1688	            if (shouldAdoptDespiteProbe({ marker: adoptMarker, childPid: orphanChildPid, childLiveness: processLiveness(orphanChildPid) })) {
  1689	              log(`stale-reclaim adopting busy daemon pid ${orphanChildPid} via bridge: probe failed (${probe.reason}) but a fresh maintenance marker is active (until ${new Date(adoptMarker.activeUntilMs).toISOString()})`);
  1690	              clearOwnerLeaseFile();
  1691	              await bridgeOrReportLeaseHeldAndExit(adoptResult);
  1692	              return;
  1693	            }
  1694	            log(`stale-reclaim NOT adopting pid ${orphanChildPid}: liveness probe failed (${probe.reason}); reaping and respawning instead`);
  1695	          }
  1696	        }
  1697	        // Daemon is dead, unbridgeable, or alive but failing its liveness probe. Reclaiming an existing STALE owner lease is a
  1698	        // non-exclusive write (the owner-lease O_EXCL above only covers the no-prior-lease case), so
  1699	        // two fresh launchers racing a crashed owner could both reach the reap and spawn. Take the
  1700	        // exclusive respawn lock to serialize it, the same lock the dead-socket respawn path uses;
  1701	        // the loser bails and reconnects.
  1702	        staleRespawnLock = acquireRespawnLockFile();
  1703	        if (!staleRespawnLock.acquired) {
  1704	          log('stale-reclaim deferred: another launcher holds the respawn lock; reporting lease held');
  1705	          clearOwnerLeaseFile();
  1706	          writeLeaseHeldJsonRpcError(leaseResult, 'respawn-lock-held');
  1707	          process.exit(0);
  1708	        }
  1709	        if (Number.isInteger(orphanChildPid) && orphanChildPid > 0) {
  1710	          // Re-validate under the respawn lock. The liveness probe above can take seconds, during which
  1711	          // a racing launcher may have reaped this same orphan and spawned a fresh daemon (recording a
  1712	          // new childPid) before we acquired the lock. Reaping now would tear down that replacement and
  1713	          // risk a second writer, so if the recorded lease no longer names the orphan we snapshotted,
  1714	          // defer and reconnect. Mirrors the dead-socket respawn path's post-lock lease re-read.
  1715	          const recheckLease = readLeaseFile(leaseResult.legacyPath || leasePath());
  1716	          if (recheckLease && recheckLease.childPid !== orphanChildPid) {
  1717	            log('stale-reclaim deferred: lease childPid changed after acquiring respawn lock (replacement already present); reporting lease held');
  1718	            releaseRespawnLockFile(staleRespawnLock);
  1719	            staleRespawnLock = null;
  1720	            clearOwnerLeaseFile();
  1721	            writeLeaseHeldJsonRpcError(leaseResult, 'respawn-superseded');
  1722	            process.exit(0);
  1723	          }
  1724	          const reap = await reapLeaseChildBeforeRespawn(orphanChildPid);
  1725	          if (!reap.allowed) {

exec
/bin/zsh -lc 'rg -n "socketReadyForBridge|no-bridge-socket|dead-socket|respawn" .opencode/bin/mk-spec-memory-launcher.cjs .opencode/bin/mk-skill-advisor-launcher.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/bin/mk-skill-advisor-launcher.cjs:163:        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker} (no-bridge-socket)\n`);
.opencode/bin/mk-skill-advisor-launcher.cjs:445:  log(`confirmed-dead socket; reaping recorded skill-advisor daemon pid ${ownerPid} before respawn`);
.opencode/bin/mk-skill-advisor-launcher.cjs:656:async function respawnAfterDeadSocket(leaseResult, decision) {
.opencode/bin/mk-skill-advisor-launcher.cjs:658:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
.opencode/bin/mk-skill-advisor-launcher.cjs:659:    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:664:    log('confirmed-dead socket but no recorded skill-advisor daemon pid is available; respawn inert');
.opencode/bin/mk-skill-advisor-launcher.cjs:665:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-daemon-pid)');
.opencode/bin/mk-skill-advisor-launcher.cjs:677:      log('dead-socket respawn skipped; skill-advisor launcher lease changed while waiting for bootstrap lock');
.opencode/bin/mk-skill-advisor-launcher.cjs:678:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
.opencode/bin/mk-skill-advisor-launcher.cjs:679:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:686:      log(`dead-socket respawn skipped; ${reapResult.reason} for daemonPid=${targetPid}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:687:      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
.opencode/bin/mk-skill-advisor-launcher.cjs:705:      log(`dead-socket respawn skipped; another launcher owns skill-advisor owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:706:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-skill-advisor-launcher.cjs:707:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:717:      ? { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath }
.opencode/bin/mk-skill-advisor-launcher.cjs:751:  if (decision && decision.action === 'respawn') {
.opencode/bin/mk-skill-advisor-launcher.cjs:752:    return await respawnAfterDeadSocket(leaseResult, decision);
.opencode/bin/mk-skill-advisor-launcher.cjs:789:        if (decision?.action === 'bridge' || decision?.action === 'respawn') {
.opencode/bin/mk-skill-advisor-launcher.cjs:792:        if (decision?.reason !== 'no-bridge-socket') {
.opencode/bin/mk-skill-advisor-launcher.cjs:1284:        // and spawn share one serialization point without a separate respawn lock.
.opencode/bin/mk-spec-memory-launcher.cjs:202:// it reaps and respawns only when that daemon is dead or unbridgeable, so the database keeps a single
.opencode/bin/mk-spec-memory-launcher.cjs:270:        const suffix = process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1' ? '' : ' (no-bridge-socket)';
.opencode/bin/mk-spec-memory-launcher.cjs:639:    return { ready: false, reason: 'no-bridge-socket' };
.opencode/bin/mk-spec-memory-launcher.cjs:659:function respawnLockPath() {
.opencode/bin/mk-spec-memory-launcher.cjs:660:  return path.join(resolvedDbDir(), '.mk-spec-memory-respawn.lock');
.opencode/bin/mk-spec-memory-launcher.cjs:667:function acquireRespawnLockFileAt(lockPath, label = 'respawn') {
.opencode/bin/mk-spec-memory-launcher.cjs:672:  return acquireRespawnLockFileAt(respawnLockPath(), 'respawn');
.opencode/bin/mk-spec-memory-launcher.cjs:730:  log(`reaping recorded context-server child pid ${childPid} before respawn`);
.opencode/bin/mk-spec-memory-launcher.cjs:744:      log(`context-server child pid ${childPid} did not exit after SIGKILL within grace; refusing respawn`);
.opencode/bin/mk-spec-memory-launcher.cjs:752:  // shadow. We never block respawn on this: a missing daemon is worse than a self-healing one.
.opencode/bin/mk-spec-memory-launcher.cjs:781:  log(`confirmed-dead socket; reaping recorded spec-memory owner pid ${ownerPid} before respawn`);
.opencode/bin/mk-spec-memory-launcher.cjs:792:async function respawnAfterDeadSocket(leaseResult, decision) {
.opencode/bin/mk-spec-memory-launcher.cjs:794:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
.opencode/bin/mk-spec-memory-launcher.cjs:795:    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:800:    log('confirmed-dead socket but no recorded spec-memory owner pid is available; respawn inert');
.opencode/bin/mk-spec-memory-launcher.cjs:801:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-owner-pid)');
.opencode/bin/mk-spec-memory-launcher.cjs:808:    log('confirmed-dead socket but lease has no childPid; child-pid gate keeps respawn inert');
.opencode/bin/mk-spec-memory-launcher.cjs:809:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-child-pid)');
.opencode/bin/mk-spec-memory-launcher.cjs:815:  // fresh marker naming this exact live child, refuse the respawn and leave it
.opencode/bin/mk-spec-memory-launcher.cjs:817:  // refresh it), so a real death still respawns once the marker expires. Checked
.opencode/bin/mk-spec-memory-launcher.cjs:818:  // before the respawn lock and any reap so a bail unwinds nothing.
.opencode/bin/mk-spec-memory-launcher.cjs:821:    log(`confirmed-dead socket but child pid ${childPid} holds a fresh maintenance marker (activeUntil ${new Date(deadSocketMarker.activeUntilMs).toISOString()}); refusing respawn (busy, not dead)`);
.opencode/bin/mk-spec-memory-launcher.cjs:822:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-maintenance-active)');
.opencode/bin/mk-spec-memory-launcher.cjs:827:  let respawnLock = null;
.opencode/bin/mk-spec-memory-launcher.cjs:830:    respawnLock = acquireRespawnLockFile();
.opencode/bin/mk-spec-memory-launcher.cjs:831:    if (!respawnLock.acquired) {
.opencode/bin/mk-spec-memory-launcher.cjs:832:      log(`dead-socket respawn skipped; another launcher owns ${rel(respawnLock.path)}`);
.opencode/bin/mk-spec-memory-launcher.cjs:833:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-spec-memory-launcher.cjs:834:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:839:      log('dead-socket respawn skipped; spec-memory owner lease changed while waiting for respawn lock');
.opencode/bin/mk-spec-memory-launcher.cjs:840:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
.opencode/bin/mk-spec-memory-launcher.cjs:841:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:846:      log('dead-socket respawn skipped; lease changed while waiting for respawn lock');
.opencode/bin/mk-spec-memory-launcher.cjs:847:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
.opencode/bin/mk-spec-memory-launcher.cjs:848:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:853:      log(`dead-socket respawn skipped; ${ownerReapResult.reason} for ownerPid=${ownerPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:854:      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${ownerReapResult.reason})`);
.opencode/bin/mk-spec-memory-launcher.cjs:862:      log(`dead-socket respawn skipped; another launcher owns spec-memory owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-spec-memory-launcher.cjs:863:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-spec-memory-launcher.cjs:864:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:870:      log(`dead-socket respawn skipped; ${reapResult.reason} for childPid=${childPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:871:      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
.opencode/bin/mk-spec-memory-launcher.cjs:879:    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:881:    releaseRespawnLockFile(respawnLock);
.opencode/bin/mk-spec-memory-launcher.cjs:902:  if (decision && decision.action === 'respawn') {
.opencode/bin/mk-spec-memory-launcher.cjs:903:    return await respawnAfterDeadSocket(leaseResult, decision);
.opencode/bin/mk-spec-memory-launcher.cjs:979:      // Corrupt pid files are treated like absent pid files; the respawn lock still serializes recovery.
.opencode/bin/mk-spec-memory-launcher.cjs:1232:  // lease is keyed on its (still-live) pid, so the replacement daemon is respawned by the child
.opencode/bin/mk-spec-memory-launcher.cjs:1303:// BOOTSTRAP_LOCK_STALE_MS ago wedges every requireLock respawn for the full wait
.opencode/bin/mk-spec-memory-launcher.cjs:1649:        // instead of reaping and respawning. This reuses the warm daemon and never tears down a
.opencode/bin/mk-spec-memory-launcher.cjs:1650:        // daemon a live secondary may still be bridged to. The reap+respawn path below runs only
.opencode/bin/mk-spec-memory-launcher.cjs:1663:            // probe the dead-socket decision uses, with its tuned timeout + retry that tolerates a
.opencode/bin/mk-spec-memory-launcher.cjs:1665:            // reap+respawn block below, which tears it down and spawns a fresh one under the lock.
.opencode/bin/mk-spec-memory-launcher.cjs:1675:              // reap+respawn, rather than letting the exception abort startup and strand the daemon.
.opencode/bin/mk-spec-memory-launcher.cjs:1686:            // marker naming this live child means adopt rather than reap+respawn.
.opencode/bin/mk-spec-memory-launcher.cjs:1694:            log(`stale-reclaim NOT adopting pid ${orphanChildPid}: liveness probe failed (${probe.reason}); reaping and respawning instead`);
.opencode/bin/mk-spec-memory-launcher.cjs:1700:        // exclusive respawn lock to serialize it, the same lock the dead-socket respawn path uses;
.opencode/bin/mk-spec-memory-launcher.cjs:1704:          log('stale-reclaim deferred: another launcher holds the respawn lock; reporting lease held');
.opencode/bin/mk-spec-memory-launcher.cjs:1706:          writeLeaseHeldJsonRpcError(leaseResult, 'respawn-lock-held');
.opencode/bin/mk-spec-memory-launcher.cjs:1710:          // Re-validate under the respawn lock. The liveness probe above can take seconds, during which
.opencode/bin/mk-spec-memory-launcher.cjs:1714:          // defer and reconnect. Mirrors the dead-socket respawn path's post-lock lease re-read.
.opencode/bin/mk-spec-memory-launcher.cjs:1717:            log('stale-reclaim deferred: lease childPid changed after acquiring respawn lock (replacement already present); reporting lease held');
.opencode/bin/mk-spec-memory-launcher.cjs:1721:            writeLeaseHeldJsonRpcError(leaseResult, 'respawn-superseded');
.opencode/bin/mk-spec-memory-launcher.cjs:1766:    // Reap + spawn critical section is over; let other respawn paths proceed.

codex
The code-index launcher is behind the other launchers in this exact area: spec-memory carries child-pid and respawn-lock safeguards around dead-socket recovery; code-index’s current PID lease has no child pid, so part of the proposed recovery path has nowhere to stand.
exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts | sed -n '1,100p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	import { chmodSync, existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
     2	import { tmpdir } from 'node:os';
     3	import { join } from 'node:path';
     4	import { afterEach, describe, expect, it } from 'vitest';
     5	
     6	import { startIpcSocketServer } from '../../lib/ipc/socket-server.js';
     7	
     8	const tempDirs: string[] = [];
     9	
    10	function tempRoot(prefix: string): string {
    11	  const dir = mkdtempSync(join(tmpdir(), prefix));
    12	  tempDirs.push(dir);
    13	  return dir;
    14	}
    15	
    16	afterEach(() => {
    17	  delete process.env.SPECKIT_IPC_SOCKET_DIR;
    18	  while (tempDirs.length > 0) {
    19	    const dir = tempDirs.pop();
    20	    if (dir) rmSync(dir, { recursive: true, force: true });
    21	  }
    22	});
    23	
    24	describe('Code Graph B3 security hardening', () => {
    25	  it('refuses to unlink an existing non-socket IPC path', async () => {
    26	    const rootLocalDir = mkdtempSync(join(process.cwd(), '.opencode', '.tmp-ipc-'));
    27	    tempDirs.push(rootLocalDir);
    28	    const socketPath = join(rootLocalDir, 'daemon-ipc.sock');
    29	    writeFileSync(socketPath, 'not a socket', 'utf8');
    30	
    31	    await expect(
    32	      startIpcSocketServer({
    33	        socketPath,
    34	        createServer: () => {
    35	          throw new Error('server should not be created');
    36	        },
    37	        log: () => undefined,
    38	      }),
    39	    ).rejects.toMatchObject({ code: expect.stringMatching(/^(EADDRINUSE|EINVAL)$/) }); // listen() on a non-socket rejects EADDRINUSE on Linux, EINVAL on macOS — either proves the bind was refused, not unlinked
    40	
    41	    expect(existsSync(socketPath)).toBe(true);
    42	  });
    43	
    44	  it.skipIf(typeof process.getuid !== 'function')(
    45	    'DR-008-01: refuses to bind under a group/world-writable socket dir',
    46	    async () => {
    47	      const dir = tempRoot('cg-ipc-perms-');
    48	      chmodSync(dir, 0o777); // pre-existing dir the mkdir mode:0o700 cannot tighten
    49	      const socketPath = join(dir, 'daemon-ipc.sock');
    50	
    51	      await expect(
    52	        startIpcSocketServer({
    53	          socketPath,
    54	          createServer: () => {
    55	            throw new Error('server should not be created');
    56	          },
    57	          log: () => undefined,
    58	        }),
    59	      ).rejects.toThrow(/group\/world-writable/);
    60	
    61	      expect(existsSync(socketPath)).toBe(false);
    62	    },
    63	  );
    64	});

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/tests/lib/ipc-socket-toctou.vitest.ts | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: IPC socket bind TOCTOU race regression
     3	// ───────────────────────────────────────────────────────────────
     4	// Under N-way primary contention a daemon hits EADDRINUSE on a socket
     5	// path another primary owns, then races to reclaim it. The stale-socket
     6	// node can vanish (ENOENT) between the EADDRINUSE failure and the
     7	// lstat/unlink reclaim (a TOCTOU window). The bind must treat that
     8	// vanished node as reclaimable and re-bind — never throw-to-abort and
     9	// orphan the socket. These tests drive the REAL EADDRINUSE -> reclaim
    10	// path (a genuine pre-bound UNIX socket), not a regular file, so they do
    11	// not depend on the macOS/Node listen()-on-a-file EINVAL quirk.
    12	
    13	import fs from 'node:fs';
    14	import net from 'node:net';
    15	import { mkdtempSync, rmSync } from 'node:fs';
    16	import { tmpdir } from 'node:os';
    17	import { join } from 'node:path';
    18	
    19	import { Server } from '@modelcontextprotocol/sdk/server/index.js';
    20	import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
    21	import { afterEach, describe, expect, it, vi } from 'vitest';
    22	
    23	import {
    24	  startIpcSocketServer,
    25	  type IpcSocketServerHandle,
    26	} from '../../lib/ipc/socket-server.js';
    27	
    28	const tempDirs: string[] = [];
    29	const stalePreBinds: net.Server[] = [];
    30	const handles: IpcSocketServerHandle[] = [];
    31	const clients: net.Socket[] = [];
    32	
    33	function tempRoot(prefix: string): string {
    34	  // os.tmpdir() resolves inside an allowed socket root on every supported host.
    35	  const dir = mkdtempSync(join(tmpdir(), prefix));
    36	  tempDirs.push(dir);
    37	  return dir;
    38	}
    39	
    40	// Bind a real raw UNIX socket and leave it listening so a subsequent startIpcSocketServer on the
    41	// same path hits a genuine EADDRINUSE (the real reclaim trigger), not a regular-file EINVAL.
    42	async function preBindStaleSocket(socketPath: string): Promise<net.Server> {
    43	  const server = net.createServer();
    44	  stalePreBinds.push(server);
    45	  await new Promise<void>((resolve, reject) => {
    46	    server.once('error', reject);
    47	    server.once('listening', resolve);
    48	    server.listen(socketPath);
    49	  });
    50	  return server;
    51	}
    52	
    53	function makeServer(): Server {
    54	  const server = new Server(
    55	    { name: 'ipc-toctou-test', version: '0.0.0' },
    56	    { capabilities: { tools: {} } },
    57	  );
    58	  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [] }));
    59	  return server;
    60	}
    61	
    62	async function connect(socketPath: string): Promise<net.Socket> {
    63	  const socket = net.createConnection({ path: socketPath });
    64	  clients.push(socket);
    65	  await new Promise<void>((resolve, reject) => {
    66	    socket.once('connect', resolve);
    67	    socket.once('error', reject);
    68	  });
    69	  return socket;
    70	}
    71	
    72	async function readLine(socket: net.Socket): Promise<string> {
    73	  return await new Promise<string>((resolve, reject) => {
    74	    let buffer = '';
    75	    const onData = (chunk: Buffer) => {
    76	      buffer += chunk.toString('utf8');
    77	      const index = buffer.indexOf('\n');
    78	      if (index === -1) return;
    79	      socket.off('data', onData);
    80	      resolve(buffer.slice(0, index));
    81	    };
    82	    socket.on('data', onData);
    83	    socket.once('error', reject);
    84	  });
    85	}
    86	
    87	afterEach(async () => {
    88	  vi.restoreAllMocks();
    89	  while (clients.length > 0) clients.pop()?.destroy();
    90	  while (handles.length > 0) await handles.pop()?.close();
    91	  while (stalePreBinds.length > 0) {
    92	    const server = stalePreBinds.pop();
    93	    if (server) await new Promise<void>((resolve) => server.close(() => resolve()));
    94	  }
    95	  while (tempDirs.length > 0) {
    96	    const dir = tempDirs.pop();
    97	    if (dir) rmSync(dir, { recursive: true, force: true });
    98	  }
    99	});
   100	
   101	describe('IPC socket bind TOCTOU race', () => {
   102	  it('reclaims a real stale UNIX socket on EADDRINUSE and the survivor serves', async () => {
   103	    const dir = tempRoot('cg-toctou-reclaim-');
   104	    const socketPath = join(dir, 'daemon-ipc.sock');
   105	    // A genuine pre-bound, same-uid socket node: the fence permits the unlink and the bind reclaims.
   106	    await preBindStaleSocket(socketPath);
   107	
   108	    const handle = await startIpcSocketServer({
   109	      socketPath,
   110	      createServer: makeServer,
   111	      log: () => undefined,
   112	    });
   113	    handles.push(handle);
   114	
   115	    const client = await connect(socketPath);
   116	    client.write('{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}\n');
   117	    const response = await readLine(client);
   118	    expect(response).toContain('"jsonrpc":"2.0"');
   119	  });
   120	
   121	  it('does NOT abort the bind when the stale socket node vanishes mid-reclaim (ENOENT TOCTOU)', async () => {
   122	    const dir = tempRoot('cg-toctou-enoent-');
   123	    const socketPath = join(dir, 'daemon-ipc.sock');
   124	    // Force a genuine EADDRINUSE first.
   125	    await preBindStaleSocket(socketPath);
   126	
   127	    // Simulate the racing peer removing the socket node between the EADDRINUSE failure and the
   128	    // reclaim lstat: the very next lstatSync of the socket path throws ENOENT. The reclaim path must
   129	    // treat this as "already gone -> reclaimable" and re-bind, not throw and orphan the socket. The
   130	    // stale pre-bind stays listening so the bind below hits a REAL EADDRINUSE first (which is what
   131	    // drives the reclaim path); the real unlink then frees the path so the retry can re-bind.
   132	    const realLstat = fs.lstatSync.bind(fs);
   133	    let raced = false;
   134	    vi.spyOn(fs, 'lstatSync').mockImplementation(((target: fs.PathLike, ...rest: unknown[]) => {
   135	      if (!raced && String(target) === socketPath) {
   136	        raced = true;
   137	        const error = new Error('ENOENT: vanished mid-reclaim') as NodeJS.ErrnoException;
   138	        error.code = 'ENOENT';
   139	        throw error;
   140	      }
   141	      return (realLstat as (p: fs.PathLike, ...args: unknown[]) => fs.Stats)(target, ...rest);
   142	    }) as typeof fs.lstatSync);
   143	
   144	    const handle = await startIpcSocketServer({
   145	      socketPath,
   146	      createServer: makeServer,
   147	      log: () => undefined,
   148	    });
   149	    handles.push(handle);
   150	
   151	    expect(raced).toBe(true);
   152	    // Survivor is serving on the reclaimed path.
   153	    const client = await connect(socketPath);
   154	    client.write('{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}\n');
   155	    const response = await readLine(client);
   156	    expect(response).toContain('"jsonrpc":"2.0"');
   157	  });
   158	});

exec
/bin/zsh -lc "rg -n \"no-bridge-socket|dead-socket|respawn|missing-child-pid|probeDaemon|probeLeaseHolderWithRetries|live-but-dead|startup|wal_checkpoint|wal_autocheckpoint|LAUNCHER_DIAGNOSTIC\" .opencode/skills/system-code-graph/mcp_server/tests .opencode/bin -g '*.vitest.ts' -g '*.cjs'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/bin/hf-model-server.cjs:51:// concluding the socket is stale. Bounded so a hung peer cannot wedge startup.
.opencode/bin/hf-model-server.cjs:182:// the supervised path's assertSocketDirOwnership intent so the direct-startup unlink cannot be
.opencode/bin/hf-model-server.cjs:314:    // resident UDS on the direct-startup path. (1) the dir must be ours and not other-writable;
.opencode/bin/mk-spec-memory-launcher.cjs:107:// ppid changes (reparents to 1 / a subreaper). Captured once at startup so the relaunch
.opencode/bin/mk-spec-memory-launcher.cjs:202:// it reaps and respawns only when that daemon is dead or unbridgeable, so the database keeps a single
.opencode/bin/mk-spec-memory-launcher.cjs:270:        const suffix = process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1' ? '' : ' (no-bridge-socket)';
.opencode/bin/mk-spec-memory-launcher.cjs:639:    return { ready: false, reason: 'no-bridge-socket' };
.opencode/bin/mk-spec-memory-launcher.cjs:659:function respawnLockPath() {
.opencode/bin/mk-spec-memory-launcher.cjs:660:  return path.join(resolvedDbDir(), '.mk-spec-memory-respawn.lock');
.opencode/bin/mk-spec-memory-launcher.cjs:667:function acquireRespawnLockFileAt(lockPath, label = 'respawn') {
.opencode/bin/mk-spec-memory-launcher.cjs:672:  return acquireRespawnLockFileAt(respawnLockPath(), 'respawn');
.opencode/bin/mk-spec-memory-launcher.cjs:730:  log(`reaping recorded context-server child pid ${childPid} before respawn`);
.opencode/bin/mk-spec-memory-launcher.cjs:744:      log(`context-server child pid ${childPid} did not exit after SIGKILL within grace; refusing respawn`);
.opencode/bin/mk-spec-memory-launcher.cjs:752:  // shadow. We never block respawn on this: a missing daemon is worse than a self-healing one.
.opencode/bin/mk-spec-memory-launcher.cjs:781:  log(`confirmed-dead socket; reaping recorded spec-memory owner pid ${ownerPid} before respawn`);
.opencode/bin/mk-spec-memory-launcher.cjs:792:async function respawnAfterDeadSocket(leaseResult, decision) {
.opencode/bin/mk-spec-memory-launcher.cjs:794:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
.opencode/bin/mk-spec-memory-launcher.cjs:795:    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:800:    log('confirmed-dead socket but no recorded spec-memory owner pid is available; respawn inert');
.opencode/bin/mk-spec-memory-launcher.cjs:801:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-owner-pid)');
.opencode/bin/mk-spec-memory-launcher.cjs:808:    log('confirmed-dead socket but lease has no childPid; child-pid gate keeps respawn inert');
.opencode/bin/mk-spec-memory-launcher.cjs:809:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-child-pid)');
.opencode/bin/mk-spec-memory-launcher.cjs:810:    return { action: 'report', reason: 'missing-child-pid', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:815:  // fresh marker naming this exact live child, refuse the respawn and leave it
.opencode/bin/mk-spec-memory-launcher.cjs:817:  // refresh it), so a real death still respawns once the marker expires. Checked
.opencode/bin/mk-spec-memory-launcher.cjs:818:  // before the respawn lock and any reap so a bail unwinds nothing.
.opencode/bin/mk-spec-memory-launcher.cjs:821:    log(`confirmed-dead socket but child pid ${childPid} holds a fresh maintenance marker (activeUntil ${new Date(deadSocketMarker.activeUntilMs).toISOString()}); refusing respawn (busy, not dead)`);
.opencode/bin/mk-spec-memory-launcher.cjs:822:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-maintenance-active)');
.opencode/bin/mk-spec-memory-launcher.cjs:827:  let respawnLock = null;
.opencode/bin/mk-spec-memory-launcher.cjs:830:    respawnLock = acquireRespawnLockFile();
.opencode/bin/mk-spec-memory-launcher.cjs:831:    if (!respawnLock.acquired) {
.opencode/bin/mk-spec-memory-launcher.cjs:832:      log(`dead-socket respawn skipped; another launcher owns ${rel(respawnLock.path)}`);
.opencode/bin/mk-spec-memory-launcher.cjs:833:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-spec-memory-launcher.cjs:834:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:839:      log('dead-socket respawn skipped; spec-memory owner lease changed while waiting for respawn lock');
.opencode/bin/mk-spec-memory-launcher.cjs:840:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
.opencode/bin/mk-spec-memory-launcher.cjs:841:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:846:      log('dead-socket respawn skipped; lease changed while waiting for respawn lock');
.opencode/bin/mk-spec-memory-launcher.cjs:847:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
.opencode/bin/mk-spec-memory-launcher.cjs:848:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:853:      log(`dead-socket respawn skipped; ${ownerReapResult.reason} for ownerPid=${ownerPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:854:      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${ownerReapResult.reason})`);
.opencode/bin/mk-spec-memory-launcher.cjs:862:      log(`dead-socket respawn skipped; another launcher owns spec-memory owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-spec-memory-launcher.cjs:863:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-spec-memory-launcher.cjs:864:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:870:      log(`dead-socket respawn skipped; ${reapResult.reason} for childPid=${childPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:871:      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
.opencode/bin/mk-spec-memory-launcher.cjs:879:    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:881:    releaseRespawnLockFile(respawnLock);
.opencode/bin/mk-spec-memory-launcher.cjs:902:  if (decision && decision.action === 'respawn') {
.opencode/bin/mk-spec-memory-launcher.cjs:903:    return await respawnAfterDeadSocket(leaseResult, decision);
.opencode/bin/mk-spec-memory-launcher.cjs:979:      // Corrupt pid files are treated like absent pid files; the respawn lock still serializes recovery.
.opencode/bin/mk-spec-memory-launcher.cjs:1083:  // recreated on every MCP startup. Migration paths above (rename / move-aside)
.opencode/bin/mk-spec-memory-launcher.cjs:1232:  // lease is keyed on its (still-live) pid, so the replacement daemon is respawned by the child
.opencode/bin/mk-spec-memory-launcher.cjs:1303:// BOOTSTRAP_LOCK_STALE_MS ago wedges every requireLock respawn for the full wait
.opencode/bin/mk-spec-memory-launcher.cjs:1649:        // instead of reaping and respawning. This reuses the warm daemon and never tears down a
.opencode/bin/mk-spec-memory-launcher.cjs:1650:        // daemon a live secondary may still be bridged to. The reap+respawn path below runs only
.opencode/bin/mk-spec-memory-launcher.cjs:1663:            // probe the dead-socket decision uses, with its tuned timeout + retry that tolerates a
.opencode/bin/mk-spec-memory-launcher.cjs:1665:            // reap+respawn block below, which tears it down and spawns a fresh one under the lock.
.opencode/bin/mk-spec-memory-launcher.cjs:1666:            const { probeLeaseHolderWithRetries } = loadBridgeModule();
.opencode/bin/mk-spec-memory-launcher.cjs:1669:              probe = await probeLeaseHolderWithRetries(readiness.socketPath, {
.opencode/bin/mk-spec-memory-launcher.cjs:1675:              // reap+respawn, rather than letting the exception abort startup and strand the daemon.
.opencode/bin/mk-spec-memory-launcher.cjs:1686:            // marker naming this live child means adopt rather than reap+respawn.
.opencode/bin/mk-spec-memory-launcher.cjs:1694:            log(`stale-reclaim NOT adopting pid ${orphanChildPid}: liveness probe failed (${probe.reason}); reaping and respawning instead`);
.opencode/bin/mk-spec-memory-launcher.cjs:1700:        // exclusive respawn lock to serialize it, the same lock the dead-socket respawn path uses;
.opencode/bin/mk-spec-memory-launcher.cjs:1704:          log('stale-reclaim deferred: another launcher holds the respawn lock; reporting lease held');
.opencode/bin/mk-spec-memory-launcher.cjs:1706:          writeLeaseHeldJsonRpcError(leaseResult, 'respawn-lock-held');
.opencode/bin/mk-spec-memory-launcher.cjs:1710:          // Re-validate under the respawn lock. The liveness probe above can take seconds, during which
.opencode/bin/mk-spec-memory-launcher.cjs:1714:          // defer and reconnect. Mirrors the dead-socket respawn path's post-lock lease re-read.
.opencode/bin/mk-spec-memory-launcher.cjs:1717:            log('stale-reclaim deferred: lease childPid changed after acquiring respawn lock (replacement already present); reporting lease held');
.opencode/bin/mk-spec-memory-launcher.cjs:1721:            writeLeaseHeldJsonRpcError(leaseResult, 'respawn-superseded');
.opencode/bin/mk-spec-memory-launcher.cjs:1766:    // Reap + spawn critical section is over; let other respawn paths proceed.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:213:    expect(launcherModule.leaseMetricClassForTransition('respawned')).toBe('respawned');
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:56:import { buildStartupBrief } from '../lib/startup-brief.js';
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:60:describe('startup-brief', () => {
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:75:    expect(brief.startupSurface).toContain('Session context received. Current state:');
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:76:    expect(brief.startupSurface).toContain('- Memory: session continuity available');
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:77:    expect(brief.startupSurface).toContain('- Code Graph: healthy');
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:78:    expect(brief.startupSurface).toContain('- Note: this is a startup snapshot; later structural reads may differ if the repo state changed.');
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:79:    expect(brief.sharedPayload?.kind).toBe('startup');
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:80:    expect(brief.sharedPayload?.provenance.producer).toBe('startup_brief');
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:93:    expect(brief.startupSurface).toContain('- Memory: startup summary only (resume on demand)');
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:116:    expect(brief.startupSurface).toContain('- Code Graph: empty -- run `code_graph_scan`');
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:132:    expect(brief.startupSurface).toContain('- Code Graph: stale');
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:133:    expect(brief.startupSurface).toContain('first structural read may refresh inline');
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:134:    expect(brief.startupSurface).toContain('startup snapshot');
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:170:    expect(brief.startupSurface).toContain('- Memory: startup summary only (resume on demand)');
.opencode/skills/system-code-graph/mcp_server/tests/startup-brief.vitest.ts:171:    expect(brief.startupSurface).toContain('- Code Graph: unavailable');
.opencode/bin/lib/launcher-session-proxy.cjs:11:  probeDaemon,
.opencode/bin/lib/launcher-session-proxy.cjs:354:  const probe = options?.probe ?? probeDaemon;
.opencode/bin/lib/launcher-session-proxy.cjs:827:          message: `backend unavailable: ${ready.reason ?? 'startup-timeout'}`,
.opencode/bin/lib/launcher-ipc-bridge.cjs:47:// A single transient probe miss must NOT make a sibling reap the lease owner and respawn a second
.opencode/bin/lib/launcher-ipc-bridge.cjs:150:function probeDaemon(socketPath, options = {}) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:338:// only an all-failures run returns the final (dead) result so the caller respawns. The probe fn and
.opencode/bin/lib/launcher-ipc-bridge.cjs:340:async function probeLeaseHolderWithRetries(socketPath, options = {}) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:342:    probe = probeDaemon,
.opencode/bin/lib/launcher-ipc-bridge.cjs:394:  // recomputed path can miss the live socket and false-report 'no-bridge-socket'. Only trust the
.opencode/bin/lib/launcher-ipc-bridge.cjs:406:    writeLeaseHeld(' (no-bridge-socket)');
.opencode/bin/lib/launcher-ipc-bridge.cjs:407:    return { action: 'report', reason: 'no-bridge-socket', socketPath };
.opencode/bin/lib/launcher-ipc-bridge.cjs:413:  // hang it forever, never respawning. The raised probe timeout (default 5000ms, < the 7000ms launcher
.opencode/bin/lib/launcher-ipc-bridge.cjs:418:  const probe = await probeLeaseHolderWithRetries(socketPath, {
.opencode/bin/lib/launcher-ipc-bridge.cjs:428:    return { action: 'respawn', reason: probe.reason, socketPath };
.opencode/bin/lib/launcher-ipc-bridge.cjs:449:  probeDaemon,
.opencode/bin/lib/launcher-ipc-bridge.cjs:450:  probeLeaseHolderWithRetries,
.opencode/bin/lib/model-server-supervision.cjs:30:const HF_MODEL_SERVER_RESPAWN_LOCK_FILE_NAME = 'hf-embed-respawn.lock';
.opencode/bin/lib/model-server-supervision.cjs:315:// captured at startup (or has reparented to the init/subreaper pid 1) means the owning session
.opencode/bin/lib/model-server-supervision.cjs:316:// disposed; respawning then would only flap the daemon under a runtime that is going away and
.opencode/bin/lib/model-server-supervision.cjs:604:// socket and would reap+respawn the daemon mid-scan (killing the scan). The
.opencode/bin/lib/model-server-supervision.cjs:666:function acquireRespawnLockFileAt(lockPath, label = 'respawn', options = {}) {
.opencode/bin/lib/model-server-supervision.cjs:741:    'hf-model-server respawn',
.opencode/bin/lib/model-server-supervision.cjs:859:    logger(`confirmed-dead hf-embed socket; reaping recorded hf-model-server pid ${childPid} before respawn`);
.opencode/bin/lib/model-server-supervision.cjs:1089:  function respawnLockBlockedReason(lock) {
.opencode/bin/lib/model-server-supervision.cjs:1091:      ? 'model-server-respawn-lock-unwritable'
.opencode/bin/lib/model-server-supervision.cjs:1092:      : 'model-server-respawn-lock-held';
.opencode/bin/lib/model-server-supervision.cjs:1138:      // that signals the root pid (SIGTERM -> reap tree -> grace -> SIGKILL) exactly like the respawn path.
.opencode/bin/lib/model-server-supervision.cjs:1200:      return { allowed: false, reason: respawnLockBlockedReason(lock), lockPath: lock.path };
.opencode/bin/lib/model-server-supervision.cjs:1216:      if (!lock.acquired) return { shouldListen: false, reason: respawnLockBlockedReason(lock), lockPath: lock.path };
.opencode/bin/lib/model-server-supervision.cjs:1236:    // The respawn lock is intentionally held across the bind + idle-listener window (released only on
.opencode/bin/lib/model-server-supervision.cjs:1238:    // cleanly with 'model-server-respawn-lock-held' instead of racing the bind. (Lock LIFETIME differs
.opencode/bin/lib/model-server-supervision.cjs:1241:    if (!lock.acquired) return { shouldListen: false, reason: respawnLockBlockedReason(lock), lockPath: lock.path };
.opencode/bin/lib/model-server-supervision.cjs:1298:      // demand server was already torn down above and the respawn lock released, so without re-arming
.opencode/bin/mk-skill-advisor-launcher.cjs:163:        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker} (no-bridge-socket)\n`);
.opencode/bin/mk-skill-advisor-launcher.cjs:445:  log(`confirmed-dead socket; reaping recorded skill-advisor daemon pid ${ownerPid} before respawn`);
.opencode/bin/mk-skill-advisor-launcher.cjs:656:async function respawnAfterDeadSocket(leaseResult, decision) {
.opencode/bin/mk-skill-advisor-launcher.cjs:658:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
.opencode/bin/mk-skill-advisor-launcher.cjs:659:    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:664:    log('confirmed-dead socket but no recorded skill-advisor daemon pid is available; respawn inert');
.opencode/bin/mk-skill-advisor-launcher.cjs:665:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-daemon-pid)');
.opencode/bin/mk-skill-advisor-launcher.cjs:677:      log('dead-socket respawn skipped; skill-advisor launcher lease changed while waiting for bootstrap lock');
.opencode/bin/mk-skill-advisor-launcher.cjs:678:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
.opencode/bin/mk-skill-advisor-launcher.cjs:679:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:686:      log(`dead-socket respawn skipped; ${reapResult.reason} for daemonPid=${targetPid}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:687:      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
.opencode/bin/mk-skill-advisor-launcher.cjs:705:      log(`dead-socket respawn skipped; another launcher owns skill-advisor owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:706:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-skill-advisor-launcher.cjs:707:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:717:      ? { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath }
.opencode/bin/mk-skill-advisor-launcher.cjs:751:  if (decision && decision.action === 'respawn') {
.opencode/bin/mk-skill-advisor-launcher.cjs:752:    return await respawnAfterDeadSocket(leaseResult, decision);
.opencode/bin/mk-skill-advisor-launcher.cjs:789:        if (decision?.action === 'bridge' || decision?.action === 'respawn') {
.opencode/bin/mk-skill-advisor-launcher.cjs:792:        if (decision?.reason !== 'no-bridge-socket') {
.opencode/bin/mk-skill-advisor-launcher.cjs:1284:        // and spawn share one serialization point without a separate respawn lock.
.opencode/bin/mk-code-index-launcher.cjs:111:// Former shared location (.opencode/.spec-kit/code-graph/database/) is migrated back on first startup.
.opencode/bin/mk-code-index-launcher.cjs:131:  respawned: 'respawned',
.opencode/bin/mk-code-index-launcher.cjs:173:        const suffix = process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1' ? '' : ' (no-bridge-socket)';
.opencode/bin/mk-code-index-launcher.cjs:205:// longer surfaces as a hard "Connection closed" — the proxy reattaches to the respawned backend and
.opencode/bin/mk-code-index-launcher.cjs:370:// misreporting a healthy owner as no-bridge-socket.
.opencode/bin/mk-code-index-launcher.cjs:649:  log(`confirmed-dead socket; reaping recorded code-index owner pid ${ownerPid} before respawn`);
.opencode/bin/mk-code-index-launcher.cjs:668:async function respawnAfterDeadSocket(leaseResult, decision, options = {}) {
.opencode/bin/mk-code-index-launcher.cjs:670:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
.opencode/bin/mk-code-index-launcher.cjs:671:    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:674:  const ownerPid = options.respawnChildPid;
.opencode/bin/mk-code-index-launcher.cjs:676:    log('confirmed-dead socket but no recorded code-index child owner pid is available; respawn inert');
.opencode/bin/mk-code-index-launcher.cjs:677:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-child-pid)');
.opencode/bin/mk-code-index-launcher.cjs:678:    return { action: 'report', reason: 'missing-child-pid', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:686:      log('dead-socket respawn skipped; code-index owner lease changed while waiting for respawn lock');
.opencode/bin/mk-code-index-launcher.cjs:687:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
.opencode/bin/mk-code-index-launcher.cjs:688:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:693:      log(`dead-socket respawn skipped; ${reapResult.reason} for ownerPid=${ownerPid}`);
.opencode/bin/mk-code-index-launcher.cjs:694:      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
.opencode/bin/mk-code-index-launcher.cjs:702:      log(`dead-socket respawn skipped; another launcher owns code-index owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-code-index-launcher.cjs:703:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-code-index-launcher.cjs:704:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:711:    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:728:  if (decision && decision.action === 'respawn') {
.opencode/bin/mk-code-index-launcher.cjs:729:    const respawnResult = await respawnAfterDeadSocket(leaseResult, decision, options);
.opencode/bin/mk-code-index-launcher.cjs:730:    if (respawnResult.action === 'respawn') {
.opencode/bin/mk-code-index-launcher.cjs:731:      emitLeaseMetric(leaseMetricClassForTransition('respawned'), {
.opencode/bin/mk-code-index-launcher.cjs:733:        reason: respawnResult.reason,
.opencode/bin/mk-code-index-launcher.cjs:734:        socketPath: respawnResult.socketPath,
.opencode/bin/mk-code-index-launcher.cjs:739:        reason: respawnResult.reason,
.opencode/bin/mk-code-index-launcher.cjs:740:        socketPath: respawnResult.socketPath,
.opencode/bin/mk-code-index-launcher.cjs:743:    return respawnResult;
.opencode/bin/mk-code-index-launcher.cjs:829:  // recreated on every MCP startup. Migration paths above (rename / move-aside)
.opencode/bin/mk-code-index-launcher.cjs:889:// staleMs ago wedges every requireLock respawn for the full wait deadline.
.opencode/bin/mk-code-index-launcher.cjs:1046:  // against the same DB (mirrors the dead-socket respawn reap and the sibling
.opencode/bin/mk-code-index-launcher.cjs:1080:          respawnChildPid: ownerLeaseResult.holder.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:1172:    // winning launcher reaps + respawns; a still-live orphan would otherwise keep
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:11:describe('code-index CLI owner lease and respawn locking', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:30:    const harness = createCodeIndexHarness('dead-socket-respawn');

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts | sed -n '1,90p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Code Graph SQLite Busy Timeout Tests
     3	// ───────────────────────────────────────────────────────────────
     4	// initDb must set busy_timeout = 5000ms so concurrent writers
     5	// wait for the writer lock instead of throwing SQLITE_BUSY immediately.
     6	
     7	import { afterEach, describe, expect, it } from 'vitest';
     8	import Database from 'better-sqlite3';
     9	import { mkdtempSync, rmSync } from 'node:fs';
    10	import { tmpdir } from 'node:os';
    11	import { join } from 'node:path';
    12	import { closeDb, initDb } from '../lib/code-graph-db.js';
    13	
    14	afterEach(() => {
    15	  try {
    16	    closeDb();
    17	  } catch {
    18	    /* singleton cleanup */
    19	  }
    20	});
    21	
    22	describe('F-002-A2-02: SQLite busy_timeout pragma', () => {
    23	  it('sets busy_timeout = 5000 immediately after open', () => {
    24	    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-busy-1-'));
    25	    try {
    26	      const db = initDb(tempDir);
    27	      const result = db.pragma('busy_timeout', { simple: true });
    28	      expect(result).toBe(5000);
    29	    } finally {
    30	      rmSync(tempDir, { recursive: true, force: true });
    31	    }
    32	  });
    33	
    34	  it('a second connection inherits busy timeout from the same DB file', () => {
    35	    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-busy-2-'));
    36	    try {
    37	      // First connection via the singleton initDb
    38	      const primary = initDb(tempDir);
    39	      expect(primary.pragma('busy_timeout', { simple: true })).toBe(5000);
    40	
    41	      // Open a second connection directly to the same file. busy_timeout is
    42	      // a per-connection setting, so we set it explicitly to verify the
    43	      // behavior expected of contention-tolerant paths.
    44	      const secondaryPath = join(tempDir, 'code-graph.sqlite');
    45	      const secondary = new Database(secondaryPath);
    46	      try {
    47	        secondary.pragma('busy_timeout = 5000');
    48	        expect(secondary.pragma('busy_timeout', { simple: true })).toBe(5000);
    49	      } finally {
    50	        secondary.close();
    51	      }
    52	    } finally {
    53	      rmSync(tempDir, { recursive: true, force: true });
    54	    }
    55	  });
    56	
    57	  it('busy_timeout is non-zero (bounded wait) — never unlimited', () => {
    58	    const tempDir = mkdtempSync(join(tmpdir(), 'code-graph-busy-3-'));
    59	    try {
    60	      const db = initDb(tempDir);
    61	      const timeout = db.pragma('busy_timeout', { simple: true }) as number;
    62	      expect(timeout).toBeGreaterThan(0);
    63	      // Sanity bound — should not be set to a pathological multi-minute value
    64	      expect(timeout).toBeLessThanOrEqual(60_000);
    65	    } finally {
    66	      rmSync(tempDir, { recursive: true, force: true });
    67	    }
    68	  });
    69	});

codex
{
  "angle": "adversarial-refute-p0",
  "confirms": [
    "GLM rec socket-health correlation is correct: classifyOwnerLease only checks process liveness, ppid-orphan, and heartbeat before returning live-owner; it never checks socket serviceability (.opencode/bin/mk-code-index-launcher.cjs:455). leaseHeldFromFile likewise returns held:true immediately after process.kill(pid,0) succeeds (.opencode/bin/mk-code-index-launcher.cjs:582).",
    "GLM rec reusing the deep probe is mostly correct: probeDaemon({deepProbe:true}) opens the socket, sends JSON-RPC initialize, and only reports alive after a JSON-RPC reply with the probe id (.opencode/bin/lib/launcher-ipc-bridge.cjs:150, .opencode/bin/lib/launcher-ipc-bridge.cjs:202, .opencode/bin/lib/launcher-ipc-bridge.cjs:221). The code-index CLI already uses this before opening its real client (.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1118).",
    "GLM rec no-bridge-socket->respawn targets a real hole: maybeBridgeLeaseHolder currently treats a missing Unix socket as report/no-bridge-socket, not respawn (.opencode/bin/lib/launcher-ipc-bridge.cjs:405).",
    "GLM rec not to key startup grace on startedAt is correct: the owner lease is acquired before bootstrap lock and build (.opencode/bin/mk-code-index-launcher.cjs:1060, .opencode/bin/mk-code-index-launcher.cjs:1102, .opencode/bin/mk-code-index-launcher.cjs:1166), while the child PID is only known after spawn in launchServer (.opencode/bin/mk-code-index-launcher.cjs:967, .opencode/bin/mk-code-index-launcher.cjs:973).",
    "GLM rec WAL hygiene is directionally correct: initDb enables WAL and busy_timeout but does not set wal_autocheckpoint or checkpoint on startup (.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1027). The launcher migration path copies code-graph.sqlite-wal forward if present (.opencode/bin/mk-code-index-launcher.cjs:1125).",
    "GLM rec diagnostics is correct as a need: current launcher output is fragmented LEASE_HELD_BY/log strings and no LAUNCHER_DIAGNOSTIC or walHeldBy equivalent exists (.opencode/bin/mk-code-index-launcher.cjs:625, .opencode/bin/mk-code-index-launcher.cjs:1074)."
  ],
  "refutes": [
    {
      "target": "GLM rec: probeDaemon({deepProbe:true}) is a side-effect-free health check",
      "problem": "It does not disturb the primary stdio client, but it is not side-effect-free. The IPC server counts the probe as a secondary connection, calls onActivity, and can refuse it when max secondary clients is reached. A refused probe is indistinguishable from a dead daemon to the caller, so a saturated but healthy bridge can be false-classified dead unless the health path treats max-client/refused separately.",
      "evidence": ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:302"
    },
    {
      "target": "GLM rec: live-but-dead-socket is reclaimable",
      "problem": "Correct only after a startup-state gate exists. Today a legitimate first launcher owns the lease before the bootstrap lock and first npm/tsc build complete, so a second launcher can see a live owner with no socket while startup is still valid. A raw no-socket=>reclaim rule would kill a real startup.",
      "evidence": ".opencode/bin/mk-code-index-launcher.cjs:1060"
    },
    {
      "target": "GLM rec: no-bridge-socket should route into respawnAfterDeadSocket",
      "problem": "As a generic bridge change, this is incomplete. respawnAfterDeadSocket for code-index refuses to act without options.respawnChildPid; the PID-lease path calls bridgeOrReportLeaseHeld without that option, so a missing socket there would still degrade to dead-socket-no-child-pid unless the PID lease records childPid or a registry supplies it.",
      "evidence": ".opencode/bin/mk-code-index-launcher.cjs:674"
    },
    {
      "target": "GLM claim: P0 core without the registry closes the incident class",
      "problem": "Refuted for the 'lease file gone' incident variant. reclaimedOrphanPid is populated only from a reclaimed owner lease, and the orphan reap runs only when that value exists. If both lease artifacts are gone, socket-health classification has no PID to classify or reap.",
      "evidence": ".opencode/bin/mk-code-index-launcher.cjs:1060"
    },
    {
      "target": "GLM rec: launcher can checkpoint WAL at startup because no other writer holds it",
      "problem": "That premise is not guaranteed by the current launcher. The launcher normally never opens SQLite; the child does in initDb. The bootstrap lock serializes launchers, not a still-live or orphaned child. Checkpointing is safe only after exclusive daemon ownership is proven or the old owner is reaped/absent; otherwise it can contend with the live child writer and produce SQLITE_BUSY or a startup stall.",
      "evidence": ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1032"
    },
    {
      "target": "GLM rec: childSpawnedAt grace fully solves startup math",
      "problem": "childSpawnedAt is necessary but not sufficient. There is a pre-child phase where the lease owner is the launcher and no childSpawnedAt can exist yet; that phase includes bootstrap-lock wait and first build. The design needs an explicit pre-spawn/build state and deadline, not only childSpawnedAt-based daemon startup grace.",
      "evidence": ".opencode/bin/mk-code-index-launcher.cjs:1166"
    },
    {
      "target": "GLM rec: diagnostics replace manual forensics",
      "problem": "Only if diagnostics actually collect the missing facts. Current code has no lsof/wal holder probe and no unified diagnostic line; adding reason tokens without walHeldBy/source-of-pid fields would still leave the exact incident requiring manual ps/lsof/WAL inspection.",
      "evidence": ".opencode/bin/mk-code-index-launcher.cjs:1191"
    }
  ],
  "gaps": [
    "The bridge file path in the prompt/design is stale: code-index loads .opencode/bin/lib/launcher-ipc-bridge.cjs via loadBridgeModule, not .opencode/bin/launcher-ipc-bridge.cjs (.opencode/bin/mk-code-index-launcher.cjs:164).",
    "No deterministic test currently covers live PID + owner lease + missing socket file + beyond startup deadline. Existing code-index respawn tests kill the owner daemon, which exercises stale/dead ownership, not the PID-alive/socket-absent wedge (.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:29).",
    "No test stresses probe refusal under SPECKIT_MAX_SECONDARY_CLIENTS saturation even though the socket server comment says probes cannot distinguish refused connections from dead daemons (.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:17).",
    "The child starts refreshing the owner lease after server.connect but before startIpcSocketServer completes, so heartbeat freshness can still precede socket availability (.opencode/skills/system-code-graph/mcp_server/index.ts:136, .opencode/skills/system-code-graph/mcp_server/index.ts:149).",
    "The owner lease TypeScript shape does not include socketPath, while the launcher writes and expects it. Runtime preserves extra fields today, but the contract is implicit and fragile (.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:23, .opencode/bin/mk-code-index-launcher.cjs:419)."
  ],
  "new_recommendations": [
    {
      "change": "Add explicit owner lease fields for launcherPid, daemonPid, launcherStartedAtIso, childSpawnedAtIso, startupPhase, and socketPath; classify socketless owners as pre-spawn, starting-child, live-serving, or dead-socket instead of overloading live-owner.",
      "where": ".opencode/bin/mk-code-index-launcher.cjs:buildOwnerLease/classifyOwnerLease/launchServer",
      "why": "It prevents killing a legitimate first build while still making a post-spawn socketless daemon reclaimable."
    },
    {
      "change": "Make missing-socket respawn policy owned by the launcher, not only the shared bridge helper: maybeBridgeLeaseHolder can return no-bridge-socket, and code-index should decide respawn only when it has a verified daemonPid and the startup deadline has expired.",
      "where": ".opencode/bin/mk-code-index-launcher.cjs:bridgeOrReportLeaseHeld",
      "why": "The shared bridge cannot know whether a missing socket means pre-child build, missing childPid, stale PID lease, or a reclaimable daemon."
    },
    {
      "change": "Record childPid in the PID lease or add the crash-surviving registry to P0, not later. On missing leases, use the registry plus lsof/fuser on code-graph.sqlite-wal/sqlite, with PID identity checks, before spawning a new writer.",
      "where": ".opencode/bin/mk-code-index-launcher.cjs:writeLeaseFile/launchServer/launcherMain",
      "why": "Socket-health checks cannot recover the incident variant where the lease file is gone."
    },
    {
      "change": "Gate WAL checkpoint behind exclusive ownership: after owner lease acquisition, after any orphan reap, and before launchServer. Use a bounded busy_timeout and treat SQLITE_BUSY as a diagnostic, not an unhandled launcher crash. Also set PRAGMA wal_autocheckpoint=500 in initDb.",
      "where": ".opencode/bin/mk-code-index-launcher.cjs:launcherMain and .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:initDb",
      "why": "This gives WAL cleanup without creating an unsafe second writer or wedging startup on a live child."
    },
    {
      "change": "Add one JSON-line diagnostic containing reason, ownerPid, launcherPid, daemonPid, socketPath, startupPhase, probeReason, walBytes, walHeldBy, and action.",
      "where": ".opencode/bin/mk-code-index-launcher.cjs:failure/lease-held/respawn branches",
      "why": "The current logs explain symptoms but not the state needed to distinguish dead socket, pre-spawn build, orphan WAL, PID reuse, and foreign owner."
    }
  ],
  "verdict": "sound-with-fixes"
}
hook: Stop
hook: Stop Completed
tokens used
141,570
{
  "angle": "adversarial-refute-p0",
  "confirms": [
    "GLM rec socket-health correlation is correct: classifyOwnerLease only checks process liveness, ppid-orphan, and heartbeat before returning live-owner; it never checks socket serviceability (.opencode/bin/mk-code-index-launcher.cjs:455). leaseHeldFromFile likewise returns held:true immediately after process.kill(pid,0) succeeds (.opencode/bin/mk-code-index-launcher.cjs:582).",
    "GLM rec reusing the deep probe is mostly correct: probeDaemon({deepProbe:true}) opens the socket, sends JSON-RPC initialize, and only reports alive after a JSON-RPC reply with the probe id (.opencode/bin/lib/launcher-ipc-bridge.cjs:150, .opencode/bin/lib/launcher-ipc-bridge.cjs:202, .opencode/bin/lib/launcher-ipc-bridge.cjs:221). The code-index CLI already uses this before opening its real client (.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1118).",
    "GLM rec no-bridge-socket->respawn targets a real hole: maybeBridgeLeaseHolder currently treats a missing Unix socket as report/no-bridge-socket, not respawn (.opencode/bin/lib/launcher-ipc-bridge.cjs:405).",
    "GLM rec not to key startup grace on startedAt is correct: the owner lease is acquired before bootstrap lock and build (.opencode/bin/mk-code-index-launcher.cjs:1060, .opencode/bin/mk-code-index-launcher.cjs:1102, .opencode/bin/mk-code-index-launcher.cjs:1166), while the child PID is only known after spawn in launchServer (.opencode/bin/mk-code-index-launcher.cjs:967, .opencode/bin/mk-code-index-launcher.cjs:973).",
    "GLM rec WAL hygiene is directionally correct: initDb enables WAL and busy_timeout but does not set wal_autocheckpoint or checkpoint on startup (.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1027). The launcher migration path copies code-graph.sqlite-wal forward if present (.opencode/bin/mk-code-index-launcher.cjs:1125).",
    "GLM rec diagnostics is correct as a need: current launcher output is fragmented LEASE_HELD_BY/log strings and no LAUNCHER_DIAGNOSTIC or walHeldBy equivalent exists (.opencode/bin/mk-code-index-launcher.cjs:625, .opencode/bin/mk-code-index-launcher.cjs:1074)."
  ],
  "refutes": [
    {
      "target": "GLM rec: probeDaemon({deepProbe:true}) is a side-effect-free health check",
      "problem": "It does not disturb the primary stdio client, but it is not side-effect-free. The IPC server counts the probe as a secondary connection, calls onActivity, and can refuse it when max secondary clients is reached. A refused probe is indistinguishable from a dead daemon to the caller, so a saturated but healthy bridge can be false-classified dead unless the health path treats max-client/refused separately.",
      "evidence": ".opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:302"
    },
    {
      "target": "GLM rec: live-but-dead-socket is reclaimable",
      "problem": "Correct only after a startup-state gate exists. Today a legitimate first launcher owns the lease before the bootstrap lock and first npm/tsc build complete, so a second launcher can see a live owner with no socket while startup is still valid. A raw no-socket=>reclaim rule would kill a real startup.",
      "evidence": ".opencode/bin/mk-code-index-launcher.cjs:1060"
    },
    {
      "target": "GLM rec: no-bridge-socket should route into respawnAfterDeadSocket",
      "problem": "As a generic bridge change, this is incomplete. respawnAfterDeadSocket for code-index refuses to act without options.respawnChildPid; the PID-lease path calls bridgeOrReportLeaseHeld without that option, so a missing socket there would still degrade to dead-socket-no-child-pid unless the PID lease records childPid or a registry supplies it.",
      "evidence": ".opencode/bin/mk-code-index-launcher.cjs:674"
    },
    {
      "target": "GLM claim: P0 core without the registry closes the incident class",
      "problem": "Refuted for the 'lease file gone' incident variant. reclaimedOrphanPid is populated only from a reclaimed owner lease, and the orphan reap runs only when that value exists. If both lease artifacts are gone, socket-health classification has no PID to classify or reap.",
      "evidence": ".opencode/bin/mk-code-index-launcher.cjs:1060"
    },
    {
      "target": "GLM rec: launcher can checkpoint WAL at startup because no other writer holds it",
      "problem": "That premise is not guaranteed by the current launcher. The launcher normally never opens SQLite; the child does in initDb. The bootstrap lock serializes launchers, not a still-live or orphaned child. Checkpointing is safe only after exclusive daemon ownership is proven or the old owner is reaped/absent; otherwise it can contend with the live child writer and produce SQLITE_BUSY or a startup stall.",
      "evidence": ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1032"
    },
    {
      "target": "GLM rec: childSpawnedAt grace fully solves startup math",
      "problem": "childSpawnedAt is necessary but not sufficient. There is a pre-child phase where the lease owner is the launcher and no childSpawnedAt can exist yet; that phase includes bootstrap-lock wait and first build. The design needs an explicit pre-spawn/build state and deadline, not only childSpawnedAt-based daemon startup grace.",
      "evidence": ".opencode/bin/mk-code-index-launcher.cjs:1166"
    },
    {
      "target": "GLM rec: diagnostics replace manual forensics",
      "problem": "Only if diagnostics actually collect the missing facts. Current code has no lsof/wal holder probe and no unified diagnostic line; adding reason tokens without walHeldBy/source-of-pid fields would still leave the exact incident requiring manual ps/lsof/WAL inspection.",
      "evidence": ".opencode/bin/mk-code-index-launcher.cjs:1191"
    }
  ],
  "gaps": [
    "The bridge file path in the prompt/design is stale: code-index loads .opencode/bin/lib/launcher-ipc-bridge.cjs via loadBridgeModule, not .opencode/bin/launcher-ipc-bridge.cjs (.opencode/bin/mk-code-index-launcher.cjs:164).",
    "No deterministic test currently covers live PID + owner lease + missing socket file + beyond startup deadline. Existing code-index respawn tests kill the owner daemon, which exercises stale/dead ownership, not the PID-alive/socket-absent wedge (.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:29).",
    "No test stresses probe refusal under SPECKIT_MAX_SECONDARY_CLIENTS saturation even though the socket server comment says probes cannot distinguish refused connections from dead daemons (.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:17).",
    "The child starts refreshing the owner lease after server.connect but before startIpcSocketServer completes, so heartbeat freshness can still precede socket availability (.opencode/skills/system-code-graph/mcp_server/index.ts:136, .opencode/skills/system-code-graph/mcp_server/index.ts:149).",
    "The owner lease TypeScript shape does not include socketPath, while the launcher writes and expects it. Runtime preserves extra fields today, but the contract is implicit and fragile (.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:23, .opencode/bin/mk-code-index-launcher.cjs:419)."
  ],
  "new_recommendations": [
    {
      "change": "Add explicit owner lease fields for launcherPid, daemonPid, launcherStartedAtIso, childSpawnedAtIso, startupPhase, and socketPath; classify socketless owners as pre-spawn, starting-child, live-serving, or dead-socket instead of overloading live-owner.",
      "where": ".opencode/bin/mk-code-index-launcher.cjs:buildOwnerLease/classifyOwnerLease/launchServer",
      "why": "It prevents killing a legitimate first build while still making a post-spawn socketless daemon reclaimable."
    },
    {
      "change": "Make missing-socket respawn policy owned by the launcher, not only the shared bridge helper: maybeBridgeLeaseHolder can return no-bridge-socket, and code-index should decide respawn only when it has a verified daemonPid and the startup deadline has expired.",
      "where": ".opencode/bin/mk-code-index-launcher.cjs:bridgeOrReportLeaseHeld",
      "why": "The shared bridge cannot know whether a missing socket means pre-child build, missing childPid, stale PID lease, or a reclaimable daemon."
    },
    {
      "change": "Record childPid in the PID lease or add the crash-surviving registry to P0, not later. On missing leases, use the registry plus lsof/fuser on code-graph.sqlite-wal/sqlite, with PID identity checks, before spawning a new writer.",
      "where": ".opencode/bin/mk-code-index-launcher.cjs:writeLeaseFile/launchServer/launcherMain",
      "why": "Socket-health checks cannot recover the incident variant where the lease file is gone."
    },
    {
      "change": "Gate WAL checkpoint behind exclusive ownership: after owner lease acquisition, after any orphan reap, and before launchServer. Use a bounded busy_timeout and treat SQLITE_BUSY as a diagnostic, not an unhandled launcher crash. Also set PRAGMA wal_autocheckpoint=500 in initDb.",
      "where": ".opencode/bin/mk-code-index-launcher.cjs:launcherMain and .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:initDb",
      "why": "This gives WAL cleanup without creating an unsafe second writer or wedging startup on a live child."
    },
    {
      "change": "Add one JSON-line diagnostic containing reason, ownerPid, launcherPid, daemonPid, socketPath, startupPhase, probeReason, walBytes, walHeldBy, and action.",
      "where": ".opencode/bin/mk-code-index-launcher.cjs:failure/lease-held/respawn branches",
      "why": "The current logs explain symptoms but not the state needed to distinguish dead socket, pre-spawn build, orphan WAL, PID reuse, and foreign owner."
    }
  ],
  "verdict": "sound-with-fixes"
}
