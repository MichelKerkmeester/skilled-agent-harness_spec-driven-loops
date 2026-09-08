# Iteration 002 — Upgrade paths versus fresh scaffold

- Angle: what `upgrade-level.sh` adds for 1→2 and 2→3 versus what a fresh scaffold at the target level carries (Level 2 row at `spec-kit-docs.json:502`, Level 3 row at `:997`), hand-read.
- Verdict: the upgrade creates the right optional-closure document for 1→2 but never creates the lifecycle document every fresh scaffold carries; for 2→3 it goes the other way and materializes a lazy add-on that a fresh Level 3 scaffold does not carry — and a rule-file header comment still asserts the old ladder model the manifest retired.
- Tool calls: 3 evidence reads + artifact writes.

## Findings (4: 2×P1, 2×P2)

### f-iter002-001 [P1] — upgrade never creates `implementation-summary.md`, which every fresh scaffold carries
- THE CLAIM (scaffold side): a fresh scaffold at Levels 1, 2 and 3 always writes `implementation-summary.md` — `scaffold_lifecycle_required_docs` prints `lifecycleRequiredDocs.afterImplementationStarts` unconditionally (`create.sh:444-452`, called from `scaffold_contract_docs`), and the rows at `spec-kit-docs.json:130-135 / :511-516 / :1006-1011` all list `['implementation-summary.md']`.
- WHAT UPGRADE DOES: `upgrade-level.sh` Step 1 (`:1483-1486`) calls `create_new_files`, whose only creations are `acceptance-criteria.md` (1→2, `:766-782`) and `decision-record.md` (2→3, `:789-806`); the string `implementation-summary.md` occurs nowhere in the 1712-line script (grep: 0 hits), and `template_for_doc` (`:57-64`) has no entry for it.
- CONSEQUENCE: a packet scaffolded before lifecycle documents existed (or otherwise lacking it) upgraded to Level 2/3 still has no `implementation-summary.md`; once `tasks.md` carries a checked `[x]` item, `check-files.sh:70-76` (FILE_EXISTS) requires it and the upgraded packet fails a rule a fresh Level 2/3 packet passes. The upgrade produces a packet that can fail the target level's own gate.
- SEVERITY: P1 (wrong: the "preserves all user-written content while injecting new template sections" contract (`upgrade-level.sh:6`) silently omits the one document that is scaffolded at every level).
- RECOMMENDATION: fix — add `implementation-summary.md` creation (rendered from `core/implementation-summary.md.tmpl`) to `create_new_files` for every step, or gate it the way FILE_EXISTS does (only when implementation has started), and update `template_for_doc`.

### f-iter002-002 [P1] — 2→3 upgrade materializes `decision-record.md`, which a fresh Level 3 scaffold never writes; and `check-files.sh:13` still asserts the retired ladder
- THE CLAIM (upgrade side, with its own header): "L2 → L3: Add decision-record.md" (`upgrade-level.sh:10`, `:789-806` creates it from `addons/decision-record.md.tmpl` unconditionally when missing) and the rule header "Level 3: Level 2 + decision-record.md" (`check-files.sh:13`) — the two agree on a ladder where Level 3 owns a decision record.
- WHAT THE MANIFEST SAYS: `spec-kit-docs.json:997-1030` Level 3 row lists `optionalAddonDocs: ['acceptance-criteria.md']` (`:1012`) and `decision-record.md` in `lazyAddonDocs` — the flat model the census round-two fix f-iter002-001 pinned everywhere ("the lazy list identical at every numbered level; phase/review/research narrow it"). `create.sh:459-461` writes lazy docs only under `--with-lazy-addons`.
- CONSEQUENCE: an upgraded Level 3 packet carries `decision-record.md`; a freshly scaffolded Level 3 packet does not. Two packets at the same level have different file sets depending on how they were created — and the rule-file header `check-files.sh:13` continues to describe a model the manifest (and three rounds of remediation) retired. The check-files header is a surviving stale statement in a rule file, the exact class rounds one and two fixed in guides and READMEs but not here.
- SEVERITY: P1 (wrong/unused: header comment misstates the level contract; upgrade behavior contradicts the manifest's own flat add-on model).
- RECOMMENDATION: fix — drop the create-at-upgrade (decision-record stays lazy) and remove/rewrite the `check-files.sh:13` ladder line to the flat statement; if instead decision-record is desired at Level 3, move it to `optionalAddonDocs` and update the flat-model docs — one authority, not two.

### f-iter002-003 [P2] — scaffold-only appended marker blocks are never injected by an upgrade
- THE CLAIM (scaffold side): after rendering, `create.sh:647-661` appends `SCAFFOLD_VALIDATION_COUNTS` (six `REQUIREMENT_PLACEHOLDER` + `**Given**` rows) to every spec.md, and `create.sh:663-679` appends `SCAFFOLD_AI_PROTOCOL_MARKERS` (AI EXECUTION / Pre-Task Checklist / Execution Rules / Status Reporting Format / Blocked Task Protocol) to plan.md at level ≥3.
- WHAT UPGRADE DOES: the addendum is derived exclusively from a template render diff (`derive_addendum_fragment`, `upgrade-level.sh:93-112`); the appended blocks are not template content, and nothing in the script appends them.
- CONSEQUENCE: a packet upgraded to Level 3 has no AI-protocol markers in plan.md and no validation-counts block in spec.md, while a fresh Level 3 scaffold has both — section-level parity gap between the two creation paths. Hand-verified that no consumer is reached within this budget (iteration 3 covers `check-placeholders.sh`, which may or may not read the counts block).
- SEVERITY: P2 (cosmetic until a consumer is found; the parity difference itself is real and undocumented).
- RECOMMENDATION: document — either the appended blocks are scaffold-coaching only (say so in create.sh, and upgrade is correct to skip them) or a rule consumes them (then upgrade must append them too).

### f-iter002-004 [P2] — `template_for_doc` covers five documents, none of the lifecycle document
- THE CLAIM (design side): the upgrade "can never drift from the templates the scaffolder uses" (`upgrade-level.sh:51-54`) because it renders the same templates.
- WHAT THE CODE DOES: `template_for_doc` (`:57-65`) maps exactly five docs — spec, plan, tasks, decision-record, acceptance-criteria — so the drift-proof claim holds only for those five. `implementation-summary.md.tmpl` (the lifecycle document at every level, `create.sh:450`) is outside the mapping, so the upgrade both fails to create it (f-iter002-001) and would silently skip it in any future diff-driven step.
- SEVERITY: P2 (the claim overstates its own coverage; the missing entry is the root of f-iter002-001).
- RECOMMENDATION: fix — fold into f-iter002-001's fix; the comment at `:51-54` should name the five docs or the whole set.

## Verified correct on this angle

- The diff-driven addendum design (`upgrade-level.sh:93-112` + `filter_sections_absent_from` `:81-91`) derives added sections from renders of the same templates the scaffolder uses, so section parity for spec/plan/tasks is by construction — the mechanism intended by the comment at `:51-54` holds for the five mapped docs.
- `acceptance-criteria.md` on 1→2 matches the manifest: it is the single `optionalAddonDocs` member at Level 2 (`spec-kit-docs.json:517`, `create.sh:455-457` writes it at scaffold), so the upgrade and a fresh Level 2 scaffold agree here.
- The upgrade detects current level by `SPECKIT_LEVEL` marker with `decision-record.md` fallback inference (`upgrade-level.sh:338`) and validates upward-only paths (`:358-376`) — no invalid-path defect found in the parts read.
- Backup/restore around upgrades (`:401-490`) is symmetric and conservative; no scope issue in the parts read.

## Open questions

1. Does any rule consume `SCAFFOLD_VALIDATION_COUNTS` / `SCAFFOLD_AI_PROTOCOL_MARKERS` (iteration 3's `check-placeholders.sh` likely answers for the counts block)?
2. `create_new_files` line numbers for the exact 1→2/2→3 branch conditions — verified by function region (`:745-830`), not read line-by-line within budget.
3. Whether the 3→3+ upgrade (`:1142`) also creates files, and whether it keeps parity — not part of the mandated 1→2/2→3 comparison but adjacent.
