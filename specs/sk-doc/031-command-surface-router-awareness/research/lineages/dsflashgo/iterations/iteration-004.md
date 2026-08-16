# Iteration 4: sk-create-skill smart-routing String Hits — Legitimate vs Stale

## Focus

Classify every `smart-routing` string hit under `.opencode/skills/sk-doc/sk-create-skill`
(8 files, 13 hits) as a legitimate legacy-rejection list, migration note, template, reference,
contract, or test fixture — versus a stale authoring instruction. This answers research Q4 for
the sk-create-skill half of the ten-file lead.

## Findings

1. **The filename `parent-skill-smart-routing-template.md` is legacy-residue NAMING, but the file
   IS the canonical root ROUTER.md two-state authoring template (conformant content, cosmetic
   naming residue).**
   `parent-skill-smart-routing-template.md` declares `router_state: active` + `skill_pointer:
   SKILL.md` in its OWN frontmatter (lines 13-14), documents both states (active = non-empty
   equal-key maps; stage1-only = all-empty collections), requires `shared/`-prefixed
   SHARED_CONTROL_RESOURCES, mandates a four-part version, and explicitly states "the router must
   never coexist with a legacy `smart-routing.md`" (line 29). Every hit in the file is the ROUTER.md
   contract, not a legacy-path instruction. The filename itself, however, keeps the "smart-routing"
   term while the rest of the codebase has adopted `ROUTER.md` naming. Referenced by
   `create-skill-parent-auto.yaml:233`/`confirm.yaml:265` as `root_router`, by
   `parent-skill-hub-template.md:306`, by `parent-hub-router-schema.md:315,346`, and by
   `parent-skills-nested-packets.md:134,247`.
   [SOURCE: file:.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-smart-routing-template.md:13-14,29]
   [SOURCE: file:.opencode/commands/create/assets/create-skill-parent-auto.yaml:233]

2. **`root-router-contract.cjs` hits are the authoritative LEGACY-ROUTER-PATHS rejection list
   (conformant).**
   Lines 73-76 define `LEGACY_ROUTER_PATHS = ['shared/references/smart-routing.md',
   'references/smart-routing.md']` — the two legacy locations a hub must not coexist with
   (RRC-003 dual-source) and must not name in a live default (RRC-008). Lines 2,7,10,31-32,49,70,
   350-351,365,371,374,383,404,416,422,426,431,436,443,450,475,661,677 are the two-state contract
   prose and violation messages. This is the frozen library consumed by parent-skill-check.cjs
   check 12, the create workflows, and their tests. Zero stale authoring.
   [SOURCE: file:.opencode/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:73-76]

3. **`root-router-contract.test.cjs` hits are test fixtures exercising the rejection paths
   (conformant).**
   Lines 313 (`legacyFiles: ['shared/references/smart-routing.md']` — dual-source fixture),
   405 and 415 (`hubRouterDefaultResource` / stage-two defaults naming legacy paths — RRC-008
   fixtures) are deliberate negative tests for the legacy-residue contract. They assert the
   legacy path is rejected, not instructed.
   [SOURCE: file:.opencode/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs:313,405,415]

4. **`parent-skill-hub-router-template.json` hit is a contract note explaining the default-resource
   rule (conformant).**
   `_defaultResourceNote` (line 5) states the hub-router defaultResource "is never required to name
   ROUTER.md. It is only rejected when it literally names a legacy smart-routing path". The
   `_pathContract` note (line 4) names `parent_skill_smart_routing_template.md` as the scaffold
   for the root ROUTER.md stage-two document. Both are normative contract text in the template's
   own `_note` fields — not instructions to create a legacy path.
   [SOURCE: file:.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-router-template.json:4-5]

5. **`skill-smart-router.md` hit describes the flat-skill SMART ROUTING section pattern — a
   DIFFERENT surface from the hub root ROUTER.md (conformant).**
   Line 166 explains that inside a parent hub with an explicit second-layer surface router, a
   packet's reference paths become packet-qualified leafResourceIds, and the surface router is
   scaffolded from `parent-skill-smart-routing-template.md`. This file backs the standalone/flat
   skill "## SMART ROUTING" section (consumed by `package_skill.py` markers), not the legacy
   hub router path. The reference to the template filename carries the same cosmetic naming
   residue as finding 1.
   [SOURCE: file:.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md:166]

6. **`parent-hub-router-schema.md` and `parent-skills-nested-packets.md` hits are ROUTER.md-aware
   documentation (conformant).**
   `parent-hub-router-schema.md:315,346` state the per-intent leaf gold belongs in the root
   ROUTER.md scaffolded from the template. `parent-skills-nested-packets.md:134` documents the
   two-stage separation and the stage1-only fresh-scaffold rule, and line 247 lists the template.
   All are current-standard authoring docs; the only legacy term is the template filename.
   [SOURCE: file:.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:315,346]
   [SOURCE: file:.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:134,247]

7. **`parent-skill-hub-template.md:306` is the related-resources pointer naming the template
   (conformant).**
   The hub scaffold's RELATED RESOURCES section links `parent-skill-smart-routing-template.md`
   as "the root `ROUTER.md` stage-two authoring template". Correct content; the link text again
   carries the filename naming residue.
   [SOURCE: file:.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:306]

8. **Count nuance vs the brief's "five files" lead.** The brief said "five files under
   sk-create-skill"; the authoritative grep finds EIGHT files carrying the string (the five
   expected plus skill-smart-router.md, parent-skill-hub-template.md, and
   parent-skills-nested-packets.md). All eight are legitimate; none is a stale authoring
   instruction. The ten-file lead likely referred to the five .opencode/commands files + five
   core sk-create-skill files; the additional three are supporting references with the same
   (legitimate) character. The only genuinely actionable residue is the COSMETIC filename
   `parent-skill-smart-routing-template.md`, which the brief deprioritizes.
   [SOURCE: command:grep "smart-routing" over .opencode/skills/sk-doc/sk-create-skill → 8 files, 13 hits]

## Dead Ends

- **Renaming `parent-skill-smart-routing-template.md`:** ruled OUT as a functional fix (brief
  prioritizes functional gaps over cosmetic naming). A rename would ripple through
  create-skill-parent auto/confirm YAMLs, parent-skill-hub-template.md, parent-hub-router-schema.md,
  parent-skills-nested-packets.md, skill-smart-router.md, the markdown agent, and possibly
  fixtures/tests — cosmetic value only, mechanical churn risk. Flagged for a separate cosmetic pass.
  [SOURCE: file:.opencode/commands/create/assets/create-skill-parent-auto.yaml:233]

## Assessment

- newInfoRatio: 0.45
- noveltyJustification: This iteration confirmed a hypothesis largely formed in iterations 1-3
  (the hits are legitimate) with per-file classification; the net-new information is the exact
  count (8 files not 5), the cosmetic-naming characterization of the template file, and the
  explicit ruling-out of a rename. Moderate novelty, high consolidation value.
- confidence: HIGH (80%+) — every hit read in context; the template's own frontmatter proves it
  is the ROUTER.md template.

## Reflection

- What worked: reading the template file's own frontmatter (router_state: active) as proof of
  function; checking each hit's sentence context rather than the string alone.
- What failed: the brief's "five files" lead undercounted — good example of a concrete lead
  needing verification against the real tree.
- Ruled out: a rename of the template file (cosmetic churn, out of functional priority).

## Recommended Next Focus

Broaden angles for the final iteration: (a) the seven-hub ROUTER.md state sweep (active vs
stage1-only) as ground-truth conformance; (b) agent definitions beyond markdown.md (the remaining
.opencode/agents); (c) hub-router/mode-registry schema docs and any remaining surfaces that might
reference the legacy path or lack ROUTER.md awareness (e.g. sk-doc smart-routing references,
benchmark/compiled-routing surfaces, and the deep-research skill's own smart-router template
reference).
