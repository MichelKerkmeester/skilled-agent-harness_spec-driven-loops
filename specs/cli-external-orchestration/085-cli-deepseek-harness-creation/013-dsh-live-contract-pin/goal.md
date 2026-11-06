---
title: "Goal: Phase 13: dsh-live-contract-pin"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "dsh live contract pin goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/013-dsh-live-contract-pin"
    last_updated_at: "2026-11-06T17:26:22Z"
    last_updated_by: "codex"
    recent_action: "Completed route promotion, focused checks and strict phase validation."
    next_safe_action: "Review the AI Council ADR-001 reopen condition with the operator."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
      - "evidence/route-llmgateway.stdout.jsonl"
      - "evidence/latency-and-tokens.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-013-dsh-live-contract-pin"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "OpenCode Go endpoint and authentication remain unknown because OPENCODE_API_KEY was unset and no request was sent"
      - "supportsDeveloperRole true remains unknown because the closed roster did not allow a variant patch"
      - "MCP, plugin and shell-write confinement remain untested beyond the saved probes"
    answered_questions:
      - "LLM Gateway deepseek-v4.1-flash-1017 completed on dsh 0.2.2-rc.1"
      - "workspace-write denied a $HOME file write and allowed an OS temp path"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 13: dsh-live-contract-pin

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every roster route the operator has keyed is proven by a saved completed `dsh` headless run, and only proven routes are promoted out of experimental.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The session never reads, copies or prints a key. The operator places it in the launch environment or a disposable home's `.env` |
| D2 | Every probe runs under a fresh `mktemp -d` `DSH_HOME`, and `~/.dsh` must be identical before and after the phase |
| D3 | Routes run serially, one short harmless prompt per probe, and a route that fails twice is recorded "configured, not verified" |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Each keyed route's `dsh --profile headless --json --permission-mode workspace-write --approval-policy never -` OK run is saved in `evidence/` with exit 0 and `final.reason.kind` `completed`. Evidence: `evidence/route-llmgateway.exit.txt` and `route-llmgateway.stdout.jsonl`; OpenCode Go was not keyed and no request was sent (`latency-and-tokens.md`).
- [x] In a temp workspace the inside write succeeds, the outside write returns a `tool_result` error and `bash` `echo ok` returns `completed`, captured in `evidence/`. Evidence: `evidence/confinement.md` and its result captures. The sibling OS temp write is also recorded as allowed.
- [x] A `max` reasoning request shows no `UNSUPPORTED_REASONING_EFFORT` and the developer-role compat need is recorded. Evidence: `evidence/reasoning-max.md`.
- [x] The saved deep-research lineages with the kind complete, and the clean run has a clean containment scan. Evidence: `evidence/fanout-lineage.md`.
- [x] `evidence/latency-and-tokens.md` has one row per route, and each route is marked verified or "configured, not verified" in the packet and the `executor-config.ts` allowlist. Evidence: `references/providers-and-models.md`, `executor-config.ts` and `evidence/live-contract-count.txt`.
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
| Keyed live contract pin | Complete, saved evidence and phase checks recorded | LLM Gateway completed with exit 0 and `final.reason.kind` `completed` on dsh 0.2.2-rc.1. OpenCode Go is configured, not verified because its key was unset and no request was sent. The focused suite run had only the two documented sandbox failures. Evidence: `evidence/route-llmgateway.stdout.jsonl`, `evidence/route-llmgateway.exit.txt`, `evidence/phase-006-focused-vitest.txt`, `evidence/phase-006-typecheck.txt` and `evidence/validate-strict.txt` |

### Deviations and findings

| Item | Note |
|------|------|
| Confinement boundary | A `$HOME` file write was denied while a sibling OS temp write succeeded; the capability and docs record both results. Evidence: `evidence/confinement.md` |
| Operator follow-up | The LLM Gateway verification meets AI Council ADR-001’s reopen condition. Keep the roster unchanged and ask the operator to review that condition after this phase. |
<!-- /ANCHOR:log -->
