---
title: "Session Handover Document"
description: "State, decisions, traps and the resume queue for the sk-communication clarity program after the session of 2026-09-12."
trigger_phrases:
  - "session handover"
  - "clarity program resume"
  - "swarm validation unverified"
  - "repo router alignment"
  - "root doc staleness audit"
importance_tier: "important"
contextType: "implementation"
---
# Session Handover Document

State and resume queue for the sk-communication clarity program, handed over paused.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Read this before touching anything in this packet. The session ended on an operator pause with one
verification step unfinished, so the packet's validation state is unknown. Section 4 says exactly
what is proven and what is not.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

**Session date:** 2026-09-12. **Handed over:** 2026-09-13, paused by operator instruction.

The program turns three vendored external communication sources into changes across this
repository's communication stack: the root doc, the repo rules, the wording standard and the
projection skill. Two research runs completed, eight operator decisions were taken and recorded, and
a nine-child phased packet was planned. Nothing the research recommends has been implemented. That
is deliberate: the operator asked for planning only.

**Where it stopped.** A four-worker authoring swarm rewrote twelve documents. The metadata repair
and recursive validation that would confirm those rewrites was killed partway by the operator's
pause. **The packet's current validation state is therefore unverified**, and that is the first
thing to resolve.

**Ownership surprise.** This packet is no longer uncommitted. A concurrent session's live-sync
committed and pushed it in three commits while the swarm ran. The branch is level with origin.
Nothing in this session committed or pushed anything.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

Eight operator decisions, all Accepted, recorded as ADR-001 through ADR-008 in
`002-synthesis-and-decisions/decision-record.md`. Five went to the recommendation, three did not.

| ADR | Decision | Went with recommendation |
|-----|----------|--------------------------|
| 001 | Reject the colon-clause ban. The underlying habit is already covered by two adopted candidates | Yes |
| 002 | Scope the banned framework word to reply prose, exempting repo-owned wording | No, recommendation was outright rejection |
| 003 | Adopt the unconfirmed-cause qualifier for error reports | Yes |
| 004 | Keep the projection a smoothing pass, and declare it in both commands | Yes |
| 005 | No detectors. The provider instruction resolves to the wording standard's reply base | Yes |
| 006 | Add a claim-based content-loss floor to the fidelity validator | Yes |
| 007 | Record an unchanged candidate as a distinct no-op outcome | Yes |
| 008 | Both provider profiles use provider-default thinking mode | No, recommendation was disabled on both |

**Two knock-on effects.** ADR-005 makes phase 007 a hard prerequisite for phase 004, because the
engine needs the standard's reply base and that base is phase 007's output. ADR-008 leaves provider
defaults uncontrolled, so phase 005 must record which provider produced each measured result.

**Two plan corrections the research forced.** The wording standard becomes a base plus a supplement
rather than two halves, because a naive split moves one exclusion and adds another. And the reader
profile contract is not one thing: seven of its ten rules are ordinary delivery rules the repo's own
convention loads unconditionally, three are reader-conditional and need an opt-in mode.

### 2.2 Blockers Encountered

- **The packet's validation state is unverified.** The repair and validation pass was killed mid-run,
  so some folders may be repaired and others not. Re-running is idempotent and safe.
- **Three of four swarm workers reported the packet failing on stale generated metadata** and
  correctly refused to fix it, because `graph-metadata.json` sat outside their authorised file list.
  The fourth ran the repair itself and disclosed doing so. That is a scope breach against its file
  list, honestly reported. Its folder boundary held.
- **Concurrent sessions are active in this repository** and have been throughout. They have edited
  the deep-loop runtime, the spec-kit retrieval fixtures and the system-speckit spec tree, and they
  committed this packet. Attribute before assuming any working-tree change is yours.

### 2.3 Files Modified

Everything this session wrote lives under this packet. Nothing outside it was touched.

| Path | What |
|------|------|
| `spec.md` | Phase parent, with the phase map carrying execution order |
| `001-research-communication-context/` | 10-iteration research run, synthesis in `research/research.md` |
| `002-synthesis-and-decisions/` | The eight-ADR decision record, plus swarm-rewritten plan, tasks and criteria |
| `003-root-doc-and-repo-rules/` | Re-scoped to the rule split and two baselines, swarm-rewritten |
| `004-sk-communication-upgrade/` | 5-iteration engine research, re-scoped to eight items, swarm-rewritten |
| `005-verification-and-rollout/` | Re-scoped for the gate gap and provider attribution, swarm-rewritten |
| `006-reply-shape-rules/` | New phase, ten candidates |
| `007-wording-standard-restructure/` | New phase, base plus supplement, six candidates |
| `008-decision-and-handoff-rules/` | New phase, five candidates across three rules |
| `009-adjacent-surface-rules/` | New phase, two candidates on other skills' surfaces |

### 2.4 Traps & Scar Tissue

Each of these cost real time. All are observed, not theorised.

**The command assets could not run TypeScript.** Every CLI-executor snippet in the four deep-loop
command assets ran `node --experimental-strip-types`, which does not rewrite a `.js` specifier to
the `.ts` file that exists. The first dispatch died at import with `ERR_MODULE_NOT_FOUND`. The fix
is the repo's own `tsx` loader, which every working entrypoint uses. The operator committed a fix
for this during the session. If a dispatch writes nothing, check this first.

**A pipe masks the exit code.** A dispatch was reported as exit zero because the launching command
ended in `| tail -30`, which returns tail's status rather than node's. Redirect to a file and read
`$?` instead.

**The audited dispatch wrapper returns zero on a killed child.** Observed: a child SIGTERMed at the
899-second timeout produced `exitStatus: 143` in its receipt and the wrapper still returned zero.
Only the artifact check caught it. Never trust the wrapper's return.

**Briefs must fit the iteration budget.** One research iteration asked for a repository-wide
enumeration inside a budget of three to five actions and twelve tool calls. It ran past fifteen
minutes and was killed. Narrowed to name the files rather than ask for a sweep, the retry finished
in about 220 seconds.

**`containment-reverted/` is written in preserve mode, where nothing is reverted.** It cost a false
alarm mid-session. The naming was fixed upstream during the session, and this packet holds both
directory names as before-and-after evidence.

**Every research iteration fails the workflow's own gate on `route_proof_missing`.** The prompt pack
documents a legacy record shape, the append gateway upcasts it, and the upcast projection drops the
route-proof fields the gate then requires. The leaves wrote those fields correctly into their delta
files. This is deterministic across fifteen iterations and says nothing about the findings.

**Swarm throughput is governed by the gap, not the model.** Dispatch time was 202 to 257 seconds
against a comparison run's 276-second mean. The wall-clock difference was entirely verification and
reporting between iterations. Batching the cycle into one call cut the gap from 525 seconds to 42.
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

Run the metadata repair and recursive strict validation before anything else. Until that passes,
nothing else in this packet can be trusted.

```
P=specs/sk-communication/006-sk-communication-clarity
for f in "" /001-research-communication-context /002-synthesis-and-decisions \
         /003-root-doc-and-repo-rules /004-sk-communication-upgrade \
         /005-verification-and-rollout /006-reply-shape-rules \
         /007-wording-standard-restructure /008-decision-and-handoff-rules \
         /009-adjacent-surface-rules; do
  node .opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder "$P$f" --apply
done
bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --recursive --strict
```

Require ten explicit `RESULT: PASSED` lines. One warning per child about
`implementation-summary.md` lacking a citation is expected and acceptable, because no phase has been
implemented.

### 3.2 Priority Tasks Remaining

1. **Repair and validate.** As above. Blocks everything.
2. **Verify the swarm's claims against the files.** Four workers reported line counts and content
   changes that have not been checked. Checksums confirm all twelve files changed; the content does
   not. Baseline checksums are gone with the session scratchpad, so compare against the committed
   versions instead.
3. **Fix two stale items the swarm surfaced.** Phase 007's spec still calls the standard's shape
   unratified, and the parent phase map still shows phase 002 as pending with its old focus. Both
   are wrong now that the decision record exists.
4. **Router alignment research, 3 iterations.** Reachability both ways between `REPO RULES.md` and
   the files under `repo-rules/`, index accuracy against each rule's own description, triggers
   phrased as actions rather than topics, overlapping or dead rows, and whether the scope statement
   with its four recorded widenings still describes the current set. Five of eleven rule files have
   recent edits that may not have reached the router. Raise, do not decide, whether to align before
   or after phase 003 adds a file and a row.
5. **Root doc staleness and redundancy research, 5 iterations.** Two separate failure classes,
   detailed in 3.3 below.
6. **Act on both sets of findings**, with the scope question in 3.3 answered first.

Steps 4 and 5 may run as a two-lineage swarm. They touch different documents and neither writes
outside its own research folder.

### 3.3 Critical Context to Load

**Executor, verified working.** `cli-pi`, model `deepseek-v4.1-flash` through the DevPass LLM
Gateway, thinking pinned to `max` by the builder. The composed command is
`pi -p --offline --model llmgateway/deepseek-v4.1-flash --thinking max <prompt>`. Build it through
the shared fan-out command builder rather than by hand, so the allowlist and the effort pin stay one
source of truth. Dispatch through the audited path with `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` set, and the gate-3 pre-resolution preamble at the top of the prompt.
The environment variable alone is not enough; the model cannot read it.

**The root doc audit has two failure classes, and they must stay apart.**

- *Not reality.* Names a file, folder, script, command, flag or threshold that does not exist or no
  longer behaves that way. Confirmed instance: `checklist.md`. Every packet scaffolded this session
  produced `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` and
  `acceptance-criteria.md`, and no `checklist.md` at any level. The verification checklist now lives
  inside `tasks.md` and the closure gate is `acceptance-criteria.md`. The root doc's completion rule
  therefore instructs loading a file that is never created, and never mentions the document that
  actually decides closure. It appears in at least five places.
- *Redundant detail.* Explains at length what a repo rule, a skill document, a reference or an asset
  already owns. The memory save rule is the operator's cited specimen: five bullets, an exact
  compiled path, an explanation of what the save writes, and a pointer to the save-workflow
  reference as the authority. It delegates and restates the same thing. Other candidates to confirm:
  the git safety table, whose rows each end by saying the git skill owns the mechanics; the
  validate.sh subsection, which names the four traps and then says they belong to a spec-kit
  reference; gate 3, which names an authoritative classifier and still spells out the vocabulary;
  the advisor metadata placement paragraph; and the MCP routing section.

**The target shape already exists in the same document.** Section 6 is a question-to-answer routing
table with almost no restatement, keeping exactly one rule local and saying why: it is prompt-time
discipline no script enforces.

**The discrimination test is three-way, and only the first case is reducible.**

1. A delegate exists and genuinely carries it. Reducible to a pointer.
2. It must bind when no delegate loads, on a read-only turn where the gate never fires. Keep it.
   That is section 8's entire design.
3. It is prompt-time discipline no script or skill can enforce. Keep it. That is section 6's stated
   exception.

Every redundancy finding must say which case it is and cite the delegate's own line when claiming
case one. Without that, the run will recommend deleting clauses that are load-bearing precisely
because nothing else reaches them.

**Scope question to answer before either run writes.** Both runs concern the repository's own
governance documents, so neither belongs in this packet. There is no governance track today.
Recommendation: one new phased packet holding both, under `sk-doc`, which already owns the
repo-rule template and documentation authoring. Confirm the path before dispatching.

**The root doc cleanup is not in this packet's frozen scope.** Phase 003 may touch the root doc only
if a clause cannot live below it, and a stale-reference cleanup is not that. It needs its own packet
or an explicit amendment.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

Observed, derived and inferred are marked, because the difference matters here.

| Claim | Status | Evidence |
|-------|--------|----------|
| Packet is parent plus nine children | OBSERVED | Directory listing |
| First research run completed 10 iterations | OBSERVED | 10 iteration files, 10 deltas, reducer reported 10 |
| Second research run completed 5 iterations | OBSERVED | 5 iteration files, 5 deltas, reducer reported 5 |
| Both syntheses written | OBSERVED | `research/research.md` in both research folders |
| Eight ADRs recorded and Accepted | OBSERVED | Written this session from the operator's answers |
| Validation passed 10 of 10 | OBSERVED, but STALE | True before the swarm ran. Not re-run since |
| Swarm rewrote all twelve files | OBSERVED | Checksum comparison before and after |
| All four workers exited zero | OBSERVED | Swarm log |
| The twelve rewrites are valid | **UNVERIFIED** | The repair and validation run was killed partway |
| The workers' content claims are accurate | **UNVERIFIED** | Reports read, files not checked |
| Packet committed and pushed | OBSERVED | Three commits, branch level with origin |
| Nothing outside the packet was written by this session | OBSERVED | Scoped status, plus mtime attribution of other sessions' files |
| Engine findings about the instruction, the validator guard and the profiles | OBSERVED | Each read at the cited lines |
| The claim that the deep-loop gate failure never affects findings | DERIVED | The leaves wrote the fields correctly to their deltas; only the upcast projection drops them |
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

**Deep-loop defects found and reported in chat, not written to disk.** Eight items. Two were fixed
upstream by the operator during the session: the command assets now run through the loader, and the
containment directory is named for what it holds in each mode. Six remain open: the route-proof
upcaster mismatch; the dispatch wrapper returning zero on a killed child; the phase-parent
scaffolder's placeholder mismatch, which ships every phase parent with an empty phase map; the
reducer truncating its own next-focus; the `progressiveSynthesis` flag contradicting the prompt
pack's allowed-write list; and `loop-lock release` being unable to succeed from a separate process.

**Corrections made during the session, recorded so they are not repeated.** A containment patch file
was read as evidence of a revert when preserve mode had reverted nothing. A research iteration's
claim that the instruction's target noun contradicted the scope field was overstated and was
corrected to a labelling defect. An earlier report attributed a masked exit code to the harness when
the cause was a local pipe. And the packet was described as uncommitted after a concurrent session
had committed and pushed it.

**A research iteration declared saturation at iteration six of ten.** The operator had asked for no
early convergence, so the remaining iterations were steered onto named open questions rather than
allowed to restate the inventory. All three produced decision-shaped answers, and one corrected the
framing of this packet's own open question.
<!-- /ANCHOR:session-notes -->
