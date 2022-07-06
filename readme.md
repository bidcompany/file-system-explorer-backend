
# Cargeas API Backend
###### itacsq 2022.07.06 

A backend api used for file exploration and download.

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

- /api/v1/hist/donwload?file={relative_path/filename.ext}

