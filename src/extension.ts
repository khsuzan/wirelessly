// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    // Register a Webview View provider for the sidebar, pass extensionUri
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('wirelesslySidebarView', new WirelesslySidebarProvider(context.extensionUri))
    );
}

class WirelesslySidebarProvider implements vscode.WebviewViewProvider {
    constructor(private extensionUri: vscode.Uri) {}
    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ) {
        webviewView.webview.options = { enableScripts: true };
        webviewView.webview.html = getWebviewContent(webviewView.webview, this.extensionUri);
        // Listen for messages from the webview
        webviewView.webview.onDidReceiveMessage(msg => {
            if (msg && msg.command === 'openPairPanel') {
                openPairPanel(this.extensionUri);
            }
        });
    }
}

function openPairPanel(extensionUri: vscode.Uri) {
    const panel = vscode.window.createWebviewPanel(
        'wirelesslyPairPanel',
        'Pair New Device',
        vscode.ViewColumn.Active,
        { enableScripts: true }
    );
    panel.webview.html = getPairPanelContent(panel.webview, extensionUri);
}

function getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
    // Use external CSS for production
    const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'sidebar.css'));
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Wireless Debug</title>
    <link rel="stylesheet" href="${cssUri}">
</head>
<body>
    <div class="container">
        <div class="header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/><rect x="2" y="2" width="20" height="20" rx="5"/></svg>
            Wireless Debug
        </div>
        <button class="vscode-button" id="pairBtn">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Pair Device
        </button>
        <div class="section-label">CONNECTED</div>
        <ul class="device-list" id="connected-list">
            <li class="device-item" data-id="iphone15pro">
                <span class="dot connected"></span>
                <span class="device-info">
                    <span class="device-name">iPhone 15 Pro</span>
                    <span class="device-time">2 min ago</span>
                </span>
                <button class="menu-btn" onclick="toggleMenu(event, 'connected', 'iphone15pro')">&#8942;</button>
                <div class="device-menu">
                    <div class="device-menu-option" onclick="renameDevice('iphone15pro')">Rename</div>
                    <div class="device-menu-option" onclick="copyDeviceId('iphone15pro')">Copy Device ID</div>
                    <div class="device-menu-option" onclick="disconnectDevice('iphone15pro')">Disconnect</div>
                </div>
            </li>
            <li class="device-item" data-id="ipadair">
                <span class="dot connected"></span>
                <span class="device-info">
                    <span class="device-name">iPad Air</span>
                    <span class="device-time">5 min ago</span>
                </span>
                <button class="menu-btn" onclick="toggleMenu(event, 'connected', 'ipadair')">&#8942;</button>
                <div class="device-menu">
                    <div class="device-menu-option" onclick="renameDevice('ipadair')">Rename</div>
                    <div class="device-menu-option" onclick="copyDeviceId('ipadair')">Copy Device ID</div>
                    <div class="device-menu-option" onclick="disconnectDevice('ipadair')">Disconnect</div>
                </div>
            </li>
        </ul>
        <hr class="divider" />
        <div class="section-label">AVAILABLE</div>
        <ul class="device-list" id="available-list">
            <li class="device-item" data-id="samsungs24">
                <span class="dot available"></span>
                <span class="device-info">
                    <span class="device-name">Samsung S24</span>
                    <span class="device-time">1 hour ago</span>
                </span>
                <button class="menu-btn" onclick="toggleMenu(event, 'available', 'samsungs24')">&#8942;</button>
                <div class="device-menu">
                    <div class="device-menu-option" onclick="renameDevice('samsungs24')">Rename</div>
                    <div class="device-menu-option" onclick="copyDeviceId('samsungs24')">Copy Device ID</div>
                </div>
            </li>
            <li class="device-item" data-id="macbookpro">
                <span class="dot available"></span>
                <span class="device-info">
                    <span class="device-name">MacBook Pro</span>
                </span>
                <button class="menu-btn" onclick="toggleMenu(event, 'available', 'macbookpro')">&#8942;</button>
                <div class="device-menu">
                    <div class="device-menu-option" onclick="renameDevice('macbookpro')">Rename</div>
                    <div class="device-menu-option" onclick="copyDeviceId('macbookpro')">Copy Device ID</div>
                </div>
            </li>
        </ul>
    </div>
    <script>
        const vscode = acquireVsCodeApi();
        document.getElementById('pairBtn').onclick = function() {
            vscode.postMessage({ command: 'openPairPanel' });
        };
        // Device menu logic
        function toggleMenu(event, section, id) {
            event.stopPropagation();
            // Close all other menus
            document.querySelectorAll('.device-item.menu-open').forEach(el => el.classList.remove('menu-open'));
            // Open this menu
            const item = event.target.closest('.device-item');
            item.classList.toggle('menu-open');
        }
        document.body.addEventListener('click', function(e) {
            // Close all menus if click outside
            document.querySelectorAll('.device-item.menu-open').forEach(el => el.classList.remove('menu-open'));
        });
        // Device menu actions
        function renameDevice(id) {
            // TODO: Implement rename logic
            alert('Rename device: ' + id);
        }
        function copyDeviceId(id) {
            // TODO: Implement copy logic
            alert('Copied device id: ' + id);
        }
        function disconnectDevice(id) {
            // TODO: Implement disconnect logic
            alert('Disconnect device: ' + id);
        }
    </script>
</body>
</html>
    `;
}

function getPairPanelContent(webview: vscode.Webview, extensionUri: vscode.Uri): string {
    // Use external CSS for production
    const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'pair-panel.css'));
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pair New Device</title>
    <link rel="stylesheet" href="${cssUri}">
</head>
<body>
    <div class="modal">
        <div class="modal-header">
            Pair New Device
            <button class="modal-close" onclick="window.close()">&times;</button>
        </div>
        <hr class="modal-divider" />
        <div class="modal-body">
            <div style="margin-bottom: 16px; font-size: 0.98rem; color: var(--vscode-descriptionForeground);">Choose how you want to pair your device</div>
            <div class="pair-option" onclick="alert('Pair with code clicked')">
                <span class="pair-option-icon">&#60;/&#62;</span>
                <span>
                    <span class="pair-option-title">Pair with Code</span><br>
                    <span class="pair-option-desc">Use a 6-digit code</span>
                </span>
            </div>
            <div class="pair-option" onclick="alert('Pair with QR clicked')">
                <span class="pair-option-icon">&#128273;</span>
                <span>
                    <span class="pair-option-title">Pair with QR Code</span><br>
                    <span class="pair-option-desc">Scan with your device</span>
                </span>
            </div>
        </div>
    </div>
</body>
</html>
    `;
}

// This method is called when your extension is deactivated
export function deactivate() { }
