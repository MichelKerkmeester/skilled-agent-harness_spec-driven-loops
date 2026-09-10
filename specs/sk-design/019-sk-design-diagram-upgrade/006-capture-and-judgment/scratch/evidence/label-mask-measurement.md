# Text-box overflow under font substitution

Method: each file's outer `<svg>` rendered at 1:1 by headless Chrome twice, with web fonts and
with `--disable-remote-fonts`; for every mask rect drawn immediately before a short all-caps label,
ink pixels (luma < 110) counted in a 6px margin outside the rect; overflow = more outside ink
without fonts than with, beyond a 4-pixel tolerance. Both renders differ elsewhere, so the fallback
face was in play.

Arrow-label masks (`example-swimlane.html`, `example-architecture.html`): 1 of 14 overflows —
swimlane's HANDOFF mask (60x12 at 452,140), outside ink 12 with fonts, 19 without. FAIL on that
one label; the other thirteen hold.

Type-tag boxes (`example-high-level.html`, the twelve `height="12"` rects such as EXT and EDGE): 0
of 12 overflow. These are not arrow-label masks; they were measured first under that name by
mistake and are kept here because they are the same risk class.
