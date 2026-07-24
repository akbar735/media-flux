const path = require('node:path')
const fs = require('fs');
const { app } = require('electron');

var jsmediatags = require("jsmediatags");
var { isAudioOrVideo } = require('../helper')
const getMetaData = (url) => {
    return new Promise((resolve, reject) => {
        jsmediatags.read(url, {
            onSuccess: function (tag) {
                resolve(tag);
            },
            onError: function (error) {
                reject(error)
            }
        });
    })
}

const handleGetFileMetaData = async (_event, url) => {
    const metadata = await getMetaData(url);

    let base64String = ''
    if (metadata?.tags?.picture?.data) {
        const dataArray = metadata.tags.picture.data;
        let charArray = [];
        for (let i = 0; i < dataArray.length; i++) {
            charArray.push(String.fromCharCode(dataArray[i]));
        }
        base64String = btoa(charArray.join(''));
    }

    return {
        album: metadata?.tags?.album,
        picture: {
            format: metadata?.tags?.picture?.format,
            description: metadata?.tags?.picture?.description,
            type: metadata?.tags?.picture?.type,
            base64Image: `data:${metadata?.tags?.picture?.format};base64,${base64String}`
        },
        artist: metadata?.tags?.artist,
        title: metadata?.tags?.title
    }

}
const getFiles = async (_event, foldersArr, fileType) => {
    const files = []
    for (let i = 0; i < foldersArr.length; i++) {
        let audioFiles = []
        try {
            audioFiles = await fs.promises.readdir(foldersArr[i]);
        } catch (err) {
            console.error(err)
        }

        audioFiles.forEach(file => {
            const filePath = path.join(foldersArr[i], file); // Get the full path of the file
            let fileStat = '';
            try {
                fileStat = fs.statSync(filePath); // Get the file's stats
            } catch (err) {
                console.error(err)
            }


            if (fileStat && fileStat.isDirectory()) {
                // If it's a directory, recursively call readDirectoryRecursively
                // readDirectoryRecursively(filePath);
            } else if (fileStat) {
                // If it's a file, print its details
                const type = isAudioOrVideo(filePath)
                if (type === fileType) {
                    files.push({
                        lastModified: fileStat.mtimeMs,
                        lastModifiedDate: fileStat.mtime,
                        name: file,
                        path: filePath,
                        size: fileStat.size,
                        type: type
                    })
                }
            }
        });
    }
    return files;
}

const getAllFiles = async (_event, folder, fileType) => {
    const files = []
    const containerPath = path.join(
        app.getPath('userData'),
        'data',
        'play-list',
        folder
    );

    let mediaFiles = []
    try {
        mediaFiles = await fs.promises.readdir(containerPath);
    } catch (err) {
        console.error(err)
    }

    mediaFiles.forEach(file => {
        let filePath = ''
        try {
            filePath = path.join(containerPath, file);
        } catch (err) {
            console.error(err);
        }
        const fileStat = fs.statSync(filePath); // Get the file's stats

        if (fileStat.isDirectory()) {
            // If it's a directory, recursively call readDirectoryRecursively
            // readDirectoryRecursively(filePath);
        } else {
            // If it's a file, print its details
            const type = isAudioOrVideo(filePath)
            if (type === 'audio' || type === 'video') {
                files.push({
                    lastModified: fileStat.mtimeMs,
                    lastModifiedDate: fileStat.mtime,
                    name: file,
                    path: filePath,
                    size: fileStat.size,
                    type: type
                })
            }
        }
    });
    return files;
}

module.exports = {
    getFiles,
    getAllFiles,
    handleGetFileMetaData
}