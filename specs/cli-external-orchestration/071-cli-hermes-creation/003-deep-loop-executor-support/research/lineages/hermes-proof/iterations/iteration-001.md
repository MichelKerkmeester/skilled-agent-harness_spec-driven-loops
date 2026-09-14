# Iteration 1: Hard rule ids in the cli-hermes skill and the fan-out structural rule

## Focus

Single-iteration cap (config.maxIterations = 1). Answer the research topic: enumerate the
eight hard rule ids declared in the `cli-hermes` skill frontmatter, cite each by file:line,
and identify which rule a fan-out lineage exercises by construction.

## Actions Taken

- Read `.opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md` in full (341
  lines); extracted the `hard_rules:` block from the YAML frontmatter.
- Verified the eight `- id:` line numbers with a line-numbered content search over the
  same file.
- Read the dispatch-shape section of the same file (§3, lines 191-232) for the fan-out
  `--query-file -` / stdin contract.
- Read the packet changelog `.opencode/skills/cli-external-orchestration/cli-hermes/changelog/v1.0.0.0.md`
  for the `buildHermesLineageCommand` emission list.
- Located the builder in `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
  (`buildHermesLineageCommand`, line 2603).

## Findings

1. **The `cli-hermes` SKILL.md declares exactly eight hard rules in its frontmatter
   `hard_rules:` block (lines 6-38). Each carries `id`, `check`, `message`, `severity`
   (three `error`: `hermes-availability-required`, `yolo-required-for-writes`,
   `no-worktree-flag`; five `warn`: the remainder).

   | # | Rule id | Line | Severity |
   |---|---------|------|----------|
   | 1 | `stdin-redirect-required` | SKILL.md:7 | warn |
   | 2 | `hermes-availability-required` | SKILL.md:11 | error |
   | 3 | `yolo-required-for-writes` | SKILL.md:15 | error |
   | 4 | `ignore-rules-required` | SKILL.md:19 | warn |
   | 5 | `explicit-toolsets-required` | SKILL.md:23 | warn |
   | 6 | `no-worktree-flag` | SKILL.md:27 | error |
   | 7 | `mcp-config-operator-required` | SKILL.md:31 | warn |
   | 8 | `hooks-user-level` | SKILL.md:35 | warn |

   [SOURCE: .opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md:7,11,15,19,23,27,31,35]

2. **The rule a fan-out lineage exercises by construction is `stdin-redirect-required`
   (SKILL.md:7).** Its condition is inherent to what a fan-out dispatch IS: "Any
   non-interactive `hermes chat` MUST either feed the prompt on stdin through
   `--query-file -` or close stdin (`</dev/null`). An inherited terminal stdin can hang
   with zero output." A lineage spawned by the fan-out runner is non-interactive by
   construction, and the builder satisfies the rule by construction: the packet changelog
   records that `buildHermesLineageCommand` "emits `chat -Q --oneshot --query-file -` with
   the prompt on stdin", and SKILL.md §3 states "`-` reads stdin, which is how the fan-out
   builder passes it". No lineage dispatch shape can be built without resolving this rule.

   [SOURCE: .opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md:7,208; .opencode/skills/cli-external-orchestration/cli-hermes/changelog/v1.0.0.0.md:13; .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2603]

3. **Adjunct structural rules (why they are NOT the answer).** `yolo-required-for-writes`
   (SKILL.md:15) is only exercised by *write* leaves ("`--yolo` for write leaves" is
   conditional in the builder), so it is conditional, not by-construction for every
   lineage. `no-worktree-flag` (SKILL.md:27) is named by the fan-out containment guard in
   its message, but the guard only acts when the rule is *violated* — a lineage does not
   exercise it by construction, it exercises it by refraining. `hermes-availability-required`
   (SKILL.md:11) is a pre-dispatch probe, not a property of the dispatch construction.

   [SOURCE: .opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md:11,15,27; changelog/v1.0.0.0.md:13]

## Questions Answered

- Q1 (eight rule ids + the by-construction rule): answered with citations above.

## Questions Remaining

- None. The topic is single-question by design and the cap is 1 iteration.

## Assessment

- newInfoRatio: 0.9 — first pass over this source surface for this lineage; all eight ids,
  their line anchors, and the fan-out structural link are new to this session. The
  residual 0.1: the file is itself listed in the packet inventory, so discovering its
  existence is not new — only the extraction is.
- Confidence: high on ids and lines (frontmatter read directly, line numbers re-verified
  by content search). High on the by-construction answer (corroborated by the packet
  changelog and the builder function location). Medium on the relative weighting against
  `yolo-required-for-writes`, which the iteration documents as an adjunct argument.

## Reflection

- What worked: reading the frontmatter directly and re-verifying line numbers with a
  line-numbered search — no transcription risk on the eight ids; the changelog paragraph
  about `buildHermesLineageCommand` gave a one-line corroboration of the by-construction
  claim without needing a live dispatch.
- What failed / ruled out: treating `no-worktree-flag` as the by-construction answer
  because its message names the fan-out — the message describes the containment guard's
  reaction to a violation, not a construction property.
- Ruled out direction: answering with a list of "all rules a fan-out touches" — the
  question asks for the one the construction exercises, so the answer is the rule whose
  precondition (non-interactive stdin) is structurally guaranteed by the builder.

## Recommended Next Focus

None — cap reached. Proceed to synthesis with stopReason maxIterationsReached.
