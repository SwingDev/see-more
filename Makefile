NAME = swingdevelopment/swing-overflow-frontend
SHA1 = $(shell git rev-parse HEAD)

.PHONY: build test deploy clean

build:
	docker build -t $(NAME):$(SHA1)_$(ENV) --build-arg ENV_FILE=$(ENV_FILE) .

test:
	docker run $(DOCKER_RUN_TEST_PARAMS) $(NAME):$(SHA1)_$(ENV) echo "No tests."

clean:
	docker rm builder; exit 0
	rm -rf ./build

deploy: AWS_ACCESS_KEY_ID = $($(AWS_VAR_PREFIX)_ACCESS_KEY_ID)
deploy: AWS_SECRET_ACCESS_KEY = $($(AWS_VAR_PREFIX)_SECRET_ACCESS_KEY)
deploy: AWS_BUCKET = $($(AWS_VAR_PREFIX)_BUCKET)
deploy: AWS_CLOUDFRONT_DISTRIBUTION = $($(AWS_VAR_PREFIX)_CLOUDFRONT_DISTRIBUTION)
deploy: clean
	docker run --name builder $(NAME):$(SHA1)_$(ENV)
	docker cp builder:/app/dist ${PWD}/dist

	docker run \
		--rm \
		--volume="${PWD}/dist:/dist" \
		-e "AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID)" \
		-e "AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY)" \
		cgswong/aws:latest /bin/bash -c \
			"ls -la /dist && \
			 aws configure set preview.cloudfront true && \
			 aws s3 cp /dist s3://$(AWS_BUCKET)/ --recursive $(S3_CP_ARGS) && \
			 aws cloudfront create-invalidation --distribution-id $(AWS_CLOUDFRONT_DISTRIBUTION) --paths /index.html"

push:
	docker push $(NAME):$(SHA1)_$(ENV)
