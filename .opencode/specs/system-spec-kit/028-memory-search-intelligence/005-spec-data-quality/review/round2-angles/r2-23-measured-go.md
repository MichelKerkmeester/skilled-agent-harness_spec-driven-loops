# r2-23 measured-go

**Angle summary:** Re-ran the real `graphMetadataSchema` and `folderDescriptionSchema` over the live 2059-file corpus to test whether A4 (schema warn-to-error) is genuinely the one unconditional measured GO. The 0-grandfathered census and the zero-retrieval-risk half both verify clean. The 11-invalid-graph-files census does not survive a real run.

---

## Findings

### F1. P1 — Real schema run fails 24 graph files (16 live), not 11

**Class:** LIVE-CODE.

**Evidence:** A direct `graphMetadataSchema.safeParse` pass over all 2059 `graph-metadata.json` files under `.opencode/specs` fails **24** files (11 JSON-parse failures plus 13 schema-shape failures). Excluding `z_archive`/`z_future`/`backup` leaves **16** live failures. The schema is `graph-metadata-schema.ts:61-71` (`schema_version` literal 1, top-level `packet_id`/`spec_folder`/`parent_id`/`children_ids`, `manual`, fully-typed `derived`). The spec premise that the corpus holds 11 invalid graph files appears at `004-schema-warn-to-error/spec.md:140` ("parent census counted 11 invalid graph files") and `research/research.md:21` ("re-measure counts 11 invalid live-root graph files"). The "11" matches only the JSON-parse-failure subcount, never the count against the target schema. A4 cannot be a *measured* GO on a number that a real run of its own target schema does not reproduce.

### F2. P1 — The "11 live-root" label is measured against parse-ability not the target schema, and undercounts the genuine packet roots

**Class:** SPEC-PREMISE.

**Evidence:** The 11 parse-failures are nested deep-loop text-stub artifacts, not root packets. Example: `system-spec-kit/027-xce-research-based-refinement/research/001-xce-adoption-matrix/iterations/graph-metadata.json` (473 bytes) contains plain text "Packet: ... Spec Folder: ... Status: planned ..." not JSON. All 11 sit under `research/.../iterations/` paths. Meanwhile the genuine live packet roots that fail the *real* schema are NOT in the 11: `.opencode/specs/graph-metadata.json` (git-tracked, legacy two-key `{derived, children_ids}` shape) plus three full-doc-set packets under `026-.../022-hardcoded-default-remediation-arc/` (`002b-cocoindex-reranker-doc-prose`, `004a-skill-advisor-compat-contract-consolidation`, `004b-skill-advisor-interface-and-env-vars`) failing on `migration_source` not "legacy", missing `manual.depends_on[].source`, and `derived.save_lineage` outside the enum. These are exactly the cases Risk-row-4 anticipates (`004-schema-warn-to-error/spec.md:141`, "stricter zod schema rejects a shape the hand-rolled check tolerated") but the census never re-counted them. The label is doubly wrong. The 11 are not root and the failing roots are not in the 11.

### F3. P2 — "Unconditional GO" overstates a flip that is strictly gated on backfill-to-zero

**Class:** SPEC-PREMISE.

**Evidence:** Parent `spec.md:162` and child `004-schema-warn-to-error/spec.md:57` brand A4 "the one measured unconditional GO". Yet the same child spec makes the ERROR flip conditional. REQ-004 (`spec.md:112`) requires the live corpus to "re-measure to a 0 failing count" before the flip, the four-beat discipline at `spec.md:81` and `spec.md:174` holds the flip as the final beat, and Risk-dependency rows at `spec.md:139-140` gate it on the dry-run reading 0. The live count is 16-to-24 today, not 0. The GO is unconditional as a *decision*, not as a *flip*. The re-measure-to-zero gate is the real safety net and it WOULD catch the undercount in F1/F2, so safety holds. The "unconditional" framing and the census sizing are what is off.

### F4. P2 — Both verifiable halves of "risk-free" confirm clean: 0 grandfathered and zero retrieval surface

**Class:** LIVE-CODE.

**Evidence:** Grandfathered census CONFIRMED. 0 of 2059 `graph-metadata.json` files carry `legacy_grandfathered: true` (`grep -rl '"legacy_grandfathered"...true'` returns 0). The flag declares at `validate.sh:41`, detects at `validate.sh:175-181`, calls at `validate.sh:1044`. The bypass is genuinely dead, so its deletion carries zero blast radius, matching `spec.md:66`. Retrieval-risk CONFIRMED. The Files-to-Change set (`spec.md:94-97`) is `validate.sh` plus the two rule scripts plus `validator-registry.json`, none on the ranking/embedding/re-index path, so "A4 touches validation not ranking" (`spec.md:87`) holds. Description side CONFIRMED clean. `folderDescriptionSchema` fails **0** of 2054 `description.json` files, so the `DESCRIPTION_SHAPE` half of the flip is already at zero. Every part of "risk-free" that can be checked checks clean. The single un-clean variable is the graph-shape backfill count in F1.

### F5. P2 — Files-to-Change names one LEGACY_GRANDFATHERED read site (927) but live code has four

**Class:** LIVE-CODE.

**Evidence:** `spec.md:97` says delete "the `LEGACY_GRANDFATHERED` read in the strict RESULT branch (line 927)". Live `validate.sh` reads the flag at lines 912, 927, 935 and 1062, declares it at 41, and calls `detect_legacy_grandfathered` at 1044. REQ-003 (`spec.md:111`) sets a grep-to-zero acceptance ("Grep of `validate.sh` returns zero matches for `legacy_grandfathered` and `LEGACY_GRANDFATHERED`") which catches every site, so the gate is sound. The scope table itself is incomplete and an implementer following only the table would leave three reads in place.

---

## Verified clean

- 0-grandfathered census: accurate (0/2059).
- Zero-retrieval-risk claim: accurate (no ranking/re-index surface in scope).
- Description-shape backfill: already at zero (0/2054), so half the flip is genuinely risk-free today.
- Real zod schemas exist and are exported as the spec claims (`graphMetadataSchema`, `folderDescriptionSchema`, `formatDescriptionSchemaIssues`).
