# Iteration 1 — D1: Metadata-Generation Tooling Correctness

- **Dimension:** D1 (schema: correctness) — metadata-generation tooling correctness
- **Mode:** review (single iteration, stop_policy=max-iterations; this is iteration 1 of 10 — no early convergence)
- **Agent:** deep-review (LEAF, GLM-5.2)
- **sessionId:** rv-phase009-audit-20260701-184748
- **Status:** complete (read-only diagnostic; no phase-009 file modified)

## Dimension (D1)

Is the malformed `graph-metadata.json` an isolated one-off, or a systemic defect in `create.sh --phase` / the scaffolding tool? Is the loader-vs-validator inconsistency a genuine tooling defect or an intentional migration gate? When/how was the file created?

## Files Reviewed

- `009-.../graph-metadata.json` (full, 7 lines, plain text) — CONFIRMED unparseable
- `010-.../graph-metadata.json` (full, 216 lines, valid schema-conformant JSON) — sibling comparison
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:402-480` (`create_graph_metadata_file`, incl. early-return guard 408-410 and JSON heredoc 452-479)
- `.opencode/skills/.../graph/graph-metadata-parser.ts:245-456` (`parseLegacyGraphMetadataContent`, `validateGraphMetadataContent`, `loadGraphMetadata`)
- `.opencode/skills/.../validation/generated-metadata-integrity.ts:69-282` (`readJsonFile`, `validateGraphMetadataFile`, `resolveGeneratedMetadataIntegrity`)
- `.opencode/skills/.../config/capability-flags.ts:76-102` (`isGeneratedMetadataGrandfatherEnabled`, default-OFF/enforcing)
- `review/deep-review-strategy.md` (full, incl. seeded Known Context §13) — adversarially re-derived

Commands run (read-only): repo-wide `JSON.parse` sweep over 2425 `graph-metadata.json`; `git ls-files`, `git log --follow`, `git show 540fac01e4 --name-status`, `git diff HEAD`, blob compare at commit; `git stash list`.

## Findings by Severity

### P0 (Critical): none.

### P1 (Major): none.

### P2 (Minor): 3 new.

---

#### D1-P2-001 — Loader/validator read-path inconsistency: legacy plain-text loads silently at runtime, hard-fails strict validation

- **Claim:** Two code paths that read the same `graph-metadata.json` disagree on validity. The runtime loader (`graph-metadata-parser.ts`) accepts the legacy key:value plain-text format and returns `migrated:true, migrationSource:'legacy'` without error. The strict validator (`generated-metadata-integrity.ts`) does a raw `JSON.parse` with no legacy fallback and emits `FILE_UNPARSEABLE`. A folder can therefore sit in a half-migrated state (loads at runtime, fails `validate.sh --strict`) with no runtime signal that migration is pending.
- **evidenceRefs:**
  - `graph-metadata-parser.ts:356-433` `validateGraphMetadataContent` — try strict schema → try lenient `graphMetadataLoadSchema` → try `parseLegacyGraphMetadataContent` (3-tier tolerance).
  - `graph-metadata-parser.ts:245-276` `parseLegacyGraphMetadataContent` — requires only `Packet` + `Spec Folder` keys to succeed; this file has both.
  - `graph-metadata-parser.ts:401-413` — legacy success path returns `ok:true, migrated:true, migrationSource:'legacy'`.
  - `generated-metadata-integrity.ts:69-92` `readJsonFile`/`validateGraphMetadataFile` — single `JSON.parse`, no legacy path; emits `FILE_UNPARSEABLE` on throw.
- **counterevidenceSought (and result):** Checked whether grandfather mode carves out `FILE_UNPARSEABLE`. It does NOT — `resolveGeneratedMetadataIntegrity` (lines 253-281) applies the `grandfather` boolean UNIFORMLY to all violation codes; with grandfather OFF every code (incl. `FILE_UNPARSEABLE`) resolves to `error`. So the flag cannot be used to "tolerate unparseable while enforcing schema drift" — it is all-or-nothing.
- **alternativeExplanation:** This could be an intentional one-way migration gate (load tolerantly so runtime never breaks; reject strictly so operators are forced to regenerate). The legacy loader's explicit `migrated:true` marker and `source:'legacy'` provenance support this reading.
- **finalSeverity:** **P2.** Coherent-by-design migration gate, low observed blast radius (1/2425 files manifest the half-migrated state), documented fix path (regenerate). NOT a crash or data-loss path: the loader never throws on this file.
- **confidence:** 0.82
- **downgradeTrigger / upgradeTrigger:** Keep P2. **Upgrade to P1 if** a second repo-wide sweep finds ≥1 additional unparseable file (would prove recurrence, not one-off escapee), OR if any production runtime path consumes the `migrated:true` metadata as if it were current and acts on stale `derived` fields. Downgrade to informational if a code comment / ADR documents the load-tolerant/reject-strict split as deliberate policy.

---

#### D1-P2-002 — `create_graph_metadata_file` early-return guard prevents self-heal of malformed legacy files

- **Claim:** `create_graph_metadata_file` returns immediately when `graph-metadata.json` already exists, so re-running `create.sh --phase` (or any re-scaffold) cannot replace a malformed legacy file. Combined with D1-P2-001's tolerant loader, a stale/legacy file persists indefinitely and is only surfaced by an explicit `validate.sh --strict` run.
- **evidenceRefs:**
  - `create.sh:408-410` — `if [[ -f "$graph_path" ]]; then return 0; fi` (unconditional early return; no content-validity check).
  - `create.sh:452-479` — the JSON heredoc that WOULD be written is schema-conformant (matches sibling 010's shape), confirming the current tool is NOT the source of the plain-text format.
  - Sibling `010-.../graph-metadata.json` (same packet, same generation lineage) is valid JSON — the guard + valid generator means re-scaffolding cannot be the remediation path; regeneration must go through `backfill-graph-metadata.ts` / `generate-context.js`.
- **counterevidenceSought (and result):** Verified the current heredoc output shape against sibling 010: both carry `schema_version`, `packet_id`, `spec_folder`, `parent_id`, `manual`, `derived`. The current tool cannot emit the 7-line plain-text format. So the guard's no-overwrite behavior is only harmful for files it did NOT create.
- **alternativeExplanation:** The guard exists to protect hand-edited `manual.depends_on`/`supersedes`/`related_to` blocks from being clobbered by a re-scaffold — a legitimate data-preservation intent. The defect is the absence of a "file exists but is structurally invalid → regenerate" branch, not the guard's existence.
- **finalSeverity:** **P2.** Defense-in-depth gap, not an active bug for well-formed files.
- **confidence:** 0.78
- **downgradeTrigger / upgradeTrigger:** Upgrade to P1 if the guard is found to also block a *validity-checked* regeneration entrypoint (i.e. no operator command can repair a malformed file without manual `rm`). Downgrade to informational if a documented `backfill --force`/`regenerate` path already bypasses the guard (D4 will verify the backfill write path).

---

#### D1-P2-003 — Seeded Known Context arithmetic error: "~53 min after" is actually ~4h53m

- **Claim:** `deep-review-strategy.md:92` states the malformed file's mtime is "~53 min after the other phase-009 scaffold files at 06:47:26". The actual mtime is `11:40:36` (local, +0200) → `11:40:36 − 06:47:26 = 4h 53m 10s`, not 53 minutes. The seeded figure dropped the 4-hour component. Logged as an adversarial correction to the seeded context (which the brief instructed to verify, not trust).
- **evidenceRefs:** `stat`/`ls` mtimes captured: spec.md/plan.md/tasks.md/implementation-summary.md = 06:47:26; graph-metadata.json = 11:40:36 (all 2026-07-01, local +0200). handover.md = 06:50:17; description.json = 07:32:33.
- **counterevidenceSought:** Confirmed commit `540fac01e4` timestamp = `2026-07-01 16:35:25 +0200`; file mtime 11:40:36 precedes commit by ~4h55m, consistent with "written earlier, committed later" (not a post-commit edit).
- **alternativeExplanation:** Could be a typo of "4h53m" → "53m" rather than a misread. Either way the stated gap is wrong by ~4h and would mislead a timeline reconstruction.
- **finalSeverity:** **P2** (strategy-doc accuracy; scoped to the review packet, not a phase-009/tooling defect).
- **confidence:** 0.95
- **downgradeTrigger:** n/a (factual, already corrected below).

---

## Traceability Checks

| Protocol | Result | Evidence |
|---|---|---|
| `spec_code` (core) | checked (partial) | create.sh + 3 TS modules read in full; no test execution (read-only diagnostic). |
| `checklist_evidence` (core) | notApplicable | Level 1 phase; no checklist.md (per strategy §14). |
| `skill_agent` (overlay) | checked | system-spec-kit scaffolding tool (`create.sh`) is the producing agent; its output contract (JSON heredoc) verified against sibling 010. |
| `agent_cross_runtime` (overlay) | notApplicable | Not an agent-definition review. |
| `feature_catalog_code` (overlay) | notApplicable | Not a feature-catalog review. |
| `playbook_capability` (overlay) | notApplicable | Not a playbook review. |

## Verdict

D1 is **covered** for iteration 1 (genuine, non-duplicate coverage achieved). Summary against the three objective questions:

1. **Isolated vs systemic? — CONFIRMED isolated.** Repo-wide sweep: exactly **1 of 2425** `graph-metadata.json` files fails `JSON.parse` (re-derived independently; matches seeded figure). Current `create_graph_metadata_file` (create.sh:452-479) emits valid schema-conformant JSON; sibling 010 is valid. The systemic *risk* (early-return guard + tolerant loader letting stale files persist silently) is captured as D1-P2-001/D1-P2-002, but the current scaffolding tool does NOT reproduce this format. Confidence 0.90.
2. **Loader-vs-validator inconsistency genuine? — CONFIRMED genuine as a behavior split; assessed P2 (not P1).** The split is real and the grandfather flag does NOT selectively cover `FILE_UNPARSEABLE` (it is uniform, default-OFF/enforcing per capability-flags.ts:99-102). It reads as a coherent one-way migration gate by design, with a latent footgun (silent half-migration). See D1-P2-001 for the upgrade trigger to P1. Confidence 0.82.
3. **When/how created? — PARTIALLY CONFIRMED, mechanism UNRESOLVED.** CONFIRMED: the plain-text content was committed as-is in `540fac01e4` (blob at commit == working tree, zero diff); commit at `2026-07-01 16:35:25 +0200`; content matches a *recognized* legacy key:value schema whose field names (`Packet`, `Spec Folder`, `Status`, `Importance Tier`, `Summary`, `Key Files`, `Source Docs`) map exactly to the aliases in `parseLegacyGraphMetadataContent` (graph-metadata-parser.ts:272-290) — i.e. the loader was explicitly built to migrate files in THIS shape. UNRESOLVED (honest): the exact producing mechanism — older `create.sh` version, a now-superseded template, a different packet-scaffolding entrypoint, or agent hand-authoring from a stale template — cannot be determined from the evidence gathered. What would resolve it: `git log -p -- .opencode/skills/system-spec-kit/scripts/spec/create.sh` to find when `create_graph_metadata_file` switched from a plain-text emitter to the JSON heredoc; and a search for any historical restamp/migration script and whether it carried an exclusion that could skip exactly one file. Confidence on "committed as-is, legacy-format at commit time" 0.95; on "exact mechanism" 0.40 (stated inferred, not claimed).

**Non-obvious edge cases enumerated:** (a) The plain-text format is NOT random hand-authoring — it follows a schema the loader was purpose-built to parse, which argues for "older tool version or stale template" over "ad hoc human text." (b) Other repo-wide writers of `graph-metadata.json` besides `create.sh`: `writeGraphMetadataFile`/`serializeGraphMetadata` (graph-metadata-parser.ts:1446-1448, valid JSON via schema), `backfill-graph-metadata.ts` refresh path, and `generate-context.js` (canonical save path) — ALL emit schema-conformant JSON, so none is the source of the plain-text format under current code. (c) The early-return guard (D1-P2-002) means `git checkout`/re-clone preserves the bad blob forever; only an explicit regeneration (backfill/generate-context) or manual repair can fix it — re-running scaffolding cannot.

## SCOPE VIOLATIONS

None. All writes confined to the allowed paths (`review/iterations/iteration-1.md`, `review/deep-review-state.jsonl` append, `review/deltas/iter-001.jsonl`, in-place `review/deep-review-strategy.md`, in-place `review/deep-review-findings-registry.json`). No file under `009-.../` outside `review/` was created, modified, deleted, or renamed. No live (non-dry-run) fix was executed or recommended (per brief — that decision belongs to synthesis/operator).

## Next Dimension

**D2 — ownership traceability.** The "owned by a separate concurrently in-flight OpenCode session" claim is asserted in packet-root `spec.md` + `changelog/changelog-032-root.md` but, per seeded context, never independently verified. Re-derive from: `.deep-review.lock` (present in `review/`), `git reflog`/`git stash list` (already partially checked — no 009/032 matches), packet-root docs, and cross-references. Weigh the counter-consideration that a remote/other-machine session would not appear in local git state.
