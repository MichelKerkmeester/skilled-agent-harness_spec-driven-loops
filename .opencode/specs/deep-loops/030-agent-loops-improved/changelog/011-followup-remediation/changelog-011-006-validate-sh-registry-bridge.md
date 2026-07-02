---
title: "Changelog: Validate.sh Registry Bridge [011-followup-remediation/006-validate-sh-registry-bridge]"
description: "Chronological changelog for the Validate.sh Registry Bridge phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-02

> Spec folder: `.opencode/specs/deep-loops/030-agent-loops-improved/011-followup-remediation/006-validate-sh-registry-bridge` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/030-agent-loops-improved/011-followup-remediation`

### Summary

The default `validate.sh` path never ran registry-backed shell rules. A self-healing bridge function now runs every eligible registry rule automatically, deriving its skip-set live from the orchestrator's own native-check results rather than a hardcoded allowlist. Verifying this fix clean required first closing `001-reference-research`'s own scaffold markers (outside the original leaf-only scope of children 003-005) and, separately, discovering and fixing a two-week-stale compiled validation orchestrator -- the true root cause behind why the intended fix's blast radius was repo-wide rather than packet-scoped. The repo-wide dist-freshness infrastructure and remediation work shipped as its own packet, `system-speckit/030-validate-sh-dist-freshness-and-repo-remediation`, not folded into this child.

### Added

- `runRegistryShellRules()`, `readValidatorRegistry()`, `resolveRegistryRuleScript()`, `mapShellRuleStatus()` in `orchestrator.ts` (181 insertions, purely additive).
- A default-path scaffold regression test in `test-validation-extended.sh` proving the bridge fires without `SPECKIT_RULES` set.
- Real `plan.md`/`tasks.md`/`implementation-summary.md` content for `001-reference-research`'s 9 scaffold markers, grounded in its own `spec.md` and `research/research.md`.

### Changed

- `validateFolder()` now calls the bridge immediately after native entries are built, on every default invocation.
- `008-loop-systems-remediation` and `010-documentation-truth-audit`'s own `implementation-summary.md` `Spec Folder` metadata field corrected to the bare folder basename, matching what `check-spec-doc-integrity.sh` actually compares against.

### Fixed

- Fixed the gap where registry-backed rules like `COMMENT_HYGIENE_MARKER` and `SCAFFOLD_NEVER_TOUCHED` never ran under a plain `validate.sh --strict` call.
- Fixed `001-reference-research`'s scaffold-signature markers, a genuine phase-011 planning gap since it has no leaf children and fell outside children 003-005's stated scope.
- Fixed a `Spec Folder` literal-string-compare bug in 2 unrelated folders, surfaced by the same gate investigation.

### Verification

- `validate.sh --strict --recursive` on the whole `030-agent-loops-improved` packet: 0 errors, 12/12 folders.
- `072-scaffold-never-touched-violation` fixture fails via the default invocation (previously silently passed); explicit `SPECKIT_RULES=SCAFFOLD_NEVER_TOUCHED` path confirmed unchanged.
- `test-validation-extended.sh`, 113/113, independently re-run multiple times across this session.
- Post-completion incident (a downstream documentation dispatch's `git checkout` discarded this child's uncommitted work) recovered from a local Time Machine snapshot and independently re-verified: diff-stat, full function-level read, two full test-suite re-runs. Recorded in this folder's own `implementation-summary.md`.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Modified | Registry bridge function, wired into `validateFolder()` |
| `.opencode/skills/system-spec-kit/scripts/tests/test-validation-extended.sh` | Modified | New default-path scaffold regression test |
| `001-reference-research/{plan.md,tasks.md,implementation-summary.md}` | Modified | Real content, closing this phase's own scaffold-marker gap |
| `008-loop-systems-remediation/implementation-summary.md`, `010-documentation-truth-audit/implementation-summary.md` | Modified | Spec Folder metadata fix |

### Follow-Ups

- Repo-wide dist-freshness enforcement (shared checker, `validate.sh` hard backstop, Claude Code hook, OpenCode plugin) and the 41-packet remediation sweep it exposed shipped separately as `system-speckit/030-validate-sh-dist-freshness-and-repo-remediation` -- see that packet's own changelog.
- No vitest suite exercises `validateFolder()`'s dual-path branch logic directly; coverage relies on the bash-level `test-validation-extended.sh` fixtures. Confirmed again as GPT-F006 (P2) by the 2026-07-02 10-iteration deep-review.
- The registry bridge filters out `strict_only` rules unconditionally (orchestrator.ts, the `strict_only !== true` filter), so a `--strict` run through the Node path never executes strict-only shell rules the shell path would run. Confirmed as GPT-F003 (P1) by the same deep-review. A second parity gap found while closing GPT-F002: the native `validateFileExists` requires `implementation-summary.md` unconditionally for Level 1 while the shell rule exempts folders whose tasks show no started work, so a genuinely Not Started scaffold (011 child 007) fails FILE_EXISTS under the Node path. The bundled fix is the one-line strict-aware filter, the started-work exemption in `validateFileExists`, and the vitest coverage above, deferred as one change because it requires a shared-dist rebuild and a concurrent session holds live uncommitted work in the same mcp_server package. Closing condition: apply all three, rebuild dist, and re-run `test-validation-extended.sh` once the tree is quiet. Until then, 011 child 007 carries exactly one known FILE_EXISTS error that reflects this validator gap, not a defect in the scaffold.
