# sodacli

## Global install ⚙️

### Envirment requirement

NodeJS: >= 8.0

OS: MacOS, windows, centos

### install

```bash
$ npm install soda-bo-cli -g  / yarn global add soda-bo-cli
```

### Create a project 
```bash
$ sbc init
```

### new Page 
```bash
$ sbc new <pageName>  # sbc new User or sbc new User/Login
```


### push to git 

```bash
$ sbc push
```

### Select an executable command

```bash
$ sbc run
```

### Start a static service

```bash
$ sbc server

# -p, --port      set my prot
# -s, --silent    don't open browser
# -d, --dir       run dir. current as default
# -l, --log       print url log
# -f, --fallback  Enable history fallback
# -h, --help      output usage information

```

### Select npm/yarn mirror

```bash
$ sbc origin ls  # view all canuse mirror

$ sbc origin use # choose mirror
```
