import RemoteKit
import SwiftUI

@main
struct PhoneApp: App {
    @Environment(\.scenePhase) private var scenePhase
    @UIApplicationDelegateAdaptor(PushManager.self) private var push

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(push)
        }
        .onChange(of: scenePhase) {
            // iOS suspended our socket while we were away, and the NAT
            // mapping behind the remembered punch endpoint has probably
            // lapsed with it. Dropping it turns a stale path into a quick
            // re-verify instead of a mysterious timeout.
            if scenePhase == .active { PunchClient.shared.invalidate() }
        }
    }
}

/// Pairing is the front door: an unpaired phone can do nothing else, and a
/// paired one should never see the pairing screen again.
struct RootView: View {
    @State private var paired = PairingStore.load() != nil
    @EnvironmentObject private var push: PushManager

    var body: some View {
        Group {
            if paired {
                HomeView()
            } else {
                PairingGate()
            }
        }
        .onReceive(NotificationCenter.default.publisher(for: PairingStore.changed)) { _ in
            paired = PairingStore.load() != nil
            if paired { push.enable() }
        }
        .onAppear {
            if paired { push.enable() }
        }
        // A tapped push lands here, wherever the user was: the approvals
        // sheet fetches what's actually blocked and answers it in place.
        .sheet(isPresented: Binding(
            get: { push.attention != nil },
            set: { if !$0 { push.attention = nil } }
        )) {
            if let attention = push.attention {
                ApprovalsView(attention: attention)
            }
        }
    }
}

struct PairingGate: View {
    @StateObject private var session = PairingSession()

    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            BrandWordmark(height: 20, color: .ink)
            Text("Your Mac writes the code. Your phone holds the leash.")
                .foregroundStyle(Color.inkMuted)
            PairingPhaseView(session: session)
            Spacer()
        }
        .padding()
    }
}
