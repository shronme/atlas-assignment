# Docker commands
build:
	docker-compose build --no-cache

up:
	docker-compose up --build -d

down:
	docker-compose down

logs:
	docker-compose logs -f

shell:
	docker-compose exec api bash

# Database migration commands
migrate:

	docker-compose run --rm atlas-invest sh -lc "npm run prisma:generate"
	docker-compose run --rm atlas-invest sh -lc "npm run prisma:migrate"
	docker-compose down
test:
	docker compose run --rm atlas-invest sh -lc "npm ci"
	docker compose run --rm atlas-invest sh -lc "npm test"
	docker-compose down
