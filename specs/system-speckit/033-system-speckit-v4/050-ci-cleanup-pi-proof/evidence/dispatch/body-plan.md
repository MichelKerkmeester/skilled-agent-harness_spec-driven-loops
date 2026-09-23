STEP 1 - fill P/plan.md (Level 2 implementation plan)
Shape model (read-only): specs/system-speckit/033-system-speckit-v4/049-gate-3-delivery-residue/plan.md
- Title in frontmatter and H1: "Implementation Plan: CI Cleanup and Pi Gate-3 Live Proof".
- Technical context: Markdown, JSON and TypeScript tests with Node CLI scripts. Framework: spec-kit, the skill
  advisor and the Pi CLI. Storage: None. Testing: vitest and the node check scripts in evidence.md.
- Overview: two to three sentences from evidence.md Problem and purpose.
- Quality gates: tick Definition of Ready items that hold. Leave Definition of Done items unticked except those the
  evidence already proves.
- Architecture: the repair flow per surface and the Pi proof flow, named from evidence.md.
- Fix addendum table: producer rows for cli-jev SKILL.md Keywords and derived.key_topics. Consumer rows for the scorer
  projection, the Hermes mirror and the compiled-routing policy hash. Verification cells cite evidence commands.
- Testing strategy table: the verification commands in evidence.md grouped as unit, integration and manual (Pi).
- Dependencies: main's three newer commits and the cli-jev re-mint after merge.
- Rollback: revert the phase commit. For cli-jev routing, re-run compiled-route-manifest.cjs refresh or restore the
  committed manifest. Keep the L2 sections, fill from evidence or write the N/A line.
Accept when: only P/plan.md changed and every rule above holds.
