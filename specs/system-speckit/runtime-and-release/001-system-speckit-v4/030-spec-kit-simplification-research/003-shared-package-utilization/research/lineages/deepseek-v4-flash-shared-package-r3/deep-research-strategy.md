# Deep Research Strategy — Round Three (DeepSeek V4 Flash, 5 iterations)

## Research Charter

Topic: ROUND THREE of the @spec-kit/shared audit — five bounded iterations on angles rounds one and two covered thinly or not at all. Operating context: the census (confirmed-findings.md) judged every row of both rounds; every confirmed row was remediated in 009 and 015. This lane re-audits the post-009 tree from five new angles and must not re-report censused rows without new evidence.

Non-Goals: no edits; no redesign; no prose-style review; no repository-wide census; no validate.sh/node tooling/git; no nested dispatch.

## Known Context

- The barrel is `package.json` `exports` (no `index.ts`): `./*` -> `./dist/*.js`, `./*.js` -> `./dist/*.js`, plus explicit entries for `./workspace/repo-root.mjs`, `./review-research-paths.cjs`, `./compact-merger`, `./budget-allocator`. `shared/package.json` has `"type": "module"`, version 1.7.2.
- Dist directories in this worktree are untracked and stale; read checked-in source only.
- Census dispositions that bind: L1 (algorithms/embeddings monolith removed in 009; boolean-expr stays as documentary contract), L2 (telemetry dir + config.ts single source; paths.ts removed), R2-01 (two DB directory derivations recorded decision), R5-01 (two Ollama implementations recorded decision not to merge), R6-02/03 (eight root-resolution implementations recorded), R4-03 (advisor isolation comment-enforced recorded), R7-01 (folder-scoring removed), R1-01/02/R2-02/R2-03/R4-01/R6-01/R7-02/R8-01/R8-02/R8-03/R9-01 fixed or kept rows.

## Key Questions

- q1: Which cross-skill consumers import @spec-kit/shared, what does each take, and does any import reach a path the exports map does not cover or a symbol that does not exist?
- q2: Do runtime consumers re-declare types/shapes the package already exports?
- q3: Which barrel-exported symbols have no importer, and which have no test?
- q4: How does a consumer resolve compiled output, and does CI reproduce that?
- q5: Does the generated README reader table match the barrel and its consumers?

## Next Focus

Iteration 1: cross-skill consumers (sk-doc, deep-loop runtime, skill-advisor, bin) — what each imports and from where; barrel coverage of each import path and symbol.

## What Worked

(empty)

## What Failed

(empty)

## Exhausted Approaches

(empty)
