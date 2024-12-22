.PHONY: up
up:
	docker compose up 

.PHONY: test
test:
	docker build -t testing-library-dom . && docker run -it testing-library-dom sh -c "npm run test"