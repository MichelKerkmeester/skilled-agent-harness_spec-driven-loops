---
title: "Resource Map — Audit the mcp-webflow skill packet (.opencode/skills/mcp-tooling/mcp-webflow): determine whether its references (action-reference, designer-capabilities, tool-surface, mcp-wiring, troubleshooting), assets (utcp-manual-reference, payload-examples, examples/*), feature-catalog snippets (9 cards + root), and manual-testing-playbook snippets (17 scenarios) are TOO CONCISE or MISSING important Webflow MCP 2.0 logic. Verify against the official Webflow MCP 2.0 surface: Designer canvas model (page/mode/branch/component-view/selection), Bridge App boundary, element tree, components (builder/props/variants/slots/metadata), styles + variable modes, breakpoints, CMS draft semantics, publish/branches, scripts, forms, localization, sites, assets/compression, webhooks, enterprise, AI tools, agent instructions, WHTML, utility tools, rate limits, and local-OSS vs remote-surface reconciliation. Cite [SOURCE: file:line] or [SOURCE: url] for every finding; flag conciseness gaps and missing logic as P0/P1/P2 with concrete recommendations."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 35
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=31, Specs=4, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 1
- **Scope**: research convergence output for 011-deep-research-quality-gaps
- **Generated**: 2026-08-03T12:04:30.084Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature-catalog/`, `manual-testing-playbook/`, `scripts/`, `shared/`, `mcp-server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/mcp-tooling/mcp-webflow/assets/examples/destructive-refused.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/assets/examples/draft-page-settings.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/assets/examples/first-session-discovery.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/assets/examples/read-cms-content.md | Cited | OK | Citations=3; Iterations=3 |
| .opencode/skills/mcp-tooling/mcp-webflow/assets/examples/staging-publish.md | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/mcp-tooling/mcp-webflow/assets/payload-examples.md | Cited | OK | Citations=3; Iterations=3 |
| .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/cms.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/localization-fonts-forms.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/publish-deploy.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/site-pages-scripts.md | Cited | OK | Citations=3; Iterations=3 |
| .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/component-variants.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/designer.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/feature-catalog.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/intelligence/agent-instructions.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/intelligence/analyze.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/operations/sitemap-scripts-assets-whtml.md | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/draft-write/draftset.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/draft-write/instructions.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/manual-testing-playbook.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/pairing/pair-data.md | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/read-only/analyze.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/read-only/readcms.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/read-only/readpages.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/safety-gate/pubgate.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/safety-gate/rate-limit.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/README.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md | Cited | OK | Citations=5; Iterations=5 |
| .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md | Cited | OK | Citations=3; Iterations=3 |
| .opencode/skills/mcp-tooling/mcp-webflow/references/troubleshooting.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/mcp-tooling/mcp-webflow/SKILL.md | Cited | OK | Citations=1; Iterations=1 |

---

## 6. Specs

> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/prompts/iteration-002.md | Cited | MISSING | Citations=1; Iterations=1 |
| .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-003.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-004.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-005.md | Cited | OK | Citations=1; Iterations=1 |

---
