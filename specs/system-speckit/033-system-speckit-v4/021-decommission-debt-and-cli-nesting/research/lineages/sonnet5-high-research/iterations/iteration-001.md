# Iteration 1: Commands That Write State Without Routing Through Spec-Kit

## Focus

Audit `.opencode/commands/**/*.md` for commands that persist files or
cross-run state without routing through Gate 3, `create.sh`, `validate.sh`,
or the continuity writer (`generate-context.js`).

## Findings

### F1-1 (Medium): `improvement/` is a live spec-folder artifact family with zero validate.sh or folder-structure.md recognition

`/deep:agent-improvement` and `/deep:model-benchmark` both persist packet-scoped
state directly under the target spec folder:

- `deep/agent-improvement.md:88` -- "persist `{spec_folder}/improvement/agent-improvement-config.json`"
- `deep/model-benchmark.md:94` -- "persist `{spec_folder}/improvement/model-benchmark-config.json`"
- `deep/agent-improvement.md:121` -- the YAML workflow "writes packet-local candidates, scores them... and reduces the run into a dashboard plus registry" (all under `improvement/`)

By contrast, `research/` and `review/` (deep-research / deep-review) are
explicitly documented as recognized "local owner folders":
`.opencode/skills/system-spec-kit/references/structure/folder-structure.md:139,187-230`
-- flat-first layout rules, a `pt-NN` allocation rule, an explicit "Forbidden"
clause (line 228), and a pointer to each mode's `loop-protocol.md`
(line 230). `improvement/` has **no equivalent entry anywhere** in
`folder-structure.md` (confirmed by grep -- the only "improvement" hits in
that file are unrelated). [SOURCE: file:.opencode/skills/system-spec-kit/references/structure/folder-structure.md:139]

The validate.sh rule that checks packet file completeness,
`check-files.sh`, only asserts that **required** level docs exist
(`spec.md`, `plan.md`, `tasks.md`, `decision-record.md` for Level 3, plus the
phase-parent lean trio) -- it carries no denylist/allowlist of top-level
child folders, so an `improvement/` folder with malformed or drifted JSON
inside it would never fail validation.
[SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/rules/check-files.sh:9-13]

The continuity writer, `generate-context.ts`, also has zero references to
`research`, `review`, or `improvement` as special-cased folders (grep across
the full 1004-line file returns only two unrelated string matches).
[SOURCE: file:.opencode/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:132,150]
This is consistent with deep-research's own SKILL.md, which states continuity
save is "expected but non-blocking" for that mode
[SOURCE: file:.opencode/skills/system-deep-loop/deep-research/SKILL.md:413] --
but `improvement/` lacks even that non-blocking mention, or any protocol doc
equivalent to `spec-check-protocol.md`.

**Fix:** Add an `improvement/` entry to `folder-structure.md` §4 alongside
`research/`/`review/` (ownership, flat-first vs `pt-NN` rule if applicable,
forbidden cases), and add a `check-files.sh`-adjacent (or new) rule that at
least validates `improvement/*-config.json` is well-formed JSON when present,
so a corrupted benchmark/improvement config packet fails `validate.sh`
instead of silently passing.

### F1-2 (Informational): non-spec-kit commands correctly stay outside Gate 3's artifact-routing vocabulary, by design

`create/*.md` (skill, agent, command, changelog, diagram, diff,
feature-catalog, manual-testing-playbook, readme, repo-rule, skill-parent,
with-human-voice), `design/extract.md`, `prompt/improve.md`,
`rewrite/response-by-external-agent.md`, and `agent-router.md` all write (or
explicitly refuse to write, in the external-agent-rewrite case) through their
owning skill's own pipeline (sk-doc, sk-design-md-generator, sk-prompt) rather
than through spec-kit's `create.sh`/`validate.sh`. This matches root
CLAUDE.md's own routing split ("route through `sk-doc` -- except spec-folder
docs, which are `system-spec-kit`'s")
[SOURCE: file:/Users/michelkerkmeester/.claude/CLAUDE.md Gate 2 artifact trigger paragraph].
`rewrite/response-by-external-agent.md:53` explicitly states it "writes no
files to disk" at all. No fix needed here -- ruled out as a false-positive
angle after reading all 12 non-speckit, non-deep command files.
[SOURCE: file:.opencode/commands/rewrite/response-by-external-agent.md:53]

### F1-3 (Informational): `deep/model-benchmark.md` and `deep/agent-improvement.md` do require `spec_folder` as a mandatory input

Both commands gate on `spec_folder` as a required setup field before any
workflow YAML loads (`deep/model-benchmark.md:35,49`,
`deep/agent-improvement.md:36,49`), so the Gate-3-style "which packet owns
this write" question is asked at the command layer even though the command
text never says "Gate 3" verbatim. The gap identified in F1-1 is specifically
about validation/continuity coverage of the resulting `improvement/` folder,
not about whether a spec folder is chosen up front.

## Sources Consulted

- `.opencode/commands/**/*.md` (33 files, full directory listing + targeted grep/read)
- `.opencode/skills/system-spec-kit/references/structure/folder-structure.md`
- `.opencode/skills/system-spec-kit/runtime/cli/rules/check-files.sh`
- `.opencode/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts`
- `.opencode/skills/system-deep-loop/deep-research/SKILL.md`

## Assessment

- newInfoRatio: 1.0
- Novelty justification: First iteration; full survey of the command surface and its interaction with spec-kit's validation/continuity layer is entirely new to this packet.
- Confidence: High for F1-1 (direct grep evidence of absence across both target files); High for F1-2/F1-3 (direct reads of source command files).

## Reflection

- What worked: Grepping every command file for "Gate 3|create.sh|validate.sh|generate-context.js" quickly separated spec-kit-aware commands (deep research/review/ai-council/skill-benchmark) from the rest, then targeted reads on the ambiguous middle group (model-benchmark, agent-improvement) found the real gap.
- What failed: Initial hypothesis that `create/*.md` commands were the bypass risk did not hold up -- they are correctly out of spec-kit's routing scope by design (ruled out, F1-2).
- Ruled out: `create/*.md`, `design/extract.md`, `prompt/improve.md`, `rewrite/response-by-external-agent.md`, `agent-router.md` as Gate-3-bypass risks -- each writes (or explicitly refuses to write) through its own owning skill's pipeline, consistent with CLAUDE.md's routing split. [SOURCE: file:.opencode/commands/rewrite/response-by-external-agent.md:53]

## Recommended Next Focus

Q2: skills/agents whose SKILL.md or agent contract still describe retired
surfaces (memory MCP tools, `scripts/` paths, `memory/` paths,
`@spec-kit/scripts`, `/memory:*` commands).
