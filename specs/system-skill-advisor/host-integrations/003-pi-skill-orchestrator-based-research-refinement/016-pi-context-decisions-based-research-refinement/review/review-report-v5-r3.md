---
title: "Review Report: the system-skill-advisor logic at HEAD, generation 5"
description: "Three native passes over the advisor runtime and hooks code. FAIL from the coverage gate alone. Two active P1s (a one-skill scan wipes the live graph, the CLI trusts a foreign-owned socket dir), eight P2s, three search-debt rows, and a combined map of all eight passes across generations 4 and 5."
trigger_phrases:
  - "advisor logic review report"
  - "skill advisor deep review generation 5"
  - "skill graph scan deletes skills"
  - "advisor socket ownership check"
importance_tier: normal
contextType: review
---

# Review Report: the system-skill-advisor logic at HEAD, generation 5

<!-- ANCHOR:deep-review-advisor-logic-generation-5 -->

## 1. Executive Summary

- **Verdict:** FAIL. This is the output of `review-verdict.cjs`, and it binds.
- **hasAdvisories:** false. The flag is only set on a PASS.
- **Counts the verdict used:** P0 0, P1 2, P2 8. Search debt 3. Failed required gate ids: `coverage`. The script read the registry after the self-check. The self-check changed no severity, so these are also the counts every iteration reported.
- **What makes this a FAIL.** The script returns FAIL on an active P0 or a failed required gate. There is no P0. FAIL comes only from the `coverage` gate. The two P1s and the search debt would each give CONDITIONAL on their own. The `evidence` and `scope` gates passed.
- **Part 1, the coverage gate** (`traceability-incomplete`). The registry reports `gatingFailures: 1`. That one failure is the hard protocol `spec_code`, which sits at `partial`. `feature_catalog_code` is also partial, but it is advisory and does not gate. `spec_code` was judged against the tool descriptors and the in-code contracts. Two contradictions keep it partial:
  - The dispatch comment at `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts:324-326` says a call with no caller block sees an untrusted caller. The shipped launcher makes that call trusted (G5-I2-P2-001).
  - The empty-root guard at `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:921-922` states the intent to preserve the graph. A one-skill root deletes it anyway (G5-I1-P1-001).
  - To clear it: fix both, then a review pass records `spec_code` as `pass`. No review pass can clear it before the fixes land.
- **Part 2, the two P1s.** Each gives CONDITIONAL alone. Each clears when its fix lands and a later pass records it resolved.
  - G5-I1-P1-001: a trusted `skill_graph_scan` whose `skillsRoot` is one skill folder deletes every other skill and every edge from the live graph. Synthesis reproduced this on a copy of the database: 15 nodes and 59 edges went to 1 node and 0 edges.
  - G5-I2-P1-001: the advisor CLI and the hook fallback connect to a socket under the fixed `/tmp/system-skill-advisor` without checking who owns the directory. Another local account that plants the directory can receive every prompt and answer with forged routing.
- **Part 3, the search debt.** Three bug classes were deferred, not covered or ruled out:
  - `lifecycle_and_derived_defect_scan` (pass 1) and `handler_defect_scan` (pass 2). These are a bookkeeping gap more than unread code. Pass 2 read `cross-skill-edges/` and `query.ts`, and pass 3 read `status.ts` and `validate.ts`. No pass then recorded these two ids as covered or ruled out.
  - `playbook_capability` (pass 3). This overlay never ran.
  - To clear it: one more pass that records those three exact bug-class ids as covered or ruled out with evidence, and runs the `playbook_capability` overlay. That needs no code change.
- **Self-check outcomes.** The counts above already reflect them. No adjudication row was appended, because the Referee changed no severity.
  - G5-I1-P1-001: confirmed at P1. A probe on a throwaway copy of the database reproduced it.
  - G5-I2-P1-001: confirmed at P1. The case is rewritten, because the client connects to a hash-scoped subdirectory, not the bare directory.
  - G5-I2-P2-002: confirmed at P2 with a corrected claim. Its "not gitignored" claim is false. The file modes and the symlink gap still hold.
  - G5-I3-P2-002: confirmed at P2 with a narrowed case. The live scorer already demotes `deprecated` skills. The gap is a skill that sets `redirect_to` without that status.
  - The other six P2s were re-read at their cited lines and hold as written.
- **Review scope.** The target is the skill `.skilled/skills/system-skill-advisor`, limited to 154 source files under `runtime/` and `hooks/`. Tests, fixtures, benches and dist are excluded. The worktree HEAD is `4eda64f6c27`. The strategy names `82af76f6754`, but every cited line was re-read at the current HEAD. Dimensions were correctness, security, traceability and maintainability, and all four were covered. The run made 3 of 3 passes with a native Opus executor at medium effort and stopped on `maxIterationsReached`. Session `2026-11-23T21:41:17.101Z`, generation 5, lineage `restart`.
- **Operator review focus (verbatim):**

> The advisor's logic: runtime/ (lib, scorer, handlers, scripts including the Python fallback skill_advisor.py) and hooks/. Prose docs are out of scope unless code contradicts them.

## 2. Planning Trigger

`/speckit:plan` is required. The verdict is FAIL with two active P1s and one failed required gate. The two P1 fixes come first. WS-1 also clears half of the coverage gate. The other half needs the comment fix in WS-4, so WS-4's G5-I2-P2-001 item belongs in the first wave too. The P2s are advisories, grouped so a plan can take them in one pass. `fixCompletenessRequired` is true for three reasons. G5-I3-P2-001 means every fix to the fusion.ts predicates must land in the Python fallback in the same change. G5-I2-P1-001 has three client code paths that each need the owner check: the CLI, the bridge and the shim. The hook fallback reaches the daemon through the CLI. G5-I2-P2-001 repeats its false promise in four places: the server comment, the catalog, one playbook and one reference.

Dimensions below come from the iteration `findingDetails`. The reducer tags all ten registry entries as `correctness`, which is wrong for five of them.

**Planning Packet**

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "failedRequiredGateIds": ["coverage"],
  "searchDebtCount": 3,
  "activeFindings": [
    {"id": "G5-I1-P1-001", "severity": "P1", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:976", "title": "Scoped skill_graph_scan deletes every skill outside the scanned root and publishes the shrunken graph as live"},
    {"id": "G5-I2-P1-001", "severity": "P1", "dimension": "security", "file": ".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1097", "title": "CLI and hook fallback connect to a fixed /tmp socket without checking directory or socket ownership"},
    {"id": "G5-I1-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1190", "title": "RRF fusion scores used as weighted sums in confidence and command penalty"},
    {"id": "G5-I1-P2-002", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1254", "title": "Any slash in the prompt disables the skill-versus-command tie-break and breadth abstention"},
    {"id": "G5-I1-P2-003", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1462", "title": "Returned ambiguous flag recomputed on the doctor-inclusive list"},
    {"id": "G5-I1-P2-004", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1303", "title": "Low-information abstention counts stop words as meaningful tokens"},
    {"id": "G5-I2-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/skills/system-skill-advisor/runtime/advisor-server.ts:324", "title": "Daemon trust gate is a caller assertion; shipped launcher makes missing assertion trusted against the server comment"},
    {"id": "G5-I2-P2-002", "severity": "P2", "dimension": "security", "file": ".skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:136", "title": "Opt-in shadow sink appends raw prompts to a non-gitignored path without mode or symlink guard"},
    {"id": "G5-I3-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5038", "title": "Low-information and slash predicates hand-copied into the Python fallback with no shared fixture pinning them"},
    {"id": "G5-I3-P2-002", "severity": "P2", "dimension": "traceability", "file": ".skilled/skills/system-skill-advisor/runtime/lib/lifecycle/supersession.ts:39", "title": "Feature catalog presents supersession routing, rollback and v2 backfill as live behaviour, but only a stress test calls them"}
  ],
  "remediationWorkstreams": [
    {"id": "WS-1", "priority": "P1", "findings": ["G5-I1-P1-001"], "goal": "A narrow skillsRoot never deletes skills it did not scan, and the scan reports what it deleted"},
    {"id": "WS-2", "priority": "P1", "findings": ["G5-I2-P1-001"], "goal": "Every advisor client refuses a socket dir, scope subdir or socket node it does not own"},
    {"id": "WS-3", "priority": "P2", "findings": ["G5-I1-P2-001", "G5-I1-P2-002", "G5-I1-P2-003", "G5-I1-P2-004", "G5-I3-P2-001"], "goal": "Scorer predicate correctness in fusion.ts and its Python twin, pinned by shared fixture cases"},
    {"id": "WS-4", "priority": "P2", "findings": ["G5-I2-P2-001", "G5-I3-P2-002"], "goal": "Code comments and catalog entries state what the shipped code does"},
    {"id": "WS-5", "priority": "P2", "findings": ["G5-I2-P2-002"], "goal": "Shadow sink writes raw prompts with owner-only modes and no symlink follow"}
  ],
  "specSeed": [
    "skill_graph_scan with a skillsRoot that is not the full skills tree either refuses or deletes only nodes whose source_path lies under that root",
    "Every advisor IPC client verifies uid ownership and mode of the socket dir and scope subdir, and that the node is a socket, before it connects",
    "The low-information and slash predicates have one definition, or one shared fixture both languages must pass",
    "The trust gate's default is stated the same way in advisor-server.ts, the launcher and the feature catalog",
    "The lifecycle catalog names the modules that run on the live path"
  ],
  "planSeed": [
    "Guard indexSkillMetadata or handleSkillGraphScan against a root holding graph-metadata.json at its top, add a one-skill-root test, and print deletedNodes in the CLI text output",
    "Add lstat plus uid and mode checks to skill-advisor-cli.ts ensureSocketEnvironment, the bridge connect path and the .skilled/bin/skill-advisor.cjs shim, then add a foreign-owner test",
    "Fix fusion.ts at 1190, 1254, 1303 and 1462 and skill_advisor.py at 5038-5039 in one change, with shared stop-word and file-path cases in the parity corpus",
    "Correct advisor-server.ts:324-326 and feature-catalog/cli-surface/skill-advisor-cli.md:3,24, .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/cli-trusted-gate-refusal.md:16 and .skilled/skills/system-skill-advisor/references/graph/propagate-enhances.md:76, or drop the launcher default",
    "Correct feature-catalog/lifecycle-routing/supersession.md and rollback.md, or wire the modules into the live path",
    "Set 0700 and 0600 modes and O_NOFOLLOW in shadow-sink.ts",
    "Run one review pass that records spec_code, the three deferred bug classes and playbook_capability"
  ],
  "findingClasses": {
    "G5-I1-P1-001": "stale-or-destructive-state-on-rebuild",
    "G5-I2-P1-001": "missing-ownership-check-on-trust-boundary",
    "G5-I1-P2-001": "scale-mismatch",
    "G5-I1-P2-002": "over-broad-predicate",
    "G5-I1-P2-003": "invariant-violation",
    "G5-I1-P2-004": "miscount",
    "G5-I2-P2-001": "contract-comment-contradicts-shipped-config",
    "G5-I2-P2-002": "sensitive-data-at-rest",
    "G5-I3-P2-001": "hand-duplicated-logic-without-guard",
    "G5-I3-P2-002": "documented-capability-without-production-caller"
  },
  "affectedSurfacesSeed": {
    "G5-I1-P1-001": [".skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts", ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts", ".skilled/skills/system-skill-advisor/runtime/tools/skill-graph-tools.ts"],
    "G5-I2-P1-001": [".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts", ".skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts", ".skilled/bin/lib/launcher-ipc-bridge.cjs"],
    "G5-I1-P2-001": [".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"],
    "G5-I1-P2-002": [".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"],
    "G5-I1-P2-003": [".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts", ".skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts"],
    "G5-I1-P2-004": [".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"],
    "G5-I2-P2-001": [".skilled/skills/system-skill-advisor/runtime/advisor-server.ts", ".skilled/bin/system-skill-advisor-launcher.cjs", ".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts"],
    "G5-I2-P2-002": [".skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts"],
    "G5-I3-P2-001": [".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py", ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"],
    "G5-I3-P2-002": [".skilled/skills/system-skill-advisor/runtime/lib/lifecycle/supersession.ts", ".skilled/skills/system-skill-advisor/runtime/lib/lifecycle/rollback.ts", ".skilled/skills/system-skill-advisor/runtime/lib/lifecycle/schema-migration.ts", ".skilled/skills/system-skill-advisor/feature-catalog/lifecycle-routing/supersession.md"]
  },
  "fixCompletenessRequired": true
}
```

The packet is built from the iteration JSONL `findingDetails`. The registry entries carry `findingClass: null` and empty `affectedSurfaceHints`, so the registry alone could not fill these fields. Titles are copied verbatim from the registry. The G5-I2-P2-002 title is partly wrong, as section 3 explains.

## 3. Active Finding Registry

All paths are repo-relative under `.skilled/skills/system-skill-advisor/` unless a full path is given. Dedup ran on `content_hash = sha256(file + U+001F + line + U+001F + type + U+001F + title)`. The registry carries no hashes and no description text, so synthesis computed them from the delta records, using each title as the description. All ten hashes are distinct, so nothing merged. G5-I1-P2-002, G5-I1-P2-004 and G5-I3-P2-001 share a subject but sit at different file:line pairs. They stay separate and are fixed together in WS-3.

### G5-I1-P1-001. A one-skill scan root wipes the live skill graph

- **Severity:** P1, confirmed by the synthesis Referee. **Dimension:** correctness. **Disposition:** active, fix before merge. **Hash:** `b9bad270fcd28a78`.
- **File:line:** `runtime/lib/skill-graph/skill-graph-db.ts:976`, with the delete at `:745`.
- **Evidence:**
  - `handleSkillGraphScan` resolves any `skillsRoot` under the workspace (`runtime/handlers/skill-graph/scan.ts:44-51`) and passes it to `indexSkillMetadata` (`:53`).
  - Inside the transaction, `deleteMissingNodes(database, skillIds)` runs with only the ids found under that root (`skill-graph-db.ts:976`). It issues `DELETE FROM skill_nodes WHERE id NOT IN (...)` (`:745`).
  - The handler then publishes the generation as `state: 'live'` (`scan.ts:55-60`).
  - The scorer reads `skill_nodes` first and falls back to the filesystem only when the database is absent or throws (`runtime/lib/scorer/projection.ts:1395-1402`, `:1521-1525`).
  - The only guard covers zero discovered ids and says "preserving existing graph" (`skill-graph-db.ts:921-922`).
  - The CLI text renderer prints scanned, indexed and rejected counts, but not `deletedNodes` (`runtime/skill-advisor-cli.ts:980-993`). The loss is silent in the default output.
- **Probe (synthesis, on a copy):** `/private/tmp/dr530-synth5/probe-scan2.mjs` loaded the built indexer with `SYSTEM_SKILL_ADVISOR_DB_DIR` pointed at a copy of `runtime/database/skill-graph.sqlite`. Exit 0.
  - Before: 15 nodes, 59 edges.
  - After `indexSkillMetadata(.skilled/skills/sk-code)`: 1 node, 0 edges, `deletedNodes: 14`. sk-code's own 6 edges were rejected as UNKNOWN-TARGET.
  - After a full-root rescan: 15 nodes, 59 edges. Recovery is complete.
  - The real database kept its 22:01 mtime, earlier than the probe, and `git status` over the skill tree stayed empty.
- **Hunter, Skeptic, Referee:**
  - Hunter: the code path and the probe agree.
  - Skeptic: the tool is trusted-only (`scan.ts:35-38`). The tool description says it indexes "all .skilled/skills/*/graph-metadata.json" (`runtime/tools/skill-graph-tools.ts:23`). No shipped caller passes a narrow root. `create-sk-skill` passes the full root, and doctor, the sk-skill engine and the rebuild route pass none. A full-root rescan, the watcher's next full reindex or a daemon restart restores the graph.
  - Referee: P1 stands. The CLI exposes `--skills-root` to agents, and its schema calls it a "skills root to scan" (`skill-graph-tools.ts:28`). An agent that just authored one skill can plausibly scope the scan to it. Nothing rejects that root. The empty-root guard shows the authors meant to preserve the graph. The result is published as live, so routing collapses to one skill until something reindexes. It is not P0, because no source data is lost and a full rescan restores everything.
- **Impact:** after one mistaken trusted call, the advisor can route only to the scanned skill, with no edges, until a full reindex.
- **Fix:** refuse a root that holds a `graph-metadata.json` at its top, or limit the delete to nodes whose `source_path` lies under the scanned root. Print `deletedNodes` in the CLI text output. Add a one-skill-root test beside the empty-root test at `runtime/tests/skill-graph-handlers.vitest.ts:114-122`.
- **findingClass:** stale-or-destructive-state-on-rebuild. **scopeProof:** `scan.ts` and `skill-graph-db.ts` are in `reviewScopeFiles`. **affectedSurfaceHints:** `runtime/handlers/skill-graph/scan.ts`, `runtime/lib/skill-graph/skill-graph-db.ts`, `runtime/tools/skill-graph-tools.ts`.

### G5-I2-P1-001. Advisor clients trust a socket directory owned by another account

- **Severity:** P1, confirmed by the synthesis Referee with a rewritten case. **Dimension:** security. **Disposition:** active, fix before merge. **Hash:** `c0d7eefd82318eb3`.
- **File:line:** `runtime/skill-advisor-cli.ts:1097`.
- **Evidence:**
  - The CLI and the hook fallback default the socket dir to `/tmp/system-skill-advisor` (`runtime/skill-advisor-cli.ts:33`, `hooks/lib/skill-advisor-cli-fallback.ts:210`).
  - `ensureSocketEnvironment` calls `mkdirSync(..., { mode: 0o700 })`, which does nothing to an existing directory. It then rejects only group- or world-writable modes (`skill-advisor-cli.ts:1091-1101`). It never compares the owner uid.
  - The CLI connects through the bridge (`skill-advisor-cli.ts:1365`). On the default dir the bridge adds a scope subdirectory named from `sha256(realpath(dbDir))[:12]` (`.skilled/bin/lib/launcher-ipc-bridge.cjs:101-106`, `:138-150`). Nothing on the client side checks that subdirectory or the socket node.
  - The shim `.skilled/bin/skill-advisor.cjs:87-98` creates the same default dir and checks neither mode nor owner.
  - The shared server refuses a socket dir owned by another uid and names "an attacker-planted dir on a shared host" as the reason (`.skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:438-451`). The client half does not honour that threat model.
- **Hunter, Skeptic, Referee:**
  - Hunter: the client has no uid check anywhere before `net.createConnection` (`skill-advisor-cli.ts:1204-1207`).
  - Skeptic: most installs are single-user laptops. Sessions launched through `.skilled/bin/worktree-session.sh` export a per-user dir under `$HOME/.spk-wt-sock/` (`worktree-session.sh:273`, `:496`) and are not exposed. To intercept, the attacker must plant the hashed scope subdirectory, so they must know the victim's database path. Planting only the parent causes a denial of service, because the victim cannot create a subdirectory inside a 0755 directory it does not own. On the hook side, what comes back passes through `recommendationFromCli` and `sanitizeSkillLabel` (`hooks/lib/skill-advisor-cli-fallback.ts:363-398`, `runtime/lib/render.ts:163-179`). Only single-line labels and the command and policy fields reach the brief.
  - Referee: P1 stands. The default path, with no worktree wrapper, is the plain case, and `/tmp` is shared and mode 1777. The hash input is a deterministic repo path, often guessable on a shared host. The full prompt still leaks to the listener, and a forged `run` policy on a command still reaches the model as a routing instruction. The code's own server names this attacker as in scope. It is not P0, because it needs a second local account and must act before the owner's daemon binds, for example after a reboot clears `/tmp`.
- **Case (rewritten):** on a shared host, another account creates `/tmp/system-skill-advisor/<sha256(victim dbDir)[:12]>/daemon-ipc.sock` with a listener before the owner's first session. Every prompt hook then sends the full prompt to that listener and renders its forged recommendation. Planting only `/tmp/system-skill-advisor` blocks the owner's daemon from binding, so the advisor goes dark.
- **Fix:** before connecting, `lstat` the socket dir, the scope subdir and the socket node. Require the caller's uid, no group or world write bits, and a real socket. Apply this in `skill-advisor-cli.ts`, the bridge and the shim. Consider a per-user default, such as a dir under the 0700 database dir or `$TMPDIR` on macOS.
- **findingClass:** missing-ownership-check-on-trust-boundary. **scopeProof:** `skill-advisor-cli.ts` and `skill-advisor-cli-fallback.ts` are in `reviewScopeFiles`. The bridge, the shim and the shared server are context evidence. **affectedSurfaceHints:** `runtime/skill-advisor-cli.ts`, `hooks/lib/skill-advisor-cli-fallback.ts`, `.skilled/bin/lib/launcher-ipc-bridge.cjs`.

### G5-I1-P2-001. RRF scores are treated as weighted sums

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active. **Hash:** `b0ef6cd6d19fff55`.
- **File:line:** `runtime/lib/scorer/fusion.ts:1190`.
- **Evidence:** under the opt-in flag (`fusion.ts:166-168`, off by default), `score` is the RRF score (`:1189-1192`). It is divided by `liveTotal` (`:1208`) and meets the fixed `-0.08` command penalty (`:1254-1255`). With k=8 (`:84`), a rank-1 hit in a 0.4-weight lane scores about 0.044.
- **Impact:** with the flag on, a command candidate without a slash in the prompt loses to a skill even at rank 1 in every lane.
- **Fix:** rescale RRF scores into the weighted range, or give the RRF path its own penalty and thresholds.
- **findingClass:** scale-mismatch. **scopeProof:** `fusion.ts` is in scope. **affectedSurfaceHints:** `runtime/lib/scorer/fusion.ts`.

### G5-I1-P2-002. Any slash disables the tie-break and the breadth abstention

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active. **Hash:** `c7a5725fe7587e1f`.
- **File:line:** `runtime/lib/scorer/fusion.ts:1254`.
- **Evidence:** the command penalty applies only when `!promptLower.includes('/')` (`:1254-1255`). The Class C abstention (`:1360`) and the low-information gate (`:1308`) use the same test. A file path or "and/or" contains a slash.
- **Impact:** "refactor src/scorer/fusion.ts" drops the command penalty, so a command candidate can tie or beat the skill.
- **Fix:** use a typed-command predicate, a leading `/` followed by a known command, instead of any slash.
- **findingClass:** over-broad-predicate. **scopeProof:** `fusion.ts` is in scope. **affectedSurfaceHints:** `runtime/lib/scorer/fusion.ts`.

### G5-I1-P2-003. The returned ambiguous flag counts doctor bridges

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active. **Hash:** `73ba095dcd27371c`.
- **File:line:** `runtime/lib/scorer/fusion.ts:1462`.
- **Evidence:** the comment at `:1272-1273` says doctor bridges must not shape skill ambiguity. `ranked` is rebuilt with the bridges merged back in (`:1407-1421`). `ambiguous: isAmbiguousTopTwo(ranked)` then runs on that list (`:1462`). `ambiguousCluster` excludes only bridges the top skill owns (`runtime/lib/scorer/ambiguity.ts:50-61`, `:78-92`).
- **Impact:** a passing doctor bridge within the margin of the top skill sets `ambiguous: true` even though the doctor-free pass found one clear skill.
- **Fix:** compute the flag on the doctor-free list.
- **findingClass:** invariant-violation. **scopeProof:** `fusion.ts` and `ambiguity.ts` are in scope. **affectedSurfaceHints:** `runtime/lib/scorer/fusion.ts`, `runtime/lib/scorer/ambiguity.ts`.

### G5-I1-P2-004. Low-information abstention counts stop words

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active. **Hash:** `6934bcce19c99fcc`.
- **File:line:** `runtime/lib/scorer/fusion.ts:1303`.
- **Evidence:** `meaningfulTokenCount` keeps every whitespace token longer than one character (`:1304-1305`). The gate fires at three or fewer (`:1306`).
- **Impact:** "do it to me" counts 4 and escapes abstention, while "review it" counts 2. Strict callers get a routed answer for a prompt with no content.
- **Fix:** count meaningful tokens with the prompt policy's own stop-word measure. Fix the Python copy in the same change (G5-I3-P2-001).
- **findingClass:** miscount. **scopeProof:** `fusion.ts` is in scope. **affectedSurfaceHints:** `runtime/lib/scorer/fusion.ts`.

### G5-I2-P2-001. The trust default contradicts the dispatch comment

- **Severity:** P2. **Dimension:** security in the delta, type traceability. **Disposition:** active. **Hash:** `84c7a8ce1a5fc640`.
- **File:line:** `runtime/advisor-server.ts:324`.
- **Evidence:**
  - The launcher sets `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT: 'trusted'` (`.skilled/bin/system-skill-advisor-launcher.cjs:72-75`).
  - `resolveTrustedCaller` returns that default when `_meta` says nothing (`advisor-server.ts:248`). Its own comment at `:241-247` documents the opt-in.
  - The dispatch comment says a call without the caller block sees an untrusted caller, "so mutations stay refused" (`:324-326`). Under the launcher that is false.
  - The catalog repeats it. `feature-catalog/cli-surface/skill-advisor-cli.md:3` calls the gate "fail-closed". Two more doc lines that generation 4 found still read the same at HEAD: `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/cli-trusted-gate-refusal.md:16` says "a hand-rolled IPC client cannot skip the check", and `.skilled/skills/system-skill-advisor/references/graph/propagate-enhances.md:76` says "Untrusted callers receive an authentication error".
  - Any caller can assert `trusted: true` in `_meta` (`:238-240`), so the default adds no adversarial reach. The prompt-time refusal lives only in the CLI (`runtime/skill-advisor-cli.ts:747-779`). Hooks reach the daemon only through the CLI, so that is defence in depth.
- **Impact:** a cooperative client that sends `skill_graph_scan` with no `_meta` runs trusted, while the comment and the catalog say it is refused. This contradiction is one of the two that hold `spec_code` at partial.
- **Fix:** correct the comment, the catalog, the playbook line and the reference line to state the shipped default, or drop the launcher default and give each maintenance caller an explicit `_meta`. Pin the chosen behaviour with a test.
- **findingClass:** contract-comment-contradicts-shipped-config. **scopeProof:** `advisor-server.ts` is in scope. The launcher is context evidence. **affectedSurfaceHints:** `runtime/advisor-server.ts`, `.skilled/bin/system-skill-advisor-launcher.cjs`, `runtime/skill-advisor-cli.ts`.

### G5-I2-P2-002. The shadow sink writes raw prompts with default modes

- **Severity:** P2, confirmed with a corrected claim. **Dimension:** security. **Disposition:** active. **Hash:** `09066eb0d8065390`.
- **File:line:** `runtime/lib/shadow/shadow-sink.ts:136`.
- **Correction:** the registry title says the path is not gitignored. That is false. Pass 2 ran `git check-ignore` on `.skilled/skills/system-skill-advisor/data/shadow-deltas.jsonl`, a path the code never writes. From source, `defaultShadowDeltaPath` resolves to `runtime/data/shadow-deltas.jsonl` (`shadow-sink.ts:50-53`), which `.gitignore:212` ignores. From the built daemon it resolves under `runtime/dist/`, which `.gitignore:60` ignores. Synthesis ran `git check-ignore -v` on all three paths: exit 1, 0 and 0.
- **What still holds:**
  - `mkdirSync` and `appendFileSync` set no mode and no `O_NOFOLLOW` (`:135-139`). Under a 022 umask the log is readable by other local accounts.
  - The workspace check runs only for the env path (`:102-116`). Its `canonicalize` walks up to the first existing ancestor (`:76-90`), so a dangling symlink at the final name passes.
  - The sink is off by default (`:165-170`).
- **Impact:** with shadow mode on, raw prompts sit in a world-readable file under a common umask.
- **Fix:** create the directory 0700 and the file 0600 with `O_NOFOLLOW`, and reuse the owner contract that `hooks/lib/route-receipt.ts` already applies.
- **findingClass:** sensitive-data-at-rest. **scopeProof:** `shadow-sink.ts` is in scope. **affectedSurfaceHints:** `runtime/lib/shadow/shadow-sink.ts`.

### G5-I3-P2-001. The Python fallback hand-copies the slash and low-information predicates

- **Severity:** P2. **Dimension:** maintainability. **Disposition:** active. **Hash:** `37162c0031aba22d`.
- **File:line:** `runtime/scripts/skill_advisor.py:5038`.
- **Evidence:** `meaningful = [... if len(token) > 1]` and `"/" in prompt_lower` (`skill_advisor.py:5038-5039`) restate `fusion.ts:1303-1306` and `:1254-1255`. Python tokenizes with `\b\w+\b`, and TypeScript splits on whitespace. Nothing generates or pins this predicate. The deep-routing block is hash-pinned and the thresholds come from `runtime/schemas/compat-contract.json`.
- **Impact:** a fix to fusion.ts alone leaves the fallback routing differently, and the parity corpus has no stop-word-only or file-path case to catch it.
- **Fix:** move the predicate into shared data or add shared fixture cases that both suites must pass.
- **findingClass:** hand-duplicated-logic-without-guard. **scopeProof:** both files are in scope. **affectedSurfaceHints:** `runtime/scripts/skill_advisor.py`, `runtime/lib/scorer/fusion.ts`.

### G5-I3-P2-002. The catalog names dead lifecycle modules as live

- **Severity:** P2, confirmed with a narrowed case. **Dimension:** traceability. **Disposition:** active. **Hash:** `464abb48c8db84b2`.
- **File:line:** `runtime/lib/lifecycle/supersession.ts:39`.
- **Evidence:** `routeSupersession` (`supersession.ts:39`), `rollbackGraphMetadataFile` (`rollback.ts:60`), `backfillDerivedV2` and `readMixedVersion` (`schema-migration.ts:32`, `:45`) have no production caller. Their callers are two test files, `runtime/stress-test/skill-advisor/lifecycle-routing-stress.vitest.ts` and `runtime/tests/lifecycle-derived-metadata.vitest.ts`. The catalog says `supersession.ts` "demotes the superseded skill" (`feature-catalog/lifecycle-routing/supersession.md:22`) and that `rollback.ts` "reverts lifecycle metadata changes atomically" (`feature-catalog/lifecycle-routing/rollback.md:22`).
- **Narrowed case:** the live scorer already demotes a skill whose `lifecycle_status` is `deprecated` (`runtime/lib/scorer/fusion.ts:329-333`). It also carries `redirect_to` and `redirect_from` through the projection (`runtime/lib/scorer/projection.ts:1292-1295`, `fusion.ts:1237`). The gap is narrower than pass 3 stated. `routeSupersession` treats a skill that sets only `redirect_to` as deprecated (`supersession.ts:50`). The live path does not, so that skill still routes normally. Rollback and the v2 backfill have no live equivalent.
- **Impact:** the catalog points maintainers at modules the router never runs, and the two supersession rules disagree on `redirect_to`.
- **Fix:** correct the catalog to name the live code, or wire the modules into the projection. Decide whether `redirect_to` alone should demote.
- **findingClass:** documented-capability-without-production-caller. **scopeProof:** the lifecycle modules are in scope. The catalog lines are context evidence, cited because code contradicts them. **affectedSurfaceHints:** `runtime/lib/lifecycle/supersession.ts`, `runtime/lib/lifecycle/rollback.ts`, `runtime/lib/lifecycle/schema-migration.ts`, `feature-catalog/lifecycle-routing/supersession.md`.

## 4. Remediation Workstreams

1. **WS-1 (P1). Scan root safety, G5-I1-P1-001.**
   - Refuse a one-skill root, or scope the delete to the scanned root.
   - Print `deletedNodes` in the CLI text output.
   - Add a one-skill-root test.
   - This clears one P1 and one of the two `spec_code` contradictions.
2. **WS-2 (P1). Socket ownership, G5-I2-P1-001.**
   - Add the owner, mode and socket-type checks in the CLI, the bridge and the shim.
   - Consider a per-user default dir.
   - Add a foreign-owner test.
3. **WS-3 (P2). Scorer predicates in both languages:** G5-I1-P2-001 to G5-I1-P2-004 and G5-I3-P2-001. Fix fusion.ts and `skill_advisor.py` together, with shared fixture cases for stop words and file paths.
4. **WS-4 (P2). Comment and catalog truth:**
   - G5-I2-P2-001: fix the dispatch comment, the catalog, the playbook line and the reference line, or drop the launcher default. This clears the other `spec_code` contradiction. Schedule it with WS-1.
   - G5-I3-P2-002: fix the lifecycle catalog entries.
5. **WS-5 (P2). Shadow sink modes:** G5-I2-P2-002.

WS-1 and WS-2 come first. WS-4's G5-I2-P2-001 item joins the first wave, because the coverage gate needs it. WS-3 and WS-5 can run in any order.

## 5. Spec Seed

- `skill_graph_scan` never deletes a node it did not scan. A narrow root either fails or limits its delete to that root.
- Every advisor IPC client checks owner, mode and socket type before it connects. That means the CLI, the bridge and the shim. The hook fallback reaches the daemon through the CLI.
- The low-information and slash predicates have one definition, or one shared fixture that both the TypeScript scorer and the Python fallback must pass.
- The trust default is stated once and cited by the server comment, the launcher and the catalog.
- The feature catalog names the code that runs on the live path.
- The shadow log is created owner-only and never follows a symlink.

## 6. Plan Seed

1. Read `runtime/handlers/skill-graph/scan.ts:40-61` and `runtime/lib/skill-graph/skill-graph-db.ts:738-747`, `:859-976`. Add the root guard or the scoped delete. Extend `runtime/tests/skill-graph-handlers.vitest.ts` with a one-skill root.
2. Add `deletedNodes` to the scan text output at `runtime/skill-advisor-cli.ts:980-993`.
3. Add `lstat` and uid checks to `runtime/skill-advisor-cli.ts:1091-1101`, `.skilled/bin/lib/launcher-ipc-bridge.cjs` before connect, and `.skilled/bin/skill-advisor.cjs:87-98`. Add a test with a foreign-owned dir, or a mocked `stat`.
4. Fix `fusion.ts` at `:1190`, `:1254`, `:1303-1306`, `:1462` and `skill_advisor.py:5038-5039` in one change. Add parity cases for "do it to me" and "refactor src/a.ts".
5. Correct `runtime/advisor-server.ts:324-326` and `feature-catalog/cli-surface/skill-advisor-cli.md:3`, `:24`, `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/cli-trusted-gate-refusal.md:16` and `.skilled/skills/system-skill-advisor/references/graph/propagate-enhances.md:76`, or remove the launcher default at `.skilled/bin/system-skill-advisor-launcher.cjs:74`.
6. Correct `feature-catalog/lifecycle-routing/supersession.md:22` and `rollback.md:22`.
7. Set modes and `O_NOFOLLOW` in `runtime/lib/shadow/shadow-sink.ts:135-139`.
8. Run one review pass that records `spec_code`, `lifecycle_and_derived_defect_scan`, `handler_defect_scan` and `playbook_capability`. Fold in the generation-4 items listed as not rechecked in section 8.

## 7. Traceability Status

### Core protocols

| Protocol | Gate class | Status | Evidence | Unresolved drift |
|---|---|---|---|---|
| `spec_code` | hard | partial | Descriptors, manifest, status, validate and propagate-enhances match their contracts (`runtime/tests/skill-advisor-cli-manifest-parity.vitest.ts:21-31`, `runtime/handlers/skill-graph/status.ts:142-150`, `runtime/handlers/skill-graph/validate.ts:69-112`, `runtime/handlers/skill-graph/propagate-enhances.ts:44`). | Two contradictions: `runtime/advisor-server.ts:324-326` (G5-I2-P2-001) and `runtime/lib/skill-graph/skill-graph-db.ts:921-922` (G5-I1-P1-001). This is the one gating failure. |
| `checklist_evidence` | hard | notApplicable | The target is a skill code tree with no checklist rows. | None. |

### Overlay protocols

| Protocol | Gate class | Status | Evidence | Unresolved drift |
|---|---|---|---|---|
| `feature_catalog_code` | advisory | partial | All 123 `runtime/` and `hooks/` paths named across the 48 catalog files exist. The "9 commands" claim matches the manifest. | G5-I3-P2-002 (lifecycle) and G5-I2-P2-001 (the "fail-closed" gate). |
| `skill_agent` | advisory | notApplicable | No agent definition is in `reviewScopeFiles`. | None. |
| `agent_cross_runtime` | advisory | notApplicable | No agent file or runtime agent mirror is in the declared target. | None. |
| `playbook_capability` | advisory | not run | Deferred in pass 3 for budget (SL-305). | Owed by the next pass. Search debt. |

The registry summary reads required 2, executed 2, pass 0, partial 2, fail 0, blocked 0, notApplicable 3, gatingFailures 1.

### AC_COVERAGE

Exempt. The target type is `skill`. The deep-review skill applies the `AC_COVERAGE` signal only when the review target is a spec folder (`.skilled/skills/system-deep-loop/deep-review/SKILL.md:169`). Covered/total and floor do not apply.

### Resource map

`config.resource_map_present` is false. The spec folder has no `resource-map.md`, so the Resource Map Coverage Gate was skipped. `step_emit_resource_map` wrote `review/resource-map.md`. It lists 7 references, all under the skill, with 0 missing on disk.

## 8. Deferred Items

- **Generation-4 findings not rechecked.** These are not in this registry and do not count in the verdict. They were open at the end of generation 4 and nothing here closes them:
  - R3-P2-001: the contract-key header in `runtime/tools/advisor-contract-keys.ts:5-11` names consumers that do not exist.
  - R3-P2-002: the catalog cites the parity suite without the `runtime/` prefix. The catalog file is outside `reviewScopeFiles`.
  - R4-P2-002: `scoreAdvisorPrompt` has no stage seam (`runtime/lib/scorer/fusion.ts:1104`).
  - R4-P2-003: the Pi hook hard-copies the Claude budget (`hooks/pi/prompt-advisor.ts:22`).
  - R4-P2-004: the loop-owner confidence floor at `runtime/scripts/skill_advisor.py:4147` was not rechecked. Pass 3 covered only the prompt cap.
  - R4-P2-006: the Gate-3 question lookup swallows a load failure (`runtime/lib/policy-plan.ts:203`).
  - R5-P2-001: the corrupt-lock reclaim races a lock still being acquired (`runtime/lib/freshness/generation.ts:186`).
- **R1-P2-005, contested.** Generation 4 kept it at P2. Generation 5 ruled it out by citing the design comment at `fusion.ts:542-544`. That ruling does not test generation 4's case, where the top is a holder but not the binding one. Synthesis read `fusion.ts:520-558` and did not settle it.
- **Search debt.** `lifecycle_and_derived_defect_scan`, `handler_defect_scan` and `playbook_capability`. Section 9 has the detail.
- **Production-dead lifecycle code** beyond the catalog claim, such as the substring mention match at `runtime/lib/lifecycle/supersession.ts:33-36`, does not reach routing. It goes away if the modules are deleted.
- **Frontier.** The registry carries no `frontier` object, so no frontier node is listed.

## Dimension Expansion Map

- **Saturated directions:** none recorded. `divergence.saturatedDirections` is empty.
- **Completed and failed pivots:** none. `divergence.completed` and `divergence.failed` are empty.
- **Audited overrides:** none. **Council artifacts:** none.
- **Selected review directions, one per pass:**
  1. Correctness: the modules generation 4 never read, plus a recheck of the fusion.ts findings.
  2. Security plus Python/TypeScript parity: socket, trust default, shadow log, parity by test run, cross-skill-edges.
  3. Traceability and maintainability: spec_code, feature_catalog_code, duplication, and a recheck of all eight earlier findings.
- **Remaining frontier:** the reducer's `remainingFrontier` is empty. The practical frontier is the three debt classes and the generation-4 items in section 8.

## 9. Search Ledger

- **hasSearchDebt:** true. The verdict already counts it. On its own it gives CONDITIONAL. FAIL here comes from the coverage gate. If only the debt remained, the next step would be another `/deep:review` over the deferred classes, not `/speckit:plan`.
- **searchCoverage (latest pass):** required `contract_drift`, `duplication`, `dead_feature`, `trust_predicate`, `playbook_capability`. Covered `duplication`, `dead_feature`. Ruled out `contract_drift`, `trust_predicate`. Deferred `playbook_capability`. Mode `graphless_fallback`.
- **candidateCoverage:** 10 classes covered, 6 ruled out, 3 deferred, 0 blocked.
  - Covered: `dead_feature`, `duplication`, `invariant_violation`, `miscount`, `over_broad_predicate`, `scale_mismatch`, `sensitive_data_at_rest`, `socket_hijack`, `stale_state_on_rebuild`, `trust_default`.
  - Ruled out: `attribution`, `contract_drift`, `nan_propagation`, `path_traversal`, `python_ts_parity`, `trust_predicate`.

**searchDebt**

| Id | Pass | Bug class | Targets | Reason | Note |
|---|---|---|---|---|---|
| SL-008 | 1 | lifecycle_and_derived_defect_scan | `runtime/lib/cross-skill-edges/`, `handlers/skill-graph/status.ts`, `validate.ts`, `query.ts` | budget | All four targets were read later, in passes 2 and 3. Nothing recorded this id afterwards. |
| SL-206 | 2 | handler_defect_scan | `handlers/skill-graph/status.ts`, `validate.ts` | budget | Both read in pass 3 for `spec_code`. Nothing recorded this id afterwards. |
| SL-305 | 3 | playbook_capability | `runtime/tests/python/test_skill_advisor.py` | budget | Never run. |

**ruledOutCandidates and cleanSearchProof**

| Id | Pass | Bug class | Proof |
|---|---|---|---|
| SL-006 | 1 | attribution | The lowest-scored holder is the binding ceiling (`fusion.ts:545`). Contested, see section 8. |
| SL-007 | 1 | nan_propagation | The caller validates the timestamp (`runtime/lib/scorer/projection.ts:1334`). |
| SL-204 | 2 | python_ts_parity | vitest 206/206 in 9 files, Python 130/0. No disagreement inside the shared corpus. |
| SL-205 | 2 | path_traversal | Discovery skips symlinks, and the apply guard receives the root. |
| SL-301 | 3 | contract_drift | Handlers match their descriptors, and the manifest is test-pinned. |
| SL-304 | 3 | trust_predicate | The propagate-apply mismatch fails closed. |

**Findings by ledger row:** SL-001 G5-I1-P1-001, SL-002 G5-I1-P2-001, SL-003 G5-I1-P2-002, SL-004 G5-I1-P2-003, SL-005 G5-I1-P2-004, SL-201 G5-I2-P1-001, SL-202 G5-I2-P2-001, SL-203 G5-I2-P2-002, SL-302 G5-I3-P2-001, SL-303 G5-I3-P2-002.

## Across Both Generations

Generation 4 ran five DeepSeek passes. Generation 5 ran three Opus passes on a fresh registry. This table maps each generation-4 finding to its outcome here, so the eight passes read as one view. Only the generation-5 ids count in the verdict above.

| Gen-4 id | Gen-4 severity | Gen-5 outcome | Gen-5 id | Note |
|---|---|---|---|---|
| R2-P1-001 | P1 | Downgraded to P2 | G5-I2-P2-001 | Gen-4 synthesis rejected the downgrade (SL-505) because the shipped default breaks the fail-closed promise in one comment and two docs (a playbook and a reference). Both docs still read the same at HEAD. Gen-5 downgraded because any caller can assert trust itself (`advisor-server.ts:238-240`). Gen-4's own impact text conceded the default adds no capability. Synthesis agrees with P2. The defect is a false promise, not an access boundary. It still holds `spec_code` at partial. |
| R1-P2-001 | P2 | Re-recorded | G5-I1-P2-001 | Same RRF scale mismatch. |
| R1-P2-002 | P2 | Re-recorded | G5-I1-P2-002 | Same slash predicate. |
| R1-P2-003 | P2 | Re-recorded | G5-I1-P2-003 | Same doctor-inclusive ambiguity. |
| R1-P2-004 | P2 | Re-recorded | G5-I1-P2-004 | Same stop-word count. Its Python twin is the new G5-I3-P2-001. |
| R1-P2-005 | P2 | Ruled out, contested | none | Gen-5 pass 1 ruled it out as documented design. That ruling does not test gen-4's case. Open question, see section 8. |
| R2-P2-001 | P2 | Re-recorded | G5-I2-P2-002 | Same shadow-log modes. Gen-5 added a false gitignore claim, which synthesis corrected. |
| R2-P2-002 | P2 | Merged | G5-I2-P2-001 | The CLI-only prompt-time refusal is folded in as defence-in-depth evidence. |
| R3-P2-001 | P2 | Not rechecked | none | Contract-key header. |
| R3-P2-002 | P2 | Not rechecked | none | Gen-5's path sweep covered `runtime/` and `hooks/` paths only. The bad citation is a `tests/` path. |
| R4-P2-002 | P2 | Not rechecked | none | No stage seam in `scoreAdvisorPrompt`. |
| R4-P2-003 | P2 | Not rechecked | none | Pi budget copy. |
| R4-P2-004 | P2 | Partly rechecked | none | Pass 3 found the prompt cap pinned only by a literal in the Python test. The loop-owner floor was not rechecked. |
| R4-P2-006 | P2 | Not rechecked | none | Swallowed Gate-3 lookup failure. |
| R5-P2-001 | P2 | Not rechecked | none | Lock reclaim race. |
| R4-P2-001 | P2 | Closed false positive in gen 4 | none | Not reopened. |
| R4-P2-005 | P2 | Closed false positive in gen 4 | none | Not reopened. Gen-5 ran the parity suites, which pass. |

New in generation 5: G5-I1-P1-001, G5-I2-P1-001, G5-I3-P2-001 and G5-I3-P2-002.

Gen-4 ruled out "cross-user socket reach" (SL-014). That covered an attacker reaching the real daemon, which the 0700 directory and 0600 socket block. G5-I2-P1-001 is the reverse direction: a client reaching a planted listener. The two do not contradict.

Combined open set after eight passes: 2 P1 and 8 P2 confirmed at HEAD, 7 generation-4 P2s not rechecked, and 1 contested P2.

## 10. Audit Appendix

### Convergence summary

- Stop reason: `maxIterationsReached` after 3 of 3 passes. Convergence is telemetry only on this run.
- Convergence score 0.89. Graph score 0.875, graph decision `STOP_BLOCKED`. Its blocker reports dimension coverage at 50%, although all four dimensions were covered. That likely follows from the reducer tagging every finding `correctness`. This is inferred, not confirmed.
- New-findings ratio by pass: 1.0, 0.4375, 0.11.
- Terminal gates (state log, run 4): `evidence` passed with `all-findings-cited`. `scope` passed with `all-findings-in-scope`. `coverage` failed with `traceability-incomplete`.
- `claim_adjudication` gate rows: runs 1 and 2 failed with "Missing typed packet fields for new P0/P1 findings", for G5-I1-P1-001 and G5-I2-P1-001. Run 3 passed with `activeP0P1: 2` and `missingPackets: []`.

### Coverage summary

- All four dimensions were covered.
- Files listed per pass: 11, 11, 14.
- Parity suites ran in pass 2: vitest 206/206 in 9 files, Python 130/0.
- Gaps: the three debt classes and the generation-4 items in section 8.

### Ruled-out claims

- `heldBelow` single holder (contested) and age-haircut NaN (pass 1).
- Python/TypeScript disagreement inside the shared corpus, and symlink escape through cross-skill-edges apply (pass 2).
- Propagate-apply trust mismatch, `isError` loss in `toMCP`, and `STOP_WORDS` as duplicated vocabulary (pass 3).

### Self-check record

- Adjudications appended: none. The Referee confirmed both P1s and held all eight P2s at P2, so the registry the verdict read is unchanged.
- Probe: `/private/tmp/dr530-synth5/probe-scan2.mjs` ran on a copy of the database at `/private/tmp/dr530-synth5/db2`. An earlier node-only run used `db/`. Nothing in the repository was written. `git status --porcelain -- .skilled/skills/system-skill-advisor` was empty afterwards.
- G5-I2-P1-001 was confirmed by reading. No second local account was available. A two-account test, with one account planting the scoped directory, would confirm it.
- `review-verdict.cjs` printed the same result before the self-check, after it, and after the step 5 reducer refresh: FAIL, 0, 2, 8, search debt 3, `["coverage"]`.

### Contract defect in step_adversarial_selfcheck

The `step_adversarial_selfcheck` command in `.skilled/commands/deep/assets/deep-review.yaml` runs `node "$GATEWAY"` inside a `while read` loop fed by a heredoc. Node reads stdin and swallows the remaining pairs, so only the first pair is appended. This run appended no pairs, so the defect did not trigger. Generation 4 hit it. The fix is to add `</dev/null` to the gateway call inside the loop.

### Registry field gaps

- The ten `openFindings` entries carry `findingClass: null`, empty `affectedSurfaceHints`, `contentHash: null` and empty descriptions. This report fills those fields from the iteration `findingDetails`.
- Every entry is tagged `dimension: correctness`. The deltas show security for G5-I2-P1-001, G5-I2-P2-001 and G5-I2-P2-002, maintainability for G5-I3-P2-001, and traceability for G5-I3-P2-002.
- Iteration 1's record uses `run: "run-001"`. Iterations 2 and 3 use plain integers.

### Sources reviewed

- `review/iterations/iteration-001.md` to `iteration-003.md` and `review/deltas/iter-001.jsonl` to `iter-003.jsonl`.
- `review/deep-review-strategy.md`, `review/deep-review-findings-registry.json`, `review/deep-review-config.json` and `review/deep-review-state.jsonl`.
- Generation 4: `review-archive/2026-11-23T21-41-09Z/review-report.md` and its findings registry.
- Re-read at synthesis:
  - `runtime/handlers/skill-graph/scan.ts` in full
  - `runtime/lib/skill-graph/skill-graph-db.ts:225-258, 600-665, 735-750, 850-1000`
  - `runtime/tools/skill-graph-tools.ts:15-40`
  - `runtime/lib/scorer/projection.ts:1270-1310, 1390-1410, 1510-1545`
  - `runtime/skill-advisor-cli.ts:28-36, 975-995, 1085-1105, 1195-1215, 1425-1450`
  - `hooks/lib/skill-advisor-cli-fallback.ts:200-215, 360-400`
  - `runtime/lib/render.ts:155-186`
  - `.skilled/bin/skill-advisor.cjs:20-30, 78-100`
  - `.skilled/bin/lib/launcher-ipc-bridge.cjs:95-175, 395-410`
  - `.skilled/bin/worktree-session.sh:25-40, 273, 480-500`
  - `.skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:425-460`
  - every cited line of the eight P2s, plus `ambiguity.ts:40-100`, `fusion.ts:320-336, 520-562, 1395-1465` and `runtime/lib/lifecycle/supersession.ts:1-70`
  - every in-repo caller of `skill_graph_scan` in `.skilled/commands/`

### Core Protocols

- `spec_code`: partial, the one gating failure. It is tied to G5-I1-P1-001 and G5-I2-P2-001.
- `checklist_evidence`: notApplicable. The target has no checklist rows.

### Overlay Protocols

- `feature_catalog_code`: partial, advisory. It is tied to G5-I3-P2-002 and G5-I2-P2-001.
- `skill_agent` and `agent_cross_runtime`: notApplicable. No agent file is in the declared target.
- `playbook_capability`: not run. It is search debt (SL-305).

<!-- /ANCHOR:deep-review-advisor-logic-generation-5 -->
