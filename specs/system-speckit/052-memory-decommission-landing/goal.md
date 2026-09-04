---
title: "Goal: Memory DB Deprecation Landed and Verified"
description: "Land the memory-database decommission and the zvec retrieval lane on skilled/v4.0.0.0 and main, align every new or updated reference document with the sk-create-skill templates, and prove zero drift, residue or debt through a bounded update, verification and review loop."
trigger_phrases:
  - "packet goal"
  - "decommission landing"
  - "landing verification loop"
  - "no drift no debt"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/052-memory-decommission-landing"
    last_updated_at: "2026-09-04T20:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Landed the branch on skilled/v4.0.0.0 and main; review loop pending"
    next_safe_action: "Run the deep review loop on the landed tree and fix what it finds"
    blockers: []
    key_files:
      - "specs/system-speckit/049-memory-decommission/goal.md"
      - "specs/system-speckit/050-zvec-grep-fork-integration/goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-04-052-memory-decommission-landing"
      parent_session_id: null
    completion_pct: 40
    open_questions:
      - "Does the surviving spec-kit engine package drop its mcp-server name?"
    answered_questions:
      - "The MCP server is gone; the package survives as the validation, metadata and continuity engine"
---
# Goal: Memory DB Deprecation Landed and Verified

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Land the memory-database decommission and the zvec retrieval lane on skilled/v4.0.0.0 and main, align every new or updated reference document with the sk-create-skill templates, and prove zero drift, residue or debt through a bounded update, verification and review loop.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Landing is a merge of worktrees/044-zvec-grep-integration into skilled/v4.0.0.0, then skilled/v4.0.0.0 into main, locally. Nothing is pushed without a fresh operator go-ahead |
| D2 | Uncommitted operator work in the main checkout is preserved: stashed before the merge, reapplied after, conflicts resolved in favour of the operator's edits and listed |
| D3 | Every reference, README or asset created or changed since 5220257bf7 conforms to the sk-create-skill template for its class, checked by that skill's own validators, not by eye |
| D4 | The review loop is /deep:review, 10 iterations, no early convergence, executor cli-codex gpt-5.6-luna, reasoning max, service tier fast. Findings are fixed at source, re-verified, and the loop is rerun until a pass reports no P0 or P1 |
| D5 | The preserved set stays untouched: skill advisor, shared HF model server and its socket, shared embeddings and IPC, deep-loop locks and projections, historical evidence |
| D6 | Debt means anything one of these reports: residue sweep live records, trigger-index nondeterminism, validate.sh errors on any touched packet, template validator failures, stale generated metadata, a skipped gate, or a doc that describes a surface that no longer exists |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read before working:** `specs/system-speckit/049-memory-decommission/goal.md` and its phase goals; `specs/system-speckit/050-zvec-grep-fork-integration/goal.md`; the sk-create-skill template contract under `.opencode/skills/sk-doc/sk-create-skill`; the 049 review report under `049-memory-decommission/review/lineages/luna-max`.

**Precedence.** Decisions above outrank child detail; child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] main and skilled/v4.0.0.0 contain the decommission: no memory MCP server in any runtime config, no spec-memory hook, plugin or launcher, and the residue sweep reports zero live records on both branches
- [ ] Every document created or changed since 5220257bf7 under references/, README files and command assets passes the sk-create-skill validators for its class with zero errors
- [ ] validate.sh --strict exits 0 on packets 049 (recursive), 050 and 051 from the landed tree
- [ ] The trigger index regenerates byte-identical on main, and the operator's stashed edits are reapplied with every file accounted for
- [ ] A /deep:review run of 10 iterations with gpt-5.6-luna reports no P0 or P1 on the landed tree, and each earlier finding names its fix commit
- [ ] Doctor routes validate, the skill-root audit passes, and no zg, model-server or codex process survives the run
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
| Merge v4 into the branch | Done | `144897ba5d`: 34 conflicts, 12 deleted-engine files kept deleted, command frontmatter takes v4's contract hints with memory tools removed; `d56a0db7a1` merges the operator's four DevPass commits, regenerated 049 metadata |
| Template alignment | Done | 187 changed reference and README documents validated; two fixed at `docs(skills)` (overview sections); one class defect recorded below |
| Fast-forward v4 and main | See DONE WHEN | |
| Deep review loop | Pending | |

### DONE WHEN

| Criterion | Evidence |
|-----------|----------|
| Both branches contain the decommission, sweep live 0 | |
| Changed docs pass their class validators | |
| validate.sh --strict on 049 recursive, 050, 051 | 049: 8 of 8 PASSED after the merge |
| Trigger index byte-identical on main; stashed edits accounted for | The operator committed their work on v4 before the landing, so no stash was needed |
| Deep review 10 iterations, no P0 or P1 | |
| Doctor routes, skill-root audit, no surviving process | |

### Deviations and findings

| Item | Note |
|------|------|
| D2 stash not exercised | The operator committed the main checkout's edits on v4 (`625c021c6c`..`5d222c0032`) before the landing, so nothing was stashed; those commits were merged instead |
| Validator class defect: playbook folder index READMEs | `validate_document.py` classifies every `manual-testing-playbook/<folder>/README.md` as a scenario (`playbook_feature`) and demands scenario sections a folder index cannot have. Four of four such READMEs fail, three of them untouched by this work. Owner: sk-doc. Not fixed here |
| `validate-command-references.cjs` depends on machine-local databases | Four doctor asset rows point at ignored sqlite files; the check passes where the daemons have run and fails in a fresh worktree. Owner: doctor commands. Not fixed here |
| OPEN DECISION: rename the surviving engine package | `system-spec-kit/mcp-server/` serves no MCP any more; it is the validation, metadata and continuity engine. The rename touches validate.sh, doctor routes, test configs and many docs, so it is its own packet |
<!-- /ANCHOR:log -->
