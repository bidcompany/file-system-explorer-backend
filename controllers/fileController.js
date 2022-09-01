const fs = require('fs');
const fastFolderSize = require('fast-folder-size');
const child_process = require('child_process');

exports.getList = (req, res) => {
    const path = req.query.path;
    const secret = req.query.secret;
    if(secret != process.env.S3CR3T ){
        res.status(401).json({
            status: 'fail',
            message: 'Not authorized.'
        });
    }
    var dir = "";
    if(path){
        dir = `/${path}`;
    }
    var result = [] ;
    var dirPath = `${process.env.ROOT_FOLDER}${dir}`;
    try{
        if(fs.statSync(`${dirPath}`).isDirectory()){

            fs.readdirSync(dirPath).forEach(file => {
                if(fs.statSync(`${dirPath}/${file}`).isDirectory()){
                    result.push({
                        "type": "directory", 
                        "ext" : null , 
                        "name": file});
                }else{
                    result.push({
                        "type": "file", 
                        "ext" : file.substring(file.indexOf(".") + 1 ) , 
                        "name": file
                    });
                }
            });
            res.status(200).json({
                status: 'success',
                data: { result }
            });
        }
        else{
            res.status(405).json({
                status: 'success',
                data: { "message": `${path} is not a directory` }
            });
        }
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
    
};

exports.getFile = (req, res) => {
    const file = req.query.file;
    const secret = req.query.secret;
    if(secret != process.env.S3CR3T ){
        res.status(401).json({
            status: 'fail',
            message: 'Not authorized.'
        });
    }
    try{
        if(file){
            var result = [] ;
            var filePath = `${process.env.ROOT_FOLDER}/${file}`;
            
            if (fs.existsSync(filePath)){
                console.log(filePath);
                res.status(200).download(filePath);
            }
        }else{
            res.status(404).json({
                status: 'fail',
                message: 'File not found!'
            });
        }
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }


};



exports.getFolderSize = (req, res) => {
    
    const path = req.query.path;
    const secret = req.query.secret;
    if(secret != process.env.S3CR3T ){
        res.status(401).json({
            status: 'fail',
            message: 'Not authorized.'
        });
    }
    var dir = "";
    if(path){
        dir = `/${path}`;
    }
    var result = [] ;
    var dirPath = `${process.env.ROOT_FOLDER}${dir}`;
    try{
        if(fs.statSync(`${dirPath}`).isDirectory()){
            fastFolderSize('.', (err, bytes) => {
                var size = bytes/1024/1024/1024;
                res.status(200).json({
                    status: 'success',
                    data: { "folder" : dirPath , "size (GB)" : size.toFixed(2)}
                });
              })
        }
        else{
            res.status(405).json({
                status: 'success',
                data: { "message": `${path} is not a directory` }
            });
        }
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};



exports.getCompressedFolder = (req, res) => {
    
    const path = req.query.path;
    const secret = req.query.secret;
    if(secret != process.env.S3CR3T ){
        res.status(401).json({
            status: 'fail',
            message: 'Not authorized.'
        });
    }
    var dir = "";
    if(path){
        dir = `/${path}`;
    }
    var result = [] ;
    var dirPath = `${process.env.ROOT_FOLDER}${dir}`;
    try{
        if(fs.statSync(`${dirPath}`).isDirectory()){
            fastFolderSize('.', (err, bytes) => {
                var size = bytes/1024/1024/1024;
                var folderName = thePath.substring(thePath.lastIndexOf('/') + 1)
                if(size <= 1 ){
                    child_process.execSync(`tar -zcf ../${folderName}.tar.gz .`, {
                        cwd: dirPath
                    });

                    res.status(200).download(dirPath + `/../${folderName}.tar.gz`);

                }else{
                    res.status(413).json({
                        status: 'error',
                        data: { "folder" : dirPath , "size (GB)" : size.toFixed(2) , "message" : "Folder size greater than 1GB"}
                    });
                }
              })
        }
        else{
            res.status(405).json({
                status: 'success',
                data: { "message": `${path} is not a directory` }
            });
        }
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};