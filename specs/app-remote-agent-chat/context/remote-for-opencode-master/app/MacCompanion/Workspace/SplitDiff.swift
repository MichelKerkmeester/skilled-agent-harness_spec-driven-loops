import RemoteKit
import SwiftUI

/// One file's patch in the inspector: side-by-side when the pane is wide
/// enough to earn it, the phone's unified rendering below that. Rows wrap
/// rather than scroll sideways — wrapped lines keep the two columns
/// aligned, which is the entire point of a split view.
struct SplitDiff: View {
    let diff: FileDiff
    /// The per-file override from the file row's context menu.
    var forceUnified = false

    /// Below this, two readable columns don't fit and the split view is
    /// worse than the unified one it replaced.
    private static let splitThreshold: CGFloat = 700

    private var hunks: [DiffModel.Hunk] {
        DiffModel.parse(diff.patch ?? "")
    }

    var body: some View {
        GeometryReader { geometry in
            let split = !forceUnified && geometry.size.width >= Self.splitThreshold
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 0) {
                    ForEach(Array(hunks.enumerated()), id: \.offset) { _, hunk in
                        header(hunk)
                        if split {
                            ForEach(Array(hunk.rows.enumerated()), id: \.offset) { _, row in
                                splitRow(row)
                            }
                        } else {
                            ForEach(Array(hunk.lines.enumerated()), id: \.offset) { _, line in
                                unifiedRow(line)
                            }
                        }
                    }
                }
                .padding(.vertical, 8)
            }
        }
        .background(Color.canvas)
    }

    private func header(_ hunk: DiffModel.Hunk) -> some View {
        Text(hunk.header)
            .font(.caption.monospaced())
            .foregroundStyle(Color.clay)
            .lineLimit(1)
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
    }

    // MARK: - Split

    private func splitRow(_ row: DiffModel.SplitRow) -> some View {
        HStack(alignment: .top, spacing: 0) {
            side(row.old, number: row.old?.oldNumber, blankAs: .deletion)
            Rectangle()
                .fill(Color.hairline)
                .frame(width: 1)
            side(row.new, number: row.new?.newNumber, blankAs: .addition)
        }
        .fixedSize(horizontal: false, vertical: true)
    }

    /// One column of one row. A nil line is alignment padding — it takes
    /// the faintest wash of the side it stands in for, so the eye reads
    /// "nothing corresponds here" rather than "empty line".
    private func side(
        _ line: DiffModel.Line?, number: Int?, blankAs: DiffModel.Line.Kind
    ) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Text(number.map(String.init) ?? "")
                .font(.caption2.monospacedDigit())
                .foregroundStyle(Color.inkFaint)
                .frame(width: 34, alignment: .trailing)
            Text(line?.text ?? "")
                .font(.system(.caption, design: .monospaced))
                .foregroundStyle(Color.ink)
                .textSelection(.enabled)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(.vertical, 1)
        .padding(.trailing, 6)
        .background(background(for: line?.kind ?? blankAs, padding: line == nil))
    }

    private func background(for kind: DiffModel.Line.Kind, padding: Bool) -> Color {
        switch kind {
        case .context: return .clear
        case .deletion: return Color.negative.opacity(padding ? 0.04 : 0.10)
        case .addition: return Color.positive.opacity(padding ? 0.04 : 0.10)
        }
    }

    // MARK: - Unified

    private func unifiedRow(_ line: DiffModel.Line) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Text(line.oldNumber.map(String.init) ?? "")
                .frame(width: 34, alignment: .trailing)
            Text(line.newNumber.map(String.init) ?? "")
                .frame(width: 34, alignment: .trailing)
            Text(line.text)
                .foregroundStyle(Color.ink)
                .textSelection(.enabled)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .font(.system(.caption, design: .monospaced))
        .foregroundStyle(Color.inkFaint)
        .padding(.vertical, 1)
        .padding(.horizontal, 6)
        .background(background(for: line.kind, padding: false))
        .fixedSize(horizontal: false, vertical: true)
    }
}
