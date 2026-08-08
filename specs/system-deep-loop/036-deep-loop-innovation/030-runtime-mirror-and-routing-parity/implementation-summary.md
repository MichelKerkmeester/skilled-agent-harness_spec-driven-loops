---
title: "Implementation Summary: Runtime-Mirror and Routing Parity Gates"
description: "Parity gates now compare ordered load-bearing instructions and comparable tool surfaces, resolve route identities on disk, and preserve distinct shared-packet improvement modes (Codex sandbox-mode derivation, F-028-01, was attempted and reverted — deferred)."
trigger_phrases:
  - "runtime mirror parity"
  - "mirror sync verify ordering"
  - "registry compiler unresolved identity"
  - "codex agent parity coverage"
  - "deep loop 030 parity"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/030-runtime-mirror-and-routing-parity"
    last_updated_at: "2026-08-07T23:03:21Z"
    last_updated_by: "codex"
    recent_action: "Landed 7/8 findings (2f84f78bf7); F-028-01 sync-agents deferred (buggy read-only)"
    next_safe_action: "Regenerate stale Codex review mirror"
    blockers:
      - ".codex/agents/review.toml is stale and the environment denies writes under .codex"
      - "No independent second actor was available in this session"
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs"
      - ".opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs"
      - ".opencode/skills/system-deep-loop/hub-router.json"
      - ".opencode/skills/system-deep-loop/shared/references/smart-routing.md"
      - ".opencode/skills/system-deep-loop/deep-review/assets/runtime-capabilities.json"
      - ".opencode/specs/system-deep-loop/036-deep-loop-innovation/030-runtime-mirror-and-routing-parity/checklist.md"
    completion_pct: 92
    open_questions: []
    answered_questions:
      - "Codex is compared only when its shipped TOML mirror exists; absent Codex Markdown files are not missing mirrors."
      - "The ai-council leaf is the sole writer authority for ai-council artifacts."
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

# Implementation Summary: Runtime-Mirror and Routing Parity Gates

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 030-runtime-mirror-and-routing-parity |
| **Spec Folder Path** | `.opencode/specs/system-deep-loop/036-deep-loop-innovation/030-runtime-mirror-and-routing-parity` |
| **Updated** | 2026-08-07 |
| **Level** | 2 |
| **Status** | Complete (7/8 findings landed; F-028-01 deferred) |
| **Candidate SHA** | `9229cb8f3e281c9291e6d631237528bc755e6f4b` |
| **Landed Commit** | `2f84f78bf7` on `skilled/v4.0.0.0` |
| **Rollback** | Restore touched implementation and test files from `5c98e4654e4bcaf2c7002412d6da2b92f1793942`; do not reset unrelated worktree changes. |
| **Auth gateway touched** | No |
<!-- /ANCHOR:metadata -->

## T001 Confirm-First Record

The eight cited findings were re-read at HEAD `9229cb8f3e281c9291e6d631237528bc755e6f4b` before implementation edits. All eight were `CONFIRMED`; none were `REFUTED`, `MOVED`, or `ALREADY-FIXED`. The required calibration remains: **operator/stale-local robustness and cutover-readiness risk, NOT remote-attacker breach risk.**

| Finding | Status | HEAD probe and disposition |
|---------|--------|----------------------------|
| F-028-01 | CONFIRMED · DEFERRED (not landed) | `.codex/agents/ai-council.toml:5` used a hardcoded `workspace-write` mode; `sync-agents.cjs` used a per-agent historical map. The attempted deny-bash→read-only derivation wrongly flips ai-council (write:allow, bash:deny) to read-only, which would block its `ai-council/**` artifact writes; reverted. A correct derivation must key on write/edit permission, not bash. The intended sandbox stays `workspace-write`. |
| F-028-02 | CONFIRMED | `.claude/agents/deep-review.md:4` lacked `detect_changes`, while the canonical body required it. The Claude surface now exposes `mcp__mk_code_index__detect_changes`; the Pi generator retains the OpenCode-only permission as unmapped because that runtime surface cannot map it. |
| F-028-03 | CONFIRMED | `.opencode/agents/ai-council.md:722-731` described competing direct/helper write paths. The canonical, Claude, and Pi bodies now name the LEAF council as the sole writer authority; the existing Codex TOML body agrees. |
| F-028-04 | CONFIRMED | `mirror-sync-verify.cjs:71-95` compared token Sets. The gate now compares ordered load-bearing sequences and preserves token equality for non-load-bearing prose. |
| F-040-02 | CONFIRMED | `deep-review/assets/runtime-capabilities.json:6-31` and `review-mode-contract.yaml:428-445` omitted the shipped Codex TOML mirror. The deep-review matrix and contract now include Codex, with TOML tool surfaces marked non-comparable. |
| F-035-02 | CONFIRMED | `shared/references/smart-routing.md:41-47` merged shared-packet lanes onto first-declared identity. The routing contract now carries `(workflowMode, leafResourceId)` pairs without reinterpretation. |
| F-027-01 | CONFIRMED | `hub-router.json:72` omitted `/deep:command-benchmark`. It now belongs to `command-benchmark-aliases`, not `alignment-aliases`, and the compiler emits that launcher vocabulary. |
| F-027-02 | CONFIRMED | `registry-compiler.cjs:327-372` validated identity strings without disk resolution. Compilation now resolves packet directories, packet `SKILL.md`, and leaf files before emitting resources. |

<!-- ANCHOR:what-built -->
## What Was Built

### Mirror comparison and agent sync

`mirror-sync-verify.cjs` now treats OpenCode and Claude Markdown surfaces as required, Codex TOML as optional and body-comparable when shipped, and an absent optional mirror as `not-shipped` rather than a false missing-runtime failure. Load-bearing instruction markers are compared in order. A Markdown mirror fails when its body requires `detect_changes` but its declared tool surface does not expose that capability. TOML tool surfaces are intentionally not compared as Markdown frontmatter.

`sync-agents.cjs` retains its per-agent `HISTORICAL_SETTINGS` map, which keeps `ai-council` at `workspace-write` — the correct mode, because deriving `read-only` from its Bash denial would block its `ai-council/**` artifact writes. A `deriveSandboxMode` fallback exists but is not the effective path for the current 13 agents (all are covered by the historical map). F-028-01 — the deny-Bash→`read-only` derivation — was attempted and reverted for that reason; a correct write/edit-keyed derivation remains deferred (see the finding table and Known Limitations). `sync-agents.cjs --check` and the sandbox suite therefore still report the stale `.codex/agents/review.toml` (`workspace-write`), which cannot be regenerated under this environment's `.codex` write boundary.

### One ai-council writer authority

The LEAF council is the sole writer authority for `ai-council/**` artifacts. The dispatching parent handles implementation after the council returns and does not write council artifacts. The body change was applied together to `.opencode/agents/ai-council.md`, `.claude/agents/ai-council.md`, and `.pi/agents/ai-council.md`; the existing `.codex/agents/ai-council.toml` was verified against the same authority wording.

### Routing and compile-time identity

`/deep:command-benchmark` is declared in its own launcher vocabulary class and is absent from alignment aliases. `registry-compiler.cjs` rejects path escapes, missing packets, missing packet `SKILL.md`, and missing leaf files. The shared-packet improvement lanes remain observable as typed workflow/leaf pairs for agent-improvement, model-benchmark, and skill-benchmark.

### Runtime capability matrices

The deep-review runtime matrix and review-mode contract now cover OpenCode, Claude, and the shipped Codex TOML mirror. Codex's converted format is explicitly marked as non-comparable for tool-surface checks. The ai-council capability matrix remains limited to runtimes that can execute supported council seats; Codex is intentionally excluded from that seat-executor claim even though a converted agent file exists.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The cited files were confirmed before edits. Negative probes were added before their corresponding fixes, then the focused suites were rerun per changed surface. The 7 landed findings shipped as `2f84f78bf7` on `skilled/v4.0.0.0`; F-028-01 was reverted before landing (see T001 table) and remains deferred.

Runtime mirror inventory was checked before editing:

- ai-council: `.opencode/agents/ai-council.md`, `.claude/agents/ai-council.md`, `.pi/agents/ai-council.md`, and existing `.codex/agents/ai-council.toml`.
- deep-review: `.opencode/agents/deep-review.md`, `.claude/agents/deep-review.md`, `.pi/agents/deep-review.md`, and existing `.codex/agents/deep-review.toml`.

The focused `check-agent-mirror-sync.cjs` receipt reports two required Markdown agents in sync. The Pi body already contains the deep-review structural preflight, but its generated tool list records `detect_changes` as an unmapped OpenCode-only permission; adding a nonexistent Pi capability would be a false parity claim.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- Compare only surfaces that are actually shipped. Required OpenCode/Claude mirrors fail when absent; Codex is optional per agent and is checked only when its TOML file exists.
- Compare ordered load-bearing sequences, not full-body line order. This catches a workflow inversion without making harmless formatting drift load-bearing.
- Treat Markdown tool frontmatter as comparable and TOML tool metadata as format-specific. Body-mandated capabilities still fail a comparable mirror when absent.
- Keep one ai-council writer authority at the leaf. Parent orchestration does not compete for artifact ownership.
- Resolve registry packet and leaf paths against the skill root at compile time. A string that does not exist on disk is not a valid route identity.
<!-- /ANCHOR:decisions -->

### Red-to-Green Evidence

| Defect class | Red-before receipt | Green receipt |
|--------------|--------------------|---------------|
| Mirror order and tool surface | The added reordered-sequence and missing-`detect_changes` probes failed in the pre-fix run; the preserved mirror/parity baseline was green before the new probes. | `mirror-sync-verify.vitest.ts` plus `promote-candidate-mirror-sync.vitest.ts`: 8 tests passed, rc 0. Suite digests `021303aecc616a6a0face9d634d9b21425607587e87e0152f288b084d4992a0e` and `5209bd40d7df01460dbc95661020daa012cb2c5cfe6cc3ced2a46f415d2d131c`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. |
| Packet and leaf identity | The pre-fix compiler accepted string identities before the disk-resolution guard was added. | `deep-loop-registry-compiler.vitest.ts`: 5 tests passed, including packet, leaf, combined-invalid-identity, launcher-vocabulary, and three-mode probes. Suite digest `5248651d3fe402251ffdedb94bb997e517d8fa8355a0c93f88b39b941ef8c5e4`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. |
| ai-council authority parity | The pre-fix parity run found Markdown authority drift and the mirror parity assertion was skipped; the red assertion was activated before the fix. | `multi-ai-council-runtime-parity.vitest.ts`: 2 tests passed; `multi-ai-council-mirror-parity.vitest.ts`: 1 test passed. Suite digests `b4e89a0d3911ab27c4dd12a180a493fddcaa6d623b7778cb8380b3a25aefe74b` and `aa2d8d9569b5d4fe9d8061ffbab84158a2efa2442fef2dfc2ee57db4ef5a2bac`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. |
| Capability matrix parity | The pre-fix deep-review capability tests expected only OpenCode and Claude. | `deep-review-contract-parity.vitest.ts`: 12 tests passed; runtime capability conformance plus resolver tests: 24 tests passed. Suite digests `e989dd11d3f74dd55fc4314149e204e92fa290f986859b6ccf3e741fcef2b179`, `aa69779fcfd8ac1f194972c39a440aa2fcdbc2458747f93a639e9ad9ce5dd9b4`, and `d9885d0000987541d760bbb11f8ae5a321da2c16a0bca7e6f7d15409ae90fbd0`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`. |

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Mirror and promotion suites | PASS; 2 files, 8 tests, rc 0 |
| Registry compiler identity and routing suite | PASS; 1 file, 5 tests, rc 0 |
| ai-council runtime parity | PASS; 1 file, 2 tests, rc 0 |
| ai-council mirror parity | PASS; 1 file, 1 test, rc 0 |
| Deep-review contract parity | PASS; 1 file, 12 tests, rc 0 |
| Runtime capability matrix and resolver tests | PASS; 2 files, 24 tests, rc 0 |
| `parent-skill-check.cjs .opencode/skills/system-deep-loop` | PASS; all hard invariants, rc 0 |
| Runtime TypeScript | PASS; `../../system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.json`, rc 0 |
| Targeted agent mirror checker | PASS; 2 agents in sync, rc 0 |
| `sync-agents.cjs --check` | FAIL; only `.codex/agents/review.toml` remains stale, rc 1 |
| `sync-agents-sandbox.vitest.ts` | FAIL; source-derived modes pass, generated review output is still `workspace-write`, rc 1 |
| Broad hub vocabulary sync | FAIL; unrelated pre-existing natural-alias and phantom-keyword drift remains |
| Compiled-routing parity suite | BLOCKED before tests by a pre-existing missing `sk-doc` module path |
| Routing artifact build | BLOCKED by missing `activation/manifest.prior.json`; no generated artifact was hand-edited |

The full 168-file runtime suite was not run because the repository instruction identifies the append-lock hang. No new failure was introduced in the focused suites that passed; the remaining direct-sync failure is the stale generated Codex review mirror.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

The environment rejects writes under `.codex`, so `sync-agents.cjs` could not regenerate `.codex/agents/review.toml`; the exact next command is `node .opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs`, followed by its `--check` and the sandbox suite. The Pi generator also has unrelated baseline drift and cannot map the OpenCode-only `detect_changes` permission to a confirmed Pi built-in capability. The broad vocabulary scan and compiled-routing harness have pre-existing blockers outside this packet. No commit, push, database reset, or `transition-authorization-gateway.ts` edit was performed.
<!-- /ANCHOR:limitations -->
