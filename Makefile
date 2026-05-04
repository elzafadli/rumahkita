APP_NAME := rumah-medisata
IMAGE_NAME := rumah-medisata
TAG := latest
PORT := 3000

.PHONY: build run stop restart logs clean ps shell

build:
	docker build -t $(IMAGE_NAME):$(TAG) .

run:
	docker run -d --name $(APP_NAME) -p $(PORT):3000 $(IMAGE_NAME):$(TAG)

stop:
	-docker stop $(APP_NAME)
	-docker rm $(APP_NAME)

restart: stop run

logs:
	docker logs -f $(APP_NAME)

ps:
	docker ps --filter name=$(APP_NAME)

shell:
	docker exec -it $(APP_NAME) sh

clean: stop
	-docker rmi $(IMAGE_NAME):$(TAG)
