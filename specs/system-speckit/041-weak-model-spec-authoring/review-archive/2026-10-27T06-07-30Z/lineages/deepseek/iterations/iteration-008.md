# Iteration 8: Correctness - adversarial documents against the versioned gate

## Dimension

Correctness. The placeholder gate's behavior on documents a weak model could plausibly produce: a line that mixes an inline example token with a real one, a second Status row, a stamp below the read window, CRLF input, and a lazy addon document.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:660-762`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:100-205`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/status-classifier.sh:68-82`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-status-cross-doc-consistency.sh:25-70`
- `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json:1-140` (level rows and lazy addons)
- `.skilled/skills/system-spec-kit/templates/addons/handover.md.tmpl` (23 tokens)
- `.skilled/skills/system-spec-kit/runtime/lib/templates/level-contract-resolver.ts:80-130,220-270`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **A line whose first token is inline code hides a later unfilled token in both implementations** -- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:734` -- The orchestrator calls `PLACEHOLDER_MARKER_RE.exec(line)` once, and when the first match is preceded by a backtick it returns for the whole line; the shell mirror pipes the line through `grep -v '`\[YOUR_VALUE_HERE:'`, which drops the line whenever any backticked token appears, then reports at most one hit per line. A document line such as ``Use `[YOUR_VALUE_HERE: name]` as the pattern, then write [YOUR_VALUE_HERE: the real name]`` therefore passes both implementations, and a Complete packet can ship an unfilled token. The same one-match limit means a line with two real tokens is reported once, which undercounts but still fails; the hidden-token case is the one that changes the verdict.
   Finding class: gate-false-negative
   Scope proof: both implementations' line loops were read end to end; the regex has no `g` flag and the shell reports one line number per matching line.
   Affected surface hints: orchestrator placeholder rule, shell mirror, authoring card's inline-code guidance
   Case: a model documents the token form with an inline example and leaves a real token later on the same line; `validate.sh --strict` prints `RESULT: PASSED`.

```json
{
  "type": "claim-adjudication",
  "findingId": "R8-P1-001",
  "claim": "Both placeholder implementations inspect only the first token position on a line, so an inline-code example token hides a later unfilled token.",
  "evidenceRefs": [
    ".skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:734-739",
    ".skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:134-136"
  ],
  "counterevidenceSought": "Checked for a second pass over matches (none; no g flag and no matchAll in the loop), checked whether the shell re-scans the cleaned line (it does not for Pattern 1), and checked whether another rule flags a value token (none; only the placeholder rule owns it).",
  "alternativeExplanation": "The gate is deliberately line-level, so one hit per line is a counting choice rather than a miss. Rejected because the hit is suppressed by an inline-code match earlier on the same line, which removes the line from the check rather than counting it once.",
  "finalSeverity": "P1",
  "confidence": 0.72,
  "downgradeTrigger": "Downgrade to P2 if the gate is documented as first-match-per-line and the authoring card forbids example tokens outside fenced blocks.",
  "transitions": [{ "iteration": 8, "from": null, "to": "P1", "reason": "Initial discovery" }]
}
```

### P2 Findings

1. **Only the first Status row decides Draft, so a later Complete claim is invisible to every status rule** -- `.skilled/skills/system-spec-kit/runtime/cli/lib/status-classifier.sh:68` -- `extract_status_table_value` prints the first row whose second cell is `status` and exits, and the orchestrator's `specStatusIsDraft` returns on the first such row. The cross-doc rule compares that same first row between `spec.md` and `implementation-summary.md`, so a packet that carries `| Status | Draft |` in an early table and a later `| Status | Complete |` row is treated as Draft everywhere: unfilled tokens warn, strict passes, and a reader who sees the later row believes the packet is complete.
   Finding class: status-ambiguity
   Scope proof: both readers and the cross-doc rule were read; each stops at the first Status row.
   Affected surface hints: status classifier, placeholder gate, status cross-doc rule
   Case: a model copies a Draft status table above its metadata table and later marks the packet Complete in a summary table; validation reports Draft behavior and no rule objects.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `orchestrator.ts:734-739`; `check-placeholders.sh:134-136`; `status-classifier.sh:68-82` | The four lifecycle cells hold; two adversarial shapes are missed. |
| `checklist_evidence` | partial | hard | 84 AC rows | One stale closure note from iteration 6. |
| `skill_agent` | partial | advisory | `spec-authoring-card.md:18` | Same dangling guide pointer. |
| `agent_cross_runtime` | pending | advisory | - | Audited later. |
| `feature_catalog_code` | fail | advisory | `spec-authoring-card.md:30`; `versioned-placeholder-gate.md:36` | Two leaves misstate their code. |
| `playbook_capability` | fail | advisory | scenarios 479 and 482 | Tool lists and guard behavior wording. |

## Edge Cases

- The doc-set parity gap reported as R1-P2-001 is wider than its first citation: `handover.md`, `debug-delegation.md`, `before-after.md`, `timeline.md`, `roadmap.md` and `resource-map.md` are all `lazyAddonDocs` that the orchestrator scans and the shell mirror never opens. `handover.md.tmpl` alone holds 23 value tokens, so a stamped handover token errors in the orchestrator and is invisible to the mirror.
- A stamp below line 70 makes the doc legacy, which errors on tokens at any status; that is stricter, not a bypass.
- CRLF input is handled: both stamp readers split on `\r?\n` and the regexes tolerate trailing whitespace.
- A lowercase `[your_value_here:` is not a marker by design (the canonical shell markers are case-sensitive), so it is not reported.
- The gate's per-line count underreports multiple tokens on one line but still fails the document, so only the hidden-token case changes a verdict.

## Confirmed-Clean Surfaces

- The four lifecycle cells (v2.3 Draft, v2.3 non-Draft, older stamp, open question) behave as phase 003 claims in both implementations.
- A token inside a fenced block is skipped by the orchestrator, and the shell skips column-0 fences; the indented-fence difference is already part of R1-P2-001.
- The status readers normalize bold marks, backticks, quotes, case and trailing punctuation identically.
- `handover.md` is in the level contract's lazy addons and is scanned when present, so the 23 tokens in its template are not an unscanned surface.

## Ruled Out

- A stamp-window bypass: ruled out; a stamp past line 70 makes the doc stricter, not weaker.
- A CRLF bypass: ruled out; both readers handle CRLF.
- A lowercase-token bypass: ruled out by design, not a defect.

## Next Focus

Iteration 9 - traceability - command and agent alignment: every speckit and doctor command plus every doc-authoring agent checked for the card, the v2.3 token rule and the guard scripts where it describes authoring, against phase 006's audit table.

Review verdict: CONDITIONAL
