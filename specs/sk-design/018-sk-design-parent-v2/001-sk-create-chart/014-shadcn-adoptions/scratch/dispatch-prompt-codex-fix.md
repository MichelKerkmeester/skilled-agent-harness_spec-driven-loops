GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/014-shadcn-adoptions

Proceed directly to the work. Do not print A/B/C/D/E options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

# RUNTIME AND GUARDS

- Runtime: Codex CLI, non-interactive exec, sandbox workspace-write. You are the leaf; never dispatch another CLI or sub-agent. No git command that changes state.
- Write only under .opencode/skills/sk-design/sk-design-chart/ and the spec folder above.
- Do not loosen, skip or delete any existing assertion in scripts/check-corpus.cjs. No external resource may enter a template. No spec paths, task ids, requirement ids or decision ids in code comments.

# PERSONA

You are the repository's code implementer, dispatched directly by the operator; read .opencode/skills/sk-code/SKILL.md and .opencode/skills/sk-design/sk-design-chart/SKILL.md before editing, and honour the chart corpus contract in references/template-contract.md.

# TASK: ONE REVIEW FINDING TO FIX

An independent reviewer verified your earlier phase-014 work (all else passed) and found one real defect:

`READOUT.key` is declared in every one of the 22 tooltip-bearing files but has no effect. The pattern shipped is
    const source = { [READOUT.key]: name };
    MARKS.set(el, { name: READOUT.label(source[READOUT.key]), ... });
which returns `name` for any value of `READOUT.key`, so the key is decorative. The checker only tests that the text `READOUT.key` appears (scripts/check-corpus.cjs around the number-format READOUT check), so it cannot catch this. references/template-contract.md (the READOUT section, around lines 179-195) claims "the registration path reads those functions and the alias", which is false for every shipped instance. The packet's own curve-contract philosophy rejects exactly this shape: a declared intent the code does not hand to the drawing path is decorative.

Fix it honestly, in this order:

1. Decide what `key` means and make the code do it. The intended meaning: `READOUT.key` names the field of the hovered datum that the card's label is drawn from (for example `label`, `name`, `day`, `bin`). In each of the 22 files, find where the tooltip or card readout registration has access to the hovered datum object, and read the label as `READOUT.label(datum[READOUT.key])` (or the file's equivalent), removing the `{ [READOUT.key]: name }` indirection entirely. Where a form genuinely has no datum object at registration and the label comes from a computed string, restructure minimally so the datum (or a small record carrying the keyed field) is what the label is read from. Set each file's `READOUT.key` to the real field name of its data rows so the visible output stays identical to today's.
2. Make the checker hold it. In the number-format READOUT check, reject the decorative idiom: error when the code builds an object literal keyed by `READOUT.key` and immediately reads it back (`{ [READOUT.key]:` followed by `[READOUT.key]` within the same statement or the next), and require that `READOUT.key` appears as a property access on a datum (`[READOUT.key]` applied to something other than a literal built from it). Prove the assertion on a mutated copy under the packet's scratch/ (keep the copy there), record the exact FAIL line in scratch/mutations.md, then bring all 22 files to pass.
3. Correct references/template-contract.md so the READOUT section describes exactly what the code now does, no more.
4. Verify and record: `node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs` must print RESULT: PASSED with zero errors; the mutation copy must print RESULT: FAILED with the new error line; `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh <spec folder> --strict` must print RESULT: PASSED. Update implementation-summary.md (Verification table and a Key Decisions row about the alias wiring), goal.md log (a row for this review fix with evidence), and acceptance-criteria.md AC-002's verification cell to cite the datum read and the new mutation line. Regenerate the packet metadata twice with
  node .opencode/skills/system-spec-kit/runtime/cli/dist/spec-folder/generate-description.js <spec folder> "$PWD"
  node .opencode/skills/system-spec-kit/runtime/cli/dist/graph/backfill-graph-metadata.js <spec folder>
and run validate.sh --strict again.

# HANDBACK

SUMMARY, FILES CHANGED (one line per file), the new assertion and its mutation FAIL line, the checker and validate.sh result lines, and any file where the label source could not be a datum field and what you did instead. Never claim completion without the command outputs.
