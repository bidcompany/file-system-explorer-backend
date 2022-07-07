const fs = require('fs');

exports.getList = (req, res) => {
    const path = req.query.path;
    const secret = req.query.secret;
    console.log(secret);
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
    console.log(secret);
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
  
