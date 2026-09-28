---
title: "Goal: Phase 16: deem-local-hardening"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/016-deem-local-hardening"
    last_updated_at: "2026-09-28T10:00:00Z"
    last_updated_by: "spec-pass-leaf"
    recent_action: "Recorded the operator's four answers and kept only the chosen branch"
    next_safe_action: "Back up deem-ctl, switch the access log on, then copy the edited file to 007's context"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "owner-fix-016-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Q1 CORS exposure: C, accept, with its revisit trigger"
      - "Q2 access log: on, DEEM_ACCESS_LOG=1 and an appending redirect"
      - "Q3 DEEM_N_ORDERS: hold at 1 until phase 002's order-flip rate"
      - "Q4 deem-ctl home: B, a reviewed copy in 007's context with a cmp check"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 16: deem-local-hardening

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

**Objective:** Carry out the operator's answers on the local Deem install's four open gaps, accepting the open CORS exposure with its revisit trigger, turning the access log on, holding `DEEM_N_ORDERS` at 1 and keeping a reviewed copy of `deem-ctl` in git, each change with a dated backup and a rehearsed rollback.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The operator answered Q1 to Q4 of `spec.md` section 10 on 2026-09-28, each with the recommended option. Every change starts from a dated backup of `deem-ctl`, and nothing under `~/.local/share/deem/src/` changes |
| D2 | The access log comes from the server's own `DEEM_ACCESS_LOG` switch, set in `deem-ctl`'s `start_server` with an appending redirect. No patch to Deem's code serves it |
| D3 | `DEEM_N_ORDERS` stays at 1. Only phase 002's `--deem` order-flip rate above 0.10 reopens it |
| D4 | Phase 008's scope stays frozen. The reviewed copy of `deem-ctl` lives at `../007-classifier-deep-research/context/deem-ctl`, outside `cli-deem`, and `cmp` keeps it equal to the live file |
| D5 | The CORS exposure is accepted: no patch, launcher or proxy. It is revisited before any hook calls Deem live, with option A's launcher as the plan put to the operator |

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

- [ ] `grep -c 'Operator answer: pending'` on this phase's `spec.md` prints 0, and `git -C ~/.local/share/deem/src status --porcelain` prints nothing
- [ ] After `curl -s 'http://127.0.0.1:8300/health?probe=016'`, `deem-ctl stop` and `deem-ctl start`, `grep -c '"GET /health?probe=016 HTTP/1.1" 200' ~/.local/share/deem/server.log` prints 1
- [ ] `shellcheck ~/.local/share/deem/bin/deem-ctl` exits 0 and one `deem-ctl.bak-*` file sits beside it. After that backup is restored and the server restarted, `deem-ctl status` exits 0 and prints `"backend": "torch"`
- [ ] Q1's answer line in this phase's `spec.md` names the revisit trigger, and `curl -s -D - -o /dev/null http://127.0.0.1:8300/health` still shows `Access-Control-Allow-Origin: *`
- [ ] `grep -c DEEM_N_ORDERS ~/.local/share/deem/bin/deem-ctl` prints 0
- [ ] `git diff --stat -- ../008-cli-classifier-hub` prints nothing, and `cmp` of the live `deem-ctl` and `../007-classifier-deep-research/context/deem-ctl` exits 0
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
| Planning documents | Done | 2026-09-27: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, this goal and `implementation-summary.md` authored from the owner-fix brief's section for this phase and `../007-classifier-deep-research/context/deem-local.md` |
| Operator answers to Q1 to Q4 | Done | 2026-09-28, each the recommended option: Q1 C, Q2 on, Q3 hold at 1, Q4 B. Recorded in `spec.md` section 10 by the spec pass, and `grep -c 'Operator answer: pending'` on it prints 0 |
| Build | Pending | Nothing is built. The phase is Planned, and nothing under `~/.local/share/deem/` was changed or run while planning or during the spec pass |

### Deviations and findings

| Item | Note |
|------|------|
| Access log needs no patch | The brief asked whether enabling the log needs a patch. It does not: `deem_server.py:794-800` writes the access line when `DEEM_ACCESS_LOG` is set, and `deem-ctl:120` already sends stderr to `server.log`. The same line uses `>`, which is why each start erased the previous log |
| `DEEM_N_ORDERS` and R21 | The brief ties the hold to phase 002's R21 accuracy result. R21 runs `noul` calls, and `DEEM_N_ORDERS` permutes `choice` questions only (`deem_server.py:665-671`), so R21 cannot show whether averaging helps. D3 ties the hold to 002's `choice` order-flip rate instead, and the orchestrator should confirm that reading |
| Blind compute after the header goes | Dropping `Access-Control-Allow-Origin` alone still lets a page send a simple POST without a preflight, because `_read_body` ignores the content type (`deem_server.py:821-831`, `:875`). Options A and B therefore refuse a foreign `Origin` outright. This rests on the Fetch standard and was not tested |
| Unconfirmed count | The brief says `deem-ctl` changed three times on 2026-09-27. Two versions are confirmed (208 and 250 lines, `research.md:164`). The third change is UNKNOWN here |
| Node `fetch` and `Origin` | Whether Node's built-in `fetch` sends an `Origin` header is UNKNOWN. T006 checks it against a local listener before option A or B is built |
| Scaffold title | The scaffold titled every file "Phase 7". The phase is 16 of 17 (`spec.md` metadata), so the titles now say Phase 16 |
| Amendment: operator answers (2026-09-28) | Source: D4 of the parent `goal.md` ("016 takes its recommendations") and its log row "New directive, wave 3". Q1 option C, accept, with its revisit trigger. Q2 on (`DEEM_ACCESS_LOG=1` and `>>`). Q3 hold `DEEM_N_ORDERS` at 1, reopened only by phase 002's `--deem` order-flip rate. Q4 option B, a reviewed copy at `../007-classifier-deep-research/context/deem-ctl` with a `cmp` check. Changed: the objective, D1 and D4, a new D5 for the accepted exposure, criteria 1, 4 and 6 (each keeps only the chosen branch, none dropped), `spec.md` section 10 and every requirement, task, plan step and acceptance row that branched on an answer. T003 is ticked, because the answers are recorded. The option A and B checks, the Node `Origin` check (T006) and the launcher and proxy rollbacks were removed with those options. The out-of-scope citation of `../008-cli-classifier-hub/spec.md` moved from `:98` and `:151` to `:100` and `:156`, because the same pass added lines above both in 008 |
| Conflict: "the one write outside the phase folder" | The spec-pass brief asked that the copy be named as the phase's one write outside its folder. The phase also plans the `deem-ctl` edit outside the repository and a one-line pointer in `../007-classifier-deep-research/context/deem-local.md` (T009). Both stay, so the docs call the copy the one new file this phase adds outside its own folder. Named for the orchestrator, not resolved |
<!-- /ANCHOR:log -->
