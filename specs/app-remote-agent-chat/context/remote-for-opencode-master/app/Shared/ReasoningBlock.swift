import RemoteKit
import SwiftUI

/// The agent's thinking.
///
/// Three states, in the order they occur:
///
/// 1. **Live** — a height-capped window that scrolls itself to the bottom
///    as new text arrives. Capped because reasoning routinely runs longer
///    than the answer, and an uncapped block pushes everything that
///    matters off screen; scrolling because watching it think is the point
///    of showing it at all.
/// 2. **Settled** — collapses on its own to a single line ("Thought for
///    12s"). The reasoning has served its purpose by then; leaving it
///    expanded buries the answer under the working-out.
/// 3. **Expanded** — tap the chevron to read it in full, tap again to put
///    it away.
struct ReasoningBlock: View {
    let text: String
    /// True while the model is still producing this. Goes false when
    /// anything else arrives after it, or the turn ends.
    let isActive: Bool

    @State private var expanded = false
    @State private var startedAt = Date()
    /// Frozen when thinking stops, so the label doesn't keep counting.
    @State private var elapsed: TimeInterval?
    @ScaledMetric(relativeTo: .body) private var liveHeight: CGFloat = 132
    @ScaledMetric(relativeTo: .body) private var expandedHeight: CGFloat = 280

    private static let bottomAnchor = "reasoning-bottom"

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            header
            if isActive || expanded {
                body(height: isActive ? liveHeight : expandedHeight)
            }
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: Radius.block, style: .continuous)
                .fill(Color.surface)
        )
        .animation(Motion.easeOut(0.25), value: expanded)
        .animation(Motion.easeOut(0.25), value: isActive)
        .onChange(of: isActive) {
            // Settle: stop the clock and fold away, without stealing the
            // view from someone who opened it deliberately.
            if !isActive, elapsed == nil {
                elapsed = Date().timeIntervalSince(startedAt)
            }
        }
    }

    private var header: some View {
        Button {
            guard !isActive else { return }
            expanded.toggle()
        } label: {
            HStack(spacing: 8) {
                Image(systemName: "brain")
                    .font(.caption)
                Text(label)
                    .font(.footnote.weight(.semibold))
                Spacer()
                if !isActive {
                    Image(systemName: "chevron.down")
                        .font(.caption2.weight(.semibold))
                        .rotationEffect(.degrees(expanded ? 180 : 0))
                }
            }
            .foregroundStyle(Color.inkMuted)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .disabled(isActive)
        .accessibilityLabel(isActive ? "Thinking" : "\(label). Tap to \(expanded ? "collapse" : "expand").")
    }

    private var label: String {
        if isActive { return "Thinking…" }
        guard let elapsed, elapsed >= 1 else { return "Thought about it" }
        return "Thought for \(Int(elapsed.rounded()))s"
    }

    private func body(height: CGFloat) -> some View {
        ScrollViewReader { proxy in
            ScrollView {
                Text(text)
                    .font(.footnote)
                    .foregroundStyle(Color.inkMuted)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .textSelection(.enabled)
                // Zero-height anchor at the end: scrolling to the text
                // itself would put its *top* at the anchor, which is the
                // opposite of following along.
                Color.clear
                    .frame(height: 1)
                    .id(Self.bottomAnchor)
            }
            .frame(maxHeight: height)
            .onChange(of: text) {
                guard isActive else { return }
                withAnimation(Motion.easeOut(0.15)) {
                    proxy.scrollTo(Self.bottomAnchor, anchor: .bottom)
                }
            }
            .onAppear {
                if isActive { proxy.scrollTo(Self.bottomAnchor, anchor: .bottom) }
            }
        }
        // Fades the top edge so clipped text reads as continuing rather
        // than cut off.
        .mask(
            LinearGradient(
                stops: [
                    .init(color: .clear, location: 0),
                    .init(color: .black, location: 0.08),
                    .init(color: .black, location: 1),
                ],
                startPoint: .top, endPoint: .bottom
            )
        )
    }
}
