# Research Synthesis: mcp-webflow Packet Depth Audit (cross-lineage)

> Phase 011 deep research for `mcp-webflow` (015). Two lineages ran to the forced-depth maximum:
> `luna-max-fast` (cli-opencode / gpt-5.6-luna-fast / max reasoning, 5 iterations) and
> `sol-high-fast` (cli-opencode / gpt-5.6-sol-fast / high reasoning, 5 iterations).
> Convergence was telemetry-only; the `max-iterations` stop policy was honored.
> Read-only audit; no Webflow MCP tools, credentials, mutations, publish calls, or deployment
> actions were used. Machine-readable index: `findings-registry.json` (74 key findings).

## 1. Executive Summary

The mcp-webflow packet is **not uniformly too concise**: the 498-line action inventory gives broad
name-level coverage, and the Bridge/CMS high-level models are mostly correct. It is nevertheless
**not reliable enough for execution** because depth is concentrated in action names while version
identity, request schemas, effect semantics, failure modes, safety precedence, and
capability-level tests are incomplete or wrong. Both lineages converge on **6 P0 findings, 54 P1
findings, and 14 P2 findings** (74 registry entries; both lineage registries merged without
dedup, so cross-lineage thematic overlap is expected) across the five references, the
assets/examples, the nine feature cards, and the 17 playbook scenarios.

## 2. Verdict By Artifact Family

| Family | Verdict | Main Problem |
|---|---|---|
| `action-reference.md` | Broad but too schema-thin | Wrong/mixed version identity; no optional fields, enums, results, limits, or effects |
| `designer-capabilities.md` | Useful architecture, incomplete execution | Missing modes/errors, replace-all style semantics, component/variant invariants |
| `tool-surface.md` | Stale unless explicitly v1.3-pinned | Legacy names conflict with `@latest` local wiring |
| `mcp-wiring.md` | Good auth/rate baseline | Surface/version and script-gate details are incomplete |
| `troubleshooting.md` | Too narrow | Missing `ModeForbidden`, limitations, dynamic tools, migration/input changes |
| Assets/examples | Too concise and partly invalid | Missing required keys and no negative/schema-derived examples |
| Feature catalog | Materially inaccurate | Invented actions, migrated names, publish conflation, malformed metadata |
| Manual playbook | Broad class coverage, insufficient depth | P0 trust boundary and most capability invariants are untested |

## 3. P0 Findings (6)

1. **CMS draft encoding is unsafe** — the draft example omits an explicit `isDraft: true`; the OSS
   adapter defaults an omitted draft value to false. Require explicit draft state + read-back of
   `isDraft`/`lastPublished`/locale. [SOURCE: `assets/payload-examples.md:48-55`]
2. **CMS item publish is falsely described as staging-targeted** — `publish_deploy.md` calls item
   publish staging-first; the item endpoint accepts collection/item identifiers, not a domain
   selector. Reserve staging-subdomain language for `publish_site`. [SOURCE: `feature-catalog/content/cms.md:26-35`]
3. **Custom-code release gates conflict** — the action reference labels script registration DW
   while `mcp-wiring.md` groups it with deploy confirmation. Reconcile registration vs application
   vs publish in one matrix. [SOURCE: `references/action-reference.md:316-341`]
4. **`replace_robots_txt` lacks a high-impact safety gate** — represented as ungated DW though the
   Enterprise API distinguishes PATCH/PUT-replace/DELETE that can make a user agent unrestricted.
   Require pre-read/diff/post-read + confirmation. [SOURCE: `references/action-reference.md:228-244`]
5. **Agent Instructions can cross the safety boundary** — site instructions are automatically
   supplied to agents; the packet never states they are untrusted content subordinate to operator
   intent and the frozen DS/PB/DP gates. [SOURCE: `feature-catalog/intelligence/agent-instructions.md:12-38`]
6. **Remote/local authority is not reproducible** — local registration launches
   `webflow-mcp-server@latest` without a pinned package/commit, endpoint fixture, or action-schema
   digest. Add a dated fixture; pin after capture. [SOURCE: `references/mcp-wiring.md:22-39`]

## 4. P1 Themes (54; 30 from sol-high-fast + 24 from luna-max-fast, overlapping themes)

- **Designer & Bridge**: canvas-state classification inconsistent (Bridge-bound navigation vs
  site-tree draft writes); element-tree queries too opaque; style class/combo-class/raw-CSS
  semantics omitted; breakpoint behavior incomplete; branch isolation implies an unsupported
  merge (document create/list/details/delete + state merge is out of surface); the
  component-variants card contradicts the action reference; variable-mode verification absent;
  component metadata/prop/slot rules too concise.
- **CMS / publish / pages**: CMS state readback gaps; site-publish completion/blast-radius checks
  missing; page-settings status-safe payloads; remote/local branch lifecycle reconciliation;
  publish/unpublish payload + manual coverage missing (locale-specific results, partial errors).
- **Scripts / forms / localization / metadata**: form/submission schemas and manual coverage;
  localization examples promise unsupported locale management; schema-markup/structured-data page
  actions omitted; asset/compression task lifecycle + remote/local boundaries; a page-metadata
  example reads content instead of metadata.
- **Operational**: webhook/version and robots safety contradictions; rate-limit semantics need
  version-qualified verification; `ModeForbidden`, dynamic-tool, and migration/input changes
  missing from troubleshooting.

## 5. P2 Findings (14; 7 per lineage)

- Missing publish/unpublish payload + manual coverage (locale results, partial errors).
- Page-metadata example/scenario reads content instead of metadata.
- Remote/local module-level alignment lacks a pinned live fixture.
- Version identity drift between hosted docs, OSS README, and packet claims.
- (Remaining P2s per `findings-registry.json` severity bucket.)

## 6. Confirmed Strengths

- 498-line action inventory with broad name-level coverage (31 tools / 220 actions).
- Bridge/CMS high-level models are mostly correct (canvas-bound vs data-plane split).
- RO/DW/DS/PB/DP class taxonomy is sound and consistently applied at the class level.
- 17 scenarios cover every operation class; filenames and template structure are canonical.

## 7. Prioritized Remediation Sequence (per sol-high-fast)

1. Fix the two CMS P0s (explicit `isDraft`, staging-language removal) — smallest blast radius.
2. Add the Agent Instructions trust-boundary P0 to SKILL.md and the card.
3. Reconcile custom-code registration/application/publish gates (one matrix).
4. Gate `replace_robots_txt` (pre-read/diff/post-read + confirmation).
5. Pin the local server + capture a dated endpoint/action-schema fixture.
6. P1 batch: Designer canvas-state classification, style class/combo/raw-CSS semantics,
   component-variants card rebuild, branch-merge out-of-surface statement, troubleshooting
   expansion (`ModeForbidden`, dynamic tools), forms/localization/asset depth.

## 8. Residual Risks

- The remote hosted surface cannot be treated as identical to the OSS snapshot without a
  version-specific reconciliation fixture (P0-6).
- Live verification of the Bridge App boundary requires a real Designer session (manual step).

## 9. Evidence Index

- Lineages: `lineages/luna-max-fast/` (iterations 001-005, `research.md`),
  `lineages/sol-high-fast/` (iterations 001-005, `research.md`).
- Merged machine index: `findings-registry.json` (74 key findings; P0=6, P1=54, P2=14).
- Attribution: `fanout-attribution.md`; resource map: `resource-map.md`;
  orchestration: `orchestration-summary.json`; convergence: `convergence-report.md`.

## 5. Iteration Evidence (lineage order)
