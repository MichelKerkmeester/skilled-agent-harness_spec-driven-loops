---
title: "Implementation Summary: Phase 3: doctor-gates-and-drift"
description: "The doctor gates now cover what they claim: the mutation-class guard checks four MCP skills again, the parent-skill suites pass, and route-validate checks workflow activities."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/003-doctor-gates-and-drift"
    last_updated_at: "2026-10-03T05:27:42Z"
    last_updated_by: "build-orchestrator"
    recent_action: "Closed the handoff sweep"
    next_safe_action: "Parent session reviews and commits"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/check-mcp-mutation-class.sh"
      - ".skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml"
      - ".skilled/commands/doctor/scripts/route-validate.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-doctor-gates-and-drift"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-doctor-gates-and-drift |
| **Completed** | 2026-10-03 |
| **Level** | 3 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The doctor's gates now cover what they claim. The mutation-class guard checks Code Mode and the three MCP CLI skills again, the three parent-skill suites pass against the real module graph, and `route-validate` fails when a route names a script its workflow never runs.

### Phase 3: doctor-gates-and-drift

The guard reads its own manifest, `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml`, so narrowing an install workflow can no longer shrink its coverage, and a listed script that goes missing now fails instead of passing as optional. The parent-skill fixtures recreate the `@spec-kit/shared` link the real `sk-doc` tree has, and give the fixture hub a four-part version, which a release-version check added after the fixtures were written now demands. `route-validate.py` gains assertion L1, proven by a self-test fixture that must report `FAIL: L1:`. The texts now match the tools: `/doctor:speckit` replaces the unregistered `/doctor <target>` form, the skill-budget row names the description-budget audit, the env reference states the count its own method gives, the fable baseline admits its corpus is gone, and the closed audit packet stops describing a workflow file that no longer exists.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml` | Created | Guard-owned manifest: Code Mode plus Figma, Chrome DevTools and ClickUp with install and doctor classes |
| `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` | Modified | Reads the new manifest; a listed mutating script that is missing fails |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-{command-column,leaf-manifest,root-router}.test.cjs` | Modified | Fixture links `@spec-kit/shared`; hub SKILL.md carries `version: 1.0.0.0` |
| `.skilled/commands/doctor/scripts/route-validate.py` | Modified | Assertion L1: every route script invocation is invoked by its workflow YAML |
| `.skilled/commands/doctor/scripts/route-validate.sh` | Modified | Self-test fixture 7 and its rule-id check |
| `.skilled/commands/doctor/scripts/README.md` | Modified | Lists the new check |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` | Modified | `/doctor:speckit` forms |
| `.skilled/commands/doctor/assets/doctor-rebuild-presentation.txt` | Modified | Skill-budget row text; `/doctor:speckit` forms in related commands |
| `.skilled/commands/doctor/_routes.yaml` | Modified | Header comment names `/doctor:speckit` |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | Count 154 by the stated method, with the four flag-table-only names |
| `.skilled/skills/system-spec-kit/runtime/cli/metrics/fable-baseline.json` | Modified | `target: null` plus a retirement note |
| `.skilled/skills/system-spec-kit/runtime/cli/metrics/README.md` | Modified | Says why the baseline target is null |
| `specs/system-speckit/048-doctor-command-audit/003-update/spec.md` | Modified | Phase Context describes the split into `/doctor:rebuild` and the three update workflows |
| `specs/system-speckit/048-doctor-command-audit/013-speckit-retrieval/implementation-summary.md` | Modified | Limitation 2 drops the dead pattern claim; limitation 5 names `/doctor:rebuild` |
| `.skilled/scripts/git-hooks/pre-commit` | Modified (handoff sweep) | Mutation-class trigger also matches `mcp-mutation-class-manifest.yaml`; "Fix:" line names that manifest |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modified (handoff sweep) | Case 29b: staging only the manifest reaches the guard |
| `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/001-trigger-index-replacement/acceptance-criteria.md` | Modified (handoff sweep) | Two continuity `key_files` paths point at the live `.skilled` runtime |
| 32 command, skill and README files (list in `git diff --stat`) | Modified (handoff sweep) | Retired `/doctor` forms replaced with the canonical command names, with stale target lists, counts and packet labels fixed in the same sentences |
| `.skilled/commands/deep/assets/compiled/{deep-ai-council,deep-review,deep-research}.contract.md` | Regenerated (handoff sweep) | Source digests only |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/{mcp-tooling,sk-doc}/manifest.json` and their authored copies | Re-minted (handoff sweep) | Policy hash matches current routing inputs |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and sidecars | Regenerated (handoff sweep) | Fresh against the corpus |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each finding was re-checked first (`scratch/findings-recheck.md`), the failing output was captured before any edit, and each gate was rerun after its change. The build orchestrator wrote the changes directly instead of dispatching CLI executors, because it runs as a leaf worker that may not dispatch other agents. Nothing was committed.

A later handoff sweep, run by the parent build orchestrator once every packet had been committed and no other writer remained, closed the items this phase had handed off. The invocation sweep was written by a GPT-6 Luna dispatch through cli-codex and reviewed diff by diff; the hook trigger, its test case, the 033 path fix, one integration-points table row and one feature-catalog sentence were small literal edits made directly. Contract recompilation, routing re-mints and the trigger index were regenerated with their own tools.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Name the manifest `mcp-mutation-class-manifest.yaml` | The planned name sits in the `assets/doctor-mcp-*.yaml` set another packet owns in this build |
| Fail a listed script that is missing | ADR-002 says the guard fails closed; the old "optional installer" pass hid exactly the coverage loss this phase repairs |
| Check activities against parsed YAML values | A comment that mentions a script is not an activity; the parser drops comments |
| Retire the fable baseline target rather than repoint it | Its numbers came from the deleted corpus; pointing it elsewhere would misattribute them |
| Write 154, not 158 | 154 is what the document's own method gives; the sentence now also names the four extra names and the 158 total |
| Hand three skill-budget items to the description-budget packet | ADR-004: one writer per file |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` | PASS, exit 0, seven PASS rows (`scratch/guard.log`) |
| Guard edge cases (empty manifest, missing listed script) | Exit 2 and exit 1 with a FAIL line |
| `node --test` on the three parent-skill suites | PASS, each `fail 0`, exit 0 (`scratch/parent-skill-after.log`) |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | PASS, exit 0, `PASS: L1: all 21 route script invocations are invoked by their workflow YAML` |
| `bash .skilled/commands/doctor/scripts/route-validate.sh --self-test` | PASS, exit 0, seven fixtures rejected and L1 reported |
| `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | PASS, exit 0 |
| `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` | PASS, 67 passed, 0 failed |
| `node .skilled/bin/install-codex-hooks.mjs --check --allow-worktree` | PASS, exit 0, OK |
| `node .skilled/commands/doctor/scripts/fable-mode-check.cjs --dir specs/agents/010-repo-rule-system-integration/research` | PASS, exit 0, metric rows printed |
| `validate.sh specs/system-speckit/048-doctor-command-audit --recursive --strict` | PASS, 15 of 15 `RESULT: PASSED` |
| Handoff sweep: `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` | PASS, 69 passed, 0 failed, exit 0; against the HEAD hook the new case fails (68 passed, 1 failed) |
| Handoff sweep: `bash -n .skilled/scripts/git-hooks/pre-commit` | PASS, exit 0 |
| Handoff sweep: retired-form `rg` | 93 hits before, 14 after (reasons below) |
| Handoff sweep: `check-contract-drift.cjs` | Before exit 2 (31 stale digests); after `[CONTRACT DRIFT] OK commands=3`, exit 0 |
| Handoff sweep: `compiled-route-guard.cjs` | Before `mcp-tooling stale-manifest`; after all seven hubs `fresh` |
| Handoff sweep: `validate.sh` on the 033 trigger-index child `--strict` | PASS, `RESULT: PASSED` |
| Handoff sweep: trigger index `--check --json` | PASS: regenerated (only `manifestHash` changed), then `--check --json` exit 0, `fresh: true`, 23056 documents, 0 missing, 0 stale |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Resolved in the handoff sweep: the pre-commit staging trigger.** The hook's trigger regex now matches `mcp-mutation-class-manifest.yaml`, proven by hook test case 29b (T022, AC-010).
2. **Handed off: three skill-budget items** (report title, two docstrings, 8,000 budget) to `specs/sk-doc/063-description-budget` (ADR-004).
3. **Resolved in the handoff sweep: `.skilled/commands/README.txt:158`** now shows `/doctor:speckit <target> [flags]`.
4. **Resolved in the handoff sweep: generic `/doctor` text elsewhere** (T024, AC-011). The 14 bare `/doctor` hits that remain stay on purpose: seven code comments that describe a doctor run generically rather than how to invoke it (`command-catalog-mirror-check.cjs:4,32`, `agent-roster-mirror-check.cjs:4,14`, `fable-mode-check.cjs:4,6`, `skill-graph-freshness.cjs:12`); `fable-metrics.cjs:14`, `advisor-server.ts:229` and two test-header comments (`parent-skill-check-fixtures.vitest.ts:9`, `skill-graph-freshness-panel.vitest.ts:4`), likewise generic; `workflow-invariance.vitest.ts:114`, a comment about the router consolidation docs' vocabulary; `skill-root-metadata-contract.test.cjs:551`, test data for a path helper, not an invocation; and `category-overview.md:6`, a frontmatter trigger phrase that is retrieval vocabulary. `create-command-presentation.txt:92` keeps `/doctor:cache` as a hypothetical naming example.
6. **README names five doctor commands but documents four.** `README.md` now says five commands, which matches the tree, but its DOCTOR section has no `/doctor:env` entry. Adding one is new content outside the sweep.
5. **`speckit.md` keeps its "Router for /doctor" description.** Changing a command's frontmatter description reaches the runtime mirrors and the description budget, so it was left alone.
<!-- /ANCHOR:limitations -->

---
