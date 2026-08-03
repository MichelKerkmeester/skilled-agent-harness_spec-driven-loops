---
title: "mcp-webflow: Feature Catalog"
description: "Canonical capability inventory for the mcp-webflow transport: the complete remote Webflow MCP 2.0 surface (31 tools / 220 actions) plus the labeled local OSS baseline, with frozen operation classes and gates."
trigger_phrases:
  - "webflow"
  - "webflow feature catalog"
  - "webflow capabilities"
last_updated: "2026-08-03"
version: 1.2.0.0
---

# mcp-webflow: Feature Catalog


Canonical capability inventory for the mcp-webflow transport.

---

---
## 1. OVERVIEW

Canonical capability inventory for the `mcp-webflow` skill. The transport reaches Webflow MCP 2.0
through the `webflow` Code Mode manual (official `webflow-mcp-server`, `WEBFLOW_TOKEN`). The
**remote deployed surface** (`com.webflow/mcp` 2.0.0, official docs 2026-08-03) exposes **31 tools
and 220 actions** — the complete list of everything an AI can do — with per-action required
parameters in [`../references/action-reference.md`](../references/action-reference.md). The local
OSS server exposes the smaller 18-module baseline, labeled separately below. Every capability is
tagged with its frozen operation class (RO read-only, DW draft-write, DS destructive, PB publish,
DP deploy) and gate. The transport never mutates this workspace (`mutatesWorkspace: false`;
Write/Edit/Task forbidden); all mutations land in Webflow's cloud under the frozen gates.
Designer-family modules require `sk-design` pairing.

---
## 2. REMOTE SURFACE (31 tools / 220 actions, 21 groups)

| Capability group | Tools | Actions | Read/Write |
|---|---|---|---|
| Agent Instructions | 1 | 6 | read, write |
| Analyze (add-on) | 1 | 7 | read |
| Assets | 3 | 14 | read, write |
| CMS | 1 | 14 | read, write |
| Comments | 1 | 5 | read, write |
| Components | 4 | 27 | read, write |
| Elements | 3 | 21 | read, write |
| Enterprise | 1 | 11 | read, write |
| Fonts | 1 | 7 | read, write |
| Forms | 1 | 7 | read, write |
| Localization | 1 | 7 | read, write |
| Pages | 1 | 11 | read, write |
| Scripts | 1 | 20 | read, write |
| Sitemap | 1 | 8 | read, write |
| Sites | 1 | 3 | read, write |
| Style | 1 | 10 | read, write |
| Variables | 1 | 18 | read, write |
| Webhooks | 1 | 4 | read, write |
| WHTML | 1 | 1 | write |
| Designer canvas | 2 | 16 | read, write |
| Utility | 3 | 3 | read |

---
## 3. CAPABILITY CARDS

---
### CMS

#### Description

CMS content: reads, draft writes (remote = drafts), publish/unpublish (PB), delete (DS)

#### Current Reality

Documented from the official remote action reference (2026-08-03); live discovery of the pinned
version remains the authoritative inventory.

#### Source Files

See [`design/component-variants.md`](design/component-variants.md) for the full capability card.

---
### Publish and deploy

#### Description

publish_site / publish_collection_items / unpublish — staging-first gates and the 1/min queue

#### Current Reality

Documented from the official remote action reference (2026-08-03); live discovery of the pinned
version remains the authoritative inventory.

#### Source Files

See [`publish-deploy.md`](publish-deploy.md) for the full capability card.

---
### Designer-family

#### Description

Elements, styles, variables, components, assets, pages — always paired with sk-design

#### Current Reality

Documented from the official remote action reference (2026-08-03); live discovery of the pinned
version remains the authoritative inventory.

#### Source Files

See [`designer.md`](designer.md) for the full capability card.

---
### Site, pages, scripts, webhooks, enterprise, AI

#### Description

The remaining Data-API modules incl. comments, sitemap, branches

#### Current Reality

Documented from the official remote action reference (2026-08-03); live discovery of the pinned
version remains the authoritative inventory.

#### Source Files

See [`site-pages-scripts.md`](site-pages-scripts.md) for the full capability card.

---
### Agent Instructions

#### Description

Site rules and skills: create/read/search/update/move/delete

#### Current Reality

Documented from the official remote action reference (2026-08-03); live discovery of the pinned
version remains the authoritative inventory.

#### Source Files

See [`agent-instructions.md`](agent-instructions.md) for the full capability card.

---
### Analyze add-on

#### Description

Traffic, ranked pages/dimensions, engagement, time-on-page reports

#### Current Reality

Documented from the official remote action reference (2026-08-03); live discovery of the pinned
version remains the authoritative inventory.

#### Source Files

See [`analyze.md`](analyze.md) for the full capability card.

---
### Localization, fonts, forms

#### Description

Localized content, font management, form submissions

#### Current Reality

Documented from the official remote action reference (2026-08-03); live discovery of the pinned
version remains the authoritative inventory.

#### Source Files

See [`localization-fonts-forms.md`](localization-fonts-forms.md) for the full capability card.

---
### Sitemap, scripts, assets, WHTML

#### Description

Bulk sitemap status, the 20-action scripts surface, asset compression, WHMTL building

#### Current Reality

Documented from the official remote action reference (2026-08-03); live discovery of the pinned
version remains the authoritative inventory.

#### Source Files

See [`sitemap-scripts-assets-whtml.md`](sitemap-scripts-assets-whtml.md) for the full capability card.

---
### Component variants

#### Description

Variant reads, create/update, default variants, delete_variant (DS)

#### Current Reality

Documented from the official remote action reference (2026-08-03); live discovery of the pinned
version remains the authoritative inventory.

#### Source Files

See [`component-variants.md`](component-variants.md) for the full capability card.

---
## 4. LOCAL OSS BASELINE (18 modules)

The local `webflow-mcp-server` (npm) surface is the research-time 18-module baseline documented in
[`../references/tool-surface.md`](../references/tool-surface.md) (sites, pages, cms, components,
scripts, workflows, webhooks, enterprise, aiChat, comments, rules, dePages, deElement, deStyle,
deVariable, deComponents, deAsset, localDeMCPConnection). It includes capabilities absent from the
remote surface (e.g., `run_workflow`, Designer `de*` modules) and omits remote-only tools
(analyze, fonts, forms, localization, sitemap, WHTML, component variants, agent instructions).
Do not mix surfaces when calling tools.

---
## 5. CROSS-CUTTING CAPABILITIES

- **No auto-publish**: publishing is always a separate explicit action (1/min queue); remote CMS
  writes create drafts, publish/unpublish is PB.
- **Rate discipline**: plan-based 60/120 rpm; 429 + `Retry-After`; SDK backoff default.
- **Least privilege**: read-only scopes baseline; `sites:write` only for staging publish;
  workspace tokens read-only.
- **Rollback**: staged-first; CMS re-publish; Designer version-history snapshot; API-level site
  restore UNKNOWN (treated as unsupported).
- **Pairing**: Designer-family → `sk-design`; Data-family transport-only.
- **Unknown tools**: class UNKNOWN — prohibited until the live schema classifies them.
