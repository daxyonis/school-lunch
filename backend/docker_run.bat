docker run --name school-lunch -p 3000:3000 -e PG_HOST=host.docker.internal -m "300M" --memory-swap "1G" daxyonis/school-lunch