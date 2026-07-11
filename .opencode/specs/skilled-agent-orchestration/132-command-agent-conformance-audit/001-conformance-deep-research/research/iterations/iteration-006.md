# Iteration 6: Compiled Deep Contracts, Doctor Presentation Menu, and Dead Advisor Wiring

## Focus

Batch 2 (deeper): compiled deep contracts (`deep/assets/compiled/*.contract.md` + `manifest.jsonl`) vs their source; auto/confirm YAML `mutation_boundaries` + gate completeness + `validate_targets`; presentation `.txt` delegated-surface completeness + option-letter consistency vs router/YAML; argv/flag-isolation discipline in routers; advisor `trigger_phrases` collisions across commands+doctor routes; prompt-injection hygiene. Re-examined the batch-1 `skill-graph-freshness` omission for adjacent instances and widened to presentation-layer and advisor-wiring classes.

## Actions Taken

1. Read `deep/assets/compiled/manifest.jsonl` (123 rows) and diffed the last recorded `compiledContractSha256` per command against the live sha256 of each `.contract.md` file on disk; found a live drift for `deep/ai-council`.
2. Parsed the `GENERATED_COMMAND_CONTRACT_HEADER` `sourceDigests` block embedded in all three compiled contracts and recomputed sha256 for every listed source path, confirming or refuting staleness against real file content (not just mtimes).
3. Cross-referenced `git log` for the drifted source paths against the compiled-contract generation timestamp (Jul 8 23:44) to confirm the drift reflects real post-compile commits, not tooling noise.
4. Enumerated `mutation_boundaries:` blocks across all ten `doctor/assets/doctor_*.yaml` route workflows and all 23 `*_confirm.yaml` mutating-command workflows outside `/doctor`, to test gate-completeness parity.
5. Read `doctor_speckit_presentation.txt` startup menu, unknown-target failure text, and subsystem manifest table, and diffed both against the 10-route `_routes.yaml` manifest.
6. Traced the advisor's lexical trigger-phrase harvesting code path (`_load_doc_trigger_phrases`, `_DOC_HARVEST_SUBDIRS`) to determine whether `doctor/_routes.yaml` `trigger_phrases:` fields are ever actually consumed, given the file's own header claims "Consumed by: Skill Advisor lexical lane."
7. Checked deep-research/-review/-ai-council auto/confirm YAML and SKILL.md/reference docs for the prompt-injection "treat fetched/untrusted content as data" clause, gated on each mode's actual `WebFetch`/external-content exposure.

## Findings

### Doctor

#### P0: Doctor presentation startup menu and subsystem table both omit the `skill-graph-freshness` target, making it unreachable by numbered selection

`doctor_speckit_presentation.txt`'s Section 1 startup menu (`.opencode/commands/doctor/assets/doctor_speckit_presentation.txt:8-40`) numbers targets 1-10 but only ever maps to nine `_routes.yaml` targets (`memory`, `embeddings`, `causal-graph`, `code-graph`, `deep-loop`, `skill-advisor`, `skill-budget`, `parent-skill`, `fable-mode`) — `skill-graph-freshness` has no menu number at all, and option `10)` is bound to `fable-mode`. The Section 2 "Subsystem Manifest Display" table (`doctor_speckit_presentation.txt:96-105`) repeats the same nine-row omission. This is more severe than the iteration-1 `speckit.md` table gap: a user who does not already know the exact string `skill-graph-freshness` cannot reach it through the documented `H`-help-driven numbered flow at all, only via typing the literal target name blind. [SOURCE: .opencode/commands/doctor/assets/doctor_speckit_presentation.txt:8-40] [SOURCE: .opencode/commands/doctor/assets/doctor_speckit_presentation.txt:96-105] [SOURCE: .opencode/commands/doctor/_routes.yaml:171-184] [SOURCE: .opencode/commands/doctor/assets/doctor_skill-graph-freshness.yaml:1-6]

Concrete fix: add an `11) Audit Skill-Graph Freshness` menu row (renumbering `0` full-sweep to stay last), a matching accepted-answer table row, a Help Block symptom line, and a ninth-to-tenth manifest-table row, then generate/validate this file from `_routes.yaml` alongside the `speckit.md` table fix already tracked from iteration 1.

#### P1: `doctor/_routes.yaml` `trigger_phrases:` are documented as advisor-consumed but are never read by the advisor's lexical harvester

The file's own header comment says `# Consumed by: Skill Advisor lexical lane (per-target trigger_phrases)`, but `_load_doc_trigger_phrases` in `skill_advisor.py` only walks `_DOC_HARVEST_SUBDIRS = ("references", "assets")` under each skill directory in `SKILLS_DIR` (`.opencode/skills/*`), and only parses `trigger_phrases:` frontmatter blocks inside `.md` files there. `.opencode/commands/doctor/_routes.yaml` is a `.yaml` file living under `.opencode/commands/`, outside both the harvested subdirectory names and the skills root, so none of the ten routes' `trigger_phrases` lists (40 phrases total, e.g. `"skill graph freshness"`, `"causal graph doctor"`, `"deep-loop graph rebuild"`) ever reach the advisor's signal map. `route-validate.py` enforces the field is non-empty (`G1`) purely as schema hygiene, giving false confidence that these phrases do something. [SOURCE: .opencode/commands/doctor/_routes.yaml:1-24] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:810,849-871] [SOURCE: .opencode/commands/doctor/scripts/route-validate.py:46,243-245]

Concrete fix: either (a) wire a doctor-routes harvester into `skill_advisor.py`'s signal-map builder so these phrases actually influence Gate-2 lexical routing to `/doctor <target>`, or (b) rewrite the header comment and remove the misleading `# Consumed by:` claim and the false-confidence `G1` validator framing, and document that `/doctor` routing is presentation-menu-driven only.

#### P2: `doctor_fable-mode.yaml` lacks the structured `mutation_boundaries:` block present in all nine sibling doctor route workflows

Every other `doctor_*.yaml` (`memory`, `embeddings`, `causal-graph`, `code-graph`, `deep-loop`, `skill-advisor`, `skill-budget`, `parent-skill`, `skill-graph-freshness`) declares a machine-checkable `mutation_boundaries:` block with `allowed_targets`/`forbidden_targets`/`invariant` keys. `doctor_fable-mode.yaml` instead has only a prose `read_only_invariant:` string with the same semantic intent but no structured `allowed_targets: []` / `forbidden_targets:` fields, breaking the uniform shape any future automated mutation-class auditor would need to parse across all ten routes. [SOURCE: .opencode/commands/doctor/assets/doctor_fable-mode.yaml:20-24] [SOURCE: .opencode/commands/doctor/assets/doctor_embeddings.yaml:34-40]

Concrete fix: replace the prose `read_only_invariant:` with a `mutation_boundaries:` block matching the sibling schema (`read_only: true`, `allowed_targets: []`, `forbidden_targets: ["**/*"]`, `invariant: <same prose>`), preserving the existing wording as the `invariant` value.

### Commands (cross-surface deep)

#### P0: All three compiled deep contracts (`deep/research`, `deep/review`, `deep/ai-council`) are stale against their recorded `sourceDigests`, and `deep/ai-council`'s on-disk contract additionally mismatches its own manifest's last recorded hash

Each `.contract.md` embeds a `GENERATED_COMMAND_CONTRACT_HEADER` with `sourceDigests[].sha256` recorded at generation time (Jul 8 23:44). Recomputing sha256 for every listed source path against the current working tree shows real mismatches for all three contracts: `system-deep-loop/mode-registry.json` and `system-deep-loop/SKILL.md` changed under all three; `deep-research/SKILL.md`, `deep-review/SKILL.md`, and `deep-ai-council/SKILL.md` plus two `deep-ai-council` reference docs also changed. `git log` on these paths shows real post-compile commits (`df87a69e2c`, `c2b6175356`, `c425653a1e` — mode-registry and SKILL.md edits), confirming this is genuine content drift, not a false positive from timestamp noise. Separately, `deep/ai-council.contract.md`'s current on-disk sha256 (`73e9ac91...`) does not match the `compiledContractSha256` of its own last manifest row (`a277a2ad...`), meaning the file was edited or independently regenerated after the last `render-command-contract.cjs --command deep/ai-council` invocation recorded it — the manifest and the file it's supposed to describe have silently diverged. No CI/pre-commit hook re-runs `compile-command-contracts.cjs` when its declared sources change; `render-command-contract.cjs` (the runtime-facing script referenced in the manifest) does not consult `sourceDigests` at all, so runtime dispatch never surfaces this staleness. [SOURCE: .opencode/commands/deep/assets/compiled/deep_research.contract.md:1-60] [SOURCE: .opencode/commands/deep/assets/compiled/deep_review.contract.md] [SOURCE: .opencode/commands/deep/assets/compiled/deep_ai-council.contract.md] [SOURCE: .opencode/commands/deep/assets/compiled/manifest.jsonl:last-ai-council-row] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:66-73]

Concrete fix: re-run `node .opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/research|deep/review|deep/ai-council` for all three commands to regenerate current `sourceDigests` and contract bodies; add a pre-commit or CI check that recomputes `sourceDigests` sha256 against working-tree content and fails when stale; separately investigate why `deep_ai-council.contract.md`'s on-disk bytes don't match its own manifest's last row (possible manual edit or an out-of-band regeneration that bypassed `appendManifestRow`).

### Cross-Surface

#### P2: No auto/confirm YAML outside `/doctor` declares a structured `mutation_boundaries:` block, unlike every doctor route workflow

All 23 mutating `*_confirm.yaml` files across `create/`, `design/`, `speckit/`, and `deep/` (e.g. `create_agent_confirm.yaml`, `design_audit_confirm.yaml`, `speckit_implement_confirm.yaml`, `deep_research_confirm.yaml`) rely on prose `role:`/`purpose:`/`approval_gates:` sections and, in `deep_research_confirm.yaml`, a `forbidden_operations:` list, but none uses the `mutation_boundaries:` schema (`allowed_targets`/`forbidden_targets`/`invariant`) that all ten doctor routes share. This is a structural inconsistency rather than a confirmed safety gap — the doctor family is Read-heavy/diagnostic and benefits from an explicit machine-checkable boundary, while `create`/`design`/`speckit`/`deep` commands are write-oriented and gate through `approval_gates:` instead — but it means any future automated "does this workflow declare its blast radius" auditor would need two different schemas, and the doctor pattern is not otherwise documented as doctor-specific.

Concrete fix: either document `mutation_boundaries:` as a doctor-family-specific convention (distinct from the `approval_gates:`/`forbidden_operations:` pattern used elsewhere) in a shared workflow-YAML schema reference, or adopt the same block in the highest-risk non-doctor confirm workflows (`create_agent_confirm.yaml`, `speckit_implement_confirm.yaml`) as a stronger structural guarantee.

## Questions Answered

- Do compiled deep contracts match their declared sources? No — all three (`deep/research`, `deep/review`, `deep/ai-council`) have real post-compile source drift confirmed via git history, and `deep/ai-council`'s on-disk file additionally mismatches its own manifest's last recorded hash.
- Does every doctor route have full route<->yaml mutation-class honesty? Nine of ten do; `fable-mode` uses an equivalent but non-structured prose invariant instead of the shared `mutation_boundaries:` schema.
- Are advisor trigger-phrase collisions present across commands+doctor routes? The only lexical overlap found (`skill graph freshness` phrase text vs `system-skill-advisor` SKILL.md prose) is inert because doctor `_routes.yaml` phrases are never harvested by the advisor at all — this is a dead-wiring defect, not a live collision.
- Is the doctor presentation `.txt` complete relative to `_routes.yaml`? No — both the numbered startup menu and the subsystem table omit `skill-graph-freshness`, which is a functional reachability gap beyond the `speckit.md` documentation-table gap found in iteration 1.
- Does argv/flag-isolation discipline generalize beyond `/doctor`? No comparable multi-target flag-isolation router exists elsewhere (`/doctor:mcp` is a simple two-branch install|debug router with no cross-target flag ambiguity risk); this line of inquiry is doctor-specific and already covered.
- Is prompt-injection hygiene present where warranted? Yes for `deep-research` (explicit clause, gated on its `WebFetch` grant) and `deep-review` (equivalent "treat as untrusted" framing for arbitrary review targets); `deep-ai-council` correctly has neither the clause nor a `WebFetch` grant, so no gap exists there.

## Questions Remaining

- Should `compile-command-contracts.cjs` be wired into a pre-commit/CI hook keyed on the same source paths it digests, and who owns triggering re-compilation when `mode-registry.json` or a mode `SKILL.md` changes?
- Should doctor `_routes.yaml` trigger_phrases be actively wired into the advisor's signal map, or is the presentation-menu-driven dispatch intentionally exempt from Gate-2 lexical routing (and the header comment simply wrong)?
- Which remaining router-level allowed-tool grants are unused overgrants after route-specific reconciliation? (carried forward, unaddressed this iteration)
- Should create-agent call the system-spec-kit command workflow directly, or should a new typed handoff field replace the retired `speckit.md` agent lookup? (carried forward)
- Should `mutation_boundaries:` become a cross-family workflow-YAML convention, or is it correctly doctor-specific alongside `approval_gates:`/`forbidden_operations:` elsewhere?

## Sources Consulted

- `.opencode/commands/deep/assets/compiled/*.contract.md`, `manifest.jsonl`
- `.opencode/skills/system-deep-loop/runtime/scripts/{compile-command-contracts.cjs,render-command-contract.cjs}`
- `.opencode/skills/system-deep-loop/{mode-registry.json,SKILL.md,deep-research/SKILL.md,deep-review/SKILL.md,deep-ai-council/SKILL.md,deep-ai-council/references/**}`
- `.opencode/commands/doctor/{_routes.yaml,speckit.md,assets/doctor_*.yaml,assets/doctor_speckit_presentation.txt}`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
- `.opencode/commands/doctor/scripts/route-validate.py`
- `.opencode/commands/{create,design,speckit,deep}/assets/*_confirm.yaml`
- `git log` for drifted source paths

## Assessment

- `newInfoRatio`: 0.74
- Novelty justification: confirmed genuine (git-verified, not mtime-noise) compiled-contract staleness across all three deep commands plus a manifest/on-disk mismatch for ai-council; found the doctor presentation menu has a worse reachability gap than the already-known table gap; discovered the doctor `_routes.yaml` trigger_phrases are entirely dead wiring rather than a live collision risk; and surfaced a cross-family mutation-boundary schema inconsistency. Four of five focus sub-areas (compiled contracts, mutation boundaries, presentation completeness, advisor collisions) yielded confirmed findings; argv/flag-isolation ruled out as doctor-specific and already covered.
- Confidence: high for the compiled-contract drift (sha256-verified against working tree plus git-log-confirmed commits) and the advisor dead-wiring (code-path-traced, not inferred); high for the presentation menu gap (direct read); medium for the mutation-boundary schema-inconsistency severity, since it may be an intentional doctor-only convention rather than a gap.

## Reflection

- Worked: recomputing sha256 against the embedded `sourceDigests` header (rather than trusting file mtimes) turned a suspected-stale claim into a git-log-confirmed one; tracing the advisor's actual harvest code path (rather than trusting the `_routes.yaml` header comment) converted an assumed collision risk into a definitively dead-wiring finding.
- Failed: an initial mtime-only comparison of contract vs legacy-body files would have missed the ai-council manifest/on-disk mismatch entirely, since mtimes alone don't reveal which of two divergent byte sequences is authoritative — the sha256-against-manifest-row check was necessary.
- Ruled out: `/doctor:mcp` and `/doctor:update` as candidates for the same argv/flag-isolation class as `/doctor <target>` — both are simple two-branch routers without the multi-target cross-flag-injection risk that motivates `_routes.yaml`'s target-first parsing rule; `deep-ai-council`'s lack of a prompt-injection clause is correct behavior, not a gap, since it has no `WebFetch` grant or untrusted-content exposure.

## Next Focus

Iteration 7 should mechanically reconcile every non-doctor command's `:auto`/`:confirm` YAML against its command Markdown and presentation `.txt` field-by-field (argument flags, mode suffixes, allowed-tools union) for the `create/` and `speckit/` families not yet covered by iteration 4's deep-family pass, and separately resolve whether the compiled-contract staleness found this iteration is isolated to `system-deep-loop`'s three commands or recurs anywhere else a `GENERATED_COMMAND_CONTRACT_HEADER` pattern exists.
