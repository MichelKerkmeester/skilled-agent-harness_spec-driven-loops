# Iteration 004: Maintainability

## Focus
**Dimension**: Maintainability — doc-structure conventions, version-format consistency, tool-grant/contract clarity, comment & reference hygiene
**Files reviewed**: `mcp-open-design/SKILL.md` (re-read §5/§8), `sk-design-interface/SKILL.md` (re-read §4/§7 + frontmatter), `sk-design-interface/references/claude_design_parity.md` (hygiene), cross-skill `SKILL.md` section-naming convention (sk-git, sk-doc, mcp-figma), tree-wide `version:` frontmatter survey, ephemeral-id hygiene grep over `sk-design-interface/references/`

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 5 (+ convention/version surveys)
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.25

## Findings

### P2, Suggestion
- **F006**: Version-format convention drift in two of the three touched skills' frontmatter, `.opencode/skills/mcp-open-design/SKILL.md:9` and `.opencode/skills/sk-design-interface/SKILL.md:5`, A tree-wide survey of `version:` frontmatter shows the skill library's dominant convention is the 4-part `X.Y.Z.0` form (e.g. `1.5.0.0`, `2.3.0.0`, `1.0.7.0`, `3.5.0.0` — the majority). `mcp-open-design` declares `version: 1.2.0` and `sk-design-interface` declares `version: 1.3.0` (3-part), while `sk-prompt` declares `version: 2.3.0.0` (4-part, conformant). The mismatch is internal as well as library-wide: each skill's changelog filenames use the 4-part form (`changelog/v1.2.0.0.md`, `changelog/v1.3.0.0.md`), so the frontmatter `version` does not share arity with the skill's own changelog naming. Low blast radius, but a version reader normalizing `1.2.0` against a `v1.2.0.0.md` changelog (or against the 4-part library default) will see an arity mismatch. Aligning the two design skills' frontmatter to 4-part would remove the drift; `sk-prompt` is already correct.

- **F007**: `sk-design-interface`'s build/hand-off contract is internally ambiguous, and the tool grant follows the "build" reading, `.opencode/skills/sk-design-interface/SKILL.md:4` with `.opencode/skills/sk-design-interface/SKILL.md:109` vs `.opencode/skills/sk-design-interface/SKILL.md:192`, The process section treats building as in-scope — STEP 3 "Build from the revised plan, deriving every choice from it" (line 109) and STEP 4 self-critique with a screenshot (line 113) — and the frontmatter grants `allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]` (line 4) consistent with writing/running code. But Integration Points states "sk-code **owns implementation**. This skill decides the look, and sk-code builds it" (line 192), and the description frames the skill as design *judgment*. The two readings of where the build boundary sits are not reconciled: an operator cannot tell from the contract whether this skill writes UI code itself (justifying Write/Edit/Bash) or only produces a plan handed to sk-code (in which case Read-mostly would suffice). This is a contract-clarity defect, not a security hole — but it leaves the least-privilege question and the build/handoff seam undefined. A one-line scope statement ("this skill may build to self-critique, then hands production implementation to sk-code") would resolve it.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | (executed iteration 003) | No new traceability work this pass |
| checklist_evidence | pass | hard | (executed iteration 003) | No new traceability work this pass |

## Assessment
- New findings ratio: 0.25 (2 new low-severity P2s; novelty declining; no P0/P1 this pass).
- Dimensions addressed: maintainability — completes 4/4 dimension coverage.
- Novelty justification: F006 is a library-wide convention drift verified by survey; F007 is an internal build/handoff contract ambiguity. Both are distinct from prior findings.

## Ruled Out (independent divergence from sibling deepseek lineage)
- **"Sections 5 and 8 both named REFERENCES — ambiguous ToC" (sibling deepseek F014): FALSE POSITIVE — ruled out.** The dual structure `## 5. REFERENCES` (core, detailed) + `## 8. REFERENCES AND RELATED RESOURCES` (router-narrative close) is the **house skill template convention**, present identically in unrelated skills: `sk-git/SKILL.md:367,457`, `sk-doc/SKILL.md:420,460`, `mcp-figma/SKILL.md:271,337`. `mcp-open-design/SKILL.md:265,316` conforms to that template. Flagging it as a defect would penalize template conformance.
- **"claude_design_parity.md references ephemeral packet identifiers" (sibling deepseek F013): NOT REPRODUCIBLE in current state — ruled out.** An ephemeral-id grep (`ADR-`/`REQ-`/`CHK-`/`packet-N`/`specs/skilled-agent` paths) over `sk-design-interface/references/` returns nothing. Comment/reference hygiene is clean across the de-vendored references; the cited drift is not present now (fixed or over-reported).
- **`allowed-tools` as a pure security over-grant:** reframed (not dropped) into F007 as a contract-clarity issue, since the skill legitimately describes a build step.

## Dead Ends
- None.

## Recommended Next Focus
**Convergence evaluation.** All 4 dimensions covered (correctness, security, traceability, maintainability); both core hard gates executed and passed; one active P1 (F005, disclosed/deferred advisor-DB drift) plus six P2 advisories. New-findings ratio has decayed 1.00 → 0.25 → 0.50(P1 override) → 0.25. Recommend a single stabilization pass (iteration 5) to confirm no new P0/P1 surfaces, then synthesize at CONDITIONAL.

Review verdict: PASS
