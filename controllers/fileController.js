const fs = require('fs');

exports.getList = (req, res) => {
    console.log(req.query);
    const path = req.query.path;
    var dir = "";
    if(path){
        dir = `/${path}`;
    }
    var result = [] ;
    var dirPath = `${process.env.ROOT_FOLDER}${dir}`;

    if(fs.statSync(`${dirPath}`).isDirectory()){

        fs.readdirSync(dirPath).forEach(file => {
            if(fs.statSync(`${dirPath}/${file}`).isDirectory()){
                result.push({"type": "directory", "name": file});
            }else{
                result.push({"type": "file", "name": file});
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
};

exports.getFile = (req, res) => {
    console.log(req.query);
    const file = req.query.file;
    if(file){
        var result = [] ;
        var filePath = `${process.env.ROOT_FOLDER}/${file}`;
        
        if (fs.existsSync(filePath)){
            console.log(filePath);
            res.status(200).download(filePath);
        }
    }else{
        res.status(304).json({
            status: 'chevu',
            data: { }
        });
    }


};
  
