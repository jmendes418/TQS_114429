# Exercícios do Laboratório 3

## 3.1 Exemplo de gerenciamento de funcionários

### a) Identifique alguns exemplos que utilizam a cadeia de métodos expressivos do AssertJ.

```java
// Teste givenSetOfEmployees_whenFindAll_thenReturnAllEmployees()
assertThat(allEmployees).hasSize(3).extracting(Employee::getName).containsOnly(alex.getName(), ron.getName(), bob.getName());

// Teste givenEmployees_whenGetEmployees_thenStatus200()
assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
assertThat(response.getBody()).extracting(Employee::getName).containsExactly("bob", "alex");

// Teste whenSearchValidName_thenEmployeeShouldBeFound()
assertThat(found.getName()).isEqualTo(name);
```

### b) Identifique um exemplo em que o comportamento do repositório é simulado (evitando o uso de um banco de dados).

```java
// Teste whenPostEmployee_thenCreateEmployee
mvc.perform(post("/api/employees").contentType(MediaType.APPLICATION_JSON).content(JsonUtils.toJson(alex)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name", is("alex")));

// Teste givenManyEmployees_whenGetEmployees_thenReturnJsonArray()
mvc.perform(get("/api/employees").contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(3)))
            .andExpect(jsonPath("$[0].name", is(alex.getName())))
            .andExpect(jsonPath("$[1].name", is(john.getName())))
            .andExpect(jsonPath("$[2].name", is(bob.getName())));
```

### c) Qual é a diferença entre @Mock e @MockBean?

A anotação @Mock é um atalho para o método Mockito.mock(). Essa anotação deve ser usada apenas em uma classe de teste.

O método Mockito.mock() permite a criação de um objeto simulado que referencia uma classe ou uma interface. Esse objeto pode ser utilizado para definir valores de retorno para seus métodos e verificar se foram chamados.

A anotação @MockBean é usada para adicionar objetos simulados ao contexto da aplicação Spring. O mock substituirá qualquer bean existente do mesmo tipo no contexto da aplicação.

### d) Qual é o papel do arquivo "application-integrationtest.properties"? Em quais condições ele será utilizado?

O arquivo application-integrationtest.properties contém detalhes para configurar o armazenamento persistente:

```properties
## nota: porta alterada de 3306 --> 33060
spring.datasource.url=jdbc:mysql://localhost:33060/tqsdemo
spring.jpa.hibernate.ddl-auto=create-drop
spring.datasource.username=demo
spring.datasource.password=demo

## db
## docker run --name mysql5tqs -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=tqsdemo -e MYSQL_USER=demo -e MYSQL_PASSWORD=demo -p 33060:3306 -d mysql/mysql-server:5.7
```

Se decidirmos executar os testes de integração contra um banco de dados H2, poderíamos simplesmente alterar os valores acima.

### e) O projeto de exemplo demonstra três estratégias de teste para avaliar uma API (C, D e E) desenvolvida com Spring Boot. Quais são as principais diferenças?

As principais diferenças entre as três estratégias (C, D e E) para avaliar uma API Spring Boot estão relacionadas ao escopo do contexto da aplicação que carregam, ao nível de integração que simulam e à forma como interagem com os componentes da aplicação.

Notas:
- A estratégia C usa a anotação @WebMvcTest para testes unitários focados na camada web, simulando outros componentes;
- A estratégia D usa a anotação @SpringBootTest com @MockMvc para testes de integração que envolvem interações entre diferentes camadas da aplicação;
- A estratégia E usa a anotação @SpringBootTest com @TestRestTemplate para testes de ponta a ponta que simulam requisições e respostas HTTP reais.

