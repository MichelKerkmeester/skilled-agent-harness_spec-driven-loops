# Iteration 1: Create Command Family — ROUTER.md Awareness Audit

## Focus

Audit the `/create:skill` and `/create:skill-parent` command family under `.opencode/commands/create`
(router markdowns, auto/confirm workflow YAMLs, presentation assets, test fixtures) for
awareness of the root ROUTER.md parent-skill standard and for stale legacy
`shared/references/smart-routing.md` authoring instructions. Verified: init_skill.py wiring,
parent-skill template selection, root-router-contract.cjs validation, ROUTER.md presentation,
and the `.claude/commands/create` mirrors.

## Findings

1. **create-skill-parent-auto.yaml and create-skill-parent-confirm.yaml are ROUTER.md-aware and conformant.**
   Both bind an identical `root_router_contract` block (`auto.yaml:141-188`, `confirm.yaml:173-220`)
   with the six-state classification (stage1-only, active, legacy-migratable, already-current,
   conflict, malformed), the `ROUTER.md: create|migrate|unchanged` action line, and invariants
   (`create_emits_stage1_only_with_empty_maps`, `stop_before_write_on_conflict`,
   `delete_legacy_only_after_validation`, `preserve_machine_block_bytes_on_migrate`).
   `template_sources.root_router` (`auto.yaml:233`, `confirm.yaml:265`) points at
   `sk-create-skill/assets/parent-skill/parent-skill-smart-routing-template.md` — the root
   ROUTER.md two-state authoring template (its content explicitly requires
   `router_state: active|stage1-only`, `skill_pointer: SKILL.md`, four-part version, and forbids
   coexisting with legacy smart-routing.md; see template line 29).
   Validation gates on `parent-skill-check.cjs` check 12 (stable RRC codes) via
   `root-router-contract.cjs` (`auto.yaml:455`, `confirm.yaml:496`).
   [SOURCE: file:.opencode/commands/create/assets/create-skill-parent-auto.yaml:141-188,233,455]
   [SOURCE: file:.opencode/commands/create/assets/create-skill-parent-confirm.yaml:173-220,265,496]

2. **Every smart-routing hit in the create command family is a legitimate legacy-rejection list,
   migration note, or test fixture — none is a stale authoring instruction.**
   - `auto.yaml:171` + `confirm.yaml:203`: migration note for `legacy-migratable` state.
   - `auto.yaml:178` + `confirm.yaml:210`: conflict STOP note.
   - `auto.yaml:422` + `confirm.yaml:461`: migrate step referencing the legacy source file.
   - `auto.yaml:606` + `confirm.yaml:646`: must_not — prohibits creating a legacy
     `shared/references/smart-routing.md` path or pointing hub-router defaultResource at a legacy path.
   - `test_skill_parent_router_parity.py:56-60`: test fixture regexes that FAIL any authoring
     surface that instructs creating/copying/scaffolding/placing a legacy smart-routing.md path.
   - `skill-parent.md:83,85`: the classifier table's documented legacy-migratable/conflict meanings.
   [SOURCE: file:.opencode/commands/create/assets/tests/test_skill_parent_router_parity.py:13,56-60,150]
   [SOURCE: file:.opencode/commands/create/skill-parent.md:83,85]

3. **init_skill.py is ROUTER.md-aware and shared correctly.**
   The `.opencode/skills/sk-doc/scripts/init_skill.py` copy (the one `create-skill-auto.yaml:333`
   and `create-skill-confirm.yaml:352` invoke) is byte-identical to the
   `sk-create-skill/scripts/init_skill.py` canonical copy (diff exit 0, no lines). Its
   `init_parent_skill()` writes a root `ROUTER.md` for parent hubs via
   `stage1_only_router_content()` (`init_skill.py:462-516`), declaring `router_state: stage1-only`,
   `skill_pointer: SKILL.md`, four-part `version: 1.0.0.0`, and empty maps — the exact fresh-scaffold
   contract. The flat standalone `init_skill()` correctly writes no ROUTER.md (flat skills have none).
   [SOURCE: file:.opencode/skills/sk-doc/scripts/init_skill.py:462-516,737]
   [SOURCE: file:.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py:462-516]

4. **Presentation surfaces present root ROUTER.md state/action, not the legacy path.**
   `create-skill-parent-presentation.txt:124,141-142,151` surface the router_state classification
   and ROUTER.md action line; the hub structure line names ROUTER.md explicitly. No presentation
   asset instructs the legacy reference-folder path.
   [SOURCE: file:.opencode/commands/create/assets/create-skill-parent-presentation.txt:124,141-142,151]

5. **`.claude/commands/create` mirrors are in sync.** `skill-parent.md` and `skill.md` are
   byte-identical to the `.opencode` routers (diff exit 0). No mirror retains a stale router.
   [SOURCE: command:diff .opencode/commands/create/skill-parent.md .claude/commands/create/skill-parent.md]

6. **Cosmetic naming residue (low priority):** `template_sources.root_router` names
   `parent-skill-smart-routing-template.md` (auto.yaml:233, confirm.yaml:265). This is the root
   ROUTER.md template (functionally correct), but the filename retains the legacy
   "smart-routing" term. Cosmetic only; the research brief prioritizes functional gaps.
   [SOURCE: file:.opencode/commands/create/assets/create-skill-parent-auto.yaml:233]

## Dead Ends

- **Flat create-skill flow and ROUTER.md:** ruled out as a gap — flat/standalone skills do not
  own a root ROUTER.md (class-H parent hubs only), so create-skill-auto.yaml:333 invoking the
  standalone `init_skill()` that writes graph-metadata.json without ROUTER.md is correct, not a defect.
  [SOURCE: file:.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py:272-409]

## Assessment

- newInfoRatio: 0.85
- noveltyJustification: First-pass full coverage of the create family; established that the
  standard landed end-to-end (YAML contract + template + init_skill.py + validator + presentation
  + parity test + mirrors), with only a cosmetic filename residue. High novelty because the entire
  functional surface was confirmed in one pass.
- confidence: HIGH (80%+) — direct reads of YAML blocks, template content, and byte-identical diffs.

## Reflection

- What worked: reading the full auto YAML rather than only the smart-routing grep hits; the
  grep hits alone would have suggested scattered legacy references, but full-context reading
  proved they are all part of one coherent migration contract.
- What failed: nothing material.
- Ruled out: the flat create-skill flow as a ROUTER.md gap (it is a non-class-H flow).

## Recommended Next Focus

Doctor command family (`.opencode/commands/doctor`): audit `_routes.yaml`, `speckit.md`,
`update.md`, `mcp.md`, `scripts/parent-skill-check.cjs`, and `doctor-runtime-mirrors` for legacy
smart-routing assumptions and for root ROUTER.md two-state contract validation coverage across
the seven hubs.
