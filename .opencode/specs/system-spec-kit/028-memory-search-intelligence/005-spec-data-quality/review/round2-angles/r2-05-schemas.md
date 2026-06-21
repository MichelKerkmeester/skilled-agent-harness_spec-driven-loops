# R2-05 Schemas (code-quality angle)

**Angle summary:** The 003 enum-constrain and 004 warn-to-error premises are mostly accurate about the seams they name, but 003 underspecifies the producer side. The proposed status enum omits a value the live producer actually emits, the importance_tier producer has no normalizer at all, and the default-off enforcement flag cannot gate an enum baked into a schema that the producer parses unconditionally.

Live files read: `graph-metadata-schema.ts` (1-91), `description-schema.ts` (1-155), `graph-metadata-parser.ts` (1-1378). Spec premises read: 003 `spec.md` + `plan.md`, 004 `spec.md` + `plan.md`.

Confirmed-clean premises (no finding):
- `SAVE_LINEAGE_VALUES` constant-then-enum pattern is real and fully reusable: `export const SAVE_LINEAGE_VALUES = [...] as const` (`graph-metadata-schema.ts:11`), `z.enum(SAVE_LINEAGE_VALUES)` (`:50`), `type SaveLineage = typeof SAVE_LINEAGE_VALUES[number]` (`:17`). 003 REQ-004 is accurate.
- `importance_tier` and `status` are free `z.string().min(1)` at `graph-metadata-schema.ts:43-44`, `save_lineage` already uses the enum at `:50`, description `type` is bare `z.string().optional()` at `description-schema.ts:64`, and the description schema carries no `importance_tier` or `content_type` field. All accurate.
- `.passthrough()` semantics in 003 REQ-005 are stated correctly: passthrough preserves undeclared keys only, a declared-but-out-of-enum field still rejects.

---

## FINDINGS

### P1 (SPEC-PREMISE) — 003 REQ-003 producer guard is incomplete: three leak paths, the spec names one
003 REQ-003 claims "deriveStatus and deriveImportanceTier only ever produce in-enum values" and proposes closing only the `normalizeDerivedStatus` default branch. Live code has three out-of-enum producer paths into the same `graphMetadataSchema.parse` call at `graph-metadata-parser.ts:1125`:
1. `normalizeDerivedStatus` default branch returns the raw normalized token (`graph-metadata-parser.ts:180`). Named by the spec.
2. `deriveStatus` returns the literal `'unknown'` (`graph-metadata-parser.ts:1041`) when a ranked doc read is `unknown`. `'unknown'` is NOT in the proposed status enum `{complete, in_progress, planned}` (003 REQ-002), so the moment status becomes that enum a derive that hits this branch throws. Not named anywhere in the spec.
3. `deriveImportanceTier` (`graph-metadata-parser.ts:1071-1079`) returns the raw frontmatter `importance_tier` scalar read at `:645` with no normalizer of any kind, fallback `'important'`. A spec whose frontmatter declares `importance_tier: "high"` (the exact out-of-enum example in 003 REQ-001) returns `"high"` into the tier enum and throws. REQ-003 names the function but proposes no guard for it, and the scope table at `003/spec.md:95` plus the risk row at `:140` mention only `normalizeDerivedStatus`.
Evidence (live code): `graph-metadata-parser.ts:1041,1071-1079,180,645,1110,1125`. Evidence (premise): `003/spec.md:109` REQ-003, `003/spec.md:95`, `003/plan.md:108`. This is the most important finding: as written, A3 hard-breaks the producer on real packets the day the enum lands.

### P1 (SPEC-PREMISE) — `SPECKIT_SCHEMA_ENUM_ENFORCE` default-off cannot gate an enum embedded in the schema
003 `plan.md:156` Default-Safety asserts the flag defaults OFF so "the parse-on-load and save path keep the current free-string acceptance" and files "parse byte-identical to baseline". This is not achievable with the proposed design. The plan also says to "swap importance_tier and status to z.enum(...)" inside `graphMetadataDerivedSchema` (`003/plan.md:104-105`). A static zod enum baked into the schema is parsed unconditionally by the producer and loader with no env seam: `graphMetadataSchema.parse` runs at `graph-metadata-parser.ts:1125` (derive), `:1149` (merge), `:341` (validate), `:220` and `:282` (legacy). There is zero feature-flag seam in either schema file or the parser (confirmed: `rg isFeatureEnabled|process.env|SPECKIT_SCHEMA_ENUM` over all three files returns no match). A runtime on/off therefore needs a dual lenient/strict schema or a flag-gated `superRefine`, not a bare `z.enum` swap. The spec treats the enum-swap and the runtime flag as independently composable when they are coupled.
Evidence (premise): `003/plan.md:156`, `003/plan.md:104-105`. Evidence (live code): `graph-metadata-parser.ts:341,1125,1149`, and the empty rg result for any flag seam across `graph-metadata-schema.ts` / `description-schema.ts` / `graph-metadata-parser.ts`.

### P2 (SPEC-PREMISE vs LIVE-CODE) — 004 wires the strict schema and silently drops the loader's legacy-migration tolerance
004 REQ-001 (`004/spec.md:109`) targets raw `graphMetadataSchema` for the error-tier graph rule and frames it as verbatim reuse of "the canonical writer contract" (`004/spec.md:141`). The live read path is more permissive than that schema: `validateGraphMetadataContent` (`graph-metadata-parser.ts:338-387`) catches a strict-parse failure and falls back to `parseLegacyGraphMetadataContent`, migrating a legacy-format file in memory and returning `ok: true`. A bare `graphMetadataSchema.parse` at error severity rejects exactly those legacy on-disk files the live loader accepts. The four-beat re-measure-to-zero gate (`004/spec.md:81`) would surface them before the flip, which is why this is P2 not P1, but the spec presents the swap as zero-risk and does not acknowledge that legacy-migration tolerance is being dropped relative to the canonical reader.
Evidence (live code): `graph-metadata-parser.ts:338-387` (esp. `:355` legacy fallback, `:359` migration marker). Evidence (premise): `004/spec.md:109,141,78`.

### P2 (SPEC-PREMISE, doc accuracy) — 003 plan FIX ADDENDUM inverts the two field line numbers
The 003 plan FIX ADDENDUM table places `importance_tier` at "line 44" and `status` at "line 43" (`003/plan.md:104-105`). Live code is the reverse: `importance_tier` is `graph-metadata-schema.ts:43`, `status` is `:44`. The 003 `spec.md:65` range "43-44" is fine, only the per-field table is inverted. Low blast radius since both adjacent fields get the same enum swap, but it is a load-bearing file:line in a fix table an implementer reads literally.
Evidence (live code): `graph-metadata-schema.ts:43-44`. Evidence (premise): `003/plan.md:104-105`.
