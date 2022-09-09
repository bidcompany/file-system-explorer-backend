
# File System Explorer Backend
###### itacsq 2022.09.09 

A backend api used for file exploration and download.

### Configuration
1. Install npm dependencies
```
npm i
```
2. Create config.env
```
NODE_ENV=development 
PORT=3000  
ROOT_FOLDER=c:/path/to/root
```
3. Launch server.js
```
nodemon server.js
```

### Usage 
**Navigate to folder**
- /api/v1/hist?path={relative_path}

Result:
```
{
    "status": "success",
    "data": {
        "result": [
            {
                "type": "directory",
                "ext": null,
                "name": ".git"
            },
            {
                "type": "file",
                "ext": "gitignore",
                "name": ".gitignore"
            },
            {
                "type": "directory",
                "ext": null,
                "name": ".vscode"
            },
            {
                "type": "file",
                "ext": "js",
                "name": "app.js"
            }, 
            ...
        ]
    }
}
```

**Download file**
- /api/v1/hist/download?file={relative_path/filename.ext}

**Check size of folder**
- /api/v1/hist/size?file={relative_path}

**Compress and download folder**
- /api/v1/hist/folder?file={relative_path}
