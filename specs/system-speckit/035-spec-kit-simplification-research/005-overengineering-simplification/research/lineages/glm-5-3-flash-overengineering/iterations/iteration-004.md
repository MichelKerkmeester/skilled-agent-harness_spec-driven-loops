# Iteration 004 — Documentation volume: what must actually be read vs what merely exists (KQ4)

Session: fanout-glm-5-3-flash-overengineering-1788746122749-wk19z4 | run 4 | focus: references/feature-catalog/playbook volume vs agent-required reading; restated contracts
Evidence reads: subtree md counts (`find|wc`), largest-doc census, SKILL.md:95 routing paragraph, README.md:645 pointer, feature-catalog.md:514 + orchestrator.ts:984. Reads cost: 3 shell calls.

## The measured corpus

**83,372 md lines / 959 files** (system-spec-kit skill tree, non-node_modules): runtime 30,634 (473 files — test fixtures dominate), manual-testing-playbook 11,839 (85), references 12,890 (41), changelog 9,807 (108), templates 5,767 (33), feature-catalog 4,528 (47), shared 1,761 (13), benchmark 3,461 (151), assets 1,179 (4), config 74 (1), plus root trio SKILL.md 551 + ARCHITECTURE.md 207 + README.md 674 = 1,432.

**What the skill's own routing covenant actually selects:** the "typed leaf projection" paragraph (SKILL.md:95, ~250 words) declares that the router routes ONLY into `references/` + `assets/`; `feature-catalog/` + `manual-testing-playbook/` are "runtime-engine capability docs and behavior-test fixtures — no RESOURCE_MAP intent selects them". Of references/ (41 files), SKILL.md's RESOURCE_MAP + §5 route 14 (all 14 of deep-research's references are routed; for system-spec-kit the 41 include deeper trees). The changelog (9,807), benchmark (3,461) and playbook (11,839) = **25,107 lines = 30% of the corpus, selected by no intent**.

## Findings

**F14 [P1 — clear waste] The severity/strict vocabulary — one semantic — is owned by at least five in-tree sites, and the display copy has already drifted.**
- Where: (1) `runtime/cli/lib/validator-registry.json` (per-row `severity`/`strict_only`/`description`); (2) `runtime/lib/validation/orchestrator.ts:106-111,293-300` (type + status mapper) + `:984-988` ("A warning is advice…" comment); (3) `runtime/cli/spec/validate.sh:46-64` (help printer re-derives the `[severity][strict-only]` display; its category loop lists 2 of 3 — the drift, cf. F2/F9); (4) `feature-catalog/feature-catalog.md:514` ("`--strict` selects which rules run; a warning is advice…"); (5) `references/validation/validation-rules.md:36-48` ("Severity Levels" prose section). The root governance doc adds a 6th.
- Cost: one semantics change = 5+ coordinated edits across 3 file formats (JSON data, TS logic, 3 prose copies); the printer's 2-of-3 category loop is the cost already cashed. Reads: every validation discussion re-reads the vocabulary in 2-3 of these sites.
- Protects: the strict-vs-warn gating semantics and its display; the prose copies exist to explain, the registry to enforce.
- Recommendation: **merge** — keep the registry as the single authority (README.md:645 already declares it), make the help printer consume the report's own summary, and reduce the prose sites to pointers ("see the 39-rule registry").

**F15 [P2 — candidate] The routing covenant taxes every docs edit with two more artifacts — machinery protecting the documentation, not the work.**
- Where: `SKILL.md:95` — four coordinated artifacts (`leaf-manifest.json`, `leaf-manifest.config.json`, `leaf-aliases.json`, `generate-leaf-manifest.cjs --check`) + the regeneration covenant ("keep in sync whenever the references/ or assets/ corpus changes"), validated "byte-stable under --check".
- Cost: every reference/asset edit = regenerate 2 generated files + re-run 1 check, or the typed-identity invariant breaks. This is maintenance overhead paid by documentation changes — the corpus's largest affected surface.
- Protects: deterministic router replay and typed `(skill, leafResourceId)` pairs for the fleet-audit tooling (a genuinely validated capability per the paragraph).
- Recommendation: **keep**, flagged for the run-9 census: if the --check never reports a miss on real edits (adherence evidence), the covenant is ceremony whose failure mode is invisible.

**F16 [P2 — candidate] `validation-rules.md` (729 lines) correctly self-declares non-authority (README.md:645: "the 39-rule registry is authoritative") — yet its "Severity Levels" section (36-48) restates the vocabulary anyway, becoming the fifth ownership site.**
- Where: `references/validation/validation-rules.md:36-48` vs `README.md:645` vs `validator-registry.json`.
- Cost: the fifth copy of F14's semantic; readers of the reference doc get the semantics from prose that cannot be updated without the other four.
- Recommendation: **merge** — replace :36-48 with a pointer to the registry; retain the per-rule deep dives (AC_CLOSURE:67, the CONTINUITY_FRESHNESS rollout+fix procedure :111-137), which are the only instructional prose those rules have.

**F17 [P2 — candidate] One numeric default (0.05 novelty) is written in 8+ places: the stop contract's duplication IS the design, and its cost is 8+ edits per retune.**
- Where: `system-deep-loop/deep-research/SKILL.md` ("Default: 0.05… NOT INTERCHANGEABLE with siblings"), `references/convergence/convergence.md`, `references/convergence/convergence-signals.md`, `references/state/state-jsonl.md`, `references/guides/quick-reference.md`, `references/protocol/loop-protocol.md`, the config asset (`assets/deep-research-config.json` `convergenceThreshold: 0.05`), and 5+ manual-testing-playbook scenario fixtures. (Cited by grep: 8+ files in the single skill match `0.05`.)
- Cost: retuning the default = 8+ coordinated edits, or the sibling-interchangeability warning goes stale.
- Protects: the negative-knowledge novelty semantics; the duplication is deliberate — the value is load-bearing in prose, config, and tests.
- Recommendation: **keep** (documented, validated, deliberately redundant), noting the cost; the covenant's test is whether retunes actually happen (run-9 census).

## Carried corrections

- Earlier "references: 41 files" (run 4 recon) = system-spec-kit's references/; deep-loop's deep-research/references/ = 14 files, ALL 14 routed by SKILL.md — no orphaned references in that skill. The 30%-not-selected mass is changelog+benchmark+playbook, not references.

## Not pursued here

- Whether the playbook's 85 scenario docs restate what `runtime/tests/` vitest suites already assert (candidate duplication) → run 9.
