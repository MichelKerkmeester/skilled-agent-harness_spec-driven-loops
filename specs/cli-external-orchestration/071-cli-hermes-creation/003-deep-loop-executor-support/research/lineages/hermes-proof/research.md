# Deep Research Synthesis: cli-hermes hard rule ids and the fan-out by-construction rule

Lineage: `hermes-proof` (cli-hermes / deepseek-v4.1-flash) · Spec: 071-cli-hermes-creation/003-deep-loop-executor-support
Session: `fanout-hermes-proof-1789413817214-0ezbso` · 1 iteration · Stop policy: max-iterations

## 1. Executive Summary

`.opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md` declares exactly eight hard
rules in its YAML frontmatter `hard_rules:` block:

| # | Rule id | Cite | Severity |
|---|---------|------|----------|
| 1 | `stdin-redirect-required` | SKILL.md:7 | warn |
| 2 | `hermes-availability-required` | SKILL.md:11 | error |
| 3 | `yolo-required-for-writes` | SKILL.md:15 | error |
| 4 | `ignore-rules-required` | SKILL.md:19 | warn |
| 5 | `explicit-toolsets-required` | SKILL.md:23 | warn |
| 6 | `no-worktree-flag` | SKILL.md:27 | error |
| 7 | `mcp-config-operator-required` | SKILL.md:31 | warn |
| 8 | `hooks-user-level` | SKILL.md:35 | warn |

The one a fan-out lineage exercises by construction is **`stdin-redirect-required`
(SKILL.md:7)**. A lineage dispatch is a non-interactive `hermes chat` by construction, and
the builder that constructs it satisfies the rule's MUST structurally:
`buildHermesLineageCommand` emits `chat -Q --oneshot --query-file -` with the prompt on
stdin, so the prompt is delivered through the stdin channel rather than inherited from a
terminal.

## 2. Research Topic

List the eight hard rule ids declared in
`.opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md` and state which one a
fan-out lineage exercises by construction, citing the file and line for each id.

## 3. Methodology

One iteration (cap = 1, stop policy max-iterations). Evidence: direct read of the skill's
frontmatter and §3 dispatch-shape section; line numbers re-verified with a line-numbered
content search over the same file; the packet changelog's `buildHermesLineageCommand`
paragraph; the builder's location in the shared runtime. In-process LEAF execution — no
nested CLI dispatch, no live `hermes` run, all writes confined to the lineage directory.

## 4. Findings

### Angle 1 — Rule inventory

- Eight ids, one per `- id:` line in the frontmatter `hard_rules:` block (lines 6-38):
  `stdin-redirect-required` (l.7), `hermes-availability-required` (l.11),
  `yolo-required-for-writes` (l.15), `ignore-rules-required` (l.19),
  `explicit-toolsets-required` (l.23), `no-worktree-flag` (l.27),
  `mcp-config-operator-required` (l.31), `hooks-user-level` (l.35).
  Severity split: three `error` (availability, yolo, worktree), five `warn`.
  [iter001: f-iter001-001]

### Angle 2 — Which rule a fan-out lineage exercises by construction

- **`stdin-redirect-required` (SKILL.md:7).** The rule reads "Any non-interactive
  `hermes chat` MUST either feed the prompt on stdin through `--query-file -` or close
  stdin (`</dev/null`)". A fan-out lineage is non-interactive by construction, and the
  builder resolves the rule in its construction: the changelog records that
  `buildHermesLineageCommand` "emits `chat -Q --oneshot --query-file -` with the prompt on
  stdin", and the skill states that `-` "reads stdin, which is how the fan-out builder
  passes it" (SKILL.md:208). [iter001: f-iter001-002; changelog/v1.0.0.0.md:13;
  fanout-run.cjs:2603]
- Adjunct rules that a fan-out lineage *touches* are not the answer, because they are
  conditional rather than structural: `yolo-required-for-writes` (SKILL.md:15) binds only
  write leaves ("`--yolo` for write leaves"); `no-worktree-flag` (SKILL.md:27) is named by
  the fan-out containment guard in its message, but the guard acts only when the rule is
  violated — the construction refrains rather than exercises it; and
  `hermes-availability-required` (SKILL.md:11) is a pre-dispatch probe, not a property of
  the dispatch construction. [iter001: f-iter001-003]

## 5. Quality Guards

- Source diversity: three distinct sources for the answer (the skill packet's SKILL.md, its
  changelog, and the shared runtime builder). The rule inventory itself rests on one
  canonical file — appropriate, since the frontmatter is the sole declaration site.
- Focus alignment: the single question was the iteration's only focus; no drift.
- No single weak source: the by-construction claim is corroborated by two independent
  artifacts beyond the frontmatter line.

## 6. Convergence Report

- Stop reason: `maxIterationsReached` (cap = 1; convergence is telemetry only under the
  max-iterations policy, and was not claimed).
- Total iterations completed: 1.
- Questions answered ratio: 1/1.
- Average newInfoRatio trend: 0.9 (single sample).

## 7. Open Questions

None. The topic was single-question by design and is answered with citations.