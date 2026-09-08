# Changelog digest: sk-create-manual-testing-playbook

Skill path: `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/`. Versions covered: v1.0.0.0 through v1.0.1.2 (all 4 entries in `changelog/`, fewer than the 10 requested). Date range: 2026-07-06 to an undated v1.0.1.2. Only v1.0.0.0 and v1.0.1.0 carry a release date. v1.0.1.1 and v1.0.1.2 carry none.

---

## Per-version summary, newest first

### v1.0.1.2

`changelog/v1.0.1.2.md` records a README-only conformance pass from the skill-readme refinement packet. The reference-card README was rewritten into a purpose-first narrative on the refined template with a one-line pitch blockquote, an AT A GLANCE table, a problem-first OVERVIEW carrying the nine-field Scenario Contract as a capability layer, plus QUICK START, HOW IT WORKS, TROUBLESHOOTING, FAQ, VERIFICATION and RELATED DOCUMENTS. The Human Voice Rules gate came back clean at zero em dashes, zero semicolons and zero Oxford-comma hits, down from 8 before the rewrite. The entry states the README version field moved from `1.0.0.0` to `1.0.1.2` because it had lagged the release track. The entry explicitly says `SKILL.md` stays at `1.0.1.1` and that no runtime instruction, reference file or command asset moved.

### v1.0.1.1

`changelog/v1.0.1.1.md` is a single-sentence entry with no body sections. It documents evidence-driven playbook routing resilience and records the packet's deliberate choice to use flat resources instead of keyed runtime discovery. No files, paths or behaviors are named.

### v1.0.1.0

`changelog/v1.0.1.0.md` is a structural normalization of `SKILL.md` so it satisfies the canonical section contract that `create-skill/scripts/package_skill.py` enforces. RENAME: the merged `## 1. WHEN TO USE + SMART_ROUTING` header was split into `## 1. WHEN TO USE` and `## 2. SMART ROUTING`, because the section matcher substring-tests uppercased H2 text and the underscored `SMART_ROUTING` token never matched `SMART ROUTING`. RENAME: the resources section became `## 9. RESOURCES FOR DEEP DETAIL & REFERENCES` so the required REFERENCES match resolves. A `Keyword triggers:` line was added inside WHEN TO USE, a new `## 8. SUCCESS CRITERIA` section was added, and all H2 headings were renumbered contiguously from 1 to 9. The entry states no workflow behavior changed and all prose was preserved.

### v1.0.0.0

`changelog/v1.0.0.0.md` is the initial release, dated 2026-07-06, of `create-manual-testing-playbook` as one of the ten workflow packets in the `sk-doc` parent hub's workflow-only architecture. It authors `manual-testing-playbook/` packages made of a root playbook file plus numbered `NN--category-name` folders of per-feature files, each carrying a deterministic scenario contract covering exact prompt, exact command sequence, expected signals, evidence, pass/fail criteria and failure triage. Shipped contents were `SKILL.md` (activation triggers and non-triggers, canonical package shape, an 18-step authoring workflow, scenario design rules including the natural-human versus RCAF prompt voice and the prompt synchronization gate, plus validation and release gates), `references/manual_testing_playbook_creation.md`, and two scaffolds at `assets/testing_playbook/manual-testing-playbook-template.md` and `assets/testing_playbook/manual-testing-playbook-snippet-template.md`. The entry notes the packet ships no packet-local `scripts/` and no packet-local `graph-metadata.json`, since validation runs through `../shared/scripts/validate_document.py` and `extract_structure.py` and the single advisor identity lives at the `sk-doc` hub root.

---

## Facts the v4 draft gets wrong or misses

- The draft never names this mode. Draft line 132 lists the `sk-doc` nested packets by name and closes with "and the rest", so `sk-create-manual-testing-playbook` and its `/create:manual-testing-playbook` command reach the reader only through that catch-all. Its existence as a shipped `sk-doc` workflow packet is recorded in `changelog/v1.0.0.0.md`.
- MISSES a kebab-case rename that this mode's own changelog also never records. Draft line 149 says in-scope folders, files and scripts were renamed to kebab-case. `changelog/v1.0.0.0.md` names three snake_case paths for this packet (`manual_testing_playbook.md` as the root playbook, `references/manual_testing_playbook_creation.md`, and the `assets/testing_playbook/` asset folder). None of the four entries records those paths changing, yet the draft's repo-wide kebab claim implies they did. The draft's claim is broader than any evidence this changelog carries.
- The draft's spec-kit simplification paragraph at line 94 says the remediation children "realigned templates, doctor signals and playbook paths with the runtime". No entry in this mode's changelog records a playbook-path realignment, so nothing here corroborates that clause for this packet. Whether it refers to spec-kit playbooks rather than this mode is UNKNOWN from these entries alone.
- Version-claim conflict inside the changelog itself, which the draft does not surface. `changelog/v1.0.1.2.md` section 3 states `SKILL.md` stays at `1.0.1.1` and that the README version field moved to `1.0.1.2`. The `SKILL.md` frontmatter reads `version: 1.0.1.2` and the `README.md` frontmatter reads `version: 1.0.0.17`, so both halves of that claim are contradicted by the files the entry describes.
- The draft says nothing about this mode's shipped validation surface, and neither does any entry after the first. `changelog/v1.0.0.0.md` states the packet has no packet-local `scripts/`, but `scripts/validate-playbook-package.cjs` and a `scripts/tests` directory now exist with no changelog entry recording their arrival.

---

## Current version and identity

- Version in `SKILL.md` frontmatter: `1.0.1.2`. The frontmatter `name` is `sk-create-manual-testing-playbook`.
- Identity: a MODE, not a hub and not standalone. There is no `mode-registry.json` at the packet root. The parent at `.opencode/skills/sk-doc/mode-registry.json` carries the entry `"workflowMode": "sk-create-manual-testing-playbook"` with `"packetKind": "workflow"`, `"backendKind": "template-scaffold"`, `"command": "/create:manual-testing-playbook"` and `"advisorRouting": {"routingClass": "metadata"}`, which means it is resolved through hub membership and has no advisor entry of its own. The `sk-doc` root also holds `graph-metadata.json`, `hub-router.json` and `description.json`, the hub-only files, confirming `sk-doc` is the parent hub.
