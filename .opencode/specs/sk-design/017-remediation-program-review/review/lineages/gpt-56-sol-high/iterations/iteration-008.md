# Deep Review Iteration 008 — Maintainability Operator/API Parity

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-gpt-56-sol-high-1784650021792-031fvi`
- Generation / lineage: `1` / `new`
- Budget profile: `verify`
- Scope: validated 118-file `goal-file-manifest.txt` at pinned HEAD `7b9d3b6b71`
- Structural caveat: Code Graph was unavailable by dispatch contract; direct manifest-scoped reads, focused tests, and read-only CLI probes were used.

## Files Reviewed

- `.opencode/skills/sk-design/styles/lib/database/{operator,retrieval,schema}.mjs`
- `.opencode/skills/sk-design/styles/lib/database/README.md`
- `.opencode/skills/sk-design/styles/docs/manual-testing-playbook.md`
- `.opencode/skills/sk-design/styles/lib/engine/{persistent-adapter,style-library}.mjs`
- `.opencode/skills/sk-design/styles/tests/database/{operator,retrieval}.test.mjs`
- `.opencode/specs/sk-design/015-styles-database-evolution/006-persistent-db-activation/spec.md`
- `.opencode/specs/sk-design/017-remediation-program-review/spec.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **P1-007 — Operator options with missing values silently target defaults** -- `.opencode/skills/sk-design/styles/lib/database/operator.mjs:49` -- `optionValue` returns `null` when an option has no following value, and the dispatcher then applies `DEFAULT_STYLE_DATABASE_PATH`. Thus `status --database` succeeds against the default database instead of rejecting malformed input; `build --corpus <root> --database` can likewise mutate the default. Unknown flags are ignored, contradicting the promised nonzero invalid-input exit [SOURCE: `.opencode/skills/sk-design/styles/lib/database/operator.mjs:49-52`] [SOURCE: `.opencode/skills/sk-design/styles/lib/database/operator.mjs:213-225`] [SOURCE: `.opencode/skills/sk-design/styles/lib/database/README.md:69-79`].
   - Finding class: class-of-bug
   - Scope proof: Every option uses the same helper. A direct `runStyleDatabaseOperator(['status','--database'])` probe returned `{ok:true,published:false}` for the default path; the operator test covers only fully valued happy paths [SOURCE: `.opencode/skills/sk-design/styles/tests/database/operator.test.mjs:16-54`].
   - Affected surface hints: operator argument parser; status/build database targeting; unknown-option rejection; CLI error JSON and exit status
   - Content hash: `sha256:33c4f2929b9d12ee42b20ad37477562ba79232be927747e521aa6323c6543df9`
   - Recommendation: Validate command-specific option schemas, reject unknown/missing values before defaults, and add subprocess exit/JSON tests.

```json
{"findingId":"P1-007","type":"operator-input-contract","claim":"Missing option values and unknown flags are accepted; a trailing --database silently selects the default database despite the invalid-input failure contract.","evidenceRefs":[".opencode/skills/sk-design/styles/lib/database/operator.mjs:49-52",".opencode/skills/sk-design/styles/lib/database/operator.mjs:213-225",".opencode/skills/sk-design/styles/lib/database/README.md:69-79",".opencode/skills/sk-design/styles/tests/database/operator.test.mjs:16-54"],"counterevidenceSought":"Re-read every command branch and ran 13/13 focused tests. Corpus, generation, and profile guards exist, but no branch validates a missing database value or unknown option; a malformed status probe returned success.","alternativeExplanation":"Permissive parsing may be intentional and omission legitimately uses the default.","finalSeverity":"P1","confidence":0.98,"downgradeTrigger":"A governing contract permits unknown flags and proves valueless path options cannot reach state-changing commands."}
```

2. **P1-008 — Status cannot report an uninitialized clean-checkout database root** -- `.opencode/skills/sk-design/styles/lib/database/operator.mjs:61` -- Status calls `readdir` before checking for the publication pointer. If the git-ignored database directory is absent, status throws `ENOENT` and emits `internal-error` instead of its modeled `{published:false}` DTO [SOURCE: `.opencode/skills/sk-design/styles/lib/database/operator.mjs:58-95`] [SOURCE: `.opencode/skills/sk-design/styles/lib/database/operator.mjs:257-267`] [SOURCE: `.opencode/skills/sk-design/styles/lib/database/schema.mjs:8-13`].
   - Finding class: instance-only
   - Scope proof: A read-only probe against an absent parent reproduced `ENOENT`; the no-pointer branch works only when the parent exists, and the operator test creates a fixture directory before status [SOURCE: `.opencode/skills/sk-design/styles/tests/database/operator.test.mjs:16-32`].
   - Affected surface hints: clean-checkout operator status; absent-generation JSON; status exit classification; prewarm diagnostics
   - Content hash: `sha256:33c4f2929b9d12ee42b20ad37477562ba79232be927747e521aa6323c6543df9`
   - Recommendation: Treat an absent generation directory as empty and test missing-directory plus existing-empty-directory status.

```json
{"findingId":"P1-008","type":"operator-absence-contract","claim":"Status throws internal ENOENT when the database root has never been created instead of returning the modeled unpublished status.","evidenceRefs":[".opencode/skills/sk-design/styles/lib/database/operator.mjs:58-95",".opencode/skills/sk-design/styles/lib/database/operator.mjs:257-267",".opencode/skills/sk-design/styles/lib/database/schema.mjs:8-13",".opencode/skills/sk-design/styles/tests/database/operator.test.mjs:16-32"],"counterevidenceSought":"The happy-path test passes after fixture setup and the existing-empty-directory branch returns published:false; an absent-parent probe reproducibly throws ENOENT.","alternativeExplanation":"Directory creation could be an undocumented operator precondition.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"A governing contract requires pre-creation and an owned bootstrap guarantees it before every status call."}
```

### P2 Findings

None.

## Traceability Checks

| Surface | Status | Evidence |
|---|---|---|
| Option names / invalid-input exits | Fail | Missing values and unknown flags are not rejected [SOURCE: `.opencode/skills/sk-design/styles/lib/database/operator.mjs:49-52`] [SOURCE: `.opencode/skills/sk-design/styles/lib/database/README.md:69-79`]. |
| Default mode | Pass | Precedence remains option, environment, then `legacy` [SOURCE: `.opencode/skills/sk-design/styles/lib/engine/persistent-adapter.mjs:97-110`]. |
| Status absent-generation fields | Fail | Empty directories return unpublished; absent directories throw first [SOURCE: `.opencode/skills/sk-design/styles/lib/database/operator.mjs:58-95`]. |
| Valid build/cutover/rollback/repair | Pass | Valid semantics and retention agree with docs; focused tests passed [SOURCE: `.opencode/skills/sk-design/styles/lib/database/operator.mjs:157-205`] [SOURCE: `.opencode/skills/sk-design/styles/tests/database/operator.test.mjs:16-54`]. |
| Retrieval/public result fields | Pass | Generation, ranking, channel health, eligibility, cards, attribution, and cursor fields are coherent [SOURCE: `.opencode/skills/sk-design/styles/lib/database/retrieval.mjs:493-510`]. |
| Absent persistent query generation | Pass | Retrieval fails closed with `generation-unavailable` [SOURCE: `.opencode/skills/sk-design/styles/lib/database/retrieval.mjs:296-320`] [SOURCE: `.opencode/skills/sk-design/styles/tests/database/retrieval.test.mjs:52-60`]. |

## Integration Evidence

- Exact surfaces: `runStyleDatabaseOperator`, `getStyleDatabaseStatus`, `queryPersistentStyles`, `dispatchStyleQuery`, `resolveStyleDatabaseMode`, database README, playbook, and packet 015/006.
- HEAD: `7b9d3b6b71`; operator/retrieval suites: 13/13 passed.
- Malformed-option and absent-directory probes reproduced both findings; `operator.mjs` hash is `sha256:33c4f2929b9d12ee42b20ad37477562ba79232be927747e521aa6323c6543df9`.

## Edge Cases

- Omitting `--database` is valid; a present flag with no value is the defect.
- Existing empty directories return `published:false`; only a missing parent throws.
- The first exact search surfaced lineage-local review hits in addition to manifest evidence. No out-of-target code evidence was used, and finding anchors were re-read directly.
- Code Graph remained unavailable; structural-impact analysis is unavailable.

## Confirmed-Clean Surfaces

- Valid operator commands match documented happy-path semantics.
- Adapter default remains `legacy`; absent persistent query generation fails closed without a lazy build.
- Reviewed retrieval fields and channel labels agree with current README semantics.

## Ruled Out

- New stale-path finding: `P1-002` and `P1-004` own unchanged path drift.
- Treating `repair` as full artifact rebuild: README explicitly defines vector-profile invalidation/requeue.
- Requiring the operator to enforce human cutover gates: the command only switches a generation pointer.
- P0 escalation: neither defect alone causes destructive loss.

## Next Focus

- Dimension: correctness (third-pass adversarial performance)
- Focus area: challenge shadow-parity and p95 claims, including denominator, sample selection, output fields, and cutover-gate interpretation
- Reason: operator/API parity is exhausted; iteration 9 needs a distinct performance/final-adversarial angle
- Rotation status: rotate without repeating stale paths, consumer enumeration, or operator parsing
- Blocked/productive carry-forward: Code Graph and md-generator Vitest remain unavailable; manifest-listed oracle, benchmark, telemetry, packet claims, and focused scripts are productive
- Required evidence: reproduce or validate 10/10 parity and p95 1150→53 ms, identify fixture/trace limits, and separate measured evidence from human-gated readiness

Review verdict: CONDITIONAL
