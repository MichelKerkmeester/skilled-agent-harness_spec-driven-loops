#!/usr/bin/env node
'use strict';
// Generate all 75 distinct review seats (prompt files + manifest) for the 027 fresh+regression round.
// Each seat = one distinct (angle × real slice × model). 38 Opus (claude2) + 37 GPT (cli-opencode).
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const ROOT = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/review/fresh-regression-75';
const BUILD = path.join(ROOT, 'build-prompt.cjs');

// dim default per lineage; each seat is {a: sub-angle, s: slice, d?: dim}
const L = [
  // ───────────── OPUS (claude2 · claude-opus-4-8) — deep logic / concurrency / lifecycle = 38 ─────────────
  { label: 'opus-regression-code', x: 'claude', m: 'claude-opus-4-8', dim: 'correctness', seats: [
    { a: 'REGRESSION: secret scrubbing now fail-closed at the atomic-save entry for DURABLE artifacts (not just the parsed/index copy). Verify the durable path actually scrubs and cannot be bypassed.', s: '.opencode/skills/system-spec-kit/mcp_server/lib/parsing/secret-scrubber.ts + the atomic-save entry that calls it' },
    { a: 'REGRESSION: delete no longer commits after a failed tombstone sweep (blanket catch narrowed to legacy missing-table only; other failures roll back). Verify the rollback path is correct and complete.', s: '.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-edges.ts + the delete/tombstone-sweep path' },
    { a: 'REGRESSION: tombstone sweeps now bump the causal-edges generation to invalidate stale causal-boost caches (extracted module to break an import cycle). Verify generation bump fires on every sweep path.', s: '.opencode/skills/system-spec-kit/mcp_server/lib/storage/causal-generation.ts + causal-boost cache consumer' },
    { a: 'REGRESSION: save lock is no longer stealable from a live owner (reap requires a provably-dead owner pid; holders heartbeat). Verify liveness logic + that the +28 regression tests actually assert it.', s: 'the mk-spec-memory save-lock module + its vitest tests' },
    { a: 'REGRESSION: PreCompact snapshot now MERGES with the existing record (preserving authored continuity) and spec-folder detection no longer mangles file paths. Verify both fixes hold.', s: 'the PreCompact/authored-continuity snapshot module + the spec-folder detection helper' },
  ] },
  { label: 'opus-memory-daemon', x: 'claude', m: 'claude-opus-4-8', dim: 'correctness', seats: [
    { a: 'Idempotency receipts correctness: receipt key variance per logical update, TTL expiry, force-retry-conflict behavior. Hunt races and incorrect dedupe.', s: '.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts' },
    { a: 'Consolidation correctness and concurrency: partial-failure handling, ordering, and any lost-update window.', s: '.opencode/skills/system-spec-kit/mcp_server/lib/storage/consolidation.ts' },
    { a: 'Checkpoint create/restore integrity: does restore faithfully reproduce state; any corruption or partial-restore path.', s: '.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts' },
    { a: 'History + access-tracker concurrency: write ordering, counter races, unbounded growth.', s: '.opencode/skills/system-spec-kit/mcp_server/lib/storage/history.ts and access-tracker.ts' },
    { a: 'Canonical fingerprint correctness: stability/normalization; mismatch risk for continuity-freshness (sha256 contract).', s: '.opencode/skills/system-spec-kit/mcp_server/lib/storage/canonical-fingerprint.ts' },
    { a: 'Document helpers + storage adapter seam: boundary correctness across the five-port adapter (vector/lexical/traversal/maintenance/contention).', s: '.opencode/skills/system-spec-kit/mcp_server/lib/storage/document-helpers.ts + the storage adapter ports' },
  ] },
  { label: 'opus-advisor-daemon', x: 'claude', m: 'claude-opus-4-8', dim: 'correctness', seats: [
    { a: 'Advisor scorer lexical/packed-BM25 lane correctness: scoring math, field weights, tie-breaks.', s: '.opencode/skills/system-skill-advisor/**/lib/scorer/lanes/lexical.ts + the BM25 helper' },
    { a: 'Advisor BFS skill-graph traversal: equivalence to the prior recursive-CTE behavior; cycle handling, depth bounds.', s: '.opencode/skills/system-skill-advisor/**/lib/skill-graph/skill-graph-queries.ts' },
    { a: 'Advisor provenance guard: does apply-graph-metadata-patch correctly prevent automated overwrite of manual edges.', s: '.opencode/skills/system-skill-advisor/**/lib/cross-skill-edges/apply-graph-metadata-patch.ts' },
    { a: 'Advisor feedback calibration: shadow-only lane weights truly default-off / non-mutating; no leak into live scoring.', s: '.opencode/skills/system-skill-advisor/**/handlers/advisor-validate.ts + feedback calibration' },
  ] },
  { label: 'opus-codegraph-daemon', x: 'claude', m: 'claude-opus-4-8', dim: 'correctness', seats: [
    { a: 'Code-graph tombstone audit correctness: soft-delete accounting, audit accuracy under concurrent scans.', s: '.opencode/skills/system-code-graph/**/lib/code-graph-db.ts + handlers/scan.ts + handlers/status.ts' },
    { a: 'Code-graph BFS transitive traversal + blast radius: correctness of computeBlastRadius, depth/cycle handling.', s: '.opencode/skills/system-code-graph/**/handlers/query.ts (computeBlastRadius)' },
    { a: 'Code-graph why-included breadcrumb chain: accuracy of the provenance breadcrumb under multi-hop.', s: '.opencode/skills/system-code-graph/**/lib/code-graph-context.ts' },
    { a: 'Code-graph BM25 symbol resolver: fuzzy lookup correctness; false-match risk; optional-path gating.', s: '.opencode/skills/system-code-graph/**/ the BM25 symbol resolver module' },
  ] },
  { label: 'opus-launcher-lifecycle', x: 'claude', m: 'claude-opus-4-8', dim: 'correctness', seats: [
    { a: 'Re-election lease liveness: keyed on dead-owner pid vs live childPid — the prior double-writer class. Hunt for a window where two launchers both write.', s: '.opencode/bin/mk-spec-memory-launcher.cjs + lib/model-server-supervision.cjs' },
    { a: 'Stale-reclaim vs reap+respawn-lock (true adoption): bridges a warm daemon when alive+bridgeable, reaps only when dead. Verify the alive-but-stale branch cannot double-spawn.', s: '.opencode/bin/*launcher*.cjs reclaim/adoption path' },
    { a: 'SIGTERM handling: shutdownLauncherForSignal child.kill(signal) vs relaunch — the SIGTERM<->relaunch flap root cause. Verify owner SIGTERM no longer flaps.', s: '.opencode/bin/mk-spec-memory-launcher.cjs signal handlers' },
    { a: 'mk-code-index launcher exits on child SIGTERM instead of respawning (reconnecting proxy). Verify proxy reconnect vs the spec-memory transparent-recycle difference.', s: '.opencode/bin/mk-code-index-launcher.cjs' },
    { a: 'Orphan reap hardening: N consecutive dead probes before reap; Stop-hook orphan sweep (default off). Verify no live-process false-positive kill.', s: '.opencode/bin/*launcher*.cjs reap path + the Stop-hook orphan sweep' },
    { a: 'Sidecar SIGKILL escalation + single-writer adoption: escalation ordering and the exit-handler lease-wipe edge.', s: '.opencode/bin/mk-skill-advisor-launcher.cjs + sidecar escalation' },
  ] },
  { label: 'opus-concurrency-race', x: 'claude', m: 'claude-opus-4-8', dim: 'correctness', seats: [
    { a: 'IPC client cap raised 8->64 across 9 config blocks: consistency of the cap, back-pressure when exceeded, and the "busy" refusal path.', s: 'the IPC cap config blocks + the IPC client/server accept path' },
    { a: 'Lock-file isolation across same-kind replicas via SPECKIT_*_STATE_DIR: verify replicas cannot collide on a shared lock/state dir.', s: 'the per-kind state-dir env usage (SPECKIT_*_STATE_DIR)' },
    { a: 'Shared-daemon single-writer under multi-session: the shared git index / shared daemon child — any unguarded concurrent writer.', s: 'the single-writer/lease guard in the shared daemon path' },
    { a: 'Writer-lock races (nonce + ownership-check class that self-tests missed in 156): scan new write-locks for check-then-act gaps.', s: 'any writer-lock / advisory-lock in 027 new code' },
  ] },
  { label: 'opus-memory-track-002', x: 'claude', m: 'claude-opus-4-8', dim: 'correctness', seats: [
    { a: 'Semantic triggers: hybrid lexical+semantic matching and fallback-on-miss correctness; default-off gating (SPECKIT_SEMANTIC_TRIGGERS).', s: 'the semantic-triggers module + its flag gate' },
    { a: 'Feedback aggregator reducer (default-off, shadow-first): verify it cannot mutate live state when the flag is off.', s: 'the feedback aggregator reducer + SPECKIT_FEEDBACK_* gate' },
    { a: 'Feedback causal reducer: entity co-occurrence must NOT be treated as causal; verify the guard.', s: 'the feedback causal reducer + causal-link logic' },
    { a: 'Feedback retention reducer: retention tier basement enforcement; no over-eviction of protected tiers.', s: 'the feedback retention reducer + retention-sweep' },
    { a: 'Search resilience — vector shard integrity: detach-before-rename + inode-compare; the live-attachment rename window.', s: 'the vector shard attach/rename path' },
    { a: 'Search resilience — packed BM25 warmup + field weights (claim: 135MB vs 743MB) + hybrid scoped-then-limit ordering.', s: 'the BM25 packed engine + hybrid search path' },
  ] },
  { label: 'opus-followons', x: 'claude', m: 'claude-opus-4-8', dim: 'correctness', seats: [
    { a: 'Carried follow-on: source-kind ingress enforcement for same-path reindex-retire and feedback auto-promotion — is the gap real and unmitigated?', s: 'the ingress/source-kind tagging + reindex-retire path' },
    { a: 'Carried follow-on: idempotency enablement gating before any flag-ON (receipt key variance, force-retry-conflict, receipt TTL).', s: 'idempotency-receipts gating + its enablement flag' },
    { a: 'Carried follow-on: FTS5 LIKE-metachar scope hardening + IPC "busy" reply on refused connections + configurable bridge probe budget.', s: 'the FTS5 query builder + IPC accept/refuse path' },
  ] },
  // ───────────── GPT (cli-opencode · openai/gpt-5.5-fast xhigh) — breadth / drift / dead-code / mirror = 37 ─────────────
  { label: 'gpt-regression-doctruth', x: 'opencode', m: 'openai/gpt-5.5-fast', dim: 'traceability', seats: [
    { a: 'REGRESSION: phase-parent statuses (000/001/006 previously claimed planned/scaffolded with shipped children) were corrected. Re-verify spec.md phase maps vs on-disk child statuses.', s: '027 track spec.md phase-documentation maps for 000/001/006' },
    { a: 'REGRESSION: feature catalog dead /spec_kit:* namespace + wrong tool count were fixed. Re-verify the catalog matches live commands/tool counts.', s: 'the system-spec-kit feature_catalog' },
    { a: 'REGRESSION: playbook contradictory verdict taxonomy + hard-coded file-count self-check were fixed. Re-verify the playbook self-check count matches reality.', s: '.opencode/skills/system-spec-kit/**/manual_testing_playbook.md (file-count self-check)' },
    { a: 'REGRESSION: 014 "meets-or-beats" ranking claim + repudiated RSS evidence were corrected. Re-verify the 014 docs match the shipped benchmark.', s: 'the 027 014-phase docs/changelog (BM25 ranking claims)' },
    { a: 'REGRESSION: 022 "Pending final run" gates were executed-for-real and 023 pre-remediation test counts corrected. Re-verify 022/023 doc claims vs evidence.', s: 'the 027 022 and 023 phase docs' },
  ] },
  { label: 'gpt-cli-frontdoors', x: 'opencode', m: 'openai/gpt-5.5-fast', dim: 'security', seats: [
    { a: 'spec-memory.cjs front-door: command/arg injection, unsafe JSON parsing, exit-code discipline (75=retryable), warm-only probe (no prompt-time cold spawn).', s: '.opencode/bin/spec-memory.cjs' },
    { a: 'skill-advisor.cjs front-door: trusted-mutation gating (--trusted), arg injection, and that mutations are blocked from prompt-time.', s: '.opencode/bin/skill-advisor.cjs' },
    { a: 'code-index.cjs front-door: warm-only socket probe first / skip if absent; no maintenance/scan from prompt-time hooks.', s: '.opencode/bin/code-index.cjs' },
    { a: 'Exit-code contract consistency across all three CLIs: exit 75 = retryable daemon/IPC unavailability vs real errors; no success-on-failure.', s: '.opencode/bin/{spec-memory,skill-advisor,code-index}.cjs exit-code paths' },
    { a: 'Daemon CLI transport fallback: socket probe before connect, timeout handling, and graceful degrade vs hang.', s: 'the shared daemon-CLI transport/fallback helper used by the three bin CLIs' },
  ] },
  { label: 'gpt-continuity-metadata', x: 'opencode', m: 'openai/gpt-5.5-fast', dim: 'traceability', seats: [
    { a: 'description.json children_ids completeness across the 027 tree: any live phase child missing from its parent inventory (the prior R1/R2 drift class).', s: '027 tree description.json files vs on-disk child folders' },
    { a: 'graph-metadata.json derived.last_active_child_id pointers: valid, non-stale, point to existing children across the tree.', s: '027 tree graph-metadata.json derived pointers' },
    { a: '_memory.continuity frontmatter: fingerprint sha256:<64hex>, actor-slug last_updated_by, field length limits — validity across spec.md files.', s: '027 tree spec.md _memory.continuity blocks' },
    { a: 'Phase-parent lean-trio compliance: parents keep only spec.md/description.json/graph-metadata.json; heavy docs live in children.', s: '027 phase-parent folders (000-005) root contents' },
    { a: 'context-index.md current-folder columns accuracy for phases folded/renamed/consolidated.', s: '027 tree context-index.md files' },
  ] },
  { label: 'gpt-dead-code', x: 'opencode', m: 'openai/gpt-5.5-fast', dim: 'maintainability', seats: [
    { a: 'Loop-YAML script-invocation wiring: a reducer/script present but never invoked by the loop YAML (the deep-context reducer-unwired class). Grep the loop YAMLs for each script call.', s: '.opencode/commands/deep/assets/*.yaml vs .opencode/skills/deep-loop-*/scripts/*' },
    { a: 'Default-off flags referenced but never wired to a real gate / unreachable code behind a flag that is never read.', s: '027 new feature flags (SPECKIT_*) vs their read sites' },
    { a: 'Command presentation .txt assets (24-router refactor): orphaned .txt with no router reference, or routers referencing a missing .txt.', s: '.opencode/commands/deep/assets/*_presentation.txt vs the routers that load them' },
    { a: 'Storage adapter ports defined but unused; an adapter seam with no concrete implementation wired.', s: 'the five-port storage adapter seam + its implementations' },
    { a: 'Exported helpers/functions in 027 new code with zero callers (dead exports).', s: '027 new lib modules across the three daemons' },
  ] },
  { label: 'gpt-mirror-parity', x: 'opencode', m: 'openai/gpt-5.5-fast', dim: 'correctness', seats: [
    { a: 'deep-* native agent parity: .opencode/agents/deep-{context,research,review}.md vs .claude/agents/*.md vs .codex/agents/*.toml — body drift or a missing mirror (= silent native-seat failure).', s: '.opencode/agents/deep-*.md, .claude/agents/deep-*.md, .codex/agents/deep-*.toml' },
    { a: 'Core agent mirror parity (gem-team I/O updates): orchestrate/code/review/context/debug across the three runtime dirs.', s: '.opencode/agents/{orchestrate,code,review,context,debug}.md + .claude + .codex mirrors' },
    { a: 'Command/skill symlink integrity: commands/skills should be symlinks to .opencode (not forked copies) in .claude/.codex.', s: '.claude and .codex command/skill entries vs .opencode source' },
    { a: 'Runtime dispatch templates localized: Claude/Codex orchestrate mirrors must not embed the wrong-runtime dispatch template.', s: 'the orchestrate agent dispatch templates in each runtime dir' },
  ] },
  { label: 'gpt-wip-doctrine', x: 'opencode', m: 'openai/gpt-5.5-fast', dim: 'traceability', seats: [
    { a: '001 peck verification discipline: self-check / current-state templates — claims in spec/docs vs what shipped.', s: '027/001-research-and-doctrine peck-teachings child + the templates it claims to add' },
    { a: 'gem-team typed agent I/O contract: agent-io-contract.md vs the actual agent headers/envelopes; advisory metadata must never block a valid exchange.', s: 'the agent-io-contract.md + the agents that adopt it' },
    { a: '001 scoped pre-execution gates: do the gates described match the implemented gate logic?', s: '027/001 scoped pre-execution gate docs vs code' },
    { a: '001 reviewer benchmark wiring: is the benchmark actually runnable/wired as documented?', s: '027/001 reviewer-benchmark artifacts' },
  ] },
  { label: 'gpt-wip-verification', x: 'opencode', m: 'openai/gpt-5.5-fast', dim: 'traceability', seats: [
    { a: '005 finding-remediation completeness: every tracked finding has a real remediation or an honest open status (no silently-closed).', s: '027/005-verification-and-remediation finding-remediation child' },
    { a: '005 tri-system deep research artifacts integrity: research.md anchors/_memory blocks, references resolve.', s: '027/005 tri-system deep-research artifacts' },
    { a: '005 residual-design-units status accuracy: claimed status vs actual implementation.', s: '027/005 residual-design-units child' },
  ] },
  { label: 'gpt-comment-hygiene-scope', x: 'opencode', m: 'openai/gpt-5.5-fast', dim: 'maintainability', seats: [
    { a: 'Comment-hygiene HARD BLOCK: scan 027 new code for ADR-/REQ-/CHK-/task-ids or spec-folder paths embedded in code comments (forbidden).', s: '027 new code under the three daemons + .opencode/bin' },
    { a: 'Scope discipline: changes that strayed beyond each phase frozen scope (gold-plating / adjacent cleanup).', s: '027 phase diffs vs their spec.md scope' },
    { a: 'Comment hygiene: stale TODO/FIXME/commented-out dead code left in the new modules.', s: '027 new lib modules' },
  ] },
  { label: 'gpt-security', x: 'opencode', m: 'openai/gpt-5.5-fast', dim: 'security', seats: [
    { a: 'Command/arg injection in any spawn/exec/child_process in 027 new code (launchers, CLIs, scripts).', s: '027 new code spawn/exec sites' },
    { a: 'Path traversal / unsafe path handling in spec-folder detection and file-path resolution.', s: 'the spec-folder detection + path resolution helpers' },
    { a: 'Permission/sandbox defaults: any unsafe default (bypassPermissions / --dangerously-skip-permissions / workspace-write) baked into dispatch/recipe code.', s: '027 executor/dispatch/permissions-gate code' },
  ] },
];

const manifest = [];
let global = 0; const counts = { claude: 0, opencode: 0 };
for (const ln of L) {
  const lineageDir = path.join(ROOT, 'lineages', ln.label);
  ln.seats.forEach((seat, i) => {
    global += 1; const iter = i + 1; counts[ln.x] += 1;
    const dim = seat.d || ln.dim;
    const promptFile = execFileSync('node', [BUILD, '--label', ln.label, '--angle', seat.a, '--slice', seat.s, '--dimension', dim, '--model', ln.m, '--iter', String(iter)], { encoding: 'utf8' }).trim();
    manifest.push({ global, label: ln.label, executor: ln.x, model: ln.m, dimension: dim, lineageDir, iter, promptFile, subangle: seat.a.slice(0, 80), slice: seat.s });
  });
}
fs.writeFileSync(path.join(ROOT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`generated ${manifest.length} seats: opus(claude)=${counts.claude} gpt(opencode)=${counts.opencode}`);
console.log(`lineages=${L.length}`);
