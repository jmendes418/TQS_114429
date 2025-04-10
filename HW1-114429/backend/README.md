# Backend

Backend da aplicação.
Com:
- Spring Boot;
- PostgreSQL.

---

## Como correr o backend

### 1. Up no docker-compose
Na raiz do projeto, dás up no **docker-compose** com o seguinte comando:

```bash
docker-compose up -d
```

Assim irá ser inicializado o container PostgreSQL com:
- **Base de Dados**: ```mealbooking```
- **Username**: ```postgres```
- **Password**: ```postgres```

A bd e os dados são iniciados a partir dos ficheiros ```schema.sql``` e ```data.sql```.
___
#### Notas:
- O backend será disponibilizado na porta ```localhost:8081``` e a PostgreSQL na porta ```localhost:5432```.

- Para garantir que o backend só inicia depois da BD estar pronta, criei o script ```wait-for.sh```.
Este script aguarda que o PostgreSQL esteja acessível antes de arrancar a totalmente com a aplicação, evitando, assim, erros de conexão no arranque.

## Testar

### Ver todos os restaurantes na bd:

Executar este comando no terminal:
```bash
curl http://localhost:8081/api/restaurants
```

### Ver as refeições por restaurante (com base no id do mesmo):
```bash
curl "http://localhost:8081/api/meals?restaurantId=1"
```
