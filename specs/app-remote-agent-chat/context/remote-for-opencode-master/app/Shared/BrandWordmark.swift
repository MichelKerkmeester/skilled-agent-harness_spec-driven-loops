import RemoteKit
import SwiftUI

/// The wordmark, drawn rather than set.
///
/// OpenCode's logotype is a module grid — letters four units wide, one unit
/// apart, one-unit stroke, no optical kerning — constructed lettering in
/// the Wim Crouwel *New Alphabet* tradition. That construction is why it
/// reads like an LED or flip-clock numeral, and it means there is no
/// typeface involved: the letterforms are geometry.
///
/// Ours uses the same grid with our own uppercase forms. Uppercase on
/// purpose: OpenCode's logotype is lowercase, and reproducing it exactly
/// would read as an official mark rather than a compatible one.
///
/// Because it's geometry it scales losslessly, needs no bundled font, and
/// can animate per module — see `sweep`.
struct BrandWordmark: View {
    /// Height of the lettering. Everything else derives from it: five rows
    /// of cells, so a cell is a fifth of this.
    var height: CGFloat = 16
    var color: Color = .ink
    /// Drives the scanline sweep; nil renders the mark at rest.
    var sweep: Double?
    /// What to spell. The full lockup where there is room; `Self.compact`
    /// in a navigation bar, which cannot hold nineteen characters of
    /// four-cell lettering at a legible size.
    var text: String = BrandWordmark.full

    public static let full = "REMOTE FOR OPENCODE"
    public static let compact = "REMOTE"

    /// Cells are whole points. A fractional cell puts every edge on a
    /// sub-pixel boundary, and the antialiasing eats exactly the details
    /// that distinguish the letterforms — the diagonal in N first.
    private var cell: CGFloat { max(1, (height / CGFloat(Glyphs.rows)).rounded()) }

    var body: some View {
        Canvas { context, _ in
            for (column, row) in Glyphs.cells(of: text) {
                let rect = CGRect(
                    x: CGFloat(column) * cell, y: CGFloat(row) * cell,
                    width: cell, height: cell
                )
                context.fill(
                    Path(rect),
                    with: .color(color.opacity(opacity(forColumn: column)))
                )
            }
        }
        .frame(
            width: cell * CGFloat(Glyphs.width(of: text)),
            height: cell * CGFloat(Glyphs.rows)
        )
        .accessibilityLabel("Remote for OpenCode")
    }

    /// A three-cell bright band travelling the grid, the way Claude Code
    /// and Codex both shimmer their status rows. At rest everything is
    /// uniform.
    private func opacity(forColumn column: Int) -> Double {
        guard let sweep else { return 1 }
        let span = Double(Glyphs.width(of: text))
        // Lead-in and lead-out beyond both ends, so the band enters and
        // leaves rather than popping.
        let head = sweep * (span + 20) - 10
        let distance = abs(Double(column) - head)
        guard distance < 3 else { return 0.55 }
        return 0.55 + 0.45 * (1 - distance / 3)
    }
}
