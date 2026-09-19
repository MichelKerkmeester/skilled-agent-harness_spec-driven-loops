---
title: "Implementation Summary: Phase 18: restore-advisor-suite-and-renew-scorer-freeze"
description: "The advisor plugin caches again for workspaces below the checkout root, Python parity is back at 109 after one keyword came out, test runs leave the tree clean, and the scorer freeze is renewed."
trigger_phrases:
  - "advisor suite restore summary"
  - "phase 18 results"
  - "scorer freeze renewed"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/018-restore-advisor-suite-and-renew-scorer-freeze"
    last_updated_at: "2026-09-19T06:29:02Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Restored the advisor suite and renewed the scorer freeze"
    next_safe_action: "None for this phase; the runtime-engine harness findings need their own decision"
    blockers: []
    key_files:
      - ".opencode/plugins/system-skill-advisor.js"
      - ".skilled/skills/system-deep-loop/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "6d11af6f-653e-4807-aca8-1c09c81640c1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-restore-advisor-suite-and-renew-scorer-freeze |
| **Completed** | 2026-09-19 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor suite went from 13 failures to 3, and the three left pass when run alone. The scorer freeze matches the scorer again, so the flip no longer refuses on it.

### The plugin cache

Phase 12 made the advisor plugin refuse to cache when its workspace carries no source root, so stale advice could not outlive a skill change. But it looked for the source root directly under the workspace, and OpenCode hands the plugin whatever directory it was started in. Started anywhere below the checkout root, the plugin never cached and spawned the advisor on every prompt. It now finds the repository root first. A test covers a workspace nested inside the checkout, which caches, and one outside any checkout, which never does.

The same inventory turned up three plugin log helpers that phase 14 wrote with the same mistake. From a nested project they would have created an `.opencode/logs` directory there, the nested-tree leak the repository-root module exists to prevent. They now resolve the checkout root too.

### The parity drop

A bisection across the scorer code, the advisor scripts and every skill's metadata found one cause: the `iteration-history` keyword phase 13 added to the deep-loop hub in `71aaaa8b95`. It won a deep-review prompt back for the TypeScript scorer but cost the Python reference that same prompt, `rr-iter3-151`, which it then sent to system-spec-kit. Removing that one keyword, and keeping `iteration-files`, returns Python to 109 while the CI ratchet and the TypeScript scorer still route the prompt correctly.

The local-versus-native ledger recorded a different change: native now sends `/deep:research :auto` to system-deep-loop, its gold skill, where it used to pick system-spec-kit. The frozen scorer code gives the same result, so the move came from skill metadata. It is an improvement, and the entry is re-approved with its reason.

### The fixture and the freeze

The lane-weight sweep wrote newly computed embeddings back into a committed cache on every run. It now writes only when `SPECKIT_REFRESH_EMBEDDINGS_CACHE=1` asks it to. With the routing battery green, the scorer freeze was renewed; the `SKILL.md` change also re-minted the system-deep-loop manifest and recompiled the three deep command contracts.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/system-skill-advisor.js` | Modified | Source root from the repository root |
| `.opencode/plugins/mcp-route-guard.js`, `system-dist-freshness-guard.js`, `sk-code-post-edit-quality.js` | Modified | Logs under the checkout root |
| `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts`, `.opencode/plugins/tests/mcp-route-guard.test.cjs` | Modified | Nested and outside cases |
| `.skilled/skills/system-deep-loop/SKILL.md` | Modified | One keyword removed |
| `.../tests/parity/fixtures/local-native-approved-divergences.json` | Modified | One entry re-approved |
| `.../tests/scorer/fixtures/seed-skill-embeddings.ts`, `README.md` | Modified | Cache written only on request |
| system-deep-loop manifests, three deep contracts, `frozen-scorer-pins.json` | Regenerated | Follow the changes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each failure was traced before it was touched. The plugin failures were pinned to `63ad140f9b` by running the plugin from before it, which passes all 40. The parity drop was bisected in a scratch workspace. That first gave a false lead, because the reference resolves its skills directory through `realpath`, so any run with a symlinked advisor read the real tree; the valid runs use a real copy. The fix and each new test were checked against the code before the fix.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the plugin, not the tests | The tests described real use; a nested workspace is how OpenCode is often started |
| Remove one keyword rather than re-baseline parity | The suite says a Python-correct drop is a regression to fix, and removing it keeps every other suite green |
| Re-approve the ledger entry | Native moved to the gold skill, which is the direction the ledger wants |
| Leave the load-sensitive CLI tests alone | They pass in isolation and were not part of the approved scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor suite | 888 pass, 3 fail, 7 skipped; the 3 CLI job tests pass 3 of 3 alone |
| Parity suites | 54 of 54 |
| Plugin suite | 41 of 41; 9 fail against the plugin before the fix |
| Plugin log tests | 61 of 61 across three files; the nested case fails before the fix |
| Node gate | 90 files, 1,036 pass, 0 fail |
| Route guard and contract drift | Every hub fresh; all three deep contracts OK |
| Scorer freeze | The scorer matches its pins |
| Runtime-engine harness | 6 of 11, up from 5 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three advisor CLI job tests fail under the full parallel run.** They pass alone; their 500 ms probe timeouts look too tight under load.
2. **Every hub's rollback snapshot is stale.** Each committed `manifest.serving-prior.json` names an older policy than the current manifest, because re-mints since cutover never refreshed them. A live rollback would restore a policy the engine no longer builds, and serving would then fall back to legacy. The runtime-engine harness fails its rollback-and-reflip checks on this.
3. **Two runtime-engine harness checks fail for other reasons.** They are the discriminated-union shape and flag-off inertness checks, and neither is traced yet.
<!-- /ANCHOR:limitations -->

---
