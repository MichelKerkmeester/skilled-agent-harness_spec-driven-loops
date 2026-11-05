---
title: "Implementation Summary"
description: "Nine deep-review findings are fixed in place and a later alignment pass closes the routing, canary, description, parity and changelog gaps it found, so the sk-code routing vocabulary, the sk-design metadata and two frontend references now describe what the previous three phases shipped."
trigger_phrases:
  - "review remediation implementation summary"
  - "deep review findings closed"
  - "sk-code visual review routing fix"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/021-deprecate-fundamentals/004-review-remediation"
    last_updated_at: "2026-11-05T12:49:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded the nine fixes, the alignment pass and the open operator items"
    next_safe_action: "Operator decides the three open alignment items"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:5d4e42f273fad5c8eebcde9558eaff8f73210fa483d7cd7bab81fb920a5f5941"
      session_id: "sk-design-021-004-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-review-remediation |
| **Status** | Complete |
| **Completed** | 2026-11-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A design review now reaches the frontend surface, so a reader who asks for one gets `web-visual-hierarchy.md` alongside the review workflow. The nine findings the deep review recorded are fixed, and every routing path, metadata field and reference file now matches the state the previous three phases shipped. A later alignment pass then closed the routing, canary, description, parity and changelog gaps its probes found, so this summary records both runs.

### Phase 4: review-remediation

The phase repaired three workstreams across the routing vocabulary, the metadata and the frontend references. WS-1 widened the `code-frontend-visual` class so `design review` and `review this design` tie with the review vocabulary, which makes the hub return a surfaceBundle of `sk-code-review` and `sk-code-frontend`. It also added `web-accessibility-patterns.md` to the `WEB_VISUAL_HIERARCHY` load set and three canary cases for the value, review and motion prompts. WS-2 replaced ten retired sk-design intent signals, named the three visual references and `tokens.css` in the sk-code surface description and corrected two rows in completed packets. WS-3 folded the shadow animation rule into item V20 and restated the server-side refusal in M33.

DeepSeek Flash made the WS-1, WS-2 and WS-3 edits in three dispatches. It ran through `cli-opencode` against `llmgateway/deepseek-v4.1-flash-1017` with reasoning max. Each dispatch wrote only its allowed files, which an mtime scan confirmed. The orchestrator then made three corrections. It restored the `lastUpdated` value in `$SC/description.json` to the file's ISO form `2026-11-05T00:00:00Z`. It changed the V20 See also from the state-change band to the direct-feedback band because Section 10 places the 180ms hover at 120 to 180ms. It ran `generate-router-intent-signals --write --hub sk-code` to add the missing `review this design` phrase, and the next check reported missing 0 and orphans 0.

### Alignment Pass

A later alignment pass ran on 2026-11-05 with four read-only DeepSeek Flash lanes on `cli-pi` at `llmgateway/deepseek-v4.1-flash-1017` with thinking max, plus an Opus completeness critic. It raised 28 findings, which are 5 P1 and 23 P2, and the critic overturned or reclassified 6 of them. Four problems fail identically at base `10474a9567` and stay as they are, which are the sk-doc compiled-routing readiness markers, the gitignored deep-loop SQLite reference, the sk-doc benchmark vocabulary-source drift and the sk-design explicit-extract canary resources.

The routing probes found vocabulary gaps at both stages. The sk-code visual class gained contrast phrases, type hierarchy, hover, focus-visible and interaction states in `hub-router.json` and in both ROUTER copies. The sk-design router gained chart-choice phrases, bar, line, pie and area chart phrases, scatter plot, chart palette and `flow diagram`. Bare `spacing` and `text colour` were tried and removed again because they pulled a README prompt from sk-doc to sk-code. The replay showed that chart-choice and bar-chart prompts reach `sk-design-chart`, that the chart and diagram prompts tie into a bundle, that contrast and hover prompts reach `sk-code-frontend`, that a review prompt about spacing and type hierarchy bundles review and frontend and that the README prompt returns to sk-doc.

The pass also fixed the sk-design canary, the stale descriptions of the retired fundamentals mode, one dangling changelog link, the advisor parity pins and five changelogs. The canary gained the `chart-choice` case, its defer gold now holds an empty intent list and its router lost a stale no-signal comment. The stale mode descriptions changed in the sk-design-md-generator hub and its procedure-card inventory, the sk-code ROUTER.md Frontend Map, the two sk-code READMEs, the sk-doc agent template, the shared agents README and the design agent copies. The parity pins now expect `tsAlsoCorrect` 103, the divergence ledger records `rr-iter3-146` and the scorer eval baseline holds 156 full-corpus cases and 50 holdout cases. Three unpublished changelog entries were extended and two new entries were written.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/hub-router.json` | Modified | `code-frontend-visual` gains `design review` and `review this design`, so both modes tie, and the alignment pass adds the contrast, type hierarchy, hover, focus-visible and interaction-state vocabulary |
| `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md` | Modified | `WEB_VISUAL_HIERARCHY` gains both phrases, loads `web-accessibility-patterns.md` and repeats the alignment-pass phrases |
| `.skilled/skills/sk-code/ROUTER.md` | Modified | Root mirror carries the same keywords, load set, `RESOURCE_MAP` entry and alignment-pass phrases |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modified | Three cases cover the value, review and motion prompts, which brings the fixture to 12 cases |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modified | Authored twin copied from the served fixture |
| `.skilled/skills/sk-design/graph-metadata.json` | Modified | Ten retired intent signals replaced with extract, chart and diagram phrases |
| `.skilled/skills/sk-code/SKILL.md` | Modified | Surface row, surface list and layout comment name the three references and `tokens.css` |
| `.skilled/skills/sk-code/description.json` | Modified | Description follows the surface and `lastUpdated` reads `2026-11-05T00:00:00Z` |
| `.skilled/skills/sk-code/graph-metadata.json` | Modified | Added the missing `review this design` intent signal, which took the missing count from one to zero |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Modified | Reminted from the changed hub router |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` | Modified | Authored twin of the reminted manifest |
| `.hermes/skills/sk-code/ROUTER.md` | Modified | Regenerated mirror of the root router |
| `.hermes/skills/sk-code/SKILL.md` | Modified | Regenerated mirror of the sk-code hub |
| `.hermes/skills/sk-code-frontend/ROUTER.md` | Modified | Regenerated mirror of the frontend router |
| `.hermes/skills/sk-code-frontend/SKILL.md` | Modified | Regenerated mirror of the frontend surface |
| `.skilled/skills/sk-code/sk-code-frontend/references/web-visual-values.md` | Modified | V20 gains the shadow animation pitfall, the pseudo-element code block and the See also |
| `.skilled/skills/sk-code/sk-code-frontend/references/web-motion-and-interaction.md` | Modified | M33 states that the client redirect is UX only, that the server refuses every data request and that the client clears cached protected data |
| `specs/sk-design/021-deprecate-fundamentals/002-retire-fundamentals/implementation-summary.md` | Modified | Removed the row for `node-to-token-markup.md`, which never changed |
| `specs/sk-design/021-deprecate-fundamentals/001-frontend-upgrade/acceptance-criteria.md` | Modified | AC-005 names the five baseline value prompts and records each replay result |
| `.skilled/skills/sk-design/hub-router.json` | Modified | Chart-choice, chart-type, scatter plot, chart palette and `flow diagram` phrases, after bare `spacing` and `text colour` were removed again |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/fixtures/canary-cases.v1.json` | Modified | Added the `chart-choice` case and set the defer gold to an empty intent list |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/canary-router.cjs` | Modified | Removed a stale no-signal comment |
| `.skilled/skills/sk-design/sk-design-md-generator/SKILL.md` | Modified | Removed the stale description of the retired fundamentals mode |
| `.skilled/skills/sk-design/sk-design-md-generator/feature-catalog/procedure-cards/md-generator-procedure-card-inventory.md` | Modified | Inventory follows the corrected mode description |
| `.skilled/skills/sk-code/README.md` | Modified | Removed the stale description of the retired mode |
| `.skilled/skills/sk-code/sk-code-frontend/README.md` | Modified | Removed the stale description of the retired mode |
| `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` | Modified | Agent template no longer describes the retired mode |
| `.skilled/agents/README.txt` | Modified | Shared agent README follows the corrected description |
| `.skilled/agents/design.md` | Modified | Design agent hands author gates to `sk-code-quality`, with the same text in the `.claude` and `.opencode` copies |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/python-ts-parity.vitest.ts` | Modified | Parity expectation moves to `tsAlsoCorrect` 103 |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modified | Ledger records `rr-iter3-146` |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Modified | Baseline recaptured at 156 full-corpus and 50 holdout cases |
| `.skilled/changelog/sk-code/parent/v3.11.0.0.md` | Modified | Entry extended with the alignment changes |
| `.skilled/changelog/sk-code/code-frontend/v1.1.0.0.md` | Modified | Entry extended with the alignment changes |
| `.skilled/changelog/sk-design/parent/v3.0.0.0.md` | Modified | Entry extended with the alignment changes |
| `.skilled/changelog/sk-design/design-md-generator/v1.1.12.0.md` | Added | New entry for the corrected mode description |
| `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.11.2.0.md` | Added | New entry for the template correction |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The nine fixes ran in three dispatches, then the orchestrator reminted the sk-code manifest and copied it over its authored twin. The route replay ran after the remint. It returned a surfaceBundle of `sk-code-review` and `sk-code-frontend` for `design review`, `design review findings`, `review this design` and `review this screen`. It kept a single `sk-code-review` route for `code review`, kept the existing surfaceBundle for `review my css cascade layers change` and returned a single `sk-code-frontend` route for the five baseline value prompts. Before the fix the first three review phrases returned a single `sk-code-review` route.

The gate set ran in this order. The compiled-route sync checked all 7 hubs and all 55 served copies, then the move simulation. The intent-signal and leaf-manifest generators checked the routing metadata. The vocabulary-reach check, the drift guards, the link check and both parent-skill checks followed. The document validator checked the two edited references, the mirror syncs checked the runtime copies and the `.skilled/bin/tests` suite and the skill graph compiler closed the run. Every check returned the pass marker recorded in the Verification table below.

The alignment pass ran after the nine fixes. Four read-only DeepSeek Flash lanes on `cli-pi` probed the routing vocabulary, the canaries, the documents and the advisor parity set, and an Opus critic reviewed their output. The replay after the routing fixes showed the chart-choice and bar-chart prompts reaching `sk-design-chart`, the contrast and hover prompts reaching `sk-code-frontend`, the spacing and type-hierarchy review prompt bundling review and frontend and the README prompt returning to sk-doc. The final gates then ran over the result. The battery returned 137 pass and 2 fail, and both failures are pre-existing. The drift guards passed all 4, the link check found 0 broken links, router sync passed 5 of 5 and `parent-skill-check` reported OK on sk-code, sk-design, sk-doc and mcp-tooling. The compiled-route guard reported every manifest fresh, every mirror check passed, the bin tests returned 14 of 14 and the advisor parity suites returned 71 of 72, which is the legacy count named under the open items.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Widen the keyword classes instead of changing the hub scoring | The hub already bundles modes within one point of the top score, so two keyword additions make the review and frontend modes tie without a code change |
| Copy the served fixture and manifest over their authored twins | The compiled-routing contract reads the served copies, and the authored files stay the source of truth for the drift check |
| Fold the shadow rule into V20 instead of adding item V42 | The rule lands beside the elevation set it belongs to and the item numbering stays V1 to V41 |
| State the server refusal inside M33 instead of removing the client redirect | The redirect stays as a UX path and the server keeps the authorization boundary |
| Keep the file's ISO `lastUpdated` form | The other hub descriptors share that form, so a date-only value would break the shape |
| Narrow AC-005 to the five value prompts and record each result | The remediation replay measured those five prompts, so each one now carries an observed route |
| Let the orchestrator correct three details after the dispatches | Each correction came from a check the dispatch output did not satisfy, which were the date form, the duration band and the missing intent signal |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `compiled-route --hub sk-code` replay after the manifest remint | PASS, `design review`, `design review findings`, `review this design` and `review this screen` each returned a surfaceBundle of `sk-code-review` and `sk-code-frontend` |
| The same replay on the control prompts | PASS, `code review` returned a single `sk-code-review` route, `review my css cascade layers change` kept its surfaceBundle and the five baseline value prompts returned a single `sk-code-frontend` route |
| `compiled-route-sync --check` | PASS, all 7 hubs resolve and all 55 served copies match their authored files |
| `compiled-route-sync --verify` | PASS, move-simulation OK |
| `generate-router-intent-signals --check` | PASS, checked 7 hubs, missing 0, orphans 0 |
| `generate-leaf-manifest --check` on sk-code and sk-design | PASS, OK on both hubs |
| `ci-router-vocabulary-reach` | PASS, wrong-hub 0, outranked 0, no-reach 0 |
| `verify-router-sync` on sk-code-frontend | PASS, 5 of 5 checks |
| `run-all-drift-guards` | PASS, all 4 guards, 11 non-blocking warnings, the same as baseline |
| `check-markdown-links` | PASS, 14511 links, 0 broken |
| `parent-skill-check` on sk-code and sk-design | PASS, OK with 0 warnings on both hubs |
| `validate_document.py` on `web-visual-values.md` and `web-motion-and-interaction.md` | PASS, Total issues 0, `^### V` count 41 |
| Mirror checks | PASS, codex 11 agents, pi 11 agents, hermes 65 copies, runtime-mirrors 213 mirrors |
| `.skilled/bin/tests` | PASS, 14 pass, 0 fail |
| `skill_graph_compiler --validate-only` | PASS, VALIDATION PASSED |
| Advisor routes | PASS, `review this design` reached sk-code at 0.94 first and `what padding should this have` reached sk-code at 0.82 |
| sk-design graph metadata | PASS, the ten retired phrases are gone and ten extract, chart and diagram phrases are in place |
| `grep -c node-to-token` on the phase 2 summary | PASS, 0 |
| Canary fixture | PASS, 12 cases, including `visual-values-frontend`, `visual-review-bundle` and `visual-motion-frontend` |
| `validate.sh` on this folder with `--strict` | PASS, RESULT: PASSED |
| Alignment router replay after the vocabulary fixes | PASS, chart-choice and bar-chart prompts reached `sk-design-chart`, the chart and diagram prompts tied into a bundle, contrast and hover prompts reached `sk-code-frontend`, the spacing and type-hierarchy review prompt bundled review and frontend and the README prompt returned to sk-doc |
| sk-design canary in-memory gold check | PASS with a caveat, 6 of 7 cases passed and `explicit-extract-command` fails identically at base `10474a9567` |
| Alignment test battery | PASS with a caveat, 137 passed and 2 failed, and both failures are pre-existing |
| Drift guards after the alignment pass | PASS, all 4 guards |
| Markdown link check after the alignment pass | PASS, 0 broken links |
| Router sync after the alignment pass | PASS, 5 of 5 checks |
| `parent-skill-check` on sk-code, sk-design, sk-doc and mcp-tooling | PASS, OK on all four hubs |
| Compiled-route guard after the alignment pass | PASS, every manifest fresh |
| Mirror checks after the alignment pass | PASS, every mirror check passed |
| `.skilled/bin/tests` after the alignment pass | PASS, 14 pass and 0 fail |
| Advisor parity suites after the alignment pass | PASS with a caveat, 71 of 72, and the legacy advisor-corpus-parity count is the open item |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The evidence is the working tree at baseline `10474a9567`.** This phase commits nothing, so a later diff has to compare against that baseline rather than against `main`.
2. **The routing fix depends on a reminted manifest.** A router edit without a remint leaves the old single route in place, so run `compiled-route-sync --check` and the route replay after any vocabulary change.
3. **The sk-code graph metadata needed a second write.** The first dispatch omitted `review this design`, so a future hub-router edit must run `generate-router-intent-signals --check` and follow it with `--write` when the check reports a missing signal.
4. **`rr-iter3-146` is open under the live skill graph.** The legacy advisor-corpus-parity check reads 108 against the pinned 110, while `main` reads 109. The operator decides whether to repin the check or to fix the route.
5. **Two prompts still reach `sk-code` instead of `sk-design`.** `Review this design document for clarity.` and `review the chart colour system` route to `sk-code`. The operator decides whether that reach is acceptable.
6. **The framework release note is undecided.** The operator decides whether this change earns a skilled framework release note.
7. **Four pre-existing failures stay in place.** The sk-doc compiled-routing readiness markers, the gitignored deep-loop SQLite reference, the sk-doc benchmark vocabulary-source drift and the sk-design explicit-extract canary resource all fail identically at base `10474a9567`. The 2 failing battery cases also predate this phase.
<!-- /ANCHOR:limitations -->

---
