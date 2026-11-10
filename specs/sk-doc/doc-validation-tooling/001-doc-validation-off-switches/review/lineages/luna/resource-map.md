# Review Source Map — Validation Off Switches

Generated inside the detached `luna` review lineage from the five review deltas. The target packet had no root `resource-map.md` at initialization, so the resource-map coverage gate was skipped. This map is a source index for the review artifacts; it does not claim exhaustive coverage of the 127-entry scope manifest.

| Area | Reviewed sources | Finding references |
|---|---|---|
| Switch resolution and truthy rules | `.skilled/hooks/shared/hook-flags.sh`; `.skilled/hooks/shared/hook-flags.cjs`; `.skilled/skills/sk-doc/shared/scripts/validation_switch.py` | P2-LUNA-001, P2-LUNA-004, P2-LUNA-005 |
| Config-file reader parity | `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh`; parser and cross-reader tests | P2-LUNA-004, P2-LUNA-005 |
| Skip JSON producer and consumers | `validate.sh`; `progressive-validate.sh`; `quality-audit.sh`; `strict-pass-freshness.ts` | P1-LUNA-002, P2-LUNA-003 |
| Packet contract and evidence | `spec.md`; `plan.md`; `acceptance-criteria.md`; `tasks.md`; `implementation-summary.md` | All findings |
| Adjacent changelog context | 061 parent `spec.md`; 003 phase implementation summary | No additional finding |
