---
title: "Research: Goal unification hardening, phase roll-up"
description: "Phase-level record of the five-iteration hardening lineage: 33 findings across four angles, the ranked twelve-now, twelve-next and nine-never lists, and where every row landed."
trigger_phrases:
  - "goal hardening research"
  - "goal unification hardening findings"
  - "goal do now do next do not"
  - "goal overengineering review"
importance_tier: important
contextType: research
---

# Research: Goal unification hardening, phase roll-up

> Phase-level record for the hardening research. The lineage under `lineages/deepseek/` holds the
> per-iteration evidence; this document is the roll-up the phase owes its reader. Every claim about
> current behaviour was confirmed against the repository before it was acted on.

---

<!-- ANCHOR:objective -->
## 1. OBJECTIVE AND METHOD

One lineage, five iterations, DeepSeek through the llmgateway provider, stop policy max-iterations so
no early convergence could cut the run short. Each iteration took one angle and cited file and line
for every claim.

| Iteration | Angle | Question it answered |
|---|---|---|
| 1 | Hardening | Where can a bound session still be lied to or left silent? |
| 2 | Integration | Where do the shipped pieces still not meet? |
| 3 | Operator experience | Where is a manual step that could be automatic, a message unclear, or a paste a tool could do? |
| 4 | Overengineering | What shipped that no current caller needs? |
| 5 | Ranking | What should be done now, next, or not at all, by impact times confidence over cost? |

The run produced 33 findings and three ruled-out directions. Nothing in it reopened a frozen decision.
<!-- /ANCHOR:objective -->

---

<!-- ANCHOR:findings -->
## 2. FINDINGS BY ANGLE

**Hardening, nine findings.** The validator's fence pattern had become stricter than the runtime's
after the runtime was fixed, so the two measured different slices. A bare carriage return leaked
frontmatter, session identifier included. The packet lock was keyed lexically, so an alias path took a
different lock and lost a row. The plugin and the core disagreed on which workspace wins. A stat call
in the packet projection could throw into a render path instead of failing open. A non-UTF-8 document
was corrupted by the first log append. A file using carriage-return-plus-newline gained a bare newline
row. Binding-table containment was lexical only. The missing-child rule was bypassed by link notation.

**Integration, five findings.** The bind table in the planning workflow was referenced by no step. The
plugin exposed no log and no unbind, and an unknown action silently became show. The goal contract
documents sat outside the retrieval corpus roots. The save path gave an unlocked append equal footing
with the locked one. Claude Code and Codex had no resend mechanism at all.

**Operator experience, seven findings.** The resync instruction asked for a paste that a bind plus a
resent could do. The show action claimed a session was packet-bound after the document was gone.
Criteria were flattened into the objective line. The usage line printed zero and none. The reminder
named an action two runtimes do not have. The show envelope embedded whole documents. The rebind
archive branch was unreachable.

**Overengineering, nine findings.** Two projection fields were written and read by nobody, and the
throw path went with them. A plugin timestamp was normalised and never rendered. The command-line
injection preview was ungated. Envelope lines were duplicated under two names. Four items were
examined and kept, each with the caller that defends it: the budget manifest block, the packet action
surfaces, the reminder's length, and the renderer differences, which a parity test now pins instead.
<!-- /ANCHOR:findings -->

---

<!-- ANCHOR:recommendations -->
## 3. RANKED RECOMMENDATIONS AND WHERE THEY LANDED

**Twelve scored small and certain.** Ten were built in this phase. The reminder now names the command
that records a resend on each runtime instead of asking for a paste. The validator's fence matches the
runtime's and both normalise bare carriage returns. Show reports packet state with a hint when the
document is missing. The speckit offer path binds when the packet carries a goal file. The packet lock
is keyed on the real path under the workspace state root. The plugin gained unbind and log and errors
on an unknown action. A rebind archives the prior record. The save path uses the locked append only.
The projection dropped its unread fields. The remaining two closed in the third review round.

**Twelve needed a decision, a harness or a shape change.** All twelve are now closed. Six were built
in the third review round: one canonical workspace resolution, the renderer parity test, the cache key
on content rather than file time, the lock-scope documentation, the reminder's record clause, and the
re-verification of the earlier phase's open items. Four were settled by the operator and built in the
closing phase: criteria as their own field, a named refusal for a non-UTF-8 append, a hash check that
gives Claude Code and Codex a real resend signal, and a check that keeps the three workflow files
identical. One was closed by adding the hooks directory to the retrieval corpus. One, the Devin host
merge rule, was settled by a live run.

**Nine were rejected, each with the caller that defends it.** Collapsing the two-slice projection would
either ship markup into chat or store prose the runtime cannot budget. Replacing the budget manifest
with a constant would hardcode the pair in two implementations that have already drifted once.
Dropping the stored objective and prompt would change what unbind means. Removing the legacy actions
would strand the machines that hold those records. Merging the two renderers would port one runtime's
semantics into the runtime-neutral core. Shortening the reminder would drop the only carrier of the
never-halts clause on the injection path. Reopening the frozen decisions was forbidden by the charter
and nothing in four iterations required it. Adding per-packet lock files beyond real-path keying would
solve a key-naming defect with a new resource. Gating the show envelope behind a flag would break the
Pi adapter that parses it.
<!-- /ANCHOR:recommendations -->

---

<!-- ANCHOR:unknowns -->
## 4. RULED OUT, AND WHAT REMAINS

Three directions were examined and ruled out with evidence. Ordinary same-workspace concurrent appends
do not interleave, because the sessions share a workspace state directory and therefore one packet
lock. A renamed packet does not fall back to the stored objective; it renders an empty block. A
non-UTF-8 document does not crash a render, because Node replacement-decodes rather than throwing,
which is precisely why the append had to refuse instead.

Nothing from this phase remains open.
<!-- /ANCHOR:unknowns -->
