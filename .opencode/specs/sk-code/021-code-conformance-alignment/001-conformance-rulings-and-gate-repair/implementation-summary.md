---
title: "Implementation Summary: Conformance Rulings and Gate Repair"
description: "Evidence ledger for the scoped gate repairs; this child remains In Progress."
trigger_phrases:
  - "conformance gate evidence"
  - "widened drift baseline"
  - "gate repair implementation summary"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/001-conformance-rulings-and-gate-repair"
    last_updated_at: "2026-07-31T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Captured the repaired fixtures, discovery canary, lane baselines, and widened three-guard result"
    next_safe_action: "Run the live Write-tool smoke and have the verifier attack the remaining repo-wide findings"
    blockers:
      - "Live Write-tool smoke is still outstanding"
      - "The widened alignment and router-sync guards fail on existing backlog/environment"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "frozen-directory-manifest.md"
    completion_pct: 80
    open_questions: []
    answered_questions:
      - "Q2 - 020 owns runtime/** only"
      - "Q4 - exact-header checking is opt-in"
      - "Q5 - repository-wide scan with --fail-on-warn withheld"
---
# Implementation Summary: Conformance Rulings and Gate Repair

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

## Metadata

<!-- ANCHOR:metadata -->

| Field | Value |
|---|---|
| **Status** | In Progress |
| **State** | The scoped implementation is present, but the live Write-tool smoke and repo-wide gate backlog remain open. |
| **Owner** | The orchestrator closes the child. |
<!-- /ANCHOR:metadata -->

## What Was Built

<!-- ANCHOR:what-built -->

The installed hook paths, comment-hygiene matcher, test naming table, Node discovery contract, repo-wide scan wrapper, opt-in exact-header check, and 020 border are repaired. The accepted scope rulings are formalized in `decision-record.md`.

### Baseline anchor

- `git rev-parse HEAD` returned `719ad8f638c54084c3354ed53b0a0a8bfdafce56`.
- The packet-scoped `git status --short` was empty before the baseline capture.
- The baseline command was `python3 .opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root <R>` for each listed root. Output receipts below preserve the verifier's verdict/count lines and SHA-256 of each captured output.

| Root | Verbatim verdict/counts | Output SHA-256 |
|---|---|---|
| `.opencode/bin` | `FAIL`; Scanned 99; Findings 3; Errors 3; Warnings 0 | `0b0a58d09a1c465522bc884b0cc9ea8873c92cc252b9f8097ebf90d9a90458d7` |
| `.opencode/hooks` | `PASS`; Scanned 43; Findings 0; Errors 0; Warnings 0 | `f018db1357319140f4004b2de8712d39ec5fa38b359102d679be9006091df174` |
| `.opencode/plugins` | `PASS`; Scanned 33; Findings 0; Errors 0; Warnings 0 | `a941af04b93fd7bce7e9bf960cadd5a7c48cffba3f2d6f02d07a77d968d9f195` |
| `.opencode/scripts` | `FAIL`; Scanned 11; Findings 3; Errors 2; Warnings 1 | `e7c24bfcf60b0ebb55fdb12308c273dd159e5c0ef411c1606f4080f19b51d6e7` |
| `.opencode/commands/doctor/scripts` | `PASS`; Scanned 12; Findings 1; Errors 0; Warnings 1 | `308fdb8c9b2a87bebf11ef7f236ad8025fc7a2b99cc99d866fc0ab6715368033` |
| `.github/hooks/scripts` | `PASS`; Scanned 2; Findings 0; Errors 0; Warnings 0 | `5c8ae3c4e8b5bf20cac19642a2622ecf70b1d461444fc3d9e6979f4dfd88b50b` |
| `.claude/statusline-command.sh` | `PASS`; Scanned 0; Findings 0; Errors 0; Warnings 0 | `aca35828a378f15b39218f7c676e28aa4830895dc4ab391d20d7678d43db0a53` |
| `.opencode/skills/sk-code` | `PASS`; Scanned 66; Findings 0; Errors 0; Warnings 0 | `1706412a88e8648ce714082f00805c98b26cd5d707677f500e583fa91e0e9079` |
| `.opencode/skills/sk-doc` | `PASS`; Scanned 114; Findings 1; Errors 0; Warnings 1 | `70c13b95ffe738761b754cbb0dc55e580cee723288de602235623edd5a2135d4` |
| `.opencode/skills/sk-design` | `PASS`; Scanned 2755; Findings 0; Errors 0; Warnings 0 | `113eb17b5ee7c471f9b62c525be08b3cbc36ef5605a628c040b8624a69868c95` |
| `.opencode/skills/mcp-code-mode` | `PASS`; Scanned 12; Findings 1; Errors 0; Warnings 1 | `930e714eabf1328bc5ae9e93580d3add196c42612324a1e4676702757a24ec7a` |
| `.opencode/skills/system-deep-loop/shared` | `PASS`; Scanned 12; Findings 0; Errors 0; Warnings 0 | `e66fbed08b98d60292c022b4bbb5f45880f5a544bb8f7d68ff18d0776ae5be8a` |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts` | `PASS`; Scanned 123; Findings 0; Errors 0; Warnings 0 | `2c6de395e3c6ad48ba4a8f371de9d4ff39681ec932059b1c14a3f630e709526b` |
| `.opencode/skills/sk-prompt` | `PASS`; Scanned 185; Findings 46; Errors 0; Warnings 46 | `bd2167f0e76adde0f0696fb210580c9fc3f48bec3392b9d16f739f2ba1c863a5` |
| `.opencode/skills/system-spec-kit` | `FAIL`; Scanned 1878; Findings 2; Errors 1; Warnings 1 | `674c2effe07bcfcef6ab1516b1ee11a2f1b2503e27a3ed661cdeadfa58db2992` |

These are full SHA-256 digests from an isolated `git archive HEAD` baseline at the recorded commit. Later children must re-run the exact command and report a new full-output SHA rather than treating these counts as a completion gate.
<!-- /ANCHOR:what-built -->

## How It Was Delivered

<!-- ANCHOR:how-delivered -->

The implementation used paired negative/positive fixtures first, then the smallest checker and hook changes, followed by syntax, shellcheck, integration, and discovery-canary runs.

### Repaired gate evidence

| Command | Result | Evidence SHA |
|---|---|---|
| `bash .opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh` | 21 PASS lines; `All comment hygiene test cases passed`; rc 0 | `85b8f01d65998ca1dc10e22984b92a3bd4b25fbc88c2887b6025ab3b1d2eef0a` |
| Pre-change comment fixture run | rc 1; four expected new positive fixtures failed before matcher changes | `6291136e850bf7aa58a31e6bb83e30171e189d82a02396cfb24cb7d52688164b` |
| `bash .opencode/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.test.sh` | `Post-edit adapter parse regression fixture passed`; rc 0; appended `<<<<<<< HEAD` marker was rejected by `node --check` | `0c37f7d8a1ed1568c54494289910e2e59b3ed1ef3268d8de76106cfb3491d816` |
| `node --test .opencode/plugins/tests/mk-post-edit-quality.test.cjs` | 39 tests; 39 pass; 0 fail; rc 0 | `5f4dfd8ff0b52d35e845be0089456c3aa82e7456a90d8e0ab869aa7058efd8b6` |
| `node .opencode/scripts/run-node-tests.mjs --list` | 86 lines; rc 0; runner/glob discovery canary passed | `b5bc39c1ea3ef772ebc80a7cbd844d765e38dd79c294bdf3dc1106f1112362bb` |
| `python3 .../verify_alignment_drift.py --root .opencode/skills/sk-code` | `PASS`; Scanned 67; Findings 0; Errors 0; Warnings 0; rc 0 | `7ef2cae4c92714da7cc525617df79701f154f340c5ad7ab0d71314fba9c1eae8` |
| `python3 .../verify_alignment_drift.py --root .opencode/commands/doctor/scripts --check-exact-headers` | rc 1; 8 findings: 7 `EXACT-HEADER`, 1 existing warning | `0cbf88c506a1f36b895f3d7b616ab60beeb2a555f011ef788d7b95ae011b9971` |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child-folder> --strict` | `RESULT: PASSED`; Errors 0; Warnings 0; rc 0 | `6e705bb66fb13df336c2351267af469e4b98f2fc749ffae0bab063c3820bc501` |

Syntax receipts: `bash -n` rc 0, `node --check` rc 0, `PYTHONPYCACHEPREFIX=/private/tmp/skc021-pycache-final python3 -m py_compile ...` rc 0, and `shellcheck` on touched Bash files rc 0.
<!-- /ANCHOR:how-delivered -->

## Key Decisions

<!-- ANCHOR:decisions -->

ADR-001 through ADR-011 are Accepted. The binding choices are generated/external output out, authored non-symlink mirrors only, frozen fixture subjects, amended names without migration, bounded generic-label matching, manual review for pattern/example assets, two machine/manual work lists, repo-wide scan with warnings withheld, opt-in exact headers, runtime-only 020 ownership, and one installed hook per lifecycle.

### Final test-name census

Command: `git ls-files ':(glob)**/<pattern>' ':(exclude)**/z_archive/**' | wc -l`, captured at HEAD. Output SHA-256: `334d37fff330c592e3851b18fdc2c3eb5aadbea118cbb3bf82e75bac85419a77`.

```text
*.vitest.ts  1229
*.test.ts      43
*.test.cjs     50
*.test.mjs     39
*.test.sh       6
test_*.py      29
*.test.js       0
```
<!-- /ANCHOR:decisions -->

## Verification

<!-- ANCHOR:verification -->

### Widened three-guard result

Command used for the complete offline capture:

```text
env npm_config_offline=true npm_config_fetch_retries=0 npm_config_fetch_timeout=1000 bash .opencode/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh
```

Full output capture: `/private/tmp/skc021-widened-three-guards-final-offline.txt`, 497 lines, SHA-256 `2e0f83141b5f318b4e7a55a2d62822bf9cd1ac726acb8be7feec8bab0d49781e`, direct rc `1`.

```text
alignment-drift: FAIL; Scanned files: 18162; Findings: 475; Errors: 264; Warnings: 211
stack-folders: PASS; 6 language folders resolve
router-sync: FAIL; npm error ENOTCACHED because vitest is not available offline
run-all-drift-guards: 2 guard(s) FAILED
```

The normal-environment invocation was also run; router-sync attempted the network and failed while resolving `vitest`. The final captured gate deliberately used npm offline mode so the full wrapper output and direct rc were deterministic. `--fail-on-warn` remains withheld; errors still fail the wrapper.
<!-- /ANCHOR:verification -->

## Known Limitations

<!-- ANCHOR:limitations -->

- The frozen manifest is [frozen-directory-manifest.md](frozen-directory-manifest.md). It records the exact generation loop and tracked-file counts for each child work-list root.
- The installed runtime hook paths are recorded in ADR-011. The alternate helper files remain direct-test/compatibility surfaces; they are not installed runtime hooks.
- `node .opencode/bin/install-codex-hooks.mjs --check --allow-worktree` returned rc 1: 8 missing identities, 8 command-drift identities, and 7 orphaned identities in the user-global Codex hook file. That file is outside this child scope.
- The full Node runner was exercised separately and returned rc 1 (`node:test — 84 files · 626 pass · 162 fail`; Vitest skipped because it is not installed). Those failures are outside this child’s gate-repair scope and are not represented as passing evidence.
- No completion claim is made. The remaining live Write-tool smoke is intentionally left for the orchestrator/verifier.
<!-- /ANCHOR:limitations -->
