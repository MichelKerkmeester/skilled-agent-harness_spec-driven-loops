# Iteration 005 — KQ5: the most-automated per-surface layer + the timing-tier topology

**Focus:** Ground the host substrate for every prior finding, reconcile against what already ships, and name the single most-automated out-of-the-box layer per surface.

## Findings

### F5.1 — KEYSTONE REFRAME: DQ enforcement has THREE timing tiers; the scheduled tier is empty
Reconciling all prior findings against the actual enforcement substrate reveals a clean three-tier topology:
1. **on-write (pre-commit)** — 5 blocking gates in `.git/hooks/pre-commit`: doc-model-refs (advisory), comment-hygiene, prompt-card-sync, MCP-mutation-class, tool-ownership. Instant, local, staged-file-scoped. `[SOURCE: .git/hooks/pre-commit:4-112]`
2. **PR-time (CI)** — **8 GitHub Actions**, every one `on: pull_request` to main with `paths:` filters: skill-doc-frontmatter, routing-registry-drift, markdown-link-integrity, prompt-card-sync, comment-hygiene, agent-mirror-sync, rule-canary-sync, isolation-check. `[SOURCE: .github/workflows/*.yml; grep on: → all pull_request]`
3. **scheduled (cron)** — **ZERO.** No workflow carries `on: schedule`; the grep for `schedule:`/`cron:` is empty. `[SOURCE: grep "schedule:|cron:" .github/workflows → 0 hits]`
- **This is the lineage's central correction + validation.** It *corrects* dq-deep B1's premise ("no scheduled/hook invocation exists today; all retroactive tools are operator-run") — a rich PR-time CI tier demonstrably exists. But it *validates* dq-deep B1's conclusion and sharpens it to a fact: the **scheduled tier specifically is the one timing slot with zero coverage**. Every shipped gate is **change-triggered** (pre-commit on staged files; CI on PR-changed `paths`). Nothing sweeps the whole corpus on a cadence.
- **Why change-triggered is insufficient (the precise gap):** (a) a path the CI filter doesn't match escapes — e.g. `skill-doc-frontmatter.yml` watches only `references/**`+`assets/**`, so a **SKILL.md hub** edit is never frontmatter-checked; (b) latent defects in files untouched since a rule was added are never re-swept (the retroactive-backfill blind spot); (c) cross-surface coherence spanning multiple `paths` roots never fires from a single-root PR. The most-automated layer = the scheduled sweep that closes all three, which is exactly dq-deep B1 — now grounded as the unique empty tier rather than asserted.

### F5.2 — Per-surface coverage map: what ships, what is the surgical gap
Checking each prior finding against the pre-commit + CI tiers narrows every "wire it up" into a surgical gap:

| Surface | Already enforced | Surgical gap (most-automated add) |
|---------|------------------|-----------------------------------|
| SKILL DOCS frontmatter | CI `skill-doc-frontmatter.yml` covers **references/assets** (355/355 conformant 2026-06-11) | **SKILL.md HUB** excluded by path filter → extend `check-skill-doc-frontmatter.sh --coverage` to the hub: version-grammar + field-uniformity (F1.1) |
| SKILL DOCS routing/graph | CI `routing-registry-drift.yml` asserts **registry ↔ advisor-map parity** | content-derived **skill-graph drift** (keywords↔graph) + **signal collision** ungated (F1.2/F2.2) → scheduled sweep + `advisor_rebuild`→`advisor_validate` on hub write |
| SKILL DOCS wikilinks | CI `markdown-link-integrity.yml` + `check-links.sh` (fence-aware) | built AND CI-wired; only **pre-commit (instant)** timing missing (F2.3 fully corrected: not a build, not even a CI gap — a timing add) |
| COMMANDS | pre-commit MCP-mutation-class; CI prompt-card-sync; route-validate (doctor only) | **generalize route-validate's 8 assertions** beyond doctor → new `command-router-contract.yml` + the missing **workflow-YAML schema** gate (F3.1/F3.3) |
| CONTEXT-ENG triggers | none | **triple-copy trigger-vocabulary coherence** (CLAUDE.md ↔ gate-3-classifier ↔ prompt-policy) ungated by any tier (F4.1) → pre-commit diff + scheduled sweep |
| CONTEXT-ENG hook | manual playbook | automate `skill_advisor_hook_validation.md` assertions as an on-write contract test (F4.2) |

### F5.3 — The scheduled sweep is the multiplier; the per-surface detectors are its payload
The most-automated architecture is not N independent gates but **one scheduled corpus sweep that runs every per-surface detector** (F1–F4) in report-then-guarded-fix mode, paired with **pre-commit fast-fail** for the cheap deterministic subset and **CI path gates** for change-scoped enforcement. This is dq-deep B1+B2 (scheduled sweep + guarded `/doctor` auto-fix) instantiated with this lineage's concrete payload: hub-frontmatter grammar, skill-graph collision, command-router contract, workflow-YAML schema, and trigger-vocabulary coherence — none of which any of the three tiers covers today. The destructive-auto-fix rail (dq-deep RISK) carries unchanged: content-removing fixes stay report-only on authored docs.

## Dead Ends / Ruled Out
- **dq-deep B1's premise that no retroactive automation exists** — 8 PR-time CI workflows exist; the gap is the *scheduled* tier and the *uncovered surfaces*, not retroactive automation wholesale. `[SOURCE: .github/workflows/ → 8 files]`
- **"Add one big gate" framing** — the existing topology proves per-surface, path-scoped detectors are the idiom; the multiplier is the missing cron tier, not a monolith.

## Assessment
- **newInfoRatio:** 0.70 — the three-tier topology with the empirically-empty cron tier reframes the entire program and converts every prior "wire it up" into a surgical, file:line-grounded gap; corrects a prior-lineage keystone premise.
- **Novelty justification:** the timing-tier topology and the per-surface coverage map are net-new structural findings that no prior lineage reached.
- Questions answered: KQ5 (and consolidates KQ1-4 against the real substrate).
