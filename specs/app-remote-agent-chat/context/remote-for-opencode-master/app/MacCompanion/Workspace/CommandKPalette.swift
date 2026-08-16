import RemoteKit
import SwiftUI

/// ⌘K: one field over everything reachable — sessions to jump to, slash
/// commands to insert. Type, arrow, Return. The list is built from the
/// same stores the sidebar and composer read, so it can never disagree
/// with them.
struct CommandKPalette: View {
    @ObservedObject var state: WorkspaceState
    let insertCommand: (AgentCommand) -> Void
    let dismiss: () -> Void

    @State private var query = ""
    @State private var highlighted = 0
    @FocusState private var focused: Bool

    private enum Entry: Identifiable {
        case session(Session)
        case command(AgentCommand)

        var id: String {
            switch self {
            case let .session(s): return "session-\(s.id)"
            case let .command(c): return "command-\(c.name)"
            }
        }
    }

    private var entries: [Entry] {
        let needle = query.lowercased()
        let sessions = state.sessions
            .filter { needle.isEmpty || ($0.title ?? "").lowercased().contains(needle) }
            .prefix(6)
            .map(Entry.session)
        let commands = state.commands.matching(query)
            .prefix(8)
            .map(Entry.command)
        return Array(sessions) + Array(commands)
    }

    var body: some View {
        VStack(spacing: 0) {
            TextField("Search sessions and commands…", text: $query)
                .textFieldStyle(.plain)
                .font(.title3)
                .focused($focused)
                .padding(14)
                .onSubmit { choose() }
                .onChange(of: query) { highlighted = 0 }

            Divider().overlay(Color.hairline)

            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 2) {
                        ForEach(Array(entries.enumerated()), id: \.element.id) { index, entry in
                            row(entry, selected: index == highlighted)
                                .id(index)
                                .onTapGesture { choose(index) }
                        }
                    }
                    .padding(8)
                }
                .frame(maxHeight: 320)
                .onChange(of: highlighted) { proxy.scrollTo(highlighted) }
            }
        }
        .frame(width: 560)
        .background(
            RoundedRectangle(cornerRadius: Radius.sheet, style: .continuous)
                .fill(.regularMaterial)
                .overlay(
                    RoundedRectangle(cornerRadius: Radius.sheet, style: .continuous)
                        .stroke(Color.hairline, lineWidth: 1)
                )
        )
        .shadow(color: .black.opacity(0.25), radius: 24, y: 8)
        .onMoveCommand { direction in
            switch direction {
            case .up: highlighted = max(0, highlighted - 1)
            case .down: highlighted = min(entries.count - 1, highlighted + 1)
            default: break
            }
        }
        .onExitCommand(perform: dismiss)
        .task { focused = true }
    }

    @ViewBuilder
    private func row(_ entry: Entry, selected: Bool) -> some View {
        HStack(spacing: 10) {
            switch entry {
            case let .session(session):
                Image(systemName: "bubble.left.and.text.bubble.right")
                    .foregroundStyle(Color.inkMuted)
                    .frame(width: 18)
                VStack(alignment: .leading, spacing: 1) {
                    Text(session.title ?? "Untitled session").lineLimit(1)
                    if let directory = session.directory {
                        Text(directory.split(separator: "/").last.map(String.init) ?? directory)
                            .font(.caption)
                            .foregroundStyle(Color.inkMuted)
                    }
                }
            case let .command(command):
                Image(systemName: "command")
                    .foregroundStyle(Color.clay)
                    .frame(width: 18)
                VStack(alignment: .leading, spacing: 1) {
                    Text("/\(command.name)").font(.body.monospaced()).lineLimit(1)
                    if let detail = command.description, !detail.isEmpty {
                        Text(detail)
                            .font(.caption)
                            .foregroundStyle(Color.inkMuted)
                            .lineLimit(1)
                    }
                }
            }
            Spacer(minLength: 0)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(
            RoundedRectangle(cornerRadius: Radius.control, style: .continuous)
                .fill(selected ? Color.surfaceRaised : .clear)
        )
        .contentShape(Rectangle())
    }

    private func choose(_ index: Int? = nil) {
        let pick = index ?? highlighted
        guard entries.indices.contains(pick) else { dismiss(); return }
        switch entries[pick] {
        case let .session(session):
            state.selection = .session(session)
        case let .command(command):
            insertCommand(command)
        }
        dismiss()
    }
}
