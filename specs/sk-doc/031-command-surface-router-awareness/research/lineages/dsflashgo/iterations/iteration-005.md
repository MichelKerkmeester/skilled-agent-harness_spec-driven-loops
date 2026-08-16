# Iteration 5: Seven-Hub ROUTER.md Sweep, Remaining Agents, and Dangling Legacy Citations

## Focus

Broaden the final review angles: (a) the seven hubs' root ROUTER.md two-state state sweep as
ground-truth conformance; (b) remaining agent definitions beyond markdown.md; (c) dangling
legacy `smart-routing.md` citations outside sk-create-skill (deep-alignment adapters, sk-code
shared references, deep-review playbook anchors, benchmark replay tools); (d) whether any legacy
`smart-routing.md` file still exists on disk anywhere.

## Findings

1. **All seven hubs carry a conformant root ROUTER.md (ground-truth conformance).**
   Sweep of `.opencode/skills/*/ROUTER.md` shows every hub declares `router_state: active`,
   `skill_pointer: SKILL.md`, and a four-part `version`:
   cli-external-orchestration (1.1.0.0), mcp-tooling (1.1.1.0), sk-code (3.5.0.9),
   sk-design (1.1.1.0), sk-doc (1.0.1.0), sk-prompt (1.0.1.0), system-deep-loop (1.0.1.0).
   No hub is stage1-only and no hub is missing the file. The fleet is migrated.
   [SOURCE: command:grep router_state/skill_pointer/version over .opencode/skills/*/ROUTER.md]

2. **Zero legacy `smart-routing.md` files exist on disk anywhere under .opencode (conformant).**
   `find .opencode -name "smart-routing.md"` returns nothing. The legacy locations
   (`shared/references/smart-routing.md`, `references/smart-routing.md`) named in
   root-router-contract.cjs LEGACY_ROUTER_PATHS are genuinely absent across the fleet — the
   dual-source precondition cannot currently be violated on disk.
   [SOURCE: command:find .opencode -name smart-routing.md (no results)]

3. **`sk-code/shared/references/phase-detection.md` has TWO dangling links to the relocated
   legacy file (functional doc gap).**
   Lines 40 and 110 link `[smart-routing.md](./smart-routing.md)` from
   `sk-code/shared/references/phase-detection.md`, but `sk-code/shared/references/smart-routing.md`
   no longer exists on disk (relocated to `sk-code/ROUTER.md`). The Key Sources (line 40) and
   RELATED RESOURCES (line 110) blocks now point at a dead path; the ROUTER.md replacement sits
   at the hub root, one level up. Minimal fix: re-point both links to `../ROUTER.md` (or to the
   specific ROUTER.md section), or drop the row if ROUTER.md is already the referenced hub router.
   [SOURCE: file:.opencode/skills/sk-code/shared/references/phase-detection.md:40,110]
   [SOURCE: command:ls .opencode/skills/sk-code/shared/references/ (no smart-routing.md)]

4. **Deep-alignment adapter docs cite `smart-routing.md §1/§5/§6` — stale citations to the
   relocated file (functional doc gap).**
   `deep-alignment/references/adapters/sk-code-adapter.md` (lines 123, 255, 263, 286) and
   `sk-code-known-deviations.md` (lines 125, 230-231) cite specific sections of
   `smart-routing.md` (e.g. `"smart-routing.md §5"`, `"smart-routing.md's machine-readable
   MOTION_DEV INTENT_SIGNALS"`, `"smart-routing.md §6"`) as the authoritative source for sk-code
   routing facts. The content now lives in `sk-code/ROUTER.md`; the citations name a path that no
   longer resolves. These are documentation references (not executed code), so the adapter logic
   is unaffected, but an agent following the citations would look for a non-existent file. Minimal
   fix: rewrite citations to `sk-code/ROUTER.md §…` (the ROUTER.md relocation preserved the
   sections and the MOTION_DEV machine block per sk-code ROUTER.md:3 and :18).
   [SOURCE: file:.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-code-adapter.md:123,255,263,286]
   [SOURCE: file:.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-code-known-deviations.md:125,230-231]

5. **Deep-review playbook references `ANCHOR:smart-routing` in deep-review/SKILL.md — the anchor
   does not exist (minor functional doc gap).**
   Two manual-testing-playbook scenarios
   (`invalid-or-contradictory-review-state-halts-for-repair.md:76` and
   `resume-classification-from-valid-prior-review-state.md:77`) tell the tester to use
   `ANCHOR:smart-routing` in `.opencode/skills/system-deep-loop/deep-review/SKILL.md`, but grep
   of that SKILL.md finds no `ANCHOR:smart-routing` and no `smart-routing` string. Either the
   anchor was renamed during the routing consolidation or the playbook copied a stale anchor name
   from another surface. Minimal fix: replace `ANCHOR:smart-routing` with the actual anchor used
   by deep-review's SKILL.md (or remove the anchor directive).
   [SOURCE: file:.opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/invalid-or-contradictory-review-state-halts-for-repair.md:76]
   [SOURCE: command:grep ANCHOR:smart-routing over .opencode/skills/system-deep-loop/deep-review/SKILL.md (no hits)]

6. **Benchmark replay tooling is ROUTER.md-aware (conformant; legacy paths remain as ordered
   fallbacks).**
   `deep-improvement/scripts/skill-benchmark/router-replay.cjs` `loadSurfaceRouter()` (lines
   546-572) probes `ROUTER.md` FIRST, then the two legacy paths as fallback, and
   `findReferencedRouterDoc`/`parseRouter` fall back to `hub-router.json` projection when the
   inline block is empty (lines 412-433). The legacy-path strings at lines 378, 551-552 are
   ordered fallbacks (comment at 547-550 explicitly says ROUTER.md is additive and the legacy
   paths keep identical behavior for current hubs) and the hub-router projection covers
   post-migration hubs — so a migrated hub replays from hub-router.json / ROUTER.md, not the
   legacy path. `compiled-routing-parity.cjs:288,706` refer to the retained legacy surface in
   prose about compiled-routing architecture, not an executed path probe. Conformant.
   [SOURCE: file:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:358-378,412-433,546-572]

7. **Remaining agent definitions carry no ROUTER.md / smart-routing references (conformant).**
   Grep over `.opencode/agents/*.md` and `.claude/agents/*.md` excluding markdown.md returns
   zero hits. Only markdown.md references the parent-skill ROUTER.md surface (iteration 1,
   lines 194, 296), and the .claude mirror matches on content (frontmatter-only diff).
   [SOURCE: command:grep smart-routing|ROUTER.md|router_state over agents (only markdown.md)]

8. **sk-prompt and other hubs' playbook/benchmark "smart-routing" folders are legitimate test
   content (conformant).**
   `sk-prompt/sk-prompt-improve/manual-testing-playbook/smart-routing/*` (intent-model-keyword-scoring,
   unknown-fallback-checklist, on-demand-keyword-loading, ambiguity-delta-tiebreaker) are playbook
   scenario folders for the router's behavior — content about the router, not instructions to
   create a legacy path. Same for `sk-code/manual-testing-playbook/cross-stack-routing/*` and
   `surface-detection/*`. These test the routing behavior and are not affected by the file
   relocation.
   [SOURCE: command:ls .opencode/skills/sk-prompt/sk-prompt-improve/manual-testing-playbook/smart-routing/]

## Dead Ends

- **A seventh-hub ROUTER.md gap:** ruled out — all seven hubs are `active` with valid pointers
  and versions; the fleet-wide state is uniform and conformant.
- **router-replay.cjs as a legacy-authoring hit:** ruled out — its legacy-path probes are ordered
  fallbacks behind ROUTER.md and hub-router projection; behavior on migrated hubs is correct.

## Assessment

- newInfoRatio: 0.60
- noveltyJustification: Established ground-truth conformance (7/7 active ROUTER.md, zero legacy
  files on disk) while surfacing three concrete stale-citation/doc-link gaps (sk-code
  phase-detection dangling links, deep-alignment §-citations, deep-review ANCHOR) plus the
  conformant characterization of benchmark replay and playbook content. High closure value for
  the final ranked list.
- confidence: HIGH (80%+) — direct file reads, disk finds, and greps.

## Reflection

- What worked: the disk-level `find` for legacy files (proves migration completeness), the
  section-context reads for the deep-alignment citations, and separating executed path probes
  (router-replay, conformant) from documentation citations (deep-alignment, stale).
- What failed: nothing material.
- Ruled out: any hub missing/incorrect ROUTER.md; router-replay as a legacy authoring path.

## Recommended Next Focus

Synthesis: compile the ranked surface-update list (exact file+line, gap, minimal fix) separated
from conformant surfaces, fold in the Eliminated Alternatives table, and produce research.md.
