const fs = require('fs');
const path = require('path');
const vscode = require('vscode');
const os = require('os');

class ImageList {
  constructor(dir) {
    this.changeDir(dir);
  }
  next() {
    if (this.idx < this.imageList.length - 1) {
      this.idx += 1;
      this.showImage();
    } else {
      vscode.window.showInformationMessage('沒有更多圖片了');
    }
  }
  prev() {
    if (this.idx > 0) {
      this.idx -= 1;
      this.showImage();
    } else {
      vscode.window.showInformationMessage('沒有更多圖片了');
    }
  }
  showImage() {
    const filename = this.imageList[this.idx];
    this.panel.title = `${filename}(${this.idx + 1}/${this.imageList.length})`;
    const fp = path.join(this.dir, filename);
    const html = `
    <img id="img" src="${vscode.Uri.file(fp).with({ scheme: 'vscode-resource' })}"></img>
    `;
    this.panel.webview.html = html;
  }
  changeDir(dir) {
    if (os.platform() ==='win32') {
      dir = dir.slice(1);
    }
    const validExtensions = ['.jpg', '.png', '.gif', '.tif', '.bmp', '.jpeg'];
    this.dir = dir;
    this.imageList = fs.readdirSync(dir).filter(fileName => {
      return validExtensions.indexOf(path.extname(fileName).toLowerCase()) > -1;
    });
    if (this.panel) {
      this.panel.dispose();
    }
    this.panel = vscode.window.createWebviewPanel('album', 'album', vscode.ViewColumn.Two, {
      localResourceRoots: [vscode.Uri.file(dir)]
    });
    this.idx = -1;
    this.next();
  }
}

module.exports = ImageList;