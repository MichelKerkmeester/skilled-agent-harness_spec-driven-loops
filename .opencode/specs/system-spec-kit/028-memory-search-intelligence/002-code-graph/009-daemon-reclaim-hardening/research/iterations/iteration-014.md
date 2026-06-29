Reading additional input from stdin...
2026-06-29T10:39:22.708848Z ERROR codex_core::session::session: failed to load skill /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-open-design/SKILL.md: invalid YAML: mapping values are not allowed in this context at line 2 column 345
2026-06-29T10:39:22.708884Z ERROR codex_core::session::session: failed to load skill /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-open-design/SKILL.md: invalid YAML: mapping values are not allowed in this context at line 2 column 345
OpenAI Codex v0.137.0
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
model: gpt-5.5
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019f12f6-52a6-7de0-9bb9-5447d962dbfc
--------
user
You are GPT-5.5 at xhigh reasoning doing an ADVERSARIAL verification pass over a hardening design produced by a different model (GLM-5.2). Be skeptical: your job is to CONFIRM what is right, REFUTE what is wrong, and find GAPS the prior research missed — not to agree. Read the synthesized design at .opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/009-daemon-reclaim-hardening/research/research.md and the actual source .opencode/bin/mk-code-index-launcher.cjs and .opencode/bin/launcher-ipc-bridge.cjs (and the child initDb under system-code-graph/mcp_server if useful). Ground every claim in the REAL code (cite function/line). Incident recap: the code-index daemon wedged (PID alive, IPC socket never created, lease file gone, 17MB orphaned WAL) and /mcp reconnect returned -32000.

## Angle: reclaim-safety-stress
Stress the 'kill a live process' decision hardest. Even WITH uid + PID-identity + N-probe-failure guards, enumerate when reclaiming/killing could be WRONG: a healthy daemon mid huge code_graph_scan (alive, briefly not answering deep-probe); a daemon legitimately mid wal_checkpoint holding the WAL; deep-probe timeout vs genuine wedge ambiguity; SIGKILL vs SIGTERM data-loss on the child's better-sqlite3 handle; the WAL-holder-but-no-lease branch reaping a process that is actually serving on a socket the launcher computed wrong (divergent SPECKIT_IPC_SOCKET_DIR). Recommend guard refinements (e.g. probe-then-confirm-N-times-with-backoff, never-kill-if-socket-answers, require BOTH dead-socket AND aged-heartbeat).

Return ONLY JSON at the end: {"angle":"<angle>","confirms":["GLM rec X is correct because…"],"refutes":[{"target":"GLM rec/claim","problem":"…","evidence":"file:line"}],"gaps":["missed failure mode / angle…"],"new_recommendations":[{"change":"…","where":"file:func","why":"…"}],"verdict":"sound|sound-with-fixes|flawed"}
2026-06-29T10:39:22.981061Z ERROR rmcp::transport::worker: worker quit with fatal: Transport channel closed, when AuthRequired(AuthRequiredError { www_authenticate_header: "Bearer resource_metadata=\"https://mcp.figma.com/.well-known/oauth-protected-resource\",scope=\"mcp:connect\",authorization_uri=\"https://api.figma.com/.well-known/oauth-authorization-server\"" })
hook: SessionStart
hook: SessionStart
hook: SessionStart Completed
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
hook: UserPromptSubmit Completed
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-code/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/009-daemon-reclaim-hardening/research/research.md | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# Research: code-index daemon reclaim hardening (prevent the wedge recurrence)
     2	
     3	**Subject:** Prevent recurrence of the Code Graph daemon wedge — a PID-alive-but-socket-dead daemon the launcher does not reclaim, causing MCP reconnect `-32000`.
     4	**Method:** 10-iteration deep research, executor `zai-coding-plan/glm-5.2 --variant high` (max thinking), COSTAR. Iters 1-9 converged; iter 10 (test-design) timed out but its content is recoverable from the design below.
     5	**Target file:** `.opencode/bin/mk-code-index-launcher.cjs` (+ `launcher-ipc-bridge.cjs`, child `system-code-graph/mcp_server/dist/index.js` `initDb`).
     6	
     7	## Root cause (converged)
     8	
     9	Liveness is **bidimensional** — `processLiveness` proves only `process.kill(pid,0)` (PID exists), and the heartbeat is written by the **launcher**, not gated on the daemon's ability to serve. There is **zero socket-health correlation**. So a wedged daemon (PID alive, 0% CPU, socket never (re)created) classifies as `live-owner` / `held:true`. The inert branch is `maybeBridgeLeaseHolder`'s no-socket path (bridge `L405-408`): when the lease says "held" but the socket FILE is missing, it `report`s instead of respawning. Two compounding axes in the incident: (a) the lease file had also vanished from an empty socket dir, so the heartbeat-reclaim (which needs a lease file with an aging `lastHeartbeatIso`) never had anything to age out; (b) a 17 MB orphaned WAL from the unclean crash.
    10	
    11	**Liveness must be tridimensional: PID-alive AND socket-serving AND heartbeat-fresh.**
    12	
    13	## Converged hardening design
    14	
    15	1. **Reuse the existing probe.** `launcher-ipc-bridge.cjs:probeDaemon({deepProbe:true})` (~L150-236) already connects the UDS + sends a JSON-RPC `initialize`. Wrap it as `probeExistingService(socketPath)` returning `{status, kind}` where `kind ∈ {enoent, econnrefused, timeout, json-rpc-reply}`.
    16	2. **Socket-health gate in classification.** Add a `live-but-dead-socket` state to `classifyOwnerLease` and mirror it in `leaseHeldFromFile` (after the `process.kill(pid,0)` success at `~L602`): if `socketPath` is missing/dead (fast-path `!existsSync`, else N-consecutive deep-probe failures), return `staleReclaimable:true` instead of `held:true`. Extend the reclaimable allowlist (`~L479-484`) — the existing `unlink + O_EXCL` CAS handles it atomically, no CAS change.
    17	3. **No-bridge-socket → respawn, not report.** Change bridge `L405-408` to route a socketless-but-live owner into the existing `respawnAfterDeadSocket → reapOwnerBeforeRespawn` pipeline.
    18	4. **Startup grace window** (so a *starting* daemon isn't killed): `STARTUP_GRACE_MS=30000`, `MAX_INIT_MS=120000` (env-overridable), keyed on a new `childSpawnedAtIso` stamped right after the child PID is known — NOT `startedAtIso` (which precedes the bootstrap-lock wait + first build). `age ≤ grace` → still-starting (report); `grace < age ≤ max` → bounded socket re-poll; `age > max` → respawn (`startup-deadline-exceeded`).
    19	5. **Socket-gated heartbeat.** Refresh `lastHeartbeatIso` only when the socket is actually serving; on probe failure, stop heartbeating so a dead-socket daemon ages out into `stale-heartbeat-reclaim` within 2 min. Ideally move heartbeat ownership into the daemon child (refresh only after its IPC listener echoes).
    20	6. **Crash-surviving PID registry + self-heal on acquire.** Write `.code-graph-daemon-pid.json` (`{daemonPid, launcherPid, socketPath, startedAt, canonicalDbDir}`) right after the child PID is known; unlink only on clean child exit. On acquire, discover the orphan via `reclaimedOrphanPid → that registry → lsof on the WAL`, and reap (SIGTERM→grace→SIGKILL) **only** when `alive AND socket provably dead (N consecutive failures)**, then checkpoint, then spawn.
    21	7. **WAL startup hygiene.** Before spawn: if `code-graph.sqlite-wal` exceeds a threshold (~8 MB) or an orphan was just reaped, run `wal_checkpoint(TRUNCATE)` (no other writer holds it). Set `wal_autocheckpoint=500` (~2 MB, tunable) in `initDb`. Checkpoint before the migration copy so a giant `-wal` is never propagated.
    22	8. **Race + permission safety.** Apply the uid check to the PRIMARY lease (not just `legacyPath`) and to the socket owner — never unlink/bridge/kill a foreign-owned lease. Before any SIGKILL, verify PID identity (cmdline basename + process start-time vs `startedAtIso`) to avoid killing a PID-reuse victim; on mismatch log `pid-reuse-suspected` and abort. Re-stat the lease between classify and unlink (abort if changed). Gate self-heal behind a one-shot `.self-heal-attempted` marker so a failed heal never loops into a kill storm.
    23	9. **One-line diagnostics.** Emit `LAUNCHER_DIAGNOSTIC: reason=<token> ownerPid=<n> socketPath=<p> walHeldBy=<pid|none>` on every failure exit. Tokens: `dead-socket-reclaimed`, `startup-timeout`, `foreign-owner`, `wal-locked-by-orphan`, `bridge-socket-refused`, `pid-reuse-suspected`, `stale-heartbeat-reclaimed`. Replaces manual lsof/ps forensics.
    24	
    25	## Test plan (deterministic wedge simulation)
    26	
    27	- **Wedge → reclaim:** spawn a fake owner that writes the lease + holds a live PID but never opens the socket; past `MAX_INIT_MS`, assert the launcher reclaims (reaps + respawns) and emits `dead-socket-reclaimed`.
    28	- **Still-starting → not killed:** owner within `STARTUP_GRACE_MS` with no socket yet → assert NOT killed (`still-starting`).
    29	- **Foreign-owner → not killed:** lease/socket owned by a different uid → assert no signal, `foreign-owner` diagnostic.
    30	- **PID-reuse → not killed:** live PID whose cmdline/start-time mismatch the lease → `pid-reuse-suspected`, abort.
    31	- **Oversized WAL → checkpointed:** seed an 8MB+ `-wal` with no holder → assert `wal_checkpoint(TRUNCATE)` runs pre-spawn and WAL shrinks.
    32	- **Healthy owner → bridged:** live PID + serving socket → assert bridge, no reclaim.
    33	
    34	## Recommendation
    35	
    36	Implement components **1-3 + 4 + 7** as the P0 core (they directly close the incident class), then **6, 8, 9** as the durability/safety layer, then **5** (heartbeat) as defense-in-depth. The minimal P0 (socket-health gate + reclaim-on-dead-socket past a grace window + startup WAL hygiene + diagnostics) collapses both failure axes from the incident.
    37	
    38	---
    39	
    40	<!-- ANCHOR:sources -->
    41	## Sources
    42	
    43	- Launcher under study: `.opencode/bin/mk-code-index-launcher.cjs`, `.opencode/bin/launcher-ipc-bridge.cjs`, and the child `system-code-graph/mcp_server/dist/index.js` (`initDb`).
    44	- source: live incident forensics, 2026-06-29 — orphaned PIDs 37269/37358 at 0% CPU, empty `/tmp/mk-code-index/`, a 17 MB `code-graph.sqlite-wal` with no holder, DB integrity ok; manual recovery via `kill` + `PRAGMA wal_checkpoint(TRUNCATE)` + socket-dir clean.
    45	- source: 10-iteration GLM-5.2 (max thinking) deep research, iterations `iteration-001` through `iteration-010` in this folder; per-angle insights/recommendations in `angles.json`.
    46	<!-- /ANCHOR:sources -->
    47	

exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-code-index-launcher.cjs | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/bin/launcher-ipc-bridge.cjs | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: .opencode/bin/launcher-ipc-bridge.cjs: No such file or directory

exec
/bin/zsh -lc "rg --files .opencode/bin | rg 'launcher-ipc-bridge|mk-code-index-launcher'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/bin/lib/launcher-ipc-bridge.cjs
.opencode/bin/mk-code-index-launcher.cjs

exec
/bin/zsh -lc "rg -n \"function (classifyOwnerLease|leaseHeldFromFile|maybeBridgeLeaseHolder|probeDaemon|respawnAfterDeadSocket|reapOwnerBeforeRespawn|acquireOwnerLease|writeOwnerLease|heartbeat|wal|checkpoint|initDb)|const (classifyOwnerLease|leaseHeldFromFile|maybeBridgeLeaseHolder|probeDaemon|respawnAfterDeadSocket|reapOwnerBeforeRespawn)|SPECKIT_IPC_SOCKET_DIR|socketPath|lastHeartbeat|ownerPid|SIGKILL|SIGTERM\" .opencode/bin .opencode/skills/system-code-graph/mcp_server -g '*.{cjs,js,ts}'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/bin/mk-skill-advisor-launcher.cjs:120:  'SPECKIT_IPC_SOCKET_DIR',
.opencode/bin/mk-skill-advisor-launcher.cjs:148:        if (process.env.SPECKIT_IPC_SOCKET_DIR?.startsWith('tcp://')) {
.opencode/bin/mk-skill-advisor-launcher.cjs:149:          return process.env.SPECKIT_IPC_SOCKET_DIR;
.opencode/bin/mk-skill-advisor-launcher.cjs:151:        const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR
.opencode/bin/mk-skill-advisor-launcher.cjs:152:          ? path.resolve(process.env.SPECKIT_IPC_SOCKET_DIR)
.opencode/bin/mk-skill-advisor-launcher.cjs:163:        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker} (no-bridge-socket)\n`);
.opencode/bin/mk-skill-advisor-launcher.cjs:213:function bridgeStdioThroughSessionProxy(socketPath, options = {}) {
.opencode/bin/mk-skill-advisor-launcher.cjs:220:    socketPath,
.opencode/bin/mk-skill-advisor-launcher.cjs:306:function leaseHeldFromFile(filePath = leasePath(), legacyPath = null) {
.opencode/bin/mk-skill-advisor-launcher.cjs:308:  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
.opencode/bin/mk-skill-advisor-launcher.cjs:310:  const socketPath = typeof lease.socketPath === 'string' && lease.socketPath.length > 0 ? lease.socketPath : null;
.opencode/bin/mk-skill-advisor-launcher.cjs:313:    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:315:    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath, socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:316:    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:325:      Number.isInteger(parsed.ownerPid) &&
.opencode/bin/mk-skill-advisor-launcher.cjs:329:      typeof parsed.lastHeartbeatIso === 'string' &&
.opencode/bin/mk-skill-advisor-launcher.cjs:341:function writeOwnerLeaseFile(lease) {
.opencode/bin/mk-skill-advisor-launcher.cjs:355:function writeOwnerLeaseFileExclusive(lease) {
.opencode/bin/mk-skill-advisor-launcher.cjs:371:function buildOwnerLease(ownerPid = process.pid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:373:    ownerPid,
.opencode/bin/mk-skill-advisor-launcher.cjs:377:    lastHeartbeatIso: new Date().toISOString(),
.opencode/bin/mk-skill-advisor-launcher.cjs:423:async function reapOwnerBeforeRespawn(ownerPid, expectedExecutablePath = null) {
.opencode/bin/mk-skill-advisor-launcher.cjs:424:  const liveness = processLiveness(ownerPid);
.opencode/bin/mk-skill-advisor-launcher.cjs:434:  // to an unrelated process. Treat it as already-dead rather than SIGKILLing an
.opencode/bin/mk-skill-advisor-launcher.cjs:438:    const actualBasename = readProcessExecutableBasename(ownerPid);
.opencode/bin/mk-skill-advisor-launcher.cjs:440:      log(`skill-advisor reap skipped; pid ${ownerPid} executable '${actualBasename}' != recorded '${expectedBasename}' (pid reused)`);
.opencode/bin/mk-skill-advisor-launcher.cjs:445:  log(`confirmed-dead socket; reaping recorded skill-advisor daemon pid ${ownerPid} before respawn`);
.opencode/bin/mk-skill-advisor-launcher.cjs:447:    process.kill(ownerPid, 'SIGTERM');
.opencode/bin/mk-skill-advisor-launcher.cjs:451:  const exitedAfterTerm = await waitForPidExit(ownerPid, RESPAWN_REAP_GRACE_MS);
.opencode/bin/mk-skill-advisor-launcher.cjs:453:    log(`skill-advisor daemon pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
.opencode/bin/mk-skill-advisor-launcher.cjs:455:      process.kill(ownerPid, 'SIGKILL');
.opencode/bin/mk-skill-advisor-launcher.cjs:459:    await waitForPidExit(ownerPid, 1000);
.opencode/bin/mk-skill-advisor-launcher.cjs:460:    if (processLiveness(ownerPid) !== 'dead') {
.opencode/bin/mk-skill-advisor-launcher.cjs:487:function classifyOwnerLease(lease) {
.opencode/bin/mk-skill-advisor-launcher.cjs:488:  const liveness = processLiveness(lease.ownerPid);
.opencode/bin/mk-skill-advisor-launcher.cjs:492:  const actualPpid = readParentPid(lease.ownerPid);
.opencode/bin/mk-skill-advisor-launcher.cjs:497:  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
.opencode/bin/mk-skill-advisor-launcher.cjs:506:function acquireOwnerLeaseFile() {
.opencode/bin/mk-skill-advisor-launcher.cjs:515:    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:542:function refreshOwnerLeaseFile(ownerPid, patch = {}) {
.opencode/bin/mk-skill-advisor-launcher.cjs:544:  if (!lease || lease.ownerPid !== ownerPid) return false;
.opencode/bin/mk-skill-advisor-launcher.cjs:545:  const nextOwnerPid = patch.ownerPid ?? ownerPid;
.opencode/bin/mk-skill-advisor-launcher.cjs:549:    lastHeartbeatIso: new Date().toISOString(),
.opencode/bin/mk-skill-advisor-launcher.cjs:552:  if (!reread || reread.ownerPid !== nextOwnerPid) return false;
.opencode/bin/mk-skill-advisor-launcher.cjs:564:function startOwnerLeaseHeartbeat(ownerPid = process.pid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:570:    if (refreshOwnerLeaseFile(ownerPid)) return;
.opencode/bin/mk-skill-advisor-launcher.cjs:574:      // Escalate to SIGKILL if the child does not exit within the grace window —
.opencode/bin/mk-skill-advisor-launcher.cjs:579:        childProcess.kill('SIGTERM');
.opencode/bin/mk-skill-advisor-launcher.cjs:581:        if (!exited && isChildRunning(childProcess)) childProcess.kill('SIGKILL');
.opencode/bin/mk-skill-advisor-launcher.cjs:593:function ownsOwnerLeaseFile(ownerPid = process.pid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:595:  return lease?.ownerPid === ownerPid;
.opencode/bin/mk-skill-advisor-launcher.cjs:602:    if (lease && lease.ownerPid === ownerLeasePid
.opencode/bin/mk-skill-advisor-launcher.cjs:603:        && readOwnerLeaseFile()?.ownerPid === ownerLeasePid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:614:function clearOwnerLeaseFileIfOwner(ownerPid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:617:    if (lease && lease.ownerPid === ownerPid
.opencode/bin/mk-skill-advisor-launcher.cjs:618:        && readOwnerLeaseFile()?.ownerPid === ownerPid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:629:  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}\n`);
.opencode/bin/mk-skill-advisor-launcher.cjs:635:  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-skill-advisor-launcher.cjs:641:  return Number.isInteger(leaseResult.ownerPid) && leaseResult.ownerPid > 0 ? leaseResult.ownerPid : null;
.opencode/bin/mk-skill-advisor-launcher.cjs:644:function socketPathUsable(socketPath) {
.opencode/bin/mk-skill-advisor-launcher.cjs:645:  return typeof socketPath === 'string'
.opencode/bin/mk-skill-advisor-launcher.cjs:646:    && socketPath.length > 0
.opencode/bin/mk-skill-advisor-launcher.cjs:647:    && (socketPath.startsWith('tcp://') || fs.existsSync(socketPath));
.opencode/bin/mk-skill-advisor-launcher.cjs:656:async function respawnAfterDeadSocket(leaseResult, decision) {
.opencode/bin/mk-skill-advisor-launcher.cjs:659:    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:666:    return { action: 'report', reason: 'missing-daemon-pid', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:675:      : leaseResult.ownerPid;
.opencode/bin/mk-skill-advisor-launcher.cjs:679:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:683:    const expectedExecutablePath = previousOwner?.ownerPid === targetPid ? previousOwner.executablePath : null;
.opencode/bin/mk-skill-advisor-launcher.cjs:688:      return { action: 'report', reason: reapResult.reason, socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:691:    if (previousOwner?.ownerPid && previousOwner.ownerPid !== process.pid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:692:      await waitForPidExit(previousOwner.ownerPid, RESPAWN_REAP_GRACE_MS + 1000);
.opencode/bin/mk-skill-advisor-launcher.cjs:693:      if (processLiveness(previousOwner.ownerPid) === 'dead') {
.opencode/bin/mk-skill-advisor-launcher.cjs:694:        clearOwnerLeaseFileIfOwner(previousOwner.ownerPid);
.opencode/bin/mk-skill-advisor-launcher.cjs:705:      log(`dead-socket respawn skipped; another launcher owns skill-advisor owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:707:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:717:      ? { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath }
.opencode/bin/mk-skill-advisor-launcher.cjs:718:      : { action: 'report', reason: 'launch-skipped', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:728:  if (launcherLease.held && launcherLease.ownerPid === ownerLease.ownerPid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:733:    ownerPid: ownerLease.ownerPid,
.opencode/bin/mk-skill-advisor-launcher.cjs:737:    socketPath: null,
.opencode/bin/mk-skill-advisor-launcher.cjs:760:    log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:781:        ownerPid: staleChildPid,
.opencode/bin/mk-skill-advisor-launcher.cjs:785:        socketPath: typeof staleLease.socketPath === 'string' ? staleLease.socketPath : null,
.opencode/bin/mk-skill-advisor-launcher.cjs:787:      if (socketPathUsable(staleChildLeaseResult.socketPath)) {
.opencode/bin/mk-skill-advisor-launcher.cjs:837:    ownerPid: process.pid,
.opencode/bin/mk-skill-advisor-launcher.cjs:839:    socketPath: resolveSessionProxySocketPath(),
.opencode/bin/mk-skill-advisor-launcher.cjs:880:function sharedModelServerPidPath(socketPath = resolveModelServerSocketPath()) {
.opencode/bin/mk-skill-advisor-launcher.cjs:881:  const pidDir = socketPath.startsWith('tcp://') ? systemSpecKitDbDir : path.dirname(socketPath);
.opencode/bin/mk-skill-advisor-launcher.cjs:886:  const socketPath = resolveModelServerSocketPath();
.opencode/bin/mk-skill-advisor-launcher.cjs:887:  const pidPath = sharedModelServerPidPath(socketPath);
.opencode/bin/mk-skill-advisor-launcher.cjs:903:    socketPath,
.opencode/bin/mk-skill-advisor-launcher.cjs:985:  log(`${reason}; sending SIGTERM to hf-model-server pid ${pid}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:986:  signalModelServerRoot(pid, 'SIGTERM');
.opencode/bin/mk-skill-advisor-launcher.cjs:992:    log(`hf-model-server pid ${pid} exceeded ${graceMs}ms grace; sending SIGKILL`);
.opencode/bin/mk-skill-advisor-launcher.cjs:993:    signalModelServerRoot(pid, 'SIGKILL');
.opencode/bin/mk-skill-advisor-launcher.cjs:1134:  // after a launcher is SIGKILLed or crashes while holding the lock. The mtime
.opencode/bin/mk-skill-advisor-launcher.cjs:1137:  const ownerPid = readBootstrapLockOwnerPid();
.opencode/bin/mk-skill-advisor-launcher.cjs:1138:  const ownerDead = ownerPid !== null && processLiveness(ownerPid) === 'dead';
.opencode/bin/mk-skill-advisor-launcher.cjs:1146:    const reason = ownerDead ? `dead holder pid=${ownerPid}` : `${Math.round(ageMs / 1000)}s old`;
.opencode/bin/mk-skill-advisor-launcher.cjs:1201:        // Clear lease before signal mirror; process.on('exit') doesn't fire on SIGKILL.
.opencode/bin/mk-skill-advisor-launcher.cjs:1227:  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT']) {
.opencode/bin/mk-skill-advisor-launcher.cjs:1237:            childProcess.kill('SIGKILL');
.opencode/bin/mk-skill-advisor-launcher.cjs:1286:        const reapExecutablePath = reapOwnerLease?.ownerPid === pendingBootstrapReapPid ? reapOwnerLease.executablePath : null;
.opencode/bin/code-index.cjs:104:  if (!process.env.SPECKIT_IPC_SOCKET_DIR) {
.opencode/bin/code-index.cjs:105:    process.env.SPECKIT_IPC_SOCKET_DIR = defaultSocketDir;
.opencode/bin/code-index.cjs:107:  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
.opencode/bin/code-index.cjs:110:  const socketPath = path.join(path.resolve(socketDir), socketFileName);
.opencode/bin/code-index.cjs:111:  if (process.platform === 'darwin' && Buffer.byteLength(socketPath) > 103) {
.opencode/bin/code-index.cjs:112:    fail(`code-index socket path exceeds the Darwin sun_path limit: ${socketPath}. Set SPECKIT_IPC_SOCKET_DIR to a shorter directory or a tcp:// endpoint.`);
.opencode/bin/mk-code-index-launcher.cjs:174:        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-code-index-launcher.cjs:207:function bridgeStdioThroughSessionProxy(socketPath, options = {}) {
.opencode/bin/mk-code-index-launcher.cjs:210:    socketPath,
.opencode/bin/mk-code-index-launcher.cjs:328:      Number.isInteger(parsed.ownerPid) &&
.opencode/bin/mk-code-index-launcher.cjs:332:      typeof parsed.lastHeartbeatIso === 'string' &&
.opencode/bin/mk-code-index-launcher.cjs:344:function writeOwnerLeaseFile(lease) {
.opencode/bin/mk-code-index-launcher.cjs:351:function writeOwnerLeaseFileExclusive(lease) {
.opencode/bin/mk-code-index-launcher.cjs:368:// leases lets a secondary under a divergent SPECKIT_IPC_SOCKET_DIR bridge
.opencode/bin/mk-code-index-launcher.cjs:394:function startOwnerLeaseHeartbeat(ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:400:    if (refreshOwnerLeaseFile(ownerPid)) return;
.opencode/bin/mk-code-index-launcher.cjs:410:function buildOwnerLease(ownerPid = process.pid) {
.opencode/bin/mk-code-index-launcher.cjs:412:    ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:416:    lastHeartbeatIso: new Date().toISOString(),
.opencode/bin/mk-code-index-launcher.cjs:419:    socketPath: ownerSocketPath(),
.opencode/bin/mk-code-index-launcher.cjs:455:function classifyOwnerLease(lease) {
.opencode/bin/mk-code-index-launcher.cjs:456:  const liveness = processLiveness(lease.ownerPid);
.opencode/bin/mk-code-index-launcher.cjs:460:  const actualPpid = readParentPid(lease.ownerPid);
.opencode/bin/mk-code-index-launcher.cjs:465:  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
.opencode/bin/mk-code-index-launcher.cjs:474:function acquireOwnerLeaseFile() {
.opencode/bin/mk-code-index-launcher.cjs:483:    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
.opencode/bin/mk-code-index-launcher.cjs:509:      ownerPid: existing.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:517:function refreshOwnerLeaseFile(ownerPid, patch = {}) {
.opencode/bin/mk-code-index-launcher.cjs:519:  if (!lease || lease.ownerPid !== ownerPid) return false;
.opencode/bin/mk-code-index-launcher.cjs:520:  const nextOwnerPid = patch.ownerPid ?? ownerPid;
.opencode/bin/mk-code-index-launcher.cjs:524:    lastHeartbeatIso: new Date().toISOString(),
.opencode/bin/mk-code-index-launcher.cjs:529:  if (!reread || reread.ownerPid !== nextOwnerPid) return false;
.opencode/bin/mk-code-index-launcher.cjs:541:    if (lease && lease.ownerPid === ownerLeasePid
.opencode/bin/mk-code-index-launcher.cjs:542:        && readOwnerLeaseFile()?.ownerPid === ownerLeasePid) {
.opencode/bin/mk-code-index-launcher.cjs:552:function clearOwnerLeaseFileIfOwner(ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:556:    if (lease && lease.ownerPid === ownerPid
.opencode/bin/mk-code-index-launcher.cjs:557:        && readOwnerLeaseFile()?.ownerPid === ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:579:      || pidLiveAt(path.join(dir, '.code-graph-owner.json'), 'ownerPid');
.opencode/bin/mk-code-index-launcher.cjs:582:function leaseHeldFromFile(filePath, legacyPath = null) {
.opencode/bin/mk-code-index-launcher.cjs:584:  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
.opencode/bin/mk-code-index-launcher.cjs:586:  // recomputing one that may diverge under a different SPECKIT_IPC_SOCKET_DIR.
.opencode/bin/mk-code-index-launcher.cjs:587:  const socketPath = typeof lease.socketPath === 'string' && lease.socketPath.length > 0 ? lease.socketPath : null;
.opencode/bin/mk-code-index-launcher.cjs:594:        return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
.opencode/bin/mk-code-index-launcher.cjs:597:      return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
.opencode/bin/mk-code-index-launcher.cjs:603:    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
.opencode/bin/mk-code-index-launcher.cjs:605:    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath, socketPath };
.opencode/bin/mk-code-index-launcher.cjs:607:    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
.opencode/bin/mk-code-index-launcher.cjs:628:  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-code-index-launcher.cjs:640:async function reapOwnerBeforeRespawn(ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:641:  const liveness = processLiveness(ownerPid);
.opencode/bin/mk-code-index-launcher.cjs:649:  log(`confirmed-dead socket; reaping recorded code-index owner pid ${ownerPid} before respawn`);
.opencode/bin/mk-code-index-launcher.cjs:651:    process.kill(ownerPid, 'SIGTERM');
.opencode/bin/mk-code-index-launcher.cjs:655:  const exitedAfterTerm = await waitForPidExit(ownerPid, RESPAWN_REAP_GRACE_MS);
.opencode/bin/mk-code-index-launcher.cjs:657:    log(`code-index owner pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
.opencode/bin/mk-code-index-launcher.cjs:659:      process.kill(ownerPid, 'SIGKILL');
.opencode/bin/mk-code-index-launcher.cjs:663:    await waitForPidExit(ownerPid, 1000);
.opencode/bin/mk-code-index-launcher.cjs:668:async function respawnAfterDeadSocket(leaseResult, decision, options = {}) {
.opencode/bin/mk-code-index-launcher.cjs:671:    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:674:  const ownerPid = options.respawnChildPid;
.opencode/bin/mk-code-index-launcher.cjs:675:  if (!Number.isInteger(ownerPid) || ownerPid <= 0) {
.opencode/bin/mk-code-index-launcher.cjs:678:    return { action: 'report', reason: 'missing-child-pid', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:685:    if (currentOwner?.ownerPid !== ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:688:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:691:    const reapResult = await reapOwnerBeforeRespawn(ownerPid);
.opencode/bin/mk-code-index-launcher.cjs:693:      log(`dead-socket respawn skipped; ${reapResult.reason} for ownerPid=${ownerPid}`);
.opencode/bin/mk-code-index-launcher.cjs:695:      return { action: 'report', reason: reapResult.reason, socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:698:    clearOwnerLeaseFileIfOwner(ownerPid);
.opencode/bin/mk-code-index-launcher.cjs:702:      log(`dead-socket respawn skipped; another launcher owns code-index owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-code-index-launcher.cjs:704:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:711:    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:732:        ownerPid: leaseResult.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:734:        socketPath: respawnResult.socketPath,
.opencode/bin/mk-code-index-launcher.cjs:738:        ownerPid: leaseResult.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:740:        socketPath: respawnResult.socketPath,
.opencode/bin/mk-code-index-launcher.cjs:748:      ownerPid: leaseResult.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:750:      socketPath: decision?.socketPath ?? leaseResult.socketPath ?? null,
.opencode/bin/mk-code-index-launcher.cjs:759:  fs.writeFileSync(tmp, JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString(), socketPath: ownerSocketPath() }, null, 2), { mode: 0o600 });
.opencode/bin/mk-code-index-launcher.cjs:898:  const ownerPid = readBootstrapLockOwnerPid();
.opencode/bin/mk-code-index-launcher.cjs:899:  const ownerDead = ownerPid !== null && processLiveness(ownerPid) === 'dead';
.opencode/bin/mk-code-index-launcher.cjs:912:    const reason = ownerDead ? `dead holder pid=${ownerPid}` : `mtime ${Math.round(ageMs / 1000)}s old`;
.opencode/bin/mk-code-index-launcher.cjs:975:      ownerPid: childProcess.pid,
.opencode/bin/mk-code-index-launcher.cjs:987:      // Clear the lease before mirroring the signal; process.on('exit') does not fire on SIGKILL.
.opencode/bin/mk-code-index-launcher.cjs:990:      // catchable signal (SIGTERM/SIGINT/SIGHUP/SIGQUIT) re-enters installSignalHandlers'
.opencode/bin/mk-code-index-launcher.cjs:994:      // with the signaled status (128 + n). SIGKILL is uncatchable and already mirrors.
.opencode/bin/mk-code-index-launcher.cjs:1011:  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT']) {
.opencode/bin/mk-code-index-launcher.cjs:1043:  // Orphan daemon pid recorded by a reclaimed prior owner lease. A SIGKILL'd
.opencode/bin/mk-code-index-launcher.cjs:1063:          && Number.isInteger(ownerLeaseResult.reclaimed.ownerPid)
.opencode/bin/mk-code-index-launcher.cjs:1064:          && ownerLeaseResult.reclaimed.ownerPid > 0
.opencode/bin/mk-code-index-launcher.cjs:1065:          && ownerLeaseResult.reclaimed.ownerPid !== process.pid) {
.opencode/bin/mk-code-index-launcher.cjs:1066:        reclaimedOrphanPid = ownerLeaseResult.reclaimed.ownerPid;
.opencode/bin/mk-code-index-launcher.cjs:1074:        log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
.opencode/bin/mk-code-index-launcher.cjs:1076:          ownerPid: ownerLeaseResult.holder.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:1078:          socketPath: typeof ownerLeaseResult.holder.socketPath === 'string' ? ownerLeaseResult.holder.socketPath : null,
.opencode/bin/mk-code-index-launcher.cjs:1080:          respawnChildPid: ownerLeaseResult.holder.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:1094:          ownerPid: leaseResult.ownerPid,
.opencode/bin/mk-spec-memory-launcher.cjs:271:        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-spec-memory-launcher.cjs:290:function bridgeStdioThroughSessionProxy(socketPath, options = {}) {
.opencode/bin/mk-spec-memory-launcher.cjs:293:    socketPath,
.opencode/bin/mk-spec-memory-launcher.cjs:363:      Number.isInteger(parsed.ownerPid) &&
.opencode/bin/mk-spec-memory-launcher.cjs:367:      typeof parsed.lastHeartbeatIso === 'string' &&
.opencode/bin/mk-spec-memory-launcher.cjs:379:function writeOwnerLeaseFile(lease) {
.opencode/bin/mk-spec-memory-launcher.cjs:396:function writeOwnerLeaseFileExclusive(lease) {
.opencode/bin/mk-spec-memory-launcher.cjs:412:function buildOwnerLease(ownerPid = process.pid) {
.opencode/bin/mk-spec-memory-launcher.cjs:414:    ownerPid,
.opencode/bin/mk-spec-memory-launcher.cjs:418:    lastHeartbeatIso: new Date().toISOString(),
.opencode/bin/mk-spec-memory-launcher.cjs:444:function classifyOwnerLease(lease) {
.opencode/bin/mk-spec-memory-launcher.cjs:445:  const liveness = processLiveness(lease.ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:449:  const actualPpid = readParentPid(lease.ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:454:  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
.opencode/bin/mk-spec-memory-launcher.cjs:463:function acquireOwnerLeaseFile() {
.opencode/bin/mk-spec-memory-launcher.cjs:472:    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:499:function refreshOwnerLeaseFile(ownerPid, patch = {}) {
.opencode/bin/mk-spec-memory-launcher.cjs:501:  if (!lease || lease.ownerPid !== ownerPid) return false;
.opencode/bin/mk-spec-memory-launcher.cjs:502:  const nextOwnerPid = patch.ownerPid ?? ownerPid;
.opencode/bin/mk-spec-memory-launcher.cjs:506:    lastHeartbeatIso: new Date().toISOString(),
.opencode/bin/mk-spec-memory-launcher.cjs:509:  if (!reread || reread.ownerPid !== nextOwnerPid) return false;
.opencode/bin/mk-spec-memory-launcher.cjs:521:function startOwnerLeaseHeartbeat(ownerPid = process.pid) {
.opencode/bin/mk-spec-memory-launcher.cjs:527:    if (refreshOwnerLeaseFile(ownerPid)) return;
.opencode/bin/mk-spec-memory-launcher.cjs:530:    void shutdownLauncherForSignal('SIGTERM').catch((error) => {
.opencode/bin/mk-spec-memory-launcher.cjs:539:function ownsOwnerLeaseFile(ownerPid = process.pid) {
.opencode/bin/mk-spec-memory-launcher.cjs:541:  return lease?.ownerPid === ownerPid;
.opencode/bin/mk-spec-memory-launcher.cjs:548:    if (lease && lease.ownerPid === ownerLeasePid
.opencode/bin/mk-spec-memory-launcher.cjs:549:        && readOwnerLeaseFile()?.ownerPid === ownerLeasePid) {
.opencode/bin/mk-spec-memory-launcher.cjs:560:function clearOwnerLeaseFileIfOwner(ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:563:    if (lease && lease.ownerPid === ownerPid
.opencode/bin/mk-spec-memory-launcher.cjs:564:        && readOwnerLeaseFile()?.ownerPid === ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:572:function leaseHeldFromFile(filePath, legacyPath = null) {
.opencode/bin/mk-spec-memory-launcher.cjs:574:  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
.opencode/bin/mk-spec-memory-launcher.cjs:577:  // may diverge under a different SPECKIT_IPC_SOCKET_DIR. Null when the lease predates this field.
.opencode/bin/mk-spec-memory-launcher.cjs:578:  const socketPath = typeof lease.socketPath === 'string' && lease.socketPath.length > 0 ? lease.socketPath : null;
.opencode/bin/mk-spec-memory-launcher.cjs:581:    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:583:    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath, socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:585:    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:606:  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-spec-memory-launcher.cjs:615:      message: `mk-spec-memory: lease held by pid ${leaseResult.ownerPid} but session bridge unavailable (${reason}); reconnect`,
.opencode/bin/mk-spec-memory-launcher.cjs:625:  const storedSocketPath = leaseResult.socketPath;
.opencode/bin/mk-spec-memory-launcher.cjs:631:    return { ready: true, socketPath: storedSocketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:637:  const socketPath = getIpcSocketPath('mk-spec-memory', { dbDir: resolvedDbDir() });
.opencode/bin/mk-spec-memory-launcher.cjs:638:  if (!socketPath.startsWith('tcp://') && !fs.existsSync(socketPath)) {
.opencode/bin/mk-spec-memory-launcher.cjs:641:  return { ready: true, socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:646:  if (pidLeaseResult.held && pidLeaseResult.ownerPid === ownerLease.ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:651:    ownerPid: ownerLease.ownerPid,
.opencode/bin/mk-spec-memory-launcher.cjs:655:    socketPath: null,
.opencode/bin/mk-spec-memory-launcher.cjs:663:function modelServerRespawnLockPath(socketPath = resolveModelServerSocketPath()) {
.opencode/bin/mk-spec-memory-launcher.cjs:664:  return mss.modelServerRespawnLockPath(socketPath, { dbDir: resolvedDbDir });
.opencode/bin/mk-spec-memory-launcher.cjs:675:function acquireModelServerRespawnLockFile(socketPath = resolveModelServerSocketPath()) {
.opencode/bin/mk-spec-memory-launcher.cjs:676:  return mss.acquireModelServerRespawnLockFile(socketPath, { dbDir: resolvedDbDir, log, rel });
.opencode/bin/mk-spec-memory-launcher.cjs:709:// A reap is a verified clean DB handoff only when the child exited on SIGTERM (not SIGKILL) AND the
.opencode/bin/mk-spec-memory-launcher.cjs:731:  signalProcess(childPid, 'SIGTERM');
.opencode/bin/mk-spec-memory-launcher.cjs:736:    log(`context-server child pid ${childPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
.opencode/bin/mk-spec-memory-launcher.cjs:737:    signalProcess(childPid, 'SIGKILL');
.opencode/bin/mk-spec-memory-launcher.cjs:741:      // The child outlived SIGKILL within the grace window (uninterruptible state, or a pid we can
.opencode/bin/mk-spec-memory-launcher.cjs:744:      log(`context-server child pid ${childPid} did not exit after SIGKILL within grace; refusing respawn`);
.opencode/bin/mk-spec-memory-launcher.cjs:750:  // DB to a replacement daemon. If it did not (graceful close timed out, or we had to SIGKILL), log
.opencode/bin/mk-spec-memory-launcher.cjs:761:async function reapOwnerBeforeRespawn(ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:762:  const liveness = processLiveness(ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:776:  if (currentOwner?.ownerPid === ownerPid && classifyOwnerLease(currentOwner) === 'live-owner') {
.opencode/bin/mk-spec-memory-launcher.cjs:777:    log(`spec-memory owner pid ${ownerPid} is heartbeat-fresh (live-owner); refusing socket-probe reap (likely cap-refusal, not death)`);
.opencode/bin/mk-spec-memory-launcher.cjs:781:  log(`confirmed-dead socket; reaping recorded spec-memory owner pid ${ownerPid} before respawn`);
.opencode/bin/mk-spec-memory-launcher.cjs:782:  signalProcess(ownerPid, 'SIGTERM');
.opencode/bin/mk-spec-memory-launcher.cjs:783:  const exitedAfterTerm = await waitForPidExit(ownerPid, RESPAWN_REAP_GRACE_MS);
.opencode/bin/mk-spec-memory-launcher.cjs:785:    log(`spec-memory owner pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
.opencode/bin/mk-spec-memory-launcher.cjs:786:    signalProcess(ownerPid, 'SIGKILL');
.opencode/bin/mk-spec-memory-launcher.cjs:787:    await waitForPidExit(ownerPid, 1000);
.opencode/bin/mk-spec-memory-launcher.cjs:792:async function respawnAfterDeadSocket(leaseResult, decision) {
.opencode/bin/mk-spec-memory-launcher.cjs:795:    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:798:  const ownerPid = leaseResult.ownerPid;
.opencode/bin/mk-spec-memory-launcher.cjs:799:  if (!Number.isInteger(ownerPid) || ownerPid <= 0) {
.opencode/bin/mk-spec-memory-launcher.cjs:802:    return { action: 'report', reason: 'missing-owner-pid', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:810:    return { action: 'report', reason: 'missing-child-pid', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:823:    return { action: 'report', reason: 'maintenance-active', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:834:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:838:    if (currentOwner?.ownerPid !== ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:841:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:845:    if (currentLease?.pid !== leaseResult.ownerPid || currentLease?.childPid !== childPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:848:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:851:    const ownerReapResult = await reapOwnerBeforeRespawn(ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:853:      log(`dead-socket respawn skipped; ${ownerReapResult.reason} for ownerPid=${ownerPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:855:      return { action: 'report', reason: ownerReapResult.reason, socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:858:    clearOwnerLeaseFileIfOwner(ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:862:      log(`dead-socket respawn skipped; another launcher owns spec-memory owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-spec-memory-launcher.cjs:864:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:872:      return { action: 'report', reason: reapResult.reason, socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:879:    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:928:// Pure lease-payload builder (exported for tests). `childPid`, `modelServerPid`, and `socketPath`
.opencode/bin/mk-spec-memory-launcher.cjs:929:// are ADDITIVE fields; existing readers consume only pid/startedAt/ownerPid and ignore the extras.
.opencode/bin/mk-spec-memory-launcher.cjs:930:// `socketPath` records the IPC path this owner actually listens on so a secondary launcher prefers
.opencode/bin/mk-spec-memory-launcher.cjs:931:// it over recomputing one that can diverge under a different SPECKIT_IPC_SOCKET_DIR.
.opencode/bin/mk-spec-memory-launcher.cjs:932:function buildLeaseObject(childPid = null, startedAt = leaseStartedAt, modelServerPid = null, socketPath = null) {
.opencode/bin/mk-spec-memory-launcher.cjs:933:  return buildSharedLeaseObject(childPid, startedAt || new Date().toISOString(), modelServerPid, socketPath);
.opencode/bin/mk-spec-memory-launcher.cjs:942:function sharedModelServerPidPath(socketPath = resolveModelServerSocketPath()) {
.opencode/bin/mk-spec-memory-launcher.cjs:943:  const pidDir = socketPath.startsWith('tcp://') ? resolvedDbDir() : path.dirname(socketPath);
.opencode/bin/mk-spec-memory-launcher.cjs:948:  const socketPath = resolveModelServerSocketPath();
.opencode/bin/mk-spec-memory-launcher.cjs:949:  const pidPath = sharedModelServerPidPath(socketPath);
.opencode/bin/mk-spec-memory-launcher.cjs:968:    socketPath,
.opencode/bin/mk-spec-memory-launcher.cjs:1206:    ctx.log(`RSS ceiling sustained; sending SIGTERM to hf-model-server pid ${modelServerChild.pid} before daemon recycle`);
.opencode/bin/mk-spec-memory-launcher.cjs:1207:    modelServerChild.kill('SIGTERM');
.opencode/bin/mk-spec-memory-launcher.cjs:1211:      ctx.log(`hf-model-server pid ${modelServerChild.pid} exceeded ${graceMs}ms grace; sending SIGKILL before daemon recycle`);
.opencode/bin/mk-spec-memory-launcher.cjs:1212:      modelServerChild.kill('SIGKILL');
.opencode/bin/mk-spec-memory-launcher.cjs:1223:  ctx.log(`RSS ceiling sustained; sending SIGTERM to context-server pid ${contextChild.pid} before daemon recycle`);
.opencode/bin/mk-spec-memory-launcher.cjs:1224:  contextChild.kill('SIGTERM');
.opencode/bin/mk-spec-memory-launcher.cjs:1227:    ctx.log(`context-server pid ${contextChild.pid} exceeded ${graceMs}ms grace; sending SIGKILL before daemon recycle`);
.opencode/bin/mk-spec-memory-launcher.cjs:1228:    contextChild.kill('SIGKILL');
.opencode/bin/mk-spec-memory-launcher.cjs:1313:  const ownerPid = readBootstrapLockOwnerPid();
.opencode/bin/mk-spec-memory-launcher.cjs:1314:  const ownerDead = ownerPid !== null && processLiveness(ownerPid) === 'dead';
.opencode/bin/mk-spec-memory-launcher.cjs:1327:    const reason = ownerDead ? `dead holder pid=${ownerPid}` : `mtime ${Math.round(ageMs / 1000)}s old`;
.opencode/bin/mk-spec-memory-launcher.cjs:1429:            // daemon under a disposing session is what produced the SIGTERM/relaunch flap that
.opencode/bin/mk-spec-memory-launcher.cjs:1482:    leaseOwnerPid: leaseResult.ownerPid,
.opencode/bin/mk-spec-memory-launcher.cjs:1488:    log(`context-server exited: database single-writer lock held; bridging to live owner pid=${leaseResult.ownerPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:1497:      // was reparented to init without a SIGTERM) — same guard as the primary
.opencode/bin/mk-spec-memory-launcher.cjs:1507:    { ownerPid: leaseResult.ownerPid ?? 'unknown', startedAt: leaseResult.startedAt ?? new Date().toISOString() },
.opencode/bin/mk-spec-memory-launcher.cjs:1532:      // Escalate to SIGKILL if the non-adoptable model-server does not exit within the grace window,
.opencode/bin/mk-spec-memory-launcher.cjs:1536:        releasedModelServer.kill('SIGKILL');
.opencode/bin/mk-spec-memory-launcher.cjs:1576:      if (isChildRunning(child)) child.kill('SIGKILL');
.opencode/bin/mk-spec-memory-launcher.cjs:1584:  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT']) {
.opencode/bin/mk-spec-memory-launcher.cjs:1633:        log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
.opencode/bin/mk-spec-memory-launcher.cjs:1655:          const adoptResult = { ...leaseResult, socketPath: staleLease.socketPath || leaseResult.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:1669:              probe = await probeLeaseHolderWithRetries(readiness.socketPath, {
.opencode/bin/mk-spec-memory-launcher.cjs:1726:            // Cannot confirm the released daemon is gone (EPERM, or it outlived SIGKILL); spawning
.opencode/bin/mk-spec-memory-launcher.cjs:1762:      writeLeaseHeldJsonRpcError({ ownerPid: reprobe ? reprobe.pid : 'unknown', startedAt }, 'lease-reprobe-lost');
.opencode/bin/mk-spec-memory-launcher.cjs:1774:        socketPath: resolveSessionProxySocketPath(),
.opencode/bin/lib/launcher-session-proxy.cjs:216:async function waitForDaemonReady(socketPath, probe, connect, log, options = {}) {
.opencode/bin/lib/launcher-session-proxy.cjs:221:    const result = await probe(socketPath, { connect, deepProbe: true });
.opencode/bin/lib/launcher-session-proxy.cjs:251:function connectSocket(connect, socketPath) {
.opencode/bin/lib/launcher-session-proxy.cjs:255:      socket = connect(toConnectionOptions(socketPath));
.opencode/bin/lib/launcher-session-proxy.cjs:351:  const socketPath = options?.socketPath;
.opencode/bin/lib/launcher-session-proxy.cjs:395:  if (typeof socketPath !== 'string' || socketPath.length === 0) {
.opencode/bin/lib/launcher-session-proxy.cjs:396:    throw new Error('createSessionProxy requires a non-empty socketPath');
.opencode/bin/lib/launcher-session-proxy.cjs:671:    const freshSocket = await connectSocket(connect, socketPath);
.opencode/bin/lib/launcher-session-proxy.cjs:731:      const ready = await waitForDaemonReady(socketPath, probe, connect, log, { maxAttempts: 1 });
.opencode/bin/lib/launcher-session-proxy.cjs:819:    const ready = await waitForDaemonReady(socketPath, probe, connect, log, { maxAttempts: maxColdStartAttempts });
.opencode/bin/skill-advisor.cjs:99:  if (!process.env.SPECKIT_IPC_SOCKET_DIR) {
.opencode/bin/skill-advisor.cjs:100:    process.env.SPECKIT_IPC_SOCKET_DIR = defaultSocketDir;
.opencode/bin/skill-advisor.cjs:102:  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
.opencode/bin/skill-advisor.cjs:105:  const socketPath = path.join(path.resolve(socketDir), socketFileName);
.opencode/bin/skill-advisor.cjs:106:  if (process.platform === 'darwin' && Buffer.byteLength(socketPath) > 103) {
.opencode/bin/skill-advisor.cjs:107:    fail(`skill-advisor socket path exceeds the Darwin sun_path limit: ${socketPath}. Set SPECKIT_IPC_SOCKET_DIR to a shorter directory or a tcp:// endpoint.`);
.opencode/bin/cli-exit-taxonomy-smoke.cjs:76:        SPECKIT_IPC_SOCKET_DIR: socketDir,
.opencode/bin/hf-model-server.cjs:114:  if (env.SPECKIT_IPC_SOCKET_DIR?.startsWith('tcp://')) {
.opencode/bin/hf-model-server.cjs:115:    return env.SPECKIT_IPC_SOCKET_DIR;
.opencode/bin/hf-model-server.cjs:118:  const socketDir = env.SPECKIT_IPC_SOCKET_DIR
.opencode/bin/hf-model-server.cjs:119:    ? path.resolve(env.SPECKIT_IPC_SOCKET_DIR)
.opencode/bin/hf-model-server.cjs:124:function toConnectionOptions(socketPath) {
.opencode/bin/hf-model-server.cjs:125:  if (!socketPath.startsWith('tcp://')) {
.opencode/bin/hf-model-server.cjs:126:    return socketPath;
.opencode/bin/hf-model-server.cjs:128:  const url = new URL(socketPath);
.opencode/bin/hf-model-server.cjs:951:      socketPath: endpoint,
.opencode/bin/hf-model-server.cjs:1072:  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT']) {
.opencode/bin/spec-memory.cjs:105:  if (!process.env.SPECKIT_IPC_SOCKET_DIR) {
.opencode/bin/spec-memory.cjs:106:    process.env.SPECKIT_IPC_SOCKET_DIR = defaultSocketDir;
.opencode/bin/spec-memory.cjs:108:  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
.opencode/bin/spec-memory.cjs:111:  const socketPath = path.join(path.resolve(socketDir), socketFileName);
.opencode/bin/spec-memory.cjs:112:  if (process.platform === 'darwin' && Buffer.byteLength(socketPath) > 103) {
.opencode/bin/spec-memory.cjs:113:    fail(`spec-memory socket path exceeds the Darwin sun_path limit: ${socketPath}. Set SPECKIT_IPC_SOCKET_DIR to a shorter directory or a tcp:// endpoint.`);
.opencode/bin/lib/launcher-ipc-bridge.cjs:86:  if (process.env.SPECKIT_IPC_SOCKET_DIR?.startsWith('tcp://')) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:87:    return process.env.SPECKIT_IPC_SOCKET_DIR;
.opencode/bin/lib/launcher-ipc-bridge.cjs:89:  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR
.opencode/bin/lib/launcher-ipc-bridge.cjs:90:    ? path.resolve(process.env.SPECKIT_IPC_SOCKET_DIR)
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
.opencode/bin/lib/launcher-ipc-bridge.cjs:365:async function maybeBridgeLeaseHolder(options) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:378:  const ownerPid = leaseResult.ownerPid;
.opencode/bin/lib/launcher-ipc-bridge.cjs:380:    process.stdout.write(`LEASE_HELD_BY:${ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/lib/launcher-ipc-bridge.cjs:393:  // divergent SPECKIT_IPC_SOCKET_DIR (e.g. a secondary launcher in a different worktree env), the
.opencode/bin/lib/launcher-ipc-bridge.cjs:396:  // to recomputation for legacy leases that predate socketPath and for the other launchers whose
.opencode/bin/lib/launcher-ipc-bridge.cjs:398:  const storedSocketPath = leaseResult.socketPath;
.opencode/bin/lib/launcher-ipc-bridge.cjs:404:  const socketPath = usableStoredSocketPath ?? getIpcSocketPath(serviceName, { dbDir });
.opencode/bin/lib/launcher-ipc-bridge.cjs:405:  if (!socketPath.startsWith('tcp://') && !fs.existsSync(socketPath)) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:407:    return { action: 'report', reason: 'no-bridge-socket', socketPath };
.opencode/bin/lib/launcher-ipc-bridge.cjs:418:  const probe = await probeLeaseHolderWithRetries(socketPath, {
.opencode/bin/lib/launcher-ipc-bridge.cjs:423:      `[${loggerPrefix}] lease holder pid=${ownerPid} probe ${attempt}/${total} not alive (${result.reason}); retrying\n`,
.opencode/bin/lib/launcher-ipc-bridge.cjs:427:    process.stderr.write(`[${loggerPrefix}] lease holder pid=${ownerPid} socket=${socketPath} failed ${probeAttempts} consecutive liveness probes: ${probe.reason}\n`);
.opencode/bin/lib/launcher-ipc-bridge.cjs:428:    return { action: 'respawn', reason: probe.reason, socketPath };
.opencode/bin/lib/launcher-ipc-bridge.cjs:431:  process.stderr.write(`[${loggerPrefix}] bridging to lease holder pid=${ownerPid} socket=${socketPath}\n`);
.opencode/bin/lib/launcher-ipc-bridge.cjs:436:  await Promise.resolve(bridgeToSocket(socketPath, {
.opencode/bin/lib/launcher-ipc-bridge.cjs:441:  return { action: 'bridge', socketPath };
.opencode/bin/cli-offline-smoke.cjs:61:        SPECKIT_IPC_SOCKET_DIR: socketDir,
.opencode/bin/lib/model-server-supervision.cjs:348:    if (process.platform !== 'win32') signal(-pid, 'SIGTERM');
.opencode/bin/lib/model-server-supervision.cjs:349:    signal(pid, 'SIGTERM');
.opencode/bin/lib/model-server-supervision.cjs:353:      if (process.platform !== 'win32') signal(-pid, 'SIGKILL');
.opencode/bin/lib/model-server-supervision.cjs:354:      signal(pid, 'SIGKILL');
.opencode/bin/lib/model-server-supervision.cjs:444:  if (env.SPECKIT_IPC_SOCKET_DIR?.startsWith('tcp://')) return env.SPECKIT_IPC_SOCKET_DIR;
.opencode/bin/lib/model-server-supervision.cjs:447:  const socketDir = env.SPECKIT_IPC_SOCKET_DIR
.opencode/bin/lib/model-server-supervision.cjs:448:    ? path.resolve(env.SPECKIT_IPC_SOCKET_DIR)
.opencode/bin/lib/model-server-supervision.cjs:459:function assertSunPathLimit(socketPath) {
.opencode/bin/lib/model-server-supervision.cjs:460:  if (socketPath.startsWith('tcp://')) return;
.opencode/bin/lib/model-server-supervision.cjs:461:  const byteLength = Buffer.byteLength(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:467:    `hf-model-server socket path exceeds the conservative 104-byte sun_path limit (${byteLength} bytes): ${socketPath}. Set SPECKIT_IPC_SOCKET_DIR to a shorter directory.`,
.opencode/bin/lib/model-server-supervision.cjs:471:function assertSocketDirOwnership(socketPath, options = {}) {
.opencode/bin/lib/model-server-supervision.cjs:472:  if (socketPath.startsWith('tcp://')) return;
.opencode/bin/lib/model-server-supervision.cjs:475:  const socketDir = path.dirname(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:485:      throw codedError('ESOCKETDIRSYMLINK', `Refusing to use symlinked SPECKIT_IPC_SOCKET_DIR for hf-model-server socket: ${socketDir}`);
.opencode/bin/lib/model-server-supervision.cjs:494:    const socketStat = statApi.lstatSync(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:496:      throw codedError('ESOCKETSYMLINK', `Refusing to unlink or bind through symlinked hf-model-server socket node: ${socketPath}`);
.opencode/bin/lib/model-server-supervision.cjs:503:function modelServerRespawnLockPath(socketPath = resolveModelServerSocketPath(), options = {}) {
.opencode/bin/lib/model-server-supervision.cjs:505:  const lockDirPath = socketPath.startsWith('tcp://')
.opencode/bin/lib/model-server-supervision.cjs:507:    : path.dirname(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:511:function modelServerGiveUpPath(socketPath = resolveModelServerSocketPath(), options = {}) {
.opencode/bin/lib/model-server-supervision.cjs:513:  const giveUpDirPath = socketPath.startsWith('tcp://')
.opencode/bin/lib/model-server-supervision.cjs:515:    : path.dirname(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:519:function writeModelServerGiveUpUntil(socketPath, giveUpUntilMs, options = {}) {
.opencode/bin/lib/model-server-supervision.cjs:523:  const giveUpPath = path.join(ensureCanonicalDir(path.dirname(modelServerGiveUpPath(socketPath, options))), HF_MODEL_SERVER_GIVEUP_FILE_NAME);
.opencode/bin/lib/model-server-supervision.cjs:586:function readModelServerGiveUpUntil(socketPath, options = {}) {
.opencode/bin/lib/model-server-supervision.cjs:588:  const giveUpPath = modelServerGiveUpPath(socketPath, options);
.opencode/bin/lib/model-server-supervision.cjs:738:function acquireModelServerRespawnLockFile(socketPath = resolveModelServerSocketPath(), options = {}) {
.opencode/bin/lib/model-server-supervision.cjs:740:    modelServerRespawnLockPath(socketPath, options),
.opencode/bin/lib/model-server-supervision.cjs:759:function buildLeaseObject(childPid = null, startedAt = null, modelServerPid = null, socketPath = null) {
.opencode/bin/lib/model-server-supervision.cjs:763:    ownerPid: process.pid,
.opencode/bin/lib/model-server-supervision.cjs:773:  // SPECKIT_IPC_SOCKET_DIR (e.g. worktree env). Optional + additive: leases without it fall back
.opencode/bin/lib/model-server-supervision.cjs:775:  if (typeof socketPath === 'string' && socketPath.length > 0) {
.opencode/bin/lib/model-server-supervision.cjs:776:    payload.socketPath = socketPath;
.opencode/bin/lib/model-server-supervision.cjs:790:function unlinkModelServerSocket(socketPath) {
.opencode/bin/lib/model-server-supervision.cjs:791:  if (socketPath.startsWith('tcp://')) return;
.opencode/bin/lib/model-server-supervision.cjs:793:    fs.unlinkSync(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:860:    signal(childPid, 'SIGTERM');
.opencode/bin/lib/model-server-supervision.cjs:864:      logger(`hf-model-server pid ${childPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
.opencode/bin/lib/model-server-supervision.cjs:865:      signal(childPid, 'SIGKILL');
.opencode/bin/lib/model-server-supervision.cjs:1011:    const socketPath = resolveSocketPath();
.opencode/bin/lib/model-server-supervision.cjs:1013:      return deps.writeGiveUpUntil(giveUpUntilMs, socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1015:    return writeModelServerGiveUpUntil(socketPath, giveUpUntilMs, { dbDir, log: logger });
.opencode/bin/lib/model-server-supervision.cjs:1018:  function readGiveUpUntil(socketPath = resolveSocketPath()) {
.opencode/bin/lib/model-server-supervision.cjs:1019:    if (typeof deps.readGiveUpUntil === 'function') return deps.readGiveUpUntil(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1020:    return readModelServerGiveUpUntil(socketPath, {
.opencode/bin/lib/model-server-supervision.cjs:1029:  function activeGiveUpCooldown(socketPath = resolveSocketPath()) {
.opencode/bin/lib/model-server-supervision.cjs:1030:    const giveUpUntil = readGiveUpUntil(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1078:  function acquireDemandRespawnLock(socketPath) {
.opencode/bin/lib/model-server-supervision.cjs:1082:    const lock = acquireModelServerRespawnLockFile(socketPath, { dbDir, log: logger });
.opencode/bin/lib/model-server-supervision.cjs:1138:      // that signals the root pid (SIGTERM -> reap tree -> grace -> SIGKILL) exactly like the respawn path.
.opencode/bin/lib/model-server-supervision.cjs:1197:  async function reapRecordedModelServerBeforeRespawn(socketPath, options = {}) {
.opencode/bin/lib/model-server-supervision.cjs:1198:    const lock = options.lock || acquireModelServerRespawnLockFile(socketPath, { dbDir, log: logger });
.opencode/bin/lib/model-server-supervision.cjs:1213:  async function prepareModelServerDemandTarget(socketPath) {
.opencode/bin/lib/model-server-supervision.cjs:1214:    if (socketPath.startsWith('tcp://')) {
.opencode/bin/lib/model-server-supervision.cjs:1215:      const lock = acquireDemandRespawnLock(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1219:    assertSunPathLimit(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1220:    // Keep SPECKIT_IPC_SOCKET_DIR fail-closed: never mkdir/unlink through a symlinked or foreign-owned perimeter.
.opencode/bin/lib/model-server-supervision.cjs:1221:    assertSocketDirOwnership(socketPath, { statApi, getuid, logger });
.opencode/bin/lib/model-server-supervision.cjs:1222:    fs.mkdirSync(path.dirname(socketPath), { recursive: true, mode: 0o700 });
.opencode/bin/lib/model-server-supervision.cjs:1224:    if (fs.existsSync(socketPath)) {
.opencode/bin/lib/model-server-supervision.cjs:1227:        const probe = await probeModelServer(socketPath, { timeoutMs: 1000 });
.opencode/bin/lib/model-server-supervision.cjs:1240:    const lock = acquireDemandRespawnLock(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1243:    if (fs.existsSync(socketPath)) {
.opencode/bin/lib/model-server-supervision.cjs:1244:      reapResult = await reapRecordedModelServerBeforeRespawn(socketPath, { lock });
.opencode/bin/lib/model-server-supervision.cjs:1264:    unlinkModelServerSocket(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1321:    const socketPath = options.socketPath || resolveSocketPath();
.opencode/bin/lib/model-server-supervision.cjs:1322:    const prepared = options.skipPrepare ? { shouldListen: true } : await prepareModelServerDemandTarget(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1325:      return { started: false, reason: prepared.reason, socketPath, lockPath: prepared.lockPath };
.opencode/bin/lib/model-server-supervision.cjs:1333:          if (error && error.code === 'EADDRINUSE' && !socketPath.startsWith('tcp://') && !reclaimedStaleSocket) {
.opencode/bin/lib/model-server-supervision.cjs:1340:              reject(new Error(`hf-model-server socket ${socketPath} owned by a live resident (pid ${recordedPid}); not reclaiming`));
.opencode/bin/lib/model-server-supervision.cjs:1349:              assertSocketDirOwnership(socketPath, { statApi, getuid, logger });
.opencode/bin/lib/model-server-supervision.cjs:1350:              unlinkModelServerSocket(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1351:              server.listen(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1367:        if (socketPath.startsWith('tcp://')) {
.opencode/bin/lib/model-server-supervision.cjs:1368:          const url = new URL(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1371:          server.listen(socketPath);
.opencode/bin/lib/model-server-supervision.cjs:1379:    if (!socketPath.startsWith('tcp://')) {
.opencode/bin/lib/model-server-supervision.cjs:1380:      fs.chmodSync(socketPath, 0o600);
.opencode/bin/lib/model-server-supervision.cjs:1383:    state.demandTarget = socketPath;
.opencode/bin/lib/model-server-supervision.cjs:1385:    logger(`hf-model-server lazy demand listener ready at ${socketPath}`);
.opencode/bin/lib/model-server-supervision.cjs:1386:    return { started: true, socketPath };
.opencode/skills/system-code-graph/mcp_server/index.ts:123:process.once('SIGTERM', () => {
.opencode/skills/system-code-graph/mcp_server/index.ts:124:  void shutdownCodeIndex('SIGTERM').finally(() => process.exit(0));
.opencode/skills/system-code-graph/mcp_server/index.ts:150:    socketPath: resolveIpcSocketPath(DATABASE_DIR),
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:77:  readonly probeDaemon: (socketPath: string, options?: { timeoutMs?: number; deepProbe?: boolean }) => Promise<BridgeProbeResult>;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:78:  readonly toConnectionOptions: (socketPath: string) => string | net.NetConnectOpts;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:919:function socketPathTooLong(socketPath: string): boolean {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:920:  if (socketPath.startsWith('tcp://')) return false;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:921:  return process.platform === 'darwin' && Buffer.byteLength(socketPath) > 103;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:943:  const socketPath = path.join(socketDir, SOCKET_FILE_NAME);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:946:    nodeLink = lstatSync(socketPath);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:953:    throw new CliProtocolError(`IPC socket path is a symlink; refusing to connect: ${socketPath}`);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:956:    throw new CliProtocolError(`IPC socket is not owned by the current user (uid ${nodeLink.uid} != ${uid}): ${socketPath}`);
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:961:  if (!process.env.SPECKIT_IPC_SOCKET_DIR) {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:962:    process.env.SPECKIT_IPC_SOCKET_DIR = DEFAULT_SOCKET_DIR;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:964:  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
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
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:24:  ownerPid: number;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:28:  lastHeartbeatIso: string;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:46:  readonly ownerPid?: number;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:226:  return a.ownerPid === b.ownerPid
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:230:    && a.lastHeartbeatIso === b.lastHeartbeatIso
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:239:    Number.isInteger(candidate.ownerPid) &&
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:243:    typeof candidate.lastHeartbeatIso === 'string' &&
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:249:function writeOwnerLeaseAtomic(leasePath: string, data: OwnerLeaseData): void {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:266:function writeOwnerLeaseExclusive(leasePath: string, data: OwnerLeaseData): boolean {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:315:  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:362:  const liveness = getProcessLiveness(lease.ownerPid, options.processKill);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:366:  const actualPpid = (options.readParentPid ?? readProcessParentPid)(lease.ownerPid);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:386:export function acquireOwnerLease(dbDir: string, options: OwnerLeaseOptions = {}): OwnerLeaseAcquireResult {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:410:    ownerPid: options.ownerPid ?? process.pid,
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:414:    lastHeartbeatIso: now.toISOString(),
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:493:  ownerPid: number,
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:495:  patch: Partial<Pick<OwnerLeaseData, 'ownerPid' | 'ppid' | 'executablePath'>> = {},
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:504:    if (!holder || holder.ownerPid !== ownerPid) return false;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:509:      lastHeartbeatIso: now.toISOString(),
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:517:export function releaseOwnerLease(dbDir: string, ownerPid: number): boolean {
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:527:    if (!holder || holder.ownerPid !== ownerPid) return false;
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1427:  function walk(currentDir: string, inheritedGitignores: GitignoreContext[], depth: number): void {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:54:      ? "process.on('SIGTERM', () => {}); process.on('SIGINT', () => process.exit(0)); setTimeout(() => process.exit(0), 6500); setInterval(() => {}, 1000);\n"
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:55:      : "process.on('SIGTERM', () => process.exit(0)); process.on('SIGINT', () => process.exit(0)); setInterval(() => {}, 1000);\n",
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:128:  run.child.kill('SIGTERM');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:132:      run.child.kill('SIGKILL');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:152:    const parsed = JSON.parse(readFileSync(join(root, ownerLeaseRelativePath), 'utf8')) as { ownerPid?: unknown };
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:153:    return typeof parsed.ownerPid === 'number' ? parsed.ownerPid : null;
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:176:  child.kill('SIGTERM');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:216:    launcherModule.emitLeaseMetric('held-by-other', { ownerPid: 123 });
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:219:    launcherModule.emitLeaseMetric('bridged-secondary', { ownerPid: 456, reason: 'bridge' });
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:226:      ownerPid: 456,
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:240:    const ownerPid = readOwnerLeasePid(workspace.root);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:243:    expect(ownerPid).not.toBeNull();
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:244:    expect(second.stdout).toContain(`LEASE_HELD_BY:${ownerPid}`);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:245:    expect(second.stdout).toMatch(new RegExp(`^LEASE_HELD_BY:${ownerPid} startedAt=\\d{4}-\\d{2}-\\d{2}T`, 'm'));
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:260:    const ownerPid = readOwnerLeasePid(workspace.root);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:265:    expect(ownerPid).not.toBeNull();
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:287:      holder.kill('SIGTERM');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:291:        holder.kill('SIGKILL');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:412:    const ownerPid = readOwnerLeasePid(workspace.root);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:413:    expect(ownerPid).not.toBeNull();
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:425:        ownerPid: holder.pid,
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:429:        lastHeartbeatIso: '2026-05-22T00:00:00.000Z',
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:438:      expect(run.stderr).toContain(`ownerLeaseReclaimed: stale-heartbeat-reclaim ownerPid=${holder.pid}`);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:441:      holder.kill('SIGTERM');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:445:        holder.kill('SIGKILL');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:495:          ownerPid: holder.pid,
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:499:          lastHeartbeatIso: '2026-05-22T00:00:00.000Z',
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:545:        holder.kill('SIGTERM');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:549:          holder.kill('SIGKILL');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:561:    run.child.kill('SIGTERM');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:604:      holder.kill('SIGTERM');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:608:        holder.kill('SIGKILL');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:613:  // Parent SIGTERM cleanup clears launcher metadata without killing an ignored child.
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:614:  it('removes the PID file when the child ignores SIGTERM until launcher cleanup timeout', async () => {
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:619:    run.child.kill('SIGTERM');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-dual-client.vitest.ts:28:    expect(harness.assertSingleOwnerLease().ownerPid).toBe(warmupLease.ownerPid);
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:41:  readonly socketPath: string;
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:49:  readonly socketPath: string;
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:119:// the project convention (`SPECKIT_IPC_SOCKET_DIR=/tmp/<service>`). The owner check in
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:134:  const rawSocketDir = process.env.SPECKIT_IPC_SOCKET_DIR
.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts:135:    ? path.resolve(process.env.SPECKIT_IPC_SOCKET_DIR)
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
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:37:  ownerPid: number;
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:41:  lastHeartbeatIso: string;
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:87:    SPECKIT_IPC_SOCKET_DIR: socketDir,
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:198:    child.kill('SIGTERM');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:253:        child.kill('SIGTERM');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:256:            child.kill('SIGKILL');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:273:    process.kill(entry.pid, 'SIGTERM');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:281:      process.kill(entry.pid, 'SIGKILL');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:296:  expect(lease?.ownerPid).toBeGreaterThan(1);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:299:    recordRuntimePid(runtimePids, lease.ownerPid, ownerLeasePath(dbDir));
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:311:  process.kill(lease.ownerPid, 'SIGTERM');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:312:  await waitForPidExit(lease.ownerPid, 7_000);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:313:  if (pidIsLive(lease.ownerPid)) {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:314:    process.kill(lease.ownerPid, 'SIGKILL');
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:315:    await waitForPidExit(lease.ownerPid, 1_000);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:328:    recordRuntimePid(runtimePids, ownerLease.ownerPid, ownerLeasePath(dbDir));
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:349:    Number.isInteger(candidate.ownerPid) &&
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:353:    typeof candidate.lastHeartbeatIso === 'string' &&
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-parity.vitest.ts:48:            SPECKIT_IPC_SOCKET_DIR: socketDir,
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:15:const ORIGINAL = process.env.SPECKIT_IPC_SOCKET_DIR;
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:18:  delete process.env.SPECKIT_IPC_SOCKET_DIR;
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:23:    delete process.env.SPECKIT_IPC_SOCKET_DIR;
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:25:    process.env.SPECKIT_IPC_SOCKET_DIR = ORIGINAL;
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:33:    process.env.SPECKIT_IPC_SOCKET_DIR = missingDir;
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:35:    let socketPath = '';
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:37:      socketPath = resolveIpcSocketPath('/unused/db/dir');
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:40:    expect(socketPath).toContain(leaf);
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:41:    expect(socketPath.length).toBeGreaterThan(missingDir.length);
.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts:45:    process.env.SPECKIT_IPC_SOCKET_DIR = '/var/mk-code-index-out-of-root-xyz';
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:25:    expect(lease.ownerPid).toBeGreaterThan(1);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:41:    expect(lease.ownerPid).not.toBe(terminated.ownerPid);
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
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:57:    const ownerPid = 4242;
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:60:    expect(acquireOwnerLease(dbDir, { ownerPid, ppid: 1, executablePath: '/bin/node' }).acquired).toBe(true);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:77:    expect(() => refreshOwnerLease(dbDir, ownerPid)).toThrow(/ENOSPC|simulated/);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:92:    expect(refreshOwnerLease(dbDir, ownerPid)).toBe(true);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:97:    const ownerPid = 5151;
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:99:    expect(acquireOwnerLease(dbDir, { ownerPid, ppid: 1, executablePath: '/bin/node' }).acquired).toBe(true);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:112:    expect(refreshOwnerLease(dbDir, ownerPid)).toBe(true);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:118:    const ownerPid = 6262;
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:120:    expect(acquireOwnerLease(dbDir, { ownerPid, ppid: 1, executablePath: '/bin/node' }).acquired).toBe(true);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease-mutation-lock.vitest.ts:129:    expect(refreshOwnerLease(dbDir, ownerPid)).toBe(false);
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1027:export function initDb(dbDir: string): Database.Database {
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:17:  delete process.env.SPECKIT_IPC_SOCKET_DIR;
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:28:    const socketPath = join(rootLocalDir, 'daemon-ipc.sock');
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:29:    writeFileSync(socketPath, 'not a socket', 'utf8');
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:33:        socketPath,
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:41:    expect(existsSync(socketPath)).toBe(true);
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:49:      const socketPath = join(dir, 'daemon-ipc.sock');
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:53:          socketPath,
.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:61:      expect(existsSync(socketPath)).toBe(false);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:28:    ownerPid: process.pid,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:32:    lastHeartbeatIso: now,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:53:    const acquired = acquireOwnerLease(dbDir, { ownerPid: 123, ppid: 1, executablePath: '/bin/node' });
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:56:    expect(readOwnerLease(dbDir)?.ownerPid).toBe(123);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:59:    expect(readOwnerLease(dbDir)?.lastHeartbeatIso).toBe('2026-05-22T00:01:00.000Z');
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:85:      Promise.resolve().then(() => acquireOwnerLease(dbDir, { ownerPid: 101, ppid: 1, ...liveOwner })),
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:86:      Promise.resolve().then(() => acquireOwnerLease(dbDir, { ownerPid: 202, ppid: 1, ...liveOwner })),
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:91:    expect(readOwnerLease(dbDir)?.ownerPid).toBe(
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:92:      (results.find((result) => result.acquired) as { acquired: true; lease: OwnerLeaseData }).lease.ownerPid,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:119:    writeLease(dbDir, leaseFor(dbDir, { ownerPid: 424242, ppid: 1 }));
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:122:      ownerPid: 777,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:134:      reclaimed: { ownerPid: 424242 },
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:136:    expect(readOwnerLease(dbDir)?.ownerPid).toBe(777);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:143:      lastHeartbeatIso: '2026-05-22T00:00:00.000Z',
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:158:      lastHeartbeatIso: '2026-05-22T00:00:00.000Z',
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:174:    const ownerPid = 1234;
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:178:      ownerPid,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:180:      lastHeartbeatIso: new Date(baseMs).toISOString(),
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:186:      expect(refreshOwnerLease(dbDir, ownerPid, now)).toBe(true);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:203:    writeLease(dbDir, leaseFor(dbDir, { ownerPid: firstOwner }));
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:204:    writeLease(dbDir, leaseFor(dbDir, { ownerPid: nextOwner }));
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:207:    expect(readOwnerLease(dbDir)?.ownerPid).toBe(nextOwner);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:208:    expect(readOwnerLease(dbDir)?.lastHeartbeatIso).toBe('2026-05-22T00:00:00.000Z');
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:215:      ownerPid: 424242,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:225:      lastHeartbeatIso: base.toISOString(),
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:229:      ownerPid: 777,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:239:      reclaimed: { ownerPid: 424242 },
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:241:    expect(readOwnerLease(dbDir)?.ownerPid).toBe(777);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:246:    writeLease(dbDir, leaseFor(dbDir, { ownerPid: 424242, ppid: 1 }));
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:255:      ownerPid: 777,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:262:      holder: { ownerPid: 424242 },
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:264:    expect(JSON.parse(readFileSync(join(resolveCanonicalDbDir(dbDir), OWNER_LEASE_FILE_NAME), 'utf8')).ownerPid).toBe(424242);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:269:    const orphan = leaseFor(dbDir, { ownerPid: 424242, ppid: 123 });
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:277:      ownerPid: 777,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:285:      reclaimed: { ownerPid: 424242 },
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:287:    expect(readOwnerLease(dbDir)?.ownerPid).toBe(777);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:293:      ownerPid: 555,
.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:612:function walkAST(

exec
/bin/zsh -lc "find .opencode/skills/system-code-graph/mcp_server -maxdepth 4 -type f \\( -name '*.js' -o -name '*.ts' -o -name '*.cjs' \\) | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-code-graph/mcp_server/tools/index.ts
.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts
.opencode/skills/system-code-graph/mcp_server/core/config.ts
.opencode/skills/system-code-graph/mcp_server/code-index-cli-manifest.ts
.opencode/skills/system-code-graph/mcp_server/dist/code-index-cli.js
.opencode/skills/system-code-graph/mcp_server/dist/code-index-cli.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/tools/code-graph-tools.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/tools/index.js
.opencode/skills/system-code-graph/mcp_server/dist/tools/code-graph-tools.js
.opencode/skills/system-code-graph/mcp_server/dist/tools/index.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/core/config.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/core/config.js
.opencode/skills/system-code-graph/mcp_server/dist/code-index-cli-manifest.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/tool-schemas.js
.opencode/skills/system-code-graph/mcp_server/dist/index.js
.opencode/skills/system-code-graph/mcp_server/dist/code-index-cli-manifest.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/runtime-detection.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/recovery-procedures.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/budget-allocator.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/close-db-assertion.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/indexer-types.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/exclude-rule-classifier.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/cross-file-edge-resolver.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/apply-metadata.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/working-set-tracker.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/readiness-contract.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/tree-sitter-parser.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/indexer-types.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/readiness-contract.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/config-defaults.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/structural-indexer.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/ensure-ready.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/budget-allocator.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/gold-battery-runner.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/graph/bfs-traversal.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/graph/bfs-traversal.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/compact-merger.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/canonical-db-dir.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/index.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/symbol-bm25-resolver.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/phase-runner.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/owner-lease.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/utils/workspace-path.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/utils/workspace-path.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/close-db-assertion.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/code-graph-contracts.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/mcp-types.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/index-scope.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/canonical-path.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/metrics-stub.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/logger.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/hook-state.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/mcp-types.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/assert-never.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/code-graph-contracts.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/shared-payload.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/codex-hook-policy.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/logger.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/canonical-path.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/assert-never.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/metrics-stub.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/codex-hook-policy.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/index-scope.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/shared-payload.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/shared/hook-state.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/diff-parser.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/ensure-ready.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/runtime-detection.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/gold-query-verifier.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/apply-orchestrator.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/gold-query-verifier.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/diff-parser.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/structural-indexer.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/index-scope-policy.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/apply-orchestrator.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/working-set-tracker.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/query-intent-classifier.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/readiness-marker.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/code-graph-db.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/readiness-marker.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/ops-hardening.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/auto-rescan-policy.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/apply-metadata.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/seed-resolver.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/phase-runner.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/recovery-procedures.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/doc-symbol-extractor.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/seed-resolver.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/ipc/socket-server.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/ipc/launcher-idle-timeout.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/ipc/socket-server.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/ipc/launcher-idle-timeout.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/cross-file-edge-resolver.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/code-graph-context.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/auto-rescan-policy.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/parser-skip-list.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/canonical-db-dir.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/code-graph-context.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/owner-lease.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/query-intent-classifier.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/code-graph-db.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/index.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/edge-drift.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/startup-brief.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/query-result-adapter.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/parser-skip-list.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/exclude-rule-classifier.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/edge-drift.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/gold-battery-runner.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/config-defaults.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/index-scope-policy.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/tree-sitter-parser.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/compact-merger.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/symbol-bm25-resolver.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/ops-hardening.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/doc-symbol-extractor.js
.opencode/skills/system-code-graph/mcp_server/dist/lib/query-result-adapter.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/lib/startup-brief.js
.opencode/skills/system-code-graph/mcp_server/dist/index.d.ts
.opencode/skills/system-code-graph/mcp_server/dist/handlers/detect-changes.d.ts

exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-code-index-launcher.cjs | sed -n '740,1120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-code-index-launcher.cjs | sed -n '313,740p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

exec
/bin/zsh -lc "nl -ba .opencode/bin/lib/launcher-ipc-bridge.cjs | sed -n '1,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts | sed -n '1000,1095p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
  1076	
  1077	export function closeDbWithAssertion(): void {
  1078	  const handle = db;
  1079	  closeDb();
  1080	  assertDbHandleClosed(handle);
  1081	}
  1082	
  1083	function getMetadata(key: string): string | null {
  1084	  const d = getDb();
  1085	  const row = d.prepare('SELECT value FROM code_graph_metadata WHERE key = ?').get(key) as { value: string } | undefined;
  1086	  return row?.value ?? null;
  1087	}
  1088	
  1089	function setMetadata(key: string, value: string): void {
  1090	  const d = getDb();
  1091	  const now = new Date().toISOString();
  1092	  d.prepare(`
  1093	    INSERT INTO code_graph_metadata (key, value, updated_at)
  1094	    VALUES (?, ?, ?)
  1095	    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at

exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-code-index-launcher.cjs | sed -n '1120,1335p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/bin/code-index.cjs | sed -n '80,125p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
    80	    fs.writeFileSync(sourceHashState, `${JSON.stringify({ version: 1, sourceHash })}\n`);
    81	  } catch {
    82	    // Freshness metadata is an optimization; stale detection remains conservative.
    83	  }
    84	}
    85	
    86	function ensureFreshDist() {
    87	  if (!fs.existsSync(cliDist)) {
    88	    fail(`code-index dist entrypoint is missing: ${cliDist}. Run tsc -p .opencode/skills/system-code-graph/tsconfig.json.`);
    89	  }
    90	  if (allowStale) return;
    91	  const existingSources = sourceCandidates();
    92	  if (existingSources.length === 0) return;
    93	  const currentSourceHash = hashSourceFiles(existingSources);
    94	  if (readStoredSourceHash() === currentSourceHash) return;
    95	  const newestSourceMtime = Math.max(...existingSources.map((filePath) => fs.statSync(filePath).mtimeMs));
    96	  const distMtime = fs.statSync(cliDist).mtimeMs;
    97	  if (newestSourceMtime > distMtime) {
    98	    fail('code-index dist entrypoint is stale. Run tsc -p .opencode/skills/system-code-graph/tsconfig.json.');
    99	  }
   100	  writeStoredSourceHash(currentSourceHash);
   101	}
   102	
   103	function ensureSocketDir() {
   104	  if (!process.env.SPECKIT_IPC_SOCKET_DIR) {
   105	    process.env.SPECKIT_IPC_SOCKET_DIR = defaultSocketDir;
   106	  }
   107	  const socketDir = process.env.SPECKIT_IPC_SOCKET_DIR;
   108	  if (socketDir.startsWith('tcp://')) return;
   109	  fs.mkdirSync(socketDir, { recursive: true, mode: 0o700 });
   110	  const socketPath = path.join(path.resolve(socketDir), socketFileName);
   111	  if (process.platform === 'darwin' && Buffer.byteLength(socketPath) > 103) {
   112	    fail(`code-index socket path exceeds the Darwin sun_path limit: ${socketPath}. Set SPECKIT_IPC_SOCKET_DIR to a shorter directory or a tcp:// endpoint.`);
   113	  }
   114	}
   115	
   116	ensureSocketDir();
   117	ensureFreshDist();
   118	
   119	const result = spawnSync(process.execPath, [cliDist, ...process.argv.slice(2)], {
   120	  cwd: path.dirname(opencodeDir),
   121	  env: process.env,
   122	  stdio: 'inherit',
   123	});
   124	
   125	if (result.error) {

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts | sed -n '115,180p;250,410p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   115	// Allowed roots for the IPC socket directory: the workspace itself plus the system temp dirs.
   116	// The macOS `sun_path` limit (104 chars) forces deep in-workspace socket paths into a short
   117	// `/tmp` path, so a workspace-only constraint is incompatible with the documented config.
   118	// `os.tmpdir()` is portable (Linux/CI; macOS resolves to `/var/folders/...`), and `/tmp` covers
   119	// the project convention (`SPECKIT_IPC_SOCKET_DIR=/tmp/<service>`). The owner check in
   120	// `canUnlinkExistingSocket` preserves the unlink-hardening intent.
   121	function allowedSocketRoots(): string[] {
   122	  const roots = new Set<string>();
   123	  roots.add(canonicalizePath(process.cwd()));
   124	  roots.add(canonicalizePath(os.tmpdir()));
   125	  roots.add(canonicalizePath('/tmp'));
   126	  return [...roots];
   127	}
   128	
   129	function isWithinAllowedSocketRoot(candidate: string): boolean {
   130	  return allowedSocketRoots().some((root) => isWithinRoot(root, candidate));
   131	}
   132	
   133	function resolveIpcSocketPath(dbDir: string): string {
   134	  const rawSocketDir = process.env.SPECKIT_IPC_SOCKET_DIR
   135	    ? path.resolve(process.env.SPECKIT_IPC_SOCKET_DIR)
   136	    : path.resolve(dbDir);
   137	  const socketDir = canonicalizePath(rawSocketDir);
   138	  if (!isWithinAllowedSocketRoot(socketDir)) {
   139	    throw new Error(
   140	      `IPC socket directory must stay within the workspace root or a system temp dir: ${socketDir}`,
   141	    );
   142	  }
   143	  return path.join(socketDir, SOCKET_FILE_NAME);
   144	}
   145	
   146	// Only remove a stale socket at `socketPath` when it is provably ours: the parent dir resolves
   147	// inside an allowed root, the path is an actual socket, and it is owned by the current uid.
   148	// Guards against socket-hijack on shared hosts where an attacker plants a non-socket file or a
   149	// socket they own at the bind path.
   150	function canUnlinkExistingSocket(socketPath: string): boolean {
   151	  let parent: string;
   152	  try {
   153	    parent = fs.realpathSync.native(path.dirname(socketPath));
   154	  } catch (error: unknown) {
   155	    // A racing peer can remove the socket directory between the EADDRINUSE failure and this
   156	    // resolve; a vanished node is safe to reclaim, so never abort the bind on a missing path.
   157	    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
   158	      return true;
   159	    }
   160	    throw error;
   161	  }
   162	  if (!isWithinAllowedSocketRoot(parent)) {
   163	    return false;
   164	  }
   165	  try {
   166	    const stat = fs.lstatSync(socketPath);
   167	    if (!stat.isSocket()) {
   168	      return false;
   169	    }
   170	    if (typeof process.getuid === 'function' && stat.uid !== process.getuid()) {
   171	      return false;
   172	    }
   173	    return true;
   174	  } catch (error: unknown) {
   175	    // Same race on the socket node itself: if it is already gone the prior EADDRINUSE was
   176	    // transient, so treat the path as reclaimable instead of throwing and orphaning the bind.
   177	    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
   178	      return true;
   179	    }
   180	    throw error;
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

exec
/bin/zsh -lc 'rg -n "wal_checkpoint|wal_autocheckpoint|checkpoint|WAL|journal_mode|busy_timeout|SIGKILL|SIGTERM|lastHeartbeatIso|refreshOwnerLease|owner lease" .opencode/skills/system-code-graph/mcp_server/lib .opencode/bin/mk-code-index-launcher.cjs .opencode/bin/lib/launcher-ipc-bridge.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/bin/mk-code-index-launcher.cjs:332:      typeof parsed.lastHeartbeatIso === 'string' &&
.opencode/bin/mk-code-index-launcher.cjs:339:    // Missing or corrupt owner leases are treated as no active owner.
.opencode/bin/mk-code-index-launcher.cjs:392:// secondary start rewrites the owner lease before rediscovering the live
.opencode/bin/mk-code-index-launcher.cjs:400:    if (refreshOwnerLeaseFile(ownerPid)) return;
.opencode/bin/mk-code-index-launcher.cjs:404:    log('owner lease heartbeat refresh failed (superseded); stopping heartbeat');
.opencode/bin/mk-code-index-launcher.cjs:416:    lastHeartbeatIso: new Date().toISOString(),
.opencode/bin/mk-code-index-launcher.cjs:465:  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
.opencode/bin/mk-code-index-launcher.cjs:517:function refreshOwnerLeaseFile(ownerPid, patch = {}) {
.opencode/bin/mk-code-index-launcher.cjs:524:    lastHeartbeatIso: new Date().toISOString(),
.opencode/bin/mk-code-index-launcher.cjs:576:// (.mk-code-index-launcher.json) or the owner lease (.code-graph-owner.json) names a live process.
.opencode/bin/mk-code-index-launcher.cjs:651:    process.kill(ownerPid, 'SIGTERM');
.opencode/bin/mk-code-index-launcher.cjs:657:    log(`code-index owner pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
.opencode/bin/mk-code-index-launcher.cjs:659:      process.kill(ownerPid, 'SIGKILL');
.opencode/bin/mk-code-index-launcher.cjs:686:      log('dead-socket respawn skipped; code-index owner lease changed while waiting for respawn lock');
.opencode/bin/mk-code-index-launcher.cjs:702:      log(`dead-socket respawn skipped; another launcher owns code-index owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-code-index-launcher.cjs:974:    const refreshed = refreshOwnerLeaseFile(process.pid, {
.opencode/bin/mk-code-index-launcher.cjs:980:      log('owner lease refresh to child pid failed; launcher pid remains the recorded owner');
.opencode/bin/mk-code-index-launcher.cjs:987:      // Clear the lease before mirroring the signal; process.on('exit') does not fire on SIGKILL.
.opencode/bin/mk-code-index-launcher.cjs:990:      // catchable signal (SIGTERM/SIGINT/SIGHUP/SIGQUIT) re-enters installSignalHandlers'
.opencode/bin/mk-code-index-launcher.cjs:994:      // with the signaled status (128 + n). SIGKILL is uncatchable and already mirrors.
.opencode/bin/mk-code-index-launcher.cjs:1011:  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT']) {
.opencode/bin/mk-code-index-launcher.cjs:1043:  // Orphan daemon pid recorded by a reclaimed prior owner lease. A SIGKILL'd
.opencode/bin/mk-code-index-launcher.cjs:1116:      //   writing — probe BOTH the former PID lease and the former owner lease for liveness first.
.opencode/bin/mk-code-index-launcher.cjs:1117:      //   The former owner lease (.code-graph-owner.json) is intentionally NOT copied forward.
.opencode/bin/mk-code-index-launcher.cjs:1170:    // Reap the orphan daemon recorded by the reclaimed prior owner lease before
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:28:  lastHeartbeatIso: string;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:135:        // refreshOwnerLease() returns false forever -> the heartbeat self-shuts-down the server.
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:230:    && a.lastHeartbeatIso === b.lastHeartbeatIso
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:243:    typeof candidate.lastHeartbeatIso === 'string' &&
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:315:  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:414:    lastHeartbeatIso: now.toISOString(),
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:491:export function refreshOwnerLease(
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:509:      lastHeartbeatIso: now.toISOString(),
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:316:        db.pragma('wal_checkpoint(TRUNCATE)');
.opencode/skills/system-code-graph/mcp_server/lib/README.md:201:| `owner-lease.ts` | Acquires, refreshes, classifies and releases the single Code Graph owner lease. |
.opencode/skills/system-code-graph/mcp_server/lib/README.md:254:| `acquireOwnerLease()` / `refreshOwnerLease()` / `releaseOwnerLease()` | Functions | Manage the Code Graph single-owner lifecycle lease. |
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1033:    // Explicit busy_timeout so concurrent writers wait up to 5s
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1035:    // BEFORE journal_mode/foreign_keys so any incidental contention during
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1037:    db.pragma('busy_timeout = 5000');
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1038:    db.pragma('journal_mode = WAL'); // WAL enables concurrent readers without locks

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Code Graph Tools
     3	// ───────────────────────────────────────────────────────────────
     4	// Dispatch for code graph MCP tools: scan, query, status, context, verify, apply, detect_changes.
     5	import {
     6	  handleCodeGraphScan,
     7	  handleCodeGraphQuery,
     8	  handleCodeGraphStatus,
     9	  handleCodeGraphContext,
    10	  handleClassifyQueryIntent,
    11	  handleCodeGraphVerify,
    12	  handleCodeGraphApply,
    13	  handleDetectChanges,
    14	  // Reserved import slots for future hld/lld, trace, and impact-analysis handlers.
    15	} from '../handlers/index.js';
    16	
    17	import { parseArgs } from '../lib/shared/mcp-types.js';
    18	import { CODE_GRAPH_TOOL_SCHEMAS, validateToolArgs } from '../tool-schemas.js';
    19	import type { MCPResponse } from '../lib/shared/mcp-types.js';
    20	
    21	/**
    22	 * Tool names handled by this module, derived from the schema registry so the
    23	 * membership gate cannot drift from the advertised tool surface. tool-schemas
    24	 * is the single source of truth; the dispatch switch below adds the one thing
    25	 * a schema can't carry — which handler each name maps to.
    26	 */
    27	export const TOOL_NAMES = new Set(CODE_GRAPH_TOOL_SCHEMAS.map((schema) => schema.name));
    28	
    29	/** Coerce handler response to MCPResponse (fix type literal narrowing) */
    30	function toMCP(result: { content: Array<{ type: string; text: string }> }): MCPResponse {
    31	  return {
    32	    content: result.content.map(c => ({ type: 'text' as const, text: c.text })),
    33	  };
    34	}
    35	
    36	function getMissingRequiredStringArgs(args: Record<string, unknown>, requiredKeys: string[]): string[] {
    37	  return requiredKeys.filter((key) => {
    38	    const value = args[key];
    39	    return typeof value !== 'string' || value.trim().length === 0;
    40	  });
    41	}
    42	
    43	function validationError(tool: string, missingKeys: string[]): MCPResponse {
    44	  return {
    45	    content: [{
    46	      type: 'text',
    47	      text: JSON.stringify({
    48	        status: 'error',
    49	        error: `Missing required field${missingKeys.length === 1 ? '' : 's'}: ${missingKeys.join(', ')}`,
    50	        tool,
    51	      }),
    52	    }],
    53	  };
    54	}
    55	
    56	/** Dispatch a tool call. Returns null if tool name not handled. */
    57	export async function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null> {
    58	  // Enforce the published inputSchema (enum / additionalProperties /
    59	  // minLength) before dispatch for known tools, so malformed calls are rejected
    60	  // with a field-specific error rather than reaching handlers. Required-field
    61	  // presence is still checked per-case below; numeric range stays handler-clamped.
    62	  if (TOOL_NAMES.has(name)) {
    63	    try {
    64	      validateToolArgs(name, args);
    65	    } catch (err: unknown) {
    66	      return {
    67	        content: [{
    68	          type: 'text',
    69	          text: JSON.stringify({
    70	            status: 'error',
    71	            error: err instanceof Error ? err.message : String(err),
    72	            tool: name,
    73	          }),
    74	        }],
    75	      };
    76	    }
    77	  }
    78	
    79	  switch (name) {
    80	    case 'code_graph_scan':
    81	      return toMCP(await handleCodeGraphScan(parseArgs<Parameters<typeof handleCodeGraphScan>[0]>(args)));
    82	    case 'code_graph_query': {
    83	      const missingKeys = getMissingRequiredStringArgs(args, ['operation', 'subject']);
    84	      if (missingKeys.length > 0) {
    85	        return validationError(name, missingKeys);
    86	      }
    87	      return toMCP(await handleCodeGraphQuery(parseArgs<Parameters<typeof handleCodeGraphQuery>[0]>(args)));
    88	    }
    89	    case 'code_graph_status':
    90	      parseArgs<Record<string, never>>(args);
    91	      return toMCP(await handleCodeGraphStatus());
    92	    case 'code_graph_context':
    93	      return toMCP(await handleCodeGraphContext(parseArgs<Parameters<typeof handleCodeGraphContext>[0]>(args)));
    94	    case 'code_graph_classify_query_intent': {
    95	      const missingKeys = getMissingRequiredStringArgs(args, ['query']);
    96	      if (missingKeys.length > 0) {
    97	        return validationError(name, missingKeys);
    98	      }
    99	      return toMCP(await handleClassifyQueryIntent(parseArgs<Parameters<typeof handleClassifyQueryIntent>[0]>(args)));
   100	    }
   101	    case 'code_graph_verify':
   102	      return toMCP(await handleCodeGraphVerify(parseArgs<Parameters<typeof handleCodeGraphVerify>[0]>(args)));
   103	    case 'code_graph_apply':
   104	      return toMCP(await handleCodeGraphApply(parseArgs<Parameters<typeof handleCodeGraphApply>[0]>(args)));
   105	    case 'detect_changes': {
   106	      const missingKeys = getMissingRequiredStringArgs(args, ['diff']);
   107	      if (missingKeys.length > 0) {
   108	        return validationError(name, missingKeys);
   109	      }
   110	      return toMCP(await handleDetectChanges(parseArgs<Parameters<typeof handleDetectChanges>[0]>(args)));
   111	    }
   112	    // Reserved dispatch slots for future hld/lld, trace, and impact-analysis cases.
   113	    default:
   114	      return null;
   115	  }
   116	}

exec
/bin/zsh -lc "rg -n \"startIpcSocketServer|resolveIpcSocketPath|initDb|getDb|refreshOwnerLease|owner lease|SIGTERM|closeDb|process.on\\('SIG|shutdown|code_graph_scan\" .opencode/skills/system-code-graph/mcp_server/index.ts .opencode/skills/system-code-graph/mcp_server/dist/index.js .opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts .opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts:80:    case 'code_graph_scan':
.opencode/skills/system-code-graph/mcp_server/index.ts:20:import { closeDbWithAssertion, refreshOwnerLease } from './lib/index.js';
.opencode/skills/system-code-graph/mcp_server/index.ts:24:  resolveIpcSocketPath,
.opencode/skills/system-code-graph/mcp_server/index.ts:25:  startIpcSocketServer,
.opencode/skills/system-code-graph/mcp_server/index.ts:48:      const refreshed = refreshOwnerLease(DATABASE_DIR, process.pid);
.opencode/skills/system-code-graph/mcp_server/index.ts:51:        void shutdownCodeIndex('owner lease moved to another process').finally(() => process.exit(0));
.opencode/skills/system-code-graph/mcp_server/index.ts:64:  closeDbWithAssertion();
.opencode/skills/system-code-graph/mcp_server/index.ts:70:  closeDbWithAssertion();
.opencode/skills/system-code-graph/mcp_server/index.ts:94:let shutdownPromise: Promise<void> | null = null;
.opencode/skills/system-code-graph/mcp_server/index.ts:96:async function shutdownCodeIndex(reason: string): Promise<void> {
.opencode/skills/system-code-graph/mcp_server/index.ts:97:  if (shutdownPromise) return shutdownPromise;
.opencode/skills/system-code-graph/mcp_server/index.ts:99:  shutdownPromise = (async () => {
.opencode/skills/system-code-graph/mcp_server/index.ts:114:    closeDbWithAssertion();
.opencode/skills/system-code-graph/mcp_server/index.ts:117:  return shutdownPromise;
.opencode/skills/system-code-graph/mcp_server/index.ts:121:  void shutdownCodeIndex('SIGINT').finally(() => process.exit(0));
.opencode/skills/system-code-graph/mcp_server/index.ts:123:process.once('SIGTERM', () => {
.opencode/skills/system-code-graph/mcp_server/index.ts:124:  void shutdownCodeIndex('SIGTERM').finally(() => process.exit(0));
.opencode/skills/system-code-graph/mcp_server/index.ts:144:      await shutdownCodeIndex('launcher idle timeout');
.opencode/skills/system-code-graph/mcp_server/index.ts:149:  ipcBridge = await startIpcSocketServer({
.opencode/skills/system-code-graph/mcp_server/index.ts:150:    socketPath: resolveIpcSocketPath(DATABASE_DIR),
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:135:        // refreshOwnerLease() returns false forever -> the heartbeat self-shuts-down the server.
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:491:export function refreshOwnerLease(
.opencode/skills/system-code-graph/mcp_server/dist/index.js:20:import { closeDbWithAssertion, refreshOwnerLease } from './lib/index.js';
.opencode/skills/system-code-graph/mcp_server/dist/index.js:22:import { getIpcBridgeStats, resolveIpcSocketPath, startIpcSocketServer, } from './lib/ipc/socket-server.js';
.opencode/skills/system-code-graph/mcp_server/dist/index.js:39:            const refreshed = refreshOwnerLease(DATABASE_DIR, process.pid);
.opencode/skills/system-code-graph/mcp_server/dist/index.js:42:                void shutdownCodeIndex('owner lease moved to another process').finally(() => process.exit(0));
.opencode/skills/system-code-graph/mcp_server/dist/index.js:55:    closeDbWithAssertion();
.opencode/skills/system-code-graph/mcp_server/dist/index.js:61:    closeDbWithAssertion();
.opencode/skills/system-code-graph/mcp_server/dist/index.js:77:let shutdownPromise = null;
.opencode/skills/system-code-graph/mcp_server/dist/index.js:78:async function shutdownCodeIndex(reason) {
.opencode/skills/system-code-graph/mcp_server/dist/index.js:79:    if (shutdownPromise)
.opencode/skills/system-code-graph/mcp_server/dist/index.js:80:        return shutdownPromise;
.opencode/skills/system-code-graph/mcp_server/dist/index.js:81:    shutdownPromise = (async () => {
.opencode/skills/system-code-graph/mcp_server/dist/index.js:96:        closeDbWithAssertion();
.opencode/skills/system-code-graph/mcp_server/dist/index.js:98:    return shutdownPromise;
.opencode/skills/system-code-graph/mcp_server/dist/index.js:101:    void shutdownCodeIndex('SIGINT').finally(() => process.exit(0));
.opencode/skills/system-code-graph/mcp_server/dist/index.js:103:process.once('SIGTERM', () => {
.opencode/skills/system-code-graph/mcp_server/dist/index.js:104:    void shutdownCodeIndex('SIGTERM').finally(() => process.exit(0));
.opencode/skills/system-code-graph/mcp_server/dist/index.js:122:            await shutdownCodeIndex('launcher idle timeout');
.opencode/skills/system-code-graph/mcp_server/dist/index.js:127:    ipcBridge = await startIpcSocketServer({
.opencode/skills/system-code-graph/mcp_server/dist/index.js:128:        socketPath: resolveIpcSocketPath(DATABASE_DIR),

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts | sed -n '1,540p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
   181	        const now = Date.now();
   182	        const ageMs = ownerLeaseMutationLockAgeMs(lockPath, now);
   183	        if (ageMs !== null && ageMs > WEDGED_MUTATION_LOCK_MAX_AGE_MS) {
   184	          try {
   185	            if (
   186	              readOwnerLeaseMutationLockPid(lockPath) === null &&
   187	              ownerLeaseMutationLockAgeMs(lockPath, now) === ageMs
   188	            ) {
   189	              unlinkSync(lockPath);
   190	            }
   191	            continue;
   192	          } catch (unlinkError: unknown) {
   193	            const unlinkCode = unlinkError && typeof unlinkError === 'object' && 'code' in unlinkError
   194	              ? (unlinkError as NodeJS.ErrnoException).code
   195	              : undefined;
   196	            if (unlinkCode !== 'ENOENT') {
   197	              throw unlinkError;
   198	            }
   199	          }
   200	        }
   201	      }
   202	
   203	      return null;
   204	    }
   205	  }
   206	
   207	  return null;
   208	}
   209	
   210	function releaseOwnerLeaseMutationLock(lock: OwnerLeaseMutationLock): void {
   211	  try {
   212	    closeSync(lock.fd);
   213	  } finally {
   214	    try {
   215	      unlinkSync(lock.lockPath);
   216	    } catch (error: unknown) {
   217	      const code = error && typeof error === 'object' && 'code' in error ? (error as NodeJS.ErrnoException).code : undefined;
   218	      if (code !== 'ENOENT') {
   219	        throw error;
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
   451	        : existingClassification ?? 'live-owner',
   452	    };
   453	  }
   454	
   455	  try {
   456	    const current = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
   457	    if (current && !isSameOwnerLease(current, existing)) {
   458	      return {
   459	        acquired: false,
   460	        holder: current,
   461	        leasePath,
   462	        classification: classifyOwner(current, {
   463	          processKill: options.processKill,
   464	          readParentPid: options.readParentPid,
   465	          now,
   466	        }),
   467	      };
   468	    }
   469	    if (current) {
   470	      const currentClassification = classifyOwner(current, {
   471	        processKill: options.processKill,
   472	        readParentPid: options.readParentPid,
   473	        now,
   474	      });
   475	      if (
   476	        currentClassification === 'live-owner' ||
   477	        currentClassification === 'symlink-alias' ||
   478	        currentClassification === 'unknown-eperm'
   479	      ) {
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

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/handlers/index.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Code Graph Handlers Index
     3	// ───────────────────────────────────────────────────────────────
     4	export { handleCodeGraphScan } from './scan.js';
     5	export { handleCodeGraphQuery } from './query.js';
     6	export { handleCodeGraphStatus } from './status.js';
     7	export { handleCodeGraphContext } from './context.js';
     8	export { handleClassifyQueryIntent } from './classify-query-intent.js';
     9	export { handleCodeGraphVerify } from './verify.js';
    10	export { handleCodeGraphApply } from './apply.js';
    11	export { handleDetectChanges } from './detect-changes.js';

exec
/bin/zsh -lc "rg -n \"function handleCodeGraphScan|export async function handleCodeGraphScan|code_graph_scan|scan\" .opencode/skills/system-code-graph/mcp_server/handlers .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2084: * Phases that compose the scan flow.
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2130:// incremental-scan budget. The correctness cost of any positive cap: when a
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2221:  scanOutcomeRef: { value: 'success' | 'error' },
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2260:      console.error(`[structural-indexer] scanned ${allFiles.size} files (excluded: gitignored=${excludedByGitignore}, default=${excludedByDefault})`);
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2446:          'spec_kit.graph.scan_duration_ms',
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2448:          { outcome: scanOutcomeRef.value },
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2470:  const scanOutcomeRef: { value: 'success' | 'error' } = { value: 'success' };
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2472:  const phases = buildIndexPhases(config, options, speckitScanStart, scanOutcomeRef);
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2475:  // emit the spec_kit.graph.scan_duration_ms histogram. The emit-metrics
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2483:    // Preserve the array-with-scan-metadata shape exported by the
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2484:    // historical inline flow so existing callers (handlers/scan.ts,
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2494:    scanOutcomeRef.value = 'error';
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2498:          'spec_kit.graph.scan_duration_ms',
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:32:import { handleCodeGraphScan, type ScanArgs } from '../handlers/scan.js';
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:37:export type ApplyOperation = 'rescan' | 'prune-excludes' | 'repair-nodes' | 'recover-sqlite-corruption' | 'rollback-bad-apply';
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:60:  scanIncremental: boolean | null;
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:81:  scan?: (args: ScanArgs) => Promise<unknown>;
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:208:      scanIncremental: false,
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:217:      scanIncremental: null,
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:230:      scanIncremental: true,
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:238:    scanIncremental: false,
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:246:  return classification.state === 'fresh' ? 'rescan' : 'rescan';
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:325:  const scan = options.scan ?? runDefaultScan;
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:329:    case 'rescan':
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:330:      await scan({
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:332:        incremental: classification.scanIncremental ?? false,
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:341:          scan: (scanArgs) => scan({ rootDir: args.rootDir, incremental: scanArgs.incremental }),
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:350:          scan: (scanArgs) => scan({ rootDir: args.rootDir, incremental: scanArgs.incremental }),
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:388:        await scan({
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:408:      // self-healing (an incremental scan re-skips quarantined files), so a
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:409:      // scan would be a misleading no-op for these entries.
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:449:      operation: args.operation ?? 'rescan',
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:607:      scan: (scanArgs) => (options.scan ?? runDefaultScan)({ rootDir: args.rootDir, incremental: scanArgs.incremental }),
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:651:      scan: (scanArgs) => (options.scan ?? runDefaultScan)({ rootDir: args.rootDir, incremental: scanArgs.incremental }),
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:730:    action: input.action === 'none' || input.action === 'selective_reindex' || input.action === 'full_scan'
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:257:  nextTool: 'code_graph_scan' | 'code_graph_query' | 'rg';
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:258:  reason: 'full_scan_required' | 'selective_reindex' | 'scan_failed' | 'scan_declined';
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:259:  retryAfter?: 'scan_complete';
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:519:// sibling code-graph handlers (scan, status, context) can share one
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:951:  // `action === 'full_scan' && !inlineIndexPerformed`, which let two non-fresh
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:965:      reason: 'scan_failed',
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:969:  // Any non-fresh graph that reached the block path needs a scan before reads
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:970:  // can be trusted (full_scan, empty, or a stale graph a selective reindex
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:974:      nextTool: 'code_graph_scan',
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:975:      reason: readiness.action === 'selective_reindex' ? 'selective_reindex' : 'full_scan_required',
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:976:      retryAfter: 'scan_complete',
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:996:    message: `code_graph_full_scan_required: ${readiness.reason}`,
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1003:      requiredAction: 'code_graph_scan',
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1004:      blockReason: 'full_scan_required',
.opencode/skills/system-code-graph/mcp_server/handlers/index.ts:4:export { handleCodeGraphScan } from './scan.js';
.opencode/skills/system-code-graph/mcp_server/handlers/README.md:23:- Structural handlers cover scan, query, status, context, verify and apply-mode recovery.
.opencode/skills/system-code-graph/mcp_server/handlers/README.md:25:- `status.ts` / `scan.ts` / `verify.ts` back the `code_graph_status` / `code_graph_scan` / `code_graph_verify` availability, reindex and feedback tools directly against the tree-sitter graph.
.opencode/skills/system-code-graph/mcp_server/handlers/README.md:57:+-- scan.ts              # Workspace indexing entrypoint
.opencode/skills/system-code-graph/mcp_server/handlers/README.md:96:+-- scan.ts
.opencode/skills/system-code-graph/mcp_server/handlers/README.md:108:| `scan.ts` | Handles `code_graph_scan`, resolves scan scope and updates the SQLite graph through the indexer. |
.opencode/skills/system-code-graph/mcp_server/handlers/README.md:146:| `code_graph_scan` | MCP tool | Builds or refreshes the structural graph. |
.opencode/skills/system-code-graph/mcp_server/handlers/README.md:162:.opencode/skills/system-code-graph/node_modules/.bin/vitest --config .opencode/skills/system-code-graph/vitest.config.ts --run code-graph-query-handler code-graph-context-handler code-graph-scan detect-changes code-graph-apply
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:54:  nextTool: 'rg' | 'code_graph_scan';
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:69:  // `action === 'full_scan'`. A deleted-files-only `freshness:'stale', action:'none'`
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:96:  // - full_scan required (no inline performed) → run `code_graph_scan`
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:108:      nextTool: 'code_graph_scan',
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:109:      reason: readiness.action === 'selective_reindex' ? 'selective_reindex' : 'full_scan_required',
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:204:      // full_scan-required envelope so operators see WHY graph answers were
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:211:        : `code_graph_full_scan_required: ${readiness.reason}`;
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:212:      const requiredAction = isCrash ? 'rg' : 'code_graph_scan';
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:213:      const blockReason = isCrash ? 'readiness_check_crashed' : 'full_scan_required';
.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:8://   When the graph readiness requires a full scan (or readiness
.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:76:  if (text.includes('readiness_check_crashed') || text.includes('scan_failed')) {
.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:79:  if (readiness.action === 'full_scan' || readiness.action === 'selective_reindex'
.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:80:    || text.includes('stale') || text.includes('empty') || text.includes('code_graph_scan')) {
.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:81:    return 'code_graph_scan';
.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:119: *   - 'stale'  → block (a full or selective scan is needed first)
.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:234:  // SECURITY (parity with handlers/scan.ts): canonicalize via realpathSync
.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:267:  // Operators choose when scans run via `code_graph_scan`.
.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:279:      `graph readiness is "${blockedFreshness}" (action: ${readiness.action}); run code_graph_scan before detect_changes. Reason: ${readiness.reason}`,
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:4:// MCP tool handler for code_graph_scan — indexes workspace files.
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:221:    console.error(`[code-graph-scan] Failed to read git HEAD for ${rootDir}: ${message}`);
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:324:/** Handle code_graph_scan tool call */
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:325:export async function handleCodeGraphScan(args: ScanArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:382:    console.error(`[code-graph-scan] Git HEAD changed (${previousGitHead} -> ${currentGitHead}); honoring incremental content-hash reindex`);
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:385:  // An explicit full scan is a deliberate retry, so clear any prior global parser
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:387:  // otherwise persists until a launcher restart, making every full scan return
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:390:  // web-tree-sitter instance. Incremental scans do NOT reset — only an explicit
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:410:  // files the parser actually attempted, especially in narrow incremental scans.
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:428:    const reason = 'scope_change_scan_rejected';
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:442:      `[code-graph-scan] Blocked scope-change full scan promotion over existing graph (${priorNodeCount} prior node(s)); stored scope ${storedScope.fingerprint} differs from candidate scope ${candidateFingerprint}; pass forceScopeChange: true to allow scope replacement.`,
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:448:      action: 'full_scan',
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:450:      reason: 'scope-change scan rejected to preserve existing graph state',
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:488:              `scope-change scan rejected; existing graph has ${priorNodeCount} node(s)`,
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:505:    const reason = 'zero_node_scan_rejected';
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:519:      `[code-graph-scan] Blocked zero-node full scan promotion over existing graph (${priorNodeCount} prior node(s)); pass forceZeroNodeReset:true to allow destructive reset.`,
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:525:      action: 'full_scan',
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:527:      reason: 'zero-node scan rejected to preserve existing graph state',
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:565:              `zero-node scan rejected; existing graph has ${priorNodeCount} node(s)`,
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:593:        graphDb.removeFile(filePath, { reason: 'full_scan_unindexed_tracked_file' });
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:613:      // Defer the dangling-target edge prune per-file. A full scan
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:649:  const scanPromotable = !severeParseErrorScan && structuralErrors.length === 0;
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:654:  const failedScan = scanPromotable
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:669:  if (scanPromotable && filesIndexed > 0 && results.length > 0) {
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:673:  if (scanPromotable && currentGitHead) {
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:676:  if (scanPromotable && detectorProvenanceSummary.dominant !== 'unknown') {
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:679:  if (scanPromotable) {
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:687:  // Refresh candidate manifest after a successful scan so
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:690:  // very next call after an explicit user-triggered scan. Incremental scans
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:693:  if (scanPromotable) {
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:697:      // Best-effort: manifest recording must never block a successful scan
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:704:    && scanPromotable
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:711:  const crossFileCallResolution = filesIndexed > 0 && scanPromotable
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:724:  if (scanPromotable && filesIndexed > 0 && graphEdgeEnrichmentSummary) {
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:726:  } else if (scanPromotable && filesIndexed > 0) {
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:739:  // Report POST-PERSIST DB counts so the scan response
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:744:  // scan response and immediate status. The DB read is cheap (2 COUNT(*)
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:753:  const scanResult: ScanResult = {
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:781:        ? [`scan metadata promotion blocked: real parse error ratio ${parseErrorRatio.toFixed(2)} exceeds ${DEFAULT_FATAL_PARSE_ERROR_RATIO}`]
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:797:    scanResult.verification = verification;
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:802:    action: fullReindexTriggered || !effectiveIncremental ? 'full_scan' : 'selective_reindex',
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:805:      ? 'scan completed and persisted current graph state'
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:806:      : 'scan completed but no graph data was persisted',
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:815:          ...scanResult,
.opencode/skills/system-code-graph/mcp_server/handlers/verify.ts:80:// rescan with matching scope or pass `forceScopeChange`. The
.opencode/skills/system-code-graph/mcp_server/handlers/verify.ts:95:    recommendation: 'rescan with matching scope or pass forceScopeChange',
.opencode/skills/system-code-graph/mcp_server/handlers/verify.ts:228:    // can decide whether to rescan or override. The legacy block

exec
/bin/zsh -lc "rg -n \"export async function handleCodeGraphScan|handleCodeGraphScan|code_graph_scan\" .opencode/skills/system-code-graph/mcp_server/handlers -g '*.ts'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:257:  nextTool: 'code_graph_scan' | 'code_graph_query' | 'rg';
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:974:      nextTool: 'code_graph_scan',
.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1003:      requiredAction: 'code_graph_scan',
.opencode/skills/system-code-graph/mcp_server/handlers/index.ts:4:export { handleCodeGraphScan } from './scan.js';
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:54:  nextTool: 'rg' | 'code_graph_scan';
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:96:  // - full_scan required (no inline performed) → run `code_graph_scan`
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:108:      nextTool: 'code_graph_scan',
.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:212:      const requiredAction = isCrash ? 'rg' : 'code_graph_scan';
.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:80:    || text.includes('stale') || text.includes('empty') || text.includes('code_graph_scan')) {
.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:81:    return 'code_graph_scan';
.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:267:  // Operators choose when scans run via `code_graph_scan`.
.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:279:      `graph readiness is "${blockedFreshness}" (action: ${readiness.action}); run code_graph_scan before detect_changes. Reason: ${readiness.reason}`,
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:4:// MCP tool handler for code_graph_scan — indexes workspace files.
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:324:/** Handle code_graph_scan tool call */
.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:325:export async function handleCodeGraphScan(args: ScanArgs): Promise<{ content: Array<{ type: string; text: string }> }> {

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts | sed -n '2080,2520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  2080	  return results;
  2081	}
  2082	
  2083	/**
  2084	 * Phases that compose the scan flow.
  2085	 *
  2086	 * The flow is decomposed into typed phases declared with explicit
  2087	 * `inputs[]` / `output` so the phase-runner can topologically sort,
  2088	 * reject cycles/duplicates/missing-deps, and pass each phase ONLY
  2089	 * the outputs of phases it lists in `inputs`.
  2090	 *
  2091	 * The decomposition mirrors the existing inline flow — it does not
  2092	 * change behavior, ordering, or persistence semantics:
  2093	 *   1. find-candidates  → discovers candidate files
  2094	 *   2. parse-candidates → reads + parses each candidate
  2095	 *   3. finalize         → cross-file dedup + heuristic edges
  2096	 *   4. emit-metrics     → speckit metrics histograms/counters
  2097	 */
  2098	type FindCandidatesOutput = {
  2099	  candidateFiles: string[];
  2100	  warnings: string[];
  2101	  capExceeded: FileFindResult['capExceeded'];
  2102	};
  2103	type ParseCandidatesOutput = FindCandidatesOutput & {
  2104	  results: ParseResult[];
  2105	  preParseSkippedCount: number;
  2106	  unsupportedLanguageSkipped: number;
  2107	  forceParsedFiles: string[];
  2108	};
  2109	type FinalizeOutput = {
  2110	  finalizedResults: ParseResult[];
  2111	  preParseSkippedCount: number;
  2112	  unsupportedLanguageSkipped: number;
  2113	  forceParsedFiles: string[];
  2114	  warnings: string[];
  2115	  capExceeded: FileFindResult['capExceeded'];
  2116	};
  2117	
  2118	const REVERSE_DEP_FORCE_PARSE_ENV = 'SPECKIT_CODE_GRAPH_REVERSE_DEP_FORCE_PARSE';
  2119	const REVERSE_DEP_FORCE_PARSE_DEGREE_CAP_ENV = 'SPECKIT_CODE_GRAPH_REVERSE_DEP_DEGREE_CAP';
  2120	// A high-importer dependency (a shared types module or a barrel index) would
  2121	// re-parse its entire fan-in on every symbol-identity change without a ceiling.
  2122	// Fifteen bounds the blast radius to the common-to-moderate refactor (a
  2123	// dependency with up to fifteen importers still rebinds in full) while leaving a
  2124	// hot fan-in hub to the lazy rebind on its importers' next own edit. Fifteen is
  2125	// chosen from a degree-sweep benchmark over importer counts five through
  2126	// twenty-five: rebind cost is linear in importer count with no cost knee and is
  2127	// cheap through the measured range, so a higher cap is purely a correctness gain
  2128	// there, while a firm bound still protects the unmeasured extreme tail (a hub
  2129	// with hundreds of importers) whose linear-extrapolated cost would exceed an
  2130	// incremental-scan budget. The correctness cost of any positive cap: when a
  2131	// renamed dependency's importer degree exceeds the cap, ALL of its importer
  2132	// edges stay durably stale until each importer is edited for its own reasons,
  2133	// because the repair drops that dependency from the force-parse expansion.
  2134	// Setting the cap env to 0 restores the uncapped behavior and repairs every
  2135	// importer regardless of fan-in. The cap only takes effect when the force-parse
  2136	// flag is on, so the default has no effect while that flag is off.
  2137	const DEFAULT_REVERSE_DEP_DEGREE_CAP = 15;
  2138	
  2139	function reverseDepForceParseEnabled(): boolean {
  2140	  return process.env[REVERSE_DEP_FORCE_PARSE_ENV] === 'true';
  2141	}
  2142	
  2143	// The force-parse repair pulls every importer of a refactored dependency back
  2144	// into the parse batch so cross-file edges rebind to the new symbol ids. A hot
  2145	// high-importer dependency (a shared types module or a barrel index) would
  2146	// otherwise re-parse its entire fan-in on every symbol-identity change. A
  2147	// positive cap bounds that blast radius: a dependency whose importer fan-in
  2148	// degree exceeds the cap is left to the lazy rebind on its importers' next own
  2149	// edit, so a rename of a high-fan-in dependency does not trigger a whole-graph
  2150	// re-parse. A cap of zero means uncapped, which is byte-identical to the pre-cap
  2151	// force-parse behavior.
  2152	function getReverseDepDegreeCap(): number {
  2153	  const raw = process.env[REVERSE_DEP_FORCE_PARSE_DEGREE_CAP_ENV];
  2154	  if (raw === undefined || raw === '') {
  2155	    return DEFAULT_REVERSE_DEP_DEGREE_CAP;
  2156	  }
  2157	  const parsed = Number.parseInt(raw, 10);
  2158	  if (!Number.isFinite(parsed) || parsed < 0) {
  2159	    return DEFAULT_REVERSE_DEP_DEGREE_CAP;
  2160	  }
  2161	  return parsed;
  2162	}
  2163	
  2164	function getSupportedCandidateLanguage(
  2165	  filePath: string,
  2166	  config: IndexerConfig,
  2167	): SupportedLanguage | null {
  2168	  const language = detectLanguage(filePath);
  2169	  if (!language || !config.languages.includes(language)) {
  2170	    return null;
  2171	  }
  2172	  return language;
  2173	}
  2174	
  2175	async function parseCandidateFile(
  2176	  filePath: string,
  2177	  language: SupportedLanguage,
  2178	  config: IndexerConfig,
  2179	): Promise<ParseResult | null> {
  2180	  try {
  2181	    const content = readFileSync(filePath, 'utf-8');
  2182	    return await parseFile(filePath, content, language, config.edgeWeights);
  2183	  } catch {
  2184	    return null;
  2185	  }
  2186	}
  2187	
  2188	function groupStoredSymbolIdsByFile(rows: Array<{ filePath: string; symbolId: string }>): Map<string, Set<string>> {
  2189	  const grouped = new Map<string, Set<string>>();
  2190	  for (const row of rows) {
  2191	    const symbolIds = grouped.get(row.filePath) ?? new Set<string>();
  2192	    symbolIds.add(row.symbolId);
  2193	    grouped.set(row.filePath, symbolIds);
  2194	  }
  2195	  return grouped;
  2196	}
  2197	
  2198	function symbolIdentityChanged(
  2199	  storedSymbolIds: Set<string> | undefined,
  2200	  currentNodes: CodeNode[],
  2201	): boolean {
  2202	  if (!storedSymbolIds || storedSymbolIds.size === 0) {
  2203	    return false;
  2204	  }
  2205	  const currentSymbolIds = new Set(currentNodes.map((node) => node.symbolId));
  2206	  if (storedSymbolIds.size !== currentSymbolIds.size) {
  2207	    return true;
  2208	  }
  2209	  for (const symbolId of storedSymbolIds) {
  2210	    if (!currentSymbolIds.has(symbolId)) {
  2211	      return true;
  2212	    }
  2213	  }
  2214	  return false;
  2215	}
  2216	
  2217	function buildIndexPhases(
  2218	  config: IndexerConfig,
  2219	  options: IndexFilesOptions,
  2220	  speckitScanStart: number,
  2221	  scanOutcomeRef: { value: 'success' | 'error' },
  2222	): Phase[] {
  2223	  const skipFreshFiles = options.skipFreshFiles ?? true;
  2224	  const moduleResolver = getConfiguredModuleResolver(config);
  2225	
  2226	  const findCandidates: Phase<Record<string, unknown>, FindCandidatesOutput> = {
  2227	    name: 'find-candidates',
  2228	    inputs: [],
  2229	    run() {
  2230	      if (options.specificFiles && options.specificFiles.length > 0) {
  2231	        const candidateFiles = collectSpecificFiles(
  2232	          config,
  2233	          options.specificFiles,
  2234	        );
  2235	        console.error(`[structural-indexer] refreshed ${candidateFiles.length} specific file(s)`);
  2236	        return {
  2237	          candidateFiles,
  2238	          warnings: [],
  2239	          capExceeded: { maxNodes: false, depth: false, gitignoreSize: false },
  2240	        };
  2241	      }
  2242	
  2243	      const allFiles = new Set<string>();
  2244	      let excludedByDefault = 0;
  2245	      let excludedByGitignore = 0;
  2246	      const warnings: string[] = [];
  2247	      const capExceeded = { maxNodes: false, depth: false, gitignoreSize: false };
  2248	
  2249	      for (const pattern of config.includeGlobs) {
  2250	        const found = findFiles(config, pattern);
  2251	        excludedByDefault += found.excludedByDefault;
  2252	        excludedByGitignore += found.excludedByGitignore;
  2253	        warnings.push(...found.warnings);
  2254	        capExceeded.maxNodes = capExceeded.maxNodes || found.capExceeded.maxNodes;
  2255	        capExceeded.depth = capExceeded.depth || found.capExceeded.depth;
  2256	        capExceeded.gitignoreSize = capExceeded.gitignoreSize || found.capExceeded.gitignoreSize;
  2257	        found.files.forEach(f => allFiles.add(f));
  2258	      }
  2259	
  2260	      console.error(`[structural-indexer] scanned ${allFiles.size} files (excluded: gitignored=${excludedByGitignore}, default=${excludedByDefault})`);
  2261	      return { candidateFiles: [...allFiles], warnings, capExceeded };
  2262	    },
  2263	  };
  2264	
  2265	  const parseCandidates: Phase<{ 'find-candidates': FindCandidatesOutput }, ParseCandidatesOutput> = {
  2266	    name: 'parse-candidates',
  2267	    inputs: ['find-candidates'],
  2268	    async run(deps) {
  2269	      const { candidateFiles, warnings, capExceeded } = deps['find-candidates'];
  2270	      const results: ParseResult[] = [];
  2271	      let preParseSkippedCount = 0;
  2272	      let unsupportedLanguageSkipped = 0;
  2273	      const forceParse = new Set<string>();
  2274	
  2275	      if (skipFreshFiles && reverseDepForceParseEnabled()) {
  2276	        const supportedLanguagesByFile = new Map<string, SupportedLanguage>();
  2277	        const supportedCandidateFiles: string[] = [];
  2278	
  2279	        for (const file of candidateFiles) {
  2280	          const language = getSupportedCandidateLanguage(file, config);
  2281	          if (!language) {
  2282	            unsupportedLanguageSkipped++;
  2283	            continue;
  2284	          }
  2285	          supportedLanguagesByFile.set(file, language);
  2286	          supportedCandidateFiles.push(file);
  2287	        }
  2288	
  2289	        const staleFiles = supportedCandidateFiles.filter((file) => isFileStale(file));
  2290	        const storedSymbolIdsByFile = groupStoredSymbolIdsByFile(querySymbolIdsForFiles(staleFiles));
  2291	        const parsedByFile = new Map<string, ParseResult>();
  2292	        const attemptedFiles = new Set<string>();
  2293	
  2294	        for (const file of staleFiles) {
  2295	          if (options.signal?.aborted) {
  2296	            throw new Error(`parse-candidates aborted (deadline signal) after ${parsedByFile.size} parsed`);
  2297	          }
  2298	          const language = supportedLanguagesByFile.get(file);
  2299	          if (!language) {
  2300	            continue;
  2301	          }
  2302	          attemptedFiles.add(file);
  2303	          const result = await parseCandidateFile(file, language, config);
  2304	          if (result) {
  2305	            parsedByFile.set(file, result);
  2306	          }
  2307	        }
  2308	
  2309	        const refactorChangedFiles = [...parsedByFile.values()]
  2310	          .filter((result) => symbolIdentityChanged(storedSymbolIdsByFile.get(result.filePath), result.nodes))
  2311	          .map((result) => result.filePath);
  2312	
  2313	        // Bound the force-parse blast radius. A positive degree cap drops a
  2314	        // refactored dependency from the force-parse expansion when its own
  2315	        // importer fan-in degree exceeds the cap, so a rename of a hot
  2316	        // high-importer dependency does not re-parse its whole fan-in. The
  2317	        // dropped dependency's importers rebind lazily on their next own edit.
  2318	        // A cap of zero leaves every refactored dependency in, byte-identical
  2319	        // to the uncapped behavior.
  2320	        const degreeCap = getReverseDepDegreeCap();
  2321	        const forceParseSourceFiles = degreeCap > 0
  2322	          ? queryFileDegrees(refactorChangedFiles)
  2323	              .filter((entry) => entry.degree <= degreeCap)
  2324	              .map((entry) => entry.filePath)
  2325	          : refactorChangedFiles;
  2326	
  2327	        const knownCandidateFiles = new Set(supportedCandidateFiles);
  2328	        for (const dependent of queryImportersOf(forceParseSourceFiles)) {
  2329	          if (knownCandidateFiles.has(dependent.importerFilePath)) {
  2330	            forceParse.add(dependent.importerFilePath);
  2331	            continue;
  2332	          }
  2333	          const language = getSupportedCandidateLanguage(dependent.importerFilePath, config);
  2334	          if (language) {
  2335	            supportedLanguagesByFile.set(dependent.importerFilePath, language);
  2336	            supportedCandidateFiles.push(dependent.importerFilePath);
  2337	            knownCandidateFiles.add(dependent.importerFilePath);
  2338	            forceParse.add(dependent.importerFilePath);
  2339	          }
  2340	        }
  2341	
  2342	        for (const file of supportedCandidateFiles) {
  2343	          if (options.signal?.aborted) {
  2344	            throw new Error(`parse-candidates aborted (deadline signal) after ${results.length} parsed`);
  2345	          }
  2346	          const parsed = parsedByFile.get(file);
  2347	          if (parsed) {
  2348	            results.push(parsed);
  2349	            continue;
  2350	          }
  2351	          if (attemptedFiles.has(file)) {
  2352	            continue;
  2353	          }
  2354	
  2355	          const language = supportedLanguagesByFile.get(file);
  2356	          if (!language) {
  2357	            continue;
  2358	          }
  2359	          if (!forceParse.has(file) && !isFileStale(file)) {
  2360	            preParseSkippedCount++;
  2361	            continue;
  2362	          }
  2363	
  2364	          const result = await parseCandidateFile(file, language, config);
  2365	          if (result) {
  2366	            results.push(result);
  2367	          }
  2368	        }
  2369	
  2370	        if (unsupportedLanguageSkipped > 0) {
  2371	          warnings.push(`[structural-indexer] Skipped ${unsupportedLanguageSkipped} candidate file(s) before parsing because their language is unsupported or disabled by config.languages`);
  2372	        }
  2373	
  2374	        return {
  2375	          candidateFiles,
  2376	          results,
  2377	          preParseSkippedCount,
  2378	          unsupportedLanguageSkipped,
  2379	          forceParsedFiles: [...forceParse],
  2380	          warnings,
  2381	          capExceeded,
  2382	        };
  2383	      }
  2384	
  2385	      for (const file of candidateFiles) {
  2386	        // Cooperative cancellation runs inside the parse phase. runPhases only
  2387	        // checks the deadline signal BETWEEN phases, so a large parse-candidates loop would
  2388	        // otherwise run to completion after the caller's deadline aborts and discard the result.
  2389	        // Check per file so a timeout stops the parse promptly (one-file granularity).
  2390	        if (options.signal?.aborted) {
  2391	          throw new Error(`parse-candidates aborted (deadline signal) after ${results.length} parsed`);
  2392	        }
  2393	        const language = getSupportedCandidateLanguage(file, config);
  2394	        if (!language) {
  2395	          unsupportedLanguageSkipped++;
  2396	          continue;
  2397	        }
  2398	
  2399	        // P1 perf: skip read+parse for files whose mtime matches the DB record.
  2400	        // isFileStale returns true when the file is absent from the DB or its
  2401	        // mtime has changed — only then do we pay the I/O + parse cost.
  2402	        if (skipFreshFiles && !isFileStale(file)) {
  2403	          preParseSkippedCount++;
  2404	          continue;
  2405	        }
  2406	
  2407	        const result = await parseCandidateFile(file, language, config);
  2408	        if (result) {
  2409	          results.push(result);
  2410	        }
  2411	      }
  2412	
  2413	      if (unsupportedLanguageSkipped > 0) {
  2414	        warnings.push(`[structural-indexer] Skipped ${unsupportedLanguageSkipped} candidate file(s) before parsing because their language is unsupported or disabled by config.languages`);
  2415	      }
  2416	
  2417	      return {
  2418	        candidateFiles,
  2419	        results,
  2420	        preParseSkippedCount,
  2421	        unsupportedLanguageSkipped,
  2422	        forceParsedFiles: [],
  2423	        warnings,
  2424	        capExceeded,
  2425	      };
  2426	    },
  2427	  };
  2428	
  2429	  const finalize: Phase<{ 'parse-candidates': ParseCandidatesOutput }, FinalizeOutput> = {
  2430	    name: 'finalize',
  2431	    inputs: ['parse-candidates'],
  2432	    run(deps) {
  2433	      const { results, preParseSkippedCount, unsupportedLanguageSkipped, forceParsedFiles, warnings, capExceeded } = deps['parse-candidates'];
  2434	      const finalizedResults = finalizeIndexResults(results, moduleResolver, config.edgeWeights);
  2435	      return { finalizedResults, preParseSkippedCount, unsupportedLanguageSkipped, forceParsedFiles, warnings, capExceeded };
  2436	    },
  2437	  };
  2438	
  2439	  const emitMetrics: Phase<{ finalize: FinalizeOutput }, FinalizeOutput> = {
  2440	    name: 'emit-metrics',
  2441	    inputs: ['finalize'],
  2442	    run(deps) {
  2443	      const finalize = deps.finalize;
  2444	      if (isSpeckitMetricsEnabled()) {
  2445	        speckitMetrics.recordHistogram(
  2446	          'spec_kit.graph.scan_duration_ms',
  2447	          Date.now() - speckitScanStart,
  2448	          { outcome: scanOutcomeRef.value },
  2449	        );
  2450	        const runtimeLabel = process.env.SPECKIT_RUNTIME ?? 'unknown';
  2451	        for (const r of finalize.finalizedResults) {
  2452	          for (const edge of r.edges) {
  2453	            speckitMetrics.incrementCounter(
  2454	              'spec_kit.graph.edge_detection_total',
  2455	              { edge_type: edge.edgeType, runtime: runtimeLabel },
  2456	            );
  2457	          }
  2458	        }
  2459	      }
  2460	      return finalize;
  2461	    },
  2462	  };
  2463	
  2464	  return [findCandidates, parseCandidates, finalize, emitMetrics];
  2465	}
  2466	
  2467	/** Index all matching files in the workspace */
  2468	export async function indexFiles(config: IndexerConfig, options: IndexFilesOptions = {}): Promise<IndexFilesResult> {
  2469	  const speckitScanStart = isSpeckitMetricsEnabled() ? Date.now() : 0;
  2470	  const scanOutcomeRef: { value: 'success' | 'error' } = { value: 'success' };
  2471	
  2472	  const phases = buildIndexPhases(config, options, speckitScanStart, scanOutcomeRef);
  2473	
  2474	  // Wrap runPhases in try/catch/finally so error outcomes still
  2475	  // emit the spec_kit.graph.scan_duration_ms histogram. The emit-metrics
  2476	  // phase itself only fires on the happy path (since a prior phase failure
  2477	  // short-circuits the runner); the catch block backfills the missing
  2478	  // histogram entry with `outcome: 'error'` for operator visibility.
  2479	  try {
  2480	    const outputs = await runPhases(phases, options.signal);
  2481	    const emitOutput = outputs['emit-metrics'] as FinalizeOutput;
  2482	
  2483	    // Preserve the array-with-scan-metadata shape exported by the
  2484	    // historical inline flow so existing callers (handlers/scan.ts,
  2485	    // ensure-ready.ts) keep working unchanged for backward compatibility.
  2486	    const finalizedResults = emitOutput.finalizedResults as IndexFilesResult;
  2487	    finalizedResults.preParseSkippedCount = emitOutput.preParseSkippedCount;
  2488	    finalizedResults.unsupportedLanguageSkipped = emitOutput.unsupportedLanguageSkipped;
  2489	    finalizedResults.forceParsedFiles = emitOutput.forceParsedFiles;
  2490	    finalizedResults.warnings = emitOutput.warnings;
  2491	    finalizedResults.capExceeded = emitOutput.capExceeded;
  2492	    return finalizedResults;
  2493	  } catch (error: unknown) {
  2494	    scanOutcomeRef.value = 'error';
  2495	    if (isSpeckitMetricsEnabled()) {
  2496	      try {
  2497	        speckitMetrics.recordHistogram(
  2498	          'spec_kit.graph.scan_duration_ms',
  2499	          Date.now() - speckitScanStart,
  2500	          { outcome: 'error' },
  2501	        );
  2502	      } catch (_metricErr: unknown) {
  2503	        // Best-effort: never let metric emission failures mask the original
  2504	        // Indexer error.
  2505	      }
  2506	    }
  2507	    throw error;
  2508	  }
  2509	}

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts | sed -n '324,835p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   324	/** Handle code_graph_scan tool call */
   325	export async function handleCodeGraphScan(args: ScanArgs): Promise<{ content: Array<{ type: string; text: string }> }> {
   326	  const startTime = Date.now();
   327	  const rootDir = args.rootDir ?? process.cwd();
   328	  const incremental = args.incremental !== false;
   329	  const resolvedRootDir = resolve(rootDir);
   330	
   331	  // SECURITY: Canonicalize paths via realpathSync() to prevent symlink bypass.
   332	  // A symlink inside the workspace pointing outside it would pass a lexical
   333	  // startsWith() check on the resolved (but not canonicalized) path.
   334	  const canonical = canonicalizeWorkspacePaths(resolvedRootDir);
   335	  if (!canonical) {
   336	    // Broken symlink or non-existent path — reject immediately
   337	    return {
   338	      content: [{
   339	        type: 'text',
   340	        text: JSON.stringify({
   341	          status: 'error',
   342	          error: `rootDir path is invalid or contains a broken symlink: ${relativize(resolvedRootDir, process.cwd())}`,
   343	        }),
   344	      }],
   345	    };
   346	  }
   347	  const { canonicalWorkspace, canonicalRootDir } = canonical;
   348	
   349	  if (!isWithinWorkspace(canonicalWorkspace, canonicalRootDir)) {
   350	    return {
   351	      content: [{
   352	        type: 'text',
   353	        text: JSON.stringify({
   354	          status: 'error',
   355	          error: `rootDir must stay within the workspace root; received: ${relativize(canonicalRootDir, canonicalWorkspace)}`,
   356	        }),
   357	      }],
   358	    };
   359	  }
   360	
   361	  const scopePolicy = resolveIndexScopePolicy({
   362	    includeSkills: args.includeSkills,
   363	    includeAgents: args.includeAgents,
   364	    includeCommands: args.includeCommands,
   365	    includeSpecs: args.includeSpecs,
   366	    includePlugins: args.includePlugins,
   367	    includeGlobs: args.includeGlobs,
   368	    excludeGlobs: args.excludeGlobs,
   369	  });
   370	  const config = getDefaultConfig(canonicalRootDir, scopePolicy);
   371	  const initialSkipListCount = getSkipListSummary().count;
   372	
   373	  const previousGitHead = graphDb.getLastGitHead();
   374	  const currentGitHead = getCurrentGitHead(canonicalRootDir);
   375	  const gitHeadChanged = previousGitHead !== null
   376	    && currentGitHead !== null
   377	    && previousGitHead !== currentGitHead;
   378	  const effectiveIncremental = incremental;
   379	  const fullReindexTriggered = gitHeadChanged && !effectiveIncremental;
   380	
   381	  if (gitHeadChanged && incremental) {
   382	    console.error(`[code-graph-scan] Git HEAD changed (${previousGitHead} -> ${currentGitHead}); honoring incremental content-hash reindex`);
   383	  }
   384	
   385	  // An explicit full scan is a deliberate retry, so clear any prior global parser
   386	  // quarantine before indexing. A B2 ("memory access out of bounds") quarantine
   387	  // otherwise persists until a launcher restart, making every full scan return
   388	  // zero nodes (then rejected by the zero-node guard below). resetParserHealth()
   389	  // drops the corrupted parser instance so indexing re-initializes a fresh
   390	  // web-tree-sitter instance. Incremental scans do NOT reset — only an explicit
   391	  // `incremental: false` request signals intent to retry.
   392	  if (args.incremental === false) {
   393	    resetParserHealth();
   394	  }
   395	
   396	  const results = await indexFiles(config, { skipFreshFiles: effectiveIncremental });
   397	  const detectorProvenanceSummary = summarizeDetectorProvenance(results);
   398	  let graphEdgeEnrichmentSummary = summarizeGraphEdgeEnrichment(results);
   399	  const preParseSkippedCount = effectiveIncremental ? (results.preParseSkippedCount ?? 0) : 0;
   400	  const forceParsedFiles = new Set(effectiveIncremental ? (results.forceParsedFiles ?? []) : []);
   401	  const unsupportedLanguageSkipped = results.unsupportedLanguageSkipped ?? 0;
   402	  const priorStats = graphDb.getStats();
   403	  const priorNodeCount = priorStats.totalNodes;
   404	  const candidatePersistableNodeCount = countPersistableNodes(results);
   405	  const parseErrorClassification = classifyParseErrorFiles(results);
   406	  const parseErrorCount = parseErrorClassification.realErrorCount;
   407	  const parserSkipListBypassCount = parseErrorClassification.skipListBypassCount;
   408	  // Skip-list bypasses are intentionally not parsed, so exclude them from the
   409	  // ratio denominator. The fatal threshold should measure degradation among
   410	  // files the parser actually attempted, especially in narrow incremental scans.
   411	  const parseErrorRatio = computeParseErrorRatio(parseErrorCount, results.length - parserSkipListBypassCount);
   412	  const severeParseErrorScan = parseErrorRatio > DEFAULT_FATAL_PARSE_ERROR_RATIO;
   413	  const fullScan = !effectiveIncremental;
   414	  const storedScope = graphDb.getStoredCodeGraphScope();
   415	  const candidateFingerprint = scopePolicy.fingerprint;
   416	  const scopeChangePromotionBlocked = fullScan
   417	    && priorStats.totalNodes > 0
   418	    && storedScope?.fingerprint
   419	    && !scopeFingerprintsMatchOrLegacy(storedScope.fingerprint, candidateFingerprint)
   420	    && args.forceScopeChange !== true;
   421	  const zeroNodePromotionBlocked = fullScan
   422	    && candidatePersistableNodeCount === 0
   423	    && priorNodeCount > 0
   424	    && args.forceZeroNodeReset !== true;
   425	
   426	  if (scopeChangePromotionBlocked) {
   427	    recordParseDiagnosticsForResults(results);
   428	    const reason = 'scope_change_scan_rejected';
   429	    const failedScan = graphDb.recordFailedScan({
   430	      reason,
   431	      totalFiles: results.length,
   432	      totalNodes: candidatePersistableNodeCount,
   433	      parseErrorCount,
   434	      parseErrorRatio,
   435	      previousGitHead,
   436	      currentGitHead,
   437	      scopeFingerprint: scopePolicy.fingerprint,
   438	      scopeLabel: scopePolicy.label,
   439	      errors: results.flatMap((result) => result.parseErrors).slice(0, 10),
   440	    });
   441	    console.warn(
   442	      `[code-graph-scan] Blocked scope-change full scan promotion over existing graph (${priorNodeCount} prior node(s)); stored scope ${storedScope.fingerprint} differs from candidate scope ${candidateFingerprint}; pass forceScopeChange: true to allow scope replacement.`,
   443	    );
   444	    const parseDiagnostics = relativizeParseDiagnostics(graphDb.getParseDiagnosticsSummary(), canonicalWorkspace);
   445	    const skipListSummary = getSkipListSummary();
   446	    const readinessBlock = buildReadinessBlock({
   447	      freshness: 'stale',
   448	      action: 'full_scan',
   449	      inlineIndexPerformed: false,
   450	      reason: 'scope-change scan rejected to preserve existing graph state',
   451	    });
   452	
   453	    return {
   454	      content: [{
   455	        type: 'text',
   456	        text: JSON.stringify({
   457	          status: 'blocked',
   458	          reason,
   459	          data: {
   460	            filesScanned: results.length,
   461	            filesIndexed: 0,
   462	            filesSkipped: preParseSkippedCount + unsupportedLanguageSkipped,
   463	            unsupportedLanguageSkipped,
   464	            parserSkipListBypassCount,
   465	            totalNodes: priorStats.totalNodes,
   466	            totalEdges: priorStats.totalEdges,
   467	            errors: results.flatMap((result) => {
   468	              const filePath = relativize(result.filePath, canonicalWorkspace);
   469	              return result.parseErrors.map((error) => `${filePath}: ${relativizeScanError(error, canonicalWorkspace)}`);
   470	            }).slice(0, 10),
   471	            durationMs: Date.now() - startTime,
   472	            fullScanRequested: args.incremental === false,
   473	            effectiveIncremental,
   474	            fullReindexTriggered,
   475	            currentGitHead,
   476	            previousGitHead,
   477	            detectorProvenanceSummary,
   478	            graphEdgeEnrichmentSummary,
   479	            parseDiagnostics,
   480	            parserSkipList: {
   481	              added: Math.max(0, skipListSummary.count - initialSkipListCount),
   482	              healed: 0,
   483	              totalAfterScan: skipListSummary.count,
   484	            },
   485	            staleButValidGraphFiles: graphDb.countStaleButValidParseDiagnostics(),
   486	            failedScan,
   487	            warnings: [
   488	              `scope-change scan rejected; existing graph has ${priorNodeCount} node(s)`,
   489	              `stored scope fingerprint ${storedScope.fingerprint} differs from candidate scope fingerprint ${candidateFingerprint}; pass forceScopeChange: true if intentional`,
   490	              ...(results.warnings ?? []).map(warning => relativizeScanWarning(warning, canonicalWorkspace)),
   491	            ],
   492	            capExceeded: results.capExceeded ?? { maxNodes: false, depth: false, gitignoreSize: false },
   493	            readiness: readinessBlock,
   494	            canonicalReadiness: readinessBlock.canonicalReadiness,
   495	            trustState: readinessBlock.trustState,
   496	            lastPersistedAt: priorStats.lastScanTimestamp,
   497	          },
   498	        }, null, 2),
   499	      }],
   500	    };
   501	  }
   502	
   503	  if (zeroNodePromotionBlocked) {
   504	    recordParseDiagnosticsForResults(results);
   505	    const reason = 'zero_node_scan_rejected';
   506	    const failedScan = graphDb.recordFailedScan({
   507	      reason,
   508	      totalFiles: results.length,
   509	      totalNodes: candidatePersistableNodeCount,
   510	      parseErrorCount,
   511	      parseErrorRatio,
   512	      previousGitHead,
   513	      currentGitHead,
   514	      scopeFingerprint: scopePolicy.fingerprint,
   515	      scopeLabel: scopePolicy.label,
   516	      errors: results.flatMap((result) => result.parseErrors).slice(0, 10),
   517	    });
   518	    console.warn(
   519	      `[code-graph-scan] Blocked zero-node full scan promotion over existing graph (${priorNodeCount} prior node(s)); pass forceZeroNodeReset:true to allow destructive reset.`,
   520	    );
   521	    const parseDiagnostics = relativizeParseDiagnostics(graphDb.getParseDiagnosticsSummary(), canonicalWorkspace);
   522	    const skipListSummary = getSkipListSummary();
   523	    const readinessBlock = buildReadinessBlock({
   524	      freshness: 'stale',
   525	      action: 'full_scan',
   526	      inlineIndexPerformed: false,
   527	      reason: 'zero-node scan rejected to preserve existing graph state',
   528	    });
   529	
   530	    return {
   531	      content: [{
   532	        type: 'text',
   533	        text: JSON.stringify({
   534	          status: 'blocked',
   535	          reason,
   536	          data: {
   537	            filesScanned: results.length,
   538	            filesIndexed: 0,
   539	            filesSkipped: preParseSkippedCount + unsupportedLanguageSkipped,
   540	            unsupportedLanguageSkipped,
   541	            parserSkipListBypassCount,
   542	            totalNodes: priorStats.totalNodes,
   543	            totalEdges: priorStats.totalEdges,
   544	            errors: results.flatMap((result) => {
   545	              const filePath = relativize(result.filePath, canonicalWorkspace);
   546	              return result.parseErrors.map((error) => `${filePath}: ${relativizeScanError(error, canonicalWorkspace)}`);
   547	            }).slice(0, 10),
   548	            durationMs: Date.now() - startTime,
   549	            fullScanRequested: args.incremental === false,
   550	            effectiveIncremental,
   551	            fullReindexTriggered,
   552	            currentGitHead,
   553	            previousGitHead,
   554	            detectorProvenanceSummary,
   555	            graphEdgeEnrichmentSummary,
   556	            parseDiagnostics,
   557	            parserSkipList: {
   558	              added: Math.max(0, skipListSummary.count - initialSkipListCount),
   559	              healed: 0,
   560	              totalAfterScan: skipListSummary.count,
   561	            },
   562	            staleButValidGraphFiles: graphDb.countStaleButValidParseDiagnostics(),
   563	            failedScan,
   564	            warnings: [
   565	              `zero-node scan rejected; existing graph has ${priorNodeCount} node(s)`,
   566	              ...(results.warnings ?? []).map(warning => relativizeScanWarning(warning, canonicalWorkspace)),
   567	            ],
   568	            capExceeded: results.capExceeded ?? { maxNodes: false, depth: false, gitignoreSize: false },
   569	            readiness: readinessBlock,
   570	            canonicalReadiness: readinessBlock.canonicalReadiness,
   571	            trustState: readinessBlock.trustState,
   572	            lastPersistedAt: priorStats.lastScanTimestamp,
   573	          },
   574	        }, null, 2),
   575	      }],
   576	    };
   577	  }
   578	
   579	  let filesIndexed = 0;
   580	  let filesSkipped = preParseSkippedCount + unsupportedLanguageSkipped;
   581	  let totalNodes = 0;
   582	  let totalEdges = 0;
   583	  const errors: string[] = [];
   584	  const structuralErrors: string[] = [];
   585	  const parserSkipWarnings: string[] = [];
   586	
   587	  if (effectiveIncremental) {
   588	    cleanupMissingTrackedFiles(graphDb.getTrackedFiles());
   589	  } else if (!severeParseErrorScan) {
   590	    const indexedPaths = new Set(results.map((result) => result.filePath));
   591	    for (const filePath of graphDb.getTrackedFiles()) {
   592	      if (!indexedPaths.has(filePath)) {
   593	        graphDb.removeFile(filePath, { reason: 'full_scan_unindexed_tracked_file' });
   594	      }
   595	    }
   596	  }
   597	
   598	  for (const result of results) {
   599	    // Skip unchanged files in incremental mode
   600	    if (
   601	      effectiveIncremental
   602	      && !forceParsedFiles.has(result.filePath)
   603	      && !graphDb.isFileStale(
   604	        result.filePath,
   605	        result.contentHash ? { currentContentHash: result.contentHash } : undefined,
   606	      )
   607	    ) {
   608	      filesSkipped++;
   609	      continue;
   610	    }
   611	
   612	    try {
   613	      // Defer the dangling-target edge prune per-file. A full scan
   614	      // persists files one at a time, so a cross-file IMPORTS edge whose target
   615	      // lives in a not-yet-persisted file would be pruned here and never
   616	      // restored. We sweep once with pruneDanglingEdges() after the loop and
   617	      // cross-file resolution, when every target node exists.
   618	      persistIndexedFileResult(result, { deferDanglingTargetPrune: true });
   619	
   620	      if (result.parseHealth !== 'error') {
   621	        filesIndexed++;
   622	        totalNodes += result.nodes.length;
   623	        totalEdges += result.edges.length;
   624	      }
   625	    } catch (err: unknown) {
   626	      const filePath = relativize(result.filePath, canonicalWorkspace);
   627	      const message = `${filePath}: ${err instanceof Error ? err.message : String(err)}`;
   628	      errors.push(message);
   629	      structuralErrors.push(message);
   630	    }
   631	
   632	    if (result.parseErrors.length > 0) {
   633	      const filePath = relativize(result.filePath, canonicalWorkspace);
   634	      // Parser skip-list entries are the designed safety net for grammars that
   635	      // crash on certain inputs (B1: tree-sitter API quirk; B2: WASM trap).
   636	      // Route them to warnings so they do not pollute the error count or
   637	      // obscure real persistence failures in failedScan.errors.
   638	      for (const parseError of result.parseErrors) {
   639	        const message = `${filePath}: ${parseError}`;
   640	        if (parseError.includes('Parser skipped by skip-list')) {
   641	          parserSkipWarnings.push(message);
   642	        } else {
   643	          errors.push(message);
   644	        }
   645	      }
   646	    }
   647	  }
   648	
   649	  const scanPromotable = !severeParseErrorScan && structuralErrors.length === 0;
   650	  const failedScanErrors = [
   651	    ...structuralErrors,
   652	    ...errors.filter(error => !structuralErrors.includes(error)),
   653	  ].slice(0, 10);
   654	  const failedScan = scanPromotable
   655	    ? null
   656	    : graphDb.recordFailedScan({
   657	      reason: severeParseErrorScan ? 'parse_error_threshold_exceeded' : 'structural_persistence_error',
   658	      totalFiles: results.length,
   659	      totalNodes: candidatePersistableNodeCount,
   660	      parseErrorCount,
   661	      parseErrorRatio,
   662	      previousGitHead,
   663	      currentGitHead,
   664	      scopeFingerprint: scopePolicy.fingerprint,
   665	      scopeLabel: scopePolicy.label,
   666	      errors: failedScanErrors,
   667	    });
   668	
   669	  if (scanPromotable && filesIndexed > 0 && results.length > 0) {
   670	    graphDb.setLastDetectorProvenance(results[0].detectorProvenance);
   671	  }
   672	
   673	  if (scanPromotable && currentGitHead) {
   674	    graphDb.setLastGitHead(currentGitHead);
   675	  }
   676	  if (scanPromotable && detectorProvenanceSummary.dominant !== 'unknown') {
   677	    graphDb.setLastDetectorProvenance(detectorProvenanceSummary.dominant);
   678	  }
   679	  if (scanPromotable) {
   680	    graphDb.setLastDetectorProvenanceSummary(detectorProvenanceSummary);
   681	    graphDb.setCodeGraphScope(scopePolicy);
   682	    if (filesIndexed > 0 || !effectiveIncremental) {
   683	      graphDb.bumpCodeGraphGeneration();
   684	    }
   685	  }
   686	
   687	  // Refresh candidate manifest after a successful scan so
   688	  // the next detectState() has a current baseline to compare against. Without
   689	  // this, code_graph_status reports stale ("candidate manifest drift") on the
   690	  // very next call after an explicit user-triggered scan. Incremental scans
   691	  // also discover new indexable files via find-candidates, so refresh their
   692	  // manifest after successful promotion too.
   693	  if (scanPromotable) {
   694	    try {
   695	      recordCandidateManifest(graphDb.getTrackedFiles());
   696	    } catch {
   697	      // Best-effort: manifest recording must never block a successful scan
   698	    }
   699	  }
   700	
   701	  const hasPersistedBaseline = hasUsablePersistedEdgeDistributionBaseline();
   702	  if (
   703	    !effectiveIncremental
   704	    && scanPromotable
   705	    && (!hasPersistedBaseline || args.persistBaseline === true)
   706	  ) {
   707	    const distribution = summarizeEdgeDistribution(results);
   708	    graphDb.setCodeGraphMetadata('edge_distribution_baseline', JSON.stringify(distribution));
   709	  }
   710	
   711	  const crossFileCallResolution = filesIndexed > 0 && scanPromotable
   712	    ? resolveCrossFileCallEdges()
   713	    : { resolved: 0, unresolved: 0, ambiguousSkipped: 0 };
   714	  if (hasCrossFileCallResolutionActivity(crossFileCallResolution)) {
   715	    graphEdgeEnrichmentSummary = {
   716	      ...(graphEdgeEnrichmentSummary ?? {
   717	        edgeEvidenceClass: 'inferred_heuristic' as const,
   718	        numericConfidence: 0.8,
   719	      }),
   720	      crossFileCallResolution,
   721	    };
   722	  }
   723	
   724	  if (scanPromotable && filesIndexed > 0 && graphEdgeEnrichmentSummary) {
   725	    graphDb.setLastGraphEdgeEnrichmentSummary(graphEdgeEnrichmentSummary);
   726	  } else if (scanPromotable && filesIndexed > 0) {
   727	    graphDb.clearLastGraphEdgeEnrichmentSummary();
   728	  }
   729	
   730	  // Now that every file's nodes are persisted and cross-file CALL
   731	  // edges are resolved, sweep genuinely-dangling edges ONCE. Per-file
   732	  // replaceEdges deferred this prune so forward-referenced cross-file IMPORTS
   733	  // edges (importer persisted before the imported file) survived; here their
   734	  // targets exist, so only truly-orphaned edges are removed.
   735	  if (filesIndexed > 0) {
   736	    graphDb.pruneDanglingEdges();
   737	  }
   738	
   739	  // Report POST-PERSIST DB counts so the scan response
   740	  // matches what the next code_graph_status will see. The pre-persist sums
   741	  // (totalNodes/totalEdges accumulated above) double-count edges that get
   742	  // deduped during persistence and miss edges added by enrichment that runs
   743	  // before the response is built — leading to a confusing ~1k delta between
   744	  // scan response and immediate status. The DB read is cheap (2 COUNT(*)
   745	  // queries) and gives a single source of truth for graph cardinality.
   746	  const persistedStats = graphDb.getStats();
   747	  const responseTotalNodes = persistedStats.totalNodes;
   748	  const responseTotalEdges = persistedStats.totalEdges;
   749	  const tombstones = persistedStats.tombstones ?? emptyTombstoneSummary();
   750	  const parseDiagnostics = relativizeParseDiagnostics(graphDb.getParseDiagnosticsSummary(), canonicalWorkspace);
   751	  const skipListSummary = getSkipListSummary();
   752	
   753	  const scanResult: ScanResult = {
   754	    filesScanned: results.length,
   755	    filesIndexed,
   756	    filesSkipped,
   757	    unsupportedLanguageSkipped,
   758	    parserSkipListBypassCount,
   759	    totalNodes: responseTotalNodes,
   760	    totalEdges: responseTotalEdges,
   761	    errors: errors.slice(0, 10).map(error => relativizeScanError(error, canonicalWorkspace)),
   762	    durationMs: Date.now() - startTime,
   763	    fullScanRequested: args.incremental === false,
   764	    effectiveIncremental,
   765	    fullReindexTriggered,
   766	    currentGitHead,
   767	    previousGitHead,
   768	    detectorProvenanceSummary,
   769	    graphEdgeEnrichmentSummary,
   770	    tombstones,
   771	    parseDiagnostics,
   772	    parserSkipList: {
   773	      added: Math.max(0, skipListSummary.count - initialSkipListCount),
   774	      healed: 0,
   775	      totalAfterScan: skipListSummary.count,
   776	    },
   777	    staleButValidGraphFiles: graphDb.countStaleButValidParseDiagnostics(),
   778	    failedScan,
   779	    warnings: [
   780	      ...(severeParseErrorScan
   781	        ? [`scan metadata promotion blocked: real parse error ratio ${parseErrorRatio.toFixed(2)} exceeds ${DEFAULT_FATAL_PARSE_ERROR_RATIO}`]
   782	        : []),
   783	      ...parserSkipWarnings.slice(0, 10),
   784	      ...(results.warnings ?? []).map(warning => relativizeScanWarning(warning, canonicalWorkspace)),
   785	    ],
   786	    capExceeded: results.capExceeded ?? { maxNodes: false, depth: false, gitignoreSize: false },
   787	  };
   788	  const lastPersistedAt = persistedStats.lastScanTimestamp;
   789	  const shouldVerify = args.verify === true && incremental === false;
   790	
   791	  if (shouldVerify) {
   792	    const verification = {
   793	      ...(await executeBattery(loadGoldBattery(DEFAULT_GOLD_BATTERY_PATH), handleCodeGraphQuery)),
   794	      batteryPath: DEFAULT_GOLD_BATTERY_PATH,
   795	    };
   796	    graphDb.setLastGoldVerification(verification);
   797	    scanResult.verification = verification;
   798	  }
   799	
   800	  const readinessBlock = buildReadinessBlock({
   801	    freshness: lastPersistedAt ? 'fresh' : 'empty',
   802	    action: fullReindexTriggered || !effectiveIncremental ? 'full_scan' : 'selective_reindex',
   803	    inlineIndexPerformed: true,
   804	    reason: lastPersistedAt
   805	      ? 'scan completed and persisted current graph state'
   806	      : 'scan completed but no graph data was persisted',
   807	  });
   808	
   809	  return {
   810	    content: [{
   811	      type: 'text',
   812	      text: JSON.stringify({
   813	        status: 'ok',
   814	        data: {
   815	          ...scanResult,
   816	          readiness: readinessBlock,
   817	          canonicalReadiness: readinessBlock.canonicalReadiness,
   818	          trustState: readinessBlock.trustState,
   819	          lastPersistedAt,
   820	        },
   821	      }, null, 2),
   822	    }],
   823	  };
   824	}

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts | sed -n '280,335p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   280	    };
   281	  } catch (error) {
   282	    errors.push(error instanceof Error ? error.message : String(error));
   283	    return {
   284	      procedureId: 'CG-RP-002',
   285	      status: 'failed',
   286	      integrityCheck,
   287	      stagedFiles,
   288	      errors,
   289	    };
   290	  }
   291	}
   292	
   293	export async function rollbackBadApply(
   294	  options: RecoveryProcedureOptions = {},
   295	): Promise<RecoveryProcedureResult> {
   296	  const dbDir = resolveDbDir(options.dbDir);
   297	  const auditDir = ensureDir(resolve(options.auditDir ?? join(dbDir, 'apply-audit')));
   298	  assertInside(dbDir, auditDir);
   299	  const ts = timestamp(options.now ?? (() => new Date()));
   300	  const quarantineDir = join(auditDir, `bad-apply-${ts}`);
   301	  const errors: string[] = [];
   302	  let knownGoodDir: string | null = null;
   303	  let restored = false;
   304	
   305	  try {
   306	    closeDb();
   307	    moveTriplet(dbDir, quarantineDir);
   308	    knownGoodDir = findLatestKnownGood(dbDir, auditDir, options.excludeKnownGoodDirs ?? []);
   309	    if (knownGoodDir) {
   310	      assertInside(dbDir, knownGoodDir);
   311	      restored = restoreTriplet(knownGoodDir, dbDir) > 0;
   312	    }
   313	    if (restored && existsSync(tripletPath(dbDir, 'code-graph.sqlite'))) {
   314	      const db = new Database(tripletPath(dbDir, 'code-graph.sqlite'));
   315	      try {
   316	        db.pragma('wal_checkpoint(TRUNCATE)');
   317	      } finally {
   318	        db.close();
   319	      }
   320	    }
   321	    if (options.scan) {
   322	      await options.scan({ incremental: false });
   323	    }
   324	    return {
   325	      procedureId: 'CG-RP-003',
   326	      status: 'ok',
   327	      quarantineDir,
   328	      ...(knownGoodDir ? { knownGoodDir } : {}),
   329	      restored,
   330	      scanIncremental: false,
   331	      errors,
   332	    };
   333	  } catch (error) {
   334	    errors.push(error instanceof Error ? error.message : String(error));
   335	    try {

exec
/bin/zsh -lc "nl -ba .opencode/bin/code-index.cjs | sed -n '1,80p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	#!/usr/bin/env node
     2	// ╔══════════════════════════════════════════════════════════════════════════╗
     3	// ║ COMPONENT: Code Index CLI Shim                                         ║
     4	// ╠══════════════════════════════════════════════════════════════════════════╣
     5	// ║ PURPOSE: Runs the built daemon-backed mk-code-index CLI.                ║
     6	// ╚══════════════════════════════════════════════════════════════════════════╝
     7	'use strict';
     8	
     9	const fs = require('fs');
    10	const path = require('path');
    11	const crypto = require('crypto');
    12	const { spawnSync } = require('child_process');
    13	
    14	const opencodeDir = path.resolve(__dirname, '..');
    15	const skillDir = path.join(opencodeDir, 'skills', 'system-code-graph');
    16	const cliDist = path.join(skillDir, 'mcp_server', 'dist', 'code-index-cli.js');
    17	const sourceHashState = path.join(path.dirname(cliDist), '.code-index-cli-source-hash.json');
    18	const defaultSocketDir = '/tmp/mk-code-index';
    19	const socketFileName = 'daemon-ipc.sock';
    20	const allowStale = process.env.SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE === '1';
    21	
    22	function fail(message) {
    23	  process.stderr.write(`${message}\n`);
    24	  process.exit(69);
    25	}
    26	
    27	// Recursively collects the CLI's compiled-source surface (entry, local
    28	// imports, build tsconfig) so new files under candidate directories are
    29	// watched without editing this list. node_modules and dist stay out of scope.
    30	function sourceCandidates() {
    31	  const candidates = [
    32	    path.join(skillDir, 'mcp_server', 'code-index-cli.ts'),
    33	    path.join(skillDir, 'mcp_server', 'code-index-cli-manifest.ts'),
    34	    path.join(skillDir, 'mcp_server', 'tool-schemas.ts'),
    35	    path.join(skillDir, 'tsconfig.json'),
    36	  ];
    37	  const files = [];
    38	
    39	  const visit = (candidate) => {
    40	    if (!fs.existsSync(candidate)) return;
    41	    const stat = fs.statSync(candidate);
    42	    if (stat.isDirectory()) {
    43	      for (const entry of fs.readdirSync(candidate)) {
    44	        visit(path.join(candidate, entry));
    45	      }
    46	      return;
    47	    }
    48	    if (candidate.endsWith('.ts') || candidate.endsWith('.json')) {
    49	      files.push(candidate);
    50	    }
    51	  };
    52	
    53	  for (const candidate of candidates) visit(candidate);
    54	  return files;
    55	}
    56	
    57	function hashSourceFiles(existingSources) {
    58	  const hash = crypto.createHash('sha256');
    59	  for (const filePath of [...existingSources].sort()) {
    60	    hash.update(path.relative(skillDir, filePath));
    61	    hash.update('\0');
    62	    hash.update(fs.readFileSync(filePath));
    63	    hash.update('\0');
    64	  }
    65	  return hash.digest('hex');
    66	}
    67	
    68	function readStoredSourceHash() {
    69	  try {
    70	    const parsed = JSON.parse(fs.readFileSync(sourceHashState, 'utf8'));
    71	    return typeof parsed?.sourceHash === 'string' ? parsed.sourceHash : null;
    72	  } catch {
    73	    return null;
    74	  }
    75	}
    76	
    77	function writeStoredSourceHash(sourceHash) {
    78	  try {
    79	    fs.mkdirSync(path.dirname(sourceHashState), { recursive: true });
    80	    fs.writeFileSync(sourceHashState, `${JSON.stringify({ version: 1, sourceHash })}\n`);

codex
{"angle":"reclaim-safety-stress","confirms":["GLM rec 1 is correct because the existing bridge probe already does the right kind of health check for reclaim: `probeDaemon(..., deepProbe:true)` requires a JSON-RPC initialize reply, not a bare socket accept, before declaring the daemon alive. Evidence: .opencode/bin/lib/launcher-ipc-bridge.cjs:150-156 and .opencode/bin/lib/launcher-ipc-bridge.cjs:214-221.","GLM rec 3 is correct that the missing-socket branch is currently inert: `maybeBridgeLeaseHolder` returns `report` for `no-bridge-socket`, and the launcher only calls `respawnAfterDeadSocket` when the bridge decision is `action === \"respawn\"`. Evidence: .opencode/bin/lib/launcher-ipc-bridge.cjs:405-408 and .opencode/bin/mk-code-index-launcher.cjs:728-730.","GLM rec 5 is correct that heartbeat must be socket-gated. The launcher refreshes the owner lease on a timer without probing socket service, and the child starts its own heartbeat before `startIpcSocketServer` has successfully bound the IPC socket. Evidence: .opencode/bin/mk-code-index-launcher.cjs:394-406 and .opencode/skills/system-code-graph/mcp_server/index.ts:137-150.","GLM rec 7 is correct that WAL hardening is incomplete. `initDb` enables WAL and a 5s busy timeout but does not set `wal_autocheckpoint`, and migration still copies `code-graph.sqlite-wal` as part of the DB triplet. Evidence: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1033-1039 and .opencode/bin/mk-code-index-launcher.cjs:1125-1129.","GLM rec 8 is directionally correct on safety guards: the primary PID lease does not get the uid check applied to legacy leases, `reapOwnerBeforeRespawn` verifies liveness only before SIGTERM/SIGKILL, and owner-lease reclaim unlinks by path after classification without the richer mutation lock used by the TS owner-lease module. Evidence: .opencode/bin/mk-code-index-launcher.cjs:591-599, .opencode/bin/mk-code-index-launcher.cjs:640-665, and .opencode/bin/mk-code-index-launcher.cjs:474-493.","GLM is right to preserve owner-recorded socket paths for divergent `SPECKIT_IPC_SOCKET_DIR`; the launcher records `ownerSocketPath()` in both leases and the bridge prefers a stored socket path when it still exists. Evidence: .opencode/bin/mk-code-index-launcher.cjs:367-379, .opencode/bin/mk-code-index-launcher.cjs:756-760, and .opencode/bin/lib/launcher-ipc-bridge.cjs:392-404."],"refutes":[{"target":"GLM root-cause claim: heartbeat is written by the launcher","problem":"Outdated/incomplete. The launcher still heartbeats, but the child also refreshes the same owner lease every 20s after MCP stdio connect. The real defect is socket-ungated heartbeat, not launcher-only heartbeat.","evidence":".opencode/skills/system-code-graph/mcp_server/index.ts:44-58"},{"target":"GLM rec 2: existing unlink + O_EXCL CAS handles live-but-dead-socket reclaim atomically with no CAS change","problem":"Overstated. The launcher classifies, then unlinks the owner lease by path before exclusive create; it does not re-read/compare the same lease under a mutation lock immediately before unlink, so a successor lease can still be deleted in the classify-to-unlink window.","evidence":".opencode/bin/mk-code-index-launcher.cjs:474-493"},{"target":"GLM implied safety: N deep-probe failures are enough to kill a live owner","problem":"False under stress. The probe has a capped timeout and classifies timeout as dead, while `code_graph_scan` performs long synchronous file/DB work that can delay JSON-RPC replies without being wedged. N failures reduce noise; they do not prove the process is unsafe to keep alive.","evidence":".opencode/bin/lib/launcher-ipc-bridge.cjs:14-15, .opencode/bin/lib/launcher-ipc-bridge.cjs:194, .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:396, .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:598-618"},{"target":"GLM rec 3: no-bridge-socket should route directly to respawn","problem":"Too broad if implemented literally. A missing computed socket can be startup lag, env/path divergence, or an unlinked UDS pathname while the primary stdio session is still doing useful work. Missing socket should become a suspect state, not a kill condition by itself.","evidence":".opencode/bin/lib/launcher-ipc-bridge.cjs:398-405"},{"target":"GLM rec 6: WAL-holder/no-lease self-heal may reap by WAL ownership","problem":"Unsafe unless the WAL holder is also proven to be the daemon and non-serving. A process can legitimately hold the WAL during scan persistence or checkpoint work; current code only reaps an orphan when it came from a reclaimed owner lease, not from WAL evidence alone.","evidence":".opencode/bin/mk-code-index-launcher.cjs:1060-1067, .opencode/bin/mk-code-index-launcher.cjs:1170-1179"},{"target":"GLM rec 4: startup grace can be derived from existing start timestamps if needed","problem":"Do not use current `startedAtIso`. It is created before child spawn, then the owner lease is patched to the child PID without patching `startedAtIso`, so bootstrap/build time can be misread as child startup time.","evidence":".opencode/bin/mk-code-index-launcher.cjs:410-419, .opencode/bin/mk-code-index-launcher.cjs:973-982"}],"gaps":["Healthy daemon mid huge `code_graph_scan`: PID identity, uid, and N failed probes can all be true while killing is still wrong, because scan work can block JSON-RPC liveness longer than the 5s default/6999ms max probe window. Evidence: .opencode/bin/lib/launcher-ipc-bridge.cjs:31-38 and .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2385-2407.","No final socket-positive veto after acquiring the respawn lock. `respawnAfterDeadSocket` trusts the earlier bridge decision, waits for the bootstrap lock, rechecks only ownerPid, then reaps; a daemon that recovered while the contender waited can still be killed. Evidence: .opencode/bin/mk-code-index-launcher.cjs:681-691.","No requirement for both dead socket and aged heartbeat. The bridge can return `respawn` solely from probe failure; it does not inspect `lastHeartbeatIso` or `ttlMs` in the decision payload. Evidence: .opencode/bin/lib/launcher-ipc-bridge.cjs:426-428 and .opencode/bin/mk-code-index-launcher.cjs:1075-1081.","SIGKILL data-loss window is under-modeled. The child closes the DB on SIGTERM, but if it is event-loop blocked and the launcher escalates to SIGKILL after 7s, close handlers cannot run; WAL should preserve SQLite integrity, but in-flight graph writes can be lost and the WAL can remain large. Evidence: .opencode/skills/system-code-graph/mcp_server/index.ts:96-125 and .opencode/bin/mk-code-index-launcher.cjs:655-663.","Path-divergence protection only works when the stored socket path still exists. If the lease lacks `socketPath`, or a UDS pathname vanished while a primary stdio session is still active, recomputation can classify the wrong path as dead. Evidence: .opencode/bin/lib/launcher-ipc-bridge.cjs:392-405 and .opencode/bin/code-index.cjs:103-110.","No in-flight operation/progress marker. The reclaim path cannot distinguish a wedged daemon from a busy daemon that is making scan progress but not servicing the secondary IPC probe. Evidence: .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:324-397 and .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2226-2464.","The launcher duplicates owner-lease logic instead of using the hardened TS owner-lease mutation lock, so the safety model is split across two implementations. Evidence: .opencode/bin/mk-code-index-launcher.cjs:344-363 and .opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:438-487."],"new_recommendations":[{"change":"Make reclaim require a compound predicate: no socket answers deep probe, the owner heartbeat is aged beyond TTL, and startup grace/deadline has expired. A fresh heartbeat should downgrade probe failure to ambiguous, not killable.","where":".opencode/bin/lib/launcher-ipc-bridge.cjs:maybeBridgeLeaseHolder and .opencode/bin/mk-code-index-launcher.cjs:bridgeOrReportLeaseHeld","why":"Deep-probe timeout alone is not a proof of wedge during CPU/DB-heavy scans; the current decision can return `respawn` from probe failure only. Evidence: .opencode/bin/lib/launcher-ipc-bridge.cjs:426-428."},{"change":"After acquiring the bootstrap lock, re-read the owner lease and run a final deep probe against the stored socket path before SIGTERM. If any socket answers, bridge and abort reclaim.","where":".opencode/bin/mk-code-index-launcher.cjs:respawnAfterDeadSocket","why":"The current code can wait for the respawn lock, check only that `ownerPid` is unchanged, then kill a process that recovered after the original probe. Evidence: .opencode/bin/mk-code-index-launcher.cjs:681-691."},{"change":"Add PID identity and uid checks before any signal: current uid, executable path/cmdline, and process start time must match the recorded child identity. Apply the uid check to primary leases too.","where":".opencode/bin/mk-code-index-launcher.cjs:reapOwnerBeforeRespawn and .opencode/bin/mk-code-index-launcher.cjs:leaseHeldFromFile","why":"`process.kill(pid,0)` only proves a PID exists; it does not prove it is still the daemon. Primary lease uid is currently unchecked, and reap sends signals with no identity verification. Evidence: .opencode/bin/mk-code-index-launcher.cjs:591-607 and .opencode/bin/mk-code-index-launcher.cjs:640-665."},{"change":"Start or mark the heartbeat as socket-serving only after `startIpcSocketServer` succeeds; add a separate `childSpawnedAtIso` and `socketServingSinceIso` instead of reusing `startedAtIso`.","where":".opencode/skills/system-code-graph/mcp_server/index.ts:startOwnerLeaseRefreshTimer and .opencode/bin/mk-code-index-launcher.cjs:launchServer","why":"The child heartbeat currently starts before the IPC socket is bound, and the existing start timestamp predates child spawn. Evidence: .opencode/skills/system-code-graph/mcp_server/index.ts:137-150 and .opencode/bin/mk-code-index-launcher.cjs:973-982."},{"change":"Write a lightweight in-flight/progress marker during `code_graph_scan`; reclaim must not SIGKILL while progress is fresh, even if deep probes fail.","where":".opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:handleCodeGraphScan and .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:buildIndexPhases","why":"A busy scan can fail secondary liveness probes while still making forward progress. Evidence: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2385-2407."},{"change":"For WAL cleanup, run checkpoint only under the bootstrap lock and only after proving no live writer/socket. Prefer PASSIVE/FULL observation first, then TRUNCATE only when no writer is alive; never kill solely because a PID holds the WAL.","where":".opencode/bin/mk-code-index-launcher.cjs:launcherMain and .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:initDb","why":"WAL mode is normal for the daemon, and a holder can be legitimate during scan persistence; current init lacks autocheckpoint and current recovery checkpoint exists only in rollback. Evidence: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1033-1039 and .opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:306-319."},{"change":"Replace the launcher's ad hoc owner-lease write/unlink path with the hardened owner-lease mutation-lock protocol, or port the same re-read/compare lock semantics into the launcher.","where":".opencode/bin/mk-code-index-launcher.cjs:acquireOwnerLeaseFile","why":"The TS owner lease code already protects classify/reclaim/write under a mutation lock; the launcher path still classifies then unlinks by path. Evidence: .opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:438-487 and .opencode/bin/mk-code-index-launcher.cjs:491-504."}],"verdict":"sound-with-fixes"}
hook: Stop
hook: Stop Completed
tokens used
157,557
{"angle":"reclaim-safety-stress","confirms":["GLM rec 1 is correct because the existing bridge probe already does the right kind of health check for reclaim: `probeDaemon(..., deepProbe:true)` requires a JSON-RPC initialize reply, not a bare socket accept, before declaring the daemon alive. Evidence: .opencode/bin/lib/launcher-ipc-bridge.cjs:150-156 and .opencode/bin/lib/launcher-ipc-bridge.cjs:214-221.","GLM rec 3 is correct that the missing-socket branch is currently inert: `maybeBridgeLeaseHolder` returns `report` for `no-bridge-socket`, and the launcher only calls `respawnAfterDeadSocket` when the bridge decision is `action === \"respawn\"`. Evidence: .opencode/bin/lib/launcher-ipc-bridge.cjs:405-408 and .opencode/bin/mk-code-index-launcher.cjs:728-730.","GLM rec 5 is correct that heartbeat must be socket-gated. The launcher refreshes the owner lease on a timer without probing socket service, and the child starts its own heartbeat before `startIpcSocketServer` has successfully bound the IPC socket. Evidence: .opencode/bin/mk-code-index-launcher.cjs:394-406 and .opencode/skills/system-code-graph/mcp_server/index.ts:137-150.","GLM rec 7 is correct that WAL hardening is incomplete. `initDb` enables WAL and a 5s busy timeout but does not set `wal_autocheckpoint`, and migration still copies `code-graph.sqlite-wal` as part of the DB triplet. Evidence: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1033-1039 and .opencode/bin/mk-code-index-launcher.cjs:1125-1129.","GLM rec 8 is directionally correct on safety guards: the primary PID lease does not get the uid check applied to legacy leases, `reapOwnerBeforeRespawn` verifies liveness only before SIGTERM/SIGKILL, and owner-lease reclaim unlinks by path after classification without the richer mutation lock used by the TS owner-lease module. Evidence: .opencode/bin/mk-code-index-launcher.cjs:591-599, .opencode/bin/mk-code-index-launcher.cjs:640-665, and .opencode/bin/mk-code-index-launcher.cjs:474-493.","GLM is right to preserve owner-recorded socket paths for divergent `SPECKIT_IPC_SOCKET_DIR`; the launcher records `ownerSocketPath()` in both leases and the bridge prefers a stored socket path when it still exists. Evidence: .opencode/bin/mk-code-index-launcher.cjs:367-379, .opencode/bin/mk-code-index-launcher.cjs:756-760, and .opencode/bin/lib/launcher-ipc-bridge.cjs:392-404."],"refutes":[{"target":"GLM root-cause claim: heartbeat is written by the launcher","problem":"Outdated/incomplete. The launcher still heartbeats, but the child also refreshes the same owner lease every 20s after MCP stdio connect. The real defect is socket-ungated heartbeat, not launcher-only heartbeat.","evidence":".opencode/skills/system-code-graph/mcp_server/index.ts:44-58"},{"target":"GLM rec 2: existing unlink + O_EXCL CAS handles live-but-dead-socket reclaim atomically with no CAS change","problem":"Overstated. The launcher classifies, then unlinks the owner lease by path before exclusive create; it does not re-read/compare the same lease under a mutation lock immediately before unlink, so a successor lease can still be deleted in the classify-to-unlink window.","evidence":".opencode/bin/mk-code-index-launcher.cjs:474-493"},{"target":"GLM implied safety: N deep-probe failures are enough to kill a live owner","problem":"False under stress. The probe has a capped timeout and classifies timeout as dead, while `code_graph_scan` performs long synchronous file/DB work that can delay JSON-RPC replies without being wedged. N failures reduce noise; they do not prove the process is unsafe to keep alive.","evidence":".opencode/bin/lib/launcher-ipc-bridge.cjs:14-15, .opencode/bin/lib/launcher-ipc-bridge.cjs:194, .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:396, .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:598-618"},{"target":"GLM rec 3: no-bridge-socket should route directly to respawn","problem":"Too broad if implemented literally. A missing computed socket can be startup lag, env/path divergence, or an unlinked UDS pathname while the primary stdio session is still doing useful work. Missing socket should become a suspect state, not a kill condition by itself.","evidence":".opencode/bin/lib/launcher-ipc-bridge.cjs:398-405"},{"target":"GLM rec 6: WAL-holder/no-lease self-heal may reap by WAL ownership","problem":"Unsafe unless the WAL holder is also proven to be the daemon and non-serving. A process can legitimately hold the WAL during scan persistence or checkpoint work; current code only reaps an orphan when it came from a reclaimed owner lease, not from WAL evidence alone.","evidence":".opencode/bin/mk-code-index-launcher.cjs:1060-1067, .opencode/bin/mk-code-index-launcher.cjs:1170-1179"},{"target":"GLM rec 4: startup grace can be derived from existing start timestamps if needed","problem":"Do not use current `startedAtIso`. It is created before child spawn, then the owner lease is patched to the child PID without patching `startedAtIso`, so bootstrap/build time can be misread as child startup time.","evidence":".opencode/bin/mk-code-index-launcher.cjs:410-419, .opencode/bin/mk-code-index-launcher.cjs:973-982"}],"gaps":["Healthy daemon mid huge `code_graph_scan`: PID identity, uid, and N failed probes can all be true while killing is still wrong, because scan work can block JSON-RPC liveness longer than the 5s default/6999ms max probe window. Evidence: .opencode/bin/lib/launcher-ipc-bridge.cjs:31-38 and .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2385-2407.","No final socket-positive veto after acquiring the respawn lock. `respawnAfterDeadSocket` trusts the earlier bridge decision, waits for the bootstrap lock, rechecks only ownerPid, then reaps; a daemon that recovered while the contender waited can still be killed. Evidence: .opencode/bin/mk-code-index-launcher.cjs:681-691.","No requirement for both dead socket and aged heartbeat. The bridge can return `respawn` solely from probe failure; it does not inspect `lastHeartbeatIso` or `ttlMs` in the decision payload. Evidence: .opencode/bin/lib/launcher-ipc-bridge.cjs:426-428 and .opencode/bin/mk-code-index-launcher.cjs:1075-1081.","SIGKILL data-loss window is under-modeled. The child closes the DB on SIGTERM, but if it is event-loop blocked and the launcher escalates to SIGKILL after 7s, close handlers cannot run; WAL should preserve SQLite integrity, but in-flight graph writes can be lost and the WAL can remain large. Evidence: .opencode/skills/system-code-graph/mcp_server/index.ts:96-125 and .opencode/bin/mk-code-index-launcher.cjs:655-663.","Path-divergence protection only works when the stored socket path still exists. If the lease lacks `socketPath`, or a UDS pathname vanished while a primary stdio session is still active, recomputation can classify the wrong path as dead. Evidence: .opencode/bin/lib/launcher-ipc-bridge.cjs:392-405 and .opencode/bin/code-index.cjs:103-110.","No in-flight operation/progress marker. The reclaim path cannot distinguish a wedged daemon from a busy daemon that is making scan progress but not servicing the secondary IPC probe. Evidence: .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:324-397 and .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2226-2464.","The launcher duplicates owner-lease logic instead of using the hardened TS owner-lease mutation lock, so the safety model is split across two implementations. Evidence: .opencode/bin/mk-code-index-launcher.cjs:344-363 and .opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:438-487."],"new_recommendations":[{"change":"Make reclaim require a compound predicate: no socket answers deep probe, the owner heartbeat is aged beyond TTL, and startup grace/deadline has expired. A fresh heartbeat should downgrade probe failure to ambiguous, not killable.","where":".opencode/bin/lib/launcher-ipc-bridge.cjs:maybeBridgeLeaseHolder and .opencode/bin/mk-code-index-launcher.cjs:bridgeOrReportLeaseHeld","why":"Deep-probe timeout alone is not a proof of wedge during CPU/DB-heavy scans; the current decision can return `respawn` from probe failure only. Evidence: .opencode/bin/lib/launcher-ipc-bridge.cjs:426-428."},{"change":"After acquiring the bootstrap lock, re-read the owner lease and run a final deep probe against the stored socket path before SIGTERM. If any socket answers, bridge and abort reclaim.","where":".opencode/bin/mk-code-index-launcher.cjs:respawnAfterDeadSocket","why":"The current code can wait for the respawn lock, check only that `ownerPid` is unchanged, then kill a process that recovered after the original probe. Evidence: .opencode/bin/mk-code-index-launcher.cjs:681-691."},{"change":"Add PID identity and uid checks before any signal: current uid, executable path/cmdline, and process start time must match the recorded child identity. Apply the uid check to primary leases too.","where":".opencode/bin/mk-code-index-launcher.cjs:reapOwnerBeforeRespawn and .opencode/bin/mk-code-index-launcher.cjs:leaseHeldFromFile","why":"`process.kill(pid,0)` only proves a PID exists; it does not prove it is still the daemon. Primary lease uid is currently unchecked, and reap sends signals with no identity verification. Evidence: .opencode/bin/mk-code-index-launcher.cjs:591-607 and .opencode/bin/mk-code-index-launcher.cjs:640-665."},{"change":"Start or mark the heartbeat as socket-serving only after `startIpcSocketServer` succeeds; add a separate `childSpawnedAtIso` and `socketServingSinceIso` instead of reusing `startedAtIso`.","where":".opencode/skills/system-code-graph/mcp_server/index.ts:startOwnerLeaseRefreshTimer and .opencode/bin/mk-code-index-launcher.cjs:launchServer","why":"The child heartbeat currently starts before the IPC socket is bound, and the existing start timestamp predates child spawn. Evidence: .opencode/skills/system-code-graph/mcp_server/index.ts:137-150 and .opencode/bin/mk-code-index-launcher.cjs:973-982."},{"change":"Write a lightweight in-flight/progress marker during `code_graph_scan`; reclaim must not SIGKILL while progress is fresh, even if deep probes fail.","where":".opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:handleCodeGraphScan and .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:buildIndexPhases","why":"A busy scan can fail secondary liveness probes while still making forward progress. Evidence: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2385-2407."},{"change":"For WAL cleanup, run checkpoint only under the bootstrap lock and only after proving no live writer/socket. Prefer PASSIVE/FULL observation first, then TRUNCATE only when no writer is alive; never kill solely because a PID holds the WAL.","where":".opencode/bin/mk-code-index-launcher.cjs:launcherMain and .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:initDb","why":"WAL mode is normal for the daemon, and a holder can be legitimate during scan persistence; current init lacks autocheckpoint and current recovery checkpoint exists only in rollback. Evidence: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1033-1039 and .opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:306-319."},{"change":"Replace the launcher's ad hoc owner-lease write/unlink path with the hardened owner-lease mutation-lock protocol, or port the same re-read/compare lock semantics into the launcher.","where":".opencode/bin/mk-code-index-launcher.cjs:acquireOwnerLeaseFile","why":"The TS owner lease code already protects classify/reclaim/write under a mutation lock; the launcher path still classifies then unlinks by path. Evidence: .opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:438-487 and .opencode/bin/mk-code-index-launcher.cjs:491-504."}],"verdict":"sound-with-fixes"}
