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
    last_updated_at: "2026-09-27T12:01:20Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "owner-fix-016-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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

**Objective:** Close the local Deem install's four open gaps as operator decisions, the open CORS exposure, the missing access log, the unrecorded `DEEM_N_ORDERS` setting and the unversioned `deem-ctl`, and carry out only the changes the operator approves, each with a dated backup and a rehearsed rollback.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Nothing under `~/.local/share/deem/` changes before the operator answers Q1 to Q4 of `spec.md` section 10, asked in one message. Every approved change starts from a dated backup of `deem-ctl` |
| D2 | The access log comes from the server's own `DEEM_ACCESS_LOG` switch, set in `deem-ctl`'s `start_server` with an appending redirect. No patch to Deem's code serves it |
| D3 | `DEEM_N_ORDERS` stays at 1. Only phase 002's `--deem` order-flip rate above 0.10 reopens it |
| D4 | Phase 008's scope stays frozen. A copy of `deem-ctl`, if the operator wants one, lives outside `cli-deem` unless the operator amends 008 |

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

- [ ] `grep -c 'Operator answer: pending'` on this phase's `spec.md` prints 0, and `git -C ~/.local/share/deem/src status --porcelain` prints nothing unless Q1's answer is the in-place patch
- [ ] After `curl -s 'http://127.0.0.1:8300/health?probe=016'`, `deem-ctl stop` and `deem-ctl start`, `grep -c '"GET /health?probe=016 HTTP/1.1" 200' ~/.local/share/deem/server.log` prints 1
- [ ] `shellcheck ~/.local/share/deem/bin/deem-ctl` exits 0 and one `deem-ctl.bak-*` file sits beside it. After that backup is restored and the server restarted, `deem-ctl status` exits 0 and prints `"backend": "torch"`
- [ ] Under Q1 option A or B, a `POST` to `/v1/systemone` with `Origin: https://example.com` gets 403 and a `/health` request with no `Origin` gets 200. Under option C, Q1's answer line in `spec.md` names the revisit trigger
- [ ] `grep -c DEEM_N_ORDERS ~/.local/share/deem/bin/deem-ctl` prints 0
- [ ] `git diff --stat -- ../008-cli-classifier-hub` prints nothing, and under Q4 option B, `cmp` of the live `deem-ctl` and `../007-classifier-deep-research/context/deem-ctl` exits 0
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
| Operator answers to Q1 to Q4 | Pending | `spec.md` section 10 holds four `Operator answer: pending` lines |
| Build | Pending | Nothing is built. The phase is Planned, and nothing under `~/.local/share/deem/` was changed or run while planning |

### Deviations and findings

| Item | Note |
|------|------|
| Access log needs no patch | The brief asked whether enabling the log needs a patch. It does not: `deem_server.py:794-800` writes the access line when `DEEM_ACCESS_LOG` is set, and `deem-ctl:120` already sends stderr to `server.log`. The same line uses `>`, which is why each start erased the previous log |
| `DEEM_N_ORDERS` and R21 | The brief ties the hold to phase 002's R21 accuracy result. R21 runs `noul` calls, and `DEEM_N_ORDERS` permutes `choice` questions only (`deem_server.py:665-671`), so R21 cannot show whether averaging helps. D3 ties the hold to 002's `choice` order-flip rate instead, and the orchestrator should confirm that reading |
| Blind compute after the header goes | Dropping `Access-Control-Allow-Origin` alone still lets a page send a simple POST without a preflight, because `_read_body` ignores the content type (`deem_server.py:821-831`, `:875`). Options A and B therefore refuse a foreign `Origin` outright. This rests on the Fetch standard and was not tested |
| Unconfirmed count | The brief says `deem-ctl` changed three times on 2026-09-27. Two versions are confirmed (208 and 250 lines, `research.md:164`). The third change is UNKNOWN here |
| Node `fetch` and `Origin` | Whether Node's built-in `fetch` sends an `Origin` header is UNKNOWN. T006 checks it against a local listener before option A or B is built |
| Scaffold title | The scaffold titled every file "Phase 7". The phase is 16 of 17 (`spec.md` metadata), so the titles now say Phase 16 |
<!-- /ANCHOR:log -->
