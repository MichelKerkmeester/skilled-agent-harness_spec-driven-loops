## Multi-AI Council Report: System Code Graph Reference Template Alignment Audit

### Task Classification
- **Type**: documentation audit
- **Council Seats Dispatched**: 3: Analytical / cli-opencode, Critical / cli-opencode, Pragmatic / cli-opencode
- **Dispatch Mode**: Sequential Depth 1 (inline deliberation via sequential_thinking MCP)
- **Vantage Integrity**: Single CLI round — all three seats executed through cli-opencode opencode-go/deepseek-v4-pro max

### Council Composition

| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
|------|--------------|-------------------|------------------|------------|
| seat-001 | Analytical | cli-opencode DeepSeek v4 pro max | Template Compliance: Verify sk-doc reference-template alignment, frontmatter shape, H2 numbering, stub validity | 90 |
| seat-002 | Critical | cli-opencode DeepSeek v4 pro max | Router Skeptic: Challenge RESOURCE_MAP correctness, stale paths, stub propagation, active-doc navigation integrity | 85 |
| seat-003 | Pragmatic | cli-opencode DeepSeek v4 pro max | Preservation: Detect link breakage, overreach, runtime-behavior risk, validation gaps, scope safety | 88 |

### Strategy Comparison

| Dimension | Weight | Seat 001 | Seat 002 | Seat 003 |
|-----------|--------|----------|----------|----------|
| Correctness | 30% | 28 | 27 | 27 |
| Completeness | 20% | 19 | 17 | 18 |
| Elegance | 15% | 14 | 13 | 14 |
| Robustness | 20% | 18 | 17 | 18 |
| Integration | 15% | 14 | 13 | 15 |
| Pre-Critique Total | 100% | 93 | 87 | 92 |
| Post-Critique Adjustment | ±10 | -2 | +2 | +2 |
| Final Total | 100% | 91 | 89 | 94 |

### Deliberation Notes
- **Round 1 Independent Findings**: Seat 001 confirmed all canonical references pass sk-doc template validation (frontmatter, numbered H2s, no reference-level ToC). Seat 002 verified every RESOURCE_MAP entry targets canonical paths — zero stubs in resource maps. Seat 003 confirmed scope safety (docs-only), link preservation (8 stubs for 8 old paths), and cross-reference integrity.
- **Round 2 Cross-Critique**: Seat 002 challenged Seat 001 on the RESOURCE_MAP enforcement gap — template compliance doesn't prevent future drift. Seat 003 challenged Seat 002: existing validators partially close the positive-assertion gap. Seat 001 challenged Seat 003's "gap" as effectively addressed. All adjustments were minor (±2 points), and no seat changed its recommendation.
- **Round 3 Reconciliation**: Full convergence. All three seats recommend ACCEPT AS-IS. Shared advisory concern: RESOURCE_MAP stub-protection discipline is documented but not automated — a future maintenance risk of low severity.

### Winning Strategy
- **Leader**: Seat 003 (Preservation and Regression Pragmatist), Score: 94/100
- **Key Strength**: Most comprehensive assessment — combined scope safety verification, link-integrity mapping, validation-gap assessment, and cross-reference checks into a single coherent judgment.
- **Complementary Elements**: Seat 001's template shape verification (frontmatter/H2 integrity) and Seat 002's RESOURCE_MAP line-by-line audit provide the structural and navigational evidence that supports Seat 003's regression assessment.

### Recommended Plan

**ACCEPT AS-IS**

The completed system-code-graph reference template alignment work is correct, comprehensive, and scope-safe. The council finds no blockers, no required follow-up edits, and no validation gaps that affect the current deliverable.

**What was verified**:
1. All 8 canonical references exist in the correct snake_case subfolders and pass sk-doc reference-template validation.
2. All 8 compatibility stubs exist at old root kebab-case paths with valid reference shape and canonical pointers.
3. SKILL.md RESOURCE_MAP exclusively targets canonical paths — zero stub paths in any resource map or DEFAULT_RESOURCES.
4. README.md §9 and ARCHITECTURE.md §8 link to canonical references — no stale root paths in active docs.
5. No runtime code, schemas, commands, scripts, handlers, parsers, or database implementations were modified — documentation-only scope maintained.
6. Validation battery is comprehensive and all checks PASS: extract_structure (19 files), validate_document reference (16 files), validate_document skill, validate_document readme, quick_validate, rg stale paths, H2 numbering, markdown link resolver, strict spec validation.

### Implementation Steps

No implementation steps required. The work is complete. The recommended action is to accept the deliverable as-is.

### Prerequisites
- None. The work is complete and validated.

### Plan Confidence
- **Overall**: 92%
- **Strategy Agreement**: HIGH — all three seats recommend ACCEPT AS-IS with scores within 5 points (89-94).
- **Consensus Quality**: STRONG — genuine convergence from distinct reasoning lenses, not sycophancy. Each seat independently reached the same conclusion through different analytical paths.
- **Risk Level**: LOW — documentation-only change, no runtime impact, old links preserved via compatibility stubs.

### Dropped Alternatives
- **Rename-only without stubs** (ADR-001, score 4/10): Would break existing external links. Properly rejected.
- **Keep root files, rewrite content only** (ADR-001, score 3/10): Fails snake_case canonical path policy. Properly rejected.
- **Allow router to target stubs** (ADR-002, score 3/10): Would waste agent knowledge loads on thin pointers. Properly rejected.

### Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Future RESOURCE_MAP edit accidentally maps a stub path | Low | Documented anti-pattern at SKILL.md L297; would be caught in PR review |
| Canonical file edited but stub becomes stale | Low | Stubs are pointer-only — no duplicated content to go stale |
| New reference added without canonical folder discipline | Low | Existing taxonomy provides clear pattern; sk-doc validators enforce shape |
| RESOURCE_MAP enforcement gap (no automated CI check) | Low | Optional follow-up: add CI lint for root kebab-case patterns in RESOURCE_MAP values |

### Optional Follow-Up Items (NOT required)

1. **CI lint for RESOURCE_MAP**: Add a script that scans RESOURCE_MAP values for paths matching `references/[a-z-]+\.md` (root kebab-case) and flags any matches. This would automate the documented anti-pattern. Priority: LOW. Could be a separate follow-on packet.
2. **Router pseudocode enhancement**: Document a `_guard_resource_map()` example in SKILL.md §2 that rejects root-level reference paths. Priority: LOW. Documentation-only enhancement.

### Planning-Only Boundary
- **No files were modified outside `ai-council/**` by this council run.**
- This report is a recommendation for the calling agent. The council finds the work acceptable as-is.
- No implementation changes are recommended. The optional follow-up items are advisory only and do not block acceptance.
