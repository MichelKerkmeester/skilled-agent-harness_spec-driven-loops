# Brief: verify one slice of the reference evidence research

You are a dispatched leaf worker. Nobody is at your prompt, so do not ask questions. The spec
folder question is already answered: the work belongs to
`specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research`.
You write exactly one file, the output file named in your task, which sits outside the
repository. You change nothing inside the repository: no edit, no new file, no git command
that writes. Read-only shell commands (`rg`, `sed -n`, `wc`, `ls`, `cat`) are fine.

Repository root: `/Users/michelkerkmeester/MEGA/Development/Skilled`. Run commands from there.

## What happened before you

A research run of four model lineages (vibe-1, vibe-2, pi-1, pi-2, 10 iterations each, all on
DeepSeek Flash) read ten reference repos against a planned build of fourteen phases. Each
iteration wrote a markdown record with findings and `[SOURCE: path:line]` citations. Those
findings are unverified claims by a small model. Some cite the wrong line, some overstate what
the line says, and some repeat what earlier research already found. Your job is to check the
findings that belong to your slice and write the part of the final synthesis that covers it.

## Inputs (all read-only)

- Iteration records: `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/<lineage>/iterations/iteration-0NN.md`
  for `<lineage>` in `vibe-1`, `vibe-2`, `pi-1`, `pi-2`. Your task names the ones most likely
  to hold your slice. Also search all 40 for your phase folder names, because the lineages
  broadened across phases and each wrote a consolidation in iteration 10.
- Pre-resolved citations: `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/288e5251-49b6-487c-934d-a3aa36385901/scratchpad/cites-<lineage>.txt`.
  One line per citation: `OK <lineage>/iteration-0NN.md:<line in the record> <cited path>:<lines> => <the cited text, cut to 300 characters>`.
  Lines starting `MISSING`, `RANGE` or `NOLINE` are citations that do not resolve. Use this file
  to find problems fast. It does not replace opening the cited file.
- The reference repos: `specs/system-skilled-bots/context/` (OpenBot-main, OpenMausBot-main,
  rakazo-main, openhuman-main, openhuman-full, OpenGhost-main, hermes-muse-main, turnstone-main,
  buzz-main, tinychannels-main). They are gitignored, so search them with `rg --no-ignore`.
- The build plan: `specs/system-skilled-bots/003-openbot-parity-build/` with fourteen phase
  folders and a `contracts/` folder. Some phases (003, 010, 011) are phase parents with child
  folders that hold the detailed plan.
- The built runtime: `.skilled/skills/system-skilled-bots/runtime/lib/`, `.skilled/bin/bots.cjs`.
- Three earlier syntheses, whose findings must not be repeated:
  - S1 `specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md` (what to build, the skip list in section 13, the reuse table in section 14)
  - S2 `specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/research.md` (plan review, 98 findings)
  - S3 `specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md` (plan depth, with a "Reference code to study first" line per phase)

## What to do for every finding in your slice

1. **Open every cited location yourself.** Read the cited lines with a few lines of context.
   A citation counts only if the lines say what the finding claims.
2. **Grade the finding.**
   - `confirmed`: you read the cited lines and the claim would have read differently if it were false.
   - `weak`: the citation resolves but supports only part of the claim, or the claim is a
     reasonable inference the lines do not state. Rewrite the claim down to what the lines support.
   - `wrong`: the cited lines contradict the claim or do not contain it, and you could not find
     the right lines nearby. A wrong finding goes in the regrade log, not in the section.
   - `not verified`: the citation does not resolve and you could not locate the source.
   When the content sits a few lines away from the cited line, correct the line number and
   grade on the corrected citation. Say that you corrected it in the regrade log.
3. **Check the plan side.** A finding that says "the plan does not guard against X" or "the
   plan differs" is a claim about the 003 packet. Open the phase's documents (spec.md, plan.md,
   tasks.md, acceptance-criteria.md, any `design/` folder, the children of a phase parent, and
   `contracts/`) and search for it. If the plan already covers it, the finding is `wrong` on
   the plan side: record it in the regrade log with the plan line that covers it. If your
   search finds nothing, say which pattern you searched and where. An absence is always
   stated as "searched, no hit", never as a certainty.
4. **Check the overlap.** Search S1, S2 and S3 for the cited reference file and for the idea.
   If an earlier synthesis already carries the finding, do not repeat it. List it under
   "Already carried" with the synthesis and line, and keep only what is new, if anything is.
5. **Name the licence for anything to lift or mirror.** Read the licence from the repo's or the
   crate's own LICENSE file or manifest and cite it. GPL code is a design reference only,
   because the build is MIT: say "mirror the design, copy no code". S1 section 14 already
   records the licence of eight repos. `openhuman-full` and its vendored crates under
   `vendor/` were never checked, so check each one you cite.
6. **Merge duplicates across lineages.** When two lineages found the same thing, write one row
   and name both origins. Agreement between lineages is not proof. The cited line is.

Do not add findings of your own unless you hit one while verifying. Mark such a row `S` in the
origin column. Do not pad: a short section of confirmed rows is the goal, and an honest "no
reference implements this" is a valid result for a phase.

## Citation form in your output

Write every citation as `[SOURCE: <prefix>/<path>:<line>]` or `:<from>-<to>`, one path and one
line or one line range per tag, with these prefixes:

| Prefix | Expands to |
|---|---|
| `C/` | `specs/system-skilled-bots/context/` |
| `B/` | `specs/system-skilled-bots/003-openbot-parity-build/` |
| `L/` | `.skilled/skills/system-skilled-bots/runtime/lib/` |
| `S1/` | `specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/` |
| `S2/` | `specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/` |
| `S3/` | `specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/` |

Any other path is written in full from the repository root. Every tag must point at a file
that exists and a line inside it. Check each tag you write before you finish.

## Output file

Write markdown in this shape. Use the exact phase folder name in each `###` heading.

```markdown
### <phase folder name, for example 001-activity-and-actor>

One short paragraph: what the references offer this phase, in plain words.

**Reference code to lift or mirror**

| # | What | Where | Licence | Lift or mirror, and what exactly | Grade | Origin |
|---|---|---|---|---|---|---|

**Where the plan differs from the references**

| # | The plan | The reference | Which side the evidence supports, and why | Grade | Origin |
|---|---|---|---|---|---|

**Pitfalls the plan does not guard against**

| # | Failure, test or fix in the reference | Plan-side check | Guard to add | Grade | Origin |
|---|---|---|---|---|---|

**Already carried by an earlier run**

- <the finding in a few words>: <S1, S2 or S3 with its line>. New here: <what, or "nothing">.
```

After the last phase section add:

```markdown
## Regrade log for <your slice>

| Origin | Lineage claim | Outcome | Reason |
|---|---|---|---|
```

Outcomes are `wrong`, `not verified`, `downgraded to weak`, `citation corrected`, `dropped as
duplicate of an earlier synthesis` and `dropped as out of scope`. Every finding of your slice
that is not a row in a section is a row here.

Origin ids: `V1-3-2` is lineage vibe-1, iteration 3, finding 2. `V2`, `P1` and `P2` are vibe-2,
pi-1 and pi-2. Number unnumbered findings in the order they appear.

Leave a table out when it has no row, and say so in one line. Plain words, short sentences, no
em dash, no semicolon.

## Your final message

Reply with: the output file path, the count of rows per grade, the count of regrade-log rows per
outcome, and the two or three findings you consider most important for a builder. Nothing else.
