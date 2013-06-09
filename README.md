BGJ05
=====


for the server (multiplayer branch) you need to do something like:

(in the root folder of the repo)

```
sudo apt-get install python-pip
sudo pip install nodeenv
nodeenv venv
source venv/bin/activate
npm install socket.io
npm install socket.io-client
npm install connect
```

Then to run, do:
    make
