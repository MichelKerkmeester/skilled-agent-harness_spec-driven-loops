# Phase 004 facts: deep-review remediation

Source: `specs/sk-design/021-deprecate-fundamentals/review/lineages/deepseek/review-report.md`.
A five-iteration deep review (cli-opencode, llmgateway/deepseek-v4.1-flash-1017, reasoning max,
stop policy max-iterations) returned verdict CONDITIONAL with P0 0, P1 1, P2 8.
Branch `worktrees/316-deprecate-design-fundamentals`. Created 2026-11-05. Priority P1. Level 2.

## Findings and the fix for each

Paths are relative to the repository root. `SC=.skilled/skills/sk-code`, `FE=$SC/sk-code-frontend`.

### WS-1 visual-review routing reach

- R1-P1-001 (P1). `compiled-route --hub sk-code` sends "design review", "design review findings" and
  "review this design" to `sk-code-review` alone, so `web-visual-hierarchy.md` never loads.
  Root cause, measured: the hub scores a mode as distinct keyword hits times weight 4 and bundles only
  modes within `ambiguityDelta` 1 of the top. "design review findings" hits `review` and `findings`
  (review scores 8) but only `design review findings` (frontend scores 4).
  Fix: add `design review` and `review this design` to the `code-frontend-visual` class in
  `$SC/hub-router.json`, and to the `WEB_VISUAL_HIERARCHY` keyword list in `$FE/ROUTER.md` and in the
  root `$SC/ROUTER.md`. Both modes then tie and the hub routes a surfaceBundle
  `[sk-code-review, sk-code-frontend]`. No code change.
  Check: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "<phrase>"` prints
  `selectionKind":"surfaceBundle"` with both modes for all four phrases.
- R5-P2-009 (P2). `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`
  has no case for the visual vocabulary. Fix: add three cases in the `surface-bundle-frontend` shape:
  `visual-values-frontend` ("what padding should this have", single `[sk-code-frontend]`),
  `visual-review-bundle` ("design review findings", surfaceBundle `[sk-code-review, sk-code-frontend]`),
  `visual-motion-frontend` ("what animation duration should this dropdown use", single `[sk-code-frontend]`).
  Copy the served fixture to its authored twin under
  `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/`.
  Check: the sk-code canary harness passes.
- R5-P2-008 (P2). `WEB_VISUAL_HIERARCHY` in `$FE/ROUTER.md` loads three files, but the review pass
  cites `web-accessibility-patterns.md` at seven A-anchors. Fix: add
  `references/web-accessibility-patterns.md` to that intent's load set in the prose line and in the
  RESOURCE_MAP of `$FE/ROUTER.md`, and in the mirrored root `$SC/ROUTER.md`.
  Check: `verify-router-sync.cjs` and the sk-code drift guards pass.

### WS-2 metadata and packet accuracy

- R1-P2-002 (P2). `.skilled/skills/sk-design/graph-metadata.json` `derived.intent_signals` still holds
  ten retired values phrases (`ui looks off`, `make this look better`, `spacing scale`,
  `build a color palette`, `visual hierarchy`, `contrast ratio failure`, `focus ring accessibility`,
  `animation duration`, `accessibility review`, `design review findings`). Fix: replace them with ten
  phrases for the three surviving modes (extract, chart, diagram).
  Check: `parent-skill-check.cjs .skilled/skills/sk-design` OK and none of the ten old phrases remain.
- R3-P2-005 (P2). `$SC/SKILL.md` surface table row for `sk-code-frontend` (line 44), the surface list
  and the layout comment omit the three visual references and `tokens.css`. `$SC/description.json`
  keeps the old wording and `lastUpdated: 2026-10-10`. Fix: name visual values, visual hierarchy and
  review, motion and interaction, and the `tokens.css` asset in those places. Set `lastUpdated` to
  2026-11-05.
- R2-P2-003 (P2). `002-retire-fundamentals/implementation-summary.md:75` lists
  `mcp-figma/manual-testing-playbook/figma-to-code/node-to-token-markup.md` as Modified. It never
  changed: `git diff 10474a9567 --stat` on it prints nothing. Fix: delete that row.
- R2-P2-004 (P2). `001-frontend-upgrade/acceptance-criteria.md` AC-005 says five prompts in the Given
  clause and eight in the Verification cell, and names none. Fix: narrow it to the five baseline value
  prompts, name each by text and record its replay result (filled in from the remediation replay).

### WS-3 lost guidance and session guidance

- R3-P2-006 (P2). The retired `depth-and-detail.md` section "Animating a shadow" did not move.
  Its content: transitioning `box-shadow` forces a repaint on every frame, so put the target shadow on
  a pseudo-element and animate its `opacity`; the duration belongs to the state-change band. Code:
  `.card { position: relative; box-shadow: var(--shadow-1); }`
  `.card::after { content: ''; position: absolute; inset: 0; border-radius: inherit; box-shadow: var(--shadow-3); opacity: 0; transition: opacity 180ms ease; pointer-events: none; }`
  `.card:hover::after { opacity: 1; }`
  Fix: fold it into item V20 of `$FE/references/web-visual-values.md` (a second Pitfall sentence plus
  the code block), with a See also to `web-motion-and-interaction.md` Section 10 for the band. Item
  numbers stay V1 to V41 because no new item is added.
- R4-P2-007 (P2). M33 in `$FE/references/web-motion-and-interaction.md` allows a client redirect on
  session expiry "since the server is no longer in the loop" and never restates server-side refusal.
  Fix: the When not to bullet says the client redirect is UX only, the server still refuses every data
  request from the expired session, and the client clears cached protected data.

## Gates after the fixes

remint the sk-code compiled manifest and copy it to its authored twin; `compiled-route-sync --check`
and `--verify`; `generate-router-intent-signals --check`; `generate-leaf-manifest --check`;
`ci-router-vocabulary-reach.cjs`; sk-code drift guards; `parent-skill-check` on sk-code and sk-design;
`check-markdown-links`; mirror syncs; `validate_document.py` on the two edited references;
`validate.sh specs/sk-design/021-deprecate-fundamentals --strict --recursive`.

## Results (measured 2026-11-05 after the fixes)

Who did what: DeepSeek Flash (cli-opencode, llmgateway/deepseek-v4.1-flash-1017, reasoning max) made
the WS-1, WS-2 and WS-3 edits in three dispatches. Each dispatch wrote only its allowed files
(mtime scan). The orchestrator then made three corrections:
1. `$SC/description.json` `lastUpdated` restored to the file's ISO form `2026-11-05T00:00:00Z`.
2. V20 See also said the 180ms hover sits in the state-change band. Section 10 puts press, hover and
   tap at 120 to 180ms direct feedback, so it now says direct-feedback band.
3. `generate-router-intent-signals --check` reported `missing=1` (`review this design` not in
   `$SC/graph-metadata.json`). `--write --hub sk-code` added it, then `--check` printed missing=0 orphans=0 PASSED.

Replay, `compiled-route --hub sk-code`, after reminting the manifest:
- "design review", "design review findings", "review this design", "review this screen" -> route surfaceBundle [sk-code-review, sk-code-frontend]
- "code review" -> route single [sk-code-review] (unchanged)
- "review my css cascade layers change" -> route surfaceBundle [sk-code-review, sk-code-frontend] (unchanged)
- "what padding should this have", "what type scale should I use", "build a color palette for this app",
  "why does this look wrong", "what animation duration should this dropdown use" -> route single [sk-code-frontend]
Before the fix, the first three review phrases returned route single [sk-code-review].

Canary: the sk-code fixture now has 12 cases (3 added: visual-values-frontend, visual-review-bundle,
visual-motion-frontend). Served fixture and reminted manifest copied to their authored twins.

Gates:
- compiled-route-sync --check: all 7 hubs resolve, all 55 served copies match their authored files. --verify: move-simulation OK.
- generate-router-intent-signals --check: checked=7 missing=0 orphans=0 PASSED.
- generate-leaf-manifest --check sk-code and sk-design: OK.
- ci-router-vocabulary-reach: wrong-hub=0 outranked=0 no-reach=0 PASSED.
- verify-router-sync sk-code-frontend: 5/5 checks passed.
- run-all-drift-guards: all 4 guards PASSED, 11 non-blocking warnings (same as baseline).
- check-markdown-links: 14511 links, 0 broken.
- parent-skill-check sk-code and sk-design: OK, 0 warnings.
- validate_document.py web-visual-values.md and web-motion-and-interaction.md: Total issues 0. `^### V` count 41.
- mirror checks: codex 11 agents, pi 11 agents, hermes 65 copies, runtime-mirrors 213 mirrors, all PASS.
- .skilled/bin/tests: 14 pass, 0 fail.
- skill_graph_compiler --validate-only: VALIDATION PASSED.
- advisor: "review this design" -> sk-code 0.94 first. "what padding should this have" -> sk-code 0.82.
- sk-design graph-metadata derived.intent_signals: the ten retired phrases are gone, ten extract/chart/diagram phrases in place.
- 002 implementation-summary: `grep -c node-to-token` prints 0.

## Alignment pass (local-skilled-alignment, 2026-11-05)

Run: four read-only DeepSeek Flash lanes (cli-pi, llmgateway/deepseek-v4.1-flash-1017, thinking max) plus an
Opus completeness critic. 28 findings (P1 5, P2 23); the critic overturned or reclassified 6. Pre-existing and
left as is: sk-doc compiled-routing readiness markers, the gitignored deep-loop SQLite reference, the sk-doc
benchmark vocabulary-source drift and the sk-design explicit-extract canary resources (all fail identically
at base 10474a9567).

Fixed in this pass:
- Routing gaps the probes exposed. sk-code visual vocabulary gained contrast phrases (contrast of, check the
  contrast, colour/color contrast, muted text), type hierarchy, hover, focus-visible and interaction states, at
  both stages and in both ROUTER copies. sk-design chart vocabulary gained chart-choice phrases (which chart
  should i use, which/what chart fits, pick/choose a chart, best chart for), bar/line/pie/area chart, scatter
  plot and chart palette phrases. Diagram gained "flow diagram". Bare "spacing" and "text colour/color" were
  tried and removed again because they pulled a README prompt from sk-doc to sk-code.
- Replay after the fixes: chart-choice and bar-chart prompts route to sk-design-chart, the chart and diagram
  tie bundles, contrast/hover prompts route to sk-code-frontend, "Review this checkout screen for spacing and
  type hierarchy problems." bundles review and frontend, and the README prompt goes back to sk-doc.
- sk-design canary: added chart-choice, fixed the defer gold to an empty intent list, and corrected a stale
  no-signal comment in its canary router. 6 of 7 cases pass the in-memory gold check (explicit-extract-command
  fails identically at base).
- Stale descriptions of the retired mode fixed by DeepSeek in sk-design-md-generator SKILL.md and its
  procedure-card inventory, the sk-code ROUTER.md Frontend Map, sk-code README.md, sk-code-frontend README.md,
  the sk-doc agent template, .skilled/agents/README.txt and both design agent copies (now handing author gates
  to sk-code-quality).
- The dangling changelog link .skilled/changelog/sk-design/design-fundamentals was removed.
- Advisor parity pins: python-ts-parity now expects tsAlsoCorrect 103 (rr-iter3-093 and rr-iter3-182 now
  reach the sk-code gold), the divergence ledger records rr-iter3-146, and the scorer eval baseline was
  recaptured (full corpus 155 to 156, holdout 49 to 50).
- Changelogs: the three unpublished entries (sk-code v3.11.0.0, sk-code-frontend v1.1.0.0, sk-design
  v3.0.0.0) were extended, and new entries sk-design-md-generator v1.1.12.0 and sk-create-skill v1.11.2.0 were
  written with their version bumps.

Open, for the operator: rr-iter3-146 under the live skill graph (legacy advisor-corpus-parity 108 against
the pinned 110, main 109), "Review this design document for clarity." and "review the chart colour system"
reaching sk-code, and whether to open a skilled framework release note for this change.

Final gates: battery 137 pass, 2 fail (both pre-existing); drift guards 4 pass; 0 broken links; router sync
5/5; parent-skill-check OK on sk-code, sk-design, sk-doc and mcp-tooling; compiled-route guard all fresh;
all mirror checks pass; bin tests 14/14; advisor parity suites 71/72 (the legacy count above).
