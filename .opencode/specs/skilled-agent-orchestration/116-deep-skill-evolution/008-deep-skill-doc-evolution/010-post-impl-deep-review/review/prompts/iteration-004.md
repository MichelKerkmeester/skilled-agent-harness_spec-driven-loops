DEEP-REVIEW

# Deep-Review Iteration 4 — D4 SECURITY of the 008 doc ship (final dimension)

## ROLE

You are a SWE-1.6 deep-review LEAF iteration worker auditing the 008 deep-skill doc-evolution ship (commit 5f3e0a2f53). READ-ONLY. Cite EVERY finding with `file:line` evidence — inference-only findings are NOT acceptable. Before output, call sequential_thinking (>=5 thoughts) per your agent-config.

## STATE

Segment: 1 | Iteration: 4 of 5 | Dimension: D4 security (final dimension; expect low yield for pure docs)
Findings so far: 0 P0 / 0 P1 / 1 P2 (iter-1 correctness CLEAN; iter-2 traceability 1 confirmed P2 [stale README versions]; iter-3 maintainability 0 confirmed [em-dash + robust adjudicated as corpus-baseline / legit terminology]).
Next focus: D4 Security — the docs are pure markdown/JSON; the realistic risk surface is leaked secrets, unsafe example commands, and credential/host exposure in example snippets.

Review Target: the 5 deep-* skills' docs as shipped in 5f3e0a2f53.
Iteration: 4 of 5 | Dimension this iteration: security

## SEED CONTEXT (read first)

- The 5 skills: `.opencode/skills/{deep-loop-runtime,deep-research,deep-review,deep-ai-council,deep-agent-improvement}/` — SKILL.md, README, references/, feature_catalog/, manual_testing_playbook/, assets/.
- This is a DOCUMENTATION ship (no application code). Security findings are about what the DOCS expose or instruct, not runtime code.

## PRE-PLANNING (ordered, with acceptance criteria)

1. **Secret/credential sweep:** grep the 5 skills' docs for hardcoded secrets/tokens/keys — patterns like `api[_-]?key`, `token`, `secret`, `password`, `Bearer `, `sk-`, `ghp_`, AWS-style keys, real-looking credential values. Acceptance: a list of any exposed secret with file:line, or "0 hardcoded secrets across N files."
2. **Unsafe example-command sweep:** grep the docs (esp. manual_testing_playbook + README QUICK START + assets) for destructive/unsafe example commands presented WITHOUT guards — `rm -rf /` or unguarded `rm -rf`, `curl ... | sh`, `eval`, `chmod 777`, force-push examples. Acceptance: any unsafe example with file:line, or "0 unsafe examples."
3. **Host/path exposure:** check for real internal hostnames, private IPs, or absolute user-specific paths baked into example snippets that would leak environment detail or break for other users. Acceptance: any exposure with file:line, or "0 / only placeholder paths."
4. **Permission/scope guidance:** spot-check that any agent-config or permission examples in the docs follow least-privilege (no blanket wildcards presented as the recommended default). Acceptance: PASS or a concrete over-broad-default finding.

Stop conditions: max 12 tool calls; findings only. If clean (expected for docs), say so with the grep evidence. Do NOT re-report correctness/traceability/maintainability/structural items unless a NEW security angle.

## STATE FILES

- **YOUR ONLY WRITE TARGET** — `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/008-deep-skill-doc-evolution/010-post-impl-deep-review/review/iterations/iteration-004.md`
- Do NOT write `deep-review-state.jsonl` or `deltas/` — the driver builds those.

## CONSTRAINTS

- LEAF agent. Max 12 tool calls. Read-only. Every finding carries `file:line` evidence.
- Severity: P0 = a live secret/credential is exposed, or a doc instructs a destructive action without warning. P1 = a real security-hygiene gap in guidance. P2 = minor (e.g. an absolute user path in an example). Be calibrated: placeholder tokens (`<your-key>`, `$API_KEY`, `sk-...`) are NOT findings.

## OUTPUT CONTRACT (write EXACTLY ONE file)

Write ONLY the narrative at `.../review/iterations/iteration-004.md` with H2 headings, in order: `## Focus`, `## Actions Taken`, `## Findings`, `## Coverage`, `## Next Focus`.
- Under `## Findings`, each finding gets `### P0|P1|P2 — <title>` with dimension, `file:line`, evidence, recommendation. If clean: `No security findings — docs expose no secrets, unsafe commands, or env detail (evidence below).`

End with a single fenced ```json block (LAST thing in the file):

```json
{"dimensions":["security"],"filesReviewed":["..."],"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.0,"status":"complete","findingDetails":[]}
```

Emit the block even with zero findings. newFindingsRatio = new findings this iter / total findings so far.
