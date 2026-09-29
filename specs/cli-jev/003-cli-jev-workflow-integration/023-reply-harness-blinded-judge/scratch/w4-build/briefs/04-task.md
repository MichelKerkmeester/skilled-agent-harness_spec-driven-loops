TASK: add the zero-call summary, the label gate and the headroom check to the script, with tests.
S = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs (exists)
T = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs (exists)
Read S and T in full first. Keep every existing line unchanged except the one JSDoc line in STEP 1a. Same style as S.

STEP 1. Edit S.
a. The JSDoc above `LABEL_GATE` reads `/** Operator grades a dimension needs before its agreement can be read. */`. Replace it with `/** Graded distinct replies the operator must supply before any model call. */`.
b. Append section `5. SUMMARY` after section 4, with three exported string constants, text exact:
`MARGIN_LINE = 'margin: 0.10'`
`KEEP_RULE_LINE = 'keep rule: coverage 10*M >= 9*K, then kill when p_loss < 0.05, then margin 10*(A-B) >= 7*M, then sign test p_win < 0.05, then for jev flips 10*F <= 21*M'`
`POWER_LINE = 'power: a keep needs at least 5 wins with no loss, 0.5^5 = 0.03125 < 0.05'`
c. And three exported functions:
- `questionSetSha(dimensions)`: `sha256Hex(JSON.stringify({ questions: dimensions.map((d) => [d.id, d.judgeGuidance]), levels: LEVELS }))`.
- `agreementCounts(labeled, baseline, dimensionIds)`: labeled is a Map from reply SHA to `{ grades }`, baseline a Map from reply SHA to a levels object. For every SHA of labeled and every id, cells goes up by 1, and agree goes up by 1 when `baseline.get(sha)[id] === labeled.get(sha).grades[id]`. Keep the same two counts per id. Returns `{ cells, agree, perDimension }`, perDimension an object from id to `{ agree, cells }`, every id present.
- `summaryLines({ census, dimensionIds, questionsSha, baseline, labelsInfo, labeled })` returns `{ lines, gate, agreement }`. labelsInfo is `null` when no labels file was named, else `{ rows, sha256, unmatchedRows }`. K is `labeled.size` and D is `dimensionIds.length`. agreement is `agreementCounts(labeled, baseline, dimensionIds)`. lines, in this order:
 `masked: ${census.masked}`, `distinct: ${census.distinct}`, `matched: ${census.matched}`, `unmatched: ${census.unmatched}`, `questions sha256: ${questionsSha}`,
 `baseline: score.mjs dimension scores, 0 = absent, 1 = fully met, between = partly met`,
 `baseline levels: absent=${a} partly met=${p} fully met=${f}`, counting every level of every baseline entry,
 `labels: none`, or `labels: rows=${rows} sha256=${sha256} unmatched=${unmatchedRows}`,
 `labeled: ${K}`,
 when K is 0 `baseline agreement: n/a`, else `baseline agreement: ${agree}/${cells} = ${(agree / cells).toFixed(4)}` followed by one `baseline agreement ${id}: ${agree}/${cells}` line per id in dimensionIds order,
 `MARGIN_LINE`, `KEEP_RULE_LINE`, `POWER_LINE`,
 then exactly one gate line: K below `LABEL_GATE` gives `stop: fewer than 20 labeled replies` and gate `'stop'`; else `10 * agree > 9 * cells` gives `no headroom` and gate `'no headroom'`; else `planned calls: deem=${D * K} jev=${3 * D * K + 1}` and gate `'planned'`.
Comment the headroom test once: above 90 percent baseline agreement a 10-point gain cannot fit, so no arm calls.

STEP 2. In T, add a helper and three tests. Helper `synthetic(n, agreeing)`: ids is `loadRubric().map((d) => d.id)`; for i from 0 to n-1 the SHA is `` `sha${i}` ``, the baseline levels object maps every id to `'fully met'`, and the grades map the first `agreeing` ids to `'fully met'` and the rest to `'absent'`. Returns `{ ids, baseline, labeled }` with labeled a Map to `{ grades }`. Call `summaryLines` with `census` `{ masked: 1, distinct: 1, matched: 1, unmatched: 0 }`, `questionsSha` `'q'` and `labelsInfo` `{ rows: n, sha256: 'h', unmatchedRows: 0 }`.
14. `synthetic(19, 3)`: gate `'stop'` and the last line is `stop: fewer than 20 labeled replies`.
15. `synthetic(20, 3)`: gate `'planned'`, the last line is `planned calls: deem=140 jev=421`, the lines include `baseline agreement: 60/140 = 0.4286` and `baseline agreement tone: 0/20`, and the line before the gate line is `POWER_LINE`.
16. `synthetic(20, 7)`: gate `'no headroom'` and the last line is `no headroom`.

Accept when: 2 files changed (S and T), no other file changed, both pass `node --check`, and `grep -c "^export function" S` prints 13.
Checks you run: `node --check S`, `node --check T`, `grep -c "^export function" S`. Do not run `node --test`: the orchestrator runs it.
