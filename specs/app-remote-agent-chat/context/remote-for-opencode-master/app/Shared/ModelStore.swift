import RemoteKit
import SwiftUI

/// The phone's model choice, and the catalogue it picks from.
///
/// The choice is remembered across launches but stays overridable per turn:
/// picking a model is the kind of decision people make once and then forget
/// about, right up until the moment they want something faster or smarter
/// for one specific question.
@MainActor
final class ModelStore: ObservableObject {
    static let shared = ModelStore()

    @Published private(set) var models: [AgentModel] = []
    /// What the Mac would use if we said nothing — shown as "Default" until
    /// the catalogue names it.
    @Published private(set) var defaultID: String?
    @Published private(set) var loading = false
    /// Why the catalogue is empty, when it is. Shown in the menu rather
    /// than swallowed — an older Mac companion answers "Unknown request."
    /// here, and a silent empty menu makes that look like a phone bug.
    @Published private(set) var error: String?
    @Published var selected: AgentModel? {
        didSet {
            UserDefaults.standard.set(selected?.id, forKey: Self.key)
        }
    }

    private static let key = "opencodego.model"

    /// How this store reaches a companion. The phone's singleton keeps the
    /// default (the paired Mac); the desktop workspace injects a per-peer
    /// factory, loopback included.
    private let makeLink: () -> CompanionLink

    init(makeLink: @escaping () -> CompanionLink = { CompanionLink() }) {
        self.makeLink = makeLink
    }

    /// What the composer's chip says.
    var label: String {
        if let selected { return selected.name }
        if let fallback = models.first(where: { $0.id == defaultID }) { return fallback.name }
        return "Default model"
    }

    #if DEBUG
    /// Populates a plausible catalogue for tools/uiharness, which has no
    /// Mac to ask. Debug-only so it can't be reached from a shipped build.
    func mockForHarness() {
        models = [
            AgentModel(providerID: "anthropic", modelID: "claude-opus-5",
                       name: "Claude Opus 5", provider: "Anthropic",
                       reasoning: true, attachment: true),
            AgentModel(providerID: "google", modelID: "gemini-3.5-flash",
                       name: "Gemini 3.5 Flash", provider: "Google",
                       reasoning: true, attachment: true),
            AgentModel(providerID: "lmstudio", modelID: "qwen3-coder-30b",
                       name: "Qwen3 Coder 30B", provider: "LMStudio"),
        ]
        defaultID = "google/gemini-3.5-flash"
    }
    #endif

    /// Fetches the catalogue once per app run (models change when the user
    /// edits OpenCode's config, which is not a phone-session event).
    func loadIfNeeded() async {
        guard models.isEmpty, !loading else { return }
        await load()
    }

    /// Unconditional refetch — what the menu's Reload does after a failure.
    func load() async {
        loading = true
        error = nil
        defer { loading = false }
        for await event in makeLink().run(Wire.Request(kind: "models")) {
            if event.kind == "failed" { error = event.text }
            guard event.kind == "models" else { continue }
            models = event.models ?? []
            defaultID = event.defaultModel
            if models.isEmpty, error == nil {
                error = "No tool-capable models are configured in OpenCode."
            }
            // Restore the remembered pick now that names exist to match it
            // against; a model that has since been removed from the config
            // silently falls back rather than failing a prompt later.
            if selected == nil, let remembered = UserDefaults.standard.string(forKey: Self.key) {
                selected = models.first { $0.id == remembered }
            }
        }
    }
}
