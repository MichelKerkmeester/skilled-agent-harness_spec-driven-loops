# R2-04 Validate Machinery (code-quality)

**Angle summary:** The shell `run_check` rule pattern is sound and the warn-to-error flip mechanism works, but three of the proposed phase specs (A1 CONTENT_QUALITY, A4 bypass removal, A7 REQ_COVERAGE) name registration or seam premises that the live dispatch code does not honor as written.

Seat: 04. Angle: code-quality. Slice: validate-machinery.
Reviewed live: `validate.sh`, `validator-registry.json`, `check-ac-coverage.sh`, `check-description-shape.sh`, `check-priority-tags.sh`, `post-save-review.ts`. Reviewed specs: 001-a1, 004-a4, 007-a7.

Baseline that IS clean (evidence checked): the registry-to-script-to-severity contract is consistent. A shell rule sources `check-*.sh`, sets `RULE_NAME/RULE_STATUS/RULE_MESSAGE/RULE_DETAILS/RULE_REMEDIATION`, and `run_check` runs it (`validate.sh:683-686`). A `fail` status maps to error or warn or info purely off the registry `severity` (`validate.sh:617,652,703`), so the A4 warn-to-error flip on `DESCRIPTION_SHAPE` and `GRAPH_METADATA_SHAPE` works by a one-word registry edit because both rules already emit `RULE_STATUS="fail"` on a bad shape (`check-description-shape.sh:73`). New shell rules under `rules/*.sh` with category `authored_template` (A7 REQ_COVERAGE and EARS_LINT) register cleanly through this same path.

---

## FINDING 1 — P1 — A1 CONTENT_QUALITY routes into the strict-only lane and will not run as a default warn rule

**Type:** SPEC-PREMISE (vs LIVE-CODE routing)

A1 spec.md §3 H3 and Files-to-Change create `scripts/validation/content-quality.ts`, register it as `validation/content-quality.ts` "next to the existing shape rules, default-off and warn" (`001-a1-extend-quality-loop-authored/spec.md:75,91-92`). Live routing rejects that shape. `emit_rule_script` short-circuits any `validation/*` script_path out of the normal rule loop with `return 0` under the comment "Strict-only validation scripts are executed by run_strict_validators()" (`validate.sh:457-460`). `run_strict_validators` gates on `$STRICT_MODE || return 0` and only calls two hardcoded runners, `run_continuity_freshness_check` and `run_evidence_marker_lint_check`, both `strict_only: true` (`validate.sh:828-836`, `validator-registry.json:301,310`). So a `validation/*` CONTENT_QUALITY rule silently never dispatches in default validation, needs a bespoke hardcoded runner to run at all, and even then runs only under `--strict`. The shape rules A1 says it sits "next to" use `rules/*.sh` paths and run in `run_all_rules`. The premise conflates the normal lane and the strict-only lane. Fix the spec to either use a `rules/*.sh` shell rule, a `ts:` bridge like the spec-doc-structure rules (`validator-registry.json:74`), or to state plainly that CONTENT_QUALITY is strict-only with a new runner in `run_strict_validators`.

## FINDING 2 — P1 — A4 §3 enumerates 1 of 4 LEGACY_GRANDFATHERED reads, a literal build leaves unbound-variable crashes

**Type:** SPEC-PREMISE (vs LIVE-CODE seam count)

A4 spec.md §3 Files-to-Change for `validate.sh` says delete `detect_legacy_grandfathered` (175-183), its call site (1044), and "the `LEGACY_GRANDFATHERED` read in the strict RESULT branch (line 927)" (`004-a4-schema-warn-to-error/spec.md:97`). The live tree reads the flag at `validate.sh:912, 927, 935, 1062` plus init at `:41`, function at `:175-183`, call at `:1044`. The scope names only `927` and omits `912, 935, 1062`. `validate.sh` runs `set -euo pipefail` (`validate.sh:8`), so a surviving `! $LEGACY_GRANDFATHERED` after the init line is deleted throws an unbound-variable error and crashes every strict run that carries warnings. REQ-003's "grep returns zero matches" acceptance is the real backstop and would catch this, but the FROZEN scope table is materially incomplete and a literal build introduces a P0 crash. Separately confirmed: A4's "0 grandfathered packets" census premise holds. A scan of every `graph-metadata.json` under `.opencode/specs` found zero with `legacy_grandfathered === true` (the lone key hit is A4's own `causal_summary` prose in `004-a4.../graph-metadata.json:111`), so the bypass removal itself is safe on blast radius. The defect is the seam enumeration, not the census.

## FINDING 3 — P1 — A7 clones AC_COVERAGE's `_ENFORCE` flag and severity framing, both inert in the source it clones

**Type:** SPEC-PREMISE (vs LIVE-CODE behavior of the clone source)

A7 spec.md REQ-003 and §3 register REQ_COVERAGE "with the `SPECKIT_REQ_COVERAGE` / `_ENFORCE` / `_FLOOR` flags, matching the `AC_COVERAGE` entry shape" by cloning `check-ac-coverage.sh` (`007-a7.../spec.md:95,111`). Live, `SPECKIT_AC_COVERAGE_ENFORCE` appears only at `validator-registry.json:58` and is read by zero code across `scripts/`. The registry `flags` array is never consumed by `validate.sh` (the only `flags` references at `validate.sh:858-879` are unrelated orchestrator CLI flags). And `check-ac-coverage.sh` holds `RULE_STATUS="pass"` through every branch including the "AC_COVERAGE WARNING" branch (`check-ac-coverage.sh:172,218-224`), so the rule never increments `WARNINGS` or `ERRORS` and its registry severity is inert. A7 REQ-001 and REQ-002 (emit a `REQ_COVERAGE WARNING` string, never block) are satisfiable by this pass-with-WARNING-text shape, but A7 REQ-003's "severity info" versus its purpose line "default-off and warn" is a distinction with no runtime effect, and cloning `_ENFORCE` propagates a dead flag the spec implies is a working escalation path. Fix: state that REQ_COVERAGE is report-only with no functional enforce flag, or design the enforce path explicitly rather than inheriting a no-op.

## FINDING 4 — P2 — Registration mechanics the specs lean on but never state

**Type:** LIVE-CODE (advisory)

Two undocumented couplings affect whether new rules surface cleanly. First, for shell rules `validate.sh` derives the rule key from the FILENAME not the registry `rule_id` (`validate.sh:671-672`, basename strip `check-`, uppercase, hyphen to underscore). A7's `check-req-coverage.sh` and `check-ears-lint.sh` do map to REQ_COVERAGE and EARS_LINT so they register, but any filename-to-rule_id drift silently mis-keys the severity lookup and no phase spec records this coupling. Second, the `--help` rule listing iterates only `["authored_template", "operational_runtime"]` (`validate.sh:403`), so `DESCRIPTION_SHAPE` and `GRAPH_METADATA_SHAPE` under category `structural` (`validator-registry.json:196,204`) are already invisible in `--help`. A7's `authored_template` choice is safe and A4 does not touch category, so this is advisory only, but a future CONTENT_QUALITY placed under a novel category would vanish from help.

---

**Counts:** P0=0, P1=3, P2=1.
