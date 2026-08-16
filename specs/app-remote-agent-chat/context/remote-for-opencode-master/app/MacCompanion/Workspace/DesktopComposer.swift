import RemoteKit
import SwiftUI
import UniformTypeIdentifiers

/// The prompt bar, desktop grammar: Return sends, Option-Return breaks the
/// line, files arrive by drag, paste, or the open panel. Same rounded
/// container and chip row as the phone — it should read as the same
/// product at a different desk.
struct DesktopComposer: View {
    @Binding var input: String
    let running: Bool
    @ObservedObject var attachments: PromptAttachments
    @ObservedObject var models: ModelStore
    @ObservedObject var agents: AgentStore
    let onSend: () -> Void
    let onAbort: () -> Void

    @State private var showingFiles = false
    @FocusState private var focused: Bool

    private var empty: Bool {
        input.trimmingCharacters(in: .whitespaces).isEmpty
    }

    /// Send needs something to send — text or files; stop is always
    /// available while a turn runs.
    private var sendEnabled: Bool { running || !empty || !attachments.isEmpty }

    var body: some View {
        VStack(spacing: 8) {
            if !attachments.isEmpty {
                AttachmentStrip(attachments: attachments)
            }

            TextField("Ask the agent…", text: $input, axis: .vertical)
                .textFieldStyle(.plain)
                .lineLimit(1 ... 10)
                .focused($focused)
                .onSubmit(onSend)
                .frame(maxWidth: .infinity, alignment: .leading)

            HStack(spacing: 8) {
                addButton
                // Always present, even before the catalogue arrives:
                // hiding it made a failed fetch look like a missing
                // feature, which is exactly how it was first reported.
                ModelMenu(models: models)
                if !agents.agents.isEmpty {
                    AgentMenu(agents: agents)
                }
                Spacer(minLength: 4)
                CircleButton(
                    systemName: running ? "stop.fill" : "arrow.up",
                    foreground: sendEnabled ? .white : .secondary,
                    background: sendEnabled ? Color.accentColor : Color.primary.opacity(0.08),
                    action: { running ? onAbort() : onSend() }
                )
                .disabled(!sendEnabled)
                .accessibilityLabel(running ? "Stop the agent" : "Send")
                .keyboardShortcut(running ? "." : .return, modifiers: .command)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 10)
        .background(
            RoundedRectangle(cornerRadius: Radius.composer, style: .continuous)
                .fill(Color.primary.opacity(0.06))
                .overlay(
                    RoundedRectangle(cornerRadius: Radius.composer, style: .continuous)
                        .stroke(Color.primary.opacity(0.08), lineWidth: 1)
                )
        )
        .padding(.horizontal, 10)
        .padding(.bottom, 8)
        .animation(.easeInOut(duration: 0.15), value: sendEnabled)
        .animation(.easeInOut(duration: 0.2), value: attachments.items.count)
        .fileImporter(
            isPresented: $showingFiles, allowedContentTypes: [.item],
            allowsMultipleSelection: true
        ) { result in
            guard case let .success(urls) = result else { return }
            for url in urls { attachments.add(fileAt: url) }
        }
        // Drag anything onto the composer; images get the same shrinking
        // the phone applies before they reach the wire.
        .dropDestination(for: URL.self) { urls, _ in
            for url in urls { attachments.add(fileAt: url) }
            return !urls.isEmpty
        }
        .onPasteCommand(of: [UTType.image.identifier, UTType.fileURL.identifier]) { providers in
            paste(providers)
        }
        .task { focused = true }
    }

    private var addButton: some View {
        Button {
            showingFiles = true
        } label: {
            Image(systemName: "plus")
                .font(.system(size: 15, weight: .semibold))
                .frame(width: 32, height: 32)
                .background(Circle().fill(Color.primary.opacity(0.08)))
        }
        .buttonStyle(.plain)
        .accessibilityLabel("Add files to the conversation")
    }

    private func paste(_ providers: [NSItemProvider]) {
        for provider in providers {
            if provider.hasItemConformingToTypeIdentifier(UTType.fileURL.identifier) {
                _ = provider.loadObject(ofClass: URL.self) { url, _ in
                    guard let url else { return }
                    Task { @MainActor in attachments.add(fileAt: url) }
                }
            } else if provider.hasItemConformingToTypeIdentifier(UTType.image.identifier) {
                provider.loadDataRepresentation(forTypeIdentifier: UTType.image.identifier) { data, _ in
                    guard let data else { return }
                    Task { @MainActor in attachments.add(imageData: data, name: "pasted.jpg") }
                }
            }
        }
    }
}
