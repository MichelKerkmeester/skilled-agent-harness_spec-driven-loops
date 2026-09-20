---
title: "Implementation Summary"
description: "The pruned 060 stress-test fixture is back in the six runtime tree shapes this repository ships, and the shared sandbox script now builds a sandbox in which the scenarios' helper steps actually run."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/013-deep-loop-alignment-review/012-missing-stress-fixture-root"
    last_updated_at: "2026-09-16T06:20:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Restored the stress-test fixture corpus and repaired setup-cp-sandbox.sh"
    next_safe_action: "Commit the restore; the runtime suite already exits zero"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/test-fixtures/060-stress-test/README.md"
      - ".opencode/skills/system-deep-loop/deep-improvement/manual-testing-playbook/agent-discipline-stress-tests/setup-cp-sandbox.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-missing-stress-fixture-root |
| **Completed** | 2026-09-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The three agent-discipline scenario documents that named a fixture source now name a fixture that
exists, and the sandbox script that hard-required it builds a working sandbox again. The restore
was chosen over retiring the scenarios: the six scenarios are the only executable proof of the
discipline boundaries the live deep-improvement agent contract still mandates, the prune was a bulk
checkpoint commit with no recorded decision, and the recommendation in the review finding lists the
restore first.

### The fixture, reshaped to the current trees

The corpus was recovered from `ebe7d6bb3c4^` and rebuilt at
`.opencode/skills/system-deep-loop/deep-improvement/test-fixtures/060-stress-test/` in the six
runtime tree shapes the crosswalk defines: the authored `.opencode/agents/` canonical, the authored
`.claude/agents/` mirror, `.cursor/agents/` and `.devin/agents/<name>/AGENT.md` as symlinks onto the
`.claude` file, and generated-shape `.codex/agents/*.toml` and `.pi/agents/*.md` mirrors. The
retired `.gemini` mirror is dropped. The flaw markers and README were renumbered from the
pruned era's `CP-040..045` to the live `CP-032..037` scenario IDs, and the description no longer
names a packet number that no longer exists.

Two recovered files were deliberately not restored. `benchmark/sentinel.js` was a stand-in whose
job the current benchmark-boundary scenario gives to the real benchmark runner's report, so
resurrecting it would add a second, contradictory completion path. The `.gemini` tree is retired
repository-wide. Both drops are recorded here rather than silently.

### The setup script, repaired on three axes

`setup-cp-sandbox.sh` was broken before it ever reached the fixture, which the dispatch brief did
not anticipate:

1. **Repo-root walk.** `REPO_ROOT` walked up five directories where six are now required. The
   count was correct when the skill lived one level shallower; nesting it under `system-deep-loop`
   made every path below resolve inside `.opencode`. Reproduced as the baseline failure:
   `ERROR: required path not found: .../.opencode/.opencode/commands/deep`, exit 1.
2. **Required and copied paths.** The fixture surfaces are now the live six-tree set, and `cp -a`
   preserves the symlink mirrors instead of flattening them. The TOML mirror is required under
   `.codex/agents/`, where TOML agents live, not `.opencode/agents/`.
3. **Sandbox dependency resolution.** The scenario helpers resolve `@spec-kit/shared` by walking
   up from their own path, so a sandbox built from the script alone failed `MODULE_NOT_FOUND`.
   The script now carries the package, its symlink under the skill family's `node_modules`, and
   its single runtime dependency `js-yaml`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.../test-fixtures/060-stress-test/README.md` | Created | Names the corpus, its six tree shapes, its inertness and the six flaws it carries |
| `.../test-fixtures/060-stress-test/.opencode/agents/cp-improve-target.md` | Created | Canonical deliberately flawed target |
| `.../test-fixtures/060-stress-test/.claude/agents/cp-improve-target.md` | Created | Authored Claude-dialect mirror |
| `.../test-fixtures/060-stress-test/.cursor/agents/cp-improve-target.md` | Created | Symlink onto the `.claude` mirror |
| `.../test-fixtures/060-stress-test/.devin/agents/cp-improve-target/AGENT.md` | Created | Symlink onto the `.claude` mirror |
| `.../test-fixtures/060-stress-test/.codex/agents/cp-improve-target.toml` | Created | Generated-shape TOML mirror |
| `.../test-fixtures/060-stress-test/.pi/agents/cp-improve-target.md` | Created | Generated-shape Pi mirror |
| `.../agent-discipline-stress-tests/setup-cp-sandbox.sh` | Modified | Repo-root walk, live required paths, symlink-preserving copies, sandbox dependencies |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The failure was reproduced before the fix with the same command that proves it now. The script was
run exactly as the scenario documents invoke it — as an executable, not through a shell — against a
fresh `/tmp` sandbox, and the sandbox was then inspected file by file: each of the six trees
present, both symlinks resolving to the `.claude` file, every copy byte-equal to the fixture. The
scenarios' pre-dispatch helper steps were then run from that sandbox alone, and both produced their
reports against the restored target. The gates that could be affected by new agent-shaped files —
roster, mirror-sync, and both generators' check modes — were run and see twelve agents, not
thirteen, and a probe of the pre-commit staged-path filter confirms a nested fixture agent path
never reaches the mirror gate.

The full deep-loop runtime suite was run in the background from the final state and exits zero.
The only file the edit tools touched with a mode change is the setup script; its executable bit was
restored and the direct invocation re-proved.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Restore rather than retire | The scenarios are the executable proof of discipline boundaries the live agent contract still requires; retiring them would delete coverage and edit the release-readiness contract, while the prune had no recorded decision behind it. |
| Six tree shapes, not the pruned four | The repository ships six runtime agent trees; the fixture simulates one, so the symlink and generated shapes belong in it. The retired `.gemini` mirror does not. |
| Drop the superseded sentinel | The benchmark-boundary scenario now proves completion through the real runner's report; a stand-in sentinel alongside it would be a second, weaker path. |
| Carry the shared package into the sandbox | The helper scripts resolve it from their own path, so a sandbox without it cannot execute the scenario's first steps. |
| Leave the scenario documents untouched | Their execution contract became resolvable again; their internal stale wording is an adjacent defect, recorded rather than folded in. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n setup-cp-sandbox.sh` | PASS (no syntax error) |
| `setup-cp-sandbox.sh --sandbox-dir /tmp/cp-direct-sandbox` (direct invocation) | PASS, exit 0, `Created deep-improvement sandbox at /tmp/cp-direct-sandbox` |
| Baseline negative control before the fix | FAIL as expected, exit 1, `required path not found: .../.opencode/.opencode/commands/deep` |
| Sandbox shape inspection | PASS: six target trees, both symlinks resolve onto the `.claude` file, copies byte-equal to the fixture |
| Sandbox path guard regression probe | PASS: relative path exit 2, path outside `/tmp/` exit 2 |
| `scan-integration.cjs` from the fresh sandbox | PASS, exit 0, `"mirrorSyncStatus":"all-aligned"` |
| `generate-profile.cjs` from the fresh sandbox | PASS, exit 0, `"id":"cp-improve-target"` |
| `node check-agent-mirror-sync.cjs --all` | PASS, `12 agent(s) checked — all mirrors in sync — OK`, exit 0 |
| `node .opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs` | PASS, `STATUS=OK`, 12/12 per runtime, exit 0 |
| `node sync-agents.cjs --check` and `sync-agents-pi.cjs --check` | PASS, `12 agents are in sync` each, exit 0 |
| `opencode agent list` from the repository root | PASS: 12 project agents listed, `cp-improve-target` appears 0 times |
| Pre-commit staged-path filter probe | PASS: nested fixture path 0 matches, top-level agent path 1 match |
| `check-comment-hygiene.sh` over the changed code surface | PASS, exit 0 |
| `npx vitest run --no-coverage` in `runtime/` | PASS, exit 0: 154 files passed, 2678 passed, 8 skipped, 1215s |
| `validate.sh --strict` on this packet | PASS (see the packet's validation receipt) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No model-dispatched scenario run.** Call A and Call B need an executor session with a model and credentials; this packet proves the sandbox and its helper chain, not a live dispatch verdict. The scenarios' verdicts remain the operator's run.
2. **Adjacent stale wording in the scenario documents, unchanged.** `proposal-only-boundary.md` names its fixture surfaces as "`.opencode`, `.claude`, and `.opencode`" and its command block diffs the `.opencode` tree twice; neither blocks execution. Recorded, not fixed.
3. **Index-versus-feature drift at CP-037.** The playbook index still says the scenario creates `benchmark-completed.sentinel`, while its feature file requires `benchmark-outputs/report.json`. The drift predates this packet and the feature file is the temporary source of truth; the index resync is a separate edit.
4. **The parent phase map was not touched.** `../spec.md` still lists every child phase `Pending`, including the already-closed 011; parent-map bookkeeping is outside this packet's write authority.
5. **The sandbox dependency list is explicit, not derived.** `js-yaml` is copied because the shared package's frontmatter parser imports it. A new dependency inside the shared package would surface as a helper-time `MODULE_NOT_FOUND`, and the script would need the matching line.
<!-- /ANCHOR:limitations -->
