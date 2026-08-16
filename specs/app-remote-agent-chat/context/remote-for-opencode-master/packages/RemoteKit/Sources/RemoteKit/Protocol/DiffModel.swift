import Foundation

/// A unified diff, parsed once and renderable two ways: the flat line list
/// a phone column shows, and side-by-side rows for a desktop pane. The
/// alignment rule is the classic one — within a hunk, a run of deletions
/// followed by a run of additions pairs row-for-row, the longer side
/// padding the other with blanks; context spans both columns.
public enum DiffModel {
    public struct Line: Hashable, Sendable {
        public enum Kind: Hashable, Sendable {
            case context, deletion, addition
        }

        public let kind: Kind
        public let text: String
        /// Line numbers in the old and new file; a deletion has no new
        /// number, an addition no old one.
        public let oldNumber: Int?
        public let newNumber: Int?
    }

    /// One row of the side-by-side rendering. Either side may be blank —
    /// that is the padding that keeps changed runs aligned.
    public struct SplitRow: Hashable, Sendable {
        public let old: Line?
        public let new: Line?
    }

    public struct Hunk: Hashable, Sendable {
        /// The `@@ -a,b +c,d @@ …` line, verbatim — the trailing context is
        /// often a function name worth showing.
        public let header: String
        /// Unified order, for the flat rendering.
        public let lines: [Line]
        /// Aligned pairs, for the split rendering.
        public let rows: [SplitRow]
    }

    /// Parses one file's unified patch. Unknown or malformed lines are
    /// skipped rather than fatal — patches arrive from whatever git and
    /// OpenCode produced, and a rendering that drops a line beats one that
    /// drops the file.
    public static func parse(_ patch: String) -> [Hunk] {
        var hunks: [Hunk] = []
        var header: String?
        var lines: [Line] = []
        var oldNumber = 0
        var newNumber = 0

        func flush() {
            guard let h = header else { return }
            hunks.append(Hunk(header: h, lines: lines, rows: align(lines)))
            lines = []
        }

        for raw in patch.split(separator: "\n", omittingEmptySubsequences: false) {
            let line = String(raw)
            if line.hasPrefix("@@") {
                flush()
                header = line
                let (old, new) = hunkStarts(line)
                oldNumber = old
                newNumber = new
                continue
            }
            guard header != nil else { continue }   // file headers before the first @@
            if line.hasPrefix("-") {
                lines.append(Line(kind: .deletion, text: String(line.dropFirst()),
                                  oldNumber: oldNumber, newNumber: nil))
                oldNumber += 1
            } else if line.hasPrefix("+") {
                lines.append(Line(kind: .addition, text: String(line.dropFirst()),
                                  oldNumber: nil, newNumber: newNumber))
                newNumber += 1
            } else if line.hasPrefix("\\") {
                // "\ No newline at end of file" — metadata, not content.
                continue
            } else {
                // Context: either " …" or (rarely) an empty line standing
                // for an empty context line.
                lines.append(Line(kind: .context, text: String(line.dropFirst(line.isEmpty ? 0 : 1)),
                                  oldNumber: oldNumber, newNumber: newNumber))
                oldNumber += 1
                newNumber += 1
            }
        }
        flush()
        return hunks
    }

    /// `@@ -a,b +c,d @@` → (a, c). Counts default to 1 and are unused here.
    private static func hunkStarts(_ header: String) -> (Int, Int) {
        var old = 1
        var new = 1
        for token in header.split(separator: " ") {
            if token.hasPrefix("-") {
                old = Int(token.dropFirst().split(separator: ",").first ?? "1") ?? 1
            } else if token.hasPrefix("+") {
                new = Int(token.dropFirst().split(separator: ",").first ?? "1") ?? 1
            }
        }
        return (old, new)
    }

    private static func align(_ lines: [Line]) -> [SplitRow] {
        var rows: [SplitRow] = []
        var deletions: [Line] = []
        var additions: [Line] = []

        func flushRun() {
            let count = max(deletions.count, additions.count)
            for index in 0 ..< count {
                rows.append(SplitRow(
                    old: index < deletions.count ? deletions[index] : nil,
                    new: index < additions.count ? additions[index] : nil
                ))
            }
            deletions = []
            additions = []
        }

        for line in lines {
            switch line.kind {
            case .deletion:
                // A new deletion after additions have started is a new run.
                if !additions.isEmpty { flushRun() }
                deletions.append(line)
            case .addition:
                additions.append(line)
            case .context:
                flushRun()
                rows.append(SplitRow(old: line, new: line))
            }
        }
        flushRun()
        return rows
    }
}
