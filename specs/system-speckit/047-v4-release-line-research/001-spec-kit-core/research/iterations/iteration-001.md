# Iteration 1 — Gate 3 Classifier Parity and validate.sh Rule Inventory

## Focus

Key questions 1 and 2:

1. Does the Gate 3 classifier classify the same prompts as the Gate 3 text in `AGENTS.md` and the v4.0.0.1 note section "The Gate That Asks Once", and which prompt does it misclassify?
2. Which validate.sh rules named in the v4.0.0.0 and v4.0.0.5 notes exist in `runtime/cli/rules` and the validation orchestrator, and does any rule pass on a packet it should fail?

## Actions Taken

1. Read `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts` in full (911 lines).
2. Read the Gate 3 section of `AGENTS.md` (lines 74–86) and the v4.0.0.1 note section "The Gate That Asks Once" (from line 87).
3. Ran `classifyPrompt` on seven prompts that mix read-only and write words, using `bun` because no `tsx` or `ts-node` binary was installed. Exact command:

   ```bash
   bun -e '
   import { classifyPrompt } from "/Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts";
   const prompts = [
     "Update the README and review the result.",
     "Create a review checklist for the release.",
     "Review the parser and fix the crash.",
     "Analyze the trigger index and report what is stale.",
     "Explain how create.sh works.",
     "Do not change the docs; just explain them.",
     "Inspect the build output, then update the config."
   ];
   for (const p of prompts) {
     const r = classifyPrompt(p);
     console.log(JSON.stringify({ prompt: p, gate: r.triggersGate3, reason: r.reason,
       write: r.matched.filter(m => m.category === "file_write").map(m => m.pattern),
       ro: r.readOnlyMatched.map(m => m.pattern) }));
   }'
   ```

4. Listed `.skilled/skills/system-spec-kit/runtime/cli/rules/` and read `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json`.
5. Grepped `runtime/cli` for `SCOPE_ADHERENCE`, `SYSTEM_SCOPE_CHANGED_FILES` and `scope.adherence`.
6. Read the v4.0.0.0 note (rule-count and scope-adherence claims) and the v4.0.0.5 note (named checks and nested-anchor change).

## Findings

### F1 — A trailing read-only token suppresses Gate 3 on a write prompt (P1, bug, v4.0.0.1)

Seven prompts were classified. Five match the prose; two do not:

| Prompt | Expected | Result | Reason |
|---|---|---|---|
| `Update the README and review the result.` | gate | **no gate** | `read_only_override` (write `update`, read-only `review`) |
| `Create a review checklist for the release.` | gate | **no gate** | `read_only_override` (write `create`, read-only `review`) |
| `Review the parser and fix the crash.` | gate | gate | `file_write_match` |
| `Analyze the trigger index and report what is stale.` | no gate | no gate | `no_match` |
| `Explain how create.sh works.` | no gate | no gate | `read_only_override` |
| `Do not change the docs; just explain them.` | no gate | no gate | `read_only_override` (negation) |
| `Inspect the build output, then update the config.` | gate | gate | `file_write_match` |

`AGENTS.md` says: "A read-only word next to a write trigger does not disqualify it." [SOURCE: AGENTS.md:75] The classifier implements the opposite for a read-only token that follows the write verb.

Root cause: `hasMixedWriteTail()` only rescues a write trigger that appears *after* the read-only token — `if (writeIndex <= readIndex) continue;` [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:731] — and the file-write branch then suppresses the gate whenever any disqualifier matched and no mixed tail was found [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:849]. A trailing `review`, `audit`, `inspect`, `analyze` or `explain` therefore overrides a leading `update`, `create`, `add` or `fix`.

Impact: an operator or AI user asking to change a file can be sent down an unscoped write path with no spec-folder question, which is the failure Gate 3 exists to prevent. The prose in the runtime docs is the contract; the machine contract diverges on the most common English ordering ("update X and review it").

Verify:

```bash
bun -e "import { classifyPrompt } from './.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts'; console.log(classifyPrompt('Create a review checklist for the release.'))"
```

Confidence: high (reproduced). Release attribution: v4.0.0.1, the release whose note defines the gate contract [SOURCE: .skilled/changelog/skilled/v4.0.0.1.md:87]; `git blame` was not run this iteration, so the introducing commit is not yet pinned.

### F2 — The v4.0.0.0 scope-adherence check has no validator-registry entry (P1, drift, v4.0.0.0)

The v4.0.0.0 note says the completion gate "grew two checks of its own. Scope adherence refuses a packet whose changed files fall outside what its spec names, driven by `SYSTEM_SCOPE_CHANGED_FILES` and `SYSTEM_SCOPE_BASE`. Acceptance coverage runs on by default as an advisory." [SOURCE: .skilled/changelog/skilled/v4.0.0.0.md:93]

`validator-registry.json` lists 42 rules; none is `SCOPE_ADHERENCE` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json]. The acceptance-coverage claim is true — `AC_COVERAGE` is present with `severity: "info"` and `SPECKIT_AC_COVERAGE*` flags. A grep of `runtime/cli` for `SCOPE_ADHERENCE`, `SYSTEM_SCOPE_CHANGED_FILES` and `scope.adherence` finds only a phrase-variant fixture (`retrieval/fixtures/phrase-variants.json:98207`), not an implementation.

Either the scope-adherence check lives outside the audited surface (for example in a hook or a completion gate that does not resolve through this registry), or the note describes a check that validate.sh does not run. The note places it beside acceptance coverage, which *is* a registry rule, so a reader reasonably expects it in the same list. This is drift between release note and rule registry, with a validation gap if the check is genuinely absent.

Verify:

```bash
rg -n 'SCOPE_ADHERENCE|SYSTEM_SCOPE_CHANGED_FILES' .skilled/skills/system-spec-kit/runtime/cli
```

Confidence: medium — the registry is authoritative for validate.sh, but the grep covered only `runtime/cli`.

### F3 — The disqualifier comment contradicts the suppression logic (P2, drift, v4.0.0.1)

The `READ_ONLY_DISQUALIFIERS` comment says these tokens "when present WITHOUT a corresponding file-write / memory-save / resume trigger, mark the request as read-only" [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:232]. The implementation does not test absence of a write trigger; it suppresses whenever a disqualifier matched and `hasMixedWriteTail()` is false [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:850]. The code and its own rationale disagree, which is how F1 survived review.

Verify: the F1 command, or read lines 232–239 against 849–855.

Confidence: high.

### Rule inventory (question 2, partial)

| Named in note | Release | Registry entry | Status |
|---|---|---|---|
| "Forty rules are registered" | v4.0.0.0 [SOURCE: .skilled/changelog/skilled/v4.0.0.0.md:91] | 42 `rule_id` entries today | Count differs; two TS rules (`CONTINUITY_FRESHNESS`, `GENERATED_METADATA_DRIFT`) may have arrived after v4.0.0.0. Not treated as a finding because the note is historical. |
| Scope adherence | v4.0.0.0 | none | F2 |
| Acceptance coverage | v4.0.0.0 | `AC_COVERAGE` | Present, advisory (`info`), default-on. |
| `ANCHORS_VALID` (nested anchors) | v4.0.0.5 [SOURCE: .skilled/changelog/skilled/v4.0.0.5.md:37] | `ANCHORS_VALID` | Present as `native:orchestrator`; nested-anchor errors match the note. |
| Trigger-phrase checker | v4.0.0.5 | `GREP_CONVENTION` | Present, `error`. |
| `METADATA_DISK_PATH_CONSISTENCY` | v4.0.0.5 | `METADATA_DISK_PATH_CONSISTENCY` | Present, `error`, though its own description calls it "advisory-by-default" — a registry self-contradiction worth a later check. |

All 33 shell scripts in `runtime/cli/rules/` have a registry row; the remaining 9 rules are 1 native orchestrator rule, 5 `ts:spec-doc-structure` rules and 3 `validation/*.ts` rules. No orphan shell rule script was found.

## Questions Answered

- "Does the Gate 3 classifier in .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts classify the same prompts as the Gate 3 text in AGENTS.md and the v4.0.0.1 note section The Gate That Asks Once, and which prompt does it misclassify?" — No. It misclassifies any write prompt whose read-only word follows the write verb; the two reproduced cases are "Update the README and review the result." and "Create a review checklist for the release."

## Questions Remaining

- Question 2 is only half answered: the inventory is compared, but no packet with a known defect was run through `validate.sh --strict` to prove a rule does not pass when it should fail.
- Questions 3–12 remain untouched: trigger index and retrieval, continuity save/resume routing, goal budget, upgrade preview/rollback, create.sh and level templates, v4.0.0.13–v4.0.2.0 doc drift, dead scripts, operator friction, sk-code/sk-doc conformance, extensions.

## Next Focus

Iteration 2: close question 2 by reading the validate.sh orchestrator and severity-ceiling logic, then run `validate.sh --strict` read-only against one fixture packet with a known defect (missing acceptance row or nested anchor) and record the exit code. Also test the untested over-trigger hypothesis: "What does the build do?" and "What does create.sh do?" match the generic `build`/`create` tokens with no read-only disqualifier and should not ask Gate 3. If budget remains, start question 3 (trigger index rebuild/staleness/exit codes).

## SCOPE VIOLATIONS

None. No repository file outside the two allowed artifacts was written. The gateway consumes a one-line event file under `/tmp`, as the output contract requires.
