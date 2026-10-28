# Iteration 4 — the enforcement layer: what actually pins the shape

## Focus

Test question (b): which checks, parsers, templates, generators, benchmarks and runtime mirrors enforce the current routing shape, and what would each proposed change break? Scope follows `steer.md`: `parent-skill-check.cjs`, `verify-router-sync.cjs`, `router-replay-lib.cjs` (`parseRouter`), `compiled-route-guard.cjs`/`compiled-route-sync.cjs`, `build-artifacts.cjs`, `package_skill.py`, `check-rule-copies.js`, the create-skill and parent-skill canon under sk-doc, and the doctor `router-reach` workflow.

## Actions Taken

1. Read `verify-router-sync.cjs` whole in slices (constants, `readSkillRouter`, `legOrphans`, `legSurfaceMap`, `LEGS`).
2. Read `router-replay-lib.cjs:367-437` — `findReferencedRouterDoc` and `parseRouter`.
3. Read `parent-skill-check.cjs` around checks 3d-alias (625), 3j (961), 5k (1268), and 12a (1785-1830).
4. Read `build-artifacts.cjs:40-66` and compared `.skilled/skills/<hub>` against `.opencode/skills/<hub>` byte-for-byte for the four hubs.
5. Read `package_skill.py:60-90`, `:178-205`, `:769`.
6. Read `check-rule-copies.js:15-20`, `:56`, `:169`.
7. Read the canon `parent-skill-root-router-template.md:10-30` and the `root-router-contract.cjs` code map.
8. Read `doctor-router-reach.yaml:55-70`.

## Findings

1. **A packet-root `ROUTER.md` is invisible to the replay, exactly as the report claimed — the anchor is the pointer regex.** `findReferencedRouterDoc` only accepts `references/[...].md` (`router-replay-lib.cjs:374`) or the convention path `references/smart-routing.md` (`:384`); a `ROUTER.md` at a packet root matches neither. Any per-mode router file is therefore unparseable by the component that verifies stage two. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:374]

2. **Moving a packet's machine block anywhere inside the same `SKILL.md` is safe for `parseRouter`.** `parseRouter` extracts `INTENT_SIGNALS`/`RESOURCE_MAP` from the whole `SKILL.md` text (`router-replay-lib.cjs:397-403`) with no section or order constraint, so an appendix at the end of the file parses identically. The report's "may not be free" risk is resolvable without a tooling change at packet level. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:397]

3. **The router-sync guard covers sk-code only.** `verify-router-sync.cjs`'s every leg is keyed to the `SKCODE` constant (`SKCODE` root, `SURFACES = ['sk-code-ci','sk-code-skilled']`, `hubPacketDirs()` under `SKCODE`), and `readSkillRouter` reads `<packet>/SKILL.md` (`:47`). sk-doc's 14 packets, sk-design's 4 and system-deep-loop's 3 are outside the guard, which is why sk-doc's 9 router-less packets pass unnoticed. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:47]

4. **Leg 2 fails closed on a stage1-only hub, reproducing the report's finding.** `legSurfaceMap` pushes a problem when `SHARED_CONTROL_RESOURCES` is empty — "so the parent-tier check would be vacuous" (`verify-router-sync.cjs:198-200`) — and separately requires each surface `resourceMap` to be non-empty. A hub that legitimately delegates stage two to JSON breaks this leg even though the canon blesses `router_state: stage1-only`. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:198]

5. **JSON-only for hubs fails a frozen contract code, not a style rule.** `root-router-contract.cjs` freezes `RRC-001 MISSING_ROOT_ROUTER`, `RRC-005 STAGE1_NONEMPTY` and `RRC-009 MISSING_PROSE_SECTION` (`:127-135`), and check 12a runs that library against every hub (`parent-skill-check.cjs:1787-1830`). Deleting a hub `ROUTER.md` therefore fails 12a with `RRC-001`; a stage1-only hub must also ship empty maps (`RRC-005`). JSON-only at hub level needs a contract revision, and the report's "RRC-001 if ROUTER.md goes away" is exactly right. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs:127] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1787]

6. **The compiler hashes the hub `SKILL.md` — and reads it from the `.opencode` mirror, not from `.skilled`.** `build-artifacts.cjs:44-58` sets `SKILL_ROOT = <repo>/.opencode/skills/sk-code` and hashes `SKILL.md`, `hub-router.json`, `mode-registry.json`. Packet `SKILL.md` files are not in the hash. Today `.skilled/skills/<hub>` and `.opencode/skills/<hub>` are separate real directories with identical bytes for all four hubs (sha256 match, checked), so any restructuring must be written to both or the compiled route compiles the old bytes. [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs:44]

7. **`package_skill.py` pins the section name and three marker words.** It requires an H2 named `SMART ROUTING` (`:69`, accepted variants `:79-80`), requires `discover_markdown_resources`, `_guard_in_skill` and `UNKNOWN_FALLBACK` inside that section (`:182-184`), and validates it at `:769`. A shrunk 8-to-12-line §2 survives only if those three markers stay inside §2, which is compatible with the report's plan but rules out deleting the section. [SOURCE: .skilled/skills/sk-doc/scripts/package_skill.py:182]

8. **`check-rule-copies.js` pins prose inside `sk-code-review/SKILL.md`.** Its `EXTENSION_FLOORS` block reads that file (`:169-170`) and the script's header says it exists "so no repository extension can reword or drop a floor unseen" (`:18`). A readability pass over review must leave those lines byte-identical or change the pin in the same commit. [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:169]

9. **The reach diagnostic consumes the document that JSON-only would delete.** `doctor-router-reach.yaml:64-65` takes stage-one vocabulary from `.skilled/skills/*/graph-metadata.json` and stage-two vocabulary from `.skilled/skills/*/ROUTER.md`, so removing a hub `ROUTER.md` removes that hub's stage-two reach input; the canon template additionally states the router is "first-class at the hub root as `ROUTER.md`, never at a nested path" (`parent-skill-root-router-template.md:20`), which forecloses per-mode routers by authoring rule as well as by parser. [SOURCE: .skilled/commands/doctor/assets/doctor-router-reach.yaml:65] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md:20]

## Questions Answered

- Q3 in full: nine enforcement surfaces are located, each with the change it blocks.
- Q4 gains its hard constraints: per-mode `ROUTER.md` is foreclosed by parser, canon and reach; hub-level JSON-only is foreclosed by `RRC-001`/`RRC-009`; the hybrid is the only shape with no failing check.

## Questions Remaining

- Q5 (per-skill readability with quotes) — three hubs covered across iterations 1-3, the remaining packet-level reading is partial.
- Q6 (phased plan).

## Next Focus

Iteration 5: verdict per skill type (hub, mode packet, standalone skill) and a phased implementation plan with order, risk and rollback, reconciled against every constraint found in iterations 1-4.

## SCOPE VIOLATIONS

None. Every path read was outside the lineage; every write stayed inside it.
