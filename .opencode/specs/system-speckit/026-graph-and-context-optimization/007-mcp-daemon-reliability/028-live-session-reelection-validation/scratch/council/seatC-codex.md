Reading additional input from stdin...
OpenAI Codex v0.137.0
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
model: gpt-5.5
provider: openai
approval: never
sandbox: read-only
reasoning effort: high
reasoning summaries: none
session id: 019ea593-cf9e-7e70-9408-9b9780be9611
--------
user
Read .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/028-live-session-reelection-validation/scratch/council-brief.md . Your shell is read-only so do static code verification (you cannot run the repro). Read the cited code in .opencode/bin/mk-spec-memory-launcher.cjs and answer all 3 questions from the brief: (1) VERIFY or REFUTE the fresh-session double-writer claim purely from the code logic, citing exact functions/lines; (2) assess SEVERITY under SQLite WAL multi-process; (3) recommend the minimal FIX with exact locations. Be concise and specific. Return a structured verdict.
hook: SessionStart
hook: SessionStart
hook: SessionStart Completed
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
hook: UserPromptSubmit Completed
codex
Using `sk-code` for the static code verification, with the spec-kit context in mind because the brief lives under that workflow. I’m going to read the brief and the launcher with line numbers, then answer the three claims from code logic only.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/028-live-session-reelection-validation/scratch/council-brief.md | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skills/sk-code/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	# Council brief: daemon re-election fresh-session double-writer
     2	
     3	## Repo
     4	`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
     5	
     6	## Background
     7	`SPECKIT_DAEMON_REELECTION` makes the shared mk-spec-memory daemon survive its owning
     8	session: on owner disposal the launcher RELEASES the detached daemon (keeps it alive)
     9	instead of killing it, so a live secondary keeps MCP transport. It was just defaulted
    10	ON in all 3 runtime configs (`.claude/mcp.json`, `opencode.json`, `.codex/config.toml`)
    11	and shipped as changelog v3.5.0.4, which claims: "the downside is bounded ... an
    12	unadopted released daemon self-exits at the idle timeout, so the worst case matches the
    13	prior kill-on-disposal behavior."
    14	
    15	## The finding to verify/refute (CLAIM)
    16	A FRESH session started AFTER the owner disposed does NOT adopt the released daemon.
    17	Instead the fresh launcher treats the kept lease as stale (because lease liveness keys
    18	on the dead OWNER pid, not the alive daemon childPid), RECLAIMS it, and spawns a SECOND
    19	daemon on the SAME DB dir WITHOUT reaping the orphan. Result: two daemons holding the
    20	same `context-index.sqlite` (WAL) open simultaneously for up to the idle timeout
    21	(default 30 min). Before re-election, owner disposal KILLED the daemon, so a cold
    22	restart got a single clean writer -> this is a regression that default-on introduced,
    23	contradicting the "worst case matches prior behavior" claim.
    24	
    25	## Evidence already gathered
    26	- Post-dispose lease `.mk-spec-memory-launcher.json` = `{pid: <ownerPid, DEAD>, ownerPid:
    27	  <DEAD>, childPid: <daemon, ALIVE>, socketPath: ...}`. The daemon is still listening.
    28	- Fresh launcher logs `staleReclaimed: true`, then spawns a new daemon (different pid).
    29	- `lsof` over 60s shows BOTH the orphan daemon and the new daemon holding
    30	  `context-index.sqlite` + `-wal` + `-shm` open at the same time.
    31	- The daemon has its own idle monitor: `dist/context-server.js` ~L1818
    32	  `onIdle: () => fatalShutdown('Launcher idle timeout reached...', 0)` (default 30 min),
    33	  so the orphan is bounded, not a permanent leak.
    34	
    35	## Key code locations (`.opencode/bin/mk-spec-memory-launcher.cjs`)
    36	- `shutdownLauncherForSignal` ~L1357: the release path ~L1366-1383 keeps the daemon
    37	  lease "for adoption", drops only ownership, exits without killing the daemon.
    38	- `leaseHeldFromFile` ~L554-569: `process.kill(lease.pid, 0)` — keys liveness on
    39	  `lease.pid` (= owner launcher pid), returns `staleReclaimable` when owner is dead.
    40	- `isLeaseHeld` ~L572; `main()` startup branches: lease held -> `bridgeOrReportLeaseHeld`
    41	  (bridge to daemon); not held but staleReclaimable -> reclaim + become owner + spawn.
    42	- `respawnAfterDeadSocket` ~L747 + `reapLeaseChildBeforeRespawn` ~L689: an EXISTING path
    43	  that DOES reap a recorded childPid before respawn — but only on the "lease held, socket
    44	  dead" branch, NOT on the "stale owner, daemon alive" reclaim branch.
    45	
    46	## Reproduce (isolated, production-safe — uses a temp fake-root, never touches the real lease/DB)
    47	```
    48	cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
    49	node .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/028-live-session-reelection-validation/scratch/reelect-doublewriter.cjs
    50	```
    51	(Other harnesses in the same scratch dir: `reelect-live-test.cjs` runs both arms of the
    52	live two-session adoption test; the permanent vitest is
    53	`mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts`.)
    54	
    55	## Questions to answer
    56	1. VERIFY/REFUTE: is the fresh-session double-writer real as described? Cite the exact
    57	   code paths and (if you can run shell) the repro output.
    58	2. SEVERITY: how bad under SQLite WAL multi-process (corruption risk? checkpoint/WAL
    59	   growth? lock contention?), and is it genuinely a regression vs the pre-re-election
    60	   kill behavior?
    61	3. FIX: the minimal correct launcher change. Candidate options:
    62	   (a) on stale-lease reclaim, if `lease.childPid` is alive, reap it before spawning
    63	       (mirror `reapLeaseChildBeforeRespawn`);
    64	   (b) true adoption: if `childPid` alive + socket live, BRIDGE instead of reclaim
    65	       (key `isLeaseHeld` partly on childPid liveness for the bridge decision);
    66	   (c) keep default-OFF until fixed.
    67	   Recommend ONE primary approach with exact function/line targets, edge cases (races
    68	   between two fresh launchers, the respawn lock, the owner-lease), and what test proves it.
    69	
    70	Return a structured verdict: VERDICT (confirmed/refuted), SEVERITY (low/med/high + why),
    71	RECOMMENDED FIX (approach + locations + risks + test). Be concise and specific.
    72	READ-ONLY: do not edit/create/delete any repo file.

 succeeded in 0ms:
---
name: sk-code
description: "Multi-stack coding standards and verification. Smart router auto-detects the active surface and loads matching code patterns."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 3.3.1.0
---

<!-- Keywords: sk-code, code workflows, smart-router, code-surface-detection, webflow, frontend, html, css, javascript, Motion.dev, motion-dev, motion_dev, cross-stack-animation, gsap, lenis, swiper, hls, filepond, opencode, system-code, mcp, typescript, python, shell, jsonc, code-quality, debugging-workflow, verification -->

# Code Workflows - Surface-Aware Smart Router

`sk-code` is the single code-work skill. It first decides which code surface is in front of it, then loads the right implementation, quality, debugging, and verification resources.

**Core principle**: `Code surface detection -> Intent classification -> Surface resources -> Verification evidence`.

---

## 1. WHEN TO USE

> **🎯 Template customization surface.** This is the **only** skill end users should edit when adopting this template repo for their own project. Replace the shipped `references/{webflow,opencode,motion_dev}/` and `assets/{webflow,opencode,motion_dev}/` trees with your stack's references and assets. Update `STACK_FOLDERS` (§2) + `RESOURCE_MAP` to match. Every other skill (`sk-doc`, `sk-git`, `sk-code-review`, `system-spec-kit`, `system-code-graph`, etc.) is codebase-agnostic and must stay that way to keep upstream pulls clean. See root [README §4 Customizing for Your Stack](../../../README.md#customizing-for-your-stack).

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
| Phase 1: Implementation | Write or modify code using surface patterns | Read actual files first |
| Phase 1.5: Code Quality Gate | Apply P0/P1/P2 checks and surface standards | Required before claiming implementation done |
| Phase 2: Debugging | Trace symptom to root cause and fix one cause at a time | Required when tests/runtime fail |
| Phase 3: Verification | Run surface verification commands and record evidence | Required before any done/works claim |

**Iron Law**: no completion claim without fresh verification evidence from the detected surface.

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

1. Detect `.opencode/` context from CWD or target files.
2. Detect language from file extension first, then keyword scores.
3. Load shared OpenCode patterns, language standards, quick references, and checklists.
4. **Phase 1.5 comment hygiene:** Run `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh <file>` on each modified file before committing. Zero violations required. Three automatic enforcement gates also run independently: `scripts/hooks/claude-posttooluse.sh` (write-time warning, Claude Code), `.opencode/hooks/pre-commit` (commit-time block, all runtimes), and `.github/workflows/comment-hygiene.yml` (CI gate, all PRs).
5. Run the alignment verifier and targeted tests before completion claims.
6. Use `sk-code-review` for formal findings-first review; use this skill for standards evidence.

### UNKNOWN Workflow

exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-spec-memory-launcher.cjs | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	#!/usr/bin/env node
     2	// [mk-spec-memory-launcher] MCP child-process launcher for the mk-spec-memory server.
     3	// Loads project-local env overrides, ensures dist artifacts are built and current,
     4	// serializes concurrent starts via a filesystem bootstrap lock, then spawns the
     5	// context-server.js child. All stderr lines are tagged with the bracketed module
     6	// prefix for ops grepping.
     7	
     8	'use strict';
     9	
    10	const fs = require('fs');
    11	const http = require('http');
    12	const path = require('path');
    13	const { spawn, spawnSync } = require('child_process');
    14	const mss = require('./lib/model-server-supervision.cjs');
    15	const { createSessionProxy } = require('./lib/launcher-session-proxy.cjs');
    16	
    17	const {
    18	  RESPAWN_REAP_GRACE_MS,
    19	  HF_MODEL_SERVER_PID_FILE_NAME,
    20	  acquireRespawnLockFileAt: acquireSharedRespawnLockFileAt,
    21	  buildLeaseObject: buildSharedLeaseObject,
    22	  canonicalizePath,
    23	  computeBackoffMs,
    24	  createCrashLoopGuard,
    25	  createModelServerSupervisor: baseCreateModelServerSupervisor,
    26	  defaultProcessRowsRunner,
    27	  getCrashLoopConfig,
    28	  getModelServerWatchdogConfig,
    29	  getWatchdogConfig,
    30	  isChildRunning,
    31	  isRespawnLockStale,
    32	  ensureCanonicalDir,
    33	  normalizeWatchdogGraceMs,
    34	  parseProcessRows,
    35	  processLiveness,
    36	  releaseRespawnLockFile,
    37	  sampleProcessTreeRssMb,
    38	  shouldAbortRelaunchOnFire,
    39	  shouldSkipLaunch,
    40	  signalProcess,
    41	  superviseChildExit,
    42	  waitForPidExit,
    43	} = mss;
    44	
    45	const root = path.resolve(__dirname, '..', '..');
    46	const opencodeDir = path.join(root, '.opencode');
    47	
    48	// Load project-local env overrides BEFORE spawning the MCP child. .env.local wins over
    49	// .env, both are gitignored. Existing process.env wins over file values (do not override).
    50	// Minimal parser — no external dependency.
    51	function loadEnvFile(filePath) {
    52	  if (!fs.existsSync(filePath)) return 0;
    53	  let count = 0;
    54	  const raw = fs.readFileSync(filePath, 'utf8');
    55	  for (const line of raw.split('\n')) {
    56	    const trimmed = line.trim();
    57	    if (!trimmed || trimmed.startsWith('#')) continue;
    58	    const m = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    59	    if (!m) continue;
    60	    const key = m[1];
    61	    let val = m[2];
    62	    // Strip matching outer quotes (single or double)
    63	    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    64	      val = val.slice(1, -1);
    65	    }
    66	    if (!(key in process.env)) {
    67	      process.env[key] = val;
    68	      count++;
    69	    }
    70	  }
    71	  return count;
    72	}
    73	
    74	function isStrictModeDisabled(value) {
    75	  if (value === undefined || value === null) return false;
    76	  const v = String(value).trim().toLowerCase();
    77	  return v === '0' || v === 'false' || v === 'no' || v === 'off' || v === '';
    78	}
    79	
    80	let skillsDir = path.join(opencodeDir, 'skills');
    81	let legacySkillDir = path.join(opencodeDir, 'skill');
    82	let kitDir = path.join(skillsDir, 'system-spec-kit');
    83	let dbDir = path.join(kitDir, 'mcp_server', 'database');
    84	let lockDir = path.join(dbDir, '.mk-spec-memory-launcher.lockdir');
    85	const PID_FILE_NAME = '.mk-spec-memory-launcher.json';
    86	const OWNER_LEASE_FILE_NAME = '.spec-memory-owner.json';
    87	let stateFile = path.join(dbDir, PID_FILE_NAME);
    88	let canonicalCodeGraphDbDir = path.join(skillsDir, 'system-code-graph', 'mcp_server', 'database');
    89	
    90	const rel = (p) => path.relative(root, p) || '.';
    91	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    92	const now = () => new Date().toISOString();
    93	// Generously above any realistic cold-cache build (npm ci + 2 tsc workspace builds) so the reclaim
    94	// only fires for a genuinely abandoned lockdir, never a slow-but-live build holder.
    95	const BOOTSTRAP_LOCK_STALE_MS = 300000;
    96	let childProcess = null;
    97	let ownerLeasePid = null;
    98	let leaseStartedAt = null;
    99	let launcherShutdownInProgress = false;
   100	let rssBreachSelfExitInProgress = false;
   101	let rssWatchdogTimer = null;
   102	let crashLoopGuard = null;
   103	let supervisorRelaunchTimer = null;
   104	// The MCP host (Claude Code / OpenCode) spawns this launcher directly, so the host is the
   105	// launcher's parent. When the host disposes its session the launcher is orphaned and its
   106	// ppid changes (reparents to 1 / a subreaper). Captured once at startup so the relaunch
   107	// path can tell "owning runtime went away" apart from a genuine daemon crash.
   108	const LAUNCHER_INITIAL_PPID = process.ppid;
   109	let ownerLeaseHeartbeatTimer = null;
   110	let ownerLeaseRequired = true;
   111	// Last-known descendant pids of the daemon child (excluding the child itself), refreshed by the
   112	// process-tree monitor while the child is alive; the give-up reap path uses this to find an
   113	// orphaned sidecar after the child has already exited.
   114	let lastKnownDescendantPids = [];
   115	const DURABLE_WRITE_UNAVAILABLE_CODES = new Set(['ENOSPC', 'EDQUOT', 'EROFS']);
   116	const durableWriteWarnings = new Set();
   117	
   118	function log(message) {
   119	  process.stderr.write(`[mk-spec-memory-launcher] ${message}\n`);
   120	  persistLauncherLogLine(`${new Date().toISOString()} [pid ${process.pid}] ${message}\n`);
   121	}
   122	
   123	function isDurableWriteUnavailable(error) {
   124	  const code = error && typeof error === 'object' ? error.code : undefined;
   125	  return DURABLE_WRITE_UNAVAILABLE_CODES.has(code);
   126	}
   127	
   128	function logDurableWriteUnavailableOnce(operation, targetPath, error) {
   129	  const code = error && typeof error === 'object' ? error.code : 'UNKNOWN';
   130	  const key = `${operation}:${targetPath}:${code}`;
   131	  if (durableWriteWarnings.has(key)) return;
   132	  durableWriteWarnings.add(key);
   133	  const detail = error instanceof Error ? error.message : String(error ?? code);
   134	  log(`${operation} skipped for ${rel(targetPath)}: ${code} ${detail}`);
   135	}
   136	
   137	// Persistent launcher log: log() writes to stderr, which the MCP host captures inconsistently; it
   138	// ALSO appends here so an owner-disposal race or daemon flap is attributable after the fact from a
   139	// durable file. The append is best-effort and size-bounded — a logging failure must never affect the
   140	// launcher, and the file rotates to a single previous generation once it crosses the cap so it cannot
   141	// grow without bound.
   142	function launcherLogIsEnabled(env = process.env) {
   143	  return env.SPECKIT_LAUNCHER_LOG !== '0';
   144	}
   145	function launcherLogMaxBytes(env = process.env) {
   146	  return parsePositiveInteger(env.SPECKIT_LAUNCHER_LOG_MAX_BYTES, 1024 * 1024);
   147	}
   148	function resolveLauncherLogPath(env = process.env, baseDir = dbDir) {
   149	  const override = env.SPECKIT_LAUNCHER_LOG_PATH;
   150	  return typeof override === 'string' && override.trim()
   151	    ? override.trim()
   152	    : path.join(baseDir, '.mk-spec-memory-launcher.log');
   153	}
   154	function shouldRotateLauncherLog(currentSizeBytes, maxBytes) {
   155	  return Number.isFinite(currentSizeBytes) && Number.isFinite(maxBytes) && currentSizeBytes > maxBytes;
   156	}
   157	function persistLauncherLogLine(line) {
   158	  if (!launcherLogIsEnabled()) return;
   159	  let target;
   160	  try {
   161	    target = resolveLauncherLogPath();
   162	    try {
   163	      const { size } = fs.statSync(target);
   164	      if (shouldRotateLauncherLog(size, launcherLogMaxBytes())) {
   165	        try {
   166	          // Rotate to a DISTINCT sibling. A `.log` path keeps a `.prev.log` (still matched by the
   167	          // *.log gitignore); any other operator-overridden path appends `.prev` so a non-`.log`
   168	          // suffix still rotates instead of renaming the file onto itself and growing without bound.
   169	          const rotated = target.endsWith('.log') ? target.replace(/\.log$/, '.prev.log') : `${target}.prev`;
   170	          fs.renameSync(target, rotated);
   171	        } catch {
   172	          // Best-effort rotation: if the rename fails, keep appending to the current file.
   173	        }
   174	      }
   175	    } catch (statErr) {
   176	      if (statErr.code !== 'ENOENT') throw statErr;
   177	    }
   178	    fs.appendFileSync(target, line, { mode: 0o600 });
   179	  } catch (error) {
   180	    if (target && isDurableWriteUnavailable(error)) {
   181	      logDurableWriteUnavailableOnce('launcher-log-append', target, error);
   182	      return;
   183	    }
   184	    // Logging must never break the launcher.
   185	  }
   186	}
   187	
   188	// Daemon re-election (experimental, default off). When enabled the owner spawns the daemon
   189	// detached and, on its own shutdown, RELEASES the daemon (leaves it running for a live secondary to
   190	// bridge to) instead of killing it, so a session ending does not tear the shared backend out from
   191	// under other sessions. Default off collapses every path below to today's behavior (daemon tied to
   192	// the owner, killed on shutdown). Enabling needs runtime validation of secondary adoption + bounded
   193	// terminal death; a released daemon reparents to pid 1, so the orphan sweeper bounds any leak.
   194	function daemonReelectionEnabled(env = process.env) {
   195	  return env.SPECKIT_DAEMON_REELECTION === '1' || env.SPECKIT_DAEMON_REELECTION === 'on';
   196	}
   197	function contextServerSpawnIo(reelectionEnabled) {
   198	  return reelectionEnabled
   199	    ? { detached: true, stdio: ['ignore', 'ignore', 'ignore'] }
   200	    : { detached: false, stdio: ['ignore', 'ignore', 'inherit'] };
   201	}
   202	function shouldReleaseDaemonForReelection({ enabled, hasLiveDaemon } = {}) {
   203	  return Boolean(enabled) && Boolean(hasLiveDaemon);
   204	}
   205	
   206	function cleanupTmpFile(tmpPath) {
   207	  try {
   208	    fs.unlinkSync(tmpPath);
   209	  } catch (error) {
   210	    if (error.code !== 'ENOENT') {
   211	      // Best-effort cleanup only; the original durable-write failure is more useful.
   212	    }
   213	  }
   214	}
   215	
   216	function writeAtomicJsonFile(targetPath, payload, operation) {
   217	  const currentPath = path.join(ensureCanonicalDir(path.dirname(targetPath)), path.basename(targetPath));
   218	  const tmp = `${currentPath}.tmp.${process.pid}`;
   219	  try {
   220	    fs.writeFileSync(tmp, `${JSON.stringify(payload, null, 2)}\n`, { mode: 0o600 });
   221	    fs.renameSync(tmp, currentPath);
   222	    return true;
   223	  } catch (error) {
   224	    cleanupTmpFile(tmp);
   225	    if (isDurableWriteUnavailable(error)) {
   226	      logDurableWriteUnavailableOnce(operation, currentPath, error);
   227	      return false;
   228	    }
   229	    throw error;
   230	  }
   231	}
   232	
   233	function loadProjectEnvFiles() {
   234	  for (const fname of ['.env.local', '.env']) {
   235	    const p = path.join(root, fname);
   236	    if (fs.existsSync(p)) {
   237	      const n = loadEnvFile(p);
   238	      if (n > 0) process.stderr.write(`[mk-spec-memory-launcher] loaded ${n} env(s) from ${fname}\n`);
   239	    }
   240	  }
   241	}
   242	
   243	function parsePositiveInteger(value, fallback) {
   244	  if (value === undefined || value === null || String(value).trim() === '') return fallback;
   245	  const parsed = Number.parseInt(String(value).trim(), 10);
   246	  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
   247	}
   248	
   249	function loadBridgeModule() {
   250	  try {
   251	    return require('./lib/launcher-ipc-bridge.cjs');
   252	  } catch (error) {
   253	    if (error.code !== 'MODULE_NOT_FOUND') throw error;
   254	    return {
   255	      async maybeBridgeLeaseHolder({ leaseResult }) {
   256	        const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
   257	        const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
   258	        const suffix = process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1' ? '' : ' (no-bridge-socket)';
   259	        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
   260	        return { action: 'report', reason: 'bridge-module-missing' };

codex
The brief’s cited line ranges match a launcher/daemon ownership problem, so I’m narrowing to the lease classification, stale reclaim, respawn, and shutdown paths. The important question is whether “held” means owner-alive or daemon-alive in the actual branching.
exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-spec-memory-launcher.cjs | sed -n '520,820p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   520	
   521	function ownsOwnerLeaseFile(ownerPid = process.pid) {
   522	  const lease = readOwnerLeaseFile();
   523	  return lease?.ownerPid === ownerPid;
   524	}
   525	
   526	function clearOwnerLeaseFile() {
   527	  if (!Number.isInteger(ownerLeasePid)) return;
   528	  try {
   529	    const lease = readOwnerLeaseFile();
   530	    if (lease && lease.ownerPid === ownerLeasePid
   531	        && readOwnerLeaseFile()?.ownerPid === ownerLeasePid) {
   532	      fs.unlinkSync(ownerLeasePath());
   533	    }
   534	  } catch {
   535	    // Idempotent cleanup.
   536	  } finally {
   537	    clearOwnerLeaseHeartbeat();
   538	    ownerLeasePid = null;
   539	  }
   540	}
   541	
   542	function clearOwnerLeaseFileIfOwner(ownerPid) {
   543	  try {
   544	    const lease = readOwnerLeaseFile();
   545	    if (lease && lease.ownerPid === ownerPid
   546	        && readOwnerLeaseFile()?.ownerPid === ownerPid) {
   547	      fs.unlinkSync(ownerLeasePath());
   548	    }
   549	  } catch {
   550	    // Idempotent cleanup.
   551	  }
   552	}
   553	
   554	function leaseHeldFromFile(filePath, legacyPath = null) {
   555	  const lease = readLeaseFile(filePath);
   556	  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
   557	  const startedAt = lease.startedAt ?? new Date(0).toISOString();
   558	  // Surface the owner-recorded socket path so the bridge can prefer it over recomputing one that
   559	  // may diverge under a different SPECKIT_IPC_SOCKET_DIR. Null when the lease predates this field.
   560	  const socketPath = typeof lease.socketPath === 'string' && lease.socketPath.length > 0 ? lease.socketPath : null;
   561	  try {
   562	    process.kill(lease.pid, 0);
   563	    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
   564	  } catch (error) {
   565	    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath, socketPath };
   566	    // Mirror skill-advisor parity — EPERM means the process exists but we lack permission (e.g. sandbox); treat as live lease.
   567	    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
   568	    throw error;
   569	  }
   570	}
   571	
   572	function isLeaseHeld() {
   573	  const primary = leaseHeldFromFile(leasePath());
   574	  if (primary.held) return primary;
   575	
   576	  for (const legacyPath of legacyLeasePaths()) {
   577	    if (legacyPath === leasePath()) continue;
   578	    const legacy = leaseHeldFromFile(legacyPath, legacyPath);
   579	    if (legacy.held || legacy.staleReclaimable) return legacy;
   580	  }
   581	
   582	  return primary;
   583	}
   584	
   585	function writeLeaseHeldDiagnostic(leaseResult, suffix = '') {
   586	  const startedAt = leaseResult.startedAt ?? new Date(0).toISOString();
   587	  const legacyMarker = leaseResult.legacyPath ? ' (legacy path)' : '';
   588	  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
   589	}
   590	
   591	function writeLeaseHeldJsonRpcError(leaseResult, reason) {
   592	  process.stdout.write(`${JSON.stringify({
   593	    jsonrpc: '2.0',
   594	    id: null,
   595	    error: {
   596	      code: -32001,
   597	      message: `mk-spec-memory: lease held by pid ${leaseResult.ownerPid} but session bridge unavailable (${reason}); reconnect`,
   598	      data: { retryable: true },
   599	    },
   600	  })}\n`);
   601	}
   602	
   603	function bridgeReadiness(leaseResult) {
   604	  if (process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1') {
   605	    return { ready: false, reason: 'bridge-disabled' };
   606	  }
   607	  const storedSocketPath = leaseResult.socketPath;
   608	  if (
   609	    typeof storedSocketPath === 'string' &&
   610	    storedSocketPath.length > 0 &&
   611	    (storedSocketPath.startsWith('tcp://') || fs.existsSync(storedSocketPath))
   612	  ) {
   613	    return { ready: true, socketPath: storedSocketPath };
   614	  }
   615	  const { getIpcSocketPath } = loadBridgeModule();
   616	  if (typeof getIpcSocketPath !== 'function') {
   617	    return { ready: false, reason: 'bridge-module-missing' };
   618	  }
   619	  const socketPath = getIpcSocketPath('mk-spec-memory', { dbDir: resolvedDbDir() });
   620	  if (!socketPath.startsWith('tcp://') && !fs.existsSync(socketPath)) {
   621	    return { ready: false, reason: 'no-bridge-socket' };
   622	  }
   623	  return { ready: true, socketPath };
   624	}
   625	
   626	function leaseResultForOwnerLease(ownerLease) {
   627	  const pidLeaseResult = isLeaseHeld();
   628	  if (pidLeaseResult.held && pidLeaseResult.ownerPid === ownerLease.ownerPid) {
   629	    return pidLeaseResult;
   630	  }
   631	  return {
   632	    held: true,
   633	    ownerPid: ownerLease.ownerPid,
   634	    staleReclaimable: false,
   635	    startedAt: ownerLease.startedAtIso,
   636	    legacyPath: null,
   637	    socketPath: null,
   638	  };
   639	}
   640	
   641	function respawnLockPath() {
   642	  return path.join(resolvedDbDir(), '.mk-spec-memory-respawn.lock');
   643	}
   644	
   645	function modelServerRespawnLockPath(socketPath = resolveModelServerSocketPath()) {
   646	  return mss.modelServerRespawnLockPath(socketPath, { dbDir: resolvedDbDir });
   647	}
   648	
   649	function acquireRespawnLockFileAt(lockPath, label = 'respawn') {
   650	  return acquireSharedRespawnLockFileAt(lockPath, label, { log, rel });
   651	}
   652	
   653	function acquireRespawnLockFile() {
   654	  return acquireRespawnLockFileAt(respawnLockPath(), 'respawn');
   655	}
   656	
   657	function acquireModelServerRespawnLockFile(socketPath = resolveModelServerSocketPath()) {
   658	  return mss.acquireModelServerRespawnLockFile(socketPath, { dbDir: resolvedDbDir, log, rel });
   659	}
   660	
   661	const UNCLEAN_SHUTDOWN_MARKER = '.unclean-shutdown';
   662	
   663	// The context-server writes `.unclean-shutdown` on every DB open and removes it only after a
   664	// successful WAL checkpoint + db.close(). The launcher uses its presence to tell whether a reaped
   665	// child handed off the DB cleanly. Mirror the writer's location: the marker lives in the resolved
   666	// DB dir, or — when MEMORY_DB_PATH relocates the DB — that path's dirname. Best-effort: a wrong
   667	// guess only forfeits the clean-close confirmation; the replacement daemon's boot still self-heals.
   668	function uncleanShutdownMarkerPath() {
   669	  const override = process.env.MEMORY_DB_PATH;
   670	  const dir = override ? path.dirname(override) : resolvedDbDir();
   671	  return path.join(dir, UNCLEAN_SHUTDOWN_MARKER);
   672	}
   673	
   674	function uncleanMarkerPresent() {
   675	  try {
   676	    return fs.existsSync(uncleanShutdownMarkerPath());
   677	  } catch {
   678	    return false;
   679	  }
   680	}
   681	
   682	// A reap is a verified clean DB handoff only when the child exited on SIGTERM (not SIGKILL) AND the
   683	// clean-shutdown marker is gone (close_db ran its checkpoint + close). Anything else means the
   684	// replacement daemon will open a possibly-dirty shadow and must rebuild it at boot.
   685	function cleanCloseAfterReap({ killed, markerPresent }) {
   686	  return !killed && !markerPresent;
   687	}
   688	
   689	async function reapLeaseChildBeforeRespawn(childPid) {
   690	  const liveness = processLiveness(childPid);
   691	  if (liveness === 'unknown-eperm') {
   692	    return { allowed: false, reason: 'child-liveness-unknown-eperm' };
   693	  }
   694	  if (liveness === 'dead') {
   695	    return {
   696	      allowed: true,
   697	      reaped: false,
   698	      cleanClose: cleanCloseAfterReap({ killed: false, markerPresent: uncleanMarkerPresent() }),
   699	      reason: 'child-already-dead',
   700	    };
   701	  }
   702	
   703	  log(`confirmed-dead socket; reaping recorded context-server child pid ${childPid} before respawn`);
   704	  signalProcess(childPid, 'SIGTERM');
   705	  reapProcessTreeGroups(childPid, { signal: signalProcess });
   706	  const exitedAfterTerm = await waitForPidExit(childPid, RESPAWN_REAP_GRACE_MS);
   707	  let killed = false;
   708	  if (!exitedAfterTerm) {
   709	    log(`context-server child pid ${childPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
   710	    signalProcess(childPid, 'SIGKILL');
   711	    await waitForPidExit(childPid, 1000);
   712	    killed = true;
   713	  }
   714	
   715	  // Clean-close barrier: verify the child closed the DB cleanly (marker removed) before handing the
   716	  // DB to a replacement daemon. If it did not (graceful close timed out, or we had to SIGKILL), log
   717	  // it so the corruption window is visible — the replacement daemon's boot FTS auto-heal rebuilds the
   718	  // shadow. We never block respawn on this: a missing daemon is worse than a self-healing one.
   719	  const markerPresent = uncleanMarkerPresent();
   720	  const cleanClose = cleanCloseAfterReap({ killed, markerPresent });
   721	  if (!cleanClose) {
   722	    log(`reaped context-server child pid ${childPid} WITHOUT a verified clean DB close (killed=${killed}, uncleanMarkerPresent=${markerPresent}); the replacement daemon will rebuild the FTS shadow at boot`);
   723	  }
   724	  return { allowed: true, reaped: true, cleanClose, reason: 'child-reaped' };
   725	}
   726	
   727	async function reapOwnerBeforeRespawn(ownerPid) {
   728	  const liveness = processLiveness(ownerPid);
   729	  if (liveness === 'unknown-eperm') {
   730	    return { allowed: false, reason: 'owner-liveness-unknown-eperm' };
   731	  }
   732	  if (liveness === 'dead') {
   733	    return { allowed: true, reason: 'owner-already-dead' };
   734	  }
   735	
   736	  log(`confirmed-dead socket; reaping recorded spec-memory owner pid ${ownerPid} before respawn`);
   737	  signalProcess(ownerPid, 'SIGTERM');
   738	  const exitedAfterTerm = await waitForPidExit(ownerPid, RESPAWN_REAP_GRACE_MS);
   739	  if (!exitedAfterTerm) {
   740	    log(`spec-memory owner pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
   741	    signalProcess(ownerPid, 'SIGKILL');
   742	    await waitForPidExit(ownerPid, 1000);
   743	  }
   744	  return { allowed: true, reason: 'owner-reaped' };
   745	}
   746	
   747	async function respawnAfterDeadSocket(leaseResult, decision) {
   748	  if (process.env.SPECKIT_BRIDGE_RESPAWN_DISABLED === '1') {
   749	    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
   750	    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
   751	  }
   752	
   753	  const ownerPid = leaseResult.ownerPid;
   754	  if (!Number.isInteger(ownerPid) || ownerPid <= 0) {
   755	    log('confirmed-dead socket but no recorded spec-memory owner pid is available; respawn inert');
   756	    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-owner-pid)');
   757	    return { action: 'report', reason: 'missing-owner-pid', socketPath: decision.socketPath };
   758	  }
   759	
   760	  const lease = readLeaseFile(leaseResult.legacyPath || leasePath());
   761	  const childPid = lease?.childPid;
   762	  if (!Number.isInteger(childPid) || childPid <= 0) {
   763	    log('confirmed-dead socket but lease has no childPid; child-pid gate keeps respawn inert');
   764	    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-child-pid)');
   765	    return { action: 'report', reason: 'missing-child-pid', socketPath: decision.socketPath };
   766	  }
   767	
   768	  let bootstrapLockHeld = false;
   769	  let respawnLock = null;
   770	  try {
   771	    bootstrapLockHeld = await acquireBootstrapLock({ requireLock: true });
   772	    respawnLock = acquireRespawnLockFile();
   773	    if (!respawnLock.acquired) {
   774	      log(`dead-socket respawn skipped; another launcher owns ${rel(respawnLock.path)}`);
   775	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
   776	      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
   777	    }
   778	
   779	    const currentOwner = readOwnerLeaseFile();
   780	    if (currentOwner?.ownerPid !== ownerPid) {
   781	      log('dead-socket respawn skipped; spec-memory owner lease changed while waiting for respawn lock');
   782	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
   783	      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
   784	    }
   785	
   786	    const currentLease = readLeaseFile(leaseResult.legacyPath || leasePath());
   787	    if (currentLease?.pid !== leaseResult.ownerPid || currentLease?.childPid !== childPid) {
   788	      log('dead-socket respawn skipped; lease changed while waiting for respawn lock');
   789	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
   790	      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
   791	    }
   792	
   793	    const ownerReapResult = await reapOwnerBeforeRespawn(ownerPid);
   794	    if (!ownerReapResult.allowed) {
   795	      log(`dead-socket respawn skipped; ${ownerReapResult.reason} for ownerPid=${ownerPid}`);
   796	      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${ownerReapResult.reason})`);
   797	      return { action: 'report', reason: ownerReapResult.reason, socketPath: decision.socketPath };
   798	    }
   799	
   800	    clearOwnerLeaseFileIfOwner(ownerPid);
   801	    const ownerLease = buildOwnerLease(process.pid);
   802	    if (!writeOwnerLeaseFileExclusive(ownerLease)) {
   803	      const holder = readOwnerLeaseFile();
   804	      log(`dead-socket respawn skipped; another launcher owns spec-memory owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
   805	      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
   806	      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
   807	    }
   808	    ownerLeasePid = process.pid;
   809	
   810	    const reapResult = await reapLeaseChildBeforeRespawn(childPid);
   811	    if (!reapResult.allowed) {
   812	      log(`dead-socket respawn skipped; ${reapResult.reason} for childPid=${childPid}`);
   813	      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
   814	      return { action: 'report', reason: reapResult.reason, socketPath: decision.socketPath };
   815	    }
   816	
   817	    buildIfNeeded([]);
   818	    leaseStartedAt = new Date().toISOString();
   819	    writeLeaseFile();
   820	    launchServer();

exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-spec-memory-launcher.cjs | sed -n '820,1160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   820	    launchServer();
   821	    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
   822	  } finally {
   823	    releaseRespawnLockFile(respawnLock);
   824	    if (bootstrapLockHeld) {
   825	      fs.rmSync(lockDir, { recursive: true, force: true });
   826	    }
   827	  }
   828	}
   829	
   830	async function bridgeOrReportLeaseHeld(leaseResult) {
   831	  const readiness = bridgeReadiness(leaseResult);
   832	  if (!readiness.ready) {
   833	    writeLeaseHeldJsonRpcError(leaseResult, readiness.reason);
   834	    return { action: 'report', reason: readiness.reason };
   835	  }
   836	  const { maybeBridgeLeaseHolder } = loadBridgeModule();
   837	  const decision = await maybeBridgeLeaseHolder({
   838	    serviceName: 'mk-spec-memory',
   839	    leaseResult,
   840	    loggerPrefix: 'mk-spec-memory-launcher',
   841	    dbDir: resolvedDbDir(),
   842	    bridge: bridgeStdioThroughSessionProxy,
   843	  });
   844	  if (decision && decision.action === 'respawn') {
   845	    return await respawnAfterDeadSocket(leaseResult, decision);
   846	  }
   847	  return decision;
   848	}
   849	
   850	async function bridgeOrReportLeaseHeldAndExit(leaseResult) {
   851	  const decision = await bridgeOrReportLeaseHeld(leaseResult);
   852	  if (!decision || decision.action === 'report') {
   853	    clearOwnerLeaseFile();
   854	    process.exit(0);
   855	  }
   856	  return decision;
   857	}
   858	
   859	function resolveModelServerSocketPath(env = process.env, options = {}) {
   860	  return mss.resolveModelServerSocketPath(env, {
   861	    ...options,
   862	    dbDir: options.dbDir || resolvedDbDir,
   863	  });
   864	}
   865	
   866	function getContextServerPid() {
   867	  return isChildRunning(childProcess) ? childProcess.pid : null;
   868	}
   869	
   870	// Pure lease-payload builder (exported for tests). `childPid`, `modelServerPid`, and `socketPath`
   871	// are ADDITIVE fields; existing readers consume only pid/startedAt/ownerPid and ignore the extras.
   872	// `socketPath` records the IPC path this owner actually listens on so a secondary launcher prefers
   873	// it over recomputing one that can diverge under a different SPECKIT_IPC_SOCKET_DIR.
   874	function buildLeaseObject(childPid = null, startedAt = leaseStartedAt, modelServerPid = null, socketPath = null) {
   875	  return buildSharedLeaseObject(childPid, startedAt || new Date().toISOString(), modelServerPid, socketPath);
   876	}
   877	
   878	function writeLeaseFile(childPid = getContextServerPid(), modelServerPid = hfControl.getPid()) {
   879	  if (!leaseStartedAt) leaseStartedAt = new Date().toISOString();
   880	  const payload = buildLeaseObject(childPid, leaseStartedAt, modelServerPid, resolveSessionProxySocketPath());
   881	  return writeAtomicJsonFile(leasePath(), payload, 'lease write');
   882	}
   883	
   884	function sharedModelServerPidPath(socketPath = resolveModelServerSocketPath()) {
   885	  const pidDir = socketPath.startsWith('tcp://') ? resolvedDbDir() : path.dirname(socketPath);
   886	  return path.join(pidDir, HF_MODEL_SERVER_PID_FILE_NAME);
   887	}
   888	
   889	function writeSharedModelServerPid(pid) {
   890	  const socketPath = resolveModelServerSocketPath();
   891	  const pidPath = sharedModelServerPidPath(socketPath);
   892	  if (!Number.isInteger(pid) || pid <= 0) {
   893	    try {
   894	      fs.unlinkSync(pidPath);
   895	    } catch (error) {
   896	      if (error.code === 'ENOENT') return true;
   897	      if (isDurableWriteUnavailable(error)) {
   898	        logDurableWriteUnavailableOnce('shared model-server pid clear', pidPath, error);
   899	        return false;
   900	      }
   901	      throw error;
   902	    }
   903	    return true;
   904	  }
   905	
   906	  return writeAtomicJsonFile(pidPath, {
   907	    pid,
   908	    startedAt: new Date().toISOString(),
   909	    ownerLauncher: 'mk-spec-memory',
   910	    socketPath,
   911	  }, 'shared model-server pid write');
   912	}
   913	
   914	function readSharedModelServerPid() {
   915	  const pidPath = sharedModelServerPidPath();
   916	  try {
   917	    const parsed = JSON.parse(fs.readFileSync(pidPath, 'utf8'));
   918	    if (Number.isInteger(parsed.pid) && parsed.pid > 0) return parsed.pid;
   919	  } catch (error) {
   920	    if (error.code !== 'ENOENT') {
   921	      // Corrupt pid files are treated like absent pid files; the respawn lock still serializes recovery.
   922	    }
   923	  }
   924	
   925	  const lease = readLeaseFile();
   926	  return Number.isInteger(lease?.modelServerPid) && lease.modelServerPid > 0 ? lease.modelServerPid : null;
   927	}
   928	
   929	const hfControl = mss.createModelServerControl({
   930	  log,
   931	  env: process.env,
   932	  rootDir: root,
   933	  opencodeDir,
   934	  dbDir: resolvedDbDir,
   935	  getLauncherShutdownInProgress: () => launcherShutdownInProgress,
   936	  onRssBreach: (cfg) => recycleDaemonInPlace(cfg.graceMs),
   937	  bridge: loadBridgeModule(),
   938	  writeModelServerPid: (pid) => writeSharedModelServerPid(pid),
   939	  readModelServerPid: () => readSharedModelServerPid(),
   940	  writeLease: () => writeLeaseFile(),
   941	});
   942	
   943	function clearLeaseFile() {
   944	  try {
   945	    const lease = readLeaseFile();
   946	    if (launcherShutdownInProgress && Number.isInteger(lease?.modelServerPid) && lease.modelServerPid > 0) {
   947	      try {
   948	        hfControl.reapProcessTree(lease.modelServerPid);
   949	      } catch {
   950	        // Lease cleanup must remain best-effort even if a final process-tree read fails.
   951	      }
   952	    }
   953	    if (lease && lease.pid === process.pid) fs.unlinkSync(leasePath());
   954	  } catch {
   955	    // Idempotent cleanup.
   956	  }
   957	}
   958	
   959	function clearAllLeaseFiles() {
   960	  clearLeaseFile();
   961	  clearOwnerLeaseFile();
   962	}
   963	
   964	function isInside(parent, child) {
   965	  const relative = path.relative(parent, child);
   966	  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
   967	}
   968	
   969	function enforceStandaloneCodeGraphDb(actions) {
   970	  const current = process.env.SPECKIT_CODE_GRAPH_DB_DIR;
   971	  const resolvedCurrent = current ? path.resolve(current) : null;
   972	  const resolvedCanonical = path.resolve(canonicalCodeGraphDbDir);
   973	  const specKitRoot = path.resolve(kitDir);
   974	
   975	  if (!resolvedCurrent || isInside(specKitRoot, resolvedCurrent)) {
   976	    process.env.SPECKIT_CODE_GRAPH_DB_DIR = resolvedCanonical;
   977	    actions.push(
   978	      `set SPECKIT_CODE_GRAPH_DB_DIR=${rel(resolvedCanonical)} for standalone system-code-graph storage`
   979	    );
   980	  }
   981	}
   982	
   983	function run(command, args, options = {}) {
   984	  const result = spawnSync(command, args, {
   985	    cwd: options.cwd || root,
   986	    env: process.env,
   987	    encoding: 'utf8',
   988	    stdio: ['ignore', 'pipe', 'pipe'],
   989	  });
   990	
   991	  if (result.stdout) {
   992	    process.stderr.write(result.stdout);
   993	  }
   994	  if (result.stderr) {
   995	    process.stderr.write(result.stderr);
   996	  }
   997	  if (result.error) {
   998	    throw result.error;
   999	  }
  1000	  if (result.status !== 0) {
  1001	    throw new Error(`${command} ${args.join(' ')} exited ${result.status}`);
  1002	  }
  1003	}
  1004	
  1005	function ensureLayout(actions) {
  1006	  if (!exists(skillsDir) && exists(legacySkillDir) && !fs.lstatSync(legacySkillDir).isSymbolicLink()) {
  1007	    fs.renameSync(legacySkillDir, skillsDir);
  1008	    fs.symlinkSync('skills', legacySkillDir, 'dir');
  1009	    actions.push('promoted .opencode/skill to .opencode/skills and created compatibility symlink');
  1010	    refreshPaths();
  1011	    return;
  1012	  }
  1013	
  1014	  if (exists(skillsDir) && exists(legacySkillDir) && !fs.lstatSync(legacySkillDir).isSymbolicLink()) {
  1015	    const backup = path.join(opencodeDir, `skill_legacy_backup_${new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, 'Z')}`);
  1016	    fs.renameSync(legacySkillDir, backup);
  1017	    fs.symlinkSync('skills', legacySkillDir, 'dir');
  1018	    actions.push(`moved legacy .opencode/skill to ${rel(backup)} and created compatibility symlink`);
  1019	    refreshPaths();
  1020	    return;
  1021	  }
  1022	
  1023	  // Compatibility symlink `.opencode/skill -> skills` removed: 096 packet cleaned
  1024	  // up consumers of the singular path, so the bridge no longer needs to be
  1025	  // recreated on every MCP startup. Migration paths above (rename / move-aside)
  1026	  // still create the symlink when an actual legacy singular dir is present.
  1027	}
  1028	
  1029	function requiredArtifacts() {
  1030	  return [
  1031	    path.join(kitDir, 'mcp_server', 'dist', 'context-server.js'),
  1032	    path.join(kitDir, 'scripts', 'dist', 'graph', 'backfill-graph-metadata.js'),
  1033	    path.join(kitDir, 'scripts', 'dist', 'spec-folder', 'generate-description.js'),
  1034	  ];
  1035	}
  1036	
  1037	function artifactsReady() {
  1038	  return requiredArtifacts().every(exists);
  1039	}
  1040	
  1041	function buildIfNeeded(actions) {
  1042	  if (artifactsReady()) {
  1043	    return;
  1044	  }
  1045	
  1046	  if (!exists(kitDir)) {
  1047	    throw new Error(`system-spec-kit not found at ${rel(kitDir)}`);
  1048	  }
  1049	
  1050	  actions.push('installed dependencies and built @spec-kit/mcp-server plus @spec-kit/scripts');
  1051	  const installCommand = exists(path.join(kitDir, 'package-lock.json')) ? 'ci' : 'install';
  1052	  run('npm', [installCommand, '--no-audit', '--no-fund', '--silent'], { cwd: kitDir });
  1053	  run('npm', ['run', 'build', '--workspace=@spec-kit/mcp-server'], { cwd: kitDir });
  1054	  run('npm', ['run', 'build', '--workspace=@spec-kit/scripts'], { cwd: kitDir });
  1055	
  1056	  const missing = requiredArtifacts().filter((artifact) => !exists(artifact));
  1057	  if (missing.length > 0) {
  1058	    throw new Error(`bootstrap finished but artifacts are still missing: ${missing.map(rel).join(', ')}`);
  1059	  }
  1060	}
  1061	
  1062	function getContextServerNodeArgs() {
  1063	  const nodeArgs = [];
  1064	  const rawOldSpaceMb = process.env.SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB;
  1065	  if (rawOldSpaceMb === undefined || rawOldSpaceMb === null || String(rawOldSpaceMb).trim() === '') {
  1066	    return nodeArgs;
  1067	  }
  1068	
  1069	  const parsedOldSpaceMb = Number.parseInt(String(rawOldSpaceMb).trim(), 10);
  1070	  if (!Number.isFinite(parsedOldSpaceMb) || parsedOldSpaceMb <= 0) {
  1071	    log(`ignoring invalid SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB=${JSON.stringify(rawOldSpaceMb)}`);
  1072	    return nodeArgs;
  1073	  }
  1074	
  1075	  nodeArgs.push(`--max-old-space-size=${parsedOldSpaceMb}`);
  1076	  log(`applying context-server V8 old-space cap: ${parsedOldSpaceMb} MB`);
  1077	  return nodeArgs;
  1078	}
  1079	
  1080	function waitForChildExit(child, timeoutMs) {
  1081	  if (!isChildRunning(child)) return Promise.resolve(true);
  1082	  return new Promise((resolve) => {
  1083	    let settled = false;
  1084	    const finish = (exited) => {
  1085	      if (settled) return;
  1086	      settled = true;
  1087	      clearTimeout(timer);
  1088	      child.off('exit', onExit);
  1089	      resolve(exited);
  1090	    };
  1091	    const onExit = () => finish(true);
  1092	    const timer = setTimeout(() => finish(false), timeoutMs);
  1093	    timer.unref?.();
  1094	    child.once('exit', onExit);
  1095	  });
  1096	}
  1097	
  1098	// Refresh the before-death descendant snapshot from a live process-tree walk. Called periodically by
  1099	// the monitor while the child is alive. On an unknown/permission-denied read (null), the previous
  1100	// snapshot is KEPT (a transient ps failure must not erase the only handle on an orphan-able sidecar).
  1101	function refreshDescendantSnapshot(childPid, runner = defaultProcessRowsRunner) {
  1102	  return mss.refreshDescendantSnapshot(childPid, runner, {
  1103	    snapshotPids: lastKnownDescendantPids,
  1104	    snapshot: {
  1105	      set: (pids) => {
  1106	        lastKnownDescendantPids = pids;
  1107	      },
  1108	    },
  1109	  });
  1110	}
  1111	
  1112	// Reap an orphaned sidecar on crash-loop give-up. The dominant RSS risk lives in a
  1113	// forked-detached sidecar GRANDCHILD; on hard daemon death it re-parents to pid 1, so a fresh walk
  1114	// anchored on the (now-dead, ps-absent) childPid finds nothing. We therefore reap the UNION of any
  1115	// still-live childPid subtree (the not-yet-reparented case) and the before-death snapshot
  1116	// (`lastKnownDescendantPids`), filtered to currently-alive, signalable pids. The signal-0 alive gate
  1117	// bounds (but cannot fully eliminate) pid-reuse risk; the snapshot is at most one monitor tick old.
  1118	function reapProcessTreeGroups(childPid, options = {}) {
  1119	  return mss.reapProcessTreeGroups(childPid, {
  1120	    ...options,
  1121	    snapshotPids: options.snapshotPids ?? lastKnownDescendantPids,
  1122	    signal: options.signal || signalProcess,
  1123	  });
  1124	}
  1125	
  1126	// Dependency seam mirrors the launcher's other supervision helpers (startRssWatchdog,
  1127	// reapProcessTreeGroups): production callers pass only graceMs, so deps default to the live
  1128	// closures and runtime behavior is unchanged; tests inject fakes to assert lease handling.
  1129	async function recycleDaemonInPlace(graceMs, deps = {}) {
  1130	  const ctx = {
  1131	    getContextChild: deps.getContextChild ?? (() => childProcess),
  1132	    hfControl: deps.hfControl ?? hfControl,
  1133	    isChildRunning: deps.isChildRunning ?? isChildRunning,
  1134	    waitForChildExit: deps.waitForChildExit ?? waitForChildExit,
  1135	    clearLease: deps.clearLease ?? clearLeaseFile,
  1136	    clearWatchdog: deps.clearWatchdog ?? (() => { if (rssWatchdogTimer) clearInterval(rssWatchdogTimer); }),
  1137	    isRecycleInProgress: deps.isRecycleInProgress ?? (() => rssBreachSelfExitInProgress),
  1138	    setRecycleInProgress: deps.setRecycleInProgress ?? ((value) => { rssBreachSelfExitInProgress = value; }),
  1139	    log: deps.log ?? log,
  1140	  };
  1141	  if (ctx.isRecycleInProgress()) return;
  1142	  ctx.setRecycleInProgress(true);
  1143	  ctx.clearWatchdog();
  1144	  ctx.hfControl.clearTimers();
  1145	  await ctx.hfControl.stopDemandListener();
  1146	  const modelServerChild = ctx.hfControl.getChild();
  1147	  if (ctx.isChildRunning(modelServerChild)) {
  1148	    ctx.log(`RSS ceiling sustained; sending SIGTERM to hf-model-server pid ${modelServerChild.pid} before daemon recycle`);
  1149	    modelServerChild.kill('SIGTERM');
  1150	    ctx.hfControl.reapProcessTree(modelServerChild.pid);
  1151	    const modelExitedAfterTerm = await ctx.waitForChildExit(modelServerChild, graceMs);
  1152	    if (!modelExitedAfterTerm && ctx.isChildRunning(modelServerChild)) {
  1153	      ctx.log(`hf-model-server pid ${modelServerChild.pid} exceeded ${graceMs}ms grace; sending SIGKILL before daemon recycle`);
  1154	      modelServerChild.kill('SIGKILL');
  1155	      await ctx.waitForChildExit(modelServerChild, 1000);
  1156	    }
  1157	  }
  1158	  const contextChild = ctx.getContextChild();
  1159	  if (!ctx.isChildRunning(contextChild)) {
  1160	    ctx.clearLease();

exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-spec-memory-launcher.cjs | sed -n '1320,1445p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1320	        mirrorSignal: (exitSignal) => process.kill(process.pid, exitSignal),
  1321	        exit: (exitCode) => process.exit(exitCode),
  1322	        scheduleRelaunch: (backoffMs) => {
  1323	          log(`context-server child exited code=${code ?? 'null'} signal=${signal ?? 'null'}; relaunching in ${backoffMs}ms`);
  1324	          supervisorRelaunchTimer = setTimeout(() => {
  1325	            // Owner-disposal race guard: by the time the backoff fires, re-check that this
  1326	            // launcher is still live AND its owning runtime is still present. Respawning the
  1327	            // daemon under a disposing session is what produced the SIGTERM/relaunch flap that
  1328	            // dropped every bridged session's transport. Crash-recovery and RSS-recycle are
  1329	            // unaffected — both run with the owning runtime alive and no shutdown in progress.
  1330	            if (shouldAbortRelaunchOnFire({ shuttingDown: launcherShutdownInProgress, currentPpid: process.ppid, initialPpid: LAUNCHER_INITIAL_PPID })) {
  1331	              log('relaunch aborted: launcher shutting down or owning runtime gone; releasing lease and exiting');
  1332	              clearAllLeaseFiles();
  1333	              process.exit(0);
  1334	              return;
  1335	            }
  1336	            launchServer();
  1337	          }, backoffMs);
  1338	          supervisorRelaunchTimer.unref?.();
  1339	        },
  1340	      },
  1341	    );
  1342	    if (result.action === 'give-up') {
  1343	      log(`context-server crash loop detected after ${result.deathsInWindow} deaths; clearing lease and mirroring child exit`);
  1344	    }
  1345	  });
  1346	
  1347	  childProcess.on('error', (error) => {
  1348	    log(error.stack || error.message);
  1349	    process.exit(1);
  1350	  });
  1351	  if (rssBreachSelfExitInProgress) {
  1352	    rssBreachSelfExitInProgress = false;
  1353	  }
  1354	  return true;
  1355	}
  1356	
  1357	async function shutdownLauncherForSignal(signal) {
  1358	  if (launcherShutdownInProgress) return;
  1359	  launcherShutdownInProgress = true;
  1360	  if (rssWatchdogTimer) clearInterval(rssWatchdogTimer);
  1361	  if (supervisorRelaunchTimer) clearTimeout(supervisorRelaunchTimer);
  1362	  clearOwnerLeaseHeartbeat();
  1363	  hfControl.clearTimers();
  1364	  await hfControl.stopDemandListener();
  1365	
  1366	  // Re-election release path (default off): release the detached context-server for a live secondary to adopt
  1367	  // instead of killing it. Reap only the non-adoptable model-server, KEEP the daemon lease (its socket
  1368	  // stays findable for adoption), drop only OWNERSHIP, and exit without killing the daemon. When the
  1369	  // flag is off this branch is skipped and the original kill path below runs unchanged.
  1370	  if (shouldReleaseDaemonForReelection({ enabled: daemonReelectionEnabled(), hasLiveDaemon: isChildRunning(childProcess) })) {
  1371	    const releasedModelServer = hfControl.getChild();
  1372	    if (isChildRunning(releasedModelServer)) {
  1373	      hfControl.reapProcessTree(releasedModelServer.pid);
  1374	      releasedModelServer.kill(signal);
  1375	    }
  1376	    log('daemon re-election: releasing context-server for adoption (not killing); dropping ownership lease only');
  1377	    // The process 'exit' handler clears BOTH leases; detach it first so the daemon lease (its socket
  1378	    // path) survives for a secondary to adopt. Ownership is still dropped explicitly below.
  1379	    process.removeListener('exit', clearAllLeaseFiles);
  1380	    clearOwnerLeaseFile();
  1381	    process.exit(0);
  1382	    return;
  1383	  }
  1384	
  1385	  const children = [];
  1386	  if (isChildRunning(childProcess)) {
  1387	    children.push({ child: childProcess, label: 'context-server' });
  1388	  }
  1389	  const modelServerChild = hfControl.getChild();
  1390	  if (isChildRunning(modelServerChild)) {
  1391	    children.push({ child: modelServerChild, label: 'hf-model-server' });
  1392	  }
  1393	
  1394	  if (children.length === 0) {
  1395	    clearAllLeaseFiles();
  1396	    process.exit(128);
  1397	    return;
  1398	  }
  1399	
  1400	  for (const { child, label } of children) {
  1401	    if (label === 'hf-model-server') {
  1402	      hfControl.reapProcessTree(child.pid);
  1403	    }
  1404	    child.kill(signal);
  1405	  }
  1406	
  1407	  const exited = await Promise.race([
  1408	    Promise.all(children.map(({ child }) => waitForChildExit(child, RESPAWN_REAP_GRACE_MS))).then((results) => results.every(Boolean)),
  1409	    sleep(RESPAWN_REAP_GRACE_MS).then(() => false),
  1410	  ]);
  1411	  if (!exited) {
  1412	    for (const { child } of children) {
  1413	      if (isChildRunning(child)) child.kill('SIGKILL');
  1414	    }
  1415	  }
  1416	  clearAllLeaseFiles();
  1417	  process.exit(128);
  1418	}
  1419	
  1420	function installSignalHandlers() {
  1421	  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT']) {
  1422	    process.on(signal, () => {
  1423	      void shutdownLauncherForSignal(signal).catch((error) => {
  1424	        log(error.stack || error.message);
  1425	        clearAllLeaseFiles();
  1426	        process.exit(128);
  1427	      });
  1428	    });
  1429	  }
  1430	  process.on('uncaughtException', (err) => {
  1431	    try {
  1432	      clearAllLeaseFiles();
  1433	    } catch {
  1434	      // Preserve default uncaughtException crash behavior.
  1435	    }
  1436	    throw err;
  1437	  });
  1438	}
  1439	
  1440	async function main() {
  1441	  loadProjectEnvFiles();
  1442	  const started = now();
  1443	  const actions = [];
  1444	  let lockHeld = false;
  1445	

exec
/bin/zsh -lc 'rg -n "leaseHeldFromFile|isLeaseHeld|staleReclaim|bridgeOrReportLeaseHeld|reapLeaseChildBeforeRespawn|respawnAfterDeadSocket|acquireRespawn|writeLease|buildLease|childPid|shutdownLauncherForSignal|function main" .opencode/bin/mk-spec-memory-launcher.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
20:  acquireRespawnLockFileAt: acquireSharedRespawnLockFileAt,
21:  buildLeaseObject: buildSharedLeaseObject,
512:    void shutdownLauncherForSignal('SIGTERM').catch((error) => {
554:function leaseHeldFromFile(filePath, legacyPath = null) {
556:  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
563:    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
565:    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath, socketPath };
567:    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
572:function isLeaseHeld() {
573:  const primary = leaseHeldFromFile(leasePath());
578:    const legacy = leaseHeldFromFile(legacyPath, legacyPath);
579:    if (legacy.held || legacy.staleReclaimable) return legacy;
585:function writeLeaseHeldDiagnostic(leaseResult, suffix = '') {
591:function writeLeaseHeldJsonRpcError(leaseResult, reason) {
627:  const pidLeaseResult = isLeaseHeld();
634:    staleReclaimable: false,
649:function acquireRespawnLockFileAt(lockPath, label = 'respawn') {
653:function acquireRespawnLockFile() {
654:  return acquireRespawnLockFileAt(respawnLockPath(), 'respawn');
689:async function reapLeaseChildBeforeRespawn(childPid) {
690:  const liveness = processLiveness(childPid);
703:  log(`confirmed-dead socket; reaping recorded context-server child pid ${childPid} before respawn`);
704:  signalProcess(childPid, 'SIGTERM');
705:  reapProcessTreeGroups(childPid, { signal: signalProcess });
706:  const exitedAfterTerm = await waitForPidExit(childPid, RESPAWN_REAP_GRACE_MS);
709:    log(`context-server child pid ${childPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
710:    signalProcess(childPid, 'SIGKILL');
711:    await waitForPidExit(childPid, 1000);
722:    log(`reaped context-server child pid ${childPid} WITHOUT a verified clean DB close (killed=${killed}, uncleanMarkerPresent=${markerPresent}); the replacement daemon will rebuild the FTS shadow at boot`);
747:async function respawnAfterDeadSocket(leaseResult, decision) {
749:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
756:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-owner-pid)');
761:  const childPid = lease?.childPid;
762:  if (!Number.isInteger(childPid) || childPid <= 0) {
763:    log('confirmed-dead socket but lease has no childPid; child-pid gate keeps respawn inert');
764:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-no-child-pid)');
772:    respawnLock = acquireRespawnLockFile();
775:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
782:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
787:    if (currentLease?.pid !== leaseResult.ownerPid || currentLease?.childPid !== childPid) {
789:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
796:      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${ownerReapResult.reason})`);
805:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
810:    const reapResult = await reapLeaseChildBeforeRespawn(childPid);
812:      log(`dead-socket respawn skipped; ${reapResult.reason} for childPid=${childPid}`);
813:      writeLeaseHeldDiagnostic(leaseResult, ` (dead-socket-${reapResult.reason})`);
819:    writeLeaseFile();
830:async function bridgeOrReportLeaseHeld(leaseResult) {
833:    writeLeaseHeldJsonRpcError(leaseResult, readiness.reason);
845:    return await respawnAfterDeadSocket(leaseResult, decision);
850:async function bridgeOrReportLeaseHeldAndExit(leaseResult) {
851:  const decision = await bridgeOrReportLeaseHeld(leaseResult);
870:// Pure lease-payload builder (exported for tests). `childPid`, `modelServerPid`, and `socketPath`
874:function buildLeaseObject(childPid = null, startedAt = leaseStartedAt, modelServerPid = null, socketPath = null) {
875:  return buildSharedLeaseObject(childPid, startedAt || new Date().toISOString(), modelServerPid, socketPath);
878:function writeLeaseFile(childPid = getContextServerPid(), modelServerPid = hfControl.getPid()) {
880:  const payload = buildLeaseObject(childPid, leaseStartedAt, modelServerPid, resolveSessionProxySocketPath());
940:  writeLease: () => writeLeaseFile(),
1101:function refreshDescendantSnapshot(childPid, runner = defaultProcessRowsRunner) {
1102:  return mss.refreshDescendantSnapshot(childPid, runner, {
1114:// anchored on the (now-dead, ps-absent) childPid finds nothing. We therefore reap the UNION of any
1115:// still-live childPid subtree (the not-yet-reparented case) and the before-death snapshot
1118:function reapProcessTreeGroups(childPid, options = {}) {
1119:  return mss.reapProcessTreeGroups(childPid, {
1176:  // relaunch rewrites childPid — where a concurrent launcher reads no lease and passes the
1177:  // single-writer gate, producing a competing daemon. Relaunch (writeLeaseFile) rewrites childPid.
1180:function startRssWatchdog(childPid, options = {}) {
1181:  return mss.startRssWatchdog(childPid, {
1199:// Launcher-local factory that pre-seeds the launcher-aware defaults (writeLease/shouldExitLauncher/
1202:// Explicit caller options still win via the trailing spread for targeted writeLease injection.
1205:    writeLease: () => writeLeaseFile(),
1301:  const childPid = childProcess.pid;
1307:  writeLeaseFile(childPid);
1308:  startRssWatchdog(childPid);
1315:      { code, signal, childPid, intentional: false },
1357:async function shutdownLauncherForSignal(signal) {
1423:      void shutdownLauncherForSignal(signal).catch((error) => {
1440:async function main() {
1455:      const legacyLeaseResult = isLeaseHeld();
1456:      if (legacyLeaseResult.held && legacyLeaseResult.legacyPath && !legacyLeaseResult.staleReclaimable) {
1457:        await bridgeOrReportLeaseHeldAndExit(legacyLeaseResult);
1470:        await bridgeOrReportLeaseHeldAndExit(leaseResultForOwnerLease(ownerLeaseResult.holder));
1474:      const leaseResult = isLeaseHeld();
1475:      if (leaseResult.held && !leaseResult.staleReclaimable) {
1477:        await bridgeOrReportLeaseHeldAndExit(leaseResult);
1480:      if (leaseResult.staleReclaimable) {
1481:        log(`staleReclaimed: true${leaseResult.legacyPath ? ' (legacy path)' : ''}`);
1502:    writeLeaseFile();
1507:      writeLeaseHeldJsonRpcError({ ownerPid: reprobe ? reprobe.pid : 'unknown', startedAt }, 'lease-reprobe-lost');
1549:  buildLeaseObject,
1574:  reapLeaseChildBeforeRespawn,
1586:  writeLeaseFile,

codex
Found the hinge: the persisted lease stores both launcher `pid` and daemon `childPid`, but the normal startup classifier only probes `pid`. I’m checking the startup branch now to confirm whether the stale path ever reaps or adopts `childPid`.
exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-spec-memory-launcher.cjs | sed -n '1260,1320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-spec-memory-launcher.cjs | sed -n '1440,1525p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1260	      }
  1261	      if (artifactsReady() && !requireLock) {
  1262	        return false;
  1263	      }
  1264	      if (Date.now() > deadline) {
  1265	        throw new Error(`bootstrap lock timed out at ${rel(lockDir)}`);
  1266	      }
  1267	      await sleep(1000);
  1268	    }
  1269	  }
  1270	}
  1271	
  1272	function launchServer() {
  1273	  if (ownerLeaseRequired && !ownsOwnerLeaseFile(process.pid)) {
  1274	    log('launchServer skipped: spec-memory owner lease is absent or owned by another launcher');
  1275	    return false;
  1276	  }
  1277	  if (shouldSkipLaunch(childProcess)) {
  1278	    log('launchServer skipped: a context-server child is already running in this launcher process');
  1279	    return false;
  1280	  }
  1281	  if (!crashLoopGuard) crashLoopGuard = createCrashLoopGuard(getCrashLoopConfig());
  1282	  if (supervisorRelaunchTimer) {
  1283	    clearTimeout(supervisorRelaunchTimer);
  1284	    supervisorRelaunchTimer = null;
  1285	  }
  1286	  const server = path.join(kitDir, 'mcp_server', 'dist', 'context-server.js');
  1287	  const nodeArgs = getContextServerNodeArgs();
  1288	  const reelectionEnabled = daemonReelectionEnabled();
  1289	  const spawnIo = contextServerSpawnIo(reelectionEnabled);
  1290	  childProcess = spawn(process.execPath, [...nodeArgs, server], {
  1291	    cwd: root,
  1292	    env: {
  1293	      ...process.env,
  1294	      SPECKIT_BACKEND_ONLY: '1',
  1295	    },
  1296	    stdio: spawnIo.stdio,
  1297	    detached: spawnIo.detached,
  1298	  });
  1299	  // Re-election only: let the launcher exit without keeping the detached daemon tethered to it.
  1300	  if (reelectionEnabled) childProcess.unref();
  1301	  const childPid = childProcess.pid;
  1302	  const refreshed = refreshOwnerLeaseFile(process.pid);
  1303	  if (!refreshed) {
  1304	    log('owner lease refresh failed after child spawn; launcher pid remains the recorded owner');
  1305	  }
  1306	  startOwnerLeaseHeartbeat(process.pid);
  1307	  writeLeaseFile(childPid);
  1308	  startRssWatchdog(childPid);
  1309	
  1310	  childProcess.on('exit', (code, signal) => {
  1311	    if (launcherShutdownInProgress) {
  1312	      return;
  1313	    }
  1314	    const result = superviseChildExit(
  1315	      { code, signal, childPid, intentional: false },
  1316	      {
  1317	        crashLoopGuard,
  1318	        clearLease: clearAllLeaseFiles,
  1319	        reapProcessGroup: reapProcessTreeGroups,
  1320	        mirrorSignal: (exitSignal) => process.kill(process.pid, exitSignal),

 succeeded in 0ms:
  1440	async function main() {
  1441	  loadProjectEnvFiles();
  1442	  const started = now();
  1443	  const actions = [];
  1444	  let lockHeld = false;
  1445	
  1446	  try {
  1447	    installSignalHandlers();
  1448	    // Lease cleanup runs unconditionally regardless of child termination path.
  1449	    process.on('exit', clearAllLeaseFiles);
  1450	    refreshPaths();
  1451	
  1452	    const strictSingleWriter = !isStrictModeDisabled(process.env.MK_SPEC_MEMORY_STRICT_SINGLE_WRITER);
  1453	    ownerLeaseRequired = strictSingleWriter;
  1454	    if (strictSingleWriter) {
  1455	      const legacyLeaseResult = isLeaseHeld();
  1456	      if (legacyLeaseResult.held && legacyLeaseResult.legacyPath && !legacyLeaseResult.staleReclaimable) {
  1457	        await bridgeOrReportLeaseHeldAndExit(legacyLeaseResult);
  1458	        return;
  1459	      }
  1460	    }
  1461	
  1462	    ensureLayout(actions);
  1463	    refreshPaths();
  1464	    enforceStandaloneCodeGraphDb(actions);
  1465	
  1466	    if (strictSingleWriter) {
  1467	      const ownerLeaseResult = acquireOwnerLeaseFile();
  1468	      if (!ownerLeaseResult.acquired) {
  1469	        log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
  1470	        await bridgeOrReportLeaseHeldAndExit(leaseResultForOwnerLease(ownerLeaseResult.holder));
  1471	        return;
  1472	      }
  1473	
  1474	      const leaseResult = isLeaseHeld();
  1475	      if (leaseResult.held && !leaseResult.staleReclaimable) {
  1476	        clearOwnerLeaseFile();
  1477	        await bridgeOrReportLeaseHeldAndExit(leaseResult);
  1478	        return;
  1479	      }
  1480	      if (leaseResult.staleReclaimable) {
  1481	        log(`staleReclaimed: true${leaseResult.legacyPath ? ' (legacy path)' : ''}`);
  1482	      }
  1483	    } else {
  1484	      log('MK_SPEC_MEMORY_STRICT_SINGLE_WRITER is disabled; skipping lease check');
  1485	    }
  1486	
  1487	    lockHeld = await acquireBootstrapLock();
  1488	    if (lockHeld) {
  1489	      buildIfNeeded(actions);
  1490	      writeState({
  1491	        command: 'mk-spec-memory-launcher',
  1492	        start: started,
  1493	        end: now(),
  1494	        status: 'ready',
  1495	        actions,
  1496	        server: rel(path.join(kitDir, 'mcp_server', 'dist', 'context-server.js')),
  1497	      });
  1498	      fs.rmSync(lockDir, { recursive: true, force: true });
  1499	      lockHeld = false;
  1500	    }
  1501	
  1502	    writeLeaseFile();
  1503	    const reprobe = readLeaseFile();
  1504	    if (!reprobe || reprobe.pid !== process.pid) {
  1505	      const startedAt = reprobe?.startedAt ?? new Date(0).toISOString();
  1506	      clearOwnerLeaseFile();
  1507	      writeLeaseHeldJsonRpcError({ ownerPid: reprobe ? reprobe.pid : 'unknown', startedAt }, 'lease-reprobe-lost');
  1508	      process.exit(0);
  1509	    }
  1510	    const launched = launchServer();
  1511	    if (!launched) return;
  1512	    if (launched) {
  1513	      const sessionProxy = createSessionProxy({
  1514	        socketPath: resolveSessionProxySocketPath(),
  1515	        stdin: process.stdin,
  1516	        stdout: process.stdout,
  1517	        log,
  1518	      });
  1519	      await sessionProxy.start();
  1520	    }
  1521	    void startModelServerDemandListener().catch((error) => {
  1522	      log(`hf-model-server demand listener failed: ${error.stack || error.message}`);
  1523	    });
  1524	  } catch (error) {
  1525	    try {

exec
/bin/zsh -lc "nl -ba .opencode/bin/lib/model-server-supervision.cjs | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ╔══════════════════════════════════════════════════════════════════════════╗
     2	// ║ COMPONENT: Model Server Supervision                                      ║
     3	// ╠══════════════════════════════════════════════════════════════════════════╣
     4	// ║ PURPOSE: Shared hf-model-server launcher supervision for OpenCode MCPs   ║
     5	// ╚══════════════════════════════════════════════════════════════════════════╝
     6	
     7	'use strict';
     8	
     9	const fs = require('fs');
    10	const http = require('http');
    11	const path = require('path');
    12	const { spawn, spawnSync } = require('child_process');
    13	
    14	const defaultRoot = path.resolve(__dirname, '..', '..', '..');
    15	const defaultOpencodeDir = path.join(defaultRoot, '.opencode');
    16	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    17	
    18	const SHUTDOWN_DEADLINE_MS = 5000;
    19	const RESPAWN_REAP_GRACE_MS = 7000;
    20	const RESPAWN_LOCK_STALE_MS = 60000;
    21	const DEFAULT_WATCHDOG_GRACE_MS = 7000;
    22	const DEFAULT_WATCHDOG_INTERVAL_MS = 15000;
    23	const DEFAULT_WATCHDOG_CONSECUTIVE_BREACHES = 3;
    24	const DEFAULT_DESCENDANT_SNAPSHOT_INTERVAL_MS = 30000;
    25	const DEFAULT_CRASH_LOOP_MAX_DEATHS = 3;
    26	const DEFAULT_CRASH_LOOP_WINDOW_MS = 60000;
    27	const DEFAULT_CRASH_LOOP_INITIAL_BACKOFF_MS = 250;
    28	const DEFAULT_CRASH_LOOP_MAX_BACKOFF_MS = 5000;
    29	const HF_MODEL_SERVER_SOCKET_FILE_NAME = 'hf-embed.sock';
    30	const HF_MODEL_SERVER_RESPAWN_LOCK_FILE_NAME = 'hf-embed-respawn.lock';
    31	const HF_MODEL_SERVER_PID_FILE_NAME = 'hf-embed.pid';
    32	const HF_MODEL_SERVER_GIVEUP_FILE_NAME = 'hf-embed-giveup.json';
    33	const MODEL_SERVER_DEMAND_STATUS = 503;
    34	const DEFAULT_MODEL_SERVER_GIVEUP_COOLDOWN_MS = 60000;
    35	const DURABLE_WRITE_UNAVAILABLE_CODES = new Set(['ENOSPC', 'EDQUOT', 'EROFS']);
    36	const durableWriteWarnings = new Set();
    37	
    38	function defaultLog(message) {
    39	  process.stderr.write(`[model-server-supervision] ${message}\n`);
    40	}
    41	
    42	function parsePositiveInteger(value, fallback) {
    43	  if (value === undefined || value === null || String(value).trim() === '') return fallback;
    44	  const parsed = Number.parseInt(String(value).trim(), 10);
    45	  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    46	}
    47	
    48	function isPermissionError(error) {
    49	  const code = error && typeof error === 'object' ? error.code : undefined;
    50	  if (code === 'EPERM' || code === 'EACCES') return true;
    51	  const message = error instanceof Error ? error.message : String(error ?? '');
    52	  return /operation not permitted|permission denied/i.test(message);
    53	}
    54	
    55	function isDurableWriteUnavailable(error) {
    56	  const code = error && typeof error === 'object' ? error.code : undefined;
    57	  return DURABLE_WRITE_UNAVAILABLE_CODES.has(code);
    58	}
    59	
    60	function logDurableWriteUnavailableOnce(logger, operation, targetPath, error, rel = (p) => p) {
    61	  const code = error && typeof error === 'object' ? error.code : 'UNKNOWN';
    62	  const key = `${operation}:${targetPath}:${code}`;
    63	  if (durableWriteWarnings.has(key)) return;
    64	  durableWriteWarnings.add(key);
    65	  const detail = error instanceof Error ? error.message : String(error ?? code);
    66	  logger(`${operation} skipped for ${rel(targetPath)}: ${code} ${detail}`);
    67	}
    68	
    69	function cleanupTmpFile(tmpPath, fsApi = fs) {
    70	  try {
    71	    fsApi.unlinkSync(tmpPath);
    72	  } catch (error) {
    73	    if (error.code !== 'ENOENT') {
    74	      // Best-effort cleanup only; the original durable-write failure is more useful.
    75	    }
    76	  }
    77	}
    78	
    79	function parseProcessRows(input) {
    80	  if (Array.isArray(input)) {
    81	    return input
    82	      .map((row) => ({
    83	        pid: Number(row.pid),
    84	        ppid: Number(row.ppid),
    85	        rss: Number(row.rss),
    86	      }))
    87	      .filter((row) => Number.isFinite(row.pid) && Number.isFinite(row.ppid) && Number.isFinite(row.rss));
    88	  }
    89	
    90	  return String(input ?? '')
    91	    .split(/\r?\n/)
    92	    .map((line) => line.trim())
    93	    .filter(Boolean)
    94	    .map((line) => {
    95	      const [pid, ppid, rss] = line.split(/\s+/).map((value) => Number.parseInt(value, 10));
    96	      return { pid, ppid, rss };
    97	    })
    98	    .filter((row) => Number.isFinite(row.pid) && Number.isFinite(row.ppid) && Number.isFinite(row.rss));
    99	}
   100	
   101	function defaultProcessRowsRunner() {
   102	  const result = spawnSync('ps', ['-eo', 'pid=,ppid=,rss='], {
   103	    encoding: 'utf8',
   104	    stdio: ['ignore', 'pipe', 'pipe'],
   105	  });
   106	  if (result.error) throw result.error;
   107	  if (result.status !== 0) {
   108	    const error = new Error(result.stderr || `ps exited ${result.status}`);
   109	    error.code = result.status === 1 && /operation not permitted|permission denied/i.test(result.stderr || '') ? 'EPERM' : 'PS_FAILED';
   110	    throw error;
   111	  }
   112	  return result.stdout;
   113	}
   114	
   115	function resolveProcessTreeRows(childPid, runner = defaultProcessRowsRunner) {
   116	  if (!Number.isInteger(childPid) || childPid <= 0) return null;
   117	
   118	  let rows;
   119	  try {
   120	    rows = parseProcessRows(runner());

exec
/bin/zsh -lc 'rg -n "function buildLeaseObject|buildLeaseObject|pid: process.pid|ownerPid" .opencode/bin/lib/model-server-supervision.cjs .opencode/bin/mk-spec-memory-launcher.cjs' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/bin/mk-spec-memory-launcher.cjs:21:  buildLeaseObject: buildSharedLeaseObject,
.opencode/bin/mk-spec-memory-launcher.cjs:259:        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-spec-memory-launcher.cjs:341:      Number.isInteger(parsed.ownerPid) &&
.opencode/bin/mk-spec-memory-launcher.cjs:390:function buildOwnerLease(ownerPid = process.pid) {
.opencode/bin/mk-spec-memory-launcher.cjs:392:    ownerPid,
.opencode/bin/mk-spec-memory-launcher.cjs:423:  const liveness = processLiveness(lease.ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:427:  const actualPpid = readParentPid(lease.ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:450:    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:470:  if (!reread || reread.ownerPid !== process.pid) {
.opencode/bin/mk-spec-memory-launcher.cjs:481:function refreshOwnerLeaseFile(ownerPid, patch = {}) {
.opencode/bin/mk-spec-memory-launcher.cjs:483:  if (!lease || lease.ownerPid !== ownerPid) return false;
.opencode/bin/mk-spec-memory-launcher.cjs:484:  const nextOwnerPid = patch.ownerPid ?? ownerPid;
.opencode/bin/mk-spec-memory-launcher.cjs:491:  if (!reread || reread.ownerPid !== nextOwnerPid) return false;
.opencode/bin/mk-spec-memory-launcher.cjs:503:function startOwnerLeaseHeartbeat(ownerPid = process.pid) {
.opencode/bin/mk-spec-memory-launcher.cjs:509:    if (refreshOwnerLeaseFile(ownerPid)) return;
.opencode/bin/mk-spec-memory-launcher.cjs:521:function ownsOwnerLeaseFile(ownerPid = process.pid) {
.opencode/bin/mk-spec-memory-launcher.cjs:523:  return lease?.ownerPid === ownerPid;
.opencode/bin/mk-spec-memory-launcher.cjs:530:    if (lease && lease.ownerPid === ownerLeasePid
.opencode/bin/mk-spec-memory-launcher.cjs:531:        && readOwnerLeaseFile()?.ownerPid === ownerLeasePid) {
.opencode/bin/mk-spec-memory-launcher.cjs:542:function clearOwnerLeaseFileIfOwner(ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:545:    if (lease && lease.ownerPid === ownerPid
.opencode/bin/mk-spec-memory-launcher.cjs:546:        && readOwnerLeaseFile()?.ownerPid === ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:556:  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
.opencode/bin/mk-spec-memory-launcher.cjs:563:    return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:565:    if (error.code === 'ESRCH') return { held: false, ownerPid: lease.pid, staleReclaimable: true, startedAt, legacyPath, socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:567:    if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath, socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:588:  process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-spec-memory-launcher.cjs:597:      message: `mk-spec-memory: lease held by pid ${leaseResult.ownerPid} but session bridge unavailable (${reason}); reconnect`,
.opencode/bin/mk-spec-memory-launcher.cjs:628:  if (pidLeaseResult.held && pidLeaseResult.ownerPid === ownerLease.ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:633:    ownerPid: ownerLease.ownerPid,
.opencode/bin/mk-spec-memory-launcher.cjs:727:async function reapOwnerBeforeRespawn(ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:728:  const liveness = processLiveness(ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:736:  log(`confirmed-dead socket; reaping recorded spec-memory owner pid ${ownerPid} before respawn`);
.opencode/bin/mk-spec-memory-launcher.cjs:737:  signalProcess(ownerPid, 'SIGTERM');
.opencode/bin/mk-spec-memory-launcher.cjs:738:  const exitedAfterTerm = await waitForPidExit(ownerPid, RESPAWN_REAP_GRACE_MS);
.opencode/bin/mk-spec-memory-launcher.cjs:740:    log(`spec-memory owner pid ${ownerPid} exceeded ${RESPAWN_REAP_GRACE_MS}ms reap grace; sending SIGKILL`);
.opencode/bin/mk-spec-memory-launcher.cjs:741:    signalProcess(ownerPid, 'SIGKILL');
.opencode/bin/mk-spec-memory-launcher.cjs:742:    await waitForPidExit(ownerPid, 1000);
.opencode/bin/mk-spec-memory-launcher.cjs:753:  const ownerPid = leaseResult.ownerPid;
.opencode/bin/mk-spec-memory-launcher.cjs:754:  if (!Number.isInteger(ownerPid) || ownerPid <= 0) {
.opencode/bin/mk-spec-memory-launcher.cjs:780:    if (currentOwner?.ownerPid !== ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:787:    if (currentLease?.pid !== leaseResult.ownerPid || currentLease?.childPid !== childPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:793:    const ownerReapResult = await reapOwnerBeforeRespawn(ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:795:      log(`dead-socket respawn skipped; ${ownerReapResult.reason} for ownerPid=${ownerPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:800:    clearOwnerLeaseFileIfOwner(ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:804:      log(`dead-socket respawn skipped; another launcher owns spec-memory owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-spec-memory-launcher.cjs:871:// are ADDITIVE fields; existing readers consume only pid/startedAt/ownerPid and ignore the extras.
.opencode/bin/mk-spec-memory-launcher.cjs:874:function buildLeaseObject(childPid = null, startedAt = leaseStartedAt, modelServerPid = null, socketPath = null) {
.opencode/bin/mk-spec-memory-launcher.cjs:880:  const payload = buildLeaseObject(childPid, leaseStartedAt, modelServerPid, resolveSessionProxySocketPath());
.opencode/bin/mk-spec-memory-launcher.cjs:1469:        log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
.opencode/bin/mk-spec-memory-launcher.cjs:1507:      writeLeaseHeldJsonRpcError({ ownerPid: reprobe ? reprobe.pid : 'unknown', startedAt }, 'lease-reprobe-lost');
.opencode/bin/mk-spec-memory-launcher.cjs:1549:  buildLeaseObject,
.opencode/bin/lib/model-server-supervision.cjs:543:      pid: process.pid,
.opencode/bin/lib/model-server-supervision.cjs:634:      fsApi.writeFileSync(fd, `${JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }, null, 2)}\n`, 'utf8');
.opencode/bin/lib/model-server-supervision.cjs:705:function buildLeaseObject(childPid = null, startedAt = null, modelServerPid = null, socketPath = null) {
.opencode/bin/lib/model-server-supervision.cjs:707:    pid: process.pid,
.opencode/bin/lib/model-server-supervision.cjs:709:    ownerPid: process.pid,
.opencode/bin/lib/model-server-supervision.cjs:1375:  buildLeaseObject,

codex
The startup path confirms the branch is asymmetric: dead-socket respawn reaps `childPid`, but stale-owner reclaim does not. I’m doing one more small read around owner-lease acquisition and the shared lease builder so the final verdict can cite exactly what gets persisted.
exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-spec-memory-launcher.cjs | sed -n '330,515p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   330	    if (typeof parsed.pid === 'number') return parsed;
   331	  } catch {
   332	    // Missing or corrupt lease files are treated as no active lease.
   333	  }
   334	  return null;
   335	}
   336	
   337	function readOwnerLeaseFile(filePath = ownerLeasePath()) {
   338	  try {
   339	    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
   340	    if (
   341	      Number.isInteger(parsed.ownerPid) &&
   342	      Number.isInteger(parsed.ppid) &&
   343	      typeof parsed.executablePath === 'string' &&
   344	      typeof parsed.startedAtIso === 'string' &&
   345	      typeof parsed.lastHeartbeatIso === 'string' &&
   346	      Number.isInteger(parsed.ttlMs) &&
   347	      typeof parsed.canonicalDbDir === 'string'
   348	    ) {
   349	      return parsed;
   350	    }
   351	  } catch {
   352	    // Missing or corrupt owner leases are treated as no active owner.
   353	  }
   354	  return null;
   355	}
   356	
   357	function writeOwnerLeaseFile(lease) {
   358	  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
   359	  const tmp = `${currentLeasePath}.tmp.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}`;
   360	  // fsync the temp file before the atomic rename so the lease contents survive a crash, matching
   361	  // the durability of the exclusive write path; a renamed-but-unsynced lease can resurface empty
   362	  // after power loss and break ownership detection.
   363	  let fd;
   364	  try {
   365	    fd = fs.openSync(tmp, 'wx', 0o600);
   366	    fs.writeFileSync(fd, `${JSON.stringify(lease, null, 2)}\n`, 'utf8');
   367	    fs.fsyncSync(fd);
   368	  } finally {
   369	    if (typeof fd === 'number') fs.closeSync(fd);
   370	  }
   371	  fs.renameSync(tmp, currentLeasePath);
   372	}
   373	
   374	function writeOwnerLeaseFileExclusive(lease) {
   375	  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
   376	  let fd;
   377	  try {
   378	    fd = fs.openSync(currentLeasePath, 'wx', 0o600);
   379	    fs.writeFileSync(fd, `${JSON.stringify(lease, null, 2)}\n`, 'utf8');
   380	    fs.fsyncSync(fd);
   381	    return true;
   382	  } catch (error) {
   383	    if (error.code === 'EEXIST') return false;
   384	    throw error;
   385	  } finally {
   386	    if (typeof fd === 'number') fs.closeSync(fd);
   387	  }
   388	}
   389	
   390	function buildOwnerLease(ownerPid = process.pid) {
   391	  return {
   392	    ownerPid,
   393	    ppid: process.ppid,
   394	    executablePath: process.execPath,
   395	    startedAtIso: new Date().toISOString(),
   396	    lastHeartbeatIso: new Date().toISOString(),
   397	    ttlMs: 60000,
   398	    canonicalDbDir: resolvedDbDir(),
   399	  };
   400	}
   401	
   402	function readParentPid(pid) {
   403	  if (!Number.isInteger(pid) || pid <= 0) return null;
   404	  if (process.platform === 'linux') {
   405	    try {
   406	      const status = fs.readFileSync(`/proc/${pid}/status`, 'utf8');
   407	      const match = status.match(/^PPid:\s+(\d+)$/m);
   408	      return match ? Number.parseInt(match[1], 10) : null;
   409	    } catch {
   410	      return null;
   411	    }
   412	  }
   413	  const result = spawnSync('ps', ['-o', 'ppid=', '-p', String(pid)], {
   414	    encoding: 'utf8',
   415	    stdio: ['ignore', 'pipe', 'ignore'],
   416	  });
   417	  if (result.status !== 0 || !result.stdout) return null;
   418	  const parsed = Number.parseInt(result.stdout.trim(), 10);
   419	  return Number.isInteger(parsed) ? parsed : null;
   420	}
   421	
   422	function classifyOwnerLease(lease) {
   423	  const liveness = processLiveness(lease.ownerPid);
   424	  if (liveness === 'dead') return 'stale-pid';
   425	  if (liveness === 'unknown-eperm') return 'unknown-eperm';
   426	
   427	  const actualPpid = readParentPid(lease.ownerPid);
   428	  if (actualPpid !== null && actualPpid !== lease.ppid && actualPpid === 1) {
   429	    return 'ppid-1-orphan';
   430	  }
   431	
   432	  const heartbeatMs = Date.parse(lease.lastHeartbeatIso);
   433	  const ttlMs = Number.isFinite(lease.ttlMs) ? lease.ttlMs : 0;
   434	  if (!Number.isFinite(heartbeatMs) || Date.now() - heartbeatMs > ttlMs * 2) {
   435	    return 'stale-heartbeat-reclaim';
   436	  }
   437	
   438	  return 'live-owner';
   439	}
   440	
   441	function acquireOwnerLeaseFile() {
   442	  const currentOwnerLeasePath = ownerLeasePath();
   443	  const existing = readOwnerLeaseFile(currentOwnerLeasePath);
   444	
   445	  if (existing) {
   446	    const classification = classifyOwnerLease(existing);
   447	    if (classification === 'live-owner' || classification === 'unknown-eperm') {
   448	      return { acquired: false, holder: existing, classification };
   449	    }
   450	    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
   451	  }
   452	
   453	  const lease = buildOwnerLease(process.pid);
   454	  if (!existing) {
   455	    if (!writeOwnerLeaseFileExclusive(lease)) {
   456	      const holder = readOwnerLeaseFile(currentOwnerLeasePath);
   457	      return {
   458	        acquired: false,
   459	        holder: holder || lease,
   460	        classification: holder ? classifyOwnerLease(holder) : 'live-owner',
   461	      };
   462	    }
   463	    ownerLeasePid = process.pid;
   464	    return { acquired: true, lease, reclaimed: existing };
   465	  }
   466	
   467	  // Re-read after reclaim so two launchers racing a stale lease cannot both act as owner.
   468	  writeOwnerLeaseFile(lease);
   469	  const reread = readOwnerLeaseFile(currentOwnerLeasePath);
   470	  if (!reread || reread.ownerPid !== process.pid) {
   471	    return {
   472	      acquired: false,
   473	      holder: reread || lease,
   474	      classification: reread ? classifyOwnerLease(reread) : 'live-owner',
   475	    };
   476	  }
   477	  ownerLeasePid = process.pid;
   478	  return { acquired: true, lease, reclaimed: existing };
   479	}
   480	
   481	function refreshOwnerLeaseFile(ownerPid, patch = {}) {
   482	  const lease = readOwnerLeaseFile();
   483	  if (!lease || lease.ownerPid !== ownerPid) return false;
   484	  const nextOwnerPid = patch.ownerPid ?? ownerPid;
   485	  writeOwnerLeaseFile({
   486	    ...lease,
   487	    ...patch,
   488	    lastHeartbeatIso: new Date().toISOString(),
   489	  });
   490	  const reread = readOwnerLeaseFile();
   491	  if (!reread || reread.ownerPid !== nextOwnerPid) return false;
   492	  ownerLeasePid = nextOwnerPid;
   493	  return true;
   494	}
   495	
   496	function clearOwnerLeaseHeartbeat() {
   497	  if (ownerLeaseHeartbeatTimer) {
   498	    clearInterval(ownerLeaseHeartbeatTimer);
   499	    ownerLeaseHeartbeatTimer = null;
   500	  }
   501	}
   502	
   503	function startOwnerLeaseHeartbeat(ownerPid = process.pid) {
   504	  clearOwnerLeaseHeartbeat();
   505	  const lease = readOwnerLeaseFile();
   506	  const ttlMs = Number.isFinite(lease?.ttlMs) && lease.ttlMs > 0 ? lease.ttlMs : 60000;
   507	  const intervalMs = Math.max(1000, Math.floor(ttlMs / 2));
   508	  ownerLeaseHeartbeatTimer = setInterval(() => {
   509	    if (refreshOwnerLeaseFile(ownerPid)) return;
   510	    log('owner lease heartbeat refresh failed; shutting down launcher to preserve single ownership');
   511	    clearOwnerLeaseHeartbeat();
   512	    void shutdownLauncherForSignal('SIGTERM').catch((error) => {
   513	      log(error.stack || error.message);
   514	      clearAllLeaseFiles();
   515	      process.exit(128);

exec
/bin/zsh -lc "nl -ba .opencode/bin/lib/model-server-supervision.cjs | sed -n '690,720p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   690	}
   691	
   692	function releaseRespawnLockFile(lock) {
   693	  if (!lock || !lock.acquired) return;
   694	  try {
   695	    if (typeof lock.fd === 'number') fs.closeSync(lock.fd);
   696	  } finally {
   697	    try {
   698	      fs.unlinkSync(lock.path);
   699	    } catch (error) {
   700	      if (error.code !== 'ENOENT') throw error;
   701	    }
   702	  }
   703	}
   704	
   705	function buildLeaseObject(childPid = null, startedAt = null, modelServerPid = null, socketPath = null) {
   706	  const payload = {
   707	    pid: process.pid,
   708	    startedAt: startedAt || new Date().toISOString(),
   709	    ownerPid: process.pid,
   710	  };
   711	  if (Number.isInteger(childPid) && childPid > 0) {
   712	    payload.childPid = childPid;
   713	  }
   714	  if (Number.isInteger(modelServerPid) && modelServerPid > 0) {
   715	    payload.modelServerPid = modelServerPid;
   716	  }
   717	  // Record the owner's actual IPC socket path so a secondary launcher bridges to the path the
   718	  // owner truly listens on, instead of recomputing one that can diverge under a different
   719	  // SPECKIT_IPC_SOCKET_DIR (e.g. worktree env). Optional + additive: leases without it fall back
   720	  // to recomputation, so existing readers and the other launchers are unaffected.

exec
/bin/zsh -lc "rg -n \"idle timeout|onIdle|Launcher idle timeout|fatalShutdown|IDLE\" .opencode/skills/system-spec-kit/mcp_server/dist/context-server.js .opencode/skills/system-spec-kit/mcp_server/src -g '*.{js,ts}'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
rg: .opencode/skills/system-spec-kit/mcp_server/src: No such file or directory (os error 2)
.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:1242:async function fatalShutdown(reason, exitCode) {
.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:1364:    void fatalShutdown('Received SIGTERM, shutting down...', 0);
.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:1367:    void fatalShutdown('Received SIGINT, shutting down...', 0);
.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:1370:    void fatalShutdown('Received SIGHUP, shutting down...', 0);
.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:1373:    void fatalShutdown('Received SIGQUIT, shutting down...', 0);
.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:1376:    void fatalShutdown(`Uncaught exception: ${err.stack ?? err.message}`, 1);
.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:1379:    void fatalShutdown(`Unhandled rejection at: ${String(promise)} reason: ${reason instanceof Error ? reason.stack ?? reason.message : String(reason)}`, 1);
.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js:1818:        onIdle: () => fatalShutdown('Launcher idle timeout reached, shutting down...', 0),

codex
**VERDICT: confirmed.** Static logic matches the claim.

The release path keeps the daemon alive and preserves the daemon lease: [mk-spec-memory-launcher.cjs:1370](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:1370) releases when re-election is enabled, [1377-1381] remove the exit cleanup, clear only the owner lease, then exit. The persisted lease records launcher `pid` plus daemon `childPid`: [model-server-supervision.cjs:705](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/lib/model-server-supervision.cjs:705) and [mk-spec-memory-launcher.cjs:1307](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:1307).

Fresh startup then classifies the lease by `lease.pid` only: [mk-spec-memory-launcher.cjs:554](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:554), especially `process.kill(lease.pid, 0)` at [562](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:562). If the owner pid is dead, it returns `staleReclaimable` at [565](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:565), ignoring live `childPid`. In `main()`, stale reclaim only logs at [1480-1482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:1480), then writes a new lease and launches a new daemon at [1502-1510](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:1502). The existing child reap exists only in the dead-socket respawn branch: [747](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:747), [760-810](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:760). That branch is not reached for stale-owner reclaim.

**SEVERITY: medium-high.** SQLite WAL supports multiple processes, so this is not an immediate “two processes means corruption” finding. But two daemon writers against the same DB can cause lock contention, busy failures/timeouts, checkpoint starvation, WAL growth, and inconsistent higher-level daemon assumptions around single ownership. It is a regression versus pre-re-election behavior because the old shutdown path killed children and cleared leases at [1385-1417](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:1385); cold restart would not overlap the old daemon.

**RECOMMENDED FIX: approach b, true adoption.** Minimal correct behavior is: when `lease.pid` is stale but `lease.childPid` is alive and the recorded socket is live, bridge to the released daemon instead of reclaiming. Implement this around `leaseHeldFromFile()` / `isLeaseHeld()` and the `main()` stale branch: return a distinct “released-daemon-adoptable” result carrying `childPid` and `socketPath`, then route it through `bridgeOrReportLeaseHeldAndExit()` instead of logging `staleReclaimed`.

Fallback: if `childPid` is dead or socket bridge fails as dead, then reclaim under the existing owner lease and respawn lock, reusing `reapLeaseChildBeforeRespawn()` before spawn. Keep `acquireOwnerLeaseFile()` as the race gate for two fresh launchers; use the respawn lock for any reap/spawn path.

Test: fresh launcher after owner release should bridge to the original `childPid`, not log `staleReclaimed`, not call `launchServer()`, and `lsof`/pid assertions should show one context-server holding `context-index.sqlite`, `-wal`, and `-shm`.
hook: Stop
hook: Stop Completed
tokens used
56,075
**VERDICT: confirmed.** Static logic matches the claim.

The release path keeps the daemon alive and preserves the daemon lease: [mk-spec-memory-launcher.cjs:1370](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:1370) releases when re-election is enabled, [1377-1381] remove the exit cleanup, clear only the owner lease, then exit. The persisted lease records launcher `pid` plus daemon `childPid`: [model-server-supervision.cjs:705](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/lib/model-server-supervision.cjs:705) and [mk-spec-memory-launcher.cjs:1307](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:1307).

Fresh startup then classifies the lease by `lease.pid` only: [mk-spec-memory-launcher.cjs:554](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:554), especially `process.kill(lease.pid, 0)` at [562](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:562). If the owner pid is dead, it returns `staleReclaimable` at [565](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:565), ignoring live `childPid`. In `main()`, stale reclaim only logs at [1480-1482](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:1480), then writes a new lease and launches a new daemon at [1502-1510](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:1502). The existing child reap exists only in the dead-socket respawn branch: [747](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:747), [760-810](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:760). That branch is not reached for stale-owner reclaim.

**SEVERITY: medium-high.** SQLite WAL supports multiple processes, so this is not an immediate “two processes means corruption” finding. But two daemon writers against the same DB can cause lock contention, busy failures/timeouts, checkpoint starvation, WAL growth, and inconsistent higher-level daemon assumptions around single ownership. It is a regression versus pre-re-election behavior because the old shutdown path killed children and cleared leases at [1385-1417](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mk-spec-memory-launcher.cjs:1385); cold restart would not overlap the old daemon.

**RECOMMENDED FIX: approach b, true adoption.** Minimal correct behavior is: when `lease.pid` is stale but `lease.childPid` is alive and the recorded socket is live, bridge to the released daemon instead of reclaiming. Implement this around `leaseHeldFromFile()` / `isLeaseHeld()` and the `main()` stale branch: return a distinct “released-daemon-adoptable” result carrying `childPid` and `socketPath`, then route it through `bridgeOrReportLeaseHeldAndExit()` instead of logging `staleReclaimed`.

Fallback: if `childPid` is dead or socket bridge fails as dead, then reclaim under the existing owner lease and respawn lock, reusing `reapLeaseChildBeforeRespawn()` before spawn. Keep `acquireOwnerLeaseFile()` as the race gate for two fresh launchers; use the respawn lock for any reap/spawn path.

Test: fresh launcher after owner release should bridge to the original `childPid`, not log `staleReclaimed`, not call `launchServer()`, and `lsof`/pid assertions should show one context-server holding `context-index.sqlite`, `-wal`, and `-shm`.
