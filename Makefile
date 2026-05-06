.PHONY: build run stop restart logs clean ps shell

build:
	docker build -t rumah-medisata:latest /home/elzafadli/container-data/batam

run: stop
	docker run -d -it -p 10.183.62.97:8003:3000 --name rumah-medisata --restart=always rumah-medisata:latest

stop:
	-docker rm -f rumah-medisata

restart: build run

logs:
	docker logs -f rumah-medisata

ps:
	docker ps --filter name=rumah-medisata

shell:
	docker exec -it rumah-medisata sh

clean: stop
	-docker rmi rumah-medisata:latest
