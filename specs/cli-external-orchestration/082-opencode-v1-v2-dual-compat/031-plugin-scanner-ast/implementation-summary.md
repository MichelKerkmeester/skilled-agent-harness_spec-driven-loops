---
title: "Implementation Summary"
description: "The plugin inventory guard now reads plugin source as a syntax tree, which closes its four recorded blind spots as a class instead of one spelling at a time; the sk-vision symlink is checked by the plugins purity test, which CI can now run against a built bundle; and the plugin tests README lists every suite."
trigger_phrases:
  - "plugin scanner ast implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/031-plugin-scanner-ast"
    last_updated_at: "2026-10-20T15:00:57Z"
    last_updated_by: "generate-context"
    recent_action: "Closed the phase after CI went green at main fe8e971132"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - ".opencode/plugins/tests/helpers/plugin-inventory.cjs"
      - ".opencode/plugins/tests/plugin-inventory.test.cjs"
      - ".skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts"
      - ".github/workflows/spec-kit-check.yml"
      - ".opencode/plugins/tests/README.md"
    session_dedup:
      fingerprint: "sha256:044ed7fbc1959a49ec1a244a6d4b2068cce9c326f86e70bbf5c1223a49418341"
      session_id: "scaffold-031-plugin-scanner-ast"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-plugin-scanner-ast |
| **Completed** | 2026-10-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The inventory guard stopped guessing at JavaScript with regular expressions. It now parses each bridged plugin, so a comment or a string can no longer pass for an event check and an escaped name is read as the name it spells. The sk-vision link, the one plugin entry the purity test used to skip, now has to meet the same rules as every other entry.

### Phase 31: plugin-scanner-ast

You get an event-name guard that fails closed by construction. It reads comparisons, switches on the event type and `has` or `includes` calls on a literal collection, resolving every name through its lexical scope; every other check on the event type is reported for `unscannedEventChecks`, and a file the parser cannot read fails the test. A collection only counts as literal while nothing changes it or passes it on, which closes the last of the four recorded gaps. On the 16 real plugins the new guard reports exactly what the old one did, so the manifest needed no change.

The purity test now lists symlinks too. For `sk-vision.js` it checks that the link is relative, stays inside the repository and resolves to a built bundle, then imports it and applies the dual-export contract. Spec-Kit Check builds that bundle with bun first, because it is a gitignored build output.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/tests/helpers/plugin-inventory.cjs` | Modified | Event readers on `rolldown/parseAst` |
| `.opencode/plugins/tests/plugin-inventory.test.cjs` | Modified | One fixture per closed gap and per review finding, plus aliases and a parse failure (twenty in all) |
| `.skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts` | Modified | Checks symlinked entries |
| `.github/workflows/spec-kit-check.yml` | Modified | Builds the sk-vision bundle before the vitest projects |
| `.opencode/plugins/tests/README.md` | Modified | Every suite and the full tree |
| `.opencode/plugins/ARCHITECTURE.md` | Modified | The guard's limit and the purity test |
| `.opencode/plugins/README.md` | Modified | The inventory-test row and the tests README sentence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash at max thinking wrote every code and doc edit through short literal briefs; the spec documents were written by the orchestrating session. The old helper's output for every bridged plugin was recorded first, and the new helper had to reproduce it. Each fixture was run against the old helper, and two mutants of the new helper were run against the fixtures. The purity test was run, old and new side by side, against three broken links.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the name heuristic for the event type and record its false positive | Which variable carries the event is a runtime fact; resolving bindings removed the spelling errors, but no static rule can tell an unrelated `type` from the event's. |
| Do not count a `typeof` check as an event check | It reads the value's type tag, never which event arrived; six real-plugin checks use it, and listing them would claim events they do not select. |
| Use `rolldown/parseAst` rather than add a parser | It is already installed and pinned through vitest's vite, so no dependency is added. |
| Load it with `createRequire` from `.skilled/package.json` | The plugin tests resolve from `.opencode`, whose `node_modules` does not hold it. |
| Put the case-label fixture under `switch (eventType)` | A `case` under an unrelated switch counting as handled was one of the recorded gaps; the old fixture relied on it. |
| Follow aliases of the event type | A local declared from `event.type` is the same value; the old scan missed it. |
| Build the bundle in Spec-Kit Check instead of allow-listing the link | Allow-listing would leave the link's target unchecked, which is the gap being closed. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Plugin suite baseline | 417 of 417 (`scratch/baseline/plugin-suite.txt`) |
| Plugin suite after | 436 of 436: one test removed, twenty added (`scratch/after/plugin-suite.txt`) |
| Old vs new helper on 16 bridged plugins | Identical (`scratch/mutation/scan-parity.txt`) |
| New fixtures on the old helper | Exit 1, 18 of the 20 new tests fail; the two alias-cancelling tests fail on an intermediate parser commit instead (`scratch/mutation/scanner-old-helper.txt` and the three `round*-fixtures-on-prior-helper.txt` records) |
| Mutants m1, m2 and m3 of the new helper | m1 and m3 fail 2 tests, m2 fails 3; m3 (typeof carve-out removed) also trips the real-plugin listing test on `typeof payload.type === 'string'` |
| Purity test, three broken links | Old exit 0, new exit 1, restored link exit 0 (`scratch/mutation/purity-symlink.txt`) |
| `actionlint`, `check-gate-inputs.sh` | Exit 0; RESULT: PASSED, 0 failures (`scratch/after/workflow-checks.txt`) |
| Luna review | Round 1 FAIL: four P1s (writes through allowed members, aliases by spelling, parameter and default destructuring, shadowed `Set` and `Object`) and one P2 (no full-suite record); all fixed. Round 2 FAIL: five P1s (references and aliases by spelling, `for-of` writes, method and collection kind, a helper receiving the event type in a test) and two P2s (fixture count, a truncated capture); fixed with lexical scope resolution. Round 3 FAIL: one P1 (an event type wrapped in a call escaped) and two P2s (a shadowed `undefined`, the fixture count); fixed. Round 4 FAIL: two P1s and one P2. Fixed: a call in a test that receives a wrapped event type, and the fixture count. Recorded, not fixed: a parameter that is named `type` but carries no event counts as the event type (Known Limitations 1). Round 5 (last, by the stop rule) FAIL: two P1s and two P2s. Fixed without a further Luna round: callback methods no longer count as reads, and a computed static `['type']` key is read (both covered by `round5-fixtures-on-prior-helper.txt`); the gate-inputs output is saved. Recorded, not fixed: a helper's result stored in a variable and tested later (Known Limitations 2) |
| Strict validation | This folder RESULT: PASSED; 082 recursive RESULT: PASSED for all 32 folders after the main merge |
| CI at main `fe8e971132` | All 14 runs passed; Spec-Kit Check 39442263560 built the sk-vision bundle and passed the purity test; Dual-Version Battery 39442263433 passed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The event type is known by name.** `type`, a name ending in `Type`, a `.type` field or an alias of one. A check on an event type held under any other name is invisible, and an unrelated value that happens to be named `type` is read as the event type; telling the two apart needs to know what a value means, which a static scan cannot. The two-version battery remains the authoritative guard.
2. **The guard does not follow values.** A helper's result stored in a variable and tested later, as in `const ok = isKnown(eventType); if (ok)`, is not seen. Following it needs data-flow analysis, not scope resolution.
3. **The last review round's two fixes were not re-reviewed.** The callback-method and computed-key fixes landed after Luna's fifth and final round; they are covered by fixtures that fail on the prior helper.
4. **No CI job runs `.opencode/plugins/tests`.** The guard and its fixtures run locally only; no workflow names that directory.
5. **Spec-Kit Check does not trigger on `.opencode/plugins/**`.** A plugin-only change does not rerun the purity test.
<!-- /ANCHOR:limitations -->

---
