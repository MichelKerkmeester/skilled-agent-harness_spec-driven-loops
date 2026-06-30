Reading additional input from stdin...
2026-06-29T10:35:47.470786Z ERROR codex_core::session::session: failed to load skill /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-open-design/SKILL.md: invalid YAML: mapping values are not allowed in this context at line 2 column 345
2026-06-29T10:35:47.470826Z ERROR codex_core::session::session: failed to load skill /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/mcp-open-design/SKILL.md: invalid YAML: mapping values are not allowed in this context at line 2 column 345
OpenAI Codex v0.137.0
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
model: gpt-5.5
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019f12f3-0a6c-7f82-84ba-b3fb5243846d
--------
user
You are GPT-5.5 at xhigh reasoning doing an ADVERSARIAL verification pass over a hardening design produced by a different model (GLM-5.2). Be skeptical: your job is to CONFIRM what is right, REFUTE what is wrong, and find GAPS the prior research missed — not to agree. Read the synthesized design at .opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/009-daemon-reclaim-hardening/research/research.md and the actual source .opencode/bin/mk-code-index-launcher.cjs and .opencode/bin/launcher-ipc-bridge.cjs (and the child initDb under system-code-graph/mcp_server if useful). Ground every claim in the REAL code (cite function/line). Incident recap: the code-index daemon wedged (PID alive, IPC socket never created, lease file gone, 17MB orphaned WAL) and /mcp reconnect returned -32000.

## Angle: code-claim-verification
Verify GLM's specific code citations against the REAL files. Confirm or correct: probeDaemon({deepProbe:true}) exists in .opencode/bin/launcher-ipc-bridge.cjs around L150-236 and actually sends a JSON-RPC initialize over the UDS; the inert no-bridge-socket 'report' branch exists around L405-408; leaseHeldFromFile returns held:true after process.kill(pid,0) succeeds (~L602) with no socket check; classifyOwnerLease's state set (stale-pid / stale-heartbeat-reclaim / unknown-eperm) and the reclaim CAS (unlink + O_EXCL) are as described. Flag ANY hallucinated line number, non-existent function, or mischaracterized behavior — list each with the corrected reality.

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
Using `sk-code-review` for this as a read-only adversarial verification pass. I’m going straight to the cited files and will keep the final response to the requested JSON shape.
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-code-review/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: sk-code-review
description: "Stack-agnostic code-review baseline: findings-first severity, mandatory security/correctness minimums, sk-code evidence."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
version: 1.5.0.0
---

<!-- Keywords: sk-code-review, code-review, pull-request, findings-first, security-review, quality-gate, stack-agnostic, baseline-surface, sk-code -->

# Code Review Baseline - Stack-Agnostic Findings-First Review

Universal findings-first review baseline paired with `sk-code` surface standards evidence for the detected code surface.

## 1. WHEN TO USE

### Activation Triggers

Use this skill when:
- A user asks for code review, PR review, quality gate, or merge readiness.
- A workflow dispatches `@review` for pre-commit or gate validation.
- A user requests security/correctness risk analysis before merge.
- A user wants severity-ranked findings with file:line evidence.

### Keyword Triggers

`review`, `code review`, `pr review`, `audit`, `security review`, `quality gate`, `request changes`, `findings`, `blocking issues`, `merge readiness`

### Use Cases

1. Review-only pass: findings-first output with no code edits.
2. Gate validation: score + pass/fail recommendation for orchestrated workflows.
3. Focused risk pass: security, concurrency, correctness, or removal-focused review.

### When NOT to Use

- Feature implementation without review intent.
- Pure documentation editing where code behavior is not being assessed.
- Git-only workflow tasks (branching, rebasing, commit hygiene) without code-quality evaluation intent.

---

## 2. SMART ROUTING


### Primary Detection Signal

Review behavior follows a baseline+surface-evidence model:

- Baseline (always): `sk-code-review` findings-first doctrine.
- Surface standards evidence (when available): `sk-code` detected surface resources.
- Unknown surfaces: review against baseline security/correctness only and disclose uncertainty.

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Load `sk-code-review` baseline + `sk-code` surface evidence. The dispatcher / agent assembling the sk-code-review prompt MUST prepend `CODE-REVIEW\n\n` as the first two lines of the rendered prompt before the reviewer LLM sees it. Reference resources stay unchanged.
    +- STEP 1: Score intents (top-2 when ambiguity delta <= 1.0)
    +- Phase 1: Scope and baseline checks
    +- Phase 2: Overlay alignment
    +- Phase 3: Findings-first analysis
    +- Phase 4: Output contract and next action
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/`, then applies weighted intent scoring.

Knowledge is organized by domain mapping:

```text
references/review_core.md
references/review_ux_single_pass.md
references/pr_state_dedup.md
assets/*_checklist.md
assets/removal_plan.md
```

- `references/review_core.md` for shared doctrine consumed by both `@review` and `@deep-review`.
- `references/review_ux_single_pass.md` for interactive single-pass review behavior.
- `references/` for shared review doctrine, single-pass UX behavior, and the PR-state dedup spec.
- `assets/` for the review checklists and the removal-plan template (security, code-quality, fix-completeness, SOLID, test-quality, removal).

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every invocation, including security/correctness reviews | `references/review_core.md`, `references/review_ux_single_pass.md`, `assets/security_checklist.md`, `assets/code_quality_checklist.md`, `assets/fix-completeness-checklist.md` |
| CONDITIONAL | Intent score indicates need | `assets/solid_checklist.md`, `assets/code_quality_checklist.md`, `assets/removal_plan.md`, `assets/test_quality_checklist.md` |
| ON_DEMAND | Explicit deep-dive request | Full mapped reference set |

### Precedence Matrix

| Rule Type | Source of Truth | Behavior |
| --- | --- | --- |
| Security/correctness minimums | `sk-code-review` baseline | Always enforced; never relaxed by surface guidance |
| Surface style/process conventions | `sk-code` detected surface | Surface guidance overrides baseline generic style/process advice |
| Verification/build/test commands | `sk-code` detected surface | Surface commands are authoritative for the detected surface |
| Ambiguous conflicts | Escalation | Ask for clarification; do not guess |

### Unknown Fallback Checklist

If intent/stack detection is unclear, request:

1. Review target scope (full diff, staged files, commit range, or explicit file list).
2. Primary risk class (security, correctness, performance, maintainability).
3. Architecture lens priority (KISS/DRY/SOLID strict or optional).
4. Stack/context (system code, web/frontend, or other/full-stack).
5. Desired output mode (findings-only or findings + gated fix follow-up).

### Smart Router Pseudocode

```python
import re
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
# Discover resources recursively across references and assets.
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCES = [
    "references/review_core.md",
    "references/review_ux_single_pass.md",
    "assets/security_checklist.md",
    "assets/code_quality_checklist.md",
    "assets/fix-completeness-checklist.md",
]

INTENT_SIGNALS = {
    "SECURITY": {"weight": 5, "keywords": ["security", "auth", "injection", "vulnerability", "race"]},
    "QUALITY": {"weight": 4, "keywords": ["correctness", "bug", "regression", "performance", "boundary", "contract", "breaking change", "backward compatible", "compatibility"]},
    "KISS": {"weight": 3, "keywords": ["kiss", "simple", "simplicity", "over-engineer", "overengineering"]},
    "DRY": {"weight": 3, "keywords": ["dry", "duplication", "duplicate", "copy-paste", "repeated logic"]},
    "SOLID": {"weight": 3, "keywords": ["solid", "architecture", "design", "coupling", "cohesion", "module", "adapter", "interface", "abstraction", "responsibility", "dependency", "boundary"]},
    "REMOVAL": {"weight": 3, "keywords": ["remove", "dead code", "cleanup", "deprecate"]},
    "TESTING": {"weight": 3, "keywords": ["test", "tests", "testing", "coverage", "assertion", "mock", "stub", "fixture", "test quality", "brittle"]},
}

RESOURCE_MAP = {
    "SECURITY": ["assets/security_checklist.md"],
    "QUALITY": ["assets/code_quality_checklist.md"],
    "KISS": ["assets/code_quality_checklist.md"],
    "DRY": ["assets/code_quality_checklist.md"],
    "SOLID": ["assets/solid_checklist.md"],
    "REMOVAL": ["assets/removal_plan.md"],
    "TESTING": ["assets/test_quality_checklist.md"],
}

ON_DEMAND_KEYWORDS = ["deep review", "full review", "all checks", "comprehensive", "flag false positives", "blocking regressions", "list findings", "read-only only", "underrepresented", "scope correctly"]
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm review scope (diff/staged/files/commit range)",
    "Confirm risk priority (security/correctness/performance/maintainability/test quality/contract safety)",
    "Confirm architecture lens (KISS/DRY/SOLID required or optional)",
    "Confirm stack context (system-code/web/full-stack)",
    "Confirm findings-only vs findings+fix follow-up",
]

def _task_text(task) -> str:
    return " ".join([
        str(getattr(task, "text", "")),
        str(getattr(task, "query", "")),
        str(getattr(task, "description", "")),
        " ".join(getattr(task, "keywords", []) or []),
    ]).lower()

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def keyword_present(keyword: str, text: str) -> bool:
    """Boundary-aware match: bare substrings misroute ('pr' in 'improve prompt')."""
    return re.search(rf"(?<![a-z0-9]){re.escape(keyword)}(?![a-z0-9])", text) is not None

def score_intents(task) -> dict[str, float]:
    text = _task_text(task)
    scores = {intent: 0.0 for intent in INTENT_SIGNALS}
    for intent, cfg in INTENT_SIGNALS.items():
        for keyword in cfg["keywords"]:
            if keyword_present(keyword, text):
                scores[intent] += cfg["weight"]
    return scores

def select_intents(scores: dict[str, float], ambiguity_delta: float = 1.0, max_intents: int = 2) -> list[str]:
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    if not ranked or ranked[0][1] <= 0:
        return ["QUALITY"]
    selected = [ranked[0][0]]
    if len(ranked) > 1 and ranked[1][1] > 0 and (ranked[0][1] - ranked[1][1]) <= ambiguity_delta:
        selected.append(ranked[1][0])
    return selected[:max_intents]

def detect_surface_evidence(task, workspace_files=None, changed_files=None) -> str:
    text = _task_text(task)
    files = " ".join((workspace_files or []) + (changed_files or [])).lower()

    if ".opencode/" in files or keyword_present("jsonc", text) or keyword_present("mcp", text):
        return "sk-code:<surface>"
    if any(keyword_present(term, text) for term in ["frontend", "web", "css", "dom", "browser"]) or any(
        marker in files for marker in ["next.config", "vite.config", "package.json", "src/"]
    ):
        return "sk-code:<surface>"
    return "sk-code:<surface>"

def route_review_resources(task, workspace_files=None, changed_files=None):
    inventory = discover_markdown_resources()
    text = _task_text(task)
    scores = score_intents(task)
    intents = select_intents(scores, ambiguity_delta=1.0)

    loaded = []

exec
/bin/zsh -lc "nl -ba .opencode/bin/launcher-ipc-bridge.cjs | sed -n '1,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
nl: .opencode/bin/launcher-ipc-bridge.cjs: No such file or directory

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
/bin/zsh -lc "nl -ba .opencode/bin/mk-code-index-launcher.cjs | sed -n '1,760p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

codex
The bridge file is not at the path the prompt/research names; the launcher requires it from `.opencode/bin/lib/launcher-ipc-bridge.cjs`. I’m treating the missing top-level path itself as a verification finding and checking the real required module now.
exec
/bin/zsh -lc 'rg -n "probeDaemon|maybeBridgeLeaseHolder|getIpcSocketPath|deepProbe|no-bridge-socket|respawn|classifyOwnerLease|leaseHeldFromFile|initDb|wal_autocheckpoint|wal_checkpoint|OWNER_LEASE_FILE_NAME|writeOwnerLeaseFileExclusive|processLiveness|startOwnerLeaseHeartbeat|refreshOwnerLeaseFile|buildOwnerLease|reapOwnerBeforeRespawn|respawnAfterDeadSocket" .opencode/bin .opencode/skills/system-code-graph/mcp_server -S' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/bin/mk-spec-memory-launcher.cjs:34:  processLiveness,
.opencode/bin/mk-spec-memory-launcher.cjs:87:const OWNER_LEASE_FILE_NAME = '.spec-memory-owner.json';
.opencode/bin/mk-spec-memory-launcher.cjs:202:// it reaps and respawns only when that daemon is dead or unbridgeable, so the database keeps a single
.opencode/bin/mk-spec-memory-launcher.cjs:267:      async maybeBridgeLeaseHolder({ leaseResult }) {
.opencode/bin/mk-spec-memory-launcher.cjs:270:        const suffix = process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1' ? '' : ' (no-bridge-socket)';
.opencode/bin/mk-spec-memory-launcher.cjs:279:  const { getIpcSocketPath } = loadBridgeModule();
.opencode/bin/mk-spec-memory-launcher.cjs:280:  return getIpcSocketPath('mk-spec-memory', { dbDir: resolvedDbDir() });
.opencode/bin/mk-spec-memory-launcher.cjs:339:  return path.join(resolvedDbDir(), OWNER_LEASE_FILE_NAME);
.opencode/bin/mk-spec-memory-launcher.cjs:380:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
.opencode/bin/mk-spec-memory-launcher.cjs:396:function writeOwnerLeaseFileExclusive(lease) {
.opencode/bin/mk-spec-memory-launcher.cjs:397:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
.opencode/bin/mk-spec-memory-launcher.cjs:412:function buildOwnerLease(ownerPid = process.pid) {
.opencode/bin/mk-spec-memory-launcher.cjs:444:function classifyOwnerLease(lease) {
.opencode/bin/mk-spec-memory-launcher.cjs:445:  const liveness = processLiveness(lease.ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:468:    const classification = classifyOwnerLease(existing);
.opencode/bin/mk-spec-memory-launcher.cjs:475:  const lease = buildOwnerLease(process.pid);
.opencode/bin/mk-spec-memory-launcher.cjs:487:  if (!writeOwnerLeaseFileExclusive(lease)) {
.opencode/bin/mk-spec-memory-launcher.cjs:492:      classification: holder ? classifyOwnerLease(holder) : 'live-owner',
.opencode/bin/mk-spec-memory-launcher.cjs:499:function refreshOwnerLeaseFile(ownerPid, patch = {}) {
.opencode/bin/mk-spec-memory-launcher.cjs:521:function startOwnerLeaseHeartbeat(ownerPid = process.pid) {
.opencode/bin/mk-spec-memory-launcher.cjs:527:    if (refreshOwnerLeaseFile(ownerPid)) return;
.opencode/bin/mk-spec-memory-launcher.cjs:572:function leaseHeldFromFile(filePath, legacyPath = null) {
.opencode/bin/mk-spec-memory-launcher.cjs:591:  const primary = leaseHeldFromFile(leasePath());
.opencode/bin/mk-spec-memory-launcher.cjs:596:    const legacy = leaseHeldFromFile(legacyPath, legacyPath);
.opencode/bin/mk-spec-memory-launcher.cjs:633:  const { getIpcSocketPath } = loadBridgeModule();
.opencode/bin/mk-spec-memory-launcher.cjs:634:  if (typeof getIpcSocketPath !== 'function') {
.opencode/bin/mk-spec-memory-launcher.cjs:637:  const socketPath = getIpcSocketPath('mk-spec-memory', { dbDir: resolvedDbDir() });
.opencode/bin/mk-spec-memory-launcher.cjs:639:    return { ready: false, reason: 'no-bridge-socket' };
.opencode/bin/mk-spec-memory-launcher.cjs:659:function respawnLockPath() {
.opencode/bin/mk-spec-memory-launcher.cjs:660:  return path.join(resolvedDbDir(), '.mk-spec-memory-respawn.lock');
.opencode/bin/mk-spec-memory-launcher.cjs:667:function acquireRespawnLockFileAt(lockPath, label = 'respawn') {
.opencode/bin/mk-spec-memory-launcher.cjs:672:  return acquireRespawnLockFileAt(respawnLockPath(), 'respawn');
.opencode/bin/mk-spec-memory-launcher.cjs:717:  const liveness = processLiveness(childPid);
.opencode/bin/mk-spec-memory-launcher.cjs:730:  log(`reaping recorded context-server child pid ${childPid} before respawn`);
.opencode/bin/mk-spec-memory-launcher.cjs:744:      log(`context-server child pid ${childPid} did not exit after SIGKILL within grace; refusing respawn`);
.opencode/bin/mk-spec-memory-launcher.cjs:752:  // shadow. We never block respawn on this: a missing daemon is worse than a self-healing one.
.opencode/bin/mk-spec-memory-launcher.cjs:761:async function reapOwnerBeforeRespawn(ownerPid) {
.opencode/bin/mk-spec-memory-launcher.cjs:762:  const liveness = processLiveness(ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:776:  if (currentOwner?.ownerPid === ownerPid && classifyOwnerLease(currentOwner) === 'live-owner') {
.opencode/bin/mk-spec-memory-launcher.cjs:781:  log(`confirmed-dead socket; reaping recorded spec-memory owner pid ${ownerPid} before respawn`);
.opencode/bin/mk-spec-memory-launcher.cjs:792:async function respawnAfterDeadSocket(leaseResult, decision) {
.opencode/bin/mk-spec-memory-launcher.cjs:794:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
.opencode/bin/mk-spec-memory-launcher.cjs:795:    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:800:    log('confirmed-dead socket but no recorded spec-memory owner pid is available; respawn inert');
.opencode/bin/mk-spec-memory-launcher.cjs:808:    log('confirmed-dead socket but lease has no childPid; child-pid gate keeps respawn inert');
.opencode/bin/mk-spec-memory-launcher.cjs:815:  // fresh marker naming this exact live child, refuse the respawn and leave it
.opencode/bin/mk-spec-memory-launcher.cjs:817:  // refresh it), so a real death still respawns once the marker expires. Checked
.opencode/bin/mk-spec-memory-launcher.cjs:818:  // before the respawn lock and any reap so a bail unwinds nothing.
.opencode/bin/mk-spec-memory-launcher.cjs:820:  if (shouldAdoptDespiteProbe({ marker: deadSocketMarker, childPid, childLiveness: processLiveness(childPid) })) {
.opencode/bin/mk-spec-memory-launcher.cjs:821:    log(`confirmed-dead socket but child pid ${childPid} holds a fresh maintenance marker (activeUntil ${new Date(deadSocketMarker.activeUntilMs).toISOString()}); refusing respawn (busy, not dead)`);
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
.opencode/bin/mk-spec-memory-launcher.cjs:851:    const ownerReapResult = await reapOwnerBeforeRespawn(ownerPid);
.opencode/bin/mk-spec-memory-launcher.cjs:853:      log(`dead-socket respawn skipped; ${ownerReapResult.reason} for ownerPid=${ownerPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:859:    const ownerLease = buildOwnerLease(process.pid);
.opencode/bin/mk-spec-memory-launcher.cjs:860:    if (!writeOwnerLeaseFileExclusive(ownerLease)) {
.opencode/bin/mk-spec-memory-launcher.cjs:862:      log(`dead-socket respawn skipped; another launcher owns spec-memory owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-spec-memory-launcher.cjs:863:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-spec-memory-launcher.cjs:864:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:870:      log(`dead-socket respawn skipped; ${reapResult.reason} for childPid=${childPid}`);
.opencode/bin/mk-spec-memory-launcher.cjs:879:    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
.opencode/bin/mk-spec-memory-launcher.cjs:881:    releaseRespawnLockFile(respawnLock);
.opencode/bin/mk-spec-memory-launcher.cjs:894:  const { maybeBridgeLeaseHolder } = loadBridgeModule();
.opencode/bin/mk-spec-memory-launcher.cjs:895:  const decision = await maybeBridgeLeaseHolder({
.opencode/bin/mk-spec-memory-launcher.cjs:902:  if (decision && decision.action === 'respawn') {
.opencode/bin/mk-spec-memory-launcher.cjs:903:    return await respawnAfterDeadSocket(leaseResult, decision);
.opencode/bin/mk-spec-memory-launcher.cjs:979:      // Corrupt pid files are treated like absent pid files; the respawn lock still serializes recovery.
.opencode/bin/mk-spec-memory-launcher.cjs:1232:  // lease is keyed on its (still-live) pid, so the replacement daemon is respawned by the child
.opencode/bin/mk-spec-memory-launcher.cjs:1303:// BOOTSTRAP_LOCK_STALE_MS ago wedges every requireLock respawn for the full wait
.opencode/bin/mk-spec-memory-launcher.cjs:1314:  const ownerDead = ownerPid !== null && processLiveness(ownerPid) === 'dead';
.opencode/bin/mk-spec-memory-launcher.cjs:1400:  const refreshed = refreshOwnerLeaseFile(process.pid);
.opencode/bin/mk-spec-memory-launcher.cjs:1404:  startOwnerLeaseHeartbeat(process.pid);
.opencode/bin/mk-spec-memory-launcher.cjs:1649:        // instead of reaping and respawning. This reuses the warm daemon and never tears down a
.opencode/bin/mk-spec-memory-launcher.cjs:1650:        // daemon a live secondary may still be bridged to. The reap+respawn path below runs only
.opencode/bin/mk-spec-memory-launcher.cjs:1654:        if (Number.isInteger(orphanChildPid) && orphanChildPid > 0 && processLiveness(orphanChildPid) !== 'dead') {
.opencode/bin/mk-spec-memory-launcher.cjs:1665:            // reap+respawn block below, which tears it down and spawns a fresh one under the lock.
.opencode/bin/mk-spec-memory-launcher.cjs:1675:              // reap+respawn, rather than letting the exception abort startup and strand the daemon.
.opencode/bin/mk-spec-memory-launcher.cjs:1686:            // marker naming this live child means adopt rather than reap+respawn.
.opencode/bin/mk-spec-memory-launcher.cjs:1688:            if (shouldAdoptDespiteProbe({ marker: adoptMarker, childPid: orphanChildPid, childLiveness: processLiveness(orphanChildPid) })) {
.opencode/bin/mk-spec-memory-launcher.cjs:1694:            log(`stale-reclaim NOT adopting pid ${orphanChildPid}: liveness probe failed (${probe.reason}); reaping and respawning instead`);
.opencode/bin/mk-spec-memory-launcher.cjs:1700:        // exclusive respawn lock to serialize it, the same lock the dead-socket respawn path uses;
.opencode/bin/mk-spec-memory-launcher.cjs:1704:          log('stale-reclaim deferred: another launcher holds the respawn lock; reporting lease held');
.opencode/bin/mk-spec-memory-launcher.cjs:1706:          writeLeaseHeldJsonRpcError(leaseResult, 'respawn-lock-held');
.opencode/bin/mk-spec-memory-launcher.cjs:1710:          // Re-validate under the respawn lock. The liveness probe above can take seconds, during which
.opencode/bin/mk-spec-memory-launcher.cjs:1714:          // defer and reconnect. Mirrors the dead-socket respawn path's post-lock lease re-read.
.opencode/bin/mk-spec-memory-launcher.cjs:1717:            log('stale-reclaim deferred: lease childPid changed after acquiring respawn lock (replacement already present); reporting lease held');
.opencode/bin/mk-spec-memory-launcher.cjs:1721:            writeLeaseHeldJsonRpcError(leaseResult, 'respawn-superseded');
.opencode/bin/mk-spec-memory-launcher.cjs:1766:    // Reap + spawn critical section is over; let other respawn paths proceed.
.opencode/bin/mk-spec-memory-launcher.cjs:1825:  buildOwnerLease,
.opencode/bin/mk-spec-memory-launcher.cjs:1826:  classifyOwnerLease,
.opencode/bin/mk-spec-memory-launcher.cjs:1832:  reapOwnerBeforeRespawn,
.opencode/bin/mk-spec-memory-launcher.cjs:1856:  processLiveness,
.opencode/bin/lib/launcher-session-proxy.cjs:11:  probeDaemon,
.opencode/bin/lib/launcher-session-proxy.cjs:221:    const result = await probe(socketPath, { connect, deepProbe: true });
.opencode/bin/lib/launcher-session-proxy.cjs:354:  const probe = options?.probe ?? probeDaemon;
.opencode/bin/lib/README.md:18:- `model-server-supervision.cjs` owns crash-loop guarding, RSS watchdog, respawn-lock liveness, listener re-arm, and reaping the process tree (including the root) when the model server is idle-evicted. The mk-spec-memory launcher also reuses its reap path to take down a still-live released daemon recorded in a stale lease before it respawns, so a fresh session after owner disposal cannot leave two writers on the database.
.opencode/bin/lib/README.md:39:│ spawn + watchdog + respawn   │   │ socket resolve + probe + pipe│
.opencode/bin/lib/README.md:59:+-- model-server-supervision.cjs   # hf-model-server lifecycle: spawn, watchdog, respawn, reap
.opencode/bin/lib/README.md:72:| `model-server-supervision.cjs` | Builds the model-server supervisor: process-tree RSS sampling, crash-loop backoff, RSS watchdog, respawn-lock liveness, descendant snapshotting, give-up cooldown, socket-dir ownership and SUN_PATH limit assertions, and reaping the process tree root on idle eviction. |
.opencode/bin/lib/README.md:101:│ acquire respawn lock, check liveness     │
.opencode/bin/lib/README.md:129:| `maybeBridgeLeaseHolder` | Function | Bridge launcher stdio to an existing lease holder instead of spawning a duplicate. |
.opencode/bin/lib/README.md:130:| `probeLeaseHolderWithRetries` | Function | Probe the lease holder with bounded retries so a slow-but-alive owner is not false-reaped before a sibling respawns. |
.opencode/bin/lib/README.md:133:| `probeDaemon` / `probeModelServer` | Function | Health-check the MCP daemon socket and the model server endpoint. |
.opencode/bin/lib/launcher-ipc-bridge.cjs:47:// A single transient probe miss must NOT make a sibling reap the lease owner and respawn a second
.opencode/bin/lib/launcher-ipc-bridge.cjs:85:function getIpcSocketPath(serviceName, options = {}) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:150:function probeDaemon(socketPath, options = {}) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:153:  // deepProbe=true REQUIRES a JSON-RPC initialize reply to call the daemon alive (detects a hung daemon
.opencode/bin/lib/launcher-ipc-bridge.cjs:156:  // decision (which always passes deepProbe:true). See maybeBridgeLeaseHolder.
.opencode/bin/lib/launcher-ipc-bridge.cjs:157:  const deepProbe = options.deepProbe === true;
.opencode/bin/lib/launcher-ipc-bridge.cjs:198:      if (!deepProbe) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:338:// only an all-failures run returns the final (dead) result so the caller respawns. The probe fn and
.opencode/bin/lib/launcher-ipc-bridge.cjs:342:    probe = probeDaemon,
.opencode/bin/lib/launcher-ipc-bridge.cjs:355:    result = await probe(socketPath, { timeoutMs, connect, deepProbe: true });
.opencode/bin/lib/launcher-ipc-bridge.cjs:365:async function maybeBridgeLeaseHolder(options) {
.opencode/bin/lib/launcher-ipc-bridge.cjs:394:  // recomputed path can miss the live socket and false-report 'no-bridge-socket'. Only trust the
.opencode/bin/lib/launcher-ipc-bridge.cjs:404:  const socketPath = usableStoredSocketPath ?? getIpcSocketPath(serviceName, { dbDir });
.opencode/bin/lib/launcher-ipc-bridge.cjs:406:    writeLeaseHeld(' (no-bridge-socket)');
.opencode/bin/lib/launcher-ipc-bridge.cjs:407:    return { action: 'report', reason: 'no-bridge-socket', socketPath };
.opencode/bin/lib/launcher-ipc-bridge.cjs:410:  // deepProbe: REQUIRE a JSON-RPC reply, not just a socket accept. The reap/bridge decision must
.opencode/bin/lib/launcher-ipc-bridge.cjs:413:  // hang it forever, never respawning. The raised probe timeout (default 5000ms, < the 7000ms launcher
.opencode/bin/lib/launcher-ipc-bridge.cjs:428:    return { action: 'respawn', reason: probe.reason, socketPath };
.opencode/bin/lib/launcher-ipc-bridge.cjs:447:  getIpcSocketPath,
.opencode/bin/lib/launcher-ipc-bridge.cjs:448:  maybeBridgeLeaseHolder,
.opencode/bin/lib/launcher-ipc-bridge.cjs:449:  probeDaemon,
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:147:    const socketPath = bridge.getIpcSocketPath(SERVICE_NAME, { dbDir: DB_DIR });
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:154:    const probe = await bridge.probeDaemon(socketPath, {
.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs:156:      deepProbe: true,
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:75:  readonly getIpcSocketPath: (serviceName: string, options?: { dbDir?: string }) => string;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:76:  readonly maybeBridgeLeaseHolder: (options: unknown) => Promise<unknown>;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:77:  readonly probeDaemon: (socketPath: string, options?: { timeoutMs?: number; deepProbe?: boolean }) => Promise<BridgeProbeResult>;
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:990:    const probe = await bridge.probeDaemon(socketPath, {
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:992:      deepProbe: true,
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1119:  const initialProbe = await bridge.probeDaemon(socketPath, { timeoutMs: Math.min(timeoutMs, 5000), deepProbe: true });
.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts:1132:  const socketPath = bridge.getIpcSocketPath('mk-code-index', { dbDir: paths.dbDir });
.opencode/bin/lib/model-server-supervision.cjs:30:const HF_MODEL_SERVER_RESPAWN_LOCK_FILE_NAME = 'hf-embed-respawn.lock';
.opencode/bin/lib/model-server-supervision.cjs:274:function processLiveness(pid) {
.opencode/bin/lib/model-server-supervision.cjs:289:    if (processLiveness(pid) === 'dead') return true;
.opencode/bin/lib/model-server-supervision.cjs:292:  return processLiveness(pid) === 'dead';
.opencode/bin/lib/model-server-supervision.cjs:316:// disposed; respawning then would only flap the daemon under a runtime that is going away and
.opencode/bin/lib/model-server-supervision.cjs:570:  const liveness = options.liveness || processLiveness;
.opencode/bin/lib/model-server-supervision.cjs:604:// socket and would reap+respawn the daemon mid-scan (killing the scan). The
.opencode/bin/lib/model-server-supervision.cjs:643:  const liveness = options.liveness || processLiveness;
.opencode/bin/lib/model-server-supervision.cjs:666:function acquireRespawnLockFileAt(lockPath, label = 'respawn', options = {}) {
.opencode/bin/lib/model-server-supervision.cjs:741:    'hf-model-server respawn',
.opencode/bin/lib/model-server-supervision.cjs:817:  const liveness = options.liveness || processLiveness;
.opencode/bin/lib/model-server-supervision.cjs:859:    logger(`confirmed-dead hf-embed socket; reaping recorded hf-model-server pid ${childPid} before respawn`);
.opencode/bin/lib/model-server-supervision.cjs:974:  const liveness = deps.liveness || processLiveness;
.opencode/bin/lib/model-server-supervision.cjs:1056:        liveness: deps.liveness || processLiveness,
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
.opencode/bin/lib/model-server-supervision.cjs:1457:  processLiveness,
.opencode/bin/mk-code-index-launcher.cjs:115:const OWNER_LEASE_FILE_NAME = '.code-graph-owner.json';
.opencode/bin/mk-code-index-launcher.cjs:131:  respawned: 'respawned',
.opencode/bin/mk-code-index-launcher.cjs:170:      async maybeBridgeLeaseHolder({ leaseResult }) {
.opencode/bin/mk-code-index-launcher.cjs:173:        const suffix = process.env.SPECKIT_LAUNCHER_BRIDGE_DISABLED === '1' ? '' : ' (no-bridge-socket)';
.opencode/bin/mk-code-index-launcher.cjs:205:// longer surfaces as a hard "Connection closed" — the proxy reattaches to the respawned backend and
.opencode/bin/mk-code-index-launcher.cjs:300:  return path.join(resolvedDbDir(), OWNER_LEASE_FILE_NAME);
.opencode/bin/mk-code-index-launcher.cjs:345:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
.opencode/bin/mk-code-index-launcher.cjs:351:function writeOwnerLeaseFileExclusive(lease) {
.opencode/bin/mk-code-index-launcher.cjs:352:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
.opencode/bin/mk-code-index-launcher.cjs:370:// misreporting a healthy owner as no-bridge-socket.
.opencode/bin/mk-code-index-launcher.cjs:373:    const { getIpcSocketPath } = loadBridgeModule();
.opencode/bin/mk-code-index-launcher.cjs:374:    if (typeof getIpcSocketPath !== 'function') return null;
.opencode/bin/mk-code-index-launcher.cjs:375:    return getIpcSocketPath('mk-code-index', { dbDir: resolvedDbDir() }) ?? null;
.opencode/bin/mk-code-index-launcher.cjs:394:function startOwnerLeaseHeartbeat(ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:400:    if (refreshOwnerLeaseFile(ownerPid)) return;
.opencode/bin/mk-code-index-launcher.cjs:410:function buildOwnerLease(ownerPid = process.pid) {
.opencode/bin/mk-code-index-launcher.cjs:423:function processLiveness(pid) {
.opencode/bin/mk-code-index-launcher.cjs:455:function classifyOwnerLease(lease) {
.opencode/bin/mk-code-index-launcher.cjs:456:  const liveness = processLiveness(lease.ownerPid);
.opencode/bin/mk-code-index-launcher.cjs:479:    const classification = classifyOwnerLease(existing);
.opencode/bin/mk-code-index-launcher.cjs:486:  const lease = buildOwnerLease(process.pid);
.opencode/bin/mk-code-index-launcher.cjs:498:  if (!writeOwnerLeaseFileExclusive(lease)) {
.opencode/bin/mk-code-index-launcher.cjs:503:      classification: holder ? classifyOwnerLease(holder) : 'live-owner',
.opencode/bin/mk-code-index-launcher.cjs:510:      ownerClassification: classifyOwnerLease(existing),
.opencode/bin/mk-code-index-launcher.cjs:517:function refreshOwnerLeaseFile(ownerPid, patch = {}) {
.opencode/bin/mk-code-index-launcher.cjs:582:function leaseHeldFromFile(filePath, legacyPath = null) {
.opencode/bin/mk-code-index-launcher.cjs:613:  const primary = leaseHeldFromFile(leasePath());
.opencode/bin/mk-code-index-launcher.cjs:618:    const legacy = leaseHeldFromFile(legacyPath, legacyPath);
.opencode/bin/mk-code-index-launcher.cjs:634:    if (processLiveness(pid) === 'dead') return true;
.opencode/bin/mk-code-index-launcher.cjs:637:  return processLiveness(pid) === 'dead';
.opencode/bin/mk-code-index-launcher.cjs:640:async function reapOwnerBeforeRespawn(ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:641:  const liveness = processLiveness(ownerPid);
.opencode/bin/mk-code-index-launcher.cjs:649:  log(`confirmed-dead socket; reaping recorded code-index owner pid ${ownerPid} before respawn`);
.opencode/bin/mk-code-index-launcher.cjs:668:async function respawnAfterDeadSocket(leaseResult, decision, options = {}) {
.opencode/bin/mk-code-index-launcher.cjs:670:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
.opencode/bin/mk-code-index-launcher.cjs:671:    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:674:  const ownerPid = options.respawnChildPid;
.opencode/bin/mk-code-index-launcher.cjs:676:    log('confirmed-dead socket but no recorded code-index child owner pid is available; respawn inert');
.opencode/bin/mk-code-index-launcher.cjs:686:      log('dead-socket respawn skipped; code-index owner lease changed while waiting for respawn lock');
.opencode/bin/mk-code-index-launcher.cjs:687:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
.opencode/bin/mk-code-index-launcher.cjs:688:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:691:    const reapResult = await reapOwnerBeforeRespawn(ownerPid);
.opencode/bin/mk-code-index-launcher.cjs:693:      log(`dead-socket respawn skipped; ${reapResult.reason} for ownerPid=${ownerPid}`);
.opencode/bin/mk-code-index-launcher.cjs:699:    const lease = buildOwnerLease(process.pid);
.opencode/bin/mk-code-index-launcher.cjs:700:    if (!writeOwnerLeaseFileExclusive(lease)) {
.opencode/bin/mk-code-index-launcher.cjs:702:      log(`dead-socket respawn skipped; another launcher owns code-index owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-code-index-launcher.cjs:703:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-code-index-launcher.cjs:704:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:711:    return { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath };
.opencode/bin/mk-code-index-launcher.cjs:720:  const { maybeBridgeLeaseHolder } = loadBridgeModule();
.opencode/bin/mk-code-index-launcher.cjs:721:  const decision = await maybeBridgeLeaseHolder({
.opencode/bin/mk-code-index-launcher.cjs:728:  if (decision && decision.action === 'respawn') {
.opencode/bin/mk-code-index-launcher.cjs:729:    const respawnResult = await respawnAfterDeadSocket(leaseResult, decision, options);
.opencode/bin/mk-code-index-launcher.cjs:730:    if (respawnResult.action === 'respawn') {
.opencode/bin/mk-code-index-launcher.cjs:731:      emitLeaseMetric(leaseMetricClassForTransition('respawned'), {
.opencode/bin/mk-code-index-launcher.cjs:733:        reason: respawnResult.reason,
.opencode/bin/mk-code-index-launcher.cjs:734:        socketPath: respawnResult.socketPath,
.opencode/bin/mk-code-index-launcher.cjs:739:        reason: respawnResult.reason,
.opencode/bin/mk-code-index-launcher.cjs:740:        socketPath: respawnResult.socketPath,
.opencode/bin/mk-code-index-launcher.cjs:743:    return respawnResult;
.opencode/bin/mk-code-index-launcher.cjs:889:// staleMs ago wedges every requireLock respawn for the full wait deadline.
.opencode/bin/mk-code-index-launcher.cjs:899:  const ownerDead = ownerPid !== null && processLiveness(ownerPid) === 'dead';
.opencode/bin/mk-code-index-launcher.cjs:974:    const refreshed = refreshOwnerLeaseFile(process.pid, {
.opencode/bin/mk-code-index-launcher.cjs:982:    startOwnerLeaseHeartbeat(refreshed ? childProcess.pid : process.pid);
.opencode/bin/mk-code-index-launcher.cjs:1046:  // against the same DB (mirrors the dead-socket respawn reap and the sibling
.opencode/bin/mk-code-index-launcher.cjs:1072:        // maybeBridgeLeaseHolder falls back to a LEASE_HELD_BY diagnostic line
.opencode/bin/mk-code-index-launcher.cjs:1080:          respawnChildPid: ownerLeaseResult.holder.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:1172:    // winning launcher reaps + respawns; a still-live orphan would otherwise keep
.opencode/bin/mk-code-index-launcher.cjs:1175:      const reapResult = await reapOwnerBeforeRespawn(reclaimedOrphanPid);
.opencode/bin/mk-code-index-launcher.cjs:1234:  reapOwnerBeforeRespawn,
.opencode/bin/mk-skill-advisor-launcher.cjs:72:const OWNER_LEASE_FILE_NAME = '.skill-advisor-owner.json';
.opencode/bin/mk-skill-advisor-launcher.cjs:147:      getIpcSocketPath(_serviceName, options = {}) {
.opencode/bin/mk-skill-advisor-launcher.cjs:156:      async maybeBridgeLeaseHolder({ leaseResult, legacyReport }) {
.opencode/bin/mk-skill-advisor-launcher.cjs:163:        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker} (no-bridge-socket)\n`);
.opencode/bin/mk-skill-advisor-launcher.cjs:293:  return path.join(resolvedAdvisorDbDir(), OWNER_LEASE_FILE_NAME);
.opencode/bin/mk-skill-advisor-launcher.cjs:306:function leaseHeldFromFile(filePath = leasePath(), legacyPath = null) {
.opencode/bin/mk-skill-advisor-launcher.cjs:342:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
.opencode/bin/mk-skill-advisor-launcher.cjs:355:function writeOwnerLeaseFileExclusive(lease) {
.opencode/bin/mk-skill-advisor-launcher.cjs:356:  const currentLeasePath = path.join(ensureCanonicalDir(path.dirname(ownerLeasePath())), OWNER_LEASE_FILE_NAME);
.opencode/bin/mk-skill-advisor-launcher.cjs:371:function buildOwnerLease(ownerPid = process.pid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:383:function processLiveness(pid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:398:    if (processLiveness(pid) === 'dead') return true;
.opencode/bin/mk-skill-advisor-launcher.cjs:401:  return processLiveness(pid) === 'dead';
.opencode/bin/mk-skill-advisor-launcher.cjs:423:async function reapOwnerBeforeRespawn(ownerPid, expectedExecutablePath = null) {
.opencode/bin/mk-skill-advisor-launcher.cjs:424:  const liveness = processLiveness(ownerPid);
.opencode/bin/mk-skill-advisor-launcher.cjs:445:  log(`confirmed-dead socket; reaping recorded skill-advisor daemon pid ${ownerPid} before respawn`);
.opencode/bin/mk-skill-advisor-launcher.cjs:460:    if (processLiveness(ownerPid) !== 'dead') {
.opencode/bin/mk-skill-advisor-launcher.cjs:487:function classifyOwnerLease(lease) {
.opencode/bin/mk-skill-advisor-launcher.cjs:488:  const liveness = processLiveness(lease.ownerPid);
.opencode/bin/mk-skill-advisor-launcher.cjs:511:    const classification = classifyOwnerLease(existing);
.opencode/bin/mk-skill-advisor-launcher.cjs:518:  const lease = buildOwnerLease(process.pid);
.opencode/bin/mk-skill-advisor-launcher.cjs:530:  if (!writeOwnerLeaseFileExclusive(lease)) {
.opencode/bin/mk-skill-advisor-launcher.cjs:535:      classification: holder ? classifyOwnerLease(holder) : 'live-owner',
.opencode/bin/mk-skill-advisor-launcher.cjs:542:function refreshOwnerLeaseFile(ownerPid, patch = {}) {
.opencode/bin/mk-skill-advisor-launcher.cjs:564:function startOwnerLeaseHeartbeat(ownerPid = process.pid) {
.opencode/bin/mk-skill-advisor-launcher.cjs:570:    if (refreshOwnerLeaseFile(ownerPid)) return;
.opencode/bin/mk-skill-advisor-launcher.cjs:656:async function respawnAfterDeadSocket(leaseResult, decision) {
.opencode/bin/mk-skill-advisor-launcher.cjs:658:    writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-disabled)');
.opencode/bin/mk-skill-advisor-launcher.cjs:659:    return { action: 'report', reason: 'respawn-disabled', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:664:    log('confirmed-dead socket but no recorded skill-advisor daemon pid is available; respawn inert');
.opencode/bin/mk-skill-advisor-launcher.cjs:677:      log('dead-socket respawn skipped; skill-advisor launcher lease changed while waiting for bootstrap lock');
.opencode/bin/mk-skill-advisor-launcher.cjs:678:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-superseded)');
.opencode/bin/mk-skill-advisor-launcher.cjs:679:      return { action: 'report', reason: 'respawn-superseded', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:684:    const reapResult = await reapOwnerBeforeRespawn(targetPid, expectedExecutablePath);
.opencode/bin/mk-skill-advisor-launcher.cjs:686:      log(`dead-socket respawn skipped; ${reapResult.reason} for daemonPid=${targetPid}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:693:      if (processLiveness(previousOwner.ownerPid) === 'dead') {
.opencode/bin/mk-skill-advisor-launcher.cjs:702:    const ownerLease = buildOwnerLease(process.pid);
.opencode/bin/mk-skill-advisor-launcher.cjs:703:    if (!writeOwnerLeaseFileExclusive(ownerLease)) {
.opencode/bin/mk-skill-advisor-launcher.cjs:705:      log(`dead-socket respawn skipped; another launcher owns skill-advisor owner lease pid=${holder?.ownerPid ?? 'unknown'}`);
.opencode/bin/mk-skill-advisor-launcher.cjs:706:      writeLeaseHeldDiagnostic(leaseResult, ' (dead-socket-respawn-owned)');
.opencode/bin/mk-skill-advisor-launcher.cjs:707:      return { action: 'report', reason: 'respawn-lock-held', socketPath: decision.socketPath };
.opencode/bin/mk-skill-advisor-launcher.cjs:710:    startOwnerLeaseHeartbeat(process.pid);
.opencode/bin/mk-skill-advisor-launcher.cjs:717:      ? { action: 'respawn', reason: 'spawned', socketPath: decision.socketPath }
.opencode/bin/mk-skill-advisor-launcher.cjs:727:  const launcherLease = leaseHeldFromFile();
.opencode/bin/mk-skill-advisor-launcher.cjs:742:  const { maybeBridgeLeaseHolder } = loadBridgeModule();
.opencode/bin/mk-skill-advisor-launcher.cjs:743:  const decision = await maybeBridgeLeaseHolder({
.opencode/bin/mk-skill-advisor-launcher.cjs:751:  if (decision && decision.action === 'respawn') {
.opencode/bin/mk-skill-advisor-launcher.cjs:752:    return await respawnAfterDeadSocket(leaseResult, decision);
.opencode/bin/mk-skill-advisor-launcher.cjs:764:  startOwnerLeaseHeartbeat(process.pid);
.opencode/bin/mk-skill-advisor-launcher.cjs:766:  const launcherLease = leaseHeldFromFile();
.opencode/bin/mk-skill-advisor-launcher.cjs:778:    if (staleChildPid && processLiveness(staleChildPid) !== 'dead') {
.opencode/bin/mk-skill-advisor-launcher.cjs:789:        if (decision?.action === 'bridge' || decision?.action === 'respawn') {
.opencode/bin/mk-skill-advisor-launcher.cjs:792:        if (decision?.reason !== 'no-bridge-socket') {
.opencode/bin/mk-skill-advisor-launcher.cjs:827:  const { getIpcSocketPath } = loadBridgeModule();
.opencode/bin/mk-skill-advisor-launcher.cjs:828:  return getIpcSocketPath('mk-skill-advisor', { dbDir: resolvedAdvisorDbDir() });
.opencode/bin/mk-skill-advisor-launcher.cjs:991:  if (!exitedAfterTerm && processLiveness(pid) !== 'dead') {
.opencode/bin/mk-skill-advisor-launcher.cjs:1138:  const ownerDead = ownerPid !== null && processLiveness(ownerPid) === 'dead';
.opencode/bin/mk-skill-advisor-launcher.cjs:1284:        // and spawn share one serialization point without a separate respawn lock.
.opencode/bin/mk-skill-advisor-launcher.cjs:1287:        const reapResult = await reapOwnerBeforeRespawn(pendingBootstrapReapPid, reapExecutablePath);
.opencode/bin/mk-skill-advisor-launcher.cjs:1374:  classifyOwnerLease,
.opencode/bin/mk-skill-advisor-launcher.cjs:1383:  reapOwnerBeforeRespawn,
.opencode/bin/mk-skill-advisor-launcher.cjs:1385:  startOwnerLeaseHeartbeat,
.opencode/bin/README.md:85:| `mk-spec-memory-launcher.cjs` | Boots the mk-spec-memory MCP child. Manages the shared hf-model-server lease, respawn locks, and reaping a dead lease child before respawn. |
.opencode/bin/README.md:93:Lifecycle parity note: `mk-spec-memory-launcher.cjs` is the hardened reference for persistent launcher logging, detached daemon re-election/adoption, and owner-release-on-shutdown. `mk-code-index-launcher.cjs` and `mk-skill-advisor-launcher.cjs` currently stop with their child and rely on fresh-session reload plus bridge/respawn paths instead.
.opencode/bin/README.md:124:│ acquire bootstrap + respawn lease        │
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-resolve-subject-typed.vitest.ts:20:import { closeDb, initDb, upsertFile } from '../lib/code-graph-db.js';
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-resolve-subject-typed.vitest.ts:36:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-resolve-subject-typed.vitest.ts:57:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:17:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:49:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:70:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:81:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:97:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/w10-degraded-readiness-integration.vitest.ts:40:import { closeDb, initDb } from '../../lib/code-graph-db.js';
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/w10-degraded-readiness-integration.vitest.ts:83:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts:8:  initDb,
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts:53:    initDb(join(tmpDir, 'db'));
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts:18:import { closeDb, initDb } from '../../lib/code-graph-db.js';
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts:53:    initDb(join(tmpDir, 'db'));
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:213:    expect(launcherModule.leaseMetricClassForTransition('respawned')).toBe('respawned');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:455:  // (so classifyOwnerLease returns 'stale-heartbeat-reclaim') and spawns two launchers at once so
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:490:        // Seed a stale-heartbeat owner lease owned by a LIVE helper pid so classifyOwnerLease
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:19:// The test uses the existing isolation seam: `initDb(tempDir)` swaps the
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:65:  initDb,
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:207:    // Empty isolated DB: initDb creates the schema but inserts zero rows.
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:208:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:241:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:321:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:362:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1027:export function initDb(dbDir: string): Database.Database {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1063:  if (!db) initDb(DATABASE_DIR);
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1064:  // initDb either assigns the singleton database or throws before this return.
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-context-stress.vitest.ts:8:  initDb,
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-context-stress.vitest.ts:53:    initDb(join(tmpDir, 'db'));
.opencode/skills/system-code-graph/mcp_server/lib/README.md:245:| `initDb()` / `getDb()` / `closeDb()` | Functions | Manage the SQLite graph database lifecycle. |
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts:10:  initDb,
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts:104:  initDb(tempRoot);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts:7:import { closeDb, initDb, replaceNodes, setCodeGraphScope, upsertFile } from '../../lib/code-graph-db.js';
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts:83:  initDb(tempRoot);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts:24:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts:61:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seed-resolver.vitest.ts:12:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seed-resolver.vitest.ts:27:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:12:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:81:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:109:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:141:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:161:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-db.vitest.ts:10:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-db.vitest.ts:51:  initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:20:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:92:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:101:  it('applies through initDb when the flag is enabled', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:107:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:33:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:186:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:218:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:245:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:274:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:645:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:711:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:765:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:792:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:1367:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:11:describe('code-index CLI owner lease and respawn locking', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-owner-respawn.vitest.ts:30:    const harness = createCodeIndexHarness('dead-socket-respawn');
.opencode/skills/system-code-graph/mcp_server/tests/tree-sitter-parser.vitest.ts:13:  initDb: vi.fn(),
.opencode/skills/system-code-graph/mcp_server/tests/tree-sitter-parser.vitest.ts:19:  initDb: mocks.initDb,
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:62:const OWNER_LEASE_FILE_NAME = '.code-graph-owner.json';
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:63:const OWNER_LEASE_LOCK_FILE_NAME = `${OWNER_LEASE_FILE_NAME}.lock`;
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:92:  return join(canonicalDbDir, OWNER_LEASE_FILE_NAME);
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:535:export { OWNER_LEASE_FILE_NAME };
.opencode/skills/system-code-graph/mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts:16:import { closeDb, getDb, initDb } from '../lib/code-graph-db.js';
.opencode/skills/system-code-graph/mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts:52:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:61:  initDb: vi.fn(),
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cross-file-edges.vitest.ts:9:import { closeDb, getDb, initDb } from '../lib/code-graph-db.js';
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cross-file-edges.vitest.ts:41:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:12:import { closeDb, getDb, initDb } from '../lib/code-graph-db.js';
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:60:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:86:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:113:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:146:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:15:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:40:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:77:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:110:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/edge-staleness-correctness.vitest.ts:13:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/edge-staleness-correctness.vitest.ts:63:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:14:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:30:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:146:      const upgraded = initDb(legacyDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:161:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:186:      initDb(legacyDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:198:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:303:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:338:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:373:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:406:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:438:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:464:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:491:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:529:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:21:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:37:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:51:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:70:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:85:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:106:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:131:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:18:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:78:  it('applies through initDb and backfills legacy edges to the current generation', () => {
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:84:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:190:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:4:// initDb must set busy_timeout = 5000ms so concurrent writers
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:12:import { closeDb, initDb } from '../lib/code-graph-db.js';
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:26:      const db = initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:37:      // First connection via the singleton initDb
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:38:      const primary = initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:60:      const db = initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/lib/close-db.vitest.ts:10:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/lib/close-db.vitest.ts:18:  initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-tombstones.vitest.ts:14:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-tombstones.vitest.ts:78:  initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:7:  OWNER_LEASE_FILE_NAME,
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:40:  writeFileSync(join(resolveCanonicalDbDir(dbDir), OWNER_LEASE_FILE_NAME), `${JSON.stringify(lease, null, 2)}\n`);
.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts:264:    expect(JSON.parse(readFileSync(join(resolveCanonicalDbDir(dbDir), OWNER_LEASE_FILE_NAME), 'utf8')).ownerPid).toBe(424242);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:19:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:100:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:115:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:130:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:148:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:171:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:191:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:208:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-followups.vitest.ts:27:  initDb,
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-followups.vitest.ts:73:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:316:        db.pragma('wal_checkpoint(TRUNCATE)');

exec
/bin/zsh -lc "nl -ba .opencode/bin/lib/launcher-ipc-bridge.cjs | sed -n '1,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-code-index-launcher.cjs | sed -n '756,1160p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "rg -n \"function initDb|const initDb|initDb\\(|wal_autocheckpoint|journal_mode|wal_checkpoint|code-graph.sqlite\" .opencode/skills/system-code-graph/mcp_server -S" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-resolve-subject-typed.vitest.ts:36:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-resolve-subject-typed.vitest.ts:57:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:358:    // Seed the former shared standalone DB location with a code-graph.sqlite ONLY (no live PID
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:369:    const formerSqlite = join(formerDbDir, 'code-graph.sqlite');
.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:375:    const targetSqlite = join(dirname(workspace.pidFilePath), 'code-graph.sqlite');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-pipeline-safety.vitest.ts:40:  const db = new Database(join(dir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-pipeline-safety.vitest.ts:48:  const db = new Database(join(dir, 'code-graph.sqlite'), { readonly: true });
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-pipeline-safety.vitest.ts:194:      writeFileSync(join(dir, 'code-graph.sqlite'), 'artifact');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:78:    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'snapshot');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:104:    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'snapshot');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:132:    writeFileSync(join(dbDir, 'code-graph.sqlite'), '');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:157:    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'snapshot');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts:215:    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'snapshot');
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:68:  'code-graph.sqlite',
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:69:  'code-graph.sqlite-wal',
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:70:  'code-graph.sqlite-shm',
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:217:    integrityCheck = runIntegrityCheck(join(recoveryDir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:253:  const sqlitePath = tripletPath(dbDir, 'code-graph.sqlite');
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:313:    if (restored && existsSync(tripletPath(dbDir, 'code-graph.sqlite'))) {
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:314:      const db = new Database(tripletPath(dbDir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:316:        db.pragma('wal_checkpoint(TRUNCATE)');
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-followups.vitest.ts:73:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-recovery-procedures.vitest.ts:16:  const db = new Database(join(dir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-recovery-procedures.vitest.ts:22:  writeFileSync(join(dir, 'code-graph.sqlite-wal'), '');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-recovery-procedures.vitest.ts:23:  writeFileSync(join(dir, 'code-graph.sqlite-shm'), '');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-recovery-procedures.vitest.ts:80:    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'bad-state');
.opencode/skills/system-code-graph/mcp_server/lib/README.md:245:| `initDb()` / `getDb()` / `closeDb()` | Functions | Manage the SQLite graph database lifecycle. |
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:186:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:218:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:245:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:274:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:645:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:711:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:765:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:792:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-indexer.vitest.ts:1367:        initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:60:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:86:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:113:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-atomic-persistence.vitest.ts:146:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:37:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:51:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:70:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:85:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:106:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-metadata-shape.vitest.ts:131:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:81:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:109:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:141:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-scope-readiness.vitest.ts:161:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:26:      const db = initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:38:      const primary = initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:44:      const secondaryPath = join(tempDir, 'code-graph.sqlite');
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-busy-timeout.vitest.ts:60:      const db = initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-cross-file-edges.vitest.ts:41:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/tests/reverse-dep-degree-cap-default.vitest.ts:52:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-apply-e2e.vitest.ts:84:    writeFileSync(join(dbDir, 'code-graph.sqlite'), 'snapshot');
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:100:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:115:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:130:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:148:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:171:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:191:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-readers.vitest.ts:208:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-seed-resolver.vitest.ts:27:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-reindex.vitest.ts:61:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/tests/edge-staleness-correctness.vitest.ts:63:  initDb(canonicalDbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:35:  const database = new Database(join(dbDir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:92:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-governance-vocab.vitest.ts:107:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:5:// Uses separate code-graph.sqlite alongside the memory index DB.
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1027:export function initDb(dbDir: string): Database.Database {
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1031:    dbPath = join(dbDir, 'code-graph.sqlite');
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1035:    // BEFORE journal_mode/foreign_keys so any incidental contention during
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1038:    db.pragma('journal_mode = WAL'); // WAL enables concurrent readers without locks
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1063:  if (!db) initDb(DATABASE_DIR);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-status-readiness-snapshot.vitest.ts:282:// Note: a true on-disk byte-equal check on `code-graph.sqlite` would
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:37:  const database = new Database(join(dbDir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:84:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-edge-bitemporal-schema.vitest.ts:190:    initDb(dbDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:40:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:77:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-stale-mtime-vs-hash.vitest.ts:110:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/lib/close-db.vitest.ts:18:  initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:49:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:70:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:81:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-candidate-manifest.vitest.ts:97:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-tombstones.vitest.ts:78:  initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/code-graph-db.vitest.ts:51:  initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:30:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:139:      const legacy = new Database(join(legacyDir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:146:      const upgraded = initDb(legacyDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:161:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:169:      const legacy = new Database(join(legacyDir, 'code-graph.sqlite'));
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:186:      initDb(legacyDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:198:      initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:303:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:338:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:373:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:406:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:438:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:464:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:491:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/tests/parser-skip-list.vitest.ts:529:    dynamicDb.initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/detect-changes-preflight-stress.vitest.ts:83:  initDb(tempRoot);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/w10-degraded-readiness-integration.vitest.ts:83:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-scan-stress.vitest.ts:53:    initDb(join(tmpDir, 'db'));
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:19:// The test uses the existing isolation seam: `initDb(tempDir)` swaps the
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:21:// `code-graph.sqlite` byte-equal across the run.
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:32://   - The live `code-graph.sqlite` is hashed before/after; the assertion
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:87:  'code-graph.sqlite',
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:141:  // byte-equality at the end so the live code-graph.sqlite is provably
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:208:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:241:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:312:  //       afterAll() byte-equality guard for the live code-graph.sqlite.
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:321:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:362:    initDb(tempDir);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-degraded-sweep.vitest.ts:401:  it('does not mutate the live code-graph.sqlite during the sweep', () => {
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/manual-diagnostics-stress.vitest.ts:104:  initDb(tempRoot);
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/code-graph-context-stress.vitest.ts:53:    initDb(join(tmpDir, 'db'));
.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/context-handler-normalization-stress.vitest.ts:53:    initDb(join(tmpDir, 'db'));

codex
The core bridge/probe claim is mostly real, but several citations are path-sensitive: GLM points at `.opencode/bin/launcher-ipc-bridge.cjs`, while the live launcher loads `.opencode/bin/lib/launcher-ipc-bridge.cjs`. I’m checking the tail of the launcher and DB init now for WAL and export details.
exec
/bin/zsh -lc "nl -ba .opencode/bin/mk-code-index-launcher.cjs | sed -n '1160,1345p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts | sed -n '1000,1075p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts | sed -n '280,330p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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

exec
/bin/zsh -lc "rg -n \"STARTUP_GRACE|MAX_INIT|childSpawnedAt|registry|pid-reuse|statSync\\(.*ownerLease|uid|foreign|wal_checkpoint|wal_autocheckpoint|lsof|self-heal|LAUNCHER_DIAGNOSTIC|socketPath|ownerPid\" .opencode/bin/mk-code-index-launcher.cjs .opencode/bin/lib/launcher-ipc-bridge.cjs .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts .opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts -S" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
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
.opencode/bin/lib/launcher-ipc-bridge.cjs:378:  const ownerPid = leaseResult.ownerPid;
.opencode/bin/lib/launcher-ipc-bridge.cjs:380:    process.stdout.write(`LEASE_HELD_BY:${ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
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
.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:316:        db.pragma('wal_checkpoint(TRUNCATE)');
.opencode/bin/mk-code-index-launcher.cjs:174:        process.stdout.write(`LEASE_HELD_BY:${leaseResult.ownerPid} startedAt=${startedAt}${legacyMarker}${suffix}\n`);
.opencode/bin/mk-code-index-launcher.cjs:207:function bridgeStdioThroughSessionProxy(socketPath, options = {}) {
.opencode/bin/mk-code-index-launcher.cjs:210:    socketPath,
.opencode/bin/mk-code-index-launcher.cjs:328:      Number.isInteger(parsed.ownerPid) &&
.opencode/bin/mk-code-index-launcher.cjs:394:function startOwnerLeaseHeartbeat(ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:400:    if (refreshOwnerLeaseFile(ownerPid)) return;
.opencode/bin/mk-code-index-launcher.cjs:410:function buildOwnerLease(ownerPid = process.pid) {
.opencode/bin/mk-code-index-launcher.cjs:412:    ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:419:    socketPath: ownerSocketPath(),
.opencode/bin/mk-code-index-launcher.cjs:456:  const liveness = processLiveness(lease.ownerPid);
.opencode/bin/mk-code-index-launcher.cjs:460:  const actualPpid = readParentPid(lease.ownerPid);
.opencode/bin/mk-code-index-launcher.cjs:483:    log(`ownerLeaseReclaimed: ${classification} ownerPid=${existing.ownerPid}`);
.opencode/bin/mk-code-index-launcher.cjs:509:      ownerPid: existing.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:517:function refreshOwnerLeaseFile(ownerPid, patch = {}) {
.opencode/bin/mk-code-index-launcher.cjs:519:  if (!lease || lease.ownerPid !== ownerPid) return false;
.opencode/bin/mk-code-index-launcher.cjs:520:  const nextOwnerPid = patch.ownerPid ?? ownerPid;
.opencode/bin/mk-code-index-launcher.cjs:529:  if (!reread || reread.ownerPid !== nextOwnerPid) return false;
.opencode/bin/mk-code-index-launcher.cjs:541:    if (lease && lease.ownerPid === ownerLeasePid
.opencode/bin/mk-code-index-launcher.cjs:542:        && readOwnerLeaseFile()?.ownerPid === ownerLeasePid) {
.opencode/bin/mk-code-index-launcher.cjs:552:function clearOwnerLeaseFileIfOwner(ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:556:    if (lease && lease.ownerPid === ownerPid
.opencode/bin/mk-code-index-launcher.cjs:557:        && readOwnerLeaseFile()?.ownerPid === ownerPid) {
.opencode/bin/mk-code-index-launcher.cjs:579:      || pidLiveAt(path.join(dir, '.code-graph-owner.json'), 'ownerPid');
.opencode/bin/mk-code-index-launcher.cjs:584:  if (!lease) return { held: false, ownerPid: null, staleReclaimable: false, startedAt: null, legacyPath, socketPath: null };
.opencode/bin/mk-code-index-launcher.cjs:587:  const socketPath = typeof lease.socketPath === 'string' && lease.socketPath.length > 0 ? lease.socketPath : null;
.opencode/bin/mk-code-index-launcher.cjs:589:  // current user. A foreign-owned lease in a shared/former path could otherwise point this
.opencode/bin/mk-code-index-launcher.cjs:591:  if (legacyPath && typeof process.getuid === 'function') {
.opencode/bin/mk-code-index-launcher.cjs:593:      if (fs.statSync(filePath).uid !== process.getuid()) {
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
.opencode/bin/mk-code-index-launcher.cjs:1063:          && Number.isInteger(ownerLeaseResult.reclaimed.ownerPid)
.opencode/bin/mk-code-index-launcher.cjs:1064:          && ownerLeaseResult.reclaimed.ownerPid > 0
.opencode/bin/mk-code-index-launcher.cjs:1065:          && ownerLeaseResult.reclaimed.ownerPid !== process.pid) {
.opencode/bin/mk-code-index-launcher.cjs:1066:        reclaimedOrphanPid = ownerLeaseResult.reclaimed.ownerPid;
.opencode/bin/mk-code-index-launcher.cjs:1074:        log(`liveOwnerDetected: ownerPid=${ownerLeaseResult.holder.ownerPid} classification=${ownerLeaseResult.classification}`);
.opencode/bin/mk-code-index-launcher.cjs:1076:          ownerPid: ownerLeaseResult.holder.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:1078:          socketPath: typeof ownerLeaseResult.holder.socketPath === 'string' ? ownerLeaseResult.holder.socketPath : null,
.opencode/bin/mk-code-index-launcher.cjs:1080:          respawnChildPid: ownerLeaseResult.holder.ownerPid,
.opencode/bin/mk-code-index-launcher.cjs:1094:          ownerPid: leaseResult.ownerPid,
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1035:    // BEFORE journal_mode/foreign_keys so any incidental contention during
.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1039:    db.pragma('foreign_keys = ON');

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs | sed -n '140,162p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   140	async function warmProbe(timeoutMs) {
   141	  if (!existsSync(CLI_SHIM) || !existsSync(BRIDGE_PATH)) {
   142	    return { warm: false, reason: 'missing_runtime_assets' };
   143	  }
   144	  const require = createRequire(import.meta.url);
   145	  const bridge = require(BRIDGE_PATH);
   146	  return withDefaultSocketEnv(async () => {
   147	    const socketPath = bridge.getIpcSocketPath(SERVICE_NAME, { dbDir: DB_DIR });
   148	    if (!socketPath.startsWith('tcp://') && !existsSync(socketPath)) {
   149	      return { warm: false, reason: 'socket_absent', socketPath };
   150	    }
   151	    if (process.platform === 'darwin' && !socketPath.startsWith('tcp://') && Buffer.byteLength(socketPath) > 103) {
   152	      return { warm: false, reason: 'socket_path_too_long', socketPath };
   153	    }
   154	    const probe = await bridge.probeDaemon(socketPath, {
   155	      timeoutMs: Math.max(1, timeoutMs),
   156	      deepProbe: true,
   157	    });
   158	    return probe.status === 'alive'
   159	      ? { warm: true, reason: probe.reason ?? 'alive', socketPath }
   160	      : { warm: false, reason: probe.reason ?? probe.status, socketPath };
   161	  });
   162	}

exec
/bin/zsh -lc "nl -ba .opencode/bin/lib/README.md | sed -n '120,134p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   120	---
   121	
   122	## 6. ENTRYPOINTS
   123	
   124	| Entrypoint | Type | Purpose |
   125	|---|---|---|
   126	| `createModelServerSupervisor` | Function | Construct the supervisor that spawns and watches the hf-model-server. |
   127	| `startRssWatchdog` | Function | Sample the child process tree RSS and act on sustained breaches. |
   128	| `reapProcessTreeGroups` | Function | Terminate the model-server process tree, including the root, on shutdown or idle eviction. |
   129	| `maybeBridgeLeaseHolder` | Function | Bridge launcher stdio to an existing lease holder instead of spawning a duplicate. |
   130	| `probeLeaseHolderWithRetries` | Function | Probe the lease holder with bounded retries so a slow-but-alive owner is not false-reaped before a sibling respawns. |
   131	| `createSessionProxy` | Function | Build the reconnecting stdin/stdout proxy that reattaches and replays in-flight read frames across a daemon recycle. |
   132	| `createClassifyFrame` | Function | Build a per-server frame classifier from a replayable and unsafe tool set, deciding which frames are safe to replay. |
   133	| `probeDaemon` / `probeModelServer` | Function | Health-check the MCP daemon socket and the model server endpoint. |
   134	| `isAllowedSidecarEnvKey` | Function | Decide whether an env key may pass into the embedding sidecar. |

exec
/bin/zsh -lc "rg --files .opencode/bin | rg 'launcher-ipc-bridge\\.cjs"'$|mk-code-index-launcher'"\\.cjs"'$'"'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/bin/lib/launcher-ipc-bridge.cjs
.opencode/bin/mk-code-index-launcher.cjs

exec
/bin/zsh -lc "nl -ba .opencode/skills/system-code-graph/mcp_server/code-index-cli.ts | sed -n '984,998p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
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

codex
I have the code evidence I need. One more small compliance read from the review skill’s baseline, then I’ll produce only the requested JSON.
exec
/bin/zsh -lc "sed -n '1,160p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-code-review/references/review_ux_single_pass.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: Review UX - Single Pass
description: Interactive single-pass review behavior for human-facing review sessions.
trigger_phrases:
  - "single pass review ux"
  - "review first implement second"
  - "next step options after findings"
  - "pre commit review guidance"
importance_tier: normal
contextType: implementation
version: 1.5.0.5
---

# Review UX - Single Pass

Interactive behavior for a one-pass review where findings are reported first and the human chooses what happens next.

---

## 1. OVERVIEW

Interactive single-pass review behavior for human-facing review sessions.

---

## 2. HUMAN INTERACTION BEHAVIOR

- Review first, implement second.
- After publishing findings, ask the user what to do next before writing code.
- Keep the prompt concrete and mode-aware; do not ask open-ended process questions unless scope is unclear.
- If no blocking findings exist, still offer explicit next-step choices instead of assuming implementation work.

Recommended next-step options:

1. Fix all findings
2. Fix `P0` and `P1` only
3. Fix selected findings
4. No implementation changes

---

## 3. REPORT FLOW

Use this flow for interactive review responses:

1. State what was reviewed and the scope source (`git diff`, staged diff, file list, or commit range).
2. Publish findings ordered by severity.
3. Summarize merge posture or risk level briefly.
4. Ask the user what to do next.

If no diff is present, report:

- What was checked
- That no diff was found
- A concrete follow-up choice: staged changes only, specific commit/range, or selected files

---

## 4. MODE-SPECIFIC PRESENTATION

Choose the lightest presentation that fits the request:

- Findings-only: list the issues with evidence and stop after the next-step prompt.
- Findings + gate recommendation: include `APPROVE`, `REQUEST_CHANGES`, or `COMMENT` after the findings.
- Findings + fix follow-up options: present the review, then offer concrete remediation choices without starting implementation automatically.

Presentation rules:

- Keep findings ahead of summary sections.
- Use plain-language impact statements.
- Distinguish optional advice clearly from required fixes.
- Acknowledge notable strengths briefly after the required findings, not before them.

---

## 5. PR AND PRE-COMMIT GUIDANCE

For PR review:

- Check for scope drift and call out unrelated changes that should be split.
- Assess contract and backward-compatibility risk for externally visible changes.
- Tie the overall recommendation to merge readiness.

For pre-commit or staged review:

- Focus on the staged diff or requested file set.
- Prioritize the fastest blocking feedback first.
- Keep remediation suggestions small and easy to apply before commit.

---

## 6. RELATED RESOURCES

- [review_core.md](./review_core.md) - Shared doctrine used by both interactive and deep review modes.
- [quick_reference.md](./quick_reference.md) - Lightweight index for the review reference set.
- [test_quality_checklist.md](../assets/test_quality_checklist.md) - Test quality and coverage checks for changed tests.

---


exec
/bin/zsh -lc "sed -n '1,180p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-code-review/references/review_core.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: Review Core Doctrine
description: Shared findings-first review doctrine for both single-pass and deep-review workflows.
trigger_phrases:
  - "findings first severity ordering"
  - "review finding schema"
  - "severity contract for merge decisions"
  - "evidence file line citation"
  - "baseline surface precedence"
  - "baseline check families"
importance_tier: important
contextType: implementation
version: 1.5.0.11
---

# Review Core Doctrine

Shared doctrine consumed by both `@review` and `@deep-review`.

---

## 1. OVERVIEW

Shared findings-first review doctrine for both single-pass and deep-review workflows.

---

## 2. SEVERITY DEFINITIONS

| Level | Meaning | Handling |
| --- | --- | --- |
| P0 | Blocker: exploitable security issue, auth bypass, destructive data loss | Block merge |
| P1 | Required: correctness bug, spec mismatch, must-fix gate issue | Fix before merge |
| P2 | Suggestion: non-blocking improvement, documentation polish, style or maintainability follow-up | Optional or schedule follow-up |

Escalation rule: if confidence is low but impact is high, classify toward the higher severity and state the uncertainty explicitly.

### Numeric Severity Calibration

Numeric scores are advisory context, not the gate. A reviewer may add an optional `riskScore` to a finding and adjust it by `+/-2` for local context such as exploitability, blast radius, user impact, confidence, or proven containment. The merge/block decision remains the severity contract above: `P0` blocks, `P1` requires remediation, and `P2` is advisory. Do not adopt `score>=4` or any numeric threshold as a blocker.

---

## 3. EVIDENCE REQUIREMENTS

- Every `P0` and `P1` finding must include a concrete `file:line` citation.
- Evidence must tie the finding to observed code behavior, not just a general concern.
- `P2` findings should still include specific evidence when available, even if impact is advisory.
- If evidence is incomplete, state the assumption and why the risk still matters.

---

## 4. FINDINGS OUTPUT ORDERING

- Present findings before summary or praise sections.
- Order findings by severity first: `P0`, then `P1`, then `P2`.
- Keep ordering stable within a severity bucket by impact and confidence.
- Separate required fixes from optional suggestions so merge decisions stay clear.

---

## 5. BASELINE + SURFACE PRECEDENCE

Apply this skill as the baseline first, then pair it with `sk-code` surface evidence when available:

- Detected code surface -> `sk-code:<surface>`
- Unclear surfaces -> baseline-only plus explicit uncertainty

Precedence rules:

- Baseline security and correctness minimums are always enforced.
- Surface style, process, build, and test conventions override generic baseline guidance.
- Unclear conflicts must be escalated rather than guessed.

---

## 6. BASELINE CHECK FAMILIES

Mandatory baseline families:

- Correctness minimums: regression risk, contract safety, spec mismatch, destructive side effects, and boundary handling.
- Security minimums: auth and authorization gaps, injection exposure, unsafe secrets handling, privilege misuse, and reliability risks with security impact.

These minimums cannot be relaxed by surface guidance.

---

## 7. FINDING SCHEMA

Each finding should provide:

| Field | Requirement |
| --- | --- |
| `id` | Stable label within the review report, such as `P1-001` |
| `severity` | One of `P0`, `P1`, `P2` |
| `title` | Short, risk-oriented summary |
| `file` | Primary `path:line` location |
| `evidence` | Plain-language explanation tied to observed code |
| `findingClass` | One of `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation` |
| `scopeProof` | Grep/test/audit evidence that the recommendation covers same-class sites and consumers, or proves the finding is instance-only |
| `affectedSurfaceHints` | Optional string array of producer/consumer surfaces the fix should address; recommended for actionable findings, required for cross-consumer findings. Use free-form short strings, max about 5 entries. Optional for instance-only findings. |
| `riskScore` | Optional advisory number for relative risk calibration; never gating and never a substitute for `severity` |
| `recommendation` | Specific, scope-proportional fix or follow-up |

Suggested shape:

```markdown
### P1-001 [P1] Missing authorization check
- File: path/to/file.ts:42
- Evidence: Request handling reaches the write path before role validation.
- Finding class: cross-consumer
- Scope proof: `rg -n "permission guard|write path" path/to` shows the write handler is the only unchecked consumer.
- Affected surface hints: ["request handler", "write path", "permission guard"]
- riskScore: 6 (advisory only)
- Recommendation: Enforce the existing permission guard before mutation.
```

---

## 8. RELATED RESOURCES

- [review_ux_single_pass.md](./review_ux_single_pass.md) - Interactive single-pass report flow and next-step prompts.
- [quick_reference.md](./quick_reference.md) - Lightweight index across baseline review references.
- [security_checklist.md](../assets/security_checklist.md) - Security and reliability checks.
- [code_quality_checklist.md](../assets/code_quality_checklist.md) - Correctness, KISS, DRY, and maintainability checks.

---

exec
/bin/zsh -lc "sed -n '1,140p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-code-review/assets/security_checklist.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: Security and Reliability Checklist
description: Structured risk checklist for security vulnerabilities, runtime reliability issues, and concurrent-behavior defects.
trigger_phrases:
  - "security review minimums"
  - "input output safety checks"
  - "authn authz review checklist"
  - "secrets and privacy review"
  - "concurrency race condition review"
  - "dependency supply chain audit"
importance_tier: normal
contextType: implementation
version: 1.5.0.9
---

# Security and Reliability Checklist

Structured risk checklist for security vulnerabilities, runtime reliability issues, and concurrent-behavior defects.

---

## 1. OVERVIEW

### Purpose

Help reviewers prioritize exploitability and business impact, not just code style.

### Usage

Apply on security-relevant diffs; classify each finding by exploitability and business impact, and cite file:line evidence.

### Core Principle

When impact is unclear, prefer conservative classification and state uncertainty explicitly.

---

## 2. INPUT/OUTPUT SAFETY

Check for:
- XSS via unsafe HTML rendering or template interpolation.
- SQL/NoSQL/command injection via string concatenation.
- SSRF through unvalidated user-controlled URLs.
- Path traversal from unchecked path input (`../`).
- Prototype pollution from unsafe object merge operations.

Review prompts:
- "What untrusted input reaches this sink?"
- "Is validation context-aware for this output channel?"

---

## 3. AUTHENTICATION AND AUTHORIZATION

Check for:
- Missing auth guards on newly added entry points.
- Missing ownership/tenant checks for read/write actions.
- Trust in client-supplied role flags or user IDs.
- IDOR patterns where entity IDs are accepted without authorization.
- Weak token/session validation (`exp`, `iss`, `aud`, algorithm checks).

High-impact rule: any missing authz control on data mutation is at least P1 and often P0.

---

## 4. SECRETS AND PRIVACY

Check for:
- Hardcoded credentials, API keys, tokens, private keys.
- Sensitive logs exposing PII or operational secrets.
- Internal stack traces or environment details in user-facing errors.
- Client-side exposure of server-only configuration values.

Quick command ideas:

```bash
rg -n -i "api[_-]?key|secret|token|password|BEGIN .* PRIVATE KEY"
```

---

## 5. RUNTIME RELIABILITY

Check for:
- Missing timeouts/retries for network dependencies.
- Unbounded loops, recursion, or memory growth.
- Blocking I/O on hot request paths.
- Regex patterns vulnerable to catastrophic backtracking (ReDoS).
- Missing idempotency keys for retry-prone write operations.

Review prompt:
- "What fails under load or partial network failure?"

---

## 6. CONCURRENCY AND RACE CONDITIONS

Flag patterns:
- Check-then-act without atomicity.
- Read-modify-write on shared state without lock/transaction.
- File/system operations split into non-atomic checks and actions.
- Counter updates without atomic increment semantics.
- Distributed coordination without lock/lease guarantees.

Examples:

```text
if not exists(key):
    create(key)

value = get(key)
value += 1
set(key, value)
```

Reviewer questions:
- "What happens if two requests hit this path at the same time?"
- "Is this update atomic across all failure modes?"

---

## 7. RATE LIMITING AND ABUSE PREVENTION

Check for:
- Missing rate limits on authentication endpoints (login, signup, password reset).
- Unthrottled API endpoints accepting expensive operations.
- Missing abuse vectors: account enumeration, credential stuffing, brute force.
- Lack of per-user or per-IP request budgets on public-facing routes.

Review prompt:
- "What stops an attacker from calling this endpoint 10,000 times per second?"

---

## 8. CONTENT SECURITY POLICY AND HEADERS

Check for:
- Missing or overly permissive CSP headers (`unsafe-inline`, `unsafe-eval`, wildcard sources).
- Missing security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`.
- CORS misconfiguration: wildcard origins, credentials with broad origins.

exec
/bin/zsh -lc "sed -n '1,140p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-code-review/assets/code_quality_checklist.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: Code Quality Checklist
description: Correctness, performance, and boundary-condition checklist for identifying production-impacting quality defects.
trigger_phrases:
  - "code quality review checklist"
  - "silent failure data corruption risks"
  - "boundary condition review pass"
  - "kiss dry enforcement checks"
  - "error handling review defects"
importance_tier: normal
contextType: implementation
version: 1.5.0.11
---

# Code Quality Checklist

Correctness, performance, and boundary-condition checklist for identifying production-impacting quality defects.

---

## 1. OVERVIEW

### Purpose

Provide a systematic pass for non-security defects that still cause outages, regressions, or high maintenance cost.

### Usage

Run this pass on every findings-first review; walk each section against the changed diff and cite file:line for anything flagged.

### Core Principle

Prioritize silent-failure and data-corruption risks above stylistic concerns.

---

## 2. ERROR HANDLING

Flag:
- Swallowed exceptions (`catch {}` or log-only catches).
- Overly broad exception handling hiding root causes.
- Missing async error propagation.
- User-facing leakage of internal stack traces.
- Missing fallback behavior for recoverable failures.

Review prompts:
- "Will callers know this failed?"
- "Is there enough context to debug without exposing internals?"

---

## 3. PERFORMANCE AND SCALING

Flag:
- N+1 query patterns.
- Per-item network/database calls that should be batched.
- Expensive work in hot loops without memoization/cache.
- Synchronous blocking work in request paths.
- Unbounded collections and memory growth risks.

Review prompts:
- "How does this behave with 10x data volume?"
- "Can this call path be batched or cached safely?"

---

## 4. BOUNDARY CONDITIONS

Check:
- Null/undefined handling and optional chaining misuse.
- Empty collection behavior for first/last/indexed access.
- Numeric boundaries (division by zero, overflow, negative values).
- String boundaries (empty, whitespace-only, very long input, unicode).
- Off-by-one errors in loops, pagination, and slicing.

Common risky patterns:

```javascript
const first = items[0]              // no empty check
const avg = total / count           // count may be zero
if (value) { /* skips valid 0 */ }  // truthy trap
```

---

## 5. DATA FLOW AND CONTRACT SAFETY

Flag:
- Function or method signature changes that break existing callers (added required parameters, removed parameters, changed return types).
- New null or undefined return paths introduced where callers expect a value.
- Data transformation functions that silently drop fields, truncate values, or lose type precision.
- Default parameter value changes that alter behavior for existing callers without updating call sites.
- Implicit behavioral contract changes (sort order, iteration order, timing guarantees) not documented in the diff.
- Public API response shape changes without versioning or migration path.

Review prompts:
- "If an existing caller is not updated, will it still work correctly after this change?"
- "Does any data transformation lose information that downstream consumers need?"
- "Are implicit behavioral guarantees (ordering, timing, idempotency) preserved?"

Severity guidance:
- P0 for breaking changes to public APIs or shared interfaces with no migration path.
- P1 for new null returns or type changes that existing callers do not handle.
- P2 for implicit contract changes with low blast radius.

---

## 6. MAINTAINABILITY SIGNALS

Watch for:
- Repeated logic with inconsistent behavior.
- Magic literals where domain constants are expected.
- Overly nested control flow reducing readability.
- Hidden coupling through global/shared mutable state.
- Tests missing for newly introduced edge cases.
- Functions exceeding 20 lines or 4+ nesting levels without structural justification.
- Deep method chaining across more than two object boundaries (Law of Demeter: a.b().c().d()).
- Functions that produce side effects not implied by their name or signature (Principle of Least Astonishment).
- Error messages that lack actionable context for debugging (missing what failed and what to try).
- TODO, FIXME, or HACK comments in production code paths without an associated tracking reference (issue link or ticket number).
- Hardcoded environment-specific values (URLs, ports, timeout thresholds) that should be externalized for deployment flexibility.
- Hand-rolled standard-library behavior where the language or runtime already provides a clear, readable primitive — prefer the standard API when behavior and edge cases match.
- Custom code or a dependency duplicating a native platform/runtime capability without a current requirement the native feature cannot satisfy.

Decision cue: if reviewers cannot explain intent quickly, maintenance risk is likely at least P2.

---

## 7. KISS / DRY ENFORCEMENT

### KISS Checks

Flag:
- New abstraction layers without a current behavior need.
- Generic helpers used in only one place.
- Workflow complexity introduced "for future flexibility" without evidence.
- Features, parameters, or configuration options added for speculative future use without a current requirement (YAGNI).
- New code not traceable to a current requirement (a feature, parameter, branch, or config that nothing in the stated scope asked for) — recommend removal (see removal_plan.md), not just simplification. Ask: was this asked for? If the requirement were dropped, would anything break? If not, it is a removal candidate. P2 by default per the severity rule below; escalate to P1 only when the unneeded code adds attack surface, contract obligations, or regression/maintenance risk.

### DRY Checks

codex
{"angle":"code-claim-verification","confirms":["GLM rec 1 is correct in behavior but path-corrected: the real `probeDaemon(socketPath, options)` is in `.opencode/bin/lib/launcher-ipc-bridge.cjs:150-236`; it builds a JSON-RPC `initialize` request at lines 159-168, writes it only for `deepProbe` at lines 197-203, and treats a matching JSON-RPC result/error reply as alive at lines 213-222.","GLM's no-bridge-socket inert branch is real in the live bridge module: `maybeBridgeLeaseHolder` computes `socketPath`, then if a non-TCP socket file is absent it writes `LEASE_HELD_BY ... (no-bridge-socket)` and returns `{action:'report', reason:'no-bridge-socket'}` at `.opencode/bin/lib/launcher-ipc-bridge.cjs:404-408`.","GLM's `leaseHeldFromFile` claim is correct: it extracts a recorded `socketPath`, but after `process.kill(lease.pid, 0)` succeeds it returns `held:true` with no socket existence or serving check at `.opencode/bin/mk-code-index-launcher.cjs:582-604`.","GLM's core liveness critique is correct: `classifyOwnerLease` checks PID liveness, EPERM, PPID orphaning, and heartbeat age, then returns `live-owner`; it does not inspect `socketPath` or probe the daemon at `.opencode/bin/mk-code-index-launcher.cjs:455-472`.","GLM's socket-gated-heartbeat recommendation is justified: after spawn, the launcher parent rewrites the owner lease to the child PID and starts a parent-owned heartbeat at `.opencode/bin/mk-code-index-launcher.cjs:973-982`; that heartbeat calls `refreshOwnerLeaseFile` without any socket probe at lines 394-407, and the refresh always stamps `lastHeartbeatIso` at lines 517-525.","GLM's statement that the reclaim path uses unlink plus exclusive create is correct: stale owner leases are unlinked at `.opencode/bin/mk-code-index-launcher.cjs:491-494`, and `writeOwnerLeaseFileExclusive` uses `fs.openSync(currentLeasePath, 'wx', 0o600)` at lines 351-358."],"refutes":[{"target":"GLM path citation `.opencode/bin/launcher-ipc-bridge.cjs`","problem":"The named top-level file is not the live source. The launcher requires `./lib/launcher-ipc-bridge.cjs`; GLM's line numbers match the lib file, not `.opencode/bin/launcher-ipc-bridge.cjs`.","evidence":".opencode/bin/mk-code-index-launcher.cjs:164-167"},{"target":"`probeDaemon` returning `{status, kind}` / normalized `enoent|econnrefused|timeout|json-rpc-reply`","problem":"Current `probeDaemon` returns `{status, reason}`. It has `json-rpc-reply` and `timeout`, but socket errors are raw `error.message` strings, not a normalized `kind` enum. A wrapper is still needed if callers require stable failure categories.","evidence":".opencode/bin/lib/launcher-ipc-bridge.cjs:179-184"},{"target":"GLM's abbreviated `classifyOwnerLease` state set: `stale-pid / stale-heartbeat-reclaim / unknown-eperm`","problem":"Incomplete. The real classifier also returns `ppid-1-orphan` and `live-owner`. Also, reclaim is implemented as 'anything except live-owner or unknown-eperm', not an explicit reclaimable allowlist.","evidence":".opencode/bin/mk-code-index-launcher.cjs:455-483"},{"target":"`unlink + O_EXCL` is an atomic CAS needing no CAS change","problem":"Overstated. `O_EXCL` ensures only one creator wins after unlink, but the code does not re-stat or compare the stale lease between classification and unlink. A successor lease written after the read can still be unlinked by path.","evidence":".opencode/bin/mk-code-index-launcher.cjs:476-494"},{"target":"Existing dead-socket respawn pipeline fully covers held PID leases","problem":"Not for the PID lease path. If `maybeBridgeLeaseHolder` returns `action:'respawn'` for a held `.mk-code-index-launcher.json` lease, `bridgeOrReportLeaseHeld` is called without `respawnChildPid`; `respawnAfterDeadSocket` then reports `missing-child-pid` instead of reaping/spawning.","evidence":".opencode/bin/mk-code-index-launcher.cjs:668-679"}],"gaps":["The incident case 'lease file gone but orphaned daemon PID alive' is still under-covered by current code. `reclaimedOrphanPid` is populated only when `acquireOwnerLeaseFile` actually reclaims an existing owner lease; if the owner lease vanished, there is no registry/lsof fallback to find the WAL holder before spawning. Evidence: `.opencode/bin/mk-code-index-launcher.cjs:1048-1067`.","There is no startup grace/deadline in the bridge decision. Missing socket reports forever at `.opencode/bin/lib/launcher-ipc-bridge.cjs:405-408`; existing-but-unresponsive sockets go to respawn after retry probes at lines 417-428, without checking spawn age.","Primary lease and owner lease safety are weaker than GLM's safety target: uid checking exists only for legacy PID lease paths, not primary PID lease, owner lease, or socket owner. Evidence: `.opencode/bin/mk-code-index-launcher.cjs:591-598`.","PID identity is not verified before signals. `reapOwnerBeforeRespawn` checks liveness, then sends SIGTERM/SIGKILL to the numeric PID without cmdline/start-time validation, so PID reuse remains a real safety gap. Evidence: `.opencode/bin/mk-code-index-launcher.cjs:640-665`.","WAL hygiene is not implemented in `initDb`: it sets `busy_timeout`, `journal_mode = WAL`, and `foreign_keys`, but no `wal_autocheckpoint`; checkpointing exists only in rollback recovery, not launcher startup or migration. Evidence: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1033-1040` and `.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:313-319`."],"new_recommendations":[{"change":"Add a real `probeExistingService(socketPath)` wrapper that first distinguishes absent socket, connect failure, timeout, and JSON-RPC reply, returning stable machine tokens.","where":".opencode/bin/lib/launcher-ipc-bridge.cjs:150-236","why":"`probeDaemon` has the right deep probe mechanics, but its current `reason` strings are not stable enough for reclaim policy or diagnostics."},{"change":"Add socket health and startup-age policy to both owner-lease and PID-lease classification, with a grace window before any reap and a hard deadline after which dead sockets become reclaimable.","where":".opencode/bin/mk-code-index-launcher.cjs:455-604","why":"The current classifiers prove PID/heartbeat only; that is the exact wedge class from the incident."},{"change":"Change the no-socket branch from unconditional `report` to a policy decision: report during startup grace, otherwise respawn/reclaim when owner identity and uid are safe.","where":".opencode/bin/lib/launcher-ipc-bridge.cjs:404-408 and .opencode/bin/mk-code-index-launcher.cjs:719-743","why":"A missing socket with a live owner is currently inert, so reconnect can keep surfacing failure instead of self-healing."},{"change":"Harden owner lease reclaim by re-reading/statting the lease before unlink, comparing owner PID/heartbeat/inode or using a mutation lock/rename-to-claim pattern.","where":".opencode/bin/mk-code-index-launcher.cjs:474-514","why":"Current unlink-by-path plus `O_EXCL` serializes creators after deletion but does not protect a fresh successor lease from being deleted."},{"change":"Record child PID identity and add PID-reuse checks before SIGTERM/SIGKILL; include uid checks for primary lease, owner lease, and socket path.","where":".opencode/bin/mk-code-index-launcher.cjs:640-665","why":"The design's safety layer is necessary; current code can signal a reused PID and only legacy PID leases get uid filtering."},{"change":"Add startup WAL hygiene: checkpoint/truncate oversized WAL when no writer is alive, set `wal_autocheckpoint=500` in `initDb`, and do not migrate/copy a giant WAL without checkpointing first.","where":".opencode/bin/mk-code-index-launcher.cjs:1102-1159 and .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1027-1040","why":"The incident included a 17MB orphaned WAL, and current startup/migration code can preserve that failure residue."}],"verdict":"sound-with-fixes"}
hook: Stop
hook: Stop Completed
tokens used
87,177
{"angle":"code-claim-verification","confirms":["GLM rec 1 is correct in behavior but path-corrected: the real `probeDaemon(socketPath, options)` is in `.opencode/bin/lib/launcher-ipc-bridge.cjs:150-236`; it builds a JSON-RPC `initialize` request at lines 159-168, writes it only for `deepProbe` at lines 197-203, and treats a matching JSON-RPC result/error reply as alive at lines 213-222.","GLM's no-bridge-socket inert branch is real in the live bridge module: `maybeBridgeLeaseHolder` computes `socketPath`, then if a non-TCP socket file is absent it writes `LEASE_HELD_BY ... (no-bridge-socket)` and returns `{action:'report', reason:'no-bridge-socket'}` at `.opencode/bin/lib/launcher-ipc-bridge.cjs:404-408`.","GLM's `leaseHeldFromFile` claim is correct: it extracts a recorded `socketPath`, but after `process.kill(lease.pid, 0)` succeeds it returns `held:true` with no socket existence or serving check at `.opencode/bin/mk-code-index-launcher.cjs:582-604`.","GLM's core liveness critique is correct: `classifyOwnerLease` checks PID liveness, EPERM, PPID orphaning, and heartbeat age, then returns `live-owner`; it does not inspect `socketPath` or probe the daemon at `.opencode/bin/mk-code-index-launcher.cjs:455-472`.","GLM's socket-gated-heartbeat recommendation is justified: after spawn, the launcher parent rewrites the owner lease to the child PID and starts a parent-owned heartbeat at `.opencode/bin/mk-code-index-launcher.cjs:973-982`; that heartbeat calls `refreshOwnerLeaseFile` without any socket probe at lines 394-407, and the refresh always stamps `lastHeartbeatIso` at lines 517-525.","GLM's statement that the reclaim path uses unlink plus exclusive create is correct: stale owner leases are unlinked at `.opencode/bin/mk-code-index-launcher.cjs:491-494`, and `writeOwnerLeaseFileExclusive` uses `fs.openSync(currentLeasePath, 'wx', 0o600)` at lines 351-358."],"refutes":[{"target":"GLM path citation `.opencode/bin/launcher-ipc-bridge.cjs`","problem":"The named top-level file is not the live source. The launcher requires `./lib/launcher-ipc-bridge.cjs`; GLM's line numbers match the lib file, not `.opencode/bin/launcher-ipc-bridge.cjs`.","evidence":".opencode/bin/mk-code-index-launcher.cjs:164-167"},{"target":"`probeDaemon` returning `{status, kind}` / normalized `enoent|econnrefused|timeout|json-rpc-reply`","problem":"Current `probeDaemon` returns `{status, reason}`. It has `json-rpc-reply` and `timeout`, but socket errors are raw `error.message` strings, not a normalized `kind` enum. A wrapper is still needed if callers require stable failure categories.","evidence":".opencode/bin/lib/launcher-ipc-bridge.cjs:179-184"},{"target":"GLM's abbreviated `classifyOwnerLease` state set: `stale-pid / stale-heartbeat-reclaim / unknown-eperm`","problem":"Incomplete. The real classifier also returns `ppid-1-orphan` and `live-owner`. Also, reclaim is implemented as 'anything except live-owner or unknown-eperm', not an explicit reclaimable allowlist.","evidence":".opencode/bin/mk-code-index-launcher.cjs:455-483"},{"target":"`unlink + O_EXCL` is an atomic CAS needing no CAS change","problem":"Overstated. `O_EXCL` ensures only one creator wins after unlink, but the code does not re-stat or compare the stale lease between classification and unlink. A successor lease written after the read can still be unlinked by path.","evidence":".opencode/bin/mk-code-index-launcher.cjs:476-494"},{"target":"Existing dead-socket respawn pipeline fully covers held PID leases","problem":"Not for the PID lease path. If `maybeBridgeLeaseHolder` returns `action:'respawn'` for a held `.mk-code-index-launcher.json` lease, `bridgeOrReportLeaseHeld` is called without `respawnChildPid`; `respawnAfterDeadSocket` then reports `missing-child-pid` instead of reaping/spawning.","evidence":".opencode/bin/mk-code-index-launcher.cjs:668-679"}],"gaps":["The incident case 'lease file gone but orphaned daemon PID alive' is still under-covered by current code. `reclaimedOrphanPid` is populated only when `acquireOwnerLeaseFile` actually reclaims an existing owner lease; if the owner lease vanished, there is no registry/lsof fallback to find the WAL holder before spawning. Evidence: `.opencode/bin/mk-code-index-launcher.cjs:1048-1067`.","There is no startup grace/deadline in the bridge decision. Missing socket reports forever at `.opencode/bin/lib/launcher-ipc-bridge.cjs:405-408`; existing-but-unresponsive sockets go to respawn after retry probes at lines 417-428, without checking spawn age.","Primary lease and owner lease safety are weaker than GLM's safety target: uid checking exists only for legacy PID lease paths, not primary PID lease, owner lease, or socket owner. Evidence: `.opencode/bin/mk-code-index-launcher.cjs:591-598`.","PID identity is not verified before signals. `reapOwnerBeforeRespawn` checks liveness, then sends SIGTERM/SIGKILL to the numeric PID without cmdline/start-time validation, so PID reuse remains a real safety gap. Evidence: `.opencode/bin/mk-code-index-launcher.cjs:640-665`.","WAL hygiene is not implemented in `initDb`: it sets `busy_timeout`, `journal_mode = WAL`, and `foreign_keys`, but no `wal_autocheckpoint`; checkpointing exists only in rollback recovery, not launcher startup or migration. Evidence: `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1033-1040` and `.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:313-319`."],"new_recommendations":[{"change":"Add a real `probeExistingService(socketPath)` wrapper that first distinguishes absent socket, connect failure, timeout, and JSON-RPC reply, returning stable machine tokens.","where":".opencode/bin/lib/launcher-ipc-bridge.cjs:150-236","why":"`probeDaemon` has the right deep probe mechanics, but its current `reason` strings are not stable enough for reclaim policy or diagnostics."},{"change":"Add socket health and startup-age policy to both owner-lease and PID-lease classification, with a grace window before any reap and a hard deadline after which dead sockets become reclaimable.","where":".opencode/bin/mk-code-index-launcher.cjs:455-604","why":"The current classifiers prove PID/heartbeat only; that is the exact wedge class from the incident."},{"change":"Change the no-socket branch from unconditional `report` to a policy decision: report during startup grace, otherwise respawn/reclaim when owner identity and uid are safe.","where":".opencode/bin/lib/launcher-ipc-bridge.cjs:404-408 and .opencode/bin/mk-code-index-launcher.cjs:719-743","why":"A missing socket with a live owner is currently inert, so reconnect can keep surfacing failure instead of self-healing."},{"change":"Harden owner lease reclaim by re-reading/statting the lease before unlink, comparing owner PID/heartbeat/inode or using a mutation lock/rename-to-claim pattern.","where":".opencode/bin/mk-code-index-launcher.cjs:474-514","why":"Current unlink-by-path plus `O_EXCL` serializes creators after deletion but does not protect a fresh successor lease from being deleted."},{"change":"Record child PID identity and add PID-reuse checks before SIGTERM/SIGKILL; include uid checks for primary lease, owner lease, and socket path.","where":".opencode/bin/mk-code-index-launcher.cjs:640-665","why":"The design's safety layer is necessary; current code can signal a reused PID and only legacy PID leases get uid filtering."},{"change":"Add startup WAL hygiene: checkpoint/truncate oversized WAL when no writer is alive, set `wal_autocheckpoint=500` in `initDb`, and do not migrate/copy a giant WAL without checkpointing first.","where":".opencode/bin/mk-code-index-launcher.cjs:1102-1159 and .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1027-1040","why":"The incident included a 17MB orphaned WAL, and current startup/migration code can preserve that failure residue."}],"verdict":"sound-with-fixes"}
