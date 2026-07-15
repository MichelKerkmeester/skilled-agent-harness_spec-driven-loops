# Context Index — Folder Provenance Bridge

This phase parent consolidates two previously separate sk-doc routing-alignment
workstreams into one decomposition. Historical pointers are recorded here (not in
`spec.md`) so the parent spec stays free of reorganization narrative.

## Where prior work now lives

| Prior packet | Prior identity | Now |
|---|---|---|
| `sk-doc/018-subskill-router-alignment` (phase parent, 4 children) | Trigger/handoff/registry alignment across the ten create-* packets | Children became `016/001`–`016/004`; the old parent trio was retired into this parent |
| `sk-doc/017-smart-routing-mechanism-notes` (standalone Level 2) | Honest smart-routing N/A notes for the flat-resource packets | Became child `016/005-smart-routing-mechanism-notes` in full |

## Child map

| Child | Origin | Status |
|---|---|---|
| `001-audit-and-fix-map` | 018/001 | Complete |
| `002-p0-collision-fixes` | 018/002 | Complete |
| `003-p1-trigger-scoping-and-handoffs` | 018/003 | Complete |
| `004-p2-standardization-and-regen` | 018/004 | Complete |
| `005-smart-routing-mechanism-notes` | 017 (whole packet) | Complete |
| `006-router-conformance-gap-analysis` | new | Open — decision pending |

## Notes

- The four `018` children and the whole `017` packet were relocated with `git mv`, so
  per-file history is preserved.
- The residual create-skill router-marker gap (eight flat-resource packets warn for the
  keyed-discovery markers) is a documented posture, not a defect. Its keep-vs-wire
  decision is scoped to child `006`.
