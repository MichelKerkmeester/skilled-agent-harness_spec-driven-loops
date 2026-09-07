# Iteration 005 — /speckit:* command surface: dead steps post memory-decommission (KQ5)

Session: fanout-glm-5-3-flash-overengineering-1788746122749-wk19z4 | run 5 | focus: the 6 commands, 14 assets, the retired-memory covenant, phantom dashboard promises
Evidence reads: command/asset LOC + reference census, save.md/complete.md covenant greps, continuity-generator emissions, template+lib mechanism greps. Reads cost: 4 shell calls.

## What exists

`.opencode/commands/speckit/` = 6 commands (complete 100, implement 91, plan 105, resume 62, save 92, search 140 = 590 LOC) + README.txt (402) + 14 assets. Asset reference census: **14/14 referenced by their commands** — 4 commands × (auto.yaml + confirm.yaml + presentation.txt), save/search × presentation.txt only. No orphaned assets.

The retired-memory covenant is honored and enforced: `save.md:23` ("Do not use standalone `memory/*.md` files as save destinations"), `:25` ("The writer is the only write path. Do not hand-edit generated metadata"), `:90` ("no indexing handoff after it"); the completion workflow's `speckit-complete-auto.yaml:1175` carries `forbidden: … "NEVER manually author files under retired memory/ paths (the runtime rejects them)"`. The generator's own source (`runtime/cli/continuity/generate-context.ts`) references `graph-metadata.json` (:58) and phase-parent metadata (:589) — the emitted surface pair — with **zero `memory/` references**, matching the covenant.

## Findings

**F18 [P1 — clear waste] The completion command promises six report dashboards; its own workflow YAMLs promise none, and three of the six promised names have no producing mechanism anywhere in the corpus.**
- Where: `.opencode/commands/speckit/complete.md:92` — "Research, phase-decomposition, planning-gate, implementation, checklist, and closeout dashboards." Mechanism census (templates/ + runtime/cli/lib, non-fixture, non-generated): `research`/`implementation`/`checklist` names appear in templates (e.g. `templates/core/plan.md.tmpl`, `templates/core/tasks.md.tmpl` — the words, not dedicated dashboards); `phase-decomposition`, `planning-gate`, `closeout` → **0 hits**. The only other `planning-gate` occurrences are generated retrieval echoes (`runtime/cli/retrieval/fixtures/phrase-variants.json:33537`, `runtime/data/trigger-index.json:49392` — both GENERATED from the corpus, i.e. echoes of the same occurrence). And while `complete.md` itself says "dashboard" twice (:2, :92), its workflows `speckit-complete-auto.yaml` + `speckit-complete-confirm.yaml` say it **0 times**.
- Cost: every completion-claim conversation reads a 6-item promise, then hunts for report sections the workflows behind the command never define; the 6-name list has no counterpart to stay synced with. Reads: 1 extra hunt per completion; maintenance: the list is edited against nothing.
- Protects: expectations of the completion report's shape.
- Recommendation: **merge** — make :92 list what the workflow actually assembles (the packet's own documents/sections), or add the sections to the completion workflow; delete the phantom names.

**F19 [P2 — candidate] The retired-memory covenant is stated in 3 doc classes (structure reference, command, workflow YAML) with a 3-step violation-recovery ceremony documented for a case the covenant prevents.**
- Where: `references/structure/folder-structure.md:169` ("Retired compatibility folder… Current save workflows skip legacy `[spec]/memory/*.md` writes; canonical continuity lives in packet docs (`handover.md`, `_memory.continuity`…) plus `description.json` and `graph-metadata.json`"), `save.md:23,25,61,90`, `speckit-complete-auto.yaml:1171-1176` (incl. `violation_recovery: "DELETE the manually authored file -> run generate-context.js so the save routes into decision-record.md, implementation-summary.md, or handover.md -> verify ANCHORs"`), plus the root governance doc.
- Cost: one covenant, ≥6 statements across 3 audiences that must not diverge; the recovery ritual (delete → rerun → verify anchors) is 3 commands of documented ceremony for an occurrence the covenant + runtime rejection already prevent. Reads: every save/completion discussion walks 2+ covenant statements.
- Protects: the single-writer invariant (save.md:25) — genuinely validated (the runtime rejects manual writes, per the YAML's own `forbidden` note).
- Recommendation: **keep** (the covenant is the enforced design), noting the ceremony's adherence cost; run 8 checks whether any packet ever needed the recovery — if none, the ritual is speculative documentation.

**F20 [P2 — candidate] The `level_contract_optional_*.md` naming convention resolves to zero files: a documented convention whose greps return nothing, decoded differently by every reader.**
- Where: `speckit-complete-confirm.yaml:244-247` (`research: level_contract_optional_research.md`, `handover: level_contract_optional_handover.md`, `debug_delegation: level_contract_optional_debug-delegation.md`, `resource_map: level_contract_optional_resource-map.md`), `speckit-complete-auto.yaml:272`, `runtime/cli/resource-map/README.md:64` (which then resolves the SAME convention to the real path `templates/addons/resource-map.md.tmpl`). `find .opencode -name 'level_contract_optional_*.md'` → **0 files**.
- Cost: 6+ occurrences, 0 resolutions; each reader learns the decoding ("level contract: optional: X" — actually the X addon template's optionality clause) at least once; automated consumers (greps, link checkers) hit nothing.
- Protects: the level-contract optionality semantics (which docs are contractually optional at which levels).
- Recommendation: **keep** the semantics, **merge** the naming — reference the real template paths (`templates/addons/*.md.tmpl`) so the pointers resolve mechanically.

## Corrections

- Run-5 recon hypothesis "dead steps post memory-decommission in the commands" — the covenant is actually enforced end-to-end (generator emits metadata pair only; YAML carries the forbidden-paths guard). The residue found: phantom dashboards (F18), not dead memory steps.

## Not pursued here

- Whether `handover.md` (the covenant's named continuity doc) actually exists in any real packet, and whether criteria/checklists there are honored → run 8 (adherence).
