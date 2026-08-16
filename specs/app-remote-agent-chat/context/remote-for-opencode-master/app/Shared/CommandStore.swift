import RemoteKit
import SwiftUI

/// The slash commands this Mac's OpenCode offers.
///
/// Fetched, never hardcoded: the list includes whatever the user has
/// written into `.opencode/command/*.md`, plus skills and MCP prompts, and
/// it changes when they edit their config. A built-in list would be wrong
/// on the first machine that isn't the developer's.
@MainActor
final class CommandStore: ObservableObject {
    static let shared = CommandStore()

    @Published private(set) var commands: [AgentCommand] = []
    @Published private(set) var loading = false
    /// Absent silently: an OpenCode without commands, or a companion too
    /// old to answer, should cost the user a palette — not an error.
    @Published private(set) var available = true

    /// How this store reaches a companion — see ModelStore.makeLink.
    private let makeLink: () -> CompanionLink

    init(makeLink: @escaping () -> CompanionLink = { CompanionLink() }) {
        self.makeLink = makeLink
    }

    func loadIfNeeded() async {
        guard commands.isEmpty, !loading else { return }
        loading = true
        defer { loading = false }
        for await event in makeLink().run(Wire.Request(kind: "commands")) {
            if event.kind == "failed" { available = false }
            guard event.kind == "commands" else { continue }
            commands = event.commands ?? []
            available = true
        }
    }

    /// Commands matching what's been typed after the slash. Prefix matches
    /// first — someone typing "/re" means `/review`, not the command whose
    /// description happens to contain "re".
    func matching(_ query: String) -> [AgentCommand] {
        guard !query.isEmpty else { return commands }
        let needle = query.lowercased()
        let prefix = commands.filter { $0.name.lowercased().hasPrefix(needle) }
        let rest = commands.filter {
            !$0.name.lowercased().hasPrefix(needle) &&
                ($0.name.lowercased().contains(needle)
                    || ($0.description ?? "").lowercased().contains(needle))
        }
        return prefix + rest
    }
}
