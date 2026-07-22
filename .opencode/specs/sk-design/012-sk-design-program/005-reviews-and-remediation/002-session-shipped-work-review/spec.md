# Spec: Deep Review of Session-Shipped Work (3 commits on skilled/v4.0.0.0)

## Metadata

- **Level:** 3 (cross-cutting adversarial review; the 015-P0 code is a HARD-BLOCKER foundation)
- **Status:** In Review
- **Type:** Deep-review charter (read-only audit; findings only, no remediation in this packet)
- **Review target type:** git commits + their changed files, read at the v4 tip in this worktree
- **Executors:** GLM-5.2 (max) + MiniMax-M3 (high) via cli-opencode, 5 iterations each, flat pool

## 1. Problem

Three commits shipped to `skilled/v4.0.0.0` this session without an independent multi-model
review. They must be adversarially audited for correctness, honesty, and discipline BEFORE they
are relied upon — the 015 Phase-0 database foundation in particular is replayed against by three
later phases, so a subtle logic bug here silently invalidates every later parity/rollback claim.

## 2. Review Target (THE SUBJECT — read these, not this packet's own docs)

The artifacts under review are the changed files of these three commits, read at their current
state in THIS worktree. For each, inspect the introduced diff (`git show <sha> -- <path>`) AND the
current file content. This charter (`spec.md`) is the review's brief, NOT the thing being reviewed.

**2a. `bf0986cecd` — 015 Phase-0 styles-DB foundation (HIGHEST VALUE — real logic).**
All under `.opencode/skills/sk-design/styles/_db/`:
- NEW: `generation-manifest.mjs`, `stage-telemetry.mjs`, `canonical.mjs`,
  `oracle/differential-oracle.mjs`, `oracle/query-set.mjs`, `oracle/replay-fixtures.mjs`,
  `oracle/relevance-judgments.mjs`, `oracle/relevance-judgments.seed.json`, `oracle/golden/*.json`,
  and 5 test suites (`__tests__/{manifest,oracle,telemetry,fixtures,judgments}.test.mjs`).
- MODIFIED: `indexer.mjs`, `operator.mjs`, `retrieval.mjs`, `schema.mjs`, `README.md`,
  `__tests__/index.mjs`.

**2b. `9a42aedae4` — command-namespace dedup.**
- MODIFIED: `sk-design/shared/scripts/design-command-surface-check.mjs` (~2,944 lines, the authority)
  + its test + `interface-command-contract.test.mjs`; the 3 registries
  `sk-design/{command-metadata.json,hub-router.json,mode-registry.json}`; `sk-design/{README.md,SKILL.md}`.
- DELETED: `.opencode/commands/design/` (5 wrappers + 15 assets).

**2c. `dc7fdfb0a7` — sk-doc/020 naming (180 files, 0 code — all spec docs).**
All under `.opencode/specs/sk-doc/020-hyphen-naming-convention/`. Lower priority; verify the
mechanical edits did not fabricate content (esp. the added `REQ-005` rows) and that PHASE_LINKS
adjacency + the parent phase map are internally consistent.

## 3. Scope (review dimensions)

- **Correctness** — logic bugs, race/torn-read windows, off-by-one, wrong residency labels, parity gaps.
- **Honesty / no fabrication** — no faked data, tests that assert nothing, hard-coded "passing"
  numbers, gold/silver mislabeling, or claims unsupported by code.
- **Scope discipline** — changes confined to what each commit's message claims; no stray edits.
- **Comment hygiene [HARD]** — no spec/packet/phase/REQ/task/ADR ids embedded in code comments.
- **Test adequacy** — do the tests actually exercise the risk, and would they fail on the old defect?
- **Spec-doc integrity** — completion/metadata claims match reality; PHASE_LINKS + section counts sound.

## 4. Requirements (a complete review must cover)

- **REQ-001** — Verify the generation manifest publishes atomically (single fsynced pointer flip),
  rolls back correctly, and retention never prunes the current or sole rollback generation.
- **REQ-002** — Verify stage telemetry is residency-honest: a genuine (non-faked) unattributed
  bucket, and native-vs-JS labels that match the actual work each span brackets.
- **REQ-003** — Verify the differential oracle proves real byte-for-byte parity across the FULL
  scenario matrix (including vector + cursor lanes) at 1x/10x/100x, from goldens captured post-change.
- **REQ-004** — Verify the command-surface checker + 3 registries are internally consistent after the
  `/design:*` deletion, `commands/design/` is fully gone, all 5 `/interface:*` wrappers remain, and
  no doc still claims the aliases "remain / still work".
- **REQ-005** — Verify no fabrication in the sk-doc/020 doc edits (the added `REQ-005` evidence rows
  mirror each doc's own success criteria) and that phase adjacency is consistent.
- **REQ-006** — Every reported finding is verified against the actual code (file:line + concrete
  failure scenario) before it is asserted; refute speculative findings.

## 5. Success Criteria

- **Given** the 015-P0 `styles/_db/` code, **When** a reviewer traces the manifest publish path,
  **Then** either a torn-read/rollback/retention defect is reported with a concrete interleaving, or
  atomicity is confirmed sound with evidence.
- **Given** `stage-telemetry.mjs` + its hooks in `indexer.mjs`/`retrieval.mjs`, **When** a reviewer
  checks residency accounting, **Then** any faked/zero unattributed bucket or mislabeled span is
  reported with file:line, or honesty is confirmed.
- **Given** the command-dedup diff, **When** a reviewer greps the sk-design tree for surviving
  `/design:` references and re-runs the surface checker's contract, **Then** any dangling reference
  or checker/registry inconsistency is reported, or the single-namespace contract is confirmed clean.

## 6. Out of Scope

- Remediation / code changes (this packet is read-only findings; fixes route to a follow-up).
- The concurrent-writer main-tree state and any work outside the three named commits.
- Re-litigating the design decisions themselves (keep `/interface:*`; build 015-P0) — review the
  execution, not the mandate.

## 7. Related Documents

- `review/review-report.md` — synthesized findings (written by the fanout lineages).
- Source commits: `bf0986cecd`, `9a42aedae4`, `dc7fdfb0a7` on `skilled/v4.0.0.0`.
