---
title: "Review Report: onboarding fixes commit range"
description: "Five-iteration deep review of the onboarding fixes commits: PASS with seven P2 advisories, each confirmed by a command, six fixed and one rejected by the changelog contract."
trigger_phrases:
  - "onboarding fixes review report"
importance_tier: "normal"
contextType: "review"
---

# Review Report: onboarding fixes commit range

## 1. Executive Summary

- **Verdict:** PASS
- **hasAdvisories:** true
- **Active findings:** P0 0, P1 0, P2 7
- **Scope:** commits `dd001838f0`, `54a2e9abbc` and `424f28b8fc` on `worktrees/113-rem-onboarding-fixes`, 16 files across the README install path, the Pi and Codex session hooks, sk-vision's setup line, the agent mirror checker and both pre-commit hooks.
- **Executor:** cli-pi, `llmgateway/deepseek-v4.1-flash` at `--thinking max`, five iterations, stop policy max-iterations, stop reason `maxIterationsReached`.
- **Disposition:** the orchestrator confirmed each of the seven findings with a command. Six are fixed in a follow-up commit. R1-P2-001 is a confirmed fact but not a defect, because the changelog mode's contract keeps a skill README's version separate. The confirming commands are in the registry below.

## 2. Planning Trigger

`/speckit:plan` is not required. The verdict is PASS and every advisory is fixed inside this packet.

```json
{
  "label": "Planning Packet",
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": ["R1-P2-001", "R1-P2-002", "R1-P2-003", "R1-P2-004", "R2-P2-001", "R5-P2-001", "R5-P2-002"],
  "remediationWorkstreams": ["mirror checker load errors", "hook test and doc coverage", "Pi notice wording", "README and version carrier precision"],
  "specSeed": [],
  "planSeed": [],
  "findingClasses": ["instance-only", "class-of-bug", "matrix/evidence"],
  "affectedSurfacesSeed": [".skilled/bin/lib/mirror-sync-verify.cjs", ".skilled/scripts/git-hooks/tests/pre-commit.test.sh", ".skilled/hooks/git/README.md", ".skilled/scripts/git-hooks/README.md", ".skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts", "README.md"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Title | File | Confirmed by | Disposition |
|----|-----|-------|------|--------------|-------------|
| R1-P2-001 | P2 | sk-vision README version carrier stale at 0.3.5.0 | `.skilled/skills/sk-vision/README.md:10` | `grep -n '^version' .skilled/skills/sk-vision/README.md` printed `0.3.5.0` against SKILL.md `0.3.6.0` | Not a defect, left as is: the changelog mode sets the new version in every carrier "never `README.md`, whose version is the document's own" (`.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` section 7 step 6), and `system-spec-kit` and `system-skill-advisor` READMEs already differ from their SKILL.md versions |
| R1-P2-002 | P2 | Pi unbuilt notice can misdiagnose a non-root cwd | `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts:49` | The notice checks `join(ctx.cwd, <adapter>)`, so a session started in a subdirectory of a built repository reports "not built" | Fixed: the notice names the directory it looked in and says to start Pi at the repository root or build there |
| R1-P2-003 | P2 | README trust-skip comment overstates skipped gates | `README.md:181` | `grep -c trustRepoHooks .skilled/scripts/git-hooks/commit-msg` printed 0, so the message contract still runs in an untrusted clone | Fixed: step 5 says the pre-commit checks are skipped |
| R1-P2-004 | P2 | New warn tests do not assert the build remediation | `.skilled/scripts/git-hooks/tests/pre-commit.test.sh:901` | `grep -n 'run build'` over both new tests printed nothing | Fixed: both tests assert the build command |
| R2-P2-001 | P2 | Hook READMEs document the mirror gate as block-or-allow only | `.skilled/hooks/git/README.md:100` | `grep -n checkable` over both hook READMEs printed nothing | Fixed: both READMEs name the warn-and-skip outcome and its build command |
| R5-P2-001 | P2 | The legacy pre-commit helper's exit-3 branch has no harness case | `.skilled/hooks/git/pre-commit:99` | `grep -n run_legacy` lists six cases and none plants a mirror checker exiting 3 | Fixed: a `run_legacy` case asserts the warn-and-skip |
| R5-P2-002 | P2 | A parser that exists but fails to load is still reported as DRIFT | `.skilled/bin/lib/mirror-sync-verify.cjs:30` | A temp copy with a parser file that throws on load printed `DRIFT  p: cannot verify` and exited 1 | Fixed: any load failure is tagged not checkable, with a vitest case for a corrupt parser |

## 4. Remediation Workstreams

1. **Mirror checker load errors (R5-P2-002).** Tag a require failure or a missing export the same way as a missing file.
2. **Hook test and doc coverage (R1-P2-004, R5-P2-001, R2-P2-001).** Assert the build line, cover the legacy helper and document the third outcome.
3. **Pi notice wording (R1-P2-002).** Name the directory checked and both remedies.
4. **README precision (R1-P2-003).** R1-P2-001 needs no change, per the changelog contract.

## 5. Spec Seed

- None. Every finding is inside the frozen scope of this packet's R5 and R9 rows or its README rows.

## 6. Plan Seed

- None. The fixes landed in this packet.

## 7. Traceability Status

- **spec_code (core):** pass. Each build row in `spec.md` maps to a commit and a proof line in `implementation-summary.md`.
- **checklist_evidence (core):** pass. Level 1 packet, no checklist; the goal criteria carry the evidence.
- **skill_agent (overlay):** pass. The First Use spellings were checked against every runtime's command or prompt file in iteration 5.
- **AC_COVERAGE:** exempt (Level 1).

## 8. Deferred Items

- None.

## Dimension Expansion Map

- Saturated directions: none recorded.
- Pivots: none. The five iterations ran correctness, security, traceability, maintainability, then an adversarial correctness pass.
- Remaining frontier: none recorded.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record)*

## 10. Audit Appendix

- **Convergence:** stop policy max-iterations, so convergence was telemetry only. Iterations 3 and 4 found nothing new, and iteration 5 found two new P2s on its adversarial pass.
- **Coverage:** 4 of 4 dimensions.
- **Ruled out:** exit 3 colliding with another checker exit code (the checker exits 0, 1 or 3 only), shell errexit traps in the new `|| MIRROR_RC=$?` capture, new path-handling attack surface, and overengineering in the lazy loader.
- **Sources reviewed:** the 16 scope files listed in `deep-review-config.json`, plus each runtime's SYNC.md and prompt files for the First Use spellings.

### Core Protocols

- spec_code: pass
- checklist_evidence: pass (Level 1)

### Overlay Protocols

- skill_agent: pass
