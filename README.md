# Buddyscript

## Deploy on Server

```bash
# install docker (ubuntu)
sudo apt update -y
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER
```

```bash
git clone git@github.com:thetowsif/buddyscript.git
cd buddyscript
```

Before first deploy, edit `docker-compose.yml`:

- Change `JWT_SECRET` !
- Change MySQL passwords if you want
- Set `CLIENT_URL` to your server URL (example: `http://yourserverip:8080`)

```bash
chmod +x build_up.sh build_down.sh
./build_up.sh
```

App runs at `http://yourserverip:8080`

```bash
# stop
./build_down.sh

# view logs
docker compose logs -f
```

Site: https://buddyscript.thetowsif.xyz
Github Repo: https://github.com/thetowsif/buddyscript

---

Towsif Ibny Hassan