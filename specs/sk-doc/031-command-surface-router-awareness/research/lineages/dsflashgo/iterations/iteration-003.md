# Iteration 3: CI Scripts, Skill Advisor Metadata, and Validators — ROUTER.md Awareness

## Focus

Audit the "other surfaces" from the research brief: CI workflows
(`.github/workflows/routing-registry-drift.yml` and siblings), the three fleet CI scripts
(`ci-skill-root-metadata.cjs` [iteration 2], `ci-leaf-manifest-freshness.cjs`,
`ci-skill-derived-freshness.cjs`), skill advisor metadata/index (`system-skill-advisor`
MCP + scorer), the skill-graph compiler validator, sk-doc package/validation scripts, and
the compiled-route bin surface — for legacy `smart-routing` references and root ROUTER.md
awareness.

## Findings

1. **CI's parent-skill structural gate glob-enrolls all SEVEN hubs and runs check 12 (root
   ROUTER.md contract) on each — but `ROUTER.md` is MISSING from the workflow's trigger paths
   (functional gap).**
   `.github/workflows/routing-registry-drift.yml:101-110` loops `for registry in
   .opencode/skills/*/mode-registry.json`, deriving each hub and running
   `parent-skill-check.cjs "$hub"` — and exactly seven hubs carry `mode-registry.json`
   (cli-external-orchestration, mcp-tooling, sk-code, sk-design, sk-doc, sk-prompt,
   system-deep-loop), so the ROUTER.md two-state check 12 DOES run fleet-wide in CI.
   However, the `paths:` triggers (lines 15-56) list mode-registry.json, hub-router.json,
   SKILL.md, leaf-manifest*, description.json, graph-metadata.json — but NOT
   `ROUTER.md`. A push that edits ONLY a hub's root ROUTER.md (e.g. flipping it to
   malformed/dual-source) would NOT trigger the drift guard job, so the only fleet-level
   ROUTER.md validation is bypassed by the very file it validates.
   [SOURCE: file:.github/workflows/routing-registry-drift.yml:15-56,101-110]
   [SOURCE: command:ls .opencode/skills/*/mode-registry.json → exactly 7 hubs]

2. **`ci-skill-root-metadata.cjs` (fleet class gate) has zero ROUTER.md awareness — confirmed
   at the script level (extends iteration 2 finding 2).**
   Direct `grep -n "ROUTER|router_state|smart-routing|smart-router|root-router"` returns
   nothing. Its class-H contract (`skill-root-metadata-contract.cjs`, CLASS_HUB='H') requires
   graph-metadata/registry/manifest files but not the root ROUTER.md two-state contract. This
   is the gate CI runs at workflow lines 119-121 as the "every root, hub or standalone" check.
   [SOURCE: command:grep -n ROUTER over ci-skill-root-metadata.cjs (no hits)]
   [SOURCE: file:.opencode/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs:22,59]

3. **`ci-leaf-manifest-freshness.cjs` and `ci-skill-derived-freshness.cjs` are ROUTER-blind but
   scope-appropriate (conformant).**
   Both walk the fleet and byte-compare generated artifacts (leaf-manifest.json regeneration;
   graph-metadata derived-block regeneration) against disk. Neither references ROUTER.md /
   smart-routing, but neither claims to own the ROUTER.md contract — they validate their own
   generated files. Not a gap on their own; the fleet-level ROUTER.md validation gap is covered
   by finding 1 (trigger-path omission) and finding 2 (class gate blind).
   [SOURCE: file:.opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:10-34]
   [SOURCE: file:.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs:6-28]

4. **Skill advisor (system-skill-advisor) has no legacy smart-routing reference and no ROUTER.md
   awareness (conformant; the advisor is mode-level, not router-file-level).**
   Grep over `system-skill-advisor/mcp-server` for `smart-routing.md|references/smart|ROUTER.md`
   returns zero hits. The advisor's three "smart router" prose hits (`SKILL.md:57`,
   `README.md:238`, `explicit.ts:221`) refer to the advisor's own recommendation logic, not the
   legacy hub router file. The skill-graph compiler validator
   (`skill_graph_compiler.py --validate-only`, wired at workflow line 132) also returns zero
   ROUTER.md/smart-routing hits. The advisor projects from graph-metadata.json and
   mode-registry.json; root ROUTER.md is intentionally not an advisor input.
   [SOURCE: command:grep over .opencode/skills/system-skill-advisor (only 3 prose "smart router" hits)]
   [SOURCE: file:.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py]

5. **`package_skill.py`'s "smart-router" markers are a DIFFERENT concept — the flat-skill SMART
   ROUTING section (conformant).**
   `package_skill.py:641-688` `validate_smart_router` checks a SKILL.md's own `## SMART ROUTING`
   section for resilience markers (`discover_markdown_resources`, `_guard_in_skill`,
   `UNKNOWN_FALLBACK`) per `skill-smart-router.md` — the standalone/flat skill routing section
   pattern, NOT the class-H root ROUTER.md. It references `skill_smart_router.md`, never
   `shared/references/smart-routing.md` (grep for the legacy path returns zero). The two
   `package_skill.py` copies are conceptually in sync. This is a separate surface and not a
   legacy-path hit.
   [SOURCE: file:.opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py:641-688]
   [SOURCE: command:grep "shared/references|smart-routing" over package_skill.py (no hits)]

6. **sk-doc validators and compiled-route bin are clean (conformant).**
   `validate_skill_package.py` and `validate_document.py` carry no ROUTER.md / smart-routing
   references. The compiled-route surface (`.opencode/bin/compiled-route-*.cjs` + lib) returns
   zero hits for smart-routing / ROUTER.md / router_state; those tools handle compiled mode
   manifests, not the root router file.
   [SOURCE: command:grep over .opencode/skills/sk-doc/scripts and .opencode/bin/compiled-route*]

## Dead Ends

- **skill advisor as a ROUTER.md consumer:** ruled out — the advisor's harvesters walk
  `references/`+`assets/` frontmatter and project mode-registry/leaf-manifest pairs; root
  ROUTER.md is not an advisor input by design (documented in doctor/_routes.yaml lines 8-14).
- **package_skill.py as a legacy hit:** ruled out — its SMART ROUTING markers validate the
  flat-skill section pattern, a distinct surface from the hub root ROUTER.md contract.

## Assessment

- newInfoRatio: 0.70
- noveltyJustification: Surprising inversion — CI ALREADY runs ROUTER.md check 12 fleet-wide via
  glob-enrollment of the 7 registry hubs, but the trigger-path omission means editing the very
  file under validation bypasses the gate. Also confirmed advisor/validators/compiled-route are
  intentionally ROUTER-agnostic, and package_skill's smart-router hits are a different concept.
- confidence: HIGH (80%+) — direct reads of the workflow YAML trigger lists and script greps.

## Reflection

- What worked: reading the full workflow `paths:` blocks; the glob-enrolled hub loop is easy to
  miss by only reading the doctor route. Distinguishing the flat-skill SMART ROUTING section
  (package_skill) from the hub root ROUTER.md was essential to avoid a false positive.
- What failed: nothing material.
- Ruled out: advisor/compiled-route/validators as ROUTER.md surfaces; package_skill as legacy hit.

## Recommended Next Focus

sk-create-skill smart-routing string hits (iteration 4): classify the eight hit files under
`sk-create-skill` (skill-smart-router.md, parent-skill-smart-routing-template.md,
parent-skill-hub-router-template.json, parent-skill-hub-template.md, parent-skills-nested-packets.md,
parent-hub-router-schema.md, root-router-contract.cjs, root-router-contract.test.cjs) as
legitimate templates/references/contracts vs stale authoring.
