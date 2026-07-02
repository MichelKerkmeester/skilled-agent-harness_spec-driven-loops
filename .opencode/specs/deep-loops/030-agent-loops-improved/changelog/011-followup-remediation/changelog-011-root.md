---
title: "Changelog: Follow-Up Remediation [011-followup-remediation/root]"
description: "Chronological changelog for the Follow-Up Remediation spec root."
trigger_phrases:
  - "root changelog"
  - "packet changelog"
  - "nested changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-07-02

> Spec folder: `.opencode/specs/deep-loops/030-agent-loops-improved/011-followup-remediation` (Level 2)

### Summary

Phase 011 closes the 4 deferred follow-ups phase 009's own changelog named: 2 active review findings from a prior codex deep-review lineage, scaffold-content authoring debt across phases 002-007, the `validate.sh` dual-path registry-bridge gap, and (not yet started) the sliding-window convergence mode. Children 001-006 are Complete; child 007 (sliding-window convergence) remains pending. Closing child 006 required tracing a stale-dist bug in `validate.sh` itself back to its root cause and, once fixed, discovering the fix's true blast radius was repo-wide rather than packet-scoped — that work was spun out into its own packet (`system-speckit/030-validate-sh-dist-freshness-and-repo-remediation`) rather than absorbed into this phase, to keep this phase's own scope from ballooning past "close packet 030's follow-ups."

### Before vs After

**Before**

`deep_review_auto.yaml`'s "new lineage" init path wrote `sessionId` as a raw timestamp instead of binding the real session id the fan-out runner generates, so every downstream consumer (state log, findings registry, convergence events, claim adjudication) inherited the wrong id. The shared fan-out prompt builder told dispatched subprocesses "you are a {agentName} agent" and instructed them to run the full multi-iteration loop, contradicting the LEAF-agent contract that requires exactly one iteration. 18 leaves under `002-deep-loop-runtime`, 12 under `003-deep-loop-workflows`, and 10 more across `004-007` had genuinely-authored `spec.md` files but scaffold-template placeholder `plan.md`/`tasks.md` bodies. The default `validate.sh` invocation never ran registry-backed shell rules (`COMMENT_HYGIENE_MARKER`, `SCAFFOLD_NEVER_TOUCHED`, and ~18 others), only the 2 originally believed to be the whole gap — because the compiled validation orchestrator `validate.sh` depends on had been silently stale for roughly two weeks, with no freshness check anywhere in the repo to catch it.

**After**

Both fan-out review findings are fixed: session ids propagate correctly through the native-executor path too, and the shared prompt builder frames dispatched subprocesses as orchestrating the workflow YAML rather than claiming LEAF-agent identity, covering all 3 loop types (context/research/review) from one shared-function fix. All ~40 originally-scoped leaf children (plus `001-reference-research`, a standalone phase outside that original count) now carry real, spec.md-grounded `plan.md`/`tasks.md` content. `validate.sh`'s default path now bridges every eligible registry rule automatically, proven by a fixture that previously would have silently passed and now correctly fails. A permanent, repo-wide dist-freshness enforcement layer now exists — a shared checker, a hard `validate.sh` backstop, a Claude Code hook, and an OpenCode plugin — so this exact failure mode (a stale compiled artifact silently masking shipped validator logic for weeks) cannot recur unnoticed again.

**Impact**

Packet 030 itself passes `validate.sh --strict --recursive` with 0 errors across all 12 folders. The registry-bridge fix, once its true scope was understood, also exposed and is now closing a repo-wide validation debt spanning all 43 packet roots in the monorepo (257 folders) — most of it pre-existing and never previously visible to any caller, not something this phase's own changes created.

**Why**

Phase 009's changelog explicitly deferred these 4 items rather than declaring them silently out of scope; leaving them open after packet 030 was otherwise "done" would have meant the packet's own documented follow-up list stayed permanently stale. Sequencing children 003-005 (scaffold-content authoring) strictly before child 006 (the registry bridge) was a hard dependency: enabling `SCAFFOLD_NEVER_TOUCHED` by default before those ~40 leaves had real content would have immediately broken them.

### Added

- `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs` — shared source-vs-dist staleness checker, 7 watched packages.
- `.opencode/plugins/mk-dist-freshness-guard.js` — OpenCode plugin warning before risky Bash dispatches and once per session.
- `.opencode/skills/sk-code/scripts/check-dist-staleness.sh` — Claude Code PostToolUse warn-only checker.
- A hard fail-closed backstop in `validate.sh`'s `run_node_orchestrator()` (exit 3 on stale compiled orchestrator).
- `runRegistryShellRules()` and 3 supporting functions in `orchestrator.ts`, bridging the default validate.sh path to registry-backed shell rules.
- Real `plan.md`/`tasks.md`/`implementation-summary.md` content for `001-reference-research` and all ~40 leaf children across phases 002-007.
- New top-level packet `system-speckit/030-validate-sh-dist-freshness-and-repo-remediation` (2 children: dist-freshness enforcement, repo-wide remediation sweep).

### Changed

- `deep_review_auto.yaml` / `deep_review_confirm.yaml`: `session_id` now resolved and bound into config/state-log/findings-registry writes instead of a raw timestamp.
- `fanout-run.cjs`'s `buildLoopPrompt` identity line reworded across all 3 loop types; `buildNativeCommandInput` now threads a session id.
- `.opencode/bin/{spec-memory,code-index,skill-advisor}.cjs` migrated from inline per-shim freshness logic onto the shared `dist-freshness.cjs` module.
- `finalize-dist.mjs` had a now-dead build-time hash write removed (orphaned when the CLI shims migrated to the shared cache scheme) and a stale, sourceless `hooks/opencode/session-start.js` artifact requirement removed.

### Fixed

- Fan-out session-id propagation (F002) and LEAF-identity conflation (F003), both prior codex deep-review findings.
- ~40 leaf children's scaffold-template content debt across phases 002-007, plus `001-reference-research`'s own 9 scaffold markers (outside the original leaf-only scope).
- A `Spec Folder` metadata literal-string-compare bug in `008-loop-systems-remediation` and `010-documentation-truth-audit`'s own `implementation-summary.md` files, discovered while investigating the same gate failure.
- 3 P2 findings from a formal `sk-code-review` pass on the new dist-freshness code (silent fail-open on an unexpected checker error, a symlink-cycle gap in the source-file walk, a non-atomic cache write).
- Stale phase 011 continuity and phase-map state flagged by the 2026-07-02 deep-review (GPT-F001): root continuity now points at child 007 and the parent phase map matches the children's own declared statuses.
- 8 masked validation errors exposed by the first direct recursive validation of the 011 subtree (GPT-F002): stale `Spec Folder` metadata in children 001-005, a false In Progress status on the unstarted child 007, and a legend-vs-task false positive in `check-files.sh` and `check-level-match.sh` now anchored to real task lines.
- The context and research workflow YAMLs now resolve a caller-supplied detached session id the same way the review YAML does (GPT-F004), closing the parity gap the review found in child 001's otherwise-shipped fix.

### Verification

- `validate.sh --strict --recursive` on the whole `030-agent-loops-improved` packet: 0 errors, 12/12 folders.
- `test-validation-extended.sh`: 113/113, independently re-run multiple times across this phase's work.
- `072-scaffold-never-touched-violation` fixture: fails via the default invocation (previously would have silently passed); `073-scaffold-never-touched-clean` still passes; explicit `SPECKIT_RULES=` path confirmed unchanged.
- A `git checkout` incident mid-session discarded child 006's uncommitted work; recovered from a local Time Machine snapshot and independently re-verified (diff-stat, full function-level read, two full test-suite re-runs) — recorded in `006-validate-sh-registry-bridge/implementation-summary.md`.
- Formal `sk-code-review` pass on the dist-freshness code: APPROVED after fixing all 3 P2 findings it raised.
- A 10-iteration GPT-5.5-fast xhigh deep-review (2026-07-02, `review/lineages/gpt/review-report.md`) returned CONDITIONAL with 0 P0, 5 P1 and 1 P2. All findings independently verified real, then remediated: stale continuity and phase-map state reconciled (GPT-F001), the missing 011-parent recursive validation run and its masked errors fixed (GPT-F002, which exposed stale Spec Folder metadata in children 001-005, a false Status in child 007 and a legend-vs-task false positive in two shell rules), and the context/research session-id parity gap closed (GPT-F004). GPT-F003 and GPT-F006 are deferred as one documented orchestrator seam, see `changelog-011-006-validate-sh-registry-bridge.md` Follow-Ups.
- `validate.sh --strict --recursive` on the 011 phase parent directly: 8 folders, 0 errors except one known FILE_EXISTS error on the Not Started child 007 caused by the deferred native-validator parity gap, not by the scaffold itself.

### Files Changed

| File | Change |
|------|--------|
| `.opencode/commands/deep/assets/deep_review_auto.yaml`, `deep_review_confirm.yaml` | Session-id resolution and binding |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Identity-line rewording, native-executor session-id threading |
| `002-deep-loop-runtime/{001-018}-*`, `003-deep-loop-workflows/{001-012}-*`, `004-007`'s 10 leaves, `001-reference-research` | Real `plan.md`/`tasks.md`/`implementation-summary.md` content |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Registry-bridge functions, wired into `validateFolder()` |
| `.opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh` | New default-path scaffold regression test |
| `system-speckit/030-validate-sh-dist-freshness-and-repo-remediation/**` (new packet) | Shared dist-freshness infra + repo-wide remediation sweep |
| `.opencode/bin/{spec-memory,code-index,skill-advisor}.cjs`, `finalize-dist.mjs` | Migrated onto shared freshness module, dead-code removed |
| `008-loop-systems-remediation`, `010-documentation-truth-audit` `implementation-summary.md` | Spec Folder metadata fix |

### Follow-Ups

- Child 007 (sliding-window convergence mode, per ADR-001 in `009-research-backlog-remediation/009-convergence-design-and-hardening/decision-record.md`) has not started.
- `system-speckit/030-validate-sh-dist-freshness-and-repo-remediation`'s bucket-3 report (54 folders across 17 packets, mostly `ai-systems/*`, that predate the current template-compliance contract) recommends extending `SPECKIT_GENERATED_METADATA_GRANDFATHER` into a general template-compliance grandfather mechanism — a policy decision still open, not implemented.
