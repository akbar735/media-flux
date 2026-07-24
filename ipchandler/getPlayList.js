const path = require('node:path')
const fs = require('fs')


const handleGetAllPlayList =  async () => {
    const containerPath = path.join(__dirname,'..','data', 'play-list');

    const mediaFiles = await fs.promises.readdir(containerPath);
    const playLists = []
    for(const index in mediaFiles){
        const fullPath = `${containerPath}/${mediaFiles[index]}`;
        const stats = await fs.promises.stat(fullPath);
        if(stats.isDirectory()){
            playLists.push({
                path: fullPath,
                name: mediaFiles[index]
            })
           
        }
    }
    return playLists
}

const handleDeletePlayList = async (event, playlistName) => {
    const containerPath = path.join(__dirname, '..', 'data', 'play-list');
    const targetFolder = path.join(containerPath, playlistName);
    if (fs.existsSync(targetFolder)) {
        await fs.promises.rm(targetFolder, { recursive: true, force: true });
        return 'playlist deleted successfully';
    }
    throw new Error('Playlist does not exist');
}

module.exports = {
    handleGetAllPlayList,
    handleDeletePlayList
}