---
title: "Implementation Summary: Move cli-jev into the cli-classifier Hub"
description: "cli-jev is mode cli-jev of the cli-classifier hub over its unchanged cli-usage packet, beside cli-deem. Commit ea883967d4 moved 70 hub files, merged 11 and onboarded cli-classifier to the compiled fleet in cli-jev's place, and the 17-prompt route replay matches its baseline with 0 mismatches. A cross-family review's two P1s are closed."
trigger_phrases:
  - "cli-jev hub move summary"
  - "cli-jev hub move status"
  - "cli-jev move results"
  - "cli-jev replay results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move"
    last_updated_at: "2026-09-29T10:05:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Closed from build and session evidence: 27 of 27 tasks and 6 of 6 criteria"
    next_safe_action: "Orchestrator commits these docs and the scratch build record"
    blockers: []
    key_files:
      - ".skilled/skills/cli-classifier/mode-registry.json"
      - ".skilled/skills/cli-classifier/hub-router.json"
      - ".skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs"
      - "specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move/scratch/w3-session/session-evidence.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move/scratch/w3-build/build-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Provision system-deep-loop in this worktree, or keep the NODE_PATH workaround as the record"
    answered_questions:
      - "Research question 49: parent D4 as amended on 2026-09-29, the move waited only on 008 being Complete"
      - "Where the hub's two changelogs land: cli-classifier/changelog/v0.1.0.0.md and v0.2.0.0.md at R100, beside 008's v1.0.0.0, 2026-09-29"
      - "The dispatch audit label for a jev dispatch: the hub id cli-classifier with packet path cli-classifier/cli-usage, 2026-09-29"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Move cli-jev into the cli-classifier Hub

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-cli-jev-hub-move |
| **Status** | Complete |
| **Completed** | 2026-09-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Jev and Deem now sit under one hub. `cli-jev` is mode `cli-jev` of `cli-classifier` over its unchanged packet `cli-usage`, beside `cli-deem`, the way `system-deep-loop` runs mode `research` over packet `deep-research`. Every canary case and hub-routing scenario routes as it did before the move.

### Phase 9: cli-jev-hub-move

**The routing identity.** `cli-classifier/mode-registry.json` lists two transport modes. The `cli-jev` entry carries `packet` `cli-usage`, `packetKind` `transport`, `backendKind` `cli-dispatch` and `routingClass` `metadata`, and the transport axis reads `["cli-deem", "cli-jev"]`. The merged `hub-router.json` carries the old `cli-usage` aliases and Jev dispatch vocabulary under mode `cli-jev`, and its `tieBreak` lists `cli-jev` then `cli-deem`. So the ordered bundle is reachable now: a request that names both backends by alias routes to both transports, `cli-jev` first. The hub name alone no longer picks `cli-deem`, because a hub with two modes cannot resolve to one of them by its own name.

**The move.** All 81 files of `.skilled/skills/cli-jev/` are accounted for. 70 moved with `git mv` and show as rename rows in `ea883967d4`. The other 11 merged into the `cli-classifier` file at the same path and show as `D` rows: the 8 hub-root files, `benchmark/README.md`, the playbook root and the out-of-domain scenario CJ-003. `.skilled/skills/cli-jev/` no longer exists. The two old CJ scenarios moved and now expect mode `cli-jev` with their prompts unchanged, and CC-002 was rewritten in place.

**The compiled fleet.** `cli-classifier` serves compiled in the place `cli-jev` held, and the fleet stays at 7 hubs. It replaced `cli-jev` once in each list: `HUB_CHILD`, `DEFAULT_ON_HUBS`, the guard's and the sync tool's `HUBS`, both advisor lists and the serving-closure `hubs`. The rollout child and the activation folder became `008-cli-classifier/` and `activation/cli-classifier/` in both the runtime mirror and the authored twin. The activation manifest was written last from the manifest library's canonical bytes, and `refresh` re-derives the same SHA-256. The admission check passes on 5 scored scenarios: CC-001 for `cli-deem`, CC-002, CJ-001 and CJ-002 for `cli-jev` and CC-003 as the negative case.

**The harness checks its fixture.** After review round 1 the `008-cli-classifier` harness asserts each canary case's expected action, selection kind, modes, intents and resources, byte-identical in both trees. Before that fix it recorded outcomes and asserted none, so a fixture that expected `cli-jev` for a Deem prompt passed. It now throws `GOLD_MISMATCH`.

**Everything else that named the old hub.** The dispatch audit records a `jev` dispatch under `cli-classifier` with packet path `cli-classifier/cli-usage`. The agents, the Hermes, Codex and Pi mirrors, the two skill inventories, the `cli-external-orchestration` registry, graph and catalog, the `sk-prompt` card and the moved packet's own docs name the new path. Changelogs and dated benchmark reports moved byte-identical.

### Disposition of the 81 Hub Files

The source list is `git ls-tree -r HEAD --name-only -- .skilled/skills/cli-jev` at `3dde18cb54`, carried whole from `scratch/w3-build/disposition.md`. Its Disposition column is the build's record at staging time. The last column is each file's row in `git show -M --name-status ea883967d4`, rerun at close, where edits made after staging lower some similarity scores.

| # | Source at HEAD | Target | Disposition | Row in `ea883967d4` |
|---|---|---|---|---|
| 1 | `.skilled/skills/cli-jev/README.md` | `.skilled/skills/cli-classifier/README.md` | Merge into the `cli-classifier` file of the same path, then `rm` of the source (staged `D` once the session stages) | `D` |
| 2 | `.skilled/skills/cli-jev/ROUTER.md` | `.skilled/skills/cli-classifier/ROUTER.md` | Merge into the `cli-classifier` file of the same path, then `rm` of the source (staged `D` once the session stages) | `D` |
| 3 | `.skilled/skills/cli-jev/SKILL.md` | `.skilled/skills/cli-classifier/SKILL.md` | Merge into the `cli-classifier` file of the same path, then `rm` of the source (staged `D` once the session stages) | `D` |
| 4 | `.skilled/skills/cli-jev/benchmark/README.md` | `.skilled/skills/cli-classifier/benchmark/README.md` | Merge into the `cli-classifier` file of the same path, then `rm` of the source (staged `D` once the session stages) | `D` |
| 5 | `.skilled/skills/cli-jev/benchmark/reports/2026-09-20-hub-routing-baseline/raw/hub-routing-run.sh` | `.skilled/skills/cli-classifier/benchmark/reports/2026-09-20-hub-routing-baseline/raw/hub-routing-run.sh` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 6 | `.skilled/skills/cli-jev/benchmark/reports/2026-09-20-hub-routing-baseline/raw/hub-routing.txt` | `.skilled/skills/cli-classifier/benchmark/reports/2026-09-20-hub-routing-baseline/raw/hub-routing.txt` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 7 | `.skilled/skills/cli-jev/benchmark/reports/2026-09-20-hub-routing-baseline/skill-benchmark-report.md` | `.skilled/skills/cli-classifier/benchmark/reports/2026-09-20-hub-routing-baseline/skill-benchmark-report.md` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 8 | `.skilled/skills/cli-jev/benchmark/reports/2026-09-26--manual-testing-playbook--hub-routing-phrasings/raw/hub-routing-run.sh` | `.skilled/skills/cli-classifier/benchmark/reports/2026-09-26--manual-testing-playbook--hub-routing-phrasings/raw/hub-routing-run.sh` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 9 | `.skilled/skills/cli-jev/benchmark/reports/2026-09-26--manual-testing-playbook--hub-routing-phrasings/raw/hub-routing.txt` | `.skilled/skills/cli-classifier/benchmark/reports/2026-09-26--manual-testing-playbook--hub-routing-phrasings/raw/hub-routing.txt` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 10 | `.skilled/skills/cli-jev/benchmark/reports/2026-09-26--manual-testing-playbook--hub-routing-phrasings/skill-benchmark-report.md` | `.skilled/skills/cli-classifier/benchmark/reports/2026-09-26--manual-testing-playbook--hub-routing-phrasings/skill-benchmark-report.md` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 11 | `.skilled/skills/cli-jev/changelog/v0.1.0.0.md` | `.skilled/skills/cli-classifier/changelog/v0.1.0.0.md` | Move (`git mv`, staged `R100`), byte-identical changelog | `R100` |
| 12 | `.skilled/skills/cli-jev/changelog/v0.2.0.0.md` | `.skilled/skills/cli-classifier/changelog/v0.2.0.0.md` | Move (`git mv`, staged `R100`), byte-identical changelog | `R100` |
| 13 | `.skilled/skills/cli-jev/cli-usage/README.md` | `.skilled/skills/cli-classifier/cli-usage/README.md` | Move (`git mv`, staged `R100`) | `R093` |
| 14 | `.skilled/skills/cli-jev/cli-usage/SKILL.md` | `.skilled/skills/cli-classifier/cli-usage/SKILL.md` | Move (`git mv`, staged `R100`) | `R098` |
| 15 | `.skilled/skills/cli-jev/cli-usage/assets/question-shaping-card.md` | `.skilled/skills/cli-classifier/cli-usage/assets/question-shaping-card.md` | Move (`git mv`, staged `R100`) | `R100` |
| 16 | `.skilled/skills/cli-jev/cli-usage/benchmark/README.md` | `.skilled/skills/cli-classifier/cli-usage/benchmark/README.md` | Move (`git mv`, staged `R100`) | `R100` |
| 17 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-authenticated-verification/skill-benchmark-report.md` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-authenticated-verification/skill-benchmark-report.md` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 18 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-phase-004-unauthenticated-pass/skill-benchmark-report.md` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-phase-004-unauthenticated-pass/skill-benchmark-report.md` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 19 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/auth-probe.sh` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/auth-probe.sh` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 20 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/auth-probe.txt` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/auth-probe.txt` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 21 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/compare-surface.py` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/compare-surface.py` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 22 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/compare.py` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/compare.py` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 23 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/dispatch-audit-live.txt` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/dispatch-audit-live.txt` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 24 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/leak-check.py` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/leak-check.py` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 25 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/mcp-probe.py` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/mcp-probe.py` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 26 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/preflight-probe.sh` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/preflight-probe.sh` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 27 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/preflight-probe.txt` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/preflight-probe.txt` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 28 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/preflight-probe2.sh` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/preflight-probe2.sh` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 29 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/preflight-probe2.txt` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/preflight-probe2.txt` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 30 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/probe-matrix.sh` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/probe-matrix.sh` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 31 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/probe-matrix.txt` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/probe-matrix.txt` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 32 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/probe-surface.sh` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/probe-surface.sh` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 33 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/probe-surface.txt` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/probe-surface.txt` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 34 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/rule-checks.txt` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/raw/rule-checks.txt` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 35 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/skill-benchmark-report.md` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/skill-benchmark-report.md` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 36 | `.skilled/skills/cli-jev/cli-usage/benchmark/reports/README.md` | `.skilled/skills/cli-classifier/cli-usage/benchmark/reports/README.md` | Move (`git mv`, staged `R100`), dated report, byte-identical | `R100` |
| 37 | `.skilled/skills/cli-jev/cli-usage/changelog/v1.0.0.0.md` | `.skilled/skills/cli-classifier/cli-usage/changelog/v1.0.0.0.md` | Move (`git mv`, staged `R100`) | `R100` |
| 38 | `.skilled/skills/cli-jev/cli-usage/changelog/v1.0.1.0.md` | `.skilled/skills/cli-classifier/cli-usage/changelog/v1.0.1.0.md` | Move (`git mv`, staged `R100`) | `R100` |
| 39 | `.skilled/skills/cli-jev/cli-usage/changelog/v1.0.2.0.md` | `.skilled/skills/cli-classifier/cli-usage/changelog/v1.0.2.0.md` | Move (`git mv`, staged `R100`) | `R100` |
| 40 | `.skilled/skills/cli-jev/cli-usage/feature-catalog/dispatch-guards/dispatch-guards.md` | `.skilled/skills/cli-classifier/cli-usage/feature-catalog/dispatch-guards/dispatch-guards.md` | Move (`git mv`, staged `R100`) | `R094` |
| 41 | `.skilled/skills/cli-jev/cli-usage/feature-catalog/feature-catalog.md` | `.skilled/skills/cli-classifier/cli-usage/feature-catalog/feature-catalog.md` | Move (`git mv`, staged `R100`) | `R094` |
| 42 | `.skilled/skills/cli-jev/cli-usage/feature-catalog/judgment-primitives/judgment-primitives.md` | `.skilled/skills/cli-classifier/cli-usage/feature-catalog/judgment-primitives/judgment-primitives.md` | Move (`git mv`, staged `R100`) | `R100` |
| 43 | `.skilled/skills/cli-jev/cli-usage/feature-catalog/surfaces/surfaces.md` | `.skilled/skills/cli-classifier/cli-usage/feature-catalog/surfaces/surfaces.md` | Move (`git mv`, staged `R100`) | `R100` |
| 44 | `.skilled/skills/cli-jev/cli-usage/feature-catalog/transport-classification/transport-classification.md` | `.skilled/skills/cli-classifier/cli-usage/feature-catalog/transport-classification/transport-classification.md` | Move (`git mv`, staged `R100`) | `R089` |
| 45 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/cli-invocation/binary-resolves-and-pins-version.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/cli-invocation/binary-resolves-and-pins-version.md` | Move (`git mv`, staged `R100`) | `R100` |
| 46 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/cli-invocation/judgment-help-omits-hidden-endpoint-flag.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/cli-invocation/judgment-help-omits-hidden-endpoint-flag.md` | Move (`git mv`, staged `R100`) | `R100` |
| 47 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/cli-invocation/one-judgment-per-type-returns-typed-answer.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/cli-invocation/one-judgment-per-type-returns-typed-answer.md` | Move (`git mv`, staged `R100`) | `R100` |
| 48 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/cli-invocation/root-help-lists-six-subcommands.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/cli-invocation/root-help-lists-six-subcommands.md` | Move (`git mv`, staged `R100`) | `R100` |
| 49 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/dispatch-guards/declared-hard-rules-refuse-violations.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/dispatch-guards/declared-hard-rules-refuse-violations.md` | Move (`git mv`, staged `R100`) | `R100` |
| 50 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/dispatch-guards/dispatch-resolves-from-command.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/dispatch-guards/dispatch-resolves-from-command.md` | Move (`git mv`, staged `R100`) | `R070` |
| 51 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/dispatch-guards/prose-mention-is-not-a-dispatch.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/dispatch-guards/prose-mention-is-not-a-dispatch.md` | Move (`git mv`, staged `R100`) | `R090` |
| 52 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/exit-codes/batch-request-with-no-key-exits-3.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/exit-codes/batch-request-with-no-key-exits-3.md` | Move (`git mv`, staged `R100`) | `R100` |
| 53 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/exit-codes/choice-single-option-not-refused.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/exit-codes/choice-single-option-not-refused.md` | Move (`git mv`, staged `R100`) | `R100` |
| 54 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/exit-codes/key-never-echoed-on-error-path.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/exit-codes/key-never-echoed-on-error-path.md` | Move (`git mv`, staged `R100`) | `R100` |
| 55 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/exit-codes/malformed-json-state-exits-2.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/exit-codes/malformed-json-state-exits-2.md` | Move (`git mv`, staged `R100`) | `R100` |
| 56 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/exit-codes/missing-required-flag-is-argparse-failure.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/exit-codes/missing-required-flag-is-argparse-failure.md` | Move (`git mv`, staged `R100`) | `R100` |
| 57 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/exit-codes/no-key-exits-3-with-structured-json.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/exit-codes/no-key-exits-3-with-structured-json.md` | Move (`git mv`, staged `R100`) | `R100` |
| 58 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/exit-codes/refused-connection-exits-4.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/exit-codes/refused-connection-exits-4.md` | Move (`git mv`, staged `R100`) | `R100` |
| 59 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/exit-codes/request-without-questions-exits-2.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/exit-codes/request-without-questions-exits-2.md` | Move (`git mv`, staged `R100`) | `R100` |
| 60 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/exit-codes/score-single-level-not-refused.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/exit-codes/score-single-level-not-refused.md` | Move (`git mv`, staged `R100`) | `R100` |
| 61 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/exit-codes/unknown-subcommand-is-argparse-failure.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/exit-codes/unknown-subcommand-is-argparse-failure.md` | Move (`git mv`, staged `R100`) | `R100` |
| 62 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/exit-codes/unreadable-state-file-exits-2.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/exit-codes/unreadable-state-file-exits-2.md` | Move (`git mv`, staged `R100`) | `R100` |
| 63 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/manual-testing-playbook.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/manual-testing-playbook.md` | Move (`git mv`, staged `R100`) | `R094` |
| 64 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/mcp-server/handshake-and-four-tools.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/mcp-server/handshake-and-four-tools.md` | Move (`git mv`, staged `R100`) | `R100` |
| 65 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/providers/auth-status-reports-key-state.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/providers/auth-status-reports-key-state.md` | Move (`git mv`, staged `R100`) | `R100` |
| 66 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/providers/custom-provider-requires-endpoint.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/providers/custom-provider-requires-endpoint.md` | Move (`git mv`, staged `R100`) | `R100` |
| 67 | `.skilled/skills/cli-jev/cli-usage/manual-testing-playbook/providers/invalid-provider-env-exits-2.md` | `.skilled/skills/cli-classifier/cli-usage/manual-testing-playbook/providers/invalid-provider-env-exits-2.md` | Move (`git mv`, staged `R100`) | `R100` |
| 68 | `.skilled/skills/cli-jev/cli-usage/references/cli-reference.md` | `.skilled/skills/cli-classifier/cli-usage/references/cli-reference.md` | Move (`git mv`, staged `R100`) | `R100` |
| 69 | `.skilled/skills/cli-jev/cli-usage/references/integration-patterns.md` | `.skilled/skills/cli-classifier/cli-usage/references/integration-patterns.md` | Move (`git mv`, staged `R100`) | `R100` |
| 70 | `.skilled/skills/cli-jev/cli-usage/references/mcp-server.md` | `.skilled/skills/cli-classifier/cli-usage/references/mcp-server.md` | Move (`git mv`, staged `R100`) | `R100` |
| 71 | `.skilled/skills/cli-jev/cli-usage/references/providers-and-models.md` | `.skilled/skills/cli-classifier/cli-usage/references/providers-and-models.md` | Move (`git mv`, staged `R100`) | `R100` |
| 72 | `.skilled/skills/cli-jev/description.json` | `.skilled/skills/cli-classifier/description.json` | Merge into the `cli-classifier` file of the same path, then `rm` of the source (staged `D` once the session stages) | `D` |
| 73 | `.skilled/skills/cli-jev/graph-metadata.json` | `.skilled/skills/cli-classifier/graph-metadata.json` | Merge into the `cli-classifier` file of the same path, then `rm` of the source (staged `D` once the session stages) | `D` |
| 74 | `.skilled/skills/cli-jev/hub-router.json` | `.skilled/skills/cli-classifier/hub-router.json` | Merge into the `cli-classifier` file of the same path, then `rm` of the source (staged `D` once the session stages) | `D` |
| 75 | `.skilled/skills/cli-jev/leaf-manifest.json` | `.skilled/skills/cli-classifier/leaf-manifest.json` | Merge by regeneration (`generate-leaf-manifest.cjs --write`), then `rm` of the source | `D` |
| 76 | `.skilled/skills/cli-jev/manual-testing-playbook/hub-routing/alias-still-resolves.md` | `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/alias-still-resolves.md` | Move (`git mv`, staged `R100`), then rewritten to mode `cli-jev` of `cli-classifier`; the pre-move recorded result stays above the 2026-09-29 one, so `git diff HEAD -M` still pairs it with its source (R052) | `R052` |
| 77 | `.skilled/skills/cli-jev/manual-testing-playbook/hub-routing/judgment-request-routes-to-transport.md` | `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/judgment-request-routes-to-transport.md` | Move (`git mv`, staged `R100`), then rewritten to mode `cli-jev` of `cli-classifier`; the pre-move recorded result stays above the 2026-09-29 one, so `git diff HEAD -M` still pairs it with its source (R052) | `R052` |
| 78 | `.skilled/skills/cli-jev/manual-testing-playbook/hub-routing/out-of-domain-resolves-nothing.md` | `.skilled/skills/cli-classifier/manual-testing-playbook/hub-routing/out-of-domain-resolves-nothing.md` | Merge into the `cli-classifier` file of the same path, then `rm` of the source (staged `D` once the session stages) | `D` |
| 79 | `.skilled/skills/cli-jev/manual-testing-playbook/manual-testing-playbook.md` | `.skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md` | Merge into the `cli-classifier` file of the same path, then `rm` of the source (staged `D` once the session stages) | `D` |
| 80 | `.skilled/skills/cli-jev/mode-registry.json` | `.skilled/skills/cli-classifier/mode-registry.json` | Merge into the `cli-classifier` file of the same path, then `rm` of the source (staged `D` once the session stages) | `D` |
| 81 | `.skilled/skills/cli-jev/shared/README.md` | `.skilled/skills/cli-classifier/shared/README.md` | Move (`git mv`, staged `R100`), retitled, with the numbered OVERVIEW heading the README validator requires above the unchanged body (R088 against HEAD) | `R088` |

Totals: 81 files, 70 moves, 11 merges, 0 unmapped. Every rename target in the commit equals the table's target.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-jev/**` to `.skilled/skills/cli-classifier/**` | Moved, merged | The 81 files in the table above. The session ran the `git mv` before the build |
| `cli-classifier/mode-registry.json`, `hub-router.json` | Merged | Mode `cli-jev` and its routing vocabulary, with both modes in `tieBreak`. Briefs 01 and 02 (Devin) |
| `cli-classifier/SKILL.md`, `README.md`, `ROUTER.md`, `description.json`, `graph-metadata.json` | Merged | The hub root for two modes. Briefs 03 and 40 to 43 (Pi) |
| `cli-classifier/cli-usage/SKILL.md`, `cli-classifier/cli-deem/SKILL.md` | Modified | Hub-name prose. Briefs 04 (Devin) and 05 (Pi) |
| `cli-external-orchestration/mode-registry.json`, `graph-metadata.json`, its feature catalog root and dispatch-routing entry | Modified | Name the new hub. Briefs 06 (Devin) and 21 to 23 (Pi) |
| `014-runtime-engine/lib/compiled-route.cjs` and `resolve.cjs`, runtime and authored twin | Modified | `HUB_CHILD` and `DEFAULT_ON_HUBS`. Briefs 07 and 08 (Devin) |
| `.skilled/bin/compiled-route-guard.cjs`, `compiled-route-sync.cjs`, `system-skill-advisor/runtime/lib/compiled-routing-flag.ts` | Modified | The hub lists. Briefs 09 to 11 (Devin) |
| `009-parent-hub-rollout/008-cli-classifier/` harness and `lib/` (registry compiler, router, policy card), both trees | Renamed, modified | Compile the two-mode registry, then assert the fixture's expectations. Briefs 12 to 15 and fix round 1 (Devin) |
| `008-cli-classifier/fixtures/canary-cases.v1.json`, both trees | Modified | 7 Jev cases expect `cli-jev`, plus `deem-choice-single` and `deem-verb-narrowness`. Brief 16 (Pi) |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs`, `dispatch-audit.test.mjs`, `dispatch-rule-checks.test.mjs` | Modified | The audit label and its tests. Briefs 17 and 18 (Devin) |
| `orchestrate.md` and `prompt-improver.md` in `.skilled/agents/` and `.claude/agents/` | Modified | Hub name and path. Briefs 19, 19b, 19c, 20 and 20b (Pi) |
| `sk-prompt/assets/cli-prompt-quality-card.md`, `README.md`, `.skilled/skills/README.txt` | Modified | Hub name and inventory lines. Briefs 24 to 26 (Pi) |
| `system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Modified | Two fixture source paths. Brief 27 (Devin) |
| The `cli-usage` playbook, feature catalog and README, `cli-deem/README.md`, `cli-classifier/shared/README.md` | Modified | Hub-name prose, and the playbook root's sections in fix round 1. Briefs 28 to 36c (Pi) |
| `013-live-activation/activation/cli-classifier/manifest.json` in both trees, `serving-closure.manifest.json`, the twin's `activation/cli-external-orchestration/manifest.json` | Written | The canonical manifest, the closure list at `fileCount` 62 and the reminted neighbor. Briefs 37 to 39 (Pi) |
| `cli-classifier/benchmark/` READMEs, `changelog/v1.1.0.0.md`, the playbook root and the five `hub-routing/` scenarios | Merged, created, rewritten | Briefs 44 to 53b (Pi), then brief 54 removed the 32 empty `cli-jev` folders |
| `cli-classifier/leaf-manifest.json` | Generated | `generate-leaf-manifest.cjs --write`, then `--check` OK |
| The twin's `008-cli-classifier/compiled/*` and `activation/*` | Generated | `harness/build-artifacts.cjs`, exit 0 |
| The runtime `activation/cli-external-orchestration/manifest.json` | Generated | `compiled-route-manifest.cjs refresh`, generation 5, byte-stable on a second refresh |
| `system-skill-advisor/runtime/scripts/skill-graph.json`, `tests/parity/fixtures/local-native-approved-divergences.json` | Regenerated | `skill_graph_compiler.py --export-json` and `capture-local-native-divergence-ledger.mjs --write` |
| `.codex/agents/`, `.pi/agents/` and `.hermes/skills/` copies | Generated | `codex/sync-agents.cjs`, `pi/sync-agents-pi.cjs` and `hermes/sync-skills-hermes.cjs`, which pruned `.hermes/skills/cli-jev/` |
| `sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`, `baseline-readme-verdicts.json` | Regenerated | `test_readme_manifest.py --write`, and `test_readme_verdict_parity.py --write` after staging |
| The trigger index and its three fixtures under `system-spec-kit/runtime/` | Regenerated | Rebuilt by the session from an archive of HEAD in `c0178c093d` |
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` in this phase | Modified | Closed from the evidence. Not yet committed |

Commits on the worktree branch, not pushed: `ea883967d4` the move, 177 paths. `347f9db711` the 2026-09-29 spec amendments and the live 017 Jev run record. `c0178c093d` the trigger index and its fixtures, 23,318 documents, 0 stale, 0 obsolete and 0 untrusted. The build and session records under `scratch/w3-build/`, `scratch/w3-session/` and the baseline files beside them are untracked and not yet committed.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The session took the baselines at clean HEAD `3dde18cb54`: the fleet gates, three per-hub checks, four suites and the 17-prompt route baseline through `--hub cli-jev`. It then ran `git mv` for the 70 moving hub files and for the rollout child and activation folders in both trees, and staged them. A fresh Opus 5.5 xhigh build orchestrator sent 62 single-change briefs one at a time through Bash, 16 to Devin `deepseek-v4-1-flash-max` and 46 to Pi `llmgateway/mimo-v2.6-pro`. Every dispatch exited 0 and none came back BLOCKED. Five were re-dispatches after the orchestrator's own checks caught a problem, and three were follow-ups for lines an earlier brief missed. The orchestrator ran each generator itself, replayed the 17 prompts through `--hub cli-classifier` and reported PASS with three items left for the session.

The session reran every gate from the final state and got the same results. It then split a read-only review by author family: Pi MiMo read what Devin wrote, and Devin DeepSeek read what Pi wrote. Both returned FAIL. The session confirmed the harness P1 against the other rollout harnesses, where 6 of 7 had no such check, and sent fix round 1. Devin added the assertion, Pi made the moved playbook root validate and a Pi recheck returned PASS. The session then staged the build, ran `test_readme_verdict_parity.py --write` and committed `ea883967d4`. It committed the spec amendments in `347f9db711` and rebuilt the trigger index from an archive of HEAD in `c0178c093d`. After that the stale-path grep printed nothing, which closed the other P1. The session reran the replay at `c0178c093d` and handed this closure pass its evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The baseline replay ran before any file moved | After the move `--hub cli-jev` no longer routes, so the only baseline is the one taken first |
| All 17 recorded prompts replayed, not only the 10 the spec names | The baseline file holds 17, a superset of the 10, so every recorded prompt is compared |
| The whole hub moved with `git mv`, and hub-root files merged | A plan that moves `cli-usage` alone and then removes the hub deletes 22 files (What Not To Build row 104) |
| One commit for the move and every list | One `git revert` of `ea883967d4` restores the hub, its files and every list together, which the kill criterion needs |
| The replay compares `action`, `selectionKind` and `packetId` | The hub and mode ids change by design and the policy hash changes with the merged registry. The session's comparer also checked `packetKind`, `backendKind` and the exit code |
| `cli-classifier` joins the compiled fleet in `cli-jev`'s place | Without it the front door serves the hub as legacy and the replay could never match (REQ-012) |
| The activation manifest comes from the library's canonical bytes | The CLI `mint` verb cannot compile a transport-only hub, and `refresh` proves the bytes re-derivable |
| The twin's old activation records moved unchanged | Regenerating them would claim a rollback rehearsal that never ran |
| The dispatch audit reports the hub id | Every other hub reports its hub id, so a `jev` dispatch reports `cli-classifier` with packet path `cli-classifier/cli-usage` |
| CC-002 rewritten in place, not retired | Its expectation became false with the move. Rewritten, it scores for mode `cli-jev` in the admission check beside CJ-001 and CJ-002 |
| Changelogs and dated benchmark reports stay as written | They record what happened at a path that no longer exists |
| CLI executors build from single-change briefs, and P2 findings are recorded, not chased | Parent D5 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every check ran from the worktree root. The first column names who ran it. Where the build and session records differ, the session's wins, because it reran the gates from the final state. The closure pass ran read-only `git` commands and the four doc gates, and reran no suite.

| Check | Result |
|-------|--------|
| Session baseline at clean HEAD `3dde18cb54` | Guard, sync `--check`, status and admission exit 0 on 7 hubs. `parent-skill-check.cjs` exit 0 on `cli-classifier` (1 mode), `cli-jev` and `cli-external-orchestration`. Foundation vitest 37 passed, manifest test 42 tests with 28 pass and 14 fail at exit 1, dispatch audit 75 passed, rule-checks 20 of 20 |
| Build, then session: the 17-prompt replay through `--hub cli-classifier` | Build: "TOTAL 17 rows, 17 match, 0 mismatch", exit 0. Session comparer, which also compares `packetKind`, `backendKind` and the exit code: `rows 17 after 17 mismatch 0`, exit 0, rerun at committed HEAD `c0178c093d` (`scratch/w3-session/compare-output.txt`). The kill criterion did not fire |
| Session: three Deem prompts through `--hub cli-classifier` | Each routes single `cli-deem`, compiled, policy hash `63c0e7c4...`, generation 1 |
| Session: `parent-skill-check.cjs .skilled/skills/cli-classifier` | Exit 0, "3b: mode-registry.json declares 2 modes", 13a and 13b at 1.1.0.0. Also exit 0 on `cli-external-orchestration` |
| Session: `compiled-route-status.cjs --all` | Exit 0. 7 fleet hubs compiled, `cli-classifier` at generation 1 and `cli-external-orchestration` at 5, plus the 2 legacy test rows present at baseline. No `cli-jev` row |
| Session: `compiled-route-guard.cjs` | Exit 0, 7 hubs fresh including `cli-classifier`, before and after the commit's re-mint |
| Session: `compiled-route-admission.cjs` | `--hub cli-classifier` exit 0 with 5 pass and 0 drift. `--all` exit 0, every hub passes |
| Session: `compiled-route-sync.cjs` | `--check` exit 0, all 7 hubs resolve. `--verify` exit 0, move-simulation OK |
| Build, then session: the `cli-classifier` manifest | `refresh` exit 0 with SHA-256 `aa840b21735c...` before and after. `freshness` `fresh: true` on `cli-classifier` and `cli-external-orchestration`, before and after the commit |
| Session: suites against the baseline | Foundation 37 passed (37). Manifest test 28 pass and 14 fail, failing names identical to the baseline. Dispatch audit 75 passed (75). Rule-checks 20 of 20 (20). Advisor full suite 130 files, 1030 passed, 6 skipped, exit 0, the recorded wave-3 figure. Fan-out merge 61 passed, and the file holds 61 tests at HEAD and after |
| Build: advisor stage 1 | "ask jev for a probability that this plan ships on time" ranks `cli-classifier` first at 0.8483, and "ask deem for a probability that this incident is urgent" at 0.8963. No `cli-jev` entry in either |
| Build: generators and mirrors | Leaf manifest `--check` OK. `skill_graph_compiler.py --validate-only` "VALIDATION PASSED". `sync-runtime-mirrors.cjs --check` "PASS: 170 mirrors across 8 trees are in sync". Codex 12 agents in sync. Hermes 72 copies in sync |
| Build: twin byte identity | `cmp` of runtime and twin for the harness, the 3 libs, the canary fixture, both runtime-engine files and both activation manifests: all identical |
| Session: comment hygiene | No spec path, phase or packet number, REQ, task, ADR or finding id in any added line of `*.cjs`, `*.mjs`, `*.ts` or `*.js` |
| Session: `validate_document.py` on the 64 changed skill docs | All exit 0 except the 5 byte-identical moved docs, whose HEAD copies fail the same way |
| Review round 1, cross-family and read-only | Pi MiMo on Devin's files and Devin DeepSeek on Pi's. `git status --porcelain` and the SHA-1 of both diffs were equal before and after. Both printed `VERDICT: FAIL`, with 2 P1s and 5 P2s between them |
| Fix round 1 | Negative proof: `threw code=GOLD_MISMATCH message=gold mismatch for deem-choice-single: modes [cli-deem] but expected [cli-jev]`. Sync, guard, admission and freshness exit 0, foundation 37 passed. The playbook root validates with 0 issues, auto and `--type playbook`, 22 rows unchanged |
| Fix-round recheck, Pi with the diff pasted | Findings none, `VERDICT: PASS`, tree unchanged |
| Closure: `git show -M --name-status ea883967d4` | 177 paths. From `.skilled/skills/cli-jev/`: 70 rename rows and 11 `D` rows, the `D` rows exactly the eleven named merges. CJ-001 and CJ-002 `R052`, the 5 moved changelogs `R100` |
| Closure: `git ls-files .skilled/skills/cli-jev` at `c0178c093d` | 0 lines, and the folder does not exist |
| Closure: the REQ-008 stale-path `git grep` | No output, exit 1. Without the exclusions the same pattern matches 134 files, and the 5 outside `specs/` are all changelogs or dated reports |
| Closure: `git grep -n "'cli-jev'"` over the seven list files | No output, exit 1. Each list names `cli-classifier` once, and the serving-closure `hubs` holds 7 entries |
| Closure: registry and router read | 2 modes. `cli-jev` over packet `cli-usage`, `transport`, `metadata`. `"tieBreak": ["cli-jev", "cli-deem"]` |
| Closure: `repair-derived.cjs --folder <this phase> --apply` | Exit 0, `failed=0`, on the final state of these docs |
| Closure: `validate.sh <this phase> --strict` | `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, exit 0. `RESULT: FAILED` appears 0 times in the output |
| Closure: `check-goal.cjs <this phase>` | 5 of 5 checks PASS, `RESULT: PASSED (5/5 checks)`, exit 0 |
| Closure: `goal.cjs packet <this phase> --workspace "$PWD"` | `STATUS=OK`, `packet_budget=unknown` as expected for a phase child, `packet_durable_chars=4068`, exit 0 |

### Requirement Results

| Requirement | Result |
|-------------|--------|
| REQ-001 entry gate | Met. 008 Complete and `parent-skill-check.cjs` exit 0 before the move |
| REQ-002 baseline before any move | Met with 17 prompts, a superset of the 10, at a HEAD holding 81 hub files |
| REQ-003 whole-hub `git mv` | Met. 70 renames, 11 named merges, 0 hub files left, disposition table above |
| REQ-004 mode `cli-jev` over `cli-usage` | Met. Two modes, and `parent-skill-check.cjs` exit 0 |
| REQ-005 literal lists | Met. No `'cli-jev'` list line, and `cli-classifier` once in each list |
| REQ-006 kill criterion | Met. 0 mismatches over all 17 prompts, so no revert |
| REQ-007 one commit | Recorded deviation. The move commit holds everything but the trigger index, which follows in `c0178c093d` by the session's ruling |
| REQ-008 stale paths | Met. The grep prints nothing |
| REQ-009 ordered bundle reachable | Met. Both modes in `tieBreak`, and `orderedBundle` no longer reads "unreachable" |
| REQ-010 changelogs as written | Met. The 5 moved changelogs are `R100`. `v1.1.0.0.md` is a new entry, not an edit |
| REQ-011 generated artifacts by their tools | Met. Each generator is named in Files Changed |
| REQ-012 compiled-fleet onboarding | Met. Every list, both trees, the canonical manifest and all five fleet gates |
| REQ-013 CJ scenarios moved and rewritten | Met. Both `R052`, prompts unchanged |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **17 prompts, not 10.** The spec, REQ-002, REQ-006 and goal criteria 1 and 4 name 10 prompts. The baseline and the replay hold 17, the 7 canary prompts and the hub-routing scenario prompts plus phrasing variants. Criteria 1 and 4 were amended at close to name the 17, and the operator can revert them.
2. **Trigger index in its own commit.** REQ-007 wants it in the move commit. It is built from an archive of HEAD, so it follows in `c0178c093d`, as every earlier phase of this packet did. The session's ruling.
3. **Five hub-routing scenarios.** `hub-routing/` holds 5 files covering the 3 cases REQ-012 names, because REQ-013 keeps and rewrites CJ-001 and CJ-002. CC-003 absorbed CJ-003, and CC-002 was rewritten in place.
4. **Authored twin of the runtime engine.** `014-runtime-engine/lib/{compiled-route,resolve}.cjs` were edited in the twin as well as the runtime, because sync `--check` needs them equal. The spec names only the runtime paths.
5. **Generator output absorbed older drift.** `durable-directory-manifest.json` gained `.skilled/hooks/goal/lib` and the 008 `cli-classifier` folders. `baseline-readme-verdicts.json` gained 43 READMEs committed since its last write, 30 of them in this packet, and only the 3 merged hub READMEs changed verdict, fail to pass.
6. **`NODE_PATH` for the agent-mirror-sync gate.** The pre-commit gate could not load `@spec-kit/shared`, because `system-deep-loop/node_modules` is not provisioned in this worktree. Provisioning is an install that needs the operator's yes, so the session committed with `NODE_PATH` pointing at a scratch folder holding one link to this worktree's own `system-spec-kit/shared`. Every gate ran, and none was bypassed.
7. **Activation manifest as `D` plus `A`.** `activation/cli-classifier/manifest.json` shows as a delete and an add against HEAD in both trees, because its canonical bytes carry a new policy hash. The twin's regenerated `compiled/*` does the same. None is among the 81 hub files.
8. **Another hub reminted.** Brief 06's registry edit staled the `cli-external-orchestration` manifest, so `refresh` reminted it to generation 5 and brief 39 copied the twin.
9. **Re-dispatches.** 36 to 36b to 36c, because a templated rewrite scored 26 percent similarity and would have broken criterion 2. 52 to 52b and 53 to 53b, to raise the CJ rewrites from R050 and R044 to R052. 29 to 29b, because the brief's check contradicted its one-line scope and Pi stopped correctly. 19b, 19c and 20b were follow-ups, because `.claude/agents/` is hand-kept, not generated.
10. **Fix round 1 went past hub-name prose.** T006 allowed only prose that names the packet's hub. Fix round 1 also renamed and moved the moved playbook root's sections so it validates, since the build had changed a row in it. Its 22 scenario rows are byte-identical.
11. **Fix-round proof on the twin path.** The fix leaf ran the harness on the twin, because the runtime copy would have written 11 untracked files. The two are byte-identical, and it also loaded the runtime module in memory. Its own Pi check made no tool calls, so the session reran it with the diff pasted.
12. **Build scope slips.** The build orchestrator wrote temp files outside `scratch/w3-build/` and removed all of them.
13. **Stale premises corrected at close.** The "(proposed)" markers on `cli-classifier` and `cli-deem` are gone from `goal.md`, `spec.md` and `plan.md`. `spec.md` section 7 records the answers to its two build-time questions, and its problem statement is dated to `3dde18cb54`.
14. **Parent changelog not refreshed.** `spec.md` asks for a refresh under `../changelog/`. The parent packet has no `changelog/` folder, and creating one is outside this closure's write scope.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Review P2 findings, recorded and not chased (parent D5).** (a) `cli-classifier` and `cli classifier` are no longer `cli-deem` aliases, so "run the cli-classifier on this" defers where 008's one-mode hub routed it to `cli-deem`. (b) The `004-cli-external-orchestration` canary `jev-transport-single` (`canary-cases.v1.json:201-214`) still expects `cli-jev` while that hub now defers the prompt, as the spec directs, and that harness reads no `expectedModes`. (c) "use jev and deem to score this" routes single `cli-deem`, because its dispatch phrase scores 8 against 4. An alias prompt naming both gives the ordered bundle, so REQ-009 holds. (d) `feature-flag-governance.md:56` in system-spec-kit and `compiled-routing-architecture.md:34` in sk-create-skill list 5 compiled hubs, which predates this phase. (e) `compiled-route-manifest.test.cjs:1127` asserts a cohort of 6 against 7, one of the 14 baseline failures.
2. **`system-deep-loop` is not provisioned in this worktree.** Provisioning is `bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision`, an install that waits for the operator's yes. Until then the `NODE_PATH` workaround in Deviations item 6 is the record.
3. **Five moved docs fail `validate_document.py`.** `cli-usage/assets/question-shaping-card.md` and four `cli-usage/references/` files lack an `overview` section. They moved byte-identical, and their HEAD copies fail the same way.
4. **The twin's activation records still describe `cli-jev`.** Five records moved byte-identical and still record the `cli-jev` first activation (hash `3240...`).
5. **File mode.** The `refresh` left the runtime `activation/cli-classifier/manifest.json` at mode 0600.
6. **The build record is not committed.** `scratch/w3-build/`, `scratch/w3-session/` and the baseline files are untracked.
<!-- /ANCHOR:limitations -->

---
