import Foundation
import Testing

@testable import RemoteKit

/// The unified-diff parser under the split view. Misalignment here doesn't
/// crash — it silently reviews the wrong line against the wrong line,
/// which is the worst failure a review pane can have.
@Suite("Diff model")
struct DiffModelTests {
    private let patch = """
    diff --git a/Sources/Auth/TokenStore.swift b/Sources/Auth/TokenStore.swift
    index 8f2a1c4..d91b7e0 100644
    --- a/Sources/Auth/TokenStore.swift
    +++ b/Sources/Auth/TokenStore.swift
    @@ -12,5 +12,6 @@ actor TokenStore {
         private var current: Token?
    -    private var refreshing = false
    +    private var inFlight: Task<Token, Error>?
    +    private var retries = 0
         func token() {}
     }
    """

    @Test("File headers are skipped; the hunk header is kept verbatim")
    func headers() {
        let hunks = DiffModel.parse(patch)
        #expect(hunks.count == 1)
        #expect(hunks[0].header == "@@ -12,5 +12,6 @@ actor TokenStore {")
    }

    @Test("Line numbers advance per side")
    func numbering() throws {
        let lines = try #require(DiffModel.parse(patch).first).lines
        #expect(lines[0].kind == .context)
        #expect(lines[0].oldNumber == 12)
        #expect(lines[0].newNumber == 12)
        #expect(lines[1].kind == .deletion)
        #expect(lines[1].oldNumber == 13)
        #expect(lines[1].newNumber == nil)
        #expect(lines[2].kind == .addition)
        #expect(lines[2].oldNumber == nil)
        #expect(lines[2].newNumber == 13)
        #expect(lines[3].kind == .addition)
        #expect(lines[3].newNumber == 14)
        // Context after the change: old resumed from 14, new from 15.
        #expect(lines[4].oldNumber == 14)
        #expect(lines[4].newNumber == 15)
    }

    @Test("A deletion run pairs row-for-row with the additions that follow")
    func alignment() throws {
        let rows = try #require(DiffModel.parse(patch).first).rows
        // context / (del|add) / (nil|add) / context / context
        #expect(rows.count == 5)
        #expect(rows[0].old?.kind == .context)
        #expect(rows[1].old?.kind == .deletion)
        #expect(rows[1].new?.kind == .addition)
        #expect(rows[2].old == nil, "the longer side pads the shorter")
        #expect(rows[2].new?.kind == .addition)
        #expect(rows[3].old?.kind == .context)
    }

    @Test("Additions before any deletion pair against blank")
    func pureAddition() {
        let hunks = DiffModel.parse("""
        @@ -1,2 +1,3 @@
         let a = 1
        +let b = 2
         let c = 3
        """)
        let rows = hunks[0].rows
        #expect(rows.count == 3)
        #expect(rows[1].old == nil)
        #expect(rows[1].new?.text == "let b = 2")
    }

    @Test("Two separate change runs don't pair across context")
    func runsSeparatedByContext() {
        let hunks = DiffModel.parse("""
        @@ -1,5 +1,5 @@
        -old one
        +new one
         between
        -old two
        +new two
         after
        """)
        let rows = hunks[0].rows
        #expect(rows.count == 4)
        #expect(rows[0].old?.text == "old one")
        #expect(rows[0].new?.text == "new one")
        #expect(rows[2].old?.text == "old two")
        #expect(rows[2].new?.text == "new two")
    }

    @Test("'No newline at end of file' markers vanish")
    func noNewlineMarker() {
        let hunks = DiffModel.parse("""
        @@ -1 +1 @@
        -a
        \\ No newline at end of file
        +b
        \\ No newline at end of file
        """)
        #expect(hunks[0].lines.count == 2)
        #expect(hunks[0].rows.count == 1)
    }

    @Test("Multiple hunks parse independently")
    func multipleHunks() {
        let hunks = DiffModel.parse("""
        @@ -1,2 +1,2 @@
        -a
        +b
         x
        @@ -10,2 +10,2 @@
         y
        -c
        +d
        """)
        #expect(hunks.count == 2)
        #expect(hunks[1].lines.first?.oldNumber == 10)
        #expect(hunks[1].rows.count == 2)
    }

    @Test("Garbage in, empty out — never a crash")
    func garbage() {
        #expect(DiffModel.parse("").isEmpty)
        #expect(DiffModel.parse("not a diff at all").isEmpty)
        #expect(DiffModel.parse("@@ malformed @@\n+still counted").count == 1)
    }
}
