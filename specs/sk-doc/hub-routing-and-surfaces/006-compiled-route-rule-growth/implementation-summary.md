---
title: "Implementation Summary"
description: "A hub compiler now emits composition rules for subsets of two to four modes only, so the rule count no longer doubles with each mode. sk-code went from 26 rules to 25 and mcp-tooling from 247 to 154, and a test bounds both the rule width and the rule count."
trigger_phrases:
  - "compiled route rule growth implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/hub-routing-and-surfaces/006-compiled-route-rule-growth"
    last_updated_at: "2026-11-13T16:55:52Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the mode-subset cap in worktree 367, uncommitted"
    next_safe_action: "Review the diff in worktree 367 and commit it"
    blockers: []
    key_files:
      - ".skilled/bin/tests/compiled-route-rule-bound.test.cjs"
      - ".skilled/bin/compiled-route-sync.cjs"
    session_dedup:
      fingerprint: "sha256:9f9277adc8a846f244fcea7a9b82808cca05eecec3d337f03734bb34c908cb8b"
      session_id: "scaffold-006-compiled-route-rule-growth"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "af01c830-4ea5-4abe-b6ed-dd0c4d9b1b45"
      workspace: "/Users/michelkerkmeester/worktrees/public/367-advisor-route-growth-and-node-plans"
      savedAt: "2026-11-13T16:55:52Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-compiled-route-rule-growth |
| **Completed** | 2026-11-13 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A compiled route call no longer slows down as a hub gains modes. The sk-code, mcp-tooling and sk-design registry compilers emit a rule for each subset of two to four modes, where they emitted one for every subset. sk-code went from 26 rules to 25, mcp-tooling from 247 to 154 and sk-design stays at 4.

### Cap the mode-subset size the hub registry compilers enumerate so a compiled route call stays fast as a hub gains modes

You can add modes to a hub without the rule list doubling each time. A hub with 18 modes now carries 4,029 rules where it carried 262,125. A near tie across five or more modes has no rule, so that prompt is answered by the legacy routing.

### Files Changed

`A` is `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program`.

| File | Action | Purpose |
|------|--------|---------|
| `A/009-parent-hub-rollout/{001-sk-code,003-mcp-tooling,009-sk-design}/lib/registry-compiler.cjs` | Modified | `MAX_BUNDLE_MODES` of 4 and the cap in both rule builders |
| `A/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs`, `003-mcp-tooling/lib/router.cjs`, `009-sk-design/lib/canary-router.cjs` | Modified | Comment above `exactBundle` corrected |
| `A/013-live-activation/activation/{sk-code,mcp-tooling}/manifest.json` | Modified | Refreshed for the new policy hash |
| `.skilled/bin/lib/compiled-routing/**` | Modified | Eight served copies rewritten by the rebuild |
| `.skilled/bin/tests/compiled-route-rule-bound.test.cjs` | Created | Bound on targets per rule and rules per hub |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A DeepSeek V4.1 Flash worker at max effort made the seven file edits from the literal text in `plan.md`. The orchestrating session read the diff, watched the new test fail on the old served copies, refreshed the two stale manifests in the authored tree, rebuilt and verified the served copies, finalized the rebuild and ran the bin tests. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Cap at four modes instead of a closed-form rule | The operator chose it. A closed-form rule changes the compiled policy schema, the shared decision check and every policy hash |
| Refresh the manifests in the authored tree before the rebuild | The first rebuild stopped with `promoted closure failed to resolve hubs: sk-code, mcp-tooling`, because both manifests pinned the old policy hash |
| Finalize the rebuild before the bin tests | With the rollback retained, 16 manifest tests fail with `publication-locked`. `tasks.md` ordered the tests first, and that order cannot pass |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `measure-rule-counts.cjs` before | sk-code `rules=26`, mcp-tooling `rules=247`, sk-design `rules=4` |
| `measure-rule-counts.cjs` after | `rules=25 bySize={"2":10,"3":10,"4":5}`, `rules=154 bySize={"2":28,"3":56,"4":70}`, `rules=4 bySize={"2":3,"3":1}` |
| New test on the old served copies | FAIL for sk-code and mcp-tooling, pass for sk-design |
| `compiled-route-sync.cjs --verify` | PASS, `move-simulation OK: all 7 hubs resolve` |
| `compiled-route-sync.cjs --check` after finalize | PASS, `all 55 served copies match their authored files` |
| `compiled-route-manifest.cjs freshness` for sk-code and mcp-tooling | `"fresh":true` for both |
| `node --test .skilled/bin/tests/` baseline | 173 tests, 172 passed, 0 failed, 1 skipped |
| `node --test .skilled/bin/tests/` after | 180 tests, 179 passed, 0 failed, 1 skipped. The count includes four tests from the advisor Node packet built in the same worktree |
| `compiled-route.cjs --hub sk-code` on the measured prompt | PASS, `"action":"route"` with `surfaceBundle` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A tie across five or more modes falls back to legacy routing.** sk-code lost 1 rule and mcp-tooling lost 93. No test here produces such a tie, so the fallback itself is read from the code and not exercised.
2. **The 5,000 rule bound is chosen, not measured.** It admits 18 modes, which give 4,029 rules, and fails at 19.
3. **The 18-mode timing comes from Barter's tree.** A route call measured about 155 ms there. No Skilled hub has that many modes.
<!-- /ANCHOR:limitations -->

---
