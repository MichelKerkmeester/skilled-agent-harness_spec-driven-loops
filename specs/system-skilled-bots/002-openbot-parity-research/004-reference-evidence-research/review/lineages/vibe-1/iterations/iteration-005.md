# Review Iteration 5

## Dispatcher

- Lineage: `vibe-1`, iteration 5 of 10, mode `review`, target agent `deep-review`, agent definition loaded.
- Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Artifact directory: `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/review/lineages/vibe-1`
- `steer.md`: absent at dispatch time. No lead ruling was available for this iteration.
- Review target: `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/` (read-only).

PRE-BOUND SETUP ANSWERS, emitted as bindings:

```
BINDING: target=specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research
BINDING: maxIterations=10
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,traceability,security,maintainability
BINDING: specFolder=specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research
```

## Files Reviewed

| File | Lines read | Why |
|---|---|---|
| `research/research.md` | 32-63 (section 2), 121-149 (003), 529-578 (section 7), 645-666 (section 9), 705-730 (section 12), 731-749 (sections 13 and 14) | The document's self-description: the bottom line, the overlap accounting, the citation check, the open questions and the convergence report |
| `research/research.md` | whole file, scripted | Table-heading census, absence-claim census, bare-form citation resolution, inference census |
| `research/deep-research-config.json` | whole file | `convergenceThreshold`, `stopPolicy`, `maxIterations` |
| `research/001-openbot-parity-research/research/research.md` | line count | Resolving the bare `S1:` citations |
| `research/002-plan-review-research/research/research.md` | line count | Resolving the bare `S2:` citations |
| `research/003-plan-depth-research/research/research.md` | line count | Resolving the bare `S3:` citations |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R2-P1-001` remains active and is carried forward unchanged.

### P2 Findings

1. **Section 2's inventory of inference-based claims names three, and at least four more rows say a claim is inferred** -- `research/research.md:62` -- Section 2 closes with "Three claims rest on inference and say so in their rows: that models skip a skill under the current label, that the bots CLI dies on a closed pipe and that a shared memory can leak a private fact into a wider chat". Four more rows in the same document say a claim is inferred: the 004 differences row 1 says "Inferred, not cited: this runtime dispatches external CLI executors whose tool lists it does not author" [SOURCE: research/research.md:164]; the 006 differences row 3 says "'Refuse instead of park' is the lineage's inference, not a reference line" [SOURCE: research/research.md:219]; the 008 pitfall 2 row says "JSON escaping of a value that holds a quote or a backslash is the next form to name, by inference and not from a reference line" [SOURCE: research/research.md:278]; and the 010 pitfall 1 row says "Inferred from REQ-005 and from how a terminal delivers a paste without bracketed-paste mode" [SOURCE: research/research.md:336]. The inventory matters more than its size: it is the reader's only signal for which rows to re-check before acting, and section 2 presents it as complete. The 010 case is the sharpest, because section 2's own guard 1 states that row's consequence as fact at `:47` while the row calls it an inference.
   Finding class: `self-description`
   Scope proof: the finding is inside the declared review target (`research/research.md:62`) and cites four rows of the same document. No file outside the target was modified.
   Affected surface hints: `research/research.md:62` (the inventory), `:47` (guard 1), `:164`, `:219`, `:278`, `:336`.
   Case: a builder reads section 2, sees three inference-based claims, and treats every other row as line-verified. They then act on the 004 placement row, whose reason for preferring the plan's side is an uncited inference about how this runtime dispatches executors.

2. **The 010 paste row calls its mechanism an inference when the 003 row in the same document establishes it with two citations** -- `research/research.md:336` -- The 010 pitfall 1 row says the three-runs consequence is "Inferred from REQ-005 and from how a terminal delivers a paste without bracketed-paste mode". The 003 pitfall 1 row already establishes that mechanism from the crate's own source: crossterm 0.29.0, the version the plan pins, emits `Event::Paste` only when bracketed paste is enabled, and maps a carriage-return byte to `KeyCode::Enter` [SOURCE: research/research.md:142]. So the 010 row's mechanism is line-supported by evidence the document already holds, and the row understates its own grade. The fix is a cross-reference, not new research: cite `research.md:142` and drop the "Inferred" label, or state the crossterm lines directly. This is the inverse of the usual defect — the document is less certain than its evidence — and it costs the reader a re-check they do not need.
   Finding class: `understated-evidence`
   Scope proof: the finding is inside the declared review target (`research/research.md:336`) and cites a row of the same document. No file outside the target was modified.
   Affected surface hints: `research/research.md:336` (the 010 row), `:142` (the 003 row that carries the mechanism), `:47` (section 2's guard 1, which states the consequence as fact).
   Case: a reviewer triages the 010 row as an inference, spends a pass confirming the crossterm behaviour, and finds the document already recorded it three sections earlier. A reader who trusts the label instead drops the row.

3. **Section 2's guard 3 repeats the incomplete encoded-forms list, so the gap appears in two places** -- `research/research.md:49` -- This refines `R4-P2-001`. Section 2's guard 3 says "the leak scan misses base64 without padding, URL-safe base64 and the lowercase hex form the vault itself stores", which is the same three-item list as the 008 pitfall 2 guard at `:278`. The reference function returns eight forms, and `percent_lower` and `form` are unnamed in both places [SOURCE: C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/patterns.rs:248-280]. A fix that edits only the phase row leaves the bottom line still naming three, and the bottom line is what a reader who stops after section 2 acts on.
   Finding class: `incomplete-recommendation`
   Scope proof: the finding is inside the declared review target (`research/research.md:49`) and cites the reference function the row cites. No file outside the target was modified.
   Affected surface hints: `research/research.md:49` (section 2 guard 3), `:278` (the 008 pitfall 2 row), `B/008-vault/design/leak-checks.md` section 2.
   Case: a builder reads only section 2, adds the three named forms, and ships a scan that still misses a form-urlencoded copy of a value holding a space.

## Traceability Checks

| # | Check | Result |
|---|---|---|
| 1 | Section 9's hand-check list holds the number of citations it claims | Pass. The list holds exactly 20 entries, and the sentence says "Twenty citations" |
| 2 | Section 9's tag counts for the final files | Pass. 616 in `research.md` and 331 in `regrade-log.md`, 947 total, all resolving; verified in an earlier iteration and not re-derived here |
| 3 | Section 13's question arithmetic reconciles with section 12's table | Pass. 4 registry-resolved plus 4 answered in the table plus 3 partly plus 5 open is 16, and 13 registry questions plus 3 pruned nodes is 16 |
| 4 | Section 13's convergence threshold matches the run's config | Pass. `deep-research-config.json` sets `convergenceThreshold` to 0.05 and `stopPolicy` to `max-iterations` |
| 5 | Every phase section carries all three table headings | Pass. All 14 sections carry "Reference code to lift or mirror", "Where the plan differs from the references" and "Pitfalls the plan does not guard against" |
| 6 | No table says "No row" while holding rows, and none is silently empty | Pass. Seven tables say "No row" and each holds zero rows; no table is empty without saying so |
| 7 | Section 7's bare-form citations resolve | Pass. 11 bare `S1:`/`S2:`/`S3:` citations, 10 of them in section 7, all inside the target file's line count |
| 8 | Section 7's overlap entries match section 3's "New here" claims | Pass for the sampled phases 002, 004 and 006: each carried item is cited and each new item appears in section 3 |
| 9 | Section 2's inference inventory is complete | **Fail.** Four more rows say a claim is inferred. Reported as finding 1 |
| 10 | A row that labels its mechanism an inference has no line-supported source in the document | **Fail.** The 010 row's mechanism is established at `:142`. Reported as finding 2 |

## Integration Evidence

- `research/deep-research-config.json` is the run's own config and is the surface section 13's threshold and stop-reason claims depend on. Read, not modified.
- `research/001-openbot-parity-research/research/research.md`, `research/002-plan-review-research/research/research.md` and `research/003-plan-depth-research/research/research.md` are the S1, S2 and S3 surfaces section 7 cites. Read for line counts only, not modified.
- `research/research.md` sections 2, 7, 9, 12, 13 and 14 are the self-description surfaces this iteration reviewed.

No command, workflow, skill, MCP tool, caller agent or runtime mirror was modified. The append gateway and the reducer were run as the workflow runs them.

## Edge Cases

- **"Three claims rest on inference" could be read narrowly.** A defender could say the three are the claims where the finding itself rests on inference, and that the other four are inferences about why the plan's side wins or about a secondary recommendation. Adjudicated against that reading for the 010 row, because its inference is about the finding's consequence and section 2 states that consequence as fact at `:47`. Kept at P2 because the other three are genuinely secondary.
- **The 010 row's inference is correct.** The finding is about the missing cross-reference, not about the claim. Nothing in it says the three-runs consequence is wrong.
- **Finding 3 is a second location, not a second defect.** It is recorded with `refines: R4-P2-001` and counts at half weight, because a fix to the phase row and a fix to the bottom line are the same edit applied twice.
- **The bare `S1:133` citation form is not a broken citation.** All 11 resolve in range. It is a formatting inconsistency confined to the 003 and 004 blocks of section 7, and it is not reported as a finding because the prefix table in section 1 makes the form readable and no citation fails.
- **`steer.md` is absent.** Recorded rather than treated as a missing input.

## Confirmed-Clean Surfaces

- **Section 9's hand-check list** (`research.md:661`): exactly 20 citations, each resolving, and the count in the sentence matches the list.
- **Section 9's honesty about what rests on the workers** (`research.md:663`): the paragraph names the plan-side searches as not rerun and tells the reader to treat a row as "a verified claim with one reader, not as a fact with two". That is the strongest self-description in the document.
- **Section 13's arithmetic** (`research.md:733-737`): the 8/3/5 split reconciles with section 12's 12-row table plus the 4 registry-resolved questions, and the threshold and stop reason match the config.
- **Section 3's structure**: all 14 phase sections carry all three table headings, seven tables say "No row" and hold none, and no table is empty without saying so.
- **Section 7's overlap accounting**: the sampled entries for 002, 004 and 006 split carried from new exactly as section 3 does, which is what D5 asks.
- **Section 7's bare-form citations**: 11 total, all in range.
- **Section 12's table against section 13**: the 12 rows are the 9 registry-open questions plus the 3 pruned nodes, and the 4 registry-resolved questions are correctly absent from a table that states where each stands *after verification*.

## Ruled Out

- **Section 7 as a D5 violation.** The sampled entries cite the earlier synthesis and put only the new part in section 3. The split holds for 002, 004 and 006.
- **Section 9's hand-check count as inflated.** The list holds exactly the 20 it claims.
- **Section 13's question arithmetic as wrong.** 4 + 4 + 3 + 5 = 16 and 13 + 3 = 16 both hold.
- **The bare `S1:133` form as a broken citation.** All 11 resolve in range, and section 1's prefix table makes the form readable.
- **The phase sections as structurally uneven.** All 14 carry all three headings, and the "No row" entries are honest.
- **Section 12's 12-row table as an arithmetic error.** The 4 registry-resolved questions are deliberately absent; the table states where the open and pruned questions stand after verification. The wording defect is already carried as `R2-P2-001`.

## Next Focus

- Dimension: traceability
- Focus area: the research's recommendations against the packet's frozen decisions D1-D6 — whether any recommendation contradicts a decision, and whether D4's "every finding names its 003 phase or goes under net-new" and D5's "cited, not repeated" hold across all 121 surviving rows.
- Reason: the document's self-description is now covered and produced three P2s, two of them about how much a reader can trust the labels. The remaining unexamined risk is whether the recommendations are admissible under the packet's own rules, which is the traceability dimension and the one the merge will check.
- Rotation status: correctness twice (iterations 1, 3), traceability once (iteration 2), security once (iteration 4), maintainability once (iteration 5).
- Blocked/productive carry-forward: nothing blocked. Productive: scripting a census over the whole document rather than sampling sections, which is what surfaced both the inference undercount and the structural cleanliness.
- Required evidence: `research/research.md:64-437` (section 3), `:468-528` (sections 5 and 6), and the packet's `spec.md` for D1-D6.

Review verdict: CONDITIONAL
