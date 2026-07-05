# Iteration 002: Comment-Hygiene Violations in YAML Workflows

## Focus
- Scope: Ephemeral artifact-label markers (F-010-B5-0x finding IDs) embedded in YAML comments
- Question: Are comment-hygiene violations fully catalogued across all YAML workflow files?

## Findings

### F-002: Live comment-hygiene violation — ephemeral finding IDs in production YAML

**Severity: High (constitutional rule violation)**

The constitutional rule `comment-hygiene.md` states: "Never embed ephemeral artifact labels (spec paths, packet/phase numbers, ADR/REQ/task/finding ids) in code comments; keep the durable WHY."

Six instances of ephemeral finding-ID markers (`# <!-- F-010-B5-0X -->`) are embedded as YAML comments in two production workflow files:

**deep_review_auto.yaml:**
| Line | Marker |
|------|--------|
| 395 | `# <!-- F-010-B5-04 -->` |
| 408 | `# <!-- F-010-B5-04 -->` |
| 988 | `# <!-- F-010-B5-03 -->` |

**deep_research_auto.yaml:**
| Line | Marker |
|------|--------|
| 301 | `# <!-- F-010-B5-04 -->` |
| 319 | `# <!-- F-010-B5-04 -->` |
| 1099 | `# <!-- F-010-B5-02 -->` |

[SOURCE: `.opencode/commands/deep/assets/deep_review_auto.yaml:395,408,988`]
[SOURCE: `.opencode/commands/deep/assets/deep_research_auto.yaml:301,319,1099`]

**Root cause:** During the remediation of deep-review finding F-010-B5 (likely a YAML parsing or step-ordering fix), the author annotated the changed lines with the finding ID as an HTML comment inside a YAML comment. These markers were intended as temporary tracking annotations but were never cleaned up after the fix shipped.

**Impact:** These markers violate the constitutional hard-block rule on comment hygiene. They reference an ephemeral finding ID that has no durable meaning outside the review lineage that generated it. A future maintainer encountering `# <!-- F-010-B5-04 -->` has no way to resolve what F-010-B5-04 was without archaeology through review lineage artifacts.

**Cross-file pattern:** The same marker (`F-010-B5-04`) appears in BOTH files at different locations, suggesting copy-paste of the remediation pattern across the two sibling YAML workflows without per-file context cleanup.

**Recommendation:**
1. Remove all 6 `# <!-- F-010-B5-0X -->` markers from both YAML files.
2. If the comment provides durable WHY context, rewrite it as a plain-language explanation (e.g., `# Step ordering fix: reduce must run before converge-check to avoid zero-finding false convergence`).
3. Add a lint rule to the YAML validation suite that flags `F-\d+-\w+-\d+` patterns in `.yaml` comments.

## Novelty Justification
Confirmed the finding-ID markers are present at the exact line numbers cited (301/319 in deep_research_auto.yaml) AND discovered 4 additional instances across both files. The cross-file copy-paste pattern (same marker in both YAMLs) is a new observation.

## What Was Tried and Failed
- Checked whether the markers might serve a YAML parser function (they do not — they are pure comments)
- Checked if the markers were documented in a decision-record (they are not)

## Ruled-Out Directions
- Keeping the markers as-is: violates constitutional hard-block
