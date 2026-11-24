---
title: "Review Report: the system-skill-advisor logic at HEAD, generation 5, extended to nine passes"
description: "Seven native passes over the advisor runtime and hooks code. FAIL from the coverage gate alone. Three active P1s (a one-skill scan wipes the live graph, the CLI trusts a foreign-owned socket dir, the hook metrics store follows a planted symlink in a shared temp dir), sixteen P2s, no search debt, and a map of every generation-4 finding to its generation-5 outcome."
trigger_phrases:
  - "advisor logic review report"
  - "skill advisor deep review generation 5"
  - "skill graph scan deletes skills"
  - "advisor socket ownership check"
  - "advisor metrics temp dir symlink"
importance_tier: normal
contextType: review
---

# Review Report: the system-skill-advisor logic at HEAD, generation 5, extended to nine passes

<!-- ANCHOR:deep-review-advisor-logic-generation-5 -->

## Verification Passes 8 and 9

The run was extended by two passes on cli-pi DeepSeek V4.1 Flash max to verify the fixes in `029-advisor-logic-review-fixes`. The operator chose this executor after ruling out native Opus. Both passes read the uncommitted fixed tree.

- **Verdict at this stop:** FAIL from `review-verdict.cjs`, which binds. Counts the verdict used: P0 0, P1 0, P2 4. Search debt 1. Failed required gate: `scope`. The `coverage` gate now passes.
- **Pass 8 (correctness)** confirmed all 19 registry findings fixed at the cause except one half of G5-I2-P2-002, which it carried. It raised G5-I8-P2-001: the Python fallback now crashed at import on a missing or malformed prompt-policy file. That regression came from the scorer fix.
- **Pass 9 (security)** closed G5-I8-P2-001 and G5-I2-P2-002 in its narrative and its classification rows. Its state record omits `resolvedFindings`, so the registry still lists both as open. It raised G5-I9-P2-001, where the shared private-folder check refused every folder on win32, and G5-I9-P2-002, where `owned-private-dir.ts` was untracked while tracked files import it.
- **Why the verdict is still FAIL.** The four open P2s are bookkeeping, not live defects. G5-I8-P2-001 and G5-I2-P2-002 were closed by pass 9, but its record does not say so. G5-I9-P2-001 was fixed after pass 9. G5-I9-P2-002 closes at commit. The `scope` gate fails because G5-I9-P2-001 sits in `owned-private-dir.ts`, a new file outside the frozen `reviewScopeFiles`.
- **Next.** The fixes are committed locally, and one more pass runs against the committed tree to record each closure.

## 1. Executive Summary (passes 1 to 7)

- **Verdict:** FAIL. This is the output of `review-verdict.cjs`, and it binds.
- **hasAdvisories:** false. The flag is only set on a PASS.
- **Counts the verdict used:** P0 0, P1 3, P2 16. Search debt 0. Failed required gate ids: `coverage`. The script read the registry after the self-check. The self-check changed no severity, so these are also the counts pass 7 reported. The script printed the same line before the self-check, after it and after the step-5 reducer refresh.
- **What makes this a FAIL.** The script returns FAIL on an active P0 or on a failed required gate. There is no P0. FAIL comes only from the `coverage` gate. The three P1s would give CONDITIONAL on their own. Search debt is now 0, so it adds nothing. The `evidence` and `scope` gates passed.
- **Part 1, the coverage gate** (`traceability-incomplete`). The registry reports `gatingFailures: 1`. That failure is the hard protocol `spec_code`, which sits at `partial`. The brief for this step named two contradictions. The passes recorded five. The registry shows only the last one, because the newest row per protocol wins. The five are:
  - `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts:324-326` says a call with no caller block sees an untrusted caller. The shipped launcher makes it trusted (G5-I2-P2-001, pass 2).
  - `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:921-922` states the intent to preserve the graph. A one-skill root deletes it anyway (G5-I1-P1-001, pass 1).
  - `.skilled/skills/system-skill-advisor/runtime/tools/advisor-contract-keys.ts:5-9` names consumers that do not exist (G5-I4-P2-001, pass 4).
  - `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:172` says only the owning user may read the logs. A foreign-owned folder defeats that (G5-I6-P1-001, pass 6).
  - `.skilled/skills/system-skill-advisor/runtime/lib/shared/shared-payload.ts:4-7` names a CI drift watcher that commit `da72e9676b0` removed (G5-I7-P2-001, pass 7).
  - To clear it: fix all five, then a review pass records `spec_code` as `pass`. Three of the five are P2 comment fixes. If only the P1s land, the gate stays failed and the verdict stays FAIL.
- **Part 2, the three P1s.** Each gives CONDITIONAL alone. Each clears when its fix lands and a later pass records it resolved. With the gate passed and no P1 left, the verdict becomes PASS with advisories.
  - G5-I1-P1-001: a trusted `skill_graph_scan` whose `skillsRoot` is one skill folder deletes every other skill and every edge from the live graph. The v5-r3 synthesis reproduced this on a copy of the database: 15 nodes and 59 edges went to 1 node and 0 edges.
  - G5-I2-P1-001: the advisor CLI and the hook fallback connect to a socket under the fixed `/tmp/system-skill-advisor` without checking who owns the directory. Another local account that plants the scoped directory can receive every prompt and answer with forged routing. The path is literal `/tmp`, so macOS is exposed too.
  - G5-I6-P1-001: the hook metrics store under `tmpdir()/speckit-skill-advisor-metrics` checks no owner. It keeps writing after a failed folder chmod, and its append and chmod follow a symlink at the file name. On a Linux host with a second account, another user can force an append to any file the victim owns and set that file to mode 0600. It is lower impact than G5-I2-P1-001 and is ranked after it.
- **Self-check outcomes.** The counts above already reflect them. No adjudication row was appended, because the Referee changed no severity.
  - G5-I1-P1-001: confirmed at P1. The cited lines read the same at HEAD `52f0bcb9a98`. The database-copy probe ran at `4eda64f6c27` and still stands.
  - G5-I2-P1-001: confirmed at P1 by reading. No second local account was available.
  - G5-I6-P1-001: confirmed at P1 at confidence 0.7. A new synthesis probe confirmed the fail-open step that iteration 6 could not run. Iteration 7's disclosure claim is corrected below. No routing consumer reads the records.
  - All 16 P2s: re-read at their cited lines and confirmed at P2. Several cites drifted with the HEAD change. Section 3 gives the current lines.
- **Review scope.** The target is the skill `.skilled/skills/system-skill-advisor`, limited to 154 source files under `runtime/` and `hooks/`. Tests, fixtures, benches and dist are excluded. Passes 1 to 3 read HEAD `4eda64f6c27`. Passes 4 to 7 and this synthesis read HEAD `52f0bcb9a98`. Dimensions were correctness, security, traceability and maintainability, and all four were covered. The run first stopped at 3 of 3 passes. It was then extended in place by 4 (lineage `completed-continue`, `extended` event) and stopped on `maxIterationsReached` after 7 of 7. The executor was native Opus at medium effort. Session `2026-11-23T21:41:17.101Z`, generation 5.
- **Operator review focus (verbatim):**

> The advisor's logic: runtime/ (lib, scorer, handlers, scripts including the Python fallback skill_advisor.py) and hooks/. Prose docs are out of scope unless code contradicts them.

## 2. Planning Trigger

`/speckit:plan` is required. The verdict is FAIL with three active P1s and one failed required gate. The first wave has three parts. The scan fix (WS-1) and the shared-temp ownership helper (WS-2) clear the three P1s and two of the five `spec_code` contradictions. The comment fixes in WS-3 clear the other three. Without WS-3 the gate stays failed. The remaining P2s are advisories, grouped so a plan can take each group in one pass.

`fixCompletenessRequired` is true for four reasons:
- G5-I3-P2-001 means every fix to the fusion.ts predicates must land in the Python fallback in the same change.
- G5-I2-P1-001 has three client code paths that each need the owner check: the CLI, the bridge and the shim.
- G5-I6-P1-001 shares its fix with the shadow sink (G5-I2-P2-002) and with the unregistered calibration store in section 8. One owner-checked helper should serve all of them.
- G5-I2-P2-001 repeats its false promise in four places: the server comment, the catalog, one playbook and one reference.

The fields below come from the iteration JSONL `findingDetails`. The registry entries carry `findingClass: null`, empty `affectedSurfaceHints` and `dimension: correctness` on all nineteen, so the registry alone could not fill these fields. Titles are copied verbatim from the registry. Two of them carry claims that section 3 corrects.

**Planning Packet**

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "failedRequiredGateIds": ["coverage"],
  "searchDebtCount": 0,
  "activeFindings": [
    {"id": "G5-I1-P1-001", "severity": "P1", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:976", "title": "Scoped skill_graph_scan deletes every skill outside the scanned root and publishes the shrunken graph as live"},
    {"id": "G5-I2-P1-001", "severity": "P1", "dimension": "security", "file": ".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1097", "title": "CLI and hook fallback connect to a fixed /tmp socket without checking directory or socket ownership"},
    {"id": "G5-I6-P1-001", "severity": "P1", "dimension": "security", "file": ".skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:171", "title": "Hook metrics store writes on every prompt into a shared temp folder with no owner, mode or symlink check, so another local user can redirect the append and chmod onto any victim-owned file"},
    {"id": "G5-I1-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1190", "title": "RRF fusion scores used as weighted sums in confidence and command penalty"},
    {"id": "G5-I1-P2-002", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1254", "title": "Any slash in the prompt disables the skill-versus-command tie-break and breadth abstention"},
    {"id": "G5-I1-P2-003", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1462", "title": "Returned ambiguous flag recomputed on the doctor-inclusive list"},
    {"id": "G5-I1-P2-004", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1303", "title": "Low-information abstention counts stop words as meaningful tokens"},
    {"id": "G5-I2-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/skills/system-skill-advisor/runtime/advisor-server.ts:324", "title": "Daemon trust gate is a caller assertion; shipped launcher makes missing assertion trusted against the server comment"},
    {"id": "G5-I2-P2-002", "severity": "P2", "dimension": "security", "file": ".skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:136", "title": "Opt-in shadow sink appends raw prompts to a non-gitignored path without mode or symlink guard"},
    {"id": "G5-I3-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5038", "title": "Low-information and slash predicates hand-copied into the Python fallback with no shared fixture pinning them"},
    {"id": "G5-I3-P2-002", "severity": "P2", "dimension": "traceability", "file": ".skilled/skills/system-skill-advisor/runtime/lib/lifecycle/supersession.ts:39", "title": "Feature catalog presents supersession routing, rollback and v2 backfill as live behaviour, but only a stress test calls them"},
    {"id": "G5-I4-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/tools/advisor-contract-keys.ts:6", "title": "Contract-key header names consumers that do not exist"},
    {"id": "G5-I4-P2-002", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1108", "title": "scoreAdvisorPrompt is a 366-line pipeline with no stage seam or ordering test"},
    {"id": "G5-I4-P2-003", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:22", "title": "Pi adapter hard-copies the Claude hook budget with no guard test"},
    {"id": "G5-I4-P2-004", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:52", "title": "Prompt cap and 0.82 confidence floors hard-coded in both TypeScript and Python"},
    {"id": "G5-I4-P2-005", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts:203", "title": "Gate-3 question lookup swallows a load failure"},
    {"id": "G5-I4-P2-006", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts:186", "title": "Corrupt-lock reclaim deletes a lock still being acquired"},
    {"id": "G5-I5-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:545", "title": "heldBelow names only the lowest holder, so a withheld holder leaves the held target free to make the top a coin flip"},
    {"id": "G5-I7-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-skill-advisor/runtime/lib/shared/shared-payload.ts:6", "title": "Local shared-payload copy names a drift watcher that does not exist, and the copies have already drifted"}
  ],
  "remediationWorkstreams": [
    {"id": "WS-1", "priority": "P1", "findings": ["G5-I1-P1-001"], "goal": "A narrow skillsRoot never deletes skills it did not scan, and the scan reports what it deleted"},
    {"id": "WS-2", "priority": "P1", "findings": ["G5-I2-P1-001", "G5-I6-P1-001", "G5-I2-P2-002"], "goal": "One owner, mode and lstat helper guards every advisor path in a shared temp dir: the socket clients first, then the metrics, shadow and calibration stores"},
    {"id": "WS-3", "priority": "gate", "findings": ["G5-I2-P2-001", "G5-I4-P2-001", "G5-I7-P2-001", "G5-I3-P2-002"], "goal": "Code comments and catalog entries state what the shipped code does, so spec_code can pass"},
    {"id": "WS-4", "priority": "P2", "findings": ["G5-I1-P2-001", "G5-I1-P2-002", "G5-I1-P2-003", "G5-I1-P2-004", "G5-I3-P2-001", "G5-I5-P2-001", "G5-I4-P2-002", "G5-I4-P2-004"], "goal": "Scorer predicate correctness in fusion.ts and its Python twin, pinned by shared fixture cases"},
    {"id": "WS-5", "priority": "P2", "findings": ["G5-I4-P2-003", "G5-I4-P2-005", "G5-I4-P2-006"], "goal": "Hook budget, policy lookup and generation lock fail loudly and stay in sync"}
  ],
  "specSeed": [
    "skill_graph_scan with a skillsRoot that is not the full skills tree either refuses or deletes only nodes whose source_path lies under that root",
    "Every advisor IPC client verifies uid ownership and mode of the socket dir and scope subdir, and that the node is a socket, before it connects",
    "Every advisor store under a temp dir refuses a folder it does not own, a group or world writable folder and a symlink at the folder or file name",
    "Every code comment that names a guarantee, a consumer or a CI guard names one that exists",
    "The low-information and slash predicates have one definition, or one shared fixture both languages must pass"
  ],
  "planSeed": [
    "Guard indexSkillMetadata or handleSkillGraphScan against a root holding graph-metadata.json at its top, add a one-skill-root test, and print deletedNodes in the CLI text output",
    "Extract the owner check in hooks/lib/route-receipt.ts:282-290 into a shared helper and call it from skill-advisor-cli.ts, the bridge, the shim, metrics.ts, shadow-sink.ts and feedback-calibration.ts",
    "Correct advisor-server.ts:324-326, advisor-contract-keys.ts:5-9 and shared-payload.ts:4-7, then run one review pass that records spec_code",
    "Fix fusion.ts and skill_advisor.py predicates in one change, with shared stop-word and file-path cases in the parity corpus",
    "Pin the Pi budget, the prompt cap and the 0.82 floors to one source, surface the Gate-3 lookup failure, and re-read the lock before a corrupt reclaim"
  ],
  "findingClasses": {
    "G5-I1-P1-001": "stale-or-destructive-state-on-rebuild",
    "G5-I2-P1-001": "missing-ownership-check-on-trust-boundary",
    "G5-I6-P1-001": "trust-boundary-defect",
    "G5-I1-P2-001": "scale-mismatch",
    "G5-I1-P2-002": "over-broad-predicate",
    "G5-I1-P2-003": "invariant-violation",
    "G5-I1-P2-004": "miscount",
    "G5-I2-P2-001": "contract-comment-contradicts-shipped-config",
    "G5-I2-P2-002": "sensitive-data-at-rest",
    "G5-I3-P2-001": "hand-duplicated-logic-without-guard",
    "G5-I3-P2-002": "documented-capability-without-production-caller",
    "G5-I4-P2-001": "documentation-contract-drift",
    "G5-I4-P2-002": "oversized-function-implicit-ordering",
    "G5-I4-P2-003": "hand-kept-duplicate-without-guard",
    "G5-I4-P2-004": "cross-language-duplicated-constant",
    "G5-I4-P2-005": "swallowed-failure",
    "G5-I4-P2-006": "lock-reclaim-race",
    "G5-I5-P2-001": "boundary-defect",
    "G5-I7-P2-001": "stale-guard-claim"
  },
  "affectedSurfacesSeed": {
    "G5-I1-P1-001": [".skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts", ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts", ".skilled/skills/system-skill-advisor/runtime/tools/skill-graph-tools.ts"],
    "G5-I2-P1-001": [".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts", ".skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts", ".skilled/bin/lib/launcher-ipc-bridge.cjs"],
    "G5-I6-P1-001": [".skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:171-176", ".skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:259-276", ".skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:299-326", ".skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:418-440", ".skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:505-520", ".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:283"],
    "G5-I1-P2-001": [".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"],
    "G5-I1-P2-002": [".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"],
    "G5-I1-P2-003": [".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts", ".skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts"],
    "G5-I1-P2-004": [".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"],
    "G5-I2-P2-001": [".skilled/skills/system-skill-advisor/runtime/advisor-server.ts", ".skilled/bin/system-skill-advisor-launcher.cjs", ".skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts"],
    "G5-I2-P2-002": [".skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts"],
    "G5-I3-P2-001": [".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py", ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"],
    "G5-I3-P2-002": [".skilled/skills/system-skill-advisor/runtime/lib/lifecycle/supersession.ts", ".skilled/skills/system-skill-advisor/runtime/lib/lifecycle/rollback.ts", ".skilled/skills/system-skill-advisor/runtime/lib/lifecycle/schema-migration.ts", ".skilled/skills/system-skill-advisor/feature-catalog/lifecycle-routing/supersession.md"],
    "G5-I4-P2-001": [".skilled/skills/system-skill-advisor/runtime/tools/advisor-contract-keys.ts", ".skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts"],
    "G5-I4-P2-002": [".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"],
    "G5-I4-P2-003": [".skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts", ".skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts"],
    "G5-I4-P2-004": [".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py", ".skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts", ".skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts"],
    "G5-I4-P2-005": [".skilled/skills/system-skill-advisor/runtime/lib/policy-plan.ts"],
    "G5-I4-P2-006": [".skilled/skills/system-skill-advisor/runtime/lib/freshness/generation.ts"],
    "G5-I5-P2-001": [".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:545-557", ".skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:68", ".skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts:153", ".skilled/skills/system-skill-advisor/runtime/lib/render.ts:301"],
    "G5-I7-P2-001": [".skilled/skills/system-skill-advisor/runtime/lib/shared/shared-payload.ts:1-45", ".skilled/skills/system-skill-advisor/runtime/lib/shared/shared-payload.ts:236-237"]
  },
  "fixCompletenessRequired": true
}
```

The packet copies the `findingDetails` fields as the passes wrote them, including two cites that have since drifted. The `file` lines for the iteration-1 fusion.ts findings and the `shared-payload.ts:236-237` hint are pass-time lines. Section 3 gives the lines at HEAD `52f0bcb9a98`. Pass 4 tagged all six of its findings `correctness`. By content, G5-I4-P2-002, G5-I4-P2-003 and G5-I4-P2-004 are maintainability and G5-I4-P2-001 is traceability. The packet keeps the recorded value.

## 3. Active Finding Registry

All paths are repo-relative under `.skilled/skills/system-skill-advisor/` unless a full path is given. Dedup ran on `content_hash = sha256(file + U+001F + line + U+001F + type + U+001F + normalized title)`. The registry carries no hashes and no description text, so synthesis computed them from the delta `findingDetails`. Type falls back to the dimension when it is null, and the title stands in for the description. The ten earlier hashes match the v5-r3 report exactly. All nineteen hashes are distinct, so nothing merged. The file:line fallback found no shared pair either. G5-I1-P2-002, G5-I1-P2-004 and G5-I3-P2-001 share a subject but sit at different file:line pairs. They stay separate and are fixed together in WS-4.

Line drift: passes 1 to 3 read HEAD `4eda64f6c27`. At `52f0bcb9a98` the fusion.ts lines below `:1108` moved down by 3 to 4. Every predicate reads the same. The current lines are given in each entry.

### G5-I1-P1-001. A one-skill scan root wipes the live skill graph

- **Severity:** P1, confirmed by the synthesis Referee. **Dimension:** correctness. **Disposition:** active, fix before merge. **Hash:** `b9bad270fcd28a78`.
- **File:line:** `runtime/lib/skill-graph/skill-graph-db.ts:976`, with the delete at `:745`.
- **Evidence:**
  - `handleSkillGraphScan` resolves any `skillsRoot` under the workspace (`runtime/handlers/skill-graph/scan.ts:44-51`) and passes it to `indexSkillMetadata` (`:53`).
  - Inside the transaction, `deleteMissingNodes(database, skillIds)` runs with only the ids found under that root (`skill-graph-db.ts:976`). It issues `DELETE FROM skill_nodes WHERE id NOT IN (...)` (`:745`).
  - The handler then publishes the generation as `state: 'live'` (`scan.ts:55-60`).
  - The only guard covers zero discovered ids and says "preserving existing graph" (`skill-graph-db.ts:921-922`).
  - The CLI text renderer prints scanned, indexed and rejected counts, but not `deletedNodes` (`runtime/skill-advisor-cli.ts:980-993`, per v5-r3).
- **Probe (v5-r3 synthesis, on a database copy, HEAD `4eda64f6c27`):** 15 nodes and 59 edges before. 1 node, 0 edges and `deletedNodes: 14` after `indexSkillMetadata(.skilled/skills/sk-code)`. A full-root rescan restored 15 and 59.
- **Hunter, Skeptic, Referee:**
  - Hunter: re-read `scan.ts:30-62` and `skill-graph-db.ts:740-748`, `:915-926` and `:970-980` at `52f0bcb9a98`. The code is unchanged.
  - Skeptic: the tool is trusted-only (`scan.ts:35-38`). No shipped caller passes a narrow root. A full rescan, the watcher or a restart restores the graph.
  - Referee: P1 stands. Pass 6 showed the trust gate passes every caller under the shipped launcher (G5-I2-P2-001). The schema advertises the parameter as "Optional skills root to scan" (`runtime/tools/skill-graph-tools.ts:28`), so an agent can plausibly scope it to one skill. The empty-root guard shows the authors meant to preserve the graph. Not P0, because no source data is lost.
- **Impact:** after one mistaken trusted call, the advisor routes only to the scanned skill, with no edges, until a full reindex.
- **Fix:** refuse a root that holds a `graph-metadata.json` at its top, or limit the delete to nodes whose `source_path` lies under the scanned root. Print `deletedNodes` in the CLI text output. Add a one-skill-root test beside the empty-root test at `runtime/tests/skill-graph-handlers.vitest.ts:114-122`.
- **findingClass:** stale-or-destructive-state-on-rebuild. **scopeProof:** `scan.ts` and `skill-graph-db.ts` are in `reviewScopeFiles`. **affectedSurfaceHints:** `runtime/handlers/skill-graph/scan.ts`, `runtime/lib/skill-graph/skill-graph-db.ts`, `runtime/tools/skill-graph-tools.ts`.

### G5-I2-P1-001. Advisor clients trust a socket directory owned by another account

- **Severity:** P1, confirmed by the synthesis Referee. **Dimension:** security. **Disposition:** active, fix before merge. **Hash:** `c0d7eefd82318eb3`.
- **File:line:** `runtime/skill-advisor-cli.ts:1097`.
- **Evidence:**
  - The CLI and the hook fallback default the socket dir to `/tmp/system-skill-advisor` (`runtime/skill-advisor-cli.ts:33`, `hooks/lib/skill-advisor-cli-fallback.ts:210`).
  - `ensureSocketEnvironment` calls `mkdirSync(..., { mode: 0o700 })`, which does nothing to an existing directory. It then rejects only group- or world-writable modes (`skill-advisor-cli.ts:1091-1101`). It never compares the owner uid.
  - On the default dir the bridge adds a scope subdirectory named from `sha256(realpath(dbDir))[:12]` (`.skilled/bin/lib/launcher-ipc-bridge.cjs:101-107`, `:138-150`). Nothing on the client side checks that subdirectory or the socket node before `net.createConnection` (`skill-advisor-cli.ts:1204-1207`).
  - The shared server refuses a socket dir owned by another uid and names "an attacker-planted dir on a shared host" as the reason (`.skilled/skills/system-spec-kit/shared/ipc/socket-server.ts:438-451`).
- **Hunter, Skeptic, Referee:**
  - Hunter: re-read `skill-advisor-cli.ts:30-35`, `:1086-1104`, `:1198-1212`, the fallback at `:205-213` and the bridge at `:95-175` at `52f0bcb9a98`. No uid, lstat or socket-type check exists.
  - Skeptic: most installs are single-user. Sessions launched through `.skilled/bin/worktree-session.sh` export a per-user dir. The attacker must compute the scoped subdirectory, which needs the victim's database path.
  - Referee: P1 stands. The path is literal `/tmp`, not `tmpdir()`, so it is shared on macOS as well as Linux. The hash input is a deterministic repo path. The listener reads the full prompt and can return a forged `run` policy that reaches the model as a routing instruction. The code's own server names this attacker as in scope. Not P0, because it needs a second local account and must act before the owner's daemon binds.
- **Case:** on a shared host, another account creates `/tmp/system-skill-advisor/<sha256(victim dbDir)[:12]>/daemon-ipc.sock` with a listener before the owner's first session. Every prompt hook then sends the full prompt to that listener and renders its forged recommendation. Planting only `/tmp/system-skill-advisor` blocks the owner's daemon from binding.
- **Fix:** before connecting, `lstat` the socket dir, the scope subdir and the socket node. Require the caller's uid, no group or world write bits, and a real socket. Apply this in `skill-advisor-cli.ts`, the bridge and the shim `.skilled/bin/skill-advisor.cjs`. Consider a per-user default dir.
- **findingClass:** missing-ownership-check-on-trust-boundary. **scopeProof:** `skill-advisor-cli.ts` and `skill-advisor-cli-fallback.ts` are in `reviewScopeFiles`. The bridge, the shim and the shared server are context evidence. **affectedSurfaceHints:** `runtime/skill-advisor-cli.ts`, `hooks/lib/skill-advisor-cli-fallback.ts`, `.skilled/bin/lib/launcher-ipc-bridge.cjs`.

### G5-I6-P1-001. The hook metrics store follows a planted symlink in a shared temp dir

- **Severity:** P1, confirmed by the synthesis Referee at confidence 0.7. Ranked below G5-I2-P1-001. **Dimension:** security. **Disposition:** active, fix before merge. **Hash:** `8911b56355feb97d`. New in pass 6.
- **File:line:** `runtime/lib/metrics.ts:171`.
- **Evidence:**
  - The store root is `join(tmpdir(), 'speckit-skill-advisor-metrics')` (`metrics.ts:171`). Each file name is the first 16 hex characters of `sha256(workspace path)` (`:278-287`), so it can be computed.
  - `ensureParentDir` runs `mkdir(..., { recursive: true, mode: 0o700 })`, which keeps an existing directory as it is. A failed `chmod(dir, 0o700)` only leaves `dirReady` false, and the write goes ahead (`:258-267`).
  - The write is `appendFile(path, ...)` and then `chmod(path, 0o600)` (`:308-309`, `:271-276`). Both follow a symlink at the final name. The file has no `lstat`, uid compare or `O_NOFOLLOW`.
  - The diagnostic writer runs on every Claude prompt with `requireDebug: false` (`:418-428`, `hooks/claude/user-prompt-submit.ts:49`, `:283`). The outcome writer runs when `advisor_validate` records an outcome (`runtime/handlers/advisor-validate.ts:660`).
  - The comment at `metrics.ts:172` says "only that user may read them". The sibling route-receipt store enforces owner, mode and symlink checks (`hooks/lib/route-receipt.ts:282-290`), and so does the lifecycle store (`hooks/lib/directive-lifecycle-store.py:38-69`).
- **Probe (synthesis, this step):** `/private/tmp/dr532-synth/probe.mjs` imported the built `runtime/dist/runtime/lib/metrics.js`, which is newer than its source. `TMPDIR` pointed at `/private/tmp/dr532-synth/t`. It patched `chmod` so the call on the metrics folder rejected with EPERM, the error a foreign-owned folder gives. A symlink at `<hash>-outcomes.jsonl` pointed at a 0644 victim file. One `persistAdvisorHookOutcomeRecord` call left the victim with the appended JSON line and mode 0600. Exit 0. This confirms the fail-open step through the built module. It is a simulated EPERM, not a two-account test.
- **Hunter, Skeptic, Referee:**
  - Hunter: the code path and both probes agree. Pass 6 showed the symlink follow. The synthesis probe showed that a rejected folder chmod does not stop the write.
  - Skeptic: on macOS `tmpdir()` is a per-user 0700 folder, so a single-user Mac is not exposed. The attacker does not choose the content. There is no prompt read, no routing forgery and no code execution.
  - Referee: P1 stands, at lower impact than G5-I2-P1-001. The deciding rule is reach calibration in `.skilled/skills/sk-code/sk-code-review/references/review-core.md` section 2. The reach is named: a Linux host with a shared `/tmp` and a second account, which is the threat model G5-I2-P1-001 already accepts. The code states a guarantee at `:172` and makes a guard, the folder chmod, that fails open. The doctrine keeps P1 when a stated guard fails for the input class it covers. The downgrade trigger, a runtime documented and enforced as macOS-only, is not met.
- **What the attacker gains, compared with G5-I2-P1-001:**
  - Here: a forced append of a closed-schema JSON line to any file the victim owns, plus a chmod of that file to 0600. That can break a parsed config such as `~/.ssh/config` or `~/.gitconfig`, which is a denial of service. Forged lines in the folder reach only the health sections of `advisor_status` and `advisor_validate`, and the outcome summary in `advisor_validate`.
  - G5-I2-P1-001: every prompt in full, and a forged routing brief in the model context. It is reachable on macOS too.
  - So the two share a threat model but not an impact class. That sets the order inside WS-2, not the tier.
- **Correction to pass 7:** pass 7 said a planted regular file shows the attacker "only timing, cache-hit and generation fields". That holds for diagnostic records. Outcome records always carry `skillLabel` (`metrics.ts:477-492`), and `persistAdvisorHookOutcomeRecord` writes them unstripped (`:505-512`). An attacker who plants a regular file they own therefore reads which skills the victim accepted or corrected. That is the data the `:172` comment promises to keep private.
- **No routing reach:** synthesis grepped `summarizeAdvisorHookOutcomeRecords`, `advisorHookOutcomesPath` and `readAdvisorHookOutcomeRecords` across `runtime/` and `hooks/`. The only consumer outside `metrics.ts` is `runtime/handlers/advisor-validate.ts:685-701`. It feeds `recordAdvisorFeedbackCalibrationIfEnabled`, which writes a shadow report only (`runtime/lib/scorer/weights-config.ts:35-36`, `liveWeightsFrozen: true`) and is off by default.
- **Fix:** reuse the owner, mode and symlink check from `hooks/lib/route-receipt.ts:282-290`. Refuse to write when the folder chmod fails. Open the file with `O_NOFOLLOW`, and write the trim temp file with `wx`.
- **findingClass:** trust-boundary-defect. **scopeProof:** `metrics.ts` and `user-prompt-submit.ts` are in `reviewScopeFiles`. Both probes wrote only under `/private/tmp`. **affectedSurfaceHints:** `runtime/lib/metrics.ts:171-176`, `:259-276`, `:299-326`, `:418-440`, `:505-520`, `hooks/claude/user-prompt-submit.ts:283`.

### G5-I1-P2-001. RRF scores are treated as weighted sums

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active. **Hash:** `b0ef6cd6d19fff55`.
- **File:line:** `runtime/lib/scorer/fusion.ts:1193-1195` at HEAD (pass 1 cited `:1190`).
- **Evidence:** under the opt-in flag (`:166-168`, off by default) `score` is the RRF score (`:1193-1195`). It is divided by `liveTotal` (`:1212`) and meets the fixed `-0.08` command penalty (`:1258-1259`). With k=8 (`:84`) a rank-1 hit in a 0.4-weight lane scores about 0.044.
- **Impact:** with the flag on, a command candidate without a slash in the prompt loses to a skill even at rank 1 in every lane.
- **Fix:** rescale RRF scores into the weighted range, or give the RRF path its own penalty and thresholds.
- **findingClass:** scale-mismatch. **scopeProof:** `fusion.ts` is in scope. **affectedSurfaceHints:** `runtime/lib/scorer/fusion.ts`.

### G5-I1-P2-002. Any slash disables the tie-break and the breadth abstention

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active. **Hash:** `c7a5725fe7587e1f`.
- **File:line:** `runtime/lib/scorer/fusion.ts:1258` at HEAD (pass 1 cited `:1254`).
- **Evidence:** the command penalty applies only when `!promptLower.includes('/')` (`:1258-1259`). The low-information gate (`:1312`) and the Class C abstention (`:1364`) use the same test. A file path or "and/or" contains a slash.
- **Impact:** "refactor src/scorer/fusion.ts" drops the command penalty, so a command candidate can tie or beat the skill.
- **Fix:** use a typed-command predicate, a leading `/` followed by a known command.
- **findingClass:** over-broad-predicate. **scopeProof:** `fusion.ts` is in scope. **affectedSurfaceHints:** `runtime/lib/scorer/fusion.ts`.

### G5-I1-P2-003. The returned ambiguous flag counts doctor bridges

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active. **Hash:** `73ba095dcd27371c`.
- **File:line:** `runtime/lib/scorer/fusion.ts:1466` at HEAD (pass 1 cited `:1462`).
- **Evidence:** the comment at `:1276-1277` says doctor bridges must not shape skill ambiguity. `ranked` is rebuilt with the bridges merged back in (`:1411-1426`). `ambiguous: isAmbiguousTopTwo(ranked)` then runs on that list (`:1466`).
- **Impact:** a passing doctor bridge within the margin of the top skill sets `ambiguous: true` although the doctor-free pass found one clear skill.
- **Fix:** compute the flag on the doctor-free list.
- **findingClass:** invariant-violation. **scopeProof:** `fusion.ts` and `ambiguity.ts` are in scope. **affectedSurfaceHints:** `runtime/lib/scorer/fusion.ts`, `runtime/lib/scorer/ambiguity.ts`.

### G5-I1-P2-004. Low-information abstention counts stop words

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active. **Hash:** `6934bcce19c99fcc`.
- **File:line:** `runtime/lib/scorer/fusion.ts:1308` at HEAD (pass 1 cited `:1303`).
- **Evidence:** `meaningfulTokenCount` keeps every whitespace token longer than one character (`:1308-1309`). The gate fires at three or fewer (`:1310`).
- **Impact:** "do it to me" counts 4 and escapes abstention, while "review it" counts 2.
- **Fix:** count meaningful tokens with the prompt policy's stop-word measure. Fix the Python copy in the same change (G5-I3-P2-001).
- **findingClass:** miscount. **scopeProof:** `fusion.ts` is in scope. **affectedSurfaceHints:** `runtime/lib/scorer/fusion.ts`.

### G5-I2-P2-001. The trust default contradicts the dispatch comment

- **Severity:** P2. **Dimension:** security in the delta, type traceability. **Disposition:** active. **Hash:** `84c7a8ce1a5fc640`.
- **File:line:** `runtime/advisor-server.ts:324`.
- **Evidence:** the launcher sets `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT: 'trusted'` (`.skilled/bin/system-skill-advisor-launcher.cjs:74`). `resolveTrustedCaller` returns that default when `_meta` says nothing (`advisor-server.ts:248`), and its comment at `:242-247` documents the opt-in. The dispatch comment says a call without the caller block sees an untrusted caller, "so mutations stay refused" (`:324-326`). Under the launcher that is false. The catalog, one playbook and one reference repeat it (`feature-catalog/cli-surface/skill-advisor-cli.md:3`, `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/cli-trusted-gate-refusal.md:16`, `.skilled/skills/system-skill-advisor/references/graph/propagate-enhances.md:76`). Any caller can assert trust itself (`:239-241`), so the default adds no adversarial reach.
- **Impact:** a cooperative client that sends `skill_graph_scan` with no `_meta` runs trusted, while the comment and the docs say it is refused. One of the five `spec_code` contradictions.
- **Fix:** correct the comment and the three doc lines, or drop the launcher default and give each maintenance caller an explicit `_meta`. Pin the chosen behaviour with a test.
- **findingClass:** contract-comment-contradicts-shipped-config. **scopeProof:** `advisor-server.ts` is in scope. **affectedSurfaceHints:** `runtime/advisor-server.ts`, `.skilled/bin/system-skill-advisor-launcher.cjs`, `runtime/skill-advisor-cli.ts`.

### G5-I2-P2-002. The shadow sink writes raw prompts with default modes

- **Severity:** P2, with a corrected claim carried from v5-r3. **Dimension:** security. **Disposition:** active. **Hash:** `09066eb0d8065390`.
- **File:line:** `runtime/lib/shadow/shadow-sink.ts:136`.
- **Correction:** the registry title says the path is not gitignored. That is false. `defaultShadowDeltaPath` resolves to `runtime/data/shadow-deltas.jsonl` from source and under `runtime/dist/` from the built daemon (`shadow-sink.ts:50-53`), and both are ignored. The v5-r3 synthesis checked all three paths with `git check-ignore -v`.
- **What still holds:** `mkdirSync` and `appendFileSync` set no mode and no `O_NOFOLLOW` (`:135-139`). The workspace check runs only for the env path (`:102-116`), and its `canonicalize` lets a dangling symlink pass (`:76-90`). The sink is off by default (`:165-170`).
- **Impact:** with shadow mode on, raw prompts sit in a world-readable file under a common umask.
- **Fix:** the WS-2 helper, with a 0700 folder, a 0600 file and `O_NOFOLLOW`.
- **findingClass:** sensitive-data-at-rest. **scopeProof:** `shadow-sink.ts` is in scope. **affectedSurfaceHints:** `runtime/lib/shadow/shadow-sink.ts`.

### G5-I3-P2-001. The Python fallback hand-copies the slash and low-information predicates

- **Severity:** P2. **Dimension:** maintainability. **Disposition:** active. **Hash:** `37162c0031aba22d`.
- **File:line:** `runtime/scripts/skill_advisor.py:5038`.
- **Evidence:** `meaningful = [... if len(token) > 1]` and `"/" in prompt_lower` (`skill_advisor.py:5038-5039`) restate `fusion.ts:1308-1312` and `:1258-1259`. Python tokenizes with `\b\w+\b`, and TypeScript splits on whitespace. Nothing generates or pins this predicate.
- **Impact:** a fix to fusion.ts alone leaves the fallback routing differently, and the parity corpus has no stop-word-only or file-path case to catch it. Pass 7 showed the divergence ratchet catches a routed effect only where the corpus reaches it.
- **Fix:** move the predicate into shared data, or add shared fixture cases both suites must pass.
- **findingClass:** hand-duplicated-logic-without-guard. **scopeProof:** both files are in scope. **affectedSurfaceHints:** `runtime/scripts/skill_advisor.py`, `runtime/lib/scorer/fusion.ts`.

### G5-I3-P2-002. The catalog names dead lifecycle modules as live

- **Severity:** P2, with the narrowed case carried from v5-r3. **Dimension:** traceability. **Disposition:** active. **Hash:** `464abb48c8db84b2`.
- **File:line:** `runtime/lib/lifecycle/supersession.ts:39`.
- **Evidence:** `routeSupersession` (`supersession.ts:39`), `rollbackGraphMetadataFile` (`rollback.ts:60`), `backfillDerivedV2` and `readMixedVersion` (`schema-migration.ts:32`, `:45`) have no production caller. Synthesis re-ran the caller grep. Only `runtime/stress-test/skill-advisor/lifecycle-routing-stress.vitest.ts` and `runtime/tests/lifecycle-derived-metadata.vitest.ts` call them. The catalog says `supersession.ts` "demotes the superseded" skill and `rollback.ts` "reverts lifecycle metadata changes atomically" (`feature-catalog/lifecycle-routing/supersession.md:22`, `rollback.md:22`).
- **Narrowed case:** the live scorer already demotes a `deprecated` skill (`runtime/lib/scorer/fusion.ts:329-333`). The gap is a skill that sets only `redirect_to`. `routeSupersession` treats it as deprecated (`supersession.ts:50`), and the live path does not.
- **Fix:** correct the catalog to name the live code, or wire the modules in. Decide whether `redirect_to` alone should demote.
- **findingClass:** documented-capability-without-production-caller. **scopeProof:** the lifecycle modules are in scope. The catalog lines are context evidence. **affectedSurfaceHints:** `runtime/lib/lifecycle/supersession.ts`, `rollback.ts`, `schema-migration.ts`, `feature-catalog/lifecycle-routing/supersession.md`.

### G5-I4-P2-001. The contract-key header names consumers that do not exist

- **Severity:** P2. **Dimension:** correctness as recorded, traceability by content. **Disposition:** active. **Hash:** `35629ea38f256db2`. Re-records generation-4 R3-P2-001.
- **File:line:** `runtime/tools/advisor-contract-keys.ts:6`.
- **Evidence:** the header at `:5-9` says the tuples feed `skill_advisor/tools/...` and an `ALLOWED_PARAMETERS` map in `schemas/tool-input-schemas.ts`. `runtime/schemas/` holds no such file (synthesis listed it). `ALLOWED_PARAMETERS` appears only in comments (`runtime/tools/advisor-recommend.ts:8`, `runtime/tools/advisor-validate.ts:8`).
- **Impact:** a maintainer who trusts the header expects a key added to the tuple to reach the input schema. It does not. One of the five `spec_code` contradictions.
- **Fix:** rewrite the header to name the real consumers, the descriptors in `runtime/tools/`.
- **findingClass:** documentation-contract-drift. **scopeProof:** the file is in scope. **affectedSurfaceHints:** `runtime/tools/advisor-contract-keys.ts`, `runtime/schemas/advisor-tool-schemas.ts`.

### G5-I4-P2-002. scoreAdvisorPrompt has no stage seam

- **Severity:** P2. **Dimension:** correctness as recorded, maintainability by content. **Disposition:** active. **Hash:** `4dc09564f5f31377`. Re-records R4-P2-002.
- **File:line:** `runtime/lib/scorer/fusion.ts:1108`.
- **Evidence:** the function runs from `:1108` to the end of the file at `:1474`. Its order-dependent withhold and handoff steps sit inline. No test or type pins their order.
- **Impact:** a withhold step inserted after the handoff step changes ranking, and no test fails.
- **Fix:** split the pipeline into named stages and pin their order with one test.
- **findingClass:** oversized-function-implicit-ordering. **scopeProof:** `fusion.ts` is in scope. **affectedSurfaceHints:** `runtime/lib/scorer/fusion.ts`.

### G5-I4-P2-003. The Pi adapter hard-copies the Claude hook budget

- **Severity:** P2. **Dimension:** correctness as recorded, maintainability by content. **Disposition:** active. **Hash:** `e39268792fb1da63`. Re-records R4-P2-003.
- **File:line:** `hooks/pi/prompt-advisor.ts:22`.
- **Evidence:** `PI_ADVISOR_DEFAULT_BUDGET_MS = 2500` and the env parse at `:30-34` mirror `DEFAULT_CLAUDE_HOOK_TIMEOUT_MS = 2500` at `hooks/claude/user-prompt-submit.ts:182` and its parse at `:248`. The comment at `:21` admits the mirror. No test names the Pi constant.
- **Impact:** if the Claude default rises, Pi's deadline fires inside the new budget and Pi drops briefs.
- **Fix:** move the default into a module both hooks can load, or add a test that compares the two values.
- **findingClass:** hand-kept-duplicate-without-guard. **scopeProof:** both hooks are in scope. **affectedSurfaceHints:** `hooks/pi/prompt-advisor.ts`, `hooks/claude/user-prompt-submit.ts`.

### G5-I4-P2-004. The prompt cap and the confidence floors are hard-coded in both languages

- **Severity:** P2. **Dimension:** correctness as recorded, maintainability by content. **Disposition:** active. **Hash:** `bc39dee4745bf338`. Re-records R4-P2-004, now with the loop-owner floor rechecked.
- **File:line:** `runtime/scripts/skill_advisor.py:52`.
- **Evidence:** `ADVISOR_PROMPT_MAX_CHARS = 10_000` sits at `skill_advisor.py:52` and `runtime/schemas/advisor-tool-schemas.ts:257`. `_LOOP_OWNER_CONFIDENCE_FLOOR = 0.82` at `skill_advisor.py:4147` mirrors the 0.82 floors at `runtime/lib/scorer/scoring-constants.ts:185-192`, and its comment at `:4144-4146` says so. The Python cap is pinned only by a literal at `runtime/tests/python/test_skill_advisor.py:1001`.
- **Impact:** a change to the TypeScript cap or floor leaves the fallback on the old value, so the two routes disagree.
- **Fix:** read both values from `runtime/schemas/compat-contract.json`, as the thresholds already are.
- **findingClass:** cross-language-duplicated-constant. **scopeProof:** both files are in scope. **affectedSurfaceHints:** `runtime/scripts/skill_advisor.py`, `runtime/schemas/advisor-tool-schemas.ts`, `runtime/lib/scorer/scoring-constants.ts`.

### G5-I4-P2-005. The Gate-3 question lookup swallows a load failure

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active. **Hash:** `1f9cf74b01f2154e`. Re-records R4-P2-006.
- **File:line:** `runtime/lib/policy-plan.ts:203`.
- **Evidence:** `currentGateQuestion` wraps `requireOwnerModule` for `spec-gate-core.mjs` in a bare catch that returns `undefined` (`:203-213`). Its only consumer is the `GATE_SPEC_FOLDER_QUESTION_ID` block (`:226-229`), which reads `undefined` as no content.
- **Impact:** if the owner module moves, every policy plan drops the Gate-3 question with no diagnostic.
- **Fix:** record a diagnostic on a load failure, and keep `undefined` for a module that loads without the export.
- **findingClass:** swallowed-failure. **scopeProof:** `policy-plan.ts` is in scope. **affectedSurfaceHints:** `runtime/lib/policy-plan.ts`.

### G5-I4-P2-006. The corrupt-lock reclaim deletes a lock still being acquired

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active. **Hash:** `1470ded00af7d9d2`. Re-records R5-P2-001.
- **File:line:** `runtime/lib/freshness/generation.ts:186`.
- **Evidence:** the lock is created with `openSync(lockPath, 'wx')` (`:154`) and its token is written in a second call (`:155`). An empty file parses as `token: null` (`:132-135`). The null branch removes the lock with no second read (`:186-189`), unlike the stale branch (`:172-184`).
- **Impact:** two processes in the window between `:154` and `:155` can both publish generation N+1. The reach is cross-process only.
- **Fix:** treat a null token like a stale one. Re-read after a short wait, and remove only when it is still empty and older than a bound.
- **findingClass:** lock-reclaim-race. **scopeProof:** `generation.ts` is in scope. **affectedSurfaceHints:** `runtime/lib/freshness/generation.ts`.

### G5-I5-P2-001. heldBelow names only the lowest holder

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active. **Hash:** `c6f85900bb965b13`. Settles generation-4 R1-P2-005.
- **File:line:** `runtime/lib/scorer/fusion.ts:545`.
- **Evidence:** a target held by two typed-command seeds is capped below the lower seed (`:529-541`). `heldBelow` records only that lower seed (`:545-557`). The cluster exception drops the target only when `heldBelow` names the passing top (`runtime/lib/scorer/ambiguity.ts:68`). `withholdMentionedCommands` sets `passes_threshold: false` on a merely mentioned command and keeps its score and its cap (`fusion.ts:1014-1026`).
- **Probe (pass 5):** in case C5 the lower holder is withheld, and the flag reads `ambiguous:true` against `ambiguousIfTargetExcluded:false`. The end-to-end prompt was not run, so reach past the withhold is inferred from `:1014-1026`.
- **Impact:** a target capped only by a withheld holder makes the top a reported coin flip.
- **Fix:** record the holder set, or bind the exception to the passing holder.
- **findingClass:** boundary-defect. **scopeProof:** `fusion.ts` and `ambiguity.ts` are in scope. **affectedSurfaceHints:** `runtime/lib/scorer/fusion.ts:545-557`, `runtime/lib/scorer/ambiguity.ts:68`, `runtime/lib/scorer/types.ts:153`, `runtime/lib/render.ts:301`.

### G5-I7-P2-001. The shared-payload copy names a drift watcher that does not exist

- **Severity:** P2. **Dimension:** maintainability. **Disposition:** active. **Hash:** `e2197984fc2f2693`. New in pass 7.
- **File:line:** `runtime/lib/shared/shared-payload.ts:6`.
- **Evidence:** the header says drift "is watched by .github/workflows/isolation-check.yml's reverse-direction audit" (`:4-7`). Synthesis listed `.github/workflows/` and found no isolation workflow. `git log -1` on that path returns `da72e9676b0`, the commit that removed it. A diff against `.skilled/skills/system-spec-kit/runtime/lib/context/shared-payload.ts` counts 115 changed lines. The advisor copy accepts the extra kinds `startup_brief` and `session_snapshot` at `:295-296` at HEAD (pass 7 cited `:236-237`), and the spec-kit copy has neither. No test under `runtime/tests` names the file.
- **Impact:** a fix to the spec-kit copy does not reach the advisor, while the header tells maintainers CI watches for drift. One of the five `spec_code` contradictions.
- **Fix:** correct the header, and add a content comparison test or name the real guard.
- **findingClass:** stale-guard-claim. **scopeProof:** `shared-payload.ts` is in scope. The spec-kit copy and the workflows folder are context. **affectedSurfaceHints:** `runtime/lib/shared/shared-payload.ts:1-45`, `:295-296`.

## 4. Remediation Workstreams

1. **WS-1 (P1). Scan root safety, G5-I1-P1-001.**
   - Refuse a one-skill root, or scope the delete to the scanned root.
   - Print `deletedNodes` in the CLI text output. Add a one-skill-root test.
   - Clears one P1 and one `spec_code` contradiction.
2. **WS-2 (P1). One owner-checked temp-dir helper:** G5-I2-P1-001, then G5-I6-P1-001, then G5-I2-P2-002.
   - Extract the check in `hooks/lib/route-receipt.ts:282-290` into a shared helper.
   - Socket clients first: the CLI, the bridge and the shim. That fix carries the higher impact.
   - Then the metrics store, the shadow sink and the unregistered calibration store from section 8.
   - Clears two P1s and the `metrics.ts:172` contradiction.
3. **WS-3 (gate). Comment and catalog truth:** G5-I2-P2-001, G5-I4-P2-001, G5-I7-P2-001 and G5-I3-P2-002.
   - The first three clear the last three `spec_code` contradictions. Schedule them in the first wave with WS-1 and WS-2.
   - G5-I3-P2-002 clears the advisory `feature_catalog_code` drift.
4. **WS-4 (P2). Scorer predicates in both languages:** G5-I1-P2-001 to G5-I1-P2-004, G5-I3-P2-001, G5-I5-P2-001, G5-I4-P2-002 and G5-I4-P2-004.
   - Fix `fusion.ts` and `skill_advisor.py` together, with shared fixture cases for stop words, file paths and a withheld holder.
5. **WS-5 (P2). Robustness and sync:** G5-I4-P2-003, G5-I4-P2-005 and G5-I4-P2-006.

WS-1, WS-2 and WS-3 make the first wave. Only all three together move the verdict off FAIL. WS-4 and WS-5 can follow in any order.

## 5. Spec Seed

- `skill_graph_scan` never deletes a node it did not scan. A narrow root either fails or limits its delete to that root.
- Every advisor IPC client checks owner, mode and socket type before it connects. That means the CLI, the bridge and the shim.
- Every advisor store under a temp dir refuses a folder it does not own, an open mode and a symlink at the folder or file name. A failed chmod stops the write.
- Every code comment that names a guarantee, a consumer or a CI guard names one that exists.
- The trust default is stated once and cited by the server comment, the launcher and the catalog.
- The low-information and slash predicates, the prompt cap and the confidence floors each have one definition, or one shared fixture both languages must pass.

## 6. Plan Seed

1. Read `runtime/handlers/skill-graph/scan.ts:40-61` and `runtime/lib/skill-graph/skill-graph-db.ts:738-747`, `:859-976`. Add the root guard or the scoped delete. Extend `runtime/tests/skill-graph-handlers.vitest.ts` with a one-skill root. Add `deletedNodes` to the text output at `runtime/skill-advisor-cli.ts:980-993`.
2. Extract the owner check from `hooks/lib/route-receipt.ts:282-290`. Call it from `runtime/skill-advisor-cli.ts:1091-1101`, `.skilled/bin/lib/launcher-ipc-bridge.cjs` before connect and `.skilled/bin/skill-advisor.cjs:87-98`. Add a foreign-owner test with a mocked `stat`.
3. Call the same helper from `runtime/lib/metrics.ts:258-276`, `runtime/lib/shadow/shadow-sink.ts:135-139` and `runtime/lib/scorer/feedback-calibration.ts:290-301`. Open with `O_NOFOLLOW`. Write the metrics trim temp file with `wx`. Add a test with a symlink at the file name.
4. Correct `runtime/advisor-server.ts:324-326` and its three doc echoes, `runtime/tools/advisor-contract-keys.ts:5-9` and `runtime/lib/shared/shared-payload.ts:4-7`. Correct `feature-catalog/lifecycle-routing/supersession.md:22` and `rollback.md:22`.
5. Run one review pass that records `spec_code` and the three P1s against the fixes.
6. Fix `fusion.ts` at `:1193-1195`, `:1258-1259`, `:1308-1312`, `:1364`, `:1466` and `:545-557`, and `skill_advisor.py:5038-5039`, in one change. Add parity cases for "do it to me", "refactor src/a.ts" and a withheld holder. Read the cap and the floors from `runtime/schemas/compat-contract.json`.
7. Pin the Pi budget to the Claude value, record a diagnostic in `policy-plan.ts:203-213`, and re-read before the null-token reclaim in `generation.ts:186-189`.

## 7. Traceability Status

### Core protocols

| Protocol | Gate class | Status | Evidence | Unresolved drift |
|---|---|---|---|---|
| `spec_code` | hard | partial | Descriptors, manifest, status, validate and propagate-enhances match their contracts (pass 3). Passes 4 to 7 reran it. | Five contradictions: `runtime/advisor-server.ts:324-326`, `runtime/lib/skill-graph/skill-graph-db.ts:921-922`, `runtime/tools/advisor-contract-keys.ts:5-9`, `runtime/lib/metrics.ts:172`, `runtime/lib/shared/shared-payload.ts:4-7`. This is the one gating failure. The registry row shows only the newest. |
| `checklist_evidence` | hard | notApplicable | The target is a skill code tree with no checklist rows. | None. |

### Overlay protocols

| Protocol | Gate class | Status | Evidence | Unresolved drift |
|---|---|---|---|---|
| `feature_catalog_code` | advisory | partial | All 123 `runtime/` and `hooks/` paths named across the 48 catalog files exist. The "9 commands" claim matches the manifest (pass 3). | G5-I3-P2-002 and G5-I2-P2-001. |
| `skill_agent` | advisory | notApplicable | No agent definition is in `reviewScopeFiles`. | None. |
| `agent_cross_runtime` | advisory | notApplicable | No agent file or runtime agent mirror is in the declared target. | None. |
| `playbook_capability` | advisory | pass | Pass 5 swept all 55 scenarios by name: 45 clean, 10 hits triaged. Spot reads at `runtime/handlers/advisor-recommend.ts:138-140` and `runtime/lib/advisor-disabled.ts:74-80`. | None in scope. One out-of-scope playbook cites a missing fixture path (section 8). |

The registry summary reads required 3, executed 3, pass 1, partial 2, fail 0, blocked 0, notApplicable 3, gatingFailures 1. `unfinishedCoreProtocols` is `["spec_code"]`.

### AC_COVERAGE

Exempt. The target type is `skill`. The deep-review skill applies the `AC_COVERAGE` signal only when the review target is a spec folder (`.skilled/skills/system-deep-loop/deep-review/SKILL.md:169`). Covered/total and floor do not apply. It does not change the verdict.

### Resource map

`config.resource_map_present` is false. The spec folder has no `resource-map.md`, so the Resource Map Coverage Gate was skipped. `step_emit_resource_map` rewrote `review/resource-map.md`. It lists 14 references and flags 1 as missing. That entry is `file:fusion.ts`, a graph node id from pass 5's delta, not a path. The real fusion.ts row is present and OK.

## 8. Deferred Items

- **An unregistered sibling of G5-I6-P1-001, found at synthesis.** `runtime/lib/scorer/feedback-calibration.ts:35` roots a second store at `tmpdir()/speckit-skill-advisor-calibration`. `persistAdvisorFeedbackCalibrationRecord` runs `mkdirSync` with no mode and then `writeFileSync` with no mode (`:290-301`). That follows a symlink at the file name and rewrites the target, which is stronger than an append. It runs only when `SPECKIT_ADVISOR_FEEDBACK_CALIBRATION_SHADOW` is set (`:178-183`), so it is opt-in, like the shadow sink. Synthesis does not add registry findings, so it is not counted. It belongs in WS-2. It also contradicts pass 6's ledger row SL-601, which says metrics.ts is the only temp-dir store without the owner rule. The next pass should register it.
- **The trust-boundary sweep skipped the offline scripts.** Several scripts under `runtime/scripts/` touch a temp dir, including `measure-brief-cost.mjs` and the `routing-accuracy/` capture scripts. They are operator tools, not hook paths, and no pass read their temp use.
- **Uncited scope files.** Pass 7 counted 95 of 154 scope files uncited by any narrative. It scanned the five largest by header, catch site and function length. `derive-command-bridges.cjs` and `skill_graph_compiler.py` still lack a line-by-line read, and 90 more files remain uncited.
- **R3-P2-002.** It holds, but the cited catalog file is outside `reviewScopeFiles`, so pass 4 did not register it. The same kind of doc drift shows in `manual-testing-playbook/operator-h5/degraded-daemon.md:139`, which cites a missing `.opencode/...` fixture path (pass 5).
- **Publish after commit.** `indexSkillMetadata` commits before `publishSkillGraphGeneration` can throw on a lock timeout. Pass 4 showed the prompt cache keys on `sourceSignature`, so it ruled this harmless to the cache. A test that forces a lock timeout and then reads `advisor_status` would settle it.
- **Production-dead lifecycle weak spots.** The all-or-nothing reject at `runtime/lib/derived/anti-stuffing.ts:58-67` and the substring match at `runtime/lib/lifecycle/supersession.ts:33-37` reach no live route. They go away with G5-I3-P2-002.
- **Frontier.** The registry carries no `frontier` object, so no frontier node is listed.

## Dimension Expansion Map

- **Saturated directions:** none recorded. `divergence.saturatedDirections` is empty.
- **Completed and failed pivots:** none. `divergence.completed` and `divergence.failed` are empty.
- **Audited overrides:** none. **Council artifacts:** none.
- **Selected review directions, one per pass:**
  1. Correctness: the modules generation 4 never read, plus a recheck of the fusion.ts findings.
  2. Security plus Python/TypeScript parity: socket, trust default, shadow log, parity by test run, cross-skill-edges.
  3. Traceability and maintainability: `spec_code`, `feature_catalog_code`, duplication, and a recheck of all eight earlier findings.
  4. Correctness: the deferred lifecycle and handler scans, plus the seven generation-4 P2s v5-r3 left unrechecked.
  5. Traceability: the `playbook_capability` overlay, a `spec_code` rerun, and a probe that settled R1-P2-005.
  6. Security: a trust-boundary scan of every temp-dir writer, the Python twin of G5-I5-P2-001, and a mitigation recheck of both P1s.
  7. Maintainability: a Skeptic pass on G5-I6-P1-001, seed-bound parity, and a sweep of the largest uncited files.
- **Remaining frontier:** the reducer's `remainingFrontier` is empty. The practical frontier is the items in section 8.

## 9. Search Ledger

- **hasSearchDebt:** false. `searchDebt` is empty. The three v5-r3 debt rows (SL-008, SL-206, SL-305) were cleared by SL-401, SL-402 and SL-501.
- **searchCoverage (latest pass):** required `severity_recheck`, `python_ts_parity`, `unread_module_sweep`. Covered `unread_module_sweep`. Ruled out `severity_recheck` and `python_ts_parity`. Deferred none. Blocked none. Mode `graphless_fallback`.
- **candidateCoverage:** 14 classes covered, 13 ruled out, 0 deferred, 0 blocked.
  - Covered: `boundary_defect`, `dead_feature`, `duplication`, `gen4_p2_recheck`, `invariant_violation`, `miscount`, `over_broad_predicate`, `scale_mismatch`, `sensitive_data_at_rest`, `socket_hijack`, `stale_state_on_rebuild`, `trust_boundary_scan`, `trust_default`, `unread_module_sweep`.
  - Ruled out: `attribution`, `contract_drift`, `handler_defect_scan`, `lifecycle_and_derived_defect_scan`, `nan_propagation`, `p1_recheck_mitigation`, `path_traversal`, `playbook_capability`, `python_ts_parity`, `python_twin_held_below`, `severity_recheck`, `spec_code_contradiction`, `trust_predicate`.

**ruledOutCandidates and cleanSearchProof** (14 rows in each)

| Id | Pass | Bug class | Proof |
|---|---|---|---|
| SL-006 | 1 | attribution | The lowest holder binds the ceiling. Pass 5 settled the open part as G5-I5-P2-001. |
| SL-007 | 1 | nan_propagation | The caller validates the timestamp (`runtime/lib/scorer/projection.ts:1334`). |
| SL-204 | 2 | python_ts_parity | vitest 206/206 in 9 files, Python 130/0. |
| SL-205 | 2 | path_traversal | Discovery skips symlinks, and the apply guard receives the root. |
| SL-301 | 3 | contract_drift | Handlers match their descriptors, and the manifest is test-pinned. |
| SL-304 | 3 | trust_predicate | The propagate-apply mismatch fails closed. |
| SL-401 | 4 | lifecycle_and_derived_defect_scan | Searched clean on the serving path. Off-path weak spots fold into G5-I3-P2-002. |
| SL-402 | 4 | handler_defect_scan | Rebuild and scan read in full. The other handlers were covered by an error-site grep, not line by line. |
| SL-501 | 5 | playbook_capability | Every named capability resolves to code. A name sweep, not a scenario run. |
| SL-503 | 5 | spec_code_contradiction | No new contradiction in pass 5. Passes 6 and 7 later added two. |
| SL-602 | 6 | python_twin_held_below | Neither the cap nor a withheld holder exists in Python. |
| SL-603 | 6 | p1_recheck_mitigation | Both earlier P1s still hold at `52f0bcb9a98`. |
| SL-I7-001 | 7 | severity_recheck | G5-I6-P1-001 kept at P1. Synthesis agrees on the tier and corrects the disclosure half. |
| SL-I7-002 | 7 | python_ts_parity | The divergence ratchet catches any routed effect on the corpus. The residual gap is G5-I3-P2-001. |

**Findings by ledger row:** SL-001 G5-I1-P1-001, SL-002 G5-I1-P2-001, SL-003 G5-I1-P2-002, SL-004 G5-I1-P2-003, SL-005 G5-I1-P2-004, SL-201 G5-I2-P1-001, SL-202 G5-I2-P2-001, SL-203 G5-I2-P2-002, SL-302 G5-I3-P2-001, SL-303 G5-I3-P2-002, SL-411 to SL-416 G5-I4-P2-001 to G5-I4-P2-006, SL-502 G5-I5-P2-001, SL-601 G5-I6-P1-001, SL-I7-003 the unread-module sweep that produced G5-I7-P2-001.

## What the Extension Changed

The v5-r3 report closed after 3 passes with FAIL, P1 2, P2 8 and search debt 3. Passes 4 to 7 changed it as follows.

- **Search debt went from 3 to 0.** SL-008 and SL-206 were bookkeeping gaps. Pass 4 swept both scans and recorded them as ruled out (SL-401, SL-402). SL-305 was never run. Pass 5 ran `playbook_capability`, and it passed (SL-501).
- **All seven unrechecked generation-4 P2s were rechecked.** Six still hold and are re-recorded as G5-I4-P2-001 to G5-I4-P2-006. R3-P2-002 holds but sits outside `reviewScopeFiles`, so it is not registered. R4-P2-004 now includes the loop-owner floor v5-r3 left out.
- **R1-P2-005 was settled.** v5-r3 left it contested. Pass 5's probe showed generation 4's literal case does not misfire (rows C1 and C4). A narrower case does (row C5), recorded as G5-I5-P2-001.
- **One new P1.** Pass 6 found G5-I6-P1-001 in the metrics store. Pass 7 kept it at P1. Synthesis confirmed it, probed its fail-open step, and corrected pass 7's disclosure claim.
- **One new P2 beyond the rechecks.** Pass 7 found G5-I7-P2-001, the stale drift-watcher claim.
- **Both earlier P1s were rechecked at the new HEAD.** Pass 6 checked each for a missed mitigation and found none (SL-603).
- **`spec_code` stayed partial, with more drift.** The brief counted two contradictions. Passes 4, 6 and 7 added three, so five now hold it partial. The coverage gate therefore needs three P2 comment fixes on top of the P1 work.
- **Counts:** P1 2 to 3, P2 8 to 16, search debt 3 to 0. The verdict stayed FAIL, and its only driver stayed the coverage gate.
- **Convergence:** score 0.89 to 0.9677. The graph decision went from `STOP_BLOCKED` to `STOP_ALLOWED`, with dimension coverage at 1.0 on pass 7.

## Across Both Generations

Generation 4 ran five DeepSeek passes. Generation 5 ran seven Opus passes on a fresh registry. This table maps every generation-4 finding to its generation-5 outcome, so all twelve passes read as one view. Only the generation-5 ids count in the verdict.

| Gen-4 id | Gen-4 severity | Gen-5 outcome | Gen-5 id | Note |
|---|---|---|---|---|
| R2-P1-001 | P1 | Downgraded to P2 | G5-I2-P2-001 | Any caller can assert trust itself (`advisor-server.ts:239-241`), so the default adds no reach. The false promise still holds `spec_code` at partial. |
| R1-P2-001 | P2 | Re-recorded | G5-I1-P2-001 | Same RRF scale mismatch. |
| R1-P2-002 | P2 | Re-recorded | G5-I1-P2-002 | Same slash predicate. |
| R1-P2-003 | P2 | Re-recorded | G5-I1-P2-003 | Same doctor-inclusive ambiguity. |
| R1-P2-004 | P2 | Re-recorded | G5-I1-P2-004 | Same stop-word count. Its Python twin is G5-I3-P2-001. |
| R1-P2-005 | P2 | Settled, narrowed | G5-I5-P2-001 | The literal case is ruled out by probe. A withheld lower holder misfires. |
| R2-P2-001 | P2 | Re-recorded | G5-I2-P2-002 | Same shadow-log modes. Gen-5's gitignore claim is false and was corrected. |
| R2-P2-002 | P2 | Merged | G5-I2-P2-001 | The CLI-only prompt-time refusal is folded in as defence-in-depth evidence. |
| R3-P2-001 | P2 | Re-recorded | G5-I4-P2-001 | Contract-key header. |
| R3-P2-002 | P2 | Holds, not registered | none | The cited catalog file is outside `reviewScopeFiles`. |
| R4-P2-002 | P2 | Re-recorded | G5-I4-P2-002 | No stage seam. The start line moved from 1104 to 1108. |
| R4-P2-003 | P2 | Re-recorded | G5-I4-P2-003 | Pi budget copy. |
| R4-P2-004 | P2 | Re-recorded | G5-I4-P2-004 | Prompt cap and loop-owner floor, both rechecked. |
| R4-P2-006 | P2 | Re-recorded | G5-I4-P2-005 | Swallowed Gate-3 lookup failure. |
| R5-P2-001 | P2 | Re-recorded | G5-I4-P2-006 | Lock reclaim race, cross-process only. |
| R4-P2-001 | P2 | Closed false positive in gen 4 | none | Not reopened. |
| R4-P2-005 | P2 | Closed false positive in gen 4 | none | Not reopened. The parity suites pass. |

New in generation 5 with no generation-4 parent: G5-I1-P1-001, G5-I2-P1-001, G5-I6-P1-001, G5-I3-P2-001, G5-I3-P2-002 and G5-I7-P2-001.

Gen-4 ruled out "cross-user socket reach" (SL-014). That covered an attacker reaching the real daemon, which the 0700 directory and 0600 socket block. G5-I2-P1-001 is the reverse direction, a client reaching a planted listener. The two do not contradict.

Combined open set after twelve passes: 3 P1 and 16 P2 confirmed at HEAD, 1 generation-4 P2 that holds outside the declared scope, and nothing contested.

## 10. Audit Appendix

### Convergence summary

- Stop reason: `maxIterationsReached` after 7 of 7 passes, following an in-place extension from 3 (state log `extended` event, `addedIterations: 4`, `newMaxIterations: 7`). Convergence is telemetry only on this run.
- Convergence score 0.9677. Graph score 1, graph decision `STOP_ALLOWED` on pass 7, with no blockers.
- New-findings ratio by pass: 1.0, 0.4375, 0.11, 0.25, 0.04, 0.1667, 0.0323.
- Terminal gates (state log, run 8): `evidence` passed with `all-findings-cited`. `scope` passed with `all-findings-in-scope`. `coverage` failed with `traceability-incomplete`. The run-4 terminal row from the first stop read the same.
- `claim_adjudication` gate rows: runs 1 and 2 failed with "Missing typed packet fields for new P0/P1 findings". Runs 3 to 7 passed with `missingPackets: []`. Runs 6 and 7 report `activeP0P1: 3`.

### Coverage summary

- All four dimensions were covered.
- Files listed per pass: 11, 11, 14, 18, 11, 13, 8.
- Parity suites ran in pass 2: vitest 206/206 in 9 files, Python 130/0. Pass 7 relied on that run and did not rerun it.
- Gaps: section 8.

### Ruled-out claims

- Age-haircut NaN (pass 1). The heldBelow direction was reopened and settled in pass 5.
- Python/TypeScript disagreement inside the shared corpus, and symlink escape through cross-skill-edges apply (pass 2).
- Propagate-apply trust mismatch, `isError` loss in `toMCP`, and `STOP_WORDS` as duplicated vocabulary (pass 3).
- The lifecycle and handler defect scans on the serving path (pass 4).
- Generation 4's literal R1-P2-005 case, and playbook drift (pass 5).
- A Python twin of G5-I5-P2-001, a missed mitigation for either earlier P1, and shell strings built from prompt text (pass 6).
- A downgrade of G5-I6-P1-001, and the missing Python seed bound as its own finding (pass 7).

### Self-check record

- Adjudications appended: none. The Referee confirmed all three P1s and held all sixteen P2s at P2, so the registry the verdict read is unchanged. Because nothing was appended, the reducer call inside step_adversarial_selfcheck was folded into the single step-5 reducer run.
- P1 reads at `52f0bcb9a98`: `skill-graph-db.ts:740-748`, `:915-926`, `:970-980`, `scan.ts:30-62`, `skill-advisor-cli.ts:30-35`, `:1086-1104`, `:1198-1212`, `skill-advisor-cli-fallback.ts:205-213`, `.skilled/bin/lib/launcher-ipc-bridge.cjs:95-175`, `metrics.ts:165-180`, `:252-330`, `:395-445`, `:477-535`, `user-prompt-submit.ts:278-290`, `feedback-calibration.ts:30-40`, `:176-190`, `:286-325`, `advisor-validate.ts:680-705` and `weights-config.ts:25-80`.
- P2 reads at `52f0bcb9a98`: every cited line of the sixteen P2s, located by content where the line had drifted.
- Probe: `/private/tmp/dr532-synth/probe.mjs` against the built `metrics.js`, exit 0. Output: the folder chmod was rejected, `victimModeBefore` 644, `victimModeAfter` 600, and the victim held the appended outcome line. The EPERM was simulated by patching `chmod`. No second local account was available.
- Hash check: `/private/tmp/dr532-synth/hash.mjs`, exit 0. 19 distinct hashes out of 19. The ten earlier ones match v5-r3.
- G5-I2-P1-001 was confirmed by reading only. A two-account test, with one account planting the scoped directory, would confirm it.
- `review-verdict.cjs` printed the same result before the self-check, after it and after the step-5 reducer refresh: FAIL, P0 0, P1 3, P2 16, search debt 0, `["coverage"]`.
- `git status --porcelain -- .skilled/skills/system-skill-advisor` was empty after the probes.

### Contract defect in step_adversarial_selfcheck

The `step_adversarial_selfcheck` command in `.skilled/commands/deep/assets/deep-review.yaml` runs `node "$GATEWAY"` inside a `while read` loop fed by a heredoc. Node reads stdin and swallows the remaining pairs, so only the first pair is appended. This run appended no pairs, so the defect did not trigger. Generation 4 hit it. The fix is to add `</dev/null` to the gateway call inside the loop.

### Registry field gaps

- The nineteen `openFindings` entries carry `findingClass: null`, empty `affectedSurfaceHints`, `contentHash: null` and empty descriptions. This report fills those fields from the delta `findingDetails`.
- Every entry is tagged `dimension: correctness`. The deltas show security for G5-I2-P1-001, G5-I2-P2-001, G5-I2-P2-002 and G5-I6-P1-001, maintainability for G5-I3-P2-001 and G5-I7-P2-001, and traceability for G5-I3-P2-002.
- The traceability row for `spec_code` keeps only the newest pass's evidence, so four of the five contradictions are visible only in the deltas.
- The resource map lists the graph node id `file:fusion.ts` as a missing path.
- Iteration 1's record uses `run: "run-001"`. Later iterations use plain integers.

### Sources reviewed

- `review/iterations/iteration-001.md` to `iteration-007.md` and `review/deltas/iter-001.jsonl` to `iter-007.jsonl`.
- `review/deep-review-strategy.md`, `review/deep-review-findings-registry.json`, `review/deep-review-config.json`, `review/deep-review-state.jsonl` and `review/review-report-v5-r3.md`.
- Generation 4: `review-archive/2026-11-23T21-41-09Z/deep-review-findings-registry.json`.
- `.skilled/skills/sk-code/sk-code-review/references/review-core.md` section 2, for reach calibration.
- Every file:line listed under the self-check record.

### Core Protocols

- `spec_code`: partial, the one gating failure. It is tied to G5-I1-P1-001, G5-I2-P2-001, G5-I4-P2-001, G5-I6-P1-001 and G5-I7-P2-001.
- `checklist_evidence`: notApplicable. The target has no checklist rows.

### Overlay Protocols

- `feature_catalog_code`: partial, advisory. It is tied to G5-I3-P2-002 and G5-I2-P2-001.
- `playbook_capability`: pass, advisory. A name-existence sweep plus spot reads (pass 5).
- `skill_agent` and `agent_cross_runtime`: notApplicable. No agent file is in the declared target.

<!-- /ANCHOR:deep-review-advisor-logic-generation-5 -->
