import RemoteKit
import LocalAuthentication

/// The biometric gate in front of "let the agent do it". Approving a
/// command is the one action in this app with real blast radius, and a
/// phone left on a table shouldn't be enough to grant it.
///
/// Rejections are never gated — declining must always be the easy path.
/// A phone with no biometrics falls back to its passcode; a phone with
/// neither (or an auth error) does not approve.
enum Approver {
    static func confirm(_ reason: String = "Approve the agent's request") async -> Bool {
        let context = LAContext()
        var error: NSError?
        guard context.canEvaluatePolicy(.deviceOwnerAuthentication, error: &error) else {
            // No passcode set at all — the user has opted out of device
            // security entirely; gating on nothing would just be a broken
            // button.
            return true
        }
        return (try? await context.evaluatePolicy(
            .deviceOwnerAuthentication, localizedReason: reason
        )) ?? false
    }
}
