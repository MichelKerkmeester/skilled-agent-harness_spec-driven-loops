import RemoteKit
import SwiftUI

/// "The agent wants to do X — allow?"
///
/// A sheet rather than an alert, deliberately: Apple's HIG puts choices
/// related to an intentional action on an action sheet, and this one
/// carries content the user has to read — the exact command, its scope,
/// what "always" would grant. Every shipped agent tool converged here.
///
/// **The card varies with risk.** Anthropic reports users approve 93% of
/// permission prompts; a card that looks identical every time is
/// optimising for that habituation, and varying presentation by risk is
/// the empirically supported counter. A `git status` and an `rm -rf` must
/// not look the same.
struct PermissionSheet: View {
    let request: PermissionRequest
    /// reply, plus an optional message when the user redirects instead of
    /// simply refusing.
    let reply: (String, String?) -> Void

    @State private var confirmingAlways = false
    @State private var redirecting = false
    @State private var redirection = ""
    @Environment(\.dynamicTypeSize) private var typeSize

    private var risk: PermissionRequest.Risk { request.riskLevel }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    header
                    command
                    if redirecting { redirectField } else { scopeNote }
                }
                .padding(20)
            }
            .background(Color.canvas)
            .safeAreaInset(edge: .bottom) { actions }
        }
        .presentationDetents([.medium, .large])
        .presentationBackground(Color.canvas)
        .interactiveDismissDisabled()
    }

    // MARK: - Content

    private var header: some View {
        HStack(spacing: 10) {
            Image(systemName: risk == .high ? "exclamationmark.triangle.fill" : "hand.raised.fill")
                .foregroundStyle(risk == .high ? Color.caution : Color.inkMuted)
            Text(title)
                .font(.headline)
                .foregroundStyle(Color.ink)
            Spacer()
        }
    }

    private var title: String {
        switch request.permission {
        case "bash": return risk == .high ? "Run a risky command?" : "Run a command?"
        case "edit", "write", "patch": return "Edit files?"
        case "external_directory": return "Reach outside the project?"
        case "webfetch", "websearch": return "Access the network?"
        default: return (request.permission ?? "Permission").capitalized
        }
    }

    /// The thing being asked about, in mono, scrollable horizontally —
    /// a wrapped command hides exactly the tail that makes it dangerous.
    private var command: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            Text((request.patterns ?? []).joined(separator: "\n"))
                .font(.system(.subheadline, design: .monospaced))
                .foregroundStyle(Color.ink)
                .textSelection(.enabled)
                .padding(14)
        }
        .background(
            RoundedRectangle(cornerRadius: Radius.block, style: .continuous)
                .fill(Color.surface)
                .overlay(
                    RoundedRectangle(cornerRadius: Radius.block, style: .continuous)
                        .stroke(risk == .high ? Color.caution.opacity(0.5) : Color.hairline,
                                lineWidth: risk == .high ? 1.5 : 1)
                )
        )
    }

    @ViewBuilder
    private var scopeNote: some View {
        if let always = request.always, !always.isEmpty {
            Text("“Always” allows \(always.joined(separator: ", ")) for the rest of this session.")
                .font(.footnote)
                .foregroundStyle(Color.inkMuted)
        }
    }

    private var redirectField: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("What should it do instead?")
                .font(.footnote.weight(.semibold))
                .foregroundStyle(Color.inkMuted)
            TextField("Optional — leave blank to just say no", text: $redirection, axis: .vertical)
                .lineLimit(2 ... 5)
                .padding(12)
                .background(
                    RoundedRectangle(cornerRadius: Radius.control, style: .continuous)
                        .fill(Color.surface)
                )
        }
    }

    // MARK: - Actions

    @ViewBuilder
    private var actions: some View {
        VStack(spacing: 10) {
            if redirecting {
                Button("Reject") { reply("reject", redirection.isEmpty ? nil : redirection) }
                    .buttonStyle(Primary(tint: .negative))
                Button("Back") { redirecting = false }
                    .buttonStyle(Secondary())
            } else if confirmingAlways {
                Text("Allow every \(request.permission ?? "action") like this until OpenCode restarts?")
                    .font(.footnote)
                    .foregroundStyle(Color.inkMuted)
                    .multilineTextAlignment(.center)
                Button("Yes, allow always") { reply("always", nil) }
                    .buttonStyle(Primary(tint: .clay))
                Button("Back") { confirmingAlways = false }
                    .buttonStyle(Secondary())
            } else {
                Button("Allow Once") { reply("once", nil) }
                    .buttonStyle(Primary(tint: .clay))
                // Reject sits apart from Allow on purpose: adjacent 44pt
                // targets for consequential opposites is a known hazard.
                HStack(spacing: 10) {
                    Button("Reject…") { redirecting = true }
                        .buttonStyle(Secondary())
                    // High-risk asks don't offer a blanket grant at all.
                    if risk != .high {
                        Button("Always") { confirmingAlways = true }
                            .buttonStyle(Secondary())
                    }
                }
            }
        }
        .padding(20)
        .background(.bar)
        .animation(Motion.easeOut(Motion.feedback), value: redirecting)
        .animation(Motion.easeOut(Motion.feedback), value: confirmingAlways)
    }

    private struct Primary: ButtonStyle {
        let tint: Color
        func makeBody(configuration: Configuration) -> some View {
            configuration.label
                .font(.body.weight(.semibold))
                .foregroundStyle(Color.white)
                .frame(maxWidth: .infinity, minHeight: 48)
                .background(
                    RoundedRectangle(cornerRadius: Radius.control, style: .continuous)
                        .fill(tint.opacity(configuration.isPressed ? 0.75 : 1))
                )
        }
    }

    private struct Secondary: ButtonStyle {
        func makeBody(configuration: Configuration) -> some View {
            configuration.label
                .font(.body)
                .foregroundStyle(Color.ink)
                .frame(maxWidth: .infinity, minHeight: 48)
                .background(
                    RoundedRectangle(cornerRadius: Radius.control, style: .continuous)
                        .stroke(Color.hairline, lineWidth: 1)
                        .background(
                            RoundedRectangle(cornerRadius: Radius.control, style: .continuous)
                                .fill(configuration.isPressed ? Color.surface : .clear)
                        )
                )
        }
    }
}
