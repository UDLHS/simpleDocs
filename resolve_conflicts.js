const fs = require('fs');
const path = require('path');

function resolveFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Regex to match a git conflict block and extract the HEAD part
    const regex = /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n[\s\S]*?>>>>>>> [a-f0-9]+\r?\n?/g;
    const newContent = content.replace(regex, '$1');
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Resolved: ${filePath}`);
    }
}

const files = [
    "client/Engine/Strategies/ModernTerminalStrategy.cs",
    "client/Engine/Models/CaptureResult.cs",
    "client/Engine/Strategies/IDEStrategy.cs",
    "client/Engine/Strategies/ClipboardCompatibilityMode.cs",
    "client/Engine/Strategies/ElectronStrategy.cs",
    "client/Engine/Strategies/ClassicTerminalStrategy.cs",
    "client/Engine/Strategies/CapturePipelines.cs",
    "client/Engine/Models/CaptureMethod.cs",
    "client/BackendClient.cs",
    "client/App.xaml.cs"
];

for(const file of files) {
    resolveFile(path.join(__dirname, file));
}
