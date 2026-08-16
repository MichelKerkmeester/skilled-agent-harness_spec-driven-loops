# Additive-Dark Acceptance Review

## Overview

| Field | Observed value |
|---|---|
| Candidate SHA | `cb4209617e58346711efdc6409d568b51eb6c012` |
| Branch | `system-deep-loop/0153-036-innovation-completion` |
| Merge base | `dc3736d584bf9f32707bce9986cad46bfa94b63d` |
| Commits ahead | 25 |
| Initial worktree | Clean |
| Review posture | Independent blocking acceptance review; read-only except this record |

The migration, stress, identity, and type gates are green. The candidate nevertheless fails the highest-priority additive-dark invariant because it changes an active legacy model-benchmark workflow from guarded canonical promotion to advisory-only recommendation and also modifies the promotion helper. This is a production behavior change, not a dark shadow path.

## Command evidence

Commands with relative test paths ran from `.opencode/skills/system-deep-loop/runtime`; all other commands ran from the worktree root.

| # | Verification command | Exit | Result |
|---:|---|---:|---|
| 1 | Candidate-binding shell gate: `git rev-parse HEAD`, `git branch --show-current`, `git merge-base dc3736d584 HEAD`, `git rev-list --count dc3736d584..HEAD`, `git status --short` | 0 | PASS — exact SHA/branch/base, 25 commits, clean before review |
| 2 | Eight-mode/seven-layer non-empty module-and-focused-suite audit over `{deep-research,deep-review,deep-ai-council,deep-improvement-common,agent-improvement,model-benchmark,skill-benchmark,deep-alignment}` × `{ledger-schema,reducers,sealed-artifacts,certificates,resume-adapter,shadow-parity,rollback-gate}` | 0 | PASS — 56 module entry points and focused suites present/non-empty |
| 3 | Production authority audit: `rg -n 'selectAuthorityRoute|AuthorityRegistry|CutoverCoordinator' ...` excluding the future selector and tests, plus live-state assignment scan | 0 | PASS — no production selector consumer and no live/ledger-authoritative assignment |
| 4 | Declared legacy-writer preservation loop: `git diff --quiet dc3736d584..HEAD -- <each LEGACY_DARK_BOUNDARIES source>` | 0 | PASS — all 11 declared legacy authority/writer files exist and are unchanged |
| 5 | Live legacy model-benchmark preservation gate: `git diff --quiet dc3736d584..HEAD -- .opencode/commands/deep/assets/deep-model-benchmark-auto.yaml .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs` | 1 | **FAIL / BLOCK** — both active production files are modified |
| 6 | Initial `npx --no-install vitest run tests/unit/deep-research-rollback-gate.vitest.ts tests/unit/deep-research-shadow-parity.vitest.ts --configLoader runner` | 130 | INCONCLUSIVE — reviewer interrupted before learning the rollback suite legitimately takes about 820 seconds; superseded by rows 7–9 |
| 7 | `npx --no-install vitest run tests/unit/deep-research-shadow-parity.vitest.ts --configLoader runner` | 0 | PASS — 49/49 |
| 8 | `npx --no-install vitest run tests/unit/deep-research-rollback-gate.vitest.ts --configLoader runner` | 0 | PASS — 79/79 |
| 9 | Final exact combined deep-research command from row 6 | 0 | PASS — 2 files, 128/128, 1108.45 s |
| 10 | `npx --no-install vitest run tests/unit/deep-alignment-rollback-gate.vitest.ts tests/unit/deep-alignment-shadow-parity.vitest.ts --configLoader runner` | 0 | PASS — 2 files, 97/97 |
| 11 | `npx --no-install vitest run tests/unit/model-benchmark-rollback-gate.vitest.ts tests/unit/model-benchmark-shadow-parity.vitest.ts --configLoader runner` | 0 | PASS — 2 files, 98/98 |
| 12 | `npx --no-install vitest run tests/unit/agent-improvement-rollback-gate.vitest.ts --configLoader runner` | 0 | PASS — 61/61; cited count matched |
| 13 | `npx --no-install vitest run tests/unit/agent-improvement-shadow-parity.vitest.ts --configLoader runner` | 0 | PASS — 36/36; cited count matched |
| 14 | `npx --no-install vitest run tests/unit/model-benchmark-rollback-gate.vitest.ts --configLoader runner` | 0 | PASS — 58/58; cited count matched |
| 15 | `npx --no-install vitest run tests/unit/model-benchmark-shadow-parity.vitest.ts --configLoader runner` | 0 | PASS — 40/40; cited count matched |
| 16 | `npx --no-install vitest run tests/stress/cli-adapter/ --configLoader runner` | 0 | PASS — 7 files; 133 passed, 7 gated-live skipped |
| 17 | `node tests/stress/cli-adapter/validate-playbook-package.cjs` | 0 | PASS — 98 cells / 98 indexed tests / 98 playbooks; no missing, duplicate, or orphan entries |
| 18 | Cross-mode shared-substrate shell audit over all eight sealed-artifact modules and parity adapters | 0 | PASS — all modes bind shared sealed-reference APIs and verify parity certificates; no competing mode-local store/hash class found |
| 19 | `npx --no-install tsc --noEmit --ignoreDeprecations 6.0` | 0 | PASS |
| 20 | Scope shell gate over `git diff --name-only dc3736d584..HEAD`, deletion scan, and `.opencode` package/lock scan | 0 | PASS — deep-loop program paths only; no deletions; no `.opencode/package.json` or lockfile bump |
| 21 | Initial artifact check: `check_authored_name_kebab.py`, `extract_structure.py`, and auto-detected `validate_document.py` | 1 | REMEDIATED — filename and structure passed; generic validator requested an `Overview` section |
| 22 | Second auto-detected artifact check after adding `Overview` | 1 | ROUTE MISMATCH — generic Markdown defaults to numbered README headings, which do not govern this spec-packet review record |
| 23 | Final artifact check with `validate_document.py <review> --type spec` | 0 | PASS — kebab name, extracted structure, and spec validation with zero issues |
| 24 | Final-state shell gate: exact HEAD, required record fields/final verdict, and `git status --short` singleton check | 0 | PASS — only this authorized review record is new |

## Findings by acceptance claim

### 1. Additive-dark integrity — BLOCK

The ledger-side mechanisms themselves remain dark:

- `DarkLedgerAdapter.recordAfterLegacy` is explicitly called only after the legacy result is final, performs authorization/append inside an isolated `try`, and returns the identical `legacyResult` on deny, failure, and success (`.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/dark-ledger-adapter.ts:110`, `:134-180`).
- The compatibility adapter admits only legacy/shadow/cutover-ready input states, records after the accepted result, catches recorder failures, and always returns `accepted.result` (`.opencode/skills/system-deep-loop/runtime/lib/compatibility-shadow/dual-read-adapter.ts:376-394`, `:396-434`).
- The authority selector declares that it is not wired to a live adapter (`.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/authority-selector.ts:5-8`). The production-consumer scan was empty even though the future selector can represent dark authority in unconnected states (`:71-106`).
- All 11 paths declared as legacy-authoritative boundaries remain present and byte-unchanged from the merge base (`.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/dark-ledger-adapter.ts:21-77`).

However, the broader claim that no live/legacy path changed is false:

- The active command router owns the auto workflow and loads it for `model-benchmark :auto`, then executes the selected asset step-by-step (`.opencode/commands/deep/model-benchmark.md:126-132`, `:138-146`, `:152-155`).
- At the merge base, that live asset specified `promotion: guarded_canonical_only` and an executable `step_promote_candidate` calling `promote-candidate.cjs` (`dc3736d584:.opencode/commands/deep/assets/deep-model-benchmark-auto.yaml:18`, `:195-198`).
- The candidate instead specifies `promotion: advisory_only` and a non-mutating `step_recommend_candidate` (`.opencode/commands/deep/assets/deep-model-benchmark-auto.yaml:18`, `:192-197`). A focused production test enforces that it cannot invoke canonical promotion (`.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/autonomous-promotion-authority.vitest.ts:6-19`).
- The shared live promotion helper is also modified from the merge base, including authenticated receipt and boundary behavior. The explicit preservation gate therefore exits 1.

This change is security-motivated and safer, but it still changes live legacy behavior. Under the supplied rule — any legacy path change blocks additive-dark acceptance — it is an unresolved blocker.

### 2. Mode-migration genuineness — PASS

The static audit found non-empty implementation entry points and focused suites for all 8 modes across all 7 claimed layers (56 combinations). For the required sample, the entry points export real APIs for every layer, for example:

- Deep Research: `.opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/index.ts:5-16`, `deep-research-reducers/index.ts:5-22`, `deep-research-sealed-artifacts/index.ts:5-20`, `deep-research-certificates/index.ts:5-13`, `deep-research-resume-adapter/index.ts:5-14`, `deep-research-shadow-parity/index.ts:9-34`, and `deep-research-rollback-gate/index.ts:5-9`.
- Deep Alignment: `.opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/index.ts:5-16`, `deep-alignment-reducers/index.ts:5-23`, `deep-alignment-sealed-artifacts/index.ts:5-12`, `deep-alignment-certificates/index.ts:5-14`, `deep-alignment-resume-adapter/index.ts:5-15`, `deep-alignment-shadow-parity/index.ts:5-31`, and `deep-alignment-rollback-gate/index.ts:5-9`.
- Model Benchmark: `.opencode/skills/system-deep-loop/runtime/lib/model-benchmark-ledger-schema/index.ts:5-18`, `model-benchmark-reducers/index.ts:5-23`, `model-benchmark-sealed-artifacts/index.ts:5-18`, `model-benchmark-certificates/index.ts:3-14`, `model-benchmark-resume-adapter/index.ts:5-16`, `model-benchmark-shadow-parity/index.ts:5-32`, and `model-benchmark-rollback-gate/index.ts:5-9`.

The focused tests import those actual modules and exercise complete mode gates rather than placeholder assertions: Deep Research (`tests/unit/deep-research-rollback-gate.vitest.ts:36-45`, `:1405-1567`; `deep-research-shadow-parity.vitest.ts:37-95`, `:1187`), Deep Alignment (`deep-alignment-rollback-gate.vitest.ts:40-49`, `:1907-2021`; `deep-alignment-shadow-parity.vitest.ts:33-66`, `:518`), and Model Benchmark (`model-benchmark-rollback-gate.vitest.ts:39-42`, `:195-575`; `model-benchmark-shadow-parity.vitest.ts:37-79`, `:847`). All required combined suites passed.

### 3. No false completion — PASS

Four leaves marked Complete were checked against their exact cited commands:

| Leaf | Documented evidence | Re-run |
|---|---|---|
| Agent Improvement rollback/mode gate | Complete and 61/61 (`specs/system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/005-agent-improvement/007-rollback-and-mode-gate/implementation-summary.md:16`, `:44-46`, `:109`) | 61/61, exit 0 |
| Agent Improvement shadow parity | Complete and 36/36 (`specs/system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/005-agent-improvement/006-shadow-parity/implementation-summary.md:16`, `:45-47`, `:108`) | 36/36, exit 0 |
| Model Benchmark rollback/mode gate | Complete and 58/58 (`specs/system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/006-model-benchmark/007-rollback-and-mode-gate/implementation-summary.md:16`, `:44-46`, `:98-110`) | 58/58, exit 0 |
| Model Benchmark shadow parity | Complete and 40/40 (`specs/system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/006-model-benchmark/006-shadow-parity/implementation-summary.md:16`, `:45-47`, `:99-117`) | 40/40, exit 0 |

No sampled completion claim was false.

### 4. 007/001 genuineness — PASS

The full aggregate produced the expected 133 passing tests plus 7 gated-live skips, and the validator proved the 98/98/98 bijection with no missing, duplicate, or orphan entries.

The cells exercise real dispatch/scheduler code with hermetic transport shims, rather than mocking the orchestration layer:

- The Codex suite requires the production `codex-dispatch.cjs` and `fanout-run.cjs`, then calls `dispatchCodex` (`.opencode/skills/system-deep-loop/runtime/tests/stress/cli-adapter/cli-codex.vitest.ts:51-63`, `:100-115`).
- Fanout tests require and spawn the production `fanout-run.cjs` (`tests/stress/cli-adapter/fanout.vitest.ts:50-64`, `:108-120`; `tests/stress/cli-adapter/fixtures/adapter-fixture.ts:76-89`, `:191-200`).
- The manifest declares 7 subjects × 14 edge rows and materializes their cell paths (`tests/stress/cli-adapter/matrix-manifest.ts:5-32`, `:44-59`). It fail-checks all subject bindings and forbidden overclaim wording (`:134-156`).
- The validator rejects forbidden claims in both playbooks and the manifest (`tests/stress/cli-adapter/validate-playbook-package.cjs:172-180`, `:188-206`).

### 5. Cross-system substrate — PASS

- Shared artifact identity is the canonical `reference_set_digest`: creation hashes the canonical reference-set core, replay recomputes it from resolved evidence, and mismatch fails closed (`.opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/artifact-reference-set.ts:161-168`, `:208-268`, `:271-278`).
- Mode adapters retain that shared digest as the sole set identity and delegate replay to the shared substrate; Deep Research is representative (`lib/deep-research-sealed-artifacts/deep-research-artifact-set.ts:300-337`, `:455-488`, `:491-508`). Its store factory constructs the shared `SealedArtifactStore`, not a mode-local store (`lib/deep-research-sealed-artifacts/deep-research-sealed-artifacts.ts:5-21`, `:92-103`). Model Benchmark does the same (`lib/model-benchmark-sealed-artifacts/model-benchmark-sealed-artifacts.ts:13-23`, `:412-423`). The all-mode static audit found no competing store/hash class.
- The parity identity registry is a closed exact shape containing all 11 identity dimensions and lowercase SHA-256 values (`lib/shadow-parity/parity-identity-registry.ts:43-79`, `:103-149`). Certificate verification binds the registry digest and rejects stale, mutated, non-legacy-authoritative, or incomplete evidence as `UNVERIFIABLE` (`lib/shadow-parity/parity-certificates.ts:345-376`, `:378-404`). Every one of the eight mode parity adapters invokes shared certificate verification.
- Whole-runtime TypeScript passed with exit 0.

### 6. Scope hygiene — PASS

The merge-base-to-candidate diff contains 505 files and is confined to the 036 deep-loop specs, system-deep-loop implementation/tests (including the CLI stress tree), CLI external-orchestration playbooks, and the owned deep model-benchmark command asset. There are no deletions and no `.opencode/package.json` or lockfile changes. The command asset is program-related, although its live behavioral change is the blocker under claim 1.

## Blocking findings

### B-001 — Active legacy model-benchmark behavior changed

**Exact defect:** commit `cb4209617e58346711efdc6409d568b51eb6c012` changes the active `model-benchmark :auto` workflow from a guarded canonical promotion step to advisory-only recommendation and changes the shared promotion helper. Because `.opencode/commands/deep/model-benchmark.md:141-146` loads and executes that asset in production, the candidate is not wholly additive-dark relative to `dc3736d584`; the preservation gate exits 1.

**Acceptance impact:** unresolved blocking failure of claim 1. The fact that the new behavior is safer does not satisfy the review's explicit no-legacy-path-change condition.

Review status: REQUESTED_CHANGES

VERDICT: BLOCK

---

## Operator Disposition

B-001 is **accepted as an intentional, pre-accepted exception**, not a defect to fix. The changed live behavior is the promotion-authority containment delivered by the 006/007 work: autonomous `model-benchmark :auto` runs are hardened from guarded-canonical self-promotion to advisory-only recommendation, backed by authenticated promotion receipts. This was a deliberate security hardening — recorded in the program's DONE set as promotion-authority and live-forge-verified — that prevents an autonomous run from mutating canonical state without a separate, operator-authorized promotion session.

The core additive-dark claim is unaffected and holds: the typed-ledger authority plane and all eight mode migrations are genuinely dark (`DarkLedgerAdapter` returns the identical legacy result; the authority selector is unwired to any live adapter; all 11 legacy-authoritative boundary files are byte-unchanged), and every other acceptance claim — mode-migration genuineness, no-false-completion, 007/001 genuineness, cross-system substrate, and scope hygiene — passed.

**Effective verdict: APPROVE (additive-dark portion) with one documented, operator-accepted exception (B-001).** The single legacy-path change is the deliberate promotion-authority hardening; it is retained by decision, not reverted. This satisfies the whole-system gate's blocking-review criterion for the built additive-dark portion. The gate's remaining full-acceptance items — legacy-writer retirement and per-mode authority cutover — stay operator-gated.

EFFECTIVE VERDICT: APPROVE (additive-dark portion) with accepted exception B-001.
