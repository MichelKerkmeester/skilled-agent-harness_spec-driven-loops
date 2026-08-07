# Iteration 005 — Cross-Runtime Mirror Behavior (Q2)

**Focus:** Q2 — How do the cross-runtime mirrors (`.claude`, `.codex`, `.cursor`, `.devin`, `.pi`) resolve or mirror the specs folder, and which would need their own `specs` symlink or path update?
**Track:** cross-runtime
**Executor:** cli-devin / glm-5-2
**Date:** 2026-08-06

## Approach
Listed each mirror dir's symlinks (`ls -la | grep`), grepped each mirror for `.opencode/specs` references, and inspected `sync-runtime-mirrors.cjs` (the mirror sync script) for specs-handling logic.

## Findings

### F5.1 — NO mirror carries a `specs` symlink; mirrors symlink skills/commands/manual-testing-playbook, not specs
| Mirror | Symlinks present | `specs` symlink? |
|---|---|---|
| `.claude` | `commands -> ../.opencode/commands`, `skills -> ../.opencode/skills`, `manual-testing-playbook`, `.utcp_config.json` | NO |
| `.codex` | `manual-testing-playbook` | NO |
| `.cursor` | `manual-testing-playbook`, `mcp.json -> ../.mcp.json` | NO |
| `.devin` | `manual-testing-playbook` | NO |
| `.pi` | `manual-testing-playbook` | NO |

Mirrors resolve the specs folder **indirectly**: (a) via the root `specs` symlink for direct access, and (b) via their `skills`/`commands` symlinks whose target content references `.opencode/specs` (the 626 skills + 32 commands files from Q5). No mirror maintains its own `specs` symlink that would need repointing.
[SOURCE: `ls -la .claude/.codex/.cursor/.devin/.pi` symlink listings]

### F5.2 — `sync-runtime-mirrors.cjs` does NOT manage a specs symlink
`scripts/runtime-mirrors/sync-runtime-mirrors.cjs`: grep for `specs`/`spec` returns only `inspect()` function-name hits (lines 139, 202, 223) — there is NO specs-folder sync logic. The mirror sync script creates/maintains skills, commands, and manual-testing-playbook symlinks; it does not touch specs. **Relocation requires no `sync-runtime-mirrors.cjs` change.**
[SOURCE: .opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs (no specs logic)]

### F5.3 — Only 2 mirror files reference `.opencode/specs`, both prose (cosmetic)
- `.claude/SYNC.md:28` — documents the root `specs` symlink as "whole-dir symlink -> `../.opencode/specs`" (a documentation row, "No" in the needs-sync column). Cosmetic; would become stale prose after relocation.
- `.devin/hooks/README.md:52` — a prose citation `[Canonical live evidence](../../.opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md)`. Cosmetic; the link target resolves via the back-symlink (F4.5) so it would not actually break, but the path string would be stale.
**Verdict:** Zero functional break in mirrors. Two prose updates for cleanliness.
[SOURCE: `rg -n '\.opencode/specs' .claude/SYNC.md` L28; `.devin/hooks/README.md` L52]

### F5.4 — The back-symlink strategy (F4.5) covers mirrors automatically
Because mirrors resolve specs indirectly (via root `specs` symlink + skills/commands content referencing `.opencode/specs`), the back-symlink `.opencode/specs -> ../specs` keeps every mirror's specs access working:
- Root `specs` symlink is replaced by the real tree at `specs/` — direct mirror access via root `specs/` still works (now a real dir, not a symlink).
- Skills/commands content referencing `.opencode/specs/...` resolves via the back-symlink.
- The dual-root tooling (F2.2 indexer, F2.3 classifier) already scans `specs/` natively.
**No mirror needs its own `specs` symlink or path update.** The spec's §7 open question ("whether other runtime mirrors need their own `specs` symlink") is answered: NO — none of them have one today, and none need one.
[SOURCE: F5.1 mirror symlink inventory; F4.5 back-symlink; F2.2/F2.3 dual-root tooling; spec.md §7]

## What Worked
- `ls -la | grep` per mirror gave a definitive symlink inventory in one pass — immediately established "no specs symlink anywhere."
- Cross-checking the sync script confirmed the absence is by design (the sync script doesn't manage specs), not an oversight.

## What Failed / Ruled Out
- Ruled out: "mirrors need their own `specs` symlink or path update under relocation." FALSE — none have one today, none need one (F5.1, F5.4).
- Ruled out: "the mirror sync script needs updating." FALSE — it doesn't touch specs (F5.2).

## Novelty Justification
Fresh track, but largely confirms the F4.5 hypothesis that the back-symlink covers the whole repo. New structural facts: no mirror has a specs symlink (F5.1), the sync script doesn't manage specs (F5.2), and only 2 prose refs exist in mirrors (F5.3). Resolves the spec's §7 mirror open question with a definitive NO. Lower novelty than prior iterations because the risk was already expected to be near-zero given the iter-4 mirror counts (.claude 1, .devin 1, others 0).

## newInfoRatio: 0.35 (fresh track, confirms hypothesis, resolves §7 mirror question; low surprise)

## Next Focus Suggestion
All 5 key questions are now answered (Q1-Q5). The legal stop condition `all_questions_answered` is met. Proceed to phase_synthesis: produce `research/research.md` with the ranked implication list and explicit recommendation, plus the convergence report.
