---
title: "Goal: Phase 1: standalone-agent-and-council-command"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "standalone agent and council command goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/001-standalone-agent-and-council-command"
    last_updated_at: "2026-11-14T20:19:49Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-14-split-001-standalone-agent-and-council-command"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: standalone-agent-and-council-command

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the council run from one self-contained agent and one `/speckit:ai-council` command, before any council file is deleted.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The agent names no `system-deep-loop` path and runs no script. It keeps `bash: deny` and writes `ai-council/**` with its own Write and Edit tools, with the artifact layout and output schema in its own body. |
| D2 | The agent reaches every runtime through the existing mirror mechanism: `.skilled` and `.claude` authored, `.codex`, `.pi` and `.dsh` generated, `.cursor`, `.devin` and `.opencode` symlinked. No second mechanism is added. |
| D3 | The command is `/speckit:ai-council`, owned by `system-spec-kit`, single round, with one workflow file `speckit-ai-council.yaml` and one presentation file. |
| D4 | Nothing is deleted in this child. `/deep:ai-council` and the packet stay until child 002. |
| D5 | The gate baseline is captured at the start commit before the first edit and names that SHA. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n 'system-deep-loop|deep-ai-council|/deep:ai-council|append-mode-event|persist-artifacts|node ' .skilled/agents/ai-council.md .claude/agents/ai-council.md` prints nothing.
- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs --all` and `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` exit 0.
- [ ] `find -L .skilled/agents .claude/agents .codex/agents .cursor/agents .devin/agents .dsh/agents .opencode/agents .pi/agents -maxdepth 1 -name 'ai-council*' | wc -l` prints 8.
- [ ] `ls .skilled/commands/speckit/assets/speckit-ai-council*.yaml | wc -l` prints 1.
- [ ] `find -L .claude/commands .cursor/commands .opencode/commands .codex/prompts .pi/prompts .dsh/prompts -maxdepth 2 \( -path '*/speckit/ai-council.md' -o -name 'speckit-ai-council.md' \) | wc -l` prints 6.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Child docs authored | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md` written on 2026-11-14 when phase 006 was split into five children. Implementation has not started. |
| Setup T001 to T005 | Done | Commit c67864c53c. gate-baseline.md holds 58 gates at a55b1f3d58, six of them failing before this phase. exceptions.md lists 25 history paths and its existence check exits 0. |
| Agent and command, T006 to T017 and T099 | Done, AC-009 advisor clause open | Commit 34692583f9. Agent mirror checks, the three generators with --check, command-catalog-mirror-check and the advisor typecheck exit 0. The REQ-008 search prints nothing. The T017 find count prints 6. T099 on OpenCode 2.3.0 wrote seven files under ai-council/ and nothing outside the probe packet. |
| AC-009 advisor clause | Unmet until child 004 | The live scorer finds command-speckit-ai-council for the council prompt, but the hub council lanes in aliases.ts and lanes/explicit.ts compete and both rows drop to 0.25 confidence. Child 004 removes those lanes. Child 001 closes after that rerun. Children 002 to 004 proceed meanwhile, which departs from the Complete check in T095. |
| patch: allow | Operator decision Q010 | OpenCode 2.3.0 gives an agent a write tool only when patch or bash is allowed. The agent sets patch: allow and keeps bash: deny. |
| Files outside the spec file list | Changed as direct consumers | command-contract.json (speckit family), both command README.txt indexes, command-prompts.jsonl plus the recaptured command-routing-baseline.json, command-metadata-e2e census 27 to 28, agent-permission-denials.json, the compiled deep-ai-council contract (it records the agent digest), multi-ai-council-runtime-parity.vitest.ts. |
| Deep Route wording | Deviation | orchestrate.md names the two remaining deep agents. The spec file table said three, the registry keeps research and review. |
| Rollback without a shell | Design note | The agent cannot move or hash a file, so a rolled-back round is marked by rollback and artifact_superseded events and its files stay in place. The artifact_written checksum event is no longer written. Event timestamps are the agent's own estimate, because it has no clock. |
| AC-009 advisor clause | passes | advisor_recommend for the council prompt returns /speckit:ai-council at 0.8412 after the hub lanes left and a read-only lift for the command row was added in fusion.ts |

### Deviations and findings

| Item | Note |
|------|------|
| Ids carried from the parent | Task, requirement, criterion and checklist ids keep the numbers they had in phase 006 before the split, so this child's ids do not start at 001. |
<!-- /ANCHOR:log -->
