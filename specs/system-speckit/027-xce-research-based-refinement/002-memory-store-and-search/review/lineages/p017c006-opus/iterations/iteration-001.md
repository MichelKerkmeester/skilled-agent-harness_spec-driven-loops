# Iteration 1: Full-dimension sweep (correctness, security, traceability, maintainability)

## Focus

Single converging iteration (maxIterations=1) over phase 006 `command-contract-structural`. The shipped deliverables (per `implementation-summary.md` and commit `eac1eb5ef8`) are:

1. `§0 ARGUMENT RESOLUTION` deterministic shell header in `.opencode/commands/memory/search.md` (computes `ARGS_PRESENT` + joined `QUERY`).
2. Salience inversion: section order `RETRIEVAL (§3) → ANALYSIS (§4) → STARTUP (§5)`.
3. Imperative no-ask guard bound to `ARGS_PRESENT`/`QUERY`, plus an arg-echo equality rule.
4. Presentation `§1 Startup Question Policy` gated behind `ARGS_PRESENT=false` in `.opencode/commands/memory/assets/search_presentation.txt`.

Scope note: the working tree also carries phase 007/O2 surface-parity content (score-mandate, surface-parity clause, named optional fields). That content is **out of scope** for this review (it is owned by 007-output-surface-parity) and was excluded from finding evaluation; only the O1/006 deliverables above were audited.

Files reviewed:
- `.opencode/commands/memory/search.md` (focus: §0 header, §2 execution order, §3/§4/§5 gating, §6 hard rules)
- `.opencode/commands/memory/assets/search_presentation.txt` (focus: §1 gating)
- `006-command-contract-structural/{spec.md, plan.md, tasks.md, implementation-summary.md, description.json, graph-metadata.json}`

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 8
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P1, Required

- **F001**: Raw `$ARGUMENTS` is exposed to the outer shell before the protective `bash -c`, so glob and shell-active characters corrupt or escape the intended join — `.opencode/commands/memory/search.md:17`.

  The header is:
  ```
  !`bash -c 'if [ "$#" -gt 0 ]; then q="$*"; q="${q//\"/\\\"}"; printf "ARGS_PRESENT=true\nQUERY=\"%s\"\n" "$q"; else printf "ARGS_PRESENT=false\nQUERY=\"\"\n"; fi' -- $ARGUMENTS`
  ```
  The `bash -c '…' --` wrapper only protects expansion **inside** the wrapped script. The trailing `$ARGUMENTS` is substituted as raw text into the **outer** shell command line and undergoes the outer shell's full expansion phase *before* `bash -c` ever runs. The implementation-summary (`implementation-summary.md:66`, decision row at `:100`) explicitly acknowledges one consequence of this — word-splitting like `"$@"` — and the join via `"$*"` correctly fixes *that* facet. But word-splitting, pathname (glob) expansion, command substitution, and metacharacter parsing all happen in the **same** outer-shell phase, so the fix addresses only one of several siblings from a single root cause:
  - **Glob expansion (correctness):** a query containing `*`, `?`, or `[...]` — e.g. `find *.md handlers` — is pathname-expanded by the outer shell against the current working directory before the join. `QUERY` then depends on CWD filesystem contents, directly contradicting the header's "deterministic … ground truth for this invocation" claim (`search.md:13`). With `nullglob` unset (default), an unmatched pattern survives literally, making the corruption intermittent rather than total — strictly worse for debuggability.
  - **Command substitution / metacharacters (security + correctness):** `$(…)`, backticks, `;`, `|`, `&`, `>` in the query are interpreted by the outer shell. A query like `what is $(…) doing` executes the substitution and injects its output into `QUERY`; a `;` terminates the header command and runs the remainder as a separate outer-shell statement. This is a genuine shell-injection sink. The threat model is mitigated — the input source is the operator typing their own `/memory:search` query (self → self), not an external attacker — which is why this is rated P1 rather than P0. But it is still an exploitable/foot-gun sink on a shell-execution surface, and it breaks benign queries that merely happen to contain `(`, `$`, `;`, or a glob char.
  - **Arg-echo rule does not catch it:** the `§3` arg-echo equality rule (`search.md:72`) says the echoed query MUST equal the resolved `QUERY`. Because the corruption happens upstream of `QUERY`, the echo faithfully equals the *already-corrupted* value, so the self-correction loop cannot detect it.

  This is a single finding (one root cause: unquoted outer-shell exposure of `$ARGUMENTS`), with correctness and security facets.

### P2, Suggestion

- **F002**: `spec.md`, `plan.md`, and `tasks.md` remain unpopulated scaffolds whose continuity metadata contradicts the completed implementation — `006-command-contract-structural/spec.md:43-58` (METADATA/scope still placeholders, `Status` row unfilled), `plan.md:12-27`, `tasks.md:11-26`. All three carry `_memory.continuity` blocks with `packet_pointer: "scaffold/006-command-contract-structural"`, `last_updated_by: "template-author"`, `completion_pct: 0`, and a zeroed `session_dedup.fingerprint`, while `implementation-summary.md:27` reports `completion_pct: 100` and `006-command-contract-structural/implementation-summary.md:46` records `Completed | 2026-06-17`. For a Level 1 packet the implementation-summary is the authoritative resume-ladder source and is accurate, so this does not block the work; but the spec/plan/tasks contradiction means there are no populated requirements (`REQ-001 = [Requirement description]`) to trace shipped behavior against, and the stale completion fields are a completion-metadata inconsistency under the COMPLETION VERIFICATION discipline. dimension: traceability.

- **F003**: First-token analysis-subcommand routing can hijack legitimate retrieval queries — `.opencode/commands/memory/search.md:91` and `:21`. `§4` routes to analysis mode "when the first token of `QUERY` is one of the analysis subcommands" (`history`, `causal`, `link`, `dashboard`, …). A bona-fide retrieval query such as `history of auth decisions` has first token `history`, so it would route to `memory_get_learning_history` with `specFolder="of"` instead of a semantic search. O1 restructured (moved) this routing block but did not change its semantics, so this is a pre-existing latent ambiguity surfaced by the review rather than a defect introduced by 006; recorded as advisory. dimension: correctness.

## Claim Adjudication

```json
{
  "findingId": "F001",
  "claim": "The trailing unquoted `$ARGUMENTS` in the §0 header is expanded by the outer shell before `bash -c` runs, so glob expansion, command substitution, and shell metacharacters corrupt the resolved QUERY and constitute an injection sink — the `bash -c` wrapper protects only the inner join, not the outer substitution.",
  "evidenceRefs": [
    ".opencode/commands/memory/search.md:17",
    ".opencode/commands/memory/search.md:13",
    ".opencode/commands/memory/search.md:72",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/006-command-contract-structural/implementation-summary.md:66"
  ],
  "counterevidenceSought": "Inspected line 17 for any quoting of $ARGUMENTS or a `set -f`/noglob guard before the wrapper — none present; the token is `-- $ARGUMENTS` unquoted at end of line. Checked the implementation-summary's verification section (lines 111-149) and decision rows for any glob/metachar handling — only the word-split caveat (#7) is addressed; glob and command-substitution are unmentioned. The impl-summary itself (line 66) confirms $ARGUMENTS 'expands one word per argument' i.e. raw outer-shell expansion with no harness shell-quoting.",
  "alternativeExplanation": "The OpenCode/Claude command renderer might shell-quote $ARGUMENTS as a single safe token before substitution, which would neutralize all outer-shell expansion. Rejected: the impl-summary explicitly documents word-split behavior ('expands like \"$@\", one word per argument'), which is only possible if the substitution is raw/unquoted — the same mechanism that admits glob and command substitution.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "If the command renderer is confirmed to shell-quote $ARGUMENTS into a single token (or the header is changed to set `-f`/noglob and read args via a quoted sentinel), the corruption/injection path closes and this downgrades to P2 documentation/defense-in-depth.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery; word-split fixed but sibling outer-shell expansions (glob, command-substitution, metacharacters) from the same root cause remain" }
  ]
}
```

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:114-128 (placeholder REQ rows); search.md:17, :116-120 | spec.md carries no populated normative requirements, so claims cannot be traced to it. Shipped behavior was instead traced against implementation-summary.md (accurate) and the commit diff. Partial: the implementation matches its own documented intent, but the spec doc provides no requirement anchors. |
| checklist_evidence | n/a | hard | — | Level 1 packet; no `checklist.md` required or present. Marked N/A. |
| feature_catalog_code | n/a | advisory | — | No feature-catalog claim ties to this command-contract edit in scope. |
| playbook_capability | n/a | advisory | — | No playbook scenario in scope for this packet. |

## Assessment
- New findings ratio: 1.0 (first and only iteration; all findings new)
- Dimensions addressed: correctness (F001 facet, F003), security (F001 facet), traceability (F002, spec_code), maintainability (F002)
- Novelty justification: full-breadth single pass; one P1 root-cause sink + two P2 advisories. No P0.

## Ruled Out
- Salience-inversion / no-ask gating logic: checked §0 → §2 → §3/§4/§5 and presentation §1 for consistency; control flow is coherent and the `ARGS_PRESENT=false` gate is applied consistently in both files. No finding — the structural fix is sound.
- `"$*"` join collapsing repeated internal spaces: cosmetic only, does not affect retrieval semantics. Not a finding.
- Double-quote escaping `${q//\"/\\\"}`: correct for the inner printf; `printf "%s"` does not re-interpret backslashes in the argument. No finding.

## Dead Ends
- Live execute-rate A/B on Kimi/MiMo: cannot run in a read-only review context (and is the packet's own documented follow-up). Not pursued.

## Recommended Next Focus
If a follow-up loop runs: confirm the command-renderer's `$ARGUMENTS` substitution semantics (quoted vs raw) to lock F001 severity, and decide whether F002 (populate spec/plan/tasks + refresh continuity) is in-scope cleanup for 006 or deferred to a metadata sweep.

Review verdict: CONDITIONAL
