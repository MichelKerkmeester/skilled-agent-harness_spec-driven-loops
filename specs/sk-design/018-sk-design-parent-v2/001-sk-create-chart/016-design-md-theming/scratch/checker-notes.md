# Checker notes

The stock path remains source equality against `assets/color/palettes.json`. The two palette
regions use `canonicalBlock` and `canonicalDarkBlock`, and `checkPaletteSource` continues to gate
the source values for every built-in system.

| Gate | Source key | Applied to |
|---|---|---|
| Text on surface | `textOnSurface` | ink and muted |
| Mark on surface | `markOnSurface` | categorical marks and emphasis |
| Ramp darkest endpoint | `rampDarkestOnSurface` | first ordered value |
| Ramp lightest endpoint | `rampLightestOnSurface` | last ordered value |
| Ramp step separation | `rampStepSeparation` | adjacent ordered values |
| Emphasis separation | `emphasisAgainstFirstSeries` | emphasis versus series one |

The `design-md` branch runs beside, rather than inside, the built-in source-equality branch. It
checks the provenance line directly under each begin marker, parses both inline themes, applies the
same contrast arithmetic through `scripts/color-gates.cjs`, and still runs all file-level families.
`--extra DIR` adds outside HTML files to those file-level checks without adding them to the gallery,
catalog, or geometry inventory.
