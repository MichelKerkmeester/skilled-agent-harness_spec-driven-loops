---
title: "Implementation Summary: CI Cleanup and Pi Gate-3 Live Proof"
description: "The Pi Gate-3 contract now has live proof from a headless run and a TUI run. The six red CI surfaces are green again without a weakened gate. The scorer drop is root-caused to one cli-jev keyword and fixed at the producer."
trigger_phrases:
  - "pi gate-3 live proof"
  - "ci cleanup pi proof"
  - "cli-jev run keyword"
  - "scorer baseline ratchet"
  - "six ci surfaces"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof"
    last_updated_at: "2026-09-23T06:00:00Z"
    last_updated_by: "cli-pi-mimo-v2.6-pro"
    recent_action: "T001-T016 done: main merged, cli-jev re-minted, merged tree verified"
    next_safe_action: "Push after the operator's yes, watch CI, remove the worktree"
    blockers: []
    key_files:
      - ".skilled/skills/cli-jev/SKILL.md"
      - ".skilled/skills/cli-jev/graph-metadata.json"
      - ".hermes/skills/cli-jev/SKILL.md"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json"
      - "evidence/dispatch/evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-050-ci-cleanup-pi-proof"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: CI Cleanup and Pi Gate-3 Live Proof

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 050-ci-cleanup-pi-proof |
| **Status** | In Progress |
| **Completed** | Pending |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Pi Gate-3 dialog now has live proof in both a headless run and a TUI run, and the six CI surfaces that were red are green again. The live runs closed the gap phase 048 left, because until now the dialog had only been proven through the fake-ExtensionAPI suite. Along the way the work exposed a scorer regression and root-caused it to a single word in one skill.

### The live proof and the six surfaces

The headless parent-mode probe ran pi -p --offline with AI_SESSION_CHILD=0 and SYSTEM_SPEC_GATE_ENFORCE=0 and a closed stdin. It returned pi_rc=0 with stdout exactly HEADLESS PROBE ACK. The delivery marker recorded one question on the classify-deferral channel and no spec-gate state residue appeared. The probe ran the real parent classifier in advisory mode, since the core reads a child session only when AI_SESSION_CHILD is exactly 1 and enforces only when SYSTEM_SPEC_GATE_ENFORCE is exactly 1. The TUI run then walked the select dialog and the path input. The first write was refused with the message that the session is bound to specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof, the retry passed, and later edits passed with no second question. The state file ended satisfied with that bound path and the probe files were removed afterwards.

In the same phase the six CI surfaces were greened without weakening a gate. The Hermes mirror drift was cleared by regenerating four Hermes skill copies and the compiled deep-ai-council command contract with its two sha256 pins. Fourteen cli-orca docs moved from contextType reference to contextType general. The cli-orca graph metadata moved from category cli-tool to cli-orchestrator, three derived entries moved from kind doc to kind reference, and the sibling weights to cli-external-orchestration and mcp-tooling moved from 0.3 to 0.4 with reciprocal edges added in four skills. Six broken markdown links were repointed to their z_archive/ locations. Two hardcoded .opencode/specs paths in recursive-child-manifest.vitest.ts were corrected to the tracked specs/ tree.

The scorer ratchet had dropped to 151 of 195 full corpus and 26 of 32 memory_save against the committed 152 of 195 and 27 of 32. Experiments on git-archive copies of the base tree traced the drop to the bare word "run" in the cli-jev SKILL.md Keywords comment and in derived.key_topics. Corpus row 26 carried that word and routed to cli-jev with score 0.393 instead of the gold system-deep-loop at 0.169. Removing the keyword and the key topic, regenerating the Hermes copy and restoring the baseline brought a live 152 of 195 and 27 of 32. Row 26 now routes to system-deep-loop and a fresh capture equals the committed baseline on every metric and every fixture hash.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| Hermes skill copies for cli-hermes, cli-opencode, cli-pi and deep-ai-council | Modified | Regenerated to clear the Hermes mirror drift |
| `.skilled/commands/deep/assets/compiled/deep-ai-council.contract.md` | Modified | Regenerated with its two sha256 pins for the same drift |
| 14 cli-orca docs, 13 under `references/` plus `assets/PROVENANCE.md` | Modified | contextType moved from reference to general for the frontmatter surface |
| `cli-orca/graph-metadata.json` plus the `graph-metadata.json` of cli-external-orchestration, cli-jev, mcp-tooling and sk-git | Modified | Category, derived kinds and sibling weights corrected with the reciprocal edges |
| `.skilled/skills/cli-jev/SKILL.md`, `.skilled/skills/cli-jev/graph-metadata.json`, `.hermes/skills/cli-jev/SKILL.md`, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Modified | The bare word "run" removed from Keywords and derived.key_topics, the Hermes copy regenerated, the baseline restored to its committed content so it carries no net diff |
| cli-jev manual-testing-playbook, `system-spec-kit/runtime/hooks/cursor/README.md`, `system-spec-kit/runtime/hooks/devin/README.md`, `sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md` | Modified | Six broken links repointed to their z_archive/ locations |
| `recursive-child-manifest.vitest.ts` | Modified | Two hardcoded .opencode/specs paths corrected to the tracked specs/ tree |
| `specs/system-speckit/033-system-speckit-v4/spec.md` | Modified | Phase map row 50 and the 049 to 050 handoff row added |
| `specs/system-speckit/033-system-speckit-v4/048-gate-3-mutation-time-delivery/implementation-summary.md` | Modified | One Verification row records this phase's live Pi proof |
| `evidence/pi-headless-*.txt`, `evidence/pi-headless-delivery-marker.json`, `evidence/pi-tui-select.txt`, `evidence/pi-tui-input.txt`, `evidence/pi-tui-final.txt`, `evidence/pi-tui-state.json`, `evidence/pi-tui-warning.log`, `evidence/dispatch/` | Created | Live proof captures and the dispatch briefs wu1 to wu8 with their handbacks, moved from scratch/ to evidence/ |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation edits ran through cli-pi with model llmgateway/mimo-v2.6-pro and one change per brief. The Claude session orchestrated, verified every handback independently and made the decisions below with the operator. The briefs and handbacks live in evidence/dispatch/ as wu1-links, wu2-jev-run-topic, wu3-jev-run-keyword, wu4-baseline-restore, wu5-doc-* for the six packet documents, wu6-parent-rows, wu7-048-live-row and wu8-rev-* for the revision pass over the six documents.

The scorer experiments ran on git-archive copies of the base tree as scratch copies with the worktree untouched. A clean base scored 151 of 195 and 26 of 32. The base with this phase's cli-jev edge scored the same, so this phase's edits did not cause the drop. The base without cli-jev scored 152 of 195 and 27 of 32, and so did the base without the SKILL.md "run" keyword, which isolated the cause.

The environment needed one repair before verification could run. The worktree lacked .skilled/skills/sk-doc/node_modules/@spec-kit/shared so parent-skill-check could not load its root-router library. The orchestrator mirrored the primary checkout's gitignored link shared -> ../../../system-spec-kit/shared and no tracked file changed. sk-git's rule 8 names the full remedy for a fresh worktree: worktree-naming.sh provision.

The live-proof captures and the dispatch trail first lived in scratch/. They moved to evidence/ before the commit, because the packet docs cite them and the spec-kit folder rules keep cited files out of scratch/.

Main was merged into the worktree branch twice. The first merge, f127890ea7, was clean. The other session then pushed main to 80dc0a118d, and the second merge, 0b39a1f6c3, conflicted on the generated Hermes mirrors of cli-hermes, cli-opencode and cli-pi, because both sides had regenerated them. The conflict was resolved by taking main's copies and regenerating every Hermes mirror from the merged sources, which also refreshed the drifted sk-design mirror.

T001-T016 are done and T017 is open. The work is committed and merged on the worktree branch, and nothing is pushed yet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bring the two archived links into scope | Their targets were tracked archive files and not another session's packet |
| Find the cause of the scorer drop before deciding and fix it at cli-jev | The ratchet header says a drop is a regression, so the cause had to be proven first and the fix belonged at the producer |
| Restore scorer-eval-baseline.json to its committed content | Once the cli-jev keyword was gone the committed 152 of 195 and 27 of 32 were correct again and a fresh capture matched them on every metric and every fixture hash |
| Re-mint the cli-jev compiled-routing manifest after merging main | The SKILL.md edit changes the compiled-routing policy hash, and the guard must report fresh with CJ-001 routing compiled before any push. In practice the repository's route-remint pre-commit gate re-minted cli-jev inside commit f0411552aa, before the merge, and the merged tree kept it fresh |
| Push local main including the other session's two unpushed commits f5a89115b1 and 2c8f243607 | The operator chose to publish local main as it stands, which carries the other session's two commits along with this phase. The other session pushed them itself first, so this phase's push no longer carries them |
| Rebuild handover.md from the template | The earlier hand-written handover had no frontmatter, no template header and no anchors, which produced three of the five strict-validation errors |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` | PASS. 70 Hermes skill copies in sync, exit 0 |
| `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check` | PASS. 33 prompts are in sync, exit 0 |
| `system-deep-loop/runtime vitest check-contract-drift + render-command-contract` | PASS. 2 files, 42 tests passed, exit 0 |
| `bash .skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh . --coverage` | PASS. docs=101 violations=0, exit 0 |
| `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only` | PASS. VALIDATION PASSED with 15 discovered and 1 route-excluded, exit 0 |
| `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs` | PASS. checked=15 fresh=15 stale=0 errored=0, exit 0 |
| `node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` | PASS. 7834 files, 13510 links, 0 broken, exit 0 (was 2 broken, exit 1) |
| `system-skill-advisor/runtime vitest routing-registry-drift-guard, routing-parity-deep-skills, routing-parity-deep-council, parity/scorer-eval-baseline-ratchet` | PASS. 4 files, 28 tests passed with the ratchet at 7/7, exit 0 |
| `npx vitest run --config ../../vitest.config.ts --project cli` | PASS. The clean full re-run reported 143 files passed and 3 skipped, 1441 tests passed and 19 skipped of 1460, exit 0, in 485 s. An earlier run under heavy concurrent load failed 3 tests in tests/runtime-memory-inputs.vitest.ts, which passes 24/24 alone. Load as the cause is inferred because those failure messages were not captured |
| `npx vitest run --config ../../vitest.config.ts --project cli tests/recursive-child-manifest.vitest.ts` | PASS. 1 file, 2 tests passed, exit 0 |
| Re-score after the cli-jev fix | PASS. 152/195 full corpus and 27/32 memory_save, with row 26 routing to system-deep-loop |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof --strict` | PASS. RESULT: PASSED, 0 errors, 0 warnings |
| `validate.sh --strict` on `048-gate-3-mutation-time-delivery` after its derived metadata was regenerated | PASS. RESULT: PASSED, 0 errors, 0 warnings |
| `validate.sh --strict` on the parent `033-system-speckit-v4`, which recurses into its 50 phases | FAIL on one phase only. The parent folder and 49 of its 50 phases pass. 030-spec-kit-simplification-research fails SPECDOC_SUFFICIENCY_005 because its goal.md durable slice is 6498 characters against a 4000 limit. This phase did not touch 030 |
| `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-jev` | PASS. OK, all hard invariants passed, exit 0 |
| `node .skilled/bin/compiled-route-admission.cjs --hub cli-jev` | PASS. 3 pass 0 drift 0 stale, exit 0 |
| `node .skilled/bin/compiled-route-guard.cjs` on the merged tree `0b39a1f6c3` | PASS. All seven hubs fresh, exit 0 |
| CJ-001 prompt through `node .skilled/bin/compiled-route.cjs --hub cli-jev` on the merged tree | PASS. Routes compiled to cli-usage under effectivePolicyHash 178b10dd |
| Hermes sync, frontmatter, graph compiler, freshness and link checks on the merged tree | PASS. 70 copies in sync, 0 violations, VALIDATION PASSED, 15/15 fresh, 0 broken, all exit 0 |
| Deep-loop contract tests and advisor routing and ratchet tests on the merged tree | PASS. 42 passed and 28 passed, exit 0 |
| `node .skilled/bin/compiled-route-admission.cjs --all` on the merged tree | WARN. Six hubs pass. sk-design reports 1 drift, the same as on origin/main, and CI runs this check with --warn-only |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The cli-jev re-mint ran at commit time, not after the merge.** The repository's route-remint pre-commit gate re-minted cli-jev inside commit f0411552aa, moving its effectivePolicyHash from 3240ebf5 to 178b10dd. That commit's message still says the manifest stays stale until a re-mint after the merge, and this summary records the actual order.

2. **The full deep-loop runtime suite was not run.** Its earlier baseline run exceeded 900 seconds, so only the focused contract tests are the evidence for that surface.

3. **Nine pre-existing run-all-drift-guards.sh errors remain.** Six are missing set -uo pipefail, two are missing references/README.md and one is missing assets/voice-report-template.md. They match the pre-change baseline and sit outside the six surfaces.

4. **The primary checkout holds this phase's scaffold residue.** The scaffold ran against the primary checkout path, so the primary checkout's parent spec.md carries two placeholder rows and an untracked copy of the original 050 scaffold folder sits beside it. Both block updating the primary checkout's main to the phase commit, and removing them waits for the operator's yes at the merge step.

5. **Phase 030 fails strict validation on its own goal.md.** Its durable slice is 6498 characters against a 4000 limit. That predates this phase and sits outside its scope, so the parent's recursive strict run stays red on that one phase.
<!-- /ANCHOR:limitations -->

---
