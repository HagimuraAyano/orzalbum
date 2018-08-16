const vscode = require('vscode');
const ImageList = require('./ImageList');
let imageList = null;

async function loadAlbum() {
    let [{ path: dir }] = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: '打開目錄',
    });

    if (!dir) return;
    if (imageList) {
        imageList.changeDir(dir);
    } else {
        imageList = new ImageList(dir);
    }
}

function nextImage() {
    if (imageList) {
        imageList.next();
    } else {
        vscode.window.showInformationMessage('请先设置目录');
    }
}

function prevImage() {
    if (imageList) {
        imageList.prev();
    } else {
        vscode.window.showInformationMessage('請先設置目錄');
    }
}


function activate(context) {

    const load = vscode.commands.registerCommand('extension.loadAlbum', loadAlbum);
    const next = vscode.commands.registerCommand('extension.nextImage', nextImage);
    const prev = vscode.commands.registerCommand('extension.prevImage', prevImage);
    context.subscriptions.push(load, next, prev);
}
exports.activate = activate;

function deactivate() {
    imageList = null;
}
exports.deactivate = deactivate;