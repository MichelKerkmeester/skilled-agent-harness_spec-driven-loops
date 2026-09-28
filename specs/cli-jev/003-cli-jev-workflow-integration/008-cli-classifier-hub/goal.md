---
title: "Goal: Phase 8: cli-classifier-hub"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "cli-classifier hub goal"
  - "cli-deem completion criteria"
  - "deem client goal binding"
  - "cli-deem health smoke"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub"
    last_updated_at: "2026-09-28T10:00:00Z"
    last_updated_by: "spec-pass-leaf"
    recent_action: "Amended for parent D5 and D6: build roles, sk-doc and sk-code routes, and the generated paths"
    next_safe_action: "Reopen the Deem seams, then write cli-deem.mjs and its fake-server tests"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/008-cli-classifier-hub/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/007-classifier-deep-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: cli-classifier-hub

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every Deem arm one local transport by minting the `cli-classifier` hub (proposed) with `cli-deem` (proposed) as its first mode, a Node standard-library client that posts Deem's request shape, prints `jev-cli`'s answer shape and implements the Deem check as `cli-deem health`, while `cli-jev` stays where it is.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Parent D1 binds: every feature runs on Jev or Deem and stays dormant unless one is available. Jev is available when `jev auth status --provider <p>` exits 0. Deem is available when the local server passes a health check that refuses the stub backend. With neither, behavior is exactly today's. Jev gets no secret. `cli-deem health` is that Deem check: HTTP 200 within 2,000 ms (500 ms in a hook), `status` `ok`, backend `torch` or `ensemble:` without `stub`, model `deem-0.8-v1`, then the commit pair. The hub has no switch, and each caller keeps its own |
| D2 | The client never starts, stops, updates or rolls back the server. The packet documents `deem-ctl` (install, `start`, `status`, `update`, `rollback` with its hold) and never reimplements it. A keep survives an update only by requalification on its commit pair |
| D3 | One file, `node:` built-ins only, no bearer, no `--provider`. Exits mirror `jev-cli`: 0, 1 (HTTP 400), 2 (usage, or over 26 options or 64 questions), 3 (stub or foreign model), 4 (unreachable) and 130. With no server every subcommand exits 4 |
| D4 | Only the hub, this phase folder and generated files change: the advisor graph, the trigger index and its three fixtures, the Hermes copies `.hermes/skills/cli-classifier/SKILL.md` and `.hermes/skills/cli-deem/SKILL.md` and, only if the hub is admitted to compiled routing, its activation manifest under `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-classifier/` and that manifest's `specs/sk-doc/019` mirror. `cli-jev` moves in phase 009, not here. Nothing calls the real server except the orchestrator's one smoke |
| D5 | Kill: the per-hub check fails or a replayed Deem request routes elsewhere. Revert the hub commit |
| D6 | Parent D5 and D6 bind. A fresh Opus 5.5 xhigh build orchestrator writes single-change briefs and runs CLI executors by Bash only: Devin `deepseek-v4-1-flash-max`, Cursor `grok-4.7-xhigh-fast` and Pi on Cline `cline-pass/cline-pass/deepseek-v4.1-flash` at `xhigh` once a probe passes. The orchestrator session verifies, gets a cross-family review of the code and commits. `SKILL.md`, README, changelog, feature catalog and playbook go through sk-doc, and code follows sk-code's OpenCode route |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` exits 0, and its `mode-registry.json` lists one mode, `cli-deem`, with `packetKind` `transport`
- [ ] `node --test` on `.skilled/skills/cli-classifier/cli-deem/scripts/tests/` exits 0 against an in-test fake server, with cases where a stub backend and a wrong model id exit 3, a refused connection exits 4, an HTTP 400 exits 1, 27 options, 65 questions and duplicate descriptions exit 2 and an answer round trip returns `noul`, `score` and the submitted choice key
- [ ] `grep -nE 'Authorization|Bearer|API_KEY|deem-ctl'` on `.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs` returns no match, and every import in it is a `node:` built-in
- [ ] A two-stage route replay of a Deem prompt names hub `cli-classifier` at stage 1 and mode `cli-deem` at stage 2
- [ ] One live `cli-deem health` run by the orchestrator exits 0 and prints `torch`, `deem-0.8-v1` and the commit pair `8cbabbb` and `6755b30`, or the pair `deem-ctl status` prints if a release landed after 2026-09-27
- [ ] `git status --porcelain` lists only paths under `.skilled/skills/cli-classifier/`, this phase folder, `skill-graph.json`, the trigger index and its three fixtures, `.hermes/skills/cli-classifier/SKILL.md` and `.hermes/skills/cli-deem/SKILL.md` and, only if the hub was admitted to compiled routing, the two `activation/cli-classifier/manifest.json` files. `git diff --stat -- .skilled/skills/cli-jev` is empty
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Planning documents | Done | 2026-09-27: `spec.md`, `plan.md`, `tasks.md`, this goal and `implementation-summary.md` authored from `007-classifier-deep-research/research/research.md` section 14 (`### 008-cli-classifier-hub (new)`), section 12 (`### R23.` and the shared two-backend gate contract) and section 3 |
| Approval | Recorded | Section 14 says each phase waits for operator approval. The parent goal's D2 requires the hub and `cli-deem`, and its fourth criterion requires each proposed phase as a Planned child, so the operator has approved authoring it. Status stays Planned |
| Build | Pending | Nothing is built. The phase is Planned |

### Deviations and findings

| Item | Note |
|------|------|
| D1 wording | The parent's D1 joins its two checks with a semicolon, which the voice rules ban. The same content is split into sentences, with "refuses the stub backend" taken from section 3's Deem check |
| Playbook and benchmark | Section 14's likely files (swe-07's list) omit `manual-testing-playbook/` and `benchmark/`. `parent-skill-check.cjs:1119-1129` fails without them under the default strict mode, and passing that check is section 14's observable check, so both are added to the file list |
| Test path | Section 14 names "`scripts/cli-deem.mjs` and its test". This phase places the test at `scripts/tests/cli-deem.test.mjs` under `node --test`, which keeps the client dependency-free |
| Duplicate descriptions | The synthesis says the client refuses them and names no exit code. This phase reads it as a usage error, exit 2 |
| Missing commit-pair path | Not in the synthesis. This phase reads it as a config error, exit 2, so `health` never prints a partial pair |
| Hook budget flag | The synthesis sets 2,000 ms offline and 500 ms in a hook and names no flag. Left open in `spec.md` section 7 for the build to fix |
| Stage-2 replay | The synthesis lists compiled-route literals only for 009. Whether the new hub needs compiled-route admission for stage 2 is left open in `spec.md` section 7 |
| Level 1 has no `acceptance-criteria.md` | The criteria above come from `spec.md` REQ-001 to REQ-013 and its proof plan |
| Amendment: build roles (2026-09-28) | Source: D5 of the parent `goal.md` and its log row "New directive, wave 3". New D6 names the build orchestrator, the three executors with their models and the orchestrator session's verify, cross-family review and commit. The same text went into `plan.md` (Build Roles) and the `tasks.md` notation. No builder wording contradicted it: a search of this folder for codex, gpt-5, `llmgateway`, Opus 5.5 high, Devin, Cursor and Cline found only the word "builder" in T006 (the request builder) |
| Amendment: sk-doc, sk-code and generated paths (2026-09-28) | Source: D6 of the parent `goal.md`. D6 here routes the hub's docs through sk-doc and its code through `sk-code-opencode`, and `cli-deem/feature-catalog/` joins the file list (the one D6 doc missing). D4, criterion 6, REQ-008, the scope and Files to Change now name the generated paths, each found in the repository: the Hermes copies (`sync-skills-hermes.cjs:20-21`, `:51-68`, `:139-143`, `:266-267`, CI at `command-tree-parity.yml:65`), the trigger index fixtures (`generate-trigger-index.mjs:76-79`) and the activation manifest pair (`.skilled/scripts/git-hooks/pre-commit:318-321`, `:345-346`, `:404-405`, `:421-439`). The pair appears only for a hub in `compiled-route-guard.cjs:45-53`, so D4 and the criterion name it conditionally. Criterion 6 also gained "this phase folder", because T020 edits `implementation-summary.md` and the derived-metadata hook stages this folder's `graph-metadata.json` and `description.json`. No criterion was dropped |
| Conflict: compiled-route admission | Admitting the hub to compiled routing edits hand-kept lists outside the hub (`compiled-route-guard.cjs:45-53` and the others phase 009 names), which D4 forbids. `spec.md` section 7 keeps the admission question open and routes a yes back to the orchestrator as an amendment. Named, not resolved |
| Conflict: retiring `cli-deem` | `spec.md`'s kill criterion and its last risk row still say R23 retires `cli-deem` when no Deem arm yields a kept result (`../007-classifier-deep-research/research/research.md:800`). Parent D2 keeps `cli-deem` in the hub, and parent D4 only leaves 009 Planned. Left as written and named for the orchestrator |
<!-- /ANCHOR:log -->
