---
title: "Roadmap: sk-code-obsidian surface and source-convention adoption"
description: "Level-agnostic forward plan for near-term, next-step and later work."
trigger_phrases:
  - "roadmap"
  - "forward plan"
  - "now next later"
  - "sk-code-obsidian roadmap"
importance_tier: "normal"
contextType: "general"
---
# Roadmap: sk-code-obsidian surface and source-convention adoption

<!-- SPECKIT_TEMPLATE_SOURCE: roadmap | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Sequences eleven phases from designing the surface packet through renaming the plugin source,
> and records where the work actually stands.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** `sk-code-obsidian` surface packet and the plugin conventions it documents
**Status:** Active
**Horizon:** through the merge of `worktrees/001-sk-code-obsidian-surface` into `impl`
**Owner:** Michel Kerkmeester
**Last updated:** 2026-08-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:now-next-later -->
## 2. PHASES: NOW / NEXT / LATER

**Now:** In Progress. Focus: phases 001 and 002 — designing the packet against the live `sk-code`
hub contract, and recording the measured state of the plugin tree. The audit is captured in
`002-repo-convention-audit/audit.json`; the design plan is being written. Exit signal: the plan
cites the real registry schema and the real detection contract, and every convention it proposes
maps to a measured gap.

**Next:** Planned. Focus: phases 003 through 008 — wiring the `OBSIDIAN` surface into the hub,
authoring the packet, and writing the three scanners. Exit signal: a plugin prompt routes through
`compiled-route.cjs` to a bundled `sk-code-obsidian`, the fleet metadata gate exits 0, and each
scanner reports a non-zero finding count against the current unconverted tree.

**Later:** Planned. Focus: phases 009 through 013 — applying the conventions to the plugin source,
the kebab-case rename, and the closing verification. Exit signal: every scanner passes, every
plugin gate is green from the final state, and the packet validates through the hub path with no
errors, and both conformance gates pass: every packet markdown audited against its sk-doc
template, and every claim the surface makes about the plugin proven true of the plugin tree.
<!-- /ANCHOR:now-next-later -->

---

<!-- ANCHOR:milestones-targets -->
## 3. MILESTONES & TARGETS

**Worktree and baseline:** phase Now, target 2026-08-28. Status: Done. Evidence: worktree
`worktrees/001-sk-code-obsidian-surface` allocated by sk-git; gates measured at tsc 0, build 0,
vitest 386 pass across 49 files, screenshots 180 current, lint 115 known problems.

**Measured convention audit:** phase Now, target 2026-08-28. Status: Done. Evidence:
`002-repo-convention-audit/audit.json` — 0 of 249 files carry a `MODULE:` banner, 0 folder
documents exist, 232 of 248 filenames are PascalCase, `styles.css` is 18,931 lines with 1,196
distinct `.db-*` classes.

**Surface design plan:** phase Now, target on completion of 001. Status: In Progress. Evidence:
`001-surface-design-plan/`.

**Hub routing live:** phase Next, target on completion of 003. Status: Planned. Evidence:
`compiled-route.cjs --hub sk-code` bundling the surface instead of deferring.

**Packet complete:** phase Next, target on completion of 007. Status: Planned. Evidence: tree diff
against `sk-code-mobile-cli` showing the same file and folder shape.

**Scanners executable:** phase Next, target on completion of 008. Status: Planned. Evidence: each
`tools/naming/scan-*.mjs` reporting findings against the unconverted tree — a scanner that passes
before the work is done is not measuring anything.

**Source converted:** phase Later, target on completion of 010. Status: Planned. Evidence: clean
build, 386 passing tests, and a regenerated capture manifest.
<!-- /ANCHOR:milestones-targets -->

---

<!-- ANCHOR:dependencies -->
## 4. DEPENDENCIES

**Validation through the hub path:** needed by every phase, owner this packet. Status: Ready. Risk
and mitigation: `validate.sh` run from inside the plugin repository exits 0 and prints nothing even
for a packet missing required files, so a phase could close against a false pass. Mitigated by
validating through `.opencode/specs/obsidian-wt001/...` and reading the `RESULT:` lines rather than
the process exit code, which is unreliable under `--recursive`.

**System Chrome for captures:** needed by phase 010, owner the capture harness. Status: Ready.
Risk and mitigation: the rename invalidates all 180 captures because `verify.mjs` hashes the source
paths recorded in `screenshots/manifest.json`. Mitigated by regenerating with `npm run screenshots`
as part of the rename phase; Chrome is present, so `SCREENSHOT_CHROME` is not needed.

**`sk-code` hub contract stability:** needed by phase 003, owner the `sk-code` hub. Status: Open.
Risk and mitigation: the registry and router are compiled-routing lockstep surfaces, so a wiring
change must re-mint the compiled-route manifest. Mitigated by treating the re-mint and the fleet
metadata gate as part of the phase, not as follow-up.

**Operator decision on stylesheet strategy:** needed by phase 009, owner Michel Kerkmeester. Status:
Open. Risk and mitigation: sectioning 18,931 lines in place is safe; splitting the file changes the
load order the tests and the capture harness depend on. Mitigated by defaulting to in-place
sectioning unless the operator asks for a split.
**Generated packet metadata:** needed by every phase's clean validate, owner the Spec Kit Memory
MCP. Status: Blocked. Risk and mitigation: `description.json` and the `source_fingerprint` field
cannot be produced in this environment. `generate-context.js` exits 0 and writes nothing when run
from the plugin repository, and its path-traversal guard rejects the hub symlink because the
canonical target resolves outside the hub repository. The likely owner is the MCP `memory_save`
content-router path, which `system-spec-memory` serves and which failed to connect this session;
`generate-context.js` documents that it writes no canonical doc content itself. Corroborating
evidence: `002-ui-improvement-research` in this same repository has neither file. Until the server
is reachable, every leaf carries two standing errors — `description.json: FILE_MISSING` and
`SOURCE_FINGERPRINT_MISSING` — plus a `causal_summary` drift warning. They are environmental, not
authoring defects, and no phase may be closed by suppressing them.

<!-- /ANCHOR:dependencies -->
