import RemoteKit
import Foundation

/// The menu bar's answer to "who is connected right now?" — one place,
/// reported into by every connection, so the UI never disagrees with
/// itself. Token-keyed because more than one client can be attached at
/// once (the phone plus this Mac's own workspace, say), and the first one
/// to disconnect must not blank the label while another is still there.
@MainActor
final class ConnectedClients: ObservableObject {
    static let shared = ConnectedClients()

    struct Client: Identifiable {
        let id: UUID
        let name: String
        /// The workspace in this same process, over 127.0.0.1. Real, but
        /// not what the menu means by "connected" — a Mac reporting its own
        /// presence to itself would read as noise.
        let loopback: Bool
        let since: Date
    }

    @Published private(set) var clients: [Client] = []
    @Published private(set) var lastSeen: Date?

    /// What the menu shows: the most recent *device* — loopback excluded.
    var connectedName: String? {
        clients.last(where: { !$0.loopback })?.name
    }

    func noteAuthenticated(name: String, loopback: Bool) -> UUID {
        let token = UUID()
        clients.append(Client(id: token, name: name, loopback: loopback, since: Date()))
        lastSeen = Date()
        return token
    }

    func noteDisconnected(_ token: UUID) {
        clients.removeAll { $0.id == token }
        lastSeen = Date()
    }
}
