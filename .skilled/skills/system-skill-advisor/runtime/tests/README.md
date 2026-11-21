---
title: "Skill Advisor Tests: Regression And Contract Coverage"
description: "Vitest, Python and fixture coverage for skill-advisor routing, handlers, hooks, schemas, scorer paths and compatibility behavior."
trigger_phrases:
  - "skill advisor tests"
  - "advisor regression tests"
  - "skill advisor vitest"
---

# Skill Advisor Tests: Regression And Contract Coverage

---

## 1. OVERVIEW

`runtime/tests/` is the regression surface for the skill-advisor package. It groups focused Vitest suites, compatibility checks, handler and hook tests, schema checks, Python parity tests and shared fixtures used by the advisor scorer and daemon paths.

Current state:

- Covers advisor routing, scorer, lane attribution, cache, daemon freshness and lifecycle metadata behavior.
- Keeps compatibility, parity and schema tests in named subfolders.
- Provides shared fixtures and helpers used across direct TypeScript and Python-facing advisor checks.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                      SKILL ADVISOR TESTS                         │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌────────────────┐      ┌──────────────────┐
│ Test runner  │ ───▶ │ Vitest suites   │ ───▶ │ Advisor modules  │
│ npm / vitest │      │ tests/*.ts      │      │ lib / handlers   │
└──────┬───────┘      └───────┬────────┘      └────────┬─────────┘
       │                      │                        │
       │                      ▼                        ▼
       │              ┌───────────────┐        ┌────────────────┐
       └───────────▶  │ Fixtures      │ ───▶   │ Schemas        │
                      │ tests/fixtures│        │ schemas/*      │
                      └───────┬───────┘        └────────────────┘
                              │
                              ▼
                      ┌───────────────┐
                      │ Python parity │
                      └───────────────┘

Dependency direction: test suites -> fixtures -> advisor runtime modules
```

---

## 3. PACKAGE TOPOLOGY

```text
tests/
+-- cache/                   # Cache behavior coverage
+-- compat/                  # Compatibility contract checks
+-- fixtures/                # Prompt, graph and routing fixtures
+-- helpers/                 # Test-only helpers (env snapshot, activation-matrix evidence)
+-- handlers/                # Handler tests
+-- hooks/                   # Hook integration tests
+-- legacy/                  # Legacy compatibility coverage
+-- parity/                  # Cross-runtime parity checks
+-- python/                  # Python wrapper and script tests
+-- schemas/                 # Schema validation tests
+-- scorer/                  # Native scorer tests
+-- skill-graph/             # Skill-graph round-trip tests
+-- *.vitest.ts              # Package-level regression suites
+-- *.test.ts                # Focused unit tests
`-- README.md
```

Allowed direction:

```text
tests -> fixtures
tests -> skill_advisor/lib
tests -> skill_advisor/handlers
```

Disallowed direction:

```text
runtime code -> tests
fixtures -> generated runtime state without an explicit test setup
```

---

## 4. DIRECTORY TREE

```text
tests/
+-- advisor-disabled.vitest.ts
+-- advisor-rebuild.vitest.ts
+-- advisor-surface-hint.vitest.ts
+-- affordance-normalizer.test.ts
+-- cli-degraded-command-contract.vitest.ts
+-- cli-exit-taxonomy.vitest.ts
+-- command-attach-guards.vitest.ts
+-- command-attach.vitest.ts
+-- command-behaviour-guards.vitest.ts
+-- command-binding-existence.vitest.ts
+-- command-bridge-resolution-guard.vitest.ts
+-- command-bridges-drift-guard.vitest.ts
+-- command-brief-golden.vitest.ts
+-- command-head-length.vitest.ts
+-- command-meaning-anchor.vitest.ts
+-- command-metadata-e2e.vitest.ts
+-- command-offer.vitest.ts
+-- command-policy-derivation.vitest.ts
+-- command-routing-slice.vitest.ts
+-- command-transcript-score.vitest.ts
+-- compiled-routing-consumption.vitest.ts
+-- cross-skill-edges.vitest.ts
+-- daemon-freshness-foundation.vitest.ts
+-- daemon-watcher-new-root-ingestion.vitest.ts
+-- daemon-watcher-resource-leaks-049-005.vitest.ts
+-- derive-command-bridges-strings.vitest.ts
+-- discovery-pipeline-parity.vitest.ts
+-- dist-build-record-contract.vitest.ts
+-- doctor-brief-render.vitest.ts
+-- doctor-command-bridges.vitest.ts
+-- doctor-helper-handoff.vitest.ts
+-- doctor-routing-slice.vitest.ts
+-- lane-attribution.test.ts
+-- launcher-bootstrap.vitest.ts
+-- launcher-idle-timeout.vitest.ts
+-- launcher-install-guard.vitest.ts
+-- launcher-lease.vitest.ts
+-- launcher-reap-pid-reuse.vitest.ts
+-- launcher-stale-build-recycle.vitest.ts
+-- lifecycle-derived-metadata.vitest.ts
+-- manual-testing-playbook.vitest.ts
+-- measure-brief-cost.vitest.ts
+-- metadata-sanitizer-entities-guard.vitest.ts
+-- metrics-file-permissions.vitest.ts
+-- migration-lineage-identity.vitest.ts
+-- name-mention-scoring.vitest.ts
+-- parent-skill-check-fixtures.vitest.ts
+-- policy-observation-sink.vitest.ts
+-- policy-plan-negative-controls.vitest.ts
+-- policy-plan.vitest.ts
+-- private-skill-target.vitest.ts
+-- prompt-policy-gold-replay.vitest.ts
+-- rename-invariants.vitest.ts
+-- render-child-session.vitest.ts
+-- route-exclusions.vitest.ts
+-- routing-fixtures.affordance.test.ts
+-- routing-golden-prompts.vitest.ts
+-- routing-parity-deep-skills.vitest.ts
+-- routing-registry-drift-guard.vitest.ts
+-- shadow-sink.vitest.ts
+-- shared-import-specifier-extension.vitest.ts
+-- skill-advisor-cli-dual-client.vitest.ts
+-- skill-advisor-cli-help-aliases-errors.vitest.ts
+-- skill-advisor-cli-job-semantics.vitest.ts
+-- skill-advisor-cli-json-stdin.vitest.ts
+-- skill-advisor-cli-manifest-parity.vitest.ts
+-- skill-advisor-cli-parity.vitest.ts
+-- skill-advisor-cli-repo-paths.vitest.ts
+-- skill-advisor-cli-stale-daemon-retry.vitest.ts
+-- skill-advisor-cli-test-utils.ts
+-- skill-advisor-cli-trusted-prompt-time.vitest.ts
+-- skill-advisor-launcher-orphan-reaping.vitest.ts
+-- skill-doc-frontmatter-checker.vitest.ts
+-- skill-doc-harvest.vitest.ts
+-- skill-graph-bfs-traversal.vitest.ts
+-- skill-graph-db.vitest.ts
+-- skill-graph-diagnostic-redaction.vitest.ts
+-- skill-graph-handlers.vitest.ts
+-- skill-graph-queries-parity.vitest.ts
+-- sqlite-integrity.vitest.ts
+-- state-containment.vitest.ts
+-- subprocess-output-cap.vitest.ts
+-- system-skill-advisor-plugin.vitest.ts
+-- tsconfig.tests.json
+-- typo-flags.vitest.ts
+-- vocabulary-agreement.vitest.ts
+-- workspace-root.vitest.ts
+-- worktree-restore.vitest.ts
+-- cache/
+-- compat/
+-- doctor/
+-- fixtures/
+-- handlers/
+-- helpers/
+-- hooks/
+-- legacy/
+-- parity/
+-- python/
+-- schemas/
+-- scorer/
+-- skill-graph/
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `lane-attribution.test.ts` | Verifies prompt-safe lane attribution behavior. |
| `affordance-normalizer.test.ts` | Tests affordance normalization used by advisor routing. |
| `routing-fixtures.affordance.test.ts` | Connects fixture prompts to affordance expectations. |
| `shadow-sink.vitest.ts` | Covers shadow telemetry sink behavior. |
| `skill-graph-db.vitest.ts` | Checks skill-graph database behavior used by advisor tests. |
| `manual-testing-playbook.vitest.ts` | Checks the playbook inventory: the root playbook lists every scenario file in the category tree once, and its persistence note names the folder results are recorded in. |
| `skill-advisor-cli-stale-daemon-retry.vitest.ts` | Verifies the stale-daemon retry in the CLI entrypoint. |
| `prompt-policy-gold-replay.vitest.ts` | Replays the prompt gate over the labeled and golden corpora. |
| `command-meaning-anchor.vitest.ts` | 28 cases on the meaning way in for a command row: a real cosine has to clear the bar and lead the other command rows by the margin, a meaning pass must also clear the uncertainty bar, stand-in evidence never passes, a skill row is left alone, a meaning-passed command moves ahead of a passing skill only by the margin, and eligibility rules out every command on a no-edit request and all but read-only commands on a read-only question. |
| `command-policy-derivation.vitest.ts` | Pins the `derivePolicy` ladder and the closed risk-key vocabularies, and checks that the command tree and its declarations agree. |
| `command-routing-slice.vitest.ts` | Holds live command routing to `scripts/routing-accuracy/command-routing-baseline.json` row by row, pins the corpus hash and requires a typed row and both plain splits for every command file. |
| `skill-graph/` | Covers focused skill-graph refresh round trips. |
| `tsconfig.tests.json` | Type-checks the CLI and launcher test files listed in its `include`, extending the runtime `tsconfig.json`, with no emit. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Tests may import advisor runtime modules, schemas, fixtures and local shared helpers. |
| Exports | This folder exports no production runtime code. |
| Ownership | Keep advisor package tests here. Put code-graph, memory or deep-loop tests in their own package folders. |

Main flow:

```text
fixture or inline scenario
  -> advisor scorer, handler, hook or schema path
  -> prompt-safe result, metadata or validation output
  -> assertion on stable advisor behavior
```

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `*.vitest.ts` | Test files | Vitest regression suites for daemon, lifecycle, shadow and database behavior. |
| `*.test.ts` | Test files | Focused unit tests for affordance and attribution helpers. |
| `fixtures/` | Test data | Shared prompt and routing inputs. |
| `scorer/` | Test folder | Native scorer regression coverage. |
| `skill-graph/` | Test folder | Focused skill-graph database coverage. |

---

## 8. VALIDATION

Run from the repository root.

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/system-skill-advisor/runtime/tests/README.md
```

Expected result: exit code `0`.

---

## 9. RELATED

- [`../README.md`](../README.md)
- [`../lib/README.md`](../lib/README.md)
- [`skill-graph/README.md`](skill-graph/README.md)
- [`scorer/README.md`](scorer/README.md)
