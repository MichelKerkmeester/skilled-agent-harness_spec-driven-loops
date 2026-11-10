---
title: "Baseline before protocol-site retirement"
trigger_phrases: []
---
# Baseline before protocol-site retirement

Captured before any edit, so the delta is measurable.

## Why this work is unblocked

The deferral reason recorded against CHK-010 — "Removing them before the flip
would leave agents with no sanctioned write path" — is false. The gateway is a
working pre-flip write path:

`tests/unit/mode-append-gateway.vitest.ts:38` fixes `FIXTURE_AUTHORITY` at
`{ state: 'legacy_authoritative', epoch: 1 }`, and the test at line 387,
"projection success: projects legacy JSONL state file when appending
deep-research event", asserts `projectionRefreshed === true`. The suite passes
11/11. So under legacy authority the gateway accepts the append *and* projects
it into the same legacy file the direct-append instruction wrote, which is the
file every consumer still reads.

## Contract test baseline (already red)

`Test Files 2 failed | 2 passed (4)`, `Tests 5 failed | 71 passed (76)`.

Failing before any edit:

- `render-command-contract` renders fix BODY ... for `deep/ai-council`
- `render-command-contract` renders fix BODY ... for `deep/review`
- `render-command-contract` renders fix BODY ... for `deep/research`
- `render-command-contract` resolves the default rollout mode through the shared resolver
- `check-contract-drift` passes against the real current compiled contracts

## Contract drift baseline: 10 entries

| command | source |
|---------|--------|
| deep/ai-council | `.opencode/skills/system-deep-loop/SKILL.md` |
| deep/alignment | `.opencode/agents/deep-alignment.md` |
| deep/alignment | `.opencode/skills/system-deep-loop/SKILL.md` |
| deep/research | `.opencode/commands/deep/assets/deep-research-auto.yaml` |
| deep/research | `.opencode/commands/deep/assets/deep-research-confirm.yaml` |
| deep/research | `.opencode/skills/system-deep-loop/deep-research/SKILL.md` |
| deep/research | `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` |
| deep/review | `.opencode/agents/deep-review.md` |
| deep/review | `.opencode/skills/system-deep-loop/SKILL.md` |
| deep/review | `.opencode/skills/system-deep-loop/deep-review/SKILL.md` |

Note the two `deep-research-*.yaml` rows: the phase that added their
`state_write_protocol` block left drift behind and did not recompile. That is
the established precedent, and it is why `check-contract-drift`'s "real current
compiled contracts" test is already failing.

## Mode tokens confirmed routable

Each target file's mode resolves to an adapter and reaches event validation
rather than an authority denial: `research`, `review`, `ai-council`,
`agent-improvement`, `model-benchmark`.

---

# Result

## What was built

Eight command-asset YAML files gained a top-level `state_write_protocol` block
naming the append gateway as the sanctioned mechanism: the two review, two
ai-council, two model-benchmark and two agent-improvement assets. `+204` lines,
zero deletions, no file outside those eight touched. Each `--mode` token was
verified routable before the edit.

Implemented by GLM 5.2 High via cli-devin. Its `code`-profile subagent dispatch
failed on an exhausted daily quota, so it did the work directly — a deviation
from the dispatch instruction, recorded here rather than hidden.

## Gate delta

| Gate | Baseline | After | Δ |
|------|----------|-------|---|
| Contract tests | 5 failed / 71 passed | 5 failed / 71 passed | 0 |
| Contract drift entries | 10 | 14 | +4 |
| `mode-append-gateway` suite | 11/11 | 11/11 | 0 |

The 4 new drift entries are the review and ai-council YAMLs. They were not
reconciled: recompiling those two commands would also re-record the digests of
unrelated sources that other work left stale (`SKILL.md`, `agents/*.md`), so a
scoped reconciliation is not available and absorbing them here would make this
change claim authorship of work it did not do. The same state already existed
for the two deep-research assets from an earlier phase.

## Adversarial verification found a real defect

DeepSeek V4 Flash was dispatched read-free to refute the change. It returned
REFUTED, and two of its five points were correct.

**Its strongest point was right.** The block asserted "Every canonical record
named by an append directive below is written by invoking the command above",
while the same two review files still contain a literal
`printf ... >> {state_paths.state_log}` inside a one-shot legacy-migration
command (`deep-review-auto.yaml:284`, `deep-review-confirm.yaml:249`). The
document I had just added made a claim the file itself violated. Fixed: those
two blocks now carry a `migration_exception` key and a closing paragraph naming
the exception and why it exists. The shell append itself was left untouched.

**Its point about weak evidence was also right.** "Delta zero on an already-red
gate" shows no regression but cannot show the change is correct. Stated plainly
rather than dressed up.

**One point overstated.** It argued unreconciled drift lets a contract "certify
a file it never saw" undetected. Drift is detected — `check-contract-drift`
reports all 14 entries, and the already-failing "passes against the real current
compiled contracts" test is that detector firing. The disagreement is visible,
not silent.

## CHK-010 remains unmet, deliberately

REQ-001 is "no mode's protocol documents instruct a direct append", and CHK-010
tests it by tree-wide search. Two literal shell appends survive by design, so a
tree-wide search still finds direct-append instructions. Claiming CHK-010 on the
strength of the added blocks would be claiming it on a technicality.

What advanced: eight of the ten mode-facing command assets now name the gateway
as the sanctioned mechanism for every canonical record, and the two exceptions
are documented where a reader will meet them.

What is still owed: converting or retiring the two migration appends, and an
enforceable check. A natural-language block is advisory — nothing fails when it
is ignored. The reviewer's suggestion of a scanner that fails any append
directive not routed through the gateway is the right shape for that, and it is
not built here.
