# Deep Research Strategy — glm-5-3-flash-overengineering

Session: fanout-glm-5-3-flash-overengineering-1788746122749-wk19z4 | generation 1 | lineageMode: new | stopPolicy: max-iterations (cap 10) | convergenceThreshold: 3 (telemetry-only; see config `_thresholdNotes`)

## Topic

Overengineering stress-test of system-spec-kit (spec-authoring skill + its command surface + the root governance layer that constrains it), judged only against: better output, better AI adherence in practice, lower maintenance. Evidence strictly from the paths in `deep-research-config.json` → `evidenceBoundary`. Nothing outside those paths is evidence.

## Research Charter

### Role
Systems auditor (not a style reviewer). A rule, doc, gate, or abstraction earns its keep only by visibly improving one of the three outcomes on real packets; absence of harm is not justification.

### Required output shape per finding
`path:line; what exists; its cost (reads, steps, maintenance); what it protects; severity P1|P2; recommendation: remove|merge|fold into a repo rule|keep` — with exact cited evidence. No "feels heavy" claims.

### Non-Goals
- No edits: research only; implementation is a separate follow-up.
- No recommendation that drops a documented, validated capability (check against feature-catalog before any cut).
- No prose-style or tone commentary.
- No tooling execution: do NOT run generate-context.js, validate.sh (especially --recursive), or any git write/checkout/commit; reading and counted greps are the only evidence operations.
- Reads outside the evidenceBoundary are not evidence.

### Stop Conditions
- 10 iterations completed → synthesis with stopReason `maxIterationsReached` (hard; prompt-mandated even if convergence telemetry fires earlier).
- 3 consecutive iteration failures (iteration file missing/empty, state record rejected, evidence path unreadable) → stuck recovery; if recovery iteration also fails, halt to synthesis with gaps documented.
- Target evidence tree missing/unreadable → error, halt with evidence.

## Key Questions (8 — one per mandated audit angle)

1. **KQ1 (angle 1a)**: Which of the validator rules (reported as 39) exist, and which fire on real packets vs never fire?
2. **KQ2 (angle 1b)**: Which validator-side capability flags, freshness checks, and rule pairs duplicate each other or guard nothing?
3. **KQ3 (angle 2)**: How much of the six-runtime hook matrix (runtime/hooks: opencode, claude, codex, cursor, pi, devin — adapters, spec gate, completion evidence, session hooks) is parity scaffolding for unused runtimes?
4. **KQ4 (angle 3)**: What documentation volume (references/, feature-catalog, manual-testing-playbook) exceeds what an agent must actually read, and which docs restate each other?
5. **KQ5 (angle 4)**: Which /speckit:* command YAML workflows and assets carry dead steps post memory-decommission?
6. **KQ6 (angle 5)**: Which spec-kit procedure in root AGENTS.md/CLAUDE.md could a repo rule (repo-rules/*.md) or the skill itself own instead?
7. **KQ7 (angle 6)**: Which single-consumer abstractions (seams, registries, allowlists, telemetry stores, capability flags) guard nothing?
8. **KQ8 (angle 8)**: What is the ranked simplification plan — capability preserved, files touched, risk, expected gain per outcome?

## Known Context (init reconnaissance, 2026-09-07T02:01Z)

- Target skill: 2,094 files total; 959 markdown files; 83,372 markdown lines (counted via find/wc).
- Skill roots: `.opencode/skills/system-spec-kit/{SKILL.md, ARCHITECTURE.md, README.md, feature-catalog/ (feature-catalog.md = 792 lines), manual-testing-playbook/, references/ (10 subdirs: memory, config, debugging, workflows, cli, retrieval, templates, structure, validation + root), runtime/ (cli, lib, hooks, core, tests, stress-test), shared/}`.
- Runtime hooks tree: `.opencode/skills/system-spec-kit/runtime/hooks/{opencode,claude,codex,cursor,pi,devin,lib,shared-provenance.ts,README.md}` — six runtime adapters confirmed.
- Command surface: `.opencode/commands/speckit/{complete.md,implement.md,plan.md,resume.md,save.md,search.md,README.txt,assets/}`.
- Validation: `.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh` + `progressive-validate.sh`; shell rule checks under `.opencode/skills/system-spec-kit/runtime/cli/rules/` (≈31 entries incl. helpers/README; orchestrator-registered rule count to be verified — dispatch prompt claims 39).
- Governance: root `AGENTS.md`, `CLAUDE.md`, `REPO RULES.md`, `repo-rules/` (10 rule files: blast-radius, communication, delegation-and-orchestration, evidence-and-proof, prevent-overengineering, root-cause-and-debugging, scope-discipline, skill-hub-routing, uncertainty-and-honesty).
- Restraint ladder: `.opencode/skills/sk-code/shared/references/universal/code-quality-standards.md` §1.

## Machine Sections (reducer-owned)

### key-questions
KQ1..KQ8 above.

### answered-questions
- KQ1 partial (run 1): the 39-rule registry inventoried — 32 error/5 warn/2 info, 5:1 CANONICAL_SAVE multiplex, 2-of-3 category display loop (see iterations/iteration-001.md).
- KQ5 answered (run 5): covenant enforced end-to-end (generator emits metadata pair only; complete-auto.yaml:1175 forbidden-guard); residue = F18 phantom dashboards (complete.md:92 promises 6, workflows 0, 3 mechanismless) + F20 level_contract_optional_*.md naming (6+ occurrences, 0 resolutions).
- KQ2 partial (run 2): 22/39 rows conditioned on flow-specific surfaces; 10 rows -> 2 implementations (two 5:1 multiplexes); severity vocabulary triple-tracked (registry JSON, orchestrator TS, validate.sh:46-64); skip variant 0/39; 31/39 rows carry ~75 legacy aliases (see iterations/iteration-002.md).

### what-worked
- Init recon: find/wc sizing gave the 83k-line documentation magnitude in one call (baseline for KQ4).
- Run 1: the registry JSON is single-source enough that 4 aggregations (count, category, severity, multiplex) came from one 410-line dump + 3 node one-liners — no rule-body reads needed for the inventory.

### what-failed
- (nothing yet; run 1 clean)

### exhausted-approaches
- (none yet)

### ruled-out-directions
- (none yet)

### divergence-frontier
- (none yet)

### next-focus
Iteration 6 (run 6): **Root governance vs. skill/repo-rule ownership (KQ6)** — root AGENTS.md vs CLAUDE.md: dual-maintenance check (are they the same procedure twice?); which spec-kit procedure blocks in the root docs (spec-folder mechanics, completion verification, freshness) restate what the skill's SKILL.md/validate.sh or a repo rule (repo-rules/*.md) owns. Fold-into-a-repo-rule candidates must name the owning rule file.
- (completed runs 1-5: rule inventory; duplication census; hook-matrix cost; documentation decomposition; command-surface covenant audit)

## Active Risks

- convergenceThreshold=3 exceeds the 0..1 novelty scale → novelty STOP unreachable by design; loop must run to the cap (prompt-mandated). Mitigation: 10 pre-planned, non-overlapping iteration foci (broadening by construction).
- 83k lines of target prose: risk of reads exploding past budget. Mitigation: targeted greps + wc counts; read only cited ranges.
