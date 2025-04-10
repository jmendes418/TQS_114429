# MealBooking Application

## Estrutura do Projeto
- **Backend**: Spring Boot e PostgreSQL.

- **Frontend**: React e TypeScript.

- **Base de Dados**: PostgreSQL para armazenar informações de restaurantes e refeições.

### Como executar o Projeto

Na root do projeto, executamos o comando:

```bash
docker compose up -d --build
```

Vai ser disponibilizado o **Backend** na *porta :8081* e o *PostgreSQL** na *porta :5432*.

**Script ```wait-for.sh```**:
Usamos este script para garantir que o backend só inicia depois de a BD estar pronta. Esse script aguarda a disponibilidade da base de dados antes de iniciar a app, evitando, assim, erros de conexão.

### Frontend:

O frontend está acessível:
http://localhost:3000


### Testar a API:

Para se ver todos os restaurantes, armazenados na BD, podemos executar o seguinte comando:
```curl http://localhost:8081/api/restaurants```

Para se ver todas as refeições por restaurante, armazenados na BD, devemos executar o seguinte comando:
```curl "http://localhost:8081/api/meals?restaurantId=1"```

### Swagger

A documentação de toda a API está acessível, com recurso ao Swagger, em:
http://localhost:8081/swagger-ui/index.html

De notar que o comando ```docker compose up -d --build ``` deve ser rodado previamente.


### Tecnologias Usadas
- **Backend**: Spring Boot, PostgreSQL;
- **Frontend**: React, TypeScript, Vite;
- **Base de Dados**: PostgreSQL;
- **Contêineres**: Docker, Docker Compose.


## Testes Elaborados:

### Testes Unitários e de Service Level (com Mocks):

Os *testes unitários* foram criados com **JUnit** e **Mockito** e testam toda a lógica principal do serviço das reservas ```ReservationService```.

**Cobertura efetuada pelos Testes Unitários:**
- Verificar se a reserva foi criada com sucesso;
- Verificar se a reserva foi criada num restaurante inexistente;
- Verificar se a reserva foi criada num restaurante que já tem uma reserva ativa;
- Pesquisar por uma reserva a partir de um token válido;
- Verificar se a reserva foi encontrada com sucesso;
- Verificar se o check-in foi bem sucessido;
- Verificar o insucesso ao tentar dar check-in numa reserva cancelada;
- Verificar o insucesso ao tentar dar check-in numa reserva já usada;
- Verificar o insucesso ao tentar dar check-in numa reserva inexistente.

---

### Testes de Integração (Spring Boot + MockMvn):
- Os **testes de integração**, implementados com Spring Boot Test e MockMvc, permitem simular requisições reais à API da aplicação, validando, assim, a comunicação entre o controller, service e os repositórios. De referir que é estabeleciada uma ligação a uma H2_db em memória.

**Cobertura efetuada pelos Testes de Integração:**
- Teste da criação de uma reserva válida – Verifica se uma reserva é criada com sucesso possuindo dados corretos;
- Teste para o erro ao criar uma reserva num restaurante inválido – Garante que não é possível reservar para um ID de restaurante inexistente;
- Teste para o cancelamento de um reserva com o token válido – Reserva é criada e depois cancelada com sucesso;
- Teste para o check-in de uma reserva com token válido – Verifica que é possível fazer check-in de uma reserva ativa;
- Teste para o erro de se dar check-in a uma reserva com token inválido;
- Teste para o erro ao obter reserva com token inválido.

Assim, estes testes garantem a correta integração entre os diferentes componentes da aplicação e validam a resposta da API sob diferentes cenários.

---

### Testes Funcionais (Selenium WebDriver)

Os testes funcionais foram desenvolvidos com recurso ao ```Selenium WebDriver``` e simularam o comportamento do utilizador no frontend, testando a aplicação.

---

### Testes de Desempenho (k6)

Os testes de performance foram realizados com recurso à ferramenta ```k6```, que permitiu simular múltiplos utilizadores a interagir com a API em simultâneo, medindo a capacidade da aplicação e o seu desempenho.

**Configuração utilizada:**
- 100 utilizadores virtuais (VUs) durante 5 segundos (vus: 100, duration: '5s');
- Cada iteração envia uma reserva única com:
- - Restaurante variável (1 a 3);
- - Tipo de refeição alternado (ALMOCO / JANTAR);
- - Data baseada no ID do VU e da iteração, evitando assim possíveis duplicações;
- - As requisições são enviadas em simultâneo para simular uma utilização intensiva do sistema;
- - A verificação final -> ```check(res, { 'status is 200 or 400': ... })``` garante que apenas respostas esperadas são consideradas bem-sucedidas.

**Resultados obtidos:**
- +11.000 requisições simuladas em 5 segundos;
- Taxa de sucesso:  > 98%;
- Tempo médio de resposta: < 50ms.


**Resultados obtidos após execução do Teste:**

O **teste para os Get's** é executado rodando o comando ```k6 run PerformanceGetTest.js```, no diretório dos testes - backend.

```java
█ TOTAL RESULTS 

    checks_total.......................: 7722   1514.41512/s
    checks_succeeded...................: 99.94% 7718 out of 7722
    checks_failed......................: 0.05%  4 out of 7722

    ✓ GET /restaurants - status 200
    ✗ GET /meals - status 200
      ↳  99% — ✓ 3857 / ✗ 4

    HTTP
    http_req_duration.......................................................: avg=14.91ms  min=584.43µs med=1.35ms   max=995.49ms p(90)=2.39ms   p(95)=8.05ms 
      { expected_response:true }............................................: avg=14.56ms  min=584.43µs med=1.35ms   max=995.49ms p(90)=2.38ms   p(95)=7.9ms  
    http_req_failed.........................................................: 0.05%  4 out of 7722
    http_reqs...............................................................: 7722   1514.41512/s

    EXECUTION
    iteration_duration......................................................: avg=130.68ms min=101.89ms med=103.59ms max=1.14s    p(90)=105.56ms p(95)=120.5ms
    iterations..............................................................: 3861   757.20756/s
    vus.....................................................................: 100    min=100       max=100
    vus_max.................................................................: 100    min=100       max=100

    NETWORK
    data_received...........................................................: 9.6 MB 1.9 MB/s
    data_sent...............................................................: 792 kB 155 kB/s




running (05.1s), 000/100 VUs, 3861 complete and 0 interrupted iterations
default ✓ [======================================] 100 VUs  5s

```

O **teste para os Post's** é executado rodando o comando ```k6 run PerformancePostTest.js```, no diretório dos testes - backend.


```java
 █ TOTAL RESULTS 

    checks_total.......................: 28788  2877.085125/s
    checks_succeeded...................: 81.45% 23450 out of 28788
    checks_failed......................: 18.54% 5338 out of 28788

    ✗ status (2xx/4xx)
      ↳  81% — ✓ 23450 / ✗ 5338

    HTTP
    http_req_duration......................: avg=6.6ms  min=1.92ms med=5.96ms max=36.96ms p(90)=9.29ms p(95)=10.73ms
    http_req_failed........................: 100.00% 28788 out of 28788
    http_reqs..............................: 28788   2877.085125/s

    EXECUTION
    iteration_duration.....................: avg=6.91ms min=2.11ms med=6.24ms max=37.08ms p(90)=9.69ms p(95)=11.14ms
    iterations.............................: 28788   2877.085125/s
    vus....................................: 20      min=20             max=20
    vus_max................................: 20      min=20             max=20

    NETWORK
    data_received..........................: 7.3 MB  725 kB/s
    data_sent..............................: 5.9 MB  593 kB/s




running (10.0s), 00/20 VUs, 28788 complete and 0 interrupted iterations
default ✓ [======================================] 20 VUs  10s
```

---

## Trabalho realizado por:
- Tiago Albuquerque; LEI; Nº 112901