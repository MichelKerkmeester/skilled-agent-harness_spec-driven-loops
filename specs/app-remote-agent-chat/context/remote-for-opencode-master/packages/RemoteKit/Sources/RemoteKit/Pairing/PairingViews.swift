import SwiftUI

/// One pairing screen for both platforms: the Mac shows it inside Settings →
/// Devices, the phone as its first-run gate. Both render the same phases of
/// the same `PairingSession`, so the two screens always agree about state —
/// which is the entire UX ("open the app on both devices, tap approve").
public struct PairingPhaseView: View {
    @ObservedObject var session: PairingSession
    /// The thing to open on the other side. A Mac can pair with an iPhone
    /// *or* another Mac now, so before anything answers it can only say
    /// "other device"; the phone's peer is still always a Mac.
    private var peerKind: String {
        DeviceRole.current == .mac ? "other device" : "Mac"
    }

    public init(session: PairingSession) {
        self.session = session
    }

    public var body: some View {
        VStack(spacing: 14) {
            switch session.phase {
            case .idle, .initializing:
                ProgressView()
                Text("Getting ready…").foregroundStyle(.secondary)
            case let .noICloud(message):
                Image(systemName: "icloud.slash")
                    .font(.largeTitle)
                    .foregroundStyle(.secondary)
                Text(message)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.secondary)
            case .waitingForPeer:
                ProgressView()
                Text("Looking for your \(peerKind)…")
                    .font(.headline)
                Text("Open Remote for OpenCode on your \(peerKind). The devices find each other through your iCloud account — nothing to type.")
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.secondary)
                    .font(.callout)
            case let .peerFound(name, sas):
                sasBlock(sas)
                Text("Found **\(name)**. Make sure it shows this same code, then approve on both devices.")
                    .multilineTextAlignment(.center)
                    .font(.callout)
                Button("Approve") { session.approve() }
                    .buttonStyle(.borderedProminent)
                    .controlSize(.large)
            case let .waitingForPeerApproval(name, sas):
                sasBlock(sas)
                HStack(spacing: 8) {
                    ProgressView().controlSize(.small)
                    Text("Waiting for you to approve on \(name)…")
                        .foregroundStyle(.secondary)
                        .font(.callout)
                }
            case let .paired(name):
                Image(systemName: "checkmark.seal.fill")
                    .font(.largeTitle)
                    .foregroundStyle(.green)
                Text("Paired with \(name)").font(.headline)
            case let .failed(message):
                Image(systemName: "exclamationmark.triangle")
                    .font(.largeTitle)
                    .foregroundStyle(.orange)
                Text(message)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.secondary)
                Button("Try Again") {
                    session.stop()
                    session.start()
                }
            }
        }
        .frame(maxWidth: 420)
        .padding()
        .onAppear { session.start() }
        .onDisappear { session.stop() }
    }

    private func sasBlock(_ sas: String) -> some View {
        Text(formatted(sas))
            .font(.system(size: 40, weight: .semibold, design: .monospaced))
            .kerning(2)
            .accessibilityLabel("Pairing code \(sas.map(String.init).joined(separator: " "))")
    }

    /// "482913" → "482 913" — grouped like a verification code.
    private func formatted(_ sas: String) -> String {
        guard sas.count == 6 else { return sas }
        return sas.prefix(3) + " " + sas.suffix(3)
    }
}
