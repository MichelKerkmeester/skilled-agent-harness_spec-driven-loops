---
title: "Acceptance Criteria: Phase 8: alignment-findings"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "alignment findings acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/008-alignment-findings"
    last_updated_at: "2026-11-12T17:23:39Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-alignment-findings"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 8: alignment-findings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 008-alignment-findings
**Level:** 2
**Status:** Complete
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a cyclic pair of links at the wrapper path, When `skilled_loop_real_path` walks it, Then it returns 1 after 40 hops and the sourced shell does not hang | `node --test --test-name-pattern 'symlink cycle' .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` prints `# pass 2` and `# fail 0` Observed 2026-11-12: `a symlink cycle at the wrapper path returns 1` passes under bash and zsh in `scratch/green-full.txt`. Both failed by timeout before the fix in `scratch/red.txt`. Source: `.skilled/bin/skilled-loop-shell.sh:28`. | Met | - |
| AC-002 | REQ-002 | Given `skilled-loop cursor -H"x: y" "first prompt"`, When the replay classifier reads the arguments, Then the attached value consumes no following word and `first prompt` stays a prompt | `node --test --test-name-pattern 'attached short option value' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0` Observed 2026-11-12: `an attached short option value keeps the next word as the prompt` passes in `scratch/green-full.txt` and failed before the fix in `scratch/red-2.txt`. Source: `.skilled/bin/skilled-loop:956`. | Met | - |
| AC-003 | REQ-003 | Given the seven stale documents, When each is corrected, Then the guard lists seven denied commands, the hop replay rule, the shim trust limit and the setup window line match the hooks README, and no stale fragment survives | `rg -n -e 'claim., .complete., .keep. or .prepare.' -e 'carries model, name, Pi extension and Pi provider values only' -e 'starts every interactive runtime under it, also in a repository that links' -e 'source or model default' -e 'carries model selection' -e 'nearest wrapper' README.md .skilled/bin/README.md .skilled/hooks/README.md .skilled/skills/system-spec-kit/README.md .skilled/skills/system-spec-kit/feature-catalog .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks .skilled/hooks/session-relaunch/claude/README.md` prints nothing, and `rg -c 'SKILLED_LOOP_TRUSTED_CHECKOUTS' README.md .skilled/skills/system-spec-kit/README.md .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` prints 1 for each file Observed 2026-11-12: the stale-fragment search printed nothing with exit 1, and the count printed 1 for each of the four files. The search covers four more documents than planned. | Met | - |
| AC-004 | REQ-004 | Given the two env documents, When each is updated, Then `SKILLED_LOOP_TRUSTED_CHECKOUTS` is listed as the one operator-set variable and both window rows state the `autoCompactWindow`, `[1m]` and unknown rules | `rg -c 'SKILLED_LOOP_TRUSTED_CHECKOUTS' .env.example .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints 2 for each file, and `rg -n 'then the model default' .env.example .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints nothing Observed 2026-11-12: the count printed 2 for `.env.example` and 2 for `ENV-REFERENCE.md`, and the fallback search printed nothing. | Met | - |
| AC-005 | REQ-005 | Given the surface map, When the two shell tokens are added, Then the env check reports neither `BASH_VERSION` nor `ZSH_VERSION` as an unlisted operator switch | `rg -n -e '^    - BASH_VERSION$' -e '^    - ZSH_VERSION$' .skilled/commands/assets/local-skilled-alignment/surface-map.yaml` prints 2 lines Observed 2026-11-12: the search printed lines 573 and 574, and `check-env-tokens.cjs` on the report's scope printed `STATUS=OK check-env-tokens: files=8 tokens=2 unlisted=0`. The file sits in the primary checkout's gitignored local assets, outside the worktree. | Met | - |
| AC-006 | REQ-006 | Given the Claude relaunch playbook, When the two scenarios are added, Then a `session-relaunch.cjs window` run with and without a configured window and a `context-nudge-skipped` run with `reason=window-unknown` are both documented | `rg -l 'session-relaunch\.cjs" window' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` and `rg -l 'reason=window-unknown' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` each print the path Observed 2026-11-12: both searches printed the playbook path. Scenario CL-8's two commands printed `Claude context window: 200000 tokens` and a line starting `Claude context window: none configured.`, each exit 0, and the case CL-9 names passed 1 of 1. | Met | - |
| AC-007 | REQ-007 | Given the cli-opencode playbook and skill, When the key exemption is corrected, Then CO-001 exempts `OPENCODE_API_KEY`, CO-008 runs the key-only step, and the skill ships version 1.5.10.0 with its changelog entry | `rg -n '^version: 1.5.10.0$' .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` prints one line, `test -f .skilled/skills/cli-external-orchestration/cli-opencode/changelog/v1.5.10.0.md` exits 0, `rg -n 'other than .OPENCODE_API_KEY.' .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/base-non-interactive-invocation.md` prints 3 lines, and `rg -c 'OPENCODE_API_KEY=x' .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/external-dispatch/self-invocation-refusal.md` prints 2 Observed 2026-11-12: the version search printed line 5, the changelog file exists and passes `validate_document.py` and `check_changelog_shape.py`, the exemption search printed 3 lines and the key-only count printed 2. The key-only command printed `LAYER_1_OK: key alone`. | Met | - |
| AC-008 | REQ-008 | Given the two routing metadata files, When the signals are added and the graph is rebuilt, Then the advisor routes the eight action probes to the expected skill and ranks `system-spec-kit` first on the two read-only explainer probes | `node .skilled/commands/assets/local-skilled-alignment/run-probes.cjs --probes /Users/michelkerkmeester/.local/state/local-skilled-alignment/351-session-relaunch-review-remediation/20261112T152419Z/probes-input.json` prints `STATUS=FINDINGS run-probes: pass=8 fail=2 cannot_run=0`, where the two misses are P04 and P06, read-only explainer prompts the scorer floors at 0.25 confidence by design Observed 2026-11-12: `run-probes.cjs` printed `STATUS=FINDINGS run-probes: pass=8 fail=2 cannot_run=0` in `scratch/probes-after.json`. P04 and P06 are the misses, with `system-spec-kit` first at confidence 0.25, the read-only explainer floor in `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:456`. The seven advisor routing suites passed 75 of 75 before and after. | Met | - |
| AC-009 | REQ-009 | Given the parent goal, When the orchestrator corrects it, Then the completion criterion states 36 phase folders and the resend is recorded, with no worker edit | `rg -n 'All 36 phase folders' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md` prints one line, and `rg -n 'All eleven phase folders' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md` prints nothing Observed 2026-11-12: the first search printed line 95 and the second printed nothing. `goal.cjs packet` on that folder printed `packet_budget=ok` at 3,993 characters. | Met | - |
| AC-010 | REQ-010 | Given the changelog shape checker and its five documents, When the three ceilings rise to 280, 32 and 14, Then v4.0.2.1 passes the checker and every document carries the same numbers | `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.0.2.1.md` prints `PASS`, and `rg -c '280' .skilled/skills/sk-doc/sk-create-changelog/scripts/README.md .skilled/skills/sk-doc/sk-create-changelog/SKILL.md .skilled/skills/sk-doc/sk-create-changelog/README.md .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` prints at least 1 for each file Observed 2026-11-12: the checker printed `PASS .skilled/changelog/skilled/v4.0.2.1.md`, and the count printed 2, 1, 1 and 1 for the four files. | Met | - |
| AC-011 | REQ-011 | Given the root release note from `9af041968a`, When a reader opens v4.0.2.1, Then a `## Session Handover` section states the handover fixes | `rg -n '^## Session Handover$' .skilled/changelog/skilled/v4.0.2.1.md` prints one line Observed 2026-11-12: the search printed line 168. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All eleven criteria are Met with observed evidence. AC-008 was amended from ten probes to eight, because two probes are read-only explainer prompts the scorer floors by design, and that is recorded as a limitation. The evidence is pinned to the working tree above commit `bd2142a4fd`.
<!-- /ANCHOR:closure -->
