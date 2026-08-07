---
iteration: 2
dimension: traceability
focus: 012/006 command-surface dedup (REQ-004) + sk-doc/020 mechanical edits (REQ-005) + 015-P0 implementation-summary alignment
sessionId: fanout-minimax-m3-high-1784606267078-bpkeoi
generation: 1
lineageMode: new
status: complete
filesReviewed:
  - .opencode/commands/design/ (verified absent)
  - .opencode/commands/interface/ (5 wrappers verified present)
  - .opencode/skills/sk-design/command-metadata.json
  - .opencode/skills/sk-design/hub-router.json
  - .opencode/skills/sk-design/mode-registry.json
  - .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs
  - .opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs
  - .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs
  - .opencode/skills/sk-design/SKILL.md
  - .opencode/skills/sk-design/README.md
  - .opencode/skills/sk-design/feature-catalog/creation-command-surface/interface-creation-commands.md
  - .opencode/skills/sk-design/feature-catalog/feature-catalog.md
  - .opencode/skills/sk-design/changelog/v1.6.0.0.md
  - .opencode/skills/sk-design/styles/manual-testing-playbook.md
  - .opencode/specs/sk-design/012-sk-design-program/003-interface-commands/002-retire-design-alias-namespace/spec.md
  - .opencode/specs/sk-design/012-sk-design-program/003-interface-commands/002-retire-design-alias-namespace/implementation-summary.md
  - .opencode/specs/sk-design/012-sk-design-program/003-interface-commands/002-retire-design-alias-namespace/tasks.md
  - .opencode/specs/sk-design/012-sk-design-program/003-interface-commands/002-retire-design-alias-namespace/checklist.md
  - .opencode/specs/sk-design/012-sk-design-program/003-interface-commands/002-retire-design-alias-namespace/graph-metadata.json
  - .opencode/specs/sk-doc/020-hyphen-naming-convention/ (sample docs)
findingsCount: 4
findingsNew: 4
findingsSummary: P0=0, P1=4, P2=0
newFindingsRatio: 0.67
timestamp: 2026-07-21T05:59:30.000Z
durationMs: 240000
---

# Iteration 2 — Traceability on 012/006 + sk-doc/020 (REQ-004, REQ-005, packet metadata)

## Scope

Three traceability concerns:

- **REQ-004** — command-surface checker + 3 registries internally consistent after
  `/design:*` deletion; `commands/design/` fully gone; all 5 `/interface:*` wrappers
  remain; no doc still claims the aliases "remain / still work".
- **REQ-005** — no fabrication in the sk-doc/020 doc edits (the added `REQ-005` evidence
  rows mirror each doc's own success criteria); PHASE_LINKS adjacency consistent.
- **Packet metadata honesty** — the commit message's verification claims must reconcile
  with the spec packet's own metadata (frontmatter `recent_action`,
  `completion_pct`, `session_dedup.fingerprint`; `implementation-summary.md`;
  `graph-metadata.json status`; tasks.md checkboxes).

Live verification: surface checker executed; 015-P0 test suites re-run from iteration 1.

## Findings

### F3 [P1] — `012/006/spec.md` frontmatter records pre-implementation state

**Severity**: P1. **Category**: Traceability / spec metadata honesty.

**Evidence**:

- `.opencode/specs/sk-design/012-style-database-and-interface-commands/006-retire-design-alias-namespace/spec.md:25-26`:
  ```
  recent_action: "Author the /design:* retirement spec (AUTHOR-SPEC stage)"
  next_safe_action: "Re-key checker + 3 registries, delete commands/design/, run checker + tests"
  ```
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/006-retire-design-alias-namespace/spec.md:24`:
  `completion_pct: 0`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/006-retire-design-alias-namespace/spec.md:21`:
  `session_dedup.fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"`
  (zero placeholder, never recomputed)

**What this is**: the spec packet's frontmatter continuity says the work is at AUTHOR-SPEC
stage with 0% completion and a placeholder fingerprint, but the work shipped in commit
`9a42aedae4` (the same commit that *added* this packet). The commit message says
"Verified: design-command-surface-check.mjs exits 0 ... validate.sh --strict on 012/006
= 0/0" — the spec packet's own metadata contradicts that.

**Why this is P1, not P0**: the implementation is correct (the live surface checker
exit confirms it; the dangling `/design:*` docs are a separate finding F6). The defect
is bookkeeping — the metadata is stale. But stale "AUTHOR-SPEC" + 0% completion is
misleading to any downstream reader (review tooling, /speckit:resume, automation that
reads `completion_pct`), and the all-zero `session_dedup.fingerprint` would break any
dedup logic that treats zero hashes as authoritative. This is in scope of REQ-005
("completion/metadata claims match reality") and the comment-hygiene / honesty guard.

**Repro**: read the frontmatter; compare against `git show 9a42aedae4 -- <packet>`. The
packet was authored and shipped in the same commit; the frontmatter was never updated
post-implementation.

### F4 [P1] — `012/006/implementation-summary.md` content contradicts shipped state

**Severity**: P1. **Category**: Traceability / spec doc honesty.

**Evidence**:

- `.opencode/specs/sk-design/012-style-database-and-interface-commands/006-retire-design-alias-namespace/implementation-summary.md:2`:
  `description: "AUTHOR-SPEC stage: the spec/plan/tasks/checklist for retiring the
  /design:* alias namespace are authored; implementation is pending. ..."`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/006-retire-design-alias-namespace/implementation-summary.md:52`:
  `**Planned change — not yet implemented.** This phase is authored, not executed:
  ...`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/006-retire-design-alias-namespace/implementation-summary.md:104`:
  `| Keep \`/interface:*\`, retire \`/design:*\` entirely | Frozen operator decision
  ...`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/006-retire-design-alias-namespace/implementation-summary.md:105`:
  ```
  | `rg -n '/design:'` — no command token in checker + 3 registries; `commands/design/` absent | PENDING
  ```
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/006-retire-design-alias-namespace/implementation-summary.md:111`:
  `| All tasks [x] with evidence; the surface checker exits 0; ... validate.sh --strict = 0 errors. | PENDING`

**What this is**: the implementation-summary.md was added by commit `9a42aedae4` in
AUTHOR-SPEC state. Its body says "Planned change — not yet implemented" and the status
column shows PENDING for every executable-contract row. But the actual code state is:

- `commands/design/` is **absent** (`ls .opencode/commands/design/` → No such file or directory).
- All 5 `/interface:*` wrappers are **present** in `.opencode/commands/interface/`.
- `command-metadata.json`, `hub-router.json`, `mode-registry.json` are re-keyed.
- The surface checker exits 0 (verified live).
- `validate.sh --strict` on the 012/006 packet returns 0/0 (verified live).

The doc body contradicts every one of those facts.

**Why this is P1**: the same as F3 — the implementation is correct; the doc body is
stale and misleading. Any review tooling that reads the implementation-summary as
authoritative will produce wrong verdicts. This is the strongest single piece of evidence
that the packet was never post-implemented.

### F5 [P1] — `012/006/graph-metadata.json` status is `planned` for shipped work

**Severity**: P1. **Category**: Traceability / graph-metadata honesty.

**Evidence**:

- `.opencode/specs/sk-design/012-style-database-and-interface-commands/006-retire-design-alias-namespace/graph-metadata.json:42`:
  `"status": "planned"`
- The same `derived` block lists `key_files` that include
  `.opencode/commands/design/` (the deleted tree) but does NOT include
  `.opencode/commands/interface/` (the surviving wrappers) or
  `.opencode/skills/sk-design/mode-registry.json`.

**What this is**: the graph-metadata was generated at AUTHOR-SPEC time. It claims
`status: planned` for a packet whose implementation has shipped. The `key_files` list
points at a path that no longer exists (`.opencode/commands/design/`) and omits paths
that do (`.opencode/commands/interface/`, the three registries that were re-keyed).

**Why this is P1**: same as F3/F4 — bookkeeping defect that misleads downstream
consumers (memory search, graph traversal, completion gates). The graph says
"planned", the code says "shipped".

### F6 [P1] — Stale `/design:*` "remain" prose in feature-catalog and playbook docs

**Severity**: P1. **Category**: Traceability / doc-consistency with the executable state.

**Evidence**:

- `.opencode/skills/sk-design/feature-catalog/creation-command-surface/interface-creation-commands.md:3`:
  `description: "Five canonical /interface:* creation commands, one shared nine-stage
  contract, and additive /design:* compatibility aliases."`
- Same file, line 20: `The former \`/design:{interface,foundations,motion,audit,md-generator}\`
  commands remain thin compatibility aliases. ...`
- Same file, line 30: `Compatibility metadata maps each \`/design:*\` alias one-to-one
  to a canonical \`/interface:*\` command. ...`
- Same file, line 43: `| \`.opencode/commands/design/*.md\` | Compatibility routers |
  Preserves the five \`/design:*\` aliases. |` (table row in a markdown table that
  references the now-deleted tree).
- `.opencode/skills/sk-design/feature-catalog/feature-catalog.md:201`:
  `The corresponding \`/design:*\` commands remain thin compatibility aliases.`
- `.opencode/skills/sk-design/changelog/v1.6.0.0.md:26`:
  `- \`/design:interface\`, \`/design:foundations\`, \`/design:motion\`, \`/design:audit\`
  and \`/design:md-generator\` remain thin compatibility aliases.`
- `.opencode/skills/sk-design/styles/manual-testing-playbook.md:3`:
  `description: "Lean manual scenarios for verifying the packet-012 style database
  ... and the /interface:* creation commands + /design:* aliases."`
- Same file, line 29: `| CMD-03 | \`/design:*\` aliases resolve to the canonical
  commands | Backward compatibility preserved | \`commands/design/*.md\` |`
  (references the deleted tree).

**What this is**: commit `9a42aedae4` updated `SKILL.md` (line 288) and `README.md`
(line 70) to state that the namespace is "retired" and `/interface:*` is the sole
surface, BUT left four feature-catalog/playbook/changelog files claiming the aliases
"remain" and (in two places) referencing the deleted `commands/design/` directory.

**Conflict with the spec packet**: `tasks.md:60` T006 explicitly requires
"Reconcile the dangling `/design:*` alias prose in the ungated docs
(`SKILL.md`, `README.md`, `feature-catalog/**`, `styles/manual-testing-playbook.md`)".
`checklist.md:97` CHK-050 [P1] requires "Dangling `/design:*` alias prose reconciled
in the ungated docs (...feature-catalog/**, styles/manual-testing-playbook.md); a new
changelog entry records the retirement". **Both T006 and CHK-050 are unchecked** (`[ ]`).

The commit message says: "Reconcile README.md + SKILL.md prose - the aliases no
longer 'remain' / 'still work'; the sole surviving mentions state the namespace is
retired." This is only true for `SKILL.md` and `README.md`. The reconcile step for
`feature-catalog/**` and `styles/manual-testing-playbook.md` was NOT performed.

**Why this is P1**: the executable state is correct (the `/design:*` namespace is
genuinely retired; `commands/design/` is gone), but the doc prose contradicts it. Any
reader relying on the feature-catalog will believe the aliases still resolve. The
checklist's CHK-050 is the contract; it is unchecked.

**Live verification**: `rg -n '/design:' .opencode/skills/sk-design/` confirms the
nine hits above (excluding `node_modules`/git); four are pre-existing changelog
references (older versions, OK), five are stale "remain" prose (defect).

### Note on REQ-005 — sk-doc/020 mechanical edits

The commit claims 33 docs gained `REQ-005` rows "each mirroring that doc's own
success-criterion evidence deliverable (no invented scope; 4 → 5 requirements to
meet the Level-2 minimum)" and that 67 child spec.md files gained PHASE_LINKS
"predecessor/successor cross-references (121 → 0 gaps)".

**Spot-check sample** (3 of the 33 docs claimed):

- `.opencode/specs/sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/004-cli-codex/spec.md` REQ-005: `The map is reversible | Source-target entries are bijective, collision-free, and git-revertable`. Plausibly mirrors a success-criterion evidence deliverable; not fabricated scope.
- `.opencode/specs/sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/002-catalog-and-playbook-generators/spec.md` REQ-005: `Coexisting physical roots fail closed | A fixture containing both the underscore and hyphen root fails with the phase 002 conflict diagnostic rather than choosing one silently.` Plausibly mirrors the SC-002 success criterion.
- `.opencode/specs/sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census/spec.md` REQ-005: `The baseline records test-discovery counts, strict-validate output, and Lane C scenario IDs+scores | Each is captured to a file keyed by BASE`. Plausibly mirrors a baseline-evidence deliverable.

**PHASE_LINKS spot-check**: the diff shows the additions are short, single-line
adjacency notes (e.g., `> Phase adjacency — successor \`002-catalog-and-playbook-generators\`.`)
matching the commit's "121 → 0 gaps" claim. They are mechanical and consistent.

**Caveat**: an exhaustive spot-check of all 33 docs is beyond the per-iteration budget.
The commit message's claim is consistent with the surface evidence (REQ-005 rows are
content-bearing, not boilerplate; PHASE_LINKS are short adjacency notes), and
`validate.sh --strict` passes (which is the authoritative signal that REQ-005 + PHASE_LINKS
are within doc-validation tolerance). **No defect reported on the mechanical edits
themselves; the defect surface is the 012/006 packet's metadata (F3-F5), not the 020
edits.** REQ-005 passes the traceability check on the 020 side.

## Confirmed-correct claims (negative findings — no defect)

### REQ-004 — surface checker + 3 registries internally consistent

- `node .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`
  → `STATUS=VALID STAGE=complete ... SUMMARY invalid=0 drift=0` (5 commands,
  15 assets). ✓
- `node --test design-command-surface-check.test.mjs interface-command-contract.test.mjs`
  → **15/15 pass** in ~40ms. ✓
- `.opencode/commands/design/` is **absent** (`ls` returns No such file or directory). ✓
- All 5 `/interface:*` wrappers **present** in `.opencode/commands/interface/`
  (`audit.md`, `design.md`, `design-reference.md`, `foundations.md`, `motion.md`). ✓
- 15 `interface-*-{auto,confirm,presentation}.{yaml,yml,txt}` assets
  present under `.opencode/commands/interface/assets/`. ✓
- `command-metadata.json`: 5 records, all keyed `/interface:*` (verified via
  Python parse). ✓
- `hub-router.json`: `tieBreak` lists 5 modes + `design-mcp-open-design`
  transport (the transport's `command:null` is preserved per CHK-032). ✓
- `mode-registry.json`: 6 modes with `/interface:*` commands + transport with
  `command: null` (verified via Python parse). ✓
- **No `compatibilityAliases` or `canonicalCommand` field anywhere in the three
  registries** (`grep` returns no hits). ✓
- CHK-031, CHK-020, CHK-021, CHK-032 all hold against the live state. ✓

### REQ-005 (sk-doc/020 mechanical edits) — no fabrication found

- Spot-checks above show the added `REQ-005` rows mirror success-criterion evidence.
- PHASE_LINKS additions are short, single-line adjacency notes (mechanical).
- `validate.sh --strict` on the 012/006 packet returns 0/0 (verified live).
- The commit message's "no invented scope" claim is consistent with the spot-checks.

### Comment hygiene [HARD] on the 015-P0 + 012/006 code paths

- `grep -nE "REQ-[0-9]|T0[0-9]+|012/006|015/001" .opencode/skills/sk-design/styles/_db/*.mjs ...`
  returns no hits in code comments. ✓
- `grep -nE "REQ-[0-9]|T0[0-9]+|012/006|015/001" .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs ...`
  returns no hits in code comments. ✓
- The `[HARD]` comment-hygiene rule holds across both 015-P0 and 012/006 source code.

## Verdict

- **P0**: 0
- **P1**: 4 — packet metadata is stale (F3-F5), dangling `/design:*` "remain"
  prose contradicts the executable state (F6). The 012/006 spec packet claims
  AUTHOR-SPEC / planned / 0% completion / "not yet implemented" while the
  code state is fully shipped. The T006 + CHK-050 reconciliation step was
  not performed.
- **P2**: 0

**Conditional release-readiness signal**: the underlying code is correct and
executable (surface checker exits 0, tests green, deletion confirmed, registries
re-keyed). The defect surface is bookkeeping + doc-prose hygiene — none block
the executable contract. The remediation is a follow-up packet that updates the
012/006 packet metadata to shipped state and reconciles the dangling `/design:*`
prose in the four feature-catalog/playbook files plus a fresh changelog entry.

Review verdict: CONDITIONAL