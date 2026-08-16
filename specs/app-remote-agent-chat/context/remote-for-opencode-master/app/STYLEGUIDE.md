# Tomte app styleguide — reading typography

The chat transcript is where people actually *read* Tomte: multi-paragraph
answers, lists, code. UI-label defaults are tuned for short strings, not
sustained reading, so the chat surface applies its own reading rhythm. This
document is the contract for that rhythm; the values live in
`AgentKit/MarkdownText.swift` and `AgentKit/ChatView.swift` and are shared
verbatim by the Mac and phone apps.

## Principles

- **System text styles, always.** Body text is the Dynamic Type `.body`
  style with no explicit font — accessibility scaling comes for free and the
  platform picks the right optical size. Never hard-code a point size for
  running text.
- **Line height ~1.45×.** The system's default body leading (~1.3×) is a
  label default. Reading text gets `.lineSpacing()` (SwiftUI's is *additive*)
  to land near 1.45× — the WCAG/readability sweet spot of 1.4–1.5 — without
  feeling airy at chat-bubble line lengths.
- **Cap the measure.** Comfortable reading is ~45–75 characters per line. On
  a wide Mac window an uncapped transcript runs to ~900 pt lines, so the
  message column is capped and centered. Phones never hit the cap.
- **Blocks breathe; lines inside a block stay close.** Space between
  paragraphs must be visibly larger than space between lines (≈0.6× the
  line height), headings carry extra space *above* so they attach to what
  follows, list items sit tighter than paragraphs so a list reads as one
  unit, and messages sit farther apart than anything inside a message.
  Density hierarchy, tightest to loosest: line < list item < block < message.
- **Spacing scales with the type.** Every gap in the reading column is a
  `@ScaledMetric(relativeTo: .body)`, so the rhythm holds at accessibility
  text sizes instead of compressing. New spacing in the transcript should be
  a scaled metric too, not a bare constant.
- **Left-aligned, never justified.** Ragged right is easier to read and is
  free in SwiftUI. The user's bubble keeps a ragged *left* edge (capped
  width, trailing alignment) so the two voices are distinguishable at a
  glance.

## Tokens

All relative to `.body`; values are the base (Large / macOS default) size.

| Token | Value | Where |
|---|---|---|
| Body line spacing | +3 pt (≈1.45× line height) | `MarkdownText.bodyLineSpacing`, `MessageRow.bodyLineSpacing` |
| Block gap (paragraph↔paragraph, ↔list, ↔code) | 11 pt | `MarkdownText.blockSpacing` |
| List item gap | 5 pt | `MarkdownText.itemSpacing` |
| Extra space above headings | 8 pt | `MarkdownText.headingTopPadding` |
| Message↔message gap | 20 pt | transcript `LazyVStack` in `ChatView` |
| Text column cap | 640 pt (+16 pt padding each side) | `ChatView.transcriptMaxWidth` |
| User bubble cap | 480 pt (~75 % of column) | `MessageRow.bubbleMaxWidth` |
| Code blocks | `.callout` monospaced, 10 pt inset, radius 8 | `MarkdownText` `.code` case |

## Non-body text

Headings step down `.title3.bold()` / `.headline` / `.subheadline.bold()`;
thinking and error strips use `.callout`; activity and citations use
`.caption`. These are glanceable chrome, not reading text — they keep system
leading and don't need the tokens above.

## When touching this

- Changing a token means changing it in the file that owns it *and* here —
  this table is the reference, the code is the truth.
- Anything new that renders model prose (a share sheet, a notes view, an
  export) should adopt the same tokens rather than invent its own rhythm.
- Test any change at the `.accessibility3` Dynamic Type size and at a
  560 pt-wide Mac window before calling it done.
