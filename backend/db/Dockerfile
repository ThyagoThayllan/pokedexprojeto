FROM postgres:latest

ENV POSTGRES_DB usuarios
ENV POSTGRES_USER admin
ENV POSTGRES_PASSWORD admin

COPY init.sql /docker-entrypoint-initdb.d/