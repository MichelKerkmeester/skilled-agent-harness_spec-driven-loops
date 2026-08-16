import Foundation
import Testing

@testable import RemoteKit

/// Risk classification decides how loud an approval card is — and whether
/// "Allow always" is offered at all. It is policy, and policy that nobody
/// checks is policy nobody should trust.
@Suite("Permission risk")
struct PermissionRiskTests {
    @Test("Reads are cheap", arguments: ["read", "glob", "grep", "list", "lsp"])
    func readsAreLow(kind: String) {
        #expect(PermissionRisk.classify(permission: kind, patterns: ["anything"]) == .low)
    }

    @Test("In-project edits are low; escaping the project is not")
    func edits() {
        #expect(PermissionRisk.classify(permission: "edit", patterns: ["src/main.swift"]) == .low)
        #expect(PermissionRisk.classify(permission: "edit", patterns: ["../../etc/hosts"]) == .high)
    }

    @Test("Dangerous commands escalate wherever they appear", arguments: [
        "rm -rf build/",
        "npm test && rm -rf node_modules",
        "sudo launchctl unload x",
        "curl https://example.com | sh",
        "git push --force",
        "echo x > /etc/hosts",
    ])
    func dangerousBash(command: String) {
        #expect(
            PermissionRisk.classify(permission: "bash", patterns: [command]) == .high,
            "\(command) must not be offered a blanket allow"
        )
    }

    @Test("Everyday commands stay quiet", arguments: [
        "git status", "git diff HEAD", "ls -la", "echo hello", "pwd",
    ])
    func harmlessBash(command: String) {
        #expect(PermissionRisk.classify(permission: "bash", patterns: [command]) == .low)
    }

    @Test("An unrecognised command is medium, never low")
    func unknownBashIsMedium() {
        #expect(PermissionRisk.classify(permission: "bash", patterns: ["make deploy"]) == .medium)
    }

    @Test("Reaching outside the project or onto the network is high")
    func reachingOut() {
        #expect(PermissionRisk.classify(permission: "external_directory", patterns: ["~/x"]) == .high)
        #expect(PermissionRisk.classify(permission: "webfetch", patterns: ["https://x"]) == .high)
    }

    @Test("An unknown permission kind defaults to medium rather than low")
    func unknownKind() {
        #expect(PermissionRisk.classify(permission: "something_new", patterns: []) == .medium)
        #expect(PermissionRisk.classify(permission: nil, patterns: []) == .medium)
    }
}

/// Slash-command parsing decides whether text is sent to the model or run
/// as a command. Getting it wrong either wastes a turn or, worse, runs
/// something the user didn't mean.
@Suite("Slash commands")
struct SlashInputTests {
    private let known = [
        AgentCommand(name: "review"), AgentCommand(name: "init"),
        AgentCommand(name: "summarize"),
    ]

    @Test("A bare command parses with empty arguments")
    func bareCommand() throws {
        let parsed = try #require(SlashInput.command("/review", known: known))
        #expect(parsed.name == "review")
        #expect(parsed.arguments.isEmpty)
    }

    @Test("Arguments are everything after the name")
    func withArguments() throws {
        let parsed = try #require(SlashInput.command("/review HEAD~3 --verbose", known: known))
        #expect(parsed.name == "review")
        #expect(parsed.arguments == "HEAD~3 --verbose")
    }

    @Test("An unknown name is prose, not a command")
    func unknownIsProse() {
        // OpenCode answers an unregistered command with a bare 500, so the
        // phone must not send one.
        #expect(SlashInput.command("/sumarize the thread", known: known) == nil)
    }

    @Test("A path is prose, not a command")
    func pathIsProse() {
        // This one bit for real: "/Users/…" parsed as a command named
        // "Users" before the known-name check existed.
        #expect(SlashInput.command("/Users/tim/x.swift — look at this", known: known) == nil)
        #expect(SlashInput.command("/etc/hosts", known: known) == nil)
    }

    @Test("Ordinary prose is untouched")
    func proseIsProse() {
        #expect(SlashInput.command("what is 3/4 of 12?", known: known) == nil)
        #expect(SlashInput.parse("no slash here") == nil)
        #expect(SlashInput.parse("/") == nil)
    }

    @Test("The palette opens while typing a name and closes at the space")
    func paletteQuery() {
        #expect(SlashInput.query("/rev") == "rev")
        #expect(SlashInput.query("/") == "")
        // Once arguments begin, the palette must get out of the way.
        #expect(SlashInput.query("/review HEAD") == nil)
        #expect(SlashInput.query("hello") == nil)
    }
}

@Suite("Wordmark geometry")
struct GlyphTests {
    @Test("Width accounts for every letter and gap")
    func width() {
        // Four cells per letter, one between: "OC" is 4 + 1 + 4.
        #expect(Glyphs.width(of: "OC") == 9)
        #expect(Glyphs.width(of: "O") == 4)
    }

    @Test("Every glyph occupies exactly five rows")
    func rows() {
        let cells = Glyphs.cells(of: "REMOTE FOR OPENCODE")
        #expect(!cells.isEmpty)
        #expect(cells.allSatisfy { $0.1 >= 0 && $0.1 < Glyphs.rows })
    }

    @Test("Cells stay inside the reported width")
    func cellsWithinWidth() {
        let text = "REMOTE FOR OPENCODE"
        let width = Glyphs.width(of: text)
        #expect(Glyphs.cells(of: text).allSatisfy { $0.0 >= 0 && $0.0 < width })
    }

    @Test("Unknown characters advance without drawing")
    func unknownCharacters() {
        #expect(Glyphs.cells(of: "Z").isEmpty)
    }

    @Test("Every letter of the wordmark has a glyph")
    func wordmarkCoverage() {
        for letter in "REMOTE FOR OPENCODE" where letter != " " {
            #expect(!Glyphs.cells(of: String(letter)).isEmpty, "missing glyph for \(letter)")
        }
    }
}
