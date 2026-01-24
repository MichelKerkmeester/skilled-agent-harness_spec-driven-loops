# Changelog

All notable changes to the **scripts** folder are documented in this file.
Public Release: https://github.com/MichelKerkmeester/opencode-dev-environment

> The format is based on [Keep a Changelog](https://keepachangelog.com/)

---

## skill_advisor.py

### [**1.0.8.0**] - 2026-01-23

Dual-threshold validation upgrade introducing uncertainty tracking alongside confidence scoring.

#### Added
- **`calculate_uncertainty()`** — Weighted uncertainty score from 4 factors:
  - Epistemic gaps (0.30 weight)
  - Model boundaries (0.25 weight)
  - Temporal variability (0.20 weight)
  - Situational completeness (0.25 weight)
- **`passes_dual_threshold()`** — Validates both thresholds:
  - Confidence >= 0.70
  - Uncertainty <= 0.35
  - Returns `(passes: bool, confidence: float, uncertainty: float)`

#### Changed
- **READINESS formula**: Now requires BOTH confidence AND uncertainty thresholds
- **"Confident Ignorance" detection**: High confidence + high uncertainty triggers investigation instead of proceeding

---

### [**1.0.2.0**] - 2025-12-30

Initial public release of the Skill Advisor script.

#### Added
- Dynamic skill scanning from `.opencode/skill/*/SKILL.md` frontmatter
- Two-tiered confidence scoring formula:
  - With intent boost: `confidence = min(0.50 + score * 0.15, 0.95)`
  - Without intent boost: `confidence = min(0.25 + score * 0.15, 0.95)`
- Comprehensive stop word filtering (100+ words)
- Synonym expansion for query matching
- Intent boosters for high-confidence keyword → skill mapping
- Multi-skill boosters for ambiguous keywords
- `--health` flag for diagnostics
- `--threshold` flag for filtering results (default: 0.0, typical: 0.8)

#### Features
- **Gate 2 Integration**: Used by AGENTS.md for skill routing decisions
- **Skill Categories**:
  - `system-spec-kit`: Memory, context, specifications
  - `mcp-narsil`: Semantic search, security, call graphs
  - `workflows-git`: Version control operations
  - `workflows-chrome-devtools`: Browser debugging
  - `workflows-documentation`: Markdown, templates
  - `workflows-code`: Implementation, verification
  - `mcp-code-mode`: External tool integration

---

### [**1.0.1.0**] - 2025-12-29

Pre-release version during LEANN to Narsil migration.

#### Changed
- Updated skill references from `mcp-leann` to `mcp-narsil`
- Adjusted intent boosters for new Narsil tool names

---

### [**1.0.0.0**] - 2025-12-29

Initial implementation.

#### Added
- Basic skill matching algorithm
- Frontmatter parsing for skill metadata
- JSON output format for AI consumption
- Command-line interface with argparse
