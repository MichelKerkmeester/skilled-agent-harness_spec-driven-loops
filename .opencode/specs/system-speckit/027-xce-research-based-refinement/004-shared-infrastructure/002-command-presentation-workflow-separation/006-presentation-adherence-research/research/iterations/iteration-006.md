# Iteration 006 (deepseek-v4-pro, prose-extracted)

> The seat answered in prose instead of the findings JSON contract; key claims distilled below, full prose preserved.

## [P1][REFINEMENT] Propagate doctor's Presentation Boundary section to all families
- Evidence: prose-extracted from deepseek seat 6; doctor family carries an explicit Presentation Boundary enumeration the memory family lacks
- Detail: The seat's strongest single improvement: a machine-scannable boundary contract section in every command router so models and CI can both check what must render verbatim.
- Fix sketch: Add a Presentation Boundary section to memory/, create/, speckit/, deep/ routers mirroring doctor/.

---
## Full seat output

```json
{
  "angle": 6,
  "findings": [
    {
      "class": "NEW-FEATURE",
      "severity": "P1",
      "title": "Pre-flight structural validator: cross-reference command .md routing tables against presentation asset sections",
      "evidence": "check-prompt-quality-card-sync.sh:88-104 (Check 2: Tier-3 pointer-only pattern) vs memory/search.md:15-16 (routing assets table) vs search_presentation.md:26-101 (sections 2-7 covering retrieval, analysis, empty-fallback, errors, and overview — sections exist but model ignored them)",
      "detail": "The existing check-prompt-quality-card-sync.sh pattern validates pointer presence (does SKILL.md cite the canonical card?). An analogous command→presentation validator would grep every command .md for its `| Presentation | <path> |` table row (ensuring pointer exists), then cross-check that the presentation contract has sections for each routing mode declared in the command. This is pure bash/grep with zero semantic matching — identical to the Tier-3 pointer-only check. Feasibility: HIGH.",
      "fix_sketch": "Ship `check-command-presentation-sync.sh` mimicking the four-check structure of `check-prompt-quality-card-sync.sh`, with checks for pointer presence, section coverage, asset existence, and forbidden-inline-template detection."
    },
    {
      "class": "DOC-DRIFT",
      "severity": "P1",
      "title": "Memory commands lack the explicit 'Presentation Boundary' section that doctor commands use to anchor the contract",
      "evidence": "doctor/mcp.md:53-61 (explicit Presentation Boundary listing every display element owned by the presentation contract) vs memory/search.md:17 (a single table row stating presentation is 'Required') vs memory/save.md:18 ('Before rendering any prompt...read the presentation asset and follow it as the display source of truth')",
      "detail": "Doctor commands (mcp.md, speckit.md, update.md) all have a final 'Presentation Boundary' section enumerating every display element that lives only in the presentation contract (e.g., 'Sub-action menu, accepted answers, and cancellation display...'). Memory commands (search, save, manage, learn) lack this section entirely, relying on a softer 'read and follow' instruction. The doctor pattern creates a stronger machine-readable contract: a model can scan the boundary section to know exactly what to delegate to the presentation asset. Propagating this section to all commands would mechanically enforce adherence.",
      "fix_sketch": "Add a standardized `## Presentation Boundary` section to memory/search.md, memory/save.md, memory/manage.md, and memory/learn.md, listing the display elements owned by each presentation contract (following the doctor/*.md template)."
    },
    {
      "class": "REFINEMENT",
      "severity": "P2",
      "title": "Template fence markers in presentation contracts would enable mechanical coverage checking",
      "evidence": "search_presentation.md:30-41 (retrieval result template in ```text``` fence) vs check-skill-doc-frontmatter.sh:1-44 (frontmatter contract enforced per-doc with --shape and --coverage modes)",
      "detail": "The presentation contracts use fenced code blocks (```text) for render templates, but there is no standardized fence marker that a CI script can grep for. By adopting a convention like ````render` or adding a `<!-- RENDER_TEMPLATE: retrieval_result -->` HTML comment above each fenced block, a validator could mechanically detect: (a) whether a presentation contract has at least one template per routing mode, (b) whether any template is empty/stub, and (c) whether a command's routing table has 1:1 coverage with its presentation templates. This follows the check-skill-doc-frontmatter.sh --coverage pattern.",
      "fix_sketch": "Adopt `<!-- RENDER_TEMPLATE: <name> -->` markers above each fenced render block in presentation contracts and ship a `check-render-template-coverage.sh` that cross-references command routing tables against template markers."
    },
    {
      "class": "DOC-DRIFT",
      "severity": "P2",
      "title": "Memory/search router's hard rules (section 5) duplicate presentation contract content but don't cite the contract's section numbers",
      "evidence": "memory/search.md:72-79 (five hard rules covering startup question policy, targeted follow-ups, old option dump prohibition, forbidden labels, and YAML editing) vs search_presentation.md:5-22 (§1 Startup Question Policy) and search_presentation.md:69-76 (§4 Forbidden Vocabulary) — these cover the same ground but are never cross-referenced by section number",
      "detail": "The check-prompt-quality-card-sync.sh Check 2 (Tier-3 pointer-only) prevents re-enumeration of canonical content by requiring a pointer instead. In the command system, memory/search.md §5 'HARD RULES' re-enumerates display rules that are canonically owned by search_presentation.md §§1,4 — but the rules section does not cite the specific presentation contract sections. This creates a fragmentation risk: if the presentation contract is updated, the hard rules become stale. A validator verifying that each hard rule cites a presentation contract section (or that no hard rule duplicates presentation content) would catch this.",
      "fix_sketch": "Add a check to the command-presentation-sync validator that verifies each 'HARD RULES' bullet in command .md files cites a section anchor (e.g., 'see presentation §4') for any rule that duplicates presentation contract content."
    },
    {
      "class": "NEW-FEATURE",
      "severity": "P3",
      "title": "Golden-output fixture files would enable sampling-based regression tests but CI automation is limited by model non-determinism",
      "evidence": "route-validate.sh:42-104 (self-test mode with fixture manifests: missing-key, missing-asset, duplicate-target) vs the reported /memory:search failure where search_presentation.md §2 template was ignored in favor of free prose",
      "detail": "route-validate.sh's self-test fixtures demonstrate the golden-output approach: known-bad manifests are checked and expected to fail. For render-contract adherence, golden-output fixtures per command (defining the expected shape/template for empty-query startup and known subcommands) could be stored in assets/fixtures/ and compared via a sampling harness. However, model output is non-deterministic, making exact-diff CI impractical. A weaker variant — checking that the output contains the template's status line pattern (e.g., `STATUS=OK`) — is automatable as a fuzzy match but loses precision. Viable as a manual pre-release QA check, not as a CI gate.",
      "fix_sketch": "Add `assets/fixtures/` per command with golden-output shape files and a `check-render-golden.sh` sampling harness (opt-in, not CI) for manual pre-release render-adherence verification."
    }
  ],
  "summary": "A mechanical render-contract validator in the `check-prompt-quality-card-sync.sh` pattern is highly feasible: it would cross-reference every command .md's routing table against its presentation asset (pointer presence, section coverage, asset existence). The strongest single improvement is propagating the doctor commands' explicit 'Presentation Boundary' section to memory and other command families, which creates a machine-scannable contract that both models and CI can verify."
}
```