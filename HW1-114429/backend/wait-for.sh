#!/bin/sh

echo "À espera do PostgreSQL"
while ! nc -z postgres 5432; do
  sleep 1
done

echo "PostgreSQL pronto. A iniciar a aplicação"
exec java -jar app.jar
