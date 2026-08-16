import RemoteKit
import SwiftUI

/// What the sidebar can point the workspace at.
enum WorkspaceSelection: Hashable {
    /// Continue an existing conversation.
    case session(Session)
    /// Start fresh in a project.
    case project(Project)
}

/// One workspace window's world: the peer it is talking to (v1: always
/// this Mac over loopback — M3 makes this a chosen peer), the lists the
/// sidebar shows, and the current selection. The lists and their optimistic
/// edit semantics are the phone's HomeView logic, re-homed where a sidebar
/// and a session pane can both see them.
@MainActor
final class WorkspaceState: ObservableObject {
    /// Which Mac this window drives: nil is this one, over loopback; a
    /// peer is a remote Mac over the paired channel (LAN trial, then the
    /// punched path). Loopback runs the identical Wire handshake against
    /// our own listener — the same path a remote Mac uses, which is the
    /// point.
    @Published private(set) var activePeer: PairedPeer?

    /// How everything in this window reaches the companion. Pinned per
    /// peer: rebuilt on switch, so anything that captured it keeps talking
    /// to the Mac it was made for.
    private(set) var makeLink: () -> CompanionLink

    private static func link(for peer: PairedPeer?) -> () -> CompanionLink {
        if let peer { return { CompanionLink(target: .peer(peer)) } }
        return { CompanionLink(target: .local(LoopbackTrust.key)) }
    }

    /// The Macs the sidebar offers besides this one.
    var pairedMacs: [PairedPeer] {
        PairingStore.peers().filter { $0.role == .mac }
    }

    /// Point the window at another Mac: fresh link, fresh stores, fresh
    /// lists — a workspace's whole world is per-peer.
    func selectPeer(_ peer: PairedPeer?) {
        guard peer?.id != activePeer?.id else { return }
        activePeer = peer
        makeLink = Self.link(for: peer)
        models = ModelStore(makeLink: makeLink)
        agents = AgentStore(makeLink: makeLink)
        commands = CommandStore(makeLink: makeLink)
        selection = nil
        sessions = []
        projects = []
        error = nil
        search = ""
        Task {
            await load()
            await models.loadIfNeeded()
            await agents.loadIfNeeded()
            await commands.loadIfNeeded()
        }
    }

    @Published var projects: [Project] = []
    @Published var sessions: [Session] = []
    @Published var error: String?
    @Published var loading = false
    @Published var search = ""
    @Published var selection: WorkspaceSelection?

    // Window-level UI state, here so menu commands (which live outside the
    // view tree) and the panes both reach one truth.
    @Published var inspectorShown = true
    @Published var inspectorTab = InspectorTab.changes
    @Published var paletteShown = false
    /// A slash command picked in the ⌘K palette, waiting for the composer
    /// to take it into the input field.
    @Published var pendingCommand: AgentCommand?

    /// Per-window, per-peer stores, built over this window's link — not
    /// the phone's process-wide singletons.
    private(set) var models: ModelStore
    private(set) var agents: AgentStore
    private(set) var commands: CommandStore

    private var searchTask: Task<Void, Never>?

    init() {
        let link = Self.link(for: nil)
        makeLink = link
        models = ModelStore(makeLink: link)
        agents = AgentStore(makeLink: link)
        commands = CommandStore(makeLink: link)
    }

    func load() async {
        loading = true
        defer { loading = false }
        error = nil
        await loadSessions()
        for await event in makeLink().run(Wire.Request(kind: "projects")) {
            switch event.kind {
            case "projects": projects = event.projects ?? []
            case "failed": error = event.text
            default: break
            }
        }
    }

    /// Sessions alone — what a search re-runs without disturbing the
    /// project list.
    func loadSessions() async {
        var request = Wire.Request(kind: "sessions")
        request.search = search.isEmpty ? nil : search
        for await event in makeLink().run(request) {
            switch event.kind {
            case "sessions": sessions = event.sessions ?? []
            case "failed": error = event.text
            default: break
            }
        }
    }

    /// Debounces typing into one request per pause, so a search doesn't
    /// fire a round trip per keystroke.
    func searchChanged() {
        searchTask?.cancel()
        searchTask = Task {
            try? await Task.sleep(for: .milliseconds(300))
            guard !Task.isCancelled else { return }
            await loadSessions()
        }
    }

    /// Removed locally first: the list should respond to the click, not to
    /// a round trip. A failure puts it back and says why.
    func delete(_ session: Session) {
        let index = sessions.firstIndex(of: session)
        sessions.removeAll { $0.id == session.id }
        if case let .session(selected) = selection, selected.id == session.id {
            selection = nil
        }
        var request = Wire.Request(kind: "session.delete")
        request.session = session.id
        request.project = session.directory
        Task {
            for await event in makeLink().run(request) where event.kind == "failed" {
                error = event.text
                if let index { sessions.insert(session, at: min(index, sessions.count)) }
            }
        }
    }

    /// ⌃⌘↑/↓ — step the selection through the session list.
    func step(_ offset: Int) {
        guard !sessions.isEmpty else { return }
        let current: Int
        if case let .session(selected) = selection,
           let index = sessions.firstIndex(where: { $0.id == selected.id }) {
            current = index
        } else {
            current = offset > 0 ? -1 : 0
        }
        let next = min(max(current + offset, 0), sessions.count - 1)
        selection = .session(sessions[next])
    }

    func rename(_ session: Session, to title: String) {
        let trimmed = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        if let index = sessions.firstIndex(where: { $0.id == session.id }) {
            sessions[index].title = trimmed
        }
        var request = Wire.Request(kind: "session.rename")
        request.session = session.id
        request.project = session.directory
        request.title = trimmed
        Task {
            for await event in makeLink().run(request) where event.kind == "failed" {
                error = event.text
            }
        }
    }
}
