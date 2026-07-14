# Review Iteration 001

## Dispatcher

- Session: `fanout-xhigh-c-1783915428096-y929h9`
- Lineage: detached, generation 1, `lineageMode=new`
- Route: `mode=review`, `target_agent=deep-review`
- Stop policy: `max-iterations` (iteration 1 of 4)
- Budget profile: `verify`

## Dimension

`correctness`

## Files Reviewed

- Deterministic full-corpus scan: all 163 Markdown files in the six configured reference/asset roots.
- Current inventory: code-opencode references 50, code-opencode assets 15, code-webflow references 86, code-webflow assets 9, code-quality references 0, code-quality assets 3.
- Direct evidence reads: `.opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:1-321`, `.opencode/skills/sk-code/code-opencode/references/workflow_debug.md:1-40`, `.opencode/skills/sk-code/code-opencode/references/workflow_implement.md:1-75`, `.opencode/skills/sk-code/code-webflow/references/css/quality_standards/patterns_and_naming_enforcement.md:1-45`, `.opencode/skills/sk-code/code-webflow/references/css/patterns/tokens_state_machine_and_triggers.md:1-54`, and `.opencode/skills/sk-code/code-webflow/references/implementation/observer_patterns/mutation_and_intersection.md:1-38`.
- Governing evidence: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:55-81`, `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:38-60`, `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:37-78`, `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:54-87`, and `.opencode/skills/sk-doc/create-skill/assets/skill/skill_asset_template.md:125-175`.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **A scoped Rust reference bypasses the mandatory OVERVIEW wrapper** -- `.opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:19` -- After the H1 intro and separator, the document begins directly with the unnumbered `### Error Style`; it has no `## 1. OVERVIEW`, `### Purpose`, or `### When to Use`. That contradicts R3 and the governing reference template. A forced-type `validate_document.py` pass does not disprove the defect: the validator returns without an error when it finds no numbered H2 headers, so this malformed shape can produce the claimed zero-issue result.
   - Finding class: `instance-only`
   - Scope proof: A deterministic structure scan covered all 163 configured files and found this as the only file without a correctly ordered H1 and `## 1. OVERVIEW`; direct reread confirmed the body transition at lines 13-21.
   - Affected surface hints: `["code-opencode Rust references", "resource-document validation", "completion evidence"]`

```json
{"type":"spec_mismatch","claim":"One in-scope reference omits the mandatory OVERVIEW/Purpose/When-to-Use wrapper while the packet claims every scoped file has it.","evidenceRefs":[".opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-21",".opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-72",".opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:73-87"],"counterevidenceSought":"Forced reference-type validation across all 163 files returned zero validator issues; the file was reread and the validator's no-numbered-H2 path was inspected.","alternativeExplanation":"The file could be intentionally exempt or outside the historical transformation manifest, but the rendered review scope includes every Markdown file under this reference root and no exception is documented.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade only if an approved scope amendment or authoritative manifest proves this file is exempt from R3."}
```

### P2 Findings

1. **Seven references exceed the 1-2 sentence intro contract** -- `.opencode/skills/sk-code/code-opencode/references/workflow_debug.md:16` -- The shared `workflow_debug.md`, `workflow_implement.md`, and `workflow_verify.md` copies under both code-opencode and code-webflow each use three introductory sentences; `.opencode/skills/sk-code/code-webflow/references/css/quality_standards/patterns_and_naming_enforcement.md:19` also uses three. The documents otherwise have the required wrapper, so this is non-blocking template polish rather than a behavior defect.
   - Finding class: `class-of-bug`
   - Scope proof: The same full-corpus opening-shape scan isolated these seven intro-length instances; the representative shared-workflow and CSS files were directly reread.
   - Affected surface hints: `["code-opencode shared workflow references", "code-webflow shared workflow references", "code-webflow CSS quality reference"]`

## Traceability Checks

- `spec_code` (core): **failed** -- R3 requires the wrapper on every scoped file, but `interop_errors_and_parity.md:19` begins substantive content without it. The 1-2 sentence intro rule also has seven advisory mismatches.
- `checklist_evidence` (core): **failed** -- `checklist.md:49` records a real 163/163 validator pass, but that checker does not establish the wrapper invariant for a file with no numbered H2. The completion evidence is therefore insufficient for R3.
- `skill_agent` / `agent_cross_runtime`: **notApplicable** -- the target is a spec-folder/document corpus, not an agent definition.
- `feature_catalog_code` / `playbook_capability`: **pending** -- not required for the correctness focus and preserved for a later traceability iteration.
- Content-preservation R4: **deferred** -- no pre-transformation manifest/content baseline was available in this iteration; absence of evidence was not converted into a pass.

## Integration Evidence

- `.opencode/skills/sk-doc/shared/scripts/validate_document.py:322-328` was inspected after the forced-type scan: its no-numbered-H2 branch explains why the malformed reference still reports zero issues.
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:54-87` and `.opencode/skills/sk-doc/create-skill/assets/skill/skill_asset_template.md:125-175` were read as the named structural authority.

## Edge Cases

- The prior strategy inventory split (47/15/88/10/0/3) is stale relative to the current configured roots (50/15/86/9/0/3), although both total 163. The current filesystem was used without broadening the configured glob scope.
- Structural validation was counterevidence, not proof of conformance, because its no-H2 path misses the active P1.
- Structural-impact analysis was not applicable: this is a documentation-corpus review rather than a local code diff. Exact-path scans and direct reads supplied evidence.

## Confirmed-Clean Surfaces

- All 163 files passed forced `reference`/`asset` validation with zero reported issues.
- All 163 carry the required frontmatter fields and a four-part version.
- No scoped filename stem contains a hyphen.
- No broken relative Markdown links were found in non-fenced Markdown links inside the configured corpus.
- No exact intro/Purpose duplicates were found; 162 of 163 files have the required H1-to-OVERVIEW ordering.

## Ruled Out

- Missing frontmatter/version class: ruled out across 163 files.
- Hyphenated scoped filename class: ruled out across 163 files.
- Broken scoped navigational Markdown-link class: ruled out by a fenced-code-aware relative-link scan.
- Exact intro/Purpose duplication class: ruled out across 163 files.

## Verdict

FINAL VERDICT: CONDITIONAL

One active P1 spec mismatch prevents PASS; no P0 was found. `hasAdvisories=true` because one P2 class remains.

## Next Focus

- Dimension: `security`
- Focus area: instruction examples, trust boundaries, unsafe command patterns, and secret-handling guidance in the 163-file corpus.
- Reason: correctness received a complete deterministic structural pass and direct evidence adjudication.
- Rotation status: correctness complete; security is the next unchecked dimension.
- Blocked/productive carry-forward: retain the productive full-corpus inventory, but do not repeat the exhausted structural wrapper scan.
- Required evidence: exact unsafe guidance or explicit clean counterevidence with file:line citations.

Review verdict: CONDITIONAL
