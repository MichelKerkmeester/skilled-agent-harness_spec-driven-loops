import RemoteKit
import SwiftUI

/// Which agent the session runs as.
///
/// The one that matters is `plan` — OpenCode describes it as "Plan mode.
/// Disallows all edit tools." That is the mode that makes steering from a
/// phone genuinely safe: you can explore, ask, and get a plan back with a
/// hard guarantee that nothing on disk changed. Choosing it is a stronger
/// promise than approving each edit, because there is nothing to approve.
@MainActor
final class AgentStore: ObservableObject {
    static let shared = AgentStore()

    @Published private(set) var agents: [AgentInfo] = []
    @Published var selected: AgentInfo? {
        didSet { UserDefaults.standard.set(selected?.name, forKey: Self.key) }
    }

    private static let key = "opencodego.agent"
    private var loading = false

    /// How this store reaches a companion — see ModelStore.makeLink.
    private let makeLink: () -> CompanionLink

    init(makeLink: @escaping () -> CompanionLink = { CompanionLink() }) {
        self.makeLink = makeLink
    }

    /// Nil means "whatever OpenCode defaults to", which is `build`.
    var label: String { (selected?.name ?? "build").capitalized }

    /// True when the selected agent cannot write — worth saying out loud
    /// in the UI, because it changes what the whole screen means.
    var isReadOnly: Bool { selected?.name == "plan" }

    #if DEBUG
    /// Populates the real agent list for tools/uiharness, which has no Mac
    /// to ask. Debug-only so a shipped build cannot reach it.
    func mockForHarness(plan: Bool = false) {
        agents = [
            AgentInfo(name: "build", description: "The default agent.", mode: "primary"),
            AgentInfo(name: "plan", description: "Plan mode. Disallows all edit tools.", mode: "primary"),
        ]
        selected = plan ? agents.first { $0.name == "plan" } : nil
    }
    #endif

    func loadIfNeeded() async {
        guard agents.isEmpty, !loading else { return }
        loading = true
        defer { loading = false }
        for await event in makeLink().run(Wire.Request(kind: "agents")) {
            guard event.kind == "agents" else { continue }
            agents = event.agents ?? []
            if selected == nil, let remembered = UserDefaults.standard.string(forKey: Self.key) {
                selected = agents.first { $0.name == remembered }
            }
        }
    }
}
