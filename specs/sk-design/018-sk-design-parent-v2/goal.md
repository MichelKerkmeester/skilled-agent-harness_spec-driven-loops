---
title: "Goal: reinstate sk-design as a parent hub, and prove every request still arrives"
description: "The binding goal for the whole packet. Every child goal.md inherits these rules; where a child disagrees with this file, this file wins."
importance_tier: important
contextType: reference
version: 1.0.0.0
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2"
    last_updated_at: "2026-09-06T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the binding goal, roadmap and routing baseline for the whole packet"
    next_safe_action: "Finish phase 001's relocation, then run phase 005's closure replay"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/ROUTER.md"
      - ".opencode/skills/sk-design/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-018-sk-design-parent-v2"
      parent_session_id: null
---

# Goal: reinstate sk-design as a parent hub

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->

**The binding goal for the whole packet. Every child `goal.md` inherits these rules; where a child
disagrees with this file, this file wins.**

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

Reinstate `sk-design` as a parent hub carrying four modes, give every one of them the hub's own
name, and finish with every request that reached a skill before still reaching one, proven by replay
rather than by configuration.

### Read first, do not re-derive

- `roadmap.md` beside this file: order, what each step breaks, what proves it fixed.
- `spec.md`: why this reverses `016-deprecate-sk-design-interface` and what stays retired.
- `scratch/routing-baseline.txt`: the sixteen-phrase measurement taken before anything moved. It is
  the only record of the prior state and cannot be recaptured.
- `scratch/routing-regressions.md`: the one regression this packet owns and the one weakness it
  inherits.

### Decisions

**A registry row, a vocabulary entry and a green gate prove nothing about whether a request
arrives.** The baseline already demonstrates this: `sk-doc` carries 27 chart and diagram vocabulary
strings, including `ascii flowchart` verbatim, and the phrase `ascii flowchart of the approval loop`
reaches nobody. Every step ends by replaying the sixteen phrases and comparing against the baseline.

Vocabulary that must move the advisor goes in `graph-metadata.json` `intent_signals`. Keywords in
`description.json` move no score at all; that was measured twice during this packet, not assumed.

### Operator copy

Four modes under one hub, all four carrying the hub's name, and a replay proving nothing stopped
arriving. Steps 1 to 5 are done and the fleet is measured. Steps 6 to 8 rename the two moved modes
and their commands, close every gate this packet left red, and broaden fundamentals past screen UI.
<!-- /ANCHOR:directive -->

<!-- ANCHOR:binding -->
## 2. BINDING

1. **One commit per step.** Work happens on the shared branch and other sessions write here. No
   commit may leave a skill root without its `SKILL.md`, or a router signal pointing at a packet not
   on disk. A move and its path rewrites land together.
2. **Moves must be renames.** Verify with `git diff --cached --name-status -M` before committing and
   require `R` status. A move that records as delete-plus-add loses the history and is not
   acceptable.
3. **Scope every git command.** Other sessions have dirty files here; never `git add -A`.
4. **The class contract is not negotiable.** `description.json`, `mode-registry.json` and
   `hub-router.json` are required on a hub and forbidden on a standalone;
   `leaf-manifest.config.json` is the mirror. An active root `ROUTER.md` needs `router_state`,
   `version` and `skill_pointer` in frontmatter, `## OVERVIEW` and `## INTENT MODEL` sections, and
   `INTENT_SIGNALS` and `RESOURCE_MAP` as dictionaries whose paths resolve to declared leaves.
5. **Comment hygiene is a hard block.** Never a task id, requirement id, phase number or spec path
   in a code comment.
6. **Do not restore what `016` retired**: the interface mode, the `commands/interface/` surface, or
   the design-taste layer.
   *Note: this rule once also forbade renaming modes and commands. The operator reversed that on
   2026-09-06, and step 6 carries the renames. What `016` retired still stays retired.*
7. **Run artifacts are evidence, not text to update.** Fan-out logs, iteration deltas and recorded
   command output describe what was on disk when they were written. A path rewrite that touches them
   falsifies the record. Live cross-references follow a move; historical evidence does not.

### Escalate rather than continue

A gate failing twice on one cause after a real repair. A spec contradicting the code. A change that
would touch a file outside the phase's declared scope. Anything that would delete tracked content.
A routing regression that does not close where this packet said it would.
<!-- /ANCHOR:binding -->

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

| # | Criterion | How it is proven |
|---|-----------|------------------|
| 1 | Four modes under one hub | `mode-registry.json` and `hub-router.json` list all four; each mode root holds its own `SKILL.md` |
| 2 | Both hubs green | The fleet metadata gate passes class H for `sk-design` and for `sk-doc` |
| 3 | No phrase below baseline | The sixteen-phrase replay compared line by line against `scratch/routing-baseline.txt` |
| 4 | Chart and diagram phrases name `sk-design` | Replay output, with `sk-doc` no longer claiming them |
| 5 | The owned regression closed | `validate this design.md` reaches the merged mode, or is escalated with evidence |
| 6 | Packet validates | `validate.sh --strict` prints `RESULT: PASSED` for the parent and every child, taking the first `RESULT:` line |
| 7 | The daemon actually rebuilt | Its generation number observed to move, not assumed |
<!-- /ANCHOR:completion -->

<!-- ANCHOR:log -->
## 4. LOG

### Keeping this file true, and telling the operator when it changes

This goal is not written once. It is the working contract, and it goes stale the moment the work
teaches something the plan did not know. Update it whenever any of these happen:

- A step's real order changes, or a step turns out to be unnecessary.
- A constraint here proves wrong, too strict, or too loose against what the canon or the gates
  actually enforce.
- A new open item appears that a later phase must carry, or a carried item closes.
- A measurement contradicts something this file asserts. The file loses; the measurement stands.

**Then say so.** Print the revised goal back to the operator in chat, in a copyable block, under
4,000 characters, with a one-line note naming what changed and why, so the operator can update the
goal they are holding. A goal file that has drifted from the work is worse than none, because it
still reads as authority. Do not wait until closure to report a change that alters what the next
step does.

### Progress

| Step | Phase | State |
|------|-------|-------|
| 1 | `002-hub-and-fundamentals` | Done, `112d5471f4` |
| 2 | `003-md-generator-as-mode` | Done |
| 3 | `004-chart-and-diagram-cutover` | Done |
| 4 | `001-sk-create-chart` | Done: 1,528 renames, 35 spec folders green |
| 5 | `005-closure-and-routing-proof` | Done: generation 638, zero phrases reach nobody |
| 6 | `006-design-mode-and-command-rename` | Done: 249 renames, replay byte-identical at generation 650 |
| 7 | `007-close-inherited-failures` | Done: every inherited gate green, nothing deleted |
| 8 | `008-fundamentals-beyond-ui` | Open |
| 9 | `009-router-conformance` | Done: peer shape, replay unchanged at generation 653 |
| 10 | `010-readme-human-voice` | Done: 909 prose em-dashes removed from 147 authored READMEs |

### Deviations and findings

- **Keywords in `description.json` move no advisor score.** Measured twice. Vocabulary belongs in
  `graph-metadata.json` `intent_signals`; eleven signals added there fixed all four previously dead
  phrases. This likely generalises beyond this packet.
- **Step 4 collided on two canonical filenames.** The relocated packet brought its own `spec.md` and
  `goal.md`. The packet's documents keep the canonical names; the relocation's own documents were
  renamed to `relocation-note.md` and `relocation-goal.md`.
- **Constraint 7 was added after a violation, not before.** Seven run artifacts were rewritten during
  step 4 and reverted from `HEAD` once caught.
- **A validator that reads a built artefact cannot see a defect the build repairs.** Step 5 found four
  dangling graph edges the builder had been dropping on every run while `skill_graph_validate`
  reported clean. They were not inert: repairing them raised two phrase scores. Read the rebuild's own
  warning stream, not only the validator verdict.
- **Two gates lie about their own result.** `validate-playbook-topology` prints `verdict=FAIL` and
  exits 0 without `--strict`; `regenerate-skill-derived` defaults to a dry run that reports the
  changes it did not make. Run every gate strictly and confirm a write by re-running the check.
- **The packet closes with one red gate, named.** `sk-doc`'s typed-gold playbook gate fails on four
  fixtures this packet's step 3 invalidated. Every path to green deletes tracked coverage, fabricates
  a scenario under a published id, or splits a benchmarked corpus. Recorded rather than forced.
<!-- /ANCHOR:log -->
