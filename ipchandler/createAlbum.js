
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

const handleCreateAlbum = async (event, albumName, formattedFiles) => {

    const targeFolder = path.join(
        app.getPath('userData'),
        'data',
        'play-list',
        albumName
    );
    
    if (!fs.existsSync(targeFolder)) {
        await fs.promises.mkdir(targeFolder, { recursive: true });
    }

    formattedFiles.forEach(async (file) => {
        const filePath = path.join(targeFolder, file.name);
        if (!fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(file.src);
            fs.writeFileSync(filePath, fileData);
        }
    });
    return 'file added succfully'
}


module.exports = {
    handleCreateAlbum: handleCreateAlbum
}